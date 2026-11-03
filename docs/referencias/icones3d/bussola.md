# Mapa e bússola (Geografia) — rodadas de comparação com a referência

Referência: `bussola.png`. Cena: `app/src/ui/icones3d/cenas/bussola.js`. Comparação: `node _compara.cjs bussola .../bussola.png`.

| Rodada | Mudança | forma | materiais | cor | detalhes | luz/sombra | enquadr. | % |
|---|---|---|---|---|---|---|---|---|
| 0 | estado inicial: mapa deitado em 4 tiras soltas, cores pálidas, bússola deitada e grande demais, câmera cortando | 5 | 6 | 5 | 5 | 6 | 4 | 50 |
| 1 | refeito: folha única dobrada em 3 painéis (sanfona) inclinada para trás; bússola em pé de frente para a câmera com aro, argola e coroa; alfinete de mapa (cabeça + cone tangente, miolo branco); câmera frontal | 8 | 7 | 6.5 | 7 | 7 | 8 | 73 |
| 2 | face branca visível (estava escondida pela caixa), cores do relevo saturadas, curvas de nível, bússola menor, dobra mais marcada | 8.5 | 8 | 8 | 8 | 7.5 | 8.5 | 81 |
| 3 | mapa topográfico refeito: relevo com distorção de domínio, curvas de nível finas, rio principal em meandros descendo do alto ao canto inferior direito com afluentes, margem branca; câmera mais perto | 8.5 | 8.5 | 8.5 | 8.5 | 8 | 9 | 86 |
| 4 | letras N/L/S/O em negrito preto, agulha mais larga com facetas claro/escuro, ouro mais claro, painel direito mais inclinado, sombra de contato suave no lugar da elipse dura no chão, marca branca sob a ponta do alfinete, bússola um pouco menor e mais à direita | 9 | 9 | 8.5 | 9 | 8.5 | 9 | 90 |
| 5 | (descartada no meio) mapa procedural 2048 px: relevo em faixas com degraus sombreados e rios largos ramificados — substituído pela nova direção do dono (pintar primeiro, aplicar em 3D) | — | — | — | — | — | — | — |
| 6 | mapa = pintura da própria referência: área colorida de `bussola.png` desdobrada painel a painel (bordas de cima/baixo medidas, dobras em u=0,338 e 0,668) numa folha plana de 2048 px; áreas tapadas pela bússola e alfinete preenchidas com cor de fundo (inpaint em baixa resolução) + curvas de nível clonadas de áreas vizinhas; nitidez (unsharp duplo); bump das faixas de matiz (verde baixo → laranja alto, rio rebaixado); dobras 3D movidas para onde a pintura dobra | 9 | 8.5 | 7 | 8.5 | 8.5 | 9 | 86 |
| 7 | cor fiel: material do mapa sem tone mapping (o ACES desbotava verdes e amarelos), brilho calibrado (amarelo 227,191,81 vs ref 239,205,84); papel branco | 9 | 9 | 9 | 9 | 8.5 | 9 | 90 |
| 8 | base branca do alfinete modelada (disco grosso com borda arredondada e miolo cinza), deitada no painel e achatada como na referência, sem receber sombra; ponta entra no centro da base; sombra dura do mapa no chão trocada por contato suave | 9 | 9 | 9 | 9 | 9 | 9 | 92 |
| 9 | mapa **criado do zero** (`texturas/gera-mapa.py`, nenhum pixel da referência), 3072×2034 px: relevo fractal (5 oitavas + 3 camadas de distorção para bordas serrilhadas) em 10 faixas hipsométricas (verde-escuro → verde → verde-amarelo → amarelo → laranja-amarelo, cores tiradas a olho); cada borda em terraço (linha escura no lado da sombra, clara no lado da luz, sombra macia no patamar de baixo, luz do alto à esquerda); 2 curvas finas por faixa; grão de papel; rio azul vivo (centro 28,162,234, borda clara, margem azul-escura, orla clara, reflexos finos) do alto à esquerda descendo pelo meio até a base, com braço, 3 afluentes e vales verdes em volta; bump = degraus das faixas com rio rebaixado; margem branca | 9 | 9 | 9 | 9 | 9 | 9 | 92 |

Recorte do mapa (dono, 03/11, nota 60): rodada 8 = **9/10** — mesmo terreno em degraus hipsométricos, rio azul vivo largo com afluentes e margem clara, papel com borda branca e dobras, base branca do alfinete. Fica: a pintura é um pouco mais macia que a referência (veio de 280 px ampliados), e o terreno sob a bússola é preenchido (não aparece).
Textura (até a rodada 8): extraída da referência — **substituída na rodada 9** (regra do dono: nunca copiar/extrair a referência; criar igual). O script de extração foi removido.

Recorte do mapa, rodada 9: **9/10** — mesmo terreno em terraços, mesma paleta (água mediana 45,149,215 vs ref 41,162,216; verde 118,181,51 vs 120,177,47), rio no mesmo traçado; nítido em 3072 px (a referência é de 280 px ampliados). Fica: lado direito um pouco mais laranja; o rio da referência é mais trançado logo abaixo do alfinete.

Diferenças que ficam: a agulha da referência aponta para nordeste; aqui aponta o N (pedido científico). O mapa da referência é um pouco mais amarelo nas partes altas.

## Animação (pesquisa `docs/pesquisa/animacao-dos-icones.md`, 5.1)
- **Repouso (e "reduzir movimento"):** estado final, parado — agulha no N, alfinete espetado. Sem tremida.
- **Ativação (uma vez, ~1,8 s):** um toque tira a agulha do lugar (velocidade inicial) e ela faz oscilação amortecida (A·e^(−2,6t)·sen(8,5t)), parando exatamente no N em 1,35 s. Junto do toque o alfinete é tirado do mapa (0,3 s); quando a agulha assenta, ele cai acelerando (0,22 s), espeta e assenta 2–3 mm em 0,12 s, sem quique.
- Ao sair no meio da animação: volta ao estado final em ~250 ms.
- Conferido quadro a quadro com relógio congelado.
