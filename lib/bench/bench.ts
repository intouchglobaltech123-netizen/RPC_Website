/**
 * The test bench: side-by-side tests of two kinds of product, run by dragging
 * a slider (or pressing play). Each test is two small drawings that react to
 * one number, --t (0 to 1), set on the bench by the slider. The drawings are
 * plain SVG and CSS, so the server renders them and they stay sharp at any size.
 *
 * Used on the products page (all five tests) and on the home page (the same
 * bench, a little more compact). Each test sets a kind of product RPC lists
 * beside the usual alternative; products are named only on the side the
 * spreadsheet supports (its category and purpose), never as the one that fails.
 */

export type BenchId = "rain" | "crack" | "spill" | "slump" | "seep";
export interface BenchSide {
  label: string;
  caption: string;
  /** product slugs (see lib/products) */
  products: readonly string[];
}
export interface BenchTest {
  id: BenchId;
  /** the tab's label */
  tab: string;
  title: string;
  /** what the slider does */
  control: string;
  /** read out by screen readers at the start, middle and end of the slider */
  states: readonly [string, string, string];
  a: BenchSide;
  b: BenchSide;
  result: string;
  /** a film of the same test, when there is one (shown whole, nothing over it) */
  video?: { src: string; poster?: string; caption: string; width: number; height: number };
}

export const BENCH_TESTS: readonly BenchTest[] = [
  {
    id: "rain",
    tab: "Rain",
    title: "Rain on bare concrete and on a coated slab",
    control: "Rain",
    states: ["Dry, before the rain", "Raining", "After a long spell of rain"],
    a: { label: "Bare concrete", caption: "Water soaks in and keeps going down.", products: [] },
    b: { label: "Cementitious waterproof coat", caption: "Water stays on top and runs off.", products: ["fosroc-brushbond-grey", "sika-seal-550", "fosroc-nitocote-cm210-white"] },
    result: "Concrete is full of tiny pores. A waterproof coat closes them at the surface, so the water has nowhere to go but off.",
  },
  {
    id: "crack",
    tab: "Crack",
    title: "A crack opens under two kinds of coat",
    control: "Crack movement",
    states: ["Crack closed", "Crack opening", "Crack wide open"],
    a: { label: "Rigid coat", caption: "Cracks with the slab, and the water follows.", products: [] },
    b: { label: "Flexible cementitious coat", caption: "Stretches across the gap and keeps sealing.", products: ["fosroc-brushbond-rfx-grey"] },
    result: "Slabs move with heat and load. Where a crack can open, on balconies, wet areas and tank walls, a flexible coat keeps the seal.",
  },
  {
    id: "spill",
    tab: "Spill",
    title: "A spill on cement grout and on epoxy grout",
    control: "Spill, then wipe",
    states: ["Clean tiles", "Spilled", "Wiped"],
    a: { label: "Ordinary cement grout", caption: "Porous, so the spill soaks into the joint.", products: [] },
    b: { label: "Epoxy grout", caption: "Stain-resistant: it wipes clean, joints and all.", products: ["berger-hs-epoxy-tile-grout"] },
    result: "Epoxy grout resists stains and chemicals, which is why it goes into bathrooms, kitchens and hospitals.",
  },
  {
    id: "slump",
    tab: "Slump",
    title: "The same water, two concrete mixes",
    control: "Lift the cone",
    states: ["Cone in place", "Lifting the cone", "Cone lifted"],
    a: { label: "Plain mix", caption: "Stays stiff and hard to place.", products: [] },
    b: { label: "With a superplasticiser", caption: "Flows into place with no extra water.", products: ["fosroc-conplast-sp430", "fosroc-auramix-300", "cci-novaplast-8200", "sika-plast-5132-t"] },
    result: "More water makes concrete easier to pour but weaker. A superplasticiser gives the flow without the extra water.",
  },
  {
    id: "seep",
    tab: "Seepage",
    title: "Water against a tank wall, month after month",
    control: "Time in service",
    states: ["Just filled", "Months on", "Years on"],
    a: { label: "Plain concrete", caption: "Water creeps through the pores to the dry side.", products: [] },
    b: { label: "With a crystalline admixture", caption: "Crystals grow in the pores and close the way.", products: ["fosroc-conplast-crystalline"] },
    result: "In tanks, sumps and basements the concrete itself can hold the water back, before any coat goes on.",
  },
];

/* ------------------------------------------------------------ drawing */

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
/** a product's name with its brand marked, never repeated ("Sika Seal 550", not "Sika Sika Seal 550") */
export const brandName = (brand: string, name: string) =>
  name.toLowerCase().startsWith(`${brand.toLowerCase()} `) ? `<span>${esc(name.slice(0, brand.length))}</span>${esc(name.slice(brand.length))}` : `<span>${esc(brand)}</span> ${esc(name)}`;

/** aggregate specks in a block of concrete, the same every time */
function specks(x: number, y: number, w: number, h: number, n: number, seed: number) {
  let s = seed;
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  let out = "";
  for (let i = 0; i < n; i++) {
    const cx = (x + 3 + r() * (w - 6)).toFixed(1);
    const cy = (y + 3 + r() * (h - 6)).toFixed(1);
    const rad = (0.6 + r() * 1.3).toFixed(2);
    out += `<circle cx="${cx}" cy="${cy}" r="${rad}" class="bn-sp${i % 3}"/>`;
  }
  return out;
}
/** falling drops: [x, delay] pairs, falling from y0 (the top by default) and landing at y */
const drops = (xs: readonly (readonly [number, string])[], land: number, cls = "bn-drop", from = 12) =>
  xs
    .map(([x, d]) => `<path class="${cls}" style="--x:${x}px;--y0:${from}px;--y:${land}px;--d:${d}" d="M0 -9c-2.6 4.6-3.6 7.2-3.6 8.6a3.6 3.6 0 0 0 7.2 0c0-1.4-1-4-3.6-8.6z"/>`)
    .join("");
const RAIN: readonly (readonly [number, string])[] = [
  [52, "-.15s"],
  [98, "-.62s"],
  [131, "-.34s"],
  [189, "-.86s"],
  [232, "-.2s"],
  [276, "-.71s"],
];

const svg = (inner: string, cls: string) => `<svg class="bn-svg ${cls}" viewBox="0 12 320 188" aria-hidden="true" focusable="false">${inner}</svg>`;

function rainScene(side: "a" | "b") {
  const slab = `<rect class="bn-c" x="20" y="122" width="280" height="62" rx="4"/>${specks(20, 122, 280, 62, 34, side === "a" ? 7 : 11)}`;
  if (side === "a")
    return svg(
      `<g class="bn-rain">${drops(RAIN, 121)}</g>
<g>${slab}<rect class="bn-wet" x="20" y="122" width="280" height="62" rx="4"/><rect class="bn-sheen" x="20" y="120" width="280" height="5" rx="2.5"/></g>
<g class="bn-under">${drops([[160, "-.3s"], [118, "-.9s"], [204, "-.55s"]], 206, "bn-drop bn-drop--slow", 192)}</g>`,
      "bn-rain-a",
    );
  const beads = [40, 70, 98, 122, 151, 178, 206, 233, 259, 284]
    .map((x, i) => `<ellipse class="bn-bead" style="--i:${(i * 7) % 10}" cx="${x}" cy="112.6" rx="4.2" ry="3.4"/>`)
    .join("");
  return svg(
    `<g class="bn-rain">${drops(RAIN, 113)}</g>
<g>${slab}<rect class="bn-coat" x="18" y="115" width="284" height="8" rx="3"/><rect class="bn-coathl" x="21" y="115.4" width="278" height="1.6" rx=".8"/></g>
<g class="bn-beads">${beads}</g>
<g class="bn-run">${drops([[304, "-.2s"], [304, "-.75s"]], 204, "bn-drop bn-drop--run", 126)}</g>`,
    "bn-rain-b",
  );
}

function crackScene(side: "a" | "b") {
  const edge = "L156 136 L163 150 L157 164 L162 176 L159 184";
  const left = `<path class="bn-c" d="M20 122 H160 ${edge} H20 Z"/>${specks(20, 122, 134, 62, 16, side === "a" ? 3 : 5)}`;
  const right = `<path class="bn-c" d="M160 122 H300 V184 H159 L162 176 L157 164 L163 150 L156 136 Z"/>${specks(166, 122, 134, 62, 16, side === "a" ? 9 : 13)}`;
  const coat = side === "a" ? "bn-coat" : "bn-coat bn-coat--flex";
  const broken =
    side === "a"
      ? `<g class="bn-broke"><path d="M156 114 l3 4 -3 4z"/><path d="M164 114 l-3 4 3 4z"/></g>
<g class="bn-leak">${drops([[160, "-.1s"], [160, "-.45s"], [160, "-.8s"]], 204, "bn-drop bn-drop--leak", 120)}</g>`
      : "";
  return svg(
    `<g class="bn-rain">${drops([[48, "-.15s"], [92, "-.62s"], [134, "-.34s"], [214, "-.86s"], [258, "-.2s"]], 112)}</g>
<g class="bn-halfl"><g>${left}</g><rect class="${coat}" x="18" y="114" width="142" height="8" rx="3"/></g>
<g class="bn-halfr"><g>${right}</g><rect class="${coat}" x="160" y="114" width="142" height="8" rx="3"/></g>
<rect class="${coat} bn-bridge" x="148" y="114" width="24" height="8"/>
${broken}
<g class="bn-gauge"><path class="bn-gl" d="M148 93 l-6 5 6 5"/><path class="bn-gr" d="M172 93 l6 5 -6 5"/></g>`,
    `bn-crack-${side}`,
  );
}

function spillScene(side: "a" | "b") {
  const tiles = [
    [40, 22],
    [164, 22],
    [40, 106],
    [164, 106],
  ]
    .map(([x, y]) => `<rect class="bn-tile" x="${x}" y="${y}" width="114" height="76" rx="3"/><path class="bn-tilehl" d="M${x! + 8} ${y! + 10} h40"/>`)
    .join("");
  const grout = side === "a" ? "bn-grout" : "bn-grout bn-grout--epoxy";
  return svg(
    `<rect class="${grout}" x="40" y="22" width="238" height="160" rx="3"/>
${tiles}
<g class="bn-gstain"><rect x="154" y="58" width="10" height="92"/><rect x="118" y="98" width="82" height="8"/></g>
<path class="bn-spillb" d="M160 70c19 0 35 11 37 27 2 19-14 35-35 35-23 0-41-12-39-31 2-17 18-31 37-31z"/>
<g class="bn-cloth"><rect x="0" y="16" width="64" height="170" rx="14"/><path d="M14 30v140M30 30v140M46 30v140"/></g>`,
    `bn-spill-${side}`,
  );
}

function slumpScene(side: "a" | "b") {
  const body = `<path class="bn-mix" d="M138 76 H182 L206 175 H114 Z"/>${specks(124, 82, 72, 90, 22, side === "a" ? 17 : 19).replace(/class="bn-sp/g, 'class="bn-ag')}`;
  const flow =
    side === "b"
      ? `<g class="bn-flow"><path class="bn-mix" d="M44 175 C64 160 104 152 160 152 C216 152 256 160 276 175 Z"/>${specks(70, 158, 180, 15, 22, 23).replace(/class="bn-sp/g, 'class="bn-ag')}</g>`
      : "";
  return svg(
    `<rect class="bn-plate" x="30" y="175" width="260" height="8" rx="2"/>
<g class="bn-ruler"><path d="M286 74 V175"/>${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M281 ${76 + i * 20} h5"/>`).join("")}</g>
${flow}
<g class="bn-heap">${body}</g>
<path class="bn-level" d="M110 76 H290"/>
<g class="bn-cone"><path d="M136 72 H184 L210 177 H110 Z"/><path d="M128 120 h-10 M192 120 h10"/></g>`,
    `bn-slump-${side}`,
  );
}

function seepScene(side: "a" | "b") {
  const ys = [50, 76, 102, 128, 154];
  const ks = [1.08, 0.9, 1.18, 0.96, 1.02];
  const chans = ys
    .map(
      (y, i) =>
        `<path class="bn-chan" d="M102 ${y}c16-5 26 6 40 1s28-7 40 0 26 5 40-1"/><path class="bn-chw" style="--k:${ks[i]}" d="M102 ${y}c16-5 26 6 40 1s28-7 40 0 26 5 40-1"/>`,
    )
    .join("");
  const xtals =
    side === "b"
      ? ys.map((y, i) => `<g transform="translate(${130 + (i % 2) * 6} ${y})"><path class="bn-xtal" style="--i:${i}" d="M-5 0H5M0-5V5M-3.6-3.6l7.2 7.2M-3.6 3.6l7.2-7.2"/></g>`).join("")
      : "";
  const damp = side === "a" ? `<g class="bn-damp"><ellipse cx="224" cy="112" rx="7" ry="50"/>${drops([[229, "-.3s"], [229, "-1s"]], 184, "bn-drop bn-drop--slow", 150)}</g>` : "";
  return svg(
    `<rect class="bn-water" x="8" y="30" width="94" height="154"/><path class="bn-wave" d="M8 30c8-3 16 3 24 0s16-3 24 0 16 3 24 0 14-3 22 0"/>
<rect class="bn-c" x="102" y="22" width="120" height="162"/>${specks(102, 22, 120, 162, 40, side === "a" ? 29 : 31)}
${chans}${xtals}${damp}
<path class="bn-floor" d="M222 184 H314"/>`,
    `bn-seep-${side}`,
  );
}

const SCENES: Record<BenchId, (side: "a" | "b") => string> = { rain: rainScene, crack: crackScene, spill: spillScene, slump: slumpScene, seep: seepScene };

/* ------------------------------------------------------------- markup */

export interface BenchProductRef {
  slug: string;
  name: string;
  brand: string;
}
export interface BenchOptions {
  /** look a product up by its slug (for its name on the chips) */
  product: (slug: string) => BenchProductRef | undefined;
  /** where a product chip links to; by default the products page */
  href?: (slug: string) => string;
  /** id prefix, so two benches never share ids */
  key?: string;
  /** which tests, in order (all five by default) */
  tests?: readonly BenchId[];
  /** the heading level of each test's title */
  level?: 3 | 4;
  /** on wide screens, the specimens on the left and the title, slider and result beside them */
  wide?: boolean;
  /** films of the tests, by test (only the ones that exist are passed in) */
  videos?: Partial<Record<BenchId, NonNullable<BenchTest["video"]>>>;
}

function sideMarkup(t: BenchTest, which: "a" | "b", o: BenchOptions) {
  const s = t[which];
  const href = o.href ?? ((slug: string) => `/products#${slug}`);
  const chips = s.products
    .map((slug) => o.product(slug))
    .filter((p): p is BenchProductRef => Boolean(p))
    .map((p) => `<li><a href="${esc(href(p.slug))}" data-internal>${brandName(p.brand, p.name)}</a></li>`)
    .join("");
  return `<figure class="bn-spec bn-spec--${which}">
  <div class="bn-plate-wrap">${SCENES[t.id](which)}</div>
  <figcaption>
    <p class="bn-label"><span class="bn-key" aria-hidden="true">${which.toUpperCase()}</span>${esc(s.label)}</p>
    <p class="bn-cap">${esc(s.caption)}</p>
    ${chips ? `<ul class="bn-chips" aria-label="Products">${chips}</ul>` : ""}
  </figcaption>
</figure>`;
}

function testMarkup(test: BenchTest, o: BenchOptions, i: number) {
  const t: BenchTest = o.videos?.[test.id] ? { ...test, video: o.videos[test.id] } : test;
  const k = o.key ?? "bn";
  const h = `h${o.level ?? 3}`;
  const video = t.video
    ? `<figure class="bn-film"><video src="${esc(t.video.src)}"${t.video.poster ? ` poster="${esc(t.video.poster)}"` : ""} width="${t.video.width}" height="${t.video.height}" muted loop playsinline preload="none" controls></video><figcaption>${esc(t.video.caption)}</figcaption></figure>`
    : "";
  return `<div class="bn-test" role="tabpanel" id="${k}-${t.id}" aria-labelledby="${k}-tab-${t.id}" data-test="${t.id}"${i === 0 ? "" : " hidden"} style="--t:0">
  <${h} class="bn-title">${esc(t.title)}</${h}>
  <div class="bn-pair">${sideMarkup(t, "a", o)}${sideMarkup(t, "b", o)}</div>
  <div class="bn-ctl">
    <button type="button" class="bn-play" data-play aria-label="Run the ${esc(t.tab.toLowerCase())} test"><svg viewBox="0 0 24 24" aria-hidden="true"><path class="bn-ico-play" d="M8 5.5v13l10.5-6.5z"/><path class="bn-ico-again" d="M18.4 9.2A7 7 0 1 0 19 13"/><path class="bn-ico-again" d="M19.2 5.2v4.4h-4.4"/></svg></button>
    <label class="bn-range"><span class="bn-rl">${esc(t.control)}</span><input type="range" min="0" max="100" step="1" value="0" data-range aria-valuetext="${esc(t.states[0])}" data-states="${esc(t.states.join("|"))}"></label>
  </div>
  <p class="bn-result">${esc(t.result)}</p>
  ${video}
</div>`;
}

/**
 * The bench: a row of tabs, one per test, and the tests themselves (the first
 * shows; the rest wait behind their tabs).
 */
export function benchMarkup(o: BenchOptions) {
  const k = o.key ?? "bn";
  const tests = (o.tests ?? BENCH_TESTS.map((t) => t.id)).map((id) => BENCH_TESTS.find((t) => t.id === id)!).filter(Boolean);
  const tabs = tests
    .map(
      (t, i) =>
        `<button type="button" role="tab" class="bn-tab" id="${k}-tab-${t.id}" aria-controls="${k}-${t.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-tab="${t.id}">${esc(t.tab)}</button>`,
    )
    .join("");
  return `<div class="bn${o.wide ? " bn--wide" : ""}" data-bench>
  <div class="bn-tabs" role="tablist" aria-label="Tests">${tabs}</div>
  ${tests.map((t, i) => testMarkup(t, o, i)).join("\n")}
</div>`;
}

/* ---------------------------------------------------------------- CSS */

export const BENCH_CSS = `
.bn{--bn-bg:#0b1d2b;--bn-plate:#11283b;--bn-line:rgba(236,242,245,.14);--bn-ink:#ecf2f5;--bn-mute:rgba(236,242,245,.66);--bn-water:#4cc9d9;--bn-amber:#e8a215;position:relative;border-radius:26px;background:var(--bn-bg);color:var(--bn-ink);padding:clamp(1rem,2.2vw,1.8rem);font-family:var(--sans,var(--font-inter-tight),ui-sans-serif,system-ui,sans-serif)}
.bn *{box-sizing:border-box}
.bn-tabs{display:flex;flex-wrap:wrap;gap:.4rem;margin:0 0 clamp(.9rem,2vw,1.4rem)}
.bn-tab{height:2.5rem;padding:0 1.05rem;border:1px solid var(--bn-line);border-radius:999px;background:transparent;font:inherit;font-size:var(--fs-body);font-weight:600;color:var(--bn-mute);cursor:pointer;transition:background-color .3s,color .3s,border-color .3s}
.bn-tab:hover{color:var(--bn-ink);border-color:rgba(236,242,245,.32)}
.bn-tab[aria-selected=true]{background:var(--bn-ink);border-color:var(--bn-ink);color:#0b1d2b}
.bn-tab:focus-visible,.bn-play:focus-visible,.bn-chips a:focus-visible{outline:2px solid var(--bn-water);outline-offset:3px}
.bn-test[hidden]{display:none}
.bn-title{margin:0 0 clamp(.8rem,1.8vw,1.2rem);font-size:var(--fs-sub);font-weight:600;line-height:1.3;letter-spacing:-.005em}
.bn-pair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(.7rem,1.6vw,1.2rem)}
.bn-spec{margin:0;display:flex;flex-direction:column;min-width:0}
.bn-plate-wrap{border-radius:18px;background:var(--bn-plate);box-shadow:inset 0 0 0 1px var(--bn-line);overflow:hidden}
.bn-svg{display:block;width:100%;height:auto;aspect-ratio:320/188}
.bn-spec figcaption{padding:.85rem .2rem 0}
.bn-label{display:flex;align-items:center;gap:.55rem;margin:0;font-size:var(--fs-body);font-weight:600;line-height:1.3}
.bn-key{display:inline-grid;place-items:center;flex:none;width:1.6rem;height:1.6rem;border-radius:50%;font-size:var(--fs-body);font-weight:700;line-height:1;background:rgba(236,242,245,.1);color:var(--bn-ink)}
.bn-spec--b .bn-key{background:var(--bn-water);color:#0b1d2b}
.bn-cap{margin:.3rem 0 0;font-size:var(--fs-body);line-height:1.5;color:var(--bn-mute)}
.bn-chips{display:flex;flex-wrap:wrap;gap:.35rem;margin:.65rem 0 0;padding:0;list-style:none}
.bn-chips a{display:inline-flex;align-items:center;gap:.35rem;min-height:2rem;padding:.2rem .7rem;border-radius:999px;background:rgba(76,201,217,.12);color:var(--bn-ink);font-size:var(--fs-body);line-height:1.25;text-decoration:none;transition:background-color .3s}
.bn-chips a span{color:var(--bn-water);font-weight:600}
.bn-chips a:hover{background:rgba(76,201,217,.24)}
.bn-ctl{display:flex;align-items:center;gap:1rem;margin-top:clamp(.9rem,2vw,1.4rem);padding-top:clamp(.9rem,2vw,1.3rem);border-top:1px solid var(--bn-line)}
.bn-play{position:relative;display:grid;place-items:center;flex:none;width:3rem;height:3rem;border:0;border-radius:50%;background:var(--bn-water);color:#0b1d2b;cursor:pointer;transition:transform .3s,background-color .3s}
.bn-play:hover{background:#7fdbe6}
.bn-play:active{transform:scale(.94)}
.bn-play svg{width:22px;height:22px}
.bn-ico-play{fill:currentColor}
.bn-ico-again{fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;display:none}
.bn-test.is-done .bn-ico-play{display:none}
.bn-test.is-done .bn-ico-again{display:inline}
.bn-range{display:flex;flex-direction:column;gap:.35rem;flex:1;min-width:0}
.bn-rl{font-size:var(--fs-body);color:var(--bn-mute)}
.bn-range input{-webkit-appearance:none;appearance:none;width:100%;height:2rem;margin:0;background:transparent;cursor:pointer;--fill:calc(var(--t) * 100%)}
.bn-range input::-webkit-slider-runnable-track{height:6px;border-radius:999px;background:linear-gradient(90deg,var(--bn-water) var(--fill),rgba(236,242,245,.16) var(--fill))}
.bn-range input::-moz-range-track{height:6px;border-radius:999px;background:rgba(236,242,245,.16)}
.bn-range input::-moz-range-progress{height:6px;border-radius:999px;background:var(--bn-water)}
.bn-range input::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;margin-top:-8px;border-radius:50%;background:#fff;box-shadow:0 0 0 4px rgba(76,201,217,.45),0 4px 10px rgba(0,0,0,.35)}
.bn-range input::-moz-range-thumb{width:22px;height:22px;border:0;border-radius:50%;background:#fff;box-shadow:0 0 0 4px rgba(76,201,217,.45),0 4px 10px rgba(0,0,0,.35)}
.bn-range input:focus-visible{outline:2px solid var(--bn-water);outline-offset:4px;border-radius:6px}
.bn-result{margin:clamp(.8rem,1.8vw,1.1rem) 0 0;max-width:60rem;font-size:var(--fs-body);line-height:1.55;color:var(--bn-mute);opacity:.55;transition:opacity .6s,color .6s}
.bn-test.is-done .bn-result{opacity:1;color:var(--bn-ink)}
.bn-film{margin:clamp(1rem,2vw,1.4rem) 0 0}
.bn-film video{display:block;width:100%;height:auto;border-radius:16px;background:#000}
.bn-film figcaption{margin-top:.5rem;font-size:var(--fs-body);color:var(--bn-mute)}

/* the drawings: concrete, water and coats, all driven by --t */
.bn-svg *{transform-box:fill-box}
.bn-c{fill:#b9c4cb}
.bn-sp0{fill:#97a4ad}.bn-sp1{fill:#a7b2ba}.bn-sp2{fill:#cbd3d8}
.bn-drop{fill:var(--bn-water);opacity:0;animation:bn-fall 1.15s cubic-bezier(.55,0,1,.6) infinite;animation-delay:var(--d)}
.bn-drop--slow{animation-duration:1.9s}
.bn-drop--run{animation-duration:.95s}
.bn-drop--leak{animation-duration:.8s}
@keyframes bn-fall{0%{transform:translate(var(--x),var(--y0,0px));opacity:0}12%{opacity:1}88%{opacity:1}100%{transform:translate(var(--x),var(--y));opacity:0}}
.bn-rain{opacity:min(1,calc(var(--t) * 40))}
/* rain */
.bn-wet{fill:#16354a;opacity:.62;transform-origin:50% 0;transform:scaleY(var(--t))}
.bn-sheen{fill:#2a5068;opacity:clamp(0,calc(var(--t) * 5),.9)}
.bn-under{opacity:clamp(0,calc((var(--t) - .82) * 6),1)}
.bn-coat{fill:#d9e1e6}
.bn-coat--flex{fill:#86c9d1}
.bn-coathl{fill:var(--bn-water);opacity:.7}
.bn-bead{fill:var(--bn-water);transform-origin:50% 100%;transform:scale(clamp(0,calc((var(--t) - var(--i) * .07) * 5),1))}
.bn-run{opacity:clamp(0,calc((var(--t) - .3) * 6),1)}
/* crack */
.bn-halfl{transform:translateX(calc(var(--t) * -8px))}
.bn-halfr{transform:translateX(calc(var(--t) * 8px))}
.bn-crack-a .bn-bridge{opacity:clamp(0,calc((.34 - var(--t)) * 40),1)}
.bn-crack-b .bn-bridge{transform-origin:50% 50%;transform:scaleX(calc(1 + var(--t) * .62)) scaleY(calc(1 - var(--t) * .4))}
.bn-broke{fill:#d9e1e6;opacity:clamp(0,calc((var(--t) - .33) * 40),1)}
.bn-broke path:first-child{transform:translateX(calc(var(--t) * -8px))}
.bn-broke path:last-child{transform:translateX(calc(var(--t) * 8px))}
.bn-leak{opacity:clamp(0,calc((var(--t) - .38) * 8),1)}
.bn-gauge path{fill:none;stroke:var(--bn-amber);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;opacity:clamp(0,calc(var(--t) * 8),1)}
.bn-gl{transform:translateX(calc(var(--t) * -10px))}
.bn-gr{transform:translateX(calc(var(--t) * 10px))}
/* spill */
.bn-grout{fill:#a3acb2}
.bn-grout--epoxy{fill:#8b98a1}
.bn-tile{fill:#e6ecef}
.bn-tilehl{fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;opacity:.7}
.bn-gstain{fill:#6f4a29;opacity:0}
.bn-spill-a .bn-gstain{opacity:clamp(0,calc((var(--t) - .12) * 2.6),.92)}
.bn-spill-b .bn-gstain{opacity:calc(clamp(0,calc((var(--t) - .12) * 2.6),.92) * (1 - clamp(0,calc((var(--t) - .6) * 4),1)))}
.bn-spillb{fill:#8f5f31;transform-origin:50% 50%;transform:scale(clamp(0,calc(var(--t) * 3.4),1));opacity:calc(.86 * (1 - clamp(0,calc((var(--t) - .6) * 4),1)))}
.bn-cloth{transform:translateX(calc(clamp(0,calc((var(--t) - .5) * 2.1),1) * 420px - 90px));opacity:calc(clamp(0,calc((var(--t) - .5) * 25),1) * clamp(0,calc((.985 - var(--t)) * 25),1))}
.bn-cloth rect{fill:#d6eef1}
.bn-cloth path{fill:none;stroke:#b6dfe4;stroke-width:2}
/* slump */
.bn-plate{fill:#2f4558}
.bn-ruler path{fill:none;stroke:rgba(236,242,245,.4);stroke-width:1.4}
.bn-mix{fill:#a7aeb1}
.bn-ag0{fill:#7f898e}.bn-ag1{fill:#c4cacd}.bn-ag2{fill:#959ea2}
.bn-cone{transform:translateY(calc(var(--t) * -62px));opacity:calc(1 - clamp(0,calc((var(--t) - .86) * 7),1))}
.bn-cone path:first-child{fill:rgba(163,180,192,.2);stroke:#a3b4c0;stroke-width:2;stroke-linejoin:round}
.bn-cone path:last-child{fill:none;stroke:#a3b4c0;stroke-width:3;stroke-linecap:round}
.bn-heap{transform-origin:50% 100%}
.bn-slump-a .bn-heap{transform:scaleY(calc(1 - var(--t) * .2)) scaleX(calc(1 + var(--t) * .12))}
.bn-slump-b .bn-heap{transform:scaleY(calc(1 - var(--t) * .45)) scaleX(calc(1 + var(--t) * .3));opacity:calc(1 - clamp(0,calc((var(--t) - .2) * 2.2),1))}
.bn-flow{transform-origin:50% 100%;transform:scaleX(calc(.3 + var(--t) * .7)) scaleY(clamp(.05,calc(var(--t) * 1.2),1));opacity:clamp(0,calc((var(--t) - .05) * 3),1)}
.bn-level{fill:none;stroke:var(--bn-amber);stroke-width:1.6;stroke-dasharray:5 5}
.bn-slump-a .bn-level{transform:translateY(calc(var(--t) * 20px))}
.bn-slump-b .bn-level{transform:translateY(calc(var(--t) * 76px))}
/* seepage */
.bn-water{fill:rgba(76,201,217,.26)}
.bn-wave{fill:none;stroke:var(--bn-water);stroke-width:2;stroke-linecap:round}
.bn-chan{fill:none;stroke:#8d9aa3;stroke-width:2.6;stroke-linecap:round}
.bn-chw{fill:none;stroke:var(--bn-water);stroke-width:2.6;stroke-linecap:round;stroke-dasharray:132;stroke-dashoffset:calc((1 - var(--p)) * 132px)}
.bn-seep-a .bn-chw{--p:min(1,calc(var(--t) * var(--k)))}
.bn-seep-b .bn-chw{--p:min(.26,calc(var(--t) * var(--k)))}
.bn-xtal{fill:none;stroke:var(--bn-amber);stroke-width:1.5;stroke-linecap:round;transform-origin:50% 50%;transform:scale(clamp(0,calc((var(--t) - .12 - var(--i) * .05) * 3.4),1))}
.bn-damp{opacity:clamp(0,calc((var(--t) - .72) * 4),1)}
.bn-damp ellipse{fill:rgba(76,201,217,.3)}
.bn-floor{fill:none;stroke:rgba(236,242,245,.3);stroke-width:1.5}
/* ambient motion only while the bench is on screen */
.bn:not(.is-live) .bn-drop{animation-play-state:paused}

@media (min-width:1200px){
  .bn--wide .bn-test:not([hidden]){display:grid;grid-template-columns:minmax(0,2.4fr) minmax(17rem,1fr);grid-template-rows:auto auto 1fr;grid-template-areas:"pair title" "pair ctl" "pair result" "film film";column-gap:clamp(1.6rem,2.6vw,2.6rem);align-items:start}
  .bn--wide .bn-pair{grid-area:pair}
  .bn--wide .bn-title{grid-area:title;margin:0;padding-top:.2rem}
  .bn--wide .bn-ctl{grid-area:ctl;margin-top:1.2rem;padding-top:1.2rem}
  .bn--wide .bn-result{grid-area:result;margin-top:1rem}
  .bn--wide .bn-film{grid-area:film}
}
@media (max-width:640px){
  .bn{border-radius:20px;padding:.9rem .8rem 1rem}
  .bn-tabs{flex-wrap:nowrap;overflow-x:auto;margin-inline:-.8rem;padding:0 .8rem .2rem;scrollbar-width:none}
  .bn-tabs::-webkit-scrollbar{display:none}
  .bn-tab{flex:none}
  .bn-pair{gap:.55rem}
  .bn-plate-wrap{border-radius:12px}
  .bn-spec figcaption{padding-top:.6rem}
  .bn-key{width:1.35rem;height:1.35rem}
  .bn-chips a{min-height:1.9rem;padding:.15rem .55rem}
}
@media (max-width:340px){
  .bn-pair{grid-template-columns:1fr}
  .bn-spec--b{margin-top:.3rem}
}
`;

/* ------------------------------------------------------------- behaviour */

/**
 * Wires every bench under `root`: tabs (click, arrow keys), the sliders, play,
 * and the drops' motion only while a bench is on screen. The first time a bench
 * comes into view its first test runs once by itself (unless motion is reduced).
 */
export function mountBench(root: HTMLElement): () => void {
  const offs: (() => void)[] = [];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.querySelectorAll<HTMLElement>("[data-bench]").forEach((bench) => {
    const tabs = Array.from(bench.querySelectorAll<HTMLButtonElement>(".bn-tab"));
    const tests = Array.from(bench.querySelectorAll<HTMLElement>(".bn-test"));
    let raf = 0;
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const set = (test: HTMLElement, v: number) => {
      const t = Math.max(0, Math.min(1, v));
      test.style.setProperty("--t", t.toFixed(4));
      const input = test.querySelector<HTMLInputElement>("[data-range]");
      if (input) {
        input.value = String(Math.round(t * 100));
        const states = (input.dataset.states ?? "").split("|");
        input.setAttribute("aria-valuetext", states[t < 0.02 ? 0 : t > 0.97 ? 2 : 1] ?? "");
      }
      test.classList.toggle("is-done", t > 0.97);
    };
    const play = (test: HTMLElement) => {
      stop();
      const input = test.querySelector<HTMLInputElement>("[data-range]");
      const from = input && Number(input.value) < 97 ? Number(input.value) / 100 : 0;
      const dur = 3600 * (1 - from);
      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / Math.max(1, dur));
        const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        set(test, from + (1 - from) * e);
        if (p < 1) raf = requestAnimationFrame(step);
        else raf = 0;
      };
      raf = requestAnimationFrame(step);
    };
    const select = (id: string, focus = false) => {
      stop();
      tabs.forEach((b) => {
        const on = b.dataset.tab === id;
        b.setAttribute("aria-selected", String(on));
        b.tabIndex = on ? 0 : -1;
        if (on && focus) b.focus();
      });
      tests.forEach((t) => (t.hidden = t.dataset.test !== id));
    };
    const onClick = (e: Event) => {
      const el = e.target as HTMLElement;
      const tab = el.closest<HTMLButtonElement>(".bn-tab");
      if (tab) return select(tab.dataset.tab!);
      const btn = el.closest<HTMLButtonElement>("[data-play]");
      if (btn) {
        const test = btn.closest<HTMLElement>(".bn-test")!;
        if (raf) stop();
        else play(test);
      }
    };
    const onInput = (e: Event) => {
      const input = e.target as HTMLInputElement;
      if (!input.matches("[data-range]")) return;
      stop();
      set(input.closest<HTMLElement>(".bn-test")!, Number(input.value) / 100);
    };
    const onKey = (e: KeyboardEvent) => {
      const tab = (e.target as HTMLElement).closest<HTMLButtonElement>(".bn-tab");
      if (!tab) return;
      const i = tabs.indexOf(tab);
      const n = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : -2;
      if (n === -2) return;
      e.preventDefault();
      const next = tabs[(n + tabs.length) % tabs.length]!;
      select(next.dataset.tab!, true);
    };
    bench.addEventListener("click", onClick);
    bench.addEventListener("input", onInput);
    bench.addEventListener("keydown", onKey);
    offs.push(() => {
      stop();
      bench.removeEventListener("click", onClick);
      bench.removeEventListener("input", onInput);
      bench.removeEventListener("keydown", onKey);
    });
    // open the tab a link points at (/products#bench-crack)
    const hash = decodeURIComponent(location.hash.slice(1));
    const linked = tests.find((t) => t.id === hash);
    if (linked) select(linked.dataset.test!);
    if ("IntersectionObserver" in window) {
      let ran = false;
      const io = new IntersectionObserver(
        ([en]) => {
          bench.classList.toggle("is-live", Boolean(en?.isIntersecting));
          if (en?.isIntersecting && !ran && !reduced) {
            ran = true;
            const first = tests.find((t) => !t.hidden);
            const input = first?.querySelector<HTMLInputElement>("[data-range]");
            if (first && input && input.value === "0") window.setTimeout(() => play(first), 450);
          }
        },
        { threshold: 0.35 },
      );
      io.observe(bench);
      offs.push(() => io.disconnect());
    } else bench.classList.add("is-live");
  });
  return () => offs.forEach((f) => f());
}
