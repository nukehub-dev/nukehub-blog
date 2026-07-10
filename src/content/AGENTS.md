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
- Files with a leading underscore (`_*.mdx`, `_drafts/`) are excluded from the
  `posts` loader.
- Schemas are declared with `astro/zod`.
- Rendered entry access uses `getCollection` / `getEntry` / `render` from
  `astro:content`.

## Work Guidance

### Collections (declared in `src/content.config.ts`)

- `posts` (mdx/md) — blog posts.
  - Required fields: `title`, `description`, `publishedDate`, `category`,
    `author`.
  - Optional fields: `updatedDate`, `tags`, `featured`, `draft`, `coverImage`,
    `canonicalUrl`.
  - `category` must be one of:
    - `news`
    - `tutorials`
    - `nuclear-industry`
    - `community`
    - `project-updates`
  - `author` references an entry id from the `authors` collection.
  - `draft: true` posts are excluded from production builds but still
    available in development.
- `authors` (yml/yaml) — author profiles.
  - Required: `name`.
  - Optional: `bio`, `avatar`, `role`, `links` (github, linkedin, x, website).

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

### Draft workflow

- Draft posts live in `src/content/posts/_drafts/`.
- Drafts are excluded from the loader pattern.
- To publish, move the file into `src/content/posts/` and set `draft: false`.

### Common pitfalls

- **Entry id vs slug.** Astro's `entry.id` is the filename without extension;
  dynamic routes use it directly. If you rename a post, add a redirect or
  accept the URL change.
- **Dates are coerced.** `publishedDate` accepts ISO strings (`YYYY-MM-DD`) and
  is coerced to a `Date` object.

## Verification

```bash
npm run build   # schema errors fail the build
npx astro check
```

## Child NAD Index

- None.
