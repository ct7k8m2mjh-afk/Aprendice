# FLASH_IMG — registro dos cartões com imagem

Gerado em 29/10/2026. 35 cartões: bio 15, qui 12, mat 8. Dados em D['flash_img'] de bio/, qui/ e mat/ (D['flash'] e o banco intactos; backups *.bak_flashimg).

## Método de conferência

1. Coordenadas da estrutura lidas na ilustração original renderizada com grade (Playwright → PNG, grade em unidades do viewBox).
2. Quando a Servier publica a versão rotulada (digestório, célula), o alvo foi conferido contra a ponta da linha-guia/seta do próprio autor; os rótulos e as linhas foram removidos do cartão.
3. Conferência anatômica no OpenStax (A&P 2e §13.2, §19.1, §23.1, §23.6; Biology 2e §4.3, §4.4), via WebFetch.
4. 1ª passada: cartão a 600 px + recorte ampliado 3× em volta do ponto. Correções feitas: Golgi e RER (o ponto caía no envoltório nuclear / citoplasma), VE movido para perto do ápice, cubo com nova vista, cilindro com plano oblíquo, prisma com duas faces visíveis, rótulos que caíam fora do quadro.
5. 2ª passada (só marcador × resposta): cada recorte ampliado lido com a resposta escrita ao lado — 35/35 corretos (prints/<id>_zoom.jpg).

Imagens grandes demais em vetor (cérebro 154 KB, digestório, célula 758 KB) entram como JPEG embutido no SVG (1,3–1,6× a 600 px); as demais ficam em vetor. Todos ≤ 114 KB.

## Cartões

| id | sub | resposta | fonte da ilustração | conferência | print |
|---|---|---|---|---|---|
| bio-i01 | B08.3 | cerebelo | Human_physiology/brain-2.svg | OpenStax A&P 2e §13.2 ("cerebellum ... posterior surface of the brain stem"); conferido também pela morfologia (folhas estriadas) | prints/bio-i01_zoom.jpg |
| bio-i02 | B08.3 | tronco encefálico | Human_physiology/brain-2.svg | OpenStax A&P 2e §13.2 (tronco = mesencéfalo + ponte + bulbo; liga o encéfalo à medula) | prints/bio-i02_zoom.jpg |
| bio-i03 | B08.3 | lobo frontal | Human_physiology/brain-2.svg | OpenStax A&P 2e §13.2 ("Anterior to the central sulcus is the frontal lobe"); orientação da figura: cerebelo atrás = posterior à esquerda, logo anterior à direita; ponto no polo anterior | prints/bio-i03_zoom.jpg |
| bio-i04 | B08.3 | lobo temporal | Human_physiology/brain-2.svg | OpenStax A&P 2e §13.2 (sulco lateral separa o lobo temporal); ponto abaixo do sulco lateral, atrás do polo temporal | prints/bio-i04_zoom.jpg |
| bio-i05 | B07.4 | átrio direito | Human_physiology/heart-interior-1.svg | OpenStax A&P 2e §19.1 (VCS "empties into ... the right atrium"); câmara superior que recebe a VCS, acima da valva tricúspide | prints/bio-i05_zoom.jpg |
| bio-i06 | B07.4 | aorta | Human_physiology/heart-interior-1.svg | OpenStax A&P 2e §19.1 (VE ejeta na aorta); vaso vermelho em arco com os ramos do arco | prints/bio-i06_zoom.jpg |
| bio-i07 | B07.4 | veia cava superior | Human_physiology/heart-interior-1.svg | OpenStax A&P 2e §19.1; vaso azul que desce até o átrio direito | prints/bio-i07_zoom.jpg |
| bio-i08 | B07.4 | ventrículo esquerdo | Human_physiology/heart-chambers-visible.svg | OpenStax A&P 2e §19.1 ("left ventricle is much thicker"); cavidade do lado da parede mais espessa, perto do ápice | prints/bio-i08_zoom.jpg |
| bio-i09 | B07.2 | fígado | Human_physiology/digestive-system-labeled.svg | Rótulo original do próprio autor (Servier, "Liver", linha-guia termina em 138,274) + OpenStax A&P 2e §23.6 | prints/bio-i09_zoom.jpg |
| bio-i10 | B07.2 | vesícula biliar | Human_physiology/digestive-system-labeled.svg | Rótulo original Servier ("Gall bladder", 150,319) + OpenStax A&P 2e §23.6 | prints/bio-i10_zoom.jpg |
| bio-i11 | B07.2 | estômago | Human_physiology/digestive-system-labeled.svg | Rótulo original Servier ("Stomach", 246,297) | prints/bio-i11_zoom.jpg |
| bio-i12 | B07.2 | pâncreas | Human_physiology/digestive-system-labeled.svg | Rótulo original Servier ("Pancreas", 182,374) + OpenStax A&P 2e §23.6 (cabeça na curva do duodeno) | prints/bio-i12_zoom.jpg |
| bio-i13 | B01.5 | mitocôndria | Intracellular_components/cell-complete.svg | Rótulo original Servier ("Mitochondria", seta em 593,260) + OpenStax Biology 2e §4.3 (cristas) | prints/bio-i13_zoom.jpg |
| bio-i14 | B01.4 | complexo golgiense | Intracellular_components/cell-complete.svg | Rótulo original Servier ("Golgi apparatus", seta em 243,145) + OpenStax Biology 2e §4.4 (sacos achatados/cisternas) | prints/bio-i14_zoom.jpg |
| bio-i15 | B01.4 | retículo endoplasmático rugoso | Intracellular_components/cell-complete.svg | Rótulo original Servier ("Rough endoplasmic reticulum", seta em 278,356) + OpenStax Biology 2e §4.4 (ribossomos aderidos) | prints/bio-i15_zoom.jpg |
| qui-i01 | Q05.2 | bureta | Chemistry/burette-assembled.svg + erlenmeyer-red.svg | Nome do arquivo Servier + Toda Matéria, "Vidrarias de laboratório" (descrição e uso) | prints/qui-i01_zoom.jpg |
| qui-i02 | Q05.2 | erlenmeyer | Chemistry/burette-assembled.svg + erlenmeyer-red.svg | Nome do arquivo Servier + Toda Matéria, "Vidrarias de laboratório" (descrição e uso) | prints/qui-i02_zoom.jpg |
| qui-i03 | Q03.5 | kitassato | Chemistry/vacuum-flask.svg + buechnerfunnel.svg (rolha desenhada) | Toda Matéria, "Vidrarias de laboratório" (kitassato com duto lateral + funil encaixado em cima) | prints/qui-i03_zoom.jpg |
| qui-i04 | Q03.5 | funil de Büchner | Chemistry/vacuum-flask.svg + buechnerfunnel.svg (rolha desenhada) | Toda Matéria, "Vidrarias de laboratório" (kitassato com duto lateral + funil encaixado em cima) | prints/qui-i04_zoom.jpg |
| qui-i05 | Q05.2 | béquer | Chemistry/beaker-yellow, erlenmeyer-blue, flask-empty (+traço de aferição desenhado), measuringcylinder-blue | Nome do arquivo Servier + Toda Matéria, "Vidrarias de laboratório" (descrição e uso) | prints/qui-i05_zoom.jpg |
| qui-i06 | Q05.2 | balão volumétrico | idem qui-i05 | Nome do arquivo Servier + Toda Matéria, "Vidrarias de laboratório" (descrição e uso) | prints/qui-i06_zoom.jpg |
| qui-i07 | Q05.2 | proveta | idem qui-i05 | Nome do arquivo Servier + Toda Matéria, "Vidrarias de laboratório" (descrição e uso) | prints/qui-i07_zoom.jpg |
| qui-i08 | Q03.5 | funil de separação | Chemistry/separating-funnel, condenser-straigh, funnel-paper, mortar, pipette-glass | Nome do arquivo Servier + Toda Matéria, "Vidrarias de laboratório" (descrição e uso) | prints/qui-i08_zoom.jpg |
| qui-i09 | Q03.5 | condensador | idem qui-i08 | Nome do arquivo Servier + Toda Matéria, "Vidrarias de laboratório" (descrição e uso) | prints/qui-i09_zoom.jpg |
| qui-i10 | Q03.5 | funil | idem qui-i08 | Nome do arquivo Servier + Toda Matéria, "Vidrarias de laboratório" (descrição e uso) | prints/qui-i10_zoom.jpg |
| qui-i11 | Q03.5 | almofariz | idem qui-i08 | Nome do arquivo Servier (mortar) + definição padrão de almofariz e pistilo | prints/qui-i11_zoom.jpg |
| qui-i12 | Q05.2 | pipeta graduada | idem qui-i08 | Nome do arquivo Servier + Toda Matéria, "Vidrarias de laboratório" (descrição e uso) | prints/qui-i12_zoom.jpg |
| mat-i01 | M11.3 | geratriz | gerada (cards_mat.py) | Figura gerada por geometria exata: o destaque é desenhado a partir dos pontos que definem o elemento (ver _gerador/cards_mat.py); definições padrão; apótema da pirâmide: Toda Matéria "Pirâmide" | prints/mat-i01_zoom.jpg |
| mat-i02 | M11.3 | apótema da pirâmide | gerada (cards_mat.py) | Figura gerada por geometria exata: o destaque é desenhado a partir dos pontos que definem o elemento (ver _gerador/cards_mat.py); definições padrão; apótema da pirâmide: Toda Matéria "Pirâmide" | prints/mat-i02_zoom.jpg |
| mat-i03 | M11.3 | apótema da base | gerada (cards_mat.py) | Figura gerada por geometria exata: o destaque é desenhado a partir dos pontos que definem o elemento (ver _gerador/cards_mat.py); definições padrão; apótema da pirâmide: Toda Matéria "Pirâmide" | prints/mat-i03_zoom.jpg |
| mat-i04 | M11.1 | diagonal do cubo | gerada (cards_mat.py) | Figura gerada por geometria exata: o destaque é desenhado a partir dos pontos que definem o elemento (ver _gerador/cards_mat.py); definições padrão; apótema da pirâmide: Toda Matéria "Pirâmide" (vista escolhida por busca numérica para a diagonal não passar perto de outro vértice) | prints/mat-i04_zoom.jpg |
| mat-i05 | M11.2 | secção meridiana | gerada (cards_mat.py) | Figura gerada por geometria exata: o destaque é desenhado a partir dos pontos que definem o elemento (ver _gerador/cards_mat.py); definições padrão; apótema da pirâmide: Toda Matéria "Pirâmide" | prints/mat-i05_zoom.jpg |
| mat-i06 | M11.4 | círculo máximo | gerada (cards_mat.py) | Figura gerada por geometria exata: o destaque é desenhado a partir dos pontos que definem o elemento (ver _gerador/cards_mat.py); definições padrão; apótema da pirâmide: Toda Matéria "Pirâmide" | prints/mat-i06_zoom.jpg |
| mat-i07 | M11.5 | base menor | gerada (cards_mat.py) | Figura gerada por geometria exata: o destaque é desenhado a partir dos pontos que definem o elemento (ver _gerador/cards_mat.py); definições padrão; apótema da pirâmide: Toda Matéria "Pirâmide" | prints/mat-i07_zoom.jpg |
| mat-i08 | M11.1 | face lateral | gerada (cards_mat.py) | Figura gerada por geometria exata: o destaque é desenhado a partir dos pontos que definem o elemento (ver _gerador/cards_mat.py); definições padrão; apótema da pirâmide: Toda Matéria "Pirâmide" | prints/mat-i08_zoom.jpg |

## Não feito (e por quê)

- Néfron e flor: o acervo Servier no bioicons não tem ilustração de néfron nem de flor; não inventei desenho para não arriscar erro.
- Lobos parietal e occipital: a ilustração não desenha o sulco central nem o parieto-occipital, então o limite não é verificável; ficaram de fora.
- Ventrículo direito e átrio esquerdo: o limite entre câmaras na figura é ambíguo; ficaram de fora.

Folha de contato: folha_contato.png (e folha_contato.html). Gerador: _gerador/ (scripts usados, caminhos do scratchpad).
