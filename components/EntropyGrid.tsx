/**
 * EntropyGrid — the site's signature visual. A field of brand confetti dots
 * that starts scattered, pulls itself into a clean grid, holds, and lets go
 * again (see .ss-settle in globals.css). Disorder -> order, on repeat.
 *
 * Pure CSS animation, no client JS. All jumble offsets are DERIVED FROM THE
 * DOT'S INDEX (deterministic), never Math.random() — random values would
 * differ between server render and hydration and break the page.
 */

const BLUE = "var(--color-sort-blue)";
const ORANGE = "var(--color-sort-orange)";

type Tone = "light" | "dark";

export default function EntropyGrid({
  size = 6,
  cell = 34,
  dot = 12,
  tone = "light",
  className = "",
}: {
  /** dots per side */
  size?: number;
  /** px between dot centers */
  cell?: number;
  /** dot diameter px */
  dot?: number;
  tone?: Tone;
  className?: string;
}) {
  const dots = Array.from({ length: size * size }, (_, i) => {
    const row = Math.floor(i / size);
    const col = i % size;
    // Deterministic pseudo-random jumble per dot (SSR-safe).
    const jx = ((i * 37 + 11) % 53) - 26; // -26..26 px
    const jy = ((i * 53 + 29) % 47) - 23; // -23..23 px
    const delay = ((i * 13) % 8) * 0.11; // slight phase stagger
    // Orange dots are the minority sprinkle, like the wordmark's confetti.
    const isOrange = (i * 7 + 3) % 5 === 0;
    const color =
      tone === "dark"
        ? isOrange
          ? ORANGE
          : "rgba(255,255,255,0.85)"
        : isOrange
          ? ORANGE
          : BLUE;
    return { row, col, jx, jy, delay, color, key: i };
  });

  const span = (size - 1) * cell + dot;

  return (
    <div
      aria-hidden
      className={`relative ${className}`}
      style={{ width: span, height: span }}
    >
      {dots.map((d) => (
        <span
          key={d.key}
          className="ss-settle absolute rounded-full"
          style={{
            left: d.col * cell,
            top: d.row * cell,
            width: dot,
            height: dot,
            background: d.color,
            ["--jx" as string]: `${d.jx}px`,
            ["--jy" as string]: `${d.jy}px`,
            ["--sdelay" as string]: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
