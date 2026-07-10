# Astro Site Source

## Purpose

The live Astro application: routes, layouts, shared components, global styles,
static data, type declarations, and utilities.

## Ownership

All files under `src/` except `src/content/` (own NAD). Also owns
`astro.config.mjs`, `tsconfig.json`, `eslint.config.js`, `.prettierrc`.

## Local Contracts

- Astro 6 static output (`output: "static"`). Every route is prerendered to
  `dist/**`.
- React islands via `@astrojs/react`; MDX via `@astrojs/mdx`; sitemap via
  `@astrojs/sitemap`; Tailwind v4 via `@tailwindcss/vite`.
- Path aliases (declared in `astro.config.mjs`): `@components`, `@layouts`,
  `@data`, `@styles`, `@lib`, `@content`. Use aliases; avoid relative paths
  beyond a single `./` jump.
- TypeScript strict; `tsconfig.json` extends `astro/tsconfigs/strict`.
- ESLint flat config (`eslint.config.js`); `.wrangler/**` and `dist/**` are
  ignored. `no-undef` is off for `.ts/.tsx/.astro` because TS already covers it.
- Prettier with `prettier-plugin-astro`; formats
  `src/**/*.{ts,tsx,astro,css,scss,json,md,yml,yaml}` and root configs.

## Work Guidance

### Project structure

- `src/pages/` — Astro routes. One `.astro` per URL.
  - `index.astro` — home.
  - `posts/index.astro` — all posts listing.
  - `posts/[...slug].astro` — individual blog posts.
  - `categories/index.astro` — category directory.
  - `category/[category].astro` — category index pages.
  - `authors/index.astro` — author directory.
  - `authors/[author].astro` — author pages.
  - `rss.xml.js` — RSS feed.
  - `404.astro` — not found page.
- `src/layouts/` — page shells.
  - `BaseLayout.astro` — every page funnels through here. Owns the `<head>`,
    SEO meta, RSS alternate link, theme init script, skip link, header/footer
    frame, and scroll-to-top.
  - `PageLayout.astro` — generic prose-content wrapper over BaseLayout.
  - `PostLayout.astro` — blog-post wrapper: cover image, title, meta, author(s),
    tags, table of contents, references, related posts.
- `src/components/ui/` — visual primitives copied from `nukehub.org`. Do not
  edit their behavior; update import aliases only.
- `src/components/layout/` — site frame: `Header`, `Footer`, `Container`.
- `src/components/shared/` — global UI islands: `ThemeToggle`,
  `ScrollProgress`, `ErrorBoundary`, `Analytics`, `CommandPalette`,
  `CommandPaletteManager`, `GlassContextMenu`, `GlobalContextMenu`,
  `MagneticButton`. Also `decorations/FloatingParticles`.
- `src/components/blog/` — blog-specific components: `PostCard`, `PostList`,
  `PostHero`, `PostContent`, `CategoryNav`, `AuthorBio`, `TableOfContents`,
  `NewsletterSignup`, etc.
- `src/components/mdx/` — MDX shortcodes available inside post bodies:
  `YouTube`, `Odysee`, `Video`, `ImageFigure`, `Callout`, `Citation`.
- `src/data/` — typed static data: `nav.ts`, `footer.ts`, `site.ts`.

### Environment variables

Public env vars are bundled into the static site. `PUBLIC_API_URL` and
`PUBLIC_TURNSTILE_SITE_KEY` are required for the newsletter signup form.
`PUBLIC_CF_ANALYTICS_TOKEN` is optional.

- `src/styles/global.css` — Tailwind v4 entry and theme tokens.
- `src/lib/` — shared utilities.
  - `utils.ts` — `cn()` helper.
  - `theme.ts` — theme/accent engine.
  - `favicon.ts` — dynamic favicon + theme color.
  - `posts.ts` — post filtering/sorting helpers.
  - `categories.ts` — category metadata.
- `src/types/declarations.d.ts` — ambient type declarations.

### Component reuse

UI primitives are copied from `nukehub.org` and kept unchanged. If a primitive
needs different behavior for the blog, wrap it in `src/components/blog/` rather
than modifying the primitive.

### Adding a route

1. Create `src/pages/<name>.astro` or dynamic route file.
2. Wrap in `BaseLayout` (directly), `PageLayout`, or `PostLayout`. Always pass
   `permalink`, `title`, `description`, optional `image`/`ogImage`.
3. For collection-backed content, do **not** create a per-entry page — use a
   dynamic route like `[...slug].astro`.

### Astro config stays minimal

`astro.config.mjs` only lists integrations, the static output flag, prefetch
strategy, image domains, and Vite plugins/aliases. Do not add adapter imports —
this site is static-only.

### UI primitives

The project does not use a generic component library. Use the custom
components in `src/components/ui/` when a new primitive is needed. Do not rely
on browser-built-in UI (native `title` tooltips, default `<select>` dropdowns,
unstyled `<dialog>`, `window.alert`) for product UX — use project components
such as `Tooltip` and `Dialog`.

### Common pitfalls

- **Do not import from `src/components/blog/` in `src/lib/`.** Lib is
  bottom-of-stack; cycles break the build.
- **All pages route through `BaseLayout.astro`.** A head/SEO change there
  affects every page. Add new `<link>`/`<meta>` in BaseLayout, not in
  individual page files.
- **Do not edit generated files.** `dist/`, `.astro/`, `node_modules/.vite/`,
  and any other build outputs are regenerated. Change source only.

## Verification

See the root NAD "Before committing" for the canonical checks:

```bash
npm run lint
npm run format:check
npm run build
npx astro check
```

## Child NAD Index

- `src/content/AGENTS.md` — content collections.
