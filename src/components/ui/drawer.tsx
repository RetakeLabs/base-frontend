"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePresence } from "@/lib/use-presence";

export type DrawerSide = "left" | "right";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** Edge the panel slides in from. Defaults to "right". */
  side?: DrawerSide;
}

/**
 * Slide-over panel anchored to a screen edge. Uses the same portal +
 * usePresence pattern as Modal, but animates via `translate-x` instead of
 * scale, and stays mounted through the exit transition. Full-width on
 * mobile, capped to a fixed panel width from `sm:` up.
 */
export function Drawer({ open, onClose, title, children, className, side = "right" }: DrawerProps) {
  const { shouldRender, isVisible } = usePresence(open, 300);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!shouldRender || typeof document === "undefined") return null;

  return createPortal(
    <div className={cn("fixed inset-0 z-50 flex", side === "right" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "absolute inset-0 bg-black/50 transition-opacity duration-300 ease-in-out",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-10 flex h-full w-full flex-col bg-card text-card-foreground shadow-xl sm:max-w-md",
          side === "right" ? "border-l border-border" : "border-r border-border",
          "transition-transform duration-300 ease-in-out",
          isVisible
            ? "translate-x-0"
            : side === "right"
              ? "translate-x-full"
              : "-translate-x-full",
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="ml-auto rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}
