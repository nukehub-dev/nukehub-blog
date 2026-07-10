import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE } from "@data/site";
import { isPublished } from "@lib/posts";

export async function GET(context) {
  const posts = await getCollection("posts");
  const publishedPosts = posts.filter(isPublished).sort(
    (a, b) =>
      new Date(b.data.publishedDate).getTime() -
      new Date(a.data.publishedDate).getTime(),
  );

  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: publishedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishedDate,
      description: post.data.description,
      link: `/posts/${post.id}`,
      categories: [post.data.category, ...post.data.tags],
    })),
    customData: `<language>${SITE.language}</language>`,
  });
}
