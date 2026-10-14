/**
 * The products page's finder: "who makes what" and the list it opens.
 *
 *   filters   a brand and a kind of product, each with how many there are,
 *             in a white panel beside the list (on phones, two rows of chips)
 *   search    by name, use or pack size, across the whole list
 *   list      the products as cards, brand by brand: what it is and its packs at
 *             a glance; open a card for its description and video
 *   enquiry   products added from their cards ride in a bar at the foot of the
 *             screen, each with its pack and how many, and go to RPC on
 *             WhatsApp as one message
 *
 * Colour: blue for structure (the panel's eyebrows, the cards' top line, the
 * pack drawings), orange only where something is pressed or picked (a chosen
 * kind or brand, "Added", an opened card's chevron, the hover bar, the send
 * button). Every fact is RPC's spreadsheet's (lib/products); it lists no
 * prices, so rates are asked for. Without scripts every product is listed and
 * each card still opens.
 */
import { BRAND_LOGOS } from "../methods/brand-logos";
import { imageSrc, mediaOf, videoSrc } from "../products/media";
import { FAMILIES, familyOf, type Product } from "../products";
import { brandMark, type BrandInfo, type JobView } from "../products/brands";
import { fullName, shortName } from "../products/compare";
import { packArt } from "../products/pack-art";
import { esc, waGlyph, type ContactInfo } from "./kit";

const search = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m16 16 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;
const chev = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const plus = `<svg class="pf-plus" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3.5v9M3.5 8h9" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`;
const tick = `<svg class="pf-tick" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.4 6.6 11.4 12.6 4.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/** what the search looks through */
const searchText = (p: Product) => [p.brand, p.name, p.category, p.purpose, p.areas, ...p.packs.map((k) => `${k.size} ${k.listed}`)].join(" ").toLowerCase().replace(/\s+/g, " ");

const docIco = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>`;
const playIco = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 8.8v6.4l5.2-3.2z" fill="currentColor"/></svg>`;

/** the viewer a card's "Description" and "Video" open; the page's script fills it from the card */
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
  <div class="pv-body" data-lenis-prevent>
    <div class="pv-pane" data-pv-pane="desc" role="tabpanel"><p class="pv-desc" data-pv-desc></p></div>
    <div class="pv-pane" data-pv-pane="video" role="tabpanel" hidden>
      <div class="pv-video" data-pv-video></div>
      <p class="pv-none" data-pv-none hidden>${playIco}<span>The video for this product is on its way.</span></p>
    </div>
  </div>
</dialog>`;

/**
 * One product: a card that opens. The pack is drawn in the page's --tint, which
 * the page sets to brand blue for every kind (the kinds' own colours stay in the
 * data and the card's style attribute, for the scripts).
 */
function row(p: Product, _c: ContactInfo, _js: readonly JobView[]) {
  const f = familyOf(p.family);
  const cat = p.category === "Construction chemical" ? "Ask us what this one is best used for" : p.category;
  const m = mediaOf(p.slug);
  const img = imageSrc(m);
  const media = `<div class="pf-media" data-view="${p.slug}" data-view-desc="${esc(m.description ?? p.purpose)}"${img ? ` data-view-img="${esc(img)}"` : ""}${videoSrc(m) ? ` data-view-video="${esc(videoSrc(m))}"` : ""}>
          <button type="button" class="pf-vlink" data-view-go="desc">${docIco}<span>Description</span></button>
          <button type="button" class="pf-vlink" data-view-go="video">${playIco}<span>Video</span></button>
        </div>`;
  return `<li class="pf-row pg-cardx" id="${p.slug}" data-family="${p.family}" data-q="${esc(searchText(p))}" style="--tint:${f.tint}">
  <details class="pf-d">
    <summary class="pf-sum">
      <span class="pf-fam">${esc(f.label)}</span>
      <span class="pf-ico${img ? " pf-ico--photo" : ""}">${img ? `<img src="${esc(img)}" alt="" loading="lazy" decoding="async">` : packArt(p.slug, p.packs[0]?.shape ?? "bag", "var(--tint)", p.packs[0]?.size ?? "")}</span>
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

/** a brand as its logo where RPC has one, otherwise its name */
const brandFace = (name: string) =>
  BRAND_LOGOS[name]
    ? `<img src="/images/brands/${esc(BRAND_LOGOS[name]!)}" alt="${esc(name)}" loading="lazy" decoding="async">`
    : `<strong>${esc(name)}</strong>`;

/** a filter group's title: the blue eyebrow (a rule ending in a diamond), the name and how many are picked */
const groupTitle = (id: string, label: string, picked: "fam" | "brand") =>
  `<p class="pf-fh" id="${id}"><span class="pg-rule" aria-hidden="true"></span>${label}<span class="pf-picked" data-picked="${picked}"></span></p>`;

/**
 * The filters: a kind of product and a brand, each with how many (a panel beside
 * the list; on phones, two rows that scroll sideways). The FIRST <span> in every
 * chip is its count: the page's script rewrites it.
 */
function filters(bs: readonly BrandInfo[], total: number) {
  const fams = FAMILIES.filter((f) => bs.some((b) => b.products.some((p) => p.family === f.key)));
  const count = (f: string) => bs.reduce((s, b) => s + b.products.filter((p) => p.family === f).length, 0);
  const box = `<b class="pf-ck" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></b>`;
  return `<div class="pf-chips" data-chips>
  <div class="pf-chiprow" role="group" aria-labelledby="pf-ff">
    ${groupTitle("pf-ff", "Kind of product", "fam")}
    <button type="button" class="pf-chip pf-chip--all" data-chip-fam="all" aria-pressed="true">Every kind<span>${total}</span></button>
    ${fams.map((f) => `<button type="button" class="pf-chip" data-chip-fam="${f.key}" data-label="${esc(f.label)}" aria-pressed="false">${box}${esc(f.label)}<span data-chip-n>${count(f.key)}</span></button>`).join("")}
  </div>
  <div class="pf-chiprow pf-chiprow--brands" role="group" aria-labelledby="pf-fb">
    ${groupTitle("pf-fb", "Brand", "brand")}
    <button type="button" class="pf-chip pf-chip--all" data-chip-brand="all" aria-pressed="true">All brands<span>${total}</span></button>
    ${bs.map((b) => `<button type="button" class="pf-chip pf-bt" data-chip-brand="${b.key}" aria-pressed="false" style="--c:${brandMark(b.name)}">${box}<em class="pf-blogo">${brandFace(b.name)}</em><span>${b.count}</span></button>`).join("")}
  </div>
</div>`;
}

export function finderMarkup(bs: readonly BrandInfo[], c: ContactInfo, js: readonly JobView[], total: number) {
  // the brand heading keeps its child order (logo or mark first, then b.pf-bhn): the script reads the name from childNodes[1]
  const lists = bs
    .map(
      (b) => `<section class="pf-brand" id="brand-${b.key}" data-brand="${b.key}" aria-labelledby="pf-h-${b.key}">
  <h3 class="pf-bh${BRAND_LOGOS[b.name] ? " pf-bh--logo" : ""}" id="pf-h-${b.key}" style="--c:${brandMark(b.name)}">${BRAND_LOGOS[b.name] ? `<em class="pf-bhl"><img src="/images/brands/${esc(BRAND_LOGOS[b.name]!)}" alt="" loading="lazy" decoding="async"></em>` : `<i aria-hidden="true"></i>`}<b class="pf-bhn">${esc(b.name)}</b><span data-bcount>${b.count} ${b.count === 1 ? "product" : "products"}</span></h3>
  <ul class="pf-rows">${b.products.map((p) => row(p, c, js)).join("")}</ul>
  <button type="button" class="pf-more" data-more hidden>Show all ${b.count} ${esc(b.name)} products${chev}</button>
</section>`,
    )
    .join("");
  return `<section class="pg-sec pg-sec--white pf-sec" id="find" aria-labelledby="pf-title">
  <div class="pg-wrap">
    <h2 class="sr-only" id="pf-title">All ${total} products, by brand</h2>
    <div class="pf">
      <div class="pf-side" data-lenis-prevent>${filters(bs, total)}</div>
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
      <ol class="rl-lines" data-rl-lines data-lenis-prevent></ol>
      <div class="rl-foot"><span>Pick the pack and how many. We reply on WhatsApp with today’s rates.</span><button type="button" data-rl-clear>Clear the list</button></div>
    </div>
    <div class="rl-bar">
      <button type="button" class="rl-sum" data-rl-toggle aria-expanded="false" aria-controls="rl-open"><span class="rl-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="17" rx="2.5"/><path d="M9 4.5V3h6v1.5M8.5 10h7M8.5 14h7M8.5 18h4"/></svg></span><span class="rl-tx"><b><span class="rl-n" data-rl-n>0</span> in your enquiry</b><small>Packs and quantities</small></span>${chev}</button>
      <a class="rl-send" data-rl-send href="${esc(c.whatsapp)}" target="_blank" rel="noopener noreferrer">${waGlyph}<span>Ask for these rates</span></a>
    </div>
  </div>
</div>`;
}

/* a chevron drawn in CSS for the browser's own lists (no picture, so it takes the theme's colour) */
const CHEV_BG = `background-image:linear-gradient(45deg,transparent 50%,var(--mute) 50%),linear-gradient(135deg,var(--mute) 50%,transparent 50%);background-repeat:no-repeat;background-size:5px 5px,5px 5px`;
/* a link's underline: a faint blue line at rest, an orange one growing over it under the pointer */
const LINE_BG = `background:linear-gradient(var(--act),var(--act)) left bottom/0% 1.5px no-repeat,linear-gradient(color-mix(in srgb,var(--accent) 35%,transparent),color-mix(in srgb,var(--accent) 35%,transparent)) left bottom/100% 1px no-repeat`;

export const FINDER_CSS = `
/* ═══ the finder: a white filter panel beside the list ═══ */
.pf-sec{padding-block:clamp(2.6rem,6vh,4rem) clamp(3.6rem,9vh,6rem)}
.pf{display:grid;grid-template-columns:17.5rem minmax(0,1fr);gap:clamp(1.6rem,3vw,3rem);align-items:start}
.pf-side{position:sticky;top:calc(var(--nav-bar,64px) + 1.2rem);max-height:calc(100svh - var(--nav-bar,64px) - 2.4rem);overflow-y:auto;scrollbar-width:thin;scrollbar-color:color-mix(in srgb,var(--theme-ink) 18%,transparent) transparent;padding:1.2rem 1rem 1.3rem;border-radius:var(--r-card);background:var(--theme-surface);box-shadow:inset 0 0 0 1px var(--line)}
/* when the filters run past the bottom of the screen, the panel's lower edge fades out until it is scrolled to the end, so it reads as "more below" */
@property --pf-fade{syntax:'<length>';inherits:false;initial-value:0px}
@supports (animation-timeline:scroll()){
  .pf-side{-webkit-mask-image:linear-gradient(to bottom,black calc(100% - var(--pf-fade)),transparent);mask-image:linear-gradient(to bottom,black calc(100% - var(--pf-fade)),transparent);animation:pf-fade linear both;animation-timeline:scroll(self)}
  @keyframes pf-fade{from{--pf-fade:3rem}to{--pf-fade:0px}}
}
.pf-chips{display:flex;flex-direction:column;gap:1.4rem}
.pf-chiprow{display:flex;flex-direction:column;gap:.1rem}
/* each group's title: the blue eyebrow, and how many are picked */
.pf-fh{display:flex;align-items:center;gap:.6rem;margin:0 0 .55rem;font-size:var(--fs-body);font-weight:600;line-height:1.3;color:var(--accent)}
.pf-fh .pg-rule{width:1.2rem}
.pf-picked{margin-left:auto;padding:.1rem .55rem;border-radius:var(--r-pill);background:var(--theme-primary-soft);font-weight:600;color:var(--navy);white-space:nowrap}
.pf-picked:empty{display:none}
/* a kind: a tick box, its name and its count (the first <span>); picked = the action colour */
.pf-chip{position:relative;display:flex;align-items:center;gap:.6rem;width:100%;min-height:2.45rem;padding:.35rem .5rem .35rem .6rem;border:0;border-radius:var(--r-ctl);background:none;font:inherit;font-size:var(--fs-body);line-height:1.3;color:var(--ink);text-align:left;cursor:pointer;transition:background-color .2s var(--ease),color .2s var(--ease),box-shadow .2s var(--ease)}
.pf-chip>span{display:inline-grid;place-items:center;flex:none;min-width:1.9rem;height:1.55rem;margin-left:auto;padding:0 .45rem;border-radius:var(--r-pill);background:var(--theme-bg);font-weight:600;line-height:1;color:var(--mute);font-variant-numeric:tabular-nums;transition:background-color .2s var(--ease),color .2s var(--ease)}
.pf-chip:hover{background:var(--theme-primary-soft)}
.pf-chip[aria-pressed="true"]{background:var(--act);color:var(--on-act);font-weight:600}
.pf-chip[aria-pressed="true"]:hover{background:var(--act-h)}
.pf-chip[aria-pressed="true"]>span{background:color-mix(in srgb,var(--theme-white) 60%,transparent);color:var(--on-act)}
/* the two "all" chips are the resting choice, not an action, so they stay blue; orange appears once a visitor picks a kind or a brand */
.pf-chip--all[aria-pressed="true"]{background:var(--theme-primary-soft);color:var(--navy)}
.pf-chip--all[aria-pressed="true"]:hover{background:color-mix(in srgb,var(--theme-primary) 22%,var(--theme-white))}
.pf-chip--all[aria-pressed="true"]>span{background:var(--theme-surface);color:var(--navy)}
.pf-chip[data-empty]{opacity:.45}
.pf-ck{display:grid;place-items:center;flex:none;width:1.15rem;height:1.15rem;border-radius:4px;background:var(--theme-surface);box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--theme-ink) 30%,transparent);color:transparent;transition:background-color .2s var(--ease),color .2s var(--ease),box-shadow .2s var(--ease)}
.pf-ck svg{width:.8rem;height:.8rem}
.pf-chip[aria-pressed="true"] .pf-ck{box-shadow:none;color:var(--ink)}
/* brands as white logo tiles, two to a row: the count in the corner; picked = an orange ring and an orange check badge */
.pf-chiprow--brands{display:grid;grid-template-columns:1fr 1fr;gap:.5rem}
.pf-chiprow--brands .pf-fh,.pf-chiprow--brands .pf-chip--all{grid-column:1/-1}
.pf-chiprow--brands .pf-fh{margin-bottom:.05rem}
.pf-bt{justify-content:center;height:4.1rem;min-height:0;padding:1.55rem .6rem .45rem;background:var(--theme-surface);box-shadow:inset 0 0 0 1px var(--line)}
.pf-bt:hover{background:var(--theme-surface);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 35%,transparent)}
.pf-chip.pf-bt[aria-pressed="true"],.pf-chip.pf-bt[aria-pressed="true"]:hover{background:var(--theme-surface);color:var(--ink);box-shadow:inset 0 0 0 2px var(--act)}
.pf-bt .pf-ck{position:absolute;left:.4rem;top:.4rem;width:1.15rem;height:1.15rem;border-radius:50%;box-shadow:none;opacity:0;transform:scale(.6);transition:opacity .2s var(--ease),transform .3s var(--ease)}
.pf-chip.pf-bt[aria-pressed="true"] .pf-ck{background:var(--act);color:var(--on-act);opacity:1;transform:none}
.pf-bt>span{position:absolute;right:.4rem;top:.4rem;min-width:1.6rem;height:1.35rem;margin:0;padding:0 .35rem}
.pf-chip.pf-bt[aria-pressed="true"]>span{background:var(--theme-bg);color:var(--mute)}
.pf-blogo{display:grid;place-items:center;width:100%;height:100%;font-style:normal}
.pf-blogo img{display:block;width:auto;height:auto;max-width:100%;max-height:1.9rem;object-fit:contain}
.pf-blogo strong{font-family:var(--display);font-weight:700;letter-spacing:-.01em;color:var(--ink)}

/* ═══ the list ═══ */
.pf-main{min-width:0}
/* search: a white pill; a blue ring while typing; the clear button turns orange under the pointer */
.pf-search{display:flex;align-items:center;gap:.7rem;height:3.25rem;padding:0 .45rem 0 1.25rem;border-radius:var(--r-pill);background:var(--theme-surface);box-shadow:inset 0 0 0 1px var(--line);cursor:text;transition:box-shadow .2s var(--ease)}
.pf-search:hover{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 35%,transparent)}
.pf-search:focus-within{box-shadow:inset 0 0 0 2px var(--accent)}
.pf-search>svg{flex:none;width:1.15rem;height:1.15rem;color:var(--mute)}
.pf-search input{flex:1;min-width:0;height:100%;border:0;background:none;font:inherit;font-size:var(--fs-body);color:var(--ink);outline:none}
.pf-search input::placeholder{color:var(--mute);opacity:1}
.pg .pf-search input:focus-visible{outline:none}
.pf-search input::-webkit-search-cancel-button{-webkit-appearance:none;appearance:none}
.pf-x{display:grid;place-items:center;flex:none;width:2.4rem;height:2.4rem;padding:0;border:0;border-radius:50%;background:var(--theme-bg);color:var(--ink);cursor:pointer;transition:background-color .2s var(--ease),color .2s var(--ease)}
.pf-x[hidden]{display:none}
.pf-x:hover{background:var(--act);color:var(--on-act)}
.pf-x svg{width:14px;height:14px}
.pf-state{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:.4rem 1rem;margin:1.1rem 0 1.5rem}
.pf-status{margin:0;font-size:var(--fs-body);font-weight:500;color:var(--mute)}
/* "Show every product": a link, navy on a faint line; an orange underline grows under the pointer */
.pf-clear,.pf-empty button{padding:0 0 3px;border:0;${LINE_BG};font:inherit;font-size:var(--fs-body);font-weight:600;color:var(--navy);cursor:pointer;transition:background-size .45s var(--ease),color .3s var(--ease)}
.pf-clear:hover,.pf-empty button:hover,.pf-clear:focus-visible,.pf-empty button:focus-visible{background-size:100% 1.5px,100% 1px;color:var(--act-t)}
.pf-clear[hidden]{display:none}
.pf-empty{margin:1.4rem 0 0;padding:1.6rem 1.2rem;border-radius:var(--r-card);background-color:var(--theme-surface-2);background-image:linear-gradient(var(--bp) 1px,transparent 1px),linear-gradient(90deg,var(--bp) 1px,transparent 1px);background-size:24px 24px;box-shadow:inset 0 0 0 1px var(--line);font-size:var(--fs-body);line-height:1.6;color:var(--mute);text-align:center}
.pf-empty[hidden]{display:none}

/* each brand: its logo (or a blue diamond and its name) over a hairline, the count as a muted pill at the right */
.pf-brand + .pf-brand{margin-top:clamp(2.2rem,5vh,3rem)}
.pf-brand[hidden]{display:none}
.pf-bh{display:flex;align-items:center;gap:.75rem;margin:0 0 1.1rem;padding-bottom:.85rem;border-bottom:1px solid var(--line);font-family:var(--display);font-size:var(--fs-sub);font-weight:600;line-height:1.2;letter-spacing:-.01em;scroll-margin-top:calc(var(--nav-bar,64px) + 1.4rem)}
.pf-bh i{flex:none;width:.6rem;height:.6rem;margin:0 .2rem;background:var(--accent);transform:rotate(45deg)}
.pf-bhn{font-weight:600}
.pf-bh--logo .pf-bhn{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.pf-bhl{display:inline-grid;place-items:center;height:2.75rem;padding:.35rem .85rem;border-radius:var(--r-ctl);background:var(--theme-surface);box-shadow:inset 0 0 0 1px var(--line);font-style:normal}
.pf-bhl img{display:block;width:auto;height:1.9rem;max-width:9rem;object-fit:contain}
.pf-bh>span{margin-left:auto;padding:.25rem .7rem;border-radius:var(--r-pill);background:var(--theme-bg);font-family:var(--sans);font-size:var(--fs-body);font-weight:500;line-height:1.3;letter-spacing:0;color:var(--mute);white-space:nowrap}

/* the cards, three to a row. Every kind is drawn in brand blue (the kinds' own colours stay in the data) */
.pf .pf-row[style],.pv{--tint:var(--theme-primary)!important}
.pf-rows{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:start;gap:1rem;margin:0;padding:0;list-style:none}
.pf-row{--h:13.8rem;position:relative;overflow:hidden;border-radius:var(--r-card);background:var(--theme-surface);box-shadow:inset 0 0 0 1px var(--line);scroll-margin-top:calc(var(--nav-bar,64px) + 1.4rem)}
.pf-row[hidden]{display:none}
/* a thin blue line along the top; the kit's orange bar grows along the foot under the pointer */
.pf-row::before{content:"";position:absolute;inset:0 0 auto;z-index:1;height:3px;background:color-mix(in srgb,var(--tint) 60%,transparent);pointer-events:none}
.pf-row:hover,.pf-row:focus-within{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 22%,transparent),var(--lift)}
.pf-row:has(.pf-d[open]),.pf-row:has(.pf-add.is-on){box-shadow:inset 0 0 0 1.5px var(--navy)}
.pf-row:has(.pf-d[open]):hover,.pf-row:has(.pf-add.is-on):hover,.pf-row:has(.pf-d[open]):focus-within,.pf-row:has(.pf-add.is-on):focus-within{box-shadow:inset 0 0 0 1.5px var(--navy),var(--lift)}
.pf-row.is-hit{animation:pf-hit 2.2s var(--ease)}
@keyframes pf-hit{0%,45%{box-shadow:inset 0 0 0 2px var(--accent),var(--lift)}}
/* every card the same size: the kind, the name beside the pack, then the packs and Add along a ruled foot */
.pf-sum{position:relative;display:grid;grid-template-columns:minmax(0,1fr) 6.6rem;grid-template-rows:auto auto minmax(0,1fr);grid-template-areas:"fam fam" "tx ico" "packs packs";align-items:start;gap:.5rem .9rem;height:var(--h);padding:1.1rem 1rem .9rem;list-style:none;cursor:pointer;overflow:hidden}
.pf-sum::-webkit-details-marker{display:none}
.pf-sum::marker{content:""}
.pg .pf-sum:focus-visible{outline-offset:-4px;border-radius:var(--r-card)}
.pf-fam{grid-area:fam;min-width:0;padding-right:2.4rem;font-size:var(--fs-body);font-weight:500;line-height:1.35;color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pf-tx{grid-area:tx;display:flex;flex-direction:column;gap:.2rem;min-width:0}
.pf-name,.pf-cat{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
.pf-name{font-size:var(--fs-body);font-weight:700;line-height:1.35;color:var(--ink)}
.pf-cat{font-size:var(--fs-body);line-height:1.45;color:var(--mute)}
/* the pack on a little drawing board, chamfered like every picture on the site; it zooms a touch under the pointer */
.pf-ico{grid-area:ico;position:relative;display:grid;place-items:center;align-self:start;width:6.6rem;height:6.6rem;overflow:hidden;border-radius:var(--r-ctl);background-color:var(--theme-surface-2);background-image:linear-gradient(var(--bp) 1px,transparent 1px),linear-gradient(90deg,var(--bp) 1px,transparent 1px);background-size:12px 12px;box-shadow:inset 0 0 0 1px var(--line);color:var(--accent);clip-path:polygon(.8rem 0,100% 0,100% 100%,0 100%,0 .8rem)}
.pf-ico svg.pa{width:100%;height:100%;transition:transform .8s var(--ease)}
.pf-ico--photo{background:var(--theme-surface)}
.pf-ico img{width:100%;height:100%;object-fit:cover;transition:transform .8s var(--ease)}
.pf-row:hover .pf-ico svg.pa,.pf-row:hover .pf-ico img{transform:scale(1.05)}
.pf-packs{grid-area:packs;align-self:end;display:flex;flex-wrap:nowrap;gap:.3rem;min-width:0;margin:0 -1rem;padding:.75rem 7.4rem 0 1rem;border-top:1px solid var(--line);overflow:hidden}
.pf-packs span{display:inline-flex;align-items:center;flex:none;height:1.85rem;padding:0 .6rem;border-radius:var(--r-ctl);background:var(--theme-bg);font-size:var(--fs-body);font-weight:500;color:var(--ink);white-space:nowrap}
/* the chevron in an outlined circle: it fills orange when the card is under the pointer or open */
.pf-chev{position:absolute;top:.8rem;right:.8rem;z-index:2;display:grid;place-items:center;width:2rem;height:2rem;border-radius:50%;background:var(--theme-surface);box-shadow:inset 0 0 0 1px var(--line);color:var(--navy);transition:background-color .3s var(--ease),color .3s var(--ease),box-shadow .3s var(--ease),transform .35s var(--ease)}
.pf-chev svg{width:14px;height:14px}
.pf-d[open] .pf-chev{background:var(--navy);box-shadow:none;color:var(--theme-on-dark)}
.pf-row:hover .pf-chev,.pf-sum:focus-visible .pf-chev{background:var(--act);box-shadow:none;color:var(--on-act)}
.pf-d[open] .pf-chev{transform:rotate(180deg)}
/* Add: an outlined pill (an orange ring under the pointer); added = filled orange, with a tick */
.pf-add{position:absolute;top:calc(var(--h) - 2.95rem);right:1rem;z-index:2;display:inline-flex;align-items:center;gap:.35rem;height:2.25rem;padding:0 .95rem 0 .75rem;border:0;border-radius:var(--r-pill);background:var(--theme-surface);box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--theme-ink) 22%,transparent);font:inherit;font-size:var(--fs-body);font-weight:600;line-height:1;color:var(--ink);cursor:pointer;transition:background-color .25s var(--ease),color .25s var(--ease),box-shadow .25s var(--ease),transform .25s var(--ease)}
.pf-add[hidden]{display:none}
.pf-add svg{width:14px;height:14px}
.pf-add .pf-tick,.pf-add.is-on .pf-plus{display:none}
.pf-add.is-on .pf-tick{display:block}
.pf-add:hover{background:color-mix(in srgb,var(--act) 10%,var(--theme-surface));box-shadow:inset 0 0 0 1.5px var(--act)}
.pf-add.is-on{background:var(--act);box-shadow:none;color:var(--on-act)}
.pf-add.is-on:hover{background:var(--act-h)}
.pf-add:active{transform:scale(.97)}
/* an opened card: its description and video, as two links */
.pf-open{padding:.75rem 1rem .95rem;border-top:1px solid var(--line)}
.pf-media{display:flex;flex-wrap:wrap;gap:.5rem 1.6rem}
.pf-vlink{display:inline-flex;align-items:center;gap:.5rem;padding:.3rem 0 4px;border:0;${LINE_BG};font:inherit;font-size:var(--fs-body);font-weight:600;color:var(--navy);cursor:pointer;transition:background-size .45s var(--ease),color .3s var(--ease)}
.pf-vlink svg{width:1.15rem;height:1.15rem;color:var(--accent);transition:color .3s var(--ease)}
.pf-vlink:hover,.pf-vlink:focus-visible{background-size:100% 1.5px,100% 1px;color:var(--act-t)}
.pf-vlink:hover svg{color:var(--act-t)}
/* "Show all N products": an outlined pill */
.pf-more{display:flex;align-items:center;justify-content:center;gap:.55rem;width:fit-content;height:3rem;margin:1.2rem auto 0;padding:0 1.4rem;border:0;border-radius:var(--r-pill);background:transparent;box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--theme-ink) 24%,transparent);font:inherit;font-size:var(--fs-body);font-weight:600;color:var(--ink);cursor:pointer;transition:box-shadow .3s var(--ease),background-color .3s var(--ease)}
.pf-more svg{width:14px;height:14px;transition:transform .35s var(--ease)}
.pf-more:hover{box-shadow:inset 0 0 0 1.5px var(--act);background:color-mix(in srgb,var(--act) 10%,transparent)}
.pf-more:hover svg{transform:translateY(2px)}
.pf-more[hidden]{display:none}

@media (max-width:1199px){.pf-rows{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:1023px){
  /* tablets and phones: the filters as two rows of chips above the list */
  .pf{grid-template-columns:minmax(0,1fr);gap:1.2rem}
  .pf-side{position:static;max-height:none;overflow:visible;padding:0;border-radius:0;background:none;box-shadow:none;-webkit-mask-image:none;mask-image:none;animation:none}
  .pf-chips{gap:.4rem}
  .pf-chiprow{flex-direction:row;gap:.45rem;overflow-x:auto;margin-inline:calc(-1 * var(--gutter,16px));padding:6px var(--gutter,16px);scrollbar-width:none}
  .pf-chiprow::-webkit-scrollbar{display:none}
  .pf-fh{display:none}
  .pf-chip{flex:none;width:auto;min-height:0;height:2.6rem;padding:0 .45rem 0 .95rem;border-radius:var(--r-pill);background:var(--theme-surface);box-shadow:inset 0 0 0 1px var(--line);white-space:nowrap}
  .pf-chip:hover{background:var(--theme-primary-soft)}
  .pf-chip[aria-pressed="true"]{box-shadow:none}
  .pf-chiprow--brands{display:flex}
  .pf-bt{width:auto;min-width:8.5rem;height:2.6rem;padding:0 .45rem 0 2.1rem;gap:.6rem}
  .pf-bt .pf-ck{left:.65rem;top:50%;margin-top:-.575rem;opacity:1;transform:none;box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--theme-ink) 30%,transparent)}
  .pf-chip.pf-bt[aria-pressed="true"] .pf-ck{box-shadow:none}
  .pf-bt>span{position:static}
  .pf-blogo{width:auto;min-width:4rem}
  .pf-blogo img{max-width:5.5rem;max-height:1.6rem}
}
@media (max-width:599px){
  /* phones: two cards to a row, like a shop app: the pack on top, then the kind, the name, the packs, and Add across the foot */
  .pf-rows{grid-template-columns:repeat(2,minmax(0,1fr));gap:.6rem}
  .pf-row{--h:18.4rem}
  .pf-sum{grid-template-columns:minmax(0,1fr);grid-template-rows:auto auto auto minmax(0,1fr);grid-template-areas:"ico" "fam" "tx" "packs";gap:.35rem;padding:.7rem .7rem 3.5rem}
  .pf-ico{width:100%;height:4.8rem}
  .pf-fam{padding-right:0;margin-top:.25rem}
  .pf-cat{-webkit-line-clamp:1}
  .pf-packs{margin:0;padding:0;border-top:0}
  .pf-packs span{height:1.7rem;padding:0 .5rem}
  .pf-chev{top:1.05rem;right:1.05rem;width:1.8rem;height:1.8rem}
  .pf-add{top:auto;bottom:.7rem;left:.7rem;right:.7rem;justify-content:center;height:2.4rem}
  .pf-row:has(.pf-d[open]) .pf-add{top:calc(var(--h) - 3.1rem);bottom:auto}
  .pf-open{padding:.6rem .7rem .8rem}
  .pf-media{flex-direction:column;align-items:flex-start;gap:.4rem}
  .pf-more{width:100%}
  .pf-bh{flex-wrap:wrap}
}

/* ═══ the viewer: white, chamfered, a navy hatched head; the chosen tab underlined in orange ═══ */
.pv{width:min(44rem,calc(100vw - 2rem));max-width:none;max-height:calc(100svh - 2rem);margin:auto;padding:0;border:0;border-radius:var(--r-card);background:var(--theme-surface);color:var(--ink);overflow:hidden;clip-path:polygon(var(--cut) 0,100% 0,100% 100%,0 100%,0 var(--cut))}
.pv[open]{display:flex;flex-direction:column;animation:pv-in .3s var(--ease)}
.pv::backdrop{background:color-mix(in srgb,var(--theme-shadow) 55%,transparent)}
@keyframes pv-in{from{opacity:0;transform:translateY(12px)}}
.pv-head{display:flex;align-items:center;gap:.9rem;padding:calc(1rem + 12px) 1rem 1rem 1.25rem;background:var(--hatch-img) 0 0/100% 12px no-repeat,var(--navy);color:var(--theme-on-dark)}
.pv-pic{display:grid;place-items:center;flex:none;width:3.6rem;height:3.6rem;overflow:hidden;border-radius:var(--r-ctl);background:var(--theme-surface);color:var(--accent)}
.pv-pic svg{width:1.7rem;height:1.7rem}
.pv-pic svg.pa{width:100%;height:100%}
.pv-pic img{width:100%;height:100%;object-fit:cover}
.pv-tx{display:flex;flex-direction:column;flex:1;min-width:0}
.pv-brand{font-size:var(--fs-body);color:var(--band-mute)}
.pv-name{font-family:var(--display);font-size:var(--fs-sub);font-weight:600;line-height:1.2;color:var(--theme-on-dark)}
.pv-x{display:grid;place-items:center;flex:none;width:2.6rem;height:2.6rem;padding:0;border:0;border-radius:50%;background:color-mix(in srgb,var(--theme-white) 12%,transparent);color:var(--theme-on-dark);cursor:pointer;transition:background-color .25s var(--ease),color .25s var(--ease),transform .35s var(--ease)}
.pv-x:hover{background:var(--act);color:var(--on-act);transform:rotate(90deg)}
.pv-x svg{width:1rem;height:1rem}
.pg .pv-head :focus-visible{outline-color:var(--theme-focus-on-dark)}
.pv-tabs{display:flex;gap:.4rem;padding:0 1.25rem;border-bottom:1px solid var(--line)}
.pv-tab{position:relative;height:3rem;padding:0 .8rem;border:0;background:none;font:inherit;font-size:var(--fs-body);font-weight:600;color:var(--mute);cursor:pointer;transition:color .2s var(--ease)}
.pv-tab:hover{color:var(--ink)}
.pv-tab::after{content:"";position:absolute;left:.6rem;right:.6rem;bottom:-1px;height:2px;background:var(--act);transform:scaleX(0);transform-origin:left;transition:transform .35s var(--ease)}
.pv-tab[aria-selected="true"]{color:var(--ink)}
.pv-tab[aria-selected="true"]::after{transform:scaleX(1)}
.pv-body{min-height:11rem;padding:1.25rem 1.25rem 1.5rem;overflow-y:auto}
.pv-pane[hidden]{display:none}
.pv-desc{margin:0;font-size:var(--fs-body);line-height:1.65;white-space:pre-line;color:var(--ink2)}
.pv-video video,.pv-video iframe{display:block;width:100%;aspect-ratio:16/9;border:0;border-radius:var(--r-ctl);background:var(--theme-dark)}
.pv-none{display:flex;flex-direction:column;align-items:center;gap:.6rem;margin:0;padding:2.4rem 1rem;border-radius:var(--r-ctl);background-color:var(--theme-surface-2);background-image:linear-gradient(var(--bp) 1px,transparent 1px),linear-gradient(90deg,var(--bp) 1px,transparent 1px);background-size:24px 24px;box-shadow:inset 0 0 0 1px var(--line);font-size:var(--fs-body);color:var(--mute);text-align:center}
.pv-none[hidden]{display:none}
.pv-none svg{width:2.2rem;height:2.2rem;color:var(--accent)}
@media (max-width:599px){
  .pv{width:100%;max-height:88svh;margin:auto auto 0;border-radius:var(--r-card) var(--r-card) 0 0}
}

/* ═══ the enquiry: a navy pill at the foot of the screen; the send button is the orange action ═══ */
.rl{position:fixed;left:50%;bottom:max(1rem,env(safe-area-inset-bottom));z-index:36;width:min(27rem,calc(100vw - 2 * var(--gutter,1rem)));transform:translateX(-50%);animation:rl-in .45s var(--ease)}
.rl[hidden]{display:none}
@keyframes rl-in{from{opacity:0;transform:translate(-50%,16px)}}
.rl-card{overflow:hidden;border-radius:var(--r-pill);background:var(--navy);color:var(--theme-on-dark);box-shadow:0 26px 50px -24px color-mix(in srgb,var(--theme-shadow) 75%,transparent),0 0 0 1px color-mix(in srgb,var(--theme-white) 8%,transparent)}
.rl-card:has(.rl-open:not([hidden])){border-radius:20px}
.rl-bar{display:flex;align-items:center;gap:.35rem;padding:.35rem}
.rl-sum{display:flex;flex:1;align-items:center;gap:.6rem;min-width:0;height:2.75rem;padding:0 .75rem 0 .3rem;border:0;border-radius:var(--r-pill);background:transparent;color:inherit;font:inherit;font-size:var(--fs-body);font-weight:500;text-align:left;white-space:nowrap;cursor:pointer;transition:background-color .2s var(--ease)}
.rl-sum:hover{background:color-mix(in srgb,var(--theme-white) 8%,transparent)}
.rl-ico{display:grid;place-items:center;flex:none;width:2.15rem;height:2.15rem;border-radius:50%;background:color-mix(in srgb,var(--theme-white) 12%,transparent);color:var(--theme-on-dark)}
.rl-ico svg{width:1.1rem;height:1.1rem}
.rl-tx{display:flex;flex-direction:column;min-width:0;line-height:1.25}
.rl-tx b{display:flex;align-items:center;gap:.45rem;font-weight:600;white-space:nowrap}
.rl-tx small{display:none}
.rl-n{display:inline-grid;place-items:center;min-width:1.6rem;height:1.6rem;padding:0 .4rem;border-radius:var(--r-pill);background:var(--theme-surface);color:var(--navy);font-weight:700;font-variant-numeric:tabular-nums;transition:transform .3s cubic-bezier(.3,1.6,.5,1)}
.rl-n.is-bump{transform:scale(1.22)}
.rl-sum>svg{flex:none;width:15px;height:15px;margin-left:auto;color:var(--band-mute);transform:rotate(180deg);transition:transform .35s var(--ease)}
.rl-sum[aria-expanded="true"]>svg{transform:none}
.rl-send{position:relative;isolation:isolate;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;gap:.5rem;flex:none;height:2.75rem;padding:0 1.15rem 0 1rem;border-radius:var(--r-pill);background:var(--act);color:var(--on-act);font-size:var(--fs-body);font-weight:600;text-decoration:none;white-space:nowrap;transition:transform .35s var(--ease)}
.rl-send::before{content:"";position:absolute;inset:0;z-index:-1;border-radius:inherit;background:var(--act-h);transform:scaleX(0);transform-origin:left;transition:transform .5s var(--ease)}
.rl-send:hover::before,.rl-send:focus-visible::before{transform:scaleX(1)}
.rl-send:active{transform:scale(.98)}
.rl-send .pg-wa{color:var(--on-act)}
.pg .rl-bar :focus-visible{outline-color:var(--theme-focus-on-dark)}
/* opened: the list as a white card inside the pill */
.rl-open{margin:.4rem .4rem 0;padding:.45rem .55rem .5rem;border-radius:14px;background:var(--theme-surface);color:var(--ink)}
.rl-open[hidden]{display:none}
.rl-lines{display:grid;max-height:min(21rem,46svh);margin:0;padding:0;overflow:auto;overscroll-behavior:contain;list-style:none}
.rl-lines li{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.45rem .8rem;padding:.6rem .2rem .6rem .35rem;border-top:1px solid var(--line);font-size:var(--fs-body);line-height:1.35}
.rl-lines li:first-child{border-top:0}
.rl-name{flex:1 1 11rem;min-width:0;font-weight:600}
.rl-ctl{display:flex;align-items:center;gap:.4rem}
.rl-pack{height:2.2rem;padding:0 2rem 0 .85rem;border:0;border-radius:var(--r-pill);background-color:var(--theme-surface);${CHEV_BG};background-position:calc(100% - 1.05rem) 50%,calc(100% - .75rem) 50%;box-shadow:inset 0 0 0 1px var(--line);font:inherit;font-size:var(--fs-body);color:var(--ink);appearance:none;-webkit-appearance:none;cursor:pointer;transition:box-shadow .2s var(--ease)}
.rl-pack:hover{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 35%,transparent)}
.rl-pack option{color:var(--theme-ink);background:var(--theme-surface)}
.rl-onepack{padding:0 .4rem;color:var(--mute)}
.rl-qty{display:flex;align-items:center;gap:.1rem}
.rl-qty button{display:grid;place-items:center;width:2rem;height:2rem;padding:0;border:0;border-radius:50%;background:var(--theme-surface);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 22%,transparent);color:var(--ink);font:inherit;font-size:var(--fs-body);font-weight:600;line-height:1;cursor:pointer;transition:box-shadow .2s var(--ease),background-color .2s var(--ease)}
.rl-qty button:hover{background:color-mix(in srgb,var(--act) 10%,var(--theme-surface));box-shadow:inset 0 0 0 1.5px var(--act)}
.rl-qty input{width:2.4rem;height:2rem;border:0;background:none;font:inherit;font-size:var(--fs-body);font-weight:600;color:var(--ink);text-align:center;-moz-appearance:textfield;appearance:textfield}
.rl-qty input::-webkit-outer-spin-button,.rl-qty input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
.rl-rm{display:grid;place-items:center;width:2rem;height:2rem;padding:0;border:0;border-radius:50%;background:transparent;color:var(--mute);cursor:pointer;transition:color .2s var(--ease),background-color .2s var(--ease)}
.rl-rm:hover{background:var(--theme-error-bg);color:var(--theme-error)}
.rl-rm svg{width:14px;height:14px}
.rl-foot{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.3rem 1rem;margin-top:.2rem;padding:.6rem .2rem .1rem .35rem;border-top:1px solid var(--line);font-size:var(--fs-body);line-height:1.45;color:var(--mute)}
.rl-foot button{padding:0 0 3px;border:0;${LINE_BG};font:inherit;font-size:var(--fs-body);font-weight:600;color:var(--navy);cursor:pointer;transition:background-size .45s var(--ease),color .3s var(--ease)}
.rl-foot button:hover,.rl-foot button:focus-visible{background-size:100% 1.5px,100% 1px;color:var(--act-t)}
@media (max-width:699px){
  .rl-send span{display:none}
  .rl-send{width:2.75rem;padding:0}
  .rl-send .pg-wa{width:18px;height:18px}
}
@media (prefers-reduced-motion:reduce){
  .pf-row:hover .pf-ico svg.pa,.pf-row:hover .pf-ico img{transform:none}
  .pv-x:hover,.pf-add:active,.rl-send:active{transform:none}
}
`;
