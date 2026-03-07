'use client';

import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/config/api';
import PublicChatWidget from '@/features/chatbot/PublicChatWidget';

interface Props {
  tenantId: string;
}

export default function PublicChatPageClient({ tenantId }: Props) {
  const [storeName,  setStoreName]  = useState<string>('');
  const [notFound,   setNotFound]   = useState(false);
  const [loading,    setLoading]    = useState(true);

  // Resolve store display name via the lightweight GET /api/chat/store/:tenantId endpoint.
  // This does NOT trigger an LLM call — it just checks the service record exists.
  useEffect(() => {
    async function resolveStore() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/chat/store/${encodeURIComponent(tenantId)}`);

        if (res.status === 404) {
          setNotFound(true);
          return;
        }

        if (!res.ok) {
          // Unknown error — still show widget, let it handle its own errors
          setStoreName(tenantId);
          return;
        }

        const data = await res.json().catch(() => ({}));
        setStoreName(data.storeName || tenantId);
      } catch {
        // Network error — still show the widget, it will handle its own errors.
        setStoreName(tenantId);
      } finally {
        setLoading(false);
      }
    }
    resolveStore();
  }, [tenantId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center">
        <div className="flex gap-1.5">
          {[0,1,2].map((n) => (
            <span key={n} className="w-2 h-2 rounded-full bg-[#22C55E] animate-bounce"
              style={{ animationDelay: `${n * 0.15}s` }} />
          ))}
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex flex-col items-center justify-center text-center gap-4 p-8">
        <div className="w-16 h-16 rounded-2xl bg-[#0f2318] border border-[#22C55E]/20 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h1 className="text-white font-bold text-xl">Store Not Found</h1>
        <p className="text-[#6B7280] text-sm max-w-xs">
          The store link you followed is not active or does not exist. Please contact the business for the correct link.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F14] flex items-end justify-center sm:items-center sm:justify-center p-4 pb-6">
      <div style={{ width: '100%', maxWidth: '380px', height: 'min(580px, calc(100vh - 2rem))' }}>
        <PublicChatWidget tenantId={tenantId} storeName={storeName || 'Smart Assistant'} />
      </div>
    </div>
  );
}
