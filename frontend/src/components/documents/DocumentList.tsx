import type { Document } from "@/types/document";

import DocumentCard from "./DocumentCard";
import EmptyDocuments from "./EmptyDocuments";

type Props = {
  documents: Document[];
  onDelete: (id: number) => void;
};

export default function DocumentList({
  documents,
  onDelete,
}: Props) {
  if (documents.length === 0) {
    return <EmptyDocuments />;
  }

  return (
    <div className="space-y-3">
      {documents.map((document) => (
        <DocumentCard
          key={document.id}
          document={document}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}