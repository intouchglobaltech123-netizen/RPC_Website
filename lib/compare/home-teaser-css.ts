/** The home page products section's styles: the seam, plus its tabs and the short version (see home-teaser.ts). */
import { SEAM_CSS } from "./seam";

export const HOME_PRODUCTS_CSS =
  SEAM_CSS +
  `
.hp{display:flex;flex-direction:column;gap:.75rem;min-width:0}
.hp-tabs{display:flex;flex-wrap:wrap;gap:.4rem}
.hp-tab{height:2.6rem;padding:0 1.05rem;border-radius:999px;border:1px solid color-mix(in srgb,var(--theme-shadow) 16%,transparent);background:transparent;color:inherit;font:inherit;cursor:pointer;transition:background-color .2s ease,color .2s ease,border-color .2s ease}
.hp-tab:hover{border-color:currentColor}
.hp-tab[aria-selected=true]{background:var(--theme-dark);border-color:var(--theme-dark);color:var(--theme-on-dark)}
.hp-tab:focus-visible{outline:2px solid var(--theme-water);outline-offset:2px}
.hp-panel[hidden]{display:none}
.cx--mini{--spine:clamp(10rem,22vw,20rem)}
.cx--mini .cx-more{display:none}
.cx--mini .cx-pack svg{width:calc(var(--px,2.5rem) * .8);height:calc(var(--px,2.5rem) * .8)}
.cx--mini .cx-stage{padding:1rem 1.2rem 1rem}
.cx-pick--static{padding:.2rem 0;margin:0}
.cx-pick--static:hover{background:none}
.cx-vs{display:grid;place-items:center;width:2.5rem;height:2.5rem;border-radius:50%;border:1px solid color-mix(in srgb,var(--theme-white) 22%,transparent);color:var(--theme-muted)}
.cx--mini .cx-media{margin-top:.8rem}
.cx--mini .cx-verdict{margin-top:.7rem}
.cx--mini .cx-sheet{padding:0 1.2rem}
.cx--mini .cx-row{padding:.8rem 0}
.cx--mini .cx-foot{padding:.7rem 1.2rem .9rem}
.hp-open{display:inline-flex;align-items:center;gap:.5rem;font-weight:600;text-decoration:none;color:var(--theme-dark);border-bottom:1px solid currentColor;padding-bottom:2px}
.hp-open svg{width:14px;height:14px}
.hp-open:focus-visible{outline:2px solid var(--theme-water);outline-offset:3px}
@media (max-width:899px){
  .cx--mini{--spine:2.5rem}
  .cx--mini .cx-mid{padding-top:0}
  .cx--mini .cx-stage{padding:1rem .8rem}
  .cx--mini .cx-sheet{padding:.1rem .8rem .2rem}
  .cx-vs{width:2.2rem;height:2.2rem;margin-top:2.2rem}
}
`;
