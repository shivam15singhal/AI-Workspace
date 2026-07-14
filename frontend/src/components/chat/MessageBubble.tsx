import { Bot, User } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";
import type { Message } from "@/types/message";
import { motion } from "framer-motion";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

type Props = {
  message: Message;
};

export default function MessageBubble({
  message,
}: Props) {
  const isUser = message.role === "user";

  return (
    <motion.div
     initial={{
    opacity: 0,
    y: 20,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  transition={{
    duration: 0.25,
  }}
      className={`flex gap-3 ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
      
    >
      {!isUser && (
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarFallback className="bg-black text-white">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={`max-w-3xl rounded-2xl px-5 py-3 shadow-sm ${
          isUser
            ? "bg-black text-white"
            : "border bg-muted"
        }`}
      >
        <MarkdownRenderer
  content={message.content}
/>
{message.streaming && (
  <motion.span
    animate={{
      opacity: [0, 1, 0],
    }}
    transition={{
      duration: 1,
      repeat: Infinity,
    }}
    className="ml-1 inline-block font-bold"
  >
    ▍
  </motion.span>
)}
      </div>

      {isUser && (
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
}