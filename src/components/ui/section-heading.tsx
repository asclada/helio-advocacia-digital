import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  eyebrow: string
  title: string
  align?: "center" | "left"
  /**
   * Nível do heading renderizado — `"h2"` (default) para seções da Home,
   * `"h1"` para o título principal de uma página dedicada (Fase 4.5,
   * docs/specs/fase4-5-paginas-dedicadas.md). Mesmo padrão de troca de
   * elemento via prop já usado no `CardTitle` (`ui/card.tsx`).
   */
  as?: "h1" | "h2"
  className?: string
}

/**
 * Cabeçalho de seção (eyebrow pequeno + título grande), padrão extraído
 * do site atual (heliokleisonadvocacia.com.br) e confirmado pelo Lucas
 * como modelo a repetir nas próximas seções da Home (Sobre, Contato —
 * Fase 4.3/4.4). `align="left"` serve os layouts assimétricos de 2
 * colunas (ex: Sobre, foto + texto) — a largura vem da coluna do grid
 * pai, não de um `max-w-2xl` próprio. Sem estado/variantes de lógica —
 * mesma categoria de "conteúdo estático puro" que Hero/AreasAtuacao usam
 * (docs/specs/fase4-2-areas-atuacao.md, seção 6).
 */
function SectionHeading({
  eyebrow,
  title,
  align = "center",
  as: Tag = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center"
          ? "mx-auto max-w-2xl items-center text-center"
          : "items-start text-left",
        className
      )}
    >
      <p className="text-xs uppercase tracking-[0.3em] text-gold">
        {eyebrow}
      </p>
      <Tag className="font-display text-2xl font-medium text-balance text-foreground sm:text-3xl">
        {title}
      </Tag>
    </div>
  )
}

export { SectionHeading }
