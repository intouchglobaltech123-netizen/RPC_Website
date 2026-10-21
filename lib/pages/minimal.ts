/**
 * The quiet layout the About, Services, Projects and Blog pages share: a tall,
 * plain opening (a line on what the page is, the heading, a short intro, at
 * most two buttons), then the page in rows, each row a label on the left and
 * its content on the right, ruled off by a hairline; lists inside a row are
 * hairline rows too, never cards. The close is one heading, one line and the
 * ways to reach us. The three type sizes only, the site's sand ground, its
 * navy for actions and its blue for links.
 */
import { arrow, esc, type ContactInfo } from "./kit";

export interface MnHead {
  kicker: string;
  title: string;
  intro?: string;
  /** buttons, already rendered (mnBtn) */
  actions?: string;
}

export const mnBtn = (href: string, label: string, kind: "ink" | "line" = "ink", external = false) =>
  `<a class="mn-btn mn-btn--${kind}" href="${esc(href)}"${external ? ` target="_blank" rel="noopener noreferrer"` : " data-internal"}>${esc(label)}${kind === "ink" ? arrow : ""}</a>`;

/** the page's opening; the heading takes plain text (escaped here) */
export function mnHead(h: MnHead) {
  return `<header class="mn-head">
  <div class="mn-wrap">
    <p class="mn-kick" data-rv>${esc(h.kicker)}</p>
    <h1 class="mn-h1" data-rv>${esc(h.title)}</h1>
    ${h.intro ? `<p class="mn-intro" data-rv>${esc(h.intro)}</p>` : ""}
    ${h.actions ? `<div class="mn-acts" data-rv>${h.actions}</div>` : ""}
  </div>
</header>`;
}

/** one row of the page: its label (and a line under it) on the left, the content on the right */
export function mnRow(r: { id?: string; label: string; sub?: string; body: string }) {
  const hid = r.id ? `mn-${r.id}` : "";
  return `<section class="mn-row-sec"${r.id ? ` id="${esc(r.id)}" aria-labelledby="${hid}"` : ""}>
  <div class="mn-wrap mn-row">
    <div class="mn-lab"><h2 class="mn-label"${hid ? ` id="${hid}"` : ""}>${esc(r.label)}</h2>${r.sub ? `<p class="mn-sub">${esc(r.sub)}</p>` : ""}</div>
    <div class="mn-body">${r.body}</div>
  </div>
</section>`;
}

/** the close: one heading, one line, and the ways to reach us */
export function mnClose(c: ContactInfo, t: { title: string; line: string }) {
  return `<section class="mn-close" aria-labelledby="mn-close-h">
  <div class="mn-wrap mn-closegrid">
    <div>
      <h2 class="mn-closeh" id="mn-close-h">${esc(t.title)}</h2>
      <p class="mn-intro">${esc(t.line)}</p>
    </div>
    <div class="mn-closeside">
      <div class="mn-acts">${mnBtn("/contact#enquiry", "Book a free site inspection")}${mnBtn(c.whatsapp, "WhatsApp us", "line", true)}</div>
    </div>
  </div>
</section>`;
}

export const MIN_CSS = `
.mn-wrap{width:100%;max-width:1240px;margin:0 auto;padding:0 var(--gutter,1.5rem);box-sizing:border-box}
.mn-head{padding:calc(var(--nav-h,64px) + clamp(3.5rem,12vh,8rem)) 0 clamp(3rem,9vh,6rem)}
.mn-kick{margin:0 0 1.1rem;font-size:var(--fs-body);font-weight:500;color:#5b6271}
.mn-h1{margin:0;max-width:19ch;font-size:var(--fs-title);font-weight:600;line-height:1.08;letter-spacing:-.03em;color:#12223b;text-wrap:balance}
.mn-intro{margin:1.3rem 0 0;max-width:36rem;font-size:var(--fs-body);line-height:1.65;color:#5b6271;text-wrap:pretty}
.mn-acts{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:2rem}
.mn-btn{display:inline-flex;align-items:center;gap:.55rem;height:3rem;padding:0 1.3rem;border-radius:10px;font-size:var(--fs-body);font-weight:600;line-height:1;text-decoration:none;white-space:nowrap;transition:background-color .2s,box-shadow .2s,color .2s}
.mn-btn .pg-ar{width:14px;height:14px}
.mn-btn--ink{background:#0b2350;color:#fff}
.mn-btn--ink:hover{background:#2756a0}
.mn-btn--line{box-shadow:inset 0 0 0 1px rgba(18,34,59,.25);color:#12223b}
.mn-btn--line:hover{box-shadow:inset 0 0 0 1px #12223b}
/* the rows */
.mn-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2.3fr);gap:1.2rem clamp(2rem,6vw,6rem);padding-top:clamp(2.5rem,7vh,4.5rem);padding-bottom:clamp(2.5rem,7vh,4.5rem);border-top:1px solid rgba(18,34,59,.14)}
.mn-row-sec{scroll-margin-top:calc(var(--nav-h,64px) + 1rem)}
.mn-lab{align-self:start;position:sticky;top:calc(var(--nav-h,64px) + 2rem)}
.mn-label{margin:0;font-size:var(--fs-sub);font-weight:600;line-height:1.25;letter-spacing:-.015em;color:#12223b}
.mn-sub{margin:.5rem 0 0;max-width:17rem;font-size:var(--fs-body);line-height:1.5;color:#5b6271}
.mn-body{min-width:0}
.mn-p{margin:0;max-width:40rem;font-size:var(--fs-body);line-height:1.75;color:#2b3649;text-wrap:pretty}
.mn-p + .mn-p{margin-top:1.1rem}
.mn-quote{margin:0;max-width:32ch;font-size:var(--fs-sub);font-weight:500;line-height:1.4;letter-spacing:-.01em;color:#12223b;text-wrap:balance}
/* lists inside a row: hairline rows */
.mn-list{margin:0;padding:0;list-style:none}
.mn-li{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.7fr) auto;gap:.35rem 2rem;align-items:baseline;padding:1.2rem 0}
.mn-li + .mn-li{border-top:1px solid rgba(18,34,59,.1)}
.mn-li:first-child{padding-top:0}
.mn-list--2 .mn-li{grid-template-columns:minmax(0,1fr) minmax(0,1.7fr)}
.mn-list--1 .mn-li{grid-template-columns:minmax(0,1fr)}
.mn-t{margin:0;font-size:var(--fs-body);font-weight:600;line-height:1.4;color:#12223b}
.mn-d{margin:0;font-size:var(--fs-body);line-height:1.6;color:#5b6271;text-wrap:pretty}
.mn-n{display:inline-block;min-width:1.9rem;font-variant-numeric:tabular-nums;color:#2756a0}
.mn-go{display:inline-flex;align-items:center;gap:.35rem;font-size:var(--fs-body);font-weight:600;color:#2756a0;text-decoration:none;white-space:nowrap}
.mn-go .pg-ar{width:13px;height:13px;transition:transform .2s}
.mn-go:hover .pg-ar{transform:translate(2px,-2px)}
.mn-go:hover{text-decoration:underline;text-underline-offset:3px}
.mn-grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2rem clamp(1.5rem,4vw,3.5rem)}
.mn-grid2 .mn-t{margin-bottom:.35rem}
/* the close */
.mn-close{padding:clamp(3.5rem,10vh,6.5rem) 0 clamp(4rem,11vh,7rem);border-top:1px solid rgba(18,34,59,.14)}
.mn-closegrid{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:2rem 4rem;align-items:end}
.mn-closeh{margin:0;max-width:16ch;font-size:var(--fs-title);font-weight:600;line-height:1.08;letter-spacing:-.03em;color:#12223b;text-wrap:balance}
.mn-closeside .mn-acts{margin-top:0}
.mn-reach{display:flex;flex-wrap:wrap;gap:.4rem 1.5rem;margin:1.2rem 0 0;font-size:var(--fs-body)}
.mn-reach a{color:#12223b;text-decoration:none}
.mn-reach a:hover{color:#2756a0;text-decoration:underline;text-underline-offset:3px}
.mn a:focus-visible,.mn button:focus-visible,.mn summary:focus-visible{outline:2px solid #2756a0;outline-offset:3px;border-radius:4px}
@media (max-width:860px){
  .mn-row{grid-template-columns:minmax(0,1fr)}
  .mn-lab{position:static}
  .mn-li,.mn-list--2 .mn-li{grid-template-columns:minmax(0,1fr);gap:.3rem}
  .mn-grid2{grid-template-columns:minmax(0,1fr);gap:1.5rem}
  .mn-closegrid{grid-template-columns:minmax(0,1fr);align-items:start}
}
@media (max-width:520px){.mn-btn{flex:1 1 auto;justify-content:center}}
@media (pointer:coarse){.mn-go{min-height:2.75rem}}
`;
