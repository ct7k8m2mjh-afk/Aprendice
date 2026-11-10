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

"…" = `https://www.curso-objetivo.br/vestibular/resolucao-comentada`. As páginas do Objetivo carregam a lista de
arquivos por um serviço público do próprio site (`sistemas.objetivo.br/ResolucaoComentadaApi/templates/prova/<n>`),
o mesmo que o navegador usa ao abrir a página.
