# Cartões de teoria — Biologia (29/10/2026)

Gravado em `bio/index.html` e `bio/dados.json` (`D['teoria'][mod]['cartoes']` e `D['areas']`). Backups: `bio/index.html.bak_cartoes`, `bio/dados.json.bak_cartoes`.
Conferência pós-gravação: JSON válido, `dados.json` = bloco do `index.html`, HTML fora do `<script id="dados">` intacto, 500 questões mantidas, só `teoria` (acréscimo de `cartoes`) e `areas` mudaram; resumo, fórmulas e erro de cada módulo intactos.
Checagem automática: 69/69 conteúdos com cartão, ordem dos conteúdos, título ≤ 5 palavras, frases ≤ 22 palavras, caderno ≤ 4 linhas de ≤ 60 caracteres, zero emoji.

Método: li `nomesub`, a teoria atual (resumo, fórmulas, erro) e o `conceito` das 500 questões (enunciado e gabarito das que tinham cobrança mais específica: Krebs, ATP total, tétrades, Bombaim, linkage 8 UR, epistasia dominante, peroxissomo, leishmania, maré vermelha, ¹²C/¹⁴C, telomerase, ovo embrionado). Cartão extra quando o conteúdo tem 2+ ideias cobradas separadamente. Segunda passada só caçando erro factual, exemplo errado e frase longa (correções: ribossomo mitocondrial não é 70S → 'de tipo bacteriano'; rubisco gera 2 moléculas de 3 C, não açúcar direto; soja usa Bradyrhizobium → 'rizóbios'; Miller usou CH₄, que é orgânico → 'gases simples'; vitamina B12 é hidrossolúvel mas estocada; transporte ativo secundário → 'energia, em geral ATP').

## Áreas de revisão

- **Célula e energia** (`bcel`; B01, B02, B03): Membrana, organelas, moléculas da vida e como a célula obtém energia. Tópicos: Membrana e transporte; Organelas e endossimbiose; Bioquímica e enzimas; Respiração e fermentação; Fotossíntese e quimiossíntese.
- **Genética e biotecnologia** (`bgen`; B04, B05, B06): Do DNA à proteína, divisão celular e as contas de herança dos heredogramas. Tópicos: Mitose, meiose e câncer; DNA, RNA e proteína; Mutações e biotecnologia; Leis de Mendel e probabilidade; Grupos sanguíneos e herança ligada ao sexo.
- **Corpo humano** (`bfis`; B07, B08): Como os sistemas do corpo funcionam e se regulam, com gráficos e casos clínicos. Tópicos: Digestão, respiração e circulação; Rim e equilíbrio de água; Neurônio e sinapse; Hormônios e feedback; Imunidade, vacina e soro; Ciclo menstrual e embrião.
- **Ecologia e ambiente** (`beco`; B09): Cadeias, fluxo de energia, ciclos da matéria, relações, populações e biomas. Tópicos: Cadeias, pirâmides e energia; Ciclos biogeoquímicos; Relações ecológicas; Sucessão e populações; Biomas e impactos.
- **Saúde e parasitologia** (`bsau`; B10, B12, B08): Agente, vetor e via de entrada de cada doença, e a prevenção que sai disso. Tópicos: Viroses e arboviroses; Bacterioses e resistência; Protozooses e verminoses; Vacinas, saneamento e ISTs; Vírus e bactérias: estrutura.
- **Evolução e diversidade** (`bevo`; B11, B12): Como as espécies mudam e se diversificam, e as novidades de cada grupo. Tópicos: Evidências e teorias evolutivas; Deriva e Hardy-Weinberg; Especiação; Fisiologia vegetal; Animais e cladogramas.

## B01 — Citologia (11 cartões)

### B01.1 · Membrana e transporte passivo
- O que é: A membrana é uma bicamada de fosfolipídios com proteínas inseridas: o mosaico fluido. No transporte passivo, a substância segue a favor do gradiente, sem gastar ATP.
- Como identificar: Pistas: 'a favor do gradiente', 'sem gasto de energia', gráfico de velocidade que faz platô. Platô indica transportador saturado: difusão facilitada.
- Exemplo: O₂ e CO₂ atravessam a bicamada por difusão simples nos alvéolos. A glicose entra na hemácia por difusão facilitada, por uma proteína transportadora.
- Caderno: `difusão simples: molécula pequena ou apolar, sem proteína` / `difusão facilitada: canal ou carreador; satura (platô)` / `passivo: a favor do gradiente, sem ATP`
- Cuidado: Usar proteína não é gastar energia: a difusão facilitada tem transportador e continua passiva.

### B01.1 · Osmose e tonicidade
- O que é: Osmose é a passagem de água pela membrana, do meio com menos soluto para o meio com mais soluto. A tonicidade compara o meio com a célula.
- Como identificar: Pistas: 'solução salina', 'murchou', 'inchou', curva de volume celular. Volume que cai indica meio hipertônico; que sobe, hipotônico; constante, isotônico.
- Exemplo: Salada temperada com sal murcha: o meio fica hipertônico e a alface perde água. Hemácia em água destilada incha e sofre hemólise.
- Caderno: `água: do meio hipotônico → para o hipertônico` / `hipertônico: água sai → murcha (vegetal: plasmólise)` / `hipotônico: água entra → incha (hemácia: hemólise)` / `soro fisiológico (NaCl 0,9%) ≈ isotônico ao sangue`
- Cuidado: Célula vegetal em meio hipotônico não estoura: a parede celular resiste, e ela só fica túrgida.

### B01.2 · Transporte ativo
- O que é: Transporte ativo leva a substância contra o gradiente de concentração, gastando energia, em geral ATP. É feito por proteínas chamadas bombas.
- Como identificar: Pistas: 'contra o gradiente', 'mais concentrado dentro que fora', 'inibidor da respiração'. Se faltar ATP e o transporte parar, ele é ativo.
- Exemplo: A bomba de sódio e potássio mantém mais K⁺ dentro e mais Na⁺ fora da célula. Cianeto bloqueia a respiração; sem ATP, a bomba para.
- Caderno: `ativo: contra o gradiente, gasta ATP` / `bomba Na⁺/K⁺: 3 Na⁺ saem e 2 K⁺ entram por 1 ATP` / `resultado: [Na⁺] alta fora, [K⁺] alta dentro`
- Cuidado: Diferença de concentração mantida por muito tempo exige transporte ativo; a difusão tenderia a igualar os dois lados.

### B01.2 · Endocitose e exocitose
- O que é: No transporte em bloco, partículas grandes entram ou saem dentro de vesículas de membrana. Esse processo também gasta energia.
- Como identificar: Pistas: 'englobar', 'pseudópodes', 'vesícula se funde à membrana', 'secreção'. Entrada em vesícula é endocitose; saída é exocitose.
- Exemplo: O neutrófilo engloba bactérias por fagocitose. A célula do pâncreas libera insulina por exocitose.
- Caderno: `fagocitose: partícula sólida, com pseudópodes` / `pinocitose: gotículas de líquido` / `exocitose: vesícula se funde → membrana ganha área` / `fagossomo + lisossomo → vacúolo digestivo`
- Cuidado: Exocitose aumenta a área da membrana e endocitose a reduz; juntas, mantêm o fluxo de membrana.

### B01.3 · Comparação entre células
- O que é: Procarionte não tem núcleo delimitado nem organelas membranosas. Eucarionte tem núcleo com envoltório; a célula vegetal soma parede, cloroplasto e vacúolo grande.
- Como identificar: Pistas: lista de organismos ou tabela de presente e ausente. O que toda célula tem: membrana, citoplasma, ribossomos e DNA.
- Exemplo: Bactéria: DNA no nucleoide e parede de peptidoglicano. Folha: parede de celulose e cloroplastos. Fungo: parede de quitina.
- Caderno: `toda célula: membrana, citoplasma, ribossomo, DNA` / `parede: bactéria peptidoglicano; planta celulose` / `parede de fungo: quitina | animal: sem parede` / `vegetal: cloroplasto e vacúolo central; sem centríolo`
- Cuidado: Ribossomo existe em toda célula; o que falta ao procarionte é organela membranosa.

### B01.4 · Retículo, Golgi e secreção
- O que é: Retículo, Golgi, lisossomos e vesículas formam um sistema de membranas interligado. Proteína de exportação é feita no retículo rugoso e embalada no Golgi.
- Como identificar: Pistas: aminoácido radioativo rastreado, célula secretora, glândula. A marcação aparece no retículo rugoso, depois no Golgi e nas vesículas.
- Exemplo: Células do pâncreas, que secretam enzimas, têm retículo rugoso e Golgi muito desenvolvidos. O acrossomo do espermatozoide vem do Golgi.
- Caderno: `RER (com ribossomos): proteína de exportação` / `REL (sem ribossomos): lipídios, desintoxicação` / `Golgi: modifica, empacota, secreta; forma o acrossomo` / `ribossomo → RER → Golgi → vesícula → exocitose`
- Cuidado: O retículo granuloso tem esse nome pelos ribossomos aderidos; o retículo liso não tem ribossomos.

### B01.4 · Lisossomo e peroxissomo
- O que é: Lisossomo guarda enzimas digestivas que agem em pH ácido. Peroxissomo tem catalase, que decompõe a água oxigenada.
- Como identificar: Pistas: 'digestão intracelular', 'autofagia', 'bolhas na água oxigenada'. Bolhas num ferimento indicam catalase liberando O₂.
- Exemplo: Água oxigenada no machucado espuma: a catalase libera O₂, que mata bactérias anaeróbias obrigatórias. Na autofagia, o lisossomo digere organelas velhas.
- Caderno: `catalase: 2 H₂O₂ → 2 H₂O + O₂` / `heterofagia: digere material de fora da célula` / `autofagia: digere partes da própria célula` / `lisossomos rompidos: a célula se autodigere`
- Cuidado: O gás das bolhas é O₂, não H₂; e vem da catalase, não de uma hidrolase.

### B01.5 · Mitocôndria e cloroplasto
- O que é: A mitocôndria faz a respiração aeróbia e produz a maior parte do ATP. O cloroplasto faz a fotossíntese: capta luz e fixa CO₂.
- Como identificar: Pistas: 'cristas', 'matriz', 'tilacoides', 'estroma'. Produz ATP e fixa CO₂: cloroplasto. Produz ATP oxidando matéria orgânica: mitocôndria.
- Exemplo: Célula muscular, que gasta muita energia, tem muitas mitocôndrias. A célula da folha tem mitocôndrias e cloroplastos ao mesmo tempo.
- Caderno: `mitocôndria: Krebs na matriz; cadeia nas cristas` / `cristas = dobras da membrana interna` / `cloroplasto: luz nos tilacoides; Calvin no estroma`
- Cuidado: Planta também respira: tem mitocôndrias em todas as células vivas, inclusive nas que têm cloroplasto.

### B01.5 · Endossimbiose e DNA mitocondrial
- O que é: Mitocôndria e cloroplasto descendem de bactérias englobadas por uma célula ancestral. Por isso têm DNA próprio, circular, e ribossomos parecidos com os bacterianos.
- Como identificar: Pistas: 'origem das organelas', 'DNA próprio', 'herança materna'. Argumentos válidos: dupla membrana, DNA circular, ribossomos de tipo bacteriano, divisão própria.
- Exemplo: Irmãos de mesma mãe têm o mesmo DNA mitocondrial. As mitocôndrias do espermatozoide são eliminadas no zigoto.
- Caderno: `evidências: 2 membranas, DNA circular` / `ribossomos de tipo bacteriano; dividem-se sozinhas` / `DNA mitocondrial: herança materna` / `mãe → todos os filhos | pai → nenhum`
- Cuidado: Produzir energia não é argumento da endossimbiose; a prova está no DNA, nos ribossomos e na dupla membrana.

### B01.6 · Núcleo, nucléolo e cariótipo
- O que é: O núcleo guarda o DNA, envolto pela carioteca, que tem poros. O nucléolo, sem membrana, produz o RNA ribossômico e monta as subunidades do ribossomo.
- Como identificar: Pistas: 'corante básico', 'basofilia', 'síntese de proteína caiu'. Corante básico cora o que é ácido: DNA e RNA, logo núcleo e nucléolo.
- Exemplo: Cariótipo humano: 46 cromossomos, 22 pares de autossomos e 1 par sexual. Sem nucléolo faltam ribossomos, e a síntese de proteínas cai.
- Caderno: `carioteca: 2 membranas com poros` / `nucléolo: faz RNAr e monta ribossomo; sem membrana` / `eucromatina: frouxa, ativa | heterocromatina: condensada` / `humano: 2n = 46 = 44 autossomos + XX ou XY`
- Cuidado: Homólogos são cromossomos do mesmo par, um de cada genitor; cromátides-irmãs são cópias idênticas unidas no centrômero.

### B01.6 · Citoesqueleto, cílios e flagelos
- O que é: O citoesqueleto é uma rede de proteínas que dá forma e movimento à célula. Microtúbulos formam o eixo de cílios e flagelos e o fuso.
- Como identificar: Pistas: 'movimento', 'fuso mitótico', 'batimento', 'centríolo'. Droga que impede a montagem de microtúbulos bloqueia a divisão celular.
- Exemplo: Cílios da traqueia empurram o muco com poeira para fora. O flagelo do espermatozoide é feito de microtúbulos, no padrão 9 + 2.
- Caderno: `microtúbulos (tubulina): fuso, cílio, flagelo` / `microfilamentos (actina): contração, pseudópode` / `filamentos intermediários: resistência mecânica` / `cílio e flagelo: 9 pares + 2 | centríolo: 9 trios`
- Cuidado: Flagelo bacteriano não tem microtúbulos: é feito de flagelina e gira, ao contrário do flagelo eucarionte.

## B02 — Bioquímica celular (8 cartões)

### B02.1 · Água e sais minerais
- O que é: A água é polar e dissolve muitas substâncias: é o solvente das reações celulares. Sais minerais regulam processos e formam estruturas, mas não fornecem energia.
- Como identificar: Pistas: tabela de carência, 'faz parte da molécula de...', 'anemia', 'bócio'. Associe o íon à molécula ou à função citada.
- Exemplo: Falta de ferro causa anemia, pois o ferro faz parte da hemoglobina. Falta de iodo causa bócio, porque o iodo forma T₃ e T₄.
- Caderno: `Fe: hemoglobina | Mg: clorofila | P: ATP, DNA, osso` / `Ca²⁺: osso, contração muscular, coagulação` / `I: hormônios da tireoide (T₃ e T₄)` / `Na⁺ e K⁺: impulso nervoso e equilíbrio de água`
- Cuidado: Magnésio está na clorofila e ferro na hemoglobina: trocar os dois é o erro mais cobrado.

### B02.2 · Carboidratos
- O que é: Carboidratos são fonte rápida de energia e também material de estrutura. Dividem-se em monossacarídeos, dissacarídeos e polissacarídeos.
- Como identificar: Pistas: 'reserva', 'parede', 'açúcar do leite'. Reserva vegetal: amido. Reserva animal e de fungos: glicogênio. Estrutura vegetal: celulose.
- Exemplo: Mel: glicose e frutose (monossacarídeos). Açúcar de mesa: sacarose (dissacarídeo). Batata: amido (polissacarídeo).
- Caderno: `mono: glicose, frutose, galactose, ribose` / `di: sacarose (glicose + frutose), lactose, maltose` / `poli: amido (planta), glicogênio (animal, fungo)` / `estrutura: celulose (planta), quitina (fungo, inseto)`
- Cuidado: A reserva do fígado e do músculo é o glicogênio, não o amido; e o ser humano não digere celulose.

### B02.2 · Lipídios
- O que é: Lipídios não se dissolvem em água e rendem mais energia por grama que carboidratos. Incluem gorduras, óleos, fosfolipídios, ceras e esteroides.
- Como identificar: Pistas: 'apolar', 'hidrofóbico', 'kcal', 'ligação dupla'. Ácido graxo com ligação dupla C=C é insaturado e, em geral, forma óleo líquido.
- Exemplo: Num rótulo, 10 g de gordura dão 90 kcal e 10 g de carboidrato, 40 kcal. Azeite é rico em gordura insaturada; manteiga, em saturada.
- Caderno: `carboidrato e proteína: 4 kcal/g | lipídio: 9 kcal/g` / `saturado: só C–C | insaturado: tem C=C` / `triglicerídeo = glicerol + 3 ácidos graxos` / `colesterol: membrana animal, hormônios, vitamina D`
- Cuidado: Lipídio rende mais energia por grama que carboidrato, não menos; o carboidrato é só a fonte de uso mais rápido.

### B02.3 · Proteínas e desnaturação
- O que é: Proteínas são cadeias de aminoácidos unidos por ligação peptídica. A sequência define a forma, e a forma define a função.
- Como identificar: Pistas: 'calor', 'pH extremo', 'perdeu a função', 'radical R'. Perda de forma sem quebra da cadeia é desnaturação.
- Exemplo: A clara do ovo cozida fica branca e firme: a albumina desnaturou. Febre muito alta pode desnaturar proteínas do corpo.
- Caderno: `aminoácido: amina + carboxila + radical R` / `aa + aa → dipeptídeo + H₂O (ligação peptídica)` / `1ª sequência | 2ª hélice e folha | 3ª e 4ª forma 3D` / `desnaturação: perde a forma, mantém a sequência`
- Cuidado: Desnaturar não quebra ligação peptídica; quem solta aminoácidos é a hidrólise, na digestão.

### B02.4 · Enzimas e sítio ativo
- O que é: Enzimas são catalisadores, quase sempre proteínas: aceleram reações ao baixar a energia de ativação. Cada uma reconhece seu substrato pelo encaixe no sítio ativo.
- Como identificar: Pistas: 'específica', 'substrato', 'inibidor', tabela de substrato e produto. Inibidor que ocupa o sítio ativo tem forma parecida com a do substrato.
- Exemplo: A amilase digere amido e não digere proteína. Quem tem intolerância à lactose produz pouca lactase.
- Caderno: `E + S → ES → E + P (a enzima sai inalterada)` / `baixa a energia de ativação; não muda o ΔH` / `encaixe: chave-fechadura ou encaixe induzido` / `inibidor competitivo: imita o substrato`
- Cuidado: A enzima não é consumida e não muda o saldo de energia da reação; só a torna mais rápida.

### B02.4 · Temperatura, pH e substrato
- O que é: A atividade de uma enzima depende da temperatura, do pH e da concentração de substrato. Cada enzima tem temperatura ótima e pH ótimo.
- Como identificar: Pistas: gráfico em sino (temperatura ou pH) ou curva com platô (substrato). O pico mostra o ótimo e, no pH, indica o local de ação.
- Exemplo: A pepsina age no estômago, em pH perto de 2. A tripsina age no intestino, em pH perto de 8. A geladeira desacelera enzimas sem destruí-las.
- Caderno: `acima da T ótima: desnatura (em geral, irreversível)` / `T baixa: só desacelera; volta ao aquecer` / `pH ótimo: pepsina ≈ 2 | tripsina ≈ 8` / `[S] alta: platô = todos os sítios ocupados`
- Cuidado: Frio apenas desacelera a enzima, e por isso o alimento descongelado volta a estragar; calor excessivo a desnatura.

### B02.5 · Ácidos nucleicos e ATP
- O que é: DNA e RNA são polímeros de nucleotídeos: fosfato, pentose e base nitrogenada. O ATP é um nucleotídeo que libera energia ao perder um fosfato.
- Como identificar: Pistas: 'desoxirribose', 'uracila', 'fita simples', 'hidrólise do ATP'. Uracila ou ribose indicam RNA; timina ou desoxirribose indicam DNA.
- Exemplo: Ao contrair um músculo, a célula hidrolisa ATP em ADP e fosfato. A energia liberada move as proteínas da contração.
- Caderno: `DNA: desoxirribose; A, T, C, G; dupla-hélice` / `RNA: ribose; A, U, C, G; em geral fita simples` / `ATP + H₂O → ADP + Pi + energia` / `o fosfato é igual no DNA e no RNA`
- Cuidado: DNA e RNA diferem na pentose e em uma base (timina × uracila), não no grupo fosfato.

### B02.5 · Vitaminas e carências
- O que é: Vitaminas são compostos orgânicos necessários em pequena quantidade; muitas atuam como coenzimas. Não fornecem energia.
- Como identificar: Pistas: nome da doença de carência ou 'lipossolúvel'. As vitaminas A, D, E e K são lipossolúveis; as do complexo B e a C, hidrossolúveis.
- Exemplo: Marinheiros sem frutas frescas tinham escorbuto, por falta de vitamina C. Pouco sol e dieta pobre em vitamina D causam raquitismo.
- Caderno: `A: cegueira noturna | D: raquitismo` / `K: falha na coagulação | C: escorbuto` / `B1: beribéri | B12: anemia perniciosa` / `lipossolúveis: A, D, E, K | hidrossolúveis: B e C`
- Cuidado: Em geral as hidrossolúveis pedem reposição frequente; a exceção notável é a B12, que fica estocada no fígado.

## B03 — Metabolismo energético (11 cartões)

### B03.1 · Glicólise
- O que é: A respiração celular quebra a glicose para produzir ATP. A primeira etapa, a glicólise, ocorre no citosol e não usa oxigênio.
- Como identificar: Pistas: 'citosol', 'ácido pirúvico', 'saldo de ATP'. Droga que bloqueia enzimas da glicólise age no citosol, fora da mitocôndria.
- Exemplo: Hemácias humanas não têm mitocôndrias: obtêm ATP só pela glicólise, seguida de fermentação láctica.
- Caderno: `C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O + energia` / `glicólise: 1 glicose → 2 piruvatos (citosol)` / `gasta 2 ATP e forma 4: saldo 2 ATP + 2 NADH` / `ocorre com ou sem O₂`
- Cuidado: Glicólise não depende de oxigênio e ocorre fora da mitocôndria; formar 4 ATP não quer dizer saldo de 4.

### B03.2 · Ciclo de Krebs
- O que é: O piruvato entra na mitocôndria, vira acetil-CoA e alimenta o ciclo de Krebs, na matriz. O ciclo libera CO₂ e carrega NADH e FADH₂.
- Como identificar: Pistas: 'matriz mitocondrial', 'citrato', 'acetil-CoA', 'CO₂ liberado'. O CO₂ expirado sai daqui e da conversão do piruvato em acetil-CoA.
- Exemplo: O CO₂ que você expira veio do carbono da glicose, oxidado na matriz das mitocôndrias.
- Caderno: `piruvato → acetil-CoA + CO₂ + NADH` / `acetil-CoA + oxaloacetato → citrato` / `1 volta: 2 CO₂, 3 NADH, 1 FADH₂, 1 ATP (GTP)` / `1 glicose = 2 voltas → 2 ATP no ciclo`
- Cuidado: Cada glicose dá duas voltas no ciclo: conte o rendimento por volta e depois dobre.

### B03.2 · Cadeia respiratória e quimiosmose
- O que é: Na membrana interna da mitocôndria, NADH e FADH₂ entregam elétrons a uma cadeia de proteínas. A energia bombeia H⁺, e a ATP sintase produz ATP.
- Como identificar: Pistas: 'cristas', 'citocromos', 'gradiente de prótons', 'aceptor final'. Sem O₂, ou com cianeto, a cadeia para e o ATP despenca.
- Exemplo: O cianeto bloqueia a cadeia respiratória: há oxigênio no sangue, mas as células não conseguem usá-lo.
- Caderno: `local: membrana interna (cristas)` / `O₂ + 4 H⁺ + 4 e⁻ → 2 H₂O (aceptor final)` / `H⁺ volta pela ATP sintase → ATP (quimiosmose)` / `fosforilação oxidativa: ≈ 26 a 28 ATP por glicose`
- Cuidado: A água da respiração se forma na cadeia, quando o O₂ recebe elétrons; o CO₂ vem do Krebs, não do O₂.

### B03.3 · Balanço energético
- O que é: A respiração aeróbia é catabolismo: quebra glicose e guarda parte da energia em ATP. O O₂ é o aceptor final de elétrons da cadeia.
- Como identificar: Pistas: 'rendimento por glicose', 'aceptor final', 'aeróbia, anaeróbia ou fermentação'. Compare o aceptor final e quanto ATP cada processo rende.
- Exemplo: Com O₂, uma glicose rende cerca de 30 a 32 ATP; na fermentação, só 2. Por isso o músculo cansa rápido sem oxigênio.
- Caderno: `2 (glicólise) + 2 (Krebs) + 26–28 = 30–32 ATP` / `livros antigos: 36 a 38 ATP (conta teórica)` / `aeróbia: aceptor final O₂` / `anaeróbia: aceptor inorgânico ≠ O₂ (NO₃⁻, SO₄²⁻)`
- Cuidado: Respiração anaeróbia não é fermentação: tem cadeia de elétrons, mas o aceptor final é outro, como nitrato ou sulfato.

### B03.4 · Fermentação alcoólica
- O que é: Fermentação produz ATP sem oxigênio, só pela glicólise. Na alcoólica, o piruvato vira etanol e CO₂.
- Como identificar: Pistas: 'levedura', 'massa de pão crescendo', 'bolhas', 'Saccharomyces'. Massa que cresce ou bebida com gás indicam CO₂ da fermentação alcoólica.
- Exemplo: O fermento biológico do pão é a levedura Saccharomyces cerevisiae. O CO₂ forma as bolhas que fazem a massa crescer; o álcool evapora no forno.
- Caderno: `C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂ (+ 2 ATP)` / `local: citosol, sem uso de O₂` / `saldo: 2 ATP por glicose` / `Pasteur: fermentação é feita por micro-organismos`
- Cuidado: Fermentação não ocorre na mitocôndria e rende só 2 ATP por glicose.

### B03.4 · Fermentação láctica
- O que é: Na fermentação láctica, o piruvato recebe os hidrogênios do NADH e vira ácido láctico (lactato). Não há liberação de CO₂.
- Como identificar: Pistas: 'esforço intenso', 'queda de pH no músculo', 'iogurte', 'lactobacilos'. Sem gás e com acidez: fermentação láctica.
- Exemplo: Numa corrida de 100 m, o músculo produz lactato e o pH cai. Lactobacilos transformam o leite em iogurte e coalhada.
- Caderno: `C₆H₁₂O₆ → 2 C₃H₆O₃ (ácido láctico) + 2 ATP` / `sem CO₂ | o piruvato recebe os H do NADH` / `ocorre em: músculo, hemácia, lactobacilos` / `regenera NAD⁺ e mantém a glicólise`
- Cuidado: Fermentação láctica não libera CO₂; quem libera gás é a alcoólica.

### B03.5 · Fase fotoquímica
- O que é: Na fase fotoquímica, nos tilacoides, a clorofila capta luz e a água é quebrada. Saem O₂, ATP e NADPH.
- Como identificar: Pistas: 'tilacoide', 'fotólise', 'origem do O₂', 'clorofila a'. Pergunta de onde vem o O₂ liberado: a resposta é a água.
- Exemplo: Com água marcada com ¹⁸O, o O₂ liberado sai marcado. Com CO₂ marcado, o O₂ liberado não sai marcado.
- Caderno: `6 CO₂ + 12 H₂O → C₆H₁₂O₆ + 6 O₂ + 6 H₂O` / `fotólise: 2 H₂O → 4 H⁺ + 4 e⁻ + O₂` / `produtos: ATP + NADPH + O₂ (nos tilacoides)` / `clorofila a: centro de reação | b: acessória`
- Cuidado: O O₂ liberado vem da água, não do CO₂; o hidrogênio do NADPH também vem da água.

### B03.5 · Ciclo de Calvin
- O que é: No ciclo de Calvin, no estroma, a enzima rubisco fixa CO₂. O ATP e o NADPH da fase fotoquímica transformam esse carbono em açúcar.
- Como identificar: Pistas: 'estroma', 'fixação de CO₂', 'rubisco', 'fase escura'. Se faltam ATP e NADPH, o ciclo de Calvin para logo depois.
- Exemplo: O carbono da madeira de uma árvore veio do CO₂ do ar, fixado pela rubisco nas folhas.
- Caderno: `local: estroma do cloroplasto` / `rubisco: CO₂ + RuBP → 2 moléculas de 3 carbonos` / `gasta ATP e NADPH; devolve ADP e NADP⁺` / `C e O do açúcar vêm do CO₂`
- Cuidado: Fase 'escura' não quer dizer à noite: o ciclo depende do ATP e do NADPH da luz e para logo no escuro.

### B03.6 · Fatores limitantes e compensação
- O que é: A fotossíntese depende de luz, CO₂ e temperatura; o fator mais escasso limita a taxa. No ponto de compensação, fotossíntese e respiração se igualam.
- Como identificar: Pistas: gráfico de taxa × luz, curvas ao longo do dia, 'heliófila', 'umbrófila'. Abaixo do ponto de compensação, a planta gasta reserva.
- Exemplo: Plantas de sombra (umbrófilas) atingem o ponto de compensação com pouca luz. Plantas de sol (heliófilas) precisam de mais luz.
- Caderno: `P = R: ponto de compensação fótico` / `acima: P > R → a planta acumula e cresce` / `abaixo: P < R → a planta consome reserva` / `umbrófila: compensação com pouca luz`
- Cuidado: No ponto de compensação a planta continua fazendo fotossíntese e respirando; só o saldo de gases é zero.

### B03.6 · Plantas C4 e CAM
- O que é: Na fotorrespiração, a rubisco fixa O₂ em vez de CO₂ e desperdiça carbono. Plantas C4 e CAM concentram CO₂ e reduzem esse desperdício.
- Como identificar: Pistas: 'clima quente e seco', 'estômatos abertos à noite', 'bainha do feixe'. Separação no espaço é C4; separação no tempo é CAM.
- Exemplo: Milho e cana-de-açúcar são plantas C4. Abacaxi e cactos são CAM: abrem os estômatos à noite e economizam água.
- Caderno: `fotorrespiração: rubisco fixa O₂ (calor, estômato fechado)` / `C4: capta CO₂ no mesofilo; Calvin na bainha` / `CAM: capta CO₂ à noite; Calvin de dia` / `C4 separa no espaço | CAM separa no tempo`
- Cuidado: Planta CAM faz o ciclo de Calvin de dia; à noite só capta o CO₂ e o guarda como ácido orgânico.

### B03.6 · Quimiossíntese
- O que é: Quimiossíntese é produzir matéria orgânica com a energia da oxidação de substâncias inorgânicas, sem luz. É feita por certas bactérias e arqueias.
- Como identificar: Pistas: 'sem luz', 'fontes hidrotermais', 'nitrificantes', 'oxidação da amônia'. Produz o próprio alimento sem luz: autótrofo quimiossintetizante.
- Exemplo: Bactérias nitrificantes do solo oxidam amônia a nitrito e nitrito a nitrato. Em fontes hidrotermais, bactérias oxidam H₂S.
- Caderno: `energia: oxidação de NH₃, NO₂⁻, H₂S, Fe²⁺` / `Nitrosomonas: NH₃ → NO₂⁻` / `Nitrobacter: NO₂⁻ → NO₃⁻` / `autótrofo: fixa CO₂, mas sem luz`
- Cuidado: Quimiossintetizante é autótrofo: o critério é produzir o próprio alimento, não usar luz.

## B04 — Divisão celular e câncer (8 cartões)

### B04.1 · Ciclo celular e interfase
- O que é: O ciclo celular tem interfase (G1, S e G2) e divisão (M). O DNA duplica só na fase S.
- Como identificar: Pistas: gráfico de quantidade de DNA, 'fase S', 'ponto de checagem'. O trecho em que o DNA dobra de 2C para 4C é a fase S.
- Exemplo: O neurônio maduro fica em G0 e quase não se divide. Células da pele e da medula óssea se dividem o tempo todo.
- Caderno: `G1 (cresce, 2C) → S (duplica, 4C) → G2 → M` / `G0: célula fora do ciclo (ex.: neurônio)` / `checagem: em G1, em G2 e na metáfase` / `p53 para o ciclo se o DNA estiver lesado`
- Cuidado: Interfase não é repouso: é a fase mais longa, com síntese de DNA e de proteínas e crescimento.

### B04.2 · Mitose
- O que é: A mitose divide uma célula em duas geneticamente iguais, com o mesmo número de cromossomos. Serve ao crescimento, ao reparo e à reprodução assexuada.
- Como identificar: Pistas: 'células-filhas idênticas', 'separação das cromátides-irmãs', figura de uma fase. Na metáfase, os cromossomos ficam alinhados e no máximo de condensação.
- Exemplo: Um corte na pele cicatriza por mitose. Para montar o cariótipo, a divisão é parada na metáfase com colchicina.
- Caderno: `prófase: condensa | metáfase: alinha no equador` / `anáfase: separa as cromátides-irmãs` / `telófase: refaz os núcleos | citocinese: divide` / `2n → 2n + 2n (mesmo material genético)`
- Cuidado: Na metáfase mitótica os homólogos não ficam pareados: cada cromossomo se alinha sozinho, com duas cromátides.

### B04.3 · Meiose
- O que é: A meiose tem duas divisões seguidas e forma quatro células com metade dos cromossomos. A meiose I separa homólogos; a meiose II separa cromátides-irmãs.
- Como identificar: Pistas: 'tétrade', 'bivalente', 'células haploides', DNA caindo duas vezes no gráfico. Homólogos pareados ou se separando indicam meiose I.
- Exemplo: Em humanos, células com 46 cromossomos geram gametas com 23. Se a planta forma 16 tétrades na meiose, ela tem 2n = 32.
- Caderno: `meiose I: separa homólogos (2n → n), reducional` / `meiose II: separa cromátides (n → n), equacional` / `DNA por célula: 4C (após S) → 2C → C` / `nº de tétrades = n | 2n = 2 × tétrades`
- Cuidado: Entre a meiose I e a meiose II não há fase S: o DNA não duplica de novo.

### B04.3 · Crossing-over e variabilidade
- O que é: No crossing-over, cromátides de homólogos trocam pedaços na prófase I. Com a segregação independente, isso gera gametas muito variados.
- Como identificar: Pistas: 'paquíteno', 'quiasma', 'permuta', 'variabilidade'. Fontes de variabilidade da meiose: crossing-over e segregação independente dos homólogos.
- Exemplo: Irmãos filhos dos mesmos pais são diferentes: cada gameta levou uma combinação própria de alelos.
- Caderno: `prófase I: lepto → zigo → paqui → diplo → diacinese` / `paquíteno: crossing-over` / `diplóteno: quiasmas visíveis` / `humano: 2²³ combinações só pela segregação`
- Cuidado: Crossing-over só recombina alelos que já existem; alelo novo só surge por mutação.

### B04.4 · Gametogênese
- O que é: A espermatogênese forma quatro espermatozoides por célula; a ovogênese forma um gameta e corpúsculos polares. Na mulher, o citoplasma se divide de forma desigual.
- Como identificar: Pistas: esquema de linhagem, 'ovócito', 'espermátide', 'corpúsculo polar'. Conte: 4 gametas por espermatócito primário e 1 por ovócito primário.
- Exemplo: Na ovulação, a mulher libera um ovócito secundário parado na metáfase II. A meiose II só termina se houver fecundação.
- Caderno: `espermatogônia → espermatócito I → II → espermátide` / `espermátide → espermatozoide (espermiogênese)` / `ovogônia → ovócito I → ovócito II + corpúsculo` / `ovócito II só completa a meiose II se fecundado`
- Cuidado: O que a mulher libera na ovulação é o ovócito secundário, não um óvulo com a meiose completa.

### B04.4 · Não disjunção e aneuploidias
- O que é: Não disjunção é a falha na separação de cromossomos na meiose. Gera gametas com um cromossomo a mais ou a menos: aneuploidia.
- Como identificar: Pistas: '47 cromossomos', 'trissomia', 'monossomia', cariótipo descrito. Um cromossomo a mais ou a menos é aneuploidia; um lote inteiro a mais é euploidia.
- Exemplo: Síndrome de Down: 47,XX,+21 ou 47,XY,+21. Síndrome de Turner: 45,X. Síndrome de Klinefelter: 47,XXY.
- Caderno: `Down: trissomia do 21 | Turner: 45,X` / `Klinefelter: 47,XXY (sexo masculino)` / `aneuploidia: 2n + 1 ou 2n − 1 | euploidia: 3n, 4n` / `X e Y se separam na meiose I`
- Cuidado: Triploidia (3n) não é trissomia: na triploidia sobra um lote inteiro; na trissomia, um só cromossomo.

### B04.5 · Apoptose
- O que é: Apoptose é a morte celular programada, controlada por genes e sem inflamação. Necrose é a morte por lesão, com rompimento da célula e inflamação.
- Como identificar: Pistas: 'morte programada', 'fragmentação ordenada', 'p53'. Morte organizada, sem inflamação e geneticamente controlada: apoptose.
- Exemplo: As membranas entre os dedos do embrião somem por apoptose. Uma queimadura grave mata células por necrose.
- Caderno: `apoptose: programada, ordenada, sem inflamação` / `necrose: lesão; a célula incha, rompe e inflama` / `p53 detecta DNA lesado → reparo ou apoptose`
- Cuidado: Apoptose não é defeito: é um processo normal do desenvolvimento e uma defesa contra o câncer.

### B04.5 · Câncer e células-tronco
- O que é: Câncer é a multiplicação descontrolada de células somáticas por mitose, após mutações acumuladas. Oncogenes ativados aceleram; genes supressores inativados deixam de frear.
- Como identificar: Pistas: 'telomerase', 'metástase', 'oncogene', 'p53', 'transplante de medula'. Inibir telomerase ou mitose reduz a multiplicação das células tumorais.
- Exemplo: Tabaco e radiação ultravioleta causam mutações e são fatores de risco. O transplante de medula troca as células-tronco do sangue pelas do doador.
- Caderno: `oncogene: mutação de ganho de função (acelerador)` / `supressor (p53): mutação de perda de função (freio)` / `telomerase ativa: a célula tumoral não envelhece` / `metástase: células migram pelo sangue ou pela linfa`
- Cuidado: Mutação em célula somática não passa aos filhos; o transplante de medula muda o sangue, não os gametas.

## B05 — Genética molecular (11 cartões)

### B05.1 · Estrutura do DNA
- O que é: O DNA é uma dupla-hélice de duas fitas antiparalelas. As bases pareiam por ligações de hidrogênio: A com T e C com G.
- Como identificar: Pistas: porcentagem de uma base, 'fita complementar', 'pares de bases'. Use a regra de Chargaff: na fita dupla, A = T e C = G.
- Exemplo: Se um DNA tem 20% de adenina, tem 20% de timina, 30% de citosina e 30% de guanina.
- Caderno: `A = T e C = G | A + G = T + C = 50%` / `A–T: 2 ligações de H | C–G: 3` / `fitas antiparalelas: 5′→3′ e 3′→5′` / `5′-ATGC-3′ pareia com 3′-TACG-5′`
- Cuidado: A regra de Chargaff vale para a fita dupla; numa fita simples, A não precisa ser igual a T.

### B05.1 · Replicação semiconservativa
- O que é: Na replicação, as fitas se separam e cada uma serve de molde para uma nova. Cada DNA-filho tem uma fita antiga e uma nova.
- Como identificar: Pistas: 'Meselson e Stahl', '¹⁵N', 'bandas no tubo', 'DNA polimerase'. Banda intermediária na 1ª geração confirma o modelo semiconservativo.
- Exemplo: Bactérias criadas em ¹⁵N e passadas para ¹⁴N: na 1ª geração, só DNA intermediário; na 2ª, metade intermediário e metade leve.
- Caderno: `helicase abre → DNA polimerase → ligase une` / `síntese da nova fita: sempre 5′ → 3′` / `geração 1: 100% híbrido` / `geração 2: 50% híbrido + 50% leve`
- Cuidado: Semiconservativa não é metade de cada fita: cada molécula tem uma fita antiga inteira e uma nova inteira.

### B05.2 · Transcrição
- O que é: Transcrição é a síntese de RNA a partir de uma fita molde de DNA. A RNA polimerase reconhece o promotor e começa ali.
- Como identificar: Pistas: 'fita molde', 'RNAm', 'promotor', 'uracila'. Escreva o complementar do molde e troque T por U.
- Exemplo: O molde de DNA 3′-TAC GGA-5′ gera o RNAm 5′-AUG CCU-3′, que codifica metionina e prolina.
- Caderno: `molde A, T, C, G → RNA U, A, G, C` / `só uma das fitas do gene é transcrita` / `RNA polimerase reconhece o promotor` / `RNA cresce no sentido 5′ → 3′`
- Cuidado: O RNAm é complementar ao molde, não idêntico a ele; e no RNA não há timina.

### B05.2 · Processamento do RNA
- O que é: Em eucariontes, o RNA recém-feito é processado no núcleo. Os íntrons são retirados e os éxons são unidos: é o splicing.
- Como identificar: Pistas: 'íntron', 'éxon', 'RNA maduro menor que o gene'. Se o gene é maior que o RNAm, a diferença são íntrons removidos.
- Exemplo: Um gene com íntrons gera um RNAm maduro bem menor que ele. O splicing alternativo permite fazer proteínas diferentes a partir de um gene.
- Caderno: `pré-RNAm − íntrons → RNAm maduro (só éxons)` / `ganha capuz na ponta 5′ e cauda poli-A na 3′` / `procariontes: em geral sem íntrons` / `splicing alternativo: 1 gene → várias proteínas`
- Cuidado: O íntron é retirado do RNA, não do DNA: o gene continua com seus íntrons.

### B05.3 · Código genético e tradução
- O que é: Tradução é a síntese de proteína no ribossomo, lendo o RNAm de três em três bases. Cada códon indica um aminoácido, trazido por um RNAt.
- Como identificar: Pistas: tabela de códons, 'anticódon', 'AUG', 'códon de parada'. O anticódon do RNAt é complementar ao códon do RNAm.
- Exemplo: O códon AUG (metionina) pareia com o anticódon UAC. Um trecho de 300 bases, sem o códon de parada, codifica 100 aminoácidos.
- Caderno: `3 bases = 1 códon = 1 aminoácido` / `início: AUG (metionina) | parada: UAA, UAG, UGA` / `64 códons: 61 de aminoácidos + 3 de parada` / `degenerado: vários códons para o mesmo aminoácido`
- Cuidado: O gene codifica a proteína, não o aminoácido: os aminoácidos chegam prontos, trazidos pelos RNAt.

### B05.4 · Mutações gênicas
- O que é: Mutação é uma mudança na sequência do DNA. Pode trocar uma base ou inserir e remover bases, deslocando a leitura.
- Como identificar: Pistas: 'substituição', 'inserção', 'deleção', 'proteína encurtada'. Inserção ou deleção que não é múltiplo de 3 muda todos os códons seguintes.
- Exemplo: Anemia falciforme: a troca de A por T no gene da β-globina muda o 6º aminoácido, de glutamato para valina.
- Caderno: `substituição: silenciosa, troca de aa ou parada` / `inserção ou deleção (não múltiplo de 3): desloca` / `somática: não é herdada | germinativa: é herdada` / `agentes: radiação UV, raios X, substâncias químicas`
- Cuidado: Nem toda troca de base muda a proteína: o código é degenerado, e a mutação pode ser silenciosa.

### B05.4 · Mutações cromossômicas
- O que é: Mutações cromossômicas alteram a estrutura ou o número dos cromossomos. Podem ser vistas no cariótipo.
- Como identificar: Pistas: 'segmento', 'troca entre não homólogos', 'trecho invertido', 'perda de pedaço'. Troca mútua entre cromossomos não homólogos é translocação.
- Exemplo: Síndrome do miado do gato: deleção de parte do cromossomo 5. Leucemia mieloide crônica: translocação entre os cromossomos 9 e 22.
- Caderno: `deleção: perde trecho | duplicação: repete trecho` / `inversão: o trecho gira 180°` / `translocação: troca entre não homólogos` / `numéricas: aneuploidia e euploidia`
- Cuidado: Translocação é entre não homólogos; a troca entre homólogos na meiose é o crossing-over, que é normal.

### B05.5 · Expressão gênica e diferenciação
- O que é: As células de um mesmo corpo têm o mesmo genoma, mas ativam genes diferentes. Fatores de transcrição ligam ou desligam genes.
- Como identificar: Pistas: 'células diferentes do mesmo indivíduo', 'diferenciação', 'fator de transcrição'. A resposta é expressão gênica diferencial, não DNA diferente.
- Exemplo: Neurônio e célula do fígado têm o mesmo DNA. Só as células beta do pâncreas expressam o gene da insulina.
- Caderno: `mesmo genoma, genes ativos diferentes` / `fator de transcrição liga ao DNA e recruta a RNA pol` / `sem fatores de transcrição → menos RNA produzido` / `célula-tronco: ainda pode virar vários tipos`
- Cuidado: Em regra, a diferenciação não perde nem altera genes; muda quais genes são transcritos.

### B05.6 · Ferramentas do DNA
- O que é: Enzimas de restrição cortam o DNA em sequências específicas, e a DNA ligase une fragmentos. A PCR copia DNA; a eletroforese separa fragmentos por tamanho.
- Como identificar: Pistas: 'gel', 'bandas', 'teste de paternidade', 'amplificar'. No gel, cada banda do filho precisa aparecer na mãe ou no pai.
- Exemplo: No exame de paternidade, cada banda do filho aparece na mãe ou no suposto pai. A PCR detecta vírus numa amostra do nariz.
- Caderno: `PCR: desnatura (≈ 95 °C) → anela → estende (72 °C)` / `Taq polimerase: resiste ao calor (bactéria termófila)` / `n ciclos → até 2ⁿ cópias` / `gel: DNA (−) migra ao polo +; o menor anda mais`
- Cuidado: No gel de eletroforese, quem anda mais é o fragmento menor, não o maior.

### B05.6 · Transgênicos e CRISPR
- O que é: Transgênico é o organismo que recebeu um gene de outra espécie. No CRISPR-Cas9, um RNA-guia leva a enzima Cas9 a cortar um ponto exato do DNA.
- Como identificar: Pistas: 'gene inserido', 'plasmídeo', 'Bt', 'edição gênica', 'terapia gênica'. Veja o que o gene inserido faz e em que célula foi inserido.
- Exemplo: Bactéria com o gene humano da insulina produz insulina humana. Milho Bt produz uma proteína tóxica para lagartas de certas pragas.
- Caderno: `DNA recombinante: corta (restrição) + cola (ligase)` / `vetor: plasmídeo bacteriano` / `CRISPR: RNA-guia endereça, Cas9 corta` / `terapia gênica: leva gene funcional a células`
- Cuidado: Edição em célula somática não passa aos filhos; só a feita na linhagem germinativa é herdada.

### B05.6 · Clonagem
- O que é: Na clonagem por transferência nuclear, o núcleo de uma célula somática vai para um óvulo sem núcleo. O clone tem o DNA nuclear do doador do núcleo.
- Como identificar: Pistas: 'Dolly', 'óvulo enucleado', 'barriga de aluguel', 'DNA mitocondrial'. Quem doa o núcleo define o genoma nuclear; a barriga de aluguel não doa genes.
- Exemplo: Dolly (1996) veio do núcleo de uma célula mamária de uma ovelha, posto no óvulo sem núcleo de outra. Foi gestada por uma terceira.
- Caderno: `DNA nuclear: do doador do núcleo` / `DNA mitocondrial: da doadora do óvulo` / `barriga de aluguel: não contribui com genes` / `clones: sem variabilidade, mesmas suscetibilidades`
- Cuidado: Clone não é cópia perfeita: o ambiente também molda o fenótipo, e o DNA mitocondrial pode ser outro.

## B06 — Genética clássica (11 cartões)

### B06.1 · Primeira lei de Mendel
- O que é: Cada característica depende de um par de alelos, que se separa na formação dos gametas. Cada gameta leva um só alelo do par.
- Como identificar: Pistas: 'monoibridismo', 'proporção 3 : 1', 'cruzamento-teste'. Pais iguais com filho diferente: os pais são heterozigotos, e o filho é recessivo.
- Exemplo: Mendel cruzou ervilhas (Pisum sativum) amarelas Aa × Aa e obteve 3 amarelas para 1 verde.
- Caderno: `Aa × Aa → 1 AA : 2 Aa : 1 aa` / `fenótipo: 3 dominantes : 1 recessivo` / `Aa × aa → 1 : 1 (cruzamento-teste)` / `dominante: A_ | recessivo: só aa`
- Cuidado: Dominante não quer dizer mais frequente: quer dizer que se manifesta também no heterozigoto.

### B06.1 · Probabilidade em genética
- O que é: Eventos independentes que ocorrem juntos se multiplicam: regra do 'e'. Eventos que se excluem se somam: regra do 'ou'.
- Como identificar: Pistas: 'menino e afetado', 'ou', 'sabendo que é normal'. Se o filho de pais Aa já é normal, a chance de ser Aa é 2/3.
- Exemplo: Casal Aa × Aa: chance de menino afetado = 1/2 × 1/4 = 1/8. O filho normal desse casal é portador com chance de 2/3.
- Caderno: `'e' → multiplica | 'ou' → soma` / `P(menino afetado) = 1/2 × 1/4 = 1/8` / `normal, filho de Aa × Aa: P(Aa) = 2/3` / `cada gestação é independente das anteriores`
- Cuidado: Se o enunciado já diz que a pessoa é normal, o aa sai do espaço amostral: use 2/3, não 1/2.

### B06.2 · Segunda lei de Mendel
- O que é: Genes em cromossomos diferentes se separam de forma independente. Cada gameta leva um alelo de cada par, em todas as combinações.
- Como identificar: Pistas: 'di-híbrido', '9 : 3 : 3 : 1', 'quantos tipos de gameta'. Use 2ⁿ, com n igual ao número de pares em heterozigose.
- Exemplo: AaBb forma 4 tipos de gameta: AB, Ab, aB e ab. AaBbCc forma 2³ = 8 tipos.
- Caderno: `AaBb × AaBb → 9 : 3 : 3 : 1` / `tipos de gameta = 2ⁿ (n = pares heterozigotos)` / `resolva gene a gene e multiplique` / `P(aabb) = 1/4 × 1/4 = 1/16`
- Cuidado: A 2ª lei só vale para genes em cromossomos diferentes; genes ligados não se separam de forma independente.

### B06.3 · Heredogramas
- O que é: O heredograma mostra como uma característica passa pelas gerações de uma família. A chave é achar o casal cujo filho difere dos pais.
- Como identificar: Pistas: quadrado é homem, círculo é mulher, símbolo cheio é afetado. Pais iguais com filho diferente: o filho tem o fenótipo recessivo.
- Exemplo: Pais normais com filha afetada: herança autossômica recessiva. Pais afetados com filho normal: herança dominante.
- Caderno: `pais normais → filho afetado: recessiva` / `pais afetados → filho normal: dominante` / `pai afetado com filha normal: não é dominante no X` / `muitos homens afetados, filhos de mãe normal: X recessiva`
- Cuidado: Não decida pela característica mais comum na família: decida pelo casal que gera filho diferente deles.

### B06.4 · Dominância incompleta e codominância
- O que é: Na dominância incompleta, o heterozigoto tem fenótipo intermediário. Na codominância, os dois alelos se manifestam juntos.
- Como identificar: Pistas: flor 'rosa' entre vermelha e branca, pelagem malhada, proporção 1 : 2 : 1 de fenótipos. Nesses casos, fenótipo e genótipo coincidem.
- Exemplo: Maravilha vermelha × branca dá flores rosa; a F2 dá 1 vermelha : 2 rosa : 1 branca. No sangue AB, os antígenos A e B aparecem juntos.
- Caderno: `incompleta: fenótipo intermediário (rosa)` / `codominância: os dois aparecem (tipo AB)` / `F2: 1 : 2 : 1 em fenótipo e em genótipo`
- Cuidado: Codominância não é mistura: no tipo AB não há antígeno intermediário, há A e B ao mesmo tempo.

### B06.4 · Sistema ABO
- O que é: O sistema ABO tem três alelos (Iᴬ, Iᴮ e i): é um caso de alelos múltiplos. A hemácia tem antígenos (aglutinogênios); o plasma, anticorpos (aglutininas) contra os ausentes.
- Como identificar: Pistas: 'aglutinou com soro anti-A', 'doador', 'receptor', 'filho do grupo O'. Filho O exige que os dois pais tenham o alelo i.
- Exemplo: Pai A e mãe B com filho O: o pai é Iᴬi e a mãe, Iᴮi. Esse casal pode ter filhos A, B, AB ou O.
- Caderno: `Iᴬ = Iᴮ > i` / `A: antígeno A, anti-B | B: antígeno B, anti-A` / `AB: antígenos A e B, sem anti-A nem anti-B` / `O: sem antígeno, anti-A e anti-B`
- Cuidado: Na transfusão, conta o antígeno da hemácia do doador contra o anticorpo do receptor, não o contrário.

### B06.4 · Fator Rh e eritroblastose
- O que é: Quem é Rh positivo tem o antígeno D na hemácia; quem é Rh negativo não tem. O Rh negativo só produz anti-Rh depois de exposto a sangue Rh positivo.
- Como identificar: Pistas: 'mãe Rh⁻', 'segundo filho', 'icterícia no recém-nascido'. Mãe Rh⁻ sensibilizada com feto Rh⁺: risco de eritroblastose fetal.
- Exemplo: Mãe Rh⁻ tem o 1º filho Rh⁺ e se sensibiliza no parto. Na gestação seguinte, seus anticorpos podem destruir as hemácias de um feto Rh⁺.
- Caderno: `Rh⁺: RR ou Rr | Rh⁻: rr` / `risco: mãe rr com feto Rr, da 2ª gestação em diante` / `prevenção: imunoglobulina anti-D na mãe (até 72 h)`
- Cuidado: O risco é da mãe Rh⁻ com feto Rh⁺, não o inverso; o 1º filho, em geral, não é afetado.

### B06.5 · Herança ligada ao sexo
- O que é: Genes ligados ao sexo ficam na parte do X sem correspondente no Y. O homem tem um só X, então um alelo recessivo nele já se manifesta.
- Como identificar: Pistas: 'hemofilia', 'daltonismo', 'mais homens afetados', 'passa do pai para a filha'. O homem passa seu X a todas as filhas e a nenhum filho.
- Exemplo: Mulher portadora (XᴴXʰ) com homem normal: metade dos filhos homens é hemofílica. As filhas são normais, e metade delas é portadora.
- Caderno: `homem: XY (hemizigoto) | mulher: XX` / `XᴴXʰ × XᴴY: 1/2 dos meninos afetados` / `pai: X para as filhas, Y para os filhos` / `gata tricolor: um X inativado ao acaso`
- Cuidado: O pai nunca passa gene ligado ao X ao filho homem: o filho recebe dele o Y.

### B06.6 · Linkage e permuta
- O que é: Genes no mesmo cromossomo tendem a ir juntos para o gameta: é o linkage. O crossing-over separa alguns e forma gametas recombinantes.
- Como identificar: Pistas: 'cruzamento-teste', 'unidades de recombinação', 'cis', 'trans'. As classes raras são recombinantes; somadas, dão a distância entre os genes.
- Exemplo: AB/ab com 8 UR forma 46% AB, 46% ab, 4% Ab e 4% aB. Os recombinantes somam 8%.
- Caderno: `distância (UR = cM) = % de recombinantes` / `cis: AB/ab | trans: Ab/aB` / `cada parental: (100 − d)/2 %` / `cada recombinante: d/2 %`
- Cuidado: As classes mais frequentes são as parentais e revelam o arranjo cis ou trans; não as confunda com recombinantes.

### B06.6 · Epistasia
- O que é: Na epistasia, um gene impede a manifestação de outro gene, não alelo. Isso altera as proporções clássicas do di-híbrido.
- Como identificar: Pistas: '12 : 3 : 1', '9 : 3 : 4', '9 : 7', 'falso O', 'Bombaim'. Proporção em dezesseis avos fora de 9 : 3 : 3 : 1 indica interação gênica.
- Exemplo: Fenótipo Bombaim: quem é hh não faz o antígeno H, então não forma A nem B e parece O. Produz anti-A, anti-B e anti-H.
- Caderno: `epistasia dominante: 12 : 3 : 1` / `epistasia recessiva: 9 : 3 : 4` / `Bombaim (hh): parece O, mesmo tendo Iᴬ ou Iᴮ` / `WwBb × wwbb (W epistático): 2 : 1 : 1`
- Cuidado: Epistasia ocorre entre genes diferentes; dominância ocorre entre alelos do mesmo gene.

### B06.6 · Herança quantitativa e pleiotropia
- O que é: Na herança quantitativa, vários genes somam efeitos sobre uma característica e geram variação contínua. Na pleiotropia, um só gene afeta várias características.
- Como identificar: Pistas: 'gradação', 'curva normal', 'cor da pele', 'altura'. Muitas classes de fenótipo indicam poligenia; vários efeitos de um gene, pleiotropia.
- Exemplo: A cor da pele humana varia em gradação, controlada por vários genes. Na síndrome de Marfan, um gene afeta ossos, olhos e coração.
- Caderno: `n pares de genes → 2n + 1 classes de fenótipo` / `cada extremo na F2: (1/4)ⁿ` / `cada alelo aditivo soma o mesmo efeito` / `pleiotropia: 1 gene → vários efeitos`
- Cuidado: Herança quantitativa é muitos genes para uma característica; pleiotropia é o inverso, um gene para várias.

## B07 — Fisiologia humana I (10 cartões)

### B07.1 · Tecidos fundamentais
- O que é: O corpo tem quatro tecidos fundamentais: epitelial, conjuntivo, muscular e nervoso. O arranjo das células e a quantidade de matriz distinguem cada um.
- Como identificar: Pistas: 'células justapostas', 'muita substância intercelular', 'estrias', 'discos intercalares'. Pouca matriz e células coladas: tecido epitelial.
- Exemplo: Na pele, a epiderme é epitélio e a derme é conjuntivo. Sangue, osso, cartilagem e gordura também são tecidos conjuntivos.
- Caderno: `epitelial: células unidas, pouca matriz, sem vasos` / `conjuntivo: muita matriz (osso, sangue, adiposo)` / `muscular: esquelético (voluntário), cardíaco, liso` / `nervoso: neurônios + células da glia`
- Cuidado: Músculo liso e cardíaco são involuntários; só o estriado esquelético obedece à vontade.

### B07.2 · Digestão química
- O que é: Enzimas quebram os alimentos por hidrólise ao longo do tubo digestório. Cada uma age num local e num pH próprios.
- Como identificar: Pistas: gráfico de atividade × pH, curvas de digestão ao longo do tubo. pH ácido aponta o estômago; pH básico, o duodeno.
- Exemplo: O pão começa a ser digerido na boca, pela amilase salivar. A carne começa a ser digerida no estômago, pela pepsina.
- Caderno: `boca: amilase salivar → amido` / `estômago: pepsina (pH ≈ 2) → proteínas` / `duodeno: suco pancreático (pH ≈ 8) + bile` / `intestino delgado: termina a digestão e absorve`
- Cuidado: A bile não tem enzima digestiva: ela emulsiona a gordura, e quem a digere é a lipase pancreática.

### B07.2 · Absorção, fígado e pâncreas
- O que é: O intestino delgado absorve nutrientes pelas vilosidades e microvilosidades. O fígado processa o que chega pela veia porta; o pâncreas lança enzimas e bicarbonato.
- Como identificar: Pistas: 'doença celíaca', 'vesícula biliar', 'secretina', 'veia porta'. Lesão nas vilosidades reduz a área de absorção.
- Exemplo: Na doença celíaca, o glúten do trigo, da cevada e do centeio lesa as vilosidades. A vitamina C aumenta a absorção do ferro.
- Caderno: `fígado: bile, glicogênio, ureia, desintoxicação` / `pâncreas: enzimas + bicarbonato (secretina, CCK)` / `açúcares e aminoácidos → veia porta → fígado` / `maior parte dos lipídios → linfa`
- Cuidado: O fígado produz a bile; a vesícula biliar só armazena e libera.

### B07.3 · Ventilação e hematose
- O que é: Na inspiração, o diafragma contrai e desce, o volume do tórax aumenta e a pressão interna cai. A troca de gases ocorre nos alvéolos, por difusão.
- Como identificar: Pistas: 'diafragma', 'pressão intrapulmonar', 'alvéolo', 'enfisema'. O ar entra quando a pressão no pulmão fica menor que a atmosférica.
- Exemplo: No enfisema, alvéolos destruídos reduzem a área de troca, e falta ar. O tabagismo é a principal causa.
- Caderno: `inspiração: diafragma desce → volume ↑ → pressão ↓` / `expiração em repouso: passiva; volume ↓ → pressão ↑` / `hematose: difusão simples nos alvéolos` / `O₂: alvéolo → sangue | CO₂: sangue → alvéolo`
- Cuidado: Hematose é difusão simples: não gasta ATP nem usa transportador.

### B07.3 · Transporte de gases e controle
- O que é: O O₂ viaja ligado à hemoglobina; a maior parte do CO₂ viaja como bicarbonato no plasma. O bulbo ajusta a respiração conforme o CO₂ e o pH do sangue.
- Como identificar: Pistas: 'curva de dissociação', 'efeito Bohr', 'pH', 'bulbo', 'altitude'. Mais CO₂ ou pH mais ácido: a hemoglobina solta mais O₂.
- Exemplo: Ao prender a respiração, o CO₂ acumula e acidifica o sangue; o bulbo força a inspiração. No músculo em exercício, a hemoglobina solta mais O₂.
- Caderno: `CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻` / `efeito Bohr: CO₂ ↑, pH ↓ → Hb libera O₂` / `CO₂ alto → bulbo → respiração mais rápida` / `monóxido de carbono (CO): prende-se firme à Hb`
- Cuidado: No dia a dia, quem estimula o centro respiratório é o excesso de CO₂, não a falta de O₂.

### B07.4 · Coração e circulações
- O que é: O coração humano tem quatro cavidades: dois átrios e dois ventrículos. A circulação é dupla e completa: sangue arterial e venoso não se misturam.
- Como identificar: Pistas: 'ventrículo esquerdo', 'artéria pulmonar', 'septo', 'nó sinoatrial'. Artéria sai do coração e veia chega a ele, seja qual for o sangue.
- Exemplo: Na comunicação interventricular, um orifício no septo deixa o sangue arterial e o venoso se misturarem.
- Caderno: `grande: VE → aorta → corpo → veias cavas → AD` / `pequena: VD → a. pulmonar → pulmão → v. pulmonares → AE` / `artéria pulmonar leva sangue venoso` / `marca-passo: nó sinoatrial (átrio direito)`
- Cuidado: Artéria não é vaso de sangue arterial: a artéria pulmonar leva sangue venoso, e as veias pulmonares, arterial.

### B07.5 · Sangue e coagulação
- O que é: O sangue tem plasma e elementos figurados: hemácias, leucócitos e plaquetas. Plaquetas e proteínas do plasma formam o coágulo de fibrina.
- Como identificar: Pistas: hemograma, 'altitude', 'sangramento', 'núcleo', 'DNA'. Só os leucócitos têm núcleo; hemácias e plaquetas humanas não têm.
- Exemplo: Quem vive em grande altitude tem mais hemácias, compensando o ar rarefeito. Plaquetas muito baixas causam sangramentos.
- Caderno: `hemácia: leva O₂ | leucócito: defesa (tem núcleo)` / `plaqueta: fragmento de célula; inicia a coagulação` / `protrombina → trombina (precisa de Ca²⁺)` / `fibrinogênio → fibrina: rede do coágulo`
- Cuidado: O coágulo é a rede de fibrina; a trombina é a enzima que converte o fibrinogênio em fibrina.

### B07.5 · Vasos e pressão arterial
- O que é: Pressão arterial é a força do sangue sobre a parede das artérias. É máxima na sístole e mínima na diástole.
- Como identificar: Pistas: gráficos de pressão, velocidade e área ao longo dos vasos. Nos capilares, a área total é máxima e a velocidade, mínima.
- Exemplo: Pressão de 12 por 8 significa 120 mmHg na sístole e 80 mmHg na diástole. Uma hemorragia grande faz a pressão cair.
- Caderno: `PA ≈ 120/80 mmHg (sistólica/diastólica)` / `capilares: área total máxima → velocidade mínima` / `pressão: artérias > capilares > veias` / `retorno venoso: válvulas + contração muscular`
- Cuidado: Cada capilar é finíssimo, mas, somados, os capilares têm a maior área de secção; por isso o sangue passa devagar.

### B07.6 · Néfron e formação da urina
- O que é: O néfron é a unidade funcional do rim. A urina se forma por filtração, reabsorção e secreção.
- Como identificar: Pistas: tabela plasma × filtrado × urina, 'cápsula renal', 'túbulo proximal'. Glicose presente no filtrado e ausente na urina foi toda reabsorvida.
- Exemplo: Os rins filtram cerca de 180 L de plasma por dia e eliminam só cerca de 1,5 L de urina. No diabetes descontrolado, sobra glicose na urina.
- Caderno: `glomérulo → cápsula: filtração, por pressão` / `túbulo proximal: reabsorve glicose, aa, Na⁺, água` / `alça de Henle: concentra | distal e coletor: ajustam` / `rim → ureter → bexiga → uretra`
- Cuidado: Proteínas grandes e células não passam no filtrado normal; se aparecem na urina, indicam lesão no glomérulo.

### B07.6 · ADH e aldosterona
- O que é: O ADH aumenta a reabsorção de água no ducto coletor. A aldosterona aumenta a reabsorção de Na⁺ no túbulo distal e no ducto coletor.
- Como identificar: Pistas: 'sudorese', 'desidratação', 'álcool', 'urina diluída', 'diabetes insípido'. Pouca água no corpo: mais ADH e urina concentrada.
- Exemplo: Depois de suar muito, a urina fica escassa e escura. O álcool inibe o ADH: aumenta o volume de urina e desidrata.
- Caderno: `desidratação → ADH ↑ → urina pouca e concentrada` / `falta de ADH → muita urina diluída` / `ADH: feito no hipotálamo, liberado na neuro-hipófise` / `aldosterona (córtex adrenal): retém Na⁺ e água`
- Cuidado: O ADH não faz o rim filtrar menos: faz o ducto coletor reabsorver mais água.

## B08 — Neuro, hormônios, imune e reprodução (12 cartões)

### B08.1 · Neurônio e mielina
- O que é: O neurônio conduz o impulso: dendritos recebem, o corpo celular integra e o axônio transmite. A bainha de mielina acelera a condução.
- Como identificar: Pistas: esquema com partes numeradas, 'nódulo de Ranvier', 'esclerose múltipla'. Perda de mielina deixa o impulso mais lento.
- Exemplo: Na esclerose múltipla, o sistema imune ataca a mielina do encéfalo e da medula. Os impulsos ficam lentos ou falham.
- Caderno: `dendrito → corpo celular → axônio → terminal` / `mielina: célula de Schwann (SNP), oligodendrócito (SNC)` / `condução saltatória: de nódulo em nódulo` / `glia: sustenta e nutre; não conduz o impulso`
- Cuidado: Quem conduz o impulso é o neurônio; as células da glia sustentam, nutrem e formam a mielina.

### B08.1 · Potencial de repouso e ação
- O que é: Em repouso, o interior do neurônio é negativo, perto de −70 mV. No potencial de ação, a entrada de Na⁺ inverte a carga, e a saída de K⁺ a restaura.
- Como identificar: Pistas: gráfico de voltagem × tempo, 'despolarização', 'repolarização'. Subida rápida: Na⁺ entrando. Descida: K⁺ saindo.
- Exemplo: Anestésicos locais, como a lidocaína, bloqueiam canais de Na⁺: o sinal de dor não chega ao encéfalo.
- Caderno: `repouso: dentro − / fora + (≈ −70 mV)` / `despolarização: Na⁺ entra (o interior fica +)` / `repolarização: K⁺ sai` / `tudo ou nada: atingiu o limiar, dispara`
- Cuidado: A bomba de Na⁺/K⁺ não produz o pico do impulso; ela restabelece as concentrações, gastando ATP.

### B08.2 · Sinapse química
- O que é: Sinapse é a região de comunicação entre um neurônio e a célula seguinte, sem contato direto. O sinal atravessa a fenda por meio de neurotransmissores.
- Como identificar: Pistas: 'fenda sináptica', 'vesículas', 'recaptação', 'receptor'. Droga que bloqueia receptor ou recaptação age na sinapse.
- Exemplo: A fluoxetina, um antidepressivo, bloqueia a recaptação de serotonina. O curare bloqueia receptores de acetilcolina e paralisa músculos.
- Caderno: `impulso chega → Ca²⁺ entra → exocitose` / `neurotransmissor se liga ao receptor pós-sináptico` / `fim: recaptação ou degradação (acetilcolinesterase)` / `sentido único: axônio → célula seguinte`
- Cuidado: Na sinapse química o sinal passa num só sentido: do terminal do axônio para a célula pós-sináptica.

### B08.3 · Sistema nervoso autônomo
- O que é: O sistema nervoso autônomo controla os órgãos sem comando consciente. O simpático prepara para luta ou fuga; o parassimpático, para repouso e digestão.
- Como identificar: Pistas: 'susto', 'coração disparado', 'pupila dilatada', 'digestão'. Efeitos de alerta são simpáticos; de calma e digestão, parassimpáticos.
- Exemplo: Num susto, o coração acelera, a pupila dilata, os brônquios se abrem e a digestão para. Depois do almoço, o parassimpático ativa a digestão.
- Caderno: `simpático: coração ↑, pupila e brônquios dilatam` / `simpático: digestão ↓, glicemia ↑ (noradrenalina)` / `parassimpático: coração ↓, pupila contrai` / `parassimpático: digestão ↑ (acetilcolina)`
- Cuidado: O simpático não estimula tudo: ele inibe a digestão.

### B08.3 · Arco reflexo
- O que é: Ato reflexo é uma resposta rápida e involuntária, coordenada pela medula espinal. Não depende do encéfalo para acontecer.
- Como identificar: Pistas: 'martelinho no joelho', 'tirar a mão do fogo', 'medula'. Ordem: receptor, neurônio sensitivo, medula, neurônio motor, efetor.
- Exemplo: Reflexo patelar: só dois neurônios, arco monossináptico. Tirar a mão da panela quente envolve neurônio de associação: arco polissináptico.
- Caderno: `receptor → sensitivo → medula → motor → efetor` / `monossináptico: sem neurônio de associação` / `polissináptico: com neurônio de associação` / `o encéfalo percebe depois, mas não comanda`
- Cuidado: O reflexo patelar é somático (atua em músculo esquelético) e medular; não é coordenado pelo sistema autônomo.

### B08.4 · Hipófise e feedback negativo
- O que é: O hipotálamo comanda a hipófise, e a adeno-hipófise comanda outras glândulas. O hormônio final, em excesso, inibe o hipotálamo e a hipófise.
- Como identificar: Pistas: 'TSH', 'TRH', 'bócio', 'eixo', 'neuro-hipófise'. Se o hormônio final cai, sobem os hormônios de cima do eixo.
- Exemplo: Na falta de iodo, T₃ e T₄ caem, o TSH sobe e a tireoide cresce: é o bócio.
- Caderno: `TRH (hipotálamo) → TSH (adeno-hipófise) → T₃, T₄` / `T₃ e T₄ altos inibem TRH e TSH` / `adeno-hipófise: GH, TSH, ACTH, FSH, LH, prolactina` / `neuro-hipófise: libera ADH e ocitocina`
- Cuidado: A neuro-hipófise não produz hormônios: só armazena e libera ADH e ocitocina, feitos no hipotálamo.

### B08.5 · Insulina e glucagon
- O que é: A insulina baixa a glicemia; o glucagon a eleva. Os dois são produzidos nas ilhotas pancreáticas (de Langerhans).
- Como identificar: Pistas: 'jejum', 'após a refeição', 'glicogênio', 'diabetes'. Glicemia alta pede insulina; glicemia baixa pede glucagon.
- Exemplo: Após o almoço, a insulina faz o fígado e o músculo guardarem glicose como glicogênio. No jejum, o glucagon libera glicose do fígado.
- Caderno: `insulina (células beta): glicose sai do sangue` / `glucagon (células alfa): glicogênio → glicose` / `diabetes tipo 1: falta insulina (autoimune)` / `diabetes tipo 2: resistência à insulina`
- Cuidado: Glucagon não é glicogênio: o glucagon é hormônio; o glicogênio é o polissacarídeo de reserva.

### B08.5 · Tireoide, adrenais e cálcio
- O que é: T₃ e T₄ regulam o metabolismo; PTH e calcitonina controlam o cálcio do sangue. Adrenalina e cortisol respondem ao estresse.
- Como identificar: Pistas: gráfico de calcemia, 'estresse prolongado', 'susto', 'metabolismo lento'. Cálcio sobe logo após o pico de um hormônio: é o PTH.
- Exemplo: O hipotireoidismo causa cansaço, frio e ganho de peso. No susto, a adrenalina sobe em segundos; no estresse crônico, o cortisol fica alto.
- Caderno: `tireoide: T₃, T₄ (metabolismo); calcitonina (Ca²⁺ ↓)` / `paratireoides: PTH (Ca²⁺ ↑)` / `medula da adrenal: adrenalina (resposta rápida)` / `córtex da adrenal: cortisol (glicemia ↑), aldosterona`
- Cuidado: Adrenalina vem da medula da adrenal; cortisol e aldosterona vêm do córtex.

### B08.6 · Imunidade inata e adaptativa
- O que é: A imunidade inata age rápido e sem especificidade: barreiras, fagócitos e inflamação. A adaptativa é específica, usa linfócitos e guarda memória.
- Como identificar: Pistas: 'antígeno', 'anticorpo', 'resposta secundária', 'linfócito T CD4'. Na segunda exposição, a resposta é mais rápida e intensa, graças à memória.
- Exemplo: Quem teve sarampo não o pega de novo: guardou linfócitos de memória. O HIV destrói linfócitos T auxiliares (CD4).
- Caderno: `inata: pele, muco, neutrófilo, macrófago` / `adaptativa: linfócito B → plasmócito → anticorpo` / `linfócito T: auxiliar (CD4) e citotóxico (CD8)` / `2ª exposição: resposta mais rápida e mais forte`
- Cuidado: Antígeno é a molécula estranha que dispara a resposta; anticorpo é a proteína que o corpo produz contra ela.

### B08.6 · Vacina e soro
- O que é: A vacina leva antígeno e faz o corpo produzir anticorpos e memória: imunização ativa. O soro leva anticorpos prontos: imunização passiva, rápida e temporária.
- Como identificar: Pistas: 'picada de cobra', 'efeito imediato', 'prevenção', 'imunodeprimido'. Urgência pede soro; prevenção pede vacina.
- Exemplo: Picada de jararaca: soro antibotrópico, produzido em cavalos. Contra o sarampo: vacina tríplice viral.
- Caderno: `vacina: antígeno → ativa → memória → prevenção` / `soro: anticorpo pronto → passiva → tratamento` / `ativa natural: ter a doença` / `passiva natural: placenta e leite materno`
- Cuidado: Soro não deixa memória: quem recebeu soro antiofídico pode precisar dele de novo numa nova picada.

### B08.7 · Ciclo menstrual
- O que é: FSH e LH, da hipófise, comandam o ovário; estrógeno e progesterona, do ovário, preparam o útero. O pico de LH provoca a ovulação.
- Como identificar: Pistas: gráfico com quatro hormônios, 'corpo lúteo', 'hCG', 'gravidez'. O estrógeno sobe antes da ovulação; a progesterona, depois.
- Exemplo: Num ciclo de 28 dias, a ovulação ocorre por volta do 14º dia. O teste de gravidez detecta hCG na urina.
- Caderno: `FSH → folículo → estrógeno (endométrio cresce)` / `pico de LH → ovulação (≈ dia 14 de 28)` / `corpo lúteo → progesterona (mantém endométrio)` / `sem gravidez: progesterona cai → menstruação`
- Cuidado: Na gravidez não há menstruação porque o hCG do embrião mantém o corpo lúteo produzindo progesterona.

### B08.7 · Fecundação e folhetos embrionários
- O que é: A fecundação ocorre, em geral, na tuba uterina. O zigoto sofre clivagens e forma mórula, blástula e gástrula, que tem três folhetos.
- Como identificar: Pistas: 'tubo neural', 'cavidade cheia de líquido', 'folheto', 'blastocele'. Uma camada de células em volta de uma cavidade com líquido: blástula.
- Exemplo: O tubo neural, na região dorsal do embrião, vem do ectoderma e forma o encéfalo e a medula espinal.
- Caderno: `zigoto → mórula → blástula → gástrula → nêurula` / `ectoderma: epiderme e sistema nervoso` / `mesoderma: músculo, osso, sangue, coração, rim` / `endoderma: revestimento do tubo digestório e pulmão`
- Cuidado: O sistema nervoso vem do ectoderma, não do mesoderma, embora fique no interior do corpo.

## B09 — Ecologia (11 cartões)

### B09.1 · Cadeias e teias alimentares
- O que é: A cadeia alimentar mostra quem come quem. A teia junta várias cadeias, e um mesmo animal pode ocupar mais de um nível trófico.
- Como identificar: Pistas: setas, 'onívoro', 'controle biológico', quadro de presas. O nível depende da posição na cadeia, não do tipo de animal.
- Exemplo: Capim → gafanhoto → sapo → cobra. Um gavião que come a cobra é consumidor quaternário; se come um rato que comeu capim, é secundário.
- Caderno: `produtor → consumidor 1º → 2º → 3º` / `decompositores: fungos e bactérias` / `seta: do alimento para quem come` / `fitoplâncton (algas) = produtor`
- Cuidado: A seta indica o caminho da energia: aponta do alimento para quem o come.

### B09.2 · Fluxo de energia
- O que é: A energia entra pela fotossíntese e flui num só sentido. Cada nível passa cerca de 10% ao seguinte; o resto se perde, sobretudo como calor.
- Como identificar: Pistas: 'energia disponível', 'nível trófico', 'perda', 'calor'. Quanto mais longa a cadeia, menos energia chega ao topo.
- Exemplo: De 10 000 kcal no capim, cerca de 1 000 chegam ao boi e 100 a quem come o boi. Comer vegetais aproveita mais energia.
- Caderno: `energia: fluxo unidirecional, não recicla` / `≈ 10% passa ao nível seguinte` / `perdas: calor da respiração, fezes, restos` / `a matéria recicla; a energia não`
- Cuidado: Energia não circula como a matéria: sai do ecossistema como calor e não volta.

### B09.2 · Pirâmides ecológicas
- O que é: Pirâmides mostram número, biomassa ou energia em cada nível trófico. A pirâmide de energia nunca é invertida.
- Como identificar: Pistas: pirâmide com base estreita, 'árvore com insetos', 'fitoplâncton'. Base menor que o nível de cima: só pode ser de número ou de biomassa.
- Exemplo: Uma árvore sustenta milhares de insetos: pirâmide de números invertida. No mar, o fitoplâncton pode ter biomassa instantânea menor que o zooplâncton.
- Caderno: `número: pode inverter (árvore → insetos)` / `biomassa: pode inverter (fitoplâncton)` / `energia: nunca inverte` / `decompositores não entram na pirâmide`
- Cuidado: A pirâmide de energia não informa o número de indivíduos: uma só árvore pode guardar muita energia.

### B09.3 · Ciclos do carbono e água
- O que é: O carbono sai do ar pela fotossíntese e volta pela respiração, pela decomposição e pela combustão. O ciclo da água é movido pela energia solar.
- Como identificar: Pistas: 'combustível fóssil', 'efeito estufa', 'pulmão do mundo', 'evapotranspiração'. Queimar fóssil leva carbono do subsolo para a atmosfera.
- Exemplo: Uma floresta madura consome quase todo o O₂ que produz, por isso não é o 'pulmão do mundo'. Queimar petróleo lança CO₂ guardado há milhões de anos.
- Caderno: `fotossíntese: CO₂ do ar → matéria orgânica` / `respiração, decomposição, queima: → CO₂` / `fóssil não tem ¹⁴C → razão ¹²C/¹⁴C do ar sobe` / `água: evaporação, transpiração, chuva (Sol)`
- Cuidado: Floresta em crescimento retira carbono do ar; floresta madura em equilíbrio tem saldo perto de zero.

### B09.3 · Ciclo do nitrogênio
- O que é: O N₂ do ar só entra nos seres vivos pela fixação, feita por bactérias. As plantas absorvem nitrogênio sobretudo como nitrato e também como amônio.
- Como identificar: Pistas: 'leguminosa', 'nódulos', 'rizóbios', 'nitrificação', 'adubação verde'. As etapas do ciclo são feitas por bactérias.
- Exemplo: Feijão e soja têm nódulos com rizóbios, que fixam N₂ (mutualismo). Por isso a rotação com leguminosas aduba o solo.
- Caderno: `fixação: N₂ → NH₃ (rizóbios, cianobactérias)` / `nitrificação: NH₃ → NO₂⁻ → NO₃⁻` / `a planta absorve NO₃⁻ e NH₄⁺` / `desnitrificação: NO₃⁻ → N₂ (volta ao ar)`
- Cuidado: Plantas não aproveitam o N₂ do ar; dependem das bactérias que fixam e transformam o nitrogênio.

### B09.4 · Relações harmônicas
- O que é: Nas relações harmônicas, nenhum dos lados é prejudicado. Podem ocorrer entre indivíduos da mesma espécie ou de espécies diferentes.
- Como identificar: Pistas: 'ambos se beneficiam', 'obrigatória', 'sem prejuízo'. Benefício mútuo obrigatório é mutualismo; não obrigatório, protocooperação.
- Exemplo: Líquen (fungo + alga) é mutualismo. O anu que come carrapatos do gado faz protocooperação. Bromélia sobre uma árvore é inquilinismo.
- Caderno: `mutualismo: +/+ obrigatório (líquen)` / `protocooperação: +/+ não obrigatório` / `comensalismo: +/0 (restos) | inquilinismo: +/0 (abrigo)` / `intraespecíficas: colônia e sociedade`
- Cuidado: Mutualismo é obrigatório; se os dois vivem bem separados, a relação é protocooperação.

### B09.4 · Relações desarmônicas
- O que é: Nas relações desarmônicas, pelo menos um lado é prejudicado. Incluem predação, parasitismo, competição e amensalismo.
- Como identificar: Pistas: 'mesmo nicho', 'toxina que inibe', 'mata a presa', 'vive à custa'. Duas espécies no mesmo nicho competem; uma tende a excluir a outra.
- Exemplo: Na maré vermelha, algas liberam toxinas que matam peixes: amensalismo. O fungo Penicillium inibe bactérias com a penicilina.
- Caderno: `predação: +/− | parasitismo: +/−` / `competição: −/− (mesmo recurso)` / `amensalismo: 0/− (toxina inibe outro ser)` / `intraespecíficas: competição e canibalismo`
- Cuidado: O parasita, em geral, não mata logo o hospedeiro; o predador mata a presa para se alimentar.

### B09.5 · Sucessão ecológica
- O que é: Sucessão é a mudança gradual das comunidades de um local até o clímax. Começa com espécies pioneiras.
- Como identificar: Pistas: 'rocha nua', 'líquens', 'área desmatada', gráfico de biomassa e produtividade. Biomassa crescendo e saldo positivo: comunidade ainda em sucessão.
- Exemplo: Líquens colonizam a rocha nua e iniciam o solo: sucessão primária. Pasto abandonado que vira mata: sucessão secundária.
- Caderno: `primária: sem solo | secundária: já há solo` / `pioneiros: líquens, gramíneas` / `rumo ao clímax: biomassa e diversidade ↑` / `clímax: P ≈ R (produtividade líquida ≈ 0)`
- Cuidado: No clímax a produtividade bruta é alta, mas a líquida tende a zero: quase tudo é gasto na respiração.

### B09.5 · Dinâmica de populações
- O que é: A população cresce com nascimentos e imigração e diminui com mortes e emigração. A resistência do meio limita o crescimento.
- Como identificar: Pistas: 'curva em S', 'capacidade de suporte', 'natalidade', 'densidade'. Curva em J: crescimento sem limite; curva em S: estabiliza na capacidade de suporte.
- Exemplo: Coelhos levados à Austrália cresceram em J, sem predadores naturais. Doença contagiosa mata mais em população densa.
- Caderno: `N ↑: natalidade + imigração` / `N ↓: mortalidade + emigração` / `J: potencial biótico | S: limitada pela capacidade K` / `dependem da densidade: competição, doença, predação`
- Cuidado: Geada mata igual em população densa ou rala: é um fator independente da densidade.

### B09.6 · Biomas brasileiros
- O que é: O Brasil tem seis biomas: Amazônia, Mata Atlântica, Cerrado, Caatinga, Pantanal e Pampa. Reconheça cada um pelo clima, pela vegetação e pelo regime de água.
- Como identificar: Pistas: 'buritis', 'igapó', 'cactos', 'cheia e seca', 'campos', 'árvores tortuosas'. Cada pista aponta um bioma.
- Exemplo: Vereda com buritis: Cerrado. Igapó e várzea: Amazônia. Arenização em campos nativos do Rio Grande do Sul: Pampa.
- Caderno: `Amazônia: chuva alta; terra firme, várzea, igapó` / `Cerrado: árvores tortuosas, casca grossa, fogo` / `Caatinga: semiárido, plantas que perdem folhas` / `Pantanal: planície alagável | Pampa: campos (RS)`
- Cuidado: O Cerrado não é deserto: raízes profundas alcançam água mesmo na seca, e a casca grossa protege do fogo.

### B09.6 · Impactos ambientais
- O que é: Biomagnificação, eutrofização, espécies invasoras e efeito estufa são os impactos mais cobrados. Cada um tem uma cadeia de causa e efeito.
- Como identificar: Pistas: 'mercúrio', 'DDT', 'esgoto', 'algas', 'peixes mortos', 'espécie exótica'. Siga a sequência de causas até o desfecho pedido.
- Exemplo: Mercúrio do garimpo se concentra nos peixes carnívoros e em quem os come. Esgoto num lago causa proliferação de algas e morte de peixes.
- Caderno: `biomagnificação: poluente ↑ a cada nível trófico` / `eutrofização: N, P → algas → decomposição → O₂ ↓` / `DBO alta: muita matéria orgânica, pouco O₂` / `invasora: sem predador, compete e reduz diversidade`
- Cuidado: Na eutrofização, os peixes morrem em geral por falta de O₂, consumido pelos decompositores, e não por toxina.

## B10 — Saúde e doenças (7 cartões)

### B10.1 · Viroses e arboviroses
- O que é: Viroses são doenças causadas por vírus, agentes acelulares. Arboviroses são viroses transmitidas por artrópodes, como mosquitos.
- Como identificar: Pistas: 'Aedes', 'macacos mortos', 'febre', 'vetor'. Dengue, zika, chikungunya e febre amarela urbana têm o Aedes aegypti como vetor.
- Exemplo: Morte de macacos alerta para febre amarela silvestre: eles são vítimas, não transmissores. A catapora é causada pelo vírus varicela-zóster.
- Caderno: `Aedes aegypti: dengue, zika, chikungunya, FA urbana` / `FA silvestre: mosquitos Haemagogus e Sabethes` / `outras: gripe, sarampo, covid-19, raiva, HPV` / `prevenção: vacina e eliminar criadouros`
- Cuidado: Macaco não transmite febre amarela ao ser humano; quem transmite é o mosquito.

### B10.2 · Bacterioses e resistência
- O que é: Bacterioses são doenças causadas por bactérias e tratadas com antibióticos. A resistência surge por seleção natural de variantes que já existiam.
- Como identificar: Pistas: 'bacilo', 'tosse há semanas', 'superbactéria', 'uso prolongado de antibiótico'. O antibiótico seleciona as resistentes; não provoca a mutação.
- Exemplo: Tuberculose: Mycobacterium tuberculosis, tosse prolongada, vacina BCG e tratamento longo. Hanseníase: Mycobacterium leprae.
- Caderno: `tuberculose (BCG), hanseníase, cólera, leptospirose` / `tétano, sífilis, gonorreia, coqueluche` / `superbactéria = resistente a vários antibióticos` / `resistência: variante preexistente + seleção`
- Cuidado: Bactéria não se acostuma ao antibiótico: as resistentes já existiam e sobreviveram.

### B10.3 · Protozooses e vetores
- O que é: Protozooses são doenças causadas por protozoários; várias têm um inseto vetor. Conhecer o ciclo indica a prevenção.
- Como identificar: Pistas: 'barbeiro', 'mosquito-prego', 'mosquito-palha', 'febre em ciclos', 'hemácias'. O mais cobrado é casar agente, vetor e doença.
- Exemplo: Malária: Plasmodium, transmitido pela fêmea do Anopheles; a febre vem quando as hemácias se rompem. Leishmaniose: o parasita vive dentro de macrófagos.
- Caderno: `malária: Plasmodium | Anopheles (sexuada no mosquito)` / `Chagas: T. cruzi | barbeiro (fezes) ou via oral` / `leishmaniose: Leishmania | mosquito-palha` / `toxoplasmose: gato, carne crua | amebíase: água`
- Cuidado: Na doença de Chagas o parasita não vem na saliva do barbeiro: vem nas fezes, que entram pela pele lesada ou mucosa.

### B10.4 · Platelmintos parasitas
- O que é: Platelmintos são vermes achatados. Os parasitas humanos mais cobrados são as tênias e o esquistossomo.
- Como identificar: Pistas: 'caramujo', 'lagoa', 'barriga-d'água', 'carne crua', 'cisticerco'. Larva que penetra a pele em água doce: esquistossomose.
- Exemplo: Na esquistossomose, a cercária sai do caramujo Biomphalaria e entra pela pele. Comer carne de porco malcozida com cisticercos causa teníase.
- Caderno: `teníase: comer cisticerco (carne de porco ou boi)` / `cisticercose: ingerir ovo de Taenia solium` / `esquistossomose: cercária penetra a pele` / `S. mansoni adulto: veias do intestino (mesentéricas)`
- Cuidado: Teníase vem da carne com cisticerco; cisticercose vem de ingerir ovos da tênia do porco.

### B10.4 · Nematoides parasitas
- O que é: Nematoides são vermes cilíndricos com tubo digestório completo. Ascaridíase e ancilostomose têm uma fase da larva no pulmão.
- Como identificar: Pistas: 'pés descalços', 'amarelão', 'ovos em verduras', 'coceira anal'. Entra pela pele: ancilostomose. Entra pela boca: ascaridíase.
- Exemplo: Ancilostomose (amarelão): a larva entra pela pele do pé descalço e causa anemia. Ascaridíase: ingestão de ovos em verdura mal lavada.
- Caderno: `Ascaris: ingere ovo → larva passa pelo pulmão` / `ancilóstomo: larva penetra a pele → anemia` / `oxiúro: coceira anal, reinfecção pelas mãos` / `filariose (elefantíase): mosquito Culex`
- Cuidado: Usar calçado previne a ancilostomose, não a ascaridíase; contra o Ascaris valem saneamento e alimentos bem lavados.

### B10.5 · Saneamento e vacinação
- O que é: O saneamento básico corta a transmissão de doenças pela água e pelas fezes. A vacinação em massa protege também quem não pode ser vacinado.
- Como identificar: Pistas: 'enchente', 'água contaminada', 'cobertura vacinal', 'imunodeprimido'. Enchente com esgoto: leptospirose, hepatite A e diarreias.
- Exemplo: Após uma enchente, os casos de leptospirose sobem: a urina de rato contamina a água. Alta cobertura vacinal protege bebês novos demais para a vacina.
- Caderno: `água e fezes: cólera, hepatite A, amebíase, giardíase` / `enchente: leptospirose (urina de rato)` / `imunidade coletiva: alta cobertura protege todos` / `vacina é específica: não cobre outra doença`
- Cuidado: Vacina contra a dengue não protege contra zika nem chikungunya, mesmo com o mesmo mosquito vetor.

### B10.5 · Infecções sexualmente transmissíveis
- O que é: ISTs são causadas por vírus, bactérias ou protozoários. O preservativo previne a maioria; algumas têm vacina.
- Como identificar: Pistas: 'ferida indolor', 'verrugas', 'vacina disponível', 'agente'. Separe o tipo de agente: bactéria se trata com antibiótico; vírus, não.
- Exemplo: Sífilis: ferida única e indolor (cancro duro), tratada com penicilina. HPV: vírus com vacina, ligado ao câncer do colo do útero.
- Caderno: `vírus: HIV, HPV (vacina), herpes, hepatite B (vacina)` / `bactéria: sífilis, gonorreia, clamídia` / `protozoário: tricomoníase` / `preservativo: barreira contra a maioria`
- Cuidado: A vacina do HPV previne a infecção pelos tipos que ela inclui; ela não trata quem já tem a lesão.

## B11 — Evolução (8 cartões)

### B11.1 · Evidências da evolução
- O que é: Fósseis, anatomia comparada, embriologia e comparação de DNA indicam ancestralidade comum. Homologia indica parentesco; analogia, não.
- Como identificar: Pistas: 'mesma origem embrionária', 'mesma função', 'estrutura atrofiada', 'convergência'. Mesma origem: homólogo. Só a mesma função: análogo.
- Exemplo: Braço humano, asa de morcego e nadadeira de baleia são homólogos. Asa de inseto e asa de ave são análogas.
- Caderno: `homólogo: mesma origem (função igual ou não)` / `análogo: origem diferente, mesma função` / `convergência: ambiente igual → formas parecidas` / `vestigial: estrutura reduzida (pelve da baleia)`
- Cuidado: Forma parecida por convergência, como a de golfinho e tubarão, não indica parentesco próximo.

### B11.2 · Lamarck × Darwin
- O que é: Lamarck propôs o uso e desuso e a herança do que foi adquirido. Darwin propôs que a variação já existe e a seleção natural favorece os mais aptos.
- Como identificar: Pistas: 'para se adaptar', 'por necessidade', 'esforço', 'variação preexistente'. Mudança adquirida na vida e transmitida: Lamarck. Seleção entre variantes: Darwin.
- Exemplo: Girafa: para Lamarck, esticou o pescoço e passou isso aos filhos. Para Darwin, as de pescoço longo já existiam e deixaram mais descendentes.
- Caderno: `Lamarck: uso e desuso + herança do adquirido` / `Darwin: variação → seleção natural` / `teoria sintética: + mutação e recombinação` / `em comum: as espécies mudam ao longo do tempo`
- Cuidado: Em Darwin o ambiente não cria a variação: ele seleciona a que já existia.

### B11.2 · Tipos de seleção natural
- O que é: A seleção natural pode favorecer o meio da distribuição ou um dos extremos. O resultado aparece na curva de fenótipos da população.
- Como identificar: Pistas: gráfico de frequência antes e depois. Curva estreita no centro: estabilizadora. Curva deslocada: direcional. Dois picos: disruptiva.
- Exemplo: Bebês muito leves ou muito pesados sobrevivem menos: seleção estabilizadora. Insetos resistentes a inseticida aumentam: seleção direcional.
- Caderno: `estabilizadora: favorece o intermediário` / `direcional: favorece um extremo` / `disruptiva: favorece os dois extremos` / `adaptação: resultado da seleção, não intenção`
- Cuidado: A seleção natural age sobre indivíduos, mas quem evolui é a população.

### B11.3 · Deriva e fluxo gênico
- O que é: Deriva genética é a mudança das frequências de alelos por acaso, forte em populações pequenas. Fluxo gênico é a troca de alelos por migração.
- Como identificar: Pistas: 'poucos indivíduos', 'catástrofe', 'ilha colonizada', 'migração'. Mudança de frequência sem vantagem adaptativa: deriva.
- Exemplo: Efeito do fundador: os amish da Pensilvânia têm alta frequência da rara síndrome de Ellis-van Creveld. Corredores ecológicos aumentam o fluxo gênico.
- Caderno: `variabilidade: mutação e recombinação` / `deriva: acaso (gargalo, efeito do fundador)` / `fluxo gênico: migração aproxima populações` / `sem fluxo gênico: populações divergem`
- Cuidado: Deriva não favorece o mais apto: um alelo vantajoso pode até sumir por acaso.

### B11.4 · Equilíbrio de Hardy-Weinberg
- O que é: Numa população grande, com cruzamentos ao acaso e sem fatores evolutivos, as frequências de alelos não mudam. É a referência para medir evolução.
- Como identificar: Pistas: 'frequência do alelo', 'heterozigotos', 'portadores', 'população em equilíbrio'. Comece por q², a fração com fenótipo recessivo.
- Exemplo: Se uma doença recessiva atinge 1 em 10 000: q² = 0,0001, q = 0,01 e p = 0,99. Portadores: 2pq ≈ 0,0198, quase 2%.
- Caderno: `p + q = 1` / `p² + 2pq + q² = 1` / `q = √(fração de recessivos)` / `sem mutação, seleção, migração e deriva`
- Cuidado: O fenótipo dominante é p² + 2pq, não só p²; parta sempre de q².

### B11.5 · Especiação e isolamento
- O que é: Especiação é a formação de novas espécies. Na alopátrica, uma barreira geográfica separa populações, que divergem até o isolamento reprodutivo.
- Como identificar: Pistas: 'rio', 'ilha', 'montanha', 'híbrido estéril', 'sem fluxo gênico'. Isolamento geográfico sozinho não basta: precisa surgir isolamento reprodutivo.
- Exemplo: A mula, filha de égua com jumento, é estéril: cavalo e jumento são espécies diferentes. Peixes em bacias separadas divergem por especiação alopátrica.
- Caderno: `alopátrica: barreira geográfica → divergência` / `simpátrica: sem barreira (ex.: poliploidia)` / `pré-zigótico: comportamento, época, órgãos` / `pós-zigótico: híbrido inviável ou estéril`
- Cuidado: Populações separadas que, ao se reencontrar, geram híbridos férteis ainda são da mesma espécie.

### B11.5 · Irradiação adaptativa
- O que é: Na irradiação adaptativa, um ancestral origina várias espécies adaptadas a ambientes diferentes. Cladogênese divide uma linhagem; anagênese a modifica sem dividir.
- Como identificar: Pistas: 'ancestral comum', 'diversos nichos', 'tentilhões'. Muitas espécies diferentes a partir de um mesmo grupo: irradiação adaptativa.
- Exemplo: Os tentilhões de Galápagos, com bicos para sementes, insetos ou cactos, vieram de um ancestral do continente.
- Caderno: `irradiação: 1 ancestral → muitas formas` / `convergência: ancestrais diferentes → formas parecidas` / `cladogênese: ramifica | anagênese: muda sem ramificar`
- Cuidado: Irradiação adaptativa gera estruturas homólogas; convergência gera estruturas análogas.

### B11.5 · Origem da vida
- O que é: A biogênese afirma que todo ser vivo vem de outro ser vivo. A hipótese de Oparin e Haldane propõe que moléculas orgânicas surgiram de gases da Terra primitiva.
- Como identificar: Pistas: 'frasco pescoço de cisne', 'descargas elétricas', 'atmosfera primitiva', 'coacervados'. Miller e Urey testaram a hipótese de Oparin e Haldane.
- Exemplo: Pasteur ferveu caldo em frasco com pescoço de cisne, e nada cresceu. Miller obteve aminoácidos de gases simples submetidos a faíscas elétricas.
- Caderno: `geração espontânea (refutada) × biogênese` / `Redi e Pasteur: refutaram a geração espontânea` / `Miller-Urey (1953): CH₄, NH₃, H₂, H₂O → aa` / `primeiros seres: procariontes, ≈ 3,5 bilhões de anos`
- Cuidado: Miller não criou vida: obteve moléculas orgânicas, como aminoácidos, a partir de gases simples.

## B12 — Diversidade dos seres vivos (13 cartões)

### B12.1 · Vírus
- O que é: Vírus são acelulares: ácido nucleico (DNA ou RNA) envolto por um capsídeo de proteína. Só se multiplicam dentro de células: são parasitas intracelulares obrigatórios.
- Como identificar: Pistas: 'capsídeo', 'envelope', 'receptor', 'transcriptase reversa'. O vírus infecta a célula cujo receptor encaixa em suas proteínas de superfície.
- Exemplo: O SARS-CoV-2 se liga ao receptor ACE2. O HIV é um retrovírus: a transcriptase reversa faz DNA a partir do RNA viral.
- Caderno: `vírus: ácido nucleico + capsídeo (+ envelope)` / `sem metabolismo: usa ribossomos e ATP da célula` / `retrovírus (HIV): RNA → DNA (transcriptase reversa)` / `cultivo para vacina: ovos embrionados ou células`
- Cuidado: Nem todo vírus de RNA é retrovírus: o coronavírus copia RNA em RNA, sem passar por DNA.

### B12.1 · Bactérias
- O que é: Bactérias são procariontes: não têm núcleo delimitado nem organelas membranosas. Reproduzem-se por divisão binária e trocam genes por conjugação, transformação e transdução.
- Como identificar: Pistas: 'nucleoide', 'plasmídeo', 'bipartição', 'peptidoglicano'. Ausência de envoltório nuclear é a marca de procarionte.
- Exemplo: Em condições ideais, a E. coli se divide a cada 20 minutos. Plasmídeos com genes de resistência passam de uma bactéria a outra.
- Caderno: `DNA circular no nucleoide + plasmídeos` / `ribossomos; parede de peptidoglicano` / `bipartição: gera clones` / `conjugação, transformação, transdução: recombinam`
- Cuidado: Bipartição gera clones; a variabilidade das bactérias vem de mutações e da troca de genes.

### B12.2 · Protistas
- O que é: Protistas são eucariontes simples: protozoários, heterótrofos, e algas, autótrofas. As algas formam a base das cadeias aquáticas.
- Como identificar: Pistas: 'vacúolo contrátil', 'água doce', 'maré vermelha', 'clorofíceas'. O vacúolo contrátil expulsa a água que entra sem parar por osmose.
- Exemplo: O paramécio de água doce bombeia água para fora pelo vacúolo contrátil. Dinoflagelados em excesso causam a maré vermelha.
- Caderno: `protozoário: heterótrofo (ameba, paramécio)` / `vacúolo contrátil: osmorregulação em água doce` / `algas: fotossíntese (diatomáceas, dinoflagelados)` / `algas verdes: clorofilas a e b, reserva de amido`
- Cuidado: Se o vacúolo contrátil é inibido em água doce, a célula incha e pode estourar.

### B12.2 · Fungos e liquens
- O que é: Fungos são eucariontes heterótrofos: digerem o alimento fora do corpo e absorvem os nutrientes. Têm parede de quitina e guardam glicogênio.
- Como identificar: Pistas: 'hifas', 'micélio', 'quitina', 'decompositor', 'cogumelo'. Parede com quitina e glicanas indica fungo.
- Exemplo: O champignon é o corpo de frutificação de um basidiomiceto; o micélio fica no solo. As aranhas também digerem a presa fora do corpo.
- Caderno: `eucarionte, heterótrofo por absorção` / `parede de quitina; reserva de glicogênio` / `papéis: decompositor, fermentação, micoses` / `líquen: fungo + alga ou cianobactéria (mutualismo)`
- Cuidado: Fungo não faz fotossíntese, mas sintetiza suas próprias proteínas e carboidratos a partir do que absorve.

### B12.3 · Tecidos vegetais
- O que é: Os tecidos vegetais se dividem por função: meristemas, revestimento, parênquimas, sustentação e condução. O esclerênquima tem células mortas com lignina.
- Como identificar: Pistas: 'células mortas lignificadas', 'textura arenosa', 'reserva de amido', 'endosperma'. Sustentação com células mortas e lignificadas: esclerênquima.
- Exemplo: Os grãozinhos da pera são esclereídes, do esclerênquima. O endosperma do milho guarda o amido que nutre o embrião.
- Caderno: `meristema: divisão celular (crescimento)` / `parênquima: fotossíntese, reserva, preenchimento` / `colênquima: vivo | esclerênquima: morto, lignina` / `epiderme e súber: revestimento`
- Cuidado: Colênquima é vivo e flexível, comum em órgãos jovens; esclerênquima é morto e rígido.

### B12.3 · Xilema e floema
- O que é: O xilema leva água e sais da raiz às folhas. O floema leva açúcares das folhas (fonte) aos órgãos que consomem ou armazenam (dreno).
- Como identificar: Pistas: 'seiva bruta', 'seiva elaborada', 'anel de Malpighi', 'pulgões', 'árvore alta'. O pulgão suga o floema; a água sobe pelo xilema.
- Exemplo: Retirar um anel da casca remove o floema: o açúcar não chega às raízes, que morrem. A água sobe ao topo das árvores puxada pela transpiração.
- Caderno: `xilema: células mortas, lignina; seiva bruta` / `floema: células vivas; seiva elaborada, fonte → dreno` / `tensão-coesão: a transpiração puxa a coluna de água` / `anel de Malpighi: corta o floema; a raiz morre`
- Cuidado: A pressão de raiz existe, mas é pequena; a água sobe principalmente puxada pela transpiração das folhas.

### B12.3 · Alternância de gerações
- O que é: As plantas alternam uma geração haploide, o gametófito, e uma diploide, o esporófito. Os esporos se formam por meiose no esporófito.
- Como identificar: Pistas: 'musgo', 'samambaia', 'esporângio', 'cápsula', 'prótalo'. Nas briófitas domina o gametófito; nos demais grupos, o esporófito.
- Exemplo: No musgo, a haste com cápsula sobre a planta verde é o esporófito. A samambaia que vemos é o esporófito; o prótalo é o gametófito.
- Caderno: `esporófito (2n) → meiose → esporos (n)` / `esporo → gametófito (n) → gametas por mitose` / `briófitas: gametófito é a fase duradoura` / `demais plantas: esporófito é a fase duradoura`
- Cuidado: Nas plantas, a meiose forma esporos, não gametas; os gametas surgem por mitose no gametófito.

### B12.4 · Estômatos e transpiração
- O que é: Estômatos são poros da folha controlados por duas células-guarda. Abrem quando elas ganham água e ficam túrgidas; fecham quando perdem água.
- Como identificar: Pistas: 'K⁺', 'turgor', 'meio-dia', 'ácido abscísico', 'cutícula'. Entrada de K⁺ atrai água e abre o estômato; saída de K⁺ o fecha.
- Exemplo: Em dia quente e seco, a planta fecha os estômatos para não murchar, mesmo perdendo a entrada de CO₂.
- Caderno: `K⁺ entra → água entra → célula-guarda túrgida → abre` / `K⁺ sai → água sai → célula-guarda flácida → fecha` / `abrem: luz, pouco CO₂, água disponível` / `fecham: falta de água (ácido abscísico)`
- Cuidado: A parte aérea perde água pelos estômatos e pela cutícula; a perda estomática é a maior.

### B12.4 · Hormônios vegetais
- O que é: Hormônios vegetais controlam crescimento, floração, amadurecimento e respostas ao ambiente. Os principais são auxina, giberelina, citocinina, etileno e ácido abscísico.
- Como identificar: Pistas: 'curva para a luz', 'amadurecer', 'gás', 'dominância apical', 'dormência'. Gás que amadurece frutos: etileno.
- Exemplo: Banana madura junto com verdes acelera o amadurecimento, porque libera etileno. A planta na janela se curva para a luz por causa da auxina.
- Caderno: `auxina: alonga célula; fototropismo; dominância apical` / `giberelina: alonga caule; germinação` / `citocinina: divisão celular; retarda envelhecimento` / `etileno (gás): amadurece | ABA: fecha estômato`
- Cuidado: No fototropismo, a auxina se acumula no lado sombreado, que cresce mais e curva o caule para a luz.

### B12.4 · Fotoperiodismo
- O que é: Fotoperiodismo é a resposta da planta à duração da noite. Planta de dia curto floresce com noites longas; planta de dia longo, com noites curtas.
- Como identificar: Pistas: 'noite crítica', 'flash de luz à noite', tabela de tratamentos. Se um flash no meio da noite muda o resultado, a planta mede a noite contínua.
- Exemplo: O crisântemo é planta de dia curto e floresce no outono. Produtores interrompem a noite com luz para atrasar sua floração.
- Caderno: `dia curto: noite > noite crítica → floresce` / `dia longo: noite < noite crítica → floresce` / `neutra: não depende do fotoperíodo` / `pigmento receptor: fitocromo`
- Cuidado: A planta mede a noite contínua, não o dia: um flash no escuro faz a noite contar como curta.

### B12.5 · Novidades dos invertebrados
- O que é: Cada grupo de invertebrados traz novidades: tecidos, simetria bilateral, tubo digestório completo, celoma, segmentação e exoesqueleto.
- Como identificar: Pistas: 'diblástico', 'cefalização', 'boca e ânus', 'apêndices articulados', 'antenas'. Liste as características e ache o primeiro grupo que tem todas.
- Exemplo: Inseto: 3 pares de patas e 1 par de antenas. Aranha: 4 pares de patas e nenhuma antena. Camarão: 2 pares de antenas.
- Caderno: `poríferos: sem tecidos | cnidários: tecidos, radial` / `platelmintos: bilateral, cefalização` / `nematoides: tubo completo (boca e ânus)` / `anelídeos: segmentos | artrópodes: exoesqueleto`
- Cuidado: Platelmintos já têm simetria bilateral, mas o tubo digestório é incompleto: a boca também serve de saída.

### B12.6 · Vertebrados
- O que é: Cordados têm notocorda, tubo nervoso dorsal, fendas faríngeas e cauda pós-anal. Entre os vertebrados surgem crânio, vértebras, mandíbula, patas e ovo amniótico.
- Como identificar: Pistas: 'âmnio', 'ovo com casca', 'respiração cutânea', 'endotermia', 'circulação'. Bolsa com líquido que protege o embrião de choques e dessecação: âmnio.
- Exemplo: O sapo respira também pela pele, mantida úmida pelo muco. Aves e mamíferos são endotérmicos e têm coração com quatro cavidades.
- Caderno: `peixes: 1 átrio + 1 ventrículo (circulação simples)` / `anfíbios: 2 átrios + 1 ventrículo (há mistura)` / `aves, mamíferos e crocodilianos: 4 cavidades` / `amniotas: âmnio, córion, alantoide, saco vitelínico`
- Cuidado: A alantoide acumula excretas e faz trocas gasosas; quem protege contra choques e dessecação é o âmnio.

### B12.6 · Classificação e cladogramas
- O que é: A classificação usa categorias: reino, filo, classe, ordem, família, gênero e espécie. O nome científico tem duas partes: gênero e epíteto específico.
- Como identificar: Pistas: cladograma, 'grupo-irmão', 'ancestral comum', 'nome científico'. O parentesco se lê pelo nó comum mais recente, não pela vizinhança das pontas.
- Exemplo: Homo sapiens: gênero com inicial maiúscula, epíteto em minúscula, tudo em itálico. Num cladograma com escala de tempo, ramos que se sobrepõem no tempo indicam espécies contemporâneas.
- Caderno: `reino > filo > classe > ordem > família > gênero` / `binomial: Gênero epíteto (em itálico)` / `cladograma: cada nó = um ancestral comum` / `5 reinos: Monera, Protista, Fungi, Plantae, Animalia`
- Cuidado: Ramos vizinhos no desenho não são, por isso, mais aparentados; vale o nó comum mais recente.

## Fontes
- OpenStax Biology 2e (openstax.org/books/biology-2e): cap. 3 (macromoléculas), 4–5 (célula, membrana, transporte), 6.5 (enzimas), 7 (respiração, fermentação, 7.4 rendimento de ATP), 8 (fotossíntese), 10 (ciclo celular, câncer), 11 (meiose), 12–13 (Mendel, linkage, epistasia), 14–17 (DNA, transcrição, tradução, regulação, biotecnologia), 18–19 (evolução, especiação, genética de populações), 21–22 (vírus, procariontes), 23–24 (protistas, fungos), 25–26 e 30–32 (plantas, transporte, hormônios, fotoperiodismo), 27–29 (animais), 33–43 (fisiologia animal), 44–47 (ecologia).
- OpenStax Anatomy & Physiology 2e: 22.5 (transporte de gases; ~70% do CO₂ como bicarbonato; efeito Bohr), 23 (digestão), 25 (rim, ADH, aldosterona), 17 (endócrino), 18–19 (sangue, coração).
- Rendimento de ATP (30–32 por glicose; fosforilação oxidativa 26–28): OpenStax Biology 2e 7.4; JoVE 'ATP yield from glucose catabolism' (jove.com/science-education/v/11008).
- Efeito do fundador nos amish (síndrome de Ellis-van Creveld): en.wikipedia.org/wiki/Ellis–van_Creveld_syndrome e referências; McKusick et al. 1964.
- Transporte de CO₂: iu.pressbooks.pub/humanphys/chapter/carbon-dioxide-transport; uen.pressbooks.pub/anatomyphysiology (Transport of Gases, baseado em OpenStax A&P).
- Cerrado (raízes profundas, casca grossa e fogo): ICMBio, 'Colorindo o aprender: Cerrado' (gov.br/icmbio).
- Transmissão de dengue e de Chagas, absorção de N pelas plantas: mesmas fontes da revisão de 29/10 (CDC; SESA-PR/Ministério da Saúde; PMC10441927).
- Gabaritos do próprio banco usados como âncora de convenção (ex.: W3c46baa 30–32 ATP; W12223ba 26–28; W2b40243 Krebs por volta; W6b81b3f pirâmide invertida; P2b8819d 2 : 1 : 1; P5c11987 linkage 8 UR).
