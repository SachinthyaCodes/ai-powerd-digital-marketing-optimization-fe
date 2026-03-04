'use client';

import { useState, KeyboardEvent } from 'react';
import { PaperAirplaneIcon, PaperClipIcon } from '@heroicons/react/24/outline';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export default function ChatInput({ onSendMessage, isLoading = false }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasText = message.trim().length > 0;

  return (
    <div className="flex-shrink-0 bg-[#070B12] px-4 pb-5 pt-2">
      <div className="max-w-3xl mx-auto">
        <div className={`flex items-end gap-2 px-4 py-3 rounded-2xl border transition-all duration-200 ${
          hasText
            ? 'bg-white/[0.05] border-[#22C55E]/35'
            : 'bg-white/[0.03] border-white/[0.07] focus-within:border-white/[0.13] focus-within:bg-white/[0.04]'
        }`}>

          {/* Attach */}
          <button
            className="flex-shrink-0 mb-0.5 p-1.5 rounded-lg text-white/20 hover:text-white/55 hover:bg-white/[0.06] transition-all"
            title="Attach file"
          >
            <PaperClipIcon className="w-4 h-4" />
          </button>

          {/* Textarea */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your marketing assistant anything..."
            disabled={isLoading}
            rows={1}
            className="chat-textarea flex-1 bg-transparent text-white/90 placeholder-white/20 focus:outline-none resize-none disabled:opacity-40 text-sm leading-relaxed py-0.5"
          />

          {/* Send */}
          <button
            onClick={handleSend}
            disabled={!hasText || isLoading}
            className={`flex-shrink-0 mb-0.5 w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
              hasText && !isLoading
                ? 'bg-[#22C55E] text-[#070B12] hover:bg-[#16A34A] shadow-md shadow-[#22C55E]/30 active:scale-95'
                : 'bg-white/[0.05] text-white/20 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <div className="w-3.5 h-3.5 border-[1.5px] border-white/20 border-t-white/70 rounded-full animate-spin" />
            ) : (
              <PaperAirplaneIcon className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <p className="text-center text-white/10 text-[10px] mt-2 tracking-wide">
          Enter to send &middot; Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
