/**
 * The home page's opening screen: the words on the left (what we do, where,
 * the free inspection and WhatsApp), and on the right an architect's
 * section through a house and its sump, with the four surfaces we waterproof
 * drawn in water-blue and numbered, and what goes on each one. The brands we
 * supply close it. Light sand ground, the site's ink, three type sizes, no
 * loading screen and no animation; every word is rendered on the server.
 */

export interface LandingBrand {
  key: string;
  name: string;
  count: number;
}
export interface LandingData {
  whatsapp: string;
  phone: string;
  brands: readonly LandingBrand[];
  productCount: number;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const arrow = `<svg class="ld-ar" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const wa = `<svg class="ld-wa" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.2a9.7 9.7 0 0 0-8.35 14.65L2.3 21.7l4.98-1.3A9.7 9.7 0 1 0 12 2.2zm0 17.7a8 8 0 0 1-4.08-1.12l-.3-.17-2.95.77.79-2.88-.19-.3A8 8 0 1 1 12 19.9zm4.4-5.97c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06a6.6 6.6 0 0 1-1.94-1.2 7.3 7.3 0 0 1-1.34-1.67c-.14-.24 0-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46a.88.88 0 0 0-.64.3 2.7 2.7 0 0 0-.84 2c0 1.18.86 2.32.98 2.48.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.1.16 1.52.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"/></svg>`;

/* ------------------------------------------------------------ shared parts */
const line = `<p class="ld-line">Waterproofing and construction in Erode, since 2012</p>`;
const title = (id: string) => `<h1 class="ld-h1" id="${id}">Dry buildings, from the terrace to the&nbsp;sump.</h1>`;
const lede = `<p class="ld-lede">We trace a leak to where the water gets in, seal each surface with the system that suits it, and build homes, offices and factories with the waterproofing designed in, across Erode, Coimbatore, Krishnagiri and&nbsp;Chennai.</p>`;
const ctas = (d: LandingData) => `<div class="ld-cta">
  <a class="ld-btn ld-btn--ink" href="/contact#enquiry" data-internal>Book a free inspection${arrow}</a>
  <a class="ld-btn ld-btn--line" href="${esc(d.whatsapp)}" target="_blank" rel="noopener noreferrer">${wa}WhatsApp us</a>
</div>`;
const brands = (d: LandingData) => `<div class="ld-brands">
  <p class="ld-bk" id="ld-bk">Products we supply from</p>
  <ul aria-labelledby="ld-bk">${d.brands.map((b) => `<li><a href="/products#brand-${esc(b.key)}" data-internal title="${b.count} ${esc(b.name)} products on our list">${esc(b.name)}</a></li>`).join("")}</ul>
  <a class="ld-all" href="/products" data-internal>All ${d.productCount} products${arrow}</a>
</div>`;

/* ------------------------------------------------------------ a: the drawing */
/** what goes on each waterproofed surface (the waterproofing service's own list) */
const SURFACES = [
  ["Terraces and roofs", "PU or torch-on membrane"],
  ["Bathrooms and kitchens", "Two coats, pond-tested"],
  ["External walls", "Waterproof plaster and elastomeric paint"],
  ["Sumps, tanks and basements", "Crystalline and HDPE"],
] as const;

const mark = (n: number, x: number, y: number) =>
  `<g class="ld-mk" transform="translate(${x} ${y})"><circle r="12"/><text y="5.5" text-anchor="middle">${n}</text></g>`;

/** a section through a two-storey house and its sump: cut concrete hatched, what is beyond in fine lines, the waterproofing in water-blue */
function sectionDrawing() {
  const cut = `fill="url(#ld-hatch)" stroke="#12223b" stroke-width="1.3" stroke-linejoin="round"`;
  const fine = `fill="none" stroke="#12223b" stroke-opacity=".38" stroke-width="1"`;
  const coat = `fill="none" stroke="#0b6e80" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"`;
  return `<svg class="ld-draw" viewBox="0 0 800 600" role="img" aria-labelledby="ld-dt">
  <title id="ld-dt">A section through a two-storey house and its underground sump, with the terrace, a bathroom floor, the outside wall and the sump marked as the four places that are waterproofed</title>
  <defs>
    <pattern id="ld-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="#e6dece"/><line x1="0" y1="0" x2="0" y2="7" stroke="#12223b" stroke-opacity=".22" stroke-width="1"/></pattern>
    <pattern id="ld-earth" width="14" height="11" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="3" r="1" fill="#12223b" fill-opacity=".2"/><circle cx="9.5" cy="8.5" r=".8" fill="#12223b" fill-opacity=".14"/><path d="M6 2.5h2.5" stroke="#12223b" stroke-opacity=".14" stroke-width="1"/></pattern>
    <pattern id="ld-fill" width="9" height="9" patternUnits="userSpaceOnUse"><rect width="9" height="9" fill="#e9e1d1"/><circle cx="2" cy="2.5" r="1.1" fill="#12223b" fill-opacity=".16"/><circle cx="6.5" cy="6.5" r="1.4" fill="#12223b" fill-opacity=".12"/></pattern>
    <linearGradient id="ld-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <mask id="ld-earthmask"><rect x="0" y="452" width="800" height="148" fill="url(#ld-fade)"/></mask>
  </defs>
  <!-- the ground -->
  <rect x="10" y="452" width="780" height="148" fill="url(#ld-earth)" mask="url(#ld-earthmask)"/>
  <path d="M10 452H140M580 452H614M746 452H790" stroke="#12223b" stroke-width="1.3"/>
  <!-- a tree, for scale -->
  <g ${fine}><path d="M72 452V396"/><circle cx="72" cy="366" r="32"/><circle cx="72" cy="366" r="22" stroke-opacity=".5"/></g>
  <!-- foundations -->
  <path d="M142 452h16v68h24v16h-64v-16h24z" ${cut}/>
  <path d="M354 452h12v68h20v16h-52v-16h20z" ${cut}/>
  <path d="M562 452h16v68h24v16h-64v-16h24z" ${cut}/>
  <!-- plinth, walls and slabs, cut -->
  <rect x="140" y="436" width="440" height="16" ${cut}/>
  <rect x="140" y="318" width="12" height="118" ${cut}/>
  <rect x="568" y="318" width="12" height="118" ${cut}/>
  <rect x="356" y="318" width="8" height="118" ${cut}/>
  <path d="M140 306H420V326H568V338H420V318H140Z" ${cut}/>
  <path d="M568 306H580V318H568Z" ${cut}/>
  <rect x="140" y="172" width="12" height="134" ${cut}/>
  <rect x="568" y="172" width="12" height="134" ${cut}/>
  <rect x="356" y="172" width="8" height="134" ${cut}/>
  <rect x="140" y="160" width="440" height="12" ${cut}/>
  <rect x="140" y="128" width="10" height="32" ${cut}/>
  <rect x="570" y="128" width="10" height="32" ${cut}/>
  <!-- the bathroom's sunken floor, filled and tiled -->
  <rect x="420" y="306" width="148" height="20" fill="url(#ld-fill)"/>
  <path d="M420 306H568" stroke="#12223b" stroke-width="1.3" stroke-dasharray="7 3"/>
  <!-- the terrace screed, laid to fall -->
  <path d="M150 160V153L570 157V160Z" fill="#efe8da" stroke="#12223b" stroke-width="1"/>
  <!-- the overhead tank on its stand -->
  <rect x="196" y="150" width="62" height="5" ${cut}/>
  <rect x="204" y="102" width="46" height="48" rx="6" fill="#26313f"/>
  <ellipse cx="227" cy="102" rx="15" ry="4" fill="#3a4656"/>
  <path d="M206 116H248M206 128H248M206 140H248" stroke="#5a6676" stroke-width="1"/>
  <!-- beyond the cut: windows, a door, a ventilator, the shower -->
  <g ${fine}>
    <rect x="196" y="352" width="110" height="54"/><path d="M251 352v54"/>
    <rect x="196" y="206" width="110" height="58"/><path d="M251 206v58"/>
    <rect x="430" y="346" width="52" height="90"/><circle cx="474" cy="392" r="2"/>
    <rect x="468" y="196" width="44" height="22"/><path d="M468 203h44M468 210h44"/>
  </g>
  <!-- the sump, under the drive -->
  <path d="M614 440H746V452H614Z" ${cut}/>
  <rect x="648" y="434" width="44" height="6" rx="1" fill="#26313f"/>
  <path d="M620 452H630V550H730V452H740V560H620Z" ${cut}/>
  <path d="M632 484c12-3 22 3 34 0s22-3 34 0 18 3 28 0V548H632Z" fill="#0b6e80" fill-opacity=".14"/>
  <path d="M632 484c12-3 22 3 34 0s22-3 34 0 18 3 28 0" fill="none" stroke="#0b6e80" stroke-opacity=".55" stroke-width="1.2"/>
  <path d="M664 452v10M664 470v8" stroke="#12223b" stroke-opacity=".38"/>
  <!-- the waterproofing -->
  <path d="M150 137V153L570 157V137" ${coat}/>
  <path d="M422 306V324H566V292" ${coat}/>
  <path d="M583 128V436" ${coat}/>
  <path d="M632 454V548H728V454" ${coat}/>
  ${mark(1, 360, 136)}
  ${mark(2, 494, 290)}
  ${mark(3, 606, 236)}
  ${mark(4, 704, 512)}
</svg>`;
}

function opening(d: LandingData) {
  return `<div class="ld-wrap ld-grid">
  <div class="ld-copy">
    ${line}
    ${title("ld-t")}
    ${lede}
    ${ctas(d)}
  </div>
  <figure class="ld-fig">
    ${sectionDrawing()}
    <figcaption>
      <ol class="ld-key">${SURFACES.map(([where, how], i) => `<li><span class="ld-n">${i + 1}</span><span><b>${where}</b>${how}</span></li>`).join("")}</ol>
    </figcaption>
  </figure>
</div>
<div class="ld-wrap">${brands(d)}</div>`;
}

export function landingMarkup(d: LandingData) {
  return `<section class="ld" aria-labelledby="ld-t">${opening(d)}</section>`;
}

export const LANDING_CSS = `
.ld{--paper:#ece6da;--card:#f5f0e6;--ink:#12223b;--mute:#5b6271;--line:rgba(18,34,59,.14);--navy:#0b2350;--accent:#2756a0;--water:#0b6e80;
  position:relative;z-index:10;display:flex;flex-direction:column;justify-content:center;box-sizing:border-box;min-height:100vh;min-height:100svh;
  padding:calc(var(--nav-h,64px) + clamp(1.5rem,6svh,4.5rem)) 0 clamp(1.2rem,3.5svh,2.4rem);background:var(--paper);color:var(--ink);font-family:var(--font-inter-tight),ui-sans-serif,system-ui,sans-serif}
.ld-wrap{box-sizing:border-box;width:100%;max-width:1600px;margin:0 auto;padding-inline:var(--gutter,3rem)}
.ld-line{margin:0;font-size:var(--fs-body);font-weight:500;color:var(--mute);text-wrap:balance}
.ld-h1{margin:min(1.1rem,2svh) 0 0;font-family:var(--font-instrument),var(--font-inter-tight),system-ui,sans-serif;font-weight:600;font-size:var(--fs-title);line-height:1.08;letter-spacing:-.025em;text-wrap:balance;max-width:15ch}
.ld-lede{margin:min(1.1rem,2svh) 0 0;max-width:34rem;font-size:var(--fs-sub);line-height:1.5;color:var(--mute);text-wrap:pretty}
.ld-cta{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:min(2rem,3.6svh)}
.ld-btn{display:inline-flex;align-items:center;gap:.6rem;height:3.25rem;padding:0 1.5rem;border-radius:10px;font-size:var(--fs-body);font-weight:600;text-decoration:none;white-space:nowrap;transition:background-color .2s,border-color .2s,color .2s}
.ld-btn--ink{background:var(--navy);color:#f5f0e6}
.ld-btn--ink:hover{background:var(--accent)}
.ld-btn--line{box-shadow:inset 0 0 0 1.5px rgba(18,34,59,.26);color:var(--ink)}
.ld-btn--line:hover{box-shadow:inset 0 0 0 1.5px var(--navy)}
.ld-btn:focus-visible,.ld a:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.ld-ar{width:14px;height:14px;flex:none}
.ld-wa{width:18px;height:18px;flex:none;color:#128c4b}
.ld-brands{display:flex;flex-wrap:wrap;align-items:center;gap:.6rem 2rem;margin-top:min(2.4rem,4.4svh);padding-top:min(1.2rem,2.2svh);border-top:1px solid var(--line)}
.ld-bk{margin:0;font-size:var(--fs-body);color:var(--mute)}
.ld-brands ul{display:flex;flex-wrap:wrap;gap:.4rem 2rem;margin:0;padding:0;list-style:none}
.ld-brands li a{font-size:var(--fs-sub);font-weight:600;letter-spacing:-.01em;color:rgba(18,34,59,.62);text-decoration:none;transition:color .2s}
.ld-brands li a:hover{color:var(--ink)}
.ld-all{display:inline-flex;align-items:center;gap:.45rem;margin-left:auto;font-size:var(--fs-body);font-weight:600;color:var(--ink);text-decoration:none;border-bottom:1px solid rgba(18,34,59,.3);padding-bottom:2px}
.ld-all:hover{border-color:var(--ink)}

/* the drawing and its key */
.ld-grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);align-items:center;gap:clamp(2rem,5vw,6rem)}
.ld-fig{margin:0;min-width:0}
.ld-draw{display:block;width:100%;height:auto;max-height:min(30rem,56svh)}
.ld-mk circle{fill:var(--navy)}
.ld-mk text{fill:#f5f0e6;font-family:var(--font-inter-tight),system-ui,sans-serif;font-size:16px;font-weight:600}
.ld-key{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.8rem 1.6rem;margin:min(1.2rem,2svh) 0 0;padding:0;list-style:none}
.ld-key li{display:flex;gap:.7rem;font-size:var(--fs-body);line-height:1.4}
.ld-key b{display:block;font-weight:600}
.ld-key span:last-child{color:var(--mute)}
.ld-key b{color:var(--ink)}
.ld-n{display:grid;place-items:center;flex:none;width:1.6rem;height:1.6rem;border-radius:50%;background:var(--navy);color:#f5f0e6;font-weight:600;font-variant-numeric:tabular-nums}

/* laptops with short screens: a little tighter, so the opening fits one screen */
@media (min-width:1024px) and (max-height:820px){
  .ld{padding-top:calc(var(--nav-h,64px) + 1.4rem)}
  .ld-draw{max-height:50svh}
  .ld-key{gap:.55rem 1.4rem;margin-top:.8rem}
  .ld-brands{margin-top:1.4rem;padding-top:.9rem}
}
/* tablets: one column */
@media (max-width:1023px){
  .ld-grid{grid-template-columns:minmax(0,1fr);gap:min(2.4rem,4svh)}
  .ld-draw{max-height:none}
}
/* phones */
@media (max-width:767px){
  .ld{justify-content:flex-start;padding-top:calc(var(--nav-h,60px) + 2.2rem)}
  .ld-key{grid-template-columns:minmax(0,1fr)}
  .ld-btn{flex:1 1 auto;justify-content:center}
  .ld-brands ul{gap:.3rem 1.2rem}
  .ld-all{margin-left:0}
}
`;
