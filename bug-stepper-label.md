# Bug: Stepper UI — Label Terpotong & Inkonsistensi Visual

**Tanggal ditemukan:** 29 Mei 2026  
**Halaman:** Buat PRD Baru (wizard/stepper)  
**Device:** Desktop/tablet

## Screenshot

![Bug Stepper](/root/.hermes/image_cache/img_0f2bf3ef4dc1.jpg)

## Bug yang Ditemukan

### 🔴 Kritis: Label Step 1 Terpotong
Teks "Ide Produk" ter-render sebagai "de Produk" — huruf "I" terpotong. Circle active state yang lebih besar mendorong/menutupi label teks di sebelahnya.

### 🟡 Minor: Inkonsistensi Ukuran Circle
Circle step 1 (active) lebih besar dari step 2–4. Perbesaran ini tidak mengakomodasi ruang untuk label, menyebabkan clipping di poin atas.

### 🟡 Minor: Alignment Vertikal Tidak Rata
Circle dan teks label antar step tidak perfectly center-aligned — terutama step 1 yang circle-nya lebih besar menyebabkan baseline teks sedikit berbeda.

### 🟡 Minor: Jarak Separator Tidak Seragam
Tanda `>` antar step memiliki spacing tidak konsisten antara step 1→2 vs step 2→3 dan 3→4, akibat circle step 1 yang lebih besar mendorong layout.

## Root Cause

Active state step menggunakan circle lebih besar tanpa mengakomodasi ruang untuk label teks di bawahnya.

## Fix yang Disarankan

- Samakan ukuran circle semua step, gunakan warna/border saja untuk membedakan active vs inactive
- Atau, jika ukuran berbeda dipertahankan, tambah padding/min-width pada container label agar tidak terpotong
- Pastikan stepper menggunakan `align-items: center` dan fixed width per step item

## Status

- [x] Sudah diinvestigasi
- [x] Sudah di-fix — 2026-05-29

## Fix Applied

- Ganti `ring-4 ring-indigo-100` → `outline outline-2 outline-offset-2` agar tidak mempengaruhi ukuran layout
- Tambah `shrink-0` pada circle element
- Tambah `whitespace-nowrap` pada label teks
- Pisah wrapper circle+label dari separator chevron
- Tambah `shrink-0` pada chevron separator
