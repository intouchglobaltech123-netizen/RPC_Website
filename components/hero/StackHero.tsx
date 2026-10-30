"use client";
import { useEffect, useRef } from "react";
import { ArrowLink } from "@/components/ui/Primitives";
import { brand } from "@/lib/content";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { sceneState } from "@/lib/three/store";
import layout from "@/public/parallax/layout.json";

/**
 * "Floor by floor" hero — driven entirely by scroll.
 *
 * The finished building (cut from the construction footage) is sliced into
 * its storeys, and every plane (sky, city, building, road) sits at its own
 * depth in real CSS 3D. The page opens on the empty plot seen from above.
 * Each step of scroll lowers the next floor on crane cables onto the one
 * below — a puff of dust, a small tremor, the counter ticking up — while the
 * camera travels between angles: aerial → left → low right → square-on,
 * then pushes in. Scroll back and everything reverses.
 */

const W = layout.w;
const H = layout.h;
const [bx0, by0, bx1, by1] = layout.building as [number, number, number, number];
const [, gy0] = layout.ground as [number, number, number, number];
const pct = (v: number, of: number) => `${(v / of) * 100}%`;

// storey bands in source-frame pixels (1280×720); ×2 = layer pixels. Bottom → top.
const S = 2;
const RAW: [number, number][] = [
  [610, 668], // ground floor
  [552, 610],
  [492, 552],
  [432, 492],
  [372, 432],
  [312, 372],
  [252, 312],
  [150, 252], // top floor + roof pergola
];
const BANDS: [number, number][] = RAW.map(([a, b]) => [a * S, b * S]);
const FLOOR_H = 3.5; // metres per storey, for the level readout

const DEPTH = { sky: 0.15, city: 0.55, building: 1, ground: 1.9 } as const;

const src = (f: string) =>
  (typeof window !== "undefined" && (window as Window & { __RPC_LAYERS?: Record<string, string> }).__RPC_LAYERS?.[f]) || `/parallax/${f}`;

const HEADLINE = `${brand.taglineA} ${brand.taglineB}`;

export function StackHero() {
  const root = useRef<HTMLElement>(null);
  const r = useRef<Record<string, HTMLElement | null>>({});
  const set = (k: string) => (el: HTMLElement | null) => { r.current[k] = el; };
  const floorsRef = useRef<(HTMLDivElement | null)[]>([]);
  const dustRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const R = r.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let alive = true;

    const files = ["sky.webp", "city-wide.webp", "building.webp", "ground-wide.webp"];
    const loaded = Promise.all(files.map((f) => new Promise<void>((res) => { const i = new Image(); i.onload = i.onerror = () => res(); i.src = src(f); })));
    loaded.then(() => {
      if (!alive) return;
      sceneState.ready = true;
      window.dispatchEvent(new Event("rpc:ready"));
    });

    const setCount = (n: number) => {
      if (R.count) R.count.textContent = String(n).padStart(2, "0");
      if (R.level) R.level.textContent = `+${(n * FLOOR_H).toFixed(2)}`;
    };

    const ctx = gsap.context(() => {
      const floors = floorsRef.current.filter(Boolean) as HTMLDivElement[];
      const dust = dustRef.current.filter(Boolean) as HTMLDivElement[];
      const chars = gsap.utils.toArray<HTMLElement>("[data-ch]");

      if (reduced) {
        setCount(floors.length);
        return;
      }

      // depth: every plane sits at its own distance from the camera; the scale
      // compensates so the composition is unchanged when the camera is square-on
      const PERSP = 1500;
      const Z = { sky: -1100, headline: -160, city: -320, building: 0, ground: 240 } as const;
      (Object.keys(Z) as (keyof typeof Z)[]).forEach((k) => {
        const node = k === "headline" ? R.headline : R[`${k}Mouse`];
        if (node) gsap.set(node, { z: Z[k], scale: (PERSP - Z[k]) / PERSP, transformStyle: "preserve-3d" });
      });

      // floors wait above the frame, swung out on their cables
      floors.forEach((f, i) => gsap.set(f, { y: "-120vh", x: (i % 2 ? 1 : -1) * 90, rotation: (i % 2 ? 1 : -1) * 3.5, opacity: 0 }));
      gsap.set(R.caret!, { opacity: 0 });
      setCount(0);

      // on load: the camera sweeps down onto the empty plot
      const intro = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
      intro
        .fromTo(R.camera!, { rotationX: 30, rotationY: -8, scale: 0.9, y: "6%" }, { rotationX: 18, rotationY: 0, scale: 0.96, y: "3%", duration: 2.4 }, 0)
        .fromTo(R.city!, { yPercent: 5, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.4 }, 0.1)
        .fromTo(R.ground!, { yPercent: 35 }, { yPercent: 0, duration: 1.4 }, 0.1)
        .fromTo(chars, { opacity: 0 }, { opacity: 1, duration: 0.01, stagger: 0.04, ease: "none" }, 0.6)
        .fromTo("[data-hero-ui]", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1 }, 1.2);
      loaded.then(() => gsap.delayedCall(1.4, () => alive && intro.play()));

      // ── scroll: the building goes up floor by floor while the camera moves
      //    between angles — aerial → left → low right → square-on → push in
      const STEP = 0.066;
      const DROP = 0.05;
      const t0 = 0.05;
      const lands = floors.map((_, i) => t0 + i * STEP + DROP);
      const done = t0 + (floors.length - 1) * STEP + DROP;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.9 },
        onUpdate() {
          const t = this.time();
          setCount(lands.filter((l) => t >= l).length);
        },
      });

      // camera shots
      tl.to(R.camera!, { rotationX: 8, rotationY: -13, scale: 1.0, x: "3%", y: "1%", duration: 0.2, ease: "sine.inOut" }, 0.03)
        .to(R.camera!, { rotationX: -4, rotationY: 12, scale: 1.1, x: "-3%", y: "-2%", duration: 0.24, ease: "sine.inOut" }, 0.24)
        .to(R.camera!, { rotationX: 0, rotationY: 0, scale: 1, x: "0%", y: "0%", duration: 0.12, ease: "sine.inOut" }, done - 0.06)
        .to(R.camera!, { scale: 1.16, y: "-3%", duration: 1 - done - 0.06, ease: "sine.in" }, done + 0.06);

      floors.forEach((f, i) => {
        const at = t0 + i * STEP;
        const cables = f.querySelectorAll("[data-cable]");
        tl.set(f, { opacity: 1 }, at)
          .fromTo(f, { y: "-120vh", x: (i % 2 ? 1 : -1) * 90, rotation: (i % 2 ? 1 : -1) * 3.5 }, { y: 0, x: 0, rotation: 0, duration: DROP, ease: "power2.inOut", immediateRender: false }, at)
          .to(f, { yPercent: 4, scaleY: 0.975, transformOrigin: "50% 100%", duration: 0.005, ease: "power1.out" }, at + DROP)
          .to(f, { yPercent: 0, scaleY: 1, duration: 0.012, ease: "power2.out" }, at + DROP + 0.005)
          .to(cables, { scaleY: 0, transformOrigin: "50% 0%", opacity: 0, duration: 0.02 }, at + DROP + 0.004)
          .fromTo(R.shake!, { y: 0 }, { y: 3, duration: 0.004, yoyo: true, repeat: 1, immediateRender: false }, at + DROP);
        const d = dust[i];
        if (d) tl.fromTo(d, { scaleX: 0.2, opacity: 0.85 }, { scaleX: 1.35, opacity: 0, duration: 0.04, ease: "power2.out", immediateRender: false }, at + DROP);
      });

      tl.to("[data-hero-cue]", { autoAlpha: 0, duration: 0.03 }, 0.01)
        .to(R.headline!, { yPercent: -140, opacity: 0, duration: 0.07 }, done - 0.05)
        .to("[data-hero-scrollfade]", { autoAlpha: 0, y: -24, duration: 0.05 }, done)
        .to(R.groundScroll!, { yPercent: 55, duration: 1 - done }, done)
        .to(R.skyScroll!, { yPercent: -5, duration: 1 - done }, done)
        .fromTo("[data-hero-shade]", { opacity: 0 }, { opacity: 1, duration: 0.1 }, done + 0.1)
        .fromTo("[data-hero-end]", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" }, done + 0.15)
        .to({}, { duration: 0.04 }, 0.96);

      // ── pointer depth
      if (window.matchMedia("(pointer: fine)").matches) {
        const movers = (Object.keys(DEPTH) as (keyof typeof DEPTH)[]).map((k) => ({
          x: gsap.quickTo(R[`${k}Mouse`]!, "x", { duration: 1.4, ease: "power3.out" }),
          y: gsap.quickTo(R[`${k}Mouse`]!, "y", { duration: 1.4, ease: "power3.out" }),
          d: DEPTH[k],
        }));
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          movers.forEach((m) => { m.x(-nx * 26 * m.d); m.y(-ny * 12 * m.d); });
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
      }
    }, el);
    ScrollTrigger.refresh();
    return () => {
      alive = false;
      ctx.revert();
    };
  }, []);

  const bw = bx1 - bx0;
  const bh = by1 - by0;
  const layer = "absolute will-change-transform";

  return (
    <section ref={root} aria-label="RPC Constructions" className="relative h-[560vh] bg-[#52759b]">
      <div className="sticky top-0 h-[100svh] overflow-hidden text-paper" style={{ perspective: "1500px", perspectiveOrigin: "50% 45%" }}>
        <div ref={set("shake")} className="absolute inset-0 [transform-style:preserve-3d]">
          <div ref={set("camera")} className="absolute inset-0 [transform-style:preserve-3d]" style={{ transformOrigin: "50% 62%" }}>
          <div className="hero-stage [transform-style:preserve-3d]">
            <div ref={set("skyMouse")} className="absolute inset-0">
              <div ref={set("skyScroll")} className={layer} style={{ left: "-80%", width: "260%", top: "-90%", height: "200%", backgroundImage: `url(${src("sky.webp")})`, backgroundSize: "100% 100%" }} />
            </div>

            {/* headline types itself into the sky above the roof */}
            <div ref={set("headline")} className="absolute inset-x-0 hidden md:block" style={{ top: "6.5%" }}>
              <h1 className="display whitespace-nowrap text-center text-[7.4cqw] leading-none tracking-[-0.03em] text-white [text-shadow:0_2px_28px_rgba(15,35,65,.28)]">
                {HEADLINE.split("").map((c, i) => (
                  <span key={i} data-ch className={i >= brand.taglineA.length + 1 ? "italic" : undefined}>
                    {c === " " ? " " : c}
                  </span>
                ))}
                <span ref={set("caret")} aria-hidden className="ml-[0.06em] inline-block h-[0.8em] w-[0.05em] translate-y-[0.08em] bg-white align-baseline" />
              </h1>
            </div>

            <div ref={set("cityMouse")} className="absolute inset-0">
              <div ref={set("city")} className="absolute inset-0">
                <div ref={set("cityScroll")} className={`${layer} inset-y-0 origin-bottom`} style={{ left: "-100%", width: "300%", backgroundImage: `url(${src("city-wide.webp")})`, backgroundSize: "100% 100%" }} />
              </div>
            </div>

            {/* the building, one storey per slice */}
            <div ref={set("buildingMouse")} className="absolute inset-0">
              <div ref={set("buildingScroll")} className={`${layer} inset-0`} style={{ transformOrigin: "50% 62%" }}>
                <div className="absolute" style={{ left: pct(bx0, W), top: pct(by0, H), width: pct(bw, W), height: pct(bh, H) }}>
                  {BANDS.map(([a, b], i) => (
                    <div key={i} className="absolute inset-x-0" style={{ top: pct(a - by0, bh), height: pct(b - a, bh) }}>
                      <div ref={(n) => { floorsRef.current[i] = n; }} className="absolute inset-0 will-change-transform" style={{ zIndex: i }}>
                        {/* crane cables: the floor is lowered, not dropped */}
                        <div data-cable aria-hidden className="pointer-events-none absolute bottom-full left-[30%] h-[140vh] w-px bg-[#1d2430]/70" />
                        <div data-cable aria-hidden className="pointer-events-none absolute bottom-full right-[30%] h-[140vh] w-px bg-[#1d2430]/70" />
                        <div className="absolute inset-0 overflow-hidden shadow-[0_18px_30px_-18px_rgba(0,0,0,.45)]">
                          <div
                            className="absolute inset-x-0"
                            style={{ top: `${(-(a - by0) / (b - a)) * 100}%`, height: `${(bh / (b - a)) * 100}%`, backgroundImage: `url(${src("building.webp")})`, backgroundSize: "100% 100%" }}
                          />
                        </div>
                      </div>
                      {/* dust burst on impact */}
                      <div
                        ref={(n) => { dustRef.current[i] = n; }}
                        aria-hidden
                        className="pointer-events-none absolute inset-x-[-12%] bottom-[-18%] h-[36%] opacity-0"
                        style={{ background: "radial-gradient(50% 50% at 50% 60%, rgba(236,228,214,.85), rgba(236,228,214,0) 70%)", filter: "blur(2px)" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div ref={set("groundMouse")} className="absolute inset-0">
              <div ref={set("ground")} className="absolute inset-0">
                <div ref={set("groundScroll")} className={`${layer} origin-top`} style={{ left: "-100%", width: "300%", top: pct(gy0, H), height: pct(H - gy0, H), backgroundImage: `url(${src("ground-wide.webp")})`, backgroundSize: "100% 100%" }} />
              </div>
            </div>
          </div>
          </div>
        </div>

        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/55 to-transparent" />

        <div data-hero-cue className="absolute bottom-28 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-paper md:bottom-32">
          <span className="eyebrow">Scroll to build</span>
          <span className="relative block h-9 w-px overflow-hidden bg-white/30">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[cue_2.4s_var(--ease-arch)_infinite] bg-white" />
          </span>
        </div>
        <div data-hero-shade aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/10" style={{ opacity: 0 }} />

        {/* live readout */}
        <div data-hero-scrollfade className="absolute inset-0 pointer-events-none">
        <dl data-hero-ui className="gutter absolute right-0 top-24 flex gap-8 text-right">
          <div>
            <dt className="eyebrow opacity-70">Floor</dt>
            <dd className="eyebrow mt-1 tabular-nums"><span ref={set("count")}>00</span> / {String(BANDS.length).padStart(2, "0")}</dd>
          </div>
          <div className="hidden sm:block">
            <dt className="eyebrow opacity-70">Level</dt>
            <dd className="eyebrow mt-1 tabular-nums"><span ref={set("level")}>+0.00</span> m</dd>
          </div>
        </dl>
        </div>

        {/* phones: headline above the stage */}
        <h1 className="display gutter absolute inset-x-0 top-28 text-[15vw] leading-[0.9] md:hidden">
          {brand.taglineA} <em>{brand.taglineB}</em>
        </h1>

        <div data-hero-scrollfade className="gutter absolute inset-x-0 bottom-8 flex flex-col items-start justify-between gap-6 md:bottom-12 md:flex-row md:items-end">
          <div data-hero-ui className="max-w-sm">
            <p className="eyebrow mb-3 opacity-85">{brand.descriptor}</p>
            <p className="text-body leading-relaxed text-paper/90">Every floor planned, engineered and set in place — from foundation to roof.</p>
          </div>
          <div data-hero-ui className="flex flex-wrap items-center gap-3">
            <ArrowLink href="/contact" variant="light">Start a project</ArrowLink>
            <ArrowLink href="/projects" variant="ghost" className="text-paper">Projects</ArrowLink>
          </div>
        </div>

        <div data-hero-end className="gutter absolute inset-y-0 left-0 flex max-w-2xl flex-col justify-center" style={{ opacity: 0, visibility: "hidden" }}>
          <p className="eyebrow mb-6 opacity-85">{brand.city ? `RPC Constructions — ${brand.city}` : `RPC Constructions`}</p>
          <h2 className="display text-[12vw] leading-[0.9] md:text-[5.6vw]">
            Built floor<br /><em>by floor.</em>
          </h2>
          <p className="mt-6 max-w-md text-body leading-relaxed text-paper/90">
            [ Short statement about RPC — the kind of buildings you deliver and how. ]
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ArrowLink href="/contact" variant="light">Start a project</ArrowLink>
            <ArrowLink href="/#process" variant="ghost" className="text-paper">How we build</ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}
