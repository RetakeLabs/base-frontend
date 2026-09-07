import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TooltipSide = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: TooltipSide;
  className?: string;
}

const sideStyles: Record<TooltipSide, string> = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
  right: "left-full top-1/2 ml-2 -translate-y-1/2",
};

/**
 * Pure CSS hover/focus tooltip — no positioning JS, so it never needs to
 * measure or flip; keep tooltip text short so it doesn't overflow the
 * viewport near screen edges.
 */
export function Tooltip({ content, children, side = "top", className }: TooltipProps) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-30 rounded-md bg-foreground px-2 py-1 text-xs whitespace-nowrap text-background opacity-0 shadow-md transition-opacity duration-150 ease-in-out group-hover:opacity-100 group-focus-within:opacity-100",
          sideStyles[side],
          className
        )}
      >
        {content}
      </span>
    </span>
  );
}
