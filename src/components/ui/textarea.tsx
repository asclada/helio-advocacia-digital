import { cn } from "@/lib/utils"

const textareaClassName =
  "flex min-h-24 w-full min-w-0 rounded-lg border border-muted-foreground bg-transparent px-3 py-2 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 disabled:pointer-events-none disabled:opacity-50"

function Textarea({ className, ...props }: React.ComponentPropsWithoutRef<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaClassName, className)}
      {...props}
    />
  )
}

export { Textarea }
