/**
 * One call to Gemini's generateContent (REST, no SDK), answering in a fixed
 * JSON shape so the chat can draw the diagnosis as a card.
 *
 * Speed: the fastest model goes first, with thinking turned down (the answer is
 * mostly looking things up in RPC's list, not reasoning at length). A model that
 * is overloaded or out of quota (429/5xx) or slow hands over to the next at
 * once, and sits out for a minute so the next visitors do not wait on it. The
 * whole answer has a deadline.
 */
import { METHOD_KEYS, PRODUCT_SLUGS, SYSTEM_KEYS, ZONES } from "./knowledge";

/** tried in this order (fastest first); GEMINI_MODEL, if set, goes first */
const MODELS = [
  ...new Set(
    [process.env.GEMINI_MODEL, "gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"].filter(
      (m): m is string => !!m,
    ),
  ),
];
/** the longest a visitor waits for an answer, and for any one model */
const DEADLINE = 30_000;
const PER_MODEL = 20_000;
/** how long an overloaded model sits out */
const COOL_OFF = 60_000;
const API = "https://generativelanguage.googleapis.com/v1beta/models";

export interface Turn {
  role: "user" | "model";
  text: string;
}
export interface Photo {
  mimeType: string;
  /** base64, without the data: prefix */
  data: string;
}

export interface Step {
  title: string;
  detail: string;
  products: string[];
}
export interface Diagnosis {
  relevant: boolean;
  problem: string;
  zone: (typeof ZONES)[number];
  severity: number;
  urgency: "now" | "soon" | "monitor";
  confidence: "low" | "medium" | "high";
  seeing: string[];
  cause: string;
  leakPath: string[];
  method: string;
  system: string;
  steps: Step[];
  diy: "diy" | "pro" | "either";
  diyNote: string;
  checks: string[];
}
export interface Answer {
  reply: string;
  suggestions: string[];
  diagnosis: Diagnosis | null;
}

const str = { type: "STRING" };
const list = (items: object) => ({ type: "ARRAY", items });
const oneOf = (values: readonly string[]) => ({ type: "STRING", enum: [...values] });

const SCHEMA = {
  type: "OBJECT",
  properties: {
    reply: str,
    suggestions: list(str),
    diagnosis: {
      type: "OBJECT",
      nullable: true,
      properties: {
        relevant: { type: "BOOLEAN" },
        problem: { ...str, description: "the problem in a few words, e.g. 'Seepage through the terrace slab'" },
        zone: oneOf(ZONES),
        severity: { type: "INTEGER", minimum: 1, maximum: 5 },
        urgency: oneOf(["now", "soon", "monitor"]),
        confidence: oneOf(["low", "medium", "high"]),
        seeing: { ...list(str), description: "what is visible in the photos and what each sign means" },
        cause: str,
        leakPath: { ...list(str), description: "2 to 4 short steps, from where the water starts to where it shows" },
        method: { ...oneOf([...METHOD_KEYS, "none"]), description: "the waterproofing method that fits best" },
        system: { ...oneOf([...SYSTEM_KEYS, "none"]), description: "the job system that matches, if any" },
        steps: list({
          type: "OBJECT",
          properties: { title: str, detail: str, products: list(oneOf(PRODUCT_SLUGS)) },
          required: ["title", "detail", "products"],
          propertyOrdering: ["title", "detail", "products"],
        }),
        diy: oneOf(["diy", "pro", "either"]),
        diyNote: str,
        checks: { ...list(str), description: "what to check or photograph next, or what an inspector would check" },
      },
      required: ["relevant", "problem", "zone", "severity", "urgency", "confidence", "seeing", "cause", "leakPath", "method", "system", "steps", "diy", "diyNote", "checks"],
      propertyOrdering: ["relevant", "seeing", "problem", "zone", "cause", "leakPath", "severity", "urgency", "confidence", "method", "system", "steps", "diy", "diyNote", "checks"],
    },
  },
  required: ["reply", "suggestions", "diagnosis"],
  propertyOrdering: ["diagnosis", "reply", "suggestions"],
};

export class GeminiError extends Error {
  constructor(
    message: string,
    /** "busy": rate limited or overloaded; "blocked": safety; "config": key or model; "bad": unreadable answer */
    public kind: "busy" | "blocked" | "config" | "bad",
  ) {
    super(message);
  }
}

let working: string | undefined;
/** when each overloaded model may be tried first again */
const resting = new Map<string, number>();
/** the lowest thinking level each model accepts (minimal, else low, else its default) */
const THINKING = ["minimal", "low", null] as const;
const thinkingOf = new Map<string, number>();

export async function ask(system: string, history: Turn[], text: string, photos: Photo[]): Promise<Answer> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new GeminiError("GEMINI_API_KEY is not set", "config");

  const request = (thinking: string | null) => JSON.stringify({
    systemInstruction: { parts: [{ text: system }] },
    contents: [
      ...history.map((t) => ({ role: t.role, parts: [{ text: t.text }] })),
      {
        role: "user",
        parts: [...photos.map((p) => ({ inlineData: { mimeType: p.mimeType, data: p.data } })), { text: text || "Please look at these photos." }],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: SCHEMA,
      temperature: 0.4,
      ...(thinking ? { thinkingConfig: { thinkingLevel: thinking } } : {}),
    },
  });

  // the model that last worked first, then the rest; any that are resting go last
  const now = Date.now();
  const ready = (m: string) => (resting.get(m) ?? 0) <= now;
  const all = [...new Set([...(working ? [working] : []), ...MODELS])];
  const order = [...all.filter(ready), ...all.filter((m) => !ready(m))];
  const stop = now + DEADLINE;
  let busy = false;

  for (const model of order) {
    while (Date.now() < stop - 1500) {
      const level = thinkingOf.get(model) ?? 0;
      let res: Response;
      try {
        res = await fetch(`${API}/${model}:generateContent`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": key },
          body: request(THINKING[level]!),
          cache: "no-store",
          signal: AbortSignal.timeout(Math.min(PER_MODEL, stop - Date.now())),
        });
      } catch {
        // too slow (or the network dropped): the next model
        busy = true;
        resting.set(model, Date.now() + COOL_OFF);
        console.warn(`[leakbot] ${model} timed out, trying the next model`);
        break;
      }
      if (res.status === 404) break;
      if (res.status === 429 || res.status >= 500) {
        busy = true;
        resting.set(model, Date.now() + COOL_OFF);
        console.warn(`[leakbot] ${model} answered ${res.status}, trying the next model`);
        break;
      }
      if (res.status === 400) {
        const msg = await res.text();
        // this model does not take that thinking level: the next level up, same model
        if (/thinking/i.test(msg) && level < THINKING.length - 1) {
          thinkingOf.set(model, level + 1);
          continue;
        }
        throw new GeminiError(`Gemini 400 from ${model}: ${msg.slice(0, 300)}`, "config");
      }
      if (!res.ok) throw new GeminiError(`Gemini ${res.status} from ${model}: ${(await res.text()).slice(0, 300)}`, "config");
      working = model;
      resting.delete(model);
      return parse(await res.json());
    }
    if (Date.now() >= stop - 1500) break;
  }
  if (busy) throw new GeminiError("every model is busy", "busy");
  throw new GeminiError(`none of ${order.join(", ")} is available to this key; set GEMINI_MODEL`, "config");
}

interface Raw {
  promptFeedback?: { blockReason?: string };
  candidates?: { finishReason?: string; content?: { parts?: { text?: string; thought?: boolean }[] } }[];
}

function parse(raw: Raw): Answer {
  if (raw.promptFeedback?.blockReason) throw new GeminiError(raw.promptFeedback.blockReason, "blocked");
  const c = raw.candidates?.[0];
  if (c?.finishReason === "SAFETY") throw new GeminiError("SAFETY", "blocked");
  const text = (c?.content?.parts ?? []).filter((p) => !p.thought && p.text).map((p) => p.text).join("");
  try {
    const a = JSON.parse(text) as Answer;
    if (typeof a.reply !== "string") throw new Error("no reply");
    return { reply: a.reply, suggestions: Array.isArray(a.suggestions) ? a.suggestions.slice(0, 3) : [], diagnosis: a.diagnosis ?? null };
  } catch {
    throw new GeminiError(`unreadable answer: ${text.slice(0, 200)}`, "bad");
  }
}
