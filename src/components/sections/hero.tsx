import Image from "next/image"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Section } from "@/components/ui/section"
import { WhatsAppCta } from "@/components/ui/whatsapp-cta"
import { cn } from "@/lib/utils"

/**
 * Layout responsivo via `grid-template-areas`: mobile empilha na ordem
 * texto → retrato → CTAs → badges; desktop (`md:`) vira 2 colunas, com
 * texto/CTAs/badges na coluna esquerda e o retrato ocupando as 3 linhas
 * da coluna direita (docs/specs/fase4-1-hero.md, seção 4).
 */
const HERO_GRID_AREAS =
  "[grid-template-areas:'text'_'image'_'cta'_'badges'] " +
  "md:[grid-template-areas:'text_image'_'cta_image'_'badges_image']"

function Hero() {
  return (
    <Section as="section" spacing="spacious" className="md:pb-8">
      <div
        className={cn(
          "grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-[1fr_1fr] md:items-end",
          HERO_GRID_AREAS
        )}
      >
        <div className="[grid-area:text] flex flex-col gap-6">
          <h1 className="font-display text-4xl font-medium leading-tight text-foreground sm:text-5xl">
            Ao seu lado na defesa do seu{" "}
            <span className="text-gold-light">patrimônio</span> contra abusos
            bancários e juros abusivos
          </h1>
          <p className="max-w-xl text-muted-foreground">
            Assessoria jurídica especializada para quem sofre com seguros
            embutidos sem autorização no empréstimo, contratos fraudados em
            seu nome ou consignado liberado a menor de idade sem autorização
            judicial. Atendimento presencial em Natal/RN e online para todo
            o Brasil.
          </p>
        </div>

        <div className="[grid-area:cta] flex flex-wrap gap-4">
          <WhatsAppCta size="lg">Falar agora no WhatsApp</WhatsAppCta>
          <Link href="/areas-de-atuacao" className={cn(buttonVariants({ variant: "secondary" }), "h-10 px-4 text-base")}>
            Ver áreas de atuação
          </Link>
        </div>

        <div className="[grid-area:badges] flex flex-wrap gap-3">
          <Badge>Natal/RN</Badge>
          <Badge>Atendimento Online</Badge>
          <Badge>OAB/RN 20.357</Badge>
        </div>

        {/*
          `md:-mb-8` cancela exatamente o `md:pb-8` (override do
          padding-bottom do Section, ver acima — reduzido do `md:py-32`
          original de spacing="spacious" a pedido do Lucas, pra o retrato
          subir e ficar numa altura mais próxima da coluna de texto) —
          se o `pb-8` do Section mudar de valor, este `-mb-8` precisa
          mudar junto (mesmo padrão de acoplamento manual já usado em
          `--header-height`/`HEADER_HEIGHT_PX`).
        */}
        <div className="[grid-area:image] relative w-full md:-mb-8">
          <div
            aria-hidden="true"
            className="absolute inset-8 -z-10 rounded-full bg-gold/10 blur-3xl"
          />
          <Image
            src="/images/dr-helio-portrait.png"
            alt="Advogado Hélio Kleison"
            width={976}
            height={918}
            preload
            className="h-auto w-full"
          />
        </div>
      </div>
    </Section>
  )
}

export { Hero }
