# Project scripts

| Script                  | Purpose                    |
| ----------------------- | -------------------------- |
| `npm run dev`           | Start the dev server       |
| `npm run build`         | Build the static site      |
| `npm run preview`       | Preview the built site     |
| `npm run create:post`   | Scaffold a new post        |
| `npm run create:author` | Scaffold or update author  |
| `npm run lint`          | Run ESLint                 |
| `npm run lint:fix`      | Run ESLint with auto-fix   |
| `npm run format`        | Format files with Prettier |
| `npm run format:check`  | Check formatting           |
| `npm run check`         | Type-check Astro files     |

`npm run build` automatically runs `prebuild` first
(`scripts/inject-sw-cache.js`), which stamps a versioned cache name into
`public/sw.js.tpl` and writes the service worker to `public/sw.js`
(gitignored, regenerated on every build).
