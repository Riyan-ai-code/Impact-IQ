import Sidebar from "@/components/dashboard/Sidebar"
import Header from "@/components/dashboard/Header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-page)] text-[var(--text-primary)] font-sans transition-colors duration-150">
      {/* Persistent left sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Persistent top header */}
        <Header />

        {/* Dynamic content canvas */}
        <main className="flex-1 overflow-y-auto bg-[var(--bg-page)] p-6 md:p-8 transition-colors duration-150">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
