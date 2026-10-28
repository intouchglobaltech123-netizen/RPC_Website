/**
 * The rain test, on the waterproofing page: one drop's journey. A drawn cut
 * through the building, a slab under rain for water from above or a wall
 * against the soil for water from the ground, and one drop that travels into
 * it and stops at the layer the chosen method makes. With no waterproofing,
 * or with integral admixtures alone (which the methods document says do not
 * seal a crack on their own), the drop gets through and leaves a damp patch.
 * The words beside it say where that method stops the water.
 */
import { METHOD_GROUPS, METHODS } from "../methods/data";
import { esc } from "./kit";

/** where a method stops the water, and which way the water comes */
type Layer = "coat" | "sheet" | "outer" | "crystal" | "integral" | "inject" | "joint";
export const RAIN: Record<string, { from: "above" | "ground"; layer: Layer }> = {
  cementitious: { from: "above", layer: "coat" },
  "liquid-membrane": { from: "above", layer: "coat" },
  polyurethane: { from: "above", layer: "coat" },
  acrylic: { from: "above", layer: "coat" },
  polyurea: { from: "above", layer: "coat" },
  "torch-on": { from: "above", layer: "sheet" },
  injection: { from: "above", layer: "inject" },
  bituminous: { from: "ground", layer: "outer" },
  hdpe: { from: "ground", layer: "outer" },
  crystalline: { from: "ground", layer: "crystal" },
  integral: { from: "ground", layer: "integral" },
  waterstops: { from: "ground", layer: "joint" },
};

/** where the water stops, in a line, from what the document says each method does */
export const WHERE: Record<Layer | "none", string> = {
  none: "With nothing on it, water finds the hairline crack and comes through to the ceiling below.",
  coat: "On the surface: a coat over the slab and its hairline crack, so the water stays on top.",
  sheet: "On the surface: sheets lapped and sealed over the slab, so the water stays on top.",
  outer: "On the outside face, against the soil, so ground water never reaches the concrete.",
  crystal: "Inside the concrete: crystals grow in its pores and in the hairline crack, and block the water there.",
  integral: "Through the whole concrete, which lets less water in. The crack still needs its own treatment.",
  inject: "Inside the crack: resin pumped in seals the leak from within.",
  joint: "At the joint between two pours: the waterstop cast into it seals the weakest line.",
};

/** the layers' names, set over the drawing */
const LABEL = {
  rain: "Rain",
  slab: "Concrete slab",
  below: "Room below",
  soil: "Soil and ground water",
  wall: "Concrete wall",
  inside: "Room inside",
};

/** the cut through the building, drawn once; the layers show by the method picked */
function sceneSvg() {
  const streaks = Array.from({ length: 22 }, (_, i) => {
    const x = 60 + ((i * 397) % 840);
    const y = 8 + ((i * 53) % 110);
    return `<path d="M${x} ${y}l-6 22" style="animation-delay:-${((i * 0.137) % 1.1).toFixed(2)}s"/>`;
  }).join("");
  const stones = (x0: number, x1: number, y0: number, y1: number, n: number, cls: string) =>
    Array.from({ length: n }, (_, i) => {
      const x = x0 + ((i * 131) % (x1 - x0));
      const y = y0 + ((i * 71) % (y1 - y0));
      const r = 2 + ((i * 7) % 4);
      return `<circle class="${cls}" cx="${x}" cy="${y}" r="${r}"/>`;
    }).join("");
  const drop = `<path d="M0 -17C6 -7 11 -1 11 5A11 11 0 0 1 -11 5C-11 -1 -6 -7 0 -17Z"/>`;
  return `<svg class="rt-svg" viewBox="0 0 960 540" aria-hidden="true" focusable="false">
  <g class="sc sc-above">
    <rect class="f-sky" x="0" y="0" width="960" height="214"/>
    <g class="rt-rain">${streaks}</g>
    <rect class="f-air" x="0" y="350" width="960" height="190"/>
    <rect class="f-slab" x="0" y="214" width="960" height="136"/>
    ${stones(10, 950, 228, 340, 70, "f-agg")}
    <path class="f-crack" d="M480 214l-5 26 9 22-7 24 6 30-4 34"/>
    <rect class="ly ly-coat ly-sheet" x="0" y="196" width="960" height="18"/>
    <path class="ly ly-sheet f-lap" d="M300 196v18M640 196v18"/>
    <path class="ly ly-inject f-resin" d="M480 214l-5 26 9 22-7 24 6 30-4 34"/>
    <path class="f-ceil" d="M0 350h960"/>
    <ellipse class="stain stain-above" cx="480" cy="362" rx="120" ry="16"/>
  </g>
  <g class="sc sc-ground">
    <rect class="f-sky" x="0" y="0" width="960" height="110"/>
    <rect class="f-soil" x="0" y="110" width="330" height="430"/>
    ${stones(12, 318, 130, 530, 46, "f-pebble")}
    <path class="f-grass" d="M0 110h330"/>
    <rect class="f-air" x="560" y="0" width="400" height="540"/>
    <rect class="f-slab" x="352" y="0" width="208" height="540"/>
    ${stones(362, 552, 10, 530, 60, "f-agg")}
    <path class="f-joint" d="M352 300h208"/>
    <rect class="ly ly-outer" x="330" y="110" width="22" height="430"/>
    <g class="ly ly-crystal">${stones(360, 470, 150, 470, 34, "f-xtal")}</g>
    <path class="ly ly-joint f-stop" d="M440 270v60M424 278h32M424 300h32M424 322h32"/>
    <rect class="ly ly-integral" x="352" y="0" width="208" height="540"/>
    <path class="f-crack" d="M352 300h208"/>
    <path class="f-floor" d="M560 470h400"/>
    <ellipse class="stain stain-ground" cx="566" cy="300" rx="14" ry="110"/>
  </g>
  <polyline class="rt-trail" points=""/>
  <circle class="rt-ring" r="14"/>
  <g class="rt-dropg" style="transform:translate(480px,180px)">${drop}</g>
</svg>`;
}

export function rainMarkup() {
  const chips = METHOD_GROUPS.map(
    (g) =>
      `<div class="rt-group rt-group--${g.key}"><p class="rt-gh"><i class="rt-sw" aria-hidden="true"></i>${esc(g.label)}</p><div class="rt-opts">${METHODS.filter((m) => m.group === g.key && RAIN[m.key])
        .map((m) => `<button type="button" class="rt-chip" data-rain="${m.key}" aria-pressed="false"><i class="rt-r" aria-hidden="true"></i><span>${esc(m.short)}</span></button>`)
        .join("")}</div></div>`,
  ).join("");
  const tag = (cls: string, text: string) => `<span class="rt-lb ${cls}">${esc(text)}</span>`;
  return `<section class="pg-sec rt-sec" id="rain-test" data-lb-zone aria-labelledby="rt-h" data-rain-test>
  <div class="pg-wrap">
    <div class="rt" data-from="above" data-leak>
      <div class="rt-head">
        <div><p class="pg-mark">Rain test</p><h2 class="pg-h2" id="rt-h">Follow one drop of rain.</h2></div>
        <p class="pg-lede">Pick a method below. The drop travels into the building and stops at the layer that method makes. The right method for your building is chosen on site.</p>
      </div>
      <div class="rt-stage">
        <figure class="rt-scene" role="img" aria-labelledby="rt-cap">
          ${sceneSvg()}
          ${tag("lb-rain", LABEL.rain)}${tag("lb-slab", LABEL.slab)}${tag("lb-below", LABEL.below)}
          ${tag("lb-soil", LABEL.soil)}${tag("lb-wall", LABEL.wall)}${tag("lb-inside", LABEL.inside)}
          <span class="rt-lb lb-wp"><b class="rt-wpname">No waterproofing</b></span>
          <span class="rt-lb lb-damp">Damp patch</span>
        </figure>
        <div id="rt-cap" class="rt-info" aria-live="polite">
          <p class="rt-kind">No waterproofing</p>
          <p class="rt-name">Bare concrete</p>
          <p class="rt-where">${esc(WHERE.none)}</p>
          <p class="rt-mind" hidden></p>
          <button type="button" class="rt-again" data-rain-again><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5"/></svg>Drop again</button>
        </div>
      </div>
      <p class="rt-step" aria-hidden="true"><b>Pick a method</b><span>Swipe for more</span></p>
      <div class="rt-pick" role="group" aria-label="Choose a method">
        <div class="rt-group rt-group--none"><p class="rt-gh"><i class="rt-sw" aria-hidden="true"></i>Start with</p><div class="rt-opts"><button type="button" class="rt-chip" data-rain="none" aria-pressed="true"><i class="rt-r" aria-hidden="true"></i><span>No waterproofing</span></button></div></div>
        ${chips}
      </div>
    </div>
  </div>
</section>`;
}

export const RAIN_CSS = `
/* the rain test: one screen. The heading; the drawing of one drop's journey beside the words; the methods in one band under them */
.rt-sec{scroll-margin-top:var(--nav-bar,80px)}
.rt-step{display:none}
/* the last section on the page: 70px of sand before the footer (which rises 32px over it) */
.rt-sec{padding-bottom:calc(70px + 32px) !important}
.rt{display:flex;flex-direction:column;gap:clamp(.9rem,2vh,1.3rem)}
.rt-head{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:.6rem 3rem;align-items:end}
.rt-head .pg-h2{margin-top:.5rem}
.rt-head .pg-lede{margin:0;max-width:36rem}
.rt-stage{display:grid;grid-template-columns:auto minmax(16rem,1fr);gap:.8rem;align-items:stretch}

/* the drawing: a cut through the slab (water from above) or through the wall against the soil (water from the ground) */
.rt-scene{position:relative;aspect-ratio:16/9;height:min(32rem,calc(100svh - var(--nav-bar,80px) - 19rem),calc((min(100vw,1360px) - 30rem) * .5625));min-height:14rem;margin:0;overflow:hidden;border-radius:16px;background:#dfe6ee;box-shadow:inset 0 0 0 1px var(--line),0 30px 60px -40px rgba(18,34,59,.45)}
.rt-svg{position:absolute;inset:0;width:100%;height:100%;display:block}
.rt-svg .sc{display:none}
.rt[data-from=above] .sc-above,.rt[data-from=ground] .sc-ground{display:inline}
.f-sky{fill:#d6e0ea}
.f-air{fill:#f5f0e6}
.f-slab{fill:#c9c2b4}
.f-agg{fill:#ada595}
.f-soil{fill:#8a6a48}
.f-pebble{fill:#6f5236}
.f-grass{stroke:#4f7a3a;stroke-width:8;fill:none}
.f-crack{fill:none;stroke:#5b544a;stroke-width:3;stroke-linejoin:round}
.f-ceil,.f-floor{stroke:rgba(18,34,59,.35);stroke-width:2;fill:none}
.f-joint{stroke:#8f8778;stroke-width:2;stroke-dasharray:6 6;fill:none}
.rt-rain path{stroke:#7d9ab8;stroke-width:2.2;stroke-linecap:round;fill:none;opacity:.7}
@media (prefers-reduced-motion:no-preference){.rt-rain path{animation:rt-fall 1.1s linear infinite}}
@keyframes rt-fall{from{transform:translate(0,-30px);opacity:0}30%{opacity:.75}to{transform:translate(-8px,60px);opacity:0}}
/* the method's layer: the colour of its kind */
.ly{opacity:0;transition:opacity .45s}
.rt{--k:#2756a0}
.rt[data-group=sheet]{--k:#a35f10}.rt[data-group=concrete]{--k:#1f7a4f}.rt[data-group=joint]{--k:#6a4c9c}
rect.ly,.ly circle{fill:var(--k)}
.ly-integral{fill-opacity:.22}
.f-lap{stroke:rgba(255,255,255,.7);stroke-width:2;fill:none}
.f-resin{fill:none;stroke:var(--k);stroke-width:7;stroke-linecap:round;stroke-linejoin:round}
.f-stop{fill:none;stroke:var(--k);stroke-width:6;stroke-linecap:round}
.rt[data-layer=coat] .ly-coat,.rt[data-layer=sheet] .ly-sheet,.rt[data-layer=inject] .ly-inject,.rt[data-layer=outer] .ly-outer,.rt[data-layer=crystal] .ly-crystal,.rt[data-layer=joint] .ly-joint,.rt[data-layer=integral] .ly-integral{opacity:1}
/* the damp patch, only when the drop gets through */
.stain{fill:#8a5a2b;opacity:0;transform-box:fill-box;transform-origin:center;transform:scale(.4);transition:opacity .6s,transform .6s}
.rt.is-wet[data-leak] .stain{opacity:.28;transform:scale(1)}
/* the drop, and the ring where it stops */
.rt-dropg path{fill:#2f7fd0;stroke:#fff;stroke-width:2.5}
.rt-trail{fill:none;stroke:#2f7fd0;stroke-width:2.5;stroke-dasharray:2 9;stroke-linecap:round;opacity:0;transition:opacity .4s}
.rt.is-stop .rt-trail{opacity:.7}
.rt-ring{fill:none;stroke:#2f7fd0;stroke-width:3;opacity:0}
.rt.is-stop:not([data-leak]) .rt-ring{animation:rt-ring .9s ease-out}
@keyframes rt-ring{from{opacity:.9;r:10}to{opacity:0;r:60}}
/* the names over the drawing */
.rt-lb{position:absolute;z-index:1;display:none;padding:.2rem .55rem;border-radius:999px;background:rgba(255,255,255,.82);font-size:var(--fs-body);font-weight:600;line-height:1.3;color:var(--ink);white-space:nowrap;pointer-events:none}
.rt[data-from=above] :is(.lb-rain,.lb-slab,.lb-below),.rt[data-from=ground] :is(.lb-soil,.lb-wall,.lb-inside){display:block}
.lb-rain{left:3%;top:5%}.lb-slab{left:3%;top:46%}.lb-below{left:3%;top:86%}
.lb-soil{left:2.5%;top:24%}.lb-wall{left:37.5%;top:5%}.lb-inside{right:3%;top:5%}
.lb-wp{display:block;background:var(--k);color:#fff}
.rt-wpname{font-weight:600}
.rt[data-from=above] .lb-wp{right:3%;top:30%}
.rt[data-from=ground] .lb-wp{left:37.5%;top:86%}
.rt[data-from=above][data-leak]:not([data-layer]) .lb-wp{top:30%;background:#a2452c}
.rt[data-leak] .lb-wp{background:#a2452c}
.lb-damp{background:#a2452c;color:#fff;opacity:0;transition:opacity .4s}
.rt[data-from=above] .lb-damp{left:50%;top:72%;transform:translateX(-50%)}
.rt[data-from=ground] .lb-damp{left:62%;top:52%}
.rt.is-wet[data-leak] .lb-damp{display:block;opacity:1}

/* the words beside it */
.rt-info{display:flex;flex-direction:column;gap:.35rem;padding:1.1rem 1.2rem;border-radius:16px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line)}
.rt-kind{margin:0;font-size:var(--fs-body);font-weight:600;color:var(--k)}
.rt[data-leak] .rt-kind{color:#a2452c}
.rt-name{margin:0;font-family:var(--display);font-size:var(--fs-sub);font-weight:600;line-height:1.2;letter-spacing:-.01em}
.rt-where{margin:.2rem 0 0;font-size:var(--fs-body);line-height:1.55;color:var(--ink)}
.rt-mind{margin:.4rem 0 0;padding:.55rem .75rem;border-radius:10px;background:rgba(18,34,59,.05);font-size:var(--fs-body);line-height:1.5;color:var(--ink2)}
.rt-mind[hidden]{display:none}
.rt-again{display:inline-flex;align-items:center;gap:.45rem;align-self:flex-start;margin:auto 0 0;padding:.45rem .9rem;border:0;border-radius:999px;background:rgba(18,34,59,.07);font:inherit;font-size:var(--fs-body);font-weight:600;color:var(--ink);cursor:pointer;transition:background-color .2s}
.rt-again:hover{background:rgba(18,34,59,.13)}
.rt-again:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.rt-again svg{width:1.1rem;height:1.1rem}
.rt:not(.is-live) .rt-again{display:none}

/* the methods: each kind a small card with its colour, the methods in it as rows with a round marker */
.rt-pick{display:grid;grid-template-columns:repeat(5,max-content);justify-content:space-between;gap:.5rem}
.rt-pick .rt-chip{white-space:nowrap}
.rt:not(.is-live) .rt-pick{display:none}
.rt-group{--k:#2756a0;padding:.55rem .55rem .5rem;border-radius:12px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line)}
.rt-group--sheet{--k:#a35f10}.rt-group--concrete{--k:#1f7a4f}.rt-group--joint{--k:#6a4c9c}.rt-group--none{--k:#a2452c}
.rt-gh{display:flex;align-items:center;gap:.45rem;margin:0 0 .2rem;padding:0 .35rem;font-size:var(--fs-body);font-weight:600;color:var(--ink)}
.rt-sw{width:.7rem;height:.7rem;border-radius:3px;background:var(--k)}
.rt-opts{display:grid;grid-template-columns:minmax(0,1fr);gap:.15rem}
.rt-group--coat .rt-opts{grid-template-columns:repeat(3,max-content)}
.rt-chip{display:flex;align-items:center;gap:.4rem;min-height:2rem;padding:.25rem .4rem;border:0;border-radius:8px;background:none;font:inherit;font-size:var(--fs-body);font-weight:500;line-height:1.25;color:var(--ink2);text-align:left;cursor:pointer;transition:background-color .2s,color .2s}
.rt-chip span{min-width:0}
.rt-r{flex:none;display:grid;place-items:center;width:1rem;height:1rem;border-radius:50%;box-shadow:inset 0 0 0 1.5px rgba(18,34,59,.3);transition:box-shadow .2s}
.rt-r::after{content:"";width:.42rem;height:.42rem;border-radius:50%;background:#fff;transform:scale(0);transition:transform .2s}
.rt-chip:hover{background:rgba(18,34,59,.05);color:var(--ink)}
.rt-chip:hover .rt-r{box-shadow:inset 0 0 0 1.5px var(--k)}
.rt-chip:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
.rt-chip[aria-pressed=true]{background:var(--k);color:#fff;font-weight:600}
.rt-chip[aria-pressed=true] .rt-r{box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.85)}
.rt-chip[aria-pressed=true] .rt-r::after{transform:scale(1)}

@media (min-width:1024px) and (min-height:680px){
  .rt-sec{display:flex;align-items:center;min-height:calc(100svh - var(--nav-bar,80px));padding-block:clamp(1.2rem,3vh,2.4rem)}
  .rt-sec > .pg-wrap{width:100%}
}
@media (max-width:1320px){
  .rt-pick{grid-template-columns:repeat(3,minmax(0,1fr));justify-content:stretch}
  .rt-pick .rt-chip{white-space:normal}
  .rt-group--coat{grid-column:span 2}
  .rt-group--coat .rt-opts{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (max-width:1023px){
  .rt-head{grid-template-columns:minmax(0,1fr)}
  .rt-stage{grid-template-columns:minmax(0,1fr)}
  .rt-scene{width:100%;height:auto;min-height:0}
}
@media (max-width:599px){
  /* phones: the methods in one row that swipes sideways; the drawing keeps only the method's name */
  .rt-pick{display:flex;align-items:flex-start;gap:.5rem;margin-inline:calc(var(--gutter,1.25rem) * -1);padding:0 var(--gutter,1.25rem) .3rem;overflow-x:auto;scroll-snap-type:x proximity;scroll-padding-inline:var(--gutter,1.25rem);scrollbar-width:none}
  .rt-pick::-webkit-scrollbar{display:none}
  .rt-group{flex:none;scroll-snap-align:start}
  .rt-opts,.rt-group--coat .rt-opts{display:flex;flex-wrap:nowrap}
  .rt-chip{white-space:nowrap}
  .rt[data-from] :is(.lb-rain,.lb-below,.lb-soil,.lb-inside){display:none}
  .rt-lb{padding:.1rem .45rem}
}
`;

/* ------------------------------------------------------------ in the browser */

interface RainMethod {
  key: string;
  short: string;
  kind: string;
  mind: string;
}

/** where the drop starts, and where it stops, in the drawing's units, for each way the water comes and each layer */
const START = { above: [480, 20], ground: [60, 300] } as const;
const STOP: Record<string, readonly [number, number][]> = {
  "above:none": [[480, 200], [478, 352], [480, 372]],
  "above:coat": [[480, 180]],
  "above:sheet": [[480, 180]],
  "above:inject": [[480, 200], [477, 236]],
  "ground:outer": [[316, 300]],
  "ground:crystal": [[404, 300]],
  "ground:joint": [[410, 300]],
  "ground:integral": [[548, 300], [574, 300]],
};

/** wire the rain test: pick a method, the drawing and the words follow, and one drop shows where the water stops */
export function mountRain(root: HTMLElement, methods: readonly RainMethod[]): () => void {
  const sec = root.querySelector<HTMLElement>("[data-rain-test]");
  const rt = sec?.querySelector<HTMLElement>(".rt");
  if (!sec || !rt) return () => {};
  const chips = Array.from(sec.querySelectorAll<HTMLButtonElement>("[data-rain]"));
  const q = <T extends Element>(s: string) => sec.querySelector<T>(s);
  const by = new Map(methods.map((m) => [m.key, m]));
  const drop = q<SVGGElement>(".rt-dropg");
  const ring = q<SVGCircleElement>(".rt-ring");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const offs: (() => void)[] = [];
  let anim: Animation | null = null;
  let timer = 0;
  let key = "none";
  let seen = false;

  /** send the drop on its way, from where the water comes to where the method stops it */
  const fall = () => {
    if (!drop) return;
    const r = RAIN[key];
    const from = r?.from ?? "above";
    const path = STOP[`${from}:${r?.layer ?? "none"}`] ?? STOP["above:none"]!;
    const [sx, sy] = START[from];
    const pts = [[sx, sy] as const, ...path];
    const end = pts[pts.length - 1]!;
    const at = (p: readonly [number, number]) => `translate(${p[0]}px, ${p[1]}px)`;
    anim?.cancel();
    window.clearTimeout(timer);
    rt.classList.remove("is-stop", "is-wet");
    if (ring) ring.setAttribute("transform", `translate(${end[0]} ${end[1]})`);
    q<SVGPolylineElement>(".rt-trail")?.setAttribute("points", pts.map((p) => p.join(",")).join(" "));
    if (reduced || typeof drop.animate !== "function") {
      drop.style.transform = at(end);
      rt.classList.add("is-stop", "is-wet");
      return;
    }
    const n = pts.length - 1;
    const frames = pts.map((p, i) => ({ transform: at(p), offset: i / n, easing: i === 0 ? "cubic-bezier(.5,0,.9,.6)" : "linear" }));
    drop.style.transform = at(pts[0]!);
    anim = drop.animate(frames, { duration: 1100 + 650 * (n - 1), fill: "forwards" });
    anim.onfinish = () => {
      rt.classList.add("is-stop");
      timer = window.setTimeout(() => rt.classList.add("is-wet"), 120);
    };
  };

  const show = (k: string) => {
    key = k;
    const r = RAIN[k];
    const m = by.get(k);
    const from = r?.from ?? "above";
    const layer = r?.layer;
    const leak = !r || layer === "integral";
    rt.dataset.from = from;
    if (layer) rt.dataset.layer = layer;
    else delete rt.dataset.layer;
    if (leak) rt.dataset.leak = "";
    else delete rt.dataset.leak;
    const group = METHODS.find((x) => x.key === k)?.group;
    if (group) rt.dataset.group = group;
    else delete rt.dataset.group;
    const ground = from === "ground";
    const wp = q<HTMLElement>(".rt-wpname");
    if (wp) wp.textContent = m ? (layer === "integral" ? `${m.short}: the crack still leaks` : m.short) : "No waterproofing";
    const kind = q<HTMLElement>(".rt-kind");
    const title = q<HTMLElement>(".rt-name");
    const where = q<HTMLElement>(".rt-where");
    const mind = q<HTMLElement>(".rt-mind");
    if (kind) kind.textContent = m ? `${m.kind} · ${ground ? "water from the ground" : "water from above"}` : "No waterproofing";
    if (title) title.textContent = m ? m.short : "Bare concrete";
    if (where) where.textContent = WHERE[layer ?? "none"];
    if (mind) {
      mind.hidden = !m;
      mind.textContent = m ? `Keep in mind: ${m.mind.charAt(0).toLowerCase()}${m.mind.slice(1)}.` : "";
    }
    chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.rain === k)));
    if (seen) fall();
  };

  const onClick = (e: Event) => {
    const t = e.target as Element;
    const c = t.closest<HTMLButtonElement>("[data-rain]");
    if (c) show(c.dataset.rain!);
    else if (t.closest("[data-rain-again]")) fall();
  };
  sec.addEventListener("click", onClick);
  rt.classList.add("is-live");
  show("none");
  // the first drop falls when the drawing comes into view
  const scene = q<HTMLElement>(".rt-scene");
  if (scene && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        io.disconnect();
        seen = true;
        fall();
      },
      { threshold: 0.45 },
    );
    io.observe(scene);
    offs.push(() => io.disconnect());
  } else {
    seen = true;
    fall();
  }
  return () => {
    sec.removeEventListener("click", onClick);
    offs.forEach((f) => f());
    anim?.cancel();
    window.clearTimeout(timer);
    rt.classList.remove("is-live", "is-stop", "is-wet");
  };
}
