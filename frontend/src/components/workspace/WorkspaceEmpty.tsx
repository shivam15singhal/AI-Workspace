import { FolderOpen } from "lucide-react";

export default function WorkspaceEmpty() {
  return (
    <div className="rounded-2xl border border-dashed py-20 text-center">

      <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground" />

      <h2 className="mt-5 text-xl font-semibold">
        No Workspaces
      </h2>

      <p className="mt-2 text-muted-foreground">
        Create your first workspace
        to organize chats,
        documents and AI agents.
      </p>

    </div>
  );
}