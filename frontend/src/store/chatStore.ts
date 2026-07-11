import { create } from "zustand";

import type { Chat } from "@/types/chat";
import {
  getChats,
  createChat,
} from "@/services/chat/chatService";

type ChatState = {
  chats: Chat[];
  selectedChat: Chat | null;
  loading: boolean;

  fetchChats: () => Promise<void>;

  createNewChat: () => Promise<void>;

  selectChat: (chat: Chat) => void;
};

export const useChatStore = create<ChatState>((set) => ({
  chats: [],

  selectedChat: null,

  loading: false,

  fetchChats: async () => {
    set({ loading: true });

    try {
      const chats = await getChats();

      set({
        chats,
        selectedChat: chats[0] ?? null,
      });
    } finally {
      set({ loading: false });
    }
  },

  createNewChat: async () => {
    const newChat = await createChat();

    set((state) => ({
      chats: [newChat, ...state.chats],
      selectedChat: newChat,
    }));
  },

  selectChat: (chat) =>
    set({
      selectedChat: chat,
    }),
}));