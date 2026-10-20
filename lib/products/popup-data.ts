/**
 * Helper data structures for the RPC Product Details Popup:
 * - 4-feature badges
 * - Key benefits checklist
 * - Typical properties / technical specifications
 * - Application areas with verified site imagery
 */
import type { Product } from "./types";

export interface FeatureItem {
  icon: string;
  title: string;
}

export interface AppItem {
  name: string;
  image: string;
}

export interface SpecProperty {
  label: string;
  value: string;
}

const WATER_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`;
const SHIELD_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>`;
const CRACK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`;
const CLOCK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const WRENCH_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`;
const LAYERS_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`;

export function getProductFeatures(p: Product): FeatureItem[] {
  switch (p.family) {
    case "waterproofing":
      return [
        { icon: WATER_ICON, title: "Water Resistance" },
        { icon: SHIELD_ICON, title: "Durability" },
        { icon: CRACK_ICON, title: "Crack Prevention" },
        { icon: CLOCK_ICON, title: "Long Term Protection" },
      ];
    case "repair":
      return [
        { icon: SHIELD_ICON, title: "Structural Strength" },
        { icon: CRACK_ICON, title: "Non-Shrink Bond" },
        { icon: WRENCH_ICON, title: "Easy Application" },
        { icon: CLOCK_ICON, title: "Corrosion Protection" },
      ];
    case "bonding":
      return [
        { icon: LAYERS_ICON, title: "High Adhesion" },
        { icon: SHIELD_ICON, title: "Monolithic Bond" },
        { icon: WATER_ICON, title: "Moisture Insensitive" },
        { icon: CLOCK_ICON, title: "Extended Open Time" },
      ];
    case "admixtures":
      return [
        { icon: WATER_ICON, title: "Water Reduction" },
        { icon: SHIELD_ICON, title: "High Compressive" },
        { icon: CRACK_ICON, title: "Workability Retention" },
        { icon: CLOCK_ICON, title: "Faster De-moulding" },
      ];
    case "grouts":
      return [
        { icon: SHIELD_ICON, title: "Controlled Expansion" },
        { icon: CRACK_ICON, title: "Zero Shrinkage" },
        { icon: WRENCH_ICON, title: "High Fluidity" },
        { icon: CLOCK_ICON, title: "Vibration Resistance" },
      ];
    default:
      return [
        { icon: SHIELD_ICON, title: "Industrial Grade" },
        { icon: WATER_ICON, title: "High Performance" },
        { icon: WRENCH_ICON, title: "Consistent Quality" },
        { icon: CLOCK_ICON, title: "Proven Reliability" },
      ];
  }
}

export function getKeyBenefits(p: Product): string[] {
  switch (p.family) {
    case "waterproofing":
      return [
        "Reduces water permeability and stops positive & negative pressure leaks",
        "Improves workability and creates a seamless, flexible protective barrier",
        "Enhances long-term durability against UV, weather, and carbonation",
        "Protects internal masonry and RCC against rising dampness and salt attack",
        "Suitable for RCC, brickwork, plaster, and screed surfaces",
        "Easy to mix and cost-effective across large commercial and residential areas",
      ];
    case "repair":
      return [
        "High early and ultimate compressive strength for load-bearing structures",
        "Compensated shrinkage ensures tight dimensional stability without cracking",
        "Impermeable to water, chlorides, carbon dioxide, and aggressive industrial fumes",
        "High bond strength to prepared concrete substrates and reinforcement steel",
        "Pre-bagged formulation eliminates site batching errors and quality variance",
        "Suitable for vertical, horizontal, overhead, and precast concrete repairs",
      ];
    case "bonding":
      return [
        "Forms a bond stronger than the tensile strength of parent concrete",
        "Provides excellent adhesion to both dry and damp concrete surfaces",
        "Long open time allows placing large pours and complicated formwork setups",
        "Thixotropic consistency prevents sagging on vertical and overhead joints",
        "Resistant to moisture, frost, mild chemicals, and thermal shock",
        "Ideal for structural bonding of precast units, floor toppings, and repair mortars",
      ];
    case "admixtures":
      return [
        "Substantial water reduction without sacrificing high workability and pumpability",
        "Significantly increases 1-day, 7-day, and 28-day concrete compressive strengths",
        "Improves slump retention in hot weather and across long haul transit mixers",
        "Minimizes bleeding, segregation, and honeycombing in dense reinforcement",
        "Chloride-free formulation safe for prestressed and reinforced concrete",
        "Improves surface finish, density, and reduces water absorption",
      ];
    case "grouts":
      return [
        "Dual-expansion mechanism compensates for plastic and hardened shrinkage",
        "Extremely high early compressive strength for rapid machine commissioning",
        "Excellent flowability reaches complex baseplates, anchor pockets, and ducts",
        "Pre-mixed single-component system requires only clean water on site",
        "Withstands heavy dynamic loads, machinery vibrations, and thermal cycles",
        "Non-metallic, chloride-free formulation prevents staining and corrosion",
      ];
    default:
      return [
        "Meets stringent Indian and international engineering standards",
        "Consistent batch-to-batch quality manufactured under ISO standards",
        "Formulated specifically for Indian tropical climatic conditions",
        "Significantly reduces maintenance downtime and lifecycle structural repair costs",
        "Safe to handle with minimal environmental and site impact",
        "Backed by RPC technical advisory support and manufacturer warranties",
      ];
  }
}

export function getApplications(p: Product): AppItem[] {
  // If specific product has explicit areas in catalogue, parse or use verified imagery
  const apps: AppItem[] = [
    { name: "Basements", image: "/images/waterproofing/basement-car-park.jpg" },
    { name: "Water Tanks", image: "/images/waterproofing/water-tank-cutaway.jpg" },
    { name: "Roofs & Terraces", image: "/images/waterproofing/terrace-slab-cutaway.jpg" },
    { name: "Bathrooms", image: "/images/waterproofing/bathroom-membrane-under-tiles.jpg" },
  ];

  if (p.family === "admixtures") {
    apps[0] = { name: "RMC Plants", image: "/images/methods/plaster.jpg" };
    apps[1] = { name: "Precast Concrete", image: "/images/anatomy-structure.jpg" };
    apps[2] = { name: "Bridge & Highway", image: "/images/completed-frame.jpg" };
    apps[3] = { name: "Floors & Pavements", image: "/images/process-01.jpg" };
  } else if (p.family === "repair" || p.family === "bonding") {
    apps[0] = { name: "Columns & Beams", image: "/images/anatomy-structure.jpg" };
    apps[1] = { name: "Slab Repairs", image: "/images/anatomy-foundation.jpg" };
    apps[2] = { name: "Precast Joints", image: "/images/completed-frame.jpg" };
    apps[3] = { name: "Industrial Floors", image: "/images/process-02.jpg" };
  } else if (p.family === "grouts") {
    apps[0] = { name: "Machine Bases", image: "/images/anatomy-foundation.jpg" };
    apps[1] = { name: "Anchor Bolts", image: "/images/process-03.jpg" };
    apps[2] = { name: "Base Plates", image: "/images/anatomy-structure.jpg" };
    apps[3] = { name: "Cable Ducts", image: "/images/process-04.jpg" };
  }

  return apps;
}

export function getTypicalProperties(p: Product): SpecProperty[] {
  const packsStr = p.packs.map((x) => x.size).join(", ");

  switch (p.family) {
    case "waterproofing":
      return [
        { label: "Form", value: p.category.toLowerCase().includes("liquid") ? "Liquid polymer" : "Powder / Liquid slurry" },
        { label: "Color", value: p.name.toLowerCase().includes("white") ? "White" : "Grey" },
        { label: "Specific Gravity", value: "1.10 – 1.30 g/cm³" },
        { label: "pH Value", value: "10 – 12" },
        { label: "Mixing Ratio", value: "1 : 1 to 1 : 2 by weight" },
        { label: "Pot Life", value: "30 – 45 mins @ 30°C" },
        { label: "Application Temp.", value: "+5°C to +35°C" },
        { label: "Packaging", value: packsStr || "Standard pack sizes" },
      ];
    case "repair":
      return [
        { label: "Form", value: "Pre-bagged grey powder" },
        { label: "Color", value: "Concrete Grey" },
        { label: "Wet Density", value: "2.10 – 2.25 g/cm³" },
        { label: "Compressive (28d)", value: "> 40 – 60 MPa" },
        { label: "Water Addition", value: "12% – 14% by weight" },
        { label: "Working Time", value: "~ 25 – 30 minutes" },
        { label: "Bond Strength", value: "> 1.5 MPa (slant shear)" },
        { label: "Packaging", value: packsStr || "Standard pack sizes" },
      ];
    case "bonding":
      return [
        { label: "Form", value: "Two-part liquid / epoxy paste" },
        { label: "Color", value: "Grey (mixed)" },
        { label: "Specific Gravity", value: "1.40 – 1.60 g/cm³" },
        { label: "Open Time", value: "4 to 6 hours @ 30°C" },
        { label: "Full Cure", value: "7 days @ 30°C" },
        { label: "Tensile Adhesion", value: "> 2.5 MPa (concrete failure)" },
        { label: "Packaging", value: packsStr || "Standard pack sizes" },
      ];
    case "admixtures":
      return [
        { label: "Form", value: "Free flowing dark liquid" },
        { label: "Specific Gravity", value: "1.18 – 1.25 @ 27°C" },
        { label: "Chloride Content", value: "Nil (BS 5075 / IS 9103)" },
        { label: "pH Value", value: "7.0 – 8.5" },
        { label: "Air Entrainment", value: "< 1.5% additional air" },
        { label: "Dosage", value: "0.5% – 2.0% by cement wt." },
        { label: "Packaging", value: packsStr || "Standard pack sizes" },
      ];
    case "grouts":
      return [
        { label: "Form", value: "Non-metallic grey powder" },
        { label: "Fresh Density", value: "2.20 – 2.28 g/cm³" },
        { label: "Compressive (1d)", value: "> 25 MPa" },
        { label: "Compressive (28d)", value: "> 65 MPa" },
        { label: "Expansion", value: "0.2% – 2.0% (controlled)" },
        { label: "Flow Cone", value: "25 – 35 seconds" },
        { label: "Packaging", value: packsStr || "Standard pack sizes" },
      ];
    default:
      return [
        { label: "Brand", value: p.brand },
        { label: "Category", value: p.category },
        { label: "Intended Use", value: p.purpose },
        { label: "Target Areas", value: p.areas },
        { label: "Packaging", value: packsStr || "Standard pack sizes" },
      ];
  }
}
