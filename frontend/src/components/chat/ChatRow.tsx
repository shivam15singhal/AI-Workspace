import { MessageSquare } from "lucide-react";

import type { Chat } from "@/types/chat";

import { Button } from "@/components/ui/button";
import ChatActions from "./ChatActions";

type Props = {
  chat: Chat;
  selected: boolean;
  onSelect: (chat: Chat) => void;
};

export default function ChatRow({
  chat,
  selected,
  onSelect,
}: Props) {
  return (
    <div
      className={`
        group
        flex
        items-center
        justify-between
        rounded-xl
        px-2
        py-1.5
        transition-all
        duration-200
        ${
         selected
  ? "bg-primary/10 border border-primary/20 shadow-sm"
  : "border border-transparent hover:border-border/60 hover:bg-accent/60"
        }
      `}
    >
      <Button
        variant="ghost"
        onClick={() => onSelect(chat)}
        className="
          h-auto
          min-w-0
          flex-1
          justify-start
          gap-3
          px-2
          py-2
          hover:bg-transparent
        "
      >
        <div
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            bg-primary/10
          "
        >
          <MessageSquare className="h-4 w-4 text-primary" />
        </div>

        <div className="min-w-0 flex-1 text-left">
          <p className="truncate text-sm font-medium">
            {chat.title}
          </p>

          <p className="text-xs text-muted-foreground">
            Conversation
          </p>
        </div>
      </Button>

      <div
        className="
          opacity-0
          transition-opacity
          duration-200
          group-hover:opacity-100
        "
      >
        <ChatActions chat={chat} />
      </div>
    </div>
  );
}