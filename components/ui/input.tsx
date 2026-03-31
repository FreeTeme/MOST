import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  variant = "default",
  ...props
}: React.ComponentProps<"input"> & { variant?: "default" | "pill" }) {
  return (
    <input
      type={type}
      data-slot="input"
      data-variant={variant}
      className={cn(
        variant === "pill"
          ? "app-pill-input file:text-foreground selection:bg-primary selection:text-primary-foreground w-full min-w-0 py-2 text-base shadow-none md:text-sm"
          : "app-field file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground w-full min-w-0 px-[var(--space-3)] py-2 text-base shadow-none md:text-sm",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/30",
        className
      )}
      {...props}
    />
  )
}

export { Input }
