"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ArrowLink } from "@/components/ui/Primitives";
import { contact } from "@/lib/content";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { sceneState } from "@/lib/three/store";

/** The film's last shot: the finished building at dusk, camera pulling away. */
export function FinalCTA() {
  const root = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const im = imageRef.current;
    const tt = title.current;
    if (!el) return;
    if (window.matchMedia("(max-width: 767px)").matches) {
      // phones: no scroll zoom — the photo and title are simply there
      if (tt) { tt.style.opacity = "1"; tt.style.transform = "none"; }
      if (im) im.style.transform = "none";
      return;
    }

    let active = false;
    let targetScale = 1.38;
    let currentScale = 1.38;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "top top",
      scrub: 0.6,
      onToggle: (self) => { active = self.isActive; },
      onUpdate: (self) => {
        const p = self.progress;
        // Dramatic camera pull away: zoom out from 1.38 to 1.00 as you scroll down;
        // smoothly zooms back in from 1.00 to 1.38 as you scroll back up!
        targetScale = 1.38 - p * 0.38;

        if (tt) {
          const o = Math.min(1, Math.max(0, (p - 0.18) / 0.35));
          tt.style.opacity = String(o);
          tt.style.transform = `translate3d(0, ${(1 - o) * 45}px, 0)`;
        }
      },
    });

    // Weighted camera motion: smooth zoom interpolation + pointer depth parallax
    const fine = window.matchMedia("(pointer: fine)").matches;
    const tick = () => {
      if (!im || !active) return;
      currentScale += (targetScale - currentScale) * 0.12;
      const { x, y } = fine ? sceneState.pointerDamped : { x: 0, y: 0 };
      im.style.transform = `translate3d(${-x * 18}px, ${-y * 12}px, 0) scale(${currentScale.toFixed(4)})`;
    };
    gsap.ticker.add(tick);

    return () => {
      st.kill();
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <section ref={root} id="contact-cta" aria-label="Start a project" className="relative z-10 min-h-[100svh] text-paper md:h-[100svh] md:min-h-[640px]">
      <div className="cta-frame relative min-h-[100svh] overflow-hidden bg-night md:h-full md:min-h-0">
        {/* Photorealistic architectural dusk rendering with dynamic zoom in / zoom out */}
        <div ref={imageRef} className="cta-media absolute inset-0 will-change-transform origin-center">
          <Image
            src="/images/final-cta-dusk.jpg"
            alt="Completed RPC building in late-afternoon light"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Cinematic gradient overlays for contrast and typography legibility */}
        <div aria-hidden className="absolute inset-0 hidden bg-gradient-to-t from-black/80 via-black/20 to-black/35 md:block" />
        <div aria-hidden className="cta-fade absolute inset-x-0 top-0 hidden h-28 bg-gradient-to-b from-black/45 to-transparent" />
        <div aria-hidden className="cta-shade absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-black/90 to-transparent" />

        {/* Content */}
        <div
          ref={title}
          className="cta-content gutter relative flex min-h-[100svh] flex-col justify-end pb-10 pt-28 will-change-transform md:h-full md:min-h-0 md:pb-16 md:pt-0"
          style={{ opacity: 0 }}
        >
          <div className="flex items-center gap-3 mb-6 text-paper/80">
            <span className="font-semibold tabular-nums text-white">05</span>
            <span className="h-px w-8 bg-current opacity-35" />
            <span className="text-paper/85">Contact us</span>
          </div>

          <h2 className="display text-5xl sm:text-6xl md:text-7xl lg:text-[clamp(3.2rem,5.5vw,5.5rem)] leading-[1.1] tracking-[-0.02em] font-semibold text-paper">
            Let&rsquo;s build<br />
            <em className="text-white">what&rsquo;s next.</em>
          </h2>

          <div className="mt-10 grid items-end gap-8 md:mt-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="mb-6 max-w-sm text-base leading-relaxed text-paper/80">
                Tell us about your site, brief or leakage problem — an engineer will call you back within one working day.
              </p>
              <ArrowLink href="/contact#enquiry" variant="light">
                Start a project
              </ArrowLink>
            </div>
            <ul className="grid grid-cols-4 gap-2 sm:grid-cols-2 sm:gap-2.5 lg:col-span-7 lg:col-start-6">
              {[
                { icon: Phone, label: "Call", value: contact.phone, href: `tel:${contact.phone.replace(/[^0-9+]/g, "")}` },
                { icon: MessageCircle, label: "WhatsApp", value: "Chat with us", href: contact.whatsapp },
                { icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}` },
                { icon: MapPin, label: "Visit", value: "Kurikaran Palayam, Erode", href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.mapQuery)}` },
              ].map(({ icon: Icon, label, value, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex h-full flex-col items-center gap-1.5 rounded-2xl border border-white/15 bg-white/[0.06] px-1 py-3 backdrop-blur-md sm:flex-row sm:gap-3 sm:rounded-full sm:py-2 sm:pl-2 sm:pr-4 transition-colors duration-500 hover:border-white/40 hover:bg-white/[0.12]"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-paper">
                      <Icon size={15} strokeWidth={1.6} />
                    </span>
                    <span className="min-w-0 text-center leading-tight sm:flex-1 sm:text-left">
                      <span className="block text-body uppercase tracking-[0.12em] text-paper/80 sm:tracking-[0.2em] sm:text-paper/50">{label}</span>
                      <span className="hidden truncate text-body text-paper sm:block">{value}</span>
                    </span>
                    <ArrowUpRight size={14} className="hidden shrink-0 text-paper/50 sm:block lg:hidden xl:block transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-paper" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
