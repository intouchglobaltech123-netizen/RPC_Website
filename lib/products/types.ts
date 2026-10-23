export type Brand = "Fosroc" | "Sika" | "CCI" | "Berger" | "Renacon";
export type Family = "waterproofing" | "admixtures" | "tiling" | "bonding" | "repair" | "grouts" | "site" | "walling" | "other";
/** the kind of container a pack comes in, for its little drawing */
export type Shape = "bag" | "kit" | "pail" | "can" | "drum" | "roll" | "block" | "bottle" | "tin" | "cartridge" | "sachet" | "pouch";

export interface Pack {
  size: string;
  shape: string;
  /** its S.No in the spreadsheet */
  sheet: number;
  /** the name as the spreadsheet lists it */
  listed: string;
}

export interface Product {
  slug: string;
  brand: string;
  name: string;
  family: string;
  /** what kind of product it is (the sheet's "Product Details / Category") */
  category: string;
  /** what problem it solves */
  purpose: string;
  /** where it is used */
  areas: string;
  /** who usually buys it */
  customers: string;
  packs: readonly Pack[];
}
