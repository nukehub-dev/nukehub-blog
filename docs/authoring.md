# Content authoring

## Create a post

The fastest way to start a post is the interactive scaffold:

```bash
npm run create:post
```

This prompts for the title, description, category, author, tags, and cover
image, then creates a folder-based post:

- `src/content/posts/<slug>/index.mdx` — the post source
- `src/content/posts/<slug>/` — the asset folder for images

After the script finishes, add your images to the same folder and reference them
by filename only.

### Manual frontmatter example

If you prefer to create the file by hand, create a folder at
`src/content/posts/your-slug/` with `index.mdx` and your images:

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
coverImage: hero.png
---

Your post content here.
```

## Markdown quick reference

Posts are written in MDX, which is Markdown with JSX components.

````mdx
## Headings use hashes

Paragraphs are separated by blank lines. **Bold**, _italic_, and `inline code`
work as usual.

- Use dashes for bullet lists
- Nested items are indented two spaces

1. Numbered lists work too
2. Like this

[Link text](https://example.com)

> Blockquotes look like this.

```python
# Code blocks use triple backticks with an optional language
import openmc
```

Table

| Name    | Value |
| ------- | ----- |
| Fuel    | UO2   |
| Coolant | H2O   |
````

## Available MDX components

These components are available inside any post without importing them.

### Images and video

`ImageFigure` automatically detects the image's aspect ratio at build time. You
can override it with `aspectRatio`, or change the fit with `fit`, the corner
style with `rounded`, and the placeholder background with `transparent`.

```mdx
<ImageFigure
  src="diagram.png"
  alt="Reactor diagram"
  caption="Figure 1: Cross-section of a PWR fuel assembly."
/>

{/* Optional overrides */}

<ImageFigure
  src="diagram.png"
  alt="Reactor diagram"
  caption="Figure 2: Optional custom sizing."
  aspectRatio="4/3"
  fit="contain"
  rounded="lg"
  transparent={true}
/>
```

```mdx
<YouTube id="dQw4w9WgXcQ" title="Demo" />

<Odysee url="https://odysee.com/$/embed/name/claimId" title="Demo" />

<Video src="demo.mp4" title="Demo" />
```

### Callouts

```mdx
<Callout type="tip">Quick tips and best practices.</Callout>

<Callout type="note">Extra context or background information.</Callout>

<Callout type="warning">Something that might trip readers up.</Callout>

<Callout type="danger">
  Critical warnings that could cause errors or safety issues.
</Callout>
```

### Citations

Use `<Citation id="..." />` in the body and define the matching reference in
the frontmatter. See the **References** section below for details.

```mdx
OpenMC uses continuous-energy nuclear data<Citation id="openmc-docs" />.
```

## Frontmatter schema

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
| `coverImage`            | No       | string   | Image filename inside the post folder                                   |
| `coverImageFit`         | No       | enum     | `cover`, `contain`, `fill`, `none`. Default `cover`                     |
| `coverImageTransparent` | No       | boolean  | Remove the default gray background. Default `false`                     |
| `canonicalUrl`          | No       | string   | If the post was originally published elsewhere                          |
| `references`            | No       | object[] | Citations rendered at the end of the post. See below.                   |

## References

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

## Newsletter

The blog uses the NukeHub API server for email subscriptions. To enable the
signup form, set these environment variables:

```bash
PUBLIC_API_URL=http://localhost:3000
PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

The API endpoint is `POST ${PUBLIC_API_URL}/newsletter` with JSON body
`{ email, turnstileToken }`. The API server stores subscribers in SQLite and
exposes admin endpoints for listing and exporting them.

## Authors

Create or update an author with the interactive scaffold:

```bash
npm run create:author
```

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

## Drafts

Use the `draft` frontmatter flag to control publication:

- `draft: true` — the post is visible in development so you can preview it, but
  it is excluded from production builds.
- `draft: false` (default) — the post is published.

To publish a draft, change `draft: true` to `draft: false`. The interactive
`npm run create:post` scaffold asks whether to start a post as a draft and sets
the flag automatically.
