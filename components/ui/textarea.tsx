import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"textarea"> & { variant?: "default" | "pill" }) {
  return (
    <textarea
      data-slot="textarea"
      data-variant={variant}
      className={cn(
        variant === "pill"
          ? "app-pill-input flex min-h-[5rem] w-full resize-y py-[var(--space-3)] text-base shadow-none md:text-sm"
          : "app-field placeholder:text-muted-foreground flex min-h-[5rem] w-full resize-y px-[var(--space-3)] py-[var(--space-3)] text-base shadow-none md:text-sm",
        "disabled:pointer-events-none disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/25",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
