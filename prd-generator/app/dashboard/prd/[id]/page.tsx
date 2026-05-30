"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn, formatDateTime } from "@/lib/utils"
import {
  Save, Download, FileText, Loader2, Trash2, RefreshCw,
  Copy, ChevronRight, Wand2, Eye, Edit3, ArrowLeft
} from "lucide-react"
import dynamic from "next/dynamic"

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false })
const MDPreview = dynamic(() => import("@uiw/react-markdown-preview"), { ssr: false })

type Document = {
  id: string
  title: string
  productName: string | null
  productType: string | null
  outputStyle: string | null
  status: string
  content: string
  createdAt: string
  updatedAt: string
}

const AI_ACTIONS = [
  { label: "Improve Section", value: "improve", icon: Wand2 },
  { label: "Lebih Teknis", value: "more-technical", icon: Edit3 },
  { label: "Lebih Sederhana", value: "simpler", icon: FileText },
  { label: "Tambah User Stories", value: "add-user-stories", icon: ChevronRight },
  { label: "Tambah Acceptance Criteria", value: "add-acceptance-criteria", icon: ChevronRight },
  { label: "Generate MVP Scope", value: "generate-mvp", icon: ChevronRight },
  { label: "Generate Risks", value: "generate-risks", icon: ChevronRight },
]

// Extract headings from markdown for outline
function extractOutline(content: string) {
  const lines = content.split("\n")
  return lines
    .filter((l) => l.startsWith("## ") || l.startsWith("# "))
    .map((l) => ({
      level: l.startsWith("## ") ? 2 : 1,
      title: l.replace(/^#+\s/, ""),
    }))
}

export default function PRDEditorPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user, refresh } = useAuth()
  const { toast } = useToast()

  const [doc, setDoc] = useState<Document | null>(null)
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [mode, setMode] = useState<"edit" | "preview">("edit")
  const [aiSection, setAiSection] = useState("")
  const [aiAction, setAiAction] = useState("")
  const [outline, setOutline] = useState<{ level: number; title: string }[]>([])

  useEffect(() => {
    fetch(`/api/prd/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.document) {
          setDoc(d.document)
          setContent(d.document.content)
          setTitle(d.document.title)
          setOutline(extractOutline(d.document.content))
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    setOutline(extractOutline(content))
  }, [content])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/prd/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      })
      if (!res.ok) throw new Error("Gagal menyimpan")
      toast({ title: "Tersimpan", description: "Dokumen berhasil disimpan", variant: "success" })
    } catch {
      toast({ title: "Error", description: "Gagal menyimpan dokumen", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    toast({ title: "Disalin!", description: "Markdown berhasil disalin ke clipboard", variant: "success" })
  }

  const handleExportMarkdown = () => {
    window.open(`/api/prd/${id}/export/markdown`, "_blank")
  }

  const handleExportPDF = () => {
    window.open(`/api/prd/${id}/export/pdf`, "_blank")
  }

  const handleRegenerate = async () => {
    if ((user?.credits ?? 0) < 1) {
      toast({ title: "Credit habis", description: "Beli credit untuk regenerate PRD", variant: "destructive" })
      return
    }
    if (!confirm("Regenerate akan mengganti seluruh konten PRD dan menggunakan 1 credit. Lanjutkan?")) return
    setAiLoading(true)
    try {
      const res = await fetch(`/api/prd/${id}/regenerate`, { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setContent(data.document.content)
      await refresh()
      toast({ title: "PRD berhasil di-regenerate!", variant: "success" })
    } catch (e: any) {
      toast({ title: "Gagal regenerate", description: e.message, variant: "destructive" })
    } finally {
      setAiLoading(false)
    }
  }

  const handleAIAction = async () => {
    if (!aiSection || !aiAction) {
      toast({ title: "Pilih section dan aksi AI", variant: "destructive" })
      return
    }
    setAiLoading(true)
    try {
      const endpoint = aiAction === "improve"
        ? `/api/prd/${id}/improve-section`
        : `/api/prd/${id}/regenerate-section`

      const body = aiAction === "improve"
        ? { sectionTitle: aiSection, sectionContent: "", improvementType: aiAction }
        : { sectionTitle: aiSection, sectionContent: "", instruction: aiAction }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast({ title: "Section berhasil diperbarui", description: "Salin hasilnya ke editor", variant: "success" })
      // Append result to content as a suggestion
      setContent((prev) => prev + "\n\n---\n*Saran AI:*\n\n" + data.content)
    } catch (e: any) {
      toast({ title: "Gagal", description: e.message, variant: "destructive" })
    } finally {
      setAiLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Hapus dokumen ini? Tindakan ini tidak bisa dibatalkan.")) return
    const res = await fetch(`/api/prd/${id}`, { method: "DELETE" })
    if (res.ok) {
      toast({ title: "Dokumen dihapus", variant: "success" })
      router.push("/dashboard")
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (!doc) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Dokumen tidak ditemukan</p>
        <Button onClick={() => router.push("/dashboard")}>Kembali ke Dashboard</Button>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="min-w-0 flex-1 truncate bg-transparent text-base font-semibold text-gray-900 outline-none focus:ring-0"
          />
          <Badge variant={doc.status === "GENERATED" ? "success" : "secondary"}>
            {doc.status === "GENERATED" ? "Generated" : "Draft"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1 hidden sm:flex">
            <Copy className="h-4 w-4" /> Copy MD
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportMarkdown} className="gap-1 hidden sm:flex">
            <Download className="h-4 w-4" /> MD
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF} className="gap-1 hidden sm:flex">
            <Download className="h-4 w-4" /> PDF
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Simpan
          </Button>
        </div>
      </div>

      {/* Main 3-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Outline */}
        <aside className="hidden w-56 shrink-0 overflow-y-auto border-r border-gray-200 bg-white p-4 lg:block">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Outline</p>
          {outline.length === 0 ? (
            <p className="text-xs text-gray-400">Belum ada heading</p>
          ) : (
            <ul className="space-y-1">
              {outline.map((item, i) => (
                <li key={i} className={cn("text-xs text-gray-600 hover:text-indigo-600 cursor-pointer truncate",
                  item.level === 1 ? "font-semibold" : "pl-3")}>
                  {item.title}
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* Center: Editor */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Edit/Preview toggle */}
          <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2">
            <button onClick={() => setMode("edit")}
              className={cn("flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                mode === "edit" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700")}>
              <Edit3 className="h-3.5 w-3.5" /> Edit
            </button>
            <button onClick={() => setMode("preview")}
              className={cn("flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                mode === "preview" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700")}>
              <Eye className="h-3.5 w-3.5" /> Preview
            </button>
            <span className="ml-auto text-xs text-gray-400">
              Terakhir diperbarui: {formatDateTime(doc.updatedAt)}
            </span>
          </div>

          <div className="flex-1 overflow-auto p-4" data-color-mode="light">
            {mode === "edit" ? (
              <MDEditor
                value={content}
                onChange={(v) => setContent(v || "")}
                height="100%"
                preview="edit"
                className="min-h-[600px]"
              />
            ) : (
              <div className="prose prose-sm max-w-none">
                <MDPreview source={content} />
              </div>
            )}
          </div>
        </div>

        {/* Right: AI Assistant */}
        <aside className="hidden w-64 shrink-0 overflow-y-auto border-l border-gray-200 bg-white p-4 xl:block">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">AI Assistant</p>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Section yang ingin diubah</label>
              <select
                value={aiSection}
                onChange={(e) => setAiSection(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Pilih section...</option>
                {outline.map((item, i) => (
                  <option key={i} value={item.title}>{item.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="mb-1 block text-xs font-medium text-gray-600">Aksi AI</label>
              {AI_ACTIONS.map((action) => (
                <button key={action.value}
                  onClick={() => setAiAction(action.value)}
                  className={cn("flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                    aiAction === action.value ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50")}>
                  <action.icon className="h-3.5 w-3.5" />
                  {action.label}
                </button>
              ))}
            </div>

            <Button onClick={handleAIAction} disabled={aiLoading || !aiSection || !aiAction} className="w-full gap-2" size="sm">
              {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              Jalankan AI
            </Button>

            <div className="border-t border-gray-100 pt-4">
              <Button onClick={handleRegenerate} disabled={aiLoading} variant="outline" className="w-full gap-2" size="sm">
                <RefreshCw className="h-4 w-4" />
                Regenerate Full PRD
              </Button>
              <p className="mt-1 text-xs text-gray-400 text-center">Menggunakan 1 credit</p>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <Button onClick={handleDelete} variant="ghost" className="w-full gap-2 text-red-500 hover:text-red-600 hover:bg-red-50" size="sm">
                <Trash2 className="h-4 w-4" />
                Hapus Dokumen
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
