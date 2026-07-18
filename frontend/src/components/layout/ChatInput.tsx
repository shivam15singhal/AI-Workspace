import { useRef, useState } from "react";
import { Paperclip, SendHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useChatStore } from "@/store/chatStore";

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const textareaRef =useRef<HTMLTextAreaElement>(null);

  const {
  sendMessage,
  stopGeneration,
  isGenerating,
} = useChatStore();

  async function handleSend() {
    if (!message.trim()) return;

    const content = message;

    setMessage("");

    await sendMessage(content);
  }

  return (
    <div className="border-t bg-background p-4">
      <div className="mx-auto flex max-w-4xl items-end gap-3 rounded-2xl border bg-card p-3 shadow-sm">

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <Textarea
        ref={textareaRef}
          value={message}
          onChange={(e) => {
  setMessage(e.target.value);

  e.target.style.height = "auto";
  e.target.style.height =
    `${e.target.scrollHeight}px`;
}}
          placeholder="Type your message..."
          className="min-h-13
max-h-60
resize-none
border-0
shadow-none
focus-visible:ring-0
overflow-y-auto"
          onKeyDown={async (e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey
            ) {
              e.preventDefault();
              await handleSend();
            }
          }}
        />

        {isGenerating ? (
  <Button
    size="icon"
    variant="destructive"
    onClick={stopGeneration}
  >
    Stop
  </Button>
) : (
  <Button
    size="icon"
    onClick={handleSend}
    disabled={!message.trim()}
  >
    <SendHorizontal className="h-5 w-5" />
  </Button>
)}

      </div>
    </div>
  );
}