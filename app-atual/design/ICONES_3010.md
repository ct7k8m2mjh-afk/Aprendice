# Ícones — correções de 30/10

Backups de tudo o que mudou: `design/icones_real/_bak_3010/` (SVGs, `mapa.json`, `sub/mapa_por.json` e os 3 geradores).
Prévias (Chromium, com o desfoque real das sombras; 110 px e 32 px, fundo claro e escuro):
- antes: `/tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/icones3010/ANTES.png`
- depois: `/tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/icones3010/DEPOIS.png`
- folhas completas das 4 matérias (depois): `.../icones3010/chrome_P.png`, `chrome_M.png`, `chrome_Q.png`, `chrome_B.png`
- o "chapéu e óculos de traço" que o Vitor viu: `.../icones3010/antes_P01.2_traco_phosphor.png`

## O que mudou
| Ícone | Antes | Depois |
|---|---|---|
| **P02** Argumentação (módulo) | martelo de juiz | dois balões de fala sobrepostos com volume: **SIM** (verde, na frente, rabicho para a esquerda) e **NÃO** (coral, atrás, rabicho para a direita). O texto virou contorno (DejaVu Sans Condensed Bold). A única sombra é a do balão da frente projetada no de trás. Não há sombra no chão porque balões de fala flutuam. Gerador: `icones_real/fonte_gerador/gera_3010.py` |
| **P01.2** Informação explícita × inferência | o SVG realista era um iceberg; quando faltava o realista, o app mostrava o traço Phosphor "detective" (chapéu e óculos chapados num ladrilho amarelo) | disfarce de detetive realista: chapéu fedora de feltro com fita, óculos redondos de tartaruga com lentes brilhantes e bigode. Mesmo gerador |
| **M04.3** Sistemas lineares | casco cinza enorme embaixo dos planos | sem sombra: os planos flutuam e não há chão no desenho. A sombra também saiu do gerador (`sub_mat_a.py: M04_3`) |
| **P02.4** Balança (contra-argumento) | duas caixas brancas com contorno preto atrás dos pratos (resto do SVG original da Servier) | caixas removidas |
| **P08.1** guarda-chuva, **Q02.3**, **B02.5**, **Q11.1** (moléculas), **M15.2** (paralelepípedo) | sombra de chão escura, com o desenho do casco marcado, embaixo de objetos que flutuam | mesma projeção, mais clara e bem mais desfocada, como a penumbra de um objeto que está longe do chão |

Em P02, só o módulo tinha martelo. As subs P02.1 a P02.4 (fachada, óculos, máscaras, balança) ficaram como estavam, menos a limpeza da P02.4.
As subs P01.1, P01.3 e P01.4 (folha com marca-texto, livro, alvo) já eram realistas e ficaram.
`mapa.json` (P02) e `sub/mapa_por.json` (P01.2) foram atualizados com a nova fonte e o porquê.
`gera_por.py: P02` e `gera_sub_por.py: P01_2` ganharam um comentário dizendo que o ícone publicado vem de `gera_3010.py`.

## Achado importante (não mexi: é o build)
1. **O cairosvg ignora `feGaussianBlur`.** Toda sombra de contato sai como um polígono cinza duro quando passa pelo cairosvg. O `gera_design.py` faz as miniaturas WebP 64 px do shell (busca e Atividade recente) com o cairosvg, então nesses lugares as sombras aparecem como manchas duras que "não fazem sentido". No navegador (as matérias usam o SVG via `<img>`) elas saem desfocadas e corretas. Sugestão: gerar as miniaturas pelo Chromium (playwright está em `/opt/npm-tools/node_modules/playwright`) ou rasterizar tirando o filtro.
2. Se alguém rodar de novo `constroi_sub_*.sh` / `constroi.sh`, o P02 e o P01.2 continuam certos, porque eles vêm de `gera_3010.py`, que se roda à parte com `python3 gera_3010.py ..`. Já o abrandamento das sombras de P08.1, Q02.3, B02.5, Q11.1 e M15.2 e a limpeza da P02.4 foram feitos no SVG final e se perderiam.

## Auditoria: o que ainda é fraco (não corrigido)
- **P12.4** ovo: contorno fino e rachadura de traço, o mais "desenho chapado" que sobrou.
- **P02.2** óculos (Servier): traço fino, pouco volume, sombra elíptica rasa.
- **M09.5** triângulos e semicírculo chapados sobre uma linha.
- **M10** círculo trigonométrico: quase só traço.
- **B06.3** heredograma: diagrama com peças 3D, aceitável.
- **B10** mosquito (Servier): traço fino.
- **P09.1** bonecos de papel: chapado, mas o papel é chapado mesmo.
- Moléculas flutuando com sombra de casco (Q01, Q02, Q01.2, Q02.2, Q04.3, Q11.2 a Q11.7, Q12.3, Q12.4, B02, B03.1, B03.3): no navegador ficam corretas e desfocadas. Na miniatura do shell ficam duras (ver o achado 1).
