# Provas da Vunesp: de onde veio cada caderno e cada gabarito

Decisão do dono (09/11/2026): "as provas da banca Vunesp são essenciais; verifique se há downloads das provas
disponíveis em outros lugares da web sem ser no site oficial" e "não compre provas". O portal da Vunesp
(vunesp.com.br e documento.vunesp.com.br) bloqueia acesso automático (Akamai 403); por isso os cadernos e gabaritos
oficiais abaixo foram baixados de **cópias públicas hospedadas por terceiros**. Nada foi comprado; não houve login,
paywall, Cloudflare ou bloqueio contornado; robots.txt respeitado (curso-objetivo.br e sistemas.objetivo.br não têm
robots.txt); User-Agent genérico. Sites encontrados mas **não usados** por regra de acesso: Estratégia Vestibulares
(o robots.txt proíbe `/*.pdf`), Etapa Resolve (o robots.txt proíbe expressamente agentes da Anthropic — `ClaudeBot`,
`anthropic-ai`), páginas do qConcursos (desafio Cloudflare; só os arquivos públicos em `arquivos.qconcursos.com`,
sem robots.txt, foram usados).

**Quem decide os direitos de uso é o dono** (princípio 10). Esta tabela registra a origem de cada arquivo para essa
decisão. Risco objetivo: são cadernos e gabaritos da Fundação Vunesp (e das instituições), hospedados por cursinhos
sem dizer sob qual licença; o print fiel no site reproduz a página do caderno.

## Como cada cópia foi conferida

- **Caderno**: é o PDF da própria Vunesp, não uma redigitação — cabeçalho "VESTIBULAR <ano>", nome da prova
  ("001. Prova de Conhecimentos Gerais" etc.), rodapé com o código do concurso (ex.: `vnsp2006 | 001-CG-ProvaObjetiva`),
  "Confidencial até o momento da aplicação", número de questões da capa igual ao recortado, numeração e ordem
  contínuas.
- **Gabarito**: o PDF oficial da Vunesp ("Versão 1", data da prova e o mesmo código do concurso do caderno). O caderno
  hospedado é o da versão 1. Conferência por amostra: questões de resposta inequívoca batem com o gabarito (ex.: Unesp
  2020 q22 "Despite" = "apesar de" = D; q28 "Nevertheless" = contraste = A).
- Link exato de cada arquivo, tamanho, sha256 e data do download: `fabrica_saida/ingestao/<prova>/manifesto.json` e
  `fontes` no `prova.json` de cada prova.

## Tabela

Tipo de fonte: **cópia de cursinho** = PDF oficial da Vunesp hospedado no site do cursinho (página de resolução
comentada do Curso Objetivo); **cópia de portal** = PDF oficial hospedado por portal de notícias de vestibular
(Estratégia Vestibulares). Nenhum gabarito foi tirado de resolução de cursinho: todos são o PDF oficial da Vunesp.

| Prova (id) | Ano | Onde achou o caderno | Onde achou o gabarito | Tipo de fonte |
|---|---|---|---|---|
| Unesp 2020, 1ª fase (`unesp-2020`) | 2020 | curso-objetivo.br/vestibular/resolucao-comentada/unesp/2020/1fase/UNESP2020_1fase_prova.pdf | …/unesp/2020/1fase/UNESP2020_1fase_gabarito.pdf (oficial Vunesp, VNSP1901) | cópia de cursinho (Objetivo) |
| Unesp 2021, 1ª fase – Biológicas (`unesp-2021`) | 2021 | …/unesp/2021/1fase/1dia/UNESP2021_1fase_prova.pdf | …/unesp/2021/1fase/1dia/UNESP2021_1fase_gabarito.pdf (oficial, VNSP2006) | cópia de cursinho (Objetivo) |
| Unesp 2021, 1ª fase – Exatas e Humanidades (`unesp-2021-exh`) | 2021 | …/unesp/2021/1fase/2dia/UNESP2021_1fase_prova.pdf | …/unesp/2021/1fase/2dia/UNESP2021_1fase_gabarito.pdf (oficial, VNSP2006) | cópia de cursinho (Objetivo) |
| Unesp 2022, 1ª fase – Biológicas (`unesp-2022`) | 2022 | …/unesp/2022/1fase/1dia/UNESP2022_1fase_prova.pdf | …/unesp/2022/1fase/1dia/UNESP2022_1fase_gabarito.pdf (oficial, VNSP2105) | cópia de cursinho (Objetivo) |
| Unesp 2022, 1ª fase – Exatas e Humanidades (`unesp-2022-exh`) | 2022 | …/unesp/2022/1fase/2dia/UNESP2022_1fase_prova.pdf | …/unesp/2022/1fase/2dia/UNESP2022_1fase_gabarito.pdf (oficial, VNSP2105) | cópia de cursinho (Objetivo) |
| Unesp 2023, 1ª fase (`unesp-2023`) | 2023 | …/unesp/2023/1fase/UNESP2023_1fase_prova.pdf | …/unesp/2023/1fase/UNESP2023_1fase_gabarito.pdf (oficial, VNSP2206) | cópia de cursinho (Objetivo) |
| Unesp 2024, 1ª fase (`unesp-2024`) | 2024 | …/unesp/2024/1fase/UNESP2024_1fase_prova.pdf | …/unesp/2024/1fase/UNESP2024_1fase_gabarito.pdf (oficial) | cópia de cursinho (Objetivo) |
| Unesp 2024/2, 1ª fase – meio de ano (`unesp-2024-2`) | 2024 | …/unesp/2024_2/1fase/UNESP2024_2_1fase_prova.pdf | …/unesp/2024_2/1fase/UNESP2024_2_1fase_gabarito.pdf (oficial, VNSP2305) | cópia de cursinho (Objetivo) |
| Unesp 2025, 1ª fase (`unesp-2025`) | 2025 | …/unesp/2025/1fase/UNESP2025_1fase_prova.pdf | …/unesp/2025/1fase/UNESP2025_1fase_gabarito.pdf (oficial, VNSP2404) | cópia de cursinho (Objetivo) |
| Unesp 2025/2, 1ª fase – meio de ano (`unesp-2025-2`) | 2025 | …/unesp/2025_2/1fase/UNESP2025_2_1fase_prova.pdf | …/unesp/2025_2/1fase/UNESP2025_2_1fase_gabarito.pdf (oficial, VNSP2408) | cópia de cursinho (Objetivo) |
| Unesp 2026, 1ª fase (`unesp-2026`) | 2026 | …/unesp/2026/1fase/UNESP2026_1fase_prova.pdf | …/unesp/2026/1fase/UNESP2026_1fase_gabarito.pdf (oficial, VNSP2504) | cópia de cursinho (Objetivo) |
| Unesp 2026/2, 1ª fase – meio de ano (`unesp-2026-2`) | 2026 | …/unesp/2026_2/1fase/UNESP2026_2_1fase_prova.pdf | …/unesp/2026_2/1fase/UNESP2026_2_1fase_gabarito.pdf (oficial, VNSP2513) | cópia de cursinho (Objetivo) |

| Famerp 2020, Conhecimentos Gerais (`famerp-2020`) | 2020 | …/famerp/2020/1dia/famerp2020_1dia_prova.pdf | …/famerp/2020/1dia/famerp2020_1dia_gabarito.pdf (oficial, FMRP1901) | cópia de cursinho (Objetivo) |
| Famerp 2021, Conhecimentos Gerais (`famerp-2021`) | 2021 | …/famerp/2021/1dia/famerp2021_1dia_prova.pdf | …/famerp/2021/1dia/famerp2021_1dia_gabarito.pdf (oficial, FMRP2001) | cópia de cursinho (Objetivo) |
| Famerp 2022, Conhecimentos Gerais (`famerp-2022`) | 2022 | …/famerp/2022/1dia/famerp2022_1dia_prova.pdf | …/famerp/2022/1dia/famerp2022_1dia_gabarito.pdf (oficial, FMRP2101) | cópia de cursinho (Objetivo) |
| Famerp 2023, Conhecimentos Gerais (`famerp-2023`) | 2023 | …/famerp/2023/1dia/famerp2023_1dia_prova.pdf | …/famerp/2023/1dia/famerp2023_1dia_gabarito.pdf (oficial, FMRP2201) | cópia de cursinho (Objetivo) |
| Famerp 2024, Conhecimentos Gerais (`famerp-2024`) | 2024 | …/famerp/2024/1dia/famerp2024_1dia_prova.pdf | …/famerp/2024/1dia/famerp2024_1dia_gabarito.pdf (oficial, FMRP2301) | cópia de cursinho (Objetivo) |
| Famerp 2025, Conhecimentos Gerais (`famerp-2025`) | 2025 | …/famerp/2025/1dia/famerp2025_1dia_prova.pdf | …/famerp/2025/1dia/famerp2025_1dia_gabarito.pdf (oficial, FMRP2401) | cópia de cursinho (Objetivo) |
| Famerp 2026, Conhecimentos Gerais (`famerp-2026`) | 2026 | …/famerp/2026/1dia/famerp2026_1dia_prova.pdf | …/famerp/2026/1dia/famerp2026_1dia_gabarito.pdf (oficial, FMRP2501) | cópia de cursinho (Objetivo) |

## Provas acrescentadas em 12/11/2026 (Santa Casa, Famema, FMJ, Einstein, Unifesp)

Mesma regra de conferência: código do concurso igual no caderno e no gabarito, gabarito "versão 1", ordem das alternativas do caderno igual à da resolução comentada do Objetivo, e as respostas da resolução iguais às do gabarito oficial em todas as questões. Configuração: `ferramentas/ingestao/provas_objetivo.py`.

| Prova (id) | Ano | Onde achou o caderno | Onde achou o gabarito | Tipo de fonte |
|---|---|---|---|---|
| Santa Casa 2020, Conhecimentos Gerais, 2º dia (`santacasa-2020`) | 2020 | …/santacasa/2020/2dia/santacasa2020_2dia_prova.pdf | …/santacasa/2020/2dia/santacasa2020_2dia_gabarito.pdf (oficial, FAVC1902, versão 1); anuladas 12 e 73 pelo gabarito versão 3 do Drive do dono | cópia de cursinho (Objetivo) |
| Santa Casa 2024, Conhecimentos Gerais (`santacasa-2024`) | 2024 | …/santacasa/2024/1dia/santacasa2024_1dia_prova.pdf | …/santacasa/2024/1dia/santacasa2024_gabarito.pdf (oficial, FAVC2301) | cópia de cursinho (Objetivo) |
| Santa Casa 2026, Conhecimentos Gerais (`santacasa-2026`) | 2026 | …/santacasa/2026/1dia/santacasa2026_1dia_prova.pdf | …/santacasa/2026/1dia/santacasa2026_gabarito.pdf (oficial, FAVC2501) | cópia de cursinho (Objetivo) |
| Santa Casa 2027, Conhecimentos Gerais (`santacasa-2027`) | 2027 | …/santacasa/2027/1dia/santacasa2027_1dia_prova.pdf | …/santacasa/2027/1dia/santacasa2027_gabarito.pdf (oficial, FAVC2601) | cópia de cursinho (Objetivo) |
| Famema 2020, Prova II (`famema-2020`) | 2020 | …/famema/2020/famema2020_prova.pdf (pp. 13–23) | …/famema/2020/famema2020_gabarito.pdf (oficial, FMMA1903) | cópia de cursinho (Objetivo) |
| Famema 2021, Prova II (`famema-2021`) | 2021 | …/famema/2021/famema2021_prova.pdf (pp. 13–25) | …/famema/2021/famema2021_gabarito.pdf (oficial, FMMA2001) | cópia de cursinho (Objetivo) |
| Famema 2024, Prova II (`famema-2024`) | 2024 | …/famema/2024/famema2024_prova.pdf (pp. 25–37) | …/famema/2024/famema2024_gabarito.pdf (oficial, FMMA2301; q15 e q16 anuladas depois — confirmado pelo gabarito versão 4 do Drive do dono) | cópia de cursinho (Objetivo) |
| Famema 2025, Prova II (`famema-2025`) | 2025 | …/famema/2025/famema2025_prova.pdf (pp. 13–25) | …/famema/2025/famema2025_gabarito.pdf (oficial, FMMA2401) | cópia de cursinho (Objetivo) |
| Famema 2026, Prova II (`famema-2026`) | 2026 | …/famema/2026/famema2026_prova.pdf (pp. 13–25) | …/famema/2026/famema2026_gabarito.pdf (oficial, FMMA2501) | cópia de cursinho (Objetivo) |
| FMJ 2024, Prova II (`fmj-2024`) | 2024 | …/fmj/2024/fmj2024_prova_II.pdf | …/fmj/2024/fmj2024_gabarito.pdf (oficial, FMJU2301) | cópia de cursinho (Objetivo) |
| FMJ 2025, Prova II (`fmj-2025`) | 2025 | …/fmj/2025/fmj2025_prova_II.pdf | …/fmj/2025/fmj2025_gabarito.pdf (oficial, FMJU2401) | cópia de cursinho (Objetivo) |
| FMJ 2026, Prova II (`fmj-2026`) | 2026 | …/fmj/2026/fmj2026_prova_II.pdf | …/fmj/2026/fmj2026_gabarito.pdf (oficial, FMJU2501) | cópia de cursinho (Objetivo) |
| Einstein 2020, Prova I (`einstein-2020`) | 2020 | …/alberteinstein/2020/alberteinstein2020_prova.pdf (pp. 1–20) | …/alberteinstein/2020/alberteinstein2020_gabarito.pdf (oficial, FEAE1902) | cópia de cursinho (Objetivo) |
| Einstein 2022, Prova I (`einstein-2022`) | 2022 | …/alberteinstein/2022/alberteinstein2022_prova_I.pdf | …/alberteinstein/2022/alberteinstein2022_gabarito.pdf (oficial, FEAE2103) | cópia de cursinho (Objetivo) |
| Einstein 2024, Prova I (`einstein-2024`) | 2024 | …/alberteinstein/2024/alberteinstein2024_prova_I.pdf | …/alberteinstein/2024/alberteinstein2024_gabarito.pdf (oficial, FEAE2303) | cópia de cursinho (Objetivo) |
| Einstein 2025, Prova I (`einstein-2025`) | 2025 | …/alberteinstein/2025/alberteinstein2025_prova_I.pdf | …/alberteinstein/2025/alberteinstein2025_gabarito.pdf (oficial, FEAE2405) | cópia de cursinho (Objetivo) |
| Einstein 2026, Prova I (`einstein-2026`) | 2026 | …/alberteinstein/2026/alberteinstein2026_prova_I.pdf | …/alberteinstein/2026/alberteinstein2026_gabarito.pdf (oficial, FEAE2502) | cópia de cursinho (Objetivo) |

"…" = `https://www.curso-objetivo.br/vestibular/resolucao-comentada`. As páginas do Objetivo carregam a lista de
arquivos por um serviço público do próprio site (`sistemas.objetivo.br/ResolucaoComentadaApi/templates/prova/<n>`),
o mesmo que o navegador usa ao abrir a página.

## O que não entrou (busca parada por ordem do dono, 10/11/2026: ele vai baixar à mão)

Cópias públicas **localizadas, mas não integradas** (os PDFs baixados foram descartados quando a busca parou; os links
ficam aqui para o download à mão). Todos os links do Objetivo seguem o padrão
`…/<instituição>/<ano>/...` da página de resolução comentada de cada instituição:

| Instituição | O que existe e onde | Observação |
|---|---|---|
| Einstein | Objetivo: 2020 (`alberteinstein2020_prova.pdf` + gabarito), 2021–2027 (`…_prova_I.pdf` = 50 objetivas + gabarito), 2023/2 Enfermagem | Prova I objetiva; Prova II discursiva fica fora. |
| Santa Casa (FCMSCSP) | Objetivo: 2020 (2º dia = 80 objetivas + gabarito), 2021–2027 (1º dia = 80 objetivas + gabarito) | |
| Sírio-Libanês | Objetivo: 2025/2, 2026, 2027 (`…_prova_II.pdf` = 40 objetivas + gabarito) | Prova I discursiva fica fora. |
| FMJ | Objetivo: 2024–2027 (`fmj<ano>_prova_II.pdf` = objetivas: 60 em 2024, 40 depois + gabarito) | Só a parte objetiva. |
| Famema | Objetivo: 2020, 2021, 2025, 2026 (o `famema<ano>_prova.pdf` traz Prova I e Prova II; gabarito da Prova II) | 2024: o PDF do Objetivo repete a Prova I (falta a II); 2023: só a resolução no Objetivo; 2022 foi da FGV (não Vunesp). |
| UEA | Qconcursos (arquivo público): Vestibular 2024/acesso 2025 Conhecimentos Gerais `arquivos.qconcursos.com/prova/arquivo_prova/132690/vunesp-2024-uea-vestibular-conhecimentos-gerais-prova.pdf`; gabarito acesso 2026 `…/arquivo_gabarito/153668/vunesp-2025-uea-vestibular-conhecimentos-gerais-gabarito.pdf` | Estratégia tem 2025–2027, mas o robots.txt proíbe PDF. |
| FACISB | Só no Estratégia (2025; robots.txt proíbe PDF) | Não usado. |
| São Camilo (outros anos) | Qconcursos só 2019/2 e 2020/1 (antes de 2020 ou na fronteira); Objetivo só 2024/2 (já no site) | |
| FAI, Uni-Facef, Anhembi Morumbi, Fema Medicina | Nada localizado fora da Vunesp | Baixar à mão. |
