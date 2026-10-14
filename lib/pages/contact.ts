/**
 * Contact page, "blueprint and action". One white section on a faint
 * blueprint grid that fades in from the right, closed by a pale waterline (two
 * soft blue tints, so the page settles instead of ending on a dark strip).
 *
 * On the left: the blue eyebrow, the title (its last word in brand blue), one
 * line, and the four ways to reach us as tiles: the number to call (a deep-blue
 * tile with whether the office is open right now, and the page's one orange
 * quick action), WhatsApp, email and the office. On the right: the enquiry
 * form on a white card with a chamfered corner under a hatched deep-blue head
 * (name, phone, the kind of project, where the site is, and a message), sent
 * by email (the orange primary button) or on WhatsApp (the outlined one). The
 * form sends through FormSubmit, as before (contact-form.ts); every field
 * name, data-* hook and the #enquiry anchor are unchanged.
 *
 * Orange appears only on actions: the send button, the call tile's arrow, and
 * the hover state of the other tiles and links.
 */
import { arrow, esc, mapsLink, mark, tel, waGlyph, words, type ContactInfo } from "./kit";

export interface ContactPageData {
  contact: ContactInfo;
  types: readonly string[];
}

export const CONTACT_TRAIL = [
  { name: "Home", href: "/" },
  { name: "Contact", href: "/contact" },
] as const;

/** the project types as their buttons show them (the enquiry still carries the full service name) */
const TYPE_LABEL: Record<string, string> = {
  "Residential Construction": "Residential",
  "Commercial Construction": "Commercial",
  "Industrial Construction": "Industrial",
  "Renovation & Leak Repair": "Renovation & leak repair",
  "Project Management": "Project management",
};

/** line drawings for the ways to reach us (the same hand as the home page's); WhatsApp uses its own mark */
const ICON: Record<string, string> = {
  call: `<path d="M6.6 3.8h2.6l1.4 3.7-1.9 1.2a10.6 10.6 0 0 0 5.6 5.6l1.2-1.9 3.7 1.4v2.6a1.6 1.6 0 0 1-1.7 1.6A15 15 0 0 1 5 5.5a1.6 1.6 0 0 1 1.6-1.7z"/>`,
  email: `<rect x="3.5" y="5.5" width="17" height="13" rx="2.6"/><path d="m4.6 7.2 7.4 5.6 7.4-5.6"/>`,
  visit: `<path d="M12 20.6s-6.4-5.5-6.4-10.8a6.4 6.4 0 0 1 12.8 0c0 5.3-6.4 10.8-6.4 10.8z"/><circle cx="12" cy="9.9" r="2.3"/>`,
};
/** a 3rem icon tile: deep blue with a white line drawing (static, so never orange); WhatsApp shows its green mark on white */
const icon = (k: string, cls = "") =>
  `<span class="ct-ico${cls}" aria-hidden="true">${
    k === "whatsapp" ? waGlyph : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICON[k] ?? ""}</svg>`
  }</span>`;

function form(d: ContactPageData) {
  const c = d.contact;
  const field = (label: string, control: string, cls: string) => `<label class="ct-field ${cls}"><span class="ct-flab">${label}</span>${control}</label>`;
  const types = d.types.map((t) => `<option value="${esc(t)}">${esc(TYPE_LABEL[t] ?? t)}</option>`).join("");
  return `<form class="ct-form" data-enquiry data-endpoint="https://formsubmit.co/ajax/${esc(c.email)}" data-whatsapp="${esc(c.whatsapp)}">
  <input type="text" name="_honey" tabindex="-1" autocomplete="off" class="ct-trap" aria-hidden="true">
  <div class="ct-row">
    ${field("Name *", `<input required name="name" autocomplete="name" placeholder="Your name">`, "ct-f")}
    ${field("Phone *", `<input required type="tel" name="phone" autocomplete="tel" inputmode="tel" pattern="[0-9+\\s\\-]{8,}" placeholder="+91 98765 43210">`, "ct-f")}
    ${field("Project", `<span class="ct-sel"><select name="type">${types}</select></span>`, "ct-f")}
    ${field("Site location *", `<input required name="location" placeholder="e.g. Perundurai Road, Erode">`, "ct-f")}
    ${field("Message", `<textarea name="message" rows="4" placeholder="Where the leak is, or what you plan to build"></textarea>`, "ct-full")}
  </div>
  <p class="ct-alert" role="alert" hidden>We couldn’t send that just now. Please try again, send it on WhatsApp, or call <a href="${tel(c.phone)}">${esc(c.phone)}</a>.</p>
  <div class="ct-send">
    <button type="submit" class="pg-btn pg-btn--act ct-sbtn ct-sbtn--send" data-send><span data-label>Send enquiry</span>${arrow}</button>
    <button type="button" class="pg-btn pg-btn--line ct-sbtn ct-sbtn--wa" data-wa>${waGlyph}<span>Send on WhatsApp</span></button>
  </div>
</form>
<div class="ct-done" role="status" tabindex="-1" hidden>
  <span class="ct-tick" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3.5 8.5 6.5 11.5 12.5 4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
  <p class="ct-doneh">Thank you<span data-name></span>.</p>
  <p>Your enquiry has reached our office. An engineer will call you within one working day. For anything urgent, call <a href="${tel(c.phone)}">${esc(c.phone)}</a>.</p>
  <button type="button" class="pg-link" data-again>Send another enquiry</button>
</div>`;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
/** "Mon – Sat · 08:30 – 18:30 IST" → the opening days and times */
export function openingHours(h: string) {
  const t = h.match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/);
  const d = h.match(/(Sun|Mon|Tue|Wed|Thu|Fri|Sat)[a-z]*\s*[–-]\s*(Sun|Mon|Tue|Wed|Thu|Fri|Sat)/);
  const day = (s?: string) => DAYS.findIndex((x) => x.startsWith(s ?? "~"));
  return {
    from: t ? `${t[1]!.padStart(2, "0")}:${t[2]}` : "08:30",
    to: t ? `${t[3]!.padStart(2, "0")}:${t[4]}` : "18:30",
    d0: d ? Math.max(0, day(d[1])) : 1,
    d1: d ? Math.max(0, day(d[2])) : 6,
  };
}
/** "18:30" → "6:30 pm" */
export const clock = (hm: string) => {
  const [h = 0, m = 0] = hm.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
};

export function contactPageMarkup(d: ContactPageData) {
  const c = d.contact;
  const o = openingHours(c.hours);
  const hoursText = `${DAYS[o.d0]} to ${DAYS[o.d1]}, ${clock(o.from)} to ${clock(o.to)}`;
  const street = c.address.split(",").slice(0, 2).join(",");
  /** the email may break after the @ in a narrow tile, never mid-word */
  const mail = esc(c.email).replace("@", "@<wbr>");
  const go = `<span class="ct-tgo" aria-hidden="true">${arrow}</span>`;
  const tiles = `<ul class="ct-tiles" data-rv-stagger="80">
        <li data-rv><a class="ct-tile ct-tile--call pg-cardx" href="${tel(c.phone)}">${icon("call", " ct-ico--call")}<span class="ct-tk">Call an engineer</span><span class="ct-tv">${esc(c.phone)}</span><span class="ct-open" data-hours data-days="${o.d0}-${o.d1}" data-from="${o.from}" data-to="${o.to}"><i aria-hidden="true"></i><span data-open-text>Open ${hoursText}</span></span>${go}</a></li>
        <li data-rv><a class="ct-tile ct-tile--wa pg-cardx" href="${esc(c.whatsapp)}" target="_blank" rel="noopener noreferrer">${icon("whatsapp", " ct-ico--wa")}<span class="ct-tk">WhatsApp</span><span class="ct-tv">Chat with an engineer</span><span class="ct-tn">Send a photo of the leak</span>${go}</a></li>
        <li data-rv><a class="ct-tile pg-cardx" href="mailto:${esc(c.email)}">${icon("email")}<span class="ct-tk">Email</span><span class="ct-tv ct-tv--mail">${mail}</span><span class="ct-tn">Drawings and documents</span>${go}</a></li>
        <li data-rv><a class="ct-tile pg-cardx" href="${esc(mapsLink(c.mapQuery))}" target="_blank" rel="noopener noreferrer">${icon("visit")}<span class="ct-tk">Office</span><span class="ct-tv">${esc(street)}</span><span class="ct-tn">${esc(hoursText)}</span>${go}</a></li>
      </ul>`;
  return `<section class="pg-sec pg-sec--white ct-page" aria-labelledby="ct-title">
  <div class="pg-wrap ct-grid">
    <div class="ct-info">
      <span class="pg-dots ct-dots" aria-hidden="true"></span>
      ${mark("01", "Contact")}
      <h1 class="ct-h1" id="ct-title" data-rv="words">${words("Let’s keep your building dry.", 4)}</h1>
      <p class="ct-lede" data-rv>Call, WhatsApp or write to us. An engineer replies within one working day.</p>
      ${tiles}
    </div>
    <div class="ct-card" id="enquiry" data-rv="right">
      <div class="ct-cardin">
        <div class="ct-cardtop"><h2 class="ct-cardh">Tell us about your project.</h2><p>Fields marked * are needed. It takes a minute.</p></div>
        ${form(d)}
      </div>
    </div>
  </div>
  <svg class="ct-water" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <path class="ct-w1" d="M0 30C180 16 360 14 540 24s360 20 540 12 270-20 360-14V60H0Z"/>
    <path class="ct-w2" d="M0 40c200-12 380-12 560-3s340 14 520 6 260-14 360-9V60H0Z"/>
  </svg>
</section>`;
}

export const CONTACT_CSS = `
/* ── the page: one white section on a faint blueprint grid (fading in from the right), a pale waterline along its foot ── */
.ct-page{position:relative;overflow:hidden;padding:calc(var(--nav-room) + clamp(2rem,6vh,3.5rem)) 0 calc(clamp(3.5rem,8vh,5.5rem) + clamp(28px,3.6vw,52px))}
.ct-page::before{content:"";position:absolute;inset:0;background-image:linear-gradient(var(--bp) 1px,transparent 1px),linear-gradient(90deg,var(--bp) 1px,transparent 1px);background-size:32px 32px;-webkit-mask-image:linear-gradient(100deg,transparent 30%,black 72%);mask-image:linear-gradient(100deg,transparent 30%,black 72%);pointer-events:none}
.ct-water{position:absolute;left:0;right:0;bottom:0;display:block;width:100%;height:clamp(28px,3.6vw,52px);pointer-events:none}
.ct-w1{fill:color-mix(in srgb,var(--theme-primary) 6%,transparent)}
.ct-w2{fill:color-mix(in srgb,var(--theme-primary) 11%,transparent)}
.ct-grid{position:relative;z-index:1;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:3rem clamp(2.5rem,5vw,5rem);align-items:start}

/* ── left: the eyebrow, the title, one line, the four ways to reach us ── */
.ct-info{position:relative;min-width:0;container:ctinfo/inline-size}
.ct-info>:not(.ct-dots){position:relative;z-index:1}
/* a dotted square tucked behind the bottom-left corner of the tiles, for depth: it shows only outside the tiles (fading in toward them), never behind text */
.ct-dots{bottom:-2.25rem;left:-2.25rem;width:7.5rem;height:7.5rem;-webkit-mask-image:linear-gradient(45deg,black 25%,transparent 78%);mask-image:linear-gradient(45deg,black 25%,transparent 78%)}
.ct-info .pg-mark{margin-bottom:1rem}
.ct-h1{margin:0;max-width:16ch;font-family:var(--display);font-weight:600;font-size:var(--fs-title);line-height:1.12;letter-spacing:-.02em;text-wrap:balance}
.ct-lede{margin:1.1rem 0 0;max-width:31rem;font-size:var(--fs-body);line-height:1.65;color:color-mix(in srgb,var(--theme-ink) 80%,transparent);text-wrap:pretty}

/* the tiles: white with a hairline; each lifts, grows an orange bar along its foot and fills its arrow circle orange under the pointer */
.ct-tiles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:1fr;gap:.85rem;margin:clamp(1.8rem,4.5vh,2.6rem) 0 0;padding:0;list-style:none}
.ct-tiles>li{display:flex;min-width:0}
.ct-tile{display:flex;flex-direction:column;align-items:flex-start;width:100%;min-height:100%;padding:1.25rem 1.25rem 1.4rem;border-radius:var(--r-card);background:var(--card);box-shadow:inset 0 0 0 1px var(--line);color:var(--ink);text-decoration:none}
.ct-tile:hover,.ct-tile:focus-visible{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-primary) 30%,transparent),var(--lift)}
.ct-ico{display:grid;place-items:center;flex:none;width:3rem;height:3rem;border-radius:var(--r-ctl);background:var(--navy);color:var(--theme-on-dark)}
.ct-ico>svg{width:1.4rem;height:1.4rem}
.ct-ico--wa{background:var(--theme-surface);box-shadow:inset 0 0 0 1px var(--line)}
.ct-ico--wa>.pg-wa{width:1.5rem;height:1.5rem}
.ct-tk{margin-top:1.1rem;font-size:var(--fs-body);font-weight:600;line-height:1.3;color:var(--accent)}
.ct-tv{margin-top:.25rem;font-size:var(--fs-body);font-weight:600;line-height:1.4;color:var(--ink);overflow-wrap:break-word}
.ct-tn{margin-top:.3rem;font-size:var(--fs-body);line-height:1.45;color:var(--mute)}
.ct-tgo{position:absolute;top:1.25rem;right:1.25rem;display:grid;place-items:center;width:2.5rem;height:2.5rem;border-radius:50%;box-shadow:inset 0 0 0 1px var(--line);color:var(--navy);transition:background-color .35s var(--ease),color .35s var(--ease),box-shadow .35s var(--ease)}
.ct-tgo .pg-ar{width:15px;height:15px}
.ct-tile:hover .ct-tgo,.ct-tile:focus-visible .ct-tgo{background:var(--act);color:var(--on-act);box-shadow:inset 0 0 0 1px var(--act)}
.ct-tile:hover .ct-tgo .pg-ar,.ct-tile:focus-visible .ct-tgo .pg-ar{transform:translate(2px,-2px)}

/* the number to call: a deep-blue tile (structure), hatched along its top; its arrow is the page's orange quick action */
.ct-tile--call{background-color:var(--band);background-image:var(--hatch-img);background-size:100% 12px;background-repeat:no-repeat;box-shadow:none;color:var(--theme-on-dark)}
.ct-tile--call:hover,.ct-tile--call:focus-visible{box-shadow:var(--lift)}
.ct-tile--call .ct-ico{background:color-mix(in srgb,var(--theme-white) 12%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-white) 22%,transparent)}
.ct-tile--call .ct-tk{color:var(--band-mute)}
.ct-tile--call .ct-tv{font-size:var(--fs-sub);line-height:1.25;letter-spacing:-.01em;font-variant-numeric:tabular-nums;color:var(--theme-white)}
.ct-tile--call .ct-tgo,.ct-tile--call:hover .ct-tgo,.ct-tile--call:focus-visible .ct-tgo{background:var(--act);color:var(--on-act);box-shadow:none}
.ct-tile--call:hover .ct-tgo,.ct-tile--call:focus-visible .ct-tgo{background:var(--act-h);box-shadow:0 0 0 3px color-mix(in srgb,var(--theme-white) 35%,transparent)}
/* whether the office is open right now: a green dot when open, a muted one when closed (never orange) */
.ct-open{display:flex;align-items:flex-start;gap:.55rem;margin-top:.5rem;font-size:var(--fs-body);line-height:1.4;color:var(--band-mute)}
.ct-open i{position:relative;flex:none;width:8px;height:8px;margin-top:calc(.7em - 4px);border-radius:50%;background:var(--band-mute)}
.ct-open[data-state=open] i{background:var(--theme-success-bright)}
.ct-open[data-state=open] i::after{content:"";position:absolute;inset:-4px;border-radius:50%;border:1px solid var(--theme-success-bright);animation:ctPulse 2.4s ease-out infinite}
@keyframes ctPulse{from{opacity:.9;transform:scale(.6)}to{opacity:0;transform:scale(1.9)}}

/* a narrow column (small laptops, phones): each tile becomes a row, the icon at the left, the arrow at the right */
@container ctinfo (max-width:499px){
  .ct-tiles{grid-template-columns:minmax(0,1fr);grid-auto-rows:auto;gap:.7rem}
  .ct-tile{display:grid;grid-template-columns:auto minmax(0,1fr);grid-template-areas:"ico k" "ico v" "ico n";column-gap:1rem;align-content:center;padding:1.1rem 4.3rem 1.15rem 1.1rem}
  .ct-ico{grid-area:ico;align-self:center}
  .ct-tk{grid-area:k;margin-top:0}
  .ct-tv{grid-area:v}
  .ct-tn,.ct-open{grid-area:n}
  .ct-tgo{top:50%;right:1.1rem;margin-top:-1.25rem}
}

/* ── right: the enquiry form on a white card, chamfered top-left, under a hatched deep-blue head ── */
.ct-card{min-width:0;scroll-margin-top:calc(var(--nav-bar,80px) + 1rem);filter:drop-shadow(0 26px 34px color-mix(in srgb,var(--theme-shadow) 14%,transparent))}
.ct-cardin{position:relative;overflow:hidden;border-radius:var(--r-card);background:var(--card);box-shadow:inset 0 0 0 1px var(--line);color:var(--ink);clip-path:polygon(var(--cut) 0,100% 0,100% 100%,0 100%,0 var(--cut))}
.ct-cardtop{position:relative;isolation:isolate;padding:calc(1.4rem + 12px) clamp(1.3rem,2.6vw,2rem) 1.45rem;background-color:var(--band);background-image:var(--hatch-img);background-size:100% 12px;background-repeat:no-repeat;color:var(--theme-on-dark)}
.ct-cardtop::after{content:"";position:absolute;inset:12px 0 0;z-index:-1;background-image:linear-gradient(var(--hatch) 1px,transparent 1px),linear-gradient(90deg,var(--hatch) 1px,transparent 1px);background-size:24px 24px;-webkit-mask-image:linear-gradient(90deg,transparent 50%,black);mask-image:linear-gradient(90deg,transparent 50%,black);opacity:.6;pointer-events:none}
.ct-cardh{margin:0;font-family:var(--display);font-weight:600;font-size:var(--fs-sub);line-height:1.2;letter-spacing:-.01em;color:var(--theme-white)}
.ct-cardtop p{margin:.35rem 0 0;font-size:var(--fs-body);line-height:1.5;color:var(--band-mute)}

.ct-form{display:flex;flex-direction:column;gap:1.25rem;margin:0;padding:clamp(1.4rem,2.6vw,2rem)}
.ct-form[hidden],.ct-done[hidden],.ct-alert[hidden]{display:none}
.ct-trap{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);opacity:0;pointer-events:none}
.ct-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.1rem 1rem}
.ct-f{grid-column:span 1}
.ct-full{grid-column:1/-1}
.ct-field{display:flex;flex-direction:column;gap:.45rem;min-width:0}
.ct-flab{font-size:var(--fs-body);font-weight:600;line-height:1.3;color:var(--ink)}
/* the field outline: ink at 52% on white, about 3.2:1, so an empty box reads as a control (WCAG 1.4.11) */
.ct-field input,.ct-field select,.ct-field textarea{display:block;width:100%;min-width:0;margin:0;border:0;border-radius:var(--r-ctl);background:var(--theme-surface);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--theme-ink) 52%,transparent);font:inherit;font-size:var(--fs-body);color:var(--ink);transition:box-shadow .25s var(--ease)}
.ct-field input,.ct-field select{height:3.25rem;padding:0 1rem}
.ct-field textarea{min-height:7.5rem;padding:.85rem 1rem;line-height:1.55;resize:vertical}
.ct-field input::placeholder,.ct-field textarea::placeholder{color:var(--mute);opacity:1}
.ct-field input:hover,.ct-field select:hover,.ct-field textarea:hover{box-shadow:inset 0 0 0 1px var(--mute)}
.pg .ct-field input:focus,.pg .ct-field select:focus,.pg .ct-field textarea:focus{outline:none;box-shadow:inset 0 0 0 2px var(--accent)}
.ct-field input:user-invalid,.ct-field textarea:user-invalid{box-shadow:inset 0 0 0 1.5px var(--theme-error)}
/* the project select: a quiet chevron drawn as a mask in the muted grey */
.ct-sel{position:relative;display:block}
.ct-sel::after{content:"";position:absolute;top:50%;right:1rem;width:14px;height:14px;margin-top:-7px;background:var(--mute);-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 6l4 4 4-4' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/contain no-repeat;mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 6l4 4 4-4' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/contain no-repeat;pointer-events:none;transition:background-color .25s var(--ease)}
.ct-sel:hover::after,.ct-sel:focus-within::after{background:var(--ink)}
.ct-field select{appearance:none;-webkit-appearance:none;padding-right:2.75rem;cursor:pointer}

/* in-text phone links: navy line at rest, an orange underline grows under the pointer */
.ct-alert a,.ct-done p a{font-weight:600;color:inherit;text-decoration:none;padding-bottom:1px;background:linear-gradient(var(--act),var(--act)) left bottom/0% 1.5px no-repeat,linear-gradient(currentColor,currentColor) left bottom/100% 1px no-repeat;transition:background-size .45s var(--ease)}
.ct-alert a:hover,.ct-alert a:focus-visible,.ct-done p a:hover,.ct-done p a:focus-visible{background-size:100% 1.5px,100% 1px}
.ct-alert{margin:0;padding:.85rem 1rem;border-radius:var(--r-ctl);background:var(--theme-error-bg);box-shadow:inset 3px 0 0 var(--theme-error);font-size:var(--fs-body);line-height:1.5;color:var(--theme-error)}

/* the two ways to send: the orange primary (a darker sweep, its arrow in a navy circle) and the outlined WhatsApp one */
.ct-send{display:flex;flex-wrap:wrap;align-items:center;gap:.75rem;margin-top:.25rem}
.ct-sbtn--send:disabled{opacity:.65;cursor:progress;transform:none}
.ct-sbtn--send:disabled::before{transform:scaleX(0)}

/* sent: a navy-ringed tick, the thanks, and a link to send another */
.ct-done{padding:clamp(1.8rem,3.4vw,2.6rem) clamp(1.4rem,2.6vw,2rem)}
.pg .ct-done:focus-visible{outline:none}
.ct-tick{display:grid;place-items:center;width:3.25rem;height:3.25rem;border-radius:50%;background:color-mix(in srgb,var(--theme-primary) 8%,transparent);box-shadow:inset 0 0 0 2px var(--navy);color:var(--navy)}
.ct-tick svg{width:22px;height:22px}
.ct-doneh{margin:1.2rem 0 0;font-family:var(--display);font-weight:600;font-size:var(--fs-sub);line-height:1.2;letter-spacing:-.01em}
.ct-done p:not(.ct-doneh){margin:.6rem 0 0;max-width:30rem;font-size:var(--fs-body);line-height:1.65;color:var(--ink2)}
.ct-done .pg-link{margin-top:1.5rem;padding:0 0 4px;font-family:inherit;cursor:pointer}

@media (max-width:1023px){
  .ct-grid{grid-template-columns:minmax(0,1fr);gap:2.75rem}
}
@media (max-width:767px){
  .ct-page{padding-top:calc(var(--nav-room) + 1.75rem);padding-bottom:calc(3rem + 28px)}
  .ct-dots{display:none}
}
@media (max-width:639px){
  .ct-row{grid-template-columns:minmax(0,1fr)}
  .ct-send .pg-btn{flex:1 1 100%}
  .ct-sbtn--send{justify-content:space-between}
}
@media (prefers-reduced-motion:reduce){
  .ct-open i::after{animation:none}
  .ct-tile:hover .ct-tgo .pg-ar,.ct-tile:focus-visible .ct-tgo .pg-ar{transform:none}
}
`;
