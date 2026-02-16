/**
 * Chatbot Configuration Constants
 */

export const CHATBOT_CONFIG = {
  // API Settings
  API_ENDPOINT: process.env.NEXT_PUBLIC_CHATBOT_API_URL || '/api/chatbot',
  REQUEST_TIMEOUT: 30000, // 30 seconds
  
  // Message Limits
  MAX_MESSAGE_LENGTH: 2000,
  MAX_CONTEXT_MESSAGES: 20, // Number of previous messages to send as context
  
  // UI Settings
  AUTO_SCROLL_DELAY: 100,
  TYPING_INDICATOR_DELAY: 500,
  
  // Feature Flags
  ENABLE_MOCK_RESPONSES: process.env.NODE_ENV === 'development',
  ENABLE_FILE_UPLOAD: false,
  ENABLE_VOICE_INPUT: false,
  
  // Retry Settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
} as const;

/**
 * Suggested Prompt Categories
 */
export const PROMPT_CATEGORIES = {
  STRATEGY: 'Strategy',
  SOCIAL_MEDIA: 'Social Media',
  CONTENT: 'Content',
  ANALYTICS: 'Analytics',
  CAMPAIGNS: 'Campaigns',
  OPTIMIZATION: 'Optimization',
} as const;

/**
 * Message Role Types
 */
export const MESSAGE_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  API_ERROR: 'Unable to get a response. Please try again.',
  RATE_LIMIT: 'Too many requests. Please wait a moment and try again.',
  INVALID_INPUT: 'Please enter a valid message.',
  MESSAGE_TOO_LONG: `Message is too long. Maximum ${CHATBOT_CONFIG.MAX_MESSAGE_LENGTH} characters.`,
  TIMEOUT: 'Request timed out. Please try again.',
} as const;

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  CONVERSATION_SAVED: 'Conversation saved successfully.',
  CONVERSATION_CLEARED: 'Conversation history cleared.',
  MESSAGE_SENT: 'Message sent.',
} as const;

/**
 * Animation Durations (in milliseconds)
 */
export const ANIMATION_DURATIONS = {
  MESSAGE_APPEAR: 300,
  SCROLL: 500,
  TYPING_DOT: 150,
  FADE: 200,
} as const;

/**
 * Keyboard Shortcuts
 */
export const KEYBOARD_SHORTCUTS = {
  SEND_MESSAGE: 'Enter',
  NEW_LINE: 'Shift+Enter',
  NEW_CHAT: 'Ctrl+N',
  CLEAR_INPUT: 'Escape',
} as const;

/**
 * Storage Keys
 */
export const STORAGE_KEYS = {
  CONVERSATION_HISTORY: 'chatbot_conversation_history',
  USER_PREFERENCES: 'chatbot_user_preferences',
  LAST_SESSION: 'chatbot_last_session',
} as const;

/**
 * API Response Status Codes
 */
export const API_STATUS_CODES = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  RATE_LIMITED: 429,
  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;
