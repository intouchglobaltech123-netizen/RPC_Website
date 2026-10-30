/**
 * Opening screen for the home page: "the rain clears". The hero's own first
 * frame (the dry house) shows dark, blurred and grey behind falling rain, and
 * the RPC cube turns slowly in the middle, as on a turntable, inside a thin
 * ring that fills as the page loads. As the page loads the rain eases off and
 * the picture sharpens into colour. When it is in, the cube glides to the
 * angle of the logo and becomes the logo itself (the letters stand upright), a
 * gloss runs over it as the line under it reads "Dry", and it flies up into
 * the logo in the top bar while the screen melts away onto the hero, whose
 * film starts on that same frame.
 *
 * Three copies of the picture (heavily blurred, slightly blurred, sharp) are
 * cross-faded rather than one picture re-blurred every frame, so it stays
 * smooth on phones. The cube is turned from the frame loop, so it can ease to
 * rest wherever it is when the page is ready.
 *
 * Plain markup and one mount function, like lib/loader/drop.ts, with the same
 * options, so it drops into the same place. Everything here is the paragraph
 * size, like the rest of the site's small type.
 */

export interface ClearProgress {
  /** share of the page's pictures loaded, 0 … 1 */
  share: number;
  /** everything is in */
  done: boolean;
}
export interface ClearOptions {
  getProgress: () => ClearProgress | null | undefined;
  /** the screen starts to go: the page underneath can start */
  onStart?: () => void;
  /** the same moment, for whatever should begin as the screen goes */
  onReveal?: () => void;
  /** the screen has gone */
  onGone?: () => void;
  /** accepted for parity with the rain loader; this screen is dark throughout */
  pageTone?: "light" | "dark";
}

/** the hero's first frame (lib/monsoon/copy.ts film.poster) */
const PICTURE = "/videos/hero/monsoon-house-poster.jpg";
/** the cube mark, the same picture the top bar shows (public/logo.png), made light for this screen */
const MARK = "/media/loader-mark.webp";
/** set once the full opening has played, so a return in the same visit is quicker */
const INTRO_KEY = "rpc-clear-intro";
/** the screen shows for at least this long, so the clearing and the cube are seen */
const MIN_MS = 1600;
const MIN_MS_RETURN = 700;
/** after this the screen goes whether the page is ready or not */
const MAX_MS = 9000;
/** the cube coming to rest, becoming the logo, the gloss and "Dry", the flight to the top bar */
const SETTLE_MS = 650;
const FLAT_MS = 240;
const HOLD_MS = 560;
const FLY_MS = 820;
/** turns a second, like a turntable */
const SPIN = 0.28;

/** far rain: thin and quick; near rain: a few heavier, softer streaks */
const far = [
  [4, 70, 0.78, -0.1], [10, 84, 0.9, -0.5], [16, 62, 0.82, -0.3], [22, 88, 0.95, -0.8], [28, 66, 0.86, -0.2],
  [34, 76, 0.76, -0.6], [40, 60, 0.88, -0.9], [46, 82, 0.84, -0.4], [52, 72, 0.98, -0.7], [58, 64, 0.8, -0.15],
  [64, 86, 0.92, -0.55], [70, 68, 0.83, -0.35], [76, 78, 0.89, -0.85], [82, 62, 0.79, -0.25], [88, 80, 0.94, -0.65],
  [94, 70, 0.85, -0.45],
] as const;
const near = [
  [8, 150, 1.25, -0.3], [27, 170, 1.4, -0.9], [49, 140, 1.3, -0.5], [68, 180, 1.45, -1.1], [86, 160, 1.35, -0.2],
] as const;

export function clearLoaderMarkup(): string {
  const streak = ([l, h, d, s]: readonly number[]) => `<i style="left:${l}%;height:${h}px;animation-duration:${d}s;animation-delay:${s}s"></i>`;
  return `<div class="cl" role="status" aria-label="Loading" data-nav-tone="dark">
  <span class="cl-sr">Loading the page</span>
  <div class="cl-back" aria-hidden="true">
    <img class="cl-img cl-img-a" src="${PICTURE}" alt="" decoding="async" fetchpriority="high">
    <img class="cl-img cl-img-b" src="${PICTURE}" alt="" decoding="async">
    <img class="cl-img cl-img-c" src="${PICTURE}" alt="" decoding="async">
    <div class="cl-tint"></div>
    <div class="cl-rain cl-rain-far">${far.map(streak).join("")}</div>
    <div class="cl-rain cl-rain-near">${near.map(streak).join("")}</div>
    <div class="cl-vig"></div>
  </div>
  <div class="cl-col">
    <div class="cl-stage" aria-hidden="true">
      <i class="cl-glow"></i>
      <svg class="cl-ring" viewBox="0 0 100 100"><circle class="cl-ring-bg" cx="50" cy="50" r="48"></circle><circle class="cl-ring-ticks" cx="50" cy="50" r="45.6" pathLength="120"></circle><circle class="cl-ring-fg" cx="50" cy="50" r="48" pathLength="100"></circle></svg>
      <i class="cl-head"><b></b></i>
      <i class="cl-shadow"></i>
      <i class="cl-ripples"><b></b><b></b><b></b><b></b><b></b></i>
      <div class="cl-fly">
        <div class="cl-cube">
          <b class="cl-face cl-front"><span class="cl-cc">C<span>C</span></span></b><b class="cl-face cl-back-face"><span class="cl-cc">C<span>C</span></span></b><b class="cl-face cl-right">P</b>
          <b class="cl-face cl-left">P</b><b class="cl-face cl-top">R</b><b class="cl-face cl-bottom"></b>
        </div>
      </div>
      <div class="cl-mark"><img src="${MARK}" alt="" decoding="async"><i class="cl-gloss"></i></div>
    </div>
    <div class="cl-words" aria-hidden="true">
      <svg class="cl-name" viewBox="0 0 150 40" role="img" aria-label="RPC Constructions"><text x="75" y="19" text-anchor="middle" class="cl-name-rpc">RPC</text><text x="75" y="35.5" text-anchor="middle" class="cl-name-sub">CONSTRUCTIONS</text></svg>
      <p class="cl-tag">Waterproofing for <span class="cl-words-in"><span class="cl-roll"><span>terraces</span><span>ceilings</span><span>bathrooms</span><span>outside walls</span><span>terraces</span></span></span></p>
      <p class="cl-state"><span class="cl-loading">Loading <span><span data-cl-pct>0</span>%</span></span><span class="cl-dry"><i></i>Dry</span></p>
    </div>
  </div>
</div>`;
}

export const CLEAR_CSS = `
.cl{--k:0;--cs:clamp(100px,10.5vw,150px);--blue:#27559e;--cream:#f5f0e6;position:fixed;inset:0;z-index:80;overflow:hidden;color:#eef3f5;font-family:var(--font-inter-tight),ui-sans-serif,system-ui,sans-serif;font-size:var(--fs-body,1rem)}
.cl-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
.cl-back{position:absolute;inset:0;background:#0a1823;transition:opacity .7s cubic-bezier(.4,0,.2,1)}
.cl.is-leaving .cl-back{opacity:0}
.cl.is-leaving{pointer-events:none}
.cl-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:100% 100%;display:block}
.cl-img-a{filter:blur(24px) saturate(.2) brightness(.5);transform:scale(1.1)}
.cl-img-b{filter:blur(7px) saturate(.6) brightness(.76);transform:scale(1.04);opacity:clamp(0,calc(var(--k) * 1.9),1)}
.cl-img-c{opacity:clamp(0,calc((var(--k) - .45) * 1.82),1)}
.cl-tint{position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,24,35,.5),rgba(10,24,35,.28) 50%,rgba(10,24,35,.55));opacity:calc(1 - var(--k))}
.cl-vig{position:absolute;inset:0;background:radial-gradient(120% 95% at 50% 46%,rgba(5,12,18,0) 52%,rgba(5,12,18,.5) 100%),radial-gradient(min(44vw,400px) min(36vh,280px) at 50% 50%,rgba(6,15,23,.5),rgba(6,15,23,.2) 62%,rgba(6,15,23,0))}
.cl-rain{position:absolute;inset:0;overflow:hidden}
.cl-rain i{position:absolute;top:0;border-radius:2px;animation:cl-fall linear infinite}
.cl-rain-far{opacity:clamp(0,calc((.92 - var(--k)) * 1.6),1)}
.cl-rain-far i{width:1.2px;background:linear-gradient(180deg,rgba(200,222,240,0),rgba(200,222,240,.36))}
.cl-rain-near{opacity:clamp(0,calc((.8 - var(--k)) * 1.6),.5)}
.cl-rain-near i{width:3px;filter:blur(1.4px);background:linear-gradient(180deg,rgba(215,232,246,0),rgba(215,232,246,.42))}
@keyframes cl-fall{from{transform:translate(0,-200px) rotate(10deg)}to{transform:translate(-24vh,118vh) rotate(10deg)}}

.cl-col{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:calc(var(--cs) * .66 + 1.5rem)}
.cl-stage{position:relative;width:var(--cs);height:var(--cs)}
.cl-shadow{position:absolute;left:50%;top:calc(100% + var(--cs) * .3);width:calc(var(--cs) * 1.15);height:calc(var(--cs) * .16);transform:translateX(-50%);border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.6),rgba(0,0,0,0));transition:opacity .35s ease}
.cl.is-leaving .cl-shadow{opacity:0}
/* the share loaded, as a thin ring round the cube with a bright head */
.cl-ring{position:absolute;left:50%;top:50%;width:calc(var(--cs) * 2.3);height:calc(var(--cs) * 2.3);transform:translate(-50%,-50%) rotate(-90deg);overflow:visible;transition:opacity .35s ease}
.cl-ring circle{fill:none;stroke-width:.4}
.cl-ring-bg{stroke:rgba(255,255,255,.14)}
.cl-ring-ticks{stroke:rgba(255,255,255,.2) !important;stroke-width:1.6 !important;stroke-dasharray:.12 .88}
/* a soft blue light behind the cube, a little stronger once it is sealed */
.cl-glow{position:absolute;left:50%;top:50%;width:calc(var(--cs) * 2.6);height:calc(var(--cs) * 2.6);transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(closest-side,rgba(74,134,222,.34),rgba(74,134,222,.12) 55%,rgba(74,134,222,0));transition:opacity .5s ease,transform .6s ease}
.cl.is-dry .cl-glow{transform:translate(-50%,-50%) scale(1.08);background:radial-gradient(closest-side,rgba(110,170,240,.42),rgba(110,170,240,.14) 55%,rgba(110,170,240,0))}
.cl.is-leaving .cl-glow{opacity:0}
/* rain landing round the cube's base */
.cl-ripples{position:absolute;left:50%;top:calc(100% + var(--cs) * .38);width:calc(var(--cs) * 2.2);height:calc(var(--cs) * .36);transform:translate(-50%,-50%);opacity:clamp(0,calc((.85 - var(--k)) * 2.2),.9);transition:opacity .4s ease}
.cl-ripples b{position:absolute;width:calc(var(--cs) * .34);height:calc(var(--cs) * .08);margin:calc(var(--cs) * -.04) 0 0 calc(var(--cs) * -.17);border-radius:50%;border:1px solid rgba(210,230,248,.55);opacity:0;animation:cl-ripple 1.7s ease-out infinite}
.cl-ripples b:nth-child(1){left:18%;top:40%;animation-delay:-.2s}
.cl-ripples b:nth-child(2){left:74%;top:62%;animation-delay:-.9s}
.cl-ripples b:nth-child(3){left:42%;top:78%;animation-delay:-1.4s}
.cl-ripples b:nth-child(4){left:88%;top:30%;animation-delay:-.5s}
.cl-ripples b:nth-child(5){left:6%;top:70%;animation-delay:-1.15s}
@keyframes cl-ripple{0%{transform:scale(.15);opacity:0}12%{opacity:.9}100%{transform:scale(1.25);opacity:0}}
.cl.is-leaving .cl-ripples{opacity:0}
.cl-ring-fg{stroke:rgba(255,255,255,.9);stroke-linecap:round;stroke-dasharray:100;stroke-dashoffset:calc(100 - var(--k) * 100);transition:stroke .4s ease}
.cl.is-dry .cl-ring-fg{stroke:#7fd1a0}
.cl-head{position:absolute;left:50%;top:50%;width:0;height:0;transform:rotate(calc(var(--k) * 360deg));opacity:clamp(0,calc(var(--k) * 30),1);transition:opacity .35s ease}
.cl-head b{position:absolute;left:-3px;top:calc(var(--cs) * -1.104 - 3px);width:6px;height:6px;border-radius:50%;background:#fff}
.cl.is-dry .cl-head,.cl.is-leaving .cl-ring{opacity:0}
.cl-fly{position:absolute;inset:0;perspective:calc(var(--cs) * 9);transition:opacity ${FLAT_MS}ms ease}
.cl.is-flat .cl-fly{opacity:0}
.cl-cube{position:relative;width:100%;height:100%;transform-style:preserve-3d;transform:rotateX(-35.264deg) rotateY(45deg)}
.cl-face{position:absolute;inset:0;box-sizing:border-box;border:calc(var(--cs) * .03) solid var(--cream);display:grid;place-items:center;font:700 calc(var(--cs) * .5)/1 var(--font-logo,"Segoe UI"),Arial,sans-serif;color:var(--cream);backface-visibility:hidden;background:var(--blue)}
/* light from above, a little left, in front: each face's shade (--sh) and shine (--sp) are set as it turns */
.cl-face::before{content:"";position:absolute;inset:0;background:#06142a;opacity:var(--sh,.2)}
.cl-face::after{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.5),rgba(255,255,255,0) 58%);opacity:calc(.14 + var(--sp,0))}
.cl-front{transform:translateZ(calc(var(--cs) / 2))}
.cl-back-face{transform:rotateY(180deg) translateZ(calc(var(--cs) / 2))}
.cl-right{transform:rotateY(90deg) translateZ(calc(var(--cs) / 2))}
.cl-left{transform:rotateY(-90deg) translateZ(calc(var(--cs) / 2))}
.cl-top{transform:rotateX(90deg) translateZ(calc(var(--cs) / 2))}
.cl-bottom{transform:rotateX(-90deg) translateZ(calc(var(--cs) / 2))}
.cl-cc{position:relative;display:inline-grid;place-items:center}
.cl-cc span{position:absolute;font-size:var(--fs-body,1rem);left:22%;top:50%;transform:translateY(-52%)}

/* the logo itself: the hexagon of the picture (85.0% wide of it, its middle 1.1% above the picture's) is as wide as the cube seen at the logo's angle;
   its letters and lines are see-through, so a cream hexagon sits behind them, as the top bar's tile does */
.cl-mark{--hex:polygon(49.8% 11.2%,84.3% 28.2%,84.3% 68.4%,49.8% 86.6%,15.4% 68.4%,15.4% 28.2%);position:absolute;left:50%;top:calc(50% + var(--cs) * .022);width:calc(var(--cs) * 2.01);height:calc(var(--cs) * 2.01);margin:calc(var(--cs) * -1.005) 0 0 calc(var(--cs) * -1.005);opacity:0;transition:opacity ${FLAT_MS}ms ease;transform-origin:50% 50%;will-change:transform}
.cl.is-flat .cl-mark{opacity:1}
.cl-mark::before{content:"";position:absolute;inset:0;background:var(--cream);clip-path:var(--hex)}
.cl-mark img{position:relative;display:block;width:100%;height:100%}
.cl-gloss{position:absolute;inset:0;clip-path:var(--hex);background:linear-gradient(115deg,rgba(255,255,255,0) 30%,rgba(255,255,255,.55) 48%,rgba(255,255,255,0) 64%) 0 0/300% 100% no-repeat;background-position:110% 0;opacity:0}
.cl.is-dry .cl-gloss{animation:cl-gloss .8s cubic-bezier(.4,0,.2,1) forwards}
@keyframes cl-gloss{0%{opacity:1;background-position:110% 0}100%{opacity:1;background-position:-10% 0}}
.cl.is-landing .cl-mark{opacity:0;transition:opacity .16s ease}

.cl-words{display:flex;flex-direction:column;align-items:center;text-align:center;transition:opacity .35s ease,transform .35s ease}
.cl.is-leaving .cl-words{opacity:0;transform:translateY(8px)}
.cl-name{display:block;height:calc(var(--cs) * .4);width:calc(var(--cs) * 1.5);overflow:visible;fill:#fff;filter:drop-shadow(0 1px 10px rgba(0,0,0,.45))}
.cl-name-rpc{font:700 22px var(--font-logo,"Segoe UI"),Arial,sans-serif;letter-spacing:2.2px}
.cl-name-sub{font:600 10.6px var(--font-inter-tight),Arial,sans-serif;letter-spacing:3.1px;fill-opacity:.8}
/* the name settles in: RPC rises, CONSTRUCTIONS draws in to its spacing */
.cl-name-rpc{animation:cl-rise .9s .15s cubic-bezier(.2,.8,.2,1) both}
.cl-name-sub{animation:cl-track 1.2s .3s cubic-bezier(.2,.8,.2,1) both}
@keyframes cl-rise{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes cl-track{from{opacity:0;letter-spacing:9px}to{opacity:1;letter-spacing:3.1px}}
.cl-tag{display:flex;align-items:baseline;justify-content:center;gap:.3em;margin:.7rem 0 0;font-weight:500;line-height:1.4;color:rgba(232,240,244,.8);text-shadow:0 1px 14px rgba(0,0,0,.5)}
/* what we waterproof, one after another */
.cl-words-in{display:inline-block;height:1.4em;overflow:hidden;vertical-align:bottom;text-align:left;min-width:6.6em}
.cl-roll{display:flex;flex-direction:column;color:#fff;font-weight:600;animation:cl-roll 5.2s cubic-bezier(.7,0,.25,1) infinite}
.cl-roll span{display:block;height:1.4em;line-height:1.4;white-space:nowrap}
@keyframes cl-roll{0%,20%{transform:translateY(0)}25%,45%{transform:translateY(-1.4em)}50%,70%{transform:translateY(-2.8em)}75%,95%{transform:translateY(-4.2em)}100%{transform:translateY(-5.6em)}}

.cl-state{position:relative;margin:.85rem 0 0;width:12rem;height:1.4em;line-height:1.4;font-weight:500;text-shadow:0 1px 14px rgba(0,0,0,.5)}
.cl-loading,.cl-dry{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:.45rem;white-space:nowrap;transition:opacity .3s ease,transform .3s ease}
.cl-loading{color:rgba(232,240,244,.86);font-variant-numeric:tabular-nums}
.cl-dry{color:#fff;opacity:0;transform:translateY(4px)}
.cl-dry i{flex:none;width:7px;height:7px;border-radius:50%;background:#7fd1a0;box-shadow:0 0 0 4px rgba(127,209,160,.25)}
.cl.is-dry .cl-loading{opacity:0}
.cl.is-dry .cl-dry{opacity:1;transform:none}
@media (max-width:899px),(max-aspect-ratio:7/5){.cl-img{object-position:62% 50%}}
@media (prefers-reduced-motion:reduce){.cl-rain,.cl-ripples{display:none}.cl-fly,.cl-head{display:none}.cl-roll,.cl-name-rpc,.cl-name-sub{animation:none}.cl-mark{opacity:1}.cl.is-dry .cl-gloss{animation:none}}
`;

/** iso: the angle of the logo, the top face (R) up and P and C either side */
const ISO_X = -35.264;
const ISO_Y = 45;
/** from where the cube is, carrying on at the speed it is turning (m, as a share of the whole move per unit time), to rest */
/** the light, from above, a little left and in front, and the direction halfway between it and you, for the shine */
const LIGHT = (() => {
  const v = [-0.2, -0.45, 0.87];
  const l = Math.hypot(v[0]!, v[1]!, v[2]!);
  return v.map((c) => c / l) as [number, number, number];
})();
const HALF = (() => {
  const v = [LIGHT[0], LIGHT[1], LIGHT[2] + 1];
  const l = Math.hypot(v[0]!, v[1]!, v[2]!);
  return v.map((c) => c / l) as [number, number, number];
})();
const glide = (x: number, m: number) => m * (x * x * x - 2 * x * x + x) + (-2 * x * x * x + 3 * x * x);

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

/** runs the screen: the picture clears with the page's progress, the cube tumbles, settles into the logo and flies to the top bar */
export function mountClearLoader(root: HTMLElement, opts: ClearOptions) {
  const el = root.querySelector<HTMLElement>(".cl");
  if (!el) return () => {};
  const cube = el.querySelector<HTMLElement>(".cl-cube");
  /** the faces that can face you, and which way each points before the cube turns (x right, y down, z towards you) */
  const faces = (
    [
      [".cl-front", 0, 0, 1],
      [".cl-right", 1, 0, 0],
      [".cl-left", -1, 0, 0],
      [".cl-top", 0, -1, 0],
      [".cl-bottom", 0, 1, 0],
      [".cl-back-face", 0, 0, -1],
    ] as const
  ).map(([sel, x, y, z]) => ({ el: el.querySelector<HTMLElement>(sel), n: [x, y, z] as const }));
  const mark = el.querySelector<HTMLElement>(".cl-mark");
  const pctEl = el.querySelector<HTMLElement>("[data-cl-pct]");
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
  let shownPct = -1;
  /** the cube's turn about the upright, in whole turns: every half turn (0, ½, 1 …) is the logo's angle */
  let turn = 0;
  let settling = false;
  let settled = reduced;
  let settleFrom = 0;
  let settleTo = 0;
  let settleAt = 0;
  let settleMs = SETTLE_MS;
  let settleM = 2;
  let released = false;
  let finished = false;
  if (reduced) el.classList.add("is-flat");

  const release = () => {
    if (released) return;
    released = true;
    opts.onStart?.();
    opts.onReveal?.();
  };

  /** the logo flies up into the top bar's (or, with no bar to go to, settles back in place) as the screen melts away */
  const leave = () => {
    release();
    el.classList.add("is-leaving");
    const to = reduced ? null : barMark();
    if (mark && to) {
      const from = mark.getBoundingClientRect();
      const s = to.width / from.width;
      const dx = to.left + to.width / 2 - (from.left + from.width / 2);
      const dy = to.top + to.height / 2 - (from.top + from.height / 2);
      mark.style.transition = `transform ${FLY_MS}ms cubic-bezier(.7,0,.2,1)`;
      mark.style.transform = `translate(${dx}px,${dy}px) scale(${s})`;
      later(FLY_MS, () => el.classList.add("is-landing"));
      later(FLY_MS + 200, () => opts.onGone?.());
    } else {
      if (mark) {
        mark.style.transition = "transform .7s cubic-bezier(.4,0,.2,1), opacity .6s ease";
        mark.style.transform = "scale(.9)";
        mark.style.opacity = "0";
      }
      later(reduced ? 450 : 760, () => opts.onGone?.());
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
    // the cube becomes the logo, the gloss runs over it and the line reads "Dry", then it leaves
    el.classList.add("is-flat");
    later(reduced ? 0 : FLAT_MS, () => el.classList.add("is-dry"));
    later(reduced ? 250 : FLAT_MS + HOLD_MS, leave);
  };

  const setCube = (a: number) => {
    if (!cube) return;
    const ax = ISO_X;
    const ay = ISO_Y + 360 * a;
    cube.style.transform = `rotateX(${ax}deg) rotateY(${ay}deg)`;
    // each face: turned as the cube is (rotateY first, then rotateX), then lit
    const cx = Math.cos((ax * Math.PI) / 180);
    const sx = Math.sin((ax * Math.PI) / 180);
    const cy = Math.cos((ay * Math.PI) / 180);
    const sy = Math.sin((ay * Math.PI) / 180);
    for (const f of faces) {
      if (!f.el) continue;
      const [x, y, z] = f.n;
      const x1 = cy * x + sy * z;
      const z1 = -sy * x + cy * z;
      const y2 = cx * y - sx * z1;
      const z2 = sx * y + cx * z1;
      if (z2 <= 0) continue;
      const diffuse = Math.max(0, x1 * LIGHT[0] + y2 * LIGHT[1] + z2 * LIGHT[2]);
      const shine = Math.pow(Math.max(0, x1 * HALF[0] + y2 * HALF[1] + z2 * HALF[2]), 24);
      f.el.style.setProperty("--sh", Math.min(0.42, Math.max(0, 0.4 - 0.45 * diffuse)).toFixed(3));
      f.el.style.setProperty("--sp", (shine * 0.3).toFixed(3));
    }
  };

  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    const t = now - start;
    // real time between frames, so a slow phone sees the same pace, only in fewer steps (a long stall, such as a hidden tab, counts as a quarter second)
    const dt = Math.min(0.25, Math.max(0, (now - last) / 1000));
    last = now;
    const p = opts.getProgress() ?? { share: 0, done: false };
    const done = p.done || t > MAX_MS;

    // the share shown: it creeps while the page loads, completes once it is in, and never outruns the minimum time
    const creep = 0.86 * (1 - Math.exp(-t / 1500));
    const target = done ? 1 : Math.max(creep, Math.min(0.9, p.share * 0.9));
    k += (target - k) * Math.min(1, dt * (done ? 6 : 3));
    k = Math.min(k, t / minMs, 1);
    if (done && t >= minMs && k > 0.995) k = 1;
    el.style.setProperty("--k", k.toFixed(3));
    const pct = Math.round(k * 100);
    if (pctEl && pct !== shownPct) {
      shownPct = pct;
      pctEl.textContent = String(pct);
    }

    if (!settled && !settling) {
      turn += SPIN * dt;
      setCube(turn);
      if (done && k > 0.75) {
        // glide on to the next resting angle, slowing from the speed it is turning at
        settling = true;
        settleFrom = turn;
        settleTo = Math.ceil((turn + 0.06) * 2) / 2;
        settleAt = now;
        const span = settleTo - settleFrom;
        settleMs = Math.min(1100, Math.max(SETTLE_MS, ((2 * span) / SPIN) * 1000));
        settleM = (SPIN * settleMs) / 1000 / span;
      }
    } else if (settling) {
      const x = Math.min(1, (now - settleAt) / settleMs);
      setCube(settleFrom + (settleTo - settleFrom) * glide(x, settleM));
      if (x >= 1) {
        settling = false;
        settled = true;
      }
    }
    if (settled && k >= 1) finish();
  };
  raf = requestAnimationFrame(loop);

  return () => {
    alive = false;
    cancelAnimationFrame(raf);
    timers.forEach((id) => window.clearTimeout(id));
  };
}
