Berikut PRD yang bisa langsung kamu pakai sebagai bahan untuk generate project di AI coding tools.



PRD  AI PRD Generator SaaS

1. Project Overview

Buat sebuah aplikasi web SaaS bernama sementara PRD Generator.

Aplikasi ini membantu user mengubah ide produk/aplikasi menjadi dokumen Product Requirements Document secara otomatis menggunakan AI. User dapat membuat akun, menulis ide produk, menjawab beberapa pertanyaan terpandu, lalu sistem akan menghasilkan PRD lengkap yang bisa diedit, disimpan, dan diexport.

Aplikasi ini akan menggunakan sistem credit/plan berbayar. Pembayaran dilakukan melalui Pakasir. Setelah pembayaran berhasil, credit user akan bertambah dan dapat digunakan untuk generate PRD.

API AI tidak perlu dibuat secara spesifik ke provider tertentu karena akan diatur sendiri nanti. Buat arsitektur AI service yang modular agar mudah diganti.

Deployment akan dilakukan di server sendiri, bukan Vercel.



2. Goals

Tujuan utama aplikasi:

1. User bisa membuat PRD dari ide produk.
2. User bisa menyimpan dan mengedit dokumen PRD.
3. User bisa export PRD ke Markdown dan PDF.
4. User bisa menggunakan credit untuk generate PRD.
5. User bisa membeli credit/plan melalui Pakasir.
6. Admin bisa memantau user, invoice, usage, dan credit.
7. Sistem backend siap dideploy di server sendiri.
8. Integrasi AI dibuat modular agar API AI bisa diatur manual nanti.



3. Target Users

3.1 Mahasiswa

Mahasiswa yang ingin membuat dokumentasi proyek aplikasi, proposal sistem, atau tugas akhir.

3.2 Founder Pemula

Orang yang punya ide startup tetapi belum bisa menuliskan requirement dengan jelas.

3.3 Freelancer Developer / Designer

Freelancer yang ingin mengubah brief client menjadi dokumen requirement yang rapi.

3.4 Product Manager Junior

User yang ingin mempercepat pembuatan PRD.



4. Core Features

4.1 Authentication

User dapat:

* Register
* Login
* Logout
* Melihat profile
* Mengakses dashboard setelah login

Role:

* USER
* ADMIN

User baru mendapatkan free credit default, misalnya 1 credit.



4.2 Landing Page

Landing page berisi:

* Hero section
* Penjelasan produk
* Cara kerja
* Contoh output PRD
* Pricing section
* CTA generate PRD
* FAQ

CTA utama:

Generate PRD
Try Free
View Example



4.3 Dashboard User

Dashboard menampilkan:

* Nama user
* Sisa credit
* Current plan/status
* Button Create New PRD
* Daftar PRD terbaru
* Daftar invoice/payment terbaru
* Empty state jika belum ada dokumen



4.4 Create PRD Flow

Flow utama:

Dashboard

Create New PRD

Input Product Idea

Choose Template

Answer Guided Questions

Generate PRD

Edit PRD

Save / Export



4.5 Input Product Idea

User mengisi:

* Product name
* Product idea / description
* Product type
* Output style
* Target usage

Product type:

SaaS
Marketplace
Mobile App
Web App
Internal Tool
E-commerce
Other

Output style:

Simple
Technical
Startup MVP
Academic
Product Manager Style

Target usage:

Startup
College Project
Client Project
Internal Team
Personal Idea



4.6 Template Selection

Template PRD yang tersedia:

1. Startup MVP PRD
2. Technical PRD
3. Academic Project PRD
4. SaaS PRD
5. Marketplace PRD
6. Mobile App PRD

Setiap template memiliki struktur section yang berbeda.

Default template: Startup MVP PRD.



4.7 Guided Questions

Sistem memberikan pertanyaan terpandu sebelum generate PRD.

Pertanyaan default:

1. Siapa target user utama produk ini?
2. Masalah utama apa yang ingin diselesaikan?
3. Solusi utama yang ditawarkan produk ini apa?
4. Fitur utama apa saja yang harus ada?
5. Platform produk ini apa?
6. Apa saja fitur yang masuk MVP?
7. Apa saja fitur yang belum masuk MVP?
8. Bagaimana indikator keberhasilan produk?
9. Apakah ada kompetitor atau referensi produk sejenis?
10. Apakah ada batasan teknis atau bisnis?

User boleh skip pertanyaan.

Jawaban user disimpan sebagai context untuk AI generation.



4.8 Generate PRD

Sistem menghasilkan PRD berdasarkan:

* Product name
* Product idea
* Product type
* Output style
* Selected template
* Guided answers
* User language preference

Output PRD minimal memiliki section:

1. Product Overview
2. Background
3. Problem Statement
4. Goals & Objectives
5. Target Users
6. User Personas
7. Core Features
8. User Flow
9. Functional Requirements
10. Non-Functional Requirements
11. MVP Scope
12. Out of Scope
13. Acceptance Criteria
14. Risks & Assumptions
15. Success Metrics
16. Future Enhancements

Output disimpan dalam format Markdown di database.



4.9 PRD Editor

User dapat:

* Melihat dokumen PRD
* Edit isi dokumen
* Save perubahan
* Copy Markdown
* Export Markdown
* Export PDF
* Rename document
* Delete document

Layout editor:

Left Sidebar: Document Outline
Center: Markdown Editor / Preview
Right Sidebar: AI Assistant Actions

Untuk MVP, editor cukup menggunakan Markdown editor.



4.10 AI Assistant Actions

Buat interface dan service untuk action berikut:

* Improve section
* Make section more technical
* Make section simpler
* Add user stories
* Add acceptance criteria
* Generate MVP scope
* Generate risks
* Regenerate full PRD
* Regenerate selected section

Catatan:

AI provider tidak perlu hardcoded. Buat abstract service:

interface AIProvider {
	  generatePRD(input: GeneratePRDInput): Promise<GeneratePRDOutput>
	    regenerateSection(input: RegenerateSectionInput): Promise<string>
	      improveSection(input: ImproveSectionInput): Promise<string>
	      }

	      Implementasi awal boleh mock/dummy, tetapi struktur harus siap diganti dengan API AI sebenarnya.



	      5. Credit & Usage System

	      5.1 Credit Rules

	      Default rule:

	      Generate PRD = 1 credit
	      Regenerate full PRD = 1 credit
	      Regenerate section = free untuk MVP, atau bisa dicatat usage-nya
	      Export Markdown = free
	      Export PDF = paid user only

	      User free:

	      1 free credit
	      Can generate 1 PRD
	      Can edit document
	      Can export Markdown
	      Cannot export PDF, or PDF has watermark

	      Paid user:

	      Can buy credit
	      Can export PDF
	      Can access paid templates
	      Can use AI assistant actions



	      5.2 Usage Log

	      Setiap aksi penting dicatat:

	      * Generate PRD
	      * Regenerate PRD
	      * Regenerate section
	      * Export PDF
	      * Payment success
	      * Manual credit adjustment

	      Data usage digunakan untuk audit, analytics, dan kontrol biaya AI.



	      6. Payment System  Pakasir

	      6.1 Payment Model

	      Gunakan sistem credit-based, bukan subscription otomatis.

	      User membeli paket credit. Setelah pembayaran berhasil, credit user bertambah.

	      Contoh paket placeholder:

	      Free: 1 credit
	      Starter: 10 credits
	      Pro: 30 credits
	      Business: 100 credits

	      Harga nanti bisa disesuaikan.



	      6.2 Payment Flow

	      User pilih paket

	      Backend membuat invoice pending

	      Backend membuat order_id unik

	      Backend generate payment URL Pakasir

	      User diarahkan ke halaman pembayaran Pakasir

	      User melakukan pembayaran

	      Pakasir mengirim webhook ke backend

	      Backend validasi order_id dan amount

	      Invoice menjadi PAID

	      Credit user bertambah



	      6.3 Invoice Status

	      Gunakan status:

	      PENDING
	      PAID
	      EXPIRED
	      FAILED
	      CANCELLED



	      6.4 Webhook Requirement

	      Endpoint webhook:

	      POST /api/webhooks/pakasir

	      Webhook harus:

	      1. Menerima payload dari Pakasir.
	      2. Mencari invoice berdasarkan order_id.
	      3. Memastikan invoice masih PENDING.
	      4. Memastikan amount sesuai.
	      5. Memastikan pembayaran valid.
	      6. Mengubah invoice menjadi PAID.
	      7. Menambah credit user sesuai plan.
	      8. Menyimpan payload webhook ke database.
	      9. Mencegah double processing jika webhook masuk lebih dari sekali.

	      Credit tidak boleh bertambah dari redirect frontend. Credit hanya bertambah dari webhook backend yang valid.



	      7. Admin Features

	      Admin dapat:

	      * Login sebagai admin
	      * Melihat total user
	      * Melihat daftar user
	      * Melihat daftar PRD
	      * Melihat daftar invoice
	      * Melihat status pembayaran
	      * Melihat usage logs
	      * Menambah credit manual
	      * Mengurangi credit manual
	      * Mengubah role user
	      * Menonaktifkan plan/template

	      Admin dashboard route:

	      /admin
	      /admin/users
	      /admin/invoices
	      /admin/documents
	      /admin/usage
	      /admin/templates



	      8. Tech Stack

	      Gunakan stack berikut:

	      Frontend

	      Next.js
	      TypeScript
	      Tailwind CSS
	      shadcn/ui
	      Lucide Icons

	      Backend

	      Next.js Route Handlers
	      Server Actions

	      Database

	      PostgreSQL

	      ORM

	      Prisma

	      Auth

	      Better Auth

	      Alternatif jika lebih mudah:

	      Custom auth dengan session/JWT

	      Tetapi prioritas gunakan Better Auth jika memungkinkan.

	      Payment

	      Pakasir

	      AI

	      Custom AI Provider Service

	      Jangan hardcode provider AI tertentu.

	      Export

	      Markdown export
	      PDF export menggunakan HTML-to-PDF / Puppeteer / Playwright

	      Deployment

	      Self-hosted server
	      Node.js runtime
	      Nginx reverse proxy
	      PM2 atau Docker
	      PostgreSQL server



	      9. Deployment Requirement

	      Karena aplikasi akan dideploy di server sendiri, siapkan:

	      9.1 Production Build

	      Aplikasi harus bisa dijalankan dengan:

	      npm run build
	      npm run start

	      atau via Docker:

	      docker compose up -d

	      9.2 Environment Variables

	      Gunakan .env untuk konfigurasi:

	      DATABASE_URL=
	      APP_URL=
	      NEXT_PUBLIC_APP_URL=
	      AUTH_SECRET=
	      PAKASIR_SLUG=
	      PAKASIR_API_KEY=
	      PAKASIR_WEBHOOK_SECRET=
	      AI_PROVIDER=
	      AI_API_KEY=
	      AI_BASE_URL=
	      AI_MODEL=
	      FREE_CREDIT_AMOUNT=1

	      AI env boleh disiapkan, tetapi implementasi provider AI dibuat modular.



	      9.3 Server Setup

	      Target server:

	      Ubuntu Server
	      Node.js
	      PostgreSQL
	      Nginx
	      PM2 or Docker
	      SSL via Certbot

	      Aplikasi harus kompatibel dengan reverse proxy Nginx.



	      10. Database Schema

	      Gunakan Prisma schema dengan model berikut.

	      10.1 User

	      model User {
	      	  id            String   @id @default(cuid())
	      	    name          String?
	      	      email         String   @unique
	      	        passwordHash  String?
	      	          role          Role     @default(USER)
	      	            credits       Int      @default(0)
	      	              createdAt     DateTime @default(now())
	      	                updatedAt     DateTime @updatedAt
	      	                  documents     PRDDocument[]
	      	                    invoices      Invoice[]
	      	                      usageLogs     UsageLog[]
	      	                      }

	      	                      10.2 Role

	      	                      enum Role {
	      	                      	  USER
	      	                      	    ADMIN
	      	                      	    }

	      	                      	    10.3 Plan

	      	                      	    model Plan {
	      	                      	    	  id           String   @id @default(cuid())
	      	                      	    	    name         String
	      	                      	    	      description  String?
	      	                      	    	        price        Int
	      	                      	    	          creditAmount Int
	      	                      	    	            features     Json?
	      	                      	    	              isActive     Boolean  @default(true)
	      	                      	    	                createdAt    DateTime @default(now())
	      	                      	    	                  updatedAt    DateTime @updatedAt
	      	                      	    	                    invoices     Invoice[]
	      	                      	    	                    }

	      	                      	    	                    10.4 Invoice

	      	                      	    	                    model Invoice {
	      	                      	    	                    	  id                String        @id @default(cuid())
	      	                      	    	                    	    userId            String
	      	                      	    	                    	      planId            String
	      	                      	    	                    	        orderId           String        @unique
	      	                      	    	                    	          amount            Int
	      	                      	    	                    	            status            InvoiceStatus @default(PENDING)
	      	                      	    	                    	              paymentProvider   String        @default("PAKASIR")
	      	                      	    	                    	                paymentMethod     String?
	      	                      	    	                    	                  paymentUrl        String?
	      	                      	    	                    	                    providerReference String?
	      	                      	    	                    	                      paidAt            DateTime?
	      	                      	    	                    	                        expiredAt         DateTime?
	      	                      	    	                    	                          createdAt         DateTime      @default(now())
	      	                      	    	                    	                            updatedAt         DateTime      @updatedAt
	      	                      	    	                    	                              user              User          @relation(fields: [userId], references: [id])
	      	                      	    	                    	                                plan              Plan          @relation(fields: [planId], references: [id])
	      	                      	    	                    	                                }

	      	                      	    	                    	                                10.5 Invoice Status

	      	                      	    	                    	                                enum InvoiceStatus {
	      	                      	    	                    	                                	  PENDING
	      	                      	    	                    	                                	    PAID
	      	                      	    	                    	                                	      EXPIRED
	      	                      	    	                    	                                	        FAILED
	      	                      	    	                    	                                	          CANCELLED
	      	                      	    	                    	                                	          }

	      	                      	    	                    	                                	          10.6 PRDDocument

	      	                      	    	                    	                                	          model PRDDocument {
	      	                      	    	                    	                                	          	  id           String         @id @default(cuid())
	      	                      	    	                    	                                	          	    userId       String
	      	                      	    	                    	                                	          	      title        String
	      	                      	    	                    	                                	          	        productName  String?
	      	                      	    	                    	                                	          	          productType  String?
	      	                      	    	                    	                                	          	            outputStyle  String?
	      	                      	    	                    	                                	          	              templateId   String?
	      	                      	    	                    	                                	          	                status       DocumentStatus @default(DRAFT)
	      	                      	    	                    	                                	          	                  content      String
	      	                      	    	                    	                                	          	                    metadata     Json?
	      	                      	    	                    	                                	          	                      createdAt    DateTime       @default(now())
	      	                      	    	                    	                                	          	                        updatedAt    DateTime       @updatedAt
	      	                      	    	                    	                                	          	                          user         User           @relation(fields: [userId], references: [id])
	      	                      	    	                    	                                	          	                            inputs       PRDInput?
	      	                      	    	                    	                                	          	                              usageLogs    UsageLog[]
	      	                      	    	                    	                                	          	                              }

	      	                      	    	                    	                                	          	                              10.7 Document Status

	      	                      	    	                    	                                	          	                              enum DocumentStatus {
	      	                      	    	                    	                                	          	                              	  DRAFT
	      	                      	    	                    	                                	          	                              	    GENERATED
	      	                      	    	                    	                                	          	                              	      ARCHIVED
	      	                      	    	                    	                                	          	                              	      }

	      	                      	    	                    	                                	          	                              	      10.8 PRDInput

	      	                      	    	                    	                                	          	                              	      model PRDInput {
	      	                      	    	                    	                                	          	                              	      	  id            String   @id @default(cuid())
	      	                      	    	                    	                                	          	                              	      	    documentId    String   @unique
	      	                      	    	                    	                                	          	                              	      	      idea          String
	      	                      	    	                    	                                	          	                              	      	        productType   String?
	      	                      	    	                    	                                	          	                              	      	          outputStyle   String?
	      	                      	    	                    	                                	          	                              	      	            targetUsage   String?
	      	                      	    	                    	                                	          	                              	      	              answers       Json?
	      	                      	    	                    	                                	          	                              	      	                createdAt     DateTime @default(now())
	      	                      	    	                    	                                	          	                              	      	                  updatedAt     DateTime @updatedAt
	      	                      	    	                    	                                	          	                              	      	                    document      PRDDocument @relation(fields: [documentId], references: [id])
	      	                      	    	                    	                                	          	                              	      	                    }

	      	                      	    	                    	                                	          	                              	      	                    10.9 Template

	      	                      	    	                    	                                	          	                              	      	                    model Template {
	      	                      	    	                    	                                	          	                              	      	                    	  id          String   @id @default(cuid())
	      	                      	    	                    	                                	          	                              	      	                    	    name        String
	      	                      	    	                    	                                	          	                              	      	                    	      slug        String   @unique
	      	                      	    	                    	                                	          	                              	      	                    	        description String?
	      	                      	    	                    	                                	          	                              	      	                    	          structure   Json
	      	                      	    	                    	                                	          	                              	      	                    	            isPremium   Boolean  @default(false)
	      	                      	    	                    	                                	          	                              	      	                    	              isActive    Boolean  @default(true)
	      	                      	    	                    	                                	          	                              	      	                    	                createdAt   DateTime @default(now())
	      	                      	    	                    	                                	          	                              	      	                    	                  updatedAt   DateTime @updatedAt
	      	                      	    	                    	                                	          	                              	      	                    	                  }

	      	                      	    	                    	                                	          	                              	      	                    	                  10.10 UsageLog

	      	                      	    	                    	                                	          	                              	      	                    	                  model UsageLog {
	      	                      	    	                    	                                	          	                              	      	                    	                  	  id             String   @id @default(cuid())
	      	                      	    	                    	                                	          	                              	      	                    	                  	    userId         String
	      	                      	    	                    	                                	          	                              	      	                    	                  	      documentId     String?
	      	                      	    	                    	                                	          	                              	      	                    	                  	        action         String
	      	                      	    	                    	                                	          	                              	      	                    	                  	          creditUsed     Int      @default(0)
	      	                      	    	                    	                                	          	                              	      	                    	                  	            aiProvider     String?
	      	                      	    	                    	                                	          	                              	      	                    	                  	              aiModel        String?
	      	                      	    	                    	                                	          	                              	      	                    	                  	                tokenInput     Int?
	      	                      	    	                    	                                	          	                              	      	                    	                  	                  tokenOutput    Int?
	      	                      	    	                    	                                	          	                              	      	                    	                  	                    metadata       Json?
	      	                      	    	                    	                                	          	                              	      	                    	                  	                      createdAt      DateTime @default(now())
	      	                      	    	                    	                                	          	                              	      	                    	                  	                        user           User     @relation(fields: [userId], references: [id])
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          document       PRDDocument? @relation(fields: [documentId], references: [id])
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          }

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          10.11 PaymentWebhookLog

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          model PaymentWebhookLog {
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	  id          String   @id @default(cuid())
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	    provider    String
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	      orderId     String?
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	        payload     Json
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	          status      String
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	            processedAt DateTime?
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              createdAt   DateTime @default(now())
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              }



	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              11. API Routes

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              11.1 Auth

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              POST /api/auth/register
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              POST /api/auth/login
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              POST /api/auth/logout
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              GET  /api/auth/me

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              11.2 PRD

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              POST   /api/prd
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              GET    /api/prd
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              GET    /api/prd/:id
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              PUT    /api/prd/:id
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              DELETE /api/prd/:id
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              POST /api/prd/:id/generate
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              POST /api/prd/:id/regenerate
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              POST /api/prd/:id/regenerate-section
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              POST /api/prd/:id/improve-section

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              11.3 Export

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              GET /api/prd/:id/export/markdown
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              GET /api/prd/:id/export/pdf

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              11.4 Templates

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              GET /api/templates
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              GET /api/templates/:slug

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              11.5 Billing

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              GET  /api/billing/summary
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              GET  /api/billing/invoices
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              POST /api/billing/checkout
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              GET  /api/billing/invoices/:orderId

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              11.6 Webhook

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              POST /api/webhooks/pakasir

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              11.7 Admin

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              GET  /api/admin/stats
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              GET  /api/admin/users
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              GET  /api/admin/users/:id
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              POST /api/admin/users/:id/add-credit
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              POST /api/admin/users/:id/reduce-credit
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              GET  /api/admin/invoices
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              GET  /api/admin/documents
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              GET  /api/admin/usage
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              GET  /api/admin/templates
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              POST /api/admin/templates
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              PUT  /api/admin/templates/:id



	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              12. Pages

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              12.1 Public Pages

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	              /
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	               /pricing
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                /login
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 /register

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 12.2 User Pages

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 /dashboard
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 /dashboard/prd/new
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 /dashboard/prd/[id]
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 /dashboard/billing
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 /dashboard/settings

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 12.3 Admin Pages

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 /admin
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 /admin/users
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 /admin/invoices
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 /admin/documents
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 /admin/usage
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 /admin/templates



	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 13. UI Requirements

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 13.1 Visual Style

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Gunakan desain modern SaaS:

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Clean
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Minimal
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Rounded cards
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Soft border
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Readable typography
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Light mode first
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Dark mode optional

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Rekomendasi:

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Tailwind CSS
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 shadcn/ui
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Lucide Icons

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 13.2 Layout

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Dashboard:

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Sidebar kiri
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Main content tengah
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Top bar
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Cards untuk stats dan recent documents

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 PRD Editor:

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Left: outline dokumen
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Center: markdown editor dan preview
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Right: AI assistant actions

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Mobile:

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Step-by-step layout
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 No 3-column layout on mobile



	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 14. Prompt Structure for AI Service

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Buat prompt internal untuk generate PRD seperti berikut.

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 14.1 Generate PRD Prompt

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 You are an expert product manager.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Create a complete Product Requirements Document based on the following product idea and user answers.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Output language: Indonesian.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Output format: Markdown.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Tone: clear, structured, professional, easy to understand.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Product Name:
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 {{productName}}
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Product Idea:
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 {{idea}}
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Product Type:
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 {{productType}}
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Output Style:
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 {{outputStyle}}
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Target Usage:
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 {{targetUsage}}
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Selected Template:
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 {{templateName}}
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 User Answers:
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 {{answers}}
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 The PRD must include:
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 1. Product Overview
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 2. Background
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 3. Problem Statement
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 4. Goals & Objectives
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 5. Target Users
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 6. User Personas
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 7. Core Features
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 8. User Flow
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 9. Functional Requirements
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 10. Non-Functional Requirements
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 11. MVP Scope
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 12. Out of Scope
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 13. Acceptance Criteria
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 14. Risks & Assumptions
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 15. Success Metrics
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 16. Future Enhancements
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Make the output detailed but not too verbose.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Use headings, bullet points, and tables when useful.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Do not invent fake market data.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 If information is missing, make reasonable assumptions and label them as assumptions.



	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 14.2 Regenerate Section Prompt

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 You are an expert product manager.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Rewrite and improve the selected PRD section.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Document Context:
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 {{documentContext}}
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Selected Section Title:
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 {{sectionTitle}}
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Selected Section Content:
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 {{sectionContent}}
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Instruction:
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 {{instruction}}
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Output language: Indonesian.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Output only the improved section content in Markdown.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Do not rewrite the entire PRD.



	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 14.3 Improve Section Prompt

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 You are an expert product manager and technical writer.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Improve the following PRD section to make it clearer, more actionable, and more useful for a development team.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Section Title:
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 {{sectionTitle}}
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Section Content:
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 {{sectionContent}}
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Improvement Type:
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 {{improvementType}}
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Output language: Indonesian.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Return only the improved Markdown section.



	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 15. Business Rules

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 1. User harus login untuk menyimpan PRD.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 2. User harus punya credit untuk generate PRD.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 3. Generate PRD mengurangi credit hanya jika berhasil.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 4. Jika AI generation gagal, credit tidak berkurang.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 5. User hanya bisa melihat dokumennya sendiri.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 6. Admin bisa melihat semua data.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 7. Paid user bisa export PDF.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 8. Free user bisa export Markdown.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 9. Webhook Pakasir harus idempotent.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 10. Invoice yang sudah paid tidak boleh diproses ulang.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 11. Credit hanya bertambah setelah webhook valid.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 12. API AI harus modular dan tidak dikunci ke satu provider.



	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 16. Error Handling

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 16.1 AI Error

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Jika AI gagal:

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Gagal generate PRD. Silakan coba lagi.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Credit kamu tidak dikurangi.

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 16.2 No Credit

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Jika credit habis:

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Credit kamu habis. Silakan upgrade untuk melanjutkan generate PRD.

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 16.3 Payment Pending

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Jika pembayaran belum selesai:

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Pembayaran masih menunggu konfirmasi.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Silakan selesaikan pembayaran atau cek kembali beberapa saat lagi.

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 16.4 Payment Failed

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Jika pembayaran gagal:

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Pembayaran gagal atau expired. Silakan buat transaksi baru.

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 16.5 Unauthorized

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Jika belum login:

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 Silakan login terlebih dahulu.



	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 17. Acceptance Criteria

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 17.1 Auth

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * User bisa register.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * User bisa login.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * User bisa logout.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * User baru mendapat free credit.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * Admin dan user biasa memiliki akses berbeda.

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 17.2 Dashboard

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * User bisa melihat sisa credit.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * User bisa melihat dokumen terbaru.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * User bisa membuka dokumen lama.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * User bisa membuat dokumen baru.

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 17.3 Generate PRD

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * User bisa input ide produk.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * User bisa memilih template.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * User bisa menjawab guided questions.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * User bisa generate PRD.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * PRD tersimpan di database.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * Credit berkurang setelah generate sukses.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * Credit tidak berkurang jika generate gagal.

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 17.4 Editor

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * User bisa mengedit PRD.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * User bisa menyimpan perubahan.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * User bisa copy Markdown.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * User bisa export Markdown.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * Paid user bisa export PDF.

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 17.5 Billing

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * User bisa melihat paket credit.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * User bisa membuat invoice.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * User bisa diarahkan ke Pakasir.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * Sistem bisa menerima webhook Pakasir.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * Credit bertambah setelah pembayaran valid.

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 17.6 Admin

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * Admin bisa melihat user.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * Admin bisa melihat invoice.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * Admin bisa melihat usage.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * Admin bisa menambah/mengurangi credit user.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * User biasa tidak bisa membuka halaman admin.

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 17.7 Deployment

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * Project bisa dijalankan di server sendiri.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * Project bisa dijalankan dengan Node.js production mode.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * Project bisa dijalankan via Docker Compose.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 * Environment variable bisa dikonfigurasi tanpa mengubah source code.



	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 18. Recommended Folder Structure

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                 prd-generator-saas/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                  app/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                      page.tsx
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                          pricing/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                 page.tsx
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                     login/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                            page.tsx
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                register/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                       page.tsx

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                              dashboard/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                     page.tsx
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                            billing/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                      page.tsx
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                             settings/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                       page.tsx
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                              prd/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                         new/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                       page.tsx
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                  [id]/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                 page.tsx

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                        admin/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                               page.tsx
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                      users/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                page.tsx
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                       invoices/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                 page.tsx
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                        documents/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                  page.tsx
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                         usage/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                   page.tsx
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                          templates/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                     page.tsx

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                            api/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                    prd/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                            billing/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                    webhooks/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                               pakasir/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                       templates/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                               admin/

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                components/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                    ui/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                        marketing/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                            dashboard/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                prd/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                    billing/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                        admin/

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                         lib/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                             db.ts
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                 auth.ts
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                     permissions.ts
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                         ai/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                ai-provider.ts
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                       mock-provider.ts
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                              prompts.ts
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                  payment/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                         pakasir.ts
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                             export/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                    markdown.ts
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                           pdf.ts
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                               usage.ts

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                prisma/
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                    schema.prisma
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                        seed.ts

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                         docker-compose.yml
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                          Dockerfile
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                           .env.example
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            README.md



	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            19. Docker Requirement

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            Buat Dockerfile untuk Next.js production.

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            Buat docker-compose.yml minimal berisi:

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            app
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            postgres

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            Optional:

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            nginx

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            Jika Nginx tidak dimasukkan ke compose, jelaskan di README cara setup reverse proxy manual.



	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            20. README Requirement

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            README harus berisi:

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            1. Project description
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            2. Tech stack
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            3. Setup lokal
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            4. Setup environment variable
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            5. Database migration
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            6. Seed template/plan
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            7. Run development
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            8. Build production
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            9. Docker deployment
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            10. Pakasir webhook setup
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            11. Admin account setup



	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            21. MVP Priority

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            Must Have

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * Landing page
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * Register/login
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * Dashboard
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * Create PRD
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * Guided questions
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * Generate PRD
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * Edit PRD
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * Save PRD
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * Export Markdown
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * Export PDF
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * Credit system
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * Pricing page
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * Pakasir checkout
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * Pakasir webhook
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * Billing page
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * Admin dashboard
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * Self-host deployment support

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            Should Have

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * AI assistant sidebar
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * Regenerate section
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * Template management
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * Usage logs
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * Manual credit adjustment

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            Could Have

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * DOCX export
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * PRD score
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * Generate backlog
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * Share public link
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * Team workspace

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            Wont Have in MVP

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * Recurring subscription
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * Real-time collaboration
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * Jira integration
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * Trello integration
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * Mobile app
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            * Multi-tenant organization billing



	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            22. Final Product Flow

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            User buka landing page

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            User klik Generate PRD

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            User register/login

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            User masuk dashboard

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            User klik Create New PRD

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            User input ide produk

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            User pilih template

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            User jawab guided questions

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            Sistem cek credit

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            Sistem generate PRD menggunakan AI service

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            Credit berkurang jika sukses

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            PRD tersimpan

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            User edit dokumen

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            User export Markdown/PDF

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            Jika credit habis, user beli credit via Pakasir



	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            23. Instruction for AI Coding Agent

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            Build this as a production-ready MVP SaaS app.

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            Important implementation notes:

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            1. Use Next.js, TypeScript, Tailwind CSS, shadcn/ui, Prisma, PostgreSQL.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            2. Use Better Auth or a secure custom auth implementation.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            3. Use Pakasir for payment integration.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            4. Do not hardcode AI provider. Create modular AI provider service.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            5. Add mock AI provider first if real AI key is not available.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            6. Make app deployable to self-hosted server.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            7. Include Dockerfile and docker-compose.yml.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            8. Include .env.example.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            9. Include Prisma schema and seed file.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            10. Include admin dashboard.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            11. Protect all user-specific routes.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            12. Make webhook idempotent.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            13. Do not add credit from frontend redirect.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            14. Add credit only after valid backend webhook.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            15. Keep UI clean, modern, and SaaS-like.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            16. Use Indonesian language for main UI copy.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            17. Make the MVP usable end-to-end.

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            Final expected result:

	      	                      	    	                    	                                	          	                              	      	                    	                  	                          	                                                                                                                                                                                                                                                                                                                                                                                                                                            A working SaaS MVP where a user can register, create a PRD with AI, edit it, export it, buy credit through Pakasir, and manage documents from a dashboard.
	      	                      	    	                    	                                	          	                              	      	                    	                  	                          }
	      	                      	    	                    	                                	          	                              	      	                    	                  }
	      	                      	    	                    	                                	          	                              	      	                    }
	      	                      	    	                    	                                	          	                              	      }
	      	                      	    	                    	                                	          	                              }
	      	                      	    	                    	                                	          }
	      	                      	    	                    	                                }
	      	                      	    	                    }
	      	                      	    }
	      	                      }
	      }
}
