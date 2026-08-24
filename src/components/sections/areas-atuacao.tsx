import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Section } from "@/components/ui/section"
import { SectionHeading } from "@/components/ui/section-heading"

const AREAS = [
  {
    title: "Venda Casada de Seguro",
    description:
      "Contratação de seguro ou produto não solicitado imposta como condição para liberar o empréstimo. Atuação para anular a cobrança e recuperar valores pagos indevidamente.",
  },
  {
    title: "Empréstimo Fraudado",
    description:
      "Idade adulterada no contrato ou empréstimo lançado em nome de quem nunca o contratou. Defesa para contestar a dívida e reverter os descontos indevidos.",
  },
  {
    title: "Consignado a Menor de Idade (INSS)",
    description:
      "Crédito consignado liberado por representante legal sem autorização judicial. Atuação para bloquear descontos e reaver os valores cobrados irregularmente.",
  },
]

interface AreasAtuacaoContentProps {
  /**
   * `"h2"` (default) para a seção resumida da Home; `"h1"` quando este
   * conteúdo é o assunto principal de uma página dedicada (Fase 4.5,
   * docs/specs/fase4-5-paginas-dedicadas.md) — repassado direto pro
   * `SectionHeading`.
   */
  headingLevel?: "h1" | "h2"
}

/**
 * Só o conteúdo (título + grid de cards), sem `Section`/`id`/`border-t` —
 * a Home (`AreasAtuacao`, abaixo) e a página dedicada
 * (`src/app/areas-de-atuacao/page.tsx`) decidem o próprio wrapper, sem
 * duplicar a copy jurídica entre os dois lugares (mesmo padrão já usado
 * em `Faq`/`ContatoForm` desde a Fase 4.4).
 */
function AreasAtuacaoContent({ headingLevel = "h2" }: AreasAtuacaoContentProps) {
  // A hierarquia de heading precisa continuar sequencial (jest-axe:
  // "heading-order") — quando este título vira <h1> (página dedicada), o
  // título de cada card precisa descer um nível junto (h3 → h2), senão a
  // página pula de h1 direto pra h3.
  const cardTitleLevel = headingLevel === "h1" ? "h2" : "h3"

  return (
    <>
      <SectionHeading
        as={headingLevel}
        eyebrow="Áreas de Atuação"
        title="Direito Bancário e do Consumidor, com foco em:"
      />

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {AREAS.map((area) => (
          <Card
            key={area.title}
            className="transition duration-[400ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1.5 hover:border-gold"
          >
            <CardHeader>
              <CardTitle as={cardTitleLevel}>{area.title}</CardTitle>
            </CardHeader>
            <CardContent>{area.description}</CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}

function AreasAtuacao() {
  return (
    <Section
      as="section"
      id="atuacao"
      className="scroll-mt-(--header-height) border-t border-foreground/5"
    >
      <AreasAtuacaoContent />
    </Section>
  )
}

export { AreasAtuacao, AreasAtuacaoContent }
