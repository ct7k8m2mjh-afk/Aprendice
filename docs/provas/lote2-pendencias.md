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

## Rodada 4 do lote 2 (06/11/2026, em andamento)

Integradas e classificadas (matéria, tema, conteúdo, nível; sem resolução), contagem nos arquivos `prova.json`:

| Prova | Questões válidas | Observação |
|---|---|---|
| UFSM 2025 | 119 | Provas 1, 2 e 3 (aqui 1–40, 41–80, 81–120). 88 anulada. Língua: inglês (quadro "Língua Inglesa" do gabarito, lido pela posição na página). |
| UFSM 2026 | 119 | 48 anulada. Prova 3: 38–40 são de língua (a 40 tem enunciado em português sobre o texto em inglês; o gabarito dá E no espanhol e D no inglês — vale D). |
| UNEMAT 2022/2 | 35 | A–E. No gabarito o espanhol vem antes do inglês. |
| UNEMAT 2023 | 32 | 5, 9 e 27 anuladas. Espanhol antes do inglês no gabarito. |
| UNEMAT 2024/1 | 34 | 32 anulada. |
| UNEMAT 2025/1 | 33 | A–D; 5 e 7 anuladas; 33 e 35 com a alteração do gabarito oficial (B e A). |
| UNEMAT 2026/1 | 32 | A–D; 8, 15 e 17 anuladas. (O link "2026" do site da UNEMAT é o mesmo arquivo da 2026/1.) |
| Unimontes 2024 | 43 | Vestibular Próprio 2024 (Edital 4/2024), Grupo 1, caderno 101 (Biológicas), A–D; 12 e 34 nulas. |
| Unimontes 2025 | 43 | Idem 2025 (Edital 4/2025); 33 e 34 nulas. |
| Unespar 2023 | 57 | Vestibular 2022/2023 (Grupo I); 2, 23 e 54 anuladas. Artes e Educação Física classificadas pelo assunto (arte → fs S01.5; saúde → bio B10.5 etc.). |
| Unespar 2024 | 58 | Gabarito definitivo (Edital 48/2023); 27 e 47 anuladas. |
| Unespar 2026 | 59 | Gabarito oficial (Edital 70/2025); 32 anulada. |

- **UFSM** (resolvido): modo novo `faixas_modo: 'largas'` em `recorta.py` — a página é de duas colunas, menos as faixas
  onde há linha de texto, figura ou fio que atravessa a calha (figura com texto da coluna direita ao lado não conta);
  o número da questão logo acima de uma faixa larga entra nela. As 6 questões que falhavam (2025: 19, 37, 81, 87, 97, 115)
  saem certas; a 19/87/97 tinham a instrução "Para responder à questão N" logo abaixo do número (`suporte_nao_colado` 45);
  a 37/77/117 levavam o aviso "ATENÇÃO – SE VOCÊ OPTOU POR LÍNGUA INGLESA" (agora `corte`); as seções de língua têm setas
  ("→ Língua Inglesa ←"). O caderno termina antes da página da tabela periódica. **Gabarito corrigido**: a leitura antiga
  ficava com o espanhol nas questões 38–40 (o texto do PDF sai fora de ordem); agora vale o quadro "Língua Inglesa".
  2026: dois textos de apoio com a instrução no meio do parágrafo (Prova 1, 01–02; Prova 3, 35–36) começam no início do
  parágrafo (`faixa_errata`).
- **UNEMAT** (2022/2–2026/1): duas colunas, "Questão 01." em negrito; "Texto para a Questão 34" (singular) é texto de apoio.
  2020/2021 sem prova (pandemia).
- **Unimontes**: uma coluna; seções "PROVA DE ..." dão a área. Opções novas em `recorta.py`: `suporte_singular` (instrução
  "responder à questão que a ele se refere" vale só para a questão seguinte) e `cita_textos` ("Para responder à questão 05,
  considere os textos 1 e 2" junta os textos 1 e 2 ao print). 2020–2023 só no arquivo antigo da Cotec (baixar à mão).
- **Unespar**: uma coluna; seções "Questões de 05 a 11 (Português)"; o número de página no pé ao lado de "QUESTÃO 32"
  não corta mais a página (`rodape_lado`) e é pintado de branco (`apagar`). 2019/2020 fora do período; 2020/2021 e
  2021/2022 sem objetiva; Vestibular 2025 só com gabarito provisório (fora).
- Conferência: `chk.py`/`vaza.py` (alternativas e texto depois da última alternativa) em todas; amostra visual de ~10% dos
  prints; classificação revisada questão a questão sobre o rascunho do classificador (correções em ~45% das questões).

Continuação da rodada 4 (mesmo dia):

| Prova | Questões válidas | Observação |
|---|---|---|
| URCA 2023.1 | 116 | Prova I (Fís, Mat, Quí, Bio: 1–60) + Prova II (His, Geo, Por, Inglês: aqui 61–120); nulas 29, 31, 55, 97. |
| URCA 2023.2 | 111 | Nulas 3, 9, 12, 21, 42, 46, 50, 57, 92. |
| URCA 2024.1 | 116 | Nulas 16, 22, 23, 30. |
| URCA 2024.2 | 109 | Gabarito do 1º dia "corrigido"; nulas 1, 27, 33, 39, 53, 84, 99, 100, 106, 113, 118. |
| URCA 2025.1 | 118 | Gabarito único dos 2 dias; nulas 17, 35. |
| URCA 2025.2 | 117 | Nulas 1, 9, 95. |
| URCA PSU out/2025 (2025.2 demais campi / 2026.1 Iguatu) | 115 | id `urca-2025-3`; nulas 5, 23, 25, 57, 68. |
| URCA 2026.1 | 117 | Nulas 4, 6, 95. |
| UEG Medicina 2024/2 | 59 | Núcleo de Seleção, processo 332, prova tipo 1; 60 anulada. Discursiva e redação fora. |
| UEG Medicina 2025/2 | 58 | Processo 354 (aplicação original, não a reaplicação); 24 e 53 anuladas. |
| UEG Medicina 2026/1 | 58 | Processo 378; 31 e 34 anuladas. |

- **URCA**: cadernos em LaTeX, duas colunas com figuras e textos de largura total → mesmo modo `faixas_modo: 'largas'` da
  UFSM (calha em x≈290: a coluna direita começa em 295,5). Âncora "NN. (URCA/AAAA.S)"; área pela posição (blocos de 15).
  Textos de apoio "Texto II - Questões 48 a 51" e "Leia o texto a seguir (...) e responda às questões" (sem números: vale
  até o próximo texto ou seção, `suporte_secao`); "Leia o texto abaixo e marque..." é enunciado, não texto de apoio.
  Gabarito em grade por matéria; o 2º dia recomeça em 1; o quadro de inglês vale, o de espanhol não. O texto (busca) dos
  cadernos em LaTeX agora junta os acentos soltos ("Hist´oria" → "História") — `recorta.texto()`; falta o "´ı" (i sem
  ponto), que ainda aparece em algumas palavras do texto de busca (o print está certo). 2022.2 sem caderno no site (fora);
  PSU 2026.2/2027.1 só com gabarito preliminar (fora). Corrigido o caso apontado pelo teste "texto de outras questões"
  (2023.2 q107 levava o "Texto II"): a 107 termina na alternativa E e a 108–111 recebem o Texto II.
- **UEG Medicina**: links localizados na página de cada processo do Núcleo de Seleção (POST em `detalhe_processos.asp`
  com o código do processo). Mesmo layout do vestibular geral; a área vem da posição (1–5 inglês), porque o caderno não
  tem títulos de matéria. 2020/2021 (processos 254/276): Medicina 2021 suspensa, sem caderno. **Observação para quem cuida
  das provas da UEG geral (não alterei):** nelas todas as questões ficaram com área "Inglês" (a seção de língua não
  fecha); a matéria/conteúdo de cada questão está certa, só o rótulo de área do simulado.
- Classificação da URCA: matéria pela posição; conteúdo e nível revisados questão a questão (1–105); inglês (106–120)
  ficou como leitura (I01.3/I02.x) conferido por amostra.

**Falta (não iniciado nesta rodada):** Unicentro (caderno único com blocos por grupo de cursos: decidir qual bloco vira
simulado), UNIRG (4 tipos de caderno; usar o tipo 1), Unitins, UVA (até 2024.1 com prova específica por curso), PUC-Rio,
PUCPR (apagar o destaque azul da resposta), PUC Minas, Mackenzie, Fempar, FGV, Mauá, EMESCAM.

### Correções da auditoria separada da rodada 4 (`docs/auditorias/lote2-rodada4.md`, 06/11/2026)

- **URCA (8 provas): transcrição desligada** (`sem_transcricao`): o texto dos cadernos em LaTeX não sai fiel (acentos
  soltos, resto de "NN. (URCA/…)", parágrafos partidos, "€" virando "C"); as 438 questões aparecem pelo print.
- **Prints**: URCA 2025.1 117–120 sem o "Texto 5 – Questão 56" (novo `texto_n_com_faixa`: "Texto N – Questão X" vale
  só para as questões que declara) e 119 com a Q58 anexada; URCA 2023.1 #118 com o Texto 3 (`apoio_de`); URCA 2023.2
  #16 e 2024.2 #17 com a fração inteira no alto (novo `ancora_dy`: a questão começa acima do numerador); UEG Medicina
  2026/1 #5 com a instrução e a tirinha inteira; UFSM 2025 #18 sem os "0" da outra coluna (calha da página 11).
- **Transcrição → print**: Unespar 2023 #33 (fórmula estrutural), UNEMAT 2026/1 #6, #13, #27, UNEMAT 2023 #28, #35,
  Unimontes 2024 #15.
- **Classificação**: as 14 questões gerais e as 9 de inglês listadas foram corrigidas (UEG Medicina 2026/1 #46 → bio
  B01.4 etc.); URCA 2024.1 #97 (contar fonemas) ficou só com o tema P07 (não há conteúdo de fonologia na taxonomia: fica
  no simulado, fora dos exercícios até existir o conteúdo); URCA 2025.1 #32 (vidrarias de titulação) → Q03.5.
  **Nível do inglês da URCA** com régua fixa por tipo: localizar informação (I01.3) 3; vocabulário (I02) 4; gêneros,
  tirinha, título (I01.x) 4; inferência, tom e referência/conectivo (I01.4, I01.6, I03) 5.
- **Título**: UNEMAT 2023 → "UNEMAT 2023/2" (fase 2023/2; id `unemat-2023` mantido).
- **Rótulo de área do simulado** pela matéria da questão (`area_da_materia`): UEG geral (13 provas, antes tudo
  "Inglês"), UFSM, UNEMAT e UEG Medicina (antes "Conhecimentos gerais").
- Nota da UFSM 2026 Prova 3 q40 corrigida (é de língua).
- **Não corrigido (acabamento, sem perda de conteúdo):** áreas em branco grandes no fim de alguns prints da URCA (o fio
  da coluna e o traço do pé da página impedem o corte automático) e o arco decorativo no canto da Unespar 2024 #32.
  Direitos (Brasil Escola/InfoEscola citados como fonte em UNEMAT 2022/2 #8, #9 e UEG Medicina 2025/2 #34): decisão do dono.

## Rodada 5 do lote 2 (06/11/2026)

Integradas e classificadas (matéria, tema, conteúdo, nível revisados questão a questão; sem resolução), contagem nos
arquivos `prova.json`:

| Prova | Questões válidas | Observação |
|---|---|---|
| Unicentro 2022, 2023, 2024, 2026, 2027 | 94, 95, 91, 91, 95 | Caderno único: Português 1–10, Inglês 11–15, Arte, Biologia, Filosofia, Física, Geografia, História, Matemática, Química e Sociologia (9 cada, aqui 16–96; número do caderno em `nq`). 2026 e 2027: só o caderno "com respostas" tem camada de texto (2027 sem respostas é imagem) — a resposta em vermelho (texto e fórmula) é repintada de preto no print. Anuladas pelo edital fora. 2025: caderno não publicado. |
| UNIRG Medicina 2022/1, 2022/2, 2023/2, 2024/1, 2024/2, 2025/2, 2026/1, 2026/2 | 53, 52, 51, 54, 53, 54, 54, 52 | Campus Gurupi, caderno tipo 1, A–D; inglês. Três diagramações. 2024/1: as duas trocas de gabarito por "erro administrativo" já estão no definitivo (conferido). 2023/1 fora (só gabarito preliminar). |
| Unitins 2022/2, 2023/2, 2024/2, 2025/2, 2026/2 | 50, 50, 48, 49, 49 | Vestibular presencial, 50 A–E; faixas largas + duas colunas. As edições "todos os câmpus" (2023/1–2026/1, cadernos 1 e 2) ficaram para depois. |
| UVA 2024.1, 2025.1, 2026.1 | 55, 50, 54 | A–D; 2024.1 = Conhecimentos Gerais (as específicas por curso fora). 2022.1/2023.1: caderno só em imagem (fora). |
| PUC-Rio 2024, 2025, 2026, 2027 (grupo 4) | 54, 55, 60, 60 | Inglês (1º dia, 1–10) + objetivas do 2º dia. Gabarito = caderno "com gabarito" (destaque amarelo) lido por programa; "QUESTÃO ANULADA" impressa tira a questão (2024 q25). |
| PUCPR Medicina 2024/2, 2025/1, 2025/2, 2026/1, 2026/2 | 59, 59, 59, 57, 60 | O gabarito definitivo é o caderno com a resposta em ciano/amarelo: lido do destaque e apagado no print. Questões com carimbo vermelho de anulação ou de troca de gabarito ficam fora (o carimbo cobre o enunciado). |
| PUC Minas Medicina 2024/1, 2025/1, 2026/1, 2027/1 | 45 cada | A–D, questões 1–45; língua (46–50) fora: o gabarito tem uma só coluna, sem dizer se é inglês ou espanhol. |
| Mackenzie 2022/2, 2026/1, 2026/2, Medicina 2027/1 | 60 cada | A–E; 2023–2025 sem caderno no site. |
| Fempar Medicina 2021, 2026 | 80, 80 | Banca FGV, tipo 1, inglês. 2025: só gabarito; 2027: gabarito preliminar. |

- **Não integradas:** FGV (sem acervo; 2027.1 só com gabarito preliminar), Mauá (prova on-line com alternativas sem letra),
  EMESCAM (Fundep atrás de Cloudflare; 2022/1 sem confirmação de gabarito definitivo). Detalhes em `baixar-a-mao.md`.
- **Ferramentas novas** (`recorta.py`, opcionais por prova): `so_secao` (cada matéria de um caderno único lida como
  caderno à parte), `ancora_bloco` (número centrado ao lado do parágrafo ou da figura), `ancora_isolada` (número de
  parágrafo com texto na mesma linha não é questão), `largas_alternativas` (linha de alternativas lado a lado atravessa a
  calha), `corte_espacado` (título em letras espaçadas), `ultima_continua`; `neutraliza` apaga marca-texto ciano/amarelo;
  `trechos_coloridos` também pega fórmula desenhada; no modo `largas`, imagem de fundo de página inteira não conta.
  `provas.gab_destacado` lê gabarito publicado como caderno com a resposta destacada (PUC-Rio, PUCPR). `baixa.py`
  continua download interrompido (Range) e repete conexão recusada.
- Conferência: `chk.py` (alternativas e texto depois da última) em todas; folha de contato dos prints de todas as provas
  (inteira em parte delas) e prints suspeitos abertos; pixels vermelhos/ciano conferidos nos prints de cadernos com
  resposta marcada; `converte.py` + testes de provas passando.

## ENEM 2020–2022 e triagem (09/11/2026)

Decisão do dono (09/11/2026): baixar provas só a partir de 2020. Do ENEM, só a aplicação regular de 2020, 2021 e 2022
(PPL, digital e reaplicação ficam fora); das demais provas da triagem do comando 21, só as de 2020 em diante. O ENEM
2003–2019 não entra: os arquivos parciais baixados nesta tarefa foram apagados (nenhuma prova já integrada foi tocada) e as
questões de site ligadas a essas edições continuam como estão (viram Questão Aprendice depois).

Integradas e classificadas (matéria, tema, conteúdo, nível; sem resolução), contagem nos arquivos `prova.json`:

| Prova | Questões válidas | Observação |
|---|---|---|
| ENEM 2020 | 178 | Caderno azul (1º dia: 1; 2º dia: 7), inglês. 135 e 157 anuladas. |
| ENEM 2021 | 179 | 138 anulada. Camada de texto do caderno em codificação própria: o texto de busca vem do OCR do próprio print (`texto_ocr_print`); sem transcrição (só o print). |
| ENEM 2022 | 179 | 157 anulada. Marca-d'água "ENEM 2022" girada na calha apagada do print e do texto (`apagar_girado`). |
| Unitins 2025/1 (Todos os Câmpus, caderno 1) | 46 | 10, 24, 26 e 28 anuladas. A questão de site W237add0 é a 30. Gabarito com linha quebrada lido por `_unitins_gab_quebrado`. |
| PUC-Rio 2024 – Grupo 2 | 45 | Manhã: inglês (1–10) + Matemática e Ciências da Natureza do 2º dia (aqui 11–45). A questão de site W39cb2bf é a 40. |

- **Gabarito do ENEM** conferido questão a questão com os microdados oficiais do INEP (`ITENS_PROVA_<ano>.csv`, lido por
  HTTP Range de dentro do zip, em `fabrica_saida/ingestao/enem-itens/`): 100% iguais ao PDF do gabarito azul.
- **Nível do ENEM** (1–10) pelo parâmetro de dificuldade da TRI (`NU_PARAM_B`) de cada item, em quantis por área com a
  mesma distribuição usada no ENEM 2023–2025; os 9 itens sem parâmetro (retirados do cálculo da nota pelo INEP) receberam
  nível por avaliação da questão. Matéria/tema/conteúdo revisados questão a questão (texto e, nas de figura, o print).
- **Recorte do ENEM 2020–2022** (`enem_2020_2022` em `provas.py`): modo `faixas`/`largas` (questão de largura total no meio
  de páginas em duas colunas) + `faixas_uma_auto` (página inteira de largura total vira uma coluna só); fio do cabeçalho e do
  rodapé por ano; `ancora_folga` (entrelinha apertada: a última linha da questão anterior não entra no print seguinte e não
  é cortada). Folha de contato de todos os prints das três provas conferida; prints sem letra de alternativa na camada de
  texto (alternativas em figura) abertos um a um e registrados no teste (`SEM_LETRA_NO_TEXTO`).
- **Triagem** (`app/scripts/triagem_site.py`): prefixos URCA, Unitins e PUC-Rio passam a contar como provas no site; "2ª
  aplicação"/"reaplicação" do ENEM conta como PPL. Viraram questão de prova (texto e print conferidos): W845df46, W18d5d4d
  ("Enem 2021" = ENEM 2020, aplicado em jan/2021), Wc4a3e7e, Wa98db9a (ENEM 2020), W4f69629 (URCA 2025.1 q45), W237add0
  (Unitins 2025/1 q30) e W39cb2bf (PUC-Rio 2024 grupo 2 q40). O progresso do aluno vai para elas pela migração existente
  (`questoesRetiradas.ts`, gerado pelo `converte.py`); ids não mudam.
- **Ficou de fora:** ENEM PPL, digital e reaplicação (todas as edições); ENEM 2003–2019; Unitins 2021/1 (caderno em
  manutenção no site — `baixar-a-mao.md`); questão W3ecc05a (ENEM 2020, não está na aplicação regular).

## Rodada 6 do lote 2 (09/11/2026)

Meta (comando 14, 09/11): cada instituição com provas de 2020 a 2026 ou, onde não houver, no mínimo 3 anos; só a partir
de 2020; só múltipla escolha. Tabela completa por instituição e ano: `cobertura.md`. ENEM ficou com o outro agente.

Integradas e classificadas (matéria, tema, conteúdo, nível revisados questão a questão; sem resolução):

| Prova | Questões válidas | Observação |
|---|---|---|
| PUC-Campinas Medicina 2021, 2022, 2023, 2024 | 40 cada | Prova Geral (a Específica dessas edições é discursiva). Gabarito oficial publicado como imagem: transcrito e conferido na imagem ampliada. 2023 e 2024 sem texto legível no PDF: OCR só para localizar (print = página). |
| PUC-Campinas Medicina 2025, 2026 | 70, 70 | Prova Geral (1–50) + Específica (aqui 51–70). 2026: gabaritos em imagem. |
| Acafe Medicina Verão e Inverno 2021, Inverno 2022, Verão e Inverno 2023, Verão 2024 | 62, 59, 58, 60, 60, 61 | A–D, inglês. Verão 2024: gabarito retificado (q21 = D, conferido). Fora: 2020 (pacote só com gabarito PRELIMINAR) e Verão 2022 (o "gabarito oficial" é o preliminar). |
| FCM-MG Medicina 2021/2, 2022/1, 2023/1, 2023/2 | 54, 54, 53, 58 | A–D; matéria pela coluna do gabarito definitivo. |
| PUC Minas Medicina 2021/2, 2022/2, 2023/1 | 45 cada | 1–45 (língua fora, como nas outras edições). 2023/1: gabarito com Medicina e outros cursos no mesmo PDF (lido só o de Medicina). |
| PUCPR Medicina 2023/1, 2023/2, 2024/1 | 60, 60, 57 | Destaque ciano/amarelo lido e apagado. 2024/1: 12, 26, 43 com carimbo de anulação. |
| PUC-Rio 2020 e 2023 (grupo 4) | 54, 55 | 2020: gabarito comentado oficial (q36 do 2º dia anulada). 2023: q22 do 2º dia (aqui 32) com destaque só na fração — conferida (E). |
| UECE 2024.1 (1ª fase) | 85 | A–D, inglês, gabarito 1. Única edição com gabarito DEFINITIVO em PDF (Comunicado 237/2023; q26 = C). Educação Física classificada pelo assunto (esporte → S01.5; fisiologia → Biologia). |
| Unifesp Medicina 2022 e 2026 | 25, 25 | Sistema Misto, prova 1 objetiva (Português e Inglês), versão 1, Vunesp. 2022 q23 leva também o texto das questões 16–22, que ela compara. |
| Fema (Assis) Processo Seletivo 2021 e 2022 | 25, 25 | Cursos gerais; gabarito na última página do PDF oficial. |

Total da rodada: **29 provas, 1.485 questões**. Também classificadas as 40 questões da São Camilo 2024/2 (que estavam sem
matéria) e 14 avulsas que só tinham o tema (FMABC, Cederj, Fatec, UDESC); a São Camilo segue o tema das resoluções
aprovadas onde elas já o fixavam. Fica sem conteúdo só a URCA 2024.1 q97 (fonemas: não há conteúdo de fonologia).

- **Tentadas e deixadas de fora (motivo técnico, com arquivos baixados):** UNEB 2022 e 2023 (duas colunas com textos,
  imagens e páginas de largura total intercalados: o recorte troca pedaços entre questões vizinhas); PUC-SP Verão 2020
  (diagramação de revista) e 2021–2023 (prova on-line publicada só como "correção", sem número nem letra nas
  alternativas); PUCPR 2022/1 e 2022/2 (caderno-gabarito sem as letras das alternativas) e 2021 (Vestibular 4.0
  digital); PUC-Rio 2021 e 2022 (só pacote .zip com gabarito comentado em outro formato).
- **Gabarito não definitivo (princípio 2):** UECE 2020.1, 2020.2, 2023.1, 2023.2, 2024.2, 2025.2, 2026.1 (só preliminar em
  PDF); Acafe 2020 e Verão 2022; UEMS (só 2023 tem definitivo, e o caderno correspondente não foi identificado com
  segurança).
- **Certo/errado e somatória (fora por decisão do dono):** UnB PAS 3, UEM e UFSC (registradas em `formatos-pendentes.md`).
  Os poucos itens tipo C (A–D) da UnB não foram separados nesta rodada.
- **Baixar à mão: retestado em 09/11 com User-Agent genérico, sem contornar bloqueio:** UEMG (403), UFRGS (conexão
  recusada; e o dono decidiu não comprar provas), UEPG (sem resposta), AFA/EFOMM/EN (desafio Cloudflare), Vunesp e
  Insper (403 Akamai), Fundep/EMESCAM (Cloudflare). Unesp, Unicamp, UERJ, EsPCEx e Unioeste continuam proibidos pelo
  robots.txt. **Novo pedido do dono (09/11):** buscar as provas da Vunesp (Einstein, Santa Casa, Unesp, Famerp, Famema,
  FMJ, FACISB, São Camilo, FAI, Anhembi, Sírio-Libanês, Uni-Facef, UEA, FMABC 2026) em cópias públicas de outros sites,
  registrando a origem — fica para a próxima rodada.
- **Ferramentas:** `recorta.py` lê "questões de números 14 a 16" e "questões números 16 a 18" (o texto passa a valer para
  toda a faixa). Em `provas.py`: `_gab_str` (gabarito publicado como imagem, transcrito), configurações novas por prova.
- **Conferência:** alternativas e texto depois da última alternativa por programa em todas; folha de contato de todas as
  provas novas, prints suspeitos abertos (cortes de rodapé/cabeçalho e textos de apoio corrigidos); pixels vermelhos/
  ciano/amarelo conferidos nos cadernos com resposta marcada; `converte.py` + `tsc` + `vitest` (659 testes) passando.
  Exceção nova no teste de provas, conferida no print: Unifesp 2022 q23. Auditoria separada: amostra sorteada em
  `docs/auditorias/lote2-rodada6-amostra.md` (o agente separado não pôde ser aberto a partir desta sessão — fica para
  o coordenador disparar).
