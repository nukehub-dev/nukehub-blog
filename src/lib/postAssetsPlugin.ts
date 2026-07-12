import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "vite";

const POSTS_DIR = "src/content/posts";
const ASSET_PREFIX = "/assets/images/posts/";

const ASSET_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".avif",
  ".svg",
  ".mp4",
  ".webm",
]);

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] ?? "application/octet-stream";
}

function isAssetFile(fileName: string): boolean {
  return ASSET_EXTENSIONS.has(path.extname(fileName).toLowerCase());
}

/**
 * Vite plugin that serves folder-based post assets in development and emits
 * them into the build output in production.
 *
 * Authors place images next to `src/content/posts/<slug>/index.mdx` and
 * reference them by filename; the plugin maps
 * `/assets/images/posts/<slug>/<file>` to the source file.
 */
export function postAssetsPlugin(): Plugin {
  return {
    name: "nukehub-post-assets",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? "";
        if (!url.startsWith(ASSET_PREFIX)) {
          return next();
        }

        const rest = url.slice(ASSET_PREFIX.length);
        const slashIndex = rest.indexOf("/");
        if (slashIndex === -1) {
          return next();
        }

        const slug = rest.slice(0, slashIndex);
        const fileName = rest.slice(slashIndex + 1);

        if (!slug || !fileName || slug.startsWith("_")) {
          return next();
        }

        const assetDir = path.resolve(POSTS_DIR, slug);
        const filePath = path.resolve(assetDir, fileName);

        // Ensure the resolved file stays inside the post's asset directory.
        if (!filePath.startsWith(path.join(assetDir, path.sep))) {
          return next();
        }

        if (!isAssetFile(fileName)) {
          return next();
        }

        try {
          const data = await readFile(filePath);
          res.setHeader("Content-Type", getMimeType(filePath));
          res.end(data);
        } catch {
          next();
        }
      });
    },
    async generateBundle() {
      if ((this.environment as { ssr?: boolean } | undefined)?.ssr) return;

      const postsDir = path.resolve(POSTS_DIR);
      let entries;
      try {
        entries = await readdir(postsDir, { withFileTypes: true });
      } catch {
        return;
      }

      for (const entry of entries) {
        if (!entry.isDirectory() || entry.name.startsWith("_")) continue;

        const slug = entry.name;
        const assetDir = path.join(postsDir, slug);
        let files;
        try {
          files = await readdir(assetDir);
        } catch {
          continue;
        }

        for (const file of files) {
          if (!isAssetFile(file)) continue;

          const source = await readFile(path.join(assetDir, file));
          this.emitFile({
            type: "asset",
            fileName: `assets/images/posts/${slug}/${file}`,
            source,
          });
        }
      }
    },
  };
}
