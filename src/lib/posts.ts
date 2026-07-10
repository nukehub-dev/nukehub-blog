import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;
export type Author = CollectionEntry<"authors">;

const isDev = import.meta.env.DEV;

export function isPublished(post: Post): boolean {
  return isDev || post.data.draft !== true;
}

export function sortPosts(posts: Post[]): Post[] {
  return [...posts].sort(
    (a, b) =>
      new Date(b.data.publishedDate).getTime() -
      new Date(a.data.publishedDate).getTime(),
  );
}

export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection("posts");
  return sortPosts(posts.filter(isPublished));
}

export async function getFeaturedPosts(limit = 3): Promise<Post[]> {
  const posts = await getPublishedPosts();
  return posts.filter((p) => p.data.featured).slice(0, limit);
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const posts = await getPublishedPosts();
  return posts.filter((p) => p.data.category === category);
}

export async function getPostsByAuthor(authorId: string): Promise<Post[]> {
  const posts = await getPublishedPosts();
  return posts.filter((p) => p.data.author === authorId);
}

export function getReadingTime(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function getRelatedPosts(
  current: Post,
  allPosts: Post[],
  limit = 3,
): Post[] {
  const candidates = allPosts.filter(
    (p) => p.id !== current.id && isPublished(p),
  );

  const scored = candidates.map((p) => {
    let score = 0;
    if (p.data.category === current.data.category) score += 3;
    const sharedTags = p.data.tags.filter((tag) =>
      current.data.tags.includes(tag),
    );
    score += sharedTags.length;
    return { post: p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.post);
}
