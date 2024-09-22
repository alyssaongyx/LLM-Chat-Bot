export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ConversationParams {
  temperature?: number;
  max_tokens?: number;
}

export interface Conversation {
  id: string;
  name: string;
  messages: Message[];
  params: ConversationParams;
}
