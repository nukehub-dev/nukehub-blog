"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Command,
  ArrowUpRight,
  FileText,
  User,
  Tags,
  Home,
  ExternalLink,
} from "lucide-react";
import { cn } from "@lib/utils";
import { useFocusTrap } from "@lib/useFocusTrap";

export interface SearchablePost {
  id: string;
  title: string;
  description?: string;
  url: string;
  category: string;
  categoryLabel: string;
  tags: string[];
  date: string;
  authorName?: string;
}

export interface SearchableAuthor {
  id: string;
  name: string;
  role?: string;
  organization?: string;
  url: string;
}

export interface SearchableCategory {
  id: string;
  title: string;
  description?: string;
  url: string;
}

export interface SearchablePage {
  id: string;
  title: string;
  url: string;
  external?: boolean;
}

type SearchItem =
  | { type: "post"; data: SearchablePost }
  | { type: "author"; data: SearchableAuthor }
  | { type: "category"; data: SearchableCategory }
  | { type: "page"; data: SearchablePage };

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  posts: SearchablePost[];
  authors: SearchableAuthor[];
  categories: SearchableCategory[];
  pages: SearchablePage[];
}

const categoryOrder = ["post", "author", "category", "page"];

const categoryLabels: Record<string, string> = {
  post: "Posts",
  author: "Authors",
  category: "Categories",
  page: "Pages",
};

const categoryIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  post: FileText,
  author: User,
  category: Tags,
  page: Home,
};

function getItemTitle(item: SearchItem): string {
  if (item.type === "author") return item.data.name;
  return item.data.title;
}

function getItemSubtitle(item: SearchItem): string {
  if (item.type === "post") {
    const parts = [
      item.data.categoryLabel,
      item.data.authorName,
      new Date(item.data.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    ].filter(Boolean);
    return parts.join(" · ");
  }
  if (item.type === "author") {
    return [item.data.role, item.data.organization].filter(Boolean).join(" · ");
  }
  if (item.type === "category") {
    return item.data.description || "";
  }
  return "";
}

function getItemUrl(item: SearchItem): string {
  return item.data.url;
}

function scoreItem(item: SearchItem, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 1;

  const title = getItemTitle(item).toLowerCase();
  const subtitle = getItemSubtitle(item).toLowerCase();

  let score = 0;
  if (title.startsWith(q)) score += 100;
  else if (title.includes(q)) score += 50;

  if (subtitle.includes(q)) score += 20;

  if (item.type === "post") {
    const tags = item.data.tags.join(" ").toLowerCase();
    if (tags.includes(q)) score += 30;
    if (item.data.description?.toLowerCase().includes(q)) score += 20;
  }

  if (item.type === "author" && item.data.name.toLowerCase().includes(q)) {
    score += 10;
  }

  return score;
}

function groupItems(items: SearchItem[]): [string, SearchItem[]][] {
  const grouped = new Map<string, SearchItem[]>();
  for (const item of items) {
    const list = grouped.get(item.type) || [];
    list.push(item);
    grouped.set(item.type, list);
  }

  return categoryOrder
    .map((type) => [type, grouped.get(type) || []])
    .filter(([, list]) => list.length > 0) as [string, SearchItem[]][];
}

export function CommandPalette({
  isOpen,
  onClose,
  posts,
  authors,
  categories,
  pages,
}: CommandPaletteProps) {
  const [mounted, setMounted] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);
  const modalRef = useFocusTrap<HTMLDivElement>(isOpen);

  React.useEffect(() => setMounted(true), []);

  const allItems = React.useMemo<SearchItem[]>(
    () => [
      ...posts.map((data) => ({ type: "post" as const, data })),
      ...authors.map((data) => ({ type: "author" as const, data })),
      ...categories.map((data) => ({ type: "category" as const, data })),
      ...pages.map((data) => ({ type: "page" as const, data })),
    ],
    [posts, authors, categories, pages],
  );

  const filteredItems = React.useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 12);
    return allItems
      .map((item) => ({ item, score: scoreItem(item, query) }))
      .filter(({ score }) => score > 0)
      .sort(
        (a, b) =>
          b.score - a.score ||
          getItemTitle(a.item).localeCompare(getItemTitle(b.item)),
      )
      .map(({ item }) => item);
  }, [allItems, query]);

  const groupedResults = React.useMemo(
    () => groupItems(filteredItems),
    [filteredItems],
  );

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [query, isOpen]);

  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
    setQuery("");
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i < filteredItems.length - 1 ? i + 1 : i));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => (i > 0 ? i - 1 : 0));
      } else if (e.key === "Home") {
        e.preventDefault();
        setSelectedIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setSelectedIndex(filteredItems.length - 1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = filteredItems[selectedIndex];
        if (item) {
          if (item.type === "page" && item.data.external) {
            window.open(getItemUrl(item), "_blank", "noopener,noreferrer");
          } else {
            window.location.href = getItemUrl(item);
          }
          onClose();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    },
    [filteredItems, selectedIndex, onClose],
  );

  React.useEffect(() => {
    const container = resultsRef.current;
    if (!container) return;
    const selected = container.querySelector<HTMLElement>(
      "[data-selected='true']",
    );
    selected?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[15vh] sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm dark:bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border/60 bg-background/95 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-black/60"
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -12 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            {/* Top glow */}
            <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-3/4 -translate-x-1/2 rounded-full bg-primary/20 blur-[80px] opacity-60" />

            {/* Search header */}
            <div className="relative flex items-center gap-3 border-b border-border/60 px-4 py-4 dark:border-white/5">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts, authors, categories..."
                className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
                aria-label="Search"
                aria-autocomplete="list"
                aria-controls="command-palette-results"
              />
              <div className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
                <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-sans">
                  ESC
                </kbd>
                <span>to close</span>
              </div>
              <button
                onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results */}
            <div
              ref={resultsRef}
              id="command-palette-results"
              role="listbox"
              className="relative max-h-[50vh] overflow-y-auto p-2"
            >
              {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="mb-3 h-10 w-10 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    No results for "{query}"
                  </p>
                </div>
              ) : (
                groupedResults.map(([category, items]) => {
                  const startIndex = filteredItems.findIndex(
                    (i) => i.type === category,
                  );
                  const Icon = categoryIcons[category];

                  return (
                    <div key={category} className="mb-2">
                      <div className="sticky top-0 z-10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
                        {categoryLabels[category]}
                      </div>
                      <div className="space-y-0.5">
                        {items.map((item) => {
                          const index = startIndex + items.indexOf(item);
                          const selected = index === selectedIndex;
                          const url = getItemUrl(item);
                          const subtitle = getItemSubtitle(item);
                          const isExternal =
                            item.type === "page" && item.data.external;

                          return (
                            <a
                              key={`${item.type}-${item.data.id}`}
                              href={url}
                              target={isExternal ? "_blank" : undefined}
                              rel={
                                isExternal ? "noopener noreferrer" : undefined
                              }
                              role="option"
                              aria-selected={selected}
                              data-selected={selected}
                              onClick={(e) => {
                                if (isExternal) return;
                                e.preventDefault();
                                window.location.href = url;
                                onClose();
                              }}
                              onMouseEnter={() => setSelectedIndex(index)}
                              className={cn(
                                "group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                                selected
                                  ? "bg-primary/10 text-foreground"
                                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                              )}
                            >
                              <div
                                className={cn(
                                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border",
                                  selected
                                    ? "border-primary/30 bg-primary/10 text-primary"
                                    : "border-border bg-muted text-muted-foreground",
                                )}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                  <span className="truncate">
                                    {getItemTitle(item)}
                                  </span>
                                  {isExternal && (
                                    <ExternalLink className="h-3 w-3 opacity-50" />
                                  )}
                                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                                </div>
                                {subtitle && (
                                  <p className="truncate text-xs text-muted-foreground">
                                    {subtitle}
                                  </p>
                                )}
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="relative flex items-center justify-between border-t border-border/60 px-4 py-2.5 text-xs text-muted-foreground dark:border-white/5">
              <div className="flex items-center gap-3">
                <span className="hidden items-center gap-1 sm:inline-flex">
                  <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-sans">
                    ↑
                  </kbd>
                  <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-sans">
                    ↓
                  </kbd>
                  to navigate
                </span>
                <span className="hidden items-center gap-1 sm:inline-flex">
                  <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-sans">
                    ↵
                  </kbd>
                  to open
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Command className="h-3.5 w-3.5" />
                <span>Command Palette</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
