"use client"

import { Accordion } from "@base-ui/react/accordion"
import { Plus } from "lucide-react"

const FAQ_ITEMS = [
  {
    question:
      "Posso cancelar um seguro que veio embutido no meu empréstimo sem que eu tenha autorizado?",
    answer:
      "Se o seguro foi imposto como condição para a liberação do crédito - ou seja, se você não teve a opção real de recusar - isso configura venda casada, prática vedada pelo Código de Defesa do Consumidor (art. 39, I). Nesses casos, é possível anular a cobrança e recuperar os valores pagos indevidamente.",
  },
  {
    question: "Descobri um empréstimo em meu nome que nunca contratei. O que fazer?",
    answer:
      "Reúna os extratos e comprovantes que mostram a cobrança e procure orientação jurídica o quanto antes. É possível contestar a dívida, incluindo casos de idade adulterada no contrato, e reverter os descontos indevidos.",
  },
  {
    question:
      "Um consignado foi liberado no benefício do INSS de um dependente menor de idade. Isso é permitido?",
    answer:
      "Somente com autorização judicial. Um representante legal não pode contratar crédito consignado em nome de menor de idade por conta própria, mesmo que tenha assinado o contrato pessoalmente. É possível bloquear os descontos e reaver os valores cobrados irregularmente.",
  },
  {
    question: "O atendimento online tem a mesma validade jurídica do presencial?",
    answer:
      "Sim. Procurações, documentos e reuniões podem ser conduzidos digitalmente com total validade legal, permitindo o acompanhamento completo do caso de qualquer lugar do Brasil.",
  },
]

function Faq() {
  return (
    <Accordion.Root className="flex flex-col gap-3">
      {FAQ_ITEMS.map((item) => (
        <Accordion.Item
          key={item.question}
          className="rounded-lg border border-border bg-card"
        >
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-foreground transition-colors hover:bg-secondary/60 sm:text-base">
              {item.question}
              <Plus
                className="size-4 shrink-0 text-gold transition-transform duration-200 group-data-[panel-open]:rotate-45"
                aria-hidden="true"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel className="h-(--accordion-panel-height) overflow-hidden text-sm transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0">
            <p className="px-5 pb-5 leading-relaxed text-muted-foreground">{item.answer}</p>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}

export { Faq }
