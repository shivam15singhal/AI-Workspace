import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useDocumentStore } from "@/store/documentStore";

export default function DocumentUpload() {
  const upload = useDocumentStore(
    (state) => state.upload,
  );

  async function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    await upload(file);

    event.target.value = "";
  }

  return (
    <div className="flex items-center gap-3">
      <Button asChild>
        <label className="cursor-pointer">
          <Upload className="mr-2 h-4 w-4" />
          Upload Document

          <input
            type="file"
            className="hidden"
            accept=".pdf,.docx,.txt,.md"
            onChange={handleUpload}
          />
        </label>
      </Button>
    </div>
  );
}