/**
 * About page, kept short: who RPC is, the vision and the mission, the six
 * values, where we work, and the close. Every heading is written around what
 * people search for (waterproofing and construction in Erode, Coimbatore and
 * Tamil Nadu), and every fact comes from lib/content.ts.
 *
 * The one photograph's place is an empty frame, ready for RPC's own picture.
 */
import { arrow, ctaBand, esc, listing, mark, ph, tel, tick, two, words, type ContactInfo } from "./kit";

export interface AboutData {
  story: readonly string[];
  vision: string;
  mission: readonly string[];
  principles: readonly { title: string; body: string }[];
  services: readonly { title: string; line?: string }[];
  contact: ContactInfo;
  branches: readonly { city: string; kind: string; address: string; mapQuery: string }[];
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


/** a small chevron and a map pin for the city strip */
const chev = `<svg class="ab-cchev" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const pin = `<svg class="ab-cpin" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.3" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`;

/**
 * Where we work: one strip of cities, the head office first. Hovering (or
 * focusing, or tapping) a city drops down its branch address and a link to
 * directions; a branch without its own address yet points to the Erode office.
 */
function branchesMarkup(list: AboutData["branches"], phone: string, hqMaps: string) {
  const city = (b: AboutData["branches"][number]) => {
    const maps = b.mapQuery ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.mapQuery)}` : hqMaps;
    const where = b.address ? esc(b.address) : `Served from our Erode head office`;
    return `<li class="ab-city${b.kind === "Head office" ? " is-hq" : ""}" tabindex="0">
      <p class="ab-ckind">${esc(b.kind)}</p>
      <p class="ab-cname">${esc(b.city)}${chev}</p>
      <div class="ab-cdrop"><div class="ab-cin">
        <p class="ab-caddr">${pin}<span>${where}</span></p>
        <p class="ab-cacts"><a href="${esc(maps)}" target="_blank" rel="noopener noreferrer">Directions${arrow}</a><a href="${tel(phone)}">Call</a></p>
      </div></div>
    </li>`;
  };
  return `<ul class="ab-cities" aria-label="Our offices">${list.map(city).join("")}</ul>`;
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
    <div class="ab-wgrid">
      <div class="ab-wcopy">
        ${mark("04", "Where we work")}
        <h2 class="pg-h2" id="ab-where-h" data-rv>Our branches across Tamil Nadu.</h2>
      </div>
      <p class="pg-lede ab-wlede" data-rv>Our head office is in ${esc(hq ?? "Erode")}, with teams on site in ${esc(listing(c.regions.slice(1)))}. Select a city to see its address.</p>
    </div>
    ${branchesMarkup(d.branches, c.phone, `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.mapQuery)}`)}
  </div>
</section>`;

  return `${head}\n${who}\n${vm}\n${values}\n${where}\n${ctaBand(c, {
    title: "Let’s keep your building dry.",
    steps: [
      ["Tell us what you’re seeing", "A damp patch, a dripping ceiling or a building still on paper."],
      ["Meet an engineer on site", "The first inspection is free, anywhere around Erode and Coimbatore."],
      ["Decide in your own time", "With the cause, the method and the price in front of you."],
    ],
  })}`;
}

export const ABOUT_CSS = `
/* the opening: the h1 and its intro */
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

/* where we work: the heading and its line side by side, then one strip of cities; each drops down its address */
.ab-where{z-index:3}
.ab-wgrid{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:1.2rem clamp(2rem,5vw,6rem);align-items:end}
.ab-wcopy .pg-h2{margin-top:.7rem;max-width:18ch}
.ab-wlede{margin:0;max-width:34rem}
.ab-cities{position:relative;z-index:2;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));margin:clamp(1.8rem,4.5vh,2.6rem) 0 0;padding:0;list-style:none;border-radius:14px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line)}
.ab-city{position:relative;padding:1.05rem 1.25rem 1.15rem;outline:none;cursor:default;transition:background-color .25s}
.ab-city + .ab-city::before{content:"";position:absolute;left:0;top:1rem;bottom:1rem;width:1px;background:var(--line)}
.ab-city:first-child{border-radius:14px 0 0 14px}
.ab-city:last-child{border-radius:0 14px 14px 0}
.ab-ckind{margin:0;font-size:.8rem;font-weight:600;letter-spacing:.02em;color:var(--mute)}
.ab-city.is-hq .ab-ckind{color:var(--accent)}
.ab-cname{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin:.2rem 0 0;font-family:var(--display);font-size:var(--fs-sub);font-weight:600;line-height:1.2;letter-spacing:-.01em;color:var(--ink);transition:color .25s}
.ab-cchev{flex:none;width:1rem;height:1rem;color:var(--mute);transition:transform .3s,color .25s}
/* the drop-down hangs under its city, over whatever follows; its top padding is a bridge so the pointer can reach it */
.ab-cdrop{position:absolute;top:100%;left:0;z-index:5;width:max(100%,17rem);padding-top:.5rem;opacity:0;visibility:hidden;transform:translateY(-6px);transition:opacity .22s,transform .28s cubic-bezier(.2,.7,.2,1),visibility 0s .28s}
.ab-city:last-child .ab-cdrop{left:auto;right:0}
/* room under the strip for the drop-down, so it opens inside this section and never over the next one */
.ab-cities{margin-bottom:9rem}
.ab-cin{padding:1rem 1.1rem;border-radius:12px;background:var(--navy);color:#f5f0e6;box-shadow:0 22px 40px -22px rgba(11,35,80,.6)}
.ab-caddr{display:flex;gap:.55rem;margin:0;font-size:var(--fs-body);line-height:1.5}
.ab-cpin{flex:none;width:1.1rem;height:1.1rem;margin-top:.15rem;color:rgba(245,240,230,.7)}
.ab-cacts{display:flex;gap:.5rem;margin:.85rem 0 0}
.ab-cacts a{display:inline-flex;align-items:center;gap:.4rem;padding:.4rem .85rem;border-radius:999px;font-size:.9rem;font-weight:600;text-decoration:none;color:#f5f0e6;box-shadow:inset 0 0 0 1px rgba(245,240,230,.3);transition:background-color .2s,color .2s}
.ab-cacts a:first-child{background:#f5f0e6;color:var(--navy);box-shadow:none}
.ab-cacts a:hover{background:#fff;color:var(--navy)}
.ab-cacts svg{width:.8rem;height:.8rem}
.ab-city:hover,.ab-city:focus-within{background:#fbf8f2}
.ab-city:hover .ab-cname,.ab-city:focus-within .ab-cname{color:var(--accent)}
.ab-city:hover .ab-cchev,.ab-city:focus-within .ab-cchev{transform:rotate(180deg);color:var(--accent)}
.ab-city:hover .ab-cdrop,.ab-city:focus-within .ab-cdrop{opacity:1;visibility:visible;transform:none;transition:opacity .22s,transform .28s cubic-bezier(.2,.7,.2,1),visibility 0s}
.ab-city:focus-visible{box-shadow:inset 0 0 0 2px var(--accent)}
@media (prefers-reduced-motion:reduce){.ab-cdrop,.ab-cchev{transition:none}}
.ab-svc{margin:clamp(2.4rem,6vh,3.6rem) 0 0;padding-top:1.3rem;border-top:1px solid var(--line);font-size:var(--fs-body);line-height:1.7;color:var(--mute)}
.ab-svc a{color:var(--ink);font-weight:600;text-decoration:none;border-bottom:1px solid rgba(18,34,59,.25)}
.ab-svc a:hover{border-color:var(--ink)}

@media (max-width:1023px){
  .ab-whogrid{grid-template-columns:1fr;align-items:start}
  .ab-vlist{grid-template-columns:repeat(2,minmax(0,1fr))}
  .ab-mission ul{grid-template-columns:repeat(2,minmax(0,1fr))}
}
/* narrow screens: the cities stack as a list; tapping one opens its address under it */
@media (max-width:899px){
  .ab-wgrid{grid-template-columns:1fr;align-items:start}
  .ab-cities{grid-template-columns:1fr;margin-bottom:0}
  .ab-city{padding:.85rem 1.1rem;cursor:pointer}
  .ab-city:first-child{border-radius:14px 14px 0 0}
  .ab-city:last-child{border-radius:0 0 14px 14px}
  .ab-city + .ab-city::before{left:1.1rem;right:1.1rem;top:0;bottom:auto;width:auto;height:1px}
  .ab-cdrop{position:static;display:none;width:auto;padding-top:.7rem;opacity:1;visibility:visible;transform:none}
  .ab-city:hover .ab-cdrop,.ab-city:focus-within .ab-cdrop{display:block}
}
@media (max-width:767px){
  .ab-mission ul{grid-template-columns:1fr}
  .ab-vlist{grid-template-columns:1fr}
}
`;
