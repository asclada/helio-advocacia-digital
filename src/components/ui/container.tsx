import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const containerVariants = cva("mx-auto w-full px-4 sm:px-6 lg:px-8", {
  variants: {
    size: {
      default: "max-w-7xl",
      narrow: "max-w-3xl",
      wide: "max-w-[90rem]",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

type ContainerElement = "div" | "header" | "main" | "footer"

interface ContainerProps
  extends React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof containerVariants> {
  as?: ContainerElement
}

function Container({
  as: Tag = "div",
  size = "default",
  className,
  ...props
}: ContainerProps) {
  const Comp = Tag as React.ElementType

  return (
    <Comp
      data-slot="container"
      className={cn(containerVariants({ size, className }))}
      {...props}
    />
  )
}

export { Container, containerVariants }
