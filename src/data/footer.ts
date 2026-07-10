import type { LucideIcon } from "lucide-react";
import {
  Info,
  Mail,
  FileText,
  Heart,
  Rss,
  Tags,
  Users,
  ExternalLink,
} from "lucide-react";

export interface FooterLink {
  title: string;
  url: string;
  newpage?: boolean;
  icon?: LucideIcon;
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
      { title: "RSS Feed", url: "/rss.xml", icon: Rss },
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
        title: "Contact",
        url: "https://nukehub.org/contact",
        newpage: true,
        icon: Mail,
      },
      {
        title: "Support Us",
        url: "https://nukehub.org/support",
        newpage: true,
        icon: Heart,
      },
    ],
  },
];

export const footerLegal: FooterLink[] = [
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

export const socialLinks = [
  { name: "github", url: "https://github.com/nukehub-dev" },
  { name: "linkedin", url: "https://www.linkedin.com/company/nukehub" },
] as const;
