# AI Chatbot Integration Guide

## Quick Start

The AI Smart Chatbot is now fully integrated into your marketing strategy recommender platform. Here's everything you need to know.

## 📁 File Structure

```
src/
├── features/chatbot/
│   ├── index.tsx                       # Main export
│   ├── README.md                       # Feature documentation
│   ├── components/
│   │   ├── ChatHeader.tsx              # Header with controls
│   │   ├── ChatWindow.tsx              # Message display area
│   │   ├── ChatMessage.tsx             # Individual messages
│   │   ├── ChatInput.tsx               # Input field
│   │   └── SuggestedPrompts.tsx        # Quick action prompts
│   ├── hooks/
│   │   └── useChatbot.ts               # State management
│   ├── services/
│   │   └── chatbotService.ts           # API communication
│   ├── types/
│   │   └── index.ts                    # TypeScript definitions
│   └── utils/
│       └── messageUtils.ts             # Helper functions
│
├── app/
│   ├── dashboard/chat/
│   │   └── page.tsx                    # Chat page route
│   └── api/chatbot/
│       └── route.ts                    # API endpoint
```

## 🎨 Design System

The chatbot follows your existing dark theme design:

- **Background**: `#0B0F14`
- **Cards**: `#1F2933`
- **Borders**: `#2D3748`
- **Text**: `#F9FAFB` (primary), `#CBD5E1` (secondary), `#94A3B8` (tertiary)
- **Accent**: `#22C55E` (green)
- **Gradients**: Used for user messages and interactive elements

## 🚀 Usage

### Basic Implementation (Already Done)
```tsx
// src/app/dashboard/chat/page.tsx
import Chatbot from '@/features/chatbot';

export default function ChatPage() {
  return <Chatbot />;
}
```

### Custom Implementation
```tsx
import { useChatbot } from '@/features/chatbot/hooks/useChatbot';
import ChatWindow from '@/features/chatbot/components/ChatWindow';
import ChatInput from '@/features/chatbot/components/ChatInput';

function CustomChatInterface() {
  const { messages, isLoading, sendMessage } = useChatbot();
  
  return (
    <div className="h-screen flex flex-col">
      <ChatWindow 
        messages={messages} 
        isLoading={isLoading}
        onPromptSelect={sendMessage}
      />
      <ChatInput 
        onSendMessage={sendMessage} 
        isLoading={isLoading}
      />
    </div>
  );
}
```

## 🔌 Backend Integration

### Option 1: Using the API Route (Current Setup)

The chatbot currently uses `/api/chatbot` which includes mock responses for development.

**Location**: `src/app/api/chatbot/route.ts`

To integrate with a real AI service:

1. **OpenAI Integration**:
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const completion = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    {
      role: "system",
      content: "You are a marketing strategy assistant."
    },
    ...context,
    {
      role: "user",
      content: message
    }
  ],
});

const response = completion.choices[0].message.content;
```

2. **Anthropic Claude Integration**:
```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const message = await anthropic.messages.create({
  model: 'claude-3-opus-20240229',
  max_tokens: 1024,
  messages: [
    ...context,
    { role: 'user', content: message }
  ],
});

const response = message.content[0].text;
```

3. **Custom Backend**:
```typescript
const response = await fetch('https://your-backend.com/ai/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.AI_API_KEY}`,
  },
  body: JSON.stringify({ message, context }),
});

const data = await response.json();
```

### Option 2: Direct Service Integration

Modify `src/features/chatbot/services/chatbotService.ts`:

```typescript
async sendMessage(message: string, conversationHistory: Message[]): Promise<ChatResponse> {
  const response = await fetch('https://your-ai-backend.com/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AI_KEY}`,
    },
    body: JSON.stringify({
      message,
      history: conversationHistory,
    }),
  });

  const data = await response.json();
  return {
    content: data.response,
    timestamp: new Date(),
  };
}
```

## ⚙️ Environment Variables

Create or update `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_CHATBOT_API_URL=/api/chatbot

# OpenAI (if using)
OPENAI_API_KEY=sk-your-key-here

# Anthropic (if using)
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Custom Backend (if using)
AI_BACKEND_URL=https://your-backend.com
AI_API_KEY=your-api-key

# Optional: Feature Flags
NEXT_PUBLIC_ENABLE_MOCK_RESPONSES=true
```

## 📝 Key Features

### 1. **Message Management**
- Real-time chat interface
- Conversation history
- Auto-scroll to latest message
- Message timestamps

### 2. **Smart UI/UX**
- Empty state with suggested prompts
- Typing indicator with animated dots
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)
- Responsive design

### 3. **Suggested Prompts**
Six pre-defined prompts organized by category:
- Strategy
- Social Media
- Content
- Analytics
- Campaigns
- Optimization

### 4. **Developer Features**
- TypeScript support
- Mock responses for development
- Error handling
- Modular architecture
- Easy to extend

## 🎯 Testing

### Test the Chatbot:

1. **Navigate to Chat**:
   - Go to `http://localhost:3000/dashboard/chat`

2. **Try Suggested Prompts**:
   - Click any suggested prompt
   - See mock AI response

3. **Type Custom Messages**:
   - Type in the input field
   - Press Enter or click send

4. **Test Features**:
   - New Chat button
   - Clear History
   - Keyboard shortcuts

### API Health Check:

```bash
curl http://localhost:3000/api/chatbot
```

Expected response:
```json
{
  "status": "ok",
  "service": "chatbot",
  "version": "1.0.0",
  "timestamp": "2026-01-17T..."
}
```

## 🔧 Customization

### Add More Suggested Prompts

Edit `src/features/chatbot/components/SuggestedPrompts.tsx`:

```typescript
const prompts = [
  {
    id: 7,
    text: 'Your custom prompt here',
    icon: YourIcon,
    category: 'Custom Category',
  },
  // ... more prompts
];
```

### Customize System Prompt

Edit `src/app/api/chatbot/route.ts`:

```typescript
{
  role: "system",
  content: "You are a specialized marketing AI. Focus on [your specific requirements]."
}
```

### Change Theme Colors

All colors are defined using Tailwind classes. To change:

1. Update color variables in components
2. Or modify `tailwind.config.js` for global changes

### Add File Upload Support

The attachment button is already in place. To implement:

```typescript
// In ChatInput.tsx
const handleFileUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/chatbot/upload', {
    method: 'POST',
    body: formData,
  });
  
  // Handle response
};
```

## 📊 Analytics Integration

Track chatbot usage:

```typescript
// Add to useChatbot.ts
const sendMessage = async (content: string) => {
  // ... existing code
  
  // Track event
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'chatbot_message_sent', {
      message_length: content.length,
      conversation_length: messages.length,
    });
  }
};
```

## 🐛 Troubleshooting

### Messages Not Sending?
- Check API endpoint in `.env.local`
- Verify backend is running
- Check browser console for errors
- Ensure API route is accessible

### Styling Issues?
- Clear Next.js cache: `rm -rf .next`
- Restart dev server
- Check Tailwind config

### TypeScript Errors?
- Run `npm install`
- Restart TypeScript server in VS Code
- Check import paths

## 🚀 Next Steps

1. **Connect Real AI Backend**:
   - Choose your AI provider (OpenAI, Anthropic, etc.)
   - Update API route or service
   - Add environment variables

2. **Add Persistence**:
   - Save conversations to database
   - Load previous chats
   - Export conversations

3. **Enhance Features**:
   - Markdown rendering
   - Code syntax highlighting
   - Voice input
   - Message reactions

4. **Optimize Performance**:
   - Implement streaming responses
   - Add caching
   - Optimize bundle size

## 📚 Additional Resources

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [OpenAI API](https://platform.openai.com/docs/api-reference)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## ✅ Checklist

- [x] Chatbot UI components created
- [x] State management with custom hook
- [x] API route set up
- [x] Mock responses for development
- [x] TypeScript types defined
- [x] Suggested prompts implemented
- [x] Integrated into dashboard
- [ ] Connect to real AI backend
- [ ] Add conversation persistence
- [ ] Implement file uploads
- [ ] Add analytics tracking

---

**Need help?** Check the README.md in the chatbot feature folder for detailed component documentation.
