/**
 * The inner pages' shared parts. "Blueprint and action": white and light-grey
 * grounds, deep blue for structure (bands, panels, icon tiles, heading
 * accents, links at rest), dark grey for text, and orange ONLY where something
 * can be clicked or is selected (buttons, chosen tabs, hover/focus states).
 * Inter Tight throughout, in the three sizes --fs-title / --fs-sub / --fs-body.
 *
 * Four shapes, used sparingly: the chamfered corner (RPC's signature, on
 * photos, cards and the closing panel), measuring-ruler ticks at light section
 * seams, a 45° hatch strip on deep-blue bands, and a soft wave edge on at most
 * one band per page.
 *
 * The Projects page header (.pj-hero) is frozen: the last rules of KIT_CSS
 * restore its buttons exactly as they were.
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
export const words = (html: string, accentFrom?: number) =>
  html
    .split(/ +/)
    .map((w, i) => `<span class="pg-w"><span${accentFrom !== undefined && i >= accentFrom ? ' class="pg-acc"' : ""} style="--wi:${i}">${w}</span></span>`)
    .join(" ");
export const mapsLink = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
/** "Erode, Coimbatore and Chennai" */
export const listing = (xs: readonly string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

export const arrow = `<svg class="pg-ar" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
export const arrowDown = `<svg class="pg-ar" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M3.8 8.8 8 13l4.2-4.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
export const tick = `<svg class="pg-tick" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.4 6.6 11.4 12.6 4.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
/** the WhatsApp mark, 16px, in WhatsApp green: prepended inside every "WhatsApp us" button (the only green on inner pages) */
export const waGlyph = `<svg class="pg-wa" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.1a8.9 8.9 0 0 0-7.7 13.3L3.1 20.9l4.6-1.2A8.9 8.9 0 1 0 12 3.1z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9.3 7.8c-.3 0-.7.1-1 .5-.3.4-.9 1-.9 2.2s.9 2.5 1 2.6c.1.2 1.8 2.9 4.5 3.9 2.2.9 2.7.7 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3-1.7-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2-1.2-.8-.7-1.3-1.5-1.4-1.8-.1-.3 0-.4.1-.5l.4-.5.2-.4v-.4l-.8-1.9c-.2-.5-.4-.4-.5-.4z" fill="currentColor"/></svg>`;
/** a measuring-ruler strip at the seam between two light sections (decorative) */
export const ruler = (cls = "") => `<div class="pg-ruler${cls ? ` ${cls}` : ""}" aria-hidden="true"></div>`;
/**
 * A card's "Learn more" style link: the words and an outlined arrow circle that
 * fills orange when the link or its .pg-cardx card is hovered. Without `href`
 * it is a <span> (for a card that is itself the link).
 */
export const more = (label: string, href?: string, attrs = "") =>
  href ? `<a class="pg-more" href="${esc(href)}"${attrs ? ` ${attrs}` : ""}>${esc(label)}${arrow}</a>` : `<span class="pg-more">${esc(label)}${arrow}</span>`;

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
/**
 * A real photograph (from public/) in a chamfered frame: figure.pg-media with
 * the image filling it. The frame is 4/3 unless `cls` or --ar sets another
 * ratio; `extra` is markup laid over the photo (a .pg-flag, a .pg-glass pill).
 * The image zooms a little when the frame, or the .pg-cardx it sits in, is hovered.
 */
export function shot(src: string, alt: string, cls = "", eager = false, o: { size?: readonly [number, number]; extra?: string; sizes?: string } = {}) {
  const [w, h] = o.size ?? SIZES[src] ?? [1200, 900];
  const load = eager ? ' loading="eager" fetchpriority="high"' : ' loading="lazy"';
  return `<figure class="pg-media${cls ? ` ${cls}` : ""}"><img src="${esc(src)}" alt="${esc(alt)}" width="${w}" height="${h}"${o.sizes ? ` sizes="${esc(o.sizes)}"` : ""}${load} decoding="async">${o.extra ?? ""}</figure>`;
}

export interface Crumb {
  name: string;
  href: string;
}

/**
 * The small blue eyebrow over a heading: an optional index, a short rule that
 * ends in a survey-point diamond (it draws in on arrival), and the label.
 * Never orange: it is a label, not an action.
 */
export const mark = (n: string, label: string, extra = "") =>
  `<p class="pg-mark" data-rv>${n ? `<span class="pg-idx">${n}</span>` : ""}<span class="pg-rule" aria-hidden="true"></span><span>${esc(label)}</span>${extra}</p>`;

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

/**
 * A section's head: the blue eyebrow, the h2 and, if there is one, a line
 * under it. `split` puts `extra` (an action) at the right, level with the
 * bottom of the heading (stacked on phones). Two-tone headings: wrap the
 * accent words of `title` in <span class="pg-acc">.
 */
export function secHead(p: { n?: string; label: string; title: string; lede?: string; extra?: string; id?: string; center?: boolean; split?: boolean }) {
  // (`n` is accepted for the callers but not shown, as before)
  const h = `${mark("", p.label)}<h2 class="pg-h2"${p.id ? ` id="${p.id}"` : ""}>${p.title}</h2>
  ${p.lede ? `<p class="pg-lede">${p.lede}</p>` : ""}`;
  const extra = p.extra ? `<div class="pg-sextra">${p.extra}</div>` : "";
  if (p.split) return `<header class="pg-shead pg-shead--split"><div class="pg-shl">${h}</div>${extra}</header>`;
  return `<header class="pg-shead${p.center ? " pg-shead--center" : ""}">
  ${h}${extra}
</header>`;
}

/**
 * The opening of every inner page except Projects (whose header is frozen):
 * the eyebrow, the h1 (words rise in; words from `accentFrom` are blue), the
 * intro and the actions on the left; a chamfered photo on the right with an
 * optional deep-blue fact chip overlapping its bottom-left corner. White
 * ground with a faint blueprint grid, closed by a deep-blue hatched strip.
 * `title` is escaped text; `media` is markup (shot() or ph()).
 */
export function banner(p: {
  label: string;
  n?: string;
  title: string;
  accentFrom?: number;
  intro?: string;
  actions?: string;
  media?: string;
  fact?: { n: string; label: string };
  id?: string;
  cls?: string;
}) {
  const fact = p.fact ? `<p class="pg-bfact"><b>${esc(p.fact.n)}</b><span>${esc(p.fact.label)}</span></p>` : "";
  return `<header class="pg-head pg-banner${p.cls ? ` ${p.cls}` : ""}">
  <div class="pg-wrap">
    <div class="pg-bgrid${p.media ? "" : " pg-bgrid--solo"}">
      <div class="pg-bcopy">
        ${mark(p.n ?? "", p.label)}
        <h1 class="pg-h1" data-rv="words"${p.id ? ` id="${p.id}"` : ""}>${words(p.title, p.accentFrom)}</h1>
        ${p.intro ? `<p class="pg-intro" data-rv>${p.intro}</p>` : ""}
        ${p.actions ? `<div class="pg-actions" data-rv>${p.actions}</div>` : ""}
      </div>
      ${p.media ? `<div class="pg-bmedia" data-rv="fade">${p.media}${fact}</div>` : ""}
    </div>
  </div>
</header>`;
}

/**
 * A stats strip for a deep-blue band: 3-4 cells split by hairlines. The final
 * number is in the markup (so it reads without scripts); `count` adds
 * data-count for a count-up where the page's scripts support it.
 */
export function stats(items: readonly { n: string; label: string; count?: number }[], cls = "") {
  return `<ul class="pg-stats${cls ? ` ${cls}` : ""}" style="--n:${items.length}" data-rv-stagger>${items
    .map((x) => `<li data-rv><span class="pg-stat-n"${x.count !== undefined ? ` data-count="${x.count}"` : ""}>${esc(x.n)}</span><span class="pg-stat-l">${esc(x.label)}</span></li>`)
    .join("")}</ul>`;
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
          <a class="pg-btn pg-btn--line" href="${esc(c.whatsapp)}" target="_blank" rel="noopener noreferrer">${waGlyph}WhatsApp us</a>
        </div>
      </div>
      <ol class="pg-ctasteps" aria-label="What happens next">${steps.map(([h, p], i) => `<li><span class="pg-ctan" aria-hidden="true">${i + 1}</span><div><p class="pg-ctast">${esc(h)}</p><p class="pg-ctasd">${esc(p)}</p></div></li>`).join("")}</ol>
      <p class="pg-ctaline"><a class="pg-ctatel" href="${tel(c.phone)}">${esc(c.phone)}</a><a href="mailto:${esc(c.email)}">${esc(c.email)}</a><span>${esc(c.hours)}</span></p>
    </div>
  </div>
</section>`;
}

export const KIT_CSS = `
.pg{--sand:var(--theme-bg);--sand-2:var(--theme-bg-alt);--card:var(--theme-surface);--sky:var(--theme-primary-soft);--paper:var(--sand);--stone:var(--sand-2);--ink:var(--theme-ink);--ink2:color-mix(in srgb,var(--theme-ink) 82%,transparent);--mute:var(--theme-muted);--line:var(--theme-line);--accent:var(--theme-primary);--water:var(--theme-water);--navy:var(--theme-primary-dark);--night:var(--theme-primary-dark);--act:var(--theme-action);--act-h:var(--theme-action-hover);--on-act:var(--theme-on-action);--act-t:var(--theme-action-text);--band:var(--theme-band);--band-mute:var(--theme-on-band-muted);--hatch:var(--theme-hatch);--tick:var(--theme-tick);--bp:var(--theme-blueprint);--r-ctl:10px;--r-card:14px;--r-pill:999px;--cut:clamp(1.1rem,2vw,1.75rem);--ease:cubic-bezier(.2,.7,.2,1);--lift:0 22px 40px -24px color-mix(in srgb,var(--theme-shadow) 45%,transparent);--hatch-img:repeating-linear-gradient(135deg,var(--hatch) 0 1px,transparent 1px 9px);--display:var(--font-inter-tight),"Segoe UI",system-ui,sans-serif;--serif:var(--display);--sans:var(--font-inter-tight),ui-sans-serif,system-ui,sans-serif;--nav-room:var(--nav-h,80px);position:relative;z-index:10;background:var(--sand);color:var(--ink);font-family:var(--sans)}
.pg *,.pg *::before,.pg *::after{box-sizing:border-box}
.pg-wrap{width:100%;max-width:1360px;margin:0 auto;padding-inline:var(--gutter,3rem)}
.pg img{display:block;width:100%;height:100%;object-fit:cover}
:where(.pg) a{color:inherit}
.pg-ar{width:15px;height:15px;flex:none;transition:transform .4s var(--ease)}
.pg-tick{width:18px;height:18px;flex:none;color:var(--water)}
.pg-wa{width:16px;height:16px;flex:none;color:var(--theme-whatsapp)}

/* ── grounds: page grey, white, deep-blue band (one dark-grey band at most) ── */
.pg-sec{position:relative;padding:clamp(3.6rem,9vh,6.5rem) 0}
.pg-sec--white{background:var(--theme-surface)}
.pg-sec--stone{background:var(--sand-2)}
/* a deep-blue band, with the 45° "cut material" hatch along the inside of its top edge */
.pg-band,.pg-sec--sky{position:relative;background-color:var(--band);background-image:var(--hatch-img);background-size:100% 12px;background-repeat:no-repeat;background-position:top left;color:var(--theme-on-dark)}
.pg-band--dark{background-color:var(--theme-band-2)}
.pg-band .pg-h1,.pg-band .pg-h2,.pg-band .pg-h3,.pg-sec--sky .pg-h2,.pg-sec--sky .pg-h3{color:var(--theme-on-dark)}
.pg-band .pg-lede,.pg-band .pg-intro,.pg-sec--sky .pg-lede{color:var(--band-mute)}
.pg-band .pg-acc,.pg-sec--sky .pg-acc,.pg-ctabox .pg-acc,.pg-panel--blue .pg-acc{color:var(--theme-focus-on-dark)}
/* a deep-blue panel inside a light section */
.pg-panel--blue{position:relative;border-radius:var(--r-card);background-color:var(--band);background-image:var(--hatch-img);background-size:100% 12px;background-repeat:no-repeat;color:var(--theme-on-dark)}

/* tinted grounds (kept for the pages that use them) */
.pg-dark{background:var(--sand-2);color:var(--ink)}
.pg-dark .pg-photo,.pg-dark .pg-ph{background-color:var(--theme-primary-soft)}

/* ── seams and edges ── */
/* measuring-ruler ticks at the seam of two light sections: short every 8px, medium every 40px, long every 80px */
.pg-ruler,.pg-seam::before{display:block;height:14px;background:linear-gradient(var(--tick),var(--tick)) top left/100% 1px no-repeat,repeating-linear-gradient(90deg,var(--tick) 0 1px,transparent 1px 80px) top left/100% 12px no-repeat,repeating-linear-gradient(90deg,var(--tick) 0 1px,transparent 1px 40px) top left/100% 8px no-repeat,repeating-linear-gradient(90deg,var(--tick) 0 1px,transparent 1px 8px) top left/100% 5px no-repeat;pointer-events:none}
.pg-seam::before{content:"";position:absolute;top:0;left:0;right:0}
/* a strip of 45° hatch, for deep-blue grounds */
.pg-hatch{display:block;height:12px;background:var(--hatch-img)}
.pg-hatch--ink{background:repeating-linear-gradient(135deg,var(--tick) 0 1px,transparent 1px 9px)}
/* the soft wave: at most one waved band per page (water). The mask uses alpha only. */
.pg-wave-top::before,.pg-wave-bottom::after{content:"";position:absolute;left:0;right:0;z-index:1;height:16px;background-color:inherit;background-image:none;-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 16' preserveAspectRatio='none'%3E%3Cpath d='M0 16V8C20 0 40 0 60 8s40 8 60 0v8z'/%3E%3C/svg%3E") 0 0/120px 16px repeat-x;mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 16' preserveAspectRatio='none'%3E%3Cpath d='M0 16V8C20 0 40 0 60 8s40 8 60 0v8z'/%3E%3C/svg%3E") 0 0/120px 16px repeat-x;pointer-events:none}
.pg-wave-top::before{top:-15px}
.pg-wave-bottom::after{bottom:-15px;transform:scaleY(-1)}

/* ── empty photo frame (kept for frames still waiting for an RPC photo): chamfered, on a faint blueprint grid ── */
.pg-ph{position:relative;display:grid;place-items:center;align-content:center;gap:.5rem;width:100%;overflow:hidden;border-radius:var(--r-card);background-color:var(--theme-surface-2);background-image:linear-gradient(var(--bp) 1px,transparent 1px),linear-gradient(90deg,var(--bp) 1px,transparent 1px);background-size:24px 24px;box-shadow:inset 0 0 0 1px var(--line);color:var(--mute);clip-path:polygon(var(--cut) 0,100% 0,100% 100%,0 100%,0 var(--cut))}
.pg-ph>svg{width:30px;height:30px;opacity:.7}
.pg-ph>span{max-width:80%;font-size:var(--fs-body);line-height:1.35;text-align:center;color:var(--mute)}
.pg-photo{border-radius:var(--r-card)}

/* ── a real photograph: chamfered top-left, the other corners rounded; zooms inside its frame on hover ── */
.pg-media{position:relative;margin:0;overflow:hidden;aspect-ratio:var(--ar,4/3);border-radius:var(--r-card);background:var(--theme-placeholder);clip-path:polygon(var(--cut) 0,100% 0,100% 100%,0 100%,0 var(--cut))}
.pg-media>img{position:absolute;inset:0;transition:transform .8s var(--ease)}
.pg-media:hover>img,.pg-cardx:hover .pg-media>img,.pg-cardx:focus-within .pg-media>img{transform:scale(1.05)}
.pg-cut2{clip-path:polygon(var(--cut) 0,100% 0,100% calc(100% - var(--cut)),calc(100% - var(--cut)) 100%,0 100%,0 var(--cut))}
/* metadata on photos: a navy category flag at the bottom-left, a glass status pill */
.pg-flag{position:absolute;left:0;bottom:0;z-index:1;margin:0;padding:.35rem .8rem;border-radius:0 var(--r-ctl) 0 0;background:var(--navy);color:var(--theme-on-dark);font-size:var(--fs-body);font-weight:600;line-height:1.3}
.pg-glass{display:inline-flex;align-items:center;gap:.4rem;padding:.3rem .75rem;border-radius:var(--r-pill);background:color-mix(in srgb,var(--theme-ink) 45%,transparent);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-white) 40%,transparent);color:var(--theme-white);font-size:var(--fs-body);font-weight:600;line-height:1.3}
/* decoration: a dotted square behind a photo's corner, an icon tile */
.pg-dots{position:absolute;z-index:0;width:9rem;height:9rem;background:radial-gradient(var(--tick) 1.2px,transparent 1.4px) 0 0/14px 14px;pointer-events:none}
.pg-tile{display:grid;place-items:center;flex:none;width:3rem;height:3rem;border-radius:var(--r-ctl);background:var(--navy);color:var(--theme-on-dark)}
.pg-tile>svg{width:1.5rem;height:1.5rem}

/* ── opening (base, used by the Projects header too: left as it was) ── */
.pg-head{padding:calc(var(--nav-room) + clamp(2.4rem,7vh,4.6rem)) 0 clamp(2.4rem,6vh,4.2rem);border-bottom:1px solid var(--line)}
.pg-headgrid{display:grid;grid-template-columns:minmax(0,1fr);gap:2.2rem clamp(2rem,5vw,5rem);align-items:end}
.pg-head--aside .pg-headgrid{grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);align-items:center}
.pg-h1{margin:0;font-family:var(--display);font-weight:600;font-size:var(--fs-title);line-height:1.12;letter-spacing:-.02em;text-wrap:balance;max-width:24ch}
.pg-intro{margin:1.1rem 0 0;max-width:40rem;font-size:var(--fs-body);line-height:1.65;color:color-mix(in srgb,var(--theme-ink) 80%,transparent);text-wrap:pretty}
.pg-actions{display:flex;flex-wrap:wrap;align-items:center;gap:.75rem;margin-top:clamp(1.4rem,3vh,2rem)}

/* ── the inner-page banner (every inner page but Projects): white, a blueprint grid fading in from the right, a hatched deep-blue strip at the foot ── */
.pg-head.pg-banner{position:relative;background:var(--theme-surface);border-bottom:0;padding:calc(var(--nav-room) + clamp(2rem,6vh,3.6rem)) 0 calc(clamp(3rem,7vh,4.4rem) + 12px);overflow:hidden}
.pg-banner::before{content:"";position:absolute;inset:0;background-image:linear-gradient(var(--bp) 1px,transparent 1px),linear-gradient(90deg,var(--bp) 1px,transparent 1px);background-size:32px 32px;-webkit-mask-image:linear-gradient(100deg,transparent 35%,black 75%);mask-image:linear-gradient(100deg,transparent 35%,black 75%);pointer-events:none}
.pg-banner::after{content:"";position:absolute;left:0;right:0;bottom:0;height:12px;background:var(--hatch-img),var(--band);pointer-events:none}
.pg-banner>.pg-wrap{position:relative;z-index:1}
.pg-bgrid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:clamp(2rem,5vw,4.5rem);align-items:center}
.pg-bgrid--solo{grid-template-columns:minmax(0,1fr)}
.pg-bcopy{min-width:0}
.pg-bcopy .pg-mark{margin-bottom:1rem}
.pg-bmedia{position:relative;min-width:0}
.pg-bmedia>.pg-media,.pg-bmedia>.pg-ph{aspect-ratio:4/3}
.pg-bfact{position:absolute;left:-1.25rem;bottom:-1.25rem;z-index:2;display:flex;flex-direction:column;gap:.2rem;margin:0;padding:1rem 1.25rem;border-radius:var(--r-ctl);background:var(--navy);color:var(--theme-on-dark);box-shadow:var(--lift)}
.pg-bfact b{font-family:var(--display);font-size:var(--fs-sub);font-weight:600;line-height:1.1;font-variant-numeric:tabular-nums}
.pg-bfact span{font-size:var(--fs-body);line-height:1.35;color:var(--band-mute)}

/* ── buttons: pills. Orange = the action; a darker sweep fills it on hover; the arrow sits in a round navy chip ── */
.pg-btn{position:relative;isolation:isolate;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;gap:.6rem;height:3.25rem;min-height:2.75rem;padding:0 1.6rem;border:0;border-radius:var(--r-pill);font-family:inherit;font-size:var(--fs-body);font-weight:600;text-decoration:none;box-sizing:border-box;white-space:nowrap;cursor:pointer;transition:background-color .35s var(--ease),border-color .35s var(--ease),color .35s var(--ease),box-shadow .35s var(--ease),transform .35s var(--ease)}
.pg-btn::before{content:"";position:absolute;inset:0;z-index:-1;border-radius:inherit;background:var(--act-h);transform:scaleX(0);transform-origin:left;transition:transform .5s var(--ease)}
.pg-btn--ink,.pg-btn--act,.pg-btn--paper{background:var(--act);color:var(--on-act)}
.pg-btn--ink:hover::before,.pg-btn--act:hover::before,.pg-btn--paper:hover::before,.pg-btn--ink:focus-visible::before,.pg-btn--act:focus-visible::before,.pg-btn--paper:focus-visible::before{transform:scaleX(1)}
.pg-btn:active{transform:scale(.98)}
.pg-btn:hover .pg-ar,.pg-link:hover .pg-ar{transform:translate(2px,-2px)}
.pg-btn:has(> .pg-ar:last-child){padding:0 .35rem 0 1.4rem}
.pg-btn>.pg-ar{box-sizing:border-box;width:2.5rem;height:2.5rem;padding:.72rem;margin-left:.35rem;border-radius:50%;background:var(--navy);color:var(--theme-on-dark);transition:transform .4s var(--ease),box-shadow .35s var(--ease),background-color .35s var(--ease),color .35s var(--ease)}
.pg-btn:hover>.pg-ar{transform:translate(2px,-2px);box-shadow:0 0 0 3px color-mix(in srgb,var(--theme-white) 35%,transparent)}
.pg-btn--line,.pg-btn--ghost{background:transparent;box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--theme-ink) 24%,transparent);color:var(--ink)}
.pg-btn--line::before,.pg-btn--ghost::before{content:none}
.pg-btn--line:hover,.pg-btn--ghost:hover{box-shadow:inset 0 0 0 1.5px var(--act);background:color-mix(in srgb,var(--act) 10%,transparent)}
.pg-btn--line>.pg-ar,.pg-btn--ghost>.pg-ar{background:var(--theme-surface);color:var(--navy);box-shadow:inset 0 0 0 1px var(--line)}
.pg-btn--line:hover>.pg-ar,.pg-btn--ghost:hover>.pg-ar{box-shadow:inset 0 0 0 1px var(--act)}
/* on deep blue: the secondary button is a white ring; the primary's arrow chip turns dark grey with an orange arrow */
.pg-band .pg-btn--line,.pg-band .pg-btn--ghost,.pg-sec--sky .pg-btn--line,.pg-ctabox .pg-btn--line,.pg-ctabox .pg-btn--ghost,.pg-panel--blue .pg-btn--line,.pg-panel--blue .pg-btn--ghost{box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--theme-white) 45%,transparent);color:var(--theme-white)}
.pg-band .pg-btn--line:hover,.pg-band .pg-btn--ghost:hover,.pg-sec--sky .pg-btn--line:hover,.pg-ctabox .pg-btn--line:hover,.pg-ctabox .pg-btn--ghost:hover,.pg-panel--blue .pg-btn--line:hover,.pg-panel--blue .pg-btn--ghost:hover{box-shadow:inset 0 0 0 1.5px var(--act);background:color-mix(in srgb,var(--theme-white) 6%,transparent)}
.pg-band .pg-btn--ink>.pg-ar,.pg-band .pg-btn--act>.pg-ar,.pg-sec--sky .pg-btn--ink>.pg-ar,.pg-ctabox .pg-btn--ink>.pg-ar,.pg-ctabox .pg-btn--act>.pg-ar,.pg-panel--blue .pg-btn--ink>.pg-ar,.pg-panel--blue .pg-btn--act>.pg-ar{background:var(--on-act);color:var(--act)}

/* ── links: navy at rest on a faint blue line; an orange underline grows under the pointer ── */
.pg-link{display:inline-flex;align-items:center;gap:.5rem;padding-bottom:4px;border:0;font-size:var(--fs-body);font-weight:600;text-decoration:none;color:var(--navy);background:linear-gradient(var(--act),var(--act)) left bottom/0% 1.5px no-repeat,linear-gradient(color-mix(in srgb,var(--accent) 35%,transparent),color-mix(in srgb,var(--accent) 35%,transparent)) left bottom/100% 1px no-repeat;transition:background-size .45s var(--ease),color .3s var(--ease)}
.pg-link:hover,.pg-link:focus-visible{background-size:100% 1.5px,100% 1px;color:var(--act-t)}
.pg-link:hover .pg-ar,.pg-link:focus-visible .pg-ar{transform:translateX(4px)}
.pg-band .pg-link,.pg-ctabox .pg-link,.pg-panel--blue .pg-link{color:var(--theme-white);background:linear-gradient(var(--act),var(--act)) left bottom/0% 1.5px no-repeat,linear-gradient(color-mix(in srgb,var(--theme-white) 35%,transparent),color-mix(in srgb,var(--theme-white) 35%,transparent)) left bottom/100% 1px no-repeat}
.pg-band .pg-link:hover,.pg-ctabox .pg-link:hover,.pg-panel--blue .pg-link:hover{color:var(--theme-white);background-size:100% 1.5px,100% 1px}
/* a card's "Learn more": the words and an outlined arrow circle that fills orange when the link or its card is hovered */
.pg-more{display:inline-flex;align-items:center;gap:.75rem;font-size:var(--fs-body);font-weight:600;color:var(--navy);text-decoration:none}
.pg-more>.pg-ar{box-sizing:border-box;width:2.25rem;height:2.25rem;padding:.6rem;border-radius:50%;box-shadow:inset 0 0 0 1px var(--line);color:var(--navy);transition:background-color .35s var(--ease),color .35s var(--ease),box-shadow .35s var(--ease),transform .4s var(--ease)}
.pg-more:hover>.pg-ar,.pg-more:focus-visible>.pg-ar,.pg-cardx:hover .pg-more>.pg-ar,.pg-cardx:focus-within .pg-more>.pg-ar{background:var(--act);color:var(--on-act);box-shadow:inset 0 0 0 1px var(--act);transform:translate(2px,-2px)}
/* a button with its arrow in a small circle of its own (kept for compatibility) */
.pg-cbtn{display:inline-flex;align-items:center;justify-content:space-between;gap:.9rem;height:3rem;padding:0 .3rem 0 1.1rem;border:0;border-radius:var(--r-pill);background:none;box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--theme-ink) 22%,transparent);font-family:inherit;font-size:var(--fs-body);font-weight:600;color:var(--ink);text-decoration:none;white-space:nowrap;cursor:pointer;transition:background-color .3s var(--ease),color .3s var(--ease),box-shadow .3s var(--ease)}
.pg-cbtn > i{display:grid;place-items:center;width:2.4rem;height:2.4rem;flex:none;border-radius:50%;background:var(--navy);color:var(--theme-on-dark);font-style:normal;transition:background-color .3s,color .3s}
.pg-cbtn:hover{background:var(--act);color:var(--on-act);box-shadow:none}
.pg-cbtn:hover .pg-ar{transform:translate(1px,-1px)}
.pg-cbtn--ink{background:var(--act);color:var(--on-act);box-shadow:none}
.pg-cbtn--ink:hover{background:var(--act-h)}
/* words for screen readers only */
.pg-vh{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
/* focus: a 2px blue ring (never orange, so it shows on orange fills too); a light-blue ring on deep blue */
.pg a:focus-visible,.pg button:focus-visible,.pg select:focus-visible,.pg input:focus-visible,.pg textarea:focus-visible,.pg summary:focus-visible,.pg [tabindex]:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.pg .pg-band :focus-visible,.pg .pg-sec--sky :focus-visible,.pg .pg-ctabox :focus-visible,.pg .pg-panel--blue :focus-visible{outline-color:var(--theme-focus-on-dark)}

/* ── section heads: the blue eyebrow (a rule ending in a survey-point diamond), the heading, an optional line ── */
.pg-mark{display:flex;align-items:center;gap:.6rem;margin:0;font-size:var(--fs-body);font-weight:600;color:var(--accent)}
.pg-idx{font-variant-numeric:tabular-nums;font-weight:600;color:var(--navy)}
.pg-rule{position:relative;flex:none;width:1.75rem;height:2px;margin-right:.2rem;background:var(--accent);transform-origin:left;transition:transform .7s var(--ease) .1s}
.pg-rule::after{content:"";position:absolute;right:-3px;top:-2px;width:6px;height:6px;background:inherit;transform:rotate(45deg)}
.rv-pending .pg-rule{transform:scaleX(0)}
.pg-band .pg-mark,.pg-sec--sky .pg-mark,.pg-ctabox .pg-mark,.pg-panel--blue .pg-mark,.pg-band .pg-idx,.pg-sec--sky .pg-idx,.pg-ctabox .pg-idx{color:color-mix(in srgb,var(--theme-on-dark) 80%,transparent)}
.pg-band .pg-rule,.pg-sec--sky .pg-rule,.pg-ctabox .pg-rule,.pg-panel--blue .pg-rule{background:color-mix(in srgb,var(--theme-on-dark) 80%,transparent)}
.pg-shead{display:flex;flex-direction:column;align-items:flex-start;gap:.8rem;margin-bottom:clamp(2rem,5vh,3.2rem)}
.pg-shead--center{align-items:center;text-align:center}
.pg-shead--center .pg-h2,.pg-shead--center .pg-lede{margin-inline:auto}
.pg-shead--split{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:end;gap:1.2rem 3rem}
.pg-shl{display:flex;flex-direction:column;align-items:flex-start;gap:.8rem;min-width:0}
.pg-shead--split>.pg-sextra{margin:0}
.pg-h2{margin:0;font-family:var(--display);font-weight:600;font-size:var(--fs-title);line-height:1.12;letter-spacing:-.02em;text-wrap:balance;max-width:26ch}
.pg-h3{margin:0;font-family:var(--display);font-weight:600;font-size:var(--fs-sub);line-height:1.25;letter-spacing:-.015em}
/* two-tone headings: the accent words in brand blue */
.pg-acc{color:var(--accent)}
.pg-lede{margin:.5rem 0 0;max-width:44rem;font-size:var(--fs-body);line-height:1.65;color:var(--ink2);text-wrap:pretty}
.pg-sextra{margin-top:.4rem}

/* ── cards: white with a hairline; a clickable card lifts, its photo zooms and an orange bar grows along its foot ── */
.pg-card{border-radius:var(--r-card);background:var(--card);box-shadow:inset 0 0 0 1px var(--line);transition:transform .35s var(--ease),box-shadow .35s var(--ease)}
.pg-cardx{position:relative;overflow:hidden;transition:transform .35s var(--ease),box-shadow .35s var(--ease)}
.pg-cardx::after{content:"";position:absolute;left:0;right:0;bottom:0;z-index:2;height:3px;background:var(--act);transform:scaleX(0);transform-origin:left;transition:transform .4s var(--ease);pointer-events:none}
.pg-cardx:hover,.pg-cardx:focus-within{transform:translateY(-4px);box-shadow:var(--lift)}
.pg-card.pg-cardx:hover,.pg-card.pg-cardx:focus-within{box-shadow:inset 0 0 0 1px var(--line),var(--lift)}
.pg-cardx:hover::after,.pg-cardx:focus-within::after{transform:scaleX(1)}

/* ── stats strip on a deep-blue band ── */
.pg-stats{display:grid;grid-template-columns:repeat(var(--n,4),minmax(0,1fr));margin:0;padding:0;list-style:none}
.pg-stats>li{min-width:0;padding:clamp(1.2rem,3vh,2rem) clamp(1rem,2.5vw,2rem);border-left:1px solid color-mix(in srgb,var(--theme-white) 16%,transparent)}
.pg-stats>li:first-child{border-left:0;padding-left:0}
.pg-stat-n{display:block;font-family:var(--display);font-size:var(--fs-title);font-weight:600;line-height:1;letter-spacing:-.02em;color:var(--theme-on-dark);font-variant-numeric:tabular-nums}
.pg-stat-l{display:block;margin-top:.55rem;font-size:var(--fs-body);line-height:1.4;color:var(--band-mute)}

/* ── closing call to action: a chamfered deep-blue panel, hatched along its top, with a faint grid fading in at the right ── */
.pg-cta{padding:clamp(3rem,8vh,5.5rem) 0}
.pg-ctabox{position:relative;isolation:isolate;overflow:hidden;padding:calc(clamp(1.8rem,4vw,3.4rem) + 6px) clamp(1.8rem,4vw,3.4rem) clamp(1.8rem,4vw,3.4rem);border-radius:var(--r-card);background:var(--band);color:var(--theme-white);clip-path:polygon(calc(var(--cut) * 1.4) 0,100% 0,100% 100%,0 100%,0 calc(var(--cut) * 1.4))}
.pg-ctabox::before{content:"";position:absolute;left:0;right:0;top:0;z-index:-1;height:12px;background:var(--hatch-img);pointer-events:none}
.pg-ctabox::after{content:"";position:absolute;inset:0;z-index:-1;background-image:linear-gradient(var(--hatch) 1px,transparent 1px),linear-gradient(90deg,var(--hatch) 1px,transparent 1px);background-size:32px 32px;-webkit-mask-image:linear-gradient(90deg,transparent 55%,black);mask-image:linear-gradient(90deg,transparent 55%,black);opacity:.6;pointer-events:none}
.pg-ctahead{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:1.6rem 3rem}
.pg-ctah{margin:0;max-width:22ch;font-family:var(--display);font-weight:600;font-size:var(--fs-title);line-height:1.12;letter-spacing:-.02em;text-wrap:balance}
.pg-ctaacts{display:flex;flex-wrap:wrap;gap:.7rem}
.pg-ctasteps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1.4rem;margin:clamp(2rem,5vh,3rem) 0 0;padding:clamp(1.4rem,3vh,2rem) 0 0;list-style:none;border-top:1px dashed color-mix(in srgb,var(--theme-white) 25%,transparent)}
.pg-ctasteps li{display:flex;gap:.9rem;min-width:0}
.pg-ctan{display:grid;place-items:center;flex:none;width:2rem;height:2rem;border-radius:var(--r-ctl);background:transparent;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-white) 40%,transparent);color:var(--theme-white);font-family:var(--display);font-weight:600;font-size:var(--fs-body);font-variant-numeric:tabular-nums}
.pg-ctast{margin:.15rem 0 0;font-size:var(--fs-body);font-weight:600;line-height:1.35}
.pg-ctasd{margin:.3rem 0 0;max-width:20rem;font-size:var(--fs-body);line-height:1.55;color:var(--band-mute);text-wrap:pretty}
.pg-ctaline{display:flex;flex-wrap:wrap;align-items:baseline;gap:.4rem 1.6rem;margin:clamp(1.6rem,4vh,2.2rem) 0 0;font-size:var(--fs-body);color:var(--band-mute)}
.pg-ctaline a{padding-bottom:2px;color:var(--theme-white);text-decoration:none;background:linear-gradient(var(--act),var(--act)) left bottom/0% 1.5px no-repeat;transition:background-size .45s var(--ease)}
.pg-ctaline a:hover,.pg-ctaline a:focus-visible{background-size:100% 1.5px}
.pg-ctaline .pg-ctatel{font-family:var(--display);font-weight:600;font-size:var(--fs-sub);color:var(--theme-white)}

@media (max-width:1023px){
  .pg-head--aside .pg-headgrid{grid-template-columns:1fr}
  .pg-ctasteps{grid-template-columns:1fr}
}
@media (max-width:899px){
  .pg-bgrid{grid-template-columns:minmax(0,1fr)}
  .pg-bmedia>.pg-media,.pg-bmedia>.pg-ph{aspect-ratio:16/10}
  .pg-bfact{left:.75rem}
}
@media (max-width:767px){
  .pg{--cut:clamp(.77rem,1.4vw,1.22rem)}
  .pg-head{padding:calc(var(--nav-room) + 2rem) 0 2.2rem}
  .pg-head.pg-banner{padding:calc(var(--nav-room) + 1.6rem) 0 calc(2.6rem + 12px)}
  .pg-actions .pg-btn{flex:1 1 auto}
  .pg-sec{padding:3.2rem 0}
  .pg-shead{margin-bottom:1.6rem}
  .pg-shead--split{grid-template-columns:minmax(0,1fr)}
  .pg-stats{grid-template-columns:repeat(2,minmax(0,1fr))}
  .pg-stats>li,.pg-stats>li:first-child{padding:1.1rem 1rem}
  .pg-stats>li:nth-child(odd){border-left:0;padding-left:0}
  .pg-stats>li:nth-child(n+3){border-top:1px solid color-mix(in srgb,var(--theme-white) 16%,transparent)}
  .pg-cta{padding:2.4rem 0 3rem}
  .pg-ctabox{padding:1.9rem 1.2rem 1.5rem}
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
@media (prefers-reduced-motion:reduce){
  .pg *,.pg *::before,.pg *::after{transition:none!important;animation:none!important}
  .pg .pg-cardx:hover,.pg .pg-cardx:focus-within,.pg .pg-btn:active{transform:none}
  .pg .pg-media>img{transform:none!important}
  .pg .rv-pending .pg-rule{transform:none}
}

/* ═══ PROTECTED - Projects header must not change ═══
   The buttons above changed site-wide; these rules put the Projects page
   header's buttons (.pj-hero) back exactly as they were. Keep them last. */
.pj-hero .pg-btn,.pj-hero .pg-btn:has(> .pg-ar:last-child){height:min(3.25rem,6.4svh);min-height:2.75rem;padding:0 1.5rem;gap:.6rem;border-radius:10px;overflow:visible;isolation:auto;transition:background-color .3s,color .3s,border-color .3s;transform:none}
.pj-hero .pg-btn:active{transform:none}
.pj-hero .pg-btn::before{content:none}
.pj-hero .pg-btn--ink{background:var(--navy);color:var(--theme-on-dark)}
.pj-hero .pg-btn--ink:hover{background:var(--accent)}
.pj-hero .pg-btn--line{box-shadow:none;border:1px solid color-mix(in srgb,var(--theme-ink) 32%,transparent);color:var(--ink);background:none}
.pj-hero .pg-btn--line:hover{box-shadow:none;border-color:var(--navy);background:color-mix(in srgb,var(--theme-ink) 4%,transparent)}
.pj-hero .pg-btn>.pg-ar{width:15px;height:15px;padding:0;margin:0;border-radius:0;background:none;color:inherit;box-shadow:none;transition:transform .4s cubic-bezier(.2,.7,.2,1)}
.pj-hero .pg-btn:hover>.pg-ar{transform:translate(2px,-2px);box-shadow:none}
`;
