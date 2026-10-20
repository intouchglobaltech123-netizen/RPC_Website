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
  pdf?: string;
}

/** photos are the makers' own pack shots, from their product pages (Berger, Sika India) */
export const PRODUCT_MEDIA: Readonly<Record<string, ProductMedia>> = {
  "berger-hs-tile-adhesive": {
    image: "berger-hs-tile-adhesive.webp",
    description: "High-quality cementitious tile adhesive designed for fixing ceramic and mosaic tiles on interior floors and walls.",
    pdf: "Tile Adhesive PDS.pdf",
  },
  "berger-hs-tile-adhesive-plus": {
    image: "berger-hs-tile-adhesive-plus.webp",
    description: "Polymer-modified cementitious tile adhesive suitable for fixing vitrified tiles, porcelain, marble, and natural stones on floors and walls.",
    pdf: "Tile Adhesive Plus PDS.pdf",
  },
  "berger-hs-tile-bond-anti-slip-grey": {
    image: "berger-hs-tile-bond-anti-slip-grey.png",
    description: "High-performance polymer-modified cementitious tile adhesive with slip resistance (C2TE) for fixing ceramic, vitrified tiles and natural stones on interior and exterior walls and floors.",
    pdf: "Tile Bond Anti-Slip PDS.pdf",
  },
  "sika-rustop": { image: "sika-rustop.webp" },
  "sika-rust-off-100": { image: "sika-rust-off-100.webp" },
  "fosroc-cebex-100": {
    image: "fosroc-cebex-100.jpg",
    description: "Expanding and plasticising admixture for cementitious grouts where a reduced water/cement ratio and positive expansions are required. Suitable for bed grouting, duct grouting, non-shrink infilling and jointing.",
    pdf: "TDS-Cebex-100-India4.pdf",
  },
  "fosroc-nitobond-ep": {
    image: "fosroc-nitobond-ep.png",
    description: "Epoxy resin concrete bonding agent for bonding fresh wet cementitious materials to existing cementitious surfaces. Suitable for horizontal surfaces, or vertical surfaces where mortar or concrete can be supported by formwork. Its long open life makes it ideal for use with formwork or where additional steel reinforcement has to be fitted.",
    pdf: "TDS_Nitobond-EP_India.pdf",
  },
  "fosroc-brushbond-grey": {
    image: "fosroc-brushbond-grey.png",
    description: "Acrylic polymer modified elastomeric waterproofing membrane coating for concrete and masonry surfaces. Provides a seamless, durable waterproof barrier for water tanks, reservoirs, swimming pools, basements, toilets and wet areas.",
    pdf: "TDS-Brushbond-India5.pdf",
  },
  "fosroc-brushbond-rfx-grey": {
    image: "fosroc-brushbond-rfx-grey.png",
    description: "High performance elastomeric cementitious waterproof coating. Used for waterproofing and protecting exposed reinforced concrete structures against water ingress, acid gases, and chloride attack. Ideal for bathrooms, balconies, water tanks, basements, and wet areas.",
    pdf: "TDS-Brushbond-RFX-India5.pdf",
  },
  "fosroc-reebaklens-rr": {
    image: "fosroc-reebaklens-rr.png",
    description: "Cleaning and etching agent for removal of rust from steel reinforcement, concrete deposits on metal and pre-treatment of concrete surfaces.",
    pdf: "TDS-Reebaklens-RR-India3.pdf",
  },
  "fosroc-rendroc-rg": {
    image: "fosroc-rendroc-rg.jpg",
    description: "General purpose, non-shrink, cementitious micro-concrete for structural concrete repair and reinstatement of large sections such as columns, beams, and slabs.",
    pdf: "TDS-Renderoc-RG_India.pdf",
  },
  "fosroc-nitozinc-primer": {
    image: "fosroc-nitozinc-primer.png",
    description: "Two-component zinc-rich epoxy primer providing active electrochemical protection to exposed steel reinforcement in concrete repair.",
    pdf: "TDS-Nitozinc-Primer-India5.pdf",
  },
  "fosroc-conplast-sp430": {
    image: "fosroc-conplast-sp430.png",
    description: "Chloride-free superplasticizing admixture based on selected sulphonated naphthalene polymers. Provides substantial water reduction and high early and ultimate strengths.",
    pdf: "TDS-Conplast-SP430-India3.pdf",
  },
  "fosroc-concure-wb-white": {
    image: "fosroc-concure-wb-white.jpg",
    description: "Water-based wax emulsion curing compound that creates a temporary membrane over freshly placed concrete to prevent rapid moisture loss.",
    pdf: "TDS-Concure-WB-White-India6.pdf",
  },
  "fosroc-conplast-wl-xtra": {
    image: "fosroc-conplast-wl-xtra.png",
    description: "Liquid integral waterproofing admixture for concrete and mortar that reduces water permeability and plastic shrinkage cracking.",
    pdf: "TDS-Conplast-WL-Xtra-India4.pdf",
  },
  "fosroc-cebex-112": {
    description: "Plasticising and expanding admixture for cementitious grouts to improve fluidity, reduce water-cement ratio, and compensate for plastic settlement.",
    pdf: "TDS-Cebex-112-200326.pdf",
  },
  "fosroc-conplast-nc": {
    image: "fosroc-conplast-nc.png",
    description: "Chloride-free accelerating admixture formulated to accelerate setting time and promote rapid early strength development of concrete.",
    pdf: "TDS-Conplast-NC-India3.pdf",
  },
  "fosroc-conplast-sd110": {
    image: "fosroc-conplast-sd110.png",
    description: "Specialized admixture for semi-dry concrete mixes used in manufacture of concrete blocks, paving stones, and precast units to improve density and finish.",
    pdf: "TDS-Conplast-SD110-India4.pdf",
  },
  "fosroc-conbextra-gp2": {
    image: "fosroc-conbextra-gp2.png",
    description: "High-strength, non-shrink, free-flowing cementitious grout for precision grouting of heavy machinery bases, stanchion plates, anchor bolts, and precast elements.",
    pdf: "TDS-Conbextra-GP2-India7.pdf",
  },
  "fosroc-conplast-sp439": {
    description: "High performance superplasticizer for precast and ready-mix concrete requiring rapid workability retention and high early strength.",
    pdf: "TDS-Conplast-SP439-India2 (1).pdf",
  },
  "fosroc-conplast-sp430-g8": {
    description: "High performance superplasticizing admixture designed to provide significant water reduction and prolonged workability retention.",
    pdf: "TDS-Conplast-SP430-G8-India3.pdf",
  },
  "fosroc-auramix-400": {
    description: "High performance PCE-based superplasticizer for ready-mix concrete requiring exceptional slump retention and high durability.",
    pdf: "TDS-Auramix-400-India3.pdf",
  },
  "fosroc-auramix-300-plus": {
    description: "Next-generation polycarboxylate ether superplasticizer for high performance concrete with low water-binder ratio and rapid strength gain.",
    pdf: "TDS-Auramix-300-Plus-India4.pdf",
  },
  "fosroc-auramix-300": {
    description: "Versatile PCE superplasticizer for high grade ready-mix concrete offering high workability and extended slump retention.",
    pdf: "TDS-Auramix-300-India3.pdf",
  },
  "fosroc-auracast-102": {
    description: "High performance polycarboxylate ether based admixture specially formulated for precast concrete applications.",
    pdf: "TDS-Auracast-102-India4.pdf",
  },
  "fosroc-supercast-sw20": {
    image: "fosroc-supercast-sw20.png",
    description: "Hydrophilic swellable waterstop designed for integral sealing of construction joints in in-situ concrete structures.",
    pdf: "TDS-Supercast-SW20-India6.pdf",
  },
  "fosroc-reebaklens": {
    image: "fosroc-reebaklens.png",
    description: "Industrial acid-based cleaner and etching agent for removal of mortar smears, concrete stains, and light rust from surfaces.",
    pdf: "TDS-Reebaklens-India4.pdf",
  },
  "fosroc-nitobond-sbr": {
    image: "fosroc-nitobond-sbr.png",
    description: "Modified SBR polymer bonding aid and mortar additive to improve adhesion, tensile strength, and water resistance of cementitious mixes.",
    pdf: "TDS-Nitobond-SBR-India5.pdf",
  },
  "fosroc-nitobond-sbr-latex": {
    image: "fosroc-nitobond-sbr-latex.png",
    description: "High performance styrene butadiene rubber latex emulsion for bonding slurry coats, waterproof renders, and repair screeds.",
    pdf: "TDS-Nitobond-SBR-Latex-India4.pdf",
  },
  "fosroc-nitobond-ar": {
    image: "fosroc-nitobond-ar.png",
    description: "Acrylic polymer bonding agent and admixture for improving adhesion, flexural strength, and durability of cement mortars.",
    pdf: "TDS-Nitobond-AR-India4.pdf",
  },
  "fosroc-nitoflor-hardtop-standard": {
    image: "fosroc-nitoflor-hardtop-standard.png",
    description: "Pre-blended non-metallic dry shake floor hardener providing high abrasion and wear resistance to monolithic concrete floors.",
    pdf: "TDS_Nitoflor-Hardtop-Standard_India-v2.pdf",
  },
  "fosroc-reebol-emulsion-xtra": {
    description: "Water-dilutable shutter release agent emulsion providing clean, stain-free striking of all types of formwork and moulds.",
    pdf: "TDS-Reebol-Emulsion-Xtra-India3.pdf",
  },
  "fosroc-conplast-crystalline": {
    image: "fosroc-conplast-crystalline.jpg",
    description: "Integral crystalline waterproofing admixture that reacts with cement hydration products to form insoluble crystals sealing concrete capillaries.",
    pdf: "TDS-Conplast-Crystalline-India6.pdf",
  },
  "sika-seal-550": {
    image: "sika-seal-550.png",
    description: "Two-component, acrylic polymer-modified cementitious elastomeric waterproofing and protective coating for concrete and masonry.",
    pdf: "pds-sikatop-550seal.pdf",
  },
  "sika-seal-551": {
    image: "sika-seal-551.png",
    description: "Two-part, flexible cementitious slurry coating for waterproofing structures subject to positive and negative water pressure.",
    pdf: "pds-sikatop-551seal.pdf",
  },
  "sika-emaco-s348": {
    image: "sika-emaco-s348.png",
    description: "High-strength, shrinkage-compensated, fiber-reinforced structural repair mortar for structural concrete reinstatement.",
    pdf: "pds-sikaemaco-s-348.pdf",
  },
  "sika-bit-w1": {
    description: "Water-based bituminous cold-applied waterproofing membrane and protective coating for basements, foundations, and below-ground structures.",
    pdf: "PDS_SikaBitW-1_2020.06.29.pdf",
  },
  "sika-control-777": {
    image: "sika-control-777.png",
    description: "Specialized permeability-reducing and shrinkage-reducing admixture engineered to improve concrete durability and limit moisture ingress.",
    pdf: "pds-sikacontrol-777.pdf",
  },
  "sika-plast-5132-t": {
    description: "High performance superplasticizer and water-reducing admixture developed to provide extended slump retention and enhanced workability in concrete mixes.",
    pdf: "pds-sikaplast-5132t.pdf",
  },
  "sika-antisol-a4-white": {
    description: "Aluminate-pigmented, resin-based liquid curing compound formulated to reduce moisture loss and solar heat absorption on freshly placed concrete surfaces.",
    pdf: "sika_antisol_a-4white.pdf",
  },
  "fosroc-nitobond-pc40": {
    image: "fosroc-nitobond-pc40.png",
    description: "Thixotropic epoxy adhesive designed for bonding precast concrete segments, external reinforcement plates, and general structural bonding.",
  },
  "fosroc-rendroc-sp40": {
    image: "fosroc-rendroc-sp40.png",
    description: "Shrinkage-controlled, polymer-modified, fibre-reinforced cementitious repair mortar for high-performance structural concrete reinstatement.",
  },
  "fosroc-nitocote-cm210-white": {
    image: "fosroc-nitocote-cm210-white.png",
    description: "Two-component polymer-modified elastomeric cementitious waterproof coating for concrete and masonry surfaces.",
  },
  "fosroc-rendroc-cs-white": {
    image: "fosroc-rendroc-cs-white.png",
    description: "Single-component cementitious polymer-modified crack sealer and finishing compound for internal and external masonry and concrete cracks.",
  },
  "fosroc-rendroc-plug": {
    image: "fosroc-rendroc-plug.png",
    description: "Rapid setting cementitious mortar designed for instant plugging and stopping of active water leaks in concrete and masonry structures.",
  },
  "sika-chapdur": {
    image: "sika-chapdur.png",
    description: "Non-metallic, pre-blended dry-shake mineral floor hardener providing superior abrasion, wear, and impact resistance for monolithic concrete floors.",
  },
  "sikadur-55-lp": {
    image: "sikadur-55-lp.png",
    description: "Two-component, low viscosity, solvent-free epoxy resin injection adhesive for structural crack repair and bonding applications.",
  },
  "sika-grout-214": {
    image: "sika-grout-214.png",
    description: "High-performance, non-shrink cementitious expanding grout for machine foundations, stanchion bases, anchor pockets, and precast concrete assembly.",
  },
  "sikaproof-sandwich-tape-100": {
    image: "sikaproof-sandwich-tape-100.png",
    description: "Double-sided self-adhesive tape designed for joint sealing, detailing, and bonding SikaProof membrane systems.",
  },
  "sikashield-w159": {
    image: "sikashield-w159.png",
    description: "Self-adhesive, cold-applied bituminous waterproofing membrane reinforced with polymer backing for below-ground and roofing waterproofing.",
  },
  "sikaswell-a2010-bar": {
    image: "sikaswell-a2010-bar.png",
    description: "Acrylic swellable waterstop profile that expands in contact with water to seal construction joints in concrete structures.",
  },
  "renacon-renaplast-ready-mix-plaster": {
    image: "renacon-renaplast-ready-mix-plaster.png",
    description: "High-quality, factory-prepared cement-based ready mix plaster formulated with graded sand and performance additives for interior and exterior masonry plastering.",
  },
};

export const mediaOf = (slug: string): ProductMedia => PRODUCT_MEDIA[slug] ?? {};
export const imageSrc = (m: ProductMedia) => (m.image ? `/images/products/${m.image}` : "");
export const videoSrc = (m: ProductMedia) => (!m.video ? "" : /^https?:\/\//.test(m.video) ? m.video : `/videos/products/${m.video}`);
export const pdfSrc = (m: ProductMedia) => (!m.pdf ? "" : /^https?:\/\//.test(m.pdf) ? m.pdf : `/docs/${m.pdf}`);
