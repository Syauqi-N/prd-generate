# PRD Generator

Aplikasi SaaS untuk membuat dokumen Product Requirements Document (PRD) secara otomatis menggunakan AI.

## Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS, shadcn/ui, Lucide Icons
- **Backend**: Next.js Route Handlers
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Custom JWT session auth
- **Payment**: Pakasir
- **AI**: Modular AI provider (mock default, OpenAI-compatible)
- **Export**: Markdown + PDF (Puppeteer)
- **Deployment**: Docker, Node.js, Nginx

---

## Setup Lokal

### 1. Clone & Install

```bash
git clone <repo-url>
cd prd-generator
npm install
```

### 2. Setup Environment Variable

```bash
cp .env.example .env
```

Edit `.env` sesuai konfigurasi:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/prd_generator"
APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
AUTH_SECRET="your-super-secret-key"
PAKASIR_SLUG="your-pakasir-slug"
PAKASIR_API_KEY="your-pakasir-api-key"
PAKASIR_WEBHOOK_SECRET="your-webhook-secret"
AI_PROVIDER="mock"
AI_API_KEY=""
AI_BASE_URL=""
AI_MODEL=""
FREE_CREDIT_AMOUNT=1
```

### 3. Database Migration

Pastikan PostgreSQL sudah berjalan, lalu:

```bash
npx prisma migrate dev --name init
```

### 4. Seed Template & Plan

```bash
npm run db:seed
```

Ini akan membuat:
- 4 paket credit (Free, Starter, Pro, Business)
- 6 template PRD
- Admin user default: `admin@prdgenerator.com` / `Admin@123456`

### 5. Run Development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## Build Production

```bash
npm run build
npm run start
```

---

## Docker Deployment

### 1. Siapkan environment

```bash
cp .env.example .env
# Edit .env sesuai kebutuhan production
```

### 2. Build & Run

```bash
docker compose up -d --build
```

### 3. Jalankan migrasi & seed

```bash
docker compose exec app npx prisma migrate deploy
docker compose exec app npm run db:seed
```

### 4. Cek status

```bash
docker compose ps
docker compose logs app
```

---

## Nginx Reverse Proxy

Jika tidak menggunakan Nginx di Docker Compose, setup manual di server:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktifkan SSL dengan Certbot:

```bash
sudo certbot --nginx -d yourdomain.com
```

---

## Pakasir Webhook Setup

1. Login ke dashboard Pakasir
2. Set webhook URL ke: `https://yourdomain.com/api/webhooks/pakasir`
3. Copy webhook secret ke `.env` → `PAKASIR_WEBHOOK_SECRET`
4. Pastikan endpoint dapat diakses dari internet

Webhook endpoint: `POST /api/webhooks/pakasir`

---

## AI Provider Setup

Default menggunakan **mock provider** (tidak perlu API key).

Untuk menggunakan AI nyata, set di `.env`:

```env
AI_PROVIDER="openai"          # atau: groq, together, openai-compatible
AI_API_KEY="sk-..."
AI_BASE_URL="https://api.openai.com/v1"   # sesuaikan provider
AI_MODEL="gpt-4o-mini"
```

Provider yang didukung (OpenAI-compatible API):
- OpenAI
- Groq
- Together AI
- Provider lain yang kompatibel dengan OpenAI API format

---

## Admin Account Setup

Setelah seed, akun admin tersedia:

- **Email**: `admin@prdgenerator.com`
- **Password**: `Admin@123456`

Untuk mengubah, set environment variable sebelum seed:

```env
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="YourSecurePassword"
```

Atau ubah langsung via admin panel: `/admin/users`

---

## Struktur Folder

```
prd-generator/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── pricing/page.tsx            # Halaman harga
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx                # Dashboard utama
│   │   ├── billing/page.tsx
│   │   ├── settings/page.tsx
│   │   └── prd/
│   │       ├── new/page.tsx        # Create PRD flow
│   │       └── [id]/page.tsx       # PRD Editor
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── users/page.tsx
│   │   ├── invoices/page.tsx
│   │   ├── documents/page.tsx
│   │   ├── usage/page.tsx
│   │   └── templates/page.tsx
│   └── api/
│       ├── auth/
│       ├── prd/
│       ├── billing/
│       ├── templates/
│       ├── webhooks/pakasir/
│       └── admin/
├── components/
│   ├── ui/                         # shadcn-style UI components
│   ├── auth/                       # Auth context
│   ├── dashboard/                  # Dashboard components
│   └── marketing/                  # Landing page components
├── lib/
│   ├── db.ts                       # Prisma client
│   ├── auth.ts                     # Session management
│   ├── permissions.ts
│   ├── utils.ts
│   ├── ai/                         # Modular AI provider
│   ├── payment/                    # Pakasir integration
│   └── export/                     # Markdown & PDF export
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── middleware.ts
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

---

## API Routes

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/auth/register` | Daftar akun baru |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET/PATCH | `/api/auth/me` | Get/update profil |
| POST | `/api/auth/change-password` | Ubah password |
| GET/POST | `/api/prd` | List/create dokumen |
| GET/PUT/DELETE | `/api/prd/[id]` | Get/update/delete dokumen |
| POST | `/api/prd/[id]/generate` | Generate PRD (1 credit) |
| POST | `/api/prd/[id]/regenerate` | Regenerate PRD (1 credit) |
| POST | `/api/prd/[id]/regenerate-section` | Regenerate section (gratis) |
| POST | `/api/prd/[id]/improve-section` | Improve section (gratis) |
| GET | `/api/prd/[id]/export/markdown` | Export Markdown |
| GET | `/api/prd/[id]/export/pdf` | Export PDF (paid) |
| GET | `/api/templates` | List template |
| GET | `/api/billing/summary` | Ringkasan billing |
| GET | `/api/billing/invoices` | List invoice |
| POST | `/api/billing/checkout` | Buat invoice & redirect Pakasir |
| POST | `/api/webhooks/pakasir` | Webhook Pakasir |
| GET | `/api/admin/stats` | Statistik admin |
| GET | `/api/admin/users` | List user |
| POST | `/api/admin/users/[id]/add-credit` | Tambah credit |
| POST | `/api/admin/users/[id]/reduce-credit` | Kurangi credit |

---

## Business Rules

1. User harus login untuk menyimpan PRD
2. Generate PRD membutuhkan minimal 1 credit
3. Credit hanya berkurang jika generate berhasil
4. Credit hanya bertambah setelah webhook Pakasir valid
5. Webhook bersifat idempotent — invoice yang sudah PAID tidak diproses ulang
6. Export PDF hanya untuk paid user (credits > 0 atau admin)
7. User hanya bisa mengakses dokumennya sendiri
