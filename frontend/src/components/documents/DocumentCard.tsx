import { useState } from "react";
import {
  FileText,
  Trash2,
  CheckCircle2,
  FileType,
  FileCode2,
  FileSpreadsheet,
} from "lucide-react";

import type { Document } from "@/types/document";

import { Button } from "@/components/ui/button";

import DeleteDocumentDialog from "./DeleteDocumentDialog";

type Props = {
  document: Document;
  onDelete: (id: number) => void;
};

function formatSize(bytes: number) {
  if (bytes < 1024)
    return `${bytes} B`;

  if (bytes < 1024 * 1024)
    return `${(bytes / 1024).toFixed(1)} KB`;

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}
function getFileIcon(type: string) {
  if (type.includes("pdf")) {
    return (
      <FileType className="h-6 w-6 text-red-500" />
    );
  }

  if (type.includes("word")) {
    return (
      <FileText className="h-6 w-6 text-blue-500" />
    );
  }

  if (
    type.includes("markdown")
  ) {
    return (
      <FileCode2 className="h-6 w-6 text-green-500" />
    );
  }

  if (
    type.includes("text")
  ) {
    return (
      <FileSpreadsheet className="h-6 w-6 text-orange-500" />
    );
  }

  return (
    <FileText className="h-6 w-6" />
  );
}
export default function DocumentCard({
  document,
  onDelete,
}: Props) {
  const [showDelete, setShowDelete] =
    useState(false);

  return (
    <>
      <div
        className="
          group
          flex
          items-center
          justify-between
          rounded-xl
          border
          bg-card
          p-4
          transition-all
          hover:-translate-y-0.5
          hover:shadow-lg
        "
      >
        <div className="flex items-center gap-4">

          <div className="rounded-xl bg-primary/10 p-3">
            {getFileIcon(
  document.content_type,
)}
          </div>

          <div>
            <h3 className="font-medium">
              {document.filename}
            </h3>

            <p className="text-sm text-muted-foreground">
              {document.content_type}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {formatSize(document.size)}
              {" • "}
              {formatDate(
                document.created_at,
              )}
            </p>

           <div className="mt-2 flex items-center gap-2">

  {document.status === "ready" && (
    <>
      <CheckCircle2 className="h-4 w-4 text-green-500" />
      <span className="text-xs font-medium text-green-600">
        Ready
      </span>
    </>
  )}

  {document.status === "processing" && (
    <>
      <div className="h-3 w-3 animate-pulse rounded-full bg-blue-500" />
      <span className="text-xs font-medium text-blue-600">
        Processing
      </span>
    </>
  )}

  {document.status === "uploading" && (
    <>
      <div className="h-3 w-3 animate-pulse rounded-full bg-yellow-500" />
      <span className="text-xs font-medium text-yellow-600">
        Uploading
      </span>
    </>
  )}

  {document.status === "failed" && (
    <>
      <div className="h-3 w-3 rounded-full bg-red-500" />
      <span className="text-xs font-medium text-red-600">
        Failed
      </span>
    </>
  )}

</div>

          </div>
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="
            opacity-0
            transition-opacity
            duration-200
            group-hover:opacity-100
          "
          onClick={() =>
            setShowDelete(true)
          }
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>

      <DeleteDocumentDialog
        open={showDelete}
        filename={document.filename}
        onCancel={() =>
          setShowDelete(false)
        }
        onConfirm={() => {
          onDelete(document.id);
          setShowDelete(false);
        }}
      />
    </>
  );
}