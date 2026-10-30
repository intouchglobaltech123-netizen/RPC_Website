/**
 * Home page, below the hero: the sections in the language of "The art of
 * waterproofing": paper and stone grounds, the serif headline face, one
 * accent blue and hairlines, closing on the site's night blue for contact.
 *
 *   01 Selected projects  a filmstrip of project cards that moves on by itself, one card at a
 *                         time, and by hand (arrows, drag, swipe); it waits while you are on it
 *   02 Services           waterproofing first, on a large dark blue tile with the places it covers
 *                         and a button to book the free inspection; the other six on smaller
 *                         tiles that lift and turn their arrow when pointed at
 *   03 About              who we are, four short facts and a photograph
 *   04 Products           a job as a rendered cut-away, layer by layer, with the products that do each layer
 *   -- Record             four numbers that count up (not used on the home page)
 *   05 Contact            the close: who to talk to, two buttons and a framed photograph
 *
 * Plain strings and one mount function, like the hero and the methods list, so
 * the server renders every word and the page works before scripts arrive.
 * The copy is short on purpose: each section has one headline written around
 * what people search for (waterproofing and building in Erode, Coimbatore and
 * across Tamil Nadu), one line under it and the links that matter, and no
 * line is repeated elsewhere on the site.
 *
 * Photographs: none of the generated pictures are shown. Each place a
 * photograph belongs keeps an empty frame, ready for RPC's own.
 */
import { brandsMarqueeHtml, BRANDS_MARQUEE_CSS } from "../methods/brand-logos";

export interface HomeProject {
  slug: string;
  name: string;
  location: string;
  type: string;
  area: string;
  year: string;
  status: string;
  image: string;
  waterproofing?: string;
}
export interface HomeService {
  id: string;
  title: string;
  /** one short line beside the title in the index */
  line?: string;
  short?: string;
  /** what the service covers: "Area: how", shown on the home page for the first service only */
  deliverables?: readonly string[];
  image: string;
  timeline: string;
  scale: string;
}
export interface HomeData {
  projects: readonly HomeProject[];
  services: readonly HomeService[];
  /** the About section's short promises */
  points: readonly { title: string; body: string }[];
  stats: readonly { value: number | string; suffix: string; label: string }[];
  contact: { email: string; phone: string; address: string; hours: string; whatsapp: string; mapQuery: string; socials: readonly { label: string; href: string }[] };
  brand: { name: string; descriptor: string; established: string };
  /** for the products section: how many there are, from which brands, and the brand tiles, rendered on the server (lib/products/home.ts) */
  products?: {
    count: number;
    brands: readonly string[];
    teaser: string;
  };
}
export interface HomeOptions {
  /** plain image URLs (the local test page has no image optimiser) */
  rawImages?: boolean;
  /** the section's number in its marker, when it sits elsewhere in the page */
  n?: string;
  /** on the home page's own run of sections: no button beside the headline, and the core service without its booking button */
  below?: boolean;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export const serviceSlug = (title: string) => title.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const arrow = `<svg class="hm-ar" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const chevron = (dir: "l" | "r") =>
  `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="${dir === "l" ? "M10 3.5 5.5 8l4.5 4.5" : "M6 3.5 10.5 8 6 12.5"}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const two = (n: number) => String(n).padStart(2, "0");

/** a camera, drawn small in the middle of an empty photo frame */
const camera = `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 10.5a2.5 2.5 0 0 1 2.5-2.5h3l1.7-2.6a1.5 1.5 0 0 1 1.25-.68h5.1c.5 0 .97.26 1.25.68L21.5 8h3a2.5 2.5 0 0 1 2.5 2.5v12a2.5 2.5 0 0 1-2.5 2.5h-17A2.5 2.5 0 0 1 5 22.5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="16" cy="16" r="4.6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`;
/** an empty photo frame: where RPC's own photograph will go */
const frame = (label: string) => `<span class="hm-frame" aria-hidden="true">${camera}<span>${esc(label)}</span></span>`;

const mark = (n: string, label: string, extra = "") =>
  `<p class="hm-mark" data-rv><span class="hm-idx">${n}</span><span class="hm-rule" aria-hidden="true"></span><span>${esc(label)}</span>${extra}</p>`;

/* ------------------------------------------------------------------ 02 */
function projectsMarkup(d: HomeData, _o: HomeOptions) {
  const dot = (s: string) => (s === "Completed" ? "done" : s === "Under construction" ? "live" : "plan");
  const cards = d.projects
    .map(
      (p, i) => `<li class="hm-card" data-rv style="--d:${Math.min(i, 3) * 80}ms">
  <a href="/projects#${esc(p.slug)}" data-internal>
    <div class="hm-ph">
      ${frame(`Photo: ${p.name}`)}
      <span class="hm-status" data-s="${dot(p.status)}"><i></i>${esc(p.status)}</span>
      <span class="hm-no">${two(i + 1)}</span>
    </div>
    <p class="hm-meta"><span>${esc(p.type)}</span><span>${esc(p.location)}</span></p>
    <h3 class="hm-pname">${esc(p.name)}${arrow}</h3>
  </a>
</li>`,
    )
    .join("");
  return `<section class="hm-sec hm-projects" id="projects" aria-labelledby="projects-title">
  <div class="hm-wrap">
    <header class="hm-head">
      <div>
        ${mark("01", "Selected projects")}
        <h2 class="hm-h2" id="projects-title" data-rv>Built dry across Tamil&nbsp;Nadu.</h2>
      </div>
      <div class="hm-side" data-rv>
        <div class="hm-ctrl">
          <span class="hm-count" aria-hidden="true"><b data-pos>01</b> / ${two(d.projects.length)}</span>
          <button type="button" class="hm-nav" data-prev aria-label="Previous project">${chevron("l")}</button>
          <button type="button" class="hm-nav" data-next aria-label="Next project">${chevron("r")}</button>
        </div>
      </div>
    </header>
  </div>
  <ul class="hm-track" data-track aria-label="Projects">${cards}</ul>
  <div class="hm-wrap hm-pfoot">
    <div class="hm-bar" aria-hidden="true"><i data-bar></i></div>
    <a class="hm-link" href="/projects" data-internal>View all projects${arrow}</a>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ 03 */
/** a small drawing for each service (the lucide set's house, building, factory, wrench, sofa and clipboard, and a drop) */
const SERVICE_ICON: readonly (readonly [RegExp, string])[] = [
  [/waterproof/i, `<path d="M12 21.5a6.6 6.6 0 0 0 6.6-6.6c0-1.9-.95-3.7-2.85-5.2S12.45 5.9 12 3.5c-.45 2.4-1.9 4.7-3.75 6.2S5.4 13 5.4 14.9A6.6 6.6 0 0 0 12 21.5z"/><path d="M8.9 15.2a3.1 3.1 0 0 0 2.9 2.9"/>`],
  [/residential/i, `<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>`],
  [/commercial/i, `<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4M10 10h4M10 14h4M10 18h4"/>`],
  [/industrial/i, `<path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M17 18h1M12 18h1M7 18h1"/>`],
  [/renovation|repair/i, `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>`],
  [/interior/i, `<path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z"/><path d="M4 18v2M20 18v2M12 4v9"/>`],
  [/manag/i, `<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>`],
];
export const serviceIcon = (title: string) =>
  `<span class="hm-sic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${(SERVICE_ICON.find(([re]) => re.test(title)) ?? SERVICE_ICON[0]!)[1]}</svg></span>`;

export function servicesMarkup(d: HomeData, _o: HomeOptions) {
  const [lead, ...rest] = d.services;
  if (!lead) return "";
  const check = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.4 6.6 11.4 12.6 4.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const tiles = rest
    .map(
      (s, i) => `<li data-rv style="--d:${i * 50}ms">
  <a class="hm-tile" href="/services#${serviceSlug(s.title)}" data-internal>
    <span class="hm-ttop">${serviceIcon(s.title)}<span class="hm-tgo" aria-hidden="true">${arrow}</span></span>
    <span class="hm-tt">${esc(s.title)}</span>
    <span class="hm-tl">${esc(s.line ?? s.short ?? s.scale)}</span>
  </a>
</li>`,
    )
    .join("");
  // "Terraces & roofs: PU or torch-on membranes" becomes the place, then how it is done
  const covers = (lead.deliverables ?? [])
    .map((x) => {
      const [where = x, how = ""] = x.split(/:\s*/, 2);
      const How = how.charAt(0).toUpperCase() + how.slice(1);
      return `<li>${check}<span><b>${esc(where)}</b>${How ? `<span>${esc(How)}</span>` : ""}</span></li>`;
    })
    .join("");
  return `<section class="hm-sec hm-services" id="services" aria-labelledby="services-title">
  <div class="hm-wrap">
    <header class="hm-head">
      <div>
        ${mark(_o.n ?? "02", "Services")}
        <h2 class="hm-h2" id="services-title" data-rv>Waterproofing, construction and leak&nbsp;repair.</h2>
      </div>
      ${_o.below ? "" : `<div class="hm-side" data-rv>
        <a class="hm-btn hm-btn--line" href="/services" data-internal>View all services${arrow}</a>
      </div>`}
    </header>
    <div class="hm-sgrid">
      <article class="hm-sfeat" data-rv aria-labelledby="svc-lead">
        <div class="hm-sftop">
          ${serviceIcon(lead.title)}
          <p class="hm-skick">${esc(lead.short ?? "Our core service")}</p>
        </div>
        <h3 class="hm-sft" id="svc-lead">${esc(lead.title)}</h3>
        <p class="hm-sbody">${esc(lead.scale)}, in Erode, Coimbatore and across Tamil&nbsp;Nadu.</p>
        ${covers ? `<ul class="hm-schk">${covers}</ul>` : ""}
        <div class="hm-sbtns">
          ${_o.below ? "" : `<a class="hm-btn hm-btn--ink" href="/contact#enquiry" data-internal>Book a free site inspection${arrow}</a>`}
          <a class="${_o.below ? "hm-btn hk-btn--white" : "hm-slink"}" href="/waterproofing" data-internal>How we waterproof${arrow}</a>
        </div>
      </article>
      <ul class="hm-stiles" aria-label="More services">${tiles}</ul>
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ 04 */
function aboutMarkup(d: HomeData, _o: HomeOptions) {
  const map = aboutMap();
  const points = d.points.map((p) => `<li data-rv><h3>${esc(p.title)}</h3><p>${esc(p.body)}</p></li>`).join("");
  return `<section class="hm-sec hm-about" id="about" aria-labelledby="about-title">
  <div class="hm-wrap">
    <div class="hm-abpanel">
      <div class="hm-abtop">
        <div class="hm-abcopy">
          ${mark("03", "About RPC")}
          <h2 class="hm-abh" id="about-title" data-rv>Engineers from Erode, keeping buildings dry since&nbsp;2012.</h2>
          <a class="hm-btn hm-btn--paper" href="/about" data-internal data-rv>About RPC Constructions${arrow}</a>
        </div>
        ${map}
      </div>
      <ul class="hm-abpts">${points}</ul>
    </div>
  </div>
</section>`;
}

/** where we work, drawn: Erode, the head office, with the towns around it and Chennai off to the north-east */
export function aboutMap() {
  // where we work, on a drawn map of western Tamil Nadu (longitude and latitude, scaled): Erode, the head office, at the centre
  const at = (lon: number, lat: number) => [Math.round((lon - 76.75) * 290), Math.round((12.05 - lat) * 290)] as const;
  const hq = at(77.72, 11.34);
  const towns = [
    { name: "Tiruppur", p: at(77.34, 11.11), side: "l" },
    { name: "Coimbatore", p: at(76.96, 11.02), side: "r" },
    { name: "Salem", p: at(78.15, 11.66), side: "r" },
  ];
  const pc = (x: number, y: number) => `left:${((x / 600) * 100).toFixed(2)}%;top:${((y / 380) * 100).toFixed(2)}%`;
  const map = `<figure class="hm-abmap" data-rv>
  <svg viewBox="0 0 600 380" aria-hidden="true">
    <defs><pattern id="hm-abg" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#fff" stroke-opacity=".07"/></pattern></defs>
    <rect width="600" height="380" fill="url(#hm-abg)"/>
    <circle cx="${hq[0]}" cy="${hq[1]}" r="130" class="hm-abring"/><circle cx="${hq[0]}" cy="${hq[1]}" r="260" class="hm-abring"/>
    ${towns.map((t) => `<path class="hm-abroute" d="M${hq[0]} ${hq[1]}L${t.p[0]} ${t.p[1]}"/>`).join("")}
    <path class="hm-abroute" d="M${hq[0]} ${hq[1]}L590 34"/><path class="hm-abarrow" d="M574 30l16 4-6 15"/>
    ${towns.map((t) => `<circle class="hm-abtown" cx="${t.p[0]}" cy="${t.p[1]}" r="6"/>`).join("")}
    <circle class="hm-abpulse" cx="${hq[0]}" cy="${hq[1]}" r="18"/><circle class="hm-abhq" cx="${hq[0]}" cy="${hq[1]}" r="9"/>
  </svg>
  <span class="hm-ablab hm-ablab--hq" style="${pc(hq[0], hq[1])}"><b>Erode</b><span>Head office, Perundurai Road</span></span>
  ${towns.map((t) => `<span class="hm-ablab hm-ablab--${t.side}" style="${pc(t.p[0], t.p[1])}">${esc(t.name)}</span>`).join("")}
  <span class="hm-ablab hm-ablab--far" style="${pc(588, 34)}">Chennai</span>
  <figcaption class="hm-sr">Where we work: Erode, our head office, with Tiruppur, Coimbatore, Salem and Chennai.</figcaption>
</figure>`;
  return map;
}

/**
 * About, as the home page first had it: the statement, a line, the four
 * short facts numbered, and the frame where the photograph of the team goes.
 */
export function rootedAboutMarkup(d: HomeData, o: HomeOptions = {}) {
  const values = d.points
    .map((p, i) => `<li data-rv style="--d:${i * 60}ms"><span class="hm-vno">${two(i + 1)}</span><h3>${esc(p.title)}</h3><p>${esc(p.body)}</p></li>`)
    .join("");
  return `<section class="hm-sec hm-about" id="about" aria-labelledby="about-title">
  <div class="hm-wrap hm-agrid">
    <div class="hm-acopy">
      ${mark(o.n ?? "03", "About RPC")}
      <h2 class="hm-statement" id="about-title" data-rv>Waterproofing contractors in Erode since&nbsp;2012.</h2>
      <p class="hm-lead" data-rv>RPC Constructions keeps buildings dry with terrace, bathroom, sump and basement waterproofing, leak repair and construction chemicals, for homes, offices and factories in Erode, Coimbatore, Tiruppur, Salem and Chennai.</p>
      <ul class="hm-values">${values}</ul>
      <a class="hm-btn hm-btn--ink" href="/about" data-internal data-rv>About RPC Constructions${arrow}</a>
    </div>
    <figure class="hm-afig" data-rv>
      <div class="hm-aph">${frame("Photo: the RPC team at work")}</div>
    </figure>
  </div>
</section>`;
}
export const ROOTED_ABOUT_CSS = `
.hm-agrid{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);align-items:stretch;gap:clamp(2rem,5vw,6rem);flex:1 1 auto;max-height:52rem}
.hm-acopy{display:flex;flex-direction:column;justify-content:center;align-items:flex-start;min-width:0}
.hm-acopy .hm-mark{align-self:stretch}
.hm-statement{margin:min(1.4rem,2.6svh) 0 0;max-width:26ch;font-family:var(--serif);font-weight:600;font-size:var(--fs-title);line-height:1.12;letter-spacing:-.02em;text-wrap:balance}
.hm-lead{margin:min(1.6rem,3svh) 0 0;max-width:42rem;font-size:var(--fs-body);line-height:1.7;color:rgba(18,34,59,.8);text-wrap:pretty}
.hm-values{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 clamp(1rem,2vw,2rem);align-self:stretch;margin:min(1.8rem,3.4svh) 0 min(1.8rem,3.4svh);padding:0;list-style:none}
.hm-values li{display:grid;grid-template-columns:1.9rem 1fr;align-content:start;column-gap:.1rem;padding:min(.85rem,1.5svh) 0 min(.95rem,1.6svh);border-top:1px solid var(--line)}
.hm-vno{grid-row:1/3;padding-top:.12rem;font-size:var(--fs-body);font-weight:600;font-variant-numeric:tabular-nums;color:var(--accent)}
.hm-values h3{margin:0;font-size:var(--fs-body);font-weight:600;letter-spacing:-.01em}
.hm-values p{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin:.3rem 0 0;font-size:var(--fs-body);line-height:1.45;color:var(--mute)}
.hm-afig{display:flex;flex-direction:column;justify-content:center;min-height:0;margin:0;container-type:size}
.hm-aph{position:relative;flex:none;width:min(100cqw,calc(100cqh * 1.7917));aspect-ratio:1376/768;overflow:hidden;border-radius:16px;background:#ddd3c2}
@container (max-height:8rem){.hm-aph{display:none}}
@media (max-width:1023px){
  .hm-agrid{grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:2.2rem}
}
@media (max-width:767px){
  /* phones: the statement, one line, four fact cards and the button; the photograph's empty frame stays off until there is a photograph */
  .hm .hm-about{min-height:0;padding:2.6rem 0 2.4rem}
  .hm-agrid{display:block;max-height:none}
  .hm-acopy{display:block}
  .hm-statement{max-width:none;margin:.7rem 0 0;font-size:1.7rem;line-height:1.12}
  .hm-lead{margin:.7rem 0 0;font-size:1rem;line-height:1.5}
  .hm-values{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.6rem;margin:1.3rem 0 1.4rem}
  .hm-values li{display:flex;flex-direction:column;gap:.2rem;height:auto;padding:.85rem .9rem .9rem;border:0;border-radius:14px;background:#fff;box-shadow:0 0 0 1px var(--line)}
  .hm-values .hm-vno{display:block;grid-row:auto;padding:0;font-size:.8rem;letter-spacing:.04em}
  .hm-values h3{font-size:1rem;line-height:1.25}
  .hm-values p{display:-webkit-box;margin:0;font-size:.9rem;line-height:1.4}
  .hm-acopy .hm-btn{width:100%;justify-content:center}
  .hm-afig{display:none}
}
`;

/* ---------------------------------------------------------- 05 products */
function productsMarkup(d: HomeData) {
  const pr = d.products;
  if (!pr) return "";
  return `<section class="hm-sec hm-products" id="products" aria-labelledby="products-title">
  <div class="hm-wrap">
    <div class="hm-phead">
      <div>
        ${mark("04", "Products")}
        <h2 class="hm-h2" id="products-title" data-rv>Waterproofing products, layer by&nbsp;layer.</h2>
      </div>
      <div class="hm-pside" data-rv>
        <a class="hm-btn hm-btn--ink" href="/products" data-internal>Browse all ${pr.count} products${arrow}</a>
      </div>
    </div>
    <div class="hm-teaser" data-rv>${pr.teaser}</div>
    <div class="hm-pbrands" data-rv>
      <header class="hm-pbhead">
        <p class="hm-mark"><span class="hm-rule" aria-hidden="true"></span><span>Brands</span></p>
        <h3 class="hm-pbh">The brands in our methods guide.</h3>
      </header>
      ${brandsMarqueeHtml()}
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ 05 */
const NOTES = ["Built & waterproofed", "Working from Erode", "Homes, firms & factories", "Erode to Chennai"];
function recordMarkup(d: HomeData) {
  const items = d.stats
    .map(
      (s, i) => `<div class="hm-stat" data-rv style="--d:${i * 90}ms">
  <dt>${esc(s.label)}<span>${esc(NOTES[i] ?? "")}</span></dt>
  <dd><span ${typeof s.value === "number" ? `data-count="${s.value}"` : ""}>${esc(String(s.value))}</span>${s.suffix ? `<sup>${esc(s.suffix)}</sup>` : ""}</dd>
</div>`,
    )
    .join("");
  return `<section class="hm-sec hm-record" id="record" aria-label="Performance record">
  <div class="hm-wrap">
    <header class="hm-head hm-head--tight">
      <div>
        ${mark("05", "Performance record")}
        <h2 class="hm-h2" data-rv>One dry building <span class="hm-soft">at a time.</span></h2>
      </div>
    </header>
    <dl class="hm-stats">${items}</dl>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ 06 */
export function contactMarkup(d: HomeData, _o: HomeOptions) {
  const c = d.contact;
  return `<section class="hm-sec hm-contact" id="contact" aria-labelledby="contact-title">
  <div class="hm-wrap">
    <div class="hm-cgrid">
      <div class="hm-ccopy">
        ${mark(_o.n ?? "05", "Contact")}
        <h2 class="hm-ch" id="contact-title" data-rv>Talk to an engineer.</h2>
        <p class="hm-clede" data-rv>A damp wall, a leaking terrace or a new building to plan?</p>
        <div class="hm-cbtns" data-rv>
          <a class="hm-btn hm-btn--paper" href="/contact#enquiry" data-internal>Book a free site inspection${arrow}</a>
          <a class="hm-btn hm-btn--line" href="${esc(c.whatsapp)}" target="_blank" rel="noopener noreferrer">WhatsApp us</a>
        </div>
      </div>
      <figure class="hm-cfig" data-rv>
        <div class="hm-cph">${frame("Photo: our office on Perundurai Road")}</div>
      </figure>
    </div>
  </div>
</section>`;
}

export type HomePart = "projects" | "services" | "about" | "products" | "record" | "contact";
const ALL_PARTS: readonly HomePart[] = ["projects", "services", "about", "products", "record", "contact"];

/** the sections asked for, in page order (the home page uses the site's own record band) */
export function homeSectionsMarkup(d: HomeData, o: HomeOptions = {}, parts: readonly HomePart[] = ALL_PARTS): string {
  const make: Record<HomePart, () => string> = {
    projects: () => projectsMarkup(d, o),
    services: () => servicesMarkup(d, o),
    about: () => aboutMarkup(d, o),
    products: () => productsMarkup(d),
    record: () => recordMarkup(d),
    contact: () => contactMarkup(d, o),
  };
  return ALL_PARTS.filter((p) => parts.includes(p)).map((p) => make[p]()).join("\n");
}

/* ---------------------------------------------------------------- CSS */
/** the products section's brand tiles (lib/products/home.ts) */
export const HOME_PRODUCTS_CSS = BRANDS_MARQUEE_CSS + `
.hm-pbrands{margin-top:clamp(2rem,4vh,3rem);padding-top:clamp(1.5rem,3vh,2.2rem);border-top:1px solid rgba(18,34,59,.1)}
.hm-pbhead{margin-bottom:1.2rem}
.hm-pbhead .hm-mark{margin-bottom:.9rem}
.hm-pbh{margin:0;font-family:var(--font-heading,var(--font-inter-tight,var(--display))),sans-serif;font-weight:600;font-size:clamp(1.5rem,2.4vw,2.2rem);line-height:1.2;letter-spacing:-.02em;color:var(--ink)}
.hl{display:flex;flex-direction:column;gap:clamp(1rem,2.4vh,1.6rem)}
.hl-vh{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
/* the jobs: a quiet row of pills */
.hl-jobs{display:flex;gap:.4rem;overflow-x:auto;scrollbar-width:none;margin:0 calc(-1 * var(--gutter,16px));padding:0 var(--gutter,16px)}
.hl-jobs::-webkit-scrollbar{display:none}
.hl-tab{flex:none;display:inline-flex;align-items:center;height:2.6rem;padding:0 1.1rem;border:0;border-radius:999px;background:transparent;box-shadow:inset 0 0 0 1px var(--line);color:var(--mute);font-family:inherit;font-size:var(--fs-body);font-weight:500;line-height:1;white-space:nowrap;cursor:pointer;transition:background-color .2s,color .2s,box-shadow .2s}
.hl-tab:hover{color:var(--ink);box-shadow:inset 0 0 0 1px rgba(18,34,59,.32)}
.hl-tab[aria-selected="true"]{background:var(--navy);color:#fff;box-shadow:none}
.hl-tab:focus-visible,.ld-rb:focus-visible,.ld-ps a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.hl-panel{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:clamp(1.2rem,3vw,2.8rem);align-items:start}
.hl-panel[hidden]{display:none}
/* the detail, drawn the way an architect draws one: concrete cut and hatched, the rest in fine line */
.ld-fig{margin:0;min-width:0}
.ld-svg{display:block;width:100%;height:auto;max-height:min(50svh,30rem);padding:clamp(.6rem,1.4vw,1.1rem);box-sizing:border-box;border-radius:14px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line)}
.ld-fig figcaption{margin-top:.6rem;font-size:var(--fs-body);line-height:1.45;color:var(--mute)}
.ld-cut{stroke:#12223b;stroke-width:1.2;stroke-linejoin:round}
.ld-fine{fill:none;stroke:#12223b;stroke-opacity:.4;stroke-width:1}
.ld-line{stroke:#12223b;stroke-width:1}
.ld-tiles rect{fill:#f6f2ea;stroke:#12223b;stroke-width:1}
.ld-grout{fill:#8f877a}
.ld-coat{fill:none;stroke:#0b6e80;stroke-width:5;stroke-linecap:round;stroke-linejoin:round}
.ld-sheet{fill:none;stroke:#2b3f58;stroke-width:5;stroke-linejoin:round}
.ld-ws{fill:#c98a35;stroke:#12223b;stroke-width:1}
.ld-plug{fill:#5f564c;stroke:#12223b;stroke-width:1}
.ld-steel{fill:none;stroke:#8a4b2a;stroke-width:7;stroke-linecap:round}
.ld-steel--primed{stroke:#c0392b}
.ld-water{fill:#3d7cc9;fill-opacity:.2}
.ld-blocks rect{fill:#ece5d6;stroke:#12223b;stroke-width:1}
.ld-rain{fill:none;stroke:#2756a0;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.ld-el{cursor:pointer;transition:opacity .25s}
.hl-panel.has-pick .ld-el:not(.is-on){opacity:.32}
.ld-mk{cursor:pointer}
.ld-mk circle{fill:#f5f0e6;stroke:#0b2350;stroke-width:1.6;transition:fill .2s}
.ld-mk text{fill:#0b2350;font:600 15px var(--font-inter-tight),system-ui,sans-serif;text-anchor:middle;transition:fill .2s}
.ld-mk.is-on circle{fill:#0b2350}
.ld-mk.is-on text{fill:#f5f0e6}
/* the list beside it: every layer, the one picked open on its products */
.ld-list{margin:0;padding:0;list-style:none;border-top:1px solid var(--line)}
.ld-row{border-bottom:1px solid var(--line)}
.ld-rb{display:grid;grid-template-columns:2rem minmax(0,1fr) auto;gap:.9rem;align-items:center;width:100%;padding:.85rem 0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}
.ld-n{display:grid;place-items:center;width:2rem;height:2rem;border-radius:50%;box-shadow:inset 0 0 0 1.5px var(--navy);color:var(--navy);font-size:var(--fs-body);font-weight:600;font-variant-numeric:tabular-nums;transition:background-color .2s,color .2s}
.ld-row.is-on .ld-n{background:var(--navy);color:#f5f0e6}
.ld-rt{display:flex;flex-direction:column;min-width:0}
.ld-name{font-size:var(--fs-body);font-weight:600;line-height:1.35;color:var(--ink)}
.ld-what{font-size:var(--fs-body);line-height:1.4;color:var(--mute)}
.ld-count{min-width:1.9rem;padding:.15rem .5rem;border-radius:999px;background:rgba(18,34,59,.06);font-size:var(--fs-body);font-variant-numeric:tabular-nums;text-align:center;color:var(--ink2,#3b4658)}
.ld-ps{display:flex;flex-wrap:wrap;gap:.35rem;margin:0;padding:0 0 1rem 2.9rem;list-style:none}
.ld-ps[hidden]{display:none}
.ld-ps a{display:inline-flex;align-items:center;gap:.45rem;min-height:2.2rem;padding:0 .8rem;border-radius:999px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);color:var(--ink);font-size:var(--fs-body);text-decoration:none;transition:box-shadow .2s,color .2s}
.ld-ps a:hover{box-shadow:inset 0 0 0 1px var(--navy);color:var(--accent)}
.ld-ps i{flex:none;width:.45rem;height:.45rem;border-radius:2px;background:var(--b)}
.ld-ps em{font-style:normal;color:var(--mute)}
@media (max-width:1023px){.hl-panel{grid-template-columns:minmax(0,1fr)}.ld-svg{max-height:none}}
@media (max-width:599px){.ld-ps{padding-left:0}}
@media (pointer:coarse){.ld-ps a{min-height:2.75rem}}
`;
export const HOME_CSS = `
/*
 * Every section is exactly one screen tall (laptops, tablets and phones held
 * upright): the headline and text keep their size, and the photographs and
 * lists stretch or shrink to fill what is left under the navigation bar.
 */
.hm{--paper:#ece6da;--stone:#e2d9c9;--sky:#d9e2ee;--card:#f5f0e6;--navy:#0b2350;--ink:#12223b;--mute:#5b6271;--line:rgba(18,34,59,.14);--accent:#2756a0;--water:#0b6e80;--serif:var(--font-inter-tight),"Segoe UI",system-ui,sans-serif;--sans:var(--font-inter-tight),ui-sans-serif,system-ui,sans-serif;--nav-room:var(--nav-h,80px);color:var(--ink);font-family:var(--sans)}
.hm-sec{position:relative;z-index:10;display:flex;flex-direction:column;justify-content:center;box-sizing:border-box;min-height:100vh;min-height:100svh;padding:calc(var(--nav-room) + clamp(.4rem,2.6svh,2.2rem)) 0 clamp(1.4rem,4.6svh,3.2rem)}
.hm-wrap{box-sizing:border-box;width:100%;padding-inline:var(--gutter,3rem);max-width:1600px;margin:0 auto}
.hm img{display:block;width:100%;height:100%;object-fit:cover}
.hm-ar{width:14px;height:14px;flex:none;transition:transform .45s cubic-bezier(.2,.7,.2,1)}

/* shared: section marker, headline, lede, links and buttons */
.hm-mark{display:flex;align-items:center;gap:.75rem;margin:0;font-size:var(--fs-body);font-weight:500;color:var(--mute)}
.hm-idx{font-variant-numeric:tabular-nums;font-weight:600;color:var(--accent)}
.hm-rule{width:2rem;height:1px;background:currentColor;opacity:.35}
.hm-h2{margin:min(1.1rem,2svh) 0 0;font-family:var(--serif);font-weight:600;font-size:var(--fs-title);line-height:1.12;letter-spacing:-.02em;text-wrap:balance;max-width:20ch}
.hm-soft{color:rgba(18,34,59,.42)}
.hm-head{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);align-items:end;gap:1.2rem clamp(2rem,6vw,7rem);margin-bottom:clamp(1.1rem,4svh,3.2rem)}
.hm-side{display:flex;flex-direction:column;align-items:flex-start;gap:min(1.4rem,2.4svh);padding-bottom:.3rem}
.hm-lede{margin:0;max-width:30rem;font-size:var(--fs-body);line-height:1.65;color:var(--mute);text-wrap:pretty}
.hm-link{display:inline-flex;align-items:center;gap:.55rem;padding-bottom:4px;border-bottom:1px solid currentColor;font-size:var(--fs-body);font-weight:600;color:var(--ink);text-decoration:none}
.hm-link:hover .hm-ar,.hm-btn:hover .hm-ar{transform:translate(2px,-2px)}
.hm-btn{display:inline-flex;align-items:center;justify-content:center;gap:.6rem;height:min(3.25rem,6.4svh);min-height:2.75rem;padding:0 1.5rem;border-radius:10px;font-size:var(--fs-body);font-weight:600;text-decoration:none;box-sizing:border-box;transition:background-color .3s,color .3s,border-color .3s}
.hm-btn--ink{background:var(--navy);color:#f5f0e6}
.hm-btn--ink:hover{background:var(--accent)}

/* reveal as each block reaches the screen (only once scripts run) */
.hm.js [data-rv]{opacity:0;transform:translateY(18px);transition:opacity .9s ease var(--d,0ms),transform 1.1s cubic-bezier(.19,1,.22,1) var(--d,0ms)}
.hm.js [data-rv].is-in{opacity:1;transform:none}

/* 02 projects: a filmstrip whose photographs take the height that is left */
.hm-projects{background:var(--paper)}
.hm-ctrl{display:flex;align-items:center;gap:.6rem}
.hm-count{min-width:4.5rem;font-size:var(--fs-body);font-variant-numeric:tabular-nums;color:var(--mute)}
.hm-count b{font-weight:600;color:var(--ink)}
.hm-nav{display:grid;place-items:center;width:46px;height:46px;border-radius:50%;border:1px solid var(--line);background:var(--card);color:var(--ink);cursor:pointer;transition:background-color .3s,color .3s,border-color .3s,opacity .3s}
.hm-nav svg{width:16px;height:16px}
.hm-nav:hover{background:var(--navy);border-color:var(--navy);color:#f5f0e6}
.hm-projects .hm-side{align-items:flex-end}
.hm-nav:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.hm-track{--edge:max(var(--gutter,3rem),calc((100% - 1600px) / 2 + var(--gutter,3rem)));flex:1 1 0;min-height:18rem;max-height:46rem;display:flex;align-items:stretch;gap:clamp(14px,1.6vw,24px);margin:0;padding:0 var(--edge) 4px;list-style:none;overflow-x:auto;overflow-y:hidden;overscroll-behavior-x:contain;scroll-snap-type:x mandatory;scroll-padding-inline:var(--edge);scrollbar-width:none;cursor:grab}
.hm-track::-webkit-scrollbar{display:none}
.hm-track.is-drag{scroll-snap-type:none;cursor:grabbing}
.hm-track.is-drag a{pointer-events:none}
.hm-card{display:flex;flex:0 0 clamp(18rem,32vw,36rem);scroll-snap-align:start}
.hm-card a{display:flex;flex-direction:column;width:100%;color:inherit;text-decoration:none}
/* each photograph whole, at its own proportions; the strip's height decides how wide the cards are */
.hm-ph{position:relative;flex:none;aspect-ratio:1376/768;overflow:hidden;border-radius:16px;background:#ddd3c2}
/* an empty photo frame: a small camera and what belongs there */
.hm-frame{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.5rem;background:#ddd3c2 linear-gradient(135deg,rgba(255,255,255,.18),rgba(255,255,255,0) 60%);box-shadow:inset 0 0 0 1px rgba(18,34,59,.1);border-radius:inherit;color:rgba(18,34,59,.36)}
.hm-frame svg{width:30px;height:30px}
.hm-frame span{max-width:80%;font-size:var(--fs-body);line-height:1.35;text-align:center;color:rgba(18,34,59,.5)}
@media (min-width:768px){
  @supports (width:1cqh){
    .hm-track{container-type:size}
    .hm-card{flex-basis:clamp(16rem,calc((100cqh - 7.6rem) * 1.7917),min(44rem,84vw))}
  }
}
.hm-status{position:absolute;left:14px;top:14px;z-index:1;display:inline-flex;align-items:center;gap:.45rem;height:28px;padding:0 .75rem;border-radius:8px;background:var(--card);font-size:var(--fs-body);font-weight:600;color:var(--ink)}
.hm-status i{width:7px;height:7px;border-radius:50%;background:#2f9e6b}
.hm-status[data-s=live] i{background:#e8a215}
.hm-status[data-s=plan] i{background:#0b7d91}
.hm-no{position:absolute;right:16px;top:14px;z-index:1;font-family:var(--serif);font-weight:600;font-size:var(--fs-sub);line-height:1;color:rgba(18,34,59,.4);font-variant-numeric:tabular-nums}
.hm-meta{display:flex;flex-wrap:wrap;gap:.2rem .9rem;margin:min(1.1rem,2svh) 0 0;font-size:var(--fs-body);color:var(--mute)}
.hm-meta span:first-child{font-weight:600;color:var(--accent)}
.hm-pname{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin:.4rem 0 0;font-family:var(--serif);font-weight:600;font-size:var(--fs-sub);line-height:1.2;letter-spacing:-.01em}
.hm-pname .hm-ar{width:18px;height:18px;color:var(--mute)}
.hm-card a:hover .hm-pname .hm-ar{transform:translate(3px,-3px);color:var(--ink)}
.hm-pfoot{display:flex;align-items:center;gap:2rem;margin-top:min(2.2rem,3.6svh)}
.hm-bar{position:relative;flex:1;height:1px;background:var(--line);overflow:hidden}
.hm-bar i{position:absolute;inset:0;background:var(--ink);transform-origin:left;transform:scaleX(.2)}

/* 02 services: waterproofing first, on a large tile that holds a little water, with the places it covers and two buttons; the other six on smaller tiles */
.hm-services{background:var(--stone)}
.hm-services .hm-h2{max-width:24ch}
.hm-services .hm-side{align-items:flex-end}
.hm-sgrid{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,2fr);gap:clamp(.75rem,1.3vw,1.15rem)}
.hm-sic{display:grid;place-items:center;flex:none;width:48px;height:48px;border-radius:14px;background:var(--paper);color:var(--navy);transition:background-color .35s,color .35s}
.hm-sic svg{width:46%;height:46%}
.hm-sfeat{--sp:clamp(1.25rem,2.2vw,2rem);position:relative;display:flex;flex-direction:column;padding:var(--sp);border-radius:20px;background:var(--navy);color:#fff;box-shadow:0 30px 60px -40px rgba(11,35,80,.7);overflow:hidden;isolation:isolate}
.hm-sftop{display:flex;align-items:center;gap:.85rem}
.hm-sfeat .hm-sic{background:rgba(255,255,255,.1);color:#fff}
.hm-skick{margin:0;font-size:var(--fs-body);font-weight:600;color:rgba(255,255,255,.7)}
.hm-sft{margin:min(1.1rem,2svh) 0 0;font-family:var(--serif);font-weight:600;font-size:var(--fs-sub);line-height:1.2;letter-spacing:-.01em}
.hm-sbody{margin:.45rem 0 0;max-width:34rem;font-size:var(--fs-body);line-height:1.55;color:rgba(255,255,255,.72);text-wrap:pretty}
.hm-schk{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:min(.9rem,1.6svh) 1.1rem;margin:min(1.3rem,2.4svh) 0 0;padding:min(1.1rem,2svh) 0 0;border-top:1px solid rgba(255,255,255,.16);list-style:none}
.hm-schk li{display:flex;gap:.6rem;font-size:var(--fs-body);line-height:1.4;color:#fff}
.hm-schk li > span{display:grid;align-content:start;gap:.1rem}
.hm-schk b{font-weight:600}
.hm-schk li > span > span{color:rgba(255,255,255,.66)}
.hm-schk svg{flex:none;width:1.15rem;height:1.15rem;margin-top:.12rem;padding:.14rem;border-radius:50%;background:#f5f0e6;color:var(--navy);box-sizing:border-box}
.hm-sbtns{display:flex;flex-wrap:wrap;align-items:center;gap:.7rem 1.4rem;margin-top:auto;padding-top:min(1.4rem,2.6svh)}
.hm-sfeat .hm-btn--ink{background:#f5f0e6;color:var(--navy)}
.hm-sfeat .hm-btn--ink:hover{background:#fff}
.hm-sfeat .hm-schk{margin-bottom:min(1.5rem,2.8svh)}
.hm-slink{display:inline-flex;align-items:center;gap:.45rem;padding-bottom:3px;border-bottom:1.5px solid rgba(255,255,255,.4);color:#fff;font-size:var(--fs-body);font-weight:600;text-decoration:none;transition:border-color .3s}
.hm-slink:hover{border-color:#fff}
.hm-slink .hm-ar{width:14px;height:14px;transition:transform .35s}
.hm-slink:hover .hm-ar{transform:translate(2px,-2px)}
.hm-stiles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:1fr;gap:clamp(.75rem,1.3vw,1.15rem);margin:0;padding:0;list-style:none}
.hm-stiles > li{display:flex;min-width:0}
.hm-tile{position:relative;display:flex;flex:1;flex-direction:column;padding:clamp(1rem,1.5vw,1.3rem);border-radius:18px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);color:inherit;text-decoration:none;overflow:hidden;isolation:isolate;transition:box-shadow .35s,transform .35s cubic-bezier(.2,.8,.2,1)}
.hm-ttop{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:auto;padding-bottom:min(1.1rem,2svh)}
.hm-tt{font-family:var(--serif);font-weight:600;font-size:var(--fs-sub);line-height:1.2;letter-spacing:-.01em}
.hm-tl{margin-top:.3rem;font-size:var(--fs-body);line-height:1.45;color:var(--mute);text-wrap:pretty}
.hm-tgo{display:grid;place-items:center;flex:none;width:2.6rem;height:2.6rem;border-radius:50%;box-shadow:inset 0 0 0 1.5px rgba(18,34,59,.2);color:var(--ink);transition:background-color .35s,color .35s,box-shadow .35s,transform .45s cubic-bezier(.2,.8,.2,1)}
.hm-tgo .hm-ar{width:15px;height:15px}
/* the tile under the pointer: it lifts a little, the drawing and the button turn dark blue and the arrow turns */
.hm-tile:hover,.hm-tile:focus-visible{transform:translateY(-3px);box-shadow:inset 0 0 0 1px rgba(39,86,160,.3),0 22px 40px -28px rgba(11,35,80,.55)}
.hm-tile:hover .hm-sic,.hm-tile:focus-visible .hm-sic{background:var(--navy);color:#fff}
.hm-tile:hover .hm-tgo,.hm-tile:focus-visible .hm-tgo{background:var(--navy);color:#f5f0e6;box-shadow:none;transform:rotate(45deg)}
.hm-tile:focus-visible{outline:2px solid var(--accent);outline-offset:2px}

/* 04 about: the copy beside a photograph that fills the height */
.hm-about{background:var(--paper)}
/* About: a blueprint panel, the words on the left, a drawn map of where we work on the right, and four facts along its foot */
.hm-abpanel{position:relative;display:flex;flex-direction:column;overflow:hidden;border-radius:22px;background:#0b2350;color:#eef3f5}
.hm-abtop{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:clamp(1.5rem,4vw,4rem);align-items:center;padding:clamp(1.6rem,4vw,3.4rem) clamp(1.4rem,4vw,3.4rem) clamp(1rem,2.6vh,2rem)}
.hm-abcopy{display:flex;flex-direction:column;align-items:flex-start;min-width:0}
.hm-abcopy .hm-mark{color:rgba(238,243,245,.7)}
.hm-abcopy .hm-idx{color:#9fd3ea}
.hm-abh{margin:1.2rem 0 0;max-width:17ch;font-weight:600;font-size:var(--fs-title);line-height:1.08;letter-spacing:-.03em;color:#fff;text-wrap:balance}
.hm-abcopy .hm-btn--paper{background:#f5f0e6;color:#0b2350}
.hm-abcopy .hm-btn--paper:hover{background:#fff}
.hm-abcopy .hm-btn{margin-top:2rem}
.hm-abmap{position:relative;margin:0;min-width:0;aspect-ratio:600/380;max-height:44svh}
.hm-abmap svg{display:block;width:100%;height:100%}
.hm-abring{fill:none;stroke:#9fd3ea;stroke-opacity:.25;stroke-dasharray:3 6}
.hm-abroute{fill:none;stroke:#fff;stroke-opacity:.55;stroke-width:1.4;stroke-dasharray:6 6}
.hm-abarrow{fill:none;stroke:#fff;stroke-opacity:.7;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
.hm-abtown{fill:#0b2350;stroke:#fff;stroke-width:2}
.hm-abhq{fill:#9fd3ea}
.hm-abpulse{fill:none;stroke:#9fd3ea;stroke-opacity:.5;stroke-width:1.5;transform-box:fill-box;transform-origin:center;animation:hm-abp 2.8s ease-out infinite}
@keyframes hm-abp{0%{transform:scale(.5);opacity:1}100%{transform:scale(2.2);opacity:0}}
.hm-ablab{position:absolute;display:flex;flex-direction:column;transform:translate(14px,-50%);font-size:var(--fs-body);line-height:1.3;color:#fff;white-space:nowrap}
.hm-ablab--l{transform:translate(calc(-100% - 14px),-50%)}
.hm-ablab--hq{transform:translate(22px,-50%);color:rgba(238,243,245,.72)}
.hm-ablab--hq b{font-weight:600;color:#fff}
.hm-ablab--far{transform:translate(-100%,22px);text-align:right}
.hm-abpts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin:0;padding:0;list-style:none;border-top:1px solid rgba(255,255,255,.12)}
.hm-abpts li{padding:clamp(1rem,2.6vh,1.6rem) clamp(1.2rem,2.4vw,2rem)}
.hm-abpts li + li{border-left:1px solid rgba(255,255,255,.12)}
.hm-abpts h3{margin:0;font-size:var(--fs-body);font-weight:600;color:#fff}
.hm-abpts p{margin:.3rem 0 0;font-size:var(--fs-body);line-height:1.45;color:rgba(238,243,245,.7)}
.hm-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
@media (max-width:899px){
  .hm-abtop{grid-template-columns:minmax(0,1fr)}
  .hm-abmap{max-height:none}
  .hm-abpts{grid-template-columns:minmax(0,1fr)}
  .hm-abpts li + li{border-left:0;border-top:1px solid rgba(255,255,255,.12)}
}
@media (max-width:520px){.hm-ablab--hq span{display:none}}
@media (prefers-reduced-motion:reduce){.hm-abpulse{animation:none}}
/* the photograph as large as the space allows, at its own proportions */

/* 05 record */
.hm-record{background:var(--stone)}
.hm-head--tight{grid-template-columns:1fr;margin-bottom:clamp(1.6rem,6svh,4.5rem)}
.hm-head--tight .hm-h2{max-width:none}
.hm-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));margin:0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.hm-stat{display:flex;flex-direction:column-reverse;justify-content:flex-end;gap:min(1.2rem,2.4svh);padding:min(3rem,6svh) clamp(1rem,2.2vw,2.2rem)}
.hm-stat+.hm-stat{border-left:1px solid var(--line)}
.hm-stat:first-child{padding-left:0}
.hm-stat dd{display:flex;align-items:flex-start;margin:0;font-family:var(--serif);font-size:var(--fs-title);line-height:.85;letter-spacing:-.03em;font-variant-numeric:tabular-nums}
.hm-stat sup{margin-left:.04em;font-size:var(--fs-sub);line-height:1;color:var(--accent);top:0}
.hm-stat dt{display:flex;flex-direction:column;gap:.25rem;font-size:var(--fs-body);font-weight:600}
.hm-stat dt span{font-size:var(--fs-body);font-weight:400;color:var(--mute)}

/* 05 products: the title and the words above, the job card across the width */
.hm-products{background:var(--stone)}
.hm-phead{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:clamp(1rem,4vw,4rem);align-items:end;margin-bottom:min(1.2rem,2.2svh)}
.hm-phead .hm-h2{max-width:18ch}
.hm-pside{display:flex;flex-direction:column;align-items:flex-end;gap:min(1.2rem,2.2svh)}
.hm-teaser{min-width:0}
@media (max-width:1023px){
  .hm-phead{grid-template-columns:minmax(0,1fr);align-items:start}
  .hm-phead .hm-h2{max-width:none}
  .hm-pside{align-items:flex-start}
}
@media (max-width:767px){
  .hm-products{justify-content:flex-start}
}
/* 07 contact: the close, on stone; the photograph's frame takes the height */
.hm-contact{background:var(--stone);color:var(--ink)}
.hm-contact > .hm-wrap{display:flex;flex-direction:column;flex:1 1 auto;max-height:56rem}
.hm-contact .hm-mark{color:var(--mute)}
.hm-contact .hm-idx{color:var(--accent)}
.hm-cgrid{display:grid;flex:1 1 auto;grid-template-columns:minmax(0,1.45fr) minmax(0,1fr);gap:clamp(2rem,6vw,7rem);align-items:stretch}
.hm-ccopy{display:flex;flex-direction:column;justify-content:center;align-items:flex-start}
.hm-ch{margin:min(1.2rem,2.4svh) 0 0;font-family:var(--serif);font-weight:600;font-size:var(--fs-title);line-height:1.1;letter-spacing:-.02em;max-width:12ch}
.hm-clede{margin:min(1.4rem,2.6svh) 0 0;max-width:44rem;font-size:var(--fs-body);line-height:1.7;color:var(--mute);text-wrap:pretty}
.hm-cbtns{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:min(2rem,3.8svh)}
.hm-btn--paper{background:var(--navy);color:#f5f0e6}
.hm-btn--paper:hover{background:var(--accent)}
.hm-btn--line{border:1.5px solid rgba(18,34,59,.26);color:var(--ink)}
.hm-btn--line:hover{border-color:var(--navy)}
.hm-cfig{display:flex;flex-direction:column;justify-content:center;min-height:0;margin:0;container-type:size}
.hm-cph{position:relative;flex:none;width:min(100cqw,calc(100cqh * 1.7778));aspect-ratio:1600/900;overflow:hidden;border-radius:16px;background:#d3c8b5}
@container (max-height:6.5rem){.hm-cph{display:none}}
.hm-cph img{position:absolute;inset:0}
/* four ways to reach us, as tiles: a drawn icon, what it is, and the number or address */
.hm-ways{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.92fr) minmax(0,1.3fr) minmax(0,1.12fr);gap:clamp(.6rem,1vw,.9rem);margin:min(2.8rem,5.2svh) 0 0;padding:0;list-style:none}
.hm-ways li{display:flex;min-width:0}
.hm-way{position:relative;display:flex;align-items:center;gap:.95rem;box-sizing:border-box;width:100%;min-width:0;padding:min(1.05rem,2svh) 1.4rem min(1.05rem,2svh) min(1.05rem,2svh);border-radius:14px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);color:inherit;text-decoration:none;transition:box-shadow .45s,translate .45s cubic-bezier(.2,.7,.2,1)}
.hm-way:hover{box-shadow:inset 0 0 0 1.5px var(--navy);translate:0 -3px}
.hm-way:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.hm-wi{flex:none;display:grid;place-items:center;width:min(46px,6.4svh);height:min(46px,6.4svh);min-width:38px;min-height:38px;border-radius:10px;background:rgba(39,86,160,.1);color:var(--accent);transition:background-color .45s,color .45s}
.hm-wi svg{width:21px;height:21px}
.hm-way--whatsapp .hm-wi{background:rgba(31,138,76,.12);color:#1f8a4c}
.hm-way:hover .hm-wi{background:var(--navy);color:#f5f0e6}
.hm-way--whatsapp:hover .hm-wi{background:#1f8a4c;color:#f5f0e6}
.hm-wt{display:flex;flex-direction:column;gap:.18rem;min-width:0}
.hm-wk{font-size:var(--fs-body);letter-spacing:.01em;color:var(--mute)}
.hm-wv{overflow-wrap:anywhere;font-size:var(--fs-body);font-weight:600;line-height:1.3;color:var(--ink)}
.hm-way--call .hm-wv{white-space:nowrap}
@media (min-width:1024px) and (max-width:1180px){.hm-wv{font-size:var(--fs-body)}.hm-wi{width:40px;height:40px;min-width:40px;min-height:40px}}
.hm-wshort{display:none}
.hm-ways .hm-ar{position:absolute;right:1rem;top:1rem;color:var(--mute)}
.hm-way:hover .hm-ar{color:var(--ink);transform:translate(2px,-2px)}

/* tablets */
@media (max-width:1023px){
  .hm-head{grid-template-columns:1fr;align-items:start;gap:min(1.2rem,2svh)}
  .hm-card{flex-basis:44vw}
  .hm-sgrid{grid-template-columns:minmax(0,1fr)}
  .hm-services .hm-side,.hm-projects .hm-side{align-items:flex-start}
  .hm-cgrid{grid-template-columns:1fr 1fr;gap:2.5rem}
  .hm-ways{grid-template-columns:1fr 1fr}
  .hm-fgrid{grid-template-columns:1fr 1fr}
}
/* phones held upright */
@media (max-width:767px){
  .hm{--nav-room:var(--nav-h,64px)}
  .hm-sec{justify-content:flex-start;padding:calc(var(--nav-room) + min(.8rem,1.6svh)) 0 min(1.4rem,2.6svh)}
  .hm-h2{font-size:var(--fs-title);max-width:13ch}
  .hm-head{margin-bottom:min(1.4rem,2.6svh)}
  .hm-side{gap:min(1rem,1.8svh)}
  .hm-lede{line-height:1.6}
  .hm-ctrl .hm-nav{width:40px;height:40px}
  /* projects */
  .hm-projects{justify-content:center}
  .hm-card{flex-basis:84vw}
  .hm-track{flex:none;min-height:0;max-height:none}
  .hm-pname{font-size:var(--fs-sub)}
  .hm-pfoot{gap:1.2rem;margin-top:min(1.2rem,2.2svh)}
  /* services: waterproofing names its four places only, and the six sit two by two */
  .hm-stiles{gap:.55rem}
  .hm-tile{padding:.85rem;border-radius:14px}
  .hm-ttop{padding-bottom:.75rem}
  .hm-tile .hm-sic{width:38px;height:38px;border-radius:11px}
  .hm-tgo{width:2.1rem;height:2.1rem}
  .hm-sfeat{--sp:1.1rem;border-radius:18px}
  .hm-schk{gap:.6rem .9rem}
  .hm-schk li > span > span{display:none}
  /* about: copy, the principles as tags, then the photograph */
  .hm-mark{flex-wrap:wrap}
  /* record */
  .hm-record{justify-content:center}
  .hm-stats{grid-template-columns:1fr 1fr}
  .hm-stat{padding:min(1.6rem,3.2svh) 1rem}
  .hm-stat:nth-child(odd){padding-left:0;border-left:0}
  .hm-stat:nth-child(n+3){border-top:1px solid var(--line)}
  .hm-stat dd{font-size:var(--fs-title)}
  .hm-stat dt span{font-size:var(--fs-body)}
  /* contact */
  .hm-contact > .hm-wrap{max-height:none}
  .hm-cgrid{display:flex;flex-direction:column;gap:min(1.3rem,2.4svh)}
  .hm-ccopy{flex:none}
  .hm-ch{font-size:var(--fs-title)}
  .hm-clede{line-height:1.6}
  .hm-cbtns{margin-top:min(1.3rem,2.4svh)}
  .hm-cbtns .hm-btn{height:2.9rem}
  .hm-cfig{flex:1 1 0;min-height:0}
  .hm-ways{grid-template-columns:1fr 1fr;gap:.5rem;margin-top:min(1.2rem,2.2svh)}
  .hm-way{gap:.55rem;padding:min(.7rem,1.3svh) .7rem;border-radius:14px}
  .hm-way:hover{translate:none}
  .hm-wi{width:30px;height:30px;min-width:30px;min-height:30px;border-radius:9px}
  .hm-wi svg{width:16px;height:16px}
  .hm-wk{font-size:var(--fs-body)}
  .hm-wv{font-size:var(--fs-body)}
  .hm-wfull{display:none}
  .hm-wshort{display:inline}
  .hm-ways .hm-ar{display:none}
}
/* narrow phones: the tiles' number still on one line */
@media (max-width:380px){
  .hm-way{gap:.5rem;padding:min(.65rem,1.2svh) .6rem}
  .hm-wi{width:28px;height:28px;min-width:28px;min-height:28px}
  .hm-wv{font-size:var(--fs-body)}
}
@media (max-width:340px){
  .hm-wi{display:none}
}
/* narrow phones: the service tiles' drawings step aside */
@media (max-width:360px){
  .hm-tile .hm-sic{display:none}
}
/* short phones: drop what does not fit in one screen */
@media (max-width:767px) and (max-height:760px){
  .hm-side .hm-lede{display:none}
  .hm-cfig{display:none}
}
@media (max-width:767px) and (max-height:700px){
}
/* laptops with short screens (1366 x 768 and the like): the service tiles a little tighter */
@media (min-width:1024px) and (max-height:880px){
  .hm-tile{padding:.95rem 1.05rem}
  .hm-ttop{padding-bottom:.7rem}
  .hm-sic{width:42px;height:42px;border-radius:12px}
  .hm-tgo{width:2.4rem;height:2.4rem}
  .hm-sfeat{--sp:clamp(1.15rem,1.8vw,1.6rem)}
  .hm-sft{margin-top:.8rem}
}
/* small phones: the six services by name only */
@media (max-width:479px){
  .hm-tl{display:none}
}
/* phones turned sideways and other very short screens: sections take their natural height */
@media (max-height:520px){
  .hm-sec{min-height:0;justify-content:flex-start}
  .hm-track{flex:none;height:min(26rem,90svh)}
}
@media (prefers-reduced-motion:reduce){
  .hm.js [data-rv]{opacity:1;transform:none;transition:none}
  .hm-tile,.hm-tgo{transition:none}
  .hm-tile:hover,.hm-tile:focus-visible{transform:none}
}
/* the footer's waterline rises into the foot of the last section: room for it */
.hm-sec.hm-contact{padding-bottom:calc(clamp(1.4rem,4.6svh,3.2rem) + 2.5rem)}
/* the close takes only the room it needs, not a whole screen */
.hm-sec.hm-contact{min-height:0;justify-content:flex-start;padding-top:clamp(2.2rem,5vh,3.4rem)}
.hm-contact > .hm-wrap{flex:none;max-height:none}
.hm-contact .hm-cgrid{flex:none;align-items:center}
.hm-contact .hm-cfig{container-type:normal}
.hm-contact .hm-cph{width:100%}
/* touch screens: text links keep their look but get a finger-sized tap area; chip links grow to finger height */
@media (pointer:coarse){
  .hm-link,.hm-slink{position:relative}
  .hm-link::after,.hm-slink::after{content:"";position:absolute;inset:-11px -6px}
}
`;

/* ------------------------------------------------------------ behaviour */
/** reveals, the projects strip, the services preview and the count-ups */
export function mountHome(root: HTMLElement) {
  const off: (() => void)[] = [];
  const on = <K extends keyof HTMLElementEventMap>(el: EventTarget, type: K | string, fn: (e: never) => void, o?: AddEventListenerOptions) => {
    el.addEventListener(type, fn as EventListener, o);
    off.push(() => el.removeEventListener(type, fn as EventListener, o));
  };
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.add("js");

  // reveals
  const rv = new IntersectionObserver(
    (entries) => {
      for (const e of entries)
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          rv.unobserve(e.target);
        }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );
  root.querySelectorAll("[data-rv]").forEach((el) => rv.observe(el));
  off.push(() => rv.disconnect());
  // projects: buttons, position, progress, and drag to scroll with a mouse
  const track = root.querySelector<HTMLElement>("[data-track]");
  if (track) {
    const prev = root.querySelector<HTMLButtonElement>("[data-prev]");
    const next = root.querySelector<HTMLButtonElement>("[data-next]");
    const pos = root.querySelector<HTMLElement>("[data-pos]");
    const bar = root.querySelector<HTMLElement>("[data-bar]");
    const cards = Array.from(track.children) as HTMLElement[];
    const step = () => (cards[1] ? cards[1].offsetLeft - cards[0]!.offsetLeft : track.clientWidth * 0.8);
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const x = track.scrollLeft;
      const i = Math.min(cards.length - 1, Math.round(x / Math.max(1, step())));
      if (pos) pos.textContent = String((x >= max - 2 ? cards.length : i + 1)).padStart(2, "0");
      if (bar) {
        const share = track.clientWidth / Math.max(1, track.scrollWidth);
        bar.style.transform = `translateX(${(max > 0 ? x / max : 0) * (1 / share - 1) * 100}%) scaleX(1)`;
        bar.style.width = `${share * 100}%`;
      }
    };
    // the arrows go round: on from the last card to the first, and back from the first to the last
    const go = (dir: number) => {
      const max = track.scrollWidth - track.clientWidth;
      const behavior = reduced ? "auto" : "smooth";
      if (dir > 0 && track.scrollLeft >= max - 2) track.scrollTo({ left: 0, behavior });
      else if (dir < 0 && track.scrollLeft <= 2) track.scrollTo({ left: max, behavior });
      else track.scrollBy({ left: dir * step(), behavior });
    };
    if (prev) on(prev, "click", () => go(-1));
    if (next) on(next, "click", () => go(1));
    on(track, "scroll", update, { passive: true });
    on(window, "resize", update);
    update();
    // mouse drag (touch scrolls natively)
    let down = false;
    let moved = false;
    let sx = 0;
    let sl = 0;
    on(track, "pointerdown", (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true;
      moved = false;
      sx = e.clientX;
      sl = track.scrollLeft;
    });
    on(window, "pointermove", (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (!moved && Math.abs(dx) > 6) {
        moved = true;
        track.classList.add("is-drag");
      }
      if (moved) track.scrollLeft = sl - dx;
    });
    on(window, "pointerup", () => {
      if (!down) return;
      down = false;
      if (moved) {
        track.classList.remove("is-drag");
        // settle on the nearest card
        const s = step();
        track.scrollTo({ left: Math.round(track.scrollLeft / s) * s, behavior: reduced ? "auto" : "smooth" });
      }
    });
    on(track, "click", (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    }, { capture: true });
    on(track, "dragstart", (e: DragEvent) => e.preventDefault());

    // it moves on by itself, a card every few seconds, back to the first after the last. It waits while a
    // mouse is over the strip, a finger is on it or the keyboard is in it, and while it is off screen or the
    // tab is hidden; the arrows, a drag or a swipe start the count again. With reduced motion it stays put.
    const sec = track.closest<HTMLElement>(".hm-projects");
    if (sec && !reduced) {
      const EVERY = 5200;
      const hold = { hover: false, focus: false, touch: false, away: true, hidden: document.visibilityState === "hidden" };
      let acc = 0;
      let last = 0;
      let raf = 0;
      const running = () => !hold.hover && !hold.focus && !hold.touch && !hold.away && !hold.hidden;
      const frame = (now: number) => {
        raf = 0;
        if (!running()) {
          last = 0;
          return;
        }
        if (last) acc += Math.min(100, now - last);
        last = now;
        if (acc >= EVERY) {
          acc = 0;
          go(1);
        }
        raf = requestAnimationFrame(frame);
      };
      const sync = () => {
        if (running() && !raf) {
          last = 0;
          raf = requestAnimationFrame(frame);
        }
      };
      const again = () => {
        acc = 0;
        sync();
      };
      on(track, "pointerenter", (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        hold.hover = true;
      });
      on(track, "pointerleave", (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        hold.hover = false;
        again();
      });
      on(track, "touchstart", () => {
        hold.touch = true;
      }, { passive: true });
      const lift = () => {
        hold.touch = false;
        again();
      };
      on(track, "touchend", lift, { passive: true });
      on(track, "touchcancel", lift, { passive: true });
      on(track, "focusin", () => {
        hold.focus = true;
      });
      on(track, "focusout", (e: FocusEvent) => {
        if (track.contains(e.relatedTarget as Node | null)) return;
        hold.focus = false;
        again();
      });
      if (prev) on(prev, "click", again);
      if (next) on(next, "click", again);
      const seen = new IntersectionObserver((es) => {
        hold.away = !es.some((e) => e.isIntersecting);
        sync();
      }, { threshold: 0.35 });
      seen.observe(sec);
      on(document, "visibilitychange", () => {
        hold.hidden = document.visibilityState === "hidden";
        sync();
      });
      off.push(() => {
        seen.disconnect();
        cancelAnimationFrame(raf);
      });
    }
  }

  // products: pick a job and its section detail shows; tap a layer (on the drawing or in the list) for its products
  const hl = root.querySelector<HTMLElement>("[data-hl]");
  if (hl) {
    const tabs = Array.from(hl.querySelectorAll<HTMLButtonElement>("[data-hl-tab]"));
    const panels = Array.from(hl.querySelectorAll<HTMLElement>("[data-hl-panel]"));
    const strip = hl.querySelector<HTMLElement>(".hl-jobs");
    panels.forEach((p) => {
      p.querySelectorAll<HTMLElement>(".hl-row").forEach((r, n) => r.style.setProperty("--n", String(n)));
      p.querySelectorAll<SVGGElement>(".hl-mk").forEach((m, n) => {
        // the number's own group pops in, so its place on the drawing (the outer group's transform) is kept
        const inner = document.createElementNS("http://www.w3.org/2000/svg", "g");
        inner.setAttribute("class", "hl-mki");
        inner.style.setProperty("--n", String(n));
        while (m.firstChild) inner.appendChild(m.firstChild);
        m.appendChild(inner);
      });
    });
    const select = (k: string, focus = false) => {
      tabs.forEach((t) => {
        const sel = t.dataset.hlTab === k;
        t.setAttribute("aria-selected", String(sel));
        t.tabIndex = sel ? 0 : -1;
        if (sel && focus) t.focus({ preventScroll: true });
        // keep the chosen job in view in the strip of jobs on narrower screens
        if (sel && strip && strip.scrollWidth > strip.clientWidth) strip.scrollTo({ left: t.offsetLeft - strip.clientWidth / 2 + t.offsetWidth / 2, behavior: reduced ? "auto" : "smooth" });
      });
      panels.forEach((p) => {
        const sel = p.dataset.hlPanel === k;
        p.hidden = !sel;
        p.classList.toggle("is-on", sel);
      });

    };
    const pick = (p: HTMLElement, key: string) => {
      p.classList.add("has-pick");
      p.querySelectorAll<Element>("[data-l]").forEach((el) => el.classList.toggle("is-on", el.getAttribute("data-l") === key));
      p.querySelectorAll<HTMLElement>(".ld-row").forEach((r) => {
        const open = r.dataset.l === key;
        r.querySelector(".ld-rb")?.setAttribute("aria-expanded", String(open));
        const ul = r.querySelector<HTMLElement>(".ld-ps");
        if (ul) ul.hidden = !open;
      });
    };
    panels.forEach((p) =>
      on(p, "click", (e: Event) => {
        const t = e.target as Element;
        if (t.closest("a")) return;
        const hit = t.closest<Element>(".ld-el, .ld-mk, .ld-row");
        const key = hit?.getAttribute("data-l");
        if (key) pick(p, key);
      }),
    );
    tabs.forEach((t, i) => {
      on(t, "click", () => {
        if (t.getAttribute("aria-selected") !== "true") select(t.dataset.hlTab!);
      });
      on(t, "keydown", (e: KeyboardEvent) => {
        const step = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
        if (!step && e.key !== "Home" && e.key !== "End") return;
        e.preventDefault();
        const n = e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : (i + step + tabs.length) % tabs.length;
        select(tabs[n]!.dataset.hlTab!, true);
      });
    });
    const light = (p: HTMLElement, layer: string | null) => {
      p.querySelector(".hl-art")?.classList.toggle("has-hot", Boolean(layer));
      p.querySelectorAll("[data-layer]").forEach((el) => el.classList.toggle("is-hot", el.getAttribute("data-layer") === layer));
      // a layer drawn as something in a band (a joint, a plug, the steel) keeps that band lit
      p.querySelectorAll(".hl-band").forEach((b) => b.classList.toggle("is-host", Boolean(layer) && Boolean(b.querySelector(`.hl-feat[data-layer="${layer}"]`))));
    };
    const layerAt = (t: EventTarget | null) => (t instanceof Element ? t.closest("[data-layer]")?.getAttribute("data-layer") ?? null : null);
    panels.forEach((p) => {
      on(p, "pointerover", (e: PointerEvent) => light(p, layerAt(e.target)));
      on(p, "pointerleave", () => light(p, null));
      on(p, "focusin", (e: FocusEvent) => light(p, layerAt(e.target)));
      on(p, "focusout", (e: FocusEvent) => {
        if (!p.contains(e.relatedTarget as Node | null)) light(p, null);
      });
    });
  }

  // record: numbers count up once
  const counts = Array.from(root.querySelectorAll<HTMLElement>("[data-count]"));
  if (counts.length && !reduced) {
    counts.forEach((c) => (c.textContent = "0"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.unobserve(e.target);
          const el = e.target as HTMLElement;
          const to = Number(el.dataset.count);
          const t0 = performance.now();
          const run = (now: number) => {
            const k = Math.min(1, (now - t0) / 1600);
            el.textContent = String(Math.round(to * (1 - Math.pow(1 - k, 3))));
            if (k < 1) requestAnimationFrame(run);
          };
          requestAnimationFrame(run);
        }
      },
      { threshold: 0.4 },
    );
    counts.forEach((c) => io.observe(c));
    off.push(() => io.disconnect());
  }

  return () => {
    off.forEach((f) => f());
    root.classList.remove("js");
  };
}
