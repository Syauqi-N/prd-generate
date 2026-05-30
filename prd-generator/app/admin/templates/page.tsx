"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatDateTime } from "@/lib/utils"
import { Loader2, Edit, ToggleLeft, ToggleRight } from "lucide-react"

type Template = {
  id: string
  name: string
  slug: string
  description: string | null
  isPremium: boolean
  isActive: boolean
  createdAt: string
}

export default function AdminTemplatesPage() {
  const { toast } = useToast()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [editDialog, setEditDialog] = useState<Template | null>(null)
  const [editLoading, setEditLoading] = useState(false)
  const [editForm, setEditForm] = useState({ name: "", description: "", isPremium: false, isActive: true })

  const fetchTemplates = () => {
    setLoading(true)
    fetch("/api/admin/templates")
      .then((r) => r.json())
      .then((d) => setTemplates(d.templates || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchTemplates() }, [])

  const openEdit = (t: Template) => {
    setEditDialog(t)
    setEditForm({ name: t.name, description: t.description || "", isPremium: t.isPremium, isActive: t.isActive })
  }

  const handleToggleActive = async (t: Template) => {
    const res = await fetch(`/api/admin/templates/${t.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !t.isActive }),
    })
    if (res.ok) {
      toast({ title: `Template ${!t.isActive ? "diaktifkan" : "dinonaktifkan"}`, variant: "success" })
      fetchTemplates()
    }
  }

  const handleSaveEdit = async () => {
    if (!editDialog) return
    setEditLoading(true)
    try {
      const res = await fetch(`/api/admin/templates/${editDialog.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })
      if (!res.ok) throw new Error("Gagal menyimpan")
      toast({ title: "Template berhasil diperbarui", variant: "success" })
      setEditDialog(null)
      fetchTemplates()
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" })
    } finally {
      setEditLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
        <p className="mt-1 text-gray-500">{templates.length} template tersedia</p>
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
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Nama</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Slug</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Tipe</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Dibuat</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {templates.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{t.name}</p>
                      {t.description && <p className="text-xs text-gray-500">{t.description}</p>}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{t.slug}</td>
                    <td className="px-4 py-3">
                      <Badge variant={t.isPremium ? "warning" : "success"}>
                        {t.isPremium ? "Premium" : "Gratis"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={t.isActive ? "success" : "secondary"}>
                        {t.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDateTime(t.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => openEdit(t)}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => handleToggleActive(t)}>
                          {t.isActive
                            ? <ToggleRight className="h-3.5 w-3.5 text-green-600" />
                            : <ToggleLeft className="h-3.5 w-3.5 text-gray-400" />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Edit dialog */}
      <Dialog open={!!editDialog} onOpenChange={() => setEditDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Template — {editDialog?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nama</Label>
              <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Input value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editForm.isPremium}
                  onChange={(e) => setEditForm({ ...editForm, isPremium: e.target.checked })} />
                Premium
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editForm.isActive}
                  onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })} />
                Aktif
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(null)}>Batal</Button>
            <Button onClick={handleSaveEdit} disabled={editLoading}>
              {editLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
