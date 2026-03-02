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
            <div className="inline-flex items-center gap-2 mb-4 sm:mb-6">
              <SparklesIcon className="w-6 h-6 sm:w-8 sm:h-8 text-[#22C55E]" />
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                AI Marketing Assistant
              </h3>
            </div>
            <p className="text-white text-xs sm:text-sm mb-8 sm:mb-10 max-w-lg opacity-90">
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
