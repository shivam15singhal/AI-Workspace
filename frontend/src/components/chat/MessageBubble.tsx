import {
  AlertCircle,
  Bot,
  Check,
  Pencil,
  RotateCcw,
  User,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { motion } from "framer-motion";

import MarkdownRenderer from "./MarkdownRenderer";

import type { Message } from "@/types/message";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";

import { useChatStore } from "@/store/chatStore";

type Props = {
  message: Message;
};

export default function MessageBubble({
  message,
}: Props) {
  const isUser =
    message.role === "user";

  const retryMessage =
    useChatStore(
      (state) =>
        state.retryMessage,
    );

  const regenerateMessage =
    useChatStore(
      (state) =>
        state.regenerateMessage,
    );

  const editPrompt =
    useChatStore(
      (state) =>
        state.editPrompt,
    );

  const isGenerating =
    useChatStore(
      (state) =>
        state.isGenerating,
    );

  const [
    isEditing,
    setIsEditing,
  ] = useState(false);

  const [
    editedContent,
    setEditedContent,
  ] = useState(
    message.content,
  );

  useEffect(() => {
    if (!isEditing) {
      setEditedContent(
        message.content,
      );
    }
  }, [
    message.content,
    isEditing,
  ]);

  const isFailed =
    !isUser &&
    message.status === "failed";

  const canRegenerate =
    !isUser &&
    (
      message.status ===
        "completed" ||
      message.status ===
        "aborted"
    );

  const canEdit =
    isUser &&
    !isGenerating &&
    !isEditing;

  function handleStartEdit() {
    setEditedContent(
      message.content,
    );

    setIsEditing(true);
  }

  function handleCancelEdit() {
    setEditedContent(
      message.content,
    );

    setIsEditing(false);
  }

  async function handleSaveEdit() {
    const content =
      editedContent.trim();

    if (
      !content ||
      content ===
        message.content.trim() ||
      isGenerating
    ) {
      return;
    }

    setIsEditing(false);

    await editPrompt(
      message.id,
      content,
    );
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
      }}
      className={`group flex gap-3 ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >
      {/* Assistant Avatar */}

      {!isUser && (
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarFallback className="bg-black text-white">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message Container */}

      <div
        className={
          isEditing
            ? "w-full max-w-3xl"
            : "max-w-3xl"
        }
      >
        {isEditing ? (
          /* Edit Prompt UI */

          <div className="rounded-2xl border bg-card p-3 shadow-sm">
            <Textarea
              value={
                editedContent
              }
              onChange={(event) =>
                setEditedContent(
                  event.target.value,
                )
              }
              autoFocus
              className="
                min-h-24
                max-h-72
                resize-none
                border-0
                bg-transparent
                shadow-none
                focus-visible:ring-0
              "
              onKeyDown={async (
                event,
              ) => {
                if (
                  event.key ===
                    "Enter" &&
                  !event.shiftKey
                ) {
                  event.preventDefault();

                  await handleSaveEdit();
                }

                if (
                  event.key ===
                  "Escape"
                ) {
                  handleCancelEdit();
                }
              }}
            />

            <div className="mt-3 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={
                  handleCancelEdit
                }
                className="gap-2"
              >
                <X className="h-4 w-4" />

                Cancel
              </Button>

              <Button
                type="button"
                size="sm"
                disabled={
                  !editedContent.trim() ||
                  editedContent.trim() ===
                    message.content.trim() ||
                  isGenerating
                }
                onClick={
                  handleSaveEdit
                }
                className="gap-2"
              >
                <Check className="h-4 w-4" />

                Save & Submit
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Message Bubble */}

            <div
              className={`rounded-2xl px-5 py-3 shadow-sm ${
                isUser
                  ? "bg-black text-white"
                  : "border bg-muted"
              }`}
            >
              {message.content && (
                <MarkdownRenderer
                  content={
                    message.content
                  }
                />
              )}

              {/* Streaming Cursor */}

              {message.streaming && (
                <motion.span
                  animate={{
                    opacity: [
                      0,
                      1,
                      0,
                    ],
                  }}
                  transition={{
                    duration: 1,
                    repeat:
                      Infinity,
                  }}
                  className="ml-1 inline-block font-bold"
                >
                  ▍
                </motion.span>
              )}

              {/* Failed State */}

              {isFailed && (
                <div className="mt-2 flex items-start gap-2 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                  <span>
                    {message.error ||
                      "Failed to generate response."}
                  </span>
                </div>
              )}
            </div>

            {/* User Edit Action */}

            {isUser && (
              <div className="mt-1 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={
                    !canEdit
                  }
                  onClick={
                    handleStartEdit
                  }
                  className="
                    gap-2
                    text-muted-foreground
                    opacity-0
                    transition-opacity
                    group-hover:opacity-100
                  "
                >
                  <Pencil className="h-4 w-4" />

                  Edit
                </Button>
              </div>
            )}

            {/* Retry Action */}

            {isFailed && (
              <div className="mt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={
                    isGenerating
                  }
                  onClick={() =>
                    retryMessage(
                      message.id,
                    )
                  }
                  className="gap-2 text-muted-foreground"
                >
                  <RotateCcw className="h-4 w-4" />

                  Retry
                </Button>
              </div>
            )}

            {/* Regenerate Action */}

            {canRegenerate && (
              <div className="mt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={
                    isGenerating
                  }
                  onClick={() =>
                    regenerateMessage(
                      message.id,
                    )
                  }
                  className="gap-2 text-muted-foreground"
                >
                  <RotateCcw className="h-4 w-4" />

                  Regenerate
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* User Avatar */}

      {isUser && (
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
}