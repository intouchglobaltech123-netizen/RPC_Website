"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { ArrowLink } from "@/components/ui/Primitives";
import { projects } from "@/lib/content";

const categories = ["All", "Residential", "Commercial", "Villa", "Industrial", "Mixed-use"] as const;

const statusDot = (s: string) => (s === "Completed" ? "bg-emerald-500" : s === "Under construction" ? "animate-pulse bg-amber-500" : "bg-sky-500");

export function ProjectsDirectory() {
  const [cat, setCat] = useState<string>("All");
  const list = useMemo(() => (cat === "All" ? projects : projects.filter((p) => p.type.toLowerCase() === cat.toLowerCase())), [cat]);

  return (
    <div className="gutter flex flex-col gap-12 pb-24 md:gap-16">
      {/* filters */}
      <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-4 md:mt-10">
        <div className="grid w-full grid-cols-3 gap-1 rounded-2xl bg-white/60 p-1.5 ring-1 ring-ink/10 md:flex md:w-auto md:flex-wrap md:items-center md:rounded-full">
          {categories.map((c) => {
            const on = cat === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                aria-pressed={on}
                className={`whitespace-nowrap rounded-full px-2 py-2 text-body font-medium md:px-4 md:py-1.5 transition-all duration-300 ${
                  on ? "bg-ink text-paper" : "text-ink/70 hover:bg-ink/[0.06] hover:text-ink"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
        <p className="hidden text-body text-mute md:block">
          Showing {list.length} of {projects.length}
        </p>
      </div>

      {/* phones: two compact cards per row */}
      <ul className="-mt-4 grid grid-cols-2 gap-3 md:hidden">
        {list.map((p) => (
          <li key={p.slug} className="h-full">
            <Link href={`/contact?project=${encodeURIComponent(p.name)}#enquiry`} className="flex h-full flex-col overflow-hidden rounded-xl bg-paper-2 ring-1 ring-ink/10">
              <div className="relative aspect-[4/5] bg-stone">
                <Image src={p.image} alt={`${p.name}, ${p.location}`} fill sizes="46vw" className="object-cover" />
                <span className="absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-paper/90 px-2 py-0.5 text-body text-ink">
                  <span className={`h-1.5 w-1.5 rounded-full ${statusDot(String(p.status))}`} />
                  {p.status}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-3">
                <p className="line-clamp-2 text-body font-medium leading-snug" style={{ minHeight: "2.6em" }}>{p.name}</p>
                <p className="mt-1 line-clamp-2 text-body leading-snug text-mute">{p.location}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* projects — image and text share the row equally */}
      <div className="hidden flex-col gap-10 md:flex md:gap-14">
        {list.map((p, i) => {
          const flip = i % 2 === 1;
          return (
            <article
              key={p.slug}
              id={p.slug}
              className="grid overflow-hidden rounded-sm border border-ink/10 bg-paper-2 md:grid-cols-2"
            >
              <div className={`group relative min-h-[18rem] overflow-hidden bg-stone sm:min-h-[24rem] ${flip ? "md:order-2" : ""}`}>
                <Image
                  src={p.image}
                  alt={`${p.name}, ${p.location} — ${p.type.toLowerCase()} project by RPC Constructions`}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-film)] group-hover:scale-[1.04]"
                />
                <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-paper/92 px-3.5 py-1.5 font-mono text-body tracking-wider text-ink backdrop-blur-md">
                  <span className={`h-2 w-2 rounded-full ${statusDot(String(p.status))}`} />
                  {p.status}
                </span>
                <span className="display absolute bottom-4 right-5 text-6xl text-white/85 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="flex flex-col justify-between p-7 md:p-10 lg:p-12">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <p className="eyebrow text-mute">
                      Project {String(i + 1).padStart(2, "0")} — {p.type}
                    </p>
                    {p.clientType && <span className="text-body text-mute">{p.clientType}</span>}
                  </div>
                  <h2 className="display mt-4 text-4xl leading-[1] md:text-5xl lg:text-6xl">{p.name}</h2>
                  <p className="mt-3 flex items-center gap-1.5 text-body text-ink-2">
                    <MapPin size={14} className="text-rpc" /> {p.location}
                  </p>
                  <p className="mt-5 text-body leading-relaxed text-ink-2">{p.summary}</p>

                  <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-ink/10 py-5">
                    <div>
                      <dt className="eyebrow text-mute">Area</dt>
                      <dd className="mt-1.5 text-body font-medium">{p.area}</dd>
                    </div>
                    <div>
                      <dt className="eyebrow text-mute">Year</dt>
                      <dd className="mt-1.5 text-body font-medium">{p.year}</dd>
                    </div>
                    <div>
                      <dt className="eyebrow text-mute">Typology</dt>
                      <dd className="mt-1.5 text-body font-medium">{p.type}</dd>
                    </div>
                  </dl>
                  <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                    {p.structuralSystem && (
                      <div>
                        <dt className="eyebrow text-mute">Structural system</dt>
                        <dd className="mt-1.5 text-body leading-relaxed text-ink-2">{p.structuralSystem}</dd>
                      </div>
                    )}
                    {p.materials && (
                      <div>
                        <dt className="eyebrow text-mute">Primary materials</dt>
                        <dd className="mt-1.5 text-body leading-relaxed text-ink-2">{p.materials}</dd>
                      </div>
                    )}
                    {p.waterproofing && (
                      <div className="sm:col-span-2">
                        <dt className="eyebrow text-rpc">Waterproofing</dt>
                        <dd className="mt-1.5 text-body leading-relaxed text-ink-2">{p.waterproofing}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                <Link
                  href={`/contact?project=${p.slug}`}
                  className="group mt-8 inline-flex items-center gap-3 self-start rounded-full border border-ink/20 py-2.5 pl-5 pr-2.5 text-body font-medium uppercase tracking-wider transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                >
                  Enquire about a similar project
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-ink/10 transition-transform group-hover:rotate-45 group-hover:bg-white/15">
                    <ArrowUpRight size={14} />
                  </span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <p className="hidden text-body text-mute md:block">Project details marked in [brackets] are indicative and will be confirmed.</p>

      {/* closing call to action */}
      <div className="flex flex-col items-start justify-between gap-5 rounded-2xl bg-night p-6 text-paper md:flex-row md:items-center md:rounded-sm md:p-12">
        <div>
          <p className="display text-3xl md:text-5xl">Have a site or brief in mind?</p>
          <p className="mt-2 text-body text-paper/65">Share a few details and an engineer will call you back within one working day.</p>
        </div>
        <ArrowLink href="/contact#enquiry" variant="light">Start a project</ArrowLink>
      </div>
    </div>
  );
}
