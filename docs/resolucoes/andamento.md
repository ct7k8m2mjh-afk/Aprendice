# Andamento das resoluções (comando 25)

Processo de cada lote: a banca resolve sem olhar o gabarito, confere a letra contra o gabarito oficial e refaz as contas por programa; um conferente separado confere fatos, contas, leitura de figuras e didática numa passada; a banca corrige só o que foi apontado e o mesmo conferente confere esses itens de novo. Só entra o que passou. Ordem pedida pelo dono (11/11/2026): **Matemática primeiro, depois Biologia.**

Onde ficam: `app/conteudo-fonte/provas/<prova>/resolucoes.json` (uma entrada por id de questão, `aprovada: true`). Cada entrada traz também `equivocos` (código do equívoco de cada alternativa errada, no formato `<conteúdo>:<equívoco>`, para a fase 4 do Método de Revisão; o site ainda não usa).

## Resumo

| Lote | Matéria | Recorte | Resolvidas | Aprovadas | Reprovadas | Divergência de gabarito | Pendentes |
|---|---|---|---:|---:|---:|---:|---:|
| 01 | Biologia | ENEM 2020–2025, níveis 1 a 3 | 34 | 34 | 0 | 0 | 0 |
| 02 | Matemática | ENEM 2020–2025, níveis 1 e 2 e parte do 3 | 28 | 28 | 0 | 0 | 2 |
| 03 | Matemática | ENEM 2020–2025, restante do nível 3 | 32 | 32 | 0 | 0 | 0 |
| **Total** | | | **94** | **94** | **0** | **0** | **2** |

No site montado: Biologia passou de 195 para 229 questões com resolução; Matemática, de 552 para 610 (duas das 60 de Matemática são a mesma questão que já existia no banco antigo com resolução: ENEM 2024 q145 e ENEM 2021 q178; a resolução antiga continua valendo nelas).

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

## Conferência no site (lotes 01 a 03)

- `cd app && python3 scripts/converte.py && npx tsc --noEmit -p . && npx vitest run`: verde (18 arquivos, 766 testes).
- Abertas no navegador (390 px, login de teste): Biologia ENEM 2021 q132 e ENEM 2020 q129; Matemática ENEM 2023 q137, ENEM 2023 q141 e ENEM 2022 q179. Em todas: os 4 blocos na ordem ("Por que eu errei", "Resposta correta" com a pegadinha, "Resolução animada", "Por que as outras estão erradas"), frações empilhadas (inclusive dentro do texto), sem rolagem lateral, sem erro de página. A animação foi assistida até o último passo em três delas (3/3, 5/5 e 3/3).
- Formato da fração nos dados: escrever `a/b` ou `a ÷ b`; o site empilha sozinho. `\frac{}{}` não é lido pelo site e não deve ser usado.

## O que falta (Matemática e Biologia do ENEM, níveis 1 a 6)

- Matemática: níveis 4, 5 e 6 do ENEM (115 questões) e as 2 pendentes.
- Biologia: níveis 4, 5 e 6 do ENEM (50 questões).
- Depois: demais matérias do ENEM e as provas-alvo mais comuns (ver `levantamento.md`).
