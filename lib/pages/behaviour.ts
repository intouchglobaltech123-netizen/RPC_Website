/**
 * The inner pages' behaviour in the browser, one small piece per page:
 *   services  (arrival motion only)
 *   projects  three buttons pick a stage, a list narrows by location (a project in the address is always shown)
 *   about     (arrival motion only)
 *   contact   the enquiry form, and whether the office is open right now
 *   blog      topics narrow the list
 *   post      a reading-progress line along the top
 *   products  who makes what, the search, the list and the enquiry; the jobs compared across brands (products-page.ts)
 *   methods   where water gets in, the kinds of method, two methods compared (methods-behaviour.ts)
 * The last two load only on their own pages.
 * Every piece is optional: without scripts the pages read fully.
 */
import { fancySelect } from "./fancy-select";
import { mountContactForm } from "./contact-form";

export type PageKind = "services" | "projects" | "about" | "contact" | "blog" | "post" | "products" | "methods";
export interface PageEnv {
  /** smooth-scroll to a position (the site's scroller when there is one) */
  scrollTo?: (y: number) => void;
  /** hold the page still behind something laid over it (and let it go again) */
  lock?: (on: boolean) => void;
}
type Off = () => void;

const listen = <K extends keyof WindowEventMap>(t: Window | HTMLElement | MediaQueryList, type: K | string, fn: (e: Event) => void, opts?: AddEventListenerOptions): Off => {
  t.addEventListener(type, fn, opts);
  return () => t.removeEventListener(type, fn, opts);
};
/** run `fn` at most once a frame on scroll and resize */
function onFrame(fn: () => void): Off {
  let raf = 0;
  const tick = () => {
    if (!raf)
      raf = requestAnimationFrame(() => {
        raf = 0;
        fn();
      });
  };
  const offs = [listen(window, "scroll", tick, { passive: true }), listen(window, "resize", tick)];
  fn();
  return () => {
    cancelAnimationFrame(raf);
    offs.forEach((f) => f());
  };
}

/* every page: things marked data-rv arrive as they come into view; data-rv-stagger on a parent spaces its children out */
function motion(root: HTMLElement): Off {
  const els = Array.from(root.querySelectorAll<HTMLElement>("[data-rv]"));
  if (!els.length || !("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  root.querySelectorAll<HTMLElement>("[data-rv-stagger]").forEach((g) => {
    const step = Number(g.dataset.rvStagger) || 90;
    Array.from(g.children)
      .filter((c): c is HTMLElement => c instanceof HTMLElement && c.hasAttribute("data-rv"))
      .forEach((c, i) => c.style.setProperty("--rvd", `${i * step}ms`));
  });
  els.forEach((e) => e.classList.add("rv-pending"));
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries)
        if (en.isIntersecting) {
          en.target.classList.remove("rv-pending");
          io.unobserve(en.target);
        }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  els.forEach((e) => io.observe(e));
  return () => {
    io.disconnect();
    els.forEach((e) => e.classList.remove("rv-pending"));
  };
}

/* list pages: a search bar (a box to type in and drop-down filters) narrows the list */
function mountSearch(bar: HTMLElement, offs: Off[], change: () => void) {
  const on = (t: EventTarget, type: string, fn: (e: Event) => void, o?: AddEventListenerOptions) => {
    t.addEventListener(type, fn, o);
    offs.push(() => t.removeEventListener(type, fn, o));
  };
  const input = bar.querySelector<HTMLInputElement>("input[data-sb-q]");
  const clear = bar.querySelector<HTMLButtonElement>("[data-sb-clear]");
  const sels = Array.from(bar.querySelectorAll<HTMLSelectElement>("select[data-sb-f]"));
  bar.hidden = false;
  sels.forEach((sel) => {
    fancySelect(sel, on, "fs--sb");
    on(sel, "change", () => {
      sel.closest(".sb-f")?.classList.toggle("is-set", sel.selectedIndex > 0);
      change();
    });
  });
  // the search runs after a short pause in typing
  let t = 0;
  if (input)
    on(input, "input", () => {
      if (clear) clear.hidden = !input.value;
      clearTimeout(t);
      t = window.setTimeout(change, 120);
    });
  if (input) on(input, "keydown", (e) => (e as KeyboardEvent).key === "Escape" && input.value && ((input.value = ""), clear && (clear.hidden = true), change()));
  if (clear && input)
    on(clear, "click", () => {
      input.value = "";
      clear.hidden = true;
      input.focus();
      change();
    });
  offs.push(() => clearTimeout(t));
  const words = () => (input?.value ?? "").toLowerCase().split(/\s+/).filter(Boolean);
  return {
    /** every word typed is somewhere in the text */
    matches: (text: string) => words().every((w) => text.includes(w)),
    typed: () => (input?.value ?? "").trim(),
    value: (k: string) => sels.find((x) => x.dataset.sbF === k)?.value ?? "all",
    label: (k: string) => (sels.find((x) => x.dataset.sbF === k)?.selectedOptions[0]?.textContent ?? "").replace(/\s*\(\d+\)$/, ""),
    reset: () => {
      if (input) input.value = "";
      if (clear) clear.hidden = true;
      sels.forEach((x) => {
        x.selectedIndex = 0;
        x.closest(".sb-f")?.classList.remove("is-set");
        x.dispatchEvent(new Event("fs-sync"));
      });
      change();
    },
  };
}

/* projects: three buttons pick completed, ongoing or upcoming projects, and a list narrows them by location */
function projects(root: HTMLElement, env: PageEnv): Off {
  void env;
  const list = root.querySelector<HTMLElement>(".pj-list");
  const bar = root.querySelector<HTMLElement>(".pj-filters");
  if (!list || !bar) return () => {};
  const offs: Off[] = [];
  const on = (t: EventTarget, type: string, fn: (e: Event) => void, o?: AddEventListenerOptions) => {
    t.addEventListener(type, fn, o);
    offs.push(() => t.removeEventListener(type, fn, o));
  };
  const items = Array.from(list.querySelectorAll<HTMLElement>(".pj-card"));
  const tabs = Array.from(bar.querySelectorAll<HTMLButtonElement>("[data-pj-status]"));
  const sel = bar.querySelector<HTMLSelectElement>("select[data-pj-town]");
  const showing = root.querySelector<HTMLElement>(".pj-showing");
  const empty = root.querySelector<HTMLElement>(".pj-empty");
  const stOf = (t: HTMLElement) => t.dataset.pjStatus ?? "";
  let status = stOf(tabs.find((t) => t.getAttribute("aria-pressed") === "true") ?? tabs[0] ?? bar);
  const where = () => sel?.value ?? "all";
  const here = (it: HTMLElement) => where() === "all" || it.dataset.town === where();
  const apply = () => {
    // each button counts its projects in the chosen location; if the chosen stage has none there, the first that has some is picked
    const n = new Map(tabs.map((t) => [stOf(t), items.filter((it) => it.dataset.status === stOf(t) && here(it)).length]));
    if (!n.get(status)) status = stOf(tabs.find((t) => n.get(stOf(t))) ?? tabs.find((t) => stOf(t) === status) ?? bar);
    let shown = 0;
    for (const t of tabs) {
      const k = n.get(stOf(t)) ?? 0;
      t.setAttribute("aria-pressed", String(stOf(t) === status));
      t.toggleAttribute("data-empty", k === 0);
      const c = t.querySelector(".pj-tn");
      if (c) c.textContent = String(k);
    }
    for (const it of items) {
      const show = it.dataset.status === status && here(it);
      it.hidden = !show;
      if (show) shown++;
    }
    if (empty) empty.hidden = shown > 0;
    if (showing) {
      const name = tabs.find((t) => stOf(t) === status)?.dataset.pjName ?? "projects";
      const what = name.replace(/projects$/, shown === 1 ? "project" : "projects");
      showing.textContent = `Showing ${shown} ${what}${where() !== "all" ? ` in ${where()}` : ""}`;
    }
  };
  for (const t of tabs)
    on(t, "click", () => {
      status = stOf(t);
      apply();
    });
  if (sel) {
    fancySelect(sel, on, "fs--pj");
    on(sel, "change", apply);
  }
  const everywhere = () => {
    if (sel && sel.value !== "all") {
      sel.value = "all";
      sel.dispatchEvent(new Event("fs-sync"));
    }
  };
  on(root, "click", (e) => {
    if (!(e.target as HTMLElement).closest("[data-reset]")) return;
    everywhere();
    apply();
  });
  // a project in the address is shown, under its own button, wherever it is
  const fromHash = () => {
    const el = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    if (!el || !items.includes(el) || !el.hidden) return;
    status = el.dataset.status ?? status;
    if (!here(el)) everywhere();
    apply();
    el.scrollIntoView();
  };
  on(window, "hashchange", fromHash);
  apply();
  fromHash();
  return () => offs.forEach((f) => f());
}

/* blog: the search bar narrows the articles by words and by waterproofing method */
function blog(root: HTMLElement): Off {
  const bar = root.querySelector<HTMLElement>(".bl-bar");
  const items = Array.from(root.querySelectorAll<HTMLElement>("[data-methods]"));
  const status = root.querySelector<HTMLElement>("[data-topic-status]");
  const empty = root.querySelector<HTMLElement>(".bl-empty");
  const more = root.querySelector<HTMLElement>(".bl-morehead h2");
  if (!bar || !items.length) return () => {};
  const offs: Off[] = [];
  const apply = () => {
    const m = s.value("method");
    let n = 0;
    for (const it of items) {
      const on = (m === "all" || (it.dataset.methods ?? "").split(" ").includes(m)) && s.matches(it.dataset.text ?? "");
      it.hidden = !on;
      if (on) n++;
    }
    if (empty) empty.hidden = n > 0;
    const narrowed = m !== "all" || !!s.typed();
    if (more) more.textContent = narrowed ? "Articles found" : "More articles";
    if (status) {
      const bits = [m !== "all" ? `about ${s.label("method").toLowerCase()}` : "", s.typed() ? `matching “${s.typed()}”` : ""].filter(Boolean);
      status.textContent = bits.length ? `Showing ${n} ${n === 1 ? "article" : "articles"} ${bits.join(", ")}` : `Showing all ${n} articles`;
    }
  };
  const s = mountSearch(bar, offs, apply);
  offs.push(listen(root, "click", (e) => (e.target as HTMLElement).closest("[data-reset]") && s.reset()));
  apply();
  return () => offs.forEach((f) => f());
}

/* contact: whether the office is open right now (India time) */
const DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const clock = (h: number, m: number) => `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
function openNow(root: HTMLElement): Off {
  const el = root.querySelector<HTMLElement>("[data-hours]");
  const text = el?.querySelector<HTMLElement>("[data-open-text]");
  if (!el || !text) return () => {};
  const [d0 = 1, d1 = 6] = (el.dataset.days ?? "1-6").split("-").map(Number);
  const [fh = 8, fm = 30] = (el.dataset.from ?? "08:30").split(":").map(Number);
  const [th = 18, tm = 30] = (el.dataset.to ?? "18:30").split(":").map(Number);
  const isDay = (d: number) => d >= d0 && d <= d1;
  const render = () => {
    const now = new Date();
    const ist = new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60000);
    const day = ist.getDay();
    const mins = ist.getHours() * 60 + ist.getMinutes();
    const from = fh * 60 + fm;
    const to = th * 60 + tm;
    const open = isDay(day) && mins >= from && mins < to;
    el.dataset.state = open ? "open" : "closed";
    if (open) {
      text.textContent = `Open now, until ${clock(th, tm)}`;
      return;
    }
    let next = "";
    if (isDay(day) && mins < from) next = "today";
    else {
      for (let k = 1; k <= 7; k++) {
        const d = (day + k) % 7;
        if (isDay(d)) {
          next = k === 1 ? "tomorrow" : DAY[d]!;
          break;
        }
      }
    }
    text.textContent = `Closed now, opens ${next} at ${clock(fh, fm)}`;
  };
  render();
  const id = window.setInterval(render, 60000);
  return () => window.clearInterval(id);
}

/* article: how far through the text you are, and which part of it the contents list should mark */
function post(root: HTMLElement): Off {
  const bar = root.querySelector<HTMLElement>(".po-progress i");
  const body = root.querySelector<HTMLElement>(".po-body");
  if (!bar || !body) return () => {};
  const offs: Off[] = [
    onFrame(() => {
      const r = body.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.35 - r.top) / Math.max(1, r.height - window.innerHeight * 0.3)));
      bar.style.transform = `scaleX(${p.toFixed(4)})`;
    }),
  ];
  const links = new Map(Array.from(root.querySelectorAll<HTMLAnchorElement>(".po-toc a")).map((a) => [a.getAttribute("href")!.slice(1), a] as const));
  const secs = Array.from(body.querySelectorAll<HTMLElement>("[data-sec]"));
  if (links.size && secs.length && "IntersectionObserver" in window) {
    const mark = (id: string) => links.forEach((a, k) => (k === id ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")));
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) if (en.isIntersecting) mark(en.target.id);
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    secs.forEach((x) => io.observe(x));
    offs.push(() => io.disconnect());
  }
  return () => offs.forEach((f) => f());
}

export function mountPageBehaviour(kind: PageKind, root: HTMLElement, env: PageEnv = {}): Off {
  const offs: Off[] = [];
  if (kind === "projects") offs.push(projects(root, env));
  if (kind === "contact") offs.push(mountContactForm(root), openNow(root));
  if (kind === "blog") offs.push(blog(root));
  if (kind === "post") offs.push(post(root));
  if (kind === "products" || kind === "methods") {
    let off: Off = () => {};
    let gone = false;
    const load = kind === "products" ? import("./products-page").then((m) => m.mountProducts) : import("./methods-behaviour").then((m) => m.mountMethods);
    void load.then((mount) => {
      if (!gone) off = mount(root, env);
    });
    offs.push(() => {
      gone = true;
      off();
    });
  }
  offs.push(motion(root));
  return () => offs.forEach((f) => f());
}
