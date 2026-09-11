import { restaurant } from "./restaurant";
import { auto } from "./auto";
import { retail } from "./retail";
import { hotel } from "./hotel";
import { medical } from "./medical";

export type { Industry, Person, Request } from "./types";

/** the picker's order; the first is the default */
export const INDUSTRIES = [restaurant, auto, retail, hotel, medical];
