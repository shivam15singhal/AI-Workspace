import AppHeader from "@/components/layout/AppHeader";
import AppLayout from "@/components/layout/AppLayout";
import AppSidebar from "@/components/layout/AppSidebar";
import ChatArea from "@/components/layout/ChatArea";
import ChatInput from "@/components/layout/ChatInput";

export default function Chat() {
  return (
    <AppLayout
      sidebar={<AppSidebar />}
      header={<AppHeader />}
      footer={<ChatInput />}
    >
      <ChatArea />
    </AppLayout>
  );
}