import type { Metadata } from "next";

import { ContatoForm } from "@/components/sections/contato-form";
import { Faq } from "@/components/sections/faq";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "FAQ/Contato",
  description:
    "Fale com o escritório Helio Kleison Advocacia — WhatsApp, e-mail, formulário de contato ou dúvidas frequentes.",
};

export default function ContatoPage() {
  return (
    <main className="flex flex-1 flex-col pt-(--header-height)">
      <Section as="section" id="contato" spacing="spacious">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          <div className="flex flex-col gap-8">
            <SectionHeading
              as="h1"
              eyebrow="Contato"
              title="Fale com o escritório"
              align="left"
            />
            <ContatoForm />
          </div>

          <div id="faq" className="scroll-mt-(--header-height) flex flex-col gap-8">
            <SectionHeading
              eyebrow="Dúvidas Frequentes"
              title="Perguntas comuns"
              align="left"
            />
            <Faq />
          </div>
        </div>
      </Section>
    </main>
  );
}
