/**
 * The waterproofing page in the browser:
 *
 *   - "Where is the water getting in?": picking a place (on the drawing or in
 *     the row of names, which also answers the arrow keys) marks it on the
 *     drawing and opens its panel. A link to #a-<place> opens it too.
 *   - a method named elsewhere on the page (or in the address, #m-<key>) is
 *     opened in the list and marked for a moment as the page glides to it (the
 *     glide itself is the pages' shared link handling)
 *   - two methods side by side: the two lists and the swap button; "Compare
 *     with another method" under a method puts it in the comparison, in place
 *     of the one chosen longer ago
 *
 * Without scripts the links still jump, every method still opens, the first
 * place shows, and the comparison shows its first pair.
 */
import type { PageEnv } from "./behaviour";
import { compareRowsHtml, type CmpMethod } from "./methods-compare";
import { mountRain } from "./methods-rain";

type Off = () => void;

/** "Where is the water getting in?" */
function placeMap(root: HTMLElement, env: PageEnv): Off {
  const map = root.querySelector<HTMLElement>("[data-wpx-map]");
  if (!map) return () => {};
  const tabs = Array.from(map.querySelectorAll<HTMLButtonElement>(".wpx-tab"));
  const keys = tabs.map((t) => t.dataset.place!);
  const spots = Array.from(map.querySelectorAll<HTMLElement>(".wpx-spot"));
  const parts = Array.from(map.querySelectorAll<SVGGElement>(".wpx-part"));
  const panels = Array.from(map.querySelectorAll<HTMLElement>(".wpx-panel"));

  const select = (key: string, focus = false) => {
    if (!keys.includes(key)) return;
    tabs.forEach((t) => {
      const on = t.dataset.place === key;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    spots.forEach((s) => s.classList.toggle("is-on", s.dataset.place === key));
    parts.forEach((p) => p.classList.toggle("is-on", p.dataset.zone === key));
    panels.forEach((p) => (p.hidden = p.id !== `wpx-p-${key}`));
    // on phones the names sit in one sideways row: keep the chosen one in view
    const tab = tabs[keys.indexOf(key)];
    const row = tab?.parentElement;
    if (tab && row && row.scrollWidth > row.clientWidth + 4) {
      const r = row.getBoundingClientRect();
      const t = tab.getBoundingClientRect();
      row.scrollTo({ left: row.scrollLeft + (t.left - r.left) - (r.width - t.width) / 2, behavior: "smooth" });
    }
  };

  const onClick = (e: Event) => {
    const b = (e.target as Element).closest<HTMLElement>("[data-place]");
    if (b && map.contains(b)) select(b.dataset.place!);
  };
  const onKey = (e: KeyboardEvent) => {
    const i = tabs.indexOf(e.target as HTMLButtonElement);
    if (i < 0) return;
    const n = tabs.length;
    const to = e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowLeft" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    select(keys[to]!, true);
  };
  map.addEventListener("click", onClick);
  map.addEventListener("keydown", onKey);

  // /waterproofing#a-terrace and the like: open that place and bring the drawing into view
  const fromHash = () => {
    const h = decodeURIComponent(location.hash.slice(1));
    if (!h.startsWith("a-") || !keys.includes(h.slice(2))) return;
    select(h.slice(2));
    const margin = parseFloat(getComputedStyle(map).scrollMarginTop) || 0;
    const y = map.getBoundingClientRect().top + window.scrollY - margin;
    if (env.scrollTo) env.scrollTo(y);
    else window.scrollTo({ top: y, behavior: "smooth" });
  };
  fromHash();
  window.addEventListener("hashchange", fromHash);
  return () => {
    map.removeEventListener("click", onClick);
    map.removeEventListener("keydown", onKey);
    window.removeEventListener("hashchange", fromHash);
  };
}

/** two methods side by side; `add` puts a method from elsewhere on the page into it */
function compare(root: HTMLElement): { off: Off; add: (key: string) => void } {
  const none = { off: () => {}, add: () => {} };
  const sec = root.querySelector<HTMLElement>("[data-wpx-compare]");
  const json = sec?.querySelector("script[data-wpx-data]")?.textContent;
  const rows = sec?.querySelector<HTMLElement>("[data-cmp-rows]");
  const selA = sec?.querySelector<HTMLSelectElement>('select[data-slot="a"]');
  const selB = sec?.querySelector<HTMLSelectElement>('select[data-slot="b"]');
  if (!sec || !json || !rows || !selA || !selB) return none;
  let data: CmpMethod[] = [];
  try {
    data = JSON.parse(json) as CmpMethod[];
  } catch {
    return none;
  }
  const by = new Map(data.map((m) => [m.key, m]));
  const nameA = sec.querySelector<HTMLElement>('[data-name="a"]');
  const nameB = sec.querySelector<HTMLElement>('[data-name="b"]');
  let a = selA.value;
  let b = selB.value;
  /** the side a method added from elsewhere replaces: the one chosen longer ago */
  let older: "a" | "b" = "b";
  let t = 0;

  /** draw the pair; `fresh` is the side that just changed, outlined for a moment */
  const render = (fresh?: "a" | "b") => {
    const ma = by.get(a);
    const mb = by.get(b);
    if (!ma || !mb) return;
    selA.value = a;
    selB.value = b;
    if (nameA) nameA.textContent = ma.short;
    if (nameB) nameB.textContent = mb.short;
    rows.innerHTML = compareRowsHtml(ma, mb);
    window.clearTimeout(t);
    sec.querySelectorAll(".wpx-pick.is-new").forEach((x) => x.classList.remove("is-new"));
    const box = fresh ? sec.querySelector<HTMLElement>(`[data-pickbox="${fresh}"]`) : null;
    if (box) {
      box.classList.add("is-new");
      t = window.setTimeout(() => box.classList.remove("is-new"), 1800);
    }
  };
  const choose = (side: "a" | "b", key: string) => {
    const other = side === "a" ? b : a;
    // choosing the method already on the other side swaps the two
    if (key === other) [a, b] = [b, a];
    else if (side === "a") a = key;
    else b = key;
    older = side === "a" ? "b" : "a";
    render();
  };
  const add = (key: string) => {
    if (!by.has(key)) return;
    if (key === a || key === b) return render(key === a ? "a" : "b");
    const side = older;
    if (side === "a") a = key;
    else b = key;
    older = side === "a" ? "b" : "a";
    render(side);
  };

  const onChange = (e: Event) => {
    const s = e.target as HTMLSelectElement;
    if (s === selA) choose("a", s.value);
    else if (s === selB) choose("b", s.value);
  };
  const onClick = (e: Event) => {
    if (!(e.target as Element).closest("[data-swap]")) return;
    [a, b] = [b, a];
    older = older === "a" ? "b" : "a";
    render();
  };
  sec.addEventListener("change", onChange);
  sec.addEventListener("click", onClick);
  const offPicker = mountPicker(sec, data, () => ({ a, b }), choose);
  return {
    off: () => {
      window.clearTimeout(t);
      offPicker();
      sec.removeEventListener("change", onChange);
      sec.removeEventListener("click", onClick);
    },
    add,
  };
}

export function mountMethods(root: HTMLElement, env: PageEnv = {}): () => void {
  const cmp = compare(root);
  let t = 0;
  /** open a method's row, and return it */
  const open = (key: string) => {
    const row = root.querySelector<HTMLElement>(`#m-${CSS.escape(key)}`);
    const d = row?.querySelector<HTMLDetailsElement>("details");
    if (d && !d.open) d.open = true;
    return row;
  };
  const flash = (key: string) => {
    const row = open(key);
    if (!row) return;
    window.clearTimeout(t);
    root.querySelectorAll(".wp-row.is-hit").forEach((x) => x.classList.remove("is-hit"));
    row.classList.add("is-hit");
    t = window.setTimeout(() => row.classList.remove("is-hit"), 2200);
  };
  // before the page glides anywhere: open the method a link names, or put one in the comparison
  const onClickFirst = (e: Event) => {
    const el = e.target as Element;
    const go = el.closest<HTMLElement>("[data-m-go]");
    if (go) open(go.dataset.mGo!);
    const add = el.closest<HTMLElement>("[data-cmp-add]");
    if (add) cmp.add(add.dataset.cmpAdd!);
  };
  const onClick = (e: Event) => {
    const go = (e.target as Element).closest<HTMLElement>("[data-m-go]");
    if (go) flash(go.dataset.mGo!);
  };
  root.addEventListener("click", onClickFirst, true);
  root.addEventListener("click", onClick);
  // /waterproofing#m-crystalline and the like
  const fromHash = () => {
    const h = decodeURIComponent(location.hash.slice(1));
    if (h.startsWith("m-")) flash(h.slice(2));
  };
  fromHash();
  window.addEventListener("hashchange", fromHash);
  let rainData: CmpMethod[] = [];
  try {
    rainData = JSON.parse(root.querySelector("script[data-wpx-data]")?.textContent ?? "[]") as CmpMethod[];
  } catch {
    rainData = [];
  }
  const offs = [placeMap(root, env), cmp.off, mountRain(root, rainData)];
  return () => {
    root.removeEventListener("click", onClickFirst, true);
    root.removeEventListener("click", onClick);
    window.removeEventListener("hashchange", fromHash);
    window.clearTimeout(t);
    offs.forEach((f) => f());
  };
}

/* ------------------------------------------------------------ the method picker */

const escText = (x: string) => x.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const TICK = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/**
 * The twelve methods as a panel rather than the browser's plain list: grouped
 * by kind, each with how it goes on, the one shown ticked and the one on the
 * other side marked with its letter (picking it swaps the two). The selects stay
 * underneath without scripts.
 */
function mountPicker(sec: HTMLElement, data: readonly CmpMethod[], now: () => { a: string; b: string }, choose: (side: "a" | "b", key: string) => void) {
  const kinds = [...new Set(data.map((m) => m.kind))];
  const offs: (() => void)[] = [];
  const on = (el: EventTarget, type: string, fn: (e: Event) => void) => {
    el.addEventListener(type, fn);
    offs.push(() => el.removeEventListener(type, fn));
  };
  let openSide: "a" | "b" | null = null;
  const boxes: Record<"a" | "b", { box: HTMLElement; menu: HTMLElement } | undefined> = { a: undefined, b: undefined };

  const close = (focusBox = false) => {
    if (!openSide) return;
    const p = boxes[openSide]!;
    p.menu.hidden = true;
    p.box.setAttribute("aria-expanded", "false");
    if (focusBox) p.box.focus();
    openSide = null;
  };
  const open = (side: "a" | "b") => {
    if (openSide && openSide !== side) close();
    const p = boxes[side]!;
    const cur = now();
    const mine = side === "a" ? cur.a : cur.b;
    const theirs = side === "a" ? cur.b : cur.a;
    p.menu.querySelectorAll<HTMLButtonElement>("[data-key]").forEach((o) => {
      o.setAttribute("aria-selected", String(o.dataset.key === mine));
      const tag = o.querySelector(".wpx-otag")!;
      tag.textContent = o.dataset.key === theirs ? (side === "a" ? "B" : "A") : "";
      o.title = o.dataset.key === theirs ? "On the other side: picking it swaps the two" : "";
    });
    p.menu.hidden = false;
    p.box.setAttribute("aria-expanded", "true");
    openSide = side;
    p.menu.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus();
  };

  (["a", "b"] as const).forEach((side) => {
    const box = sec.querySelector<HTMLElement>(`[data-pickbox="${side}"]`);
    if (!box) return;
    const menu = document.createElement("div");
    menu.className = `wpx-menu wpx-menu--${side}`;
    menu.id = `wpx-menu-${side}`;
    menu.setAttribute("role", "listbox");
    menu.setAttribute("aria-label", side === "a" ? "First method" : "Second method");
    menu.hidden = true;
    menu.innerHTML = `<div class="wpx-mcols">${[kinds.slice(0, 1), kinds.slice(1)]
      .map(
        (col) =>
          `<div class="wpx-mcol">${col
            .map(
              (k) =>
                `<div class="wpx-mgroup"><p class="wpx-mg">${escText(k)}</p>${data
                  .filter((m) => m.kind === k)
                  .map(
                    (m) =>
                      `<button type="button" class="wpx-opt" role="option" data-key="${escText(m.key)}" aria-selected="false"><span class="wpx-otx"><span class="wpx-on">${escText(m.short)}</span><span class="wpx-oa">${escText(m.applied)}</span></span><span class="wpx-otag" aria-hidden="true"></span><span class="wpx-otick">${TICK}</span></button>`,
                  )
                  .join("")}</div>`,
            )
            .join("")}</div>`,
      )
      .join("")}</div>`;
    box.after(menu);
    box.tabIndex = 0;
    box.setAttribute("role", "button");
    box.setAttribute("aria-haspopup", "listbox");
    box.setAttribute("aria-expanded", "false");
    box.setAttribute("aria-controls", menu.id);
    box.setAttribute("aria-label", `${side === "a" ? "First" : "Second"} method: choose another`);
    boxes[side] = { box, menu };

    on(box, "click", (e) => {
      e.preventDefault();
      if (openSide === side) close();
      else open(side);
    });
    on(box, "keydown", (e) => {
      const k = (e as KeyboardEvent).key;
      if (k === "Enter" || k === " " || k === "ArrowDown") {
        e.preventDefault();
        open(side);
      }
    });
    on(menu, "click", (e) => {
      const o = (e.target as Element).closest<HTMLButtonElement>("[data-key]");
      if (!o) return;
      close(true);
      choose(side, o.dataset.key!);
    });
    on(menu, "keydown", (e) => {
      const k = (e as KeyboardEvent).key;
      const opts = Array.from(menu.querySelectorAll<HTMLButtonElement>("[data-key]"));
      const i = opts.indexOf(document.activeElement as HTMLButtonElement);
      if (k === "Escape") {
        e.preventDefault();
        close(true);
      } else if (k === "Tab") close();
      else if (k === "ArrowDown" || k === "ArrowUp" || k === "Home" || k === "End") {
        e.preventDefault();
        const n = k === "Home" ? 0 : k === "End" ? opts.length - 1 : (i + (k === "ArrowDown" ? 1 : -1) + opts.length) % opts.length;
        opts[n]?.focus();
      }
    });
  });
  sec.classList.add("wpx-js");
  on(document, "pointerdown", (e) => {
    if (!openSide) return;
    const p = boxes[openSide]!;
    const t = e.target as Node;
    if (!p.menu.contains(t) && !p.box.contains(t)) close();
  });
  return () => {
    offs.forEach((f) => f());
    (["a", "b"] as const).forEach((s) => boxes[s]?.menu.remove());
    sec.classList.remove("wpx-js");
  };
}
