import {
  Folder,
  Calendar,
} from "lucide-react";

import type { Workspace } from "@/types/workspace";

import { Button } from "@/components/ui/button";

import WorkspaceActions from "./WorkspaceActions";

type Props = {
  workspace: Workspace;

  onOpen: () => void;

  onMenu: () => void;

  onDelete: () => void | Promise<void>;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString([], {
    dateStyle: "medium",
  });
}

export default function WorkspaceCard({
  workspace,
  onOpen,
  onMenu,
  onDelete,
}: Props) {
  return (
    <div
      className="
        group
        rounded-2xl
        border
        border-border/60
        bg-card
        p-6
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-1
        hover:border-primary/20
        hover:shadow-lg
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            transition-all
            duration-200
            group-hover:scale-105
          "
          style={{
            backgroundColor: `${workspace.color}20`,
          }}
        >
          <Folder
            className="h-7 w-7"
            style={{
              color: workspace.color,
            }}
          />
        </div>

        <WorkspaceActions
          workspace={workspace}
          onRename={onMenu}
          onDelete={onDelete}
        />
      </div>

      {/* Workspace Name */}
      <div className="mt-5">
        <h2 className="truncate text-xl font-semibold tracking-tight">
          {workspace.name}
        </h2>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-6 text-muted-foreground">
          {workspace.description ||
            "No description provided."}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-4 w-4" />

          <span>
            Created {formatDate(workspace.created_at)}
          </span>
        </div>

        <Button
          onClick={onOpen}
          className="rounded-xl px-5"
        >
          Open Workspace
        </Button>
      </div>
    </div>
  );
}