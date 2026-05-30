"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatCurrency } from "@/lib/utils"
import { Plus, FileText, Coins, CreditCard, Clock, ArrowRight, Loader2, FileX, Cpu } from "lucide-react"

type Document = {
  id: string; title: string; productName: string | null
  productType: string | null; status: string; createdAt: string; updatedAt: string
}
type Invoice = {
  id: string; orderId: string; amount: number
  status: string; createdAt: string; plan: { name: string }
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<Document[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/prd?limit=5").then(r => r.json()),
      fetch("/api/billing/invoices?limit=3").then(r => r.json()),
    ]).then(([p, b]) => {
      setDocuments(p.documents || [])
      setInvoices(b.invoices || [])
    }).finally(() => setLoading(false))
  }, [])

  const statusBadge = (s: string) => {
    const m: Record<string, any> = {
      DRAFT: "secondary", GENERATED: "success", ARCHIVED: "outline"
    }
    const labels: Record<string, string> = {
      DRAFT: "Draft", GENERATED: "Generated", ARCHIVED: "Archived"
    }
    return <Badge variant={m[s] || "secondary"}>{labels[s] || s}</Badge>
  }

  const invoiceBadge = (s: string) => {
    const m: Record<string, any> = {
      PENDING: "warning", PAID: "success", EXPIRED: "destructive",
      FAILED: "destructive", CANCELLED: "outline"
    }
    const labels: Record<string, string> = {
      PENDING: "Menunggu", PAID: "Lunas", EXPIRED: "Expired",
      FAILED: "Gagal", CANCELLED: "Dibatalkan"
    }
    return <Badge variant={m[s] || "secondary"}>{labels[s] || s}</Badge>
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Halo, {user?.name || "User"} 👋
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Selamat datang di dashboard PRD Generator</p>
        </div>
        <Link href="/dashboard/prd/new">
          <Button className="gap-2"><Plus className="h-4 w-4" /> Buat PRD Baru</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: Coins, label: "Sisa Credit", value: user?.credits ?? 0 },
          { icon: FileText, label: "Total Dokumen", value: documents.length },
          { icon: CreditCard, label: "Status Plan", value: (user?.credits ?? 0) > 0 ? "Aktif" : "Free" },
        ].map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)" }}>
                  <Icon className="h-6 w-6" style={{ color: "var(--accent)" }} />
                </div>
                <div>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>{s.label}</p>
                  <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{s.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick actions */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[
          { href: "/dashboard/prd/new", icon: FileText, title: "Buat PRD Baru", desc: "PRD lengkap dengan template & guided questions" },
          { href: "/dashboard/ai-prd", icon: Cpu, title: "PRD for AI Tools", desc: "Dioptimalkan untuk Cursor, v0, Claude Code, dll" },
        ].map((a) => {
          const Icon = a.icon
          return (
            <Link key={a.href} href={a.href}>
              <div className="flex items-center gap-4 rounded-xl border p-4 transition-all cursor-pointer"
                style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-light)"; (e.currentTarget as HTMLElement).style.backgroundColor = "var(--hover-bg)" }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)"; (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-card)" }}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)" }}>
                  <Icon className="h-5 w-5" style={{ color: "var(--accent)" }} />
                </div>
                <div>
                  <p className="font-medium" style={{ color: "var(--text-primary)" }}>{a.title}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{a.desc}</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4" style={{ color: "var(--text-muted)" }} />
              </div>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Documents */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Dokumen Terbaru</CardTitle>
              <Link href="/dashboard" className="flex items-center gap-1 text-sm hover:underline" style={{ color: "var(--accent-mid)" }}>
                Lihat semua <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" style={{ color: "var(--accent)" }} />
                </div>
              ) : documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileX className="h-12 w-12" style={{ color: "var(--border-color)" }} />
                  <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>Belum ada dokumen PRD</p>
                  <Link href="/dashboard/prd/new" className="mt-3"><Button size="sm">Buat PRD Pertama</Button></Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <Link key={doc.id} href={`/dashboard/prd/${doc.id}`}>
                      <div className="flex items-center justify-between rounded-lg border p-4 transition-colors cursor-pointer"
                        style={{ borderColor: "var(--border-color)" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "var(--hover-bg)"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"}>
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                            style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)" }}>
                            <FileText className="h-4 w-4" style={{ color: "var(--accent)" }} />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium" style={{ color: "var(--text-primary)" }}>{doc.title}</p>
                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{doc.productType || "—"} · {formatDate(doc.updatedAt)}</p>
                          </div>
                        </div>
                        {statusBadge(doc.status)}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {(user?.credits ?? 0) === 0 && (
            <Card style={{ borderColor: "color-mix(in srgb, var(--accent-mid) 40%, transparent)", backgroundColor: "color-mix(in srgb, var(--accent-mid) 8%, var(--bg-card))" }}>
              <CardContent className="p-4">
                <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>Credit kamu habis!</p>
                <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>Beli credit untuk melanjutkan generate PRD.</p>
                <Link href="/dashboard/billing" className="mt-3 block">
                  <Button size="sm" className="w-full inline-flex items-center justify-center gap-2">Beli Credit</Button>
                </Link>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader><CardTitle className="text-base">Invoice Terbaru</CardTitle></CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin" style={{ color: "var(--accent)" }} />
                </div>
              ) : invoices.length === 0 ? (
                <div className="py-6 text-center">
                  <Clock className="mx-auto h-8 w-8" style={{ color: "var(--border-color)" }} />
                  <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>Belum ada transaksi</p>
                  <Link href="/dashboard/billing" className="mt-2 block">
                    <Button size="sm" variant="outline" className="w-full">Beli Credit</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {invoices.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{inv.plan.name}</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{formatCurrency(inv.amount)}</p>
                      </div>
                      {invoiceBadge(inv.status)}
                    </div>
                  ))}
                  <Link href="/dashboard/billing" className="block pt-2">
                    <Button size="sm" variant="outline" className="w-full">Lihat Semua</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
