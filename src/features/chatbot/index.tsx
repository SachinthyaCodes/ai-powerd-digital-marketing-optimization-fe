'use client';

import ChatHeader from './components/ChatHeader';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import SessionsTopBar from './components/SessionsTopBar';
import { useChatbot } from './hooks/useChatbot';

export default function Chatbot() {
  const {
    messages, isLoading, sendMessage, newChat, clearHistory,
    sessionList, sessionsLoading, activeSessionId, loadSession, deleteSession,
  } = useChatbot();

  return (
    <div className="h-full flex flex-col bg-[#0B0F14] overflow-hidden">
      {/* Sessions history strip (top) */}
      <SessionsTopBar
        sessions={sessionList}
        activeSessionId={activeSessionId}
        isLoading={sessionsLoading}
        onNewChat={newChat}
        onSelectSession={loadSession}
        onDeleteSession={deleteSession}
      />

      {/* Chat header */}
      <ChatHeader onNewChat={newChat} onClearHistory={clearHistory} />

      {/* Messages area */}
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onPromptSelect={sendMessage}
      />

      {/* Input */}
      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
}
