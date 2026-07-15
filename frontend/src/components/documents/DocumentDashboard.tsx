import { useState } from "react";

import type { Document } from "@/types/document";

import DocumentSearch from "./DocumentSearch";
import DocumentSort from "./DocumentSort";
import DocumentStats from "./DocumentStats";

type Props = {
  documents: Document[];
  search: string;
  onSearchChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
};

export default function DocumentDashboard({
  documents,
  search,
  onSearchChange,
  sort,
  onSortChange,
}: Props) {
  return (
    <div className="space-y-6">
      <DocumentStats documents={documents} />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:max-w-md">
          <DocumentSearch
            value={search}
            onChange={onSearchChange}
          />
        </div>

        <DocumentSort
          value={sort}
          onChange={onSortChange}
        />
      </div>
    </div>
  );
}