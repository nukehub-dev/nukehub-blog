<!-- Nuke Agent Doc (NAD) Framework — nukehub-blog -->

## Purpose

Binding work contract for AI agents and human contributors working on the
NukeHub Blog (`blog.nukehub.org`): an independent Astro 6 static site that
publishes NukeHub news, tutorials, nuclear industry updates, and community
spotlights.

## Ownership

This root `AGENTS.md` owns the NAD hierarchy, project-wide workflow rules, and
cross-domain standards for `nukehub-blog/`. Domain-specific guidance lives in
child `AGENTS.md` files listed in the Child NAD Index.

## NAD Core Contract

- `AGENTS.md` files are binding work contracts for their subtrees.
- Work products, source materials, instructions, records, assets, and durable
docs must stay understandable from the nearest applicable `AGENTS.md` plus
every parent `AGENTS.md` above it.

### Read Before Editing

1. Read this root `AGENTS.md`.
2. Identify every file or folder you expect to touch.
3. Walk from the repository root to each target path.
4. Read every `AGENTS.md` found along each route.
5. If a parent `AGENTS.md` lists a child `AGENTS.md` whose scope contains the
path, read that child and continue from there.
6. Use the nearest `AGENTS.md` as the local contract and parent docs for
repo-wide rules.
7. If docs conflict, the closer doc controls local work details, but no child
doc may weaken NAD.

### Update After Editing

Every meaningful change requires a NAD pass before the task is done.

Update the closest owning `AGENTS.md` when a change affects:

- purpose, scope, ownership, or responsibilities
- durable structure, contracts, workflows, or operating rules
- required inputs, outputs, permissions, constraints, side effects, or
artifacts
- user preferences about behavior, communication, process, organization, or
quality
- `AGENTS.md` creation, deletion, move, rename, or index contents

Update parent docs when parent-level structure, ownership, workflow, or child
index changes. Update child docs when parent changes alter local rules. Remove
stale or contradictory text immediately. Small edits that do not change
behavior or contracts may leave docs unchanged, but the NAD pass still must
happen.

## Hierarchy

- Root `AGENTS.md` is the NAD rail: project-wide instructions, global
preferences, durable workflow rules, and the top-level Child NAD Index.
- Child `AGENTS.md` files own domain-specific instructions and their own Child
NAD Index.
- Each parent explains what its direct children cover and what stays owned by
the parent.
- The closer a doc is to the work, the more specific and practical it must be.

## Child Doc Shape

Create a child `AGENTS.md` when a folder becomes a durable boundary with its
own purpose, rules, responsibilities, workflow, materials, or quality
standards.

Default section order:

- Purpose
- Ownership
- Local Contracts
- Work Guidance
- Verification
- Child NAD Index

## Style

- Keep docs concise, current, and operational.
- Document stable contracts, not diary entries.
- Put broad rules in parent docs and concrete details in child docs.
- Prefer direct bullets with explicit names.
- Do not duplicate rules across many files unless each scope needs a local
version.
- Delete stale notes instead of explaining history.
- Trim obvious statements, repeated rules, misplaced detail, and warnings for
risks that no longer exist.

## Closeout

1. Re-check changed paths against the NAD chain.
2. Update nearest owning docs and any affected parents or children.
3. Refresh every affected Child NAD Index.
4. Remove stale or contradictory text.
5. Run existing verification when relevant.
6. Report any docs intentionally left unchanged and why.

---

## NukeHub Blog Project Guidance

## Required tooling

Install once before making changes:

- **Node.js** + npm (site build, scripts, and lint).
- **wrangler** — local Cloudflare Pages preview and deploying `dist/`.

## Before committing

Run these from the repo root. They are the canonical "did I break anything"
checks:

```bash
npm run lint            # eslint . (zero errors required)
npm run format:check    # prettier check on src/** and root configs
npm run build           # astro build
npx astro check         # typecheck
```

Notes:

- `npm run lint` must end with `0 errors`.
- Do not edit generated files. `dist/`, `.astro/`, `node_modules/.vite/` and
other build outputs are regenerated. Change source only.
- `.wrangler/` is gitignored and eslint-ignored.

## Architecture pointer

High-level layout; see the Child NAD Index below for domain-specific details.

- `astro.config.mjs` — Astro config, integrations, and Vite aliases.
- `src/pages/` — Astro routes: home, posts, categories, authors, RSS, 404.
- `src/layouts/` — page shells: `BaseLayout`, `PageLayout`, `PostLayout`.
- `src/components/` — shared UI primitives, layout chrome, and blog-specific
components.
- `src/content/` — Astro content collections: `posts` and `authors`. See
`src/content/AGENTS.md`.
- `src/lib/` — shared TypeScript utilities, theme engine, and post helpers.
- `src/data/` — typed static data: nav, footer, site metadata.
- `src/styles/` — Tailwind v4 theme entrypoint.
- `public/` — static assets: fonts, favicon, images, robots.txt.
- `.github/workflows/ci.yml` — PR/push CI: lint, format:check, typecheck, build.
- `wrangler.toml` — Cloudflare Pages compatibility and output config.

## Component reuse policy

The NukeHub flagship site (`nukehub.org`) maintains a custom UI library. This
blog reuses those primitives verbatim wherever possible:

- Copy UI primitives from `nukehub.org/src/components/ui/` unchanged except for
import aliases.
- Copy shared utilities from `nukehub.org/src/lib/` unchanged.
- Adapt layout components (`Header`, `Footer`) only to fit the simpler blog
context.
- Blog-specific components live in `src/components/blog/`.

## Deployment (Cloudflare Pages)

This is a **static** build (`output: "static"`). Deploy with:

```bash
npm run build
npx wrangler pages deploy dist
```

Custom domain: `blog.nukehub.org`.

## Environment variables

`PUBLIC_*` variables are bundled into the static site and visible to the
browser. They are defined in `.env` (local dev) and Cloudflare Pages env vars
(production). See `.env.example` for the canonical list:

- `PUBLIC_CF_ANALYTICS_TOKEN` — Cloudflare Web Analytics token (optional).

## Child NAD Index

- `src/AGENTS.md` — Astro site source: `pages/`, `layouts/`, `components/`,
`styles/`, `data/`, `lib/`, plus Astro config and project path aliases.
- `src/content/AGENTS.md` — Astro content collections and `content.config.ts`
schemas.
