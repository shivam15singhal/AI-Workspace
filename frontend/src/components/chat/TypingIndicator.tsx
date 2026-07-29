import { Bot } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-3">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarFallback className="bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-md">
          <Bot className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>

      <div className="rounded-2xl border border-border/60 bg-card px-6 py-5 shadow-sm">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: "0ms" }}
          />

          <span
            className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: "150ms" }}
          />

          <span
            className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}