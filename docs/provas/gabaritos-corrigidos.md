# Gabaritos corrigidos (letra oficial trocada no prova.json)

O id da questão e o progresso do aluno não mudam; só a letra do gabarito, quando a banca alterou o gabarito ou o definitivo difere do que estava no banco.

| Data | Questão | Prova | De | Para | Fonte |
|---|---|---|---|---|---|
| 2026-11-12 | P4ef542d4 | famerp-2024 q71 | B | C | Vunesp alterou o gabarito oficial de B para C, conforme registrado na resolução comentada do Curso Objetivo, questão 71 (https://www.curso-objetivo.br/vestibular/resolucao-comentada/famerp/2024/1dia/famerp2024_1dia.pdf); o arquivo de gabarito usado antes era o original. Conta: 5x + 2y = 50 com x, y inteiros não negativos tem 6 soluções. Apontada pela sessão de Matemática (mat-0007). |
| 2026-11-12 | P1f23be48 | uft-2024-2 q29 (29 da manhã) | C (preliminar) | D | Gabarito definitivo da Copese/UFT, Palmas-TO, 03/06/2024 (https://docs.uft.edu.br/s/jfgYJWwVR3Os4kALusUSog, link "Gabarito Definitivo" da página oficial https://www.uft.edu.br/concursos-e-selecoes/ingresso-na-graduacao/vestibular-1/vestibular-2024-2); única letra alterada do provisório para o definitivo. |
| 2026-11-12 | P8051f7c1 | uft-2024-2 q61 (29 da tarde) | C (preliminar) | anulada | Gabarito definitivo da Copese/UFT, Palmas-TO, 03/06/2024 (https://docs.uft.edu.br/s/jfgYJWwVR3Os4kALusUSog, link "Gabarito Definitivo" da página oficial https://www.uft.edu.br/concursos-e-selecoes/ingresso-na-graduacao/vestibular-1/vestibular-2024-2); marcada como indisponível. |
| 2026-11-12 | P9885011a | uft-2024-2 q62 (30 da tarde) | B (preliminar) | anulada | Gabarito definitivo da Copese/UFT, Palmas-TO, 03/06/2024 (https://docs.uft.edu.br/s/jfgYJWwVR3Os4kALusUSog, link "Gabarito Definitivo" da página oficial https://www.uft.edu.br/concursos-e-selecoes/ingresso-na-graduacao/vestibular-1/vestibular-2024-2); marcada como indisponível. |
| 2026-11-12 | P6972b12f | uft-2024-2 q71 (39 da tarde) | fora (tida como anulada) | A | Gabarito definitivo da Copese/UFT, Palmas-TO, 03/06/2024 (https://docs.uft.edu.br/s/jfgYJWwVR3Os4kALusUSog, link "Gabarito Definitivo" da página oficial https://www.uft.edu.br/concursos-e-selecoes/ingresso-na-graduacao/vestibular-1/vestibular-2024-2); a notícia do Estratégia dava 39 e 40 da tarde como anuladas, mas o PDF oficial anula 29 e 30; a questão voltou ao prova.json (print já existente, B07.5). |
| 2026-11-12 | Pdd340436 | uft-2024-2 q72 (40 da tarde) | fora (tida como anulada) | D | Gabarito definitivo da Copese/UFT, Palmas-TO, 03/06/2024 (https://docs.uft.edu.br/s/jfgYJWwVR3Os4kALusUSog, link "Gabarito Definitivo" da página oficial https://www.uft.edu.br/concursos-e-selecoes/ingresso-na-graduacao/vestibular-1/vestibular-2024-2); idem, voltou ao prova.json (B10.1). |

## UFT 2024/2: gabarito definitivo oficial (12/11/2026)

As outras 71 questões passaram de `gab: null` para a letra do definitivo, igual à do provisório (o `gab_preliminar` foi tirado delas). O PDF oficial foi baixado de docs.uft.edu.br (sem robots.txt; a página da UFT, que permite robôs, aponta para ele). A cópia do mesmo PDF no Estratégia não foi usada (o robots.txt deles proíbe PDFs).

## Conferência da troca da Famerp 2024 q71 (12/11/2026)

Alteração oficial confirmada por segunda fonte; o gabarito fica em C. (1) Resolução comentada do Curso Objetivo, questão 71: "Conforme solicitação, a Vunesp confirmou a nossa resolução, alterando o gabarito oficial de B para C" (https://www.curso-objetivo.br/vestibular/resolucao-comentada/famerp/2024/1dia/famerp2024_1dia.pdf). (2) Arquivo de gabarito da própria Vunesp (código FMRP2301, Vestibular 2024, versão 1) arquivado pelo QConcursos, com 71 = C e as outras 79 letras idênticas às do gabarito original, que tinha 71 = B (https://arquivos.qconcursos.com/prova/arquivo_gabarito/153795/vunesp-2023-famerp-vestibular-conhecimentos-gerais-gabarito.pdf). O portal da Vunesp bloqueia acesso automático e não foi consultado.

## Divergências encerradas sem troca (12/11/2026)

Pela regra do dono de 12/11/2026, as 11 divergências restantes foram checadas de novo nos gabaritos definitivos e comunicados das bancas: nenhuma anulação nem errata. Vale a letra oficial, explicada em `nota_gabarito` no `prova.json`: PUC-Campinas 2025 q64, UFPR 2024 q29, UDESC 2023.2 q22, UPE SSA3 2021 q72, UDESC 2024.1 q52 e q41, UEG 2025/2 q40, URCA 2024.2 q62, Mackenzie 2026/2 q11, UFU 2025 q73 e UECE 2022.2 (2ª fase) q11.
