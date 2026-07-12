/**
 * Resolve a post image/video src to a public URL.
 *
 * - Absolute paths (`/assets/...` or `https://...`) are returned unchanged so
 *   legacy flat posts and external images keep working.
 * - Relative paths are expanded to `/assets/images/posts/<postId>/<src>`,
 *   matching the Vite plugin that serves folder-based post assets.
 */
export function resolvePostImage(
  src: string | undefined,
  postId: string,
): string {
  if (!src) return "";
  if (
    src.startsWith("/") ||
    src.startsWith("http://") ||
    src.startsWith("https://")
  ) {
    return src;
  }
  return `/assets/images/posts/${postId}/${src}`;
}
