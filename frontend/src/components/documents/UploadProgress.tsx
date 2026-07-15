import {
  LoaderCircle,
} from "lucide-react";

import { Progress } from "@/components/ui/progress";

type Props = {
  progress: number;
};

export default function UploadProgress({
  progress,
}: Props) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">

      <div className="mb-4 flex items-center gap-3">

        <LoaderCircle className="h-5 w-5 animate-spin text-primary" />

        <div className="flex-1">

          <p className="font-medium">
            Uploading document...
          </p>

          <p className="text-sm text-muted-foreground">
            Please don't close this page.
          </p>

        </div>

        <span className="font-semibold">
          {progress}%
        </span>

      </div>

      <Progress value={progress} />

    </div>
  );
}