'use client';

import { motion } from 'framer-motion';

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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`flex items-start gap-3 mb-6 ${isAssistant ? '' : 'flex-row-reverse'}`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${
        isAssistant
          ? 'bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E]'
          : 'bg-white/[0.07] border border-white/[0.12] text-white/50'
      }`}>
        {isAssistant ? (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" />
          </svg>
        ) : (
          <span>U</span>
        )}
      </div>

      {/* Bubble area */}
      <div className={`flex flex-col max-w-[80%] ${isAssistant ? 'items-start' : 'items-end'}`}>

        {/* Role label */}
        <p className={`text-[10px] font-semibold mb-1.5 ${
          isAssistant ? 'text-white/30 pl-0.5' : 'text-white/25 pr-0.5'
        }`}>
          {isAssistant ? 'Smart Assistant' : 'You'}
        </p>

        {/* Bubble */}
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isAssistant
            ? 'rounded-tl-sm bg-white/[0.04] border border-white/[0.07] text-white/85'
            : 'rounded-tr-sm bg-[#22C55E]/[0.12] border border-[#22C55E]/[0.18] text-white/90'
        }`}>
          {isAssistant ? (
            <div className="chat-markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}
        </div>

        {/* General-knowledge disclaimer */}
        {isGeneralKnowledge && (
          <div className="mt-2 flex items-start gap-2 rounded-xl border border-amber-500/15 bg-amber-500/[0.05] px-3 py-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor"
              className="w-3 h-3 flex-shrink-0 text-amber-400/60 mt-[1px]">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4m0 4h.01" />
            </svg>
            <p className="text-[11px] leading-snug text-amber-300/55">
              General knowledge — no matched business documents.
            </p>
          </div>
        )}

        {/* Timestamp */}
        <span className={`text-[10px] mt-1.5 text-white/15 ${
          isAssistant ? 'pl-0.5' : 'pr-0.5'
        }`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
}


