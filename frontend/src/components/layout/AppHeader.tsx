import { Sparkles } from "lucide-react";
import UserMenu from "@/components/auth/UserMenu";
import ModelSelector from "@/components/chat/ModelSelector";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur-xl">
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>

        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            AI Workspace
          </h1>

          <p className="text-sm text-muted-foreground">
            Your intelligent AI assistant
          </p>
        </div>
      </div>

      {/* Right */}
     <div className="flex items-center gap-4">
  <ModelSelector />
  <UserMenu />
</div>
    </header>
  );
}