"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CalendarCheck, Check, Copy, Droplets, ImagePlus, RotateCcw, SendHorizontal, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { contact } from "@/lib/content";

/**
 * The Leak Doctor: an AI chat in the bottom corner of every page. Send a photo
 * of a leak, damp wall or crack (or describe it) and Gemini, given RPC's own
 * product list, answers with a diagnosis card: what the photo shows, the leak
 * path from source to stain, severity and urgency, the method, a repair plan
 * with RPC's products step by step, DIY or professional, and what to check
 * next; then one tap asks for today's rates or books a free inspection on
 * WhatsApp. English or Tamil. Photo checks are limited per visitor per day
 * (see lib/leakbot/limits.ts); photos are shrunk in the browser and not stored.
 */

const HIDE = ["/studio"];
const MAX_PHOTOS = 3;
/** the longest side a photo is shrunk to before it is sent */
const PHOTO_SIDE = 1024;
const SAVE_KEY = "leakbot:v1";
const ease = [0.22, 1, 0.36, 1] as const;

type Lang = "en" | "ta";

interface Card {
  slug: string;
  brand: string;
  name: string;
  category: string;
  packs: string[];
  href: string;
}
interface Diagnosis {
  relevant: boolean;
  problem?: string;
  zone?: string;
  severity?: number;
  urgency?: "now" | "soon" | "monitor";
  confidence?: "low" | "medium" | "high";
  seeing?: string[];
  cause?: string;
  leakPath?: string[];
  method?: { key: string; name: string; href: string } | null;
  system?: { key: string; name: string; href: string } | null;
  steps?: { title: string; detail: string; products: Card[] }[];
  diy?: "diy" | "pro" | "either";
  diyNote?: string;
  checks?: string[];
  rateHref?: string | null;
}
interface Quota {
  photosLeft: number;
  photosMax: number;
  messagesLeft: number;
  messagesMax: number;
  resetsAt: string;
}
interface Msg {
  id: string;
  role: "user" | "model";
  text: string;
  /** object URLs of the photos sent with it (this visit only) */
  photos?: string[];
  photoCount?: number;
  diagnosis?: Diagnosis | null;
  suggestions?: string[];
  error?: boolean;
}
interface Pending {
  url: string;
  mimeType: string;
  data: string;
}

/* ------------------------------------------------------------- words */

const T = {
  en: {
    launcher: "Leak Doctor",
    launcherSub: "AI photo check",
    launcherCta: "Check my leak",
    launcherAsk: "Leak?",
    launcherGo: "Tap",
    launcherHint: "Ask AI about a leak",
    subtitle: "AI photo check by RPC Constructions",
    welcome: "Send a photo of the leak, damp patch or crack. I'll tell you what's causing it, how serious it is, and which products fix it, step by step.",
    upload: "Take or upload a photo",
    uploadHint: "Up to 3 photos. A close-up and a wide shot work best.",
    starters: ["My terrace leaks when it rains", "Bathroom water seeps into the next room", "Damp wall with peeling paint", "Water tank or sump is leaking"],
    placeholder: "Describe the problem…",
    photosLeft: (n: number, m: number) => `${n} of ${m} photo checks left today`,
    noPhotos: "No photo checks left today. Resets at midnight.",
    analysing: ["Looking at your photo…", "Tracing where the water comes from…", "Choosing the right products…"],
    thinking: ["Thinking…", "Tracing the leak…", "Choosing the right products…"],
    see: "What I see",
    path: "Leak path",
    cause: "Likely cause",
    plan: "Repair plan",
    checks: "Check next",
    severity: "Severity",
    urgency: { now: "Fix now, before the rains", soon: "Fix in the next few weeks", monitor: "Keep an eye on it" },
    confidence: { low: "Low confidence", medium: "Medium confidence", high: "High confidence" },
    diy: { diy: "You can do this yourself", pro: "Needs a professional", either: "DIY or professional" },
    method: "Method",
    system: "Full system",
    rates: "Today's rates on WhatsApp",
    inspect: "Book a free site inspection",
    copy: "Copy report",
    copied: "Copied",
    newChat: "New chat",
    close: "Close",
    send: "Send",
    addPhoto: "Add photos",
    remove: "Remove photo",
    tooMany: "Up to 3 photos at a time.",
    unreadable: "Couldn't read that photo. Try a JPEG or PNG.",
    offline: "Couldn't reach the Leak Doctor. Check your connection and try again.",
    whatsapp: "WhatsApp us",
    disclaimer: "AI guidance from photos. Confirm on site before buying. Photos are not stored.",
    drop: "Drop photos here",
    lang: "தமிழ்",
  },
  ta: {
    launcher: "கசிவு டாக்டர்",
    launcherSub: "AI புகைப்பட ஆய்வு",
    launcherCta: "கசிவைச் சரிபார்க்க",
    launcherAsk: "கசிவா?",
    launcherGo: "தொடவும்",
    launcherHint: "கசிவு பற்றி AI-யிடம் கேளுங்கள்",
    subtitle: "RPC கன்ஸ்ட்ரக்ஷன்ஸ் AI புகைப்பட ஆய்வு",
    welcome: "கசிவு, ஈரம் அல்லது விரிசலின் புகைப்படத்தை அனுப்புங்கள். அதற்கான காரணம், அது எவ்வளவு தீவிரமானது, எந்தப் பொருட்கள் படிப்படியாகச் சரிசெய்யும் என்பதைச் சொல்கிறேன்.",
    upload: "புகைப்படம் எடுக்கவும் அல்லது பதிவேற்றவும்",
    uploadHint: "ஒரே நேரத்தில் 3 புகைப்படங்கள் வரை. அருகிலும் தூரத்திலும் எடுத்தால் சிறந்தது.",
    starters: ["மழை பெய்யும்போது மொட்டை மாடி கசிகிறது", "குளியலறை நீர் பக்கத்து அறைக்குள் கசிகிறது", "சுவரில் ஈரம், பெயிண்ட் உரிகிறது", "தண்ணீர் தொட்டி அல்லது சம்ப் கசிகிறது"],
    placeholder: "பிரச்சனையை விவரிக்கவும்…",
    photosLeft: (n: number, m: number) => `இன்று ${m}-இல் ${n} புகைப்பட ஆய்வுகள் மீதம்`,
    noPhotos: "இன்று புகைப்பட ஆய்வுகள் மீதமில்லை. நள்ளிரவில் புதுப்பிக்கப்படும்.",
    analysing: ["உங்கள் புகைப்படத்தைப் பார்க்கிறேன்…", "நீர் எங்கிருந்து வருகிறது என்று கண்டறிகிறேன்…", "சரியான பொருட்களைத் தேர்வு செய்கிறேன்…"],
    thinking: ["யோசிக்கிறேன்…", "கசிவைக் கண்டறிகிறேன்…", "சரியான பொருட்களைத் தேர்வு செய்கிறேன்…"],
    see: "நான் பார்ப்பது",
    path: "கசிவு பாதை",
    cause: "சாத்தியமான காரணம்",
    plan: "சரிசெய்யும் திட்டம்",
    checks: "அடுத்து சரிபார்க்க",
    severity: "தீவிரம்",
    urgency: { now: "மழைக்கு முன் இப்போதே சரிசெய்யவும்", soon: "சில வாரங்களுக்குள் சரிசெய்யவும்", monitor: "கவனித்து வாருங்கள்" },
    confidence: { low: "நம்பகத்தன்மை: குறைவு", medium: "நம்பகத்தன்மை: நடுத்தரம்", high: "நம்பகத்தன்மை: அதிகம்" },
    diy: { diy: "நீங்களே செய்யலாம்", pro: "நிபுணர் தேவை", either: "நீங்களோ நிபுணரோ செய்யலாம்" },
    method: "முறை",
    system: "முழு அமைப்பு",
    rates: "இன்றைய விலை WhatsApp-இல்",
    inspect: "இலவச தள ஆய்வை பதிவு செய்யுங்கள்",
    copy: "அறிக்கையை நகலெடு",
    copied: "நகலெடுக்கப்பட்டது",
    newChat: "புதிய உரையாடல்",
    close: "மூடு",
    send: "அனுப்பு",
    addPhoto: "புகைப்படம் சேர்",
    remove: "புகைப்படத்தை நீக்கு",
    tooMany: "ஒரே நேரத்தில் 3 புகைப்படங்கள் மட்டும்.",
    unreadable: "அந்தப் புகைப்படத்தைப் படிக்க முடியவில்லை. JPEG அல்லது PNG முயற்சிக்கவும்.",
    offline: "இணைக்க முடியவில்லை. இணைய இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.",
    whatsapp: "WhatsApp-இல் தொடர்புகொள்ளுங்கள்",
    disclaimer: "புகைப்படங்களிலிருந்து AI வழிகாட்டல். வாங்குவதற்கு முன் தளத்தில் உறுதிசெய்யவும். புகைப்படங்கள் சேமிக்கப்படுவதில்லை.",
    drop: "புகைப்படங்களை இங்கே விடுங்கள்",
    lang: "English",
  },
};

/* ------------------------------------------------------------- helpers */

const uid = () => Math.random().toString(36).slice(2, 10);

/** shrink a photo to PHOTO_SIDE on its longest side, as JPEG; HEIC the browser cannot open goes as it is */
async function shrink(file: File): Promise<Pending> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((ok, fail) => {
      const i = new Image();
      i.onload = () => ok(i);
      i.onerror = fail;
      i.src = url;
    });
    const k = Math.min(1, PHOTO_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement("canvas");
    c.width = Math.round(img.naturalWidth * k);
    c.height = Math.round(img.naturalHeight * k);
    c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
    return { url, mimeType: "image/jpeg", data: c.toDataURL("image/jpeg", 0.82).split(",")[1]! };
  } catch {
    if (!/^image\/(hei[cf]|jpe?g|png|webp)$/.test(file.type) || file.size > 4 * 1024 * 1024) {
      URL.revokeObjectURL(url);
      throw new Error("unreadable");
    }
    const data = await new Promise<string>((ok, fail) => {
      const r = new FileReader();
      r.onload = () => ok(String(r.result).split(",")[1] ?? "");
      r.onerror = fail;
      r.readAsDataURL(file);
    });
    return { url, mimeType: file.type, data };
  }
}

/** a diagnosis as plain text: for the model's memory of the chat, the copied report and the inspection message */
function diagnosisText(d: Diagnosis) {
  if (!d.relevant) return "";
  const lines = [
    `Problem: ${d.problem} (${d.zone}), severity ${d.severity}/5, urgency: ${d.urgency}`,
    d.seeing?.length ? `Seen: ${d.seeing.join("; ")}` : "",
    `Cause: ${d.cause}`,
    d.leakPath?.length ? `Leak path: ${d.leakPath.join(" -> ")}` : "",
    d.method ? `Method: ${d.method.name}` : "",
    ...(d.steps ?? []).map((s, i) => `${i + 1}. ${s.title}: ${s.detail}${s.products.length ? ` [${s.products.map((p) => `${p.brand} ${p.name}`).join(", ")}]` : ""}`),
    d.diyNote ? `DIY or pro: ${d.diy}. ${d.diyNote}` : "",
    d.checks?.length ? `Check next: ${d.checks.join("; ")}` : "",
  ];
  return lines.filter(Boolean).join("\n");
}

const inspectHref = (d: Diagnosis) =>
  `${contact.whatsapp}?text=${encodeURIComponent(
    `Hello RPC Constructions, I'd like a free site inspection.\n\nThe Leak Doctor on your website found:\n${diagnosisText(d)}\n\nMy location: `,
  )}`;

/** what the model is sent of the chat so far (text only; photos are not sent again) */
const historyOf = (msgs: Msg[]) =>
  msgs
    .filter((m) => !m.error)
    .map((m) => ({
      role: m.role,
      text:
        m.role === "user"
          ? `${m.photoCount ? `[sent ${m.photoCount} photo${m.photoCount > 1 ? "s" : ""}] ` : ""}${m.text}`
          : `${m.text}${m.diagnosis?.relevant ? `\n[Diagnosis given]\n${diagnosisText(m.diagnosis)}` : ""}`,
    }))
    .filter((t) => t.text.trim());

/* ------------------------------------------------------------- styles */

const CSS = `
/* the launcher: a round navy button in the bottom right corner, a cream ring round it, water rising and falling inside */
.lb-launch{position:fixed;right:max(29px,calc(env(safe-area-inset-right) + 15px));bottom:max(44px,calc(env(safe-area-inset-bottom) + 40px));z-index:60;display:grid;place-items:center;width:68px;height:68px;padding:0;border:0;border-radius:50%;overflow:hidden;background:#0b2350;color:#fff;cursor:pointer;
  box-shadow:0 0 0 4px #f5f0e6,0 0 0 5.5px #0b6e80,0 16px 30px -12px rgba(4,12,30,.8);transition:transform .4s var(--ease-film),box-shadow .4s,opacity .3s}
.lb-launch:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 0 0 4px #fff,0 0 0 5.5px #0b6e80,0 22px 36px -12px rgba(4,12,30,.85)}
.lb-launch:active{transform:scale(.96)}
.lb-launch[data-hidden="1"]{opacity:0;pointer-events:none;transform:translateY(12px)}
.lb-lv{position:absolute;left:-12%;right:-12%;bottom:0;height:42%;border-radius:42% 46% 0 0;background:#1d8aa0;animation:lb-lv 3.4s ease-in-out infinite}
.lb-lv::before{content:"";position:absolute;inset:0;border-radius:inherit;background:#4fb4c7;opacity:.45;transform:translateX(18%);animation:lb-lv2 2.6s ease-in-out infinite}
@keyframes lb-lv{50%{height:56%;border-radius:46% 40% 0 0}}
@keyframes lb-lv2{50%{transform:translateX(-14%)}}
.lb-lt{position:relative;display:flex;flex-direction:column;align-items:center;font-size:11.5px;font-weight:700;line-height:1.1;letter-spacing:.04em;text-transform:uppercase;text-shadow:0 1px 2px rgba(4,12,30,.4)}
@media (prefers-reduced-motion:reduce){.lb-lv,.lb-lv::before{animation:none}}
.lb-face{position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;margin-top:-6px}
/* a soft green ring keeps spreading out from the button, so it is noticed */
.lb-launch:not([data-hidden]){animation:lb-call 2.4s ease-out infinite}
@keyframes lb-call{0%{box-shadow:0 0 0 4px #f5f0e6,0 0 0 5.5px #0b6e80,0 0 0 5.5px rgba(47,181,122,.7),0 16px 30px -12px rgba(4,12,30,.8)}80%,100%{box-shadow:0 0 0 4px #f5f0e6,0 0 0 5.5px #0b6e80,0 0 0 22px rgba(47,181,122,0),0 16px 30px -12px rgba(4,12,30,.8)}}
.lb-eyes{display:flex;gap:10px;animation:lb-look 6s ease-in-out infinite}
.lb-eye{display:block;width:8px;height:12px;border-radius:4px;background:#fff;transform-origin:50% 50%;animation:lb-blink 3.4s infinite}
.lb-smile{display:block;width:16px;height:7px;border:2.5px solid #fff;border-top:0;border-radius:0 0 10px 10px}
@keyframes lb-blink{0%,88%,100%{transform:scaleY(1)}92%{transform:scaleY(.12)}96%{transform:scaleY(1)}}
@keyframes lb-look{0%,35%,100%{transform:translateX(0)}42%,55%{transform:translateX(-3px)}62%,75%{transform:translateX(3px)}}
.lb-hint{position:fixed;right:calc(max(29px,calc(env(safe-area-inset-right) + 15px)) + 68px + 14px);bottom:calc(max(44px,calc(env(safe-area-inset-bottom) + 40px)) + 34px);z-index:60;display:inline-flex;align-items:center;gap:8px;padding:9px 14px;border-radius:999px;background:#fff;color:#0b2350;font-size:13.5px;font-weight:600;line-height:1;white-space:nowrap;cursor:pointer;box-shadow:0 0 0 1px rgba(11,35,80,.1),0 14px 28px -14px rgba(4,12,30,.55);transform:translateY(50%);animation:lb-hint-in .5s 1.2s cubic-bezier(.2,.8,.2,1) both,lb-hint-bob 3.2s 2s ease-in-out infinite;transition:opacity .3s}
.lb-hint::after{content:"";position:absolute;right:-5px;top:50%;width:10px;height:10px;margin-top:-5px;background:#fff;transform:rotate(45deg);box-shadow:1px -1px 0 0 rgba(11,35,80,.06)}
.lb-hint-dot{width:8px;height:8px;border-radius:50%;background:#2fb57a;box-shadow:0 0 0 3px rgba(47,181,122,.2)}
.lb-hint[data-hidden="1"]{opacity:0 !important;visibility:hidden;pointer-events:none;animation:none}
@keyframes lb-hint-in{from{opacity:0;transform:translate(10px,50%)}to{opacity:1;transform:translate(0,50%)}}
@keyframes lb-hint-bob{0%,100%{transform:translate(0,50%)}50%{transform:translate(-4px,50%)}}
@media (max-width:599px){.lb-hint{font-size:12px;padding:8px 11px;animation:lb-hint-in .5s 1.2s cubic-bezier(.2,.8,.2,1) both,lb-hint-out .4s 9s forwards}}
@keyframes lb-hint-out{to{opacity:0;visibility:hidden;transform:translate(10px,50%)}}
@media (prefers-reduced-motion:reduce){.lb-eye,.lb-eyes,.lb-launch,.lb-hint{animation:none !important}}
.lb-drop{position:relative;display:grid;place-items:center;width:40px;height:40px;border-radius:999px;background:#0b6e80}
.lb-drop::after{content:"";position:absolute;inset:-3px;border-radius:999px;border:2px solid #4fc3d4;opacity:0;animation:lb-ring 2.8s ease-out infinite}
@keyframes lb-ring{0%{opacity:.8;transform:scale(.9)}70%,100%{opacity:0;transform:scale(1.35)}}

.lb-panel{position:fixed;right:var(--gutter,16px);bottom:max(16px,env(safe-area-inset-bottom));z-index:61;display:flex;flex-direction:column;width:min(420px,calc(100vw - 32px));height:min(720px,calc(100dvh - 32px));
  overflow:hidden;border-radius:22px;background:#f5f0e6;color:#12223b;box-shadow:0 40px 80px -30px rgba(4,12,30,.7),0 0 0 1px rgba(18,34,59,.12)}
@media (max-width:520px){.lb-panel{inset:0;width:100%;height:100dvh;border-radius:0}}
.lb-head{display:flex;align-items:center;gap:10px;padding:14px 12px 14px 16px;color:#fff;background:linear-gradient(180deg,#13316c,#0b2350)}
.lb-head .lb-drop{width:36px;height:36px;flex:none}
.lb-ht{flex:1;min-width:0;line-height:1.15}.lb-ht b{display:block;font-size:16px;font-weight:600}.lb-ht small{display:block;font-size:11.5px;opacity:.7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lb-hb{display:grid;place-items:center;min-width:34px;height:34px;padding:0 8px;border-radius:999px;color:#fff;background:rgba(255,255,255,.1);font-size:12.5px;cursor:pointer}
.lb-hb:hover{background:rgba(255,255,255,.2)}
.lb-quota{display:flex;align-items:center;gap:8px;padding:8px 16px;font-size:12px;color:#5e6472;background:#ece6da;border-bottom:1px solid rgba(18,34,59,.08)}
.lb-dots{display:flex;gap:3px}.lb-dots i{width:7px;height:7px;border-radius:99px;background:#0b6e80}.lb-dots i[data-used="1"]{background:#d3c8b5}
.lb-body{position:relative;flex:1;overflow-y:auto;overscroll-behavior:contain;padding:16px 14px 8px;display:flex;flex-direction:column;gap:12px}
.lb-row{display:flex}.lb-row[data-role="user"]{justify-content:flex-end}
.lb-bub{max-width:88%;padding:10px 13px;border-radius:16px;font-size:14.5px;line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere}
.lb-row[data-role="user"] .lb-bub{background:#2756a0;color:#fff;border-bottom-right-radius:5px}
.lb-row[data-role="model"] .lb-bub{background:#fff;border-bottom-left-radius:5px;box-shadow:0 1px 0 rgba(18,34,59,.08)}
.lb-bub[data-error="1"]{background:#fbeee6!important;color:#7a2e12}
.lb-thumbs{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;margin-bottom:6px}
.lb-thumbs img{width:72px;height:72px;object-fit:cover;border-radius:10px}
.lb-intro{display:flex;flex-direction:column;gap:12px}
.lb-big{display:flex;align-items:center;gap:12px;padding:16px;border:1.5px dashed #0b6e80;border-radius:16px;background:rgba(11,110,128,.06);color:#0b2350;text-align:left;cursor:pointer}
.lb-big:hover{background:rgba(11,110,128,.12)}
.lb-big .lb-drop{flex:none;width:44px;height:44px}
.lb-big b{display:block;font-weight:600;font-size:15px}.lb-big small{font-size:12.5px;color:#5e6472}
.lb-chips{display:flex;flex-wrap:wrap;gap:6px}
.lb-chip{padding:7px 12px;border-radius:999px;border:1px solid rgba(39,86,160,.35);color:#2756a0;background:#fff;font-size:13px;text-align:left;cursor:pointer}
.lb-chip:hover{background:#2756a0;color:#fff}
.lb-scan{position:relative;width:150px;height:110px;border-radius:12px;overflow:hidden;background:#0b2350}
.lb-scan img{width:100%;height:100%;object-fit:cover;opacity:.75}
.lb-scan::after{content:"";position:absolute;left:0;right:0;height:38%;background:linear-gradient(180deg,transparent,rgba(79,195,212,.55) 85%,#4fc3d4);animation:lb-scan 1.6s ease-in-out infinite alternate}
@keyframes lb-scan{from{top:-38%}to{top:100%}}
.lb-wait{display:flex;flex-direction:column;gap:8px;font-size:13px;color:#5e6472}
.lb-typing{display:inline-flex;gap:4px;padding:12px 14px;background:#fff;border-radius:16px}
.lb-typing i{width:7px;height:7px;border-radius:9px;background:#0b6e80;animation:lb-bob 1s infinite}
.lb-typing i:nth-child(2){animation-delay:.15s}.lb-typing i:nth-child(3){animation-delay:.3s}
@keyframes lb-bob{0%,60%,100%{transform:none;opacity:.5}30%{transform:translateY(-4px);opacity:1}}

.lb-dx{width:100%;border-radius:18px;background:#fff;overflow:hidden;box-shadow:0 1px 0 rgba(18,34,59,.08),0 0 0 1px rgba(18,34,59,.06)}
.lb-dxh{padding:14px 14px 12px;background:linear-gradient(180deg,#0b2350,#13316c);color:#fff}
.lb-dxh h4{margin:0;font-size:16.5px;font-weight:600;line-height:1.25}
.lb-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.lb-tag{padding:3px 9px;border-radius:999px;font-size:11.5px;background:rgba(255,255,255,.14)}
.lb-sev{display:flex;align-items:center;gap:10px;margin-top:12px;font-size:12px}
.lb-bar{display:flex;gap:3px;flex:none}.lb-bar i{width:20px;height:6px;border-radius:9px;background:rgba(255,255,255,.18)}
.lb-urg{margin-left:auto;padding:3px 9px;border-radius:999px;font-weight:600;font-size:11.5px}
.lb-sec{padding:12px 14px;border-top:1px solid rgba(18,34,59,.07);font-size:13.5px;line-height:1.45}
.lb-sec h5{margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#0b6e80}
.lb-sec ul{margin:0;padding-left:18px;list-style:disc}.lb-sec li+li{margin-top:3px}
.lb-sec ul.lb-path{list-style:none;padding:0;position:relative}
.lb-path li{position:relative;padding-left:24px;min-height:22px}
.lb-path li::before{content:"";position:absolute;left:4px;top:3px;width:10px;height:13px;background:#0b6e80;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;transform:rotate(180deg)}
.lb-path li:not(:last-child)::after{content:"";position:absolute;left:8.5px;top:18px;bottom:-5px;border-left:2px dotted #4fc3d4}
.lb-path li:last-child::before{background:#ad5531}
.lb-links{display:flex;flex-wrap:wrap;gap:6px}
.lb-link{display:inline-flex;align-items:center;gap:4px;padding:5px 10px;border-radius:999px;background:#ece6da;color:#0b2350;font-size:12.5px;text-decoration:none}
.lb-link:hover{background:#d3c8b5}
.lb-steps{list-style:none;margin:0;padding:0;counter-reset:s}
.lb-steps>li{counter-increment:s;position:relative;padding-left:30px}.lb-steps>li+li{margin-top:12px}
.lb-steps>li::before{content:counter(s);position:absolute;left:0;top:0;width:21px;height:21px;border-radius:99px;background:#2756a0;color:#fff;font-size:11.5px;font-weight:600;display:grid;place-items:center}
.lb-steps b{font-weight:600}
.lb-prods{display:grid;gap:6px;margin-top:7px}
.lb-prod{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:12px;background:#f5f0e6;color:inherit;text-decoration:none}
.lb-prod:hover{background:#ece6da}
.lb-brand{flex:none;min-width:52px;padding:3px 6px;border-radius:6px;background:#0b2350;color:#fff;font-size:10.5px;font-weight:600;text-align:center;letter-spacing:.03em}
.lb-pn{flex:1;min-width:0;line-height:1.25}.lb-pn b{display:block;font-size:13px}.lb-pn small{font-size:11.5px;color:#5e6472}
.lb-diy{display:flex;gap:8px;align-items:flex-start}
.lb-diy span{flex:none;padding:3px 9px;border-radius:999px;font-size:11.5px;font-weight:600}
.lb-acts{display:grid;gap:8px;padding:12px 14px 14px;border-top:1px solid rgba(18,34,59,.07)}
.lb-act{display:flex;align-items:center;justify-content:center;gap:8px;height:42px;border-radius:999px;font-size:13.5px;font-weight:600;text-decoration:none;cursor:pointer}
.lb-act--wa{background:#1f8f4e;color:#fff}.lb-act--in{background:#0b2350;color:#fff}.lb-act--cp{background:#ece6da;color:#0b2350}
.lb-act:hover{filter:brightness(1.08)}
.lb-sugs{display:flex;flex-wrap:wrap;gap:6px;margin-top:2px}

.lb-foot{padding:8px 10px calc(10px + env(safe-area-inset-bottom));background:#fff;border-top:1px solid rgba(18,34,59,.08)}
.lb-pend{display:flex;gap:6px;padding:2px 2px 8px}
.lb-pend div{position:relative}.lb-pend img{width:52px;height:52px;object-fit:cover;border-radius:9px}
.lb-pend button{position:absolute;top:-6px;right:-6px;display:grid;place-items:center;width:20px;height:20px;border-radius:99px;background:#12223b;color:#fff;cursor:pointer}
.lb-comp{display:flex;align-items:flex-end;gap:6px}
.lb-ib{display:grid;place-items:center;flex:none;width:42px;height:42px;border-radius:999px;color:#0b2350;background:#ece6da;cursor:pointer}
.lb-ib:disabled{opacity:.4;cursor:not-allowed}
.lb-ib--send{background:#2756a0;color:#fff}
.lb-ta{flex:1;min-height:42px;max-height:120px;padding:10px 14px;border-radius:21px;border:1px solid rgba(18,34,59,.15);background:#f5f0e6;font:inherit;font-size:14.5px;line-height:1.4;resize:none;color:#12223b}
.lb-ta:focus{outline:2px solid #2756a0;outline-offset:1px}
.lb-note{margin:6px 4px 0;font-size:10.5px;color:#5e6472;text-align:center}
.lb-dropzone{position:absolute;inset:0;z-index:2;display:grid;place-items:center;background:rgba(11,35,80,.85);color:#fff;font-size:16px;font-weight:600;border:3px dashed #4fc3d4;border-radius:inherit;pointer-events:none}
.lb-panel button:focus-visible,.lb-panel a:focus-visible,.lb-launch:focus-visible{outline:2px solid #e8a215;outline-offset:2px}
@media (prefers-reduced-motion:reduce){.lb-drop::after,.lb-scan::after,.lb-typing i{animation:none}}
`;

const SEV = ["#3f9b5a", "#8fb43a", "#e8a215", "#e0672a", "#c4321f"];
const URG = { now: ["#c4321f", "#fff"], soon: ["#e8a215", "#12223b"], monitor: ["#3f9b5a", "#fff"] } as const;
const DIY = { diy: ["#e3f1e7", "#245c35"], either: ["#fbf0d4", "#6b4c05"], pro: ["#e6ecf7", "#0b2350"] } as const;

/* ------------------------------------------------------------- pieces */

function DiagnosisCard({ d, t }: { d: Diagnosis; t: (typeof T)[Lang] }) {
  const [copied, setCopied] = useState(false);
  const sev = d.severity ?? 1;
  const urg = URG[d.urgency ?? "soon"];
  const diy = DIY[d.diy ?? "either"];
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`RPC Constructions · Leak Doctor report\n\n${diagnosisText(d)}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* the clipboard can be blocked; nothing to do */
    }
  };
  return (
    <div className="lb-dx">
      <div className="lb-dxh">
        <h4>{d.problem}</h4>
        <div className="lb-tags">
          {d.confidence && <span className="lb-tag">{t.confidence[d.confidence]}</span>}
          {d.method && <span className="lb-tag">{d.method.name}</span>}
        </div>
        <div className="lb-sev">
          <span>{t.severity}</span>
          <span className="lb-bar" role="img" aria-label={`${t.severity} ${sev}/5`}>
            {SEV.map((c, i) => (
              <i key={c} style={i < sev ? { background: SEV[sev - 1] } : undefined} />
            ))}
          </span>
          {d.urgency && (
            <span className="lb-urg" style={{ background: urg[0], color: urg[1] }}>
              {t.urgency[d.urgency]}
            </span>
          )}
        </div>
      </div>

      {!!d.seeing?.length && (
        <div className="lb-sec">
          <h5>{t.see}</h5>
          <ul>{d.seeing.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
      )}
      {!!d.leakPath?.length && (
        <div className="lb-sec">
          <h5>{t.path}</h5>
          <ul className="lb-path">{d.leakPath.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
      )}
      {d.cause && (
        <div className="lb-sec">
          <h5>{t.cause}</h5>
          {d.cause}
        </div>
      )}
      {!!d.steps?.length && (
        <div className="lb-sec">
          <h5>{t.plan}</h5>
          <ol className="lb-steps">
            {d.steps.map((s) => (
              <li key={s.title}>
                <b>{s.title}</b>
                <div>{s.detail}</div>
                {!!s.products.length && (
                  <div className="lb-prods">
                    {s.products.map((p) => (
                      <a key={p.slug} className="lb-prod" href={p.href}>
                        <span className="lb-brand">{p.brand}</span>
                        <span className="lb-pn">
                          <b>{p.name}</b>
                          <small>
                            {p.category} · {p.packs.join(" / ")}
                          </small>
                        </span>
                        <ArrowUpRight size={15} aria-hidden />
                      </a>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>
          {(d.method || d.system) && (
            <div className="lb-links" style={{ marginTop: 12 }}>
              {d.method && (
                <a className="lb-link" href={d.method.href}>
                  {t.method}: {d.method.name} <ArrowUpRight size={13} aria-hidden />
                </a>
              )}
              {d.system && (
                <a className="lb-link" href={d.system.href}>
                  {t.system}: {d.system.name} <ArrowUpRight size={13} aria-hidden />
                </a>
              )}
            </div>
          )}
        </div>
      )}
      {d.diy && (
        <div className="lb-sec lb-diy">
          <span style={{ background: diy[0], color: diy[1] }}>{t.diy[d.diy]}</span>
          <div>{d.diyNote}</div>
        </div>
      )}
      {!!d.checks?.length && (
        <div className="lb-sec">
          <h5>{t.checks}</h5>
          <ul>{d.checks.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
      )}
      <div className="lb-acts">
        {d.rateHref && (
          <a className="lb-act lb-act--wa" href={d.rateHref} target="_blank" rel="noopener noreferrer">
            {t.rates}
          </a>
        )}
        <a className="lb-act lb-act--in" href={inspectHref(d)} target="_blank" rel="noopener noreferrer">
          <CalendarCheck size={16} aria-hidden /> {t.inspect}
        </a>
        <button type="button" className="lb-act lb-act--cp" onClick={copy}>
          {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />} {copied ? t.copied : t.copy}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- the chat */

export function LeakBot() {
  const pathname = usePathname() ?? "/";
  const hidden = HIDE.some((h) => pathname === h || pathname.startsWith(`${h}/`));
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [pending, setPending] = useState<Pending[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState<null | { photo?: string }>(null);
  /** which of the waiting lines is showing */
  const [stage, setStage] = useState(0);
  const [quota, setQuota] = useState<Quota | null>(null);
  const [dragging, setDragging] = useState(false);
  const [rateList, setRateList] = useState(false);
  const body = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const file = useRef<HTMLInputElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const t = T[lang];

  // the chat and language come back within the visit (photos do not)
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(SAVE_KEY) || "null") as { msgs?: Msg[]; lang?: Lang } | null;
      if (saved?.msgs) setMsgs(saved.msgs);
      const l = localStorage.getItem("leakbot:lang");
      if (l === "ta" || l === "en") setLang(l);
    } catch {
      /* storage can be blocked */
    }
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem(SAVE_KEY, JSON.stringify({ msgs: msgs.map(({ photos: _p, ...m }) => m) }));
    } catch {
      /* storage can be blocked or full */
    }
  }, [msgs]);

  // the products page's rate list uses the foot of the screen while it has products in it
  useEffect(() => {
    const el = document.documentElement;
    const check = () => setRateList(el.dataset.ratelist === "1");
    check();
    const mo = new MutationObserver(check);
    mo.observe(el, { attributes: true, attributeFilter: ["data-ratelist"] });
    return () => mo.disconnect();
  }, []);

  // the helper steps out of the way once the footer comes into view
  const [atFoot, setAtFoot] = useState(false);
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const f = document.querySelector("footer[data-site-footer]");
      // out of the way at the foot of the page and under any open menu or box
      const inZone = window.innerWidth < 768 && [...document.querySelectorAll("[data-lb-zone]")].some((z) => {
        const r = z.getBoundingClientRect();
        return r.top < window.innerHeight - 60 && r.bottom > 80;
      });
      const covered = inZone || !!document.querySelector("#mobile-menu, .wpx-pop:not([hidden]), .pv[open], .bc-list:not([hidden]), [data-lb-hide]");
      setAtFoot(covered || (!!f && f.getBoundingClientRect().top < window.innerHeight - 40));
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    queue();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    const poll = setInterval(queue, 400);
    return () => {
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      clearInterval(poll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    if (!quota) fetch("/api/leakbot").then((r) => r.json()).then((j: { quota?: Quota }) => j.quota && setQuota(j.quota)).catch(() => {});
    input.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        launcher.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, quota]);

  // keep the newest message in view; a new diagnosis is shown from its top
  useEffect(() => {
    const el = body.current;
    const newest = msgs[msgs.length - 1];
    if (!el) return;
    if (!busy && newest?.diagnosis?.relevant) {
      const row = el.querySelector<HTMLElement>(`[data-msg="${newest.id}"]`);
      if (row) {
        el.scrollTo({ top: row.offsetTop - 12, behavior: "smooth" });
        return;
      }
    }
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [msgs, busy]);

  // while waiting, say what is happening, a step at a time
  useEffect(() => {
    setStage(0);
    if (!busy) return;
    const id = setInterval(() => setStage((n) => Math.min(n + 1, 2)), 2600);
    return () => clearInterval(id);
  }, [busy]);

  const say = (role: Msg["role"], m: Omit<Msg, "id" | "role">) => setMsgs((list) => [...list, { id: uid(), role, ...m }]);

  const addFiles = useCallback(
    async (files: FileList | File[]) => {
      const images = [...files].filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name));
      if (!images.length) return;
      const room = MAX_PHOTOS - pending.length;
      if (images.length > room) say("model", { text: t.tooMany, error: true });
      const out: Pending[] = [];
      for (const f of images.slice(0, Math.max(0, room))) {
        try {
          out.push(await shrink(f));
        } catch {
          say("model", { text: t.unreadable, error: true });
        }
      }
      setPending((p) => [...p, ...out].slice(0, MAX_PHOTOS));
      input.current?.focus();
    },
    [pending.length, t],
  );

  const send = async (override?: string) => {
    const message = (override ?? text).trim();
    if (busy || (!message && !pending.length)) return;
    const photos = override ? [] : pending;
    const history = historyOf(msgs);
    say("user", { text: message, photos: photos.map((p) => p.url), photoCount: photos.length });
    setText("");
    setPending([]);
    setBusy({ photo: photos[0]?.url });
    try {
      const res = await fetch("/api/leakbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history, lang, photos: photos.map(({ mimeType, data }) => ({ mimeType, data })) }),
      });
      const j = (await res.json()) as { reply?: string; diagnosis?: Diagnosis | null; suggestions?: string[]; quota?: Quota; error?: string };
      if (j.quota) setQuota(j.quota);
      if (!res.ok || j.error) say("model", { text: j.error || t.offline, error: true });
      else say("model", { text: j.reply ?? "", diagnosis: j.diagnosis ?? null, suggestions: j.suggestions ?? [] });
    } catch {
      say("model", { text: t.offline, error: true });
    } finally {
      setBusy(null);
    }
  };

  const reset = () => {
    setMsgs([]);
    setPending([]);
    setText("");
  };
  const switchLang = () => {
    const l = lang === "en" ? "ta" : "en";
    setLang(l);
    try {
      localStorage.setItem("leakbot:lang", l);
    } catch {
      /* storage can be blocked */
    }
  };

  if (hidden) return null;
  const noPhotosLeft = quota ? quota.photosLeft - pending.length <= 0 : false;
  const last = msgs[msgs.length - 1];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <button
        ref={launcher}
        type="button"
        className="lb-launch"
        data-hidden={open || rateList || atFoot ? "1" : undefined}
        tabIndex={atFoot && !open ? -1 : undefined}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={t.launcherCta}
        onClick={() => setOpen(true)}
      >
        <span className="lb-lv" aria-hidden />
        <span className="lb-face" aria-hidden>
          <span className="lb-eyes">
            <i className="lb-eye" />
            <i className="lb-eye" />
          </span>
          <b className="lb-smile" />
        </span>
      </button>
      {/* the label beside the button, so it is plain that this is an AI helper */}
      <span className="lb-hint" aria-hidden data-hidden={open || rateList || atFoot ? "1" : undefined} onClick={() => setOpen(true)}>
        <i className="lb-hint-dot" />
        {t.launcherHint}
      </span>

      <AnimatePresence>
        {open && (
          <motion.div
            className="lb-panel"
            role="dialog"
            aria-modal="false"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.35, ease }}
            style={{ transformOrigin: "bottom right" }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={(e) => {
              if (e.currentTarget === e.target) setDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              void addFiles(e.dataTransfer.files);
            }}
          >
            {dragging && <div className="lb-dropzone">{t.drop}</div>}
            <div className="lb-head">
              <span className="lb-drop">
                <Droplets size={18} aria-hidden />
              </span>
              <div className="lb-ht">
                <b id={titleId}>{t.launcher}</b>
                <small>{t.subtitle}</small>
              </div>
              <button type="button" className="lb-hb" onClick={switchLang} lang={lang === "en" ? "ta" : "en"}>
                {t.lang}
              </button>
              {!!msgs.length && (
                <button type="button" className="lb-hb" onClick={reset} aria-label={t.newChat} title={t.newChat}>
                  <RotateCcw size={16} aria-hidden />
                </button>
              )}
              <button type="button" className="lb-hb" onClick={() => setOpen(false)} aria-label={t.close}>
                <X size={18} aria-hidden />
              </button>
            </div>

            {quota && (
              <div className="lb-quota" aria-live="polite">
                <span className="lb-dots" aria-hidden>
                  {Array.from({ length: quota.photosMax }, (_, i) => (
                    <i key={i} data-used={i >= quota.photosLeft ? "1" : undefined} />
                  ))}
                </span>
                {quota.photosLeft ? t.photosLeft(quota.photosLeft, quota.photosMax) : t.noPhotos}
              </div>
            )}

            <div ref={body} className="lb-body" data-lenis-prevent aria-live="polite">
              <div className="lb-row" data-role="model">
                <div className="lb-bub">{t.welcome}</div>
              </div>
              {!msgs.length && (
                <div className="lb-intro">
                  <button type="button" className="lb-big" onClick={() => file.current?.click()} disabled={noPhotosLeft}>
                    <span className="lb-drop" style={{ color: "#fff" }}>
                      <ImagePlus size={20} aria-hidden />
                    </span>
                    <span>
                      <b>{t.upload}</b>
                      <small>{t.uploadHint}</small>
                    </span>
                  </button>
                  <div className="lb-chips">
                    {t.starters.map((s) => (
                      <button key={s} type="button" className="lb-chip" onClick={() => void send(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {msgs.map((m) => (
                <div key={m.id} className="lb-row" data-role={m.role} data-msg={m.id}>
                  {m.role === "user" ? (
                    <div style={{ maxWidth: "88%" }}>
                      {!!m.photos?.length && (
                        <div className="lb-thumbs">
                          {m.photos.map((u) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img key={u} src={u} alt="" />
                          ))}
                        </div>
                      )}
                      {m.text && (
                        <div className="lb-bub" style={{ maxWidth: "100%", marginLeft: "auto", width: "fit-content" }}>
                          {m.text}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
                      {m.text && (
                        <div className="lb-bub" data-error={m.error ? "1" : undefined}>
                          {m.text}
                          {m.error && (
                            <>
                              {" "}
                              <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, color: "inherit" }}>
                                {t.whatsapp} →
                              </a>
                            </>
                          )}
                        </div>
                      )}
                      {m.diagnosis?.relevant && <DiagnosisCard d={m.diagnosis} t={t} />}
                      {m === last && !!m.suggestions?.length && !busy && (
                        <div className="lb-sugs">
                          {m.suggestions.map((s) => (
                            <button key={s} type="button" className="lb-chip" onClick={() => void send(s)}>
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {busy && (
                <div className="lb-row" data-role="model">
                  {busy.photo ? (
                    <div className="lb-wait">
                      <div className="lb-scan">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={busy.photo} alt="" />
                      </div>
                      {t.analysing[stage]}
                    </div>
                  ) : (
                    <div className="lb-wait">
                      <div className="lb-typing" aria-hidden>
                        <i />
                        <i />
                        <i />
                      </div>
                      {t.thinking[stage]}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="lb-foot">
              {!!pending.length && (
                <div className="lb-pend">
                  {pending.map((p) => (
                    <div key={p.url}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.url} alt="" />
                      <button type="button" aria-label={t.remove} onClick={() => setPending((list) => list.filter((x) => x !== p))}>
                        <X size={12} aria-hidden />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <form
                className="lb-comp"
                onSubmit={(e) => {
                  e.preventDefault();
                  void send();
                }}
              >
                <input
                  ref={file}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => {
                    if (e.target.files) void addFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
                <button
                  type="button"
                  className="lb-ib"
                  aria-label={t.addPhoto}
                  title={noPhotosLeft ? t.noPhotos : t.addPhoto}
                  disabled={noPhotosLeft || pending.length >= MAX_PHOTOS}
                  onClick={() => file.current?.click()}
                >
                  <ImagePlus size={19} aria-hidden />
                </button>
                <textarea
                  ref={input}
                  className="lb-ta"
                  rows={1}
                  value={text}
                  maxLength={1500}
                  placeholder={t.placeholder}
                  aria-label={t.placeholder}
                  onChange={(e) => setText(e.target.value)}
                  onPaste={(e) => {
                    if (e.clipboardData.files.length) {
                      e.preventDefault();
                      void addFiles(e.clipboardData.files);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      void send();
                    }
                  }}
                />
                <button type="submit" className="lb-ib lb-ib--send" aria-label={t.send} disabled={!!busy || (!text.trim() && !pending.length)}>
                  <SendHorizontal size={18} aria-hidden />
                </button>
              </form>
              <p className="lb-note">{t.disclaimer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
