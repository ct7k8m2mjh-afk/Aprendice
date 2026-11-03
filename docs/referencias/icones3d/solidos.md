# Sólidos geométricos (Matemática) — rodadas de comparação com a referência

Referência: `solidos.png`. Cena: `app/src/ui/icones3d/cenas/solidos.js`. Comparação: `node _compara.cjs solidos .../solidos.png`.

| Rodada | Mudança | forma | materiais | cor | detalhes | luz/sombra | enquadr. | % |
|---|---|---|---|---|---|---|---|---|
| 0 | estado inicial: cubo enorme com arestas vivas e linhas, sólidos espalhados, cone amarelo-claro | 6 | 7 | 7 | 5 | 7 | 6 | 65 |
| 1 | cubo com cantos arredondados, cilindro e cone de torno com bordas suaves, câmera mais alta | 7 | 8 | 7.5 | 7 | 7 | 6 | 72 |
| 2 | câmera mais longe e fov menor (menos distorção), cubo menor e mais atrás, cilindro mais atrás | 8 | 8 | 7.5 | 7.5 | 7.5 | 8.5 | 80 |
| 3 | cone mais largo e dourado-alaranjado (metálico), cilindro mais largo, câmera mais alta | 8.5 | 8.5 | 8.5 | 8 | 7.5 | 9 | 85 |
| 4 | luz suave de cima (só desta cena): topo do cubo e do cilindro mais claros que as frentes; azul mais fundo; esfera com brilho mais suave | 9 | 9 | 9 | 8.5 | 8.5 | 9 | 89 |
| 5 | cilindro na altura da referência, cone mais à esquerda (atrás da esfera) | 9 | 9 | 9 | 8.5 | 8.5 | 9.5 | 90 |

Diferença que fica: o topo do cubo na referência é mais claro (quase ciano); a referência tem contorno branco de adesivo (não reproduzido de propósito).
Animação: sólidos giram e a esfera quica ao passar o mouse — conferido com `ATIVO=1`.
