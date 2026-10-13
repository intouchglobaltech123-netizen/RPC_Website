import Image from "next/image";
import logoImg from "@/components/ui/logo.png";

/**
 * Official RPC cube mark.
 */
export function LogoMark({ className = "", title = "RPC Constructions" }: { className?: string; title?: string }) {
  return (
    <Image
      src={logoImg}
      alt={title}
      width={128}
      height={128}
      className={`object-contain ${className}`}
      priority
    />
  );
}

const SIZES = {
  xs: { tile: "h-9 w-9 rounded-[9px]", mark: "h-7 w-7", h: 26, gap: "gap-2" },
  sm: { tile: "h-11 w-11 rounded-[10px]", mark: "h-9 w-9", h: 32, gap: "gap-2.5" },
  md: { tile: "h-12 w-12 rounded-[11px]", mark: "h-10 w-10", h: 36, gap: "gap-3" },
  lg: { tile: "h-14 w-14 rounded-[12px]", mark: "h-12 w-12", h: 40, gap: "gap-3.5" },
  xl: { tile: "h-[60px] w-[60px] rounded-[13px]", mark: "h-[52px] w-[52px]", h: 44, gap: "gap-3.5" },
} as const;

/**
 * The logo lockup: the cube mark and the name, drawn as one graphic (the name
 * is part of the logo, not running text, so it keeps its own proportions at
 * every size). On the dark blue of the nav bar and footer the cube sits on a
 * light tile, so its blue faces read; `tile={false}` leaves it bare. Wrap it in
 * a link or give the page its own text for the name.
 */
export function Wordmark({ className = "", size = "md", tile = true }: { className?: string; size?: keyof typeof SIZES; tile?: boolean }) {
  const s = SIZES[size];
  const display = { fontFamily: "var(--font-logo), 'Segoe UI', system-ui, sans-serif" };
  const sans = { fontFamily: "var(--font-inter-tight), ui-sans-serif, system-ui, sans-serif" };
  return (
    <span className={`inline-flex items-center ${s.gap} ${className}`}>
      {tile ? (
        <span className={`grid shrink-0 place-items-center bg-[var(--theme-surface)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--theme-white)_40%,transparent)] ${s.tile}`}>
          <LogoMark className={s.mark} />
        </span>
      ) : (
        <LogoMark className={`${s.mark} shrink-0`} />
      )}
      <svg viewBox="0 0 150 40" height={s.h} width={Math.round((s.h * 150) / 40)} aria-hidden="true" focusable="false" className="block shrink-0 overflow-visible">
        <text x="0" y="19" fill="currentColor" style={{ ...display, fontWeight: 700, fontSize: 22, letterSpacing: 2.2 }}>
          RPC
        </text>
        <text x="0.5" y="35.5" fill="currentColor" fillOpacity={0.78} style={{ ...sans, fontWeight: 600, fontSize: 10.6, letterSpacing: 3.1 }}>
          CONSTRUCTIONS
        </text>
      </svg>
    </span>
  );
}
