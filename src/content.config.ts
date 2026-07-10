import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{mdx,md}", base: "./src/content/posts" }),
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
    coverImage: z.string().optional(),
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
