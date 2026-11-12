# Provas de 2020 a 2026 que ainda faltam, por instituição e ano


> **Regra nova (dono, 11/11/2026, princípio 2):** prova sem gabarito publicado, ou só com o preliminar, agora pode entrar: cada questão fica fora do ar até ganhar o gabarito do Aprendice (dois especialistas, às cegas, na mesma letra; e a do preliminar, se houver). Anulada continua fora. As notas abaixo de "fora por falta de gabarito" são o registro de antes da regra.

## Provas sem gabarito definitivo — rodada de 11–12/11/2026 (princípio 2 novo)

Antes de cada prova procurou-se na web o gabarito definitivo oficial (site da banca) e, sem ele, resolução publicada.
Configuração: `ferramentas/ingestao/provas_sem_gabarito.py` (reaproveita o recorte da mesma banca); `recorta.py` aceita
`sem_gabarito_oficial` (questão com `gab: null` e a letra do preliminar em `gab_preliminar`; anulada continua fora).
Essas questões entram fora do ar ("gabarito do Aprendice em preparação") até a resolução dupla às cegas (`lote.py`).
Todas classificadas (matéria, tema, conteúdo, nível) e conferidas por folha de contato + prints da 1ª, do meio e da última.

**Entraram com gabarito oficial definitivo achado na web** (entram normalmente, com `gab`):

| Prova (id) | Questões | Gabarito definitivo achado |
|---|---|---|
| UECE 2023.1 – 1ª fase (`uece-2023-1`) | 84 de 85 (39 anulada) | Comunicado 209/2022-CEV/UECE (www.cev.uece.br) |
| UECE 2023.2 – 1ª fase (`uece-2023-2`) | 82 de 85 (4, 42, 43) | Comunicado 51/2023-CEV/UECE |
| UECE 2024.2 – 1ª fase (`uece-2024-2`) | 79 de 85 (16, 29, 30, 35, 57, 79) | Comunicado 49/2024-CEV/UECE |
| UECE 2025.1 – 1ª fase (`uece-2025-1`) | 85 de 85 | Comunicado 153/2024-CEV/UECE |
| UECE 2026.1 – 1ª fase (`uece-2026-1`) | 84 de 85 (85) | Comunicado 190/2025-CEV/UECE |
| Fempar Medicina 2027 (`fempar-2027`) | 80 de 80 | Gabarito definitivo já publicado pela FGV (conhecimento.fgv.br/processoseletivo/fempar27) |
| UNIRG Medicina 2022/1 – Paraíso (`unirg-2022-1-paraiso`) | 54 de 54 | Gabarito definitivo (08/12/2021) no site da UNIRG |
| Unespar 2025 (`unespar-2025`) | 57 de 60 (6, 16, 56) | O arquivo "gabarito-provisorio-2025.pdf" do site é o Edital 045/2024-CCCV, gabarito oficial |

**Entraram só com o gabarito preliminar** (`gab: null` + `gab_preliminar` em todas as questões):

| Prova (id) | Questões (todas sem gabarito, com preliminar) | Observação |
|---|---|---|
| UFT 2023/2 (`uft-2023-2`) | 76 | Só o gabarito provisório da Copese; definitivo não localizado. |
| UFT 2024/2 (`uft-2024-2`) | 74 de 76 | Resolvido em 12/11/2026: gabarito definitivo oficial achado (docs.uft.edu.br/s/jfgYJWwVR3Os4kALusUSog, link da página oficial) e aplicado; anuladas são 29 e 30 da tarde (aqui 61, 62), não 39 e 40 como dizia a notícia; 71 e 72 voltaram. Ver `gabaritos-corrigidos.md`. |
| UFRR 2024, 2025, 2026 (`ufrr-2024`…`-2026`) | 72 cada | Definitivo publicado (Editais 97/24 e 93/25) em editais.ufrr.br, que não responde daqui; anulações do oficial não conferidas. |
| IME 2023/2024 e 2024/2025 (`ime-2024`, `ime-2025`) | 40 cada | Site do IME com cadeia TLS incompleta; cópia do definitivo só em servidor que proíbe robôs. |
| UECE 2025.2 – 1ª fase (`uece-2025-2`) | 82 de 85 | Preliminar + pareceres (Comunicado 81/2025: 22, 55, 82 anuladas, nenhuma letra alterada). |
| URCA PSU 2026.2/2027.1 (`urca-2027-1`) | 120 | Provas de 31/10–01/11/2026: só o preliminar no site da CEV-URCA. |
| UNIRG Medicina 2023/1 (`unirg-2023-1`) | 52 de 54 | O arquivo "gabarito oficial" é o preliminar (25 e 37 anuladas nele). |
| UNIRG Medicina 2027/1 (`unirg-2027-1`) | 54 | Prova de 01/11/2026: só o preliminar. |
| Acafe Medicina Verão 2022 (`acafe-2022-verao`) | 60 de 63 | "Gabarito oficial 22_1" é o preliminar (31–33 anuladas nele). |
| UEMG 2022 (`uemg-2022`) | 48 | Instituto AOCP; gabarito saiu antes dos recursos (preliminar); site da UEMG recusa acesso automático. |
| EMESCAM Medicina 2022/1 (`emescam-2022-1`) | 60 | Quadro de gabaritos sem marca de definitivo; Fundep atrás de Cloudflare (não contornado). |

Total: 22 provas, 1.527 questões; 922 sem gabarito publicado (todas com a letra do preliminar), 605 com gabarito definitivo.

**Ficaram fora nesta rodada e por quê:**
- **Unioeste 2023–2026:** o definitivo existe, mas o site da Unioeste e as cópias achadas (CDN do Estratégia) proíbem robôs no
  robots.txt; o preliminar teve muitas anulações no definitivo (2025) — entrar só com ele seria arriscado. Baixar à mão.
- **Acafe Verão 2020:** só existe a prova comentada, com a justificativa e a letra certa coladas em cada questão (o print
  revelaria a resposta).
- **UECE 2ª fase (2023.1–2026.1), EaD 2023.2 e UAB 2020:** não feitas nesta rodada (muitos cadernos; os comunicados de
  pareceres da 2ª fase estão no site da CEV — próxima rodada).
- **UVA 2020.2, Ibiapaba 2021, 2022.1:** caderno só em imagem. **Bahiana:** sem caderno. **UFSC 2023:** somatória (formato fora).
- **UFRR Indígena 2021/2025:** prova específica, fora do padrão do site. **Mackenzie 2020/1, Unifesp 2023/2025, UEMS 2021–2026,
  UESB 2020–2025, UNEB 2024–2026:** não feitas nesta rodada (cadernos a baixar, layouts novos ou gabarito atrás de Cloudflare).

Regras (CLAUDE.md, princípios 1, 2 e 10): só entra prova com caderno + gabarito oficial DEFINITIVO, só questões de
múltipla escolha; anuladas ficam fora; a origem de cada arquivo fica registrada no `prova.json` (campo `origem`).

## Grupo C (UECE, UEPG, Unioeste, Unimontes, UVA, UEMG, UNEB, EMESCAM, Bahiana, UESB) — 11/11/2026

Material: `fontes/provas-manuais/<sigla>/` (links do dono, Brasil Escola) + gabaritos definitivos procurados no site
oficial quando o pacote só trazia o preliminar. Configuração: `ferramentas/ingestao/provas_grupo_c.py`.

### Entraram nesta rodada

| Prova (id) | Questões válidas | Observação |
|---|---|---|
| UECE 2020.2 (`uece-2020-2`) | 80 de 85 | 1ª fase, gabarito 1, inglês; Comunicado 48/2020 (definitivo); 16, 27, 36, 48 e 62 anuladas. |
| UECE 2021.1 (`uece-2021-1`) | 81 de 85 | 1ª fase; Comunicado 31/2021; 28, 34, 47 e 53 anuladas. |
| UECE 2022.1 (`uece-2022-1`) | 84 de 85 | 1ª fase; Comunicado 75/2021; 9 anulada. |
| UECE 2022 – Vestibular Especial EaD (`uece-ead-2022`) | 45 de 45 | Cursos a distância; Comunicado 139/2022 (definitivo). |
| UECE 2020.2 – 2ª fase (`uece-2020-2-f2`) | 197 de 200 | 7 cadernos do gabarito 1 (Português, Inglês, Matemática, Biologia: 20 cada; Física e Química, Geografia e História, Filosofia e Sociologia: 40 cada); Comunicado 02/2021; 45, 70 e 79 anuladas. |
| UECE 2021.1 – 2ª fase (`uece-2021-1-f2`) | 196 de 200 | Idem; Comunicado 37/2021; 73, 114, 117 e 120 anuladas. |
| UECE 2022.1 – 2ª fase (`uece-2022-1-f2`) | 198 de 200 | Idem; Comunicado 88/2021; 80 e 119 anuladas. |
| UECE 2022.2 – 2ª fase (`uece-2022-2-f2`) | 196 de 200 | Idem; Comunicado 115/2022; 63, 79, 111 e 113 anuladas. |
| Unimontes 2024 – PS 1/2024 (`unimontes-2024-ps1`) | 43 de 45 | Processo Seletivo 1/2024 (prova de 10/12/2023), Grupo 1, caderno 101 (Biológicas); gabarito após recursos baixado do site da Coteps; 23 e 26 anuladas. |
| Unimontes PAES 2020 – 3ª etapa (`unimontes-paes3-2020`) | 48 de 50 | Caderno 3 (Biológicas), prova de 19/12/2021; gabarito após recursos; 12 (inglês) e 43 anuladas. |
| Unioeste 2021 (`unioeste-2021`) | 73 de 77 | 1ª etapa (manhã, caderno do inglês, 1–21) + 2ª etapa (tarde, aqui 22–77); gabarito definitivo; 3, 10, 50 e 74 anuladas. |
| Unioeste 2022 (`unioeste-2022`) | 72 de 77 | Idem; 5, 16, 52, 70 e 76 anuladas (as "alteradas" após recurso entram com a letra nova). |
| UEMG 2024 (`uemg-2024`) | 47 de 48 | Conhecimentos Gerais, inglês; gabarito definitivo; 24 anulada. |

Conferência: folha de contato e prints suspeitos abertos em todas; letras das alternativas e texto depois da última
alternativa por programa. Auditoria separada (outra sessão, 11/11): gabarito das 9 provas inteiras conferido com o
oficial definitivo (tudo igual, anuladas iguais); na amostra de 80 questões achou 13 classificações a corrigir
(corrigidas), o texto compartilhado da UECE indo só para a 1ª questão do grupo (corrigido: agora vale até o próximo
texto ou seção, e a questão que cita outro texto o leva também — corrigido também na UECE 2024.1, da rodada 6) e o quadro
de anotações vazio à direita nas páginas de uma coluna da Unioeste (cortado). Colchetes e fios de diagramação da
Unioeste continuam no print (são do caderno).

UECE 2ª fase: segunda auditoria separada (11/11) comparou o gabarito das 787 questões com os comunicados definitivos
(0 divergências, anuladas iguais) e abriu 80 prints da amostra + o fim de cada caderno (nenhum corte ou mistura); 15
classificações corrigidas. Falta na taxonomia um conteúdo de "conceitos e correntes do pensamento geográfico"
(espaço, região, lugar, paisagem; Geografia crítica/cultural): essas questões ficaram em G11.2 até ele existir.

Já estavam no site e não foram duplicadas: UECE 2024.1, Unimontes 2024 (Edital 4/2024) e 2025 (Edital 4/2025 — é o
pacote "Unimontes 2026" do Brasil Escola), UVA 2024.1, 2025.1 e 2026.1.

### O que ainda falta e por quê

| Instituição | Anos (2020–2026) que faltam | Motivo |
|---|---|---|
| UECE | 2020.1 | Link do Brasil Escola quebrado (404); sem caderno. |
| UECE | 2022.2 (1ª fase) | O pacote traz só o gabarito definitivo da 2ª fase; o definitivo da 1ª fase não veio (nem foi achado no site da CEV). |
| UECE | 2023.1, 2023.2, 2024.1 (2ª fase), 2024.2, 2025.1 (1ª e 2ª fase), 2025.2, 2026.1; EaD 2023.2; UAB 2020 | Só gabarito PRELIMINAR (no pacote e no site da CEV, onde a busca só achou o definitivo da 2024.1). 2024.2: nem caderno. |
| UEPG | todos (vestibular 2020–2024, Outono/Primavera 2021, PSS 2020–2025, EaD 2020) | Questões de somatória (01, 02, 04, 08, 16): formato fora do site (decisão do dono). |
| Unioeste | 2020 | Link quebrado (404). |
| Unioeste | 2023, 2024, 2025, 2026 | Só gabarito provisório/preliminar no pacote (o site da Unioeste é proibido pelo robots.txt; não acessado). |
| Unimontes | Vestibular Próprio 2020–2023; PAES 1ª e 2ª etapas | Vestibular 2020–2023 não está no pacote. PAES: só a 3ª etapa entra (como UFJF PISM III, UPE SSA 3). Os outros cadernos (Exatas, Humanas, Sociais) das mesmas edições não foram somados: o site guarda um caderno por edição (Biológicas). |
| UVA | 2020.1, 2020.2, 2021 (Ibiapaba), 2022.1, 2023.1, 2022.2–2026.2 | 2020.1: link 404. 2020.2, Ibiapaba 2021 e 2022.1: só gabarito PRELIMINAR e caderno só em imagem. 2023.1: caderno só em imagem. Seleções 2022.2–2026.2 sem caderno publicado. |
| UEMG | 2022 | O gabarito do pacote não diz se é preliminar ou definitivo (sem anuladas nem data de recursos): fora até confirmar. |
| UEMG | 2020, 2021, 2023, 2025, 2026 | Não estão no pacote (vestibular.uemg.br bloqueia acesso automático). |
| UNEB | 2022, 2023 | Caderno + gabarito pós-recursos/definitivo baixados (`fabrica_saida/ingestao/uneb-*`), mas a diagramação mistura duas colunas, textos, imagens e páginas de largura total; o recorte troca pedaços entre questões (tentativa da rodada 6). |
| UNEB | 2024, 2025 | Pacote é o "caderno matriz" com "(Correta: X)" impresso em cada questão; não há gabarito definitivo publicado à parte (só no sistema com Cloudflare). 2025: caderno só em imagem. |
| UNEB | 2020, 2021, 2026 | 2020: link 404; 2021 e 2026 não estão no pacote. |
| EMESCAM | 2022/1, 2022/2 | Gabarito sem indicação de definitivo (mesma decisão da rodada 6). |
| EMESCAM | 2020, 2021, 2023–2026 | Não estão no pacote (2024+ só no sistema da Fundep, com Cloudflare). |
| Bahiana | 2020–2026 | Pacote só com gabaritos PRELIMINARES (2021/1, 2021/2, Prosef 2022/1, 2022/2) e sem caderno; 2020: 404. |
| UESB | 2020–2026 | 2020: gabarito definitivo sem caderno; 2022: gabarito preliminar sem caderno; demais anos não estão no pacote. |

## Grupo A (Unicamp, UERJ, Santa Casa, Einstein, Famema, FMJ, São Camilo, Anhembi) — 11/11/2026

Material: `fontes/provas-manuais/<sigla>/` (links do dono, Brasil Escola). Configuração: `ferramentas/ingestao/provas_grupo_a.py`
(cópia para `fabrica_saida/ingestao/` com `prepara_manuais.py`). No site a fonte é a página oficial (Comvest, UERJ, Vunesp);
o arquivo de onde veio cada PDF fica no campo `origem` do `prova.json`.

### Entraram nesta rodada

| Instituição | Provas (id) | Questões |
|---|---|---|
| Unicamp | `unicamp-2021` (Biológicas), `unicamp-2021-exh` (Exatas/Humanas), `unicamp-2022` a `unicamp-2027` (1ª fase, prova Q), `unicamp-indigena-2021`, `unicamp-indigena-2022` | 672 |
| UERJ | `uerj-2021`, `uerj-2022`, `uerj-2023` (Exame Único), `uerj-2025-1`, `uerj-2025-2`, `uerj-2026-1`, `uerj-2026-2`, `uerj-2027-1` (Exames de Qualificação) | 479 |
| Santa Casa | `santacasa-2021`, `santacasa-2022` (Medicina, Conhecimentos Gerais), `santacasa-2022-demais` (Enfermagem e demais cursos) | 220 |
| Einstein | 2020–2026 completos (Prova I objetiva) | 2020, 2022 (Medicina, Enfermagem e Fisioterapia), 2024, 2025 e 2026 entraram em 12/11/2026 pela cópia do Curso Objetivo. |
| FMJ | 2020, 2023 | 2024, 2025 e 2026 entraram em 12/11/2026 (Prova II, cópia do Curso Objetivo). 2020 e 2023: o Objetivo só tem FMJ a partir de 2024; baixar à mão. |
| São Camilo | `saocamilo-2021-2`, `saocamilo-2022-2` (Prova II) | 80 |
| Anhembi Morumbi | `anhembi-2022` (Medicina, Prova II) | 40 |

Gabaritos: Comvest e Vunesp publicam um gabarito oficial único (anuladas marcadas com "*" na Comvest e "N"/"X" na Vunesp).
UERJ: o gabarito do DSEA não diz "preliminar" nem "definitivo"; foram usados os arquivos do pacote sem a marca de preliminar
(o de 2024 vem nomeado "gabarito-preliminar" e ficou fora). Unicamp 2027 (prova de out/2026): gabarito oficial da Comvest
já publicado — integrada.

### O que ainda falta e por quê

| Instituição | Anos (2020–2026) que faltam | Motivo |
|---|---|---|
| Unicamp | 2020 | Link do Brasil Escola quebrado (404). Robots.txt da Comvest proíbe acesso automático: baixar à mão (1ª fase 2020, prova Q, e o gabarito). |
| UERJ | 2020, 2024 | 2020: os dois links (Exames de Qualificação e Discursivo) quebrados. 2024: o pacote só traz o 1º Exame de Qualificação com gabarito **preliminar**; falta o gabarito definitivo do 1º EQ e o 2º EQ inteiro (caderno + gabarito). |
| Santa Casa (FCMSCSP) | — | Todos os anos de 2020 a 2027 no site (Medicina, Conhecimentos Gerais). 2023 e 2025: Drive do dono + gabarito do Objetivo; 2020 (2º dia; 12 e 73 anuladas, pelo gabarito versão 3 do Drive), 2024, 2026 e 2027: cópia do Curso Objetivo (12/11/2026). Em 2021, a prova dos demais cursos veio só com o gabarito (sem caderno). |
| Einstein | 2020, 2024, 2025, 2026 (e Medicina 2022) | 2020: link quebrado. 2022: só a Enfermagem 2022/2 nos links (falta a Prova I de Medicina/2022). 2024–2026: não estão nos links. |
| Famema | 2022, 2023 | 2020, 2021, 2024, 2025 e 2026 entraram em 12/11/2026 (Prova II, cópia do Curso Objetivo; 2024 sem as anuladas 15 e 16). 2022: banca FGV, só gabarito **preliminar** (vai pela regra do gabarito do Aprendice). 2023: o Objetivo só tem a resolução, sem o caderno da Prova II; no Drive do dono há só o gabarito versão 1. |
| FMJ | 2020, 2023, 2024, 2025, 2026 | 2020: link quebrado. 2023–2026: não estão nos links. |
| São Camilo | 2020, 2023, 2025, 2026 (e 1º semestre de 2021 e 2022) | 2020: link quebrado. Os links só têm o 2º semestre de 2021 e 2022; 2024/2 já estava no site. |
| Anhembi Morumbi | 2020, 2021, 2023, 2024, 2025, 2026 | 2020: link quebrado. Os links só têm a Medicina 2022. |

Fora por formato (não é falta de arquivo): as provas discursivas (Unicamp 2ª fase, UERJ Exame Discursivo, Prova I de
Einstein/FMJ/São Camilo/Anhembi, Conhecimentos Específicos da Santa Casa) e as redações.

## Grupo B (IME, Mackenzie, UEA, UFRR, UFT, Unitins, UNIRG) — 11/11/2026

Material: `fontes/provas-manuais/<sigla>/` (links do dono, Brasil Escola) e, quando o site oficial ainda serve o arquivo,
o caderno e o gabarito definitivo baixados de lá (Mackenzie, Unitins, UNIRG 2020/1). Configuração:
`ferramentas/ingestao/provas_grupo_b.py`; cópia dos PDFs do pacote do dono com o registro de origem:
`ferramentas/ingestao/prepara_grupo_b.py` (no `prova.json`, `fontes` = página oficial da instituição e `origem` = de onde
o arquivo foi baixado). Matéria, tema, conteúdo e nível: rascunho de um classificador e conferência de um 2º agente
questão a questão (prints e classificação); correções aplicadas. Auditoria separada (outro agente, amostra de 171
questões das 46 provas): gabarito 171/171 igual ao oficial definitivo; 2 classificações corrigidas (UNIRG 2025/2 q4, q9);
14 apontamentos de print — corrigidos (molduras vazias da Unitins tiradas na 2ª rodada). Fica só o glifo que falta no
próprio PDF do Mackenzie 2026/2 q36 ("com x 0", sinal ausente no caderno oficial).

### Entraram nesta rodada (48 provas, 2.552 questões)

| Instituição | Provas (id) | Questões |
|---|---|---|
| IME | 2020/2021, 2021/2022, 2022/2023, 2025/2026 — 1ª fase objetiva (`ime-2021`, `-2022`, `-2023`, `-2026`) | 155 |
| Mackenzie | 2026/2 – 2ª aplicação, 15/07/2026 (`mackenzie-2026-3`) | 60 |
| UEA | Acesso 2021, 2025, 2026 e 2027: Conhecimentos Gerais + Conhecimentos Específicos (2021: só grupo 1; 2025–2027: grupos 1, 2 e 3); SIS – Prova de Acompanhamento III dos acessos 2020, 2021, 2025, 2026 e 2027 | 996 |
| UFRR | Vestibular 2021, 2022 e 2023 – Prova Integral (= etapa 3 do PSS) | 206 |
| UFT | Vestibular 2022/1, 2022/2, 2023/1, 2024/1 (manhã 1–32 + tarde 33–76) e EaD 2022/2 | 327 |
| Unitins | 2020/1, 2021/1, Medicina 2021/2, 2022/1, Medicina 2022/1, 2023/1 (cadernos 1 e 2), 2024/1 (cadernos 1 e 2), 2025/1 caderno 2, 2026/1 (cadernos 1 e 2) | 578 |
| UERR | 2023 (Cebraspe) | 70 |
| UNIRG | Medicina 2020/1 (Gurupi, banca UFG), Medicina 2021/1 e 2021/2 – campus Paraíso do Tocantins | 160 |

Também: UNIRG 2025/2 — o ícone do título "Text for questions..." saiu do pé das questões 4, 9 e 15 (`suporte_icone`);
as questões ainda sem classificação nas UNIRG 2022/1, 2022/2, 2023/2 e 2025/2 foram classificadas.

Fora dentro das provas que entraram: só anuladas (lista em `fora` de cada `prova.json`). As 48 questões que tinham
ficado como `recorte_imperfeito` foram refeitas (11/11/2026, 2ª rodada, por ordem do dono): fronteiras de faixa
encaixadas nos vãos entre linhas (`faixas_ajuste`), selo do número tratado à parte, e recorte manual por questão
(`manual` em `provas_grupo_b.py`: página, colunas e a linha de início/fim lida na camada de texto) onde a diagramação
mistura uma e duas colunas; molduras vazias tiradas do print (`caixa_vazia`). Nenhuma questão com print partido ficou
no site: todas as questões das 12 provas da Unitins, UFRR 2021 q52 e 2023 q64 e a UERR 2023 foram reconferidas, uma a
uma, por um conferente separado. Unitins Medicina 2022/1 entrou inteira (48 questões). UEA acesso 2021 e SIS 2020/2021:
as questões 9–12 têm versão em inglês e em espanhol com um só gabarito oficial; entra a versão em inglês.

### Anos de 2020 a 2026 que ainda faltam

| Instituição | Falta | Por quê |
|---|---|---|
| IME | Concurso 2019/2020 | Link do Brasil Escola quebrado (404); site do IME não responde a acesso automático. |
| IME | 2023/2024 e 2024/2025 | No pacote só o gabarito PRELIMINAR; o definitivo não foi localizado (site do IME não responde). |
| IME | 2ª fase (Português e Inglês objetivas) | 2020/2021: caderno só em imagem e gabarito sem indicar se é definitivo; 2021/2022: gabarito preliminar. As demais provas da 2ª fase são discursivas. |
| Mackenzie | 2020/1 a 2022/1 | 2020/1: link quebrado no Brasil Escola e, no site oficial, só o caderno dos Grupos II e III, sem gabarito; 2020/2–2022/1: nada localizado. |
| Mackenzie | 2023/1 a 2025/2 | Só o gabarito no servidor do Mackenzie; caderno não localizado. |
| UEA | Acesso 2022, 2023 e 2024 | Acesso 2023: o pacote do dono só tem os gabaritos (sem caderno); acessos 2022 e 2024: não estão no pacote. |
| UEA | Acesso 2021, Conhecimentos Específicos grupos 2 e 3 | O arquivo do pacote só traz o grupo 1. |
| UEA | SIS – Acompanhamento III dos acessos 2022, 2023 e 2024 | Não estão no pacote. Acompanhamentos I e II ficam fora por regra (só a etapa final do seriado, como no PISM). |
| UFRR | 2020 | Link do Brasil Escola quebrado (404). |
| UFRR | 2024, 2025 e 2026 | No pacote só o gabarito PRELIMINAR (editais.ufrr.br não responde daqui para buscar o oficial). |
| UFRR | Vestibular Indígena 2021 e 2025; etapas E1 e E2 do PSS | Indígena: gabarito preliminar. E1/E2: por regra, só a etapa final (E3 = Prova Integral). |
| UFT | 2020/1 a 2021 | 2020/1: link quebrado (404); 2020/2–2021: nada no pacote (seleção pelo Sisu na pandemia). |
| UFT | 2023/2 e 2024/2 | No pacote só o gabarito PROVISÓRIO. |
| UFT | Exato 2024–2026; EaD 2022/2 – Licenciatura em Música | Exato: não está no pacote. Música: as questões comuns repetiriam as do caderno das licenciaturas de Ciências e as de Música não são matéria do site. |
| Unitins | TO Graduado 2022/2 | O PDF do gabarito mistura as camadas "preliminar" e "definitivo"; não dá para confirmar a versão. |
| Unitins | 2020/2 e Paraíso 2020 | 2020/2: ingresso pelo Sisu; Paraíso 2020: link quebrado (404). |
| UNIRG | Gurupi 2020/2 a 2021/2 | Página oficial sem cadernos (provas on-line na pandemia). |
| UNIRG | Gurupi 2023/1 | O arquivo "definitivo" é o gabarito preliminar. |
| UNIRG | Gurupi 2025/1 | Caderno não publicado (só o gabarito). |
| UNIRG | Paraíso 2022 | Só gabarito preliminar no pacote. |

UERR 2023 (no pacote da UFRR): integrada (`uerr-2023`, Cebraspe, 70 questões; 45 e 69 anuladas). O caderno é só imagem:
as âncoras vêm de OCR em 4 resoluções, encaixadas nas barras de título da página e conferidas; sem transcrição (só o
print).
