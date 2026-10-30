"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { SectionMarker } from "@/components/ui/Primitives";
import { anatomy } from "@/lib/content";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLenis } from "@/components/providers/SmoothScroll";

const useIso = typeof window !== "undefined" ? useLayoutEffect : () => {};

/**
 * Anatomy of a building — one plate per system, top to bottom (roof → foundation).
 * Each plate shows how that system is waterproofed, with the technique and its
 * three steps written over the picture so it reads at a glance.
 */
const PLATES = anatomy;
const N = PLATES.length;

export function Exploded({ index = "03" }: { index?: string } = {}) {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  useIso(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: (() => void)[] = [];
    const ctx = gsap.context(() => {
      const plates = gsap.utils.toArray<HTMLElement>("[data-plate]");
      const items = gsap.utils.toArray<HTMLElement>("[data-sys]");
      const caption = el.querySelector<HTMLElement>("[data-caption]");
      const bar = el.querySelector<HTMLElement>("[data-bar]");
      const setStage = (s: number) => {
        items.forEach((li, i) => {
          const done = i < s;
          const now = i === s;
          li.toggleAttribute("data-active", now);
          li.toggleAttribute("data-done", done && !now);
        });
        if (caption) caption.textContent = `${String(s + 1).padStart(2, "0")} / ${String(N).padStart(2, "0")}`;
      };
      setStage(0);
      if (reduced) {
        gsap.set(plates.slice(1), { autoAlpha: 0 });
        return;
      }
      gsap.set(plates.slice(1), { clipPath: "inset(0 0 100% 0)" });
      if (window.matchMedia("(max-width: 767px)").matches) {
        // phones: no pinned, scroll-driven peel — one screen, layers play on a loop
        el.style.height = "auto";
        const pin = el.firstElementChild as HTMLElement | null;
        if (pin) pin.style.position = "relative";
        const loop = gsap.timeline({ repeat: -1, repeatDelay: 1.2, paused: true, defaults: { ease: "power2.inOut" } });
        loop.call(() => setStage(0), [], 0);
        plates.slice(1).forEach((plate, i) => {
          const at = 1.6 + i * 2.2;
          loop.call(() => setStage(i + 1), [], at);
          loop.to(plate, { clipPath: "inset(0 0 0% 0)", duration: 0.9 }, at);
        });
        loop.to(plates.slice(1), { clipPath: "inset(0 0 100% 0)", duration: 0.01 }, "+=2");
        if (bar) bar.style.transform = "scaleY(1)";
        ScrollTrigger.create({ trigger: el, start: "top 80%", end: "bottom 20%", onToggle: (st) => (st.isActive ? loop.play() : loop.pause()) });
        return;
      }
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          onUpdate: (st) => {
            setStage(Math.min(N - 1, Math.round(st.progress * (N - 1))));
            if (bar) bar.style.transform = `scaleY(${st.progress})`;
          },
        },
      });
      // plate i is fully in place exactly at progress i/(N-1), so each snap point shows one whole picture
      plates.slice(1).forEach((plate, i) => {
        const at = i + 0.15;
        const img = plate.querySelector("img");
        tl.to(plate, { clipPath: "inset(0 0 0% 0)", duration: 0.7 }, at);
        if (img) tl.fromTo(img, { scale: 1.08 }, { scale: 1, duration: 0.85, ease: "power2.out" }, at);
      });
      tl.to({}, { duration: Math.max(0, N - 1 - tl.duration()) });

      // one scroll = one picture. While the section is pinned, each wheel gesture moves
      // exactly one plate; past the 6th (or above the 1st) the page scrolls on normally.
      const st = tl.scrollTrigger!;
      let busy = false;
      let lastWheel = 0;
      const onWheel = (e: WheelEvent) => {
        if (Math.abs(e.deltaY) < 2 || e.ctrlKey) return;
        const y = window.scrollY;
        const start = st.start;
        const span = st.end - st.start;
        if (y < start - 4 || y > st.end + 4) return;
        const now = performance.now();
        const idle = now - lastWheel > 220;
        lastWheel = now;
        if (busy || !idle) {
          // swallow the rest of this gesture (trackpad inertia) so it cannot skip plates
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }
        const cur = Math.round(((y - start) / span) * (N - 1));
        const next = cur + (e.deltaY > 0 ? 1 : -1);
        if (next < 0 || next > N - 1) return; // leave the section: normal scrolling
        e.preventDefault();
        e.stopImmediatePropagation();
        busy = true;
        const target = start + (span * next) / (N - 1);
        const done = () => { busy = false; lastWheel = performance.now(); };
        const l = lenisRef.current;
        if (l) l.scrollTo(target, { duration: 0.95, easing: (t: number) => 1 - Math.pow(1 - t, 3), lock: true, force: true, onComplete: done });
        else { window.scrollTo({ top: target, behavior: "smooth" }); setTimeout(done, 900); }
      };
      window.addEventListener("wheel", onWheel, { passive: false, capture: true });
      cleanups.push(() => window.removeEventListener("wheel", onWheel, { capture: true }));
      // slow push-in over the whole sequence
      tl.fromTo("[data-stage]", { scale: 1 }, { scale: 1.05, duration: tl.duration() }, 0);
    }, el);
    return () => {
      cleanups.forEach((f) => f());
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} id="anatomy" aria-label="Anatomy of a building" className="relative z-10 h-[600vh] bg-night text-paper">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -left-40 top-1/3 h-[30rem] w-[36rem] rounded-full bg-rpc/15 blur-[130px]" />
        <div className="anat-wrap gutter relative flex h-full min-h-0 flex-col gap-5 pb-6 pt-24 md:gap-6 md:pb-10 md:pt-28 lg:grid lg:grid-cols-12 lg:grid-rows-[minmax(0,1fr)] lg:gap-10">
          {/* Copy + systems list */}
          <div className="flex min-h-0 shrink-0 flex-col justify-between lg:col-span-4">
            <div>
              <SectionMarker index={index} label="Anatomy" className="text-paper/70" />
              <h2 className="display mt-4 text-4xl leading-[1.12] tracking-[-0.02em] font-semibold md:mt-5 md:text-5xl lg:text-[clamp(2.4rem,3.4vw,3.8rem)]">
                Six systems.
                <br />
                <em className="text-rpc">All waterproofed.</em>
              </h2>
              <p className="mt-3 max-w-sm text-body leading-relaxed text-paper/65 md:mt-4 md:text-body">
                <span className="md:hidden">Each layer sealed against water — terrace to footings.</span>
                <span className="hidden md:inline">Scroll through a finished RPC building — each layer sealed against water, down to the footings.</span>
              </p>
            </div>
            <ol className="mt-4 flex flex-wrap gap-1.5 md:mt-5 md:gap-2 lg:mt-4 lg:block lg:max-w-sm lg:space-y-0.5">
              {anatomy.map((a, i) => (
                <li
                  key={a.key}
                  data-sys
                  className="group relative flex items-center gap-2 rounded-full border border-white/10 px-2.5 py-1 text-paper/40 md:px-3.5 md:py-1.5 lg:gap-4 lg:rounded-sm lg:border-0 lg:px-3 transition-all duration-500 data-[active]:bg-white/[0.07] data-[active]:text-paper data-[done]:text-paper/70"
                >
                  <span className="absolute inset-y-2 left-0 hidden w-0.5 scale-y-0 lg:block bg-rpc transition-transform duration-500 group-data-[active]:scale-y-100" />
                  <span className="font-sans font-semibold tabular-nums text-body text-rpc">0{i + 1}</span>
                  <span className="flex flex-col">
                    <span className="text-body font-medium md:text-body">{a.label}</span>
                    <span className="hidden text-body text-paper/50 group-data-[active]:text-paper/70 lg:inline">{a.note}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Plates */}
          <div className="relative min-h-0 flex-1 lg:col-span-8 lg:h-full">
            <div className="relative h-full overflow-hidden rounded-sm border border-white/10 bg-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
              <div data-stage className="absolute inset-0 origin-center will-change-transform">
                {PLATES.map((p, i) => (
                  <div key={p.key} data-plate className="absolute inset-0" style={{ zIndex: i }}>
                    <Image
                      src={p.image}
                      alt={p.alt}
                      fill
                      sizes="(min-width: 768px) 66vw, 92vw"
                      className="object-cover"
                      loading={i === 0 ? undefined : "eager"}
                    />
                    <div aria-hidden className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
                    {/* how it is waterproofed — read straight off the picture */}
                    <div className="absolute inset-x-4 bottom-4 md:inset-x-7 md:bottom-7">
                      <p className="eyebrow !text-body text-[#8fc6e8] md:!text-body">
                        {String(i + 1).padStart(2, "0")} · {p.label}
                      </p>
                      <p className="display mt-1 text-2xl leading-[1.02] text-white md:mt-2 md:text-[2.6vw]">{p.technique}</p>
                      <ol className="mt-2.5 flex flex-wrap gap-1.5 md:mt-4 md:gap-2">
                        {p.steps.map((step, k) => (
                          <li key={step} className="flex items-center gap-1.5 rounded-full bg-white/12 py-1 pl-1 pr-2.5 text-body leading-tight text-white/90 backdrop-blur-md md:gap-2 md:py-1.5 md:pl-1.5 md:pr-3.5 md:text-body">
                            <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#8fc6e8] font-mono text-body text-ink md:h-5 md:w-5 md:text-body">{k + 1}</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}
              </div>
              <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-black/45 to-transparent" />
              <span className="eyebrow absolute left-4 top-4 z-20 !text-body md:left-5 md:top-5 md:!text-body rounded-full bg-black/40 px-3 py-1.5 text-paper/85 backdrop-blur-md">
                <span data-caption className="tabular-nums text-[#8fc6e8]">01 / 06</span>
                <span className="mx-2 opacity-40">·</span>
                Waterproofed section
              </span>
              {/* scroll progress, like a section line being drawn down the sheet */}
              <div aria-hidden className="absolute inset-y-5 right-5 z-20 w-px bg-white/25 md:right-7">
                <div data-bar className="h-full w-full origin-top scale-y-0 bg-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
