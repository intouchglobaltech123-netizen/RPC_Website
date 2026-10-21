/**
 * Opening screen for the home page: the RPC cube is built. On night blue
 * drawing paper (a faint grid at the cube's own angles) the cube is set out in
 * thin lines, then its two walls go up course by course, from the front corner
 * outwards, and its top is laid panel by panel, back to front, as the page
 * loads (the steps under the name read Walls, Roof, Sealed). Once the page is
 * in, the joints close and a gloss runs over it as it is sealed, and it
 * becomes the logo itself, its letters and lines in cream. Then the logo
 * flies up onto the logo in the top bar while the screen fades onto the hero.
 *
 * The cube is drawn on the exact shape of the logo's cube (public/logo.png),
 * so the built cube and the logo line up; the logo comes from a light copy of
 * it (public/media/loader-mark.webp). Plain markup and one mount function,
 * like lib/loader/drop.ts, with the same options, so it drops into the same
 * place. Everything here is the paragraph size, like the site's small type.
 */

export interface BuildProgress {
  /** share of the page's pictures loaded, 0 … 1 */
  share: number;
  /** everything is in */
  done: boolean;
}
export interface BuildOptions {
  getProgress: () => BuildProgress | null | undefined;
  /** the screen starts to go: the page underneath can start */
  onStart?: () => void;
  /** the same moment, for whatever should begin as the screen goes */
  onReveal?: () => void;
  /** the screen has gone */
  onGone?: () => void;
}

/** the cube mark, the same picture the top bar shows, made light for this screen */
const MARK = "/media/loader-mark.webp";
/** set once the full opening has played, so a return in the same visit is quicker */
const INTRO_KEY = "rpc-build-intro";
/** the screen shows for at least this long, so the build is seen */
const MIN_MS = 2300;
const MIN_MS_RETURN = 900;
/** after this the screen goes whether the page is ready or not */
const MAX_MS = 9000;
/** the logo taking over from the built cube, the pause on it, the flight to the top bar */
const FLAT_MS = 320;
const HOLD_MS = 420;
const FLY_MS = 820;
/** a panel being set in place */
const SET_MS = 300;

/* ---------------------------------------------------------- the cube */

/**
 * The logo's cube, in the 600-unit square of its picture: the top corner, the
 * two upper corners, the front corner where the three faces meet, and so on.
 * Its edges: `A` runs down to the right, `B` down to the left, `V` straight down.
 */
const T = [299, 63] as const;
const UL = [88, 166] as const;
const CEN = [299, 269] as const;
const A = [211, 103] as const;
const B = [-211, 103] as const;
const V = [0, 247] as const;
/** panels along each edge of a face */
const N = 5;
/** where the walls are done and the top is laid, as shares of the loading */
const WALLS_TO = 0.5;
const ROOF_TO = 0.85;

type Face = 0 | 1 | 2;
/** each face: where it starts, its two edges, its colour while it is built, and once sealed (near the logo's one blue, lit a little from above) */
const FACES: Record<Face, { o: readonly [number, number]; u: readonly [number, number]; w: readonly [number, number]; rgb: [number, number, number]; sealed: [number, number, number] }> = {
  // the left wall (P), from its upper left corner: along to the front corner, and down
  0: { o: UL, u: A, w: V, rgb: [46, 96, 176], sealed: [39, 85, 158] },
  // the right wall (C), from the front corner: up along to its upper right corner, and down
  1: { o: CEN, u: [-B[0], -B[1]], w: V, rgb: [27, 64, 128], sealed: [33, 75, 144] },
  // the top (R), from its top corner: down to the right, and down to the left
  2: { o: T, u: A, w: B, rgb: [66, 118, 200], sealed: [48, 98, 177] },
};

interface Panel {
  face: Face;
  r: number;
  c: number;
  /** the share of the loading at which it is set */
  at: number;
  /** when it was set, or -1 */
  set: number;
}

/** the order of building: the walls course by course from the bottom, each from the front corner outwards; then the top, back to front */
function plan(): Panel[] {
  const walls: Panel[] = [];
  for (let q = 0; q < N; q++) {
    const r = N - 1 - q;
    for (let s = 0; s < N; s++) {
      walls.push({ face: 0, r, c: N - 1 - s, at: 0, set: -1 });
      walls.push({ face: 1, r, c: s, at: 0, set: -1 });
    }
  }
  walls.forEach((p, i) => (p.at = (WALLS_TO * (i + 1)) / walls.length));
  const top: Panel[] = [];
  for (let d = 0; d <= 2 * (N - 1); d++) for (let c = 0; c < N; c++) {
    const r = d - c;
    if (r >= 0 && r < N) top.push({ face: 2, r, c, at: 0, set: -1 });
  }
  top.forEach((p, i) => (p.at = WALLS_TO + ((ROOF_TO - WALLS_TO) * (i + 1)) / top.length));
  return [...walls, ...top];
}

export function buildLoaderMarkup(): string {
  return `<div class="bl" role="status" aria-label="Loading" data-nav-tone="dark">
  <span class="bl-sr">Loading the page</span>
  <div class="bl-back" aria-hidden="true"><canvas class="bl-grid"></canvas><i class="bl-light"></i></div>
  <div class="bl-col">
    <div class="bl-stage" aria-hidden="true">
      <canvas class="bl-cube"></canvas>
      <div class="bl-mark"><img src="${MARK}" alt="" decoding="async"><i class="bl-gloss"></i></div>
    </div>
    <div class="bl-words" aria-hidden="true">
      <svg class="bl-name" viewBox="0 0 150 40"><text x="75" y="19" text-anchor="middle" class="bl-name-rpc">RPC</text><text x="75" y="35.5" text-anchor="middle" class="bl-name-sub">CONSTRUCTIONS</text></svg>
      <ol class="bl-steps"><li><i><b class="bl-s0"></b></i><span>Walls</span></li><li><i><b class="bl-s1"></b></i><span>Roof</span></li><li><i><b class="bl-s2"></b></i><span>Sealed</span></li></ol>
    </div>
  </div>
</div>`;
}

export const BUILD_CSS = `
.bl{--m:clamp(190px,22vw,316px);--cream:#f5f0e6;position:fixed;inset:0;z-index:80;overflow:hidden;color:#eef3f5;font-family:var(--font-inter-tight),ui-sans-serif,system-ui,sans-serif;font-size:var(--fs-body,1rem)}
.bl-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
.bl-back{position:absolute;inset:0;background:radial-gradient(120% 90% at 50% 42%,#10284a 0%,#0b1d36 46%,#081526 100%);transition:opacity .75s cubic-bezier(.4,0,.2,1)}
.bl.is-leaving .bl-back{opacity:0}
.bl.is-leaving{pointer-events:none}
.bl-grid{position:absolute;inset:0;width:100%;height:100%;display:block;-webkit-mask:radial-gradient(closest-side at 50% 44%,#000 25%,rgba(0,0,0,.35) 70%,transparent 100%);mask:radial-gradient(closest-side at 50% 44%,#000 25%,rgba(0,0,0,.35) 70%,transparent 100%)}
.bl-light{position:absolute;left:50%;top:44%;width:calc(var(--m) * 2.4);height:calc(var(--m) * 2.4);transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(closest-side,rgba(70,128,214,.26),rgba(70,128,214,.08) 60%,rgba(70,128,214,0))}
.bl-col{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(.75rem,2.4vh,1.5rem);padding-bottom:4vh}
.bl-stage{position:relative;width:var(--m);height:var(--m)}
.bl-cube{position:absolute;inset:0;width:100%;height:100%;display:block;transition:opacity ${FLAT_MS}ms ease}
.bl.is-flat .bl-cube{opacity:0}
/* the logo, the same size and place as the cube drawn under it; its letters and lines are see-through, so a cream hexagon sits behind them as the top bar's tile does */
.bl-mark{--hex:polygon(49.8% 11.2%,84.3% 28.2%,84.3% 68.4%,49.8% 86.6%,15.4% 68.4%,15.4% 28.2%);position:absolute;inset:0;opacity:0;transform-origin:50% 50%;transition:opacity ${FLAT_MS}ms ease;will-change:transform}
.bl-mark::before{content:"";position:absolute;inset:0;background:var(--cream);clip-path:var(--hex)}
.bl-mark img{position:relative;display:block;width:100%;height:100%}
.bl.is-flat .bl-mark{opacity:1}
.bl-gloss{position:absolute;inset:0;clip-path:var(--hex);background:linear-gradient(115deg,rgba(255,255,255,0) 32%,rgba(255,255,255,.5) 48%,rgba(255,255,255,0) 62%) 0 0/300% 100% no-repeat;background-position:110% 0;opacity:0}
.bl.is-flat .bl-gloss{animation:bl-gloss .9s .05s cubic-bezier(.4,0,.2,1) forwards}
@keyframes bl-gloss{0%{opacity:1;background-position:110% 0}100%{opacity:1;background-position:-10% 0}}
.bl.is-landing .bl-mark{opacity:0;transition:opacity .16s ease}

.bl-words{display:flex;flex-direction:column;align-items:center;gap:1.1rem;transition:opacity .35s ease,transform .35s ease}
.bl.is-leaving .bl-words{opacity:0;transform:translateY(8px)}
.bl-name{display:block;width:calc(var(--m) * .78);height:calc(var(--m) * .208);overflow:visible;fill:#fff}
.bl-name-rpc{font:700 22px var(--font-logo,"Segoe UI"),Arial,sans-serif;letter-spacing:2.2px;animation:bl-rise .9s .15s cubic-bezier(.2,.8,.2,1) both}
.bl-name-sub{font:600 10.6px var(--font-inter-tight),Arial,sans-serif;letter-spacing:3.1px;fill-opacity:.8;animation:bl-track 1.2s .3s cubic-bezier(.2,.8,.2,1) both}
@keyframes bl-rise{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes bl-track{from{opacity:0;letter-spacing:9px}to{opacity:1;letter-spacing:3.1px}}
/* the three steps of the build, like the places under the hero: a thin line each, filling, with its name under it */
.bl-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.6rem;width:min(18rem,72vw);margin:0;padding:0;list-style:none}
.bl-steps li{display:flex;flex-direction:column;gap:.45rem}
.bl-steps i{display:block;height:2px;border-radius:2px;background:rgba(255,255,255,.18);overflow:hidden}
.bl-steps b{display:block;width:100%;height:100%;background:#fff;transform-origin:left center;transform:scaleX(var(--p,0));transition:background-color .4s ease}
.bl-steps span{font-weight:500;line-height:1.2;color:rgba(226,236,240,.5);transition:color .4s ease}
.bl-steps li.is-on span{color:#fff}
.bl.is-flat .bl-steps b{background:#7fd1a0}
@media (prefers-reduced-motion:reduce){.bl-name-rpc,.bl-name-sub,.bl.is-flat .bl-gloss{animation:none}.bl-cube{display:none}.bl-mark{opacity:1}}
`;

/** the cube mark in the top bar, if it is showing */
function barMark(): DOMRect | null {
  for (const img of document.querySelectorAll<HTMLImageElement>(".rn-logo img")) {
    const r = img.getBoundingClientRect();
    if (r.width < 8 || r.bottom < 0 || r.top > window.innerHeight) continue;
    let shown = true;
    for (let n: HTMLElement | null = img; n && n !== document.body; n = n.parentElement) {
      const s = getComputedStyle(n);
      if (s.display === "none" || s.visibility === "hidden" || Number(s.opacity) < 0.5) {
        shown = false;
        break;
      }
    }
    if (shown) return r;
  }
  return null;
}

const ease3 = (x: number) => 1 - Math.pow(1 - x, 3);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** runs the screen: the cube is built with the page's progress, sealed, becomes the logo and flies to the top bar */
export function mountBuildLoader(root: HTMLElement, opts: BuildOptions) {
  const el = root.querySelector<HTMLElement>(".bl");
  if (!el) return () => {};
  const cv = el.querySelector<HTMLCanvasElement>(".bl-cube");
  const grid = el.querySelector<HTMLCanvasElement>(".bl-grid");
  const mark = el.querySelector<HTMLElement>(".bl-mark");
  const markImg = mark?.querySelector("img") ?? null;
  const steps = [0, 1, 2].map((i) => el.querySelector<HTMLElement>(`.bl-s${i}`));
  const cx = cv?.getContext("2d") ?? null;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let quick = false;
  try {
    quick = sessionStorage.getItem(INTRO_KEY) === "1";
  } catch {
    /* storage unavailable: play the full opening */
  }
  window.scrollTo(0, 0);

  const start = performance.now();
  const minMs = reduced ? 300 : quick ? MIN_MS_RETURN : MIN_MS;
  let alive = true;
  let raf = 0;
  const timers: number[] = [];
  const later = (ms: number, f: () => void) => timers.push(window.setTimeout(() => alive && f(), ms));
  let last = start;
  /** shown progress, 0 … 1 */
  let k = 0;
  let finished = false;
  let released = false;
  const panels = plan();

  /* ---------- drawing ---------- */
  let px = 1;
  let size = 0;
  const fitCube = () => {
    if (!cv) return;
    const r = cv.getBoundingClientRect();
    px = Math.min(2, window.devicePixelRatio || 1);
    size = r.width;
    cv.width = Math.round(r.width * px);
    cv.height = Math.round(r.height * px);
  };
  /** the drawing paper: a grid on the cube's own panel lines (its two slopes and the upright), so the cube is built on it */
  const drawGrid = () => {
    if (!grid || !cv) return;
    const g = grid.getContext("2d");
    if (!g) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const gp = Math.min(2, window.devicePixelRatio || 1);
    grid.width = Math.round(w * gp);
    grid.height = Math.round(h * gp);
    g.setTransform(gp, 0, 0, gp, 0, 0);
    g.clearRect(0, 0, w, h);
    const box = cv.getBoundingClientRect();
    const s = box.width / 600;
    if (!s) return;
    // one panel along each slope, on screen; the grid runs through the cube's front corner
    const a = [(A[0] / N) * s, (A[1] / N) * s];
    const b = [(B[0] / N) * s, (B[1] / N) * s];
    const o = [box.left + CEN[0] * s, box.top + CEN[1] * s];
    const reach = Math.ceil((w + h) / Math.hypot(a[0]!, a[1]!)) + 2;
    const L = reach * 2;
    g.strokeStyle = "rgba(190,215,245,.085)";
    g.lineWidth = 1;
    g.beginPath();
    for (let n = -reach; n <= reach; n++) {
      // along one slope through each step of the other, and upright through each step along a slope
      const p = [o[0]! + n * b[0]!, o[1]! + n * b[1]!];
      g.moveTo(p[0]! - L * a[0]!, p[1]! - L * a[1]!);
      g.lineTo(p[0]! + L * a[0]!, p[1]! + L * a[1]!);
      const q = [o[0]! + n * a[0]!, o[1]! + n * a[1]!];
      g.moveTo(q[0]! - L * b[0]!, q[1]! - L * b[1]!);
      g.lineTo(q[0]! + L * b[0]!, q[1]! + L * b[1]!);
      g.moveTo(q[0]!, 0);
      g.lineTo(q[0]!, h);
    }
    g.stroke();
  };

  const at = (o: readonly [number, number], u: readonly [number, number], w: readonly [number, number], a: number, b: number) =>
    [o[0] + u[0] * a + w[0] * b, o[1] + u[1] * a + w[1] * b] as const;

  const draw = (now: number) => {
    if (!cx || !cv) return;
    const s = (size / 600) * px;
    cx.setTransform(1, 0, 0, 1, 0, 0);
    cx.clearRect(0, 0, cv.width, cv.height);
    cx.setTransform(s, 0, 0, s, 0, 0);
    const seal = clamp01((k - (ROOF_TO + 0.01)) / (1 - ROOF_TO - 0.01));

    // the setting-out lines: the cube's outline and its three inner edges, fading as it is sealed
    const lines = (1 - seal) * 0.55;
    if (lines > 0.01) {
      cx.save();
      cx.strokeStyle = `rgba(214,230,248,${lines})`;
      cx.lineWidth = 1.6;
      cx.setLineDash([7, 7]);
      cx.beginPath();
      const hex = [T, [510, 166], [510, 413], [299, 516], [88, 413], UL] as const;
      hex.forEach((p, i) => (i ? cx.lineTo(p[0], p[1]) : cx.moveTo(p[0], p[1])));
      cx.closePath();
      cx.moveTo(UL[0], UL[1]);
      cx.lineTo(CEN[0], CEN[1]);
      cx.lineTo(510, 166);
      cx.moveTo(CEN[0], CEN[1]);
      cx.lineTo(299, 516);
      cx.stroke();
      cx.restore();
    }

    // the panels, each set in place from a little above; the joints close and the colours become the logo's as it is sealed
    const gap = 0.075 * (1 - seal);
    for (const p of panels) {
      if (p.set < 0) continue;
      const f = FACES[p.face];
      const t = reduced ? 1 : clamp01((now - p.set) / SET_MS);
      const e = ease3(t);
      const lift = (1 - e) * 34;
      const c0 = (p.c + gap / 2) / N;
      const c1 = (p.c + 1 - gap / 2) / N;
      const r0 = (p.r + gap / 2) / N;
      const r1 = (p.r + 1 - gap / 2) / N;
      const q = [at(f.o, f.u, f.w, c0, r0), at(f.o, f.u, f.w, c1, r0), at(f.o, f.u, f.w, c1, r1), at(f.o, f.u, f.w, c0, r1)];
      const rgb = f.rgb.map((v, i) => Math.round(v + (f.sealed[i]! - v) * seal));
      cx.globalAlpha = e;
      cx.fillStyle = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
      cx.beginPath();
      q.forEach((v, i) => (i ? cx.lineTo(v[0], v[1] - lift) : cx.moveTo(v[0], v[1] - lift)));
      cx.closePath();
      cx.fill();
      // a fine light edge along each panel's upper side, gone once sealed
      if (seal < 1) {
        cx.strokeStyle = `rgba(255,255,255,${0.2 * (1 - seal)})`;
        cx.lineWidth = 1.4;
        cx.beginPath();
        cx.moveTo(q[0]![0], q[0]![1] - lift);
        cx.lineTo(q[1]![0], q[1]![1] - lift);
        cx.stroke();
      }
    }
    cx.globalAlpha = 1;
  };

  /* ---------- the steps under the name ---------- */
  const showSteps = () => {
    const parts = [k / WALLS_TO, (k - WALLS_TO) / (ROOF_TO - WALLS_TO), (k - ROOF_TO) / (1 - ROOF_TO)];
    parts.forEach((v, i) => {
      const b = steps[i];
      if (!b) return;
      const p = clamp01(v);
      b.style.setProperty("--p", p.toFixed(3));
      b.closest("li")?.classList.toggle("is-on", p > 0);
    });
  };

  /* ---------- the end ---------- */
  const release = () => {
    if (released) return;
    released = true;
    opts.onStart?.();
    opts.onReveal?.();
  };
  /** the logo flies up onto the top bar's (or, with no bar to go to, settles back in place) as the screen fades */
  const leave = () => {
    release();
    el.classList.add("is-leaving");
    const to = reduced ? null : barMark();
    if (mark && to) {
      const from = mark.getBoundingClientRect();
      const sc = to.width / from.width;
      const dx = to.left + to.width / 2 - (from.left + from.width / 2);
      const dy = to.top + to.height / 2 - (from.top + from.height / 2);
      mark.style.transition = `transform ${FLY_MS}ms cubic-bezier(.7,0,.2,1)`;
      mark.style.transform = `translate(${dx}px,${dy}px) scale(${sc})`;
      later(FLY_MS, () => el.classList.add("is-landing"));
      later(FLY_MS + 200, () => opts.onGone?.());
    } else {
      if (mark) {
        mark.style.transition = "transform .7s cubic-bezier(.4,0,.2,1), opacity .6s ease";
        mark.style.transform = "scale(.92)";
        mark.style.opacity = "0";
      }
      later(reduced ? 450 : 780, () => opts.onGone?.());
    }
  };
  const finish = () => {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(raf);
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* fine: the next visit plays the full opening */
    }
    // the built cube becomes the logo (once its picture is in), the gloss runs over it, then it leaves
    const flat = () => {
      el.classList.add("is-flat");
      later(reduced ? 200 : FLAT_MS + HOLD_MS, leave);
    };
    if (!markImg || (markImg.complete && markImg.naturalWidth > 0)) flat();
    else {
      let once = false;
      const go = () => {
        if (once || !alive) return;
        once = true;
        flat();
      };
      markImg.addEventListener("load", go, { once: true });
      markImg.addEventListener("error", go, { once: true });
      later(700, go);
    }
  };

  /* ---------- the loop ---------- */
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    const t = now - start;
    // real time between frames, so a slow phone sees the same pace, only in fewer steps
    const dt = Math.min(0.25, Math.max(0, (now - last) / 1000));
    last = now;
    const p = opts.getProgress() ?? { share: 0, done: false };
    const done = p.done || t > MAX_MS;

    // the share shown: it creeps while the page loads (the top laid, waiting to be sealed), completes once it is in, and never outruns the minimum time
    const creep = (ROOF_TO + 0.01) * (1 - Math.exp(-t / 1400));
    const target = done ? 1 : Math.max(creep, Math.min(ROOF_TO + 0.01, p.share * ROOF_TO));
    k += (target - k) * Math.min(1, dt * (done ? 5 : 3));
    k = Math.min(k, t / minMs, 1);
    if (done && t >= minMs && k > 0.995) k = 1;
    if (reduced) k = done ? 1 : k;

    for (const pn of panels) if (pn.set < 0 && (reduced || k >= pn.at)) pn.set = now;
    draw(now);
    showSteps();
    // the last panel set, and sealed
    const settled = panels.every((pn) => pn.set >= 0 && (reduced || now - pn.set >= SET_MS));
    if (k >= 1 && settled) finish();
  };

  fitCube();
  drawGrid();
  raf = requestAnimationFrame(loop);
  const onResize = () => {
    fitCube();
    drawGrid();
  };
  window.addEventListener("resize", onResize);

  return () => {
    alive = false;
    cancelAnimationFrame(raf);
    timers.forEach((id) => window.clearTimeout(id));
    window.removeEventListener("resize", onResize);
  };
}
