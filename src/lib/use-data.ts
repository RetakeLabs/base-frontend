"use client";

import { useQuery } from "@tanstack/react-query";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  status: "active" | "invited";
}

const mockTeamMembers: TeamMember[] = [
  { id: "1", name: "Ana Souza", role: "Engenheira Frontend", email: "ana@empresa.com", status: "active" },
  { id: "2", name: "Bruno Lima", role: "Product Designer", email: "bruno@empresa.com", status: "active" },
  { id: "3", name: "Carla Dias", role: "Engenheira Backend", email: "carla@empresa.com", status: "invited" },
  { id: "4", name: "Diego Alves", role: "Growth Manager", email: "diego@empresa.com", status: "active" },
  { id: "5", name: "Elisa Ramos", role: "Customer Success", email: "elisa@empresa.com", status: "invited" },
  { id: "6", name: "Felipe Rocha", role: "Engenheiro Frontend", email: "felipe@empresa.com", status: "active" },
  { id: "7", name: "Gabriela Melo", role: "Head de Produto", email: "gabriela@empresa.com", status: "active" },
];

/**
 * Simulates a GET request. Swap the body for
 * `api.get<TeamMember[]>("/team")` (see `src/lib/api.ts`) once a real
 * endpoint exists — the `useQuery` call below doesn't need to change.
 */
async function fetchTeamMembers(): Promise<TeamMember[]> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  return mockTeamMembers;
}

export function useData() {
  return useQuery({
    queryKey: ["team-members"],
    queryFn: fetchTeamMembers,
  });
}
