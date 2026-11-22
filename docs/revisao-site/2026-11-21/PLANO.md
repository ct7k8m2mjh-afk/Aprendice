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

## Continuar de
Sessão encerrada por contexto (regra dos 40%). Próxima sessão:
1. Corretor para Z1–Z3 de questao-correcao-6.md (sugestão para Z1: o Y5 só divide em linhas o quadro cujos itens
   são relações/contas completas; lista de valores com rótulo "rótulo: a | b | c" volta a ficar numa linha só, com o
   "|" trocado pelo separador já usado no sistema; conferir as 9 resoluções citadas e a contagem de linhas só de
   número, que deve voltar a 33).
2. converte + vite build + preview 4191; tsc e vitest verdes.
3. 8ª passada (revisor novo) só em Z1–Z3; repetir até zero ERROS.
4. PLANO final curto (achados por área, corrigidos, pendentes para o dono: itens 1–11 de PARA-O-DONO.md) com FIM.
O site NÃO foi publicado nesta sessão.
