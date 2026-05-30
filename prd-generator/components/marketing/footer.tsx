"use client"

import Link from "next/link"
import { ThemeLogo } from "@/components/theme-logo"

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t"
      style={{ borderColor: "var(--glass-border)", backgroundColor: "var(--bg-secondary)" }}>
      {/* subtle blob */}
      <div className="blob blob-2 opacity-30" style={{ width: 400, height: 400, bottom: -200, right: -100 }} />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <ThemeLogo height={28} width={28} />
              <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                PRD Generator
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Ubah ide produkmu menjadi dokumen PRD yang lengkap dan profesional dalam hitungan menit menggunakan AI.
            </p>
            {/* status indicator */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs glass"
              style={{ color: "var(--text-muted)" }}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                  style={{ backgroundColor: "#10b981" }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: "#10b981" }} />
              </span>
              All systems operational
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Produk</h3>
            <ul className="space-y-3">
              {[["Harga", "/pricing"], ["Cara Kerja", "/#cara-kerja"], ["Contoh Output", "/#contoh"]].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm transition-colors"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--accent)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Akun</h3>
            <ul className="space-y-3">
              {[["Daftar", "/register"], ["Masuk", "/login"], ["Dashboard", "/dashboard"]].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm transition-colors"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--accent)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: "var(--glass-border)" }}>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} PRD Generator. All rights reserved.
          </p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Made with ✨ AI
          </p>
        </div>
      </div>
    </footer>
  )
}
