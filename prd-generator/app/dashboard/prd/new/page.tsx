"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Loader2, ChevronRight, ChevronLeft, Zap, CheckCircle, Lock } from "lucide-react"

const PRODUCT_TYPES = ["SaaS", "Marketplace", "Mobile App", "Web App", "Internal Tool", "E-commerce", "Other"]
const OUTPUT_STYLES = ["Simple", "Technical", "Startup MVP", "Academic", "Product Manager Style"]
const TARGET_USAGES = ["Startup", "College Project", "Client Project", "Internal Team", "Personal Idea"]

const GUIDED_QUESTIONS = [
  "Siapa target user utama produk ini?",
  "Masalah utama apa yang ingin diselesaikan?",
  "Solusi utama yang ditawarkan produk ini apa?",
  "Fitur utama apa saja yang harus ada?",
  "Platform produk ini apa?",
  "Apa saja fitur yang masuk MVP?",
  "Apa saja fitur yang belum masuk MVP?",
  "Bagaimana indikator keberhasilan produk?",
  "Apakah ada kompetitor atau referensi produk sejenis?",
  "Apakah ada batasan teknis atau bisnis?",
]

type Template = {
  id: string
  name: string
  slug: string
  description: string | null
  isPremium: boolean
}

type Step = "idea" | "template" | "questions" | "generate"

export default function NewPRDPage() {
  const router = useRouter()
  const { user, refresh } = useAuth()
  const { toast } = useToast()

  const [step, setStep] = useState<Step>("idea")
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)

  const [form, setForm] = useState({
    title: "",
    productName: "",
    idea: "",
    productType: "",
    outputStyle: "",
    targetUsage: "",
  })
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [documentId, setDocumentId] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/templates")
      .then((r) => r.json())
      .then((d) => setTemplates(d.templates || []))
  }, [])

  const steps: { key: Step; label: string }[] = [
    { key: "idea", label: "Ide Produk" },
    { key: "template", label: "Template" },
    { key: "questions", label: "Pertanyaan" },
    { key: "generate", label: "Generate" },
  ]

  const stepIndex = steps.findIndex((s) => s.key === step)

  const handleIdeaNext = async () => {
    if (!form.title || !form.idea) {
      toast({ title: "Lengkapi form", description: "Judul dan deskripsi ide wajib diisi", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/prd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          productName: form.productName || form.title,
          productType: form.productType,
          outputStyle: form.outputStyle,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDocumentId(data.document.id)
      setStep("template")
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!documentId) return
    if ((user?.credits ?? 0) < 1) {
      toast({ title: "Credit habis", description: "Silakan beli credit untuk melanjutkan.", variant: "destructive" })
      return
    }
    setGenerating(true)
    try {
      const res = await fetch(`/api/prd/${documentId}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: form.idea,
          productType: form.productType,
          outputStyle: form.outputStyle,
          targetUsage: form.targetUsage,
          templateName: selectedTemplate?.name || "Startup MVP PRD",
          answers,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await refresh()
      toast({ title: "PRD berhasil dibuat!", description: "Kamu akan diarahkan ke editor.", variant: "success" })
      router.push(`/dashboard/prd/${documentId}`)
    } catch (e: any) {
      toast({ title: "Gagal generate PRD", description: e.message, variant: "destructive" })
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Buat PRD Baru</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Ikuti langkah-langkah berikut untuk membuat PRD dengan AI</p>
      </div>

      {/* Stepper */}
      <div className="mb-8 flex items-center">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center">
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-colors",
                i < stepIndex ? "bg-indigo-600 text-white" :
                i === stepIndex ? "bg-indigo-600 text-white outline outline-2 outline-offset-2 outline-indigo-300" :
                "bg-gray-100 text-gray-400"
              )}>
                {i < stepIndex ? <CheckCircle className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn(
                "text-sm hidden sm:block whitespace-nowrap",
                i === stepIndex ? "font-medium" : ""
              )} style={{ color: i === stepIndex ? "var(--text-primary)" : "var(--text-secondary)" }}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <ChevronRight className="h-4 w-4 mx-2 shrink-0" style={{ color: "var(--text-muted)" }} />
            )}
          </div>
        ))}
      </div>

      {/* Step: Idea */}
      {step === "idea" && (
        <Card>
          <CardHeader>
            <CardTitle>Ceritakan Ide Produkmu</CardTitle>
            <CardDescription>Isi informasi dasar tentang produk yang ingin kamu buat PRD-nya</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Dokumen *</Label>
              <Input id="title" placeholder="Contoh: PRD Aplikasi Manajemen Tugas" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productName">Nama Produk</Label>
              <Input id="productName" placeholder="Contoh: TaskFlow" value={form.productName}
                onChange={(e) => setForm({ ...form, productName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idea">Deskripsi Ide Produk *</Label>
              <Textarea id="idea" placeholder="Ceritakan ide produkmu secara singkat. Apa yang ingin kamu bangun? Masalah apa yang ingin diselesaikan?"
                className="min-h-[120px]" value={form.idea}
                onChange={(e) => setForm({ ...form, idea: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Tipe Produk</Label>
                <Select value={form.productType} onValueChange={(v) => setForm({ ...form, productType: v })}>
                  <SelectTrigger><SelectValue placeholder="Pilih tipe" /></SelectTrigger>
                  <SelectContent>{PRODUCT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Gaya Output</Label>
                <Select value={form.outputStyle} onValueChange={(v) => setForm({ ...form, outputStyle: v })}>
                  <SelectTrigger><SelectValue placeholder="Pilih gaya" /></SelectTrigger>
                  <SelectContent>{OUTPUT_STYLES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Target Penggunaan</Label>
                <Select value={form.targetUsage} onValueChange={(v) => setForm({ ...form, targetUsage: v })}>
                  <SelectTrigger><SelectValue placeholder="Pilih target" /></SelectTrigger>
                  <SelectContent>{TARGET_USAGES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-end pt-4 pb-2">
              <Button onClick={handleIdeaNext} disabled={loading} className="inline-flex items-center gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                <span>Lanjut</span>
                {!loading && <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Template */}
      {step === "template" && (
        <Card>
          <CardHeader>
            <CardTitle>Pilih Template PRD</CardTitle>
            <CardDescription>Template menentukan struktur section PRD yang akan dihasilkan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {templates.map((t) => (
                <button key={t.id} onClick={() => setSelectedTemplate(t)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-4 text-left transition-all",
                    selectedTemplate?.id === t.id
                      ? "border-indigo-500 ring-2 ring-indigo-200"
                      : "hover:border-indigo-200"
                  )}
                  style={{
                    backgroundColor: selectedTemplate?.id === t.id ? "var(--accent-pale)" : "var(--bg-card)",
                    borderColor: selectedTemplate?.id === t.id ? "var(--accent)" : "var(--border-color)",
                  }}>
                  <div className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                    selectedTemplate?.id === t.id ? "border-indigo-600 bg-indigo-600" : "")}
                    style={selectedTemplate?.id !== t.id ? { borderColor: "var(--border-color)" } : {}}>
                    {selectedTemplate?.id === t.id && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium" style={{ color: "var(--text-primary)" }}>{t.name}</span>
                      {t.isPremium ? <Badge variant="secondary">Premium</Badge> : <Badge variant="success">Gratis</Badge>}
                    </div>
                    {t.description && <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{t.description}</p>}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep("idea")} className="inline-flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" /> <span>Kembali</span>
              </Button>
              <Button onClick={() => setStep("questions")} disabled={!selectedTemplate} className="inline-flex items-center gap-2">
                <span>Lanjut</span> <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Questions */}
      {step === "questions" && (
        <Card>
          <CardHeader>
            <CardTitle>Pertanyaan Terpandu</CardTitle>
            <CardDescription>Jawab pertanyaan berikut untuk memberikan konteks lebih ke AI. Boleh dilewati.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {GUIDED_QUESTIONS.map((q, i) => (
              <div key={i} className="space-y-2">
                <Label className="text-sm" style={{ color: "var(--text-secondary)" }}>{i + 1}. {q}</Label>
                <Textarea placeholder="Jawaban kamu (opsional)..." className="min-h-[80px]"
                  value={answers[q] || ""}
                  onChange={(e) => setAnswers({ ...answers, [q]: e.target.value })} />
              </div>
            ))}
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep("template")} className="inline-flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" /> <span>Kembali</span>
              </Button>
              <Button onClick={() => setStep("generate")} className="inline-flex items-center gap-2">
                <span>Lanjut</span> <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Generate */}
      {step === "generate" && (
        <Card>
          <CardHeader>
            <CardTitle>Siap Generate PRD</CardTitle>
            <CardDescription>Periksa ringkasan dan klik Generate untuk membuat PRD</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-xl p-5 space-y-3" style={{ backgroundColor: "var(--hover-bg)", border: "1px solid var(--border-color)" }}>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-muted)" }}>Judul Dokumen</span>
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>{form.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-muted)" }}>Nama Produk</span>
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>{form.productName || form.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-muted)" }}>Tipe Produk</span>
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>{form.productType || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-muted)" }}>Template</span>
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>{selectedTemplate?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-muted)" }}>Pertanyaan dijawab</span>
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>{Object.values(answers).filter(Boolean).length} / {GUIDED_QUESTIONS.length}</span>
              </div>
            </div>

            <div className={cn("flex items-center gap-3 rounded-xl p-4",
              (user?.credits ?? 0) > 0 ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200")}>
              {(user?.credits ?? 0) > 0 ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Credit tersedia: {user?.credits}</p>
                    <p className="text-xs text-green-600">1 credit akan digunakan untuk generate PRD ini</p>
                  </div>
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5 text-red-600 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Credit habis</p>
                    <p className="text-xs text-red-600">Beli credit untuk melanjutkan generate PRD</p>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep("questions")} className="inline-flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" /> <span>Kembali</span>
              </Button>
              <Button onClick={handleGenerate} disabled={generating || (user?.credits ?? 0) < 1} className="inline-flex items-center gap-2">
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                {generating ? "Generating..." : "Generate PRD"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
