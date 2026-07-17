import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import WorkspaceSwitcher from "@/components/workspace/WorkspaceSwitcher";
import { Button } from "@/components/ui/button";

import SidebarHeader from "@/components/sidebar/SidebarHeader";
import SidebarSearch from "@/components/sidebar/SidebarSearch";
import SidebarFooter from "@/components/sidebar/SidebarFooter";
import ChatList from "@/components/sidebar/ChatList";

import { useChatStore } from "@/store/chatStore";

export default function AppSidebar() {
  const {
    chats,
    fetchChats,
    createNewChat,
    selectedChat,
    selectChat,
  } = useChatStore();

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const filteredChats = chats.filter((chat) =>
    chat.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <aside className="flex h-screen w-72 flex-col border-r bg-background">
      <SidebarHeader />
      <WorkspaceSwitcher />

      <div className="p-4">
        <Button
          className="w-full justify-start"
          onClick={createNewChat}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>

      <SidebarSearch
        value={search}
        onChange={setSearch}
      />

      <ChatList
        chats={filteredChats}
        selectedChat={selectedChat}
        search={search}
        onSelect={selectChat}
      />

      <SidebarFooter />
    </aside>
  );
}