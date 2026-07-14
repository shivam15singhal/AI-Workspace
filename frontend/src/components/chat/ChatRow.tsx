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
        w-full
        items-center
        gap-2
        rounded-xl
        px-2
        py-1
        transition-all

        ${
          selected
            ? "bg-secondary"
            : "hover:bg-accent"
        }
      `}
    >
      <Button
        variant="ghost"
        className="
          min-w-0
          flex-1
          justify-start
          px-2
          hover:bg-transparent
        "
        onClick={() => onSelect(chat)}
      >
        <MessageSquare className="mr-2 h-4 w-4 shrink-0" />

        <span className="min-w-0 flex-1 truncate text-left">
          {chat.title}
        </span>
      </Button>

      <div
        className="
          shrink-0
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