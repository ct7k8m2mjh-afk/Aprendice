# Product

<!-- impeccable:product-schema 1 -->
<!-- Escrito em 01/11/2026 a partir do CLAUDE.md e das mensagens do dono, sem entrevista (o dono pediu trabalho autônomo). Pontos inferidos estão marcados como (inferido). -->

## Platform

web

(Só site, no navegador de computador, celular e tablet, com layout responsivo. Aplicativo de loja está fora do plano — decisão do dono, 05/11/2026.)

## Stack

delegated: React 18 + TypeScript + Vite, HashRouter. Escolhido porque o protótipo já é web (CSS e lógica reaproveitáveis). O Capacitor que ainda estiver no projeto não é usado: o produto é só site.

## Users

Todo estudante que vai prestar ENEM ou vestibular no Brasil, para qualquer curso — não só Medicina (decisão do dono, 05/11/2026). Inclui provas próprias de faculdades públicas e privadas de todas as regiões. O produto é um **site**, usado no navegador do computador, do celular e do tablet; não é aplicativo de loja. Estudam todos os dias, muitas vezes no celular, em sessões curtas entre aulas e longas em casa; fazem muitos simulados e revisam erros.

## Product Purpose

Estudar pelas questões reais das provas: questões organizadas por nível de dificuldade (básico, intermediário, avançado), resolução comentada que explica a alternativa marcada, teoria em cartões, flashcards curtos, treino geral e simulados (só prova inteira, por instituição e ano), com revisão espaçada dos erros. Sucesso = o aluno volta todo dia, retoma de onde parou e erra menos o que já errou.

## Positioning

Questões reais de prova com fonte e gabarito publicado, mais Questões Aprendice (criadas pelo site, revisadas pela banca de especialistas e sempre identificadas como tal), priorizadas pelo que as provas-alvo do aluno realmente cobram (raio-x por instituição), e material revisado em lentes sucessivas.

## Operating Context

- Rotina diária: abrir, "continue de onde parou", revisões do dia, um conteúdo por nível (Treine sua evolução) ou um treino.
- Simulados longos com cronômetro e pausa, no computador ou no celular.
- Teclado no computador (A–E, Enter, P, H); toque no celular.

## Capabilities and Constraints

- Situação (05/11/2026): site publicado em https://aprendice.vercel.app (decisão do dono). Progresso no aparelho; login e IA ainda simulados até a etapa de contas e nuvem.
- Vocabulário fixo (CLAUDE.md): nível (básico, intermediário, avançado), Treine sua evolução, treino geral, simulado (só prova inteira), flashcard, faixa de temas.
- Ids de questão e de cartão nunca mudam; mudança de formato exige migração.
- Matérias: Biologia, Química, Matemática, Português (com conteúdo); Física, História, Geografia, Inglês, Filosofia, Sociologia (estrutura; questões vêm da ingestão de provas e da fábrica de conteúdo). Redação não é matéria do site.

## Brand Commitments

- Nome APRENDICE; logo manuscrito do fundador (`app-atual/design/marca/`).
- Cores por matéria: Matemática verde-água, Português amarelo, Biologia verde, Química rosa/magenta.
- Sem emoji, sem visual "de IA". Ícones sem animação, trocáveis quando o dono mandar, sempre no lugar e enquadramento do sistema.
- Sistema de design = o protótipo `app-atual/` (grade, alinhamento, fontes, medidas; CLAUDE.md princípio 8).
- Tema claro padrão e escuro.

## Evidence on Hand

- 2.221 questões reais (Bio 507, Quí 569, Mat 610, Por 535) com print, fonte e gabarito; resoluções revisadas; teoria; 240 flashcards; 160 frases; dicionário (`app-atual/`).
- Provas completas em importação (ENEM, Fuvest, UFPR, UPE e outras do inventário de 82 instituições). Nenhum depoimento, número de usuários ou parceria: não inventar.

## Product Principles

1. A prova manda: prioridade vem das provas-alvo do aluno.
2. Errar ensina: a correção começa por "por que eu errei", mostra a pegadinha, anima a resolução e explica as outras alternativas (CLAUDE.md, "Como o site ensina").
3. Rotina sem atrito: retomar, pausar, teclado, revisão espaçada.
4. Nunca perder progresso.
5. Zero erro em material de estudo; tudo com fonte.

## Accessibility & Inclusion

WCAG 2.1 AA; texto alternativo das questões a partir do enunciado transcrito; navegação completa por teclado; respeito a prefers-reduced-motion. (inferido do CLAUDE.md: "acessível")
