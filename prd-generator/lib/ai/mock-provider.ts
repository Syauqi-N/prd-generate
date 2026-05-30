import type {
  AIProvider,
  GeneratePRDInput,
  GeneratePRDOutput,
  RegenerateSectionInput,
  ImproveSectionInput,
} from "./ai-provider";

export class MockAIProvider implements AIProvider {
  async generatePRD(input: GeneratePRDInput): Promise<GeneratePRDOutput> {
    // Simulate delay
    await new Promise((r) => setTimeout(r, 1500));

    const content = `# ${input.productName}

## 1. Product Overview

**${input.productName}** adalah ${input.idea}

Produk ini dikembangkan sebagai **${input.productType}** dengan gaya output **${input.outputStyle}**, ditujukan untuk kebutuhan **${input.targetUsage}**.

---

## 2. Background

Produk ini lahir dari kebutuhan nyata di lapangan. Banyak pengguna menghadapi tantangan dalam ${input.idea.toLowerCase()}, sehingga diperlukan solusi yang terstruktur dan mudah digunakan.

> *Asumsi: Latar belakang ini dibuat berdasarkan informasi yang diberikan.*

---

## 3. Problem Statement

- Pengguna kesulitan dalam mengelola dan mendokumentasikan kebutuhan produk secara efisien.
- Tidak ada alat yang mudah digunakan untuk menghasilkan dokumen requirement secara otomatis.
- Proses manual memakan waktu dan rentan terhadap inkonsistensi.

---

## 4. Goals & Objectives

| Goal | Objective |
|------|-----------|
| Mempercepat pembuatan dokumen | Kurangi waktu pembuatan PRD dari hari menjadi menit |
| Meningkatkan kualitas dokumentasi | Hasilkan PRD yang terstruktur dan konsisten |
| Memudahkan kolaborasi tim | Dokumen dapat diakses dan diedit bersama |

---

## 5. Target Users

${input.answers["Siapa target user utama produk ini?"] || "- Mahasiswa\n- Founder pemula\n- Freelancer\n- Product Manager Junior"}

---

## 6. User Personas

### Persona 1: Mahasiswa Teknik
- **Nama:** Budi, 22 tahun
- **Kebutuhan:** Membuat dokumentasi proyek akhir dengan cepat
- **Pain Point:** Tidak tahu format PRD yang benar

### Persona 2: Founder Startup
- **Nama:** Rina, 28 tahun
- **Kebutuhan:** Mendokumentasikan ide produk untuk investor
- **Pain Point:** Tidak punya waktu untuk menulis PRD panjang

---

## 7. Core Features

${input.answers["Fitur utama apa saja yang harus ada?"] || `- Autentikasi pengguna (register, login, logout)
- Dashboard pengguna
- Input ide produk
- Pemilihan template PRD
- Pertanyaan terpandu
- Generate PRD otomatis dengan AI
- Editor PRD (Markdown)
- Export ke Markdown dan PDF
- Sistem credit
- Integrasi pembayaran`}

---

## 8. User Flow

\`\`\`
Landing Page → Register/Login → Dashboard → Create New PRD
→ Input Ide Produk → Pilih Template → Jawab Pertanyaan
→ Generate PRD → Edit PRD → Save / Export
\`\`\`

---

## 9. Functional Requirements

### FR-01: Autentikasi
- Sistem harus mendukung register dengan email dan password
- Sistem harus mendukung login dan logout
- Pengguna baru mendapat free credit secara otomatis

### FR-02: Generate PRD
- Sistem harus menerima input ide produk dari pengguna
- Sistem harus menyediakan pilihan template
- Sistem harus menampilkan pertanyaan terpandu
- Sistem harus menghasilkan PRD menggunakan AI
- Credit harus berkurang hanya jika generate berhasil

### FR-03: Editor
- Pengguna dapat mengedit konten PRD
- Pengguna dapat menyimpan perubahan
- Pengguna dapat export ke Markdown
- Pengguna berbayar dapat export ke PDF

### FR-04: Billing
- Pengguna dapat melihat paket credit
- Pengguna dapat melakukan checkout via Pakasir
- Sistem menerima webhook dari Pakasir
- Credit bertambah hanya setelah webhook valid

---

## 10. Non-Functional Requirements

- **Performa:** Halaman harus load dalam < 3 detik
- **Keamanan:** Password di-hash, session menggunakan JWT
- **Skalabilitas:** Arsitektur mendukung penambahan fitur
- **Ketersediaan:** Uptime minimal 99%
- **Modularitas:** AI provider dapat diganti tanpa mengubah core logic

---

## 11. MVP Scope

${input.answers["Apa saja fitur yang masuk MVP?"] || `- Landing page
- Register dan login
- Dashboard pengguna
- Create PRD (input → template → questions → generate)
- Editor PRD
- Export Markdown
- Export PDF (paid user)
- Sistem credit
- Checkout via Pakasir
- Webhook Pakasir
- Admin dashboard`}

---

## 12. Out of Scope

${input.answers["Apa saja fitur yang belum masuk MVP?"] || `- Kolaborasi real-time
- Integrasi Jira/Trello
- Mobile app native
- Subscription otomatis
- Multi-tenant organization`}

---

## 13. Acceptance Criteria

- [ ] Pengguna dapat register dan login
- [ ] Pengguna baru mendapat 1 free credit
- [ ] Pengguna dapat membuat PRD baru
- [ ] PRD berhasil di-generate dan tersimpan di database
- [ ] Credit berkurang setelah generate berhasil
- [ ] Credit tidak berkurang jika generate gagal
- [ ] Pengguna dapat mengedit dan menyimpan PRD
- [ ] Pengguna dapat export Markdown
- [ ] Paid user dapat export PDF
- [ ] Webhook Pakasir berjalan dengan benar
- [ ] Admin dapat melihat semua data

---

## 14. Risks & Assumptions

| Risiko | Dampak | Mitigasi |
|--------|--------|----------|
| AI provider tidak tersedia | Tinggi | Gunakan mock provider sebagai fallback |
| Webhook Pakasir gagal | Tinggi | Implementasi retry dan idempotency |
| Overload server | Sedang | Rate limiting dan queue |

**Asumsi:**
- Pengguna memiliki koneksi internet yang stabil
- Pakasir tersedia dan berfungsi normal
- AI provider dapat diakses dari server

---

## 15. Success Metrics

${input.answers["Bagaimana indikator keberhasilan produk?"] || `- 100 pengguna terdaftar dalam 30 hari pertama
- 50% pengguna melakukan generate PRD
- 20% pengguna melakukan pembelian credit
- Rating kepuasan pengguna > 4/5
- Waktu generate PRD < 30 detik`}

---

## 16. Future Enhancements

- Export ke format DOCX
- PRD score dan quality checker
- Generate backlog dari PRD
- Share PRD via public link
- Team workspace dan kolaborasi
- Integrasi dengan Jira dan Trello
- Mobile app (iOS & Android)
`;

    return {
      content,
      tokenInput: 500,
      tokenOutput: 1200,
      provider: "mock",
      model: "mock-v1",
    };
  }

  async regenerateSection(input: RegenerateSectionInput): Promise<string> {
    await new Promise((r) => setTimeout(r, 800));
    return `## ${input.sectionTitle}

*[Bagian ini telah diperbarui berdasarkan instruksi: ${input.instruction}]*

${input.sectionContent}

> Catatan: Ini adalah hasil regenerasi dari mock provider. Hubungkan AI provider nyata untuk hasil yang lebih baik.
`;
  }

  async improveSection(input: ImproveSectionInput): Promise<string> {
    await new Promise((r) => setTimeout(r, 800));
    return `## ${input.sectionTitle}

*[Bagian ini telah ditingkatkan dengan tipe: ${input.improvementType}]*

${input.sectionContent}

> Catatan: Ini adalah hasil improvement dari mock provider. Hubungkan AI provider nyata untuk hasil yang lebih baik.
`;
  }
}
