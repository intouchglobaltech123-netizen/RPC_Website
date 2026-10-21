/**
 * The monsoon house section: one screen with the film playing behind the
 * words (lib/monsoon/copy.ts `film`). The rain comes in over the house; each
 * place is shown leaking, then the coat going on, then dry in the rain, about
 * four seconds apiece over 20 seconds; and the house ends dry, where the film
 * stops and the hook (the promise, the free visit, two buttons) comes in
 * on the left while the panel and the places step away. A
 * caption follows the film (the place; leaking, applying or sealed; what the
 * owner sees, then what we apply), with two short lines under it on why that
 * place leaks and what we use there. For each place the panel builds up one
 * piece at a time, and what we use joins once the coat goes on. The places
 * below it jump the film to that leak.
 *
 * On wide screens the film fills the section and the words sit in a column on the
 * right, short of the frame's bottom right corner;
 * on phones and upright screens the film sits whole at the top (16:9, so
 * nothing in the frame is cut off) with the caption and the words under it.
 *
 * Plain strings, so the server renders every word and the page reads in full
 * before scripts arrive; lib/monsoon/mount.ts plays the film and moves the
 * caption with it.
 */
import { film, hook, intro, noteLabels, outro, steps } from "./copy";

export interface MonsoonData {
  whatsapp: string;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const out = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/** where the place stands in the film: leaking, the coat going on, sealed */
const flag = () => `<span class="mh-flag"><i></i><b class="mh-leaking">Leaking</b><b class="mh-applying">Applying</b><b class="mh-sealed">Sealed</b></span>`;

export function monsoonMarkup(d: MonsoonData) {
  const first = steps[0]!;
  const chapters = film.chapters
    .map((c) => {
      const s = steps.find((x) => x.zone === c.zone)!;
      return `<li><button type="button" class="mh-ch" data-ch="${c.zone}" aria-label="Show the ${esc(s.place.toLowerCase())} leak"><span>${esc(s.short ?? s.place)}</span><i aria-hidden="true"><b></b></i></button></li>`;
    })
    .join("");

  return `<div class="mh-stage">
  <video class="mh-film" muted playsinline preload="metadata" poster="${esc(film.poster)}" aria-label="${esc(film.label)}">
    <source src="${esc(film.narrow)}" type="video/mp4" media="(max-width: 899px), (max-aspect-ratio: 7/5)">
    <source src="${esc(film.wide)}" type="video/mp4">
  </video>
  <div class="mh-shade" aria-hidden="true"></div>
  <div class="mh-shade-end" aria-hidden="true"></div>
  <p class="mh-chip" aria-hidden="true"><span class="mh-chip-place">${esc(first.place)}</span>${flag()}</p>
</div>
<div class="mh-body">
  <h1 class="mh-sr">${esc(intro.kicker)}: ${esc(intro.title)}</h1>
  <div class="mh-hook">
    <p class="mh-kicker">${esc(hook.kicker)}</p>
    <p class="mh-title">${esc(hook.title)}</p>
    <p class="mh-lede">${esc(hook.body)}</p>
    <div class="mh-ctas">
      <a class="mh-btn mh-btn--solid" href="${esc(hook.book.href)}" data-internal>${esc(hook.book.label)}</a>
      <a class="mh-btn mh-btn--line" href="${esc(d.whatsapp)}" target="_blank" rel="noopener noreferrer">${esc(hook.chat)}</a>
    </div>
  </div>
  <div class="mh-foot">
    <div class="mh-now" data-zone="${first.zone}">
      <p class="mh-state"><span class="mh-place">${esc(first.place)}</span>${flag()}</p>
      <p class="mh-cap">${esc(first.title)}</p>
      <dl class="mh-note">
        <div class="mh-note-why"><dt>${esc(noteLabels[0])}</dt><dd>${esc(first.why)}</dd></div>
        <div class="mh-note-uses"><dt>${esc(noteLabels[1])}</dt><dd>${esc(first.uses)}</dd></div>
      </dl>
      <a class="mh-more" href="${esc(first.link.href)}" data-internal>${esc(first.link.label)}${out}</a>
    </div>
    <div class="mh-chapters">
      <p class="mh-ask" id="mh-ask">${esc(intro.ask)}</p>
      <div class="mh-row">
        <ol aria-labelledby="mh-ask">${chapters}</ol>
      </div>
    </div>
  </div>
</div>
<template class="mh-captions">${[
    ...steps.map(
      (s) =>
        `<div data-zone="${s.zone}" data-place="${esc(s.place)}" data-title="${esc(s.title)}" data-apply="${esc(s.apply)}" data-href="${esc(s.link.href)}" data-label="${esc(s.link.label)}" data-n1l="${esc(noteLabels[0])}" data-n1="${esc(s.why)}" data-n2l="${esc(noteLabels[1])}" data-n2="${esc(s.uses)}"></div>`,
    ),
    `<div data-zone="dry" data-place="${esc(outro.place)}" data-title="${esc(outro.title)}" data-apply="${esc(outro.title)}" data-href="/contact" data-label="Book a free inspection" data-n1l="${esc(outro.note[0]![0])}" data-n1="${esc(outro.note[0]![1])}" data-n2l="${esc(outro.note[1]![0])}" data-n2="${esc(outro.note[1]![1])}"></div>`,
  ].join("")}</template>`;
}

export const MONSOON_CSS = `
.mh{--mh-ink:#eef3f5;--mh-mute:rgba(226,236,240,.76);--mh-seal:#e6dfd1;--mh-leak:#e8a215;--mh-bg:#0a1823;position:relative;min-height:100vh;min-height:100svh;background:var(--mh-bg);color:var(--mh-ink);isolation:isolate;overflow:hidden}
.mh-stage{position:absolute;inset:0;z-index:0}
/* the frame's bottom right corner (the makers' marks) always stays in view: a screen of another shape loses sky or the left edge, under the words.
   The words sit at the bottom in the middle, clear of the marks */
.mh-film{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:100% 100%;background:var(--mh-bg)}
.mh-shade{position:absolute;inset:0;pointer-events:none;background:radial-gradient(62% 58% at 50% 100%,rgba(5,14,21,.82) 0,rgba(5,14,21,.46) 50%,rgba(5,14,21,0) 78%),linear-gradient(180deg,rgba(5,14,21,.42) 0,rgba(5,14,21,0) 20%)}
.mh-chip{display:none}
.mh-body{position:relative;z-index:1;min-height:100vh;min-height:100svh;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:2.5rem;padding:calc(var(--nav-h,64px) + clamp(2rem,9vh,6.5rem)) var(--gutter,1.5rem) clamp(1.5rem,4vh,2.5rem);box-sizing:border-box}
.mh-card{width:min(25rem,30vw)}
/* the hook, on the left in the middle of the height once the film has played (without scripts it is simply there) */
.mh-hook{position:absolute;inset:0;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;padding:calc(var(--nav-h,64px) + 1rem) var(--gutter,1.5rem) clamp(2rem,6vh,4rem) clamp(2.5rem,8vw,9rem);text-align:left;pointer-events:none}
.mh-hook>*{pointer-events:auto}
/* where we work, after a short light blue rule */
.mh-hook .mh-kicker{display:flex;align-items:center;gap:.75rem;margin-bottom:1.1rem;color:rgba(226,236,240,.84)}
.mh-hook .mh-kicker::before{content:"";width:2rem;height:2px;border-radius:2px;background:#9fd3ea}
.mh-hook .mh-title{font-size:var(--fs-title,2.6rem);font-weight:650;line-height:1.04;letter-spacing:-.03em;max-width:17ch;text-wrap:wrap;text-shadow:0 2px 34px rgba(0,0,0,.4)}
.mh-hook .mh-lede{max-width:29rem;margin:1.25rem 0 0;line-height:1.65;color:rgba(236,242,245,.86);text-wrap:pretty}
.mh-hook .mh-ctas{justify-content:flex-start;gap:.75rem;margin-top:2rem}
.mh-hook .mh-btn{height:3rem;padding:0 1.4rem;border-radius:10px}
.mh-hook .mh-btn--solid{box-shadow:0 12px 28px -14px rgba(0,0,0,.6)}
.mh-hook .mh-btn--line{-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);background:rgba(6,16,24,.35)}
.mh-js .mh-hook{visibility:hidden;transition:visibility 0s linear .35s}
.mh-js .mh-hook>*{opacity:0;transform:translateY(12px);transition:opacity .3s ease,transform .3s ease}
.mh-js.is-ended .mh-hook{visibility:visible;transition:none}
.mh-js.is-ended .mh-hook>*{opacity:1;transform:none;transition:opacity .9s cubic-bezier(.2,.8,.2,1),transform .9s cubic-bezier(.2,.8,.2,1)}
.mh-js.is-ended .mh-hook>:nth-child(2){transition-delay:.12s}
.mh-js.is-ended .mh-hook>:nth-child(3){transition-delay:.24s}
.mh-js.is-ended .mh-hook>:nth-child(4){transition-delay:.38s}
/* the film has played: the panel and the places step away, a shade on the left keeps the hook clear of the picture */
.mh-shade-end{position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,rgba(5,14,21,.86) 0,rgba(5,14,21,.66) 36%,rgba(5,14,21,.16) 66%,rgba(5,14,21,0) 82%),linear-gradient(180deg,rgba(5,14,21,.3) 0,rgba(5,14,21,0) 24%);opacity:0;transition:opacity .9s ease}
.mh.is-ended .mh-shade-end{opacity:1}
.mh:not(.mh-js) .mh-shade-end{opacity:1}
.mh-js .mh-now{transition:opacity .4s ease,visibility 0s linear 0s}
.mh-js.is-ended .mh-now{opacity:0;visibility:hidden;transition:opacity .4s ease,visibility 0s linear .4s}
.mh-js .mh-chapters{transition:opacity .4s ease,visibility 0s linear 0s}
.mh-js.is-ended .mh-chapters{opacity:0;visibility:hidden;transition:opacity .4s ease,visibility 0s linear .4s}
.mh-foot{width:min(40rem,64vw);text-align:center}

.mh-h1{margin:0;font-weight:400}
.mh-kicker{display:block;margin:0 0 .55rem;font-family:var(--font-inter-tight),system-ui,sans-serif;font-size:var(--fs-body,1rem);font-weight:500;line-height:1.4;color:var(--mh-mute)}
.mh-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.mh-title{display:block;margin:0;font-family:var(--font-inter-tight),"Segoe UI",system-ui,sans-serif;font-weight:600;font-size:var(--fs-sub,1.35rem);line-height:1.2;letter-spacing:-.015em;text-wrap:balance;color:#f6f9fa;text-shadow:0 2px 24px rgba(0,0,0,.25)}
.mh-lede{margin:.7rem 0 0;font-size:var(--fs-body,1rem);line-height:1.6;color:rgba(232,240,244,.84);max-width:25rem;text-wrap:pretty;text-shadow:0 1px 14px rgba(0,0,0,.45)}
.mh-ctas{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1.1rem}
.mh-btn{display:inline-flex;align-items:center;height:2.4rem;padding:0 .95rem;border-radius:8px;font-size:var(--fs-body,1rem);font-weight:600;line-height:1;text-decoration:none;white-space:nowrap;transition:background-color .3s,color .3s,border-color .3s}
.mh-btn--solid{background:#f3f6f7;color:#0b1d2b}
.mh-btn--solid:hover{background:#fff;color:#0b2350}
.mh-btn--line{border:1px solid rgba(238,243,245,.32);color:var(--mh-ink);background:rgba(6,16,24,.25)}
.mh-btn--line:hover{border-color:var(--mh-ink);background:rgba(255,255,255,.08)}

/* what the film is showing, written on the film itself at the bottom in the middle: the place and how far its fix has got,
   one line of what is happening, and one quieter line under it */
.mh-now{display:flex;flex-direction:column;align-items:center;transition:opacity .22s ease}
.mh-now .mh-more{display:none}
.mh-state{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:.65rem;margin:0;font-size:var(--fs-body,1rem);font-weight:500;color:rgba(232,240,244,.8)}
.mh-place{color:#fff}
.mh-flag{display:inline-flex;align-items:center;gap:.4rem;color:#f2c35e;font-size:var(--fs-body,1rem);font-weight:500;transition:color .4s}
.mh-flag i{width:7px;height:7px;border-radius:50%;background:currentColor;box-shadow:0 0 0 4px rgba(242,195,94,.18);transition:box-shadow .4s}
.mh-flag b{font-weight:500}
.mh-applying,.mh-sealed{display:none}
.mh-flag.is-applying{color:#9fd3ea}
.mh-flag.is-applying i{box-shadow:0 0 0 4px rgba(159,211,234,.2)}
.mh-flag.is-sealed{color:#e9f2e9}
.mh-flag.is-sealed i{background:#7fd1a0;box-shadow:0 0 0 4px rgba(127,209,160,.2)}
.mh-flag:is(.is-applying,.is-sealed) .mh-leaking{display:none}
.mh-flag.is-applying .mh-applying,.mh-flag.is-sealed .mh-sealed{display:inline}
.mh-cap{margin:.6rem 0 0;font-family:var(--font-inter-tight),"Segoe UI",system-ui,sans-serif;font-size:var(--fs-sub,1.35rem);font-weight:600;line-height:1.25;letter-spacing:-.012em;color:#fff;text-wrap:balance;text-shadow:0 2px 22px rgba(0,0,0,.45);transition:opacity .18s ease;min-height:1.25em}
.mh-cap.is-fade{opacity:0}
/* under the caption, one quieter line: why the place leaks while it leaks, then what we use once the coat goes on */
.mh-note{display:grid;width:100%;max-width:34rem;margin:.5rem 0 0;font-size:var(--fs-body,1rem);line-height:1.5;text-shadow:0 1px 14px rgba(0,0,0,.5)}
.mh-note>div{grid-area:1/1}
.mh-note dt{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.mh-note dd{margin:0;color:rgba(236,242,245,.8);text-wrap:balance}
.mh-more{display:inline-flex;align-items:center;gap:.4rem;margin-top:.5rem;color:rgba(230,238,242,.78);font-size:var(--fs-body,1rem);font-weight:500;text-decoration:none;transition:color .3s}
.mh-more:hover{color:#fff}
.mh-more svg{width:14px;height:14px}

/* the places, in order, as one thin timeline: each line fills as the film goes through it */
.mh-chapters{width:min(30rem,100%);margin:1.5rem auto 0}
.mh-ask{display:none}
.mh-row{display:flex;align-items:flex-end;gap:.8rem}
.mh-row ol{flex:1;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.5rem;margin:0;padding:0;list-style:none}
.mh-ch{display:flex;flex-direction:column-reverse;gap:.45rem;width:100%;padding:.35rem 0 0;border:0;background:none;color:rgba(230,238,242,.62);font:inherit;font-size:var(--fs-body,1rem);font-weight:500;line-height:1.2;text-align:center;cursor:pointer;transition:color .3s}
.mh-ch span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mh-ch:hover,.mh-ch[aria-current="true"]{color:#fff}
.mh-ch i{display:block;height:2px;border-radius:3px;background:rgba(255,255,255,.22);overflow:hidden}
.mh-ch b{display:block;height:100%;width:100%;border-radius:inherit;background:#fff;transform:scaleX(var(--p,0));transform-origin:left center}
.mh:not(.mh-js) .mh-chapters,.mh:not(.mh-js) .mh-now{display:none}
/* the panel builds up one piece at a time for each place: the place and its state, the line, why it leaks;
   what we use joins once the coat goes on. Leaving a place, they go together, quickly */
.mh-js .mh-now :is(.mh-state,.mh-more,.mh-cap,.mh-note>div){opacity:0;transform:translateY(8px);transition:opacity .2s ease,transform .2s ease}
.mh-js.is-live .mh-now.is-in :is(.mh-state,.mh-more,.mh-cap,.mh-note-why){opacity:1;transform:none;transition:opacity .55s cubic-bezier(.2,.8,.2,1),transform .55s cubic-bezier(.2,.8,.2,1),color .4s ease}
.mh-js.is-live .mh-now.is-in .mh-cap{transition-delay:.14s}
.mh-js.is-live .mh-now.is-in .mh-note-why{transition-delay:.3s}
.mh-js.is-live .mh-now.is-in:is([data-phase="apply"],[data-phase="sealed"]) .mh-note-uses{opacity:1;transform:none;transition:opacity .55s cubic-bezier(.2,.8,.2,1) .15s,transform .55s cubic-bezier(.2,.8,.2,1) .15s}
.mh-js.is-live .mh-now.is-in:is([data-phase="apply"],[data-phase="sealed"]) .mh-note-why{opacity:0;transform:translateY(-6px);transition:opacity .25s ease,transform .25s ease}
.mh-js.is-live .mh-now.is-in .mh-cap.is-fade{opacity:0;transition:opacity .18s ease;transition-delay:0s}
.mh-js .mh-now.is-reset :is(.mh-state,.mh-more,.mh-cap,.mh-note>div){transition:none !important}
.mh a:focus-visible,.mh button:focus-visible{outline:2px solid #fff;outline-offset:3px}

/* the words rise in as the loading screen's water runs off */
.mh-js:not(.is-live) .mh-card>*,.mh-js:not(.is-live) .mh-foot{opacity:0;transform:translateY(16px)}
.mh-js .mh-card>*,.mh-js .mh-foot{transition:opacity 1s cubic-bezier(.22,1,.36,1),transform 1s cubic-bezier(.22,1,.36,1)}
.mh-js .mh-card>:nth-child(2){transition-delay:.08s}
.mh-js .mh-card>:nth-child(3){transition-delay:.16s}
.mh-js .mh-foot{transition-delay:.3s}

/* short laptop screens: everything still fits on the first screen */
@media (max-height:780px) and (min-width:900px) and (min-aspect-ratio:7/5){
  .mh-body{gap:1.25rem;padding-top:calc(var(--nav-h,64px) + 1.5rem)}
  .mh-kicker{margin-bottom:.45rem}
  .mh-lede{margin-top:.55rem}
  .mh-ctas{margin-top:.9rem}
  .mh-more{margin-top:.6rem}
  .mh-ask{display:none}
  .mh-chapters{margin-top:1rem}
}
@media (max-width:1180px) and (min-width:900px){.mh-card,.mh-foot{width:min(36rem,76vw)}.mh-shade{background:radial-gradient(80% 66% at 50% 100%,rgba(5,14,21,.84) 0,rgba(5,14,21,.46) 52%,rgba(5,14,21,0) 78%),linear-gradient(180deg,rgba(5,14,21,.42) 0,rgba(5,14,21,0) 20%)}}

/* phones and upright screens: the whole frame at the top, the words under it */
@media (max-width:899px),(max-aspect-ratio:7/5){
  .mh{min-height:0;display:flex;flex-direction:column}
  .mh-stage{position:relative;inset:auto;margin-top:var(--nav-h,60px);aspect-ratio:16/9;width:100%;flex:none}
  .mh-film{object-position:50% 50%}
  .mh-shade{display:none}
  .mh-chip{position:absolute;left:.6rem;bottom:.6rem;display:flex;align-items:center;gap:.6rem;margin:0;padding:.35rem .75rem;border-radius:999px;background:rgba(5,14,21,.72);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);font-size:var(--fs-body,1rem);font-weight:600;color:#fff;transition:opacity .22s ease}
  .mh-chip.is-swap{opacity:0}
  .mh:not(.mh-js) .mh-chip{display:none}
  .mh-body{min-height:0;display:flex;flex-direction:column;justify-content:flex-start;gap:1.6rem;padding:.75rem .75rem 2rem}
  .mh-card,.mh-foot{width:100%;max-width:36rem;margin-inline:auto}
  .mh-foot{order:-1}
  .mh-now .mh-state{display:none}
  .mh-now{display:block}
  .mh-cap{margin:0;min-height:2.5em;text-shadow:none}
  .mh-note{text-shadow:none;margin:.45rem auto 0;min-height:3em}
  .mh-more{margin-top:.55rem}
  /* the film has played: the hook takes the panel's place under the film */
  .mh-hook{position:static;display:block;width:100%;max-width:36rem;margin-inline:auto;padding:.5rem 0 0;order:-2}
  .mh-hook .mh-title{max-width:none}
  .mh-hook .mh-kicker{margin-bottom:.8rem}
  .mh-hook .mh-lede{margin-top:.9rem}
  .mh-hook .mh-ctas{margin-top:1.3rem}
  .mh-js:not(.is-ended) .mh-hook{display:none}
  .mh-js.is-ended .mh-hook>*{animation:mh-hook-in .8s cubic-bezier(.2,.8,.2,1) both}
  .mh-js.is-ended .mh-hook>:nth-child(2){animation-delay:.1s}
  .mh-js.is-ended .mh-hook>:nth-child(3){animation-delay:.2s}
  .mh-js.is-ended .mh-hook>:nth-child(4){animation-delay:.32s}
  .mh-js.is-ended .mh-foot{display:none}
  .mh.is-ended .mh-chip{opacity:0}
  .mh-shade-end{display:none}
  /* here the link sits under the lines, so it comes in last */
  .mh-js.is-live .mh-now.is-in .mh-more{transition-delay:.45s}
  .mh-chapters{margin-top:1.1rem}
  .mh-row{gap:.75rem}
  .mh-row ol{gap:.5rem}
  .mh-card{padding:0 .1rem}
  .mh-kicker{margin-bottom:.45rem}
  .mh-lede{margin-top:.6rem}
  .mh-ctas{margin-top:1rem}
}

@keyframes mh-hook-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){
  .mh-js .mh-card>*,.mh-js .mh-foot,.mh-now,.mh-chip,.mh-cap{transition:none}
  .mh-js .mh-now :is(.mh-state,.mh-more,.mh-cap,.mh-note>div){transition:none !important}
  .mh-js .mh-hook>*,.mh-shade-end{transition:none !important;animation:none !important}
}
@media (pointer:coarse){
  .mh-more{position:relative}
  .mh-more::after{content:"";position:absolute;inset:-11px -6px}
}
`;
