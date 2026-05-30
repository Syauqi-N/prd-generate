"use client"

import { useState } from "react"
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
import {
  Bot, Loader2, ChevronRight, ChevronLeft, Zap,
  CheckCircle, Lock, Download, Copy, FileText, RotateCcw
} from "lucide-react"
import dynamic from "next/dynamic"

const MDPreview = dynamic(() => import("@uiw/react-markdown-preview"), { ssr: false })

const PLATFORMS = ["Web App", "Mobile App", "Desktop App", "SaaS", "API / Backend", "Chrome Extension", "Other"]
const AI_TOOLS_GROUPS = [
  {
    label: "GUI Tools",
    tools: ["Cursor", "v0", "Lovable", "Bolt", "Windsurf", "GitHub Copilot"],
  },
  {
    label: "CLI Tools",
    tools: ["Claude Code", "OpenAI Codex CLI", "Gemini CLI", "Aider", "Continue"],
  },
  {
    label: "Lainnya",
    tools: ["General"],
  },
]

type Step = "input" | "questions" | "generating" | "result"

export default function AIPRDPage() {
  const router = useRouter()
  const { user, refresh } = useAuth()
  const { toast } = useToast()

  const [step, setStep] = useState<Step>("input")
  const [loading, setLoading] = useState(false)

  // Step 1
  const [form, setForm] = useState({
    productName: "",
    idea: "",
    platform: "",
    aiTool: "",
  })

  // Step 2
  const [questions, setQuestions] = useState<string[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})

  // Step 4
  const [documentId, setDocumentId] = useState<string | null>(null)
  const [content, setContent] = useState("")
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null)

  const steps: { key: Step; label: string }[] = [
    { key: "input", label: "Ide Produk" },
    { key: "questions", label: "Pertanyaan" },
    { key: "generating", label: "Generate" },
    { key: "result", label: "Hasil" },
  ]
  const stepIndex = steps.findIndex((s) => s.key === step)

  // Step 1 → 2: generate contextual questions
  const handleGenerateQuestions = async () => {
    if (!form.idea.trim()) {
      toast({ title: "Isi deskripsi ide produk dulu", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/ai-prd/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: form.idea,
          platform: form.platform,
          aiTool: form.aiTool,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setQuestions(data.questions)
      setStep("questions")
    } catch (e: any) {
      toast({ title: "Gagal generate pertanyaan", description: e.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  // Step 2 → 3 → 4: generate PRD
  const handleGenerate = async () => {
    if ((user?.credits ?? 0) < 1) {
      toast({ title: "Credit habis", description: "Silakan beli credit untuk melanjutkan.", variant: "destructive" })
      return
    }
    setStep("generating")
    try {
      const res = await fetch("/api/ai-prd/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: form.productName || form.idea,
          idea: form.idea,
          platform: form.platform,
          aiTool: form.aiTool,
          answers,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDocumentId(data.document.id)
      setContent(data.document.content)
      setCreditsRemaining(data.creditsRemaining)
      await refresh()
      setStep("result")
    } catch (e: any) {
      toast({ title: "Gagal generate PRD", description: e.message, variant: "destructive" })
      setStep("questions")
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    toast({ title: "Disalin!", description: "Markdown berhasil disalin ke clipboard", variant: "success" })
  }

  const handleExportMarkdown = () => {
    if (documentId) window.open(`/api/prd/${documentId}/export/markdown`, "_blank")
  }

  const handleExportPDF = () => {
    if (documentId) window.open(`/api/prd/${documentId}/export/pdf`, "_blank")
  }

  const handleReset = () => {
    setStep("input")
    setForm({ productName: "", idea: "", platform: "", aiTool: "" })
    setQuestions([])
    setAnswers({})
    setDocumentId(null)
    setContent("")
  }

  return (
    <div className="mx-auto max-w-3xl p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
            <Bot className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">PRD for AI Tools</h1>
            <p className="text-sm text-gray-500">Generate PRD yang dioptimalkan untuk Cursor, v0, Lovable, dan AI coding tools lainnya</p>
          </div>
        </div>
      </div>

      {/* Stepper */}
      {step !== "generating" && (
        <div className="mb-8 flex items-center">
          {steps.filter(s => s.key !== "generating").map((s, i) => {
            const realIndex = steps.findIndex(x => x.key === s.key)
            const isDone = stepIndex > realIndex
            const isActive = step === s.key
            return (
              <div key={s.key} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-all",
                    isDone ? "bg-indigo-600 text-white" :
                    isActive ? "bg-indigo-600 text-white outline outline-2 outline-offset-2 outline-indigo-300" : ""
                  )}
                  style={!isDone && !isActive ? { backgroundColor: "var(--hover-bg)", color: "var(--text-secondary)" } : {}}>
                    {isDone ? <CheckCircle className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className="text-sm hidden sm:block whitespace-nowrap"
                    style={{ color: isActive ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: isActive ? 500 : 400 }}>
                    {s.label}
                  </span>
                </div>
                {i < 2 && <ChevronRight className="h-4 w-4 mx-2 shrink-0" style={{ color: "var(--text-muted)" }} />}
              </div>
            )
          })}
        </div>
      )}

      {/* Step 1: Input */}
      {step === "input" && (
        <Card>
          <CardHeader>
            <CardTitle>Deskripsikan Produkmu</CardTitle>
            <CardDescription>Ceritakan ide produk yang ingin kamu bangun dengan AI coding tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="productName">Nama Produk</Label>
              <Input id="productName" placeholder="Contoh: TaskFlow, ShopEasy, dll"
                value={form.productName}
                onChange={(e) => setForm({ ...form, productName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idea">Deskripsi Ide Produk *</Label>
              <Textarea id="idea"
                placeholder="Ceritakan produk yang ingin kamu bangun. Semakin detail semakin baik — fitur utama, target user, masalah yang diselesaikan..."
                className="min-h-[140px]"
                value={form.idea}
                onChange={(e) => setForm({ ...form, idea: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Platform Target</Label>
                <Select value={form.platform} onValueChange={(v) => setForm({ ...form, platform: v })}>
                  <SelectTrigger><SelectValue placeholder="Pilih platform" /></SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>AI Coding Tool Target</Label>
                <Select value={form.aiTool} onValueChange={(v) => setForm({ ...form, aiTool: v })}>
                  <SelectTrigger><SelectValue placeholder="Pilih AI tool" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cursor">Cursor</SelectItem>
                    <SelectItem value="v0">v0</SelectItem>
                    <SelectItem value="Lovable">Lovable</SelectItem>
                    <SelectItem value="Bolt">Bolt</SelectItem>
                    <SelectItem value="Windsurf">Windsurf</SelectItem>
                    <SelectItem value="GitHub Copilot">GitHub Copilot</SelectItem>
                    <SelectItem value="Claude Code">Claude Code (CLI)</SelectItem>
                    <SelectItem value="OpenAI Codex CLI">OpenAI Codex CLI</SelectItem>
                    <SelectItem value="Gemini CLI">Gemini CLI</SelectItem>
                    <SelectItem value="Aider">Aider (CLI)</SelectItem>
                    <SelectItem value="Continue">Continue (CLI)</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Info box */}
            <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-4">
              <p className="text-sm font-medium text-indigo-800">PRD for AI Tools menghasilkan:</p>
              <ul className="mt-2 space-y-1 text-xs text-indigo-700">
                <li>✓ Tech stack eksplisit & spesifik</li>
                <li>✓ Project structure & file tree</li>
                <li>✓ Data models & API endpoints</li>
                <li>✓ User stories & acceptance criteria</li>
                <li>✓ Implementation notes untuk AI</li>
              </ul>
            </div>

            <div className="flex justify-end pt-4 pb-2">
              <Button onClick={handleGenerateQuestions} disabled={loading || !form.idea.trim()} className="inline-flex items-center gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                <span>{loading ? "Generating pertanyaan..." : "Lanjut"}</span>
                {!loading && <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Questions */}
      {step === "questions" && (
        <Card>
          <CardHeader>
            <CardTitle>Pertanyaan Kontekstual</CardTitle>
            <CardDescription>
              AI membuat pertanyaan khusus berdasarkan ide produkmu. Jawab untuk hasil PRD yang lebih akurat — boleh dilewati.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {questions.map((q, i) => (
              <div key={i} className="space-y-2">
                <Label className="text-sm font-medium text-gray-800">
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">{i + 1}</span>
                  {q}
                </Label>
                <Textarea
                  placeholder="Jawaban kamu (opsional)..."
                  className="min-h-[80px]"
                  value={answers[q] || ""}
                  onChange={(e) => setAnswers({ ...answers, [q]: e.target.value })}
                />
              </div>
            ))}

            {/* Credit info */}
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
                    <p className="text-xs text-red-600">
                      <a href="/dashboard/billing" className="underline">Beli credit</a> untuk melanjutkan
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep("input")} className="gap-2">
                <ChevronLeft className="h-4 w-4" /> Kembali
              </Button>
              <Button onClick={handleGenerate} disabled={(user?.credits ?? 0) < 1} className="gap-2">
                <Zap className="h-4 w-4" /> Generate PRD
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Generating */}
      {step === "generating" && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
                <Bot className="h-10 w-10 text-indigo-600" />
              </div>
              <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600">
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Generating PRD...</h2>
            <p className="mt-2 text-sm text-gray-500">AI sedang membuat PRD yang dioptimalkan untuk {form.aiTool || "AI coding tools"}</p>
            <p className="mt-1 text-xs text-gray-400">Proses ini membutuhkan 15–60 detik</p>
            <div className="mt-6 flex items-center gap-2 rounded-lg bg-orange-50 border border-orange-100 px-4 py-2">
              <Zap className="h-4 w-4 text-orange-500" />
              <p className="text-xs text-orange-700">Menggunakan 1 credit</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Result */}
      {step === "result" && (
        <div className="space-y-4">
          {/* Action bar */}
          <Card>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">PRD berhasil dibuat!</p>
                  {creditsRemaining !== null && (
                    <p className="text-xs text-gray-500">Sisa credit: {creditsRemaining}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" variant="outline" onClick={handleCopy} className="gap-1">
                  <Copy className="h-3.5 w-3.5" /> Copy MD
                </Button>
                <Button size="sm" variant="outline" onClick={handleExportMarkdown} className="gap-1">
                  <Download className="h-3.5 w-3.5" /> Export MD
                </Button>
                <Button size="sm" variant="outline" onClick={handleExportPDF} className="gap-1">
                  <FileText className="h-3.5 w-3.5" /> Export PDF
                </Button>
                <Button size="sm" variant="ghost" onClick={handleReset} className="gap-1">
                  <RotateCcw className="h-3.5 w-3.5" /> Buat Baru
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* PRD Preview */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Preview PRD</CardTitle>
                <Badge variant="success">Generated</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[600px] overflow-y-auto p-6" data-color-mode="light">
                <MDPreview source={content} />
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="border" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--accent-pale)" }}>
            <CardContent className="p-4">
              <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>Tips penggunaan dengan {form.aiTool || "AI Tools"}:</p>
              {["Claude Code", "OpenAI Codex CLI", "Gemini CLI", "Aider", "Continue"].includes(form.aiTool) ? (
                <ul className="mt-2 space-y-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <li>• Jalankan CLI tool di root project, lalu paste seluruh PRD sebagai context awal</li>
                  <li>• Gunakan section "Prompt Guide" di PRD untuk urutan perintah yang optimal</li>
                  <li>• Feed satu fitur per sesi untuk hasil yang lebih fokus</li>
                  <li>• Gunakan section "Tech Stack" sebagai constraint di awal sesi</li>
                  <li>• Section "Data Models" bisa langsung dijadikan prompt schema generation</li>
                </ul>
              ) : (
                <ul className="mt-2 space-y-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <li>• Copy seluruh PRD dan paste sebagai context awal di {form.aiTool || "AI tool"} kamu</li>
                  <li>• Gunakan section "Implementation Notes" sebagai system prompt tambahan</li>
                  <li>• Referensikan section "Tech Stack" saat meminta AI generate kode</li>
                  <li>• Gunakan "User Stories" untuk generate fitur satu per satu</li>
                  <li>• Section "Prompt Guide" berisi langkah-langkah spesifik untuk {form.aiTool || "tool"} kamu</li>
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
