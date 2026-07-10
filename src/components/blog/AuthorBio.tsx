import { cn } from "@lib/utils";
import { Image } from "@components/ui/Image";
import { SocialIcon, getSocialUrl } from "@components/ui/SocialIcon";
import { Tooltip } from "@components/ui/Tooltip";
import { Mail, Globe, MapPin, Building2 } from "lucide-react";
import type { ReactNode } from "react";
import type { Author } from "@lib/posts";

/** Return a human-readable label for a social platform key. */
function formatSocialLabel(platform: string): string {
  const labels: Record<string, string> = {
    github: "GitHub",
    gitlab: "GitLab",
    bitbucket: "Bitbucket",
    linkedin: "LinkedIn",
    x: "X",
    facebook: "Facebook",
    instagram: "Instagram",
    youtube: "YouTube",
    tiktok: "TikTok",
    bluesky: "Bluesky",
    mastodon: "Mastodon",
    discord: "Discord",
    telegram: "Telegram",
    threads: "Threads",
    twitch: "Twitch",
    reddit: "Reddit",
    whatsapp: "WhatsApp",
    signal: "Signal",
    stackoverflow: "Stack Overflow",
    scholar: "Google Scholar",
    orcid: "ORCID",
    researchgate: "ResearchGate",
    zotero: "Zotero",
    medium: "Medium",
    email: "Email",
    url: "Website",
  };
  return (
    labels[platform.toLowerCase()] ||
    platform.charAt(0).toUpperCase() + platform.slice(1)
  );
}

interface AuthorBioProps {
  author: Author;
  href?: string;
  className?: string;
}

export function AuthorBio({ author, href, className }: AuthorBioProps) {
  const { name, bio, avatar, role, organization, location, email, url, links } =
    author.data;

  const socialEntries = links
    ? (Object.entries(links) as [string, string][])
        .filter(([, value]) => Boolean(value))
        .map(([platform, handle]) => ({
          platform,
          url: getSocialUrl(platform, handle),
        }))
    : [];

  const metaItems: { key: string; content: ReactNode }[] = [];

  if (organization) {
    metaItems.push({
      key: "organization",
      content: (
        <span className="inline-flex items-center gap-1.5">
          <Building2 size={12} />
          {organization}
        </span>
      ),
    });
  }

  if (location) {
    metaItems.push({
      key: "location",
      content: (
        <span className="inline-flex items-center gap-1.5">
          <MapPin size={12} />
          {location}
        </span>
      ),
    });
  }

  if (email) {
    metaItems.push({
      key: "email",
      content: (
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-1.5 hover:text-foreground"
        >
          <Mail size={12} />
          {email}
        </a>
      ),
    });
  }

  if (url) {
    metaItems.push({
      key: "url",
      content: (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 hover:text-foreground"
        >
          <Globe size={12} />
          Website
        </a>
      ),
    });
  }

  const NameHeading = <h3 className="font-semibold text-foreground">{name}</h3>;

  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-2xl border border-border/50 bg-card p-6",
        className,
      )}
    >
      {avatar &&
        (href ? (
          <a href={href} className="shrink-0">
            <Image
              src={avatar}
              alt={name}
              aspect="auto"
              rounded="full"
              wrapperClassName="h-16 w-16"
            />
          </a>
        ) : (
          <Image
            src={avatar}
            alt={name}
            aspect="auto"
            rounded="full"
            wrapperClassName="h-16 w-16 shrink-0"
          />
        ))}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {href ? <a href={href}>{NameHeading}</a> : NameHeading}
          {role && (
            <span className="text-xs text-muted-foreground">{role}</span>
          )}
        </div>

        {metaItems.length > 0 && (
          <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted-foreground">
            {metaItems.map((item, index) => (
              <span key={item.key} className="inline-flex items-center">
                {index > 0 && (
                  <span className="mx-2.5 select-none text-muted-foreground/60">
                    ·
                  </span>
                )}
                {item.content}
              </span>
            ))}
          </div>
        )}

        {bio && <p className="mt-3 text-sm text-muted-foreground">{bio}</p>}

        {socialEntries.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {socialEntries.map(({ platform, url }) => {
              const label = formatSocialLabel(platform);
              return (
                <Tooltip key={platform} content={label}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    aria-label={label}
                  >
                    <SocialIcon platform={platform} size={16} />
                  </a>
                </Tooltip>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
