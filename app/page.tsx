import Image from "next/image";
import CalEmbed from "@/components/CalEmbed";
import FounderLetter from "@/components/story/FounderLetter";
import RoutingGame from "@/components/game/RoutingGame";

/**
 * sortsoftware.com — three fixed-height sections.
 *   1. The game    — one friendly header, then Right Person Routing you can play.
 *   2. The story   — Bill's letter to the operator reading it (FounderLetter).
 *   3. Contact     — a hello, the email, and the booking widget.
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
        <div className="mx-auto flex min-h-[calc(100svh-96px)] max-w-[1160px] items-center px-6 py-10 lg:px-8">
          <div className="w-full">
            <h1 className="mb-8 flex items-center justify-center gap-[0.28em] text-center text-[clamp(1.9rem,2.6vw+0.7rem,2.7rem)] font-bold leading-[1.1] lg:mb-10">
              <span>Take</span>
              <Image
                src="/brand/logo-black.png"
                alt="SORT"
                width={380}
                height={227}
                priority
                className="inline-block h-[2.1em] w-auto"
              />
              <span>for a spin</span>
            </h1>
            <RoutingGame />
          </div>
        </div>
      </section>

      {/* ---- 2. The story ---- */}
      <section id="story" className="scroll-mt-24 border-t border-line bg-surface">
        <div className="mx-auto flex min-h-[calc(100svh-96px)] max-w-[1100px] flex-col justify-center px-6 py-16 lg:px-8">
          <h2 className="mb-10 text-center text-[clamp(1.7rem,2.2vw+0.6rem,2.3rem)] font-bold leading-[1.12] lg:mb-12">
            Our Story
          </h2>
          <FounderLetter />
        </div>
      </section>

      {/* ---- 3. Contact ---- */}
      <section id="contact" className="scroll-mt-24 border-t border-line">
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
    </>
  );
}
