"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@lib/utils";
import { Input } from "@components/ui/Input";
import { PostList } from "./PostList";
import type { Post } from "@lib/posts";

interface PostSearchProps {
  posts: Post[];
  className?: string;
  placeholder?: string;
}

export function PostSearch({
  posts,
  className,
  placeholder = "Search posts...",
}: PostSearchProps) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<Post[]>(posts);

  React.useEffect(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      setResults(posts);
      return;
    }

    setResults(
      posts.filter((post) => {
        const text = [
          post.data.title,
          post.data.description,
          post.data.category,
          ...post.data.tags,
        ]
          .join(" ")
          .toLowerCase();
        return text.includes(normalized);
      }),
    );
  }, [query, posts]);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-9"
          aria-label="Search posts"
        />
      </div>
      {query && (
        <p className="text-sm text-muted-foreground">
          {results.length} result{results.length === 1 ? "" : "s"} for "{query}"
        </p>
      )}
      <PostList posts={results} />
    </div>
  );
}
