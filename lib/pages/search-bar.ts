/**
 * A search bar for a list page: a box to type in, then one drop-down list per
 * filter, all in one white bar. The drop-downs are plain <select>s in the
 * markup; with scripts the page draws them (fancy-select.ts).
 */
import { esc } from "./kit";
import { FANCY_SELECT_CSS } from "./fancy-select";

export interface SearchFilter {
  key: string;
  label: string;
  options: readonly { value: string; text: string; disabled?: boolean }[];
}

const GLASS = `<svg class="sb-ico" viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.8" cy="8.8" r="5.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m13.2 13.2 3.6 3.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
const CROSS = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`;

export function searchBar(o: { label: string; placeholder: string; filters: readonly SearchFilter[]; cls?: string; hidden?: boolean }) {
  const filters = o.filters
    .map(
      (f) =>
        `<label class="sb-f"><span class="pg-vh">${esc(f.label)}</span><select data-sb-f="${esc(f.key)}">${f.options
          .map((x, i) => `<option value="${esc(x.value)}"${i === 0 ? " selected" : ""}${x.disabled ? " disabled" : ""}>${esc(x.text)}</option>`)
          .join("")}</select></label>`,
    )
    .join("");
  return `<div class="sb${o.cls ? ` ${o.cls}` : ""}" role="search" aria-label="${esc(o.label)}"${o.hidden ? " hidden" : ""}>
  <label class="sb-q">${GLASS}<span class="pg-vh">${esc(o.label)}</span><input type="search" data-sb-q placeholder="${esc(o.placeholder)}" autocomplete="off" enterkeyhint="search"><button type="button" class="sb-x" data-sb-clear hidden aria-label="Clear the search">${CROSS}</button></label>
  ${filters}
</div>`;
}

/**
 * The bar's look: no outer box, a row of pills. The search pill gets a 2px
 * blue ring while you type; a chosen filter is the selected state, so it wears
 * the action colour (an orange ring on a faint orange wash).
 */
export const SEARCH_BAR_CSS =
  FANCY_SELECT_CSS +
  `
.sb{display:flex;flex-wrap:wrap;align-items:center;gap:.6rem;width:100%}
.sb[hidden]{display:none}
.sb .sb-q input:focus,.sb .sb-q input:focus-visible{outline:none}
.sb-q{position:relative;display:flex;align-items:center;flex:1 1 16rem;min-width:9rem;height:3.25rem;border-radius:999px;background:var(--theme-surface);box-shadow:inset 0 0 0 1px var(--theme-line);cursor:text;transition:box-shadow .2s cubic-bezier(.2,.7,.2,1)}
.sb-q:hover{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 40%,transparent)}
.sb-q:focus-within{box-shadow:inset 0 0 0 2px var(--theme-primary)}
.sb-ico{position:absolute;left:1.15rem;width:1.15rem;height:1.15rem;color:var(--theme-muted);pointer-events:none}
.sb-q input{width:100%;height:100%;margin:0;padding:0 3rem 0 2.9rem;border:0;border-radius:999px;background:none;font:inherit;font-size:var(--fs-body);color:var(--ink,var(--theme-ink));outline:none;-webkit-appearance:none;appearance:none}
.sb-q input::placeholder{color:var(--theme-muted);opacity:1}
.sb-q input::-webkit-search-cancel-button{display:none}
.sb-x{position:absolute;right:.6rem;display:grid;place-items:center;width:2rem;height:2rem;padding:0;border:0;border-radius:50%;background:color-mix(in srgb,var(--theme-ink) 6%,transparent);color:var(--theme-ink);cursor:pointer;transition:background-color .2s,color .2s}
.sb-x[hidden]{display:none}
.sb-x:hover{background:var(--theme-action);color:var(--theme-on-action)}
.sb-x:focus-visible{outline:2px solid var(--theme-primary);outline-offset:2px}
.sb-x svg{width:.85rem;height:.85rem}
.sb-f{position:relative;display:flex;align-items:center;flex:0 0 auto;min-width:0;padding:0;border:0}
.sb-f .fs-btn .fs-n{display:none}
.sb-f select{width:100%;height:3.25rem;padding:0 1.2rem;border:0;border-radius:999px;background:var(--theme-surface);box-shadow:inset 0 0 0 1px var(--theme-line);font:inherit;font-size:var(--fs-body);font-weight:600;color:var(--ink,var(--theme-ink))}
.sb-f .fs{width:100%}
.sb-f .fs-btn{min-width:11rem}
.sb-f.is-set .fs-btn{box-shadow:inset 0 0 0 1.5px var(--theme-action);background:color-mix(in srgb,var(--theme-action) 10%,var(--theme-surface));color:var(--ink,var(--theme-ink))}
.sb-f.is-set .fs-btn[aria-expanded=true]{box-shadow:inset 0 0 0 2px var(--theme-primary)}
.sb-f.is-set .fs-chev{color:var(--theme-ink)}
.fs-opt[aria-disabled=true]{opacity:.4;cursor:default}
.fs-opt[aria-disabled=true].is-active{background:none}
@media (max-width:599px){
  .sb-q{flex-basis:100%}
  .sb-f{flex:1 1 0}
  .sb-f .fs-btn{min-width:0}
}
@media (prefers-reduced-motion:reduce){.sb-q,.sb-x{transition:none}}
`;
