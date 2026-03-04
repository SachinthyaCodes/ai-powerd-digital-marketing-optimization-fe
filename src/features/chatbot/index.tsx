'use client';

import ChatHeader from './components/ChatHeader';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import SessionsSidebar from './components/SessionsSidebar';
import { useChatbot } from './hooks/useChatbot';

export default function Chatbot() {
  const {
    messages, isLoading, sendMessage, newChat, clearHistory,
    sessionList, sessionsLoading, activeSessionId, loadSession, deleteSession,
  } = useChatbot();

  return (
    <div className="h-screen flex bg-[#0B0F14] overflow-hidden">
      {/* Sessions sidebar */}
      <SessionsSidebar
        sessions={sessionList}
        activeSessionId={activeSessionId}
        isLoading={sessionsLoading}
        onNewChat={newChat}
        onSelectSession={loadSession}
        onDeleteSession={deleteSession}
      />

      {/* Main chat panel */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader onNewChat={newChat} onClearHistory={clearHistory} />
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onPromptSelect={sendMessage}
        />
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
