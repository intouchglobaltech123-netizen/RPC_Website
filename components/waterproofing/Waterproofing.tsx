"use client";

import { ArrowUpRight, Droplets, Play, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SectionMarker } from "@/components/ui/Primitives";
import { ScrollTrigger } from "@/lib/gsap";
import { waterproofIntro, waterproofOutro, waterproofStops } from "@/lib/waterproofing";
import manifest from "@/public/waterproof/manifest.json";

const useIso = typeof window !== "undefined" ? useLayoutEffect : () => {};

/*
 * Scroll timeline, in "units" (1 unit ≈ 75vh of scrolling):
 *   intro hold → [travel to area, hold on the reveal] × 3 → outro hold
 * The film only moves during a travel; during a hold it rests on the
 * cut-away so the headline and the system card can be read.
 */
const INTRO = 0.55;
const TRAVEL = 1;
const HOLD = 0.7;
const OUTRO = 0.8;
const CLIPS = waterproofStops.length;
const UNITS = INTRO + CLIPS * (TRAVEL + HOLD) + OUTRO;
const VH_PER_UNIT = 75;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** frame index where the film starts and where each area's reveal lands */
const BOUNDS: number[] = [0, ...manifest.stops];
/** film position (0 … CLIPS) → frame index; segments can differ in length */
const frameAt = (x: number) => {
  const i = Math.min(Math.floor(x), CLIPS - 1);
  const a = BOUNDS[i] ?? 0;
  const b = BOUNDS[i + 1] ?? a;
  return a + (b - a) * clamp(x - i);
};
const ramp = (u: number, a: number, b: number) => clamp((u - a) / (b - a));

/** film position (0 … CLIPS) for a scroll position in units */
function filmAt(u: number) {
  if (u <= INTRO) return 0;
  for (let i = 0; i < CLIPS; i++) {
    const s = INTRO + i * (TRAVEL + HOLD);
    if (u < s + TRAVEL) return i + (u - s) / TRAVEL;
    if (u < s + TRAVEL + HOLD) return i + 1;
  }
  return CLIPS;
}

/** opacity of each overlay: [intro, stop 0 … stop 4, outro] */
function overlaysAt(u: number) {
  const out: number[] = [1 - ramp(u, INTRO - 0.05, INTRO + 0.3)];
  for (let i = 0; i < CLIPS; i++) {
    const hs = INTRO + i * (TRAVEL + HOLD) + TRAVEL; // hold start
    const he = hs + HOLD;
    const fadeIn = ramp(u, hs - 0.28, hs - 0.02);
    const fadeOut = 1 - ramp(u, he + 0.02, he + 0.3);
    out.push(Math.min(fadeIn, fadeOut));
  }
  out.push(ramp(u, UNITS - OUTRO + 0.05, UNITS - OUTRO + 0.3));
  return out;
}

/* ------------------------------------------------------------------ */

function DesktopFilm() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useIso(() => {
    const el = root.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const ctx = cv.getContext("2d", { alpha: false });
    if (!ctx) return;

    const count = manifest.count;
    const imgs: (HTMLImageElement | null)[] = new Array(count).fill(null);
    const src = (i: number) => `${manifest.path}${String(i + 1).padStart(4, "0")}.webp`;
    let alive = true;
    let progress = 0;
    let drawn = "";

    // coarse-to-fine: the reveal frames first, then every 16th, 8th … frame
    const order: number[] = [];
    const seen = new Set<number>();
    const push = (i: number) => {
      if (i < 0 || i >= count || seen.has(i)) return;
      seen.add(i);
      order.push(i);
    };
    BOUNDS.forEach(push);
    for (let step = 16; step >= 1; step /= 2) for (let i = 0; i < count; i += step) push(i);
    let cursor = 0;
    const loadNext = () => {
      if (!alive || cursor >= order.length) return;
      const i = order[cursor++]!;
      const im = new Image();
      im.decoding = "async";
      im.onload = () => {
        imgs[i] = im;
        drawn = "";
        draw();
        loadNext();
      };
      im.onerror = loadNext;
      im.src = src(i);
    };
    for (let k = 0; k < 6; k++) loadNext();

    const nearest = (i: number) => {
      for (let d = 0; d < count; d++) {
        if (imgs[i - d]) return imgs[i - d]!;
        if (imgs[i + d]) return imgs[i + d]!;
      }
      return null;
    };

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(cv.clientWidth * dpr);
      cv.height = Math.round(cv.clientHeight * dpr);
      drawn = "";
      draw();
    };

    const paint = (im: HTMLImageElement, alpha: number) => {
      const s = Math.max(cv.width / im.naturalWidth, cv.height / im.naturalHeight);
      const w = im.naturalWidth * s;
      const h = im.naturalHeight * s;
      ctx.globalAlpha = alpha;
      ctx.drawImage(im, (cv.width - w) / 2, (cv.height - h) / 2, w, h);
    };

    const overlays = Array.from(el.querySelectorAll<HTMLElement>("[data-wp-overlay]"));
    const rail = Array.from(el.querySelectorAll<HTMLElement>("[data-wp-rail]"));
    const bar = el.querySelector<HTMLElement>("[data-wp-bar]");

    function draw() {
      const u = progress * UNITS;
      const f = clamp(frameAt(filmAt(u)), 0, count - 1);
      const a = Math.floor(f);
      const t = f - a;
      const key = `${a}:${t.toFixed(3)}:${cv.width}`;
      if (key !== drawn) {
        const A = imgs[a] ?? nearest(a);
        const B = t > 0.01 ? imgs[a + 1] : null;
        if (A) {
          paint(A, 1);
          if (B) paint(B, t);
          ctx.globalAlpha = 1;
          drawn = key;
        }
      }
      const op = overlaysAt(u);
      overlays.forEach((o, i) => {
        const v = op[i] ?? 0;
        o.style.opacity = String(v);
        o.style.transform = `translate3d(0, ${(1 - v) * 18}px, 0)`;
        o.style.visibility = v < 0.01 ? "hidden" : "visible";
      });
      // which area the camera is at / heading to
      const cur = clamp(Math.ceil(filmAt(u) - 0.35) - 1, -1, CLIPS - 1);
      rail.forEach((r, i) => {
        r.toggleAttribute("data-active", i === cur);
        r.toggleAttribute("data-done", i < cur);
      });
      if (bar) bar.style.transform = `scaleX(${progress})`;
    }

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (s) => {
        progress = s.progress;
        draw();
      },
    });
    const ro = new ResizeObserver(size);
    ro.observe(cv);
    size();

    return () => {
      alive = false;
      st.kill();
      ro.disconnect();
    };
  }, []);

  return (
    <section
      ref={root}
      id="waterproofing"
      aria-label="Waterproofing — the protection you never see"
      className="relative z-10 bg-night text-paper"
      style={{ height: `${Math.round(UNITS * VH_PER_UNIT + 100)}vh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <canvas ref={canvas} aria-hidden className="absolute inset-0 h-full w-full" />
        {/* legibility */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-[62%] bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/55 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/60 to-transparent" />

        {/* intro */}
        <div data-wp-overlay className="gutter absolute inset-x-0 top-0 flex flex-col items-start pt-28 md:pt-32">
          <SectionMarker index="04" label={waterproofIntro.eyebrow} className="text-paper/75" />
          <h2 className="display mt-5 max-w-[14ch] text-4xl sm:text-5xl lg:text-[clamp(2.5rem,4.2vw,4.5rem)] leading-[1.12] tracking-[-0.02em] font-semibold">
            {waterproofIntro.headline}
          </h2>
          <p className="mt-6 max-w-md text-body leading-relaxed text-paper/75">{waterproofIntro.body}</p>
          <p className="wp-cue mt-8 flex items-center gap-2 text-body uppercase tracking-[0.16em] text-paper/60">
            <span className="h-px w-8 bg-paper/40" /> Scroll to reveal
          </p>
        </div>

        {/* one overlay per area */}
        {waterproofStops.map((s, i) => (
          <div key={s.key} data-wp-overlay className="gutter invisible absolute inset-x-0 top-0 flex h-full flex-col justify-between pb-24 pt-28 opacity-0 md:pt-32">
            <div>
              <p className="flex items-center gap-3 text-body font-medium text-paper/75">
                <span className="font-semibold tabular-nums text-white">0{i + 1} / 0{CLIPS}</span>
                <span className="h-px w-8 bg-current opacity-40" />
                <span>{s.area}</span>
              </p>
              <h3 className="display mt-4 max-w-[14ch] text-3xl sm:text-4xl lg:text-[clamp(2.2rem,3.4vw,3.8rem)] leading-[1.12] tracking-[-0.02em] font-semibold">
                {s.headline}
              </h3>
            </div>
            <div className="max-w-sm rounded-2xl border border-white/15 bg-black/45 p-5 backdrop-blur-md">
              <p className="flex items-center gap-2 text-body font-semibold uppercase tracking-[0.16em] text-[#8fb4ec]">
                <Droplets size={14} /> Waterproofing used
              </p>
              <p className="mt-2 text-xl font-medium leading-snug text-white">{s.system}</p>
              <ul className="mt-3 space-y-1.5 text-body leading-snug text-paper/75">
                {s.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#8fb4ec]" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {/* outro */}
        <div data-wp-overlay className="gutter invisible absolute inset-x-0 top-0 flex flex-col items-start pt-28 opacity-0 md:pt-32">
          <p className="eyebrow text-paper/70">Three systems · one dry building</p>
          <h3 className="display mt-4 max-w-[12ch] leading-[0.95]" style={{ fontSize: "clamp(2.8rem, 5.4vw, 6.4rem)" }}>
            {waterproofOutro.headline}
          </h3>
          <p className="mt-5 max-w-md text-body leading-relaxed text-paper/75">{waterproofOutro.body}</p>
          <Link
            href="/contact#enquiry"
            className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-paper px-6 text-body font-semibold text-ink transition-colors hover:bg-white"
          >
            Plan a watertight build <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* area rail + progress */}
        <div className="gutter absolute inset-x-0 bottom-6 flex items-end justify-between gap-6">
          <ol className="flex flex-wrap gap-1.5">
            {waterproofStops.map((s, i) => (
              <li
                key={s.key}
                data-wp-rail
                className="rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-body text-paper/50 backdrop-blur-md transition-colors duration-500 data-[active]:border-white/60 data-[active]:bg-white data-[active]:text-ink data-[done]:text-paper/85"
              >
                <span className="mr-1.5 font-mono text-body opacity-60">0{i + 1}</span>
                {s.area}
              </li>
            ))}
          </ol>
          <div aria-hidden className="mb-3 hidden h-px w-40 bg-white/20 lg:block">
            <div data-wp-bar className="h-full w-full origin-left scale-x-0 bg-white" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

/** Phones: no scroll effects — the film plays once when it comes into view. */
function MobileFilm() {
  const video = useRef<HTMLVideoElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [stop, setStop] = useState(-1);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    const v = video.current;
    const b = box.current;
    if (!v || !b) return;
    v.muted = true;
    v.setAttribute("muted", "");
    const onTime = () => {
      // an area's card appears as the camera arrives at its reveal
      const t = v.currentTime + 1.2;
      const i = manifest.stopSeconds.filter((s) => t >= s).length - 1;
      setStop(clamp(i, -1, CLIPS - 1));
    };
    const onEnd = () => setEnded(true);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnd);
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e) return;
        if (e.isIntersecting && !v.ended) v.play().catch(() => {});
        else if (!e.isIntersecting) v.pause();
      },
      { threshold: 0.55 },
    );
    io.observe(b);
    return () => {
      io.disconnect();
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnd);
    };
  }, []);

  const replay = () => {
    const v = video.current;
    if (!v) return;
    v.currentTime = 0;
    setEnded(false);
    setStop(-1);
    v.play().catch(() => {});
  };

  const s = stop >= 0 ? waterproofStops[stop]! : null;

  return (
    <section id="waterproofing" aria-label="Waterproofing — the protection you never see" className="relative z-10 bg-night px-4 pb-12 pt-14 text-paper">
      <SectionMarker index="04" label={waterproofIntro.eyebrow} className="text-paper/70" />
      <h2 className="display mt-4 text-[2.6rem] leading-[0.95]">{waterproofIntro.headline}</h2>
      <p className="mt-3 text-body leading-relaxed text-paper/70">Below ground, water never stops pushing. Here is what we put there to stop it.</p>

      <div ref={box} className="relative mt-6 overflow-hidden rounded-2xl border border-white/10 bg-ink" style={{ aspectRatio: "16 / 9" }}>
        <video
          ref={video}
          className="absolute inset-0 h-full w-full object-cover"
          src="/waterproof/waterproof-mobile.mp4"
          poster="/waterproof/poster.jpg"
          muted
          playsInline
          preload="metadata"
        />
        {ended && (
          <button
            type="button"
            onClick={replay}
            className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-body font-medium text-white backdrop-blur-md"
          >
            <RotateCcw size={13} /> Replay
          </button>
        )}
        {stop < 0 && !ended && (
          <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-body text-white/85 backdrop-blur-md">
            <Play size={11} /> Inside an RPC building
          </span>
        )}
      </div>

      {/* the live card follows the film */}
      <div className="mt-4 min-h-[9.5rem] rounded-2xl border border-white/12 bg-white/[0.04] p-4">
        {s ? (
          <div key={s.key} style={{ animation: "fadeIn .5s ease" }}>
            <p className="font-mono text-body uppercase tracking-[0.14em] text-paper/55">
              0{stop + 1} / 0{CLIPS} · {s.area}
            </p>
            <p className="display mt-1.5 text-[1.55rem] leading-tight">{s.headline}</p>
            <p className="mt-2 flex items-center gap-1.5 text-body font-medium text-[#8fb4ec]">
              <Droplets size={13} /> {s.system}
            </p>
            <p className="mt-1 text-body leading-snug text-paper/65">{s.points.join(" · ")}</p>
          </div>
        ) : (
          <p className="text-body leading-relaxed text-paper/65">
            The camera goes underground — into the sump, along the basement wall and out to the pool — peeling back the finish at each stop to show the waterproofing underneath.
          </p>
        )}
      </div>

      <ol className="mt-3 grid grid-cols-5 gap-1">
        {waterproofStops.map((x, i) => (
          <li key={x.key} className={`h-1 rounded-full transition-colors duration-500 ${i <= stop ? "bg-paper" : "bg-white/15"}`} />
        ))}
      </ol>
    </section>
  );
}

export function Waterproofing() {
  const [mobile, setMobile] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setMobile(mq.matches);
  }, []);
  if (mobile === null) return <section id="waterproofing" aria-hidden className="relative z-10 bg-night" style={{ height: "100svh" }} />;
  return mobile ? <MobileFilm /> : <DesktopFilm />;
}
