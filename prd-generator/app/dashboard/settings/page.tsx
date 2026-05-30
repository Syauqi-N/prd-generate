"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, User, Lock } from "lucide-react"

export default function SettingsPage() {
  const { user, refresh } = useAuth()
  const { toast } = useToast()
  const [nameLoading, setNameLoading] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)
  const [name, setName] = useState(user?.name || "")
  const [pw, setPw] = useState({ current: "", newPw: "", confirm: "" })

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault()
    setNameLoading(true)
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) throw new Error("Gagal memperbarui nama")
      await refresh()
      toast({ title: "Nama berhasil diperbarui", variant: "success" })
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" })
    } finally {
      setNameLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pw.newPw !== pw.confirm) {
      toast({ title: "Password tidak cocok", variant: "destructive" })
      return
    }
    if (pw.newPw.length < 8) {
      toast({ title: "Password minimal 8 karakter", variant: "destructive" })
      return
    }
    setPwLoading(true)
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pw.current, newPassword: pw.newPw }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPw({ current: "", newPw: "", confirm: "" })
      toast({ title: "Password berhasil diperbarui", variant: "success" })
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" })
    } finally {
      setPwLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Pengaturan</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Kelola informasi akun kamu</p>
      </div>

      <div className="max-w-xl space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)" }}>
                <User className="h-5 w-5" style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <CardTitle className="text-base">Profil</CardTitle>
                <CardDescription>Perbarui nama tampilan kamu</CardDescription>
              </div>
            </div>
          </CardHeader>
          <form onSubmit={handleUpdateName}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email || ""} disabled
                  style={{ backgroundColor: "var(--hover-bg)", opacity: 0.7 }} />
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Email tidak bisa diubah</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nama</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama kamu" />
              </div>
              <Button type="submit" disabled={nameLoading} size="sm">
                {nameLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Perubahan
              </Button>
            </CardContent>
          </form>
        </Card>

        {/* Password */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)" }}>
                <Lock className="h-5 w-5" style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <CardTitle className="text-base">Ubah Password</CardTitle>
                <CardDescription>Pastikan password kamu kuat dan aman</CardDescription>
              </div>
            </div>
          </CardHeader>
          <form onSubmit={handleUpdatePassword}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current">Password Saat Ini</Label>
                <Input id="current" type="password" value={pw.current}
                  onChange={(e) => setPw({ ...pw, current: e.target.value })} placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPw">Password Baru</Label>
                <Input id="newPw" type="password" value={pw.newPw}
                  onChange={(e) => setPw({ ...pw, newPw: e.target.value })} placeholder="Minimal 8 karakter" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Konfirmasi Password Baru</Label>
                <Input id="confirm" type="password" value={pw.confirm}
                  onChange={(e) => setPw({ ...pw, confirm: e.target.value })} placeholder="Ulangi password baru" />
              </div>
              <Button type="submit" disabled={pwLoading} size="sm">
                {pwLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Ubah Password
              </Button>
            </CardContent>
          </form>
        </Card>

        {/* Account info */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span style={{ color: "var(--text-muted)" }}>Role</span>
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>{user?.role}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: "var(--text-muted)" }}>Credit</span>
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>{user?.credits}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: "var(--text-muted)" }}>Email</span>
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>{user?.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
