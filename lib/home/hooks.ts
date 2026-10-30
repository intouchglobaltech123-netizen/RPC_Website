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
 *   04 Projects       three of our projects as a pile of prints, the top one's words beside it
 *   05 Services       the home page's own services section (lib/home/sections.ts)
 *   then the close     "Seen a damp patch?", in the about page's design (lib/pages/kit.ts)
 *
 * Plain strings, like the rest of the home page: the server renders every word
 * and the links work before scripts arrive. The shared look (markers, buttons,
 * reveals) comes from HOME_CSS.
 */
import { brandsMarqueeOf, BRANDS_MARQUEE_CSS } from "../methods/brand-logos";
import { ctaBand, KIT_CSS, type ContactInfo } from "../pages/kit";
import { rootedAboutMarkup, ROOTED_ABOUT_CSS, servicesMarkup, type HomeData } from "./sections";

export interface HookData {
  /** the best sellers on the shelf: one tile per kind, its first product shown */
  shelf: { group: string; lead: { name: string; slug: string; cat: string; pic: string }; more: string[] }[];
  /** the places on the waterproofing page, each with how many methods its guide names */
  /** the leaks people notice, as the film on the home page shows them: the place, what they see, what we do, and where to read more */
  signs: { place: string; see: string; fix: string; href: string; before: string; after: string }[];
  projects: { slug: string; name: string; location: string; type: string; image: string; summary: string }[];
  /** the brand slide: the product list's brands, then the methods guide's, with a colour for a name without a logo */
  brands: { name: string; color: string }[];
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const arrow = `<svg class="hm-ar" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const mark = (n: string, label: string) =>
  `<p class="hm-mark" data-rv><span class="hm-idx">${n}</span><span class="hm-rule" aria-hidden="true"></span><span>${esc(label)}</span></p>`;
const btn = (href: string, text: string, kind = "ink") => `<a class="hm-btn ${kind === "paper" ? "hk-btn--paper" : `hm-btn--${kind}`} hk-btn" href="${href}" data-internal>${esc(text)}${arrow}</a>`;


/* ------------------------------------------------------------------ 02 products */
function products(d: HookData) {
  const tiles = d.shelf
    .map(
      (g, i) => `<li data-rv style="--d:${i * 50}ms"><a class="hk-tile" href="/products#${esc(g.lead.slug)}" data-internal${g.more.length ? ` title="${esc(`Also ${g.more.join(", ")}`)}"` : ""}>
      <span class="hk-pic">${g.lead.pic}</span>
      <span class="hk-kind"><i aria-hidden="true"></i>${esc(g.group)}</span>
      <span class="hk-name">${esc(g.lead.name)}</span>
      <span class="hk-foot"><span class="hk-more">${g.more.length ? `+${g.more.length} more` : "View product"}</span><span class="hk-tgo" aria-hidden="true">${arrow}</span></span>
    </a></li>`,
    )
    .join("");
  return `<section class="hk hk--stone hk-prod" id="products" aria-labelledby="hk-prod-h">
  <div class="hm-wrap">
    <div class="hk-head">
      <div>${mark("02", "Products")}<h2 class="hm-h2" id="hk-prod-h" data-rv>Our best-selling products.</h2></div>
    </div>
    <ul class="hk-shelf">${tiles}</ul>
    <div class="hk-after" data-rv>${btn("/products", "See all products")}</div>
    <div class="hm-pbrands hk-brands" data-rv>
      <header class="hm-pbhead">
        <p class="hk-bk">Brands</p>
        <h3 class="hm-pbh">The brands in our products and methods.</h3>
      </header>
      ${brandsMarqueeOf(d.brands)}
    </div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ 03 waterproofing */
function waterproofing(d: HookData) {
  const cards = d.signs
    .map(
      (x, i) => `<li data-rv style="--d:${i * 60}ms"><a class="hk-ba" href="${esc(x.href)}" data-internal>
      <span class="hk-bap">
        <img class="hk-ba-after" src="${esc(x.after)}" width="960" height="540" alt="" loading="lazy" decoding="async">
        <img class="hk-ba-before" src="${esc(x.before)}" width="960" height="540" alt="" loading="lazy" decoding="async">
        <span class="hk-bal" aria-hidden="true">Before</span><span class="hk-bar" aria-hidden="true">After</span><span class="hk-bad" aria-hidden="true"></span>
      </span>
      <span class="hk-bat">
        <em>${esc(x.place)}</em>
        <b>${esc(x.see)}</b>
        <span class="hk-baf"><span>What we do</span>${esc(x.fix)}</span>
      </span>
      <span class="hk-bago" aria-hidden="true">${arrow}</span>
    </a></li>`,
    )
    .join("");
  return `<section class="hk hk--paper hk-wp" id="waterproofing" aria-labelledby="hk-wp-h">
  <div class="hm-wrap">
    <div class="hk-head"><div>${mark("03", "Waterproofing")}<h2 class="hm-h2" id="hk-wp-h" data-rv>What do you&nbsp;see?</h2></div></div>
    <ul class="hk-bas">${cards}</ul>
    <div class="hk-after" data-rv>${btn("/waterproofing", "See every method")}</div>
  </div>
</section>`;
}

/* ------------------------------------------------------------------ 04 projects */
function projects(d: HookData) {
  const ps = d.projects.slice(0, 3);
  const pin = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14.5s-4.6-3.9-4.6-7.6a4.6 4.6 0 0 1 9.2 0c0 3.7-4.6 7.6-4.6 7.6z" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="8" cy="6.9" r="1.6" fill="currentColor"/></svg>`;
  const chev = (dir: "l" | "r") =>
    `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="${dir === "l" ? "M10 3.5 5.5 8l4.5 4.5" : "M6 3.5 10.5 8 6 12.5"}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const info = ps
    .map(
      (p, i) => `<div class="hk-pi" data-pi="${i}"${i ? " hidden" : ""}>
        <span class="hk-ptype">${esc(p.type)}</span>
        <h3 class="hk-pname">${esc(p.name)}</h3>
        <p class="hk-ploc">${pin}${esc(p.location)}</p>
        <p class="hk-psum">${esc(p.summary)}</p>
      </div>`,
    )
    .join("");
  const prints = ps
    .map(
      (p, i) => `<figure class="hk-pol" data-pos="${i}" data-card="${i}">
        <span class="hk-polph"><img src="${esc(p.image)}" width="1376" height="768" alt="${esc(`${p.name}, ${p.location}`)}" loading="lazy" decoding="async" draggable="false"></span>
        <figcaption><b>${esc(p.name)}</b><span>${esc(p.location)}</span></figcaption>
      </figure>`,
    )
    .join("");
  return `<section class="hk hk--stone hk-proj" id="projects" aria-labelledby="hk-proj-h">
  <div class="hm-wrap">
    <div class="hk-pgrid" data-stack>
      <div class="hk-pinfo">
        <div>${mark("04", "Projects")}<h2 class="hm-h2" id="hk-proj-h" data-rv>From homes to factories, kept&nbsp;dry.</h2></div>
        <div aria-live="polite">${info}</div>
        <div class="hk-pctl">
          <button type="button" class="hk-arr" data-sprev aria-label="Previous project">${chev("l")}</button>
          <span class="hk-pcount"><b data-scount>1</b> / ${ps.length}</span>
          <button type="button" class="hk-arr" data-snext aria-label="Next project">${chev("r")}</button>
        </div>
        <div data-rv>${btn("/projects", "See our projects")}</div>
      </div>
      <div class="hk-stack" data-sdeck role="button" tabindex="0" aria-label="Show the next project">${prints}</div>
    </div>
  </div>
</section>`;
}

/**
 * The projects' pile of prints: the arrows, a tap on the pile or Enter on it
 * bring the next print to the front (the top one flies off and slides under
 * the others); the words beside it follow.
 */
export function mountHooks(root: HTMLElement) {
  const box = root.querySelector<HTMLElement>("[data-stack]");
  if (!box) return () => {};
  const cards = Array.from(box.querySelectorAll<HTMLElement>("[data-card]"));
  const infos = Array.from(box.querySelectorAll<HTMLElement>("[data-pi]"));
  const count = box.querySelector<HTMLElement>("[data-scount]");
  const deck = box.querySelector<HTMLElement>("[data-sdeck]");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let order = cards.map((_, i) => i);
  let busy = 0;
  const place = () => {
    order.forEach((c, pos) => (cards[c]!.dataset.pos = String(pos)));
    infos.forEach((el, i) => (el.hidden = i !== order[0]));
    if (count) count.textContent = String(order[0]! + 1);
  };
  const next = () => {
    if (busy) return;
    const top = cards[order[0]!]!;
    order = [...order.slice(1), order[0]!];
    if (reduced) return place();
    top.classList.add("is-out");
    busy = window.setTimeout(() => {
      top.classList.remove("is-out");
      place();
      busy = 0;
    }, 320);
    infos.forEach((el, i) => (el.hidden = i !== order[0]));
    if (count) count.textContent = String(order[0]! + 1);
  };
  const prev = () => {
    if (busy) return;
    order = [order[order.length - 1]!, ...order.slice(0, -1)];
    place();
  };
  const onClick = (e: Event) => {
    const t = e.target as Element;
    if (t.closest("[data-snext]") || t.closest("[data-sdeck]")) next();
    else if (t.closest("[data-sprev]")) prev();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.target === deck && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      next();
    }
  };
  box.addEventListener("click", onClick);
  box.addEventListener("keydown", onKey);
  return () => {
    box.removeEventListener("click", onClick);
    box.removeEventListener("keydown", onKey);
    window.clearTimeout(busy);
  };
}

/** every hook, in the order of the top menu */
export function hooksMarkup(home: HomeData, d: HookData) {
  return [
    rootedAboutMarkup(home, { n: "01" }),
    products(d),
    waterproofing(d),
    projects(d),
    servicesMarkup(home, { n: "05", below: true }),
    // the close, in the about page's design: its own three steps and the ways to reach us
    `<div class="pg hk-cta">${ctaBand({ regions: [], ...home.contact } as ContactInfo, {
      title: "Seen a damp patch? Let’s fix it.",
      steps: [
        ["Send us a photo", "WhatsApp a picture of the leak, the crack or the damp wall."],
        ["We come and check", "An engineer visits your site. The first visit is free."],
        ["Get one clear plan", "What is wrong, how we fix it and the price, in writing."],
      ],
      reach: true,
    })}</div>`,
  ].join("\n");
}

export const HOOKS_CSS =
  KIT_CSS +
  ROOTED_ABOUT_CSS +
  BRANDS_MARQUEE_CSS +
  `
/* the hooks: one short section per page, in the order of the top menu; the grounds alternate, light sand and stone */
.hm-services,.hm-contact{background:var(--paper)}
.hm-services{padding-bottom:clamp(2rem,5vh,3.5rem)}
.hk-cta{background:var(--paper)}
.hk-cta .pg-cta{padding-top:0}
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
.hk-btn--white{background:#fff;color:var(--navy)}
.hk-btn--white:hover{background:#f5f0e6}
.hk-head{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);align-items:end;gap:1.4rem clamp(2rem,6vw,6rem);margin-bottom:clamp(1.6rem,4vh,2.6rem)}
.hk-side{display:flex;flex-direction:column;align-items:flex-start;gap:1.2rem}
/* a head with only the button beside the headline: the button at the far right */
.hk-head--end .hk-side{align-items:flex-end;justify-self:end}

/* 02 products: a shelf, one tile per kind: the kind on the picture, the product's name, and how many more in its range */
.hk-shelf{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:clamp(.6rem,1.2vw,1rem);margin:0;padding:0;list-style:none}
.hk-tile{display:flex;flex-direction:column;height:100%;padding:.55rem .55rem .9rem;border-radius:20px;background:#fff;box-shadow:0 0 0 1px var(--line),0 18px 36px -30px rgba(18,34,59,.45);color:inherit;text-decoration:none;transition:transform .35s cubic-bezier(.2,.7,.2,1),box-shadow .35s}
.hk-tile:hover{transform:translateY(-4px);box-shadow:0 0 0 1.5px var(--navy),0 28px 44px -28px rgba(18,34,59,.55)}
.hk-tile:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.hk-pic{position:relative;display:grid;place-items:center;aspect-ratio:1/1;overflow:hidden;border-radius:15px;background:radial-gradient(120% 90% at 50% 35%,#fff 0%,#fff 45%,#f1ece3 100%)}
.hk-pic img{position:absolute;left:14%;top:14%;width:72%;height:72%;object-fit:contain;mix-blend-mode:multiply;transition:transform .5s cubic-bezier(.2,.7,.2,1)}
.hk-pic svg{width:72%;height:auto;transition:transform .5s cubic-bezier(.2,.7,.2,1)}
.hk-tile:hover .hk-pic img,.hk-tile:hover .hk-pic svg{transform:scale(1.05)}
.hk-kind{display:flex;align-items:center;gap:.45rem;margin:.9rem .35rem 0;font-size:var(--fs-body);font-weight:500;line-height:1.3;color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hk-kind i{flex:none;width:.5rem;height:.5rem;border-radius:50%;background:var(--water)}
.hk-name{margin:.2rem .35rem 0;font-family:var(--serif);font-size:var(--fs-body);font-weight:700;line-height:1.3;letter-spacing:-.01em;color:var(--ink);display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;min-height:2.6em}
.hk-foot{display:flex;align-items:center;justify-content:space-between;gap:.6rem;margin:auto .35rem 0;padding-top:.7rem;border-top:1px solid var(--line)}
.hk-more{min-width:0;font-size:var(--fs-body);line-height:1.35;color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hk-tgo{flex:none;display:grid;place-items:center;width:2rem;height:2rem;border-radius:50%;box-shadow:inset 0 0 0 1px var(--line);color:var(--ink);transition:background-color .3s,color .3s,box-shadow .3s}
.hk-tile:hover .hk-tgo{background:var(--navy);color:#fff;box-shadow:none}
.hk-after{display:flex;justify-content:center;margin-top:clamp(1.4rem,3vh,2rem)}
.hk-after--end{justify-content:flex-end}
.hk-brands{margin-top:clamp(2.2rem,5vh,3.4rem)}
.hk-bk{margin:0 0 .6rem;font-size:var(--fs-body);font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--water)}
.hm-pbrands{padding-top:clamp(1.5rem,3vh,2.2rem);border-top:1px solid rgba(18,34,59,.1)}
.hm-pbhead{margin-bottom:1.2rem}
.hm-pbh{margin:0;font-family:var(--serif);font-weight:600;font-size:var(--fs-sub);line-height:1.2;letter-spacing:-.02em;color:var(--ink)}

/* 03 waterproofing: four places, each a still from the home page film split down the middle, the leak on the left and the same place dry on the right; pointed at, the dry side slides over */
.hk-bas{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(.7rem,1.2vw,1rem);margin:0;padding:0;list-style:none}
.hk-ba{position:relative;display:flex;flex-direction:column;height:100%;padding:.55rem;border-radius:20px;background:#fff;box-shadow:0 0 0 1px var(--line),0 18px 36px -30px rgba(18,34,59,.45);color:inherit;text-decoration:none;transition:transform .35s cubic-bezier(.2,.7,.2,1),box-shadow .35s}
.hk-bap{--x:50%;position:relative;display:block;aspect-ratio:4/3;overflow:hidden;border-radius:15px;background:#d9d0bf}
.hk-bap img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hk-ba-before{clip-path:inset(0 calc(100% - var(--x)) 0 0);transition:clip-path .7s cubic-bezier(.45,0,.2,1)}
.hk-bad{position:absolute;top:0;bottom:0;left:var(--x);width:2px;margin-left:-1px;background:#fff;box-shadow:0 0 12px rgba(0,0,0,.35);transition:left .7s cubic-bezier(.45,0,.2,1)}
.hk-bal,.hk-bar{position:absolute;z-index:1;bottom:.6rem;padding:.15rem .55rem;border-radius:999px;font-size:var(--fs-body);font-weight:600;line-height:1.3;color:#fff;transition:opacity .4s}
.hk-bal{left:.6rem;background:rgba(162,69,44,.88)}
.hk-bar{right:.6rem;background:rgba(11,110,128,.9)}
.hk-ba:hover .hk-ba-before{clip-path:inset(0 100% 0 0)}
.hk-ba:hover .hk-bad{left:0}
.hk-ba:hover .hk-bal{opacity:0}
.hk-bat{display:flex;flex-direction:column;gap:.25rem;padding:.9rem .45rem .5rem}
.hk-bat em{font-style:normal;font-size:var(--fs-body);font-weight:500;color:var(--mute)}
.hk-bat b{font-family:var(--serif);font-size:var(--fs-body);font-weight:700;line-height:1.35;color:var(--ink)}
.hk-baf{margin-top:.5rem;padding-top:.6rem;border-top:1px solid var(--line);font-size:var(--fs-body);line-height:1.5;color:var(--ink2)}
.hk-baf span{display:block;font-weight:600;color:var(--water)}
.hk-bago{position:absolute;top:1.1rem;right:1.1rem;display:grid;place-items:center;width:2.3rem;height:2.3rem;border-radius:50%;background:#fff;box-shadow:0 4px 12px -6px rgba(18,34,59,.45);color:var(--ink);transition:background-color .3s,color .3s}
.hk-ba:hover{transform:translateY(-4px);box-shadow:0 0 0 1.5px var(--navy),0 28px 44px -28px rgba(18,34,59,.55)}
.hk-ba:hover .hk-bago{background:var(--navy);color:#fff}
.hk-ba:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.hk-ba:focus-visible .hk-ba-before{clip-path:inset(0 100% 0 0)}

/* 04 projects: three prints in a pile, a little turned; the top one's words beside it */
.hk-proj{display:flex;flex-direction:column;justify-content:center;min-height:calc(100svh - var(--nav-room));padding:calc(var(--nav-room) + clamp(.5rem,2vh,1.2rem)) 0 clamp(1rem,3vh,2rem)}
.hk-pgrid{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.3fr);align-items:center;gap:2rem clamp(2rem,6vw,6rem)}
.hk-pinfo .hm-h2{margin-top:.8rem}
.hk-pinfo{display:flex;flex-direction:column;align-items:flex-start;gap:clamp(.9rem,2.4vh,1.4rem);min-width:0}
.hk-pi{display:flex;flex-direction:column;align-items:flex-start;gap:.5rem;animation:hk-in .45s ease both}
.hk-pi[hidden]{display:none}
@keyframes hk-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.hk-ptype{padding:.15rem .65rem;border-radius:999px;background:rgba(11,35,80,.08);font-size:var(--fs-body);font-weight:600;color:var(--accent)}
.hk-pname{margin:.2rem 0 0;font-family:var(--serif);font-size:var(--fs-sub);font-weight:600;line-height:1.2;letter-spacing:-.01em;color:var(--ink)}
.hk-ploc{display:flex;align-items:center;gap:.4rem;margin:0;font-size:var(--fs-body);color:var(--mute)}
.hk-ploc svg{width:1rem;height:1rem;color:var(--water)}
.hk-psum{margin:.2rem 0 0;max-width:30rem;font-size:var(--fs-body);line-height:1.6;color:var(--ink2)}
.hk-plink{display:inline-flex;align-items:center;gap:.45rem;margin-top:.4rem;padding-bottom:3px;border-bottom:1px solid currentColor;font-size:var(--fs-body);font-weight:600;color:var(--ink);text-decoration:none}
.hk-plink:hover .hm-ar{transform:translate(2px,-2px)}
.hk-pctl{display:flex;align-items:center;gap:.8rem}
.hk-pcount{min-width:3.5rem;text-align:center;font-size:var(--fs-body);font-variant-numeric:tabular-nums;color:var(--mute)}
.hk-pcount b{color:var(--ink)}
.hk-arr{display:grid;place-items:center;width:3rem;height:3rem;border:0;border-radius:50%;background:#f5f0e6;box-shadow:inset 0 0 0 1px var(--line);color:var(--ink);cursor:pointer;transition:background-color .25s,color .25s}
.hk-arr:hover{background:var(--navy);color:#fff}
.hk-arr:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.hk-arr svg{width:1.1rem;height:1.1rem}
.hk-stack{position:relative;aspect-ratio:5/4;height:min(36rem,calc(100svh - var(--nav-room) - 4rem));max-width:100%;margin:0 auto;cursor:pointer;outline:none}
.hk-stack:focus-visible{outline:2px solid var(--accent);outline-offset:6px;border-radius:12px}
.hk-pol{position:absolute;left:50%;top:50%;width:78%;margin:0;padding:.8rem .8rem 0;border-radius:6px;background:#fff;box-shadow:0 1px 0 rgba(18,34,59,.06),0 24px 50px -24px rgba(18,34,59,.55);transition:transform .55s cubic-bezier(.2,.7,.2,1),opacity .35s,box-shadow .35s}
.hk-polph{display:block;aspect-ratio:4/3;overflow:hidden;border-radius:2px;background:#d9d0bf}
.hk-polph img{width:100%;height:100%;object-fit:cover;pointer-events:none}
.hk-pol figcaption{display:flex;flex-direction:column;gap:.1rem;padding:.8rem .2rem 1rem}
.hk-pol figcaption b{font-family:var(--serif);font-size:var(--fs-body);font-weight:700;color:var(--ink)}
.hk-pol figcaption span{font-size:var(--fs-body);color:var(--mute)}
.hk-pol[data-pos="0"]{z-index:3;transform:translate(-50%,-50%) rotate(-2.5deg)}
.hk-pol[data-pos="1"]{z-index:2;transform:translate(-43%,-52%) rotate(5deg)}
.hk-pol[data-pos="2"]{z-index:1;transform:translate(-57%,-48%) rotate(-8deg)}
.hk-pol[data-pos="1"],.hk-pol[data-pos="2"]{box-shadow:0 1px 0 rgba(18,34,59,.06),0 14px 30px -20px rgba(18,34,59,.45)}
.hk-pol.is-out{z-index:4;transform:translate(10%,-62%) rotate(14deg);opacity:0}
.hk-stack:hover .hk-pol[data-pos="0"]{transform:translate(-50%,-51.5%) rotate(-1deg)}

@media (max-width:1199px){
  .hk-shelf{grid-template-columns:repeat(3,minmax(0,1fr))}
  .hk-bas{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media (max-width:1023px){
}
@media (max-width:899px){
  .hk-pgrid{grid-template-columns:minmax(0,1fr)}
  .hk-pinfo{padding-left:0}
  .hk-proj{min-height:0;padding:clamp(3.5rem,9vh,5rem) 0}
  .hk-stack{order:-1;aspect-ratio:1/1;height:auto;width:100%}
  .hk-head,.hk-bgrid{grid-template-columns:minmax(0,1fr)}
  .hk-head--end .hk-side{align-items:flex-start;justify-self:start}
}
@media (max-width:599px){
  .hk-shelf{grid-template-columns:repeat(2,minmax(0,1fr))}
  .hk-bas{grid-template-columns:minmax(0,1fr)}
  .hk-kind{white-space:normal;align-items:flex-start}
  .hk-kind i{margin-top:.45rem}
  .hk-pol{width:84%}
  .hk-btn{width:100%}
  .hk-side{align-items:stretch}
}
/* phones: every hook is one short screen: a heading, a few cards and the button */
@media (max-width:767px){
  .hk{padding:2.4rem 0 2.2rem}
  .hk .hm-h2{font-size:1.55rem;line-height:1.15;margin-top:.6rem}
  /* products: four tiles, two to a row */
  .hk-shelf{grid-template-columns:repeat(2,minmax(0,1fr));gap:.6rem}
  .hk-shelf li:nth-child(n+5){display:none}
  .hk-tile{padding:.45rem .45rem .7rem;border-radius:16px}
  .hk-pic{aspect-ratio:16/10}
  .hk-foot{display:none}
  .hk-kind{font-size:.82rem}
  .hk-name{font-size:.95rem}
  .hk-prod .hk-after{margin-top:.9rem}
  /* brands: one quiet strip of small logo cards under a line of words */
  .hk-brands{margin-top:1.4rem;padding-top:1.1rem;border-top:1px solid var(--line)}
  .hk-bk{display:none}
  .hm-pbhead{margin-bottom:.8rem}
  .hk-brands .hm-pbh{font-size:1.05rem;line-height:1.25}
  .hk-brands .wp-mtrack{gap:.6rem}
  .hk-brands .wp-btile{width:7.6rem;height:3.9rem;padding:.55rem .9rem;border-radius:12px}
  .hk-brands .wp-btile img{max-height:2.5rem}
  .hk-brands .wp-bname{font-size:.9rem}
  /* waterproofing: four before and after pictures, two to a row */
  .hk-bas{grid-template-columns:repeat(2,minmax(0,1fr));gap:.6rem}
  .hk-ba{padding:.4rem .4rem .7rem;border-radius:16px}
  .hk-bap{aspect-ratio:1/1}
  .hk-bat b,.hk-baf{display:none}
  .hk-bat em{font-size:.95rem;font-style:normal;font-weight:600;color:var(--ink)}
  .hk-bago{display:none}
  .hk-wp .hk-after{margin-top:.9rem}
  /* projects: the heading, the pile of prints (each names itself) and one row with the arrows and the button */
  .hk-proj{min-height:0;padding:2.4rem 0 2.2rem}
  .hk-pgrid{grid-template-columns:auto minmax(0,1fr);gap:0 .8rem}
  .hk-pinfo{display:contents}
  .hk-pinfo > :nth-child(1){grid-column:1 / -1;grid-row:1}
  .hk-pinfo > :nth-child(2){display:none}
  .hk-stack{order:0;grid-column:1 / -1;grid-row:2;aspect-ratio:1.18/1;width:100%;margin:1.3rem 0 .8rem}
  .hk-pol{width:80%;padding:.55rem .55rem 0}
  .hk-pol figcaption{padding:.55rem .15rem .7rem}
  .hk-pol figcaption b,.hk-pol figcaption span{font-size:.95rem}
  .hk-pinfo > .hk-pctl{grid-column:1;grid-row:3;gap:.3rem}
  .hk-pinfo > :nth-child(4){grid-column:2;grid-row:3}
  .hk-pinfo > :nth-child(4) .hm-btn{width:100%;justify-content:center}
  .hk-arr{width:2.6rem;height:2.6rem}
  .hk-pcount{min-width:2.8rem}
  /* services: the core card, then six small tiles, in one screen */
  .hm-services{padding:2.4rem 0 2rem}
  .hm-services .hm-h2{font-size:1.55rem;line-height:1.15}
  .hm-services .hm-schk,.hm-services .hm-tl{display:none}
  .hm-services .hm-sfeat{padding:1.1rem}
  .hm-services .hm-sbody{margin:.4rem 0 .9rem}
  .hm-services .hm-sgrid{gap:.6rem}
  .hm-services .hm-tile{min-height:0;padding:.7rem .8rem .8rem;gap:.35rem}
  .hm-services .hm-tt{font-size:.95rem;line-height:1.25}
  .hm-services .hm-sbtns{margin-top:0}
  .hm-services .hm-sbtns .hm-btn{width:100%;justify-content:center}
}
@media (prefers-reduced-motion:reduce){.hk-pol,.hk-pi{transition:none;animation:none}.hk-ba,.hk-ba-before,.hk-bad,.hk-card img,.hk-pic img,.hk-pic svg{transition:none}.hk-card a:hover img{transform:none}.hk-tile:hover .hk-pic img,.hk-tile:hover .hk-pic svg{transform:none}.hk-tile:hover{transform:none}}
`;
