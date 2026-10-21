/**
 * Home page, below the film: one short hook for each page of the site, in the
 * order of the top menu, each with a button to that page.
 *
 *   01 About          the home page's own About section (lib/home/sections.ts): the statement,
 *                     four short facts and the frame for the team's photograph
 *   02 Products       our best-selling Fosroc products on one shelf, a tile for each kind,
 *                     then the brands in our methods guide, moving by
 *   03 Waterproofing  "where is the water getting in?": four of the places, each opening its
 *                     methods on the waterproofing page
 *   04 Projects       three of our projects as one mosaic of photographs
 *   05 Services       the home page's own services section (lib/home/sections.ts)
 *   06 Blog           the three newest articles, as cards
 *   07 Contact        the home page's own contact section (lib/home/sections.ts)
 *
 * Plain strings, like the rest of the home page: the server renders every word
 * and the links work before scripts arrive. The shared look (markers, buttons,
 * reveals) comes from HOME_CSS.
 */
import { brandsMarqueeHtml, BRANDS_MARQUEE_CSS } from "../methods/brand-logos";
import { contactMarkup, rootedAboutMarkup, ROOTED_ABOUT_CSS, servicesMarkup, type HomeData } from "./sections";

export interface HookData {
  /** the best sellers on the shelf: one tile per kind, its first product shown */
  shelf: { group: string; lead: { name: string; slug: string; cat: string; pic: string }; more: string[] }[];
  /** the places on the waterproofing page, each with how many methods its guide names */
  places: { key: string; label: string; n: number }[];
  projects: { slug: string; name: string; location: string; type: string; image: string }[];
  posts: { slug: string; title: string; category: string; minutes: number; excerpt: string }[];
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const arrow = `<svg class="hm-ar" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const mark = (n: string, label: string) =>
  `<p class="hm-mark" data-rv><span class="hm-idx">${n}</span><span class="hm-rule" aria-hidden="true"></span><span>${esc(label)}</span></p>`;
const btn = (href: string, text: string, kind = "ink") => `<a class="hm-btn ${kind === "paper" ? "hk-btn--paper" : `hm-btn--${kind}`} hk-btn" href="${href}" data-internal>${esc(text)}${arrow}</a>`;
const words = (n: number) => ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen"][n] ?? String(n);
const Cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** the head of a hook: the marker and headline on the left, a line and the button on the right */
const head = (n: string, label: string, id: string, title: string, line: string, button: string) => `<div class="hk-head">
      <div>${mark(n, label)}<h2 class="hm-h2" id="${id}" data-rv>${title}</h2></div>
      <div class="hk-side" data-rv><p class="hk-lede">${line}</p>${button}</div>
    </div>`;

/* ------------------------------------------------------------------ 02 products */
function products(d: HookData) {
  const n = d.shelf.reduce((s, g) => s + 1 + g.more.length, 0);
  const tiles = d.shelf
    .map(
      (g, i) => `<li data-rv style="--d:${i * 50}ms"><a class="hk-tile" href="/products#${esc(g.lead.slug)}" data-internal>
      <span class="hk-pic">${g.lead.pic}</span>
      <span class="hk-kind">${esc(g.group)}</span>
      <span class="hk-name">${esc(g.lead.name)}</span>
      <span class="hk-more">${g.more.length ? `Also ${esc(g.more.join(", "))}` : esc(g.lead.cat)}</span>
    </a></li>`,
    )
    .join("");
  return `<section class="hk hk--stone hk-prod" id="products" aria-labelledby="hk-prod-h">
  <div class="hm-wrap">
    ${head("02", "Products", "hk-prod-h", "Our best-selling Fosroc&nbsp;products.", `${Cap(words(n))} products for concrete, blocks and waterproofing that builders ask us for most. Rates on request.`, btn("/products", "See all products"))}
    <ul class="hk-shelf">${tiles}</ul>
    <div class="hm-pbrands hk-brands" data-rv>
      <header class="hm-pbhead">
        <p class="hk-bk">Brands</p>
        <h3 class="hm-pbh">The brands in our methods guide.</h3>
      </header>
      ${brandsMarqueeHtml()}
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ 03 waterproofing */
function waterproofing(d: HookData) {
  const drop = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5c3.4 4.3 6 7.6 6 10.6a6 6 0 0 1-12 0c0-3 2.6-6.3 6-10.6z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
  // a sample: the first four places; the rest are on the waterproofing page
  const tiles = d.places
    .slice(0, 4)
    .map(
      (p, i) => `<li data-rv style="--d:${i * 40}ms"><a class="hk-place" href="/waterproofing#a-${esc(p.key)}" data-internal>
      <span class="hk-pn">${String(i + 1).padStart(2, "0")}</span>
      <span class="hk-pl">${esc(p.label)}</span>
      <span class="hk-pm">${drop}${p.n ? `${p.n} ${p.n === 1 ? "method" : "methods"}` : "Ask us"}</span>
      <span class="hk-pgo" aria-hidden="true">${arrow}</span>
    </a></li>`,
    )
    .join("");
  return `<section class="hk hk--paper hk-wp" id="waterproofing" aria-labelledby="hk-wp-h">
  <div class="hm-wrap">
    ${head("03", "Waterproofing", "hk-wp-h", "Where is the water getting&nbsp;in?", "Pick the place. You will see the methods that seal it, and where each one stops the water.", btn("/waterproofing", "See every method"))}
    <ol class="hk-places">${tiles}</ol>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ 04 projects */
function projects(d: HookData) {
  const ps = d.projects.slice(0, 3);
  const tile = (p: HookData["projects"][number], i: number) => `<li class="hk-m${i === 0 ? " hk-m--big" : ""}" data-rv style="--d:${i * 60}ms"><a href="/projects#${esc(p.slug)}" data-internal>
      <img src="${esc(p.image)}" width="1376" height="768" alt="${esc(`${p.name}, ${p.location}`)}" loading="lazy" decoding="async">
      <span class="hk-mcap"><span class="hk-mt">${esc(p.type)}</span><b>${esc(p.name)}</b><span>${esc(p.location)}</span></span>
    </a></li>`;
  return `<section class="hk hk--stone hk-proj" id="projects" aria-labelledby="hk-proj-h">
  <div class="hm-wrap">
    ${head("04", "Projects", "hk-proj-h", "From homes to factories, kept&nbsp;dry.", "Homes, villas, offices, shops and factories, with the waterproofing built into each.", btn("/projects", "See our projects"))}
    <ul class="hk-mosaic">${ps.map(tile).join("")}</ul>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ 06 blog */
function blog(d: HookData) {
  const cards = d.posts
    .slice(0, 3)
    .map(
      (p, i) => `<li data-rv style="--d:${i * 70}ms"><a class="hk-post" href="/blog/${esc(p.slug)}" data-internal>
      <span class="hk-pc">${esc(p.category)}<span>${p.minutes} min read</span></span>
      <span class="hk-pt">${esc(p.title)}</span>
      <span class="hk-pe">${esc(p.excerpt)}</span>
      <span class="hk-pr">Read the article${arrow}</span>
    </a></li>`,
    )
    .join("");
  return `<section class="hk hk--stone hk-blog" id="blog" aria-labelledby="hk-blog-h">
  <div class="hm-wrap">
    <div class="hk-head hk-head--end">
      <div>${mark("06", "Blog")}<h2 class="hm-h2" id="hk-blog-h" data-rv>Know your building before the rain&nbsp;does.</h2></div>
      <div class="hk-side" data-rv>${btn("/blog", "Read the blog")}</div>
    </div>
    <ul class="hk-posts">${cards}</ul>
  </div>
</section>`;
}

/** every hook, in the order of the top menu */
export function hooksMarkup(home: HomeData, d: HookData) {
  return [
    rootedAboutMarkup(home, { n: "01" }),
    products(d),
    waterproofing(d),
    projects(d),
    servicesMarkup(home, { n: "05" }),
    blog(d),
    contactMarkup(home, { n: "07" }),
  ].join("\n");
}

export const HOOKS_CSS =
  ROOTED_ABOUT_CSS +
  BRANDS_MARQUEE_CSS +
  `
/* the hooks: one short section per page, in the order of the top menu; the grounds alternate, light sand and stone */
.hm-services,.hm-contact{background:var(--paper)}
.hk{position:relative;z-index:10;padding:clamp(4rem,11vh,7rem) 0}
.hk--paper{background:var(--paper)}
.hk--stone{background:var(--stone)}
.hk--night{background:var(--navy);color:#f5f0e6}
.hk--night .hm-mark{color:rgba(245,240,230,.7)}
.hk--night .hm-idx{color:#9fd3ea}
.hk--night .hm-h2{color:#fff}
.hk--night .hk-lede{color:rgba(245,240,230,.78)}
.hk .hm-h2{margin-top:.9rem}
.hk-lede{margin:0;max-width:34rem;font-size:var(--fs-body);line-height:1.6;color:var(--mute);text-wrap:pretty}
.hk-btn{height:3.1rem}
.hk-btn--paper{background:#f5f0e6;color:var(--navy)}
.hk-btn--paper:hover{background:#fff}
.hk-head{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);align-items:end;gap:1.4rem clamp(2rem,6vw,6rem);margin-bottom:clamp(1.6rem,4vh,2.6rem)}
.hk-side{display:flex;flex-direction:column;align-items:flex-start;gap:1.2rem}
/* a head with only the button beside the headline: the button at the far right */
.hk-head--end .hk-side{align-items:flex-end;justify-self:end}

/* 02 products: a shelf, one tile per kind, its first product in the picture */
.hk-shelf{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:clamp(.6rem,1.2vw,1rem);margin:0;padding:0;list-style:none}
.hk-tile{display:flex;flex-direction:column;height:100%;padding:.7rem .7rem 1rem;border-radius:18px;background:#fff;box-shadow:0 0 0 1px var(--line);color:inherit;text-decoration:none;transition:transform .35s cubic-bezier(.2,.7,.2,1),box-shadow .35s}
.hk-tile:hover{transform:translateY(-4px);box-shadow:0 0 0 1.5px var(--navy),0 24px 40px -28px rgba(18,34,59,.5)}
.hk-tile:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.hk-pic{position:relative;display:grid;place-items:center;aspect-ratio:1;overflow:hidden;margin-bottom:.8rem;padding:.8rem;border-radius:12px;background:#f4efe6}
.hk-pic img{position:absolute;inset:8%;width:84%;height:84%;object-fit:contain;mix-blend-mode:multiply}
.hk-pic svg{width:82%;height:auto}
.hk-kind{padding:0 .3rem;font-size:var(--fs-body);font-weight:600;color:var(--accent)}
.hk-name{margin-top:.2rem;padding:0 .3rem;font-family:var(--serif);font-size:var(--fs-sub);font-weight:600;line-height:1.2;letter-spacing:-.01em;color:var(--ink)}
.hk-more{margin-top:.4rem;padding:0 .3rem;font-size:var(--fs-body);line-height:1.45;color:var(--mute)}
.hk-brands{margin-top:clamp(2.2rem,5vh,3.4rem)}
.hk-bk{margin:0 0 .6rem;font-size:var(--fs-body);font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--water)}
.hm-pbrands{padding-top:clamp(1.5rem,3vh,2.2rem);border-top:1px solid rgba(18,34,59,.1)}
.hm-pbhead{margin-bottom:1.2rem}
.hm-pbh{margin:0;font-family:var(--serif);font-weight:600;font-size:var(--fs-sub);line-height:1.2;letter-spacing:-.02em;color:var(--ink)}

/* 03 waterproofing: the eight places, a numbered tile each; pointed at, a tile turns night blue */
.hk-places{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.7rem;margin:0;padding:0;list-style:none}
.hk-place{--t:.25s;position:relative;display:grid;grid-template-rows:auto 1fr auto;gap:.5rem;height:100%;min-height:9.5rem;padding:1.1rem 1.2rem;border-radius:16px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);color:var(--ink);text-decoration:none;transition:background-color var(--t),box-shadow var(--t)}
.hk-pn,.hk-pl,.hk-pm,.hk-pm svg,.hk-pgo{transition:color var(--t),background-color var(--t),box-shadow var(--t)}
.hk-pn{font-size:var(--fs-body);font-weight:600;font-variant-numeric:tabular-nums;color:var(--accent)}
.hk-pl{font-family:var(--serif);font-size:var(--fs-sub);font-weight:600;line-height:1.2;letter-spacing:-.01em;color:var(--ink)}
.hk-pm{display:flex;align-items:center;gap:.4rem;font-size:var(--fs-body);color:var(--mute)}
.hk-pm svg{width:1rem;height:1rem;color:var(--water)}
.hk-pgo{position:absolute;top:1rem;right:1rem;display:grid;place-items:center;width:2.2rem;height:2.2rem;border-radius:50%;box-shadow:inset 0 0 0 1px var(--line);color:var(--ink)}
.hk-place:hover{background:var(--navy);box-shadow:none}
.hk-place:hover .hk-pn,.hk-place:hover .hk-pm svg{color:#9fd3ea}
.hk-place:hover .hk-pl{color:#fff}
.hk-place:hover .hk-pm{color:rgba(245,240,230,.75)}
.hk-place:hover .hk-pgo{background:#f5f0e6;color:var(--navy);box-shadow:none}
.hk-place:focus-visible{outline:2px solid var(--accent);outline-offset:3px}

/* 04 projects: three of them, one large photograph and two beside it, each with its name */
.hk-mosaic{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);grid-template-rows:repeat(2,minmax(0,1fr));gap:clamp(.6rem,1.2vw,1rem);height:min(36rem,calc(100svh - var(--nav-room) - 14rem));min-height:24rem;margin:0;padding:0;list-style:none}
.hk-m--big{grid-row:1/3}
.hk-m a{position:relative;display:block;height:100%;overflow:hidden;border-radius:18px;background:#d9d0bf;color:#fff;text-decoration:none}
.hk-m img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 1s cubic-bezier(.2,.7,.2,1)}
.hk-m a::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,16,34,0) 45%,rgba(6,16,34,.72))}
.hk-m a:hover img{transform:scale(1.05)}
.hk-m a:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
.hk-mcap{position:absolute;z-index:1;left:1rem;right:1rem;bottom:.9rem;display:flex;flex-direction:column;gap:.1rem;font-size:var(--fs-body);line-height:1.35}
.hk-mcap b{font-weight:600}
.hk-m--big .hk-mcap b{font-family:var(--serif);font-size:var(--fs-sub)}
.hk-mcap span:last-child{color:rgba(255,255,255,.78)}
.hk-mt{align-self:flex-start;margin-bottom:.35rem;padding:.1rem .55rem;border-radius:999px;background:rgba(255,255,255,.9);font-weight:600;color:var(--ink)}

/* 06 blog: the three newest, as cards */
.hk-posts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(.8rem,1.4vw,1.2rem);margin:0;padding:0;list-style:none}
.hk-post{display:flex;flex-direction:column;gap:.7rem;height:100%;padding:clamp(1.1rem,1.8vw,1.5rem);border-radius:18px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);color:inherit;text-decoration:none;transition:box-shadow .3s,transform .3s}
.hk-post:hover{box-shadow:inset 0 0 0 1.5px var(--navy);transform:translateY(-3px)}
.hk-post:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.hk-pc{display:flex;justify-content:space-between;gap:1rem;font-size:var(--fs-body);font-weight:600;color:var(--accent)}
.hk-pc span{font-weight:500;color:var(--mute)}
.hk-pt{font-family:var(--serif);font-size:var(--fs-sub);font-weight:600;line-height:1.25;letter-spacing:-.01em;color:var(--ink)}
.hk-pe{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden;font-size:var(--fs-body);line-height:1.55;color:var(--mute)}
.hk-pr{display:inline-flex;align-items:center;gap:.5rem;margin-top:auto;padding-top:.4rem;font-size:var(--fs-body);font-weight:600;color:var(--ink)}
.hk-post:hover .hm-ar{transform:translate(2px,-2px)}

@media (max-width:1199px){
  .hk-shelf{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (max-width:1099px){
  .hk-posts{grid-template-columns:repeat(2,minmax(0,1fr))}
  .hk-posts li:nth-child(3){display:none}
}
@media (max-width:1023px){
  .hk-places{grid-template-columns:repeat(2,minmax(0,1fr))}
  .hk-mosaic{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:none;grid-auto-rows:14rem;height:auto}
  .hk-m--big{grid-column:1/-1;grid-row:auto}
}
@media (max-width:899px){
  .hk-head,.hk-bgrid{grid-template-columns:minmax(0,1fr)}
  .hk-head--end .hk-side{align-items:flex-start;justify-self:start}
}
@media (max-width:599px){
  .hk-shelf{grid-template-columns:repeat(2,minmax(0,1fr))}
  .hk-posts{grid-template-columns:minmax(0,1fr)}
  .hk-posts li:nth-child(3){display:block}
  .hk-place{min-height:8rem;padding:.9rem 1rem}
  .hk-mosaic{grid-template-columns:minmax(0,1fr);grid-auto-rows:12rem}
  .hk-btn{width:100%}
  .hk-side{align-items:stretch}
}
@media (prefers-reduced-motion:reduce){.hk-tile,.hk-m img,.hk-place,.hk-post{transition:none}.hk-post:hover{transform:none}.hk-m a:hover img{transform:none}.hk-tile:hover{transform:none}}
`;
