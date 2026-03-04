'use client';

import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import SuggestedPrompts from './SuggestedPrompts';
import { SparklesIcon } from '@heroicons/react/24/outline';

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
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
      <div className="max-w-3xl mx-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[420px] text-center px-4">
            {/* Decorative icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#22C55E]/20 to-[#22C55E]/5 border border-[#22C55E]/10 flex items-center justify-center mb-6">
              <SparklesIcon className="w-7 h-7 text-[#22C55E]/80" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white/90 mb-2">
              How can I help you today?
            </h2>
            <p className="text-white/35 text-[13px] max-w-sm leading-relaxed mb-10">
              Ask about marketing strategies, campaigns, content ideas, or get analytics insights.
            </p>
            <SuggestedPrompts onSelectPrompt={handlePromptClick} />
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {isLoading && (
              <div className="flex gap-3 mb-5">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#22C55E]/10 flex items-center justify-center">
                  <SparklesIcon className="w-4 h-4 text-[#22C55E]/70" />
                </div>
                <div className="flex-1 max-w-[75%]">
                  <div className="bg-white/[0.03] rounded-2xl rounded-tl-md px-4 py-3 border border-white/[0.04]">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-[#22C55E]/60 rounded-full animate-bounce bounce-d0" />
                      <div className="w-1.5 h-1.5 bg-[#22C55E]/60 rounded-full animate-bounce bounce-d150" />
                      <div className="w-1.5 h-1.5 bg-[#22C55E]/60 rounded-full animate-bounce bounce-d300" />
                    </div>
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
