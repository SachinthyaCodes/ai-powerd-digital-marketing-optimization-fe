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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handlePromptClick = (prompt: string) => {
    if (onPromptSelect) {
      onPromptSelect(prompt);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 bg-[#0D1117]">
      <div className="max-w-3xl mx-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[420px] text-center px-4">
            {/* Glowing icon */}
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#22C55E]/20 to-[#22C55E]/5 border border-[#22C55E]/20 flex items-center justify-center">
                <svg className="w-9 h-9 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-2xl blur-xl bg-[#22C55E]/10" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
              How can I help you today?
            </h2>
            <p className="text-white/40 text-sm max-w-sm leading-relaxed mb-10">
              Ask me anything about strategies, campaigns, content creation, or get personalized recommendations.
            </p>
            <SuggestedPrompts onSelectPrompt={handlePromptClick} />
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isLoading && (
              <div className="flex gap-3 mb-6">
                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center shadow-md shadow-[#22C55E]/20">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" />
                  </svg>
                </div>
                <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl rounded-tl-md px-5 py-3.5">
                  <div className="flex gap-1.5 items-center">
                    <div className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-bounce bounce-d0" />
                    <div className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-bounce bounce-d150" />
                    <div className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-bounce bounce-d300" />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
