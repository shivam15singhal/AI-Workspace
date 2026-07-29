import {
  FolderOpen,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function WorkspaceEmpty() {
  return (
    <div
      className="
        flex
        min-h-105
        flex-col
        items-center
        justify-center
        rounded-3xl
        border
        border-dashed
        border-border/60
        bg-card/40
        px-8
        text-center
      "
    >
      {/* Icon */}
      <div
        className="
          flex
          h-24
          w-24
          items-center
          justify-center
          rounded-3xl
          bg-primary/10
        "
      >
        <FolderOpen className="h-11 w-11 text-primary" />
      </div>

      {/* Heading */}
      <h2 className="mt-8 text-2xl font-semibold tracking-tight">
        No Workspaces Yet
      </h2>

      {/* Description */}
      <p className="mt-3 max-w-md leading-7 text-muted-foreground">
        Create your first workspace to organize conversations,
        documents, AI agents, and everything related to a project
        in one place.
      </p>

      {/* CTA */}
      <Button
        className="mt-8 rounded-xl px-6"
        size="lg"
      >
        <Plus className="mr-2 h-5 w-5" />
        Create Workspace
      </Button>
    </div>
  );
}