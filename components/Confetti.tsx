/**
 * Confetti — a sparse field of drifting brand dots, absolutely positioned
 * inside a `relative` parent. Echoes the dots breaking off the SORT wordmark.
 * Positions are hand-placed (deterministic, SSR-safe); drift is CSS-only.
 */

type Dot = {
  left: string; // percentage
  top: string; // percentage
  size: number; // px
  color: "blue" | "orange";
  dx: number;
  dy: number;
  dur: number;
  delay: number;
  opacity?: number;
};

const FIELD: Dot[] = [
  { left: "4%", top: "16%", size: 9, color: "blue", dx: 7, dy: -9, dur: 9, delay: 0 },
  { left: "11%", top: "6%", size: 6, color: "orange", dx: -6, dy: 7, dur: 11, delay: 1.3 },
  { left: "22%", top: "12%", size: 12, color: "blue", dx: 5, dy: 8, dur: 10, delay: 0.6, opacity: 0.5 },
  { left: "31%", top: "4%", size: 7, color: "blue", dx: -8, dy: -6, dur: 12, delay: 2.1 },
  { left: "43%", top: "10%", size: 10, color: "orange", dx: 6, dy: 9, dur: 9.5, delay: 0.9 },
  { left: "55%", top: "5%", size: 6, color: "blue", dx: -5, dy: 7, dur: 10.5, delay: 1.7, opacity: 0.6 },
  { left: "66%", top: "13%", size: 13, color: "blue", dx: 8, dy: -7, dur: 11.5, delay: 0.2, opacity: 0.45 },
  { left: "76%", top: "6%", size: 8, color: "orange", dx: -7, dy: -8, dur: 9, delay: 2.6 },
  { left: "86%", top: "15%", size: 10, color: "blue", dx: 6, dy: 8, dur: 10, delay: 1.1, opacity: 0.55 },
  { left: "94%", top: "8%", size: 6, color: "blue", dx: -6, dy: 6, dur: 12, delay: 0.4 },
  { left: "90%", top: "34%", size: 8, color: "orange", dx: 7, dy: -6, dur: 10.5, delay: 1.9, opacity: 0.7 },
  { left: "96%", top: "52%", size: 11, color: "blue", dx: -6, dy: -9, dur: 9.5, delay: 0.8, opacity: 0.4 },
];

export default function Confetti({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      {FIELD.map((d, i) => (
        <span
          key={i}
          className="ss-dot absolute rounded-full"
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            opacity: d.opacity ?? 0.85,
            background:
              d.color === "orange"
                ? "var(--color-sort-orange)"
                : "var(--color-sort-blue)",
            ["--dx" as string]: `${d.dx}px`,
            ["--dy" as string]: `${d.dy}px`,
            ["--dur" as string]: `${d.dur}s`,
            ["--delay" as string]: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
