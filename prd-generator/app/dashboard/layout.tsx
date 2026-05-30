import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto" style={{ backgroundColor: "var(--bg-primary)" }}>
        {children}
      </main>
    </div>
  )
}
