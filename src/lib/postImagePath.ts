import path from "node:path";
import type { Post } from "./posts";

/**
 * Resolve the on-disk path of a post image for build-time reads (e.g. sharp).
 *
 * - Absolute public paths resolve to `public/<src>`.
 * - Relative paths resolve to the post's source folder.
 */
export function resolvePostImagePath(
  src: string | undefined,
  post: Post,
): string {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://")) return "";
  if (src.startsWith("/")) {
    return path.join(process.cwd(), "public", src);
  }
  if (!post.filePath) return "";
  return path.join(path.dirname(post.filePath), src);
}
