"use client";

import { useId } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

export interface ChartDatum {
  label: string;
  value: number;
}

export interface DashboardChartProps {
  data: ChartDatum[];
  className?: string;
  height?: number;
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(
    value
  );
}

/**
 * Theme-aware area chart: every color is a CSS variable (`var(--color-*)`)
 * instead of a hardcoded hex, so it repaints automatically when `next-themes`
 * toggles the `.dark` class — no JS re-render needed for the color switch.
 */
export function DashboardChart({ data, className, height = 280 }: DashboardChartProps) {
  const gradientId = `dashboard-chart-fill-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="var(--color-border)"
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "var(--color-border)" }}
          />
          <YAxis
            width={44}
            stroke="var(--color-border)"
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatCompactNumber}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-card)",
              borderColor: "var(--color-border)",
              borderRadius: 8,
              color: "var(--color-foreground)",
              fontSize: 12,
            }}
            labelStyle={{ color: "var(--color-muted-foreground)" }}
            cursor={{ stroke: "var(--color-border)" }}
            formatter={(value) => new Intl.NumberFormat("pt-BR").format(Number(value ?? 0))}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--color-primary)"
            strokeWidth={2}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
