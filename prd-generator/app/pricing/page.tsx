import Link from "next/link"
import { Navbar } from "@/components/marketing/navbar"
import { Footer } from "@/components/marketing/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "Gratis",
    priceNote: "Selamanya",
    credits: 1,
    features: ["1 credit", "Generate 1 PRD", "Export Markdown", "Template gratis"],
    notIncluded: ["Export PDF", "AI Assistant", "Premium Templates"],
    highlight: false,
    cta: "Mulai Gratis",
  },
  {
    name: "Starter",
    price: "Rp 29.000",
    priceNote: "10 credits",
    credits: 10,
    features: ["10 credits", "Generate 10 PRD", "Export Markdown & PDF", "AI Assistant", "Template gratis"],
    notIncluded: ["Premium Templates"],
    highlight: false,
    cta: "Beli Starter",
  },
  {
    name: "Pro",
    price: "Rp 79.000",
    priceNote: "30 credits",
    credits: 30,
    features: ["30 credits", "Generate 30 PRD", "Export Markdown & PDF", "AI Assistant", "Semua Template", "Premium Templates"],
    notIncluded: [],
    highlight: true,
    cta: "Beli Pro",
  },
  {
    name: "Business",
    price: "Rp 199.000",
    priceNote: "100 credits",
    credits: 100,
    features: ["100 credits", "Generate 100 PRD", "Export Markdown & PDF", "AI Assistant", "Semua Template", "Premium Templates", "Priority Support"],
    notIncluded: [],
    highlight: false,
    cta: "Beli Business",
  },
]

const faqs = [
  { q: "Apakah credit expired?", a: "Tidak. Credit yang kamu beli tidak akan expired dan bisa digunakan kapan saja." },
  { q: "Bisa refund?", a: "Credit yang sudah dibeli tidak bisa di-refund. Pastikan kamu memilih paket yang sesuai." },
  { q: "Metode pembayaran apa yang tersedia?", a: "Pembayaran melalui Pakasir yang mendukung transfer bank, e-wallet, dan QRIS." },
  { q: "Apakah ada diskon untuk pembelian banyak?", a: "Paket Business sudah memberikan harga terbaik per credit. Hubungi kami untuk kebutuhan enterprise." },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="bg-gradient-to-b from-indigo-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-bold text-gray-900">Harga Transparan</h1>
          <p className="mt-4 text-lg text-gray-600">
            Beli credit sesuai kebutuhan. Tidak ada langganan bulanan, tidak ada biaya tersembunyi.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <Card key={plan.name} className={plan.highlight ? "border-indigo-500 ring-2 ring-indigo-200 relative" : ""}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="default">Paling Populer</Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="ml-2 text-sm text-gray-500">/ {plan.priceNote}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="mb-6 space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                        {f}
                      </li>
                    ))}
                    {plan.notIncluded.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-400 line-through">
                        <CheckCircle className="h-4 w-4 shrink-0 text-gray-300" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/register">
                    <Button className="w-full" variant={plan.highlight ? "default" : "outline"}>
                      {plan.cta} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">Pertanyaan tentang Harga</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-gray-200 bg-white">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 font-medium text-gray-900">
                  {faq.q}
                </summary>
                <div className="px-6 pb-4 text-sm text-gray-600">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
