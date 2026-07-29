import type { Workspace } from "@/types/workspace";

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

interface DeleteWorkspaceDialogProps {
  workspace: Workspace | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteWorkspaceDialog({
  workspace,
  open,
  onOpenChange,
  onConfirm,
}: DeleteWorkspaceDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent className="rounded-2xl border border-border/60 shadow-xl">
        <AlertDialogHeader className="space-y-3">
          <AlertDialogTitle className="text-xl font-semibold tracking-tight">
            Delete Workspace
          </AlertDialogTitle>

          <AlertDialogDescription className="leading-7 text-muted-foreground">
            {workspace ? (
              <>
                You're about to permanently delete{" "}
                <span className="font-semibold text-foreground">
                  {workspace.name}
                </span>
                .
                <br />
                <br />
                All chats, documents, AI agents, settings, and associated
                workspace data will be permanently removed.
                <br />
                <br />
                This action cannot be undone.
              </>
            ) : (
              <>
                This workspace and all associated data will be permanently
                deleted.
                <br />
                <br />
                This action cannot be undone.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            className="rounded-xl bg-destructive hover:bg-destructive/90"
          >
            Delete Workspace
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}