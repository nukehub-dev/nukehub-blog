import { useEffect } from "react";
import { useCommandPalette } from "@lib/useCommandPalette";
import {
  CommandPalette,
  type SearchablePost,
  type SearchableAuthor,
  type SearchableCategory,
  type SearchablePage,
} from "./CommandPalette";

interface CommandPaletteManagerProps {
  posts: SearchablePost[];
  authors: SearchableAuthor[];
  categories: SearchableCategory[];
  pages: SearchablePage[];
}

export function CommandPaletteManager(props: CommandPaletteManagerProps) {
  const { isOpen, open, close } = useCommandPalette();

  useEffect(() => {
    const handleOpen = () => open();
    window.addEventListener("command-palette:open", handleOpen);
    return () => window.removeEventListener("command-palette:open", handleOpen);
  }, [open]);

  return <CommandPalette isOpen={isOpen} onClose={close} {...props} />;
}
