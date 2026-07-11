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