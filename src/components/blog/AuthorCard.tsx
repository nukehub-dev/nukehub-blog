"use client";

import { motion } from "framer-motion";
import { Image } from "@components/ui/Image";
import { Badge } from "@components/ui/Badge";
import { Tooltip } from "@components/ui/Tooltip";
import { SocialIcon, getSocialUrl } from "@components/ui/SocialIcon";
import { MagneticButton } from "@components/shared/MagneticButton";
import { cn } from "@lib/utils";
import { transitions } from "@lib/animations";
import { FileText } from "lucide-react";
import type { Author } from "@lib/posts";

/** Return a human-readable label for a social platform key. */
function formatSocialLabel(platform: string): string {
  const labels: Record<string, string> = {
    github: "GitHub",
    gitlab: "GitLab",
    linkedin: "LinkedIn",
    x: "X",
    bluesky: "Bluesky",
    mastodon: "Mastodon",
    youtube: "YouTube",
    orcid: "ORCID",
    researchgate: "ResearchGate",
    discord: "Discord",
    email: "Email",
    url: "Website",
  };
  return (
    labels[platform.toLowerCase()] ||
    platform.charAt(0).toUpperCase() + platform.slice(1)
  );
}

interface AuthorCardProps {
  author: Author;
  postCount: number;
  className?: string;
}

export function AuthorCard({ author, postCount, className }: AuthorCardProps) {
  const { name, bio, avatar, role, links } = author.data;
  const href = `/authors/${author.id}`;

  const socialEntries = links
    ? (Object.entries(links) as [string, string][])
        .filter(([, value]) => Boolean(value))
        .map(([platform, handle]) => ({
          platform,
          url: getSocialUrl(platform, handle),
        }))
    : [];

  return (
    <motion.div
      whileHover={{ y: -4, transition: transitions.spring }}
      className={cn(
        "rounded-3xl border border-border/60 bg-card p-6 text-center",
        "transition-colors hover:border-primary/30 hover:bg-card/80",
        className,
      )}
    >
      <div className="flex flex-col items-center">
        <a href={href} className="group/avatar relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary/30 via-primary/10 to-transparent opacity-0 blur-md transition-opacity group-hover/avatar:opacity-100" />
          <div className="relative rounded-full bg-card p-1">
            {avatar ? (
              <Image
                src={avatar}
                alt={name}
                aspect="square"
                rounded="full"
                wrapperClassName="h-24 w-24 ring-2 ring-border/60 transition-transform group-hover/avatar:scale-105"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted text-2xl font-bold text-foreground transition-transform group-hover/avatar:scale-105">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </a>

        <a
          href={href}
          className="mt-4 text-lg font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
        >
          {name}
        </a>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          {role && (
            <Badge variant="default" className="text-xs font-medium">
              {role}
            </Badge>
          )}
          <Badge variant="outline" className="text-xs font-medium">
            <FileText size={12} className="mr-1" />
            {postCount} {postCount === 1 ? "post" : "posts"}
          </Badge>
        </div>

        {bio && (
          <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
            {bio}
          </p>
        )}

        {socialEntries.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {socialEntries.map(({ platform, url }) => {
              const label = formatSocialLabel(platform);
              return (
                <Tooltip key={platform} content={label}>
                  <MagneticButton
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    strength={0.2}
                    className={cn(
                      "inline-flex h-9 w-9 items-center justify-center rounded-xl",
                      "bg-muted text-muted-foreground transition-colors",
                      "hover:bg-primary hover:text-primary-foreground",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    )}
                    aria-label={label}
                  >
                    <SocialIcon platform={platform} size={16} />
                  </MagneticButton>
                </Tooltip>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
