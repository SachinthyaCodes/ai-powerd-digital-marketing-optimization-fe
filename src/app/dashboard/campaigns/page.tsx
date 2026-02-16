'use client';

export default function CampaignsPage() {
  return (
    <div className="min-h-screen bg-[#0B0F14] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F9FAFB] mb-2">Campaign Performance Predictor</h1>
          <p className="text-[#CBD5E1] text-sm sm:text-base">Predict and optimize your marketing campaign outcomes</p>
        </div>

        <div className="bg-[#0B0F14] border border-[#1F2933] rounded-xl shadow-sm p-6 sm:p-8">
          <div className="text-center py-8 sm:py-12">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#22C55E]/10 mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-medium text-[#F9FAFB] mb-2">Campaign Predictor</h3>
            <p className="text-[#CBD5E1] text-sm">AI-powered campaign performance prediction - Coming Soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
