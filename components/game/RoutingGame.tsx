"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import AdminPhone, { type Ticket } from "./AdminPhone";
import FloorPlan, { type Pin } from "./FloorPlan";
import { SPOTS, STAGE_H, STAGE_W, type Spot } from "./stage";
import { PEOPLE, REQUESTS, type PersonId, type Request } from "./requests";

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
};

type Layout = { w: number; h: number };

// The board's CSS min-height (311px = 0.72 × the stage) is what stops the
// plan shrinking further on phones; past that point the camera pans instead.
const BUBBLE_W = 176;
const TAIL_GAP = 14; // distance from the pin to the bubble's edge
const DWELL_MS = 2600; // how long a request sits on the floor
const FLY_MS = 620;
const FIRST_MS = 700;

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

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const timeNow = () =>
  new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

const clockNow = () =>
  `${new Date().toLocaleDateString([], { weekday: "long" })} ${timeNow()}`;

export default function RoutingGame() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [count, setCount] = useState(0);
  const [hit, setHit] = useState<Partial<Record<PersonId, boolean>>>({});
  const [layout, setLayout] = useState<Layout>({ w: STAGE_W, h: STAGE_H });
  const [tx, setTx] = useState(0);
  const [clock, setClock] = useState("");
  const [phoneScale, setPhoneScale] = useState(0.92);

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
    const apply = () => setPhoneScale(mq.matches ? 0.92 : 0.82);
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

  useEffect(() => {
    setClock(clockNow());
    const id = window.setInterval(() => setClock(clockNow()), 30_000);
    return () => clearInterval(id);
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
      setNotes((ns) => ns.filter((x) => x.id !== n.id));
      setTickets((ts) => [
        { id: n.id, text: n.req.text, from: n.req.from, person: n.req.to, status: "assigned", time: timeNow() },
        ...ts,
      ]);
      setCount((c) => c + 1);
      setHit((h) => ({ ...h, [n.req.to]: true }));
      later(() => setHit((h) => ({ ...h, [n.req.to]: false })), 800);
    },
    [later],
  );

  /** Fly the bubble into the phone and turn it into a ticket. */
  const fly = useCallback(
    (id: number) => {
      const n = notesRef.current.find((x) => x.id === id && x.state === "in");
      if (!n) return;
      setNotes((ns) => ns.map((x) => (x.id === id ? { ...x, state: "out" } : x)));
      const el = bubbleEls.current.get(id);
      const ph = phoneRef.current?.getBoundingClientRect();
      if (!el || !ph || reduced.current) {
        land(n);
        return;
      }
      const r = el.getBoundingClientRect();
      const dx = ph.left + ph.width / 2 - (r.left + r.width / 2);
      const dy = ph.top + Math.min(ph.height * 0.34, 210) - (r.top + r.height / 2);
      el.style.transition = `transform ${FLY_MS}ms ${EASE}, opacity ${FLY_MS - 200}ms ease 120ms`;
      el.style.transform = `translate(${dx}px, ${dy}px) scale(0.28)`;
      el.style.opacity = "0";
      later(() => land(n), FLY_MS - 80);
    },
    [land, later],
  );

  /* ---------- spawning ---------- */
  const nextRequest = useCallback((): Request => {
    const onBoard = new Set(notesRef.current.map((n) => n.req.text));
    if (bag.current.length === 0) bag.current = shuffle(REQUESTS);
    let pick = bag.current.pop()!;
    let guard = 0;
    while (onBoard.has(pick.text) && guard++ < REQUESTS.length) {
      bag.current.unshift(pick);
      pick = bag.current.pop()!;
    }
    return pick;
  }, []);

  const spawn = useCallback(() => {
    const req = nextRequest();
    const lay = layoutRef.current;
    const kk = lay.h / STAGE_H;
    const live = notesRef.current;
    // a spot in the request's zone whose bubble won't sit on top of one
    // that's already up — else put the request back and try next tick
    const open = SPOTS[req.zone].filter((s) =>
      live.every(
        (n) => Math.abs(n.spot.x - s.x) * kk > BUBBLE_W + 8 || Math.abs(n.spot.y - s.y) * kk > 76,
      ),
    );
    if (!open.length) {
      bag.current.push(req);
      return;
    }
    const spot = open[Math.floor(Math.random() * open.length)];
    const note: Note = { id: nextId++, req, spot, state: "in" };
    lastSpawn.current = Date.now();
    setNotes((ns) => [...ns, note]);
    setTx(panTo(spot, lay));
    later(() => fly(note.id), DWELL_MS);
  }, [nextRequest, panTo, fly, later]);

  useEffect(() => {
    // steady arrivals: quicker as the count climbs, never frantic; on a
    // panning board (phones) one request at a time so the camera can follow
    lastSpawn.current = Date.now() - 3400 + FIRST_MS;
    const id = window.setInterval(() => {
      const live = notesRef.current.filter((n) => n.state === "in").length;
      const lay = layoutRef.current;
      const max = STAGE_W * (lay.h / STAGE_H) > lay.w + 1 ? 1 : 3;
      if (live >= max) return;
      const gap = Math.max(2200, 3400 - countRef.current * 60) + (live ? 600 : 0);
      if (Date.now() - lastSpawn.current < gap) return;
      spawn();
    }, 250);
    return () => clearInterval(id);
  }, [spawn]);

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
    setHit({});
    bag.current = [];
    lastSpawn.current = Date.now() - 3400 + 400;
  };

  const resolve = (id: number) => {
    setTickets((ts) => ts.map((t) => (t.id === id ? { ...t, status: "resolved" } : t)));
  };

  /* ---------- bubble placement (board pixels, inside the camera) ---------- */
  const place = (spot: Spot): { left: number; top?: number; bottom?: number; tailClass: string; tail: number } => {
    const vx = spot.x * k;
    const vy = spot.y * k;
    const minL = -tx + 6;
    const maxL = -tx + layout.w - BUBBLE_W - 6;
    const left = clamp(vx - 29, minL, Math.max(minL, maxL));
    const tail = clamp(vx - left, 21, BUBBLE_W - 21); // tail centre, in bubble px
    const above = vy > 78;
    return {
      left,
      ...(above ? { bottom: layout.h - (vy - TAIL_GAP) } : { top: vy + TAIL_GAP }),
      tailClass: above ? "tail-b" : "tail-t",
      tail,
    };
  };

  const pins: Pin[] = notes.map((n) => ({ id: n.id, x: n.spot.x, y: n.spot.y, out: n.state === "out" }));
  const perPerson = tickets.reduce<Partial<Record<PersonId, number>>>((acc, t) => {
    acc[t.person] = (acc[t.person] ?? 0) + 1;
    return acc;
  }, {});

  /* ---------- render ---------- */
  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1fr_auto] lg:gap-14">
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
              style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${k})` }}
            >
              <FloorPlan pins={pins} />
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
                    <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-sort-orange" />
                    {n.req.from}
                  </span>
                  <span className="mt-0.5 block text-[13.5px] font-semibold leading-[1.25] text-ink">
                    {n.req.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* the HUD strip */}
          <div className="pointer-events-none absolute inset-x-3.5 bottom-2.5 flex items-center justify-between">
            <span className="flex items-center gap-2.5 whitespace-nowrap rounded-full bg-ink py-1.5 pl-2.5 pr-3.5 font-display text-[11px] font-bold uppercase tracking-[0.12em] text-white">
              <span aria-hidden className="ss-pulse inline-block h-2 w-2 rounded-full bg-sort-orange" />
              Live
              <span className="hidden font-body text-[12.5px] font-semibold normal-case tracking-normal text-[#b8bcc2] sm:inline">
                Street Cafe{clock ? ` · ${clock}` : ""}
              </span>
            </span>
            <span
              className="flex items-baseline gap-1.5 rounded-full border border-line bg-surface py-1 pl-3 pr-3.5"
              aria-live="polite"
            >
              <span className="font-display text-[20px] font-bold leading-none tabular-nums text-ink">
                {count}
              </span>
              <span className="font-display text-[11px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                routed
              </span>
            </span>
          </div>
          <span className="sr-only">
            Requests from around Street Cafe pop up on the floor plan and are routed to the one person
            who can act on them. The inbox on the phone shows each one as it lands.
          </span>
        </div>

        {/* the people — who each request lands on */}
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PEOPLE.map((p) => {
            const on = hit[p.id];
            const n = perPerson[p.id] ?? 0;
            return (
              <li
                key={p.id}
                className={`relative flex select-none items-center gap-3 rounded-2xl border-2 bg-surface px-3.5 py-3 transition-colors ${
                  on ? "ss-tile-hit border-sort-orange" : "border-line"
                }`}
              >
                <span
                  aria-hidden
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-[13px] font-bold transition-colors ${
                    on ? "bg-sort-orange text-ink" : "bg-blue-deep text-white"
                  }`}
                >
                  {on ? "✓" : p.initials}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-display text-[16px] font-bold text-ink">{p.name}</span>
                  <span className="block truncate text-[13px] text-ink-muted">{p.role}</span>
                </span>
                {n > 0 && (
                  <span
                    className="absolute -top-2.5 right-3 rounded-full bg-ink px-2 py-0.5 text-[11px] font-bold tabular-nums text-white"
                    aria-label={`${n} routed to ${p.name}`}
                  >
                    {n}
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        <p className="mt-3 text-right text-[13px]">
          <button
            type="button"
            onClick={reset}
            className="font-semibold text-ink-muted underline-offset-4 hover:text-blue-deep hover:underline"
          >
            Start over
          </button>
        </p>
      </div>

      {/* the phone */}
      <div ref={phoneRef} className="mx-auto">
        <AdminPhone tickets={tickets} onResolve={resolve} scale={phoneScale} />
      </div>
    </div>
  );
}
