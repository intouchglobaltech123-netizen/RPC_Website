"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQualityContext } from "@/components/providers/QualityProvider";
import { ArrowLink } from "@/components/ui/Primitives";
import { brand, heroStages } from "@/lib/content";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Dust } from "./Dust";
import { FilmCanvas } from "./FilmCanvas";
import { VideoHero } from "./VideoHero";
import { sceneState } from "@/lib/three/store";
import { range, window4 } from "@/lib/utils/math";

/**
 * Hero scroll progress → time in the construction film. The film is an
 * 18.7 s cut paced like the original 3D hero, played linearly by scroll:
 *   0–2 s empty plot · 2–4 s site layout · 5–6 s foundation ·
 *   7–9 s frame going up · 10–12 s walls & glass facade ·
 *   13–15 s finished building · 16–18.7 s dusk handover
 */
const FILM_SECONDS = 18.7;
/**
 * The scroll stops the film at 14.5 s — the finished building by the pool —
 * before a third-party logo in the source dusk shot fades in (from ~14.7 s).
 * Replace the ending footage and set this back to FILM_SECONDS to restore it.
 */
const FILM_END = 14.5;
const FILM_KEYS: [number, number][] = [[0, 0], [1, FILM_END]];
const filmAt = (p: number) => {
  for (let i = 1; i < FILM_KEYS.length; i++) {
    const [p1, t1] = FILM_KEYS[i]!;
    const [p0, t0] = FILM_KEYS[i - 1]!;
    if (p <= p1) return (t0 + ((p - p0) / (p1 - p0)) * (t1 - t0)) / FILM_SECONDS;
  }
  return 1;
};

/** Seconds of film in which each chapter caption is readable. */
const STAGE_SECONDS: [number, number][] = [
  [0, 2], // site (intro title covers this one)
  [2, 4], // blueprint / layout
  [5, 6.4], // foundation
  [7, 9], // structure
  [10, 11.8], // envelope
  [12.1, 13.3], // completion
  [13.5, 14.7], // handover
];
const WINDOWS: [number, number][] = STAGE_SECONDS.map(([a, b]) => [a / FILM_END, b / FILM_END]);
/** Where the closing "handover" reveal and the nav bar come in. */
const HANDOVER = 13.5 / FILM_END;

/** The hero now plays the waterproofing film (see VideoHero). */
export function Hero() {
  return <VideoHero />;
}

/** Previous hero: the scroll-scrubbed construction film. Kept for easy switch-back. */
export function ConstructionHero() {
  const quality = useQualityContext();
  // phones get a plain autoplaying film instead of the scroll-scrubbed sequence
  const [mobile, setMobile] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  if (mobile === null) return <section aria-label="RPC Constructions" className="relative bg-night" style={{ height: "100svh" }} />;
  if (mobile) return <MobileHero />;
  if (quality === "static") return <StaticHero />;
  return <FilmHero ready={quality !== null} low={quality === "low"} />;
}

/**
 * Mobile hero: the same construction film as a short video (cropped for a
 * phone) that plays once and rests on the full view of the finished building.
 * No scroll effects. A small chip names the stage on screen.
 */
function MobileHero() {
  const video = useRef<HTMLVideoElement>(null);
  const [stageIdx, setStageIdx] = useState(0);

  useEffect(() => {
    // nothing to decode frame-by-frame here — let the loader and nav go
    sceneState.filmLoaded = 1;
    if (!sceneState.ready) {
      sceneState.ready = true;
      window.dispatchEvent(new Event("rpc:ready"));
    }
    sceneState.heroNavVisible = true;
    window.dispatchEvent(new CustomEvent("rpc:hero-nav", { detail: { visible: true } }));
    const v = video.current;
    if (!v) return;
    // React doesn't always reflect `muted` as an attribute, which blocks autoplay on phones
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    const tryPlay = () => { if (v.paused && !v.ended) v.play().catch(() => {}); };
    tryPlay();
    v.addEventListener("canplay", tryPlay);
    window.addEventListener("touchstart", tryPlay, { once: true, passive: true });
    const retry = window.setInterval(tryPlay, 1500);
    const onTime = () => {
      const t = v.currentTime;
      let idx = 0;
      STAGE_SECONDS.forEach(([a], i) => { if (t >= a) idx = i; });
      setStageIdx(Math.min(idx, 5));
    };
    v.addEventListener("timeupdate", onTime);
    return () => {
      window.clearInterval(retry);
      v.removeEventListener("canplay", tryPlay);
      v.removeEventListener("timeupdate", onTime);
    };
  }, []);

  const st = heroStages[stageIdx]!;
  return (
    <section aria-label="RPC Constructions — a building, from site to handover" className="relative bg-night text-paper">
      <div className="relative overflow-hidden" style={{ height: "64svh", minHeight: 420 }}>
        <video
          ref={video}
          className="absolute inset-0 h-full w-full object-cover"
          src="/film/hero-mobile.mp4"
          poster="/film/hero-mobile-poster.jpg"
          autoPlay
          muted
          playsInline
          preload="auto"
          aria-hidden
        />
        <div aria-hidden className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 to-transparent" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-40" style={{ background: "linear-gradient(to top, var(--color-night), transparent)" }} />
        <p className="absolute bottom-5 left-4 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-body uppercase tracking-[0.16em] backdrop-blur-md">
          <span className="font-mono text-paper/60">{st.id}</span>
          <span>{st.title}</span>
        </p>
      </div>
      <div className="gutter pb-12 pt-4">
        <p className="eyebrow text-paper/70">{brand.descriptor}</p>
        <h1 className="display mt-3 leading-[0.9]" style={{ fontSize: "15vw" }}>
          RPC <em className="text-paper/90">Constructions</em>
        </h1>
        <p className="mt-4 text-body leading-relaxed text-paper/80">
          We unite architectural ambition with structural engineering mastery — crafting enduring spaces designed to stand for generations.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-2.5">
          <Link href="/about" className="inline-flex h-12 items-center justify-between rounded-full bg-paper pl-5 pr-1.5 text-body font-medium uppercase tracking-[0.08em] text-ink">
            About Us
            <span className="grid h-9 w-9 place-items-center rounded-full bg-ink/10"><ArrowUpRight size={14} /></span>
          </Link>
          <Link href="/projects" className="inline-flex h-12 items-center justify-between rounded-full border border-white/40 bg-white/5 pl-5 pr-1.5 text-body font-medium uppercase tracking-[0.08em] text-paper">
            Projects
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10"><ArrowUpRight size={14} /></span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function FilmHero({ ready, low }: { ready: boolean; low: boolean }) {
  const section = useRef<HTMLElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const reveal = useRef<HTMLDivElement>(null);
  const captions = useRef<(HTMLDivElement | null)[]>([]);
  const cue = useRef<HTMLDivElement>(null);
  const hud = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const film = useRef<HTMLDivElement>(null);
  const fore = useRef<HTMLDivElement>(null);
  const getProgress = useCallback(() => filmAt(sceneState.display.hero), []);
  // the film fills the screen; only at the very end does the camera ease back
  // so the whole finished building is in view
  const getPullback = useCallback(() => {
    const t = range(sceneState.display.hero, HANDOVER - 0.06, HANDOVER + 0.03);
    return t * t * (3 - 2 * t);
  }, []);
  const onReady = useCallback(() => {
    if (sceneState.ready) return;
    sceneState.ready = true;
    window.dispatchEvent(new Event("rpc:ready"));
  }, []);

  useEffect(() => {
    if (!ready || !section.current) return;
    const el = section.current;
    const drive = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (s) => (sceneState.target.hero = s.progress),
    });
    // the WebGL canvas is not needed while the hero film is on screen
    window.dispatchEvent(new Event("rpc:scene-visibility"));

    // the film and the type sit on different planes: the footage drifts with
    // the pointer, the foreground copy drifts the other way, so the frame
    // has depth even when the scroll is still
    const fine = window.matchMedia("(pointer: fine)").matches && !low;

    let lastNavVisible = false;
    const tick = () => {
      const p = sceneState.display.hero;
      const filmSec = filmAt(p) * FILM_SECONDS;
      sceneState.heroFilmSeconds = filmSec;

      if (fine) {
        const { x, y } = sceneState.pointerDamped;
        if (film.current) film.current.style.transform = `translate3d(${-x * 10}px, ${-y * 6}px, 0) scale(1.02)`;
        if (fore.current) fore.current.style.transform = `translate3d(${x * 9}px, ${y * 6}px, 0)`;
      }

      // Nav bar appears with the handover reveal
      const navVisible = p >= HANDOVER;
      if (navVisible !== lastNavVisible) {
        lastNavVisible = navVisible;
        sceneState.heroNavVisible = navVisible;
        window.dispatchEvent(new CustomEvent("rpc:hero-nav", { detail: { visible: navVisible, progress: p } }));
      }

      // intro title drifts upward faster than the camera — a foreground layer
      if (intro.current) {
        const o = 1 - range(p, 0.025, 0.075);
        intro.current.style.opacity = String(o);
        intro.current.style.transform = `translate3d(0, ${-p * 900}px, 0)`;
        intro.current.style.visibility = o <= 0 ? "hidden" : "visible";
      }
      if (cue.current) cue.current.style.opacity = String(1 - range(p, 0, 0.02));
      WINDOWS.forEach(([a, b], i) => {
        const c = captions.current[i];
        const o = i === 0 ? 0 : window4(p, a - 0.02, a + 0.012, b - 0.012, b + 0.02);
        if (c) {
          c.style.opacity = String(o);
          c.style.transform = `translate3d(0, ${(1 - o) * (p < a ? 28 : -28)}px, 0)`;
          c.style.visibility = o <= 0.001 ? "hidden" : "visible";
        }
      });
      if (reveal.current) {
        const r = range(p, HANDOVER, HANDOVER + 0.06);
        reveal.current.style.opacity = String(r);
        reveal.current.style.pointerEvents = r > 0.6 ? "auto" : "none";
        reveal.current.style.transform = `translate3d(0, ${(1 - r) * 40}px, 0)`;
      }
      if (hud.current) hud.current.style.opacity = String(1 - range(p, HANDOVER - 0.02, HANDOVER + 0.03));
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      drive.kill();
      sceneState.heroNavVisible = true;
      window.dispatchEvent(new CustomEvent("rpc:hero-nav", { detail: { visible: true, seconds: 10 } }));
    };
  }, [ready, low]);

  return (
    <section ref={section} aria-label="RPC Constructions — a building, from site to handover" className="relative h-[620vh] md:h-[760vh]">
      <div ref={stage} data-tone="dark" className="sticky top-0 h-[100svh] overflow-hidden bg-night text-paper">
        {/* the construction film, scrubbed by scroll — slightly oversized so it can drift with the pointer */}
        <div ref={film} aria-hidden className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.02)" }}>
          <FilmCanvas getProgress={getProgress} onReady={onReady} getPullback={getPullback} />
        </div>
        {/* site dust drifting through the light */}
        <Dust count={low ? 28 : 70} active={ready} />
        {/* lens + type legibility over the film */}
        <div aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_22vmin_rgba(0,0,0,0.4)]" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/40 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

        {/* ── Stage 01: minimal opening ───────────────────────── */}
        <div ref={fore} className="absolute inset-0 will-change-transform">
          <div ref={intro} className="hero-intro gutter absolute inset-x-0 bottom-[14svh] flex flex-col items-end text-right will-change-transform">
            <p className="eyebrow mb-6 opacity-70">{brand.descriptor}</p>
            <h1 className="display leading-[0.82]" style={{ fontSize: "clamp(4rem, 8.5vw, 10.5rem)" }}>
              <span className="block pr-[6vw]">{brand.taglineA}</span>
              <span className="block"><em>{brand.taglineB}</em></span>
            </h1>
          </div>
        </div>

        <div ref={cue} className="hero-cue pointer-events-none absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-paper opacity-90">
          {/* mouse with a scrolling wheel — "scroll down" at a glance */}
          <span aria-hidden className="relative block h-10 w-6 rounded-full border-2" style={{ borderColor: "rgba(255,255,255,0.85)" }}>
            <span
              className="absolute left-1/2 top-2 block h-2 w-1 -translate-x-1/2 rounded-full bg-current"
              style={{ animation: "wheel 1.8s cubic-bezier(0.65,0,0.35,1) infinite" }}
            />
          </span>
          <span className="eyebrow !text-body drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">Scroll to build</span>
        </div>

        {/* ── Chapter captions ───────────────────────────────── */}
        <div ref={hud}>
          {heroStages.slice(0, 6).map((s, i) => (
            <div
              key={s.id}
              ref={(el) => { captions.current[i] = el; }}
              className="hero-caption gutter absolute bottom-10 right-0 flex max-w-[36rem] flex-col items-end text-right will-change-transform md:bottom-14"
              style={{ opacity: 0, visibility: "hidden" }}
            >
              <p className="flex items-center gap-3 text-body font-medium text-paper/80 mb-4">
                <span className="font-semibold tabular-nums text-rpc">Stage {s.id}</span>
                <span className="h-px w-8 bg-current opacity-35" />
                <span>{s.key}</span>
              </p>
              <h2 className="display text-4xl sm:text-5xl md:text-6xl lg:text-[clamp(2.6rem,4vw,4.5rem)] leading-[1.12] tracking-[-0.02em] font-semibold">{s.title}</h2>
              <p className="mt-4 max-w-sm text-body leading-relaxed opacity-80">{s.line}</p>
            </div>
          ))}
        </div>

        {/* ── Hero reveal: the handover ───────────────────────── */}
        <div ref={reveal} className="hero-reveal gutter absolute inset-0 flex items-start justify-start pb-8 pt-28 text-paper md:pt-32" style={{ opacity: 0, pointerEvents: "none" }}>
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-3/5 bg-gradient-to-b from-black/55 to-transparent" />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-3/5 bg-gradient-to-r from-black/50 via-black/15 to-transparent" />

          {/* the handover — top-left, clear of the building */}
          <div className="relative z-10 flex max-w-[44rem] flex-col items-start text-left">
            <p className="eyebrow mb-5 text-paper/75">{brand.descriptor}</p>
            <h2 className="display leading-[0.85] drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)]" style={{ fontSize: "clamp(3.4rem, 6.5vw, 8rem)" }}>
              <span className="block">RPC</span>
              <em className="block pl-[0.06em]">Constructions</em>
            </h2>
            <p className="mt-6 max-w-sm text-body leading-relaxed text-paper/80 md:text-base">
              We unite architectural ambition with structural engineering mastery — crafting enduring spaces designed to stand for generations.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <ArrowLink href="/about" variant="light">About Us</ArrowLink>
              <ArrowLink href="/projects" variant="ghost" className="border-white/40 bg-black/40 text-paper backdrop-blur-md hover:bg-black/60">Our projects</ArrowLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Reduced motion / no-WebGL: one composed still with the whole story in text. */
function StaticHero() {
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("rpc:hero-nav", { detail: { visible: true } }));
  }, []);
  return (
    <section aria-label="RPC Constructions" className="relative min-h-[100svh] overflow-hidden bg-night text-paper">
      <Image src="/images/hero-film-final.jpg" alt="Completed building" fill priority sizes="100vw" className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="gutter relative flex min-h-[100svh] flex-col justify-end pb-12 pt-32">
        <p className="eyebrow mb-5 opacity-80">{brand.descriptor}</p>
        <h1 className="display text-[18vw] leading-[0.82] md:text-[10vw]">
          {brand.taglineA} <em>{brand.taglineB}</em>
        </h1>
        <div className="mt-8">
          <ArrowLink href="/about" variant="light">About Us</ArrowLink>
        </div>
      </div>
    </section>
  );
}
