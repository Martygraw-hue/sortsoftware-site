import { FourTop, Restroom, TwoTop } from "../PlanParts";
import { defineIndustry } from "./types";

/** Street Cafe — the demo restaurant used across the SORT brand. */

const plan = (
  <g>
    {/* walls: kitchen across the back with a doorway into the dining room,
        the bar open to the floor, restrooms in the front corner. Every room
        has an opening — no door swings, just a gap in the wall */}
    <rect className="wall" x="24" y="22" width="712" height="340" rx="2" />
    <path className="wall" d="M470 22V140" />
    <path className="wall" d="M24 140H250M290 140H470" />
    <path className="wall" d="M620 250H736M620 250V362" />
    <path className="gap" d="M620 290V330" />
    {/* front door */}
    <path className="gap" d="M310 362H350" />

    {/* kitchen: the line along the back wall, a prep table, the walk-in */}
    <rect className="seat" x="36" y="34" width="300" height="26" rx="2" />
    <path
      className="seat"
      d="M66 34v26M96 34v26M126 34v26M156 34v26M186 34v26M216 34v26M246 34v26M276 34v26M306 34v26"
      fill="none"
    />
    <rect className="fur" x="150" y="88" width="110" height="22" rx="2" />
    <rect className="fur" x="380" y="34" width="76" height="60" rx="2" />
    <text className="zone" x="388" y="70">
      Walk-in
    </text>
    <text className="zone" x="36" y="126">
      Kitchen
    </text>

    {/* bar: back bar on the wall, the counter, stools on the dining side */}
    <rect className="seat" x="486" y="32" width="236" height="12" rx="2" />
    <rect className="fur" x="486" y="70" width="236" height="20" rx="3" />
    {[508, 552, 596, 640, 684].map((x) => (
      <circle key={x} className="fur" cx={x} cy="108" r="7" />
    ))}
    <text className="zone" x="486" y="134">
      Bar
    </text>

    {/* dining room: four-tops in the middle, two-tops along the front */}
    <FourTop x={110} y={200} />
    <FourTop x={220} y={200} />
    <FourTop x={330} y={200} />
    <FourTop x={440} y={200} />
    <TwoTop x={540} y={200} />
    <FourTop x={110} y={290} />
    <FourTop x={220} y={290} />
    <TwoTop x={460} y={290} />
    <TwoTop x={540} y={290} />
    <text className="zone" x="36" y="350">
      Dining
    </text>
    {/* host stand by the door */}
    <rect className="fur" x="372" y="322" width="40" height="22" rx="2" />

    {/* restrooms */}
    <Restroom x={678} y={300} />
    <text className="zone" x="628" y="350">
      Restrooms
    </text>
  </g>
);

export const restaurant = defineIndustry({
  id: "restaurant",
  label: "Restaurant & Bar",
  business: "Street Cafe",
  plan,
  spots: {
    kitchen: [
      { x: 180, y: 47 }, // the line
      { x: 205, y: 99 }, // prep table
      { x: 418, y: 64 }, // walk-in
      { x: 270, y: 140 }, // the kitchen door
    ],
    bar: [508, 552, 596, 640, 684].map((x) => ({ x, y: 108 })), // stools
    dining: [
      { x: 110, y: 200 },
      { x: 220, y: 200 },
      { x: 330, y: 200 },
      { x: 440, y: 200 },
      { x: 540, y: 200 },
      { x: 110, y: 290 },
      { x: 220, y: 290 },
      { x: 460, y: 290 },
      { x: 540, y: 290 },
    ],
    restrooms: [{ x: 678, y: 300 }],
    entrance: [
      { x: 392, y: 333 }, // host stand
      { x: 330, y: 350 }, // the front door
    ],
  },
  people: [
    {
      id: "dana",
      name: "Dana",
      role: "Manager",
      tag: "MANAGER",
      initials: "DA",
    },
    { id: "ray", name: "Ray", role: "Kitchen", tag: "KITCHEN", initials: "RA" },
    {
      id: "luis",
      name: "Luis",
      role: "Maintenance",
      tag: "MAINTENANCE",
      initials: "LU",
    },
    {
      id: "priya",
      name: "Priya",
      role: "Payroll",
      tag: "PAYROLL",
      initials: "PR",
    },
  ],
  requests: [
    // Dana
    {
      text: "It's getting really busy up front, I need help!!",
      from: "Sam",
      to: "dana",
      zone: "entrance",
    },
    {
      text: "Table 9 wants to speak to a manager",
      from: "Marco",
      to: "dana",
      zone: "dining",
    },
    {
      text: "A customer left their wallet at table 3",
      from: "Sam",
      to: "dana",
      zone: "dining",
    },
    {
      text: "Health inspector just walked in",
      from: "Nina",
      to: "dana",
      zone: "entrance",
    },
    {
      text: "Hey, we're out of pint glasses",
      from: "Sam",
      to: "dana",
      zone: "bar",
    },
    // Ray
    {
      text: "86 the halibut, we're out",
      from: "Jess",
      to: "ray",
      zone: "kitchen",
    },
    {
      text: "Are we doing the brunch special tomorrow?",
      from: "Tom",
      to: "ray",
      zone: "kitchen",
    },
    {
      text: "The walk-in smells off, something turned",
      from: "Nina",
      to: "ray",
      zone: "kitchen",
    },
    {
      text: "Table 6 has a shellfish allergy, heads up",
      from: "Marco",
      to: "ray",
      zone: "dining",
    },
    {
      text: "Table 6 says she never got her dessert",
      from: "Jess",
      to: "ray",
      zone: "dining",
    },
    // Luis
    {
      text: "The light over table 3 keeps flickering",
      from: "Marco",
      to: "luis",
      zone: "dining",
    },
    {
      text: "Bathroom faucet won't shut off",
      from: "Jess",
      to: "luis",
      zone: "restrooms",
    },
    {
      text: "Ice machine is making that noise again",
      from: "Nina",
      to: "luis",
      zone: "bar",
    },
    {
      text: "Tap 4 is pouring all foam",
      from: "Nina",
      to: "luis",
      zone: "bar",
    },
    {
      text: "Front door sticks, customers keep shoving it",
      from: "Sam",
      to: "luis",
      zone: "entrance",
    },
    // Priya
    {
      text: "Saturday's tip-out never hit my account",
      from: "Jess",
      to: "priya",
      zone: "bar",
    },
    {
      text: "Changed banks, where do I update direct deposit?",
      from: "Sam",
      to: "priya",
      zone: "entrance",
    },
    {
      text: "My check is short 6 hours",
      from: "Marco",
      to: "priya",
      zone: "kitchen",
    },
    {
      text: "Can I get my W-2 emailed?",
      from: "Nina",
      to: "priya",
      zone: "kitchen",
    },
    {
      text: "I clocked out late Tuesday, can you fix it?",
      from: "Tom",
      to: "priya",
      zone: "kitchen",
    },
  ],
});
