/**
 * The stage every industry's floor plan is drawn on.
 *
 * Plans are drawn on a fixed 760×432 stage and scaled to fit the board, so
 * every coordinate in an industry pack is in stage pixels. Each zone lists
 * the exact spots a request can pop up from — a stool, a lift, a bed — so a
 * note lands on a real piece of furniture, not somewhere vaguely in a room.
 */

export const STAGE_W = 760;
/** the plan occupies the top 400; the band below it is breathing room */
export const STAGE_H = 432;

export type Spot = { x: number; y: number };
