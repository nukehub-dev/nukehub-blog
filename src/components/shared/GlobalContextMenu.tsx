"use client";

import { useState, useCallback } from "react";
import {
  Link,
  ArrowUp,
  Search,
  Command,
  Plus,
  Copy,
  Share2,
} from "lucide-react";
import { navItems } from "@data/nav";
import {
  GlassContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
} from "./GlassContextMenu";

function getSelectedText(): string {
  const active = document.activeElement;
  if (
    active instanceof HTMLInputElement ||
    active instanceof HTMLTextAreaElement
  ) {
    const start = active.selectionStart ?? 0;
    const end = active.selectionEnd ?? 0;
    return active.value.slice(start, end).trim();
  }
  return window.getSelection()?.toString().trim() ?? "";
}

export function GlobalContextMenu() {
  const [selection, setSelection] = useState("");
  const [canShare] = useState(
    () =>
      typeof navigator !== "undefined" && typeof navigator.share === "function",
  );

  const handleContextMenu = useCallback(() => {
    setSelection(getSelectedText());
  }, []);

  const handleCopySelection = async () => {
    if (!selection) return;
    await navigator.clipboard.writeText(selection);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = document.title;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }

    await navigator.clipboard.writeText(url);
  };

  return (
    <GlassContextMenu title="Navigation" onContextMenu={handleContextMenu}>
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
      {selection && (
        <ContextMenuItem icon={Copy} onClick={handleCopySelection}>
          Copy selection
        </ContextMenuItem>
      )}
      <ContextMenuItem
        icon={Link}
        onClick={() => navigator.clipboard.writeText(window.location.href)}
      >
        Copy link
      </ContextMenuItem>
      {canShare && (
        <ContextMenuItem icon={Share2} onClick={handleShare}>
          Share page
        </ContextMenuItem>
      )}
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
