# RPC Constructions — Design System

## Product context
- **Who:** RPC Constructions, a waterproofing and construction company founded in Erode (Tamil Nadu, India) in 2012. Head office: 142 Perundurai Road, Erode. Works across Erode, Coimbatore, Tiruppur, Salem and Chennai.
- **What the site does:** wins enquiries for (1) waterproofing and leak repair — terraces, bathrooms, water tanks/sumps, basements, balconies, external walls, podiums, crack/joint repair — and (2) building homes, villas, offices and factories with the waterproofing designed in.
- **Audience:** home owners, builders, developers and factory owners in western Tamil Nadu; many browse on phones.
- **Key pages:** Home, About, Products (brands & construction chemicals), Waterproofing (methods guide), Projects, Services, Blog, Contact.
- **Primary job-to-be-done:** "Tell me who fixes this kind of leak / builds this kind of building, show me they know what they're doing, and let me book a free site inspection."
- **Primary CTA everywhere:** "Book a free site inspection" (→ /contact#enquiry). Secondary: "Get a quote", WhatsApp, call +91 94428 95907.

## Voice
Plain, specific, engineer-like. Sentence case everywhere (never Title Case headings, never ALL CAPS labels). Short sentences. No hype words ("premium", "world-class", "cutting-edge").

## Colour (exact values — do not introduce others)
| Token | Value | Use |
|---|---|---|
| `--sand` | `#ece6da` | page background |
| `--sand-2` / `--stone` | `#e2d9c9` | alternate section background |
| `--card` | `#f5f0e6` | card / panel surface |
| `--sky` | `#d9e2ee` | rare pale-blue panel |
| `--ink` | `#12223b` | headings, primary text |
| `--ink2` | `rgba(18,34,59,.82)` | body text |
| `--mute` | `#5b6271` | labels, meta text |
| `--line` | `rgba(18,34,59,.14)` | hairlines, card outlines (as inset box-shadow) |
| `--navy` | `#0b2350` | primary buttons, icon tiles, dark panels, nav bar |
| `--accent` | `#2756a0` | links, active states, small highlights, numbers |
| `--water` | `#0b6e80` | rare secondary accent |
| on-navy text | `#f5f0e6` | text/icons on navy |

No gradients except a subtle navy scrim over photos. No neon, purple, red/crimson, orange, or yellow accents (status dots only: green #62d39f, amber #f4b740, pale blue #9ec2ff).

## Typography
- One family: **Inter Tight** (variable) for display and body (`--display` = `--sans` = Inter Tight, fallback "Segoe UI", system-ui). Never a serif or decorative face.
- Three sizes only: `--fs-title: clamp(1.9rem, 1.3rem + 1.9vw, 3rem)` (h1/h2, weight 600, line-height 1.12, letter-spacing -0.02em, `text-wrap: balance`); `--fs-sub: clamp(1.2rem, 1.08rem + 0.4vw, 1.5rem)` (card titles h3, weight 600, line-height 1.2, letter-spacing -0.015em); `--fs-body: 1rem` (body, line-height 1.6–1.65). Small meta/labels: 0.8–0.92rem, weight 600, colour `--mute`.
- Section label ("mark"): `01 —— Services` — a small accent-coloured number, a 2.5rem hairline, then the label in `--mute`, 1rem weight 500.

## Layout & spacing
- Content container `.pg-wrap`: max-width 1360px, centred, side padding `--gutter: clamp(1rem, 3.2vw, 3rem)`.
- Section padding `.pg-sec`: `clamp(3.6rem, 9vh, 6.5rem) 0` (3.2rem on phones). Alternate sections switch between `--sand` and `--sand-2`; sections on the same colour are separated by a 1px `--line` top border.
- Card grids: gap `clamp(.8rem, 1.3vw, 1.1rem)`. Breakpoints used: 1199px, 1099px, 1023px, 899px, 767px, 699px, 479px.
- Fixed floating nav: a centred navy pill of page links (Home, About, Products, Waterproofing, Projects, Services, Blog), the RPC logo top-left, a navy "Contact ↗" pill top-right; leaves `--nav-h` (60–64px) of room at the top.

## Shape, depth, motion
- Radii: cards 14–18px, panels 20–22px, buttons 10px, pills/chips 999px, icon tiles 14px.
- Outlines are inset box-shadows (`inset 0 0 0 1px var(--line)`), not borders. Hover lift: `translateY(-2px)` + `0 24px 44px -34px rgba(18,34,59,.55)` and a stronger inset line.
- Photos may have one or two corners cut on the slant (clip-path chamfer) — the site's signature shape.
- Buttons: `.pg-btn--ink` navy fill + cream text (hover → accent); `.pg-btn--line` 1px ink/32% outline, ink text. Height ~3.25rem, padding 0 1.5rem, weight 600, a small ↗ arrow icon.
- Motion: ease `cubic-bezier(.2,.7,.2,1)`, 0.25–0.4s for UI, ~0.8s fade-up reveals on scroll; respect prefers-reduced-motion.

## Icons
Simple 1.4–1.6px stroke line icons (24×24 viewBox, round caps/joins) in `currentColor`, usually cream on a navy 2.9rem rounded-square tile.

## Hard rules
Use ONLY the fonts, colours, spacing and component styles defined here. Do not introduce any fonts, colours or visual styles not in this design system.
