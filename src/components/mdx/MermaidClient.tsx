import { useEffect, useId, useRef, useState } from "react";
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
  const chartRef = useRef(chart);
  const isMountedRef = useRef(true);
  chartRef.current = chart;

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
      ref={ref}
      className={cn("my-6 overflow-x-auto", className)}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
