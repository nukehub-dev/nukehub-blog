export type CategorySlug =
  "updates" | "tutorials" | "nuclear-industry" | "community";

export interface CategoryMeta {
  slug: CategorySlug;
  label: string;
  description: string;
  icon: string;
  accent: "red" | "orange" | "green" | "cyan" | "purple";
}

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: "updates",
    label: "Updates",
    description:
      "News, releases, and deep dives from NukeHub and the community.",
    icon: "rocket",
    accent: "orange",
  },
  {
    slug: "tutorials",
    label: "Tutorials",
    description:
      "Step-by-step guides for nuclear engineering tools and workflows.",
    icon: "book-open",
    accent: "green",
  },
  {
    slug: "nuclear-industry",
    label: "Nuclear Industry",
    description:
      "Industry trends, regulations, and reactor technology updates.",
    icon: "atom",
    accent: "cyan",
  },
  {
    slug: "community",
    label: "Community",
    description: "Community spotlights, events, and contributor stories.",
    icon: "users",
    accent: "purple",
  },
];

export const CATEGORY_SLUGS: CategorySlug[] = CATEGORIES.map((c) => c.slug);

export function getCategoryMeta(slug: string): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryLabel(slug: string): string {
  return getCategoryMeta(slug)?.label ?? slug;
}
