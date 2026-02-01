


import { Sidebar } from "@/components/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-[#020617] text-slate-50 font-sans selection:bg-blue-500/30">
      <Sidebar />
      <main className="flex-1 overflow-auto relative">
        {/* Background Gradients */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  )
}
