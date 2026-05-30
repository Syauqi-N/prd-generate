"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDateTime } from "@/lib/utils"
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"

type UsageLog = {
  id: string
  action: string
  creditUsed: number
  aiProvider: string | null
  aiModel: string | null
  createdAt: string
  user: { name: string | null; email: string }
  document: { id: string; title: string } | null
}

export default function AdminUsagePage() {
  const [logs, setLogs] = useState<UsageLog[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/usage?page=${page}&limit=20`)
      .then((r) => r.json())
      .then((d) => { setLogs(d.logs || []); setTotal(d.total || 0) })
      .finally(() => setLoading(false))
  }, [page])

  const actionBadge = (action: string) => {
    const map: Record<string, { variant: any }> = {
      GENERATE_PRD: { variant: "default" },
      REGENERATE_PRD: { variant: "default" },
      REGENERATE_SECTION: { variant: "secondary" },
      IMPROVE_SECTION: { variant: "secondary" },
      EXPORT_PDF: { variant: "warning" },
      EXPORT_MARKDOWN: { variant: "outline" },
      PAYMENT_SUCCESS: { variant: "success" },
      CREDIT_ADDED: { variant: "success" },
      CREDIT_REDUCED: { variant: "destructive" },
    }
    const s = map[action] || { variant: "secondary" }
    return <Badge variant={s.variant}>{action.replace(/_/g, " ")}</Badge>
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Usage Logs</h1>
        <p className="mt-1 text-gray-500">{total} total log</p>
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
                  <th className="px-4 py-3 text-left font-medium text-gray-500">User</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Aksi</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Credit</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">AI Provider</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Dokumen</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{log.user.name || "—"}</p>
                      <p className="text-xs text-gray-500">{log.user.email}</p>
                    </td>
                    <td className="px-4 py-3">{actionBadge(log.action)}</td>
                    <td className="px-4 py-3">
                      {log.creditUsed > 0 ? (
                        <span className="font-medium text-red-600">-{log.creditUsed}</span>
                      ) : log.creditUsed < 0 ? (
                        <span className="font-medium text-green-600">+{Math.abs(log.creditUsed)}</span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{log.aiProvider || "—"}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-[160px] truncate">
                      {log.document?.title || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDateTime(log.createdAt)}</td>
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
