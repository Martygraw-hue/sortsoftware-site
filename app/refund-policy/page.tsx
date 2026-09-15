import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Sort Software's refund policy.",
};

export default function RefundPolicy() {
  return (
    <section className="mx-auto max-w-[760px] px-6 pb-24 pt-12 lg:px-8 lg:pt-16">
      <Link href="/" className="inline-block py-1 text-[14px] font-semibold text-blue-deep hover:underline">
        &larr; Back to home
      </Link>
      <h1 className="mt-6 text-[30px] font-bold text-ink">Refund Policy</h1>
      <p className="mt-2 text-[14px] text-ink-muted">Last updated: September 15, 2026</p>
      <div className="mt-6 grid gap-4 text-[16px] leading-relaxed text-ink-muted">
        <p>
          We want you to be happy with SORT. If something is not working for
          you, tell us first and we will try to make it right.
        </p>
        <p>
          <strong className="font-semibold text-ink">Refunds.</strong> Refunds
          are granted at our discretion. To request one, email{" "}
          <a href="mailto:help@sortsoftware.com" className="font-semibold text-blue-deep hover:underline">
            help@sortsoftware.com
          </a>{" "}
          with your account name and the reason for the request, and we will
          review it and reply.
        </p>
        <p>
          <strong className="font-semibold text-ink">Cancellation.</strong> You
          can cancel your subscription at any time from the Subscription page
          in your account settings. Cancellation takes effect at the end of the
          current paid term; you keep access until then, and you will not be
          charged again after that.
        </p>
        <p>
          This policy is part of our{" "}
          <Link href="/terms-and-conditions" className="font-semibold text-blue-deep hover:underline">
            Terms and Conditions
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
