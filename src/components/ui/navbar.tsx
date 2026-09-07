"use client";

import { useState } from "react";
import { Menu, X, Bell, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { label: "Início", href: "#" },
  { label: "Produtos", href: "#" },
  { label: "Sobre", href: "#" },
  { label: "Contato", href: "#" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="w-full rounded-lg border border-border bg-card text-card-foreground">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <Layers className="size-5 text-primary" />
          <span>Base UI</span>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground sm:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            aria-label="Notificações"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Bell className="size-4" />
          </button>
          <Button size="sm">Entrar</Button>
        </div>

        <button
          type="button"
          aria-label="Abrir menu"
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:hidden"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-border px-4 py-3 text-sm font-medium text-muted-foreground sm:hidden">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-md px-2 py-2 transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <Button size="sm" className="mt-2 w-full">
            Entrar
          </Button>
        </nav>
      )}
    </header>
  );
}
