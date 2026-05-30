import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:     "btn-gradient text-white",
        destructive: "bg-red-500 text-white hover:bg-red-600 transition-colors",
        outline:     "glass border transition-all hover:-translate-y-0.5",
        secondary:   "transition-all hover:-translate-y-0.5",
        ghost:       "transition-colors",
        link:        "underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm:      "h-8 rounded-lg px-3 text-xs",
        lg:      "h-12 rounded-xl px-8 text-base",
        icon:    "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const variantStyles: Record<string, React.CSSProperties> = {
  default:     {},
  outline:     { color: "var(--text-primary)" },
  secondary:   { backgroundColor: "var(--hover-bg)", color: "var(--accent)" },
  ghost:       { backgroundColor: "transparent", color: "var(--text-muted)" },
  link:        { backgroundColor: "transparent", color: "var(--accent)" },
  destructive: {},
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size, asChild = false, style, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        style={{ ...variantStyles[variant || "default"], ...style }}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
