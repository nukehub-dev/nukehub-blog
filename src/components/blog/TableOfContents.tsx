"use client";

import { useEffect, useState } from "react";
import { cn } from "@lib/utils";

interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface TableOfContentsProps {
  headings: Heading[];
  className?: string;
}

export function TableOfContents({ headings, className }: TableOfContentsProps) {
  const [activeSlug, setActiveSlug] = useState<string>("");

  // Only show h2 and h3 headings; skip the page title (h1).
  const tocHeadings = headings.filter((h) => h.depth >= 2 && h.depth <= 3);

  useEffect(() => {
    if (tocHeadings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target.id)
          .filter(Boolean);

        if (visible.length > 0) {
          setActiveSlug(visible[0]!);
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      },
    );

    tocHeadings.forEach((h) => {
      const el = document.getElementById(h.slug);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    slug: string,
  ) => {
    e.preventDefault();
    const el = document.getElementById(slug);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
      history.replaceState(null, "", `#${slug}`);
      setActiveSlug(slug);
    }
  };

  if (tocHeadings.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className={cn("hidden lg:block", className)}
    >
      <div className="max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          On this page
        </h2>
        <ul className="space-y-1 border-l border-border/50">
          {tocHeadings.map((h) => (
            <li key={h.slug} className={cn("pl-4", h.depth === 3 && "ml-3")}>
              <a
                href={`#${h.slug}`}
                onClick={(e) => handleClick(e, h.slug)}
                className={cn(
                  "block py-1 text-sm transition-colors",
                  "hover:text-foreground",
                  activeSlug === h.slug
                    ? "font-medium text-primary"
                    : "text-muted-foreground",
                )}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
