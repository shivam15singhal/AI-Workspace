import type { ReactNode } from "react";

type AppLayoutProps = {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AppLayout({
  sidebar,
  header,
  children,
  footer,
}: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {sidebar}

      <div className="flex min-w-0 flex-1 flex-col">
        {header}

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto h-full max-w-7xl px-6 py-6">
            {children}
          </div>
        </main>

        {footer}
      </div>
    </div>
  );
}