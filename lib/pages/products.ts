/**
 * Products page, a counter to find a product and ask its rate.
 *
 *   opening    what we supply, in a line
 *   find       who makes what: every brand against every kind of product, as a
 *              grid of counts that lists what is picked; a search; and every
 *              product in rows that open (lib/pages/products-finder.ts)
 *   by job     "same job, different brands": the jobs for which we stock more
 *              than one brand, listed by the kind of work; pick one, then any two
 *              of its products, and they face each other head to head, with
 *              what they share marked and what differs standing out.
 *   close      before you buy, and the ways to ask
 *   enquiry    products added from their rows ride in a bar at the foot of the
 *              screen, each with its pack and how many, and go to RPC on
 *              WhatsApp as one message
 *
 * Product facts come only from RPC's spreadsheet; it lists no prices, so every
 * rate is asked for on WhatsApp. Links: /products#<slug> opens that product,
 * #brand-<key> a brand, #job-<key> a job.
 */
import { FANCY_SELECT_CSS } from "./fancy-select";
import { PRODUCT_COUNT, rateLink, type Product } from "../products";
import { brandInfo, brandMark, jobs, type JobView } from "../products/brands";
import { cap, fullName, shortName, useTerms, usesNote } from "../products/compare";
import { arrow, ctaBand, esc, listing, mark, type ContactInfo } from "./kit";
import { enquiryMarkup, FINDER_CSS, finderMarkup } from "./products-finder";
import { BRAND_LOGOS, BRANDS_MARQUEE_CSS, otherBrands } from "../methods/brand-logos";
import { brandDropdown, COMPARE_CSS, type CmpBrand } from "./products-compare";

export interface ProductsData {
  products: readonly Product[];
  contact: ContactInfo;
}

export const PRODUCTS_TRAIL = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
] as const;


export { packIcon } from "../products/packs";

/* ------------------------------------------------------------ same job, different brands */

/**
 * One job, head to head. Every product for the job sits in its brand's column
 * as a chip; the two picked (one from each of the first two brands, to start)
 * face each other across a spine of what the sheet says about them: the type,
 * what it does, where it is listed for, who buys it and the packs. A row the two
 * share is marked "Same" and kept quiet, so what differs stands out; the places
 * they are both listed for are filled in. The rest happens in the browser
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
 * One job's products compared two at a time: a list above each column picks
 * the product, and the table below says, row by row, what each is; rows the
 * two share are marked "Same".
 */
/** one job's comparison; `hidden` until its job is picked, so only one shows at a time, scripts or not */
function faceOff(j: JobView, c: ContactInfo, hidden = false) {
  const n = j.products.length;
  const pa = j.brands[0]!.products[0]!;
  const pb = j.brands[1]!.products[0]!;
  const sides: Record<string, Side> = Object.fromEntries(j.products.map((p) => [p.slug, sideOf(p, c)]));
  const A = sides[pa.slug]!;
  const B = sides[pb.slug]!;
  // the job's brands, for the two brand lists over the table
  const brands: CmpBrand[] = j.brands.map((br) => ({ name: br.name, logo: BRAND_LOGOS[br.name], color: brandMark(br.name), count: br.products.length }));
  // every other brand, from the product list and the brand slide, listed too but not picked: none of its products does this job
  const listed = brandInfo().map((b) => b.name);
  const rest: CmpBrand[] = [...listed.filter((n) => !brands.some((b) => b.name === n)), ...otherBrands(listed)].map((name) => ({ name, logo: BRAND_LOGOS[name], color: brandMark(name), count: 0 }));
  // each column picks a product of its brand: a list per brand, the one for the brand picked showing
  const pick = (s: "a" | "b", sel: Product) =>
    `<th scope="col" data-s="${s}"><div class="cmp-pick"><span>Product ${s === "a" ? 1 : 2}</span>${j.brands
      .map(
        (br) =>
          `<div class="cmp-prod" data-for-brand="${esc(br.name)}"${br.name === sel.brand ? "" : " hidden"}>${
            br.products.length > 1
              ? `<label><span class="sr-only">${esc(br.name)} product</span><select class="h2-sel" data-h2="${s}">${br.products.map((p) => `<option value="${p.slug}"${p.slug === sel.slug ? " selected" : ""}>${esc(shortName(p))}</option>`).join("")}</select></label>`
              : `<p class="cmp-one">${esc(shortName(br.products[0]!))}</p>`
          }</div>`,
      )
      .join("")}</div></th>`;
  const data = JSON.stringify({ sides, brands }).replace(/</g, "\\u003c");
  return `<article class="fo-panel" id="job-${j.key}" data-job="${j.key}" data-a="${pa.slug}" data-b="${pb.slug}" aria-labelledby="fo-t-${j.key}"${hidden ? " hidden" : ""}>
  <header class="fo-ph">
    <div>
      <h3 class="fo-jt sr-only" id="fo-t-${j.key}">${esc(j.name)}</h3>
      <p class="fo-k">${n} products from ${esc(listing(j.brands.map((b) => b.name)))}. Pick two brands, then a product from each.</p>
    </div>
  </header>
  <div class="bc-picks">${brandDropdown(`bd-${j.key}-a`, "Brand 1", brands, pa.brand, undefined, rest)}<span class="bc-vs" aria-hidden="true">vs</span>${brandDropdown(`bd-${j.key}-b`, "Brand 2", brands, pb.brand, pa.brand, rest)}</div>
  <div class="cmp-wrap" aria-live="polite">
    <table class="cmp-t">
      <caption class="sr-only">${esc(j.name)}: two products compared</caption>
      <thead><tr><td></td>${pick("a", pa)}${pick("b", pb)}</tr></thead>
      <tbody>${compareRows(A, B)}</tbody>
    </table>
  </div>
  <script type="application/json" class="h2-data">${data}</script>
</article>`;
}

function byJobMarkup(js: readonly JobView[], c: ContactInfo) {
  // one comparison: the first job (the list of jobs was taken off the page)
  const first = js.slice(0, 1);
  return `<section class="pg-sec fo-sec" id="by-job" aria-labelledby="fo-h">
  <div class="pg-wrap">
    <div class="fo-top">
      <div>
        <p class="pg-mark">Brand comparison</p>
        <h2 class="pg-h2" id="fo-h">Compare two products side by side.</h2>
      </div>
    </div>
    <div class="fo"><div class="fo-stage">${first.map((j) => faceOff(j, c)).join("\n")}</div></div>
  </div>
</section>`;
}

/* ------------------------------------------------------------ the page */

export function productsPageMarkup(d: ProductsData) {
  const bs = brandInfo(d.products);
  const js = jobs(d.products);
  const head = `<header class="pg-head pr-head">
  <div class="pg-wrap">
    <div class="pr-headgrid">
      <div>
        ${mark("01", "Products")}
        <h1 class="pg-h1">Waterproofing products and construction chemicals, by&nbsp;brand.</h1>
      </div>
      <div class="pr-headside">
        <div class="pg-actions"><a class="pg-btn pg-btn--ink" href="#by-job">Compare brands${arrow}</a></div>
      </div>
    </div>
  </div>
</header>`;
  return `${head}
${finderMarkup(bs, d.contact, js, PRODUCT_COUNT)}
${byJobMarkup(js, d.contact)}
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

export const PRODUCTS_CSS = FINDER_CSS + FANCY_SELECT_CSS + BRANDS_MARQUEE_CSS + COMPARE_CSS + `
.pr-head{border-bottom:1px solid var(--line);padding-bottom:clamp(1.6rem,4vh,2.6rem)}
.pr-bsec{padding-block:clamp(2rem,5vh,3.5rem);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.pr-bsec .pg-shead{margin-bottom:1.4rem}
.pr-headgrid{display:grid;grid-template-columns:minmax(0,1.2fr) auto;align-items:end;gap:1.4rem clamp(2rem,6vw,7rem)}
.pr-headgrid .pg-mark{margin-bottom:.9rem}
.pr-headgrid .pg-h1{max-width:20ch}
.pr-headside .pg-intro{margin-top:0}
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}

/* same job, different brands: the jobs on the left; the chosen job's products as chips by brand, and two of them head to head */
.fo{display:grid;grid-template-columns:minmax(14rem,17rem) minmax(0,1fr);gap:clamp(1.2rem,3vw,2.6rem);align-items:start}
.fo-jobs{position:sticky;top:calc(var(--nav-bar,64px) + 1.2rem)}
.fo-glist{display:flex;flex-direction:column;gap:1rem;margin:0;padding:0;list-style:none}
.fo-gname{margin:0 0 .3rem;padding-left:.8rem;font-size:var(--fs-body);font-weight:600;color:var(--mute)}
.fo-group ul{display:flex;flex-direction:column;gap:2px;margin:0;padding:0;list-style:none}
.fo-tab{display:flex;align-items:center;justify-content:space-between;gap:.8rem;min-height:2.5rem;padding:.45rem .8rem;border-radius:6px;font-size:var(--fs-body);line-height:1.3;color:var(--ink2);text-decoration:none;transition:background-color .2s,color .2s}
.fo-tab:hover{background:rgba(18,34,59,.06);color:var(--ink)}
.fo-tab[aria-current=true]{background:var(--navy);color:#f5f0e6;font-weight:600}
.fo-tab:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.fo-tn{min-width:0}
.fo-tc{flex:none;min-width:1.6rem;font-weight:500;font-variant-numeric:tabular-nums;text-align:right;color:var(--mute)}
.fo-tab[aria-current=true] .fo-tc{color:rgba(255,255,255,.7)}

/* a job */
.fo-panel{padding:clamp(1.2rem,2.2vw,1.8rem);border-radius:8px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line),0 30px 60px -50px rgba(18,34,59,.55);scroll-margin-top:calc(var(--nav-bar,64px) + 1rem)}
.fo-panel[hidden]{display:none}
.fo-panel + .fo-panel{margin-top:1.2rem}
.fo-ph{display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:.8rem 1.4rem}
.fo-jt{margin:0;font-family:var(--display);font-weight:600;font-size:var(--fs-sub);line-height:1.25;letter-spacing:-.01em}
.fo-k{margin:.3rem 0 0;font-size:var(--fs-body);color:var(--mute)}
.fo-all,.fo-rate{display:inline-flex;align-items:center;gap:.45rem;border-radius:6px;background:rgba(37,211,102,.12);box-shadow:inset 0 0 0 1px rgba(18,140,75,.32);font-size:var(--fs-body);font-weight:600;color:#128c4b;text-decoration:none;white-space:nowrap;transition:background-color .2s,color .2s,box-shadow .2s}
.fo-all{height:2.6rem;padding:0 1rem}
.fo-rate{height:2.2rem;padding:0 .75rem}
.fo-all:hover,.fo-rate:hover{background:#25d366;box-shadow:none;color:#fff}
.fo-all .pg-ar,.fo-rate .pg-ar{width:1rem;height:1rem}
.fo-all:focus-visible,.fo-rate:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.fo-packs{display:inline-flex;flex-wrap:wrap;gap:.3rem}
.fo-packs > span{display:inline-flex;align-items:center;gap:.35rem;height:2rem;padding:0 .6rem 0 .45rem;border-radius:8px;background:var(--sand);font-weight:500;color:var(--ink)}
.fo-packs svg{width:1.1rem;height:1.1rem;color:var(--c,var(--water))}
.fo-note{margin:1rem 0 0;font-size:var(--fs-body);color:var(--mute)}

/* head to head: the products as chips, brand by brand; two picked face each other across a spine */
.h2-pick{margin-top:1.3rem}
.h2-pk{margin:0 0 .6rem;font-size:var(--fs-body);font-weight:600;color:var(--ink2)}
.h2-roster{display:grid;grid-template-columns:repeat(auto-fit,minmax(13rem,1fr));gap:.7rem}
.h2-brand{padding:.75rem .7rem .7rem;border-radius:12px;background:rgba(18,34,59,.035);box-shadow:inset 0 3px 0 var(--c)}
.h2-bn{display:flex;align-items:center;gap:.5rem;margin:0 0 .5rem .2rem;font-size:var(--fs-body);font-weight:600;color:var(--ink)}
.h2-bn i{width:.55rem;height:.55rem;border-radius:50%;background:var(--c)}
.h2-bn span{margin-left:auto;padding-right:.2rem;font-weight:500;color:var(--mute)}
.h2-brand ul{display:flex;flex-direction:column;gap:.35rem;margin:0;padding:0;list-style:none}
.h2-chip{display:grid;grid-template-columns:1.6rem minmax(0,1fr) auto;align-items:center;gap:.6rem;width:100%;min-height:2.75rem;padding:.4rem .7rem .4rem .45rem;border:0;border-radius:8px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);font:inherit;font-size:var(--fs-body);color:var(--ink);text-align:left;cursor:pointer;transition:background-color .2s,box-shadow .2s,color .2s}
.h2-chip:hover{box-shadow:inset 0 0 0 1.5px var(--navy)}
.h2-chip:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.h2-tag{display:grid;place-items:center;width:1.6rem;height:1.6rem;border-radius:50%;box-shadow:inset 0 0 0 1.5px rgba(18,34,59,.2);font-size:var(--fs-body);font-weight:700;line-height:1}
.h2-cn{min-width:0;font-weight:600;line-height:1.3}
.h2-cp{color:var(--mute);white-space:nowrap}
.h2-chip[aria-pressed=true]{background:var(--navy);box-shadow:none;color:#fff}
.h2-chip[aria-pressed=true] .h2-tag{background:#f5f0e6;box-shadow:none;color:var(--navy)}
.h2-chip[aria-pressed=true] .h2-cp{color:rgba(255,255,255,.7)}

.h2-ring{--cols:minmax(0,1fr) 9.5rem minmax(0,1fr);margin-top:1.4rem;padding:clamp(1rem,2vw,1.6rem);border-radius:14px;background:var(--paper,#fbf8f2);box-shadow:inset 0 0 0 1px var(--line)}
.h2-heads{display:grid;grid-template-columns:var(--cols);align-items:stretch}
.h2-head{position:relative;display:flex;flex-direction:column;justify-content:center;gap:.15rem;min-width:0;padding:1rem 1.2rem;border-radius:12px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line),inset 0 4px 0 var(--c)}
.h2-head[data-s=a]{align-items:flex-end;padding-right:3.4rem;text-align:right}
.h2-head[data-s=b]{padding-left:3.4rem}
.h2-side{position:absolute;top:50%;display:grid;place-items:center;width:2.1rem;height:2.1rem;margin-top:-1.05rem;border-radius:50%;background:var(--c);font-size:var(--fs-body);font-weight:700;color:#fff}
.h2-head[data-s=a] .h2-side{right:.9rem}
.h2-head[data-s=b] .h2-side{left:.9rem}
.h2-hb{margin:0;font-size:var(--fs-body);font-weight:600;color:var(--mute)}
.h2-hn{margin:0;font-family:var(--display);font-size:var(--fs-sub);font-weight:600;line-height:1.2;letter-spacing:-.01em;color:var(--ink)}
.h2-vs{align-self:center;justify-self:center;display:grid;place-items:center;width:3.2rem;height:3.2rem;border-radius:50%;background:var(--navy);box-shadow:0 0 0 6px var(--paper,#fbf8f2);font-family:var(--display);font-size:var(--fs-body);font-weight:700;color:#f5f0e6}
/* the two sides: the brand, and a list to choose the product */
.h2-head{cursor:pointer}
.h2-hb{display:block}
.h2-sel{max-width:100%;margin:0;padding:.1rem 1.6rem .1rem 0;border:0;border-radius:6px;background:transparent url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 6l4 4 4-4' fill='none' stroke='%2312223b' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right .1rem center/14px;font-family:var(--display);font-size:var(--fs-body);font-weight:600;line-height:1.25;letter-spacing:-.01em;color:var(--ink);cursor:pointer;appearance:none;-webkit-appearance:none}
.h2-head[data-s=a] .h2-sel{text-align:right;text-align-last:right}
.h2-sel:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.h2-sel option,.h2-sel optgroup{font-family:var(--sans);font-size:var(--fs-body,1rem);color:#12223b}
.h2-head:hover{box-shadow:inset 0 0 0 1.5px var(--navy),inset 0 4px 0 var(--c)}
.h2-pk{margin:1.1rem 0 0;font-size:var(--fs-body);color:var(--mute)}
.h2-verdict{max-width:46rem;margin:1.1rem auto .4rem;font-size:var(--fs-body);line-height:1.55;text-align:center;color:var(--ink2)}
.h2-verdict:empty{display:none}
.h2-rows{margin:0}
.h2-row{position:relative;display:grid;grid-template-columns:var(--cols);align-items:start;padding:.85rem 0;border-top:1px solid var(--line)}
.h2-row dt{grid-column:2;grid-row:1;display:flex;flex-direction:column;align-items:center;gap:.3rem;padding:0 .6rem;font-size:var(--fs-body);font-weight:600;line-height:1.3;text-align:center;color:var(--ink)}
.h2-row dt em{display:none;padding:.1rem .55rem;border-radius:999px;background:rgba(18,34,59,.07);font-style:normal;font-weight:500;color:var(--mute)}
.h2-row dd{grid-row:1;min-width:0;margin:0;font-size:var(--fs-body);line-height:1.5;color:var(--ink)}
.h2-row dd[data-s=a]{grid-column:1;text-align:right}
.h2-row dd[data-s=b]{grid-column:3}
.h2-row.is-same dt em{display:block}
.h2-row.is-same dd{color:var(--mute)}
.h2-row:not(.is-same):not([data-row=packs]) dd{font-weight:500}
.h2-uses{display:flex;flex-wrap:wrap;gap:.3rem}
.h2-row dd[data-s=a] .h2-uses,.h2-row dd[data-s=a] .fo-packs{justify-content:flex-end}
.h2-uses span{display:inline-flex;align-items:center;min-height:1.9rem;padding:.15rem .6rem;border-radius:7px;box-shadow:inset 0 0 0 1px rgba(18,34,59,.2);font-weight:500;line-height:1.3;color:var(--ink)}
.h2-uses span.is-both{background:var(--navy);box-shadow:none;color:#f5f0e6}
.h2-none{color:var(--mute)}
.h2-row[data-row=packs] .fo-packs svg{color:var(--mute)}
.h2-acts{display:grid;grid-template-columns:var(--cols);padding-top:1rem;border-top:1px solid var(--line)}
.h2-acts .fo-rate{position:relative;max-width:100%;height:auto;min-height:2.4rem;padding:.4rem .8rem;white-space:normal}
.h2-acts .fo-rate[data-s=a]{grid-column:1;justify-self:end}
.h2-acts .fo-rate[data-s=b]{grid-column:3;justify-self:start}
.jb-choose{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr);gap:1.4rem clamp(2rem,5vw,4rem);margin-top:clamp(2.4rem,6vh,3.6rem);padding:clamp(1.4rem,3vw,2.2rem);border-radius:8px;background:var(--sand-2)}
.jb-choose p{margin:.6rem 0 0;font-size:var(--fs-body);line-height:1.6;color:var(--ink2)}
.jb-choose ol{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem 1.6rem;margin:0;padding:0;list-style:none}
.jb-choose li{display:flex;flex-direction:column;gap:.25rem;padding-top:.8rem;border-top:1px solid rgba(18,34,59,.16);font-size:var(--fs-body);line-height:1.5}
.jb-choose li span{color:var(--ink2)}

@media (max-width:1199px){
  .fo{grid-template-columns:minmax(12rem,15rem) minmax(0,1fr)}
}
@media (max-width:899px){
  .pr-headgrid{grid-template-columns:1fr}
  .fo{grid-template-columns:minmax(0,1fr)}
  /* the jobs become one row of chips that scrolls sideways */
  .fo-jobs{position:relative;top:auto;min-width:0;margin-inline:calc(-1 * var(--gutter,16px))}
  .fo-glist{flex-direction:row;gap:.4rem;overflow-x:auto;padding:0 var(--gutter,16px) 4px;scrollbar-width:none}
  .fo-glist::-webkit-scrollbar{display:none}
  .fo-group{flex:none}
  .fo-gname{display:none}
  .fo-group ul{flex-direction:row;gap:.4rem}
  .fo-tab{white-space:nowrap;background:var(--card);box-shadow:inset 0 0 0 1px var(--line)}
  .fo-tab[aria-current=true]{box-shadow:none}
  .jb-choose{grid-template-columns:1fr}
}
@media (max-width:699px){
  /* phones: the spine's names go above each row, the two sides below it */
  .h2-ring{--cols:minmax(0,1fr) minmax(0,1fr);padding:.9rem .8rem}
  .h2-heads{column-gap:1.4rem}
  .h2-vs{position:absolute;left:50%;width:2.4rem;height:2.4rem;margin-left:-1.2rem;box-shadow:0 0 0 4px var(--paper,#fbf8f2)}
  .h2-heads{position:relative}
  .h2-head{padding:2.6rem .8rem .8rem!important;align-items:flex-start!important;text-align:left!important}
  .h2-side{top:.7rem;margin-top:0;width:1.7rem;height:1.7rem}
  .h2-head[data-s=a] .h2-side{right:auto;left:.8rem}
  .h2-row{column-gap:1rem;row-gap:.5rem}
  .h2-row dt{grid-column:1/-1;flex-direction:row;justify-content:center}
  .h2-row dd{grid-row:2}
  .h2-row dd[data-s=a]{grid-column:1;text-align:left}
  .h2-row dd[data-s=b]{grid-column:2}
  .h2-row dd[data-s=a] .h2-uses,.h2-row dd[data-s=a] .fo-packs{justify-content:flex-start}
  .h2-acts{column-gap:1rem}
  .h2-acts .fo-rate[data-s=a]{justify-self:stretch;justify-content:center}
  .h2-acts .fo-rate[data-s=b]{grid-column:2;justify-self:stretch;justify-content:center}
  .h2-acts .fo-rate{padding:.4rem .5rem;white-space:nowrap}
  .h2-rn{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
  .h2-head{justify-content:flex-start}
  /* a row the two share is said once, across both */
  .h2-row.is-same dd[data-s=b]{display:none}
  .h2-row.is-same dd[data-s=a]{grid-column:1/-1;text-align:center}
  .h2-row.is-same dd[data-s=a] .h2-uses{justify-content:center}
}
@media (max-width:599px){
  .jb-choose ol{grid-template-columns:1fr}
  .fo-panel{padding:1.1rem 1rem;border-radius:8px}
  .fo-all{width:100%;justify-content:center}
}

/* the comparison: a plain table, a list above each column to pick the product */
.cmp-wrap{margin-top:1.2rem;overflow-x:auto;border-radius:14px;background:#fbf8f2;box-shadow:inset 0 0 0 1px var(--line)}
.cmp-t{width:100%;min-width:34rem;border-collapse:collapse;table-layout:fixed;font-size:var(--fs-body)}
.cmp-t thead td,.cmp-t tbody th,.cmp-t tfoot td:first-child{width:11.5rem}
.cmp-t th,.cmp-t td{padding:.85rem 1rem;text-align:left;vertical-align:top;line-height:1.5}
.cmp-t thead th,.cmp-t thead td{padding-top:1rem;padding-bottom:1rem;background:var(--card);border-bottom:2px solid var(--navy)}
.cmp-pick{display:flex;flex-direction:column;gap:.3rem}
.cmp-pick > span{font-size:var(--fs-body);font-weight:600;color:var(--mute)}
.cmp-pick .h2-sel{width:100%;padding:.45rem 2rem .45rem .7rem;border-radius:10px;background-color:#fff;background-position:right .6rem center;box-shadow:inset 0 0 0 1px rgba(18,34,59,.2);font-size:var(--fs-body);text-align:left;text-align-last:left}
.cmp-t tbody tr{border-bottom:1px solid var(--line)}
.cmp-t tbody th{font-weight:600;color:var(--ink)}
.cmp-t tbody th em{display:none;margin-top:.3rem;width:max-content;padding:.05rem .5rem;border-radius:999px;background:rgba(47,158,107,.14);font-style:normal;font-weight:600;color:#1f7a4f}
.cmp-t tbody tr.is-same th em{display:inline-block;margin:0 0 0 .45rem;vertical-align:.05rem}
.cmp-t tbody tr.is-same td{color:var(--mute)}
.cmp-t tbody td{color:var(--ink)}
.cmp-t tbody tr[data-row=brand] td{font-weight:600}
.cmp-t tbody tr[data-row=brand] i{display:inline-block;width:.6rem;height:.6rem;margin-right:.45rem;border-radius:50%;vertical-align:.05rem}
.cmp-t tfoot td{padding-top:1rem;padding-bottom:1rem}
.cmp-t .fo-rate{height:auto;min-height:2.3rem;padding:.35rem .8rem;white-space:normal}
.cmp-t .h2-rn{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.cmp-t .fo-rate{position:relative}

/* the comparison on one screen: the job chosen from a list beside the heading, then one compact table */
.fo-sec{padding-block:clamp(2.4rem,6vh,3.6rem)}
.fo-top{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:1rem 2rem;margin-bottom:1.1rem}
.fo-top .pg-h2{margin:.5rem 0 0}
.fo-pickjob{display:flex;flex-direction:column;gap:.3rem;min-width:min(100%,24rem)}
.fo-pickjob > span{font-size:var(--fs-body);font-weight:600;color:var(--mute)}
.fo-pickjob select{height:2.9rem;padding:0 2.4rem 0 .9rem;border:0;border-radius:12px;background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 6l4 4 4-4' fill='none' stroke='%2312223b' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right .8rem center/14px;box-shadow:inset 0 0 0 1.5px var(--navy);font:inherit;font-size:var(--fs-body);font-weight:600;color:var(--ink);appearance:none;cursor:pointer}
.fo-pickjob select:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.fo-pickjob .fs{width:100%}
.fo-pickjob .fs-btn{box-shadow:inset 0 0 0 1.5px var(--navy),0 1px 2px rgba(18,34,59,.06)}
.cmp-pick .fs-btn{min-height:2.6rem;padding:.4rem .7rem .4rem .8rem;border-radius:10px}
.cmp-pick .fs-val{white-space:normal;overflow-wrap:anywhere}
.fo{display:block}
.fo-panel{padding:1rem clamp(1rem,2vw,1.4rem) 1.1rem}
.fo-ph{align-items:center}
.fo-k{margin:0}
.fo-all{height:2.4rem}
.cmp-wrap{margin-top:.8rem}
.cmp-t th,.cmp-t td{padding:.6rem .9rem}
.cmp-t thead th,.cmp-t thead td{padding-top:.75rem;padding-bottom:.75rem}
.cmp-t tfoot td{padding-top:.7rem;padding-bottom:.75rem}
@media (max-width:699px){
  .fo-pickjob{min-width:100%}
  /* phones: each row's name above, the two products side by side below it */
  .cmp-wrap{overflow:visible}
  .cmp-t{min-width:0;table-layout:auto}
  .cmp-t thead,.cmp-t tbody,.cmp-t tfoot{display:block}
  .cmp-t tr{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:.2rem}
  .cmp-t thead td:first-child,.cmp-t tfoot td:first-child{display:none}
  .cmp-t th,.cmp-t td{width:auto!important;padding:.5rem .7rem;overflow-wrap:anywhere}
  .cmp-t tbody th{grid-column:1 / -1;padding-bottom:0}
  .cmp-t .fo-rate{width:100%;justify-content:center}
}

/* phones, polish: tidy filter rows and equal, quiet two-up cards (picture, kind, name, one pack, button) */
@media (max-width:599px){
  .pf-bt--none{display:none}
  .pf-lists[data-view="grid"] .pf-rows{gap:.7rem}
  .pf-lists[data-view="grid"] .pf-row,.pf-lists[data-view="grid"] .pf-row:has(.pf-d[open]){--h:18.2rem}
  .pf-lists[data-view="grid"] .pf-sum{grid-template-rows:7.2rem auto auto minmax(0,1fr);padding:.6rem .6rem 3.4rem;gap:.3rem}
  .pf-lists[data-view="grid"] .pf-ico{height:7.2rem;max-height:7.2rem}
  .pf-lists[data-view="grid"] .pf-fam{margin-top:.1rem;font-size:var(--fs-body,1rem);font-weight:600;letter-spacing:.02em}
  .pf-lists[data-view="grid"] .pf-name{min-height:2.7em;font-size:var(--fs-body,1rem);line-height:1.35}
  .pf-lists[data-view="grid"] .pf-cat,.pf-lists[data-view="grid"] .pf-use{display:none}
  .pf-lists[data-view="grid"] .pf-packs span:nth-child(n+2){display:none}
  .pf-lists[data-view="grid"] .pf-packs span{height:1.6rem;font-size:var(--fs-body,1rem)}
}

/* a brand's logo with its name beside it, the squarer logos (Sika, CCI) drawn larger */
.bc-list .bc-meta{margin-left:auto}
.pf-bh--logo{gap:.9rem}
.pf-bhl{height:3.2rem;padding:.3rem .8rem}
.pf-bhl img{height:2.1rem;max-width:9rem}
.pf-bhl img[src$="/sika.png"],.pf-bhl img[src$="/cci.svg"]{height:2.6rem}
.pf-bhn{font-family:var(--display);font-size:var(--fs-sub);font-weight:600}
.pf-bn{display:block;margin-top:.1rem;font-size:var(--fs-body,1rem);font-weight:600;line-height:1.1;color:var(--ink2);text-align:center}
.pf-bt{flex-direction:column;gap:.05rem;height:auto;min-height:6.4rem;padding:1.5rem .7rem .55rem}
.pf-bt .pf-blogo{flex:1 1 auto;height:auto;min-height:2.8rem}
.pf-bt .pf-blogo img{max-height:2.8rem}
.pf-bt .pf-blogo img[src$="/sika.png"],.pf-bt .pf-blogo img[src$="/cci.svg"]{max-height:3.6rem}
.bc-face img[src$="/sika.png"],.bc-face img[src$="/cci.svg"]{max-height:2.4rem}
.bc-face{height:2.9rem}


/* phones and small tablets: the two filter rows, tidy and labelled, wrapped so nothing scrolls sideways */
@media (max-width:767px){
  .pf-chips{gap:1rem}
  .pf-chiprow{display:block;overflow:visible;margin-inline:0;padding:0}
  .pf-fh{display:flex;margin:0 0 .5rem;padding:0;border:0;font-size:var(--fs-body,1rem);font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
  .pf-picked{font-size:var(--fs-body,1rem);letter-spacing:0;text-transform:none}
  .pf-cs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.4rem;overflow:visible;margin:0;padding:0}
  .pf-chip .pf-ck{display:none}
  .pf-chiprow:not(.pf-chiprow--brands) .pf-chip{width:100%;height:auto;min-height:2.6rem;padding:.35rem .8rem;border-radius:14px;font-size:var(--fs-body,1rem);line-height:1.2;white-space:normal}
  .pf-chiprow:not(.pf-chiprow--brands) .pf-chip span{margin-left:auto}
  .pf-chiprow:not(.pf-chiprow--brands) .pf-chip--all{grid-column:1 / -1}
  .pf-chiprow--brands .pf-cs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.5rem}
  .pf-chiprow--brands .pf-chip{width:100%;border-radius:12px}
  .pf-chiprow--brands .pf-chip--all{height:auto;min-height:2.8rem;justify-content:center;padding:0 .6rem;grid-column:1 / -1}
  .pf-chiprow--brands .pf-bt{width:100%;padding:1.4rem .4rem .5rem}
  .pf-chiprow--brands .pf-bt > span{top:.35rem;right:.5rem;transform:none;font-size:var(--fs-body,1rem)}
  .pf-bt--none{display:none}
}

/* phones, compact: small wrapping pills for categories, one tight row of brand cards, so the filters take little height */
@media (max-width:767px){
  .pf-chips{gap:.7rem}
  .pf-fh{margin:0 0 .35rem;font-size:var(--fs-body,1rem)}
  .pf-cs{display:flex;flex-wrap:wrap;gap:.25rem}
  .pf-chiprow:not(.pf-chiprow--brands) .pf-chip{width:auto;min-height:0;height:1.85rem;padding:0 .55rem;gap:.3rem;border-radius:999px;font-size:var(--fs-body,1rem);line-height:1;white-space:nowrap}
  .pf-chiprow:not(.pf-chiprow--brands) .pf-chip span{margin-left:0;font-size:var(--fs-body,1rem);opacity:.65}
  .pf-chiprow:not(.pf-chiprow--brands) .pf-chip--all{grid-column:auto}
  .pf-chiprow--brands .pf-cs{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:.3rem}
  .pf-chiprow--brands .pf-chip{border-radius:10px}
  .pf-chiprow--brands .pf-chip--all{grid-column:1 / -1;min-height:1.85rem;height:1.85rem;font-size:var(--fs-body,1rem)}
  .pf-chiprow--brands .pf-chip--all span{font-size:var(--fs-body,1rem)}
  .pf-chiprow--brands .pf-bt{min-height:4.1rem;padding:.9rem .2rem .3rem;gap:0}
  .pf-chiprow--brands .pf-bt > span{top:.2rem;right:.3rem;font-size:var(--fs-body,1rem)}
  .pf-chiprow--brands .pf-bt .pf-blogo{min-height:1.7rem}
  .pf-chiprow--brands .pf-bt .pf-blogo img{max-height:1.7rem}
  .pf-chiprow--brands .pf-bt .pf-blogo img[src$="/sika.png"],.pf-chiprow--brands .pf-bt .pf-blogo img[src$="/cci.svg"]{max-height:2.3rem}
  .pf-chiprow--brands .pf-bn{margin-top:0;font-size:var(--fs-body,1rem)}
}

/* phones, products banner: room for the button under the two lines, a button that fits its words */
@media (max-width:767px){
  .pr-head{--head-h:15.5rem;--head-pb:1.4rem}
  .pr-headgrid{gap:.95rem}
  .pg-head.pr-head .pr-headgrid .pg-h1{max-width:32rem}
  .pr-headside .pg-actions{justify-content:flex-start}
  .pr-headside .pg-actions .pg-btn{flex:0 0 auto;width:auto;min-height:2.6rem;padding:0 1.15rem;font-size:var(--fs-body,1rem);border-radius:999px}
}

/* phones, finish: the two filters sit in one soft panel, white pills and tiles, the picked ones ringed in navy */
@media (max-width:767px){
  .pf-chips{gap:1.05rem;padding:1.05rem .85rem 1.1rem;border-radius:20px;background:rgba(255,255,255,.5);box-shadow:inset 0 0 0 1px var(--line)}
  .pf-fh{margin-bottom:.6rem;font-size:var(--fs-body,1rem);letter-spacing:.14em}
  .pf-picked{letter-spacing:0}
  .pf-chiprow:not(.pf-chiprow--brands) .pf-chip,.pf-chiprow--brands .pf-chip--all{background:#fff;box-shadow:inset 0 0 0 1px rgba(18,34,59,.14);transition:box-shadow .2s,background-color .2s}
  .pf-chiprow:not(.pf-chiprow--brands) .pf-chip:not(.pf-chip--all)[aria-pressed="true"]{background:#fff;box-shadow:inset 0 0 0 1.5px var(--navy);font-weight:600;color:var(--navy)}
  .pf-chiprow:not(.pf-chiprow--brands) .pf-chip--all[aria-pressed="true"],.pf-chiprow--brands .pf-chip--all[aria-pressed="true"]{background:var(--navy);box-shadow:none;color:#fff}
  .pf-chiprow:not(.pf-chiprow--brands) .pf-chip--all[aria-pressed="true"] span,.pf-chiprow--brands .pf-chip--all[aria-pressed="true"] span{opacity:.75;color:#fff}
  .pf-chiprow--brands{padding-top:1rem;border-top:1px solid var(--line)}
  .pf-chiprow--brands .pf-chip--all{grid-column:1 / -1;justify-self:start;width:auto;height:1.85rem;min-height:0;padding:0 .8rem;gap:.35rem;border-radius:999px;font-size:var(--fs-body,1rem)}
  .pf-chiprow--brands .pf-cs{gap:.4rem}
  .pf-chiprow--brands .pf-bt{border-radius:14px;box-shadow:inset 0 0 0 1px rgba(18,34,59,.12)}
  .pf-chiprow--brands .pf-bt[aria-pressed="true"]{background:#fff;box-shadow:inset 0 0 0 1.5px var(--navy)}
  .pf-chiprow--brands .pf-bt .pf-blogo{width:100%;padding-inline:.1rem}
  .pf-chiprow--brands .pf-bt .pf-blogo img{max-width:100%;width:auto;object-fit:contain}
  .pf-chiprow--brands .pf-bn{font-size:var(--fs-body,1rem);font-weight:600;color:var(--ink2)}
  .pf-chiprow--brands .pf-bt[aria-pressed="true"] .pf-bn{color:var(--navy)}
}

@media (max-width:380px){
  .pf-chips{padding-inline:.65rem}
  .pf-chiprow:not(.pf-chiprow--brands) .pf-chip{padding:0 .5rem;gap:.25rem;font-size:var(--fs-body,1rem)}
  .pf-chiprow:not(.pf-chiprow--brands) .pf-chip span{font-size:var(--fs-body,1rem)}
  .pf-chiprow:not(.pf-chiprow--brands) .pf-cs{gap:.22rem}
}

/* phones: the comparison as two product cards and one small card for each fact */
@media (max-width:599px){
  .fo-k{display:none}
  .fo-panel{padding:.9rem .8rem 1rem}
  .bc-k{font-size:var(--fs-body,1rem);font-weight:700;letter-spacing:.08em;text-transform:uppercase}
  .cmp-wrap{margin-top:.9rem;background:none;box-shadow:none;border-radius:0}
  .cmp-t thead tr{column-gap:.5rem}
  .cmp-t thead th{padding:.7rem .7rem .8rem;border-bottom:0;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 1px var(--line)}
  .cmp-pick > span{font-size:var(--fs-body,1rem);font-weight:700;letter-spacing:.08em;text-transform:uppercase}
  .cmp-t tbody tr{column-gap:0;margin-top:.5rem;overflow:hidden;border:0;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 1px var(--line)}
  .cmp-t tbody tr[data-row=brand]{display:none}
  .cmp-t tbody th{padding:.7rem .85rem .15rem;font-size:var(--fs-body,1rem);font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
  .cmp-t tbody td{padding:.2rem .85rem .8rem;font-size:var(--fs-body,1rem);line-height:1.4}
  .cmp-t tbody td[data-s=b]{border-left:1px solid var(--line)}
  .cmp-t tbody td span{display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
  .cmp-t tfoot td{padding:.7rem 0 0}
}

/* phones: the product page: a calmer top, two small fact cards a row, one wide enquire button, tabs that fit */
@media (max-width:767px){
  .pv-hero{gap:1rem;padding:1rem 1rem 1.1rem}
  .pv-stage-wrap{height:16.5rem;border-radius:16px}
  .pv-thumbs{gap:.45rem}
  .pv-thumb-box{height:3.4rem}
  .pv-info{padding-right:0}
  .pv-title{font-size:var(--fs-h3);line-height:1.2}
  .pv-subtitle{margin:.3rem 0 .6rem;font-size:var(--fs-body,1rem);color:var(--accent)}
  .pv-summary{display:none}
  .pv-features{grid-template-columns:repeat(2,minmax(0,1fr));gap:.5rem;margin-bottom:.9rem}
  .pv-feat{flex-direction:row;justify-content:flex-start;text-align:left;gap:.55rem;padding:.6rem .7rem;border-radius:12px;background:#fff}
  .pv-feat-title{font-size:var(--fs-body,1rem)}
  .pv-purchase-row{flex-direction:column;align-items:stretch;gap:.8rem;margin-top:0;padding:.9rem;border-radius:16px;background:#f1f5fb}
  .pv-pack-chip{height:2.3rem;border-radius:999px}
  .pv-enquire-btn{width:100%;justify-content:center;height:3rem;border-radius:12px;background:var(--color-rpc,#2756a0)}
  .pv-tabs-bar{gap:.2rem;padding:0 .5rem;overflow-x:auto;scrollbar-width:none}
  .pv-tabs-bar::-webkit-scrollbar{display:none}
  .pv-tab{flex:none;height:3rem;padding:0 .85rem;font-size:var(--fs-body,1rem)}
  .pv-tab svg{display:none}
  .pv-content{padding:1rem .9rem 2.4rem}
  .pv-overview-grid{gap:1rem}
}
`;
