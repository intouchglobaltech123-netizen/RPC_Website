"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLink } from "@/components/ui/Primitives";
import { brand } from "@/lib/content";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { sceneState } from "@/lib/three/store";
import { clamp, range, window4 } from "@/lib/utils/math";
import { FilmCanvas } from "./FilmCanvas";

/**
 * "Through the letters" home section.
 *
 * The page opens on a drawing sheet: a faint grid, dimension lines and three
 * heavy letters — R P C — cut out of the paper, with real construction footage
 * playing inside them. The letters are traced first in ink, then opened.
 * The pointer tilts the sheet against the footage for depth. Scrolling splits
 * R and C away and dives the camera through the stem of the P: the paper
 * falls away, the footage takes the full screen and keeps building with the
 * scroll — footings, frame, envelope — with a stage rail and build meter,
 * until the finished building, where the statement rises line by line.
 */

// film position (0..1) against hero scroll progress (0..1)
const filmAt = (p: number) => {
  if (p < 0.34) return (p / 0.34) * 0.12; // footings, seen through the letters
  return Math.min(1, 0.12 + ((p - 0.34) / 0.56) * 0.88); // then the build plays out full-screen
};

const CHAPTERS = [
  { at: [0.36, 0.5], id: "03", title: "Foundation", line: "Footings, starter bars and the first pour." },
  { at: [0.52, 0.66], id: "04", title: "Structure", line: "The frame rises — column, beam, slab." },
  { at: [0.68, 0.8], id: "05", title: "Envelope", line: "Walls close in, glass is set." },
] as const;

// stage rail (right edge) — which stage is live for a given hero progress
const RAIL = [
  { id: "01", title: "Site", from: 0 },
  { id: "03", title: "Foundation", from: 0.34 },
  { id: "04", title: "Structure", from: 0.51 },
  { id: "05", title: "Envelope", from: 0.67 },
  { id: "06", title: "Complete", from: 0.82 },
] as const;

// heavy letters: [glyph, x] in the 1600×900 sheet
const GLYPHS = [
  ["R", 338],
  ["P", 800],
  ["C", 1262],
] as const;
// portrait screens stack the letters: [x, baseline] per glyph + the sheet's viewBox
const TALL = { at: [[800, 560], [800, 1120], [800, 1680]], viewBox: "-59 -610 1718 3718" } as const;
const WIDE_VIEW = "0 0 1600 900";
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const BASE = 735;
const SIZE = 700;

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='.55'/></svg>\")";

export function MaskHero() {
  const root = useRef<HTMLElement>(null);
  const cut = useRef<SVGGElement>(null);
  const ink = useRef<SVGGElement>(null);
  const pRef = useRef<SVGTextElement>(null);
  const paper = useRef<SVGGElement>(null);
  const caps = useRef<(HTMLDivElement | null)[]>([]);
  const rail = useRef<(HTMLLIElement | null)[]>([]);
  const pctRef = useRef<HTMLSpanElement>(null);
  const meter = useRef<HTMLSpanElement>(null);

  const getProgress = useCallback(() => filmAt(sceneState.display.hero), []);
  const onReady = useCallback(() => {
    sceneState.ready = true;
  }, []);

  // null until measured on the client, then "wide" or "tall"
  const [layout, setLayout] = useState<null | "wide" | "tall">(null);
  useIso(() => {
    const mq = window.matchMedia("(max-aspect-ratio: 4/5)");
    const set = () => setLayout(mq.matches ? "tall" : "wide");
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  const tall = layout === "tall";
  const pos = (i: number): readonly [number, number] => (tall ? TALL.at[i]! : [GLYPHS[i]![1], BASE]);

  useEffect(() => {
    const el = root.current;
    if (!el || !layout) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;

    const drive = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (st) => (sceneState.target.hero = st.progress),
    });

    let offMove = () => {};
    const ctx = gsap.context(() => {
      // ── opening: the sheet draws itself, then the letters are traced and opened
      const intro = gsap.timeline({ delay: 1.3, defaults: { ease: "expo.out" } });
      intro
        .fromTo("[data-grid-line]", { scaleX: 0, scaleY: 0 }, { scaleX: 1, scaleY: 1, duration: 1.6, stagger: 0.04, ease: "power3.inOut", transformOrigin: "50% 50%" }, 0)
        .fromTo("[data-ink-wipe]", { attr: { width: 0 } }, { attr: { width: 1700 }, duration: 1.9, ease: "power2.inOut" }, 0.2)
        .fromTo("[data-letter]", { yPercent: 36, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.5, stagger: 0.12 }, 0.9)
        .fromTo("[data-annot]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, stagger: 0.08 }, 1.2)
        .fromTo("[data-hero-ui]", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.1 }, 1.3);
      if (reduced) {
        intro.progress(1);
        return;
      }

      // ── pointer: sheet and footage move against each other
      if (fine) {
        const sx = gsap.quickTo("[data-sheet]", "x", { duration: 1.1, ease: "power3.out" });
        const sy = gsap.quickTo("[data-sheet]", "y", { duration: 1.1, ease: "power3.out" });
        const fx = gsap.quickTo("[data-film-drift]", "x", { duration: 1.4, ease: "power3.out" });
        const fy = gsap.quickTo("[data-film-drift]", "y", { duration: 1.4, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const k = 1 - clamp(sceneState.display.hero / 0.25); // calm once inside
          const nx = (e.clientX / window.innerWidth - 0.5) * k;
          const ny = (e.clientY / window.innerHeight - 0.5) * k;
          sx(nx * -22);
          sy(ny * -14);
          fx(nx * 26);
          fy(ny * 18);
        };
        window.addEventListener("pointermove", move, { passive: true });
        offMove = () => window.removeEventListener("pointermove", move);
      }

      // dive point: inside the stem of the P
      const b = pRef.current!.getBBox();
      const ox = b.x + b.width * 0.18;
      const oy = b.y + b.height * 0.66;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.9 },
      });
      tl.to([cut.current, ink.current], { scale: 46, svgOrigin: `${ox} ${oy}`, duration: 0.3, ease: "power3.in" }, 0.02)
        // R and C part like doors as the camera enters the P
        .to("[data-side='R']", { ...(tall ? { y: -560 } : { x: -340 }), rotation: -4, svgOrigin: pos(0).join(" "), duration: 0.22, ease: "power2.in" }, 0.03)
        .to("[data-side='C']", { ...(tall ? { y: 560 } : { x: 340 }), rotation: 4, svgOrigin: pos(2).join(" "), duration: 0.22, ease: "power2.in" }, 0.03)
        .to(ink.current, { opacity: 0, duration: 0.08 }, 0.12)
        .to("[data-annot], [data-grid]", { autoAlpha: 0, duration: 0.07 }, 0.03)
        .to(paper.current, { opacity: 0, duration: 0.06 }, 0.27)
        .to("[data-hero-ui]", { autoAlpha: 0, y: -20, duration: 0.06 }, 0.02)
        .to("[data-hero-shade-top]", { opacity: 1, duration: 0.05 }, 0.3)
        .fromTo("[data-film]", { scale: 1.22 }, { scale: 1, duration: 0.34, ease: "power2.out" }, 0)
        // slow push-in through the build, released for the reveal
        .to("[data-film]", { scale: 1.07, duration: 0.46, ease: "sine.inOut" }, 0.36)
        .to("[data-film]", { scale: 1, duration: 0.1, ease: "power2.out" }, 0.82)
        .fromTo("[data-hero-end-shade]", { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.84)
        .fromTo("[data-hero-end]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0.855)
        .fromTo("[data-end-line]", { yPercent: 110 }, { yPercent: 0, duration: 0.05, stagger: 0.015, ease: "power3.out" }, 0.86)
        .fromTo("[data-end-fade]", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.04, stagger: 0.012, ease: "power2.out" }, 0.9)
        .to("[data-hero-rail]", { autoAlpha: 0, duration: 0.04 }, 0.86)
        .to({}, { duration: 0.06 }, 0.94);
    }, el);

    // chapter captions, rail and build meter follow the damped scroll
    const tick = () => {
      const p = sceneState.display.hero;
      caps.current.forEach((c, i) => {
        if (!c) return;
        const [a, b] = CHAPTERS[i]!.at;
        const o = window4(p, a, a + 0.035, b - 0.03, b);
        const entering = p < a + 0.035;
        c.style.opacity = String(o);
        c.style.visibility = o <= 0.001 ? "hidden" : "visible";
        const title = c.querySelector<HTMLElement>("[data-cap-title]");
        const rest = c.querySelectorAll<HTMLElement>("[data-cap-fade]");
        if (title) title.style.transform = `translate3d(0, ${(1 - o) * (entering ? 105 : -105)}%, 0)`;
        rest.forEach((r) => (r.style.transform = `translate3d(0, ${(1 - o) * (entering ? 20 : -20)}px, 0)`));
      });
      let live = 0;
      RAIL.forEach((s, i) => p >= s.from && (live = i));
      rail.current.forEach((li, i) => li && (li.dataset.live = i === live ? "1" : i < live ? "done" : "0"));
      const build = clamp(range(p, 0.3, 0.86));
      if (pctRef.current) pctRef.current.textContent = String(Math.round(build * 100)).padStart(3, "0");
      if (meter.current) meter.current.style.transform = `scaleY(${build})`;
    };
    gsap.ticker.add(tick);
    ScrollTrigger.refresh();
    return () => {
      gsap.ticker.remove(tick);
      offMove();
      drive.kill();
      ctx.revert();
    };
  }, [layout]);

  const letterProps = { fontSize: SIZE, fontWeight: 900, letterSpacing: -10, textAnchor: "middle" as const, style: { fontFamily: "var(--font-sans)" } };

  return (
    <section ref={root} aria-label="RPC Constructions" className="relative h-[540vh] bg-paper">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* the footage */}
        <div data-film className="absolute inset-0 will-change-transform">
          <div data-film-drift className="absolute -inset-8">
            <FilmCanvas getProgress={getProgress} onReady={onReady} />
          </div>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.09] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
        <div data-hero-shade-top aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" style={{ opacity: 0 }} />
        <div data-hero-shade-top aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_22vmin_rgba(0,0,0,0.55)]" style={{ opacity: 0 }} />

        {/* the drawing sheet, with the letters cut out of it */}
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" viewBox={tall ? TALL.viewBox : WIDE_VIEW} preserveAspectRatio="xMidYMid slice">
          <defs>
            {/* hairline around each glyph: dilate the letters, keep only the rim */}
            <filter id="rpc-rim" x="-5%" y="-5%" width="110%" height="110%">
              <feMorphology in="SourceAlpha" operator="dilate" radius="1.6" result="fat" />
              <feComposite in="fat" in2="SourceAlpha" operator="out" result="rim" />
              <feFlood floodColor="#111316" />
              <feComposite in2="rim" operator="in" />
            </filter>
            <clipPath id="rpc-ink-clip" clipPathUnits="userSpaceOnUse">
              <rect data-ink-wipe x="-50" y="-400" width="0" height="2800" />
            </clipPath>
            <mask id="rpc-cut" maskUnits="userSpaceOnUse" x="-30000" y="-30000" width="60000" height="60000">
              <rect x="-30000" y="-30000" width="60000" height="60000" fill="#fff" />
              <g data-sheet>
                <g ref={cut} fill="#000" {...letterProps}>
                  {GLYPHS.map(([g], i) => (
                    <g key={g} data-side={g}>
                      <text data-letter ref={g === "P" ? pRef : undefined} x={pos(i)[0]} y={pos(i)[1]}>{g}</text>
                    </g>
                  ))}
                </g>
              </g>
            </mask>
          </defs>

          <g ref={paper}>
            <rect x="-30000" y="-30000" width="60000" height="60000" fill="var(--color-paper)" mask="url(#rpc-cut)" />
            {/* faint drafting grid + dimension annotations */}
            <g data-grid mask="url(#rpc-cut)" stroke="var(--color-ink)" strokeOpacity="0.08" strokeWidth="1">
              {[-200, 0, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800].map((x) => (
                <line key={`v${x}`} data-grid-line x1={x} y1={-400} x2={x} y2={1300} />
              ))}
              {[-100, 100, 225, BASE, 850].map((y) => (
                <line key={`h${y}`} data-grid-line x1={-400} y1={y} x2={2000} y2={y} />
              ))}
            </g>
            <g data-sheet>
              {!tall && (
              <g stroke="var(--color-ink)" strokeWidth="1" fill="none" style={{ fontFamily: "var(--font-mono)" }}>
                <g data-annot strokeOpacity="0.55">
                  <line x1="92" y1="790" x2="1508" y2="790" />
                  <line x1="92" y1="780" x2="92" y2="800" />
                  <line x1="1508" y1="780" x2="1508" y2="800" />
                  <text x="800" y="815" textAnchor="middle" fontSize="11" fill="var(--color-mute)" stroke="none" letterSpacing="2">RPC · ELEVATION A · 1:100</text>
                </g>
                <g data-annot strokeOpacity="0.55">
                  <line x1="1545" y1="225" x2="1545" y2={BASE} />
                  <line x1="1535" y1="225" x2="1555" y2="225" />
                  <line x1="1535" y1={BASE} x2="1555" y2={BASE} />
                  <text x="1560" y="484" fontSize="11" fill="var(--color-mute)" stroke="none" letterSpacing="2" transform="rotate(90 1560 484)" textAnchor="middle">+ 00.00</text>
                </g>
                <g data-annot>
                  <circle cx="92" cy="225" r="5" strokeOpacity="0.6" />
                  <line x1="80" y1="225" x2="104" y2="225" strokeOpacity="0.6" />
                  <line x1="92" y1="213" x2="92" y2="237" strokeOpacity="0.6" />
                </g>
              </g>

              )}

              {/* the letters, traced in ink before they open */}
              <g ref={ink} fill="#000" filter="url(#rpc-rim)" clipPath="url(#rpc-ink-clip)" {...letterProps}>
                {GLYPHS.map(([g], i) => (
                  <g key={g} data-side={g}>
                    <text x={pos(i)[0]} y={pos(i)[1]}>{g}</text>
                  </g>
                ))}
              </g>
            </g>
          </g>
        </svg>

        {/* opening typography around the letters */}
        <div className="gutter pointer-events-none absolute inset-x-0 top-24 flex items-start justify-between text-ink md:top-28">
          <p data-hero-ui className="eyebrow">{brand.descriptor}</p>
          {brand.city ? <p data-hero-ui className="eyebrow hidden md:block">{brand.city}</p> : null}
        </div>
        <div className="gutter absolute inset-x-0 bottom-8 flex flex-col items-start justify-between gap-6 text-ink md:bottom-10 md:flex-row md:items-end">
          <div data-hero-ui>
            <p className="display text-5xl md:text-7xl"><em>Constructions</em></p>
            <p className="mt-3 max-w-sm text-body leading-relaxed text-ink-2">{brand.taglineA} {brand.taglineB} From open ground to handover.</p>
          </div>
          <div data-hero-ui className="flex flex-col items-start gap-5 md:items-end">
            <div className="flex flex-wrap gap-3">
              <ArrowLink href="/contact">Start a project</ArrowLink>
              <ArrowLink href="/projects" variant="ghost">Projects</ArrowLink>
            </div>
            <span className="eyebrow flex items-center gap-3 text-mute">
              Scroll to enter
              <span className="relative block h-6 w-px overflow-hidden bg-current/30">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-[cue_2.4s_var(--ease-arch)_infinite] bg-current" />
              </span>
            </span>
          </div>
        </div>

        {/* inside the film: chapters */}
        {CHAPTERS.map((c, i) => (
          <div key={c.id} ref={(n) => { caps.current[i] = n; }} className="gutter absolute bottom-10 left-0 max-w-[36rem] text-paper md:bottom-14" style={{ opacity: 0, visibility: "hidden" }}>
            <p data-cap-fade className="eyebrow mb-4 flex items-center gap-3 opacity-85">
              <span>Stage {c.id}</span>
              <span className="h-px w-10 bg-current opacity-50" />
            </p>
            <div className="overflow-hidden pb-2">
              <h2 data-cap-title className="display text-6xl will-change-transform md:text-8xl">{c.title}</h2>
            </div>
            <p data-cap-fade className="mt-3 max-w-sm text-body leading-relaxed opacity-90">{c.line}</p>
          </div>
        ))}

        {/* build meter + stage rail */}
        <div data-hero-shade-top className="gutter absolute right-0 top-24 flex items-start gap-4 text-right text-paper" style={{ opacity: 0 }}>
          <dl>
            <dt className="eyebrow opacity-70">Build</dt>
            <dd className="display mt-1 text-4xl tabular-nums md:text-5xl"><span ref={pctRef}>000</span><span className="text-xl opacity-70">%</span></dd>
          </dl>
          <span className="relative mt-1 block h-16 w-px bg-white/25">
            <span ref={meter} className="absolute inset-0 origin-top bg-white" style={{ transform: "scaleY(0)" }} />
          </span>
        </div>
        <div data-hero-rail className="absolute right-0 top-1/2 hidden -translate-y-1/2 md:block">
          <ol data-hero-shade-top className="gutter flex flex-col items-end gap-3 text-paper" style={{ opacity: 0 }}>
            {RAIL.map((s, i) => (
              <li
                key={s.id}
                ref={(n) => { rail.current[i] = n; }}
                data-live="0"
                className="eyebrow group flex items-center gap-3 opacity-45 transition-opacity duration-500 data-[live=1]:opacity-100 data-[live=done]:opacity-70"
              >
                <span className="tabular-nums">{s.id}</span>
                <span className="max-w-0 overflow-hidden whitespace-nowrap transition-[max-width] duration-700 group-data-[live=1]:max-w-[10rem]">{s.title}</span>
                <span className="block h-px w-4 bg-current transition-[width] duration-500 group-data-[live=1]:w-10" />
              </li>
            ))}
          </ol>
        </div>

        {/* the finished building carries the statement */}
        <div data-hero-end-shade aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" style={{ opacity: 0 }} />
        <div data-hero-end className="gutter absolute inset-y-0 left-0 flex max-w-3xl flex-col justify-center text-paper" style={{ opacity: 0, visibility: "hidden" }}>
          <p data-end-fade className="eyebrow mb-6 opacity-85">{brand.city ? `RPC Constructions — ${brand.city}` : `RPC Constructions`}</p>
          <h1 className="display text-[13vw] leading-[0.9] md:text-[6.4vw]">
            <span className="block overflow-hidden pb-[0.06em]"><span data-end-line className="block">{brand.taglineA}</span></span>
            <span className="block overflow-hidden pb-[0.08em]"><em data-end-line className="block">{brand.taglineB}</em></span>
          </h1>
          <p data-end-fade className="mt-6 max-w-md text-body leading-relaxed opacity-85">From open ground to handover — one team, one standard, every floor.</p>
          <div data-end-fade className="mt-8 flex flex-wrap gap-3">
            <ArrowLink href="/contact" variant="light">Start a project</ArrowLink>
            <ArrowLink href="/projects" variant="ghost" className="text-paper">Projects</ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}
