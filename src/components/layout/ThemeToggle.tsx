"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   Which icon shows is decided in CSS, not by a `mounted` flag.
   The server cannot know the visitor's theme, so gating on an
   effect means an empty button on first paint. Driving it from
   the same signals the palette uses — data-theme plus
   prefers-color-scheme — means the correct icon is there in the
   very first frame, with no flash and no layout shift.
   ============================================================ */

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  const toggle = () => {
    // resolvedTheme is authoritative once hydrated; before that, read
    // the live DOM so an early click still does the right thing.
    const current =
      resolvedTheme ??
      (document.documentElement.dataset.theme ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
    setTheme(current === "dark" ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light and dark theme"
      className={cn(
        "relative grid size-10 place-items-center rounded-full border border-line",
        "text-ink-secondary transition-colors duration-200",
        "hover:border-[var(--accent)] hover:text-[var(--accent)]",
        className,
      )}
    >
      <Sun className="theme-icon-light size-[17px]" />
      <Moon className="theme-icon-dark size-[17px]" />
    </button>
  );
}
