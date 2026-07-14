import type { LucideIcon } from "lucide-react";
import type { BrandIconProps } from "@components/ui/BrandIcon";
import {
  Info,
  Mail,
  FileText,
  Heart,
  Tags,
  Users,
  ExternalLink,
  MessagesSquare,
} from "lucide-react";

export interface FooterLink {
  title: string;
  url: string;
  newpage?: boolean;
  icon?: LucideIcon;
  brandIcon?: BrandIconProps["name"];
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export const footerColumns: FooterColumn[] = [
  {
    title: "Blog",
    links: [
      { title: "All Posts", url: "/posts", icon: FileText },
      { title: "Categories", url: "/categories", icon: Tags },
      { title: "Authors", url: "/authors", icon: Users },
    ],
  },
  {
    title: "NukeHub",
    links: [
      {
        title: "Main Site",
        url: "https://nukehub.org",
        newpage: true,
        icon: ExternalLink,
      },
      {
        title: "About",
        url: "https://nukehub.org/about",
        newpage: true,
        icon: Info,
      },
      {
        title: "Support Us",
        url: "https://nukehub.org/support",
        newpage: true,
        icon: Heart,
      },
    ],
  },
  {
    title: "Connect",
    links: [
      {
        title: "Contact",
        url: "https://nukehub.org/contact",
        newpage: true,
        icon: Mail,
      },
      {
        title: "NukeTalk",
        url: "https://talk.nukehub.org",
        newpage: true,
        icon: MessagesSquare,
      },
    ],
  },
];

export const socialLinks: { name: BrandIconProps["name"]; url: string }[] = [
  { name: "linkedin", url: "https://www.linkedin.com/company/nukehub" },
  { name: "bluesky", url: "https://bsky.app/profile/nukehub.org" },
  { name: "mastodon", url: "https://mastodon.social/@nukehub" },
  { name: "github", url: "https://github.com/nukehub-dev" },
];

export const footerLegal: FooterLink[] = [
  {
    title: "RSS Feed",
    url: "/rss.xml",
  },
  {
    title: "Sitemap",
    url: "/sitemap-index.xml",
  },
  {
    title: "Privacy",
    url: "https://nukehub.org/privacy-policy",
    newpage: true,
  },
  {
    title: "Terms",
    url: "https://nukehub.org/terms-of-service",
    newpage: true,
  },
  {
    title: "Code of Conduct",
    url: "https://nukehub.org/code-of-conduct",
    newpage: true,
  },
];
