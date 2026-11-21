# Provas baixadas a partir de links do dono

Organização: `fontes/provas-manuais/<sigla>/<ano>/` com o caderno e o gabarito como vieram (arquivos compactados já abertos).
Cada prova daqui é integrada depois pelo pipeline normal (`ferramentas/ingestao/`) em `app/conteudo-fonte/provas/<id>/`.
No site a fonte mostrada é a da prova (instituição, banca, ano); a origem do arquivo fica registrada aqui (princípio 10: o dono decide os direitos).

| Sigla | Ano | Arquivos | Origem (link do dono, 11/11/2026) | Situação |
|---|---|---|---|---|
| — | — | — | — | Lista completa (129 arquivos de 26 instituições, 2020+) em `manifesto.json`; os PDFs ficam fora do git: `python3 ferramentas/ingestao/baixa_brasilescola.py sigla=slug ...` baixa de novo (slugs no manifesto, campo origem) |
| einstein | 2021-1 | prova-1.pdf, prova-2.pdf, gabarito-prova-1.pdf | vestibular.brasilescola.uol.com.br/baixar/47298 | baixado; cadernos oficiais (Vunesp) |
| einstein | 2021-2-enfermagem | caderno-e-gabarito.pdf | /baixar/47363 | baixado |
| einstein | 2022-2-enfermagem | CADERNO_..., GABARITO_... | /baixar/47524 | baixado |
| einstein | 2023 | prova-01, prova-02, gabarito | /baixar/47553 | baixado |
| einstein | 2020 | — | /baixar/46844 | link quebrado (404) |
| einstein | 2024–2026 | — | — | não estão na página do link |

Página de partida: https://vestibular.brasilescola.uol.com.br/downloads/faculdade-israelita-ciencias-saude-albert-einstein.htm

## Integração do grupo A (11/11/2026)

Unicamp, UERJ, Santa Casa, Einstein, FMJ, São Camilo e Anhembi: 30 provas integradas em `app/conteudo-fonte/provas/` (lista e o que falta em `docs/provas/faltantes-por-ano.md`, seção Grupo A). Os arquivos .rar (Unicamp 2024, UERJ 2024) foram abertos em `extraido/` dentro da pasta da prova. A origem de cada PDF (link do Brasil Escola e nome do arquivo) está no campo `origem` do `prova.json`; no site a fonte mostrada é a página oficial.
