import { cn } from "@lib/utils";
import { Image } from "@components/ui/Image";
import { SocialIcon, getSocialUrl } from "@components/ui/SocialIcon";
import type { Author } from "@lib/posts";

interface AuthorBioProps {
  author: Author;
  className?: string;
}

export function AuthorBio({ author, className }: AuthorBioProps) {
  const { name, bio, avatar, role, links } = author.data;

  const socialEntries = links
    ? (Object.entries(links) as [string, string][])
        .filter(([, value]) => Boolean(value))
        .map(([platform, handle]) => ({
          platform,
          url: getSocialUrl(platform, handle),
        }))
    : [];

  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-2xl border border-border/50 bg-card p-6",
        className,
      )}
    >
      {avatar && (
        <Image
          src={avatar}
          alt={name}
          aspect="square"
          rounded="full"
          className="h-16 w-16 shrink-0"
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-foreground">{name}</h3>
          {role && (
            <span className="text-xs text-muted-foreground">{role}</span>
          )}
        </div>
        {bio && <p className="mt-1 text-sm text-muted-foreground">{bio}</p>}
        {socialEntries.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {socialEntries.map(({ platform, url }) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                aria-label={platform}
              >
                <SocialIcon platform={platform} size={16} />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
