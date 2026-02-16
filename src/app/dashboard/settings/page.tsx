'use client';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#0B0F14] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F9FAFB] mb-2">Settings</h1>
          <p className="text-[#CBD5E1] text-sm sm:text-base">Manage your account and application preferences</p>
        </div>

        <div className="bg-[#0B0F14] border border-[#1F2933] rounded-xl p-6 sm:p-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-medium text-[#F9FAFB] mb-4">Application Settings</h3>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-[#1F2933] gap-3 sm:gap-0">
                  <div>
                    <p className="font-medium text-[#F9FAFB] text-sm sm:text-base">Notifications</p>
                    <p className="text-xs sm:text-sm text-[#CBD5E1]">Receive updates about your strategies</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#1F2933] self-start sm:self-auto">
                    <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-[#1F2933] gap-3 sm:gap-0">
                  <div>
                    <p className="font-medium text-[#F9FAFB] text-sm sm:text-base">Email Reports</p>
                    <p className="text-xs sm:text-sm text-[#CBD5E1]">Weekly strategy performance reports</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#1F2933] self-start sm:self-auto">
                    <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
