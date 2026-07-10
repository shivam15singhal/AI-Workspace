import AppLayout from "@/components/layout/AppLayout";
import AppSidebar from "@/components/layout/AppSidebar";
import WelcomeScreen from "@/components/layout/WelcomeScreen";

export default function App() {
  return (
    <AppLayout
      sidebar={<AppSidebar />}
      header={<></>}
    >
      <WelcomeScreen />
    </AppLayout>
  );
}