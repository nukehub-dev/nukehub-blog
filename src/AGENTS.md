# Astro Site Source

## Purpose

The live Astro application: routes, layouts, shared components, global styles,
static data, type declarations, and utilities.

## Ownership

All files under `src/` except `src/content/` (own NAD). Also owns
`astro.config.mjs`, `tsconfig.json`, `eslint.config.js`, `.prettierrc`.

## Local Contracts

- Astro 7 static output (`output: "static"`). Every route is prerendered to
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
  - `offline.astro` — offline fallback served by the service worker.
- `src/layouts/` — page shells.
  - `BaseLayout.astro` — every page funnels through here. Owns the `<head>`,
    SEO meta, RSS alternate link, theme init script, skip link, header/footer
    frame, scroll-to-top, and production-only service worker registration.
  - `PageLayout.astro` — generic prose-content wrapper over BaseLayout.
  - `PostLayout.astro` — blog-post wrapper: cover image, title, meta, author(s),
    tags, table of contents, references, related posts.
- `src/components/ui/` — visual primitives copied from `nukehub.org`. Do not
  edit their behavior; update import aliases only.
- `src/components/layout/` — site frame: `Header`, `Footer`, `Container`.
- `src/components/shared/` — global UI islands: `ThemeToggle`,
  `ScrollProgress`, `ErrorBoundary`, `Analytics`, `CommandPalette`,
  `CommandPaletteManager`, `GlassContextMenu`, `GlobalContextMenu`,
  `MagneticButton`, `ImageLightbox` (shared fullscreen image overlay used by
  `ImageFigure` and `CoverImage`). Also `decorations/FloatingParticles`.
- `src/components/blog/` — blog-specific components: `PostCard`, `PostList`,
  `PostHero`, `PostContent`, `CoverImage` (post-page cover in `PostLayout`,
  opens the shared lightbox on click), `CategoryNav`, `AuthorBio`,
  `TableOfContents`,
  `NewsletterSignup` (subscribe/unsubscribe form with optional `source` prop),
  `PostShareCite` (Share menu on every post; Cite dialog only when the post
  sets `citable: true`), etc.
- `src/components/illustrations/` — self-contained SVG illustration
  components copied from `nukehub.org` (e.g. `ReactorCore404` for the 404
  page). Keep them verbatim; all styling is scoped inside each component.
- `src/components/mdx/` — MDX shortcodes available inside post bodies:
  `YouTube`, `Odysee`, `Video`, `ImageFigure`, `Callout`, `Citation`,
  `InlineMath`, `Math`, `DataTable`, `Plotly`, `Mermaid`, `Tabs`, `Steps`,
  `FileTree`, `Model3D`.
  - Card and media containers use `rounded-xl` with `border-border/50`; keep
    new containers on the same radius for visual consistency.
  - `DataTable` supports optional column sorting, global search, and pagination
    via `sortable`, `searchable`, and `pagination` props.
  - `Tabs` uses `<Tabs>` + `<Tab label="...">` for switchable content panels.
  - `Steps` uses `<Steps>` + `<Step>` for numbered procedures. Numbering is a
    CSS counter on the `<ol>` (`nuke-step`), not `cloneElement` — children
    arriving from MDX are not React elements, so injected props never arrive.
  - `FileTree` renders a nested directory tree from an `items` prop.
  - `Model3D` renders `.glb` files from the post folder in a three.js orbit
    viewer (`Model3D.astro` + `Model3DClient.tsx`, `client:visible`, dynamic
    import like `Plotly`). Static by default; the control bar offers a rotate
    toggle, Iso/Front/Top/Side presets, and fullscreen.
- `src/data/` — typed static data: `nav.ts`, `footer.ts`, `site.ts`.
- `src/integrations/` — Astro integrations with build hooks.
  `markdown-negotiation.ts` (`astro:build:done`) walks `dist/` and converts
  each HTML page to a `.md` sibling via turndown (with GFM tables), stripping
  UI chrome. Client-side islands (`Plotly`, `Model3D`) become HTML comments
  pointing agents at the data: the inlined chart spec, or the fetchable
  `.glb` URL. `public/_worker.js` (Pages advanced mode) serves those `.md`
  files when the client prefers `text/markdown`, and adds `Vary: Accept` to
  HTML responses.

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
  - `citations.ts` — citation formatters (plain text, BibTeX, RIS) for post
    references.
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
npm run check
```

## Child NAD Index

- `src/content/AGENTS.md` — content collections.
