/**
 * Waterproofing page, kept to what RPC's "Types of Waterproofing Methods"
 * document says:
 *
 *   opening   the shared banner: the title, the ways to start and a cut-away
 *             photo with the guide's size on it; then
 *             "Where is the water getting in?": the eight places our services
 *             cover, on a drawing of a house (lib/pages/methods-tools.ts)
 *   rain test pick a method and watch where it stops the water (lib/pages/methods-rain.ts)
 *   methods   the twelve methods in their four kinds, one row each with where
 *             it is mainly used and how it goes on; opened, how it works, what
 *             to keep in mind, and the products on our list of that kind
 *   brands    the brands it lists, as their logos, moving slowly left to right
 *   close     the ways to start
 *
 * Links to /waterproofing#m-<key> open that method, and #a-<key> opens that
 * place on the drawing.
 */
import { BRAND_LOGOS } from "../methods/brand-logos";
import { METHOD_GROUPS, METHODS, type Method } from "../methods/data";
import { BRAND_SPECIALITY, FOSROC_BY_METHOD } from "../methods/doc";
import type { Product } from "../products";
import { arrow, banner, ctaBand, esc, shot, waGlyph, type ContactInfo, type PageOptions } from "./kit";
import { MAP_PLACES, methodsData, METHODS_TOOLS_CSS, placeMapMarkup, wpHead } from "./methods-tools";
import { RAIN_CSS, rainMarkup } from "./methods-rain";

export interface MethodsData {
  products: readonly Product[];
  contact: ContactInfo;
}

export const METHODS_TRAIL = [
  { name: "Home", href: "/" },
  { name: "Waterproofing", href: "/waterproofing" },
] as const;

/** the brands on RPC's product list, for marking them among the document's brands */
const STOCKED = ["Fosroc", "Sika", "Berger"];
const stocked = (b: string) => STOCKED.some((s) => b.toLowerCase().startsWith(s.toLowerCase()));

/** the document's brands, those on our list first (otherwise in the document's order) */
const BRANDS = [...BRAND_SPECIALITY].sort((x, y) => Number(stocked(y.brand)) - Number(stocked(x.brand)));

/** small numbers in words, for sentences ("twelve methods") */
const NUM = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
const say = (n: number) => NUM[n] ?? String(n);

const plus = `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4v12M4 10h12" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`;
/** a map pin, before the places a method is mainly used */
const PIN = `<svg class="wp-pin" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14.2s4.6-4.1 4.6-7.6a4.6 4.6 0 0 0-9.2 0c0 3.5 4.6 7.6 4.6 7.6z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><circle cx="8" cy="6.5" r="1.6" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>`;
const TICK = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const MIND = `<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 4.8v4M8 11.1v.1" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`;

/** the opening's cut-away photo (1920 x 1080) */
const HEAD_SHOT = "/images/waterproofing/basement-wall-cutaway.jpg";
/**
 * Its smaller copies, made by Next's image optimiser (widths from
 * next.config's deviceSizes, at its default quality), so a phone loads a
 * copy of about 25 KB instead of the 300 KB original.
 */
const HEAD_SRCSET = [640, 828, 1080, 1440]
  .map((w) => `/_next/image?url=${encodeURIComponent(HEAD_SHOT)}&w=${w}&q=75 ${w}w`)
  .concat(`${HEAD_SHOT} 1920w`)
  .join(", ");

/** a method as one row: its name, how it goes on and where it is mainly used; opened, the rest of what the guide says */
function methodRow(m: Method, products: readonly Product[]) {
  const ps = m.products.map((s) => products.find((p) => p.slug === s)).filter((p): p is Product => Boolean(p));
  // Fosroc products the guide names for this kind of method that are not on our list
  const also = FOSROC_BY_METHOD.filter((f) => f.methods.includes(m.key))
    .flatMap((f) => f.products)
    .filter((p) => !p.slug);
  const prods = [
    ps.length ? `<p><span>On our product list</span>${ps.map((p) => `<a href="/products#${p.slug}" data-internal>${esc(p.name)}${arrow}</a>`).join("")}</p>` : "",
    also.length ? `<p><span>Also from Fosroc</span>${also.map((p) => `<b>${esc(p.name)}</b>`).join("")}</p>` : "",
  ].join("");
  return `<li class="wp-row" id="m-${m.key}">
  <details class="wp-d">
    <summary class="wp-sum">
      <span class="wp-sn"><span class="wp-sname">${esc(m.name)}</span><span class="wp-sapp">${esc(m.applied)}</span></span>
      <span class="wp-sareas">${PIN}<span>${esc(m.areas)}</span></span>
      <span class="wp-plus">${plus}</span>
    </summary>
    <div class="wp-body">
      <p class="wp-how">${esc(m.how)}</p>
      <dl class="wp-notes">
        <div class="is-good"><dt>${TICK}Good to know</dt><dd>${esc(m.notes[0])}</dd></div>
        <div class="is-mind"><dt>${MIND}Keep in mind</dt><dd>${esc(m.notes[1])}</dd></div>
      </dl>
      ${prods ? `<div class="wp-foot"><div class="wp-prods">${prods}</div></div>` : ""}
    </div>
  </details>
</li>`;
}

/** what each kind's picture shows (a rendered cut-away, in /public/images/methods) */
const KIND_ALT: Readonly<Record<string, string>> = {
  coat: "A concrete slab with a waterproof coat applied over its surface",
  sheet: "A sheet membrane unrolled over a concrete slab, two sheets lapped where they meet",
  concrete: "A concrete block with crystals grown in its pores, near the surface",
  joint: "Two concrete pours with a waterstop cast across the joint and a sealant at the top",
};

/** one kind of method: a card with a picture of where it keeps the water out, and its methods as a panel of rows */
function kindBlock(g: (typeof METHOD_GROUPS)[number], products: readonly Product[]) {
  const ms = METHODS.filter((m) => m.group === g.key);
  return `<section class="wp-kind" aria-labelledby="wp-k-${g.key}">
  <div class="wp-khead" data-rv>
    <div class="wp-kart"><img src="/images/methods/${g.key}.webp" width="900" height="438" alt="${esc(KIND_ALT[g.key] ?? "")}" loading="lazy" decoding="async"></div>
    <h3 class="wp-kname" id="wp-k-${g.key}">${esc(g.label)}</h3>
    <p class="wp-kline">${esc(g.line)}</p>
    <p class="wp-kn">${ms.length} method${ms.length === 1 ? "" : "s"}</p>
  </div>
  <ul class="wp-rows" data-rv>${ms.map((m) => methodRow(m, products)).join("")}</ul>
</section>`;
}

export function methodsPageMarkup(d: MethodsData, o: PageOptions = {}) {
  void o;
  const c = d.contact;
  // the opening: the shared banner, with a cut-away photo and the guide's size (counted from the data)
  const head = banner({
    n: "01",
    label: "Waterproofing",
    // "a&nbsp;building." stays one word, so the line never ends on "a"
    title: "Waterproofing methods for every part of a&nbsp;building.",
    accentFrom: 3,
    intro: `Where the water gets in decides the method. Find the place on the house, watch where each method stops the water, then read how all ${say(METHODS.length)} go on.`,
    actions: `<a class="pg-btn pg-btn--ink" href="/contact#enquiry" data-internal>Book a free site inspection${arrow}</a><a class="pg-btn pg-btn--line" href="${esc(c.whatsapp)}" target="_blank" rel="noopener noreferrer">${waGlyph}Send us a photo on WhatsApp</a>`,
    // the kit's shot(), with the smaller copies added (the browser picks one by `sizes`)
    media: shot(HEAD_SHOT, "Cutaway of a basement wall with its waterproofing", "wp-hshot", true, {
      size: [1920, 1080],
      sizes: "(max-width: 899px) 100vw, 42vw",
    }).replace("<img ", `<img srcset="${esc(HEAD_SRCSET)}" `),
    // the places mapped in the next section (the h2 further down already counts the methods)
    fact: { n: `${MAP_PLACES.length} places`, label: "on the house, mapped below" },
    cls: "wp-head",
  });

  const methods = `<section class="pg-sec wp-msec" id="methods" aria-labelledby="wp-m-h">
  <div class="pg-wrap">
    ${wpHead({ n: "04", label: "From our methods guide", title: "Twelve methods, in four kinds.", acc: 2, id: "wp-m-h", lede: "Open one to see how it works, what is good to know and what to keep in mind. The final choice is made on site, once we know where the water is coming from." })}
    <div class="wp-kinds">${METHOD_GROUPS.map((g) => kindBlock(g, d.products)).join("")}</div>
  </div>
</section>`;

  // light follows light here, so a measuring-ruler strip marks the seam
  const brands = `<section class="pg-sec pg-sec--white pg-seam wp-bsec" id="brands" aria-labelledby="wp-b-h">
  <div class="pg-wrap">
    ${wpHead({ n: "05", label: "Brands", title: "The brands in our methods guide.", acc: 4, id: "wp-b-h" })}
    <div class="wp-marq" role="region" aria-label="The brands, moving slowly; hover to pause">
      <ul class="wp-mtrack">${[0, 1]
        .map((copy) =>
          BRANDS.map((b) => {
            const logo = BRAND_LOGOS[b.brand];
            return `<li class="wp-btile${logo ? "" : " wp-btile--name"}"${copy ? ` aria-hidden="true"` : ""}>${logo ? `<img src="/images/brands/${esc(logo)}" alt="${copy ? "" : esc(b.brand)}" loading="lazy" decoding="async">` : `<span class="wp-bname">${esc(b.brand)}</span>`}</li>`;
          }).join(""),
        )
        .join("")}</ul>
    </div>
  </div>
</section>`;

  return `${head}\n${placeMapMarkup()}\n${rainMarkup()}\n${methods}\n${methodsData(d.products)}\n${brands}\n${ctaBand(c, {
    title: "Not sure which method your building needs?",
    steps: [
      ["Show us where it leaks", "Photos on WhatsApp are a good start."],
      ["We trace the water", "Where it gets in decides the method, not the other way round."],
      ["You get a method for your building", "The system, the products and the area it covers, in writing."],
    ],
  })}`;
}

/* ---------------------------------------------------------------- CSS */
const BASE_CSS = `
/* opening: the shared banner (kit); the cut-away photo keeps the basement in view.
   It stays 4:3 at every width (the kit turns banner photos 16:10 on narrow
   screens): a wider frame would bring the generator's mark at the photo's
   bottom right edge into view */
.pg-bmedia>.wp-hshot{aspect-ratio:4/3}
.wp-hshot>img{object-position:50% 60%}

/* the chamfered cards on this page (the kind cards, the map frame's twin): a hairline along the cut corner */
.wp-khead::before{content:"";position:absolute;left:0;top:0;z-index:1;width:var(--cut);height:var(--cut);background:linear-gradient(135deg,transparent 50%,var(--line) 50%,var(--line) calc(50% + 1.2px),transparent calc(50% + 1.2px));pointer-events:none}

/* the twelve methods, kind by kind: the kind as a sticky white card at the left (4 of 12),
   its methods as a white panel of hairline rows at the right (8 of 12) */
.wp-msec{scroll-margin-top:var(--nav-bar,80px)}
.wp-kinds{display:flex;flex-direction:column;gap:clamp(1.8rem,4.5vh,2.8rem)}
.wp-kind{display:grid;grid-template-columns:minmax(0,4fr) minmax(0,8fr);gap:1.2rem clamp(1.4rem,3vw,2.6rem);align-items:start}
.wp-khead{position:sticky;top:calc(var(--nav-bar,80px) + 1.4rem);padding:clamp(1rem,1.6vw,1.3rem);border-radius:var(--r-card);background:var(--card);box-shadow:inset 0 0 0 1px var(--line);clip-path:polygon(var(--cut) 0,100% 0,100% 100%,0 100%,0 var(--cut))}
.wp-kart{margin:0 0 1.1rem;padding:.6rem .9rem;border-radius:var(--r-ctl);background-color:var(--theme-bg);background-image:linear-gradient(var(--bp) 1px,transparent 1px),linear-gradient(90deg,var(--bp) 1px,transparent 1px);background-size:16px 16px}
.pg .wp-kart img{display:block;width:100%;height:auto}
.wp-kname{margin:0;font-family:var(--display);font-weight:600;font-size:var(--fs-sub);line-height:1.2;letter-spacing:-.01em;color:var(--ink)}
.wp-kline{margin:.35rem 0 0;font-size:var(--fs-body);line-height:1.5;color:var(--mute)}
/* the count is plain text, not a pill (pills on this page are things to click) */
.wp-kn{margin:.75rem 0 0;font-size:var(--fs-body);font-weight:600;line-height:1.4;color:var(--mute);font-variant-numeric:tabular-nums}
.wp-rows{margin:0;padding:0;list-style:none;overflow:hidden;border-radius:var(--r-card);background:var(--card);box-shadow:inset 0 0 0 1px var(--line)}
.wp-row{position:relative;scroll-margin-top:calc(var(--nav-bar,80px) + 1.2rem)}
.wp-row + .wp-row{border-top:1px solid var(--line)}
/* an open method: a blue bar down its left edge */
.wp-row::before{content:"";position:absolute;left:0;top:0;bottom:0;z-index:1;width:3px;background:var(--accent);transform:scaleY(0);transform-origin:top;transition:transform .3s var(--ease);pointer-events:none}
.wp-row:has(> .wp-d[open])::before{transform:scaleY(1)}
.wp-sum{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.9fr) 2.5rem;gap:.35rem 2rem;align-items:center;padding:1.2rem 1.3rem 1.2rem 1.5rem;list-style:none;cursor:pointer;transition:background-color .25s var(--ease)}
.wp-sum::-webkit-details-marker{display:none}
.wp-d:not([open]) > .wp-sum:hover{background:color-mix(in srgb,var(--theme-primary-soft) 55%,transparent)}
.pg .wp-sum:focus-visible{outline:2px solid var(--accent);outline-offset:-3px}
.wp-sn{display:flex;flex-direction:column;gap:.25rem;min-width:0}
.wp-sname{font-family:var(--display);font-weight:600;font-size:var(--fs-sub);line-height:1.25;letter-spacing:-.01em;color:var(--ink)}
.wp-sapp{font-size:var(--fs-body);line-height:1.45;color:var(--mute)}
.wp-sareas{display:flex;align-items:flex-start;gap:.45rem;min-width:0;font-size:var(--fs-body);line-height:1.5;color:var(--mute)}
.wp-pin{flex:none;width:1rem;height:1rem;margin-top:.2rem;color:var(--accent)}
/* the open / close control: an outline at rest, an orange ring under the pointer, orange and turned to a cross when open */
.wp-plus{display:grid;place-items:center;width:2.5rem;height:2.5rem;border-radius:50%;box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--theme-ink) 22%,transparent);color:var(--navy);transition:transform .35s var(--ease),background-color .25s var(--ease),color .25s var(--ease),box-shadow .25s var(--ease)}
.wp-plus svg{width:1.05rem;height:1.05rem}
.wp-sum:hover .wp-plus,.wp-sum:focus-visible .wp-plus{box-shadow:inset 0 0 0 1.5px var(--act)}
.wp-d[open] .wp-plus{transform:rotate(45deg);background:var(--navy);box-shadow:none;color:var(--theme-on-dark)}
.wp-d[open] .wp-sum:hover .wp-plus,.wp-d[open] .wp-sum:focus-visible .wp-plus{box-shadow:0 0 0 2px var(--theme-surface),0 0 0 3.5px var(--act)}
/* a method named elsewhere on the page: a blue ring for a moment */
.wp-row.is-hit > .wp-d{box-shadow:inset 0 0 0 2px var(--accent);animation:wp-hit 1.2s var(--ease) 1s forwards}
@keyframes wp-hit{to{box-shadow:inset 0 0 0 2px transparent}}
/* opened: how it works, the two notes side by side, the products */
.wp-body{display:flex;flex-direction:column;gap:1.1rem;padding:0 1.3rem 1.5rem 1.5rem}
.wp-d[open] .wp-body{animation:wp-in .4s var(--ease) both}
@keyframes wp-in{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
.wp-how{margin:0;max-width:66ch;font-size:var(--fs-body);line-height:1.65;color:var(--ink2)}
.wp-notes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.75rem;margin:0}
.wp-notes>div{min-width:0;padding:.9rem 1rem;border-radius:var(--r-ctl)}
.wp-notes .is-good{background:color-mix(in srgb,var(--theme-primary-soft) 70%,transparent)}
.wp-notes .is-mind{background:var(--theme-bg)}
.wp-notes dt{display:flex;align-items:center;gap:.45rem;font-size:var(--fs-body);font-weight:600}
.wp-notes dt svg{flex:none;width:1rem;height:1rem}
.wp-notes .is-good dt{color:var(--accent)}
.wp-notes .is-mind dt{color:var(--mute)}
.wp-notes dd{margin:.3rem 0 0;font-size:var(--fs-body);line-height:1.55;color:var(--ink)}
.wp-foot{padding-top:1.1rem;border-top:1px dashed var(--line)}
.wp-foot:empty{display:none}
.wp-prods{display:flex;flex-direction:column;gap:.7rem;min-width:0}
.wp-prods p{display:flex;flex-wrap:wrap;align-items:center;gap:.45rem;margin:0;font-size:var(--fs-body)}
.wp-prods p>span{margin-right:.4rem;color:var(--mute)}
/* products on our list are links: outline pills with a navy arrow, an orange ring under the pointer */
.wp-prods a,.wp-prods b{display:inline-flex;align-items:center;gap:.45rem;min-height:2.25rem;padding:.3rem .95rem;border-radius:var(--r-pill);font-weight:600;line-height:1.3}
.wp-prods a{padding-right:.75rem;background:var(--card);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 22%,transparent);color:var(--navy);text-decoration:none;transition:box-shadow .25s var(--ease),background-color .25s var(--ease)}
.wp-prods a .pg-ar{width:13px;height:13px}
.wp-prods a:hover{box-shadow:inset 0 0 0 1.5px var(--act);background:color-mix(in srgb,var(--act) 8%,transparent)}
.wp-prods a:hover .pg-ar{transform:translate(2px,-2px)}
.wp-prods b{font-weight:500;background:var(--theme-bg);color:var(--ink2)}

/* opening a method slides its details down (where the browser can animate to the content's height) */
.wp-d{interpolate-size:allow-keywords}
.wp-d::details-content{height:0;overflow:clip;transition:height .4s var(--ease),content-visibility .4s allow-discrete}
.wp-d[open]::details-content{height:auto}

/* brands: a white section after the grey methods, a ruler along the seam; the logos move slowly, hover (or focus) pauses them.
   The tiles are not links, so they do not react to the pointer: the logos sit in grey at full strength */
.wp-bsec .pg-shead{margin-bottom:clamp(1.4rem,3.5vh,2.2rem)}
.wp-marq{margin-inline:calc(-1 * var(--gutter,16px));overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,black 6%,black 94%,transparent);mask-image:linear-gradient(90deg,transparent,black 6%,black 94%,transparent)}
.wp-mtrack{display:flex;gap:.9rem;width:max-content;margin:0;padding:.4rem 0;list-style:none;animation:wp-marq 70s linear infinite}
.wp-marq:hover .wp-mtrack,.wp-marq:focus-within .wp-mtrack{animation-play-state:paused}
@keyframes wp-marq{from{transform:translateX(-50%)}to{transform:translateX(0)}}
.wp-btile{display:grid;place-items:center;flex:none;width:12.5rem;height:6rem;box-sizing:border-box;padding:.9rem 1.4rem;border-radius:var(--r-card);background:var(--card);box-shadow:inset 0 0 0 1px var(--line)}
/* the logo fills the tile's box (so the lazy image has a size to be found by as it slides in) and is fitted inside it */
.pg .wp-btile img{display:block;width:100%;height:100%;max-height:4rem;object-fit:contain;filter:grayscale(1)}
.wp-bname{font-family:var(--display);font-weight:600;font-size:var(--fs-sub);line-height:1.2;letter-spacing:-.01em;color:var(--ink2);text-align:center}
@media (prefers-reduced-motion:reduce){
  .wp-d[open] .wp-body{animation:none}
  .wp-d::details-content{transition:none}
  .wp-marq{margin-inline:0;-webkit-mask-image:none;mask-image:none}
  .wp-mtrack{flex-wrap:wrap;width:auto;animation:none}
  .wp-mtrack li[aria-hidden]{display:none}
}

@media (max-width:1023px){
  /* the kind's picture and name above its methods, so the rows get the full width */
  .wp-kind{grid-template-columns:minmax(0,1fr);gap:.9rem}
  .wp-khead{position:relative;top:auto;display:grid;grid-template-columns:11rem minmax(0,1fr);grid-template-rows:auto auto auto;column-gap:1.3rem;align-content:center}
  .wp-kart{grid-row:1 / span 3;align-self:center;margin:0}
  .wp-kname{align-self:end}
  .wp-kn{justify-self:start;margin-top:.6rem}
}
@media (max-width:767px){
  .wp-sum{grid-template-columns:minmax(0,1fr) 2.4rem;gap:.4rem 1rem;padding:1rem 1rem 1rem 1.15rem}
  .wp-sareas{grid-column:1;grid-row:2}
  .wp-plus{grid-column:2;grid-row:1 / span 2;width:2.4rem;height:2.4rem}
  .wp-body{padding:0 1rem 1.2rem 1.15rem}
  .wp-notes{grid-template-columns:minmax(0,1fr)}
  .wp-btile{width:10.5rem;height:5.2rem;padding:.8rem 1.1rem}
  .pg .wp-btile img{max-height:3.4rem}
}
@media (max-width:599px){
  .wp-khead{grid-template-columns:7rem minmax(0,1fr);column-gap:1rem}
  .wp-kart{padding:.4rem .5rem}
}
`;

export const METHODS_PAGE_CSS = BASE_CSS + METHODS_TOOLS_CSS + RAIN_CSS;
