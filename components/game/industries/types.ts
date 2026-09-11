/**
 * An industry pack is everything the Play board needs to become a different
 * business: the floor plan drawing, the spots requests pop from, the people
 * requests route to, and the request pool itself. RoutingGame is generic over
 * the pack; adding an industry is one new file in this folder plus a line in
 * index.ts.
 */
import type { ReactNode } from "react";
import type { Spot } from "../stage";

export type Person = {
  id: string;
  name: string;
  role: string;
  /** uppercase row title in the Admin inbox */
  tag: string;
  /** two-letter mark */
  initials: string;
};

export type Request = {
  text: string;
  from: string;
  /** Person.id */
  to: string;
  /** key into Industry.spots */
  zone: string;
};

export type Industry = {
  id: string;
  /** badge copy, e.g. "RESTAURANT & BAR" */
  label: string;
  /** the demo business, e.g. "Street Cafe" — the phone header and readouts */
  business: string;
  /** the plan, drawn on the 760×400 stage (line-work only; pins are added by PlanFrame) */
  plan: ReactNode;
  spots: Record<string, Spot[]>;
  people: Person[];
  requests: Request[];
};

/**
 * Builds a pack with zone / person names checked at compile time: every
 * request's `zone` must be a key of `spots` and its `to` an id in `people`.
 */
export function defineIndustry<Z extends string, P extends string>(def: {
  id: string;
  label: string;
  business: string;
  plan: ReactNode;
  spots: Record<Z, Spot[]>;
  people: (Omit<Person, "id"> & { id: P })[];
  requests: { text: string; from: string; to: P; zone: Z }[];
}): Industry {
  return def;
}
