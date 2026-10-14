/**
 * About page, kept short: who RPC is, the vision and the mission, the six
 * values, where we work, and the close. Every heading is written around what
 * people search for (waterproofing and construction in Erode, Coimbatore and
 * Tamil Nadu), and every fact comes from lib/content.ts.
 *
 * "Blueprint and action": white and grey grounds, deep blue for structure
 * (the stats panel, the vision and mission band, the icon tiles), and orange
 * only where something can be pressed (the buttons, the hover bar under a
 * city, "Directions").
 */
import { arrow, banner, ctaBand, esc, listing, mark, shot, tel, two, words, type ContactInfo } from "./kit";

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

/** a quotation mark over the vision statement */
const quote = `<svg class="ab-q" viewBox="0 0 32 24" aria-hidden="true"><path d="M3 22v-7.4C3 8.7 6.3 4.3 12.1 2l1.4 2.6C10.1 6.3 8.7 8.6 8.5 12H13v10zm16 0v-7.4C19 8.7 22.3 4.3 28.1 2l1.4 2.6C26.1 6.3 24.7 8.6 24.5 12H29v10z" fill="currentColor"/></svg>`;

/** a small chevron, a map pin and a phone for the city cards */
const chev = `<svg class="ab-cchev" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const pin = `<svg class="ab-cpin" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.3" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`;
const phone = `<svg class="ab-cph" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.5h2.6l1.4 4-2 1.3a11.5 11.5 0 0 0 6.6 6.6l1.3-2 4 1.4v2.6a2.1 2.1 0 0 1-2.2 2.1A16.3 16.3 0 0 1 4.5 5.7a2.1 2.1 0 0 1 2.1-2.2z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`;

/**
 * Where we work: one row of city cards, the head office first. Hovering (or
 * focusing, or tapping) a city drops down its branch address, directions and a
 * call link; a branch without its own address yet points to the Erode office.
 */
function branchesMarkup(list: AboutData["branches"], tele: string, hqMaps: string) {
  const city = (b: AboutData["branches"][number]) => {
    const maps = b.mapQuery ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.mapQuery)}` : hqMaps;
    const where = b.address ? esc(b.address) : `Served from our Erode head office`;
    return `<li class="ab-city${b.kind === "Head office" ? " is-hq" : ""}" tabindex="0">
      <div class="ab-ccard">
        <div class="ab-ctop"><p class="ab-ckind">${esc(b.kind)}</p><span class="ab-cchevw">${chev}</span></div>
        <p class="ab-cname">${esc(b.city)}</p>
      </div>
      <div class="ab-cdrop"><div class="ab-cin">
        <p class="ab-caddr">${pin}<span>${where}</span></p>
        <p class="ab-cacts"><a href="${esc(maps)}" target="_blank" rel="noopener noreferrer">Directions${arrow}</a><a href="${tel(tele)}">${phone}Call</a></p>
      </div></div>
    </li>`;
  };
  return `<ul class="ab-cities" aria-label="Towns we work in">${list.map(city).join("")}</ul>`;
}

export function aboutMarkup(d: AboutData) {
  const c = d.contact;
  const [hq] = c.regions;
  const since = Number.parseInt(d.founded, 10) || 2012;
  /*
   * Whole years certainly behind us. Only the founding year is known, so the
   * figure counts from the end of it: "13+" through 2026, never "14+" before
   * fourteen full years have passed. /about is pre-rendered, so this is worked
   * out at build time; it stays true afterwards ("at least"), and it moves up
   * by one with the first rebuild of each new year.
   */
  const years = Math.max(1, new Date().getFullYear() - since - 1);

  const head = banner({
    n: "01",
    label: "About RPC Constructions",
    title: "Waterproofing and construction in Erode since&nbsp;2012.",
    accentFrom: 5,
    intro:
      "We keep buildings dry. RPC Constructions repairs leaks in buildings already standing and builds new homes, offices and factories with their waterproofing designed in, from our office on Perundurai Road, Erode.",
    actions: `<a class="pg-btn pg-btn--ink" href="/contact#enquiry" data-internal>Book a free site inspection${arrow}</a><a class="pg-btn pg-btn--line" href="/services" data-internal>Our services</a>`,
    media: shot("/stages/06-structural-frame.jpg", "A building at the structural frame stage", "", true, {
      size: [1920, 1080],
      sizes: "(max-width: 899px) 100vw, 40vw",
    }),
    fact: { n: d.founded || "2012", label: "Founded in Erode" },
    cls: "ab-head",
  });

  /* three facts in a deep-blue panel; each number is in the markup, data-count lets a count-up run where scripts support it */
  const facts = [
    { n: years, suffix: "+", label: "years of waterproofing and building" },
    /* towns, not offices: only the Erode head office has its own address yet */
    { n: d.branches.length, suffix: "", label: "towns we work in across Tamil Nadu" },
    { n: d.services.length, suffix: "", label: "services, from leak repair to new buildings" },
  ];
  const statsPanel = `<div class="pg-panel--blue ab-stats">
      <ul class="pg-stats" style="--n:${facts.length}" aria-label="RPC in numbers" data-rv-stagger="90">${facts
        .map((f) => `<li data-rv><span class="pg-stat-n"><span data-count="${f.n}">${f.n}</span>${f.suffix}</span><span class="pg-stat-l">${esc(f.label)}</span></li>`)
        .join("")}</ul>
    </div>`;

  /*
   * TODO(content): the "Who we are" photo is a stand-in stage render
   * (/stages/10-exterior-finishing.jpg), not RPC's own work. Replace it with an
   * RPC photo (the team on site, or a finished RPC building) as soon as one is
   * supplied; until then its alt text describes a generic building stage only.
   */
  const who = `<section class="pg-sec pg-sec--white ab-who" aria-labelledby="ab-who-h">
  <div class="pg-wrap">
    <div class="ab-whogrid">
      <div class="ab-whoph" data-rv>
        <span class="pg-dots ab-dots" aria-hidden="true"></span>
        ${shot("/stages/10-exterior-finishing.jpg", "A building at the exterior finishing stage", "ab-whoimg", false, {
          size: [1920, 1080],
          sizes: "(max-width: 1023px) 100vw, 38vw",
        })}
      </div>
      <div class="ab-whocopy">
        ${mark("02", "Who we are")}
        <h2 class="pg-h2" id="ab-who-h" data-rv="words">${words("An engineer‑led waterproofing company that also builds.", 4)}</h2>
        ${d.story.map((p, i) => `<p class="${i === 0 ? "ab-lead" : "ab-p"}" data-rv>${esc(p)}</p>`).join("")}
      </div>
    </div>
    ${statsPanel}
  </div>
</section>`;

  const vm = `<section class="pg-sec pg-band pg-wave-top pg-wave-bottom ab-vm" aria-label="Vision and mission">
  <div class="pg-wrap">
    <div class="ab-vmgrid">
      <article class="ab-vision" aria-labelledby="ab-vision-h">
        <h2 class="pg-h2 ab-vh" id="ab-vision-h" data-rv="words">${words("Our vision", 1)}</h2>
        <div class="ab-vbody" data-rv>${quote}<p class="ab-vtext">${esc(d.vision)}</p></div>
      </article>
      <article class="ab-mission" aria-labelledby="ab-mission-h">
        <h2 class="pg-h2 ab-vh" id="ab-mission-h" data-rv="words">${words("Our mission", 1)}</h2>
        <ul data-rv-stagger="80">${d.mission.map((m, i) => `<li data-rv><span class="ab-mno">${two(i + 1)}</span><span class="ab-mtx">${esc(m)}</span></li>`).join("")}</ul>
      </article>
    </div>
  </div>
</section>`;

  const values = `<section class="pg-sec ab-values" aria-labelledby="ab-values-h">
  <div class="pg-wrap">
    <div class="ab-vhead">
      ${mark("03", "Our values")}
      <h2 class="pg-h2" id="ab-values-h" data-rv="words">${words("Six values on every site.", 2)}</h2>
    </div>
    <ul class="ab-vlist" data-rv-stagger="70">${d.principles
      .map(
        (p, i) =>
          `<li data-rv><div class="ab-vtop"><span class="pg-tile ab-vtile">${markOf(p.title)}</span><span class="ab-vno">${two(i + 1)}</span></div><h3 class="pg-h3">${esc(p.title)}</h3><p>${esc(p.body)}</p></li>`,
      )
      .join("")}</ul>
  </div>
</section>`;

  const where = `<section class="pg-sec pg-sec--white pg-seam ab-where" aria-labelledby="ab-where-h">
  <div class="pg-wrap">
    <div class="ab-wgrid">
      <div class="ab-wcopy">
        ${mark("04", "Where we work")}
        <h2 class="pg-h2" id="ab-where-h" data-rv="words">${words("Our branches across Tamil Nadu.", 2)}</h2>
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
/* ── who we are: a chamfered photo (dots behind its cut corner) beside the story, then a deep-blue stats panel overlapping the photo's foot ── */
.ab-whogrid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(2rem,5vw,5.5rem);align-items:center}
.ab-whoph{position:relative;align-self:end;min-width:0}
.ab-whoph>.pg-media{z-index:1}
.ab-whoimg{--ar:4/5}
.ab-dots{top:-1.5rem;left:-1.5rem}
.ab-whocopy{min-width:0;padding-bottom:5.5rem}
.ab-whocopy .pg-h2{margin-top:1rem}
.ab-lead{margin:1.5rem 0 0;max-width:40rem;font-family:var(--display);font-size:var(--fs-sub);font-weight:500;line-height:1.45;letter-spacing:-.01em;color:var(--ink);text-wrap:pretty}
.ab-p{margin:1.1rem 0 0;max-width:40rem;font-size:var(--fs-body);line-height:1.7;color:var(--ink2);text-wrap:pretty}
.ab-stats{z-index:2;margin:-3rem 0 0;padding:calc(12px + .2rem) clamp(1.4rem,3vw,2.6rem) .2rem}
.ab-stats .pg-stats>li{padding-block:clamp(1.3rem,3.2vh,2rem)}
.ab-stats .pg-stat-n{display:flex;align-items:baseline}

/* ── vision and mission: a full-width deep-blue band with a soft wave at both edges ── */
.ab-vmgrid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:clamp(2.4rem,6vw,6.5rem);align-items:start}
.ab-vh{max-width:none}
.ab-vbody{margin-top:clamp(1.6rem,4vh,2.4rem)}
.ab-q{display:block;width:2.4rem;height:1.8rem;color:var(--theme-focus-on-dark)}
.ab-vtext{margin:1rem 0 0;max-width:30ch;font-family:var(--display);font-weight:500;font-size:var(--fs-sub);line-height:1.45;letter-spacing:-.01em;color:var(--theme-on-dark);text-wrap:pretty}
.ab-mission ul{margin:clamp(1.6rem,4vh,2.4rem) 0 0;padding:0;list-style:none;border-bottom:1px solid color-mix(in srgb,var(--theme-white) 16%,transparent)}
.ab-mission li{display:grid;grid-template-columns:3rem minmax(0,1fr);align-items:baseline;gap:.5rem;padding:1.1rem 0;border-top:1px solid color-mix(in srgb,var(--theme-white) 16%,transparent);font-size:var(--fs-body);line-height:1.6}
.ab-mno{font-weight:600;font-variant-numeric:tabular-nums;color:var(--band-mute)}
.ab-mtx{color:var(--theme-on-dark)}

/* ── values: a 3×2 hairline grid of white cells, each with its drawn mark in a navy tile ──
   The cells are not links, so they have no hover state. Each cell draws a 1px ring into the 1px gap around it;
   the ring is an OPAQUE mix of ink over the section ground (the colour --line shows as here), so where two
   rings meet in a shared gap they do not stack into a darker line, and inner and outer hairlines match.
   (A ul painted in --line behind the cells would flash as a grey slab while the cells fade in one by one.) */
.ab-vhead{display:flex;flex-direction:column;align-items:flex-start;gap:1rem;margin-bottom:clamp(2rem,5vh,3rem)}
.ab-vlist{--vline:color-mix(in srgb,var(--theme-ink) 14%,var(--sand));display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;margin:0;padding:1px;list-style:none}
.ab-vlist>li{position:relative;display:flex;flex-direction:column;min-width:0;padding:1.75rem;background:var(--card);box-shadow:0 0 0 1px var(--vline)}
.ab-vtop{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem}
.ab-vno{font-size:var(--fs-body);font-weight:600;line-height:1;font-variant-numeric:tabular-nums;color:var(--mute)}
.ab-vlist .pg-h3{margin-top:1.5rem}
.ab-vlist p{margin:.55rem 0 0;font-size:var(--fs-body);line-height:1.6;color:var(--ink2);text-wrap:pretty}
@media (min-width:1024px){
  .ab-vlist>li:nth-child(1){border-top-left-radius:var(--r-card)}
  .ab-vlist>li:nth-child(3){border-top-right-radius:var(--r-card)}
  .ab-vlist>li:nth-child(4){border-bottom-left-radius:var(--r-card)}
  .ab-vlist>li:nth-child(6){border-bottom-right-radius:var(--r-card)}
}

/* ── where we work: the heading and its line side by side, then a row of city cards; each drops down its address ── */
.ab-where{z-index:3}
.ab-wgrid{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:1.2rem clamp(2rem,5vw,6rem);align-items:end}
.ab-wcopy .pg-h2{margin-top:1rem;max-width:18ch}
.ab-wlede{margin:0;max-width:34rem}
/* the head office comes first and a little wider, so its "Head office" pill and the chevron share one line at every
   desktop width (down to 900px) and its top row lines up with the Branch cards; the bottom margin leaves room for an
   open drop-down (an address up to three lines) above the closing panel */
.ab-cities{position:relative;z-index:2;display:grid;grid-template-columns:minmax(0,1.25fr) repeat(4,minmax(0,1fr));gap:.75rem;margin:clamp(2rem,5vh,3rem) 0 4.5rem;padding:0;list-style:none}
/* the whole li lifts (not just the card inside it), so the keyboard focus ring drawn on the li moves with the card */
.ab-city{position:relative;min-width:0;border-radius:var(--r-card);cursor:default;transition:transform .35s var(--ease)}
/* the lift shadow sits on its own layer, since the card's chamfer would clip it */
.ab-city::before{content:"";position:absolute;inset:0;border-radius:var(--r-card);box-shadow:var(--lift);opacity:0;transition:opacity .35s var(--ease);pointer-events:none}
.ab-ccard{position:relative;display:flex;flex-direction:column;justify-content:space-between;gap:1.75rem;height:100%;padding:1.25rem 1.15rem 1.3rem 1.3rem;overflow:hidden;border-radius:var(--r-card);background:linear-gradient(135deg,transparent calc(50% - 1px),var(--line) calc(50% - 1px) calc(50% + 1px),transparent calc(50% + 1px)) top left/var(--cut) var(--cut) no-repeat,var(--card);box-shadow:inset 0 0 0 1px var(--line);clip-path:polygon(var(--cut) 0,100% 0,100% 100%,0 100%,0 var(--cut))}
.ab-ccard::after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;background:var(--act);transform:scaleX(0);transform-origin:left;transition:transform .4s var(--ease);pointer-events:none}
.ab-ctop{display:flex;align-items:center;justify-content:space-between;gap:.5rem}
.ab-ckind{margin:0;padding:.2rem 0;font-size:var(--fs-body);font-weight:600;line-height:1.35;white-space:nowrap;color:var(--mute)}
.ab-city.is-hq .ab-ckind{padding:.2rem .65rem;border-radius:var(--r-ctl);background:var(--navy);color:var(--theme-on-dark)}
.ab-cchevw{display:grid;place-items:center;flex:none;width:1.9rem;height:1.9rem;border-radius:50%;box-shadow:inset 0 0 0 1px var(--line);color:var(--navy)}
.ab-cchev{width:1rem;height:1rem;transition:transform .35s var(--ease)}
.ab-cname{margin:0;font-family:var(--display);font-size:var(--fs-sub);font-weight:600;line-height:1.2;letter-spacing:-.01em;color:var(--ink);overflow-wrap:anywhere}
.ab-city:hover,.ab-city:focus-within{transform:translateY(-4px)}
.ab-city:hover::before,.ab-city:focus-within::before{opacity:1}
.ab-city:hover .ab-ccard::after,.ab-city:focus-within .ab-ccard::after{transform:scaleX(1)}
.ab-city:hover .ab-cchev,.ab-city:focus-within .ab-cchev{transform:rotate(180deg)}
/* the drop-down hangs under its city, over whatever follows (it opens only on hover, focus or tap); its top padding is a bridge for the pointer */
.ab-cdrop{position:absolute;top:100%;left:0;z-index:5;width:max(100%,18rem);padding-top:.6rem;opacity:0;visibility:hidden;transform:translateY(-6px);transition:opacity .22s var(--ease),transform .28s var(--ease),visibility 0s .28s}
.ab-city:last-child .ab-cdrop{left:auto;right:0}
.ab-cin{padding:1.1rem 1.15rem 1.15rem;border-radius:var(--r-card);background:var(--card);color:var(--ink);box-shadow:inset 0 0 0 1px var(--line),0 24px 44px -22px color-mix(in srgb,var(--theme-shadow) 50%,transparent)}
.ab-caddr{display:flex;gap:.55rem;margin:0;font-size:var(--fs-body);line-height:1.5;color:var(--ink2)}
.ab-cpin{flex:none;width:1.15rem;height:1.15rem;margin-top:.2rem;color:var(--accent)}
.ab-cacts{display:flex;flex-wrap:wrap;gap:.5rem;margin:.95rem 0 0}
.ab-cacts a{display:inline-flex;align-items:center;gap:.45rem;height:2.5rem;padding:0 1.05rem;border-radius:var(--r-pill);font-size:var(--fs-body);font-weight:600;line-height:1;text-decoration:none;white-space:nowrap;color:var(--ink);background:transparent;box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--theme-ink) 24%,transparent);transition:background-color .3s var(--ease),box-shadow .3s var(--ease),color .3s var(--ease)}
.ab-cacts a:first-child{background:var(--act);color:var(--on-act);box-shadow:none}
.ab-cacts a:first-child:hover,.ab-cacts a:first-child:focus-visible{background:var(--act-h)}
.ab-cacts a:not(:first-child):hover,.ab-cacts a:not(:first-child):focus-visible{box-shadow:inset 0 0 0 1.5px var(--act);background:color-mix(in srgb,var(--act) 10%,transparent)}
.ab-cacts .pg-ar{width:14px;height:14px}
.ab-cacts a:hover .pg-ar,.ab-cacts a:focus-visible .pg-ar{transform:translate(2px,-2px)}
.ab-cph{flex:none;width:1rem;height:1rem;color:var(--navy)}
.ab-city:hover .ab-cdrop,.ab-city:focus-within .ab-cdrop{opacity:1;visibility:visible;transform:none;transition:opacity .22s var(--ease),transform .28s var(--ease),visibility 0s}

@media (min-width:768px) and (max-width:1023px){
  .ab-vlist>li:nth-child(1){border-top-left-radius:var(--r-card)}
  .ab-vlist>li:nth-child(2){border-top-right-radius:var(--r-card)}
  .ab-vlist>li:nth-child(5){border-bottom-left-radius:var(--r-card)}
  .ab-vlist>li:nth-child(6){border-bottom-right-radius:var(--r-card)}
}
@media (max-width:1023px){
  .ab-whogrid{grid-template-columns:1fr;align-items:start}
  .ab-whoimg{--ar:16/10}
  .ab-whocopy{padding-bottom:0}
  .ab-stats{margin:clamp(2rem,5vh,2.8rem) 0 0}
  .ab-vmgrid{grid-template-columns:1fr}
  .ab-vlist{grid-template-columns:repeat(2,minmax(0,1fr))}
}
/* narrow desktops: a little less side padding, so "Coimbatore" and the HQ pill with its chevron still fit on one line */
@media (min-width:900px) and (max-width:1099px){
  .ab-ccard{padding:1.2rem 1rem 1.25rem 1.15rem}
}
/* narrow screens: the cities stack as cards; tapping one opens its address under it */
@media (max-width:899px){
  .ab-wgrid{grid-template-columns:1fr;align-items:start}
  .ab-cities{grid-template-columns:1fr;gap:.6rem;margin-bottom:0}
  .ab-city{cursor:pointer}
  .ab-city::before{display:none}
  .ab-ccard{gap:.7rem;padding:1.05rem 1.1rem 1.1rem 1.2rem}
  .ab-city:hover,.ab-city:focus-within{transform:none}
  .ab-cdrop{position:static;display:none;width:auto;padding-top:.5rem;opacity:1;visibility:visible;transform:none}
  .ab-city:hover .ab-cdrop,.ab-city:focus-within .ab-cdrop{display:block}
}
@media (max-width:767px){
  .ab-dots{top:-.75rem;left:-.75rem;width:6rem;height:6rem}
  .ab-stats{padding:calc(12px + .1rem) 1.2rem .1rem}
  .ab-stats .pg-stats>li:last-child{grid-column:1/-1}
  .ab-vlist{grid-template-columns:1fr}
  .ab-vlist>li{padding:1.4rem 1.25rem}
  .ab-vlist>li:first-child{border-radius:var(--r-card) var(--r-card) 0 0}
  .ab-vlist>li:last-child{border-radius:0 0 var(--r-card) var(--r-card)}
  .ab-mission li{grid-template-columns:2.4rem minmax(0,1fr)}
}
@media (prefers-reduced-motion:reduce){
  .ab-city:hover,.ab-city:focus-within{transform:none}
}
`;
