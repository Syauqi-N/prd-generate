"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface ThemeLogoProps {
  height?: number
  width?: number
  className?: string
}

export function ThemeLogo({ height = 28, width = 28, className = "" }: ThemeLogoProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // Before mount, show black logo (light mode default)
  const src = mounted && resolvedTheme === "dark" ? "/logo-white.png" : "/logo-black.png"

  return (
    <Image
      src={src}
      alt="PRD Generator"
      width={width}
      height={height}
      className={className}
      priority
    />
  )
}
