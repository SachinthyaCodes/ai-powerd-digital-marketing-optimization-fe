# AI Smart Chatbot Feature

## Overview
The AI Smart Chatbot is a fully-featured conversational interface designed to provide intelligent marketing assistance and strategic advice. The UI is built to match the existing system design with dark theme aesthetics.

## Folder Structure

```
src/features/chatbot/
├── index.tsx                          # Main Chatbot component (entry point)
├── components/
│   ├── ChatHeader.tsx                 # Header with title, status, and action buttons
│   ├── ChatWindow.tsx                 # Message display area with empty state
│   ├── ChatMessage.tsx                # Individual message bubble component
│   └── ChatInput.tsx                  # Input field with send button
├── hooks/
│   └── useChatbot.ts                  # Custom hook for chat logic and state
└── services/
    └── chatbotService.ts              # API service for backend communication
```

## Components

### 1. **Chatbot** (`index.tsx`)
Main container component that orchestrates all chat functionality.
- Manages overall layout
- Integrates header, window, and input components
- Uses the `useChatbot` hook for state management

### 2. **ChatHeader** (`components/ChatHeader.tsx`)
Top section of the chat interface.
- Displays chat title with status indicator
- "New Chat" button to start fresh conversations
- Menu with options (Save, Clear History)

### 3. **ChatWindow** (`components/ChatWindow.tsx`)
Main content area displaying messages.
- Shows conversation history
- Empty state with welcome message and suggested prompts
- Auto-scrolls to latest message
- Loading indicator with typing animation

### 4. **ChatMessage** (`components/ChatMessage.tsx`)
Individual message bubble component.
- Supports user and assistant roles
- Different styling for each role (user = green gradient, assistant = dark)
- Displays timestamp
- Avatar icons (SparklesIcon for AI, UserCircleIcon for user)
- Smooth animation on message appearance

### 5. **ChatInput** (`components/ChatInput.tsx`)
Message input area at the bottom.
- Auto-expanding textarea
- Attachment button (placeholder for file uploads)
- Send button with loading state
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)
- Helper text for keyboard shortcuts

## Hooks

### **useChatbot** (`hooks/useChatbot.ts`)
Custom React hook managing chat state and logic.

**State:**
- `messages`: Array of chat messages
- `isLoading`: Loading state during API calls
- `error`: Error messages

**Functions:**
- `sendMessage(content)`: Send a message and get AI response
- `clearHistory()`: Clear all messages
- `newChat()`: Start a new conversation

## Services

### **chatbotService** (`services/chatbotService.ts`)
API communication layer for the chatbot.

**Methods:**
- `sendMessage(message, context)`: Send message to backend AI
- `saveConversation(messages)`: Save conversation history
- `loadConversation(id)`: Load previous conversation

**Features:**
- Fallback mock responses for development
- Error handling
- Context-aware conversations
- Environment-based configuration

## Design System

### Colors
- Background: `#0B0F14` (dark)
- Cards/Inputs: `#1F2933` (darker gray)
- Borders: `#2D3748` (medium gray)
- Text Primary: `#F9FAFB` (white)
- Text Secondary: `#CBD5E1` (light gray)
- Text Tertiary: `#94A3B8` (medium gray)
- Accent/AI: `#22C55E` (green)
- User Messages: Green gradient (`#22C55E` to `#16A34A`)

### Typography
- Header Title: `text-xl font-semibold`
- Message Text: `text-sm leading-relaxed`
- Timestamps: `text-xs`
- Helper Text: `text-xs`

### Spacing
- Component padding: `px-4 py-6` to `px-6 py-4`
- Message gaps: `gap-4` to `gap-6`
- Button spacing: `px-4 py-2`

### Animations
- Message entrance: Fade in + slide up (framer-motion)
- Typing indicator: Bouncing dots
- Smooth transitions: `transition-all duration-300`

## Usage

### Basic Implementation
```tsx
import Chatbot from '@/features/chatbot';

export default function ChatPage() {
  return <Chatbot />;
}
```

### With Custom Hook
```tsx
import { useChatbot } from '@/features/chatbot/hooks/useChatbot';
import ChatWindow from '@/features/chatbot/components/ChatWindow';
import ChatInput from '@/features/chatbot/components/ChatInput';

export default function CustomChat() {
  const { messages, isLoading, sendMessage } = useChatbot();
  
  return (
    <div>
      <ChatWindow messages={messages} isLoading={isLoading} />
      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
}
```

## Environment Variables

Add to `.env.local`:
```env
NEXT_PUBLIC_CHATBOT_API_URL=https://your-api-endpoint.com/api/chatbot
```

## API Integration

### Expected Request Format
```json
{
  "message": "Your question here",
  "context": [
    {
      "role": "user",
      "content": "Previous message"
    },
    {
      "role": "assistant",
      "content": "Previous response"
    }
  ]
}
```

### Expected Response Format
```json
{
  "response": "AI generated response text",
  "timestamp": "2026-01-17T10:30:00Z"
}
```

## Features

✅ **Real-time Chat Interface**
- Send and receive messages
- Conversation history
- Auto-scroll to latest message

✅ **Smart UI/UX**
- Empty state with suggested prompts
- Typing indicator
- Message timestamps
- Keyboard shortcuts

✅ **Responsive Design**
- Mobile-friendly
- Adapts to different screen sizes
- Smooth animations

✅ **Developer Experience**
- TypeScript support
- Modular architecture
- Mock responses for development
- Easy to extend and customize

## Future Enhancements

🔜 **Planned Features:**
- File attachments
- Conversation persistence
- Multiple chat sessions
- Message editing/deletion
- Export conversation
- Voice input
- Markdown rendering in messages
- Code syntax highlighting
- Suggested follow-up questions

## Dependencies

- **framer-motion**: Smooth animations
- **@heroicons/react**: Icon library
- **React**: UI framework
- **Next.js**: Framework
- **TypeScript**: Type safety

## Troubleshooting

### Messages not sending?
- Check API endpoint configuration
- Verify backend is running
- Check browser console for errors

### Styling issues?
- Ensure Tailwind CSS is properly configured
- Check for conflicting CSS classes
- Verify dark theme colors are applied

### Development mode not working?
- The chatbot uses mock responses when API is unavailable
- Check `NODE_ENV === 'development'` in chatbotService.ts
