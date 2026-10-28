/**
 * Words for the home film: one 7-storey apartment built from the ground up, stage by stage,
 * the way a building project uses construction chemicals (the stages and their
 * purposes follow RPC's "Construction chemicals, stage by stage" chart). Each
 * stage names what the film shows, what the chemicals there are for, and what
 * we use, naming only products on RPC's own product list (lib/products/catalogue.ts)
 * as their makers name them.
 */
export type StageKey = "basement" | "concrete" | "structure" | "tiling" | "wet" | "terrace";

export interface Stage {
  key: StageKey;
  /** the stage, as the timeline names it */
  short: string;
  /** the stage in full, over the caption */
  name: string;
  /** what the film shows at this stage */
  title: string;
  /** why the stage needs its chemical */
  purpose: string;
  /** what we use there */
  uses: string;
  /**
   * the one product the film zooms in on at this stage: its name, and in one
   * plain line what it does there. It is on the film for the whole stage
   */
  product: { name: string; does: string };
  link: { label: string; href: string };
}

/** the labels of the two lines under each caption */
export const noteLabels = ["Purpose", "We use"] as const;

export const intro = {
  kicker: "Construction chemicals in Erode and Coimbatore",
  title: "The right chemical at every stage.",
  lede: "Watch one apartment building go up from the basement to the terrace, and see the chemical each stage needs to stay strong and dry.",
  /** under the stages: scroll on for the next stage, or (at the last) for the finished building */
  next: "for the next stage",
  last: "to see it finished",
  ask: "Stage by stage",
};

export const stages: readonly Stage[] = [
  {
    key: "basement",
    short: "Basement",
    name: "Foundation and basement",
    title: "The basement cast in the dug pit.",
    purpose: "Its walls sit against wet soil, so water has to be stopped before anything goes up.",
    uses: "An HDPE waterproofing membrane on the basement walls.",
    product: { name: "HDPE waterproofing membrane", does: "A waterproof sheet on the outside of the basement walls that keeps groundwater out." },
    link: { label: "Basement methods", href: "/waterproofing" },
  },
  {
    key: "concrete",
    short: "Concrete",
    name: "Concrete, mixing and pouring",
    title: "Columns and slabs poured, floor by floor.",
    purpose: "Every slab carries the floors above it, so the concrete has to be strong and dense.",
    uses: "A superplasticiser admixture in the slab concrete.",
    product: { name: "Superplasticiser concrete admixture", does: "Mixed into the concrete so it flows with less water and sets stronger and denser." },
    link: { label: "Concrete admixtures", href: "/products" },
  },
  {
    key: "structure",
    short: "Structure",
    name: "Structural construction",
    title: "Seven floors of frame, each column base grouted.",
    purpose: "Each column passes the building's weight down to its base, so the base must be solid.",
    uses: "Non-shrink grout under the column base plates.",
    product: { name: "Non-shrink cementitious grout", does: "A non-shrink grout under each column base plate, so the load passes down evenly." },
    link: { label: "Grouts and anchors", href: "/products" },
  },
  {
    key: "tiling",
    short: "Tiling",
    name: "Flooring and tiling",
    title: "Walls up, floors tiled on a combed adhesive bed.",
    purpose: "Floors take daily wear for decades, so every tile has to stay bonded.",
    uses: "Polymer tile adhesive under every floor tile.",
    product: { name: "Polymer-modified tile adhesive", does: "Bonds every floor tile firmly, with no hollow spots or loose tiles later." },
    link: { label: "Tiling products", href: "/products" },
  },
  {
    key: "wet",
    short: "Bathrooms",
    name: "Bathrooms, toilets and wet areas",
    title: "Every bathroom sealed before a tile goes down.",
    purpose: "Bathrooms are wet every day, and any leak shows up in the flat below.",
    uses: "A flexible waterproof coating on the bathroom floors and walls.",
    product: { name: "Flexible cementitious waterproofing", does: "A flexible waterproof coat under the bathroom tiles, so water never reaches the flat below." },
    link: { label: "Bathroom methods", href: "/waterproofing#a-bathroom" },
  },
  {
    key: "terrace",
    short: "Terrace",
    name: "Terrace and roof waterproofing",
    title: "The terrace coated, the building and its grounds finished.",
    purpose: "The roof takes all the rain and sun, so it has to stay sealed for years.",
    uses: "A white reflective waterproof coating over the whole terrace.",
    product: { name: "White reflective roof coating", does: "A white waterproof coat that seals the roof against rain and reflects the sun's heat." },
    link: { label: "Terrace methods", href: "/waterproofing#a-terrace" },
  },
];

/** once the film has played, on the left: the promise, the offer and how to start */
export const hook = {
  kicker: "Waterproofing and construction chemicals in Erode and Coimbatore",
  title: "Built right at every stage.",
  body: "An engineer visits your site, checks each stage of your building, and tells you exactly what it needs.",
  /** what the visit gives you, as three short lines under the body */
  points: ["The visit is free", "One clear recommendation", "An itemised quote, in writing"],
  book: { label: "Book a free site inspection", href: "/contact" },
  chat: "WhatsApp us",
};

/**
 * The film (public/videos/build): the same apartment building, from the same
 * place, from the dug basement pit to the finished building and its grounds, each stage turning into
 * the next (Veo 3.1 Lite in Google Flow, from stage stills made in Flow).
 * At each stage the camera then moves in close on the one place the stage's
 * product goes, the product goes on, and the camera comes back out as the
 * next stage begins.
 * `chapters` are when each stage is on screen (seconds); from `uses` the
 * camera is in close on the stage's product and its card at the top left
 * brightens, until `back`, when the camera comes back out. The film
 * opens on the dug pit, which belongs to the first stage, and ends pulling back
 * from the terrace to the finished site. Scrolling plays it one stage at a time
 * (lib/build-film/mount.ts): each stage stops at `back`, in close on its
 * product; the last step plays on to the end, where the hook takes over. There are no words
 * or product packs in the film itself: the names are written over it.
 */
export const film = {
  wide: "/videos/build/build-apartment-1080.mp4",
  narrow: "/videos/build/build-apartment-720.mp4",
  poster: "/videos/build/build-apartment-poster.jpg",
  label:
    "A film of one seven-storey apartment building being built, from the dug basement pit to the finished building and its gardens, moving in close at each stage as its product goes on: a membrane fixed to the basement wall, the slab concrete poured, grout under a column base, tile adhesive on a floor, a waterproof coat in a bathroom, and a white coat on the terrace.",
  duration: 28.07,
  chapters: [
    { key: "basement", start: 0.00, uses: 1.50, back: 3.35, end: 3.40 },
    { key: "concrete", start: 3.40, uses: 4.90, back: 6.65, end: 6.70 },
    { key: "structure", start: 6.70, uses: 8.20, back: 9.65, end: 9.70 },
    { key: "tiling", start: 9.70, uses: 11.50, back: 15.70, end: 15.75 },
    { key: "wet", start: 15.75, uses: 17.55, back: 20.35, end: 20.40 },
    { key: "terrace", start: 20.40, uses: 22.20, back: 25.20, end: 28.07 },
  ] as readonly { key: StageKey; start: number; uses: number; back: number; end: number }[],
};
