import Link from "next/link";

/**
 * Nav — minimal single-purpose header for sortsoftware.com. This is not a
 * marketing site (see components/Footer.tsx / app/layout.tsx notes), so
 * there's no multi-page menu — just the wordmark and a contact link.
 */
export default function Nav() {
  return (
    <header className="border-b border-line bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex h-20 max-w-[1000px] items-center justify-between px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Sort Software home"
          className="font-display text-[20px] font-bold tracking-tight text-ink"
        >
          SORT <span className="text-orange-text">Software</span>
        </Link>
        <a
          href="mailto:help@sortsoftware.com"
          className="btn rounded-full border border-line bg-paper px-5 py-2.5 text-[14.5px] font-semibold text-ink hover:border-blue-deep/40 hover:bg-blue-tint"
        >
          Contact
        </a>
      </div>
    </header>
  );
}
