"use client";

import { Link, ArrowUp, Search, Command, Plus } from "lucide-react";
import { navItems } from "@data/nav";
import {
  GlassContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
} from "./GlassContextMenu";

export function GlobalContextMenu() {
  return (
    <GlassContextMenu title="Navigation">
      {/* Quick actions */}
      <ContextMenuItem
        icon={Search}
        onClick={() =>
          window.dispatchEvent(new CustomEvent("command-palette:open"))
        }
        shortcut={
          <span className="flex items-center gap-0.5 leading-none">
            <Command className="h-3 w-3" />
            <Plus className="h-3 w-3" />
            <span className="leading-none">K</span>
          </span>
        }
      >
        Search
      </ContextMenuItem>
      <ContextMenuItem
        icon={Link}
        onClick={() => navigator.clipboard.writeText(window.location.href)}
      >
        Copy link
      </ContextMenuItem>
      <ContextMenuItem
        icon={ArrowUp}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        shortcut="Home"
      >
        Back to top
      </ContextMenuItem>
      <ContextMenuSeparator />

      {/* Top-level links */}
      {navItems.map((item) => (
        <ContextMenuItem
          key={item.title}
          icon={item.icon}
          href={item.url}
          target={item.newpage ? "_blank" : undefined}
          rel={item.newpage ? "noopener noreferrer" : undefined}
        >
          {item.title}
        </ContextMenuItem>
      ))}
    </GlassContextMenu>
  );
}
