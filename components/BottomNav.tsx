"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// --- Inline SVG icons (no external packages needed) ---
function IconBase(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden {...props} />
  );
}

function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path
        d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </IconBase>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path
        d="M12 3l1.6 3.9L18 8.5l-3.9 1.6L12 14 10.4 10.1 6.5 8.5l3.9-1.6L12 3Zm7 9l.9 2.2 2.1.9-2.1.9L19 18l-.9-2.2-2.1-.9 2.1-.9.9-2.2ZM4 13l.9 2.2 2.1.9-2.1.9L4 19l-.9-2.2L1 16.1l2.1-.9L4 13Z"
        fill="currentColor"
      />
    </IconBase>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <circle cx="9" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M2.5 18a6.5 6.5 0 0 1 13 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="17" cy="9" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M14.5 18a5.5 5.5 0 0 1 7 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </IconBase>
  );
}

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path
        d="M21 3L3.8 10.6a.8.8 0 0 0 .1 1.5L11 14l1.9 7.1a.8.8 0 0 0 1.5.1L21 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </IconBase>
  );
}

function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path
        d="M12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M19.4 12a7.4 7.4 0 0 0-.1-1l2-1.6-2-3.4-2.4.9a7.6 7.6 0 0 0-.9-.5l-.4-2.6H10l-.4 2.6a7.6 7.6 0 0 0-.9.5L6.3 5.9l-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2l-2 1.6 2 3.4 2.4-.9c.3.2.6.4.9.5l.4 2.6h4.6l.4-2.6c.3-.1.6-.3.9-.5l2.4.9 2-3.4-2-1.6c.1-.3.1-.6.1-1Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </IconBase>
  );
}

// --- Nav items config (uses the inline icons above) ---
const ITEMS = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/today", label: "Today", Icon: SparklesIcon },
  { href: "/friends", label: "Friends", Icon: UsersIcon },
  { href: "/invite", label: "Invite", Icon: SendIcon },
  { href: "/settings", label: "Settings", Icon: SettingsIcon },
] as const;

export default function BottomNav({
  hiddenPaths = ["/i/"], // hides on friend-facing invite pages by default
}: {
  hiddenPaths?: string[];
}) {
  const pathname = usePathname();

  // Hide if current route matches any prefix in hiddenPaths
  if (hiddenPaths?.some((p) => pathname?.startsWith(p))) return null;

  return (
    <nav
      role="navigation"
      aria-label="Primary"
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t",
        "backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-neutral-900/70",
        "bg-white dark:bg-neutral-900 md:hidden"
      )}
    >
      <ul
        className={cn(
          "mx-auto grid max-w-screen-sm grid-cols-5",
          "h-16 items-center gap-1 px-2",
          "pb-[env(safe-area-inset-bottom)]"
        )}
      >
        {ITEMS.map(({ href, label, Icon }) => {
          const active =
            pathname === href || (href !== "/" && pathname?.startsWith(href));
          return (
            <li key={href} className="h-full">
              <Link
                href={href}
                aria-label={label}
                className={cn(
                  "group flex h-full flex-col items-center justify-center rounded-xl transition",
                  active
                    ? "text-black dark:text-white"
                    : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
                )}
              >
                <Icon className={cn("h-5 w-5", active && "scale-110")} />
                <span className={cn("text-[11px] leading-3 mt-1", active && "font-medium")}>
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}



