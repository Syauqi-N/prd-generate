"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDateTime } from "@/lib/utils"
import { Coins, CreditCard, CheckCircle, Loader2 } from "lucide-react"

type Plan = {
  id: string; name: string; description: string | null
  price: number; creditAmount: number; features: string[]
}
type Invoice = {
  id: string; orderId: string; amount: number
  status: string; createdAt: string; plan: { name: string; creditAmount: number }
}

function BillingContent() {
  const { user, refresh } = useAuth()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [plans, setPlans] = useState<Plan[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch("/api/billing/summary").then(r => r.json()),
      fetch("/api/billing/invoices").then(r => r.json()),
    ]).then(([summary, inv]) => {
      setPlans(summary.plans || [])
      setInvoices(inv.invoices || [])
    }).finally(() => setLoading(false))

    const order = searchParams.get("order")
    if (order) {
      fetch(`/api/billing/invoices/${order}`).then(r => r.json()).then(d => {
        if (d.invoice?.status === "PAID") {
          toast({ title: "Pembayaran berhasil!", description: "Credit kamu sudah bertambah.", variant: "success" })
          refresh()
        } else if (d.invoice?.status === "PENDING") {
          toast({ title: "Pembayaran sedang diproses", description: "Silakan selesaikan pembayaran atau cek kembali beberapa saat lagi." })
        }
      })
    }
  }, [])

  const handleCheckout = async (planId: string) => {
    setCheckingOut(planId)
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      window.location.href = data.paymentUrl
    } catch (e: any) {
      toast({ title: "Gagal membuat invoice", description: e.message, variant: "destructive" })
    } finally {
      setCheckingOut(null)
    }
  }

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; variant: any }> = {
      PENDING: { label: "Menunggu", variant: "warning" },
      PAID: { label: "Lunas", variant: "success" },
      EXPIRED: { label: "Expired", variant: "destructive" },
      FAILED: { label: "Gagal", variant: "destructive" },
      CANCELLED: { label: "Dibatalkan", variant: "outline" },
    }
    const s = map[status] || { label: status, variant: "secondary" }
    return <Badge variant={s.variant}>{s.label}</Badge>
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Billing & Credit</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Kelola credit dan riwayat pembayaran kamu</p>
      </div>

      {/* Credit summary */}
      <Card className="mb-8">
        <CardContent className="flex items-center gap-6 p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)" }}>
            <Coins className="h-8 w-8" style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Sisa Credit</p>
            <p className="text-4xl font-bold" style={{ color: "var(--text-primary)" }}>{user?.credits ?? 0}</p>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>1 credit = 1 generate PRD</p>
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="mb-10">
        <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Beli Credit</h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin" style={{ color: "var(--accent)" }} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
            {plans.filter(p => p.price > 0).map(plan => (
              <Card key={plan.id} className="flex flex-col"
                style={plan.name === "Pro" ? {
                  borderColor: "var(--accent-mid)",
                  boxShadow: "0 0 0 2px color-mix(in srgb, var(--accent-mid) 25%, transparent)"
                } : {}}>
                <CardHeader className="pb-3">
                  {plan.name === "Pro" && <Badge variant="success" className="mb-2 w-fit">Populer</Badge>}
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-2">
                    <span className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{formatCurrency(plan.price)}</span>
                    <span className="ml-1 text-sm" style={{ color: "var(--text-muted)" }}>/ {plan.creditAmount} credits</span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <ul className="mb-4 flex-1 space-y-1.5">
                    {(plan.features as string[]).map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                        <CheckCircle className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--accent-mid)" }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-auto w-full inline-flex items-center justify-center gap-2" onClick={() => handleCheckout(plan.id)} disabled={checkingOut === plan.id}>
                    {checkingOut === plan.id
                      ? <><Loader2 className="h-4 w-4 animate-spin" /><span>Memproses...</span></>
                      : <><CreditCard className="h-4 w-4" /><span>Beli Sekarang</span></>}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Invoice history */}
      <div>
        <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Riwayat Transaksi</h2>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" style={{ color: "var(--accent)" }} />
          </div>
        ) : invoices.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <CreditCard className="h-12 w-12" style={{ color: "var(--border-color)" }} />
              <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>Belum ada transaksi</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--hover-bg)" }}>
                    {["Order ID", "Paket", "Jumlah", "Status", "Tanggal"].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-medium" style={{ color: "var(--text-muted)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv.id} className="border-b" style={{ borderColor: "var(--border-color)" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "var(--hover-bg)"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"}>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-muted)" }}>{inv.orderId}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: "var(--text-primary)" }}>{inv.plan.name}</td>
                      <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{formatCurrency(inv.amount)}</td>
                      <td className="px-4 py-3">{statusBadge(inv.status)}</td>
                      <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>{formatDateTime(inv.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function BillingPage() {
  return (
    <Suspense fallback={
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--accent)" }} />
      </div>
    }>
      <BillingContent />
    </Suspense>
  )
}
