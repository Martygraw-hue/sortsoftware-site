import { Car, Chairs, Shelf } from "../PlanParts";
import { defineIndustry } from "./types";

/** Ridge Auto — a four-bay independent repair shop. */

function Lift({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect
        className="fur"
        x={x - 44}
        y={y - 30}
        width="10"
        height="60"
        rx="2"
      />
      <rect
        className="fur"
        x={x + 34}
        y={y - 30}
        width="10"
        height="60"
        rx="2"
      />
      <Car x={x} y={y} />
    </g>
  );
}

const plan = (
  <g>
    {/* walls: four bays along the back wall with roll-up doors, a parts room
        beside them, and the front office — service counter and waiting room
        with a window onto the shop — off the shop floor. Openings, no swings */}
    <rect className="wall" x="24" y="22" width="712" height="340" rx="2" />
    <path className="wall" d="M560 22V362" />
    <path className="gap" d="M560 262V302" />
    <path className="wall" d="M24 250H220M220 250V362" />
    <path className="gap" d="M110 250H150" />
    {/* roll-up bay doors */}
    <path className="gap" d="M50 22H150M180 22H280M310 22H410M440 22H540" />
    <path
      className="swing"
      d="M50 22v12h100V22M180 22v12h100V22M310 22v12h100V22M440 22v12h100V22"
    />
    {/* the window between the waiting room and the shop */}
    <path className="swing" d="M560 150V240" />
    {/* customer door */}
    <path className="gap" d="M628 362H668" />

    {/* bays */}
    <Lift x={100} y={130} />
    <Lift x={230} y={130} />
    <Lift x={360} y={130} />
    <Lift x={490} y={130} />
    <text className="zone" x="36" y="236">
      Bays
    </text>

    {/* parts room */}
    <Shelf x={36} y={270} w={170} h={20} />
    <Shelf x={36} y={312} w={170} h={20} />
    <text className="zone" x="36" y="352">
      Parts
    </text>
    {/* tire rack on the open shop floor */}
    <rect className="seat" x="260" y="270" width="120" height="22" rx="2" />
    <circle className="fur" cx="278" cy="281" r="7" />
    <circle className="fur" cx="302" cy="281" r="7" />
    <circle className="fur" cx="326" cy="281" r="7" />
    <circle className="fur" cx="350" cy="281" r="7" />

    {/* service counter */}
    <rect className="fur" x="580" y="70" width="140" height="22" rx="3" />
    <circle className="fur" cx="650" cy="54" r="7" />
    <text className="zone" x="580" y="122">
      Counter
    </text>

    {/* waiting room */}
    {/* chairs along the two side walls, facing each other */}
    <Chairs x={706} y={158} n={1} />
    <Chairs x={706} y={180} n={1} />
    <Chairs x={706} y={202} n={1} />
    <Chairs x={706} y={224} n={1} />
    <Chairs x={706} y={246} n={1} />
    <Chairs x={578} y={158} n={1} />
    <Chairs x={578} y={180} n={1} />
    <Chairs x={578} y={202} n={1} />
    <Chairs x={578} y={224} n={1} />
    <Chairs x={578} y={246} n={1} />
    <text className="zone" x="580" y="290">
      Waiting
    </text>
  </g>
);

export const auto = defineIndustry({
  id: "auto",
  label: "Auto Repair",
  business: "Ridge Auto",
  plan,
  spots: {
    bays: [
      { x: 100, y: 130 },
      { x: 230, y: 130 },
      { x: 360, y: 130 },
      { x: 490, y: 130 },
      { x: 314, y: 281 }, // tire rack
    ],
    parts: [
      { x: 121, y: 280 },
      { x: 121, y: 322 },
    ],
    counter: [
      { x: 650, y: 81 },
      { x: 650, y: 54 },
    ],
    waiting: [
      { x: 585, y: 187 },
      { x: 713, y: 209 },
      { x: 585, y: 253 },
    ],
    lot: [
      { x: 100, y: 30 },
      { x: 360, y: 30 },
      { x: 648, y: 350 },
    ],
  },
  people: [
    {
      id: "rosa",
      name: "Rosa",
      role: "Service Manager",
      tag: "MANAGER",
      initials: "RO",
    },
    {
      id: "mike",
      name: "Mike",
      role: "Lead Tech",
      tag: "TECH",
      initials: "MI",
    },
    { id: "kev", name: "Kev", role: "Parts", tag: "PARTS", initials: "KE" },
    { id: "june", name: "June", role: "Office", tag: "OFFICE", initials: "JU" },
  ],
  requests: [
    // Rosa
    {
      text: "Customer in the lobby says we scratched her door",
      from: "Tasha",
      to: "rosa",
      zone: "waiting",
    },
    {
      text: "Tow truck just dropped a car with no keys",
      from: "Dre",
      to: "rosa",
      zone: "lot",
    },
    {
      text: "Bay 4 door is stuck half open",
      from: "Dre",
      to: "rosa",
      zone: "lot",
    },
    {
      text: "Guy in the waiting room has been here 3 hours",
      from: "Tasha",
      to: "rosa",
      zone: "waiting",
    },
    {
      text: "The lot is full, where do I put the Suburban?",
      from: "Dre",
      to: "rosa",
      zone: "lot",
    },
    // Mike
    {
      text: "Bay 2 lift won't go past halfway",
      from: "Dre",
      to: "mike",
      zone: "bays",
    },
    {
      text: "The Civic's check engine light came back on",
      from: "Sal",
      to: "mike",
      zone: "bays",
    },
    {
      text: "Can you look at the brake job in bay 3 before I button it up?",
      from: "Dre",
      to: "mike",
      zone: "bays",
    },
    {
      text: "Tire machine needs recalibrating",
      from: "Sal",
      to: "mike",
      zone: "bays",
    },
    {
      text: "Air compressor keeps tripping the breaker",
      from: "Dre",
      to: "mike",
      zone: "bays",
    },
    // Kev
    {
      text: "We're down to two jugs of 5W-30",
      from: "Dre",
      to: "kev",
      zone: "parts",
    },
    {
      text: "Wrong alternator came in, box says Ford",
      from: "Sal",
      to: "kev",
      zone: "parts",
    },
    {
      text: "Did the tire order ship? Customer's waiting",
      from: "Tasha",
      to: "kev",
      zone: "waiting",
    },
    {
      text: "Core return for the starter is still on the shelf",
      from: "Sal",
      to: "kev",
      zone: "parts",
    },
    {
      text: "Need front pads for a 2019 Tacoma",
      from: "Sal",
      to: "kev",
      zone: "bays",
    },
    // June
    {
      text: "Customer's card got declined twice",
      from: "Tasha",
      to: "june",
      zone: "counter",
    },
    {
      text: "Can I get my W-2 emailed?",
      from: "Sal",
      to: "june",
      zone: "counter",
    },
    {
      text: "Insurance wants the invoice for the F-150",
      from: "Tasha",
      to: "june",
      zone: "counter",
    },
    {
      text: "Changed banks, where do I update direct deposit?",
      from: "Dre",
      to: "june",
      zone: "counter",
    },
    {
      text: "My check is short Saturday's hours",
      from: "Dre",
      to: "june",
      zone: "bays",
    },
  ],
});
