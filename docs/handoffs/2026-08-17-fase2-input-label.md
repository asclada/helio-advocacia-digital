# Handoff — 2026-08-17 — Fase 2: Input + Label (fecha a Fase 2)

## Prompt pronto para a próxima sessão

```
Estou no projeto Hélio Advocacia Digital, Fase 3 (Header, Nav e Footer).

Antes de começar, leia:
- docs/roadmap.md (roadmap master — Fase 2 concluída, Fase 3 ainda é só
  esqueleto de escopo provável — precisa ser detalhada em spec própria
  antes de qualquer código)
- docs/padrao-desenvolvimento.md (padrão de processo: Plan Mode + SDD +
  TDD, comunicação didática, handoff em dois blocos, seção 9 —
  sincronização do README ao fim de fase)
- docs/handoffs/2026-08-17-fase2-input-label.md (este handoff — última
  sessão: Input + Label implementado, testado; Fase 2 inteira fechada)

Fase 2 está 100% concluída: os 5 componentes de UI base (Container/Section,
Button, Badge, Card, Input+Label) prontos, testados (77 testes, jest-axe
sem violações, tsc/lint limpos), documentados em docs/specs/ e
commitados. README.md/README.pt-br.md já refletem isso.

Input + Label usa Base UI Field (`Field`/`FieldLabel`/`FieldDescription`/
`FieldError` em src/components/ui/field.tsx + `Input` em
src/components/ui/input.tsx) — mesma família de primitiva do Button,
resolve associação label↔input e aria-invalid/aria-describedby
automaticamente. Ver docs/specs/fase2-input-label.md pras decisões de
design (inclusive dois achados reais de contraste corrigidos com script).

A Fase 3 (Header, Nav e Footer) ainda não tem spec — o roadmap master só
lista o escopo provável. Antes de qualquer código, a conversa precisa
definir o escopo real da Fase 3 e uma spec em docs/specs/fase3-*.md
precisa ser escrita, seguindo o mesmo ciclo (spec → Plan Mode → aprovação
→ TDD).
```

## Registro da sessão

### O que foi feito

- **Spec do Input + Label criada** (`docs/specs/fase2-input-label.md`) —
  decisões de design apresentadas como opções com recomendação antes de
  travar (mesmo padrão já usado no Badge e no Card):
  - **Base técnica**: Base UI Field (`@base-ui/react/field` +
    `@base-ui/react/input`) em vez de montar `Input`/`Label` à mão. Mesma
    família de primitiva já adotada pelo `Button` desde a Fase 1 —
    resolve associação label↔input, `aria-invalid` e `aria-describedby`
    automaticamente, sem reduzir liberdade de estilização (headless,
    `className` livre em cada parte, igual ao `Button`).
  - **Cor do texto de erro**: `text-foreground` em vez de
    `text-destructive` no `FieldError`.
- **Dois achados reais de contraste, verificados com script (não
  estimados)** — rodei um script Node fazendo a conversão OKLCH→sRGB do
  token `destructive` (definido em OKLCH em `globals.css`) e calculando
  contraste real contra os fundos do site:
  - `border-input`/`border-border` (mesmo token do `Card`) mede **1.38:1**
    contra o fundo — falha os **3:1** exigidos pelo WCAG 1.4.11 pra
    componentes **interativos**. Diferente do `Card` (não interativo,
    onde esse mesmo valor era aceitável), o `Input` precisa de uma borda
    de repouso com contraste real — usei `border-muted-foreground`
    (**7.95:1**) em vez disso.
  - `text-destructive` mede **3.93–4.23:1** contra os fundos — falha os
    **4.5:1** exigidos pra texto normal (AA). Por isso o `FieldError` usa
    `text-foreground` (**~18:1**), deslocando a comunicação visual do
    erro pra borda/`ring` do `Input` inválido (que aí sim passam nos 3:1
    de componente interativo).
- **Testes escritos primeiro** (`input.test.tsx`, `field.test.tsx`),
  confirmados falhando (red) antes de `input.tsx`/`field.tsx` existirem.
- **Implementação** — `src/components/ui/input.tsx` (`Input`, wrap de
  `@base-ui/react/input`) e `src/components/ui/field.tsx` (`Field`,
  `FieldLabel`, `FieldDescription`, `FieldError`, wrap de
  `@base-ui/react/field`).
- **Descoberta real durante os testes**: a Base UI Field só marca
  `valueMissing` (campo obrigatório vazio) como erro depois que o campo
  foi alterado pelo menos uma vez (`markedDirtyRef`, um "latch" que uma
  vez ativado nunca desliga) — comportamento intencional da própria
  biblioteca pra não mostrar "campo obrigatório" num campo que o usuário
  nunca tocou. Os testes de validação simulam isso digitando e apagando
  antes do blur, em vez de só focar/desfocar um campo virgem.
- **Revisão visual no navegador** — preview temporário em
  `src/app/page.tsx` com os dois casos de uso reais (Nome completo,
  E-mail) dentro de um formulário, junto com o `Button`.
- **Bug de ambiente encontrado e corrigido durante a revisão** (não é bug
  de componente — ver seção seguinte).
- **Preview revertido** de `src/app/page.tsx` depois da revisão.
- **Learning System e LinkedIn Workflow avaliados** (seção 8 do padrão) —
  Lucas optou por não registrar nenhum dos dois candidatos avaliados
  nesta sessão (decisão dele, sistema nunca cria automaticamente).
- **`docs/roadmap.md` atualizado** — checkbox do Input+Label marcada,
  status da Fase 2 pra ✅, seção "Entregue" e "Registro" adicionadas.
- **`README.md`/`README.pt-br.md` atualizados** — seção "Estado
  atual"/"Current status" agora reflete a Fase 2 concluída com os 5
  componentes (seção 9 do padrão — só dispara ao fim de fase).

### Bug de ambiente encontrado na revisão visual (não é bug de componente)

Na primeira revisão, o Lucas apontou corretamente que o conteúdo do
formulário no preview estava sem respiro visual das bordas — diagnóstico
razoável, já que "falta de padding" é a causa mais comum desse sintoma.
Mas o `<form>` já tinha `p-6` no código desde o início.

**Causa real, investigada nesta sessão**: havia um servidor `next dev`
órfão (PID 10680, de uma sessão anterior) já ocupando a porta 3000. Baixei
o CSS realmente servido por ele e confirmei, com `grep`, que a regra
`.p-6 {` simplesmente não existia no bundle — build de Tailwind
desatualizado, apesar do HTML já refletir o texto/estrutura mais recente
(Turbopack estava servindo módulos novos, mas com um chunk de CSS
obsoleto). Matei o processo, limpei `.next` e subi um servidor novo — o
`.p-6 {` passou a existir no CSS servido, confirmado diretamente (não só
"parece melhor visualmente"). Depois de revisar de novo, o Lucas aprovou.

**Por que isso importa**: nenhum componente (`Input`, `Field*`) precisou
de ajuste — o achado do Lucas apontou pro lugar certo (o container do
preview), mas a causa raiz era ambiente (processo órfão), não código.
Ao encerrar a revisão, matei o processo do servidor de dev explicitamente
(e verifiquei com `netstat`/`curl` que a porta 3000 ficou livre de
verdade) pra não deixar outro órfão pra trás — a mesma armadilha que
acabamos de descobrir.

### Testes criados (e status)

- `src/components/ui/input.test.tsx` — 11 testes: renderiza como
  `<input>`; `type` default `text`; aceita `type`/`placeholder`; classes
  fixas de repouso (`border-muted-foreground`, `w-full`, `h-9`,
  `rounded-lg`); classe de foco visível; classe de `aria-invalid`; estado
  `disabled`; merge de `className`; props nativas (`id`, `onChange`);
  `jest-axe` sem violações (com `aria-label` próprio); snapshot.
- `src/components/ui/field.test.tsx` — 12 testes: `Field` renderiza
  `children`; `FieldLabel`+`Input` associam automaticamente
  (`getByLabelText` sem `htmlFor`/`id` manual); `FieldDescription` com
  `text-muted-foreground`; `FieldError` com `text-foreground` (não
  `text-destructive`); erro não aparece antes do campo ser tocado; campo
  obrigatório vazio e "sujado" aplica `aria-invalid` e mostra o erro
  certo; e-mail com formato inválido mostra o erro de `typeMismatch`, não
  o de `valueMissing`; composição completa (label + input + descrição +
  erro) renderiza certo, sem violações de acessibilidade nos estados
  válido e inválido; snapshot de cada estado.
- Total do projeto: **77/77 passando** (54 anteriores + 23 novos).
- `npx tsc --noEmit` e `npm run lint`: sem erros.

### Decisões tomadas e por quê

1. **Base UI Field, não `Input`/`Label` manuais** — ver spec, "Base
   técnica". Resumo: mesma família de primitiva do `Button`, resolve
   acessibilidade de formulário testada pela própria lib, sem reduzir
   liberdade de estilização (confirmado antes de decidir).
2. **`border-muted-foreground` na borda de repouso, não `border-input`**
   — achado real de contraste (1.38:1, falha 1.4.11 pra componente
   interativo), diferente do `Card` (mesmo token, mas não interativo).
3. **`text-foreground` no `FieldError`, não `text-destructive`** —
   achado real de contraste (3.93–4.23:1, falha AA de texto). O vermelho
   continua vindo da borda/`ring` do `Input` inválido.
4. **Nomenclatura `Field*` com prefixo** (`FieldLabel`, `FieldDescription`,
   `FieldError`) — mesmo raciocínio do `Card` (`CardTitle`, etc.): deixa
   explícito que a peça só faz sentido dentro de um `Field`.
5. **Dois arquivos (`field.tsx` + `input.tsx`), não um só** — mesmo
   raciocínio já usado pra separar `Container`/`Section` dentro do mesmo
   checkpoint do roadmap; `Input` é standalone, `Field*` só existe em
   função de um `Field`.

### Próximo passo imediato

Fase 2 está inteiramente concluída. Próximo: **Fase 3 — Header, Nav e
Footer**. O roadmap master ainda só tem o esqueleto de escopo provável
pra essa fase (`docs/roadmap.md`, seção "Fase 3") — antes de qualquer
código, a próxima sessão precisa definir o escopo real em conversa e
escrever `docs/specs/fase3-*.md`, seguindo o mesmo ciclo já estabelecido
(spec → Plan Mode → aprovação → TDD).

### Links

- Spec geral da Fase 2: [docs/specs/fase2-componentes-ui-base.md](../specs/fase2-componentes-ui-base.md)
- Spec do componente: [docs/specs/fase2-input-label.md](../specs/fase2-input-label.md)
- Padrão de processo: [docs/padrao-desenvolvimento.md](../padrao-desenvolvimento.md)
- Roadmap master: [docs/roadmap.md](../roadmap.md)
