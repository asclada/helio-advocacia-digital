import type { Metadata } from "next";

import { SobreContent } from "@/components/sections/sobre";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Sobre o Advogado",
  description:
    "Dr. Helio Kleison, OAB/RN 20.357 — advocacia especializada em Direito Bancário, atendimento presencial em Natal/RN e online para todo o Brasil.",
};

export default function SobrePage() {
  return (
    <main className="flex flex-1 flex-col pt-(--header-height)">
      <Section as="section" id="sobre" spacing="spacious">
        <SobreContent headingLevel="h1" />
      </Section>
    </main>
  );
}
