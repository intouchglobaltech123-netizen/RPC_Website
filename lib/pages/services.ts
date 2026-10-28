/**
 * Services page, kept to what we do and what search engines read.
 *
 *   opening        the page's heading: the services and the towns
 *   waterproofing  the eight waterproofing services from RPC's methods guide:
 *                  what each protects against, and a quote
 *   building       the six building services, each with its line and a quote
 *   questions      what people ask before they book (also set out for search
 *                  engines on the page)
 *   close          the ways to start
 *
 * Each service has its own id (its name, made into a link), so the footer, the
 * home page and the search results can link straight to it.
 */
import { AREA_PURPOSE, SERVICE_CATEGORIES } from "../methods/doc";
import { esc, mark, secHead, serviceSlug, type ContactInfo, type PageOptions } from "./kit";

export interface ServiceData {
  id: string;
  title: string;
  short?: string;
  body: string;
  image: string;
  deliverables: readonly string[];
  timeline: string;
  scale: string;
}
export interface EngagementData {
  model: string;
  description: string;
  benefit: string;
}
export interface StepData {
  id: string;
  title: string;
  body: string;
}
export interface ServicesData {
  services: readonly ServiceData[];
  engagement: readonly EngagementData[];
  process: readonly StepData[];
  contact: ContactInfo;
}

export const SERVICES_TRAIL = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
] as const;

/** a small line drawing for each place a waterproofing service covers */
const PLACE_ICON: Record<string, string> = {
  terrace: `<path d="M3 11h18M5 11v8h14v-8"/><path d="M7 7l2-3M12 7V3.5M17 7l-2-3"/><path d="M9 15h6"/>`,
  bathroom: `<path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M6 12V6a2 2 0 0 1 4 0"/><path d="M8 19l-1 2M16 19l1 2"/>`,
  tank: `<rect x="5" y="6" width="14" height="14" rx="2"/><path d="M5 12c2.3-1.3 4.7 1.3 7 0s4.7-1.3 7 0"/><path d="M9 6V3.5h6V6"/>`,
  basement: `<path d="M3 9h18"/><path d="M5 9v11h14V9"/><path d="M9 20v-5h6v5"/><path d="M3 5.5c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0"/>`,
  balcony: `<path d="M4 13h16M4 13v7M20 13v7M8 13v7M12 13v7M16 13v7M3 20h18"/><path d="M7 13V5h10v8"/>`,
  walls: `<path d="M3 5h18v15H3z"/><path d="M3 10h18M3 15h18M9 5v5M15 10v5M9 15v5"/>`,
  podium: `<path d="M3 16h18v4H3z"/><path d="M8 16c0-3 1.8-5 4-5s4 2 4 5"/><path d="M12 11V5M12 7c1.5-2 3.5-2 4.5-1M12 8c-1.5-2-3.5-2-4.5-1"/>`,
  cracks: `<path d="M4 4h16v16H4z"/><path d="M12 4l-2 4 3 3-2 4 2 2-1 3"/>`,
};
const placeIcon = (area: string) =>
  `<span class="sv-wi" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${PLACE_ICON[area] ?? ""}</svg></span>`;

/** a small line drawing for each building service, by a word in its name */
const BUILD_ICON: readonly (readonly [RegExp, string])[] = [
  [/residential/i, `<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>`],
  [/commercial/i, `<path d="M5 21V4h10v17"/><path d="M15 9h4v12"/><path d="M8 8h1M11 8h1M8 12h1M11 12h1M8 16h1M11 16h1"/><path d="M3 21h18"/>`],
  [/industrial/i, `<path d="M3 21V11l6 3V11l6 3V6h4v15z"/><path d="M3 21h18"/><path d="M7 18h2M12 18h2"/>`],
  [/renovation|repair/i, `<path d="M14.5 5.5a4 4 0 0 0-5 5L4 16l4 4 5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-2-2z"/>`],
  [/interior/i, `<path d="M4 18v-5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5"/><path d="M6 11V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3"/><path d="M3 18h18M6 18v2M18 18v2"/>`],
  [/project|management/i, `<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="M8.5 10l1.5 1.5 3-3M8.5 16h7"/>`],
];
const buildIcon = (title: string) =>
  `<span class="sv-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${BUILD_ICON.find(([r]) => r.test(title))?.[1] ?? BUILD_ICON[0]![1]}</svg></span>`;

/** a small line drawing for each way to work with us, in their order */
/** the questions people ask, answered from what the rest of the site already says (also set out for search engines on the page) */
export function serviceFaq(d: Pick<ServicesData, "services" | "process" | "contact">): { q: string; a: string }[] {
  const c = d.contact;
  const [hq, ...towns] = c.regions;
  const street = c.address.split(",").slice(0, 2).join(",").trim();
  const test = d.process.find((p) => /test/i.test(p.title));
  const repair = d.services.find((s) => /repair/i.test(s.title));
  const list = (xs: readonly string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);
  return [
    { q: "Which areas do you work in?", a: `We work from our office on ${street}, across ${list([hq ?? "Erode", ...towns])}.` },
    { q: "Is the site inspection free?", a: "Yes. An engineer visits, traces where the water is getting in, and only then recommends one method and a price, in writing." },
    { q: "Which waterproofing method will my building need?", a: "It depends on where the water comes from, the surface and how much it moves. Our guide covers twelve methods, from cementitious coats to crystalline and injection grouting; the final choice is made on site." },
    ...(test ? [{ q: "How do you check that the waterproofing works?", a: test.body }] : []),
    ...(repair ? [{ q: "Can you repair a leak in a building that is already in use?", a: `Yes. ${repair.body}` }] : []),
    { q: "Do you also build new buildings?", a: "Yes: homes, offices and factories, with every terrace, bathroom and sump waterproofed as the building goes up." },
    { q: "How soon will you reply to an enquiry?", a: "An engineer replies within one working day, by phone or on WhatsApp." },
  ];
}

/** RPC's before and after photographs, for every waterproofing service */
const BA: Readonly<Record<string, readonly [string, string]>> = {
  terrace: ["/images/rain/terrace-before.webp", "/images/rain/terrace-after.webp"],
  bathroom: ["/images/rain/bath-before.webp?v=2", "/images/rain/bath-after.webp?v=2"],
  tank: ["/images/rain/tank-before.webp", "/images/rain/tank-after.webp"],
  basement: ["/images/rain/basement-before.webp", "/images/rain/basement-after.webp"],
  balcony: ["/images/rain/balcony-before.webp", "/images/rain/balcony-after.webp"],
  walls: ["/images/rain/wall-before.webp", "/images/rain/wall-after.webp"],
  podium: ["/images/rain/podium-before.webp", "/images/rain/podium-after.webp"],
  cracks: ["/images/rain/leak-before.webp", "/images/rain/leak-after.webp"],
};
const HANDLE = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7l-5 5 5 5M15 7l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/** a waterproofing service as a before and after card: the two photographs with a handle to slide between them, its name and what it protects against, and a quote */
function wpRow(s: (typeof SERVICE_CATEGORIES)[number]) {
  const ba = BA[s.area];
  const name = s.title.toLowerCase();
  const pics = ba
    ? `<div class="sv-ba" style="--x:50%">
    <img class="sv-ba-after" src="${esc(ba[1])}" width="960" height="540" alt="${esc(`After: ${name} done`)}" loading="lazy" decoding="async">
    <img class="sv-ba-before" src="${esc(ba[0])}" width="960" height="540" alt="${esc(`Before: the ${s.area === "cracks" ? "leak" : "damage"} we were called for`)}" loading="lazy" decoding="async">
    <span class="sv-ba-k sv-ba-k--b" aria-hidden="true">Before</span><span class="sv-ba-k sv-ba-k--a" aria-hidden="true">After</span>
    <span class="sv-ba-line" aria-hidden="true"><i>${HANDLE}</i></span>
    <input class="sv-ba-r" type="range" min="0" max="100" value="50" aria-label="${esc(`Slide between before and after: ${name}`)}">
  </div>`
    : `<div class="sv-ba sv-ba--none" aria-hidden="true">
    <span class="sv-ba-half"><em>Before</em></span><span class="sv-ba-half"><em>After</em></span>
    <span class="sv-ba-mark">${placeIcon(s.area)}</span>
  </div>`;
  return `<li class="sv-card sv-w" id="${serviceSlug(s.title)}">
  ${pics}
  <div class="sv-wbody">
    <h3 class="sv-ct"><span class="sv-icon">${placeIcon(s.area)}</span>${esc(s.title)}</h3>
    <p class="sv-cp">${esc(AREA_PURPOSE[s.area] ?? "")}</p>
  </div>
</li>`;
}

/** a building service as a card: its icon, name and line, its scale and programme, what's included, and a quote */
function buildRow(s: ServiceData) {
  const slug = serviceSlug(s.title);
  return `<article class="sv-card sv-b" id="${slug}" aria-labelledby="sv-${slug}">
  ${buildIcon(s.title)}
  <h3 class="sv-ct" id="sv-${slug}">${esc(s.title)}</h3>
  <p class="sv-cp">${esc(s.body)}</p>
</article>`;
}

export function servicesPageMarkup(d: ServicesData, o: PageOptions = {}) {
  void o;
  const c = d.contact;
  const [wp, ...build] = d.services;
  const [hq] = c.regions;
  const faqs = serviceFaq(d);
  const head = `<header class="pg-head sv-head">
  <div class="pg-wrap sv-headgrid">
    <div>
      ${mark("01", "Services")}
      <h1 class="pg-h1">Waterproofing and construction services in ${esc(hq ?? "Erode")}, Coimbatore and&nbsp;Tiruppur.</h1>
    </div>
  </div>
</header>`;

  const waterproofing = wp
    ? `<section class="pg-sec sv-wsec" id="${serviceSlug(wp.title)}" aria-label="Waterproofing services">
  <div class="pg-wrap">
    <ul class="sv-wgrid">${SERVICE_CATEGORIES.map(wpRow).join("")}</ul>
  </div>
</section>`
    : "";

  const building = `<section class="pg-sec pg-sec--stone sv-bsec" id="building" aria-labelledby="sv-b-h">
  <div class="pg-wrap">
    ${secHead({ n: "03", label: "Construction services", title: "Homes, offices and factories, built to stay dry.", id: "sv-b-h", lede: "New buildings and renovations, with every terrace, bathroom and sump waterproofed as the work goes up." })}
    <div class="sv-blist">${build.map(buildRow).join("")}</div>
  </div>
</section>`;

  const faq = `<section class="pg-sec sv-fsec" id="questions" aria-labelledby="sv-f-h">
  <div class="pg-wrap sv-fgrid">
    ${secHead({ n: "04", label: "Questions", title: "Waterproofing questions, answered.", id: "sv-f-h", lede: "What people in Erode and Coimbatore ask us before they book." })}
    <div class="sv-faq">${faqs
      .map((f, i) => `<details class="sv-q"${i === 0 ? " open" : ""}><summary><h3>${esc(f.q)}</h3><span class="sv-qi" aria-hidden="true"></span></summary><p>${esc(f.a)}</p></details>`)
      .join("")}</div>
  </div>
</section>`;

  return `${head}\n${waterproofing}\n${building}\n${faq}`;
}

export const SERVICES_CSS = `
/* the opening: the title */
.sv-headgrid{display:grid;grid-template-columns:minmax(0,1fr);gap:1.8rem clamp(2rem,5vw,6rem);align-items:end}
.sv-hside{display:flex;flex-direction:column;gap:1.3rem}
.sv-hlede{margin:0;max-width:34rem;font-size:var(--fs-body);line-height:1.7;color:var(--ink2);text-wrap:pretty}
.sv-jump{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.6rem}
.sv-jl{position:relative;display:flex;flex-direction:column;gap:.2rem;padding:.9rem 1rem 1rem;border-radius:14px;background:#fff;box-shadow:0 0 0 1px var(--line);color:var(--ink);text-decoration:none;transition:transform .25s,box-shadow .25s,background-color .25s,color .25s}
.sv-jl b{font-family:var(--display);font-size:var(--fs-sub);font-weight:600;line-height:1.1;color:var(--navy)}
.sv-jl span{font-size:calc(var(--fs-body) * .88);line-height:1.35;color:var(--mute)}
.sv-jl i{position:absolute;top:.85rem;right:.85rem;display:grid;place-items:center;width:1.6rem;height:1.6rem;border-radius:50%;background:var(--sand);color:var(--navy);transition:background-color .25s,color .25s,transform .25s}
.sv-jl i svg{width:.85rem;height:.85rem}
.sv-jl:hover{transform:translateY(-2px);background:var(--navy);box-shadow:0 18px 30px -20px rgba(11,35,80,.8)}
.sv-jl:hover b,.sv-jl:hover span{color:#fff}
.sv-jl:hover i{background:rgba(255,255,255,.14);color:#fff;transform:translateY(2px)}
.sv-jl:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.sv-headgrid .pg-mark{margin-bottom:.9rem}
.sv-headgrid .pg-h1{max-width:32ch}
.sv-head{padding-bottom:clamp(1.4rem,3.5vh,2.2rem);border-bottom:0}
.sv-wsec,.sv-bsec{scroll-margin-top:var(--nav-bar,80px)}

/* the cards (waterproofing and building alike): an icon, the name, a line, the details, and a quote along the foot */
.sv-wgrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(.8rem,1.3vw,1.1rem);margin:0;padding:0;list-style:none}
.sv-blist{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(.8rem,1.3vw,1.1rem)}
.sv-card{display:flex;flex-direction:column;padding:1.4rem 1.4rem 0;border-radius:18px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);scroll-margin-top:calc(var(--nav-bar,80px) + 1rem);transition:box-shadow .3s,transform .3s}
.sv-card:hover{transform:translateY(-2px);box-shadow:inset 0 0 0 1px rgba(18,34,59,.28),0 24px 44px -34px rgba(18,34,59,.55)}
.sv-card:target{box-shadow:inset 0 0 0 2px var(--accent),0 0 0 6px rgba(39,86,160,.1)}
.sv-icon{display:grid;place-items:center;width:2.9rem;height:2.9rem;border-radius:14px;background:var(--navy);color:#f5f0e6}
.sv-icon .sv-wi{display:contents}
.sv-icon svg{width:1.4rem;height:1.4rem}
.sv-ct{margin:1rem 0 0;font-family:var(--display);font-size:var(--fs-sub);font-weight:600;line-height:1.2;letter-spacing:-.015em;color:var(--ink)}
.sv-cp{margin:.5rem 0 1.3rem;font-size:var(--fs-body);line-height:1.6;color:var(--ink2)}
.sv-b .sv-cp{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:4;overflow:hidden}
.sv-wsec{padding-top:clamp(1rem,2.5vh,1.6rem)}
.sv-cm{margin:.8rem 0 1.2rem;font-size:var(--fs-body);line-height:1.55;color:var(--ink2)}
.sv-cm span{font-weight:600;color:var(--ink)}
.sv-cm a{color:var(--accent);text-decoration:none;border-bottom:1px solid rgba(39,86,160,.3)}
.sv-cm a:hover{border-color:var(--accent)}
.sv-cm em{font-style:normal;color:var(--mute)}
.sv-go{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin:auto -1.4rem 0;padding:.9rem 1.4rem;border-top:1px solid var(--line);font-size:var(--fs-body);font-weight:600;color:var(--accent);text-decoration:none;transition:background-color .2s,color .2s}
.sv-go .pg-ar{width:1rem;height:1rem;transition:transform .2s}
.sv-go:hover{background:var(--navy);color:#f5f0e6}
.sv-go:hover .pg-ar{transform:translate(2px,-2px)}
.sv-go:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}

/* the waterproofing services as before and after cards: the handle (or the slider under it) moves between the two photographs */
.sv-w{padding:.55rem .55rem 0;background:#fff;box-shadow:0 0 0 1px var(--line),0 18px 36px -30px rgba(18,34,59,.45)}
.sv-w .sv-go{margin:auto -.55rem 0;padding:.9rem 1.4rem}
.sv-ba{--x:50%;position:relative;aspect-ratio:4/3;overflow:hidden;border-radius:14px;background:#d9d0bf;isolation:isolate;touch-action:pan-y}
.sv-ba img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none}
.sv-ba-before{clip-path:inset(0 calc(100% - var(--x)) 0 0)}
.sv-ba-k{position:absolute;top:.6rem;z-index:2;padding:.28rem .65rem;border-radius:999px;font-size:calc(var(--fs-body) * .82);font-weight:600;line-height:1.2;pointer-events:none;transition:opacity .2s}
.sv-ba-k--b{left:.6rem;background:rgba(18,34,59,.78);color:#fff}
.sv-ba-k--a{right:.6rem;background:rgba(255,255,255,.92);color:var(--ink)}
.sv-ba-line{position:absolute;top:0;bottom:0;left:var(--x);z-index:2;width:2px;margin-left:-1px;background:#fff;box-shadow:0 0 14px rgba(0,0,0,.35);pointer-events:none}
.sv-ba-line i{position:absolute;top:50%;left:50%;display:grid;place-items:center;width:2.6rem;height:2.6rem;border-radius:50%;background:#fff;color:var(--navy);box-shadow:0 8px 20px -8px rgba(0,0,0,.55);transform:translate(-50%,-50%);transition:transform .2s}
.sv-ba-line svg{width:1.2rem;height:1.2rem}
.sv-ba-r{position:absolute;inset:0;z-index:3;width:100%;height:100%;margin:0;opacity:0;cursor:ew-resize;-webkit-appearance:none;appearance:none;background:none}
.sv-ba-r::-webkit-slider-thumb{-webkit-appearance:none;width:3rem;height:100%}
.sv-ba-r::-moz-range-thumb{width:3rem;height:100%;border:0}
.sv-ba:hover .sv-ba-line i,.sv-ba-r:focus-visible ~ .sv-ba-line i{transform:translate(-50%,-50%) scale(1.08)}
.sv-ba:has(.sv-ba-r:focus-visible){outline:2px solid var(--accent);outline-offset:2px}
/* a place without its photographs yet: the two halves of the frame, with its mark */
.sv-ba--none{display:grid;grid-template-columns:1fr 1fr;background:none}
.sv-ba-half{display:flex;align-items:flex-start;padding:.6rem;background:#e2d9c9}
.sv-ba-half + .sv-ba-half{justify-content:flex-end;background:#efe8da;border-left:2px solid #fff}
.sv-ba-half em{padding:.28rem .65rem;border-radius:999px;background:rgba(255,255,255,.7);font-style:normal;font-size:calc(var(--fs-body) * .82);font-weight:600;color:var(--mute)}
.sv-ba-mark{position:absolute;top:50%;left:50%;display:grid;place-items:center;width:3.4rem;height:3.4rem;border-radius:50%;background:#fff;color:var(--navy);box-shadow:0 8px 20px -10px rgba(18,34,59,.5);transform:translate(-50%,-50%)}
.sv-ba-mark .sv-wi{display:contents}
.sv-ba-mark svg{width:1.5rem;height:1.5rem}
.sv-wbody{padding:1.1rem .85rem 0}
.sv-w .sv-ct{display:flex;align-items:center;gap:.6rem;margin:0}
.sv-w .sv-ct .sv-icon{flex:none;width:2.2rem;height:2.2rem;border-radius:10px}
.sv-w .sv-ct .sv-icon svg{width:1.1rem;height:1.1rem}
.sv-w .sv-cp{margin:.6rem 0 1.2rem}
/* no quote link at the foot of the cards: the text keeps its own space below */
.sv-card{padding-bottom:1.4rem}
.sv-w{padding-bottom:.4rem}
.sv-card .sv-cp{margin-bottom:0}
.sv-btop{display:flex;align-items:center;gap:.8rem}
.sv-bshort{margin:.2rem 0 0;font-size:var(--fs-body);font-weight:600;line-height:1.35;color:var(--accent)}
.sv-bmeta{display:flex;flex-wrap:wrap;gap:.4rem;margin:-.4rem 0 1.2rem}
.sv-bmeta span{padding:.25rem .65rem;border-radius:999px;background:rgba(18,34,59,.06);font-size:var(--fs-body);font-weight:500;color:var(--ink)}
.sv-bmeta dt{font-size:var(--fs-body);color:var(--mute)}
.sv-bmeta dd{margin:.15rem 0 0;font-size:var(--fs-body);font-weight:600;line-height:1.35;color:var(--ink)}
.sv-binc{display:flex;flex-direction:column;gap:.35rem;margin:1rem 0 1.3rem;padding:0;list-style:none}
.sv-binc li{position:relative;padding-left:1.5rem;font-size:var(--fs-body);line-height:1.45;color:var(--ink)}
.sv-binc li::before{content:"";position:absolute;left:0;top:.2rem;width:1rem;height:1rem;border-radius:50%;background:rgba(39,86,160,.14) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4.5 8.3l2.3 2.3 4.7-5' fill='none' stroke='%232756a0' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/.75rem no-repeat}
.sv-wmore{margin:clamp(1.4rem,3vh,2rem) 0 0}

/* how a job runs: six steps on one line, joined */

/* three ways to work with us */

/* questions: the heading beside, each question opening to its answer */
.sv-fgrid{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:1.6rem clamp(2rem,5vw,5rem);align-items:start}
.sv-fgrid .pg-shead{margin-bottom:0}
.sv-faq{display:flex;flex-direction:column;gap:.5rem}
.sv-q{border-radius:14px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);interpolate-size:allow-keywords}
.sv-q::details-content{height:0;overflow:clip;transition:height .3s ease,content-visibility .3s allow-discrete}
.sv-q[open]::details-content{height:auto}
.sv-q summary{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem 1.2rem;list-style:none;cursor:pointer}
.sv-q summary::-webkit-details-marker{display:none}
.sv-q summary:focus-visible{outline:2px solid var(--accent);outline-offset:-2px;border-radius:14px}
.sv-q h3{margin:0;font-size:var(--fs-body);font-weight:600;line-height:1.4;color:var(--ink)}
.sv-qi{position:relative;flex:none;width:1.8rem;height:1.8rem;border-radius:50%;background:rgba(18,34,59,.07);transition:transform .3s,background-color .2s}
.sv-qi::before,.sv-qi::after{content:"";position:absolute;left:50%;top:50%;width:.7rem;height:1.6px;margin:-.8px 0 0 -.35rem;background:var(--ink)}
.sv-qi::after{transform:rotate(90deg)}
.sv-q[open] .sv-qi{transform:rotate(45deg);background:var(--navy)}
.sv-q[open] .sv-qi::before,.sv-q[open] .sv-qi::after{background:#fff}
.sv-q p{margin:0;padding:0 1.2rem 1.1rem;font-size:var(--fs-body);line-height:1.65;color:var(--ink2)}

@media (max-width:1199px){
  .sv-wgrid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .sv-blist{grid-template-columns:repeat(2,minmax(0,1fr))}
  /* the six steps keep to one line, which slides sideways */
}
@media (max-width:1023px){
  .sv-headgrid,.sv-fgrid{grid-template-columns:1fr}
}
@media (max-width:699px){
  .sv-wgrid,.sv-blist{grid-template-columns:minmax(0,1fr)}
  .sv-wcov{grid-template-columns:1fr}
  .sv-jump{gap:.45rem}
  .sv-jl{padding:.75rem .75rem .85rem}
  .sv-jl i{display:none}
}

/* phones: every service is a small card, two to a row, with only what is needed:
   a waterproofing service shows its photograph and name; a building service its mark and name */
@media (max-width:767px){
  .sv-head{padding-bottom:1rem}
  .sv-wsec{padding-top:1.2rem;padding-bottom:2rem}
  .sv-wgrid,.sv-blist{grid-template-columns:repeat(2,minmax(0,1fr));gap:.7rem}
  .sv-card{border-radius:16px}
  .sv-card:hover{transform:none}

  .sv-w{padding:.4rem .4rem .8rem;border-radius:16px}
  .sv-ba{aspect-ratio:1/1;border-radius:12px}
  .sv-ba-k{display:none}
  .sv-ba-line i{width:1.7rem;height:1.7rem}
  .sv-ba-line svg{width:.8rem;height:.8rem}
  .sv-ba-mark{width:2.6rem;height:2.6rem}
  .sv-wbody{padding:.7rem .35rem 0}
  .sv-w .sv-ct{display:block;font-size:.92rem;line-height:1.25;letter-spacing:-.01em;min-height:2.5em}
  .sv-w .sv-ct .sv-icon,.sv-w .sv-cp{display:none}

  .sv-bsec{padding-top:2.4rem;padding-bottom:2.6rem}
  .sv-bsec .pg-shead{gap:.5rem;margin-bottom:1.1rem;padding-top:1rem}
  .sv-bsec .pg-h2,.sv-fsec .pg-h2{font-size:1.45rem;line-height:1.18}
  .sv-bsec .pg-lede,.sv-fsec .pg-lede{display:none}
  .sv-b{padding:.95rem .85rem 1rem}
  .sv-b .sv-icon{width:2.4rem;height:2.4rem;border-radius:12px}
  .sv-b .sv-icon svg{width:1.2rem;height:1.2rem}
  .sv-b .sv-ct{margin-top:.8rem;font-size:.92rem;line-height:1.25;letter-spacing:-.01em;min-height:2.5em}
  .sv-b .sv-cp{display:none}

  .sv-fsec{padding-top:2.4rem;padding-bottom:2.6rem}
  .sv-fgrid{gap:1.1rem}
  .sv-q summary{padding:.85rem 1rem}
  .sv-q h3{font-size:.92rem}
  .sv-q p{padding:0 1rem .95rem;font-size:.9rem}
}
`;
