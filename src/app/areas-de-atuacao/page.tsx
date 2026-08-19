import type { Metadata } from "next";

import { AreasAtuacaoContent } from "@/components/sections/areas-atuacao";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Áreas de Atuação",
  description:
    "Direito Bancário e do Consumidor: venda casada de seguro, empréstimo fraudado e consignado a menor de idade sem autorização judicial.",
};

export default function AreasDeAtuacaoPage() {
  return (
    <main className="flex flex-1 flex-col pt-(--header-height)">
      <Section as="section" id="atuacao" spacing="spacious">
        <AreasAtuacaoContent headingLevel="h1" />
      </Section>
    </main>
  );
}
