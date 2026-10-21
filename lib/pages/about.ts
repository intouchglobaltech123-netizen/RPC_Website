/**
 * About page, kept short: who RPC is, the vision and the mission, the six
 * values, where we work, and the close. Every heading is written around what
 * people search for (waterproofing and construction in Erode, Coimbatore and
 * Tamil Nadu), and every fact comes from lib/content.ts.
 *
 * The one photograph's place is an empty frame, ready for RPC's own picture.
 */
import { arrow, ctaBand, esc, listing, mark, ph, tick, two, words, type ContactInfo } from "./kit";

export interface AboutData {
  story: readonly string[];
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


/**
 * How to reach the office: pick a town, then one of four places people
 * usually set out from there (its bus stand, its railway station and so on),
 * and Google Maps shows the road route to our Perundurai Road office. The
 * starting places are public landmarks; the routes and times are Google's.
 */
const ROUTES: readonly { town: string; from: readonly (readonly [label: string, place: string])[] }[] = [
  { town: "Erode", from: [["From the central bus stand", "Erode Central Bus Terminus, Erode"], ["From the railway station", "Erode Junction Railway Station, Erode"], ["From Perundurai", "Perundurai Bus Stand, Perundurai"], ["From Bhavani", "Bhavani Bus Stand, Bhavani"]] },
  { town: "Tiruppur", from: [["From the new bus stand", "Tiruppur New Bus Stand, Tiruppur"], ["From the old bus stand", "Tiruppur Old Bus Stand, Tiruppur"], ["From the railway station", "Tiruppur Railway Station, Tiruppur"], ["From Avinashi", "Avinashi Bus Stand, Avinashi"]] },
  { town: "Coimbatore", from: [["From Gandhipuram bus stand", "Gandhipuram Central Bus Stand, Coimbatore"], ["From the railway station", "Coimbatore Junction Railway Station"], ["From the airport", "Coimbatore International Airport"], ["From Ukkadam bus stand", "Ukkadam Bus Stand, Coimbatore"]] },
  { town: "Salem", from: [["From the new bus stand", "Salem New Bus Stand, Salem"], ["From the old bus stand", "Salem Old Bus Stand, Salem"], ["From the railway station", "Salem Junction Railway Station"], ["From Five Roads", "Five Roads, Salem"]] },
  { town: "Chennai", from: [["From Koyambedu bus stand", "Chennai Mofussil Bus Terminus, Koyambedu, Chennai"], ["From Kilambakkam bus stand", "Kilambakkam Bus Terminus, Chennai"], ["From Chennai Central station", "Chennai Central Railway Station"], ["From the airport", "Chennai International Airport"]] },
];

const embedRoute = (from: string, to: string) => `https://maps.google.com/maps?saddr=${encodeURIComponent(from)}&daddr=${encodeURIComponent(to)}&output=embed`;
const openRoute = (from: string, to: string) => `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}&travelmode=driving`;

function routesMarkup(dest: string, regions: readonly string[]) {
  const towns = ROUTES.filter((r) => regions.includes(r.town));
  const first = towns[0]!;
  const [fl, fp] = first.from[0]!;
  const pin = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14.5s4.8-4.3 4.8-8a4.8 4.8 0 0 0-9.6 0c0 3.7 4.8 8 4.8 8z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="6.5" r="1.7" fill="currentColor"/></svg>`;
  const short = (l: string) => { const x = l.replace(/^From (the )?/, ""); return x.charAt(0).toUpperCase() + x.slice(1); };
  return `<div class="ab-go" data-routes data-dest="${esc(dest)}">
    <div class="ab-go-side">
      <h3 class="ab-go-h">How to reach our office</h3>
      <div class="ab-go-towns" role="tablist" aria-label="Towns">${towns
        .map((t, i) => `<button type="button" role="tab" class="ab-go-town" data-town="${esc(t.town)}" aria-selected="${i === 0}">${esc(t.town)}</button>`)
        .join("")}</div>
      ${towns
        .map(
          (t, i) => `<ul class="ab-go-from" data-from-town="${esc(t.town)}"${i === 0 ? "" : " hidden"}>${t.from
            .map(
              ([label, place], j) =>
                `<li><button type="button" class="ab-go-route" data-place="${esc(place)}" data-label="${esc(`${label.replace(/^From /, "")}, ${t.town}`)}" aria-pressed="${i === 0 && j === 0}">${pin}<span><b>${esc(short(label))}</b><small>${esc(place)}</small></span></button></li>`,
            )
            .join("")}</ul>`,
        )
        .join("")}
      <a class="ab-go-open" href="${esc(openRoute(fp, dest))}" target="_blank" rel="noopener noreferrer" data-open>Open this route in Google Maps${arrow}</a>
    </div>
    <div class="ab-go-map">
      <iframe title="Road route from ${esc(`${fl.replace(/^From /, "")}, ${first.town}`)} to our office" src="${esc(embedRoute(fp, dest))}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" data-map></iframe>
    </div>
  </div>`;
}

export function aboutMarkup(d: AboutData) {
  const c = d.contact;
  const [hq] = c.regions;
  const head = `<header class="pg-head ab-head">
  <div class="pg-wrap">
    <div class="ab-headgrid">
      <div class="ab-headcopy">
        ${mark("01", "About RPC Constructions")}
        <h1 class="pg-h1" data-rv="words">${words("Waterproofing and construction in Erode since&nbsp;2012.")}</h1>
        <p class="pg-intro" data-rv>We keep buildings dry. RPC Constructions repairs leaks in buildings already standing and builds new homes, offices and factories with their waterproofing designed in, from our office on Perundurai Road, Erode.</p>
      </div>
      <div class="ab-headside">
        <div class="pg-actions" data-rv><a class="pg-btn pg-btn--ink" href="/contact#enquiry" data-internal>Book a free site inspection${arrow}</a><a class="pg-btn pg-btn--line" href="/services" data-internal>Our services</a></div>
      </div>
    </div>
  </div>
</header>`;

  const who = `<section class="pg-sec ab-who" aria-labelledby="ab-who-h">
  <div class="pg-wrap">
    <div class="ab-whogrid">
      <div class="ab-whoph" data-rv>${ph({ ratio: "4/3", label: "Photo: the RPC team on site" })}</div>
      <div class="ab-whocopy">
        ${mark("02", "Who we are")}
        <h2 class="pg-h2" id="ab-who-h" data-rv>An engineer‑led waterproofing company that also builds.</h2>
        ${d.story.map((p, i) => `<p class="${i === 0 ? "ab-lead" : "ab-p"}" data-rv>${esc(p)}</p>`).join("")}
      </div>
    </div>
  </div>
</section>`;

  const vm = `<section class="pg-sec pg-sec--sky ab-vm" aria-label="Vision and mission">
  <div class="pg-wrap">
    <article class="ab-vision" aria-labelledby="ab-vision-h" data-rv>
      <h2 class="ab-vh" id="ab-vision-h">Our vision</h2>
      <p class="ab-vtext">${esc(d.vision)}</p>
    </article>
    <article class="ab-mission" aria-labelledby="ab-mission-h">
      <h2 class="ab-vh" id="ab-mission-h" data-rv>Our mission</h2>
      <ul data-rv-stagger="80">${d.mission.map((m) => `<li data-rv>${tick}<span>${esc(m)}</span></li>`).join("")}</ul>
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

  const where = `<section class="pg-sec pg-sec--stone ab-where" aria-labelledby="ab-where-h">
  <div class="pg-wrap">
    <div class="ab-whead">
      <div>
        ${mark("04", "Where we work")}
        <h2 class="pg-h2" id="ab-where-h">${["One", "Two", "Three", "Four", "Five", "Six", "Seven"][c.regions.length - 1] ?? c.regions.length} towns, one office in&nbsp;${esc(hq ?? "Erode")}.</h2>
      </div>
      <p class="ab-wlede">Waterproofing contractors in ${esc(listing(c.regions))}, working from our office at ${esc(c.address.split(",").slice(0, 2).join(",").trim())}.</p>
    </div>
    ${routesMarkup(c.mapQuery, c.regions)}
  </div>
</section>`;

  return `${head}\n${who}\n${vm}\n${values}\n${where}\n${ctaBand(c, {
    title: "Let’s keep your building dry.",
    steps: [
      ["Tell us what you’re seeing", "A damp patch, a dripping ceiling or a building still on paper."],
      ["Meet an engineer on site", "The first inspection is free, anywhere around Erode and Coimbatore."],
      ["Decide in your own time", "With the cause, the method and the price in front of you."],
    ],
    reach: true,
  })}`;
}

export const ABOUT_CSS = `
/* how to reach the office: towns and starting places on the left, Google's road route on the right */
.ab-go{display:grid;grid-template-columns:minmax(0,.95fr) minmax(0,1.3fr);gap:0;margin-top:clamp(1rem,2.2vh,1.6rem);overflow:hidden;border-radius:18px;background:var(--card,#f5f0e6);box-shadow:inset 0 0 0 1px var(--line)}
.ab-go-side{display:flex;flex-direction:column;gap:.9rem;padding:clamp(1.1rem,2vw,1.5rem)}
.ab-go-k{margin:0;font-size:var(--fs-body);font-weight:600;color:var(--accent)}
.ab-go-h{margin:0;font-size:var(--fs-sub);font-weight:600;line-height:1.25;letter-spacing:-.01em;color:var(--ink)}
.ab-go-towns{display:flex;flex-wrap:wrap;gap:.35rem}
.ab-go-town{height:2.3rem;padding:0 .9rem;border:0;border-radius:999px;background:rgba(18,34,59,.06);font:inherit;font-size:var(--fs-body);font-weight:600;color:var(--ink);cursor:pointer;transition:background-color .2s,color .2s}
.ab-go-town:hover{background:rgba(18,34,59,.1)}
.ab-go-town[aria-selected=true]{background:var(--navy);color:#f5f0e6}
.ab-go-town:focus-visible,.ab-go-route:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.ab-go-from{display:grid;grid-template-columns:minmax(0,1fr);gap:.4rem;margin:0;padding:0;list-style:none}
.ab-go-from[hidden]{display:none}
.ab-go-route{display:flex;align-items:flex-start;gap:.55rem;width:100%;height:100%;padding:.5rem .75rem;border:0;border-radius:12px;background:#fff;box-shadow:inset 0 0 0 1px var(--line);font:inherit;text-align:left;cursor:pointer;transition:box-shadow .2s,background-color .2s}
.ab-go-route svg{flex:none;width:1.1rem;height:1.1rem;margin-top:.15rem;color:var(--accent)}
.ab-go-route span{display:flex;flex-direction:column;min-width:0}
.ab-go-route b{font-size:var(--fs-body);font-weight:600;color:var(--ink)}
.ab-go-route small{font-size:var(--fs-body);color:var(--mute);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ab-go-route:hover{box-shadow:inset 0 0 0 1.5px var(--navy)}
.ab-go-route[aria-pressed=true]{background:var(--navy);box-shadow:none}
.ab-go-route[aria-pressed=true] b,.ab-go-route[aria-pressed=true] svg{color:#fff}
.ab-go-route[aria-pressed=true] small{color:rgba(245,240,230,.7)}
.ab-go-open{display:inline-flex;align-items:center;gap:.4rem;margin-top:auto;font-size:var(--fs-body);font-weight:600;color:var(--accent);text-decoration:none}
.ab-go-open:hover{text-decoration:underline;text-underline-offset:3px}
.ab-go-open .pg-ar{width:.9rem;height:.9rem}
.ab-go-map{position:relative;min-height:21rem;background:#d9d0bf}
.ab-go-map iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
@media (max-width:899px){.ab-go{grid-template-columns:minmax(0,1fr)}.ab-go-map{min-height:20rem}}

/* the opening: the h1 and its intro */
.ab-headgrid{display:grid;grid-template-columns:minmax(0,52rem) auto;justify-content:space-between;align-items:end;gap:1.4rem clamp(2rem,5vw,5rem)}
.ab-headside .pg-actions{flex-wrap:nowrap;justify-content:flex-end;margin:0}
@media (max-width:1099px){.ab-headgrid{grid-template-columns:minmax(0,1fr)}.ab-headside .pg-actions{justify-content:flex-start;flex-wrap:wrap}}
.ab-headcopy .pg-mark{margin-bottom:.9rem}

/* who we are */
.ab-whogrid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:clamp(2rem,5vw,6rem);align-items:center}
.ab-whocopy .pg-h2{margin-top:.7rem}
.ab-lead{margin:1.4rem 0 0;max-width:40rem;font-size:var(--fs-body);line-height:1.65;color:var(--ink)}
.ab-p{margin:1rem 0 0;max-width:40rem;font-size:var(--fs-body);line-height:1.7;color:var(--ink2)}

/* vision and mission: the vision across the panel, the mission's four promises under it */
.ab-vh{margin:0;font-size:var(--fs-body);font-weight:600;color:var(--accent)}
.ab-vtext{margin:.9rem 0 0;max-width:30ch;font-family:var(--display);font-weight:600;font-size:var(--fs-sub);line-height:1.35;letter-spacing:-.01em;text-wrap:balance}
.ab-mission{margin-top:clamp(2.4rem,6vh,3.6rem);padding-top:clamp(1.4rem,3vh,2rem);border-top:1px solid rgba(39,86,160,.22)}
.ab-mission ul{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1rem clamp(1rem,2vw,2rem);margin:1.2rem 0 0;padding:0;list-style:none}
.ab-mission li{display:flex;flex-direction:column;gap:.5rem;padding-top:1rem;border-top:2px solid var(--navy);font-size:var(--fs-body);line-height:1.55}
.ab-mission .pg-tick{display:none}

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
  .ab-whogrid{grid-template-columns:1fr;align-items:start}
  .ab-vlist{grid-template-columns:repeat(2,minmax(0,1fr))}
  .ab-mission ul{grid-template-columns:repeat(2,minmax(0,1fr))}
  .ab-reach2{grid-template-columns:1fr}
}
@media (max-width:639px){
  .ab-towns{grid-template-columns:1fr}
  .ab-hq-hud{flex-direction:column;align-items:flex-start;gap:.6rem}
  .ab-hq-hud-actions{width:100%;justify-content:space-between}
}
@media (max-width:899px){
  .ab-wgrid{grid-template-columns:1fr;align-items:start}
}
@media (max-width:767px){
  .ab-mission ul{grid-template-columns:1fr}
  .ab-vlist{grid-template-columns:1fr}
}
`;
