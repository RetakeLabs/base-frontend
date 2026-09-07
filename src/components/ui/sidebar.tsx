"use client";

import { useState } from "react";
import {
  ChevronsLeft,
  ChevronsRight,
  Home,
  Settings,
  Users,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { label: "Início", icon: Home },
  { label: "Relatórios", icon: BarChart3 },
  { label: "Equipe", icon: Users },
  { label: "Configurações", icon: Settings },
];

export interface SidebarProps {
  /**
   * "card": floating, all-round border + rounded corners — for standalone
   * showcase/demo usage.
   * "panel": flush against its container (used inside DashboardLayout),
   * full height, only a right border, no rounding, so it joins seamlessly
   * with the header next to it.
   */
  variant?: "card" | "panel";
  /** Called after a nav item is selected — e.g. to close a mobile drawer. */
  onNavigate?: () => void;
  /** Controlled collapse state. Omit to let Sidebar manage it internally (e.g. showcase demo). */
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({
  variant = "card",
  onNavigate,
  collapsed: collapsedProp,
  onCollapsedChange,
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = collapsedProp ?? internalCollapsed;
  const [active, setActive] = useState(items[0].label);

  function toggleCollapsed() {
    const next = !collapsed;
    onCollapsedChange?.(next);
    if (collapsedProp === undefined) setInternalCollapsed(next);
  }

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col gap-2 bg-card p-3 text-card-foreground transition-[width] duration-200 ease-in-out",
        variant === "card"
          ? "rounded-lg border border-border"
          : "border-r border-border",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Collapsed: a compact expand button sits above the nav — it's the
          only thing that fits in the narrow rail. Expanded: no button here
          at all (no blank row) — the collapse control moves to the bottom,
          styled like a nav item instead. */}
      {collapsed && (
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label="Expandir menu"
          className="flex shrink-0 items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ChevronsRight className="size-4" />
        </button>
      )}

      <nav className="flex flex-col gap-1">
        {items.map(({ label, icon: Icon }, index) => {
          const isActive = active === label;
          const navButton = (
            <button
              key={label}
              type="button"
              onClick={() => {
                setActive(label);
                onNavigate?.();
              }}
              title={collapsed ? label : undefined}
              className={cn(
                "flex flex-1 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </button>
          );

          // Expanded only: the collapse arrow rides along the first item's
          // row instead of taking a row of its own.
          if (index === 0 && !collapsed) {
            return (
              <div key={label} className="flex items-center gap-1">
                {navButton}
                <button
                  type="button"
                  onClick={toggleCollapsed}
                  aria-label="Recolher menu"
                  className="flex shrink-0 items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <ChevronsLeft className="size-4" />
                </button>
              </div>
            );
          }

          return navButton;
        })}
      </nav>
    </aside>
  );
}
