"use client";

import { useEffect, useRef } from "react";

/**
 * CalEmbed — Cal.com's official inline embed, ported from sort-connect-site
 * (minus its GA4 hook — this site runs no analytics by design). Visitors
 * pick a time and book right on the page; no redirect. `calLink` is the
 * Cal.com event path, e.g. "team/sortconnect/sort-how-it-works".
 */

type CalApi = {
  (...args: unknown[]): void;
  q?: unknown[];
  ns?: Record<string, CalApi>;
  loaded?: boolean;
};

declare global {
  interface Window {
    Cal?: CalApi;
  }
}

export default function CalEmbed({ calLink }: { calLink: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.childElementCount > 0) return;

    // Cal.com's official loader (their embed snippet, verbatim behavior)
    (function (C: Window, A: string, L: string) {
      const p = (a: CalApi, ar: unknown) => {
        a.q!.push(ar);
      };
      const d = C.document;
      C.Cal =
        C.Cal ||
        function (...args: unknown[]) {
          const cal = C.Cal as CalApi;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            const s = d.createElement("script");
            s.src = A;
            // Termly's auto-blocker neutralizes unclassified third-party
            // scripts until consent — the booking widget is a functional,
            // user-initiated embed, so mark it essential (never blocked)
            s.setAttribute("data-categories", "essential");
            d.head.appendChild(s);
            cal.loaded = true;
          }
          if (args[0] === L) {
            const api: CalApi = function (...apiArgs: unknown[]) {
              p(api, apiArgs);
            };
            const namespace = args[1];
            api.q = api.q || [];
            if (typeof namespace === "string") {
              cal.ns![namespace] = cal.ns![namespace] || api;
              p(cal.ns![namespace], args);
              p(cal, ["initNamespace", namespace]);
            } else p(cal, args);
            return;
          }
          p(cal, args);
        };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    // mirrors Cal.com's own generated embed snippet exactly
    const Cal = window.Cal! as CalApi & { config?: Record<string, unknown> };
    Cal("init", "30min", { origin: "https://app.cal.com" });
    Cal.config = Cal.config || {};
    Cal.config.forwardQueryParams = true;
    Cal.ns!["30min"]("inline", {
      elementOrSelector: el,
      config: { layout: "month_view", useSlotsViewOnSmallScreen: "true" },
      calLink,
    });
    Cal.ns!["30min"]("ui", {
      theme: "light", // always match the paper site, even for dark-mode visitors
      styles: { branding: { brandColor: "#407ec9" } },
      hideEventTypeDetails: false,
      layout: "month_view",
    });

    // a11y safeguard (WCAG 4.1.2): make sure the injected booking iframe has
    // an accessible name, since we don't control Cal.com's markup
    const observer = new MutationObserver(() => {
      el.querySelectorAll("iframe:not([title])").forEach((f) => {
        f.setAttribute("title", "Book a conversation — booking calendar");
      });
      // crop Cal's branding strip below the booker — the card's
      // overflow-hidden clips it. -85px is the one value that hides the
      // watermark on BOTH the month view and the taller booking-form view
      // without clipping the form's Confirm button. Belt and braces: the
      // same crop lives in globals.css (`.cal-card iframe.cal-embed`) so it
      // holds even when Cal's script rewrites the iframe's style attribute
      // after we've set it — the observer below also watches for that.
      el.querySelectorAll("iframe:not(.cal-fallback)").forEach((f) => {
        const st = (f as HTMLIFrameElement).style;
        if (st.getPropertyValue("margin-bottom") !== "-85px") {
          st.setProperty("margin-top", "0px", "important");
          st.setProperty("margin-bottom", "-85px", "important");
          st.setProperty("display", "block", "important");
        }
      });
    });
    observer.observe(el, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style"],
    });

    // FALLBACK: consent/script blockers (e.g. Termly's auto-block) can
    // neutralize Cal.com's embed.js — visitors would see an empty page. If no
    // iframe has appeared shortly after init, embed the booking page directly
    // as a plain iframe (blockers only intercept scripts, not iframes).
    const fallback = setTimeout(() => {
      if (el.querySelector("iframe") || el.dataset.calFallback) return;
      el.dataset.calFallback = "1";
      // The booking calendar is the section's core function (strictly
      // necessary, user-initiated) — it must not sit behind a consent
      // prompt. Blockers also intercept direct third-party iframes, so the
      // calendar loads inside a neutral srcdoc frame whose inner document
      // the blocker's observer never sees.
      const f = document.createElement("iframe");
      f.className = "cal-fallback";
      f.title = "Book a conversation — booking calendar";
      // Cal's direct booking page centers itself in the frame with chrome
      // around it. Desktop: an 800px inner viewport with the edges cropped
      // (-110 top / -200 bottom, measured live on production) shows exactly
      // the booker — no gray band, no branding strip. Phones keep the tall
      // stacked layout uncropped.
      const mobile = window.innerWidth < 768;
      const h = mobile ? 980 : 800;
      f.style.cssText = `width:100%;height:${h}px;border:0;display:block;`;
      if (!mobile) {
        f.style.setProperty("margin-top", "-110px", "important");
        f.style.setProperty("margin-bottom", "-200px", "important");
      }
      f.setAttribute(
        "srcdoc",
        `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;height:100%}iframe{width:100%;height:100%;border:0;display:block}</style></head><body><iframe src="https://app.cal.com/${calLink}?theme=light" title="Booking calendar"></iframe></body></html>`,
      );
      el.appendChild(f);
    }, 2500);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [calLink]);

  return (
    <div className="cal-card overflow-hidden rounded-2xl border border-line bg-surface shadow-frame">
      <div ref={ref} style={{ width: "100%" }} />
    </div>
  );
}
