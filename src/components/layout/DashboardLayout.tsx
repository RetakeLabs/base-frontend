"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Menu, Settings, User } from "lucide-react";
import { Sidebar } from "@/components/ui/sidebar";
import { Brand } from "@/components/ui/brand";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/breadcrumb";
import { NotificationsMenu } from "@/components/ui/notifications";
import { Drawer } from "@/components/ui/drawer";

export interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export function DashboardLayout({
  children,
  title = "Dashboard",
  breadcrumbs,
}: DashboardLayoutProps) {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  function handleLogout() {
    // Demo only: clears the cookie `src/proxy.ts` checks for. A real app
    // would also invalidate the session server-side.
    document.cookie = "auth-token=; path=/; max-age=0";
    router.push("/login");
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      {/* Full-width, edge-to-edge top bar — sits ABOVE the sidebar/content
          row below, so it never resizes or shifts when the sidebar
          collapses or the mobile drawer opens. `sticky` keeps it pinned
          even if this component is ever used somewhere that scrolls as a
          whole. Brand lives only here now — the sidebar no longer repeats it. */}
      <header className="sticky top-0 z-30 flex h-16 w-full shrink-0 items-center border-b border-border bg-card">
        {/* Fixed-width brand column: intentionally always the sidebar's
            *expanded* width (`lg:w-56`, same as Sidebar's own `w-56`) and
            never the collapsed one — collapsing the sidebar below never
            resizes this column. */}
        <div className="flex h-full shrink-0 items-center justify-center gap-3 px-4 lg:w-56 lg:border-r lg:border-border">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Abrir menu"
            className="-ml-1.5 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
          >
            <Menu className="size-5" />
          </button>

          <Brand />
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-between gap-4 px-4 sm:px-6">
          <h1 className="truncate text-lg font-semibold">{title}</h1>

          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <NotificationsMenu />

            <DropdownMenu
              trigger={
                <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20">
                  <User className="size-4" />
                </span>
              }
            >
              <DropdownMenuItem>
                <User className="size-4" />
                Meu perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="size-4" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuItem destructive onClick={handleLogout}>
                <LogOut className="size-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Static sidebar: desktop only. Below `lg`, it lives in the Drawer
            instead. Collapsing it only ever resizes this row — the header
            above is a separate flex item and is never affected. */}
        <div className="hidden lg:block">
          <Sidebar variant="panel" />
        </div>

        <Drawer
          open={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
          side="left"
          className="max-w-72"
        >
          <Sidebar onNavigate={() => setMobileNavOpen(false)} />
        </Drawer>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumb items={breadcrumbs} className="mb-4" />
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
