import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#070B12]">
      <Sidebar />
      <main className="flex-1 overflow-hidden bg-[#070B12]">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
