import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-[900px] px-6 pb-10 pt-16 lg:px-8 lg:pt-24">
        <p className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-orange-text">
          Sort Software
        </p>
        <h1 className="mt-3 max-w-[22ch] text-[34px] font-bold leading-[1.15] text-ink lg:text-[44px]">
          Streamlined small business communication, built from real experience running one.
        </h1>
        <p className="mt-5 max-w-[60ch] text-[17px] leading-relaxed text-ink-muted">
          Sort Software LLC builds Sort and Admin — a pair of apps that give
          small business owners and their teams one centralized place to
          manage information instead of losing it to scattered notes and
          sticky-note chaos.
        </p>
      </section>

      {/* Founder */}
      <section id="founder" className="mx-auto max-w-[900px] px-6 py-10 lg:px-8">
        <h2 className="text-[24px] font-bold text-ink">A message from Sort Founder — Bill Graw</h2>
        <div className="mt-6 rounded-2xl border border-line bg-surface p-8 shadow-frame">
          <div className="grid gap-4 text-[16px] leading-relaxed text-ink-muted">
            <p>
              I achieved my dream of being an entrepreneur with a diverse
              portfolio: a restaurant chain, a fleet of food trucks, a bison
              operation I ran from breeding to retail, and even a US patent.
              I tasted success, but it came at a cost — my time. I was
              drowning in the chaos of running multiple businesses.
            </p>
            <p>
              One evening, while frantically searching for my to-do list, I
              asked my wife for help. &ldquo;Was it on a blue piece of paper,
              written in sharpie?&rdquo; she inquired. &ldquo;Yes!&rdquo; I
              replied. Her response: &ldquo;It went through the wash.&rdquo;
              It was at that moment I realized there had to be a better way.
            </p>
            <p>
              Surprisingly, there was no solid app or system out there that
              really solved the problem of small businesses drowning in
              information. So, I decided to create it myself.
            </p>
            <p>
              The inspiration? Oddly, a graduate school lecture on the
              Second Law of Thermodynamics — the tendency towards increasing
              disorder, more commonly referred to as &ldquo;entropy.&rdquo;
              As crazy as it sounds, I saw the parallel between the
              universe&rsquo;s drift towards chaos and the daily chaos of
              running a small business. I set out to build a tool to
              conquer the daily entropy business owners face.
            </p>
            <p>The result was SORT.</p>
            <p>
              Today, that vision lives in the Sort and Admin apps, helping
              small business owners like me reclaim their time with a
              simple, effective way to manage everything. My employees love
              it too, enjoying a clear, easy-to-use standardized system.
            </p>
            <p>Let SORT work for you.</p>
            <p className="mt-2 font-semibold text-ink">Sincerely, Bill Graw</p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-[900px] px-6 py-16 lg:px-8">
        <h2 className="text-[24px] font-bold text-ink">Contact Us</h2>
        <p className="mt-3 max-w-[60ch] text-[16px] leading-relaxed text-ink-muted">
          Please fill out the form and a member of our team will get back to
          you, or email us directly at{" "}
          <a href="mailto:help@sortsoftware.com" className="font-semibold text-blue-deep hover:underline">
            help@sortsoftware.com
          </a>
          .
        </p>
        <div className="mt-8 max-w-[560px] rounded-2xl border border-line bg-surface p-8 shadow-frame">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
