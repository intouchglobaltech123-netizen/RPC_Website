/**
 * "Level" loading screen for the home page: the letters RPC drawn in outline
 * on night blue, then filled floor by floor as the page loads, like concrete
 * poured level by level. A laser level climbs with the fill, reading the
 * height (+3.00 m a floor), the share loaded and the stage of the build.
 * Complete, a waterproof sheen runs down the letters and the screen opens
 * from the middle onto the page.
 *
 * Plain markup and one mount function, so the server renders the screen and
 * nothing of the page shows before it. The scene is drawn twice, once in each
 * half of the screen, so the two halves can part.
 */

export interface LevelProgress {
  /** share of the page's pictures loaded, 0 … 1 */
  share: number;
  /** everything is in */
  done: boolean;
}

export interface LevelOptions {
  getProgress: () => LevelProgress | null | undefined;
  /** the screen starts to open: the page can start */
  onReveal?: () => void;
  /** the screen has gone */
  onGone?: () => void;
}

const FLOORS = 10;
/** metres per floor, for the height read-out */
const FLOOR_M = 3;
/** set once the full opening has played, so a return in the same visit is quick */
const INTRO_KEY = "rpc-level-intro";
const MIN_MS = 2200;
const MIN_MS_RETURN = 800;
const MAX_MS = 9000;
const SEAL_MS = 600;
const OPEN_MS = 1000;

/** the build, read out as the letters fill (index = floor reached) */
const STAGES = [
  "Setting out the site",
  "Foundation and raft",
  "Foundation and raft",
  "Columns and slabs",
  "Columns and slabs",
  "Walls and openings",
  "Walls and openings",
  "Floors and finishes",
  "Floors and finishes",
  "Roof slab",
  "Waterproofed, land to roof",
];

/* geometry of the word, in the drawing's own units (font size 100) */
const CAP = 72.8; // cap height of Inter Tight
interface Layout {
  key: "row" | "stack";
  vw: number;
  vh: number;
  /** each line of letters and its baseline */
  lines: { text: string; base: number }[];
  /** the fill runs from just under the lowest baseline (round letters overshoot it) … */
  low: number;
  /** … to just over the top line's cap height */
  high: number;
  /** height of the waterproof sheen band */
  sheen: number;
}
/** wide screens: RPC on one line */
const ROW: Layout = { key: "row", vw: 300, vh: 100, lines: [{ text: "RPC", base: 86 }], low: 88.5, high: 86 - CAP - 2.5, sheen: 34 };
/** phones and tablets held upright: R, P and C stacked into a tower, filled floor by floor from the ground up */
const PITCH = CAP + 17;
const B1 = 8 + CAP;
const STACK: Layout = {
  key: "stack",
  vw: 100,
  vh: B1 + 2 * PITCH + 10,
  lines: [
    { text: "R", base: B1 },
    { text: "P", base: B1 + PITCH },
    { text: "C", base: B1 + 2 * PITCH },
  ],
  low: B1 + 2 * PITCH + 2.5,
  high: B1 - CAP - 2.5,
  sheen: 70,
};
const levelY = (L: Pick<Layout, "low" | "high">, k: number) => L.low - (L.low - L.high) * k; // y of the fill's top at share k (0 … 1)

const pad2 = (n: number) => String(n).padStart(2, "0");
const elev = (floor: number) => (floor === 0 ? "±0.00" : `+${(floor * FLOOR_M).toFixed(2)}`);

function word(id: string, L: Layout) {
  const uid = `${id}-${L.key}`;
  const floors = Array.from({ length: FLOORS - 1 }, (_, i) => levelY(L, (i + 1) / FLOORS));
  const texts = (cls: string) => L.lines.map((ln) => `<text x="${L.vw / 2}" y="${ln.base}" text-anchor="middle" class="${cls}">${ln.text}</text>`).join("");
  const ground = L.lines[L.lines.length - 1]!.base;
  return `<div class="ll-word ll-word--${L.key}" aria-hidden="true">
    <svg class="ll-svg" viewBox="0 0 ${L.vw} ${L.vh.toFixed(1)}" preserveAspectRatio="xMidYMid meet" data-low="${L.low}" data-high="${L.high}" data-vh="${L.vh}" data-sh="${L.sheen}">
      <defs>
        <clipPath id="ll-letters-${uid}">${texts("ll-text")}</clipPath>
        <clipPath id="ll-level-${uid}"><rect data-ll-lvl x="0" y="${L.low}" width="${L.vw}" height="0"/></clipPath>
        <linearGradient id="ll-sheen-${uid}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#8fb0ea" stop-opacity="0"/>
          <stop offset=".55" stop-color="#cfe0ff" stop-opacity=".85"/>
          <stop offset="1" stop-color="#8fb0ea" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <line class="ll-ground" x1="-400" y1="${ground}" x2="${L.vw + 400}" y2="${ground}"/>
      ${texts("ll-text ll-outline")}
      <g clip-path="url(#ll-letters-${uid})">
        <g clip-path="url(#ll-level-${uid})">
          <rect class="ll-fill" x="0" y="0" width="${L.vw}" height="${L.vh.toFixed(1)}"/>
          <path class="ll-floors" d="${floors.map((y) => `M0 ${y.toFixed(2)}H${L.vw}`).join("")}"/>
        </g>
        <rect data-ll-sheen x="0" y="${-L.sheen - 2}" width="${L.vw}" height="${L.sheen}" fill="url(#ll-sheen-${uid})"/>
      </g>
    </svg>
    <p class="ll-sub">Constructions</p>
  </div>`;
}

function scene(id: string) {
  return `<div class="ll-scene">
  <div class="ll-grid" aria-hidden="true"></div>
  <div class="ll-top" aria-hidden="true"><span>RPC Constructions</span><span>Building · Waterproofing</span></div>
  ${word(id, ROW)}
  ${word(id, STACK)}
  <div class="ll-laser" data-ll-laser aria-hidden="true">
    <span class="ll-elev"><b>▽</b><span data-ll-elev>±0.00</span> m</span>
    <i></i>
    <span class="ll-pct"><span data-ll-pct>0</span>%</span>
  </div>
  <div class="ll-bottom" aria-hidden="true"><span class="ll-stage"><b data-ll-floor>Level 00</b><span data-ll-stage>${STAGES[0]}</span></span><span class="ll-place">Erode · Tamil Nadu</span></div>
</div>`;
}

export function levelLoaderMarkup(): string {
  return `<div class="ll" role="status" aria-live="polite" aria-label="Loading">
  <span class="ll-sr">Loading</span>
  <div class="ll-half ll-half--top">${scene("t")}</div>
  <div class="ll-half ll-half--bottom">${scene("b")}</div>
</div>`;
}

export const LEVEL_CSS = `
.ll{position:fixed;inset:0;z-index:80;overflow:hidden;color:#eeeae3;font-family:var(--font-inter-tight),ui-sans-serif,system-ui,sans-serif;--night:#0d1420;--laser:#6d9bff}
.ll-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
/* two halves of one scene: they part when the page is ready */
.ll-half{position:absolute;left:0;right:0;height:50%;overflow:hidden;background:var(--night);will-change:transform;transition:transform ${OPEN_MS}ms cubic-bezier(.76,0,.24,1)}
.ll-half--top{top:0}
.ll-half--bottom{bottom:0}
.ll-scene{position:absolute;left:0;right:0;height:200%;top:0}
.ll-half--bottom .ll-scene{top:-100%}
.ll.is-open .ll-half--top{transform:translateY(-101%)}
.ll.is-open .ll-half--bottom{transform:translateY(101%)}
/* surveyor's grid, faint, gathered round the word */
.ll-grid{position:absolute;inset:0;opacity:.07;background-image:linear-gradient(to right,#eeeae3 1px,transparent 1px),linear-gradient(to bottom,#eeeae3 1px,transparent 1px);background-size:clamp(44px,6vw,96px) clamp(44px,6vw,96px);-webkit-mask-image:radial-gradient(ellipse at center,#000 25%,transparent 72%);mask-image:radial-gradient(ellipse at center,#000 25%,transparent 72%)}
.ll-top,.ll-bottom{position:absolute;left:var(--gutter,24px);right:var(--gutter,24px);display:flex;justify-content:space-between;gap:1rem;font-family:var(--font-mono),ui-monospace,monospace;font-size:var(--fs-body,1rem);line-height:1.4;letter-spacing:.22em;text-transform:uppercase}
.ll-top{top:calc(var(--gutter,24px) + 6px);color:rgba(238,234,227,.7)}
.ll-top span+span{color:rgba(238,234,227,.42)}
.ll-bottom{bottom:calc(var(--gutter,24px) + env(safe-area-inset-bottom));align-items:flex-end}
.ll-stage{display:flex;flex-wrap:wrap;gap:.4rem 1rem;color:rgba(238,234,227,.85)}
.ll-stage b{font-weight:500;color:var(--laser)}
.ll-place{color:rgba(238,234,227,.42)}
/* the word */
.ll-word{position:absolute;left:50%;top:50%;transform:translate(-50%,-56%);display:flex;flex-direction:column;align-items:center}
.ll-svg{display:block;width:min(74vw,124svh);height:auto;overflow:visible}
.ll-word--stack{display:none}
.ll-word--stack .ll-svg{width:auto;height:min(64svh,150vw)}
.ll-text{font-family:var(--font-inter-tight),ui-sans-serif,system-ui,sans-serif;font-weight:800;font-size:100px;letter-spacing:-4px}
.ll-outline{fill:none;stroke:rgba(238,234,227,.42);stroke-width:.45;stroke-dasharray:640;stroke-dashoffset:640;animation:ll-draw 1.6s cubic-bezier(.65,0,.35,1) .15s forwards}
@keyframes ll-draw{to{stroke-dashoffset:0}}
.ll-fill{fill:#eeeae3}
.ll-floors{fill:none;stroke:var(--night);stroke-opacity:.5;stroke-width:.32}
.ll-ground{stroke:rgba(238,234,227,.22);stroke-width:.25;stroke-dasharray:1.2 1.6}
.ll-sub{margin:clamp(.6rem,1.6svh,1.2rem) 0 0;font-family:var(--font-mono),ui-monospace,monospace;font-size:clamp(10px,1.05vw,13px);letter-spacing:.9em;text-indent:.9em;text-transform:uppercase;color:rgba(238,234,227,.55);opacity:0;transform:translateY(6px);transition:opacity .7s ease,transform .9s cubic-bezier(.19,1,.22,1),letter-spacing 1.2s cubic-bezier(.19,1,.22,1)}
.ll.is-sealed .ll-sub{opacity:1;transform:none;letter-spacing:.6em;text-indent:.6em}
/* the laser level: a line across the screen at the top of the pour */
.ll-laser{position:absolute;left:0;right:0;top:0;height:1px;display:flex;align-items:center;gap:14px;padding:0 var(--gutter,24px);transform:translateY(-200px);transition:opacity .5s ease;will-change:transform}
.ll-laser i{flex:1;height:1px;background:var(--laser);box-shadow:0 0 10px 1px rgba(109,155,255,.65),0 0 2px rgba(255,255,255,.6)}
.ll-elev,.ll-pct{flex:none;font-family:var(--font-mono),ui-monospace,monospace;font-size:var(--fs-body,1rem);line-height:1;letter-spacing:.12em;font-variant-numeric:tabular-nums;color:var(--laser);transform:translateY(-12px)}
.ll-elev b{margin-right:.5em;font-weight:400}
.ll-pct{min-width:4ch;text-align:right;color:#eeeae3}
.ll.is-sealed .ll-laser{opacity:0}
@media (max-width:1023px) and (orientation:portrait){
  .ll-word--row{display:none}
  .ll-word--stack{display:flex;transform:translate(-50%,-53%)}
}
@media (max-width:767px){
  .ll-word--row .ll-svg{width:92vw}
  .ll-top span+span{display:none}
  .ll-bottom{flex-direction:column;align-items:flex-start;gap:.5rem}
  .ll-stage{flex-direction:column;gap:.3rem}
  .ll-sub{letter-spacing:.6em;text-indent:.6em}
  .ll.is-sealed .ll-sub{letter-spacing:.45em;text-indent:.45em}
}
@media (prefers-reduced-motion:reduce){
  .ll-outline{animation:none;stroke-dashoffset:0}
  .ll-half{transition:opacity .45s ease}
  .ll.is-open .ll-half--top,.ll.is-open .ll-half--bottom{transform:none;opacity:0}
}
`;

/** runs the screen: follows the loading, pours the floors, seals, opens */
export function mountLevelLoader(root: HTMLElement, opts: LevelOptions) {
  const el = root.querySelector<HTMLElement>(".ll");
  if (!el) return () => {};
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const all = <T extends Element>(sel: string) => Array.from(el.querySelectorAll<T>(sel));
  const words = all<SVGSVGElement>(".ll-svg").map((svg) => ({
    svg,
    low: Number(svg.dataset.low),
    high: Number(svg.dataset.high),
    vh: Number(svg.dataset.vh),
    sh: Number(svg.dataset.sh),
    lvl: Array.from(svg.querySelectorAll<SVGRectElement>("[data-ll-lvl]")),
    sheen: Array.from(svg.querySelectorAll<SVGRectElement>("[data-ll-sheen]")),
  }));
  const lasers = all<HTMLElement>("[data-ll-laser]");
  const elevs = all<HTMLElement>("[data-ll-elev]");
  const pcts = all<HTMLElement>("[data-ll-pct]");
  const floorsTxt = all<HTMLElement>("[data-ll-floor]");
  const stages = all<HTMLElement>("[data-ll-stage]");
  const scn = el.querySelector<HTMLElement>(".ll-half--top .ll-scene");

  // always open at the top of the page
  window.scrollTo(0, 0);
  let minMs = reduced ? 300 : MIN_MS;
  try {
    if (sessionStorage.getItem(INTRO_KEY) === "1") minMs = Math.min(minMs, MIN_MS_RETURN);
  } catch {
    /* storage unavailable: play the full opening */
  }

  // where the drawing on screen (row or tower) puts the top of the pour, for the laser line
  let fillPx = (_k: number) => -200;
  const measure = () => {
    if (!scn) return;
    const s = scn.getBoundingClientRect();
    const w = words.find((x) => x.svg.closest(".ll-half--top") && x.svg.getBoundingClientRect().height > 0);
    if (!w) return;
    const r = w.svg.getBoundingClientRect();
    const k = r.height / w.vh;
    const top = r.top - s.top;
    fillPx = (share: number) => top + levelY(w, share) * k;
  };
  measure();
  window.addEventListener("resize", measure);
  document.fonts?.ready.then(measure);

  const start = performance.now();
  let last = start;
  let raf = 0;
  let shown = 0; // share loaded, as shown (eased)
  let pour = 0; // height of the fill, 0 … 1 (snaps to each floor as it is poured)
  let floor = -1;
  let phase: "load" | "seal" | "open" = "load";
  let sealAt = 0;
  const timers: number[] = [];

  const setFill = (k: number) => {
    for (const w of words) {
      const y = levelY(w, k);
      for (const r of w.lvl) {
        r.setAttribute("y", y.toFixed(3));
        r.setAttribute("height", Math.max(0, w.low - y).toFixed(3));
      }
    }
    const px = fillPx(k);
    for (const l of lasers) l.style.transform = `translateY(${px.toFixed(1)}px)`;
  };
  const setFloor = (f: number, pct: number) => {
    const p = String(pct);
    for (const n of pcts) n.textContent = p;
    if (f === floor) return;
    floor = f;
    const e = elev(f);
    for (const n of elevs) n.textContent = e;
    for (const n of floorsTxt) n.textContent = `Level ${pad2(f)}`;
    for (const n of stages) n.textContent = STAGES[f] ?? "";
  };

  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    const t = now - start;
    const dt = Math.min(0.25, Math.max(0, (now - last) / 1000));
    last = now;
    if (phase === "load") {
      const p = opts.getProgress() ?? { share: 0, done: false };
      const timeFloor = Math.min(1, t / minMs);
      // never ahead of time, never ahead of the real loading beyond the first third
      const target = p.done ? timeFloor : Math.min(timeFloor, 0.3 + p.share * 0.65);
      shown += (target - shown) * (1 - Math.exp(-dt / 0.16));
      // the eased share only ever approaches 1, so the last floor is poured once it is all but there
      const f = shown > 0.995 ? FLOORS : Math.min(FLOORS - 1, Math.floor(shown * FLOORS + 1e-6));
      // each floor is poured quickly, then holds: a stepped rise
      pour += (f / FLOORS - pour) * (reduced ? 1 : 1 - Math.exp(-dt / 0.085));
      setFill(pour);
      setFloor(f, f === FLOORS ? 100 : Math.min(99, Math.round(shown * 100)));
      if ((p.done && t > minMs && f === FLOORS && pour > 0.995) || t > MAX_MS) {
        try {
          sessionStorage.setItem(INTRO_KEY, "1");
        } catch {
          /* fine: the next visit plays the full opening */
        }
        setFill(1);
        setFloor(FLOORS, 100);
        phase = "seal";
        sealAt = now;
        el.classList.add("is-sealed");
      }
    } else if (phase === "seal") {
      // the waterproof sheen runs down the letters
      const k = reduced ? 1 : Math.min(1, (now - sealAt) / SEAL_MS);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      for (const w of words) {
        const y = -w.sh - 2 + (w.vh + w.sh + 6) * e;
        for (const s of w.sheen) s.setAttribute("y", y.toFixed(2));
      }
      if (k >= 1) {
        phase = "open";
        el.classList.add("is-open");
        opts.onReveal?.();
        timers.push(window.setTimeout(() => opts.onGone?.(), reduced ? 480 : OPEN_MS + 40));
        cancelAnimationFrame(raf);
      }
    }
  };
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    timers.forEach((x) => window.clearTimeout(x));
    window.removeEventListener("resize", measure);
  };
}
