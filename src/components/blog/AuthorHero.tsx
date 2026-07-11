"use client";

import { motion } from "framer-motion";
import { Image } from "@components/ui/Image";
import { Badge } from "@components/ui/Badge";
import { Tooltip } from "@components/ui/Tooltip";
import { SocialIcon, getSocialUrl } from "@components/ui/SocialIcon";
import { MagneticButton } from "@components/shared/MagneticButton";
import { cn } from "@lib/utils";
import { transitions } from "@lib/animations";
import { Building2, MapPin, Mail, Globe } from "lucide-react";
import type { ReactNode } from "react";
import type { Author, Post } from "@lib/posts";

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

interface AuthorHeroProps {
  author: Author;
  posts: Post[];
  className?: string;
}

export function AuthorHero({ author, posts, className }: AuthorHeroProps) {
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

  const metaItems: { key: string; icon: ReactNode; content: ReactNode }[] = [];

  if (organization) {
    metaItems.push({
      key: "organization",
      icon: <Building2 size={14} />,
      content: <span>{organization}</span>,
    });
  }

  if (location) {
    metaItems.push({
      key: "location",
      icon: <MapPin size={14} />,
      content: <span>{location}</span>,
    });
  }

  if (email) {
    metaItems.push({
      key: "email",
      icon: <Mail size={14} />,
      content: (
        <a
          href={`mailto:${email}`}
          className="hover:text-foreground hover:underline underline-offset-2"
        >
          {email}
        </a>
      ),
    });
  }

  if (url) {
    metaItems.push({
      key: "url",
      icon: <Globe size={14} />,
      content: (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground hover:underline underline-offset-2"
        >
          Website
        </a>
      ),
    });
  }

  const categories = Array.from(
    new Set(posts.map((post) => post.data.category)),
  );
  const latestPost = posts[0];

  const stats = [
    {
      key: "posts",
      value: posts.length,
      label: posts.length === 1 ? "Post" : "Posts",
    },
    {
      key: "categories",
      value: categories.length,
      label: categories.length === 1 ? "Category" : "Categories",
    },
    ...(latestPost
      ? [
          {
            key: "latest",
            value: latestPost.data.publishedDate.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            }),
            label: "Latest",
          },
        ]
      : []),
  ];

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/60 bg-card p-8 md:p-10",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/[0.07] before:via-transparent before:to-transparent before:pointer-events-none",
        "after:absolute after:-top-1/2 after:-right-1/2 after:h-full after:w-full after:rounded-full after:bg-primary/[0.03] after:blur-3xl after:pointer-events-none",
        className,
      )}
    >
      <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row md:items-start">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="relative">
            <div
              className={cn(
                "absolute -inset-1 rounded-full bg-gradient-to-br from-primary/40 via-primary/20 to-primary/5 blur-md",
                "animate-pulse-slow",
              )}
            />
            <div className="relative rounded-full bg-card p-1">
              {avatar ? (
                <Image
                  src={avatar}
                  alt={name}
                  aspect="square"
                  rounded="full"
                  wrapperClassName="h-28 w-28 md:h-32 md:w-32 ring-2 ring-border/60"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-muted text-3xl font-bold text-foreground md:h-32 md:w-32">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
            {role && (
              <Badge variant="default" className="text-xs font-medium">
                {role}
              </Badge>
            )}
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {name}
          </h1>

          {metaItems.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              {metaItems.map((item, index) => (
                <span
                  key={item.key}
                  className={cn(
                    "inline-flex items-center gap-1.5 text-sm text-muted-foreground",
                    index > 0 &&
                      "relative pl-3 before:absolute before:left-0 before:top-1/2 before:h-1 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-muted-foreground/40",
                  )}
                >
                  {item.icon}
                  {item.content}
                </span>
              ))}
            </div>
          )}

          {bio && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {bio}
            </p>
          )}

          {socialEntries.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              {socialEntries.map(({ platform, url }) => {
                const label = formatSocialLabel(platform);
                return (
                  <Tooltip key={platform} content={label}>
                    <MagneticButton
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      strength={0.25}
                      className={cn(
                        "inline-flex h-10 w-10 items-center justify-center rounded-xl",
                        "bg-muted text-muted-foreground transition-colors",
                        "hover:bg-primary hover:text-primary-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                      )}
                      aria-label={label}
                    >
                      <SocialIcon platform={platform} size={18} />
                    </MagneticButton>
                  </Tooltip>
                );
              })}
            </div>
          )}

          {/* Stats */}
          {stats.length > 0 && (
            <div className="mt-8 grid w-full max-w-md grid-cols-3 gap-3 md:max-w-none">
              {stats.map((stat) => (
                <motion.div
                  key={stat.key}
                  whileHover={{ y: -3, transition: transitions.spring }}
                  className={cn(
                    "flex flex-col items-center rounded-2xl border border-border/50 bg-background/50 p-3 text-center",
                    "backdrop-blur-sm transition-colors hover:border-primary/30 hover:bg-background",
                  )}
                >
                  <span className="text-xl font-bold tabular-nums text-foreground md:text-2xl">
                    {stat.value}
                  </span>
                  <span className="mt-1 text-xs font-medium text-muted-foreground">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
