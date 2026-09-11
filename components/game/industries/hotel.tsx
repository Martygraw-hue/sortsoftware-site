import { Bed, FourTop, Shelf } from "../PlanParts";
import { defineIndustry } from "./types";

/** The Harbor Inn — a small independent hotel, ground floor. */

function Room({ x, n }: { x: number; n: number }) {
  /* one guest room in the row: bed, wardrobe, a door onto the corridor.
     The walls between rooms are drawn once, in the plan, as single lines */
  return (
    <g>
      <Bed x={x + 34} y={y0 + 50} />
      <rect
        className="fur"
        x={x + 66}
        y={y0 + 16}
        width="16"
        height="30"
        rx="2"
      />
      <path className="gap" d={`M${x + 34} ${y0 + 108}h28`} />
      <text className="zone" x={x + 8} y={y0 + 100}>{`${n}`}</text>
    </g>
  );
}
const y0 = 22;

const plan = (
  <g>
    {/* walls: a row of six guest rooms across the back sharing walls, the
        stairs at the end of the row, a corridor in front of them; then the
        public floor — lobby and front desk at the door, breakfast on one
        side, linen closet and laundry on the other. Openings, no swings */}
    <rect className="wall" x="24" y="22" width="712" height="340" rx="2" />
    {/* the room row: one long wall on the corridor side, single dividers */}
    <path className="wall" d="M24 130H736" />
    <path
      className="wall"
      d="M120 22V130M216 22V130M312 22V130M408 22V130M504 22V130M600 22V130"
    />
    <Room x={24} n={101} />
    <Room x={120} n={102} />
    <Room x={216} n={103} />
    <Room x={312} n={104} />
    <Room x={408} n={105} />
    <Room x={504} n={106} />
    {/* stairs */}
    <path className="gap" d="M650 130H690" />
    <rect className="fur" x="630" y="32" width="80" height="70" rx="1" />
    <path
      className="fur"
      d="M630 42h80M630 52h80M630 62h80M630 72h80M630 82h80M630 92h80"
      fill="none"
    />
    <path className="fur" d="M670 98V40M664 46l6-6 6 6" fill="none" />
    <text className="zone" x="630" y="122">
      Stairs
    </text>

    {/* public floor */}
    <path className="wall" d="M24 190H736" />
    <path className="gap" d="M270 190H310" />
    <path className="wall" d="M230 190V362M560 190V362" />
    <path className="gap" d="M230 270V310M560 230V262M560 300V332" />
    <path className="wall" d="M560 276H736" />
    <path className="gap" d="M375 362H415" />

    {/* breakfast room */}
    <FourTop x={80} y={250} />
    <FourTop x={170} y={250} />
    <rect className="fur" x="40" y="316" width="150" height="18" rx="2" />
    <text className="zone" x="40" y="352">
      Breakfast
    </text>

    {/* lobby and front desk */}
    <rect className="fur" x="330" y="206" width="130" height="24" rx="4" />
    <circle className="fur" cx="395" cy="246" r="7" />
    <text className="zone" x="330" y="266">
      Front desk
    </text>
    <rect className="seat" x="250" y="300" width="60" height="18" rx="5" />
    <text className="zone" x="250" y="352">
      Lobby
    </text>

    {/* linen closet and laundry */}
    <Shelf x={580} y={204} w={140} h={18} />
    <text className="zone" x="622" y="252">
      Linen closet
    </text>
    <rect className="fur" x="688" y="284" width="36" height="34" rx="3" />
    <rect className="fur" x="688" y="322" width="36" height="34" rx="3" />
    <text className="zone" x="580" y="352">
      Laundry
    </text>
  </g>
);

export const hotel = defineIndustry({
  id: "hotel",
  label: "Hotel & Inn",
  business: "Harbor Inn",
  plan,
  spots: {
    rooms: [
      { x: 58, y: 72 },
      { x: 154, y: 72 },
      { x: 250, y: 72 },
      { x: 346, y: 72 },
      { x: 442, y: 72 },
      { x: 538, y: 72 },
    ],
    corridor: [
      { x: 200, y: 160 },
      { x: 460, y: 160 },
      { x: 668, y: 70 }, // stairs
    ],
    housekeeping: [
      { x: 650, y: 213 }, // linen shelf
      { x: 706, y: 301 }, // washer
      { x: 706, y: 339 }, // dryer
    ],
    desk: [
      { x: 395, y: 218 },
      { x: 395, y: 246 },
    ],
    lobby: [
      { x: 280, y: 309 },
      { x: 500, y: 300 },
      { x: 395, y: 350 },
    ],
    breakfast: [
      { x: 80, y: 250 },
      { x: 170, y: 250 },
      { x: 115, y: 325 },
    ],
  },
  people: [
    {
      id: "grace",
      name: "Grace",
      role: "General Manager",
      tag: "MANAGER",
      initials: "GR",
    },
    {
      id: "lupe",
      name: "Lupe",
      role: "Housekeeping",
      tag: "HOUSEKEEPING",
      initials: "LU",
    },
    {
      id: "hank",
      name: "Hank",
      role: "Maintenance",
      tag: "MAINTENANCE",
      initials: "HA",
    },
    {
      id: "drew",
      name: "Drew",
      role: "Payroll",
      tag: "PAYROLL",
      initials: "DR",
    },
  ],
  requests: [
    // Grace
    {
      text: "Can I swap Friday with Nico?",
      from: "Cal",
      to: "grace",
      zone: "lobby",
    },
    {
      text: "Wedding party wants the breakfast room until noon",
      from: "Nico",
      to: "grace",
      zone: "breakfast",
    },
    {
      text: "A guest left a laptop in 103",
      from: "Abby",
      to: "grace",
      zone: "rooms",
    },
    {
      text: "Kids are running up and down the corridor",
      from: "Nico",
      to: "grace",
      zone: "lobby",
    },
    {
      text: "The lobby coffee is out and the guy from 102 is not happy",
      from: "Cal",
      to: "grace",
      zone: "lobby",
    },
    // Lupe
    {
      text: "Room 104 needs extra towels",
      from: "Abby",
      to: "lupe",
      zone: "rooms",
    },
    {
      text: "Checkout in 103 left the room a mess",
      from: "Cal",
      to: "lupe",
      zone: "rooms",
    },
    {
      text: "Guest in 101 wants a late checkout, can we skip it?",
      from: "Cal",
      to: "lupe",
      zone: "desk",
    },
    {
      text: "We're down to the last cart of clean sheets",
      from: "Abby",
      to: "lupe",
      zone: "housekeeping",
    },
    {
      text: "Room 106 is asking for a crib",
      from: "Abby",
      to: "lupe",
      zone: "rooms",
    },
    // Hank
    {
      text: "Washer 1 is making a grinding noise",
      from: "Nico",
      to: "hank",
      zone: "housekeeping",
    },
    {
      text: "Stairwell light is out on the landing",
      from: "Abby",
      to: "hank",
      zone: "corridor",
    },
    {
      text: "Ice machine in the corridor is out",
      from: "Cal",
      to: "hank",
      zone: "corridor",
    },
    {
      text: "Waffle maker in the breakfast room tripped the breaker",
      from: "Nico",
      to: "hank",
      zone: "breakfast",
    },
    {
      text: "Dryer 2 isn't heating",
      from: "Cal",
      to: "hank",
      zone: "housekeeping",
    },
    // Drew
    {
      text: "My check is short the overnight shift",
      from: "Cal",
      to: "drew",
      zone: "desk",
    },
    {
      text: "Changed banks, where do I update direct deposit?",
      from: "Abby",
      to: "drew",
      zone: "housekeeping",
    },
    {
      text: "I clocked out late Sunday, can you fix it?",
      from: "Nico",
      to: "drew",
      zone: "lobby",
    },
    {
      text: "Can I get my W-2 emailed?",
      from: "Abby",
      to: "drew",
      zone: "desk",
    },
    {
      text: "Is holiday pay time and a half?",
      from: "Cal",
      to: "drew",
      zone: "desk",
    },
  ],
});
