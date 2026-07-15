import { create } from "zustand";
import { toast } from "sonner";

import type { Document } from "@/types/document";

import {
  uploadDocument,
  getDocuments,
  deleteDocument,
} from "@/services/document/documentService";

type DocumentState = {
  documents: Document[];

  uploadProgress: number;
  isUploading: boolean;

  pollingInterval: ReturnType<typeof setInterval> | null;

  fetchDocuments: () => Promise<void>;

  upload: (file: File) => Promise<void>;

  remove: (id: number) => Promise<void>;

  startPolling: () => void;
};

export const useDocumentStore =
  create<DocumentState>((set) => ({
    documents: [],

    uploadProgress: 0,

    isUploading: false,

    pollingInterval: null,

    fetchDocuments: async () => {
      const documents = await getDocuments();

      set({
        documents,
      });
    },

    upload: async (file) => {
      try {
        set({
          isUploading: true,
          uploadProgress: 0,
        });

        const document =
          await uploadDocument(
            file,
            (progress) => {
              set({
                uploadProgress: progress,
              });
            },
          );

        toast.success(
          `${file.name} uploaded successfully.`,
        );

        set((state) => ({
          documents: [
            document,
            ...state.documents,
          ],
          uploadProgress: 100,
        }));

        const state =
          useDocumentStore.getState();

        state.startPolling();
      } catch (error) {
        toast.error(
          "Failed to upload document.",
        );

        console.error(error);
      } finally {
        set({
          isUploading: false,
        });
      }
    },

    remove: async (id) => {
      try {
        await deleteDocument(id);

        toast.success(
          "Document deleted.",
        );

        set((state) => ({
          documents:
            state.documents.filter(
              (document) =>
                document.id !== id,
            ),
        }));
      } catch (error) {
        toast.error(
          "Failed to delete document.",
        );

        console.error(error);
      }
    },

    startPolling: () => {
      const state =
        useDocumentStore.getState();

      if (state.pollingInterval) {
        return;
      }

      const interval = setInterval(
        async () => {
          try {
            const documents =
              await getDocuments();

            set({
              documents,
            });

            const processing =
              documents.some(
                (doc) =>
                  doc.status ===
                    "uploading" ||
                  doc.status ===
                    "processing",
              );

            if (!processing) {
              clearInterval(
                interval,
              );

              set({
                pollingInterval: null,
              });
            }
          } catch (error) {
            console.error(error);

            clearInterval(interval);

            set({
              pollingInterval: null,
            });
          }
        },
        2000,
      );

      set({
        pollingInterval: interval,
      });
    },
  }));