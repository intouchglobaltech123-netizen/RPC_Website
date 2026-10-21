/**
 * Words for the monsoon house film. Each leak is named the way an owner sees
 * it (a stain, a damp wall), then explained and fixed in RPC's own terms: the
 * fixes are the site's own waterproofing steps (lib/content.ts), the causes
 * are plain, general descriptions of how water gets in. The film shows the
 * work, not the products; under each caption two short lines explain why
 * that place leaks and what we use there (`why`, `uses`), naming the Fosroc
 * and Sika products as their makers do.
 */
export type ZoneKey = "terrace" | "ceiling" | "bathroom" | "walls";
export const ZONE_KEYS: readonly ZoneKey[] = ["terrace", "ceiling", "bathroom", "walls"];

/** the labels of the two explanation lines under each caption */
export const noteLabels = ["Why", "We use"] as const;

export const intro = {
  kicker: "Waterproofing in Erode and Coimbatore",
  title: "Keep the monsoon outside.",
  lede: "A stain on the ceiling is rarely where the water gets in. Watch this house leak at the terrace, the ceiling, the bathroom and the outside walls, and the product we use to seal each one.",
  ask: "Where does yours leak?",
};

export interface LeakStep {
  zone: ZoneKey;
  /** the part of the house */
  place: string;
  /** a shorter name for the place, where space is tight */
  short?: string;
  /** what the owner notices */
  symptom: string;
  /** what the film shows while it leaks, short enough to read in a second or two */
  title: string;
  /** the work the film shows going on, as short */
  apply: string;
  /** the explanation under the caption, one line each: why it leaks, and what we use */
  why: string;
  uses: string;
  body: string;
  /** what we do about it, in order */
  fix: readonly string[];
  link: { label: string; href: string };
}

export const steps: readonly LeakStep[] = [
  {
    zone: "terrace",
    place: "Terrace",
    symptom: "Ceiling stain",
    title: "Rain soaking in through the terrace.",
    apply: "A waterproof coat laid over the whole roof.",
    why: "Rain stands on the slab and soaks through hairline cracks.",
    uses: "Fosroc Brushbond Roofguard, a fibre-reinforced acrylic coat.",
    body: "Rain stands on the roof and soaks through hairline cracks in the slab, then shows on the ceiling below, often some way from where it got in.",
    fix: ["Cracks and corners reinforced, the slab primed", "Fosroc Brushbond Roofguard, a fibre-reinforced acrylic coat, turned up the parapet walls", "Drain outlets sealed so the water runs off"],
    link: { label: "Roof and terrace methods", href: "/waterproofing#a-terrace" },
  },
  {
    zone: "ceiling",
    place: "Ceiling",
    symptom: "Peeling ceiling",
    title: "Plaster falling from a wet ceiling.",
    apply: "The patch scraped back and filled with repair mortar.",
    why: "Water from above soaks the slab, and the plaster falls.",
    uses: "SikaLatex Power to bond, Sika MonoTop\u2011122\u00a0F to fill.",
    body: "Water from the bathroom or terrace above soaks into the slab; the plaster under it swells and falls, and the paint peels. The patch is repaired once the source above is sealed.",
    fix: ["The source above found and sealed first", "Loose plaster and paint scraped back to sound concrete", "A SikaLatex Power bond coat, the patch filled with Sika MonoTop-122 F repair mortar, then repainted"],
    link: { label: "Leak repair", href: "/services" },
  },
  {
    zone: "bathroom",
    place: "Bathroom",
    symptom: "Leaking bathroom",
    title: "Water seeping through the bathroom tiles.",
    apply: "A waterproof coat on the slab, before new tiles.",
    why: "Water slips past the grout and pipes into the sunken slab.",
    uses: "Fosroc Brushbond RFX, flood-tested for 48 hours before tiling.",
    body: "Water on the floor slips past the grout and around the pipes into the sunken slab, creeps up the walls and comes through the ceiling of the room below.",
    fix: ["Sunken slab cleaned and every pipe opening sealed", "Fosroc Brushbond RFX, 300 mm up the walls and full height in the shower", "Flooded for 48 hours before a single tile goes down"],
    link: { label: "Bathroom methods", href: "/waterproofing#a-bathroom" },
  },
  {
    zone: "walls",
    place: "Outside walls",
    short: "Walls",
    symptom: "Damp wall",
    title: "Rain soaking into the outside wall.",
    apply: "Cracks filled and the wall sealed against the rain.",
    why: "Wind drives the rain into hairline cracks in the plaster.",
    uses: "Fosroc Renderoc CS in the cracks, Nitocote CM210 over the wall.",
    body: "Wind drives the rain into hairline cracks in the plaster. It soaks through the brick and lifts the paint on the inside, often with mould.",
    fix: ["Cracks filled with Fosroc Renderoc CS and loose plaster replaced", "Re-plastered with a waterproof admixture where it is needed", "Finished with Fosroc Nitocote CM210, a polymer-modified protective and waterproof coat"],
    link: { label: "Wall coatings", href: "/waterproofing#a-walls" },
  },
];

export const outro = {
  place: "Whole house",
  title: "Dry from the terrace to the outside walls.",
  /** the explanation under the caption once the house is dry */
  note: [
    ["Visit", "Free. An engineer traces every leak to where it starts."],
    ["Quote", "One recommendation, itemised, in writing."],
  ] as readonly (readonly [string, string])[],
  body: "An engineer inspects the whole building, traces each leak to where it starts, and gives you one recommendation with an itemised quote, in writing. The visit is free.",
};

/** once the film has played, on the left: the promise, the offer and how to start (the site's own words) */
export const hook = {
  kicker: intro.kicker,
  title: intro.title,
  body: outro.body,
  book: { label: "Book a free site inspection", href: "/contact" },
  chat: "WhatsApp us",
};

/**
 * The film (public/videos/hero), 20 s: the rain comes in over the house
 * (2 s), then four places of 4.4 s each, joined with short fades so each
 * starts 4.1 s after the last. For each place: the leak (about 1.5 s), the
 * coat or repair going on (about 2 s), and the place sealed (about 1 s).
 * Then the rain clears and the house is dry, which is where the film began.
 * It plays once and stops there, and the hook (above) takes over. There are no words or product packs in the film itself.
 * `applying` is when the work starts, `sealed` when it is done.
 */
export const film = {
  wide: "/videos/hero/monsoon-house-720.mp4",
  narrow: "/videos/hero/monsoon-house-540.mp4",
  poster: "/videos/hero/monsoon-house-poster.jpg",
  duration: 20,
  label:
    "A film of a house in the monsoon: water gets in through the terrace, the ceiling below, the bathroom and the outside walls; each place is shown leaking, then the waterproofing going on, and the place sealed, until the house is dry.",
  chapters: [
    { zone: "terrace", start: 1.65, applying: 3.13, sealed: 4.93, end: 5.75 },
    { zone: "ceiling", start: 5.75, applying: 7.23, sealed: 9.03, end: 9.85 },
    { zone: "bathroom", start: 9.85, applying: 11.33, sealed: 13.13, end: 13.95 },
    { zone: "walls", start: 13.95, applying: 15.43, sealed: 17.23, end: 18.05 },
  ] as readonly { zone: ZoneKey; start: number; applying: number; sealed: number; end: number }[],
  /** the rain clears and the house is dry */
  outro: 18.05,
};
