/**
 * The jobs RPC's products are most used for, for the strip at the top of the
 * products page. Each one picks its products from what the product list says
 * about them (their family and the areas they are used in), so nothing is
 * added to the list: a product shows under a job only when the list names
 * that kind of place for it.
 */
import type { Product } from "./types";

export interface Application {
  key: string;
  label: string;
  /** does the product list name this job for the product? */
  has: (p: Product) => boolean;
  /** a small line drawing of the job (inner SVG, 120 × 72, drawn in currentColor) */
  art: string;
}

const areas = (p: Product) => p.areas.toLowerCase();
const any = (p: Product, ...words: string[]) => words.some((w) => areas(p).includes(w));

export const APPLICATIONS: readonly Application[] = [
  {
    key: "terrace",
    label: "Terraces and roofs",
    has: (p) => p.family === "waterproofing" && any(p, "terrace", "roof"),
    art: `<path d="M14 62V30h70v32z" class="pa-f"/><path d="M14 62V30h70v32"/><path d="M10 30h78"/><path d="M10 30v-5h4v5M84 30v-5h4v5"/><path d="M14 25h70" class="pa-hi"/><path d="M30 62V44h12v18M54 44h16v10H54z"/><path d="M96 6l-4 10M104 10l-4 10M100 22l-4 10M110 22l-3 8" class="pa-rain"/>`,
  },
  {
    key: "bathroom",
    label: "Bathrooms and wet areas",
    has: (p) => any(p, "bathroom", "wet area"),
    art: `<path d="M12 50h96v14H12z" class="pa-f"/><path d="M12 8h96v56H12z"/><path d="M12 22h96M12 36h96M12 50h96M36 8v56M60 8v56M84 8v56" class="pa-thin"/><path d="M28 64h64" class="pa-hi"/><path d="M76 10v8h8"/><circle cx="84" cy="21" r="3"/><path d="M82 27l-2 5M86 27l-1 6M90 26l1 5" class="pa-rain"/><ellipse cx="60" cy="60" rx="7" ry="2"/>`,
  },
  {
    key: "tank",
    label: "Water tanks and sumps",
    has: (p) => any(p, "tank"),
    art: `<path d="M6 30h24v36h60V30h24v40H6z" class="pa-f"/><path d="M30 46c6-3 10 3 15 0s10-3 15 0 10 3 15 0 10-3 15 0v18H30z" class="pa-w"/><path d="M6 30h108"/><path d="M30 30v34h60V30" /><path d="M30 64h60" class="pa-hi"/><path d="M30 46c6-3 10 3 15 0s10-3 15 0 10 3 15 0 10-3 15 0" class="pa-rain"/><path d="M50 30v-8h20v8"/><path d="M8 30l6-6M20 30l6-6M96 30l6-6M108 30l6-6" class="pa-thin"/>`,
  },
  {
    key: "basement",
    label: "Basements and foundations",
    has: (p) => any(p, "basement", "foundation"),
    art: `<path d="M4 24h18v44h76V24h18v46H4z" class="pa-f"/><path d="M4 24h112" /><path d="M24 24V8h72v16"/><path d="M24 24v40h72V24"/><path d="M22 24v42h76V24" class="pa-hi"/><path d="M8 44h8M8 54h8M104 44h8M104 54h8M54 70v-3M66 70v-3" class="pa-rain"/><path d="M12 41l4 3-4 3M108 41l-4 3 4 3" class="pa-rain"/>`,
  },
  {
    key: "concrete",
    label: "Ready-mix and site concrete",
    has: (p) => p.family === "admixtures" && any(p, "rmc", "pumped", "concrete"),
    art: `<path d="M46 52l10-24c2-4 6-6 10-6h20c6 0 10 4 10 10v8c0 6-4 10-10 10H52z" class="pa-f"/><path d="M8 56h104"/><path d="M14 56V36h18l6 8v12"/><path d="M38 44h8"/><path d="M46 52l10-24c2-4 6-6 10-6h20c6 0 10 4 10 10v8c0 6-4 10-10 10H52" /><path d="M58 32l30 0M54 42l38 0" class="pa-thin"/><circle cx="26" cy="58" r="5"/><circle cx="66" cy="58" r="5"/><circle cx="90" cy="58" r="5"/><path d="M98 44l10 8" class="pa-hi"/>`,
  },
  {
    key: "tiling",
    label: "Tiling floors and walls",
    has: (p) => p.family === "tiling",
    art: `<path d="M10 62L30 34h80L90 62z" class="pa-f"/><path d="M50 34h20l-7 14H43zM63 48h20l-7 14H56z" class="pa-w"/><path d="M10 62L30 34h80L90 62z"/><path d="M50 34L36 62M70 34L56 62M90 34L76 62M20 48h80" class="pa-thin"/><path d="M14 8h40v20H14z" class="pa-hi"/><path d="M54 18h10v4h8" /><path d="M14 28l4 3 4-3 4 3 4-3 4 3 4-3 4 3 4-3 4 3" class="pa-thin"/>`,
  },
  {
    key: "repair",
    label: "Concrete repair",
    has: (p) => p.family === "repair" || (p.family === "bonding" && any(p, "repair")),
    art: `<path d="M40 6h40v60H40z" class="pa-f"/><path d="M48 22c6-2 12 2 18-1 4 4 2 10 6 14-4 6-12 4-18 8-4-6-8-14-6-21z" class="pa-w"/><path d="M40 6v60M80 6v60"/><path d="M34 6h52M34 66h52"/><path d="M48 22c6-2 12 2 18-1 4 4 2 10 6 14-4 6-12 4-18 8-4-6-8-14-6-21z" class="pa-hi"/><path d="M52 18v32M60 18v32M68 18v32" class="pa-thin"/><path d="M96 30l14-8M96 40h16M96 50l14 8" class="pa-rain"/>`,
  },
];

/** the products for each job, in the list's order */
export function applicationsFor(products: readonly Product[]) {
  return APPLICATIONS.map((a) => ({ ...a, products: products.filter(a.has) })).filter((a) => a.products.length > 0);
}

/**
 * Which of these jobs a project's waterproofing takes in, read from the list
 * of what was built into it ("PU terrace membrane · Pond-tested wet areas"):
 * only what the list names.
 */
const IN_PROJECT: Readonly<Record<string, RegExp>> = {
  terrace: /terrace|roof|podium/i,
  bathroom: /bathroom|wet area/i,
  tank: /\btank|sump/i,
  basement: /basement|raft|plinth|foundation/i,
  concrete: /admixture|trimix|concrete floor/i,
  tiling: /tile|grout/i,
  repair: /repair|injection/i,
};
export const projectJobs = (waterproofing: string) => APPLICATIONS.filter((a) => IN_PROJECT[a.key]?.test(waterproofing)).map((a) => a.key);

/** the navy band of small drawings, one per job */
export const APPLICATIONS_CSS = `
/* the applications: a navy band of small drawings, one per job */
.pa-sec{padding:clamp(1.4rem,4vh,2.4rem) 0 0}
.pa{padding:clamp(1.3rem,2.6vw,2rem);border-radius:18px;background:var(--navy);color:#f5f0e6}
.pa-top{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:.4rem 2rem}
.pa-h{margin:0;font-family:var(--display);font-size:var(--fs-sub);font-weight:600;letter-spacing:-.01em;color:#fff}
.pa-line{margin:0;max-width:34rem;font-size:var(--fs-body);line-height:1.5;color:rgba(245,240,230,.7)}
.pa-row{display:grid;grid-template-columns:repeat(var(--n,7),minmax(0,1fr));gap:.7rem;margin:1.2rem 0 0;padding:0;list-style:none}
.pa-tile{display:flex;flex-direction:column;align-items:flex-start;width:100%;height:100%;padding:0;border:0;background:none;font:inherit;color:inherit;text-align:left;cursor:pointer}
.pa-art{display:grid;place-items:center;width:100%;aspect-ratio:5/3;border-radius:12px;background:rgba(255,255,255,.06);box-shadow:inset 0 0 0 1px rgba(255,255,255,.12);color:rgba(245,240,230,.85);transition:background-color .25s,box-shadow .25s,color .25s}
.pa-art svg{width:86%;height:auto;overflow:visible}
.pa-art .pa-f{fill:currentColor;fill-opacity:.1;stroke:none}
.pa-art .pa-w{fill:#9ec3ef;fill-opacity:.32;stroke:none}
.pa-art .pa-thin{stroke-width:1;opacity:.55}
.pa-art .pa-hi{stroke:#7cc4d3;stroke-width:2.6}
.pa-art .pa-rain{stroke:#9ec3ef}
.pa-name{margin-top:.6rem;font-size:var(--fs-body);font-weight:600;line-height:1.3;color:#fff}
.pa-n{margin-top:.15rem;font-size:var(--fs-body);color:rgba(245,240,230,.6)}
.pa-tile:hover .pa-art{background:rgba(255,255,255,.11);box-shadow:inset 0 0 0 1px rgba(255,255,255,.3)}
.pa-tile:focus-visible{outline:2px solid #f5f0e6;outline-offset:4px;border-radius:12px}
.pa-tile[aria-pressed=true] .pa-art{background:#f5f0e6;box-shadow:none;color:var(--navy)}
.pa-tile[aria-pressed=true] .pa-art .pa-hi{stroke:var(--water)}
.pa-tile[aria-pressed=true] .pa-art .pa-rain{stroke:var(--accent)}
.pa-tile[aria-pressed=true] .pa-art .pa-w{fill:var(--accent);fill-opacity:.25}
.pa-tile[aria-pressed=true] .pa-n{color:#9ec3ef}
@media (prefers-reduced-motion:no-preference){.pa-tile:hover .pa-rain{animation:pa-fall 1.2s linear infinite}}
@keyframes pa-fall{from{transform:translateY(-3px);opacity:.4}to{transform:translateY(3px);opacity:1}}
@media (max-width:1100px){
  .pa-row{display:flex;gap:.7rem;margin-inline:calc(clamp(1.3rem,2.6vw,2rem) * -1);padding:0 clamp(1.3rem,2.6vw,2rem) .2rem;overflow-x:auto;scroll-snap-type:x proximity;scroll-padding-inline:clamp(1.3rem,2.6vw,2rem);scrollbar-width:none}
  .pa-row::-webkit-scrollbar{display:none}
  .pa-row li{flex:none;width:9.5rem;scroll-snap-align:start}
}
`;
