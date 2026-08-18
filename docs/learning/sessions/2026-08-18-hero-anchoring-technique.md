# Ancoragem de elemento na borda de um container (align-self / position:absolute / margem negativa) — 2026-08-18

## Contexto

Durante a 3ª rodada de revisão visual do Hero (Fase 4.1), o Lucas identificou
que o retrato do Dr. Hélio "flutuava" solto dentro do container, cercado de
espaço vazio, e pediu explicitamente uma técnica pra resolver: *"Tecnicamente:
align-self: end (ou position: absolute ancorado no bottom) na coluna da
imagem, mantendo a foto colada na borda inferior do Hero."* Ele também previu
uma consequência: como a imagem ia "subir/vazar" pra tocar a borda, o bloco de
texto precisaria "subir junto" pra as badges não colarem na borda inferior.

## O que foi aprendido

- `align-self`/`items-end` como mecanismo de alinhamento de um item dentro do
  seu próprio track de grid.
- `position: absolute` como alternativa pra escapar do fluxo normal e ancorar
  um elemento em relação a um ancestral posicionado.
- Que mudar o posicionamento de um elemento pode ter efeitos colaterais em
  elementos irmãos que compartilham padding/espaçamento do mesmo container.

## O que o Lucas consegue explicar

Nomeou, sem que eu tivesse sugerido nada antes, duas técnicas CSS candidatas
válidas para "ancorar elemento na borda de um container" (`align-self: end`,
`position: absolute`). Também antecipou corretamente que mexer no
posicionamento do retrato teria uma consequência de layout nos elementos
vizinhos (texto/CTAs/badges) — raciocínio sobre efeito colateral entre
elementos que compartilham container, que não é intuitivo pra quem está
começando em CSS.

## O que ainda não entende

A previsão específica da consequência ("o texto precisa subir junto")
pressupunha uma implementação que remove o padding do `Section` como um
todo — a técnica que de fato usei (margem negativa só no retrato,
cancelando exatamente o padding do `Section`, sem tocar no padding
compartilhado) evita esse efeito colateral por completo, então o texto nunca
precisou de ajuste próprio. Não ficou testado se o Lucas entende por que essa
técnica alternativa (isolar a mudança num único elemento via margem negativa,
em vez de remover o padding globalmente) evita o problema que ele previu —
essa é a lacuna concreta desta rodada.

## Evidência prática

Mensagem da sessão (pedido de ajuste #2 da 3ª rodada de revisão do Hero)
nomeando as duas técnicas candidatas e a consequência prevista, escrita antes
de qualquer implementação minha.

## Nível de domínio atual

Ancoragem de elemento na borda de um container (`align-self`/
`position: absolute`) e raciocínio sobre efeitos colaterais de posicionamento
em elementos irmãos: **Entendo** — consegue nomear e propor técnicas corretas
e prever consequências de layout, mas ainda não foi verificado se consegue
explicar por que a técnica alternativa realmente usada (margem negativa
isolada no retrato) evita o efeito colateral que ele previu.

## Próximo passo

Perguntar ao Lucas, numa sessão futura, por que a margem negativa aplicada só
no retrato evitou a necessidade de "subir" o bloco de texto. Se ele conseguir
explicar isso com as próprias palavras, o nível sobe para "Consigo
raciocinar".
