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
    <div className="p-3 sm:p-4 flex-shrink-0">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-2 bg-white/[0.03] border border-white/[0.06] rounded-2xl px-3 py-2 focus-within:border-[#22C55E]/30 focus-within:bg-white/[0.04] transition-all">
          {/* Attachment */}
          <button
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-white/25 hover:text-white/50 hover:bg-white/[0.04] transition-all mb-0.5"
            title="Attach file"
          >
            <PaperClipIcon className="w-4 h-4" />
          </button>

          {/* Input */}
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything..."
              disabled={isLoading}
              rows={1}
              className="chat-textarea w-full bg-transparent text-white/90 placeholder-white/25 focus:outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed text-sm py-1.5"
            />
          </div>

          {/* Send */}
          <button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-[#22C55E] text-[#0B0F14] hover:bg-[#16A34A] transition-all disabled:opacity-20 disabled:cursor-not-allowed mb-0.5"
          >
            {isLoading ? (
              <div className="w-3.5 h-3.5 border-2 border-[#0B0F14]/30 border-t-[#0B0F14] rounded-full animate-spin" />
            ) : (
              <PaperAirplaneIcon className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-[10px] text-white/15 text-center mt-2">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
