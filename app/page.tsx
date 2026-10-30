import type { Metadata } from "next";
import { Footer } from "@/components/contact/Footer";
import { HomeHooks } from "@/components/home3/HomeHooks";
import { StagesHero } from "@/components/home4/StagesHero";
import { brand, projects } from "@/lib/content";
import type { HookData } from "@/lib/home/hooks";
import { steps } from "@/lib/monsoon/copy";
import { FAMILIES, PRODUCTS } from "@/lib/products";
import { otherBrands } from "@/lib/methods/brand-logos";
import { brandInfo, brandMark } from "@/lib/products/brands";
import { imageSrc, mediaOf } from "@/lib/products/media";
import { packArt } from "@/lib/products/pack-art";

const title = "Waterproofing Contractors in Erode & Coimbatore | RPC Constructions";
const description =
  "Terrace, bathroom, sump and basement waterproofing in Erode and Coimbatore, plus leak repair and leak-free new homes, offices and factories. Free site inspection.";

/** the home page's own search title and snippet (the layout's stay as the site defaults) */
export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: brand.name,
    title,
    description,
    images: [{ url: "/images/og-rpc.png", width: 1200, height: 630, alt: "RPC Constructions: waterproofing and construction in Erode, Coimbatore and across Tamil Nadu" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/images/og-rpc.png"] },
};

/**
 * Our best-selling Fosroc products, as RPC ticked them on Fosroc's product
 * selection chart, grouped the way the chart groups them. Only the ones on
 * RPC's product list are shown, each linking to its card on the products page.
 */
const BEST_SELLERS: readonly [string, readonly string[]][] = [
  ["Superplasticiser", ["fosroc-conplast-sp430", "fosroc-conplast-sp430-g8", "fosroc-conplast-sp430-es2"]],
  ["PCE admixture", ["fosroc-auramix-400", "fosroc-auramix-350", "fosroc-auramix-300", "fosroc-auramix-300-plus", "fosroc-auramix-200-20", "fosroc-auramix-200-41"]],
  ["Accelerator", ["fosroc-conplast-nc"]],
  ["Mortar plasticiser", ["fosroc-cebex-112"]],
  ["Waterproofing", ["fosroc-conplast-crystalline"]],
];

/** a product's picture: the maker's pack shot where we have one, otherwise its pack drawn in the colour of its kind */
const picOf = (slug: string) => {
  const p = PRODUCTS.find((x) => x.slug === slug);
  if (!p) return "";
  const img = imageSrc(mediaOf(slug));
  if (img) return `<img src="${img}" alt="" loading="lazy" decoding="async">`;
  const tint = FAMILIES.find((f) => f.key === p.family)?.tint ?? "#55707f";
  return packArt(`hk-${p.slug}`, p.packs[0]?.shape ?? "bag", tint, p.packs[0]?.size ?? "");
};

/** for each leak in the film, the still of the place leaking and the same place dry (frames of the film, in /public/images/rain) */
const STILLS: Readonly<Record<string, { before: string; after: string }>> = {
  terrace: { before: "/images/rain/terrace-before.webp", after: "/images/rain/terrace-after.webp" },
  ceiling: { before: "/images/rain/leak-before.webp", after: "/images/rain/leak-after.webp" },
  bathroom: { before: "/images/rain/bath-before.webp?v=2", after: "/images/rain/bath-after.webp?v=2" },
  walls: { before: "/images/rain/wall-before.webp", after: "/images/rain/wall-after.webp" },
};

/** the brand slide: the product list's brands (most products first), then the methods guide's other brands */
function brandSlide() {
  const listed = brandInfo().map((b) => ({ name: b.name, color: brandMark(b.name) }));
  return [...listed, ...otherBrands(listed.map((l) => l.name)).map((name) => ({ name, color: "" }))];
}

/** what the hooks need, gathered here on the server */
const hookData: HookData = {
  shelf: BEST_SELLERS.flatMap(([group, slugs]) => {
    const ps = slugs.map((s) => PRODUCTS.find((x) => x.slug === s)).filter((p): p is (typeof PRODUCTS)[number] => Boolean(p));
    const [lead, ...rest] = ps;
    return lead ? [{ group, lead: { name: lead.name, slug: lead.slug, cat: lead.category, pic: picOf(lead.slug) }, more: rest.map((p) => p.name) }] : [];
  }),
  signs: steps.map((x) => ({ place: x.place, see: x.title, fix: x.apply, href: x.link.href, ...STILLS[x.zone]! })),
  projects: projects.slice(0, 3).map((p) => ({ slug: p.slug, name: p.name, location: p.location, type: p.type, image: p.image, summary: p.summary })),
  brands: brandSlide(),
};

/**
 * Home: one house built stage by stage (a film from the foundation pit to the
 * finished house, with what each stage needs and what we use), then one hook
 * for each page in the order of the top menu (about, products, waterproofing,
 * projects, services, blog, contact), each with a button to it; and the
 * site's own footer.
 */
export default function Home() {
  return (
    <>
      <main id="main" className="relative">
        <StagesHero />
        <HomeHooks data={hookData} />
      </main>
      <Footer />
    </>
  );
}
