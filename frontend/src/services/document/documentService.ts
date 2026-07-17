import api from "@/api/axios";

import type { Document } from "@/types/document";

export async function uploadDocument(
  file: File,
  workspaceId: number,
  onProgress?: (
    progress: number,
  ) => void,
): Promise<Document> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    "/api/documents/upload",
    formData,
    {
      params: {
        workspace_id: workspaceId,
      },

      headers: {
        "Content-Type":
          "multipart/form-data",
      },

      onUploadProgress: (
        progressEvent,
      ) => {
        if (
          !progressEvent.total ||
          !onProgress
        )
          return;

        const progress = Math.round(
          (progressEvent.loaded /
            progressEvent.total) *
            100,
        );

        onProgress(progress);
      },
    },
  );

  return response.data;
}

export async function getDocuments(
  workspaceId: number,
): Promise<Document[]> {
  const response = await api.get(
    "/api/documents",
    {
      params: {
        workspace_id: workspaceId,
      },
    },
  );

  return response.data;
}

export async function deleteDocument(
  id: number,
) {
  await api.delete(
    `/api/documents/${id}`,
  );
}