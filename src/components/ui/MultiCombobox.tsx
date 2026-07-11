"use client";

import * as React from "react";
import { cn } from "@lib/utils";
import { ChevronDown, Check, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@components/ui/Badge";

export interface MultiComboboxOption {
  value: string;
  label: string;
}

interface MultiComboboxProps {
  values: string[];
  onChange: (values: string[]) => void;
  options: MultiComboboxOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  searchPlaceholder?: string;
}

export function MultiCombobox({
  values,
  onChange,
  options,
  placeholder = "Select...",
  className,
  disabled,
  searchPlaceholder = "Search...",
}: MultiComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return options;
    const query = search.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(query));
  }, [options, search]);

  const selectedOptions = React.useMemo(
    () => options.filter((opt) => values.includes(opt.value)),
    [options, values],
  );

  const toggle = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  const labelText =
    selectedOptions.length === 0
      ? placeholder
      : selectedOptions.length === 1
        ? selectedOptions[0].label
        : `${selectedOptions.length} selected`;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          setOpen(!open);
          if (!open) setSearch("");
        }}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          open && "ring-[3px] ring-ring/50",
          selectedOptions.length === 0 && "text-muted-foreground",
        )}
      >
        <span className="flex min-w-0 items-center gap-1.5 truncate">
          {selectedOptions.length <= 1 ? (
            <span className="truncate">{labelText}</span>
          ) : (
            <>
              <Badge variant="default" className="h-5 px-1.5 text-[10px]">
                {selectedOptions.length}
              </Badge>
              <span className="truncate text-muted-foreground">
                {placeholder}
              </span>
            </>
          )}
        </span>
        <span className="ml-2 flex shrink-0 items-center gap-1">
          {selectedOptions.length > 0 && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onChange([]);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  onChange([]);
                }
              }}
              className="rounded p-0.5 hover:bg-muted"
              aria-label="Clear selection"
            >
              <X size={12} />
            </span>
          )}
          <ChevronDown
            size={16}
            className={cn(
              "shrink-0 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1 w-full min-w-[14rem] overflow-hidden rounded-xl border border-border bg-popover shadow-lg"
          >
            <div className="border-b border-border p-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-8 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            <div className="max-h-60 space-y-0.5 overflow-auto p-1.5">
              {filteredOptions.length === 0 ? (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  No results found
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = values.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => toggle(option.value)}
                      className={cn(
                        "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none transition-colors",
                        !isSelected && "text-foreground hover:bg-accent",
                        isSelected && "bg-primary/10 text-primary",
                      )}
                    >
                      <Check
                        size={16}
                        className={cn(
                          "shrink-0",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <span className="flex-1 truncate text-left">
                        {option.label}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {selectedOptions.length > 0 && (
              <div className="border-t border-border p-2">
                <button
                  type="button"
                  onClick={() => onChange([])}
                  className="w-full rounded-lg px-3 py-1.5 text-center text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  Clear {selectedOptions.length} selected
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
