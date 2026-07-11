import api from "@/api/axios";

export async function getChats() {
  const response = await api.get("/api/chats");
  return response.data;
}