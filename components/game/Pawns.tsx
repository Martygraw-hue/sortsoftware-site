/**
 * Pawns — the little board-game people on the floor (concept 6: circle over
 * an inverted triangle, standing on a soft shadow). RoutingGame runs the
 * simulation and hands each pawn a position and a state; this file only draws.
 *
 * Motion is a hop: the whole pawn translates to its next position over one
 * hop period (CSS transition on the outer group) while the body lifts in an
 * arc and the shadow shrinks under it (keyframes on the inner groups, re-run
 * per hop via the `hop` counter key). Staff are SORT blue, guests are ink;
 * a pawn that is submitting gets an orange head.
 */
export type PawnView = {
  id: number;
  x: number;
  y: number;
  /** increments on every hop so the arc animation restarts */
  hop: number;
  /** flips the rock direction each hop */
  side: 1 | -1;
  kind: "staff" | "guest";
  submitting: boolean;
  /** true when the pawn should not animate (reduced motion) */
  still: boolean;
};

export const HOP_MS = 400;
/** the pawn's footprint on the stage, from its feet: half-width and height */
export const PAWN_HW = 11;
export const PAWN_H = 31;

export default function Pawns({ pawns }: { pawns: PawnView[] }) {
  return (
    <g className="pawns" aria-hidden>
      {pawns.map((p) => {
        const c = p.kind === "staff" ? "var(--color-sort-blue)" : "#1a1d21";
        return (
          <g
            key={p.id}
            className="pawn"
            style={{
              transform: `translate(${p.x}px, ${p.y}px)`,
              transition: p.still
                ? "none"
                : `transform ${HOP_MS}ms cubic-bezier(0.45, 0, 0.55, 1)`,
            }}
          >
            <ellipse
              key={`s${p.hop}`}
              className={p.still ? undefined : "pawn-shadow"}
              cy="1"
              rx="10"
              ry="3.2"
              fill="#1a1d21"
              opacity="0.16"
            />
            <g
              key={`b${p.hop}`}
              className={p.still ? undefined : "pawn-body"}
              style={{ ["--rock" as string]: `${p.side * 6}deg` }}
            >
              <path d="M-11-16h22L0 0z" fill={c} />
              <circle
                cy="-24.4"
                r="6.4"
                fill={p.submitting ? "var(--color-sort-orange)" : c}
                stroke={p.submitting ? "#fff" : "none"}
                strokeWidth={p.submitting ? 1.6 : 0}
              />
            </g>
          </g>
        );
      })}
    </g>
  );
}
