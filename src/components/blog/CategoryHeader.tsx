import { cn } from "@lib/utils";
import {
  Newspaper,
  BookOpen,
  Atom,
  Users,
  Rocket,
  type LucideProps,
} from "lucide-react";
import type { CategoryMeta } from "@lib/categories";

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

interface CategoryHeaderProps {
  category: CategoryMeta;
  count: number;
  className?: string;
}

export function CategoryHeader({
  category,
  count,
  className,
}: CategoryHeaderProps) {
  const Icon = iconMap[category.icon] ?? Newspaper;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/60 bg-card p-8 md:p-10",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/[0.05] before:via-transparent before:to-transparent before:pointer-events-none",
        className,
      )}
    >
      <div className="relative z-10 flex flex-col items-center gap-5 text-center md:flex-row md:text-left">
        <div
          className={cn(
            "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ring-1",
            accentClasses[category.accent],
          )}
        >
          <Icon size={32} strokeWidth={1.5} />
        </div>

        <div className="flex-1">
          <div className="flex flex-col items-center gap-2 md:flex-row md:items-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {category.label}
            </h1>
            <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
              {count} {count === 1 ? "post" : "posts"}
            </span>
          </div>
          <p className="mt-2 max-w-2xl text-lg text-muted-foreground">
            {category.description}
          </p>
        </div>
      </div>
    </div>
  );
}
