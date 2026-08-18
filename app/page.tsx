import AppIcon from "@/components/AppIcon";
import CalEmbed from "@/components/CalEmbed";
import Confetti from "@/components/Confetti";
import EntropyGrid from "@/components/EntropyGrid";

/**
 * sortsoftware.com — the company behind SORT. One page, minimal system:
 *   Type scale (keep it to these):  eyebrow 13 · small 15 · body 17 ·
 *   H2 clamp(1.7-2.3rem) · H1 clamp(2.4-3.4rem)
 *   Color roles: ink/ink-muted on paper/surface, blue-deep for links + the
 *   dark band/card, sort-orange for actions + accents, orange-text for
 *   eyebrows on cream. Nothing else.
 */

// Cal.com event this site books against — currently the SORT Team collective
// event shared with sortconnect.com's /schedule page. Swap here if this site
// ever gets its own event.
const CAL_LINK = "team/sortconnect/sort-how-it-works";

const EYEBROW =
  "font-display text-[13px] font-bold uppercase tracking-[0.14em]";
const H1 =
  "text-[clamp(2.4rem,4vw+0.8rem,3.4rem)] font-bold leading-[1.08] tracking-[-0.01em]";
const H2 =
  "text-[clamp(1.7rem,2.2vw+0.6rem,2.3rem)] font-bold leading-[1.12]";

export default function Home() {
  return (
    <>
      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden">
        <Confetti />
        <div className="relative mx-auto grid max-w-[1100px] items-center gap-12 px-6 pb-20 pt-14 lg:grid-cols-[1fr_auto] lg:gap-16 lg:px-8 lg:pb-28 lg:pt-24">
          <div>
            <p className={`${EYEBROW} text-orange-text`}>
              Sort Software LLC · Makers of Sort &amp; Admin
            </p>
            <h1 className={`mt-4 max-w-[21ch] ${H1}`}>
              A small software company with one sworn enemy:{" "}
              <span className="mark-orange">entropy</span>.
            </h1>
            <p className="mt-6 max-w-[54ch] text-[17px] leading-relaxed text-ink-muted">
              We build Sort and Admin — the two apps behind{" "}
              <span className="font-semibold text-ink">SORT</span> — so the
              businesses that feed towns, fix pipes, and pour the morning
              coffee can run on order instead of chaos.
            </p>
            <div className="mt-9">
              <a
                href="#apps"
                className="btn inline-block rounded-full bg-sort-orange px-6 py-3.5 text-[15px] font-semibold text-ink hover:bg-orange-deep"
              >
                Meet the apps
              </a>
            </div>
          </div>

          {/* the signature move: disorder pulls itself into order, on repeat */}
          <div className="hidden lg:block">
            <EntropyGrid size={6} cell={38} dot={13} />
          </div>
        </div>
      </section>

      {/* ---- The apps ---- */}
      <section id="apps" className="scroll-mt-28 border-t border-line bg-surface">
        <div className="mx-auto max-w-[1100px] px-6 py-24 lg:px-8">
          <p className={`${EYEBROW} text-orange-text`}>The Apps</p>
          <h2 className={`mt-3 max-w-[24ch] ${H2}`}>
            Two apps. One system. <span className="mark-blue">SORT</span>.
          </h2>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {/* Sort — the front door */}
            <div className="flex flex-col rounded-[24px] border border-line bg-paper p-8 shadow-frame lg:p-10">
              <AppIcon variant="sort" />
              <p className={`mt-6 ${EYEBROW} text-orange-text`}>
                For your people
              </p>
              <h3 className={`mt-1.5 ${H2}`}>Sort</h3>
              <p className="mt-3 text-[17px] leading-relaxed text-ink-muted">
                The front door. Employees and customers send requests,
                updates, and questions through clean, structured forms — from
                any phone, in seconds, no training required. Nothing
                scribbled, nothing shouted across the kitchen, nothing lost.
              </p>
              <div className="mt-auto flex items-center gap-2.5 pt-7">
                <span className="ss-pulse inline-block h-2.5 w-2.5 rounded-full bg-sort-orange" />
                <span className="text-[15px] font-semibold text-ink">
                  On the App Store
                </span>
              </div>
            </div>

            {/* Admin — the command center */}
            <div className="flex flex-col rounded-[24px] bg-blue-deep p-8 text-white shadow-frame lg:p-10">
              <AppIcon variant="admin" />
              <p className={`mt-6 ${EYEBROW} text-sort-orange`}>For you</p>
              <h3 className={`mt-1.5 ${H2} text-white`}>Admin</h3>
              <p className="mt-3 text-[17px] leading-relaxed text-white/80">
                The command center. Every submission lands sorted on one
                dashboard — see it, assign it, resolve it, and keep a clean
                record of the whole thing without chasing a single person
                down. Your operation, one screen.
              </p>
              <div className="mt-auto flex items-center gap-2.5 pt-7">
                <span className="ss-pulse inline-block h-2.5 w-2.5 rounded-full bg-sort-orange" />
                <span className="text-[15px] font-semibold text-white">
                  On the App Store
                </span>
              </div>
            </div>
          </div>

          <p className="mt-8 text-[15px] text-ink-muted">
            Together they run Right Person Routing — every submission straight
            to the one person who can act on it. The full story lives at{" "}
            <a
              href="https://www.sortconnect.com"
              className="font-semibold text-blue-deep underline-offset-4 hover:underline"
            >
              sortconnect.com
            </a>
            .
          </p>
        </div>
      </section>

      {/* ---- Why SORT — the lore band ---- */}
      <section id="story" className="scroll-mt-28 bg-blue-deep text-white">
        <div className="mx-auto grid max-w-[1100px] items-center gap-12 px-6 py-24 lg:grid-cols-[1fr_auto] lg:gap-16 lg:px-8">
          <div>
            <p className={`${EYEBROW} text-sort-orange`}>Why SORT</p>
            <h2 className={`mt-3 max-w-[24ch] ${H2} text-white`}>
              It all began with a to-do list and a washing machine.
            </h2>
            <p className="mt-6 max-w-[58ch] text-[17px] leading-relaxed text-white/80">
              Our founder ran restaurants, food trucks, and a bison operation
              at the same time — and kept it all on scraps of paper. One of
              them, the important one, went through the laundry. What survived
              the spin cycle was an idea from a graduate physics lecture: the
              Second Law of Thermodynamics. Every system drifts toward
              disorder —{" "}
              <em className="not-italic font-semibold text-white">
                unless you put energy in
              </em>
              .
            </p>
            <p className="mt-4 max-w-[58ch] text-[17px] leading-relaxed text-white/80">
              Sort is that energy, bottled for small business. It&rsquo;s in
              the name: things come in scattered, and they leave{" "}
              <span className="font-semibold text-sort-orange">sorted</span>.
            </p>
            <a
              href="#founder"
              className="mt-8 inline-block text-[15px] font-semibold text-white underline-offset-4 hover:underline"
            >
              Read the whole story, in Bill&rsquo;s words ↓
            </a>
          </div>
          <div className="hidden lg:block">
            <EntropyGrid size={5} cell={36} dot={12} tone="dark" />
          </div>
        </div>
      </section>

      {/* ---- From the founder ---- */}
      <section id="founder" className="scroll-mt-28">
        <div className="mx-auto max-w-[900px] px-6 py-24 lg:px-8">
          <p className={`${EYEBROW} text-orange-text`}>From the Founder</p>
          <div className="relative mt-8 rounded-[24px] border border-line bg-surface p-8 shadow-frame lg:p-12">
            <span
              aria-hidden
              className="absolute -top-7 left-8 font-display text-[88px] font-bold leading-none text-sort-orange"
            >
              &ldquo;
            </span>
            <div className="grid gap-4 text-[17px] leading-relaxed text-ink-muted">
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
                running a small business. I set out to build a tool to conquer
                the daily entropy business owners face.
              </p>
              <p className="font-semibold text-ink">The result was SORT.</p>
              <p>
                Today, that vision lives in the Sort and Admin apps, helping
                small business owners like me reclaim their time with a
                simple, effective way to manage everything. My employees love
                it too, enjoying a clear, easy-to-use standardized system.
              </p>
              <p>Let SORT work for you.</p>
            </div>
            <p className="mt-7 flex items-center gap-3 font-display text-[17px] font-bold text-ink">
              <span
                aria-hidden
                className="inline-block h-[3px] w-9 rounded-full bg-sort-orange"
              />
              Bill Graw
              <span className="text-[15px] font-semibold text-ink-muted">
                Founder &amp; CEO
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ---- Contact / booking ---- */}
      <section id="contact" className="scroll-mt-28 border-t border-line bg-surface">
        <div className="mx-auto max-w-[1100px] px-6 py-24 lg:px-8">
          <p className={`${EYEBROW} text-orange-text`}>Contact</p>
          <h2 className={`mt-3 max-w-[20ch] ${H2}`}>Book a conversation.</h2>
          <p className="mt-5 max-w-[54ch] text-[17px] leading-relaxed text-ink-muted">
            Pick a time below and it books straight with the team. Prefer
            email? Write to{" "}
            <a
              href="mailto:help@sortsoftware.com"
              className="font-semibold text-blue-deep underline-offset-4 hover:underline"
            >
              help@sortsoftware.com
            </a>{" "}
            — we answer these ourselves.
          </p>
          <div className="mt-10">
            <CalEmbed calLink={CAL_LINK} />
          </div>
        </div>
      </section>
    </>
  );
}
