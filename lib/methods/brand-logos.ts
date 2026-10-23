import { BRAND_SPECIALITY } from "./doc";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** the brands on RPC's product list, for marking them among the document's brands */
const STOCKED = ["Fosroc", "Sika", "Berger"];
const stocked = (b: string) => STOCKED.some((s) => b.toLowerCase().startsWith(s.toLowerCase()));

/** the document's brands, those on our list first (otherwise in the document's order) */
export const BRANDS = [...BRAND_SPECIALITY].sort((x, y) => Number(stocked(y.brand)) - Number(stocked(x.brand)));

/**
 * Brand logos for the moving strip of brands on the waterproofing and products pages, by
 * the brand's name as the strip shows it. The files (RPC's own copies) are in
 * public/images/brands/. A brand without a logo here shows its name instead.
 */
export const BRAND_LOGOS: Readonly<Record<string, string>> = {
  Fosroc: "fosroc.png",
  Sika: "sika.png",
  "Dr. Fixit": "dr-fixit.png",
  "Asian Paints SmartCare": "asian-paints.png",
  "ARDEX ENDURA": "ardex-endura.png",
  "MYK Schomburg": "myk-arment.png",
  Mapei: "mapei.png",
  "STP Limited": "stp.png",
  Sunanda: "sunanda.png",
  Penetron: "penetron.png",
  "MC-Bauchemie": "mc-bauchemie.png",
  Kryton: "kryton.png",
  "Berger HomeShield": "berger-homeshield.png",
  /** the products list's Berger products are its HomeShield range */
  Berger: "berger-homeshield.png",
  Renacon: "renacon.png",
  CCI: "cci.svg",
};

/** Render the 2x duplicate track for infinite smooth scroll; `skip` leaves brands out */
export function brandsMarqueeTrack(skip: readonly string[] = []) {
  const shown = BRANDS.filter((b) => !skip.includes(b.brand));
  return [0, 1]
    .map((copy) =>
      shown.map((b) => {
        const logo = BRAND_LOGOS[b.brand];
        return `<li class="wp-btile${logo ? "" : " wp-btile--name"}"${copy ? ` aria-hidden="true"` : ""}>${
          logo
            ? `<img src="/images/brands/${esc(logo)}" alt="${copy ? "" : esc(b.brand)}" loading="lazy" decoding="async">`
            : `<span class="wp-bname">${esc(b.brand)}</span>`
        }</li>`;
      }).join("")
    )
    .join("");
}

/** the methods guide's brands taken off the home page's brand slide (and so off the products page's brand filter) */
export const OFF_SLIDE = ["Sunanda", "MC-Bauchemie", "CICO", "Perma", "Kryton"];
/** two names for one brand (Berger and Berger HomeShield) */
const sameBrand = (a: string, b: string) => a.toLowerCase().startsWith(b.toLowerCase()) || b.toLowerCase().startsWith(a.toLowerCase());
/** the brand slide's brands that are not among `listed` (the product list's): the methods guide's, in its order */
export const otherBrands = (listed: readonly string[]) =>
  BRANDS.map((b) => b.brand).filter((n) => !OFF_SLIDE.includes(n) && !listed.some((l) => sameBrand(l, n)));

/** a strip of the given brands, in their order: the logo where RPC has one, otherwise the name in `color` (only the first round is read out) */
export function brandsMarqueeOf(brands: readonly { name: string; color?: string }[]) {
  // a short list is repeated so one pass of the strip is wider than the widest screen
  const times = Math.max(1, Math.ceil(12 / Math.max(1, brands.length)));
  const track = Array.from({ length: times * 2 }, (_, i) => i)
    .map((copy) =>
      brands
        .map((b) => {
          const logo = BRAND_LOGOS[b.name];
          return `<li class="wp-btile${logo ? "" : " wp-btile--name"}"${copy ? ` aria-hidden="true"` : ""}>${
            logo
              ? `<img src="/images/brands/${esc(logo)}" alt="${copy ? "" : esc(b.name)}" loading="lazy" decoding="async">`
              : `<span class="wp-bname"${b.color ? ` style="color:${esc(b.color)}"` : ""}>${esc(b.name)}</span>`
          }</li>`;
        })
        .join(""),
    )
    .join("");
  return `<div class="wp-marq" role="region" aria-label="The brands, moving slowly; hover to pause">
    <ul class="wp-mtrack">${track}</ul>
  </div>`;
}

/** Complete brand marquee container */
export function brandsMarqueeHtml(skip: readonly string[] = []) {
  return `<div class="wp-marq" role="region" aria-label="The brands, moving slowly; hover to pause">
    <ul class="wp-mtrack">${brandsMarqueeTrack(skip)}</ul>
  </div>`;
}

export const BRANDS_MARQUEE_CSS = `
/* brands: tiles moving slowly left to right; hover or focus pauses them */
.wp-marq{margin-inline:calc(-1 * var(--gutter,16px));overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.wp-mtrack{display:flex;gap:.9rem;width:max-content;margin:0;padding:.4rem 0;list-style:none;animation:wp-marq 70s linear infinite}
.wp-marq:hover .wp-mtrack,.wp-marq:focus-within .wp-mtrack{animation-play-state:paused}
@keyframes wp-marq{from{transform:translateX(-50%)}to{transform:translateX(0)}}
.wp-btile{display:grid;place-items:center;flex:none;width:12.5rem;height:6rem;box-sizing:border-box;padding:.9rem 1.4rem;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 1px var(--line)}
.wp-btile img{display:block;width:auto;height:auto;max-width:100%;max-height:4rem;object-fit:contain}
.wp-bname{font-family:var(--font-heading,var(--font-inter-tight,var(--display))),sans-serif;font-weight:600;font-size:var(--fs-sub);line-height:1.2;letter-spacing:-.01em;color:var(--ink);text-align:center}
@media (prefers-reduced-motion:reduce){
  .wp-marq{margin-inline:0;-webkit-mask-image:none;mask-image:none}
  .wp-mtrack{flex-wrap:wrap;width:auto;animation:none}
  .wp-mtrack li[aria-hidden]{display:none}
}
@media (max-width:767px){
  .wp-btile{width:10.5rem;height:5.2rem;padding:.8rem 1.1rem}
  .wp-btile img{max-height:3.4rem}
}
`;

