# Artes do Treino geral de cada matéria (dono, 10/11/2026)

Originais do dono, baixados sem alteração (PNG com transparência, 1448 x 1086) do Google Drive, pasta id
`1sI536sCkQMppPgoiHwiMzJxo0TYClT0R` (uma subpasta por matéria, cada uma com `claro.png` e `escuro.png`,
nomes em maiúsculas em algumas pastas), em 11/11/2026.

| Pasta aqui | Subpasta no Drive | Arquivos (id no Drive) |
|---|---|---|
| `bio/` | BIOLOGIA | claro `107QYJ7cTka5X4jXJOVbuBO_aSScA6wK-` · escuro `18j6ZFAzKNp-nyALMe9MwLDVFTklJRdOC` |
| `qui/` | QUIMICA | claro `1kkPSQyDxTtEWRllHGqd7qGwJw6Xfif0p` · escuro `19IGE3XH4dMuOuhZCD0T0ebXMAWtoCUCr` |
| `mat/` | MATEMÁTICA | claro `1jyddatFeBFj71HSuyh8lsXQ_t_h5xgZp` · escuro `1UsMHIwB76es7jT1ot901YdzL0kbXCZBI` |
| `por/` | PORTUGUES | claro `1HkqyhfiHUW1AMBg1aqtMVfT9y4dO-ERl` · escuro `1rjIfRgXg6Z2LCcTwVz731dYkGiGYufto` |
| `fis/` | FISICA | CLARO `14c3AcZU2qeoQDI5GQZZ6czUIb9WMtdsK` · ESCURO `15T3lJYZkQX2y2xiWHzgM1nj7JN73LVfh` |
| `geo/` | GEOGRAFIA | claro `1VQxHtbv82TdHtBdzSZ_DR-Xh3Px-DU-L` · escuro `1CQi-A3S_1kMZIG6qO5ICZKIUPUIBiKRx` |
| `his/` | HISTORIA | CLARO `11vbmrsRQhb5WW2DVu0la1osVsTSf1X6r` · escuro `1Fr5ED7beClNfWX6vw3czO4aGyT3NZfwF` |
| `ing/` | INGLES | claro `1nxCLxlaDyhAloBFTV8BUxlQT4ceNfIuL` · escuro `1PEWClHBSqPA9duvemFcijdp87lrYAWKF` |
| `fs/` | SOCIO. FILO | CLARO `1_CVLadXNRbkgy56UOo3PAXgUi2bmon44` · ESCURO `1P6fu2qcNSLx4ZYIOjM2KG30yf8iTxd_r` |

Todas as 9 matérias têm as duas artes; nenhuma ficou com a arte antiga.

## No site
- `app/scripts/capas.py` (`treino_materia`, chamado no build por `converte.py`) gera `public/conteudo/capas/tg-<m>-claro.webp`
  e `tg-<m>-escuro.webp`: apaga os pontinhos soltos de baixa opacidade que o recorte deixou longe do desenho, recorta a
  transparência e reduz para 680 px de largura (cerca de 50 a 100 KB cada). Sem sombra acrescentada (dono, 09/11/2026).
  `src/dados/capas.ts` (`ARTE_TREINO`) lista as matérias que têm a arte; matéria sem PNG aqui continua com a arte da matéria.
- Entra só no cartão "Treino geral de <matéria>" da página da matéria (`ArteTreinoMateria`, `.capa-tg .arte-tg`),
  a do tema ativo: inteira, centrada na vertical à direita do cartão; no celular, acima do título.
  A arte do Treino geral do Início (`treino-geral.webp`) e as capas do topo da matéria não mudaram.
- Origem e direitos: artes do próprio dono (Drive), sem material de terceiros.
