import Image from "next/image";

/**
 * FounderLetter — Bill's letter to the operator reading it.
 * Left: headshot, caption, the blue Sharpie to-do list.
 * Right: the letter, signed. Fixed-height section on desktop.
 */

export default function FounderLetter() {
  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-16">
      {/* ---- left: Bill + the note ---- */}
      <div className="flex flex-col items-center gap-6 lg:items-start">
        <div className="text-center lg:text-left">
          <Image
            src="/team/bill-graw.png"
            alt="Bill Graw, founder of SORT"
            width={220}
            height={220}
            className="mx-auto h-[200px] w-[200px] rounded-[18px] object-cover object-top lg:mx-0 lg:h-[220px] lg:w-[220px]"
            priority={false}
          />
          <p className="mx-auto mt-4 w-[200px] text-center text-[17px] font-bold leading-none text-ink lg:w-[220px]">
            Founder <span className="text-sort-orange">&bull;</span> Bill Graw
          </p>
        </div>

        {/* the blue note */}
        <Image
          src="/story/note-2.png"
          alt=""
          aria-hidden="true"
          width={1024}
          height={1024}
          className="mt-4 h-[190px] w-[190px] lg:ml-[15px]"
        />
      </div>

      {/* ---- right: the letter ---- */}
      <div className="max-w-[640px] text-[15.5px] leading-[1.6] text-ink [&_p+p]:mt-4">
        <p>Dear operator,</p>
        <p>
          I achieved my dream of being an entrepreneur with a diverse portfolio:
          a restaurant chain, a fleet of food trucks, a bison operation I ran from
          breeding to retail, and even a U.S. patent. I tasted success, but it
          came at a cost &mdash; my time. I was drowning in the chaos of running
          multiple businesses.
        </p>
        <p>
          One evening, while frantically searching for my to&#8209;do list, I asked
          my wife for help. &ldquo;Was it on a blue piece of paper, written in
          Sharpie?&rdquo; she asked. &ldquo;Yes!&rdquo; I replied. Her response:
          &ldquo;It went through the wash.&rdquo; It was at that moment I realized
          there had to be a better way.
        </p>
        <p>
          Surprisingly, there&rsquo;s no solid app or system out there that really
          solves the problem of small businesses drowning in information. So I
          decided to create it myself.
        </p>
        <p>
          The inspiration? Oddly, a graduate school lecture on the{" "}
          <em>Second Law of Thermodynamics</em> &mdash; the tendency toward
          increasing disorder, more commonly known as entropy. As crazy as it
          sounds, I saw the parallel between the universe&rsquo;s drift toward
          chaos and the daily chaos of running a small business. I set out to
          build a tool to conquer the daily entropy business owners face.
        </p>
        <p className="font-bold">The result was SORT.</p>
        <p>
          Now, SORT helps small business owners like me reclaim their lives,
          providing a simple, effective way to manage everything. My employees
          love it too, enjoying a clear, easy&#8209;to&#8209;use standardized
          system.
        </p>
        <p>Let SORT work for you.</p>
        <p>Sincerely,</p>
        <p className="!mt-3">
          <Image
            src="/team/bill-signature.png"
            alt="Bill Graw"
            width={396}
            height={144}
            className="h-[44px] w-auto"
          />
        </p>
      </div>
    </div>
  );
}
