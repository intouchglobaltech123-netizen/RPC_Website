/**
 * The inner pages' shared parts: sand and stone grounds (no white anywhere),
 * Inter Tight throughout (semibold headings), navy ink, the logo blue for actions, and a pale blue
 * panel for each page's closing call to action. The dark blue belongs to the
 * nav bar and the footer only.
 *
 * Plain strings, like the home sections, so the server renders every word
 * and the pages work before scripts arrive. A small client component adds
 * the little behaviour there is (links, the enquiry form).
 *
 * Pictures: none of the generated images are shown. Every place a photograph
 * belongs keeps an empty frame at its proportions, ready for RPC's own photos.
 */

export interface PageOptions {
  /** plain image URLs (the local test page has no image optimiser) */
  rawImages?: boolean;
}
export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  hours: string;
  whatsapp: string;
  mapQuery: string;
  regions: readonly string[];
}

export const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export const tel = (p: string) => `tel:${p.replace(/[^0-9+]/g, "")}`;
export const two = (n: number) => String(n).padStart(2, "0");
/**
 * A heading whose words rise into place when it arrives (with data-rv="words"
 * on the heading). Takes escaped text; the words stay plain text for search
 * and screen readers.
 */
export const words = (html: string) =>
  html
    .split(/ +/)
    .map((w, i) => `<span class="pg-w"><span style="--wi:${i}">${w}</span></span>`)
    .join(" ");
export const mapsLink = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
/** "Erode, Coimbatore and Chennai" */
export const listing = (xs: readonly string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

export const arrow = `<svg class="pg-ar" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
export const arrowDown = `<svg class="pg-ar" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M3.8 8.8 8 13l4.2-4.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
export const tick = `<svg class="pg-tick" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.4 6.6 11.4 12.6 4.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/** the proportions of the photographs the pages used to show, so their empty frames keep the same shape */
const SIZES: Record<string, readonly [number, number]> = {
  "/images/interior-joinery.jpg": [1200, 896],
  "/images/architectural-craft-detail.jpg": [896, 1200],
  "/images/detail-02.jpg": [1200, 896],
  "/images/anatomy-wp-walls.jpg": [1376, 768],
  "/images/projects/anna-nagar-mixed-use-chennai.jpg": [1376, 768],
  "/images/projects/avinashi-corporate-centre-coimbatore.jpg": [1376, 768],
  "/images/projects/sipcot-textile-unit-perundurai.jpg": [1376, 768],
  "/images/projects/thindal-courtyard-villa-erode.jpg": [1376, 768],
};
export const ratio = (src: string) => {
  const s = SIZES[src];
  return s ? `${s[0]}/${s[1]}` : "16/9";
};

/** a camera, drawn small in the middle of an empty photo frame */
const camera = `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 10.5a2.5 2.5 0 0 1 2.5-2.5h3l1.7-2.6a1.5 1.5 0 0 1 1.25-.68h5.1c.5 0 .97.26 1.25.68L21.5 8h3a2.5 2.5 0 0 1 2.5 2.5v12a2.5 2.5 0 0 1-2.5 2.5h-17A2.5 2.5 0 0 1 5 22.5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="16" cy="16" r="4.6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`;

/**
 * An empty photo frame: the place a photograph will go, at its proportions.
 * `label` names what belongs there, for whoever adds the photo later; it is
 * shown small under the camera.
 */
export function ph(o: { ratio?: string; label?: string; cls?: string; tag?: string } = {}) {
  return `<div class="pg-ph${o.cls ? ` ${o.cls}` : ""}" style="aspect-ratio:${o.ratio ?? "4/3"}" aria-hidden="true">${camera}${o.label ? `<span>${esc(o.label)}</span>` : ""}${o.tag ?? ""}</div>`;
}

/** kept for the pages that still call it: no image is loaded, the frame stays empty */
export function img(_src: string, _alt: string, _sizes: string, _o: PageOptions, _eager = false) {
  return "";
}
/** a photograph's place: an empty frame at that photograph's proportions */
export function photo(src: string, _alt: string, _sizes: string, _o: PageOptions, opts: { eager?: boolean; cls?: string; tag?: string; label?: string } = {}) {
  return ph({ ratio: ratio(src), cls: `pg-photo${opts.cls ? ` ${opts.cls}` : ""}`, tag: opts.tag, label: opts.label });
}

export interface Crumb {
  name: string;
  href: string;
}

/** the small label over a section's heading: "03 — About RPC" */
export const mark = (n: string, label: string, extra = "") =>
  `<p class="pg-mark" data-rv>${n ? `<span class="pg-idx">${n}</span><span class="pg-rule" aria-hidden="true"></span>` : ""}<span>${esc(label)}</span>${extra}</p>`;

export const serviceSlug = (title: string) => title.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2026-09-18" → "18 Sep 2026", the same on the server and in the browser */
export const shortDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[(m ?? 1) - 1] ?? ""} ${y}`;
};

/**
 * The page's opening: the one h1 and its intro, with the actions under them.
 * An `aside` (an index, a panel of facts) sits to the right. (`trail` is kept
 * for the callers; no breadcrumbs are shown.)
 */
export function pageHead(p: { trail: readonly Crumb[]; title: string; intro?: string; actions?: string; aside?: string; id?: string; cls?: string; label?: string }) {
  const intro = p.intro ? `<p class="pg-intro">${p.intro}</p>` : "";
  const actions = p.actions ? `<div class="pg-actions">${p.actions}</div>` : "";
  const label = p.label ? `<p class="pg-mark">${esc(p.label)}</p>` : "";
  const h1 = `<h1 class="pg-h1"${p.id ? ` id="${p.id}"` : ""}>${p.title}</h1>`;
  const cls = p.cls ? ` ${p.cls}` : "";
  return `<header class="pg-head${p.aside ? " pg-head--aside" : ""}${cls}">
  <div class="pg-wrap">
    <div class="pg-headgrid">
      <div class="pg-headcopy">${label}${h1}${intro}${actions}</div>
      ${p.aside ? `<div class="pg-headaside">${p.aside}</div>` : ""}
    </div>
  </div>
</header>`;
}

/** a section's head: a small label, the h2 and, if there is one, a line under it */
export function secHead(p: { n?: string; label: string; title: string; lede?: string; extra?: string; id?: string; center?: boolean }) {
  return `<header class="pg-shead${p.center ? " pg-shead--center" : ""}">
  ${mark("", p.label)}<h2 class="pg-h2"${p.id ? ` id="${p.id}"` : ""}>${p.title}</h2>
  ${p.lede ? `<p class="pg-lede">${p.lede}</p>` : ""}${p.extra ? `<div class="pg-sextra">${p.extra}</div>` : ""}
</header>`;
}

export type CtaStep = readonly [title: string, line: string];
/**
 * The close of every inner page: a pale blue panel with the question, three
 * steps written for that page (so no two pages say the same thing), and the
 * ways to start.
 */
export function ctaBand(c: ContactInfo, t: { title: string; steps: readonly CtaStep[] }) {
  const { title, steps } = t;
  return `<section class="pg-cta" aria-labelledby="pg-cta-title">
  <div class="pg-wrap">
    <div class="pg-ctabox">
      <div class="pg-ctahead">
        <h2 class="pg-ctah" id="pg-cta-title">${esc(title)}</h2>
        <div class="pg-ctaacts">
          <a class="pg-btn pg-btn--ink" href="/contact#enquiry" data-internal>Book a free site inspection${arrow}</a>
          <a class="pg-btn pg-btn--line" href="${esc(c.whatsapp)}" target="_blank" rel="noopener noreferrer">WhatsApp us</a>
        </div>
      </div>
      <ol class="pg-ctasteps" aria-label="What happens next">${steps.map(([h, p], i) => `<li><span class="pg-ctan" aria-hidden="true">${i + 1}</span><div><p class="pg-ctast">${esc(h)}</p><p class="pg-ctasd">${esc(p)}</p></div></li>`).join("")}</ol>
      <p class="pg-ctaline"><a class="pg-ctatel" href="${tel(c.phone)}">${esc(c.phone)}</a><a href="mailto:${esc(c.email)}">${esc(c.email)}</a><span>${esc(c.hours)}</span></p>
    </div>
  </div>
</section>`;
}

export const KIT_CSS = `
.pg{--sand:#ece6da;--sand-2:#e2d9c9;--card:#f5f0e6;--sky:#d9e2ee;--paper:var(--sand);--stone:var(--sand-2);--ink:#12223b;--ink2:rgba(18,34,59,.82);--mute:#5b6271;--line:rgba(18,34,59,.14);--accent:#2756a0;--water:#0b6e80;--navy:#0b2350;--night:#0b2350;--display:var(--font-inter-tight),"Segoe UI",system-ui,sans-serif;--serif:var(--display);--sans:var(--font-inter-tight),ui-sans-serif,system-ui,sans-serif;--nav-room:var(--nav-h,80px);position:relative;z-index:10;background:var(--sand);color:var(--ink);font-family:var(--sans)}
.pg *,.pg *::before,.pg *::after{box-sizing:border-box}
.pg-wrap{width:100%;max-width:1360px;margin:0 auto;padding-inline:var(--gutter,3rem)}
.pg img{display:block;width:100%;height:100%;object-fit:cover}
:where(.pg) a{color:inherit}
.pg-ar{width:15px;height:15px;flex:none;transition:transform .4s cubic-bezier(.2,.7,.2,1)}
.pg-tick{width:18px;height:18px;flex:none;color:var(--water)}
.pg-sec{position:relative;padding:clamp(3.6rem,9vh,6.5rem) 0}
.pg-sec--stone{background:var(--sand-2)}
.pg-sec--sky{background:var(--sand-2)}
.pg-sec + .pg-sec:not(.pg-sec--stone):not(.pg-sec--sky){border-top:1px solid var(--line)}

/* tinted grounds (once night blue; the dark blue now belongs to the nav bar and footer only) */
.pg-dark{background:var(--sand-2);color:var(--ink)}
.pg-dark .pg-photo,.pg-dark .pg-ph{background-color:#c9d5e4}

/* an empty photo frame, waiting for RPC's own photograph */
.pg-ph{position:relative;display:grid;place-items:center;align-content:center;gap:.5rem;width:100%;overflow:hidden;border-radius:8px;background:#ddd3c2 linear-gradient(135deg,rgba(255,255,255,.18),rgba(255,255,255,0) 60%);box-shadow:inset 0 0 0 1px rgba(18,34,59,.1);color:rgba(18,34,59,.36)}
.pg-ph>svg{width:30px;height:30px}
.pg-ph>span{max-width:80%;font-size:var(--fs-body);line-height:1.35;text-align:center;color:rgba(18,34,59,.5)}
.pg-photo{border-radius:8px}

/* opening */
.pg-head{padding:calc(var(--nav-room) + clamp(2.4rem,7vh,4.6rem)) 0 clamp(2.4rem,6vh,4.2rem);border-bottom:1px solid var(--line)}
.pg-headgrid{display:grid;grid-template-columns:minmax(0,1fr);gap:2.2rem clamp(2rem,5vw,5rem);align-items:end}
.pg-head--aside .pg-headgrid{grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);align-items:center}
.pg-h1{margin:0;font-family:var(--display);font-weight:600;font-size:var(--fs-title);line-height:1.12;letter-spacing:-.02em;text-wrap:balance;max-width:24ch}
.pg-intro{margin:1.1rem 0 0;max-width:40rem;font-size:var(--fs-body);line-height:1.65;color:rgba(18,34,59,.8);text-wrap:pretty}
.pg-actions{display:flex;flex-wrap:wrap;align-items:center;gap:.75rem;margin-top:clamp(1.4rem,3vh,2rem)}

/* buttons and links */
.pg-btn{display:inline-flex;align-items:center;justify-content:center;gap:.6rem;height:min(3.25rem,6.4svh);min-height:2.75rem;padding:0 1.5rem;border-radius:10px;font-size:var(--fs-body);font-weight:600;text-decoration:none;box-sizing:border-box;white-space:nowrap;cursor:pointer;transition:background-color .3s,color .3s,border-color .3s}
.pg-btn:hover .pg-ar,.pg-link:hover .pg-ar{transform:translate(2px,-2px)}
.pg-btn--ink{background:var(--navy);color:#f5f0e6}
.pg-btn--ink:hover{background:var(--accent)}
.pg-btn--line{border:1px solid rgba(18,34,59,.32);color:var(--ink)}
.pg-btn--line:hover{border-color:var(--navy);background:rgba(18,34,59,.04)}
.pg-btn--paper{background:var(--navy);color:#f5f0e6}
.pg-btn--paper:hover{background:var(--accent)}
.pg-btn--ghost{border:1.5px solid rgba(18,34,59,.26);color:var(--ink)}
.pg-btn--ghost:hover{border-color:var(--navy)}
.pg-link{display:inline-flex;align-items:center;gap:.5rem;padding-bottom:3px;border-bottom:1.5px solid currentColor;font-size:var(--fs-body);font-weight:600;text-decoration:none;color:var(--accent)}
/* a button with its arrow in a small square of its own: outlined at rest, filled under the pointer */
.pg-cbtn{display:inline-flex;align-items:center;justify-content:space-between;gap:.9rem;height:3rem;padding:0 .3rem 0 1.1rem;border:0;border-radius:6px;background:none;box-shadow:inset 0 0 0 1.5px rgba(18,34,59,.22);font-family:inherit;font-size:var(--fs-body);font-weight:600;color:var(--ink);text-decoration:none;white-space:nowrap;cursor:pointer;transition:background-color .3s,color .3s,box-shadow .3s}
.pg-cbtn > i{display:grid;place-items:center;width:2.4rem;height:2.4rem;flex:none;border-radius:8px;background:var(--navy);color:#f5f0e6;font-style:normal;transition:background-color .3s,color .3s}
.pg-cbtn:hover{background:var(--navy);color:#f5f0e6;box-shadow:inset 0 0 0 1.5px var(--navy)}
.pg-cbtn:hover > i{background:#f5f0e6;color:var(--navy)}
.pg-cbtn:hover .pg-ar{transform:translate(1px,-1px)}
.pg-cbtn--ink{background:var(--navy);color:#f5f0e6;box-shadow:none}
.pg-cbtn--ink > i{background:#f5f0e6;color:var(--navy)}
.pg-cbtn--ink:hover{background:var(--accent);box-shadow:none}
/* words for screen readers only */
.pg-vh{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.pg a:focus-visible,.pg button:focus-visible,.pg select:focus-visible,.pg input:focus-visible{outline:2px solid var(--accent);outline-offset:3px}

/* section heads: a small label, the heading, an optional line */
.pg-mark{display:flex;align-items:center;gap:.75rem;margin:0;font-size:var(--fs-body);font-weight:500;color:var(--mute)}
.pg-idx{font-variant-numeric:tabular-nums;font-weight:600;color:var(--accent)}
.pg-rule{width:2rem;height:1px;background:currentColor;opacity:.35}
.pg-shead{display:flex;flex-direction:column;align-items:flex-start;gap:.7rem;margin-bottom:clamp(2rem,5vh,3.2rem);padding-top:1.25rem;border-top:1px solid rgba(18,34,59,.28)}
.pg-shead--center{align-items:center;text-align:center}
.pg-shead--center .pg-h2,.pg-shead--center .pg-lede{margin-inline:auto}
.pg-h2{margin:0;font-family:var(--display);font-weight:600;font-size:var(--fs-title);line-height:1.12;letter-spacing:-.02em;text-wrap:balance;max-width:26ch}
.pg-h3{margin:0;font-family:var(--display);font-weight:600;font-size:var(--fs-sub);line-height:1.25;letter-spacing:-.015em}
.pg-lede{margin:.5rem 0 0;max-width:44rem;font-size:var(--fs-body);line-height:1.65;color:var(--ink2);text-wrap:pretty}
.pg-sextra{margin-top:.4rem}
.pg-card{border-radius:8px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line)}

/* closing call to action: a pale blue panel */
.pg-cta{padding:clamp(3rem,8vh,5.5rem) 0}
.pg-ctabox{padding:clamp(1.8rem,4vw,3.4rem);border-radius:8px;background:var(--navy);color:#fff}
.pg-ctahead{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:1.6rem 3rem}
.pg-ctah{margin:0;max-width:22ch;font-family:var(--display);font-weight:600;font-size:var(--fs-title);line-height:1.12;letter-spacing:-.02em;text-wrap:balance}
.pg-ctaacts{display:flex;flex-wrap:wrap;gap:.7rem}
.pg-ctabox .pg-btn--ink{background:#f5f0e6;color:var(--navy)}
.pg-ctabox .pg-btn--ink:hover{background:#fff}
.pg-ctabox .pg-btn--line{border-color:rgba(255,255,255,.4);color:#fff}
.pg-ctabox .pg-btn--line:hover{border-color:#fff;background:rgba(255,255,255,.06)}
.pg-ctabox a:focus-visible{outline-color:#9db8e8}
.pg-ctasteps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1.4rem;margin:clamp(2rem,5vh,3rem) 0 0;padding:clamp(1.4rem,3vh,2rem) 0 0;list-style:none;border-top:1px solid rgba(255,255,255,.2)}
.pg-ctasteps li{display:flex;gap:.9rem;min-width:0}
.pg-ctan{display:grid;place-items:center;flex:none;width:2rem;height:2rem;border-radius:4px;background:rgba(255,255,255,.12);color:#fff;font-family:var(--display);font-weight:600;font-size:var(--fs-body)}
.pg-ctast{margin:.15rem 0 0;font-size:var(--fs-body);font-weight:600;line-height:1.35}
.pg-ctasd{margin:.3rem 0 0;max-width:20rem;font-size:var(--fs-body);line-height:1.55;color:rgba(255,255,255,.66);text-wrap:pretty}
.pg-ctaline{display:flex;flex-wrap:wrap;align-items:baseline;gap:.4rem 1.6rem;margin:clamp(1.6rem,4vh,2.2rem) 0 0;font-size:var(--fs-body);color:rgba(255,255,255,.66)}
.pg-ctaline a{text-decoration:none}
.pg-ctaline a:hover{color:#fff;text-decoration:underline;text-underline-offset:4px}
.pg-ctaline .pg-ctatel{font-family:var(--display);font-weight:600;font-size:var(--fs-sub);color:#fff}

@media (max-width:1023px){
  .pg-head--aside .pg-headgrid{grid-template-columns:1fr}
  .pg-ctasteps{grid-template-columns:1fr}
}
@media (max-width:767px){
  .pg-head{padding:calc(var(--nav-room) + 2rem) 0 2.2rem}
  .pg-actions .pg-btn{flex:1 1 auto}
  .pg-sec{padding:3.2rem 0}
  .pg-shead{margin-bottom:1.6rem}
  .pg-cta{padding:2.4rem 0 3rem}
  .pg-ctabox{padding:1.5rem 1.2rem;border-radius:8px}
  .pg-ctaacts{width:100%}
  .pg-ctaacts .pg-btn{flex:1 1 auto}
}
/* motion: anything marked data-rv arrives as it comes into view. Scripts add the starting state, so without them nothing is hidden. */
.pg-w{display:inline-block;overflow:hidden;vertical-align:top;padding:0 .04em .14em;margin:0 -.04em -.14em}
.pg-w>span{display:inline-block;transition:transform 1.05s cubic-bezier(.2,.75,.15,1);transition-delay:calc(var(--rvd,0ms) + var(--wi,0) * 55ms)}
.rv-pending .pg-w>span{transform:translateY(112%)}
[data-rv]:not([data-rv=words]){transition:opacity .8s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.75,.15,1);transition-delay:var(--rvd,0ms)}
[data-rv].rv-pending:not([data-rv=words]){opacity:0;transform:translateY(24px)}
[data-rv=fade].rv-pending{transform:none!important}
[data-rv=left].rv-pending{transform:translateX(-32px)!important}
[data-rv=right].rv-pending{transform:translateX(32px)!important}
[data-rv=rise].rv-pending{transform:translateY(48px)!important}
@media (prefers-reduced-motion:reduce){.pg *{transition:none!important}}
`;
