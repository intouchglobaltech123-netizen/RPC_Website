/**
 * The comparison both pages are built around: two things side by side with a
 * seam down the middle. Whatever the two share moves into the seam; whatever
 * is only true of one stays on its side. A row where both say the same thing
 * closes up into one line across the seam, so the differences are what is
 * left standing out.
 *
 *   stage   (night blue)  A's picker | swap | B's picker
 *                         A's picture | B's picture   (one picture when both are the same job)
 *                         a one-line verdict
 *   sheet   (paper)       rows: A | label (and what both share) | B
 *
 * Plain functions returning HTML strings, used by the server to render the
 * page and by the browser to redraw it when a side changes.
 */
import { filmPoster, filmSrc, mediaReady, mediaSrc, mediaSrcSmall } from "../media/catalog";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ------------------------------------------------------------------ rows */

export type SeamRow =
  /** plain text on each side (already escaped); one line across when both are the same */
  | { t: "text"; k: string; a: string; b: string }
  /** lists: what both share sits in the seam, the rest on each side */
  | { t: "venn"; k: string; a: readonly string[]; b: readonly string[]; noteA?: string; noteB?: string; empty?: string }
  /** ready-made cells (already escaped); `same` replaces both when given */
  | { t: "html"; k: string; a: string; b: string; same?: string; mid?: string };

const chips = (xs: readonly string[], cls: string) => `<ul class="cx-chips ${cls}">${xs.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;

export function seamRow(r: SeamRow): string {
  if (r.t === "text") {
    if (r.a === r.b)
      return `<div class="cx-row is-same"><div class="cx-k"><p class="cx-kl">${esc(r.k)}</p></div><div class="cx-same"><p><span class="cx-sm" aria-hidden="true"></span><span class="sr-only">Both: </span>${r.a}</p></div></div>`;
    return `<div class="cx-row"><div class="cx-k"><p class="cx-kl">${esc(r.k)}</p></div><div class="cx-a"><p>${r.a}</p></div><div class="cx-b"><p>${r.b}</p></div></div>`;
  }
  if (r.t === "html") {
    if (r.same) return `<div class="cx-row is-same"><div class="cx-k"><p class="cx-kl">${esc(r.k)}</p></div><div class="cx-same">${r.same}</div></div>`;
    return `<div class="cx-row${r.mid ? " cx-row--venn" : ""}"><div class="cx-k"><p class="cx-kl">${esc(r.k)}</p>${r.mid ?? ""}</div><div class="cx-a">${r.a}</div><div class="cx-b">${r.b}</div></div>`;
  }
  const both = r.a.filter((x) => r.b.includes(x));
  const onlyA = r.a.filter((x) => !r.b.includes(x));
  const onlyB = r.b.filter((x) => !r.a.includes(x));
  const side = (xs: readonly string[], who: "A" | "B", note?: string) =>
    xs.length
      ? `<p class="cx-vh">Only ${who}</p>${chips(xs, `cx-chips--${who.toLowerCase()}`)}`
      : note
        ? `<p class="cx-note">${esc(note)}</p>`
        : `<p class="cx-vh">Only ${who}</p><p class="cx-none">Nothing else listed</p>`;
  if (!onlyA.length && !onlyB.length)
    return `<div class="cx-row is-same"><div class="cx-k"><p class="cx-kl">${esc(r.k)}</p></div><div class="cx-same">${both.length ? `${chips(both, "cx-chips--both")}` : `<p class="cx-none">${esc(r.noteA ?? r.empty ?? "Nothing listed")}</p>`}</div></div>`;
  const mid = both.length
    ? `<p class="cx-vh cx-vh--both">Both</p>${chips(both, "cx-chips--both")}`
    : `<p class="cx-none">${esc(r.empty ?? "Nothing in common")}</p>`;
  return `<div class="cx-row cx-row--venn"><div class="cx-k"><p class="cx-kl">${esc(r.k)}</p>${mid}</div><div class="cx-a">${side(onlyA, "A", r.noteA)}</div><div class="cx-b">${side(onlyB, "B", r.noteB)}</div></div>`;
}
export const seamRows = (rows: readonly SeamRow[]) => rows.map(seamRow).join("");

/* --------------------------------------------------------------- pictures */

/**
 * A picture of a kind of product (or a method) going on: the film when there
 * is one (it plays while on screen), otherwise the still. Labelled as made
 * with AI; nothing sits over its lower right corner.
 */
export function seamFigure(key: string | null | undefined, opts: { sizes: string; fallback: string; icon?: string }): string {
  const m = mediaReady(key);
  if (!m || !key)
    return `<figure class="cx-fig is-empty"><div class="cx-frame cx-frame--empty">${opts.icon ?? ""}<p>${esc(opts.fallback)}</p></div>${key ? "" : `<figcaption><span>No picture for this one</span></figcaption>`}</figure>`;
  const cap = `<figcaption><span>${esc(m.label)}</span><span class="cx-ai">${m.film ? "AI film" : "AI picture"}</span></figcaption>`;
  if (m.film)
    return `<figure class="cx-fig" data-media="${esc(key)}"><div class="cx-frame" style="aspect-ratio:16/9"><video class="cx-film" muted loop playsinline preload="none" poster="${filmPoster(key)}" aria-label="${esc(m.alt)}" data-src="${filmSrc(key)}"></video><button type="button" class="cx-play" aria-label="Play the film" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg></button></div>${cap}</figure>`;
  return `<figure class="cx-fig" data-media="${esc(key)}"><div class="cx-frame" style="aspect-ratio:${m.w}/${m.h}"><img src="${mediaSrc(key)}" srcset="${mediaSrcSmall(key)} 640w, ${mediaSrc(key)} 1280w" sizes="${esc(opts.sizes)}" width="${m.w}" height="${m.h}" alt="${esc(m.alt)}" loading="lazy" decoding="async"></div>${cap}</figure>`;
}

/** the pictures row: two pictures, or one across the seam when both sides show the same job */
export function seamMedia(a: { key: string | null; fallback: string; icon?: string }, b: { key: string | null; fallback: string; icon?: string }, sameLine: string): string {
  const sizes = "(min-width: 1100px) 520px, (min-width: 700px) 44vw, 46vw";
  // no pictures on either side yet: no picture row at all, so the stage stays tidy
  if (!mediaReady(a.key) && !mediaReady(b.key)) return "";
  if (a.key && a.key === b.key && mediaReady(a.key))
    return `<div class="cx-media is-same" data-same="true">${seamFigure(a.key, { sizes, fallback: a.fallback, icon: a.icon })}${sameLine ? `<p class="cx-sameline">${esc(sameLine)}</p>` : ""}</div>`;
  return `<div class="cx-media" data-same="false"><div class="cx-ma">${seamFigure(a.key, { sizes, fallback: a.fallback, icon: a.icon })}</div><div class="cx-mb">${seamFigure(b.key, { sizes, fallback: b.fallback, icon: b.icon })}</div></div>`;
}

/* ---------------------------------------------------------------- stage */

export interface SeamSide {
  /** the line above the name (a brand, or the method's family) */
  kicker: string;
  name: string;
  /** under the name: the kind of product, or where a method is used */
  sub: string;
}
/** what a picker shows (the select itself is laid over it, so it opens natively everywhere) */
export const seamPreview = (s: SeamSide) =>
  `<span class="cx-kick">${esc(s.kicker)}</span><span class="cx-nm">${esc(s.name)}</span>`;

export const chevron = `<svg class="cx-chev" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6.5 8 10.5l4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
export const swapIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7.5h11.5M15 4l3.5 3.5L15 11M17 16.5H5.5M9 13l-3.5 3.5L9 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/** one side's head: the A or B mark, the picker, and the line under it */
export function seamHead(side: "a" | "b", s: SeamSide, select: string, label: string) {
  return `<div class="cx-head cx-head--${side}">
  <span class="cx-ab" aria-hidden="true">${side.toUpperCase()}</span>
  <div class="cx-pick">
    <div class="cx-pv" data-pv="${side}" aria-hidden="true">${seamPreview(s)}</div>
    <select class="cx-sel" data-side="${side}" aria-label="${esc(label)}">${select}</select>
    ${chevron}
  </div>
  <p class="cx-sub" data-sub="${side}">${esc(s.sub)}</p>
</div>`;
}

export const seamVerdict = (lead: string, more: string) => `<p class="cx-lead">${esc(lead)}</p>${more ? `<p class="cx-more">${esc(more)}</p>` : ""}`;

/* ------------------------------------------------------------------ CSS */

export const SEAM_CSS = `
.cx{--spine:clamp(3.25rem,22vw,19rem);--ca:#3cc5d6;--cb:#f0b43c;--ca-ink:#0b6e80;--cb-ink:#9a6a06;position:relative;border-radius:1.75rem;background:var(--card,#fbfcfd);box-shadow:0 1px 0 rgba(16,26,34,.06),0 40px 90px -60px rgba(11,29,43,.55);isolation:isolate}
.cx p,.cx figure{margin:0}
.cx-stage{position:relative;display:grid;grid-template-columns:minmax(0,1fr) var(--spine) minmax(0,1fr);align-items:start;padding:clamp(1.1rem,2.2vw,1.9rem) clamp(.9rem,2.4vw,2rem) clamp(1.2rem,2vw,1.7rem);background:radial-gradient(120% 90% at 50% 0%,#12324a 0%,#0b1d2b 62%);color:#fff;border-radius:1.75rem 1.75rem 0 0}
.cx-sheet::before,.cx-media:not(.is-same)::before{content:"";position:absolute;left:50%;width:1px;transform:translateX(-.5px);pointer-events:none}
.cx-head{min-width:0;display:grid;grid-template-columns:auto minmax(0,1fr);grid-template-areas:"ab pick" ". sub";column-gap:.75rem;align-items:start}
.cx-head--b{grid-template-columns:minmax(0,1fr) auto;grid-template-areas:"pick ab" "sub ."}
.cx-ab{grid-area:ab;display:grid;place-items:center;width:2rem;height:2rem;border-radius:50%;font-weight:600;color:#0b1d2b;background:var(--ca);margin-top:.15rem}
.cx-head--b .cx-ab{background:var(--cb)}
.cx-pick{grid-area:pick;position:relative;justify-self:start;display:inline-flex;align-items:flex-end;gap:.7rem;max-width:100%;min-width:0;margin:-.3rem -.6rem;padding:.3rem .6rem;border-radius:.9rem;transition:background-color .2s ease}
.cx-head--b .cx-pick{justify-self:end;text-align:right}
.cx-pick:hover{background:rgba(255,255,255,.05)}
.cx-pick:focus-within{outline:2px solid var(--ca);outline-offset:3px}
.cx-head--b .cx-pick:focus-within{outline-color:var(--cb)}
.cx-pv{display:flex;flex-direction:column;gap:.1rem;min-width:0}
.cx-kick{color:#9fb6c6}
.cx-nm{font-size:var(--fs-sub);line-height:1.25;font-weight:500;letter-spacing:-.005em;overflow-wrap:anywhere}
.cx-sel{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;font-size:var(--fs-body,1rem);appearance:none;border:0}
.cx-chev{flex:none;width:1.1rem;height:1.1rem;margin-bottom:.3rem;color:#9fb6c6;pointer-events:none}
.cx-sub{grid-area:sub;margin-top:.45rem;color:#9fb6c6;line-height:1.45}
.cx-head--b .cx-sub{text-align:right}
.cx-mid{display:flex;justify-content:center;padding-top:.4rem}
.cx-swap{display:grid;place-items:center;width:3rem;height:3rem;border-radius:50%;border:1px solid rgba(255,255,255,.22);background:#0b1d2b;color:#fff;cursor:pointer;transition:transform .35s cubic-bezier(.2,.7,.2,1),border-color .2s ease,background-color .2s ease}
.cx-swap svg{width:1.3rem;height:1.3rem}
.cx-swap:hover{border-color:rgba(255,255,255,.5);background:#12324a}
.cx-swap:focus-visible{outline:2px solid #fff;outline-offset:3px}
.cx-swap.is-turning{transform:rotate(180deg)}
.cx-mediawrap{grid-column:1/-1;min-width:0}
.cx-media{position:relative;display:grid;grid-template-columns:minmax(0,1fr) var(--spine) minmax(0,1fr);margin-top:clamp(1rem,2vw,1.5rem)}
.cx-ma{grid-column:1}
.cx-mb{grid-column:3}
.cx-media.is-same{grid-template-columns:minmax(0,1fr);justify-items:center}
.cx-media.is-same .cx-fig{width:min(100%,calc((100% - var(--spine)) / 2))}
.cx-sameline{margin-top:.6rem;color:#9fb6c6;text-align:center}
.cx-fig{margin:0;min-width:0}
.cx-frame{position:relative;overflow:hidden;border-radius:1.1rem;background:#12293a}
.cx-frame img,.cx-frame video{position:absolute;inset:0;width:100%;height:100%;display:block}
.cx-frame--empty{aspect-ratio:16/9;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.6rem;padding:1rem;text-align:center;color:#9fb6c6;background:repeating-linear-gradient(135deg,#102738 0 12px,#0f2433 12px 24px)}
.cx-frame--empty svg{width:3.5rem;height:3.5rem;color:#5d7d92}
.cx-play{position:absolute;left:.75rem;top:.75rem;display:grid;place-items:center;width:2.75rem;height:2.75rem;border-radius:50%;border:0;background:rgba(11,29,43,.72);color:#fff;cursor:pointer}
.cx-play svg{width:1.2rem;height:1.2rem}
.cx-fig figcaption{display:flex;justify-content:space-between;gap:.75rem;margin-top:.55rem;color:#c9d6df;line-height:1.4}
.cx-ai{flex:none;color:#7f99ab}
.cx-verdict{grid-column:1/-1;max-width:46rem;margin:clamp(1rem,2vw,1.5rem) auto 0;text-align:center}
.cx-lead{font-size:var(--fs-sub);line-height:1.35;font-weight:500}
.cx-more{margin-top:.3rem;color:#9fb6c6}
.cx-sheet{position:relative;padding:.4rem clamp(.9rem,2.4vw,2rem) .6rem}
.cx-sheet::before{top:0;bottom:0;background:rgba(16,26,34,.1)}
.cx-media:not(.is-same)::before{top:8%;bottom:20%;background:rgba(255,255,255,.14)}
.cx-row{position:relative;display:grid;grid-template-columns:minmax(0,1fr) var(--spine) minmax(0,1fr);grid-template-areas:"a k b";align-items:start;padding:1.05rem 0;border-top:1px solid rgba(16,26,34,.08)}
.cx-row:first-child{border-top:0}
.cx-k{grid-area:k;position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:.45rem;padding:0 .6rem;text-align:center}
.cx-kl{color:var(--mute,#5f6d78);font-weight:500;background:var(--card,#fbfcfd);padding:0 .35rem}
.cx-a{grid-area:a;min-width:0;text-align:right;padding-right:.4rem}
.cx-b{grid-area:b;min-width:0;padding-left:.4rem}
.cx-a p,.cx-b p,.cx-same p{line-height:1.5}
.cx-row.is-same{grid-template-areas:"k k k" "s s s"}
.cx-same{grid-area:s;display:flex;justify-content:center;text-align:center;margin-top:.35rem}
.cx-same p{max-width:40rem;padding:0 .7rem;background:var(--card,#fbfcfd)}
.cx-same .cx-chips{margin-top:0;justify-content:center;padding:0 .7rem;background:var(--card,#fbfcfd)}
.cx-sm{display:inline-block;width:.95rem;height:.6rem;margin-right:.5rem;vertical-align:.08em;background:radial-gradient(circle at 30% 50%,var(--ca) 0 .3rem,transparent .31rem),radial-gradient(circle at 70% 50%,var(--cb) 0 .3rem,transparent .31rem)}
.cx-vh{color:var(--mute,#5f6d78)}
.cx-vh--both{background:var(--card,#fbfcfd);padding:0 .35rem}
.cx-note,.cx-none{color:var(--mute,#5f6d78)}
.cx-k .cx-none{background:var(--card,#fbfcfd);padding:0 .35rem}
.cx-chips,.cx-packs{margin:0;padding:0;list-style:none}
.cx-chips{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.45rem}
.cx-a .cx-chips{justify-content:flex-end}
.cx-k .cx-chips{justify-content:center;margin-top:0}
.cx-chips li{display:inline-flex;align-items:center;gap:.45rem;padding:.3rem .7rem;border-radius:999px;background:var(--paper,#f3f5f6);border:1px solid rgba(16,26,34,.08);line-height:1.3}
.cx-chips li::before{content:"";width:.5rem;height:.5rem;border-radius:50%;flex:none}
.cx-chips--a li::before{background:var(--ca-ink)}
.cx-chips--b li::before{background:var(--cb)}
.cx-chips--both li{background:#fff;border-color:rgba(16,26,34,.14)}
.cx-chips--both li::before{width:.95rem;border-radius:0;background:radial-gradient(circle at 25% 50%,var(--ca-ink) 0 .25rem,transparent .26rem),radial-gradient(circle at 75% 50%,var(--cb) 0 .25rem,transparent .26rem)}
.cx-packs{display:flex;flex-wrap:wrap;align-items:flex-end;gap:.9rem 1.2rem}
.cx-a .cx-packs{justify-content:flex-end}
.cx-same .cx-packs{justify-content:center}
.cx-pack{display:flex;flex-direction:column;align-items:center;gap:.35rem;min-width:3.5rem}
.cx-pack svg{width:var(--px,2.5rem);height:var(--px,2.5rem);color:var(--ink,#101a22)}
.cx-a .cx-pack svg{color:var(--ca-ink)}
.cx-b .cx-pack svg{color:#b07a0c}
.cx-pack span{line-height:1.3;text-align:center}
.cx-links{display:flex;flex-wrap:wrap;gap:.45rem}
.cx-a .cx-links{justify-content:flex-end}
.cx-links a,.cx-rate{display:inline-flex;align-items:center;gap:.45rem;padding:.45rem .9rem;border-radius:999px;border:1px solid rgba(16,26,34,.16);color:var(--ink,#101a22);text-decoration:none;transition:border-color .2s ease,background-color .2s ease}
.cx-links a:hover,.cx-rate:hover{border-color:var(--ink,#101a22);background:#fff}
.cx-links a:focus-visible,.cx-rate:focus-visible{outline:2px solid var(--water,#0b6e80);outline-offset:2px}
.cx-rate svg,.cx-links svg{width:1.05rem;height:1.05rem;flex:none}
.cx-rs{display:none}
.cx-foot{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.75rem 1.25rem;padding:1.1rem clamp(.9rem,2.4vw,2rem) 1.5rem;border-top:1px solid rgba(16,26,34,.08)}
.cx-foot p{color:var(--mute,#5f6d78)}
.cx-ainote{max-width:48rem;margin:1rem auto 0;color:var(--mute,#5f6d78);text-align:center}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
/* the change moment: what moved settles into place */
@media (prefers-reduced-motion:no-preference){
  .cx.is-changing .cx-sheet .cx-row,.cx.is-changing .cx-verdict{animation:cx-in .5s cubic-bezier(.2,.7,.2,1) both}
  .cx.is-changing .cx-sheet .cx-row:nth-child(2){animation-delay:40ms}
  .cx.is-changing .cx-sheet .cx-row:nth-child(3){animation-delay:80ms}
  .cx.is-changing .cx-sheet .cx-row:nth-child(4){animation-delay:120ms}
  .cx.is-changing .cx-sheet .cx-row:nth-child(5){animation-delay:160ms}
  .cx.is-changing .cx-sheet .cx-row:nth-child(n+6){animation-delay:200ms}
  .cx.is-changing .cx-fig{animation:cx-fade .45s ease both}
  .cx.is-changing .cx-k .cx-chips--both li{animation:cx-pop .5s cubic-bezier(.2,.8,.2,1.2) both}
}
@keyframes cx-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes cx-fade{from{opacity:.25}to{opacity:1}}
@keyframes cx-pop{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:none}}
/* phones and narrow tablets: the label and what both share run across the top of each row, A and B beneath */
@media (max-width:899px){
  .cx{--spine:2.75rem;border-radius:1.25rem}
  .cx-stage{border-radius:1.25rem 1.25rem 0 0;padding:1rem .8rem 1.1rem}
  .cx-head{grid-template-columns:minmax(0,1fr);grid-template-areas:"ab" "pick" "sub"}
  .cx-head--b{grid-template-columns:minmax(0,1fr);grid-template-areas:"ab" "pick" "sub"}
  .cx-ab{width:1.75rem;height:1.75rem;margin:0 0 .35rem}
  .cx-head--b .cx-ab{justify-self:end}
  .cx-pick{gap:.4rem}
  .cx-mid{padding-top:2.3rem}
  .cx-swap{width:2.5rem;height:2.5rem}
  .cx-media{grid-template-columns:minmax(0,1fr) .7rem minmax(0,1fr)}
  .cx-fig figcaption{flex-direction:column;gap:.1rem}
  .cx-media.is-same .cx-fig{width:100%}
  .cx-sheet{padding:.2rem .8rem .4rem}
  .cx-sheet::before{display:none}
  .cx-row{grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-areas:"k k" "a b";column-gap:1rem;padding:.9rem 0}
  .cx-row.is-same{grid-template-areas:"k k" "s s"}
  .cx-k{align-items:flex-start;text-align:left;padding:0;margin-bottom:.5rem}
  .cx-kl,.cx-vh--both{padding:0}
  .cx-k .cx-chips{justify-content:flex-start}
  .cx-a{text-align:left;padding:0}
  .cx-b{padding:0}
  .cx-a .cx-chips,.cx-a .cx-packs,.cx-a .cx-links{justify-content:flex-start}
  .cx-same{justify-content:flex-start;text-align:left}
  .cx-same p,.cx-same .cx-chips{padding:0;background:none}
  .cx-rl{display:none}
  .cx-rs{display:inline}
}
`;
