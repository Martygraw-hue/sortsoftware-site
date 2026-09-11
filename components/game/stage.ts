/**
 * Street Cafe's floor plan — the geometry the game and the drawing share.
 *
 * The plan is drawn on a fixed 760×432 stage (FloorPlan.tsx draws it) and scaled
 * to fit the board, so every coordinate here is in stage pixels. Each zone
 * lists the exact spots a request can pop up from — a stool, a table, the
 * pass window — so a note lands on a real piece of furniture, not somewhere
 * vaguely inside a room.
 */

export const STAGE_W = 760;
/** the plan occupies the top 400; the band below it is where the HUD sits */
export const STAGE_H = 432;

export type Zone =
  | "kitchen"
  | "bar"
  | "office"
  | "tables"
  | "booths"
  | "restrooms"
  | "lounge"
  | "host";

export type Spot = { x: number; y: number };

export const SPOTS: Record<Zone, Spot[]> = {
  kitchen: [
    { x: 155, y: 150 }, // pass window
    { x: 102, y: 107 }, // prep table
    { x: 202, y: 116 }, // walk-in
    { x: 134, y: 47 }, // the line
  ],
  bar: [276, 324, 372, 420, 468, 516, 564].map((x) => ({ x, y: 104 })), // stools
  office: [
    { x: 648, y: 51 }, // desk
    { x: 648, y: 76 }, // chair
  ],
  tables: [
    { x: 300, y: 205 },
    { x: 390, y: 205 },
    { x: 480, y: 205 },
    { x: 300, y: 300 },
    { x: 390, y: 300 },
    { x: 480, y: 300 },
    { x: 549, y: 335 }, // 2-tops by the front wall
    { x: 605, y: 335 },
  ],
  booths: [
    { x: 672, y: 154 },
    { x: 672, y: 202 },
    { x: 672, y: 250 },
  ],
  restrooms: [
    { x: 664, y: 300 },
    { x: 712, y: 300 },
    { x: 663, y: 345 }, // sinks
    { x: 711, y: 345 },
  ],
  lounge: [
    { x: 45, y: 202 }, // sofa
    { x: 78, y: 202 }, // low table
    { x: 109, y: 181 }, // armchairs
    { x: 109, y: 225 },
  ],
  host: [
    { x: 170, y: 329 }, // host stand
    { x: 110, y: 350 }, // the front door
  ],
};
