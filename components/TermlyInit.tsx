"use client";

import { useEffect } from "react";

/**
 * TermlyInit — two jobs.
 *
 * 1. Termly's script injects its consent banner into <body> BEFORE React
 *    hydrates; hydration then wipes that DOM and Termly never re-mounts it,
 *    so no visitor ever saw the banner. Re-initialize once after mount.
 *
 * 2. When a visitor withdraws analytics or advertising consent, Termly stops
 *    the Google tag from running again but leaves the cookies Google already
 *    set (_ga, _ga_*, _gid, _gcl_*) in place for their full lifetime. Expire
 *    them on our own domain so withdrawal really is withdrawal (Sept 2026
 *    compliance audit, M4).
 */

type Consent = { analytics?: boolean; advertising?: boolean };
type TermlyApi = {
  initialize: () => void;
  on?: (event: "consent", cb: (c: Consent) => void) => void;
  getConsentState?: () => Consent;
};

const GOOGLE_COOKIE = /^(_ga|_gid|_gat|_gcl)/;

function expireGoogleCookies() {
  const hosts = [location.hostname, "." + location.hostname.replace(/^www\./, "")];
  for (const raw of document.cookie.split(";")) {
    const name = raw.split("=")[0].trim();
    if (!GOOGLE_COOKIE.test(name)) continue;
    for (const domain of hosts) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
    }
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
}

function onConsent(c: Consent) {
  if (c && c.analytics === false && c.advertising === false) expireGoogleCookies();
}

export default function TermlyInit() {
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const w = window as unknown as { Termly?: TermlyApi };
        // skip if the banner survived (e.g., Termly fixes this upstream)
        if (!document.getElementById("termly-code-snippet-support")) {
          w.Termly?.initialize();
        }
        w.Termly?.on?.("consent", onConsent);
        const now = w.Termly?.getConsentState?.();
        if (now) onConsent(now);
      } catch {
        /* never break the page over the consent banner */
      }
    }, 800);
    return () => clearTimeout(t);
  }, []);
  return null;
}
