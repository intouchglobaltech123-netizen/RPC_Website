/**
 * The brand list used by the products page's comparison: a button with the
 * brand's logo and name, and a list that opens under it, every brand with its
 * logo (or its initials on its colour) and how many products it has for the
 * job. Shared by the page (markup, on the server) and the browser (wiring).
 */
import { esc } from "./kit";

export interface CmpBrand {
  name: string;
  /** the logo's file in /images/brands, when RPC has one */
  logo?: string;
  color: string;
  /** its products for the job */
  count: number;
}

const CHEV = `<svg class="bc-chev" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const initials = (s: string) =>
  s
    .replace(/[^A-Za-z0-9 ]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
const plural = (n: number, one: string) => `${n} ${n === 1 ? one : `${one}s`}`;

/** a brand as its logo, or its initials on its colour */
export const brandFace = (b: CmpBrand) =>
  `<span class="bc-face${b.logo ? "" : " bc-face--txt"}" style="--c:${b.color}">${b.logo ? `<img src="/images/brands/${esc(b.logo)}" alt="" loading="lazy" decoding="async">` : esc(initials(b.name))}</span>`;

/** one brand list: `id` keeps its parts apart from the other lists on the page; `hide` is a brand it does not offer */
export function brandDropdown(id: string, label: string, brands: readonly CmpBrand[], sel: string, hide?: string) {
  const cur = brands.find((x) => x.name === sel) ?? brands[0]!;
  return `<div class="bc-dd" data-dd="${esc(id)}">
    <span class="bc-k" id="${esc(id)}-k">${esc(label)}</span>
    <button type="button" class="bc-btn" aria-haspopup="listbox" aria-expanded="false" aria-controls="${esc(id)}-list" aria-labelledby="${esc(id)}-k ${esc(id)}-cur">
      <span class="bc-cur" id="${esc(id)}-cur">${brandFace(cur)}<b>${esc(cur.name)}</b></span>${CHEV}
    </button>
    <ul class="bc-list" id="${esc(id)}-list" role="listbox" aria-labelledby="${esc(id)}-k" tabindex="-1" hidden>${brands
      .map(
        (x) =>
          `<li role="option" tabindex="-1" data-brand="${esc(x.name)}" aria-selected="${x.name === cur.name}"${x.name === hide ? " hidden" : ""}>${brandFace(x)}<b>${esc(x.name)}</b><span class="bc-meta">${plural(x.count, "product")}</span></li>`,
      )
      .join("")}</ul>
  </div>`;
}

export const COMPARE_CSS = `
/* the two brand lists over the comparison, "vs" between them */
.bc-picks{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:end;gap:.8rem;margin-top:1rem}
.bc-vs{display:grid;place-items:center;width:2.6rem;height:2.6rem;margin-bottom:.5rem;border-radius:50%;background:var(--navy);font-family:var(--display);font-size:var(--fs-body);font-weight:600;color:#f5f0e6}
.bc-dd{position:relative;display:flex;flex-direction:column;gap:.35rem;min-width:0}
.bc-k{font-size:var(--fs-body);font-weight:600;color:var(--mute)}
.bc-btn{display:flex;align-items:center;justify-content:space-between;gap:.8rem;width:100%;min-height:3.6rem;padding:.45rem 1rem .45rem .5rem;border:0;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 1.5px var(--navy);font:inherit;color:var(--ink);text-align:left;cursor:pointer;transition:box-shadow .2s}
.bc-btn:hover{box-shadow:inset 0 0 0 2px var(--navy),0 6px 16px -10px rgba(18,34,59,.5)}
.bc-btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.bc-cur{display:flex;align-items:center;gap:.75rem;min-width:0}
.bc-cur b{font-family:var(--display);font-size:var(--fs-sub);font-weight:600;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bc-chev{flex:none;width:1.1rem;height:1.1rem;transition:transform .2s}
.bc-btn[aria-expanded=true] .bc-chev{transform:rotate(180deg)}
.bc-face{flex:none;display:grid;place-items:center;width:5.6rem;height:2.6rem;padding:.25rem .4rem;border-radius:9px;background:#fff;box-shadow:inset 0 0 0 1px rgba(18,34,59,.1)}
.bc-face img{display:block;max-width:100%;max-height:2.05rem;width:auto;height:auto;object-fit:contain}
.bc-face--txt{background:var(--c);box-shadow:none;font-family:var(--display);font-size:var(--fs-body);font-weight:700;letter-spacing:.02em;color:#fff}
.bc-list{position:absolute;top:calc(100% + .4rem);left:0;right:0;z-index:30;max-height:min(24rem,60vh);margin:0;padding:.35rem;overflow-y:auto;list-style:none;border-radius:14px;background:#fff;box-shadow:0 0 0 1px var(--line),0 24px 48px -20px rgba(18,34,59,.45);scrollbar-width:thin}
.bc-list[hidden]{display:none}
.bc-list li{display:flex;align-items:center;gap:.75rem;padding:.4rem .6rem .4rem .4rem;border-radius:10px;cursor:pointer}
.bc-list li[hidden]{display:none}
.bc-list li b{flex:1;min-width:0;font-weight:600;color:var(--ink)}
.bc-list .bc-meta{flex:none;font-size:var(--fs-body);color:var(--mute)}
.bc-list li:hover,.bc-list li:focus{background:rgba(18,34,59,.06);outline:none}
.bc-list li[aria-selected=true]{background:rgba(39,86,160,.1)}
.bc-list li[aria-selected=true] b{color:var(--accent)}
.bc-list .bc-face{width:4.6rem;height:2.2rem}
.bc-list .bc-face img{max-height:1.7rem}
.cmp-prod[hidden]{display:none}
.cmp-one{display:flex;align-items:center;min-height:2.6rem;margin:0;padding:.4rem .8rem;border-radius:10px;background:#fff;box-shadow:inset 0 0 0 1px rgba(18,34,59,.2);font-weight:600;color:var(--ink)}
@media (max-width:699px){
  .bc-picks{grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);gap:.4rem}
  .bc-vs{width:2rem;height:2rem;margin-bottom:.6rem}
  .bc-btn{min-height:3rem;padding:.35rem .5rem}
  .bc-face{width:3.6rem;height:2.2rem}
  .bc-cur b{display:none}
}
`;

/* ------------------------------------------------------------ in the browser */

type On = (t: EventTarget, type: string, fn: (e: Event) => void, o?: AddEventListenerOptions) => void;

/**
 * Wire one brand list: it opens under its button, the arrows, Home and End
 * move, Enter or Space picks, Escape closes; a click outside closes it.
 * Returns a way to show a brand as picked and to hide one from the list.
 */
export function wireDropdown(el: HTMLElement, brands: readonly CmpBrand[], on: On, choose: (name: string) => void) {
  const btn = el.querySelector<HTMLButtonElement>(".bc-btn")!;
  const list = el.querySelector<HTMLElement>(".bc-list")!;
  const cur = el.querySelector<HTMLElement>(".bc-cur")!;
  const opts = () => Array.from(list.querySelectorAll<HTMLLIElement>("li[data-brand]:not([hidden])"));
  const isOpen = () => !list.hidden;
  const close = (focus = false) => {
    list.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    if (focus) btn.focus();
  };
  const open = () => {
    list.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    (opts().find((li) => li.getAttribute("aria-selected") === "true") ?? opts()[0])?.focus();
  };
  const pick = (name: string) => {
    close(true);
    choose(name);
  };
  on(btn, "click", () => (isOpen() ? close() : open()));
  on(btn, "keydown", (e) => {
    const k = (e as KeyboardEvent).key;
    if (k === "ArrowDown" || k === "ArrowUp") {
      e.preventDefault();
      open();
    }
  });
  on(list, "click", (e) => {
    const li = (e.target as Element).closest<HTMLLIElement>("li[data-brand]");
    if (li) pick(li.dataset.brand!);
  });
  on(list, "keydown", (e) => {
    const ev = e as KeyboardEvent;
    const xs = opts();
    const i = xs.indexOf(document.activeElement as HTMLLIElement);
    if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
      ev.preventDefault();
      xs[(i + (ev.key === "ArrowDown" ? 1 : -1) + xs.length) % xs.length]?.focus();
    } else if (ev.key === "Home" || ev.key === "End") {
      ev.preventDefault();
      (ev.key === "Home" ? xs[0] : xs[xs.length - 1])?.focus();
    } else if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      if (i >= 0) pick(xs[i]!.dataset.brand!);
    } else if (ev.key === "Escape" || ev.key === "Tab") {
      if (ev.key === "Escape") ev.preventDefault();
      close(ev.key === "Escape");
    }
  });
  on(document, "pointerdown", (e) => {
    if (isOpen() && !el.contains(e.target as Node)) close();
  });
  return {
    set(name: string, hide?: string) {
      const b = brands.find((x) => x.name === name);
      if (b) cur.innerHTML = `${brandFace(b)}<b>${esc(b.name)}</b>`;
      list.querySelectorAll<HTMLLIElement>("li[data-brand]").forEach((li) => {
        li.setAttribute("aria-selected", String(li.dataset.brand === name));
        li.hidden = li.dataset.brand === hide;
      });
    },
  };
}
