import { useState } from "react";
import {
  UploadCloud,
  FileUp,
} from "lucide-react";

import UploadProgress from "./UploadProgress";

import { useDocumentStore } from "@/store/documentStore";

export default function DocumentUpload() {
  const {
    upload,
    uploadProgress,
    isUploading,
  } = useDocumentStore();

  const [dragging, setDragging] =
    useState(false);

  async function handleUpload(file: File) {
    await upload(file);
  }

  async function onInputChange(
  e: React.ChangeEvent<HTMLInputElement>,
) {
  const files = Array.from(
    e.target.files ?? [],
  );

  if (!files.length) return;

  for (const file of files) {
    await handleUpload(file);
  }

  e.target.value = "";
}

  async function onDrop(
  e: React.DragEvent<HTMLDivElement>,
) {
  e.preventDefault();

  setDragging(false);

  const files = Array.from(
    e.dataTransfer.files,
  );

  for (const file of files) {
    await handleUpload(file);
  }
}

  return (
    <div className="space-y-5">

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() =>
          setDragging(false)
        }
        onDrop={onDrop}
        className={`
          rounded-2xl
          border-2
          border-dashed
          p-10
          text-center
          transition-all
          duration-300

          ${
            dragging
              ? "border-primary bg-primary/10 scale-[1.02]"
              : "border-border hover:border-primary hover:bg-primary/5"
          }
        `}
      >
        {dragging ? (
          <FileUp className="mx-auto h-12 w-12 animate-bounce text-primary" />
        ) : (
          <UploadCloud className="mx-auto h-12 w-12 text-primary" />
        )}

        <h3 className="mt-5 text-xl font-semibold">
          {dragging
            ? "Drop your file here"
            : "Drag & Drop your documents"}
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Supports PDF, DOCX, TXT and Markdown
        </p>

        <label className="mt-6 inline-block cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-primary-foreground transition hover:opacity-90">
          Browse Files

          <input
            hidden
            type="file"
            multiple
            accept=".pdf,.docx,.txt,.md"
            onChange={onInputChange}
          />
        </label>
      </div>

      {isUploading && (
        <UploadProgress
          progress={uploadProgress}
        />
      )}
    </div>
  );
}