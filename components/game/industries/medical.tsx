import { Chairs, ExamTable, Restroom } from "../PlanParts";
import { defineIndustry } from "./types";

/** Lakeside Family Dental — a five-operatory practice. */

function Op({ x, n }: { x: number; n: number }) {
  /* one operatory in the row: chair, side cabinet, the assistant's stool,
     a door onto the hall. Walls between ops are single lines in the plan */
  return (
    <g>
      <ExamTable x={x + 52} y={92} />
      <rect className="fur" x={x + 90} y={60} width="22" height="56" rx="2" />
      <circle className="fur" cx={x + 22} cy={124} r="6" />
      <path className="gap" d={`M${x + 48} 150h32`} />
      <text className="zone" x={x + 10} y={44}>{`Op ${n}`}</text>
    </g>
  );
}

const plan = (
  <g>
    {/* walls: a row of four operatories across the back sharing walls, all
        opening onto a hall; sterilization at the end of the hall with its
        door on the hall; in front, one reception room — the front desk at
        the door with the waiting chairs beside it — and a restroom.
        Openings, no swings */}
    <rect className="wall" x="24" y="22" width="712" height="340" rx="2" />
    {/* the op row */}
    <path className="wall" d="M24 150H540" />
    <path className="wall" d="M153 22V150M282 22V150M411 22V150" />
    <Op x={24} n={1} />
    <Op x={153} n={2} />
    <Op x={282} n={3} />
    <Op x={411} n={4} />
    {/* sterilization, door on the hall */}
    <path className="wall" d="M540 22V220" />
    <path className="gap" d="M540 170V210" />
    <rect className="fur" x="560" y="40" width="160" height="20" rx="2" />
    <rect className="fur" x="560" y="72" width="44" height="32" rx="3" />
    <rect className="fur" x="616" y="72" width="44" height="32" rx="3" />
    <rect className="fur" x="672" y="72" width="48" height="32" rx="3" />
    <text className="zone" x="560" y="200">
      Sterilization
    </text>

    {/* the front: reception with the waiting chairs, the restroom */}
    <path className="wall" d="M24 220H736" />
    <path className="gap" d="M440 220H480" />
    <path className="wall" d="M620 220V362" />
    <path className="gap" d="M620 300V340" />
    <path className="gap" d="M140 362H180" />
    {/* waiting chairs along the wall */}
    <Chairs x={64} y={234} n={8} gap={22} />
    <Chairs x={40} y={262} n={1} />
    <Chairs x={40} y={284} n={1} />
    <Chairs x={40} y={306} n={1} />
    <text className="zone" x="44" y="352">
      Waiting
    </text>
    {/* front desk facing the door */}
    <rect className="fur" x="360" y="300" width="150" height="24" rx="3" />
    <circle className="fur" cx="400" cy="286" r="7" />
    <circle className="fur" cx="470" cy="286" r="7" />
    <text className="zone" x="360" y="352">
      Front desk
    </text>

    {/* restroom */}
    <Restroom x={678} y={290} />
    <text className="zone" x="632" y="352">
      Restroom
    </text>
  </g>
);

export const medical = defineIndustry({
  id: "medical",
  label: "Medical & Dental",
  business: "Lakeside Dental",
  plan,
  spots: {
    ops: [
      { x: 76, y: 92 },
      { x: 205, y: 92 },
      { x: 334, y: 92 },
      { x: 463, y: 92 },
    ],
    hall: [
      { x: 160, y: 190 },
      { x: 420, y: 190 },
    ],
    sterilization: [
      { x: 582, y: 88 },
      { x: 638, y: 88 },
      { x: 640, y: 50 },
    ],
    waiting: [
      { x: 92, y: 241 },
      { x: 202, y: 241 },
      { x: 47, y: 291 },
    ],
    restroom: [{ x: 678, y: 290 }],
    desk: [
      { x: 435, y: 312 },
      { x: 160, y: 350 }, // the front door
    ],
  },
  people: [
    {
      id: "elise",
      name: "Elise",
      role: "Office Manager",
      tag: "MANAGER",
      initials: "EL",
    },
    {
      id: "drjones",
      name: "Dr. Jones",
      role: "Dentist",
      tag: "CLINICAL",
      initials: "DJ",
    },
    {
      id: "cory",
      name: "Cory",
      role: "Maintenance",
      tag: "MAINTENANCE",
      initials: "CO",
    },
    {
      id: "chris",
      name: "Chris",
      role: "Billing",
      tag: "BILLING",
      initials: "CH",
    },
  ],
  requests: [
    // Elise
    {
      text: "Waiting room is packed, we're running 40 minutes behind",
      from: "Dev",
      to: "elise",
      zone: "waiting",
    },
    {
      text: "Glove order didn't come, we're on the last box",
      from: "Ren",
      to: "elise",
      zone: "sterilization",
    },
    {
      text: "Can I swap Wednesday with Ren?",
      from: "Jo",
      to: "elise",
      zone: "hall",
    },
    {
      text: "A patient is wandering the hall looking for the restroom",
      from: "Ren",
      to: "elise",
      zone: "hall",
    },
    {
      text: "A kid is drawing on the waiting room wall",
      from: "Dev",
      to: "elise",
      zone: "waiting",
    },
    // Dr. Jones
    {
      text: "Op 3 patient's numbness hasn't kicked in yet",
      from: "Jo",
      to: "drjones",
      zone: "ops",
    },
    {
      text: "Patient in op 1 is asking about the crown price before we start",
      from: "Dev",
      to: "drjones",
      zone: "ops",
    },
    {
      text: "A walk-in with a broken tooth just came in, can you squeeze him in?",
      from: "Jo",
      to: "drjones",
      zone: "desk",
    },
    {
      text: "X-ray on the 10:30 shows something, can you take a look?",
      from: "Dev",
      to: "drjones",
      zone: "ops",
    },
    {
      text: "Lab called, the bridge for 2pm won't be ready",
      from: "Ren",
      to: "drjones",
      zone: "sterilization",
    },
    // Cory
    {
      text: "Autoclave is throwing an error again",
      from: "Ren",
      to: "cory",
      zone: "sterilization",
    },
    {
      text: "Restroom faucet won't shut off",
      from: "Ren",
      to: "cory",
      zone: "restroom",
    },
    {
      text: "Waiting room TV is stuck on the menu",
      from: "Jo",
      to: "cory",
      zone: "waiting",
    },
    { text: "Op 2 chair won't recline", from: "Jo", to: "cory", zone: "ops" },
    {
      text: "Front door closer slams on patients",
      from: "Dev",
      to: "cory",
      zone: "desk",
    },
    // Chris
    {
      text: "Insurance denied the 9am's claim, she's at the desk",
      from: "Dev",
      to: "chris",
      zone: "desk",
    },
    {
      text: "My check is short 5 hours",
      from: "Jo",
      to: "chris",
      zone: "hall",
    },
    {
      text: "Can I get my W-2 emailed?",
      from: "Ren",
      to: "chris",
      zone: "desk",
    },
    {
      text: "Patient wants a payment plan for the implant",
      from: "Dev",
      to: "chris",
      zone: "waiting",
    },
    {
      text: "Changed banks, where do I update direct deposit?",
      from: "Jo",
      to: "chris",
      zone: "desk",
    },
  ],
});
