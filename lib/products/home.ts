/**
 * The home page's products section, rendered on the server so the product list
 * never travels to the browser: the products, layer by layer.
 *
 * Pick a job (a bathroom floor, a terrace, a tank, a basement, a concrete
 * repair, an AAC wall) and it is drawn as an architect's section detail: the
 * concrete cut and hatched, fine lines for the rest, and each layer we supply
 * numbered on the drawing in the order it goes on. Tap a layer (on the
 * drawing or in the list beside it) and the list opens on that layer's
 * products. Which products go in
 * which layer comes from the "systems" in lib/products (built only from what
 * RPC's spreadsheet says each product is for). The brands themselves are in
 * the home page's opening (the hero).
 */
import { productBySlug, SYSTEMS, type Product, PRODUCTS } from "./index";
import { brandMark } from "./brands";
import { shortName } from "./compare";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ------------------------------------------------------------ the details */

/** the jobs shown, in order */
const JOBS = ["bathroom", "terrace", "tank", "basement", "repair", "aac"] as const;

/** the drawing's shared patterns: concrete cut (hatched), concrete with its aggregate, earth, a screed */
const defs = (k: string) => `<defs>
  <pattern id="ld-h-${k}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="#e7dfcf"/><line x1="0" y1="0" x2="0" y2="7" stroke="#12223b" stroke-opacity=".24" stroke-width="1"/></pattern>
  <pattern id="ld-a-${k}" width="22" height="18" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="1.6" fill="#12223b" fill-opacity=".28"/><circle cx="15" cy="12" r="1.2" fill="#12223b" fill-opacity=".22"/><path d="M11 3l2 1.5-1.8 1z" fill="#12223b" fill-opacity=".2"/></pattern>
  <pattern id="ld-e-${k}" width="16" height="12" patternUnits="userSpaceOnUse"><rect width="16" height="12" fill="#ece4d3"/><circle cx="3" cy="3" r="1" fill="#12223b" fill-opacity=".16"/><circle cx="11" cy="9" r=".9" fill="#12223b" fill-opacity=".13"/></pattern>
  <pattern id="ld-s-${k}" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#ece2cc"/><circle cx="2" cy="2" r="1" fill="#12223b" fill-opacity=".2"/><circle cx="6" cy="6" r=".8" fill="#12223b" fill-opacity=".15"/></pattern>
</defs>`;
const cut = (k: string, d: string) => `<path class="ld-cut" d="${d}" fill="url(#ld-h-${k})"/>`;
const agg = (k: string, d: string) => `<path d="${d}" fill="url(#ld-a-${k})" pointer-events="none"/>`;
const rain = (xs: readonly number[], y = 16) => xs.map((x) => `<path class="ld-rain" d="M${x} ${y}v26M${x - 5} ${y + 19}l5 7 5-7"/>`).join("");

/** each job's drawing: its elements by layer key, and where each layer's number sits */
type Detail = { art: (k: string, el: (key: string, svg: string) => string) => string; at: Record<string, [number, number]> };
const DETAILS: Record<string, Detail> = {
  bathroom: {
    art: (k, el) => `${cut(k, "M40 236H516V100H556V296H40Z")}
<path class="ld-fine" d="M556 100V40M516 100V40" />
${el("coat", `<path class="ld-coat" d="M40 232H512V110"/>`)}
${el("screed", `<rect class="ld-line" x="40" y="186" width="470" height="43" fill="url(#ld-s-${k})"/>`)}
${el("adhesive", `<rect class="ld-line" x="40" y="178" width="470" height="8" fill="#c9c3b8"/>`)}
<g class="ld-tiles">${Array.from({ length: 10 }, (_, i) => `<rect x="${40 + i * 47}" y="160" width="44" height="18"/>`).join("")}<rect x="492" y="118" width="18" height="42"/></g>
${el("grout", Array.from({ length: 10 }, (_, i) => `<rect class="ld-grout" x="${84 + i * 47}" y="160" width="3" height="18"/>`).join(""))}`,
    at: { coat: [512, 140], screed: [150, 208], adhesive: [300, 182], grout: [367, 152] },
  },
  terrace: {
    art: (k, el) => `${rain([150, 250, 350, 450])}
${el("mix", `${cut(k, "M40 240H560V300H40Z")}${agg(k, "M40 240H560V300H40Z")}`)}
${cut(k, "M520 240V96H560V240Z")}
${el("fill", `<path class="ld-line" d="M150 240q30 10 60 0Z" fill="#a9a293"/><path class="ld-line" d="M330 240q22 8 44 0Z" fill="#a9a293"/>`)}
${el("coat", `<path class="ld-coat" d="M40 236H516V100"/>`)}`,
    at: { mix: [100, 272], fill: [180, 214], coat: [440, 214] },
  },
  tank: {
    art: (k, el) => `<rect x="0" y="40" width="60" height="270" fill="url(#ld-e-${k})"/><rect x="580" y="40" width="60" height="270" fill="url(#ld-e-${k})"/>
${el("mix", `${cut(k, "M60 60H100V250H540V60H580V300H60Z")}${agg(k, "M60 60H100V250H540V60H580V300H60Z")}`)}
<path class="ld-water" d="M104 124c40-6 70 6 108 0s70-6 108 0 70 6 108 0 70-6 108 0V246H104Z"/>
${el("joint", `<path class="ld-fine" d="M60 250H100M540 250H580"/><rect class="ld-ws" x="74" y="238" width="12" height="24" rx="2"/><rect class="ld-ws" x="554" y="238" width="12" height="24" rx="2"/>`)}
${el("plug", `<path class="ld-plug" d="M536 176c6 0 9 5 9 10s-3 10-9 10z"/>`)}
${el("coat", `<path class="ld-coat" d="M103 70V247H537V70"/>`)}`,
    at: { joint: [80, 220], mix: [320, 278], plug: [516, 186], coat: [103, 100] },
  },
  basement: {
    art: (k, el) => `<rect x="0" y="40" width="112" height="270" fill="url(#ld-e-${k})"/><rect x="112" y="304" width="528" height="6" fill="url(#ld-e-${k})"/>
${el("mix", `${cut(k, "M120 40H170V250H620V300H120Z")}${agg(k, "M120 40H170V250H620V300H120Z")}`)}
${el("sheet", `<path class="ld-sheet" d="M115 40V305H620"/>`)}
${el("joint", `<path class="ld-fine" d="M120 250H170"/><rect class="ld-ws" x="139" y="238" width="12" height="24" rx="2"/>`)}
${el("plug", `<path class="ld-plug" d="M170 140c7 0 10 5 10 11s-3 11-10 11z"/>`)}`,
    at: { sheet: [115, 110], joint: [145, 216], mix: [400, 276], plug: [196, 151] },
  },
  repair: {
    art: (k, el) => `${cut(k, "M40 70H600V226H460L444 170H196L180 226H40Z")}
<path class="ld-fine" d="M40 198H600" stroke-dasharray="6 5"/>
${el("clean", `<path class="ld-steel" d="M196 198H330"/>`)}
${el("prime", `<path class="ld-steel ld-steel--primed" d="M330 198H444"/>`)}
${el("bond", `<path class="ld-coat" d="M182 224L197 172H443L458 224"/>`)}
${el("mortar", `<path class="ld-line" d="M330 175H442L456 224H330Z" fill="url(#ld-s-${k})"/>`)}
${el("finish", `<rect class="ld-line" x="330" y="226" width="130" height="9" fill="#e4dccb"/>`)}`,
    at: { clean: [250, 198], prime: [330, 150], bond: [190, 150], mortar: [400, 200], finish: [400, 250] },
  },
  aac: {
    art: (k, el) => {
      const blocks: string[] = [];
      for (let r = 0; r < 4; r++) for (let c = -1; c < 6; c++) {
        const x = 40 + c * 112 + (r % 2 ? 56 : 0);
        const x0 = Math.max(40, x), x1 = Math.min(600, x + 109);
        if (x1 > x0) blocks.push(`<rect x="${x0}" y="${50 + r * 63}" width="${x1 - x0}" height="60"/>`);
      }
      return `${el("joint", `<rect x="40" y="50" width="560" height="249" fill="#9d978b"/>`)}
${el("block", `<g class="ld-blocks">${blocks.join("")}</g>`)}
${el("plaster", `<path class="ld-line" d="M380 50H600V299H410C396 240 412 200 388 150 376 120 392 80 380 50Z" fill="#e4dccb"/>`)}`;
    },
    at: { joint: [208, 113], block: [110, 210], plaster: [500, 170] },
  },
};

function panel(s: (typeof SYSTEMS)[number], i: number, all: readonly Product[]) {
  const d = DETAILS[s.key];
  if (!d) return "";
  const k = s.key;
  const no = (key: string) => s.layers.findIndex((l) => l.key === key) + 1;
  const el = (key: string, svg: string) => `<g class="ld-el${no(key) === 1 ? " is-on" : ""}" data-l="${key}">${svg}</g>`;
  const marks = s.layers
    .map((l, n) => {
      const [x, y] = d.at[l.key] ?? [40 + n * 60, 30];
      return `<g class="ld-mk${n === 0 ? " is-on" : ""}" data-l="${l.key}"><circle cx="${x}" cy="${y}" r="15"/><text x="${x}" y="${y + 5.5}">${n + 1}</text></g>`;
    })
    .join("");
  const rows = s.layers
    .map((l, n) => {
      const ps = l.products.map((slug) => productBySlug(slug)).filter((p): p is Product => Boolean(p) && all.includes(p!));
      return `<li class="ld-row${n === 0 ? " is-on" : ""}" data-l="${l.key}">
  <button type="button" class="ld-rb" aria-expanded="${n === 0}" aria-controls="ld-${k}-${l.key}"><span class="ld-n" aria-hidden="true">${n + 1}</span><span class="ld-rt"><span class="ld-name"><span class="hl-vh">Layer ${n + 1}: </span>${esc(l.name)}</span><span class="ld-what">${esc(l.note)}</span></span><span class="ld-count">${ps.length}</span></button>
  <ul class="ld-ps" id="ld-${k}-${l.key}"${n === 0 ? "" : " hidden"}>${ps
    .map((p) => `<li><a href="/products#${p.slug}" data-internal><i style="--b:${brandMark(p.brand)}" aria-hidden="true"></i><em>${esc(p.brand)}</em> ${esc(shortName(p))}</a></li>`)
    .join("")}</ul>
</li>`;
    })
    .join("");
  return `<div class="hl-panel" role="tabpanel" id="hl-p-${k}" aria-labelledby="hl-t-${k}" data-hl-panel="${k}"${i === 0 ? "" : " hidden"}>
  <figure class="ld-fig">
    <svg class="ld-svg" viewBox="0 0 640 320" role="img" aria-label="${esc(s.line)}, drawn as a section detail with each layer numbered">${defs(k)}${d.art(k, el)}${marks}</svg>
    <figcaption>${esc(s.line)}. Tap a layer to see its products.</figcaption>
  </figure>
  <ol class="ld-list">${rows}</ol>
</div>`;
}

export function homeLayersMarkup(all: readonly Product[] = PRODUCTS) {
  const jobs = JOBS.map((k) => SYSTEMS.find((s) => s.key === k)).filter((s): s is (typeof SYSTEMS)[number] => Boolean(s));
  const tabs = jobs
    .map(
      (s, i) =>
        `<button type="button" role="tab" class="hl-tab" id="hl-t-${s.key}" aria-controls="hl-p-${s.key}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-hl-tab="${s.key}">${esc(s.name)}</button>`,
    )
    .join("");
  return `<div class="hl" data-hl>
  <div class="hl-jobs" role="tablist" aria-label="Jobs">${tabs}</div>
  ${jobs.map((s, i) => panel(s, i, all)).join("")}
</div>`;
}
