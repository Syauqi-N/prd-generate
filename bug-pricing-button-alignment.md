# Bug: Tombol "Beli Sekarang" — Alignment & Visual Inconsistency

**Tanggal ditemukan:** 29 Mei 2026  
**Halaman:** Billing & Credit / Pricing  
**Device:** Desktop

## Screenshot

![Bug Pricing Button](/root/.hermes/image_cache/img_fee7036350f8.jpg)

## Bug yang Ditemukan

### 🔴 Kritis: Tombol Tidak Sejajar Vertikal Antar Card
Ketiga tombol "Beli Sekarang" berada di ketinggian berbeda:
- Starter (4 fitur) — tombol lebih tinggi
- Pro (5 fitur) — tombol paling bawah
- Business (6 fitur) — tombol di tengah-bawah

Seharusnya semua tombol sejajar di bagian bawah card.

**Fix:** Tambah `margin-top: auto` pada tombol dalam flex column container, dan pastikan card parent pakai `align-items: stretch`.

### 🟡 Minor: Tinggi Card Tidak Konsisten
Card Pro lebih tinggi dari Starter dan Business meski Business punya lebih banyak fitur. Card tidak stretch ke tinggi yang sama.

**Fix:** Set `min-height` seragam pada semua card, atau gunakan `align-items: stretch` pada grid container.

### 🟡 Minor: Spacing di Atas Tombol Tidak Konsisten
Jarak antara feature list terakhir dan tombol berbeda di tiap card.

**Fix:** Nilai `margin-top` atau `gap` yang seragam antara feature list dan tombol.

### 🟡 Minor: Lebar Tombol Tidak Proporsional
Tombol Pro tampak sedikit lebih lebar dibanding Starter dan Business.

**Fix:** Set `width: 100%` dengan padding konsisten di semua card.

### 🟡 Minor: Icon di Tombol Tidak Center Vertikal (Card Pro)
Ikon kartu kredit dan teks "Beli Sekarang" di card Pro tidak perfectly center secara vertikal.

**Fix:** Gunakan `display: flex; align-items: center; gap` yang seragam di semua tombol.

## Root Cause

Card tidak menggunakan `display: flex; flex-direction: column` dengan tombol yang punya `margin-top: auto`, sehingga tombol mengikuti flow konten bukan di-pin ke bawah.

## Status

- [x] Sudah diinvestigasi
- [x] Sudah di-fix — 2026-05-29

## Fix Applied

- Grid container pakai `items-stretch`
- Card pakai `flex flex-col`
- `CardContent` pakai `flex flex-col flex-1`
- Feature list pakai `flex-1` supaya mendorong button ke bawah
- Button pakai `mt-auto` — selalu pin ke bawah card
- Button pakai `inline-flex items-center justify-center gap-2` — icon & teks sejajar
