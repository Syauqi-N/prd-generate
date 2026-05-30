"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeLogo } from "@/components/theme-logo"
import {
  LayoutDashboard, FileText, CreditCard,
  Settings, LogOut, Coins, ChevronRight, Cpu,
} from "lucide-react"

const navItems = [
  { href: "/dashboard",          label: "Dashboard",       icon: LayoutDashboard },
  { href: "/dashboard/prd/new",  label: "Buat PRD Baru",   icon: FileText },
  { href: "/dashboard/ai-prd",   label: "PRD for AI Tools", icon: Cpu },
  { href: "/dashboard/billing",  label: "Billing & Credit", icon: CreditCard },
  { href: "/dashboard/settings", label: "Pengaturan",       icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <aside className="flex h-full w-64 flex-col border-r"
      style={{
        backgroundColor: "var(--sidebar-bg)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor: "var(--glass-border)",
      }}>

      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6"
        style={{ borderColor: "var(--glass-border)" }}>
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <ThemeLogo height={26} width={26} />
          <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
            PRD Generator
          </span>
        </Link>
      </div>

      {/* Credit badge */}
      <div className="mx-4 mt-4 flex items-center gap-2.5 rounded-xl px-3 py-2.5 glass">
        <Coins className="h-4 w-4 shrink-0" style={{ color: "var(--accent)" }} />
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>
          <span className="font-semibold gradient-text">{user?.credits ?? 0}</span>{" "}credit tersisa
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all"
              style={active ? {
                background: "var(--gradient-subtle)",
                color: "var(--accent)",
                border: "1px solid var(--glass-border)",
                backdropFilter: "blur(8px)",
              } : {
                color: "var(--text-muted)",
                border: "1px solid transparent",
              }}
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "var(--hover-bg)"
                  ;(e.currentTarget as HTMLElement).style.color = "var(--accent)"
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"
                  ;(e.currentTarget as HTMLElement).style.color = "var(--text-muted)"
                }
              }}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="h-3.5 w-3.5" />}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="border-t p-4" style={{ borderColor: "var(--glass-border)" }}>
        <div className="mb-3 flex items-center gap-3 px-1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-semibold"
            style={{
              background: "var(--gradient-primary)",
              color: "#fff",
            }}>
            {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {user?.name || "User"}
            </p>
            <p className="truncate text-xs" style={{ color: "var(--text-muted)" }}>
              {user?.email}
            </p>
          </div>
        </div>
        <button onClick={logout}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all"
          style={{ color: "var(--text-muted)", backgroundColor: "transparent" }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "var(--hover-bg)"
            ;(e.currentTarget as HTMLElement).style.color = "var(--accent)"
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"
            ;(e.currentTarget as HTMLElement).style.color = "var(--text-muted)"
          }}
        >
          <LogOut className="h-4 w-4" /> Keluar
        </button>
        <div className="mt-3 flex items-center justify-between px-1">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Tampilan</span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  )
}
