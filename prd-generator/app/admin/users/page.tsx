"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { formatDate, formatCurrency } from "@/lib/utils"
import { Search, Loader2, Plus, Minus, ChevronLeft, ChevronRight } from "lucide-react"

type User = {
  id: string
  name: string | null
  email: string
  role: string
  credits: number
  createdAt: string
  _count: { documents: number; invoices: number }
}

export default function AdminUsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [creditDialog, setCreditDialog] = useState<{ type: "add" | "reduce"; user: User } | null>(null)
  const [creditAmount, setCreditAmount] = useState("")
  const [creditReason, setCreditReason] = useState("")
  const [creditLoading, setCreditLoading] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: "20", search })
    const res = await fetch(`/api/admin/users?${params}`)
    const data = await res.json()
    setUsers(data.users || [])
    setTotal(data.total || 0)
    setLoading(false)
  }

  useEffect(() => { fetchUsers() }, [page, search])

  const handleCreditAction = async () => {
    if (!creditDialog || !creditAmount) return
    setCreditLoading(true)
    try {
      const endpoint = creditDialog.type === "add"
        ? `/api/admin/users/${creditDialog.user.id}/add-credit`
        : `/api/admin/users/${creditDialog.user.id}/reduce-credit`
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseInt(creditAmount), reason: creditReason }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast({ title: data.message, variant: "success" })
      setCreditDialog(null)
      setCreditAmount("")
      setCreditReason("")
      fetchUsers()
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" })
    } finally {
      setCreditLoading(false)
    }
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-gray-500">{total} total user</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Cari email atau nama..." className="pl-9"
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
        </div>
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
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Role</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Credits</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Dokumen</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Invoice</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Bergabung</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                          {u.name?.[0]?.toUpperCase() || u.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{u.name || "—"}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>{u.role}</Badge>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{u.credits}</td>
                    <td className="px-4 py-3 text-gray-600">{u._count.documents}</td>
                    <td className="px-4 py-3 text-gray-600">{u._count.invoices}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="outline" className="h-7 gap-1 px-2 text-xs"
                          onClick={() => setCreditDialog({ type: "add", user: u })}>
                          <Plus className="h-3 w-3" /> Credit
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 gap-1 px-2 text-xs text-red-600 hover:text-red-700"
                          onClick={() => setCreditDialog({ type: "reduce", user: u })}>
                          <Minus className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
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

      {/* Credit dialog */}
      <Dialog open={!!creditDialog} onOpenChange={() => setCreditDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {creditDialog?.type === "add" ? "Tambah Credit" : "Kurangi Credit"} — {creditDialog?.user.name || creditDialog?.user.email}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Jumlah Credit</Label>
              <Input type="number" min="1" placeholder="Contoh: 10"
                value={creditAmount} onChange={(e) => setCreditAmount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Alasan (opsional)</Label>
              <Input placeholder="Contoh: Bonus, Kompensasi, dll"
                value={creditReason} onChange={(e) => setCreditReason(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreditDialog(null)}>Batal</Button>
            <Button onClick={handleCreditAction} disabled={creditLoading || !creditAmount}
              variant={creditDialog?.type === "reduce" ? "destructive" : "default"}>
              {creditLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {creditDialog?.type === "add" ? "Tambah" : "Kurangi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
