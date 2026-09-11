import type { Spot } from "./stage";

/**
 * Shared furniture for the industry floor plans — every plan is line-work on
 * the site's paper tones, styled in globals.css under `.ss-plan`. Keep these
 * small and quiet: the plan is the backdrop, the requests are the picture.
 */

/** four chairs around a round table */
export function FourTop({ x, y }: Spot) {
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
export function TwoTop({ x, y }: Spot) {
  return (
    <g>
      <rect className="fur" x={x - 9} y={y - 9} width="18" height="18" rx="2" />
      <circle className="fur" cx={x - 19} cy={y} r="4.5" />
      <circle className="fur" cx={x + 19} cy={y} r="4.5" />
    </g>
  );
}

/** a car from above, nose up */
export function Car({ x, y }: Spot) {
  return (
    <g>
      <rect
        className="seat"
        x={x - 24}
        y={y - 52}
        width="48"
        height="104"
        rx="12"
      />
      <path
        className="fur"
        d={`M${x - 18} ${y - 26}h36M${x - 18} ${y + 22}h36`}
        fill="none"
      />
      <rect
        className="fur"
        x={x - 27}
        y={y - 40}
        width="6"
        height="14"
        rx="1"
      />
      <rect
        className="fur"
        x={x + 21}
        y={y - 40}
        width="6"
        height="14"
        rx="1"
      />
      <rect
        className="fur"
        x={x - 27}
        y={y + 22}
        width="6"
        height="14"
        rx="1"
      />
      <rect
        className="fur"
        x={x + 21}
        y={y + 22}
        width="6"
        height="14"
        rx="1"
      />
    </g>
  );
}

/** a run of shelving with bay ticks */
export function Shelf({ x, y, w, h }: Spot & { w: number; h: number }) {
  const ticks: string[] = [];
  if (w >= h)
    for (let t = x + 24; t < x + w; t += 24) ticks.push(`M${t} ${y}v${h}`);
  else for (let t = y + 24; t < y + h; t += 24) ticks.push(`M${x} ${t}h${w}`);
  return (
    <g>
      <rect className="seat" x={x} y={y} width={w} height={h} rx="2" />
      <path className="seat" d={ticks.join("")} fill="none" />
    </g>
  );
}

/** a desk with a chair on the near side */
export function Desk({
  x,
  y,
  w = 56,
  flip = false,
}: Spot & { w?: number; flip?: boolean }) {
  return (
    <g>
      <rect
        className="fur"
        x={x - w / 2}
        y={y - 11}
        width={w}
        height="22"
        rx="2"
      />
      <circle className="fur" cx={x} cy={flip ? y - 24 : y + 24} r="7" />
    </g>
  );
}

/** a bed with a pillow */
export function Bed({ x, y }: Spot) {
  return (
    <g>
      <rect
        className="seat"
        x={x - 16}
        y={y - 24}
        width="32"
        height="48"
        rx="3"
      />
      <rect
        className="fur"
        x={x - 12}
        y={y - 20}
        width="24"
        height="9"
        rx="2"
      />
    </g>
  );
}

/** an exam chair / table */
export function ExamTable({ x, y }: Spot) {
  return (
    <g>
      <rect
        className="seat"
        x={x - 11}
        y={y - 26}
        width="22"
        height="52"
        rx="6"
      />
      <rect className="fur" x={x - 8} y={y - 22} width="16" height="8" rx="2" />
    </g>
  );
}

/** a row of waiting chairs */
export function Chairs({
  x,
  y,
  n,
  gap = 18,
}: Spot & { n: number; gap?: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <rect
          key={i}
          className="seat"
          x={x + i * gap}
          y={y}
          width="13"
          height="13"
          rx="3"
        />
      ))}
    </g>
  );
}

/** a door opening with its swing arc (in the bottom wall unless `side`) */
export function Door({
  x,
  y,
  side = "bottom",
}: Spot & { side?: "bottom" | "top" | "left" | "right" }) {
  if (side === "bottom")
    return (
      <g>
        <path className="gap" d={`M${x - 20} ${y}H${x + 20}`} />
        <path
          className="swing"
          d={`M${x + 20} ${y}A40 40 0 0 0 ${x - 20} ${y - 40}`}
        />
        <path className="fur" d={`M${x - 20} ${y}V${y - 40}`} />
      </g>
    );
  if (side === "top")
    return (
      <g>
        <path className="gap" d={`M${x - 20} ${y}H${x + 20}`} />
        <path
          className="swing"
          d={`M${x + 20} ${y}A40 40 0 0 1 ${x - 20} ${y + 40}`}
        />
        <path className="fur" d={`M${x - 20} ${y}V${y + 40}`} />
      </g>
    );
  if (side === "left")
    return (
      <g>
        <path className="gap" d={`M${x} ${y - 20}V${y + 20}`} />
        <path
          className="swing"
          d={`M${x} ${y + 20}A40 40 0 0 1 ${x + 40} ${y - 20}`}
        />
        <path className="fur" d={`M${x} ${y - 20}H${x + 40}`} />
      </g>
    );
  return (
    <g>
      <path className="gap" d={`M${x} ${y - 20}V${y + 20}`} />
      <path
        className="swing"
        d={`M${x} ${y + 20}A40 40 0 0 0 ${x - 40} ${y - 20}`}
      />
      <path className="fur" d={`M${x} ${y - 20}H${x - 40}`} />
    </g>
  );
}

/** the restroom pictogram — the man-and-woman sign, centred on x,y */
export function Restroom({ x, y }: Spot) {
  return (
    <g className="pict" transform={`translate(${x} ${y})`}>
      {/* man */}
      <circle cx="-9" cy="-13" r="3.2" />
      <rect x="-13.5" y="-8.5" width="9" height="11" rx="2" />
      <rect x="-12.5" y="2" width="3" height="9" rx="1" />
      <rect x="-7.5" y="2" width="3" height="9" rx="1" />
      {/* woman */}
      <circle cx="9" cy="-13" r="3.2" />
      <path d="M9 -8.5l7 11.5H2z" />
      <rect x="5.5" y="3" width="3" height="8" rx="1" />
      <rect x="10.5" y="3" width="3" height="8" rx="1" />
    </g>
  );
}
