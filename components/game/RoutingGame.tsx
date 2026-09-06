"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AdminPhone, { type Ticket } from "./AdminPhone";
import { PEOPLE, REQUESTS, personById, type PersonId, type Request } from "./requests";

/**
 * RoutingGame — Right Person Routing as a thing you do.
 *
 * Notes from a Friday-night shift at Street Cafe drift onto the counter.
 * Drag each one to the person who can act on it. Right person: it snaps in
 * and flies into the Admin inbox on the phone, assigned to them. Wrong
 * person: they hand it back. No timer, no losing — a counter climbs.
 *
 * It plays itself when idle (a note glides to the right tile every few
 * seconds) so the page is alive for someone who never touches it — which is
 * also the demo.
 *
 * Mechanics are native pointer events + CSS transforms; no motion library.
 * Touch users can also tap a note, then tap a person.
 */

type Note = {
  id: number;
  req: Request;
  slot: number;
  rot: number;
  jx: number;
  jy: number;
  state: "idle" | "auto" | "out";
};

const MAX_NOTES = 4;
const SLOT_COLS = 3;
const SLOT_ROWS = 2;
const IDLE_MS_FRESH = 4200; // before anyone has touched it: stay lively
const IDLE_MS_PLAYED = 9000; // once they've played: give them room
const AUTO_GAP_MS = 3400; // spacing between self-routed notes
const FIRST_AUTO_MS = 2600; // first self-route after load

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

const timeNow = () =>
  new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

export default function RoutingGame() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [count, setCount] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [tileFx, setTileFx] = useState<Record<string, "hit" | "miss" | undefined>>({});
  const [phoneScale, setPhoneScale] = useState(0.92);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setPhoneScale(mq.matches ? 0.92 : 0.82);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const notesRef = useRef<Note[]>([]);
  notesRef.current = notes;
  const countRef = useRef(0);
  countRef.current = count;

  const bag = useRef<Request[]>([]);
  const noteEls = useRef(new Map<number, HTMLElement>());
  const tileEls = useRef(new Map<PersonId, HTMLElement>());
  const phoneRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const lastInteract = useRef(0);
  const lastAuto = useRef(0);
  const played = useRef(false);
  const drag = useRef<{
    id: number;
    el: HTMLElement;
    sx: number;
    sy: number;
    dx: number;
    dy: number;
    moved: boolean;
  } | null>(null);

  const touch = () => {
    lastInteract.current = Date.now();
    played.current = true;
  };

  /* ---------- spawning ---------- */
  const nextRequest = useCallback((): Request => {
    const onBoard = new Set(notesRef.current.map((n) => n.req.text));
    if (bag.current.length === 0) bag.current = shuffle(REQUESTS);
    // skip anything already on the counter
    let pick = bag.current.pop()!;
    let guard = 0;
    while (onBoard.has(pick.text) && guard++ < REQUESTS.length) {
      bag.current.unshift(pick);
      pick = bag.current.pop()!;
    }
    return pick;
  }, []);

  const spawn = useCallback(() => {
    const cur = notesRef.current;
    if (cur.length >= MAX_NOTES) return;
    const used = new Set(cur.map((n) => n.slot));
    const free: number[] = [];
    for (let s = 0; s < SLOT_COLS * SLOT_ROWS; s++) if (!used.has(s)) free.push(s);
    if (!free.length) return;
    const slot = free[Math.floor(Math.random() * free.length)];
    const note: Note = {
      id: nextId++,
      req: nextRequest(),
      slot,
      rot: (Math.random() - 0.5) * 9,
      jx: (Math.random() - 0.5) * 22,
      jy: (Math.random() - 0.5) * 16,
      state: "idle",
    };
    setNotes((n) => [...n, note]);
  }, [nextRequest]);

  useEffect(() => {
    // first three land quickly so the counter isn't empty on arrival
    const t0 = setTimeout(spawn, 250);
    const t1 = setTimeout(spawn, 900);
    const t2 = setTimeout(spawn, 1700);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [spawn]);

  useEffect(() => {
    // steady arrivals: quicker as the count climbs, never frantic
    let alive = true;
    let handle = 0;
    const loop = () => {
      if (!alive) return;
      const interval = Math.max(1900, 3800 - countRef.current * 90);
      handle = window.setTimeout(() => {
        spawn();
        loop();
      }, interval);
    };
    loop();
    return () => {
      alive = false;
      clearTimeout(handle);
    };
  }, [spawn]);

  /* ---------- geometry helpers ---------- */
  const baseTransform = (n: Note) => `translate(${n.jx}px, ${n.jy}px) rotate(${n.rot}deg)`;

  const tileAt = (x: number, y: number): PersonId | null => {
    for (const [id, el] of tileEls.current) {
      const r = el.getBoundingClientRect();
      if (x >= r.left - 8 && x <= r.right + 8 && y >= r.top - 8 && y <= r.bottom + 8) return id;
    }
    return null;
  };

  const flash = (id: PersonId, kind: "hit" | "miss") => {
    setTileFx((f) => ({ ...f, [id]: kind }));
    window.setTimeout(() => setTileFx((f) => ({ ...f, [id]: undefined })), kind === "hit" ? 700 : 1100);
  };

  const snapBack = (n: Note, el: HTMLElement) => {
    el.style.transition = `transform 420ms ${EASE}`;
    el.style.transform = baseTransform(n);
  };

  /** Fly the note into the phone and turn it into a ticket. */
  const deliver = (n: Note, el: HTMLElement, dx: number, dy: number) => {
    const r = el.getBoundingClientRect();
    const baseX = r.left + r.width / 2 - dx;
    const baseY = r.top + r.height / 2 - dy;
    const ph = phoneRef.current?.getBoundingClientRect();
    const tx = ph ? ph.left + ph.width / 2 : baseX;
    const ty = ph ? ph.top + Math.min(ph.height * 0.34, 210) : baseY - 120;
    el.style.transition = `transform 560ms ${EASE}, opacity 420ms ease 120ms`;
    el.style.transform = `translate(${tx - baseX + n.jx}px, ${ty - baseY + n.jy}px) rotate(0deg) scale(0.28)`;
    el.style.opacity = "0";
    el.style.pointerEvents = "none";
    setNotes((ns) => ns.map((x) => (x.id === n.id ? { ...x, state: "out" } : x)));
    window.setTimeout(() => {
      setNotes((ns) => ns.filter((x) => x.id !== n.id));
      setTickets((ts) => [
        { id: n.id, text: n.req.text, from: n.req.from, person: n.req.to, status: "assigned", time: timeNow() },
        ...ts,
      ]);
      setCount((c) => c + 1);
    }, 520);
  };

  const attempt = (n: Note, to: PersonId, el: HTMLElement, dx: number, dy: number) => {
    setSelected(null);
    if (n.req.to === to) {
      flash(to, "hit");
      deliver(n, el, dx, dy);
    } else {
      flash(to, "miss");
      snapBack(n, el);
      setNotes((ns) => ns.map((x) => (x.id === n.id ? { ...x, state: "idle" } : x)));
    }
  };

  /* ---------- pointer handling ---------- */
  const onPointerDown = (e: React.PointerEvent<HTMLElement>, n: Note) => {
    if (n.state !== "idle") return;
    touch();
    e.preventDefault(); // no text selection / focus shuffle while dragging across the tiles
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    el.style.transition = "none";
    el.classList.add("is-dragging");
    drag.current = { id: n.id, el, sx: e.clientX, sy: e.clientY, dx: 0, dy: 0, moved: false };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d) return;
    d.dx = e.clientX - d.sx;
    d.dy = e.clientY - d.sy;
    if (Math.abs(d.dx) > 4 || Math.abs(d.dy) > 4) d.moved = true;
    d.el.style.transform = `translate(${d.dx}px, ${d.dy}px) rotate(0deg) scale(1.05)`;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLElement>, n: Note) => {
    const d = drag.current;
    if (!d || d.id !== n.id) return;
    drag.current = null;
    touch();
    const el = d.el;
    try {
      el.releasePointerCapture(e.pointerId);
    } catch {}
    el.classList.remove("is-dragging");

    if (!d.moved) {
      // a tap: select / deselect (touch + keyboard path)
      setSelected((s) => (s === n.id ? null : n.id));
      snapBack(n, el);
      return;
    }
    const hit = tileAt(e.clientX, e.clientY);
    if (hit) attempt(n, hit, el, d.dx, d.dy);
    else snapBack(n, el);
  };

  const onTileClick = (pid: PersonId) => {
    touch();
    if (selected == null) return;
    const n = notesRef.current.find((x) => x.id === selected && x.state === "idle");
    const el = n && noteEls.current.get(n.id);
    const tile = tileEls.current.get(pid);
    if (!n || !el || !tile) return;
    // glide from the note's spot to the tile, then judge it
    setNotes((ns) => ns.map((x) => (x.id === n.id ? { ...x, state: "auto" } : x)));
    const a = el.getBoundingClientRect();
    const b = tile.getBoundingClientRect();
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    el.style.transition = `transform 480ms ${EASE}`;
    el.style.transform = `translate(${dx + n.jx}px, ${dy + n.jy}px) rotate(0deg) scale(0.9)`;
    window.setTimeout(() => attempt(n, pid, el, dx + n.jx, dy + n.jy), 470);
  };

  /* ---------- self-play when idle ---------- */
  useEffect(() => {
    lastInteract.current = Date.now() - IDLE_MS_FRESH + FIRST_AUTO_MS;
    const id = window.setInterval(() => {
      const now = Date.now();
      if (drag.current) return;
      const idle = played.current ? IDLE_MS_PLAYED : IDLE_MS_FRESH;
      if (now - lastInteract.current < idle) return;
      if (now - lastAuto.current < AUTO_GAP_MS) return;
      const n = notesRef.current.find((x) => x.state === "idle");
      const el = n && noteEls.current.get(n.id);
      const tile = n && tileEls.current.get(n.req.to);
      if (!n || !el || !tile) return;
      lastAuto.current = now;
      setNotes((ns) => ns.map((x) => (x.id === n.id ? { ...x, state: "auto" } : x)));
      const a = el.getBoundingClientRect();
      const b = tile.getBoundingClientRect();
      const dx = b.left + b.width / 2 - (a.left + a.width / 2);
      const dy = b.top + b.height / 2 - (a.top + a.height / 2);
      el.style.transition = `transform 1100ms ${EASE}`;
      el.style.transform = `translate(${dx + n.jx}px, ${dy + n.jy}px) rotate(0deg) scale(0.92)`;
      window.setTimeout(() => attempt(n, n.req.to, el, dx + n.jx, dy + n.jy), 1080);
    }, 400);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = () => {
    touch();
    setNotes([]);
    setTickets([]);
    setCount(0);
    setSelected(null);
    bag.current = [];
    window.setTimeout(spawn, 200);
    window.setTimeout(spawn, 700);
  };

  const resolve = (id: number) => {
    touch();
    setTickets((ts) => ts.map((t) => (t.id === id ? { ...t, status: "resolved" } : t)));
  };

  /* ---------- render ---------- */
  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1fr_auto] lg:gap-14">
      {/* the counter — one surface, the number in its corner, one line of
          instruction that leaves once you've routed something */}
      <div>
        <div
          ref={boardRef}
          className="relative h-[320px] overflow-visible rounded-[28px] border border-line bg-surface shadow-frame sm:h-[360px] lg:h-[400px]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[28px] opacity-[0.55] [background:radial-gradient(circle_at_1px_1px,var(--color-line)_1px,transparent_0)] [background-size:22px_22px]"
          />

          <p
            className="pointer-events-none absolute bottom-4 right-5 flex items-baseline gap-2"
            aria-live="polite"
          >
            <span className="font-display text-[34px] font-bold leading-none tabular-nums text-ink">
              {count}
            </span>
            <span className="font-display text-[12px] font-bold uppercase tracking-[0.14em] text-ink-muted">
              routed
            </span>
          </p>

          <p
            aria-hidden
            className={`pointer-events-none absolute bottom-4 left-5 text-[14px] text-ink-muted transition-opacity duration-500 ${
              count > 0 ? "opacity-0" : "opacity-100"
            }`}
          >
            Drag each note to the right person.
          </p>
          <span className="sr-only">
            Notes arrive on the counter. Select a note, then choose the person who should handle it.
          </span>

          {notes.map((n) => {
            const col = n.slot % SLOT_COLS;
            const row = Math.floor(n.slot / SLOT_COLS);
            const left = `${5 + col * 31.5}%`;
            const top = `${13 + row * 44}%`;
            const isSel = selected === n.id;
            return (
              <button
                key={n.id}
                type="button"
                ref={(el) => {
                  if (el) noteEls.current.set(n.id, el);
                  else noteEls.current.delete(n.id);
                }}
                onPointerDown={(e) => onPointerDown(e, n)}
                onPointerMove={onPointerMove}
                onPointerUp={(e) => onPointerUp(e, n)}
                onPointerCancel={(e) => onPointerUp(e, n)}
                aria-pressed={isSel}
                aria-label={`Note from ${n.req.from}: ${n.req.text}. ${isSel ? "Selected — now choose a person." : "Select, then choose a person."}`}
                className={`ss-note ss-pop absolute w-[28%] min-w-[150px] cursor-grab select-none rounded-2xl border bg-paper px-3.5 py-3 text-left shadow-frame ${
                  isSel ? "border-sort-orange ring-[3px] ring-sort-orange/40" : "border-line"
                } ${n.state === "auto" ? "is-auto pointer-events-none" : ""}`}
                style={{ left, top, transform: baseTransform(n) }}
              >
                <span className="flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-[0.1em] text-ink-muted">
                  <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-sort-orange" />
                  {n.req.from}
                </span>
                <span className="mt-1 block text-[14.5px] font-semibold leading-snug text-ink">
                  {n.req.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* the people */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PEOPLE.map((p) => {
            const fx = tileFx[p.id];
            return (
              <button
                key={p.id}
                type="button"
                ref={(el) => {
                  if (el) tileEls.current.set(p.id, el);
                  else tileEls.current.delete(p.id);
                }}
                onClick={() => onTileClick(p.id)}
                aria-label={`${p.name}, ${p.role}${selected != null ? " — route the selected note here" : ""}`}
                className={`ss-tile relative flex select-none items-center gap-3 rounded-2xl border-2 bg-surface px-3.5 py-3 text-left transition-colors ${
                  fx === "hit"
                    ? "ss-tile-hit border-sort-orange"
                    : fx === "miss"
                      ? "ss-tile-miss border-line"
                      : selected != null
                        ? "border-sort-blue/50 hover:border-sort-blue"
                        : "border-line hover:border-sort-blue/60"
                }`}
              >
                <span
                  aria-hidden
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-[13px] font-bold ${
                    fx === "hit" ? "bg-sort-orange text-ink" : "bg-blue-deep text-white"
                  }`}
                >
                  {fx === "hit" ? "✓" : p.initials}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-display text-[16px] font-bold text-ink">
                    {p.name}
                  </span>
                  <span className="block truncate text-[13px] text-ink-muted">{p.role}</span>
                </span>
                {fx === "miss" && (
                  <span
                    aria-hidden
                    className="ss-pop absolute -top-3 right-3 rounded-full bg-ink px-2.5 py-1 text-[11.5px] font-semibold text-white shadow-frame"
                  >
                    {p.nope}
                  </span>
                )}
              </button>
            );
          })}
        </div>

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
