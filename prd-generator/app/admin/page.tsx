"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Users, FileText, CreditCard, Activity, TrendingUp, Loader2 } from "lucide-react"

type Stats = {
  totalUsers: number
  totalDocuments: number
  totalInvoices: number
  paidInvoices: number
  totalUsageLogs: number
  totalRevenue: number
  recentUsers: { id: string; name: string | null; email: string; credits: number; role: string; createdAt: string }[]
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => setStats(d))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-gray-500">Overview sistem PRD Generator</p>
      </div>

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {[
          { label: "Total Users", value: stats?.totalUsers, icon: Users, color: "bg-blue-100 text-blue-600" },
          { label: "Total Dokumen", value: stats?.totalDocuments, icon: FileText, color: "bg-green-100 text-green-600" },
          { label: "Total Invoice", value: stats?.totalInvoices, icon: CreditCard, color: "bg-purple-100 text-purple-600" },
          { label: "Invoice Lunas", value: stats?.paidInvoices, icon: TrendingUp, color: "bg-indigo-100 text-indigo-600" },
          { label: "Usage Logs", value: stats?.totalUsageLogs, icon: Activity, color: "bg-orange-100 text-orange-600" },
        ].map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label}>
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{s.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{s.value ?? 0}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats?.totalRevenue ?? 0)}</p>
            <p className="mt-1 text-sm text-gray-500">Dari {stats?.paidInvoices} transaksi lunas</p>
          </CardContent>
        </Card>

        {/* Recent users */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">User Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.recentUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                      {u.name?.[0]?.toUpperCase() || u.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{u.name || u.email}</p>
                      <p className="text-xs text-gray-500">{formatDate(u.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{u.credits} cr</span>
                    <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>{u.role}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
