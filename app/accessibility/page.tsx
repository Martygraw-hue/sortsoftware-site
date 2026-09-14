import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: "Sort Software's commitment to an accessible website and how to reach us about it.",
};

const linkCls = "font-semibold text-blue-deep underline underline-offset-4";

export default function Accessibility() {
  return (
    <section className="mx-auto max-w-[760px] px-6 pb-24 pt-12 lg:px-8 lg:pt-16">
      <Link href="/" className="text-[14px] font-semibold text-blue-deep hover:underline">
        &larr; Back to Sort Software
      </Link>
      <h1 className="mt-6 text-[30px] font-bold text-ink">Accessibility Statement</h1>
      <div className="mt-6 grid gap-4 text-[16px] leading-relaxed text-ink-muted">
        <p>
          SORT Software LLC is committed to making this website accessible to the
          widest possible audience, including people who use assistive technologies
          such as screen readers, and people who navigate by keyboard alone.
        </p>
        <p>
          We aim to conform to the{" "}
          <a href="https://www.w3.org/TR/WCAG21/" className={linkCls}>
            Web Content Accessibility Guidelines (WCAG) 2.1
          </a>{" "}
          at Level AA. Measures we take include regular automated and manual
          accessibility audits of every page, text colors checked against the WCAG
          minimum contrast ratios, full keyboard operability with a visible focus
          indicator, a &ldquo;skip to content&rdquo; link on every page, respect
          for the system &ldquo;reduce motion&rdquo; preference, and a floor-plan
          demonstration on the home page that is also described in text for
          screen readers.
        </p>
        <p>
          Accessibility is an ongoing effort. If you experience any difficulty
          accessing any part of this website, or have suggestions for how we can
          improve, please contact us at{" "}
          <a href="mailto:help@sortsoftware.com" className={linkCls}>
            help@sortsoftware.com
          </a>
          . We take this feedback seriously and will do our best to address issues
          promptly.
        </p>
        <p className="text-[15px]">Last reviewed: September 13, 2026.</p>
      </div>
    </section>
  );
}
