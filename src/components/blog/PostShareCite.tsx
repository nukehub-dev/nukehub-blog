import * as React from "react";
import { Check, Quote, Share2 } from "lucide-react";
import { Button } from "@components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/Dialog";
import { SITE } from "@data/site";
import { buildCopyFormats } from "@lib/citations";
import type { CopyFormat } from "@lib/citations";
import { cn } from "@lib/utils";

interface PostShareCiteProps {
  title: string;
  /** Absolute post URL. */
  url: string;
  /** Author display names. */
  authors: string[];
  /** ISO publication date (YYYY-MM-DD). */
  date: string;
  /** BibTeX/RIS citation key (post id). */
  citationKey: string;
  /** Show the Cite button + dialog. Posts opt in via `citable` frontmatter. */
  citable?: boolean;
}

const TRIGGER_CLASS = cn(
  "inline-flex items-center gap-1.5 rounded-md border border-border/50 px-2.5 py-1 text-sm",
  "text-muted-foreground transition-colors hover:bg-card hover:text-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
);

const MENU_ITEM_CLASS = cn(
  "block w-full px-3 py-1.5 text-left text-xs font-medium text-popover-foreground",
  "transition-colors hover:bg-accent hover:text-accent-foreground",
  "focus-visible:bg-accent focus-visible:outline-none",
);

// navigator.share availability never changes after mount.
const subscribeNoop = () => () => {};

export function PostShareCite({
  title,
  url,
  authors,
  date,
  citationKey,
  citable = false,
}: PostShareCiteProps) {
  const [shareOpen, setShareOpen] = React.useState(false);
  const [citeOpen, setCiteOpen] = React.useState(false);
  // navigator.share is client-only; the false server snapshot keeps SSR and
  // hydration output identical.
  const nativeShare = React.useSyncExternalStore(
    subscribeNoop,
    () => typeof navigator.share === "function",
    () => false,
  );
  // "link" or a copy-format id, while the copied confirmation is visible.
  const [copied, setCopied] = React.useState<string | null>(null);
  const shareRef = React.useRef<HTMLDivElement>(null);
  const shareToggleRef = React.useRef<HTMLButtonElement>(null);
  const shareMenuRef = React.useRef<HTMLDivElement>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const formats = React.useMemo<CopyFormat[]>(
    () =>
      buildCopyFormats({
        id: citationKey,
        title,
        url,
        authors,
        date,
        type: "misc",
        source: SITE.name,
        publisher: SITE.name,
      }),
    [citationKey, title, url, authors, date],
  );
  const [formatId, setFormatId] = React.useState<CopyFormat["id"]>("text");
  const currentFormat = formats.find((f) => f.id === formatId) ?? formats[0];

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Share menu: focus its first item on open, close on outside click.
  React.useEffect(() => {
    if (!shareOpen) return;
    shareMenuRef.current?.querySelector<HTMLElement>("button, a")?.focus();
    const handleMouseDown = (e: MouseEvent) => {
      if (!shareRef.current?.contains(e.target as Node)) {
        setShareOpen(false);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [shareOpen]);

  const flashCopied = (id: string) => {
    setCopied(id);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(null), 2000);
  };

  const copyText = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      flashCopied(id);
    } catch {
      // Ignore clipboard errors.
    }
  };

  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShareOpen(false);
      shareToggleRef.current?.focus();
    }
  };

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  const shareLinks = [
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      // Bluesky takes a single free-form text param (title + URL).
      label: "Share on Bluesky",
      href: `https://bsky.app/intent/compose?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      // Mastodon is federated; mastodonshare.com redirects to the visitor's
      // own instance.
      label: "Share on Mastodon",
      href: `https://mastodonshare.com/?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${encodedTitle}%0A${encodedUrl}`,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <div ref={shareRef} className="relative inline-flex">
        <button
          ref={shareToggleRef}
          type="button"
          onClick={() => setShareOpen((prev) => !prev)}
          className={TRIGGER_CLASS}
          aria-haspopup="menu"
          aria-expanded={shareOpen}
        >
          {copied === "link" ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Share2 className="h-3.5 w-3.5" />
          )}
          <span>{copied === "link" ? "Link copied" : "Share"}</span>
        </button>
        {shareOpen && (
          <div
            ref={shareMenuRef}
            role="menu"
            aria-label="Share this post"
            className="absolute right-0 top-full z-50 mt-1 min-w-40 overflow-hidden rounded-lg border border-border/80 bg-popover py-1 shadow-xl"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                copyText("link", url);
                setShareOpen(false);
              }}
              onKeyDown={handleMenuKeyDown}
              className={MENU_ITEM_CLASS}
            >
              Copy link
            </button>
            {shareLinks.map((link) => (
              <a
                key={link.label}
                role="menuitem"
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                onKeyDown={handleMenuKeyDown}
                className={MENU_ITEM_CLASS}
              >
                {link.label}
              </a>
            ))}
            {nativeShare && (
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  navigator.share({ title, url }).catch(() => {});
                  setShareOpen(false);
                }}
                onKeyDown={handleMenuKeyDown}
                className={MENU_ITEM_CLASS}
              >
                More options…
              </button>
            )}
          </div>
        )}
      </div>

      {citable && (
        <>
          <button
            type="button"
            onClick={() => setCiteOpen(true)}
            className={TRIGGER_CLASS}
            aria-haspopup="dialog"
          >
            <Quote className="h-3.5 w-3.5" />
            <span>Cite</span>
          </button>

          <Dialog open={citeOpen} onOpenChange={setCiteOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cite this post</DialogTitle>
                <DialogDescription>{title}</DialogDescription>
              </DialogHeader>
              <DialogClose />
              <div className="space-y-3 px-6 pb-2">
                <div
                  role="tablist"
                  aria-label="Citation format"
                  className="flex gap-1 rounded-lg bg-muted p-1"
                >
                  {formats.map((format) => (
                    <button
                      key={format.id}
                      type="button"
                      role="tab"
                      aria-selected={format.id === currentFormat.id}
                      onClick={() => setFormatId(format.id)}
                      className={cn(
                        "flex-1 rounded-md px-2 py-1 text-xs font-medium transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                        format.id === currentFormat.id
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {format.label}
                    </button>
                  ))}
                </div>
                <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border/50 bg-muted/50 p-3 text-xs leading-relaxed text-foreground">
                  {currentFormat.text}
                </pre>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => copyText(currentFormat.id, currentFormat.text)}
                >
                  {copied === currentFormat.id ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <span>Copy {currentFormat.label}</span>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
