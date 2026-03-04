'use client';

import { useState } from 'react';
import ChatHeader from './components/ChatHeader';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import ChatMenuPanel from './components/ChatMenuPanel';
import { useChatbot } from './hooks/useChatbot';

export default function Chatbot() {
  const {
    messages, isLoading, sendMessage, newChat, clearHistory,
    sessionList, sessionsLoading, activeSessionId, loadSession, deleteSession,
  } = useChatbot();

  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <div className="relative h-full flex flex-col bg-[#0B0F14]">
      <ChatHeader
        onNewChat={newChat}
        onClearHistory={clearHistory}
        onOpenPanel={() => setPanelOpen(true)}
      />
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onPromptSelect={sendMessage}
      />
      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />

      {/* Drawer — rendered last so it layers on top of everything */}
      <ChatMenuPanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        sessions={sessionList}
        sessionsLoading={sessionsLoading}
        activeSessionId={activeSessionId}
        onNewChat={newChat}
        onSelectSession={loadSession}
        onDeleteSession={deleteSession}
      />
    </div>
  );
}
