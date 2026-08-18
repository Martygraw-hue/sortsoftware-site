"use client";

import { useEffect, useRef } from "react";

/**
 * TermlyPolicy — renders a Termly-hosted legal document inline via Termly's
 * official embed script. Ported from sort-connect-site so this site shows
 * the exact same live-managed policy rather than a stale duplicate.
 */
export default function TermlyPolicy({ dataId }: { dataId: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://app.termly.io/embed-policy.min.js";
    s.async = true;
    document.body.appendChild(s);

    const el = ref.current;
    const observer = new MutationObserver(() => {
      el?.querySelectorAll('[role="progressbar"]:not([aria-label])').forEach(
        (p) => p.setAttribute("aria-label", "Loading policy document"),
      );
    });
    if (el) observer.observe(el, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      s.remove();
    };
  }, [dataId]);

  return <div ref={ref} {...{ name: "termly-embed" }} data-id={dataId} />;
}
