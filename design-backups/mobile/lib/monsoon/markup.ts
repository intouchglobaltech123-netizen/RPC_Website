/**
 * The monsoon house section: a sticky stage (the drawing, the rain over it,
 * the leak buttons and, on wide screens, a gauge from terrace to sump) with
 * the story scrolling over it, one screen per step: the opening, the four
 * leaks from the top of the house down, and the dry house at the end.
 *
 * Plain strings, so the server renders every word and the page reads in full
 * before scripts arrive; lib/monsoon/mount.ts brings it to life.
 */
import { intro, outro, steps } from "./copy";
import { motionMarkup, sceneMarkup } from "./scene";

export interface MonsoonData {
  whatsapp: string;
  phone: string;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const tel = (p: string) => `tel:${p.replace(/[^0-9+]/g, "")}`;
const tick = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5 6.6 11.5 12.5 4.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const out = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
/** the check in a sealed place's mark on the rail */
const check = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.2 8.4 6.8 11 11.8 5.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/** where a step's place stands: leaking until its fix has been drawn, then sealed */
const flag = (place: string, sealed = false) =>
  `<p class="mh-state"><span class="mh-place">${esc(place)}</span><span class="mh-flag${sealed ? " is-sealed" : ""}" aria-hidden="true"><i></i><b class="mh-leaking">Leaking</b><b class="mh-sealed">Sealed</b></span></p>`;

export function monsoonMarkup(d: MonsoonData) {
  const spots = steps
    .map(
      (s) =>
        `<a class="mh-spot" href="#leak-${s.zone}" data-spot="${s.zone}" tabindex="-1"><span class="mh-hit"></span><i class="mh-dot"></i><span class="mh-tag">${esc(s.symptom)}</span></a>`,
    )
    .join("");
  const rail = steps.map((s) => `<li><a href="#leak-${s.zone}" data-rail="${s.zone}" tabindex="-1"><i>${check}</i><span>${esc(s.place)}</span></a></li>`).join("");
  const chips = steps.map((s) => `<li><a class="mh-chip" href="#leak-${s.zone}">${esc(s.symptom)}</a></li>`).join("");

  const opening = `<article class="mh-step mh-step--intro" id="leak-top" data-step="0">
  <div class="mh-card">
    <h1 class="mh-h1"><span class="mh-kicker">${esc(intro.kicker)}<span class="mh-sr">: </span></span><span class="mh-title">${esc(intro.title)}</span></h1>
    <p class="mh-lede">${esc(intro.lede)}</p>
    <div class="mh-ctas">
      <a class="mh-btn mh-btn--solid" href="/contact" data-internal>Book a free inspection</a>
      <a class="mh-btn mh-btn--line" href="${esc(d.whatsapp)}" target="_blank" rel="noopener noreferrer">WhatsApp us</a>
    </div>
    <p class="mh-ask" id="mh-ask">${esc(intro.ask)}</p>
    <ul class="mh-chips" aria-labelledby="mh-ask">${chips}</ul>
  </div>
</article>`;

  const leaks = steps
    .map(
      (s, i) => `<article class="mh-step" id="leak-${s.zone}" data-step="${i + 1}" data-zone="${s.zone}" aria-labelledby="leak-${s.zone}-h">
  <div class="mh-card">
    ${flag(s.place)}
    <h2 class="mh-title" id="leak-${s.zone}-h">${esc(s.title)}</h2>
    <p class="mh-body">${esc(s.body)}</p>
    <ul class="mh-fix">${s.fix.map((f) => `<li>${tick}<span>${esc(f)}</span></li>`).join("")}</ul>
    <a class="mh-more" href="${esc(s.link.href)}" data-internal>${esc(s.link.label)}${out}</a>
  </div>
</article>`,
    )
    .join("");

  const close = `<article class="mh-step mh-step--end" id="leak-dry" data-step="${steps.length + 1}" aria-labelledby="leak-dry-h">
  <div class="mh-card">
    ${flag(outro.place, true)}
    <h2 class="mh-title" id="leak-dry-h">${esc(outro.title)}</h2>
    <p class="mh-body">${esc(outro.body)}</p>
    <div class="mh-ctas">
      <a class="mh-btn mh-btn--solid" href="/contact" data-internal>Book a free inspection</a>
      <a class="mh-btn mh-btn--line" href="${tel(d.phone)}">Call ${esc(d.phone)}</a>
    </div>
  </div>
</article>`;

  return `<div class="mh-stage" data-step="0">
  <div class="mh-scene">${sceneMarkup()}${motionMarkup()}<canvas class="mh-rain" aria-hidden="true"></canvas></div>
  <div class="mh-shade" aria-hidden="true"></div>
  <div class="mh-spots" aria-hidden="true">${spots}</div>
  <div class="mh-rail" aria-hidden="true"><ol>${rail}</ol><p class="mh-railsum" data-n="${steps.length}"></p></div>
</div>
<div class="mh-steps">${opening}${leaks}${close}</div>`;
}

export const MONSOON_CSS = `
.mh{--mh-ink:#eef3f5;--mh-mute:rgba(226,236,240,.74);--mh-seal:#e6dfd1;--mh-seal-2:#ffffff;--mh-leak:#e8a215;--mh-bg:#0a1823;position:relative;background:var(--mh-bg);color:var(--mh-ink);isolation:isolate}
.mh-stage{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden;z-index:0;contain:layout paint}
.mh-scene{position:absolute;inset:0}
.mh-svg,.mh-rain{position:absolute;inset:0;width:100%;height:100%;display:block}
.mh-rain,.mh-motion{pointer-events:none}
/* the moving layers paint on their own, so the drawing under them is not repainted every frame */
.mh-motion,.mh-rain{will-change:transform}
.mh-shade{position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,rgba(6,16,24,.9) 0,rgba(6,16,24,.74) 22%,rgba(6,16,24,.3) 38%,rgba(6,16,24,0) 48%)}
.mh-steps{position:relative;z-index:2;margin-top:-100vh;margin-top:-100svh;pointer-events:none}
.mh-step{min-height:100vh;min-height:100svh;display:flex;align-items:center;padding:calc(var(--nav-h,96px) + 20px) var(--gutter,1.5rem) 56px;box-sizing:border-box}
.mh-card{pointer-events:auto;width:min(31rem,36vw)}
.mh-js .mh-step .mh-card{transition:opacity .6s cubic-bezier(.22,1,.36,1)}
.mh-js .mh-step:not(.is-on) .mh-card{opacity:.28}

.mh-h1{margin:0;font-weight:400}
.mh-kicker{display:block;margin:0 0 1.1rem;font-family:var(--font-inter-tight),system-ui,sans-serif;font-size:var(--fs-body,1rem);font-weight:500;line-height:1.4;letter-spacing:0;color:var(--mh-mute)}
.mh-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.mh-h1 .mh-title{display:block}
.mh-title{margin:0;font-family:var(--font-inter-tight),"Segoe UI",system-ui,sans-serif;font-weight:600;font-size:var(--fs-title,3rem);line-height:1.12;letter-spacing:-.02em;text-wrap:balance;color:#f6f9fa}
.mh-lede{margin:1.15rem 0 0;font-size:var(--fs-body,1rem);line-height:1.65;color:var(--mh-mute);max-width:29rem;text-wrap:pretty}
.mh-body{margin:1rem 0 0;font-size:var(--fs-body,1rem);line-height:1.65;color:var(--mh-mute);max-width:29rem;text-wrap:pretty}
.mh-ctas{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:1.7rem}
.mh-btn{display:inline-flex;align-items:center;height:2.75rem;padding:0 1.2rem;border-radius:10px;font-size:var(--fs-body,1rem);font-weight:600;line-height:1;text-decoration:none;white-space:nowrap;transition:background-color .35s,color .35s,border-color .35s}
.mh-btn--solid{background:#f3f6f7;color:#0b1d2b}
.mh-btn--solid:hover{background:#ffffff;color:#0b2350}
.mh-btn--line{border:1px solid rgba(238,243,245,.3);color:var(--mh-ink)}
.mh-btn--line:hover{border-color:var(--mh-ink);background:rgba(255,255,255,.06)}
.mh-ask{margin:2.2rem 0 .75rem;font-size:var(--fs-body,1rem);font-weight:500;color:var(--mh-ink)}
.mh-chips{display:flex;flex-wrap:wrap;gap:.45rem;margin:0;padding:0;list-style:none}
.mh-chip{display:inline-flex;align-items:center;gap:.55rem;height:2.25rem;padding:0 .95rem 0 .8rem;border-radius:10px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);color:var(--mh-ink);font-size:var(--fs-body,1rem);line-height:1;text-decoration:none;transition:background-color .3s,border-color .3s}
.mh-chip::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--mh-leak);box-shadow:0 0 0 3px rgba(232,162,21,.18)}
.mh-chip:hover{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.28)}

.mh-state{display:flex;align-items:center;flex-wrap:wrap;gap:.75rem;margin:0 0 1.1rem;font-size:var(--fs-body,1rem);font-weight:500}
.mh-place{color:var(--mh-ink)}
.mh-flag{display:inline-flex;align-items:center;gap:.45rem;height:1.8rem;padding:0 .75rem 0 .65rem;border-radius:999px;background:rgba(232,162,21,.14);color:#f2c35e;transition:background-color .5s,color .5s}
.mh-flag i{width:7px;height:7px;border-radius:50%;background:currentColor}
.mh-flag b{font-weight:500}
.mh-sealed{display:none}
[data-sealed] .mh-flag,.mh-flag.is-sealed{background:rgba(230,223,209,.15);color:var(--mh-seal-2)}
[data-sealed] .mh-leaking,.mh-flag.is-sealed .mh-leaking{display:none}
[data-sealed] .mh-sealed,.mh-flag.is-sealed .mh-sealed{display:inline}
.mh-fix{margin:1.3rem 0 0;padding:0;list-style:none;display:grid;gap:.6rem;max-width:29rem}
.mh-fix li{display:flex;gap:.65rem;font-size:var(--fs-body,1rem);line-height:1.5;color:var(--mh-ink)}
.mh-fix svg{flex:none;width:1.15rem;height:1.15rem;margin-top:.17rem;color:rgba(238,243,245,.32);transition:color .6s}
[data-sealed] .mh-fix svg{color:var(--mh-seal-2)}
[data-sealed] .mh-fix li:nth-child(2) svg{transition-delay:.15s}
[data-sealed] .mh-fix li:nth-child(3) svg{transition-delay:.3s}
.mh-more{display:inline-flex;align-items:center;gap:.4rem;margin-top:1.5rem;padding-bottom:3px;border-bottom:1px solid rgba(238,243,245,.3);color:var(--mh-ink);font-size:var(--fs-body,1rem);font-weight:500;text-decoration:none;transition:border-color .3s}
.mh-more:hover{border-color:var(--mh-ink)}
.mh-more svg{width:14px;height:14px}
.mh a:focus-visible{outline:2px solid var(--mh-seal-2);outline-offset:3px}

.mh-spots{position:absolute;inset:0;pointer-events:none}
.mh-spot{position:absolute;left:0;top:0;width:0;height:0;color:var(--mh-ink);text-decoration:none;opacity:0;visibility:hidden;transition:opacity .45s,visibility 0s .45s}
.mh-stage[data-step="0"] .mh-spot{opacity:1;visibility:visible;transition:opacity .5s .25s,visibility 0s}
.mh-hit{position:absolute;left:-22px;top:-22px;width:44px;height:44px;border-radius:50%;pointer-events:auto}
.mh-dot{position:absolute;left:-7px;top:-7px;width:14px;height:14px;border-radius:50%;background:var(--mh-leak);box-shadow:0 0 0 3px rgba(10,24,35,.55);pointer-events:none}
.mh-dot::after{content:"";position:absolute;inset:-2px;border-radius:50%;border:1.5px solid var(--mh-leak);animation:mh-pulse 2.4s cubic-bezier(.2,.7,.3,1) infinite}
.mh-spot:nth-child(2) .mh-dot::after{animation-delay:.6s}
.mh-spot:nth-child(3) .mh-dot::after{animation-delay:1.2s}
.mh-spot:nth-child(4) .mh-dot::after{animation-delay:1.8s}
@keyframes mh-pulse{0%{transform:scale(.7);opacity:.95}100%{transform:scale(3);opacity:0}}
.mh-tag{position:absolute;left:16px;top:-16px;display:flex;align-items:center;height:32px;padding:0 .8rem;border-radius:999px;background:rgba(8,20,30,.88);border:1px solid rgba(255,255,255,.16);font-size:var(--fs-body,1rem);line-height:1;white-space:nowrap;pointer-events:auto;transition:background-color .3s,color .3s}
.mh-spot:hover .mh-tag,.mh-spot:focus-visible .mh-tag{background:#f3f6f7;color:#0b1d2b}
.mh-spot:focus-visible{outline:none}
.mh-spot:focus-visible .mh-dot{box-shadow:0 0 0 3px var(--mh-seal-2)}
.mh-spot[data-flip] .mh-tag{left:auto;right:16px}

/* the places, top to bottom: each one's mark turns from leaking to sealed as the story reaches it */
.mh-rail{position:absolute;right:var(--gutter,1.5rem);bottom:2rem;width:15rem;padding:.5rem;border-radius:16px;background:rgba(7,18,27,.8);border:1px solid rgba(255,255,255,.09);box-shadow:0 24px 48px -28px rgba(0,0,0,.8);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);counter-reset:mh-sealed;opacity:0;visibility:hidden;transition:opacity .5s,visibility 0s .5s}
.mh-stage:is([data-step="1"],[data-step="2"],[data-step="3"],[data-step="4"]) .mh-rail{opacity:1;visibility:visible;transition:opacity .5s .2s,visibility 0s}
.mh-rail ol{margin:0;padding:0;list-style:none;display:grid;gap:2px}
.mh-rail li{position:relative}
/* the line from each place's mark to the next: solid once the place above is sealed */
.mh-rail li + li::before{content:"";position:absolute;left:calc(.7rem + .7rem - 1px);top:-.62rem;height:.95rem;width:2px;border-radius:1px;background:rgba(238,243,245,.14);transition:background-color .5s}
.mh-rail li:has(> a[data-sealed]) + li::before{background:rgba(230,223,209,.55)}
.mh-rail a{position:relative;display:flex;align-items:center;gap:.75rem;height:2.6rem;padding:0 .7rem;border-radius:11px;color:rgba(226,236,240,.62);font-size:var(--fs-body,1rem);line-height:1;text-decoration:none;transition:background-color .3s,color .3s}
.mh-rail a:hover{color:var(--mh-ink);background:rgba(255,255,255,.05)}
.mh-rail a[aria-current="step"]{color:#fff;font-weight:600;background:rgba(255,255,255,.09)}
.mh-rail a[data-sealed]{counter-increment:mh-sealed}
/* a place's mark: an amber dot while it leaks, a teal check once sealed */
.mh-rail i{position:relative;flex:none;display:grid;place-items:center;width:1.4rem;height:1.4rem;border-radius:50%;background:rgba(232,162,21,.13);box-shadow:inset 0 0 0 1.5px rgba(232,162,21,.6);transition:background-color .45s,box-shadow .45s}
.mh-rail i::after{content:"";position:absolute;width:6px;height:6px;border-radius:50%;background:var(--mh-leak);transition:opacity .3s,transform .3s}
.mh-rail i svg{width:.85rem;height:.85rem;color:#05222b;opacity:0;transform:scale(.6);transition:opacity .35s,transform .35s cubic-bezier(.3,1.5,.5,1)}
.mh-rail a[data-sealed] i{background:var(--mh-seal);box-shadow:none}
.mh-rail a[data-sealed] i::after{opacity:0;transform:scale(.3)}
.mh-rail a[data-sealed] i svg{opacity:1;transform:none}
.mh-rail a[aria-current="step"] i{box-shadow:inset 0 0 0 1.5px rgba(232,162,21,.85),0 0 0 4px rgba(232,162,21,.16)}
.mh-rail a[aria-current="step"][data-sealed] i{box-shadow:0 0 0 4px rgba(230,223,209,.2)}
/* how many are sealed so far */
.mh-railsum{display:flex;align-items:center;justify-content:space-between;margin:.35rem .2rem 0;padding:.6rem .5rem .2rem;border-top:1px solid rgba(255,255,255,.08);font-size:var(--fs-body,1rem);line-height:1;color:rgba(226,236,240,.62)}
.mh-railsum::before{content:"Sealed"}
.mh-railsum::after{content:counter(mh-sealed) " of " attr(data-n);color:var(--mh-ink);font-weight:600;font-variant-numeric:tabular-nums}

.mh-js:not(.is-live) .mh-step--intro .mh-card>*{opacity:0;transform:translateY(16px)}
.mh-js .mh-step--intro .mh-card>*{transition:opacity 1s cubic-bezier(.22,1,.36,1),transform 1s cubic-bezier(.22,1,.36,1)}
.mh-js .mh-step--intro .mh-card>:nth-child(2){transition-delay:.08s}
.mh-js .mh-step--intro .mh-card>:nth-child(3){transition-delay:.16s}
.mh-js .mh-step--intro .mh-card>:nth-child(4){transition-delay:.24s}
.mh-js .mh-step--intro .mh-card>:nth-child(n+5){transition-delay:.32s}

.mh-svg .lk{transition:opacity .9s ease}
.mh-svg .fx{opacity:0;transition:opacity .7s ease}
.mh-svg .fx-line{stroke-dasharray:1 1;stroke-dashoffset:1;transition:stroke-dashoffset 1.1s cubic-bezier(.65,0,.35,1),opacity 0s linear 1.1s}
.mh-svg .fx-wipe{transition-duration:1.6s,0s;transition-delay:0s,1.6s}
.mh-svg .fx-crystal{opacity:1;transform:scale(0);transform-box:fill-box;transform-origin:center;transition:transform .6s cubic-bezier(.3,1.6,.5,1)}
.mh-svg .fx-flow{stroke-dasharray:4 5;animation:mh-flow .5s linear infinite}
.mh-svg.is-terrace .lk-terrace,.mh-svg.is-bathroom .lk-bathroom,.mh-svg.is-walls .lk-walls,.mh-svg.is-sump .lk-sump{opacity:0;transition:opacity 1.2s ease 1s}
.mh-svg.is-terrace .fx-terrace,.mh-svg.is-bathroom .fx-bathroom,.mh-svg.is-walls .fx-walls,.mh-svg.is-sump .fx-sump{opacity:1;transition:opacity .8s ease .7s}
.mh-svg.is-terrace .fx-terrace.fx-line,.mh-svg.is-bathroom .fx-bathroom.fx-line,.mh-svg.is-walls .fx-walls.fx-line,.mh-svg.is-sump .fx-sump.fx-line{stroke-dashoffset:0;transition:stroke-dashoffset 1.4s cubic-bezier(.65,0,.35,1),opacity 0s}
.mh-svg.is-terrace .fx-terrace.fx-line.fx-wipe{transition:stroke-dashoffset 1.9s cubic-bezier(.45,0,.3,1) .25s,opacity 0s}
.mh-svg.is-sump .fx-crystal{transform:scale(1)}
.mh-svg .mh-drip{transform-box:fill-box;transform-origin:center top;animation:mh-drip 1.6s infinite}
.mh-svg .mh-ring{opacity:0;transform-box:fill-box;transform-origin:center;animation:mh-ring 1.6s infinite}
.mh-svg .mh-seep{animation:mh-seep 1.1s linear infinite}
.mh-svg .mh-shower{animation:mh-shower .45s linear infinite}
.mh-svg .mh-gwline{animation:mh-gw 7s linear infinite}
.mh-svg .mh-crown{animation:mh-sway 4.6s ease-in-out infinite alternate}
.mh-svg .mh-crown--b{animation-duration:5.4s;animation-delay:-2s}
@keyframes mh-drip{0%{transform:translateY(0) scale(.2);opacity:0;animation-timing-function:ease-out}10%{opacity:1}38%{transform:translateY(0) scale(1);animation-timing-function:cubic-bezier(.55,0,1,.6)}97%{opacity:1}100%{transform:translateY(var(--fall)) scale(1,1.15);opacity:0}}
@keyframes mh-ring{0%{transform:scale(.25);opacity:.9}35%{transform:scale(1.6);opacity:0}100%{opacity:0}}
@keyframes mh-seep{to{stroke-dashoffset:-15}}
@keyframes mh-shower{to{stroke-dashoffset:-13}}
@keyframes mh-flow{to{stroke-dashoffset:-9}}
@keyframes mh-gw{to{transform:translateX(-80px)}}
@keyframes mh-sway{from{transform:rotate(-1.4deg)}to{transform:rotate(1.8deg)}}

@media (max-width:899px),(max-aspect-ratio:1/1){
  .mh-shade{background:linear-gradient(180deg,rgba(6,16,24,0) 40%,rgba(6,16,24,.72) 56%,rgba(6,16,24,.94) 70%)}
  .mh-step{align-items:flex-end;padding:calc(var(--nav-h,68px) + 8px) .625rem .75rem}
  .mh-card{width:100%;max-width:36rem;margin-inline:auto;padding:1rem 1.05rem 1.1rem;border-radius:18px;background:rgba(8,20,30,.93);border:1px solid rgba(255,255,255,.08)}
  .mh-step--intro .mh-card{padding:0 .4rem .3rem;background:none;border:0}
  .mh-lede{margin-top:.8rem}
  .mh-kicker{margin-bottom:.65rem}
  .mh-ctas{margin-top:1.15rem}
  .mh-ask{margin-top:1.3rem}
  .mh-state{margin-bottom:.8rem}
  .mh-body{margin-top:.7rem;line-height:1.55}
  .mh-fix{margin-top:.85rem;gap:.35rem}
  .mh-fix li{line-height:1.42}
  .mh-more{margin-top:.95rem}
  .mh-rail,.mh-tag{display:none}
  .mh-js .mh-step:not(.is-on) .mh-card{opacity:.5}
  .mh-chips{flex-wrap:nowrap;overflow-x:auto;margin-inline:-.4rem;padding:0 .4rem .1rem;scrollbar-width:none}
  .mh-chips::-webkit-scrollbar{display:none}
  .mh-chips li{flex:none}
  .mh-chip{white-space:nowrap}
}
@media (prefers-reduced-motion:reduce){
  .mh-svg *,.mh-dot::after{animation:none!important}
  .mh-svg .lk,.mh-svg .fx,.mh-svg .fx-line,.mh-svg .fx-crystal{transition-duration:.01s!important;transition-delay:0s!important}
  .mh-svg .mh-drip,.mh-svg .mh-ring{display:none}
  .mh-js .mh-step--intro .mh-card>*{transition:none}
}
`;
