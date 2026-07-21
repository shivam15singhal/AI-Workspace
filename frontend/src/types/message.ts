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

  // Existing UI compatibility
  streaming?: boolean;

  // New lifecycle state
  status?: MessageStatus;

  // Reserved for future features (Retry, Edit, Regenerate)
  error?: string;
}