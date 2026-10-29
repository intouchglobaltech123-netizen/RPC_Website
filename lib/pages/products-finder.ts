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
import { BRAND_LOGOS, otherBrands } from "../methods/brand-logos";
import { imageSrc, mediaOf, pdfSrc, videoSrc } from "../products/media";
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


import { getProductFeatures, getKeyBenefits, getApplications, getTypicalProperties } from "../products/popup-data";

const docIco = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>`;
const playIco = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 8.8v6.4l5.2-3.2z" fill="currentColor"/></svg>`;

/** Upgraded product details popup modal */
const VIEWER_HTML = `<dialog class="pv" data-pv data-lenis-prevent aria-labelledby="pv-title">
  <div class="pv-top">
    <button type="button" class="pv-back" data-pv-close>
      <i aria-hidden="true"><svg viewBox="0 0 16 16" width="15" height="15"><path d="M13 8H3M7 4 3 8l4 4" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg></i>
      <span>Back to products</span>
    </button>
    <p class="pv-crumbs" aria-label="Where you are"><span>Products</span><span data-pv-crumb-brand></span><b data-pv-crumb-name></b></p>
  </div>

  <div class="pv-hero">
    <!-- Left Column: Gallery -->
    <div class="pv-gallery">
      <div class="pv-stage-wrap">
        <button type="button" class="pv-nav-arrow pv-nav-prev" data-pv-prev aria-label="Previous view">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button type="button" class="pv-nav-arrow pv-nav-next" data-pv-next aria-label="Next view">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
        <button type="button" class="pv-zoom-btn" data-pv-zoom aria-label="Toggle zoom">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        </button>
        <div class="pv-stage" data-pv-stage>
          <img class="pv-main-img" data-pv-main-img src="" alt="" />
        </div>
      </div>
      <div class="pv-thumbs" role="group" aria-label="Product views">
        <button type="button" class="pv-thumb is-active" data-pv-view="0" aria-label="Front View">
          <span class="pv-thumb-box"><img data-pv-thumb-img="0" src="" alt="" /></span>
          <span class="pv-thumb-label">Front View</span>
        </button>
        <button type="button" class="pv-thumb" data-pv-view="1" aria-label="Back View">
          <span class="pv-thumb-box"><img data-pv-thumb-img="1" src="" alt="" /></span>
          <span class="pv-thumb-label">Back View</span>
        </button>
        <button type="button" class="pv-thumb" data-pv-view="2" aria-label="Left View">
          <span class="pv-thumb-box"><img data-pv-thumb-img="2" src="" alt="" /></span>
          <span class="pv-thumb-label">Left View</span>
        </button>
        <button type="button" class="pv-thumb" data-pv-view="3" aria-label="Right View">
          <span class="pv-thumb-box"><img data-pv-thumb-img="3" src="" alt="" /></span>
          <span class="pv-thumb-label">Right View</span>
        </button>
      </div>
    </div>

    <!-- Right Column: Product Identity & Actions -->
    <div class="pv-info">
      <div class="pv-badges">
        <span class="pv-badge-cat" data-pv-cat>Waterproofing</span>
        <span class="pv-badge-brand" data-pv-brand>RPC BuildTech</span>
      </div>
      <h2 class="pv-title" id="pv-title" data-pv-title></h2>
      <p class="pv-subtitle" data-pv-subtitle></p>
      <p class="pv-summary" data-pv-summary></p>

      <div class="pv-features" data-pv-features></div>

      <div class="pv-purchase-row">
        <div class="pv-packs-block">
          <span class="pv-packs-title">Available Pack Sizes</span>
          <div class="pv-pack-chips" data-pv-pack-chips></div>
        </div>
        <button type="button" class="pv-enquire-btn" data-pv-enquire>
          <span>Enquire Now</span>
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Navigation inside popup: 4 Tabs -->
  <div class="pv-tabs-bar" role="tablist">
    <button type="button" role="tab" class="pv-tab is-active" data-pv-tab="overview" aria-selected="true">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
      <span>Overview</span>
    </button>
    <button type="button" role="tab" class="pv-tab" data-pv-tab="video" aria-selected="false">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/></svg>
      <span>AI Video</span>
    </button>
    <button type="button" role="tab" class="pv-tab" data-pv-tab="tds" aria-selected="false">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
      <span>Technical Data Sheet</span>
    </button>
  </div>

  <!-- Lower Section Panes -->
  <div class="pv-content">
    <!-- Pane 1: Overview -->
    <div class="pv-pane" data-pv-pane="overview" role="tabpanel">
      <div class="pv-overview-grid">
        <div class="pv-col-desc">
          <h3 class="pv-section-title">Product Description</h3>
          <p class="pv-full-desc" data-pv-full-desc></p>
          <h3 class="pv-section-title">Key Benefits</h3>
          <ul class="pv-benefits-list" data-pv-benefits></ul>
        </div>
        <div class="pv-col-apps">
          <h3 class="pv-section-title">Applications</h3>
          <div class="pv-apps-grid" data-pv-apps></div>
        </div>
        <div class="pv-col-props">
          <div class="pv-specs-card">
            <h3 class="pv-specs-title">Typical Properties</h3>
            <table class="pv-specs-table" data-pv-specs></table>
          </div>
        </div>
      </div>
    </div>

    <!-- Pane 3: AI Video -->
    <div class="pv-pane" data-pv-pane="video" role="tabpanel" hidden>
      <div class="pv-video-container" data-pv-video-box>
        <div class="pv-video-player" data-pv-video-player></div>
        <div class="pv-video-empty" data-pv-video-empty hidden>
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/></svg>
          <p><strong>AI Product Video In Production</strong><br>Official application footage and AI-assisted technical walkthrough for this product is currently being mastered.</p>
        </div>
      </div>
    </div>

    <!-- Pane 4: Technical Data Sheet -->
    <div class="pv-pane" data-pv-pane="tds" role="tabpanel" hidden>
      <div class="pv-tds-container" data-pv-tds-box>
        <div class="pv-tds-topbar">
          <div class="pv-tds-doc-meta">
            <span class="pv-tds-tag">OFFICIAL TECHNICAL DATA SHEET (PDF)</span>
            <h4 class="pv-tds-name" data-pv-tds-name>Document</h4>
          </div>
          <div class="pv-tds-actions">
            <a class="pv-tds-action-btn pv-tds-open-btn" data-pv-tds-open href="" target="_blank" rel="noopener noreferrer">
              <span>Open TDS</span>
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13L13 3M6 3h7v7"/></svg>
            </a>
            <a class="pv-tds-action-btn pv-tds-dl-btn" data-pv-tds-download href="" download>
              <span>Download TDS</span>
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v9M4 8l4 4 4-4M2 14h12"/></svg>
            </a>
          </div>
        </div>
        <div class="pv-tds-embed-wrap">
          <iframe class="pv-tds-frame" data-pv-tds-frame src="" title="Technical Data Sheet"></iframe>
        </div>
      </div>
      <div class="pv-tds-empty" data-pv-tds-empty hidden>
        <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
        <p><strong>Technical Data Sheet not available</strong><br>An official TDS for this item has not been published yet. Please contact RPC Technical Advisory for customized technical specifications.</p>
      </div>
    </div>
  </div>
</dialog>`;

/** the larger picture a card's picture opens */
const ZOOM_HTML = `<dialog class="pz" data-pz aria-labelledby="pz-name">
  <button type="button" class="pz-x" data-pz-close aria-label="Close"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></button>
  <div class="pz-pic" data-pz-pic></div>
  <p class="pz-cap"><span class="pz-name" id="pz-name" data-pz-name></span><span class="pz-sub" data-pz-sub></span></p>
</dialog>`;

/** one product: a row that opens */
function row(p: Product, c: ContactInfo, js: readonly JobView[]) {
  const f = familyOf(p.family);
  const cat = p.category === "Construction chemical" ? "Ask us what this one is best used for" : p.category;
  const m = mediaOf(p.slug);
  const img = imageSrc(m);
  const pdf = pdfSrc(m);
  const media = `<div class="pf-media" data-view="${p.slug}" data-view-desc="${esc(m.description ?? p.purpose)}"${img ? ` data-view-img="${esc(img)}"` : ""}${videoSrc(m) ? ` data-view-video="${esc(videoSrc(m))}"` : ""}${pdf ? ` data-view-pdf="${esc(pdf)}"` : ""}>
          <button type="button" class="pf-vlink" data-view-go="desc">${docIco}<span>Description</span></button>
          <button type="button" class="pf-vlink" data-view-go="video">${playIco}<span>Video</span></button>
        </div>`;
  return `<li class="pf-row" id="${p.slug}" data-family="${p.family}" data-q="${esc(searchText(p))}" style="--tint:${f.tint}">
  <details class="pf-d">
    <summary class="pf-sum">
      <span class="pf-fam">${esc(f.label)}</span>
      <span class="pf-ico${img ? " pf-ico--photo" : ""}">${img ? `<img src="${esc(img)}" alt="" loading="lazy" decoding="async">` : packArt(p.slug, p.packs[0]?.shape ?? "bag", f.tint, p.packs[0]?.size ?? "")}</span>
      <span class="pf-tx"><span class="pf-name">${esc(shortName(p))}</span><span class="pf-cat">${esc(cat)}</span><span class="pf-use">${esc(p.purpose)}</span></span>
      <span class="pf-packs">${p.packs.map((k) => `<span>${esc(k.size)}</span>`).join("")}</span>
      <span class="pf-chev">${chev}</span>
    </summary>
    <div class="pf-open">
      ${media}
    </div>
  </details>
  <button type="button" class="pf-view-btn" data-view-go="overview" data-slug="${p.slug}" aria-label="View details for ${esc(fullName(p))}"><span>View Details</span><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg></button>
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
    <p class="pf-fh" id="pf-ff">Product category<span class="pf-picked" data-picked="fam"></span></p>
    <div class="pf-cs">
    <button type="button" class="pf-chip pf-chip--all" data-chip-fam="all" aria-pressed="true">All categories<span>${total}</span></button>
    ${fams.map((f) => `<button type="button" class="pf-chip" data-chip-fam="${f.key}" data-label="${esc(f.label)}" aria-pressed="false">${tick}${esc(f.label)}<span data-chip-n>${count(f.key)}</span></button>`).join("")}
    </div>
  </div>
  <div class="pf-chiprow pf-chiprow--brands" role="group" aria-labelledby="pf-fb">
    <p class="pf-fh" id="pf-fb">Brand<span class="pf-picked" data-picked="brand"></span></p>
    <div class="pf-cs">
    <button type="button" class="pf-chip pf-chip--all" data-chip-brand="all" aria-pressed="true">All brands<span>${total}</span></button>
    ${bs.map((b) => `<button type="button" class="pf-chip pf-bt" data-chip-brand="${b.key}" aria-pressed="false" style="--c:${brandMark(b.name)}">${tick}<em class="pf-blogo">${brandFace(b.name)}</em><small class="pf-bn">${esc(b.name)}</small><span>${b.count}</span></button>`).join("")}
    ${otherBrands(bs.map((b) => b.name)).map((name) => `<span class="pf-chip pf-bt pf-bt--none" role="note" aria-label="${esc(name)}: no products on our list yet" title="No products on our list yet"><em class="pf-blogo">${brandFace(name)}</em><small class="pf-bn">${esc(name)}</small><span>0</span></span>`).join("")}
    </div>
  </div>
</div>`;
}

export function finderMarkup(bs: readonly BrandInfo[], c: ContactInfo, js: readonly JobView[], total: number) {
  const lists = bs
    .map(
      (b) => `<section class="pf-brand" id="brand-${b.key}" data-brand="${b.key}" aria-labelledby="pf-h-${b.key}">
  <h3 class="pf-bh${BRAND_LOGOS[b.name] ? " pf-bh--logo" : ""}" id="pf-h-${b.key}" style="--c:${brandMark(b.name)}">${BRAND_LOGOS[b.name] ? `<em class="pf-bhl"><img src="/images/brands/${esc(BRAND_LOGOS[b.name]!)}" alt="" loading="lazy" decoding="async"></em>` : `<i aria-hidden="true"></i>`}<b class="pf-bhn">${esc(b.name)}</b><span data-bcount>${b.count} ${b.count === 1 ? "product" : "products"}</span></h3>
  <p class="pf-thead" aria-hidden="true"><span>Product</span><span>What it does</span><span>Packs</span></p>
  <ul class="pf-rows">${b.products.map((p) => row(p, c, js)).join("")}</ul>
  <button type="button" class="pf-more" data-more hidden>Show all ${b.count} ${esc(b.name)} products</button>
</section>`,
    )
    .join("");
  return `<section class="pg-sec pf-sec" id="find" aria-labelledby="pf-title">
  <div class="pg-wrap">
    <h2 class="sr-only" id="pf-title">All ${total} products, by brand</h2>
    <div class="pf">
      <div class="pf-side" data-lenis-prevent>${filters(bs, total)}</div>
      <div class="pf-main">
        <label class="pf-search">${search}<span class="sr-only">Search products</span><input type="search" data-search placeholder="Search ${total} products" autocomplete="off" enterkeyhint="search"><button type="button" class="pf-x" data-clear-q aria-label="Clear the search" hidden><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button></label>
        <div class="pf-state"><p class="pf-status" data-status aria-live="polite">Showing all ${total} products.</p><button type="button" class="pf-clear" data-clear hidden>Show every product</button></div>
        <div class="pf-lists" data-view="grid">${lists}</div>
        <script type="application/json" id="rpc-products-catalog">${JSON.stringify(bs.flatMap((b) => b.products).map((p) => {
          const m = mediaOf(p.slug);
          return {
            slug: p.slug,
            name: shortName(p),
            fullName: fullName(p),
            brand: p.brand,
            family: p.family,
            category: p.category,
            purpose: p.purpose,
            areas: p.areas,
            customers: p.customers,
            packs: p.packs,
            image: imageSrc(m),
            video: videoSrc(m),
            pdf: pdfSrc(m),
            pdfName: m.pdf ?? "",
            description: m.description ?? p.purpose,
            features: getProductFeatures(p),
            benefits: getKeyBenefits(p),
            applications: getApplications(p),
            properties: getTypicalProperties(p),
          };
        })).replace(/</g, "\\u003c")}</script>
        ${VIEWER_HTML}
        ${ZOOM_HTML}
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
/* the filters stay in view and scroll on their own, apart from the products */
/* the filters stay beside the products and scroll on their own under the cursor; scrolling the products moves them along too (products-page.ts) */
.pf-side{position:sticky;top:calc(var(--nav-bar,64px) + 1.2rem);max-height:calc(100svh - var(--nav-bar,64px) - 2.4rem);overflow-y:auto;overscroll-behavior:contain;scrollbar-width:none}
.pf-side::-webkit-scrollbar{display:none}
.pf-chips{display:flex;flex-direction:column;gap:1.8rem}
.pf-chiprow{display:flex;flex-direction:column}
.pf-cs{display:contents}
.pf-fh{margin:0 0 .3rem;padding-bottom:.55rem;border-bottom:1px solid rgba(18,34,59,.32);font-size:var(--fs-body);font-weight:600;color:var(--mute)}
.pf-chip{display:flex;align-items:center;gap:.6rem;width:100%;padding:.5rem .55rem;border:0;border-radius:4px;background:none;font:inherit;font-size:var(--fs-body);line-height:1.3;color:var(--ink);text-align:left;cursor:pointer;transition:background-color .15s,color .15s}
.pf-chip i{flex:none;width:.5rem;height:.5rem;border-radius:1px;background:var(--c)}
.pf-chip span{margin-left:auto;padding-left:.6rem;color:var(--mute);font-variant-numeric:tabular-nums}
.pf-chip:hover{background:rgba(18,34,59,.06)}
.pf-chip[aria-pressed="true"]{background:var(--navy);color:#fff}
.pf-chip[aria-pressed="true"] span{color:rgba(255,255,255,.7)}
.pf-chip[data-empty]{opacity:.4}
.pf-chip:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
/* more than one can be picked: a tick box on each, "every kind" / "all brands" to let them go */
.pf-fh{display:flex;align-items:baseline;justify-content:space-between;gap:.6rem}
.pf-ck{display:grid;place-items:center;flex:none;width:1.1rem;height:1.1rem;border-radius:4px;box-shadow:inset 0 0 0 1.5px rgba(18,34,59,.35);color:transparent;transition:background-color .2s,color .2s}
.pf-ck svg{width:.8rem;height:.8rem}
.pf-chip:not(.pf-chip--all)[aria-pressed="true"]{background:rgba(11,35,80,.13);font-weight:600;color:var(--ink)}
.pf-picked{font-size:var(--fs-body);font-weight:600;color:var(--accent)}
.pf-picked:empty{display:none}
.pf-chip:not(.pf-chip--all)[aria-pressed="true"] span{color:var(--ink2)}
.pf-chip[aria-pressed="true"] .pf-ck{background:var(--navy);box-shadow:none;color:#fff}
/* brands as logo tiles, two to a row: the logo (or the name in the brand's colour), the count in the corner, a tick when picked */
.pf-chiprow--brands{display:grid;grid-template-columns:1fr 1fr;gap:.45rem}
.pf-chiprow--brands .pf-fh,.pf-chiprow--brands .pf-chip--all{grid-column:1 / -1}
.pf-chiprow--brands .pf-fh{margin-bottom:.1rem}
.pf-bt{position:relative;justify-content:center;height:5rem;padding:1.3rem .7rem .55rem;border-radius:10px;background:#fff;box-shadow:inset 0 0 0 1px var(--line);transition:box-shadow .2s}
.pf-bt:hover{background:#fff;box-shadow:inset 0 0 0 1.5px rgba(18,34,59,.4)}
.pf-chip.pf-bt[aria-pressed="true"]{background:#fff;box-shadow:inset 0 0 0 2px var(--navy)}
.pf-bt .pf-ck{position:absolute;left:.45rem;top:.45rem;width:1rem;height:1rem}
.pf-bt > span{position:absolute;right:.5rem;top:.35rem;margin:0;padding:0;color:var(--mute)}
.pf-blogo{display:grid;place-items:center;width:100%;height:100%;font-style:normal}
.pf-blogo img{display:block;max-width:100%;max-height:2.7rem;width:auto;height:auto;object-fit:contain}
.pf-blogo strong{font-family:var(--display);font-weight:700;letter-spacing:-.01em;color:var(--c,var(--ink))}
.pf-chip.pf-bt[data-empty]{opacity:.45}
/* a brand from the brand slide with no products on the list yet: shown, not picked */
.pf-bt--none{cursor:default}
.pf-bt--none .pf-blogo{opacity:.55;filter:grayscale(1)}
.pf-bt--none:hover{box-shadow:inset 0 0 0 1px var(--line)}
/* each brand's list opens with its logo */
.pf-bhn{font-weight:600}
.pf-bhl{display:inline-grid;place-items:center;height:2.6rem;padding:.35rem .7rem;border-radius:8px;background:#fff;box-shadow:inset 0 0 0 1px var(--line);font-style:normal}
.pf-bhl img{display:block;height:1.9rem;max-width:9rem;width:auto;object-fit:contain}

/* the list */
.pf-main{min-width:0;container-type:inline-size}
.pf-search{display:flex;align-items:center;gap:.7rem;height:3.5rem;padding:0 1.1rem;border-radius:8px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line),0 20px 40px -36px rgba(18,34,59,.6)}
.pf-search:focus-within{outline:2px solid var(--accent);outline-offset:2px}
.pf-search svg{flex:none;width:1.3rem;height:1.3rem;color:var(--mute)}
.pf-search input{flex:1;min-width:0;border:0;background:none;font:inherit;font-size:var(--fs-body);color:var(--ink);outline:none}
.pf-search input::placeholder{color:var(--mute);opacity:1}
.pg .pf-search input:focus-visible{outline:none}
.pf-search input::-webkit-search-cancel-button{-webkit-appearance:none;appearance:none}
.pf-x{display:grid;place-items:center;flex:none;width:2.2rem;height:2.2rem;margin-right:-.5rem;border:0;border-radius:8px;background:none;color:var(--mute);cursor:pointer}
.pf-x[hidden]{display:none}
.pf-x:hover{background:rgba(18,34,59,.06);color:var(--ink)}
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
@keyframes pf-hit{0%,45%{background:rgba(39,86,160,.1)}100%{background:transparent}}
.pf-sum{position:relative;display:grid;grid-template-columns:2.6rem minmax(0,1fr) auto;align-items:center;gap:.35rem 1rem;padding:.8rem 8.8rem .8rem .9rem;list-style:none;cursor:pointer;transition:background-color .2s}
.pf-sum::-webkit-details-marker{display:none}
.pf-sum::marker{content:""}
.pf-sum:hover{background:rgba(18,34,59,.03)}
.pf-sum:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}
.pf-ico{display:flex;align-items:center;justify-content:center;width:2.6rem;height:2.6rem;border-radius:4px;background:rgba(18,34,59,.05);color:var(--mute);cursor:default}
.pf-ico svg{width:1.45rem;height:1.45rem}
.pf-tx{display:flex;flex-direction:column;min-width:0}
.pf-name{font-size:var(--fs-body);font-weight:600;line-height:1.35}
.pf-cat{font-size:var(--fs-body);line-height:1.4;color:var(--mute)}
.pf-packs{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:.3rem}
.pf-packs span{display:inline-flex;align-items:center;height:1.85rem;padding:0 .6rem;border-radius:7px;background:var(--sand);font-size:var(--fs-body);font-weight:500;white-space:nowrap}
.pf-chev{position:absolute;top:1.35rem;right:1rem;display:grid;place-items:center;width:1.5rem;height:1.5rem;color:var(--mute);transition:transform .25s}
.pf-chev svg{width:15px;height:15px}
.pf-d[open] .pf-chev{transform:rotate(180deg)}
.pf-d[open] .pf-sum{background:rgba(39,86,160,.05)}
.pf-add{position:absolute;top:1.05rem;right:3.1rem;display:inline-flex;align-items:center;gap:.3rem;height:2.1rem;padding:0 .8rem 0 .6rem;border:0;border-radius:6px;background:var(--card);box-shadow:inset 0 0 0 1px rgba(18,34,59,.22);font:inherit;font-size:var(--fs-body);font-weight:600;line-height:1;color:var(--ink);cursor:pointer;transition:background-color .2s,color .2s,box-shadow .2s}
.pf-add[hidden]{display:none}
.pf-add svg{width:14px;height:14px}
.pf-add .pf-tick,.pf-add.is-on .pf-plus{display:none}
.pf-add.is-on .pf-tick{display:block}
.pf-add:hover{box-shadow:inset 0 0 0 1.5px var(--navy)}
.pf-add.is-on{background:var(--navy);box-shadow:none;color:#f5f0e6}
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
.pf-rate{background:rgba(37,211,102,.12);box-shadow:inset 0 0 0 1px rgba(18,140,75,.32);color:#128c4b}
.pf-rate:hover{background:#25d366;box-shadow:none;color:#fff}
.pf-rate .pg-ar{width:1.05rem;height:1.05rem}
.pf-alt{box-shadow:inset 0 0 0 1px rgba(18,34,59,.22);color:var(--ink)}
.pf-alt:hover{box-shadow:inset 0 0 0 1.5px var(--navy)}
.pf-rate:focus-visible,.pf-alt:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.pf-more{display:flex;align-items:center;justify-content:center;width:100%;height:3rem;margin-top:.6rem;border:0;border-radius:6px;background:transparent;box-shadow:inset 0 0 0 1.5px rgba(18,34,59,.2);font:inherit;font-size:var(--fs-body);font-weight:600;color:var(--ink);cursor:pointer;transition:box-shadow .2s,background-color .2s}
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
.pf-row:hover{box-shadow:inset 0 0 0 1px rgba(18,34,59,.32),0 16px 32px -26px rgba(18,34,59,.5)}
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
.pf-row{--h:11.2rem;overflow:hidden;border-radius:14px;background:#fbf8f2}
.pf-row::before{content:"";position:absolute;inset:0 0 auto;height:5px;background:var(--tint)}
.pf-sum{grid-template-columns:minmax(0,1fr) 3.2rem;grid-template-rows:auto auto minmax(0,1fr);grid-template-areas:"fam fam" "tx ico" "packs packs";gap:.45rem .9rem;padding:1.05rem 1rem .9rem}
.pf-fam{grid-area:fam;display:flex;align-items:center;gap:.45rem;min-width:0;padding-right:1.8rem;font-size:var(--fs-body);font-weight:500;color:var(--tint);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pf-tx{padding-right:0}
.pf-name{font-family:var(--sans);font-size:var(--fs-body);font-weight:700;line-height:1.35;letter-spacing:0;color:var(--ink)}
.pf-cat{margin-top:.15rem;line-height:1.45}
.pf-ico{width:3.2rem;height:3.2rem;border-radius:50%;background:color-mix(in srgb,var(--tint) 12%,transparent);color:var(--tint)}
.pf-ico svg{width:1.7rem;height:1.7rem}
.pf-packs{margin:0 -1rem;padding:.7rem 6.6rem 0 1rem;border-top:1px solid var(--line)}
.pf-packs span{background:color-mix(in srgb,var(--tint) 9%,#fff);color:var(--ink)}
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
.rl-card{overflow:hidden;border-radius:8px;background:var(--navy);color:#f5f0e6;box-shadow:0 26px 50px -24px rgba(4,12,30,.75),0 0 0 1px rgba(255,255,255,.06)}
.rl-bar{display:flex;align-items:center;gap:.45rem;padding:.45rem}
.rl-sum{display:flex;flex:1;align-items:center;gap:.6rem;min-width:0;height:2.8rem;padding:0 .7rem 0 .45rem;border:0;border-radius:6px;background:transparent;color:inherit;font:inherit;font-size:var(--fs-body);font-weight:500;text-align:left;white-space:nowrap;cursor:pointer;transition:background-color .2s}
.rl-sum:hover{background:rgba(255,255,255,.07)}
.rl-sum svg{width:15px;height:15px;margin-left:auto;opacity:.7;transform:rotate(180deg);transition:transform .3s}
.rl-sum[aria-expanded="true"] svg{transform:none}
.rl-n{display:grid;place-items:center;flex:none;min-width:1.85rem;height:1.85rem;padding:0 .45rem;border-radius:6px;background:#f5f0e6;color:var(--navy);font-weight:700;font-variant-numeric:tabular-nums;transition:transform .3s cubic-bezier(.3,1.6,.5,1)}
.rl-n.is-bump{transform:scale(1.22)}
.rl-send{display:inline-flex;align-items:center;gap:.45rem;flex:none;height:2.8rem;padding:0 1.1rem;border-radius:6px;background:#25d366;color:#06301a;font-size:var(--fs-body);font-weight:600;text-decoration:none;white-space:nowrap;transition:background-color .2s}
.rl-send:hover{background:#1fbd5a}
.rl-send .pg-ar{width:1.1rem;height:1.1rem}
.rl-card button:focus-visible,.rl-card select:focus-visible,.rl-card input:focus-visible,.rl-send:focus-visible{outline:2px solid #fff;outline-offset:2px}
.rl-open{padding:.5rem .5rem 0}
.rl-open[hidden]{display:none}
.rl-lines{display:grid;gap:3px;max-height:min(21rem,46svh);margin:0;padding:0;overflow:auto;overscroll-behavior:contain;list-style:none}
.rl-lines li{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.4rem .8rem;padding:.45rem .45rem .45rem .85rem;border-radius:6px;background:rgba(255,255,255,.06);font-size:var(--fs-body);line-height:1.35}
.rl-name{flex:1 1 12rem;min-width:0}
.rl-ctl{display:flex;align-items:center;gap:.35rem}
.rl-pack{height:2.2rem;padding:0 1.9rem 0 .65rem;border:0;border-radius:8px;background:rgba(255,255,255,.1) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 6l4 4 4-4' fill='none' stroke='%23f5f0e6' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right .55rem center/12px;font:inherit;font-size:var(--fs-body);color:#f5f0e6;appearance:none;cursor:pointer}
.rl-pack option{color:#121314;background:#fff}
.rl-onepack{padding:0 .4rem;color:rgba(245,240,230,.75)}
.rl-qty{display:flex;align-items:center;height:2.2rem;border-radius:8px;background:rgba(255,255,255,.1)}
.rl-qty button{display:grid;place-items:center;width:2.1rem;height:2.2rem;border:0;background:none;color:inherit;font:inherit;font-size:var(--fs-body);line-height:1;cursor:pointer;border-radius:8px}
.rl-qty button:hover{background:rgba(255,255,255,.1)}
.rl-qty input{width:2.6rem;height:2.2rem;border:0;background:none;font:inherit;font-size:var(--fs-body);font-weight:600;color:#f5f0e6;text-align:center;-moz-appearance:textfield}
.rl-qty input::-webkit-outer-spin-button,.rl-qty input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
.rl-rm{display:grid;place-items:center;width:2.2rem;height:2.2rem;border:0;border-radius:8px;background:transparent;color:inherit;cursor:pointer;opacity:.7;transition:background-color .2s,opacity .2s}
.rl-rm:hover{background:rgba(255,255,255,.1);opacity:1}
.rl-rm svg{width:14px;height:14px}
.rl-foot{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.3rem 1rem;padding:.65rem .35rem .2rem .45rem;font-size:var(--fs-body);color:rgba(245,240,230,.7)}
.rl-foot button{height:2.2rem;padding:0 .4rem;border:0;background:none;font:inherit;font-size:var(--fs-body);font-weight:600;color:#fff;text-decoration:underline;text-underline-offset:3px;cursor:pointer}
/* the enquiry, as a light card: the list icon and count, packs and quantities when opened, and the WhatsApp button */
.rl-card{border-radius:18px;background:var(--card);color:var(--ink);box-shadow:0 30px 60px -26px rgba(4,12,30,.6),0 0 0 1px rgba(18,34,59,.12)}
.rl-bar{gap:.5rem;padding:.55rem}
.rl-sum{height:3.4rem;gap:.75rem;padding:0 .8rem 0 .4rem;border-radius:12px}
.rl-sum:hover{background:rgba(18,34,59,.05)}
.rl-ico{display:grid;place-items:center;flex:none;width:2.6rem;height:2.6rem;border-radius:12px;background:var(--navy);color:#f5f0e6}
.rl-ico svg{width:1.35rem;height:1.35rem}
.rl-tx{display:flex;flex-direction:column;min-width:0;line-height:1.25}
.rl-tx b{display:flex;align-items:center;gap:.35rem;font-weight:600}
.rl-tx small{font-size:var(--fs-body);color:var(--mute)}
.rl-n{min-width:0;height:auto;padding:0;border-radius:0;background:none;color:var(--accent);font-weight:700}
.rl-sum svg:last-child{color:var(--mute)}
.rl-send{height:3.4rem;padding:0 1.3rem;border-radius:12px;color:#fff;box-shadow:0 10px 20px -12px rgba(18,140,75,.8)}
.rl-send:hover{background:#1fbd5a}
.rl-card button:focus-visible,.rl-card select:focus-visible,.rl-card input:focus-visible,.rl-send:focus-visible{outline:2px solid var(--accent)}
.rl-open{padding:.7rem .7rem 0;border-bottom:1px solid var(--line)}
.rl-lines{gap:.35rem}
.rl-lines li{padding:.55rem .55rem .55rem .9rem;border-radius:12px;background:#fbf8f2;box-shadow:inset 0 0 0 1px var(--line)}
.rl-name{font-weight:600}
.rl-pack{background:rgba(18,34,59,.07) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 6l4 4 4-4' fill='none' stroke='%2312223b' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right .55rem center/12px;color:var(--ink)}
.rl-onepack{color:var(--mute)}
.rl-qty{background:rgba(18,34,59,.07)}
.rl-qty button:hover{background:rgba(18,34,59,.1)}
.rl-qty input{color:var(--ink)}
.rl-rm:hover{background:rgba(18,34,59,.08)}
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
  .pf-side{position:static;max-height:none;overflow:visible;padding-right:0;margin-right:0}
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
.pf-ico{align-self:start;width:6.6rem;height:6.6rem;border-radius:12px;background:radial-gradient(circle at 50% 38%,#fff 0,color-mix(in srgb,var(--tint) 9%,#fff) 70%);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--tint) 14%,transparent)}
.pf-ico svg.pa{width:100%;height:100%;transition:transform .35s cubic-bezier(.2,.8,.2,1)}
.pf-row:hover .pf-ico svg.pa{transform:translateY(-2px) scale(1.04)}
.pf-ico--photo{background:#fff;box-shadow:inset 0 0 0 1px var(--line)}
.pf-ico img{display:block;width:100%;height:100%;max-width:100%;max-height:100%;padding:.3rem;box-sizing:border-box;object-fit:contain}
/* in an opened card: the description and the video, as two links */
.pf-media{display:flex;gap:.5rem;padding:.3rem 0 0}
.pf-media .pf-vlink{flex:1 1 0;justify-content:center;min-width:0}
.pf-vlink{display:inline-flex;align-items:center;gap:.5rem;height:2.4rem;padding:0 .95rem 0 .75rem;border:0;border-radius:6px;background:color-mix(in srgb,var(--tint) 10%,#fff);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--tint) 30%,transparent);font:inherit;font-size:var(--fs-body);font-weight:600;color:var(--ink);cursor:pointer;transition:background-color .2s,box-shadow .2s}
.pf-vlink svg{width:1.15rem;height:1.15rem;color:var(--tint)}
.pf-vlink:hover{box-shadow:inset 0 0 0 1.5px var(--tint)}
.pf-vlink:focus-visible{outline:2px solid var(--accent);outline-offset:2px}

/* the upgraded product details popup */
html.pv-open,body.pv-open{overflow:hidden !important}
.pv{--pv-side:max(1.8rem,calc((100% - 76rem) / 2));position:fixed;inset:0;margin:0;width:100%;max-width:none;height:100%;max-height:none;padding:0;border:0;border-radius:0;background:#fff;color:var(--ink);box-shadow:none;overflow-y:auto;overflow-x:hidden;box-sizing:border-box;scroll-behavior:smooth;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
.pv::-webkit-scrollbar{width:8px}
.pv::-webkit-scrollbar-track{background:#f8fafc;border-radius:8px}
.pv::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:8px}
.pv::-webkit-scrollbar-thumb:hover{background:#94a3b8}
.pv[open]{display:block;animation:pv-in .25s cubic-bezier(.2,.8,.2,1)}
.pv::backdrop{background:rgba(9,20,38,.62);backdrop-filter:blur(3px)}
@keyframes pv-in{from{opacity:0;transform:translateY(10px)}}

/* hero section */
.pv-hero{display:grid;grid-template-columns:46% minmax(0,54%);gap:1.8rem;padding:clamp(1.6rem,5vh,3rem) var(--pv-side) 1.6rem;align-items:start;background:#fff;clear:both}
.pv-gallery{display:flex;flex-direction:column;gap:.75rem}
.pv-stage-wrap{position:relative;width:100%;height:clamp(320px,46svh,520px);border-radius:14px;border:1px solid #e2e8f0;background:#fff;display:flex;align-items:center;justify-content:center;overflow:hidden}
.pv-stage{width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:1rem;box-sizing:border-box}
.pv-main-img{max-width:92%;max-height:92%;object-fit:contain;transition:transform .3s cubic-bezier(.2,.8,.2,1)}
.pv-nav-arrow{position:absolute;top:50%;transform:translateY(-50%);z-index:5;display:grid;place-items:center;width:2.3rem;height:2.3rem;padding:0;border-radius:50%;background:#fff;border:1px solid #e2e8f0;box-shadow:0 4px 12px rgba(14,34,61,.12);color:#334155;cursor:pointer;transition:all .15s}
.pv-nav-arrow:hover{background:#f8fafc;color:#0e223d;box-shadow:0 6px 16px rgba(14,34,61,.18)}
.pv-nav-arrow:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.pv-nav-prev{left:.75rem}
.pv-nav-next{right:.75rem}
.pv-zoom-btn{position:absolute;bottom:.75rem;right:.75rem;z-index:5;display:grid;place-items:center;width:2.2rem;height:2.2rem;padding:0;border-radius:8px;background:rgba(255,255,255,.92);border:1px solid #e2e8f0;box-shadow:0 2px 8px rgba(14,34,61,.08);color:#475569;cursor:pointer;transition:all .15s}
.pv-zoom-btn:hover{color:#0e223d;background:#fff}
.pv-zoom-btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}

.pv-thumbs{display:grid;grid-template-columns:repeat(4,1fr);gap:.6rem}
.pv-thumb{display:flex;flex-direction:column;align-items:center;gap:.35rem;border:0;background:none;padding:0;cursor:pointer}
.pv-thumb-box{width:100%;height:68px;border-radius:8px;border:1.5px solid #e2e8f0;background:#fff;display:flex;align-items:center;justify-content:center;padding:4px;box-sizing:border-box;transition:border-color .2s,box-shadow .2s}
.pv-thumb-box img{max-width:100%;max-height:100%;object-fit:contain}
.pv-thumb-label{font-size:.72rem;font-weight:600;color:#64748b;transition:color .2s}
.pv-thumb.is-active .pv-thumb-box{border-color:#2756a0;box-shadow:0 0 0 1px #2756a0}
.pv-thumb.is-active .pv-thumb-label{color:#2756a0;font-weight:700}
.pv-thumb:hover .pv-thumb-box{border-color:#94a3b8}

/* right column */
.pv-info{display:flex;flex-direction:column;min-width:0;padding-right:2rem}
.pv-badges{display:flex;align-items:center;gap:.5rem;margin-bottom:.45rem}
.pv-badge-cat{display:inline-flex;align-items:center;padding:.22rem .65rem;border-radius:6px;background:#dbeafe;color:#1e40af;font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em}
.pv-badge-brand{display:inline-flex;align-items:center;padding:.22rem .65rem;border-radius:6px;background:#f1f5f9;color:#475569;font-size:.75rem;font-weight:600}
.pv-title{margin:0;font-size:1.75rem;font-weight:800;color:#0e223d;line-height:1.25;letter-spacing:-.01em}
.pv-subtitle{margin:.2rem 0 .55rem;font-size:.95rem;font-weight:500;color:#64748b;line-height:1.4}
.pv-summary{margin:0 0 .9rem;font-size:.88rem;color:#334155;line-height:1.5;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}

.pv-features{display:grid;grid-template-columns:repeat(4,1fr);gap:.45rem;margin-bottom:1.1rem}
.pv-feat{display:flex;flex-direction:column;align-items:center;text-align:center;gap:.3rem;padding:.55rem .3rem;border-radius:8px;background:#f8fafc;border:1px solid #e2e8f0}
.pv-feat-ico{display:flex;align-items:center;justify-content:center}
.pv-feat-ico svg{width:22px;height:22px;color:#2756a0}
.pv-feat-title{font-size:.72rem;font-weight:600;color:#334155;line-height:1.25}

.pv-purchase-row{display:flex;align-items:flex-end;justify-content:space-between;gap:.8rem;margin-top:auto}
.pv-packs-block{display:flex;flex-direction:column;gap:.35rem}
.pv-packs-title{font-size:.82rem;font-weight:700;color:#0e223d}
.pv-pack-chips{display:flex;gap:.4rem;flex-wrap:wrap}
.pv-pack-chip{height:2.1rem;padding:0 .75rem;border-radius:6px;border:1.5px solid #cbd5e1;background:#fff;color:#334155;font-size:.82rem;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;transition:all .15s}
.pv-pack-chip.is-active{background:#0e223d;color:#fff;border-color:#0e223d}
.pv-pack-chip:hover:not(.is-active){border-color:#94a3b8;background:#f8fafc}
.pv-enquire-btn{display:inline-flex;align-items:center;gap:.5rem;height:2.55rem;padding:0 1.35rem;border-radius:8px;background:var(--color-rpc,#2756a0);color:#fff;border:0;font:inherit;font-size:.88rem;font-weight:600;cursor:pointer;transition:all .15s;white-space:nowrap;box-shadow:0 2px 6px rgba(39,86,160,.22)}
.pv-enquire-btn:hover{background:#1e40af;transform:translateY(-1px);box-shadow:0 4px 14px rgba(39,86,160,.35)}
.pv-enquire-btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}

/* tabs bar sticky on scroll */
.pv-tabs-bar{position:sticky;top:0;z-index:20;display:flex;gap:2rem;padding:0 var(--pv-side);border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;background:rgba(255,255,255,.98);backdrop-filter:blur(8px)}
.pv-tab{position:relative;display:inline-flex;align-items:center;gap:.5rem;height:3.2rem;border:0;background:none;font:inherit;font-size:.92rem;font-weight:600;color:#64748b;cursor:pointer;transition:color .15s}
.pv-tab svg{width:18px;height:18px;flex:none}
.pv-tab.is-active{color:#2756a0}
.pv-tab.is-active::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2.5px;border-radius:2px;background:#2756a0}
.pv-tab:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}

/* content area */
.pv-content{padding:1.6rem var(--pv-side) 3rem;overflow:visible;box-sizing:border-box}
.pv-pane[hidden]{display:none}

/* overview pane */
.pv-overview-grid{display:grid;grid-template-columns:1.25fr 1.15fr 1fr;gap:1.8rem;align-items:start}
.pv-section-title{font-size:1.02rem;font-weight:700;color:#0e223d;margin:0 0 .6rem}
.pv-full-desc{font-size:.85rem;color:#475569;line-height:1.6;margin:0 0 1.1rem}
.pv-benefits-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:.5rem}
.pv-benefit-item{display:flex;align-items:flex-start;gap:.5rem;font-size:.82rem;color:#334155;line-height:1.4}
.pv-benefit-check{flex:none;width:17px;height:17px;border-radius:4px;background:#2756a0;color:#fff;display:flex;align-items:center;justify-content:center;margin-top:1px}
.pv-benefit-check svg{width:11px;height:11px}

.pv-apps-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:.65rem}
.pv-app-card{display:flex;flex-direction:column;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;background:#f8fafc}
.pv-app-img{width:100%;height:82px;object-fit:cover;display:block}
.pv-app-label{padding:.4rem .5rem;font-size:.78rem;font-weight:600;color:#334155;text-align:center}

.pv-specs-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:1.1rem}
.pv-specs-title{font-size:.95rem;font-weight:700;color:#0e223d;margin:0 0 .65rem}
.pv-specs-table{width:100%;border-collapse:collapse;font-size:.82rem}
.pv-specs-table tr{border-top:1px solid #e2e8f0}
.pv-specs-table tr:first-child{border-top:0}
.pv-specs-table th{text-align:left;padding:.45rem .4rem .45rem 0;color:#64748b;font-weight:500}
.pv-specs-table td{text-align:left;padding:.45rem 0 .45rem .4rem;color:#0e223d;font-weight:600}

/* 4-side images pane */
.pv-gallery-view-wrap{display:flex;flex-direction:column;align-items:center;gap:1.2rem;padding:1rem 0}
.pv-gallery-stage{width:100%;max-width:520px;height:340px;border-radius:14px;border:1px solid #e2e8f0;background:#fff;display:flex;align-items:center;justify-content:center;padding:1.5rem;box-sizing:border-box}
.pv-gallery-main-img{max-width:100%;max-height:100%;object-fit:contain;transition:transform .4s ease}
.pv-gallery-angles-bar{display:flex;gap:.6rem;flex-wrap:wrap;justify-content:center}
.pv-angle-btn{height:2.3rem;padding:0 1rem;border-radius:8px;border:1.5px solid #cbd5e1;background:#fff;color:#334155;font-size:.84rem;font-weight:600;cursor:pointer;transition:all .15s}
.pv-angle-btn.is-active{background:#2756a0;color:#fff;border-color:#2756a0}
.pv-angle-btn:hover:not(.is-active){background:#f8fafc;border-color:#94a3b8}

/* video pane */
.pv-video-container{display:flex;flex-direction:column;align-items:center;width:100%}
.pv-video-player{width:100%;max-width:720px;aspect-ratio:16/9;border-radius:12px;overflow:hidden;background:#000;box-shadow:0 8px 24px rgba(0,0,0,.15)}
.pv-video-player video,.pv-video-player iframe{width:100%;height:100%;border:0;display:block}
.pv-video-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.8rem;padding:3rem 1.5rem;border-radius:12px;background:#f8fafc;border:1px dashed #cbd5e1;text-align:center;color:#64748b;width:100%;max-width:600px}
.pv-video-empty svg{color:#2756a0}

/* tds pane */
.pv-tds-container{display:flex;flex-direction:column;gap:1rem;width:100%}
.pv-tds-topbar{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.9rem 1.2rem;border-radius:10px;background:#f8fafc;border:1px solid #e2e8f0}
.pv-tds-tag{font-size:.7rem;font-weight:700;color:#2756a0;letter-spacing:.05em}
.pv-tds-name{margin:.15rem 0 0;font-size:.96rem;font-weight:700;color:#0e223d}
.pv-tds-actions{display:flex;gap:.6rem}
.pv-tds-action-btn{display:inline-flex;align-items:center;gap:.45rem;height:2.3rem;padding:0 1rem;border-radius:8px;font-size:.84rem;font-weight:600;text-decoration:none;cursor:pointer;transition:all .15s}
.pv-tds-open-btn{background:#fff;border:1.5px solid #2756a0;color:#2756a0}
.pv-tds-open-btn:hover{background:#2756a0;color:#fff}
.pv-tds-dl-btn{background:#2756a0;border:1.5px solid #2756a0;color:#fff}
.pv-tds-dl-btn:hover{background:#1e40af;border-color:#1e40af}
.pv-tds-embed-wrap{width:100%;height:500px;border-radius:10px;border:1px solid #e2e8f0;overflow:hidden;background:#fff}
.pv-tds-frame{width:100%;height:100%;border:0}
.pv-tds-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.8rem;padding:3rem 1.5rem;border-radius:12px;background:#f8fafc;border:1px dashed #cbd5e1;text-align:center;color:#64748b}

@media (max-width:960px){
  .pv-hero{grid-template-columns:1fr;gap:1.2rem}
  .pv-overview-grid{grid-template-columns:1fr;gap:1.4rem}
  .pv-stage-wrap{height:280px}
}
@media (max-width:599px){
  .pv{--pv-side:1rem}
  .pv-hero{padding:1.2rem 1rem}
  .pv-stage-wrap{height:220px}
  .pv-features{grid-template-columns:repeat(2,1fr)}
  .pv-purchase-row{flex-direction:column;align-items:stretch}
  .pv-enquire-btn{justify-content:center}
  .pv-tabs-bar{padding:0 1rem;gap:1rem;overflow-x:auto}
  .pv-tab{height:2.8rem;font-size:.85rem;white-space:nowrap}
  .pv-content{padding:1.2rem 1rem 1.4rem}
}
/* the product as a page of its own: the site's sand behind it, white cards on it */
.pv{background:var(--sand,#ece6da)}
.pv::-webkit-scrollbar-track{background:var(--sand,#ece6da)}
.pv::-webkit-scrollbar-thumb{background:rgba(18,34,59,.22)}
.pv::backdrop{background:var(--sand,#ece6da);backdrop-filter:none}
/* no scroll bar and no close cross: a bar over the page leads back to the list (Esc does too) */
.pv{scrollbar-width:none}
.pv::-webkit-scrollbar{display:none}
.pv-top{position:sticky;top:0;z-index:25;display:flex;align-items:center;justify-content:space-between;gap:1.5rem;height:4.2rem;padding:0 var(--pv-side);background:rgba(236,230,218,.9);backdrop-filter:blur(12px) saturate(1.2);box-shadow:0 1px 0 rgba(18,34,59,.08),0 10px 24px -22px rgba(18,34,59,.5)}
.pv-back{display:inline-flex;align-items:center;gap:.75rem;height:2.6rem;padding:0 .2rem;border:0;background:none;font:inherit;font-size:.95rem;font-weight:600;color:var(--ink,#12223b);cursor:pointer}
.pv-back i{display:grid;place-items:center;width:2.4rem;height:2.4rem;border-radius:50%;background:var(--navy,#0b2350);color:#fff;box-shadow:0 6px 14px -8px rgba(11,35,80,.8);transition:transform .25s cubic-bezier(.2,.8,.2,1),background-color .2s}
.pv-back:hover i{transform:translateX(-3px);background:var(--accent,#2756a0)}
.pv-back:hover span{color:var(--accent,#2756a0)}
.pv-back span{transition:color .2s}
.pv-back:focus-visible{outline:2px solid var(--accent,#2756a0);outline-offset:4px;border-radius:999px}
.pv-crumbs{display:flex;align-items:center;min-width:0;margin:0;font-size:.88rem;color:var(--mute,#5b6271);white-space:nowrap}
.pv-crumbs > *{display:inline-flex;align-items:center;min-width:0}
.pv-crumbs > * + *::before{content:"";flex:none;width:.4rem;height:.4rem;margin:0 .75rem;border-top:1.5px solid currentColor;border-right:1.5px solid currentColor;transform:rotate(45deg);opacity:.5}
.pv-crumbs b{display:block;overflow:hidden;text-overflow:ellipsis;font-weight:600;color:var(--ink,#12223b)}
.pv-crumbs b::before{display:inline-block;vertical-align:middle}
.pv-crumbs span:empty{display:none}
@media (max-width:767px){.pv-crumbs{display:none}.pv-top{height:3.6rem}}
.pv-hero{padding-top:clamp(1.4rem,4vh,2.4rem)}
.pv-tabs-bar{top:4.2rem}
@media (max-width:767px){.pv-tabs-bar{top:3.6rem}}
/* the product page: a calm sand page, the product on a large white stage, its facts in tidy white cards */
.pv{--pv-s:calc(var(--fs-body) * .88);--pv-card:#fff;--pv-line:rgba(18,34,59,.08);--pv-r:20px;font-family:var(--sans,inherit)}
.pv-hero{grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:clamp(2rem,4.5vw,4.5rem);align-items:center;background:transparent;padding-bottom:clamp(1.6rem,4vh,2.6rem)}

/* the gallery: one big white stage, the four views under it as small cards */
.pv-gallery{gap:1rem}
.pv-stage-wrap{height:clamp(340px,52svh,560px);border:0;border-radius:var(--pv-r);background:radial-gradient(120% 90% at 50% 40%,#fff 55%,#f6f2ea 100%);box-shadow:0 0 0 1px var(--pv-line),0 40px 70px -50px rgba(18,34,59,.55)}
.pv-stage{padding:clamp(1.4rem,3vw,2.6rem)}
.pv-main-img{max-width:88%;max-height:88%;filter:drop-shadow(0 22px 26px rgba(18,34,59,.16))}
.pv-nav-arrow{width:2.7rem;height:2.7rem;border:0;background:rgba(255,255,255,.95);color:var(--ink,#12223b);box-shadow:0 0 0 1px var(--pv-line),0 10px 20px -12px rgba(18,34,59,.5);opacity:.85;transition:opacity .2s,transform .2s,background-color .2s,color .2s}
.pv-stage-wrap:hover .pv-nav-arrow{opacity:1}
.pv-nav-arrow:hover{background:var(--navy,#0b2350);color:#fff}
.pv-nav-prev{left:1rem}.pv-nav-next{right:1rem}
.pv-zoom-btn{bottom:1rem;right:1rem;width:2.5rem;height:2.5rem;border:0;border-radius:50%;background:rgba(255,255,255,.95);color:var(--ink,#12223b);box-shadow:0 0 0 1px var(--pv-line),0 8px 18px -12px rgba(18,34,59,.5)}
.pv-zoom-btn:hover{background:var(--navy,#0b2350);color:#fff}
.pv-thumbs{gap:.75rem}
.pv-thumb{gap:.5rem}
.pv-thumb-box{height:78px;padding:6px;border:0;border-radius:14px;background:#fff;box-shadow:0 0 0 1px var(--pv-line);transition:box-shadow .2s,transform .2s}
.pv-thumb:hover .pv-thumb-box{transform:translateY(-2px);box-shadow:0 0 0 1px rgba(18,34,59,.2),0 10px 18px -14px rgba(18,34,59,.5)}
.pv-thumb.is-active .pv-thumb-box{box-shadow:0 0 0 2px var(--navy,#0b2350)}
.pv-thumb-label{font-size:var(--pv-s);font-weight:500;color:var(--mute,#5b6271)}
.pv-thumb.is-active .pv-thumb-label{color:var(--ink,#12223b);font-weight:600}

/* the product: what it is, its name large, what it does, then the four strengths and how to buy it */
.pv-info{padding:0;align-self:center}
.pv-badges{gap:.6rem;margin-bottom:1rem}
.pv-badge-cat{padding:.35rem .8rem;border-radius:999px;background:var(--navy,#0b2350);color:#fff;font-size:var(--pv-s);font-weight:600;letter-spacing:.02em;text-transform:none}
.pv-badge-brand{gap:.45rem;padding:.35rem .8rem;border-radius:999px;background:#fff;color:var(--ink,#12223b);font-size:var(--pv-s);font-weight:600;box-shadow:0 0 0 1px var(--pv-line)}
.pv-badge-brand::before{content:"";width:.45rem;height:.45rem;border-radius:50%;background:var(--accent,#2756a0)}
.pv-title{font-family:var(--display,inherit);font-size:var(--fs-title);font-weight:600;line-height:1.08;letter-spacing:-.025em;color:var(--ink,#12223b);text-wrap:balance}
.pv-subtitle{margin:.7rem 0 0;font-size:var(--fs-sub);font-weight:500;line-height:1.35;color:var(--accent,#2756a0);letter-spacing:-.01em}
.pv-summary{display:block;-webkit-line-clamp:unset;margin:1rem 0 0;max-width:38rem;font-size:var(--fs-body);line-height:1.7;color:var(--ink2,rgba(18,34,59,.82))}
.pv-features{grid-template-columns:repeat(4,minmax(0,1fr));gap:.7rem;margin:1.6rem 0 0}
.pv-feat{gap:.6rem;padding:1rem .5rem .9rem;border:0;border-radius:16px;background:#fff;box-shadow:0 0 0 1px var(--pv-line)}
.pv-feat-ico{width:2.6rem;height:2.6rem;border-radius:50%;background:rgba(39,86,160,.09)}
.pv-feat-ico svg{width:20px;height:20px;color:var(--accent,#2756a0)}
.pv-feat-title{font-size:var(--pv-s);font-weight:600;color:var(--ink,#12223b)}
.pv-purchase-row{align-items:center;gap:1.2rem;margin-top:1.2rem;padding:1.1rem 1.2rem 1.1rem 1.4rem;border-radius:var(--pv-r);background:#fff;box-shadow:0 0 0 1px var(--pv-line),0 24px 40px -34px rgba(18,34,59,.5)}
.pv-packs-block{gap:.55rem}
.pv-packs-title{font-size:var(--pv-s);font-weight:600;color:var(--mute,#5b6271)}
.pv-pack-chip{height:2.3rem;padding:0 .95rem;border:0;border-radius:999px;background:var(--sand,#ece6da);color:var(--ink,#12223b);font-size:var(--pv-s);font-weight:600;box-shadow:none}
.pv-pack-chip:hover:not(.is-active){background:#e2d9c9}
.pv-pack-chip.is-active{background:var(--navy,#0b2350);color:#fff}
.pv-enquire-btn{gap:.7rem;height:3.2rem;padding:0 1.6rem;border-radius:999px;background:var(--color-rpc,#2756a0);font-size:var(--fs-body);font-weight:600;box-shadow:0 14px 26px -16px rgba(39,86,160,.9)}
.pv-enquire-btn:hover{background:#1e40af;transform:translateY(-1px);box-shadow:0 18px 30px -16px rgba(39,86,160,.9)}
.pv-enquire-btn svg{transition:transform .2s}
.pv-enquire-btn:hover svg{transform:translateX(3px)}

/* the three tabs as one rounded switch */
.pv-tabs-bar{gap:.35rem;margin-top:0;padding-top:.8rem;padding-bottom:.8rem;border:0;background:rgba(236,230,218,.92);backdrop-filter:blur(12px)}
.pv-tab{height:2.75rem;padding:0 1.15rem;border-radius:999px;font-size:var(--pv-s);color:var(--mute,#5b6271);background:transparent;transition:background-color .2s,color .2s}
.pv-tab:hover{color:var(--ink,#12223b);background:rgba(255,255,255,.6)}
.pv-tab.is-active{color:#fff;background:var(--navy,#0b2350)}
.pv-tab.is-active::after{display:none}
.pv-tab svg{width:17px;height:17px}

/* the overview: what it is and its benefits beside its properties; the places it is used across the foot */
.pv-content{padding-top:clamp(1rem,2.5vh,1.6rem)}
.pv-overview-grid{grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);grid-template-areas:"desc props" "apps apps";gap:clamp(1rem,2vw,1.5rem);align-items:stretch}
.pv-col-desc{grid-area:desc}.pv-col-apps{grid-area:apps}.pv-col-props{grid-area:props}
.pv-col-desc,.pv-col-apps,.pv-col-props{padding:clamp(1.4rem,2.6vw,2.2rem);border-radius:var(--pv-r);background:#fff;box-shadow:0 0 0 1px var(--pv-line)}
.pv-section-title,.pv-specs-title{margin:0 0 .9rem;font-family:var(--display,inherit);font-size:var(--fs-sub);font-weight:600;letter-spacing:-.015em;color:var(--ink,#12223b)}
.pv-col-desc .pv-section-title + .pv-full-desc + .pv-section-title{margin-top:1.8rem;padding-top:1.6rem;border-top:1px solid var(--pv-line)}
.pv-full-desc{margin:0;max-width:44rem;font-size:var(--fs-body);line-height:1.75;color:var(--ink2,rgba(18,34,59,.82))}
.pv-benefits-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.85rem 1.6rem}
.pv-benefit-item{gap:.7rem;font-size:var(--pv-s);line-height:1.55;color:var(--ink,#12223b)}
.pv-benefit-check{width:1.35rem;height:1.35rem;margin-top:.05rem;border-radius:50%;background:rgba(39,86,160,.12);color:var(--accent,#2756a0)}
.pv-specs-card{padding:0;border:0;border-radius:0;background:none}
.pv-specs-table{font-size:var(--pv-s)}
.pv-specs-table tr{border-top:1px solid var(--pv-line)}
.pv-specs-table th{padding:.85rem 1rem .85rem 0;font-weight:500;color:var(--mute,#5b6271);white-space:nowrap}
.pv-specs-table td{padding:.85rem 0;text-align:right;font-weight:600;color:var(--ink,#12223b)}
.pv-apps-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:.9rem}
.pv-app-card{position:relative;border:0;border-radius:16px;background:var(--sand,#ece6da)}
.pv-app-img{height:auto;aspect-ratio:4/3;transition:transform .5s cubic-bezier(.2,.8,.2,1)}
.pv-app-card:hover .pv-app-img{transform:scale(1.04)}
.pv-app-label{position:absolute;left:.6rem;bottom:.6rem;padding:.35rem .75rem;border-radius:999px;background:rgba(255,255,255,.94);font-size:var(--pv-s);font-weight:600;color:var(--ink,#12223b);text-align:left;box-shadow:0 6px 14px -10px rgba(18,34,59,.6)}

/* the video and the data sheet: on the same white cards */
.pv-video-player{border-radius:var(--pv-r)}
.pv-video-empty,.pv-tds-empty{border:1px dashed rgba(18,34,59,.2);border-radius:var(--pv-r);background:#fff}
.pv-tds-topbar{border:0;border-radius:var(--pv-r);background:#fff;box-shadow:0 0 0 1px var(--pv-line);padding:1.1rem 1.4rem}
.pv-tds-action-btn{border-radius:999px;height:2.6rem;padding:0 1.2rem}
.pv-tds-dl-btn{background:var(--navy,#0b2350);border-color:var(--navy,#0b2350)}
.pv-tds-open-btn{border-color:var(--navy,#0b2350);color:var(--navy,#0b2350)}
.pv-tds-open-btn:hover{background:var(--navy,#0b2350);color:#fff}
.pv-tds-embed-wrap{border:0;border-radius:var(--pv-r);box-shadow:0 0 0 1px var(--pv-line);height:min(75svh,720px)}

@media (max-width:1100px){.pv-apps-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:960px){
  .pv-hero{grid-template-columns:1fr}
  .pv-overview-grid{grid-template-columns:1fr;grid-template-areas:"desc" "props" "apps"}
  .pv-stage-wrap{height:clamp(280px,46svh,420px)}
}
@media (max-width:599px){
  .pv-features{grid-template-columns:repeat(2,minmax(0,1fr))}
  .pv-benefits-list{grid-template-columns:1fr}
  .pv-purchase-row{flex-direction:column;align-items:stretch;padding:1rem}
  .pv-enquire-btn{justify-content:center}
  .pv-tabs-bar{overflow-x:auto;scrollbar-width:none}
  .pv-tab{white-space:nowrap;padding:0 .9rem}
  .pv-thumb-box{height:62px}
  .pv-col-desc,.pv-col-apps,.pv-col-props{padding:1.2rem}
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
  .pf-chev{top:1.1rem;right:1.1rem;width:1.7rem;height:1.7rem;border-radius:50%;background:rgba(255,255,255,.75)}
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
@media (hover:hover){.pf-row:hover{transform:translateY(-2px);box-shadow:inset 0 0 0 1px rgba(18,34,59,.28),0 18px 34px -24px rgba(18,34,59,.55)}}
.pf-ico{position:relative;display:flex;align-items:center;justify-content:center;border-radius:14px;overflow:hidden;cursor:default}
.pf-ico--photo img{width:100%;height:100%;max-width:100%;max-height:100%;padding:.4rem;box-sizing:border-box;object-fit:contain;border-radius:10px}
.pf-row:has(.pf-add.is-on) .pf-ico::after{content:"";position:absolute;top:-.35rem;left:-.35rem;width:1.35rem;height:1.35rem;border-radius:50%;background:var(--navy) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M3.5 8.4 6.6 11.4 12.6 4.8' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat center/70%;box-shadow:0 0 0 2px #fbf8f2}
.pf-add.is-on:hover{background:var(--accent)}
.pf-more{height:2.8rem;background:rgba(255,255,255,.55);box-shadow:inset 0 0 0 1px rgba(18,34,59,.16)}
.pf-more:hover{background:#fff;box-shadow:inset 0 0 0 1.5px var(--navy)}
.pf-bh{gap:.75rem}
@media (prefers-reduced-motion:reduce){.pf-row,.pf-row:hover{transition:none;transform:none}}

/* a card's picture opens larger */
.pf-ico{cursor:default}
.pz{display:none;width:min(32rem,calc(100vw - 2rem));height:min(37rem,calc(100svh - 3rem));max-width:none;max-height:none;margin:auto;padding:0;border:0;border-radius:20px;background:#fff;color:var(--ink);box-shadow:0 40px 80px -30px rgba(4,12,30,.6);overflow:hidden;box-sizing:border-box}
.pz[open]{display:flex;flex-direction:column;animation:pz-in .25s cubic-bezier(.2,.8,.2,1)}
.pz::backdrop{background:rgba(9,20,38,.6);backdrop-filter:blur(3px)}
@keyframes pz-in{from{opacity:0;transform:scale(.96)}}
.pz-x{position:absolute;top:.9rem;right:.9rem;z-index:2;display:grid;place-items:center;width:2.5rem;height:2.5rem;padding:0;border:0;border-radius:50%;background:rgba(18,34,59,.07);color:var(--ink);cursor:pointer;transition:background-color .15s}
.pz-x:hover{background:rgba(18,34,59,.14)}
.pz-x:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.pz-x svg{width:1rem;height:1rem}
.pz-pic{position:relative;flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:2.6rem 2.2rem 1.4rem;box-sizing:border-box;background:radial-gradient(circle at 50% 45%,#fff 0,color-mix(in srgb,var(--tint,#2756a0) 8%,#fff) 75%)}
.pz-pic img{display:block;width:100%;height:100%;object-fit:contain}
.pz-pic svg{width:70%;height:70%;max-width:100%;max-height:100%}
.pz-cap{flex:none;min-height:4.8rem;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;gap:.25rem;margin:0;padding:1rem 1.4rem 1.1rem;border-top:1px solid var(--line);background:#fff}
.pz-name{font-size:1.02rem;font-weight:700;color:var(--ink);line-height:1.25}
.pz-sub{font-size:.88rem;color:var(--mute);line-height:1.35}
@media (prefers-reduced-motion:reduce){.pz[open]{animation:none}}

/* catalogue finish: every brand heading reads logo, name, count; the card's pack drawing drops its tiny size label (the size is in the chip below, and the larger picture shows it) */
.pf-bh{flex-wrap:wrap;row-gap:.3rem}
.pf-bh span{margin-left:0}
.pf-ico svg.pa text{display:none}
@media (max-width:599px){
  .pf-row,.pf-row:has(.pf-d[open]){--h:20.6rem}
  .pf-ico{height:7.6rem}
}

/* three ways to look at the catalogue: cards, a list, a table */
.pf-use,.pf-thead{display:none}

/* list: one product a row, its picture on the left, what it does under its name, the packs on the right */
.pf-lists[data-view="list"] .pf-rows{grid-template-columns:minmax(0,1fr);gap:.6rem}
.pf-lists[data-view="list"] .pf-row,.pf-lists[data-view="list"] .pf-row:has(.pf-d[open]){--h:9.2rem;grid-column:auto}
.pf-lists[data-view="list"] .pf-sum{grid-template-columns:7.2rem minmax(0,1fr) auto;grid-template-rows:auto minmax(0,1fr);grid-template-areas:"ico fam packs" "ico tx packs";gap:.25rem 1.3rem;padding:1rem 10rem 1rem 1rem}
.pf-lists[data-view="list"] .pf-ico{grid-row:1/3;width:7.2rem;height:7.2rem}
.pf-lists[data-view="list"] .pf-name,.pf-lists[data-view="list"] .pf-cat{-webkit-line-clamp:1}
.pf-lists[data-view="list"] .pf-use{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;margin-top:.35rem;font-size:var(--fs-body);line-height:1.45;color:var(--ink)}
.pf-lists[data-view="list"] .pf-packs{align-self:center;max-width:15rem;margin:0;padding:0;border-top:0;flex-wrap:wrap;justify-content:flex-end}
.pf-lists[data-view="list"] .pf-add{top:calc(var(--h) / 2 - 1.1rem);bottom:auto;left:auto;right:1rem;width:auto}

/* table: a compact sheet, a row a product: picture, name and kind, what it does, packs, Add */
.pf-lists[data-view="table"] .pf-thead{display:grid;grid-template-columns:3.2rem minmax(0,1.2fr) minmax(0,1.6fr) minmax(0,1fr);gap:0 1.2rem;margin:0;padding:0 9.5rem .5rem 1rem;font-size:var(--fs-body);font-weight:600;color:var(--mute)}
.pf-lists[data-view="table"] .pf-thead span:first-child{grid-column:1/3}
.pf-lists[data-view="table"] .pf-rows{grid-template-columns:minmax(0,1fr);gap:0;border-radius:14px;background:#fbf8f2;box-shadow:inset 0 0 0 1px var(--line);overflow:hidden}
.pf-lists[data-view="table"] .pf-row,.pf-lists[data-view="table"] .pf-row:has(.pf-d[open]){--h:4.6rem;grid-column:auto;border-radius:0;background:transparent;box-shadow:none;border-top:1px solid var(--line);transform:none}
.pf-lists[data-view="table"] .pf-row:first-child{border-top:0}
.pf-lists[data-view="table"] .pf-row::before{inset:0 auto 0 0;width:4px;height:auto}
.pf-lists[data-view="table"] .pf-row:hover{background:color-mix(in srgb,var(--tint) 5%,#fff)}
.pf-lists[data-view="table"] .pf-row:has(.pf-add.is-on){background:rgba(39,86,160,.06)}
.pf-lists[data-view="table"] .pf-sum{grid-template-columns:3.2rem minmax(0,1.2fr) minmax(0,1.6fr) minmax(0,1fr);grid-template-rows:auto auto;grid-template-areas:"ico name use packs" "ico cat use packs";align-items:center;gap:0 1.2rem;padding:.6rem 9.5rem .6rem 1rem}
.pf-lists[data-view="table"] .pf-fam{display:none}
.pf-lists[data-view="table"] .pf-tx{display:contents}
.pf-lists[data-view="table"] .pf-name{grid-area:name;align-self:end;-webkit-line-clamp:1}
.pf-lists[data-view="table"] .pf-cat{grid-area:cat;align-self:start;margin:0;-webkit-line-clamp:1}
.pf-lists[data-view="table"] .pf-use{grid-area:use;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;font-size:var(--fs-body);line-height:1.4;color:var(--ink)}
.pf-lists[data-view="table"] .pf-ico{grid-row:1/3;width:3.2rem;height:3.2rem;border-radius:8px}
.pf-lists[data-view="table"] .pf-ico::after{display:none}
.pf-lists[data-view="table"] .pf-packs{grid-row:1/3;align-self:center;margin:0;padding:0;border-top:0;flex-wrap:wrap}
.pf-lists[data-view="table"] .pf-add{top:calc(var(--h) / 2 - 1.05rem);bottom:auto;left:auto;right:2.9rem;width:auto}
.pf-lists[data-view="table"] .pf-chev{top:calc(var(--h) / 2 - .75rem);right:.8rem}

/* a narrow screen: list and table both become one-column rows, the picture on the left */
@media (max-width:899px){
  .pf-lists[data-view="table"] .pf-thead{display:none}
  .pf-lists[data-view="table"] .pf-sum{grid-template-columns:3.2rem minmax(0,1fr) auto;grid-template-areas:"ico name packs" "ico cat packs"}
  .pf-lists[data-view="table"] .pf-use{display:none}
}
@media (max-width:599px){
  .pf-lists[data-view="list"] .pf-row,.pf-lists[data-view="list"] .pf-row:has(.pf-d[open]){--h:8.4rem}
  .pf-lists[data-view="list"] .pf-sum{grid-template-columns:5.8rem minmax(0,1fr);grid-template-rows:auto auto minmax(0,1fr);grid-template-areas:"ico fam" "ico tx" "ico packs";gap:.15rem .9rem;padding:.75rem .75rem .75rem .75rem}
  .pf-lists[data-view="list"] .pf-ico{grid-row:1/4;width:5.8rem;height:100%;max-height:6.9rem}
  .pf-lists[data-view="list"] .pf-use{display:none}
  .pf-lists[data-view="list"] .pf-fam{padding-right:2.2rem}
  .pf-lists[data-view="list"] .pf-packs{align-self:end;justify-content:flex-start;flex-wrap:nowrap;overflow:hidden;max-width:none;padding-right:5.4rem}
  .pf-lists[data-view="list"] .pf-add{top:auto;bottom:.75rem;right:.75rem;height:2.1rem}
  .pf-lists[data-view="table"] .pf-row,.pf-lists[data-view="table"] .pf-row:has(.pf-d[open]){--h:5.2rem}
  .pf-lists[data-view="table"] .pf-sum{grid-template-columns:2.8rem minmax(0,1fr);grid-template-areas:"ico name" "ico cat";padding:.6rem 7.6rem .6rem .8rem;gap:0 .8rem}
  .pf-lists[data-view="table"] .pf-ico{width:2.8rem;height:2.8rem}
  .pf-lists[data-view="table"] .pf-packs{display:none}
  .pf-lists[data-view="table"] .pf-sum{grid-template-areas:"ico name" "ico cat"}
  .pf-lists[data-view="table"] .pf-name{-webkit-line-clamp:2;line-height:1.3}
  .pf-lists[data-view="table"] .pf-row:has(.pf-name) .pf-cat{-webkit-line-clamp:1}
  .pf-lists[data-view="table"] .pf-add{right:2.6rem;height:2.1rem;padding:0 .6rem}
  .pf-lists[data-view="table"] .pf-chev{right:.6rem;background:none}
      }

/* card finish: a clean white card with a soft edge; the kind marked by a coloured dot instead of a band; the picture on a quiet tinted ground;
   neutral pack chips; Add as a soft navy button that fills when pressed */
.pf-lists:not([data-view="table"]) .pf-row{background:#fffdf9;box-shadow:0 0 0 1px rgba(18,34,59,.09),0 1px 2px rgba(18,34,59,.04);border-radius:16px}
.pf-lists:not([data-view="table"]) .pf-row::before{display:none}
@media (hover:hover){.pf-lists:not([data-view="table"]) .pf-row:hover{box-shadow:0 0 0 1px rgba(18,34,59,.16),0 20px 36px -26px rgba(18,34,59,.55)}}
.pf-lists:not([data-view="table"]) .pf-row:has(.pf-add.is-on){box-shadow:0 0 0 1.5px var(--navy),0 12px 28px -24px rgba(18,34,59,.6)}
.pf-lists:not([data-view="table"]) .pf-fam{color:var(--mute)}
.pf-lists:not([data-view="table"]) .pf-fam::before{display:none}
.pf-lists:not([data-view="table"]) .pf-ico{background:color-mix(in srgb,var(--tint) 7%,#f6f3ee);box-shadow:none}
.pf-lists:not([data-view="table"]) .pf-ico--photo{background:color-mix(in srgb,var(--tint) 7%,#f6f3ee);box-shadow:none}
.pf-lists:not([data-view="table"]) .pf-packs{border-top-color:rgba(18,34,59,.07)}
.pf-packs span{background:#f1ede5;color:var(--ink)}
.pf-chev{border-radius:50%;transition:background-color .2s,transform .25s}
.pf-sum:hover .pf-chev{background:rgba(18,34,59,.06);color:var(--ink)}
.pf-add{border-radius:9px;background:rgba(18,34,59,.06);box-shadow:none;color:var(--navy)}
.pf-add:hover{background:var(--navy);box-shadow:none;color:#fff}
.pf-add.is-on{background:var(--navy);color:#fff}
.pf-add:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (max-width:599px){.pf-lists:not([data-view="table"]) .pf-fam{display:block}.pf-lists:not([data-view="table"]) .pf-fam::before{display:none}}

/* button: View Details */
.pf-view-btn{display:inline-flex;align-items:center;justify-content:center;gap:.45rem;height:2.6rem;padding:0 1rem;border-radius:10px;background:#0e223d;color:#fff;border:0;font:inherit;font-size:.88rem;font-weight:600;cursor:pointer;transition:background-color .15s,transform .15s,box-shadow .15s;box-sizing:border-box;text-decoration:none}
.pf-view-btn:hover{background:#13316c;transform:translateY(-1px);box-shadow:0 4px 12px rgba(14,34,61,.2)}
.pf-view-btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.pf-view-btn svg{transition:transform .15s ease}
.pf-view-btn:hover svg{transform:translateX(3px)}

/* shop cards (cards view, every width): the picture large on top, the kind, the name in bold, the line it belongs to and its packs;
   along the foot a full-width View Details button */
.pf-lists[data-view="grid"] .pf-row,.pf-lists[data-view="grid"] .pf-row:has(.pf-d[open]){--h:23.2rem;grid-column:auto;cursor:pointer}
.pf-lists[data-view="grid"] .pf-sum{grid-template-columns:minmax(0,1fr);grid-template-rows:10rem auto auto minmax(0,1fr);grid-template-areas:"ico" "fam" "tx" "packs";gap:.4rem;padding:.75rem .75rem 4.1rem;align-items:start}
.pf-lists[data-view="grid"] .pf-ico{display:flex;align-items:center;justify-content:center;width:100%;height:10rem;max-height:10rem;border-radius:12px;margin-bottom:.35rem;overflow:hidden;cursor:pointer}
.pf-lists[data-view="grid"] .pf-ico svg.pa{width:100%;height:100%}
.pf-lists[data-view="grid"] .pf-ico img{display:block;width:100%;height:100%;max-width:100%;max-height:100%;object-fit:contain;padding:.4rem;box-sizing:border-box}
.pf-lists[data-view="grid"] .pf-fam{display:flex;padding:0 .2rem}
.pf-lists[data-view="grid"] .pf-tx{padding:0 .2rem}
.pf-lists[data-view="grid"] .pf-name{-webkit-line-clamp:2;cursor:pointer}
.pf-lists[data-view="grid"] .pf-cat{-webkit-line-clamp:1;margin-top:.1rem}
.pf-lists[data-view="grid"] .pf-packs{align-self:end;margin:0;padding:0 .2rem;border-top:0;flex-wrap:nowrap;overflow:hidden}
.pf-lists[data-view="grid"] .pf-view-btn{position:absolute;top:calc(var(--h) - 3.35rem);left:.75rem;right:.75rem;width:auto;height:2.6rem;z-index:2}
.pf-lists[data-view="grid"] .pf-add{display:none}
.pf-lists[data-view="grid"] .pf-chev{display:none}
.pf-lists[data-view="grid"] .pf-open{display:none}
@media (max-width:599px){
  .pf-lists[data-view="grid"] .pf-row,.pf-lists[data-view="grid"] .pf-row:has(.pf-d[open]){--h:21.6rem}
  .pf-lists[data-view="grid"] .pf-sum{grid-template-rows:8rem auto auto minmax(0,1fr);padding:.6rem .6rem 3.8rem;gap:.3rem}
  .pf-lists[data-view="grid"] .pf-ico{height:8rem;max-height:8rem}
  .pf-lists[data-view="grid"] .pf-fam{display:block}
  .pf-lists[data-view="grid"] .pf-view-btn{top:calc(var(--h) - 3.05rem);left:.6rem;right:.6rem;height:2.45rem;font-size:.82rem}
}

/* list view */
.pf-lists[data-view="list"] .pf-view-btn{position:absolute;top:calc(var(--h) / 2 - 1.1rem);right:5.6rem;height:2.2rem;padding:0 .8rem;font-size:.82rem;z-index:2}
@media (max-width:599px){
  .pf-lists[data-view="list"] .pf-view-btn{top:auto;bottom:.75rem;right:4.8rem;height:2.1rem;padding:0 .6rem;font-size:.78rem}
}

/* table view */
.pf-lists[data-view="table"] .pf-view-btn{display:none}

`;
