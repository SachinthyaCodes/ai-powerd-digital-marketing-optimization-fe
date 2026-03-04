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
    <div className="h-full flex flex-row bg-[#0B0F14] overflow-hidden">
      {/* ── Left: chat column ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        <ChatHeader
          onNewChat={newChat}
          onClearHistory={clearHistory}
          panelOpen={panelOpen}
          onTogglePanel={() => setPanelOpen((v) => !v)}
        />
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onPromptSelect={sendMessage}
        />
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>

      {/* ── Right: inline panel ── */}
      <ChatMenuPanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        sessions={sessionList}
        sessionsLoading={sessionsLoading}
        activeSessionId={activeSessionId}
        onNewChat={newChat}
        onSelectSession={(id) => { loadSession(id); setPanelOpen(false); }}
        onDeleteSession={deleteSession}
      />
    </div>
  );
}
