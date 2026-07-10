import AppHeader from "@/components/layout/AppHeader";
import AppLayout from "@/components/layout/AppLayout";
import AppSidebar from "@/components/layout/AppSidebar";
import ChatInput from "@/components/layout/ChatInput";
import WelcomeScreen from "@/components/layout/WelcomeScreen";

export default function App() {
  return (
    <AppLayout
      sidebar={<AppSidebar />}
      header={<AppHeader />}
      footer={<ChatInput />}
    >
      <WelcomeScreen />
    </AppLayout>
  );
}