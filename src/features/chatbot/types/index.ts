/**
 * Core message type for chat conversations
 */
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  metadata?: MessageMetadata;
}

/**
 * Optional metadata for messages
 */
export interface MessageMetadata {
  tokens?: number;
  model?: string;
  confidence?: number;
  sources?: string[];
}

/**
 * Chat API request payload
 */
export interface ChatRequest {
  message: string;
  context?: ConversationContext[];
  userId?: string;
  sessionId?: string;
}

/**
 * Chat API response
 */
export interface ChatResponse {
  content: string;
  timestamp: Date;
  metadata?: MessageMetadata;
}

/**
 * Conversation context for API calls
 */
export interface ConversationContext {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Saved conversation structure
 */
export interface SavedConversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

/**
 * Chatbot configuration
 */
export interface ChatbotConfig {
  apiEndpoint: string;
  maxContextMessages?: number;
  enableMockResponses?: boolean;
  theme?: 'light' | 'dark';
}

/**
 * Hook return type for useChatbot
 */
export interface UseChatbotReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearHistory: () => void;
  newChat: () => void;
}

/**
 * Suggested prompt structure
 */
export interface SuggestedPrompt {
  id: string;
  text: string;
  category?: string;
  icon?: string;
}
