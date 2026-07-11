"use client";

import * as React from "react";
import { cn } from "@lib/utils";
import { ChevronDown, Check, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  value: string | null;
  onChange: (value: string | null) => void;
  options: ComboboxOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  searchPlaceholder?: string;
  clearable?: boolean;
}

export function Combobox({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className,
  disabled,
  searchPlaceholder = "Search...",
  clearable = false,
}: ComboboxProps) {
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

  const selectedOption = React.useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value],
  );

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
          !value && "text-muted-foreground",
        )}
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <span className="ml-2 flex shrink-0 items-center gap-1">
          {clearable && value && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  onChange(null);
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
            className="absolute z-50 mt-1 w-full min-w-[12rem] overflow-hidden rounded-xl border border-border bg-popover shadow-lg"
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
                  const isSelected = value === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onChange(option.value);
                        setOpen(false);
                        setSearch("");
                      }}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
