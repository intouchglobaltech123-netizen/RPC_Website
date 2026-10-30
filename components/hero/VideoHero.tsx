"use client";

import { ArrowUpRight, Droplets, Phone, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { brand, contact } from "@/lib/content";
import { ScrollTrigger } from "@/lib/gsap";
import { sceneState } from "@/lib/three/store";

const useIso = typeof window !== "undefined" ? useLayoutEffect : () => {};

/**
 * Hero: the RPC waterproofing film (Google Flow), exactly as made —
 * finished building → roof → bathroom → sump → basement → pool.
 *
 * Desktop: scroll-scrubbed 1080p frame sequence, pinned. The camera stops at
 * each of the five areas and the stage card (left) names the waterproofing;
 * after the pool, "RPC Constructions" comes in as the sixth beat.
 * Phones: the 720p film plays once in a 16:9 frame (no scroll effects).
 */
const STAGES = [
  { id: "01", label: "Roof terrace", system: "Liquid-applied PU membrane" },
  { id: "02", label: "Bathroom & wet areas", system: "Polymer-modified cementitious coating" },
  { id: "03", label: "Underground sump", system: "Crystalline waterproofing" },
  { id: "04", label: "Basement & retaining wall", system: "Bituminous torch-on membrane" },
  { id: "05", label: "Swimming pool", system: "Flexible cementitious coating" },
];

/* film: 5 clips × 8 s at 10 fps → 401 frames; each clip ends on its reveal */
const FRAMES = { count: 401, path: "/film/wphd/" };
const PER_CLIP = 80;
const CLIPS = STAGES.length;

/* scroll timeline in units (1 unit ≈ 70vh): intro → [travel, hold] × 5 → RPC */
const INTRO = 0.45;
const TRAVEL = 1;
const HOLD = 0.6;
const OUTRO = 1.1;
const UNITS = INTRO + CLIPS * (TRAVEL + HOLD) + OUTRO;
const VH_PER_UNIT = 70;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ramp = (u: number, a: number, b: number) => clamp((u - a) / (b - a));

function filmAt(u: number) {
  if (u <= INTRO) return 0;
  for (let i = 0; i < CLIPS; i++) {
    const s = INTRO + i * (TRAVEL + HOLD);
    if (u < s + TRAVEL) return i + (u - s) / TRAVEL;
    if (u < s + TRAVEL + HOLD) return i + 1;
  }
  return CLIPS;
}

/** opacity of [intro, stage 1 … stage 5, RPC] */
function beatsAt(u: number) {
  const out = [1 - ramp(u, INTRO - 0.05, INTRO + 0.35)];
  for (let i = 0; i < CLIPS; i++) {
    const hs = INTRO + i * (TRAVEL + HOLD) + TRAVEL;
    const he = hs + HOLD;
    const last = i === CLIPS - 1;
    out.push(Math.min(ramp(u, hs - 0.3, hs - 0.02), last ? 1 - ramp(u, he, he + 0.25) : 1 - ramp(u, he + 0.02, he + 0.3)));
  }
  out.push(ramp(u, UNITS - OUTRO + 0.1, UNITS - OUTRO + 0.45));
  return out;
}

function markReady() {
  if (!sceneState.ready) {
    sceneState.ready = true;
    window.dispatchEvent(new Event("rpc:ready"));
  }
  sceneState.heroNavVisible = true;
  window.dispatchEvent(new CustomEvent("rpc:hero-nav", { detail: { visible: true } }));
}

const Buttons = () => (
  <>
    <Link href="/about" className="inline-flex h-12 items-center justify-between gap-4 rounded-full bg-paper pl-5 pr-1.5 text-body font-medium uppercase tracking-[0.08em] text-ink">
      About Us
      <span className="grid h-9 w-9 place-items-center rounded-full bg-ink/10"><ArrowUpRight size={14} /></span>
    </Link>
    <Link href="/projects" className="inline-flex h-12 items-center justify-between gap-4 rounded-full border border-white/40 bg-black/40 pl-5 pr-1.5 text-body font-medium uppercase tracking-[0.08em] text-paper backdrop-blur-md hover:bg-black/60">
      Our projects
      <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10"><ArrowUpRight size={14} /></span>
    </Link>
  </>
);

const StageChip = ({ s, big = false }: { s: (typeof STAGES)[number]; big?: boolean }) => (
  <p className={`inline-flex max-w-full flex-wrap items-center gap-x-2.5 gap-y-1 border border-white/15 bg-black/45 py-1.5 pl-3 pr-4 uppercase text-paper backdrop-blur-md ${big ? "rounded-full text-body tracking-[0.16em]" : "rounded-2xl text-body tracking-[0.14em]"}`}>
    <span className="font-mono text-paper/60">{s.id}</span>
    <span>{s.label}</span>
    <span className="inline-flex items-center gap-1.5 normal-case tracking-normal text-[#8fb4ec]">
      <Droplets size={big ? 14 : 12} /> {s.system}
    </span>
  </p>
);

/* ------------------------------------------------------------------ */

function ScrollHero() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useIso(() => {
    const el = root.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const ctx = cv.getContext("2d", { alpha: false });
    if (!ctx) return;
    markReady();

    const { count, path } = FRAMES;
    const imgs: (HTMLImageElement | null)[] = new Array(count).fill(null);
    const src = (i: number) => `${path}${String(i + 1).padStart(4, "0")}.webp`;
    let alive = true;
    let progress = 0;
    let drawn = "";
    let loaded = 0;

    // coarse-to-fine: first frame + the five reveals, then every 16th, 8th … frame
    const order: number[] = [];
    const seen = new Set<number>();
    const push = (i: number) => {
      if (i < 0 || i >= count || seen.has(i)) return;
      seen.add(i);
      order.push(i);
    };
    for (let c = 0; c <= CLIPS; c++) push(c * PER_CLIP);
    for (let step = 16; step >= 1; step /= 2) for (let i = 0; i < count; i += step) push(i);
    let cursor = 0;
    const loadNext = () => {
      if (!alive || cursor >= order.length) return;
      const i = order[cursor++]!;
      const im = new Image();
      im.decoding = "async";
      im.onload = () => {
        imgs[i] = im;
        loaded++;
        sceneState.filmLoaded = Math.max(sceneState.filmLoaded, loaded / 40); // preloader: first ~12 frames
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
    const paint = (im: HTMLImageElement, alpha: number) => {
      const s = Math.max(cv.width / im.naturalWidth, cv.height / im.naturalHeight);
      const w = im.naturalWidth * s;
      const h = im.naturalHeight * s;
      ctx.globalAlpha = alpha;
      ctx.drawImage(im, (cv.width - w) / 2, (cv.height - h) / 2, w, h);
    };

    const beats = Array.from(el.querySelectorAll<HTMLElement>("[data-beat]"));
    const dots = Array.from(el.querySelectorAll<HTMLElement>("[data-dot]"));
    const cue = el.querySelector<HTMLElement>("[data-cue]");

    function draw() {
      const u = progress * UNITS;
      const f = clamp(filmAt(u) * PER_CLIP, 0, count - 1);
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
      const b = beatsAt(u);
      beats.forEach((node, i) => {
        const v = b[i] ?? 0;
        node.style.opacity = String(v);
        node.style.transform = `translate3d(0, ${(1 - v) * 16}px, 0)`;
        node.style.visibility = v < 0.01 ? "hidden" : "visible";
        node.style.pointerEvents = v > 0.5 ? "auto" : "none";
      });
      const cur = clamp(Math.ceil(filmAt(u) - 0.35) - 1, -1, CLIPS - 1);
      dots.forEach((d, i) => {
        d.toggleAttribute("data-active", i === cur);
        d.toggleAttribute("data-done", i < cur);
      });
      if (cue) cue.style.opacity = String(1 - ramp(u, 0.1, 0.4));
    }

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(cv.clientWidth * dpr);
      cv.height = Math.round(cv.clientHeight * dpr);
      drawn = "";
      draw();
    };

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
      aria-label="RPC Constructions — the protection you never see"
      className="relative bg-night text-paper"
      style={{ height: `${Math.round(UNITS * VH_PER_UNIT + 100)}vh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <canvas ref={canvas} aria-hidden className="absolute inset-0 h-full w-full" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-[58%] bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/50 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/65 to-transparent" />

        {/* intro — the finished building */}
        <div data-beat className="gutter absolute bottom-0 left-0 pb-14">
          <p className="eyebrow text-paper/75">{brand.descriptor}</p>
          <p className="display mt-3 max-w-[16ch] leading-[0.95] text-paper" style={{ fontSize: "clamp(2.4rem, 4.2vw, 4.8rem)" }}>
            Five places water gets in. <em className="text-paper/85">Scroll to see how we stop it.</em>
          </p>
        </div>

        {/* stages 1–5, left */}
        {STAGES.map((s) => (
          <div key={s.id} data-beat className="gutter invisible absolute bottom-0 left-0 pb-14 opacity-0">
            <p className="eyebrow mb-4 text-paper/70">Stage {s.id} / 05</p>
            <p className="display mb-5 leading-[0.95]" style={{ fontSize: "clamp(2.6rem, 4.6vw, 5.4rem)" }}>{s.label}</p>
            <StageChip s={s} big />
          </div>
        ))}

        {/* 6 — RPC Constructions */}
        <div data-beat className="gutter invisible absolute bottom-0 left-0 max-w-[46rem] pb-14 opacity-0">
          <p className="eyebrow text-paper/75">{brand.descriptor}</p>
          <h1 className="display mt-4 leading-[0.86]" style={{ fontSize: "clamp(3.6rem, 7vw, 8.5rem)" }}>
            RPC <em>Constructions</em>
          </h1>
          <p className="mt-5 max-w-md text-body leading-relaxed text-paper/80">
            We build to last — and we seal every building where water tries to get in, from the roof to the pool.
          </p>
          <div className="mt-7 flex flex-wrap gap-3"><Buttons /></div>
        </div>

        {/* progress dots, right */}
        <ol aria-hidden className="absolute right-[var(--gutter)] top-1/2 flex -translate-y-1/2 flex-col gap-3">
          {STAGES.map((s) => (
            <li key={s.id} data-dot className="h-2 w-2 rounded-full bg-white/25 transition-all duration-500 data-[active]:h-6 data-[active]:bg-white data-[done]:bg-white/70" />
          ))}
        </ol>

        <div data-cue className="pointer-events-none absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-paper opacity-90">
          <span aria-hidden className="relative block h-10 w-6 rounded-full border-2" style={{ borderColor: "rgba(255,255,255,0.85)" }}>
            <span className="absolute left-1/2 top-2 block h-2 w-1 -translate-x-1/2 rounded-full bg-current" style={{ animation: "wheel 1.8s cubic-bezier(0.65,0,0.35,1) infinite" }} />
          </span>
          <span className="eyebrow !text-body drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">Scroll</span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const CHAPTER_AT = [6.2, 14.2, 22.2, 30.2, 38.2];

/* phone copy for each beat: intro, the five areas, then RPC Constructions */
const PHONE_BEATS = [
  { tag: "00", chip: "The building", eyebrow: "Construction · Waterproofing", title: "The protection you never see.", system: "Five areas · five systems", layers: "Roof → bathroom → sump → basement → pool" },
  { tag: "01", chip: "Roof terrace", eyebrow: "Terrace & flat roof", title: "Every roof, sealed for good.", system: "Liquid-applied PU membrane", layers: "Primer → PU membrane → screed → tiles" },
  { tag: "02", chip: "Bathroom", eyebrow: "Bathroom & wet areas", title: "Dry below every tile.", system: "Polymer cementitious coating", layers: "Mesh tape → 2 coats → screed → tiles" },
  { tag: "03", chip: "Sump", eyebrow: "Underground water tank", title: "Groundwater kept out.", system: "Crystalline + PVC water-bars", layers: "Water-bars → crystalline concrete → slurry coat" },
  { tag: "04", chip: "Basement", eyebrow: "Basement & retaining wall", title: "We hold back the ground.", system: "Bituminous torch-on membrane", layers: "Membrane → protection board → drainage mat" },
  { tag: "05", chip: "Swimming pool", eyebrow: "Pool shell", title: "Every litre where it belongs.", system: "Flexible cementitious coating", layers: "Water-bars → flexible coat → mosaic tiles" },
  { tag: "06", chip: "RPC Constructions", eyebrow: "Design & build · Erode", title: "RPC Constructions", system: "Built to last. Sealed to stay dry.", layers: "Residential · Commercial · Industrial" },
];

function PhoneHero() {
  const video = useRef<HTMLVideoElement>(null);
  const [beat, setBeat] = useState(0);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    sceneState.filmLoaded = 1;
    markReady();
    const v = video.current;
    if (!v) return;
    // React doesn't always reflect `muted` as an attribute, which blocks autoplay
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    const tryPlay = () => { if (v.paused && !v.ended) v.play().catch(() => {}); };
    tryPlay();
    v.addEventListener("canplay", tryPlay);
    window.addEventListener("touchstart", tryPlay, { once: true, passive: true });
    const retry = window.setInterval(() => { if (v.currentTime > 0.5) window.clearInterval(retry); else tryPlay(); }, 1500);
    const onTime = () => setBeat(CHAPTER_AT.filter((t) => v.currentTime >= t).length);
    const onEnd = () => {
      setEnded(true);
      setBeat(PHONE_BEATS.length - 1);
    };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnd);
    return () => {
      window.clearInterval(retry);
      v.removeEventListener("canplay", tryPlay);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnd);
    };
  }, []);

  const replay = () => {
    const v = video.current;
    if (!v) return;
    v.currentTime = 0;
    setEnded(false);
    setBeat(0);
    v.play().catch(() => {});
  };
  const b = PHONE_BEATS[beat]!;
  const last = beat === PHONE_BEATS.length - 1;
  const tel = `tel:${contact.phone.replace(/[^0-9+]/g, "")}`;

  return (
    <section aria-label="RPC Constructions — the protection you never see" className="relative bg-night text-paper">
      {/* film — full width, under the transparent nav */}
      <div className="relative w-full overflow-hidden" style={{ height: "58svh", minHeight: 360 }}>
        <video ref={video} className="absolute inset-0 h-full w-full object-cover" src="/film/hero-wp-720.mp4" poster="/film/hero-wp-poster.jpg" autoPlay muted playsInline preload="auto" aria-hidden />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40" style={{ background: "linear-gradient(to top, var(--color-night), transparent)" }} />
        <p key={b.tag} className="absolute bottom-4 left-4 inline-flex items-center gap-2.5 rounded-full bg-black/60 px-3.5 py-2 text-body font-medium uppercase tracking-[0.12em] backdrop-blur-md" style={{ animation: "fadeIn .5s ease" }}>
          <span className="font-mono text-paper/55">{b.tag}</span>
          {b.chip}
        </p>
        {ended && (
          <button type="button" onClick={replay} className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3.5 py-2 text-body font-medium text-white backdrop-blur-md">
            <RotateCcw size={13} /> Replay
          </button>
        )}
      </div>

      {/* copy — follows the film */}
      <div className="gutter pb-10 pt-2">
        <div key={b.tag} style={{ animation: "fadeIn .5s ease", minHeight: "11.5rem" }}>
          <p className="font-mono text-body uppercase tracking-[0.18em] text-paper/55">{b.eyebrow}</p>
          {last ? (
            <h1 className="display mt-3 leading-[0.92]" style={{ fontSize: "clamp(2.5rem, 11.5vw, 3.6rem)" }}>
              RPC <em className="text-paper/90">Constructions</em>
            </h1>
          ) : (
            <p className="display mt-3 leading-[0.95] text-paper/90" style={{ fontSize: "clamp(2.2rem, 10vw, 3.2rem)" }}>{b.title}</p>
          )}
          <p className="mt-4 text-body font-medium uppercase tracking-[0.1em]" style={{ color: "#7fa6dd" }}>{b.system}</p>
          <p className="mt-1.5 text-body leading-snug text-paper/60">{b.layers}</p>
        </div>
        {/* hidden heading for search engines / screen readers while a stage is showing */}
        {!last && <h1 className="sr-only">RPC Constructions — building and waterproofing contractors, Erode</h1>}

        <div className="mt-6 grid grid-cols-2 gap-2.5">
          <Link href="/contact#enquiry" className="inline-flex h-14 items-center justify-between rounded-full bg-paper pl-5 pr-1.5 text-body font-medium uppercase tracking-[0.06em] text-ink">
            Free inspection
            <span className="grid h-11 w-11 place-items-center rounded-full bg-ink/10"><ArrowUpRight size={16} /></span>
          </Link>
          <a href={tel} className="inline-flex h-14 items-center justify-between rounded-full border border-white/25 bg-white/[0.04] pl-5 pr-1.5 text-body font-medium uppercase tracking-[0.06em] text-paper">
            Call us
            <span className="grid h-11 w-11 place-items-center rounded-full bg-white/10"><Phone size={16} /></span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function VideoHero() {
  const [small, setSmall] = useState<boolean | null>(null);
  useEffect(() => setSmall(window.matchMedia("(max-width: 767px)").matches), []);
  if (small === null) return <section aria-label="RPC Constructions" className="relative bg-night" style={{ height: "100svh" }} />;
  return small ? <PhoneHero /> : <ScrollHero />;
}
