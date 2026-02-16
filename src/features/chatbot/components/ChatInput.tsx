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
    <div className="border-t border-[#1F2933] bg-[#0B0F14] p-5">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          {/* Attachment Button */}
          <button
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-[#1A1F2E] text-white hover:bg-[#252B3B] hover:text-white transition-all opacity-60 hover:opacity-100"
            title="Attach file"
          >
            <PaperClipIcon className="w-4 h-4" />
          </button>

          {/* Input Field */}
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about marketing strategies..."
              disabled={isLoading}
              rows={1}
              className="w-full px-4 py-2.5 bg-[#0B0F14] text-white placeholder-gray-400 rounded-lg border border-[#2D3748] focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E]/30 focus:outline-none resize-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              style={{
                minHeight: '42px',
                maxHeight: '120px',
                color: '#ffffff !important',
                backgroundColor: '#0B0F14 !important',
              }}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-[#22C55E] text-white hover:bg-[#16A34A] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#22C55E]"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <PaperAirplaneIcon className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Helper Text */}
        <div className="flex items-center gap-2 mt-2.5 ml-12 text-xs text-white opacity-60">
          <kbd className="px-1.5 py-0.5 bg-[#1A1F2E] rounded text-white font-mono text-xs border border-[#2D3748] opacity-80">Enter</kbd>
          <span>to send</span>
          <kbd className="px-1.5 py-0.5 bg-[#1A1F2E] rounded text-white font-mono text-xs border border-[#2D3748] opacity-80">Shift + Enter</kbd>
          <span>for new line</span>
        </div>
      </div>
    </div>
  );
}
