import CalEmbed from "@/components/CalEmbed";
import FounderLetter from "@/components/story/FounderLetter";
import RoutingGame from "@/components/game/RoutingGame";

/**
 * sortsoftware.com — three sections (Play and Contact fill the viewport; the story hugs its letter).
 *   1. The game    — one friendly header, then Right Person Routing you can play.
 *   2. Contact     — a hello, the email, and the booking widget.
 *   3. The story   — Bill's letter to the operator reading it (FounderLetter);
 *                     hugs its content, no viewport-height floor. Last on the page.
 * Company name, the two apps, the support address, and the legal links live
 * in the footer (the Apple floor). Everything else was cut on purpose.
 */

// Cal.com event this site books against — the SORT Team collective event
// shared with sortconnect.com's /schedule page.
const CAL_LINK = "team/sortconnect/sort-how-it-works";

export default function Home() {
  return (
    <>
      {/* ---- 1. The game ---- */}
      <section id="play" className="scroll-mt-24">
        <div className="mx-auto flex min-h-[calc(100svh-96px)] max-w-[1280px] items-start px-6 pb-10 pt-9 lg:px-8 lg:pt-12">
          <div className="w-full">
            <RoutingGame />
          </div>
        </div>
      </section>

      {/* ---- 2. Contact ---- */}
      <section id="contact" className="scroll-mt-24 border-t border-line bg-surface">
        <div className="mx-auto max-w-[1160px] px-6 py-20 lg:px-8 lg:py-24">
          <h2 className="text-center text-[clamp(1.7rem,2.2vw+0.6rem,2.3rem)] font-bold leading-[1.12]">
            Hey, let&rsquo;s chat.
          </h2>
          <p className="mt-3 text-center text-[16.5px]">
            <a
              href="mailto:help@sortsoftware.com"
              className="font-semibold text-blue-deep underline-offset-4 hover:underline"
            >
              help@sortsoftware.com
            </a>
          </p>
          <div className="mt-10">
            <CalEmbed calLink={CAL_LINK} />
          </div>
        </div>
      </section>
      {/* ---- 3. The story ---- */}
      <section id="story" className="scroll-mt-24 border-t border-line">
        <div className="mx-auto max-w-[1160px] px-6 py-16 lg:px-8 lg:py-20">
          <h2 className="sr-only">Our Story</h2>
          <FounderLetter />
        </div>
      </section>

    </>
  );
}
