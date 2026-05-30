import * as React from "react"
import { cn } from "@/lib/utils"

const Badge = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
}>(
  ({ className, variant = "default", style, ...props }, ref) => {
    const variantStyles: Record<string, React.CSSProperties> = {
      default:     { background: "var(--gradient-subtle)", color: "var(--accent)", border: "1px solid rgba(99,102,241,0.25)" },
      secondary:   { backgroundColor: "var(--hover-bg)", color: "var(--text-secondary)", border: "1px solid var(--border-color)" },
      destructive: { backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" },
      outline:     { backgroundColor: "transparent", color: "var(--text-muted)", border: "1px solid var(--border-color)" },
      success:     { backgroundColor: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.25)" },
      warning:     { backgroundColor: "rgba(234,179,8,0.1)", color: "#ca8a04", border: "1px solid rgba(234,179,8,0.2)" },
    }
    return (
      <span
        ref={ref}
        className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm", className)}
        style={{ ...variantStyles[variant], ...style }}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }
