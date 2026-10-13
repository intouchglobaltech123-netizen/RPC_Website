/**
 * The products page in the browser:
 *
 *   - who makes what: a square of the grid (or a brand, or a kind) lists those
 *     products; on phones the same choices are chips. The search narrows the
 *     list as you type, and the grid's numbers turn into how many products
 *     match it where, so you can see where the matches are and pick one.
 *   - the list: brand by brand, each brand's first few products until it is
 *     opened in full; a row opens for the product's details
 *   - the list of jobs shows one job at a time; any two of its products can be
 *     put head to head
 *   - a link to a product, a brand or a job (from this page or another) opens it
 *   - the enquiry: products added from their rows ride in a bar at the foot of
 *     the screen (kept for the visit, in this tab only), each with its pack and
 *     how many, and go to RPC on WhatsApp as one message
 *
 * Without scripts every product is listed, every row still opens, every job's
 * table is shown one under another, and each product keeps its rate link.
 */
import { fancySelect } from "./fancy-select";
import { rateHref } from "../products/rate";
import type { PageEnv } from "./behaviour";

type Off = () => void;

export function mountProducts(root: HTMLElement, env: PageEnv = {}): Off {
  const offs: Off[] = [];
  const on = (t: EventTarget, type: string, fn: (e: Event) => void, o?: AddEventListenerOptions) => {
    t.addEventListener(type, fn, o);
    offs.push(() => t.removeEventListener(type, fn, o));
  };
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scrollToY = (y: number) => {
    if (env.scrollTo) env.scrollTo(y);
    else window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
  };
  const toEl = (el: HTMLElement, gap = 120) => scrollToY(el.getBoundingClientRect().top + window.scrollY - gap);

  const finder = mountFinder(root, toEl, on);
  const faceOff = mountFaceOff(root, toEl, on, reduced);

  // links within the page: a product, a job
  on(
    root,
    "click",
    (e) => {
      const t = e.target as Element;
      const job = t.closest<HTMLElement>("[data-job-go]");
      if (job) {
        e.preventDefault();
        faceOff.show(job.dataset.jobGo!, true);
        history.replaceState(history.state, "", `#job-${job.dataset.jobGo}`);
        return;
      }
      const prod = t.closest<HTMLElement>("[data-product-go]");
      if (prod) {
        e.preventDefault();
        finder.showProduct(prod.dataset.productGo!);
        history.replaceState(history.state, "", `#${prod.dataset.productGo}`);
      }
    },
    { capture: true },
  );

  // a product, a brand or a job in the address
  const fromHash = () => {
    const h = decodeURIComponent(location.hash.slice(1));
    if (!h) return;
    if (h.startsWith("brand-")) finder.showBrand(h.slice(6));
    else if (h.startsWith("job-")) faceOff.show(h.slice(4), true);
    else if (h === "find") return;
    else finder.showProduct(h);
  };
  on(window, "hashchange", fromHash);
  fromHash();
  offs.push(mountEnquiry(root));
  return () => offs.forEach((f) => f());
}

type On = (t: EventTarget, type: string, fn: (e: Event) => void, o?: AddEventListenerOptions) => void;

/* ------------------------------------------------------------ who makes what, and the list */

function mountFinder(root: HTMLElement, toEl: (el: HTMLElement, gap?: number) => void, on: On) {
  const none = { showProduct: () => {}, showBrand: () => {} };
  const box = root.querySelector<HTMLElement>(".pf");
  if (!box) return none;
  const mx = box.querySelector<HTMLTableElement>(".pf-mx");
  const picks = Array.from(box.querySelectorAll<HTMLButtonElement>("[data-pick]"));
  const chipB = Array.from(box.querySelectorAll<HTMLButtonElement>("[data-chip-brand]"));
  const chipF = Array.from(box.querySelectorAll<HTMLButtonElement>("[data-chip-fam]"));
  const input = box.querySelector<HTMLInputElement>("[data-search]");
  const clearQ = box.querySelector<HTMLButtonElement>("[data-clear-q]");
  const status = box.querySelector<HTMLElement>("[data-status]");
  const state = box.querySelector<HTMLElement>(".pf-state");
  const clears = Array.from(box.querySelectorAll<HTMLButtonElement>("[data-clear]"));
  const empty = box.querySelector<HTMLElement>("[data-empty]");
  const sections = Array.from(box.querySelectorAll<HTMLElement>(".pf-brand"));
  const rows = Array.from(box.querySelectorAll<HTMLElement>(".pf-row"));
  if (!sections.length || !rows.length) return none;

  const brandOf = new Map(rows.map((r) => [r, r.closest<HTMLElement>(".pf-brand")?.dataset.brand ?? ""]));
  const brandName = new Map(sections.map((s) => [s.dataset.brand ?? "", s.querySelector(".pf-bh")?.childNodes[1]?.textContent?.trim() ?? s.dataset.brand ?? ""]));
  const famName = new Map<string, string>();
  box.querySelectorAll<HTMLButtonElement>(".pf-rowh").forEach((b) => famName.set(b.dataset.pick!.split("|")[1]!, b.querySelector("span")?.textContent ?? ""));
  chipF.forEach((c) => c.dataset.label && famName.set(c.dataset.chipFam!, c.dataset.label));
  const lower = (s: string) => (/^[A-Z][a-z]/.test(s) ? s[0]!.toLowerCase() + s.slice(1) : s);
  const listing = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);
  // the grid's numbers as they stand with no search
  const base = new Map<HTMLElement, number>();
  for (const b of picks) base.set(b, Number(b.querySelector("b")?.textContent ?? b.textContent ?? 0));
  for (const c of chipB.concat(chipF)) base.set(c, Number(c.querySelector("span")?.textContent ?? 0));

  /** the brands and kinds picked (none picked: all of them) */
  const brands = new Set<string>();
  const fams = new Set<string>();
  let q = "";
  const inB = (r: HTMLElement) => brands.size === 0 || brands.has(brandOf.get(r) ?? "");
  const inF = (r: HTMLElement) => fams.size === 0 || fams.has(r.dataset.family ?? "");
  /** the one brand or kind picked, or "all" (for the grid, which takes one of each) */
  const one = (xs: Set<string>) => (xs.size === 1 ? [...xs][0]! : "all");
  /** brands opened in full in the list of everything */
  const expanded = new Set<string>();
  const CAP = 6;

  const apply = () => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const hitQ = (r: HTMLElement) => words.every((w) => (r.dataset.q ?? "").includes(w));
    const matchQ = rows.filter(hitQ);
    const shown = matchQ.filter((r) => inB(r) && inF(r));
    const all = brands.size === 0 && fams.size === 0 && !q;
    const brand = one(brands);
    const fam = one(fams);

    rows.forEach((r) => (r.hidden = !shown.includes(r)));
    for (const s of sections) {
      const k = s.dataset.brand ?? "";
      const mine = shown.filter((r) => brandOf.get(r) === k);
      const total = rows.filter((r) => brandOf.get(r) === k).length;
      s.hidden = mine.length === 0;
      const capped = all && !expanded.has(k) && mine.length > CAP;
      if (capped) mine.slice(CAP).forEach((r) => (r.hidden = true));
      const more = s.querySelector<HTMLElement>("[data-more]");
      if (more) more.hidden = !capped;
      const n = s.querySelector<HTMLElement>("[data-bcount]");
      if (n) n.textContent = mine.length === total ? `${total} ${total === 1 ? "product" : "products"}` : `${mine.length} of ${total}`;
    }

    // the grid: what is picked, what lies inside the choice, and (while searching) where the matches are
    const count = (b: string, f: string) => matchQ.filter((r) => (b === "all" || brandOf.get(r) === b) && (f === "all" || r.dataset.family === f)).length;
    const cellMax = Math.max(1, ...picks.filter((p) => p.classList.contains("pf-cell")).map((p) => (q ? count(...(p.dataset.pick!.split("|") as [string, string])) : base.get(p) ?? 0)));
    for (const p of picks) {
      const [b, f] = p.dataset.pick!.split("|") as [string, string];
      p.setAttribute("aria-pressed", String(b === brand && f === fam));
      const n = q ? count(b, f) : base.get(p) ?? 0;
      if (p.classList.contains("pf-cell")) {
        p.textContent = String(n);
        p.style.setProperty("--v", (n / cellMax).toFixed(2));
        p.classList.toggle("is-deep", n / cellMax > 0.45);
        p.classList.toggle("is-in", (brand === "all" || b === brand) && (fam === "all" || f === fam));
        p.disabled = n === 0;
        p.setAttribute("aria-label", `${n} ${brandName.get(b) ?? b}: ${lower(famName.get(f) ?? f)}`);
      } else {
        const t = p.querySelector("b");
        if (t) t.textContent = String(n);
      }
    }
    if (mx) {
      mx.classList.toggle("is-narrow", brand !== "all" || fam !== "all");
      mx.querySelectorAll("tbody tr").forEach((tr) => tr.classList.toggle("is-row", brand !== "all" && fam !== "all" && (tr as HTMLElement).dataset.row === fam));
      mx.querySelectorAll("thead th").forEach((th) => th.classList.toggle("is-col", brand !== "all" && fam !== "all" && th.querySelector<HTMLElement>("[data-pick]")?.dataset.pick === `${brand}|all`));
    }
    // each chip's number: how many it would show alongside what is picked in the other group
    for (const c of chipB) {
      const k = c.dataset.chipBrand!;
      c.setAttribute("aria-pressed", String(k === "all" ? brands.size === 0 : brands.has(k)));
      const n = matchQ.filter((r) => inF(r) && (k === "all" || brandOf.get(r) === k)).length;
      const t = c.querySelector("span");
      if (t) t.textContent = String(n);
      c.toggleAttribute("data-empty", k !== "all" && n === 0 && !brands.has(k));
    }
    for (const c of chipF) {
      const k = c.dataset.chipFam!;
      c.setAttribute("aria-pressed", String(k === "all" ? fams.size === 0 : fams.has(k)));
      const n = matchQ.filter((r) => inB(r) && (k === "all" || r.dataset.family === k)).length;
      const t = c.querySelector("span");
      if (t) t.textContent = String(n);
      c.toggleAttribute("data-empty", k !== "all" && n === 0 && !fams.has(k));
    }

    // how many are ticked in each group
    box.querySelectorAll<HTMLElement>("[data-picked]").forEach((el) => {
      const n = el.dataset.picked === "fam" ? fams.size : brands.size;
      el.textContent = n ? `${n} picked` : "";
    });

    // what is on show, in words
    if (status) {
      const bn = listing([...brands].map((b) => brandName.get(b) ?? b));
      const fn = listing([...fams].map((f) => lower(famName.get(f) ?? f)));
      const n = shown.length;
      const prods = `${n} ${n === 1 ? "product" : "products"}`;
      const from = [...new Set(shown.map((r) => brandName.get(brandOf.get(r) ?? "") ?? ""))];
      let line: string;
      if (q) line = `${n} ${n === 1 ? "product matches" : "products match"} “${q}”${bn ? ` from ${bn}` : ""}${fn ? ` in ${fn}` : ""}.`;
      else if (bn && fn) line = `${prods} from ${bn} in ${fn}.`;
      else if (bn) line = `${brands.size > 1 ? prods : `All ${n}`} ${brands.size > 1 ? `from ${bn}` : `${bn} products`}.`;
      else if (fn) line = `${prods} in ${fn}, from ${listing(from)}.`;
      else line = `All ${n} products, brand by brand.`;
      status.textContent = line;
    }
    clears.forEach((c) => (c.closest("[data-empty]") ? null : (c.hidden = all)));
    if (clearQ) clearQ.hidden = !q;
    if (empty) empty.hidden = shown.length > 0;
  };

  /** after a pick, bring the top of the list into view if it is off the screen */
  const toList = () => {
    if (!state) return;
    const top = state.getBoundingClientRect().top;
    const bar = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-bar")) || 72;
    if (top < bar || top > window.innerHeight * 0.7) toEl(state, bar + 16);
  };
  const pick = (b: string, f: string, scroll = true) => {
    // picking what is already picked lets it go again
    const same = one(brands) === b && one(fams) === f && (b !== "all" || f !== "all");
    brands.clear();
    fams.clear();
    if (!same) {
      if (b !== "all") brands.add(b);
      if (f !== "all") fams.add(f);
    }
    apply();
    if (scroll) requestAnimationFrame(toList);
  };
  const clear = () => {
    brands.clear();
    fams.clear();
    q = "";
    if (input) input.value = "";
    apply();
  };

  on(box, "click", (e) => {
    const t = e.target as Element;
    const p = t.closest<HTMLButtonElement>("[data-pick]");
    if (p) {
      const [b, f] = p.dataset.pick!.split("|") as [string, string];
      pick(b, f);
      return;
    }
    const cb = t.closest<HTMLButtonElement>("[data-chip-brand]");
    if (cb) {
      // more than one can be picked; "All brands" lets them all go
      const k = cb.dataset.chipBrand!;
      if (k === "all") brands.clear();
      else if (brands.has(k)) brands.delete(k);
      else brands.add(k);
      apply();
      return;
    }
    const cf = t.closest<HTMLButtonElement>("[data-chip-fam]");
    if (cf) {
      const k = cf.dataset.chipFam!;
      if (k === "all") fams.clear();
      else if (fams.has(k)) fams.delete(k);
      else fams.add(k);
      apply();
      return;
    }
    if (t.closest("[data-clear]")) {
      clear();
      input?.focus();
      return;
    }
    if (t.closest("[data-clear-q]")) {
      e.preventDefault();
      q = "";
      if (input) {
        input.value = "";
        input.focus();
      }
      apply();
      return;
    }
    const more = t.closest<HTMLElement>("[data-more]");
    if (more) {
      const k = more.closest<HTMLElement>(".pf-brand")?.dataset.brand;
      if (k) expanded.add(k);
      apply();
    }
  });
  if (input)
    on(input, "input", () => {
      q = input.value.trim();
      apply();
    });

  // the grid: the row and the column of the square under the pointer are marked
  if (mx) {
    const mark = (cell: HTMLElement | null) => {
      mx.querySelectorAll(".is-hoverrow,.is-hovercol").forEach((x) => x.classList.remove("is-hoverrow", "is-hovercol"));
      const td = cell?.closest<HTMLTableCellElement>("td[data-col]");
      if (!td) return;
      td.parentElement?.classList.add("is-hoverrow");
      const i = td.cellIndex;
      mx.tHead?.rows[0]?.cells[i]?.classList.add("is-hovercol");
    };
    on(mx, "pointerover", (e) => mark(e.target as HTMLElement));
    on(mx, "pointerleave", () => mark(null));
  }

  const showProduct = (slug: string) => {
    const r = rows.find((x) => x.id === slug);
    if (!r) return;
    const b = brandOf.get(r) ?? "all";
    if (r.hidden) {
      brands.clear();
      fams.clear();
      q = "";
      if (input) input.value = "";
      expanded.add(b);
      apply();
    }
    const d = r.querySelector("details");
    if (d) d.open = true;
    requestAnimationFrame(() => {
      toEl(r, 140);
      r.classList.remove("is-hit");
      void r.offsetWidth;
      r.classList.add("is-hit");
    });
  };
  const showBrand = (k: string) => {
    if (!sections.some((s) => s.dataset.brand === k)) return;
    brands.clear();
    brands.add(k);
    fams.clear();
    apply();
    requestAnimationFrame(() => toEl(box, 110));
  };

  apply();
  return { showProduct, showBrand };
}

/* ------------------------------------------------------------ same job, different brands */

function mountFaceOff(root: HTMLElement, toEl: (el: HTMLElement, gap?: number) => void, on: On, reduced: boolean) {
  const fo = root.querySelector<HTMLElement>(".fo");
  const jobTabs = Array.from(root.querySelectorAll<HTMLAnchorElement>("[data-job-tab]"));
  const jobPanels = Array.from(root.querySelectorAll<HTMLElement>(".fo-panel"));
  const jobList = root.querySelector<HTMLElement>(".fo-glist");
  const jobSel = root.querySelector<HTMLSelectElement>("select[data-job-select]");
  /** show one job's table, and mark it in the list of jobs */
  const show = (k: string, scroll: boolean) => {
    const panel = jobPanels.find((p) => p.dataset.job === k);
    if (!panel) return;
    jobTabs.forEach((t) => (t.dataset.jobTab === k ? t.setAttribute("aria-current", "true") : t.removeAttribute("aria-current")));
    jobPanels.forEach((p) => (p.hidden = p !== panel));
    // on phones the jobs are one row that scrolls sideways: bring the chosen one into view
    const tab = jobTabs.find((t) => t.dataset.jobTab === k);
    if (tab && jobList && jobList.scrollWidth > jobList.clientWidth + 2) {
      const l = jobList.getBoundingClientRect();
      const r = tab.getBoundingClientRect();
      if (r.left < l.left + 16 || r.right > l.right - 16) jobList.scrollBy({ left: r.left - l.left - (l.width - r.width) / 2, behavior: reduced ? "auto" : "smooth" });
    }
    if (jobSel && jobSel.value !== k) {
      jobSel.value = k;
      jobSel.dispatchEvent(new Event("fs-sync"));
    }
    if (scroll && fo) requestAnimationFrame(() => toEl(fo, 100));
  };
  // the list of jobs above the table, drawn by the page rather than the browser
  if (jobSel) fancySelect(jobSel, on, "fs--job");
  if (jobSel)
    on(jobSel, "change", () => {
      show(jobSel.value, false);
      history.replaceState(history.state, "", `#job-${jobSel.value}`);
    });
  if (fo && jobPanels.length) {
    show(jobPanels[0]!.dataset.job!, false);
    // the up and down arrows move along the list of jobs
    jobTabs.forEach((t, i) =>
      on(t, "keydown", (e) => {
        const key = (e as KeyboardEvent).key;
        const n = key === "ArrowDown" || key === "ArrowRight" ? 1 : key === "ArrowUp" || key === "ArrowLeft" ? -1 : 0;
        if (!n) return;
        e.preventDefault();
        const next = jobTabs[(i + n + jobTabs.length) % jobTabs.length]!;
        next.focus();
        show(next.dataset.jobTab!, false);
        history.replaceState(history.state, "", `#job-${next.dataset.jobTab}`);
      }),
    );
    // (caught on the way down, before the pages' shared link handling glides to the anchor)
    on(
      root,
      "click",
      (e) => {
        const p = (e.target as Element).closest<HTMLElement>("[data-job-tab]");
        if (!p) return;
        e.preventDefault();
        show(p.dataset.jobTab!, false);
        history.replaceState(history.state, "", `#job-${p.dataset.jobTab}`);
      },
      { capture: true },
    );
  }
  jobPanels.forEach((panel) => mountHeadToHead(panel, on));
  return { show };
}

interface Side {
  b: string;
  c: string;
  n: string;
  f: string;
  cat: string;
  does: string;
  uses: string[];
  note: string;
  by: string;
  ps: string;
  rate: string;
}

/**
 * One job's comparison: a list above each column picks its product (picking the
 * other column's product swaps the two), and the table's rows follow, marking
 * the rows the two share.
 */
function mountHeadToHead(panel: HTMLElement, on: On) {
  const raw = panel.querySelector<HTMLScriptElement>(".h2-data")?.textContent;
  if (!raw) return;
  const { sides } = JSON.parse(raw) as { sides: Record<string, Side> };
  const pick = { a: panel.dataset.a!, b: panel.dataset.b! };
  const sels = Array.from(panel.querySelectorAll<HTMLSelectElement>("select[data-h2]"));
  sels.forEach((sel) => fancySelect(sel, on, "fs--h2"));
  const list = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);
  const valueOf = (k: string, x: Side) =>
    k === "uses" ? (x.uses.length ? list(x.uses.map((u, i) => (i ? u.toLowerCase() : u))) : x.note || "Not listed") : k === "brand" ? x.b : String(x[k as "cat" | "does" | "by" | "ps"]);

  const render = () => {
    const A = sides[pick.a];
    const B = sides[pick.b];
    if (!A || !B) return;
    sels.forEach((sel) => {
      sel.value = sel.dataset.h2 === "a" ? pick.a : pick.b;
      sel.dispatchEvent(new Event("fs-sync"));
    });
    panel.querySelectorAll<HTMLTableRowElement>("tbody tr[data-row]").forEach((tr) => {
      const k = tr.dataset.row!;
      const va = valueOf(k, A);
      const vb = valueOf(k, B);
      tr.classList.toggle("is-same", k !== "brand" && k !== "ps" && va === vb);
      (["a", "b"] as const).forEach((s) => {
        const td = tr.querySelector<HTMLElement>(`td[data-s=${s}]`);
        if (!td) return;
        td.querySelector("span")!.textContent = s === "a" ? va : vb;
        const dot = td.querySelector<HTMLElement>("i");
        if (dot) dot.style.background = (s === "a" ? A : B).c;
      });
    });
    (["a", "b"] as const).forEach((s) => {
      const x = s === "a" ? A : B;
      const rate = panel.querySelector<HTMLAnchorElement>(`tfoot a[data-s=${s}]`);
      if (rate) {
        rate.href = x.rate;
        rate.querySelector(".h2-rn")!.textContent = `for ${x.n}`;
      }
    });
  };

  sels.forEach((sel) =>
    on(sel, "change", () => {
      const side = sel.dataset.h2 as "a" | "b";
      const other = side === "a" ? "b" : "a";
      if (sel.value === pick[other]) pick[other] = pick[side];
      pick[side] = sel.value;
      render();
    }),
  );
}

/* ------------------------------------------------------------ the enquiry */

interface Line {
  /** the product's slug */
  k: string;
  /** which of its packs */
  p: number;
  /** how many packs */
  n: number;
}

/** the enquiry: add products from their rows, choose each one's pack and how many, then ask for all their rates in one WhatsApp message */
function mountEnquiry(root: HTMLElement): Off {
  const dock = root.querySelector<HTMLElement>("[data-rl]");
  const adds = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-add]"));
  if (!dock || !adds.length) return () => {};
  const KEY = "rpc-rate-list";
  const wa = dock.dataset.wa ?? "";
  const count = dock.querySelector<HTMLElement>("[data-rl-n]");
  const send = dock.querySelector<HTMLAnchorElement>("[data-rl-send]");
  const open = dock.querySelector<HTMLElement>("[data-rl-open]");
  const lines = dock.querySelector<HTMLOListElement>("[data-rl-lines]");
  const toggle = dock.querySelector<HTMLButtonElement>("[data-rl-toggle]");
  const info = new Map(adds.map((b) => [b.dataset.add ?? "", { label: b.dataset.label ?? "", packs: (b.dataset.packs ?? "").split("|").filter(Boolean) }]));
  const list: Line[] = [];
  const clampN = (n: unknown) => Math.min(999, Math.max(1, Math.round(Number(n)) || 1));
  try {
    const kept: unknown = JSON.parse(sessionStorage.getItem(KEY) ?? "[]");
    if (Array.isArray(kept))
      for (const x of kept) {
        // an older list kept the products' names only
        const l: Line | null = typeof x === "string" ? { k: x, p: 0, n: 1 } : x && typeof x === "object" && typeof (x as Line).k === "string" ? { k: (x as Line).k, p: Number((x as Line).p) || 0, n: clampN((x as Line).n) } : null;
        const it = l && info.get(l.k);
        if (l && it && !list.some((y) => y.k === l.k)) list.push({ ...l, p: l.p < it.packs.length ? l.p : 0 });
      }
  } catch {
    /* storage may be off: the list simply starts empty */
  }
  const save = () => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(list));
    } catch {
      /* the list still works for this page */
    }
  };
  const cross = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;
  const setOpen = (o: boolean) => {
    if (!open || !toggle) return;
    open.hidden = !o;
    toggle.setAttribute("aria-expanded", String(o));
  };
  /** a line as the WhatsApp message gives it: "Fosroc Nitobond EP: 2 × 4 L" */
  const words = (l: Line) => {
    const it = info.get(l.k);
    const pack = it?.packs[l.p] ?? it?.packs[0] ?? "";
    return `${it?.label ?? l.k}: ${l.n} × ${pack}`;
  };
  const updateSend = () => {
    if (!send) return;
    send.href = rateHref(wa, list.map(words));
    send.setAttribute("aria-label", list.length === 1 ? "Ask for this product’s rate on WhatsApp" : `Ask for the rates of these ${list.length} products on WhatsApp`);
  };
  const lineEl = (l: Line) => {
    const it = info.get(l.k)!;
    const li = document.createElement("li");
    li.dataset.k = l.k;
    const name = document.createElement("span");
    name.className = "rl-name";
    name.textContent = it.label;
    const ctl = document.createElement("span");
    ctl.className = "rl-ctl";
    if (it.packs.length > 1) {
      const sel = document.createElement("select");
      sel.className = "rl-pack";
      sel.dataset.rlPack = l.k;
      sel.setAttribute("aria-label", `Pack of ${it.label}`);
      it.packs.forEach((p, i) => sel.append(new Option(p, String(i), false, i === l.p)));
      ctl.append(sel);
    } else {
      const one = document.createElement("span");
      one.className = "rl-onepack";
      one.textContent = it.packs[0] ?? "";
      ctl.append(one);
    }
    const qty = document.createElement("span");
    qty.className = "rl-qty";
    qty.innerHTML = `<button type="button" data-rl-dec aria-label="One fewer ${it.label.replace(/"/g, "")}">−</button><input type="number" inputmode="numeric" min="1" max="999" data-rl-n-of="${l.k}" aria-label="How many packs of ${it.label.replace(/"/g, "")}"><button type="button" data-rl-inc aria-label="One more ${it.label.replace(/"/g, "")}">+</button>`;
    qty.querySelector("input")!.value = String(l.n);
    const rm = document.createElement("button");
    rm.type = "button";
    rm.className = "rl-rm";
    rm.dataset.rlRemove = l.k;
    rm.setAttribute("aria-label", `Remove ${it.label}`);
    rm.innerHTML = cross;
    ctl.append(qty, rm);
    li.append(name, ctl);
    return li;
  };
  const render = (bump = false) => {
    for (const b of adds) {
      const k = b.dataset.add ?? "";
      const yes = list.some((l) => l.k === k);
      const label = info.get(k)?.label ?? "";
      b.hidden = false;
      b.classList.toggle("is-on", yes);
      b.setAttribute("aria-pressed", String(yes));
      b.setAttribute("aria-label", yes ? `Remove ${label} from your enquiry` : `Add ${label} to your enquiry`);
      const t = b.querySelector("span");
      if (t) t.textContent = yes ? "Added" : "Add";
    }
    const n = list.length;
    dock.hidden = n === 0;
    if (n === 0) setOpen(false);
    if (count) {
      count.textContent = String(n);
      if (bump) {
        count.classList.remove("is-bump");
        void count.offsetWidth;
        count.classList.add("is-bump");
        window.setTimeout(() => count.classList.remove("is-bump"), 260);
      }
    }
    if (lines) lines.replaceChildren(...list.map(lineEl));
    updateSend();
    // the leak helper in the corner steps aside while the enquiry is up
    document.documentElement.dataset.ratelist = n ? "1" : "";
    window.dispatchEvent(new CustomEvent("rpc:ratelist", { detail: { count: n } }));
  };
  const lineOf = (el: Element) => list.find((l) => l.k === el.closest<HTMLElement>("li[data-k]")?.dataset.k);
  const setQty = (l: Line, n: number) => {
    l.n = clampN(n);
    const input = lines?.querySelector<HTMLInputElement>(`li[data-k="${CSS.escape(l.k)}"] input`);
    if (input && input.value !== String(l.n)) input.value = String(l.n);
    save();
    updateSend();
  };

  const onAdd = (e: Event) => {
    const b = (e.target as Element).closest<HTMLButtonElement>("[data-add]");
    if (!b || !root.contains(b)) return;
    const k = b.dataset.add ?? "";
    const i = list.findIndex((l) => l.k === k);
    if (i >= 0) list.splice(i, 1);
    else list.push({ k, p: 0, n: 1 });
    save();
    render(i < 0);
  };
  const onDock = (e: Event) => {
    const t = e.target as Element;
    const rm = t.closest<HTMLButtonElement>("[data-rl-remove]");
    if (rm) {
      const i = list.findIndex((l) => l.k === rm.dataset.rlRemove);
      if (i >= 0) list.splice(i, 1);
      save();
      render();
      if (list.length) lines?.querySelector<HTMLElement>("button, select, input")?.focus();
      else toggle?.focus();
      return;
    }
    const step = t.closest<HTMLButtonElement>("[data-rl-inc],[data-rl-dec]");
    if (step) {
      const l = lineOf(step);
      if (l) setQty(l, l.n + (step.hasAttribute("data-rl-inc") ? 1 : -1));
      return;
    }
    if (t.closest("[data-rl-clear]")) {
      list.length = 0;
      save();
      render();
      return;
    }
    if (t.closest("[data-rl-toggle]")) setOpen(toggle?.getAttribute("aria-expanded") !== "true");
  };
  const onChange = (e: Event) => {
    const t = e.target as HTMLElement;
    const l = lineOf(t);
    if (!l) return;
    if (t instanceof HTMLSelectElement) {
      l.p = Number(t.value) || 0;
      save();
      updateSend();
    } else if (t instanceof HTMLInputElement) setQty(l, Number(t.value));
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" && toggle?.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  };
  root.addEventListener("click", onAdd);
  dock.addEventListener("click", onDock);
  dock.addEventListener("change", onChange);
  dock.addEventListener("keydown", onKey);
  render();
  return () => {
    root.removeEventListener("click", onAdd);
    dock.removeEventListener("click", onDock);
    dock.removeEventListener("change", onChange);
    dock.removeEventListener("keydown", onKey);
    document.documentElement.dataset.ratelist = "";
    window.dispatchEvent(new CustomEvent("rpc:ratelist", { detail: { count: 0 } }));
  };
}
