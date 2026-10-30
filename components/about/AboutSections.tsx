import Image from "next/image";
import { Award, CalendarCheck, Eye, Handshake, HardHat, Quote, Ruler, ShieldCheck, Target } from "lucide-react";
import { LogoMark } from "@/components/navigation/Logo";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { SectionMarker } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { company, founder, principles } from "@/lib/content";

/** Our story — text beside two site photographs. */
export function CompanyStory({ index = "02" }: { index?: string }) {
  return (
    <section aria-label="Our story" className="relative z-10 bg-paper py-12 md:py-28">
      <div className="gutter grid gap-8 md:gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionMarker index={index} label="Our story" />
          <Reveal>
            <h2 className="display mt-5 text-4xl leading-[1] md:mt-8 md:text-6xl">
              From one site in Erode to <em>projects across Tamil Nadu.</em>
            </h2>
          </Reveal>
          <div className="mt-5 space-y-4 text-body leading-relaxed text-ink-2 md:mt-8 md:space-y-5 md:text-[17px]">
            {company.story.map((p) => (
              <Reveal key={p}><p>{p}</p></Reveal>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:col-span-7">
          <ParallaxImage
            src="/stages/03-foundation.jpg"
            alt="Foundation footings and raft being cast on an RPC site"
            className="mt-8 aspect-[3/4] w-full rounded-lg border-2 border-ink bg-stone md:mt-16 md:rounded-sm"
            sizes="(min-width: 1024px) 28vw, 46vw"
          />
          <ParallaxImage
            src="/images/project-01.jpg"
            alt="Completed Kaveri Residences apartment building in Erode"
            className="aspect-[3/4] w-full rounded-lg border-2 border-ink bg-stone md:rounded-sm"
            sizes="(min-width: 1024px) 28vw, 46vw"
          />
        </div>
      </div>
    </section>
  );
}

/** Vision & mission — two architectural panels side by side. */
export function VisionMission({ index = "03" }: { index?: string }) {
  return (
    <section aria-label="Vision and mission" className="relative z-10 bg-paper py-12 md:py-24">
      <div className="gutter">
        <SectionMarker index={index} label="Vision & mission" />

        <div className="mt-8 grid gap-5 md:gap-8 lg:grid-cols-2">
          <Reveal className="flex flex-col justify-between rounded-2xl bg-night p-6 text-paper md:p-10">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-body font-medium uppercase tracking-[0.18em] text-paper/85">
              <Eye size={14} /> Our vision
            </span>
            <p className="display mt-6 text-2xl leading-[1.2] md:text-[clamp(1.7rem,2.4vw,2.4rem)]">{company.vision}</p>
          </Reveal>

          <Reveal delay={0.08} className="flex flex-col justify-between rounded-2xl border border-ink/10 bg-white/70 p-6 md:p-10">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-rpc/10 px-3.5 py-1.5 text-body font-medium uppercase tracking-[0.18em] text-rpc">
              <Target size={14} /> Our mission
            </span>
            <p className="display mt-6 text-2xl leading-[1.2] text-ink md:text-[clamp(1.7rem,2.4vw,2.4rem)]">{company.mission}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Founder / managing director — portrait and message. */
export function FounderMessage({ index = "04" }: { index?: string }) {
  return (
    <section aria-label="Message from the founder" className="relative z-10 bg-paper-2 py-12 md:py-28">
      <div className="gutter grid gap-7 md:gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-night sm:aspect-[4/5] sm:rounded-sm">
            {founder.image ? (
              <Image src={founder.image} alt={`${founder.name}, ${founder.role}, RPC Constructions`} fill sizes="(min-width: 1024px) 38vw, 92vw" className="object-cover" />
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]">
                <div className="flex flex-col items-center gap-5 text-center text-paper/60">
                  <LogoMark className="h-24 w-24 opacity-90" />
                  <span className="eyebrow">Founder portrait</span>
                </div>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-6 text-paper">
              <p className="display text-3xl">{founder.name}</p>
              <p className="eyebrow mt-2 text-paper/75">{founder.role}</p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7">
          <SectionMarker index={index} label="From the founder" />
          <Quote size={36} strokeWidth={1} className="mt-5 text-rpc md:mt-8" />
          <div className="mt-3 space-y-4 md:mt-4 md:space-y-6">
            {founder.message.map((m, i) => (
              <Reveal key={m} delay={i * 0.06}>
                <p className={i === 0 ? "display text-2xl leading-[1.15] md:text-[2.7rem]" : "max-w-2xl text-body leading-relaxed text-ink-2 md:text-lg"}>{m}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-7 flex items-center gap-4 border-t border-ink/15 pt-5 md:mt-10 md:pt-6">
            <LogoMark className="h-12 w-12" />
            <div>
              <p className="font-medium">{founder.name}</p>
              <p className="text-body text-mute">
                {founder.role} · {founder.qualifications}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const ICONS = [Handshake, HardHat, Ruler, ShieldCheck, Award, CalendarCheck];

/** Values — the six principles as a grid. */
export function Values({ index = "05" }: { index?: string }) {
  return (
    <section aria-label="Our values" className="relative z-10 bg-paper py-12 md:py-28">
      <div className="gutter">
        <div className="mb-6 grid gap-3 md:mb-12 md:gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionMarker index={index} label="Values" />
            <h2 className="display mt-5 text-4xl leading-[1] md:mt-8 md:text-6xl">
              What every client <em>can count on.</em>
            </h2>
          </div>
          <p className="text-body leading-relaxed text-ink-2 md:text-lg lg:col-span-5">Six principles that decide how we plan, build and hand over — on every site, at every size.</p>
        </div>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-ink/10 bg-ink/10 md:rounded-sm lg:grid-cols-3">
          {principles.map((p, i) => {
            const Icon = ICONS[i] ?? ShieldCheck;
            return (
              <div key={p.title} className="group bg-paper p-4 transition-colors md:p-8 duration-500 hover:bg-paper-2">
                <div aria-hidden className="flex items-center justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-paper transition-colors duration-500 group-hover:bg-rpc md:h-12 md:w-12">
                    <Icon size={18} strokeWidth={1.6} />
                  </span>
                  <span className="font-mono text-body text-mute">0{i + 1}</span>
                </div>
                <dt className="display mt-4 text-xl md:mt-8 md:text-3xl">{p.title}</dt>
                <dd className="mt-1.5 text-body leading-snug text-ink-2 md:mt-3 md:text-body md:leading-relaxed">{p.body}</dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
