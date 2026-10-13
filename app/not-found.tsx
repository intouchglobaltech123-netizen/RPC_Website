import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/contact/Footer";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/** where most people are headed */
const PLACES = [
  { href: "/waterproofing", label: "Waterproofing", line: "The method for each part of a building" },
  { href: "/services", label: "Services", line: "Waterproofing, construction and leak repair" },
  { href: "/products", label: "Products", line: "Every product we supply, brand by brand" },
  { href: "/projects", label: "Projects", line: "Buildings we have built and sealed" },
] as const;

const arrow = (
  <svg viewBox="0 0 16 16" aria-hidden className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
    <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * A missing page: a pipe with a gap in it and a drop falling through the gap,
 * what went wrong in one line, the way home, and the four pages most people
 * are looking for.
 */
export default function NotFound() {
  const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-water";
  return (
    <>
      <main className="gutter relative z-10 mx-auto flex min-h-[100svh] max-w-[1600px] flex-col justify-center pb-16 pt-28">
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-16">
          <div>
            <p className="m-0 flex items-center gap-3 text-body font-medium text-mute">
              <span className="font-semibold text-[var(--theme-primary)]">404</span>
              <span aria-hidden className="h-px w-8 bg-current opacity-40" />
              Page not found
            </p>
            <h1 className="m-0 mt-4 max-w-[16ch] font-display text-title font-semibold leading-[1.1] tracking-[-0.02em] text-balance">
              There is a gap where this page should be.
            </h1>
            <p className="m-0 mt-4 max-w-[34rem] text-body leading-relaxed text-mute">
              The link may be old, or the address may have a typo. Everything on the site is one step from the home page.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/" className={`group inline-flex h-12 items-center gap-2 rounded-[11px] bg-night px-5 text-body font-semibold text-[var(--theme-on-dark)] transition-colors hover:bg-[var(--theme-primary)] ${focus}`}>
                Go to the home page
                {arrow}
              </Link>
              <Link
                href="/contact"
                className={`group inline-flex h-12 items-center gap-2 rounded-[11px] px-5 text-body font-semibold text-ink shadow-[inset_0_0_0_1.5px_color-mix(in_srgb,var(--theme-ink)_26%,transparent)] transition-colors hover:bg-card ${focus}`}
              >
                Book a free inspection
                {arrow}
              </Link>
            </div>
          </div>

          {/* a pipe with a gap, and a drop falling through it */}
          <svg viewBox="0 0 360 240" role="img" aria-label="A pipe with a gap in it, and a drop of water falling through the gap" className="mx-auto w-full max-w-[26rem]">
            <defs>
              <linearGradient id="nf-pipe" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--theme-placeholder)" />
                <stop offset="0.45" stopColor="var(--theme-on-dark)" />
                <stop offset="1" stopColor="var(--theme-muted)" />
              </linearGradient>
            </defs>
            <rect x="8" y="58" width="132" height="40" rx="6" fill="url(#nf-pipe)" stroke="var(--theme-ink)" strokeOpacity="0.25" />
            <rect x="132" y="50" width="22" height="56" rx="4" fill="var(--theme-bg-alt)" stroke="var(--theme-ink)" strokeOpacity="0.3" />
            <rect x="206" y="50" width="22" height="56" rx="4" fill="var(--theme-bg-alt)" stroke="var(--theme-ink)" strokeOpacity="0.3" />
            <rect x="220" y="58" width="132" height="40" rx="6" fill="url(#nf-pipe)" stroke="var(--theme-ink)" strokeOpacity="0.25" />
            <path d="M154 78h52" stroke="var(--theme-water)" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="3 5" />
            <g className="[transform-box:fill-box] [transform-origin:50%_100%] motion-safe:animate-[nf-drop_2.2s_cubic-bezier(.55,0,.75,.4)_infinite]">
              <path d="M180 112c0 0-11 14-11 22a11 11 0 0 0 22 0c0-8-11-22-11-22z" fill="var(--theme-primary-dark)" />
              <path d="M175 136a5 5 0 0 0 5 5" fill="none" stroke="var(--theme-on-dark)" strokeWidth="2" strokeLinecap="round" />
            </g>
            <ellipse cx="180" cy="218" rx="54" ry="8" fill="var(--theme-water)" opacity="0.14" />
            <ellipse cx="180" cy="218" rx="26" ry="4" fill="var(--theme-water)" opacity="0.22" />
          </svg>
        </div>

        <nav aria-label="Popular pages" className="mt-14 md:mt-20">
          <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {PLACES.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className={`group flex h-full flex-col gap-1 rounded-[16px] bg-card p-5 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--theme-ink)_12%,transparent)] transition-shadow hover:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--theme-primary)_35%,transparent),0_18px_34px_-26px_color-mix(in_srgb,var(--theme-primary-dark)_50%,transparent)] ${focus}`}>
                  <span className="flex items-center justify-between gap-3 font-display text-sub font-semibold leading-tight">
                    {p.label}
                    {arrow}
                  </span>
                  <span className="text-body leading-snug text-mute">{p.line}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
      <Footer />
    </>
  );
}
