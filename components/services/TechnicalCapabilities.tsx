import { DraftingCompass, Handshake, Layers, ShieldCheck } from "lucide-react";
import { SectionMarker } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { engagementModels, technicalCapabilities } from "@/lib/content";

const ICONS = [Layers, DraftingCompass, Handshake, ShieldCheck];

export function TechnicalCapabilities({ index = "04" }: { index?: string }) {
  return (
    <section aria-label="Engineering capabilities and ways of working" className="relative z-10 overflow-hidden bg-night py-12 text-paper md:py-28">
      <div aria-hidden className="pointer-events-none absolute -left-40 top-10 h-[30rem] w-[40rem] rounded-full bg-rpc/15 blur-[130px]" />
      <div className="gutter relative">
        <div className="mb-6 grid gap-3 md:mb-12 md:gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionMarker index={index} label="Engineering" className="text-paper/70" />
            <h2 className="display mt-5 text-4xl leading-[1.12] tracking-[-0.02em] font-semibold md:mt-8 md:text-6xl">
              Engineered before <em className="text-rpc">it is built.</em>
            </h2>
          </div>
          <p className="hidden text-lg leading-relaxed text-paper/65 md:block lg:col-span-5">
            Every project is designed, checked and tested by our own engineers — waterproofing included — so problems are solved on paper, not on site.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 md:gap-4 lg:grid-cols-4">
          {technicalCapabilities.map((c, i) => {
            const Icon = ICONS[i] ?? Layers;
            return (
              <Reveal key={c.title} delay={i * 0.06} className="rounded-xl border border-white/12 bg-white/[0.04] p-4 md:rounded-sm md:p-7">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 md:h-12 md:w-12">
                  <Icon size={18} strokeWidth={1.6} />
                </span>
                <h3 className="display mt-4 text-lg leading-[1.15] md:mt-8 md:text-2xl">{c.title}</h3>
                <p className="mt-3 hidden text-body leading-relaxed text-paper/65 md:block">{c.description}</p>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-20 hidden border-t border-white/12 pt-14 md:block">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h3 className="display text-4xl md:text-5xl">Three ways to work with us.</h3>
            <p className="max-w-md text-body text-paper/60">Choose the arrangement that suits your project — the same team and standards apply to all three.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {engagementModels.map((m, i) => (
              <Reveal key={m.model} delay={i * 0.08} className="flex flex-col justify-between rounded-lg bg-paper p-8 text-ink">
                <div>
                  <span className="font-sans font-semibold text-body tabular-nums text-rpc">0{i + 1}</span>
                  <h4 className="display mt-4 text-2xl md:text-3xl font-semibold tracking-[-0.015em]">{m.model}</h4>
                  <p className="mt-4 text-body leading-relaxed text-ink-2">{m.description}</p>
                </div>
                <p className="mt-8 border-t border-ink/10 pt-4 text-body font-medium">{m.benefit}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
