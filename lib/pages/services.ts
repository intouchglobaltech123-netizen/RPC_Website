/**
 * Services page, kept to what we do and what search engines read.
 *
 *   opening        the shared inner-page banner: the services and the towns,
 *                  a quote and two jumps down the page, a photograph of a
 *                  finished house with a deep-blue chip counting the services
 *   waterproofing  the eight waterproofing services from RPC's methods guide,
 *                  on white, four to a row
 *   building       the six building services, on a deep-blue band with a soft
 *                  wave along its top (water), three to a row
 *                  both as the same white card: a photograph with its corner
 *                  cut, a navy icon tile on its lower edge, the name, one line
 *                  on what it covers, and "Get a quote" under a hairline
 *   questions      what people ask before they book (also set out for search
 *                  engines on the page): the heading and a small deep-blue
 *                  panel with the phone number held at the left, the questions
 *                  as a hairline list at the right
 *   close          the ways to start
 *
 * Orange appears only on actions: the buttons, the arrow circle and underline
 * of a hovered card, the open question's control. Labels, lines, icon tiles
 * and numbers stay blue or grey.
 *
 * Each service has its own id (its name, made into a link), so the footer, the
 * home page and the search results can link straight to it.
 */
import { AREA_PURPOSE, SERVICE_CATEGORIES } from "../methods/doc";
import { arrow, arrowDown, banner, ctaBand, esc, ph, ruler, secHead, serviceSlug, shot, tel, type ContactInfo, type PageOptions } from "./kit";

export interface ServiceData {
  id: string;
  title: string;
  short?: string;
  /** one line on what it covers, for its card */
  line?: string;
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

const ask = (title: string) => `/contact?service=${encodeURIComponent(title)}#enquiry`;

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
/** a photograph for each place a waterproofing service covers */
const PLACE_PHOTO: Record<string, string> = {
  terrace: "/images/waterproofing/terrace-slab-cutaway.jpg",
  bathroom: "/images/waterproofing/bathroom-membrane-under-tiles.jpg",
  tank: "/images/waterproofing/water-tank-cutaway.jpg",
  basement: "/images/waterproofing/basement-wall-cutaway.jpg",
  balcony: "/images/waterproofing/villa-upper-floors.jpg",
  walls: "/images/detail-01.jpg",
  podium: "/images/waterproofing/villa-pool-deck.jpg",
  cracks: "/images/waterproofing/house-wet-zones.jpg",
};
/** the pixel sizes of the photographs the cards use (anything not listed is 1920 x 1080) */
const PHOTO_SIZE: Record<string, readonly [number, number]> = {
  "/images/detail-01.jpg": [1600, 1000],
  "/images/waterproofing/house-wet-zones.jpg": [1600, 900],
  "/images/waterproofing/house-lit-interiors.jpg": [1600, 900],
  "/images/projects/avinashi-corporate-centre-coimbatore.jpg": [1376, 768],
  "/images/projects/sipcot-textile-unit-perundurai.jpg": [1376, 768],
  "/images/interior-joinery.jpg": [1200, 896],
};
const sizeOf = (src: string) => PHOTO_SIZE[src] ?? ([1920, 1080] as const);

const svg = (paths: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

/** a small line drawing for each building service, by a word in its name */
const BUILD_ICON: readonly (readonly [RegExp, string])[] = [
  [/residential/i, `<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>`],
  [/commercial/i, `<path d="M5 21V4h10v17"/><path d="M15 9h4v12"/><path d="M8 8h1M11 8h1M8 12h1M11 12h1M8 16h1M11 16h1"/><path d="M3 21h18"/>`],
  [/industrial/i, `<path d="M3 21V11l6 3V11l6 3V6h4v15z"/><path d="M3 21h18"/><path d="M7 18h2M12 18h2"/>`],
  [/renovation|repair/i, `<path d="M14.5 5.5a4 4 0 0 0-5 5L4 16l4 4 5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-2-2z"/>`],
  [/interior/i, `<path d="M4 18v-5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5"/><path d="M6 11V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3"/><path d="M3 18h18M6 18v2M18 18v2"/>`],
  [/project|management/i, `<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="M8.5 10l1.5 1.5 3-3M8.5 16h7"/>`],
];
const buildIcon = (title: string) => BUILD_ICON.find(([r]) => r.test(title))?.[1] ?? BUILD_ICON[0]![1];

/** a house and an office block, drawn in thin lines (the same drawing style as the Projects header panel) */
const HOUSE_ART = `<svg class="sv-helpart" viewBox="0 0 200 160" aria-hidden="true"><path d="M20 150V62l50-34 50 34v88M70 150v-46h28v46M120 150V40h60v110M132 58h12M156 58h12M132 80h12M156 80h12M132 102h12M156 102h12M8 150h184" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>`;
const PHONE = `<svg class="sv-helpi" viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 3.5h3l1.6 4.2-2 1.3a11 11 0 0 0 6.9 6.9l1.3-2 4.2 1.6v3a2 2 0 0 1-2.2 2A17 17 0 0 1 3.5 5.7a2 2 0 0 1 2-2.2z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`;

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

/**
 * A service as a card, the same for waterproofing and building: a photograph
 * with its top-left corner cut, a navy icon tile for the kind of service on its
 * lower edge, the name, one line on what it covers, and "Get a quote" under a
 * hairline. The whole card opens the quote; under the pointer it lifts, the
 * photograph zooms, the arrow circle fills orange and an orange bar grows
 * along its foot.
 */
function card(c: { title: string; text: string; icon: string; photo?: string }) {
  // the id and the quote link keep the service's own title; the card shows it in sentence case, like every other heading
  const slug = serviceSlug(c.title);
  const name = c.title.charAt(0).toUpperCase() + c.title.slice(1).toLowerCase();
  const media = c.photo ? shot(c.photo, "", "sv-cimg", false, { size: sizeOf(c.photo) }) : ph({ ratio: "16/10", cls: "sv-cimg" });
  return `<li class="sv-card pg-card pg-cardx" id="${slug}" data-rv>
  ${media}
  <div class="sv-cbody">
    <span class="sv-icon" aria-hidden="true">${svg(c.icon)}</span>
    <h3 class="sv-ct" id="sv-${slug}">${esc(name)}</h3>
    <p class="sv-cp">${esc(c.text)}</p>
    <a class="sv-go pg-more" href="${esc(ask(c.title))}" data-internal><span>Get a quote<span class="pg-vh"> for ${esc(c.title.toLowerCase())}</span></span>${arrow}</a>
  </div>
</li>`;
}
/** "Leak-free houses, villas and apartments" → a sentence */
const sentence = (t: string) => (/[.!?]$/.test(t) ? t : `${t}.`);

export function servicesPageMarkup(d: ServicesData, o: PageOptions = {}) {
  void o;
  const c = d.contact;
  const [wp, ...build] = d.services;
  const [hq] = c.regions;
  const wpId = wp ? serviceSlug(wp.title) : "";
  const wpCount = wp ? SERVICE_CATEGORIES.length : 0;

  const lead = "Waterproofing and construction services in";
  const head = banner({
    cls: "sv-head",
    n: "01",
    label: "Services",
    title: `${lead} ${esc(hq ?? "Erode")}, Coimbatore and&nbsp;Tiruppur.`,
    accentFrom: lead.split(" ").length,
    // the quote, then the two jumps down the page, kept together so they wrap as a pair
    actions: `<a class="pg-btn pg-btn--ink" href="/contact#enquiry" data-internal>Get a quote${arrow}</a><span class="sv-jumps">${
      wp ? `<a class="pg-btn pg-btn--line sv-jump" href="#${wpId}">Waterproofing services${arrowDown}</a>` : ""
    }<a class="pg-btn pg-btn--line sv-jump" href="#building">Construction services${arrowDown}</a></span>`,
    media: shot("/images/waterproofing/house-lit-interiors.jpg", "A three-storey house at dusk, its rooms lit, with open balconies, a rooftop water tank and a pool", "", true, {
      size: sizeOf("/images/waterproofing/house-lit-interiors.jpg"),
    }),
    fact: { n: String(wpCount + build.length), label: `${wpCount} waterproofing and ${build.length} construction services` },
  });

  const waterproofing = wp
    ? `<section class="pg-sec pg-sec--white sv-wsec" id="${wpId}" aria-labelledby="sv-w-h">
  <div class="pg-wrap">
    ${secHead({
      split: true,
      label: "Waterproofing services",
      title: `From the terrace <span class="pg-acc">to the sump.</span>`,
      id: "sv-w-h",
      lede: "Eight places water gets into a building, and the waterproofing we use to keep it out of each.",
      extra: `<a class="pg-btn pg-btn--line sv-jump" href="#questions">Ask a question${arrowDown}</a>`,
    })}
    <ul class="sv-grid" data-rv-stagger="60">${SERVICE_CATEGORIES.map((x) => card({ title: x.title, text: AREA_PURPOSE[x.area] ?? "", icon: PLACE_ICON[x.area] ?? "", photo: PLACE_PHOTO[x.area] })).join("")}</ul>
  </div>
</section>`
    : "";

  const building = `<section class="pg-sec pg-band pg-wave-top sv-bsec" id="building" aria-labelledby="sv-b-h">
  <div class="pg-wrap">
    ${secHead({
      label: "Construction services",
      title: `Homes, offices and factories, <span class="pg-acc">built to stay dry.</span>`,
      id: "sv-b-h",
      lede: "New buildings and repairs, with every terrace, bathroom and sump sealed as the work goes up.",
    })}
    <ul class="sv-grid" data-rv-stagger="60">${build.map((x) => card({ title: x.title, text: sentence(x.line ?? x.short ?? x.body), icon: buildIcon(x.title), photo: x.image })).join("")}</ul>
  </div>
</section>`;

  const faq = `<section class="pg-sec sv-fsec" id="questions" aria-labelledby="sv-f-h">
  ${ruler()}
  <div class="pg-wrap sv-fgrid">
    <div class="sv-fhead">
      ${secHead({ label: "Questions", title: `Waterproofing questions, <span class="pg-acc">answered.</span>`, id: "sv-f-h", lede: "What people in Erode and Coimbatore ask us before they book." })}
      <aside class="sv-help pg-panel--blue" aria-label="Talk to an engineer" data-rv>
        ${HOUSE_ART}
        <p class="sv-helpl">Still unsure? Call an engineer</p>
        <a class="sv-heltel" href="${tel(c.phone)}">${PHONE}<span>${esc(c.phone)}</span></a>
        <p class="sv-helph">${esc(c.hours)}</p>
        <a class="pg-btn pg-btn--ink" href="/contact#enquiry" data-internal>Book a free site inspection${arrow}</a>
      </aside>
    </div>
    <div class="sv-faq" data-rv-stagger="70">${serviceFaq(d)
      .map((f, i) => `<details class="sv-q" data-rv${i === 0 ? " open" : ""}><summary><h3>${esc(f.q)}</h3><span class="sv-qi" aria-hidden="true"></span></summary><p>${esc(f.a)}</p></details>`)
      .join("")}</div>
  </div>
</section>`;

  return `${head}\n${waterproofing}\n${building}\n${faq}\n${ctaBand(c, {
    title: "Not sure which service you need?",
    steps: [
      ["Describe the problem", "A line on the form is enough: a leak, a repair or a new building."],
      ["Talk it through with an engineer", "A short call to understand the building and what you have noticed."],
      ["We visit before we advise", "A free site inspection, so the advice fits the building."],
    ],
  })}`;
}

export const SERVICES_CSS = `
/* ── the opening: the shared banner; the jump buttons point down, so their arrows nudge down ── */
.sv-jumps{display:flex;flex-wrap:wrap;gap:.75rem}
.sv-jump:hover>.pg-ar,.sv-jump:focus-visible>.pg-ar{transform:translateY(2px)}
.sv-wsec,.sv-bsec,.sv-fsec{scroll-margin-top:var(--nav-bar,64px)}

/* ── the two grids: waterproofing four to a row on white, building three to a row on the deep-blue band ── */
.sv-wsec .pg-shead,.sv-bsec .pg-shead{margin-bottom:clamp(1.8rem,4.5vh,2.8rem)}
.sv-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1.5rem;margin:0;padding:0;list-style:none}
.sv-grid--3{grid-template-columns:repeat(3,minmax(0,1fr))}

/* ── a service card: white, a hairline, the photograph inset with its top-left corner cut ── */
.sv-card{display:flex;flex-direction:column;min-width:0;padding:.5rem;scroll-margin-top:calc(var(--nav-bar,64px) + 1.5rem)}
/* arrival (opacity, transform: staggered) and the hover lift (translate) run on separate clocks, so the lift is never delayed */
.sv-grid>.sv-card[data-rv]{transition:opacity .8s var(--ease) var(--rvd,0ms),transform .9s cubic-bezier(.2,.75,.15,1) var(--rvd,0ms),translate .35s var(--ease),box-shadow .35s var(--ease)}
.sv-grid>.sv-card:not(.rv-pending):is(:hover,:focus-within){transform:none;translate:0 -4px}
.sv-cimg{--ar:16/10;--cut:clamp(.95rem,1.5vw,1.3rem);flex:none;border-radius:var(--r-ctl)}
.sv-cbody{display:flex;flex:1;flex-direction:column;padding:0 .75rem .6rem}
/* the icon tile sits half over the photograph's lower edge, ringed in white; it is a label, so it stays navy */
.sv-icon{position:relative;z-index:1;display:grid;place-items:center;width:3rem;height:3rem;margin-top:-1.5rem;border-radius:var(--r-ctl);background:var(--navy);color:var(--theme-on-dark);box-shadow:0 0 0 4px var(--card);pointer-events:none}
.sv-icon svg{width:1.4rem;height:1.4rem}
.sv-ct{margin:1rem 0 0;font-family:var(--display);font-size:var(--fs-sub);font-weight:600;line-height:1.2;letter-spacing:-.015em;color:var(--ink);text-wrap:balance;transition:color .3s var(--ease)}
.sv-cp{margin:.5rem 0 1.3rem;font-size:var(--fs-body);line-height:1.55;color:var(--ink2);text-wrap:pretty}
/* "Get a quote" under a hairline: navy words, an outlined arrow circle at the right */
.sv-go{display:flex;justify-content:space-between;gap:1rem;margin-top:auto;padding-top:.85rem;border-top:1px solid var(--line)}
.sv-go>span{padding-bottom:2px;background:linear-gradient(var(--act),var(--act)) left bottom/0% 1.5px no-repeat;transition:background-size .45s var(--ease)}
/* the whole card opens the quote */
.sv-go::after{content:"";position:absolute;inset:0;z-index:1;border-radius:var(--r-card)}
.pg .sv-go:focus-visible{outline:none}
.sv-go:focus-visible::after{box-shadow:inset 0 0 0 2px var(--accent)}
.sv-card:has(.sv-go:focus-visible){outline:2px solid var(--accent);outline-offset:3px}
.sv-bsec .sv-card:has(.sv-go:focus-visible){outline-color:var(--theme-focus-on-dark)}
.sv-card:hover .sv-ct,.sv-card:focus-within .sv-ct{color:var(--navy)}
.sv-card:hover .sv-go>span,.sv-card:focus-within .sv-go>span{background-size:100% 1.5px}
/* a card reached by a link (/services#terrace-waterproofing): ringed in blue, its bar shown */
.sv-grid>.sv-card:target{box-shadow:inset 0 0 0 2px var(--accent),var(--lift)}

/* ── questions: the heading and a deep-blue panel held at the left; the questions as a hairline list ── */
.sv-fsec>.pg-ruler{position:absolute;top:0;left:0;right:0}
.sv-fgrid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:2.4rem clamp(2.5rem,6vw,6rem);align-items:start}
.sv-fhead{position:sticky;top:calc(var(--nav-bar,64px) + 2rem);display:flex;flex-direction:column;gap:clamp(1.6rem,4vh,2.4rem);min-width:0}
.sv-fhead .pg-shead{margin-bottom:0}
.sv-help{--cut:clamp(1rem,1.6vw,1.4rem);overflow:hidden;max-width:26rem;padding:calc(1.5rem + 12px) 1.6rem 1.6rem;clip-path:polygon(var(--cut) 0,100% 0,100% 100%,0 100%,0 var(--cut))}
.sv-help>*:not(.sv-helpart){position:relative;z-index:1}
.sv-helpart{position:absolute;right:-1.4rem;bottom:-1.2rem;width:11rem;color:var(--theme-on-dark);opacity:.08;pointer-events:none}
.sv-helpl{margin:0;font-size:var(--fs-body);line-height:1.4;color:var(--band-mute)}
.sv-heltel{display:inline-flex;align-items:center;gap:.6rem;margin-top:.6rem;padding-bottom:3px;font-family:var(--display);font-size:var(--fs-sub);font-weight:600;line-height:1.2;color:var(--theme-white);text-decoration:none;font-variant-numeric:tabular-nums;background:linear-gradient(var(--act),var(--act)) left bottom/0% 1.5px no-repeat;transition:background-size .45s var(--ease)}
.sv-heltel:hover,.sv-heltel:focus-visible{background-size:100% 1.5px}
.sv-helpi{width:1.15rem;height:1.15rem;flex:none;color:var(--band-mute)}
.sv-helph{margin:.4rem 0 0;font-size:var(--fs-body);line-height:1.4;color:var(--band-mute)}
.sv-help .pg-btn{margin-top:1.4rem}

.sv-faq{min-width:0;border-top:1px solid var(--line)}
.sv-q{position:relative;border-bottom:1px solid var(--line);interpolate-size:allow-keywords}
.sv-faq>.sv-q[data-rv]{transition:opacity .8s var(--ease) var(--rvd,0ms),transform .9s cubic-bezier(.2,.75,.15,1) var(--rvd,0ms),background-color .3s var(--ease)}
/* the open row turns white and a blue bar draws down its left edge */
.sv-q::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--navy);transform:scaleY(0);transform-origin:top;transition:transform .35s var(--ease)}
.sv-q[open]{background:var(--theme-surface)}
.sv-q[open]::before{transform:scaleY(1)}
.sv-q:not([open]):hover{background:color-mix(in srgb,var(--theme-surface) 55%,transparent)}
.sv-q::details-content{height:0;overflow:clip;transition:height .4s var(--ease),content-visibility .4s allow-discrete}
.sv-q[open]::details-content{height:auto}
.sv-q summary{display:flex;align-items:center;justify-content:space-between;gap:1.25rem;padding:1.25rem;list-style:none;cursor:pointer}
.sv-q summary::-webkit-details-marker{display:none}
.sv-q h3{margin:0;font-family:var(--display);font-size:var(--fs-sub);font-weight:500;line-height:1.3;letter-spacing:-.015em;color:var(--ink);text-wrap:balance;transition:color .3s var(--ease)}
.sv-q summary:hover h3{color:var(--navy)}
/* the + control: an outline at rest, an orange ring under the pointer or keyboard focus, filled navy and turned to an x when open (open is a state, not an action) */
.sv-qi{position:relative;flex:none;width:2.25rem;height:2.25rem;border-radius:50%;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 24%,transparent);color:var(--ink);transition:transform .35s var(--ease),background-color .3s var(--ease),box-shadow .3s var(--ease),color .3s var(--ease)}
.sv-qi::before,.sv-qi::after{content:"";position:absolute;left:50%;top:50%;width:.8rem;height:1.6px;margin:-.8px 0 0 -.4rem;background:currentColor}
.sv-qi::after{transform:rotate(90deg)}
.sv-q summary:hover .sv-qi,.sv-q summary:focus-visible .sv-qi{box-shadow:inset 0 0 0 1.5px var(--act)}
.sv-q[open] .sv-qi{transform:rotate(45deg);background:var(--navy);color:var(--theme-on-dark);box-shadow:none}
.sv-q[open] summary:hover .sv-qi,.sv-q[open] summary:focus-visible .sv-qi{box-shadow:0 0 0 2px var(--theme-surface),0 0 0 3.5px var(--act)}
.sv-q p{margin:0;padding:0 4.75rem 1.5rem 1.25rem;font-size:var(--fs-body);line-height:1.65;color:var(--ink2);text-wrap:pretty;transition:opacity .35s var(--ease) .05s,transform .4s var(--ease) .05s}
@starting-style{.sv-q[open] p{opacity:0;transform:translateY(-6px)}}

/* eight cards stay four to a row down to 1024px and six stay three, so no row is left short */
@media (max-width:1279px){
  .sv-grid{gap:1.25rem}
}
@media (max-width:1023px){
  .sv-grid,.sv-grid--3{grid-template-columns:repeat(2,minmax(0,1fr))}
  .sv-fgrid{grid-template-columns:minmax(0,1fr)}
  .sv-fhead{position:static}
}
@media (max-width:767px){
  .sv-jumps{flex:1 1 100%}
  .sv-jumps .pg-btn{flex:1 1 auto}
  .sv-q summary{padding:1.1rem 1rem}
  .sv-q p{padding:0 1rem 1.3rem}
  .sv-help{max-width:none}
}
@media (max-width:639px){
  .sv-grid,.sv-grid--3{grid-template-columns:minmax(0,1fr);gap:1.25rem}
}
@media (prefers-reduced-motion:reduce){
  .sv-grid>.sv-card:not(.rv-pending):is(:hover,:focus-within){translate:none}
  .sv-jump:hover>.pg-ar,.sv-jump:focus-visible>.pg-ar{transform:none}
  .sv-q::details-content{transition:none}
}
`;
