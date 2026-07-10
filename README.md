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

````mdx
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

You can also use the built-in MDX components:

`ImageFigure` automatically detects the image's aspect ratio at build time. You
can override it with `aspectRatio`, or change the fit with `fit`, the corner
style with `rounded`, and the placeholder background with `transparent`.

```mdx
<YouTube id="dQw4w9WgXcQ" title="Demo" />

<Odysee url="https://odysee.com/$/embed/name/claimId" title="Demo" />

<Video src="/assets/videos/demo.mp4" title="Demo" />

<ImageFigure
  src="/assets/images/diagram.png"
  alt="Reactor diagram"
  caption="Figure 1: Cross-section of a PWR fuel assembly."
/>

<!-- Optional overrides -->

<ImageFigure
  src="/assets/images/diagram.png"
  alt="Reactor diagram"
  caption="Figure 2: Optional custom sizing."
  aspectRatio="4/3"
  fit="contain"
  rounded="lg"
  transparent={true}
/>

<Callout type="tip">
  Always validate your cross sections against a reference benchmark.
</Callout>

<Citation id="openmc2023" /> cross sections should be validated against
benchmark data.
```
````

### Frontmatter schema

| Field                   | Required | Type     | Notes                                                                   |
| ----------------------- | -------- | -------- | ----------------------------------------------------------------------- |
| `title`                 | Yes      | string   | Post title                                                              |
| `description`           | Yes      | string   | Short summary for SEO and cards                                         |
| `publishedDate`         | Yes      | date     | `YYYY-MM-DD`                                                            |
| `updatedDate`           | No       | date     | `YYYY-MM-DD`                                                            |
| `category`              | Yes      | enum     | `news`, `tutorials`, `nuclear-industry`, `community`, `project-updates` |
| `author`                | Yes      | string   | ID of the primary author in `src/content/authors/`                      |
| `coAuthors`             | No       | string[] | IDs of additional authors. Default `[]`                                 |
| `tags`                  | No       | string[] | Default `[]`                                                            |
| `featured`              | No       | boolean  | Default `false`                                                         |
| `draft`                 | No       | boolean  | Default `false`; excluded from production builds                        |
| `coverImage`            | No       | string   | Path to an image in `public/`                                           |
| `coverImageFit`         | No       | enum     | `cover`, `contain`, `fill`, `none`. Default `cover`                     |
| `coverImageTransparent` | No       | boolean  | Remove the default gray background. Default `false`                     |
| `canonicalUrl`          | No       | string   | If the post was originally published elsewhere                          |
| `references`            | No       | object[] | Citations rendered at the end of the post. See below.                   |

### References

Add a `references` array to the frontmatter to cite external sources. Each
reference needs a unique `id` that matches `<Citation id="..." />` used in the
post body.

```yaml
references:
  - id: openmc2023
    title: OpenMC User's Guide
    url: https://docs.openmc.org/
    source: OpenMC Development Team
    date: "2023"
```

Use the citation component in MDX:

```mdx
OpenMC uses continuous-energy nuclear data<Citation id="openmc2023" />.
```

The references section is rendered automatically at the bottom of the post.

### Newsletter

The blog uses the NukeHub API server for email subscriptions. To enable the
signup form, set these environment variables:

```bash
PUBLIC_API_URL=http://localhost:3000
PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

The API endpoint is `POST ${PUBLIC_API_URL}/newsletter` with JSON body
`{ email, turnstileToken }`. The API server stores subscribers in SQLite and
exposes admin endpoints for listing and exporting them.

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
- `src/components/mdx/` — MDX shortcodes available inside posts
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
