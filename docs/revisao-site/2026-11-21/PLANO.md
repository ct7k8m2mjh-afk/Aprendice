# Revisão final (3ª rodada), 21/11/2026

Login em modo demonstração (VITE_CONTAS_REAIS desligado). Build servido localmente; 4 revisores independentes:
casca, materias, questao-correcao, dados (relatórios nesta pasta).

## Estado (continuar de …)
- 1ª passada: casca 6 ERROS, matérias 3, questão-correção 7, dados 4 — todos corrigidos (São Camilo sem número: dono).
- 2ª passada: casca-2 4 (corrigidos), materias-2 3 (corrigidos), dados-2 3 (R1, R2 corrigidos; R3 bloqueado pela rede: dono).
- 3ª passada (passada-3.md): 3 ERROS — todos corrigidos (N1, N2 3f756078, N3 b0f6638a).
- questao-correcao-2.md: 10 ERROS (R1–R10) — todos corrigidos (um commit cada); 987 testes verdes.
- 4ª passada: questao-correcao-3.md (6 ERROS S1–S6, 1 dono) e materias-3.md (5 ERROS T1, T2, T4–T6, 1 dono) — todos corrigidos (um commit cada); 1017 testes verdes.
- 5ª passada: questao-correcao-4.md (U1–U3) e materias-4.md (V1–V2) — corrigidos; 1028 testes verdes. O corretor achou
  3 erros antigos de fração (W1 n!/(n−p)!, W2 sen/cos, W3 notação científica em fís Pca19482b) — corrigidos (1038 testes). Falta X1: fórmula por extenso ("densidade = massa/volume") ainda na linha — corrigido (f8a0507d; 1044 testes).
- 6ª passada (questao-correcao-5.md): U, V, W, X1 resolvidos; 5 ERROS novos Y1–Y5 (Y1 é regressão do W3 com valor
  errado: "× 10ⁿ" depois da fração caía no denominador) — corrigidos (um commit cada; 1067 testes).
- 7ª passada (questao-correcao-6.md): Y1–Y4 resolvidos (Y1 conferido por script em 1 209 frações, nenhum valor errado);
  3 ERROS: Z1 (Y5 põe em coluna listas com rótulo "a | b | c", ex.: Briot-Ruffini mat P756b978d, quí Pa8675894),
  Z2 (Y5 junta nox de uma reação com o rótulo da seguinte, quí Paca34b46), Z3 (antigo: "ε0A/λ", "θ1/4" com o índice
  fora da fração, fís Pabef4082, Pdd874c02); Z4 foi para o dono (item 11).

- Z1–Z3 corrigidos (fcc5bcfa, 70830002, bcdde3ca; 1075 testes verdes).
- 8ª passada (questao-correcao-7.md): Z2 e Z3 resolvidos; Z1 resolvido nos casos pedidos, com efeito colateral.
  4 ERROS: A1 e A2 vêm do Z1; A3 e A4 já existiam. Mais 2 DETALHES (A5, A6).

## Continuar de
Sessão encerrada por contexto (regra dos 40%). Próxima sessão:
1. Corretor para A1–A4 de questao-correcao-7.md, um commit cada:
   - **A1:** cerca de 45 linhas do quadro voltaram a repetir a conta. Em `montaRoteiro`, o casamento da linha com " | "
     usa `pedacos(q.linha)`, que já junta tudo com "; ", então o casamento nunca é tentado. Sugestão: usar
     `partesBarra(q.linha)` no laço de casamento (o `const pq`). Conferir mat Pc9132e4a, P476c4b22, bio P85452565 e
     quí P16af84a2.
   - **A2:** nota ou linha no lugar errado (mat Pf7605a63, P13525e2d; fís Pce134e95; quí P4f99343f). Ver se o A1
     resolve; senão, rever a regra `porValor`, que casa o valor com o resultado da linha.
   - **A3:** lista de valores dentro da conta do passo, um número por linha (39 resoluções, como quí Pf90acda4
     "pH: 4,0 | 3,6 | 2,5"). Sugestão: em `itensDaConta`, a mesma regra do Z1 (`ehRelacao`): se nem todos os pedaços
     são relações, juntar com "; ".
   - **A4:** mat P5be7ca9e, passo 5, a 390 px: a frase "as cinco afirmações de D são verdadeiras →" é cortada na
     borda da folha.
   - A5 e A6 são DETALHES (o 0 de "ε0A" fica na altura normal; "pH: 4,0; 3,6; 2,5 < 7"). Corrigir se for barato.
2. converte + vite build + preview na porta 4191; tsc e vitest verdes (o teste `confereLinhas` em motorConta.test.ts
   já conhece a regra do Z1).
3. 9ª passada, com revisor novo, só em A1–A4; repetir até zero ERROS.
4. PLANO final curto (achados por área, corrigidos, pendentes do dono: itens 1–11 de PARA-O-DONO.md) com FIM.
O site NÃO foi publicado nesta sessão.
