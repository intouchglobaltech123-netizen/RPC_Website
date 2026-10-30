import { SectionMarker } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { accreditations } from "@/lib/content";

export function Accreditations({ index = "05" }: { index?: string }) {
  return (
    <section aria-label="Standards and Accreditations" className="relative z-10 bg-paper py-16 md:py-24 border-t border-ink/10">
      <div className="gutter">
        <div className="grid gap-6 md:grid-cols-12 md:gap-8 mb-12">
          <div className="md:col-span-3">
            <SectionMarker index={index} label="Standards" />
          </div>
          <div className="md:col-span-9">
            <h2 className="display text-4xl md:text-5xl">
              Audited by industry bodies, <em className="italic">bound by code.</em>
            </h2>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {accreditations.map((acc, i) => (
            <Reveal key={acc.code} delay={i * 0.06} className="border border-ink/15 p-6 bg-paper-2">
              <span className="inline-block px-3 py-1 font-mono text-body font-semibold bg-ink text-paper rounded-xs">
                {acc.code}
              </span>
              <h3 className="display mt-4 text-xl">{acc.title}</h3>
              <p className="mt-3 text-body leading-relaxed text-ink-2">{acc.detail}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
