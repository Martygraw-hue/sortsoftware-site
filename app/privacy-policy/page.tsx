import type { Metadata } from "next";
import TermlyPolicy from "@/components/TermlyPolicy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Sort Software collects, uses, and protects your information.",
};

// Same Termly-hosted document sort-connect-site uses — Sort Software LLC's
// privacy policy is a single company-wide document, not per-product.
const TERMLY_ID = "7651ebbb-c43d-4714-a916-161bb76275f8";

export default function PrivacyPolicy() {
  return (
    <section className="mx-auto max-w-[860px] px-6 pb-24 pt-12 lg:px-8 lg:pt-16">
      {/* sr-only H1: the Termly embed draws its own visual title but
          provides no native heading for the document outline */}
      <h1 className="sr-only">Privacy Policy</h1>
      <TermlyPolicy dataId={TERMLY_ID} />
    </section>
  );
}
