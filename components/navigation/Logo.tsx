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
  xs: { tile: "h-[39px] w-[39px] rounded-[9px]", mark: "h-[31px] w-[31px]", h: 26, gap: "gap-2" },
  sm: { tile: "h-[47px] w-[47px] rounded-[10px]", mark: "h-[39px] w-[39px]", h: 32, gap: "gap-2.5" },
  md: { tile: "h-[51px] w-[51px] rounded-[11px]", mark: "h-[43px] w-[43px]", h: 36, gap: "gap-3" },
  lg: { tile: "h-[59px] w-[59px] rounded-[12px]", mark: "h-[51px] w-[51px]", h: 40, gap: "gap-3.5" },
  xl: { tile: "h-[63px] w-[63px] rounded-[13px]", mark: "h-[55px] w-[55px]", h: 44, gap: "gap-3.5" },
  xxl: { tile: "h-[71px] w-[71px] rounded-[14px]", mark: "h-[63px] w-[63px]", h: 50, gap: "gap-4" },
} as const;

/**
 * The logo lockup: the cube mark and the name, drawn as one graphic (the name
 * is part of the logo, not running text, so it keeps its own proportions at
 * every size). On the dark blue of the nav bar and footer the cube sits on a
 * light tile, so its blue faces read; `tile={false}` leaves it bare. Wrap it in
 * a link or give the page its own text for the name.
 */
export function Wordmark({ className = "", size = "md", tile = true, iso = false }: { className?: string; size?: keyof typeof SIZES; tile?: boolean; iso?: boolean }) {
  const s = SIZES[size];
  // with the certification line under the name, the drawing is taller by that line
  const vh = iso ? 52 : 40;
  const h = Math.round((s.h * vh) / 40);
  const display = { fontFamily: "var(--font-logo), 'Segoe UI', system-ui, sans-serif" };
  const sans = { fontFamily: "var(--font-inter-tight), ui-sans-serif, system-ui, sans-serif" };
  return (
    <span className={`inline-flex items-center ${s.gap} ${className}`}>
      {tile ? (
        <span className={`grid shrink-0 place-items-center bg-[#f5f0e6] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4)] ${s.tile}`}>
          <LogoMark className={s.mark} />
        </span>
      ) : (
        <LogoMark className={`${s.mark} shrink-0`} />
      )}
      <svg viewBox={`0 0 150 ${vh}`} height={h} width={Math.round((s.h * 150) / 40)} aria-hidden="true" focusable="false" className="block shrink-0 overflow-visible">
        <text x="0" y="19" fill="currentColor" style={{ ...display, fontWeight: 700, fontSize: 22, letterSpacing: 2.2 }}>
          RPC
        </text>
        <text x="0.5" y="35.5" fill="currentColor" fillOpacity={0.78} style={{ ...sans, fontWeight: 600, fontSize: 10.6, letterSpacing: 3.1 }}>
          CONSTRUCTIONS
        </text>
        {iso ? (
          <text x="0.5" y="50.5" fill="currentColor" fillOpacity={0.72} style={{ ...sans, fontWeight: 600, fontSize: 9.2, letterSpacing: 1.9 }}>
            ISO 9001:2015
          </text>
        ) : null}
      </svg>
    </span>
  );
}
