/**
 * Projects page: a compact opening with the title, a line on what we build,
 * and chips that narrow the projects by status and by town; then each project
 * in words alone (no photographs or drawings): its type and status, name and
 * place, the waterproofing built into it in the order it goes in, what it is,
 * the story of its waterproofing, its structure and materials, and a way to
 * ask about something similar. /projects#slug lands on that project (the home
 * page links so).
 */
import { arrow, esc, mark, words, type ContactInfo, type PageOptions } from "./kit";
import { SEARCH_BAR_CSS, searchBar } from "./search-bar";
import { PLACES, METHODS } from "../methods/data";

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
}

export const PROJECTS_TRAIL = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
] as const;

const town = (location: string) => location.split(",").pop()?.trim() ?? location;
const dot = (s: string) => (s === "Completed" ? "done" : s === "Under construction" ? "live" : "plan");
const STATUS_ORDER = ["Completed", "Under construction", "In design"];
/** "HDPE membrane under the raft · DPC · …" → its layers, in the order they go in */
const layersOf = (p: ProjectData) =>
  (p.waterproofing ?? "")
    .split("·")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => x.charAt(0).toUpperCase() + x.slice(1));

const pin = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14.5s-4.6-3.9-4.6-7.6a4.6 4.6 0 0 1 9.2 0c0 3.7-4.6 7.6-4.6 7.6z" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="8" cy="6.9" r="1.6" fill="currentColor"/></svg>`;

/** one project as a simple card: where it stands, its name and town, a line on it, and the waterproofing built in */
function row(p: ProjectData) {
  const layers = layersOf(p);
  const text = [p.name, p.location, p.type, p.status, p.summary, p.waterproofing ?? "", p.materials ?? ""].join(" ").toLowerCase();
  return `<article class="pj-row" id="${esc(p.slug)}" data-town="${esc(town(p.location))}" data-status="${esc(p.status)}" data-text="${esc(text)}" aria-labelledby="pj-${esc(p.slug)}">
  ${p.image ? `<figure class="pj-pic"><img src="${esc(p.image)}" width="1376" height="768" alt="${esc(`${p.name}, ${p.location}`)}" loading="lazy" decoding="async"></figure>` : ""}
  <p class="pj-top"><span class="pj-stat" data-s="${dot(p.status)}"><i class="pj-st" data-s="${dot(p.status)}"></i>${esc(p.status)}</span><span class="pj-type">${esc(p.type)}</span></p>
  <h2 class="pj-name" id="pj-${esc(p.slug)}">${esc(p.name)}</h2>
  <p class="pj-loc">${pin}${esc(p.location)}</p>
  <p class="pj-lead">${esc(p.summary)}</p>
  ${layers.length ? `<div class="pj-wp"><p class="pj-k">Waterproofing built in</p><ul class="pj-chips">${layers.map((l) => `<li>${esc(l)}</li>`).join("")}</ul></div>` : ""}
</article>`;
}

/**
 * The applications as one aerial view of a town like ours (a picture made
 * with Google's Flow, its mark left in its corner): each kind of building is
 * a numbered point on it. Pick one and the box beside it zooms into that
 * building and shows our project of that kind, or, for the water tank, the
 * methods for tanks and sumps.
 */
const SCENE = "/images/projects/applications-scene.webp";
const SPOTS: readonly { key: string; label: string; x: number; y: number; slug?: string }[] = [
  { key: "homes", label: "Homes and apartments", x: 12.7, y: 52, slug: "kaveri-residences" },
  { key: "villas", label: "Villas", x: 36, y: 55, slug: "thindal-courtyard-villa" },
  { key: "offices", label: "Offices", x: 57.4, y: 41, slug: "avinashi-corporate-centre" },
  { key: "mixed", label: "Shops with flats above", x: 67.2, y: 25, slug: "anna-nagar-mixed-use" },
  { key: "factories", label: "Factories", x: 86, y: 47, slug: "sipcot-textile-processing-unit" },
  { key: "tanks", label: "Water tanks and sumps", x: 74.5, y: 73 },
];
/** how far the box beside the view zooms in */
const ZOOM = 3;
const bgPos = (v: number) => Math.min(100, Math.max(0, ((v / 100) * ZOOM - 0.5) / (ZOOM - 1) * 100)).toFixed(1);

function sceneMarkup(ps: readonly ProjectData[]) {
  const tank = PLACES.find((pl) => pl.key === "tank");
  const tankMethods = (tank?.methods ?? []).map((n) => METHODS.find((m) => m.no === n)?.short).filter(Boolean) as string[];
  const TICK = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const step = (i: number) =>
    `<span class="pjs-step"><button type="button" data-step="-1" aria-label="Previous building">‹</button><span>${i + 1} / ${SPOTS.length}</span><button type="button" data-step="1" aria-label="Next building">›</button></span>`;
  const panel = (sp: (typeof SPOTS)[number], i: number) => {
    const pr = sp.slug ? ps.find((p) => p.slug === sp.slug) : undefined;
    const zoom = `<div class="pjs-zoom" style="background-position:${bgPos(sp.x)}% ${bgPos(sp.y)}%" role="img" aria-label="${esc(`A closer look at the ${sp.label.toLowerCase()} in the view`)}"><span class="pjs-zl"><b>${i + 1}</b>${esc(sp.label)}</span>${pr ? `<span class="pjs-zs pj-stat" data-s="${dot(pr.status)}"><i class="pj-st"></i>${esc(pr.status)}</span>` : ""}</div>`;
    const ticks = (xs: readonly string[]) => `<ul class="pjs-ticks">${xs.map((l) => `<li>${TICK}<span>${esc(l)}</span></li>`).join("")}</ul>`;
    const body = pr
      ? `<h3 class="pjs-name">${esc(pr.name)}</h3>
        <p class="pjs-loc">${pin}${esc(pr.location)}</p>
        <p class="pjs-lead">${esc(pr.summary)}</p>
        ${layersOf(pr).length ? `<div class="pjs-wp"><p class="pjs-wk">Waterproofing built in</p>${ticks(layersOf(pr))}</div>` : ""}
        <div class="pjs-foot">${step(i)}</div>`
      : `<h3 class="pjs-name">Overhead tanks and underground sumps</h3>
        <p class="pjs-lead">Sealed so the water stays clean and stays in.</p>
        <div class="pjs-wp"><p class="pjs-wk">Methods our guide names for them</p>${ticks(tankMethods)}</div>
        <div class="pjs-foot"><a class="pg-btn pg-btn--ink" href="/waterproofing#a-tank" data-internal>Tank waterproofing${arrow}</a>${step(i)}</div>`;
    return `<div class="pjs-panel" data-spot-panel="${sp.key}"${i === 0 ? "" : " hidden"}>${zoom}<div class="pjs-body">${body}</div></div>`;
  };
  return `<header class="pjs" aria-labelledby="pjs-h">
  <div class="pg-wrap">
    <div class="pjs-head">${mark("01", "Building types")}<h1 class="pj-h1" id="pjs-h" data-rv="words">${words("From homes to factories, kept&nbsp;dry.")}</h1></div>
    <div class="pjs-grid" style="--scene:url('${SCENE}')">
      <figure class="pjs-scene">
        <img src="${SCENE}" width="1376" height="768" alt="An aerial view of a town near Erode after rain: an apartment block, a villa, an office tower, shops with flats above, a textile factory and a water tank" loading="lazy" decoding="async">
        ${SPOTS.map((sp, i) => `<button type="button" class="pjs-spot" data-spot="${sp.key}" style="left:${sp.x}%;top:${sp.y}%" aria-pressed="${i === 0}" aria-label="${esc(sp.label)}"><span class="pjs-n">${i + 1}</span><span class="pjs-tag">${esc(sp.label)}</span></button>`).join("")}
      </figure>
      <div class="pjs-side">${SPOTS.map(panel).join("")}</div>
    </div>
  </div>
</header>`;
}


export function projectsPageMarkup(d: ProjectsData, o: PageOptions = {}) {
  void o;
  const ps = d.projects;
  const count = (f: (p: ProjectData) => boolean) => ps.filter(f).length;
  const statuses = [...new Set(ps.map((p) => p.status))].sort((a, b) => STATUS_ORDER.indexOf(a) - STATUS_ORDER.indexOf(b));
  const towns = [...new Set(ps.map((p) => town(p.location)))];
  const bar = searchBar({
    label: "Search projects",
    placeholder: "Search projects",
    cls: "pj-bar",
    hidden: true,
    filters: [
      { key: "status", label: "Status", options: [{ value: "all", text: `All statuses (${ps.length})` }, ...statuses.map((st) => ({ value: st, text: `${st} (${count((p) => p.status === st)})` }))] },
      { key: "town", label: "Town", options: [{ value: "all", text: `All towns (${ps.length})` }, ...towns.map((t) => ({ value: t, text: `${t} (${count((p) => town(p.location) === t)})` }))] },
    ],
  });
  return `${sceneMarkup(ps)}
<section class="pj-hero" aria-labelledby="pj-h">
  <div class="pg-wrap">
    <div class="pj-herogrid">
      <div>${mark("02", "Projects")}<h2 class="pj-h1" id="pj-h" data-rv="words">${words("Projects built to stay&nbsp;dry.")}</h2></div>
      <div class="pj-heroside">
        ${bar}
        <p class="pj-showing" aria-live="polite">Showing all ${ps.length} projects</p>
      </div>
    </div>
  </div>
</section>
<section class="pj-listwrap" aria-label="Projects">
  <div class="pg-wrap">
    <div class="pj-list" id="project-list">${ps.map(row).join("\n")}</div>
    <p class="pj-empty" hidden>No projects match your search. <button type="button" data-reset>Show all projects</button></p>
  </div>
</section>`;
}

export const PROJECTS_CSS = SEARCH_BAR_CSS + `
/* applications: the aerial view with numbered buildings, and the box that zooms into the one picked */
.pjs{padding:calc(var(--nav-room) + clamp(2rem,6vh,3.8rem)) 0 0}
.pjs-head{margin-bottom:clamp(1.1rem,2.6vh,1.6rem)}
.pjs-head .pg-mark{margin-bottom:.9rem}
/* the opening band: the same shaded photograph as every page's opening, behind the title; the view of the town rises over its foot */
.pjs{position:relative;isolation:isolate;overflow-x:clip;padding-top:0 !important}
.pjs-head{position:relative;display:flex;flex-direction:column;justify-content:flex-end;min-height:var(--head-h);box-sizing:border-box;padding:var(--nav-room) 0 var(--head-pb);margin-bottom:clamp(1.4rem,3.2vh,2.2rem) !important}
.pjs-head::before{content:"";position:absolute;z-index:-1;left:50%;width:100vw;margin-left:-50vw;top:0;bottom:0;background:linear-gradient(90deg,rgba(7,20,44,.9) 0%,rgba(7,20,44,.72) 50%,rgba(7,20,44,.45) 100%),linear-gradient(180deg,rgba(7,20,44,.55),rgba(7,20,44,0) 35%),url("/images/hero-final.jpg") center 42%/cover no-repeat #0b2350}
.pjs-head .pg-mark{color:rgba(245,240,230,.78)}
.pjs-head .pg-idx{color:#9fbbe6}
.pjs-head .pj-h1{color:#fff;text-shadow:0 2px 20px rgba(0,0,0,.25)}
.pjs-grid{display:grid;grid-template-columns:minmax(0,1.75fr) minmax(0,1fr);gap:.9rem;align-items:stretch}
.pjs-scene{position:relative;margin:0;aspect-ratio:1376/768;overflow:hidden;border-radius:18px;background:#20303f;box-shadow:0 30px 60px -40px rgba(18,34,59,.55)}
.pjs-scene img{display:block;width:100%;height:100%;object-fit:cover}
.pjs-spot{position:absolute;z-index:1;display:flex;align-items:center;gap:.45rem;margin:-1rem 0 0 -1rem;padding:0;border:0;background:none;font:inherit;cursor:pointer}
.pjs-n{position:relative;display:grid;place-items:center;width:2rem;height:2rem;border-radius:50%;background:#f5f0e6;color:var(--navy);font-size:var(--fs-body);font-weight:700;box-shadow:0 6px 16px -4px rgba(4,12,30,.6);transition:background-color .2s,color .2s,transform .2s}
.pjs-n::after{content:"";position:absolute;inset:-5px;border-radius:50%;border:2px solid rgba(245,240,230,.85);opacity:0;animation:pjs-ring 2.6s ease-out infinite}
@keyframes pjs-ring{0%{opacity:.9;transform:scale(.8)}100%{opacity:0;transform:scale(1.5)}}
.pjs-tag{padding:.3rem .6rem;border-radius:999px;background:rgba(11,22,38,.72);color:#fff;font-size:var(--fs-body);font-weight:600;white-space:nowrap;backdrop-filter:blur(6px);opacity:0;transform:translateX(-4px);transition:opacity .2s,transform .2s;pointer-events:none}
.pjs-spot:hover .pjs-tag,.pjs-spot:focus-visible .pjs-tag,.pjs-spot[aria-pressed=true] .pjs-tag{opacity:1;transform:none}
.pjs-spot:hover .pjs-n{transform:scale(1.08)}
.pjs-spot[aria-pressed=true] .pjs-n{background:var(--navy);color:#fff}
.pjs-spot:focus-visible{outline:none}
.pjs-spot:focus-visible .pjs-n{outline:3px solid #f2c14e;outline-offset:2px}
/* the factory and the tank sit on the right, so their names open to the left */
.pjs-spot[data-spot=factories],.pjs-spot[data-spot=tanks]{flex-direction:row-reverse;margin-left:auto;transform:translateX(-100%) translateX(2rem)}
.pjs-scene{align-self:start}
.pjs-side{position:relative;min-height:0}
.pjs-panel{position:absolute;inset:0;display:flex;flex-direction:column;overflow:hidden;border-radius:18px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line)}
.pjs-panel[hidden]{display:none}
.pjs-zoom{flex:1 1 auto;min-height:5rem;background-image:var(--scene);background-size:${ZOOM * 100}% auto;background-repeat:no-repeat;animation:pjs-in .5s cubic-bezier(.2,.7,.2,1)}
@keyframes pjs-in{from{background-size:100% auto;opacity:.6}}
.pjs-zoom{position:relative}
.pjs-zoom::after{content:"";position:absolute;inset:auto 0 0;height:55%;background:linear-gradient(0deg,rgba(11,22,38,.6),rgba(11,22,38,0));pointer-events:none}
.pjs-zl{position:absolute;left:.8rem;bottom:.75rem;z-index:1;display:inline-flex;align-items:center;gap:.5rem;font-size:var(--fs-body);font-weight:600;color:#fff}
.pjs-zl b{display:grid;place-items:center;width:1.7rem;height:1.7rem;border-radius:50%;background:#f5f0e6;color:var(--navy);font-weight:700}
.pjs-zoom .pjs-zs{position:absolute;right:.7rem;top:.7rem;z-index:1;height:1.7rem;padding:0 .65rem;background:#e3f1e8;box-shadow:0 4px 12px -4px rgba(4,12,30,.5)}
.pjs-zoom .pjs-zs[data-s=live]{background:#fbefd6}.pjs-zoom .pjs-zs[data-s=plan]{background:#e2e9f5}
.pjs-body{display:flex;flex-direction:column;gap:.3rem;min-height:0;padding:1rem 1.2rem 1rem}
.pjs-name{margin:0;font-size:var(--fs-sub);font-weight:600;line-height:1.2;letter-spacing:-.01em;color:var(--ink)}
.pjs-loc{display:flex;align-items:center;gap:.35rem;margin:0;font-size:var(--fs-body);color:var(--mute)}
.pjs-loc svg{flex:none;width:1rem;height:1rem}
.pjs-lead{margin:.25rem 0 0;font-size:var(--fs-body);line-height:1.5;color:var(--ink2)}
.pjs-wp{margin-top:.55rem;padding-top:.6rem;border-top:1px solid var(--line)}
.pjs-wk{margin:0 0 .35rem;font-size:var(--fs-body);font-weight:600;color:var(--accent)}
.pjs-ticks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.3rem .9rem;margin:0;padding:0;list-style:none}
.pjs-ticks li{display:flex;gap:.4rem;font-size:var(--fs-body);line-height:1.35;color:var(--ink)}
.pjs-ticks svg{flex:none;width:1rem;height:1rem;margin-top:.1rem;color:var(--water)}
.pjs-foot{display:flex;align-items:center;justify-content:space-between;gap:.8rem;margin-top:auto;padding-top:.8rem}
.pjs-foot .pg-btn{height:2.6rem;padding:0 1rem}
.pjs-step{display:inline-flex;align-items:center;gap:.35rem;font-size:var(--fs-body);font-variant-numeric:tabular-nums;color:var(--mute)}
.pjs-step button{display:grid;place-items:center;width:2.2rem;height:2.2rem;border:0;border-radius:50%;background:rgba(18,34,59,.06);font:inherit;font-size:1.2rem;line-height:1;color:var(--ink);cursor:pointer;transition:background-color .2s}
.pjs-step button:hover{background:rgba(18,34,59,.12)}
.pjs-step button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){.pjs-n::after,.pjs-zoom{animation:none}}
@media (max-width:1023px){
  .pjs-grid{grid-template-columns:minmax(0,1fr)}
  .pjs-panel{position:static}
  .pjs-zoom{display:none}
}
@media (max-width:599px){.pjs-tag{display:none}.pjs-n{width:1.7rem;height:1.7rem}.pjs-spot{margin:-.85rem 0 0 -.85rem}}
/* each project card opens with its photo, whole, at its own proportions */
.pj-pic{margin:-1.3rem -1.35rem 1rem;aspect-ratio:1376/768;overflow:hidden;border-radius:18px 18px 0 0;background:#d9d0bf}
.pj-pic img{display:block;width:100%;height:100%;object-fit:cover}
.pj-row.pj-next{justify-content:center;gap:.6rem;padding-bottom:1.35rem;background:var(--navy);box-shadow:none}
.pj-row.pj-next .pj-type{color:rgba(245,240,230,.7)}
.pj-row.pj-next .pj-name{color:#fff}
.pj-row.pj-next .pj-lead{display:block;-webkit-line-clamp:unset;overflow:visible;color:rgba(245,240,230,.82)}
.pj-row.pj-next .pg-btn{align-self:flex-start;margin-top:.6rem;background:#f5f0e6;color:var(--navy)}
@media (max-width:699px){.pj-pic{margin:-1.2rem -1.1rem 1rem}}
/* the opening: the title, and beside it a line on what we build and the choices */
.pj-hero{padding:clamp(3rem,8vh,5rem) 0 clamp(1.6rem,4vh,2.6rem)}
.pj-herogrid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:1.8rem clamp(2rem,5vw,6rem);align-items:end}
.pj-herogrid .pg-mark{margin-bottom:.9rem}
.pj-h1{margin:0;font-family:var(--display);font-weight:600;font-size:var(--fs-title);line-height:1.12;letter-spacing:-.02em;text-wrap:balance}
.pj-heroside{display:flex;flex-direction:column;gap:1.5rem;min-width:0;padding-bottom:.45rem}
.pj-heroside .pg-intro{margin:0}

/* the search bar, shown once scripts run */
.pj-heroside{align-self:end}
.pj-bar{max-width:42rem;margin-left:auto}
/* the running count is read out, not shown */
.pj-showing{position:absolute;width:1px;height:1px;margin:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap}

/* the projects as cards, three to a row */
.pj-listwrap{padding:clamp(.4rem,1.6vh,1rem) 0 clamp(4.5rem,12vh,7.5rem)}
/* the cards: plain and even, three to a row */
.pj-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:stretch;gap:clamp(.9rem,1.5vw,1.2rem)}
.pj-row{display:flex;flex-direction:column;padding:1.3rem 1.35rem 1.4rem;border-radius:18px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);scroll-margin-top:calc(var(--nav-bar,80px) + 1rem);transition:box-shadow .3s,transform .3s}
.pj-row:hover{box-shadow:inset 0 0 0 1px rgba(18,34,59,.28),0 24px 44px -34px rgba(18,34,59,.55);transform:translateY(-2px)}
.pj-row[hidden]{display:none}
.pj-row:target{box-shadow:inset 0 0 0 2px var(--accent),0 0 0 6px rgba(39,86,160,.1)}
.pj-top{display:flex;align-items:center;justify-content:space-between;gap:.6rem;margin:0}
.pj-stat{display:inline-flex;align-items:center;gap:.45rem;height:1.9rem;padding:0 .75rem;border-radius:999px;background:rgba(47,158,107,.12);font-size:var(--fs-body);font-weight:600;color:#1f7a4f}
.pj-stat[data-s=live]{background:rgba(232,162,21,.16);color:#9a6408}
.pj-stat[data-s=plan]{background:rgba(39,86,160,.12);color:var(--accent)}
.pj-st{flex:none;width:7px;height:7px;border-radius:50%;background:currentColor}
.pj-type{font-size:var(--fs-body);color:var(--mute)}
.pj-name{margin:1rem 0 0;font-family:var(--display);font-weight:600;font-size:var(--fs-sub);line-height:1.15;letter-spacing:-.015em;color:var(--ink);text-wrap:balance}
.pj-loc{display:flex;align-items:center;gap:.35rem;margin:.35rem 0 0;font-size:var(--fs-body);color:var(--mute)}
.pj-loc svg{flex:none;width:.95rem;height:.95rem}
.pj-lead{margin:.8rem 0 1.2rem;font-size:var(--fs-body);line-height:1.55;color:var(--ink2);display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
.pj-wp{margin-top:-.2rem}
.pj-k{margin:0 0 .45rem;font-size:var(--fs-body);font-weight:600;color:var(--ink)}
.pj-chips{display:flex;flex-wrap:wrap;gap:.35rem;margin:0;padding:0;list-style:none}
.pj-chips li{padding:.25rem .65rem;border-radius:8px;background:rgba(18,34,59,.06);font-size:var(--fs-body);line-height:1.4;color:var(--ink)}
.pj-wp{margin-bottom:1.2rem}
.pj-empty{margin:0;padding:3rem 0;text-align:center;font-size:var(--fs-body);color:var(--mute)}
.pj-empty button{border:0;border-bottom:1px solid currentColor;background:none;padding:0 0 2px;font:600 var(--fs-body) var(--sans);color:var(--ink);cursor:pointer}

/* below wide screens the title sits above the line and the choices */
@media (max-width:1199px){
  .pj-herogrid{grid-template-columns:1fr;align-items:start;gap:1.4rem}
  .pj-heroside{gap:1.3rem}
  .pj-heroside .pg-intro{max-width:40rem}
}
/* tablets: two to a row; phones: one */
@media (max-width:1099px){.pj-list{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:699px){.pj-list{grid-template-columns:minmax(0,1fr)}}
@media (max-width:767px){
  .pj-bar{max-width:none}
  .pj-hero{padding:2.4rem 0 1.4rem}
  .pj-row{padding:1.2rem 1.1rem 1.2rem}
}
`;
