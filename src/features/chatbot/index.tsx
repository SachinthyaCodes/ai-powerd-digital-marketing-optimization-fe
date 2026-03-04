'use client';

import ChatHeader from './components/ChatHeader';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import { useChatbot } from './hooks/useChatbot';

export default function Chatbot() {
  const {
    messages, isLoading, sendMessage, newChat, clearHistory,
    sessionList, sessionsLoading, activeSessionId, loadSession, deleteSession,
  } = useChatbot();

  return (
    <div className="h-full flex flex-col bg-[#0B0F14] overflow-hidden">
      <ChatHeader
        onNewChat={newChat}
        onClearHistory={clearHistory}
        sessions={sessionList}
        sessionsLoading={sessionsLoading}
        activeSessionId={activeSessionId}
        onSelectSession={loadSession}
        onDeleteSession={deleteSession}
      />
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onPromptSelect={sendMessage}
      />
      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
}
