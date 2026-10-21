/**
 * The Leak Doctor chat. GET: today's allowance for this visitor. POST: one
 * message (text and up to MAX_PHOTOS photos) with the conversation so far;
 * answers with the reply, the diagnosis (products checked against RPC's list
 * and filled in), quick replies and the allowance left. Photos are passed to
 * Gemini and not stored.
 */
import { contact } from "@/lib/content";
import { GeminiError, ask, type Photo, type Turn } from "@/lib/leakbot/gemini";
import { methodInfo, productCard, systemPrompt, type ProductCard } from "@/lib/leakbot/knowledge";
import { readQuota, refund, spend, visitorIp } from "@/lib/leakbot/limits";
import { SYSTEMS, productBySlug, rateLink } from "@/lib/products";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_PHOTOS = 3;
/** per photo, after the browser has shrunk it */
const MAX_PHOTO_BYTES = 4 * 1024 * 1024;
const MAX_TEXT = 1500;
const MAX_HISTORY = 12;
const TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);

const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

export async function GET(req: Request) {
  return json({ quota: await readQuota(visitorIp(req)) });
}

interface Body {
  message?: unknown;
  history?: unknown;
  photos?: unknown;
  lang?: unknown;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return json({ error: "Could not read that message." }, 400);
  }

  const lang = body.lang === "ta" ? "ta" : "en";
  const message = typeof body.message === "string" ? body.message.trim().slice(0, MAX_TEXT) : "";
  const history: Turn[] = (Array.isArray(body.history) ? body.history : [])
    .filter((t): t is Turn => !!t && (t.role === "user" || t.role === "model") && typeof t.text === "string" && !!t.text)
    .slice(-MAX_HISTORY)
    .map((t) => ({ role: t.role, text: t.text.slice(0, 4000) }));
  const photos: Photo[] = (Array.isArray(body.photos) ? body.photos : [])
    .filter((p): p is Photo => !!p && typeof p.mimeType === "string" && typeof p.data === "string")
    .map((p) => ({ mimeType: p.mimeType.toLowerCase(), data: p.data.replace(/^data:[^,]*,/, "") }));

  if (!message && !photos.length) return json({ error: "Type a message or add a photo." }, 400);
  if (photos.length > MAX_PHOTOS) return json({ error: `Up to ${MAX_PHOTOS} photos at a time.` }, 400);
  for (const p of photos) {
    if (!TYPES.has(p.mimeType)) return json({ error: "Photos must be JPEG, PNG, WebP or HEIC." }, 400);
    if ((p.data.length * 3) / 4 > MAX_PHOTO_BYTES) return json({ error: "One of the photos is too large." }, 400);
  }

  const ip = visitorIp(req);
  const took = await spend(ip, photos.length);
  if (!took.ok) {
    const error =
      took.reason === "photos"
        ? `You've used today's ${took.quota.photosMax} photo checks. Send a message without photos, or WhatsApp us the photos for a free review.`
        : "You've reached today's message limit. Please WhatsApp or call us, and we'll help straight away.";
    return json({ error, limit: took.reason, quota: took.quota, whatsapp: contact.whatsapp }, 429);
  }

  try {
    const answer = await ask(systemPrompt(lang), history, message, photos);
    const d = answer.diagnosis;
    if (!d || !d.relevant) return json({ reply: answer.reply, suggestions: answer.suggestions, diagnosis: d && { relevant: false }, quota: took.quota });

    // products only from RPC's list, each once, at most three a step
    const seen = new Set<string>();
    const steps = d.steps.map((s) => ({
      title: s.title,
      detail: s.detail,
      products: s.products
        .filter((slug) => productBySlug(slug) && !seen.has(slug) && seen.add(slug))
        .slice(0, 3)
        .map(productCard)
        .filter((c): c is ProductCard => !!c),
    }));
    const all = [...seen].map((s) => productBySlug(s)!);
    const system = SYSTEMS.find((s) => s.key === d.system);

    return json({
      reply: answer.reply,
      suggestions: answer.suggestions,
      quota: took.quota,
      diagnosis: {
        ...d,
        severity: Math.min(5, Math.max(1, Math.round(d.severity) || 1)),
        steps,
        method: methodInfo(d.method),
        system: system ? { key: system.key, name: system.name, href: `/products#job-${system.key}` } : null,
        rateHref: all.length ? rateLink(contact.whatsapp, all) : null,
      },
    });
  } catch (e) {
    const quota = await refund(ip, photos.length);
    const kind = e instanceof GeminiError ? e.kind : "bad";
    console.error("[leakbot]", e);
    const error = {
      busy: "The Leak Doctor is busy right now. Please try again in a minute.",
      blocked: "Sorry, I can't help with that one. Try a different photo or question.",
      config: "The Leak Doctor isn't available right now. Please WhatsApp or call us.",
      bad: "Something went wrong reading that. Please try again.",
    }[kind];
    return json({ error, quota, whatsapp: contact.whatsapp }, kind === "busy" ? 503 : 500);
  }
}
