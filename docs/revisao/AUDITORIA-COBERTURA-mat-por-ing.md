# Auditoria de cobertura da Revisão geral — Matemática, Português e Inglês

Data: 11/11/2026. Pedido do dono: toda questão do site precisa ter, na revisão, o conteúdo do assunto que ela trata.

Método: para cada subtema com questões (`app/public/conteudo/<m>/banco.json`), li o campo `conceito` de até 10 questões e o texto de 5 a 6 questões (`txt/<sub>.json`), e comparei com os pontos dos tópicos ligados em `docs/revisao/<m>/geral.json`. Só entrou o que as questões cobram e a revisão não ensinava. Pontos existentes não foram alterados (só receberam pontos novos no fim). Contas refeitas em python. Fatos de gramática e fórmulas clássicas sem link vêm das gramáticas e livros já usados como base (Cunha e Cintra, Bechara; Iezzi et al., Fundamentos de Matemática Elementar); fatos novos conferidos na web têm o link ao lado.

Além de pontos novos, alguns tópicos que existiam com `subs` vazio passaram a ser ligados aos subtemas em que as questões estão (Português: PK05, PK31, PK32, LK03 a LK07, LK20, LK21, IK22 a IK24). Isso não muda nenhum texto; só faz o conteúdo aparecer para essas questões.

## Matemática (80 subtemas com questões)

| Subtema | Questões | Resultado |
|---|---|---|
| M01.1 frações e decimais | 14 | OK |
| M01.2 potências e radicais | 27 | M01.2 + ponto: número em base 2 como soma de potências de 2 (conta 13 = (1101)₂ refeita em python). |
| M01.3 notação científica e ordem de grandeza | 22 | M01.3 + 2 pontos: prefixos do SI (giga a atto) [fonte: https://www.bipm.org/en/measurement-units/si-prefixes]; somar potências de 10 igualando expoentes (conta refeita em python). |
| M01.4 divisibilidade, MMC e MDC | 56 | M01.4 + 2 pontos: divisão euclidiana e ciclos (resto por 7); resto = divisor − 1 → N+1 múltiplo do MMC (Iezzi, Fundamentos v.1). |
| M01.5 conjuntos numéricos | 19 | OK |
| M02.1 razão e proporção | 64 | OK |
| M02.2 regra de três simples e composta | 47 | OK |
| M02.3 escalas e densidade | 29 | OK |
| M02.4 grandezas direta e inversamente proporcionais | 31 | M02.4 + ponto: engrenagens (dentes × voltas constante; mesmo eixo, mesmas voltas). |
| M02.5 divisão proporcional | 17 | OK |
| M03.1 porcentagem simples | 111 | OK |
| M03.2 aumentos e descontos sucessivos | 57 | M03.2 + ponto: voltar ao valor original dividindo pelo fator (1300 ÷ 1,3 = 1000, conferido em python). |
| M03.3 juros simples | 15 | OK |
| M03.4 juros compostos | 25 | M03.4 + ponto: valor presente das parcelas, dividir por (1+i)^t. |
| M03.5 dose, concentração e proporção aplicada à saúde | 10 | OK |
| M04.1 equação do 1.º grau | 19 | OK |
| M04.2 equação do 2.º grau | 27 | OK |
| M04.3 sistemas lineares | 86 | OK |
| M04.4 inequações | 31 | M04.4 + ponto: inequações modulares |x−a| < k e > k. |
| M04.5 problemas de modelagem algébrica | 65 | M04.5 + ponto: número de dois algarismos 10a + b e troca de algarismos. |
| M05.1 função afim | 44 | OK |
| M05.2 função quadrática e vértice | 126 | OK |
| M05.3 leitura de gráficos de funções | 42 | OK |
| M05.4 função definida por partes e modular | 24 | OK |
| M05.5 composição e inversa | 49 | OK |
| M06.1 função exponencial | 33 | OK |
| M06.2 equação exponencial | 28 | OK |
| M06.3 definição e propriedades do logaritmo | 62 | OK |
| M06.4 equação logarítmica | 26 | OK |
| M06.5 meia-vida, decaimento e crescimento | 49 | OK |
| M07.1 progressão aritmética | 49 | OK |
| M07.2 progressão geométrica | 47 | OK |
| M07.3 soma de termos | 42 | OK |
| M07.4 padrões e recorrências | 35 | OK |
| M08.1 triângulos | 23 | OK |
| M08.2 quadriláteros | 43 | OK |
| M08.3 circunferência e círculo | 57 | M08.3 + ponto: ponteiros do relógio (6°/min e 0,5°/min). |
| M08.4 polígonos regulares | 20 | OK |
| M08.5 áreas compostas e hachuradas | 66 | OK |
| M08.6 áreas básicas | 20 | OK |
| M09.1 teorema de Pitágoras | 46 | OK |
| M09.2 teorema de Tales | 3 | OK |
| M09.3 semelhança de triângulos | 45 | OK |
| M09.4 relações métricas no triângulo retângulo | 16 | OK |
| M09.5 ângulos e propriedades | 26 | M09.5 + 2 pontos: ângulo de segmento = metade do arco; diagonais dos quadriláteros notáveis. |
| M10.1 razões trigonométricas no triângulo retângulo | 61 | OK |
| M10.2 lei dos senos | 9 | OK |
| M10.3 lei dos cossenos | 21 | OK |
| M10.4 ciclo trigonométrico e arcos | 64 | OK |
| M10.5 funções trigonométricas e gráficos | 49 | OK |
| M11.1 prismas e cubos | 81 | M11.1 + ponto: 1 mm de chuva em 1 m² = 1 L. |
| M11.2 cilindros | 59 | OK |
| M11.3 pirâmides e cones | 49 | OK |
| M11.4 esfera | 18 | M11.4 + ponto: raio do paralelo r = R·cos(latitude) e arco entre longitudes. |
| M11.5 troncos, sólidos compostos e densidade/volume | 56 | OK |
| M11.6 volumes básicos | 20 | M11.6 + ponto: volume deslocado e subida do nível. |
| M12.1 distância entre pontos e ponto médio | 35 | OK |
| M12.2 equação da reta | 61 | M12.2 + ponto: distância de ponto a reta como altura (questões de M12.2 usam a fórmula, que só estava em M12.3). |
| M12.3 posição relativa e paralelismo | 15 | OK |
| M12.4 circunferência no plano cartesiano | 84 | OK |
| M12.5 áreas por coordenadas | 41 | OK |
| M13.1 princípio multiplicativo | 61 | novo tópico G33 (casa dos pombos), ligado a M13.1, M13.6 e M13.9. |
| M13.2 arranjos e permutações | 58 | M13.2 + ponto: permutação caótica, D₃ = 2 e D₄ = 9 (conferido em python). |
| M13.3 combinações | 82 | M13.3 + ponto: combinação com repetição, C(7,3) = 35 (conferido em python). |
| M13.4 probabilidade simples | 143 | OK |
| M13.5 probabilidade condicional e teste diagnóstico | 40 | OK |
| M13.6 união, intersecção e evento complementar | 43 | G33 (casa dos pombos / pior caso) ligado. |
| M13.9 combinatória e probabilidade — outros casos | 16 | G33 (casa dos pombos) ligado. |
| M14.1 média, mediana e moda | 97 | OK |
| M14.2 leitura de tabelas e gráficos | 114 | OK |
| M14.3 dispersão e desvio padrão | 12 | M14.3 + ponto: coeficiente de variação. |
| M14.4 média ponderada | 26 | M14.4 + ponto: valor esperado como média ponderada por probabilidades. |
| M14.5 interpretação de dados em saúde | 3 | OK |
| M15.1 operações com matrizes | 54 | OK |
| M15.2 determinantes | 43 | OK |
| M15.3 aplicação em sistemas | 9 | OK |
| M16.1 polinômios e relações de Girard | 77 | OK |
| M16.2 números complexos | 42 | OK |
| M17.1 raciocínio lógico e dedução | 59 | M17.1 + 2 pontos: bicondicional; contrapositiva × recíproca. |
| M17.2 algoritmos e sistemas de numeração | 23 | M17.2 + ponto: algarismos romanos e regra subtrativa. |

## Português (50 subtemas com questões)

| Subtema | Questões | Resultado |
|---|---|---|
| P01.1 tema, tese e ideia principal do texto | 154 | OK |
| P01.2 informação explícita × inferência | 658 | OK |
| P01.3 título, fonte, data e paratexto como pista de leitura | 21 | IK22, IK23, IK24 (intertextualidade; tinham subs vazio) passam a ligar a P01.3. |
| P01.4 finalidade do texto e interlocutor | 74 | OK |
| P02.1 tipos de argumento e como o autor sustenta a tese | 66 | OK |
| P02.2 ponto de vista, modalização e marcas de opinião | 50 | OK |
| P02.3 ironia, humor e sentido implícito | 86 | OK |
| P02.4 contra-argumento, concessão e refutação | 6 | OK |
| P03.1 tipos textuais: narração, descrição, dissertação e injunção | 68 | OK |
| P03.2 gêneros jornalísticos: notícia, reportagem, editorial e crônica | 55 | OK |
| P03.3 charge, tirinha, cartaz e infográfico | 158 | IK22, IK23, IK24 (intertextualidade em tirinha, meme e charge) passam a ligar a P03.3. |
| P03.4 divulgação científica e texto digital | 23 | OK |
| P04.1 referência: pronome, elipse e substituição lexical | 161 | IK18 + ponto: dêitico (eu, aqui, agora, hoje) [fontes: https://ciberduvidas.iscte-iul.pt/consultorio/perguntas/o-conceito-de-deixis/16480 ; https://dicionario.priberam.org/pt-pt/d%C3%AAitico]. |
| P04.2 conjunções e relações lógicas | 145 | OK |
| P04.3 progressão temática, parágrafo e ordem das ideias | 26 | OK |
| P04.4 ambiguidade, redundância e quebra de coerência | 13 | OK |
| P05.1 sentido da palavra no contexto e substituição sem mudar o sentido | 134 | OK |
| P05.2 denotação, conotação e polissemia | 113 | IK01 + ponto: expressão idiomática ('pagar o pato', 'cair como um pato') [fonte: https://dicionario.priberam.org/pato]. |
| P05.3 sinonímia, antonímia e campo semântico | 23 | novo tópico IK35 (sinonímia, antonímia, hiperonímia/hiponímia, parte-todo, campo semântico); o único tópico ligado (PK47) só tratava de homônimos e parônimos. |
| P05.4 variação linguística, registro e adequação | 121 | OK |
| P06.1 metáfora, comparação e metonímia | 105 | OK |
| P06.2 figuras de pensamento: ironia, antítese, paradoxo, eufemismo, hipérbole, personificação | 98 | OK |
| P06.3 figuras de som e de construção: aliteração, anáfora, elipse, hipérbato, zeugma, pleonasmo | 46 | IK05 + ponto: palavra expletiva (de realce). |
| P07.1 substantivo, adjetivo e advérbio: classificação e função | 53 | PK01 + ponto: classe gramatical e rima rica × pobre (questões de soneto). |
| P07.2 pronomes: classificação e emprego | 26 | PK05 (+ ponto: as quatro classes de 'a'), PK31 (funções do 'que') e PK32 (funções do 'se') passam a ligar a P07.2 (estavam com subs vazio). |
| P07.3 verbo: tempo, modo, aspecto e flexão | 60 | PK24 + ponto: tempo com valor de outro (presente pelo futuro, presente histórico, mais-que-perfeito simples em -ra em Camões). |
| P07.4 formação de palavras: derivação, composição e sentido do afixo | 110 | PK13 + ponto: cruzamento vocabular / palavra-valise [fonte: https://www.scielo.br/j/delta/a/NHKKfy8CJMGBXyZRsc7fTLR/?lang=pt]. |
| P08.1 sujeito e predicado, inclusive sujeito oculto e oração sem sujeito | 38 | OK |
| P08.2 objeto direto e indireto, complemento nominal e agente da passiva | 28 | PK17 + 2 pontos: objeto pleonástico; pronomes combinados (lho, no-lo, vo-lo). |
| P08.3 adjunto adnominal e adverbial, aposto e vocativo | 29 | OK |
| P08.4 transitividade verbal e predicação | 14 | PK17 (mesmos 2 pontos acima). |
| P09.1 coordenação e o sentido de cada conjunção coordenativa | 33 | PK27 + ponto: 'e' com valor adversativo. |
| P09.2 orações subordinadas substantivas | 12 | OK |
| P09.3 orações subordinadas adjetivas: restritiva × explicativa | 26 | OK |
| P09.4 orações subordinadas adverbiais | 76 | PK30 + 2 pontos: 'posto que' concessiva e 'feito' comparativa [fontes: https://ciberduvidas.iscte-iul.pt/consultorio/perguntas/posto-que/8600 ; https://ciberduvidas.iscte-iul.pt/consultorio/perguntas/a-origem-da-conjuncao-comparativa-feito/29932]; condicional pelo subjuntivo anteposto. |
| P09.5 orações reduzidas de infinitivo, gerúndio e particípio | 8 | OK |
| P10.1 concordância verbal e nominal | 46 | OK |
| P10.2 regência verbal e nominal, e crase | 52 | OK |
| P10.3 colocação pronominal: próclise, mesóclise e ênclise | 10 | OK |
| P10.4 pontuação: vírgula, ponto e vírgula, dois-pontos e travessão | 69 | OK |
| P10.5 vozes verbais e discurso direto, indireto e indireto livre | 88 | OK |
| P11.1 Barroco e Arcadismo | 115 | LK03 (Trovadorismo), LK04 (Humanismo, Gil Vicente), LK05 e LK06 (Classicismo, Camões), LK07 (Quinhentismo) passam a ligar a P11.1: o banco tem em P11.1 cerca de 20 questões de Camões, além de Gil Vicente, cantigas e jesuítas, e esses tópicos estavam com subs vazio. |
| P11.2 Romantismo: poesia das três gerações e prosa | 124 | OK |
| P11.3 Realismo e Naturalismo, com Machado de Assis | 151 | OK |
| P11.4 Parnasianismo e Simbolismo | 50 | OK |
| P12.1 Pré-Modernismo: Euclides da Cunha, Lima Barreto, Augusto dos Anjos | 81 | OK |
| P12.2 Modernismo de 1922, vanguardas europeias e manifestos | 142 | LK20 (Orpheu) e LK21 (Fernando Pessoa) passam a ligar a P12.2 (questões de Pessoa e Álvaro de Campos/Futurismo). |
| P12.3 Modernismo de 30: romance do Nordeste, Drummond e Bandeira | 159 | OK |
| P12.4 Geração de 45 e prosa de ruptura: Guimarães Rosa, Clarice Lispector, João Cabral | 197 | OK |
| P12.5 literatura contemporânea e autores africanos de língua portuguesa | 353 | LK21 ligado (questões de Mensagem); LK29 + ponto: Lavoura arcaica, de Raduan Nassar [fontes: https://www.scielo.br/j/ea/a/cwgBrvrP8pDVz5MdTFhLfNh/?lang=pt ; https://www.companhiadasletras.com.br/livro/9788535907650/lavoura-arcaica]; novo tópico LK39 José Saramago [fontes: https://www.nobelprize.org/prizes/literature/1998/8069-jose-saramago-1998/ ; https://www.josesaramago.org/en/biography/ ; https://www.josesaramago.org/en/book/blindness-essay/ ; https://ciberduvidas.iscte-iul.pt/artigos/rubricas/idioma/saramago-o-escritor-que-brinca-com-a-pontuacao/1691]. |

## Inglês (31 subtemas com questões)

| Subtema | Questões | Resultado |
|---|---|---|
| I01.1 tema e ideia principal | 72 | OK |
| I01.2 objetivo do texto e público-alvo | 43 | OK |
| I01.3 informação explícita | 876 | OK |
| I01.4 inferência e sentido implícito | 106 | OK |
| I01.5 título, fonte e imagem como pista de leitura | 49 | OK |
| I01.6 opinião, tom e atitude do autor | 29 | OK |
| I01.7 anúncio, campanha e cartaz | 41 | OK |
| I01.8 tirinha, cartum, charge e meme | 142 | OK |
| I01.9 poema e letra de canção | 43 | OK |
| I01.10 notícia, artigo de opinião e divulgação científica | 35 | OK |
| I01.11 aspectos culturais e questões interdisciplinares | 18 | OK |
| I02.1 sentido da palavra no contexto e sinônimos | 221 | OK |
| I02.2 falsos cognatos | 5 | OK |
| I02.3 phrasal verbs | 14 | I02.3 + ponto: look after, see off, turn on/off, pick up, point out, settle on. |
| I02.4 expressões idiomáticas e provérbios | 46 | OK |
| I02.5 formação de palavras: prefixos e sufixos | 13 | OK |
| I03.1 referência pronominal: it, they, this, which | 83 | OK |
| I03.2 conectivos e relações lógicas | 104 | OK |
| I03.3 modais e grau de certeza | 15 | I03.3 + ponto: Can I / Could I / May I para pedido, permissão e oferta. |
| I03.4 comparativos, superlativos, intensificadores e quantificadores | 22 | I03.4 + 3 pontos: much/far/a lot + comparativo [fonte: https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/modifying-comparatives ; https://dictionary.cambridge.org/grammar/british-grammar/comparison-adjectives-bigger-biggest-more-interesting]; usos de 'even'; do/does/did enfático. I03.8b + ponto: 'some' em ofertas (I03.8b é ligado a I03.4 e I03.8). |
| I03.5 voz passiva | 13 | I03.5 + ponto: passiva de contínuos e de modal perfeito. |
| I03.6 discurso direto e indireto | 7 | OK |
| I03.7 condicionais e orações relativas | 30 | inversão negativa (pergunta de gramática em I03.7) coberta pelo ponto novo de I03.9; I03.7 não muda. |
| I03.8 classes de palavras: substantivo, adjetivo, pronome e preposição | 65 | I03.8 + ponto: paralelismo; I03.8b + ponto: 'some' em ofertas. |
| I03.9 negação e palavras de sentido restritivo | 8 | I03.9 + 2 pontos: inversão negativa [fonte: https://learnenglish.britishcouncil.org/free-resources/grammar/c1/inversion-after-negative-adverbials]; compostos somebody/nobody/anybody. |
| I04.1 presente simples e contínuo | 4 | I04.1 + ponto: imperativo × presente simples. |
| I04.2 passado simples, contínuo e used to | 9 | OK |
| I04.3 present perfect × simple past | 13 | OK |
| I04.4 past perfect e sequência de tempos | 3 | OK |
| I04.5 futuro: will, going to e presente com valor de futuro | 4 | I04.5 + ponto: future perfect com 'by + data futura'. |
| I04.6 verbos irregulares, gerúndio e infinitivo | 13 | I04.6b + ponto: lie/lay/lie (mentir) [fontes: https://dictionary.cambridge.org/grammar/british-grammar/lay-or-lie ; https://www.merriam-webster.com/grammar/how-to-use-lay-and-lie]. |

## Observações

- P01.2: uma questão do banco classifica palavras (artigo, preposição, pronome) e está fora do subtema; o conteúdo já está em PK05, agora ligado a P07.2. Vale reclassificar a questão (fora do escopo deste trabalho).
- Questões com texto apenas em imagem (sem transcrição) foram auditadas pelo campo `conceito` quando ele existe.
- Total: 161 subtemas auditados; 50 com acréscimo ou nova ligação; ids novos: G33 (mat), IK35 e LK39 (por).
