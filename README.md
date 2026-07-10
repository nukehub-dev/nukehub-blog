# NukeHub Blog

The NukeHub Blog at [blog.nukehub.org](https://blog.nukehub.org) — an independent Astro 6 static site that publishes NukeHub news, tutorials, nuclear industry updates, and community spotlights.

## Tech stack

- [Astro 6](https://astro.build/) with static output
- [React 19](https://react.dev/) islands for interactivity
- [Tailwind CSS v4](https://tailwindcss.com/)
- [MDX](https://mdxjs.com/) for posts
- [Zod](https://zod.dev/) for content schemas
- Cloudflare Pages for deployment

## Getting started

### Requirements

- Node.js 22+
- npm

### Install dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

The dev server starts at `http://localhost:4321`.

### Build

```bash
npm run build
```

Static output is written to `dist/`.

### Preview the production build

```bash
npm run build && npm run preview
```

## Project scripts

| Script                 | Purpose                    |
| ---------------------- | -------------------------- |
| `npm run dev`          | Start the dev server       |
| `npm run build`        | Build the static site      |
| `npm run preview`      | Preview the built site     |
| `npm run lint`         | Run ESLint                 |
| `npm run lint:fix`     | Run ESLint with auto-fix   |
| `npm run format`       | Format files with Prettier |
| `npm run format:check` | Check formatting           |
| `npx astro check`      | Type-check Astro files     |

## Content authoring

### Create a post

Add an MDX file to `src/content/posts/`:

```mdx
---
title: Your Post Title
description: A short summary of the post.
publishedDate: 2026-07-10
category: tutorials
author: ahnaf-tahmid-chowdhury
tags: [openmc, python]
featured: false
draft: false
---

Your post content here.
```

### Frontmatter schema

| Field           | Required | Type     | Notes                                                                   |
| --------------- | -------- | -------- | ----------------------------------------------------------------------- |
| `title`         | Yes      | string   | Post title                                                              |
| `description`   | Yes      | string   | Short summary for SEO and cards                                         |
| `publishedDate` | Yes      | date     | `YYYY-MM-DD`                                                            |
| `updatedDate`   | No       | date     | `YYYY-MM-DD`                                                            |
| `category`      | Yes      | enum     | `news`, `tutorials`, `nuclear-industry`, `community`, `project-updates` |
| `author`        | Yes      | string   | ID of an author in `src/content/authors/`                               |
| `tags`          | No       | string[] | Default `[]`                                                            |
| `featured`      | No       | boolean  | Default `false`                                                         |
| `draft`         | No       | boolean  | Default `false`; excluded from production builds                        |
| `coverImage`    | No       | string   | Path to an image in `public/`                                           |
| `canonicalUrl`  | No       | string   | If the post was originally published elsewhere                          |

### Authors

Authors are YAML files in `src/content/authors/`:

```yaml
name: Author Name
bio: A short bio.
role: Contributor
organization: NukeHub
location: Canada
email: author@nukehub.org
url: https://nukehub.org
avatar: /assets/images/author.png
links:
  github: username
  gitlab: username
  linkedin: username
  x: username
  bluesky: username.bsky.social
  mastodon: "@username@example.com"
  youtube: "@channel"
  orcid: 0000-0000-0000-0000
  researchgate: username
```

### Drafts

Drafts live in `src/content/posts/_drafts/` and are excluded from the content loader. To publish, move the file into `src/content/posts/` and set `draft: false`.

## Architecture

- `src/pages/` — Astro routes
- `src/layouts/` — page shells (`BaseLayout`, `PageLayout`, `PostLayout`)
- `src/components/ui/` — UI primitives copied from `nukehub.org`
- `src/components/blog/` — blog-specific components
- `src/content/` — MDX posts and YAML authors
- `src/lib/` — shared utilities
- `src/data/` — static site data

## Deployment

This site is built as static HTML and deployed to Cloudflare Pages.

```bash
npm run build
npx wrangler pages deploy dist
```

Production settings:

- Build command: `npm run build`
- Output directory: `dist`
- Custom domain: `blog.nukehub.org`

## CI

GitHub Actions runs lint, format check, type check, and build on every push and pull request to `main`.

## License

BSD 2-Clause. See [LICENSE](./LICENSE).
