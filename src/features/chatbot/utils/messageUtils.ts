import { Message } from '../types';

/**
 * Format a date to a readable time string
 */
export function formatMessageTime(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format a date to a readable date string
 */
export function formatMessageDate(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameDay(date, today)) {
    return 'Today';
  } else if (isSameDay(date, yesterday)) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  }
}

/**
 * Check if two dates are on the same day
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Generate a unique message ID
 */
export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Group messages by date
 */
export function groupMessagesByDate(messages: Message[]): Map<string, Message[]> {
  const grouped = new Map<string, Message[]>();

  messages.forEach((message) => {
    const dateKey = formatMessageDate(message.timestamp);
    const existing = grouped.get(dateKey) || [];
    grouped.set(dateKey, [...existing, message]);
  });

  return grouped;
}

/**
 * Truncate long text with ellipsis
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Extract conversation title from messages
 */
export function extractConversationTitle(messages: Message[]): string {
  if (messages.length === 0) return 'New Conversation';
  
  const firstUserMessage = messages.find(m => m.role === 'user');
  if (!firstUserMessage) return 'New Conversation';
  
  return truncateText(firstUserMessage.content, 50);
}

/**
 * Calculate conversation duration
 */
export function getConversationDuration(messages: Message[]): string {
  if (messages.length < 2) return '0m';

  const firstMessage = messages[0];
  const lastMessage = messages[messages.length - 1];
  
  const durationMs = lastMessage.timestamp.getTime() - firstMessage.timestamp.getTime();
  const minutes = Math.floor(durationMs / 60000);
  
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

/**
 * Check if message contains code
 */
export function hasCodeBlock(content: string): boolean {
  return /```[\s\S]*?```/.test(content);
}

/**
 * Parse markdown code blocks
 */
export function parseCodeBlocks(content: string): Array<{ language: string; code: string }> {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const blocks: Array<{ language: string; code: string }> = [];
  
  let match;
  while ((match = codeBlockRegex.exec(content)) !== null) {
    blocks.push({
      language: match[1] || 'text',
      code: match[2].trim(),
    });
  }
  
  return blocks;
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
}

/**
 * Calculate message statistics
 */
export function getMessageStats(messages: Message[]): {
  total: number;
  userMessages: number;
  assistantMessages: number;
  averageLength: number;
} {
  const stats = {
    total: messages.length,
    userMessages: messages.filter(m => m.role === 'user').length,
    assistantMessages: messages.filter(m => m.role === 'assistant').length,
    averageLength: 0,
  };

  if (messages.length > 0) {
    const totalLength = messages.reduce((sum, m) => sum + m.content.length, 0);
    stats.averageLength = Math.round(totalLength / messages.length);
  }

  return stats;
}
