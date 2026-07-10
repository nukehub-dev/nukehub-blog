import { cn } from "@lib/utils";
import { Info, AlertTriangle, Lightbulb, CheckCircle } from "lucide-react";
import type { ReactNode } from "react";

interface CalloutProps {
  type?: "info" | "warning" | "tip" | "success";
  title?: string;
  children: ReactNode;
  className?: string;
}

const icons = {
  info: Info,
  warning: AlertTriangle,
  tip: Lightbulb,
  success: CheckCircle,
};

const styles = {
  info: "border-blue-500/20 bg-blue-500/10 text-blue-900 dark:text-blue-100",
  warning:
    "border-amber-500/20 bg-amber-500/10 text-amber-900 dark:text-amber-100",
  tip: "border-emerald-500/20 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100",
  success:
    "border-green-500/20 bg-green-500/10 text-green-900 dark:text-green-100",
};

const iconStyles = {
  info: "text-blue-600 dark:text-blue-300",
  warning: "text-amber-600 dark:text-amber-300",
  tip: "text-emerald-600 dark:text-emerald-300",
  success: "text-green-600 dark:text-green-300",
};

export function Callout({
  type = "info",
  title,
  children,
  className,
}: CalloutProps) {
  const Icon = icons[type];

  return (
    <div
      className={cn(
        "my-6 rounded-xl border px-4 py-3",
        styles[type],
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <Icon size={18} className={cn("mt-0.5 shrink-0", iconStyles[type])} />
        <div className="min-w-0 flex-1">
          {title && (
            <strong className="block text-sm font-semibold capitalize">
              {title}
            </strong>
          )}
          <div className="text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
