import { create } from "zustand";
import { toast } from "sonner";
import type { Workspace } from "@/types/workspace";

import {
  getWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
} from "@/services/workspace/workspaceService";

type WorkspaceState = {
  workspaces: Workspace[];

  selectedWorkspace: Workspace | null;

  fetchWorkspaces: () => Promise<void>;

  selectWorkspace: (
    workspace: Workspace,
  ) => void;

  createNewWorkspace: (
    name: string,
    description?: string,
  ) => Promise<void>;

  renameWorkspace: (
    id: number,
    name: string,
  ) => Promise<void>;

  removeWorkspace: (
    id: number,
  ) => Promise<void>;
};

export const useWorkspaceStore =
  create<WorkspaceState>((set) => ({
    workspaces: [],

    selectedWorkspace: null,

    fetchWorkspaces: async () => {
      const workspaces =
        await getWorkspaces();

      set({
        workspaces,
        selectedWorkspace:
          workspaces[0] ?? null,
      });
    },

    selectWorkspace: (
      workspace,
    ) => {
      set({
        selectedWorkspace:
          workspace,
      });
      
    },

    createNewWorkspace:
      async (
        name,
        description,
      ) => {
        const workspace =
          await createWorkspace({
            name,
            description,
            color: "#6366F1",
            icon: "folder",
          });

        toast.success(
          "Workspace created.",
        );

        set((state) => ({
          workspaces: [
            workspace,
            ...state.workspaces,
          ],
          selectedWorkspace:
            workspace,
        }));
      },

    renameWorkspace:
      async (
        id,
        name,
      ) => {
        const workspace =
          await updateWorkspace(
            id,
            {
              name,
            },
          );

        toast.success(
          "Workspace updated.",
        );

        set((state) => ({
          workspaces:
            state.workspaces.map(
              (w) =>
                w.id === id
                  ? workspace
                  : w,
            ),

          selectedWorkspace:
            state.selectedWorkspace
              ?.id === id
              ? workspace
              : state.selectedWorkspace,
        }));
      },

    removeWorkspace:
      async (
        id,
      ) => {
        await deleteWorkspace(id);

        toast.success(
          "Workspace deleted.",
        );
        set((state) => {
    const workspaces =
      state.workspaces.filter(
        (workspace) =>
          workspace.id !== id,
      );

    return {
      workspaces,

      selectedWorkspace:
        state.selectedWorkspace?.id === id
          ? workspaces[0] ?? null
          : state.selectedWorkspace,
    };
  });
},
  }));