# Bug: Tombol "Lanjut" — Clipped & Floating di Luar Card

**Tanggal ditemukan:** 29 Mei 2026  
**Halaman:** Buat PRD Baru & PRD for AI Tools  
**Device:** Desktop

## Screenshots

![Bug Lanjut - Buat PRD Baru](/root/.hermes/image_cache/img_441392a99c00.jpg)
![Bug Lanjut - PRD for AI Tools](/root/.hermes/image_cache/img_c1fe38fe1fe3.jpg)

## Bug yang Ditemukan

### 🔴 Halaman "Buat PRD Baru": Tombol Terpotong (Clipped)
Bagian bawah tombol "Lanjut" terpotong — sekitar sepertiga bawah tombol tidak terlihat, termasuk ikon `>`. Tombol bleeding melewati border bawah card.

**Root cause:** Card punya fixed/max-height terlalu kecil + `overflow: hidden`, sehingga tombol yang ada di bagian bawah terpotong.

### 🔴 Halaman "PRD for AI Tools": Tombol Floating di Luar Card
Tombol "Lanjut" tidak berada di dalam card — posisinya di pojok kanan bawah viewport, overlapping dengan edge card dan bleeding ke background gelap.

**Root cause:** Tombol kemungkinan pakai `position: fixed` atau `position: absolute` dengan nilai `bottom`/`right` yang anchor ke viewport, bukan ke card.

## Fix yang Disarankan

- Hapus `position: absolute/fixed` dari tombol
- Tempatkan tombol sebagai in-flow element di dalam footer card
- Pastikan card container pakai `display: flex; flex-direction: column`
- Tambah `padding-bottom` yang cukup (16–24px) di card
- Hapus `overflow: hidden` pada card jika ada, atau pastikan card height cukup

## Status

- [x] Sudah diinvestigasi
- [x] Sudah di-fix — 2026-05-29

## Fix Applied

- Hapus span wrapper di `button.tsx` — icon dan teks sekarang inline dalam satu flex container
- Tambah `text-white` langsung di `btn-gradient` class
- Button pakai `inline-flex items-center gap-2` — icon & teks selalu sebaris
- Tambah `pt-4 pb-2` pada container button — cukup ruang di bawah card
- Icon dipisah dari teks dengan conditional render yang benar
