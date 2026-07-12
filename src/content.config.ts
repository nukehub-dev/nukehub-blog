import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";
import matter from "gray-matter";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const POSTS_DIR = "./src/content/posts";

/**
 * Custom loader for folder-based posts.
 *
 * Every post lives in `src/content/posts/<slug>/index.mdx` with its images in
 * the same folder. Any path segment starting with `_` is skipped (drafts,
 * partials, etc.).
 */
interface LoaderContext {
  store: {
    set(entry: {
      id: string;
      data: unknown;
      body?: string;
      filePath?: string;
      deferredRender?: boolean;
    }): void;
  };
  parseData(args: { id: string; data: unknown }): Promise<unknown>;
  logger: { warn(message: string): void };
}

const postsLoader = {
  name: "posts",
  async load(context: LoaderContext) {
    const { store, parseData, logger } = context;
    const baseDir = path.resolve(POSTS_DIR);
    const siteRoot = path.resolve(".");
    const seen = new Set<string>();

    let entries;
    try {
      entries = await readdir(baseDir, {
        withFileTypes: true,
        recursive: true,
      });
    } catch {
      logger.warn(`Could not read posts directory: ${baseDir}`);
      return;
    }

    for (const entry of entries) {
      if (!entry.isFile()) continue;
      if (entry.name !== "index.mdx" && entry.name !== "index.md") continue;

      const absolutePath = path.join(entry.parentPath, entry.name);
      const relPath = path.relative(baseDir, absolutePath);
      const siteRelPath = path.relative(siteRoot, absolutePath);
      const segments = relPath.split(path.sep);

      // Skip folders inside underscore-prefixed directories (e.g. _drafts).
      if (segments.some((seg) => seg.startsWith("_"))) continue;

      const dir = path.dirname(relPath);
      if (dir === ".") continue;

      const id = path.basename(dir);
      if (id.startsWith("_")) continue;

      if (seen.has(id)) {
        logger.warn(`Duplicate post id "${id}". Skipping ${relPath}.`);
        continue;
      }
      seen.add(id);

      const raw = await readFile(absolutePath, "utf-8");
      const { data, content } = matter(raw);
      const parsedData = await parseData({ id, data });

      store.set({
        id,
        data: parsedData,
        body: content,
        filePath: siteRelPath,
        deferredRender: true,
      });
    }
  },
};

const posts = defineCollection({
  loader: postsLoader,
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum([
      "news",
      "tutorials",
      "nuclear-industry",
      "community",
      "project-updates",
    ]),
    author: z.string(),
    coAuthors: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    // Relative filename inside the post folder (e.g. hero.png). Absolute
    // paths still work for external images or shared public assets.
    coverImage: z.string().optional(),
    coverImageFit: z.enum(["cover", "contain", "fill", "none"]).optional(),
    coverImageTransparent: z.boolean().default(false),
    canonicalUrl: z.string().url().optional(),
    references: z
      .array(
        z.object({
          id: z.string(),
          title: z.string(),
          url: z.string().url(),
          source: z.string().optional(),
          date: z.string().optional(),
        }),
      )
      .default([]),
  }),
});

const authors = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{yml,yaml}",
    base: "./src/content/authors",
  }),
  schema: z.object({
    name: z.string(),
    bio: z.string().optional(),
    avatar: z.string().optional(),
    role: z.string().optional(),
    organization: z.string().optional(),
    location: z.string().optional(),
    email: z.string().email().optional(),
    url: z.string().url().optional(),
    links: z
      .object({
        github: z.string().optional(),
        gitlab: z.string().optional(),
        linkedin: z.string().optional(),
        x: z.string().optional(),
        bluesky: z.string().optional(),
        mastodon: z.string().optional(),
        youtube: z.string().optional(),
        orcid: z.string().optional(),
        researchgate: z.string().optional(),
      })
      .optional(),
  }),
});

export const collections = { posts, authors };
