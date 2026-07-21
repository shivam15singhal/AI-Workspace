import { create } from "zustand";

import { useWorkspaceStore } from "@/store/workspaceStore";

import type { Chat } from "@/types/chat";
import type { Message } from "@/types/message";

import {
  getChats,
  createChat,
  renameChat,
  deleteChat,
} from "@/services/chat/chatService";

import {
  getMessages,
  editMessage,
  streamEditedMessage,
} from "@/services/chat/messageService";

import {getErrorMessage,} from "@/utils/getErrorMessage";

import {
  streamAssistantResponse,
} from "@/services/chat/streamAssistantResponse";

function normalizeMessages(
  messages: Message[],
): Message[] {
  return messages.map((message) => ({
    ...message,

    status:
      message.status ??
      "completed",

    streaming: false,
  }));
}

type ChatState = {
  chats: Chat[];
  selectedChat: Chat | null;
  messages: Message[];

  loading: boolean;
  isGenerating: boolean;

  abortController: AbortController | null;

  fetchChats: () => Promise<void>;

  fetchMessages: (
    chatId: number,
  ) => Promise<void>;

  createNewChat: () => Promise<void>;

  renameCurrentChat: (
    chatId: number,
    title: string,
  ) => Promise<void>;

  deleteCurrentChat: (
    chatId: number,
  ) => Promise<void>;

  selectChat: (
    chat: Chat,
  ) => Promise<void>;

  sendMessage: (
    content: string,
  ) => Promise<void>;

  stopGeneration: () => void;

  retryMessage: (
  assistantMessageId: number,
) => Promise<void>;

  regenerateMessage: (
  assistantMessageId: number,
) => Promise<void>;

  editPrompt: (
  messageId: number,
  content: string,
) => Promise<void>;

};

export const useChatStore =
  create<ChatState>((set, get) => ({
    chats: [],

    selectedChat: null,

    messages: [],

    loading: false,

    isGenerating: false,

    abortController: null,

    fetchChats: async () => {
      set({
        loading: true,
      });

      try {
        const workspace =
          useWorkspaceStore.getState()
            .selectedWorkspace;

        if (!workspace) {
          set({
            chats: [],
            selectedChat: null,
            messages: [],
          });

          return;
        }

        const chats = await getChats(
          workspace.id,
        );

        set({
          chats,
          selectedChat:
            chats[0] ?? null,
        });

        if (chats.length > 0) {
          const messages =
            await getMessages(
              chats[0].id,
            );

          set({
            messages:normalizeMessages(messages),
          });
        } else {
          set({
            messages: [],
          });
        }
      } finally {
        set({
          loading: false,
        });
      }
    },

    fetchMessages: async (
      chatId,
    ) => {
      const messages =
        await getMessages(chatId);

      set({
  messages:
    normalizeMessages(messages),
});
    },

    createNewChat: async () => {
      const workspace =
        useWorkspaceStore.getState()
          .selectedWorkspace;

      if (!workspace) return;

      const newChat =
        await createChat(
          workspace.id,
        );

      set((state) => ({
        chats: [
          newChat,
          ...state.chats,
        ],

        selectedChat: newChat,

        messages: [],
      }));
    },

    renameCurrentChat: async (
      chatId,
      title,
    ) => {
      const updated =
        await renameChat(
          chatId,
          title,
        );

      set((state) => ({
        chats:
          state.chats.map(
            (chat) =>
              chat.id === chatId
                ? updated
                : chat,
          ),

        selectedChat:
          state.selectedChat?.id ===
          chatId
            ? updated
            : state.selectedChat,
      }));
    },

    deleteCurrentChat: async (
      chatId,
    ) => {
      await deleteChat(chatId);

      set((state) => {
        const chats =
          state.chats.filter(
            (chat) =>
              chat.id !== chatId,
          );

        return {
          chats,

          selectedChat:
            state.selectedChat?.id ===
            chatId
              ? chats[0] ?? null
              : state.selectedChat,

          messages:
            state.selectedChat?.id ===
            chatId
              ? []
              : state.messages,
        };
      });
    },

    selectChat: async (
      chat,
    ) => {
     
      const controller =
        get().abortController;

      if (controller) {
        controller.abort();
      }

      set({
        selectedChat: chat,
        isGenerating: false,
        abortController: null,
      });

      const messages =
        await getMessages(
          chat.id,
        );

      set({
  messages:
    normalizeMessages(messages),
});
    },

    stopGeneration: () => {
      const controller =
        get().abortController;

      controller?.abort();

      
      set({
        abortController: null,
        isGenerating: false,
      });
    },
    retryMessage: async (
  assistantMessageId,
) => {
  const state = get();

  if (
    !state.selectedChat ||
    state.isGenerating
  ) {
    return;
  }

  const assistantIndex =
    state.messages.findIndex(
      (message) =>
        message.id === assistantMessageId,
    );

  if (assistantIndex === -1) {
    return;
  }

  const assistantMessage =
    state.messages[assistantIndex];

  if (
    assistantMessage.role !== "assistant" ||
    assistantMessage.status !== "failed"
  ) {
    return;
  }

  // Find the user prompt immediately
  // before this assistant response.
  let userMessage: Message | undefined;

  for (
    let i = assistantIndex - 1;
    i >= 0;
    i--
  ) {
    if (
      state.messages[i].role === "user"
    ) {
      userMessage =
        state.messages[i];

      break;
    }
  }

  if (!userMessage) {
    return;
  }

  const controller =
    new AbortController();

  const retryAssistantMessage: Message = {
    ...assistantMessage,

    content: "",

    streaming: true,

    status: "streaming",

    error: undefined,
  };

  set((currentState) => ({
    messages:
      currentState.messages.map(
        (message) =>
          message.id ===
          assistantMessageId
            ? retryAssistantMessage
            : message,
      ),

    isGenerating: true,

    abortController:
      controller,
  }));

  await streamAssistantResponse({
    chatId:
      state.selectedChat.id,

    prompt:
      userMessage.content,

    assistantMessage:
      retryAssistantMessage,

    controller,

    set,
  });
},
regenerateMessage: async (
  assistantMessageId,
) => {
  const state = get();

  if (
    !state.selectedChat ||
    state.isGenerating
  ) {
    return;
  }

  const assistantIndex =
    state.messages.findIndex(
      (message) =>
        message.id === assistantMessageId,
    );

  if (assistantIndex === -1) {
    return;
  }

  const assistantMessage =
    state.messages[assistantIndex];

  if (
    assistantMessage.role !== "assistant" ||
    ![
      "completed",
      "aborted",
    ].includes(
      assistantMessage.status ?? "",
    )
  ) {
    return;
  }

  let userMessage: Message | undefined;

  for (
    let i = assistantIndex - 1;
    i >= 0;
    i--
  ) {
    if (
      state.messages[i].role === "user"
    ) {
      userMessage =
        state.messages[i];

      break;
    }
  }

  if (!userMessage) {
    return;
  }

  const controller =
    new AbortController();

  const regeneratedMessage: Message = {
    ...assistantMessage,

    content: "",

    streaming: true,

    status: "streaming",

    error: undefined,
  };

  set((currentState) => ({
    messages:
      currentState.messages.map(
        (message) =>
          message.id ===
          assistantMessageId
            ? regeneratedMessage
            : message,
      ),

    isGenerating: true,

    abortController:
      controller,
  }));

  await streamAssistantResponse({
    chatId:
      state.selectedChat.id,

    prompt:
      userMessage.content,

    assistantMessage:
      regeneratedMessage,

    controller,

    set,
  });
},

editPrompt: async (
  messageId,
  content,
) => {
  const state = get();

  if (
    !state.selectedChat ||
    state.isGenerating ||
    !content.trim()
  ) {
    return;
  }

  const messageIndex =
    state.messages.findIndex(
      (message) =>
        message.id === messageId,
    );

  if (messageIndex === -1) {
    return;
  }

  const originalMessage =
    state.messages[messageIndex];

  if (
    originalMessage.role !== "user"
  ) {
    return;
  }

  const chatId =
    state.selectedChat.id;

  /*
   * Backend:
   * - updates the existing user message
   * - deletes every message after it
   */
  const updatedMessage =
    await editMessage(
      messageId,
      content.trim(),
    );

  const assistantMessage: Message = {
    id: Date.now(),

    chat_id: chatId,

    role: "assistant",

    content: "",

    created_at:
      new Date().toISOString(),

    streaming: true,

    status: "streaming",
  };

  const controller =
    new AbortController();

  /*
   * Remove the old conversation branch
   * locally as well.
   *
   * Keep everything BEFORE the edited
   * message, then insert the updated
   * message and new assistant placeholder.
   */
  set((currentState) => {
    const currentIndex =
      currentState.messages.findIndex(
        (message) =>
          message.id === messageId,
      );

    if (currentIndex === -1) {
      return {};
    }

    return {
      messages: [
        ...currentState.messages.slice(
          0,
          currentIndex,
        ),

        {
          ...updatedMessage,
          status: "completed",
          streaming: false,
        },

        assistantMessage,
      ],

      isGenerating: true,

      abortController:
        controller,
    };
  });

  let completedSuccessfully =
    false;

  try {
    await streamEditedMessage(
      messageId,

      (chunk) => {
        set((currentState) => ({
          messages:
            currentState.messages.map(
              (message) =>
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

    set((currentState) => ({
      messages:
        currentState.messages.map(
          (message) =>
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
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      set((currentState) => ({
        messages:
          currentState.messages.map(
            (message) =>
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
      set((currentState) => ({
        messages:
          currentState.messages.map(
            (message) =>
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
        "Failed to regenerate after editing:",
        error,
      );
    }
  } finally {
    set({
      isGenerating: false,
      abortController: null,
    });
  }

  /*
   * Replace temporary frontend IDs with
   * persisted PostgreSQL messages only
   * after successful generation.
   *
   * Do not reload after abort/failure,
   * otherwise local status information
   * would disappear.
   */
  if (completedSuccessfully) {
    try {
      const messages =
        await getMessages(
          chatId,
        );

      set({
        messages:
          normalizeMessages(
            messages,
          ),
      });
    } catch (error) {
      console.error(
        "Failed to refresh edited conversation:",
        error,
      );
    }
  }
},

    sendMessage: async (
      content,
    ) => {
      const state = get();

      if (
        !state.selectedChat ||
        state.isGenerating ||
        !content.trim()
      ) {
        return;
      }

      const chatId =
        state.selectedChat.id;

      const timestamp =
        Date.now();

  
      const userMessage: Message = {
        id: timestamp,

        chat_id: chatId,

        role: "user",

        content:
          content.trim(),

        created_at:
          new Date().toISOString(),

        status: "completed",
      };

      const assistantMessage: Message = {
        id: timestamp + 1,

        chat_id: chatId,

        role: "assistant",

        content: "",

        created_at:
          new Date().toISOString(),

        streaming: true,

        status: "streaming",
      };

      const controller =
        new AbortController();

      
      set((currentState) => ({
        messages: [
          ...currentState.messages,
          userMessage,
          assistantMessage,
        ],

        isGenerating: true,

        abortController:
          controller,
      }));

      await streamAssistantResponse({
        chatId,

        prompt:
          content.trim(),

        assistantMessage,

        controller,

        set,
      });
    },
  }));