# REVISAO — conferência independente dos 35 cartões com imagem (29/10/2026)

## Método

1. Cada SVG renderizado com Playwright/Chromium a 1000 px de largura e em recorte ampliado 5× (±60 unidades do viewBox) em volta da ponta do marcador, em duas versões: com o marcador e **sem o marcador** (só uma mira verde de 1 px no ponto exato), para ver o que está embaixo da ponta. Todas as imagens foram olhadas uma a uma.
2. Anatomia conferida no OpenStax Anatomy & Physiology 2e (§13.2: tronco = mesencéfalo + ponte + bulbo; cerebelo "on the posterior surface of the brain stem"; sulco lateral separa o lobo temporal; lobo frontal anterior ao sulco central. §19.1: VCS drena no átrio direito; VE com parede bem mais espessa; VE ejeta na aorta; **a aurícula é "extension of the atria" / "atrial appendage", não o átrio**). Organelas pela morfologia da própria figura (cristas, cisternas empilhadas, ribossomos aderidos).
3. Nomes de vidraria conferidos em Toda Matéria, "Vidrarias de laboratório" (béquer/Becker; funil de bromo = funil de separação) e no roteiro de aula "Reconhecimento de vidrarias" do IQ-UFG (funil de decantação, almofariz e pistilo, pipeta graduada × volumétrica).
4. Geometria (mat): conferência visual + coordenadas (pontos da base da geratriz e do plano meridiano caem sobre a elipse da base; apótema vai ao ponto médio da aresta).

## Resultado por cartão

| id | marcador | dados | ação |
|---|---|---|---|
| bio-i01 cerebelo | ok (folhas estriadas, atrás do tronco) | ok | — |
| bio-i02 tronco encefálico | **duvidoso**: a ponta caía no terço inferior da haste, abaixo do cerebelo, onde a figura já pode ser medula espinal (o erro_comum do próprio cartão diz "chamar de medula espinal") | aceita incluía "bulbo", "bulbo raquidiano", "medula oblonga" (parte, não o todo; a figura não delimita bulbo × ponte) | ponto movido de (302.8, 389) para (303, 336): haste logo abaixo do cérebro, ao lado do cerebelo, inequivocamente tronco. Removidos os 3 termos de "aceita"; erro_comum ganhou a nota de que "bulbo"/"ponte" sozinhos ficam incompletos |
| bio-i03 lobo frontal | ok (polo anterior; posterior = lado do cerebelo) | ok | — |
| bio-i04 lobo temporal | ok (abaixo do sulco lateral) | ok | — |
| bio-i05 átrio direito | ok (câmara que recebe VCS e VCI, à esquerda de quem olha) | "aurícula direita" em aceita: pela nomenclatura atual (e OpenStax) aurícula é o apêndice atrial, não o átrio | removido "aurícula direita" |
| bio-i06 aorta | ok (arco com os 3 ramos) | ok | — |
| bio-i07 veia cava superior | ok | ok | — |
| bio-i08 ventrículo esquerdo | ok (cavidade à direita de quem olha; o tronco pulmonar sai da cavidade da esquerda = VD) | ok | — |
| bio-i09 fígado | ok | ok | — |
| bio-i10 vesícula biliar | ok (corpo da vesícula, não o ducto cístico) | ok | — |
| bio-i11 estômago | ok | ok | — |
| bio-i12 pâncreas | ok (cabeça amarela lobulada dentro do C duodenal) | ok | — |
| bio-i13 mitocôndria | ok | "condrioma" = conjunto das mitocôndrias da célula, não a organela | removido "condrioma" |
| bio-i14 complexo golgiense | ok (dentro de uma cisterna) | ok | — |
| bio-i15 RER | **impreciso**: a ponta caía na borda/fileira de ribossomos entre duas cisternas | ok | ponto movido de (205.5, 334.6) para (197.5, 323.2): dentro do lúmen da cisterna superior |
| qui-i01 bureta | ok | ok | — |
| qui-i02 erlenmeyer | ok | ok | — |
| qui-i03 kitassato | ok | ok | ilustração estava **cortada** à direita (borda do frasco e ponta da saída lateral): `overflow="hidden"` → `visible` no SVG interno do frasco |
| qui-i04 funil de Büchner | ok | ok | mesmo corte corrigido |
| qui-i05 béquer | ok | ok | — |
| qui-i06 balão volumétrico | ok | "balão de diluição" não é nome usual (ausente nas fontes) | removido |
| qui-i07 proveta | ok | ok | — |
| qui-i08 funil de separação | ok | ok | — |
| qui-i09 condensador | ok | "refrigerante" (uso de Portugal, ausente nas fontes brasileiras) removido; erro_comum: "saída de baixo" → "conexão de baixo" | corrigido |
| qui-i10 funil | ok | essencial exigia "funil" **e** "papel de filtro", e "funil" puro não estava em aceita: a resposta certa "funil" sairia como incompleta | essencial = ["funil"]; "funil" incluído em aceita |
| qui-i11 almofariz | ok | frente dizia "vidraria", mas almofariz é de porcelana | frente → "Qual material de laboratório é indicado pelo número 1?" |
| qui-i12 pipeta graduada | ok (graduação ao longo do corpo) | "pipeta" sozinha em aceita contradiz o erro_comum (graduada × volumétrica) | removido "pipeta" |
| mat-i01 geratriz | ok (vértice → ponto da circunferência da base) | ok | — |
| mat-i02 apótema da pirâmide | ok (vértice → ponto médio da aresta frontal) | ok | — |
| mat-i03 apótema da base | ok (centro → ponto médio da aresta) | ok | — |
| mat-i04 diagonal do cubo | ok (vértices opostos; base com diagonal de face tracejada) | ok | — |
| mat-i05 secção meridiana | ok (retângulo contendo o eixo) | ok | — |
| mat-i06 círculo máximo | ok | ok | — |
| mat-i07 base menor | ok | ok | — |
| mat-i08 face lateral | ok | ok | — |

Nenhum cartão removido: 35 continuam em D['flash_img'] (bio 15, qui 12, mat 8).

## Arquivos

- SVGs originais antes da revisão: `_bak_rev/` (bio-i02, bio-i15, qui-i03, qui-i04).
- Dados antes da revisão: `bio/index.html.bak_rev_flashimg`, `bio/dados.json.bak_rev_flashimg`, idem em `qui/`. `mat/` não foi alterado.
- `design/gera_design.py` não foi rodado. Os prints antigos em `prints/` de bio-i02, bio-i15, qui-i03 e qui-i04 mostram a posição anterior.
