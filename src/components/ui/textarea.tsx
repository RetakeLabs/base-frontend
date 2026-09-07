"use client";

import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

/** Same design tokens as `Input` (border, focus ring, bg, dark mode) so the two feel identical in a form. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, id, rows = 4, ...props }, ref) => {
    return (
      <div className="flex w-full flex-col gap-1.5">
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          aria-invalid={!!error}
          className={cn(
            "w-full resize-y rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground",
            "placeholder:text-muted-foreground",
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-danger focus-visible:ring-danger",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
