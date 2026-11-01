# Revisão de conteúdo — Matemática e Português

Data: 29/10/2026. Campos alterados: `teoria` (resumo, formulas, erro), `conceito`, `pista`. Nenhum `gab`, `nomesub` ou `glossario` alterado (por/glossario está vazio; nomesub conferido sem erro).
Backups: `mat|por/index.html.bak_conteudo`, `mat|por/dados.json.bak_conteudo`. Banco: mat 611, por 541 (inalterado). JSON válido e idêntico no index.html e no dados.json.

## Matemática

| # | onde | antes | depois | motivo |
|---|---|---|---|---|
| 1 | teoria M01 formulas | ⁿ√(aᵐ) = a^(m/n) | ⁿ√(aᵐ) = a^(m/n)  (a > 0) | condição de existência: para a < 0 e n par a igualdade falha |
| 2 | teoria M01 formulas | a⁻ⁿ = 1/aⁿ | a⁻ⁿ = 1/aⁿ (a ≠ 0) | condição de existência |
| 3 | teoria M01 formulas | MMC × MDC = produto dos dois números | MMC × MDC = produto dos dois números (inteiros positivos) | a relação vale para dois números inteiros positivos (não para três) |
| 4 | teoria M02 formulas | direta: aumenta uma, aumenta a outra → mantém a ordem | direta: dobrando uma, a outra dobra (razão constante) → mantém a ordem | “aumenta/diminui” não caracteriza proporcionalidade (y = x + 1 também cresce e não é proporcional) |
| 5 | teoria M02 formulas | inversa: aumenta uma, diminui a outra → inverte uma das razões | inversa: dobrando uma, a outra cai à metade (produto constante) → inverte uma das razões | idem: proporção inversa exige produto constante |
| 6 | teoria M03 erro | Somar 10% + 10% e achar 20%: o resultado é 21%, porque 1,1 × 1,1 = 1,21. | Em dois aumentos sucessivos de 10%, somar e achar 20%: o aumento total é de 21%, porque 1,1 × 1,1 = 1,21. | “10% + 10% = 21%” lido isoladamente é falso; explicitar que são aumentos sucessivos |
| 7 | teoria M04 formulas | x = −b/a | x = −b/a (a ≠ 0) | condição de existência |
| 8 | teoria M04 formulas | (−b ± √Δ)/2a | (−b ± √Δ)/(2a) | sem parênteses, “/2a” lê-se como (…/2)·a |
| 9 | teoria M04 formulas | inverte o sinal | inverte o sentido da desigualdade | o que se inverte é o sentido (< vira >), não o sinal |
| 10 | teoria M04 erro | inverter o sinal da desigualdade | inverter o sentido da desigualdade | idem |
| 11 | teoria M05 formulas | x_v = −b/2a  ·  y_v = −Δ/4a | x_v = −b/(2a)  ·  y_v = −Δ/(4a) | parênteses no denominador (conferido em sympy) |
| 12 | teoria M06 formulas | f(x) = a · bˣ, b = fator por período | f(x) = a · bˣ, b = fator por período (b > 0, b ≠ 1) | condição de existência da exponencial |
| 13 | teoria M06 formulas | log_b(a) = x  ⇔  bˣ = a | log_b(a) = x  ⇔  bˣ = a  (a > 0, b > 0, b ≠ 1) | condição de existência do logaritmo |
| 14 | teoria M06 formulas | log(a·b) = log a + log b  ·  log(a/b) = log a − log b | log(a·b) = log a + log b  ·  log(a/b) = log a − log b  (a, b > 0) | propriedades só valem com a, b > 0 |
| 15 | teoria M07 formulas | S_n = a₁(qⁿ − 1)/(q − 1) | S_n = a₁(qⁿ − 1)/(q − 1)  (q ≠ 1) | com q = 1 a fórmula divide por zero (S_n = n·a₁); conferido em sympy |
| 16 | teoria M08 formulas | setor de ângulo θ: A = (θ/360)·πr² | setor de ângulo θ (em graus): A = (θ/360)·πr² | unidade do ângulo |
| 17 | teoria M09 formulas | Pitágoras: a² = b² + c² | Pitágoras: a² = b² + c² (a = hipotenusa) | identificar a hipotenusa |
| 18 | teoria M09 formulas | relações métricas: a·h = b·c  ·  b² = a·m  ·  h² = m·n | relações métricas: a·h = b·c  ·  cateto² = hipotenusa × projeção desse cateto  ·  h² = m·n (m, n = projeções) | “b² = a·m” depende de convenção não definida no texto (conferido: 3-4-5) |
| 19 | teoria M10 formulas | = 2R | = 2R (R = raio da circunferência circunscrita) | definir R |
| 20 | teoria M16 formulas | \|z\| = √(a² + b²) | z = a + bi: \|z\| = √(a² + b²) | definir a e b |
| 21 | teoria M17 formulas | em mudança de base, divida sucessivamente pela base nova | de base 10 para a base b, divida sucessivamente por b e leia os restos de baixo para cima | o algoritmo só vale partindo da base 10 e faltava a leitura dos restos |
| 22 | 14854ecf conceito | 0 <= resto | 0 ≤ resto | notação brasileira |
| 23 | P07eccef conceito | e >= 0 e d >= 0 | e ≥ 0 e d ≥ 0 | notação brasileira |
| 24 | W305db29 conceito | (lado direito >= 0) | (lado direito ≥ 0) | notação brasileira |
| 25 | 8120d5a2 conceito | (a^25)² = a^50 para estimar 1,05^50 | (a²⁵)² = a⁵⁰ para estimar 1,05⁵⁰ | notação brasileira |
| 26 | P9c55f95 conceito | contar 26^10, quebrar em 2^10.13^10 | contar 26¹⁰, quebrar em 2¹⁰ · 13¹⁰ | notação brasileira |
| 27 | P3600556 conceito | usar log2=0,3 | usar log 2 = 0,3 | notação brasileira |
| 28 | P26b0fc4 conceito | log2=0,30 | log 2 = 0,30 | notação brasileira |
| 29 | P8b13820 conceito | isolar u^7 | isolar u⁷ | notação brasileira |
| 30 | 865aa9f8 conceito | (1,1)^n = 2 | (1,1)ⁿ = 2 | notação brasileira |
| 31 | W26d1288 conceito | (2^(log_3 log_2 x) = 1/2) | (2^(log₃ log₂ x) = 1/2) | notação brasileira |
| 32 | Waa65611 conceito | log_5(2x/(x+1))=-1 | log₅(2x/(x + 1)) = −1 | notação brasileira |
| 33 | W16d7a80 conceito | M = C(1+i)^t | M = C(1 + i)ᵗ | notação brasileira |
| 34 | W40a5453 conceito | m1·m2=-1 | m₁·m₂ = −1 | notação brasileira |
| 35 | P6a37d19 conceito | ln(15) = ln3 + ln5 | ln 15 = ln 3 + ln 5 | notação brasileira |
| 36 | Pe4abaf7 conceito | sen(2x)=2senx.cosx | sen 2x = 2 sen x · cos x | notação brasileira |
| 37 | f00105b5 conceito | yv = f(−b/2a) (ou −Δ/4a) | y_v = f(−b/(2a)) (ou −Δ/(4a)) | notação brasileira |
| 38 | E9ee4fbd conceito | s=θ·r | s = θ·r | notação brasileira |
| 39 | Pd553662 conceito | 2⁶ - 1 | 2⁶ − 1 | notação brasileira |
| 40 | P2ea2843 conceito | 1.o grau | 1.º grau | ordinal |
| 41 | W473f90c conceito | 1.o grau | 1.º grau | ordinal |
| 42 | W57cac95 conceito | 2.o grau | 2.º grau | ordinal |
| 43 | Pa9f2935 conceito | 19o termo | 19.º termo | ordinal |
| 44 | P52ba6c8 conceito | 1º grau | 1.º grau | ordinal |
| 45 | 96e70b70 conceito | 3x3 | 3×3 | sinal de vezes em dimensão de matriz/sistema |
| 46 | 098bfb3c conceito | 3x3 | 3×3 | sinal de vezes em dimensão de matriz/sistema |
| 47 | 62a68f59 conceito | 3x3 | 3×3 | sinal de vezes em dimensão de matriz/sistema |
| 48 | P1ca8c20 conceito | 2x2 | 2×2 | sinal de vezes |
| 49 | Pa51952e conceito | 2x2 | 2×2 | sinal de vezes |
| 50 | Pe53a666 conceito | 2x2 | 2×2 | sinal de vezes |
| 51 | P15af562 conceito | 2x2 | 2×2 | sinal de vezes |
| 52 | W6b1119d conceito | 2x2 | 2×2 | sinal de vezes |
| 53 | W3777e50 conceito | 2x2 | 2×2 | sinal de vezes |
| 54 | P07eccef conceito | sistema 2x3 | sistema 2×3 | sinal de vezes |
| 55 | P411fdf4 conceito | usar que a diagonal BL do losango bissecta o ângulo em L, logo o ângulo BLO vale os mesmos 30º do enunciado, e só então tirar BL = 2·2·cos30º para alimentar o retângulo | como O está sobre LU, o ângulo BLO é o próprio ângulo de 30° do enunciado; no triângulo isósceles BOL (BO = OL = 2) tira-se BL = 2·2·cos 30° = 2√3 e daí os lados do retângulo | a justificativa “a diagonal bissecta o ângulo” contradizia a pista (o ângulo BLO é o próprio ângulo dado, pois O ∈ LU); símbolo de grau ° |
| 56 | P411fdf4 pista | 30º | 30° | símbolo de grau (º é ordinal) |
| 57 | Pd07bb6e conceito | 180º | 180° | símbolo de grau |
| 58 | E5938146 conceito | mantissas | coeficientes | em notação científica o termo é coeficiente; mantissa é a parte decimal do logaritmo |
| 59 | Pe41b829 conceito | auto-referente | autorreferente | AO1990: auto + r dobra o r, sem hífen |
| 60 | Ed396d93 conceito | 'vai-um' | 'vai um' | grafia sem hífen, coerente com a pista |
| 61 | b5e37061 conceito | um-a-um | um a um | AO1990, Base XV: locuções sem hífen |
| 62 | P5753d79 conceito | Sistema da 1ª semana: x + y = 80 e 25x + 30y = 2290, dando x = 22 brancas e y = 58 coloridas. Na 2ª semana compra o dobro (44 e 116), e pelos preços d | Resolver o sistema da 1.ª semana (x + y = 80 e 25x + 30y = 2 290: 22 brancas e 58 coloridas) e perceber que, ao dobrar as quantidades, o total de 160 camisas passa para a faixa de 101 a 200 unidades. | texto truncado; conta conferida |
| 63 | P5753d79 pista | aplique os preços da faixa de maior quantidade da tabela | aplique os preços da faixa em que cai o novo total de camisas | 160 camisas não caem na faixa de maior quantidade; a pista levava ao erro |
| 64 | P7b015a0 conceito | 16·h = 8, logo h =  | 16·h = 8, logo h = 0,5 cm. | texto truncado; 8/16 = 0,5 |
| 65 | P26ce383 conceito | A simetria em relação à reta t preserva a área, então a área de P′Q′R′S′ é igual à de PQRS. Decompondo em partes sobre os quadrículos: 2·7 + (2·1)/2 + | A simetria em relação à reta t preserva a área, então a área de P′Q′R′S′ é igual à de PQRS; basta calcular a área de PQRS pelas coordenadas de P, Q, R e S (decompondo sobre os quadrículos ou pelo determinante). | texto truncado |
| 66 | Pa1aab41 conceito | = 18 + 18 + 18 = 54. Média  | = 18 + 18 + 18 = 54. Média = (18·15 + 18·16 + 18·17) ÷ 54 = 16 anos. | texto truncado; média conferida |
| 67 | P3600556 pista | que número elevado a 10 dá esse expoente? | 10 elevado a esse expoente dá que número? | a pergunta estava invertida (o que se calcula é 10^0,6) |
| 68 | Pe6898d1 pista | Os três lados de que você precisa são AC, CE e AE. Um deles o enunciado quase entrega. Para os outros dois, trace a altura do ponto A até o lado BE e prolongue esse tracejado até a base CD: ele cria dois triângulos retângulos novos, e é neles que Pitágoras funciona. | Os três lados de que você precisa são AC, CE e AE. AE o enunciado quase entrega, e CE é a diagonal do retângulo. Para AC, trace a altura do ponto A até o lado BE e prolongue esse tracejado até a base CD: ele cria um triângulo retângulo com hipotenusa AC, e é nele que Pitágoras funciona. | CE é diagonal do retângulo, não sai da altura auxiliar; a pista dizia que a altura gerava os dois lados |
| 69 | Pb41adae conceito | b·H·sen θ | b·L·sen θ | os lados fixos são b e L (como na pista); H não existe |
| 70 | eabcfacc conceito | de tg(2a) obter sen a e cos a e calcular a área por (1/2)·AD·AB·sen a | de tg 2α obter sen α e cos α e calcular a área por (1/2)·AD·AB·sen α | notação: ângulo em letra grega, sem parênteses desnecessários |
| 71 | P8da6610 conceito | duas etapas: completar o quadrado/achar o centro e deduzir o raio pela tangência | duas etapas: completar a praça quadrada e achar o centro do prédio; depois deduzir o raio pela tangência | “completar o quadrado” sugere a técnica algébrica; aqui é completar a figura |

Fonte geral (Matemática): recalculado em Python/sympy; convenções de notação brasileira (ABNT/livros didáticos).

## Português

| # | onde | antes | depois | motivo |
|---|---|---|---|---|
| 1 | teoria P04 formulas | elipse é termo omitido e recuperável; artigo sozinho diante de preposição (a da sopa, na da ética) esconde um substantivo | elipse é termo omitido e recuperável; o/a sozinho diante de de (a da sopa, na da ética) retoma um substantivo omitido; a gramática tradicional o classifica como pronome demonstrativo (= aquela) | na gramática normativa (Cegalla, Bechara) esse “a” = aquela é pronome demonstrativo, não artigo |
| 2 | teoria P04 erro | porque pois justifica o que já foi dito e portanto conclui a partir dele. | porque pois, no início da oração, justifica o que já foi dito, e portanto conclui a partir dele (posposto ao verbo, entre vírgulas, pois também conclui). | pois posposto ao verbo é conjunção conclusiva (Bechara; Cunha & Cintra) |
| 3 | teoria P05 resumo | como ascender e acender | como eminente e iminente | ascender/acender são homófonos (mesmo som), não parônimos |
| 4 | teoria P05 formulas | parônimos trocam de sentido por uma letra: ascender é subir e acender é pôr fogo; | parônimos trocam de sentido por um detalhe de grafia e de som: eminente é ilustre e iminente é prestes a acontecer; | ascender/acender são homófonos; e infringir/infligir diferem em mais de uma letra |
| 5 | teoria P06 formulas | (como, tal qual, mais que) | (como, tal qual, assim como) | “mais que” é comparativo de superioridade; o exemplo canônico de conectivo comparativo é “assim como” |
| 6 | teoria P06 formulas | anacoluto: a frase começa com um termo que depois fica sem função sintática, retomado só por um resumo do tipo tudo isso | anacoluto: a frase começa com um termo que fica solto, sem função sintática, porque a construção muda no meio; muitas vezes ele é retomado depois por um pronome ou um resumo do tipo tudo isso | a retomada não é obrigatória nem só por resumo (ex.: “Eu, parece que me esqueceram”) |
| 7 | teoria P07 formulas | palavra-valise funde duas palavras inteiras numa só forma | palavra-valise funde pedaços de duas palavras numa só (portunhol, showmício) | no cruzamento vocabular as palavras entram truncadas, não inteiras |
| 8 | teoria P08 resumo | é a oração com um verbo só | é a oração com um verbo (ou locução verbal) só | locução verbal também forma período simples |
| 9 | teoria P08 formulas | um verbo de ação e um predicativo, que é a palavra que qualifica o sujeito | um verbo significativo (não de ligação) e um predicativo, que qualifica o sujeito ou o objeto | o verbo não precisa ser de ação, e o predicativo pode ser do objeto (julgaram-no culpado) |
| 10 | teoria P08 formulas | complemento nominal completa nome abstrato vindo de verbo e é o alvo da ação; adjunto adnominal apenas especifica o nome | complemento nominal completa um nome (substantivo abstrato, adjetivo ou advérbio) e, junto de substantivo, é o alvo da ação; adjunto adnominal especifica o nome e, quando há ação, é o agente (o amor da mãe = adjunto; o amor à mãe = complemento) | CN também completa adjetivo e advérbio (útil a todos); critério agente/paciente com exemplo |
| 11 | teoria P10 resumo | As provas do Albert Einstein trazem discurso direto e indireto em todos os anos de 2020 a 2024, além de vozes verbais e concordância. | As provas do Albert Einstein cobram com frequência discurso direto e indireto, além de vozes verbais e concordância. | afirmação “todos os anos de 2020 a 2024” não se confirma no próprio banco (P10.5 Einstein: 2019, 2022, 2023, 2025, 2027) |
| 12 | teoria P10 formulas | haver e fazer no sentido de existir e de tempo decorrido ficam no singular | haver no sentido de existir ou de tempo decorrido, e fazer no sentido de tempo decorrido, ficam no singular | fazer não tem sentido de existir |
| 13 | teoria P10 formulas | com transitivo indireto ele só indetermina | com transitivo indireto (ou intransitivo) ele só indetermina | vive-se bem: intransitivo também |
| 14 | teoria P10 formulas | crase é a soma da preposição a com o artigo a: não existe diante de verbo nem de palavra masculina | crase é a soma da preposição a com o artigo a (ou com o a inicial de aquele, aquela, aquilo): em regra não ocorre diante de verbo nem de palavra masculina, salvo quando subentendido à moda de (sapatos à Luís XV) | incluir crase com aquele/aquilo e a exceção “à moda de” |
| 15 | teoria P10 erro | como em vou ver, que no indireto dá veria. | como em vou ver, que no indireto dá ia ver ou veria, nunca via. | ia ver é a transposição direta da locução; o erro típico é “via” |
| 16 | teoria P12 formulas | na poesia, Drummond e Bandeira põem | na poesia, Drummond e Bandeira (que vinha de 1922) põem | Bandeira é da geração de 1922 (Os sapos lido na Semana) |
| 17 | Pee52bf3 conceito | As estrofes de Camões aludem ao projeto português de império: os objetivos das conquistas e a natureza das navegações oceânicas, ligadas ao controle d | A estrofe de Camões alude ao projeto português de império: os objetivos das conquistas (estender a fé e o Império) e a natureza das navegações oceânicas (vencer inimigos e trabalhos excessivos em clima remoto). | texto truncado; a questão traz uma estrofe só |
| 18 | Pee52bf3 pista | Pergunte do que as estrofes falam | Pergunte do que a estrofe fala | a questão traz uma estrofe só |
| 19 | P9537783 conceito | reconhecendo o artigo que sozinho retoma o nome omitido | reconhecendo o “a” isolado (a da sopa) que retoma o nome omitido | coerente com a teoria P04 (pronome demonstrativo na gramática tradicional) |
| 20 | P9537783 pista | sobra um artigo sem nome depois dele | sobra um “a” ou “o” sem nome depois dele | idem |
| 21 | P83f064b pista | são sempre sinal | costumam ser sinal | “sempre” é falso (ex.: “na da Silva”, nome próprio) |
| 22 | W15af053 pista | caçando duas palavras | caçando dois pares de palavras | a pista lista quatro palavras em dois pares |
| 23 | Pf387c35 pista | burocracia de cartório | burocracia de repartição pública | o texto da questão trata de repartição pública, não de cartório |
| 24 | P5bd44e6 pista | então alguns gostariam | então alguns gostavam | correlação de tempos: “se nem todos gostavam, alguns gostavam”; o futuro do pretérito não cabe |
| 25 | Pc959f02 conceito | ("se", "o", "que") | ("se", "o", "mas", "para") | as alternativas da questão trazem se, o, mas e para, não que |
| 26 | Pc959f02 pista | Classifique primeiro o se da frase de referência: transforme a oração em passiva com ser e veja o que acontece. Depois procure, entre as alternativas, um termo que também substitua alguma coisa já dita. | Classifique primeiro o se da frase de referência: troque pela voz passiva com ser (só lhes sejam vistas as cabeças) e você verá que ele é pronome apassivador. Depois procure, entre as alternativas, o único termo que também é pronome — cuidado com os “o” que não acompanham substantivo. | a pista dizia que o termo procurado “substitui algo já dito”, mas a resposta é pronome não anafórico; reescrita pelo critério de classe |
| 27 | Pa177358 conceito | Ver que “Um, dois, três lampiões” é objeto direto de “acende”, e não complemento de “continua”, intransitivo. | Ver que “Um, dois, três lampiões” é objeto direto de “acende”; “continua” forma locução com “a acender”, cujo objeto é “outros mais”. | “continua” não é intransitivo aqui: é auxiliar da locução continua a acender |
| 28 | Pe6cfd55 pista | Olhe a forma “fizer”. Ela é de um tempo verbal que só aparece depois de duas conjunções em português. Descubra quais e a questão se fecha. | Olhe a forma “fizer”: é futuro do subjuntivo, tempo que aparece depois de palavras como se, quando e enquanto. Veja qual dessas palavras abre o trecho e a questão se fecha. | o futuro do subjuntivo aparece após várias conjunções e relativos (se, quando, enquanto, logo que, quem…), não só duas |
| 29 | Pc786f71 pista | A escola certa é a única que aceita todas, e duas das escolas oferecidas nem existiam ainda quando o movimento descrito reagiu ao que veio antes. | A escola certa é a única que aceita todas. | afirmação sobre as alternativas não confere com a questão |
| 30 | Pd9e25bd pista | Ela sozinha datam o texto no século XX e derrubam | Ela sozinha data o texto no século XX e derruba | concordância com o sujeito “ela” |
| 31 | Wac6bf4d pista | Olhe os dois sons inventados que aparecem um embaixo do outro: 'Cantabona! Cantabona!' e 'Dlorom...'. Um é tambor indígena, o outro é corda europeia. O poema põe os dois lado a lado, sem escolher. Pergunte o que isso significa para a identidade nacional. | Olhe o último verso: 'Sou um tupi tangendo um alaúde!'. O tupi é o nativo; o alaúde é instrumento europeu. O poema põe os dois lado a lado, sem escolher. Pergunte o que isso significa para a identidade nacional. | atribuição “tambor indígena/corda europeia” a Cantabona e Dlorom não tem apoio; o verso final (O trovador, Pauliceia desvairada) é a imagem documentada |
| 32 | W0c5d26d pista | a fala do padre e a última palavra do texto. Um é um ditado do sertão reaproveitado, o outro é uma palavra que você não encontra no dicionário. | a fala do padre e o adjetivo que vem no fim do texto, logo antes de “torpor”. Um é um ditado do sertão reaproveitado, o outro é uma palavra que você não encontra no dicionário. | a última palavra (“torpor”) está no dicionário; o neologismo é “desvencido” |
| 33 | P9121d7f conceito | faz-de-conta | faz de conta | AO1990, Base XV, 6.º: locuções não levam hífen |

Fonte geral (Português): Bechara, Moderna Gramática Portuguesa; Cunha & Cintra, Nova Gramática; Acordo Ortográfico 1990 / VOLP; texto da própria questão.

## Suspeitas registradas (não alteradas)

- mat E109d981: o enunciado diz “1 200 células mortas”, mas o gab 205 só fecha com “1 200 células no total”. Conferir o original.
- mat P9563ac2: a reta do enunciado provavelmente perdeu o sinal (y = −3x/2 + 7/2) para bater com a figura e com o gab A.
- mat 021d9373: o texto fala em “ângulo agudo”, mas o ângulo calculado é 93°.
- mat questões duplicadas no banco: c59190e5 / Pfc381ab; P5753d79 / 4155b637; 55040d62 / P7b015a0; P26ce383 / 1cf704d4.
- Demais gabaritos de mat recalculados e confirmados (ex.: 62a68f59 com sympy: det = 3(a + 2), alternativa D = sistema determinado). Gabaritos de por conferidos contra o texto; nenhum erro comprovado.
- Literatura conferida sem erro: Libertinagem (1930); “No meio do caminho” na Revista de Antropofagia (1928); Manifesto do Surrealismo (1924); Manifesto da Poesia Pau-Brasil (1924).
