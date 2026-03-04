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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-3 mb-4 ${isAssistant ? '' : 'flex-row-reverse'}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
          isAssistant
            ? 'bg-[#22C55E]/10'
            : 'bg-white/[0.06]'
        }`}
      >
        {isAssistant ? (
          <SparklesIcon className="w-4 h-4 text-[#22C55E]/70" />
        ) : (
          <UserCircleIcon className="w-4 h-4 text-white/40" />
        )}
      </div>

      {/* Bubble */}
      <div className={`flex-1 max-w-[80%] ${isAssistant ? '' : 'flex flex-col items-end'}`}>
        {/* Role label */}
        <span className={`text-[10px] font-medium mb-1 block ${
          isAssistant ? 'text-[#22C55E]/60' : 'text-white/30 text-right'
        }`}>
          {isAssistant ? 'Assistant' : 'You'}
        </span>

        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isAssistant
              ? 'bg-white/[0.03] border border-white/[0.05] rounded-tl-md text-white/80'
              : 'bg-[#22C55E]/10 border border-[#22C55E]/10 rounded-tr-md text-white/85'
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
        <span className={`text-[10px] mt-1 px-1 text-white/20 block ${
          isAssistant ? 'text-left' : 'text-right'
        }`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
}


