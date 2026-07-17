import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;

  initialName?: string;
  initialDescription?: string;

  submitText?: string;

  onSubmit: (
    name: string,
    description: string,
  ) => void;
};

export default function WorkspaceDialog({
  open,
  onOpenChange,
  title,
  initialName = "",
  initialDescription = "",
  submitText = "Save",
  onSubmit,
}: Props) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    setName(initialName);
    setDescription(initialDescription);
  }, [
    initialName,
    initialDescription,
    open,
  ]);

  function handleSubmit() {
    if (!name.trim()) return;

    onSubmit(name, description);

    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Workspace name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <Input
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
          >
            {submitText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}