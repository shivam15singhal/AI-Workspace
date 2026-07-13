// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import rehypeHighlight from "rehype-highlight";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import type { Message } from "@/types/message";


type Props = {
  message: Message;
};

export default function MessageBubble({
  message,
}: Props) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  async function copyMessage() {
    await navigator.clipboard.writeText(
      message.content,
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
  <div
    className={`group flex ${
      isUser ? "justify-end" : "justify-start"
    }`}
  >
    <div className="max-w-3xl">
      <div
        className={`rounded-2xl px-5 py-3 ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        {message.content}
      </div>

      {!isUser && (
        <button
          onClick={copyMessage}
          className="mt-2 flex items-center gap-2 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy
            </>
          )}
        </button>
      )}
    </div>
  </div>
);
}