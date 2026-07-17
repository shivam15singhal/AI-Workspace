import type { Workspace } from "@/types/workspace";

import WorkspaceCard from "./WorkspaceCard";
import WorkspaceEmpty from "./WorkspaceEmpty";

type Props = {
  workspaces: Workspace[];

  onOpen: (workspace: Workspace) => void;

  onMenu: (workspace: Workspace) => void;

  onDelete: (
    workspace: Workspace,
  ) => void | Promise<void>;
};

export default function WorkspaceGrid({
  workspaces,
  onOpen,
  onMenu,
  onDelete,
}: Props) {
  if (workspaces.length === 0) {
    return <WorkspaceEmpty />;
  }

  return (
    <div
      className="
        grid
        gap-6
        sm:grid-cols-2
        xl:grid-cols-3
      "
    >
      {workspaces.map((workspace) => (
        <WorkspaceCard
          key={workspace.id}
          workspace={workspace}
          onOpen={() => onOpen(workspace)}
          onMenu={() => onMenu(workspace)}
          onDelete={() =>
            onDelete(workspace)
          }
        />
      ))}
    </div>
  );
}