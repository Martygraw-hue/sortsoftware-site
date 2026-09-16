import type { Metadata } from "next";

/**
 * /contact-us — the SORT contact form, embedded from the app.
 *
 * The form is built and owned in SORT (app.sortsoftware.com); this page is
 * only the frame around it. If the form ever moves, FORM_SRC is the only
 * thing to change, and the same page on the other site needs the same edit.
 *
 * Height: the embedded page lays out to its own viewport, so the iframe's
 * height IS the form's viewport — too short and the form scrolls inside its
 * box, which is what we are avoiding. The form card is a fixed 700x580 and
 * does not grow with width, so on wide screens the content settles around
 * 780px; narrower screens stack the Topic pair and the card shrinks, so it
 * needs more. These heights are set generously from that measurement. Scroll
 * is deliberately left available rather than hidden: empty space at the
 * bottom is harmless, an unreachable Submit button is not.
 */
const FORM_SRC = "https://app.sortsoftware.com/form-preview?id=6aaafe2eff2b609b91a6bc93";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Sort Software. Tell us what you need and we will get back to you.",
};

export default function ContactUs() {
  return (
    <section className="mx-auto max-w-[900px] px-6 pb-24 pt-12 lg:px-8 lg:pt-16">
      <h1 className="text-[clamp(2rem,3.5vw+0.75rem,3rem)] font-bold leading-[1.1] tracking-[-0.01em]">
        Contact Us
      </h1>
      <p className="mt-4 max-w-[60ch] text-[17px] leading-relaxed text-ink">
        Tell us what you need and we will get back to you. You can also call us
        at{" "}
        <a
          href="tel:+13106141003"
          className="font-semibold text-blue-deep underline underline-offset-4"
        >
          (310) 614-1003
        </a>{" "}
        or email{" "}
        <a
          href="mailto:help@sortsoftware.com"
          className="font-semibold text-blue-deep underline underline-offset-4"
        >
          help@sortsoftware.com
        </a>
        .
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface">
        <iframe
          src={FORM_SRC}
          /* Termly's AutoBlocker holds back third-party frames until the
             visitor accepts cookies, which left this page empty for anyone
             who had not. The form is SORT's own, carries no advertising or
             analytics cookies, and the page does not work without it, so it
             is classified essential and allowed through pre-consent. */
          data-categories="essential"
          title="Sort Software contact form"
          loading="lazy"
          className="block h-[1060px] w-full border-0 sm:h-[900px] lg:h-[800px]"
        />
      </div>
    </section>
  );
}
