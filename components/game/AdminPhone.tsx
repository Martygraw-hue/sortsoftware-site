"use client";

import { useState } from "react";
import type { Person } from "./industries";

/**
 * AdminPhone — the Sort Admin inbox, fed by the routing game beside it.
 * The chrome (iPhone frame, status bar, business-name header, tabs, row
 * grammar) is ported from sortconnect.com's AppInbox so it reads as the same
 * product; the rows here are live — every note routed in the game lands at
 * the top, assigned to whoever you picked. Tap a row to open it, resolve it,
 * and the task count drops. Pure React + CSS, no motion library.
 */

export type Ticket = {
  id: number;
  text: string;
  from: string;
  person: Person;
  status: "assigned" | "resolved";
  time: string;
};

const SCREEN_W = 277;
const SCREEN_H = 600;

export default function AdminPhone({
  tickets,
  onResolve,
  scale = 1,
  business,
}: {
  tickets: Ticket[];
  business: string;
  onResolve: (id: number) => void;
  scale?: number;
}) {
  const [openId, setOpenId] = useState<number | null>(null);
  const open = tickets.find((t) => t.id === openId) ?? null;
  const todo = tickets.filter((t) => t.status === "assigned").length;

  return (
    <div
      className="relative mx-auto"
      style={{ width: SCREEN_W * scale, height: SCREEN_H * scale }}
    >
      <div
        className="origin-top-left rounded-[2.7rem] bg-ink p-[7px] shadow-frame-lg"
        style={{
          width: SCREEN_W,
          height: SCREEN_H,
          transform: `scale(${scale})`,
        }}
      >
        <div className="relative h-full overflow-hidden rounded-[2.3rem] bg-[#F2F4F9]">
          {/* status bar */}
          <div className="flex items-center justify-between px-6 pt-3 text-ink">
            <span className="text-[12.5px] font-semibold tabular-nums">
              9:42
            </span>
            <span className="flex items-center gap-1.5" aria-hidden>
              <Signal />
              <Wifi />
              <Battery />
            </span>
          </div>

          {/* org header */}
          <div className="flex items-start justify-between px-5 pt-3">
            <div className="font-display text-[24px] font-bold tracking-tight text-[#25355C]">
              {business.toUpperCase()}
            </div>
            <span
              aria-hidden
              className="relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5C84C] shadow-[inset_0_0_0_1.5px_#fff,inset_0_0_0_3px_#25355C,0_1px_3px_rgba(26,29,33,0.18)]"
            >
              <Coffee />
            </span>
          </div>
          <p className="px-5 text-[12.5px] text-[#686E7F]" aria-live="polite">
            You have{" "}
            <span className="font-semibold text-[#25355C]">
              {todo} Task{todo === 1 ? "" : "(s)"}
            </span>{" "}
            to complete
          </p>

          {/* tabs */}
          <div className="mt-3 flex items-center gap-5 px-5">
            <span className="rounded-full bg-[#3B76C0] px-4 py-1.5 text-[12.5px] font-semibold text-white underline underline-offset-2">
              By Time
            </span>
            <span className="text-[12.5px] font-semibold text-[#686E7F] underline underline-offset-2">
              By Topic
            </span>
            <span className="ml-auto text-[#3B76C0]" aria-hidden>
              <Magnifier />
            </span>
          </div>

          <p className="mt-3 px-5 text-[12.5px] font-medium text-[#426EB2]">
            {tickets.length ? "Today" : " "}
          </p>

          {/* submissions */}
          {tickets.length === 0 ? (
            <div className="mx-4 mt-6 rounded-xl border border-dashed border-[#C9D1E2] px-4 py-6 text-center">
              <span className="ss-pulse mx-auto mb-3 block h-2.5 w-2.5 rounded-full bg-sort-orange" />
              <p className="text-[12.5px] font-semibold text-[#25355C]">
                Inbox is clear.
              </p>
              <p className="mt-1 text-[11.5px] text-[#686E7F]">
                Route a note and it lands here.
              </p>
            </div>
          ) : (
            <ul className="space-y-2 px-4 pb-12 pt-1.5">
              {tickets.map((t) => {
                const p = t.person;
                const done = t.status === "resolved";
                return (
                  <li key={t.id} className="ss-row-in">
                    <button
                      type="button"
                      onClick={() => setOpenId(t.id)}
                      className={`relative block w-full rounded-xl py-2 pl-4 pr-3 text-left shadow-[0_1px_2px_rgba(26,29,33,0.05)] transition-colors ${
                        done ? "bg-white/60" : "bg-white hover:bg-[#F7F9FE]"
                      }`}
                      aria-label={`${p.tag}: ${t.text}, ${done ? "resolved" : "assigned to " + p.name}`}
                    >
                      <span
                        aria-hidden
                        className={`absolute bottom-2 left-1.5 top-2 w-[3.5px] rounded-full ${
                          done ? "bg-[#B9C3D6]" : "bg-[#3B76C0]"
                        }`}
                      />
                      <div className="flex items-baseline justify-between gap-2">
                        <p
                          className={`truncate text-[11.5px] font-bold tracking-[0.02em] ${
                            done ? "text-[#A3ABBD]" : "text-[#686E83]"
                          }`}
                        >
                          {p.tag}
                        </p>
                        <span className="shrink-0 text-[11px] tabular-nums text-[#686E7F]">
                          {t.time}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-baseline justify-between gap-2">
                        <p
                          className={`truncate text-[11.5px] ${
                            done
                              ? "text-[#A3ABBD] line-through"
                              : "text-[#686E7F]"
                          }`}
                        >
                          {t.text}
                        </p>
                        <span
                          className={`shrink-0 text-[11.5px] font-bold ${
                            done ? "text-[#4CAF7D]" : "text-[#2A6FBC]"
                          }`}
                        >
                          {done ? "Resolved" : `→ ${p.name}`}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {/* ticket detail — slides up over the list */}
          {open && (
            <div className="ss-sheet-in absolute inset-0 flex flex-col bg-[#F2F4F9]">
              <div className="rounded-b-[1.4rem] bg-[#2F7BC9] px-5 pb-4 pt-3 text-white">
                <div className="flex items-center justify-between text-[12px] font-semibold">
                  <span className="tabular-nums">9:42</span>
                  <span className="flex items-center gap-1.5" aria-hidden>
                    <Signal />
                    <Wifi />
                    <Battery />
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenId(null)}
                  className="mt-3 flex items-center gap-1 text-[14px] font-semibold"
                >
                  <CaretLeft />
                  Inbox
                </button>
                <div className="mt-2 font-display text-[20px] font-extrabold tracking-tight">
                  {open.person.tag}
                </div>
                <div className="text-[12px] font-semibold tracking-[0.12em] text-white/85">
                  SUBMISSION
                </div>
              </div>

              <div className="flex-1 space-y-3 px-4 pt-4">
                <Field label="From">
                  <Box>{open.from}</Box>
                </Field>
                <Field label="Report">
                  <Box tall>{open.text}</Box>
                </Field>
                <Field label="Assigned to">
                  <Box>
                    <span className="font-semibold text-[#2A6FBC]">
                      {open.person.name}
                    </span>{" "}
                    · {open.person.role}
                  </Box>
                </Field>
              </div>

              <div className="px-4 pb-8 pt-3">
                {open.status === "assigned" ? (
                  <button
                    type="button"
                    onClick={() => {
                      onResolve(open.id);
                      setOpenId(null);
                    }}
                    className="btn flex w-full items-center justify-center gap-2 rounded-xl bg-sort-orange py-3 text-[14px] font-bold text-ink hover:bg-orange-deep"
                  >
                    <Check />
                    Resolve
                  </button>
                ) : (
                  <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E3F3EA] py-3 text-[14px] font-bold text-[#2E8B57]">
                    <Check />
                    Resolved
                  </div>
                )}
              </div>
            </div>
          )}

          {/* bottom fade + home indicator */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-14 rounded-b-[2.3rem] bg-gradient-to-t from-[#F2F4F9] via-[#F2F4F9]/80 to-transparent"
          />
          <span
            aria-hidden
            className="absolute bottom-2 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-ink/25"
          />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1 text-[11px] font-semibold text-[#3A4256]">{label}</p>
      {children}
    </div>
  );
}

function Box({
  children,
  tall = false,
}: {
  children: React.ReactNode;
  tall?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border-2 border-[#E2E6F0] bg-white px-3 py-2 text-[12px] text-[#3A4256] shadow-[0_1px_2px_rgba(26,29,33,0.04)] ${
        tall ? "min-h-[64px] leading-snug" : ""
      }`}
    >
      {children}
    </div>
  );
}

/* ---- inline icons (no icon package on this site) ---- */
function Signal() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
      <rect x="1" y="10" width="2.6" height="5" rx="0.6" />
      <rect x="5" y="7.5" width="2.6" height="7.5" rx="0.6" />
      <rect x="9" y="4.5" width="2.6" height="10.5" rx="0.6" />
      <rect x="13" y="1.5" width="2.6" height="13.5" rx="0.6" />
    </svg>
  );
}
function Wifi() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M1.5 6a10 10 0 0 1 13 0" />
      <path d="M4 8.8a6.2 6.2 0 0 1 8 0" />
      <path d="M6.4 11.5a2.6 2.6 0 0 1 3.2 0" />
      <circle cx="8" cy="13.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
function Battery() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 16" fill="currentColor">
      <rect
        x="1"
        y="3"
        width="15"
        height="10"
        rx="2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <rect x="3" y="5" width="11" height="6" rx="1.2" />
      <rect x="17" y="6" width="2" height="4" rx="0.8" />
    </svg>
  );
}
function Coffee() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#25355C">
      <path d="M4 9h12a1 1 0 0 1 1 1v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-3a1 1 0 0 1 1-1zm14 1.5h1.5a2.5 2.5 0 0 1 0 5H18v-1.6h1.4a.9.9 0 0 0 0-1.8H18zM4 19.5h14V21H4z" />
    </svg>
  );
}
function Magnifier() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="6.8" cy="6.8" r="4.6" />
      <path d="M10.4 10.4 14 14" />
    </svg>
  );
}
function CaretLeft() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.5 2.5 5 8l5.5 5.5" />
    </svg>
  );
}
function Check() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 8.5 6 12l7.5-8" />
    </svg>
  );
}
