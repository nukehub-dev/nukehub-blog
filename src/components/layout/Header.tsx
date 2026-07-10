import * as React from "react";
import { cn } from "@lib/utils";
import { navItems } from "@data/nav";
import { Logo } from "@components/ui/Logo";
import { ThemeToggle } from "@components/shared/ThemeToggle";
import { Menu, X, Search } from "lucide-react";

export function Header() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2 text-lg font-semibold text-foreground transition-opacity hover:opacity-80"
        >
          <Logo size={24} className="text-primary" />
          <span>NukeHub Blog</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.title}
              href={item.url}
              target={item.newpage ? "_blank" : undefined}
              rel={item.newpage ? "noopener noreferrer" : undefined}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </a>
          ))}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Command palette trigger */}
          <button
            onClick={() =>
              window.dispatchEvent(new CustomEvent("command-palette:open"))
            }
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label="Open search"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>

          {/* Theme + accent appearance toggle */}
          <ThemeToggle variant="dropdown" />

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div id="mobile-nav" className="border-t border-border lg:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4">
            {navItems.map((item) => (
              <a
                key={item.title}
                href={item.url}
                target={item.newpage ? "_blank" : undefined}
                rel={item.newpage ? "noopener noreferrer" : undefined}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                onClick={() => setMobileOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
