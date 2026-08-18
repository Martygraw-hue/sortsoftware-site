import Link from "next/link";
import Image from "next/image";

/**
 * Nav — floating pill in the family style of sortconnect.com, scoped to this
 * site's single-page structure: the SORT wordmark, four section anchors, and
 * one orange action out to the live product site.
 * Server component on purpose — no scroll listeners, no hamburger, no JS.
 */
const links = [
  { href: "/#apps", label: "Apps" },
  { href: "/#story", label: "Why SORT" },
  { href: "/#founder", label: "Founder" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-[60] px-4 pt-4 lg:px-6">
      <div className="mx-auto flex h-[64px] max-w-[1100px] items-center justify-between rounded-full border border-line bg-surface/95 pl-6 pr-3 shadow-frame backdrop-blur-sm">
        <Link href="/" aria-label="Sort Software home" className="shrink-0">
          <Image
            src="/brand/logo-crisp.png"
            alt="SORT"
            width={86}
            height={40}
            priority
            quality={95}
          />
        </Link>

        {/* quiet middle: section anchors */}
        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[15px] font-semibold text-ink-muted transition-colors duration-150 hover:text-blue-deep"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* loud right: out to the product site */}
        <a
          href="https://www.sortconnect.com"
          className="btn rounded-full bg-sort-orange px-5 py-2.5 text-[15px] font-semibold text-ink hover:bg-orange-deep"
        >
          Visit Us
          <span aria-hidden className="ml-1.5">↗</span>
        </a>
      </div>
    </header>
  );
}
