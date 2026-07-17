import { useEffect, useState } from "react";

import type { Workspace } from "@/types/workspace";

import WorkspaceGrid from "@/components/workspace/WorkspaceGrid";
import WorkspacesHeader from "@/components/workspace/WorkspacesHeader";
import WorkspaceDialog from "@/components/workspace/WorkspaceDialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useWorkspaceStore } from "@/store/workspaceStore";

export default function Workspaces() {
  const {
    workspaces,
    fetchWorkspaces,
    selectWorkspace,
    createNewWorkspace,
    renameWorkspace,
    removeWorkspace,
  } = useWorkspaceStore();

  const [open, setOpen] = useState(false);

  const [editingWorkspace, setEditingWorkspace] =
    useState<Workspace | null>(null);

  const [deletingWorkspace, setDeletingWorkspace] =
    useState<Workspace | null>(null);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  function handleCreate() {
    setEditingWorkspace(null);
    setOpen(true);
  }

  return (
    <div className="mx-auto max-w-7xl p-8">
      <WorkspacesHeader
        onCreate={handleCreate}
      />

      <WorkspaceGrid
        workspaces={workspaces}
        onOpen={(workspace) =>
          selectWorkspace(workspace)
        }
        onMenu={(workspace) => {
          setEditingWorkspace(workspace);
          setOpen(true);
        }}
        onDelete={(workspace) => {
          setDeletingWorkspace(workspace);
        }}
      />

      <WorkspaceDialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value);

          if (!value) {
            setEditingWorkspace(null);
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
        onSubmit={async (
          name,
          description,
        ) => {
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

          setOpen(false);
          setEditingWorkspace(null);
        }}
      />

      <AlertDialog
        open={!!deletingWorkspace}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingWorkspace(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Workspace?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. All chats,
              documents, and associated data inside this
              workspace will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={async () => {
                if (!deletingWorkspace) return;

                await removeWorkspace(
                  deletingWorkspace.id,
                );

                setDeletingWorkspace(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}