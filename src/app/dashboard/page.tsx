import { Users, DollarSign, TrendingDown } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { DashboardChart } from "@/components/ui/dashboard-chart";
import { getDashboardData } from "@/lib/dashboard-data";
import { DashboardCustomersPanel } from "./customers-panel";

/**
 * Server Component: the data fetch below runs on the server, before any
 * HTML is sent — no client-side loading spinner for the initial render, no
 * waterfall through `useQuery`. Only the pieces that need interactivity
 * (`DashboardChart` for its resize/tooltip JS, `DashboardCustomersPanel`
 * for sorting/CSV export/row actions) are their own `"use client"`
 * boundaries; everything else here — layout, metric cards, the chart's
 * `Card` wrapper — ships zero extra JS.
 */
export default async function DashboardPage() {
  const { customers, revenueData } = await getDashboardData();

  return (
    <DashboardLayout
      title="Visão geral"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Relatórios", href: "/dashboard" },
        { label: "Visão geral" },
      ]}
    >
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard
            title="Assinantes ativos"
            value="1.284"
            icon={Users}
            trend={{ value: "+12,4%", direction: "up" }}
          />
          <MetricCard
            title="MRR"
            value="R$ 42.900"
            icon={DollarSign}
            trend={{ value: "+8,1%", direction: "up" }}
          />
          <MetricCard
            title="Churn (30d)"
            value="2,1%"
            icon={TrendingDown}
            trend={{ value: "-0,6%", direction: "down" }}
          />
        </div>

        <Card title="Receita mensal" description="Últimos 6 meses">
          <DashboardChart data={revenueData} />
        </Card>

        <DashboardCustomersPanel customers={customers} />
      </div>
    </DashboardLayout>
  );
}
