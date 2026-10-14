/**
 * The rain test, on the waterproofing page: a slab cut through, with a hairline
 * crack in it. Pick one of the twelve methods (or none) and watch water meet
 * the slab: with none it finds the crack and drips into the room below; with a
 * method it stops where that method works, as RPC's methods document describes
 * it (on the surface, on the outside face against the soil, inside the
 * concrete, inside the crack, or at the joint between pours). Methods made for
 * roofs and wet rooms are shown with rain from above; those made for basements
 * and foundations with ground water from below (the drawing turns over).
 *
 * A drawing to show the idea, not a test result. Integral admixtures, which the
 * document says do not seal cracks on their own, leave the crack leaking.
 */
import { METHOD_GROUPS, METHODS } from "../methods/data";
import { esc, mark, words } from "./kit";

/** where a method stops the water, and which way the water comes */
type Layer = "coat" | "sheet" | "outer" | "crystal" | "integral" | "inject" | "joint";
export const RAIN: Record<string, { from: "above" | "ground"; layer: Layer }> = {
  cementitious: { from: "above", layer: "coat" },
  "liquid-membrane": { from: "above", layer: "coat" },
  polyurethane: { from: "above", layer: "coat" },
  acrylic: { from: "above", layer: "coat" },
  polyurea: { from: "above", layer: "coat" },
  "torch-on": { from: "above", layer: "sheet" },
  injection: { from: "above", layer: "inject" },
  bituminous: { from: "ground", layer: "outer" },
  hdpe: { from: "ground", layer: "outer" },
  crystalline: { from: "ground", layer: "crystal" },
  integral: { from: "ground", layer: "integral" },
  waterstops: { from: "ground", layer: "joint" },
};

/** where the water stops, in a line, from what the document says each method does */
export const WHERE: Record<Layer | "none", string> = {
  none: "With nothing on it, water finds the hairline crack and comes through to the ceiling below.",
  coat: "On the surface: a coat over the slab and its hairline crack, so the water stays on top.",
  sheet: "On the surface: sheets lapped and sealed over the slab, so the water stays on top.",
  outer: "On the outside face, against the soil, so ground water never reaches the concrete.",
  crystal: "Inside the concrete: crystals grow in its pores and in the hairline crack, and block the water there.",
  integral: "Through the whole concrete, which lets less water in. The crack still needs its own treatment.",
  inject: "Inside the crack: resin pumped in seals the leak from within.",
  joint: "At the joint between two pours: the waterstop cast into it seals the weakest line.",
};

const W = 800;
const FACE = 170; // the slab's outer face
const BASE = 290; // its inner face (the ceiling of the room)
const CRACK = 304;
/** the drops: two staggered rows of columns, two of them over the crack */
const DROPS = [...Array.from({ length: 16 }, (_, i) => 40 + i * 48), ...Array.from({ length: 16 }, (_, i) => 64 + i * 48), CRACK];

export function rainMarkup() {
  const chips = METHOD_GROUPS.map(
    (g) =>
      `<div class="rt-group rt-group--${g.key}"><p>${esc(g.label)}</p><div>${METHODS.filter((m) => m.group === g.key && RAIN[m.key])
        .map((m) => `<button type="button" class="rt-chip" data-rain="${m.key}" aria-pressed="false">${esc(m.short)}</button>`)
        .join("")}</div></div>`,
  ).join("");
  const crack = `M${CRACK} ${FACE} l-3 18 5 16 -4 20 5 18 -3 22 3 16`;
  const drops = DROPS.map(
    (x, i) =>
      `<g transform="translate(${x} 0)"><ellipse class="rt-drop${x === CRACK ? " rt-drop--crack" : ""}" rx="2.1" ry="5.2" cy="6" style="--delay:${(((i * 37) % 32) / 20).toFixed(2)}s"/></g>`,
  ).join("");
  // the page's one deep-blue band, its top edge a soft wave (water)
  return `<section class="pg-sec pg-band pg-wave-top rt-sec" id="rain-test" aria-labelledby="rt-h" data-rain-test>
  <div class="pg-wrap">
    <header class="pg-shead rt-head">
      ${mark("03", "Rain test")}
      <h2 class="pg-h2" id="rt-h" data-rv="words">${words(esc("See where each method stops the water."), 4)}</h2>
      <p class="pg-lede" data-rv>Pick a method and watch water meet a slab with a hairline crack in it. A drawing to show the idea: the right method for your building is chosen on site.</p>
    </header>
    <div class="rt">
      <div class="rt-pick" role="group" aria-label="Choose a method">
        <div class="rt-group rt-group--none"><p>Start with</p><div><button type="button" class="rt-chip" data-rain="none" aria-pressed="true">No waterproofing</button></div></div>
        ${chips}
      </div>
      <figure class="rt-stage">
        <svg class="rt-svg" viewBox="0 0 ${W} 420" preserveAspectRatio="xMinYMid slice" role="img" aria-labelledby="rt-cap">
          <defs>
            <pattern id="rt-conc" width="22" height="22" patternUnits="userSpaceOnUse"><rect width="22" height="22" fill="#b9b3a8"/><circle cx="4" cy="5" r="1.2" fill="#9d978c"/><circle cx="15" cy="9" r=".9" fill="#a8a296"/><circle cx="9" cy="17" r="1.4" fill="#cfc9be"/><circle cx="19" cy="19" r=".8" fill="#948e83"/></pattern>
            <pattern id="rt-soil" width="26" height="26" patternUnits="userSpaceOnUse"><rect width="26" height="26" fill="#b49a76"/><circle cx="6" cy="6" r="1.6" fill="#9c8261"/><circle cx="18" cy="14" r="1.1" fill="#c8b18f"/><circle cx="10" cy="21" r="1.3" fill="#8f7655"/></pattern>
            <pattern id="rt-xtal" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M7 2l2 5-2 5-2-5z" fill="var(--theme-white)" fill-opacity=".75"/></pattern>
            <linearGradient id="rt-sky" x1="0" y1="0" x2="0" y2="1"><stop class="rt-sky0" offset="0"/><stop class="rt-sky1" offset="1"/></linearGradient>
          </defs>
          <g class="rt-scene">
            <rect class="rt-out rt-out--sky" width="${W}" height="${FACE}" fill="url(#rt-sky)"/>
            <rect class="rt-out rt-out--soil" width="${W}" height="${FACE}" fill="url(#rt-soil)"/>
            <rect class="rt-room" y="${BASE}" width="${W}" height="${420 - BASE}"/>
            <rect class="rt-slab" y="${FACE}" width="${W}" height="${BASE - FACE}" fill="url(#rt-conc)"/>
            <rect class="rt-integral" y="${FACE}" width="${W}" height="${BASE - FACE}"/>
            <rect class="rt-crystal" y="${FACE}" width="${W}" height="26" fill="url(#rt-xtal)"/>
            <path class="rt-crack" d="${crack}"/>
            <path class="rt-crack-x" d="${crack}"/>
            <path class="rt-resin" d="${crack}"/>
            <g class="rt-jointg"><rect class="rt-joint" x="${CRACK - 2}" y="${FACE}" width="4" height="${BASE - FACE}"/><rect class="rt-stop" x="${CRACK - 5}" y="${(FACE + BASE) / 2 - 14}" width="10" height="28" rx="3"/></g>
            <rect class="rt-coat" y="${FACE - 8}" width="${W}" height="8"/>
            <g class="rt-sheet">${Array.from({ length: 5 }, (_, i) => `<rect x="${i * 170 - 6}" y="${FACE - 11 + (i % 2) * 2}" width="182" height="11" rx="1.5"/>`).join("")}</g>
            <rect class="rt-outerl" y="${FACE - 10}" width="${W}" height="10"/>
            <rect class="rt-film" y="${FACE - 3}" width="${W}" height="3"/>
            <ellipse class="rt-stain" cx="${CRACK + 2}" cy="${BASE + 3}" rx="64" ry="9"/>
            <g class="rt-drips">${[0, 0.9].map((dl) => `<ellipse class="rt-drip" cx="${CRACK + 1}" cy="${BASE + 6}" rx="2.6" ry="4" style="--delay:${dl}s"/>`).join("")}</g>
            <g class="rt-drops">${drops}</g>
          </g>
          <text class="rt-lab rt-lab--out" x="20" y="30">Rain</text>
          <text class="rt-lab rt-lab--slab" x="20" y="${(FACE + BASE) / 2 + 22}">Concrete slab</text>
          <text class="rt-lab rt-lab--room" x="20" y="404">Room below</text>
          <text class="rt-lab rt-lab--crack" x="${CRACK + 14}" y="${FACE + 34}">Hairline crack</text>
        </svg>
        <figcaption id="rt-cap" class="rt-info" aria-live="polite">
          <p class="rt-kind">No waterproofing</p>
          <p class="rt-name">Bare concrete</p>
          <p class="rt-where">${esc(WHERE.none)}</p>
          <p class="rt-mind" hidden></p>
          <a class="pg-link rt-more" href="#methods" hidden>Read about this method</a>
        </figcaption>
      </figure>
    </div>
  </div>
</section>`;
}

export const RAIN_CSS = `
/* the rain test: the page's deep-blue band (a soft wave along its top, the
   hatch strip under it). The chips are white rings on the blue; the chosen one
   is filled orange. The drawing and its words sit on a chamfered white card. */
.rt-sec{scroll-margin-top:var(--nav-bar,80px)}
.rt-sec .pg-lede{max-width:46rem}
.rt{display:grid;grid-template-columns:minmax(0,1fr);gap:clamp(1.3rem,3vh,1.8rem)}
/* the chips by kind: two columns of kinds (one on a phone); on a wide screen one
   row, where the short kinds stack their two chips so each column is exactly as
   wide as its longest name and the coatings take the rest */
.rt-pick{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem 1.6rem}
@media (min-width:1200px){
  .rt-pick{grid-template-columns:auto minmax(0,1fr) auto auto auto}
  .rt-group--sheet > div,.rt-group--concrete > div,.rt-group--joint > div{flex-direction:column;align-items:flex-start}
}
.rt-group{min-width:0}
.rt-group p{margin:0 0 .55rem;font-size:var(--fs-body);font-weight:600;color:var(--band-mute)}
.rt-group > div{display:flex;flex-wrap:wrap;gap:.45rem}
/* a name stays on one line wherever its column allows; only a column narrower than the name wraps it */
.rt-chip{display:inline-flex;align-items:center;min-height:2.5rem;max-width:100%;padding:.4rem 1rem;border:0;border-radius:var(--r-pill);background:transparent;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-white) 35%,transparent);font:inherit;font-size:var(--fs-body);font-weight:500;line-height:1.25;color:var(--theme-on-dark);text-align:left;cursor:pointer;transition:background-color .2s var(--ease),color .2s var(--ease),box-shadow .2s var(--ease)}
.rt-chip:hover{box-shadow:inset 0 0 0 1.5px var(--act);background:color-mix(in srgb,var(--theme-white) 6%,transparent)}
.rt-chip[aria-pressed=true]{background:var(--act);box-shadow:none;color:var(--on-act)}
.rt:not(.is-live) .rt-pick{display:none}
.rt-stage{position:relative;display:grid;grid-template-columns:minmax(0,1.7fr) minmax(0,1fr);margin:0;padding:1rem;border-radius:var(--r-card);background:var(--card);color:var(--ink);clip-path:polygon(var(--cut) 0,100% 0,100% 100%,0 100%,0 var(--cut))}
.rt-svg{display:block;width:100%;height:auto;border-radius:var(--r-ctl);clip-path:inset(0 round var(--r-ctl))}
.rt-info{display:flex;flex-direction:column;gap:.5rem;padding:clamp(1rem,2vw,1.6rem) clamp(.4rem,1.6vw,1.4rem) clamp(.4rem,1vw,.8rem) clamp(1.2rem,2.4vw,2rem)}
.rt-kind{margin:0;font-size:var(--fs-body);font-weight:600;color:var(--accent)}
.rt[data-leak] .rt-kind{color:var(--theme-error)}
.rt-name{margin:0;font-family:var(--display);font-size:var(--fs-sub);font-weight:600;line-height:1.2;letter-spacing:-.01em;color:var(--ink)}
.rt-where{margin:.3rem 0 0;font-size:var(--fs-body);line-height:1.6;color:var(--ink2)}
.rt-mind{margin:.2rem 0 0;padding:.75rem .9rem;border-radius:var(--r-ctl);background:var(--theme-bg);font-size:var(--fs-body);line-height:1.5;color:var(--ink2)}
.rt-mind[hidden],.rt-more[hidden]{display:none}
.rt-more{align-self:flex-start;margin-top:auto;padding-top:.8rem}
/* the white card sits on the blue band: its link and focus ring go back to the light-ground look */
.rt-stage .pg-link{color:var(--navy);background:linear-gradient(var(--act),var(--act)) left bottom/0% 1.5px no-repeat,linear-gradient(color-mix(in srgb,var(--accent) 35%,transparent),color-mix(in srgb,var(--accent) 35%,transparent)) left bottom/100% 1px no-repeat}
.rt-stage .pg-link:hover,.rt-stage .pg-link:focus-visible{color:var(--act-t);background-size:100% 1.5px,100% 1px}
.pg .rt-stage :focus-visible{outline-color:var(--accent)}

/* the drawing (the concrete and soil keep their own material colours: artwork) */
.rt-sky0{stop-color:color-mix(in srgb,var(--theme-primary) 24%,var(--theme-white))}
.rt-sky1{stop-color:var(--theme-primary-soft)}
.rt-room{fill:var(--theme-bg)}
.rt-crack{fill:none;stroke:var(--theme-ink-2);stroke-width:2.2;stroke-linejoin:round}
.rt-crack-x{fill:none;stroke:url(#rt-xtal);stroke-width:7;opacity:0}
.rt-resin{fill:none;stroke:var(--theme-primary);stroke-width:4.5;stroke-linejoin:round;opacity:0}
.rt-joint{fill:var(--theme-muted)}
.rt-stop{fill:var(--theme-primary);stroke:var(--theme-on-dark);stroke-width:1.5}
.rt-coat{fill:var(--theme-primary)}
.rt-sheet rect{fill:var(--theme-dark);stroke:color-mix(in srgb,var(--theme-dark) 70%,var(--theme-white));stroke-width:1}
.rt-outerl{fill:var(--theme-dark)}
.rt-integral{fill:var(--theme-primary);opacity:0}
.rt-crystal{opacity:0}
.rt-stain{fill:color-mix(in srgb,var(--theme-ink) 70%,var(--theme-bg));opacity:0;transition:opacity .8s}
.rt-out--soil,.rt-jointg,.rt-coat,.rt-sheet,.rt-outerl{display:none}
.rt-drop{fill:var(--theme-water);--d:${FACE - 14}px;animation:rt-fall 1.6s cubic-bezier(.45,0,.9,.6) infinite;animation-delay:var(--delay);transform-box:fill-box;transform-origin:50% 100%}
@keyframes rt-fall{0%{transform:translateY(0);opacity:0}8%{opacity:1}80%{transform:translateY(var(--d)) scale(1,1);opacity:1}92%{transform:translateY(var(--d)) scale(2.2,.35);opacity:.7}100%{transform:translateY(var(--d)) scale(2.6,.2);opacity:0}}
.rt-drop--crack{animation-name:rt-seep;animation-duration:2.4s}
@keyframes rt-seep{0%{transform:translateY(0);opacity:0}8%{opacity:1}100%{transform:translateY(var(--d));opacity:0}}
.rt-film{fill:var(--theme-water);opacity:.45}
.rt-drips{display:none}
.rt[data-leak]:not([data-from=ground]) .rt-drips{display:inline}
.rt-drip{fill:var(--theme-water);animation:rt-drip 1.8s cubic-bezier(.5,0,1,.7) infinite;animation-delay:var(--delay);transform-box:fill-box;transform-origin:50% 0}
@keyframes rt-drip{0%{transform:translateY(0) scale(.4);opacity:0}30%{transform:translateY(0) scale(1);opacity:1}100%{transform:translateY(120px) scale(.9,1.2);opacity:0}}
.rt-lab{font-family:var(--sans);font-size:16px;font-weight:600;fill:var(--theme-ink);paint-order:stroke;stroke:color-mix(in srgb,var(--theme-on-dark) 85%,transparent);stroke-width:4px;stroke-linejoin:round}
.rt-lab--crack{font-weight:500}

/* each state */
.rt[data-from=ground] .rt-scene{transform:translateY(420px) scaleY(-1)}
.rt[data-from=ground] .rt-out--sky{display:none}
.rt[data-from=ground] .rt-out--soil{display:inline}
.rt[data-leak] .rt-stain{opacity:.45}
.rt[data-layer=coat] .rt-coat,.rt[data-layer=sheet] .rt-sheet,.rt[data-layer=outer] .rt-outerl,.rt[data-layer=joint] .rt-jointg{display:inline}
.rt[data-layer=joint] .rt-crack,.rt[data-layer=joint] .rt-lab--crack{display:none}
.rt[data-layer=crystal] .rt-crystal{opacity:1}
.rt[data-layer=crystal] .rt-crack-x{opacity:1}
.rt[data-layer=integral] .rt-integral{opacity:.12}
.rt[data-layer=inject] .rt-resin{opacity:1}

@media (prefers-reduced-motion:reduce){
  .rt-drop{animation:none;transform:translateY(var(--d))}
  .rt-drip{animation:none;transform:translateY(40px)}
}
@media (max-width:1023px){
  .rt-stage{grid-template-columns:minmax(0,1fr)}
  .rt-info{padding:1.2rem .4rem .4rem}
}
@media (max-width:599px){
  .rt-pick{grid-template-columns:minmax(0,1fr)}
  .rt-stage{padding:.75rem}
  /* a phone shows the left part of the drawing, crack and all, at a size the words can be read */
  .rt-svg{height:330px}
  .rt-lab{font-size:20px}
}
`;

/* ------------------------------------------------------------ in the browser */

interface RainMethod {
  key: string;
  short: string;
  kind: string;
  mind: string;
}

/** wire the rain test: pick a method, the drawing and the words follow */
export function mountRain(root: HTMLElement, methods: readonly RainMethod[]): () => void {
  const sec = root.querySelector<HTMLElement>("[data-rain-test]");
  const rt = sec?.querySelector<HTMLElement>(".rt");
  if (!sec || !rt) return () => {};
  const chips = Array.from(sec.querySelectorAll<HTMLButtonElement>("[data-rain]"));
  const drops = Array.from(sec.querySelectorAll<SVGEllipseElement>(".rt-drop"));
  const q = <T extends Element>(s: string) => sec.querySelector<T>(s);
  const by = new Map(methods.map((m) => [m.key, m]));
  const labOut = q<SVGTextElement>(".rt-lab--out");
  const labRoom = q<SVGTextElement>(".rt-lab--room");
  const labSlab = q<SVGTextElement>(".rt-lab--slab");
  const labCrack = q<SVGTextElement>(".rt-lab--crack");

  const show = (key: string) => {
    const r = RAIN[key];
    const m = by.get(key);
    const from = r?.from ?? "above";
    const layer = r?.layer;
    const leak = !r || layer === "integral";
    rt.dataset.from = from;
    if (layer) rt.dataset.layer = layer;
    else delete rt.dataset.layer;
    if (leak) rt.dataset.leak = "";
    else delete rt.dataset.leak;
    // how far each drop falls: to the outer face, a little into the concrete, to the joint's stop, or through the crack
    const face = { coat: FACE - 8, sheet: FACE - 11, outer: FACE - 10, crystal: FACE + 22, integral: FACE + 6, inject: FACE, joint: FACE }[layer ?? "inject"];
    drops.forEach((d) => {
      const crack = d.classList.contains("rt-drop--crack");
      let stop = face;
      if (crack && leak) stop = 418;
      else if (crack && layer === "joint") stop = (FACE + BASE) / 2 - 16;
      else if (crack && layer === "crystal") stop = FACE + 30;
      else if (crack && layer === "inject") stop = FACE + 4;
      d.style.setProperty("--d", `${stop - 10}px`);
      d.classList.toggle("rt-drop--crack", crack);
      d.style.animationName = crack && leak ? "rt-seep" : "rt-fall";
      d.style.animationDuration = crack && leak ? "2.4s" : "1.6s";
    });
    // the words on the drawing stay upright when it turns over
    const ground = from === "ground";
    if (labOut) {
      labOut.textContent = ground ? "Wet ground" : "Rain";
      labOut.setAttribute("y", ground ? "404" : "30");
    }
    if (labRoom) {
      labRoom.textContent = ground ? "Basement" : "Room below";
      labRoom.setAttribute("y", ground ? "30" : "404");
    }
    if (labSlab) {
      labSlab.textContent = ground ? "Concrete wall or floor" : "Concrete slab";
      labSlab.setAttribute("y", String(ground ? 420 - (FACE + BASE) / 2 - 18 : (FACE + BASE) / 2 + 22));
    }
    // a film of water where it stops on the outer face
    const film = q<SVGRectElement>(".rt-film");
    if (film) film.setAttribute("y", String(Math.min(face, FACE) - 3));
    if (labCrack) labCrack.setAttribute("y", String(ground ? 420 - FACE - 26 : FACE + 34));
    // the words beside it
    const kind = q<HTMLElement>(".rt-kind");
    const name = q<HTMLElement>(".rt-name");
    const where = q<HTMLElement>(".rt-where");
    const mind = q<HTMLElement>(".rt-mind");
    const more = q<HTMLAnchorElement>(".rt-more");
    if (kind) kind.textContent = m ? `${m.kind} · ${ground ? "water from the ground" : "water from above"}` : "No waterproofing";
    if (name) name.textContent = m ? m.short : "Bare concrete";
    if (where) where.textContent = WHERE[layer ?? "none"];
    if (mind) {
      mind.hidden = !m;
      mind.textContent = m ? `Keep in mind: ${m.mind.charAt(0).toLowerCase()}${m.mind.slice(1)}.` : "";
    }
    if (more) {
      more.hidden = !m;
      if (m) {
        more.href = `#m-${m.key}`;
        more.dataset.mGo = m.key;
        more.textContent = `Read about ${m.short}`;
      }
    }
    chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.rain === key)));
  };

  const onClick = (e: Event) => {
    const c = (e.target as Element).closest<HTMLButtonElement>("[data-rain]");
    if (c) show(c.dataset.rain!);
  };
  sec.addEventListener("click", onClick);
  rt.classList.add("is-live");
  show("none");
  return () => {
    sec.removeEventListener("click", onClick);
    rt.classList.remove("is-live");
  };
}
