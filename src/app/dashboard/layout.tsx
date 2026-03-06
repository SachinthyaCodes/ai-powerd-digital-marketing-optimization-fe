import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0B0F14]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-[#0B0F14]">
        <div className="min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
