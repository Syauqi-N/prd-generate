"use client"

import Link from "next/link"
import { Navbar } from "@/components/marketing/navbar"
import { Footer } from "@/components/marketing/footer"
import { Badge } from "@/components/ui/badge"
import {
  FileText, Zap, Download, CreditCard, CheckCircle,
  ArrowRight, Star, Users, BookOpen, Code2, ShoppingBag,
  Smartphone, Building2, ChevronDown, Sparkles
} from "lucide-react"

const features = [
  { icon: Zap,        title: "Generate Otomatis",      desc: "Isi ide produkmu, jawab beberapa pertanyaan, dan AI akan membuat PRD lengkap dalam detik." },
  { icon: FileText,   title: "Template Beragam",        desc: "Pilih dari 6 template PRD: Startup MVP, Technical, Academic, SaaS, Marketplace, Mobile App." },
  { icon: Download,   title: "Export Fleksibel",        desc: "Export PRD ke format Markdown atau PDF kapan saja." },
  { icon: CreditCard, title: "Bayar Sesuai Kebutuhan",  desc: "Sistem credit — beli sesuai kebutuhan, tidak ada langganan bulanan yang memaksa." },
]

const steps = [
  { step: "01", title: "Tulis Ide Produk",  desc: "Ceritakan ide produkmu: nama, deskripsi, tipe, dan target pengguna." },
  { step: "02", title: "Pilih Template",    desc: "Pilih template PRD yang sesuai dengan jenis produkmu." },
  { step: "03", title: "Jawab Pertanyaan",  desc: "Jawab pertanyaan terpandu untuk memberikan konteks lebih ke AI." },
  { step: "04", title: "Generate & Edit",   desc: "AI menghasilkan PRD lengkap. Edit, simpan, dan export sesuai kebutuhan." },
]

const templates = [
  { icon: Zap,         name: "Startup MVP PRD",     desc: "Untuk startup yang ingin membangun MVP cepat",  free: true  },
  { icon: Code2,       name: "Technical PRD",        desc: "Template teknis untuk tim engineering",         free: false },
  { icon: BookOpen,    name: "Academic Project PRD", desc: "Untuk tugas akhir dan proyek kampus",           free: true  },
  { icon: Building2,   name: "SaaS PRD",             desc: "Khusus untuk produk SaaS",                      free: false },
  { icon: ShoppingBag, name: "Marketplace PRD",      desc: "Untuk platform marketplace",                    free: false },
  { icon: Smartphone,  name: "Mobile App PRD",       desc: "Untuk aplikasi mobile iOS/Android",             free: true  },
]

const faqs = [
  { q: "Apa itu PRD Generator?",                   a: "PRD Generator adalah aplikasi SaaS yang membantu kamu membuat dokumen Product Requirements Document (PRD) secara otomatis menggunakan AI." },
  { q: "Apakah ada versi gratis?",                 a: "Ya! Setiap akun baru mendapat 1 free credit yang bisa digunakan untuk generate 1 PRD." },
  { q: "Bagaimana sistem credit bekerja?",         a: "1 credit = 1 generate PRD. Kamu bisa membeli paket credit sesuai kebutuhan. Credit tidak expired." },
  { q: "Apakah PRD yang dihasilkan bisa diedit?",  a: "Tentu! Setelah PRD di-generate, kamu bisa mengedit seluruh konten menggunakan Markdown editor." },
  { q: "Bagaimana cara pembayaran?",               a: "Pembayaran dilakukan melalui Pakasir yang mendukung berbagai metode pembayaran lokal Indonesia." },
  { q: "Apakah data saya aman?",                   a: "Ya. Setiap dokumen PRD hanya bisa diakses oleh akun yang membuatnya." },
]

const plans = [
  { name: "Free",     price: "Gratis",     credits: 1,   features: ["1 credit", "1 PRD", "Export Markdown"],                                                               highlight: false },
  { name: "Starter",  price: "Rp 29.000",  credits: 10,  features: ["10 credits", "10 PRD", "Export MD & PDF", "AI Assistant"],                                            highlight: false },
  { name: "Pro",      price: "Rp 79.000",  credits: 30,  features: ["30 credits", "30 PRD", "Export MD & PDF", "AI Assistant", "Premium Templates"],                       highlight: true  },
  { name: "Business", price: "Rp 199.000", credits: 100, features: ["100 credits", "100 PRD", "Export MD & PDF", "AI Assistant", "Premium Templates", "Priority Support"],  highlight: false },
]

const examplePRD = `# Aplikasi Manajemen Tugas Tim

## 1. Product Overview
Aplikasi web untuk membantu tim kecil mengelola tugas...

## 2. Problem Statement
Tim kecil kesulitan melacak progress tugas...

## 3. Core Features
- Manajemen tugas dengan drag & drop
- Kolaborasi tim real-time
- Dashboard progress proyek...`

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden py-24 sm:py-32">
        {/* Gradient blobs */}
        <div className="blob blob-1" style={{ width: 600, height: 600, top: -100, left: -200 }} />
        <div className="blob blob-2" style={{ width: 500, height: 500, top: 100, right: -150 }} />
        <div className="blob blob-3" style={{ width: 400, height: 400, bottom: -100, left: "40%" }} />

        {/* Grid overlay */}
        <div className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            opacity: 0.4,
          }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 text-center">
          {/* pill badge */}
          <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 glass">
            <Sparkles className="h-3.5 w-3.5 icon-float" style={{ color: "var(--accent)" }} />
            <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
              Didukung AI · Gratis untuk dicoba
            </span>
          </div>

          <h1 className="animate-fade-up delay-100 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl leading-tight"
            style={{ color: "var(--text-primary)" }}>
            Buat PRD Profesional{" "}
            <span className="gradient-text">dalam Menit</span>
          </h1>

          <p className="animate-fade-up delay-200 mx-auto mt-6 max-w-2xl text-lg leading-relaxed"
            style={{ color: "var(--text-muted)" }}>
            Ubah ide produkmu menjadi dokumen Product Requirements Document yang lengkap
            dan terstruktur secara otomatis menggunakan AI.
          </p>

          <div className="animate-fade-up delay-300 mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/register">
              <button className="btn-gradient inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold">
                <span className="flex items-center gap-2">
                  Generate PRD Gratis <ArrowRight className="h-4 w-4" />
                </span>
              </button>
            </Link>
            <Link href="#contoh">
              <button className="glass inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold transition-all hover:-translate-y-0.5"
                style={{ color: "var(--text-primary)" }}>
                Lihat Contoh Output
              </button>
            </Link>
          </div>

          <p className="animate-fade-up delay-400 mt-4 text-sm" style={{ color: "var(--text-muted)" }}>
            Gratis 1 credit untuk akun baru. Tidak perlu kartu kredit.
          </p>

          {/* floating stats */}
          <div className="animate-fade-up delay-400 mt-16 flex flex-wrap items-center justify-center gap-4">
            {[["1,000+", "PRD Generated"], ["6", "Template Tersedia"], ["< 1 menit", "Waktu Generate"]].map(([val, label]) => (
              <div key={label} className="glass rounded-2xl px-6 py-4 text-center">
                <p className="text-2xl font-bold gradient-text">{val}</p>
                <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <div className="blob blob-1 opacity-40" style={{ width: 400, height: 400, top: 0, right: -100 }} />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <Badge className="mb-4">✨ Fitur Unggulan</Badge>
            <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
              Semua yang Kamu Butuhkan
            </h2>
            <p className="mt-4 text-base" style={{ color: "var(--text-muted)" }}>
              Dari generate hingga export, semua tersedia dalam satu platform.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="glass-card p-6 gradient-border"
                  style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ background: "var(--gradient-subtle)" }}>
                    <Icon className="h-6 w-6 icon-float" style={{ color: "var(--accent)" }} />
                  </div>
                  <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section id="cara-kerja" className="relative py-24 overflow-hidden">
        <div className="blob blob-2 opacity-30" style={{ width: 500, height: 500, bottom: -100, left: -150 }} />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <Badge className="mb-4">🚀 Cara Kerja</Badge>
            <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
              4 Langkah Mudah
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.step} className="glass-card p-6 text-center gradient-border">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl font-bold text-lg"
                  style={{ background: "var(--gradient-primary)", color: "#fff" }}>
                  {s.step}
                </div>
                <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Example output ───────────────────────────────────── */}
      <section id="contoh" className="relative py-24 overflow-hidden">
        <div className="blob blob-3 opacity-30" style={{ width: 400, height: 400, top: 0, right: 0 }} />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <Badge className="mb-4">📄 Contoh Output</Badge>
            <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
              Hasil Generate PRD
            </h2>
          </div>
          <div className="mx-auto max-w-3xl">
            <div className="glass-card overflow-hidden gradient-border">
              <div className="flex items-center gap-2 border-b px-4 py-3"
                style={{ borderColor: "var(--glass-border)", background: "var(--gradient-subtle)" }}>
                <div className="h-3 w-3 rounded-full bg-red-400/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <div className="h-3 w-3 rounded-full bg-green-400/80" />
                <span className="ml-3 text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                  prd-manajemen-tugas.md
                </span>
              </div>
              <pre className="overflow-auto p-6 text-sm leading-relaxed font-mono"
                style={{ color: "var(--text-secondary)" }}>
                <code>{examplePRD}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── Templates ────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <div className="blob blob-1 opacity-30" style={{ width: 450, height: 450, bottom: -100, right: -100 }} />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <Badge className="mb-4">📋 Template</Badge>
            <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
              Pilih Template PRD
            </h2>
            <p className="mt-4 text-base" style={{ color: "var(--text-muted)" }}>
              Pilih template yang sesuai dengan jenis produkmu.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((t) => {
              const Icon = t.icon
              return (
                <div key={t.name} className="glass-card flex items-start gap-4 p-5 gradient-border">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: "var(--gradient-subtle)" }}>
                    <Icon className="h-5 w-5" style={{ color: "var(--accent)" }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium" style={{ color: "var(--text-primary)" }}>{t.name}</h3>
                      <Badge variant={t.free ? "success" : "secondary"}>{t.free ? "Gratis" : "Premium"}</Badge>
                    </div>
                    <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{t.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────── */}
      <section id="pricing" className="relative py-24 overflow-hidden">
        <div className="blob blob-2 opacity-40" style={{ width: 500, height: 500, top: -100, left: -100 }} />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <Badge className="mb-4">💎 Harga</Badge>
            <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
              Transparan, Tanpa Kejutan
            </h2>
            <p className="mt-4 text-base" style={{ color: "var(--text-muted)" }}>
              Beli credit sesuai kebutuhan. Tidak ada biaya tersembunyi.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <div key={plan.name}
                className={`glass-card flex flex-col p-6 ${plan.highlight ? "gradient-border" : ""}`}
                style={plan.highlight ? {
                  background: "var(--gradient-card)",
                  boxShadow: "0 0 0 1px var(--accent), var(--glass-shadow)",
                } : {}}>
                {plan.highlight && (
                  <Badge className="mb-3 w-fit">⭐ Paling Populer</Badge>
                )}
                <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>{plan.name}</h3>
                <div className="mt-3 mb-6">
                  <span className={`text-3xl font-bold ${plan.highlight ? "gradient-text" : ""}`}
                    style={!plan.highlight ? { color: "var(--text-primary)" } : {}}>
                    {plan.price}
                  </span>
                  {plan.credits > 1 && (
                    <span className="ml-1 text-sm" style={{ color: "var(--text-muted)" }}>
                      / {plan.credits} credits
                    </span>
                  )}
                </div>
                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm"
                      style={{ color: "var(--text-secondary)" }}>
                      <CheckCircle className="h-4 w-4 shrink-0" style={{ color: "#10b981" }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="mt-6 block">
                  {plan.highlight ? (
                    <button className="btn-gradient w-full rounded-xl py-2.5 text-sm font-semibold">
                      <span>{plan.name === "Free" ? "Mulai Gratis" : "Beli Sekarang"}</span>
                    </button>
                  ) : (
                    <button className="glass w-full rounded-xl py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5"
                      style={{ color: "var(--text-primary)" }}>
                      {plan.name === "Free" ? "Mulai Gratis" : "Beli Sekarang"}
                    </button>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Target users ─────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <div className="blob blob-3 opacity-30" style={{ width: 400, height: 400, top: 0, left: "30%" }} />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <Badge className="mb-4">👥 Untuk Siapa</Badge>
            <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
              Dibuat untuk Semua
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BookOpen, title: "Mahasiswa",       desc: "Buat dokumentasi proyek akhir, proposal sistem, atau tugas kuliah dengan cepat." },
              { icon: Zap,      title: "Founder Pemula",  desc: "Dokumentasikan ide startup kamu dengan jelas sebelum pitching ke investor." },
              { icon: Users,    title: "Freelancer",       desc: "Ubah brief client menjadi dokumen requirement yang rapi dan profesional." },
              { icon: Star,     title: "Product Manager", desc: "Percepat pembuatan PRD dan fokus pada hal yang lebih penting." },
            ].map((u) => {
              const Icon = u.icon
              return (
                <div key={u.title} className="glass-card p-6 text-center gradient-border">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ background: "var(--gradient-subtle)" }}>
                    <Icon className="h-6 w-6 icon-float" style={{ color: "var(--accent)" }} />
                  </div>
                  <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>{u.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{u.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section id="faq" className="relative py-24 overflow-hidden">
        <div className="blob blob-1 opacity-25" style={{ width: 400, height: 400, bottom: -100, right: -100 }} />
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4">❓ FAQ</Badge>
            <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
              Pertanyaan Umum
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="glass-card group overflow-hidden">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 font-medium list-none"
                  style={{ color: "var(--text-primary)" }}>
                  {faq.q}
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-300 group-open:rotate-180"
                    style={{ color: "var(--accent)" }} />
                </summary>
                <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <div className="blob blob-1" style={{ width: 600, height: 600, top: -200, left: -200 }} />
        <div className="blob blob-2" style={{ width: 500, height: 500, bottom: -200, right: -150 }} />
        <div className="blob blob-3" style={{ width: 400, height: 400, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="glass-card p-12 gradient-border">
            <Sparkles className="mx-auto mb-4 h-10 w-10 icon-float" style={{ color: "var(--accent)" }} />
            <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
              Siap Membuat PRD{" "}
              <span className="gradient-text">Pertamamu?</span>
            </h2>
            <p className="mt-4 text-base" style={{ color: "var(--text-muted)" }}>
              Daftar gratis dan dapatkan 1 credit untuk mencoba.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/register">
                <button className="btn-gradient inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold">
                  <span className="flex items-center gap-2">
                    Mulai Gratis Sekarang <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
              </Link>
              <Link href="#pricing">
                <button className="glass inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold transition-all hover:-translate-y-0.5"
                  style={{ color: "var(--text-primary)" }}>
                  Lihat Harga
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
