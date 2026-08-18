import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex h-full flex-col gap-6 rounded-lg border border-border bg-card py-6 text-card-foreground",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 px-6", className)}
      {...props}
    />
  )
}

type CardTitleElement = "h2" | "h3" | "h4"

function CardTitle({
  as: Tag = "h3",
  className,
  ...props
}: React.ComponentPropsWithoutRef<"h3"> & { as?: CardTitleElement }) {
  const Comp = Tag as React.ElementType

  return (
    <Comp
      data-slot="card-title"
      className={cn("font-display text-lg font-semibold text-card-foreground", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentPropsWithoutRef<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div data-slot="card-content" className={cn("px-6", className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("mt-auto flex items-center gap-3 px-6", className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
