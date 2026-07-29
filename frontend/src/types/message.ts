export type MessageStatus =
  | "streaming"
  | "completed"
  | "failed"
  | "aborted";

export interface Message {
  id: number;
  chat_id: number;
  role: "user" | "assistant";
  content: string;
  created_at: string;

  streaming?: boolean;

  status?: MessageStatus;

  
  error?: string;
}