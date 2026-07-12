# Architecture

High-level project layout:

- `src/pages/` — Astro routes
- `src/layouts/` — page shells (`BaseLayout`, `PageLayout`, `PostLayout`)
- `src/components/ui/` — UI primitives copied from `nukehub.org`
- `src/components/blog/` — blog-specific components
- `src/components/mdx/` — MDX shortcodes available inside posts
- `src/content/` — MDX posts and YAML authors
- `src/lib/` — shared utilities
- `src/data/` — static site data
- `docs/` — project documentation (this directory)

See `src/AGENTS.md` and `src/content/AGENTS.md` for detailed source-code and
content-collection contracts.
