/**
 * The waterproofing page's drawings and interactive parts, all drawn from
 * RPC's methods guide (lib/methods) with nothing added to it:
 *
 *   map       "Where is the water getting in?": a section through a house with
 *             the eight places our services cover marked on it. Pick a place
 *             (on the drawing or from the row of names) and the drawing shows
 *             where that place is protected and which way the water comes, while
 *             the panel beside it says what the place is protected against, the
 *             methods the guide names for it, and how to book an inspection.
 *   compare   any two methods side by side, row by row
 *
 * Without scripts the first place's panel shows and the comparison shows its
 * first pair; everything else on the page is plain reading.
 */
import { METHOD_GROUPS, METHODS, PLACES, type Method } from "../methods/data";
import { AREA_PURPOSE, SERVICE_CATEGORIES } from "../methods/doc";
import type { Product } from "../products";
import { arrow, esc, secHead, serviceSlug } from "./kit";
import { compareRowsHtml, type CmpMethod } from "./methods-compare";

const byNo = (n: number) => METHODS.find((m) => m.no === n);
export const groupLabel = (m: Method) => METHOD_GROUPS.find((g) => g.key === m.group)?.label ?? "";
/** a small drawing for each kind of method */
const GROUP_ICON: Record<string, string> = {
  coat: `<path d="M4 17h16"/><path d="M5 14.5c2-1.6 4-1.6 6 0s4 1.6 6 0 2-1.1 2-1.1"/><rect x="13.5" y="3.5" width="7" height="5" rx="1.2"/><path d="M17 8.5v3"/>`,
  sheet: `<path d="M3.5 16.5h17"/><path d="M5 13.5h9.5l2.5-2.5"/><ellipse cx="18.2" cy="9" rx="1.8" ry="3"/><path d="M5 13.5 7.5 11h9"/>`,
  concrete: `<rect x="3.5" y="6" width="17" height="12" rx="1.5"/><circle cx="8" cy="10.5" r="1"/><circle cx="13.5" cy="13.5" r="1"/><circle cx="16.5" cy="9.5" r=".8"/><circle cx="9.5" cy="15" r=".7"/>`,
  joint: `<rect x="3.5" y="6" width="7.5" height="12" rx="1"/><rect x="13" y="6" width="7.5" height="12" rx="1"/><path d="M12 4v16" stroke-dasharray="2 2"/>`,
};
export const groupIcon = (k: string) =>
  `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${GROUP_ICON[k] ?? GROUP_ICON.coat}</svg>`;

/* ---------------------------------------------------------------- the map */
/** the drawing's frame (in its own units): the sky above the house is trimmed off */
const VB = { x: 0, y: 70, w: 760, h: 460 };
/** where each of the eight places is marked on the drawing, and its short name */
const SPOTS: Readonly<Record<string, { x: number; y: number; short: string }>> = {
  terrace: { x: 400, y: 112, short: "Terrace" },
  bathroom: { x: 440, y: 236, short: "Bathroom" },
  tank: { x: 650, y: 436, short: "Water tank" },
  basement: { x: 330, y: 428, short: "Basement" },
  balcony: { x: 94, y: 238, short: "Balcony" },
  walls: { x: 556, y: 326, short: "Outside wall" },
  podium: { x: 106, y: 308, short: "Garden and podium" },
  cracks: { x: 86, y: 432, short: "Cracks" },
};

/** a small arrow for the way water moves: from (x, y), turned `deg` from straight down */
const flow = (x: number, y: number, deg: number, len = 24) =>
  `<path class="wpx-flow" d="M0 0V${len}M-4.5 ${len - 6.5}L0 ${len}L4.5 ${len - 6.5}" transform="translate(${x} ${y}) rotate(${deg})"/>`;

/**
 * A section through a house, the way an architect draws one: the walls and
 * slabs cut through are hatched, what lies beyond is in fine line. Each of the
 * eight places is a group (data-zone) holding its waterproofing layer (the
 * teal line) and the arrows for the water it keeps out.
 */
function houseDrawing() {
  const cut = `class="wpx-cut"`;
  const fine = `class="wpx-fine"`;
  const coat = (d: string) => `<path class="wpx-coat" d="${d}"/>`;
  return `<svg class="wpx-draw" viewBox="${VB.x} ${VB.y} ${VB.w} ${VB.h}" role="img" aria-labelledby="wpx-dt">
  <title id="wpx-dt">A section through a house with a terrace, a balcony, a bathroom, an outside wall, a garden podium over the basement, a crack in the basement wall, and water tanks on the roof and under the drive</title>
  <defs>
    <pattern id="wpx-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="var(--theme-surface-2)"/><line x1="0" y1="0" x2="0" y2="6" stroke="var(--theme-ink)" stroke-opacity=".22" stroke-width="1"/></pattern>
    <pattern id="wpx-earth" width="16" height="12" patternUnits="userSpaceOnUse"><rect width="16" height="12" fill="var(--theme-surface-2)"/><circle cx="3" cy="3" r="1" fill="var(--theme-ink)" fill-opacity=".16"/><circle cx="11" cy="9" r=".85" fill="var(--theme-ink)" fill-opacity=".12"/></pattern>
    <linearGradient id="wpx-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--theme-on-dark)" stop-opacity="0"/><stop offset="1" stop-color="var(--theme-on-dark)"/></linearGradient>
    <pattern id="wpx-fill" width="9" height="9" patternUnits="userSpaceOnUse"><rect width="9" height="9" fill="var(--theme-surface-2)"/><circle cx="2" cy="2.5" r="1.1" fill="var(--theme-ink)" fill-opacity=".15"/><circle cx="6.5" cy="6.5" r="1.3" fill="var(--theme-ink)" fill-opacity=".1"/></pattern>
  </defs>

  <rect x="0" y="380" width="760" height="150" fill="url(#wpx-earth)"/>
  <rect class="wpx-void" x="52" y="380" width="456" height="94"/>
  <rect class="wpx-void" x="602" y="380" width="96" height="82"/>
  <path class="wpx-gl" d="M0 380H40M520 380H586M714 380H760"/>

  <!-- the basement, its walls and floor cut, and a column under the house wall -->
  <path ${cut} d="M40 380H52V474H508V380H520V486H40Z"/>
  <rect ${cut} x="170" y="380" width="12" height="94"/>
  <path ${fine} d="M64 474H496" stroke-dasharray="10 8"/>

  <!-- the garden podium: a slab over the front of the basement, with planters on it -->
  <path ${cut} d="M40 368H170V380H40Z"/>
  <path class="wpx-planter" d="M54 368V346H100V368M112 368V352H158V368"/>
  <path ${fine} d="M66 346c-7-9-3-20 7-18 2-9 15-8 15 1 8 0 9 12 1 15M124 352c-5-8 0-16 8-14 3-7 13-5 12 3 6 1 6 9 0 11"/>

  <!-- the house -->
  <rect ${cut} x="170" y="370" width="350" height="10"/>
  <rect ${cut} x="170" y="272" width="12" height="98"/>
  <rect ${cut} x="508" y="272" width="12" height="98"/>
  <rect ${cut} x="340" y="272" width="8" height="98"/>
  <path ${cut} d="M120 262H380V280H508V290H380V272H120Z"/>
  <rect ${cut} x="508" y="262" width="12" height="10"/>
  <rect class="wpx-bfill" x="380.5" y="262.5" width="127" height="17"/>
  <path class="wpx-tiles" d="M380 262H508"/>
  <rect ${cut} x="170" y="160" width="12" height="102"/>
  <rect ${cut} x="508" y="160" width="12" height="102"/>
  <rect ${cut} x="340" y="160" width="8" height="102"/>
  <rect ${cut} x="170" y="150" width="350" height="10"/>
  <rect ${cut} x="170" y="124" width="9" height="26"/>
  <rect ${cut} x="511" y="124" width="9" height="26"/>
  <path class="wpx-screed" d="M179 150V144L511 147V150Z"/>
  <g ${fine}>
    <rect x="214" y="300" width="80" height="44"/><path d="M254 300V344"/>
    <rect x="452" y="304" width="40" height="66"/><circle cx="485" cy="338" r="1.5"/>
    <rect x="226" y="184" width="74" height="44"/><path d="M263 184V228"/>
    <path d="M398 262V196H410M410 196V202"/>
    <rect x="466" y="176" width="30" height="18"/>
    <path d="M462 226H490L487 232H465ZM476 232V262"/>
    <path d="M120 262V234M118 234H172M132 262V234M144 262V234M156 262V234"/>
  </g>

  <!-- the overhead tank on the terrace -->
  <path ${cut} d="M210 90H274V96H210Z"/>
  <path ${cut} d="M214 96H220V136H264V96H270V142H214Z"/>
  <rect ${cut} x="218" y="142" width="10" height="3.5"/>
  <rect ${cut} x="256" y="142" width="10" height="3.5"/>
  <path class="wpx-water" d="M220 112c8-2 15 2 22 0s14-2 22 0V136H220Z"/>

  <!-- the sump under the drive -->
  <rect ${cut} x="586" y="372" width="128" height="8"/>
  <rect class="wpx-lid" x="626" y="367" width="28" height="5" rx="1"/>
  <path ${cut} d="M592 380H602V462H698V380H708V472H592Z"/>
  <path class="wpx-water" d="M602 410c13-3 23 3 35 0s23-3 35 0 18 3 26 0V462H602Z"/>

  <!-- the crack in the basement wall -->
  <path class="wpx-crack" d="M46 402l4 8-3 7 4 9-3 8 3 10"/>

  <rect class="wpx-fade" x="0" y="498" width="760" height="33"/>

  <!-- the eight places: where each is protected, and the water it keeps out -->
  <g class="wpx-part" data-zone="terrace">${coat("M180 128V144L510 147V128")}${flow(300, 82, 0, 26)}${flow(350, 82, 0, 26)}${flow(452, 82, 0, 26)}${flow(494, 82, 0, 26)}</g>
  <g class="wpx-part" data-zone="balcony">${coat("M122 260H168V246")}${flow(134, 194, 0, 24)}${flow(158, 194, 0, 24)}</g>
  <g class="wpx-part" data-zone="bathroom">${coat("M382 262V278H506V240")}${flow(398, 296, 0, 22)}${flow(426, 296, 0, 22)}</g>
  <g class="wpx-part" data-zone="walls">${coat("M523 124V370")}${flow(608, 168, 60, 34)}${flow(608, 216, 60, 34)}${flow(608, 264, 60, 34)}</g>
  <g class="wpx-part" data-zone="podium">${coat("M42 366H168")}${flow(72, 290, 0, 24)}${flow(142, 298, 0, 24)}</g>
  <g class="wpx-part" data-zone="basement">${coat("M37 380V489H523V380")}${flow(8, 466, -90, 24)}${flow(552, 418, 90, 24)}${flow(552, 456, 90, 24)}${flow(150, 524, 180, 26)}${flow(300, 524, 180, 26)}${flow(450, 524, 180, 26)}</g>
  <g class="wpx-part" data-zone="cracks">${coat("M46 402l4 8-3 7 4 9-3 8 3 10")}${flow(6, 414, -90, 28)}${flow(6, 438, -90, 28)}</g>
  <g class="wpx-part" data-zone="tank">${coat("M222 98V134H262V98")}${coat("M604 382V460H696V382")}${flow(242, 150, 0, 22)}${flow(588, 424, 90, 22)}${flow(712, 424, -90, 22)}${flow(650, 476, 0, 22)}</g>
</svg>`;
}

function placePanel(key: string, active: boolean) {
  const place = PLACES.find((p) => p.key === key);
  const service = SERVICE_CATEGORIES.find((s) => s.area === key);
  if (!place || !service) return "";
  const ms = place.methods.map(byNo).filter((m): m is Method => Boolean(m));
  const book = `/contact?service=${encodeURIComponent(service.title)}#enquiry`;
  return `<div class="wpx-panel" id="wpx-p-${key}" role="tabpanel" aria-labelledby="wpx-t-${key}" tabindex="0"${active ? "" : " hidden"}>
  <div class="wpx-phead">
    <h3 class="wpx-ph">${esc(place.label)}</h3>
    <p class="wpx-why">${esc(AREA_PURPOSE[key] ?? "")}</p>
  </div>
  <p class="wpx-ml">${ms.length === 1 ? "The method" : "Methods"} our guide names for it</p>
  <ul class="wpx-ms">${ms
    .map(
      (m) =>
        `<li><a href="#m-${m.key}" data-m-go="${m.key}" data-k="${m.group}"><span class="wpx-mt"><span class="wpx-mn">${esc(m.short)}<span class="wpx-sr">, ${esc(groupLabel(m).toLowerCase())}</span></span><span class="wpx-ma">${esc(m.applied)}</span></span><span class="wpx-mk" aria-hidden="true">${esc(groupLabel(m))}</span></a></li>`,
    )
    .join("")}</ul>
  <div class="wpx-acts">
    <a class="pg-btn pg-btn--ink" href="${esc(book)}" data-internal>Book an inspection</a>
    <a class="wpx-more" href="/services#${serviceSlug(service.title)}" data-internal>About ${esc(service.title.toLowerCase())}${arrow}</a>
  </div>
</div>`;
}

export function placeMapMarkup() {
  const keys = SERVICE_CATEGORIES.map((s) => s.area).filter((k) => SPOTS[k]);
  const first = keys[0]!;
  const pct = (v: number, o: number, s: number) => (((v - o) / s) * 100).toFixed(2);
  const spots = keys
    .map((k, i) => {
      const s = SPOTS[k]!;
      return `<button type="button" class="wpx-spot${k === first ? " is-on" : ""}" data-place="${k}" style="left:${pct(s.x, VB.x, VB.w)}%;top:${pct(s.y, VB.y, VB.h)}%" tabindex="-1" aria-hidden="true">${i + 1}</button>`;
    })
    .join("");
  const tabs = keys
    .map(
      (k, i) =>
        `<button type="button" class="wpx-tab" id="wpx-t-${k}" data-place="${k}" role="tab" aria-controls="wpx-p-${k}" aria-selected="${k === first}"${k === first ? "" : ` tabindex="-1"`}><span>${i + 1}</span>${esc(SPOTS[k]!.short)}</button>`,
    )
    .join("");
  // the first place starts marked on the drawing
  const drawing = houseDrawing().replace(`class="wpx-part" data-zone="${first}"`, `class="wpx-part is-on" data-zone="${first}"`);
  return `<section class="wpx-map" id="find" aria-labelledby="wpx-h" data-wpx-map>
  <div class="pg-wrap">
    <div class="wpx-top">
      <h2 class="wpx-h" id="wpx-h">Where is the water getting in?</h2>
      <p class="wpx-hint">Pick a place on the house to see where it is protected and the methods our guide names for it.</p>
    </div>
    <div class="wpx-grid">
      <div class="wpx-stage">
        <div class="wpx-frame"><div class="wpx-art">${drawing}${spots}</div></div>
        <div class="wpx-tabs" role="tablist" aria-label="Places in the house">${tabs}</div>
      </div>
      <div class="wpx-panels">${keys.map((k) => placePanel(k, k === first)).join("")}</div>
    </div>
  </div>
</section>`;
}

/* ---------------------------------------------------------------- compare */
/** a method as the comparison shows it */
export function cmpMethod(m: Method, products: readonly Product[]): CmpMethod {
  return {
    key: m.key,
    short: m.short,
    kind: groupLabel(m),
    applied: m.applied,
    areas: m.areas,
    how: m.how,
    good: m.notes[0],
    mind: m.notes[1],
    products: m.products
      .map((s) => products.find((p) => p.slug === s))
      .filter((p): p is Product => Boolean(p))
      .map((p) => ({ slug: p.slug, name: p.name })),
  };
}

/** a method's name at the head of its column, with the list of all twelve laid over it (invisible) to choose another */
const pickBox = (side: "a" | "b", m: CmpMethod, options: string) =>
  `<label class="wpx-pick" data-pickbox="${side}"><span class="wpx-pickname" data-name="${side}">${esc(m.short)}</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg><select data-slot="${side}" aria-label="${side === "a" ? "First" : "Second"} method">${options}</select></label>`;

/** the twelve methods' facts for the page's scripts (the rain test), as JSON */
export function methodsData(products: readonly Product[]) {
  return `<script type="application/json" data-wpx-data>${JSON.stringify(METHODS.map((m) => cmpMethod(m, products))).replace(/</g, "\\u003c")}</script>`;
}

/** the pair the comparison opens with */
const FIRST_PAIR = ["liquid-membrane", "polyurethane"] as const;

export function compareMarkup(products: readonly Product[]) {
  const data = METHODS.map((m) => cmpMethod(m, products));
  const [ka, kb] = FIRST_PAIR;
  const a = data.find((m) => m.key === ka)!;
  const b = data.find((m) => m.key === kb)!;
  const options = (sel: string) => METHODS.map((m) => `<option value="${m.key}"${m.key === sel ? " selected" : ""}>${esc(m.short)}</option>`).join("");
  return `<section class="pg-sec wpx-cmpsec" id="compare" aria-labelledby="wpx-c-h" data-wpx-compare>
  <div class="pg-wrap">
    ${secHead({ label: "Compare", title: "Two methods, side by side.", id: "wpx-c-h", lede: "Choose any two of the twelve and read them row by row." })}
    <div class="wpx-table" role="table" aria-label="Two methods compared" data-cmp>
      <div class="wpx-row wpx-row--head" role="row">
        <span class="wpx-rh" role="columnheader"><button type="button" class="wpx-swap" data-swap><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8h12l-3.5-3.5M17 16H5l3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>Swap</button></span>
        <span class="wpx-cell" role="columnheader">${pickBox("a", a, options(a.key))}</span>
        <span class="wpx-cell" role="columnheader">${pickBox("b", b, options(b.key))}</span>
      </div>
      <div role="rowgroup" data-cmp-rows>${compareRowsHtml(a, b)}</div>
    </div>
    <script type="application/json" data-wpx-data>${JSON.stringify(data).replace(/</g, "\\u003c")}</script>
  </div>
</section>`;
}

/* ---------------------------------------------------------------- CSS */
export const METHODS_TOOLS_CSS = `
.wpx-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}

/* the map */
.wpx-map{padding:clamp(2rem,5vh,3rem) 0 clamp(3.6rem,9vh,6.5rem);scroll-margin-top:var(--nav-bar,80px)}
.wpx-top{display:flex;flex-direction:column;gap:.35rem;margin-bottom:clamp(1.1rem,2.6vh,1.5rem);padding-top:clamp(1.4rem,3vh,2rem);border-top:1px solid var(--line)}
.wpx-h{margin:0;font-family:var(--display);font-weight:600;font-size:var(--fs-sub);line-height:1.25;letter-spacing:-.01em}
.wpx-hint{margin:0;max-width:36rem;font-size:var(--fs-body);line-height:1.5;color:var(--mute)}
.wpx-grid{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:1.6rem clamp(1.4rem,3vw,2.6rem);align-items:start}
.wpx-stage{min-width:0}
.wpx-frame{padding:clamp(.6rem,1.4vw,1.1rem);border-radius:8px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line)}
.wpx-art{position:relative}
.wpx-draw{display:block;width:100%;height:auto;overflow:visible}
.wpx-cut{fill:url(#wpx-hatch);stroke:var(--theme-ink);stroke-width:1.2;stroke-linejoin:round}
.wpx-fine{fill:none;stroke:var(--theme-ink);stroke-opacity:.34;stroke-width:1}
.wpx-void{fill:var(--card)}
.wpx-fade{fill:url(#wpx-fade)}
.wpx-gl{fill:none;stroke:var(--theme-ink);stroke-width:1.2}
.wpx-planter{fill:var(--theme-surface-2);stroke:var(--theme-ink);stroke-width:1.1}
.wpx-bfill{fill:url(#wpx-fill)}
.wpx-tiles{stroke:var(--theme-ink);stroke-width:1.1;stroke-dasharray:7 3}
.wpx-screed{fill:var(--theme-surface-2);stroke:var(--theme-ink);stroke-width:.9}
.wpx-water{fill:var(--theme-water);fill-opacity:.2}
.wpx-lid{fill:var(--theme-ink-2)}
.wpx-crack{fill:none;stroke:var(--theme-ink);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.wpx-coat{fill:none;stroke:var(--theme-water);stroke-opacity:.28;stroke-width:3.5;stroke-linecap:round;stroke-linejoin:round;transition:stroke-opacity .25s,stroke-width .25s}
.wpx-flow{fill:none;stroke:var(--theme-primary);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;opacity:0;transition:opacity .25s}
.wpx-part.is-on .wpx-coat{stroke-opacity:1;stroke-width:5.5}
.wpx-part.is-on .wpx-flow{opacity:1}
.wpx-spot{position:absolute;display:grid;place-items:center;width:2rem;height:2rem;margin:-1rem 0 0 -1rem;padding:0;border:0;border-radius:50%;background:var(--card);box-shadow:0 0 0 1.5px var(--navy),0 6px 14px -6px color-mix(in srgb,var(--theme-primary-dark) 55%,transparent);font:inherit;font-size:var(--fs-body);font-weight:600;line-height:1;color:var(--navy);cursor:pointer;transition:background-color .2s,color .2s,transform .2s}
.wpx-spot:hover{transform:scale(1.08)}
.wpx-spot.is-on{background:var(--navy);color:var(--theme-on-dark)}
.wpx-tabs{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.9rem}
.wpx-tab{display:inline-flex;align-items:center;gap:.5rem;height:2.4rem;padding:0 .95rem 0 .35rem;border:0;border-radius:6px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);font:inherit;font-size:var(--fs-body);font-weight:500;color:var(--ink);white-space:nowrap;cursor:pointer;transition:background-color .2s,color .2s,box-shadow .2s}
.wpx-tab span{display:grid;place-items:center;width:1.7rem;height:1.7rem;border-radius:50%;background:var(--sand-2);font-weight:600;font-variant-numeric:tabular-nums}
.wpx-tab:hover{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 45%,transparent)}
.wpx-tab[aria-selected="true"]{background:var(--navy);box-shadow:none;color:var(--theme-on-dark)}
.wpx-tab[aria-selected="true"] span{background:var(--theme-surface);color:var(--navy)}
.wpx-tab:focus-visible,.wpx-panel:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.wpx-panel{padding:clamp(1.3rem,2.2vw,1.8rem);border-radius:8px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line),0 30px 60px -48px color-mix(in srgb,var(--theme-ink) 50%,transparent)}
.wpx-ph{margin:0;font-family:var(--display);font-weight:600;font-size:var(--fs-sub);line-height:1.2;letter-spacing:-.01em}
.wpx-why{margin:.5rem 0 0;font-size:var(--fs-body);line-height:1.6;color:var(--ink2)}
.wpx-ml{margin:1.2rem 0 .4rem;font-size:var(--fs-body);font-weight:600;color:var(--accent)}
.wpx-ms{margin:0;padding:0;list-style:none;border-top:1px solid var(--line)}
.wpx-ms li{border-bottom:1px solid var(--line)}
.wpx-ms a{display:grid;grid-template-columns:2.2rem minmax(0,1fr) auto;align-items:center;column-gap:.8rem;padding:.65rem .1rem;color:var(--ink);text-decoration:none}
.wpx-mi{display:grid;place-items:center;width:2.2rem;height:2.2rem;border-radius:4px;background:color-mix(in srgb,var(--theme-ink) 5%,transparent);color:var(--ink2)}
.wpx-mi svg{width:1.25rem;height:1.25rem}
.wpx-mt{display:flex;flex-direction:column;min-width:0}
.wpx-mn{font-size:var(--fs-body);font-weight:600;line-height:1.35}
.wpx-ma{font-size:var(--fs-body);line-height:1.4;color:var(--mute)}
.wpx-ms .pg-ar{color:var(--mute);transition:transform .2s,color .2s}
.wpx-ms a:hover .pg-ar{color:var(--ink);transform:translateY(2px)}
.wpx-ms a:hover .wpx-mn{text-decoration:underline;text-underline-offset:3px}
.wpx-acts{display:flex;flex-wrap:wrap;align-items:center;gap:.8rem 1.4rem;margin-top:1.3rem}

/* two methods side by side */
.wpx-table{border-radius:8px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line)}
.wpx-row{display:grid;grid-template-columns:10.5rem minmax(0,1fr) minmax(0,1fr);gap:.5rem 1.4rem;padding:.95rem clamp(1rem,2vw,1.6rem);border-top:1px solid var(--line)}
.wpx-row--head{position:relative;z-index:5;align-items:center;border-top:0;border-radius:8px 8px 0 0;background:var(--navy)}
.wpx-rh{font-size:var(--fs-body);color:var(--mute)}
.wpx-cell{min-width:0;font-size:var(--fs-body);line-height:1.55;color:var(--ink)}
.wpx-cell--both{grid-column:2 / -1}
.wpx-both{display:inline-flex;align-items:center;height:1.6rem;margin-right:.55rem;padding:0 .5rem;border-radius:6px;background:var(--sky);font-weight:600;color:var(--water)}
.wpx-pick{position:relative;display:flex;align-items:center;justify-content:space-between;gap:.7rem;min-height:3.1rem;padding:.55rem 1rem;border-radius:6px;background:color-mix(in srgb,var(--theme-white) 8%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-white) 16%,transparent);color:var(--theme-on-dark);cursor:pointer;transition:background-color .2s,box-shadow .3s}
.wpx-pick:hover{background:color-mix(in srgb,var(--theme-white) 14%,transparent)}
.wpx-pick.is-new{box-shadow:inset 0 0 0 2px var(--theme-white)}
.wpx-pick:has(select:focus-visible){outline:2px solid var(--theme-white);outline-offset:2px}
.wpx-pickname{min-width:0;font-family:var(--display);font-size:var(--fs-sub);font-weight:600;line-height:1.2;letter-spacing:-.01em}
.wpx-pick svg{flex:none;width:15px;height:15px}
.wpx-pick select{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;font-size:16px;color:var(--theme-dark);background:var(--theme-white);cursor:pointer;appearance:none}
.wpx-swap{display:inline-flex;align-items:center;gap:.5rem;height:3.1rem;padding:0 1rem 0 .85rem;border:0;border-radius:6px;background:none;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-white) 16%,transparent);font:inherit;font-size:var(--fs-body);font-weight:600;color:var(--theme-on-dark);cursor:pointer;transition:background-color .2s}
.wpx-swap svg{width:20px;height:20px;transition:transform .3s}
.wpx-swap:hover{background:color-mix(in srgb,var(--theme-white) 10%,transparent)}
.wpx-swap:hover svg{transform:rotate(180deg)}
.wpx-swap:focus-visible{outline:2px solid var(--theme-white);outline-offset:2px}
/* the method picker: a panel of the twelve, grouped by kind (with scripts; the plain select without) */
.wpx-js .wpx-pick select{display:none}
.wpx-js .wpx-pick:focus-visible{outline:2px solid var(--theme-white);outline-offset:2px}
.wpx-js .wpx-pick[aria-expanded=true]{background:var(--theme-surface);box-shadow:none;color:var(--navy)}
.wpx-js .wpx-pick[aria-expanded=true] svg{transform:rotate(180deg)}
.wpx-pick svg{transition:transform .25s}
.wpx-row--head .wpx-cell{position:relative}
.wpx-menu{position:absolute;top:calc(100% + .55rem);left:0;z-index:30;width:min(40rem,calc(100vw - 2rem));padding:.6rem;border-radius:14px;background:var(--card);box-shadow:0 0 0 1px color-mix(in srgb,var(--theme-ink) 12%,transparent),0 30px 60px -24px color-mix(in srgb,var(--theme-shadow) 55%,transparent),0 8px 18px -10px color-mix(in srgb,var(--theme-shadow) 30%,transparent);color:var(--ink)}
.wpx-menu--b{left:auto;right:0}
.wpx-menu[hidden]{display:none}
.wpx-mcols{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.4rem}
.wpx-mcol{display:flex;flex-direction:column;gap:.4rem}
.wpx-mgroup{display:flex;flex-direction:column;gap:2px;padding:.45rem;border-radius:10px;background:color-mix(in srgb,var(--theme-ink) 3.5%,transparent)}
.wpx-mg{margin:0 0 .25rem;padding:.1rem .55rem 0;font-size:var(--fs-body);font-weight:600;color:var(--mute)}
.wpx-opt{display:grid;grid-template-columns:minmax(0,1fr) auto 1.1rem;align-items:center;gap:.6rem;width:100%;min-height:3.1rem;padding:.45rem .6rem;border:0;border-radius:8px;background:none;font:inherit;color:var(--ink);text-align:left;cursor:pointer;transition:background-color .15s,color .15s}
.wpx-opt:hover,.wpx-opt:focus-visible{background:var(--card);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 14%,transparent);outline:none}
.wpx-opt:focus-visible{box-shadow:inset 0 0 0 2px var(--accent)}
.wpx-otx{display:flex;flex-direction:column;min-width:0}
.wpx-on{font-size:var(--fs-body);font-weight:600;line-height:1.3}
.wpx-oa{font-size:var(--fs-body);line-height:1.35;color:var(--mute)}
.wpx-otag{display:grid;place-items:center;width:1.5rem;height:1.5rem;border-radius:50%;box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--theme-ink) 30%,transparent);font-size:var(--fs-body);font-weight:700;line-height:1;color:var(--ink2)}
.wpx-otag:empty{visibility:hidden}
.wpx-otick{display:grid;place-items:center;color:transparent}
.wpx-otick svg{width:16px;height:16px}
.wpx-opt[aria-selected=true]{background:var(--navy);box-shadow:none;color:var(--theme-white)}
.wpx-opt[aria-selected=true] .wpx-oa{color:color-mix(in srgb,var(--theme-white) 70%,transparent)}
.wpx-opt[aria-selected=true] .wpx-otick{color:var(--theme-on-dark)}

/* the rows: what each row is about on a quiet band, the two methods on either side */
.wpx-row:not(.wpx-row--head){align-items:start}
.wpx-row:not(.wpx-row--head) .wpx-rh{font-weight:600;color:var(--ink2)}
.wpx-row:not(.wpx-row--head):nth-child(even){background:color-mix(in srgb,var(--theme-ink) 2.5%,transparent)}
.wpx-row:not(.wpx-row--head):hover{background:color-mix(in srgb,var(--theme-primary) 5%,transparent)}
[data-cmp-rows] .wpx-row:last-child{border-radius:0 0 8px 8px}
/* the place's box, simple: its name on a dark band, its methods as plain rows with a line between, then the booking button and a link */
.wpx-panel{padding:0;overflow:hidden;border-radius:14px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line)}
.wpx-phead{padding:1.1rem 1.3rem 1.15rem;background:var(--navy);color:var(--theme-on-dark)}
.wpx-panel .wpx-ph{margin:0;padding:0;background:none;color:var(--theme-on-dark)}
.wpx-panel .wpx-why{margin:.3rem 0 0;padding:0;background:none;font-size:var(--fs-body);line-height:1.45;color:color-mix(in srgb,var(--theme-on-dark) 75%,transparent)}
.wpx-panel .wpx-ml{margin:0;padding:1rem 1.3rem .25rem;font-size:var(--fs-body);font-weight:600;color:var(--mute)}
.wpx-panel .wpx-ms{display:block;margin:0 1.3rem;padding:0;border:0;background:none;box-shadow:none}
.wpx-panel .wpx-ms li{border:0;border-bottom:1px solid var(--line);box-shadow:none}
.wpx-panel .wpx-ms li:last-child{border-bottom:0}
.wpx-panel .wpx-ms a{--k:var(--theme-primary);display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.65rem 0;border-radius:0;background:none;box-shadow:none}
.wpx-panel .wpx-ms a[data-k=sheet]{--k:#a35f10}
.wpx-panel .wpx-ms a[data-k=concrete]{--k:#1f7a4f}
.wpx-panel .wpx-ms a[data-k=joint]{--k:#6a4c9c}
.wpx-panel .wpx-ms a:hover{background:none;box-shadow:none}
.wpx-panel .wpx-ms a:hover .wpx-mn{text-decoration:underline;text-underline-offset:3px;text-decoration-color:color-mix(in srgb,var(--theme-ink) 35%,transparent)}
.wpx-panel .wpx-ms a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.wpx-panel .wpx-mt{min-width:0}
.wpx-panel .wpx-mn{font-weight:600;line-height:1.3;color:var(--ink)}
.wpx-panel .wpx-ma{overflow:hidden;line-height:1.4;text-overflow:ellipsis;white-space:nowrap}
.wpx-mk{flex:none;display:inline-flex;align-items:center;gap:.35rem;font-size:var(--fs-body);color:var(--mute);white-space:nowrap}
.wpx-mk::before{content:"";width:.4rem;height:.4rem;border-radius:50%;background:var(--k,var(--theme-primary))}
.wpx-panel .wpx-acts{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.6rem 1rem;margin:.4rem 0 0;padding:.9rem 1.3rem 1rem;border-top:1px solid var(--line)}
.wpx-panel .wpx-acts .pg-btn{height:2.6rem;padding:0 1.1rem}
.wpx-more{display:inline-flex;align-items:center;gap:.3rem;font-size:var(--fs-body);font-weight:600;color:var(--ink);text-decoration:underline;text-decoration-color:color-mix(in srgb,var(--theme-ink) 25%,transparent);text-underline-offset:4px;transition:text-decoration-color .2s}
.wpx-more:hover{text-decoration-color:currentColor}
.wpx-more .pg-ar{width:.9rem;height:.9rem}
@media (max-width:479px){.wpx-mk{display:none}.wpx-panel .wpx-ma{white-space:normal}.wpx-panel .wpx-acts .pg-btn{width:100%}.wpx-more{margin-inline:auto}}
.wpx-prods{display:flex;flex-wrap:wrap;gap:.35rem}
.wpx-prods a{display:inline-flex;align-items:center;min-height:2rem;padding:.25rem .7rem;line-height:1.3;border-radius:8px;background:var(--navy);color:var(--theme-on-dark);font-weight:600;text-decoration:none}
.wpx-prods a:hover{background:var(--accent)}
.wpx-none{color:var(--mute)}

@media (max-width:1023px){
  .wpx-grid{grid-template-columns:minmax(0,1fr)}
}
@media (max-width:767px){
  .wpx-frame{margin-inline:calc(-1 * var(--gutter,16px));padding:.5rem .25rem;border-radius:0;box-shadow:inset 0 1px 0 var(--line),inset 0 -1px 0 var(--line)}
  .wpx-spot{width:1.5rem;height:1.5rem;margin:-.75rem 0 0 -.75rem}
  .wpx-tabs{flex-wrap:nowrap;overflow-x:auto;margin-inline:calc(-1 * var(--gutter,16px));padding:0 var(--gutter,16px) 2px;scrollbar-width:none}
  .wpx-tabs::-webkit-scrollbar{display:none}
  .wpx-tab{flex:none}
  .wpx-row{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:.35rem .9rem;padding:.85rem 1rem}
  .wpx-row .wpx-rh{grid-column:1 / -1}
  .wpx-cell--both{grid-column:1 / -1}
  .wpx-row--head{gap:.5rem;align-items:stretch}
  .wpx-row--head .wpx-rh{grid-row:2}
  .wpx-pick{min-height:2.9rem;padding:.5rem .7rem;gap:.4rem}
  .wpx-pickname{font-size:var(--fs-body)}
  .wpx-swap{width:100%;height:2.4rem;justify-content:center}
  .wpx-menu{position:fixed;top:auto;bottom:.75rem;left:.75rem!important;right:.75rem!important;width:auto;max-height:72vh;overflow:auto}
  .wpx-mcols{grid-template-columns:minmax(0,1fr)}
}
`;
