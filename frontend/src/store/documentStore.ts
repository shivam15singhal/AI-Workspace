import { create } from "zustand";

import type { Document } from "@/types/document";

import {
  uploadDocument,
  getDocuments,
  deleteDocument,
} from "@/services/document/documentService";

type DocumentState = {
  documents: Document[];

  fetchDocuments: () => Promise<void>;

  upload: (file: File) => Promise<void>;

  remove: (id: number) => Promise<void>;
};

export const useDocumentStore =
  create<DocumentState>((set) => ({
    documents: [],

    fetchDocuments: async () => {
      const documents =
        await getDocuments();

      set({
        documents,
      });
    },

    upload: async (file) => {
      const document =
        await uploadDocument(file);

      set((state) => ({
        documents: [
          document,
          ...state.documents,
        ],
      }));
    },

    remove: async (id) => {
      await deleteDocument(id);

      set((state) => ({
        documents: state.documents.filter(
          (document) =>
            document.id !== id,
        ),
      }));
    },
  }));