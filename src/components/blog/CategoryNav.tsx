import { cn } from "@lib/utils";
import { CATEGORIES, type CategorySlug } from "@lib/categories";

interface CategoryNavProps {
  active?: CategorySlug | "all";
  className?: string;
}

export function CategoryNav({ active = "all", className }: CategoryNavProps) {
  return (
    <nav
      className={cn("flex flex-wrap items-center gap-2", className)}
      aria-label="Categories"
    >
      <a
        href="/categories"
        className={cn(
          "rounded-full px-3 py-1 text-sm font-medium transition-colors",
          active === "all"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        )}
      >
        All
      </a>
      {CATEGORIES.map((category) => (
        <a
          key={category.slug}
          href={`/category/${category.slug}`}
          className={cn(
            "rounded-full px-3 py-1 text-sm font-medium transition-colors",
            active === category.slug
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          )}
        >
          {category.label}
        </a>
      ))}
    </nav>
  );
}
