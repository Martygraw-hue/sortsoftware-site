/**
 * GameTitle — the Play section's mini-game title card (concept E, "Level card").
 * The badge is the industry picker (arrows walk INDUSTRIES); under it the title in the chunky game face with SORT in blue and its
 * O in SORT orange. GameProgress is the scoreboard that sits under the floor:
 * the orange bar that fills as requests are routed, the readouts, and Start over.
 * Both are presentational: RoutingGame owns the numbers.
 */
type TitleProps = {
  label: string;
  prevLabel: string;
  nextLabel: string;
  onPrev: () => void;
  onNext: () => void;
};

export default function GameTitle({
  label,
  prevLabel,
  nextLabel,
  onPrev,
  onNext,
}: TitleProps) {
  const arrow =
    "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 border-ink text-ink transition-colors hover:bg-ink hover:text-sort-orange";
  /* fixed widths on every cell so the arrows never move when the names change */
  const ghost =
    "hidden w-[150px] whitespace-nowrap text-center text-[9.5px] tracking-[0.1em] text-[#b8bcc2] sm:block";
  return (
    <div className="mb-12 flex flex-col items-center text-center lg:mb-14">
      {/* the industry picker: a carousel of names — the neighbours sit ghosted
          either side of the active one so the arrows read as walking a list */}
      <div className="flex items-center gap-2.5 font-game uppercase sm:gap-3">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous industry"
          className={arrow}
        >
          <svg
            width="8"
            height="12"
            viewBox="0 0 10 14"
            fill="none"
            aria-hidden
          >
            <path
              d="M8 1 2 7l6 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span aria-hidden className={ghost}>
          {prevLabel}
        </span>
        <span
          className="w-[200px] whitespace-nowrap rounded-md bg-ink px-3 py-2 text-[11px] tracking-[0.12em] text-white sm:w-[220px] sm:text-[12px]"
          aria-live="polite"
        >
          {label}
        </span>
        <span aria-hidden className={ghost}>
          {nextLabel}
        </span>
        <button
          type="button"
          onClick={onNext}
          aria-label="Next industry"
          className={arrow}
        >
          <svg
            width="8"
            height="12"
            viewBox="0 0 10 14"
            fill="none"
            aria-hidden
          >
            <path
              d="m2 1 6 6-6 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <h1 className="mt-8 font-game text-[clamp(1.55rem,4.4vw+0.3rem,3.5rem)] leading-[1.08] tracking-[-0.02em] text-ink [word-spacing:-0.25em]">
        TAKE{" "}
        <span className="text-sort-blue">
          S<span className="text-sort-orange">O</span>RT
        </span>{" "}
        FOR A SPIN
      </h1>
    </div>
  );
}

type ProgressProps = {
  routed: number;
  resolved: number;
  total: number;
  onReset: () => void;
};

/**
 * GameProgress — the scoreboard under the floor. One bar, two fills: orange
 * grows as requests are routed to the phone, blue grows over it as they're
 * resolved there. Fire and ice.
 */
export function GameProgress({
  routed,
  resolved,
  total,
  onReset,
}: ProgressProps) {
  const pct = (n: number) => `${Math.min(100, Math.round((n / total) * 100))}%`;
  return (
    <div className="mt-4 rounded-[22px] border border-line bg-surface px-5 py-4 shadow-frame sm:px-6">
      <div
        className="relative h-2.5 w-full overflow-hidden rounded-full bg-[#e2ddd3]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={Math.min(routed, total)}
        aria-label={`${routed} routed, ${resolved} resolved`}
      >
        <span
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-sort-orange to-[#ff8a3d] transition-[width] duration-700 ease-out"
          style={{ width: pct(routed) }}
        />
        <span
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-deep to-sort-blue transition-[width] duration-700 ease-out"
          style={{ width: pct(resolved) }}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 font-display text-[12px] font-bold uppercase tracking-[0.2em]">
        <span
          className="flex items-center gap-2 tabular-nums text-orange-text"
          aria-live="polite"
        >
          <span aria-hidden className="h-2 w-2 rounded-full bg-sort-orange" />
          Routed {routed}
        </span>
        <span
          className="flex items-center gap-2 tabular-nums text-blue-deep"
          aria-live="polite"
        >
          <span aria-hidden className="h-2 w-2 rounded-full bg-sort-blue" />
          Resolved {resolved}
        </span>
        <button
          type="button"
          onClick={onReset}
          className="ml-auto font-body text-[13px] font-semibold normal-case tracking-normal text-ink-muted underline-offset-4 hover:text-blue-deep hover:underline"
        >
          Start over
        </button>
      </div>
    </div>
  );
}
