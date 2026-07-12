import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/Card";
import { Badge } from "@components/ui/Badge";
import { Image } from "@components/ui/Image";
import { getCategoryLabel } from "@lib/categories";
import { resolvePostImage } from "@lib/postImages";
import type { Post } from "@lib/posts";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { title, description, publishedDate, category, coverImage, tags } =
    post.data;
  const coverImageSrc = resolvePostImage(coverImage, post.id);

  return (
    <a href={`/posts/${post.id}`} className="group block">
      <Card variant="bubble" interactive className="h-full overflow-hidden">
        {coverImageSrc && (
          <Image
            src={coverImageSrc}
            alt={title}
            aspect="video"
            rounded="none"
            className="transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default">{getCategoryLabel(category)}</Badge>
            {tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="ghost">
                {tag}
              </Badge>
            ))}
          </div>
          <CardTitle className="line-clamp-2 text-lg">{title}</CardTitle>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
        </CardHeader>
        <CardContent>
          <time
            dateTime={publishedDate.toISOString()}
            className="text-xs text-muted-foreground"
          >
            {format(publishedDate, "MMMM d, yyyy")}
          </time>
        </CardContent>
      </Card>
    </a>
  );
}
