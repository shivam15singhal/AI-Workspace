import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "highlight.js/styles/github-dark.css";

import App from "./App";
import { Toaster } from "sonner";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./theme/ThemeProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="ai-workspace-theme"
    >
      <AuthProvider>
        <App />
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);