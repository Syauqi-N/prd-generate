import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth/auth-provider"
import { ToastContextProvider } from "@/components/ui/use-toast"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PRD Generator - Buat PRD Otomatis dengan AI",
  description: "Ubah ide produkmu menjadi dokumen Product Requirements Document yang lengkap dan profesional dalam hitungan menit menggunakan AI.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthProvider>
            <ToastContextProvider>
              {children}
            </ToastContextProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
