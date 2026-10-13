/**
 * A drawn picture of a product's pack, for its card until RPC has a photo of it:
 * the pack in its own shape (sack, pail, jerry can, drum, kit, roll, block, tin, bottle, cartridge),
 * shaded so it reads as an object, with a label carrying the pack size in the colour of the product's kind.
 * No maker's logo or artwork is drawn: it shows the kind of pack, not the maker's packaging.
 */

const SHADE = (id: string) =>
  `<linearGradient id="${id}" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".38"/><stop offset=".35" stop-color="#fff" stop-opacity=".06"/><stop offset=".7" stop-color="#000" stop-opacity=".04"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>`;

/** a size set as large as fits the width it has */
const fit = (size: string, w: number, max: number) => Math.min(max, (w * 1.75) / Math.max(1, size.length)).toFixed(1);

const label = (x: number, y: number, w: number, h: number, tint: string, size: string, max = 12) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2.5" fill="#fff"/>` +
  `<rect x="${x}" y="${y}" width="${w}" height="${Math.round(h * 0.28)}" rx="2.5" fill="${tint}"/>` +
  `<rect x="${x}" y="${y + Math.round(h * 0.28) - 2.5}" width="${w}" height="2.5" fill="${tint}"/>` +
  `<rect x="${x + 5}" y="${y + Math.round(h * 0.28) + 4}" width="${w * 0.55}" height="2.2" rx="1.1" fill="#12223b" opacity=".18"/>` +
  `<text x="${x + w / 2}" y="${y + h - 6}" text-anchor="middle" font-size="${fit(size, w - 6, max)}" font-weight="700" fill="#12223b">${size}</text>`;

type Draw = (tint: string, size: string, s: string) => string;

const DRAW: Record<string, Draw> = {
  // a paper sack with a stitched, folded top
  bag: (t, z, s) =>
    `<path d="M27 33h66l4 66q-37 7-74 0z" fill="#d8c19a"/><path d="M27 33h66l4 66q-37 7-74 0z" fill="url(#${s})"/>` +
    `<path d="M29 24h62l2 11H27z" fill="#c4a97c"/><path d="M31 29.5h58" stroke="#8d7550" stroke-width="1.2" stroke-dasharray="2.5 2"/>` +
    label(37, 50, 46, 36, t, z, 12.5),
  // a plastic pail with a coloured lid and a wire handle
  pail: (t, z, s) =>
    `<path d="M36 40c0-16 48-16 48 0" fill="none" stroke="#9aa3ad" stroke-width="2"/>` +
    `<path d="M30 42h60l-5 58H35z" fill="#f2f1ec"/><path d="M30 42h60l-5 58H35z" fill="url(#${s})"/>` +
    `<rect x="27" y="35" width="66" height="10" rx="3" fill="${t}"/><rect x="27" y="35" width="66" height="10" rx="3" fill="url(#${s})"/>` +
    label(37, 56, 46, 32, t, z),
  // a jerry can with a carry handle and a spout
  can: (t, z, s) =>
    `<rect x="72" y="22" width="11" height="12" rx="2" fill="#2b3442"/>` +
    `<path d="M32 30h30l6-4h6v10H32z" fill="${t}"/>` +
    `<rect x="40" y="22" width="24" height="12" rx="5" fill="none" stroke="${t}" stroke-width="5"/>` +
    `<rect x="29" y="34" width="62" height="66" rx="7" fill="${t}"/><rect x="29" y="34" width="62" height="66" rx="7" fill="url(#${s})"/>` +
    label(37, 50, 46, 36, t, z),
  // a steel drum with rolling hoops
  drum: (t, z, s) =>
    `<rect x="31" y="20" width="58" height="84" rx="5" fill="${t}"/><rect x="31" y="20" width="58" height="84" rx="5" fill="url(#${s})"/>` +
    `<path d="M31 25h58M31 99h58" stroke="#000" stroke-opacity=".22" stroke-width="2"/>` +
    `<path d="M31 42h58M31 82h58" stroke="#000" stroke-opacity=".16" stroke-width="3"/>` +
    `<circle cx="78" cy="22.5" r="2.4" fill="#000" fill-opacity=".3"/>` +
    label(37, 47, 46, 33, t, z),
  // a two-part kit: a pail and a small can beside it
  kit: (t, z, s) =>
    `<path d="M24 44h50l-4 56H28z" fill="#f2f1ec"/><path d="M24 44h50l-4 56H28z" fill="url(#${s})"/>` +
    `<rect x="21" y="37" width="56" height="10" rx="3" fill="${t}"/>` +
    `<path d="M29 42c0-13 40-13 40 0" fill="none" stroke="#9aa3ad" stroke-width="2"/>` +
    label(29, 58, 40, 30, t, z, 11.5) +
    `<rect x="78" y="66" width="22" height="34" rx="3" fill="#59626d"/><rect x="78" y="66" width="22" height="34" rx="3" fill="url(#${s})"/>` +
    `<rect x="85" y="61" width="8" height="6" rx="1.5" fill="#2b3442"/><rect x="81" y="77" width="16" height="11" rx="1.5" fill="${t}"/>`,
  // a membrane roll, standing, with its wound end on top
  roll: (t, z, s) =>
    `<rect x="38" y="22" width="44" height="80" rx="3" fill="#2d3138"/><rect x="38" y="22" width="44" height="80" rx="3" fill="url(#${s})"/>` +
    `<ellipse cx="60" cy="22" rx="22" ry="6" fill="#4a4f57"/><ellipse cx="60" cy="22" rx="14" ry="3.8" fill="none" stroke="#2d3138" stroke-width="1.4"/><ellipse cx="60" cy="22" rx="6" ry="1.8" fill="#1d2025"/>` +
    `<rect x="38" y="48" width="44" height="30" fill="#fff"/><rect x="38" y="48" width="44" height="7" fill="${t}"/>` +
    `<text x="60" y="72" text-anchor="middle" font-size="${fit(z, 38, 11.5)}" font-weight="700" fill="#12223b">${z}</text>`,
  // aerated blocks, stacked
  block: (_t, z) =>
    `<path d="M22 70l38-14 38 14-38 14z" fill="#e9e7e1"/><path d="M22 70v20l38 14V84z" fill="#d3d0c8"/><path d="M98 70v20L60 104V84z" fill="#c2bfb6"/>` +
    `<path d="M34 50l26-10 26 10-26 10z" fill="#eeece6"/><path d="M34 50v16l26 10V60z" fill="#d8d5cd"/><path d="M86 50v16L60 76V60z" fill="#c7c4bb"/>` +
    `<g fill="#000" fill-opacity=".09"><circle cx="30" cy="80" r="1"/><circle cx="40" cy="86" r="1.2"/><circle cx="50" cy="90" r="1"/><circle cx="70" cy="92" r="1.1"/><circle cx="84" cy="85" r="1"/><circle cx="44" cy="62" r="1"/><circle cx="76" cy="64" r="1.1"/></g>` +
    `<text x="60" y="30" text-anchor="middle" font-size="${fit(z, 80, 12)}" font-weight="700" fill="#12223b">${z}</text>`,
  // a round tin with a lever lid
  tin: (t, z, s) =>
    `<rect x="32" y="40" width="56" height="58" fill="#c9ced4"/><rect x="32" y="40" width="56" height="58" fill="url(#${s})"/>` +
    `<ellipse cx="60" cy="98" rx="28" ry="6" fill="#aeb4bb"/><ellipse cx="60" cy="40" rx="28" ry="6" fill="#dfe3e7"/><ellipse cx="60" cy="40" rx="20" ry="3.6" fill="none" stroke="#9aa1a9" stroke-width="1.3"/>` +
    `<rect x="32" y="52" width="56" height="34" fill="#fff"/><rect x="32" y="52" width="56" height="9" fill="${t}"/>` +
    `<text x="60" y="80" text-anchor="middle" font-size="${fit(z, 50, 12)}" font-weight="700" fill="#12223b">${z}</text>`,
  // a plastic bottle with a coloured cap
  bottle: (t, z, s) =>
    `<rect x="51" y="16" width="18" height="11" rx="2" fill="${t}"/>` +
    `<path d="M53 27h14v8l9 9v56a4 4 0 0 1-4 4H48a4 4 0 0 1-4-4V44l9-9z" fill="#f4f3ef"/><path d="M53 27h14v8l9 9v56a4 4 0 0 1-4 4H48a4 4 0 0 1-4-4V44l9-9z" fill="url(#${s})"/>` +
    label(47, 56, 26, 34, t, z, 9.5),
  // a sealant cartridge, lying down, with its nozzle
  cartridge: (t, z, s) =>
    `<rect x="18" y="48" width="70" height="24" rx="3" fill="${t}"/><rect x="18" y="48" width="70" height="24" rx="3" fill="url(#${s})"/>` +
    `<path d="M88 52l18 5v6l-18 5z" fill="#f2f1ec"/><rect x="14" y="50" width="6" height="20" rx="1.5" fill="#2b3442"/>` +
    `<rect x="30" y="52" width="40" height="16" rx="2" fill="#fff"/>` +
    `<text x="50" y="64.5" text-anchor="middle" font-size="${fit(z, 36, 10.5)}" font-weight="700" fill="#12223b">${z}</text>`,
};
DRAW.sachet = DRAW.bag!;
DRAW.pouch = DRAW.bag!;

const escText = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** the picture for one product: its first pack, in the colour of its kind */
export function packArt(id: string, shape: string, tint: string, size: string) {
  const s = `pa-${id}`;
  const draw = DRAW[shape] ?? DRAW.bag!;
  return `<svg class="pa" viewBox="0 0 120 120" aria-hidden="true" font-family="inherit"><defs>${SHADE(s)}</defs><ellipse cx="60" cy="106" rx="40" ry="5" fill="#12223b" opacity=".1"/>${draw(tint, escText(size), s)}</svg>`;
}
