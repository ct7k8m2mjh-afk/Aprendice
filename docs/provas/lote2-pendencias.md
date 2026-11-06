# Lote 2 de provas — o que entrou e o que ficou para a próxima rodada (06/11/2026)

Fonte dos links: `inventario-publicas-1.json`, `inventario-publicas-2.json` e `inventario-privadas.json`.
Só entram edições com caderno + gabarito oficial e download livre; anulada ou sem gabarito oficial fica fora.

## Entrou no site

| Prova | Questões válidas | Observação |
|---|---|---|
| FMABC 2020, 2021, 2022, 2023, 2024 | 80 cada | Cadernos e gabaritos oficiais da Vunesp publicados pela FMABC. |
| FMABC 2025 | 78 | Questões 65 e 66 anuladas ("N" no gabarito oficial). |

## Rodada 2 do lote 2 (06/11/2026, em andamento — ver lista ao fim deste arquivo)

### Fatec (2020/1, 2022/2, 2023/1–2026/2): recortada e classificada
- Recorte resolvido com o modo `'colunas': 'faixas'` (recorta.py): a página é dividida em faixas de largura total e faixas
  de duas colunas (a coluna esquerda pode ser estreita, ao lado de figura); figura de largura total nunca é dividida.
  A instrução "Leia o texto..." numa faixa cinza entra inteira (`suporte_caixa`); rodapé "VESTIBULAR" fica fora.
- **2023/1:** o link "Fatec_Gabarito_2023_retificado.pdf" da página oficial é o gabarito do 2º sem/2013 (não confere com
  o caderno). Usado o gabarito oficial do dia (`Gabarito-Vestibular-1sem-2023.pdf`, baixado como `gabarito-original`).
- **2025/1** (banca Idecan, duas colunas): textos das multidisciplinares vêm antes da questão, com título centralizado
  (`suporte_titulo`).

### Cederj (2020.1, 2021.2–2026.2): recortada e classificada
- Duas colunas; número da questão em negrito (os números de linha dos textos não são); "Texto N" vale para todas as
  questões até o próximo texto ou seção (`suporte_secao`); espanhol sai antes do filtro de sequência
  (`pular_antes_sequencia`), fica a do inglês; "Espaço reservado para rascunho" e a redação encerram a questão.
- **Fora:** 2020.2 (caderno só em imagem) e 2021.1 (camada de texto corrompida) — configuradas com OCR em `provas.py`,
  mas o layout irregular não foi conferido; 2022.2 questão 24 (gabarito oficial "S", sem letra) e 2026.1 questão 10 (anulada).

## Baixado, mas não integrado nesta rodada (motivo técnico)

- ~~**Fatec**~~ (resolvido na rodada 2, acima). Texto antigo: cadernos e gabaritos baixados em `fabrica_saida/ingestao/fatec-*` e
  configurados em `ferramentas/ingestao/provas.py` (gabarito já lido com a disciplina de cada questão). Ficou de fora
  porque o caderno mistura páginas de uma e de duas colunas e questões ao lado de figuras; o recorte automático corta
  parte das questões nessas páginas. Precisa de ajuste página a página antes de ir ao ar.
- ~~**Cederj**~~ (rodada 2, acima). Texto antigo: baixado em `fabrica_saida/ingestao/cederj-*`. Duas colunas, números de linha dos textos
  parecidos com número de questão (o recorte já distingue pelo negrito), língua estrangeira repetida (43–45 em espanhol
  e em inglês) e 2020.2 publicado só como imagem. Falta a leitura do gabarito por coluna e a regra "vale a última
  ocorrência" (inglês).
- **UTFPR, UERR, PUCRS (ainda não integrados — próxima prova a fazer):** UTFPR 2025 re-baixada (caderno e gabarito
  íntegros agora). UERR é Cebraspe A–E (letras sem parênteses, "A texto"); o gabarito tem as questões 10 e 11 duas vezes
  (opção de língua) — conferir no caderno qual bloco é o inglês antes de configurar. PUCRS 2025 já está íntegra no disco.
  Texto antigo: baixados (`fabrica_saida/ingestao/utfpr-*`, `uerr-*`, `pucrs-*`; UTFPR 2025 e PUCRS 2025 com
  falha de conexão no download — repetir). Não houve tempo de configurar o layout.

## Não iniciado nesta rodada

UEG (geral e Medicina), UFJF (PISM III), UEMA (PAES), UFSM, UNEMAT, Unimontes, Unespar, Unicentro, UNIRG, Unitins,
URCA, UVA, PUC-Rio, PUCPR, PUC Minas, Mackenzie, Fempar, FGV, Mauá e EMESCAM. As observações do inventário continuam
valendo (ex.: PUCPR — o arquivo oficial é o caderno com a resposta destacada em azul: o print precisa apagar o destaque;
Unicentro 2026/2027 — caderno "com respostas"; PUC-Rio — objetivas e discursivas misturadas por grupo; EMESCAM 2024+ e
Fempar 2027 — baixar à mão ou aguardar gabarito definitivo).

## Formato fora de A–E/A–D

UFSC (somatória) registrada em `formatos-pendentes.md`.

## Rodada 2 — situação ao parar (06/11/2026)

Integradas e classificadas (matéria, tema, conteúdo, nível; sem resolução): Fatec 10 provas (560 questões) e Cederj
12 provas (552 questões). Conferência: alternativas A–E/A–D presentes no texto de todas, nada de texto de apoio vazando
depois da última alternativa, amostra visual de 10% dos prints e da classificação; simulado conferido em Fatec 2025/1,
Cederj 2024.1 e Fatec 2022/2 (computador claro, 390 px claro e escuro). `converte.py` + `vitest` passando.

Correção que afeta todas as provas que usam `apagar` (só a Fatec usa): a pintura de branco agora só vale no alto/pé da
página — antes um número solto ("1", "6") no meio da página era apagado (sumiam frações, eixos e células de tabela).

Ferramentas novas em `recorta.py` (opcionais, por prova): `colunas: 'faixas'`, `suporte_caixa`, `suporte_titulo`,
`rodape_rx`, `suporte_secao`, `pular_antes_sequencia`, `secao_sem_marcador`, `texto_n_sem_faixa`.

**Falta (nesta ordem):** UTFPR, UERR, PUCRS; depois UEG (geral e Medicina), UFJF (PISM III), UEMA (PAES), UFSM, UNEMAT,
Unimontes, Unespar, Unicentro, UNIRG, Unitins, URCA, UVA, PUC-Rio, PUCPR, PUC Minas, Mackenzie, Fempar, FGV, Mauá, EMESCAM.
Cederj 2020.2 e 2021.1 (OCR) também ficam para depois.

## Rodada 3 do lote 2 (06/11/2026, em andamento)

Integradas e classificadas (matéria, tema, conteúdo, nível; sem resolução), contagem nos arquivos `prova.json`:

| Prova | Questões válidas | Observação |
|---|---|---|
| UTFPR 2024 | 58 | 52 e 59 anuladas. Inglês 13–18 (1ª letra da coluna de língua do gabarito). |
| UTFPR 2025 | 59 | 51 anulada. |
| UTFPR 2026 | 39 | 34 anulada; layout novo (número em negrito, alternativas "a)"). |
| UERR 2025 | 68 | Cebraspe. No gabarito, 10–18 aparecem duas vezes: o 1º bloco é o inglês (no caderno o inglês vem antes do espanhol). 2, 54, 57 e 62 anuladas. |
| UERR 2026 | 69 | Idem; 43, 49 e 50 anuladas. |
| PUCRS 2022 | 68 | Prova de Medicina, A–D; 14 e 31 anuladas. Inglês = 2ª coluna 1–10 do gabarito. |
| PUCRS 2023 | 70 | |
| PUCRS 2025 | 70 | Gabarito com a errata oficial (36 = D). |
| PUCRS 2026 | 67 | 4, 33 e 43 anuladas. |

- Ferramentas novas em `recorta.py` (opcionais, por prova): `suporte_apos_alt` (texto de apoio sem frase de
  indicação, impresso entre a última alternativa e a próxima questão), `suporte_apos_secao`, `suporte_nao_colado`,
  `alt_span_isolada`, `texto_id` (textos com nome, ex.: "Texto 1A4-II" da Cebraspe), `suporte_cadeia`,
  `suporte_cita_max`, `suporte_palavras`, `faixa_unica` ("à questão 30" vale só para a 30), `anexa` (questão que usa o
  texto de dentro da anterior: "Ainda baseado no texto da questão anterior" — UTFPR 2024 q12, 2025 q18), `sem_apoio`.
- Correções gerais: o pé da última linha antes da questão seguinte não é mais cortado quando a entrelinha é apertada;
  separador "_____" corta no traço (não na caixa da linha).
- **Cederj 2020.2 e 2021.1 continuam fora:** no OCR a numeração é "1." (sem zero), números de questão se perdem
  (ex.: 2020.2 questão 7) e as questões de língua vêm misturadas; o layout não fica perfeito.

Continuação da rodada 3 (mesmo dia):

| Prova | Questões válidas | Observação |
|---|---|---|
| UEG 2020/1 | 52 |  |
| UEG 2021/1 | 52 |  |
| UEG 2021/2 | 50 | anuladas/fora: 3, 19 |
| UEG 2022/1 | 50 | anuladas/fora: 14, 16 |
| UEG 2022/2 | 52 |  |
| UEG 2023/1 | 51 | anuladas/fora: 18 |
| UEG 2023/2 | 52 |  |
| UEG 2024/1 | 52 |  |
| UEG 2024/2 | 52 |  |
| UEG 2025/1 | 51 | anuladas/fora: 39 |
| UEG 2025/2 | 52 |  |
| UEG 2026/1 | 48 | anuladas/fora: 15, 27, 29, 32 |
| UEG 2026/2 | 51 | anuladas/fora: 37 |
| UEMA PAES 2020 | 60 |  |
| UEMA PAES 2021 | 87 | anuladas/fora: 36 |
| UEMA PAES 2022 | 59 | anuladas/fora: 42 |
| UEMA PAES 2024 | 59 | anuladas/fora: 45 |
| UEMA PAES 2026 | 60 |  |
| UFJF PISM 2020 – Módulo III | 40 |  |
| UFJF PISM 2022 – Módulo III | 38 | anuladas/fora: 22, 26 |
| UFJF PISM 2023 – Módulo III | 37 | anuladas/fora: 34, 35, 36 |
| UFJF PISM 2024 – Módulo III | 40 |  |
| UFJF PISM 2025 – Módulo III | 38 | anuladas/fora: 11, 15 |
| UFJF PISM 2026 – Módulo III | 39 | anuladas/fora: 37 |

- **UEG** (13 edições, 2020/1 a 2026/2; vestibular geral): uma coluna por página (imagem e questão lado a lado ficam no mesmo
  recorte); no gabarito as questões 1–4 aparecem duas vezes (espanhol, depois inglês): vale a 2ª (conferido na 2025/1).
  "Espaço para rascunho" vira pausa (a questão continua na página seguinte). 2022/1: o caderno diz "questão 4" antes da 48
  (errata no `provas.py`). 2025/1 q11 leva junto o recorte da q10 (a imagem das duas está dentro da 10).
  **UEG Medicina: não feita** — os cadernos/gabaritos do vestibular de Medicina não estão no inventário (só os códigos do
  Núcleo de Seleção); precisa localizar os links.
- **UFJF PISM III** (2020, 2022–2026): só as objetivas dos dois dias (2º dia = 21–40), caderno Saúde; discursivas e redação
  fora. "C ou E" / "D/E" (duas respostas) = fora. 2023: a questão 16 do 2º dia está impressa como "QUESTÃO 1" (âncora
  forçada). 2021 sem caderno no site (fora). Cadernos 2025–2026 feitos em LaTeX: o recorte junta os acentos soltos.
- **UEMA PAES** (2020, 2021 [2 dias, 2º numerado 45–88], 2022, 2024, 2026): língua 16–20 (2021: 9–12) = 1ª coluna (inglês).
  2023 e 2025 sem caderno no site oficial (fora). Links da 2020 trocados para https (o servidor serve os dois).
- **UFSM 2025 e 2026: baixadas e configuradas, FORA do site** — páginas misturam texto de largura total com números de linha
  e duas colunas, tirinhas com números em negrito e um aviso de língua no lugar da questão 37; o recorte ainda falha em parte
  das questões (2025: 19, 37, 81, 87, 97, 115).
- Conferência: alternativas e texto depois da última alternativa por programa (`chk.py`; alternativas em imagem —
  UFJF 2020–2024 usa letras desenhadas — conferidas no print), amostra visual dos prints e 60 questões sorteadas (3%) +
  revisão de todas as classificações uma a uma ao classificar; 2 correções na amostra.

**Falta (nesta ordem):** UEG Medicina (links), UFSM (layout), UNEMAT, Unimontes, Unespar, Unicentro, UNIRG, Unitins, URCA,
UVA, PUC-Rio, PUCPR (apagar o destaque azul da resposta), PUC Minas, Mackenzie, Fempar, FGV, Mauá, EMESCAM.
