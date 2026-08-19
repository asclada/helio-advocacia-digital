"use client"

import { Form } from "@base-ui/react/form"

import { Button } from "@/components/ui/button"
import { Field, FieldControl, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, type SelectOption } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const ASSUNTO_OPTIONS: SelectOption[] = [
  { label: "Venda Casada de Seguro", value: "venda-casada-de-seguro" },
  { label: "Empréstimo Fraudado", value: "emprestimo-fraudado" },
  { label: "Consignado a Menor de Idade (INSS)", value: "consignado-menor-de-idade" },
  { label: "Outro assunto", value: "outro" },
]

interface ContatoFormProps {
  /**
   * Chamado quando o formulário é submetido e todos os campos são
   * válidos. Nesta fase o projeto ainda não tem backend pra receber o
   * envio (Fase 7) — o handler padrão não faz nada além de impedir a
   * navegação nativa do `<form>`. A prop existe para a Fase 7 plugar a
   * chamada real (webhook do n8n) sem precisar mexer nesta estrutura.
   */
  onValidSubmit?: () => void
}

function ContatoForm({ onValidSubmit }: ContatoFormProps) {
  return (
    <Form
      className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 sm:p-8"
      onSubmit={(event) => {
        event.preventDefault()
        onValidSubmit?.()
      }}
    >
      <Field name="nome" className="gap-2">
        <FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground">
          Nome completo
        </FieldLabel>
        <Input required minLength={2} placeholder="Seu nome" />
        <FieldError>Informe seu nome completo.</FieldError>
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field name="whatsapp" className="gap-2">
          <FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground">
            WhatsApp
          </FieldLabel>
          <Input required minLength={8} placeholder="(84) 90000-0000" />
          <FieldError>Informe um WhatsApp válido.</FieldError>
        </Field>

        <Field name="email" className="gap-2">
          <FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground">
            E-mail
          </FieldLabel>
          <Input type="email" required placeholder="voce@email.com" />
          <FieldError>Informe um e-mail válido.</FieldError>
        </Field>
      </div>

      <Field name="assunto" className="gap-2">
        <FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground">
          Assunto
        </FieldLabel>
        <FieldControl
          render={
            <Select
              required
              options={ASSUNTO_OPTIONS}
              placeholder="Selecione o assunto"
              defaultValue=""
            />
          }
        />
        <FieldError>Selecione um assunto.</FieldError>
      </Field>

      <Field name="mensagem" className="gap-2">
        <FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground">
          Mensagem
        </FieldLabel>
        <FieldControl
          render={
            <Textarea required minLength={10} placeholder="Conte brevemente sobre o seu caso" />
          }
        />
        <FieldError>Conte um pouco mais sobre o seu caso.</FieldError>
      </Field>

      <Button type="submit" variant="primary" className="h-11 w-full text-sm">
        Enviar mensagem
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Ao enviar, você concorda com o contato do escritório para tratar da sua solicitação.
      </p>
    </Form>
  )
}

export { ContatoForm }
