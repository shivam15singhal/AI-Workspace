import {
  FileText,
  HardDrive,
  Calendar,
} from "lucide-react";

import type { Document } from "@/types/document";

type Props = {
  documents: Document[];
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

export default function DocumentStats({
  documents,
}: Props) {
  const totalSize = documents.reduce(
    (sum, document) =>
      sum + document.size,
    0,
  );

  const lastUpload =
    documents.length > 0
      ? new Date(
          documents[0].created_at,
        ).toLocaleDateString()
      : "--";

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="
group
rounded-2xl
border
border-border/60
bg-card
p-6
shadow-sm
transition-all
duration-200
hover:-translate-y-1
hover:border-primary/20
hover:shadow-lg
">
        <div
  className="
    mb-4
    flex
    h-12
    w-12
    items-center
    justify-center
    rounded-2xl
    bg-primary/10
    transition-colors
    duration-200
    group-hover:bg-primary/15
  "
>
  <FileText className="h-6 w-6 text-primary" />
</div>

        <p className="text-3xl font-bold tracking-tight">
          {documents.length}
        </p>

        <p className="text-sm font-medium text-muted-foreground">
          Documents
        </p>
      </div>

      <div className="rounded-xl border bg-card p-5">
        <HardDrive className="mb-3 h-6 w-6 text-primary" />

        <p className="text-2xl font-bold">
          {formatSize(totalSize)}
        </p>

        <p className="text-sm text-muted-foreground">
          Total Storage
        </p>
      </div>

      <div className="rounded-xl border bg-card p-5">
        <Calendar className="mb-3 h-6 w-6 text-primary" />

        <p className="text-xl font-bold">
          {lastUpload}
        </p>

        <p className="text-sm text-muted-foreground">
          Last Upload
        </p>
      </div>
    </div>
  );
}