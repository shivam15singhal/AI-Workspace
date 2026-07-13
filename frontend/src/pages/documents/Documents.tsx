import DocumentUpload from "@/components/documents/DocumentUpload";
import DocumentList from "@/components/documents/DocumentList";

export default function Documents() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-3xl font-bold">
        Documents
      </h1>

      <DocumentUpload />

      <DocumentList />
    </div>
  );
}