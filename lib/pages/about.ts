/**
 * About page, kept short: who RPC is, the vision and the mission, the six
 * values, where we work, and the close. Every heading is written around what
 * people search for (waterproofing and construction in Erode, Coimbatore and
 * Tamil Nadu), and every fact comes from lib/content.ts.
 *
 * The one photograph's place is an empty frame, ready for RPC's own picture.
 */
import { esc, mark, ph, two, words, type ContactInfo } from "./kit";

export interface AboutData {
  story: readonly string[];
  /** RPC's two partners; a photo is shown when `image` is set, otherwise its empty frame */
  partners: readonly { name: string; role: string; qualification: string; bio: string; image: string }[];
  vision: string;
  mission: readonly string[];
  principles: readonly { title: string; body: string }[];
  services: readonly { title: string; line?: string }[];
  contact: ContactInfo;
  founded: string;
}

export const ABOUT_TRAIL = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
] as const;

/** a simple drawn mark for each value */
const MARKS: Record<string, string> = {
  Honesty: `<path d="M12 3.2 19 6v5.2c0 4.3-2.9 8-7 9.6-4.1-1.6-7-5.3-7-9.6V6z"/><path d="m8.8 12.1 2.2 2.2 4.3-4.6"/>`,
  Engineering: `<path d="M4 20 20 4v16z"/><path d="M9 20v-2M12 20v-3M15 20v-2M16.5 13.5h-3v3"/>`,
  Craftsmanship: `<rect x="2.5" y="8.5" width="19" height="7" rx="2"/><circle cx="12" cy="12" r="1.8"/><path d="M8.5 8.5v7M15.5 8.5v7"/>`,
  Materials: `<path d="M5.5 8h13l-1.3 11.1a1.8 1.8 0 0 1-1.8 1.6H8.6a1.8 1.8 0 0 1-1.8-1.6z"/><path d="M8.5 8a3.5 3.5 0 0 1 7 0"/><path d="M9 13h6"/>`,
  Respect: `<path d="M3.5 11.2 12 4l8.5 7.2"/><path d="M6 9.4V20h12V9.4"/><path d="M12 11.6c-1.7 2.1-2.5 3.3-2.5 4.3a2.5 2.5 0 0 0 5 0c0-1-.8-2.2-2.5-4.3z"/>`,
  Timing: `<circle cx="12" cy="13" r="7.6"/><path d="M12 9v4.4l2.8 1.8M9.5 2.8h5M12 2.8v2.6"/>`,
};
const markOf = (t: string) =>
  `<svg class="ab-mk" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${MARKS[t] ?? MARKS.Honesty!}</svg>`;


/** one drawn mark for each mission promise, in order: the price, the date, safety, the team */
const ic = (body: string) =>
  `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
const MISSION_ICONS = [
  ic(`<path d="M6 3h9l3 3v15H6z"/><path d="M15 3v3h3"/><path d="M9.5 9h5M9.5 11.5h5M11 9c2.6 0 2.6 4.5 0 4.5H9.5l4 3.5"/>`),
  ic(`<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/><path d="m9 14.6 2 2 4-4.2"/>`),
  ic(`<path d="M4 16.5a8 8 0 0 1 16 0"/><path d="M12 8.5V5.5M9.5 9l-1-2.6M14.5 9l1-2.6"/><path d="M2.5 16.5h19v2.5h-19z"/>`),
  ic(`<circle cx="9" cy="8" r="3"/><path d="M3.5 19.5c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5"/><path d="M15.5 11.5 18 9l2.5 2.5M18 9v6.5"/>`),
];

export function aboutMarkup(d: AboutData) {
  const head = `<header class="pg-head ab-head">
  <div class="pg-wrap">
    <div class="ab-headgrid">
      <div class="ab-headcopy">
        ${mark("01", "About RPC Constructions")}
        <h1 class="pg-h1" data-rv="words">${words("Waterproofing and construction in Erode since&nbsp;2012.")}</h1>
        <p class="pg-intro" data-rv>We keep buildings dry. RPC Constructions repairs leaks in buildings already standing and builds new homes, offices and factories with their waterproofing designed in, from our office on Perundurai Road, Erode.</p>
      </div>
    </div>
  </div>
</header>`;

  const partner = (p: AboutData["partners"][number], i: number) => `<article class="ab-pt${i % 2 ? " ab-pt--flip" : ""}" aria-label="${esc(p.name)}, ${esc(p.role)}">
      <div class="ab-ptph" data-rv>${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}, ${esc(p.role)} at RPC Constructions" loading="lazy" decoding="async">` : ph({ ratio: "4/5", label: `Photo: ${p.name}` })}</div>
      <div class="ab-ptcopy" data-rv>
        <p class="ab-ptrole">${esc(p.role)}</p>
        <h3 class="ab-ptname">${esc(p.name)}</h3>
        <p class="ab-ptq">${esc(p.qualification)}</p>
        <p class="ab-p">${esc(p.bio)}</p>
      </div>
    </article>`;

  const who = `<section class="pg-sec ab-who" aria-labelledby="ab-who-h">
  <div class="pg-wrap">
    <div class="ab-whohead">
      <div>
        ${mark("02", "Who we are")}
        <h2 class="pg-h2" id="ab-who-h" data-rv>An engineer‑led waterproofing company that also builds.</h2>
      </div>
      <div class="ab-whotext">${d.story.map((p, i) => `<p class="${i === 0 ? "ab-lead" : "ab-p"}" data-rv>${esc(p)}</p>`).join("")}</div>
    </div>
    <div class="ab-pts">${d.partners.map(partner).join("")}</div>
  </div>
</section>`;

  const vm = `<section class="pg-sec pg-sec--sky ab-vm" aria-label="Vision and mission">
  <div class="pg-wrap">
    <article class="ab-vision" aria-labelledby="ab-vision-h" data-rv>
      <h2 class="ab-vh" id="ab-vision-h">Our vision</h2>
      <p class="ab-vtext">${esc(d.vision)}</p>
    </article>
    <article class="ab-mission" aria-labelledby="ab-mission-h">
      <h2 class="ab-vh ab-vh--rule" id="ab-mission-h" data-rv><span>Our mission</span></h2>
      <ul data-rv-stagger="80">${d.mission.map((m, i) => `<li data-rv><span class="ab-mic">${MISSION_ICONS[i % MISSION_ICONS.length]}</span><span>${esc(m)}</span></li>`).join("")}</ul>
    </article>
  </div>
</section>`;

  const values = `<section class="pg-sec ab-values" aria-labelledby="ab-values-h">
  <div class="pg-wrap">
    <div class="ab-vhead">
      ${mark("03", "Our values")}
      <h2 class="pg-h2" id="ab-values-h" data-rv>Six values on every site.</h2>
    </div>
    <ul class="ab-vlist" data-rv-stagger="70">${d.principles
      .map((p, i) => `<li data-rv style="--d:${i * 50}ms"><span class="ab-vno">${two(i + 1)}</span><div><h3 class="pg-h3">${esc(p.title)}</h3><p>${esc(p.body)}</p></div></li>`)
      .join("")}</ul>
  </div>
</section>`;

  return `${head}\n${who}\n${vm}\n${values}`;
}

export const ABOUT_CSS = `
/* the opening: the h1 and its intro */
.ab-headcopy .pg-mark{margin-bottom:.9rem}

/* who we are: the story beside the heading, then the two partners, the second the other way round */
.ab-whohead{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:1.2rem clamp(2rem,5vw,6rem);align-items:end}
.ab-whohead .pg-h2{margin-top:.7rem}
.ab-whotext .ab-lead{margin-top:0}
.ab-lead{margin:1.4rem 0 0;max-width:40rem;font-size:var(--fs-body);line-height:1.65;color:var(--ink)}
.ab-p{margin:1rem 0 0;max-width:40rem;font-size:var(--fs-body);line-height:1.7;color:var(--ink2)}
.ab-pts{display:grid;gap:clamp(2.5rem,7vh,4.5rem);margin-top:clamp(2.6rem,7vh,4.5rem)}
.ab-pt{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:1.6rem clamp(2rem,6vw,6rem);align-items:center}
.ab-pt--flip{grid-template-columns:minmax(0,7fr) minmax(0,5fr)}
.ab-pt--flip .ab-ptph{order:2}
.ab-pt--flip .ab-ptcopy{order:1;justify-self:end}
.ab-ptph{width:100%;max-width:26rem}
.ab-pt--flip .ab-ptph{justify-self:end}
.ab-ptph img{display:block;width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:8px}
.ab-ptcopy{max-width:36rem;padding-left:1.4rem;border-left:2px solid var(--accent)}
.ab-ptrole{margin:0;font-size:var(--fs-body);font-weight:600;color:var(--accent)}
.ab-ptname{margin:.4rem 0 0;font-family:var(--display);font-size:var(--fs-sub);font-weight:600;line-height:1.25;letter-spacing:-.015em;color:var(--ink)}
.ab-ptq{margin:.3rem 0 0;font-size:var(--fs-body);color:var(--mute)}
.ab-ptcopy .ab-p{margin-top:1rem}

/* vision and mission: the vision large in the middle, the four promises under it, each with its mark */
.ab-vm{text-align:center}
.ab-vision{max-width:62rem;margin:0 auto}
.ab-vh{margin:0;font-size:var(--fs-body);font-weight:600;color:var(--accent)}
.ab-vtext{margin:1rem auto 0;max-width:24ch;font-family:var(--display);font-weight:600;font-size:var(--fs-title);line-height:1.15;letter-spacing:-.02em;color:var(--ink);text-wrap:balance}
.ab-mission{margin-top:clamp(2.8rem,8vh,4.5rem)}
.ab-vh--rule{display:flex;align-items:center;gap:1.2rem;max-width:40rem;margin:0 auto}
.ab-vh--rule::before,.ab-vh--rule::after{content:"";flex:1;height:1px;background:rgba(39,86,160,.28)}
.ab-mission ul{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:2rem clamp(1.2rem,3vw,3rem);margin:clamp(1.8rem,4vh,2.6rem) 0 0;padding:0;list-style:none}
.ab-mission li{display:flex;flex-direction:column;align-items:center;gap:1rem;font-size:var(--fs-body);line-height:1.55;color:var(--ink);text-wrap:pretty}
.ab-mic{display:grid;place-items:center;width:4rem;height:4rem;border-radius:50%;background:var(--navy);color:#f5f0e6;box-shadow:0 0 0 6px rgba(11,35,80,.08);transition:transform .3s}
.ab-mission li:hover .ab-mic{transform:translateY(-3px)}
.ab-mic svg{width:1.7rem;height:1.7rem}
@media (prefers-reduced-motion:reduce){.ab-mic{transition:none}.ab-mission li:hover .ab-mic{transform:none}}

/* values */
.ab-vhead{margin-bottom:clamp(1.8rem,4vh,2.6rem)}
.ab-vhead .pg-h2{margin-top:.7rem}
.ab-vlist{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0 clamp(1.4rem,3vw,3rem);margin:0;padding:0;list-style:none}
.ab-vlist li{display:grid;grid-template-columns:2rem 1fr;align-content:start;column-gap:.2rem;padding:1.3rem 0;border-top:1px solid var(--line)}
.ab-vno{grid-row:1/3;padding-top:.12rem;font-size:var(--fs-body);font-weight:600;font-variant-numeric:tabular-nums;color:var(--accent)}
.ab-vlist p{margin:.4rem 0 0;font-size:var(--fs-body);line-height:1.6;color:var(--ink2)}

/* where we work: the office as a dark card, the towns as cards with a compass each */
.ab-wgrid{display:block;max-width:52rem}
.ab-wgrid .pg-h2{margin-top:.7rem}
.ab-wgrid .ab-p{margin:0}
.ab-where{padding:clamp(1.6rem,3.5vh,2.6rem) 0}
.ab-whead{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:.8rem 3rem;align-items:end}
.ab-whead .pg-h2{margin-top:.6rem;max-width:16ch;text-wrap:balance}
.ab-wlede{margin:0;max-width:34rem;font-size:var(--fs-body);line-height:1.6;color:var(--ink2)}
@media (max-width:899px){.ab-whead{grid-template-columns:minmax(0,1fr)}}
.ab-wgrid{display:block;max-width:52rem}
.ab-wgrid .pg-h2{margin-top:.4rem}
.ab-reach2{display:grid;grid-template-columns:minmax(0,1.02fr) minmax(0,1.18fr);gap:1.2rem clamp(1.2rem,2.5vw,2rem);align-items:stretch;margin-top:clamp(1.2rem,2.5vh,2rem)}
.ab-radar-panel{display:flex;flex-direction:column;border-radius:14px;background:#0c1b33;box-shadow:0 16px 36px -16px rgba(11,35,80,.45),inset 0 0 0 1px rgba(255,255,255,.08);overflow:hidden}
.ab-radar-canvas-wrap{position:relative;width:100%;flex:1;display:flex;align-items:center}
.ab-radar{display:block;width:100%;height:auto}
.ab-r-ring{fill:none;stroke:rgba(56,189,248,.2);stroke-dasharray:3 4}
.ab-r-ring--outer{stroke:rgba(56,189,248,.35);stroke-dasharray:5 6}
.ab-r-cross{stroke:rgba(245,240,230,.06);stroke-width:1}
.ab-r-tag{font-family:var(--sans);font-size:8px;font-weight:700;letter-spacing:.08em;fill:rgba(56,189,248,.7)}
.ab-r-ray{stroke:#38bdf8;stroke-width:1.5;stroke-dasharray:4 4;animation:ab-r-dash 1.8s linear infinite}
.ab-r-ray--chennai{stroke:#f59e0b}
@keyframes ab-r-dash{to{stroke-dashoffset:-24}}
.ab-r-pulse{fill:none;stroke:#f59e0b;animation:ab-r-beacon 2.4s ease-out infinite;transform-origin:250px 120px}
@keyframes ab-r-beacon{0%{r:5px;opacity:.9;stroke-width:2px}100%{r:20px;opacity:0;stroke-width:.5px}}
.ab-r-hqname{font-family:var(--sans);font-size:9.5px;font-weight:800;letter-spacing:.06em;fill:#f5f0e6}
.ab-r-node{fill:#38bdf8;stroke:#0c1b33;stroke-width:1.8}
.ab-r-node--chennai{fill:#f59e0b}
.ab-r-tname{font-family:var(--display);font-size:11px;font-weight:600;fill:#ffffff}
.ab-r-tdist{font-family:var(--sans);font-size:9px;font-weight:600;fill:rgba(245,240,230,.6)}
.ab-r-north{font-family:var(--sans);font-size:7.5px;font-weight:800;fill:#f59e0b}
.ab-r-status{font-family:var(--sans);font-size:8.5px;font-weight:500;letter-spacing:.03em;fill:rgba(245,240,230,.7)}

.ab-hq-hud{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.75rem 1.1rem;background:rgba(18,34,59,.7);backdrop-filter:blur(8px);border-top:1px solid rgba(255,255,255,.08);color:#f5f0e6}
.ab-hq-hud-main{min-width:0;display:flex;flex-direction:column;gap:.15rem}
.ab-hq-hud-title{display:flex;align-items:center;gap:.45rem;font-size:.75rem}
.ab-hq-dot{width:.45rem;height:.45rem;border-radius:50%;background:#22c55e;box-shadow:0 0 0 3px rgba(34,197,94,.25)}
.ab-hq-hud-title b{color:#fff;font-weight:600}
.ab-hq-coords{font-family:var(--mono);font-size:.68rem;color:rgba(245,240,230,.45)}
.ab-hq-hud-sub{margin:0;font-size:.76rem;color:rgba(245,240,230,.75);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ab-hq-hud-actions{display:flex;align-items:center;gap:.75rem;flex:none}
.ab-hq-hud-hrs{font-size:.72rem;color:rgba(245,240,230,.6);white-space:nowrap}
.ab-hq-hud-btn{display:inline-flex;align-items:center;gap:.35rem;padding:.4rem .85rem;border-radius:999px;background:#f5f0e6;font-size:.75rem;font-weight:600;color:var(--navy);text-decoration:none;transition:background-color .2s,transform .2s}
.ab-hq-hud-btn:hover{background:#ffffff;transform:translateX(2px)}
.ab-hq-hud-btn svg{width:.8rem;height:.8rem}

.ab-corridors-col{display:flex;flex-direction:column;justify-content:space-between;gap:.65rem}
.ab-towns{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.65rem;margin:0;padding:0;list-style:none}
.ab-corridor-card{display:flex;flex-direction:column;justify-content:space-between;padding:.85rem 1rem;border-radius:12px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line),0 2px 6px -2px rgba(18,34,59,.04);transition:transform .2s ease,box-shadow .2s ease}
.ab-corridor-card:hover{transform:translateY(-2px);box-shadow:inset 0 0 0 1px rgba(39,86,160,.35),0 10px 20px -8px rgba(18,34,59,.12)}
.ab-cc-top{display:flex;align-items:flex-start;justify-content:space-between;gap:.6rem}
.ab-cc-corridor{display:inline-block;font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--accent)}
.ab-cc-name{margin:.1rem 0 0;font-family:var(--display);font-size:1.1rem;font-weight:600;line-height:1.2;letter-spacing:-.01em;color:var(--ink)}
.ab-cc-dist{display:flex;flex-direction:column;align-items:flex-end;gap:.1rem}
.ab-cc-km{display:flex;align-items:baseline;gap:.1rem;font-family:var(--display);font-size:1.15rem;font-weight:700;line-height:1;color:var(--ink)}
.ab-cc-km small{font-size:.72rem;font-weight:600;color:var(--mute)}
.ab-cc-bearing{display:inline-flex;align-items:center;gap:.2rem;font-size:.72rem;font-weight:500;color:var(--mute)}
.ab-tway{flex:none;width:.78rem;height:.78rem;color:var(--accent)}
.ab-cc-meter{display:flex;align-items:center;gap:.6rem;margin:.5rem 0 .35rem}
.ab-cc-track{flex:1;height:3px;border-radius:999px;background:rgba(18,34,59,.08);overflow:hidden}
.ab-cc-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,var(--accent),var(--navy))}
.ab-cc-transit{font-size:.7rem;font-weight:600;color:var(--ink2);white-space:nowrap}
.ab-cc-focus{margin:0;font-size:.76rem;line-height:1.4;color:var(--mute);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.ab-rnote{margin:.2rem 0 0;font-size:.82rem;line-height:1.45;color:var(--mute)}
.ab-svc{margin:clamp(2rem,5vh,3rem) 0 0;padding-top:1.1rem;border-top:1px solid var(--line);font-size:var(--fs-body);line-height:1.7;color:var(--mute)}
.ab-svc a{color:var(--ink);font-weight:600;text-decoration:none;border-bottom:1px solid rgba(18,34,59,.25)}
.ab-svc a:hover{border-color:var(--ink)}

@media (max-width:1023px){
  .ab-whohead{grid-template-columns:1fr;align-items:start}
  .ab-mission ul{grid-template-columns:repeat(2,minmax(0,1fr))}
  .ab-vlist{grid-template-columns:repeat(2,minmax(0,1fr))}
  .ab-reach2{grid-template-columns:1fr}
}
@media (max-width:519px){.ab-mission ul{grid-template-columns:1fr}}
@media (max-width:639px){
  .ab-towns{grid-template-columns:1fr}
  .ab-hq-hud{flex-direction:column;align-items:flex-start;gap:.6rem}
  .ab-hq-hud-actions{width:100%;justify-content:space-between}
}
@media (max-width:899px){
  .ab-wgrid{grid-template-columns:1fr;align-items:start}
}
@media (max-width:767px){
  .ab-pt,.ab-pt--flip{grid-template-columns:1fr}
  .ab-pt--flip .ab-ptph{order:0;justify-self:start}
  .ab-pt--flip .ab-ptcopy{order:0;justify-self:start}
  .ab-ptph{max-width:22rem}
  .ab-vlist{grid-template-columns:1fr}
}
`;
