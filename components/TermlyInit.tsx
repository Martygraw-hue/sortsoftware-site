"use client";

import { useEffect } from "react";

/**
 * TermlyInit — Termly's script injects its consent banner into <body> BEFORE
 * React hydrates; hydration then wipes that DOM and Termly never re-mounts
 * it, so no visitor ever saw the banner. Re-initialize once after mount.
 * (Ported from sort-connect-site — same trap applies here.)
 */
export default function TermlyInit() {
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const w = window as unknown as { Termly?: { initialize: () => void } };
        if (!document.getElementById("termly-code-snippet-support")) {
          w.Termly?.initialize();
        }
      } catch {
        /* never break the page over the consent banner */
      }
    }, 800);
    return () => clearTimeout(t);
  }, []);
  return null;
}
