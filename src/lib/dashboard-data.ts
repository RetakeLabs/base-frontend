import type { ChartDatum } from "@/components/ui/dashboard-chart";

export interface Customer {
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

const revenueData: ChartDatum[] = [
  { label: "Jan", value: 28400 },
  { label: "Fev", value: 31200 },
  { label: "Mar", value: 29800 },
  { label: "Abr", value: 34500 },
  { label: "Mai", value: 37100 },
  { label: "Jun", value: 42900 },
];

export interface DashboardData {
  customers: Customer[];
  revenueData: ChartDatum[];
}

/**
 * Server-only data fetch — called directly from a Server Component
 * (`src/app/dashboard/page.tsx`), never imported by a `"use client"` file.
 * Swap the body for `await api.get<DashboardData>("/dashboard")` (see
 * `src/lib/api.ts`) once a real endpoint exists; the caller doesn't change.
 */
export async function getDashboardData(): Promise<DashboardData> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { customers, revenueData };
}
