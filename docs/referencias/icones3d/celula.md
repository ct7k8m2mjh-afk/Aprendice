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
| 21–24 | alvéolos maiores; Golgi curvo; rede ciano em leque em volta do funil; tons da membrana | 8.5 | 7.5 | 7.5 | 8 | 7.5 | 9 | 82% |
| 25–33 | sementes fixas por bloco (cena estável); RER fora do oitavo aberto, lado direito do núcleo à mostra; cristas em labirinto; mitocôndrias em feijão; grânulos e poros do núcleo como na referência | 9 | 7.5 | 8 | 8.5 | 7.5 | 9 | 84% |
| 34–44 | Golgi: grampos altos atrás + bolsas abertas na frente (normais lisas); retículo liso refeito como teias de laços (3 tentativas: folha furada, anéis, laços + membrana) | 9 | 7.5 | 8 | 8.5 | 7.5 | 9 | 85% |
| 45–51 | borda do corte com o mesmo relevo da membrana; sombras de contato no piso/parede; correção de tons por região (medida: membrana da frente 205/193/158 vs ref 206/192/159) | 9 | 8 | 8.5 | 8.5 | 8 | 9.5 | 86% |
| 52–55 | cavidade suave no pé das cristas; rebatedor na metade de baixo (a ref. é iluminada por baixo também); teste de perfil de tubo (pior, revertido) | 9 | 8 | 8.5 | 8.5 | 8 | 9.5 | **87%** |

Métricas automáticas na última rodada (640 px): silhueta IoU 0,90; erro de cor por bloco 32 (o fundo cinza da referência pesa).
Desempenho: 201 malhas, ~275 mil triângulos (membrana em sombreador, sem textura grande). Testes: 69/69.
Animação conferida com `ATIVO=1`: vesículas saem do Golgi para a membrana; mitocôndrias pulsam.

## O que ainda separa dos 90%
- Membrana: na referência as cristas são "cordões" mais gordos e brilhantes sobre alvéolos lisos; aqui ainda leem como rede mais fina.
- Retículo rugoso: a referência tem cortinas onduladas em camadas em volta do núcleo; aqui são seixos achatados.
- Retículo liso: a referência tem teias com membrana entre os furos; aqui são laços de tubo.
- Luz: a referência é estúdio com fundo cinza e oclusão suave; a luz do palco (fixa, em cenas3d.js) é mais dura.
