# Fase 0 — Auditoria do site atual (concluída)

**Data de conclusão:** 15 de agosto de 2026

## Resumo da stack atual

O site atual do Dr. Hélio é uma página estática simples, sem framework e sem
processo de build:

- HTML estático (arquivos `.html` servidos diretamente, sem SSR/SSG de framework).
- Tailwind CSS via CDN (sem etapa de build, sem purge/otimização de CSS).
- Sem framework de frontend (sem React, Vue, etc.).
- Sem build tool (sem bundler, sem gerenciador de pacotes envolvido no processo do site).
- Formspree para o formulário de contato (envio de formulário via serviço terceirizado, sem backend próprio).

## Estrutura de conteúdo/seções do site atual

1. Hero
2. Áreas de Atuação
3. Sobre
4. FAQ
5. Contato
6. Footer

## O que deve ser reaproveitado no redesign

- Copy jurídico (textos já validados sobre áreas de atuação, sobre o advogado, FAQ).
- Paleta de cores: navy + dourado.
- Tipografia: Playfair Display, Inter e Cormorant Garamond.
- Número de WhatsApp: +55 84 99477-6673.
- Estrutura geral de seções (Hero → Áreas de Atuação → Sobre → FAQ → Contato → Footer).

## O que será descartado e refeito do zero

- Toda a base técnica atual: HTML monolítico e Tailwind via CDN.
- Assets de imagem não otimizados.
- CTAs de WhatsApp hardcoded em cada seção — no redesign, viram um componente único reutilizável.

## Confirmação de infraestrutura do site atual

- Domínio: www.heliokleisonadvocacia.com.br
- Repositório GitHub: `asclada/site-helio-kleison-adv`
- Branch: `main`
- Deploy: Vercel

## Conclusão

Fase 0 concluída. Próximo passo: **Fase 1 — Design System**.
