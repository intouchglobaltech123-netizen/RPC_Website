"use client";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { SectionMarker } from "@/components/ui/Primitives";
import { gsap } from "@/lib/gsap";

const useIso = typeof window !== "undefined" ? useLayoutEffect : () => {};

const STEPS = [
  { key: "Blueprint", note: "Drawn", src: "/images/bp-1.jpg", alt: "Blueprint drawing of the building massing and floor plan" },
  { key: "Structure", note: "Framed", src: "/images/bp-2.jpg", alt: "Concrete frame of the building under construction" },
  { key: "Architecture", note: "Enclosed", src: "/images/bp-3.jpg", alt: "Building being plastered and painted inside bamboo scaffolding" },
  { key: "Completed", note: "Delivered", src: "/images/bp-4.jpg", alt: "Completed building with its landscaped garden" },
];

/**
 * Signature moment: the same camera, four states of truth. A survey line
 * sweeps across the frame and everything behind it becomes the next stage.
 */
export function BlueprintReality() {
  const root = useRef<HTMLElement>(null);

  useIso(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const layers = gsap.utils.toArray<HTMLElement>("[data-layer]");
      const scans = gsap.utils.toArray<HTMLElement>("[data-scan]");
      const steps = gsap.utils.toArray<HTMLElement>("[data-step]");
      const setStep = (i: number) => steps.forEach((s, k) => s.toggleAttribute("data-active", k === i));
      setStep(0);
      if (reduced) {
        // show the final state; the step list still tells the story
        gsap.set(layers.slice(1), { clipPath: "inset(0 0% 0 0)" });
        setStep(3);
        return;
      }
      gsap.set(layers.slice(1), { clipPath: "inset(0 100% 0 0)" });
      gsap.set(scans, { left: "0%", autoAlpha: 0 });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=320%",
          pin: "[data-pin]",
          scrub: 1,
          onUpdate: (s) => setStep(Math.min(3, Math.floor(s.progress * 3.6 + 0.35))),
        },
      });
      // draw the drawing border / title block first
      tl.fromTo("[data-draw]", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, stagger: 0.04 }, 0);
      layers.slice(1).forEach((layer, i) => {
        const at = 0.7 + i * 1.15;
        const img = layer.querySelector("img");
        tl.set(scans[i]!, { autoAlpha: 1 }, at)
          .to(layer, { clipPath: "inset(0 0% 0 0)", duration: 0.85 }, at)
          .to(scans[i]!, { left: "100%", duration: 0.85 }, at)
          .set(scans[i]!, { autoAlpha: 0 }, at + 0.85);
        if (img) tl.fromTo(img, { scale: 1.06 }, { scale: 1, duration: 1.1, ease: "power2.out" }, at);
      });
      tl.to("[data-annot]", { autoAlpha: 0, duration: 0.3 }, 0.7);
      tl.to({}, { duration: 0.3 });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="blueprint" aria-label="From blueprint to reality" className="relative z-10 bg-rpc-deep text-paper">
      <div data-pin className="relative h-[100svh] overflow-hidden">
        {STEPS.map((s, i) => (
          <div key={s.key} data-layer className="absolute inset-0" style={{ zIndex: i }}>
            <Image src={s.src} alt={s.alt} fill sizes="100vw" className="object-cover" priority={i === 0} loading={i === 0 ? undefined : "eager"} fetchPriority={i === 0 ? undefined : "low"} />
          </div>
        ))}
        {STEPS.slice(1).map((s, i) => (
          <div key={s.key} data-scan aria-hidden className="absolute inset-y-0 z-20 w-px bg-white/80" style={{ left: 0, visibility: "hidden" }}>
            <span className="eyebrow absolute left-3 top-1/2 -translate-y-1/2 whitespace-nowrap !text-body text-white">
              Section {String.fromCharCode(65 + i)}—{String.fromCharCode(65 + i)}
            </span>
          </div>
        ))}

        {/* drawing border + title block, like a sheet from the set */}
        <svg data-annot aria-hidden className="pointer-events-none absolute inset-0 z-10 h-full w-full text-white/60" preserveAspectRatio="none" viewBox="0 0 100 100">
          <g fill="none" stroke="currentColor" strokeWidth="0.08" vectorEffect="non-scaling-stroke">
            <rect data-draw x="2.5" y="4" width="95" height="92" pathLength={1} strokeDasharray="1" />
            <path data-draw d="M72 84 H97.5 M72 84 V96 M84 84 V96 M72 90 H97.5" pathLength={1} strokeDasharray="1" />
          </g>
        </svg>
        <div data-annot className="pointer-events-none absolute bottom-[4%] right-[2.5%] z-10 hidden w-[25%] grid-cols-2 text-white/80 md:grid">
          <div className="eyebrow h-[6vh] p-2 !text-body">RPC Constructions</div>
          <div className="eyebrow h-[6vh] p-2 !text-body">Dwg. A-201</div>
          <div className="eyebrow p-2 !text-body">Elevation / Plan</div>
          <div className="eyebrow p-2 !text-body">Scale 1:200</div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-r from-black/45 via-black/5 to-transparent" />
        <div className="gutter absolute inset-0 z-40 flex flex-col justify-between py-28">
          <SectionMarker index="03" label="Blueprint → Reality" />
          <div>
            <h2 className="display max-w-[12ch] text-[13vw] md:text-[6.4vw]">
              Drawn once. <em>Built exactly.</em>
            </h2>
            <ol className="mt-10 flex flex-col gap-2">
              {STEPS.map((s, i) => (
                <li key={s.key} data-step className="group flex items-center gap-4 opacity-40 transition-opacity duration-700 data-[active]:opacity-100">
                  <span className="eyebrow w-6 tabular-nums">0{i + 1}</span>
                  <span className="h-px w-6 bg-current transition-all duration-700 group-data-[active]:w-14" />
                  <span className="text-lg">{s.key}</span>
                  <span className="eyebrow opacity-60">{s.note}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
