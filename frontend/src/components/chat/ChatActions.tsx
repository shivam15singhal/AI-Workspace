import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import type { Chat } from "@/types/chat";
import { useChatStore } from "@/store/chatStore";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  chat: Chat;
};

export default function ChatActions({
  chat,
}: Props) {
  const renameCurrentChat = useChatStore(
    (state) => state.renameCurrentChat,
  );

  const deleteCurrentChat = useChatStore(
    (state) => state.deleteCurrentChat,
  );

  const [renameOpen, setRenameOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [title, setTitle] = useState(
    chat.title,
  );

  async function handleRename() {
    const trimmed = title.trim();

    if (!trimmed) return;

    await renameCurrentChat(
      chat.id,
      trimmed,
    );

    setRenameOpen(false);
  }

  async function handleDelete() {
    await deleteCurrentChat(chat.id);

    setDeleteOpen(false);
  }

  return (
    <>
      <DropdownMenu>
       <DropdownMenuTrigger
  onClick={(e) => e.stopPropagation()}
  className="
    inline-flex
    h-8
    w-8
    items-center
    justify-center
    rounded-md
    hover:bg-accent
    focus:outline-none
  "
>
  <MoreHorizontal className="h-4 w-4" />
</DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
        >
          <DropdownMenuItem
            onClick={() =>
              setRenameOpen(true)
            }
          >
            <Pencil className="mr-2 h-4 w-4" />
            Rename
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-600"
            onClick={() =>
              setDeleteOpen(true)
            }
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Rename Dialog */}

      <Dialog
        open={renameOpen}
        onOpenChange={setRenameOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Rename Chat
            </DialogTitle>
          </DialogHeader>

          <input
            className="w-full rounded-md border p-2"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                await handleRename();
              }
            }}
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setRenameOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              onClick={handleRename}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}

      <AlertDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Chat?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}