import { cn } from "@/lib/utils"

const badgeClassName =
  "inline-flex items-center rounded-full border border-gold bg-gold/5 px-3 py-1 text-xs font-medium text-gold-light"

function Badge({ className, ...props }: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeClassName, className)}
      {...props}
    />
  )
}

export { Badge }
