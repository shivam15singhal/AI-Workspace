import {
  Bot,
  Plus,
  Settings,
  MessageSquare,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AppSidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col border-r bg-background">
      {/* Logo */}
      <div className="flex items-center gap-2 border-b p-5">
        <Bot className="h-7 w-7 text-primary" />
        <h1 className="text-lg font-bold">
          AI Workspace
        </h1>
      </div>

      {/* New Chat */}
      <div className="p-4">
        <Button className="w-full justify-start">
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Chat List */}
      <div className="flex-1 space-y-2 overflow-y-auto px-3">

        <Button
          variant="ghost"
          className="w-full justify-start"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          FastAPI
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Python
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          RAG
        </Button>

      </div>

      {/* Footer */}
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </aside>
  );
}