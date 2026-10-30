import { Award, CalendarCheck, Handshake, HardHat, Ruler, ShieldCheck } from "lucide-react";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { ArrowLink, SectionMarker } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { brand, principles, stats } from "@/lib/content";

const ICONS = [Handshake, HardHat, Ruler, ShieldCheck, Award, CalendarCheck];

/**
 * About RPC — who we are in one screen: statement, story and figures beside a
 * project photograph, with the six principles in a single row.
 */
export function About({ index = "05", link = true }: { index?: string; link?: boolean }) {
  return (
    <section
      id="about"
      aria-label="About RPC"
      className="relative z-10 border-y border-ink/10 bg-paper-2 py-20 lg:flex lg:h-[100svh] lg:min-h-[680px] lg:flex-col lg:pb-10 lg:pt-24"
    >
      <div className="gutter flex min-h-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-ink/10 pb-4">
          <SectionMarker index={index} label="About RPC" />
          <span className="text-body font-medium text-mute hidden sm:inline">
            {brand.established} · {brand.city}, Tamil Nadu
          </span>
        </div>

        <div className="mt-8 grid min-h-0 flex-1 gap-10 lg:mt-10 lg:grid-cols-12 lg:gap-14">
          {/* statement + story */}
          <div className="flex flex-col justify-between lg:col-span-6">
            <Reveal>
              <h2 className="display text-4xl sm:text-5xl lg:text-[clamp(2.4rem,3.2vw,3.8rem)] leading-[1.12] tracking-[-0.02em] font-semibold">
                We build with the <em>patience</em> of people who <em>sign their work.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="mt-6">
              <p className="max-w-xl text-base leading-relaxed text-ink-2">
                RPC Constructions is an Erode-based design-and-build practice delivering homes, commercial buildings and industrial facilities across Tamil Nadu. Every building is waterproofed from land to roof, and the engineers who plan a project are the ones who stay on its site — from soil test to handover.
              </p>
              <dl className="mt-6 grid max-w-xl grid-cols-3 gap-6 border-t border-ink/15 pt-5">
                {stats.slice(0, 3).map((st) => (
                  <div key={st.label}>
                    <dt className="text-body font-semibold uppercase tracking-wider text-mute">{st.label}</dt>
                    <dd className="display mt-1.5 text-3xl md:text-4xl">
                      {st.value}
                      <span className="text-rpc">{st.suffix}</span>
                    </dd>
                  </div>
                ))}
              </dl>
              {link && (
                <div className="mt-6">
                  <ArrowLink href="/about" variant="solid">Our story & leadership</ArrowLink>
                </div>
              )}
            </Reveal>
          </div>

          {/* photograph fills the column height */}
          <div className="relative min-h-[22rem] lg:col-span-6 lg:min-h-0">
            <div className="absolute inset-0">
              <ParallaxImage
                src="/images/project-01.jpg"
                alt="Kaveri Residences, Perundurai Road, Erode — completed apartment building by RPC Constructions"
                className="h-full w-full rounded-sm bg-stone"
                sizes="(min-width: 1024px) 46vw, 92vw"
                amount={8}
              />
            </div>
            <div className="absolute bottom-4 left-4 rounded-sm bg-paper/92 px-4 py-3 backdrop-blur-md">
              <p className="eyebrow text-mute">Completed · Residential</p>
              <p className="display mt-1 text-xl">Kaveri Residences, Erode</p>
            </div>
          </div>
        </div>

        {/* principles — one compact row */}
        <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-3 lg:grid-cols-6">
          {principles.map((p, i) => {
            const Icon = ICONS[i] ?? ShieldCheck;
            return (
              <div key={p.title} title={p.body} className="group flex items-center gap-3 bg-paper-2 px-4 py-4 transition-colors duration-500 hover:bg-paper">
                <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-paper transition-colors duration-500 group-hover:bg-rpc">
                  <Icon size={16} strokeWidth={1.6} />
                </span>
                <dt className="text-body font-medium leading-tight">{p.title}</dt>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
