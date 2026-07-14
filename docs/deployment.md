# Deployment

This site is built as static HTML and deployed to Cloudflare Pages.

```bash
npm run build
npx wrangler pages deploy dist
```

Production settings:

- Build command: `npm run build`
- Output directory: `dist`
- Custom domain: `blog.nukehub.org`

## Markdown content negotiation

The build emits a `.md` sibling for every HTML page (via the
`markdown-negotiation` Astro integration). `public/_worker.js` puts Pages in
advanced mode, so a Worker runs before static assets on every request: when
the client's `Accept` header prefers `text/markdown` (RFC 9110 q-values), it
serves the `.md` version at the same URL; otherwise the request falls through
to the static HTML. HTML responses carry `Vary: Accept`.

## Environment variables

`PUBLIC_*` variables are bundled into the static site and visible to the
browser. See `.env.example` for the canonical list:

- `PUBLIC_API_URL` — NukeHub API server URL (required for newsletter signup).
- `PUBLIC_TURNSTILE_SITE_KEY` — Cloudflare Turnstile site key (required for
  newsletter signup).
- `PUBLIC_CF_ANALYTICS_TOKEN` — Cloudflare Web Analytics token (optional).

### Newsletter

The blog uses the NukeHub API server for email subscriptions. To enable the
signup form, set:

```bash
PUBLIC_API_URL=http://localhost:3000
PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

The API endpoint is `POST ${PUBLIC_API_URL}/newsletter` with JSON body
`{ email, turnstileToken }`. The API server stores subscribers in SQLite and
exposes admin endpoints for listing and exporting them.

## CI

GitHub Actions runs lint, format check, type check, and build on every push and
pull request to `main`.
