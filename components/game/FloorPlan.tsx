import type { ReactNode } from "react";
import { STAGE_H, STAGE_W, type Spot } from "./stage";

/**
 * FloorPlan — the frame every industry's plan is drawn in: the glow under
 * the walls, the plan itself (line-work from an industry pack), and the pins
 * on top. `pins` are where live requests are coming from: an orange dot, a
 * pulsing ring, and a soft glow over that part of the floor. They're drawn in
 * here so they scale with the plan. Styling lives in globals.css under `.ss-plan`.
 */

export type Pin = Spot & { id: number; out: boolean };

export default function FloorPlan({
  pins,
  plan,
}: {
  pins: Pin[];
  plan: ReactNode;
}) {
  return (
    <svg
      className="ss-plan"
      viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
      width={STAGE_W}
      height={STAGE_H}
      aria-hidden
      focusable="false"
    >
      <defs>
        <radialGradient id="ss-glow">
          <stop offset="0" stopColor="#ffaa4d" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ffaa4d" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* the glow sits under the walls so the plan stays crisp on top */}
      {pins.map((p) => (
        <circle
          key={`g${p.id}`}
          className={`glow ${p.out ? "is-out" : ""}`}
          cx={p.x}
          cy={p.y}
          r="110"
          fill="url(#ss-glow)"
        />
      ))}

      {plan}

      {/* where the live requests are coming from */}
      {pins.map((p) => (
        <g key={p.id} className={`pin ${p.out ? "is-out" : ""}`}>
          <circle className="ring" cx={p.x} cy={p.y} r="12" />
          <circle className="dot" cx={p.x} cy={p.y} r="5" />
        </g>
      ))}
    </svg>
  );
}
