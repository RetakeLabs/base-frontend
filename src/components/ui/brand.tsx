"use client";

import { Layers } from "lucide-react";
import { cn } from "@/lib/utils";

/** Default white-label identity — swap for the values saved via `BrandingSettingsForm` in a real app. */
export const COMPANY_NAME = "ZeroLag";

export interface BrandProps {
  /** Icon-only, no name — for tight spaces. */
  collapsed?: boolean;
  className?: string;
}

/**
 * Logo mark + company name. Lives in the `DashboardLayout` header (full
 * width, above the sidebar), which is why it's always shown at full size
 * there — `collapsed` is kept for other, tighter contexts if you need it.
 */
export function Brand({ collapsed = false, className }: BrandProps) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Layers className="size-4" />
      </span>
      {!collapsed && (
        <span
          className="truncate text-sm font-semibold text-foreground"
          title={COMPANY_NAME}
        >
          {COMPANY_NAME}
        </span>
      )}
    </div>
  );
}
