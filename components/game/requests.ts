/**
 * The cast and the request pool for the Right Person Routing game.
 * Street Cafe is the demo organization used across the SORT brand (the
 * sortconnect.com phones use it too), so the game and the real product read
 * as one world.
 */

export type PersonId = "dana" | "ray" | "luis" | "priya";

export type Person = {
  id: PersonId;
  name: string;
  role: string;
  /** uppercase row title in the Admin inbox */
  tag: string;
  /** what they say when handed the wrong note */
  nope: string;
  /** two-letter mark on the tile */
  initials: string;
};

export const PEOPLE: Person[] = [
  { id: "dana", name: "Dana", role: "Manager", tag: "MANAGER", nope: "Not mine", initials: "DA" },
  { id: "ray", name: "Ray", role: "Kitchen", tag: "KITCHEN", nope: "Not the kitchen", initials: "RA" },
  { id: "luis", name: "Luis", role: "Maintenance", tag: "MAINTENANCE", nope: "Not a repair", initials: "LU" },
  { id: "priya", name: "Priya", role: "Payroll", tag: "PAYROLL", nope: "Not payroll", initials: "PR" },
];

export type Request = {
  text: string;
  from: string;
  to: PersonId;
};

export const REQUESTS: Request[] = [
  // Ray — Kitchen
  { text: "86 the halibut, we're out", from: "Jess", to: "ray" },
  { text: "Table 6 has a shellfish allergy, heads up", from: "Marco", to: "ray" },
  { text: "Are we doing the brunch special tomorrow?", from: "Tom", to: "ray" },
  { text: "The walk-in smells off, something turned", from: "Nina", to: "ray" },
  { text: "Out of brioche buns, sub to potato?", from: "Marco", to: "ray" },
  { text: "Soup was cold at table 12", from: "Jess", to: "ray" },
  // Luis — Maintenance
  { text: "Walk-in is reading 48°", from: "Tom", to: "luis" },
  { text: "Ice machine is making that noise again", from: "Nina", to: "luis" },
  { text: "Bathroom faucet won't shut off", from: "Jess", to: "luis" },
  { text: "Patio light is out. Again.", from: "Marco", to: "luis" },
  { text: "Dish machine is leaking under the door", from: "Tom", to: "luis" },
  { text: "Front door sticks, customers keep shoving it", from: "Sam", to: "luis" },
  // Priya — Payroll
  { text: "My check is short 6 hours", from: "Marco", to: "priya" },
  { text: "Saturday's tip-out never hit my account", from: "Jess", to: "priya" },
  { text: "Can I get my W-2 emailed?", from: "Nina", to: "priya" },
  { text: "I clocked out late Tuesday, can you fix it?", from: "Tom", to: "priya" },
  { text: "Changed banks, where do I update direct deposit?", from: "Sam", to: "priya" },
  { text: "Is holiday pay time and a half?", from: "Marco", to: "priya" },
  // Dana — Manager
  { text: "Table 9 wants to speak to a manager", from: "Sam", to: "dana" },
  { text: "Can I swap Friday with Nina?", from: "Jess", to: "dana" },
  { text: "A customer left their wallet in booth 3", from: "Sam", to: "dana" },
  { text: "I'm sick, can't make it tonight", from: "Tom", to: "dana" },
  { text: "Health inspector just walked in", from: "Nina", to: "dana" },
  { text: "Someone left a 1-star review about the wait", from: "Marco", to: "dana" },
  { text: "Party of 14 just walked in, no reservation", from: "Sam", to: "dana" },
];

export const personById = (id: PersonId): Person =>
  PEOPLE.find((p) => p.id === id)!;
