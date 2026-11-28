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

- A1–A5 corrigidos (A6 depende dos dados); 9ª passada (questao-correcao-9.md): 2 ERROS B1, B2 + DETALHES B3–B6;
  B1–B3 corrigidos (1109 testes). 10ª passada (questao-correcao-10.md): 3 ERROS antigos C1–C3 + DETALHES C4–C8;
  C1–C3 corrigidos (motor comparado nas 51 655 resoluções; 1167 testes verdes). 11ª e última passada
  (questao-correcao-11.md): C1–C3, B1–B3 e A1–A4 seguem valendo; 4 ERROS D1–D4 ficam pendentes (critério de parada
  da coordenação: no máximo uma passada depois da 10ª).

## Resultado final (22/11/2026)
Achados por área (todas as passadas): casca 10, matérias 13, dados 7, questão-correção 50+ (motor de contas e
frações: R, S, U, W, X, Y, Z, A, B, C). Todos os ERROS corrigidos, um commit cada, com teste, exceto:

Pendentes técnicos (para a próxima rodada de correção, nesta ordem):
1. **D1 (regressão do C2, prioridade):** bio P85452565, passo 3 — "IBi → B" é lido como conclusão e "AB: 1/2" e
   "B: 1/2" aparecem antes dele. Corrigir a regra do C2 para não mover linha de genótipo → fenótipo.
2. D2: linha do quadro repete a conta quando difere só em grafia (fís Pd2b4ad62, P6f60a2e4, P8f1936d9, Pfb7662f6;
   mat P5be7ca9e, Pb28d85a4).
3. D3: linha no passo errado (fís Pf8f2eeea, P6f60a2e4).
4. D4: fração na linha dentro da conta/nota (fís P8f1936d9, Pfb7662f6; mat P053636f4).
5. DETALHES cosméticos: A6, B4–B6, C4–C8 e os da 11ª passada (ver relatórios).

Pendentes para o dono decidir: itens 1–11 de PARA-O-DONO.md (resultado do simulado na cor da matéria; faixa de
temas no Treino geral; 10 questões da São Camilo sem número; figuras da teoria pequenas no celular; gabarito
definitivo ainda não aplicado; tons das figuras de Bio no escuro; figura da α/β-glicose; ½ inclinado; frase longa no
"No caderno"; citação com fração em his P78979201; divisões por extenso na linha).

tsc sem erro, vitest 1167/1167. O site NÃO foi publicado.

FIM
