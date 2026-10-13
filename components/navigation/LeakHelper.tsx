"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { contact } from "@/lib/content";

/** pages with their own ways to reach us, or no place for it */
const HIDE = ["/contact", "/studio", "/classic", "/v2", "/v3"];
/** what people see, in their words (the home page's opening uses the same four in the middle) */
const SIGNS = ["Terrace or roof leak", "Ceiling stain", "Bathroom leak", "Damp wall", "Sump or tank leak", "Something else"] as const;
const tel = `tel:${contact.phone.replace(/[^0-9+]/g, "")}`;
const ease = [0.22, 1, 0.36, 1] as const;

const WhatsApp = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className}>
    <path
      fill="currentColor"
      d="M12 2.2a9.7 9.7 0 0 0-8.35 14.65L2.3 21.7l4.98-1.3A9.7 9.7 0 1 0 12 2.2zm0 17.7a8 8 0 0 1-4.08-1.12l-.3-.17-2.95.77.79-2.88-.19-.3A8 8 0 1 1 12 19.9zm4.4-5.97c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06a6.6 6.6 0 0 1-1.94-1.2 7.3 7.3 0 0 1-1.34-1.67c-.14-.24 0-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46a.88.88 0 0 0-.64.3 2.7 2.7 0 0 0-.84 2c0 1.18.86 2.32.98 2.48.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.1.16 1.52.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"
    />
  </svg>
);

/**
 * A small helper in the bottom corner of every page (once the opening screen
 * has been passed; not on the contact page, and out of the way of the footer):
 * "Ask an engineer" opens a card
 * that asks what you are seeing (a terrace leak, a ceiling stain, a damp wall
 * and so on) and sends it to RPC on WhatsApp in one message, ready for you to
 * add where the building is. There is a call link too.
 */
export function LeakHelper() {
  const pathname = usePathname() ?? "/";
  const hidden = HIDE.some((h) => pathname === h || pathname.startsWith(`${h}/`));
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const [sign, setSign] = useState<string | null>(null);
  const button = useRef<HTMLButtonElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // it comes in once the opening screen (on the home page, the whole opening story) has been scrolled past
  useEffect(() => {
    setOpen(false);
    if (hidden) return;
    let raf = 0;
    const check = () => {
      raf = 0;
      const hero = document.querySelector<HTMLElement>("section.mh");
      const past = hero ? hero.getBoundingClientRect().bottom < window.innerHeight * 0.6 : window.scrollY > window.innerHeight * 0.75;
      // the footer has every way to reach us, so the helper steps aside for it
      const foot = document.querySelector<HTMLElement>("[data-site-footer]");
      const atFoot = foot ? foot.getBoundingClientRect().top < window.innerHeight - 24 : false;
      // the products page's rate list uses the foot of the screen while it has products in it
      const list = document.documentElement.dataset.ratelist === "1";
      setShown(past && !atFoot && !list);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("rpc:ratelist", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("rpc:ratelist", onScroll);
    };
  }, [pathname, hidden]);

  // Escape or a click elsewhere closes the card, and the focus goes back to the button
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (card.current?.contains(t) || button.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    card.current?.querySelector<HTMLElement>("input")?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  if (hidden) return null;
  const text = ["Hello RPC Constructions, I'd like a free inspection.", sign ? `What I see: ${sign}.` : "", "Where: "].filter(Boolean).join("\n");
  const href = `${contact.whatsapp}?text=${encodeURIComponent(text)}`;
  const visible = shown || open;
  const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rpc";

  return (
    <div
      className="pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[var(--gutter)] z-[35] flex flex-col items-end gap-3 transition-[opacity,transform] duration-500 ease-[var(--ease-film)]"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(16px)" }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            ref={card}
            role="dialog"
            aria-labelledby={titleId}
            className="pointer-events-auto w-[min(21.5rem,calc(100vw_-_2*var(--gutter)))] origin-bottom-right overflow-hidden rounded-[18px] bg-[var(--theme-surface)] text-ink shadow-[0_30px_60px_-28px_color-mix(in_srgb,var(--theme-shadow)_65%,transparent),0_0_0_1px_color-mix(in_srgb,var(--theme-ink)_10%,transparent)]"
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.35, ease }}
          >
            <div className="flex items-start justify-between gap-3 bg-night px-5 pb-4 pt-[1.1rem] text-[var(--theme-on-dark)]">
              <div>
                <p id={titleId} className="m-0 font-display text-sub font-semibold leading-tight">
                  What are you seeing?
                </p>
                <p className="m-0 mt-1 text-body leading-snug text-white/70">Pick one and send it to us on WhatsApp. The inspection is free.</p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => {
                  setOpen(false);
                  button.current?.focus();
                }}
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-white/[0.08] text-white transition-colors hover:bg-white/[0.16] ${focus}`}
              >
                <X size={16} aria-hidden />
              </button>
            </div>
            <fieldset className="m-0 border-0 px-5 pt-4">
              <legend className="sr-only">What are you seeing?</legend>
              <div className="flex flex-wrap gap-2">
                {SIGNS.map((s) => (
                  <label key={s} className="cursor-pointer">
                    <input type="radio" name="leak-sign" value={s} checked={sign === s} onChange={() => setSign(s)} className="peer sr-only" />
                    <span className="inline-flex h-9 items-center rounded-[9px] bg-[var(--theme-bg)] px-3 text-body font-medium shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--theme-ink)_14%,transparent)] transition-colors peer-checked:bg-night peer-checked:text-[var(--theme-on-dark)] peer-checked:shadow-none peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-water hover:bg-[var(--theme-bg-alt)]">
                      {s}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="grid gap-2 px-5 pb-5 pt-4">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex h-11 items-center justify-center gap-2 rounded-[11px] bg-[var(--theme-whatsapp)] px-4 text-body font-semibold text-[var(--theme-on-whatsapp)] transition-colors hover:bg-[var(--theme-whatsapp-hover)] ${focus}`}
              >
                <WhatsApp className="h-[18px] w-[18px]" />
                Send on WhatsApp
              </a>
              <a href={tel} className={`inline-flex h-10 items-center justify-center gap-2 rounded-[11px] text-body font-semibold text-ink transition-colors hover:bg-[var(--theme-bg)] ${focus}`}>
                <Phone size={15} aria-hidden className="text-water" />
                Or call {contact.phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        tabIndex={visible ? 0 : -1}
        onClick={() => setOpen((o) => !o)}
        className={`pointer-events-auto inline-flex h-11 items-center rounded-full bg-night px-5 text-body font-semibold text-[var(--theme-on-dark)] shadow-[0_18px_36px_-16px_color-mix(in_srgb,var(--theme-shadow)_75%,transparent)] ring-1 ring-white/[0.08] transition-colors hover:bg-[var(--theme-primary)] sm:h-12 sm:px-6 ${focus}`}
        style={{ pointerEvents: visible ? "auto" : "none" }}
      >
        {open ? "Close" : "Ask an engineer"}
      </button>
    </div>
  );
}
