"use client";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLink, SectionMarker } from "@/components/ui/Primitives";
import { brand, manifesto, services } from "@/lib/content";
import { gsap } from "@/lib/gsap";

const useIso = typeof window !== "undefined" ? useLayoutEffect : () => {};

/** A single statement, read at the pace of the scroll — words settle into ink. */
export function Manifesto() {
  const root = useRef<HTMLElement>(null);
  const words = manifesto.split(" ");
  // phones: the six disciplines as a slideshow, one every 2 s
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    const id = window.setInterval(() => setSlide((i) => (i + 1) % services.length), 2000);
    return () => window.clearInterval(id);
  }, []);

  useIso(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 767px)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-word]",
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.12,
          scrollTrigger: { trigger: "[data-statement]", start: "top 78%", end: "bottom 45%", scrub: 0.6 },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="about-intro"
      className="relative z-10 flex min-h-[100svh] flex-col justify-between bg-paper pb-8 pt-24 md:py-20"
    >
      <div className="gutter flex flex-1 flex-col justify-between gap-5 md:gap-12">
        {/* Top Header Row — spanning full section width */}
        <div className="flex items-center justify-between border-b border-ink/10 pb-6 md:pb-8">
          <SectionMarker index="01" label="The practice" />
          {[brand.established, brand.city].filter(Boolean).length > 0 && (
            <p className="text-body font-medium text-mute">
              {[brand.established, brand.city].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>

        {/* Central Manifesto Statement — spanning full section width */}
        <div className="my-auto py-2 md:py-10">
          <p
            data-statement
            className="display text-[7.5vw] sm:text-[6.2vw] md:text-[5vw] lg:text-[4.5vw] leading-[1.08] tracking-[-0.02em] text-ink w-full"
          >
            {words.map((w, i) => (
              <span key={i} data-word className="inline-block pr-[0.22em]">
                {i === 3 || i === 4 ? <em>{w}</em> : w}
              </span>
            ))}
          </p>
        </div>

        {/* Phones: the six disciplines, one image every 2 seconds */}
        <div className="md:hidden">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-stone">
            {services.map((sv, i) => (
              <Image
                key={sv.id}
                src={sv.image}
                alt={sv.title}
                fill
                sizes="92vw"
                className="object-cover transition-opacity duration-700"
                style={{ opacity: i === slide ? 1 : 0 }}
              />
            ))}
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
            <p className="absolute bottom-3 left-3 text-body font-medium text-white">
              <span className="mr-2 font-mono text-body text-white/70">{services[slide]!.id}</span>
              {services[slide]!.title}
            </p>
          </div>
          <div className="mt-2.5 flex justify-center gap-1.5">
            {services.map((sv, i) => (
              <span key={sv.id} className={`h-1 rounded-full transition-all duration-500 ${i === slide ? "w-5 bg-ink" : "w-1.5 bg-ink/20"}`} />
            ))}
          </div>
        </div>

        {/* Bottom Details Row — spanning full section width */}
        <div className="grid gap-6 border-t border-ink/10 pt-6 md:grid-cols-12 md:items-end md:gap-10 md:pt-8">
          <p className="text-body sm:text-base leading-relaxed text-ink-2 md:col-span-7 lg:col-span-6 max-w-xl">
            RPC Constructions builds homes, commercial and industrial buildings across Tamil Nadu — each one waterproofed in six stages, from the soil under the raft to the roof above.
          </p>
          <div className="md:col-span-5 lg:col-span-6 flex md:justify-end">
            <ArrowLink href="/about" variant="ghost">About RPC</ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}
