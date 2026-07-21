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
  model: string,
): Promise<Message> {
  const response = await api.post(
    "/api/messages",
    {
      chat_id: chatId,
      content,
      model,
    },
  );

  return response.data;
}

export async function streamMessage(
  chatId: number,
  content: string,
  model: string,
  onChunk: (chunk: string) => void,
  signal: AbortSignal,
) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    "http://localhost:8000/api/messages/stream",
    {
      signal,
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        chat_id: chatId,
        content,
        model,
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

export async function editMessage(
  messageId: number,
  content: string,
): Promise<Message> {
  const response = await api.patch(
    `/api/messages/${messageId}`,
    {
      content,
    },
  );

  return response.data;
}

export async function streamEditedMessage(
  messageId: number,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const token =
    localStorage.getItem("token");

  const response = await fetch(
    `http://localhost:8000/api/messages/${messageId}/regenerate`,
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },

      signal,
    },
  );

  if (!response.ok) {
    throw new Error(
      `Request failed with status ${response.status}`,
    );
  }

  if (!response.body) {
    throw new Error(
      "No stream returned.",
    );
  }

  const reader =
    response.body.getReader();

  const decoder =
    new TextDecoder();

  while (true) {
    const {
      value,
      done,
    } = await reader.read();

    if (done) break;

    const chunk =
      decoder.decode(
        value,
        {
          stream: true,
        },
      );

    if (chunk) {
      onChunk(chunk);
    }
  }

  const remaining =
    decoder.decode();

  if (remaining) {
    onChunk(remaining);
  }
}