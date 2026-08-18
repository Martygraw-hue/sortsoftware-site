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
              <Link href="/#apps" className="mt-2 block transition-colors hover:text-white">
                Apps
              </Link>
              <Link href="/#story" className="mt-1.5 block transition-colors hover:text-white">
                Why SORT
              </Link>
              <Link href="/#founder" className="mt-1.5 block transition-colors hover:text-white">
                Founder
              </Link>
              <Link href="/#contact" className="mt-1.5 block transition-colors hover:text-white">
                Contact
              </Link>
            </div>
            <div className="text-[15px] text-white/70">
              <p className="font-semibold text-white">Reach us</p>
              <a
                href="mailto:help@sortsoftware.com"
                className="mt-2 block transition-colors hover:text-white"
              >
                help@sortsoftware.com
              </a>
              <a
                href="https://www.sortconnect.com"
                className="mt-1.5 block transition-colors hover:text-white"
              >
                sortconnect.com ↗
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/15 pt-6 text-[13px] text-white/50 md:flex-row md:justify-between">
          <p>&copy; {new Date().getFullYear()} SORTSOFTWARE LLC. All rights reserved.</p>
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <Link className="transition-colors hover:text-white" href="/privacy-policy">
              Privacy Policy
            </Link>
            <Link className="transition-colors hover:text-white" href="/terms-and-conditions">
              Terms &amp; Conditions
            </Link>
            <Link className="transition-colors hover:text-white" href="/refund-policy">
              Refund Policy
            </Link>
            <Link className="transition-colors hover:text-white" href="/security-policy">
              Security Policy
            </Link>
            {/* Termly's script turns this into the consent preference center */}
            <a href="#" className="termly-display-preferences transition-colors hover:text-white">
              Consent Preferences
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
