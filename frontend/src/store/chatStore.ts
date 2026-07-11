import { create } from "zustand";

import type { Chat } from "@/types/chat";
import { getChats } from "@/services/chat/chatService";

type ChatState = {
  chats: Chat[];

  loading: boolean;

  fetchChats: () => Promise<void>;
};

export const useChatStore = create<ChatState>((set) => ({
  chats: [],

  loading: false,

  fetchChats: async () => {
    set({
      loading: true,
    });

    try {
      const chats = await getChats();

      set({
        chats,
      });
    } finally {
      set({
        loading: false,
      });
    }
  },
}));