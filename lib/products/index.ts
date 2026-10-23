/**
 * The product list, grouped and joined up for the products page and the home
 * page: the families it is shown in, the "systems" that show which products go
 * on in which order for a job, and small helpers. Product facts (purpose, areas,
 * customers, pack sizes) come only from RPC's spreadsheet (see catalogue.ts).
 */
import { rateHref } from "./rate";
import { PRODUCTS } from "./catalogue";
import type { Product } from "./types";

export { PRODUCTS };
export type { Product, Pack } from "./types";

export interface FamilyInfo {
  key: string;
  label: string;
  /** one line under the family's name */
  line: string;
  /** a colour for its marks */
  tint: string;
}
/** the order and names the families are shown in */
export const FAMILIES: readonly FamilyInfo[] = [
  { key: "waterproofing", label: "Waterproofing", line: "Coatings, membranes, waterstops and leak plugs", tint: "#0b6e80" },
  { key: "admixtures", label: "Concrete admixtures", line: "For ready-mix, site and precast concrete", tint: "#b07a0c" },
  { key: "tiling", label: "Tile adhesives and grouts", line: "Fixing and finishing tiles on floors and walls", tint: "#3f6ea6" },
  { key: "bonding", label: "Bonding agents and epoxies", line: "Joining new to old, and structural bonding", tint: "#6b5b9a" },
  { key: "repair", label: "Concrete repair", line: "Rust removal, steel primers and repair mortars", tint: "#ad5531" },
  { key: "grouts", label: "Grouts and anchoring", line: "Machine bases, base plates and fixings", tint: "#55707f" },
  { key: "site", label: "Curing, formwork and floors", line: "Curing compounds, release agents and floor hardeners", tint: "#5f7a33" },
  { key: "walling", label: "AAC blocks, mortar and plaster", line: "Lightweight walls, from block to finish", tint: "#97633f" },
  { key: "other", label: "Other products", line: "Ask us what these are best used for", tint: "#6c7a85" },
];
export const familyOf = (key: string) => FAMILIES.find((f) => f.key === key) ?? FAMILIES[FAMILIES.length - 1]!;

export const BRANDS = ["Fosroc", "Sika", "CCI", "Berger", "Renacon"] as const;

const BY_SLUG = new Map(PRODUCTS.map((p) => [p.slug, p] as const));
export const productBySlug = (slug: string): Product | undefined => BY_SLUG.get(slug);
export const packSizes = (p: Product) => p.packs.map((k) => k.size);
/** how many listed products and pack sizes there are */
export const PRODUCT_COUNT = PRODUCTS.length;
export const PACK_COUNT = PRODUCTS.reduce((n, p) => n + p.packs.length, 0);

/** a WhatsApp link that opens with a rate enquiry for these products already written */
/** a product as the rate message names it: brand, name and packs */
export const rateName = (p: Product) => `${p.name.toLowerCase().startsWith(p.brand.toLowerCase()) ? p.name : `${p.brand} ${p.name}`} (${packSizes(p).join(" / ")})`;
export function rateLink(whatsapp: string, items: readonly Product[]) {
  return rateHref(whatsapp, items.map(rateName));
}

/* ------------------------------------------------------------- systems */

export interface SystemLayer {
  key: string;
  /** what this layer is, e.g. "Waterproof coat" */
  name: string;
  /** what it does in this job */
  note: string;
  /** the products that can do it (alternatives) */
  products: readonly string[];
  /** how it is drawn in the cross-section */
  look: "slab" | "coat" | "screed" | "adhesive" | "tile" | "grout" | "sheet" | "joint" | "plug" | "steel" | "mortar" | "block" | "plaster" | "mix" | "cure" | "form" | "anchor";
}
export interface System {
  key: string;
  name: string;
  /** one line on the job */
  line: string;
  /** the layers in the order they go on (first = first on) */
  layers: readonly SystemLayer[];
}

/**
 * Which products go on in which order, for jobs RPC's customers ask about most.
 * Built only from what the spreadsheet says each product is for; the right
 * system for a site still has to be confirmed against the current data sheets.
 */
export const SYSTEMS: readonly System[] = [
  {
    key: "bathroom",
    name: "Bathroom floor",
    line: "A wet-area floor, from the slab to the grout",
    layers: [
      { key: "coat", look: "coat", name: "Waterproof coat", note: "On the slab and turned up the walls", products: ["fosroc-brushbond-rfx-grey", "fosroc-nitocote-cm210-white", "sika-seal-550", "sika-seal-551", "fosroc-brushbond-grey"] },
      { key: "screed", look: "screed", name: "Protective screed", note: "A polymer-modified or waterproofed screed over the coat", products: ["fosroc-nitobond-sbr", "fosroc-nitobond-sbr-latex", "cci-neo-bond-sbr", "fosroc-conplast-wl-xtra"] },
      { key: "adhesive", look: "adhesive", name: "Tile adhesive", note: "A thin bed that fixes the tiles to the screed", products: ["berger-hs-tile-adhesive", "berger-hs-tile-adhesive-plus", "berger-hs-tile-bond-anti-slip-grey"] },
      { key: "grout", look: "grout", name: "Joint grout", note: "Fills the joints between tiles", products: ["berger-hs-epoxy-tile-grout"] },
    ],
  },
  {
    key: "terrace",
    name: "Exposed terrace",
    line: "A roof slab open to sun and rain",
    layers: [
      { key: "mix", look: "mix", name: "In the slab concrete", note: "Mixed in while the slab is cast, to make it less permeable", products: ["fosroc-conplast-wl-xtra"] },
      { key: "fill", look: "mortar", name: "Fill surface defects", note: "Minor defects made good before coating", products: ["fosroc-rendroc-cs-white"] },
      { key: "coat", look: "coat", name: "Roof coat", note: "A flexible liquid-applied coat that takes the weather", products: ["fosroc-brushbond-roofguard-white", "fosroc-brushbond-roofguard-terracotta"] },
    ],
  },
  {
    key: "tank",
    name: "Water tank or sump",
    line: "Concrete that holds water on one side",
    layers: [
      { key: "joint", look: "joint", name: "Joint waterstop", note: "Fixed in each construction joint before the next pour", products: ["fosroc-supercast-sw20", "sikaswell-a2010-bar"] },
      { key: "mix", look: "mix", name: "In the concrete", note: "Admixture mixed in when the walls and floor are cast", products: ["fosroc-conplast-crystalline", "fosroc-conplast-wl-xtra"] },
      { key: "plug", look: "plug", name: "Stop active leaks", note: "Rapid-setting plug for any spot that is running", products: ["fosroc-rendroc-plug"] },
      { key: "coat", look: "coat", name: "Inside coat", note: "A cementitious coat on the inside faces", products: ["fosroc-brushbond-grey", "fosroc-nitocote-cm210-white", "sika-seal-550", "sika-seal-551", "fosroc-brushbond-rfx-grey"] },
    ],
  },
  {
    key: "basement",
    name: "Basement and foundation",
    line: "Walls and floors against wet ground",
    layers: [
      { key: "sheet", look: "sheet", name: "Membrane outside", note: "A barrier on the face the ground water reaches", products: ["sikaproof-312-hdpe", "sika-bit-w1", "sikashield-w159", "sikaproof-sandwich-tape-100"] },
      { key: "joint", look: "joint", name: "Joint waterstop", note: "In every construction joint", products: ["fosroc-supercast-sw20", "sikaswell-a2010-bar"] },
      { key: "mix", look: "mix", name: "In the concrete", note: "Makes the walls and raft themselves resist water", products: ["fosroc-conplast-crystalline", "fosroc-conplast-wl-xtra"] },
      { key: "plug", look: "plug", name: "Stop active leaks", note: "For water already coming through", products: ["fosroc-rendroc-plug"] },
    ],
  },
  {
    key: "repair",
    name: "Spalled concrete repair",
    line: "Beams, columns and slabs where the steel shows",
    layers: [
      { key: "clean", look: "steel", name: "Clean the steel", note: "Rust and dirt removed from the exposed bars", products: ["fosroc-reebaklens-rr", "fosroc-reebaklens", "sika-rust-off-100"] },
      { key: "prime", look: "steel", name: "Protect the steel", note: "A corrosion-protection primer on the cleaned bars", products: ["fosroc-nitozinc-primer", "sika-rustop"] },
      { key: "bond", look: "coat", name: "Bond coat", note: "Joins the new repair to the old concrete", products: ["fosroc-nitobond-ep", "fosroc-nitobond-ar", "fosroc-nitobond-sbr", "fosroc-nitobond-pc40", "cci-neo-bond-sbr"] },
      { key: "mortar", look: "mortar", name: "Repair mortar", note: "Rebuilds the lost section", products: ["fosroc-rendroc-sp40", "sika-emaco-s348", "sika-emaco-s346", "fosroc-rendroc-rg"] },
      { key: "finish", look: "plaster", name: "Finish", note: "Evens out the repaired surface", products: ["fosroc-rendroc-cs-white"] },
    ],
  },
  {
    key: "pour",
    name: "Concrete pour",
    line: "Ready-mix and site concrete, from formwork to curing",
    layers: [
      { key: "form", look: "form", name: "Formwork release", note: "On the shuttering, so the concrete comes away clean", products: ["fosroc-reebol-emulsion-xtra", "fosroc-reebol-standard", "fosroc-moulding-oil"] },
      { key: "flow", look: "mix", name: "Workability and strength", note: "Less water for the same flow", products: ["fosroc-conplast-sp430", "fosroc-conplast-sp430-g", "fosroc-conplast-sp430-g8", "fosroc-conplast-sp430-es2", "fosroc-conplast-sp439", "fosroc-auramix-200-20", "fosroc-auramix-200-41", "fosroc-auramix-300", "fosroc-auramix-300-plus", "fosroc-auramix-350", "fosroc-auramix-400", "cci-novaplast-8200", "cci-novamix-2000", "cci-novamix-4000", "sika-plast-5132-t"] },
      { key: "special", look: "mix", name: "Special requirements", note: "Faster early strength, entrained air, or a property set by the grade", products: ["fosroc-conplast-nc", "cci-novatech-aea", "sika-control-777"] },
      { key: "dry", look: "mix", name: "Waterproof concrete", note: "For slabs, tanks and foundations", products: ["fosroc-conplast-wl-xtra", "fosroc-conplast-crystalline"] },
      { key: "cure", look: "cure", name: "Curing", note: "Sprayed on to hold the water in while it gains strength", products: ["fosroc-concure-wb-white", "cci-novacure-wb", "sika-antisol-a4-white"] },
    ],
  },
  {
    key: "precast",
    name: "Precast, blocks and pavers",
    line: "Factory concrete, mould after mould",
    layers: [
      { key: "release", look: "form", name: "Mould release", note: "Clean release from moulds and forms", products: ["fosroc-moulding-oil", "fosroc-reebol-emulsion-xtra", "fosroc-reebol-standard"] },
      { key: "early", look: "mix", name: "Early strength", note: "For fast turnaround of moulds", products: ["fosroc-auracast-102", "cci-novacast-pv50"] },
      { key: "dense", look: "mix", name: "Density and finish", note: "For blocks, pavers and precast products", products: ["fosroc-conplast-sd110"] },
    ],
  },
  {
    key: "grouting",
    name: "Machine bases and fixings",
    line: "Base plates, bolts and anchor pockets",
    layers: [
      { key: "anchor", look: "anchor", name: "Anchors and dowels", note: "Bolts, bars and anchors fixed into concrete", products: ["fosroc-lokfix-s"] },
      { key: "grout", look: "mortar", name: "Base-plate grout", note: "Non-shrink grout for load transfer", products: ["fosroc-conbextra-gp2", "sika-grout-214"] },
      { key: "additive", look: "mix", name: "Site-mixed grout", note: "Additives for cement grouts mixed on site", products: ["fosroc-cebex-100", "fosroc-cebex-112"] },
    ],
  },
  {
    key: "aac",
    name: "AAC block wall",
    line: "A lightweight wall, from block to plaster",
    layers: [
      { key: "block", look: "block", name: "Blocks", note: "Choose the thickness the wall needs", products: ["renacon-aac-block-3-inch", "renacon-aac-block-4-inch", "renacon-aac-block-6-inch", "renacon-aac-block-8-inch", "renacon-aac-block-9-inch"] },
      { key: "joint", look: "mortar", name: "Thin-bed joints", note: "Bonds the blocks course by course", products: ["renacon-renabond-aac-joint-mortar-superior"] },
      { key: "plaster", look: "plaster", name: "Plaster", note: "Factory-made plaster for the finished face", products: ["renacon-renaplast-ready-mix-plaster"] },
    ],
  },
];

/** the systems a product appears in */
export const systemsFor = (slug: string) => SYSTEMS.filter((s) => s.layers.some((l) => l.products.includes(slug)));
