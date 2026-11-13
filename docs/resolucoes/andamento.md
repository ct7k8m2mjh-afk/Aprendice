# Andamento das resoluções (comando 25)

Processo de cada lote: a banca resolve sem olhar o gabarito, confere a letra contra o gabarito oficial e refaz as contas por programa; um conferente separado confere fatos, contas, leitura de figuras e didática numa passada; a banca corrige só o que foi apontado e o mesmo conferente confere esses itens de novo. Só entra o que passou. Ordem pedida pelo dono (11/11/2026): **Matemática primeiro, depois Biologia.**

Onde ficam: `app/conteudo-fonte/provas/<prova>/resolucoes.json` (uma entrada por id de questão, `aprovada: true`). Cada entrada traz também `equivocos` (código do equívoco de cada alternativa errada, no formato `<conteúdo>:<equívoco>`, para a fase 4 do Método de Revisão; o site ainda não usa).

## Resumo

| Lote | Matéria | Recorte | Resolvidas | Aprovadas | Reprovadas | Divergência de gabarito | Pendentes |
|---|---|---|---:|---:|---:|---:|---:|
| 01 | Biologia | ENEM 2020–2025, níveis 1 a 3 | 34 | 34 | 0 | 0 | 0 |
| 02 | Matemática | ENEM 2020–2025, níveis 1 e 2 e parte do 3 | 28 | 28 | 0 | 0 | 0 (as 2 entraram no lote 04b) |
| 03 | Matemática | ENEM 2020–2025, restante do nível 3 | 32 | 32 | 0 | 0 | 0 |
| 04 | Matemática | ENEM 2020–2025, nível 4 | 30 | 30 | 0 | 0 | 0 |
| 04b | Matemática | as 2 pendentes do lote 02, com prints refeitos | 2 | 2 | 0 | 0 | 0 |
| 05 | Matemática | ENEM 2020–2025, 24 questões (nível 5 na classificação anterior) | 24 | 24 | 0 | 0 | 0 |
| 06 (mat-0001) | Matemática | ENEM 2020–2025, 24 questões pela ferramenta de lotes (níveis oficiais do INEP) | 24 | 24 | 0 | 0 | 0 |
| 07 (mat-0002) | Matemática | ENEM 2020–2025, 24 questões com figura (funções, sequências, geometria) | 24 | 24 | 0 | 0 | 0 |
| 08 (mat-0003) | Matemática | ENEM 2020–2025, as 18 últimas dos níveis 1 a 6 (contagem, probabilidade, estatística, espaço) | 18 | 18 | 0 | 0 | 0 |
| 09 (bio-0001) | Biologia | ENEM 2020–2025, 22 questões, níveis 3 a 6 (citologia a fisiologia) | 22 | 22 | 0 | 0 | 0 |
| **Total** | | | **238** | **238** | **0** | **0** | **0** |

No site montado: Biologia passou de 195 para 229 questões com resolução; Matemática, de 552 para 711 (depois do lote 07). Quatro das 92 de Matemática são a mesma questão que já existia no banco antigo com resolução (ENEM 2024 q145, ENEM 2021 q178, ENEM 2020 q168 e ENEM 2023 q155); a resolução antiga continua valendo nelas.

## Lote 01 — Biologia, ENEM, níveis 1 a 3 (11/11/2026)

- 34 questões; as 34 respostas da banca bateram com o gabarito oficial antes de abri-lo, e as do conferente também.
- Conferente: 23 passaram limpas; 15 apontamentos em 11 questões (nenhum de gabarito). Corrigidos: afirmações gerais demais (abelhas "vivem em colmeias", "o ambiente não muda o número de gametas", melhoramento "da mesma espécie"), dois roteiros de animação (hemoglobina montada na medula óssea; predador que recua da coral sem "aprender com a picada"), uma pista que entregava a alternativa, três códigos de equívoco e duas explicações de alternativa errada que não diziam o que faltou. Volta do conferente: tudo ok.
- Decisão registrada: ENEM 2025 q102 (baiacu) responde só pelo enunciado ("produzida e armazenada" no peixe); não entrou nenhuma afirmação sobre a origem da toxina, por falta de fonte conferida.

## Lote 02 — Matemática, ENEM, níveis 1, 2 e parte do 3 (11/11/2026)

- 30 questões no recorte; 28 resolvidas e 2 pendentes (ver `pendentes.md`: ENEM 2020 q175, print danificado; ENEM 2020 q176, visão espacial sem leitura garantida).
- As 28 bateram com o gabarito oficial; todas as contas (passos, quadro, checagem, caminhos e origem de cada alternativa errada) refeitas por programa pela banca e pelo conferente.
- Conferente: 17 limpas; 14 apontamentos em 11 questões (nenhum de gabarito ou de conta principal). Corrigidos: gráfico de linha chamado de "barras", origem de erro sem apoio trocada por teste, uma origem exata que faltava (1 145 = 5 × 75 + 7 × 110), quadro alinhado ao caminho dos passos, termos e justificativas imprecisos. Volta: 28 aprovadas.

## Lote 03 — Matemática, ENEM, restante do nível 3 (11/11/2026)

- 32 questões; as 32 bateram com o gabarito oficial; contas refeitas por programa.
- Conferente: 19 limpas; 16 apontamentos em 13 questões (nenhum de gabarito). O mais importante: na ENEM 2021 q162 (imposto por faixas), "três pontos bastam" estava errado, porque o gráfico em degraus também passa pelos três; entrou o teste em R = 7 500. Demais: código de equívoco, símbolo sem uso, checagem que não separava duas alternativas, justificativa do "mês mais chuvoso", definição de "inversamente proporcional". Volta: 32 aprovadas.

## Lote 04 — Matemática, ENEM, nível 4 (11/11/2026)

- 30 questões; as 30 bateram com o gabarito oficial; contas refeitas por programa pela banca e pelo conferente.
- Conferente: 13 limpas; 24 apontamentos em 17 questões (nenhum de gabarito). Erros de fato corrigidos: na ENEM 2024 q152, a explicação da alternativa E dizia "ordem das exportações" e é a ordem das importações; na ENEM 2023 q173, um caminho de eliminação esquecia a alternativa C; na ENEM 2021 q150, "45,4 = 236 ÷ 519,2" não fecha (dá 45,45) e virou teste. O conferente achou a origem exata de nove alternativas erradas que estavam só com teste (ex.: 16 514 = 28 900 ÷ 1,75; 1,31 = 236 ÷ 180; 42 = 1 122 − 1 080). Três armadilhas que não levavam a nenhuma alternativa foram trocadas, e três quadros foram alinhados ao caminho dos passos. Volta: 30 aprovadas.

## Lote 04b — as duas pendentes do lote 02 (11/11/2026)

- A sessão principal refez os prints a partir do PDF oficial (ENEM 2020 q175) e gerou uma ampliação da ENEM 2020 q176 (`docs/resolucoes/apoio/Pe5e6840f.png`).
- q175 (gráfico do lucro): resolvida pela diferença ponto a ponto; letra oficial A.
- q176 (projeções de um sólido de quatro cubos): cada alternativa foi recortada e ampliada; banca e conferente contaram os quadrados de cada sombra, separadamente, e chegaram às mesmas leituras (C e D espelhadas, A com alturas diferentes nas duas paredes, B com a sombra da parede esquerda uma coluna deslocada); letra oficial E.
- Conferente: conferência completa das duas; 2 ajustes de redação na q176. Aprovadas.

## Lote 09 (bio-0001) — Biologia, ENEM, 22 questões (11/11/2026)

- As 22 respostas da banca, dadas antes de abrir o gabarito, bateram com a letra oficial; o conferente também chegou às 22.
- Conferente (uma passada): 3 erros de precisão (ENEM 2021 q96, "deleção desloca a leitura" valia só para 1 ou 2 nucleotídeos; ENEM 2022 q122, efeito atribuído à proteína quando o enunciado fala do veneno; ENEM 2021 q114, neuro-hipófise tratada como parte do encéfalo) e ajustes de clareza em 12 questões. Tudo corrigido e aprovado na volta do mesmo conferente.
- Leituras de figura medidas pelo conferente: eletrocardiograma (ENEM 2021 q131: 5 quadradinhos de 0,2 s entre picos), tubos (ENEM 2024 q124), Engelmann (ENEM 2020 q121), círculo de cores (ENEM 2021 q120), heredogramas (ENEM 2024 q112) e joaninhas (ENEM 2025 q107).
- Alertas registrados na resolução: ENEM 2022 q120 (ótimo da catalase em 15 °C é dado do enunciado) e ENEM 2022 q125 (alternativa D é próxima; gabarito oficial E).
- **Para a sessão principal (classificação):** ENEM 2025 q107 (P89bf00ae) está em "B06.2 2ª lei de Mendel", mas é um gene só, sem dominância. Os códigos de equívoco seguem o conteúdo atual.
- Site: `converte.py`, `tsc` e `vitest` (766 testes) verdes; Biologia com 251 questões com resolução. Abertas em 390 px: ENEM 2021 q96, ENEM 2021 q131 e ENEM 2024 q112 — 4 blocos na ordem, animação até o fim, sem rolagem lateral, 0 erros de página.

## Lote 08 (mat-0003) — Matemática, ENEM, 18 questões (11/11/2026)

- Fecha Matemática do ENEM nos níveis 1 a 6. As 18 respostas da banca bateram com a letra oficial; o conferente também chegou às 18.
- Conferente (uma passada): 1 erro (ENEM 2025 q165, contraexemplo com desvio padrão diferente do quadro; ficou sem números) e ajustes em 14 questões, a maioria trocando "não confere" pela conta exata que gera a alternativa. Tudo corrigido e aprovado na volta.
- ENEM 2025 q138 (cubo e projeções): posição inicial e as cinco figuras medidas em pixels pela banca e pelo conferente, com o mesmo resultado.
- Site: `converte.py`, `tsc` e `vitest` (766 testes) verdes; Matemática com 729 questões com resolução. Abertas em 390 px: ENEM 2024 q164, ENEM 2025 q138 e ENEM 2025 q152 — 4 blocos na ordem, frações empilhadas, animação até o fim, 0 erros de página.

## Lote 07 (mat-0002) — Matemática, ENEM, 24 questões com figura (11/11/2026)

- 24 questões (gráficos, sequências, geometria plana e espacial, projeções, planificação do octaedro, rota por bússola); as 24 bateram com o gabarito oficial.
- Conferente: abriu os 24 prints e confirmou todas as leituras de figura; 8 limpas; cerca de 30 apontamentos (nenhum de gabarito nem de conta). Erros de fato corrigidos: na ENEM 2025 q180, o teste "com n = 1 dá 103" não separava a alternativa D da E (entrou o teste com n = 2); na ENEM 2025 q148, "maior escala" estava usado ao contrário (1 : 100 é a escala maior), trocado por "maior denominador da escala". Várias alternativas com teste ganharam a origem exata (83 = 51 + 16 + 16; 6 = usar a área lateral 2πrh como volume; 1,80 = lateral tratada como triângulo). Na ENEM 2025 q164 a direção 135 passou a ter conta. Volta: 24 aprovadas.
- Site: `converte.py`, `tsc` e `vitest` verdes (766 testes). No navegador (390 px): ENEM 2021 q168, ENEM 2025 q164 e ENEM 2024 q163 com os 4 blocos e frações empilhadas; animação até o fim em ENEM 2025 q164 (6/6), ENEM 2024 q163 (5/5) e ENEM 2023 q169 (5/5).
- **Para a sessão principal (classificação):** três questões deste lote estão com o conteúdo trocado. ENEM 2024 q167 (P8c8fd819) é subtração de números mistos e ENEM 2025 q148 (P5c534dc5) é escala, as duas em "M09.1 teorema de Pitágoras"; ENEM 2025 q136 (P36540617) é consumo e divisão, em "M11.2 cilindros". A banca de resoluções não altera classificação; os códigos de equívoco dessas três seguem o conteúdo atual e devem ser ajustados junto.

## Lote 06 (mat-0001) — Matemática, ENEM, 24 questões (11/11/2026)

- Primeiro lote aberto com `python3 ferramentas/resolucoes/lote.py proximo mat 24` e gravado com `grava` (a partir daqui os lotes também aparecem em `lotes-andamento.md`).
- 24 questões; as 24 bateram com o gabarito oficial; contas refeitas por programa.
- Conferente: 6 limpas; 32 apontamentos (nenhum de gabarito nem de conta). Quase todos do mesmo tipo: alternativa errada que estava só com o teste "não confere" e tinha origem exata. Exemplos: 3 800 = dividir pelos dias (ENEM 2024 q179); 800 = razão das horas invertida (ENEM 2025 q150); 185,60 e 285,60 = 20% aplicados a tudo, sem e com o lucro (ENEM 2025 q158); 18 = contar 10⁶ a partir de 1 larva (ENEM 2023 q159). Também: um quadro fora do caminho dos passos, três armadilhas que não levavam a alternativa e o campo `formulas` vazio em 23 questões. Volta: 24 aprovadas.
- Site: `converte.py`, `tsc` e `vitest` verdes (766 testes).

## Lote 05 — Matemática, ENEM, 24 questões (11/11/2026)

- Recorte montado antes de a sessão principal trocar os níveis do ENEM pela dificuldade oficial do INEP (eram nível 5); os ids não mudaram.
- 24 questões; as 24 bateram com o gabarito oficial; contas refeitas por programa.
- Conferente: 7 limpas; 26 apontamentos em 17 questões (nenhum de gabarito). O mais sério: na ENEM 2024 q174 (projeção de trajetória), os passos e a checagem não separavam a figura C da figura E; entrou a leitura da malha (profundidade de cada ponto) e o terceiro teste. Também: origens exatas que faltavam (ENEM 2023 q167, 57 embalagens → 3,51%; ENEM 2023 q175, relação lida pela metade → 10,50), cinco armadilhas que não levavam a nenhuma alternativa, símbolos sem definição e passos finais sem a letra. Volta: 24 aprovadas.
- Site: `converte.py`, `tsc` e `vitest` verdes (766 testes). No navegador (390 px): ENEM 2024 q174, q166 e ENEM 2023 q175 com os 4 blocos e frações empilhadas (inclusive fração de frações); animação até o fim em ENEM 2024 q166 (6/6), ENEM 2023 q175 (8/8) e ENEM 2024 q175 (6/6).

## Conferência no site (lotes 04 e 04b)

- `converte.py`, `tsc` e `vitest`: verde (18 arquivos, 766 testes).
- Abertas no navegador (390 px): ENEM 2020 q176, q175 e q172, com os 4 blocos na ordem, fração empilhada e sem rolagem lateral. Animação assistida até o fim em ENEM 2020 q172 (5/5), ENEM 2021 q136 (6/6, com as potências de φ desenhadas certas) e ENEM 2020 q175 (5/5).

## Conferência no site (lotes 01 a 03)

- `cd app && python3 scripts/converte.py && npx tsc --noEmit -p . && npx vitest run`: verde (18 arquivos, 766 testes).
- Abertas no navegador (390 px, login de teste): Biologia ENEM 2021 q132 e ENEM 2020 q129; Matemática ENEM 2023 q137, ENEM 2023 q141 e ENEM 2022 q179. Em todas: os 4 blocos na ordem ("Por que eu errei", "Resposta correta" com a pegadinha, "Resolução animada", "Por que as outras estão erradas"), frações empilhadas (inclusive dentro do texto), sem rolagem lateral, sem erro de página. A animação foi assistida até o último passo em três delas (3/3, 5/5 e 3/3).
- Formato da fração nos dados: escrever `a/b` ou `a ÷ b`; o site empilha sozinho. `\frac{}{}` não é lido pelo site e não deve ser usado.

## O que falta (Matemática e Biologia do ENEM, níveis 1 a 6)

- Matemática do ENEM, níveis 1 a 6: **concluída** (lote 08). Faltam em Matemática 2 789 questões de outras provas e níveis.
- Biologia do ENEM, níveis 1 a 6: **concluída** (lote bio-0002, 21 questões, 11/11/2026). A partir daqui o registro de cada lote fica em `lotes-<matéria>.md`, escrito pela ferramenta.
- Depois: demais matérias do ENEM e as provas-alvo mais comuns (ver `levantamento.md`).
