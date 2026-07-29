import { useRef, useState } from "react";
import {
  Paperclip,
  SendHorizontal,
  Square,
  FolderOpen,
  MessageSquare,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useDocumentStore } from "@/store/documentStore";
import { useChatStore } from "@/store/chatStore";

import ModelSelector from "@/components/chat/ModelSelector";

export default function ChatInput() {
  const [message, setMessage] = useState("");

  const [uploadTarget, setUploadTarget] = useState<
    "workspace" | "chat"
  >("chat");

  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const {
    sendMessage,
    stopGeneration,
    isGenerating,
  } = useChatStore();

  const { upload } = useDocumentStore();

  async function handleSend() {
    if (!message.trim() || isGenerating) {
      return;
    }

    const content = message;

    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    await sendMessage(content);
  }

  function openFilePicker(
    target: "workspace" | "chat",
  ) {
    setUploadTarget(target);
    fileInputRef.current?.click();
  }
  
  

  async function handleFileChange(
  event: React.ChangeEvent<HTMLInputElement>,
) {
  const files = Array.from(
    event.target.files ?? [],
  );

  if (!files.length) return;

  for (const file of files) {
    await upload(file, uploadTarget);
  }

  event.target.value = "";
}

  return (
    <div className="border-t border-border/60 bg-background/80 p-4 backdrop-blur-xl">
      <div className="mx-auto max-w-5xl rounded-3xl border border-border/60 bg-card shadow-lg transition-all duration-200">

        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">

          <ModelSelector />

          <>
            <DropdownMenu>
              <DropdownMenuTrigger
  className="
    inline-flex
    h-9
    w-9
    items-center
    justify-center
    rounded-full
    hover:bg-accent
    transition-colors
  "
>
  <Paperclip className="h-5 w-5" />
</DropdownMenuTrigger>

              <DropdownMenuContent align="end">

                <DropdownMenuItem
  onClick={() => openFilePicker("workspace")}
>
  <FolderOpen className="mr-2 h-4 w-4" />
  Upload to Workspace
</DropdownMenuItem>

<DropdownMenuItem
  onClick={() => openFilePicker("chat")}
>
  <MessageSquare className="mr-2 h-4 w-4" />
  Upload to Current Chat
</DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>

            <input
              ref={fileInputRef}
              hidden
              type="file"
              multiple
              accept=".pdf,.docx,.txt,.md,.csv,.xlsx,.xls"
              onChange={handleFileChange}
            />
          </>
        </div>

        <div className="flex items-end gap-3 p-3">
          <Textarea
            ref={textareaRef}
            value={message}
            placeholder="Ask anything..."
            className="
              min-h-12
              max-h-60
              resize-none
              border-0
              bg-transparent
              px-1
              text-[15px]
              leading-7
              shadow-none
              focus-visible:ring-0
              overflow-y-auto
              placeholder:text-muted-foreground/70
            "
            onChange={(event) => {
              setMessage(event.target.value);

              event.target.style.height =
                "auto";

              event.target.style.height =
                `${event.target.scrollHeight}px`;
            }}
            onKeyDown={async (event) => {
              if (
                event.key === "Enter" &&
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
              variant="destructive"
              onClick={stopGeneration}
              className="
                h-11
                w-11
                rounded-xl
                shadow-md
                transition-all
                duration-200
                hover:scale-105
                hover:shadow-lg
                active:scale-95
              "
            >
              <Square className="h-4 w-4 fill-current" />
            </Button>
          ) : (
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!message.trim()}
              className="
                h-11
                w-11
                rounded-xl
                shadow-md
                transition-all
                duration-200
                hover:scale-105
                hover:shadow-lg
                active:scale-95
                disabled:scale-100
                disabled:shadow-none
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