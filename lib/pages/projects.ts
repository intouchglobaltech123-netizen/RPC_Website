/**
 * Projects page: an opening in two halves, the words on a soft panel (the
 * title, a line on what we build, the ways on) beside three
 * photographs of buildings going up and finished (PROTECTED: the header and
 * its .pj-hero / .pj-herogrid / .pj-panel / .pj-panelart / .pj-h1 / .pj-intro /
 * .pj-mosaic / .pj-m* rules stay exactly as they are).
 *
 * Below it, "blueprint and action": a white section opened by a measuring-ruler
 * seam, with the projects picked by three status pills (the chosen one filled
 * orange, the only orange at rest) and a location list. Each project is a white
 * card led by its photograph (one corner cut on the slant, a glass status pill),
 * then its name, a spec list (type, location) on small navy tiles, a line on
 * it, the waterproofing built into it in the order it goes in, and a link to ask
 * about something similar. The card itself is not a link, so it stays still
 * under the pointer: only when that link is hovered or focused does its arrow
 * circle fill orange, an orange line grow under its words and an orange bar
 * along the card's foot, the card's shadow deepen and its photograph zoom
 * in. Then, on the page grey, a
 * deep-blue panel to start a project (hatched along its top, a corner cut)
 * beside the questions people ask. /projects#slug lands on that project (the
 * home page links so), whichever button it falls under.
 */
import { arrow, esc, listing, mark, ph, tel, waGlyph, words, type ContactInfo, type PageOptions } from "./kit";
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

/** small line glyphs for the cards' spec list (each sits on a navy tile) and the panel's phone and email */
const svg16 = (d: string) => `<svg viewBox="0 0 16 16" aria-hidden="true">${d}</svg>`;
const pin = svg16(`<path d="M8 14.5s-4.6-3.9-4.6-7.6a4.6 4.6 0 0 1 9.2 0c0 3.7-4.6 7.6-4.6 7.6z" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="8" cy="6.9" r="1.6" fill="currentColor"/>`);
const building = svg16(`<path d="M2.75 14V2.75h6.5V14M9.25 6.5h4V14M1.5 14h13M5 5.25h2M5 8h2M5 10.75h2M11.25 9.25v.01M11.25 11.75v.01" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>`);
const phone = svg16(`<path d="M5.4 2.2 3.6 2.5c-.6.1-1 .6-1 1.2C2.8 9 7 13.2 12.3 13.4c.6 0 1.1-.4 1.2-1l.3-1.8c.1-.5-.2-1-.7-1.2l-2-.8c-.4-.2-.9 0-1.2.3l-.7.9C7.6 9.2 6.8 8.4 6.2 6.8l.9-.7c.3-.3.5-.8.3-1.2l-.8-2c-.2-.5-.7-.8-1.2-.7z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>`);
const mail = svg16(`<rect x="1.9" y="3.4" width="12.2" height="9.2" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="m2.4 4.4 5.6 4.3 5.6-4.3" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>`);

/**
 * one project as a card: its photograph with the status on it, then its name,
 * a spec list (type, location), a line on it, the waterproofing built
 * in, and a way to ask. `k` is its place among the projects of its status, so
 * each row of three arrives left to right.
 */
function card(p: ProjectData, i: number, first: string, k: number) {
  const layers = layersOf(p);
  const photo = p.image
    ? `<img src="${esc(p.image)}" alt="${esc(`${p.name}, ${p.location}`)}" width="1376" height="768" loading="${i < 3 ? "eager" : "lazy"}" decoding="async">`
    : ph({ ratio: "16/10", label: `Photo: ${p.name}` });
  const spec: readonly (readonly [string, string, string])[] = [
    ["Type", p.type, building],
    ["Location", p.location, pin],
  ];
  return `<article class="pj-card" id="${esc(p.slug)}" data-town="${esc(town(p.location))}" data-status="${esc(p.status)}" aria-labelledby="pj-${esc(p.slug)}" data-rv style="--rvd:${(k % 3) * 90}ms"${p.status === first ? "" : " hidden"}>
  <div class="pj-cardin pg-card">
    <figure class="pj-media">
      ${photo}
      <span class="pj-stat" data-s="${dot(p.status)}"><i></i>${esc(statusName(p.status))}</span>
    </figure>
    <div class="pj-body">
      <h2 class="pj-name" id="pj-${esc(p.slug)}">${esc(p.name)}</h2>
      <dl class="pj-spec">${spec.map(([t, v, ic]) => `<div><dt><span class="pj-ic">${ic}</span>${t}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
      <p class="pj-lead">${esc(p.summary)}</p>
      ${layers.length ? `<div class="pj-wp"><p class="pj-k">Waterproofing built in</p><ol class="pj-layers">${layers.map((l) => `<li>${esc(l)}</li>`).join("")}</ol></div>` : ""}
      <div class="pj-foot"><a class="pj-ask pg-more" href="/contact?project=${encodeURIComponent(p.name)}#enquiry" data-internal><span>Ask about a similar project</span>${arrow}</a></div>
    </div>
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
<section class="pj-listwrap pg-seam" aria-labelledby="pj-l-h">
  <div class="pg-wrap">
    <div class="pj-lhead">
      <div class="pj-lhl">${mark("02", "Our projects")}<h2 class="pg-h2" id="pj-l-h" data-rv="words">${words(esc("Discover our completed, ongoing and upcoming projects."), 2)}</h2></div>
      <p class="pg-lede" data-rv>Every project lists the waterproofing built into it, in the order it goes in. Choose a stage, or narrow them down by location.</p>
    </div>
    <div class="pj-filters" role="group" aria-label="Filter the projects" data-rv>
      ${statuses.map(tab).join("")}
      <label class="pj-town"><span class="pg-vh">Location</span><select data-pj-town><option value="all">All locations (${ps.length})</option>${towns.map((t) => `<option value="${esc(t)}">${esc(t)} (${count((p) => town(p.location) === t)})</option>`).join("")}</select></label>
    </div>
    <p class="pj-showing" aria-live="polite"></p>
    <div class="pj-list" id="project-list">${ps.map((p, i) => card(p, i, first, ps.slice(0, i).filter((q) => q.status === p.status).length)).join("\n")}</div>
    <p class="pj-empty" hidden><span>No projects here yet.</span> <button type="button" class="pg-btn pg-btn--line pj-reset" data-reset>Show every location</button></p>
  </div>
</section>
<section class="pg-sec pg-seam pj-fsec" id="start" aria-labelledby="pj-f-h">
  <div class="pg-wrap pj-fgrid">
    <div class="pj-fhead pg-panel--blue">
      ${mark("03", "Start a project")}
      <h2 class="pg-h2" id="pj-f-h" data-rv="words">${words(esc("Start your project with us."), 3)}</h2>
      <p class="pg-lede" data-rv>Planning a home, an office or a factory? Tell us what you have in mind. An engineer will take you from the first site visit to handover, with the waterproofing designed in at every stage.</p>
      <div class="pj-fask" data-rv>
        <a class="pg-btn pg-btn--ink" href="/contact#enquiry" data-internal>Book a free site inspection${arrow}</a>
        <a class="pg-btn pg-btn--line" href="${esc(c.whatsapp)}" target="_blank" rel="noopener noreferrer">${waGlyph}WhatsApp us</a>
      </div>
      <p class="pj-freach" data-rv><a href="${tel(c.phone)}">${phone}<span>${esc(c.phone)}</span></a><a href="mailto:${esc(c.email)}">${mail}<span>${esc(c.email)}</span></a></p>
      <svg class="pj-fart" viewBox="0 0 200 160" aria-hidden="true"><path d="M20 150V62l50-34 50 34v88M70 150v-46h28v46M120 150V40h60v110M132 58h12M156 58h12M132 80h12M156 80h12M132 102h12M156 102h12M8 150h184" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>
    </div>
    <div class="pj-fqs" id="questions">
      <h2 class="pj-fk" data-rv>Questions people ask before they start</h2>
      <div class="pj-faq" data-rv>${faq
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

/* ═══ below the header: "blueprint and action". Orange only on what can be pressed or is chosen ═══ */

/* the projects: a white section, a measuring-ruler seam (.pg-seam) along the top where it meets the header's page grey */
.pj-listwrap{position:relative;padding:clamp(3.8rem,9vh,6.2rem) 0 clamp(4.5rem,11vh,7rem);background:var(--theme-surface)}
/* its heading: the eyebrow and the two-tone title on the left, the line on the right, level with the title's foot */
.pj-lhead{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:1rem clamp(2rem,6vw,6rem);align-items:end}
.pj-lhl{min-width:0}
.pj-lhead .pg-h2{margin-top:.9rem;max-width:20ch}
.pj-lhead .pg-lede{margin:0;max-width:30rem}

/* the filters: three status pills (the chosen one filled orange, as a selected control) and the location list, a hairline under them */
.pj-filters{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.6rem;margin:clamp(2rem,5vh,2.8rem) 0 clamp(1.8rem,4.5vh,2.4rem);padding-bottom:clamp(1.2rem,3vh,1.6rem);border-bottom:1px solid var(--line)}
.pj-tab{display:inline-flex;align-items:center;gap:.6rem;height:3rem;padding:0 .5rem 0 1.2rem;border:0;border-radius:var(--r-pill);background:var(--card);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 18%,transparent);font:inherit;font-size:var(--fs-body);font-weight:600;color:var(--ink);white-space:nowrap;cursor:pointer;transition:background-color .2s var(--ease),color .2s var(--ease),box-shadow .2s var(--ease),transform .2s var(--ease)}
.pj-tab:hover{box-shadow:inset 0 0 0 1.5px var(--accent)}
.pj-tab:active{transform:scale(.98)}
.pj-tab[aria-pressed=true]{background:var(--act);color:var(--on-act);box-shadow:none}
.pj-tab[aria-pressed=true]:hover{background:var(--act-h)}
.pj-tab:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
/* " projects" sits a word-space from the status, not the full gap */
.pj-tw{margin-left:calc(.28em - .6rem)}
.pj-tn{display:grid;place-items:center;min-width:1.9rem;height:1.9rem;padding:0 .45rem;border-radius:var(--r-pill);background:var(--theme-bg);font-size:var(--fs-body);font-weight:600;line-height:1;color:var(--mute);font-variant-numeric:tabular-nums;transition:background-color .2s var(--ease),color .2s var(--ease)}
.pj-tab[aria-pressed=true] .pj-tn{background:color-mix(in srgb,var(--theme-white) 60%,transparent);color:var(--on-act)}
.pj-tab[data-empty] .pj-tn{opacity:.5}
.pj-town{position:relative;display:inline-flex;min-width:15rem}
.pj-town select{width:100%;height:3rem;padding:0 1rem;border:0;border-radius:var(--r-pill);background:var(--card);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 18%,transparent);font:inherit;font-size:var(--fs-body);font-weight:600;color:var(--ink)}
.pj-town .fs{width:100%}
.pj-town .fs-btn{gap:.6rem;height:3rem;min-height:0;padding:0 1.05rem 0 2.7rem;border-radius:var(--r-pill);background:var(--card);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 18%,transparent)}
.pj-town .fs-btn:hover{box-shadow:inset 0 0 0 1.5px var(--accent)}
.pj-town .fs-btn[aria-expanded=true]{box-shadow:inset 0 0 0 2px var(--accent)}
.pj-town .fs-btn .fs-n{display:none}
/* a location chosen is a selected control: an orange ring on a faint orange wash (the open list keeps the blue ring) */
.pj-filters:has(select[data-pj-town] option[value=all]:not(:checked)) .pj-town .fs-btn{background:color-mix(in srgb,var(--act) 10%,var(--card));box-shadow:inset 0 0 0 1.5px var(--act)}
.pj-filters:has(select[data-pj-town] option[value=all]:not(:checked)) .pj-town .fs-btn[aria-expanded=true]{box-shadow:inset 0 0 0 2px var(--accent)}
.pj-town::before{content:"";position:absolute;left:1.05rem;top:50%;z-index:1;width:1.05rem;height:1.05rem;margin-top:-.525rem;background:var(--mute);-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M8 14.5s-4.6-3.9-4.6-7.6a4.6 4.6 0 0 1 9.2 0c0 3.7-4.6 7.6-4.6 7.6z' fill='none' stroke='black' stroke-width='1.5'/%3E%3Ccircle cx='8' cy='6.9' r='1.6'/%3E%3C/svg%3E") center/contain no-repeat;mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M8 14.5s-4.6-3.9-4.6-7.6a4.6 4.6 0 0 1 9.2 0c0 3.7-4.6 7.6-4.6 7.6z' fill='none' stroke='black' stroke-width='1.5'/%3E%3Ccircle cx='8' cy='6.9' r='1.6'/%3E%3C/svg%3E") center/contain no-repeat;pointer-events:none}
.pj-town:has(select:not([data-fs]))::before{display:none}
/* the running count is read out, not shown */
.pj-showing{position:absolute;width:1px;height:1px;margin:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap}

/* the projects: three to a row, each a white card (.pg-card) led by its photograph. The card is not a link, so it has no
   hover of its own: its one action, the link at its foot, wakes it (a deeper shadow, the photograph zooming in, the name
   turning blue, and an orange bar growing along the card's foot) while that link is hovered or focused */
.pj-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(1.4rem,2.2vw,2rem)}
.pj-card{display:flex;min-width:0;border-radius:var(--r-card);scroll-margin-top:calc(var(--nav-bar,80px) + 1rem)}
.pj-card[hidden]{display:none}
.pj-card:target{outline:2px solid var(--accent);outline-offset:6px}
/* the card settles in (a short rise and fade) each time a filter brings it back */
.pj-cardin{position:relative;overflow:hidden;display:flex;flex-direction:column;flex:1;min-width:0;padding:.5rem;animation:pj-in .45s var(--ease) backwards}
@keyframes pj-in{from{opacity:0;transform:translateY(8px)}}
.pj-cardin::after{content:"";position:absolute;left:0;right:0;bottom:0;z-index:2;height:3px;background:var(--act);transform:scaleX(0);transform-origin:left;transition:transform .4s var(--ease);pointer-events:none}
/* no lift: the link would slide out from under the pointer and the card would flicker */
.pj-cardin:has(.pj-ask:hover,.pj-ask:focus-visible){box-shadow:inset 0 0 0 1px var(--line),var(--lift)}
.pj-cardin:has(.pj-ask:hover,.pj-ask:focus-visible)::after{transform:scaleX(1)}

/* the photograph: inset in the card, rounded, its top-right corner cut on the slant; the status sits on it in a glass pill */
.pj-media{--pj-cut:calc(var(--cut) * 1.3);position:relative;margin:0;aspect-ratio:16/10;overflow:hidden;border-radius:calc(var(--r-card) - 4px);background:var(--theme-placeholder);clip-path:polygon(0 0,calc(100% - var(--pj-cut)) 0,100% var(--pj-cut),100% 100%,0 100%)}
.pj-media img,.pj-media .pg-ph{display:block;width:100%;height:100%;object-fit:cover;border-radius:0}
.pj-media .pg-ph{clip-path:none;box-shadow:none}
.pj-media img{transition:transform .8s var(--ease)}
.pj-media::after{content:"";position:absolute;inset:55% 0 0;background:linear-gradient(to top,color-mix(in srgb,var(--theme-primary-dark) 45%,transparent),color-mix(in srgb,var(--theme-primary-dark) 0%,transparent));pointer-events:none}
.pj-cardin:has(.pj-ask:hover,.pj-ask:focus-visible) .pj-media img{transform:scale(1.05)}
.pj-stat{position:absolute;left:.75rem;bottom:.75rem;z-index:1;display:inline-flex;align-items:center;gap:.5rem;padding:.35rem .85rem;border-radius:var(--r-pill);background:color-mix(in srgb,var(--theme-primary-dark) 55%,transparent);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-white) 28%,transparent);font-size:var(--fs-body);font-weight:600;line-height:1.25;color:var(--theme-white)}
.pj-stat i{flex:none;width:7px;height:7px;border-radius:50%;background:var(--theme-success-bright);box-shadow:0 0 0 3px color-mix(in srgb,var(--theme-success-bright) 25%,transparent)}
/* ongoing: a light-blue dot that breathes (status, not an action, so never orange) */
.pj-stat[data-s=live] i{background:var(--theme-focus-on-dark);box-shadow:0 0 0 3px color-mix(in srgb,var(--theme-focus-on-dark) 25%,transparent)}
.pj-stat[data-s=plan] i{background:var(--theme-primary-soft);box-shadow:0 0 0 3px color-mix(in srgb,var(--theme-primary-soft) 25%,transparent)}
@media (prefers-reduced-motion:no-preference){.pj-stat[data-s=live] i{animation:pj-pulse 2.4s var(--ease) infinite}}
@keyframes pj-pulse{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--theme-focus-on-dark) 65%,transparent)}70%,100%{box-shadow:0 0 0 8px color-mix(in srgb,var(--theme-focus-on-dark) 0%,transparent)}}

/* the words under it: the name, then the spec list on small navy tiles, a line on it, the waterproofing, the way to ask */
.pj-body{display:flex;flex-direction:column;flex:1;padding:1.2rem .85rem .9rem}
.pj-name{margin:0;font-family:var(--display);font-weight:600;font-size:var(--fs-sub);line-height:1.2;letter-spacing:-.015em;color:var(--ink);text-wrap:balance;transition:color .3s var(--ease)}
.pj-cardin:has(.pj-ask:hover,.pj-ask:focus-visible) .pj-name{color:var(--accent)}
.pj-spec{margin:1rem 0 0;border-top:1px solid var(--line)}
.pj-spec>div{display:grid;grid-template-columns:7.25rem minmax(0,1fr);align-items:center;gap:.75rem;padding:.6rem 0;border-bottom:1px solid var(--line)}
.pj-spec dt{display:flex;align-items:center;gap:.65rem;font-size:var(--fs-body);line-height:1.3;color:var(--mute)}
.pj-spec dd{margin:0;min-width:0;font-size:var(--fs-body);font-weight:500;line-height:1.4;color:var(--ink);overflow-wrap:anywhere}
.pj-ic{display:grid;place-items:center;flex:none;width:1.75rem;height:1.75rem;border-radius:8px;background:var(--navy);color:var(--theme-on-dark)}
.pj-ic svg{display:block;width:.95rem;height:.95rem}
.pj-lead{margin:1rem 0 0;font-size:var(--fs-body);line-height:1.6;color:var(--ink2);display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
/* the waterproofing as a short build-up: its layers in blue outlined circles, joined by a thin line, in the order they go in */
.pj-wp{margin-top:1.15rem}
.pj-k{margin:0;font-size:var(--fs-body);font-weight:600;color:var(--mute)}
.pj-layers{counter-reset:pj-l;display:grid;gap:.5rem;margin:.75rem 0 0;padding:0;list-style:none;font-size:var(--fs-body);line-height:1.5rem;color:var(--ink)}
.pj-layers li{position:relative;counter-increment:pj-l;display:grid;grid-template-columns:1.5rem minmax(0,1fr);gap:.7rem;align-items:start}
.pj-layers li::before{content:counter(pj-l);display:grid;place-items:center;width:1.5rem;height:1.5rem;border-radius:50%;box-shadow:inset 0 0 0 1px var(--accent);font-size:var(--fs-body);font-weight:600;line-height:1;color:var(--accent);font-variant-numeric:tabular-nums}
.pj-layers li:not(:last-child)::after{content:"";position:absolute;left:calc(.75rem - .5px);top:1.5rem;bottom:-.5rem;width:1px;background:color-mix(in srgb,var(--accent) 35%,transparent)}
/* the way to ask (.pg-more): navy words and an outlined arrow circle; on the link's own hover or focus the circle fills orange and an orange line grows under the words */
.pj-foot{margin-top:auto;padding-top:1.25rem}
.pj-ask.pg-more{display:flex;justify-content:space-between;width:100%;padding-top:.85rem;border-top:1px solid var(--line)}
.pj-ask>span{padding-bottom:2px;background:linear-gradient(var(--act-h),var(--act-h)) left bottom/0% 1.5px no-repeat;transition:background-size .45s var(--ease)}
.pj-ask:hover>span,.pj-ask:focus-visible>span{background-size:100% 1.5px}
.pj-ask:focus-visible{outline-offset:4px;border-radius:var(--r-ctl)}
/* nothing under a filter: an empty plot drawn on a faint blueprint grid, with a way back to every location */
.pj-empty:not([hidden]){display:flex;flex-direction:column;align-items:center;gap:1.1rem;margin:0;padding:clamp(2.4rem,6vh,3.6rem) 1.5rem;border:1px dashed var(--tick);border-radius:var(--r-card);background-color:var(--theme-surface);background-image:linear-gradient(var(--bp) 1px,transparent 1px),linear-gradient(90deg,var(--bp) 1px,transparent 1px);background-size:24px 24px;text-align:center;font-size:var(--fs-body);color:var(--mute)}
.pj-empty .pj-reset{height:2.9rem}

/* start a project: a deep-blue panel (hatched along its top, a corner cut, held in place) beside the questions, numbered, one open at a time */
.pj-fsec{padding-bottom:clamp(4.5rem,11vh,7.5rem)}
.pj-fgrid{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:2.2rem clamp(2rem,5vw,5rem);align-items:start}
/* its foot keeps a strip (4.25rem) under the phone and email for the faint house drawing to stand in, clear of every link */
.pj-fhead{position:sticky;top:calc(var(--nav-room) + 1.5rem);overflow:hidden;padding:calc(clamp(1.75rem,3vw,2.5rem) + 8px) clamp(1.75rem,3vw,2.5rem) calc(clamp(1.75rem,3vw,2.5rem) + 4.25rem);clip-path:polygon(calc(var(--cut) * 1.4) 0,100% 0,100% 100%,0 100%,0 calc(var(--cut) * 1.4))}
.pj-fhead>:not(.pj-fart){position:relative;z-index:1}
.pj-fhead .pg-idx{color:color-mix(in srgb,var(--theme-on-dark) 80%,transparent)}
.pj-fhead .pg-h2{margin-top:.9rem;max-width:16ch;color:var(--theme-on-dark)}
.pj-fhead .pg-lede{margin-top:1rem;max-width:30rem;color:var(--band-mute)}
.pj-fask{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:clamp(1.5rem,3.5vh,2.1rem)}
.pj-freach{display:flex;flex-wrap:wrap;gap:.6rem 1.6rem;margin:1.5rem 0 0;padding-top:1.2rem;border-top:1px solid color-mix(in srgb,var(--theme-white) 16%,transparent);font-size:var(--fs-body)}
.pj-freach a{display:inline-flex;align-items:center;gap:.55rem;min-width:0;font-weight:600;color:var(--theme-white);text-decoration:none}
.pj-freach svg{flex:none;width:1rem;height:1rem;color:var(--theme-focus-on-dark)}
.pj-freach span{min-width:0;padding-bottom:2px;overflow-wrap:anywhere;background:linear-gradient(var(--act),var(--act)) left bottom/0% 1.5px no-repeat,linear-gradient(color-mix(in srgb,var(--theme-white) 30%,transparent),color-mix(in srgb,var(--theme-white) 30%,transparent)) left bottom/100% 1px no-repeat;transition:background-size .45s var(--ease)}
.pj-freach a:hover span,.pj-freach a:focus-visible span{background-size:100% 1.5px,100% 1px}
/* the house drawing stands on the panel's foot, in that strip, its tall block running off the right edge as in the opening's panel */
.pj-fart{position:absolute;right:-1.25rem;bottom:-.6rem;width:8rem;color:var(--theme-white);opacity:.08;pointer-events:none}
.pj-fqs{min-width:0;scroll-margin-top:calc(var(--nav-room) + 1rem)}
.pj-fk{margin:0 0 1.2rem;font-family:var(--display);font-size:var(--fs-sub);font-weight:600;line-height:1.25;letter-spacing:-.015em;color:var(--ink);text-wrap:balance}
.pj-faq{border-top:1px solid color-mix(in srgb,var(--theme-ink) 18%,transparent)}
/* each question: a hairline row; open, it turns white with a blue bar down its left, and the answer slides in */
.pj-q{position:relative;border-bottom:1px solid color-mix(in srgb,var(--theme-ink) 18%,transparent);interpolate-size:allow-keywords;transition:background-color .3s var(--ease)}
.pj-q::before{content:"";position:absolute;left:0;top:-1px;bottom:-1px;z-index:1;width:3px;background:var(--accent);transform:scaleY(0);transform-origin:top;transition:transform .3s var(--ease);pointer-events:none}
.pj-q:hover{background:color-mix(in srgb,var(--theme-surface) 55%,transparent)}
.pj-q[open]{background:var(--theme-surface)}
.pj-q[open]::before{transform:scaleY(1)}
.pj-q::details-content{height:0;overflow:clip;transition:height .4s var(--ease),content-visibility .4s allow-discrete}
.pj-q[open]::details-content{height:auto}
.pj-q summary{display:grid;grid-template-columns:2.25rem minmax(0,1fr) auto;align-items:center;gap:1rem;padding:1.15rem 1.1rem;list-style:none;cursor:pointer}
.pj-q summary::-webkit-details-marker{display:none}
.pj-q summary:focus-visible{outline:2px solid var(--accent);outline-offset:-3px;border-radius:4px}
.pj-qn{font-size:var(--fs-body);font-weight:600;font-variant-numeric:tabular-nums;color:var(--mute);transition:color .25s var(--ease)}
.pj-q h3{margin:0;font-family:var(--display);font-size:var(--fs-body);font-weight:600;line-height:1.45;color:var(--ink);transition:color .25s var(--ease)}
/* the +/x circle: outlined at rest, filled navy and turned to an x when open (a state, so never orange); an orange ring only
   while the question is hovered or focused, the moment it can be pressed */
.pj-qi{position:relative;flex:none;width:2.25rem;height:2.25rem;border-radius:50%;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 22%,transparent);transition:transform .35s var(--ease),background-color .25s var(--ease),box-shadow .25s var(--ease)}
.pj-qi::before,.pj-qi::after{content:"";position:absolute;left:50%;top:50%;width:.75rem;height:1.6px;margin:-.8px 0 0 -.375rem;background:var(--ink);transition:background-color .25s var(--ease)}
.pj-qi::after{transform:rotate(90deg)}
.pj-q summary:hover h3{color:var(--accent)}
.pj-q[open] .pj-qn{color:var(--accent)}
.pj-q[open] .pj-qi{transform:rotate(45deg);background:var(--navy);box-shadow:none}
.pj-q[open] .pj-qi::before,.pj-q[open] .pj-qi::after{background:var(--theme-on-dark)}
.pj-q summary:hover .pj-qi,.pj-q summary:focus-visible .pj-qi{box-shadow:inset 0 0 0 1.5px var(--act)}
.pj-q[open] summary:hover .pj-qi,.pj-q[open] summary:focus-visible .pj-qi{box-shadow:0 0 0 2px var(--theme-surface),0 0 0 3.5px var(--act)}
.pj-q p{margin:0;padding:0 4.35rem 1.4rem;max-width:48rem;font-size:var(--fs-body);line-height:1.7;color:var(--ink2);opacity:0;transform:translateY(-6px);transition:opacity .35s var(--ease) .05s,transform .4s var(--ease) .05s}
.pj-q[open] p{opacity:1;transform:none}
@starting-style{.pj-q[open] p{opacity:0;transform:translateY(-6px)}}
@media (prefers-reduced-motion:reduce){.pj-q::details-content,.pj-qi,.pj-media img,.pj-cardin::after{transition:none}.pj-q p{opacity:1;transform:none}.pj-cardin{animation:none}}

/* below wide screens the panel sits above the photographs, and the projects' line under their title */
@media (max-width:1023px){
  .pj-herogrid{grid-template-columns:1fr}
  .pj-mosaic{min-height:clamp(16rem,56vw,24rem)}
  .pj-lhead{grid-template-columns:1fr;align-items:start}
}
/* tablets: two to a row, the questions under the start panel; phones: one */
@media (max-width:1099px){.pj-list{grid-template-columns:repeat(2,minmax(0,1fr))}.pj-town{margin-left:0}}
@media (max-width:899px){
  .pj-fgrid{grid-template-columns:1fr}
  /* stacked, the panel drops the drawing and its strip, so the contact row ends the panel */
  .pj-fhead{position:relative;top:auto;padding-bottom:clamp(1.75rem,3vw,2.5rem)}
  .pj-fart{display:none}
}
@media (max-width:699px){.pj-list{grid-template-columns:minmax(0,1fr)}}
@media (max-width:767px){
  .pj-hero{padding-bottom:2rem}
  .pj-panel{padding:1.6rem 1.3rem 1.8rem}
  /* phones: the three pills in one row, shortened (the count as a plain number beside the word), and the location list under them */
  .pj-filters{gap:.45rem}
  .pj-tab{flex:1 1 auto;justify-content:center;gap:.4rem;height:2.9rem;padding:0 .5rem}
  .pj-tw{display:none}
  .pj-tn,.pj-tab[aria-pressed=true] .pj-tn{min-width:0;height:auto;padding:0;background:none}
  .pj-town{flex:1 1 100%;min-width:0;margin-left:0}
  .pj-fask .pg-btn{flex:1 1 auto}
  .pj-q summary{grid-template-columns:1.75rem minmax(0,1fr) auto;gap:.75rem;padding:1.05rem .85rem}
  .pj-q p{padding:0 .85rem 1.2rem 3.35rem}
}
`;
