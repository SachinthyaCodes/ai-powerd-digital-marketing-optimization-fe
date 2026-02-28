'use client';

import { useState } from 'react';
import Aurora from '@/components/Aurora';

const platformOptions = ['Facebook', 'Instagram', 'TikTok', 'LinkedIn', 'Twitter/X', 'YouTube'];
const contentTypeOptions = ['Image Post', 'Video', 'Carousel', 'Story', 'Reel', 'Blog Article'];
const industryOptions = ['Retail', 'Food & Beverage', 'Fashion', 'Technology', 'Health & Wellness', 'Education', 'Finance', 'Tourism'];

const mockResults = {
  engagementScore: 78,
  reachEstimate: '45,200 – 68,500',
  clickThroughRate: '3.4%',
  conversionRate: '1.8%',
  estimatedROI: '2.4x',
  confidence: 'High',
  tips: [
    'Adding a clear call-to-action can increase CTR by up to 25%.',
    'Video content on this platform tends to outperform static images.',
    'Posting between 6 PM – 9 PM on weekdays shows higher engagement.',
    'Using 3–5 relevant hashtags improves discoverability without appearing spammy.',
  ],
};

export default function CampaignsPage() {
  const [showPredictor, setShowPredictor] = useState(false);
  const [form, setForm] = useState({
    campaignName: '',
    platform: '',
    contentType: '',
    industry: '',
    budget: '',
    duration: '',
    targetAudience: '',
    description: '',
  });
  const [predicted, setPredicted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePredict = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPredicted(true);
    }, 1500);
  };

  const isFormValid = form.platform && form.contentType && form.industry && form.budget;

  // ─── Hero Landing View ────────────────────────────────────────────────────
  if (!showPredictor) {
    return (
      <div className="relative min-h-screen bg-[#0B0F14] overflow-hidden">
        {/* Aurora Background */}
        <div className="absolute inset-0 opacity-40">
          <Aurora
            colorStops={["#22C55E", "#064e3b", "#0B0F14"]}
            blend={0.6}
            amplitude={1.2}
            speed={0.25}
          />
        </div>

        {/* Centered Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight">
              Predicting Social Media<br />Campaign Success Before<br />Publishing
            </h1>

            <p className="text-lg md:text-xl text-[#CBD5E1] max-w-2xl mx-auto leading-relaxed">
              Our AI-powered system helps Sri Lankan SMEs optimize social media
              campaigns by predicting engagement, analyzing content in Sinhala and English,
              and providing smart recommendations saving time, money, and effort.
            </p>

            <button
              onClick={() => setShowPredictor(true)}
              className="inline-block px-10 py-4 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-sm tracking-widest rounded-xl transition-all duration-200 shadow-lg shadow-[#22C55E]/20"
            >
              TRY NOW
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Predictor Form View ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#F9FAFB] p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => { setShowPredictor(false); setPredicted(false); setForm({ campaignName: '', platform: '', contentType: '', industry: '', budget: '', duration: '', targetAudience: '', description: '' }); }}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#1F2933] text-[#94A3B8] hover:text-[#F9FAFB] hover:border-[#22C55E]/40 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#F9FAFB]">Campaign Performance Predictor</h1>
            <p className="text-[#94A3B8] text-sm mt-0.5">
              Fill in your campaign details to get AI-powered predictions before publishing.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="bg-[#111827] border border-[#1F2933] rounded-2xl p-6 space-y-5">
            <h2 className="text-base font-semibold text-[#F9FAFB]">Campaign Details</h2>

            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Campaign Name <span className="text-[#64748B]">(optional)</span></label>
              <input name="campaignName" value={form.campaignName} onChange={handleChange} placeholder="e.g. Summer Sale 2026"
                className="w-full bg-[#0B0F14] border border-[#1F2933] rounded-lg px-4 py-2.5 text-sm text-[#F9FAFB] placeholder-[#4B5563] focus:outline-none focus:border-[#22C55E]/50 transition" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Platform <span className="text-[#22C55E]">*</span></label>
                <select name="platform" value={form.platform} onChange={handleChange}
                  className="w-full bg-[#0B0F14] border border-[#1F2933] rounded-lg px-3 py-2.5 text-sm text-[#F9FAFB] focus:outline-none focus:border-[#22C55E]/50 transition">
                  <option value="">Select</option>
                  {platformOptions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Content Type <span className="text-[#22C55E]">*</span></label>
                <select name="contentType" value={form.contentType} onChange={handleChange}
                  className="w-full bg-[#0B0F14] border border-[#1F2933] rounded-lg px-3 py-2.5 text-sm text-[#F9FAFB] focus:outline-none focus:border-[#22C55E]/50 transition">
                  <option value="">Select</option>
                  {contentTypeOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Industry <span className="text-[#22C55E]">*</span></label>
                <select name="industry" value={form.industry} onChange={handleChange}
                  className="w-full bg-[#0B0F14] border border-[#1F2933] rounded-lg px-3 py-2.5 text-sm text-[#F9FAFB] focus:outline-none focus:border-[#22C55E]/50 transition">
                  <option value="">Select</option>
                  {industryOptions.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Budget (LKR) <span className="text-[#22C55E]">*</span></label>
                <input name="budget" value={form.budget} onChange={handleChange} type="number" placeholder="e.g. 50000"
                  className="w-full bg-[#0B0F14] border border-[#1F2933] rounded-lg px-4 py-2.5 text-sm text-[#F9FAFB] placeholder-[#4B5563] focus:outline-none focus:border-[#22C55E]/50 transition" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Duration (days)</label>
                <input name="duration" value={form.duration} onChange={handleChange} type="number" placeholder="e.g. 14"
                  className="w-full bg-[#0B0F14] border border-[#1F2933] rounded-lg px-4 py-2.5 text-sm text-[#F9FAFB] placeholder-[#4B5563] focus:outline-none focus:border-[#22C55E]/50 transition" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Target Audience</label>
                <input name="targetAudience" value={form.targetAudience} onChange={handleChange} placeholder="e.g. Ages 18–35"
                  className="w-full bg-[#0B0F14] border border-[#1F2933] rounded-lg px-4 py-2.5 text-sm text-[#F9FAFB] placeholder-[#4B5563] focus:outline-none focus:border-[#22C55E]/50 transition" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Campaign Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                placeholder="Briefly describe your campaign goals and content..."
                className="w-full bg-[#0B0F14] border border-[#1F2933] rounded-lg px-4 py-2.5 text-sm text-[#F9FAFB] placeholder-[#4B5563] focus:outline-none focus:border-[#22C55E]/50 transition resize-none" />
            </div>

            <button onClick={handlePredict} disabled={!isFormValid || loading}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 bg-[#22C55E] hover:bg-[#16A34A] text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Predict Performance
                </>
              )}
            </button>
          </div>

          {/* Results Panel */}
          <div className="space-y-5">
            {!predicted ? (
              <div className="bg-[#111827] border border-[#1F2933] rounded-2xl p-10 flex flex-col items-center justify-center text-center h-full min-h-[420px]">
                <div className="w-16 h-16 rounded-full bg-[#1F2933] flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-[#4B5563]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                </div>
                <p className="text-[#64748B] text-sm">Fill in the campaign details and click<br /><span className="text-[#22C55E] font-medium">Predict Performance</span> to see your results.</p>
              </div>
            ) : (
              <>
                <div className="bg-[#111827] border border-[#1F2933] rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-[#F9FAFB]">Prediction Results</h2>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 font-medium">
                      {mockResults.confidence} Confidence
                    </span>
                  </div>
                  <div className="flex items-center gap-6 mb-5">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1F2933" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22C55E" strokeWidth="3"
                          strokeDasharray={`${mockResults.engagementScore} 100`} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-[#22C55E]">{mockResults.engagementScore}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#F9FAFB]">Engagement Score</p>
                      <p className="text-xs text-[#94A3B8] mt-0.5">Out of 100 — above average for {form.platform || 'this platform'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Estimated Reach', value: mockResults.reachEstimate },
                      { label: 'Click-Through Rate', value: mockResults.clickThroughRate },
                      { label: 'Conversion Rate', value: mockResults.conversionRate },
                      { label: 'Estimated ROI', value: mockResults.estimatedROI },
                    ].map((m) => (
                      <div key={m.label} className="bg-[#0B0F14] border border-[#1F2933] rounded-xl px-4 py-3">
                        <p className="text-xs text-[#64748B] mb-1">{m.label}</p>
                        <p className="text-base font-semibold text-[#F9FAFB]">{m.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#111827] border border-[#1F2933] rounded-2xl p-6">
                  <h2 className="text-base font-semibold text-[#F9FAFB] mb-3">Optimization Tips</h2>
                  <ul className="space-y-2.5">
                    {mockResults.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#CBD5E1]">
                        <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center text-[#22C55E] text-xs font-bold">{i + 1}</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => { setPredicted(false); setForm({ campaignName: '', platform: '', contentType: '', industry: '', budget: '', duration: '', targetAudience: '', description: '' }); }}
                  className="w-full py-2.5 rounded-xl text-sm font-medium border border-[#1F2933] text-[#94A3B8] hover:border-[#22C55E]/40 hover:text-[#F9FAFB] transition-all"
                >
                  Start New Prediction
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
