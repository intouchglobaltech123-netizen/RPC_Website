/**
 * Waterproofing page, kept to what RPC's "Types of Waterproofing Methods"
 * document says:
 *
 *   opening   the title and the ways to start; then
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
import { arrow, ctaBand, esc, secHead, type ContactInfo, type PageOptions } from "./kit";
import { methodsData, METHODS_TOOLS_CSS, placeMapMarkup } from "./methods-tools";
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

const plus = `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4v12M4 10h12" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`;
const TICK = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const MIND = `<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 4.8v4M8 11.1v.1" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`;

/** a method as one row: its name, how it goes on and where it is mainly used; opened, the rest of what the guide says */
function methodRow(m: Method, products: readonly Product[]) {
  const ps = m.products.map((s) => products.find((p) => p.slug === s)).filter((p): p is Product => Boolean(p));
  // Fosroc products the guide names for this kind of method that are not on our list
  const also = FOSROC_BY_METHOD.filter((f) => f.methods.includes(m.key))
    .flatMap((f) => f.products)
    .filter((p) => !p.slug);
  const prods = [
    ps.length ? `<p><span>On our product list</span>${ps.map((p) => `<a href="/products#${p.slug}" data-internal>${esc(p.name)}</a>`).join("")}</p>` : "",
    also.length ? `<p><span>Also from Fosroc</span>${also.map((p) => `<b>${esc(p.name)}</b>`).join("")}</p>` : "",
  ].join("");
  return `<li class="wp-row" id="m-${m.key}">
  <details class="wp-d">
    <summary class="wp-sum">
      <span class="wp-sn"><span class="wp-sname">${esc(m.name)}</span><span class="wp-sapp">${esc(m.applied)}</span></span>
      <span class="wp-sareas">${esc(m.areas)}</span>
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

/** one kind of method: a picture of where it keeps the water out, and its methods */
function kindBlock(g: (typeof METHOD_GROUPS)[number], products: readonly Product[]) {
  return `<section class="wp-kind" aria-labelledby="wp-k-${g.key}">
  <div class="wp-khead">
    <div class="wp-kart"><img src="/images/methods/${g.key}.webp" width="900" height="438" alt="${esc(KIND_ALT[g.key] ?? "")}" loading="lazy" decoding="async"></div>
    <h3 class="wp-kname" id="wp-k-${g.key}">${esc(g.label)}</h3>
    <p class="wp-kline">${esc(g.line)}</p>
  </div>
  <ul class="wp-rows">${METHODS.filter((m) => m.group === g.key)
    .map((m) => methodRow(m, products))
    .join("")}</ul>
</section>`;
}

export function methodsPageMarkup(d: MethodsData, o: PageOptions = {}) {
  void o;
  const c = d.contact;
  const head = `<header class="pg-head wp-head">
  <div class="pg-wrap">
    <div class="wp-hgrid">
      <div>
        <p class="pg-mark">Waterproofing</p>
        <h1 class="pg-h1">Waterproofing methods for every part of a&nbsp;building.</h1>
      </div>
      <div class="wp-hside">
        <div class="pg-actions"><a class="pg-btn pg-btn--ink" href="/contact#enquiry" data-internal>Book a free site inspection${arrow}</a><a class="pg-btn pg-btn--line" href="${esc(c.whatsapp)}" target="_blank" rel="noopener noreferrer">Send us a photo on WhatsApp</a></div>
      </div>
    </div>
  </div>
</header>`;

  const methods = `<section class="pg-sec pg-sec--stone wp-msec" id="methods" aria-labelledby="wp-m-h">
  <div class="pg-wrap">
    ${secHead({ label: "From our methods guide", title: "Twelve methods, in four kinds.", id: "wp-m-h", lede: "Open one to see how it works, what is good to know and what to keep in mind. The final choice is made on site, once we know where the water is coming from." })}
    <div class="wp-kinds">${METHOD_GROUPS.map((g) => kindBlock(g, d.products)).join("")}</div>
  </div>
</section>`;

  const brands = `<section class="pg-sec pg-sec--stone wp-bsec" id="brands" aria-labelledby="wp-b-h">
  <div class="pg-wrap">
    ${secHead({ label: "Brands", title: "The brands in our methods guide.", id: "wp-b-h" })}
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
/* opening: the title and the ways to start, with the house straight under them */
.wp-head{padding-bottom:0;border-bottom:0}
.wp-hgrid{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:1.4rem clamp(2rem,6vw,6rem);align-items:end}
.wp-hgrid .pg-mark{margin-bottom:.9rem}
.wp-hgrid .pg-h1{max-width:17ch}
.wp-hside .pg-intro{margin:0;max-width:34rem}

/* the twelve methods, kind by kind */
.wp-kinds{border-top:2px solid var(--ink)}
.wp-kind{display:grid;grid-template-columns:minmax(13rem,16rem) minmax(0,1fr);gap:1.2rem clamp(2rem,5vw,5rem);padding:clamp(1.4rem,3vh,2rem) 0;border-bottom:1px solid rgba(18,34,59,.2)}
.wp-khead{position:sticky;top:calc(var(--nav-bar,80px) + 1.4rem);align-self:start;padding-top:.7rem}
.wp-kart{width:100%;max-width:16rem;margin:0 0 .9rem}
.wp-kart img{display:block;width:100%;height:auto}
.wp-kname{margin:0;font-family:var(--display);font-weight:600;font-size:var(--fs-sub);line-height:1.2;letter-spacing:-.01em}
.wp-kline{margin:.35rem 0 0;max-width:15rem;font-size:var(--fs-body);line-height:1.5;color:var(--mute)}
.wp-rows{margin:0;padding:0;list-style:none}
.wp-row{scroll-margin-top:calc(var(--nav-bar,80px) + 1.2rem)}
.wp-row + .wp-row{border-top:1px solid var(--line)}
.wp-row:has(> .wp-d[open]),.wp-row:has(> .wp-d[open]) + .wp-row{border-top-color:transparent}
.wp-row:has(> .wp-d[open]) + .wp-row:has(> .wp-d[open]){margin-top:.6rem}
.wp-d{border-radius:8px;transition:background-color .25s,box-shadow .25s}
.wp-d[open]{background:var(--card);box-shadow:0 22px 44px -36px rgba(18,34,59,.5)}
.wp-row.is-hit > .wp-d{box-shadow:inset 0 0 0 2px var(--accent),0 0 0 6px rgba(39,86,160,.12)}
.wp-sum{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.95fr) 2.5rem;gap:.3rem 2rem;align-items:center;padding:1.1rem;border-radius:8px;list-style:none;cursor:pointer;transition:background-color .2s}
.wp-sum::-webkit-details-marker{display:none}
.wp-d:not([open]) > .wp-sum:hover{background:rgba(245,240,230,.6)}
.wp-sum:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}
.wp-sn{display:flex;flex-direction:column;gap:.2rem;min-width:0}
.wp-sname{font-family:var(--display);font-weight:600;font-size:var(--fs-sub);line-height:1.25;letter-spacing:-.01em;color:var(--ink)}
.wp-sapp{font-size:var(--fs-body);line-height:1.45;color:var(--mute)}
.wp-sareas{font-size:var(--fs-body);line-height:1.5;color:var(--ink2)}
.wp-plus{display:grid;place-items:center;width:2.5rem;height:2.5rem;border-radius:50%;box-shadow:inset 0 0 0 1.5px rgba(18,34,59,.24);color:var(--ink);transition:transform .3s cubic-bezier(.2,.7,.2,1),background-color .2s,color .2s,box-shadow .2s}
.wp-plus svg{width:1.05rem;height:1.05rem}
.wp-sum:hover .wp-plus{box-shadow:inset 0 0 0 1.5px var(--navy)}
.wp-d[open] .wp-plus{transform:rotate(45deg);background:var(--navy);box-shadow:none;color:#f5f0e6}
.wp-body{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.95fr) 2.5rem;gap:1.2rem 2rem;padding:0 1.1rem 1.3rem}
.wp-d[open] .wp-body{animation:wp-in .3s ease both}
@keyframes wp-in{from{opacity:0}to{opacity:1}}
.wp-how{grid-column:1;margin:0;font-size:var(--fs-body);line-height:1.65;color:var(--ink2)}
.wp-notes{grid-column:2;margin:0}
.wp-notes div + div{margin-top:.8rem}
.wp-notes dt{font-size:var(--fs-body);font-weight:600;color:var(--water)}
.wp-notes dd{margin:.15rem 0 0;font-size:var(--fs-body);line-height:1.55}
.wp-foot{grid-column:1 / -1;display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:.9rem 2rem;padding-top:1rem;border-top:1px solid var(--line)}
.wp-prods{display:flex;flex-direction:column;gap:.6rem;min-width:0}
.wp-prods p{display:flex;flex-wrap:wrap;align-items:center;gap:.4rem;margin:0;font-size:var(--fs-body)}
.wp-prods span{margin-right:.35rem;color:var(--mute)}
.wp-prods a,.wp-prods b{display:inline-flex;align-items:center;min-height:2rem;padding:.25rem .7rem;border-radius:8px;font-weight:600;line-height:1.3}
.wp-prods a{background:var(--navy);color:#f5f0e6;text-decoration:none;transition:background-color .2s}
.wp-prods a:hover{background:var(--accent)}
.wp-prods b{box-shadow:inset 0 0 0 1px rgba(18,34,59,.2)}

/* opening a method slides its details down (where the browser can animate to the content's height) */
.wp-d{interpolate-size:allow-keywords}
.wp-d::details-content{height:0;overflow:clip;transition:height .35s cubic-bezier(.2,.7,.2,1),content-visibility .35s allow-discrete}
.wp-d[open]::details-content{height:auto}
/* the opened details: the notes with their marks, products along the foot */
.wp-notes dt{display:flex;align-items:center;gap:.4rem}
.wp-notes dt svg{flex:none;width:1rem;height:1rem}
.wp-notes .is-good dt{color:#1f7a4f}
.wp-notes .is-mind dt{color:#a35f10}
.wp-foot:empty{display:none}

/* the brands follow the methods on the same background, so they need little room above */
.wp-msec{padding-bottom:clamp(1.2rem,3vh,2rem)}
.wp-msec ~ .wp-bsec{padding-top:clamp(2rem,5vh,3rem)}
.wp-msec ~ .wp-bsec .pg-shead{border-top:0;padding-top:0}
/* brands: the fifteen as tiles moving slowly left to right; hover (or focus) pauses them */
.wp-marq{margin-inline:calc(-1 * var(--gutter,16px));overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.wp-mtrack{display:flex;gap:.9rem;width:max-content;margin:0;padding:.4rem 0;list-style:none;animation:wp-marq 70s linear infinite}
.wp-marq:hover .wp-mtrack,.wp-marq:focus-within .wp-mtrack{animation-play-state:paused}
@keyframes wp-marq{from{transform:translateX(-50%)}to{transform:translateX(0)}}
.wp-btile{display:grid;place-items:center;flex:none;width:12.5rem;height:6rem;box-sizing:border-box;padding:.9rem 1.4rem;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 1px var(--line)}
.wp-btile img{display:block;width:auto;height:auto;max-width:100%;max-height:4rem;object-fit:contain}
.wp-bname{font-family:var(--display);font-weight:600;font-size:var(--fs-sub);line-height:1.2;letter-spacing:-.01em;color:var(--ink);text-align:center}
@media (prefers-reduced-motion:reduce){
  .wp-d[open] .wp-body{animation:none}
  .wp-d::details-content{transition:none}
  .wp-marq{margin-inline:0;-webkit-mask-image:none;mask-image:none}
  .wp-mtrack{flex-wrap:wrap;width:auto;animation:none}
  .wp-mtrack li[aria-hidden]{display:none}
}

@media (max-width:1023px){
  .wp-hgrid{grid-template-columns:minmax(0,1fr);align-items:start}
}
@media (max-width:1199px){
  /* the kind's drawing and name above its methods, so the rows get the full width */
  .wp-kind{grid-template-columns:minmax(0,1fr);gap:.7rem}
  .wp-khead{position:static;display:grid;grid-template-columns:12rem minmax(0,1fr);column-gap:1.2rem;align-items:center;padding-top:0}
  .wp-kart{grid-row:1 / span 2;width:100%;margin:0}
  .wp-kname{align-self:end}
  .wp-kline{align-self:start;max-width:none;margin-top:.2rem}
}
@media (max-width:899px){
  .wp-khead{grid-template-columns:8.5rem minmax(0,1fr);column-gap:1rem}
  .wp-sum{grid-template-columns:minmax(0,1fr) 2.4rem;gap:.35rem 1rem;padding:1rem .9rem}
  .wp-sareas{grid-column:1;grid-row:2}
  .wp-plus{grid-column:2;grid-row:1 / span 2;width:2.4rem;height:2.4rem}
  .wp-body{grid-template-columns:minmax(0,1fr);gap:1rem;padding:0 .9rem 1.1rem}
  .wp-how,.wp-notes{grid-column:1}
}
@media (max-width:767px){
  /* phones: the twelve in two rows that swipe sideways, so the section stays one screen */
  .wp-btile{width:10.5rem;height:5.2rem;padding:.8rem 1.1rem}
  .wp-btile img{max-height:3.4rem}
}
`;

export const METHODS_PAGE_CSS = BASE_CSS + METHODS_TOOLS_CSS + RAIN_CSS;
