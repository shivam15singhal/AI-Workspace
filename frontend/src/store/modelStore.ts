import { create } from "zustand";

type ModelState = {
  selectedModel: string;

  setSelectedModel: (
    model: string,
  ) => void;
};

export const useModelStore =
  create<ModelState>((set) => ({
    selectedModel: "llama3.2",

    setSelectedModel: (
      model,
    ) =>
      set({
        selectedModel: model,
      }),
  }));