import {
  Bot,
  MessageSquarePlus,
  MessageCircle,
  FileText,
  Brain,
  Database,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function WelcomeScreen() {
  return (
    <div className="flex h-full items-center justify-center bg-background px-6">
      <Card
        className="
          w-full
          max-w-3xl
          rounded-3xl
          border
          border-border/60
          bg-card/80
          shadow-sm
          backdrop-blur
        "
      >
        <CardContent className="flex flex-col items-center gap-8 py-12 text-center">
          {/* AI Icon */}
          <div
            className="
              flex
              h-24
              w-24
              items-center
              justify-center
              rounded-3xl
              bg-linear-to-br
              from-primary/20
              to-primary/5
              shadow-sm
            "
          >
            <Bot className="h-11 w-11 text-primary" />
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              AI Workspace
            </h1>

            <p className="mt-4 text-lg text-muted-foreground">
              One place for conversations, documents, and AI workflows.
            </p>
          </div>

          {/* Description */}
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            Chat with multiple AI models, upload documents for retrieval,
            build intelligent AI workflows, and search your personal
            knowledge base—all from one unified workspace.
          </p>

          {/* Feature Chips */}
          <div className="flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 text-sm font-medium">
              <MessageCircle className="h-4 w-4 text-primary" />
              AI Chat
            </div>

            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 text-sm font-medium">
              <FileText className="h-4 w-4 text-primary" />
              RAG Documents
            </div>

            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 text-sm font-medium">
              <Brain className="h-4 w-4 text-primary" />
              AI Agents
            </div>

            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 text-sm font-medium">
              <Database className="h-4 w-4 text-primary" />
              Local LLMs
            </div>
          </div>

          {/* CTA */}
          <Button
            size="lg"
            className="h-12 rounded-xl px-6 shadow-sm"
          >
            <MessageSquarePlus className="mr-2 h-5 w-5" />
            Start New Chat
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}