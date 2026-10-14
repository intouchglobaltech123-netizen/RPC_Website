/**
 * Products page, a counter to find a product and ask its rate.
 *
 *   opening    the shared inner-page banner: what we supply, in a line, the ways
 *              in, and the packs on the list drawn on a blueprint board
 *   find       a filter panel (kind of product, brand) beside every product as
 *              cards, brand by brand, with a search (lib/pages/products-finder.ts)
 *   by job     "same job, different brands": the jobs for which we stock more
 *              than one brand, listed by the kind of work; pick one, then any two
 *              of its products, and they face each other in one table, with
 *              what they share marked and what differs standing out.
 *   brands     the brands in the methods guide, moving slowly
 *   close      before you buy, and the ways to ask
 *   enquiry    products added from their cards ride in a bar at the foot of the
 *              screen, each with its pack and how many, and go to RPC on
 *              WhatsApp as one message
 *
 * Colour: white and light grey grounds, deep blue for structure (the eyebrows,
 * the table head, the drawings), orange only on what can be pressed or is
 * picked. Product facts come only from RPC's spreadsheet; it lists no prices,
 * so every rate is asked for on WhatsApp. Links: /products#<slug> opens that
 * product, #brand-<key> a brand, #job-<key> a job.
 */
import { FANCY_SELECT_CSS } from "./fancy-select";
import { PRODUCT_COUNT, rateLink, type Product } from "../products";
import { brandInfo, brandMark, jobGroup, jobs, type JobView } from "../products/brands";
import { cap, fullName, shortName, useTerms, usesNote } from "../products/compare";
import { packArt } from "../products/pack-art";
import { arrow, arrowDown, banner, ctaBand, esc, listing, mark, secHead, waGlyph, words, type ContactInfo } from "./kit";
import { enquiryMarkup, FINDER_CSS, finderMarkup } from "./products-finder";
import { brandsMarqueeHtml, BRANDS_MARQUEE_CSS } from "../methods/brand-logos";

export interface ProductsData {
  products: readonly Product[];
  contact: ContactInfo;
}

export const PRODUCTS_TRAIL = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
] as const;


export { packIcon } from "../products/packs";

/* ------------------------------------------------------------ the opening's picture */

/**
 * The packs on the list, drawn on two ruled shelves on a blueprint board: one
 * of each common kind of pack, each labelled with a real pack size from the
 * sheet. `w` is each drawing's share of its shelf.
 */
const SHELVES = [
  [
    { shape: "bag", w: 30, word: "sacks" },
    { shape: "drum", w: 33, word: "drums" },
    { shape: "pail", w: 30, word: "pails" },
  ],
  [
    { shape: "can", w: 30, word: "cans" },
    { shape: "kit", w: 33, word: "kits" },
    { shape: "roll", w: 30, word: "membrane rolls" },
  ],
] as const;

function shelf(ps: readonly Product[]) {
  const packs = ps.flatMap((p) => p.packs);
  const rows = SHELVES.map((row) =>
    row.flatMap((s) => {
      const k = packs.find((x) => x.shape === s.shape);
      return k ? [{ ...s, size: k.size }] : [];
    }),
  ).filter((r) => r.length);
  const words = rows.flat().map((x) => x.word);
  return `<figure class="pr-shelf" role="img" aria-label="Drawings of the packs on our list: ${esc(listing(words))}">${rows
    .map(
      (r) => `<ul class="pr-row" data-rv-stagger>${r
        .map((x) => `<li data-rv style="--w:${x.w}%">${packArt(`hero-${x.shape}`, x.shape, x.shape === "drum" ? "var(--theme-primary-dark)" : "var(--theme-primary)", x.size)}</li>`)
        .join("")}</ul>`,
    )
    .join("")}</figure>`;
}

/* ------------------------------------------------------------ same job, different brands */

/**
 * One job, head to head: a list above each column picks the product, and the
 * table's rows say what each is: the brand, the type, what it does, where it is
 * listed for and the packs. A row the two share is marked "Same" and kept
 * quiet, so what differs stands out. The rest happens in the browser
 * (products-page.ts), from the job's facts set out below the panel as JSON.
 */
const ROWS = [
  { k: "brand", label: "Brand" },
  { k: "cat", label: "Type" },
  { k: "does", label: "What it does" },
  { k: "uses", label: "Used for" },
  { k: "ps", label: "Pack sizes" },
] as const;

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

function sideOf(p: Product, c: ContactInfo): Side {
  return {
    b: p.brand,
    c: brandMark(p.brand),
    n: shortName(p),
    f: fullName(p),
    cat: p.category,
    does: p.purpose,
    uses: useTerms(p).map(cap),
    note: usesNote(p),
    by: p.customers,
    ps: p.packs.map((k) => k.size).join(" · "),
    rate: rateLink(c.whatsapp, [p]),
  };
}

/** a row's value for one side, in plain words */
const valueOf = (k: (typeof ROWS)[number]["k"], x: Side) =>
  k === "uses" ? (x.uses.length ? listing(x.uses.map((u, i) => (i ? u.toLowerCase() : u))) : x.note || "Not listed") : k === "brand" ? x.b : x[k];

/** the table's rows for two products; a row the two share says so */
function compareRows(a: Side, b: Side) {
  return ROWS.map((r) => {
    const va = valueOf(r.k, a);
    const vb = valueOf(r.k, b);
    const same = r.k !== "brand" && r.k !== "ps" && va === vb;
    const cellOf = (x: Side, v: string, s: "a" | "b") => `<td data-s="${s}">${r.k === "brand" ? `<i style="background:${x.c}"></i>` : ""}<span>${esc(v)}</span></td>`;
    return `<tr data-row="${r.k}"${same ? ` class="is-same"` : ""}><th scope="row">${r.label}<em>Same</em></th>${cellOf(a, va, "a")}${cellOf(b, vb, "b")}</tr>`;
  }).join("");
}

/**
 * One job's products compared two at a time: a navy head (how many, and a way
 * to ask for every rate), a list above each column to pick the product, and the
 * table below saying, row by row, what each is.
 */
function faceOff(j: JobView, c: ContactInfo) {
  const n = j.products.length;
  const pa = j.brands[0]!.products[0]!;
  const pb = j.brands[1]!.products[0]!;
  const sides: Record<string, Side> = Object.fromEntries(j.products.map((p) => [p.slug, sideOf(p, c)]));
  const A = sides[pa.slug]!;
  const B = sides[pb.slug]!;
  // every product of the job in one list, brand by brand, for each column to pick from
  const options = (sel: string) =>
    j.brands.map((br) => `<optgroup label="${esc(br.name)}">${br.products.map((p) => `<option value="${p.slug}"${p.slug === sel ? " selected" : ""}>${esc(shortName(p))}</option>`).join("")}</optgroup>`).join("");
  const pick = (s: "a" | "b", sel: string) =>
    `<th scope="col" data-s="${s}"><label class="cmp-pick"><span>Product ${s === "a" ? 1 : 2}</span><select class="h2-sel" data-h2="${s}">${options(sel)}</select></label></th>`;
  const rate = (s: "a" | "b", x: Side) =>
    `<td data-s="${s}"><a class="fo-rate" data-s="${s}" href="${esc(x.rate)}" target="_blank" rel="noopener noreferrer">${waGlyph}Ask the rate<span class="h2-rn">for ${esc(x.n)}</span></a></td>`;
  const data = JSON.stringify({ sides }).replace(/</g, "\\u003c");
  return `<article class="fo-panel" id="job-${j.key}" data-job="${j.key}" data-a="${pa.slug}" data-b="${pb.slug}" aria-labelledby="fo-t-${j.key}">
  <header class="fo-ph">
    <div>
      <h3 class="fo-jt sr-only" id="fo-t-${j.key}">${esc(j.name)}</h3>
      <p class="fo-k">${n} products from ${esc(listing(j.brands.map((b) => b.name)))}. Choose any two below.</p>
    </div>
    <a class="fo-all" href="${esc(rateLink(c.whatsapp, j.products))}" target="_blank" rel="noopener noreferrer">${waGlyph}Ask for all ${n} rates</a>
  </header>
  <div class="cmp-wrap" aria-live="polite">
    <table class="cmp-t">
      <caption class="sr-only">${esc(j.name)}: two products compared</caption>
      <thead><tr><td></td>${pick("a", pa.slug)}${pick("b", pb.slug)}</tr></thead>
      <tbody>${compareRows(A, B)}</tbody>
      <tfoot><tr><td></td>${rate("a", A)}${rate("b", B)}</tr></tfoot>
    </table>
  </div>
  <script type="application/json" class="h2-data">${data}</script>
</article>`;
}

function byJobMarkup(js: readonly JobView[], c: ContactInfo) {
  // the jobs in one list, grouped by the kind of work
  const groups = [...new Set(js.map(jobGroup))];
  const jobOptions = groups
    .map((g) => `<optgroup label="${esc(g)}">${js.filter((j) => jobGroup(j) === g).map((j, i) => `<option value="${j.key}"${g === groups[0] && i === 0 ? " selected" : ""}>${esc(j.name)} (${j.products.length})</option>`).join("")}</optgroup>`)
    .join("");
  return `<section class="pg-sec pg-seam fo-sec" id="by-job" aria-labelledby="fo-h">
  <div class="pg-wrap">
    <header class="pg-shead pg-shead--split fo-top">
      <div class="pg-shl">
        ${mark("", "Same job, different brands")}
        <h2 class="pg-h2" id="fo-h" data-rv="words">${words("Compare two products side by side.", 3)}</h2>
        <p class="pg-lede" data-rv>Pick a job, then any two of its products. Rows the two share are marked “Same”, so what differs stands out.</p>
      </div>
      <div class="pg-sextra" data-rv>
        <label class="fo-pickjob"><span>Job</span><select data-job-select>${jobOptions}</select></label>
      </div>
    </header>
    <div class="fo" data-rv><div class="fo-stage">${js.map((j) => faceOff(j, c)).join("\n")}</div></div>
  </div>
</section>`;
}

/* ------------------------------------------------------------ the page */

export function productsPageMarkup(d: ProductsData) {
  const bs = brandInfo(d.products);
  const js = jobs(d.products);
  const head = banner({
    label: "Products",
    n: "01",
    title: "Waterproofing products and construction chemicals, by&nbsp;brand.",
    accentFrom: 5,
    intro: `${PRODUCT_COUNT} products from ${esc(listing(bs.map((b) => b.name)))}, all on RPC’s list. Find one by kind or brand, compare two for the same job, and ask for today’s rate on WhatsApp.`,
    actions: `<a class="pg-btn pg-btn--ink" href="#find">Find a product${arrowDown}</a><a class="pg-btn pg-btn--line" href="#by-job">Compare brands by job</a><a class="pg-btn pg-btn--line" href="#brands">Brands</a>`,
    media: shelf(d.products),
    fact: { n: String(PRODUCT_COUNT), label: `products from ${bs.length} brands` },
    cls: "pr-head",
  });
  const brands = `<section class="pg-sec pg-sec--white pg-seam pr-bsec" id="brands" aria-labelledby="pr-b-h">
  <div class="pg-wrap">
    ${secHead({ label: "Brands", title: `The brands in our <span class="pg-acc">methods guide.</span>`, id: "pr-b-h", center: true, extra: `<a class="pg-link" href="/waterproofing#methods" data-internal>Open the methods guide${arrow}</a>` })}
    <div data-rv>${brandsMarqueeHtml()}</div>
  </div>
</section>`;
  return `${head}
${finderMarkup(bs, d.contact, js, PRODUCT_COUNT)}
${byJobMarkup(js, d.contact)}
${brands}
${ctaBand(d.contact, {
  title: "Need a quantity or a rate?",
  steps: [
    ["Send the product and quantity", "Add products here with their packs and how many, or tell us on WhatsApp or by phone."],
    ["We reply with today’s rate", "Rates change with the market, so we quote on the day."],
    ["Check it suits the job", "Not sure it is the right product? Ask us before you buy."],
  ],
})}
${enquiryMarkup(d.contact)}`;
}

/* the browser's own lists (before the page's scripts draw theirs): a chevron drawn in CSS, so it takes the theme's colour */
const CHEV_BG = `background-image:linear-gradient(45deg,transparent 50%,var(--mute) 50%),linear-gradient(135deg,var(--mute) 50%,transparent 50%);background-repeat:no-repeat;background-size:5px 5px,5px 5px`;

export const PRODUCTS_CSS = FINDER_CSS + FANCY_SELECT_CSS + BRANDS_MARQUEE_CSS + `
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}

/* ═══ the opening: the shared banner; the packs on the list drawn on a blueprint board ═══ */
.pr-head .pg-h1{max-width:20ch}
.pr-head .pg-btn--ink:hover>.pg-ar{transform:translateY(2px)}
.pr-shelf{position:relative;display:grid;grid-template-rows:repeat(2,minmax(0,1fr));row-gap:calc(14px + 4%);margin:0;padding:5% 5% calc(9% + 14px);aspect-ratio:4/3;overflow:hidden;border-radius:var(--r-card);background-color:var(--theme-surface-2);background-image:radial-gradient(ellipse 60% 48% at 50% 55%,var(--theme-surface) 0,transparent 72%),linear-gradient(var(--bp) 1px,transparent 1px),linear-gradient(90deg,var(--bp) 1px,transparent 1px);background-size:100% 100%,24px 24px,24px 24px;box-shadow:inset 0 0 0 1px var(--line);clip-path:polygon(var(--cut) 0,100% 0,100% 100%,0 100%,0 var(--cut))}
/* a shelf: the packs stand on a hairline with measuring ticks under it */
.pr-row{position:relative;display:flex;align-items:flex-end;justify-content:space-evenly;min-height:0;margin:0;padding:0;list-style:none}
.pr-row::after{content:"";position:absolute;left:0;right:0;top:100%;height:14px;background:linear-gradient(color-mix(in srgb,var(--theme-ink) 22%,transparent),color-mix(in srgb,var(--theme-ink) 22%,transparent)) top left/100% 1px no-repeat,repeating-linear-gradient(90deg,var(--tick) 0 1px,transparent 1px 80px) top left/100% 12px no-repeat,repeating-linear-gradient(90deg,var(--tick) 0 1px,transparent 1px 40px) top left/100% 8px no-repeat,repeating-linear-gradient(90deg,var(--tick) 0 1px,transparent 1px 8px) top left/100% 5px no-repeat;pointer-events:none}
.pr-row li{position:relative;z-index:1;flex:none;width:var(--w);max-height:100%}
/* each drawing's floor (y 103 of 120) sits on the shelf: the picture hangs 14% of its width below the row */
.pr-row svg{display:block;width:100%;height:auto;margin-bottom:-14%}
@media (max-width:899px){
  .pr-shelf{aspect-ratio:16/10;padding-inline:9%}
}
@media (max-width:599px){
  /* phones: a squarer board, the lower shelf lifted clear of the fact chip */
  .pr-shelf{aspect-ratio:4/3;padding:6% 7% 66px}
}

/* ═══ same job, different brands: the job chosen beside the heading, then one table ═══ */
.fo-top{margin-bottom:clamp(1.6rem,4vh,2.4rem)}
.fo-top .pg-lede{margin-top:0}
.fo-pickjob{display:flex;flex-direction:column;gap:.4rem;width:27rem;max-width:100%}
.fo-pickjob>span{font-size:var(--fs-body);font-weight:600;color:var(--mute)}
.fo-pickjob select{width:100%;height:3.25rem;padding:0 2.6rem 0 1.3rem;border:0;border-radius:var(--r-pill);background-color:var(--theme-surface);${CHEV_BG};background-position:calc(100% - 1.45rem) 50%,calc(100% - 1.15rem) 50%;box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--theme-ink) 24%,transparent);font:inherit;font-size:var(--fs-body);font-weight:600;color:var(--ink);appearance:none;-webkit-appearance:none;cursor:pointer}
.fo-pickjob .fs{width:100%}
.fo-pickjob .fs-btn{box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--theme-ink) 24%,transparent)}
.fo-pickjob .fs-btn:hover{box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--theme-ink) 45%,transparent)}
.fo-pickjob .fs-btn[aria-expanded=true]{box-shadow:inset 0 0 0 2px var(--accent)}
.fo{display:block}
/* a job: a white, chamfered panel whose head (the count and the table's head) is deep blue, hatched along its top */
.fo-panel{position:relative;overflow:hidden;border-radius:var(--r-card);background:var(--theme-surface);box-shadow:inset 0 0 0 1px var(--line);clip-path:polygon(var(--cut) 0,100% 0,100% 100%,0 100%,0 var(--cut));scroll-margin-top:calc(var(--nav-bar,64px) + 1rem)}
.fo-panel[hidden]{display:none}
.fo-panel + .fo-panel{margin-top:1.4rem}
.fo-ph{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.8rem 1.4rem;padding:calc(1rem + 12px) clamp(1rem,2.2vw,1.6rem) .95rem;background:var(--hatch-img) 0 0/100% 12px no-repeat,var(--navy);color:var(--theme-on-dark)}
.fo-jt{margin:0;font-family:var(--display);font-weight:600;font-size:var(--fs-sub);line-height:1.25}
.fo-k{margin:0;font-size:var(--fs-body);line-height:1.5;color:var(--band-mute)}
/* asking for rates: outlined pills with the WhatsApp mark; an orange ring under the pointer */
.fo-all,.fo-rate{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:.5rem;min-height:2.6rem;padding:.35rem 1.15rem .35rem .95rem;border-radius:var(--r-pill);box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--theme-ink) 24%,transparent);font-size:var(--fs-body);font-weight:600;line-height:1.25;color:var(--ink);text-decoration:none;transition:box-shadow .3s var(--ease),background-color .3s var(--ease)}
.fo-rate:hover{box-shadow:inset 0 0 0 1.5px var(--act);background:color-mix(in srgb,var(--act) 10%,transparent)}
.fo-all{white-space:nowrap;box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--theme-white) 45%,transparent);color:var(--theme-white)}
.fo-all:hover{box-shadow:inset 0 0 0 1.5px var(--act);background:color-mix(in srgb,var(--theme-white) 6%,transparent)}
.pg .fo-ph :focus-visible,.pg .cmp-t thead :focus-visible{outline-color:var(--theme-focus-on-dark)}
/* the table: its head continues the navy; the two product lists are white controls in it */
.cmp-wrap{overflow-x:auto}
.cmp-t{width:100%;min-width:34rem;border-collapse:collapse;table-layout:fixed;font-size:var(--fs-body)}
.cmp-t thead td,.cmp-t tbody th,.cmp-t tfoot td:first-child{width:11.5rem}
.cmp-t th,.cmp-t td{padding:.85rem clamp(.85rem,1.6vw,1.3rem);text-align:left;vertical-align:top;line-height:1.5}
.cmp-t thead th,.cmp-t thead td{padding-top:.35rem;padding-bottom:1.25rem;background:var(--navy);vertical-align:bottom}
.cmp-pick{display:flex;flex-direction:column;gap:.45rem}
.cmp-pick>span{font-size:var(--fs-body);font-weight:600;color:var(--band-mute)}
.cmp-pick .h2-sel{width:100%;min-height:2.75rem;padding:.45rem 2.2rem .45rem .95rem;border:0;border-radius:var(--r-ctl);background-color:var(--theme-surface);${CHEV_BG};background-position:calc(100% - 1.15rem) 50%,calc(100% - .85rem) 50%;font:inherit;font-size:var(--fs-body);font-weight:600;line-height:1.25;color:var(--ink);text-align:left;appearance:none;-webkit-appearance:none;cursor:pointer}
.h2-sel option,.h2-sel optgroup{font-family:var(--sans);font-size:16px;color:var(--theme-ink)}
.cmp-pick .fs-btn{min-height:2.75rem;padding:.45rem .85rem .45rem .95rem;border-radius:var(--r-ctl);box-shadow:none}
.cmp-pick .fs-btn:hover{background:var(--theme-primary-soft);box-shadow:none}
.cmp-pick .fs-btn[aria-expanded=true]{box-shadow:inset 0 0 0 2px var(--accent)}
.cmp-pick .fs-val{white-space:normal;overflow-wrap:anywhere}
.cmp-t thead th[data-s=b],.cmp-t tbody td[data-s=b],.cmp-t tfoot td[data-s=b]{border-left:1px solid var(--line)}
.cmp-t thead th[data-s=b]{border-left-color:color-mix(in srgb,var(--theme-white) 14%,transparent)}
/* the rows: hairline-divided; a row the two share is marked "Same" in pale blue and kept quiet */
.cmp-t tbody tr{border-top:1px solid var(--line);transition:background-color .2s var(--ease)}
.cmp-t tbody tr:first-child{border-top:0}
.cmp-t tbody tr:hover{background:color-mix(in srgb,var(--theme-primary-soft) 55%,transparent)}
.cmp-t tbody th{font-weight:600;color:var(--mute)}
.cmp-t tbody td{color:var(--ink)}
.cmp-t tbody th em{display:none;width:max-content;padding:.1rem .55rem;border-radius:var(--r-pill);background:var(--theme-primary-soft);font-style:normal;font-weight:600;color:var(--navy)}
.cmp-t tbody tr.is-same th em{display:inline-block;margin:0 0 0 .5rem;vertical-align:.05rem}
.cmp-t tbody tr.is-same td{color:var(--mute)}
.cmp-t tbody tr[data-row=brand] td{font-weight:600}
/* the brand's mark: a small blue diamond (the scripts' brand colours are set aside) */
.cmp-t tbody tr[data-row=brand] i{display:inline-block;width:.5rem;height:.5rem;margin:0 .65rem 0 .1rem;background:var(--accent)!important;transform:rotate(45deg);vertical-align:.12rem}
.cmp-t tfoot tr{border-top:1px solid var(--line)}
.cmp-t tfoot td{padding-top:.95rem;padding-bottom:1.1rem;vertical-align:middle}
.cmp-t .fo-rate{max-width:100%;white-space:normal}
.cmp-t .h2-rn{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
@media (max-width:1023px){
  /* tablets and phones: the job list goes under the heading */
  .fo-top{grid-template-columns:minmax(0,1fr)}
  .fo-top>.pg-sextra{justify-self:start;width:100%}
}
@media (max-width:767px){
  .fo-pickjob{width:100%}
}
@media (max-width:699px){
  /* phones: each row's name above, the two products side by side below it */
  .cmp-wrap{overflow:visible}
  .cmp-t{min-width:0;table-layout:auto}
  .cmp-t thead,.cmp-t tbody,.cmp-t tfoot{display:block}
  .cmp-t thead{background:var(--navy)}
  .cmp-t tr{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
  .cmp-t thead td:first-child,.cmp-t tfoot td:first-child{display:none}
  .cmp-t th,.cmp-t td{width:auto!important;padding:.55rem .8rem;overflow-wrap:anywhere}
  .cmp-t thead th{padding-bottom:1rem}
  .cmp-t tbody th{grid-column:1/-1;padding-top:.75rem;padding-bottom:0}
  .cmp-t tbody td[data-s=b]{border-left:0}
  .cmp-t .fo-rate{width:100%;padding-inline:.6rem}
  .fo-ph{padding-inline:1rem}
  .fo-all{width:100%}
}

/* ═══ the brands: white logo tiles, grey until the pointer is on them ═══ */
.pr-bsec{padding-block:clamp(3rem,7vh,4.8rem)}
.pr-bsec .pg-shead{margin-bottom:clamp(1.4rem,3vh,2rem)}
.pr-bsec .wp-btile{border-radius:var(--r-ctl);background:var(--theme-surface);box-shadow:inset 0 0 0 1px var(--line);transition:box-shadow .3s var(--ease)}
.pr-bsec .wp-btile:hover{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 30%,transparent)}
.pr-bsec .wp-btile img{filter:grayscale(1);opacity:.75;transition:filter .3s var(--ease),opacity .3s var(--ease)}
.pr-bsec .wp-btile:hover img{filter:none;opacity:1}
.pr-bsec .wp-bname{color:var(--mute);transition:color .3s var(--ease)}
.pr-bsec .wp-btile:hover .wp-bname{color:var(--ink)}
`;
