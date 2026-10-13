/**
 * The products page's finder: "who makes what" and the list it opens.
 *
 *   filters   a brand and a kind of product, each with how many there are,
 *             in a column beside the list (on phones, two rows of chips)
 *   search    by name, use or pack size, across the whole list
 *   list      the products in rows, brand by brand: what it is and its packs at
 *             a glance; open a row for what it does, where it is used, who buys
 *             it, the jobs it is part of, its packs drawn to scale, today's rate
 *             and the other brands for the same job
 *   enquiry   products added from their rows ride in a bar at the foot of the
 *             screen, each with its pack and how many, and go to RPC on
 *             WhatsApp as one message
 *
 * Every fact is RPC's spreadsheet's (lib/products); it lists no prices, so
 * rates are asked for. Without scripts every product is listed, each row still
 * opens, and each product keeps its own rate link.
 */
import { BRAND_LOGOS } from "../methods/brand-logos";
import { imageSrc, mediaOf, videoSrc } from "../products/media";
import { FAMILIES, familyOf, type Product } from "../products";
import { brandMark, type BrandInfo, type JobView } from "../products/brands";
import { fullName, shortName } from "../products/compare";
import { packArt } from "../products/pack-art";
import { esc, type ContactInfo } from "./kit";

const search = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m16 16 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;
const chev = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const plus = `<svg class="pf-plus" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3.5v9M3.5 8h9" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`;
const tick = `<svg class="pf-tick" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.4 6.6 11.4 12.6 4.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/** what the search looks through */
const searchText = (p: Product) => [p.brand, p.name, p.category, p.purpose, p.areas, ...p.packs.map((k) => `${k.size} ${k.listed}`)].join(" ").toLowerCase().replace(/\s+/g, " ");


const docIco = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>`;
const playIco = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 8.8v6.4l5.2-3.2z" fill="currentColor"/></svg>`;

/** the viewer a card's "Product description" and "Watch video" open; the page's script fills it from the card */
const VIEWER_HTML = `<dialog class="pv" data-pv aria-labelledby="pv-name">
  <div class="pv-head">
    <span class="pv-pic" data-pv-pic aria-hidden="true"></span>
    <span class="pv-tx"><span class="pv-brand" data-pv-brand></span><span class="pv-name" id="pv-name" data-pv-name></span></span>
    <button type="button" class="pv-x" data-pv-close aria-label="Close"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></button>
  </div>
  <div class="pv-tabs" role="tablist">
    <button type="button" role="tab" class="pv-tab" data-pv-tab="desc" aria-selected="true">Description</button>
    <button type="button" role="tab" class="pv-tab" data-pv-tab="video" aria-selected="false">Video</button>
  </div>
  <div class="pv-body">
    <div class="pv-pane" data-pv-pane="desc" role="tabpanel"><p class="pv-desc" data-pv-desc></p></div>
    <div class="pv-pane" data-pv-pane="video" role="tabpanel" hidden>
      <div class="pv-video" data-pv-video></div>
      <p class="pv-none" data-pv-none hidden>${playIco}<span>The video for this product is on its way.</span></p>
    </div>
  </div>
</dialog>`;

/** one product: a row that opens */
function row(p: Product, c: ContactInfo, js: readonly JobView[]) {
  const f = familyOf(p.family);
  const cat = p.category === "Construction chemical" ? "Ask us what this one is best used for" : p.category;
  const m = mediaOf(p.slug);
  const img = imageSrc(m);
  const media = `<div class="pf-media" data-view="${p.slug}" data-view-desc="${esc(m.description ?? p.purpose)}"${img ? ` data-view-img="${esc(img)}"` : ""}${videoSrc(m) ? ` data-view-video="${esc(videoSrc(m))}"` : ""}>
          <button type="button" class="pf-vlink" data-view-go="desc">${docIco}<span>Description</span></button>
          <button type="button" class="pf-vlink" data-view-go="video">${playIco}<span>Video</span></button>
        </div>`;
  return `<li class="pf-row" id="${p.slug}" data-family="${p.family}" data-q="${esc(searchText(p))}" style="--tint:${f.tint}">
  <details class="pf-d">
    <summary class="pf-sum">
      <span class="pf-fam">${esc(f.label)}</span>
      <span class="pf-ico${img ? " pf-ico--photo" : ""}">${img ? `<img src="${esc(img)}" alt="" loading="lazy" decoding="async">` : packArt(p.slug, p.packs[0]?.shape ?? "bag", f.tint, p.packs[0]?.size ?? "")}</span>
      <span class="pf-tx"><span class="pf-name">${esc(shortName(p))}</span><span class="pf-cat">${esc(cat)}</span></span>
      <span class="pf-packs">${p.packs.map((k) => `<span>${esc(k.size)}</span>`).join("")}</span>
      <span class="pf-chev">${chev}</span>
    </summary>
    <div class="pf-open">
      ${media}
    </div>
  </details>
  <button type="button" class="pf-add" data-add="${p.slug}" data-label="${esc(fullName(p))}" data-packs="${esc(p.packs.map((k) => k.size).join("|"))}" aria-pressed="false" aria-label="Add ${esc(fullName(p))} to your enquiry" hidden>${plus}${tick}<span>Add</span></button>
</li>`;
}

/** a brand as its logo where RPC has one, otherwise its name set in the brand's colour */
const brandFace = (name: string) =>
  BRAND_LOGOS[name]
    ? `<img src="/images/brands/${esc(BRAND_LOGOS[name]!)}" alt="${esc(name)}" loading="lazy" decoding="async">`
    : `<strong>${esc(name)}</strong>`;

/** the filters: a brand and a kind of product, each with how many (a column beside the list; on phones, two rows that scroll sideways) */
function filters(bs: readonly BrandInfo[], total: number) {
  const fams = FAMILIES.filter((f) => bs.some((b) => b.products.some((p) => p.family === f.key)));
  const count = (f: string) => bs.reduce((s, b) => s + b.products.filter((p) => p.family === f).length, 0);
  const tick = `<b class="pf-ck" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></b>`;
  return `<div class="pf-chips" data-chips>
  <div class="pf-chiprow" role="group" aria-labelledby="pf-ff">
    <p class="pf-fh" id="pf-ff">Kind of product<span class="pf-picked" data-picked="fam"></span></p>
    <button type="button" class="pf-chip pf-chip--all" data-chip-fam="all" aria-pressed="true">Every kind<span>${total}</span></button>
    ${fams.map((f) => `<button type="button" class="pf-chip" data-chip-fam="${f.key}" data-label="${esc(f.label)}" aria-pressed="false">${tick}${esc(f.label)}<span data-chip-n>${count(f.key)}</span></button>`).join("")}
  </div>
  <div class="pf-chiprow pf-chiprow--brands" role="group" aria-labelledby="pf-fb">
    <p class="pf-fh" id="pf-fb">Brand<span class="pf-picked" data-picked="brand"></span></p>
    <button type="button" class="pf-chip pf-chip--all" data-chip-brand="all" aria-pressed="true">All brands<span>${total}</span></button>
    ${bs.map((b) => `<button type="button" class="pf-chip pf-bt" data-chip-brand="${b.key}" aria-pressed="false" style="--c:${brandMark(b.name)}">${tick}<em class="pf-blogo">${brandFace(b.name)}</em><span>${b.count}</span></button>`).join("")}
  </div>
</div>`;
}

export function finderMarkup(bs: readonly BrandInfo[], c: ContactInfo, js: readonly JobView[], total: number) {
  const lists = bs
    .map(
      (b) => `<section class="pf-brand" id="brand-${b.key}" data-brand="${b.key}" aria-labelledby="pf-h-${b.key}">
  <h3 class="pf-bh${BRAND_LOGOS[b.name] ? " pf-bh--logo" : ""}" id="pf-h-${b.key}" style="--c:${brandMark(b.name)}">${BRAND_LOGOS[b.name] ? `<em class="pf-bhl"><img src="/images/brands/${esc(BRAND_LOGOS[b.name]!)}" alt="" loading="lazy" decoding="async"></em>` : `<i aria-hidden="true"></i>`}<b class="pf-bhn">${esc(b.name)}</b><span data-bcount>${b.count} ${b.count === 1 ? "product" : "products"}</span></h3>
  <ul class="pf-rows">${b.products.map((p) => row(p, c, js)).join("")}</ul>
  <button type="button" class="pf-more" data-more hidden>Show all ${b.count} ${esc(b.name)} products</button>
</section>`,
    )
    .join("");
  return `<section class="pg-sec pf-sec" id="find" aria-labelledby="pf-title">
  <div class="pg-wrap">
    <h2 class="sr-only" id="pf-title">All ${total} products, by brand</h2>
    <div class="pf">
      <div class="pf-side">${filters(bs, total)}</div>
      <div class="pf-main">
        <label class="pf-search">${search}<span class="sr-only">Search products</span><input type="search" data-search placeholder="Search ${total} products" autocomplete="off" enterkeyhint="search"><button type="button" class="pf-x" data-clear-q aria-label="Clear the search" hidden><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button></label>
        <div class="pf-state"><p class="pf-status" data-status aria-live="polite">All ${total} products, brand by brand.</p><button type="button" class="pf-clear" data-clear hidden>Show every product</button></div>
        <div class="pf-lists">${lists}</div>
        ${VIEWER_HTML}
        <p class="pf-empty" data-empty hidden>Nothing on our list matches that. Try a shorter word, or <button type="button" data-clear>show every product</button>.</p>
      </div>
    </div>
  </div>
</section>`;
}

/** the enquiry: what was added, each with its pack and how many (the page's script fills it in) */
export function enquiryMarkup(c: ContactInfo) {
  return `<div class="rl" data-rl data-wa="${esc(c.whatsapp)}" hidden>
  <div class="rl-card" role="region" aria-label="Your enquiry">
    <div class="rl-open" id="rl-open" data-rl-open hidden>
      <ol class="rl-lines" data-rl-lines></ol>
      <div class="rl-foot"><span>Pick the pack and how many. We reply on WhatsApp with today’s rates.</span><button type="button" data-rl-clear>Clear the list</button></div>
    </div>
    <div class="rl-bar">
      <button type="button" class="rl-sum" data-rl-toggle aria-expanded="false" aria-controls="rl-open"><span class="rl-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="17" rx="2.5"/><path d="M9 4.5V3h6v1.5M8.5 10h7M8.5 14h7M8.5 18h4"/></svg></span><span class="rl-tx"><b><span class="rl-n" data-rl-n>0</span> in your enquiry</b><small>Packs and quantities</small></span>${chev}</button>
      <a class="rl-send" data-rl-send href="${esc(c.whatsapp)}" target="_blank" rel="noopener noreferrer"><span>Ask for these rates</span></a>
    </div>
  </div>
</div>`;
}

export const FINDER_CSS = `
/* the finder: the filters beside the list */
.pf{display:grid;grid-template-columns:15rem minmax(0,1fr);gap:clamp(2rem,4vw,4rem);align-items:start}
.pf-side{position:sticky;top:calc(var(--nav-bar,64px) + 1.2rem)}
.pf-chips{display:flex;flex-direction:column;gap:1.8rem}
.pf-chiprow{display:flex;flex-direction:column}
.pf-fh{margin:0 0 .3rem;padding-bottom:.55rem;border-bottom:1px solid color-mix(in srgb,var(--theme-ink) 32%,transparent);font-size:var(--fs-body);font-weight:600;color:var(--mute)}
.pf-chip{display:flex;align-items:center;gap:.6rem;width:100%;padding:.5rem .55rem;border:0;border-radius:4px;background:none;font:inherit;font-size:var(--fs-body);line-height:1.3;color:var(--ink);text-align:left;cursor:pointer;transition:background-color .15s,color .15s}
.pf-chip i{flex:none;width:.5rem;height:.5rem;border-radius:1px;background:var(--c)}
.pf-chip span{margin-left:auto;padding-left:.6rem;color:var(--mute);font-variant-numeric:tabular-nums}
.pf-chip:hover{background:color-mix(in srgb,var(--theme-ink) 6%,transparent)}
.pf-chip[aria-pressed="true"]{background:var(--navy);color:var(--theme-white)}
.pf-chip[aria-pressed="true"] span{color:color-mix(in srgb,var(--theme-white) 70%,transparent)}
.pf-chip[data-empty]{opacity:.4}
.pf-chip:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
/* more than one can be picked: a tick box on each, "every kind" / "all brands" to let them go */
.pf-fh{display:flex;align-items:baseline;justify-content:space-between;gap:.6rem}
.pf-ck{display:grid;place-items:center;flex:none;width:1.1rem;height:1.1rem;border-radius:4px;box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--theme-ink) 35%,transparent);color:transparent;transition:background-color .2s,color .2s}
.pf-ck svg{width:.8rem;height:.8rem}
.pf-chip:not(.pf-chip--all)[aria-pressed="true"]{background:color-mix(in srgb,var(--theme-primary-dark) 13%,transparent);font-weight:600;color:var(--ink)}
.pf-picked{font-size:var(--fs-body);font-weight:600;color:var(--accent)}
.pf-picked:empty{display:none}
.pf-chip:not(.pf-chip--all)[aria-pressed="true"] span{color:var(--ink2)}
.pf-chip[aria-pressed="true"] .pf-ck{background:var(--navy);box-shadow:none;color:var(--theme-white)}
/* brands as logo tiles, two to a row: the logo (or the name in the brand's colour), the count in the corner, a tick when picked */
.pf-chiprow--brands{display:grid;grid-template-columns:1fr 1fr;gap:.45rem}
.pf-chiprow--brands .pf-fh,.pf-chiprow--brands .pf-chip--all{grid-column:1 / -1}
.pf-chiprow--brands .pf-fh{margin-bottom:.1rem}
.pf-bt{position:relative;justify-content:center;height:5rem;padding:1.3rem .7rem .55rem;border-radius:10px;background:var(--theme-white);box-shadow:inset 0 0 0 1px var(--line);transition:box-shadow .2s}
.pf-bt:hover{background:var(--theme-white);box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--theme-ink) 40%,transparent)}
.pf-chip.pf-bt[aria-pressed="true"]{background:var(--theme-white);box-shadow:inset 0 0 0 2px var(--navy)}
.pf-bt .pf-ck{position:absolute;left:.45rem;top:.45rem;width:1rem;height:1rem}
.pf-bt > span{position:absolute;right:.5rem;top:.35rem;margin:0;padding:0;color:var(--mute)}
.pf-blogo{display:grid;place-items:center;width:100%;height:100%;font-style:normal}
.pf-blogo img{display:block;max-width:100%;max-height:2.7rem;width:auto;height:auto;object-fit:contain}
.pf-blogo strong{font-family:var(--display);font-weight:700;letter-spacing:-.01em;color:var(--c,var(--ink))}
.pf-chip.pf-bt[data-empty]{opacity:.45}
/* each brand's list opens with its logo */
.pf-bhn{font-weight:600}
.pf-bh--logo .pf-bhn{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.pf-bhl{display:inline-grid;place-items:center;height:2.6rem;padding:.35rem .7rem;border-radius:8px;background:var(--theme-white);box-shadow:inset 0 0 0 1px var(--line);font-style:normal}
.pf-bhl img{display:block;height:1.9rem;max-width:9rem;width:auto;object-fit:contain}

/* the list */
.pf-main{min-width:0;container-type:inline-size}
.pf-search{display:flex;align-items:center;gap:.7rem;height:3.5rem;padding:0 1.1rem;border-radius:8px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line),0 20px 40px -36px color-mix(in srgb,var(--theme-ink) 60%,transparent)}
.pf-search:focus-within{outline:2px solid var(--accent);outline-offset:2px}
.pf-search svg{flex:none;width:1.3rem;height:1.3rem;color:var(--mute)}
.pf-search input{flex:1;min-width:0;border:0;background:none;font:inherit;font-size:var(--fs-body);color:var(--ink);outline:none}
.pf-search input::placeholder{color:var(--mute);opacity:1}
.pg .pf-search input:focus-visible{outline:none}
.pf-search input::-webkit-search-cancel-button{-webkit-appearance:none;appearance:none}
.pf-x{display:grid;place-items:center;flex:none;width:2.2rem;height:2.2rem;margin-right:-.5rem;border:0;border-radius:8px;background:none;color:var(--mute);cursor:pointer}
.pf-x[hidden]{display:none}
.pf-x:hover{background:color-mix(in srgb,var(--theme-ink) 6%,transparent);color:var(--ink)}
.pf-x svg{width:15px;height:15px}
.pf-state{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:.4rem 1rem;margin:1.1rem 0 .9rem}
.pf-status{margin:0;font-size:var(--fs-body);font-weight:600;color:var(--ink)}
.pf-clear,.pf-empty button{padding:0;border:0;border-bottom:1px solid currentColor;background:none;font:inherit;font-size:var(--fs-body);font-weight:600;color:var(--accent);cursor:pointer}
.pf-clear[hidden]{display:none}
.pf-brand + .pf-brand{margin-top:1.7rem}
.pf-brand[hidden]{display:none}
.pf-bh{display:flex;align-items:center;gap:.6rem;margin:0 0 .65rem;font-family:var(--display);font-size:var(--fs-sub);font-weight:600;line-height:1.2;letter-spacing:-.01em;scroll-margin-top:calc(var(--nav-bar,64px) + 1.4rem)}
.pf-bh i{flex:none;width:.55rem;height:1.3rem;border-radius:3px;background:var(--c)}
.pf-bh span{margin-left:.2rem;font-family:var(--sans);font-size:var(--fs-body);font-weight:500;letter-spacing:0;color:var(--mute)}
.pf-rows{margin:0;padding:0;list-style:none;border-radius:8px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);overflow:hidden}
.pf-row{position:relative;border-top:1px solid var(--line);scroll-margin-top:calc(var(--nav-bar,64px) + 1.4rem)}
.pf-row:first-child{border-top:0}
.pf-row[hidden]{display:none}
.pf-row.is-hit{animation:pf-hit 2.2s ease}
@keyframes pf-hit{0%,45%{background:color-mix(in srgb,var(--theme-primary) 10%,transparent)}100%{background:transparent}}
.pf-sum{position:relative;display:grid;grid-template-columns:2.6rem minmax(0,1fr) auto;align-items:center;gap:.35rem 1rem;padding:.8rem 8.8rem .8rem .9rem;list-style:none;cursor:pointer;transition:background-color .2s}
.pf-sum::-webkit-details-marker{display:none}
.pf-sum::marker{content:""}
.pf-sum:hover{background:color-mix(in srgb,var(--theme-ink) 3%,transparent)}
.pf-sum:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}
.pf-ico{display:grid;place-items:center;width:2.6rem;height:2.6rem;border-radius:4px;background:color-mix(in srgb,var(--theme-ink) 5%,transparent);color:var(--mute)}
.pf-ico svg{width:1.45rem;height:1.45rem}
.pf-tx{display:flex;flex-direction:column;min-width:0}
.pf-name{font-size:var(--fs-body);font-weight:600;line-height:1.35}
.pf-cat{font-size:var(--fs-body);line-height:1.4;color:var(--mute)}
.pf-packs{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:.3rem}
.pf-packs span{display:inline-flex;align-items:center;height:1.85rem;padding:0 .6rem;border-radius:7px;background:var(--sand);font-size:var(--fs-body);font-weight:500;white-space:nowrap}
.pf-chev{position:absolute;top:1.35rem;right:1rem;display:grid;place-items:center;width:1.5rem;height:1.5rem;color:var(--mute);transition:transform .25s}
.pf-chev svg{width:15px;height:15px}
.pf-d[open] .pf-chev{transform:rotate(180deg)}
.pf-d[open] .pf-sum{background:color-mix(in srgb,var(--theme-primary) 5%,transparent)}
.pf-add{position:absolute;top:1.05rem;right:3.1rem;display:inline-flex;align-items:center;gap:.3rem;height:2.1rem;padding:0 .8rem 0 .6rem;border:0;border-radius:6px;background:var(--card);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 22%,transparent);font:inherit;font-size:var(--fs-body);font-weight:600;line-height:1;color:var(--ink);cursor:pointer;transition:background-color .2s,color .2s,box-shadow .2s}
.pf-add[hidden]{display:none}
.pf-add svg{width:14px;height:14px}
.pf-add .pf-tick,.pf-add.is-on .pf-plus{display:none}
.pf-add.is-on .pf-tick{display:block}
.pf-add:hover{box-shadow:inset 0 0 0 1.5px var(--navy)}
.pf-add.is-on{background:var(--navy);box-shadow:none;color:var(--theme-on-dark)}
.pf-add:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.pf-open{padding:.2rem 1.1rem 1.2rem calc(.9rem + 2.6rem + 1rem)}
.pf-facts{margin:0}
.pf-facts div{display:grid;grid-template-columns:7.4rem minmax(0,1fr);gap:.2rem 1rem;padding:.55rem 0;border-top:1px solid var(--line)}
.pf-facts div:first-child{border-top:0}
.pf-facts dt{font-size:var(--fs-body);color:var(--mute)}
.pf-facts dd{margin:0;font-size:var(--fs-body);line-height:1.5}
.pf-ofoot{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:1rem 1.4rem;margin-top:.6rem;padding-top:.9rem;border-top:1px solid var(--line)}
.pf-scale{display:flex;align-items:flex-end;gap:.4rem 1.2rem;margin:0;padding:0;list-style:none}
.pf-scale li{display:flex;flex-direction:column;align-items:flex-start;gap:.2rem;font-size:var(--fs-body);font-weight:500;white-space:nowrap}
.pf-scale svg{width:var(--px,2.4rem);height:var(--px,2.4rem);color:var(--tint)}
.pf-acts{display:flex;flex-wrap:wrap;gap:.5rem}
.pf-rate,.pf-alt{display:inline-flex;align-items:center;gap:.45rem;height:2.4rem;padding:0 .9rem;border-radius:6px;font-size:var(--fs-body);font-weight:600;text-decoration:none;white-space:nowrap;transition:background-color .2s,color .2s,box-shadow .2s}
.pf-rate{background:color-mix(in srgb,var(--theme-whatsapp) 12%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-whatsapp-dark) 32%,transparent);color:var(--theme-whatsapp-dark)}
.pf-rate:hover{background:var(--theme-whatsapp);box-shadow:none;color:var(--theme-white)}
.pf-rate .pg-ar{width:1.05rem;height:1.05rem}
.pf-alt{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 22%,transparent);color:var(--ink)}
.pf-alt:hover{box-shadow:inset 0 0 0 1.5px var(--navy)}
.pf-rate:focus-visible,.pf-alt:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.pf-more{display:flex;align-items:center;justify-content:center;width:100%;height:3rem;margin-top:.6rem;border:0;border-radius:6px;background:transparent;box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--theme-ink) 20%,transparent);font:inherit;font-size:var(--fs-body);font-weight:600;color:var(--ink);cursor:pointer;transition:box-shadow .2s,background-color .2s}
.pf-more:hover{box-shadow:inset 0 0 0 1.5px var(--navy)}
.pf-more:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.pf-more[hidden]{display:none}
.pf-empty{margin:1.4rem 0 0;font-size:var(--fs-body);color:var(--mute)}

/* a narrow list: the packs go under the name */
@container (max-width:36rem){
  .pf-open{padding-left:.9rem;padding-right:.9rem}
  .pf-facts div{grid-template-columns:minmax(0,1fr);gap:.1rem}
}

/* the list: each brand's products as cards, three to a row */
.pf-search{height:3rem}
.pf-search input{font-size:var(--fs-body)}
.pf-search svg{width:1.1rem;height:1.1rem}
.pf-rows{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-auto-flow:row dense;align-items:start;gap:.8rem;border-radius:0;background:none;box-shadow:none;overflow:visible}
.pf-row{--h:10.5rem;border-top:0;border-radius:14px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);transition:box-shadow .2s}
.pf-row:hover{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 32%,transparent),0 16px 32px -26px color-mix(in srgb,var(--theme-ink) 50%,transparent)}
.pf-row:first-child{border-top:0}
/* every card the same size: two lines for the name, two for the kind, then the packs and Add on one line at the foot */
.pf-sum{grid-template-columns:2.6rem minmax(0,1fr);grid-template-rows:auto minmax(0,1fr);grid-template-areas:"ico tx" "packs packs";align-items:start;gap:.6rem .85rem;height:var(--h);min-height:0;padding:1rem;border-radius:14px;overflow:hidden}
.pf-ico{grid-area:ico}
.pf-tx{grid-area:tx;padding-right:1.4rem}
.pf-name,.pf-cat{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
.pf-packs{grid-area:packs;align-self:end;flex-wrap:nowrap;justify-content:flex-start;min-width:0;padding-right:5.6rem;overflow:hidden}
.pf-chev{top:1.1rem;right:.8rem}
.pf-add{top:calc(var(--h) - 3.1rem);bottom:auto;right:1rem;left:auto}
.pf-d[open] .pf-sum{background:none}
/* an opened card takes the whole row, so the others keep their size */
.pf-row:has(.pf-d[open]){--h:7.4rem;grid-column:1/-1;box-shadow:inset 0 0 0 1.5px var(--navy)}
.pf-d[open] .pf-name,.pf-d[open] .pf-cat{-webkit-line-clamp:1}
.pf-open{padding:0 1rem 1rem calc(1rem + 2.6rem + .85rem)}
.pf-open .pf-facts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 2rem}
.pf-open .pf-facts div{grid-template-columns:8rem minmax(0,1fr);gap:.1rem 1rem}
.pf-open .pf-facts div:nth-child(2){border-top:0}
/* each card as a product label: a band in the colour of its kind across the top, the kind named under it,
   the name as the card's title beside a large drawing of its pack, and the packs and Add along a ruled foot */
.pf-row{--h:11.2rem;overflow:hidden;border-radius:14px;background:var(--theme-surface-2)}
.pf-row::before{content:"";position:absolute;inset:0 0 auto;height:5px;background:var(--tint)}
.pf-sum{grid-template-columns:minmax(0,1fr) 3.2rem;grid-template-rows:auto auto minmax(0,1fr);grid-template-areas:"fam fam" "tx ico" "packs packs";gap:.45rem .9rem;padding:1.05rem 1rem .9rem}
.pf-fam{grid-area:fam;display:flex;align-items:center;gap:.45rem;min-width:0;padding-right:1.8rem;font-size:var(--fs-body);font-weight:500;color:var(--tint);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pf-tx{padding-right:0}
.pf-name{font-family:var(--sans);font-size:var(--fs-body);font-weight:700;line-height:1.35;letter-spacing:0;color:var(--ink)}
.pf-cat{margin-top:.15rem;line-height:1.45}
.pf-ico{width:3.2rem;height:3.2rem;border-radius:50%;background:color-mix(in srgb,var(--tint) 12%,transparent);color:var(--tint)}
.pf-ico svg{width:1.7rem;height:1.7rem}
.pf-packs{margin:0 -1rem;padding:.7rem 6.6rem 0 1rem;border-top:1px solid var(--line)}
.pf-packs span{background:color-mix(in srgb,var(--tint) 9%,var(--theme-white));color:var(--ink)}
.pf-chev{top:.95rem}
.pf-add{top:calc(var(--h) - 2.95rem)}
.pf-row:has(.pf-d[open]){--h:9.4rem}
.pf-row:has(.pf-d[open])::before{height:6px}
.pf-open{padding:.4rem 1rem 1rem;border-top:1px solid var(--line)}
.pf-ofoot{flex-direction:row;align-items:flex-end}
@media (max-width:1199px){.pf-rows{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:699px){
  .pf-open{padding-left:1rem}
  .pf-open .pf-facts{grid-template-columns:minmax(0,1fr)}
  .pf-open .pf-facts div{grid-template-columns:minmax(0,1fr)}
  .pf-open .pf-facts div:nth-child(2){border-top:1px solid var(--line)}
  .pf-ofoot{flex-direction:column;align-items:flex-start}
  .pf-acts{flex-direction:column;align-items:stretch;width:100%}
  .pf-rate,.pf-alt{justify-content:center}
}
@media (max-width:599px){.pf-rows{grid-template-columns:minmax(0,1fr)}.pf-row,.pf-row:has(.pf-d[open]){--h:11rem}.pf-d[open] .pf-name,.pf-d[open] .pf-cat{-webkit-line-clamp:2}}

/* the enquiry, floating at the foot of the screen */
.rl{position:fixed;left:50%;bottom:max(1rem,env(safe-area-inset-bottom));z-index:36;width:min(38rem,calc(100vw - 2 * var(--gutter,1rem)));transform:translateX(-50%);animation:rl-in .4s cubic-bezier(.2,.8,.2,1)}
.rl[hidden]{display:none}
@keyframes rl-in{from{opacity:0;transform:translate(-50%,16px)}}
.rl-card{overflow:hidden;border-radius:8px;background:var(--navy);color:var(--theme-on-dark);box-shadow:0 26px 50px -24px color-mix(in srgb,var(--theme-shadow) 75%,transparent),0 0 0 1px color-mix(in srgb,var(--theme-white) 6%,transparent)}
.rl-bar{display:flex;align-items:center;gap:.45rem;padding:.45rem}
.rl-sum{display:flex;flex:1;align-items:center;gap:.6rem;min-width:0;height:2.8rem;padding:0 .7rem 0 .45rem;border:0;border-radius:6px;background:transparent;color:inherit;font:inherit;font-size:var(--fs-body);font-weight:500;text-align:left;white-space:nowrap;cursor:pointer;transition:background-color .2s}
.rl-sum:hover{background:color-mix(in srgb,var(--theme-white) 7%,transparent)}
.rl-sum svg{width:15px;height:15px;margin-left:auto;opacity:.7;transform:rotate(180deg);transition:transform .3s}
.rl-sum[aria-expanded="true"] svg{transform:none}
.rl-n{display:grid;place-items:center;flex:none;min-width:1.85rem;height:1.85rem;padding:0 .45rem;border-radius:6px;background:var(--theme-surface);color:var(--navy);font-weight:700;font-variant-numeric:tabular-nums;transition:transform .3s cubic-bezier(.3,1.6,.5,1)}
.rl-n.is-bump{transform:scale(1.22)}
.rl-send{display:inline-flex;align-items:center;gap:.45rem;flex:none;height:2.8rem;padding:0 1.1rem;border-radius:6px;background:var(--theme-whatsapp);color:var(--theme-on-whatsapp);font-size:var(--fs-body);font-weight:600;text-decoration:none;white-space:nowrap;transition:background-color .2s}
.rl-send:hover{background:var(--theme-whatsapp-hover)}
.rl-send .pg-ar{width:1.1rem;height:1.1rem}
.rl-card button:focus-visible,.rl-card select:focus-visible,.rl-card input:focus-visible,.rl-send:focus-visible{outline:2px solid var(--theme-white);outline-offset:2px}
.rl-open{padding:.5rem .5rem 0}
.rl-open[hidden]{display:none}
.rl-lines{display:grid;gap:3px;max-height:min(21rem,46svh);margin:0;padding:0;overflow:auto;overscroll-behavior:contain;list-style:none}
.rl-lines li{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.4rem .8rem;padding:.45rem .45rem .45rem .85rem;border-radius:6px;background:color-mix(in srgb,var(--theme-white) 6%,transparent);font-size:var(--fs-body);line-height:1.35}
.rl-name{flex:1 1 12rem;min-width:0}
.rl-ctl{display:flex;align-items:center;gap:.35rem}
.rl-pack{height:2.2rem;padding:0 1.9rem 0 .65rem;border:0;border-radius:8px;background:color-mix(in srgb,var(--theme-white) 10%,transparent) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 6l4 4 4-4' fill='none' stroke='%23f5f0e6' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right .55rem center/12px;font:inherit;font-size:var(--fs-body);color:var(--theme-on-dark);appearance:none;cursor:pointer}
.rl-pack option{color:var(--theme-dark);background:var(--theme-white)}
.rl-onepack{padding:0 .4rem;color:color-mix(in srgb,var(--theme-on-dark) 75%,transparent)}
.rl-qty{display:flex;align-items:center;height:2.2rem;border-radius:8px;background:color-mix(in srgb,var(--theme-white) 10%,transparent)}
.rl-qty button{display:grid;place-items:center;width:2.1rem;height:2.2rem;border:0;background:none;color:inherit;font:inherit;font-size:var(--fs-body);line-height:1;cursor:pointer;border-radius:8px}
.rl-qty button:hover{background:color-mix(in srgb,var(--theme-white) 10%,transparent)}
.rl-qty input{width:2.6rem;height:2.2rem;border:0;background:none;font:inherit;font-size:var(--fs-body);font-weight:600;color:var(--theme-on-dark);text-align:center;-moz-appearance:textfield}
.rl-qty input::-webkit-outer-spin-button,.rl-qty input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
.rl-rm{display:grid;place-items:center;width:2.2rem;height:2.2rem;border:0;border-radius:8px;background:transparent;color:inherit;cursor:pointer;opacity:.7;transition:background-color .2s,opacity .2s}
.rl-rm:hover{background:color-mix(in srgb,var(--theme-white) 10%,transparent);opacity:1}
.rl-rm svg{width:14px;height:14px}
.rl-foot{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.3rem 1rem;padding:.65rem .35rem .2rem .45rem;font-size:var(--fs-body);color:color-mix(in srgb,var(--theme-on-dark) 70%,transparent)}
.rl-foot button{height:2.2rem;padding:0 .4rem;border:0;background:none;font:inherit;font-size:var(--fs-body);font-weight:600;color:var(--theme-white);text-decoration:underline;text-underline-offset:3px;cursor:pointer}
/* the enquiry, as a light card: the list icon and count, packs and quantities when opened, and the WhatsApp button */
.rl-card{border-radius:18px;background:var(--card);color:var(--ink);box-shadow:0 30px 60px -26px color-mix(in srgb,var(--theme-shadow) 60%,transparent),0 0 0 1px color-mix(in srgb,var(--theme-ink) 12%,transparent)}
.rl-bar{gap:.5rem;padding:.55rem}
.rl-sum{height:3.4rem;gap:.75rem;padding:0 .8rem 0 .4rem;border-radius:12px}
.rl-sum:hover{background:color-mix(in srgb,var(--theme-ink) 5%,transparent)}
.rl-ico{display:grid;place-items:center;flex:none;width:2.6rem;height:2.6rem;border-radius:12px;background:var(--navy);color:var(--theme-on-dark)}
.rl-ico svg{width:1.35rem;height:1.35rem}
.rl-tx{display:flex;flex-direction:column;min-width:0;line-height:1.25}
.rl-tx b{display:flex;align-items:center;gap:.35rem;font-weight:600}
.rl-tx small{font-size:var(--fs-body);color:var(--mute)}
.rl-n{min-width:0;height:auto;padding:0;border-radius:0;background:none;color:var(--accent);font-weight:700}
.rl-sum svg:last-child{color:var(--mute)}
.rl-send{height:3.4rem;padding:0 1.3rem;border-radius:12px;color:var(--theme-white);box-shadow:0 10px 20px -12px color-mix(in srgb,var(--theme-whatsapp-dark) 80%,transparent)}
.rl-send:hover{background:var(--theme-whatsapp-hover)}
.rl-card button:focus-visible,.rl-card select:focus-visible,.rl-card input:focus-visible,.rl-send:focus-visible{outline:2px solid var(--accent)}
.rl-open{padding:.7rem .7rem 0;border-bottom:1px solid var(--line)}
.rl-lines{gap:.35rem}
.rl-lines li{padding:.55rem .55rem .55rem .9rem;border-radius:12px;background:var(--theme-surface-2);box-shadow:inset 0 0 0 1px var(--line)}
.rl-name{font-weight:600}
.rl-pack{background:color-mix(in srgb,var(--theme-ink) 7%,transparent) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 6l4 4 4-4' fill='none' stroke='%2312223b' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right .55rem center/12px;color:var(--ink)}
.rl-onepack{color:var(--mute)}
.rl-qty{background:color-mix(in srgb,var(--theme-ink) 7%,transparent)}
.rl-qty button:hover{background:color-mix(in srgb,var(--theme-ink) 10%,transparent)}
.rl-qty input{color:var(--ink)}
.rl-rm:hover{background:color-mix(in srgb,var(--theme-ink) 8%,transparent)}
.rl-foot{color:var(--mute)}
.rl-foot button{color:var(--ink)}
@media (max-width:599px){.rl-tx small{display:none}.rl-send{padding:0 1rem}}
/* compact: a small pill at the foot of the screen */
.rl{width:min(25rem,calc(100vw - 2 * var(--gutter,1rem)))}
.rl-card{border-radius:999px}
.rl-card:has(.rl-open:not([hidden])){border-radius:18px}
.rl-bar{gap:.35rem;padding:.35rem}
.rl-sum{height:2.6rem;gap:.55rem;padding:0 .6rem 0 .3rem;border-radius:999px}
.rl-ico{width:2rem;height:2rem;border-radius:50%}
.rl-ico svg{width:1.05rem;height:1.05rem}
.rl-tx small{display:none}
.rl-tx b{font-weight:600;white-space:nowrap}
.rl-send{height:2.6rem;padding:0 1rem;border-radius:999px;box-shadow:none}
.rl-send .pg-ar{width:1rem;height:1rem}

@media (max-width:1023px){
  /* tablets and phones: the filters as two rows of chips above the list */
  .pf{grid-template-columns:minmax(0,1fr);gap:1.2rem}
  .pf-side{position:static}
  .pf-chips{gap:.5rem}
  .pf-chiprow{flex-direction:row;gap:.4rem;overflow-x:auto;margin-inline:calc(-1 * var(--gutter,16px));padding:0 var(--gutter,16px) 2px;scrollbar-width:none}
  .pf-chiprow::-webkit-scrollbar{display:none}
  .pf-fh{display:none}
  .pf-chip{flex:none;width:auto;height:2.4rem;padding:0 .85rem;border-radius:6px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);white-space:nowrap}
  .pf-chip span{margin-left:0;padding-left:.15rem}
  .pf-chip[aria-pressed="true"]{box-shadow:none}
  .pf-chiprow--brands{display:flex}
  .pf-bt{width:9rem;height:3rem;padding:.35rem 2rem .35rem 1.8rem}
  .pf-bt .pf-ck{top:50%;margin-top:-.5rem}
  .pf-bt > span{top:50%;transform:translateY(-50%)}
  .pf-blogo img{max-height:2rem}
}
@media (max-width:699px){
  .pf-search{height:3.2rem}
  .pf-search input{font-size:var(--fs-body)}
  .pf-ofoot{flex-direction:column;align-items:flex-start}
  .rl-send span{display:none}
  .rl-send{width:2.8rem;padding:0;justify-content:center}
  .rl-send .pg-ar{width:1.25rem;height:1.25rem}
}
/* the product's picture on the right of the card, larger */
.pf-sum{grid-template-columns:minmax(0,1fr) 6.6rem}
.pf-row{--h:13.6rem}
.pf-row:has(.pf-d[open]){--h:13.6rem}
.pf-d[open] .pf-name,.pf-d[open] .pf-cat{-webkit-line-clamp:2}
.pf-ico{align-self:start;width:6.6rem;height:6.6rem;border-radius:12px;background:radial-gradient(circle at 50% 38%,var(--theme-white) 0,color-mix(in srgb,var(--tint) 9%,var(--theme-white)) 70%);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--tint) 14%,transparent)}
.pf-ico svg.pa{width:100%;height:100%;transition:transform .35s cubic-bezier(.2,.8,.2,1)}
.pf-row:hover .pf-ico svg.pa{transform:translateY(-2px) scale(1.04)}
.pf-ico--photo{background:var(--theme-white);box-shadow:inset 0 0 0 1px var(--line)}
.pf-ico img{display:block;width:100%;height:100%;padding:.3rem;box-sizing:border-box;object-fit:contain}
/* in an opened card: the description and the video, as two links */
.pf-media{display:flex;gap:.5rem;padding:.3rem 0 0}
.pf-media .pf-vlink{flex:1 1 0;justify-content:center;min-width:0}
.pf-vlink{display:inline-flex;align-items:center;gap:.5rem;height:2.4rem;padding:0 .95rem 0 .75rem;border:0;border-radius:6px;background:color-mix(in srgb,var(--tint) 10%,var(--theme-white));box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--tint) 30%,transparent);font:inherit;font-size:var(--fs-body);font-weight:600;color:var(--ink);cursor:pointer;transition:background-color .2s,box-shadow .2s}
.pf-vlink svg{width:1.15rem;height:1.15rem;color:var(--tint)}
.pf-vlink:hover{box-shadow:inset 0 0 0 1.5px var(--tint)}
.pf-vlink:focus-visible{outline:2px solid var(--accent);outline-offset:2px}

/* the viewer */
.pv{width:min(44rem,calc(100vw - 2rem));max-width:none;max-height:calc(100svh - 2rem);margin:auto;padding:0;border:0;border-radius:16px;background:var(--theme-surface-2);color:var(--ink);box-shadow:0 40px 80px -30px color-mix(in srgb,var(--theme-shadow) 60%,transparent);overflow:hidden}
.pv[open]{display:flex;flex-direction:column;animation:pv-in .25s cubic-bezier(.2,.8,.2,1)}
.pv::backdrop{background:color-mix(in srgb,var(--theme-shadow) 55%,transparent)}
@keyframes pv-in{from{opacity:0;transform:translateY(12px)}}
.pv-head{display:flex;align-items:center;gap:.9rem;padding:1rem 1rem .9rem 1.2rem;border-top:5px solid var(--tint,var(--theme-primary))}
.pv-pic{display:grid;place-items:center;flex:none;width:3.4rem;height:3.4rem;border-radius:10px;background:color-mix(in srgb,var(--tint,var(--theme-primary)) 12%,var(--theme-white));color:var(--tint,var(--theme-primary));overflow:hidden}
.pv-pic svg{width:1.7rem;height:1.7rem}
.pv-pic svg.pa{width:100%;height:100%}
.pv-pic img{width:100%;height:100%;object-fit:contain;background:var(--theme-white)}
.pv-tx{display:flex;flex-direction:column;min-width:0;flex:1}
.pv-brand{font-size:var(--fs-body);color:var(--mute)}
.pv-name{font-family:var(--display);font-size:var(--fs-sub);font-weight:600;line-height:1.2}
.pv-x{display:grid;place-items:center;flex:none;width:2.6rem;height:2.6rem;padding:0;border:0;border-radius:50%;background:color-mix(in srgb,var(--theme-ink) 6%,transparent);color:var(--ink);cursor:pointer}
.pv-x:hover{background:color-mix(in srgb,var(--theme-ink) 12%,transparent)}
.pv-x svg{width:1rem;height:1rem}
.pv-tabs{display:flex;gap:.3rem;padding:0 1.2rem;border-bottom:1px solid var(--line)}
.pv-tab{position:relative;height:2.8rem;padding:0 .8rem;border:0;background:none;font:inherit;font-size:var(--fs-body);font-weight:600;color:var(--mute);cursor:pointer}
.pv-tab[aria-selected="true"]{color:var(--ink)}
.pv-tab[aria-selected="true"]::after{content:"";position:absolute;left:.6rem;right:.6rem;bottom:-1px;height:2px;border-radius:2px;background:var(--tint,var(--theme-primary))}
.pv-tab:focus-visible,.pv-x:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.pv-body{min-height:11rem;padding:1.2rem 1.2rem 1.4rem;overflow-y:auto}
.pv-pane[hidden]{display:none}
.pv-desc{margin:0;font-size:var(--fs-body);line-height:1.65;white-space:pre-line}
.pv-video video,.pv-video iframe{display:block;width:100%;aspect-ratio:16/9;border:0;border-radius:10px;background:#000}
.pv-none{display:flex;flex-direction:column;align-items:center;gap:.6rem;margin:0;padding:2.4rem 1rem;border-radius:10px;background:color-mix(in srgb,var(--tint,var(--theme-primary)) 7%,var(--theme-white));font-size:var(--fs-body);color:var(--mute);text-align:center}
.pv-none[hidden]{display:none}
.pv-none svg{width:2.2rem;height:2.2rem;color:var(--tint,var(--theme-primary))}
@media (max-width:599px){
  .pv{width:100%;max-height:88svh;margin:auto auto 0;border-radius:16px 16px 0 0}
}
@media (prefers-reduced-motion:reduce){.pv[open]{animation:none}}

/* phones: two cards to a row, like a shop app: the pack drawn large on top, then the kind, name and line, the pack sizes, and Add across the foot */
@media (max-width:599px){
  .pf-rows{grid-template-columns:repeat(2,minmax(0,1fr));gap:.6rem}
  .pf-row,.pf-row:has(.pf-d[open]){--h:18.4rem}
  .pf-row:has(.pf-d[open]){grid-column:1/-1}
  .pf-sum{grid-template-columns:minmax(0,1fr);grid-template-rows:auto auto auto minmax(0,1fr);grid-template-areas:"ico" "fam" "tx" "packs";gap:.35rem;padding:.7rem .7rem 3.5rem}
  .pf-ico{width:100%;height:4.8rem;border-radius:10px}
  .pf-ico svg{width:2.6rem;height:2.6rem}
  .pf-fam{display:block;padding-right:0;margin-top:.25rem}
  .pf-name{-webkit-line-clamp:2}
  .pf-cat{-webkit-line-clamp:1}
  .pf-cat{margin-top:.1rem}
  .pf-packs{align-self:end;margin:0;padding:0;border-top:0;flex-wrap:nowrap;overflow:hidden}
  .pf-packs span{height:1.7rem;padding:0 .5rem}
  .pf-chev{top:1.1rem;right:1.1rem;width:1.7rem;height:1.7rem;border-radius:50%;background:color-mix(in srgb,var(--theme-white) 75%,transparent)}
  .pf-add{top:auto;bottom:.7rem;left:.7rem;right:.7rem;justify-content:center;height:2.3rem}
  .pf-row:has(.pf-d[open]) .pf-add{top:calc(var(--h) - 3rem);bottom:auto}
  .pf-open{padding:.4rem .8rem .9rem}
}
/* an opened card keeps its place and size: only the description and video links show under it */
.pf-rows .pf-row:has(.pf-d[open]){grid-column:auto}
.pf-open{padding:.7rem 1rem .9rem}
@media (max-width:599px){.pf-media{flex-direction:column}.pf-media .pf-vlink{flex:none}.pf-d[open] .pf-cat{-webkit-line-clamp:1}.pf-open{padding:.6rem .7rem .8rem}}

/* polish: a card lifts a little on hover; an added card is outlined and its picture marked; the picture sits in a calm, even box */
.pf-row{transition:box-shadow .25s,transform .25s}
@media (hover:hover){.pf-row:hover{transform:translateY(-2px);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 28%,transparent),0 18px 34px -24px color-mix(in srgb,var(--theme-ink) 55%,transparent)}}
.pf-row:has(.pf-add.is-on){box-shadow:inset 0 0 0 1.5px var(--navy)}
.pf-ico{position:relative;border-radius:14px}
.pf-ico--photo img{padding:0;object-fit:cover;border-radius:13px}
.pf-row:has(.pf-add.is-on) .pf-ico::after{content:"";position:absolute;top:-.35rem;left:-.35rem;width:1.35rem;height:1.35rem;border-radius:50%;background:var(--navy) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M3.5 8.4 6.6 11.4 12.6 4.8' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat center/70%;box-shadow:0 0 0 2px var(--theme-surface-2)}
.pf-add.is-on:hover{background:var(--accent)}
.pf-more{height:2.8rem;background:color-mix(in srgb,var(--theme-white) 55%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 16%,transparent)}
.pf-more:hover{background:var(--theme-white);box-shadow:inset 0 0 0 1.5px var(--navy)}
.pf-bh{gap:.75rem}
@media (prefers-reduced-motion:reduce){.pf-row,.pf-row:hover{transition:none;transform:none}}
`;
