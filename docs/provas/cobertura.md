# Cobertura das provas por instituição (2020–2026)

Atualizado em 09/11/2026 (lote 2, rodada 6); grupo A dos links do dono (Unicamp, UERJ, Santa Casa, Einstein, FMJ, São Camilo, Anhembi) em 11/11/2026; Unesp e Famerp em 10/11/2026 (cópias públicas da Vunesp, `origem-vunesp.md`). Meta do dono: provas de 2020 a 2026 de cada instituição (privadas
incluídas); onde não houver, no mínimo 3 anos; anos anteriores a 2020 não entram. Só múltipla escolha (certo/errado e
somatória ficam fora). Instituições: `inventario-publicas-1.json` (28), `inventario-publicas-2.json` (27) e
`inventario-privadas.json` (25), mais ENEM e Unifor, que já estavam no site: 82 ao todo.

Leitura da tabela: o ano é o **ano de ingresso** (ex.: Fuvest 2026 = prova aplicada no fim de 2025). ✓ = uma prova
integrada naquele ano (matéria, tema, conteúdo e nível em todas as questões; print fiel; gabarito oficial); ✓2/✓3 =
duas ou três edições no ano. "Anos" conta os anos de 2020 a 2026 com prova; "Provas" e "Questões" contam tudo o que está
em `app/conteudo-fonte/provas/` (inclusive edições 2027). Meta: **completa** = os 7 anos; **≥ 3 anos** = atingiu o
mínimo; **abaixo** = 1 ou 2 anos; **nenhum** = nada integrado. A última coluna diz por que falta.

## Resumo

- **Completa (9):** USP (Fuvest), UPE, UFPR, UFAM, UFU, UEL, UEG, Cederj, ITA.
- **≥ 3 anos (22):** Fatec, UEMA, UFJF, UTFPR, UDESC, UNEMAT, Unespar, Unicentro, UNIRG, Unitins, URCA, UVA, PUC-Rio,
  Acafe, FCM-MG, FMABC, PUC Minas, PUC-Campinas, PUC-SP, PUCPR, PUCRS, ENEM (o ENEM está com o outro agente).
- **Abaixo de 3 anos (10):** UECE, UFSM, Unifesp, Fema, UERR, Unimontes, Fempar, Mackenzie, São Camilo, Unifor — em todas,
  os anos que faltam não têm caderno + gabarito definitivo públicos (ou o vestibular próprio não existia).
- **Nenhum ano (41):** bloqueio automático (Vunesp, Insper, Cloudflare, robots.txt — baixar à mão ou, nas da Vunesp, cópia
  pública com origem registrada, pedido do dono de 09/11), formato fora do escopo (UnB, UEM, UFSC), sem prova própria
  (UEMASUL, UFNT, FURG, FECAP, Inteli), gabarito só preliminar (UEMS, FGV, EMESCAM), venda (UFRGS: o dono não compra)
  e layout que o recorte ainda não resolve (UNEB).
- Grupo A dos links do dono (11/11/2026): 30 provas novas (1.811 questões): Unicamp 10, UERJ 8, Santa Casa 3, Einstein 4,
  FMJ 2, São Camilo 2, Anhembi 1 (Famema: nenhuma — ver `faltantes-por-ano.md`). Com isso Unicamp, UERJ, Einstein e São Camilo
  passam a ≥ 3 anos; Santa Casa, FMJ e Anhembi ficam abaixo (os links só tinham 2021–2022).
- Rodada 6: 29 provas novas (1.485 questões): PUC-Campinas 6, Acafe 6, FCM-MG 4, PUC Minas 3, PUCPR 3, PUC-Rio 2,
  Unifesp 2, Fema 2, UECE 1. Detalhes em `lote2-pendencias.md`.

### Públicas (grupo 1)

| Sigla | Instituição | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026 | Anos | Provas | Questões | Meta | Situação / por que falta |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| USP | Universidade de São Paulo | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 7 | 8 | 706 | completa (+2027) | Fuvest 1ª fase completa. |
| UEA | Universidade do Estado do Amazonas | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | Vunesp/portal UEA bloqueiam acesso automático (403): baixar à mão. |
| UPE | Universidade de Pernambuco | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 7 | 7 | 675 | completa | SSA 3 (etapa de ingresso). |
| Unesp | Universidade Estadual Paulista | ✓ | ✓2 | ✓2 | ✓ | ✓2 | ✓2 | ✓2 | 7 | 12 | 1080 | completa | 1ª fase; 2021 e 2022 com as duas provas (Biológicas; Exatas e Humanidades); 2024–2026 também meio de ano. Cópias do Curso Objetivo (`origem-vunesp.md`). |
| Fatec | Faculdades de Tecnologia do Estado de São Paulo (Centro Paula Souza) | ✓ | — | ✓ | ✓2 | ✓2 | ✓2 | ✓2 | 6 | 10 | 559 | ≥ 3 anos | 2021 e 1º sem/2022 sem prova (pandemia). |
| Unicamp | Universidade Estadual de Campinas | — | ✓3 | ✓2 | ✓ | ✓ | ✓ | ✓ | 6 | 10 | 672 | ≥ 3 anos (+2027) | 1ª fase (prova Q) dos links do dono (Brasil Escola, 11/11/2026); 2021 com as duas provas da pandemia + Vestibular Indígena 2021 e 2022. 2020: link do Brasil Escola quebrado (404). |
| UEMA | Universidade Estadual do Maranhão | ✓ | ✓ | ✓ | — | ✓ | — | ✓ | 5 | 5 | 325 | ≥ 3 anos | PAES 2023 e 2025 sem caderno no site oficial. |
| UEMASUL | Universidade Estadual da Região Tocantina do Maranhão | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | Sem prova própria: usa o PAES da UEMA (não duplicar). |
| UECE | Universidade Estadual do Ceará | — | — | — | — | ✓ | — | — | 1 | 1 | 85 | abaixo | Só 2024.1 tem gabarito DEFINITIVO em PDF (Comunicado 237/2023); demais edições só gabarito preliminar → fora (princípio 2). 2026.2 só no sistema on-line. |
| UFJF | Universidade Federal de Juiz de Fora | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | 6 | 6 | 232 | ≥ 3 anos | PISM III; 2021 sem caderno no site. |
| UEMG | Universidade do Estado de Minas Gerais | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | vestibular.uemg.br responde 403 (retestado 09/11): baixar à mão. |
| UFPR | Universidade Federal do Paraná | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 7 | 7 | 564 | completa | Completa. |
| UFAM | Universidade Federal do Amazonas | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 7 | 7 | 362 | completa | PSC 3ª etapa, completa. |
| UERJ | Universidade do Estado do Rio de Janeiro | — | ✓ | ✓ | ✓ | — | ✓2 | ✓2 | 5 | 8 | 479 | ≥ 3 anos (+2027) | Exame Único 2021–2023 e Exames de Qualificação 2025–2027 (links do dono). 2020: link quebrado; 2024: o pacote só traz o gabarito preliminar do 1º EQ. |
| EsPCEx | Escola Preparatória de Cadetes do Exército | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | robots.txt 'Disallow: /': baixar à mão. |
| UNEB | Universidade do Estado da Bahia | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | 2022 e 2023 baixadas (caderno + gabarito pós-recursos), FORA: duas colunas com textos, imagens e páginas de largura total intercalados; o recorte automático troca pedaços entre questões. 2024–2026: gabarito só no sistema com Cloudflare. |
| UFU | Universidade Federal de Uberlândia | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 7 | 7 | 586 | completa | Completa (vestibular de meio de ano). |
| UFRGS | Universidade Federal do Rio Grande do Sul | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | Servidor recusa conexão (retestado 09/11) e a Coperse vende as provas 2022–2026: o dono decidiu não comprar (fica fora). |
| UnB | Universidade de Brasília | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | PAS 3 é quase todo certo/errado (Cebraspe): fora por decisão do dono (só múltipla escolha). Os poucos itens tipo C (A–D) não foram separados nesta rodada (ver formatos-pendentes.md). |
| UEL | Universidade Estadual de Londrina | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 7 | 7 | 397 | completa | Completa. |
| UEG | Universidade Estadual de Goiás | ✓ | ✓2 | ✓2 | ✓2 | ✓3 | ✓3 | ✓3 | 7 | 16 | 840 | completa | Vestibular geral (13 edições) + Medicina (2024/2–2026/1). |
| Unioeste | Universidade Estadual do Oeste do Paraná | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | PDFs em /portal/arq/, proibido pelo robots.txt: baixar à mão. |
| Famerp | Faculdade de Medicina de São José do Rio Preto | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 7 | 7 | 560 | completa | Conhecimentos Gerais (1º dia). Cópias do Curso Objetivo (`origem-vunesp.md`). |
| UFSM | Universidade Federal de Santa Maria | — | — | — | — | — | ✓ | ✓ | 2 | 2 | 238 | abaixo | Vestibular próprio só em 2025 e 2026 (antes, só PSS/Sisu). |
| UESB | Universidade Estadual do Sudoeste da Bahia | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | Gabarito oficial só no site da banca (app JavaScript, sem PDF): baixar à mão. |
| Unifesp | Universidade Federal de São Paulo | — | — | ✓ | — | — | — | ✓ | 2 | 2 | 50 | abaixo | Medicina (Sistema Misto), prova 1 objetiva de Português e Inglês. 2023 e 2025 sem gabarito publicado; 2024 sem caderno. |
| UTFPR | Universidade Tecnológica Federal do Paraná | — | — | — | — | ✓ | ✓ | ✓ | 3 | 3 | 156 | ≥ 3 anos | Vestibular próprio só a partir de 2024. |
| Famema | Faculdade de Medicina de Marília | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | Links do dono: 2021 só com o gabarito da Prova II (o caderno do pacote é a Prova I, discursiva); 2022 só com gabarito preliminar; 2020 link quebrado. Demais anos: baixar à mão. |

### Públicas (grupo 2)

| Sigla | Instituição | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026 | Anos | Provas | Questões | Meta | Situação / por que falta |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| AFA | Academia da Força Aérea | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | fab.mil.br atrás de Cloudflare (desafio): baixar à mão. |
| Cederj | Consórcio Cederj (Fundação Cecierj — UERJ, UFRJ, UFF, UNIRIO, UFRRJ, UENF, CEFET/RJ, UFRRJ) | ✓ | ✓ | ✓2 | ✓2 | ✓2 | ✓2 | ✓2 | 7 | 12 | 553 | completa | 2020.2 e 2021.1 só em imagem/texto corrompido (OCR com numeração perdida): fora. |
| EFOMM | Escola de Formação de Oficiais da Marinha Mercante | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | marinha.mil.br atrás de Cloudflare: baixar à mão. |
| EN | Escola Naval | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | marinha.mil.br atrás de Cloudflare: baixar à mão. |
| Fema | Fundação Educacional do Município de Assis | ✓ | ✓ | — | — | — | — | — | 2 | 2 | 50 | abaixo | Cursos gerais 2021–2022 (25 questões). Medicina 2023+ pela Vunesp (403): baixar à mão. |
| FMJ | Faculdade de Medicina de Jundiaí | — | ✓ | ✓ | — | — | — | — | 2 | 2 | 120 | abaixo | Prova II (objetiva) 2021 e 2022 dos links do dono; 2020 link quebrado; 2023–2026 não estão nos links (Vunesp bloqueia acesso automático). |
| FURG | Universidade Federal do Rio Grande | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | Sem prova própria de 2020 a 2026 (ingresso por Sisu). |
| IME | Instituto Militar de Engenharia | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | Site não serve os PDFs a acesso automático (redireciona): baixar à mão. |
| ITA | Instituto Tecnológico de Aeronáutica | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 7 | 7 | 411 | completa | Completa (2027 aplicada em 2026 ainda não integrada). |
| UDESC | Universidade do Estado de Santa Catarina | ✓ | — | — | ✓ | ✓2 | ✓2 | ✓2 | 5 | 8 | 779 | ≥ 3 anos | 2021 e 2022 sem caderno publicado. |
| UEM | Universidade Estadual de Maringá | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | Somatória: fora por decisão do dono (só múltipla escolha). |
| UEMS | Universidade Estadual de Mato Grosso do Sul | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | Cadernos no site, mas só o gabarito de 2023 é definitivo e o caderno correspondente não foi identificado com segurança: fica para a próxima rodada. |
| UEPG | Universidade Estadual de Ponta Grossa | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | Servidor não responde a acesso automático: baixar à mão. |
| UERR | Universidade Estadual de Roraima | — | — | — | — | — | ✓ | ✓ | 2 | 2 | 137 | abaixo | Vestibular próprio só em 2025 e 2026. |
| UFNT | Universidade Federal do Norte do Tocantins | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | Mesmas provas da UFT (não duplicar). |
| UFRR | Universidade Federal de Roraima | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | Gabaritos em editais.ufrr.br sem caderno localizado: baixar à mão. |
| UFSC | Universidade Federal de Santa Catarina | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | Somatória + abertas numéricas: fora por decisão do dono (só múltipla escolha). |
| UFT | Universidade Federal do Tocantins | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | Página oficial responde, mas cadernos não foram localizados nesta rodada: baixar à mão. |
| UNEMAT | Universidade do Estado de Mato Grosso | — | — | ✓ | ✓ | ✓ | ✓ | ✓ | 5 | 5 | 166 | ≥ 3 anos | 2020/2021 sem prova (pandemia). |
| Unespar | Universidade Estadual do Paraná | — | — | — | ✓ | ✓ | — | ✓ | 3 | 3 | 174 | ≥ 3 anos | 2020/21 e 2021/22 sem objetiva; Vestibular 2025 só com gabarito provisório. |
| Uni-Facef | Centro Universitário Municipal de Franca | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | Provas na Vunesp (403): baixar à mão. |
| Unicentro | Universidade Estadual do Centro-Oeste | — | — | ✓ | ✓ | ✓ | — | ✓ | 4 | 5 | 466 | ≥ 3 anos (+2027) | Vestibular 2025: caderno não publicado. |
| Unimontes | Universidade Estadual de Montes Claros | — | — | — | — | ✓ | ✓ | — | 2 | 2 | 86 | abaixo | 2020–2023 só no arquivo antigo da Cotec (não responde): baixar à mão. |
| UNIRG | Universidade de Gurupi | — | — | ✓2 | ✓ | ✓2 | ✓ | ✓2 | 5 | 8 | 423 | ≥ 3 anos | Medicina; 2023/1 só gabarito preliminar, 2025/1 sem caderno. |
| Unitins | Universidade Estadual do Tocantins | — | — | ✓ | ✓ | ✓ | ✓2 | ✓ | 5 | 6 | 292 | ≥ 3 anos | Vestibular presencial; edições 'todos os câmpus' e Medicina 2021/2 ficam para depois. |
| URCA | Universidade Regional do Cariri | — | — | — | ✓2 | ✓2 | ✓3 | ✓ | 4 | 8 | 919 | ≥ 3 anos | 2022.2 sem caderno no site. |
| UVA | Universidade Estadual Vale do Acaraú | — | — | — | — | ✓ | ✓ | ✓ | 3 | 3 | 159 | ≥ 3 anos | 2022.1/2023.1: caderno só em imagem; 2020.2: links 404. |

### Privadas

| Sigla | Instituição | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026 | Anos | Provas | Questões | Meta | Situação / por que falta |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| PUC-Rio | Pontifícia Universidade Católica do Rio de Janeiro | ✓ | — | — | ✓ | ✓2 | ✓ | ✓ | 5 | 7 | 383 | ≥ 3 anos (+2027) | Grupo 4. 2021 e 2022 só em pacote .zip com gabaritos comentados em outro formato: próxima rodada. |
| ACAFE | Associação Catarinense das Fundações Educacionais (Sistema ACAFE) | — | ✓2 | ✓ | ✓2 | ✓2 | ✓2 | ✓2 | 6 | 11 | 666 | ≥ 3 anos | Medicina. 2020: o pacote oficial só traz o gabarito PRELIMINAR; Verão 2022: o 'gabarito oficial' é o preliminar → fora. |
| Anhembi Morumbi | Universidade Anhembi Morumbi | — | — | ✓ | — | — | — | — | 1 | 1 | 40 | abaixo | Medicina 2022 (Prova II) dos links do dono; 2020 link quebrado; demais anos não estão nos links. |
| Bahiana | Escola Bahiana de Medicina e Saúde Pública | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | Provas só por formulário com dados pessoais (não preenchido, LGPD). |
| Einstein | Faculdade Israelita de Ciências da Saúde Albert Einstein | — | ✓2 | ✓ | ✓ | — | — | — | 3 | 4 | 200 | ≥ 3 anos | Prova I 2021 e 2023, Enfermagem 2021/2 e 2022/2 (links do dono). 2020 link quebrado; 2022 Medicina e 2024–2026 não estão nos links. |
| EMESCAM | Escola Superior de Ciências da Santa Casa de Misericórdia de Vitória | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | Fundep atrás de Cloudflare; 2022/1 sem confirmação de gabarito definitivo. |
| FACISB | Faculdade de Ciências da Saúde de Barretos Dr. Paulo Prata | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | Provas na Vunesp (403): baixar à mão. |
| FAI | Centro Universitário de Adamantina (FAI) | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | Provas na Vunesp (403): baixar à mão. |
| FCMMG | Faculdade Ciências Médicas de Minas Gerais | — | ✓ | ✓ | ✓2 | ✓2 | ✓ | ✓ | 6 | 8 | 452 | ≥ 3 anos | Medicina, 2021/2 a 2026/2. |
| FECAP | Fundação Escola de Comércio Álvares Penteado | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | Não publica provas do vestibular de graduação. |
| Fempar | Faculdade Evangélica Mackenzie do Paraná | — | ✓ | — | — | — | — | ✓ | 2 | 2 | 160 | abaixo | Medicina; 2022–2025 sem caderno; 2027 aguarda gabarito definitivo (previsto 10/11/2026). |
| FGV | Fundação Getulio Vargas | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | Só a edição vigente (2027.1, gabarito preliminar) no ar. |
| FMABC | Centro Universitário FMABC (Faculdade de Medicina do ABC) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | 6 | 6 | 478 | ≥ 3 anos | 2026 só na Vunesp (403). |
| Insper | Insper Instituto de Ensino e Pesquisa | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | Site inteiro 403 (Akamai): baixar à mão. |
| Inteli | Inteli - Instituto de Tecnologia e Liderança | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | Prova on-line variável, não publicada. |
| Mackenzie | Universidade Presbiteriana Mackenzie | — | — | ✓ | — | — | — | ✓2 | 2 | 4 | 240 | abaixo (+2027) | 2023–2025: só o gabarito no servidor (caderno não localizado). |
| Mauá | Centro Universitário do Instituto Mauá de Tecnologia | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | Prova on-line com alternativas sem letra (até 2021); 2022+ sem caderno. |
| PUC Minas | Pontifícia Universidade Católica de Minas Gerais | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 6 | 7 | 315 | ≥ 3 anos (+2027) | Medicina; língua estrangeira fora (gabarito sem indicar a língua). |
| PUC-Campinas | Pontifícia Universidade Católica de Campinas | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 6 | 7 | 370 | ≥ 3 anos (+2027) | Medicina: Prova Geral (2021–2024) e Geral + Específica (2025–2027). 2020 só prova específica discursiva. |
| PUC-SP | Pontifícia Universidade Católica de São Paulo | — | — | — | — | ✓ | ✓ | ✓ | 3 | 3 | 148 | ≥ 3 anos | 2020: diagramação de revista que o recorte automático mistura; 2021–2023: provas on-line publicadas só como 'correção', sem número nem letra nas alternativas → fora. |
| PUCPR | Pontifícia Universidade Católica do Paraná | — | — | — | ✓2 | ✓2 | ✓2 | ✓2 | 4 | 8 | 471 | ≥ 3 anos | Medicina. 2022/1 e 2022/2: caderno-gabarito sem letras nas alternativas; 2021: Vestibular 4.0 digital → fora. |
| PUCRS | Pontifícia Universidade Católica do Rio Grande do Sul | — | — | ✓ | ✓ | — | ✓ | ✓ | 4 | 4 | 275 | ≥ 3 anos | Medicina; 2024 sem prova localizada. |
| FCMSCSP | Faculdade de Ciências Médicas da Santa Casa de São Paulo | — | ✓ | ✓2 | — | — | — | — | 2 | 3 | 220 | abaixo | Conhecimentos Gerais de Medicina 2021 e 2022 + demais cursos 2022 (links do dono). 2020 link quebrado; demais cursos 2021 só com gabarito; 2023–2026 não estão nos links. |
| São Camilo | Centro Universitário São Camilo | — | ✓ | ✓ | — | ✓ | — | — | 3 | 3 | 120 | ≥ 3 anos | Prova II 2021/2 e 2022/2 (links do dono) + 2024/2 (cópia do Objetivo). 2020 link quebrado; demais edições não estão nos links. |
| Sírio-Libanês | Faculdade Sírio-Libanês | — | — | — | — | — | — | — | 0 | 0 | 0 | nenhum | Provas na Vunesp (403): baixar à mão. |

### Fora do inventário (já no site)

| Sigla | Instituição | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026 | Anos | Provas | Questões | Meta | Situação / por que falta |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ENEM | Exame Nacional do Ensino Médio (Inep) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | 6 | 6 | 1071 | ≥ 3 anos | Outro agente (ENEM 2003–2022 e triagem). |
| Unifor | Universidade de Fortaleza | — | — | — | — | — | ✓ | ✓2 | 2 | 4 | 236 | abaixo (+2027) | Prova de Medicina. |

