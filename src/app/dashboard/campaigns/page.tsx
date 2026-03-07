'use client';

import { useRouter } from 'next/navigation';

export default function CampaignsPage() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: '#09110d' }}
    >
      {/* Large radial green glow from top-center — matches the image backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 28%, rgba(34,197,94,0.18) 0%, rgba(20,83,45,0.10) 40%, transparent 70%)',
        }}
      />

      {/* Pill-style green dot indicator */}
      <div className="z-10 mb-12 flex items-center justify-center">
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 40,
            height: 22,
            background: 'rgba(34,197,94,0.12)',
            border: '1px solid rgba(34,197,94,0.35)',
          }}
        >
          <span
            className="rounded-full bg-[#22C55E]"
            style={{
              width: 8,
              height: 8,
              boxShadow: '0 0 8px 2px rgba(34,197,94,0.8)',
            }}
          />
        </div>
      </div>

      {/* Heading + body */}
      <div className="z-10 text-center px-6 max-w-3xl mx-auto">
        <h1
          className="font-extrabold leading-[1.1] tracking-tight mb-7"
          style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4rem)' }}
        >
          <span className="text-white">Predict Social Media</span>
          <br />
          <span className="text-[#22C55E]">Campaign Performance</span>
          <br />
          <span className="text-white">Before Publishing</span>
        </h1>

        <p className="text-[#94A3B8] text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          Our AI-powered system helps Sri Lankan SMEs optimize social media
          campaigns by predicting engagement, analyzing content in Sinhala
          and English, and providing smart recommendations saving time,
          money, and effort.
        </p>

        <button
          onClick={() => router.push('/performance-predictor')}
          className="inline-flex items-center gap-3 bg-[#22C55E] hover:bg-[#16A34A] active:scale-95 text-white font-bold text-sm uppercase tracking-[0.15em] px-10 py-4 rounded-full transition-all duration-200"
          style={{ boxShadow: '0 4px 24px 0 rgba(34,197,94,0.30)' }}
        >
          TRY NOW
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
