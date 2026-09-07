"use client";

import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <label
        htmlFor={id}
        className="inline-flex select-none items-center gap-2 text-sm text-foreground"
      >
        <span className="relative inline-flex size-4 shrink-0">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            className={cn(
              "peer size-4 shrink-0 cursor-pointer appearance-none rounded-sm border border-input bg-card",
              "transition-colors checked:border-primary checked:bg-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            {...props}
          />
          <Check className="pointer-events-none absolute inset-0 size-4 scale-0 text-primary-foreground transition-transform peer-checked:scale-100" />
        </span>
        {label}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
