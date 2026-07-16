import { useEffect, useId, useRef, useState } from "react";
import { Maximize2, X } from "lucide-react";
import { cn } from "@lib/utils";

interface MermaidProps {
  chart: string;
  className?: string;
}

function getResolvedTheme(): "default" | "dark" {
  if (typeof document === "undefined") return "default";
  const theme = document.documentElement.getAttribute("data-theme");
  return theme === "dark" ? "dark" : "default";
}

export function Mermaid({ chart, className }: MermaidProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [expanded, setExpanded] = useState(false);
  const chartRef = useRef(chart);
  const isMountedRef = useRef(true);

  // Keep chartRef in sync so async renders use the latest chart source.
  useEffect(() => {
    chartRef.current = chart;
  });

  // Lock body scroll and close on Escape while expanded.
  useEffect(() => {
    if (!expanded || typeof document === "undefined") return;
    document.body.classList.add("overflow-hidden");
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.classList.remove("overflow-hidden");
      document.removeEventListener("keydown", handleKey);
    };
  }, [expanded]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const renderChart = async () => {
    if (typeof window === "undefined") return;

    const mod = await import("mermaid");
    const mermaid = mod.default;

    mermaid.initialize({
      startOnLoad: false,
      theme: getResolvedTheme(),
      securityLevel: "loose",
    });

    try {
      const { svg: renderedSvg } = await mermaid.render(
        `mermaid-${id}`,
        chartRef.current,
      );
      if (isMountedRef.current) setSvg(renderedSvg);
    } catch {
      if (isMountedRef.current) setSvg("<p>Failed to render diagram.</p>");
    }
  };

  // Initial render.
  useEffect(() => {
    let cancelled = false;
    renderChart().then(() => {
      if (cancelled) return;
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-render when the theme changes.
  useEffect(() => {
    if (typeof document === "undefined") return;

    const observer = new MutationObserver(() => {
      renderChart();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-render when the chart source changes.
  useEffect(() => {
    renderChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart]);

  return (
    <div
      className={cn(
        "not-prose relative",
        expanded
          ? "fixed inset-0 z-50 flex flex-col bg-background/80 backdrop-blur-sm"
          : "my-6 overflow-hidden rounded-xl border border-border/50 bg-card",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="absolute right-3 top-3 z-10 rounded-lg border border-border/50 bg-background/80 p-1.5 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-muted hover:text-foreground"
        aria-label={expanded ? "Close diagram" : "Expand diagram"}
      >
        {expanded ? <X size={16} /> : <Maximize2 size={16} />}
      </button>
      <div
        ref={ref}
        className={cn(
          "overflow-auto p-4 [&_svg]:mx-auto",
          expanded &&
            "mermaid-expanded flex flex-1 items-center justify-center",
        )}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
