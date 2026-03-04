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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`flex gap-3 mb-5 ${isAssistant ? '' : 'flex-row-reverse'}`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 flex flex-col items-center gap-1">
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shadow-sm ${
            isAssistant
              ? 'bg-gradient-to-br from-[#22C55E] to-[#16A34A] text-white shadow-[#22C55E]/20'
              : 'bg-white/[0.08] text-white border border-white/[0.1]'
          }`}
        >
          {isAssistant ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" />
            </svg>
          ) : (
            <span>U</span>
          )}
        </div>
      </div>

      {/* Bubble */}
      <div className={`flex-1 max-w-[83%] ${isAssistant ? '' : 'flex flex-col items-end'}`}>
        {/* Role label */}
        <p className={`text-[11px] font-semibold mb-1.5 ${
          isAssistant ? 'text-white/40 pl-0.5' : 'text-white/30 pr-0.5'
        }`}>
          {isAssistant ? 'Smart Assistant' : 'You'}
        </p>

        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
            isAssistant
              ? 'bg-white/[0.04] text-white border border-white/[0.07] rounded-tl-md'
              : 'bg-[#22C55E]/15 text-white border border-[#22C55E]/20 rounded-tr-md'
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
          <div className="mt-2 flex items-start gap-2 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] px-3 py-2 max-w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor"
              className="w-3.5 h-3.5 flex-shrink-0 text-amber-400 mt-[1px]">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <p className="text-[11px] leading-snug text-amber-300/80">
              General knowledge response — no store-specific documents matched this query.
            </p>
          </div>
        )}

        {/* Timestamp */}
        <span className={`text-[10px] mt-1.5 px-0.5 text-white/20 block ${
          isAssistant ? 'text-left' : 'text-right'
        }`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
}


