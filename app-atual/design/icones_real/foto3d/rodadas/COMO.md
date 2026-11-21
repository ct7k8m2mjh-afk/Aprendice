# Rodadas de melhoria dos ícones 3D (pedido do dono, 03/11: até 100 rodadas)

Cada rodada:
1. render rápido (512 px, 24 amostras, SO_COMPLETO=1) da cena;
2. comparação lado a lado com a referência (rodadas/ref-<ID>.*) sobre fundo #F7F4EF;
3. nota 0–10 em cada critério: forma/proporção, materiais/textura, cor, detalhe/riqueza, luz e sombra (de frente e de cima,
   sombra curta e atrás, objeto apoiado no chão), correção científica;
4. UMA lista curta do que mais afasta da referência e a correção aplicada;
5. registro em rodadas/<ID>.md (número, notas, o que mudou, caminho da imagem da rodada).
A cada 10 rodadas, ou quando melhorar muito, um render final 1024 px / 96 amostras (camadas completas).
Nunca piorar: se a rodada piorar, voltar ao script anterior (guardar cópia cenas/<ID>.py em rodadas/<ID>-rNN.py).
