import * as React from "react";
import { cn } from "@lib/utils";

interface StepProps {
  children: React.ReactNode;
  index?: number;
  className?: string;
}

export function Step({ children, index, className }: StepProps) {
  return (
    <li className={cn("relative pl-10", className)}>
      <span className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
        {index}
      </span>
      <div className="pt-0.5">{children}</div>
    </li>
  );
}

interface StepsProps {
  children: React.ReactNode;
  className?: string;
}

export function Steps({ children, className }: StepsProps) {
  const numberedChildren = React.Children.map(children, (child, i) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<StepProps>, {
        index: i + 1,
      });
    }
    return child;
  });

  return (
    <ol
      className={cn(
        "not-prose my-6 space-y-6 border-l border-border pl-4",
        className,
      )}
    >
      {numberedChildren}
    </ol>
  );
}
