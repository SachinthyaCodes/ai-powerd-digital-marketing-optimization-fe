'use client';

import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import SuggestedPrompts from './SuggestedPrompts';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  knowledgeSource?: 'store' | 'general';
}

interface ChatWindowProps {
  messages: Message[];
  isLoading?: boolean;
  onPromptSelect?: (prompt: string) => void;
}

export default function ChatWindow({ messages, isLoading = false, onPromptSelect }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto bg-[#070B12] flex flex-col">

      {messages.length === 0 ? (
        /* ── Empty / welcome state ── */
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-14 text-center">

          {/* Glow icon */}
          <div className="relative mb-8">
            <div className="w-[72px] h-[72px] rounded-[20px] bg-gradient-to-br from-[#22C55E]/20 via-[#22C55E]/10 to-transparent border border-[#22C55E]/25 flex items-center justify-center">
              <svg className="w-[34px] h-[34px] text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" />
              </svg>
            </div>
            <div className="absolute inset-0 rounded-[20px] bg-[#22C55E]/6 blur-3xl scale-[2.5] -z-10" />
          </div>

          <h2 className="text-[30px] sm:text-[36px] font-bold text-white tracking-tight mb-3 leading-none">
            Your Marketing Assistant
          </h2>
          <p className="text-white/35 text-sm sm:text-[15px] max-w-[400px] leading-relaxed mb-12">
            Ask anything about strategies, campaigns, and content — or pick a suggestion below to get started.
          </p>

          <SuggestedPrompts onSelectPrompt={(p) => onPromptSelect?.(p)} />
        </div>

      ) : (
        /* ── Message list ── */
        <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="flex items-start gap-3 mb-5">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" />
                </svg>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl rounded-tl-sm px-5 py-3.5 mt-0.5">
                <div className="flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-[#22C55E]/50 rounded-full animate-bounce bounce-d0" />
                  <div className="w-1.5 h-1.5 bg-[#22C55E]/50 rounded-full animate-bounce bounce-d150" />
                  <div className="w-1.5 h-1.5 bg-[#22C55E]/50 rounded-full animate-bounce bounce-d300" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
