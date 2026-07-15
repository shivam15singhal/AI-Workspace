import api from "@/api/axios";
import type { AxiosProgressEvent } from "axios";

import type { Document } from "@/types/document";

export async function uploadDocument(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<Document> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    "/api/documents/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },

      onUploadProgress: (
        progressEvent: AxiosProgressEvent,
      ) => {
        if (!progressEvent.total) return;

        const progress = Math.round(
          (progressEvent.loaded * 100) /
            progressEvent.total,
        );

        onProgress?.(progress);
      },
    },
  );

  return response.data;
}

export async function getDocuments(): Promise<Document[]> {
  const response = await api.get(
    "/api/documents",
  );

  return response.data;
}

export async function deleteDocument(
  id: number,
): Promise<void> {
  await api.delete(
    `/api/documents/${id}`,
  );
}