# Célula animal em 3D: como ela é, como modelar e o que animar

Pesquisa feita em 03/11/2026 para responder ao dono: **em vez de subir a referência, entender o que ela mostra.** Três perguntas:
1. Como uma célula animal é construída e montada (forma, tamanho e posição de cada peça).
2. Como criar essa célula em 3D (como os profissionais fazem, e como levar isso para o three.js).
3. Que animações cabem a cada organela, de acordo com a função, sem ensinar errado.

A referência (`docs/referencias/icones3d/celula.png`) foi usada **só para saber quais peças aparecem**. Ela não foi publicada nem enviada a lugar nenhum.
As fontes estão numeradas entre colchetes, por exemplo [3], e listadas no fim. Onde um número é cálculo ou estimativa minha, e não dado de fonte, está escrito "cálculo" ou "estimativa".

Complementa duas pesquisas já feitas: `docs/pesquisa/animacao-dos-icones.md` (regras de animação: só quando o aluno pede, toca uma vez, 1–2,5 s, estado final parado) e `docs/pesquisa/tecnicas-3d-realista.md` (bake no Blender como rota principal).

---

## 1. Resposta curta

- **A referência é um modelo didático "de massinha", não uma célula real.** Ela acerta a ideia geral (corte de 1/4, núcleo em camadas, organelas espalhadas), mas tem **quatro erros que uma banca de Medicina cobraria** (seção 3): cromossomos em "X" dentro de um núcleo intacto, retículo rugoso sem ribossomos, Golgi longe do núcleo e com forma de tubo dobrado, e centríolos como um feixe de bastões. O ícone deve copiar o **estilo** da referência e corrigir a **ciência**.
- **A montagem certa tem uma lógica de dentro para fora:** núcleo → retículo rugoso colado na carioteca (é a mesma membrana) → Golgi ao lado do núcleo, com a face *cis* voltada para ele → centrossomo junto do Golgi → vesículas saindo da face *trans* rumo à membrana. Mitocôndrias e retículo liso se espalham pelo resto; lisossomos ficam mais concentrados perto do núcleo e alguns na periferia [1][2][10][12][24].
- **Como modelar:** cada organela como peça separada (facilita corrigir e animar); corte do quarto por booleano no Blender, com "tampa" de material próprio; tudo que atravessa o plano de corte mostra a **própria seção** (dupla membrana no núcleo e na mitocôndria, luz do retículo). Luz e sombra assadas (bake), como já decidido em `tecnicas-3d-realista.md`.
- **Animação recomendada para o ícone (2,2 s):** a **via secretora** — vesícula brota da face *trans* do Golgi, anda pelo citoplasma e se funde à membrana, soltando o conteúdo para fora. É o processo mais cobrado (experimento de Palade) e o único que liga quatro peças do ícone numa história só [2][14].
- **Segunda opção (para a tela "Explorar a célula", não para o ícone):** exportação de RNAm pelo poro nuclear. É a rara animação em que o tempo real (~0,2 s) cabe no tempo da animação [16].
- **Tirar de vez:** mitocôndria que pulsa ou brilha, núcleo que brilha, vesícula que "atravessa" a membrana, lisossomo com "boca".

---

## 2. O que a referência mostra (inventário)

| Peça na referência | O que representa | Cor usada |
|---|---|---|
| Casca grossa creme com relevo de favo | Membrana plasmática | Creme |
| Piso e parede brancos do corte | Citoplasma (citosol) | Branco gelo |
| Esfera vermelha com furos, cortada em 1/8 | Núcleo: carioteca com poros | Vermelho |
| Camada creme com "X" roxos | Cromatina/cromossomos no nucleoplasma | Creme + roxo |
| Miolo vermelho-escuro com pontos | Nucléolo (ou nucleoplasma) | Vinho |
| Sacos laranja achatados abraçando o núcleo | Retículo endoplasmático rugoso | Laranja |
| Rede ciano na parede e no piso | Retículo endoplasmático (rede de túbulos) | Ciano |
| Estrutura ramificada magenta no alto | Retículo endoplasmático liso | Magenta |
| Tubo azul dobrado em sanfona | Complexo golgiense | Azul |
| Feijões roxos abertos com dobras lilases | Mitocôndrias (cristas) | Roxo/lilás |
| Feixe dourado num funil de rede ciano | Centríolos/centrossomo | Dourado |
| Pontinhos vinho, em trios e em fila | Ribossomos livres e polissomos | Vinho |
| (não aparecem claramente) | Vesículas e lisossomos | — |

Pedido do dono: o ícone deve ter **membrana, citoplasma, núcleo (carioteca com poros, nucleoplasma, nucléolo, cromatina), RER, REL, Golgi, mitocôndrias, centríolos/centrossomo, ribossomos, vesículas e lisossomos.** Vesículas e lisossomos precisam ser **acrescentados**; a referência não os mostra de forma legível.

---

## 3. O que a referência erra (e como corrigir sem perder o estilo)

| # | Na referência | O que é real | Correção no ícone | Gravidade para vestibular |
|---|---|---|---|---|
| 1 | Cromossomos em "X" dentro de núcleo com carioteca inteira e nucléolo | A cromatina só aparece como cromossomos distintos durante a divisão [1]. Na divisão (prófase/prometáfase), a carioteca se desfaz e o nucléolo some. Núcleo intacto + nucléolo + "X" mistura duas fases | Cromatina como **fios finos enovelados** (eucromatina) e manchas mais densas junto à carioteca (heterocromatina). Sem "X" | **Alta** (divisão celular é muito cobrada) |
| 2 | Sacos laranja lisos, sem ribossomos | O RER é "rugoso" justamente pelos ribossomos na face citoplasmática [2] | Ribossomos vinho **na face de fora** dos sacos (nunca dentro da luz) | **Alta** |
| 3 | Golgi azul na borda direita, longe do núcleo; forma de tubo dobrado | Golgi = pilha de cisternas achatadas [2]; em células de vertebrados forma uma "fita" perto do núcleo e do centrossomo [10]; face *cis* voltada para o núcleo/RER, face *trans* para a membrana [2][24] | Pilha de **5 cisternas** curvas, ao lado do núcleo, com a face *cis* (convexa) para o núcleo e a *trans* (côncava) para a membrana [24] | **Alta** (cis/trans e via secretora caem muito) |
| 4 | Feixe de muitos bastões dourados | Centrossomo = **par** de centríolos **perpendiculares**; cada centríolo é um cilindro de 9 trincas de microtúbulos [1] | Dois cilindros curtos em "L", junto do núcleo e do Golgi | Média |
| 5 | Centríolos num "funil" na parede, longe do núcleo | O centrossomo fica perto do núcleo (região justanuclear), cercado pelo Golgi [10] | Levar para junto do núcleo | Média |
| 6 | Poros como furos pretos vazios | O poro é um **complexo proteico** (~120 nm, ~2.000 por núcleo de vertebrado) que controla o trânsito [1][6] | Anel com tampão central, não buraco | Baixa (mas fácil de acertar) |
| 7 | Membrana grossa como casca rígida | A membrana plasmática é uma bicamada de ~5–10 nm (estimativa usual), flexível; **célula animal não tem parede celular** [1] | Manter o relevo como textura, mas a **borda do corte fina**, para não parecer parede celular | Média (confusão clássica com célula vegetal) |
| 8 | Todas as mitocôndrias iguais, feijões isolados | O "feijão" vem da microscopia eletrônica dos anos 1950; em células vivas elas formam túbulos de ~0,5 µm de largura e 1–10 µm de comprimento, que se fundem e se dividem [8][33] | Variar tamanho; 1 ou 2 mais compridas e curvas; cristas ligadas à membrana interna, não soltas | Baixa (o feijão é a convenção de prova) |
| 9 | Vesículas e lisossomos ausentes | Fazem parte da célula animal [1][2] | Acrescentar (seção 4) | Média |

Também ausentes, sem problema para o ícone: **citoesqueleto** (microtúbulos, filamentos), **peroxissomos** (1% do volume [3]) e a **lotação real** do citoplasma, que é cheio de proteínas, não "vazio" [20]. Ficam para a tela "Explorar a célula".

---

## 4. Anatomia e montagem, peça a peça

Unidades: tamanhos reais em µm (micrômetro = milésimo de milímetro) e nm (nanômetro = milésimo de µm).
"% do volume" vem da tabela clássica do *Molecular Biology of the Cell* para o hepatócito (célula do fígado), conferida no PDF da própria tabela [3].

### 4.1 Números-base

| Compartimento (hepatócito) | % do volume da célula [3] |
|---|---|
| Citosol | 54 |
| Mitocôndrias | 22 |
| Cisternas do RE rugoso | 9 |
| Cisternas do RE liso + Golgi | 6 |
| Núcleo | 6 |
| Peroxissomos | 1 |
| Lisossomos | 1 |
| Endossomos | 1 |

| Membrana (hepatócito / célula pancreática exócrina) | % de toda a membrana da célula [4] |
|---|---|
| Plasmática | 2 / 5 |
| RE rugoso | 35 / 60 |
| RE liso | 16 / <1 |
| Golgi | 7 / 10 |
| Mitocôndria (externa / interna) | 7+32 / 4+17 |
| Lisossomo | 0,4 / não determinado |

Volume médio do hepatócito: ~5.000 µm³ [4]. Uma célula "média" tem ~30 µm de diâmetro, segundo o NIGMS [5].

**Lição para o ícone:** a membrana plasmática é só 2–5% da membrana da célula. **O retículo é a maior estrutura membranosa** (35–60%) [4]. Um ícone em que o retículo é miúdo e a membrana domina inverte a realidade. A referência acerta ao espalhar retículo (rede ciano) por toda a parede e piso.

### 4.2 Tabela por estrutura

| Estrutura | Forma real | Tamanho real | Onde fica em relação às outras | Convenção didática (o que é estilização) |
|---|---|---|---|---|
| **Membrana plasmática** | Bicamada lipídica com proteínas, flexível; em células absortivas forma microvilosidades [1] | Espessura ~5–10 nm (estimativa usual); célula média ~30 µm [5] | Limite externo; recebe as vesículas de secreção | Casca grossa e texturizada. A espessura é exagerada milhares de vezes |
| **Citoplasma / citosol** | Gel lotado de proteínas, ribossomos e citoesqueleto [20] | 54% do volume [3] | Preenche tudo entre membrana e núcleo | Superfície lisa e clara no corte. O "vazio" é simplificação |
| **Núcleo** | Esfera ou ovoide; maior organela [5] | ~5 µm (NIGMS) [5]; 6% do volume no hepatócito [3] | Geralmente central ou levemente deslocado; cercado por RER | Esfera central. Na referência, apoiada no piso |
| **Carioteca (envoltório nuclear)** | **Duas** membranas; a externa é contínua com o RE e tem ribossomos; as duas se unem nos poros [1][2][9] | Espaço entre as membranas contínuo com a luz do RE [9] | Pele do núcleo; dela sai o RER | Uma casca vermelha só. No corte, mostrar **duas linhas** |
| **Poros nucleares** | Complexos proteicos em anel, com cesto e canal central | ~120 nm de diâmetro (vertebrado) [6]; ~2.000 por núcleo [6] | Espalhados pela carioteca | Furos. Melhor: anéis com tampão |
| **Nucleoplasma** | Fluido semissólido onde ficam cromatina e nucléolo [1] | — | Dentro da carioteca | Camada colorida |
| **Nucléolo** | Região densa, **sem membrana**, que monta as subunidades do ribossomo [1] | ~1–2 µm (estimativa) | Dentro do núcleo, excêntrico | Bola escura. Correto. Não dar membrana a ele |
| **Cromatina** | DNA + proteínas, descondensada na interfase [1] | Fios de 10–30 nm (estimativa) | Ocupa o nucleoplasma; heterocromatina junto à carioteca | "X" roxos (errado na interfase, seção 3) |
| **RE rugoso** | Sacos achatados (cisternas) interligados, com ribossomos na face citoplasmática [2]; as **folhas** tendem a ficar perto do núcleo [9] | 9% do volume [3]; 35–60% da membrana [4] | **Contínuo com a membrana externa da carioteca** [2]; vai em direção ao Golgi | Sacos empilhados ao redor do núcleo. Correto, desde que tenha ribossomos |
| **RE liso** | Rede de **túbulos** ramificados, sem ribossomos; ligado ao RER [2][9] | Muito variável (16% da membrana no hepatócito, <1% no pâncreas) [4] | Periferia da célula, continuação do RER [9] | Tubos ramificados. A rede ciano e o magenta da referência funcionam |
| **Complexo golgiense** | Pilha de cisternas achatadas e curvas [2]; nas células de vertebrados, pilhas ligadas numa "fita" [10][11] | ~5–6 cisternas por pilha (HeLa) [11]; cisterna com 20–30 nm de espessura [11] | **Ao lado do núcleo e do centrossomo** [10]; face *cis* (convexa) voltada para o núcleo/RER; face *trans* (côncava) para a membrana [2][24] | Pilha de "panquecas" curvas com bordas dilatadas. É a convenção certa |
| **Vesículas de transporte e de secreção** | Esferas de membrana | ~50–100 nm (transporte; estimativa); grânulos de secreção maiores | Entre RER e *cis*; saindo da *trans* rumo à membrana [2] | Bolinhas da cor do Golgi |
| **Lisossomos** | Esferas de membrana com enzimas digestivas, pH 4,5–5,0 [12] | 50 nm a 3 µm [5]; 1% do volume [3] | Concentrados em "nuvem" perto do centrossomo; alguns na periferia [12] | Bolinhas com conteúdo granulado |
| **Mitocôndrias** | Dupla membrana; a interna dobra-se em **cristas**; dentro, a matriz [1][7] | ~0,5 µm de largura, 1–10 µm de comprimento [8]; 22% do volume [3] | Espalhadas, mais numerosas onde se gasta mais energia [7] | Feijão aberto com cristas. Aceitável |
| **Centrossomo / centríolos** | Par de centríolos **perpendiculares**; cada um é cilindro de 9 trincas de microtúbulos [1] | ~0,2 µm de diâmetro × 0,4–0,5 µm de comprimento [13] | Junto do núcleo, cercado pelo Golgi [10]; é o principal centro organizador de microtúbulos | Dois cilindros em "L" |
| **Ribossomos** | Duas subunidades (a grande ~3× a pequena) [1]; livres, em polissomos ou presos ao RER/carioteca [1] | 20–30 nm [5] | Livres no citosol; presos à face externa do RER e da carioteca | Pontinhos. Exagerados ~10× no ícone |

### 4.3 A montagem (a "planta baixa" da célula)

Ordem lógica, de dentro para fora (é também a ordem de modelagem, seção 7):

1. **Núcleo** um pouco deslocado do centro.
2. **RER** nasce da carioteca (mesma membrana) e se dobra em folhas paralelas ao redor do núcleo [2][9].
3. **RE liso** continua o RER como rede de túbulos que vai para a periferia [9].
4. **Golgi** de um lado do núcleo, com a face *cis* encostando na região do RER e a *trans* voltada para a membrana [2][24].
5. **Centrossomo** no "colo" do Golgi, entre ele e o núcleo [10].
6. **Lisossomos** em nuvem em volta do centrossomo, alguns espalhados até a periferia [12].
7. **Vesículas**: algumas entre RER e *cis*; algumas saindo da *trans*; uma encostada na membrana.
8. **Mitocôndrias** espalhadas pelo resto, em várias orientações [7].
9. **Ribossomos** livres (soltos e em pequenas filas de polissomos) e presos ao RER e à carioteca [1].

Esse "eixo" **núcleo → Golgi → membrana** é o eixo da via secretora. No corte de 1/4, ele deve correr **paralelo ao piso**, terminando na parte da membrana que a câmera vê, para que a animação (seção 6) aconteça à vista.

### 4.4 Vocabulário de vestibular (usar estes nomes nas legendas)

Membrana plasmática; citoplasma (hialoplasma/citosol); carioteca ou envoltório nuclear; poros nucleares; nucleoplasma (cariolinfa); nucléolo; cromatina; retículo endoplasmático granuloso (rugoso); retículo endoplasmático não granuloso (liso); complexo golgiense (complexo de Golgi), faces *cis* (de formação) e *trans* (de maturação) [24]; mitocôndria, cristas, matriz; centríolos e centrossomo; ribossomos e polissomos; vesículas; lisossomos [24][25].

---

## 5. Como os profissionais modelam uma célula

### 5.1 Estúdios de visualização científica

- **Drew Berry (WEHI, Austrália):** modela no Maya e compõe no After Effects. Usa dados reais (cristalografia, crio-EM, microscopia de célula viva, dinâmica molecular) sempre que existem. **Desacelera** o movimento browniano para ser assistível e **poda** tudo o que distrai do ponto da animação. Ele mesmo alerta para não exagerar a "exatidão" do que mostra [21].
- **XVIVO / Harvard BioVisions, *The Inner Life of the Cell* (2006):** cerca de 14–18 meses de produção, com consultoria de pesquisadores de Harvard. As cores são **escolha**: as moléculas são menores que o comprimento de onda da luz, então não têm cor; a equipe usou paleta intensa e multicolorida. A versão posterior lotou a célula com proteínas em densidade mais realista [22].
- **David Goodsell (aquarelas):** tamanho e forma das moléculas tirados de coordenadas atômicas; a "bagunça colorida" das pinturas é **fiel** à lotação real do citoplasma [20].
- **Princípios de animação molecular (Jantzen, McGill e Jenkinson, 2024):** moléculas se movem por colisões aleatórias; não "procuram" alvos; nada começa e para do nada; o ambiente é lotado; efeitos de luz (raios, refração, cáusticas) não existem nessa escala [18]. Um estudo anterior dos mesmos autores mostrou que a versão mais completa da animação (com aleatoriedade e lotação) foi a que mais ensinou [19].

**O que isso significa para o Aprendice:** cor é convenção (pode seguir a paleta aprovada), mas **forma, posição, ordem dos eventos e direção do movimento não são negociáveis**. Simplificar e ampliar pode; inverter ou inventar não.

### 5.2 Modelos comerciais e didáticos

Modelos de célula em corte do Sketchfab e CGTrader seguem o mesmo padrão: casca cortada (metade ou quarto), núcleo em camadas, organelas como **peças separadas**, cores saturadas [31]. Um modelo acadêmico (AnatoCells, Sorbonne/CNRS) tem ~955 mil triângulos, ou seja, é peça de estudo, não de ícone [31]. Vários erram ciência (um inclui "parede celular" numa célula animal [31]).

### 5.3 Técnicas de modelagem por organela (Blender)

| Peça | Técnica sugerida | Observação |
|---|---|---|
| Membrana | Esfera (quad sphere) + modificador **Solidify** para espessura; relevo por textura Voronoi assada | Borda do corte fina (seção 3, item 7) |
| Corte de 1/4 | Modificador **Boolean** (diferença) com uma caixa; ou **Bisect** com "Fill" para gerar a tampa [30][32] | A face cortada recebe **material próprio** (citoplasma), como no tutorial de corte de osso [32]. Booleano animado é frágil [30]; o corte é fixo, então não é problema |
| Núcleo | Duas esferas concêntricas finas (carioteca dupla) + esfera do nucléolo; corte de 1/8 por booleano | Poros como anéis instanciados (Geometry Nodes: *Distribute Points on Faces* + *Instance on Points*) |
| RER | 3–4 folhas curvas paralelas, feitas a partir de uma calota da esfera do núcleo, com **Solidify** e bordas arredondadas; ligadas à carioteca por uma "ponte" | Ribossomos instanciados **só na face externa** |
| RE liso | Curvas ramificadas com *bevel* (tubo) ou Geometry Nodes *Curve to Mesh* | Rede poligonal com junções em "Y", como nas imagens de célula viva [9] |
| Golgi | Perfil em "rim" extrudado, com *bevel*; 5 cópias com curvatura crescente; bordas dilatadas (anel mais grosso) | Vesículas brotando da última (*trans*) |
| Mitocôndria | Cápsula (casca externa) + casca interna; cristas como lâminas onduladas que **saem** da membrana interna | No corte, mostrar as duas membranas e as cristas em seção |
| Centríolos | 9 grupos de 3 cilindros finos inclinados (trincas) formando um cilindro; dois deles em "L" | Em ícone pequeno, um cilindro com 9 sulcos basta |
| Ribossomos, vesículas, lisossomos | Instâncias (uma malha, centenas de cópias) | Ribossomo: duas esferas de tamanhos diferentes (subunidades) |

### 5.4 Material, luz e acabamento

- **Material "massinha":** rugosidade alta (0,6–0,8), pouco brilho, **subsuperfície** curta para a luz "vazar" nas bordas (Principled BSDF) [30]. É o que dá o ar macio da referência. Subsuperfície só existe no Cycles: tem de ser **assada** (ver `tecnicas-3d-realista.md`).
- **Luz:** uma luz principal grande e macia do alto à esquerda, um rebatedor do lado oposto, fundo cinza neutro; oclusão de ambiente (AO) assada nos cantos (pé das organelas no piso). Nada de raios de luz, brilho ou refração: não existem nessa escala [18].
- **Corte:** a face cortada de cada peça tem cor um pouco mais clara e lisa (convenção de "seção"), para separar "por dentro" de "por fora".

### 5.5 No three.js (se a cena for em tempo real)

| Necessidade | Como fazer |
|---|---|
| Esfera com um quarto (ou oitavo) removido | `SphereGeometry` aceita `phiStart/phiLength/thetaStart/thetaLength`: dá para gerar a casca já sem o quarto, sem booleano [29] |
| Tampa do corte | Meio-discos planos com material próprio (já feito em `celula.js`); alternativa genérica: planos de corte + **stencil** (exemplo `webgl_clipping_stencil`; desde r163 o renderer precisa de `stencil: true`; malhas precisam ser fechadas) [27] |
| Booleano em tempo real | Evitar. `three-bvh-csg` existe e é rápido, mas exige malhas fechadas e pode travar a página em malhas complexas [28]. Fazer o corte no Blender |
| Ribossomos, poros, vesículas, lisossomos | `InstancedMesh` (uma chamada de desenho para centenas de cópias) [29]; pontos sobre o RER com `MeshSurfaceSampler` [29] |
| Retículo liso | `TubeGeometry` sobre `CatmullRomCurve3`, fundidos numa malha só |
| Golgi | `Shape` + `ExtrudeGeometry` com `bevelEnabled`, curvado por vértice |
| Relevo da membrana e das cristas | Mapa de normais (*normal map*) assado; deslocamento só se a malha tiver vértices suficientes |
| Material | Preferir textura assada + `MeshStandardMaterial`/`MeshBasicMaterial`. `MeshPhysicalMaterial` com `sheen` dá um ar aveludado barato; `transmission` (vidro) é caro e errado aqui [29] |

Recomendação já registrada: para um ícone de 72–128 px, o **filme pré-renderizado** (parado + 24 quadros) é o mais fiel e barato; tempo real só para a tela "Explorar a célula" (`tecnicas-3d-realista.md`).

---

## 6. Animações pela função de cada organela

Regras herdadas (`animacao-dos-icones.md`): dispara por mouse/foco/toque, **toca uma vez**, 1–2,5 s, termina parado no estado final, nada pisca mais de 3×/s, "reduzir movimento" mostra o estado final.

### 6.1 Catálogo

| Organela | Função | Animação correta | Tempo real × animação | Onde usar |
|---|---|---|---|---|
| **Golgi → membrana** | Empacotar e secretar | Vesícula brota da *trans*, anda em trajeto levemente curvo com pequenas pausas (motores em microtúbulos: cinesina leva para a periferia [15]), **funde-se** à membrana e o conteúdo sai | Horas comprimidas em ~2 s (Palade: rótulo no RER em ~3–5 min, Golgi ~20 min, grânulos maduros ~2 h [14]) | **Ícone** |
| **RER → Golgi *cis*** | Transporte de proteína recém-feita | Vesícula pequena sai da borda do RER e se funde à face *cis* | Minutos [14] | Prelúdio opcional do ícone |
| **Poro nuclear** | Exportar RNAm e subunidades do ribossomo [1][25] | Partícula alongada (RNAm com proteínas) atravessa o poro de dentro para fora e logo um ribossomo se prende a ela | **~200 ms reais** [16] (cabe quase sem comprimir) | Explorar a célula |
| **Ribossomo no RER** | Síntese de proteína para exportação | Ribossomo encosta no RER; uma cadeia cresce **para dentro da luz** do retículo | Segundos a minutos | Explorar a célula |
| **Lisossomo** | Digestão intracelular (pH 4,5–5) [12] | Lisossomo encosta numa vesícula de endocitose (ou autofagossomo), as membranas se fundem, o conteúdo escurece e some | Minutos | Explorar a célula |
| **Mitocôndria** | Produção de ATP | No zoom de uma crista: fileiras de ATP sintase (em dímeros, nas dobras das cristas) **girando** enquanto prótons passam [17] | Gira ~100+ voltas/s [17] | Explorar a célula (zoom). **Nunca no ícone** |
| **Mitocôndria (forma)** | Dinâmica | Duas mitocôndrias se fundem / uma se divide [7][8] | Minutos | Explorar a célula |
| **Centríolos** | Organizar o fuso | Centrossomo duplicado se separa, microtúbulos crescem entre os polos | Só na divisão: exige carioteca desfeita | Tela de divisão celular, não no ícone de interfase |
| **RE liso** | Lipídios, desintoxicação, reserva de Ca²⁺ [2] | Onda suave de "liberação de cálcio" (pontinhos saindo), uma vez | Milissegundos | Explorar (baixa prioridade) |
| **Membrana** | Endocitose / exocitose | Invaginação que vira vesícula (oposto da exocitose) | Segundos | Explorar |

### 6.2 Recomendação para o ícone

**Uma só animação: a via secretora, 2,2 s.** (Mantém o que já está em `animacao-dos-icones.md`, agora com o posicionamento correto do Golgi.)

| Tempo | Evento | Detalhe |
|---|---|---|
| 0–0,1 s | Resposta ao toque | Leve inclinação da célula (≤3°) |
| 0,1–0,6 s | Prelúdio (opcional) | Vesícula pequena sai do RER e encosta na face *cis* |
| 0,6–0,9 s | Brotamento | Vesícula da cor do Golgi "estrangula" na borda da cisterna *trans* |
| 0,9–1,7 s | Transporte | Trajeto levemente curvo, 1–2 microparadas, em direção à **parte visível** da membrana |
| 1,7–2,1 s | Exocitose | A vesícula achata e **vira parte da membrana**; 3–5 pontinhos saem para fora e param |
| 2,1–2,2 s | Repouso | Tudo para; estado final mantido |

**Por que esta:** é o processo mais cobrado de citologia (experimento de pulso-caça de Palade, ordem RER → Golgi → membrana) [2][14]; envolve quatro peças visíveis do ícone; tem começo, meio e fim claros (um passo por animação, princípio de congruência citado na pesquisa de animação).

**Segunda opção, se o dono quiser variar entre ícones grandes e pequenos:** exportação de RNAm pelo poro (0,8 s) seguida da chegada de um ribossomo ao RER. Fica para "Explorar a célula", porque no ícone o poro é pequeno demais para ser lido.

### 6.3 Erros comuns a evitar (ciência)

1. **Mitocôndria pulsando, acendendo ou soltando raios** de "energia". Mitocôndria não contrai; ATP não é luz. Já está marcado para remoção no código atual (`celula.js`).
2. **Vesícula que atravessa a membrana** como bolha que estoura para fora. Ela **se funde**: a membrana da vesícula passa a ser membrana da célula [2].
3. **Ordem invertida** (membrana → Golgi → RER) ou vesícula saindo da face *cis* para a membrana.
4. **Vesícula "procurando" o destino** em linha reta e velocidade constante, como se tivesse vontade. Transporte por motores é dirigido, mas com paradas e pequenas idas e voltas [15][18].
5. **Cromossomos em "X" com núcleo intacto** (seção 3).
6. **Ribossomos dentro do RER** ou RER sem ribossomos.
7. **Lisossomo com "boca"** que "come", ou lisossomo que estoura para digerir a célula como função normal ("bolsa suicida" é visão antiga). Ele digere **dentro de si**, depois de fundir-se a uma vesícula [1][12].
8. **Centríolos "puxando" cromossomos.** Quem liga e move cromossomos são os microtúbulos do fuso.
9. **Poro como furo aberto** por onde qualquer coisa passa: o poro controla a passagem [1].
10. **Escala tomada como real.** Ribossomos e centríolos estão ampliados no ícone. Na tela "Explorar", dizer isso por escrito.
11. **Célula plana.** Alunos tendem a achar que a célula é achatada, por causa de desenhos 2D; o corte em 3D combate isso. Também tendem a achar que o desenho mostra tamanhos reais [23].
12. **Brilho, raios de luz, reflexos "molhados" fortes** (efeitos de luz não existem nessa escala [18]). Um brilho suave de material pode; luz "mágica" não.

---

## 7. Receita de construção (para o agente 3D)

Unidade: **R = 1 = raio da célula.** Valores marcados "ícone" são exagerados de propósito para leitura em 72–128 px; a coluna "real" mostra quanto.

### 7.1 Ordem de construção

1. Célula e corte → 2. núcleo (carioteca dupla, poros, nucléolo, cromatina) → 3. RER colado ao núcleo → 4. Golgi do lado da câmera → 5. centrossomo entre núcleo e Golgi → 6. RE liso da borda do RER até a periferia → 7. mitocôndrias → 8. lisossomos → 9. vesículas → 10. ribossomos (por último, por instância).

### 7.2 Proporções

| Peça | Ícone (R = 1) | Real equivalente (célula de ~20–30 µm) | Quantidade visível |
|---|---|---|---|
| Célula | raio 1; corte de 1/4 (frente-cima) | 20–30 µm [4][5] | 1 |
| Borda da membrana no corte | 0,02–0,03 de espessura | ~0,001 (cálculo: 10 nm / 10 µm) | — |
| Núcleo | raio **0,30–0,34**, deslocado ~0,1 para trás/esquerda | raio 0,17 (NIGMS: 5 µm em 30 µm [5]) a 0,39 (6% do volume [3]; cálculo: 0,06^(1/3)) | 1, corte de 1/8 voltado à câmera |
| Carioteca | duas cascas de 0,01 separadas por 0,008 | espaço ~30–50 nm (estimativa) | — |
| Poros | anéis raio 0,014, tampão central | 120 nm [6] (ampliado ~4×) | 30–50 no hemisfério visível |
| Nucléolo | raio 0,10–0,12, excêntrico | ~1–2 µm (estimativa) | 1 |
| RER | 3 folhas curvas, a 0,04–0,10 do núcleo, cobrindo ~150° | — | 3 |
| Golgi | 5 cisternas, cada uma ~0,28 × 0,10, espessura 0,018, intervalo 0,018; centro a ~0,15 da carioteca | 5–6 cisternas [11] | 1 pilha |
| Centríolos | 2 cilindros 0,035 × 0,08, em "L" | 0,2 × 0,4–0,5 µm [13] (ampliado ~3×) | 1 par |
| Mitocôndrias | 0,08–0,10 de largura × 0,20–0,35 de comprimento; 1 alongada e curva | 0,5 × 1–10 µm [8] (ampliadas ~2×) | 5–7, 2–3 cortadas abertas |
| Lisossomos | esferas raio 0,03–0,05 | 0,05–3 µm [5] | 4–6, maioria perto do centrossomo |
| Vesículas | esferas raio 0,02–0,03 | 50–100 nm (estimativa; ampliadas ~10×) | 6–8 (3 na *trans*, 2 entre RER e *cis*, 1 encostada na membrana) |
| Ribossomos | pares de esferas 0,010 + 0,007 | 20–30 nm [5] (ampliados ~10×) | 40–80 livres (alguns em filas de 4–6) + 60–120 no RER |

### 7.3 Cores (paleta da referência, aprovada, + acréscimos)

| Peça | Cor | Por quê |
|---|---|---|
| Membrana | Creme (#E8D9A8 aprox.) | Referência |
| Citoplasma no corte | Branco gelo | Referência |
| Carioteca | Vermelho | Referência |
| Nucleoplasma | Creme rosado | Referência |
| Cromatina | Roxo, **fios** (não "X") | Correção científica |
| Nucléolo | Vinho escuro | Referência |
| RER | Laranja | Referência |
| RE liso | Ciano (rede) e magenta (porção ramificada) | Referência; manter os dois como **o mesmo sistema**, com ligação visível ao RER |
| Golgi | Azul | Referência |
| Vesículas | Azul-claro (mesma família do Golgi) | A cor conta de onde vieram |
| Lisossomos | Âmbar/ocre com granulado escuro | Distinto de todas as outras peças; não usar verde (cor da matéria Biologia) |
| Mitocôndrias | Roxo, cristas lilases | Referência |
| Centríolos | Dourado | Referência |
| Ribossomos | Vinho | Referência |

### 7.4 Materiais

- Todas as peças: aspecto de massinha (rugosidade 0,6–0,8; quase sem reflexo; subsuperfície curta no Cycles), **assado** em textura (cor + AO + luz).
- Faces de corte de cada peça (núcleo, mitocôndrias, folhas do RER, cisternas do Golgi): tom 10–15% mais claro e liso, para ler como "seção".
- Membrana: relevo de favo como textura (Voronoi assado), **sem** virar casca grossa.
- Nenhum material de vidro, emissivo forte ou brilho "mágico".

### 7.5 Corte

- Quarto removido: frente-cima (como hoje em `celula.js`: x > 0 e y > 0).
- Tampas do corte = parede vertical e piso, cor do citoplasma.
- Toda peça que cruza o plano de corte é **cortada junto** e mostra seu interior: núcleo (duas membranas, nucleoplasma, nucléolo, cromatina), 2–3 mitocôndrias (duas membranas + cristas), uma folha do RER (luz interna), Golgi em seção lateral (as 5 cisternas visíveis).
- O eixo núcleo → Golgi → membrana fica no piso, terminando na membrana **visível** (não na borda do corte), para a exocitose acontecer à vista.

### 7.6 Animação

Ver seção 6.2. Peças móveis separadas desde a modelagem: 2 vesículas (prelúdio e principal), 3–5 partículas de conteúdo, e o trecho da membrana onde ocorre a fusão (para "absorver" a vesícula).

### 7.7 Conferência antes de entregar

- [ ] Golgi ao lado do núcleo, *cis* para o núcleo, *trans* para a membrana
- [ ] RER com ribossomos só por fora, contínuo com a carioteca
- [ ] Cromatina em fios; nenhum "X"
- [ ] Par de centríolos perpendiculares junto do núcleo e do Golgi
- [ ] Vesículas e lisossomos presentes e distinguíveis
- [ ] Mitocôndrias com dupla membrana visível no corte; nada pulsa
- [ ] Borda da membrana fina (não parece parede celular)
- [ ] Animação: ordem RER → *cis* → *trans* → membrana; fusão, não travessia; termina parada; ≤2,5 s
- [ ] Render conferido em claro, escuro e 390 px

---

## 8. Fontes

Biologia celular
1. OpenStax, *Biology 2e*, 4.3 Eukaryotic Cells. https://openstax.org/books/biology-2e/pages/4-3-eukaryotic-cells
2. OpenStax, *Biology 2e*, 4.4 The Endomembrane System and Proteins. https://openstax.org/books/biology-2e/pages/4-4-the-endomembrane-system-and-proteins
3. Alberts et al., *Molecular Biology of the Cell*, 5ª ed., Tabela 12-1 (volumes no hepatócito), via BioNumbers (PDF da tabela conferido). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=110373 — a página do NCBI Bookshelf (https://www.ncbi.nlm.nih.gov/books/NBK26907/) bloqueou o acesso automático.
4. Alberts et al., *Molecular Biology of the Cell*, 5ª ed., Tabela 12-2 (tipos de membrana), via BioNumbers (PDF conferido). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=110374
5. NIGMS/NIH, "Take a Tour of Your Cells' Organelles!" (2021). https://www.nigms.nih.gov/node/145551
6. BioNumbers, diâmetro do complexo do poro nuclear (~120 nm, vertebrados) https://bionumbers.hms.harvard.edu/bionumber.aspx?id=103695 ; número de poros por núcleo https://bionumbers.hms.harvard.edu/bionumber.aspx?id=101387 ; Adam, *Genome Biology* 2001 (~2.000 poros por núcleo de vertebrado; 145 nm em outra medida). https://link.springer.com/content/pdf/10.1186/gb-2001-2-9-reviews0007.pdf
7. Nature Scitable, "Mitochondria". https://www.nature.com/scitable/topicpage/mitochondria-14053590/
8. Detmer & Chan, *Nat Rev Mol Cell Biol* 2007 (origem do "feijão"; túbulos de ~0,5 µm × 1–10 µm). https://chanlab.caltech.edu/documents/2804/Detmer_Chan_NRMCB_2007.pdf
9. Retículo em folhas e túbulos: Hu, Prinz & Rapoport https://pmc.ncbi.nlm.nih.gov/articles/PMC3478066 ; English & Voeltz https://pmc.ncbi.nlm.nih.gov/articles/PMC3683900 ; Shibata, Voeltz & Rapoport, "Rough sheets and smooth tubules", *Cell* 2006 (lido só o resumo).
10. Rios, "The centrosome–Golgi apparatus nexus", *Phil Trans R Soc B* 2014. https://pmc.ncbi.nlm.nih.gov/articles/PMC4113106/
11. Tang, Yuan & Wang, "The role of GRASP65 in Golgi cisternal stacking…", *Traffic* 2010 (5–6 cisternas por pilha em HeLa; cisterna 20–30 nm). https://pmc.ncbi.nlm.nih.gov/articles/PMC3278861
12. Pu et al., "Mechanisms and functions of lysosome positioning", *J Cell Sci* 2016 (nuvem perinuclear; pH 4,5–5,0). https://pmc.ncbi.nlm.nih.gov/articles/PMC5201012 ; Johnson et al., *JCB* 2016 (lisossomos periféricos menos ácidos). https://rupress.org/jcb/article/212/6/677/38514
13. Hirono, "Cartwheel assembly", *Phil Trans R Soc B* 2014 (centríolos 400–450 nm). https://pmc.ncbi.nlm.nih.gov/articles/PMC4113102 ; Digital Histology (≈0,2 µm × 0,5 µm). https://digitalhistology.org/cells/structures-2/centrioles/centrioles-2a/
14. Lodish, *Molecular Cell Biology* 8ª ed., Classic Experiment 14-1 (Palade). https://digfir-published.macmillanusa.com/lodish8e/lodish8e_ch14_43.html ; Jamieson & Palade, *JCB* 1967. https://doi.org/10.1083/jcb.34.2.577
15. Serra-Marques et al., *eLife* 2020 (cinesinas KIF5B e KIF13B levam vesículas de secreção à periferia; dineína puxa para o centro). https://elifesciences.org/articles/61302
16. Smith et al., *JCB* 2015 (exportação de RNAm pelo poro em ~200 ms). https://rupress.org/jcb/article/211/6/1121/38235
17. ATP sintase em dímeros nas cristas e rotação: preprint arXiv 2025 (100–650 voltas/s; ainda não revisado por pares). https://arxiv.org/pdf/2506.23439

Visualização e ensino
18. Jantzen, McGill & Jenkinson, doze princípios de animação molecular, *Frontiers in Bioinformatics* 2024, doi 10.3389/fbinf.2024.1353807. https://www.frontiersin.org/journals/bioinformatics/articles/10.3389/fbinf.2024.1353807/full
19. Jenkinson & McGill, *CBE—Life Sciences Education* 2012. https://pmc.ncbi.nlm.nih.gov/articles/PMC3292069
20. Smithsonian, "Teaching Molecular Biology with Watercolors" (Goodsell). https://www.smithsonianmag.com/smart-news/teaching-molecular-biology-with-watercolors-9945944/
21. Drew Berry: entrevista à Clot Magazine https://clotmag.com/biomedia/drew-berry-molecular-visual-appeal ; https://en.wikipedia.org/wiki/Drew_Berry
22. *The Inner Life of the Cell* https://en.wikipedia.org/wiki/The_Inner_Life_of_the_Cell ; Carl Zimmer, *NYT* 2014 https://carlzimmer.com/?p=3650
23. STEM Learning (York), "Cell shape and size — teacher notes" (alunos acham a célula plana; tamanhos relativos). https://stem.org.uk/system/files/elibrary-resources/2018/12/Key%20concept_Cell%20shape%20and%20size%20-%20teacher%20notes.pdf

Fontes brasileiras
24. UFRGS, Atlas de Biologia Celular, complexo de Golgi (face *cis* convexa, voltada ao núcleo/RER; *trans* côncava, libera vesículas). https://www.ufrgs.br/biologiacelularatlas/org3.htm
25. UFPel, Projeto Auxilia, Biologia Aula 2 (subunidades do ribossomo saem pelos poros da carioteca). https://wp.ufpel.edu.br/projetoauxilia/files/2020/07/Biologia-Aula-2.pdf
26. USP e-Disciplinas, "Biologia Celular — Sistema de Endomembranas" (não lido na íntegra). https://edisciplinas.usp.br/pluginfile.php/7698032/mod_resource/content/1/Biologia%20Celular%20-%20Sistema%20de%20Endomembranas.pdf

3D e código
27. three.js: exemplo de corte com tampa por stencil https://threejs.org/examples/#webgl_clipping_stencil ; fórum https://discourse.threejs.org/t/how-to-render-clipped-surfaces-as-if-they-were-a-solid/39549
28. three-bvh-csg (booleanos em tempo real). https://github.com/gkjohnson/three-bvh-csg ; relato de lentidão https://discourse.threejs.org/t/some-experiments-with-bvh-csg-0-0-10/56342
29. Documentação three.js: `SphereGeometry`, `InstancedMesh`, `MeshSurfaceSampler`, `MeshPhysicalMaterial`. https://threejs.org/docs/
30. Manual do Blender: Boolean, Solidify, Bisect, Principled BSDF (subsurface). https://docs.blender.org/manual/en/latest/ ; Blender Artists, corte animado por booleano https://blenderartists.org/t/cross-section-cutoff-animation-of-an-assembly/656980
31. Modelos de célula: AnatoCells (Sketchfab) https://sketchfab.com/3d-models/animal-cell-e2fc495016ca4542b4ff424e22e62277 ; CGTrader "Cell cutaway C4D" https://www.cgtrader.com/3d-models/science/medical/cell-cutaway-c4d ; STLFinder (modelo com "parede celular" em célula animal) https://www.stlfinder.com/model/portfolio-project-parts-of-an-animal-cell-RUOl8RmS/3905894
32. BlenderMeds, tutorial de corte de osso (face cortada com material próprio). https://www.blendernation.com/2019/08/14/blendermeds-bone-cross-section-tutorial/
33. "Beyond fission and fusion — Diving into the mysteries of mitochondrial shape", *PLOS Biology* 2024. https://pmc.ncbi.nlm.nih.gov/articles/PMC11216622/

Documentos internos: `docs/pesquisa/animacao-dos-icones.md`, `docs/pesquisa/tecnicas-3d-realista.md`, `app/src/ui/icones3d/cenas/celula.js`.
