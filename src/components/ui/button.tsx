"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "solid" | "outline" | "ghost";
export type ButtonColor = "primary" | "secondary" | "success" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  isLoading?: boolean;
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

const colorStyles: Record<ButtonColor, Record<ButtonVariant, string>> = {
  primary: {
    solid: "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary",
    outline:
      "border border-primary text-primary hover:bg-primary/10 focus-visible:ring-primary",
    ghost: "text-primary hover:bg-primary/10 focus-visible:ring-primary",
  },
  secondary: {
    solid:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary",
    outline:
      "border border-border text-secondary-foreground hover:bg-secondary focus-visible:ring-secondary",
    ghost: "text-secondary-foreground hover:bg-secondary focus-visible:ring-secondary",
  },
  success: {
    solid: "bg-success text-success-foreground hover:bg-success/90 focus-visible:ring-success",
    outline:
      "border border-success text-success hover:bg-success/10 focus-visible:ring-success",
    ghost: "text-success hover:bg-success/10 focus-visible:ring-success",
  },
  danger: {
    solid: "bg-danger text-danger-foreground hover:bg-danger/90 focus-visible:ring-danger",
    outline:
      "border border-danger text-danger hover:bg-danger/10 focus-visible:ring-danger",
    ghost: "text-danger hover:bg-danger/10 focus-visible:ring-danger",
  },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "solid",
      color = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium whitespace-nowrap transition-all duration-200 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:pointer-events-none disabled:opacity-50",
          "active:scale-[0.98]",
          sizeStyles[size],
          colorStyles[color][variant],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="size-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
