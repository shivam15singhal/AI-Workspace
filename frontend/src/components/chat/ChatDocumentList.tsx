import { FileText, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useDocumentStore } from "@/store/documentStore";

export default function ChatDocumentList() {
  const {
    chatDocuments,
    remove,
  } = useDocumentStore();

  if (chatDocuments.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 pt-6">
      <div className="rounded-2xl border bg-card p-4 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-muted-foreground">
          Uploaded Documents
        </h3>

        <div className="space-y-2">
          {chatDocuments.map((document) => (
            <div
              key={document.id}
              className="flex items-center justify-between rounded-xl border px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />

                <div>
                  <p className="text-sm font-medium">
                    {document.filename}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {document.status}
                  </p>
                </div>
              </div>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => remove(document.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}