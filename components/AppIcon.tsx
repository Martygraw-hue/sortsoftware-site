/**
 * AppIcon — CSS-drawn app-store-style icons for the two apps. The Admin
 * variant mirrors the real Sort Admin App Store icon (dark tile, orange
 * ring "O", confetti rising off it); the Sort variant is its light sibling.
 * Drawn in CSS so the icons stay crisp at any size with zero image weight.
 */

const CONFETTI = [
  // deterministic sprinkle above the ring, in tile-percentage coords
  { left: 18, top: 14, size: 7, o: 0.95 },
  { left: 30, top: 8, size: 5, o: 0.8 },
  { left: 44, top: 16, size: 8, o: 1 },
  { left: 58, top: 7, size: 5, o: 0.7 },
  { left: 70, top: 13, size: 6, o: 0.9 },
  { left: 82, top: 20, size: 4, o: 0.75 },
  { left: 25, top: 22, size: 4, o: 0.6 },
  { left: 63, top: 21, size: 4, o: 0.65 },
];

export default function AppIcon({
  variant,
  size = 76,
}: {
  variant: "sort" | "admin";
  size?: number;
}) {
  const dark = variant === "admin";
  const ring = size * 0.42; // ring outer diameter
  const ringBorder = size * 0.115;

  return (
    <span
      aria-hidden
      className={`relative inline-block shrink-0 overflow-hidden ${
        dark
          ? "bg-ink"
          : "border border-line bg-surface"
      }`}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.235, // iOS squircle-ish
        boxShadow: dark
          ? "0 10px 24px rgba(26,29,33,0.35)"
          : "0 10px 24px rgba(26,29,33,0.12)",
      }}
    >
      {/* confetti rising off the O */}
      {CONFETTI.map((c, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${c.left}%`,
            top: `${c.top}%`,
            width: (c.size / 76) * size,
            height: (c.size / 76) * size,
            opacity: c.o,
            background: dark
              ? i % 3 === 0
                ? "var(--color-sort-orange)"
                : "rgba(255,255,255,0.9)"
              : i % 3 === 0
                ? "var(--color-sort-orange)"
                : "var(--color-sort-blue)",
          }}
        />
      ))}
      {/* the O */}
      <span
        className="absolute rounded-full"
        style={{
          left: "50%",
          top: "58%",
          transform: "translate(-50%, -50%)",
          width: ring,
          height: ring,
          border: `${ringBorder}px solid var(--color-sort-orange)`,
        }}
      />
    </span>
  );
}
