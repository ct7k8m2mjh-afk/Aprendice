# Mapa e bússola (Geografia) — rodadas de comparação com a referência

Referência: `bussola.png`. Cena: `app/src/ui/icones3d/cenas/bussola.js`. Comparação: `node _compara.cjs bussola .../bussola.png`.

| Rodada | Mudança | forma | materiais | cor | detalhes | luz/sombra | enquadr. | % |
|---|---|---|---|---|---|---|---|---|
| 0 | estado inicial: mapa deitado em 4 tiras soltas, cores pálidas, bússola deitada e grande demais, câmera cortando | 5 | 6 | 5 | 5 | 6 | 4 | 50 |
| 1 | refeito: folha única dobrada em 3 painéis (sanfona) inclinada para trás; bússola em pé de frente para a câmera com aro, argola e coroa; alfinete de mapa (cabeça + cone tangente, miolo branco); câmera frontal | 8 | 7 | 6.5 | 7 | 7 | 8 | 73 |
| 2 | face branca visível (estava escondida pela caixa), cores do relevo saturadas, curvas de nível, bússola menor, dobra mais marcada | 8.5 | 8 | 8 | 8 | 7.5 | 8.5 | 81 |
| 3 | mapa topográfico refeito: relevo com distorção de domínio, curvas de nível finas, rio principal em meandros descendo do alto ao canto inferior direito com afluentes, margem branca; câmera mais perto | 8.5 | 8.5 | 8.5 | 8.5 | 8 | 9 | 86 |
| 4 | letras N/L/S/O em negrito preto, agulha mais larga com facetas claro/escuro, ouro mais claro, painel direito mais inclinado, sombra de contato suave no lugar da elipse dura no chão, marca branca sob a ponta do alfinete, bússola um pouco menor e mais à direita | 9 | 9 | 8.5 | 9 | 8.5 | 9 | 90 |

Diferenças que ficam: a agulha da referência aponta para nordeste; aqui aponta o N (pedido científico). O mapa da referência é um pouco mais amarelo nas partes altas.

## Animação (pesquisa `docs/pesquisa/animacao-dos-icones.md`, 5.1)
- **Repouso (e "reduzir movimento"):** estado final, parado — agulha no N, alfinete espetado. Sem tremida.
- **Ativação (uma vez, ~1,8 s):** um toque tira a agulha do lugar (velocidade inicial) e ela faz oscilação amortecida (A·e^(−2,6t)·sen(8,5t)), parando exatamente no N em 1,35 s. Junto do toque o alfinete é tirado do mapa (0,3 s); quando a agulha assenta, ele cai acelerando (0,22 s), espeta e assenta 2–3 mm em 0,12 s, sem quique.
- Ao sair no meio da animação: volta ao estado final em ~250 ms.
- Conferido quadro a quadro com relógio congelado.
