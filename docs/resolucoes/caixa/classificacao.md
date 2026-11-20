# Caixa da sessão "Fábrica — Classificação"

Formato de `caixa/LEIA.md`. Blocos novos sempre no fim; nenhum bloco antigo se apaga.

## 2026-11-19 22:37 — AVISO PILOTO CLASSIFICAÇÃO — Fábrica — Classificação

**O que é:** a conferência, pela API, do conteúdo (subtema) de todas as 25.798 questões que entram (todas as provas, menos
indisponíveis, anuladas e de outra matéria). Regra: o conteúdo é o que o COMANDO cobra do aluno, não o assunto do texto
de apoio. Programa: `ferramentas/fabrica/classifica_api.py`; prompt: `ferramentas/fabrica/prompts/classifica-sistema.md`.

**Piloto:** 300 questões sorteadas, 150 das apontadas pelo verificador como suspeitas (2.275 no banco; o prompt falava em
1.570, a conta de hoje dá 2.275) e 150 sem suspeita. Rodado duas vezes:

| | Piloto 1 | Piloto 2 (o que vale) |
|---|---|---|
| Triagem | claude-haiku-5-5, lista inteira | a mesma (reaproveitada, não paga de novo) |
| Conferência às cegas | claude-opus-5-5, lista inteira | claude-sonnet-5-5, lista das matérias candidatas |
| Desempate às cegas | claude-opus-5-5 | claude-opus-5-5, sem a lista (só as opções) |
| Mudariam | 139 de 300 | 137 de 300 |
| Custo do piloto | US$ 3,10 | US$ 1,37 (só conferência e desempate) |

Por que mudou: com o Opus na conferência, a projeção do total dava ~US$ 61 só nessa etapa (US$ 0,0069 por questão
conferida, ~8.900 a conferir), acima do teto de US$ 60. A conferência passou para o Sonnet 5.5 (US$ 0,0034), que continua
mais forte que a triagem e separado dela; o Opus ficou no desempate. Também consertei o desempate do piloto 1, que não
usava o cache (o esquema de resposta mudava a cada questão).

**Custo por questão (piloto 2):** ~US$ 0,003 na amostra (que tem metade de suspeitas). **Projeção do total:**
~US$ 52 (triagem US$ 8,4 + conferência US$ 28 + desempate US$ 15), mais US$ 4,47 já gastos em piloto e testes. Cabe nos
US$ 60; o programa não envia nada que faça a soma passar do teto.

**Quantas mudariam:** no piloto 2, 104 de 150 suspeitas (69%) e 33 de 150 sem suspeita (22%). No banco inteiro, a projeção
é de ~6.700 mudanças (26%), 7 de cada 300 mudando de matéria.

**Erro da amostra (minha conferência com agentes que abriram o print):**
- Piloto 1: 30 mudanças de subtema sorteadas, 30 certas (0%); 5 de 5 mudanças de matéria certas.
- Piloto 2: 30 mudanças sorteadas. Em 27 a proposta é a certa; em 1 a classificação antiga era melhor (P86296b35,
  fitorremediação: fica B09.1); em 2 a antiga também estava errada e a nova melhora, mas não é a melhor (P51ca705d vai a
  I01.3, P081d6272 vai a P05.2). Erro: 3% contra a antiga, 10% no critério estrito, dentro do limite. Os três vão corrigidos
  à mão. Mudanças de matéria: 7 de 7 certas.
- A IA marcou 1 questão como "de nenhuma das 9 matérias" (PUC-SP 2024 q49, Expressionismo): não procede (é P12.2). Esse
  caso nunca é aplicado sozinho.
- Sugestões de conteúdo novo: 10 no piloto. As que mais se repetem: **botânica — grupos vegetais e reprodução das
  angiospermas** (flor, fruto, semente, polinização), que hoje não tem conteúdo em B12; e identidades/equações
  trigonométricas em M10. Lista completa sai em `docs/resolucoes/classificacao/sugestoes-novos-subtemas.md`.

Seguindo para o todo sem esperar (27 lotes `classif-<m>-NN`, etapa por etapa).

## 2026-11-20 01:10 — FIM — Fábrica — Classificação

Todas as 25.798 questões conferidas (27 lotes `classif-<m>-NN` + o piloto `classif-todas-01`), aplicadas e commitadas por
matéria (Bio, Quí, Mat, Por, Fís; His, Geo, Ing e FS num commit só, porque o teste quebrou na São Camilo 2024/2 — abaixo —
e as quatro já estavam gravadas nos mesmos `prova.json`). converte + tsc + vitest verdes antes de cada commit (839 testes).

- **Mudaram 6.590 questões (26%)**, 428 delas de matéria. Ficaram 19.207. Sugestão de conteúdo novo: 470 questões.
- **Gasto total: US$ 46,22** (teto US$ 60): triagem US$ 7,97, conferência US$ 22,17, desempate US$ 11,31, agrupamento das
  sugestões US$ 0,30, piloto e testes US$ 4,47. Registrado em `fabrica_saida/gastos.csv`.
- Conferência minha no todo: amostra de 30 mudanças de subtema e 30 de matéria, agentes com o print: 1 erro em cada (3%),
  corrigidos em `docs/resolucoes/classificacao/ajustes-conferencia.json`.
- 413 questões que mudaram de matéria e já tinham resolução entraram nos `pendentes` da matéria nova
  (`registro-<m>.json`, motivo "classificação: resolver na matéria nova"); a resolução antiga ficou onde estava.
- Atenção para a fila: nas 6.590 questões mudadas, os `equivocos` das resoluções existentes ainda apontam o conteúdo
  antigo. O verificador `equivocos_fora` vai apontá-las; o prefixo a corrigir é o da resolução, não a classificação.

Saídas para o dono:
- `docs/resolucoes/classificacao/mudancas.json` (uma linha por questão mudada)
- `docs/resolucoes/classificacao/sugestoes-novos-subtemas.md` (agrupado por matéria e sugestão; o maior vazio é
  botânica em Biologia — grupos vegetais e reprodução das plantas, ~47 questões —, depois Português e Filosofia/Sociologia)
- `docs/resolucoes/classificacao/resumo.md`

Pendências:
RECLASS P1a5d57dd P03.3 -> P02.3      (São Camilo 2024/2: o resolucoes.json antigo da prova fixa materia/tema/conteudo e sobrepõe o prova.json; mudar lá e no prova.json juntos)
RECLASS Pe79f547e H03.4 -> H02.9      (mesmo motivo)
RECLASS P1854a731 H06.7 -> H03.3      (mesmo motivo)
RECLASS P4ba973c3 I02.1 -> I03.2      (mesmo motivo)
OUTRA: a triagem e a conferência disseram "nenhuma das 9 matérias" em 16 questões; NÃO apliquei (na única conferida,
  PUC-SP 2024 q49, Expressionismo, não procede: é P12.2). Para olhar: P0f7c2424, P919354f5, P6a44dbf0, P392145fa,
  P7ea54e91, Pba6e7050, Pd233a30a, Pfc99ec33, P29378ada, Pdbe65b87, P3ab2db95, P0aaed1c4, Pa5ffd05f, P2118aaac,
  P0c0f05ec, Pd5c09dfe.
