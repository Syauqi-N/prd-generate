"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Users, FileText, CreditCard,
  Activity, Layout, LogOut, ShieldCheck
} from "lucide-react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/invoices", label: "Invoices", icon: CreditCard },
  { href: "/admin/documents", label: "Documents", icon: FileText },
  { href: "/admin/usage", label: "Usage Logs", icon: Activity },
  { href: "/admin/templates", label: "Templates", icon: Layout },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, logout } = useAuth()

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) router.replace("/dashboard")
  }, [user, loading])

  if (loading || !user || user.role !== "ADMIN") return null

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
      <aside className="flex h-full w-60 flex-col border-r" style={{ backgroundColor: "var(--sidebar-bg)", borderColor: "var(--border-color)" }}>
        <div className="flex h-16 items-center gap-2 border-b px-5" style={{ borderColor: "var(--border-color)" }}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: "var(--accent)" }}>
            <ShieldCheck className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold" style={{ color: "var(--text-primary)" }}>Admin Panel</span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                style={active ? {
                  backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)",
                  color: "var(--accent)",
                  border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)"
                } : { color: "var(--text-muted)" }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--hover-bg)"; (e.currentTarget as HTMLElement).style.color = "var(--accent)" } }}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-muted)" } }}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="border-t p-4" style={{ borderColor: "var(--border-color)" }}>
          <div className="mb-2 px-1 text-xs" style={{ color: "var(--text-muted)" }}>{user.email}</div>
          <button onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--hover-bg)"; (e.currentTarget as HTMLElement).style.color = "var(--accent)" }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-muted)" }}
          >
            <LogOut className="h-4 w-4" /> Keluar
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto" style={{ backgroundColor: "var(--bg-primary)" }}>{children}</main>
    </div>
  )
}
