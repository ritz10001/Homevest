import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-base font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-300 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary-500 text-white hover:bg-primary-600",
        outline: "border-2 border-primary-600 text-primary-600 bg-transparent hover:bg-primary-50",
        ghost: "hover:bg-primary-100 text-primary-700",
        link: "text-primary-600 underline-offset-4 hover:underline",
        hero: "bg-gradient-hero text-primary-foreground shadow-glow hover:shadow-xl hover:scale-105",
        "hero-outline": "border-2 border-primary-500 text-primary-600 bg-transparent hover:bg-primary-50 hover:scale-105",
        gold: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 shadow-lg",
      },
      size: {
        default: "h-12 px-8 py-4",
        sm: "h-10 px-4 py-2 text-sm",
        lg: "h-14 px-10 py-5 text-lg",
        xl: "h-16 px-12 py-6 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
