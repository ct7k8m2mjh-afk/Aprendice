# Product

<!-- impeccable:product-schema 1 -->
<!-- Escrito em 01/11/2026 a partir do CLAUDE.md e das mensagens do dono, sem entrevista (o dono pediu trabalho autônomo). Pontos inferidos estão marcados como (inferido). -->

## Platform

web

(Uma base web empacotada com Capacitor para iPhone e Android; a linguagem visual é a mesma nos três.)

## Stack

delegated: React 18 + TypeScript + Vite, HashRouter, Capacitor 6. Escolhido porque o protótipo já é web (CSS e lógica reaproveitáveis), roda offline no aparelho e gera site + iOS + Android de uma base só.

## Users

Estudantes que se preparam para vestibulares em todo o Brasil (ENEM e provas próprias de faculdades públicas e privadas). O produto é um **site**, usado no navegador do computador, do celular e do tablet; não é aplicativo de loja. Estudam todos os dias, muitas vezes no celular, em sessões curtas entre aulas e longas em casa; fazem muitos simulados e revisam erros.

## Product Purpose

Estudar pelas questões reais das provas: questões organizadas por nível de dificuldade (básico, intermediário, avançado), resolução comentada que explica a alternativa marcada, teoria em cartões, flashcards curtos, treino geral e simulados (só prova inteira, por instituição e ano), com revisão espaçada dos erros. Sucesso = o aluno volta todo dia, retoma de onde parou e erra menos o que já errou.

## Positioning

Questões reais de prova com fonte e gabarito publicado, mais Questões Aprendice (criadas pelo site, revisadas pela banca de especialistas e sempre identificadas como tal), priorizadas pelo que as provas-alvo do aluno realmente cobram (raio-x por instituição), e material revisado em lentes sucessivas.

## Operating Context

- Rotina diária: abrir, "continue de onde parou", revisões do dia, uma escada ou um treino.
- Simulados longos com cronômetro e pausa, no computador ou no celular.
- Teclado no computador (A–E, Enter, P, H); toque no celular.

## Capabilities and Constraints

- Fase atual (01/11/2026): protótipo completo rodando só localmente; sem servidor, banco na nuvem, login real ou publicação. Progresso no aparelho; login e IA simulados.
- Vocabulário fixo: escada/degrau, treino geral, simulado, flashcard, faixa de temas.
- Ids de questão e de cartão nunca mudam; mudança de formato exige migração.
- Matérias: Biologia, Química, Matemática, Português (com conteúdo); Física, História, Geografia, Inglês, Filosofia, Sociologia (estrutura; questões vêm da fábrica de conteúdo).

## Brand Commitments

- Nome APRENDICE; logo manuscrito do fundador (`app-atual/design/marca/`).
- Cores por matéria: Matemática verde-água, Português amarelo, Biologia verde, Química rosa/magenta.
- Sem emoji, sem visual "de IA"; ícones 3D realistas (referência em `app-atual/design/icones_real/foto3d/ref3110/`).
- Tema claro padrão e escuro.

## Evidence on Hand

- 2.221 questões reais (Bio 507, Quí 569, Mat 610, Por 535) com print, fonte e gabarito; resoluções revisadas; teoria; 240 flashcards; 160 frases; dicionário (`app-atual/`).
- Nenhuma prova completa no banco ainda; nenhum depoimento, número de usuários ou parceria: não inventar.

## Product Principles

1. A prova manda: prioridade vem das provas-alvo do aluno.
2. Errar ensina: a resolução parte da alternativa marcada.
3. Rotina sem atrito: retomar, pausar, teclado, revisão espaçada.
4. Nunca perder progresso.
5. Zero erro em material de estudo; tudo com fonte.

## Accessibility & Inclusion

WCAG 2.1 AA; texto alternativo das questões a partir do enunciado transcrito; navegação completa por teclado; respeito a prefers-reduced-motion. (inferido do CLAUDE.md: "acessível")
