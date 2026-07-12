import { useEffect, useRef, useState } from "react";
import type { Data, Layout, Config } from "plotly.js";
import { cn } from "@lib/utils";

interface PlotlyProps {
  data: Data[];
  layout?: Partial<Layout>;
  config?: Partial<Config>;
  className?: string;
}

function getResolvedColor(variable: string): string {
  if (typeof document === "undefined") return "#000000";

  // Plotly's parser does not always understand oklch/color-mix, so resolve the
  // custom property through a real element's computed `color`.
  const probe = document.createElement("div");
  probe.style.position = "fixed";
  probe.style.visibility = "hidden";
  probe.style.color = `var(${variable})`;
  document.body.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  document.body.removeChild(probe);
  return resolved || "#000000";
}

function getThemeColors() {
  return {
    background: getResolvedColor("--background"),
    foreground: getResolvedColor("--foreground"),
    muted: getResolvedColor("--muted"),
    mutedForeground: getResolvedColor("--muted-foreground"),
    border: getResolvedColor("--border"),
  };
}

const BASE_CONFIG: Partial<Config> = {
  displaylogo: false,
  responsive: true,
  displayModeBar: true,
  modeBarButtonsToRemove: ["lasso2d", "select2d", "autoScale2d"],
};

function buildConfig(userConfig: Partial<Config> | undefined): Partial<Config> {
  return {
    ...BASE_CONFIG,
    ...userConfig,
  };
}

function buildLayout(
  userLayout: Partial<Layout> | undefined,
  colors: ReturnType<typeof getThemeColors>,
): Partial<Layout> {
  return {
    paper_bgcolor: colors.background,
    plot_bgcolor: colors.background,
    font: { color: colors.foreground },
    xaxis: {
      gridcolor: colors.border,
      zerolinecolor: colors.border,
      linecolor: colors.mutedForeground,
      tickfont: { color: colors.foreground },
      title: { font: { color: colors.foreground } },
      ...userLayout?.xaxis,
    },
    yaxis: {
      gridcolor: colors.border,
      zerolinecolor: colors.border,
      linecolor: colors.mutedForeground,
      tickfont: { color: colors.foreground },
      title: { font: { color: colors.foreground } },
      ...userLayout?.yaxis,
    },
    legend: {
      font: { color: colors.foreground },
      bgcolor: "rgba(0,0,0,0)",
      ...userLayout?.legend,
    },
    modebar: {
      color: colors.foreground,
      bgcolor: "rgba(0,0,0,0)",
      activecolor: colors.mutedForeground,
      ...userLayout?.modebar,
    },
    margin: { t: 32, r: 16, b: 32, l: 48, ...userLayout?.margin },
    autosize: true,
    ...userLayout,
  };
}

export function Plotly({ data, layout, config, className }: PlotlyProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const plotlyRef = useRef<typeof import("plotly.js") | null>(null);

  useEffect(() => {
    let cancelled = false;

    import("plotly.js-dist-min").then((mod) => {
      if (cancelled || !ref.current) return;

      const Plotly = mod.default as unknown as typeof import("plotly.js");
      plotlyRef.current = Plotly;
      const colors = getThemeColors();

      Plotly.newPlot(
        ref.current,
        data,
        buildLayout(layout, colors),
        buildConfig(config),
      ).then(() => {
        if (!cancelled) setIsReady(true);
      });
    });

    return () => {
      cancelled = true;
    };
  }, [data, layout, config]);

  // Update the chart when the theme changes.
  useEffect(() => {
    if (typeof document === "undefined" || !ref.current) return;

    const observer = new MutationObserver(() => {
      const Plotly = plotlyRef.current;
      if (!Plotly || !ref.current) return;

      const colors = getThemeColors();
      Plotly.react(
        ref.current,
        data,
        buildLayout(layout, colors),
        buildConfig(config),
      );
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, [data, layout, config]);

  // Keep the chart sized correctly when the window resizes.
  useEffect(() => {
    if (typeof window === "undefined" || !ref.current) return;

    const handleResize = () => {
      const Plotly = plotlyRef.current;
      if (Plotly && ref.current) {
        Plotly.Plots.resize(ref.current);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl border border-border/50",
        "aspect-video bg-background",
        className,
      )}
    >
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
          Loading chart…
        </div>
      )}
      <div ref={ref} className="h-full w-full" />
    </div>
  );
}
