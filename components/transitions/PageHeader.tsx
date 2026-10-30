import Image from "next/image";
import { RevealLines } from "@/components/ui/Reveal";
import type { ReactNode } from "react";

/**
 * Inner-page header — a compact banner about half the screen tall: a
 * photograph under a dark gradient, the headline on the left, intro and
 * action on the right and the key facts as one slim row along the bottom.
 */
export function PageHeader({
  index,
  label,
  lines,
  intro,
  aside,
  image = "/images/final-cta-dusk.jpg",
  imageAlt = "",
  facts,
  variant = "banner",
  badge,
}: {
  index: string;
  label: string;
  lines: ReactNode[];
  intro?: ReactNode;
  aside?: ReactNode;
  image?: string;
  imageAlt?: string;
  facts?: [string, string][];
  /** banner: photo behind the text · split: text beside a framed photo · center: dark drawing board */
  variant?: "banner" | "plain" | "split" | "center";
  badge?: ReactNode;
}) {
  if (variant === "split") {
    return (
      <header className="relative z-10 bg-paper">
        <div className="gutter grid min-h-[50svh] gap-8 pb-10 pt-28 md:pt-32 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="lg:col-span-6">
            <p className="flex items-center gap-3 text-body font-medium text-mute">
              <span className="font-semibold tabular-nums text-rpc">{index}</span>
              <span className="h-px w-8 bg-current opacity-35" />
              <span className="text-ink">{label}</span>
            </p>
            <div className="mt-5">
              <RevealLines as="h1" className="display text-4xl sm:text-5xl lg:text-[clamp(2.5rem,3.8vw,4.2rem)] leading-[1.12] tracking-[-0.02em] font-semibold" lines={lines} />
            </div>
            {intro && <div className="mt-5 max-w-lg text-body leading-relaxed text-ink-2 md:text-base">{intro}</div>}
            {aside && <div className="mt-6">{aside}</div>}
          </div>
          <div className="relative lg:col-span-6">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-stone shadow-[0_40px_70px_-40px_rgba(17,19,22,0.5)] lg:aspect-auto lg:h-[42svh]">
              <Image src={image} alt={imageAlt} fill priority sizes="(min-width:1024px) 48vw, 92vw" className="object-cover" />
            </div>
            {badge && (
              <div className="absolute -bottom-5 left-5 rounded-xl bg-ink px-5 py-4 text-paper shadow-xl md:left-8">{badge}</div>
            )}
          </div>
        </div>
      </header>
    );
  }

  if (variant === "center") {
    return (
      <header className="relative z-10 overflow-hidden bg-night text-paper">
        {/* drawing-board grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(140,170,230,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(140,170,230,0.6) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            backgroundPosition: "center",
            maskImage: "radial-gradient(ellipse at center, black 25%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 25%, transparent 75%)",
          }}
        />
        <div aria-hidden className="absolute left-1/2 top-1/2 h-[30rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rpc/25 blur-[140px]" />
        <div className="gutter relative flex min-h-[50svh] flex-col items-center justify-center pb-12 pt-28 text-center md:pt-32">
          <p className="flex items-center gap-3 text-body font-medium text-paper/70">
            <span className="font-semibold tabular-nums text-rpc">{index}</span>
            <span className="h-px w-8 bg-current opacity-35" />
            <span>{label}</span>
          </p>
          <div className="mt-5">
            <RevealLines as="h1" className="display text-4xl sm:text-5xl lg:text-[clamp(2.5rem,4.2vw,4.5rem)] leading-[1.12] tracking-[-0.02em] font-semibold text-paper" lines={lines} />
          </div>
          {intro && <div className="mt-5 max-w-xl text-body leading-relaxed text-paper/75 md:text-base">{intro}</div>}
          {facts && (
            <ul className="mt-7 flex flex-wrap justify-center gap-2">
              {facts.map(([k, v]) => (
                <li key={k} className="rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-body backdrop-blur-sm">
                  <span className="font-medium text-paper">{v}</span> <span className="text-paper/55">{k}</span>
                </li>
              ))}
            </ul>
          )}
          {aside && <div className="mt-7 [&_.btn-solid]:bg-paper [&_.btn-solid]:text-ink">{aside}</div>}
        </div>
      </header>
    );
  }

  const plain = variant === "plain";
  return (
    <header className={`relative z-10 overflow-hidden ${plain ? "border-b border-ink/10 bg-paper text-ink" : "bg-night text-paper"}`}>
      {!plain && (
        <>
          <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="object-cover" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#0b111c]/95 via-[#0b111c]/75 to-[#0b111c]/35" />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0b111c]/80 to-transparent" />
        </>
      )}

      <div className="gutter relative flex flex-col justify-end pb-7 pt-28 md:min-h-[50svh] md:pb-10 md:pt-32">
        <p className={`flex items-center gap-3 text-body font-medium ${plain ? "text-mute" : "text-paper/70"}`}>
          <span className={`font-semibold tabular-nums ${plain ? "text-rpc" : "text-white"}`}>{index}</span>
          <span className="h-px w-8 bg-current opacity-35" />
          <span className={plain ? "text-ink" : "text-paper/90"}>{label}</span>
          <span className="ml-auto hidden text-body font-normal opacity-70 sm:inline">RPC Constructions · Erode, Tamil Nadu</span>
        </p>

        <div className="mt-4 grid gap-4 md:mt-6 md:gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <RevealLines as="h1" className="display text-4xl sm:text-5xl lg:text-[clamp(2.5rem,3.8vw,4.2rem)] leading-[1.12] tracking-[-0.02em] font-semibold" lines={lines} />
          </div>
          <div className="lg:col-span-5">
            {intro && <div className={`max-w-lg text-body leading-relaxed md:text-base ${plain ? "text-ink-2" : "text-paper/80"}`}>{intro}</div>}
            {aside && <div className={`mt-5 hidden md:block ${plain ? "" : "[&_.btn-solid]:bg-paper [&_.btn-solid]:text-ink [&_.btn-solid:hover]:bg-white"}`}>{aside}</div>}
          </div>
        </div>

        {facts && (
          <dl className={`mt-8 hidden grid-cols-2 gap-y-4 border-t pt-5 md:grid md:grid-cols-4 ${plain ? "border-ink/10" : "border-white/15"}`}>
            {facts.map(([k, v]) => (
              <div key={k} className={`flex items-baseline gap-3 md:border-l md:pl-5 md:first:border-l-0 md:first:pl-0 ${plain ? "md:border-ink/10" : "md:border-white/15"}`}>
                <dd className="display text-2xl leading-none md:text-3xl">{v}</dd>
                <dt className={`text-body uppercase tracking-[0.18em] ${plain ? "text-mute" : "text-paper/55"}`}>{k}</dt>
              </div>
            ))}
          </dl>
        )}
      </div>
    </header>
  );
}
