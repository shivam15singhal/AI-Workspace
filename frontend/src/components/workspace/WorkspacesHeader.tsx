import {
  FolderPlus,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  onCreate: () => void;
};

export default function WorkspacesHeader({
  onCreate,
}: Props) {
  return (
    <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      {/* Left */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              AI Workspaces
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Organize conversations, documents, AI agents, and
              workflows in dedicated workspaces.
            </p>
          </div>
        </div>
      </div>

      {/* Right */}
      <Button
        onClick={onCreate}
        size="lg"
        className="rounded-xl px-6 shadow-sm"
      >
        <FolderPlus className="mr-2 h-5 w-5" />
        New Workspace
      </Button>
    </div>
  );
}