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
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] sm:min-h-[450px] text-center px-4">
            {/* Icon + glow */}
            <div className="relative mb-5 sm:mb-7">
              <div className="absolute inset-0 rounded-full bg-[#22C55E]/20 blur-2xl scale-150" />
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#22C55E]/20 to-[#16A34A]/10 border border-[#22C55E]/30 flex items-center justify-center shadow-lg shadow-[#22C55E]/10">
                <SparklesIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#22C55E]" />
              </div>
            </div>

            {/* Status badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-[11px] text-[#22C55E] font-medium">AI Ready</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
              AI Marketing Assistant
            </h3>
            <p className="text-white/60 text-xs sm:text-sm mb-8 sm:mb-10 max-w-sm leading-relaxed">
              Ask me anything about marketing strategies, campaigns, content creation, or get personalized recommendations.
            </p>
            
            {/* Suggested Prompts */}
            <SuggestedPrompts onSelectPrompt={handlePromptClick} />
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {isLoading && (
              <div className="flex gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 max-w-[80%]">
                  <div className="bg-[#1F2933] rounded-2xl px-5 py-3 border border-[#2D3748]">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
