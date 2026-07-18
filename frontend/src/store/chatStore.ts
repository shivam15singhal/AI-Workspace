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
  streamMessage,
} from "@/services/chat/messageService";

type ChatState = {
  chats: Chat[];
  selectedChat: Chat | null;
  messages: Message[];
  loading: boolean;
  isGenerating: boolean;
  abortController: AbortController | null;

  fetchChats: () => Promise<void>;
  fetchMessages: (chatId: number) => Promise<void>;

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
};

export const useChatStore = create<ChatState>((set, get) => ({
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
        useWorkspaceStore.getState().selectedWorkspace;

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
        selectedChat: chats[0] ?? null,
      });

      if (chats.length > 0) {
        const messages = await getMessages(
          chats[0].id,
        );

        set({
          messages,
        });
      }
    } finally {
      set({
        loading: false,
      });
    }
  },

  fetchMessages: async (chatId) => {
    const messages = await getMessages(chatId);

    set({
      messages,
    });
  },

  createNewChat: async () => {
    const workspace =
      useWorkspaceStore.getState().selectedWorkspace;

    if (!workspace) return;

    const newChat = await createChat(
      workspace.id,
    );

    set((state) => ({
      chats: [newChat, ...state.chats],
      selectedChat: newChat,
      messages: [],
    }));
  },

  renameCurrentChat: async (
    chatId,
    title,
  ) => {
    const updated = await renameChat(
      chatId,
      title,
    );

    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId
          ? updated
          : chat,
      ),

      selectedChat:
        state.selectedChat?.id === chatId
          ? updated
          : state.selectedChat,
    }));
  },

  deleteCurrentChat: async (
    chatId,
  ) => {
    await deleteChat(chatId);

    set((state) => {
      const chats = state.chats.filter(
        (chat) => chat.id !== chatId,
      );

      return {
        chats,

        selectedChat:
          state.selectedChat?.id === chatId
            ? chats[0] ?? null
            : state.selectedChat,

        messages:
          state.selectedChat?.id === chatId
            ? []
            : state.messages,
      };
    });
  },

  selectChat: async (chat) => {
    const messages = await getMessages(chat.id);

    set({
      selectedChat: chat,
      messages,
    });
  },

  stopGeneration: () => {
    const controller = get().abortController;

    controller?.abort();

    set({
      abortController: null,
      isGenerating: false,
    });
  },

  sendMessage: async (content) => {
    const state = get();

    if (!state.selectedChat) return;

    let wasAborted = false;

    const userMessage: Message = {
      id: Date.now(),
      chat_id: state.selectedChat.id,
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };

    const assistantMessage: Message = {
      id: Date.now() + 1,
      chat_id: state.selectedChat.id,
      role: "assistant",
      content: "",
      streaming: true,
      created_at: new Date().toISOString(),
    };

    const controller = new AbortController();

    try {
      set({
        messages: [
          ...state.messages,
          userMessage,
          assistantMessage,
        ],
        isGenerating: true,
        abortController: controller,
      });

      await streamMessage(
        state.selectedChat.id,
        content,
        (chunk) => {
          set((state) => ({
            messages: state.messages.map((message) =>
              message.id === assistantMessage.id
                ? {
                    ...message,
                    streaming: false,
                    content:
                      message.content + chunk,
                  }
                : message,
            ),
          }));
        },
        controller.signal,
      );

      set({
        isGenerating: false,
        abortController: null,
      });
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        wasAborted = true;

        set((state) => ({
          messages: state.messages.map((message) =>
            message.id === assistantMessage.id
              ? {
                  ...message,
                  streaming: false,
                }
              : message,
          ),
        }));
      } else {
        console.error(
          "Error streaming message:",
          error,
        );
      }

      set({
        isGenerating: false,
        abortController: null,
      });
    }

    if (!wasAborted) {
      const messages = await getMessages(
        state.selectedChat.id,
      );

      set({
        messages,
      });
    }
  },
}));