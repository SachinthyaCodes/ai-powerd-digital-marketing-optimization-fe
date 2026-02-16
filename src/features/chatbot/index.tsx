'use client';

import ChatHeader from './components/ChatHeader';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import { useChatbot } from './hooks/useChatbot';

export default function Chatbot() {
  const { messages, isLoading, sendMessage, newChat, clearHistory } = useChatbot();

  return (
    <div className="h-screen flex flex-col bg-[#0B0F14]">
      <ChatHeader onNewChat={newChat} onClearHistory={clearHistory} />
      <ChatWindow 
        messages={messages} 
        isLoading={isLoading} 
        onPromptSelect={sendMessage}
      />
      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
}
