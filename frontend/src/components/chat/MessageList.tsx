import MessageBubble from "./MessageBubble";

import { useChatStore } from "@/store/chatStore";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import TypingIndicator from "./TypingIndicator";

export default function MessageList() {
  const messages = useChatStore(
    (state) => state.messages,
  );
const isGenerating = useChatStore(
  (state) => state.isGenerating,
);
  const bottomRef =
    useAutoScroll(messages);

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        No messages yet.
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
        />
      ))}

      {isGenerating && <TypingIndicator />}

<div ref={bottomRef} />
    </div>
  );
}