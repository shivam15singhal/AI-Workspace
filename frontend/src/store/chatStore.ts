import { create } from "zustand";

import type { Chat } from "@/types/chat";
import type { Message } from "@/types/message";


import {
  getChats,
  createChat,
} from "@/services/chat/chatService";

import {
  getMessages,
  sendMessage,
} from "@/services/chat/messageService";

type ChatState = {
  chats: Chat[];
  selectedChat: Chat | null;
  messages: Message[];
  loading: boolean;

  fetchChats: () => Promise<void>;
  fetchMessages: (chatId: number) => Promise<void>;

  createNewChat: () => Promise<void>;

  selectChat: (chat: Chat) => Promise<void>;
  sendMessage: (
  content: string,
) => Promise<void>;
};

export const useChatStore = create<ChatState>((set) => ({
  chats: [],

  selectedChat: null,

  messages: [],

  loading: false,

  fetchChats: async () => {
    set({ loading: true });

    try {
      const chats = await getChats();

      set({
        chats,
        selectedChat: chats[0] ?? null,
      });

      if (chats.length > 0) {
        const messages = await getMessages(chats[0].id);

        set({
          messages,
        });
      }
    } finally {
      set({ loading: false });
    }
  },

  fetchMessages: async (chatId) => {
    const messages = await getMessages(chatId);

    set({
      messages,
    });
  },
  sendMessage: async (content) => {
  const state = useChatStore.getState();

  if (!state.selectedChat) return;

  await sendMessage(
    state.selectedChat.id,
    content,
  );

  const messages = await getMessages(
    state.selectedChat.id,
  );

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

  selectChat: async (chat) => {
    const messages = await getMessages(chat.id);

    set({
      selectedChat: chat,
      messages,
    });
  },
}));