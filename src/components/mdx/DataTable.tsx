import * as React from "react";
import { cn } from "@lib/utils";

interface Column<T extends Record<string, React.ReactNode>> {
  key: keyof T;
  header: React.ReactNode;
  align?: "left" | "right" | "center";
}

interface DataTableProps<T extends Record<string, React.ReactNode>> {
  columns: Column<T>[];
  data: T[];
  caption?: React.ReactNode;
  className?: string;
}

export function DataTable<T extends Record<string, React.ReactNode>>({
  columns,
  data,
  caption,
  className,
}: DataTableProps<T>) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-xl border border-border/50 bg-card",
        className,
      )}
    >
      <table className="w-full min-w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/50">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn(
                  "px-4 py-3 font-semibold text-foreground",
                  col.align === "right" && "text-right",
                  col.align === "center" && "text-center",
                  col.align === "left" && "text-left",
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-border/50 last:border-b-0"
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={cn(
                    "px-4 py-3 text-muted-foreground",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                    col.align === "left" && "text-left",
                  )}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {caption && (
          <caption className="caption-bottom border-t border-border/50 px-4 py-3 text-left text-xs text-muted-foreground">
            {caption}
          </caption>
        )}
      </table>
    </div>
  );
}
