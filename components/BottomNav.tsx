"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// --- Inline SVG icons (no external packages needed) ---
function IconBase(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden {...props} />;
}
const HomeIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <IconBase {...p}>
    <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </IconBase>
);
const UsersIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <IconBase {...p}>
    <circle cx="9" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <path d="M2.5 18a6.5 6.5 0 0 1 13 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </IconBase>
);
const MailIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <IconBase {...p}>
    <path d="M3 6h18v12H3z" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <path d="M3 7l9 6 9-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </IconBase>
);
const InfoIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <path d="M12 10v6m0-8V7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </IconBase>
);
const ShieldIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <IconBase {...p}>
    <path d="M12 3l7 3v6c0 4.5-3.5 7.5-7 9-3.5-1.5-7-4.5-7-9V6l7-3z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </IconBase>
);
const FileIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <IconBase {...p}>
    <path d="M7 3h7l4 4v14H7z" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <path d="M14 3v5h5" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </IconBase>
);

// --- Non-contact nav items ---
const NAV_ITEMS = [
  { href: "/", label: "sign up", Icon: HomeIcon },
  { href: "/friends", label: "friends", Icon: UsersIcon },
  { href: "/about", label: "about", Icon: InfoIcon },
  { href: "/privacy", label: "privacy", Icon: ShieldIcon },
  { href: "/terms", label: "terms", Icon: FileIcon },
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const [contactOpen, setContactOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const firstContactRef = useRef<HTMLAnchorElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  // Focus management, ESC-to-close, scroll lock, and focus trap
  useEffect(() => {
    if (!contactOpen) return;

    // Move focus into the sheet
    firstContactRef.current?.focus();

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input[type="text"]:not([disabled])',
      'input[type="email"]:not([disabled])',
      'input[type="search"]:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const getFocusables = () => {
      const container = sheetRef.current;
      if (!container) return [] as HTMLElement[];
      return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors))
        .filter(el => !el.hasAttribute("disabled") && el.tabIndex !== -1 && el.offsetParent !== null);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setContactOpen(false);
        return;
      }
      if (e.key === "Tab") {
        const focusables = getFocusables();
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (e.shiftKey) {
          if (active === first || !sheetRef.current?.contains(active)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    document.addEventListener("keydown", onKey);

    // Prevent background scrolling while sheet is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [contactOpen]);

  return (
    <>
      <nav
        role="navigation"
        aria-label="Primary"
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 border-t",
          "backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-neutral-900/70",
          "bg-white dark:bg-neutral-900"
        )}
      >
        <ul
          className={cn(
            "mx-auto grid max-w-screen-sm grid-cols-6",
            "h-16 items-center gap-1 px-2",
            "pb-[env(safe-area-inset-bottom)]"
          )}
        >
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
            return (
              <li key={href} className="h-full">
                <Link
                  href={href}
                  aria-label={label}
                  aria-current={active ? "page" : undefined}
                  title={label}
                  className={cn(
                    "group flex h-full flex-col items-center justify-center rounded-xl transition",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    "focus-visible:ring-black dark:focus-visible:ring-white",
                    "focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900",
                    active
                      ? "text-black dark:text-white"
                      : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
                  )}
                >
                  <Icon
                    aria-hidden="true"
                    className={cn(
                      "h-5 w-5 transition-transform motion-reduce:transition-none",
                      active && "motion-safe:scale-110"
                    )}
                  />
                  <span className={cn("text-[11px] leading-3 mt-1", active && "font-medium")}>{label}</span>
                </Link>
              </li>
            );
          })}

          {/* Contact button (opens sheet) */}
          <li className="h-full">
            <button
              type="button"
              aria-label="contact"
              title="contact"
              onClick={() => setContactOpen(true)}
              className={cn(
                "group flex h-full w-full flex-col items-center justify-center rounded-xl transition",
                "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                "focus-visible:ring-black dark:focus-visible:ring-white",
                "focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900"
              )}
            >
              <MailIcon aria-hidden="true" className="h-5 w-5" />
              <span className="text-[11px] leading-3 mt-1">contact</span>
            </button>
          </li>
        </ul>
      </nav>

      {contactOpen && (
        <div
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-label="Contact options"
          className="fixed inset-0 z-[60] flex items-end justify-center"
        >
          {/* Backdrop (behind the sheet) */}
          <div
            className="fixed inset-0 bg-black/40 z-0"
            aria-hidden="true"
            onClick={() => setContactOpen(false)}
          />

          {/* Sheet panel (above the backdrop) */}
          <div className="relative z-10 w-full max-w-screen-sm rounded-t-2xl bg-white p-4 shadow-lg dark:bg-neutral-900">
            <div className="mx-auto h-1 w-10 rounded-full bg-neutral-300/80 dark:bg-neutral-700/80 mb-3" />
            <h2 className="text-center text-base mb-2">contact playdate</h2>

            <div className="grid gap-2">
              <a
                ref={firstContactRef}
                tabIndex={0}
                href="mailto:support@todaysplaydate.com"
                className="rounded-lg border px-4 py-3 text-center hover:bg-neutral-50 dark:hover:bg-neutral-800"
                onClick={() => setContactOpen(false)}
              >
                Open email app
              </a>

              <button
                type="button"
                className="rounded-lg border px-4 py-3 text-center hover:bg-neutral-50 dark:hover:bg-neutral-800"
                onClick={() => {
                  const gmailScheme = "gmail://co?to=support@todaysplaydate.com";
                  const fallback = setTimeout(() => {
                    window.location.href =
                      "https://mail.google.com/mail/?view=cm&to=support@todaysplaydate.com";
                  }, 700);
                  // Attempt to open the app scheme
                  window.location.href = gmailScheme;
                  // Close shortly after
                  setTimeout(() => {
                    clearTimeout(fallback);
                    setContactOpen(false);
                  }, 800);
                }}
              >
                Open Gmail app
              </button>

              <a
                href="https://mail.google.com/mail/?view=cm&to=support@todaysplaydate.com"
                className="rounded-lg border px-4 py-3 text-center hover:bg-neutral-50 dark:hover:bg-neutral-800"
                onClick={() => setContactOpen(false)}
              >
                Open Gmail
              </a>

              <button
                type="button"
                className="rounded-lg border px-4 py-3 text-center hover:bg-neutral-50 dark:hover:bg-neutral-800"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText("support@todaysplaydate.com");
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  } catch {
                    window.location.href = "mailto:support@todaysplaydate.com";
                  }
                }}
              >
                {copied ? "Copied!" : "Copy email address"}
              </button>

              <button
                type="button"
                className="rounded-lg px-4 py-3 text-center underline opacity-80"
                onClick={() => setContactOpen(false)}
              >
                Cancel
              </button>

              <p className="text-center text-xs opacity-70 mt-1">
                {copied ? "Email address copied to clipboard." : "\u00A0"}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}



