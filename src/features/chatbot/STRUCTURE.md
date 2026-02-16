# AI Smart Chatbot - Complete Structure

## 📦 Complete File Tree

```
src/features/chatbot/
│
├── 📄 index.tsx                           # Main Chatbot component (entry point)
├── 📄 README.md                           # Feature documentation
├── 📄 INTEGRATION.md                      # (See root CHATBOT_INTEGRATION.md)
│
├── 📁 components/                         # UI Components
│   ├── ChatHeader.tsx                     # Top bar with controls
│   ├── ChatWindow.tsx                     # Message display area
│   ├── ChatMessage.tsx                    # Individual message bubble
│   ├── ChatInput.tsx                      # Input field & send button
│   └── SuggestedPrompts.tsx               # Quick action prompts
│
├── 📁 hooks/                              # Custom React Hooks
│   └── useChatbot.ts                      # Main state management hook
│
├── 📁 services/                           # Business Logic
│   └── chatbotService.ts                  # API communication service
│
├── 📁 types/                              # TypeScript Definitions
│   └── index.ts                           # Type definitions & interfaces
│
├── 📁 utils/                              # Helper Functions
│   └── messageUtils.ts                    # Message formatting utilities
│
└── 📁 constants/                          # Configuration
    └── index.ts                           # Constants & config values
```

## 🔄 Component Hierarchy

```
Chatbot (index.tsx)
│
├── ChatHeader
│   ├── Title & Status
│   ├── New Chat Button
│   └── Menu Dropdown
│       ├── Save Conversation
│       └── Clear History
│
├── ChatWindow
│   ├── Empty State
│   │   ├── Welcome Message
│   │   └── SuggestedPrompts (6 prompts)
│   │
│   └── Message List
│       ├── ChatMessage (user)
│       ├── ChatMessage (assistant)
│       ├── ChatMessage (user)
│       └── ... (more messages)
│
└── ChatInput
    ├── Attachment Button
    ├── Textarea Input
    └── Send Button
```

## 📊 Data Flow

```
User Action
    ↓
ChatInput Component
    ↓
sendMessage() from useChatbot hook
    ↓
chatbotService.sendMessage()
    ↓
API Route (/api/chatbot)
    ↓
AI Backend (OpenAI, Claude, etc.)
    ↓
Response returned
    ↓
Update messages state
    ↓
ChatWindow re-renders
    ↓
Display new message
```

## 🎨 Component Responsibilities

### **index.tsx** (Main Component)
```typescript
- Orchestrates all sub-components
- Uses useChatbot hook for state
- Passes callbacks to children
```

### **ChatHeader.tsx**
```typescript
- Displays title and status
- Handles new chat creation
- Manages menu actions
- Props: onNewChat, onClearHistory
```

### **ChatWindow.tsx**
```typescript
- Displays message history
- Shows empty state with prompts
- Auto-scrolls to latest message
- Props: messages, isLoading, onPromptSelect
```

### **ChatMessage.tsx**
```typescript
- Renders individual message
- Differentiates user vs assistant
- Shows avatar and timestamp
- Props: message { id, content, role, timestamp }
```

### **ChatInput.tsx**
```typescript
- Handles user input
- Manages send button state
- Keyboard shortcuts
- Props: onSendMessage, isLoading
```

### **SuggestedPrompts.tsx**
```typescript
- Displays 6 preset prompts
- Handles prompt selection
- Category-based organization
- Props: onSelectPrompt
```

## 🔧 Hooks & Services

### **useChatbot.ts**
```typescript
State:
- messages: Message[]
- isLoading: boolean
- error: string | null

Functions:
- sendMessage(content: string)
- clearHistory()
- newChat()

Returns: UseChatbotReturn
```

### **chatbotService.ts**
```typescript
Methods:
- sendMessage(message, context): Promise<ChatResponse>
- saveConversation(messages): Promise<void>
- loadConversation(id): Promise<Message[]>

Features:
- API communication
- Mock responses for dev
- Error handling
```

## 📝 Type System

### **Core Types**
```typescript
Message {
  id: string
  content: string
  role: 'user' | 'assistant' | 'system'
  timestamp: Date
  metadata?: MessageMetadata
}

ChatResponse {
  content: string
  timestamp: Date
  metadata?: MessageMetadata
}

UseChatbotReturn {
  messages: Message[]
  isLoading: boolean
  error: string | null
  sendMessage: (content: string) => Promise<void>
  clearHistory: () => void
  newChat: () => void
}
```

## 🎯 Integration Points

### **1. Dashboard Integration**
```
src/app/dashboard/chat/page.tsx
└── Imports: @/features/chatbot
```

### **2. API Integration**
```
src/app/api/chatbot/route.ts
├── POST: Handle chat messages
└── GET: Health check
```

### **3. Environment Config**
```
.env.local
├── NEXT_PUBLIC_CHATBOT_API_URL
├── OPENAI_API_KEY (optional)
└── ANTHROPIC_API_KEY (optional)
```

## 🎨 Styling System

### **Color Palette**
```css
Background:     #0B0F14
Cards:          #1F2933
Borders:        #2D3748
Text Primary:   #F9FAFB
Text Secondary: #CBD5E1
Text Tertiary:  #94A3B8
Accent Green:   #22C55E
Success:        #16A34A
```

### **Component Styling Patterns**
```
- Glass morphism effects
- Gradient backgrounds for user messages
- Smooth transitions (300ms)
- Hover states with color shifts
- Focus rings with accent color
```

## 🚀 Feature Checklist

### ✅ **Implemented**
- [x] Message sending/receiving
- [x] Conversation history
- [x] Typing indicators
- [x] Auto-scroll
- [x] Suggested prompts
- [x] Empty states
- [x] Loading states
- [x] Error handling
- [x] Keyboard shortcuts
- [x] Responsive design
- [x] TypeScript support
- [x] Mock responses (dev)
- [x] API route setup

### 🔜 **Ready to Implement**
- [ ] Real AI backend connection
- [ ] File attachments
- [ ] Conversation persistence
- [ ] Export conversations
- [ ] Message editing
- [ ] Voice input
- [ ] Markdown rendering
- [ ] Code syntax highlighting
- [ ] Search history
- [ ] Multi-language support

## 📚 Usage Examples

### **Example 1: Basic Usage**
```typescript
import Chatbot from '@/features/chatbot';

function ChatPage() {
  return <Chatbot />;
}
```

### **Example 2: With Custom Hook**
```typescript
import { useChatbot } from '@/features/chatbot/hooks/useChatbot';

function CustomChat() {
  const { messages, sendMessage, isLoading } = useChatbot();
  
  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
    </div>
  );
}
```

### **Example 3: Programmatic Interaction**
```typescript
const chatbot = useChatbot();

// Send a message
await chatbot.sendMessage("Hello!");

// Clear history
chatbot.clearHistory();

// Start new chat
chatbot.newChat();
```

## 🔍 Key Files Summary

| File | Purpose | Lines | Complexity |
|------|---------|-------|------------|
| index.tsx | Main component | ~20 | Low |
| ChatHeader.tsx | Header UI | ~90 | Medium |
| ChatWindow.tsx | Message display | ~100 | Medium |
| ChatMessage.tsx | Message bubble | ~70 | Low |
| ChatInput.tsx | Input field | ~100 | Medium |
| SuggestedPrompts.tsx | Prompt buttons | ~80 | Low |
| useChatbot.ts | State management | ~80 | High |
| chatbotService.ts | API calls | ~120 | High |
| messageUtils.ts | Utilities | ~200 | Medium |
| constants/index.ts | Config | ~100 | Low |

## 🎓 Best Practices

1. **State Management**: Use the `useChatbot` hook for all state
2. **Styling**: Follow existing color palette and spacing
3. **Types**: Import from `@/features/chatbot/types`
4. **Constants**: Use values from `constants/index.ts`
5. **Error Handling**: Always catch and display errors
6. **Performance**: Memoize callbacks, optimize re-renders

---

**Total Components**: 6 UI components + 1 main component
**Total Files**: 11 files
**Total Features**: 13 implemented, 12 planned
**Tech Stack**: Next.js 16, React 18, TypeScript, Tailwind, Framer Motion
