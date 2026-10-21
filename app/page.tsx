import type { Metadata } from "next";
import { Footer } from "@/components/contact/Footer";
import { HomeHooks } from "@/components/home3/HomeHooks";
import { MonsoonHero } from "@/components/home4/MonsoonHero";
import { blogPosts } from "@/lib/blog";
import { brand, projects } from "@/lib/content";
import type { HookData } from "@/lib/home/hooks";
import { PLACES } from "@/lib/methods/data";
import { SPOTS } from "@/lib/pages/methods-tools";
import { FAMILIES, PRODUCTS } from "@/lib/products";
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
  ["Superplasticisers", ["fosroc-conplast-sp430", "fosroc-conplast-sp430-g8", "fosroc-conplast-sp430-es2"]],
  ["High-performance admixtures", ["fosroc-auramix-400", "fosroc-auramix-350", "fosroc-auramix-300", "fosroc-auramix-300-plus", "fosroc-auramix-200-20", "fosroc-auramix-200-41"]],
  ["Accelerator", ["fosroc-conplast-nc"]],
  ["Mortar plasticiser", ["fosroc-cebex-112"]],
  ["Block admixture", ["fosroc-conplast-sd110"]],
  ["Waterproofing admixture", ["fosroc-conplast-crystalline"]],
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

/** what the hooks need, gathered here on the server */
const hookData: HookData = {
  shelf: BEST_SELLERS.flatMap(([group, slugs]) => {
    const ps = slugs.map((s) => PRODUCTS.find((x) => x.slug === s)).filter((p): p is (typeof PRODUCTS)[number] => Boolean(p));
    const [lead, ...rest] = ps;
    return lead ? [{ group, lead: { name: lead.name, slug: lead.slug, cat: lead.category, pic: picOf(lead.slug) }, more: rest.map((p) => p.name) }] : [];
  }),
  places: Object.entries(SPOTS).map(([key, s]) => ({ key, label: s.short, n: PLACES.find((pl) => pl.key === key)?.methods.length ?? 0 })),
  projects: projects.map((p) => ({ slug: p.slug, name: p.name, location: p.location, type: p.type, image: p.image })),
  posts: [...blogPosts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)
    .map((p) => ({ slug: p.slug, title: p.title, category: p.category, minutes: p.readMinutes, excerpt: p.excerpt })),
};

/**
 * Home: the monsoon house (a film of a house in the rain: each leak, from the
 * terrace to the outside walls, is shown and sealed in turn), then one hook
 * for each page in the order of the top menu (about, products, waterproofing,
 * projects, services, blog, contact), each with a button to it; and the
 * site's own footer.
 */
export default function Home() {
  return (
    <>
      <main id="main" className="relative">
        <MonsoonHero />
        <HomeHooks data={hookData} />
      </main>
      <Footer />
    </>
  );
}
