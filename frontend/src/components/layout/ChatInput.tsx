import { Paperclip, SendHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ChatInput() {
  return (
    <div className="border-t bg-background p-4">
      <div className="mx-auto flex max-w-4xl items-end gap-3 rounded-2xl border bg-card p-3 shadow-sm">

        <Button
          variant="ghost"
          size="icon"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <Textarea
          placeholder="Type your message..."
          className="min-h-15 resize-none border-0 shadow-none focus-visible:ring-0"
        />

        <Button size="icon">
          <SendHorizontal className="h-5 w-5" />
        </Button>

      </div>
    </div>
  );
}