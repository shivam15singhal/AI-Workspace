import MessageList from "@/components/chat/MessageList";
import ChatDocumentList from "@/components/chat/ChatDocumentList"

export default function ChatArea() {
  return (
    <div className="h-full overflow-y-auto">
    <ChatDocumentList />

    <MessageList />
</div>
  );
}