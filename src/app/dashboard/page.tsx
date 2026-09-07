"use client";

import { Users, DollarSign, TrendingDown } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricCard } from "@/components/ui/metric-card";
import { DashboardChart, type ChartDatum } from "@/components/ui/dashboard-chart";
import { toast } from "@/components/ui/toast";

interface Customer {
  id: string;
  name: string;
  email: string;
  plan: "Free" | "Pro" | "Enterprise";
  status: "active" | "inactive";
}

const customers: Customer[] = [
  { id: "1", name: "Ana Souza", email: "ana@empresa.com", plan: "Pro", status: "active" },
  { id: "2", name: "Bruno Lima", email: "bruno@empresa.com", plan: "Free", status: "inactive" },
  { id: "3", name: "Carla Dias", email: "carla@empresa.com", plan: "Enterprise", status: "active" },
  { id: "4", name: "Diego Alves", email: "diego@empresa.com", plan: "Pro", status: "active" },
  { id: "5", name: "Elisa Ramos", email: "elisa@empresa.com", plan: "Free", status: "active" },
  { id: "6", name: "Felipe Rocha", email: "felipe@empresa.com", plan: "Pro", status: "inactive" },
  { id: "7", name: "Gabriela Melo", email: "gabriela@empresa.com", plan: "Enterprise", status: "active" },
];

const columns: DataTableColumn<Customer>[] = [
  { header: "Nome", accessor: (row) => row.name, sortValue: (row) => row.name },
  { header: "E-mail", accessor: (row) => row.email, sortValue: (row) => row.email },
  { header: "Plano", accessor: (row) => row.plan, sortValue: (row) => row.plan },
  {
    header: "Status",
    accessor: (row) => (
      <Badge color={row.status === "active" ? "success" : "secondary"}>
        {row.status === "active" ? "Ativo" : "Inativo"}
      </Badge>
    ),
    csvValue: (row) => (row.status === "active" ? "Ativo" : "Inativo"),
  },
];

const revenueData: ChartDatum[] = [
  { label: "Jan", value: 28400 },
  { label: "Fev", value: 31200 },
  { label: "Mar", value: 29800 },
  { label: "Abr", value: 34500 },
  { label: "Mai", value: 37100 },
  { label: "Jun", value: 42900 },
];

export default function DashboardPage() {
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

        <Tabs defaultValue="customers">
          <TabsList>
            <TabsTrigger value="customers">Clientes</TabsTrigger>
            <TabsTrigger value="loading">Carregando</TabsTrigger>
          </TabsList>

          <TabsContent value="customers">
            <DataTable
              data={customers}
              columns={columns}
              keyExtractor={(row) => row.id}
              csvFilename="clientes.csv"
              onEdit={(row) =>
                toast({ title: "Editar cliente", description: `Abrindo edição de ${row.name}.` })
              }
              onDelete={(row) =>
                toast({
                  title: "Cliente removido",
                  description: `${row.name} foi excluído (simulação).`,
                  variant: "danger",
                })
              }
            />
          </TabsContent>

          <TabsContent value="loading">
            <Card className="gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-24 w-full" />
              <p className="text-xs text-muted-foreground">
                Estado de carregamento simulado — nenhuma requisição real acontece aqui.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
