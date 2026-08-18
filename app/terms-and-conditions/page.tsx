import type { Metadata } from "next";
import TermlyPolicy from "@/components/TermlyPolicy";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms that govern use of Sort Software's apps.",
};

// Same Termly-hosted document sort-connect-site uses.
const TERMLY_ID = "165afc0e-c456-4f78-a241-69ff6a02951c";

export default function TermsAndConditions() {
  return (
    <section className="mx-auto max-w-[860px] px-6 pb-24 pt-12 lg:px-8 lg:pt-16">
      {/* sr-only H1: the Termly embed draws its own visual title but
          provides no native heading for the document outline */}
      <h1 className="sr-only">Terms and Conditions</h1>
      <TermlyPolicy dataId={TERMLY_ID} />
    </section>
  );
}
