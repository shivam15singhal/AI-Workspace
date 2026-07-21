import type { Message } from "@/types/message";

import {
  getMessages,
  streamMessage,
} from "@/services/chat/messageService";

import { useModelStore } from "@/store/modelStore";

import { getErrorMessage } from "@/utils/getErrorMessage";

type StreamAssistantResponseParams = {
  chatId: number;

  prompt: string;

  assistantMessage: Message;

  controller: AbortController;

  set: (
    updater:
      | Record<string, unknown>
      | ((
          state: any,
        ) => Record<
          string,
          unknown
        >),
  ) => void;
};

export async function streamAssistantResponse({
  chatId,
  prompt,
  assistantMessage,
  controller,
  set,
}: StreamAssistantResponseParams) {
  const model =
    useModelStore.getState()
      .selectedModel;

  let wasAborted = false;

  let completedSuccessfully = false;

  try {
    await streamMessage(
      chatId,
      prompt,
      model,
      (chunk) => {
        set((state: any) => ({
          messages:
            state.messages.map(
              (
                message: Message,
              ) =>
                message.id ===
                assistantMessage.id
                  ? {
                      ...message,

                      content:
                        message.content +
                        chunk,
                    }
                  : message,
            ),
        }));
      },
      controller.signal,
    );

    completedSuccessfully = true;

    set((state: any) => ({
      messages:
        state.messages.map(
          (
            message: Message,
          ) =>
            message.id ===
            assistantMessage.id
              ? {
                  ...message,

                  streaming: false,

                  status:
                    "completed",
                }
              : message,
        ),
    }));
  } catch (error) {
    if (
      error instanceof
        DOMException &&
      error.name ===
        "AbortError"
    ) {
      wasAborted = true;

      set((state: any) => ({
        messages:
          state.messages.map(
            (
              message: Message,
            ) =>
              message.id ===
              assistantMessage.id
                ? {
                    ...message,

                    streaming: false,

                    status:
                      "aborted",
                  }
                : message,
          ),
      }));
    } else {
      set((state: any) => ({
        messages:
          state.messages.map(
            (
              message: Message,
            ) =>
              message.id ===
              assistantMessage.id
                ? {
                    ...message,

                    streaming: false,

                    status:
                      "failed",

                    error:
                      getErrorMessage(
                        error,
                      ),
                  }
                : message,
          ),
      }));

      console.error(
        "Error streaming message:",
        error,
      );
    }
  } finally {
    set({
      isGenerating: false,

      abortController: null,
    });
  }

  // Sync with database only after
  // a successful generation.

  if (
    completedSuccessfully &&
    !wasAborted
  ) {
    try {
      const messages =
        await getMessages(
          chatId,
        );

      set({
        messages:
          messages.map(
            (message) => ({
              ...message,

              status:
                message.status ??
                "completed",

              streaming: false,
            }),
          ),
      });
    } catch (error) {
      console.error(
        "Failed to refresh messages:",
        error,
      );
    }
  }
}