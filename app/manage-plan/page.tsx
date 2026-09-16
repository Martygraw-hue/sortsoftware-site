import type { Metadata } from "next";
import Link from "next/link";

/**
 * /manage-plan — the one page that answers "how do I cancel?".
 *
 * Unlisted but deliberately linked: the footer points here from every page,
 * so customers can always find it, while `index: false` keeps it out of
 * search results. Crawling stays allowed (no robots.txt Disallow) — a
 * disallowed page can never be read, so the noindex below would never be
 * seen. `follow` stays true, unlike /set-up on the Connect site, because the
 * links out of this page go to policies we do want indexed.
 *
 * STRIPE_PORTAL_URL is the whole switch. While it is empty the page offers
 * the email route, which is what actually happens today. Once the customer
 * portal is activated in the Stripe dashboard, paste the login link
 * (https://billing.stripe.com/p/login/...) into the constant and the button
 * and the billing copy both become the self-serve version. Nothing else to
 * change, and the page never promises a button that does not work.
 */
const STRIPE_PORTAL_URL = "";

export const metadata: Metadata = {
  title: "Manage Your Plan",
  description:
    "How to cancel your SORT subscription, when cancellation takes effect, and who to contact about billing.",
  robots: { index: false, follow: true },
};

const CANCEL_MAILTO =
  "mailto:help@sortsoftware.com?subject=Cancel%20my%20SORT%20subscription&body=Please%20cancel%20my%20SORT%20subscription.%0A%0AAccount%20name%3A%0A";

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
          Everything about your SORT subscription in one place: how to cancel,
          when the cancellation takes effect, and who to ask about billing.
        </p>

        <h2 className="mt-4 text-[20px] font-bold text-ink">Cancelling</h2>
        {portal ? (
          <p>
            You can cancel your subscription yourself in the billing portal.
            Open it with the button below, sign in with the email address on
            your account, and choose to cancel. You can also email{" "}
            <a href="mailto:help@sortsoftware.com" className="font-semibold text-blue-deep hover:underline">
              help@sortsoftware.com
            </a>{" "}
            and we will do it for you.
          </p>
        ) : (
          <p>
            Email{" "}
            <a href="mailto:help@sortsoftware.com" className="font-semibold text-blue-deep hover:underline">
              help@sortsoftware.com
            </a>{" "}
            from the address on your account and tell us you would like to
            cancel. We will cancel the subscription and reply to confirm.
            There is no cancellation fee and no phone call to sit through
            &mdash; one email is enough.
          </p>
        )}
        <p>
          Cancellation takes effect at the end of your current paid term. You
          keep full access until then, and you will not be charged again after
          that date.
        </p>

        <div className="mt-2">
          <a
            href={portal ? STRIPE_PORTAL_URL : CANCEL_MAILTO}
            className="btn inline-block rounded-xl bg-sort-orange px-6 py-4 text-center text-[16px] font-semibold text-ink shadow-[0_10px_24px_rgba(255,170,77,0.35)] hover:bg-orange-deep"
          >
            {portal ? "Open the billing portal" : "Email us to cancel"}
          </a>
        </div>

        <h2 className="mt-6 text-[20px] font-bold text-ink">Billing and invoices</h2>
        {portal ? (
          <p>
            The same billing portal is where you update the card on file and
            download current and past invoices.
          </p>
        ) : (
          <p>
            To update the card on file, change your plan, or get a copy of an
            invoice, email the same address and we will take care of it.
          </p>
        )}

        <h2 className="mt-6 text-[20px] font-bold text-ink">Refunds</h2>
        <p>
          Refunds are granted at our discretion. Our{" "}
          <Link href="/refund-policy" className="font-semibold text-blue-deep hover:underline">
            Refund Policy
          </Link>{" "}
          explains how to ask for one and what we look at.
        </p>

        <h2 className="mt-6 text-[20px] font-bold text-ink">Anything else</h2>
        <p>
          If you are not sure what you are paying for, or something is not
          working and you are thinking about leaving over it, write to us
          first at{" "}
          <a href="mailto:help@sortsoftware.com" className="font-semibold text-blue-deep hover:underline">
            help@sortsoftware.com
          </a>
          . We would rather fix it than lose you.
        </p>
      </div>
    </section>
  );
}
