'use client';

import { motion } from 'framer-motion';
import { SparklesIcon, UserCircleIcon } from '@heroicons/react/24/outline';

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-4 mb-6 ${isAssistant ? '' : 'flex-row-reverse'}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isAssistant
            ? 'bg-gradient-to-br from-[#22C55E] to-[#16A34A]'
            : 'bg-[#1F2933]'
        }`}
      >
        {isAssistant ? (
          <SparklesIcon className="w-5 h-5 text-white" />
        ) : (
          <UserCircleIcon className="w-6 h-6 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={`flex-1 max-w-[80%] ${
          isAssistant ? '' : 'flex justify-end'
        }`}
      >
        <div
          className={`rounded-2xl px-5 py-3 ${
            isAssistant
              ? 'bg-[#1F2933] text-white border border-[#2D3748]'
              : 'bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
          <span
            className={`text-xs mt-2 block ${
              isAssistant ? 'text-white opacity-60' : 'text-white opacity-80'
            }`}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
