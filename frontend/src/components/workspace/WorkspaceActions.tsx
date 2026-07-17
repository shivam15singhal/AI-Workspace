import {
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import type { Workspace } from "@/types/workspace";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// import { Button } from "@/components/ui/button";

type Props = {
  workspace: Workspace;
  onRename: (workspace: Workspace) => void;
  onDelete: (workspace: Workspace) => void;
};

export default function WorkspaceActions({
  workspace,
  onRename,
  onDelete,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
  <div
    className="
      flex
      h-8
      w-8
      cursor-pointer
      items-center
      justify-center
      rounded-md
      hover:bg-accent
    "
  >
    <MoreVertical className="h-4 w-4" />
  </div>
</DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => onRename(workspace)}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Rename
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onDelete(workspace)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}