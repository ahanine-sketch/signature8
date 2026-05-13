"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "rounded-xl bg-primary text-primary-foreground font-body uppercase tracking-[0.15em] text-[0.85rem] font-bold py-6 px-10 hover:bg-primary-container",
        outline: "border-border bg-background hover:bg-muted hover:text-foreground",
        secondary: "bg-transparent text-primary font-body uppercase tracking-[0.15em] text-[0.85rem] font-bold border-b-2 border-primary hover:text-primary-container hover:border-primary-container",
        ghost: "hover:bg-muted hover:text-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-8",
        sm: "h-9 rounded-lg px-6",
        lg: "h-14 rounded-2xl px-12",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
