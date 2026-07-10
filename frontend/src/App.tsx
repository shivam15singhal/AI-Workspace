import AppLayout from "@/components/layout/AppLayout";
import AppSidebar from "@/components/layout/AppSidebar";

export default function App() {
  return (
    <AppLayout
      sidebar={<AppSidebar />}
      header={<></>}
    >
      <div className="flex h-full items-center justify-center">
        <h1 className="text-4xl font-bold">
          Welcome to AI Workspace
        </h1>
      </div>
    </AppLayout>
  );
}
