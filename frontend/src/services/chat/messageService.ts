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

export async function streamMessage(
  chatId: number,
  content: string,
  onChunk: (chunk: string) => void,
) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    "http://localhost:8000/api/messages/stream",
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        chat_id: chatId,
        content,
      }),
    },
  );

  if (!response.body) {
    throw new Error("No stream returned.");
  }

  const reader = response.body.getReader();

  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();

    if (done) break;

    onChunk(
      decoder.decode(value),
    );
  }
}