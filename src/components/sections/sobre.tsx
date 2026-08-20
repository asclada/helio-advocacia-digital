import { Globe, Landmark, Scale } from "lucide-react"
import Image from "next/image"

import { Section } from "@/components/ui/section"
import { SectionHeading } from "@/components/ui/section-heading"

const CREDENCIAIS = [
  { icon: Scale, label: "OAB/RN", value: "20.357" },
  { icon: Landmark, label: "Foco", value: "Direito Bancário" },
  { icon: Globe, label: "Atendimento", value: "Natal/RN + Online" },
]

interface SobreContentProps {
  /**
   * `"h2"` (default) para a seção resumida da Home; `"h1"` quando este
   * conteúdo é o assunto principal de uma página dedicada (Fase 4.5,
   * docs/specs/fase4-5-paginas-dedicadas.md) — repassado direto pro
   * `SectionHeading`.
   */
  headingLevel?: "h1" | "h2"
}

/**
 * Só o conteúdo (foto + texto + credenciais), sem `Section`/`id`/
 * `border-t` — mesmo raciocínio de `AreasAtuacaoContent`
 * (`sections/areas-atuacao.tsx`): a Home e a página dedicada
 * (`src/app/sobre/page.tsx`) decidem o próprio wrapper, sem duplicar a
 * copy entre os dois lugares.
 */
function SobreContent({ headingLevel = "h2" }: SobreContentProps) {
  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-[7fr_13fr] md:items-center">
      <Image
        src="/images/dr-helio-sobre.png"
        alt="Advogado Helio Kleison"
        width={976}
        height={918}
        className="mx-auto aspect-square w-full max-w-[22rem] rounded-full object-cover"
      />

      <div className="flex flex-col gap-6">
        <SectionHeading
          as={headingLevel}
          eyebrow="Sobre o Advogado"
          title="Dr. Helio Kleison"
          align="left"
        />

        <p className="text-muted-foreground">
          Advogado inscrito na{" "}
          <span className="text-gold-light">OAB/RN sob o nº 20.357</span>,
          com atuação dedicada ao Direito Bancário — uma área que exige
          rigor técnico para enfrentar instituições financeiras e buscar
          equilíbrio em contratos desiguais.
        </p>
        <p className="text-muted-foreground">
          Atende de forma presencial em Natal/RN e, para clientes de todo
          o Brasil, oferece consultoria e acompanhamento processual 100%
          online, com a mesma atenção e transparência de um atendimento
          pessoal.
        </p>

        <div className="grid grid-cols-3 gap-4">
          {CREDENCIAIS.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 rounded-lg border border-border bg-card px-4 py-4 text-center"
            >
              <Icon size={20} className="text-gold" />
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-sm font-medium text-foreground">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Sobre() {
  return (
    <Section
      as="section"
      id="sobre"
      className="scroll-mt-(--header-height) border-t border-foreground/5"
    >
      <SobreContent />
    </Section>
  )
}

export { Sobre, SobreContent }
