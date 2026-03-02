'use client';

import { motion } from 'framer-motion';
import { SparklesIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    knowledgeSource?: 'store' | 'general';
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';
  const isGeneralKnowledge = isAssistant && message.knowledgeSource === 'general';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 mb-5 ${isAssistant ? '' : 'flex-row-reverse'}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-md ${
          isAssistant
            ? 'bg-gradient-to-br from-[#22C55E] to-[#16A34A]'
            : 'bg-[#1F2933] border border-[#2D3748]'
        }`}
      >
        {isAssistant ? (
          <SparklesIcon className="w-4 h-4 text-white" />
        ) : (
          <UserCircleIcon className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Bubble */}
      <div className={`flex-1 max-w-[82%] ${isAssistant ? '' : 'flex flex-col items-end'}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm ${
            isAssistant
              ? 'bg-[#1A2230] text-white/90 border border-[#2D3748] shadow-sm'
              : 'bg-gradient-to-br from-[#22C55E] to-[#16A34A] text-white shadow-md'
          }`}
        >
          {isAssistant ? (
            <div className="chat-markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
          )}
        </div>

        {/* General-knowledge disclaimer */}
        {isGeneralKnowledge && (
          <div className="mt-2 flex items-start gap-2 rounded-xl border border-amber-400/20 bg-amber-400/[0.08] px-3 py-2 max-w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-3.5 h-3.5 flex-shrink-0 text-amber-400 mt-[1px]"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <p className="text-[11px] leading-snug text-amber-300/90">
              General knowledge response — no store-specific documents matched this query.
            </p>
          </div>
        )}

        {/* Timestamp */}
        <span className={`text-[10px] mt-1 px-1 text-white/40 ${isAssistant ? '' : 'text-right'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
}


