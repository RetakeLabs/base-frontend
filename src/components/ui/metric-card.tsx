import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface MetricCardTrend {
  value: string;
  direction: "up" | "down";
}

export interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: MetricCardTrend;
  className?: string;
}

export function MetricCard({ title, value, icon: Icon, trend, className }: MetricCardProps) {
  return (
    <Card className={cn("flex-row items-center justify-between gap-4", className)}>
      <div className="flex flex-col gap-1.5">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
        {trend && (
          <Badge color={trend.direction === "up" ? "success" : "danger"} className="w-fit gap-1">
            {trend.direction === "up" ? (
              <ArrowUpRight className="size-3" />
            ) : (
              <ArrowDownRight className="size-3" />
            )}
            {trend.value}
          </Badge>
        )}
      </div>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
    </Card>
  );
}
