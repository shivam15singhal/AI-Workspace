import api from "@/api/axios";

import type { Workspace } from "@/types/workspace";

export async function getWorkspaces(): Promise<Workspace[]> {
  const response = await api.get(
    "/api/workspaces",
  );

  return response.data;
}

export async function createWorkspace(
  data: {
    name: string;
    description?: string;
    color?: string;
    icon?: string;
  },
): Promise<Workspace> {
  const response = await api.post(
    "/api/workspaces",
    data,
  );

  return response.data;
}

export async function updateWorkspace(
  id: number,
  data: {
    name?: string;
    description?: string;
    color?: string;
    icon?: string;
  },
): Promise<Workspace> {
  const response = await api.patch(
    `/api/workspaces/${id}`,
    data,
  );

  return response.data;
}

export async function deleteWorkspace(
  id: number,
) {
  await api.delete(
    `/api/workspaces/${id}`,
  );
}