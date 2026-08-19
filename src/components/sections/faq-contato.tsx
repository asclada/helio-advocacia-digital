import { ContatoForm } from "@/components/sections/contato-form"
import { Faq } from "@/components/sections/faq"
import { Section } from "@/components/ui/section"
import { SectionHeading } from "@/components/ui/section-heading"

function FaqContato() {
  return (
    <Section
      as="section"
      id="faq"
      className="scroll-mt-(--header-height) border-t border-foreground/5"
    >
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
        <div className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="Dúvidas Frequentes"
            title="Perguntas comuns"
            align="left"
          />
          <Faq />
        </div>

        <div id="contato" className="scroll-mt-(--header-height) flex flex-col gap-8">
          <SectionHeading
            eyebrow="Contato"
            title="Fale com o escritório"
            align="left"
          />
          <ContatoForm />
        </div>
      </div>
    </Section>
  )
}

export { FaqContato }
