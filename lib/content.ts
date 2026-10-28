/**
 * RPC Constructions — single source of truth for site copy & data.
 *
 * Anything wrapped in square brackets — "[ … ]" — or marked PLACEHOLDER is
 * NOT real RPC information. Replace it with approved brand copy / facts
 * before launch. No RPC-specific facts have been invented here.
 */

export const brand = {
  name: "RPC Constructions",
  short: "RPC",
  taglineA: "Building",
  taglineB: "what lasts.",
  descriptor: "Construction · Waterproofing · Land to Roof",
  established: "Est. 2012",
  city: "Erode",
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Waterproofing", href: "/waterproofing" },
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export const contact = {
  email: "contact@rpcconstructions.com",
  phone: "+91 94428 95907",
  address: "142 Perundurai Road, Erode, Tamil Nadu 638011, India",
  hours: "Mon – Sat · 08:30 – 18:30 IST",
  /** PLACEHOLDER — replace "#" with the real profile URLs before launch */
  socials: [
    { label: "LinkedIn", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "WhatsApp", href: "https://wa.me/919442895907" },
  ],
  whatsapp: "https://wa.me/919442895907",
  mapQuery: "142 Perundurai Road, Erode, Tamil Nadu 638011",
  geo: { lat: 11.341, lng: 77.7172 },
  regions: ["Erode", "Coimbatore", "Tiruppur", "Salem", "Chennai"],
} as const;



/** The seven chapters of the hero film. Narrative copy, no company claims. */
export const heroStages = [
  { id: "01", key: "site", title: "The Site", line: "Every building begins as open ground — surveyed, understood, respected." },
  { id: "02", key: "blueprint", title: "Blueprint", line: "Lines before load. Every decision drawn, measured and resolved on paper first." },
  { id: "03", key: "foundation", title: "Foundation", line: "What no one will ever see carries everything they will." },
  { id: "04", key: "structure", title: "Structure", line: "Column, beam, slab — rising floor by floor with engineered precision." },
  { id: "05", key: "shell", title: "Envelope", line: "Walls close, glass is set, materials arrive at their final state." },
  { id: "06", key: "completion", title: "Completion", line: "Landscape, light and the quiet details that make a place feel finished." },
  { id: "07", key: "reveal", title: "Handover", line: "A project, born." },
] as const;

export type ProjectStatus = "Completed" | "Under construction" | "In design";

export interface Project {
  slug: string;
  name: string;
  location: string;
  type: string;
  area: string;
  year: string;
  status: ProjectStatus | string;
  image: string;
  summary: string;
  structuralSystem?: string;
  materials?: string;
  clientType?: string;
  /** the waterproofing system built into the project, layer by layer ("·" between layers) */
  waterproofing?: string;
  /** the full view's text: the water risk on this site and how it was handled */
  story?: string;
}

/**
 * SAMPLE PROJECTS — PLACEHOLDER. These are illustrative Tamil Nadu projects
 * written to show the layout; they are NOT real RPC commissions. Replace the
 * names, figures and photos with RPC's actual portfolio before launch.
 */
export const projects: Project[] = [
  {
    slug: "kaveri-residences",
    name: "Kaveri Residences",
    location: "Perundurai Road, Erode",
    type: "Residential",
    area: "[42,000 sq ft]",
    year: "[2024]",
    status: "Completed",
    image: "/images/projects/kaveri-residences-perundurai-road.jpg",
    summary: "Six storeys of three-bedroom homes with deep shaded balconies, rooftop solar and a landscaped front court.",
    story: "The rooftop solar stands are fixed through the terrace, so every bolt and cable entry was sleeved and sealed into the terrace membrane before the panels went up.",
    structuralSystem: "RCC framed structure on isolated footings",
    materials: "Fly-ash brick masonry, cement plaster, aluminium glazing, vitrified tile",
    clientType: "[Private Developer]",
    waterproofing: "HDPE membrane under the raft · DPC · PU terrace membrane · pond-tested wet areas",
  },
  {
    slug: "avinashi-corporate-centre",
    name: "Avinashi Corporate Centre",
    location: "Avinashi Road, Coimbatore",
    type: "Commercial",
    area: "[1,10,000 sq ft]",
    year: "[2023]",
    status: "Completed",
    image: "/images/projects/avinashi-corporate-centre-coimbatore.jpg",
    summary: "A G+8 office building with a double-glazed façade and column-free floors for flexible tenancies.",
    story: "The basement car park sits below the level of the road outside, so it was built like a tank in reverse: sealed on every side to keep groundwater and road run-off out.",
    structuralSystem: "RCC core with flat-slab floors",
    materials: "Double-glazed unitised curtain wall, ACP cladding, granite flooring",
    clientType: "[Commercial Developer]",
    waterproofing: "Crystalline basement with PVC waterstops · PU roof membrane · sealed curtain-wall joints",
  },
  {
    slug: "thindal-courtyard-villa",
    name: "Thindal Courtyard Villa",
    location: "Thindal, Erode",
    type: "Villa",
    area: "[6,800 sq ft]",
    year: "[2024]",
    status: "Completed",
    image: "/images/projects/thindal-courtyard-villa-erode.jpg",
    summary: "A family home arranged around an open-to-sky courtyard, with teak joinery and a garden verandah.",
    story: "Clay tiles shed most of the rain but not all of it, so the slab beneath them carries its own protection, and the open courtyard is graded so water runs away from every threshold.",
    structuralSystem: "Load-bearing RCC frame with sloped RCC roof",
    materials: "Mangalore clay tile, Athangudi tile, teak wood, lime plaster",
    clientType: "[Private Client]",
    waterproofing: "Anti-termite + DPC plinth · membrane under clay tiles · 2-coat bathrooms, epoxy grout",
  },
  {
    slug: "sipcot-textile-processing-unit",
    name: "SIPCOT Textile Processing Unit",
    location: "SIPCOT Industrial Park, Perundurai",
    type: "Industrial",
    area: "[2,40,000 sq ft]",
    year: "[2025]",
    status: "Under construction",
    image: "/images/projects/sipcot-textile-unit-perundurai.jpg",
    summary: "A textile processing and warehousing unit with long-span steel sheds and rooftop solar.",
    story: "Textile processing runs on water, so the floors that carry it and the roof that keeps the monsoon off the machines were the first things to be detailed.",
    structuralSystem: "Pre-engineered steel buildings on RCC pedestals",
    materials: "Colour-coated roof sheeting, precast compound wall, trimix flooring",
    clientType: "[Industrial Client]",
    waterproofing: "Integral-admixture trimix floors · sealed roof-sheet laps · storm-water drainage",
  },
  {
    slug: "anna-nagar-mixed-use",
    name: "Anna Nagar Mixed-Use",
    location: "Anna Nagar, Chennai",
    type: "Mixed-use",
    area: "[88,000 sq ft]",
    year: "[2026]",
    status: "In design",
    image: "/images/projects/anna-nagar-mixed-use-chennai.jpg",
    summary: "Street-level shops with offices and apartments above, planned around a shaded central courtyard.",
    story: "Chennai’s heavy northeast-monsoon rain shaped the design: the basement, the podium and the street-facing façade were detailed against water before anything else.",
    structuralSystem: "RCC frame with post-tensioned transfer slab",
    materials: "Exposed concrete, terracotta jaali screens, glazing",
    clientType: "[Joint Development]",
    waterproofing: "Crystalline basement · PU podium & terrace · elastomeric façade coating",
  },
];

export interface ServiceItem {
  id: string;
  title: string;
  /** a short line over the title on the services page */
  short?: string;
  /** one short line for the home page's services index */
  line?: string;
  body: string;
  image: string;
  deliverables: string[];
  timeline: string;
  scale: string;
}

export const services: ServiceItem[] = [
  {
    id: "01",
    title: "Waterproofing",
    short: "Our core service",
    line: "Terraces, bathrooms, sumps and basements",
    body: "Terrace, bathroom, sump, basement and external-wall waterproofing in Erode and Coimbatore, for houses and apartments, offices and factories: repairs to buildings in use, and protection designed into new ones.",
    image: "/film/wp-final.jpg",
    deliverables: [
      "Terraces & roofs: PU or torch-on membranes",
      "External walls: waterproof plaster & elastomeric paint",
      "Bathrooms & kitchens: two coats, pond-tested",
      "Sumps, tanks & basements: crystalline and HDPE",
    ],
    timeline: "Days for a repair; built in for new work",
    scale: "One bathroom to a factory roof",
  },
  {
    id: "02",
    title: "Residential Construction",
    short: "Homes in Erode & Coimbatore",
    line: "Leak-free houses, villas and apartments",
    body: "Independent houses, villas and apartment blocks delivered turnkey, with every terrace, bathroom and sump sealed while the building goes up rather than after the first leak.",
    image: "/images/waterproofing/villa-with-pool.jpg",
    deliverables: [
      "Soil test & foundation design",
      "RCC frame, masonry & damp-proof course",
      "Electrical, plumbing & HVAC",
      "Flooring, joinery, painting & landscaping",
    ],
    timeline: "8 – 24 months",
    scale: "1,500 – 80,000 sq ft",
  },
  {
    id: "03",
    title: "Commercial Construction",
    short: "Offices, retail & healthcare",
    line: "Offices and showrooms with dry basements",
    body: "Offices, showrooms, hospitals and hotels on busy roads such as Avinashi Road, built for heavy daily use, with basement car parks that stay dry and façades sealed against driving rain.",
    image: "/images/projects/avinashi-corporate-centre-coimbatore.jpg",
    deliverables: [
      "Flat-slab & long-span RCC structures",
      "Basement & podium waterproofing",
      "Fire safety, lifts & MEP coordination",
      "Shell-and-core or full fit-out",
    ],
    timeline: "12 – 30 months",
    scale: "10,000 – 2,50,000 sq ft",
  },
  {
    id: "04",
    title: "Industrial Construction",
    short: "SIPCOT & private industrial parks",
    line: "Factories and PEB sheds with sealed roofs",
    body: "Factories, warehouses and processing units around Perundurai, Tiruppur and Coimbatore, with roofs, gutters and floors detailed to keep machinery and stock dry through the monsoon.",
    image: "/images/projects/sipcot-textile-unit-perundurai.jpg",
    deliverables: [
      "Pre-engineered steel buildings (PEB)",
      "Trimix & VDF floors with integral waterproofing",
      "Machine foundations & pits",
      "Leak-proof roof sheeting, gutters & drainage",
    ],
    timeline: "6 – 18 months",
    scale: "20,000 – 4,00,000 sq ft",
  },
  {
    id: "05",
    title: "Renovation & Leak Repair",
    short: "For buildings in use",
    line: "Ceiling leaks, damp walls and cracks fixed",
    body: "Ceiling leaks, seepage, damp walls and cracks traced to where the water actually enters, with structural strengthening and extensions planned around the people still using the building.",
    image: "/stages/08-plastering.jpg",
    deliverables: [
      "Leak & dampness survey",
      "Crack injection & re-plastering",
      "Terrace & bathroom re-waterproofing",
      "Jacketing, micro-concrete & extensions",
    ],
    timeline: "2 – 10 months",
    scale: "Single floors to full buildings",
  },
  {
    id: "06",
    title: "Interiors",
    short: "Drawn with the building",
    line: "Kitchens and wardrobes over sealed wet areas",
    body: "Kitchens, wardrobes and ceilings fitted to the same drawings as the building, with sinks, bathrooms and utility areas sealed and tested before tiles and cabinets cover them.",
    image: "/images/interior-joinery.jpg",
    deliverables: [
      "Modular kitchens & wardrobes",
      "False ceilings & lighting",
      "Custom joinery & wall panelling",
      "Stone & tile floors over tested wet areas",
    ],
    timeline: "1 – 6 months",
    scale: "Single rooms to full buildings",
  },
  {
    id: "07",
    title: "Project Management",
    short: "For owners & developers",
    line: "Approvals, costs and stage-by-stage checks",
    body: "Independent control of cost, programme and quality for owners and developers, including an inspection of each waterproofing layer before the next trade covers it.",
    image: "/images/process-01.jpg",
    deliverables: [
      "DTCP & local-body approvals",
      "BOQ, tendering & cost control",
      "Programme & site supervision",
      "Pond-test records & handover documents",
    ],
    timeline: "Full project lifecycle",
    scale: "All project sizes",
  },
];

/**
 * How we waterproof (About page): six steps on every job, each with a still
 * from RPC's own waterproofing film. `alt` describes the picture itself.
 */
export const process = [
  {
    id: "01",
    title: "Inspect the whole building",
    body: "We start on the terrace and work down to the sump, noting every damp patch, crack, failed joint and blocked outlet. The visit is free.",
    image: "/images/waterproofing/villa-upper-floors.jpg",
    alt: "Upper floors and terraces of a three-storey villa at dusk",
  },
  {
    id: "02",
    title: "Trace the water to its source",
    body: "A stain on a ceiling is rarely where water gets in. We follow it back through the slab, the pipes or the joints, so the repair lands where the leak begins.",
    image: "/images/waterproofing/terrace-slab-cutaway.jpg",
    alt: "Cutaway of a terrace slab showing the concrete, the waterproofing layers and a rainwater outlet",
  },
  {
    id: "03",
    title: "Choose one system, in writing",
    body: "Every surface needs its own method. You get one recommendation, the reason for it and an itemised quote before any work begins.",
    image: "/images/waterproofing/basement-wall-cutaway.jpg",
    alt: "Cutaway of a basement wrapped in a waterproofing membrane, with groundwater held outside the wall",
  },
  {
    id: "04",
    title: "Prepare, then apply",
    body: "Loose plaster comes off, cracks are opened and filled and pipe openings are sealed. Only then does the coating go on, coat by coat, up every wall it meets.",
    image: "/images/waterproofing/bathroom-membrane-under-tiles.jpg",
    alt: "Bathroom with its floor tiles lifted to show the waterproofing coat under the shower and up the walls",
  },
  {
    id: "05",
    title: "Test it with water",
    body: "Bathrooms and terraces are flooded and tanks filled, then left to stand before anything covers them. If the level drops, we find out why before moving on.",
    image: "/images/waterproofing/water-tank-cutaway.jpg",
    alt: "Cutaway of an underground water tank filled for a leak test, with a sealed pipe through its wall",
  },
  {
    id: "06",
    title: "Hand over, dry",
    body: "You receive the finished work with its test records, and advice on keeping outlets and joints in order through the next monsoon.",
    image: "/images/waterproofing/villa-pool-deck.jpg",
    alt: "A finished villa with its pool deck, the waterproofed structure just visible beneath the paving",
  },
] as const;

/** About page: the six values, each with its own drawn mark (lib/pages/about.ts) */
export const principles = [
  { title: "Honesty", body: "A straight diagnosis, even when the fix turns out smaller than you feared." },
  { title: "Engineering", body: "Systems chosen on technical grounds: the surface, the exposure and the movement each must take." },
  { title: "Craftsmanship", body: "Laps sealed, corners coved and outlets dressed by hand. Leaks live in the details." },
  { title: "Materials", body: "Tested, branded products, stored and mixed exactly as their makers specify." },
  { title: "Respect", body: "Your home treated with care: furniture covered, work areas cleared and disruption kept small." },
  { title: "Timing", body: "Terraces finished before the rains, and bathrooms out of use for as few days as possible." },
] as const;

/** Home page, About: four short facts about the company */
export const highlights = [
  { title: "Engineer-led", body: "Every problem diagnosed by an engineer, not guessed at." },
  { title: "Every surface, in-house", body: "Terraces to sumps, by our own site teams." },
  { title: "One contract", body: "No gaps between waterproofing and building trades." },
] as const;

/** Company story, vision and commitments (About page). Review wording before launch. */
export const company = {
  story: [
    "RPC Constructions was founded in Erode in 2012 on a simple idea: a building should be planned with care, engineered with rigour and kept dry for as long as it stands.",
    "Today we waterproof and build for families, businesses and industry, on anything from a single flat to a factory shed. The engineer who first visits a job follows it through to the final test.",
    "Hard summers followed by heavy monsoons mean that water is what damages most buildings here first. So new buildings get their protection in six stages as they rise, and in existing ones we repair a leak where it enters, not where it shows.",
  ],
  vision: "To be the first call in western Tamil Nadu when water gets into a building, and the builder trusted to keep it out from the start.",
  mission:
    "To trace every leak to its source, apply tested waterproofing and construction systems with our own engineers on site, and hand over dry work on the date and price we promised.",
} as const;

/**
 * RPC's two partners, shown on the About page: the first with the photo on
 * the left, the second with it on the right.
 */
export const partners: readonly { name: string; role: string; qualification: string; bio: string; image: string }[] = [
  {
    name: "Velmurugan Sivanantham",
    role: "Partner",
    qualification: "",
    bio: "Leads site inspections, leak diagnostics and waterproofing specifications across Erode, Coimbatore and western Tamil Nadu, following each job from the first survey through to water testing and handover.",
    image: "/images/partners/velmurugan-sivanantham.webp",
  },
  {
    name: "Aravinth Sivanantham",
    role: "Partner",
    qualification: "",
    bio: "Oversees turnkey construction, material standards, programme planning and client coordination across residential, commercial and industrial sites, keeping every stage on schedule and held to the written scope.",
    image: "/images/partners/aravinth-sivanantham.webp",
  },
];

/**
 * PLACEHOLDER — founder / managing director. Replace the name, message and
 * portrait (public/images/founder.jpg) with the real details before launch.
 */
export const founder = {
  name: "[Founder Name]",
  role: "Founder & Managing Director",
  qualifications: "[B.E. Civil Engineering]",
  image: "" as string, // e.g. "/images/founder.jpg"
  message: [
    "When we started RPC, we promised every client one thing — that we would build their project as carefully as we would build our own home.",
    "That promise still guides every drawing we check and every slab we pour. Our engineers stay on site, our costs stay open, and our work carries our name for generations.",
  ],
} as const;

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  qualifications?: string;
}

/** Leadership team. PLACEHOLDER — replace with the real team before launch. */
export const team: readonly TeamMember[] = [
  { name: "[Name]", role: "Head of Engineering", qualifications: "[B.E. Civil / M.E. Structural]", bio: "Leads structural design review, drawings and quality control across all sites." },
  { name: "[Name]", role: "Head of Projects", qualifications: "[B.E. Civil]", bio: "Runs site planning, programme and contractor coordination from start to handover." },
  { name: "[Name]", role: "Head of Design", qualifications: "[B.Arch]", bio: "Guides architecture, interiors and material selection with every client." },
] as const;

/** Registrations. PLACEHOLDER — keep only the ones RPC actually holds. */
export const accreditations = [
  { code: "GST", title: "GST Registered", detail: "[GSTIN to be added]" },
  { code: "MSME", title: "Udyam Registered", detail: "[Udyam number to be added]" },
  { code: "PWD", title: "Registered Contractor", detail: "[Class & registration number to be added]" },
  { code: "ISO", title: "ISO 9001", detail: "[Only if certified — otherwise remove]" },
] as const;

export const technicalCapabilities = [
  {
    title: "Soil investigation & foundation design",
    description: "Bore-hole data and plate-load tests drive the choice of isolated, raft or pile foundations for each site.",
  },
  {
    title: "Structural design to Indian Standards",
    description: "RCC and steel structures designed to IS 456, IS 800 and IS 1893 (seismic), and checked independently.",
  },
  {
    title: "3D coordination before construction",
    description: "Architecture, structure and services modelled together, so clashes are solved on screen — not on site.",
  },
  {
    title: "Tested materials, inspected work",
    description: "Cube tests, steel and cement certificates and stage-wise inspection records for every floor.",
  },
] as const;

export const engagementModels = [
  {
    model: "Design & Build (Turnkey)",
    description: "One contract for architecture, engineering, approvals, waterproofing and construction, with a single team answerable for all of it.",
    benefit: "Fixed scope, single point of responsibility.",
  },
  {
    model: "Construction Only",
    description: "You bring approved drawings; we build them with our own site teams, and detail the waterproofing wherever the drawings leave it out.",
    benefit: "Competitive pricing on a clear BOQ.",
  },
  {
    model: "Waterproofing & Repair",
    description: "For buildings that already stand: we inspect, repair and re-waterproof just the surfaces that need it, however big the building.",
    benefit: "Scope limited to the problem you have.",
  },
] as const;

export const departments = [
  { name: "New projects & tenders", email: "projects@rpcconstructions.com", phone: "+91 94428 95907" },
  { name: "Vendors & suppliers", email: "purchase@rpcconstructions.com", phone: "+91 94428 95907" },
  { name: "Careers", email: "careers@rpcconstructions.com", phone: "+91 94428 95907" },
] as const;

export const faqs = [
  {
    question: "Is waterproofing included in every RPC project?",
    answer: "Yes. Every building gets six stages of waterproofing as part of the construction — anti-termite treatment and an HDPE membrane under the raft, crystalline concrete and waterstops in the foundation, a damp-proof course at plinth, integral admixture in every pour, pond-tested wet areas, and a PU membrane with elastomeric coating on the roof and façade.",
  },
  {
    question: "Can you fix leakage in an existing building?",
    answer: "Yes. We survey the leak or dampness, trace it to the source and repair it — terrace, bathrooms, basements, water tanks or external walls — with the same systems we use in new construction.",
  },
  {
    question: "When is the optimal time to engage RPC?",
    answer: "Ideally during early feasibility or conceptual design. Early involvement allows our engineering team to provide buildability advice, value-engineer structural systems, and establish accurate budgets before municipal plan sanctions.",
  },
  {
    question: "Do you oversee planning permissions and building control?",
    answer: "Yes. Our team manages all statutory approvals including DTCP / municipal corporation planning applications, structural stability certificates, utility connections, and final completion sign-offs.",
  },
  {
    question: "What scale of commissions do you undertake?",
    answer: "We deliver bespoke private residences, commercial complexes, and industrial facilities. We are structured to give every commission dedicated director-level attention.",
  },
  {
    question: "Can we visit current RPC construction sites?",
    answer: "Yes. Prospective clients are welcomed to inspect our active sites and completed projects in Erode, Coimbatore, Chennai, and surrounding regions by appointment to witness our craftsmanship and site standards firsthand.",
  },
] as const;

/** value: a number animates (count-up). PLACEHOLDER figures — confirm before launch. */
export const stats: { value: number | string; suffix: string; label: string }[] = [
  { value: 148, suffix: "+", label: "Projects" },
  { value: 14, suffix: "+", label: "Years" },
  { value: 92, suffix: "+", label: "Clients" },
  { value: 14, suffix: "", label: "Cities" },
];

/** Anatomy section: each system, the waterproofing technique used on it, and how it is done. */
export const anatomy = [
  { key: "roof", label: "Roof", note: "PU membrane + heat-reflective coat", technique: "PU liquid membrane", steps: ["Slab cleaned & primed", "2 coats of PU, turned up the parapet", "White reflective coat keeps it cool"], image: "/images/anatomy-wp-roof.jpg", alt: "Worker rolling a PU waterproofing membrane on a terrace, with a white heat-reflective top coat" },
  { key: "windows", label: "Windows", note: "Sealed frames, drip grooves, silicone joints", technique: "Sealed frames & drip grooves", steps: ["Gap round the frame sealed with silicone", "Sill sloped outward", "Drip groove under the sunshade"], image: "/images/anatomy-wp-windows.jpg", alt: "Worker sealing an aluminium window frame with silicone under a sunshade with a drip groove, above a sloped granite sill" },
  { key: "walls", label: "Walls", note: "Waterproof plaster + elastomeric façade paint", technique: "Waterproof plaster + elastomeric paint", steps: ["Brick wall", "Plaster with waterproof admixture", "Elastomeric paint bridges hairline cracks"], image: "/images/anatomy-wp-walls.jpg", alt: "Cutaway of an external wall: brick, waterproof plaster and elastomeric paint being applied" },
  { key: "interior", label: "Wet areas", note: "2-coat wet areas, pond-tested, epoxy grout", technique: "2-coat coating + pond test", steps: ["Pipe openings sealed with collars", "2 coats on floor & 300 mm up walls", "Flooded 48 h, then tiled with epoxy grout"], image: "/images/anatomy-wp-interior.jpg", alt: "Bathroom coated with grey waterproofing and flooded for a pond test, next to a finished tiled area" },
  { key: "structure", label: "Structure", note: "Integral waterproofing admixture in every pour", technique: "Integral waterproofing admixture", steps: ["Admixture dosed into every batch", "Dense, low-permeability concrete", "Vibrated & cured — no path for water"], image: "/images/anatomy-wp-structure.jpg", alt: "Worker adding waterproofing admixture to the concrete mixer during a slab pour" },
  { key: "foundation", label: "Foundation", note: "Anti-termite, HDPE membrane, crystalline + DPC", technique: "Anti-termite + HDPE membrane", steps: ["Soil treated with anti-termite", "HDPE sheet with welded laps under the raft", "Crystalline coat & waterstops at joints"], image: "/images/anatomy-wp-foundation.jpg", alt: "Anti-termite spraying and a black HDPE membrane laid under the raft reinforcement" },
] as const;

export const manifesto =
  "A building is a promise made in concrete and kept dry for generations. We plan it with care, waterproof it from land to roof and build it to outlast us.";


/**
 * Homepage hero — "Land to Roof" waterproofing story. 8 scroll steps:
 * intro, the six waterproofing stages, finale. One film clip per step.
 */
export type WaterproofStep = {
  key: string;
  rail: string;
  eyebrow: string;
  title: string;
  titleEm?: string;
  technique?: string;
  process?: readonly string[];
  body?: string;
};

export const waterproofSteps: readonly WaterproofStep[] = [
  {
    key: "intro",
    rail: "The building",
    eyebrow: "RPC Construction Solutions · Waterproofing",
    title: "Sealed where",
    titleEm: "you can't see.",
    body: "Five places water tries to get into a building — and how RPC seals each one. Scroll to go inside.",
  },
  {
    key: "terrace",
    rail: "Terrace",
    eyebrow: "Terrace / flat roof",
    title: "A roof that sheds every monsoon",
    technique: "PU liquid membrane + heat-reflective top coat",
    process: ["Slab primed, cracks & corners reinforced", "2 coats of PU, turned up the parapet walls", "Coved corners, sealed drain outlets", "White reflective coat keeps the slab cool"],
  },
  {
    key: "bathroom",
    rail: "Bathrooms",
    eyebrow: "Bathrooms & wet areas",
    title: "No leak through the ceiling below",
    technique: "2-component cementitious coating + pond test",
    process: ["Sunken slab cleaned, pipe penetrations sealed", "2 coats — 300 mm up walls, full height in showers", "48-hour pond test before a single tile", "Tiles laid with epoxy grout"],
  },
  {
    key: "sump",
    rail: "Water tank",
    eyebrow: "Underground water tank / sump",
    title: "Clean water in, groundwater out",
    technique: "Crystalline coating inside + membrane outside",
    process: ["RCC walls with PVC waterstops at the joints", "Crystalline coat on every inside face", "Membrane wrap against the soil outside", "Inlet, outlet & overflow pipes sealed with flanges"],
  },
  {
    key: "basement",
    rail: "Basement",
    eyebrow: "Basement & retaining walls",
    title: "A dry basement below the water table",
    technique: "HDPE membrane + waterstops at every joint",
    process: ["HDPE sheet under the basement raft", "Membrane wrapped up the retaining walls", "PVC waterstops at construction joints", "Protection board & drainage layer before backfill"],
  },
  {
    key: "pool",
    rail: "Swimming pool",
    eyebrow: "Swimming pool & water structures",
    title: "Water stays in the pool",
    technique: "Cementitious waterproofing under the tiles + waterstops",
    process: ["RCC shell cast with waterstops at the joints", "Inlets & main drain sealed into the shell", "2-coat cementitious waterproofing inside", "Mosaic tiles, then a full fill test"],
  },
  {
    key: "finale",
    rail: "Complete",
    eyebrow: "Construction chemicals & waterproofing",
    title: "Every hidden layer,",
    titleEm: "done right.",
    body: "Terrace to sump, bathroom to pool — protected, tested and handed over dry. Book a free site inspection.",
  },
];
