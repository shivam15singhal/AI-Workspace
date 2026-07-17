import { Button } from "@/components/ui/button";

type Props = {
  onCreate: () => void;
};

export default function WorkspacesHeader({
  onCreate,
}: Props) {
  return (
    <div className="mb-8 flex items-center justify-between">

      <div>

        <h1 className="text-3xl font-bold">
          AI Workspaces
        </h1>

        <p className="text-muted-foreground">
          Organize your chats,
          documents and AI agents.
        </p>

      </div>

      <Button onClick={onCreate}>
        New Workspace
      </Button>

    </div>
  );
}