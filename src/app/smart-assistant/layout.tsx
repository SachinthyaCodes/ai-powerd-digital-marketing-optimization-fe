import Sidebar from '@/components/Sidebar';

export default function SmartAssistantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0B0F14]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-[#0B0F14]">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
