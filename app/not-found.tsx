import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/** 404 — its own title (WCAG 2.4.2) and a way home. */
export default function NotFound() {
  return (
    <section className="mx-auto max-w-[1160px] px-6 py-24 text-center lg:px-8 lg:py-32">
      <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-ink-muted">404</p>
      <h1 className="mt-3 text-[clamp(1.7rem,2.2vw+0.6rem,2.3rem)] font-bold leading-[1.12]">
        Page not found
      </h1>
      <p className="mx-auto mt-4 max-w-[46ch] text-[16.5px] leading-relaxed text-ink-muted">
        The page you were looking for has moved or never existed.
      </p>
      <Link
        href="/"
        className="btn mt-8 inline-flex items-center rounded-full bg-sort-orange px-7 py-3 text-[15.5px] font-semibold text-ink hover:bg-orange-deep"
      >
        Back to the home page
      </Link>
    </section>
  );
}
