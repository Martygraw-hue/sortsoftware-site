/**
 * The cast and the request pool for the Right Person Routing game.
 * Street Cafe is the demo organization used across the SORT brand (the
 * sortconnect.com phones use it too), so the game and the real product read
 * as one world.
 *
 * Every request names the part of the floor it comes from (`zone`), so it
 * pops up on the floor plan where it actually happened — a bar problem at a
 * stool, a table problem at a table — before it flies to the right person.
 */

import type { Zone } from "./stage";

export type PersonId = "dana" | "ray" | "luis" | "priya";

export type Person = {
  id: PersonId;
  name: string;
  role: string;
  /** uppercase row title in the Admin inbox */
  tag: string;
  /** two-letter mark on the tile */
  initials: string;
};

export const PEOPLE: Person[] = [
  { id: "dana", name: "Dana", role: "Manager", tag: "MANAGER", initials: "DA" },
  { id: "ray", name: "Ray", role: "Kitchen", tag: "KITCHEN", initials: "RA" },
  { id: "luis", name: "Luis", role: "Maintenance", tag: "MAINTENANCE", initials: "LU" },
  { id: "priya", name: "Priya", role: "Payroll", tag: "PAYROLL", initials: "PR" },
];

export type Request = {
  text: string;
  from: string;
  to: PersonId;
  zone: Zone;
};

export const REQUESTS: Request[] = [
  // Ray — Kitchen
  { text: "86 the halibut, we're out", from: "Jess", to: "ray", zone: "kitchen" },
  { text: "Table 6 has a shellfish allergy, heads up", from: "Marco", to: "ray", zone: "tables" },
  { text: "Table 6 says she never got her dessert", from: "Jess", to: "ray", zone: "tables" },
  { text: "Are we doing the brunch special tomorrow?", from: "Tom", to: "ray", zone: "lounge" },
  { text: "The walk-in smells off, something turned", from: "Nina", to: "ray", zone: "kitchen" },
  { text: "Out of brioche buns, sub to potato?", from: "Marco", to: "ray", zone: "kitchen" },
  { text: "Soup was cold at table 12", from: "Jess", to: "ray", zone: "tables" },
  { text: "Booth 2 is asking if the chili is gluten-free", from: "Sam", to: "ray", zone: "booths" },
  // Luis — Maintenance
  { text: "Walk-in is reading 48°", from: "Tom", to: "luis", zone: "kitchen" },
  { text: "Ice machine is making that noise again", from: "Nina", to: "luis", zone: "bar" },
  { text: "Bathroom faucet won't shut off", from: "Jess", to: "luis", zone: "restrooms" },
  { text: "Dish machine is leaking under the door", from: "Tom", to: "luis", zone: "kitchen" },
  { text: "Front door sticks, customers keep shoving it", from: "Sam", to: "luis", zone: "host" },
  { text: "The lamp over booth 3 keeps flickering", from: "Marco", to: "luis", zone: "booths" },
  { text: "Tap 4 is pouring all foam", from: "Nina", to: "luis", zone: "bar" },
  // Priya — Payroll
  { text: "My check is short 6 hours", from: "Marco", to: "priya", zone: "lounge" },
  { text: "Saturday's tip-out never hit my account", from: "Jess", to: "priya", zone: "bar" },
  { text: "Can I get my W-2 emailed?", from: "Nina", to: "priya", zone: "office" },
  { text: "I clocked out late Tuesday, can you fix it?", from: "Tom", to: "priya", zone: "kitchen" },
  { text: "Changed banks, where do I update direct deposit?", from: "Sam", to: "priya", zone: "host" },
  { text: "Is holiday pay time and a half?", from: "Marco", to: "priya", zone: "lounge" },
  // Dana — Manager
  { text: "Hey, we're out of pint glasses", from: "Sam", to: "dana", zone: "bar" },
  { text: "It's getting really busy up front, I need help!!", from: "Sam", to: "dana", zone: "host" },
  { text: "Table 9 wants to speak to a manager", from: "Marco", to: "dana", zone: "tables" },
  { text: "Can I swap Friday with Nina?", from: "Jess", to: "dana", zone: "lounge" },
  { text: "A customer left their wallet in booth 3", from: "Sam", to: "dana", zone: "booths" },
  { text: "I'm sick, can't make it tonight", from: "Tom", to: "dana", zone: "lounge" },
  { text: "Health inspector just walked in", from: "Nina", to: "dana", zone: "host" },
  { text: "Someone left a 1-star review about the wait", from: "Marco", to: "dana", zone: "office" },
  { text: "Party of 14 just walked in, no reservation", from: "Sam", to: "dana", zone: "host" },
  { text: "Bar's out of limes, can someone run to the store?", from: "Nina", to: "dana", zone: "bar" },
];

export const personById = (id: PersonId): Person =>
  PEOPLE.find((p) => p.id === id)!;
