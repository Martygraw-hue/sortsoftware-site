import Link from "next/link";

/**
 * Footer — dark band in the family style, kept minimal: brand + tagline,
 * the page's own sections, contact, and the legal/consent row.
 */
export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-[1100px] px-6 py-16 lg:px-8">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-start">
          <div>
            <p className="font-display text-[17px] font-bold tracking-tight text-white">
              SORT Software
            </p>
            <p className="mt-3 max-w-[42ch] text-[15px] leading-relaxed text-white/70">
              A small software company with one sworn enemy: entropy. Makers
              of the Sort and Admin apps.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 md:gap-14">
            <div className="text-[15px] text-white/70">
              <p className="font-semibold text-white">This site</p>
              <Link href="/#play" className="mt-2 block py-1.5 transition-colors hover:text-white">
                Play
              </Link>
              <Link href="/#contact" className="mt-1 block py-1.5 transition-colors hover:text-white">
                Contact
              </Link>
              <Link href="/#story" className="mt-1 block py-1.5 transition-colors hover:text-white">
                Our Story
              </Link>
                          </div>
            <div className="text-[15px] text-white/70">
              <p className="font-semibold text-white">Reach us</p>
              <a
                href="mailto:help@sortsoftware.com"
                className="mt-2 block py-1.5 transition-colors hover:text-white"
              >
                help@sortsoftware.com
              </a>
              <a href="tel:+13106141003" className="mt-1 block py-1.5 transition-colors hover:text-white">
                (310) 614-1003
              </a>
              <Link href="/contact-us" className="mt-1 block py-1.5 transition-colors hover:text-white">
                Contact Us
              </Link>
              <a
                href="https://www.sortconnect.com"
                className="mt-1 block py-1.5 transition-colors hover:text-white"
              >
                sortconnect.com ↗
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/15 pt-6 text-[13px] text-white/50 md:flex-row md:justify-between">
          <p className="py-1">&copy; {new Date().getFullYear()} SORT Software LLC. All rights reserved.</p>
          {/* Two balanced rows, matching sortconnect.com: one wrapping run
              stranded the last links on a line of their own, so the long
              "Do Not Sell" link anchors the second row instead. Subscriptions
              are managed at sortconnect.com/manage-plan, linked from the
              Refund Policy — this site does not carry its own copy. */}
          <div className="flex flex-col md:items-end">
            <p className="flex flex-wrap gap-x-4 md:justify-end">
              <Link className="inline-block py-1 transition-colors hover:text-white" href="/privacy-policy">
                Privacy Policy
              </Link>
              <Link className="inline-block py-1 transition-colors hover:text-white" href="/terms-and-conditions">
                Terms &amp; Conditions
              </Link>
              <Link className="inline-block py-1 transition-colors hover:text-white" href="/refund-policy">
                Refund Policy
              </Link>
              <Link className="inline-block py-1 transition-colors hover:text-white" href="/security-policy">
                Security Policy
              </Link>
            </p>
            <p className="flex flex-wrap gap-x-4 md:justify-end">
              <Link className="inline-block py-1 transition-colors hover:text-white" href="/cookie-policy">
                Cookie Policy
              </Link>
              <Link className="inline-block py-1 transition-colors hover:text-white" href="/accessibility">
                Accessibility
              </Link>
              <a
                href="https://app.termly.io/notify/7651ebbb-c43d-4714-a916-161bb76275f8"
                className="inline-block py-1 transition-colors hover:text-white"
              >
                Do Not Sell or Share My Personal Information
              </a>
              {/* Termly's script turns this into the consent preference center */}
              <a href="#" className="termly-display-preferences inline-block py-1 transition-colors hover:text-white">
                Consent Preferences
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
