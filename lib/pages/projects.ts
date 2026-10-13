/**
 * Projects page: an opening in two halves, the words on a soft panel (the
 * title, a line on what we build, the ways on) beside three
 * photographs of buildings going up and finished; then the projects, picked
 * by three buttons (completed, ongoing, upcoming) and a location list, each
 * as a card led by its photograph: its type and place, name, a line on it,
 * the waterproofing built into it in the order it goes in, and a way to ask
 * about something similar. Then a way to start a project beside the
 * questions people ask. /projects#slug lands on that project (the home page
 * links so), whichever button it falls under.
 */
import { arrow, esc, listing, mark, ph, tel, type ContactInfo, type PageOptions } from "./kit";
import { FANCY_SELECT_CSS } from "./fancy-select";

export interface ProjectData {
  slug: string;
  name: string;
  location: string;
  type: string;
  status: string;
  image: string;
  summary: string;
  /** the story of its waterproofing */
  story?: string;
  waterproofing?: string;
  structuralSystem?: string;
  materials?: string;
}
export interface ProjectsData {
  projects: readonly ProjectData[];
  contact: ContactInfo;
  /** the stages of a job, for the answer on how the waterproofing is tested */
  process?: readonly { title: string; body: string }[];
  /** the company's general questions, for the answers on site visits and approvals */
  faqs?: readonly { question: string; answer: string }[];
}

export const PROJECTS_TRAIL = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
] as const;

const town = (location: string) => location.split(",").pop()?.trim() ?? location;
const dot = (s: string) => (s === "Completed" ? "done" : s === "Under construction" ? "live" : "plan");
const STATUS_ORDER = ["Completed", "Under construction", "In design"];
/** what each status is called on the page: the three buttons and the label on each photograph */
const STATUS_NAME: Record<string, string> = { Completed: "Completed", "Under construction": "Ongoing", "In design": "Upcoming" };
const statusName = (s: string) => STATUS_NAME[s] ?? s;

/** the opening's three photographs: a block going up, its foundations, and a finished terrace */
const HERO_SHOTS = [
  { src: "/images/process-05.jpg", alt: "An apartment block in its last stage of construction, scaffolding on one side and the finished façade on the other", w: 1920, h: 1080 },
  { src: "/images/process-03.jpg", alt: "Aerial view of a building site with its column footings and reinforcement laid out", w: 1920, h: 1080 },
  { src: "/images/waterproofing/terrace-before-monsoon.jpg", alt: "A finished, waterproofed roof terrace with glass railings", w: 1920, h: 1080 },
] as const;
/** "HDPE membrane under the raft · DPC · …" → its layers, in the order they go in */
const layersOf = (p: ProjectData) =>
  (p.waterproofing ?? "")
    .split("·")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => x.charAt(0).toUpperCase() + x.slice(1));

const pin = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14.5s-4.6-3.9-4.6-7.6a4.6 4.6 0 0 1 9.2 0c0 3.7-4.6 7.6-4.6 7.6z" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="8" cy="6.9" r="1.6" fill="currentColor"/></svg>`;

/** one project as a card: its photograph with the status on it, then its type and place, name, a line on it, the waterproofing built in, and a way to ask */
function card(p: ProjectData, i: number, first: string) {
  const layers = layersOf(p);
  const photo = p.image
    ? `<img src="${esc(p.image)}" alt="${esc(`${p.name}, ${p.location}`)}" width="1376" height="768" loading="${i < 3 ? "eager" : "lazy"}" decoding="async">`
    : ph({ ratio: "16/10", label: `Photo: ${p.name}` });
  return `<article class="pj-card" id="${esc(p.slug)}" data-town="${esc(town(p.location))}" data-status="${esc(p.status)}" aria-labelledby="pj-${esc(p.slug)}"${p.status === first ? "" : " hidden"}>
  <figure class="pj-media">
    ${photo}
    <span class="pj-stat" data-s="${dot(p.status)}"><i aria-hidden="true"></i>${esc(statusName(p.status))}</span>
  </figure>
  <div class="pj-body">
    <p class="pj-meta"><span>${esc(p.type)}</span><span class="pj-loc">${pin}${esc(p.location)}</span></p>
    <h2 class="pj-name" id="pj-${esc(p.slug)}">${esc(p.name)}</h2>
    <p class="pj-lead">${esc(p.summary)}</p>
    ${layers.length ? `<div class="pj-wp"><p class="pj-k">Waterproofing built in</p><ol class="pj-layers">${layers.map((l) => `<li>${esc(l)}</li>`).join("")}</ol></div>` : ""}
    <a class="pj-ask" href="/contact?project=${encodeURIComponent(p.name)}#enquiry" data-internal><span>Ask about a similar project</span><i aria-hidden="true">${arrow}</i></a>
  </div>
</article>`;
}

/** the questions people ask before they start a building project with us, answered from what the rest of the site says */
export function projectFaq(d: Pick<ProjectsData, "contact" | "process" | "faqs">): { q: string; a: string }[] {
  const c = d.contact;
  const street = c.address.split(",").slice(0, 2).join(",").trim();
  const test = d.process?.find((p) => /test/i.test(p.title));
  const visit = d.faqs?.find((f) => /visit/i.test(f.question));
  const approvals = d.faqs?.find((f) => /permission|approval/i.test(f.question));
  return [
    {
      q: "What kinds of buildings does RPC Constructions build?",
      a: "Homes, villas and apartment buildings, offices, factories and warehouses, and mixed-use buildings with shops below. Whatever the building, its waterproofing is planned before construction starts and built in stage by stage, not added at the end.",
    },
    { q: "Which towns do you take on projects in?", a: `Our office is at ${street}, and we take on projects across ${listing(c.regions)}.` },
    {
      q: "How is waterproofing planned into a new building?",
      a: "Before a price is fixed, an engineer looks at the soil, the groundwater, the terraces and every wet area. Each risk gets its own layer, from the membrane under the foundation to the coating on the terrace; each project above lists the layers built into it, in the order they go in.",
    },
    ...(test ? [{ q: "How do you check the waterproofing works before handover?", a: test.body }] : []),
    ...(visit ? [{ q: "Can I visit one of your sites or a finished building?", a: visit.answer }] : []),
    ...(approvals ? [{ q: "Do you handle building approvals?", a: approvals.answer }] : []),
    {
      q: "How long does a building project take?",
      a: "It depends on the size of the building, the ground it stands on and how long approvals take, so we give a timeline once we have seen the site and the drawings. The quote sets out every stage of the work, with the waterproofing and its water tests written into each one.",
    },
    {
      q: "How do I start a project with RPC?",
      a: `Send us your plot details or drawings through the enquiry form, call ${c.phone} or message us on WhatsApp. An engineer replies within one working day, and the first site visit is free.`,
    },
  ];
}

export function projectsPageMarkup(d: ProjectsData, o: PageOptions = {}) {
  void o;
  const ps = d.projects;
  const c = d.contact;
  const count = (f: (p: ProjectData) => boolean) => ps.filter(f).length;
  const statuses = [...new Set(ps.map((p) => p.status))].sort((a, b) => STATUS_ORDER.indexOf(a) - STATUS_ORDER.indexOf(b));
  const towns = [...new Set(ps.map((p) => town(p.location)))];
  // the page opens on the first status that has projects (completed, when there are any)
  const first = statuses[0] ?? "";
  const faq = projectFaq(d);
  const shot = (x: (typeof HERO_SHOTS)[number], i: number) =>
    `<figure class="pj-m pj-m${i + 1}"><img src="${x.src}" alt="${esc(x.alt)}" width="${x.w}" height="${x.h}"${i === 0 ? ' fetchpriority="high"' : ""} decoding="async"></figure>`;
  const tab = (st: string) =>
    `<button type="button" class="pj-tab" data-pj-status="${esc(st)}" data-pj-name="${esc(statusName(st).toLowerCase())} projects" aria-pressed="${st === first}">${esc(statusName(st))}<span class="pj-tw"> projects</span><span class="pj-tn">${count((p) => p.status === st)}</span></button>`;
  return `<header class="pg-head pj-hero">
  <div class="pg-wrap pj-herogrid">
    <div class="pj-panel">
      <h1 class="pj-h1" data-rv>Our projects, <span>built to stay dry.</span></h1>
      <p class="pj-intro" data-rv>Every building we take on starts with one question: where could water get in? Here are the homes, offices and factories we have built and are building across ${esc(listing(towns))}, waterproofed from the foundation up.</p>
      <div class="pg-actions" data-rv><a class="pg-btn pg-btn--ink" href="/services" data-internal>Our services${arrow}</a><a class="pg-btn pg-btn--line" href="#start">Start a project</a></div>
      <svg class="pj-panelart" viewBox="0 0 200 160" aria-hidden="true"><path d="M20 150V62l50-34 50 34v88M70 150v-46h28v46M120 150V40h60v110M132 58h12M156 58h12M132 80h12M156 80h12M132 102h12M156 102h12M8 150h184" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>
    </div>
    <div class="pj-mosaic">${HERO_SHOTS.map(shot).join("")}</div>
  </div>
</header>
<section class="pj-listwrap" aria-labelledby="pj-l-h">
  <div class="pg-wrap">
    <div class="pj-lhead">
      <div>${mark("02", "Our projects")}<h2 class="pg-h2" id="pj-l-h" data-rv>Discover our completed, ongoing and upcoming projects.</h2></div>
      <p class="pg-lede" data-rv>Every project lists the waterproofing built into it, in the order it goes in. Choose a stage, or narrow them down by location.</p>
    </div>
    <div class="pj-filters" role="group" aria-label="Filter the projects">
      ${statuses.map(tab).join("")}
      <label class="pj-town"><span class="pg-vh">Location</span><select data-pj-town><option value="all">All locations (${ps.length})</option>${towns.map((t) => `<option value="${esc(t)}">${esc(t)} (${count((p) => town(p.location) === t)})</option>`).join("")}</select></label>
    </div>
    <p class="pj-showing" aria-live="polite"></p>
    <div class="pj-list" id="project-list">${ps.map((p, i) => card(p, i, first)).join("\n")}</div>
    <p class="pj-empty" hidden>No projects here yet. <button type="button" data-reset>Show every location</button></p>
  </div>
</section>
<section class="pg-sec pg-sec--stone pj-fsec" id="start" aria-labelledby="pj-f-h">
  <div class="pg-wrap pj-fgrid">
    <div class="pj-fhead">
      ${mark("03", "Start a project")}
      <h2 class="pg-h2" id="pj-f-h" data-rv>Start your project with us.</h2>
      <p class="pg-lede" data-rv>Planning a home, an office or a factory? Tell us what you have in mind. An engineer will take you from the first site visit to handover, with the waterproofing designed in at every stage.</p>
      <div class="pj-fask" data-rv>
        <a class="pg-btn pg-btn--ink" href="/contact#enquiry" data-internal>Book a free site inspection${arrow}</a>
        <a class="pg-btn pg-btn--line" href="${esc(c.whatsapp)}" target="_blank" rel="noopener noreferrer">WhatsApp us</a>
      </div>
      <p class="pj-freach" data-rv><a href="${tel(c.phone)}">${esc(c.phone)}</a><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></p>
    </div>
    <div class="pj-fqs" id="questions">
      <h2 class="pj-fk">Questions people ask before they start</h2>
      <div class="pj-faq">${faq
        .map(
          (f, i) =>
            `<details class="pj-q" name="pj-faq"${i === 0 ? " open" : ""}><summary><span class="pj-qn">${String(i + 1).padStart(2, "0")}</span><h3>${esc(f.q)}</h3><span class="pj-qi" aria-hidden="true"></span></summary><p>${esc(f.a)}</p></details>`,
        )
        .join("")}</div>
    </div>
  </div>
</section>`;
}

export const PROJECTS_CSS = FANCY_SELECT_CSS + `
/* the opening: the words on a soft panel beside three photographs, each with two corners cut on the slant */
.pj-hero{padding-top:calc(var(--nav-room) + clamp(1.4rem,4vh,2.4rem));padding-bottom:clamp(2.2rem,6vh,3.6rem);border-bottom:0}
.pj-herogrid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.08fr);gap:clamp(.9rem,1.4vw,1.25rem);align-items:stretch}
.pj-panel{position:relative;display:flex;flex-direction:column;justify-content:center;min-width:0;padding:clamp(1.6rem,3vw,2.6rem);border-radius:20px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);overflow:hidden}
.pj-panel > *:not(.pj-panelart){position:relative;z-index:1}
.pj-panelart{position:absolute;right:-1.2rem;bottom:-1rem;width:clamp(9rem,16vw,13rem);color:var(--navy);opacity:.07;pointer-events:none}
.pj-h1{margin:0;font-family:var(--display);font-weight:600;font-size:var(--fs-title);line-height:1.08;letter-spacing:-.025em;color:var(--ink);text-wrap:balance}
.pj-h1 span{color:color-mix(in srgb,var(--theme-ink) 38%,transparent)}
.pj-intro{margin:.9rem 0 0;max-width:33rem;font-size:var(--fs-body);line-height:1.65;color:var(--ink2);text-wrap:pretty}
.pj-panel .pg-actions{margin-top:clamp(1.2rem,2.8vh,1.6rem)}
.pj-mosaic{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:minmax(0,1.3fr) minmax(0,1fr);gap:clamp(.6rem,.9vw,.85rem);min-height:clamp(19rem,26vw,25rem)}
.pj-m{--cut:clamp(1.3rem,2.2vw,2.1rem);position:relative;margin:0;min-height:0;overflow:hidden;border-radius:16px;background:var(--theme-placeholder);clip-path:polygon(var(--cut) 0,100% 0,100% calc(100% - var(--cut)),calc(100% - var(--cut)) 100%,0 100%,0 var(--cut))}
.pj-m1{grid-column:1 / -1}
.pj-m2,.pj-m3{--cut:clamp(1rem,1.6vw,1.5rem)}
.pj-m img{position:absolute;inset:0;display:block;width:100%;height:100%;object-fit:cover;transition:transform 1.1s cubic-bezier(.2,.7,.2,1)}
.pj-m1 img{object-position:50% 40%}
.pj-m:hover img{transform:scale(1.04)}

/* the projects' heading: the title on the left, a line on the right; then the buttons and the location list, centred */
.pj-lhead{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:1rem clamp(2rem,6vw,6rem);align-items:end}
.pj-lhead .pg-h2{margin-top:.7rem;max-width:20ch}
.pj-lhead .pg-lede{margin:0;max-width:30rem}
.pj-filters{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.6rem;margin:clamp(1.8rem,4.5vh,2.6rem) 0 clamp(1.8rem,4.5vh,2.6rem)}
.pj-tab{display:inline-flex;align-items:center;gap:.6rem;height:2.9rem;padding:0 .55rem 0 1.15rem;border:0;border-radius:999px;background:var(--card);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 18%,transparent);font:inherit;font-size:var(--fs-body);font-weight:600;color:var(--ink);cursor:pointer;transition:background-color .25s,color .25s,box-shadow .25s}
.pj-tab:hover{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 45%,transparent)}
.pj-tab[aria-pressed=true]{background:var(--theme-secondary);color:var(--theme-on-secondary);box-shadow:none}
.pj-tab:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.pj-tn{display:grid;place-items:center;min-width:1.85rem;height:1.85rem;padding:0 .45rem;border-radius:999px;background:color-mix(in srgb,var(--theme-ink) 7%,transparent);font-size:.82rem;font-variant-numeric:tabular-nums;transition:background-color .25s,color .25s}
.pj-tab[aria-pressed=true] .pj-tn{background:color-mix(in srgb,var(--theme-on-secondary) 14%,transparent);color:var(--theme-on-secondary)}
.pj-tab[data-empty] .pj-tn{opacity:.5}
.pj-town{position:relative;display:inline-flex;min-width:14rem}
.pj-town select{width:100%;height:2.9rem;padding:0 1rem;border:0;border-radius:999px;background:var(--card);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 18%,transparent);font:inherit;font-size:var(--fs-body);font-weight:600;color:var(--ink)}
.pj-town .fs{width:100%}
.pj-town .fs-btn{gap:.6rem;height:2.9rem;min-height:0;padding:0 1rem 0 2.6rem;border-radius:999px;background:var(--card);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 18%,transparent)}
.pj-town .fs-btn:hover,.pj-town .fs-btn[aria-expanded=true]{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 45%,transparent)}
.pj-town .fs-btn .fs-n{display:none}
.pj-town::before{content:"";position:absolute;left:1rem;top:50%;z-index:1;width:1.05rem;height:1.05rem;margin-top:-.525rem;background:var(--accent);-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M8 14.5s-4.6-3.9-4.6-7.6a4.6 4.6 0 0 1 9.2 0c0 3.7-4.6 7.6-4.6 7.6z' fill='none' stroke='black' stroke-width='1.5'/%3E%3Ccircle cx='8' cy='6.9' r='1.6'/%3E%3C/svg%3E") center/contain no-repeat;mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M8 14.5s-4.6-3.9-4.6-7.6a4.6 4.6 0 0 1 9.2 0c0 3.7-4.6 7.6-4.6 7.6z' fill='none' stroke='black' stroke-width='1.5'/%3E%3Ccircle cx='8' cy='6.9' r='1.6'/%3E%3C/svg%3E") center/contain no-repeat;pointer-events:none}
.pj-town:has(select:not([data-fs]))::before{display:none}
/* the running count is read out, not shown */
.pj-showing{position:absolute;width:1px;height:1px;margin:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap}

/* the projects: three to a row, each led by its photograph */
.pj-listwrap{padding:clamp(3.4rem,9vh,6rem) 0 clamp(4.5rem,12vh,7.5rem);border-top:1px solid var(--line)}
.pj-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(2.4rem,5vh,3.2rem) clamp(1.2rem,2vw,1.8rem)}
.pj-card{display:flex;flex-direction:column;min-width:0;scroll-margin-top:calc(var(--nav-bar,80px) + 1rem)}
.pj-card[hidden]{display:none}
.pj-card:target{outline:2px solid var(--accent);outline-offset:10px;border-radius:16px}

/* the photograph: rounded, with one corner cut on the slant; the status sits on it */
.pj-media{position:relative;margin:0;aspect-ratio:16/10;overflow:hidden;border-radius:14px;background:var(--theme-placeholder);clip-path:polygon(0 0,calc(100% - 2.4rem) 0,100% 2.4rem,100% 100%,0 100%)}
.pj-media img,.pj-media .pg-ph{display:block;width:100%;height:100%;object-fit:cover;border-radius:0}
.pj-media img{transition:transform .9s cubic-bezier(.2,.7,.2,1)}
.pj-media::after{content:"";position:absolute;inset:55% 0 0;background:linear-gradient(to top,color-mix(in srgb,var(--theme-primary-dark) 45%,transparent),color-mix(in srgb,var(--theme-primary-dark) 0%,transparent));pointer-events:none}
.pj-card:hover .pj-media img{transform:scale(1.045)}
.pj-stat{position:absolute;left:.85rem;bottom:.85rem;z-index:1;display:inline-flex;align-items:center;gap:.45rem;padding:.38rem .75rem;border-radius:999px;background:color-mix(in srgb,var(--theme-primary-dark) 55%,transparent);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);font-size:.85rem;font-weight:600;line-height:1.2;color:var(--theme-white)}
.pj-stat i{flex:none;width:7px;height:7px;border-radius:50%;background:var(--theme-success-bright);box-shadow:0 0 0 3px color-mix(in srgb,var(--theme-success-bright) 25%,transparent)}
.pj-stat[data-s=live] i{background:var(--theme-secondary);box-shadow:0 0 0 3px color-mix(in srgb,var(--theme-secondary) 25%,transparent)}
.pj-stat[data-s=plan] i{background:var(--theme-primary-soft);box-shadow:0 0 0 3px color-mix(in srgb,var(--theme-primary-soft) 25%,transparent)}

/* the words under it */
.pj-body{display:flex;flex-direction:column;flex:1;padding-top:1.15rem}
.pj-meta{display:flex;flex-wrap:wrap;align-items:center;gap:.3rem .9rem;margin:0;font-size:.92rem;color:var(--mute)}
.pj-meta > span:first-child{font-weight:600;color:var(--accent)}
.pj-loc{display:inline-flex;align-items:center;gap:.3rem}
.pj-loc svg{flex:none;width:.9rem;height:.9rem}
.pj-name{margin:.5rem 0 0;font-family:var(--display);font-weight:600;font-size:var(--fs-sub);line-height:1.2;letter-spacing:-.015em;color:var(--ink);text-wrap:balance;transition:color .25s}
.pj-card:hover .pj-name{color:var(--accent)}
.pj-lead{margin:.5rem 0 0;font-size:var(--fs-body);line-height:1.6;color:var(--ink2);display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
/* the waterproofing as a short spec list: its layers, numbered in the order they go in */
.pj-wp{margin-top:1.1rem;padding-top:.95rem;border-top:1px solid var(--line)}
.pj-k{margin:0;font-size:.8rem;font-weight:600;letter-spacing:.02em;color:var(--mute)}
.pj-layers{counter-reset:pj-l;display:grid;gap:.32rem;margin:.6rem 0 0;padding:0;list-style:none;font-size:.93rem;line-height:1.45;color:var(--ink)}
.pj-layers li{counter-increment:pj-l;display:grid;grid-template-columns:1.75rem minmax(0,1fr);align-items:baseline}
.pj-layers li::before{content:counter(pj-l,decimal-leading-zero);font-size:.75rem;font-weight:600;font-variant-numeric:tabular-nums;color:var(--accent)}
.pj-ask{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-top:auto;padding-top:1.3rem;font-size:var(--fs-body);font-weight:600;color:var(--ink);text-decoration:none}
.pj-ask > span{background:linear-gradient(currentColor,currentColor) 0 100%/0 1.5px no-repeat;padding-bottom:2px;transition:background-size .3s,color .2s}
.pj-ask > i{display:grid;place-items:center;flex:none;width:2.4rem;height:2.4rem;border-radius:50%;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 20%,transparent);font-style:normal;transition:background-color .25s,color .25s,box-shadow .25s}
.pj-ask .pg-ar{width:.95rem;height:.95rem;transition:transform .25s}
.pj-ask:hover > span{background-size:100% 1.5px;color:var(--accent)}
.pj-ask:hover > i{background:var(--navy);color:var(--theme-on-dark);box-shadow:none}
.pj-ask:hover .pg-ar{transform:translate(2px,-2px)}
.pj-ask:focus-visible{outline:2px solid var(--accent);outline-offset:4px;border-radius:8px}
.pj-empty{margin:0;padding:3rem 0;text-align:center;font-size:var(--fs-body);color:var(--mute)}
.pj-empty button{border:0;border-bottom:1px solid currentColor;background:none;padding:0 0 2px;font:600 var(--fs-body) var(--sans);color:var(--ink);cursor:pointer}

/* questions: the heading and a way to ask on the left, held in place; the numbered answers on the right, one open at a time */
.pj-fsec{padding-bottom:clamp(4.5rem,11vh,7.5rem)}
.pj-fgrid{display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:2rem clamp(2rem,6vw,6.5rem);align-items:start}
.pj-fhead{position:sticky;top:calc(var(--nav-room) + 1.5rem)}
.pj-fhead .pg-h2{margin-top:.7rem;max-width:16ch}
.pj-fhead .pg-lede{margin-top:1rem;max-width:30rem}
.pj-fask{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:clamp(1.5rem,3.5vh,2.1rem)}
.pj-freach{display:flex;flex-wrap:wrap;gap:.4rem 1.4rem;margin:1.4rem 0 0;padding-top:1.1rem;border-top:1px solid var(--line);font-size:var(--fs-body)}
.pj-freach a{font-weight:600;color:var(--ink);text-decoration:none;border-bottom:1px solid color-mix(in srgb,var(--theme-ink) 25%,transparent);transition:color .2s,border-color .2s}
.pj-freach a:hover{color:var(--accent);border-color:var(--accent)}
.pj-fqs{min-width:0;scroll-margin-top:calc(var(--nav-room) + 1rem)}
.pj-fk{margin:0 0 .9rem;font-size:var(--fs-body);font-weight:600;color:var(--mute)}
.pj-faq{border-top:1px solid color-mix(in srgb,var(--theme-ink) 20%,transparent)}
.pj-q{border-bottom:1px solid color-mix(in srgb,var(--theme-ink) 20%,transparent);interpolate-size:allow-keywords}
.pj-q::details-content{height:0;overflow:clip;transition:height .35s ease,content-visibility .35s allow-discrete}
.pj-q[open]::details-content{height:auto}
.pj-q summary{display:grid;grid-template-columns:2.6rem minmax(0,1fr) auto;align-items:center;gap:1rem;padding:1.25rem 0;list-style:none;cursor:pointer}
.pj-q summary::-webkit-details-marker{display:none}
.pj-q summary:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:8px}
.pj-qn{font-size:.9rem;font-weight:600;font-variant-numeric:tabular-nums;color:var(--mute);transition:color .2s}
.pj-q h3{margin:0;font-family:var(--display);font-size:clamp(1.02rem,.95rem + .3vw,1.18rem);font-weight:600;line-height:1.4;letter-spacing:-.005em;color:var(--ink);transition:color .2s}
.pj-qi{position:relative;flex:none;width:2.2rem;height:2.2rem;border-radius:50%;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 22%,transparent);transition:transform .35s cubic-bezier(.2,.7,.2,1),background-color .25s,box-shadow .25s}
.pj-qi::before,.pj-qi::after{content:"";position:absolute;left:50%;top:50%;width:.75rem;height:1.6px;margin:-.8px 0 0 -.375rem;background:var(--ink);transition:background-color .25s}
.pj-qi::after{transform:rotate(90deg)}
.pj-q summary:hover h3{color:var(--accent)}
.pj-q[open] .pj-qn{color:var(--accent)}
.pj-q[open] .pj-qi{transform:rotate(45deg);background:var(--navy);box-shadow:none}
.pj-q[open] .pj-qi::before,.pj-q[open] .pj-qi::after{background:var(--theme-white)}
.pj-q p{margin:0;padding:0 3.2rem 1.4rem 3.6rem;max-width:44rem;font-size:var(--fs-body);line-height:1.7;color:var(--ink2)}
@media (prefers-reduced-motion:reduce){.pj-q::details-content,.pj-qi,.pj-media img{transition:none}}

/* below wide screens the panel sits above the photographs, and the projects' line under their title */
@media (max-width:1023px){
  .pj-herogrid{grid-template-columns:1fr}
  .pj-mosaic{min-height:clamp(16rem,56vw,24rem)}
  .pj-lhead{grid-template-columns:1fr;align-items:start}
}
/* tablets: two to a row, the questions under their heading; phones: one */
@media (max-width:1099px){.pj-list{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:899px){
  .pj-fgrid{grid-template-columns:1fr}
  .pj-fhead{position:static}
}
@media (max-width:699px){.pj-list{grid-template-columns:minmax(0,1fr)}}
@media (max-width:767px){
  .pj-hero{padding-bottom:2rem}
  .pj-panel{padding:1.6rem 1.3rem 1.8rem}
  /* phones: the three buttons in one row, shortened, and the location list under them */
  .pj-filters{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.45rem}
  .pj-tab{justify-content:center;gap:.4rem;height:2.7rem;padding:0 .4rem;font-size:.9rem}
  .pj-tw{display:none}
  .pj-tn{min-width:1.55rem;height:1.55rem;font-size:.75rem}
  .pj-town{grid-column:1 / -1;min-width:0}
  .pj-q summary{grid-template-columns:2rem minmax(0,1fr) auto;gap:.75rem}
  .pj-q p{padding:0 0 1.2rem 2.75rem}
}
`;
