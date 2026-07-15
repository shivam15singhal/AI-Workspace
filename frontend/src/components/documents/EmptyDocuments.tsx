import { FolderOpen } from "lucide-react";

export default function EmptyDocuments() {
  return (
    <div
      className="
        flex
        h-72
        flex-col
        items-center
        justify-center
        rounded-xl
        border
        border-dashed
      "
    >
      <FolderOpen
        className="
          h-14
          w-14
          text-muted-foreground
        "
      />

      <h2 className="mt-4 text-lg font-semibold">
        No documents yet
      </h2>

      <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
        Upload PDFs, DOCX, TXT or Markdown files
        to chat with your knowledge.
      </p>
    </div>
  );
}