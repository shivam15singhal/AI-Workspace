import { Bot } from "lucide-react";

export default function SidebarHeader() {
  return (
    <div className="border-b border-border/60 px-6 py-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
          <Bot className="h-6 w-6 text-primary" />
        </div>

        <div>
          <h1 className="text-base font-semibold tracking-tight">
            AI Workspace
          </h1>

          <p className="text-xs text-muted-foreground">
            Your intelligent assistant
          </p>
        </div>
      </div>
    </div>
  );
}