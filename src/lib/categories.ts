export type CategorySlug =
  "news" | "tutorials" | "nuclear-industry" | "community" | "project-updates";

export interface CategoryMeta {
  slug: CategorySlug;
  label: string;
  description: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: "news",
    label: "News",
    description: "Announcements and updates from NukeHub and the community.",
  },
  {
    slug: "tutorials",
    label: "Tutorials",
    description:
      "Step-by-step guides for nuclear engineering tools and workflows.",
  },
  {
    slug: "nuclear-industry",
    label: "Nuclear Industry",
    description:
      "Industry trends, regulations, and reactor technology updates.",
  },
  {
    slug: "community",
    label: "Community",
    description: "Community spotlights, events, and contributor stories.",
  },
  {
    slug: "project-updates",
    label: "Project Updates",
    description: "Releases, changelogs, and deep dives into NukeHub projects.",
  },
];

export const CATEGORY_SLUGS: CategorySlug[] = CATEGORIES.map((c) => c.slug);

export function getCategoryMeta(slug: string): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryLabel(slug: string): string {
  return getCategoryMeta(slug)?.label ?? slug;
}
