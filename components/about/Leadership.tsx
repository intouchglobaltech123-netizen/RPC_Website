import { SectionMarker } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { team } from "@/lib/content";

export function Leadership({ index = "04" }: { index?: string }) {
  return (
    <section aria-label="Practice Leadership" className="relative z-10 bg-paper-2 py-16 md:py-24">
      <div className="gutter">
        <div className="grid gap-6 md:grid-cols-12 md:gap-8 mb-12">
          <div className="md:col-span-3">
            <SectionMarker index={index} label="Leadership" />
          </div>
          <div className="md:col-span-9">
            <h2 className="display text-4xl md:text-5xl lg:text-6xl">
              Directed by partners who <em className="text-rpc">remain on site.</em>
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-2">
              Every commission undertaken by RPC is personally directed by a practice partner. We believe architectural excellence requires continuous technical oversight from ground survey to the final reveal.
            </p>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, i) => (
            <Reveal key={member.name} delay={i * 0.08} className="flex flex-col justify-between border-t border-ink/15 pt-6">
              <div>
                {member.qualifications && <p className="text-body font-semibold uppercase tracking-wider text-rpc">{member.qualifications}</p>}
                <h3 className="display mt-2 text-2xl md:text-3xl">{member.name}</h3>
                <p className="mt-1 text-body font-medium text-mute">{member.role}</p>
                <p className="mt-3 text-body leading-relaxed text-ink-2">{member.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
