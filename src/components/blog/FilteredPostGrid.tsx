"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { PostList } from "@components/blog/PostList";
import { Input } from "@components/ui/Input";
import { Button } from "@components/ui/Button";
import { Badge } from "@components/ui/Badge";
import { Combobox } from "@components/ui/Combobox";
import { MultiCombobox } from "@components/ui/MultiCombobox";
import { CATEGORIES, getCategoryLabel } from "@lib/categories";
import { cn } from "@lib/utils";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Post } from "@lib/posts";

type SortOption = "newest" | "oldest" | "title";

interface FilteredPostGridProps {
  posts: Post[];
  initialCategory?: string;
  lockCategory?: boolean;
}

export function FilteredPostGrid({
  posts,
  initialCategory,
  lockCategory = false,
}: FilteredPostGridProps) {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : [],
  );
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>("newest");
  const [perPage, setPerPage] = useState(12);
  const [page, setPage] = useState(1);

  // Reset pagination when filters change.
  useEffect(() => {
    setPage(1);
  }, [search, selectedCategories, selectedYears, selectedTags, sort, perPage]);

  const allTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      for (const t of post.data.tags) {
        counts.set(t, (counts.get(t) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([value, count]) => ({ value, label: `${value} (${count})` }));
  }, [posts]);

  const years = useMemo(() => {
    const counts = new Map<number, number>();
    for (const post of posts) {
      const y = post.data.publishedDate.getFullYear();
      counts.set(y, (counts.get(y) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([value, count]) => ({
        value: String(value),
        label: `${value} (${count})`,
      }));
  }, [posts]);

  const categories = useMemo(
    () =>
      CATEGORIES.map((c) => ({
        value: c.slug,
        label: c.label,
      })).sort((a, b) => a.label.localeCompare(b.label)),
    [],
  );

  const sortOptions = [
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
    { value: "title", label: "Title A–Z" },
  ];

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    let result = posts.filter((post) => {
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(post.data.category)
      )
        return false;
      if (
        selectedYears.length > 0 &&
        !selectedYears.includes(String(post.data.publishedDate.getFullYear()))
      )
        return false;
      if (
        selectedTags.length > 0 &&
        !selectedTags.some((t) => post.data.tags.includes(t))
      )
        return false;
      if (query) {
        const haystack =
          `${post.data.title} ${post.data.description} ${post.data.tags.join(" ")}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    result = [...result].sort((a, b) => {
      if (sort === "newest") {
        return b.data.publishedDate.getTime() - a.data.publishedDate.getTime();
      }
      if (sort === "oldest") {
        return a.data.publishedDate.getTime() - b.data.publishedDate.getTime();
      }
      return a.data.title.localeCompare(b.data.title);
    });

    return result;
  }, [posts, search, selectedCategories, selectedYears, selectedTags, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  const hasFilters =
    search ||
    selectedYears.length > 0 ||
    selectedTags.length > 0 ||
    (!lockCategory && selectedCategories.length > 0);

  const clearFilters = useCallback(() => {
    setSearch("");
    setSelectedCategories(
      lockCategory && initialCategory ? [initialCategory] : [],
    );
    setSelectedYears([]);
    setSelectedTags([]);
    setSort("newest");
  }, [lockCategory, initialCategory]);

  const removeCategory = (value: string) =>
    setSelectedCategories((prev) => prev.filter((v) => v !== value));
  const removeYear = (value: string) =>
    setSelectedYears((prev) => prev.filter((v) => v !== value));
  const removeTag = (value: string) =>
    setSelectedTags((prev) => prev.filter((v) => v !== value));

  return (
    <div className="space-y-5">
      {/* Compact filter bar */}
      <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
          {/* Search */}
          <div className="relative lg:w-64 xl:w-72">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-9"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filters */}
          <div
            className={cn(
              "grid flex-1 gap-3",
              lockCategory
                ? "grid-cols-1 sm:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
            )}
          >
            {!lockCategory && (
              <MultiCombobox
                placeholder="Category"
                options={categories}
                values={selectedCategories}
                onChange={setSelectedCategories}
                searchPlaceholder="Search categories..."
              />
            )}
            <MultiCombobox
              placeholder="Year"
              options={years}
              values={selectedYears}
              onChange={setSelectedYears}
              searchPlaceholder="Search years..."
            />
            <MultiCombobox
              placeholder="Tags"
              options={allTags}
              values={selectedTags}
              onChange={setSelectedTags}
              searchPlaceholder="Search tags..."
            />
            <Combobox
              placeholder="Sort"
              options={sortOptions}
              value={sort}
              onChange={(value) => setSort((value as SortOption) ?? "newest")}
              clearable={false}
            />
          </div>

          {/* Per page + clear */}
          <div className="flex items-center gap-2 lg:justify-end">
            <div className="flex items-center gap-1 rounded-lg border border-input bg-background p-1">
              {[12, 24, 48].map((n) => (
                <Button
                  key={n}
                  type="button"
                  variant={perPage === n ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setPerPage(n)}
                  className="h-6 px-2 text-xs"
                >
                  {n}
                </Button>
              ))}
            </div>
            {hasFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 gap-1 text-xs"
              >
                <X size={12} />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Active filters */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-medium text-muted-foreground">
            Active:
          </span>
          {search && (
            <Badge variant="secondary" className="gap-1 text-xs">
              Search: “{search}”
              <button
                type="button"
                onClick={() => setSearch("")}
                className="rounded-full hover:bg-muted"
                aria-label="Remove search filter"
              >
                <X size={10} />
              </button>
            </Badge>
          )}
          {!lockCategory &&
            selectedCategories.map((value) => (
              <Badge key={value} variant="secondary" className="gap-1 text-xs">
                {getCategoryLabel(value)}
                <button
                  type="button"
                  onClick={() => removeCategory(value)}
                  className="rounded-full hover:bg-muted"
                  aria-label={`Remove ${getCategoryLabel(value)} filter`}
                >
                  <X size={10} />
                </button>
              </Badge>
            ))}
          {selectedYears.map((value) => (
            <Badge key={value} variant="secondary" className="gap-1 text-xs">
              {value}
              <button
                type="button"
                onClick={() => removeYear(value)}
                className="rounded-full hover:bg-muted"
                aria-label={`Remove ${value} filter`}
              >
                <X size={10} />
              </button>
            </Badge>
          ))}
          {selectedTags.map((value) => (
            <Badge key={value} variant="secondary" className="gap-1 text-xs">
              #{value}
              <button
                type="button"
                onClick={() => removeTag(value)}
                className="rounded-full hover:bg-muted"
                aria-label={`Remove ${value} filter`}
              >
                <X size={10} />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filtered.length === 0
            ? "No posts found"
            : `Showing ${start + 1}–${Math.min(start + perPage, filtered.length)} of ${filtered.length} posts`}
        </p>
      </div>

      <PostList posts={paginated} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="h-8 gap-1 text-xs"
          >
            <ChevronLeft size={14} />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
              )
              .map((p, index, arr) => {
                const showEllipsis = index > 0 && p - arr[index - 1] > 1;
                return (
                  <span key={`${p}-group`} className="flex items-center gap-1">
                    {showEllipsis && (
                      <span className="px-1 text-xs text-muted-foreground">
                        …
                      </span>
                    )}
                    <Button
                      type="button"
                      variant={page === p ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(p)}
                      className="h-8 w-8 p-0 text-xs"
                    >
                      {p}
                    </Button>
                  </span>
                );
              })}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="h-8 gap-1 text-xs"
          >
            Next
            <ChevronRight size={14} />
          </Button>
        </div>
      )}
    </div>
  );
}
