import { cn } from "@lib/utils";
import { Info, AlertTriangle, Lightbulb, CheckCircle } from "lucide-react";
import type { ReactNode } from "react";

interface CalloutProps {
  type?: "info" | "note" | "warning" | "tip" | "success" | "danger";
  title?: string;
  children: ReactNode;
  className?: string;
}

const icons = {
  info: Info,
  note: Info,
  warning: AlertTriangle,
  tip: Lightbulb,
  success: CheckCircle,
  danger: AlertTriangle,
};

const styles = {
  info: "border-blue-500/20 bg-blue-500/10 text-blue-900 dark:text-blue-100",
  note: "border-blue-500/20 bg-blue-500/10 text-blue-900 dark:text-blue-100",
  warning:
    "border-amber-500/20 bg-amber-500/10 text-amber-900 dark:text-amber-100",
  tip: "border-emerald-500/20 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100",
  success:
    "border-green-500/20 bg-green-500/10 text-green-900 dark:text-green-100",
  danger: "border-red-500/20 bg-red-500/10 text-red-900 dark:text-red-100",
};

const iconStyles = {
  info: "text-blue-600 dark:text-blue-300",
  note: "text-blue-600 dark:text-blue-300",
  warning: "text-amber-600 dark:text-amber-300",
  tip: "text-emerald-600 dark:text-emerald-300",
  success: "text-green-600 dark:text-green-300",
  danger: "text-red-600 dark:text-red-300",
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
        "my-6 rounded-xl border px-4 py-2.5",
        styles[type],
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <Icon
          size={16}
          className={cn("mt-1 shrink-0", iconStyles[type])}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          {title && (
            <strong className="block text-sm font-semibold capitalize">
              {title}
            </strong>
          )}
          <div className="text-sm leading-relaxed [&_p]:my-0 [&>:first-child]:mt-0 [&>:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
