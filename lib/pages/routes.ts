/**
 * How to reach our office, shared by the about and contact pages: pick a
 * town, then one of four places people usually set out from there, and
 * Google Maps shows the road route to the office (lib/pages/behaviour.ts
 * wires the picks).
 */
import { arrow, esc } from "./kit";

/**
 * How to reach the office: pick a town, then one of four places people
 * usually set out from there (its bus stand, its railway station and so on),
 * and Google Maps shows the road route to our Erode office. The
 * starting places are public landmarks; the routes and times are Google's.
 */
const ROUTES: readonly { town: string; from: readonly (readonly [label: string, place: string])[] }[] = [
  { town: "Erode", from: [["From the central bus stand", "Erode Central Bus Terminus, Erode"], ["From the railway station", "Erode Junction Railway Station, Erode"], ["From Perundurai", "Perundurai Bus Stand, Perundurai"], ["From Bhavani", "Bhavani Bus Stand, Bhavani"]] },
  { town: "Coimbatore", from: [["From Gandhipuram bus stand", "Gandhipuram Central Bus Stand, Coimbatore"], ["From the railway station", "Coimbatore Junction Railway Station"], ["From the airport", "Coimbatore International Airport"], ["From Ukkadam bus stand", "Ukkadam Bus Stand, Coimbatore"]] },
  { town: "Krishnagiri", from: [["From the new bus stand", "Krishnagiri New Bus Stand, Krishnagiri"], ["From the old bus stand", "Krishnagiri Old Bus Stand, Krishnagiri"], ["From the railway station", "Krishnagiri Railway Station, Krishnagiri"]] },
  { town: "Chennai", from: [["From Koyambedu bus stand", "Chennai Mofussil Bus Terminus, Koyambedu, Chennai"], ["From Kilambakkam bus stand", "Kilambakkam Bus Terminus, Chennai"], ["From Chennai Central station", "Chennai Central Railway Station"], ["From the airport", "Chennai International Airport"]] },
];

const embedRoute = (from: string, to: string) => `https://maps.google.com/maps?saddr=${encodeURIComponent(from)}&daddr=${encodeURIComponent(to)}&output=embed`;
const openRoute = (from: string, to: string) => `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}&travelmode=driving`;

export function routesMarkup(dest: string, regions: readonly string[]) {
  const towns = ROUTES.filter((r) => regions.includes(r.town));
  const first = towns[0]!;
  const [fl, fp] = first.from[0]!;
  const pin = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14.5s4.8-4.3 4.8-8a4.8 4.8 0 0 0-9.6 0c0 3.7 4.8 8 4.8 8z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="6.5" r="1.7" fill="currentColor"/></svg>`;
  const short = (l: string) => { const x = l.replace(/^From (the )?/, ""); return x.charAt(0).toUpperCase() + x.slice(1); };
  return `<div class="ab-go" data-routes data-dest="${esc(dest)}">
    <div class="ab-go-side">
      <h3 class="ab-go-h">How to reach our office</h3>
      <div class="ab-go-towns" role="tablist" aria-label="Towns">${towns
        .map((t, i) => `<button type="button" role="tab" class="ab-go-town" data-town="${esc(t.town)}" aria-selected="${i === 0}">${esc(t.town)}</button>`)
        .join("")}</div>
      ${towns
        .map(
          (t, i) => `<ul class="ab-go-from" data-from-town="${esc(t.town)}"${i === 0 ? "" : " hidden"}>${t.from
            .map(
              ([label, place], j) =>
                `<li><button type="button" class="ab-go-route" data-place="${esc(place)}" data-label="${esc(`${label.replace(/^From /, "")}, ${t.town}`)}" aria-pressed="${i === 0 && j === 0}">${pin}<span><b>${esc(short(label))}</b><small>${esc(place)}</small></span></button></li>`,
            )
            .join("")}</ul>`,
        )
        .join("")}
      <a class="ab-go-open" href="${esc(openRoute(fp, dest))}" target="_blank" rel="noopener noreferrer" data-open>Open this route in Google Maps${arrow}</a>
    </div>
    <div class="ab-go-map">
      <iframe title="Road route from ${esc(`${fl.replace(/^From /, "")}, ${first.town}`)} to our office" src="${esc(embedRoute(fp, dest))}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" data-map></iframe>
    </div>
  </div>`;
}

export const ROUTES_CSS = `
/* how to reach the office: towns and starting places on the left, Google's road route on the right */
.ab-go{--fs-s:var(--fs-body);display:grid;grid-template-columns:minmax(0,.95fr) minmax(0,1.3fr);gap:0;margin-top:clamp(1rem,2.2vh,1.6rem);overflow:hidden;border-radius:18px;background:var(--card,#f5f0e6);box-shadow:inset 0 0 0 1px var(--line)}
.ab-go-side{display:flex;flex-direction:column;gap:.9rem;padding:clamp(1.1rem,2vw,1.5rem)}
.ab-go-k{margin:0;font-size:var(--fs-body);font-weight:600;color:var(--accent)}
.ab-go-h{margin:0;font-size:var(--fs-body);font-weight:600;line-height:1.25;letter-spacing:-.01em;color:var(--ink)}
.ab-go-towns{display:flex;flex-wrap:wrap;gap:.35rem}
.ab-go-town{height:2rem;padding:0 .8rem;border:0;border-radius:999px;background:rgba(18,34,59,.06);font:inherit;font-size:var(--fs-s);font-weight:600;color:var(--ink);cursor:pointer;transition:background-color .2s,color .2s}
.ab-go-town:hover{background:rgba(18,34,59,.1)}
.ab-go-town[aria-selected=true]{background:var(--navy);color:#f5f0e6}
.ab-go-town:focus-visible,.ab-go-route:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.ab-go-from{display:grid;grid-template-columns:minmax(0,1fr);gap:.4rem;margin:0;padding:0;list-style:none}
.ab-go-from[hidden]{display:none}
.ab-go-route{display:flex;align-items:flex-start;gap:.55rem;width:100%;height:100%;padding:.5rem .75rem;border:0;border-radius:12px;background:#fff;box-shadow:inset 0 0 0 1px var(--line);font:inherit;text-align:left;cursor:pointer;transition:box-shadow .2s,background-color .2s}
.ab-go-route svg{flex:none;width:1rem;height:1rem;margin-top:.1rem;color:var(--accent)}
.ab-go-route span{display:flex;flex-direction:column;min-width:0}
.ab-go-route b{font-size:var(--fs-s);font-weight:600;color:var(--ink)}
.ab-go-route small{font-size:var(--fs-s);color:var(--mute);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ab-go-route:hover{box-shadow:inset 0 0 0 1.5px var(--navy)}
.ab-go-route[aria-pressed=true]{background:var(--navy);box-shadow:none}
.ab-go-route[aria-pressed=true] b,.ab-go-route[aria-pressed=true] svg{color:#fff}
.ab-go-route[aria-pressed=true] small{color:rgba(245,240,230,.7)}
.ab-go-open{display:inline-flex;align-items:center;gap:.4rem;margin-top:auto;font-size:var(--fs-s);font-weight:600;color:var(--accent);text-decoration:none}
.ab-go-open:hover{text-decoration:underline;text-underline-offset:3px}
.ab-go-open .pg-ar{width:.9rem;height:.9rem}
.ab-go-map{position:relative;min-height:21rem;background:#d9d0bf}
.ab-go-map iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
@media (max-width:899px){.ab-go{grid-template-columns:minmax(0,1fr)}.ab-go-map{min-height:20rem}}

`;
