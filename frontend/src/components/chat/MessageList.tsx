import MessageBubble from "./MessageBubble";
import { Sparkles } from "lucide-react";
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
    <div className="flex h-full items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shadow-sm">
  <Sparkles className="h-8 w-8 text-primary" />
</div>

        <h2 className="text-2xl font-semibold tracking-tight">
          Welcome to AI Workspace
        </h2>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Ask questions, analyze documents, schedule meetings,
          or automate your workflow with AI.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
  {[
    "Explain React hooks",
    "Summarize my document",
    "Write SQL query",
    "Plan my week",
  ].map((prompt) => (
    <button
      key={prompt}
      className="
        rounded-xl
        border
        border-border/60
        bg-card
        px-4
        py-2
        text-sm
        transition-all
        duration-200
        hover:bg-accent
      "
    >
      {prompt}
    </button>
  ))}
</div>
      </div>
    </div>
  );
}

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
        />
      ))}

      {isGenerating && (
  <div className="pt-2">
    <TypingIndicator />
  </div>
)}

<div ref={bottomRef} className="h-6" />
    </div>
  );
}