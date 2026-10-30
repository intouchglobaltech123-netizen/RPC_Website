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
  mission: string;
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


/** drawn emblems and subtle architectural corner marks for the vision & mission diptych */
const VISION_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2.2 12s3.6-6.5 9.8-6.5 9.8 6.5 9.8 6.5-3.6 6.5-9.8 6.5S2.2 12 2.2 12z"/><circle cx="12" cy="12" r="3"/></svg>`;
const MISSION_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22"/></svg>`;
const VISION_BG = `<svg class="ab-vmbg" viewBox="0 0 240 240" aria-hidden="true" fill="none"><circle cx="200" cy="40" r="64" stroke="currentColor" stroke-dasharray="4 6"/><circle cx="200" cy="40" r="118" stroke="currentColor" stroke-dasharray="4 6"/><circle cx="200" cy="40" r="172" stroke="currentColor"/><path d="M20 40h200M200 0v200" stroke="currentColor" stroke-opacity=".55"/></svg>`;
const MISSION_BG = `<svg class="ab-vmbg" viewBox="0 0 240 240" aria-hidden="true" fill="none"><rect x="84" y="18" width="138" height="138" rx="8" stroke="currentColor"/><rect x="118" y="52" width="70" height="70" rx="4" stroke="currentColor" stroke-dasharray="4 5"/><path d="M56 87h184M153 0v184" stroke="currentColor" stroke-opacity=".55"/></svg>`;

export function aboutMarkup(d: AboutData) {
  const head = `<header class="pg-head ab-head">
  <div class="pg-wrap">
    <div class="ab-headgrid">
      <div class="ab-headcopy">
        ${mark("01", "About RPC Constructions")}
        <h1 class="pg-h1" data-rv="words">${words("Waterproofing and construction in Erode since&nbsp;2012.")}</h1>
        <p class="pg-intro" data-rv>We keep buildings dry. RPC Constructions repairs leaks in buildings already standing and builds new homes, offices and factories with their waterproofing designed in, from our office in Kurikaran Palayam, Erode.</p>
      </div>
    </div>
  </div>
</header>`;

  const partner = (p: AboutData["partners"][number], i: number) => `<article class="ab-pt${i % 2 ? " ab-pt--flip" : ""}" aria-label="${esc(p.name)}, ${esc(p.role)}">
      <div class="ab-ptph" data-rv>${p.image ? `<img src="${esc(p.image)}" width="800" height="960" alt="${esc(p.name)}, ${esc(p.role)} at RPC Constructions" loading="lazy" decoding="async">` : ph({ ratio: "5/6", label: `Photo: ${p.name}` })}</div>
      <div class="ab-ptcopy" data-rv>
        <p class="ab-ptrole">${esc(p.role)}</p>
        <h3 class="ab-ptname">${esc(p.name)}</h3>
        ${p.qualification ? `<p class="ab-ptq">${esc(p.qualification)}</p>` : ""}
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

  const vm = `<section class="pg-sec pg-sec--sky ab-vm" aria-labelledby="ab-vm-h">
  <div class="pg-wrap">
    <div class="ab-vmhead">
      ${mark("03", "Vision & mission")}
      <h2 class="pg-h2" id="ab-vm-h" data-rv>One clear vision, one mission on site.</h2>
    </div>
    <div class="ab-vmgrid" data-rv-stagger="90">
      <article class="ab-vmcard ab-vmcard--vision" aria-labelledby="ab-vision-h" data-rv>
        ${VISION_BG}
        <div class="ab-vmtop">
          <div class="ab-vmbadge">
            <span class="ab-vmic">${VISION_ICON}</span>
            <h3 class="ab-vh" id="ab-vision-h">Our vision</h3>
          </div>
          <span class="ab-vmno" aria-hidden="true">01</span>
        </div>
        <p class="ab-vmtext">${esc(d.vision)}</p>
        <p class="ab-vmfoot"><i aria-hidden="true"></i><span>Western Tamil Nadu · Trusted from foundation to roof</span></p>
      </article>
      <article class="ab-vmcard ab-vmcard--mission" aria-labelledby="ab-mission-h" data-rv>
        ${MISSION_BG}
        <div class="ab-vmtop">
          <div class="ab-vmbadge">
            <span class="ab-vmic">${MISSION_ICON}</span>
            <h3 class="ab-vh" id="ab-mission-h">Our mission</h3>
          </div>
          <span class="ab-vmno" aria-hidden="true">02</span>
        </div>
        <p class="ab-vmtext">${esc(d.mission)}</p>
        <p class="ab-vmfoot"><i aria-hidden="true"></i><span>Diagnosed on site · Tested with water · Held to our word</span></p>
      </article>
    </div>
  </div>
</section>`;

  const values = `<section class="pg-sec ab-values" aria-labelledby="ab-values-h">
  <div class="pg-wrap">
    <div class="ab-vhead">
      ${mark("04", "Our values")}
      <h2 class="pg-h2" id="ab-values-h" data-rv>Six values on every site.</h2>
    </div>
    <ul class="ab-vcards" data-rv-stagger="70">${d.principles
      .map(
        (p, i) =>
          `<li class="ab-vcard" data-rv style="--d:${i * 60}ms"><span class="ab-vcbig" aria-hidden="true">${two(i + 1)}</span><span class="ab-vcic">${markOf(p.title)}</span><h3 class="ab-vctitle">${esc(p.title)}</h3><p class="ab-vcbody">${esc(p.body)}</p></li>`,
      )
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
.ab-ptph{width:100%;max-width:25rem}
.ab-pt--flip .ab-ptph{justify-self:end}
.ab-ptph img{display:block;width:100%;height:auto;aspect-ratio:5/6;object-fit:cover;object-position:center top;border-radius:14px;box-shadow:0 24px 48px -28px rgba(11,35,80,.45),0 0 0 1px var(--line)}
.ab-ptcopy{max-width:36rem;padding-left:1.4rem;border-left:2px solid var(--accent)}
.ab-ptrole{margin:0;font-size:var(--fs-body);font-weight:600;color:var(--accent)}
.ab-ptname{margin:.4rem 0 0;font-family:var(--display);font-size:var(--fs-sub);font-weight:600;line-height:1.25;letter-spacing:-.015em;color:var(--ink)}
.ab-ptq{margin:.3rem 0 0;font-size:var(--fs-body);color:var(--mute)}
.ab-ptcopy .ab-p{margin-top:.85rem}

/* vision and mission: an architectural two-panel diptych — deep navy for the long-term vision, crisp ivory for our single mission on site */
.ab-vmhead{margin-bottom:clamp(1.8rem,4vh,2.6rem)}
.ab-vmhead .pg-h2{margin-top:.7rem;max-width:24ch}
.ab-vmgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(1rem,2vw,1.5rem);align-items:stretch}
.ab-vmcard{position:relative;display:flex;flex-direction:column;justify-content:space-between;gap:clamp(1.6rem,3.6vh,2.6rem);padding:clamp(1.6rem,3vw,2.4rem);border-radius:20px;overflow:hidden;isolation:isolate;transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s}
.ab-vmcard:hover{transform:translateY(-3px)}
.ab-vmbg{position:absolute;top:-10px;right:-10px;width:13.5rem;height:13.5rem;pointer-events:none;z-index:-1}
.ab-vmtop{display:flex;align-items:center;justify-content:space-between;gap:1rem}
.ab-vmbadge{display:inline-flex;align-items:center;gap:.75rem}
.ab-vmic{display:grid;place-items:center;width:2.85rem;height:2.85rem;border-radius:12px;flex:none;transition:transform .3s}
.ab-vmcard:hover .ab-vmic{transform:scale(1.05)}
.ab-vmic svg{width:1.35rem;height:1.35rem}
.ab-vh{margin:0;font-size:var(--fs-body);font-weight:700;letter-spacing:.06em;text-transform:uppercase}
.ab-vmno{font-family:var(--display);font-size:1.75rem;font-weight:700;line-height:1;letter-spacing:-.04em;font-variant-numeric:tabular-nums}
.ab-vmtext{margin:0;font-family:var(--display);font-weight:500;font-size:clamp(1.3rem,.96rem + .95vw,1.78rem);line-height:1.36;letter-spacing:-.015em;text-wrap:pretty}
.ab-vmfoot{display:flex;align-items:center;gap:.6rem;margin:0;padding-top:1.15rem;font-size:calc(var(--fs-body) * .9);font-weight:500;line-height:1.4}
.ab-vmfoot i{width:.5rem;height:.5rem;border-radius:50%;flex:none}

/* vision panel: deep architectural navy */
.ab-vmcard--vision{background:var(--navy);color:#f5f0e6;box-shadow:0 28px 54px -32px rgba(7,20,44,.75)}
.ab-vmcard--vision:hover{box-shadow:0 36px 64px -30px rgba(7,20,44,.88)}
.ab-vmcard--vision .ab-vmbg{color:rgba(159,187,230,.14)}
.ab-vmcard--vision .ab-vmic{background:rgba(245,240,230,.12);color:#9fbbe6;box-shadow:inset 0 0 0 1px rgba(255,255,255,.14)}
.ab-vmcard--vision .ab-vh{color:#9fbbe6}
.ab-vmcard--vision .ab-vmno{color:rgba(255,255,255,.16)}
.ab-vmcard--vision .ab-vmtext{color:#fff}
.ab-vmcard--vision .ab-vmfoot{border-top:1px solid rgba(255,255,255,.14);color:rgba(245,240,230,.74)}
.ab-vmcard--vision .ab-vmfoot i{background:#9fbbe6;box-shadow:0 0 0 4px rgba(159,187,230,.18)}

/* mission panel: crisp warm ivory with signature accent bar */
.ab-vmcard--mission{background:#fff;color:var(--ink);box-shadow:0 0 0 1px var(--line),0 24px 48px -32px rgba(11,35,80,.42)}
.ab-vmcard--mission::before{content:"";position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--accent),var(--water))}
.ab-vmcard--mission:hover{box-shadow:0 0 0 1px rgba(39,86,160,.32),0 32px 58px -30px rgba(11,35,80,.55)}
.ab-vmcard--mission .ab-vmbg{color:rgba(39,86,160,.09)}
.ab-vmcard--mission .ab-vmic{background:var(--navy);color:#f5f0e6}
.ab-vmcard--mission .ab-vh{color:var(--accent)}
.ab-vmcard--mission .ab-vmno{color:rgba(11,35,80,.11)}
.ab-vmcard--mission .ab-vmtext{color:var(--ink)}
.ab-vmcard--mission .ab-vmfoot{border-top:1px solid var(--line);color:var(--mute)}
.ab-vmcard--mission .ab-vmfoot i{background:var(--water);box-shadow:0 0 0 4px rgba(11,110,128,.14)}
@media (prefers-reduced-motion:reduce){.ab-vmcard,.ab-vmic{transition:none}.ab-vmcard:hover,.ab-vmcard:hover .ab-vmic{transform:none}}

/* values */
.ab-vhead{margin-bottom:clamp(1.8rem,4vh,2.6rem)}
.ab-vhead .pg-h2{margin-top:.7rem}
/* the values: six white cards, three to a row, each with its mark and a large faint number; a card turns navy under the pointer */
.ab-vcards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.7rem;margin:0;padding:0;list-style:none}
.ab-vcard{position:relative;display:grid;grid-template-columns:2.6rem minmax(0,1fr);column-gap:.9rem;align-items:start;padding:1rem 1.1rem 1.05rem;overflow:hidden;border-radius:14px;background:#fff;box-shadow:0 0 0 1px var(--line),0 16px 30px -28px rgba(11,35,80,.55);transition:background-color .3s,box-shadow .3s,transform .3s}
.ab-vcard::after{content:"";position:absolute;left:1.1rem;right:1.1rem;bottom:0;height:2px;border-radius:2px 2px 0 0;background:var(--accent);transform:scaleX(0);transform-origin:left;transition:transform .4s cubic-bezier(.2,.8,.2,1)}
.ab-vcbig{position:absolute;top:.35rem;right:.7rem;font-family:var(--display);font-size:1.9rem;font-weight:700;line-height:1;letter-spacing:-.04em;color:rgba(11,35,80,.07);transition:color .3s;pointer-events:none}
.ab-vcic{grid-row:1/3;display:grid;place-items:center;width:2.6rem;height:2.6rem;border-radius:11px;background:var(--navy);color:#f5f0e6;transition:background-color .3s,color .3s}
.ab-vcic .ab-mk{width:1.25rem;height:1.25rem}
.ab-vctitle{margin:.1rem 2.2rem 0 0;font-family:var(--display);font-size:calc(var(--fs-body) * 1.08);font-weight:600;letter-spacing:-.01em;color:var(--ink);transition:color .3s}
.ab-vcbody{margin:.3rem 0 0;font-size:calc(var(--fs-body) * .92);line-height:1.5;color:var(--ink2);transition:color .3s}
.ab-vcard:hover{transform:translateY(-2px);background:var(--navy);box-shadow:0 34px 56px -34px rgba(4,12,30,.9)}
.ab-vcard:hover::after{transform:scaleX(1);background:#9fbbe6}
.ab-vcard:hover .ab-vcbig{color:rgba(255,255,255,.07)}
.ab-vcard:hover .ab-vcic{background:#f5f0e6;color:var(--navy)}
.ab-vcard:hover .ab-vctitle{color:#fff}
.ab-vcard:hover .ab-vcbody{color:rgba(245,240,230,.84)}
@media (max-width:1023px){.ab-vcards{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:599px){.ab-vcards{grid-template-columns:minmax(0,1fr)}}
@media (prefers-reduced-motion:reduce){.ab-vcard,.ab-vcard::after{transition:none}.ab-vcard:hover{transform:none}}
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
  .ab-vlist{grid-template-columns:repeat(2,minmax(0,1fr))}
  .ab-reach2{grid-template-columns:1fr}
}
@media (max-width:899px){
  .ab-vmgrid{grid-template-columns:1fr}
  .ab-wgrid{grid-template-columns:1fr;align-items:start}
}
@media (max-width:639px){
  .ab-towns{grid-template-columns:1fr}
  .ab-hq-hud{flex-direction:column;align-items:flex-start;gap:.6rem}
  .ab-hq-hud-actions{width:100%;justify-content:space-between}
}
@media (max-width:767px){
  .ab-pt,.ab-pt--flip{grid-template-columns:1fr}
  .ab-pt--flip .ab-ptph{order:0;justify-self:start}
  .ab-pt--flip .ab-ptcopy{order:0;justify-self:start}
  .ab-ptph{max-width:22rem}
  .ab-vlist{grid-template-columns:1fr}
}

/* phones: a short, even page. The opening keeps its title; who we are keeps its first paragraph; the two partners sit side by side
   with just a photograph, role and name; vision and mission are two compact cards; the six values are small tiles, two to a row */
@media (max-width:767px){
  .ab-head .pg-intro{display:none}
  .ab-who,.ab-vm,.ab-values{padding:2.4rem 0}
  .ab-who .pg-h2,.ab-vm .pg-h2,.ab-values .pg-h2{font-size:1.5rem;line-height:1.18}
  .ab-whohead{gap:.4rem}
  .ab-whohead .pg-h2{margin-top:.5rem}
  .ab-whotext .ab-lead{margin-top:.8rem;font-size:.95rem;line-height:1.6;color:var(--ink2)}
  .ab-whotext .ab-p{display:none}

  .ab-pts{grid-template-columns:repeat(2,minmax(0,1fr));gap:.7rem;margin-top:1.6rem}
  .ab-pt,.ab-pt--flip{gap:.7rem;align-items:start;padding:.45rem .45rem .85rem;border-radius:16px;background:#fff;box-shadow:0 0 0 1px var(--line),0 10px 24px -20px rgba(18,34,59,.45)}
  .ab-pt .ab-ptph,.ab-pt--flip .ab-ptph{order:0;justify-self:stretch;max-width:none}
  .ab-ptph img,.ab-ptph .pg-ph{aspect-ratio:4/5 !important;border-radius:12px;box-shadow:none}
  .ab-pt .ab-ptcopy,.ab-pt--flip .ab-ptcopy{order:0;justify-self:stretch;max-width:none;padding:0 .4rem;border-left:0}
  .ab-ptrole{font-size:.74rem;line-height:1.3}
  .ab-ptname{margin-top:.2rem;font-size:.95rem;line-height:1.2}
  .ab-ptq,.ab-ptcopy .ab-p{display:none}

  .ab-vmhead,.ab-vhead{margin-bottom:1.1rem}
  .ab-vmhead .pg-h2{margin-top:.5rem}
  .ab-vmgrid{gap:.7rem}
  .ab-vmcard{gap:.8rem;padding:1rem 1rem 1.05rem;border-radius:16px}
  .ab-vmcard:hover{transform:none}
  .ab-vmbg,.ab-vmno,.ab-vmfoot{display:none}
  .ab-vmic{width:2.3rem;height:2.3rem;border-radius:10px}
  .ab-vmic svg{width:1.15rem;height:1.15rem}
  .ab-vh{font-size:.8rem}
  .ab-vmtext{font-size:1.02rem;line-height:1.45}

  .ab-vhead .pg-h2{margin-top:.5rem}
  .ab-vcards{grid-template-columns:repeat(2,minmax(0,1fr));gap:.7rem}
  .ab-vcard{display:flex;flex-direction:row;align-items:center;gap:.7rem;padding:.75rem .8rem;border-radius:16px}
  .ab-vcard:hover{transform:none}
  .ab-vcbig,.ab-vcbody{display:none}
  .ab-vcic{flex:none;width:2.4rem;height:2.4rem;border-radius:12px}
  .ab-vctitle{margin:0;font-size:.95rem;line-height:1.2}
}
`;
