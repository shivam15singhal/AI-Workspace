import api from "@/api/axios";
import type { Chat } from "@/types/chat";

export async function getChats(): Promise<Chat[]> {
  const response = await api.get("/api/chats");

  return response.data;
}

export async function createChat() {
  const response = await api.post("/api/chats", {});

  return response.data;
}