# Biologia: os 50 flashcards de maior retorno (29/10)

Pedido do Vitor (BRIEF_FLASH50). Backups: `bio/index.html.bak_flash50` e `bio/dados.json.bak_flash50`. Verificação: JSON válido, index.html = dados.json, banco/teoria/nomesub/glossario/areas idênticos ao backup, HTML fora do bloco de dados idêntico, só 'flash' mudou (156 → 50).

## 1. Método

1. **Banco de provas reais.** Do D['banco'] (500 questões) saem 312 de sites (Brasil Escola 200, Mundo Educação 112). Ficam 188 de provas: Unesp 60, Santa Casa 42, Fatec 29, Fuvest 27, Einstein 23, São Camilo 7. Duas questões da São Camilo estão em dobro no banco (mesmo enunciado com ids diferentes); sem as repetições ficam **186** questões únicas e **5 da São Camilo**.
2. **Pesos da contagem:** São Camilo × 3; provas de 2021 em diante × 1,5; Fatec × 0,5 (é prova técnica, não de Medicina). A 'ideia cobrada' de cada questão veio do campo `conceito`, lido questão a questão.
3. **Complemento:** as 7 questões de biologia da São Camilo 2024/2 (Prova I e II) e a biologia da Santa Casa 2027, levantadas caderno a caderno em `/home/claude/sc/v4bio/REVISAO5_CONJUNTO.md`; os pesos por área de `/home/claude/sc/v4bio/TAXONOMIA_BIO.md` (99 questões de Medicina 2021–2026); e as estatísticas de cursinhos da seção 3.
4. **Escolha:** uma ideia por cartão, a mais cobrada de cada conteúdo. Onde a ideia cobrada não tinha cartão, reescrevi um existente (mesmo id) ou criei um novo; o conteúdo foi conferido com fonte.
5. **Ordem e peso:** pela incidência ponderada (com prioridade para o que a São Camilo cobrou), peso 3 nos 20 primeiros e 2 nos outros 30.

## 2. Incidência no banco (provas reais, sem repetições)

| conteúdo | nome | questões | peso ponderado | São Camilo |
|---|---|---:|---:|---:|
| B06.6 | linkage e permuta, epistasia, pleiotropia e herança quantitativa | 6 | 11.0 | 1 |
| B09.6 | biomas brasileiros e impactos | 8 | 10.5 |  |
| B12.6 | vertebrados, classificação, nomenclatura e filogenia | 7 | 8.5 |  |
| B08.6 | imunidade inata e adaptativa, vacina × soro e memória imunológica | 7 | 8.0 |  |
| B05.6 | biotecnologia: PCR, eletroforese, DNA recombinante, transgênicos, CRISPR e clonagem | 7 | 7.8 |  |
| B11.5 | especiação, isolamento reprodutivo, irradiação adaptativa e origem da vida | 6 | 7.5 |  |
| B12.1 | vírus e bactérias: estrutura, ciclos e reprodução | 6 | 7.5 |  |
| B09.4 | relações ecológicas | 3 | 7.0 | 1 |
| B04.4 | gametogênese, não disjunção e aneuploidias | 6 | 7.0 |  |
| B05.5 | regulação da expressão gênica: fatores de transcrição e diferenciação celular | 3 | 6.5 | 1 |
| B11.2 | Lamarck × Darwin, seleção natural e adaptação | 5 | 6.5 |  |
| B12.3 | tecidos vegetais, xilema | 3 | 6.0 | 1 |
| B12.2 | protistas e fungos | 5 | 5.8 |  |
| B08.7 | ciclo menstrual, fecundação, clivagem e folhetos embrionários | 4 | 5.5 |  |
| B04.5 | apoptose e câncer | 5 | 5.5 |  |
| B07.3 | ventilação pulmonar, hematose e controle da respiração | 5 | 5.5 |  |
| B05.4 | mutações: pontual, frameshift e cromossômica | 4 | 5.5 |  |
| B07.5 | sangue, coagulação e pressão arterial | 4 | 5.5 |  |
| B06.4 | dominância incompleta, codominância, alelos múltiplos, sistema ABO e fator Rh | 5 | 5.5 |  |
| B02.4 | enzimas: sítio ativo, especificidade e fatores da atividade | 2 | 5.5 | 1 |
| B05.3 | código genético e tradução | 4 | 5.0 |  |
| B03.6 | fatores limitantes, plantas C4 e CAM, fotorrespiração e quimiossíntese | 4 | 5.0 |  |
| B07.2 | digestão, absorção intestinal, fígado e pâncreas | 4 | 4.8 |  |
| B10.3 | protozooses e seus vetores | 4 | 4.5 |  |
| B01.6 | núcleo, cromatina, citoesqueleto, cílios e flagelos | 3 | 4.5 |  |
| B06.5 | herança ligada ao sexo | 3 | 4.5 |  |
| B09.1 | cadeias e teias alimentares, níveis tróficos | 4 | 4.5 |  |
| B10.5 | profilaxia, saneamento, imunização e ISTs | 3 | 4.0 |  |
| B03.4 | fermentação láctica e alcoólica | 4 | 4.0 |  |
| B04.3 | meiose e crossing-over | 3 | 3.5 |  |
| B06.1 | 1ª lei de Mendel, segregação e probabilidade em cruzamentos | 3 | 3.5 |  |
| B01.3 | envoltórios e comparação celular | 3 | 3.5 |  |
| B09.3 | ciclos biogeoquímicos | 3 | 3.5 |  |
| B01.4 | sistema de endomembranas | 3 | 3.5 |  |
| B03.5 | fotossíntese: fase fotoquímica e ciclo de Calvin | 3 | 3.5 |  |
| B10.2 | bacterioses e resistência bacteriana | 2 | 3.0 |  |
| B11.4 | equilíbrio de Hardy-Weinberg | 2 | 3.0 |  |
| B10.4 | verminoses: ciclos e via de entrada | 3 | 3.0 |  |
| B07.6 | néfron, formação da urina e equilíbrio hidrossalino | 3 | 3.0 |  |
| B09.5 | sucessão ecológica e dinâmica de populações | 2 | 2.5 |  |
| B01.1 | membrana plasmática e transporte passivo | 2 | 2.5 |  |
| B02.2 | carboidratos e lipídios | 2 | 2.2 |  |
| B06.2 | 2ª lei de Mendel e segregação independente | 2 | 2.0 |  |
| B10.1 | viroses e arboviroses | 2 | 1.5 |  |
| B11.3 | variabilidade, deriva genética, efeito do fundador e fluxo gênico | 1 | 1.5 |  |
| B08.3 | sistema nervoso autônomo e arco reflexo | 1 | 1.5 |  |
| B01.5 | mitocôndria, cloroplasto e endossimbiose | 1 | 1.5 |  |
| B12.4 | estômatos, transpiração, hormônios vegetais e fotoperiodismo | 1 | 1.5 |  |
| B04.1 | ciclo celular, intérfase e pontos de checagem | 1 | 1.5 |  |
| B12.5 | invertebrados: novidades evolutivas | 1 | 1.5 |  |
| B08.5 | hormônios: insulina e glucagon, tireoide, cortisol e adrenalina | 2 | 1.5 |  |
| B02.3 | proteínas: estrutura e desnaturação | 2 | 1.5 |  |
| B05.1 | DNA: estrutura, pareamento e replicação semiconservativa | 1 | 1.0 |  |
| B09.2 | fluxo de energia, regra dos 10% e pirâmides ecológicas | 1 | 1.0 |  |
| B05.2 | transcrição e processamento do RNA | 1 | 0.5 |  |
| B07.4 | coração e as duas circulações | 1 | 0.5 |  |

Sem nenhuma questão de prova no banco: B01.2, B02.1, B02.5, B03.1, B03.2, B03.3, B04.2, B06.3, B07.1, B08.1, B08.2, B08.4, B11.1.

Por módulo (peso ponderado do banco × cartões escolhidos):

| módulo | peso | cartões |
|---|---:|---:|
| B12 Seres vivos e botânica | 30.8 | 7 |
| B09 Ecologia | 29.0 | 8 |
| B06 Genética clássica | 26.5 | 7 |
| B05 Genética molecular | 26.2 | 3 |
| B07 Fisiologia I | 19.2 | 2 |
| B11 Evolução | 18.5 | 5 |
| B04 Divisão celular | 17.5 | 3 |
| B08 Fisiologia II, imunologia e reprodução | 16.5 | 5 |
| B10 Doenças humanas | 16.0 | 5 |
| B01 Citologia | 15.5 | 2 |
| B03 Metabolismo energético | 12.5 | 2 |
| B02 Bioquímica | 9.2 | 1 |

## 3. Fontes externas (incidência por assunto)

- Aprova Total, *O que mais cai na Fuvest* (provas 2012–2026): Ecologia 24,8%, Microbiologia 10,2%, Genética 9,6%, Botânica 8,3%, Zoologia 7,0%. https://aprovatotal.com.br/o-que-mais-cai-na-fuvest/
- Estratégia Vestibulares, *Assuntos que mais caem na Unesp* (1ª fase 2011–2021): Ecologia 14,37%, Citologia 13,77%, Fisiologia humana 11,98%, Biologia vegetal 11,38%, Doenças humanas 7,78%, Evolução 7,19%, Biologia animal 6,59%, Genética 5,99%. https://vestibulares.estrategia.com/portal/enem-e-vestibulares/vestibulares/assuntos-que-mais-caem-na-unesp-vestibular
- Estratégia Vestibulares, *Fuvest: o que estudar em Biologia* (sem números): ecologia, citologia, genética, fisiologia, biologia animal comparada. https://vestibulares.estrategia.com/portal/enem-e-vestibulares/fuvest-o-que-estudar-para-a-prova-de-biologia-do-vestibular-da-usp/
- Sistema Positivo via ABC do ABC, *ENEM, últimos cinco anos* (sem números): ecologia, genética, evolução, fisiologia/citologia, programas de saúde. https://abcdoabc.com.br/biologia-quais-os-temas-mais-abordados-no-enem-nos-ultimos-cinco-anos/
- Projeto (disco): TAXONOMIA_BIO.md, 99 questões de Medicina 2021–2026 (Einstein, Santa Casa, Famema, São Camilo): genética 23, citologia 17, fisiologia 14, microbiologia 11, ecologia 11, botânica 11, evolução 9, zoologia 3. REVISAO5_CONJUNTO.md: São Camilo 2024/2 (fóssil, maré vermelha, musgo, enzimas, diferenciação, herança quantitativa, ABO) e Santa Casa 2027 2º dia (basidiomiceto, ciclo do N, terapia gênica, mimetismo, fotoperiodismo, enfisema, linkage, código genético).
- Para conferir o conteúdo dos cartões novos ou reescritos: OpenStax Biology 2e (cap. 25–26, plantas; 19.2, Hardy-Weinberg); OpenStax Anatomy & Physiology 2e, 23.7 (enzimas digestivas e pH); NOAA Coastal Science (maré vermelha por dinoflagelado, *Karenia brevis*; nutrientes); UFRGS/Embrapa (arenização no sudoeste do RS, bioma Pampa: lume.ufrgs.br/handle/10183/225184). As contas da f135 foram refeitas: 0,01² = 0,0001; 2 × 0,99 × 0,01 = 0,0198.

**Leitura conjunta:** no banco, as provas de Medicina pesam genética (B05+B06), evolução (B11) e ecologia (B09). Os cursinhos põem ecologia em 1º lugar na Fuvest e na Unesp e dão peso grande a microbiologia/doenças e botânica. Os 50 cartões ficaram assim: genética 13 (B04, B05 e B06), ecologia 8, doenças e vírus 7 (B10 + f142/f143), evolução 6 (B11 + cladograma), botânica 4, fisiologia, imunologia e reprodução 7, citologia, bioquímica e metabolismo 5. Bioquímica e metabolismo entraram só onde há questão (enzimas, ponto de compensação, fermentação).

## 4. Os 50, em ordem (peso 3 = 1 a 20)

| # | id | peso | conteúdo | frente | por que entrou |
|---:|---|:-:|---|---|---|
| 1 | bio-f056 | 3 | B05.5 | Neurônio e célula do fígado de uma pessoa têm o mesmo DNA? O que os torna diferentes? | São Camilo 2024 (2 versões da mesma questão), Fuvest 2025 e Fatec 2017: diferenciação = mesmo genoma, expressão gênica diferente. Maior peso do banco (B05.5). |
| 2 | bio-f131 | 3 | B11.2 | Lamarck × Darwin: como cada um explica o pescoço longo das girafas? | Ideia mais repetida de evolução: Unesp 2024 (2x), Santa Casa 2022 e 2027, Einstein 2023, Fatec 2015 separam lamarckismo de seleção natural. |
| 3 | bio-f139 | 3 | B11.5 | Quais as etapas da especiação alopátrica? | B11.5 tem 6 questões (Fuvest 2024, Unesp 2022/2024, Santa Casa 2023, Einstein 2019, Fatec 2016), quase todas sobre isolamento geográfico e fluxo gênico. |
| 4 | bio-f096 | 3 | B08.6 | Vacina × soro: o que cada um contém e que tipo de imunização dá? | Fuvest 2019, Santa Casa 2019, Fatec 2016 e Unesp 2023: vacina (antígeno, ativa) × soro (anticorpo, passiva). Fuvest coloca microbiologia/vacinas em 2º lugar (10,2%). |
| 5 | bio-f076 | 3 | B07.2 | Em que órgão e em que pH ideal atuam a amilase salivar, a pepsina e a lipase pancreática? | REESCRITO. São Camilo 2024 (tabela de tubos com substrato e pH: enzimas específicas, cada uma no seu pH), Fuvest 2024 (atividade × pH) e Unesp 2015 (digestão ao longo do tubo). |
| 6 | bio-f020 | 3 | B02.4 | Como uma enzima acelera uma reação química? | São Camilo 2024 e Unesp 2018: enzima baixa a energia de ativação e não é consumida (a alternativa errada da São Camilo era 'aumentaram a energia de ativação'). |
| 7 | bio-f073 | 3 | B06.6 | Herança de vários genes com efeito aditivo sobre um caráter: qual o nome, o exemplo humano clássico e quantas classes há com n pares? | REESCRITO. São Camilo 2024 Q25 pediu o nome (quantitativa) e o exemplo (cor da pele); Santa Casa 2024 também cobrou. O cartão antigo só tinha a fórmula 2n + 1, que foi mantida no verso. |
| 8 | bio-f109 | 3 | B09.4 | Maré vermelha: que organismos a causam, que fator ambiental a desencadeia e que relação ecológica eles têm com os outros seres? | REESCRITO. São Camilo 2024 Q21 preencheu as três lacunas: algas, excesso de nutrientes, amensalismo. O cartão antigo só pedia a relação. |
| 9 | bio-f149 | 3 | B12.3 | Nas plantas, esporos e gametas se formam por meiose ou por mitose? No musgo, onde se formam os esporos? | AMPLIADO. São Camilo 2024 Q22 (musgo: esporos por meiose na cápsula). Grupos vegetais aparecem em 7 de 25 cadernos (Santa Casa, Einstein, São Camilo), segundo REVISAO5_CONJUNTO. |
| 10 | bio-f113 | 3 | B09.6 | O que é biomagnificação, e em que nível o poluente fica mais concentrado? | Einstein 2027 nomeou a biomagnificação e Unesp 2019 pediu o sentido do acúmulo de mercúrio. Ecologia é o 1º tema da Fuvest (24,8%) e da Unesp (14,4%). |
| 11 | bio-f066 | 3 | B06.4 | Pai do grupo A e mãe do grupo B têm um filho do grupo O. Quais os genótipos dos pais? | São Camilo 2024/2 Prova I Q04 (discursiva, tipagem ABO em bebês trocados), Fatec 2020 e Santa Casa 2021: deduzir genótipos ABO. |
| 12 | bio-f067 | 3 | B06.4 | Que antígenos (aglutinogênios) e anticorpos (aglutininas) tem o sangue do grupo O e o do grupo AB? | Santa Casa 2021 (deduzir o tipo pelas aglutininas do plasma) e Fatec 2016 (compatibilidade transfusional): antígenos × anticorpos do ABO. |
| 13 | bio-f062 | 3 | B06.1 | Casal Aa × Aa tem um filho normal. Qual a chance de esse filho ser heterozigoto? | Fuvest 2019 e 2023 usam o 2/3 do filho normal de pais heterozigotos para calcular risco. É a probabilidade condicional mais cobrada. |
| 14 | bio-f072 | 3 | B06.6 | No di-híbrido, as proporções 12 : 3 : 1 e 9 : 3 : 4 indicam qual fenômeno, e de que tipo cada uma? | Unesp 2022 (Bombaim, epistasia recessiva do loco H) e Einstein 2026 (epistasia dominante). B06.6 tem o maior peso de genética clássica. |
| 15 | bio-f071 | 3 | B06.6 | Num cruzamento-teste, 8% da prole é recombinante. Qual a distância entre os dois genes? | Santa Casa 2019, Unesp 2019 (permuta de 8%) e Santa Casa 2022: linkage e distância em unidades de recombinação. |
| 16 | bio-f143 | 3 | B12.1 | O que faz a transcriptase reversa do HIV? | Santa Casa 2025 (etapa inicial do retrovírus), Unesp 2019 (antirretroviral contra a transcrição reversa) e Einstein 2022 (coronavírus × retrovírus). |
| 17 | bio-f033 | 3 | B03.6 | O que é o ponto de compensação fótico? | Três questões de gráfico: Unesp 2018, Unesp 2022 e Santa Casa 2021, todas pelo ponto de compensação fótico. |
| 18 | bio-f043 | 3 | B04.4 | Qual o cariótipo das síndromes de Down, de Turner e de Klinefelter? | Fatec 2019 (Turner pelo cariótipo) e Einstein 2026 (aneuploidia × euploidia): reconhecer as síndromes numéricas. |
| 19 | bio-f039 | 3 | B04.3 | O que se separa na meiose I e o que se separa na meiose II? | Einstein 2019 (fase pela contagem de cromossomos), Santa Casa 2018 (DNA ao longo da meiose) e Unesp 2020 (X e Y se separam na meiose I). |
| 20 | bio-f121 | 3 | B10.3 | Qual o agente da malária e como ele é transmitido? | Einstein 2021 (ciclo do Plasmodium), Unesp 2018 (fármaco no ciclo) e Fuvest 2023 (profilaxia pelo vetor). Protozooses lideram 'doenças humanas' (7,8% na Unesp). |
| 21 | bio-f120 | 2 | B10.2 | Como surge uma população de bactérias resistente a um antibiótico? | Fuvest 2025: resistência = mutação ao acaso + seleção pelo antibiótico. A ideia também serve a evolução (Fuvest 2025 B11.3). |
| 22 | bio-f079 | 2 | B07.3 | O que é o efeito Bohr? | Fuvest 2023 (efeito Bohr) e Santa Casa 2020 (curva de saturação da hemoglobina). |
| 23 | bio-f138 | 2 | B11.5 | Qual o conceito biológico de espécie? | Santa Casa 2023 (fluxo gênico entre ilhas) e Einstein 2019 (híbridos férteis): conceito biológico de espécie. |
| 24 | bio-f142 | 2 | B12.1 | Por que os vírus são parasitas intracelulares obrigatórios? | Fatec 2014, Unesp 2023 (vírus cultivado em ovo embrionado) e Santa Casa 2021 (especificidade vírus-célula): parasitismo intracelular obrigatório. |
| 25 | bio-f097 | 2 | B08.6 | Por que a resposta imune à segunda exposição ao mesmo antígeno é mais rápida e intensa? | Santa Casa 2019 (resposta secundária) e Unesp 2020 (especificidade da memória): linfócitos de memória. |
| 26 | bio-f042 | 2 | B04.4 | Que célula a mulher libera na ovulação, e em que fase da divisão ela está parada? | Santa Casa 2024 (meiose II só termina após a fecundação) e Unesp 2015 (bloqueio da gametogênese). |
| 27 | bio-f099 | 2 | B08.7 | Que hormônio provoca a ovulação, e quando ela ocorre num ciclo de 28 dias? | Santa Casa 2025 e Einstein 2021: ler o gráfico hormonal do ciclo e localizar a ovulação pelo pico de LH. |
| 28 | bio-f114 | 2 | B09.6 | Qual a sequência da eutrofização de um lago? | Complementa a maré vermelha da São Camilo (excesso de nutrientes) e é a sequência de impacto ambiental mais pedida no ENEM e na Fuvest (impactos ambientais lideram ecologia). |
| 29 | bio-f158 | 2 | B09.6 | Planície que alaga na cheia, com fauna abundante; e campos nativos do Sul com arenização: que biomas são? | NOVO. Biomas brasileiros têm 8 questões (o maior B09). Santa Casa 2025 (regime de inundação = Pantanal) e Fuvest 2025 (campo nativo e arenização = Pampa) não tinham cartão. |
| 30 | bio-f115 | 2 | B09.6 | Árvores tortuosas de casca grossa, veredas com buritis e fogo frequente: que bioma é? | Unesp 2026 (veredas com buritis) e Fuvest 2019 (tabela de biomas): reconhecer o Cerrado. |
| 31 | bio-f135 | 2 | B11.4 | Uma doença autossômica recessiva atinge 1 em 10 000 pessoas, em equilíbrio de Hardy-Weinberg. Quais q, p e a frequência de portadores? | AMPLIADO (absorveu o f136). Unesp 2021 pediu exatamente a frequência de heterozigotos a partir do alelo; Einstein 2024 aplicou Hardy-Weinberg. |
| 32 | bio-f069 | 2 | B06.5 | Mulher portadora de hemofilia (XᴴXʰ) e homem normal: qual o risco para os filhos homens e para as filhas? | Unesp 2024 (daltonismo com ABO; marcador do Y) e Einstein 2025 (inativação do X): herança ligada ao X. |
| 33 | bio-f103 | 2 | B09.2 | Que fração da energia passa de um nível trófico ao seguinte, e para onde vai o resto? | Santa Casa 2020 (fluxo unidirecional e perda por respiração); regra dos 10% citada como distrator na mesma prova. |
| 34 | bio-f157 | 2 | B12.3 | Que novidade evolutiva surge em pteridófitas, gimnospermas e angiospermas, e qual geração domina nas briófitas? | NOVO. Grupos vegetais e alternância de gerações não tinham cartão; cobrados em Santa Casa 2019/2023/2025, Einstein 2016–2017 e São Camilo 2024. Botânica = 11% da prova de medicina (TAXONOMIA_BIO) e 11,4% da Unesp. |
| 35 | bio-f133 | 2 | B11.3 | O que é deriva genética, e em que populações ela é mais forte? | Fuvest 2025 (acaso na Teoria Sintética) e Einstein 2023 (oscilação gênica por catástrofe): deriva genética. |
| 36 | bio-f156 | 2 | B12.6 | Num cladograma, como se reconhece qual par de grupos tem parentesco mais próximo? | Einstein 2027 (cladograma de hominíneos) e Fuvest 2019 (cladograma dos cordados): leitura de cladograma. |
| 37 | bio-f054 | 2 | B05.4 | Por que inserir uma base costuma alterar mais a proteína do que substituir uma base? | Santa Casa 2025: inserção de um par de bases = mudança de quadro de leitura. |
| 38 | bio-f060 | 2 | B05.6 | Num clone por transferência nuclear, como a Dolly, de quem vêm o DNA nuclear e o mitocondrial? | Fuvest 2026 (na clonagem o núcleo define o genoma) e Santa Casa 2023 (clones sem variabilidade). |
| 39 | bio-f147 | 2 | B12.3 | Xilema × floema: o que cada um conduz e em que sentido? | Botânica de tecidos (B12.3: Fuvest 2019, Fatec 2015): o que xilema e floema conduzem é a base de qualquer questão de fisiologia vegetal. |
| 40 | bio-f152 | 2 | B12.4 | Planta de dia curto floresce em que condição? O que ela realmente mede? | Santa Casa 2027, 2º dia, discursiva de fotoperiodismo (REVISAO5_CONJUNTO); B12.4 aparece também na Unesp 2026. |
| 41 | bio-f007 | 2 | B01.3 | Qual o principal componente da parede celular de bactérias, de plantas e de fungos? | Fuvest 2020, Unesp 2015 e Unesp 2022 (glicanas e quitina = fungo): composição da parede por grupo. |
| 42 | bio-f001 | 2 | B01.1 | Na osmose, a água passa de qual meio para qual meio? | Santa Casa 2018 (tonicidade e volume da hemácia) e Santa Casa 2026 (protozoário em meio hipotônico). |
| 43 | bio-f106 | 2 | B09.3 | O que é nitrificação, e quais bactérias a fazem? | Fatec 2014 (todas as etapas do ciclo do N são bacterianas) e Santa Casa 2027 discursiva (ciclo do nitrogênio). |
| 44 | bio-f108 | 2 | B09.4 | Mutualismo × protocooperação: o que os diferencia? | Santa Casa 2023 (microbioma em equilíbrio e disbiose) e Unesp 2015 (cadeia de relações): relações ecológicas, 1º tema da Fuvest. |
| 45 | bio-f029 | 2 | B03.4 | Quais os produtos da fermentação alcoólica e que organismo a faz no pão? | Einstein 2020 (produtos e saldo da fermentação alcoólica) e Fatec 2023 (2 questões: pão e Pasteur). |
| 46 | bio-f124 | 2 | B10.4 | Como se adquire a esquistossomose, e qual o hospedeiro intermediário? | Santa Casa 2018 (ovo do Schistosoma saindo dos vasos mesentéricos) e Santa Casa 2026 (ciclo de helminto). |
| 47 | bio-f118 | 2 | B10.1 | Macacos mortos na mata alertam para qual doença? Eles a transmitem? | Fuvest 2020 (vigilância por morte de macacos) e Fatec 2018 (febre amarela silvestre × urbana). |
| 48 | bio-f127 | 2 | B10.5 | O que é imunidade coletiva (de rebanho)? | Fuvest 2026: proteção de quem não pode ser vacinado pela imunidade coletiva. |
| 49 | bio-f101 | 2 | B08.7 | Que folheto embrionário origina o sistema nervoso? | Santa Casa 2027 (tubo neural dorsal, folheto de origem e derivados): ectoderma. |
| 50 | bio-f100 | 2 | B08.7 | Por que não há menstruação durante a gravidez? | Fuvest 2019 (hormônios altos na gestação e queda após a saída da placenta): hCG mantém o corpo lúteo. |

## 5. Cartões novos ou alterados (texto final)

- **bio-f076** (B07.2, identificar). Frente: Em que órgão e em que pH ideal atuam a amilase salivar, a pepsina e a lipase pancreática? Verso: Amilase salivar: boca, pH neutro (≈ 7). Pepsina: estômago, pH ácido (≈ 2). Lipase pancreática: intestino delgado (duodeno), pH levemente alcalino (≈ 8). Cada enzima age sobre um substrato específico. Essencial: amilase salivar: boca, pH neutro; pepsina: estômago, pH ácido; lipase pancreática: intestino delgado, pH alcalino. Aceita: ptialina; duodeno; pH 7 / pH 2 / pH 8; básico. Erro comum: Achar que todas as enzimas digestivas trabalham no mesmo pH, ou pôr a pepsina no intestino.
- **bio-f073** (B06.6, conceito). Frente: Herança de vários genes com efeito aditivo sobre um caráter: qual o nome, o exemplo humano clássico e quantas classes há com n pares? Verso: Herança quantitativa (poligênica). Exemplo: cor da pele (também altura). Com n pares de genes aditivos surgem 2n + 1 classes fenotípicas; com 3 pares, 7. Essencial: herança quantitativa ou poligênica; cor da pele; 2n + 1. Aceita: poligenia; herança multifatorial aditiva; pigmentação da pele; estatura; altura. Erro comum: Confundir com alelos múltiplos (polialelia, como o ABO) ou usar 2ⁿ, que é o número de tipos de gameta.
- **bio-f109** (B09.4, identificar). Frente: Maré vermelha: que organismos a causam, que fator ambiental a desencadeia e que relação ecológica eles têm com os outros seres? Verso: Proliferação de algas, sobretudo dinoflagelados, favorecida pelo excesso de nutrientes na água. As toxinas liberadas prejudicam os outros seres sem ganho direto: amensalismo. Essencial: algas (dinoflagelados); excesso de nutrientes; amensalismo. Aceita: dinoflagelados; pirrófitas; eutrofização; antibiose; poluição por esgoto ou fertilizantes. Erro comum: Dizer que a causa são bactérias ou classificar a relação como comensalismo, predação ou parasitismo.
- **bio-f149** (B12.3, conceito). Frente: Nas plantas, esporos e gametas se formam por meiose ou por mitose? No musgo, onde se formam os esporos? Verso: Esporos por meiose, no esporófito (2n): no musgo, dentro da cápsula na ponta da haste. Gametas por mitose, no gametófito (n). Essencial: esporos: meiose; gametas: mitose; cápsula do esporófito. Aceita: meiose espórica; esporângio; esporófito e gametófito. Erro comum: Dizer que, nas plantas, os gametas se formam por meiose, como nos animais, ou que a cápsula do musgo faz gametas.
- **bio-f135** (B11.4, formula). Frente: Uma doença autossômica recessiva atinge 1 em 10 000 pessoas, em equilíbrio de Hardy-Weinberg. Quais q, p e a frequência de portadores? Verso: q² = 0,0001, logo q = 0,01 e p = 0,99. Portadores: 2pq = 2 × 0,99 × 0,01 = 0,0198, quase 2%. Essencial: q = 0,01; p = 0,99; 2pq ≈ 0,0198 (≈ 2%). Aceita: 1%; 99%; 1/100; 0,02; 1 em 50. Erro comum: Usar q = 0,0001, esquecendo que esse valor é q², ou calcular portadores como pq em vez de 2pq.
- **bio-f157** (B12.3, comparar). Frente: Que novidade evolutiva surge em pteridófitas, gimnospermas e angiospermas, e qual geração domina nas briófitas? Verso: Briófitas: sem vasos, gametófito dominante. Pteridófitas: vasos condutores (xilema e floema). Gimnospermas: sementes (nuas) e grão de pólen. Angiospermas: flores e frutos. Essencial: pteridófitas: vasos condutores; gimnospermas: sementes; angiospermas: flores e frutos; briófitas: gametófito dominante. Aceita: tecidos vasculares; semente nua; pólen; fruto protegendo a semente; fase n dominante. Erro comum: Atribuir sementes às pteridófitas ou dizer que o esporófito domina no musgo.
- **bio-f158** (B09.6, identificar). Frente: Planície que alaga na cheia, com fauna abundante; e campos nativos do Sul com arenização: que biomas são? Verso: Pantanal: planície inundável, com cheia e seca alternadas. Pampa: campos nativos do Rio Grande do Sul, com areais (arenização) no sudoeste do estado. Essencial: Pantanal; Pampa. Aceita: Campos Sulinos; Campanha Gaúcha; planície pantaneira. Erro comum: Confundir o Pampa com o Cerrado ou chamar a arenização de desertificação climática.

## 6. Os 106 que saíram (motivo)

Todos continuam nos backups `bak_flash50`. Motivo da saída: número de questões de prova no banco ou ideia já coberta por um cartão escolhido.

f002 hemólise: coberta pela f001; f003 difusão facilitada: 0 questões de prova; f004 plasmólise: coberta pela f001; f005 bomba Na/K: 0 questões; f006 comum pro/eucarionte: 1 questão (Einstein 2023), menos que parede; f008 via secretora: 0 questões diretas; f009 catalase: 1 questão (Santa Casa 2023); f010 endossimbiose: 0 questões diretas; f011 DNA mitocondrial: 1 questão (Unesp 2026); f012 nucléolo: 1 questão (Unesp 2024); f013 cílios 9+2: 0; f014 Fe/Mg: 0; f015 bócio: 0; f016 glicogênio: 0; f017 kcal/g: só Fatec; f018 ligação peptídica: Unesp 2016, coberta indiretamente; f019 desnaturação: 0 questões diretas; f021 temperatura: coberta pela f020/f076; f022 DNA × RNA: 0; f023 vitaminas: 0; f024 glicólise: 0; f025 Krebs/cadeia: 0; f026 origem do CO2: 0; f027 aceptor final: 0; f028 rendimento de ATP: Einstein 2020 coberta pela f029; f030 fermentação láctica: Unesp 2021 (1); f031 O2 da água: Unesp 2015 (1); f032 fases da fotossíntese: Einstein 2023 (1); f034 C4/CAM: 0 em 25 cadernos; f035 quimiossíntese: 0; f036 fase S: 1 (Santa Casa 2021); f037 metáfase: 0; f038 anáfase: 0; f040 crossing-over: coberto pela f071; f041 gametas por ovócito: coberto pela f042; f044 não disjunção: coberta pela f043; f045 p53: 0; f046 apoptose: 1 (Santa Casa 2020); f047 oncogene: 0 em 25 cadernos; f048 Chargaff: 1 (Fuvest 2020); f049 semiconservativa: 0; f050 transcrição: só Fatec 2018; f051 splicing: 1 (Einstein 2019); f052 64 códons: 0 direto; f053 código degenerado: 0 direto; f055 anemia falciforme: 0; f057 enzima de restrição: só Fatec 2020; f058 eletroforese: só Fatec 2020; f059 CRISPR: 0 em 25 cadernos; f061 3:1: base coberta pela f062; f063 menino afetado 1/8: coberto pela f062; f064 9:3:3:1: 2 questões, base coberta pelas f072/f073; f065 heredograma recessivo: 0 questões classificadas em B06.3; f068 eritroblastose: 0; f070 pai daltônico: coberto pela f069; f074 tecido muscular: 0; f075 bile: 0 direta; f077 inspiração: 0; f078 controle respiratório: 0 direto; f080 artéria pulmonar: 0; f081 grande circulação: 0; f082 coagulação: 0; f083 capilares: 1 (Santa Casa 2021); f084 eritropoetina: 1 (Unesp 2023); f085 etapas da urina: Fatec 2014; f086 ADH: 0; f087 potencial de ação: 0; f088 mielina: 0; f089 sinapse: 0; f090 simpático: 1 (Fuvest 2025); f091 arco reflexo: 0; f092 bócio/TSH: 0; f093 insulina/glucagon: só Fatec 2015; f094 diabetes 1×2: 0; f095 PTH: 1 (Unesp 2016); f098 HIV CD4: coberto pela f143; f102 produtor: trivial; f104 pirâmide de energia: coberta pela f103; f105 rizóbio: coberto pela f106/f108; f107 'pulmão do mundo': 1 (Unesp 2023); f110 exclusão competitiva: 0; f111 sucessão: 1 (Santa Casa 2018, sobre PPB e não sobre o tipo); f112 curvas J/S: 0 em 25 cadernos; f116 Amazônia: 1 (Unesp 2014); f117 Aedes: 1 (Unesp 2016); f119 antibiótico em virose: 0; f122 Chagas: 0; f123 teníase: 0 direto; f125 ancilostomose: só Fatec 2020; f126 leptospirose: 0; f128 sífilis: 1 (Fuvest 2021); f129 homólogos: 0; f130 convergência: 0; f132 tipos de seleção: 0; f134 efeito do fundador: coberto pela f133; f136 2pq: fundido na f135; f137 condições de H-W: 0 direto; f140 irradiação: 0; f141 Miller-Urey: 0; f144 vacúolo contrátil: coberto pela f001 (Santa Casa 2026); f145 fungos: 1 (Unesp 2023); f146 líquen: 1 (Unesp 2018); f148 tensão-coesão: só Fatec 2015; f150 etileno: 0; f151 auxina: 1 (Unesp 2026); f153 simetria bilateral: 0; f154 coração dos vertebrados: 1 (Santa Casa 2024); f155 âmnio: 1 (Unesp 2018).
