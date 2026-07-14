import { Bot } from "lucide-react";

export default function SidebarHeader() {
  return (
    <div className="flex items-center gap-2 border-b p-5">
      <Bot className="h-7 w-7 text-primary" />

      <h1 className="text-lg font-bold">
        AI Workspace
      </h1>
    </div>
  );
}