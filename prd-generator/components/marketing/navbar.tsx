"use client"

import Link from "next/link"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeLogo } from "@/components/theme-logo"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

export function Navbar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className="sticky top-0 z-40 transition-all duration-300"
      style={{
        background: scrolled ? "var(--glass-bg)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid var(--glass-border)" : "1px solid transparent",
        boxShadow: scrolled ? "var(--glass-shadow)" : "none",
      }}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <ThemeLogo height={28} width={28} />
          <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
            PRD Generator
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {[["Harga", "/pricing"], ["Cara Kerja", "/#cara-kerja"], ["FAQ", "/#faq"]].map(([label, href]) => (
            <Link key={href} href={href}
              className="text-sm font-medium transition-colors relative group"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--accent)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}>
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {user ? (
            <>
              <Link href="/dashboard"><Button variant="outline" size="sm">Dashboard</Button></Link>
              <Button variant="ghost" size="sm" onClick={logout}>Keluar</Button>
            </>
          ) : (
            <>
              <Link href="/login"><Button variant="ghost" size="sm">Masuk</Button></Link>
              <Link href="/register"><Button size="sm">Coba Gratis</Button></Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="glass flex h-9 w-9 items-center justify-center rounded-xl md:hidden"
          onClick={() => setOpen(!open)}
          style={{ color: "var(--text-primary)" }}>
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="glass border-t px-4 py-4 md:hidden animate-fade-in"
          style={{ borderColor: "var(--glass-border)" }}>
          <nav className="flex flex-col gap-3">
            {[["Harga", "/pricing"], ["Cara Kerja", "/#cara-kerja"], ["FAQ", "/#faq"]].map(([label, href]) => (
              <Link key={href} href={href} className="text-sm font-medium py-1"
                style={{ color: "var(--text-muted)" }}
                onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
            <div className="flex items-center justify-between border-t pt-3"
              style={{ borderColor: "var(--glass-border)" }}>
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>Tampilan</span>
              <ThemeToggle />
            </div>
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  <Button className="w-full" size="sm">Dashboard</Button>
                </Link>
                <Button variant="outline" size="sm" onClick={logout} className="w-full">Keluar</Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full" size="sm">Masuk</Button>
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}>
                  <Button className="w-full" size="sm">Coba Gratis</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
