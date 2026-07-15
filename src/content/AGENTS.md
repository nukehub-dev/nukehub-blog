# Content Collections

## Purpose

Astro content collections: the MDX/YAML source of truth for blog posts and
authors.

## Ownership

`src/content.config.ts` and everything under `src/content/**`. Schema
additions/edits belong here.

## Local Contracts

- `posts` collection uses `.mdx` (Markdown with JSX components).
- `authors` collection uses `.yml`/`.yaml`.
- Posts are folder-based: `src/content/posts/<slug>/index.mdx`. Images, videos,
  and 3-D models (`.glb`) live in the same folder and are referenced by
  filename only.
- Folders whose name starts with `_` are excluded from the `posts` loader.
- The loader clears the content store on every sync so deleted or renamed posts
  do not leak into production builds.
- Schemas are declared with `zod` (imported from the `zod` package).
- Rendered entry access uses `getCollection` / `getEntry` / `render` from
  `astro:content`.

## Work Guidance

### Collections (declared in `src/content.config.ts`)

- `posts` (mdx/md) — blog posts.
  - Required fields: `title`, `description`, `publishedDate`, `category`,
    `author`.
  - Optional fields: `updatedDate`, `coAuthors`, `tags`, `featured`, `draft`,
    `citable`, `coverImage`, `coverImageFit`, `coverImageTransparent`,
    `canonicalUrl`, `references`.
  - `coverImage` is a filename inside the post folder; it is resolved to
    `/assets/posts/<slug>/<file>`. Absolute paths still work for external
    images or shared public assets.
  - `coverImageFit` accepts `cover`, `contain`, `fill`, or `none` (default
    `cover`).
  - `references` is a list of citation objects used by the `<Citation id="..." />`
    component. Required per entry: `id`, `title`, `url`. Optional: `source`
    (display string), `date`, plus structured fields for the copy menu's
    BibTeX/RIS export: `authors` (list), `type` (`article`, `book`,
    `inproceedings`, `techreport`, `misc`; default `misc`), and `publisher`.
    Formatters live in `src/lib/citations.ts`.
  - `category` must be one of:
    - `updates`
    - `tutorials`
    - `nuclear-industry`
    - `community`
  - `author` references an entry id from the `authors` collection.
  - `draft: true` posts are excluded from production builds but still
    available in development.
  - `citable: true` shows the "Cite" button (citation copy dialog) in the
    post header. Default `false`; the Share menu always renders.
- `authors` (yml/yaml) — author profiles.
  - Required: `name`.
  - Optional: `bio`, `avatar`, `role`, `organization`, `location`, `email`,
    `url`, `links` (github, gitlab, linkedin, x, bluesky, mastodon, youtube,
    orcid, researchgate).

### Adding a new collection

1. Add the loader+schema to `src/content.config.ts` and export it from
   `collections`.
2. Add the matching directory under `src/content/<name>/`.
3. Render it from a route in `src/pages/` and/or components under
   `src/components/blog/`.

### Schema edits

- Backward-compatible additions can land directly.
- Removing or renaming a field requires updating every entry that sets it.
- Optional fields should stay optional; defaults belong in `.default(...)` on
  the schema, not at consumption sites.

### Creating a post

Use the interactive scaffold instead of creating files by hand:

```bash
npm run create:post
```

The script prompts for the required frontmatter, generates a URL slug from the
title, and creates a folder-based post:

- `src/content/posts/<slug>/index.mdx` — the post source
- `src/content/posts/<slug>/` — the asset folder

Authors drop assets into the same folder and reference them by filename only in
frontmatter (`coverImage: hero.png`) and MDX components
(`<ImageFigure src="figure-1.png" />`, `<Model3D src="model.glb" />`).

### Creating or updating an author

Use the interactive scaffold:

```bash
npm run create:author
```

The script writes `src/content/authors/<slug>.yml`. If the slug already exists,
it pre-fills the current values so you can update them.

### Draft workflow

Use the `draft` frontmatter flag to control publication. Do not use a separate
`_drafts/` folder; that mechanism is no longer supported by the loader.

- `draft: true` — visible during development for preview, but excluded from
  production builds.
- `draft: false` (default) — published normally.

### Common pitfalls

- **Entry id vs slug.** Astro's `entry.id` is the post folder name; dynamic
  routes use it directly. If you rename a post, add a redirect or accept the URL
  change.
- **Dates are coerced.** `publishedDate` accepts ISO strings (`YYYY-MM-DD`) and
  is coerced to a `Date` object.
- **Image paths.** Use filenames (`hero.png`) and the build resolves them to
  `/assets/posts/<slug>/hero.png`. Absolute paths still work for external
  images or shared public assets.
- **Post assets are copied verbatim.** They bypass Astro's image optimization
  pipeline, so run `npm run optimize:images` after adding large images. Files
  that would grow are skipped, so already-optimized images are safe.

## Verification

```bash
npm run build   # schema errors fail the build
npm run check
```

## Child NAD Index

- None.
