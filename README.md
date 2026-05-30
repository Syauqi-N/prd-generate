# PRD Generator

Aplikasi web SaaS untuk mengubah ide produk menjadi dokumen Product Requirements Document (PRD) secara otomatis menggunakan AI. User menjawab pertanyaan terpandu, lalu sistem generate PRD lengkap yang bisa diedit, disimpan, dan diexport.

## Fungsi

- Generate PRD dari ide produk via AI (modular, bisa ganti provider)
- Simpan dan edit dokumen PRD
- Export PRD ke Markdown dan PDF
- Sistem credit untuk generate PRD
- Pembelian credit/plan via Pakasir
- Dashboard admin: pantau user, invoice, usage, dan credit

## Use Case

Seorang founder pemula punya ide aplikasi tapi tidak tahu cara menulis requirement. Dia masuk ke PRD Generator, isi form singkat tentang idenya, jawab beberapa pertanyaan terpandu, lalu sistem generate PRD lengkap dalam hitungan detik. Dokumen bisa langsung diedit dan diexport ke PDF untuk dibagikan ke developer.

Freelancer developer juga bisa pakai ini untuk mengubah brief client yang tidak jelas menjadi dokumen requirement yang rapi sebelum mulai coding.

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js (React) |
| Language | TypeScript |
| Database | PostgreSQL (via `pg`) |
| ORM | Prisma |
| Auth | better-auth |
| UI Components | Radix UI + Tailwind CSS |
| Markdown Editor | @uiw/react-md-editor |
| Markdown Preview | @uiw/react-markdown-preview |
| AI Service | Modular (pluggable provider) |
| Infra | Self-hosted, Docker |

## Instalasi

### Prerequisites

- Node.js 18+
- PostgreSQL 16

### Setup

```bash
cd prd-generator
npm install

cp .env.example .env
# Edit .env: DATABASE_URL, AUTH_SECRET, AI provider keys
```

Jalankan migrasi database:

```bash
npx prisma migrate deploy
```

Jalankan development server:

```bash
npm run dev
```

Build untuk production:

```bash
npm run build
npm start
```

### Konfigurasi `.env`

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/prd_generator
AUTH_SECRET=your-auth-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
# AI provider diatur manual sesuai kebutuhan
```
