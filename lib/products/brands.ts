/**
 * The product list seen brand by brand: how many products each brand has on
 * RPC's list and in which families, and the jobs for which the list has
 * products from more than one brand ("same job, different brands"). Every fact
 * comes from the spreadsheet (catalogue.ts); nothing here rates one brand
 * above another.
 */
import { FAMILIES, PRODUCTS, type Product } from "./index";
import { useTerms } from "./compare";

export const brandKey = (b: string) => b.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export interface BrandFamily {
  key: string;
  label: string;
  tint: string;
  count: number;
}
export interface BrandInfo {
  key: string;
  name: string;
  count: number;
  /** its families on the list, largest first */
  families: readonly BrandFamily[];
  products: readonly Product[];
}

/** the brands on the list, the one with the most products first */
export function brandInfo(all: readonly Product[] = PRODUCTS): BrandInfo[] {
  const names = [...new Set(all.map((p) => p.brand))];
  return names
    .map((name) => {
      const products = all.filter((p) => p.brand === name);
      const families = FAMILIES.map((f) => ({ key: f.key, label: f.label, tint: f.tint, count: products.filter((p) => p.family === f.key).length }))
        .filter((f) => f.count > 0)
        .sort((a, b) => b.count - a.count);
      return { key: brandKey(name), name, count: products.length, families, products };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export interface Job {
  key: string;
  name: string;
  /** the sheet's kinds of product that do this job */
  categories: readonly string[];
}

/**
 * Jobs for which the list has products from two or more brands, named for
 * what they are used for. A job drops out on its own if a renamed category
 * leaves it with one brand.
 */
const JOB_LIST: readonly Job[] = [
  { key: "wet-area-coats", name: "Waterproof coats for bathrooms, tanks and wet areas", categories: ["Cementitious waterproofing", "Flexible cementitious waterproofing", "Cementitious waterproofing coating"] },
  { key: "waterstops", name: "Waterstops for construction joints", categories: ["Hydrophilic waterstop"] },
  { key: "tile-adhesives", name: "Tile adhesives", categories: ["Tile adhesive"] },
  { key: "epoxy-grouts", name: "Epoxy tile grouts", categories: ["Epoxy tile grout"] },
  { key: "sbr-bonding", name: "SBR bonding agents", categories: ["SBR latex bonding agent"] },
  { key: "repair-mortars", name: "Structural repair mortars", categories: ["Structural repair mortar"] },
  { key: "steel-primers", name: "Primers for exposed steel", categories: ["Reinforcement corrosion-protection primer"] },
  { key: "rust-removers", name: "Rust removers", categories: ["Rust / surface cleaner"] },
  { key: "non-shrink-grouts", name: "Non-shrink grouts", categories: ["Non-shrink cementitious grout"] },
  { key: "curing", name: "Curing compounds", categories: ["Concrete curing compound"] },
  { key: "superplasticisers", name: "Superplasticisers", categories: ["Concrete superplasticizer"] },
  { key: "hp-admixtures", name: "High-performance concrete admixtures", categories: ["High-performance concrete admixture"] },
  { key: "precast", name: "Admixtures for precast, blocks and pavers", categories: ["Precast concrete admixture"] },
];

export interface JobView extends Job {
  products: readonly Product[];
  /** the brands that have products for it, in the order of the brand list, each with its products */
  brands: readonly { name: string; key: string; products: readonly Product[] }[];
}

export function jobs(all: readonly Product[] = PRODUCTS): JobView[] {
  const order = brandInfo(all).map((b) => b.name);
  return JOB_LIST.map((j) => {
    const products = all.filter((p) => j.categories.includes(p.category));
    const brands = order.map((name) => ({ name, key: brandKey(name), products: products.filter((p) => p.brand === name) })).filter((b) => b.products.length > 0);
    return { ...j, products, brands };
  }).filter((j) => j.brands.length > 1);
}

/** a colour for each brand's mark in the comparisons (the site's own palette, not the brands' trademark colours) */
const MARK: Record<string, string> = { Fosroc: "#0b6e80", Sika: "#2756a0", CCI: "#6b5b9a", Renacon: "#97633f", Berger: "#5f7a33" };
export const brandMark = (name: string) => MARK[name] ?? "#55707f";

/** the kind of work a job belongs to, for grouping the list of jobs */
const GROUP: Record<string, string> = {
  waterproofing: "Waterproofing",
  tiling: "Tiling",
  bonding: "Repair and bonding",
  repair: "Repair and bonding",
  grouts: "Concrete and grouting",
  site: "Concrete and grouting",
  admixtures: "Concrete and grouting",
};
export const jobGroup = (j: Pick<JobView, "products">) => GROUP[j.products[0]?.family ?? ""] ?? "Other jobs";

/** the job a product belongs to, if its kind is sold by more than one brand on the list */
export const jobOf = (p: Product, js: readonly JobView[]) => js.find((j) => j.categories.includes(p.category));

/** what every product in a job has in common, as the sheet words it */
export function shared(ps: readonly Product[]) {
  const same = <K extends keyof Product>(k: K) => (ps.every((p) => p[k] === ps[0]![k]) ? (ps[0]![k] as unknown as string) : null);
  const uses = ps.map((p) => useTerms(p));
  const common = (uses[0] ?? []).filter((u) => uses.every((xs) => xs.includes(u)));
  return { category: same("category"), purpose: same("purpose"), customers: same("customers"), uses: common };
}
