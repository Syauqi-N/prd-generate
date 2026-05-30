"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Loader2, CheckCircle } from "lucide-react"
import { ThemeLogo } from "@/components/theme-logo"

export default function RegisterPage() {
  const router = useRouter()
  const { refresh } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", password: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password.length < 8) {
      toast({ title: "Password terlalu pendek", description: "Password minimal 8 karakter", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: "Gagal daftar", description: data.error, variant: "destructive" })
        return
      }
      await refresh()
      toast({ title: "Berhasil daftar!", description: "Selamat datang! Kamu mendapat 1 free credit.", variant: "success" })
      router.push("/dashboard")
    } catch {
      toast({ title: "Error", description: "Terjadi kesalahan. Silakan coba lagi.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <ThemeLogo height={36} width={36} />
            <span className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>PRD Generator</span>
          </Link>
        </div>

        <div className="mb-4 flex items-center gap-2 rounded-lg border px-4 py-3"
          style={{ backgroundColor: "color-mix(in srgb, var(--accent) 8%, var(--bg-primary))", borderColor: "color-mix(in srgb, var(--accent) 25%, transparent)" }}>
          <CheckCircle className="h-4 w-4 shrink-0" style={{ color: "var(--accent)" }} />
          <p className="text-sm" style={{ color: "var(--accent)" }}>Daftar sekarang dan dapatkan <strong>1 free credit</strong> untuk mencoba!</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Buat Akun Baru</CardTitle>
            <CardDescription>Isi data di bawah untuk mulai menggunakan PRD Generator</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama</Label>
                <Input id="name" type="text" placeholder="Nama kamu"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  autoComplete="name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="kamu@email.com"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required autoComplete="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Minimal 8 karakter"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required autoComplete="new-password" />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Daftar Gratis
              </Button>
              <p className="text-center text-sm" style={{ color: "var(--text-muted)" }}>
                Sudah punya akun?{" "}
                <Link href="/login" className="hover:underline" style={{ color: "var(--accent-mid)" }}>Masuk</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
