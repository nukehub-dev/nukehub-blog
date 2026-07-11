"use client";

import { motion } from "framer-motion";
import { cn } from "@lib/utils";
import { transitions } from "@lib/animations";
import {
  Newspaper,
  BookOpen,
  Atom,
  Users,
  Rocket,
  type LucideProps,
} from "lucide-react";
import type { CategoryMeta } from "@lib/categories";
import type { Post } from "@lib/posts";

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  newspaper: Newspaper,
  "book-open": BookOpen,
  atom: Atom,
  users: Users,
  rocket: Rocket,
};

const accentClasses: Record<CategoryMeta["accent"], string> = {
  red: "from-red-500/20 to-red-600/5 text-red-600 dark:text-red-400 ring-red-500/20",
  orange:
    "from-orange-500/20 to-orange-600/5 text-orange-600 dark:text-orange-400 ring-orange-500/20",
  green:
    "from-emerald-500/20 to-emerald-600/5 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
  cyan: "from-cyan-500/20 to-cyan-600/5 text-cyan-600 dark:text-cyan-400 ring-cyan-500/20",
  purple:
    "from-violet-500/20 to-violet-600/5 text-violet-600 dark:text-violet-400 ring-violet-500/20",
};

const borderClasses: Record<CategoryMeta["accent"], string> = {
  red: "hover:border-red-500/30",
  orange: "hover:border-orange-500/30",
  green: "hover:border-emerald-500/30",
  cyan: "hover:border-cyan-500/30",
  purple: "hover:border-violet-500/30",
};

interface CategoryCardProps {
  category: CategoryMeta;
  count: number;
  latestPosts?: Post[];
  className?: string;
}

export function CategoryCard({
  category,
  count,
  latestPosts,
  className,
}: CategoryCardProps) {
  const Icon = iconMap[category.icon] ?? Newspaper;
  const hasPosts = count > 0;

  return (
    <motion.a
      href={`/category/${category.slug}`}
      whileHover={{ y: -4, transition: transitions.spring }}
      className={cn(
        "group block rounded-3xl border border-border/60 bg-card p-6",
        "transition-colors hover:bg-card/80",
        borderClasses[category.accent],
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ring-1",
            accentClasses[category.accent],
          )}
        >
          <Icon size={28} strokeWidth={1.5} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
              {category.label}
            </h2>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium tabular-nums",
                "bg-muted text-muted-foreground",
              )}
            >
              {count} {count === 1 ? "post" : "posts"}
            </span>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {category.description}
          </p>

          {latestPosts && latestPosts.length > 0 && (
            <div className="mt-4 space-y-1.5">
              {latestPosts.map((post) => (
                <span
                  key={post.id}
                  className="block truncate text-sm text-muted-foreground transition-colors group-hover:text-foreground"
                >
                  <span className="mr-1.5 text-primary">→</span>
                  {post.data.title}
                </span>
              ))}
            </div>
          )}

          {!hasPosts && (
            <p className="mt-4 text-sm italic text-muted-foreground">
              No posts yet.
            </p>
          )}
        </div>
      </div>
    </motion.a>
  );
}
