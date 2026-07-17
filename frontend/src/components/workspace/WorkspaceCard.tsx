import { Folder } from "lucide-react";

import type { Workspace } from "@/types/workspace";

import { Button } from "@/components/ui/button";

import WorkspaceActions from "./WorkspaceActions";

type Props = {
  workspace: Workspace;

  onOpen: () => void;

  onMenu: () => void;

  onDelete: () => void | Promise<void>;
};

export default function WorkspaceCard({
  workspace,
  onOpen,
  onMenu,
  onDelete,
}: Props) {
  return (
    <div
      className="
        rounded-2xl
        border
        bg-card
        p-6
        transition-all
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{
            backgroundColor:
              workspace.color + "20",
          }}
        >
          <Folder
            className="h-6 w-6"
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

      <h2 className="mt-5 text-lg font-semibold">
        {workspace.name}
      </h2>

      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
        {workspace.description ||
          "No description"}
      </p>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Created{" "}
          {new Date(
            workspace.created_at,
          ).toLocaleDateString()}
        </span>

        <Button onClick={onOpen}>
          Open
        </Button>
      </div>
    </div>
  );
}