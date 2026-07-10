import MessageList from "@/components/chat/MessageList";

export default function ChatArea() {
  return (
    <div className="h-full overflow-y-auto">
      <MessageList />
    </div>
  );
}