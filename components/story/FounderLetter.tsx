import Image from "next/image";

/**
 * FounderLetter — Bill's letter to the operator reading it, set like a page.
 * A byline letterhead runs across the top (Bill's round portrait and name on
 * the left, "A letter from the founder" + the SORT mark on the right, orange
 * rule), the
 * letter runs in two columns beneath it, and the blue Sharpie to-do list
 * lies beside the paragraph that tells its story, text wrapping around it.
 * "The result was SORT." is semibold with SORT in blue; the letter signs off
 * with "Let SORT work for you," above the signature. No motion.
 */

export default function FounderLetter() {
  return (
    <div>
      {/* ---- letterhead: byline left, SORT mark right ---- */}
      <div className="mb-7 flex items-center justify-between gap-6 border-b-[2.5px] border-sort-orange pb-4">
        <div className="flex items-center gap-3.5">
          <Image
            src="/team/bill-graw.png"
            alt="Bill Graw, founder of SORT"
            width={220}
            height={220}
            className="h-16 w-16 rounded-full object-cover object-top"
            priority={false}
          />
          <div className="leading-none">
            <p className="text-[16px] font-bold text-ink">Bill Graw</p>
            <p className="mt-1.5 text-[12.5px] font-semibold uppercase tracking-[0.06em] text-ink-muted">
              Founder
            </p>
          </div>
        </div>
        <div className="flex items-end gap-4">
          <span className="hidden pb-1 font-display text-[11.5px] font-bold uppercase tracking-[0.18em] text-ink-muted sm:inline">
            A letter from the founder
          </span>
          <Image
            src="/brand/logo-crisp.png"
            alt="SORT"
            width={654}
            height={304}
            className="h-[34px] w-auto"
          />
        </div>
      </div>

      {/* ---- the letter: salutation on its own row, then two justified,
              hyphenated columns whose tops line up ---- */}
      <p className="mb-5 text-[17px] leading-[1.7] text-ink">Dear Operator,</p>
      <div className="text-justify text-[17px] leading-[1.7] text-ink [hyphens:auto] [text-wrap:pretty] [&_p+p]:mt-5 lg:columns-2 lg:gap-x-14">
        <p className="break-inside-avoid">
          I achieved my dream of being an entrepreneur with a diverse portfolio:
          a restaurant chain, a fleet of food trucks, a bison operation I ran from
          breeding to retail, and even a U.S. patent. I tasted success, but it
          came at a cost: my time. I was drowning in the chaos of running
          multiple businesses.
        </p>
        {/* the blue note lies beside the story of the note — the closing lines
            of this paragraph wrap around it */}
        <Image
          src="/story/note-2.png"
          alt=""
          aria-hidden="true"
          width={1024}
          height={1024}
          className="float-right mb-1 ml-4 mt-7 h-[140px] w-[140px] -rotate-3 translate-x-5 drop-shadow-[0_10px_18px_rgba(26,29,33,0.14)] [shape-outside:margin-box] lg:h-[160px] lg:w-[160px]"
        />
        <p className="!mt-5 break-inside-avoid">
          One evening, while frantically searching for my to&#8209;do list, I asked
          my wife for help. &ldquo;Was it on a blue piece of paper, written in
          Sharpie?&rdquo; she asked. &ldquo;Yes!&rdquo; I replied. Her response:{" "}
          &ldquo;It went through the wash.&rdquo; It was at that moment I realized
          there had to be a better way.
        </p>
        <p className="break-inside-avoid">
          Surprisingly, there&rsquo;s no solid app or system out there that really
          solves the problem of small businesses drowning in information. So I
          decided to create it myself.
        </p>
        <p className="break-inside-avoid">
          The inspiration? Oddly, a graduate school lecture on the{" "}
          <em>Second Law of Thermodynamics</em>, the tendency toward
          increasing disorder, more commonly known as entropy. As crazy as it
          sounds, I saw the parallel between the universe&rsquo;s drift toward
          chaos and the daily chaos of running a small business. I set out to
          build a tool to conquer the daily entropy business owners face.
        </p>
        <p className="break-inside-avoid font-semibold">
          The result was <span className="font-bold text-blue-deep">SORT</span>.
        </p>

        <p className="break-inside-avoid">
          Now, SORT helps small business owners like me reclaim their lives,
          providing a simple, effective way to manage everything. My employees
          love it too, enjoying a clear, easy&#8209;to&#8209;use standardized
          system.
        </p>
        <p className="break-inside-avoid text-left">Let SORT work for you,</p>
        <p className="break-inside-avoid !mt-2">
          <Image
            src="/team/bill-signature.png"
            alt="Bill Graw"
            width={396}
            height={144}
            className="h-[54px] w-auto"
          />
        </p>
      </div>
    </div>
  );
}
