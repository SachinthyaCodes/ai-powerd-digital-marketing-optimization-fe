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

  return (
    <div className="flex-shrink-0 bg-[#0D1117] border-t border-white/[0.06] px-4 py-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-end gap-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3 focus-within:border-[#22C55E]/40 focus-within:bg-white/[0.06] transition-all duration-200">
          {/* Attachment Button */}
          <button
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-all mb-0.5"
            title="Attach file"
          >
            <PaperClipIcon className="w-4 h-4" />
          </button>

          {/* Input */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Message Smart Assistant..."
            disabled={isLoading}
            rows={1}
            className="chat-textarea flex-1 bg-transparent text-white placeholder-white/25 focus:outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed text-sm py-0.5 leading-relaxed"
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-[#22C55E] text-white hover:bg-[#16A34A] active:scale-95 transition-all shadow-lg shadow-[#22C55E]/20 disabled:opacity-25 disabled:cursor-not-allowed disabled:shadow-none mb-0.5"
          >
            {isLoading ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <PaperAirplaneIcon className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
        <p className="text-center text-white/15 text-[10px] mt-2">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
