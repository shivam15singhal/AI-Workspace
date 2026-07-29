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
        border
        px-3
        py-2.5
        transition-all
        duration-200
        ${
          selected
            ? `
              border-primary/20
              bg-primary/10
              shadow-sm
            `
            : `
              border-transparent
              hover:border-border/60
              hover:bg-accent/60
            `
        }
      `}
    >
      <div className="flex min-w-0 items-center gap-3">
        {/* Folder Icon */}
        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            transition-transform
            duration-200
            group-hover:scale-105
          "
          style={{
            backgroundColor: `${workspace.color}20`,
          }}
        >
          <Folder
            className="h-5 w-5"
            style={{
              color: workspace.color,
            }}
          />
        </div>

        {/* Workspace Info */}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {workspace.name}
          </p>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Workspace
          </p>
        </div>
      </div>

      {/* Actions */}
      <div
        className="
          translate-x-1
          opacity-0
          transition-all
          duration-200
          group-hover:translate-x-0
          group-hover:opacity-100
        "
      >
        <WorkspaceActions
          workspace={workspace}
          onRename={onRename}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}