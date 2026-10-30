"use client";

import { useEffect, useRef, useState } from "react";
import { SectionMarker } from "@/components/ui/Primitives";
import { stats } from "@/lib/content";

const NOTES = ["Built & waterproofed", "Working from Erode", "Homes, firms & factories", "Erode to Chennai"];

/**
 * Performance record: a compact band (about 40% of the viewport) on sand,
 * with the four headline figures counting up as it enters.
 */
export function Stats({ index = "06" }: { index?: string }) {
  const root = useRef<HTMLElement>(null);
  const [k, setK] = useState(1);

  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setK(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const step = (t: number) => {
          const p = Math.min(1, (t - t0) / 1800);
          setK(1 - Math.pow(1 - p, 3));
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={root} aria-label="Performance record" className="relative z-10 flex items-center bg-paper py-12 text-ink md:min-h-[40svh] md:py-16">
      <div className="gutter relative mx-auto grid w-full max-w-none gap-6 md:gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-4">
          <SectionMarker index={index} label="Performance record" className="text-mute [&>span:first-child]:text-rpc" />
          <h2 className="display mt-4 text-title md:mt-5">One dry building at a time.</h2>
        </div>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[16px] bg-[rgba(18,34,59,0.12)] shadow-[inset_0_0_0_1px_rgba(18,34,59,0.12)] lg:col-span-8 lg:grid-cols-4">
          {stats.map((s, i) => {
            const v = typeof s.value === "number" ? Math.round(s.value * k) : s.value;
            return (
              <div key={s.label} className="flex flex-col bg-card px-5 py-6 md:px-7 md:py-7">
                <dt className="order-2 mt-3 text-body font-semibold md:mt-4">{s.label}</dt>
                <dd className="order-1 display text-title leading-none tabular-nums text-night">
                  {v}
                  <span className="text-rpc">{s.suffix}</span>
                </dd>
                <dd className="order-3 mt-1 text-body leading-snug text-mute md:mt-1.5">{NOTES[i]}</dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
