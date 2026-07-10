import MessageBubble from "./MessageBubble";

import type { Message } from "@/types/message";

const messages: Message[] = [
  {
    id: 1,
    role: "user",
    content: "Explain Retrieval-Augmented Generation.",
  },
  {
    id: 2,
    role: "assistant",
    content:
      "Retrieval-Augmented Generation (RAG) combines a language model with external knowledge retrieval so answers can be grounded in relevant documents.",
  },
  {
    id: 3,
    role: "user",
    content: "Can you explain with an example?",
  },
];

export default function MessageList() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
        />
      ))}
    </div>
  );
}