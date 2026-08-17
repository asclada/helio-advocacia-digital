import { cva, type VariantProps } from "class-variance-authority"

import { Container, containerVariants } from "@/components/ui/container"
import { cn } from "@/lib/utils"

const sectionVariants = cva("", {
  variants: {
    spacing: {
      compact: "py-8 md:py-12",
      default: "py-16 md:py-24",
      spacious: "py-24 md:py-32",
    },
  },
  defaultVariants: {
    spacing: "default",
  },
})

type SectionElement = "section" | "div"
type ContainerSize = VariantProps<typeof containerVariants>["size"]

interface SectionProps
  extends React.ComponentPropsWithoutRef<"section">,
    VariantProps<typeof sectionVariants> {
  as?: SectionElement
  container?: boolean
  containerSize?: ContainerSize
}

function Section({
  as: Tag = "section",
  spacing = "default",
  container = true,
  containerSize,
  className,
  children,
  ...props
}: SectionProps) {
  const Comp = Tag as React.ElementType

  return (
    <Comp
      data-slot="section"
      className={cn(sectionVariants({ spacing }), className)}
      {...props}
    >
      {container ? (
        <Container size={containerSize}>{children}</Container>
      ) : (
        children
      )}
    </Comp>
  )
}

export { Section, sectionVariants }
