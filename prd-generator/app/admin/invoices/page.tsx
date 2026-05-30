"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDateTime } from "@/lib/utils"
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"

type Invoice = {
  id: string
  orderId: string
  amount: number
  status: string
  createdAt: string
  user: { name: string | null; email: string }
  plan: { name: string; creditAmount: number }
}

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/invoices?page=${page}&limit=20`)
      .then((r) => r.json())
      .then((d) => { setInvoices(d.invoices || []); setTotal(d.total || 0) })
      .finally(() => setLoading(false))
  }, [page])

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

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
        <p className="mt-1 text-gray-500">{total} total invoice</p>
      </div>

      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Order ID</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">User</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Paket</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Jumlah</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{inv.orderId}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{inv.user.name || "—"}</p>
                      <p className="text-xs text-gray-500">{inv.user.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{inv.plan.name}</p>
                      <p className="text-xs text-gray-500">{inv.plan.creditAmount} credits</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{formatCurrency(inv.amount)}</td>
                    <td className="px-4 py-3">{statusBadge(inv.status)}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDateTime(inv.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
            <p className="text-sm text-gray-500">Halaman {page} dari {totalPages}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
