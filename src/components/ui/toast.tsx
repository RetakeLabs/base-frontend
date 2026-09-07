"use client";

import { useTheme } from "next-themes";
import { toast as sonnerToast, Toaster as SonnerToaster } from "sonner";

export type ToastVariant = "default" | "success" | "danger";

export interface ToastInput {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

/**
 * Thin adapter over Sonner so every existing call site
 * (`toast({ title, description, variant })`) keeps working unchanged.
 */
export function toast({ title, description, variant = "default" }: ToastInput) {
  if (variant === "success") return sonnerToast.success(title, { description });
  if (variant === "danger") return sonnerToast.error(title, { description });
  return sonnerToast(title, { description });
}

/** Mount once in the root layout. Styled with our design tokens via `unstyled` + `classNames`. */
export function Toaster() {
  const { resolvedTheme } = useTheme();

  return (
    <SonnerToaster
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position="top-right"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-full items-start gap-3 rounded-lg border border-border bg-card p-4 text-sm text-foreground shadow-lg",
          title: "font-medium text-foreground",
          description: "text-muted-foreground",
          icon: "mt-0.5",
          success: "[&_[data-icon]]:text-success",
          error: "[&_[data-icon]]:text-danger",
          closeButton:
            "!border-border !bg-card !text-muted-foreground hover:!text-foreground",
        },
      }}
    />
  );
}
