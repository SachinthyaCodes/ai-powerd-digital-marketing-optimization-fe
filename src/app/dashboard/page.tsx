'use client';

import { SparklesIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline';
import Aurora from '@/components/Aurora';
import Link from 'next/link';

const quickActions = [
  {
    title: 'Marketing Strategy',
    description: 'AI-generated strategies tailored to your business goals and audience.',
    href: '/dashboard/strategy',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
  },
  {
    title: 'Content Generator',
    description: 'Create compelling marketing copy, social posts, and ad content instantly.',
    href: '/content-generator',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
  {
    title: 'Performance Predictor',
    description: 'Forecast campaign outcomes before you spend a single dollar.',
    href: '/performance-predictor',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
  {
    title: 'Smart Assistant',
    description: 'Chat with your AI marketing advisor for real-time guidance.',
    href: '/smart-assistant',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  },
  {
    title: 'Marketing Calendar',
    description: 'Plan and schedule your campaigns with a unified timeline view.',
    href: '/dashboard/calendar',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    title: 'Business Profile',
    description: 'Define your brand identity to unlock personalized recommendations.',
    href: '/dashboard/my-business',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  },
];

const platformHighlights = [
  { label: 'AI Models', value: 'Multi-Model', detail: 'GPT · Gemini · Custom' },
  { label: 'Channels', value: '6+', detail: 'Social · Search · Email' },
  { label: 'Languages', value: 'Multi', detail: 'EN · SI · TA & more' },
  { label: 'Insights', value: 'Real-time', detail: 'Predict · Optimize · Scale' },
];

export default function DashboardHome() {
  return (
    <div className="relative min-h-screen bg-[#0B0F14] overflow-hidden">
      {/* Aurora Background — subtle accent */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <Aurora
          colorStops={["#22C55E", "#1F2933", "#0B0F14"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.3}
        />
      </div>

      {/* Page Content */}
      <div className="relative z-10 px-6 md:px-10 py-10 max-w-[1400px] mx-auto space-y-14">

        {/* ─── Hero Section ─── */}
        <section className="pt-6 md:pt-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1F2933] bg-[#0B0F14]/60 backdrop-blur-sm">
            <SparklesIcon className="h-4 w-4 text-[#22C55E]" />
            <span className="text-xs font-medium tracking-wide text-[#CBD5E1] uppercase">Dashboard</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-semibold text-[#F9FAFB] tracking-tight leading-[1.15]">
            Welcome back
          </h1>
          <p className="text-base md:text-lg text-[#CBD5E1] max-w-xl leading-relaxed">
            Your AI-powered command center for strategy, content, and campaign performance — all in one place.
          </p>
        </section>

        {/* ─── Platform Highlights ─── */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {platformHighlights.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[#1F2933] bg-[#0B0F14]/70 backdrop-blur-md px-5 py-5 space-y-1.5"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-[#CBD5E1]/60">{item.label}</p>
              <p className="text-2xl font-semibold text-[#F9FAFB]">{item.value}</p>
              <p className="text-xs text-[#CBD5E1]/80">{item.detail}</p>
            </div>
          ))}
        </section>

        {/* ─── Quick Actions Grid ─── */}
        <section className="space-y-6">
          <h2 className="text-lg font-medium text-[#F9FAFB]">Quick Actions</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group relative rounded-2xl border border-[#1F2933] bg-[#0B0F14]/60 backdrop-blur-md p-6 transition-all duration-300 hover:border-[#22C55E]/40 hover:bg-[#1F2933]/30"
              >
                {/* Arrow indicator */}
                <ArrowUpRightIcon className="absolute top-5 right-5 h-4 w-4 text-[#CBD5E1]/30 group-hover:text-[#22C55E] transition-colors duration-300" />

                <div className="space-y-4">
                  {/* Icon */}
                  <div className="w-11 h-11 rounded-xl bg-[#1F2933]/60 border border-[#1F2933] flex items-center justify-center text-[#22C55E] group-hover:bg-[#22C55E]/10 transition-colors duration-300">
                    {action.icon}
                  </div>

                  {/* Text */}
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-semibold text-[#F9FAFB] group-hover:text-[#22C55E] transition-colors duration-300">
                      {action.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-[#CBD5E1]/70">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── Bottom Accent Bar ─── */}
        <section className="rounded-2xl border border-[#1F2933] bg-gradient-to-r from-[#22C55E]/5 via-[#0B0F14] to-[#0B0F14] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-[#F9FAFB]">Ready to grow?</p>
            <p className="text-xs text-[#CBD5E1]/70">
              Set up your business profile to unlock personalised AI strategies and insights.
            </p>
          </div>
          <Link
            href="/dashboard/my-business"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#22C55E] text-[#0B0F14] text-sm font-medium hover:bg-[#16A34A] transition-colors"
          >
            Set Up Profile
            <ArrowUpRightIcon className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}

