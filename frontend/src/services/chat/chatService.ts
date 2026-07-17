import api from "@/api/axios";

import type { Chat } from "@/types/chat";

export async function getChats(
  workspaceId: number,
): Promise<Chat[]> {
  const response = await api.get(
    "/api/chats",
    {
      params: {
        workspace_id: workspaceId,
      },
    },
  );

  return response.data;
}

export async function createChat(
  workspaceId: number,
): Promise<Chat> {
  const response = await api.post(
    "/api/chats",
    {
      workspace_id: workspaceId,
    },
  );

  return response.data;
}

export async function renameChat(
  chatId: number,
  title: string,
): Promise<Chat> {
  const response = await api.patch(
    `/api/chats/${chatId}`,
    {
      title,
    },
  );

  return response.data;
}

export async function deleteChat(
  chatId: number,
): Promise<void> {
  await api.delete(
    `/api/chats/${chatId}`,
  );
}