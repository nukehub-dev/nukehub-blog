# Project scripts

| Script                    | Purpose                      |
| ------------------------- | ---------------------------- |
| `npm run dev`             | Start the dev server         |
| `npm run build`           | Build the static site        |
| `npm run preview`         | Preview the built site       |
| `npm run create:post`     | Scaffold a new post          |
| `npm run create:author`   | Scaffold or update author    |
| `npm run optimize:images` | Optimize images in `public/` |
| `npm run generate:icons`  | Regenerate the PWA PNG icons |
| `npm run lint`            | Run ESLint                   |
| `npm run lint:fix`        | Run ESLint with auto-fix     |
| `npm run format`          | Format files with Prettier   |
| `npm run format:check`    | Check formatting             |
| `npm run check`           | Type-check Astro files       |

`npm run build` automatically runs `prebuild` first
(`scripts/inject-sw-cache.js`), which stamps a versioned cache name into
`public/sw.js.tpl` and writes the service worker to `public/sw.js`
(gitignored, regenerated on every build).

`npm run optimize:images` recompresses every PNG/JPEG under `public/` and
`src/content/posts/` in place using `sharp` (`scripts/optimize-images.js`).
Images that would not shrink are skipped. Run it manually after adding
images; it is not part of the build. The generated PWA icons and the brand
logo (`public/assets/images/nukehub.png`) are excluded — they ship
optimized and must stay lossless.

`npm run generate:icons` rebuilds `public/icon-*.png` and
`public/apple-touch-icon.png` from the SVG masters (`public/favicon.svg`,
`public/icon-monochrome.svg`) using `sharp`
(`scripts/generate-icons.mjs`). The output is lossless palette PNG
(`quality: 100`, `dither: 0`) with maskable safe-zone padding, so the icons
come out optimized. Run it whenever the SVG masters change.
