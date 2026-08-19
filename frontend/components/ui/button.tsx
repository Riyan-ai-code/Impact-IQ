import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'brand' | 'brandOutline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const variants = {
      default: "bg-[#FF8066] hover:bg-[#ff6c4a] dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white shadow-xs transition-all",
      destructive: "bg-[#C34A36] text-white hover:opacity-90 shadow-xs",
      outline: "border border-[var(--border-color)] bg-[var(--surface-1)] text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-colors",
      secondary: "bg-[var(--surface-2)] text-[var(--text-primary)] hover:bg-[var(--surface-3)] transition-colors",
      ghost: "hover:bg-[var(--surface-2)] text-[var(--text-primary)] transition-colors",
      link: "text-[#FF8066] dark:text-indigo-400 underline-offset-4 hover:underline",
      brand: "bg-[#FF8066] hover:bg-[#ff6c4a] dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white shadow-xs transition-all",
      brandOutline: "border border-[#FF8066]/30 bg-transparent text-[#FF8066] dark:text-indigo-400 hover:bg-[#FF8066]/10 transition-colors"
    }

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10"
    }

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
