"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu } from "@/components/ui/dropdown-menu";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  read: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "Novo pedido recebido",
    description: "Pedido #1082 está aguardando aprovação.",
    read: false,
  },
  {
    id: "2",
    title: "Pagamento confirmado",
    description: "A fatura INV-004 foi paga com sucesso.",
    read: false,
  },
  {
    id: "3",
    title: "Atualização do sistema",
    description: "Uma nova versão do painel já está disponível.",
    read: true,
  },
];

export function NotificationsMenu() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  function markRead(id: string) {
    setNotifications((current) => current.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  function markAllRead() {
    setNotifications((current) => current.map((n) => ({ ...n, read: true })));
  }

  return (
    <DropdownMenu
      align="right"
      className="w-80 p-0"
      trigger={
        <span
          className="relative flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Notificações"
        >
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-danger text-[10px] font-medium text-danger-foreground">
              {unreadCount}
            </span>
          )}
        </span>
      }
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-sm font-semibold">Notificações</span>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="text-xs font-medium text-primary hover:underline"
          >
            Marcar todas como lidas
          </button>
        )}
      </div>
      <ul className="max-h-80 overflow-y-auto">
        {notifications.map((notification) => (
          <li key={notification.id}>
            <button
              type="button"
              onClick={() => markRead(notification.id)}
              className={cn(
                "flex w-full items-start gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-muted",
                !notification.read && "bg-primary/5"
              )}
            >
              <span
                className={cn(
                  "mt-1.5 size-2 shrink-0 rounded-full",
                  notification.read ? "bg-transparent" : "bg-primary"
                )}
              />
              <div className="flex flex-col gap-0.5">
                <span
                  className={cn(
                    "font-medium",
                    notification.read ? "text-muted-foreground" : "text-foreground"
                  )}
                >
                  {notification.title}
                </span>
                <span className="text-xs text-muted-foreground">{notification.description}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </DropdownMenu>
  );
}
