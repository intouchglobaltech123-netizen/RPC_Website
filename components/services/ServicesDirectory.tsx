import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Clock, Maximize2 } from "lucide-react";
import { services } from "@/lib/content";

export const serviceSlug = (title: string) => title.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Every discipline as its own spread — photograph and scope side by side. */
export function ServicesDirectory() {
  return (
    <div className="pb-8">
      {/* quick index */}
      <nav aria-label="Services" className="gutter relative z-10 mb-12 mt-10 hidden justify-center md:flex">
        <ul className="flex max-w-full gap-1.5 overflow-x-auto rounded-full bg-white/60 p-1.5 ring-1 ring-ink/10 [scrollbar-width:none]">
          {services.map((s) => (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${serviceSlug(s.title)}`}
                className="block rounded-full px-3.5 py-1.5 text-body font-medium text-ink/70 transition-colors hover:bg-ink hover:text-paper"
              >
                <span className="mr-1.5 font-mono text-body opacity-50">{s.id}</span>{s.title.replace(" Construction", "")}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* phones: two compact cards per row */}
      <ul className="gutter mt-6 grid grid-cols-2 gap-3 md:hidden">
        {services.map((s) => (
          <li key={s.id} id={`m-${serviceSlug(s.title)}`} className="h-full">
            <Link href={`/contact?service=${encodeURIComponent(s.title)}#enquiry`} className="flex h-full flex-col overflow-hidden rounded-xl bg-paper-2 ring-1 ring-ink/10">
              <div className="relative aspect-square bg-stone">
                <Image src={s.image} alt={`${s.title} by RPC Constructions`} fill sizes="46vw" className="object-cover" />
                <span className="absolute left-2 top-2 rounded-full bg-paper/90 px-2 py-0.5 font-mono text-body text-ink">{s.id}</span>
              </div>
              <div className="flex flex-1 flex-col p-3">
                <p className="line-clamp-2 text-body font-medium leading-snug" style={{ minHeight: "2.6em" }}>{s.title}</p>
                <p className="mt-1 truncate text-body leading-snug text-mute">{s.timeline}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-2.5 text-body font-medium text-rpc">
                  Enquire <ArrowUpRight size={12} />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="gutter hidden flex-col gap-10 md:flex md:gap-14">
        {services.map((s, i) => {
          const flip = i % 2 === 1;
          return (
            <article
              key={s.id}
              id={serviceSlug(s.title)}
              className="grid scroll-mt-40 overflow-hidden rounded-sm border border-ink/10 bg-paper-2 md:grid-cols-2"
            >
              <div className={`relative min-h-[18rem] bg-stone sm:min-h-[26rem] ${flip ? "md:order-2" : ""}`}>
                <Image src={s.image} alt={`${s.title} by RPC Constructions`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                <span className="display absolute left-6 top-4 text-7xl text-white/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] md:text-8xl">{s.id}</span>
              </div>
              <div className="flex flex-col justify-between p-7 md:p-10 lg:p-14">
                <div>
                  <p className="eyebrow text-mute">Discipline {s.id}</p>
                  <h2 className="display mt-3 text-4xl leading-[1] md:text-5xl lg:text-6xl">{s.title}</h2>
                  <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-2">{s.body}</p>
                  <p className="eyebrow mb-4 mt-9 text-mute">Scope of work</p>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {s.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-3 text-body">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-rpc text-white">
                          <Check size={11} strokeWidth={3} />
                        </span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-ink/10 pt-6">
                  <dl className="flex gap-8">
                    <div className="flex items-start gap-2.5">
                      <Maximize2 size={16} className="mt-0.5 text-mute" />
                      <div>
                        <dt className="eyebrow text-mute">Typical scale</dt>
                        <dd className="mt-1 text-body font-medium">{s.scale}</dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Clock size={16} className="mt-0.5 text-mute" />
                      <div>
                        <dt className="eyebrow text-mute">Programme</dt>
                        <dd className="mt-1 text-body font-medium">{s.timeline}</dd>
                      </div>
                    </div>
                  </dl>
                  <Link href={`/contact?service=${encodeURIComponent(s.title)}`} className="btn btn-solid">
                    <span>Enquire</span>
                    <span className="btn-icon" aria-hidden>
                      <ArrowUpRight size={14} />
                    </span>
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
