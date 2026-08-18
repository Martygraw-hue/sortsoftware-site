import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Sort Software's refund policy.",
};

export default function RefundPolicy() {
  return (
    <section className="mx-auto max-w-[760px] px-6 pb-24 pt-12 lg:px-8 lg:pt-16">
      <Link href="/" className="text-[14px] font-semibold text-blue-deep hover:underline">
        &larr; Back to home
      </Link>
      <h1 className="mt-6 text-[30px] font-bold text-ink">Refund Policy</h1>
      <div className="mt-6 grid gap-4 text-[16px] leading-relaxed text-ink-muted">
        <p>
          At SORT, we have a Satisfaction Guaranteed Policy. If you are not
          100% satisfied, contact us for a refund:{" "}
          <a href="mailto:help@sortsoftware.com" className="font-semibold text-blue-deep hover:underline">
            help@sortsoftware.com
          </a>
          .
        </p>
      </div>
    </section>
  );
}
