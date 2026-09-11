import { STAGE_H, STAGE_W, type Spot } from "./stage";

/**
 * FloorPlan — Street Cafe from above, drawn as thin line-work on the site's
 * paper tones: kitchen and pass window, the bar with its stools, the office,
 * the dining floor, booths, restrooms, the lounge, the host stand and the
 * front door. It is deliberately quiet — the plan is the backdrop, the
 * requests are the picture.
 *
 * `pins` are where live requests are coming from: an orange dot, a pulsing
 * ring, and a soft glow over that part of the floor. They're drawn in here so
 * they scale with the plan. Styling lives in globals.css under `.ss-plan`.
 */

export type Pin = Spot & { id: number; out: boolean };

/** four chairs around a round table */
function FourTop({ x, y }: Spot) {
  return (
    <g>
      <circle className="fur" cx={x} cy={y} r="15" />
      <circle className="fur" cx={x} cy={y - 24} r="5" />
      <circle className="fur" cx={x} cy={y + 24} r="5" />
      <circle className="fur" cx={x - 24} cy={y} r="5" />
      <circle className="fur" cx={x + 24} cy={y} r="5" />
    </g>
  );
}

/** two chairs and a small square table */
function TwoTop({ x, y }: Spot) {
  return (
    <g>
      <rect className="fur" x={x - 9} y={y - 9} width="18" height="18" rx="2" />
      <circle className="fur" cx={x - 19} cy={y} r="4.5" />
      <circle className="fur" cx={x + 19} cy={y} r="4.5" />
    </g>
  );
}

function Booth({ y }: { y: number }) {
  return (
    <g>
      <rect className="seat" x="620" y={y} width="104" height="40" rx="3" />
      <rect className="fur" x="646" y={y + 12} width="52" height="16" rx="1" />
    </g>
  );
}

export default function FloorPlan({ pins }: { pins: Pin[] }) {
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

      {/* walls */}
      <rect className="wall" x="24" y="22" width="712" height="340" rx="2" />
      <path className="wall" d="M240 22V150H110M200 150H240M240 150V262" />
      <path className="wall" d="M600 22V120H736" />
      <path className="wall" d="M640 280H736M640 280V362M688 280V362" />
      {/* pass window */}
      <rect className="fur" x="110" y="145" width="90" height="10" rx="1" />
      {/* front door and its swing */}
      <path className="gap" d="M90 362H130" />
      <path className="swing" d="M130 362A40 40 0 0 0 90 322" />
      <path className="fur" d="M90 362V322" />

      {/* kitchen */}
      <rect className="seat" x="36" y="34" width="196" height="26" rx="2" />
      <path className="seat" d="M60 34v26M90 34v26M120 34v26M150 34v26M180 34v26M210 34v26" fill="none" />
      <rect className="fur" x="52" y="96" width="100" height="22" rx="2" />
      <rect className="fur" x="176" y="92" width="52" height="48" rx="2" />
      <text className="tiny" x="184" y="120">
        walk-in
      </text>
      <text className="zone" x="36" y="139">
        Kitchen
      </text>

      {/* bar */}
      <rect className="seat" x="252" y="32" width="336" height="12" rx="2" />
      <path
        className="seat"
        d="M270 32v12M300 32v12M330 32v12M360 32v12M390 32v12M420 32v12M450 32v12M480 32v12M510 32v12M540 32v12M570 32v12"
        fill="none"
      />
      <rect className="fur" x="252" y="66" width="336" height="20" rx="3" />
      {[276, 324, 372, 420, 468, 516, 564].map((x) => (
        <circle key={x} className="fur" cx={x} cy="104" r="7" />
      ))}
      <text className="zone" x="252" y="58">
        Bar
      </text>

      {/* office */}
      <rect className="fur" x="616" y="38" width="64" height="26" rx="2" />
      <circle className="fur" cx="648" cy="76" r="7" />
      <rect className="fur" x="700" y="38" width="24" height="40" rx="2" />
      <text className="zone" x="612" y="110">
        Office
      </text>

      {/* dining floor */}
      <FourTop x={300} y={205} />
      <FourTop x={390} y={205} />
      <FourTop x={480} y={205} />
      <FourTop x={300} y={300} />
      <FourTop x={390} y={300} />
      <FourTop x={480} y={300} />
      <TwoTop x={549} y={335} />
      <TwoTop x={605} y={335} />
      <text className="zone" x="252" y="350">
        Tables
      </text>

      {/* booths */}
      <Booth y={134} />
      <Booth y={182} />
      <Booth y={230} />
      <text className="zone" x="620" y="129">
        Booths
      </text>

      {/* restrooms */}
      <circle className="fur" cx="664" cy="300" r="6" />
      <rect className="fur" x="658" y="306" width="12" height="9" rx="2" />
      <circle className="fur" cx="712" cy="300" r="6" />
      <rect className="fur" x="706" y="306" width="12" height="9" rx="2" />
      <rect className="fur" x="650" y="340" width="26" height="10" rx="2" />
      <rect className="fur" x="698" y="340" width="26" height="10" rx="2" />
      <text className="tiny" x="644" y="275">
        Restrooms
      </text>

      {/* lounge + host stand */}
      <rect className="seat" x="36" y="166" width="18" height="72" rx="4" />
      <circle className="fur" cx="78" cy="202" r="11" />
      <rect className="seat" x="98" y="170" width="22" height="22" rx="5" />
      <rect className="seat" x="98" y="214" width="22" height="22" rx="5" />
      <text className="zone" x="132" y="180">
        Lounge
      </text>
      <rect className="fur" x="150" y="318" width="40" height="22" rx="2" />
      <text className="zone" x="150" y="352">
        Host
      </text>

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
