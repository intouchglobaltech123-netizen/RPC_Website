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

export const SEARCH_BAR_CSS =
  FANCY_SELECT_CSS +
  `
.sb{display:flex;align-items:stretch;width:100%;min-height:3rem;border-radius:12px;background:var(--theme-white);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 14%,transparent);transition:box-shadow .2s}
.sb[hidden]{display:none}
.sb:focus-within{box-shadow:inset 0 0 0 1.5px var(--navy),0 0 0 3px color-mix(in srgb,var(--theme-primary) 10%,transparent)}
.sb .sb-q input:focus,.sb .sb-q input:focus-visible{outline:none}
.sb-q{position:relative;display:flex;align-items:center;flex:1 1 10rem;min-width:9rem;cursor:text}
.sb-ico{position:absolute;left:1rem;width:1.15rem;height:1.15rem;color:var(--mute);pointer-events:none}
.sb-q input{width:100%;height:100%;min-height:3rem;margin:0;padding:0 2.6rem 0 2.75rem;border:0;border-radius:12px;background:none;font:inherit;font-size:var(--fs-body);color:var(--ink);outline:none;-webkit-appearance:none;appearance:none}
.sb-q input::placeholder{color:var(--mute);opacity:1}
.sb-q input::-webkit-search-cancel-button{display:none}
.sb-x{position:absolute;right:.55rem;display:grid;place-items:center;width:1.9rem;height:1.9rem;padding:0;border:0;border-radius:50%;background:color-mix(in srgb,var(--theme-ink) 6%,transparent);color:var(--ink);cursor:pointer}
.sb-x[hidden]{display:none}
.sb-x:hover{background:color-mix(in srgb,var(--theme-ink) 12%,transparent)}
.sb-x svg{width:.85rem;height:.85rem}
.sb-f{position:relative;display:flex;align-items:center;flex:0 0 auto;min-width:0;padding:.3rem;border-left:1px solid color-mix(in srgb,var(--theme-ink) 10%,transparent)}
.sb-f .fs-btn .fs-n{display:none}
.sb-f select{width:100%;height:2.5rem;padding:0 .8rem;border:0;background:none;font:inherit;font-size:var(--fs-body);font-weight:600;color:var(--ink)}
.sb-f .fs{width:100%}
.sb-f .fs-btn{gap:.6rem;min-height:2.4rem;padding:.3rem .75rem;border-radius:8px;background:none;box-shadow:none;font-weight:500}
.sb-f .fs-btn:hover{background:color-mix(in srgb,var(--theme-ink) 5%,transparent);box-shadow:none}
.sb-f .fs-btn[aria-expanded=true]{background:color-mix(in srgb,var(--theme-primary) 8%,transparent);box-shadow:none}
.sb-f.is-set .fs-btn{color:var(--accent)}
.fs-opt[aria-disabled=true]{opacity:.4;cursor:default}
.fs-opt[aria-disabled=true].is-active{background:none}
@media (max-width:599px){
  .sb{flex-wrap:wrap}
  .sb-q{flex-basis:100%}
  .sb-f{flex:1 1 0;border-left:0;border-top:1px solid color-mix(in srgb,var(--theme-ink) 10%,transparent)}
  .sb-f + .sb-f{border-left:1px solid color-mix(in srgb,var(--theme-ink) 10%,transparent)}
}
`;
