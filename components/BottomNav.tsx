"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Users, Send, Settings } from "lucide-react";
import { cn } from "@/lib/utils"; // We'll add this helper next if you don't have it.

const ITEMS = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/today", label: "Today", Icon: Sparkles },
  { href: "/friends", label: "Friends", Icon: Users },
  { href: "/invite", label: "Invite", Icon: Send },
  { href: "/settings", label: "Settings", Icon: Settings },
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
        "bg-white dark:bg-neutral-900 md:hidden" // hide on md+ if you prefer a different layout there
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
                <Icon aria-hidden className={cn("h-5 w-5", active && "scale-110")} />
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

