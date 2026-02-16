'use client';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#0B0F14] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F9FAFB] mb-2">Profile</h1>
          <p className="text-[#CBD5E1] text-sm sm:text-base">Manage your account information</p>
        </div>

        <div className="bg-[#0B0F14] border border-[#1F2933] rounded-xl p-6 sm:p-8">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 gap-4 sm:gap-0">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-[#22C55E]/10 flex items-center justify-center">
                <svg className="h-10 w-10 sm:h-12 sm:w-12 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-semibold text-[#F9FAFB]">User Name</h3>
                <p className="text-[#CBD5E1] text-sm sm:text-base">user@example.com</p>
              </div>
            </div>

            <div className="border-t border-[#1F2933] pt-6">
              <h3 className="text-base sm:text-lg font-medium text-[#F9FAFB] mb-4">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#CBD5E1] mb-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-[#1F2933] bg-[#1F2933] text-[#F9FAFB] rounded-lg focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#CBD5E1] mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-[#1F2933] bg-[#1F2933] text-[#F9FAFB] rounded-lg focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#CBD5E1] mb-1">Company</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-[#1F2933] bg-[#1F2933] text-[#F9FAFB] rounded-lg focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all"
                    placeholder="Your company name"
                  />
                </div>
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
