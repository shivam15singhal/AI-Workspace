import { Folder } from "lucide-react";

import type { Workspace } from "@/types/workspace";

import WorkspaceActions from "./WorkspaceActions";

interface WorkspaceItemProps {
  workspace: Workspace;
  selected: boolean;
  onSelect: (workspace: Workspace) => void;
  onRename: (workspace: Workspace) => void;
  onDelete: (workspace: Workspace) => void;
}

export default function WorkspaceItem({
  workspace,
  selected,
  onSelect,
  onRename,
  onDelete,
}: WorkspaceItemProps) {
  return (
    <div
      onClick={() => onSelect(workspace)}
      className={`
        group
        flex
        cursor-pointer
        items-center
        justify-between
        rounded-xl
        px-3
        py-2.5
        transition-all
        duration-200
        ${
          selected
            ? "bg-primary/10 ring-1 ring-primary/20"
            : "hover:bg-accent/60"
        }
      `}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{
            backgroundColor: `${workspace.color}20`,
          }}
        >
          <Folder
            className="h-4 w-4"
            style={{
              color: workspace.color,
            }}
          />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {workspace.name}
          </p>

          <p className="text-xs text-muted-foreground">
            Workspace
          </p>
        </div>
      </div>

      <div className="opacity-0 transition-opacity group-hover:opacity-100">
        <WorkspaceActions
          workspace={workspace}
          onRename={onRename}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}