import type * as React from "react";
import { Home, FileText, Tags, Users, ExternalLink } from "lucide-react";

export interface NavItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
  newpage?: boolean;
}

export const navItems: NavItem[] = [
  { title: "Home", icon: Home, url: "/" },
  { title: "Posts", icon: FileText, url: "/posts" },
  { title: "Categories", icon: Tags, url: "/categories" },
  { title: "Authors", icon: Users, url: "/authors" },
  {
    title: "Main Site",
    icon: ExternalLink,
    url: "https://nukehub.org",
    newpage: true,
  },
];
