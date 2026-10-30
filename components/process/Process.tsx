"use client";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { SectionMarker } from "@/components/ui/Primitives";
import { process } from "@/lib/content";
import { gsap } from "@/lib/gsap";

const useIso = typeof window !== "undefined" ? useLayoutEffect : () => {};

/**
 * Six stages, one continuous sequence. Each new frame rises into place from
 * the bottom — the way a building does — over the one before it.
 */
export function Process({ index = "03" }: { index?: string } = {}) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useIso(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const frames = gsap.utils.toArray<HTMLElement>("[data-frame]", el);
      gsap.set(frames.slice(1), { clipPath: "inset(100% 0 0 0)" });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${window.innerHeight * (process.length - 0.4)}`,
          pin: "[data-process-pin]",
          scrub: 1,
          onUpdate: (s) => setActive(Math.min(process.length - 1, Math.floor(s.progress * process.length))),
        },
      });
      frames.slice(1).forEach((f, i) => {
        const img = f.querySelector("img");
        const prev = frames[i]!.querySelector("img");
        tl.to(f, { clipPath: "inset(0% 0 0 0)", duration: 1, ease: "power2.inOut" }, i + 0.5);
        if (img) tl.fromTo(img, { scale: 1.15, yPercent: 6 }, { scale: 1.02, yPercent: 0, duration: 1.4, ease: "power2.out" }, i + 0.5);
        if (prev) tl.to(prev, { scale: 0.96, filter: "brightness(0.55)", duration: 1 }, i + 0.5);
      });
      tl.fromTo("[data-process-bar]", { scaleY: 0 }, { scaleY: 1, duration: process.length, ease: "none" }, 0);
    });
    return () => mm.revert();
  }, []);

  const step = process[active]!;

  return (
    <section ref={root} id="process" aria-label="Construction process" className="relative z-10 bg-paper">
      {/* Desktop: pinned sequence */}
      <div data-process-pin className="hidden h-[100svh] md:grid-cols-12 md:motion-safe:grid">
        <div className="gutter col-span-5 flex flex-col justify-between py-28">
          <SectionMarker index={index} label="Process" />
          <div>
            <div className="flex items-end gap-6">
              <div className="relative h-[15vw] w-[20vw] overflow-hidden">
                {process.map((p, i) => (
                  <span
                    key={p.id}
                    aria-hidden={i !== active}
                    className="display absolute inset-0 text-[17vw] leading-[0.85] tabular-nums transition-transform duration-[1100ms] ease-[var(--ease-film)]"
                    style={{ transform: `translateY(${(i - active) * 100}%)` }}
                  >
                    {p.id}
                  </span>
                ))}
              </div>
            </div>
            <h3 key={step.title} className="display mt-6 text-6xl">{step.title}</h3>
            <p className="mt-5 max-w-sm text-body leading-relaxed text-ink-2">{step.body}</p>
          </div>
          <ol className="flex gap-4">
            <li className="relative w-px bg-ink/15">
              <span data-process-bar className="absolute inset-0 origin-top bg-ink" />
            </li>
            <li>
              <ol className="grid grid-cols-2 gap-x-8 gap-y-1.5">
                {process.map((p, i) => (
                  <li key={p.id} className={`eyebrow transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-35"}`}>
                    {p.id} {p.title}
                  </li>
                ))}
              </ol>
            </li>
          </ol>
        </div>
        <div className="relative col-span-7 my-[9vh] mr-[var(--gutter)] overflow-hidden bg-stone">
          {process.map((p, i) => (
            <div key={p.id} data-frame className="absolute inset-0 overflow-hidden" style={{ zIndex: i }}>
              <Image src={p.image} alt={`${p.title} stage`} fill sizes="60vw" loading="eager" fetchPriority="low" className="object-cover will-change-transform" />
            </div>
          ))}
          <div className="absolute bottom-0 left-0 z-10 bg-paper px-4 py-3">
            <p className="eyebrow">Stage {step.id} / 06 — {step.title}</p>
          </div>
        </div>
      </div>

      {/* Mobile / reduced motion: vertical sequence */}
      <div className="gutter py-12 md:py-24 md:motion-safe:hidden">
        <SectionMarker index={index} label="Process" />
        <ol className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 md:mt-12 md:grid-cols-3 md:gap-x-8 md:gap-y-16">
          {process.map((p) => (
            <li key={p.id}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-stone md:rounded-none">
                <Image src={p.image} alt={`${p.title} stage`} fill sizes="(min-width: 768px) 30vw, 46vw" className="object-cover" />
              </div>
              <div className="mt-2.5 flex items-baseline gap-2 md:mt-5 md:gap-4">
                <span className="font-mono text-body text-mute md:display md:text-5xl md:text-ink">{p.id}</span>
                <h3 className="display text-xl md:text-4xl">{p.title}</h3>
              </div>
              <p className="mt-1.5 text-body leading-snug text-ink-2 md:mt-3 md:text-body md:leading-relaxed">{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
