import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@lib/utils";

interface MermaidProps {
  chart: string;
  className?: string;
}

function getResolvedTheme(): "default" | "dark" {
  if (typeof document === "undefined") return "default";
  const theme = document.documentElement.getAttribute("data-theme");
  if (theme === "dark") return "dark";
  return "default";
}

export function Mermaid({ chart, className }: MermaidProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    import("mermaid").then((mod) => {
      if (cancelled) return;

      const mermaid = mod.default;
      mermaid.initialize({
        startOnLoad: false,
        theme: getResolvedTheme(),
        securityLevel: "loose",
      });

      mermaid
        .render(`mermaid-${id}`, chart)
        .then(({ svg: renderedSvg }) => {
          if (!cancelled) setSvg(renderedSvg);
        })
        .catch(() => {
          if (!cancelled) setSvg("<p>Failed to render diagram.</p>");
        });
    });

    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  return (
    <div
      ref={ref}
      className={cn("my-6 overflow-x-auto", className)}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
