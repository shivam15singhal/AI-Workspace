import {
  ChevronDown,
  Folder,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import WorkspaceDialog from "./WorkspaceDialog";
import WorkspaceItem from "./WorkspaceItem";
import DeleteWorkspaceDialog from "./DeleteWorkspaceDialog";

import type { Workspace } from "@/types/workspace";

import { useWorkspaceStore } from "@/store/workspaceStore";
import { useChatStore } from "@/store/chatStore";
import { useDocumentStore } from "@/store/documentStore";

export default function WorkspaceSwitcher() {
  const {
    workspaces,
    selectedWorkspace,
    fetchWorkspaces,
    selectWorkspace,
    createNewWorkspace,
    renameWorkspace,
    removeWorkspace,
  } = useWorkspaceStore();

  const { fetchChats } = useChatStore();
  const { fetchDocuments } = useDocumentStore();

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [editingWorkspace, setEditingWorkspace] =
    useState<Workspace | null>(null);

  const [deletingWorkspace, setDeletingWorkspace] =
    useState<Workspace | null>(null);

  useEffect(() => {
    async function load() {
      await fetchWorkspaces();

      if (
        useWorkspaceStore.getState()
          .selectedWorkspace
      ) {
        await Promise.all([
          fetchChats(),
          fetchDocuments(),
        ]);
      }
    }

    load();
  }, [
    fetchWorkspaces,
    fetchChats,
    fetchDocuments,
  ]);

  async function handleWorkspaceSelect(
    workspace: Workspace,
  ) {
    selectWorkspace(workspace);

    await Promise.all([
      fetchChats(),
      fetchDocuments(),
    ]);
  }

  async function handleSubmit(
    name: string,
    description: string,
  ) {
    if (editingWorkspace) {
      await renameWorkspace(
        editingWorkspace.id,
        name,
      );
    } else {
      await createNewWorkspace(
        name,
        description,
      );
    }

    setDialogOpen(false);
    setEditingWorkspace(null);
  }

  async function handleDelete() {
    if (!deletingWorkspace) return;

    await removeWorkspace(
      deletingWorkspace.id,
    );

    setDeletingWorkspace(null);

    await fetchWorkspaces();

    const firstWorkspace =
      useWorkspaceStore.getState()
        .workspaces[0];

    if (firstWorkspace) {
      await handleWorkspaceSelect(
        firstWorkspace,
      );
    }
  }

  return (
    <>
      <div className="px-4 pb-4">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="
              flex
              w-full
              items-center
              justify-between
              rounded-lg
              border
              px-3
              py-2
              text-sm
              hover:bg-accent
            "
          >
            <div className="flex items-center gap-2">
              <Folder
                className="h-4 w-4"
                style={{
                  color:
                    selectedWorkspace?.color,
                }}
              />

              <span className="truncate">
                {selectedWorkspace?.name ??
                  "Select Workspace"}
              </span>
            </div>

            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="w-72"
          >
            {workspaces.map((workspace) => (
              <WorkspaceItem
                key={workspace.id}
                workspace={workspace}
                selected={
                  workspace.id ===
                  selectedWorkspace?.id
                }
                onSelect={
                  handleWorkspaceSelect
                }
                onRename={(
                  workspace,
                ) => {
                  setEditingWorkspace(
                    workspace,
                  );
                  setDialogOpen(true);
                }}
                onDelete={(
                  workspace,
                ) =>
                  setDeletingWorkspace(
                    workspace,
                  )
                }
              />
            ))}

            <DropdownMenuSeparator />

            <div
              className="
                flex
                cursor-pointer
                items-center
                gap-2
                rounded-md
                px-2
                py-2
                text-sm
                hover:bg-accent
              "
              onClick={() => {
                setEditingWorkspace(
                  null,
                );
                setDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              New Workspace
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <WorkspaceDialog
        open={dialogOpen}
        onOpenChange={(
          open,
        ) => {
          setDialogOpen(open);

          if (!open) {
            setEditingWorkspace(
              null,
            );
          }
        }}
        title={
          editingWorkspace
            ? "Rename Workspace"
            : "Create Workspace"
        }
        submitText={
          editingWorkspace
            ? "Save"
            : "Create"
        }
        initialName={
          editingWorkspace?.name
        }
        initialDescription={
          editingWorkspace?.description ??
          ""
        }
        onSubmit={handleSubmit}
      />

      <DeleteWorkspaceDialog
        workspace={
          deletingWorkspace
        }
        open={
          !!deletingWorkspace
        }
        onOpenChange={(
          open,
        ) => {
          if (!open) {
            setDeletingWorkspace(
              null,
            );
          }
        }}
        onConfirm={handleDelete}
      />
    </>
  );
}