/**
 * A drop-down list drawn by the page in place of the browser's own: the
 * choice on a button, and a list that opens under it with the group names as
 * small headings and the chosen line ticked. The real <select> stays in the
 * page (hidden) and keeps the value, so everything that listens to it works as
 * before: choosing a line sets its value and fires "change". When code sets
 * the select's value itself, it fires "fs-sync" so the button catches up.
 *
 * Keyboard: Enter, Space or the arrows open the list; the arrows, Home and End
 * move; Enter or Space picks; Escape closes; typing a letter jumps to the next
 * line starting with it.
 */
type On = (t: EventTarget, type: string, fn: (e: Event) => void, o?: AddEventListenerOptions) => void;

let uid = 0;
const CHEVRON = `<svg class="fs-chev" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const TICK = `<svg class="fs-tick" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const text = (s: string) => {
  const d = document.createElement("span");
  d.textContent = s;
  return d.innerHTML;
};
/** "Tile adhesives (8)" → the name and the count apart */
const split = (s: string) => {
  const m = /^(.*?)\s*\((\d+)\)$/.exec(s.trim());
  return m ? { name: m[1]!, n: m[2]! } : { name: s.trim(), n: "" };
};

export function fancySelect(sel: HTMLSelectElement, on: On, cls = ""): () => void {
  // once per select, however many times the page's scripts start
  if (sel.dataset.fs) return () => {};
  sel.dataset.fs = "1";
  const id = `fs${++uid}`;
  const label = sel.closest("label");
  const wrap = document.createElement("div");
  wrap.className = `fs${cls ? ` ${cls}` : ""}`;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "fs-btn";
  btn.setAttribute("aria-haspopup", "listbox");
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-controls", `${id}-list`);
  btn.innerHTML = `<span class="fs-val"></span>${CHEVRON}`;
  const list = document.createElement("div");
  list.className = `fs-list${cls ? ` ${cls}-list` : ""}`;
  list.id = `${id}-list`;
  list.setAttribute("role", "listbox");
  list.tabIndex = -1;
  const top = typeof HTMLElement.prototype.showPopover === "function";
  if (top) list.setAttribute("popover", "manual");
  else list.hidden = true;

  // the lines, in their groups
  const opts: HTMLElement[] = [];
  const line = (o: HTMLOptionElement) => {
    const { name, n } = split(o.textContent ?? "");
    const el = document.createElement("div");
    el.className = "fs-opt";
    el.id = `${id}-o${opts.length}`;
    el.setAttribute("role", "option");
    el.dataset.v = o.value;
    if (o.disabled) el.setAttribute("aria-disabled", "true");
    el.innerHTML = `${TICK}<span class="fs-on">${text(name)}</span>${n ? `<span class="fs-n">${n}</span>` : ""}`;
    opts.push(el);
    return el;
  };
  Array.from(sel.children).forEach((c) => {
    if (c instanceof HTMLOptGroupElement) {
      const g = document.createElement("div");
      g.setAttribute("role", "group");
      g.className = "fs-g";
      const gid = `${id}-g${list.children.length}`;
      g.setAttribute("aria-labelledby", gid);
      g.innerHTML = `<p class="fs-gh" id="${gid}">${text(c.label)}</p>`;
      Array.from(c.children).forEach((o) => o instanceof HTMLOptionElement && g.append(line(o)));
      list.append(g);
    } else if (c instanceof HTMLOptionElement) list.append(line(c));
  });

  // the real select leaves the label, so the label now names the button
  wrap.append(btn);
  sel.after(wrap);
  if (label) label.after(sel);
  sel.hidden = true;
  sel.tabIndex = -1;
  (sel.closest(".pg") ?? document.body).append(list);

  let active = -1;
  let open = false;
  const setActive = (i: number) => {
    active = Math.max(0, Math.min(opts.length - 1, i));
    opts.forEach((o, k) => o.classList.toggle("is-active", k === active));
    const el = opts[active];
    if (!el) return;
    list.setAttribute("aria-activedescendant", el.id);
    const lr = list.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    if (r.top < lr.top + 28) list.scrollTop -= lr.top + 28 - r.top;
    else if (r.bottom > lr.bottom - 6) list.scrollTop += r.bottom - lr.bottom + 6;
  };
  const sync = () => {
    const cur = opts.find((o) => o.dataset.v === sel.value);
    opts.forEach((o) => o.setAttribute("aria-selected", String(o === cur)));
    const { name, n } = split(sel.selectedOptions[0]?.textContent ?? "");
    btn.querySelector(".fs-val")!.innerHTML = `${text(name)}${n ? ` <span class="fs-n">${n}</span>` : ""}`;
  };
  const place = () => {
    const r = btn.getBoundingClientRect();
    const cw = document.documentElement.clientWidth;
    const w = Math.min(Math.max(r.width, 300), cw - 24);
    // open from the button's left edge, or from its right edge where the screen runs out
    let left = r.left + w > cw - 12 ? r.right - w : r.left;
    left = Math.min(Math.max(12, left), cw - w - 12);
    const below = window.innerHeight - r.bottom - 12;
    const above = r.top - 12;
    const up = below < 240 && above > below;
    list.style.left = `${left}px`;
    list.style.width = `${w}px`;
    list.style.maxHeight = `${Math.min(400, (up ? above : below) - 8)}px`;
    list.style.top = up ? "auto" : `${r.bottom + 6}px`;
    list.style.bottom = up ? `${window.innerHeight - r.top + 6}px` : "auto";
    list.classList.toggle("is-up", up);
  };
  const show = () => {
    if (open) return;
    open = true;
    place();
    if (top) list.showPopover();
    else list.hidden = false;
    list.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
    setActive(Math.max(0, opts.findIndex((o) => o.dataset.v === sel.value)));
    list.focus({ preventScroll: true });
  };
  const hide = (refocus: boolean) => {
    if (!open) return;
    open = false;
    list.classList.remove("is-open");
    if (top) list.hidePopover();
    else list.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    if (refocus) btn.focus({ preventScroll: true });
  };
  const pick = (i: number) => {
    const el = opts[i];
    if (!el || el.getAttribute("aria-disabled") === "true") return;
    const changed = sel.value !== el.dataset.v;
    sel.value = el.dataset.v!;
    sync();
    hide(true);
    if (changed) sel.dispatchEvent(new Event("change", { bubbles: true }));
  };

  on(btn, "click", () => (open ? hide(true) : show()));
  on(btn, "keydown", (e) => {
    const k = (e as KeyboardEvent).key;
    if (k === "ArrowDown" || k === "ArrowUp") {
      e.preventDefault();
      show();
    }
  });
  on(list, "keydown", (e) => {
    const ke = e as KeyboardEvent;
    const k = ke.key;
    if (k === "ArrowDown") setActive(active + 1);
    else if (k === "ArrowUp") setActive(active - 1);
    else if (k === "Home") setActive(0);
    else if (k === "End") setActive(opts.length - 1);
    else if (k === "Enter" || k === " ") pick(active);
    else if (k === "Escape") hide(true);
    else if (k === "Tab") return hide(false);
    else if (k.length === 1 && /\S/.test(k)) {
      const ch = k.toLowerCase();
      const from = opts.slice(active + 1).concat(opts.slice(0, active + 1));
      const hit = from.find((o) => (o.querySelector(".fs-on")?.textContent ?? "").toLowerCase().startsWith(ch));
      if (hit) setActive(opts.indexOf(hit));
    } else return;
    e.preventDefault();
  });
  on(list, "pointermove", (e) => {
    const o = (e.target as HTMLElement).closest<HTMLElement>(".fs-opt");
    if (o && opts.indexOf(o) !== active) setActive(opts.indexOf(o));
  });
  on(list, "click", (e) => {
    const o = (e.target as HTMLElement).closest<HTMLElement>(".fs-opt");
    if (o) pick(opts.indexOf(o));
  });
  on(document, "pointerdown", (e) => {
    if (open && !list.contains(e.target as Node) && !wrap.contains(e.target as Node)) hide(false);
  });
  on(window, "scroll", () => open && place(), { passive: true, capture: true });
  on(window, "resize", () => open && hide(false));
  on(sel, "fs-sync", sync);
  sync();
  // undo it all when the page's scripts stop: the select goes back into its label, as the page was
  let done = false;
  const undo = () => {
    if (done) return;
    done = true;
    list.remove();
    wrap.remove();
    if (label) label.append(sel);
    sel.hidden = false;
    sel.removeAttribute("tabindex");
    delete sel.dataset.fs;
  };
  // the page's own clean-up list only takes listeners, so the undo rides on one
  on({ addEventListener() {}, removeEventListener: undo, dispatchEvent: () => true } as EventTarget, "fs-undo", () => {});
  return undo;
}

/** the look of the button and the list; the page adds its own sizes */
export const FANCY_SELECT_CSS = `
.fs{position:relative;min-width:0}
.fs-btn{display:flex;align-items:center;justify-content:space-between;gap:.8rem;width:100%;min-height:2.9rem;margin:0;padding:.45rem .9rem .45rem 1rem;border:0;border-radius:12px;background:var(--theme-white);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 22%,transparent),0 1px 2px color-mix(in srgb,var(--theme-ink) 6%,transparent);font:inherit;font-size:var(--fs-body);font-weight:600;line-height:1.3;color:var(--ink);text-align:left;cursor:pointer;transition:box-shadow .2s}
.fs-btn:hover{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 45%,transparent),0 1px 2px color-mix(in srgb,var(--theme-ink) 6%,transparent)}
.fs-btn[aria-expanded=true]{box-shadow:inset 0 0 0 1.5px var(--navy),0 0 0 4px color-mix(in srgb,var(--theme-primary) 12%,transparent)}
.fs-btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.fs-val{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fs-chev{flex:none;width:15px;height:15px;color:var(--mute);transition:transform .25s}
.fs-btn[aria-expanded=true] .fs-chev{transform:rotate(180deg);color:var(--ink)}
.fs-n{display:inline-grid;place-items:center;min-width:1.5rem;height:1.5rem;margin-left:.15rem;padding:0 .35rem;border-radius:999px;background:color-mix(in srgb,var(--theme-primary) 10%,transparent);font-size:var(--fs-body);font-weight:600;line-height:1;color:var(--accent);vertical-align:1px;font-variant-numeric:tabular-nums}
.fs-list{position:fixed;inset:auto;z-index:80;margin:0;padding:.4rem;border:0;border-radius:14px;background:var(--theme-white);box-shadow:0 0 0 1px color-mix(in srgb,var(--theme-ink) 10%,transparent),0 24px 48px -18px color-mix(in srgb,var(--theme-ink) 35%,transparent);overflow-y:auto;overscroll-behavior:contain;color:var(--ink,var(--theme-ink));font-family:var(--sans);opacity:0;transform:translateY(-4px);transition:opacity .16s,transform .16s}
.fs-list.is-up{transform:translateY(4px)}
.fs-list.is-open{opacity:1;transform:none}
@starting-style{.fs-list.is-open{opacity:0;transform:translateY(-4px)}}
.fs-list:focus{outline:none}
.fs-list:focus-visible{outline:none}
.fs-g + .fs-g{margin-top:.3rem;padding-top:.3rem;border-top:1px solid color-mix(in srgb,var(--theme-ink) 8%,transparent)}
.fs-gh{position:sticky;top:-.4rem;z-index:1;margin:0;padding:.55rem .7rem .3rem;background:var(--theme-white);font-size:var(--fs-body);font-weight:600;color:var(--mute,var(--theme-muted))}
.fs-opt{display:grid;grid-template-columns:1rem minmax(0,1fr) auto;align-items:center;gap:.55rem;padding:.5rem .7rem;border-radius:9px;font-size:var(--fs-body);line-height:1.35;cursor:pointer}
.fs-opt.is-active{background:color-mix(in srgb,var(--theme-primary) 8%,transparent)}
.fs-tick{width:1rem;height:1rem;color:var(--accent);opacity:0}
.fs-opt[aria-selected=true]{font-weight:600}
.fs-opt[aria-selected=true] .fs-tick{opacity:1}
.fs-opt .fs-n{background:color-mix(in srgb,var(--theme-ink) 6%,transparent);color:var(--ink2,var(--theme-ink-2))}
.fs-opt[aria-selected=true] .fs-n{background:var(--navy,var(--theme-ink));color:var(--theme-white)}
@media (prefers-reduced-motion:reduce){.fs-list,.fs-chev{transition:none}}
`;
