# Mapa das questões discursivas curtas: Medicina SP (Santa Casa, Einstein, Fuvest, Unesp)

Biologia, Química, Matemática e Português. Objetivo: escrever flashcards que treinem exatamente os pedidos que essas provas fazem.

Regra do projeto: nenhuma questão foi copiada. Os padrões estão descritos com palavras próprias, e cada item citado aparece em no máximo 10 palavras de paráfrase.

---

## 0. Como foi feito (método e fonte)

- **Fonte:** PDFs públicos do Curso Objetivo (prova + resolução comentada), baixados de `https://www.curso-objetivo.br/vestibular/resolucao-comentada/...`. Os nomes exatos dos arquivos vieram da API usada pelas próprias páginas do Objetivo (`sistemas.objetivo.br/ResolucaoComentadaApi/templates/prova/{código}`).
- **Extração:** `pdftotext -layout`. Um script separou cada questão em enunciado, pedidos a)/b)/c) e resolução. A contagem de verbos é automática: o script procura o comando no texto dos itens. Já a classificação de tema e de tipo de tarefa foi feita lendo cada item.
- **Tamanho da resposta:** número de palavras da resolução do Objetivo, por item (a, b ou c). Atenção: a resolução do Objetivo costuma ser **mais longa** do que o mínimo que a banca aceita. Os gabaritos oficiais ("respostas esperadas" da Vunesp e da Fuvest) **não** foram consultados.
- **Ano:** é o ano de ingresso escrito no arquivo. "2027" quer dizer prova aplicada em set./out. de 2026 (Santa Casa e Einstein 2027 já estão publicados e foram incluídos como bônus).
- **Corpus analisado:** 352 questões discursivas.

| Prova | Formato discursivo | Anos lidos | Bio | Quí | Mat | Port |
|---|---|---|---|---|---|---|
| Santa Casa, 2º dia | 20 questões, cada uma com 2 itens (a, b), e cada item com 2 perguntas | 2021–2027 (7) | 56 (Q1–8) | 28 (Q9–12) | — (não há) | 28 (Q17–20) |
| Einstein, Prova II | 5 discursivas (Bio, Quí, Fís, Mat, Inglês) + redação | 2021–2027 (7) | 7 (Q1) | 7 (Q2) | 7 (Q4) | — (não há; Português só na redação) |
| Unesp, 2ª fase | 36 discursivas + redação | 2024–2026 (3) | 9 (Q13–15) | 9 (Q16–18) | 9 (Q22–24) | 24 (Q25–32) |
| Fuvest, 2ª fase | Dia 1: 10 de Português. Dia 2: 6 por disciplina, com 3 itens (a, b, c) | 2021–2026 (6) | 36 (B01–06) | 36 (Q01–06) | 36 (M01–06) | 60 |

Observações importantes:
- **Unesp 2021–2023:** a 2ª fase era objetiva (gabarito de A a E), por isso ficou fora do mapa.
- **Fuvest, carreira de Medicina:** em 2024, Medicina-SP fazia Biologia, Física e Química no 2º dia (as 4 primeiras questões de cada). A partir de 2025, faz Biologia, Física, Geografia e Química (as 3 primeiras de cada). Fonte: Estratégia Vestibulares. **A Matemática da Fuvest não cai para Medicina**; entrou aqui só como referência de estilo.
- **Banca:** Santa Casa e Unesp são da **Vunesp**, e o estilo das duas é quase idêntico. Os moldes de cards servem para ambas.

---

## 1. BIOLOGIA

### 1.1 Verbos e pedidos (contagem automática nos itens)

| Pedido | Santa Casa (56) | Einstein (7) | Unesp (9) | Fuvest (36) |
|---|---|---|---|---|
| **Qual/Quais/Que…?** (nomear, identificar) | 89 | 9 | 14 | 36 |
| **Cite / aponte / dê exemplo** | 35 | 5 | 3 | 39 |
| **Por que…?** | 32 | 6 | 9 | 5 |
| **Como…?** (mecanismo, "como ocorre") | 20 | 3 | 1 | 12 |
| **Explique / explicite** | 13 | 3 | 2 | 13 |
| **Como é denominado / dê o nome** | 12 | 1 | 0 | 1 |
| **Justifique** | 6 | 1 | 1 | 24 |
| **Compare / relacione** | 6 | 1 | 2 | 13 |
| **Quantos/Quantas** (contagem: espécies, moléculas de DNA, células) | 6 | 0 | 1 | 1 |
| **Probabilidade** (cálculo) | 3 | 1 | 2 | 2 |
| **Desenhe/esboce/complete** (gráfico, tabela, teia) | 0 | 0 | 0 | 5 |

**Padrão Vunesp (Santa Casa e Unesp), muito estável.** Cada item (a ou b) junta **duas perguntas**:
1. uma de **nomeação**, respondida com um termo: "Qual organela…?", "Cite o hormônio…", "Como se denomina…?";
2. uma de **mecanismo**, respondida com uma frase causal: "Por que…?", "Como…?", "Explique…".

Uma questão típica fica assim: a) nomear + nomear (ou nomear + função); b) nomear + "por que". O "Por que" aparece em 7 de 7 anos na Santa Casa, quase sempre como **última pergunta do item b**.

**Padrão Einstein:** igual ao da Vunesp (duas perguntas por item), com mais peso em "explique" e em heredograma com probabilidade.

**Padrão Fuvest:** 3 itens (a, b, c) e muito "**Justifique sua resposta**" (24 vezes). A Fuvest também pede **produção gráfica** com frequência (desenhar uma curva, completar tabela, representar uma teia trófica) e sempre parte de **dados**: gráfico, hemograma, heredograma ou tabela.

### 1.2 Temas por prova e ano

**Santa Casa, Q1–Q8 (2021–2027).** Uma questão pode contar em duas áreas.

| Área | 2021 | 2022 | 2023 | 2024 | 2025 | 2026 | 2027 | Anos | Questões |
|---|---|---|---|---|---|---|---|---|---|
| **Ecologia** (sucessão, ciclos C/N, eutrofização, magnificação trófica, relações, produtividade) | ● | ● | ●● | ● | ● | ●● | ●● | **7/7** | 10 |
| **Genética clássica** (epistasia, ligação/recombinação, ligada ao X, ABO/Rh, dois loci, probabilidade) | ● | ● | ● | ● | ●● | ● | ●● | **7/7** | 9 |
| **Fisiologia humana** (digestório, nervoso, renal, reprodutor, respiratório, muscular, endócrino) | ● | ● | ●● | ●● | ● | ● | ● | **7/7** | 9 |
| **Citologia** (organelas, membrana, núcleo, citoesqueleto, divisão celular) | ●● | (ribossomo) | ● | ●● | ● | ●● | (cílios) | **7/7** | 8 |
| **Botânica** (tecidos, anel de Malpighi, enxertia, fotossíntese × respiração, fotoperiodismo, grupos vegetais) | ● | ● | ●● | ● | ●● | — | ● | 6/7 | 8 |
| **Evolução** (especiação, endossimbiose, deriva/isolamento, Lamarck × teoria sintética, mimetismo) | ● | — | ● | ●● | ● | ● | ● | 6/7 | 7 |
| **Microbiologia, vírus e parasitoses** (bactérias, transformação/conjugação/transdução, vacina, arbovírus, esquistossomose, malária, *H. pylori*) | ● | ●● | ● | ● | ● | ● | — | 6/7 | 7 |
| **Genética molecular** (DNA/RNA, telômeros, mtDNA, transcrição/tradução, código genético, DNA recombinante) | — | ●● | ● | ●● | — | — | ●● | 4/7 | 7 |
| **Zoologia** (anelídeos, artrópodes, cordados, mamíferos, metamorfose) | — | ● | — | — | ● | ● | ● | 4/7 | 4 |
| **Embriologia** (folhetos, notocorda, tubo neural) | ● | — | — | — | ● | — | — | 2/7 | 2 |
| **Imunologia** | — | ● | — | — | — | — | — | 1/7 | 1 |

Regularidades da Santa Casa:
- **Q1 é quase sempre ecologia** (6 de 7 anos), partindo de uma notícia.
- Há **1 questão de genética com cálculo** por ano. O cálculo é curto: produto de frações e "demonstre os cálculos".
- **Fisiologia humana aparece todo ano, sempre em contexto médico**: toxina, fármaco, doença ou exame.

**Einstein, Q1 (7 questões):** fisiologia humana em 5 de 7 (reprodutor/hormônios, retina, neurônio/potencial de ação, imunologia/alergia, respiração/pH); genética em 2 de 7 (heredograma ligado ao X com probabilidade; vírus e íntrons); ecologia/ciclos e fluxo de energia em 1 de 7; botânica/insetos e seiva em 1 de 7.

**Unesp, Q13–15 (9 questões, 2024–2026):** genética molecular e expressão gênica 3; fisiologia humana (néfron/ADH, junção neuromuscular) 2; genética clássica (crossing-over, % de gametas, probabilidade) 1; imunologia (MHC, linfócitos T CD4, memória) 1; fisiologia vegetal (auxina, fototropismo) 1; ciclo do N/eutrofização/leguminosas 1; reprodução e citologia (autofagia, ovócito II, idade materna e não disjunção) 1.

**Fuvest, B01–B06 (36 questões, 2021–2026):** ecologia e biomas **13** (6/6 anos), muito ligada a gráficos e mudanças climáticas; genética 4 (heredograma, mutação por códon, probabilidade); imunologia e saúde 4 (febre, anticorpos, hemograma, vacina, parasitose); fisiologia 4 (néfron, contração, neurotransmissor); botânica 4 (ciclo de vida, movimentos, clorofila, fotossíntese/respiração); evolução e filogenia 3; zoologia 3; microbiologia 1; citologia 1 (detoxificação no fígado).

### 1.3 Tamanho esperado da resposta (resoluções do Objetivo)

- **Santa Casa:** mediana de **41 palavras por item** (p25 = 29, p75 = 63). Como cada item tem duas perguntas, isso dá **cerca de 20 palavras por pergunta**: o termo técnico sozinho na nomeação e **uma frase** de mecanismo no "por que". Genética: uma linha de genótipos mais uma linha de produto de frações.
- **Unesp:** mediana de 41,5 palavras por item, mesmo padrão.
- **Einstein:** de 45 a 105 palavras por item, ou seja, explicações de 2 a 3 frases.
- **Fuvest:** de 43 a 200 palavras por questão de 3 itens. Cada item vale "1 frase + justificativa", mais o desenho quando pedido.

**Conclusão para os cards:** a unidade certa é **1 pergunta → 1 termo** ou **1 pergunta → 1 frase causal** ("X ocorre porque Y, o que leva a Z").

### 1.4 Moldes de cards: Biologia (15)

Cada molde é um padrão de pergunta curta respondível em uma frase. Nenhum reproduz questão real.

| # | Molde de pergunta | Formato da resposta | Treina qual pedido |
|---|---|---|---|
| B1 | "Como se denomina [processo/estrutura] que [função ou descrição]?" | Termo técnico exato | Nomeação Vunesp (cerca de 40% das perguntas) |
| B2 | "Por que [condição/alteração] leva a [efeito]?" | 1 frase: causa → etapa intermediária → efeito | "Por que" no fim do item b |
| B3 | "Qual a função de [estrutura/molécula] em [processo]?" | Verbo de ação + alvo ("permite a troca de…") | Função de organela, órgão ou hormônio |
| B4 | "Em que [organela/órgão/fase] ocorre [processo]?" | Local + 1 palavra de contexto | Localização (tradução, filtração, crossing-over…) |
| B5 | "Que [hormônio/glândula/célula] [faz X]?" | Nome + quem o produz | Pares hormônio–glândula, célula–produto |
| B6 | "O que diferencia [tipo A] de [tipo B]?" | Um critério distintivo | Especiação alopátrica × simpátrica, sucessão primária × secundária… |
| B7 | "Indivíduo [fenótipo/posição no heredograma]: qual o genótipo?" | Genótipo + 1 justificativa (filho afetado → pai portador) | Genética, item a |
| B8 | "Probabilidade de [evento] entre [genótipo] × [genótipo]?" | Produto de frações em uma linha | Genética, item b ("demonstre os cálculos") |
| B9 | "Proporção [x:y:z] em F2: que interação ou herança explica?" | Nome (epistasia, ligação, ligada ao X) + evidência | Interpretação de proporções |
| B10 | "Como a teoria sintética explica [adaptação]?" | Variação prévia (mutação/recombinação) → seleção → aumento da frequência | Evolução, contraste com Lamarck |
| B11 | "O que há de errado em '[afirmação biológica com erro]'?" | Aponta o erro + forma correta | "Qual equívoco conceitual…" (exemplo errado de propósito) |
| B12 | "Em [fase/situação], [grandeza A] é maior, menor ou igual a [grandeza B]?" | Comparação + motivo (PPB/PPL, F/R, pressão etc.) | Razões ecológicas e fisiológicas |
| B13 | "[Fármaco/toxina/lesão] atua em [alvo]: qual a consequência para [processo]?" | Efeito + mecanismo em 1 frase | Contexto médico (toxina, analgésico, cianeto, antibiótico) |
| B14 | "No gráfico de [y] × [x], o que indica [curva/trecho/número]?" | Identificação + o critério visual usado | Leitura de figura (presente em quase toda questão) |
| B15 | "Cite uma forma de transmissão ou prevenção de [doença] ligada ao seu ciclo" | Medida específica + etapa do ciclo que ela interrompe | Parasitoses e saúde pública |

---

## 2. QUÍMICA

### 2.1 Verbos e pedidos (contagem automática)

| Pedido | Santa Casa (28) | Einstein (7) | Unesp (9) | Fuvest (36) |
|---|---|---|---|---|
| **Escreva / equacione / represente / apresente** (fórmula estrutural ou molecular, equação, Lewis) | **53** | 10 | 13 | 28 |
| **Calcule / determine** | 25 | 5 | 7 | 11 |
| **Classifique** (polaridade, óxido, ácido, cadeia, ligação, reação, álcool) | 17 | 1 | 2 | 0 |
| **Qual/Que…?** | 15 | 6 | 9 | 44 |
| **Dê o nome / forneça o nome** (função, grupo, mudança de estado, processo) | 12 | 2 | 0 | 2 |
| **Justifique** | 3 | 1 | 0 | **28** |
| **Explique / por que** | 1 | 4 | 1 | 28 |
| **Desenhe / esboce / complete tabela** | 0 | 0 | 0 | 18 |

**Padrão Santa Casa (muito rígido).** Cada item = **1 pergunta de nome ou classificação + 1 de escrever ou calcular**, por exemplo: "dê o nome da função + escreva a fórmula molecular", ou "classifique a polaridade + calcule o pH". Explicação quase não aparece: só 4 "justifique/por que" em 7 anos.

**Unesp:** igual à Santa Casa, com um pouco mais de cálculo.

**Fuvest:** é o oposto. Pede muita **justificativa conceitual** ("maior, menor ou igual? justifique", "explique com base no equilíbrio") e desenho (estrutura, curva, Lewis).

### 2.2 Temas: Santa Casa Q9–Q12, 2021–2027 (28 questões, cerca de 112 perguntas)

| Tema | Anos em que caiu | Freq. | Formato típico do pedido |
|---|---|---|---|
| **Funções orgânicas + fórmula estrutural ou molecular** | 21, 22, 23, 24, 25, 26, 27 | **7/7** | "nome da função do grupo destacado"; "escreva a fórmula molecular" |
| **Estequiometria e concentração** (mol, massa, g/L, mol/L, %, Avogadro, massa molar) | 21–27 | **7/7** | cálculo de 3 a 6 linhas |
| **Reações orgânicas** (esterificação, hidrólise de éster, oxidação de álcool, combustão completa) | 22, 23, 24, 25, 26, 27 | 6/7 | "equacione com os menores inteiros"; "fórmulas dos reagentes/produtos" |
| **Geometria molecular, polaridade, ligação, Lewis** | 21, 22, 24, 25, 26, 27 | 6/7 | "apresente a geometria e classifique a polaridade" (o H2S caiu 2 vezes) |
| **Nox, redox, agente oxidante, balanceamento** | 21, 22, 23, 24, 27 | 5/7 | "determine o Nox"; "agente/espécie oxidante" |
| **Ácidos, bases, óxidos, pH, indicador, classificação de ácidos** | 22, 23, 24, 25, 27 | 5/7 | "classifique o óxido"; "nº de H ionizáveis"; "calcule o pH" |
| **Tabela periódica e estrutura atômica** (grupo, nº de elétrons de íon, fórmula de íon) | 21, 23, 24, 26, 27 | 5/7 | resposta de 1 palavra ou 1 número |
| **Estados físicos, misturas, separação, solubilidade** (sublimação, fusão, fases, funil, curva de solubilidade) | 21, 23, 24, 25, 26 | 5/7 | "dê o nome da mudança de estado/processo" |
| **Eletroquímica** (pilha, célula a combustível: equação global + ddp) | 21, 23, 26 | 3/7 | equação global + E° |
| **Radioatividade** (equação de decaimento + meia-vida pelo gráfico) | 21, 22, 27 | 3/7 | conservação de A e Z; contar meias-vidas |
| **Isomeria** (óptica: carbono quiral; geométrica) | 23, 25, 27 | 3/7 | "justifique por que tem isomeria óptica" |
| **Termoquímica** (exo/endo, Hess) | 23, 26 | 2/7 | classificação ou cálculo |
| Gases (PV = nRT) / Equilíbrio (Ka) | 22 / 24 | 1/7 cada | cálculo |

**Einstein, Q2 (7):** funções orgânicas 7/7 (álcool, ácido carboxílico, éster, fenol…); forças intermoleculares e solubilidade/ponto de fusão ("explique qual tem maior PF"; polar × apolar) 2; estado físico pela tabela de PF/PE 2; estequiometria e solução 4; eletroquímica (metal de sacrifício) 1; reação orgânica (hidrólise, oxidação enérgica, neutralização) 3.

**Unesp, Q16–18 (9):** sempre 1 questão orgânica por ano (função, isomeria, esterificação, fórmula molecular, tipo de reação); Nox/redox e balanceamento 3; pH, indicador, Kb 1; equilíbrio Kp + Le Châtelier 1; solubilidade, densidade, fórmula centesimal 1; eletrólise (Faraday) 1; óxido neutro + CO e hemoglobina 1.

**Fuvest, Q01–06 (36).** Contagem por palavra-chave no enunciado, conferida por leitura:
- Estrutura de Lewis e isomeria: **6/6 anos**.
- Eletroquímica, corrosão e eletrólise: 5/6 anos (7 questões).
- Forças intermoleculares e solubilidade: 5/6.
- Equilíbrio químico e Le Châtelier: 4/6 (em 2024, 4 das 6 questões; em 2025, só equilíbrio implícito de protonação e saturação).
- Química ambiental (chuva ácida, CO2, fertilizantes): 4/6.
- Estequiometria aplicada: todo ano.
- Radioatividade: 2/6.

### 2.3 Tamanho esperado da resposta

- **Santa Casa:** mediana de **30 palavras por item** (p25 = 19). Na prática: **1 a 3 palavras** (nome da função, "apolar", "óxido ácido", "sublimação") **+ uma fórmula ou equação**, ou **um cálculo de 3 a 6 linhas** com regra de três.
- **Unesp:** mediana de 74 palavras por item (mais cálculo; a prova exige mostrar a resolução).
- **Fuvest:** de 83 a 270 palavras por questão de 3 itens. Cada justificativa tem 2 a 3 frases.

### 2.4 Moldes de cards: Química (15)

| # | Molde | Resposta em 1 linha | Treina |
|---|---|---|---|
| Q1 | "A que função orgânica pertence [grupo desenhado ou descrito]?" | Nome da função | 7/7 Santa Casa, 7/7 Einstein |
| Q2 | "Fórmula molecular de [composto dado por estrutura ou nome]?" | CxHyOzNw | Contar átomos na estrutura de bastão |
| Q3 | "Geometria e polaridade de [molécula]?" | Geometria + polar/apolar + motivo (vetor resultante) | 6/7 Santa Casa |
| Q4 | "Nox de [elemento] em [espécie]?" | Valor com sinal (soma = carga) | 5/7 Santa Casa |
| Q5 | "Combustão completa de [CxHy(Oz)] com os menores inteiros?" | Equação balanceada | Santa Casa 2022, 2024, 2025 |
| Q6 | "Quais ácido e álcool formam [éster]?" / "Quais produtos da hidrólise de [éster]?" | Os dois nomes ou fórmulas | Esterificação e hidrólise (Santa Casa, Einstein, Unesp) |
| Q7 | "Oxidação de álcool [primário/secundário] gera que função?" | Aldeído/ácido carboxílico ou cetona | Reações orgânicas |
| Q8 | "Pilha [A]/[B]: quem reduz e qual a ddp?" | Maior E°red reduz; ddp = E°cátodo − E°ânodo | Eletroquímica |
| Q9 | "Decaimento [α/β] de [isótopo]: qual o produto?" | Novo A e Z (conservação) | Radioatividade |
| Q10 | "Por que [composto] tem (ou não tem) isomeria óptica/geométrica?" | Carbono com 4 ligantes diferentes / ligantes diferentes em cada C da dupla | Isomeria |
| Q11 | "Classifique [óxido] / [ácido quanto aos H ionizáveis] / [álcool quanto ao carbono da OH]" | Classe + critério | "Classifique" (17 vezes na Santa Casa) |
| Q12 | "pH de [concentração] de ácido forte?" / "[H+] com Ka dado?" | [H+] → −log | pH (Santa Casa 2024 e 2027) |
| Q13 | "Que mudança de estado ou método de separação ocorre em [situação]?" | Nome (sublimação, fusão, filtração, decantação) | Nomeação de processo |
| Q14 | "Por que [A] tem maior PF/PE/solubilidade em água que [B]?" | Força intermolecular dominante + tamanho da cadeia | Einstein, Fuvest |
| Q15 | "Ao [perturbação], para onde se desloca [equilíbrio]?" | Sentido + motivo (Le Châtelier) | Fuvest, Unesp 2026 |

Molde extra de estrutura atômica: "Quantos elétrons tem [íon]?" → Z menos a carga.

---

## 3. MATEMÁTICA

Há menos fonte de Medicina aqui: **a Santa Casa não tem Matemática discursiva** e **a Fuvest não cobra Matemática de Medicina**. A Matemática relevante para Medicina está no **Einstein (Q4, 7 anos)** e na **Unesp (Q22–24, 3 anos)**. A Fuvest (36 questões) entra só como referência de estilo.

### 3.1 Verbos e pedidos

| Pedido | Einstein (7) | Unesp (9) | Fuvest (36) |
|---|---|---|---|
| **Calcule / determine** | 11 | 14 | 34 |
| **Qual…? / quantas…?** | 3 | 3 | 58 |
| **Probabilidade** | 2 | 2 | 15 |
| **Escreva a expressão/fórmula/sistema** | 2 | 1 | 6 |
| **Mostre que / apresente argumentos / explique** | 0 | 2 | 3 |
| **Desenhe o gráfico / complete** | 1 | 0 | 2 |

Regra explícita das provas: Unesp e Fuvest **só consideram a resposta com a resolução** ("é indispensável indicar a resolução").

### 3.2 Temas

| Tema | Einstein Q4 | Unesp Q22–24 | Fuvest M (referência) |
|---|---|---|---|
| **Probabilidade e contagem** | 2025, 2027 (dados) | 2024 (roleta), 2026 (senhas, fatorial) | **6/6 anos** |
| **Funções** (afim aplicada, potência, quadrática/vértice, gráfico com domínio e imagem) | 2022, 2023, 2024, 2027 | — | 4/6 |
| **Geometria plana / trigonometria** (lei dos cossenos, semelhança, círculo inscrito) | 2021 | 2024, 2025 | 5/6 |
| **Geometria espacial** (cubo e cilindro, prisma, tronco de pirâmide) | 2026 | 2024, 2026 | 3/6 |
| **Geometria analítica** (coeficiente angular, ângulo com o eixo, interseção) | — | 2024, 2025 | 5/6 |
| **Estatística** (média, mediana, moda, amplitude) | 2024 | — | — |
| **Matemática financeira / porcentagem** | — | 2026 (juros, inflação) | 2025, 2026 |
| Sistemas, PA/PG, complexos | — | 2025 (argumentação com sistema) | vários |

Marca registrada do Einstein: **matemática embutida em contexto de saúde ou dia a dia**, como uma fórmula de concentração de álcool no sangue ou uma escala física. A pergunta pede para **aplicar a fórmula dada** e depois **inverter** (achar a variável).

### 3.3 Tamanho esperado da resposta

Sempre um cálculo. Na Unesp, a resolução do Objetivo tem mediana de **82 palavras/símbolos por item** (4 a 8 linhas). No Einstein, de 25 a 200. Raramente cabe numa frase. Por isso **os cards de Matemática devem treinar o micro-passo decisivo** (qual fórmula, qual primeira equação, qual relação), não a conta inteira.

### 3.4 Moldes de cards: Matemática (13)

| # | Molde | Resposta em 1 linha |
|---|---|---|
| M1 | "P(A e B) com A, B independentes [valores]?" | Produto |
| M2 | "P(A dado B) a partir de [tabela/porcentagens]?" | Casos de A∩B ÷ casos de B |
| M3 | "Quantas maneiras de [arranjo com restrição]?" | Princípio multiplicativo escrito (ex.: 4·2·1·1) |
| M4 | "Vértice de y = [ax² + bx + c]?" | xv = −b/2a; yv = f(xv) |
| M5 | "Média de n números é M: qual a soma?" / "o que muda na mediana se [x]?" | n·M / posição central |
| M6 | "Coeficiente angular da reta por [P1, P2]? Ângulo com o eixo x?" | m = Δy/Δx = tg θ |
| M7 | "Interseção de [reta] com [parábola/circunferência]: primeiro passo?" | Igualar/substituir → equação do 2º grau |
| M8 | "Volume de [prisma/cilindro/pirâmide/tronco]?" | Fórmula + substituição |
| M9 | "Dados [2 lados + ângulo] / [triângulos semelhantes]: que relação usar?" | Lei dos cossenos / razão de semelhança |
| M10 | "Aumento de x% e depois desconto de y% voltam ao preço: relação?" | (1 + x)(1 − y) = 1 |
| M11 | "Rendimento real com juros j e inflação i?" | (1 + j)/(1 + i) − 1 |
| M12 | "Fórmula dada [f(B) = …]: isole [variável]" | Expressão invertida |
| M13 | "Mostre que [valor] satisfaz [condição]" | Substituição que fecha a igualdade |

---

## 4. PORTUGUÊS

Fontes: **Santa Casa Q17–20 (28 questões, 56 perguntas)**, **Unesp Q25–32 (24 questões, 48 perguntas)** e **Fuvest dia 1 (60 questões, 120 itens)**. O Einstein não tem Português discursivo.

### 4.1 Verbos e pedidos (contagem automática)

| Pedido | Santa Casa (28) | Unesp (24) | Fuvest (60) |
|---|---|---|---|
| **Justifique (sua resposta / sua escolha)** | **18** | **17** | 16 |
| **Cite** | 12 | 7 | 10 |
| **Qual/Que…?** | 12 | 15 | 24 |
| **Reescreva / transponha / substitua / transforme** | 10 | 11 | 12 |
| **Transcreva** | 8 | 4 | 4 |
| **Identifique** | 8 | 4 | 11 |
| **Explique / explicite / comente / discuta** | 4 | 2 | **47** |
| **Como…?** (efeito, relação) | 8 | 4 | 31 |
| **Compare / relacione / relação de sentido** | 4 | 3 | 21 |
| **Por que…?** | 1 | 0 | 13 |

**O par típico da Vunesp:** "**Cite/Transcreva X do texto. Justifique.**" No item b vem uma **reescrita com restrição** ou uma **análise gramatical pontual**. A Fuvest é mais ensaística: "**Explique** o sentido / a relação / o efeito", e metade das questões é de **literatura** (obras de leitura obrigatória).

### 4.2 Tipos de tarefa e frequência

**Santa Casa (56 perguntas, 2021–2027):**

| Tipo de tarefa | Nº de perguntas | Anos | Exemplos de pedido (paráfrase de até 10 palavras) |
|---|---|---|---|
| **Figura ou recurso expressivo: identificar + justificar** (paradoxo, hipérbole, personificação, eufemismo, ambiguidade, sentido figurado, metáfora, gradação, enálage, recurso retórico repetido) | **14** | **7/7** | "transcreva o paradoxo e justifique"; "qual termo é ambíguo?" |
| **Interpretação pontual** (contradição apontada, relação expressão × imagem, moral, contraponto, sentido de expressão coloquial) | 10 | 7/7 | "que contradição o autor aponta?" |
| **Reescrita com restrição** | 9 | 6/7 (falta 2027) | voz ativa/passiva (3), discurso indireto (2), ordem direta (1), um período com conjunção (1), trocar conjunção por locução equivalente (1), equivalente formal e coloquial (1) |
| **Gramática aplicada a frase citada** (sujeito de verbo sublinhado (3), referente de pronome (2), valor possessivo do pronome oblíquo, objeto direto pleonástico, demonstrativo que retoma um período, efeito do tempo verbal) | 9 | 6/7 | "identifique os sujeitos dos verbos sublinhados" |
| **Formação de palavras** (prefixos de negação/oposição (3), derivação imprópria (2), neologismos) | 6 | 5/7 | "cite palavras com prefixo de negação" |
| **Foco narrativo e vozes** (discurso indireto livre, dois narradores, autor que se dirige ao leitor, impessoalidade) | 6 | 4/7 | "transcreva frase com voz do narrador e da personagem" |
| **Literatura: estilo de autor ou gênero** (traços machadianos, gênero crônica, prosa de Guimarães Rosa) | 4 | 3/7 | "cite duas características de [autor/gênero]" |

**Unesp (48 perguntas, 2024–2026), mesma banca e mesmo cardápio, com mais poesia (contagem aproximada; algumas perguntas se encaixam em duas categorias):**
- Reescrita com restrição (voz passiva/analítica, discurso indireto e direto, ordem direta, sinônimos, trocar locução conjuntiva): **10** (3/3 anos).
- Figura ou recurso + justificativa: **9**.
- Interpretação de poema ou cartum (sentimento, oposição, visões de mundo, título): **10**.
- Literatura e versificação (período literário pela forma, características românticas, **rima rica** com classes gramaticais (2 anos), procedimento machadiano, intertextualidade e alegoria): **9**.
- Gramática aplicada (referentes (3), sujeitos, elipse, termo que retoma outro): **6**.
- Formação de palavras (prefixo e seu sentido, derivação imprópria): **2**.
- Foco narrativo (eu lírico explícito, narrador que fala ao leitor, discurso indireto livre): **3**.

**Fuvest (120 itens, 2021–2026):**
- **Literatura de obras obrigatórias: cerca de 26 das 60 questões** (4 a 5 por ano). Características de movimento (Arcadismo, Romantismo, Modernismo, expressionismo, regionalismo de 30), personagem e enredo, comparação entre obras ou com imagem/foto/tela.
- **Sentido, efeito e relação em texto não literário** (anúncio, charge, tirinha, divulgação científica, crônica): cerca de 20 questões.
- **Gramática a serviço do sentido:** função sintática + vírgulas; oração reduzida → desenvolvida; adversativa → concessiva; correlação verbal ao reescrever; tempos e modos verbais (efeito do futuro do pretérito); formação de palavras (amálgama, sufixação humorística, neologismo); polissemia/ambiguidade (6 anos); sinônimos em contexto (3 anos).
- Tamanho: mediana de **98 palavras por item**, o dobro da Santa Casa.

### 4.3 Como as provas citam o texto

- **Santa Casa / Unesp (Vunesp):**
  - Transcrevem a frase entre aspas com a localização: "(2.º parágrafo)", "(4.ª estrofe)".
  - Grifam ou **sublinham** termos ("os termos sublinhados", "o verbo sublinhado").
  - Dão uma **lista numerada de 3 ou 4 trechos** e pedem para escolher um ("em qual destas frases…") e justificar.
  - Usam um **boxe de definição** citado de gramática ou dicionário (Celso Cunha, Cegalla, Nilce Sant'Anna Martins, Houaiss) **antes de pedir a aplicação**: o conceito é dado e o aluno tem de reconhecê-lo no texto.
  - Às vezes só apontam o local, sem citar ("no primeiro parágrafo, cite…"), e o aluno tem de **localizar e transcrever**.
  - Cartum ou tirinha quase sempre na Q17 da Santa Casa (4 de 7 anos) e na Q25 da Unesp (3 de 3).
- **Fuvest:**
  - Citam versos com numeração "(v. 4-5)".
  - Definem a figura no enunciado (quiasmo, silogismo).
  - Combinam texto com imagem (charge, foto, pintura).
  - Pedem conhecimento da obra inteira a partir de um excerto.

### 4.4 Tamanho esperado da resposta

- **Santa Casa:** mediana de **48 palavras por item**, que tem duas partes. Resposta curta (o termo, o trecho transcrito ou a frase reescrita) **+ uma justificativa de uma frase**. A reescrita é só a frase transformada.
- **Unesp:** mediana de 57 palavras por item. Mesmo formato, um pouco mais longo nas questões de literatura.
- **Fuvest:** de 65 a 128 palavras por item (4 a 6 linhas, parágrafo argumentativo).

### 4.5 Moldes de cards: Português (16)

Os trechos dos cards devem ser escritos pelo próprio projeto ou tirados de obras em domínio público, nunca de provas.

| # | Molde | Resposta (1 frase) | Treina |
|---|---|---|---|
| P1 | "Reescreva '[frase]' na voz passiva analítica / na voz ativa" | Frase transformada, mantendo tempo e modo | 3 vezes na Santa Casa + 2 na Unesp |
| P2 | "Passe '[fala em discurso direto]' para o discurso indireto" | Verbo de dizer + que/se + ajuste de pessoa, tempo e dêiticos | 2 na Santa Casa + 2 na Unesp |
| P3 | "Passe '[discurso indireto]' para o discurso direto" | Travessão ou aspas + 1ª pessoa + presente | Unesp 2026 |
| P4 | "Reescreva '[período em ordem inversa]' em ordem direta" | Sujeito, verbo, complementos | Santa Casa e Unesp (3) |
| P5 | "Troque '[conjunção]' por locução de mesmo valor ([concessivo/causal/condicional])" | Ex.: valor concessivo → "ainda que" | Santa Casa 2025, Unesp 2024 |
| P6 | "Una '[frase 1]. [frase 2].' num só período com conjunção que preserve o sentido" | Conector adequado + pontuação | Santa Casa 2026; Fuvest (adversativa → concessiva) |
| P7 | "Que figura há em '[trecho]'? Justifique." | Nome + marca textual que prova | 14 vezes na Santa Casa |
| P8 | "Qual o sentido de '[expressão idiomática/coloquial/metafórica]' neste contexto?" | Paráfrase em registro formal | Interpretação e registro |
| P9 | "Que efeito tem [diminutivo/aspas/parênteses/repetição/inversão/tempo verbal] em '[trecho]'?" | Efeito nomeado (ênfase, ironia, afetividade, ressalva temporal) | Efeito de sentido |
| P10 | "A que termo se refere '[pronome]' em '[trecho]'?" | O referente exato | 2 na Santa Casa (+1 demonstrativo) + 3 na Unesp |
| P11 | "Qual o sujeito de '[verbo]' em '[frase]'?" | O termo, ou o tipo (oculto, oracional, indeterminado) | 3 vezes na Santa Casa + 1 na Unesp |
| P12 | "Como se formou '[palavra]'? Que sentido tem o afixo?" | Processo (prefixação, derivação imprópria, neologismo, aglutinação) + sentido | 6 + 2 |
| P13 | "Que palavra é ambígua em '[tirinha/anúncio]' e quais os dois sentidos?" | Termo + sentido A / sentido B | Humor de cartum (Santa Casa, Unesp, Fuvest) |
| P14 | "Em '[trecho]', quem fala: narrador, personagem ou os dois?" | Discurso indireto livre: pensamento da personagem sem verbo de dizer | Foco narrativo |
| P15 | "Que traço de [autor/movimento] aparece em '[trecho]'?" | Traço + evidência | Literatura (Santa Casa, Unesp, Fuvest) |
| P16 | "Por que '[termo]' está entre vírgulas? Qual a sua função sintática?" | Adjunto adverbial deslocado / aposto / oração intercalada | Fuvest 2022 e 2023 |

Extras rápidos de 1 linha: "Sinônimo de '[palavra]' neste contexto?" (Unesp e Fuvest); "Rima rica entre '[x]' e '[y]'? Quais as classes?" (Unesp, 2 anos); "Prefixo de negação × prefixo de oposição: dê um exemplo de cada" (Santa Casa, 3 anos).

---

## 5. Implicações diretas para os cards

1. **Bio/Quí no estilo Vunesp = pares.** Um card de nomeação e um card de mecanismo para o mesmo assunto imitam o par a/b da prova.
2. **Mecanismo em uma frase com conector causal.** "porque/pois/o que leva a" é o formato que a resolução oficial premia.
3. **Química na Santa Casa é 80% "nomear/classificar + escrever".** Vale fazer cards visuais: estrutura → função; molécula → geometria e polaridade.
4. **"Justifique" exige uma evidência.** Em Português, a resposta do card deve trazer a marca no texto ("porque atribui ação humana a…").
5. **Matemática vira card de micro-passo.** Fórmula ou primeira equação; a conta inteira fica para outro formato.
6. **Português de Medicina SP = Vunesp.** Nos cards, priorize: reescritas (voz, discurso, ordem direta, conectivos), figuras + justificativa, sujeito e referente, prefixos e derivação imprópria.

---

## 6. PDFs lidos

Base: `https://www.curso-objetivo.br/vestibular/resolucao-comentada/`

**Santa Casa: prova + resolução do 2º dia (discursivas)**
- `santacasa/{2021..2027}/2dia/santacasa{ANO}_2dia_prova.pdf` (2021, 2022, 2023, 2024, 2025, 2026, 2027)
- `santacasa/{2021..2027}/2dia/santacasa{ANO}_2dia.pdf` (resolução; 2021 a 2027)
- `santacasa/2026/2dia/santacasa2026_2dia_prova-outros-cursos.pdf` (baixado, não usado)

**Einstein: Prova II + resolução completa (as discursivas ficam no fim)**
- `alberteinstein/{ANO}/alberteinstein{ANO}_prova_II.pdf` (2021 a 2027)
- `alberteinstein/{ANO}/alberteinstein{ANO}.pdf` (resolução; 2021 a 2027)

**Fuvest, 2ª fase**
- `fuvest/{ANO}_2fase/1dia/fuvest{ANO}_2fase_1dia_prova.pdf` e `.../fuvest{ANO}_2fase_1dia.pdf` (Português; 2021 a 2026)
- `fuvest/{ANO}_2fase/2dia/fuvest{ANO}_2fase_2dia_prova.pdf` e `.../fuvest{ANO}_2fase_2dia.pdf` (Bio, Quí, Mat; 2021 a 2026)

**Unesp, 2ª fase**
- `unesp/{ANO}/2fase/UNESP{ANO}_2fase.pdf` (resolução; 2021 a 2026). Também `UNESP2024_2fase_prova.pdf`, `UNESP2025_2fase_prova.pdf`, `UNESP2025_2fase_2dia_prova.pdf`, `UNESP2026_2fase_1dia_prova.pdf` e `UNESP2026_2fase_2dia_prova.pdf`.
- `UNESP2021/2022/2023_2fase(_prova).pdf`: lidos só para confirmar que eram **objetivos** (A a E). Ficaram fora da análise.

## 7. O que não foi possível obter ou usar

- **Fuvest 2027, 2ª fase:** ainda não publicada (página sem arquivos; a prova é em dezembro de 2026).
- **Santa Casa 2026, Química (Q9–12):** o PDF de resolução não tem o texto dessas questões. Os pedidos foram tirados do PDF da prova, mas não há tamanho de resposta para elas.
- **Unesp 2021–2023:** 2ª fase objetiva, sem discursivas.
- **Unesp de meio de ano** (2024-2, 2025-2, 2026-2): não lidos.
- **Gabaritos oficiais** ("respostas esperadas" da Vunesp, padrão da Fuvest): não consultados. O tamanho da resposta é estimado pelas resoluções do Objetivo, que tendem a ser mais longas que o mínimo aceito.
- **Contagens de verbos:** são automáticas (regex sobre o texto dos itens). Quando um boxe de definição vem dentro do item, pode entrar uma ocorrência a mais. Servem para dar a ordem de grandeza, não um número exato.
