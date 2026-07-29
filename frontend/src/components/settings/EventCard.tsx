import {
  Calendar,
  Clock,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  event: any;
  onDelete: (id: string) => void;
};

function formatDate(date?: string) {
  if (!date) return "No date";

  return new Date(date).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function EventCard({
  event,
  onDelete,
}: Props) {
  const start =
  typeof event.start === "string"
    ? event.start
    : event.start?.dateTime || event.start?.date;

  const end =
  typeof event.end === "string"
    ? event.end
    : event.end?.dateTime || event.end?.date;

  return (
    <div
      className="
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
      "
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            bg-primary/10
          "
        >
          <Calendar className="h-6 w-6 text-primary" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold">
            {event.summary || "Untitled Event"}
          </h3>

          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatDate(start)}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatDate(end)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-end gap-3">
        

        <Button
          variant="destructive"
          className="rounded-xl"
          onClick={() => onDelete(event.id)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}