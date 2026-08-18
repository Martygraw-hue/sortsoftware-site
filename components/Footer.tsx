import Link from "next/link";

/**
 * Footer — adapted from sort-connect-site's footer pattern but scoped down
 * to this site's own pages only (no sitewide sitemap links, since this
 * isn't a multi-page marketing site).
 */
export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-[1000px] px-6 py-14 lg:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div>
            <p className="font-display text-[18px] font-bold tracking-tight text-white">
              SORT Software
            </p>
            <p className="mt-3 max-w-[40ch] text-[15px] leading-relaxed text-white/70">
              Makers of the Sort and Admin apps.
            </p>
          </div>
          <div className="text-[15px] text-white/70">
            <p className="font-semibold text-white">Contact</p>
            <a
              href="mailto:help@sortsoftware.com"
              className="mt-2 block transition-colors hover:text-white"
            >
              help@sortsoftware.com
            </a>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-white/15 pt-6 text-[13px] text-white/50 md:flex-row md:justify-between">
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
