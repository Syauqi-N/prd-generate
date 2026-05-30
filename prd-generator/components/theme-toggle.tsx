"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <button className="glass flex h-9 w-9 items-center justify-center rounded-xl">
        <Moon className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
      </button>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="glass flex h-9 w-9 items-center justify-center rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <Sun className="h-4 w-4" style={{ color: "var(--accent)" }} />
      ) : (
        <Moon className="h-4 w-4" style={{ color: "var(--accent)" }} />
      )}
    </button>
  )
}
