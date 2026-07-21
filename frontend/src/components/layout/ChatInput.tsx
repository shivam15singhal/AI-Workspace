import { useRef, useState } from "react";
import {
  Paperclip,
  SendHorizontal,
  Square,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useChatStore } from "@/store/chatStore";

import ModelSelector from "@/components/chat/ModelSelector";

export default function ChatInput() {
  const [message, setMessage] =
    useState("");

  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  const {
    sendMessage,
    stopGeneration,
    isGenerating,
  } = useChatStore();

  async function handleSend() {
    if (
      !message.trim() ||
      isGenerating
    ) {
      return;
    }

    const content = message;

    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height =
        "auto";
    }

    await sendMessage(content);
  }

  return (
    <div className="border-t bg-background p-4">
      <div className="mx-auto max-w-4xl rounded-2xl border bg-card shadow-sm">
        {/* Top Toolbar */}

        <div className="flex items-center justify-between border-b px-3 py-2">
          <ModelSelector />

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
        </div>

        {/* Input */}

        <div className="flex items-end gap-3 p-3">
          <Textarea
            ref={textareaRef}
            value={message}
            placeholder="Type your message..."
            className="
              min-h-12
              max-h-60
              resize-none
              border-0
              shadow-none
              focus-visible:ring-0
              overflow-y-auto
            "
            onChange={(event) => {
              setMessage(
                event.target.value,
              );

              event.target.style.height =
                "auto";

              event.target.style.height =
                `${event.target.scrollHeight}px`;
            }}
            onKeyDown={async (
              event,
            ) => {
              if (
                event.key ===
                  "Enter" &&
                !event.shiftKey
              ) {
                event.preventDefault();

                await handleSend();
              }
            }}
          />

          {isGenerating ? (
            <Button
              size="icon"
              onClick={
                stopGeneration
              }
            >
              <Square className="h-4 w-4 fill-current" />
            </Button>
          ) : (
            <Button
              size="icon"
              onClick={
                handleSend
              }
              disabled={
                !message.trim()
              }
              className="
                transition-all
                duration-200
                hover:scale-105
                active:scale-95
              "
            >
              <SendHorizontal className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}