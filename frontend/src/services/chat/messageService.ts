import api from "@/api/axios";
import type { Message } from "@/types/message";

export async function getMessages(
  chatId: number,
): Promise<Message[]> {
  const response = await api.get(
    `/api/messages/${chatId}`,
  );

  return response.data;
}

export async function sendMessage(
  chatId: number,
  content: string,
): Promise<Message> {
  const response = await api.post(
    "/api/messages",
    {
      chat_id: chatId,
      content,
    },
  );

  return response.data;
}