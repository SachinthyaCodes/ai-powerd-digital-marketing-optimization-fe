'use client';

import { useRouter } from 'next/navigation';

export default function CampaignsPage() {
  const router = useRouter();

  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden bg-[#0a1a10]">
      {/* Aurora-style radial gradient background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 60%, rgba(16,80,40,0.85) 0%, rgba(10,30,18,0.95) 55%, #0a1a10 100%)',
        }}
      />
      {/* Subtle animated green glow orbs */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full opacity-30"
        style={{
          background:
            'radial-gradient(ellipse at center, #22c55e 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto">
        <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
          Predicting Social Media Campaign Success Before Publishing
        </h1>
        <p className="text-lg text-gray-300 mb-10 leading-relaxed">
          Our AI-powered system helps Sri Lankan SMEs optimize social media campaigns by predicting
          engagement, analyzing content in Sinhala and English, and providing smart recommendations
          saving time, money, and effort.
        </p>
        <button
          onClick={() => router.push('/dashboard/campaigns/predict')}
          className="px-10 py-4 rounded-2xl bg-[#22c55e] text-white font-bold text-base uppercase tracking-widest shadow-lg hover:bg-[#16a34a] active:scale-95 transition-all duration-200"
        >
          TRY NOW
        </button>
      </div>
    </div>
  );
}
