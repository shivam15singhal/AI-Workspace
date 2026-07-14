import { create } from "zustand";

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
};

export const useChatStore = create<ChatState>((set) => ({
  chats: [],

  selectedChat: null,

  messages: [],

  loading: false,

  isGenerating: false,

  fetchChats: async () => {
    set({
      loading: true,
    });

    try {
      const chats = await getChats();

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
    const newChat = await createChat();

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

  sendMessage: async (content) => {
    const state = useChatStore.getState();

    if (!state.selectedChat) return;

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

    try {
      set({
        messages: [
          ...state.messages,
          userMessage,
          assistantMessage,
        ],
      });

      set({
        isGenerating: true,
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
      );

      set({
        isGenerating: false,
      });
    } catch (error) {
      console.error(
        "Error streaming message:",
        error,
      );

      set({
        isGenerating: false,
      });
    }

    const messages = await getMessages(
      state.selectedChat.id,
    );

    set({
      messages,
    });
  },
}));