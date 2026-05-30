# Bug: Teks & Heading Kontras Rendah di Dark Mode

**Tanggal ditemukan:** 29 Mei 2026  
**Halaman:** PRD for AI Tools (kemungkinan semua halaman)  
**Device:** Desktop — Dark Mode

## Screenshot

![Bug Dark Mode Contrast](/root/.hermes/image_cache/img_1a4ce41d334f.jpg)

## Bug yang Ditemukan

### 🔴 Kritis: Placeholder Input & Textarea Kontras Rendah
- Field "Nama Produk" — placeholder abu-abu muda di atas input gelap
- Textarea "Deskripsi Ide Produk" — placeholder panjang hampir tidak terbaca
- Dropdown "Pilih platform" & "Pilih AI tool" — teks placeholder pucat

Semua di bawah standar WCAG AA (minimum 4.5:1 untuk teks normal).

### 🔴 Kritis: Step Label "Ide Produk" Hampir Tidak Terlihat
Teks label step 1 sangat gelap di atas background dark, sebagian terpotong dan nyaris tidak terbaca.

### 🟡 Sedang: Step Label "Pertanyaan" & "Hasil" Redup
Label step 2 & 3 yang belum aktif menggunakan warna abu-abu terlalu redup.

### 🟡 Sedang: Subtitle Header Halaman Kontras Borderline
Teks "Generate PRD yang dioptimalkan untuk Cursor, v0, Lovable..." di bawah judul halaman terlalu redup.

### 🟡 Sedang: Label Dropdown Redup
Label "Platform Target" dan "AI Coding Tool Target" di atas dropdown sedikit kurang kontras.

## Elemen yang Sudah OK
- Heading "PRD for AI Tools" — kontras baik
- Heading "Deskripsikan Produkmu" — putih, kontras baik
- Tombol "Lanjut" — kontras baik
- Menu sidebar aktif — highlighted dengan baik

## Fix yang Disarankan

- Placeholder: gunakan minimal `text-gray-400` → naik ke `text-gray-300` di dark mode
- Step label inactive: dari `text-gray-500` → `text-gray-400`
- Subtitle & sub-label: dari `text-gray-500` → `text-gray-300`
- Target minimal rasio kontras **3:1** untuk UI components, **4.5:1** untuk body text (WCAG AA)

## Status

- [x] Sudah diinvestigasi
- [x] Sudah di-fix — 2026-05-29

## Fix Applied

- Tambah `::placeholder` CSS global dengan `color: var(--text-muted)` + `.dark ::placeholder` dengan `#94a3b8`
- Input & Textarea pakai `placeholder:text-[var(--text-muted)]` Tailwind class
- Stepper inactive circle pakai `var(--hover-bg)` + `var(--text-secondary)` — lebih kontras di dark mode
- Stepper inactive label pakai `var(--text-secondary)` instead of `var(--text-muted)`
- Fix ring → outline pada stepper active state (tidak mempengaruhi layout)
- Select trigger placeholder sudah inherit dari CSS global
