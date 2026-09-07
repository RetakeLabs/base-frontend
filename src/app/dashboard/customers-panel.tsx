"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { toast } from "@/components/ui/toast";
import type { Customer } from "@/lib/dashboard-data";

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

/**
 * Client island: the customers list itself comes from the server
 * (`DashboardPage` fetches it and passes it down as a prop — plain data,
 * never a function), but the table needs interactivity — sort, CSV export,
 * row actions with `toast()` — so this boundary starts here, not at the
 * page level.
 */
export function DashboardCustomersPanel({ customers }: { customers: Customer[] }) {
  return (
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
  );
}
