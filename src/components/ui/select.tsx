import { cn } from "@/lib/utils"

interface SelectOption {
  label: string
  value: string
}

interface SelectProps extends React.ComponentPropsWithoutRef<"select"> {
  options: SelectOption[]
  /**
   * Quando informado, vira a 1ª option (desabilitada, sem valor) — força
   * uma escolha explícita em vez de a 1ª opção real vir pré-selecionada.
   * Combinado com `required` no elemento, o navegador/Base UI `Field`
   * bloqueia o envio se ela continuar selecionada (mesma validação
   * nativa já usada nos outros campos, sem lógica customizada).
   */
  placeholder?: string
}

/**
 * `bg-navy` explícito em cada `<option>` — a lista suspensa de um
 * `<select>` nativo é renderizada pelo navegador/SO fora da árvore de
 * estilo normal da página; sem um fundo explícito nas options, o texto
 * claro do tema (herdado) pode cair sobre o fundo claro padrão do
 * navegador, ilegível. Achado real de revisão visual, não estimado.
 */
const optionClassName = "bg-navy text-foreground"

function Select({ className, options, placeholder, ...props }: SelectProps) {
  return (
    <select
      data-slot="select"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-lg border border-muted-foreground bg-transparent px-3 py-1 text-sm text-foreground transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {placeholder && (
        <option value="" disabled className={cn(optionClassName, "text-muted-foreground")}>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value} className={optionClassName}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export { Select }
export type { SelectOption }
