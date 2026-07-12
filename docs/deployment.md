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

## Environment variables

`PUBLIC_*` variables are bundled into the static site and visible to the
browser. See `.env.example` for the canonical list:

- `PUBLIC_API_URL` — NukeHub API server URL (required for newsletter signup).
- `PUBLIC_TURNSTILE_SITE_KEY` — Cloudflare Turnstile site key (required for
  newsletter signup).
- `PUBLIC_CF_ANALYTICS_TOKEN` — Cloudflare Web Analytics token (optional).

## CI

GitHub Actions runs lint, format check, type check, and build on every push and
pull request to `main`.
