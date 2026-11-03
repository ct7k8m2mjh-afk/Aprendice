# Átomo (Química) — rodadas de comparação com a referência

Referência: `atomo.png`. Cena: `app/src/ui/icones3d/cenas/atomo.js`. Comparação: `node _compara.cjs atomo .../atomo.png`.

| Rodada | Mudança | forma | materiais | cor | detalhes | luz/sombra | enquadr. | % |
|---|---|---|---|---|---|---|---|---|
| 0 | estado inicial: órbitas grandes e redondas, núcleo pequeno, sombra dura das órbitas | 5 | 7 | 8 | 6 | 5 | 6 | 60 |
| 1 | órbitas recalculadas pela referência (3 elipses: quase horizontal, subindo 36°, quase vertical 106°), núcleo maior, sombra em mancha suave | 6 | 8 | 8 | 7 | 7 | 7 | 72 |
| 2 | inclinação de cada órbita em grupos aninhados (giro na tela + inclinação no eixo maior), órbitas mais finas | 7 | 8 | 8 | 7 | 7 | 8 | 78 |
| 3 | câmera mais perto, núcleo mais compacto e centrado, órbita vertical passa NA FRENTE dos prótons, metal das órbitas mais escuro | 8.5 | 8.5 | 9 | 8 | 8 | 9 | 86 |
| 4 | núcleo maior e mais "colado", brilho mais suave nas bolas, sombra mais escura sob o átomo | 9 | 9 | 9 | 8.5 | 8.5 | 9 | 90 |

Diferença que fica: a referência mostra 7 elétrons (um extra no alto à esquerda); a cena usa 2 por órbita (6), como pedido.
Animação: elétrons percorrem as órbitas (lento em repouso, rápido ao passar o mouse) — conferido com `ATIVO=1`.
