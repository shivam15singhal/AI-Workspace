import { create } from "zustand";
import { toast } from "sonner";

import { useChatStore } from "./chatStore";
import { useWorkspaceStore } from "./workspaceStore";

import type { Document } from "@/types/document";

import {
  uploadDocument,
  getWorkspaceDocuments,
  getChatDocuments,
  deleteDocument,
} from "@/services/document/documentService";

type DocumentState = {
  workspaceDocuments: Document[];
  chatDocuments: Document[];

  uploadProgress: number;
  isUploading: boolean;

  pollingInterval: ReturnType<typeof setInterval> | null;

  fetchWorkspaceDocuments: () => Promise<void>;
  fetchChatDocuments: () => Promise<void>;

  upload: (
    file: File,
    target: "chat" | "workspace",
  ) => Promise<void>;

  remove: (id: number) => Promise<void>;

  startPolling: (
    target: "chat" | "workspace",
  ) => void;
};

export const useDocumentStore = create<DocumentState>((set) => ({
  workspaceDocuments: [],
  chatDocuments: [],

  uploadProgress: 0,

  isUploading: false,

  pollingInterval: null,

  fetchWorkspaceDocuments: async () => {
  const workspace =
    useWorkspaceStore.getState().selectedWorkspace;

  if (!workspace) {
    set({
      workspaceDocuments: [],
    });

    return;
  }

  const documents =
    await getWorkspaceDocuments(workspace.id);

  set({
    workspaceDocuments: documents,
  });
},
fetchChatDocuments: async () => {
  const workspace =
    useWorkspaceStore.getState().selectedWorkspace;

  const chat =
    useChatStore.getState().selectedChat;

  if (!workspace || !chat) {
    set({
      chatDocuments: [],
    });

    return;
  }

  const documents =
    await getChatDocuments(
      workspace.id,
      chat.id,
    );

  set({
    chatDocuments: documents,
  });
},

  upload: async (
  file,
  target,
) => {
    try {
      set({
        isUploading: true,
        uploadProgress: 0,
      });

      const workspace =
        useWorkspaceStore.getState().selectedWorkspace;

      if (!workspace) {
        toast.error(
          "Please select a workspace.",
        );

        return;
      }

      const chat =
        useChatStore.getState().selectedChat;

      const document =
  await uploadDocument(
    file,
    workspace.id,
    target === "chat"
      ? chat?.id
      : null,
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
  ...(target === "workspace"
    ? {
        workspaceDocuments: [
          document,
          ...state.workspaceDocuments,
        ],
      }
    : {
        chatDocuments: [
          document,
          ...state.chatDocuments,
        ],
      }),

  uploadProgress: 100,
}));

      useDocumentStore
        .getState()
        .startPolling(target);
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
  workspaceDocuments:
    state.workspaceDocuments.filter(
      (document) => document.id !== id,
    ),

  chatDocuments:
    state.chatDocuments.filter(
      (document) => document.id !== id,
    ),
}));
    } catch (error) {
      toast.error(
        "Failed to delete document.",
      );

      console.error(error);
    }
  },

  startPolling: (target) => {
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
            clearInterval(interval);

            set({
              pollingInterval: null,
            });

            return;
          }

          const chat =
            useChatStore.getState().selectedChat;

          const documents =
  target === "workspace"
    ? await getWorkspaceDocuments(
        workspace.id,
      )
    : chat
      ? await getChatDocuments(
          workspace.id,
          chat.id,
        )
      : [];

          set(
  target === "workspace"
    ? {
        workspaceDocuments:
          documents,
      }
    : {
        chatDocuments:
          documents,
      },
);

          const processing =
            documents.some(
              (doc) =>
                doc.status ===
                  "uploading" ||
                doc.status ===
                  "processing",
            );

          if (!processing) {
            clearInterval(interval);

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