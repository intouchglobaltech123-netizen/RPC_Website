/**
 * What two products have in common and where they differ, worked out from the
 * spreadsheet's own words: the kind of product, its listed uses (with the
 * sheet's different spellings of one place joined up, so "tanks" and "water
 * tanks" count as the same), its pack sizes and the jobs it is part of.
 * Nothing here adds a fact the sheet does not give.
 */
import { familyOf, productBySlug, SYSTEMS } from "./index";
import type { Product } from "./types";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** a name that already carries its brand ("Sika Seal 550", "Sikaswell A2010 bar") */
const named = (p: Pick<Product, "brand" | "name">) => p.name.toLowerCase().startsWith(p.brand.toLowerCase());
/** a product's full name without the brand said twice ("Sika Seal 550", not "Sika Sika Seal 550") */
export const fullName = (p: Pick<Product, "brand" | "name">) => (named(p) ? p.name : `${p.brand} ${p.name}`);
/** the same, with the brand marked up for styling */
export const brandName = (brand: string, name: string) =>
  name.toLowerCase().startsWith(`${brand.toLowerCase()} `) ? `<span>${esc(name.slice(0, brand.length))}</span>${esc(name.slice(brand.length))}` : `<span>${esc(brand)}</span> ${esc(name)}`;
/** the name under its brand's line: "Seal 550" under "Sika"; a name like "Sikaswell A2010 bar" stays whole */
export const shortName = (p: Pick<Product, "brand" | "name">) => (p.name.toLowerCase().startsWith(`${p.brand.toLowerCase()} `) ? p.name.slice(p.brand.length + 1) : p.name);

/* ------------------------------------------------------------ listed uses */

/** the sheet's spellings of one place, joined up; "a and b" and "a/b c" lists split into their parts */
const ALIAS: Record<string, string | readonly string[]> = {
  tanks: "water tanks",
  "water-retaining rcc": "water-retaining RCC",
  repairs: "concrete repairs",
  "concrete repair": "concrete repairs",
  "internal/external walls": "internal/external masonry walls",
  "aac block masonry": "AAC block masonry",
  screed: "screeds",
  rmc: "ready-mix concrete (RMC)",
  "rmc / concrete applications": "ready-mix concrete (RMC)",
  rcc: "RCC",
  "concrete beams": "beams",
  "pumped/high-strength concrete": ["pumped concrete", "high-strength concrete"],
  "roofs and below-ground structures": ["roofs", "below-ground structures"],
  "pavers and precast products": ["pavers", "precast products"],
};
/** the sheet's placeholder where it gives no uses */
const NO_USES = "use according to manufacturer system";

/** the places a product is listed for, in one spelling each (lower case, as the sheet writes them) */
export function useTerms(p: Pick<Product, "areas">): string[] {
  const out: string[] = [];
  for (const raw of p.areas.split(/,\s*/)) {
    const t = raw.trim().toLowerCase();
    if (!t || t === NO_USES) continue;
    const a = ALIAS[t] ?? t;
    for (const x of typeof a === "string" ? [a] : a) if (!out.includes(x)) out.push(x);
  }
  return out;
}
/** "water tanks" → "Water tanks" (abbreviations kept) */
export const cap = (s: string) => (s ? s[0]!.toUpperCase() + s.slice(1) : s);
/** what the sheet says where it lists no uses */
export const usesNote = (p: Pick<Product, "areas">) => (p.areas.trim().toLowerCase() === NO_USES ? "The sheet says to use it as the maker's system describes" : "");

/** uses in both, only in A, only in B */
export function splitUses(a: readonly string[], b: readonly string[]) {
  return { both: a.filter((x) => b.includes(x)), onlyA: a.filter((x) => !b.includes(x)), onlyB: b.filter((x) => !a.includes(x)) };
}

/* ------------------------------------------------------------ pack sizes */

/** a pack's amount in kilograms or litres (taken as alike for drawing them side by side), when the sheet gives one */
export function packAmount(size: string): number | null {
  const m = size.trim().match(/^([\d.]+)\s*(kg|g|L|ml)$/i);
  if (!m) return null;
  const n = Number(m[1]);
  const unit = m[2]!.toLowerCase();
  return unit === "g" || unit === "ml" ? n / 1000 : n;
}

/* ------------------------------------------------------------ jobs */

/** the jobs (from the systems) a product is part of, and the step it does in each */
export function jobsFor(slug: string): { job: string; step: string }[] {
  const out: { job: string; step: string }[] = [];
  for (const s of SYSTEMS) for (const l of s.layers) if (l.products.includes(slug)) out.push({ job: s.name, step: l.name });
  return out;
}

/* ------------------------------------------------------------ the verdict */

/** the sheet's two names for one kind of product (Brushbond Grey's own purpose calls it a coating) */
const CATEGORY_ALIAS: Record<string, string> = { "Cementitious waterproofing": "Cementitious waterproofing coating" };
const kindName = (c: string) => CATEGORY_ALIAS[c] ?? c;
const lower = (s: string) => (/^[A-Z][a-z]/.test(s) ? s[0]!.toLowerCase() + s.slice(1) : s);
/** "a, b and c" */
export const listing = (xs: readonly string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

/**
 * One or two plain sentences on how two products relate, from the sheet: the
 * same kind of product, the same purpose in two types, the same range, or two
 * ranges; then what they are both listed for. It never says two products are
 * interchangeable: where the sheet describes two brands' products alike, it
 * says so and points to the data sheets.
 */
export function productVerdict(a: Product, b: Product): { lead: string; more: string; same: "category" | "kind" | "family" | "none" } {
  let lead: string;
  let same: "category" | "kind" | "family" | "none";
  if (a.slug === b.slug) {
    lead = "The same product on both sides. Pick another for B.";
    same = "category";
  } else if (kindName(a.category) === kindName(b.category) && a.category !== "Construction chemical") {
    lead = `Same kind of product: ${lower(kindName(a.category))}.`;
    same = "category";
  } else if (a.purpose === b.purpose) {
    lead = `Same job, two types: ${lower(a.category)} and ${lower(b.category)}.`;
    same = "kind";
  } else if (a.family === b.family) {
    lead = `Both are from our ${lower(familyOf(a.family).label)} range.`;
    same = "family";
  } else {
    lead = `One from our ${lower(familyOf(a.family).label)} range, one from our ${lower(familyOf(b.family).label)} range.`;
    same = "none";
  }
  const ua = useTerms(a);
  const ub = useTerms(b);
  const { both } = splitUses(ua, ub);
  const sameOnPaper = a.slug !== b.slug && a.brand !== b.brand && a.category === b.category && a.purpose === b.purpose && ua.length > 0 && ua.length === ub.length && both.length === ua.length;
  const more =
    a.slug === b.slug
      ? ""
      : sameOnPaper
        ? "Our list describes both the same way, so compare the brand, the pack and today's rate, and check each data sheet."
        : both.length
        ? `Both are listed for ${listing(both)}.`
        : useTerms(a).length && useTerms(b).length
          ? "They are listed for different places."
          : "";
  return { lead, more, same };
}

/* ------------------------------------------------------------ kinds and their pictures */

export interface Kind {
  key: string;
  /** the picture that shows this kind of product going on (lib/media) */
  media: string;
  /** what this kind of product is called, in the plural ("cementitious waterproof coats") */
  plural: string;
}
/** each picture's kind of product, named in the plural */
const PLURAL: Record<string, string> = {
  "m-cementitious": "cementitious waterproof coats",
  "m-liquid-membrane": "liquid-applied roof coats",
  "m-hdpe": "waterproofing membranes",
  "m-integral": "waterproofing admixtures for concrete",
  "p-powder-admix": "waterproofing admixtures for concrete",
  "m-waterstops": "waterstops",
  "p-plug": "plugging mortars",
  "p-admixture": "concrete admixtures",
  "p-curing": "curing compounds",
  "p-release": "release agents",
  "p-floor": "floor hardeners",
  "p-bonding": "bonding agents",
  "p-epoxy": "structural epoxy adhesives",
  "p-grout": "non-shrink grouts",
  "p-anchor": "anchoring resins",
  "p-repair": "repair mortars",
  "p-rebar": "steel primers",
  "p-tile-adhesive": "tile adhesives",
  "p-tile-grout": "tile grouts",
  "p-aac": "AAC walling",
  "p-plaster": "plasters",
};
/** the sheet's categories, by the picture that shows them in use */
const BY_CATEGORY: Record<string, string> = {
  "Cementitious waterproofing": "m-cementitious",
  "Cementitious waterproofing coating": "m-cementitious",
  "Flexible cementitious waterproofing": "m-cementitious",
  "Roof waterproofing coating": "m-liquid-membrane",
  "Waterproofing membrane/system": "m-hdpe",
  "Crystalline waterproofing admixture": "p-powder-admix",
  "Integral waterproofing admixture": "m-integral",
  "Hydrophilic waterstop": "m-waterstops",
  "Rapid-setting plugging mortar": "p-plug",
  "Air-entraining admixture": "p-admixture",
  "Concrete performance admixture": "p-admixture",
  "Concrete superplasticizer": "p-admixture",
  "High-performance concrete admixture": "p-admixture",
  "Non-chloride accelerating admixture": "p-admixture",
  "Precast concrete admixture": "p-admixture",
  "Concrete curing compound": "p-curing",
  "Mould / form-release agent": "p-release",
  "Dry-shake floor hardener": "p-floor",
  "Acrylic polymer bonding agent": "p-bonding",
  "SBR latex bonding agent": "p-bonding",
  "Polymer bonding / repair additive": "p-bonding",
  "Epoxy bonding agent": "p-bonding",
  "Structural epoxy adhesive": "p-epoxy",
  "Non-shrink cementitious grout": "p-grout",
  "Resin anchoring system": "p-anchor",
  "High-strength repair / micro-concrete": "p-repair",
  "Structural repair mortar": "p-repair",
  "Reinforcement corrosion-protection primer": "p-rebar",
  "Tile adhesive": "p-tile-adhesive",
  "Epoxy tile grout": "p-tile-grout",
  "Cementitious tile grout": "p-tile-grout",
  "AAC block": "p-aac",
  "AAC block jointing mortar": "p-aac",
  "Ready-mix plaster": "p-plaster",
};
/**
 * The kind a product is, by the picture of it in use: none for the sheet's
 * unexplained "construction chemical", and none for a "membrane/system" that
 * comes in a pail rather than a roll, since the membrane picture shows sheets.
 */
export function kindOf(p: Pick<Product, "category"> & { packs?: Product["packs"]; name?: string }): Kind | null {
  // the membrane picture shows HDPE sheets: only the product the sheet names as HDPE gets it
  if (p.category === "Waterproofing membrane/system" && !/hdpe/i.test(p.name ?? "")) return null;
  const media = BY_CATEGORY[p.category];
  return media ? { key: media, media, plural: PLURAL[media] ?? "" } : null;
}

/* ------------------------------------------------------------ head-to-heads */

/**
 * Pairs worth comparing: the same kind of product from two brands, and two
 * grades from one brand. Each pair is checked against the list, so a renamed
 * product drops out rather than breaking the page.
 */
const PAIRS: readonly (readonly [string, string])[] = [
  ["fosroc-brushbond-grey", "sika-seal-550"],
  ["fosroc-brushbond-grey", "fosroc-brushbond-rfx-grey"],
  ["fosroc-supercast-sw20", "sikaswell-a2010-bar"],
  ["fosroc-conplast-sp430", "cci-novaplast-8200"],
  ["fosroc-auramix-300", "cci-novamix-2000"],
  ["fosroc-conbextra-gp2", "sika-grout-214"],
  ["fosroc-rendroc-sp40", "sika-emaco-s348"],
  ["fosroc-nitozinc-primer", "sika-rustop"],
  ["fosroc-concure-wb-white", "sika-antisol-a4-white"],
  ["fosroc-nitobond-sbr", "cci-neo-bond-sbr"],
];
export const HEAD_TO_HEADS: readonly (readonly [Product, Product])[] = PAIRS.map(([x, y]) => [productBySlug(x), productBySlug(y)] as const).filter(
  (p): p is readonly [Product, Product] => Boolean(p[0] && p[1]),
);

/** a good second product for one that arrives alone: the same kind from another brand, else the same kind, else the same family */
export function partnerFor(p: Product, all: readonly Product[]): Product {
  const h = HEAD_TO_HEADS.find(([x, y]) => x.slug === p.slug || y.slug === p.slug);
  if (h) return h[0].slug === p.slug ? h[1] : h[0];
  const others = all.filter((x) => x.slug !== p.slug);
  return (
    others.find((x) => x.category === p.category && x.brand !== p.brand) ??
    others.find((x) => x.category === p.category) ??
    others.find((x) => kindOf(x)?.key && kindOf(x)?.key === kindOf(p)?.key) ??
    others.find((x) => x.family === p.family) ??
    others[0]!
  );
}
