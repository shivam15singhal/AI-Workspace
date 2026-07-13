import { useEffect } from "react";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useDocumentStore } from "@/store/documentStore";

export default function DocumentList() {
  const {
    documents,
    fetchDocuments,
    remove,
  } = useDocumentStore();

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return (
    <div className="space-y-3">
      {documents.map((document) => (
        <div
          key={document.id}
          className="flex items-center justify-between rounded-lg border p-3"
        >
          <span>{document.filename}</span>

          <Button
            size="icon"
            variant="ghost"
            onClick={() =>
              remove(document.id)
            }
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}