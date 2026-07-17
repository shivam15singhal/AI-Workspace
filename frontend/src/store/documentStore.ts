import { create } from "zustand";
import { toast } from "sonner";

import { useWorkspaceStore } from "./workspaceStore";

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

  pollingInterval: ReturnType<
    typeof setInterval
  > | null;

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
      const workspace =
        useWorkspaceStore.getState()
          .selectedWorkspace;

      if (!workspace) {
        set({
          documents: [],
        });

        return;
      }

      const documents =
        await getDocuments(
          workspace.id,
        );

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

        const workspace =
          useWorkspaceStore.getState()
            .selectedWorkspace;

        if (!workspace) {
          toast.error(
            "Please select a workspace.",
          );

          return;
        }

        const document =
          await uploadDocument(
            file,
            workspace.id,
            (progress) => {
              set({
                uploadProgress:
                  progress,
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

        useDocumentStore
          .getState()
          .startPolling();
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
            const workspace =
              useWorkspaceStore.getState()
                .selectedWorkspace;

            if (!workspace) {
              clearInterval(
                interval,
              );

              set({
                pollingInterval:
                  null,
              });

              return;
            }

            const documents =
              await getDocuments(
                workspace.id,
              );

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
                pollingInterval:
                  null,
              });
            }
          } catch (error) {
            console.error(error);

            clearInterval(interval);

            set({
              pollingInterval:
                null,
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