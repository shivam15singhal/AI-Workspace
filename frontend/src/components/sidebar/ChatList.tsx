import type { Chat } from "@/types/chat";

import ChatRow from "@/components/chat/ChatRow";

type Props = {
  chats: Chat[];
  selectedChat: Chat | null;
  search: string;
  onSelect: (chat: Chat) => void;
};

export default function ChatList({
  chats,
  selectedChat,
  search,
  onSelect,
}: Props) {
  return (
    <div className="flex-1 space-y-1 overflow-y-auto px-3">
      {chats.length === 0 ? (
        <p className="px-2 text-sm text-muted-foreground">
          {search
            ? "No chats found."
            : "No chats yet."}
        </p>
      ) : (
        chats.map((chat) => (
          <ChatRow
            key={chat.id}
            chat={chat}
            selected={
              selectedChat?.id === chat.id
            }
            onSelect={onSelect}
          />
        ))
      )}
    </div>
  );
}