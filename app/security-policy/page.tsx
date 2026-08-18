import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Security Policy",
  description: "How Sort Software protects and secures your data.",
};

export default function SecurityPolicy() {
  return (
    <section className="mx-auto max-w-[760px] px-6 pb-24 pt-12 lg:px-8 lg:pt-16">
      <Link href="/" className="text-[14px] font-semibold text-blue-deep hover:underline">
        &larr; Back to home
      </Link>
      <h1 className="mt-6 text-[30px] font-bold text-ink">Sort Security Policy</h1>
      <div className="mt-6 grid gap-4 text-[16px] leading-relaxed text-ink-muted">
        <p>
          When using our Sort and Admin applications, our users trust us to
          keep their data secure, private, and available whenever they need
          it. We take that responsibility seriously.
        </p>

        <p>At SORT, we maintain a security system that:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>Prevents all unauthorized access.</li>
          <li>Supports continuous monitoring for potential vulnerabilities.</li>
          <li>
            Embraces ongoing, proactive improvement to stay on top of the
            latest security tools and threats.
          </li>
        </ul>

        <h2 className="mt-4 text-[20px] font-bold text-ink">Data Protection</h2>
        <p>
          We use MongoDB Atlas servers to save all user data, and make
          extensive use of their built-in firewalls to protect your data
          against unauthorized remote access. We use Amazon Web Services
          (AWS) servers to host the application; AWS&rsquo;s built-in
          firewall by default prevents access to the application server by
          unauthorized users. All user data is automatically backed up on
          AWS servers with multiple redundant copies.
        </p>

        <h2 className="mt-4 text-[20px] font-bold text-ink">Account Access</h2>
        <p>
          We verify account access through both email/password-based
          authentication and Google Accounts authentication via OAuth 2.0.
          When email/password-based authentication is used, we always store
          passwords with unique salts to add an extra layer of protection to
          your account. Alternatively, OAuth provides a seamless way to
          create and access your account without Sort Software ever needing
          to access or store your Google login credentials.
        </p>

        <h2 className="mt-4 text-[20px] font-bold text-ink">Data Privacy</h2>
        <p>
          We make it a priority to be transparent in how we collect, use,
          and handle your information when you use our website and
          software. Please see our full{" "}
          <Link href="/privacy-policy" className="font-semibold text-blue-deep hover:underline">
            Privacy Policy
          </Link>{" "}
          for more details.
        </p>

        <h2 className="mt-4 text-[20px] font-bold text-ink">Report a Vulnerability</h2>
        <p>
          If you discover any security vulnerability in Sort Software,
          please submit a report to{" "}
          <a href="mailto:help@sortsoftware.com" className="font-semibold text-blue-deep hover:underline">
            help@sortsoftware.com
          </a>{" "}
          and we&rsquo;ll do our best to fix it right away.
        </p>
      </div>
    </section>
  );
}
