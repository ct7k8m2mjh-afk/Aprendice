# Inventário de provas — universidades públicas, grupo 1

Levantamento de 06/11/2026. Fonte: só sites oficiais (instituição ou banca). Nada foi baixado: cada link foi conferido com uma requisição parcial (primeiro 1 KB). Respeitamos o robots.txt e não contornamos bloqueios.

Dados completos, link por link: `docs/provas/inventario-publicas-1.json`.

## Resumo

- **16 de 28** instituições têm prova própria com caderno e gabarito oficial confirmados em pelo menos um ano.
- **81 anos-instituição** de 2020 a 2026 com caderno e gabarito oficial confirmados (mais a Fuvest 2027, já publicada).
- **Sem prova própria:** UEMASUL (usa o PAES da UEMA). A Unifesp só tem prova própria para Medicina; os demais cursos entram pelo Sisu.
- **Baixar à mão** (download bloqueado ou fora do ar para acesso automático): Unesp, Unicamp, UERJ, EsPCEx, UFRGS, Unioeste, UEMG, UEA, Famerp e Famema.
- **Links parciais** (falta o caderno ou o gabarito em alguns anos): UECE, UNEB, UESB, Unifesp, UEMA, UFPR e UFJF. O detalhe está na tabela e no JSON.

Convenção: “ano” é o **ano de ingresso** (ex.: Fuvest 2026 = prova aplicada no fim de 2025). Onde há duas edições no ano (semestres, dias, etapas), o JSON lista cada uma separada.

## Tabela

| Instituição | UF | Processo / banca | Anos com prova + gabarito oficiais | Parcial | Livre? | Observação |
|---|---|---|---|---|---|---|
| Universidade de São Paulo (USP) | SP | Vestibular Fuvest — Fuvest | 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027 | — | sim | 1ª fase (90 q., 80 em 2027), várias versões; gabarito retificado em 2022, 2024 e 2027. |
| Universidade do Estado do Amazonas (UEA) | AM | Vestibular UEA e SIS (Sistema de Ingresso Seriado) — Vunesp (desde o Vestibular 2024/acesso 2025) | — | — | **não — baixar à mão** | Desde acesso 2025 a banca é a Vunesp (403); edições antigas sem cadernos no portal da UEA. |
| Universidade de Pernambuco (UPE) | PE | SSA – Sistema Seriado de Avaliação (SSA 1, 2 e 3) e Vestibular EAD — UPE / CPCA | 2020, 2021, 2022, 2023, 2024, 2025, 2026 | — | sim | SSA 1, 2 e 3, dois dias cada (inventariados todos); SSA 3 dá o ingresso. Também Vestibular EAD 2025. |
| Universidade Estadual Paulista (Unesp) | SP | Vestibular Unesp (e Vestibular de Meio de Ano) — Vunesp | — | — | **não — baixar à mão** | robots.txt proíbe /Home/ (onde ficam os PDFs) e Vunesp responde 403. Links de 2020 e 2022 vieram só de busca. |
| Faculdades de Tecnologia do Estado de São Paulo (Centro Paula Souza) (Fatec) | SP | Vestibular Fatec (semestral) — Centro Paula Souza | 2020, 2022, 2023, 2024, 2025, 2026 | — | sim | Dois vestibulares por ano; PDFs oficiais pelo site do Centro Paula Souza (o site do vestibular dá 403). Sem prova em 2021 e no 1º sem/2022. |
| Universidade Estadual de Campinas (Unicamp) | SP | Vestibular Unicamp — Comvest | — | — | **não — baixar à mão** | robots.txt da Comvest é 'Disallow: /'. |
| Universidade Estadual do Maranhão (UEMA) | MA | PAES – Processo Seletivo de Acesso à Educação Superior — UEMA (CPS/PROG) | 2020, 2021, 2022, 2024, 2026 | só gabarito: 2023, 2025 | sim | PAES. Cadernos de 2023 (link oficial quebrado) e 2025 não localizados. |
| Universidade Estadual da Região Tocantina do Maranhão (UEMASUL) | MA | PAES (processo conjunto UEMA/UEMASUL) — UEMA | — | — | — | Sem prova própria: usa o PAES da UEMA (mesma prova). |
| Universidade Estadual do Ceará (UECE) | CE | Vestibular UECE (semestral: AAAA.1 e AAAA.2) — CEV-UECE | 2024 | gabarito preliminar ou a conferir: 2020, 2023, 2025, 2026 | sim | Semestral. A CEV publica só o gabarito PRELIMINAR em PDF; as mudanças saem em Comunicado (definitivo = preliminar + comunicado). Só 2024.1 tem comunicado de gabarito definitivo. 2021–2022 não localizados. |
| Universidade Federal de Juiz de Fora (UFJF) | MG | PISM – Programa de Ingresso Seletivo Misto (Módulos I, II e III); ingresso pelo Módulo III — Copese-UFJF | 2020, 2022, 2023, 2024, 2025, 2026 | só gabarito: 2021 | sim | PISM Módulo III (2 dias, cadernos por área). 2021 sem caderno na página. |
| Universidade do Estado de Minas Gerais (UEMG) | MG | Vestibular UEMG (e vagas pelo Sisu) — UEMG (Copeps) | — | — | **não — baixar à mão** | vestibular.uemg.br responde 403. |
| Universidade Federal do Paraná (UFPR) | PR | Processo Seletivo UFPR (vestibular) — NC-UFPR (Núcleo de Concursos) | 2021, 2022, 2024, 2025, 2026 | gabarito preliminar ou a conferir: 2020; só caderno: 2023 | sim | O caderno definitivo traz a resposta marcada (vale como gabarito). 2020: conferir se tem marcação; 2023: PDF sem marcação, gabarito não localizado. |
| Universidade Federal do Amazonas (UFAM) | AM | PSC – Processo Seletivo Contínuo (3 etapas; ingresso pela 3ª etapa) e Sisu — Compec-UFAM | 2020, 2021, 2022, 2023, 2024, 2025, 2026 | — | sim | PSC 3ª etapa, no repositório Edoc da UFAM. |
| Universidade do Estado do Rio de Janeiro (UERJ) | RJ | Vestibular Estadual UERJ (Exame de Qualificação + Exame Discursivo) — DSEA/UERJ | — | — | **não — baixar à mão** | robots.txt é 'Disallow: /'. |
| Escola Preparatória de Cadetes do Exército (EsPCEx) | SP | Concurso de Admissão EsPCEx — Exército Brasileiro (DECEx/EsPCEx) | — | — | **não — baixar à mão** | robots.txt é 'Disallow: /'; site não respondeu. |
| Universidade do Estado da Bahia (UNEB) | BA | Vestibular UNEB — UNEB (Comissão Permanente de Vestibular; provas aplicadas por empresa contratada) | 2022, 2023 | só caderno: 2024, 2025, 2026; só gabarito: 2020 | sim | 2025–2026: gabarito só no sistema uneb.selecao.net.br (protegido por Cloudflare); 2024: gabarito não localizado; 2020: caderno não localizado; 2021: site fora do ar. |
| Universidade Federal de Uberlândia (UFU) | MG | Vestibular UFU (ingresso no 2º semestre; 1º semestre pelo Sisu) — DIRPS-UFU | 2020, 2021, 2022, 2023, 2024, 2025, 2026 | — | sim | Vestibular de meio de ano (AAAA-2), links do Portal de Seleção. Gabarito pode vir em .xlsx. |
| Universidade Federal do Rio Grande do Sul (UFRGS) | RS | Concurso Vestibular UFRGS — Coperse-UFRGS | — | — | **não — baixar à mão** | Servidores recusaram conexão. A Coperse VENDE os conjuntos de provas 2022–2026. |
| Universidade de Brasília (UnB) | DF | PAS/UnB – Programa de Avaliação Seriada (etapas 1, 2 e 3); demais vagas por Enem/Sisu e Acesso Enem — Cebraspe | 2020, 2021, 2022, 2023, 2024, 2025, 2026 | — | sim | PAS 3 (Cebraspe): certo/errado, numérica, A–D e discursiva. Lista via API pública do Cebraspe. |
| Universidade Estadual de Londrina (UEL) | PR | Vestibular UEL — Cops-UEL | 2020, 2021, 2022, 2023, 2024, 2025, 2026 | — | sim | 2020–2023: link para a página oficial de provas e gabaritos definitivos (PDFs por tipo/língua). 2024–2026: links diretos já usados no projeto. |
| Universidade Estadual de Goiás (UEG) | GO | Vestibular UEG (semestral) e Vestibular de Medicina (à parte) — Núcleo de Seleção UEG | 2020, 2021, 2022, 2023, 2024, 2025, 2026 | — | sim | Dois vestibulares por ano (inventariados todos) + Medicina à parte. |
| Universidade Estadual do Oeste do Paraná (Unioeste) | PR | Vestibular Unioeste (padrão e seriado) — Unioeste (Cogeps) | — | — | **não — baixar à mão** | PDFs ficam em /portal/arq/, que o robots.txt proíbe; site também recusou conexões. |
| Faculdade de Medicina de São José do Rio Preto (Famerp) | SP | Vestibular Famerp — Vunesp | — | — | **não — baixar à mão** | Provas só na Vunesp (403). |
| Universidade Federal de Santa Maria (UFSM) | RS | Vestibular UFSM e PSS (Processo Seletivo Seriado); também Sisu — UFSM (Prograd/Coperves) | 2025, 2026 | — | sim | Vestibular próprio localizado só em 2025 e 2026 (3 provas de 40 questões); antes, conferir. |
| Universidade Estadual do Sudoeste da Bahia (UESB) | BA | Vestibular UESB — Instituto Avalia (edições recentes) | — | só caderno: 2020, 2022, 2023, 2024, 2025 | sim | ZIP oficial por ano com os cadernos; gabarito no site da banca (Instituto Avalia, sem PDF direto). |
| Universidade Federal de São Paulo (Unifesp) | SP | Sistema Misto de Seleção (Medicina): nota do Enem + provas próprias — Unifesp (ProGrad) | 2022, 2026 | só caderno: 2023, 2025; só gabarito: 2024 | sim | Só Medicina (Sistema Misto: Enem + provas próprias); demais cursos só Sisu. Faltam gabaritos de 2023 e 2025 e caderno de 2024. |
| Universidade Tecnológica Federal do Paraná (UTFPR) | PR | Vestibular de Verão UTFPR (1º semestre), Sisu e +Enem — UTFPR | 2024, 2025, 2026 | — | sim | Vestibular de Verão a partir de 2024 (antes só Sisu); 40 questões + redação. |
| Faculdade de Medicina de Marília (Famema) | SP | Vestibular Famema — Vunesp | — | — | **não — baixar à mão** | Provas só na Vunesp (403). 2022 foi da FGV: caderno e gabarito definitivo na página oficial (conhecimento.fgv.br/concursos/vestibularfamema22); já no site como `famema-2022` (12/11/2026). |

## Avisos para o dono

- **Direitos:** a UFRGS vende os conjuntos de provas 2022–2026 (“Aquisição de Provas” da Coperse). Antes de usar essas provas no site, a decisão é sua.
- **Fuvest 2027:** os links gravados em `app/conteudo-fonte/provas/fuvest-2027/prova.json` (`/arquivos/vestibular/…`) agora dão erro 404. Os links atuais estão no JSON (`/wp-content/uploads/fuvest2027-fase1-prova-V1.pdf` e `…-gabarito-retificado.pdf`).
- **UECE:** a CEV publica em PDF só o gabarito preliminar. Para usar uma prova, é preciso aplicar as anulações e alterações do Comunicado de recursos (princípio 2: gabarito só de fonte publicada).
- **UFPR:** o gabarito definitivo é o próprio caderno com a resposta marcada (►). O símbolo precisa ser apagado do print, como já é feito no projeto.
