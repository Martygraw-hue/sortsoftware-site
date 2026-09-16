import type { Metadata } from "next";
import Link from "next/link";

/**
 * /manage-plan — the formal statement of how a SORT subscription is
 * cancelled, written to sit beside the Refund Policy, Terms and Security
 * Policy on this site. The customer-facing version, in the marketing voice,
 * is at sortconnect.com/manage-plan; the two pages state the same facts and
 * are deliberately worded differently, so edit both when a fact changes.
 *
 * Unlisted but deliberately linked: the footer points here from every page,
 * so customers can always find it, while `index: false` keeps it out of
 * search results. Crawling stays allowed (no robots.txt Disallow) — a
 * disallowed page can never be read, so the noindex below would never be
 * seen. `follow` stays true because the links out of this page go to
 * policies we do want indexed.
 *
 * STRIPE_PORTAL_URL is the whole switch. While it is empty the page states
 * the email route, which is what actually happens today. Once the customer
 * portal is activated in the Stripe dashboard, paste the login link
 * (https://billing.stripe.com/p/login/...) into the constant and the button
 * and the billing copy both become the self-serve version. Nothing else to
 * change, and the page never promises a button that does not work. Keep this
 * constant in step with the same page on sort-connect-site.
 */
const STRIPE_PORTAL_URL = "";

export const metadata: Metadata = {
  title: "Manage Your Plan",
  description:
    "How to cancel a SORT subscription, when cancellation takes effect, and where billing is handled.",
  robots: { index: false, follow: true },
};

const CANCEL_MAILTO =
  "mailto:help@sortsoftware.com?subject=Cancel%20my%20SORT%20subscription&body=Please%20cancel%20my%20SORT%20subscription.%0A%0ABusiness%20name%3A%0A";

const link = "font-semibold text-blue-deep hover:underline";

export default function ManagePlan() {
  const portal = STRIPE_PORTAL_URL.length > 0;

  return (
    <section className="mx-auto max-w-[760px] px-6 pb-24 pt-12 lg:px-8 lg:pt-16">
      <Link href="/" className="inline-block py-1 text-[14px] font-semibold text-blue-deep hover:underline">
        &larr; Back to home
      </Link>
      <h1 className="mt-6 text-[30px] font-bold text-ink">Manage Your Plan</h1>
      <p className="mt-2 text-[14px] text-ink-muted">Last updated: September 16, 2026</p>

      <div className="mt-6 grid gap-4 text-[16px] leading-relaxed text-ink-muted">
        <p>
          This page sets out how a SORT subscription is cancelled and where
          billing is handled. It sits alongside our{" "}
          <Link href="/refund-policy" className={link}>
            Refund Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms-and-conditions" className={link}>
            Terms and Conditions
          </Link>
          .
        </p>

        <h2 className="mt-4 text-[20px] font-bold text-ink">How to cancel</h2>
        {portal ? (
          <p>
            Cancel the subscription yourself in the billing portal: open it
            with the button below and sign in with the email address on the
            account. You may also send the request to{" "}
            <a href="mailto:help@sortsoftware.com" className={link}>
              help@sortsoftware.com
            </a>{" "}
            and we will process it for you.
          </p>
        ) : (
          <p>
            Send the request to{" "}
            <a href="mailto:help@sortsoftware.com" className={link}>
              help@sortsoftware.com
            </a>{" "}
            from the email address on the account. We cancel the subscription
            and reply to confirm. No fee applies, and no call or written notice
            period is required.
          </p>
        )}

        <div className="mt-2">
          <a
            href={portal ? STRIPE_PORTAL_URL : CANCEL_MAILTO}
            className="btn inline-block rounded-xl bg-sort-orange px-6 py-4 text-center text-[16px] font-semibold text-ink shadow-[0_10px_24px_rgba(255,170,77,0.35)] hover:bg-orange-deep"
          >
            {portal ? "Open the billing portal" : "Email us to cancel"}
          </a>
        </div>

        <h2 className="mt-6 text-[20px] font-bold text-ink">
          When cancellation takes effect
        </h2>
        <p>
          Cancellation takes effect at the end of the current paid term. Access
          continues until that date and no further charge is made after it. The
          subscription does not renew once it has been cancelled.
        </p>

        <h2 className="mt-6 text-[20px] font-bold text-ink">Billing and invoices</h2>
        {portal ? (
          <p>
            The billing portal is also where the card on file is updated and
            current and past invoices are downloaded.
          </p>
        ) : (
          <p>
            Requests to update the card on file, change a plan, or obtain a
            copy of an invoice go to the same address.
          </p>
        )}

        <h2 className="mt-6 text-[20px] font-bold text-ink">Refunds</h2>
        <p>
          Cancelling stops future charges; it does not by itself refund a term
          already paid for. Refunds are granted at our discretion, and our{" "}
          <Link href="/refund-policy" className={link}>
            Refund Policy
          </Link>{" "}
          explains how to request one.
        </p>

        <h2 className="mt-6 text-[20px] font-bold text-ink">Questions</h2>
        <p>
          Anything about an account, a charge, or this page:{" "}
          <a href="mailto:help@sortsoftware.com" className={link}>
            help@sortsoftware.com
          </a>
          .
        </p>
      </div>
    </section>
  );
}
