"use client";

import { useState } from "react";

/**
 * ContactForm — builds a mailto: link client-side and hands off to the
 * visitor's own mail client. No backend/API keys exist for this site, so
 * this mirrors the old Wix site's approach rather than silently dropping
 * submissions.
 */
export default function ContactForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Website inquiry from ${firstName} ${lastName}`);
    const body = encodeURIComponent(
      `Name: ${firstName} ${lastName}\nEmail: ${email}\n\n${message}`,
    );
    window.location.href = `mailto:help@sortsoftware.com?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <label htmlFor="firstName" className="text-[14px] font-semibold text-ink">
            First name*
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="rounded-lg border border-field-border bg-surface px-3.5 py-2.5 text-[15px] text-ink outline-none focus-visible:border-blue-deep"
          />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="lastName" className="text-[14px] font-semibold text-ink">
            Last name*
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="rounded-lg border border-field-border bg-surface px-3.5 py-2.5 text-[15px] text-ink outline-none focus-visible:border-blue-deep"
          />
        </div>
      </div>
      <div className="grid gap-1.5">
        <label htmlFor="email" className="text-[14px] font-semibold text-ink">
          Email*
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-field-border bg-surface px-3.5 py-2.5 text-[15px] text-ink outline-none focus-visible:border-blue-deep"
        />
      </div>
      <div className="grid gap-1.5">
        <label htmlFor="message" className="text-[14px] font-semibold text-ink">
          In a few words, how can we help you today?
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="rounded-lg border border-field-border bg-surface px-3.5 py-2.5 text-[15px] text-ink outline-none focus-visible:border-blue-deep"
        />
      </div>
      <button
        type="submit"
        className="btn w-fit rounded-full bg-sort-orange px-6 py-3 text-[15px] font-semibold text-ink hover:bg-orange-deep"
      >
        Send
      </button>
    </form>
  );
}
