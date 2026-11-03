# Célula 3D — rodadas de comparação com a referência

Referência: `docs/referencias/icones3d/celula.png`. Cena: `app/src/ui/icones3d/cenas/celula.js`.
Comparação lado a lado: `node app/_compara.cjs celula docs/referencias/icones3d/celula.png` (esquerda = cena, direita = referência).
Notas de 0 a 10: forma/proporção · materiais · cor · detalhes · luz e sombra · enquadramento.

## Leitura da referência (medida, não chutada)
- Ajustei a câmera por mínimos quadrados a 12 marcos da imagem (pontas do corte no piso, silhueta, polo).
  Com a cunha de 90° o erro ficou em ~150 px; deixando o ângulo livre, o ajuste deu **177°** (erro ~10 px).
  Ou seja: o "quarto removido" é **um quarto do volume** = a metade de cima da frente. Há **uma parede vertical**
  (meio disco) e o **piso** (meio disco); não há duas faces verticais. O núcleo, apoiado no piso, tem **um oitavo** removido
  (três faces de corte em camadas, com o nucleoplasma em domo dentro).
- Câmera ajustada: pos (1,93; 2,54; 1,96), alvo (−0,05; 0,96; 0,05), fov 41,6°.
- Posições das organelas tiradas por projeção inversa da imagem para a parede/piso.

## Rodadas
| # | O que mudou | Forma | Mat. | Cor | Det. | Luz | Enq. | Similar. |
|---|---|---|---|---|---|---|---|---|
| 0 | cena antiga (cunha 90°, casca com fendas) | 4 | 4 | 5 | 4 | 5 | 5 | 45% |
| 1 | geometria nova: parede + piso, câmera ajustada, membrana com rede no sombreador, núcleo com oitavo aberto | 7 | 5 | 5 | 6 | 6 | 8 | 60% |
| 2–3 | rede ciano em alvéolos (faixas), cores da membrana, RER maior, retículo liso maior | 7 | 6 | 6 | 7 | 6 | 9 | 66% |
| 4–5 | funil do centríolo embutido num furo da parede; parede creme; mitocôndrias com cristas | 8 | 6 | 7 | 7 | 6 | 9 | 70% |
| 6–9 | membrana: perfil, cores, largura das cristas (depuração: alvéolos pareciam furos por serem quase brancos) | 8 | 6 | 7 | 7 | 7 | 9 | 72% |
| 10–16 | RER: seixos achatados tangentes + anel no piso; Golgi menor e mais fino; retículo liso em rede; escada ciano do piso na frente do núcleo | 8 | 7 | 7.5 | 8 | 7 | 9 | 78% |
| 17–20 | membrana fosca (sem verniz), alvéolos arredondados (F1/F2 do Worley) em vez de polígonos; relevo de vértice suave | 8.5 | 7.5 | 7.5 | 8 | 7.5 | 9 | 81% |
