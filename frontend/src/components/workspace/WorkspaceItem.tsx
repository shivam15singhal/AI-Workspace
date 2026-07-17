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
      className={`
        flex
        items-center
        justify-between
        rounded-md
        px-2
        py-1
        cursor-pointer
        ${
          selected
            ? "bg-accent"
            : "hover:bg-accent/50"
        }
      `}
      onClick={() => onSelect(workspace)}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <Folder
          className="h-4 w-4 shrink-0"
          style={{
            color: workspace.color,
          }}
        />

        <span className="truncate text-sm">
          {workspace.name}
        </span>
      </div>

      <WorkspaceActions
        workspace={workspace}
        onRename={onRename}
        onDelete={onDelete}
      />
    </div>
  );
}