import {
  ChevronDown,
  Brain,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import {
  AI_MODELS,
} from "@/constants/models";

import {
  useModelStore,
} from "@/store/modelStore";

export default function ModelSelector() {
  const {
    selectedModel,
    setSelectedModel,
  } = useModelStore();

  const currentModel =
    AI_MODELS.find(
      (model) =>
        model.id ===
        selectedModel,
    );

  return (
    <DropdownMenu>
     <DropdownMenuTrigger>
  <div
    className="
      inline-flex
      cursor-pointer
      items-center
      gap-2
      rounded-md
      px-3
      py-2
      text-sm
      hover:bg-accent
    "
  >
    <Brain className="h-4 w-4" />

    <span>{currentModel?.name}</span>

    <ChevronDown className="h-4 w-4 opacity-60" />
  </div>
</DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-64"
      >
        {AI_MODELS.map(
          (model) => (
            <DropdownMenuItem
              key={model.id}
              onClick={() =>
                setSelectedModel(
                  model.id,
                )
              }
              className="flex flex-col items-start"
            >
              <span className="font-medium">
                {model.name}
              </span>

              <span className="text-xs text-muted-foreground">
                {model.description}
              </span>
            </DropdownMenuItem>
          ),
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}