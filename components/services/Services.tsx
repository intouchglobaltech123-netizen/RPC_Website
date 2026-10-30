"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowLink, SectionMarker } from "@/components/ui/Primitives";
import { services } from "@/lib/content";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Services on the home page — one screen: the six disciplines on the right,
 * the selected one's scope, scale and programme on the left.
 */
export function Services({ index = "04", heading = true }: { index?: string; heading?: boolean }) {
  const [active, setActive] = useState<number>(0);

  const s = services[Math.max(0, active)]!;

  return (
    <section
      id="services"
      aria-label="Services"
      className="relative z-10 border-t border-ink/10 bg-paper py-14 md:py-20 lg:flex lg:h-[100svh] lg:min-h-[680px] lg:flex-col lg:pb-10 lg:pt-24"
    >
      <div className="gutter flex min-h-0 flex-1 flex-col">
        {heading && (
          <div className="flex items-center justify-between border-b border-ink/10 pb-4">
            <SectionMarker index={index} label="Services" />
            <span className="text-body font-medium text-mute hidden md:inline">06 disciplines · one accountable team</span>
          </div>
        )}

        {/* phones: swipe through the six disciplines as cards */}
        <div className="md:hidden">
          {heading && (
            <h2 className="display mt-6 leading-[1.12] tracking-[-0.02em] font-semibold" style={{ fontSize: "2.4rem" }}>
              One team, <em>built watertight.</em>
            </h2>
          )}
          <p className="mt-3 text-body leading-relaxed text-ink-2">Swipe to see what we build — from soil test to handover.</p>
          <ul className="-mx-[var(--gutter)] mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--gutter)] pb-2 [scrollbar-width:none]">
            {services.map((sv) => (
              <li key={sv.id} className="w-[84%] shrink-0 snap-center">
                <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white/60 ring-1 ring-ink/10">
                  <div className="relative aspect-[16/10] bg-stone">
                    <Image src={sv.image} alt={`${sv.title} by RPC Constructions`} fill sizes="84vw" className="object-cover" />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
                    <p className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                      <span className="display text-2xl leading-tight">{sv.title}</span>
                      <span className="font-mono text-body opacity-80">{sv.id}</span>
                    </p>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-body leading-relaxed text-ink-2">{sv.body}</p>
                    <ul className="mt-3 space-y-1.5">
                      {sv.deliverables.slice(0, 3).map((d) => (
                        <li key={d} className="flex items-start gap-2 text-body text-ink">
                          <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-rpc text-white">
                            <Check size={10} strokeWidth={3} />
                          </span>
                          {d}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-ink/10 pt-3" style={{ marginTop: "auto", paddingTop: 12 }}>
                      <span className="text-body text-ink-2">{sv.timeline}</span>
                      <Link
                        href={`/contact?service=${encodeURIComponent(sv.title)}#enquiry`}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-body font-medium text-paper"
                      >
                        Enquire <ArrowUpRight size={13} />
                      </Link>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <ArrowLink href="/services" variant="solid">All services</ArrowLink>
          </div>
        </div>

        <div className="mt-8 hidden min-h-0 flex-1 gap-10 md:grid lg:mt-10 lg:grid-cols-12 lg:gap-14">
          {/* left: heading + the selected discipline */}
          <div className="flex min-h-0 flex-col lg:col-span-5">
            {heading && (
              <Reveal>
                <h2 className="display text-4xl sm:text-5xl lg:text-[clamp(2.4rem,3.4vw,3.8rem)] leading-[1.12] tracking-[-0.02em] font-semibold">
                  One team, <em>built watertight.</em>
                </h2>
              </Reveal>
            )}
            <div className="relative mt-6 min-h-0 flex-1 lg:mt-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.article
                  key={s.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease }}
                  className="flex h-full flex-col overflow-hidden rounded-2xl bg-white/60 shadow-[0_24px_50px_-30px_rgba(17,19,22,0.35)] ring-1 ring-ink/10"
                >
                  <div className="relative h-40 shrink-0 overflow-hidden bg-stone lg:h-[22vh]">
                    <Image src={s.image} alt={`${s.title} by RPC Constructions`} fill sizes="(min-width:1024px) 38vw, 92vw" className="object-cover" />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute inset-x-5 bottom-4 flex items-end justify-between text-white">
                      <p className="display text-2xl md:text-3xl">{s.title}</p>
                      <span className="font-mono text-body opacity-80">{s.id} / {String(services.length).padStart(2, "0")}</span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5 md:p-6">
                    <p className="text-body leading-relaxed text-ink-2">{s.body}</p>
                    <ul className="mt-4 grid gap-x-5 gap-y-2 sm:grid-cols-2">
                      {s.deliverables.slice(0, 4).map((d) => (
                        <li key={d} className="flex items-start gap-2 text-body leading-snug text-ink">
                          <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-rpc text-white">
                            <Check size={10} strokeWidth={3} />
                          </span>
                          {d}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex items-center justify-between gap-4 border-t border-ink/10 pt-4">
                      <dl className="flex gap-6 text-body">
                        <div>
                          <dt className="text-body uppercase tracking-[0.16em] text-mute">Scale</dt>
                          <dd className="mt-1 font-medium">{s.scale}</dd>
                        </div>
                        <div>
                          <dt className="text-body uppercase tracking-[0.16em] text-mute">Programme</dt>
                          <dd className="mt-1 font-medium">{s.timeline}</dd>
                        </div>
                      </dl>
                      <Link
                        href={`/contact?service=${encodeURIComponent(s.title)}#enquiry`}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-body font-medium text-paper transition-colors hover:bg-rpc"
                      >
                        Enquire <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>

          {/* right: the six disciplines as a clean index */}
          <div className="flex min-h-0 flex-col lg:col-span-7">
            <ul className="flex flex-1 flex-col">
              {services.map((sv, i) => {
                const open = active === i;
                return (
                  <li key={sv.id} className="flex flex-1 border-b border-ink/10 first:border-t">
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                      aria-pressed={open}
                      className={`group relative flex w-full items-center gap-5 rounded-xl px-4 py-3 text-left transition-colors duration-500 md:gap-7 ${open ? "bg-white/60" : "hover:bg-white/30"}`}
                    >
                      <span aria-hidden className={`absolute inset-y-3 left-0 w-[3px] rounded-full bg-rpc transition-transform duration-500 ${open ? "scale-y-100" : "scale-y-0"}`} />
                      <span className={`w-7 shrink-0 font-mono text-body transition-colors ${open ? "text-rpc" : "text-mute"}`}>{sv.id}</span>
                      <span className="min-w-0 flex-1">
                        <span className={`display block text-[1.9rem] leading-[1.05] transition-all duration-500 md:text-[clamp(1.7rem,2.3vw,2.5rem)] ${open ? "italic text-ink" : "text-ink/60 group-hover:text-ink"}`}>
                          {sv.title}
                        </span>
                        <span className={`mt-1 hidden truncate text-body text-ink-2 transition-opacity duration-500 md:block ${open ? "opacity-100" : "opacity-0"}`}>
                          {sv.scale} · {sv.timeline}
                        </span>
                      </span>
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                          open ? "border-ink bg-ink text-paper" : "border-ink/15 text-ink/50 group-hover:border-ink group-hover:text-ink"
                        }`}
                      >
                        <ArrowUpRight size={16} strokeWidth={1.6} className={`transition-transform duration-500 ${open ? "rotate-45" : ""}`} />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="hidden text-body text-ink-2 md:block">Design, engineering and construction under one contract.</p>
              <ArrowLink href="/services" variant="solid">All services</ArrowLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
