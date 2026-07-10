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
    <div className="flex h-screen bg-background">
      {sidebar}

      <div className="flex flex-1 flex-col">
        {header}

        <main className="flex-1 overflow-hidden">
          {children}
        </main>

        {footer}
      </div>
    </div>
  );
}