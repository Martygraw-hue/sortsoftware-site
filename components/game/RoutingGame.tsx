"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import AdminPhone, { type Ticket } from "./AdminPhone";
import FloorPlan, { type Pin } from "./FloorPlan";
import { HOP_MS, PAWN_H, PAWN_HW, type PawnView } from "./Pawns";
import { STAGE_H, STAGE_W, type Spot } from "./stage";
import { INDUSTRIES, type Request } from "./industries";
import GameTitle, { GameProgress } from "./GameTitle";

/**
 * RoutingGame — Right Person Routing as a heads-up display.
 *
 * Street Cafe's floor plan is the board. A request pops up where it actually
 * happened — a stool at the bar, table 6, the host stand — glows there for a
 * beat, then flies into the Admin inbox on the phone, already assigned to
 * the one person who can act on it. Nobody drags anything; you watch a
 * Friday night sort itself out. The phone stays live: tap a ticket, resolve
 * it, the task count drops.
 *
 * The plan is drawn on a fixed 760×432 stage (stage.ts) and scaled to fit the board.
 * When the board is too narrow to hold the whole plan legibly (phones), the
 * stage keeps a minimum scale and the camera pans to wherever the current
 * request came from. Everything animates with transform/opacity only — no
 * motion library on this site.
 */

type Note = {
  id: number;
  req: Request;
  spot: Spot;
  state: "in" | "out";
  /** no pawn under it — draw the pin's own dot */
  bare?: boolean;
};

type Layout = { w: number; h: number };

/**
 * A pawn on the floor. Each zone of the plan has one; it wanders between that
 * zone's spots in slow hops (so it never crosses a wall), pauses, wanders on.
 * When a request is due from its zone the pawn is summoned to the spot, hops
 * there, and submits — the pin blooms from where it stands.
 */
type Pawn = PawnView & {
  zone: string;
  mode: "wander" | "summon" | "ready" | "submit";
  target: Spot | null;
  nextHopAt: number;
  idleUntil: number;
  pending: { req: Request; spot: Spot } | null;
  noteId: number | null;
  stuck: number;
  /** waypoints still to walk before the target (through a door) */
  route: Spot[];
  /** no free floor in its zone — kept off the board */
  hidden: boolean;
  summonedAt: number;
  lastMoveAt: number;
};

const HOP_PX = 14; // one hop's reach on the stage
const WANDER_R = 90; // how far around its zone's spots a pawn will wander
const STUCK_HOPS = 5; // blocked this many hops in a row → pick another target

/**
 * Collision with the plan, read off the SVG itself: furniture and walls are
 * tested with the geometry API (point-in-fill / point-in-stroke in stage
 * coordinates), zone labels with their boxes. A pawn is "blocked" at a point
 * when any corner of its footprint lands on one of them — so pawns walk
 * around tables and chairs instead of over them, and never cross a wall.
 */
type Box = { x: number; y: number; w: number; h: number };
type Blocker = {
  /** each shape with the matrix that takes a stage point into its own coordinates */
  shapes: { el: SVGGeometryElement; toLocal: DOMMatrix | null; wall: boolean }[];
  boxes: Box[];
  /** doorways (the .gap strokes) in stage coordinates — a wall doesn't block there */
  gaps: Box[];
};

/** a box in an element's own coordinates, mapped into stage coordinates */
function toStage(svg: SVGSVGElement, el: SVGGraphicsElement, b: Box): Box | null {
  const svgM = svg.getScreenCTM();
  const gm = el.getScreenCTM();
  if (!svgM || !gm) return null;
  const m = svgM.inverse().multiply(gm);
  const pts = [
    [b.x, b.y],
    [b.x + b.w, b.y],
    [b.x, b.y + b.h],
    [b.x + b.w, b.y + b.h],
  ].map(([x, y]) => {
    const p = svg.createSVGPoint();
    p.x = x;
    p.y = y;
    return p.matrixTransform(m);
  });
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const x0 = Math.min(...xs);
  const y0 = Math.min(...ys);
  return { x: x0, y: y0, w: Math.max(...xs) - x0, h: Math.max(...ys) - y0 };
}

/** an element's bounding box in stage coordinates */
function stageBox(svg: SVGSVGElement, el: SVGGraphicsElement): Box | null {
  const b = el.getBBox();
  return toStage(svg, el, { x: b.x, y: b.y, w: b.width, h: b.height });
}

/** each straight segment of a .gap path (M x y then H/V/L, absolute or
 *  relative) as its own box in stage coordinates — one path may draw several
 *  doorways */
function gapBoxes(svg: SVGSVGElement, el: SVGGeometryElement): Box[] {
  const d = el.getAttribute("d") ?? "";
  const out: Box[] = [];
  const re = /([MmHhVvLl])\s*([-\d.\s,]*)/g;
  let x = 0;
  let y = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(d))) {
    const nums = m[2].trim().split(/[\s,]+/).filter(Boolean).map(Number);
    const c = m[1];
    let nx = x;
    let ny = y;
    if (c === "M") [nx, ny] = [nums[0], nums[1]];
    else if (c === "m") [nx, ny] = [x + nums[0], y + nums[1]];
    else if (c === "H") nx = nums[0];
    else if (c === "h") nx = x + nums[0];
    else if (c === "V") ny = nums[0];
    else if (c === "v") ny = y + nums[0];
    else if (c === "L") [nx, ny] = [nums[0], nums[1]];
    else if (c === "l") [nx, ny] = [x + nums[0], y + nums[1]];
    if (c !== "M" && c !== "m") {
      const b = toStage(svg, el, {
        x: Math.min(x, nx),
        y: Math.min(y, ny),
        w: Math.abs(nx - x),
        h: Math.abs(ny - y),
      });
      if (b) out.push(b);
    }
    x = nx;
    y = ny;
  }
  if (!out.length) {
    const b = stageBox(svg, el);
    if (b) out.push(b);
  }
  return out;
}

function readBlockers(svg: SVGSVGElement): Blocker {
  // classes may sit on a <g>; collision needs the geometry underneath
  const GEO = "path, rect, circle, ellipse, line, polygon, polyline";
  const shapes: Blocker["shapes"] = [];
  const svgM = svg.getScreenCTM();
  for (const el of Array.from(
    svg.querySelectorAll<SVGElement>(".fur, .seat, .pict, .wall"),
  )) {
    const isWall = el.classList.contains("wall");
    const geo = el.matches(GEO)
      ? [el as unknown as SVGGeometryElement]
      : Array.from(el.querySelectorAll<SVGGeometryElement>(GEO));
    for (const g of geo) {
      const gm = g.getScreenCTM();
      const toLocal =
        svgM && gm ? gm.inverse().multiply(svgM) : null;
      shapes.push({ el: g, toLocal, wall: isWall });
    }
  }
  const boxes = Array.from(svg.querySelectorAll<SVGTextElement>("text")).map(
    (t) => {
      const b = t.getBBox();
      return { x: b.x - 2, y: b.y - 2, w: b.width + 4, h: b.height + 4 };
    },
  );
  // a doorway: the gap's line, padded across the wall's thickness
  const gaps: Box[] = [];
  for (const el of Array.from(svg.querySelectorAll<SVGGeometryElement>(".gap")))
    for (const b of gapBoxes(svg, el))
      gaps.push({ x: b.x - 4, y: b.y - 4, w: b.w + 8, h: b.h + 8 });
  return { shapes, boxes, gaps };
}

const inBox = (b: Box, x: number, y: number) =>
  x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;

function hits(bl: Blocker, svg: SVGSVGElement, x: number, y: number) {
  for (const b of bl.boxes)
    if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return true;
  const pt = svg.createSVGPoint();
  pt.x = x;
  pt.y = y;
  for (const { el, toLocal, wall } of bl.shapes) {
    try {
      const lp = toLocal ? pt.matrixTransform(toLocal) : pt;
      // walls are strokes only (and open at the doorways); furniture blocks
      // by fill and outline
      if (el.isPointInStroke(lp)) {
        if (!wall) return true;
        if (!bl.gaps.some((g) => inBox(g, x, y))) return true;
      }
      if (!wall && el.isPointInFill(lp)) return true;
    } catch {
      /* element gone mid-frame */
    }
  }
  return false;
}

/** the pawn's silhouette at (x, y) touches something — sampled every few px
 *  around the body's edges (the triangle, the head, the shadow) with padding */
const SILHOUETTE: [number, number][] = (() => {
  const pts: [number, number][] = [];
  const pad = 3;
  const hw = PAWN_HW + pad; // triangle half-width at the top
  const top = -16 - pad; // top edge of the triangle (feet at 0)
  // triangle edges
  for (let t = 0; t <= 1; t += 0.2) {
    pts.push([-hw + hw * 2 * t, top]); // top edge
    pts.push([-hw * (1 - t), top * (1 - t) + pad * t]); // left edge to the tip
    pts.push([hw * (1 - t), top * (1 - t) + pad * t]); // right edge
  }
  // head
  const r = 6.4 + pad;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    pts.push([Math.cos(a) * r, -24.4 + Math.sin(a) * r]);
  }
  // shadow ends and the middle
  pts.push([-10, 1], [10, 1], [0, 1], [0, -8], [0, -16]);
  return pts;
})();

function blocked(bl: Blocker, svg: SVGSVGElement, x: number, y: number) {
  return SILHOUETTE.some(([dx, dy]) => hits(bl, svg, x + dx, y + dy));
}

const PAWN_GAP = 30; // centre-to-centre distance two pawns keep
/** standing at (x, y) would overlap another pawn */
function crowded(pawns: PawnView[], self: number, x: number, y: number) {
  return pawns.some(
    (o) =>
      o.id !== self &&
      !(o as { hidden?: boolean }).hidden &&
      Math.hypot(o.x - x, o.y - y) < PAWN_GAP,
  );
}

/**
 * Rooms. The plan has no room polygons, so they're read off the walls: a
 * coarse grid over the stage marks every cell a wall runs through, then each
 * zone's room is the set of cells reachable from its spots without crossing
 * one. Doors are drawn as gaps *over* a continuous wall path, so the fill
 * stays inside the room — a pawn can never end up on the other side of a wall.
 */
const CELL = 6;
const GW = Math.ceil(STAGE_W / CELL);
const GH = Math.ceil(STAGE_H / CELL);
type Room = {
  /** cells inside the zone's own walls */
  own: Uint8Array;
  /** the same, with doors open — where a roaming pawn may go */
  roam: Uint8Array;
  /** true when the zone's room is small: its pawn roams next door too */
  small: boolean;
  /** the room's doorways: a point inside, the threshold, a point outside */
  doors: { in: Spot; at: Spot; out: Spot }[];
};
type Rooms = Map<string, Room>;
const ROAM_R = 220; // how far from its spots a roaming pawn goes
const SMALL_ROOM = 0.09; // share of the stage below which a room counts as small

function readRooms(
  svg: SVGSVGElement,
  bl: Blocker,
  spots: Record<string, Spot[]>,
): Rooms {
  const walls = bl.shapes.filter((s) => s.wall);
  const svgM = svg.getScreenCTM();
  // only doorways inside the building count — the front door leads nowhere
  const shell = svg.querySelector<SVGGraphicsElement>("rect.wall");
  const shellBox = shell ? stageBox(svg, shell) : null;
  const inside = (x: number, y: number) =>
    !shellBox || inBox({ x: shellBox.x + 4, y: shellBox.y + 4, w: shellBox.w - 8, h: shellBox.h - 8 }, x, y);
  const gapEls = Array.from(svg.querySelectorAll<SVGGeometryElement>(".gap"));
  const gaps = gapEls.map((el) => {
    const gm = el.getScreenCTM();
    return { el, toLocal: svgM && gm ? gm.inverse().multiply(svgM) : null };
  });
  // each doorway as three standing points: just inside, on the line, just outside
  const SIL_H = 34; // the silhouette's height above the feet (with padding)
  const SIDE = 26; // how far either side of the line the pawn stands
  const thresholds: { a: Spot; b: Spot; at: Spot }[] = [];
  for (const b of gapEls.flatMap((el) => gapBoxes(svg, el))) {
    if (b.w >= b.h) {
      // a gap in a horizontal wall: pass through at its middle
      const at = { x: b.x + b.w / 2, y: b.y + b.h / 2 };
      thresholds.push({ at, a: { x: at.x, y: at.y - SIDE }, b: { x: at.x, y: at.y + SIDE } });
    } else {
      // a gap in a vertical wall: stand where the whole pawn fits the opening
      const y = clamp(b.y + b.h - 6, b.y + SIL_H, b.y + b.h - 1);
      const at = { x: b.x + b.w / 2, y };
      thresholds.push({ at, a: { x: at.x - SIDE, y }, b: { x: at.x + SIDE, y } });
    }
  }
  const wallAt = new Uint8Array(GW * GH);
  const doorAt = new Uint8Array(GW * GH);
  const pt = svg.createSVGPoint();
  const strokeHit = (
    list: { el: SVGGeometryElement; toLocal: DOMMatrix | null }[],
    gx: number,
    gy: number,
  ) => {
    // 3×3 samples per cell so a 3px wall can't slip between them
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++) {
        pt.x = gx * CELL + (i * CELL) / 2;
        pt.y = gy * CELL + (j * CELL) / 2;
        for (const { el, toLocal } of list) {
          try {
            if (el.isPointInStroke(toLocal ? pt.matrixTransform(toLocal) : pt))
              return true;
          } catch {
            /* ignore */
          }
        }
      }
    return false;
  };
  for (let gy = 0; gy < GH; gy++)
    for (let gx = 0; gx < GW; gx++) {
      if (strokeHit(walls, gx, gy)) {
        wallAt[gy * GW + gx] = 1;
        if (strokeHit(gaps, gx, gy)) doorAt[gy * GW + gx] = 1;
      }
    }
  const fill = (seeds: number[], solid: Uint8Array) => {
    const room = new Uint8Array(GW * GH);
    const stack = seeds.slice();
    while (stack.length) {
      const i = stack.pop()!;
      if (room[i] || solid[i]) continue;
      room[i] = 1;
      const x = i % GW;
      const y = (i - x) / GW;
      if (x > 0) stack.push(i - 1);
      if (x < GW - 1) stack.push(i + 1);
      if (y > 0) stack.push(i - GW);
      if (y < GH - 1) stack.push(i + GW);
    }
    return room;
  };
  const wallsMinusDoors = wallAt.map((w, i) => (doorAt[i] ? 0 : w));
  const rooms: Rooms = new Map();
  for (const zone of Object.keys(spots)) {
    const stack: number[] = [];
    for (const sp of spots[zone]) {
      // a spot may sit on a wall line (a doorway); seed from the nearest open cell
      const cx = clamp(Math.round(sp.x / CELL), 0, GW - 1);
      const cy = clamp(Math.round(sp.y / CELL), 0, GH - 1);
      outer: for (let r = 0; r < 6; r++)
        for (let dy = -r; dy <= r; dy++)
          for (let dx = -r; dx <= r; dx++) {
            const x = cx + dx;
            const y = cy + dy;
            if (x < 0 || y < 0 || x >= GW || y >= GH) continue;
            if (!wallAt[y * GW + x]) {
              stack.push(y * GW + x);
              break outer;
            }
          }
    }
    const own = fill(stack, wallAt);
    let area = 0;
    for (const c of own) area += c;
    const small = area / (GW * GH) < SMALL_ROOM;
    const cellIn = (room: Uint8Array, p: Spot) => {
      const gx = clamp(Math.floor(p.x / CELL), 0, GW - 1);
      const gy = clamp(Math.floor(p.y / CELL), 0, GH - 1);
      return !!room[gy * GW + gx];
    };
    const doors: Room["doors"] = [];
    for (const t of thresholds) {
      if (!inside(t.a.x, t.a.y) || !inside(t.b.x, t.b.y)) continue;
      const aIn = cellIn(own, t.a);
      const bIn = cellIn(own, t.b);
      if (aIn === bIn) continue; // not this room's door
      doors.push(aIn ? { in: t.a, at: t.at, out: t.b } : { in: t.b, at: t.at, out: t.a });
    }
    rooms.set(zone, {
      own,
      roam: small ? fill(stack, wallsMinusDoors) : own,
      small,
      doors,
    });
  }
  return rooms;
}

/** the pawn's silhouette sits entirely inside its room */
function inRoom(room: Uint8Array | undefined, x: number, y: number) {
  if (!room) return true;
  for (const [dx, dy] of SILHOUETTE) {
    const gx = Math.floor((x + dx) / CELL);
    const gy = Math.floor((y + dy) / CELL);
    if (gx < 0 || gy < 0 || gx >= GW || gy >= GH) return false;
    if (!room[gy * GW + gx]) return false;
  }
  return true;
}

/** send a pawn to a target: through its room's door when the target is on
 *  the other side of the wall, straight there otherwise */
function sendTo(p: Pawn, rm: Room | undefined, c: Spot) {
  p.route = [];
  if (rm && rm.doors.length) {
    const cellOf = (s: Spot) => {
      const gx = clamp(Math.floor(s.x / CELL), 0, GW - 1);
      const gy = clamp(Math.floor(s.y / CELL), 0, GH - 1);
      return !!rm.own[gy * GW + gx];
    };
    const hereIn = cellOf({ x: p.x, y: p.y });
    const thereIn = cellOf(c);
    if (hereIn !== thereIn) {
      const d = rm.doors.reduce((best, dr) =>
        Math.hypot(dr.at.x - p.x, dr.at.y - p.y) < Math.hypot(best.at.x - p.x, best.at.y - p.y)
          ? dr
          : best,
      );
      p.route = hereIn ? [d.in, d.at, d.out, c] : [d.out, d.at, d.in, c];
      p.target = p.route.shift()!;
      return;
    }
  }
  p.target = c;
}

/** a straight hop from a to b keeps the footprint clear the whole way */
function clearHop(
  bl: Blocker,
  svg: SVGSVGElement,
  ax: number,
  ay: number,
  bx: number,
  by: number,
) {
  const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / 5));
  for (let i = 1; i <= n; i++) {
    const t = i / n;
    if (blocked(bl, svg, ax + (bx - ax) * t, ay + (by - ay) * t)) return false;
  }
  return true;
}

// The board's CSS min-height (311px = 0.72 × the stage) is what stops the
// plan shrinking further on phones; past that point the camera pans instead.
const BUBBLE_W = 176;
const TAIL_GAP = 14; // distance from the pin to the bubble's edge
const DWELL_MS = 3400; // how long a request sits on the floor
const FLY_MS = 620;
const FIRST_MS = 250;
const SPAWN_MS = 6000; // a request every six seconds

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";

let nextId = 1;

function shuffle<T>(a: T[]): T[] {
  const out = a.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Gameplay switch. false = the floor sits still (no requests spawn, nothing
 *  routes) so the layout can be judged on its own. Flip to true to run it. */
const GAMEPLAY = true;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

const timeNow = () =>
  new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

export default function RoutingGame() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [count, setCount] = useState(0);
  const [industryIx, setIndustryIx] = useState(0);
  const industry = INDUSTRIES[industryIx];
  const industryRef = useRef(industry);
  industryRef.current = industry;
  const [layout, setLayout] = useState<Layout>({ w: STAGE_W, h: STAGE_H });
  const [tx, setTx] = useState(0);
  const [phoneScale, setPhoneScale] = useState(1);

  const notesRef = useRef<Note[]>([]);
  notesRef.current = notes;
  const countRef = useRef(0);
  countRef.current = count;
  const layoutRef = useRef<Layout>(layout);
  layoutRef.current = layout;

  const bag = useRef<Request[]>([]);
  const bubbleEls = useRef(new Map<number, HTMLElement>());
  const boardRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const timers = useRef(new Set<number>());
  const lastSpawn = useRef(0);
  const reduced = useRef(false);
  const pawnsRef = useRef<Pawn[]>([]);
  const [pawns, setPawns] = useState<PawnView[]>([]);
  const blockers = useRef<Blocker | null>(null);
  const lastFrom = useRef<string | null>(null);
  const fromLastAt = useRef(new Map<string, number>());
  const zoneLastAt = useRef(new Map<string, number>());
  const rooms = useRef<Rooms | null>(null);

  const svgEl = () =>
    boardRef.current?.querySelector<SVGSVGElement>("svg.ss-plan") ?? null;

  /** nearest free standing point to (x, y) — the point itself, else a ring around it */
  const freeNear = useCallback((x: number, y: number, zone: string, from?: Spot): Spot | null => {
    const svg = svgEl();
    const bl = blockers.current;
    const room = rooms.current?.get(zone)?.roam;
    if (!svg || !bl) return { x, y };
    if (!blocked(bl, svg, x, y) && inRoom(room, x, y)) return { x, y };
    let best: Spot | null = null;
    let bestD = Infinity;
    for (const r of [26, 36, 48, 62, 80, 100, 124]) {
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const px = x + Math.cos(a) * r;
        const py = y + Math.sin(a) * r;
        if (px < 8 || py < PAWN_H + 4 || px > STAGE_W - 8 || py > STAGE_H - 4)
          continue;
        if (!inRoom(room, px, py) || blocked(bl, svg, px, py)) continue;
        if (crowded(pawnsRef.current, from ? (from as Pawn).id ?? -1 : -1, px, py)) continue;
        const d = from ? Math.hypot(px - from.x, py - from.y) : r;
        if (d < bestD) {
          bestD = d;
          best = { x: px, y: py };
        }
      }
      if (best) return best;
    }
    return null;
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.current.delete(id);
      fn();
    }, ms);
    timers.current.add(id);
    return id;
  }, []);

  /* ---------- environment ---------- */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setPhoneScale(mq.matches ? 1 : 0.82);
    apply();
    mq.addEventListener("change", apply);
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyRm = () => (reduced.current = rm.matches);
    applyRm();
    rm.addEventListener("change", applyRm);
    return () => {
      mq.removeEventListener("change", apply);
      rm.removeEventListener("change", applyRm);
    };
  }, []);

  // the board's real size decides the stage scale (and whether we pan)
  useLayoutEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setLayout({ w: r.width, h: r.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ---------- geometry ---------- */
  const k = layout.h / STAGE_H;
  const stageW = STAGE_W * k;
  const panning = stageW > layout.w + 1;

  /** camera offset that centres a stage point, clamped to the plan's edges */
  const panTo = useCallback((spot: Spot, lay: Layout) => {
    const kk = lay.h / STAGE_H;
    const sw = STAGE_W * kk;
    if (sw <= lay.w + 1) return 0;
    return clamp(lay.w / 2 - spot.x * kk, lay.w - sw, 0);
  }, []);

  useEffect(() => {
    // keep the camera honest if the board resizes mid-note
    const live = notesRef.current.filter((n) => n.state === "in");
    const last = live[live.length - 1];
    setTx(last ? panTo(last.spot, layout) : (t) => (panning ? t : 0));
  }, [layout, panning, panTo]);

  /* ---------- routing ---------- */
  const land = useCallback(
    (n: Note) => {
      const p = pawnsRef.current.find((x) => x.noteId === n.id);
      if (p) {
        p.mode = "wander";
        p.submitting = false;
        p.noteId = null;
        p.route = [];
        p.idleUntil = Date.now() + 900;
        p.nextHopAt = Date.now() + 900;
        setPawns(pawnsRef.current.filter((x) => !x.hidden).map((x) => ({ ...x })));
      }
      setNotes((ns) => ns.filter((x) => x.id !== n.id));
      setTickets((ts) => [
        {
          id: n.id,
          text: n.req.text,
          from: n.req.from,
          person: industryRef.current.people.find((p) => p.id === n.req.to)!,
          status: "assigned",
          time: timeNow(),
        },
        ...ts,
      ]);
      setCount((c) => c + 1);
    },
    [later],
  );

  /** Fly the bubble into the phone and turn it into a ticket. */
  const fly = useCallback(
    (id: number) => {
      const n = notesRef.current.find((x) => x.id === id && x.state === "in");
      if (!n) return;
      setNotes((ns) =>
        ns.map((x) => (x.id === id ? { ...x, state: "out" } : x)),
      );
      const el = bubbleEls.current.get(id);
      const ph = phoneRef.current?.getBoundingClientRect();
      if (!el || !ph || reduced.current) {
        land(n);
        return;
      }
      const r = el.getBoundingClientRect();
      const dx = ph.left + ph.width / 2 - (r.left + r.width / 2);
      const dy =
        ph.top + Math.min(ph.height * 0.34, 210) - (r.top + r.height / 2);
      el.style.transition = `transform ${FLY_MS}ms ${EASE}, opacity ${FLY_MS - 200}ms ease 120ms`;
      el.style.transform = `translate(${dx}px, ${dy}px) scale(0.28)`;
      el.style.opacity = "0";
      later(() => land(n), FLY_MS - 80);
    },
    [land, later],
  );

  /* ---------- spawning ---------- */
  /** the pawn has reached its spot: the request pops from where it stands */
  const submitFrom = useCallback(
    (pawn: Pawn) => {
      if (!pawn.pending) return;
      const { req, spot: at } = pawn.pending;
      // the bubble points at the pawn's head; the head itself is the pin —
      // a hidden pawn (a zone too tight to stand in) pops it from the spot
      const spot = pawn.hidden ? at : { x: at.x, y: at.y - 24.4 };
      const note: Note = { id: nextId++, req, spot, state: "in", bare: pawn.hidden };
      pawn.mode = "submit";
      pawn.submitting = true;
      pawn.noteId = note.id;
      pawn.pending = null;
      pawn.target = null;
      pawn.route = [];
      setNotes((ns) => [...ns, note]);
      setTx(panTo(spot, layoutRef.current));
      later(() => fly(note.id), DWELL_MS);
    },
    [panTo, fly, later],
  );

  /* ---------- the pawns ---------- */
  // one pawn per zone, standing on one of that zone's spots
  useEffect(() => {
    const svg = svgEl();
    blockers.current = svg ? readBlockers(svg) : null;
    rooms.current =
      svg && blockers.current
        ? readRooms(svg, blockers.current, industry.spots)
        : null;
    let id = 1;
    const zones = Object.keys(industry.spots);
    pawnsRef.current = zones.map((zone, i) => {
      const spots = industry.spots[zone];
      const s0 = spots[Math.floor(Math.random() * spots.length)];
      const s = freeNear(s0.x, s0.y, zone) ?? s0;
      return {
        id: id++,
        zone,
        hidden: !freeNear(s0.x, s0.y, zone),
        summonedAt: 0,
        lastMoveAt: Date.now(),
        x: s.x,
        y: s.y,
        hop: 0,
        side: 1,
        kind: "staff",
        submitting: false,
        still: reduced.current,
        mode: "wander",
        target: null,
        nextHopAt: Date.now() + 600 + Math.random() * 1500,
        idleUntil: 0,
        pending: null,
        noteId: null,
        stuck: 0,
        route: [],
      };
    });
    setPawns(pawnsRef.current.filter((p) => !p.hidden).map((p) => ({ ...p })));
  }, [industry, freeNear]);

  // the hop loop: every pawn decides on its own beat, so they never march
  useEffect(() => {
    if (!GAMEPLAY) return;
    const tick = () => {
      const now = Date.now();
      let changed = false;
      for (const p of pawnsRef.current) {
        if (p.hidden || p.mode === "submit" || p.mode === "ready" || now < p.nextHopAt)
          continue;
        const svg = svgEl();
        const bl = blockers.current;
        const rm = rooms.current?.get(p.zone);
        const room = rm?.roam;
        if (p.mode === "wander") {
          if (now < p.idleUntil) continue;
          if (!p.target) {
            // somewhere open near one of the zone's spots
            const spots = industry.spots[p.zone];
            // stood still too long (hemmed in): look anywhere in the room
            const anywhere = now - p.lastMoveAt > 5000;
            for (let tries = 0; tries < (anywhere ? 40 : 12) && !p.target; tries++) {
              const s = spots[Math.floor(Math.random() * spots.length)];
              const a = Math.random() * Math.PI * 2;
              // a small room's pawn mostly roams next door, but comes home too
              const far = anywhere || (rm?.small && Math.random() < 0.65);
              const r = 20 + Math.random() * (far ? ROAM_R : WANDER_R);
              const c = anywhere
                ? { x: 8 + Math.random() * (STAGE_W - 16), y: PAWN_H + 4 + Math.random() * (STAGE_H - PAWN_H - 8) }
                : { x: s.x + Math.cos(a) * r, y: s.y + Math.sin(a) * r };
              if (c.x < 8 || c.y < PAWN_H + 4 || c.x > STAGE_W - 8 || c.y > STAGE_H - 4)
                continue;
              // a big room keeps its pawn inside; a small one lets it roam next door
              if (!inRoom(rm?.small ? room : rm?.own, c.x, c.y)) continue;
              if (svg && bl && blocked(bl, svg, c.x, c.y)) continue;
              if (crowded(pawnsRef.current, p.id, c.x, c.y)) continue;
              sendTo(p, rm, c);
            }
            if (!p.target) {
              p.idleUntil = now + 800;
              continue;
            }
            p.stuck = 0;
          }
        }
        const t = p.target!;
        const dx = t.x - p.x;
        const dy = t.y - p.y;
        const d = Math.hypot(dx, dy);
        if (reduced.current) {
          p.x = t.x;
          p.y = t.y;
        } else {
          const step = Math.min(HOP_PX, d);
          const base = Math.atan2(dy, dx);
          // already standing on something (a resize, a fresh plan): walk
          // straight out rather than refusing every hop
          const escaping = !!(svg && bl && blocked(bl, svg, p.x, p.y));
          // straight if it's clear, else the gentlest turn that is
          let moved = false;
          for (const turn of [0, 0.6, -0.6, 1.2, -1.2, 1.9, -1.9, 2.6, -2.6]) {
            const nx = p.x + Math.cos(base + turn) * step;
            const ny = p.y + Math.sin(base + turn) * step;
            if (nx < 8 || ny < PAWN_H + 4 || nx > STAGE_W - 8 || ny > STAGE_H - 4)
              continue;
            if (!inRoom(room, nx, ny)) continue;
            if (crowded(pawnsRef.current, p.id, nx, ny)) continue;
            if (!escaping && svg && bl && !clearHop(bl, svg, p.x, p.y, nx, ny))
              continue;
            p.x = nx;
            p.y = ny;
            moved = true;
            break;
          }
          if (moved) {
            p.lastMoveAt = now;
            p.hop += 1;
            p.side = p.side === 1 ? -1 : 1;
            p.stuck = 0;
          } else {
            p.stuck += 1;
          }
        }
        p.nextHopAt = now + HOP_MS + 40 + Math.random() * 140;
        changed = true;
        const dNow = Math.hypot(t.x - p.x, t.y - p.y);
        if (p.route.length && dNow <= HOP_PX * 0.6) {
          // a waypoint (the doorway): straight on to the next one
          p.x = t.x;
          p.y = t.y;
          p.target = p.route.shift()!;
          p.stuck = 0;
        } else if (dNow <= 1.5 || (p.mode === "summon" && dNow <= HOP_PX * 0.6)) {
          p.x = t.x;
          p.y = t.y;
          if (p.mode === "summon") {
            p.mode = "ready"; // stand here until the beat
          } else {
            p.target = null;
            p.idleUntil = now + 900 + Math.random() * 1800;
            p.lastMoveAt = now; // a pause by choice isn't being stuck
          }
        } else if (p.stuck >= STUCK_HOPS) {
          // boxed in: wanderers pick somewhere else, a summoned pawn waits
          // where it stands rather than hopping in place forever
          p.stuck = 0;
          p.route = [];
          if (p.mode === "summon") {
            p.pending = { req: p.pending!.req, spot: { x: p.x, y: p.y } };
            p.mode = "ready";
          } else {
            p.target = null;
            p.idleUntil = now + 600;
          }
        }
      }
      if (changed) setPawns(pawnsRef.current.filter((p) => !p.hidden).map((p) => ({ ...p })));
    };
    const id = window.setInterval(tick, 130);
    return () => clearInterval(id);
  }, [industry, submitFrom]);

  /** pick the next sender and send its pawn to an open spot; returns the pawn */
  const summonNext = useCallback((): Pawn | undefined => {
    const lay = layoutRef.current;
    const kk = lay.h / STAGE_H;
    const live = notesRef.current;
    // then summon the next sender: a request whose pawn is free and whose
    // zone has a spot clear of any bubble still up
    const ind = industryRef.current;
    let req: Request | null = null;
    let spot: Spot | null = null;
    let pawn: Pawn | undefined;
    if (bag.current.length === 0) bag.current = shuffle(ind.requests);
    const onBoard = new Set(live.map((n) => n.req.text));
    // candidates in order: the person who sent least recently first, then
    // the zone that sent least recently; the last sender goes to the back
    const order = bag.current
      .map((r, ix) => ({ r, ix }))
      .filter(({ r }) => !onBoard.has(r.text))
      .sort((a, b) => {
        const la = a.r.from === lastFrom.current ? 1 : 0;
        const lb = b.r.from === lastFrom.current ? 1 : 0;
        if (la !== lb) return la - lb;
        const fa = fromLastAt.current.get(a.r.from) ?? 0;
        const fb = fromLastAt.current.get(b.r.from) ?? 0;
        if (fa !== fb) return fa - fb;
        return (zoneLastAt.current.get(a.r.zone) ?? 0) - (zoneLastAt.current.get(b.r.zone) ?? 0);
      });
    for (const { r, ix } of order) {
      const open = ind.spots[r.zone].filter((s) =>
        live.every(
          (n) =>
            Math.abs(n.spot.x - s.x) * kk > BUBBLE_W + 8 ||
            Math.abs(n.spot.y - s.y) * kk > 76,
        ),
      );
      const pw = pawnsRef.current.find(
        (p) => p.zone === r.zone && p.mode === "wander",
      );
      if (!open.length || !pw) continue;
      bag.current.splice(ix, 1);
      req = r;
      // the open spot nearest the pawn, so the walk is short and the
      // six-second beat holds
      spot = open.reduce((best, s) =>
        Math.hypot(s.x - pw.x, s.y - pw.y) < Math.hypot(best.x - pw.x, best.y - pw.y)
          ? s
          : best,
      );
      pawn = pw;
      break;
    }
    if (!req || !spot || !pawn) return undefined;
    lastFrom.current = req.from;
    fromLastAt.current.set(req.from, Date.now());
    zoneLastAt.current.set(req.zone, Date.now());
    lastSpawn.current = Date.now();
    const stand = pawn.hidden ? null : freeNear(spot.x, spot.y, pawn.zone, pawn);
    if (!stand) {
      // a zone too tight to stand in (a parts closet, a guest room): the
      // pawn stays off the floor and the request pops from the spot itself,
      // on the beat like everyone else's
      pawn.hidden = true;
      pawn.mode = "ready";
      pawn.pending = { req, spot };
      return pawn;
    }
    pawn.mode = "summon";
    pawn.summonedAt = Date.now();
    sendTo(pawn, rooms.current?.get(pawn.zone), stand);
    pawn.pending = { req, spot: stand };
    pawn.nextHopAt = 0;
    pawn.stuck = 0;
    if (reduced.current) {
      pawn.x = stand.x;
      pawn.y = stand.y;
      pawn.route = [];
      submitFrom(pawn);
    }
    return pawn;
  }, [submitFrom, freeNear, panTo, fly, later]);

  /** the beat: whoever was summoned submits from wherever they stand, then
   *  the next sender is called */
  const spawn = useCallback(() => {
    for (const p of pawnsRef.current) {
      if (p.mode === "ready" || p.mode === "summon") {
        if (p.mode === "summon")
          p.pending = { req: p.pending!.req, spot: { x: p.x, y: p.y } };
        submitFrom(p);
      }
    }
    summonNext();
  }, [submitFrom, summonNext]);

  /** the opening move: a request pops the moment the board is up (no walk),
   *  and the next sender is already on the way for the first beat */
  const opening = useCallback(() => {
    const p = summonNext();
    if (p && (p.mode === "summon" || p.mode === "ready")) {
      if (p.mode === "summon")
        p.pending = { req: p.pending!.req, spot: { x: p.x, y: p.y } };
      submitFrom(p);
    }
    summonNext();
  }, [summonNext, submitFrom]);

  useEffect(() => {
    if (!GAMEPLAY) return;
    // one request every SPAWN_MS, on the clock — the first one right away,
    // and the clock restarts whenever the floor changes
    const first = window.setTimeout(opening, FIRST_MS);
    const id = window.setInterval(spawn, SPAWN_MS);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [spawn, opening, industry]);

  useEffect(() => {
    const t = timers.current;
    return () => {
      for (const id of t) clearTimeout(id);
      t.clear();
    };
  }, []);

  const reset = () => {
    for (const id of timers.current) clearTimeout(id);
    timers.current.clear();
    setNotes([]);
    setTickets([]);
    setCount(0);
    bag.current = [];
    lastSpawn.current = Date.now() - 3400 + 400;
    lastFrom.current = null;
    fromLastAt.current = new Map();
    zoneLastAt.current = new Map();
    for (const p of pawnsRef.current) {
      p.mode = "wander";
      p.submitting = false;
      p.noteId = null;
      p.pending = null;
      p.target = null;
    }
    setPawns(pawnsRef.current.filter((p) => !p.hidden).map((p) => ({ ...p })));
  };

  /** switch the floor: clear the run, then swap the plan, people and requests */
  const pickIndustry = (ix: number) => {
    reset();
    bag.current = [];
    setIndustryIx(ix);
  };

  const resolve = (id: number) => {
    setTickets((ts) =>
      ts.map((t) => (t.id === id ? { ...t, status: "resolved" } : t)),
    );
  };

  /* ---------- bubble placement (board pixels, inside the camera) ---------- */
  const place = (
    spot: Spot,
  ): {
    left: number;
    top?: number;
    bottom?: number;
    tailClass: string;
    tail: number;
  } => {
    const vx = spot.x * k;
    const vy = spot.y * k;
    const minL = -tx + 6;
    const maxL = -tx + layout.w - BUBBLE_W - 6;
    const left = clamp(vx - 29, minL, Math.max(minL, maxL));
    const tail = clamp(vx - left, 21, BUBBLE_W - 21); // tail centre, in bubble px
    // the bubble goes above the head unless there's no room up there; near
    // the bottom edge it goes above regardless, so it never leaves the board
    const above = vy > 118 || vy + 132 > layout.h;
    return {
      left,
      ...(above
        ? { bottom: layout.h - (vy - TAIL_GAP) }
        : { top: vy + TAIL_GAP }),
      tailClass: above ? "tail-b" : "tail-t",
      tail,
    };
  };

  const pins: Pin[] = notes.map((n) => ({
    id: n.id,
    x: n.spot.x,
    y: n.spot.y,
    out: n.state === "out",
    dot: !!n.bare,
    // the glow sits under the pawn's feet, not its head
    gy: n.bare ? n.spot.y : n.spot.y + 24.4,
  }));

  /* ---------- render ---------- */
  return (
    <>
      <GameTitle
        label={industry.label}
        prevLabel={
          INDUSTRIES[(industryIx + INDUSTRIES.length - 1) % INDUSTRIES.length]
            .label
        }
        nextLabel={INDUSTRIES[(industryIx + 1) % INDUSTRIES.length].label}
        onPrev={() =>
          pickIndustry((industryIx + INDUSTRIES.length - 1) % INDUSTRIES.length)
        }
        onNext={() => pickIndustry((industryIx + 1) % INDUSTRIES.length)}
      />
      <div className="grid items-start gap-10 lg:grid-cols-[1fr_auto] lg:gap-20">
        <div className="@container min-w-0">
          {/* the floor: one surface, the plan scaled to fit, the camera on top.
            Height follows the width (the stage's ratio) down to a floor of
            311px — set with container units rather than aspect-ratio, which
            would transfer that floor into a min-width and overflow phones. */}
          <div
            ref={boardRef}
            className="relative h-[max(311px,calc(100cqw*432/760))] overflow-hidden rounded-[28px] border border-line bg-surface shadow-frame"
          >
            <div
              className="ss-cam absolute inset-0"
              style={{ transform: `translateX(${tx}px)` }}
            >
              <div
                className="absolute left-0 top-0 origin-top-left"
                style={{
                  width: STAGE_W,
                  height: STAGE_H,
                  transform: `scale(${k})`,
                }}
              >
                <FloorPlan pins={pins} plan={industry.plan} pawns={pawns} />
              </div>

              {notes.map((n) => {
                const p = place(n.spot);
                return (
                  <div
                    key={n.id}
                    ref={(el) => {
                      if (el) bubbleEls.current.set(n.id, el);
                      else bubbleEls.current.delete(n.id);
                    }}
                    className={`ss-bubble ss-pop ${p.tailClass}`}
                    style={{
                      left: p.left,
                      top: p.top,
                      bottom: p.bottom,
                      width: BUBBLE_W,
                      ["--tail" as string]: `${p.tail}px`,
                    }}
                  >
                    <span className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.1em] text-ink-muted">
                      <span
                        aria-hidden
                        className="inline-block h-1.5 w-1.5 rounded-full bg-sort-orange"
                      />
                      {n.req.from}
                    </span>
                    <span className="mt-0.5 block text-[13.5px] font-semibold leading-[1.25] text-ink">
                      {n.req.text}
                    </span>
                  </div>
                );
              })}
            </div>

            <span className="sr-only">
              Requests from around {industry.business} pop up on the floor plan
              and are routed to the one person who can act on them. The inbox on
              the phone shows each one as it lands.
            </span>
          </div>

          {/* the scoreboard: routed progress, in its own card under the floor */}
          <GameProgress
            routed={count}
            resolved={tickets.filter((t) => t.status === "resolved").length}
            total={industry.requests.length}
            onReset={reset}
          />
        </div>

        {/* the phone */}
        <div ref={phoneRef} className="mx-auto">
          <AdminPhone
            tickets={tickets}
            business={industry.business}
            onResolve={resolve}
            scale={phoneScale}
          />
        </div>
      </div>
    </>
  );
}
