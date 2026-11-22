# Correção dos achados A1–A5 da 8ª passada (questao-correcao-7.md), 22/11/2026

Arquivos: `app/src/logica/motorConta.ts`, `app/src/logica/notacao.ts`, `app/src/testes/motorConta.test.ts`,
`app/src/testes/fracaoPassada8.test.ts` (novo, 22 casos). Sem mudança de cor, fonte ou medida. Site não publicado.

Como conferi: um script roda `montaRoteiro` em todas as 26 552 resoluções com passos ou quadro (antes e depois de cada
correção) e compara as linhas e notas de cada passo; li todas as resoluções que mudaram. A tela foi medida com o
Playwright no servidor local (porta 4191).

## A1 — linha do quadro com " | " volta a casar com a conta (commit 1)
- `montaRoteiro`: o casamento do Y5 usa `partesBarra(q.linha)` (os pedaços crus), e não `pedacos`.
- `ehRelacao` passa a aceitar "∝", "↔", "⇔" e "∈".
- Conferidos: mat Pc9132e4a, P476c4b22, Pc5100905; bio P85452565, P40d9ac92; quí P16af84a2, P707086a9: sem linha repetida, nota
  na última linha da conta.
- Efeito: **49 resoluções mudam**, as 45 da lista do A1 (todas), mais mat Pf7605a63 e P13525e2d (nota volta ao lugar, A2),
  mat Pff734b11 e fís P919354f5 (relações com "∈" e "↔", um item por linha).

## A2 — nota e linha do quadro no lugar certo (commit 2)
- A linha do quadro que não casa e vem antes de uma linha casada em vários pedaços entra antes da primeira linha casada
  (não no meio delas).
- Os pedaços da linha com " | " também casam em outra ordem, no mesmo passo; a nota vai para a última dessas linhas.
- Conferidos: fís Pce134e95 ("atrito = µ × N" antes da tabela); quí P16af84a2 (a reação não parte esquerda | direita);
  mat Pf7605a63 ("mediana" no passo 3); mat P13525e2d; quí P4f99343f (nota no passo 4); fís P9ba33c4c; mat Pa429a328.
- Efeito: **22 resoluções mudam** em relação ao A1 (linha inserida antes do grupo casado, ou linha repetida que some).
- Fica: mat P9c957c10, "GB 65 | França 64 | Austrália 53" continua como linha própria ("GB" ≠ "Grã-Bretanha" nos dados).

## A3 — lista de valores da conta não vira coluna de números soltos (commit 3)
- `itensDaConta`: na linha com número solto, o item que começa por número continua o item de antes, com "; "
  ("pH: 4,0; 3,6; 2,5 → todos < 7 → caráter ácido", "Na: 2; 2"); item com rótulo ou de texto abre linha, como depois de
  " ; ". A lista com "; " e número solto também fica numa linha.
- `montaRoteiro`: pedaços do quadro podem casar com a mesma linha quando ela é uma lista (e a linha seguinte do quadro
  começa depois dela); pedaços ou valores num passo antes valem mais que a linha inteira casada num passo adiante.
- Conferidos: quí Pf90acda4 (pH numa linha; as notas voltam aos passos 1 a 3), mat Pb28d85a4, Pfe3cc0ba, P13525e2d,
  Pf7605a63, quí Pf2101c1e, Pad880228, mat P7244b669.
- Efeito: **88 resoluções mudam** em relação ao A2. Resoluções com 2 ou mais linhas só de número: **50 → 6** (as 6 que
  ficam são linhas do quadro com um valor só ou valores em passos diferentes: mat Pce5a3ab2, P9aa36fb9, Pbd15354b,
  bio P6a3f4a7e, fís P39ea3229, geo P99ad9adb).
- Ficam (dados, não motor): quí Pf90acda4, "Mg: 70,0; 48,0; 23,0" ainda repete no passo 4 (o quadro a escreve depois do
  pH, fora da ordem da conta); quí P03ff24db, "C1: H; NHCH3; CH2; C aromático → quiral" (texto diferente da conta).

## A4 — frase cortada na borda a 390 px (commit 4)
- `quebrasConta`: o espaço entre duas palavras de texto corrido é quebra de nível 2 (só usada quando não cabe), menos
  antes da letra da alternativa.
- Conferido: mat P5be7ca9e, passo 5, a 390 claro e escuro: a frase quebra em duas linhas dentro da folha (33–357 px),
  nenhuma linha passa da borda, sem rolagem lateral. Não muda o texto de nenhuma resolução (só onde pode quebrar).

## A5 — "ε0A" (commit 5, detalhe barato)
- `partesNotacao`: letra grega + algarismo + grandeza maiúscula → índice ("ε₀A"). Conferido na tela: fís Pabef4082.

## A6 — não corrigido
- Pede mudança nos dados ("Na: 2 = 2 | S: 1 = 1"), que passa pelas lentes. quí Pf90acda4 "pH … < 7" já não aparece (casa
  com a conta, A3).

## Testes
`npx tsc --noEmit -p .` sem erro; `npx vitest run`: todos verdes.
