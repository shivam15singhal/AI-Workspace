import type { Message } from "@/types/message";

type Props = {
  message: Message;
};

export default function MessageBubble({
  message,
}: Props) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-3xl rounded-2xl px-5 py-3 ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}