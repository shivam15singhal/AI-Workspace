import {
  Moon,
  Search,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AppHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-6">

      <h2 className="text-xl font-semibold">
        AI Workspace
      </h2>

      <div className="flex items-center gap-3">

        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search chats..."
            className="w-72 pl-9"
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
        >
          <Moon className="h-5 w-5" />
        </Button>

        <Avatar>
          <AvatarFallback>
            SS
          </AvatarFallback>
        </Avatar>

      </div>

    </header>
  );
}