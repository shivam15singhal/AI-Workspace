type AppLayoutProps = {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  children: React.ReactNode;
};

export default function AppLayout({
  sidebar,
  header,
  children,
}: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      {sidebar}

      <div className="flex flex-1 flex-col">
        {header}

        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}