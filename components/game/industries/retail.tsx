import { Restroom, Shelf } from "../PlanParts";
import { defineIndustry } from "./types";

/** Maple & Main — a neighborhood general store. */

const plan = (
  <g>
    {/* walls: stockroom with a receiving door across the back, fitting rooms
        on the right, three aisles in the middle, checkout at the front left.
        Openings in every wall, no swings */}
    <rect className="wall" x="24" y="22" width="712" height="340" rx="2" />
    <path className="wall" d="M24 110H736" />
    <path className="gap" d="M380 110H420" />
    <path className="wall" d="M600 110V362M600 270H736" />
    <path className="wall" d="M600 154H736M600 196H736" />
    <path
      className="gap"
      d="M600 122V144M600 164V186M600 206V228M600 300V340"
    />
    {/* front door and the receiving door */}
    <path className="gap" d="M310 362H350" />
    <path className="gap" d="M736 46V86" />

    {/* stockroom */}
    <Shelf x={40} y={36} w={360} h={20} />
    <Shelf x={40} y={74} w={240} h={20} />
    <rect className="seat" x="460" y="36" width="60" height="26" rx="2" />
    <rect className="seat" x="540" y="36" width="60" height="26" rx="2" />
    <text className="zone" x="300" y="92">
      Stockroom
    </text>
    <text className="zone" x="630" y="96">
      Receiving
    </text>

    {/* sales floor: three double-sided aisles */}
    <Shelf x={210} y={140} w={22} h={130} />
    <Shelf x={232} y={140} w={22} h={130} />
    <Shelf x={340} y={140} w={22} h={130} />
    <Shelf x={362} y={140} w={22} h={130} />
    <Shelf x={470} y={140} w={22} h={130} />
    <Shelf x={492} y={140} w={22} h={130} />
    <text className="zone" x="210" y="130">
      Aisles
    </text>

    {/* checkout, front left: the counter with two registers, clerks behind */}
    <rect className="fur" x="40" y="292" width="130" height="24" rx="2" />
    <rect className="seat" x="58" y="298" width="18" height="12" rx="2" />
    <rect className="seat" x="118" y="298" width="18" height="12" rx="2" />
    <text className="zone" x="40" y="352">
      Checkout
    </text>

    {/* fitting rooms */}
    <rect className="seat" x="694" y="118" width="24" height="26" rx="2" />
    <rect className="seat" x="694" y="160" width="24" height="26" rx="2" />
    <rect className="seat" x="694" y="202" width="24" height="26" rx="2" />
    <text className="zone" x="604" y="258">
      Fitting rooms
    </text>

    {/* restroom */}
    <Restroom x={706} y={290} />
    <text className="zone" x="604" y="352">
      Restroom
    </text>
  </g>
);

export const retail = defineIndustry({
  id: "retail",
  label: "Retail Store",
  business: "Maple & Main",
  plan,
  spots: {
    aisles: [
      { x: 221, y: 180 },
      { x: 243, y: 250 },
      { x: 351, y: 200 },
      { x: 373, y: 260 },
      { x: 481, y: 170 },
      { x: 503, y: 240 },
    ],
    checkout: [
      { x: 67, y: 304 },
      { x: 127, y: 304 },
    ],
    stockroom: [
      { x: 220, y: 46 },
      { x: 160, y: 84 },
      { x: 490, y: 49 },
      { x: 718, y: 66 },
    ],
    fitting: [
      { x: 668, y: 131 },
      { x: 668, y: 173 },
      { x: 668, y: 215 },
      { x: 668, y: 306 }, // restroom
    ],
    entrance: [
      { x: 330, y: 350 },
      { x: 260, y: 340 },
    ],
  },
  people: [
    {
      id: "ana",
      name: "Ana",
      role: "Store Manager",
      tag: "MANAGER",
      initials: "AN",
    },
    {
      id: "theo",
      name: "Theo",
      role: "Stockroom",
      tag: "STOCK",
      initials: "TH",
    },
    {
      id: "sofia",
      name: "Sofia",
      role: "Maintenance",
      tag: "MAINTENANCE",
      initials: "SO",
    },
    {
      id: "omar",
      name: "Omar",
      role: "Payroll",
      tag: "PAYROLL",
      initials: "OM",
    },
  ],
  requests: [
    // Ana
    {
      text: "Fitting room 1 has clothes all over the floor",
      from: "Kim",
      to: "ana",
      zone: "fitting",
    },
    {
      text: "Customer wants a refund without a receipt",
      from: "Raj",
      to: "ana",
      zone: "checkout",
    },
    {
      text: "Someone left a stroller by the door, no one's claimed it",
      from: "Lena",
      to: "ana",
      zone: "entrance",
    },
    {
      text: "A kid knocked over the whole endcap",
      from: "Raj",
      to: "ana",
      zone: "aisles",
    },
    {
      text: "Price tag says $12, sign says $9, which is it?",
      from: "Kim",
      to: "ana",
      zone: "aisles",
    },
    // Theo
    {
      text: "We're out of the 12-pack paper towels on the floor",
      from: "Kim",
      to: "theo",
      zone: "aisles",
    },
    {
      text: "Customer's asking if we have the blue kettle in the back",
      from: "Raj",
      to: "theo",
      zone: "aisles",
    },
    {
      text: "Aisle 3 endcap needs restocking before the weekend",
      from: "Kim",
      to: "theo",
      zone: "aisles",
    },
    {
      text: "Can you bring up more gift bags?",
      from: "Raj",
      to: "theo",
      zone: "checkout",
    },
    {
      text: "Delivery's at the dock, 14 pallets",
      from: "Lena",
      to: "theo",
      zone: "stockroom",
    },
    // Sofia
    {
      text: "Dock door is stuck halfway",
      from: "Lena",
      to: "sofia",
      zone: "stockroom",
    },
    {
      text: "Front door sensor isn't opening for customers",
      from: "Kim",
      to: "sofia",
      zone: "entrance",
    },
    {
      text: "Fitting room 2 door won't latch",
      from: "Kim",
      to: "sofia",
      zone: "fitting",
    },
    {
      text: "Restroom sink is backing up",
      from: "Raj",
      to: "sofia",
      zone: "fitting",
    },
    {
      text: "Register 1 receipt printer is jammed again",
      from: "Raj",
      to: "sofia",
      zone: "checkout",
    },
    // Omar
    {
      text: "Can I get my W-2 emailed?",
      from: "Raj",
      to: "omar",
      zone: "checkout",
    },
    {
      text: "My check is short 4 hours",
      from: "Kim",
      to: "omar",
      zone: "stockroom",
    },
    {
      text: "I clocked out late Tuesday, can you fix it?",
      from: "Lena",
      to: "omar",
      zone: "stockroom",
    },
    {
      text: "Changed banks, where do I update direct deposit?",
      from: "Kim",
      to: "omar",
      zone: "stockroom",
    },
    {
      text: "Is holiday pay time and a half?",
      from: "Raj",
      to: "omar",
      zone: "checkout",
    },
  ],
});
