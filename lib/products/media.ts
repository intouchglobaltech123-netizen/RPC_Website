/**
 * What RPC adds to a product beyond the price sheet: a photo, a written description and a video.
 * Keyed by the product's slug (the id on its card, e.g. "brushbond-rfx-grey").
 *
 *   photo        → public/images/products/<file>
 *   video        → public/videos/products/<file>   (an .mp4), or a YouTube link
 *
 * Example:
 *   "brushbond-rfx-grey": {
 *     image: "brushbond-rfx-grey.png",
 *     description: "Two coats by brush on a damp surface …",
 *     video: "brushbond-rfx-grey.mp4",
 *   },
 */
export interface ProductMedia {
  image?: string;
  description?: string;
  video?: string;
}

/** photos are the makers' own pack shots, from their product pages (Berger, Sika India) */
export const PRODUCT_MEDIA: Readonly<Record<string, ProductMedia>> = {
  "berger-hs-tile-adhesive": { image: "berger-hs-tile-adhesive.webp" },
  "berger-hs-tile-adhesive-plus": { image: "berger-hs-tile-adhesive-plus.webp" },
  "sika-rustop": { image: "sika-rustop.webp" },
  "sika-rust-off-100": { image: "sika-rust-off-100.webp" },
};

export const mediaOf = (slug: string): ProductMedia => PRODUCT_MEDIA[slug] ?? {};
export const imageSrc = (m: ProductMedia) => (m.image ? `/images/products/${m.image}` : "");
export const videoSrc = (m: ProductMedia) => (!m.video ? "" : /^https?:\/\//.test(m.video) ? m.video : `/videos/products/${m.video}`);
