/**
 * The home film section: the film of an apartment building being built, held
 * on screen while the page scrolls through it, one stage per scroll
 * (lib/build-film/copy.ts `film`, lib/build-film/mount.ts). The section is
 * as tall as seven screens' worth of scrolling; inside it, one screen stays
 * pinned to the top of the window. Each step of scrolling plays the next
 * stage of the build and stops in close on that stage's chemical; the
 * seventh shows the finished building and the hook (the promise, the free
 * visit, two buttons), and the page carries on below.
 *
 * The words sit together at the bottom left, clear of the building and of
 * the makers' marks at the bottom right: the stage and its number, the one
 * product we use there and what it does, why the stage needs it, and under
 * them the stages as one thin timeline (each jumps to its stage) with a line
 * saying to scroll on.
 *
 * On phones and upright screens the film sits whole at the top (16:9, so
 * nothing in the frame is cut off) with the words under it, still pinned.
 *
 * Plain strings, so the server renders every word and the page reads in full
 * before scripts arrive. Without scripts there is no pinning: one screen, the
 * film's poster (the finished building) and the hook. The look is the monsoon
 * film's (lib/monsoon/markup.ts), so the class names are the same.
 */
import { film, hook, intro, noteLabels, stages } from "./copy";

export interface BuildData {
  whatsapp: string;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const out = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const tick = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const wa = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z"/></svg>`;
const down = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M4 9l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const mouse = `<svg class="mh-mouse" viewBox="0 0 20 30" aria-hidden="true"><rect x="1.5" y="1.5" width="17" height="27" rx="8.5" fill="none" stroke="currentColor" stroke-width="1.5"/><rect class="mh-wheel" x="8.6" y="6" width="2.8" height="6" rx="1.4" fill="currentColor"/></svg>`;
const total = String(stages.length).padStart(2, "0");
/** the stage's place in the build: "03 / 06" */
const count = (i: number) => `<span class="mh-flag"><i></i><b class="mh-count">${String(i + 1).padStart(2, "0")}</b><b class="mh-of">/ ${total}</b></span>`;

export function buildMarkup(d: BuildData) {
  const first = stages[0]!;
  const chapters = stages
    .map(
      (s) =>
        `<li><button type="button" class="mh-ch" data-ch="${s.key}" aria-label="Show ${esc(s.name.toLowerCase())}"><span>${esc(s.short)}</span><i aria-hidden="true"><b></b></i></button></li>`,
    )
    .join("");

  return `<div class="mh-pin">
<div class="mh-stage">
  <video class="mh-film" muted playsinline disablepictureinpicture disableremoteplayback controlslist="nodownload nofullscreen noremoteplayback" preload="metadata" poster="${esc(film.poster)}" aria-label="${esc(film.label)}">
    <source src="${esc(film.phone)}" type="video/mp4" media="(max-width: 767px)">
    <source src="${esc(film.narrow)}" type="video/mp4" media="(max-width: 899px), (max-aspect-ratio: 7/5)">
    <source src="${esc(film.wide)}" type="video/mp4">
  </video>
  <div class="mh-shade" aria-hidden="true"></div>
  <div class="mh-shade-end" aria-hidden="true"></div>
  <p class="mh-chip" aria-hidden="true"><span class="mh-chip-place">${esc(first.short)}</span>${count(0)}</p>
</div>
<div class="mh-body">
  <h1 class="mh-sr">${esc(intro.title)} ${esc(intro.lede)}</h1>
  <div class="mh-hook">
    <p class="mh-kicker">${esc(hook.kicker)}</p>
    <p class="mh-title">${esc(hook.title)}</p>
    <p class="mh-lede">${esc(hook.body)}</p>
    <ul class="mh-points">${hook.points.map((p) => `<li>${tick}<span>${esc(p)}</span></li>`).join("")}</ul>
    <div class="mh-ctas">
      <a class="mh-btn mh-btn--solid" href="${esc(hook.book.href)}" data-internal>${esc(hook.book.label)}</a>
      <a class="mh-btn mh-btn--line" href="${esc(d.whatsapp)}" target="_blank" rel="noopener noreferrer">${wa}${esc(hook.chat)}</a>
    </div>
  </div>
  <div class="mh-foot">
    <div class="mh-now" data-zone="${first.key}">
      <p class="mh-state"><span class="mh-place">${esc(first.name)}</span>${count(0)}</p>
      <p class="mh-uses"><span class="mh-uses-k">${esc(noteLabels[1])}</span><span class="mh-prod">${esc(first.product.name)}</span></p>
      <p class="mh-does">${esc(first.product.does)}</p>
      <p class="mh-why"><span class="mh-sr">${esc(noteLabels[0])}: </span><span class="mh-why-t">${esc(first.purpose)}</span></p>
      <a class="mh-more" href="${esc(first.link.href)}" data-internal>${esc(first.link.label)}${out}</a>
    </div>
    <div class="mh-chapters">
      <p class="mh-ask mh-sr" id="mh-ask">${esc(intro.ask)}</p>
      <ol aria-labelledby="mh-ask">${chapters}</ol>
    </div>
  </div>
</div>
<p class="mh-hint" aria-hidden="true">${mouse}<span>${esc(intro.next)}</span></p>
</div>
<template class="mh-captions">${stages
    .map(
      (s, i) =>
        `<div data-zone="${s.key}" data-n="${i + 1}" data-short="${esc(s.short)}" data-place="${esc(s.name)}" data-href="${esc(s.link.href)}" data-label="${esc(s.link.label)}" data-prod="${esc(s.product.name)}" data-does="${esc(s.product.does)}" data-why="${esc(s.purpose)}" data-hint="${esc(i < stages.length - 1 ? intro.next : intro.last)}"></div>`,
    )
    .join("")}</template>`;
}

export const BUILD_CSS = `
.mh{--mh-ink:#eef3f5;--mh-mute:rgba(226,236,240,.76);--mh-bg:#0a1823;--mh-blue:#9fd3ea;--mh-step:72vh;position:relative;background:var(--mh-bg);color:var(--mh-ink);isolation:isolate;overflow:clip}
@supports (height:1svh){.mh{--mh-step:72svh}}
/* scrolling through the section: one screen held at the top while the page moves through seven steps */
.mh.mh-js{height:calc(100vh + 6 * var(--mh-step));height:calc(100svh + 6 * var(--mh-step))}
.mh-pin{position:relative;height:100vh;height:100svh;overflow:hidden}
.mh-js .mh-pin{position:sticky;top:0}
.mh-stage{position:absolute;inset:0;z-index:0}
/* the frame's bottom right corner (the makers' marks) always stays in view: a screen of another shape loses sky or the left edge */
.mh-film{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:100% 100%;background:var(--mh-bg)}
/* a wash at the bottom left keeps the words clear of the picture */
.mh-shade{position:absolute;inset:0;pointer-events:none;background:radial-gradient(82% 92% at 0% 100%,rgba(4,11,17,.93) 0,rgba(4,11,17,.78) 30%,rgba(4,11,17,.38) 56%,rgba(4,11,17,0) 80%),linear-gradient(0deg,rgba(4,11,17,.42) 0,rgba(4,11,17,0) 34%),linear-gradient(180deg,rgba(5,14,21,.4) 0,rgba(5,14,21,0) 18%)}
.mh-chip{display:none}
/* the site's leak helper (components/leakbot) stays away while the stages play, and comes back once they are done */
html.mh-on .lb-launch,html.mh-on .lb-hint{opacity:0 !important;visibility:hidden !important;pointer-events:none !important;transition:opacity .3s ease,visibility 0s linear .3s !important}
.mh-body{position:relative;z-index:1;height:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:flex-start;padding:calc(var(--nav-h,64px) + 2rem) clamp(1.5rem,5vw,4.5rem) clamp(5.4rem,13vh,7rem);box-sizing:border-box}
.mh-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}

/* the hook, on the left in the middle of the height once the film has played (without scripts it is simply there) */
.mh-hook{position:absolute;inset:0;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;padding:calc(var(--nav-h,64px) + 1rem) var(--gutter,1.5rem) clamp(2rem,6vh,4rem) clamp(2.5rem,8vw,9rem);text-align:left;pointer-events:none}
.mh-hook>*{pointer-events:auto}
.mh-kicker{display:flex;align-items:center;gap:.75rem;margin:0 0 1.15rem;font-family:var(--font-inter-tight),system-ui,sans-serif;font-size:var(--fs-body,1rem);font-weight:500;line-height:1.4;color:rgba(226,236,240,.86);text-shadow:0 1px 14px rgba(0,0,0,.5)}
.mh-kicker::before{content:"";flex:none;width:2rem;height:2px;border-radius:2px;background:var(--mh-blue)}
.mh-title{display:block;margin:0;max-width:12ch;font-family:var(--font-inter-tight),"Segoe UI",system-ui,sans-serif;font-size:clamp(2.6rem,4.6vw,4.3rem);font-weight:650;line-height:1;letter-spacing:-.024em;color:#fff;text-wrap:balance;text-shadow:0 2px 34px rgba(0,0,0,.42)}
.mh-lede{max-width:30rem;margin:1.35rem 0 0;font-size:calc(var(--fs-body,1rem)*1.08);line-height:1.6;color:rgba(238,243,246,.9);text-wrap:pretty;text-shadow:0 1px 14px rgba(0,0,0,.5)}
.mh-points{display:flex;flex-direction:column;gap:.55rem;margin:1.3rem 0 0;padding:0;list-style:none;font-size:var(--fs-body,1rem);font-weight:500;color:rgba(236,242,245,.92)}
.mh-points li{display:inline-flex;align-items:center;gap:.5rem;text-shadow:0 1px 12px rgba(0,0,0,.5)}
.mh-points svg{flex:none;width:18px;height:18px;padding:3px;border-radius:50%;background:rgba(159,211,234,.18);color:var(--mh-blue);box-sizing:border-box}
.mh-ctas{display:flex;flex-wrap:wrap;justify-content:flex-start;gap:.75rem;margin-top:2.1rem}
.mh-btn{display:inline-flex;align-items:center;gap:.55rem;height:3.15rem;padding:0 1.5rem;border-radius:999px;font-size:var(--fs-body,1rem);font-weight:600;line-height:1;text-decoration:none;white-space:nowrap;transition:background-color .3s,color .3s,border-color .3s,transform .3s}
.mh-btn svg{width:19px;height:19px}
.mh-btn--solid{background:#f3f6f7;color:#0b1d2b;box-shadow:0 14px 30px -14px rgba(0,0,0,.6)}
.mh-btn--solid:hover{background:#fff;color:#0b2350}
.mh-btn--line{border:1px solid rgba(238,243,245,.36);color:var(--mh-ink);background:rgba(6,16,24,.3);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
.mh-btn--line:hover{border-color:var(--mh-ink);background:rgba(255,255,255,.08)}
.mh-js .mh-hook{visibility:hidden;transition:visibility 0s linear .35s}
.mh-js .mh-hook>*{opacity:0;transform:translateY(12px);transition:opacity .3s ease,transform .3s ease}
.mh-js.is-ended .mh-hook{visibility:visible;transition:none}
.mh-js.is-ended .mh-hook>*{opacity:1;transform:none;transition:opacity .9s cubic-bezier(.2,.8,.2,1),transform .9s cubic-bezier(.2,.8,.2,1)}
.mh-js.is-ended .mh-hook>:nth-child(2){transition-delay:.12s}
.mh-js.is-ended .mh-hook>:nth-child(3){transition-delay:.24s}
.mh-js.is-ended .mh-hook>:nth-child(4){transition-delay:.36s}
.mh-js.is-ended .mh-hook>:nth-child(5){transition-delay:.48s}
/* the film has played: the words step away, a shade on the left keeps the hook clear of the picture */
.mh-shade-end{position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,rgba(5,14,21,.9) 0,rgba(5,14,21,.72) 34%,rgba(5,14,21,.2) 64%,rgba(5,14,21,0) 80%),linear-gradient(180deg,rgba(5,14,21,.3) 0,rgba(5,14,21,0) 24%);opacity:0;transition:opacity .9s ease}
.mh.is-ended .mh-shade-end,.mh:not(.mh-js) .mh-shade-end{opacity:1}
.mh-js .mh-foot{transition:opacity .4s ease,visibility 0s linear 0s}
.mh-js.is-ended .mh-foot{opacity:0;visibility:hidden;transition:opacity .4s ease,visibility 0s linear .4s}
.mh:not(.mh-js) .mh-foot{display:none}

/* the words, together at the bottom left: the stage, what we use and what it does, why the stage needs it */
.mh-foot{width:min(36rem,46vw);text-align:left}
.mh-now{position:relative;padding-left:1.15rem}
.mh-now::before{content:"";position:absolute;left:0;top:.2rem;bottom:.2rem;width:3px;border-radius:3px;background:rgba(159,211,234,.4);transition:background-color .5s ease}
.mh-now.is-close::before{background:var(--mh-blue)}
.mh-state{display:flex;align-items:center;flex-wrap:wrap;gap:.65rem;margin:0;font-size:var(--fs-body,1rem);font-weight:500;color:rgba(232,240,244,.86);text-shadow:0 1px 12px rgba(0,0,0,.6)}
.mh-place{color:#fff}
.mh-flag{display:inline-flex;align-items:baseline;gap:.3rem;color:var(--mh-blue);font-weight:500;font-variant-numeric:tabular-nums}
.mh-flag i{align-self:center;width:7px;height:7px;margin-right:.15rem;border-radius:50%;background:currentColor;box-shadow:0 0 0 4px rgba(159,211,234,.2)}
.mh-flag b{font-weight:600}
.mh-flag .mh-of{font-weight:500;color:rgba(226,236,240,.6)}
.mh-uses{display:flex;flex-direction:column;gap:.15rem;margin:.95rem 0 0}
.mh-uses-k{font-size:calc(var(--fs-body,1rem)*.88);font-weight:500;color:var(--mh-blue)}
.mh-prod{font-family:var(--font-inter-tight),"Segoe UI",system-ui,sans-serif;font-size:clamp(1.55rem,2.3vw,2.2rem);font-weight:650;line-height:1.1;letter-spacing:-.022em;color:#fff;text-wrap:balance;text-shadow:0 2px 26px rgba(0,0,0,.45)}
.mh-does{margin:.55rem 0 0;max-width:32rem;font-size:calc(var(--fs-body,1rem)*1.06);line-height:1.5;color:rgba(240,245,247,.94);text-wrap:pretty;text-shadow:0 1px 14px rgba(0,0,0,.55)}
.mh-why{margin:.45rem 0 0;max-width:32rem;font-size:var(--fs-body,1rem);line-height:1.5;color:rgba(222,232,237,.74);text-wrap:pretty;text-shadow:0 1px 14px rgba(0,0,0,.55)}
.mh-more{display:none}

/* the stages, in order, as one thin timeline: each line fills as the film goes through it */
.mh-chapters{margin:1.6rem 0 0}
.mh-chapters ol{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:.5rem;margin:0;padding:0;list-style:none}
.mh-ch{display:flex;flex-direction:column-reverse;gap:.45rem;width:100%;padding:.35rem 0 0;border:0;background:none;color:rgba(230,238,242,.66);text-shadow:0 1px 10px rgba(0,0,0,.6);font:inherit;font-size:calc(var(--fs-body,1rem)*.88);font-weight:500;line-height:1.2;text-align:left;cursor:pointer;transition:color .3s}
.mh-ch span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mh-ch:hover,.mh-ch[aria-current="true"]{color:#fff}
.mh-ch i{display:block;height:2px;border-radius:3px;background:rgba(255,255,255,.22);overflow:hidden}
.mh-ch b{display:block;height:100%;width:100%;border-radius:inherit;background:#fff;transform:scaleX(var(--p,0));transform-origin:left center}
/* the scroll cue: a line-drawn mouse with its wheel rolling and the words under it, centred at the bottom, no box, so it sits in the picture */
.mh-hint{position:absolute;left:50%;bottom:clamp(.9rem,3.2vh,1.75rem);z-index:2;display:flex;flex-direction:column;align-items:center;gap:.7rem;margin:0;color:#fff;white-space:nowrap;line-height:1.1;transform:translateX(-50%);transition:opacity .35s ease,visibility 0s linear 0s}
.mh-hint .mh-mouse{display:block;width:1.55rem;height:2.4rem;overflow:visible;filter:drop-shadow(0 1px 8px rgba(0,0,0,.45))}
.mh-hint .mh-wheel{animation:mh-wheel 1.7s ease-in-out infinite}
.mh-hint span{font-size:calc(var(--fs-body,1rem)*.95);font-weight:500;letter-spacing:.01em;color:rgba(255,255,255,.9);text-shadow:0 1px 10px rgba(0,0,0,.55)}
.mh-hint.is-off{opacity:0;visibility:hidden;transition:opacity .35s ease,visibility 0s linear .35s}
.mh-js:not(.is-live) .mh-hint{opacity:0}
@keyframes mh-wheel{0%{transform:translateY(0);opacity:1}60%{transform:translateY(7px);opacity:0}100%{transform:translateY(0);opacity:0}}
@keyframes mh-nudge{0%,100%{transform:none}50%{transform:translateY(3px)}}
.mh a:focus-visible,.mh button:focus-visible{outline:2px solid #fff;outline-offset:3px}

/* each stage, the words build up one at a time: the stage, the product, what it does, why. Leaving a stage, they go together, quickly */
.mh-js .mh-now>*{opacity:0;transform:translateY(8px);transition:opacity .2s ease,transform .2s ease}
.mh-js.is-live .mh-now.is-in>*{opacity:1;transform:none;transition:opacity .55s cubic-bezier(.2,.8,.2,1),transform .55s cubic-bezier(.2,.8,.2,1)}
.mh-js.is-live .mh-now.is-in>:nth-child(2){transition-delay:.1s}
.mh-js.is-live .mh-now.is-in>:nth-child(3){transition-delay:.22s}
.mh-js.is-live .mh-now.is-in>:nth-child(4){transition-delay:.34s}
.mh-js .mh-now.is-reset>*{transition:none !important}
/* the words rise in as the loading screen's water runs off */
.mh-js:not(.is-live) .mh-foot{opacity:0;transform:translateY(16px)}
.mh-js.is-live:not(.is-ended) .mh-foot{transition:opacity 1s cubic-bezier(.22,1,.36,1) .3s,transform 1s cubic-bezier(.22,1,.36,1) .3s,visibility 0s linear 0s}

/* short laptop screens */
@media (max-height:780px) and (min-width:900px) and (min-aspect-ratio:7/5){
  .mh-uses{margin-top:.7rem}
  .mh-prod{font-size:clamp(1.4rem,2vw,1.85rem)}
  .mh-chapters{margin-top:1.1rem}
}
@media (max-width:1180px) and (min-width:900px){.mh-foot{width:min(34rem,62vw)}}

/* phones and upright screens: the whole frame at the top, the words under it, still held while scrolling */
@media (max-width:899px),(max-aspect-ratio:7/5){
  /* no scrolling through it: the film plays by itself to the finished building (lib/build-film/mount.ts, "auto") */
  .mh.mh-js{height:auto;min-height:100vh;min-height:100svh}
  .mh-js .mh-pin{position:relative;height:auto;min-height:100vh;min-height:100svh}
  .mh-hint{display:none}
  .mh-pin{display:flex;flex-direction:column}
  .mh-stage{position:relative;inset:auto;margin-top:var(--nav-h,60px);aspect-ratio:16/9;width:100%;flex:none}
  .mh-film{object-position:50% 50%}
  .mh-shade{display:none}
  .mh-chip{position:absolute;left:.6rem;bottom:.6rem;display:flex;align-items:center;gap:.6rem;margin:0;padding:.35rem .75rem;border-radius:999px;background:rgba(5,14,21,.72);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);font-size:var(--fs-body,1rem);font-weight:600;color:#fff;transition:opacity .22s ease}
  .mh-chip.is-swap{opacity:0}
  .mh:not(.mh-js) .mh-chip,.mh.is-ended .mh-chip{opacity:0}
  .mh-body{flex:1;height:auto;justify-content:flex-start;padding:1.1rem 1rem 1.6rem}
  .mh-foot{width:100%;max-width:36rem;margin-inline:auto}
  .mh-now .mh-state{display:none}
  .mh-uses{margin-top:0}
  .mh-prod{font-size:clamp(1.35rem,5.8vw,1.7rem);text-shadow:none}
  .mh-does,.mh-why{text-shadow:none}
  .mh-more{display:inline-flex;align-items:center;gap:.4rem;margin-top:.6rem;color:rgba(230,238,242,.78);font-size:var(--fs-body,1rem);font-weight:500;text-decoration:none}
  .mh-more svg{width:14px;height:14px}
  .mh-chapters{margin-top:1.1rem}
  .mh-chapters ol{grid-template-columns:repeat(3,minmax(0,1fr));row-gap:.9rem}
  .mh-ch{font-size:calc(var(--fs-body,1rem)*.82)}
  /* the film has played: the hook takes the words' place under the film */
  .mh-hook{position:static;display:block;width:100%;max-width:36rem;margin-inline:auto;padding:0;pointer-events:auto}
  .mh-title{max-width:none;font-size:clamp(1.9rem,8.4vw,2.5rem)}
  .mh-btn{height:3rem;padding:0 1.25rem}
  .mh-kicker{margin-bottom:.8rem}
  .mh-lede{margin-top:.9rem}
  .mh-ctas{margin-top:1.3rem}
  .mh-js:not(.is-ended) .mh-hook{display:none}
  .mh-js.is-ended .mh-foot{display:none}
  .mh-js.is-ended .mh-hook>*{animation:mh-hook-in .8s cubic-bezier(.2,.8,.2,1) both}
  .mh-js.is-ended .mh-hook>:nth-child(2){animation-delay:.1s}
  .mh-js.is-ended .mh-hook>:nth-child(3){animation-delay:.2s}
  .mh-js.is-ended .mh-hook>:nth-child(4){animation-delay:.3s}
  .mh-js.is-ended .mh-hook>:nth-child(5){animation-delay:.4s}
  .mh-points{gap:.5rem;margin-top:1rem}
  .mh-shade-end{display:none}
  /* phones: the film is upright and fills the screen; the words sit on it, the picture fading into the page colour */
  @media (max-width:767px){
    .mh-pin{justify-content:flex-end}
    .mh-stage{position:absolute;top:0;left:0;right:0;margin:0;width:100%;height:100vh;height:100svh;aspect-ratio:auto}
    .mh-stage::before{content:"";position:absolute;left:0;right:0;top:0;height:6rem;background:linear-gradient(to bottom,rgba(10,24,35,.85),rgba(10,24,35,0));pointer-events:none}
    .mh-stage::after{content:"";position:absolute;left:0;right:0;bottom:0;height:68%;background:linear-gradient(to bottom,rgba(10,24,35,0) 0,rgba(10,24,35,.55) 28%,rgba(10,24,35,.9) 52%,#0a1823 72%);pointer-events:none;transition:height .7s ease}
    .mh-js.is-ended .mh-stage::after{height:82%}
    .mh-film{transform-origin:50% 0;transition:transform .9s cubic-bezier(.2,.7,.2,1)}
    .mh-js.is-ended .mh-film{transform:translateY(-13%) scale(1.16)}
    .mh-chip{z-index:2;top:calc(var(--nav-h,60px) + .8rem);bottom:auto;left:.8rem}
    .mh-body{flex:none;padding:0 1rem 1.6rem}
    /* the bar at the top is a solid page colour, so the logo and buttons read on any picture */
    .mh-stage::before{z-index:1;height:calc(var(--nav-h,60px) + 2.2rem);background:linear-gradient(to bottom,#0a1823 0,#0a1823 calc(100% - 2.2rem),rgba(10,24,35,0))}
    /* the chip names the stage; the numbers 1 to 6 are the buttons at the bottom */
    .mh-chip .mh-flag{display:none}
    .mh-chip{padding:.4rem .95rem}
    /* the words: a soft glass card */
    .mh-now{padding:1.05rem 1.1rem 1.1rem;border-radius:22px;background:linear-gradient(160deg,rgba(16,36,52,.74),rgba(8,20,30,.8));border:1px solid rgba(255,255,255,.12);-webkit-backdrop-filter:blur(14px) saturate(1.2);backdrop-filter:blur(14px) saturate(1.2);box-shadow:0 18px 40px -20px rgba(0,0,0,.7)}
    .mh-now::before{display:none}
    .mh-uses{gap:.55rem}
    .mh-uses-k{align-self:flex-start;padding:.18rem .65rem;border-radius:999px;background:rgba(159,211,234,.14);font-size:.74rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase}
    .mh-more{margin-top:.8rem;padding:.5rem .95rem;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);color:#fff;font-size:.9rem}
    /* the six stages: numbered buttons, the one showing opens to its name and fills as it plays */
    .mh-chapters{margin-top:.8rem}
    .mh-chapters ol{display:flex;gap:.4rem;counter-reset:ch}
    .mh-chapters li{display:flex;flex:none;counter-increment:ch}
    .mh-chapters li:has(.mh-ch[aria-current="true"]){flex:1 1 auto;min-width:0}
    .mh-ch{position:relative;overflow:hidden;flex:1 1 auto;width:auto;flex-direction:row;align-items:center;justify-content:center;gap:.4rem;height:2.5rem;min-width:2.3rem;padding:0 .55rem;border-radius:999px;border:1px solid rgba(255,255,255,.16);background:rgba(10,24,35,.6);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);color:rgba(255,255,255,.8);font-size:.92rem;font-weight:650;text-shadow:none}
    .mh-ch::before{content:counter(ch);position:relative;z-index:1;font-variant-numeric:tabular-nums}
    .mh-ch span{display:none;position:relative;z-index:1;font-size:.88rem;font-weight:600}
    .mh-ch[aria-current="true"]{border-color:rgba(159,211,234,.75);background:rgba(159,211,234,.12);color:#fff}
    .mh-ch[aria-current="true"] span{display:block}
    .mh-ch i{position:absolute;inset:0;height:auto;border-radius:0;background:none}
    .mh-ch b{background:rgba(159,211,234,.26)}
    @media (max-width:370px){.mh-chapters ol{gap:.3rem}.mh-ch{min-width:2.1rem;padding:0 .4rem}.mh-ch span{font-size:.82rem}}
  }
}
@keyframes mh-hook-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){
  .mh-js .mh-foot,.mh-now::before,.mh-chip,.mh-hint{transition:none !important}
  .mh-js .mh-now>*{transition:none !important}
  .mh-hint .mh-wheel{animation:none}
  .mh-js .mh-hook>*,.mh-shade-end{transition:none !important;animation:none !important}
}
@media (pointer:coarse){
  .mh-more{position:relative}
  .mh-more::after{content:"";position:absolute;inset:-11px -6px}
}
`;
