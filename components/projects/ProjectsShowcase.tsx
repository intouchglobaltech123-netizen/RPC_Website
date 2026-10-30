"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { ArrowLink, SectionMarker } from "@/components/ui/Primitives";
import { Tilt } from "@/components/ui/Tilt";
import { projects } from "@/lib/content";
import { gsap } from "@/lib/gsap";

const useIso = typeof window !== "undefined" ? useLayoutEffect : () => {};
const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Pinned horizontal presentation. The track moves with the scroll; the
 * project in focus scales up and its title & metadata take over the left
 * column like a presentation board changing sheets.
 */
export function ProjectsShowcase() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const inner = useRef<(HTMLDivElement | null)[]>([]);
  const bar = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useIso(() => {
    const el = root.current;
    const tr = track.current;
    if (!el || !tr) return;
    const mm = gsap.matchMedia();
    // the pinned presentation needs a wide screen; tablets in portrait and phones swipe instead
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      let last = -1;
      const layout = () => {
        const vw = window.innerWidth;
        const cx = vw * 0.66; // focus line
        cards.current.forEach((c, i) => {
          if (!c) return;
          const r = c.getBoundingClientRect();
          const d = (r.left + r.width / 2 - cx) / vw; // -1..1
          const k = Math.min(1, Math.abs(d) * 1.6);
          c.style.transform = `scale(${1 - k * 0.16})`;
          c.style.opacity = String(1 - k * 0.55);
          const im = inner.current[i];
          if (im) im.style.transform = `translate3d(${-d * 12}%,0,0) scale(1.2)`;
        });
      };
      const getScrollDistance = () => {
        const vw = window.innerWidth;
        const cardStep = vw * 0.54;
        return cardStep * (projects.length - 1) + vw * 0.28;
      };

      const tween = gsap.to(tr, {
        x: () => -getScrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${window.innerHeight * (projects.length - 1) * 0.75}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (s) => {
            const idx = Math.min(projects.length - 1, Math.floor(s.progress * projects.length));
            if (idx !== last) {
              last = idx;
              setActive(idx);
            }
            if (bar.current) bar.current.style.transform = `scaleX(${s.progress})`;
          },
        },
      });
      gsap.ticker.add(layout);
      layout();
      return () => {
        gsap.ticker.remove(layout);
        tween.kill();
      };
    });
    return () => mm.revert();
  }, []);

  const p = projects[active]!;

  return (
    <section ref={root} id="projects" aria-label="Selected projects" className="grain relative z-10 overflow-hidden bg-night text-paper">
      {/* Desktop presentation */}
      <div className="hidden h-[100svh] lg:flex">
        <div className="gutter relative z-10 flex w-[36vw] shrink-0 flex-col justify-between bg-night py-28">
          <SectionMarker index="02" label="Selected projects" />
          <div>
            <p className="text-body font-semibold tabular-nums text-rpc mb-5">
              {String(active + 1).padStart(2, "0")} <span className="opacity-50 text-paper/60">/ {String(projects.length).padStart(2, "0")}</span>
            </p>
            <div className="relative min-h-[6.5rem] md:min-h-[8rem] lg:min-h-[9.5rem] flex flex-col justify-start">
              <AnimatePresence mode="wait" initial={false}>
                <motion.h3
                  key={p.slug}
                  className="display text-4xl sm:text-5xl md:text-5xl lg:text-[3.2vw] leading-[1.12] tracking-[-0.02em] font-semibold"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.35, ease }}
                >
                  {p.name}
                </motion.h3>
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.dl
                key={p.slug}
                className="mt-6 grid max-w-md grid-cols-2 gap-x-8 gap-y-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease }}
              >
                {([["Location", p.location], ["Type", p.type], ["Area", p.area], ["Year", p.year], ["Status", p.status]] as const).map(([k, v]) => (
                  <div key={k} className="border-t border-white/15 pt-3">
                    <dt className="eyebrow mb-1.5 text-paper/45">{k}</dt>
                    <dd className="text-body">{v}</dd>
                  </div>
                ))}
                {p.waterproofing && (
                  <div className="border-t border-white/15 pt-3">
                    <dt className="eyebrow mb-1.5 text-[#8fc6e8]">Waterproofing</dt>
                    <dd className="text-body leading-snug">{p.waterproofing}</dd>
                  </div>
                )}
              </motion.dl>
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-6">
            <ArrowLink href="/projects" variant="light">All projects</ArrowLink>
            <div className="relative h-px flex-1 bg-white/15">
              <div ref={bar} className="absolute inset-0 origin-left bg-paper" style={{ transform: "scaleX(0)" }} />
            </div>
          </div>
        </div>
        <div ref={track} className="flex min-w-0 flex-1 items-center gap-[4vw] pl-[4vw] pr-[20vw] will-change-transform motion-reduce:overflow-x-auto">
          {projects.map((pr, i) => (
            <div
              key={pr.slug}
              ref={(el) => { cards.current[i] = el; }}
              className="relative h-[68svh] w-[50vw] shrink-0 origin-center"
            >
              {/* the whole sheet leans toward the pointer; the image drifts inside it */}
              <Tilt className="h-full w-full" max={6}>
                <Link
                  href="/projects"
                  aria-label={`${pr.name} — view project`}
                  data-cursor="view"
                  className="relative block h-full w-full overflow-hidden bg-ink-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]"
                >
                  <div ref={(el) => { inner.current[i] = el; }} className="absolute inset-0 will-change-transform">
                    <Image src={pr.image} alt={`${pr.name} — ${pr.type}`} fill sizes="55vw" className="object-cover" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/50 to-transparent p-6">
                    <span className="eyebrow">{pr.type}</span>
                    <span className="eyebrow tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                </Link>
              </Tilt>
            </div>
          ))}
        </div>
      </div>

      {/* Phones and tablets in portrait: native swipe with snap */}
      <div className="py-20 md:py-24 lg:hidden">
        <div className="gutter mb-10">
          <SectionMarker index="02" label="Selected projects" />
        </div>
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-4 [scrollbar-width:none]">
          {projects.map((pr, i) => (
            <article key={pr.slug} className="w-[82vw] shrink-0 snap-center sm:w-[58vw] md:w-[52vw]">
              <div className="relative aspect-[4/5] max-h-[68svh] w-full overflow-hidden bg-ink-2">
                <Image src={pr.image} alt={`${pr.name} — ${pr.type}`} fill sizes="82vw" className="object-cover" />
              </div>
              <p className="eyebrow mt-5 text-paper/50">{String(i + 1).padStart(2, "0")} — {pr.type}</p>
              <h3 className="display mt-2 text-5xl md:text-6xl">{pr.name}</h3>
              <p className="eyebrow mt-3 text-paper/60">{pr.location} · {pr.year} · {pr.status}</p>
              {pr.waterproofing && (
                <p className="mt-3 text-body leading-relaxed text-paper/75">
                  <span className="eyebrow mr-2 text-[#8fc6e8]">Waterproofing</span>
                  {pr.waterproofing}
                </p>
              )}
            </article>
          ))}
        </div>
        <div className="gutter mt-10">
          <ArrowLink href="/projects" variant="light">All projects</ArrowLink>
        </div>
      </div>
    </section>
  );
}
