import { useEffect, useMemo, useState } from "react";

import DocumentDashboard from "@/components/documents/DocumentDashboard";
import DocumentList from "@/components/documents/DocumentList";
import DocumentUpload from "@/components/documents/DocumentUpload";

import { useDocumentStore } from "@/store/documentStore";

export default function Documents() {
  const {
    workspaceDocuments,
    fetchWorkspaceDocuments,
    remove,
  } = useDocumentStore();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    fetchWorkspaceDocuments();
  }, [fetchWorkspaceDocuments]);

  const filteredDocuments = useMemo(() => {
    let result = [...workspaceDocuments];

    // Search
    result = result.filter((document) =>
      document.filename
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    // Sorting
    switch (sort) {
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        );
        break;

      case "az":
        result.sort((a, b) =>
          a.filename.localeCompare(b.filename)
        );
        break;

      case "za":
        result.sort((a, b) =>
          b.filename.localeCompare(a.filename)
        );
        break;

      default:
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
    }

    return result;
  }, [workspaceDocuments, search, sort]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          Documents
        </h1>

        <p className="mt-2 text-muted-foreground">
          Upload, organize and search your AI knowledge base.
        </p>
      </div>

      <DocumentDashboard
        documents={workspaceDocuments}
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
      />

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <DocumentUpload />
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <DocumentList
          documents={filteredDocuments}
          onDelete={remove}
        />
      </div>
    </div>
  );
}