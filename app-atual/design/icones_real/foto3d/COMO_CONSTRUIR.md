# Como construir um ícone 3D animável (padrão desde 03/11)

Leia antes: /home/user/aprendice/docs/pedidos-do-dono.md (regras do dono), /home/user/aprendice/docs/animacoes-dos-icones.md
(a função e a animação de cada ícone), /home/user/aprendice/docs/ciencia-dos-icones.md (correção científica).

1. Referência: a imagem aprovada pelo dono. Reproduza composição, proporções, cores e materiais, mas corrija o que não fizer
   sentido físico ou científico (anote a correção).
2. Cena: cenas/<ID>.py com kit.py + cenas/_bk.py / _bio2.py (org(): material com ruído, relevo e cavidades). Materiais ricos,
   nada de plástico chapado. Não edite kit.py nem camadas.py: luz de frente e de cima, o fundo é o chão, sombra curta para trás,
   objeto apoiado no chão.
3. Animação pela FUNÇÃO: defina passo(t) (t de 0 a 1, ciclo fechado: em t=1 a cena volta a ser igual a t=0) que move só o que
   a função pede (ex.: elétrons andando nas órbitas). No fim da cena:
       from camadas import render_quadros, render_camadas
       render_quadros('<ID>', passo, n=24, elev=..., azim=..., folga=...)
   (o quadro 0 é o ícone parado). Se o ícone não tiver movimento próprio, não use quadros (fica parado com leve elevação).
4. Rodadas: render rápido (QUADRO_TAM=384 QUADRO_AMOSTRAS=16 QUADROS_N=6) e compare lado a lado com a referência (PIL + Read).
   Dê nota a cada critério (forma, materiais, cor, detalhe, luz e sombra, ciência, animação). Corrija o que mais afasta. Repita
   até ficar no nível da referência. Registre em rodadas/<ID>.md.
5. Final: QUADRO_TAM=512 QUADRO_AMOSTRAS=48 QUADROS_N=24, sempre sob `flock /tmp/render.lock` (CPU compartilhada).
   Depois: cd /home/user/aprendice && python3 ferramentas/icones/camadas_app.py <ID>  (gera parado.webp + filme.webp no app).
6. Confira o filme: monte uma folha com 6 quadros espaçados e veja se o movimento está certo e contínuo.
