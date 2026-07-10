import { Bot } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function WelcomeScreen() {
  return (
    <div className="flex h-full items-center justify-center bg-background px-6">
      <Card className="w-full max-w-2xl border-0 shadow-none">
        <CardContent className="flex flex-col items-center gap-6 py-12 text-center">

          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10">
            <Bot className="h-10 w-10 text-primary" />
          </div>

          <div>
            <h1 className="text-5xl font-bold tracking-tight">
              AI Workspace
            </h1>

            <p className="mt-4 text-lg text-muted-foreground">
              Your Personal AI Assistant
            </p>
          </div>

          <p className="max-w-xl text-muted-foreground">
            Chat with local LLMs, upload documents,
            build AI agents, and search your own
            knowledge base — all in one workspace.
          </p>

          <Button size="lg">
            + Start New Chat
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}