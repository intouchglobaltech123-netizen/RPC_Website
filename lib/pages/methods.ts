/**
 * Waterproofing page, kept to what RPC's "Types of Waterproofing Methods"
 * document says:
 *
 *   opening   the title and the ways to start; then
 *             "Where is the water getting in?": the eight places our services
 *             cover, on a drawing of a house (lib/pages/methods-tools.ts)
 *   rain test pick a method and watch where it stops the water (lib/pages/methods-rain.ts)
 *   close     the ways to start
 *
 * Links to /waterproofing#a-<place> open that place on the drawing.
 */
import type { Product } from "../products";
import { type ContactInfo, type PageOptions } from "./kit";
import { methodsData, METHODS_TOOLS_CSS, placeMapMarkup } from "./methods-tools";
import { RAIN_CSS, rainMarkup } from "./methods-rain";

export interface MethodsData {
  products: readonly Product[];
  contact: ContactInfo;
}

export const METHODS_TRAIL = [
  { name: "Home", href: "/" },
  { name: "Waterproofing", href: "/waterproofing" },
] as const;


export function methodsPageMarkup(d: MethodsData, o: PageOptions = {}) {
  void o;
  // the opening: the monsoon house film from the home page, on a loop, one screen tall, with the page's title in the middle of it
  const film = `<header class="wp-film" aria-label="A house in the monsoon rain, kept dry" data-nav-tone="dark">
  <figure class="wp-fbox">
    <video class="wp-fvid" poster="/videos/hero/monsoon-house-poster.jpg" muted loop playsinline autoplay preload="metadata" data-loop aria-hidden="true"><source src="/videos/hero/monsoon-house-540.mp4" type="video/mp4" media="(max-width: 767px)"><source src="/videos/hero/monsoon-house-720.mp4" type="video/mp4"></video>
    <div class="wp-fhead">
      <p class="pg-mark">Waterproofing</p>
      <h1 class="pg-h1">Waterproofing methods<br class="wp-br"> for every part of a&nbsp;building.</h1>
    </div>
  </figure>
</header>`;

  return `${film}\n${placeMapMarkup(d.products)}\n${rainMarkup()}\n${methodsData(d.products)}`;
}

/* ---------------------------------------------------------------- CSS */
const BASE_CSS = `
/* opening: the title and the ways to start, with the house straight under them */
.wp-head{padding-bottom:0;border-bottom:0}
.wp-hgrid{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:1.4rem clamp(2rem,6vw,6rem);align-items:end}
.wp-hgrid .pg-mark{margin-bottom:.9rem}
.wp-hgrid .pg-h1{max-width:17ch}
@media (min-width:768px){.wp-hgrid .pg-h1{max-width:none}}
@media (max-width:767px){.wp-br{display:none}}
/* the two ways to start, side by side */
.wp-hside .pg-actions{flex-wrap:nowrap}
@media (min-width:1280px){.wp-hgrid{grid-template-columns:minmax(0,1fr) auto;gap:1.4rem clamp(2rem,3.5vw,4rem)}}
@media (max-width:1279px){.wp-hgrid{grid-template-columns:minmax(0,1fr)}}
@media (max-width:599px){.wp-hside .pg-actions{flex-wrap:wrap}}
.wp-hside .pg-intro{margin:0;max-width:34rem}

/* the twelve methods, kind by kind */
.wp-kinds{border-top:2px solid var(--ink)}
.wp-kind{display:grid;grid-template-columns:minmax(17rem,22rem) minmax(0,1fr);gap:1.2rem clamp(2rem,5vw,5rem);padding:clamp(1.4rem,3vh,2rem) 0;border-bottom:1px solid rgba(18,34,59,.2)}
.wp-khead{position:sticky;top:calc(var(--nav-bar,80px) + 1.4rem);align-self:start;padding-top:.7rem}
.wp-kart{width:100%;max-width:22rem;margin:0 0 .9rem}
.wp-kart img{display:block;width:100%;height:auto}
.wp-kname{margin:0;font-family:var(--display);font-weight:600;font-size:var(--fs-sub);line-height:1.2;letter-spacing:-.01em}
.wp-kline{margin:.35rem 0 0;max-width:15rem;font-size:var(--fs-body);line-height:1.5;color:var(--mute)}
.wp-rows{margin:0;padding:0;list-style:none}
.wp-row{scroll-margin-top:calc(var(--nav-bar,80px) + 1.2rem)}
.wp-row + .wp-row{border-top:1px solid var(--line)}
.wp-row:has(> .wp-d[open]),.wp-row:has(> .wp-d[open]) + .wp-row{border-top-color:transparent}
.wp-row:has(> .wp-d[open]) + .wp-row:has(> .wp-d[open]){margin-top:.6rem}
.wp-d{border-radius:8px;transition:background-color .25s,box-shadow .25s}
.wp-d[open]{background:var(--card);box-shadow:0 22px 44px -36px rgba(18,34,59,.5)}
.wp-row.is-hit > .wp-d{box-shadow:inset 0 0 0 2px var(--accent),0 0 0 6px rgba(39,86,160,.12)}
.wp-sum{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.95fr) 2.5rem;gap:.3rem 2rem;align-items:center;padding:1.1rem;border-radius:8px;list-style:none;cursor:pointer;transition:background-color .2s}
.wp-sum::-webkit-details-marker{display:none}
.wp-d:not([open]) > .wp-sum:hover{background:rgba(245,240,230,.6)}
.wp-sum:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}
.wp-sn{display:flex;flex-direction:column;gap:.2rem;min-width:0}
.wp-sname{font-family:var(--display);font-weight:600;font-size:var(--fs-sub);line-height:1.25;letter-spacing:-.01em;color:var(--ink)}
.wp-sapp{font-size:var(--fs-body);line-height:1.45;color:var(--mute)}
.wp-sareas{font-size:var(--fs-body);line-height:1.5;color:var(--ink2)}
.wp-plus{display:grid;place-items:center;width:2.5rem;height:2.5rem;border-radius:50%;box-shadow:inset 0 0 0 1.5px rgba(18,34,59,.24);color:var(--ink);transition:transform .3s cubic-bezier(.2,.7,.2,1),background-color .2s,color .2s,box-shadow .2s}
.wp-plus svg{width:1.05rem;height:1.05rem}
.wp-sum:hover .wp-plus{box-shadow:inset 0 0 0 1.5px var(--navy)}
.wp-d[open] .wp-plus{transform:rotate(45deg);background:var(--navy);box-shadow:none;color:#f5f0e6}
.wp-body{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.95fr) 2.5rem;gap:1.2rem 2rem;padding:0 1.1rem 1.3rem}
.wp-d[open] .wp-body{animation:wp-in .3s ease both}
@keyframes wp-in{from{opacity:0}to{opacity:1}}
.wp-how{grid-column:1;margin:0;font-size:var(--fs-body);line-height:1.65;color:var(--ink2)}
.wp-notes{grid-column:2;margin:0}
.wp-notes div + div{margin-top:.8rem}
.wp-notes dt{font-size:var(--fs-body);font-weight:600;color:var(--water)}
.wp-notes dd{margin:.15rem 0 0;font-size:var(--fs-body);line-height:1.55}
.wp-foot{grid-column:1 / -1;display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:.9rem 2rem;padding-top:1rem;border-top:1px solid var(--line)}
.wp-prods{display:flex;flex-direction:column;gap:.6rem;min-width:0}
.wp-prods p{display:flex;flex-wrap:wrap;align-items:center;gap:.4rem;margin:0;font-size:var(--fs-body)}
.wp-prods span{margin-right:.35rem;color:var(--mute)}
.wp-prods a,.wp-prods b{display:inline-flex;align-items:center;min-height:2rem;padding:.25rem .7rem;border-radius:8px;font-weight:600;line-height:1.3}
.wp-prods a{background:var(--navy);color:#f5f0e6;text-decoration:none;transition:background-color .2s}
.wp-prods a:hover{background:var(--accent)}
.wp-prods b{box-shadow:inset 0 0 0 1px rgba(18,34,59,.2)}

/* opening a method slides its details down (where the browser can animate to the content's height) */
.wp-d{interpolate-size:allow-keywords}
.wp-d::details-content{height:0;overflow:clip;transition:height .35s cubic-bezier(.2,.7,.2,1),content-visibility .35s allow-discrete}
.wp-d[open]::details-content{height:auto}
/* the opened details: the notes with their marks, products along the foot */
.wp-notes dt{display:flex;align-items:center;gap:.4rem}
.wp-notes dt svg{flex:none;width:1rem;height:1rem}
.wp-notes .is-good dt{color:#1f7a4f}
.wp-notes .is-mind dt{color:#a35f10}
.wp-foot:empty{display:none}

/* the monsoon house film, full width of the page, at its own proportions */
/* the film edge to edge, one screen tall, like the home page's opening; the title in its middle, on a soft shade */
.wp-film{padding:0}
.wp-fbox{position:relative;margin:0;width:100%;height:100svh;overflow:hidden;border-radius:0;background:#0b1626}
.wp-fvid{display:block;width:100%;height:100%;object-fit:cover}
.wp-fbox::after{content:"";position:absolute;inset:0;background:linear-gradient(20deg,rgba(6,16,34,.78) 0%,rgba(6,16,34,.42) 38%,rgba(6,16,34,0) 65%),linear-gradient(180deg,rgba(6,16,34,.45),transparent 22%);pointer-events:none}
.wp-fhead{position:absolute;inset:auto 0 0 0;z-index:1;display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-end;width:100%;max-width:1360px;margin:0 auto;padding:0 var(--gutter,3rem) clamp(2.4rem,9vh,5.5rem);box-sizing:border-box;text-align:left}
.wp-fhead .pg-mark{justify-content:flex-start;margin:0 0 1rem;color:rgba(255,255,255,.85)}
.wp-fhead .pg-h1{max-width:20ch;margin:0;color:#fff;text-shadow:0 2px 24px rgba(0,0,0,.35)}
/* the brands follow the methods on the same background, so they need little room above */
.wp-msec{padding-bottom:clamp(1.2rem,3vh,2rem)}
.wp-msec ~ .wp-bsec{padding-top:clamp(2rem,5vh,3rem)}
.wp-msec ~ .wp-bsec .pg-shead{border-top:0;padding-top:0}
/* brands: the fifteen as tiles moving slowly left to right; hover (or focus) pauses them */
.wp-marq{margin-inline:calc(-1 * var(--gutter,16px));overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.wp-mtrack{display:flex;gap:.9rem;width:max-content;margin:0;padding:.4rem 0;list-style:none;animation:wp-marq 70s linear infinite}
.wp-marq:hover .wp-mtrack,.wp-marq:focus-within .wp-mtrack{animation-play-state:paused}
@keyframes wp-marq{from{transform:translateX(-50%)}to{transform:translateX(0)}}
.wp-btile{display:grid;place-items:center;flex:none;width:12.5rem;height:6rem;box-sizing:border-box;padding:.9rem 1.4rem;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 1px var(--line)}
.wp-btile img{display:block;width:auto;height:auto;max-width:100%;max-height:4rem;object-fit:contain}
.wp-bname{font-family:var(--display);font-weight:600;font-size:var(--fs-sub);line-height:1.2;letter-spacing:-.01em;color:var(--ink);text-align:center}
@media (prefers-reduced-motion:reduce){
  .wp-d[open] .wp-body{animation:none}
  .wp-d::details-content{transition:none}
  .wp-marq{margin-inline:0;-webkit-mask-image:none;mask-image:none}
  .wp-mtrack{flex-wrap:wrap;width:auto;animation:none}
  .wp-mtrack li[aria-hidden]{display:none}
}

@media (max-width:1023px){
  .wp-hgrid{grid-template-columns:minmax(0,1fr);align-items:start}
}
@media (max-width:1199px){
  /* the kind's drawing and name above its methods, so the rows get the full width */
  .wp-kind{grid-template-columns:minmax(0,1fr);gap:.7rem}
  .wp-khead{position:static;display:grid;grid-template-columns:18rem minmax(0,1fr);column-gap:1.2rem;align-items:center;padding-top:0}
  .wp-kart{grid-row:1 / span 2;width:100%;margin:0}
  .wp-kname{align-self:end}
  .wp-kline{align-self:start;max-width:none;margin-top:.2rem}
}
@media (max-width:899px){
  .wp-khead{grid-template-columns:12.5rem minmax(0,1fr);column-gap:1rem}
  .wp-sum{grid-template-columns:minmax(0,1fr) 2.4rem;gap:.35rem 1rem;padding:1rem .9rem}
  .wp-sareas{grid-column:1;grid-row:2}
  .wp-plus{grid-column:2;grid-row:1 / span 2;width:2.4rem;height:2.4rem}
  .wp-body{grid-template-columns:minmax(0,1fr);gap:1rem;padding:0 .9rem 1.1rem}
  .wp-how,.wp-notes{grid-column:1}
}
@media (max-width:479px){.wp-khead{grid-template-columns:10.5rem minmax(0,1fr)}}
@media (max-width:767px){
  /* phones: the twelve in two rows that swipe sideways, so the section stays one screen */
  .wp-btile{width:10.5rem;height:5.2rem;padding:.8rem 1.1rem}
  .wp-btile img{max-height:3.4rem}
}
`;

const METHODS_MOBILE_CSS = `
@media (max-width:767px){
  /* phones: the house, the place tabs and the methods for that place, then the rain test */
  .wpx-hint,.wpx-help{display:none}
  .wpx-map{padding:1.4rem 0 2.2rem}
  .wpx-top{margin-bottom:.9rem;padding-top:1.2rem}
  .wpx-h{font-size:1.4rem}
  .wpx-tabs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.4rem;overflow:visible;margin-inline:0;padding:0}
  .wpx-tab{flex:none;justify-content:flex-start;gap:.5rem;height:2.5rem;padding:0 .5rem 0 .4rem;font-size:.95rem;min-width:0}
  .wpx-tab span{width:1.5rem;height:1.5rem;flex:none;font-size:.8rem}
  .wpx-panel .wpx-ma{display:none}
  .wpx-panel .wpx-ms .wpx-mrow{padding:.8rem 0}
  .wpx-panel .wpx-mn{font-size:1rem}
  .wpx-phead{padding:.8rem 1.1rem}
  .wpx-panel .wpx-ms{margin:0 1.1rem}
  .wpx-panel .wpx-acts{padding:.8rem 1.1rem}

  /* the method's box opens as a sheet from the foot of the screen, with the page dimmed behind it */
  .wpx-pop{inset:auto 0 0 0;width:auto;max-width:none;height:auto;max-height:86svh;margin:0;border-radius:22px 22px 0 0;box-shadow:0 0 0 100vmax rgba(4,12,30,.5),0 -20px 60px -24px rgba(4,12,30,.5);animation:wpx-sheet .3s cubic-bezier(.2,.8,.2,1)}
  .wpx-poph{position:relative;align-items:flex-start;padding:1.3rem 1rem .9rem 1.2rem;border-radius:22px 22px 0 0}
  .wpx-poph::before{content:"";position:absolute;top:.5rem;left:50%;width:2.4rem;height:4px;margin-left:-1.2rem;border-radius:3px;background:rgba(255,255,255,.3)}
  .wpx-popn{margin-top:.25rem;font-size:1.2rem;line-height:1.2}
  .wpx-popx{width:2.4rem;height:2.4rem}
  .wpx-popb{padding:1rem 1.2rem 1.1rem}
  .wpx-poptop{grid-template-columns:5.6rem minmax(0,1fr);gap:.9rem}
  .wpx-popart{max-width:none;padding:.3rem;border-radius:12px}
  .wpx-dh{font-size:.95rem;line-height:1.55}
  .wpx-duse{margin-top:.6rem;font-size:.9rem}
  .wpx-dnotes{gap:.5rem;margin-top:1rem}
  .wpx-dnotes .wpx-dn{padding:.75rem .85rem;border-radius:12px}
  .wpx-dprod{margin-top:0;padding-top:1rem}
  .wpx-dp{gap:.4rem}
  .wpx-dp a,.wpx-dp span{min-height:2.4rem;padding:.3rem .85rem;border-radius:999px;font-size:.92rem}
  .wpx-popf{gap:.7rem;padding:.75rem 1rem calc(.75rem + env(safe-area-inset-bottom,0px))}
  .wpx-popbk{flex:none;height:2.7rem;padding:0 1rem;border-radius:999px;background:rgba(18,34,59,.07)}
  .wpx-popf .pg-btn{flex:1;justify-content:center;width:auto;height:2.7rem;border-radius:999px}

  /* the rain test: the drawing, then the methods as one tidy swipe of coloured pills, then the words */
  .rt-sec{padding-top:2.4rem}
  .rt{gap:.9rem}
  .rt-head{gap:.5rem}
  .rt-head .pg-h2{font-size:1.5rem;line-height:1.15;margin-top:.4rem}
  .rt-head .pg-lede{display:none}
  .rt-step{order:2;display:flex;align-items:baseline;justify-content:space-between;margin:.1rem 0 -.4rem}
  .rt-step b{font-size:1rem;font-weight:600;color:var(--ink)}
  .rt-step span{display:none}
  .rt-stage{display:contents}
  .rt-scene{order:1;width:100%;min-height:0;height:auto;aspect-ratio:16/9;border-radius:16px;box-shadow:inset 0 0 0 1px var(--line),0 18px 36px -28px rgba(18,34,59,.5)}
  .rt-pick{order:3;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-flow:row;grid-template-rows:none;grid-auto-columns:auto;gap:.45rem;margin:0;padding:0;overflow:visible}
  .rt-group,.rt-opts,.rt-group--coat .rt-opts{display:contents}
  .rt-gh{display:none}
  .rt-group--none .rt-chip{grid-column:1 / -1}
  .rt-chip{width:100%;height:auto;min-height:2.6rem;gap:.5rem;padding:.35rem .8rem .35rem .7rem;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 1px var(--line);font-size:.92rem;line-height:1.2;white-space:normal;text-align:left}
  .rt-chip .rt-r{box-shadow:inset 0 0 0 2px var(--k)}
  .rt-chip[aria-pressed=true]{box-shadow:none}
  .rt-info{order:4;padding:1rem 1.1rem 1.1rem;border-radius:16px}
  .rt-name{font-size:1.2rem}

  /* the rain test, kept to one screen: a shorter header, three methods to a row, and one slim card for the words */
  .rt-sec{padding-top:1.7rem;padding-bottom:calc(2.2rem + 32px) !important}
  .rt{gap:.7rem}
  .rt-head{gap:.2rem}
  .rt-head .pg-h2{margin-top:.15rem;font-size:1.3rem}
  .rt-step{margin:0 0 -.3rem}
  .rt-step b{font-size:.85rem;color:var(--mute)}
  .rt-pick{grid-template-columns:repeat(3,minmax(0,1fr));gap:.35rem}
  .rt-chip{min-height:2.45rem;gap:.35rem;padding:.3rem .5rem;border-radius:12px;font-size:.76rem;line-height:1.15}
  .rt-chip .rt-r{flex:none;width:.85rem;height:.85rem}
  .rt-group--none .rt-chip{min-height:2.2rem;font-size:.84rem}
  .rt-info{position:relative;gap:.25rem;padding:.8rem .95rem .85rem;border-radius:14px}
  .rt-kind{display:none}
  .rt-name{padding-right:6.4rem;font-size:1.05rem}
  .rt-where{font-size:.86rem;line-height:1.45}
  .rt-mind{display:none !important}
  .rt-again{position:absolute;top:.6rem;right:.7rem;margin:0;padding:.35rem .7rem;font-size:.8rem}
}
@keyframes wpx-sheet{from{transform:translateY(40px);opacity:0}}
`;

export const METHODS_PAGE_CSS = BASE_CSS + METHODS_TOOLS_CSS + RAIN_CSS + METHODS_MOBILE_CSS;
