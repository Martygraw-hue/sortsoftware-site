import type { Metadata } from "next";
import TermlyPolicy from "@/components/TermlyPolicy";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Which cookies and similar technologies Sort Software uses, and how to control them.",
};

// The Termly-hosted cookie policy behind the consent banner on this site
// (the same document sort-connect-site publishes at /cookie-policy).
const TERMLY_ID = "be0bb60f-b106-4b17-ba96-be3aae4302f5";

export default function CookiePolicy() {
  return (
    <section className="mx-auto max-w-[860px] px-6 pb-24 pt-12 lg:px-8 lg:pt-16">
      {/* sr-only H1: the Termly embed draws its own visual title but
          provides no native heading for the document outline */}
      <h1 className="sr-only">Cookie Policy</h1>
      <TermlyPolicy dataId={TERMLY_ID} />
    </section>
  );
}
