# Análise: os 50 flashcards de Matemática (pedido do Vitor, 29/10)

## Método

1. Banco `mat`: 611 questões; descartadas 98 de sites (Brasil Escola, Mundo Educação, Prepara Enem, InfoEscola). Ficaram **513 questões de prova** (Fatec, Unesp, Einstein, Fuvest, Famema, Santa Casa, Sírio-Libanês, FMJ, São Camilo).
2. Peso por questão: São Camilo × 3; provas de 2021 em diante × 1,5 (os dois se multiplicam). Contagem por conteúdo (`sub`) e leitura do campo `conceito` de cada questão dos 14 conteúdos de topo, para separar as **ideias** cobradas.
3. Fontes externas (levantamentos de cursinhos) para calibrar o peso dos temas:
   - Aprova Total, ENEM 2016–2025: matemática básica 37,3%, estatística 11,2%, geometria espacial 11,2%, funções 10,2%, geometria plana 7,7%, probabilidade 5,2%, combinatória 4,1%, trigonometria 3,7%. https://aprovatotal.com.br/matematica-no-enem/
   - Aprova Total, Fuvest 2012–2026: matemática básica 18,9%, funções 11,9%, geometria espacial 10,5%, trigonometria 9,8%, geometria plana 7,7%. https://aprovatotal.com.br/o-que-mais-cai-na-fuvest/
   - Aprova Total, Unesp: matemática básica 22,1%, funções 15,3%, geometria plana 15,3%, probabilidade 9,9%, geometria espacial 9,9%, trigonometria 8,4%. https://aprovatotal.com.br/o-que-mais-cai-na-unesp/
   - Estratégia Vestibulares, Fuvest 1.ª fase 2011–2021: funções 16,9%, geometria plana 15,4%, aritmética 8,5%, probabilidade 7,7%, geometria espacial 6,2%, analítica 6,2%, sistemas lineares 4,6%. https://vestibulares.estrategia.com/portal/enem-e-vestibulares/vestibulares/assuntos-que-mais-caem-na-fuvest-usp-primeira-fase/
   - SAS Educação via CNN Brasil (Fuvest 2007–2024): geometria plana, 58 de 407 questões de Matemática. https://www.cnnbrasil.com.br/educacao/fuvest-veja-ranking-dos-temas-mais-cobrados-entre-2007-e-2024/
   - Não há levantamento público de incidência da São Camilo; usaram-se as questões dela no banco (9 registros, mas só 5 questões distintas: 4 aparecem duplicadas como "2024" e "2024/2"; a duplicação foi mantida na contagem e merece limpeza no banco) (2024 e 2024/2: sistemas/modelagem, PA, volume deslocado em cubos, área por coordenadas, média ponderada).
4. Escolha: 1 cartão por ideia; conteúdos de maior peso recebem mais cartões. Ordem por importância; peso 3 nos 20 primeiros, 2 nos 30 seguintes.
5. Conferência: valores dos cartões novos checados com sympy (ângulos notáveis; sistema 3x + 2y = 17, 2x + 3y = 13 → x = 5, y = 1). Gravação com `dados_util`; JSON válido, banco idêntico, só `flash` mudou. Cópias: `mat/index.html.bak_flash50` e `mat/dados.json.bak_flash50`.

## Incidência por conteúdo (questões de prova)

| Conteúdo | Nome | Questões | São Camilo | Peso | % do peso |
|---|---|---|---|---|---|
| M04.3 | sistemas lineares | 23 | 1 | 33.0 | 4.8% |
| M11.1 | prismas e cubos | 19 | 2 | 31.5 | 4.6% |
| M03.1 | porcentagem simples | 20 |  | 25.5 | 3.7% |
| M04.5 | problemas de modelagem algébrica | 17 | 1 | 24.0 | 3.5% |
| M10.1 | razões trigonométricas no triângulo retângulo | 16 |  | 21.0 | 3.0% |
| M14.2 | leitura de tabelas e gráficos | 17 |  | 21.0 | 3.0% |
| M17.1 | raciocínio lógico e dedução | 18 |  | 21.0 | 3.0% |
| M06.3 | definição e propriedades do logaritmo | 15 |  | 20.5 | 3.0% |
| M01.4 | divisibilidade, MMC e MDC | 16 |  | 19.5 | 2.8% |
| M02.1 | razão e proporção | 15 |  | 19.5 | 2.8% |
| M13.4 | probabilidade simples | 15 |  | 18.5 | 2.7% |
| M05.2 | função quadrática e vértice | 13 |  | 18.0 | 2.6% |
| M14.1 | média, mediana e moda | 13 |  | 18.0 | 2.6% |
| M13.1 | princípio multiplicativo | 14 |  | 16.5 | 2.4% |
| M07.1 | progressão aritmética | 7 | 2 | 16.0 | 2.3% |
| M12.5 | áreas por coordenadas | 6 | 2 | 15.0 | 2.2% |
| M13.3 | combinações | 11 |  | 15.0 | 2.2% |
| M11.2 | cilindros | 11 |  | 14.0 | 2.0% |
| M11.3 | pirâmides e cones | 9 |  | 13.0 | 1.9% |
| M13.2 | arranjos e permutações | 11 |  | 13.0 | 1.9% |
| M01.3 | notação científica e ordem de grandeza | 10 |  | 12.0 | 1.7% |
| M07.3 | soma de termos | 9 |  | 12.0 | 1.7% |
| M10.4 | ciclo trigonométrico e arcos | 8 |  | 12.0 | 1.7% |
| M03.2 | aumentos e descontos sucessivos | 8 |  | 10.5 | 1.5% |
| M08.3 | circunferência e círculo | 9 |  | 10.5 | 1.5% |
| M13.6 | união, intersecção e evento complementar | 8 |  | 10.0 | 1.4% |
| M08.5 | áreas compostas e hachuradas | 7 |  | 9.5 | 1.4% |
| M14.4 | média ponderada | 5 | 1 | 9.5 | 1.4% |
| M12.4 | circunferência no plano cartesiano | 6 |  | 8.5 | 1.2% |
| M02.2 | regra de três simples e composta | 7 |  | 8.0 | 1.2% |
| M06.2 | equação exponencial | 6 |  | 8.0 | 1.2% |
| M13.5 | probabilidade condicional e teste diagnóstico | 6 |  | 8.0 | 1.2% |
| M02.3 | escalas e densidade | 6 |  | 7.5 | 1.1% |
| M04.2 | equação do 2.º grau | 6 |  | 7.5 | 1.1% |
| M06.1 | função exponencial | 6 |  | 7.5 | 1.1% |
| M09.3 | semelhança de triângulos | 5 |  | 7.5 | 1.1% |
| M11.5 | troncos, sólidos compostos e densidade/volume | 5 |  | 7.5 | 1.1% |
| M15.1 | operações com matrizes | 6 |  | 7.5 | 1.1% |
| M17.2 | algoritmos e sistemas de numeração | 5 |  | 7.5 | 1.1% |
| M07.4 | padrões e recorrências | 6 |  | 7.0 | 1.0% |
| M08.2 | quadriláteros | 6 |  | 7.0 | 1.0% |
| M09.5 | ângulos e propriedades | 5 |  | 7.0 | 1.0% |
| M04.4 | inequações | 4 |  | 6.0 | 0.9% |
| M05.3 | leitura de gráficos de funções | 5 |  | 6.0 | 0.9% |
| M02.4 | grandezas direta e inversamente proporcionais | 5 |  | 5.5 | 0.8% |
| M11.4 | esfera | 5 |  | 5.5 | 0.8% |
| M12.2 | equação da reta | 4 |  | 5.5 | 0.8% |
| M08.1 | triângulos | 4 |  | 5.0 | 0.7% |
| M16.1 | polinômios e relações de Girard | 4 |  | 5.0 | 0.7% |
| M06.4 | equação logarítmica | 3 |  | 4.5 | 0.7% |
| M10.3 | lei dos cossenos | 3 |  | 4.5 | 0.7% |
| M05.1 | função afim | 3 |  | 4.0 | 0.6% |
| M07.2 | progressão geométrica | 3 |  | 4.0 | 0.6% |
| M09.1 | teorema de Pitágoras | 3 |  | 4.0 | 0.6% |
| M10.2 | lei dos senos | 3 |  | 4.0 | 0.6% |
| M10.5 | funções trigonométricas e gráficos | 3 |  | 4.0 | 0.6% |
| M13.9 | combinatória e probabilidade — outros casos | 3 |  | 3.5 | 0.5% |
| M04.1 | equação do 1.º grau | 2 |  | 3.0 | 0.4% |
| M06.5 | meia-vida, decaimento e crescimento | 3 |  | 3.0 | 0.4% |
| M08.4 | polígonos regulares | 2 |  | 3.0 | 0.4% |
| M12.1 | distância entre pontos e ponto médio | 2 |  | 3.0 | 0.4% |
| M15.2 | determinantes | 3 |  | 3.0 | 0.4% |
| M16.2 | números complexos | 3 |  | 3.0 | 0.4% |
| M03.5 | dose, concentração e proporção aplicada à saúde | 2 |  | 2.5 | 0.4% |
| M09.4 | relações métricas no triângulo retângulo | 2 |  | 2.5 | 0.4% |
| M05.5 | composição e inversa | 2 |  | 2.0 | 0.3% |
| M01.2 | potências e radicais | 1 |  | 1.5 | 0.2% |
| M02.5 | divisão proporcional | 1 |  | 1.5 | 0.2% |
| M03.4 | juros compostos | 1 |  | 1.5 | 0.2% |
| M12.3 | posição relativa e paralelismo | 1 |  | 1.5 | 0.2% |
| M05.4 | função definida por partes e modular | 1 |  | 1.5 | 0.2% |
| M15.3 | aplicação em sistemas | 1 |  | 1.5 | 0.2% |

## Os 50 cartões, em ordem de importância

| # | id | Conteúdo | Peso | Frente | Por que entrou |
|---|---|---|---|---|---|
| 1 | mat-f161 | M04.3 | 3 | Num sistema, a questão pede só x + y (ou x − y), e não cada valor. Qual é o atalho? | M04.3 é o conteúdo n.º 1 do banco. Ideia repetida em Einstein 2025, FMJ 2026, Santa Casa 2026 e Fuvest 2020: somar/subtrair as equações entrega direto o pedido. Não havia cartão: criado. |
| 2 | mat-f102 | M11.1 | 3 | Qual é o volume de um prisma ou de um cilindro? | M11.1 é o 2.º conteúdo (19 questões, 2 da São Camilo). V = base × altura aparece em quase todas, inclusive em base recortada (Fatec, Einstein 2023). |
| 3 | mat-f022 | M03.1 | 3 | 35% de uma turma reprovou, e 80% desses estudam à noite. Que porcentagem da turma reprovou e estuda à noite? | Porcentagem de porcentagem é a ideia mais repetida de M03.1 (FMJ 2024, Fatec 2023/2, Einstein 2021/2027, Santa Casa 2025, Unesp 2016). |
| 4 | mat-f019 | M03.1 | 3 | Por qual fator se multiplica um valor num aumento de x%? E num desconto de x%? | Fator multiplicativo (1 ± x/100) é a base de toda questão de porcentagem e de aumentos sucessivos (M03.1 + M03.2). Matemática básica lidera ENEM, Fuvest e Unesp. |
| 5 | mat-f162 | M11.1 | 3 | Um objeto é mergulhado por inteiro num recipiente prismático com água. Quanto sobe o nível? | Volume deslocado = volume submerso: exatamente a questão de cubos da São Camilo 2024 e Famema 2020, FMJ 2026. Criado (não havia cartão). |
| 6 | mat-f065 | M07.1 | 3 | Qual é o termo geral da PA, de primeiro termo a₁ e razão r? | Termo geral da PA é a questão da São Camilo 2024 (43 a 183, n múltiplo de 9). M07.1 tem peso alto por causa dela. |
| 7 | mat-f139 | M14.1 | 3 | 5 notas têm média 7. Que 6.ª nota faz a média subir para 7,5? | Média usada ao contrário (média × n = soma) aparece em Einstein 2026, Fuvest 2025, Unesp 2024/2 e 2025/2, Famema 2025, Sírio 2027. |
| 8 | mat-f059 | M06.3 | 3 | Quanto valem log(a · b), log(a/b) e log(aⁿ), com a, b > 0? | Propriedades do log (produto, quociente, potência) estão em quase todas as 15 questões de M06.3 (Santa Casa 2018/2021, Fuvest 2019/2026, Einstein 2023). |
| 9 | mat-f163 | M10.1 | 3 | Quanto valem seno, cosseno e tangente de 30°, 45° e 60°? | M10.1 tem 16 questões; tg 60°, sen 45° e cos 60° aparecem em Unesp 2015, Famema 2018/2023/2024, FMJ 2025. Três cartões antigos fundidos em um. |
| 10 | mat-f090 | M10.1 | 3 | No triângulo retângulo, como se definem seno, cosseno e tangente de um ângulo agudo? | Definição de sen/cos/tg (escolher o cateto certo: Einstein 2023, Fatec 2018/2) é pré-requisito de todas as questões de M10.1. |
| 11 | mat-f045 | M05.2 | 3 | Quais são as coordenadas do vértice de f(x) = ax² + bx + c? | Vértice da parábola: Sírio 2025/2, FMJ 2026, Santa Casa 2027, Fuvest 2019/2020, Unesp 2024/2/2026. Funções é tema de topo em Fuvest e Unesp. |
| 12 | mat-f046 | M05.2 | 3 | Uma questão pergunta “qual é o lucro máximo”. A resposta é o xᵥ ou o yᵥ? | Máximo é yᵥ, e não xᵥ: a armadilha das questões de lucro/receita (Fuvest 2020, Unesp 2026, Sírio 2025/2). |
| 13 | mat-f008 | M01.4 | 3 | Ciclos que “voltam a coincidir” (remédios, plantões, ônibus) pedem MMC ou MDC? | MMC para ciclos que coincidem (Fatec 2017, 2018/2, Famema 2020, Einstein 2023/2). M01.4 tem 16 questões. |
| 14 | mat-f119 | M13.1 | 3 | O que diz o princípio multiplicativo da contagem? | Princípio multiplicativo: 14 questões (Famema 2023, Santa Casa 2025/2027, Einstein 2019, Fuvest 2024). |
| 15 | mat-f124 | M13.3 | 3 | Arranjo ou combinação: qual é o teste decisivo? | Teste ordem importa/não importa decide toda questão de contagem (M13.2 + M13.3 = 22 questões). |
| 16 | mat-f126 | M13.4 | 3 | Como se define a probabilidade de um evento num espaço com resultados igualmente prováveis? | Definição clássica de probabilidade: base das 15 questões de M13.4; probabilidade é ~10% na Unesp e ~8% na Fuvest. |
| 17 | mat-f020 | M03.1 | 3 | Qual é a fórmula da variação percentual de um valor antigo para um novo? | Variação percentual com base no valor antigo (Unesp 2016/2 com a armadilha da base, Fuvest 2024, Einstein 2025). |
| 18 | mat-f145 | M14.4 | 3 | Qual é a fórmula da média ponderada? | Média ponderada é a questão da São Camilo 2024 (idades 15/16/17) e Famema 2019/2021. |
| 19 | mat-f103 | M11.1 | 3 | Quanto valem 1 m³, 1 dm³ e 1 cm³ em litros? | Conversão m³/dm³/L aparece junto com volume (FMJ 2026, Unesp 2015/2, Fuvest 2019 em que a maioria erra a conversão). |
| 20 | mat-f037 | M04.3 | 3 | Quantas soluções tem um sistema SPD, um SPI e um SI? | Classificação SPD/SPI/SI: Einstein 2024 (impossível), Santa Casa 2026 e Unesp 2025/2 (indeterminado), Famema 2022. |
| 21 | mat-f057 | M06.3 | 2 | O que significa log_b a = x? | Definição de log (log = expoente) é como se inverte fórmula com log (Unesp 2019, 2025, 2025/2). |
| 22 | mat-f156 | M17.1 | 2 | Qual é a negação de “Todo médico é calmo”? | Negação do quantificador "todo" (Fatec 2017, 2019). M17.1 tem 18 questões. |
| 23 | mat-f011 | M02.1 | 2 | Meninos e meninas estão na razão 2 : 3, com 40 alunos no total. Quantos são meninos? | Razão com constante k (2k, 3k): Einstein 2021/2026, Fatec 2020, FMJ 2025, Sírio 2025/2. M02.1 tem 15 questões. |
| 24 | mat-f009 | M01.4 | 2 | “Maior tamanho possível” de partes iguais, sem sobra, pede MMC ou MDC? | MDC para maior peça sem sobra (Santa Casa 2020, Fuvest 2021). |
| 25 | mat-f024 | M03.2 | 2 | Um preço sobe 20% e depois cai 20%. Como fica em relação ao original? | Sobe 20% e cai 20% não volta ao original: armadilha clássica de M03.2 (8 questões) e de ENEM. |
| 26 | mat-f021 | M03.1 | 2 | Uma taxa passou de 10% para 15%. Quantos pontos percentuais subiu, e qual foi o aumento relativo? | Pontos percentuais × aumento relativo: Einstein 2022 ("supera em x%"), Fatec 2018/2. |
| 27 | mat-f123 | M13.3 | 2 | Qual é a fórmula da combinação de n elementos tomados p a p? | Fórmula de C(n, p): Fatec 2020 (probabilidade por combinações) e M13.3 (11 questões). |
| 28 | mat-f120 | M13.2 | 2 | Quantas são as permutações de n elementos distintos? E os arranjos de n tomados p a p? | Permutação e arranjo: M13.2 (11 questões), Einstein 2021 (bloco colado), Fuvest 2019. |
| 29 | mat-f107 | M11.2 | 2 | Planificada, a superfície lateral de um cilindro reto de raio r e altura h vira que figura? Qual é a área? | M11.2 (11 questões). Reescrito para a ideia própria do cilindro (planificação 2πr × h), já que o volume está no cartão de prisma. |
| 30 | mat-f108 | M11.3 | 2 | Qual é o volume de uma pirâmide ou de um cone? | Volume = 1/3 da base × altura: M11.3 (9 questões); geometria espacial ~10% em Fuvest/Unesp e 11% no ENEM. |
| 31 | mat-f086 | M09.3 | 2 | Se a razão de semelhança entre os lados é k, qual é a razão entre as áreas? E entre os volumes? | Razão k → áreas k² e volumes k³: Fuvest 2019 (dobrar a massa não dobra a área), troncos e escalas. |
| 32 | mat-f069 | M07.3 | 2 | Qual é a soma dos n primeiros termos de uma PA? | Soma da PA: M07.3 (9 questões), Fuvest 2019 (soma de alturas em PA). |
| 33 | mat-f134 | M13.6 | 2 | Como se calcula a probabilidade de “pelo menos um” sucesso? | "Pelo menos um" pelo complementar: M13.6 (8 questões), Sírio 2027. |
| 34 | mat-f137 | M14.1 | 2 | Como se acha a mediana de um conjunto de n valores? | Mediana com n par/ímpar: Famema 2019, Fuvest 2024; estatística é 11% no ENEM. |
| 35 | mat-f041 | M04.5 | 2 | Como se escreve o número de dois algarismos “ab” em função de a e b? | Número "ab" = 10a + b: Fatec 2017, 2017/2, Sírio 2025/2. |
| 36 | mat-f010 | M01.4 | 2 | Hoje é segunda-feira. Que dia da semana será daqui a 100 dias? | Resto por 7 para andar no calendário: Famema 2020, Fatec 2023/2, Famema 2026 (operação mod). |
| 37 | mat-f063 | M06.5 | 2 | Qual é a quantidade restante N após um tempo t, para meia-vida T e quantidade inicial N₀? | Meia-vida: fórmula que cruza com Química/Biologia e com dose de fármaco; base de M06.1/M06.5. |
| 38 | mat-f099 | M10.4 | 2 | Qual é a relação fundamental da trigonometria? | sen² + cos² = 1: usada em FMJ 2025, Famema 2026 (arco duplo) e no ciclo (M10.4, 8 questões). |
| 39 | mat-f076 | M08.3 | 2 | Quais são o comprimento da circunferência e a área do círculo de raio r? | Comprimento e área do círculo: M08.3 (9 questões) e áreas hachuradas (M08.5). |
| 40 | mat-f128 | M13.4 | 2 | Urna com 3 bolas brancas e 2 pretas. Retiram-se 2, sem reposição. Qual a probabilidade de ambas serem brancas? | Retiradas sem reposição: Santa Casa 2019, Sírio 2025/2. |
| 41 | mat-f129 | M13.5 | 2 | Qual é a fórmula da probabilidade condicional P(A | B)? | Probabilidade condicional: M13.5 (6 questões), base de teste diagnóstico, tema próprio de prova de Medicina. |
| 42 | mat-f082 | M09.1 | 2 | O que diz o teorema de Pitágoras? | Pitágoras aparece dentro de questões de outros conteúdos (Santa Casa 2019, Sírio 2027, Fatec 2018/2). |
| 43 | mat-f095 | M10.3 | 2 | O que diz a lei dos cossenos para o lado a, oposto ao ângulo A? | Lei dos cossenos: Fuvest cobra trigonometria em triângulos quaisquer (Aprova Total: 9,8%). |
| 44 | mat-f005 | M01.3 | 2 | Em notação científica, N = k × 10ⁿ. Que condição k precisa cumprir? | Notação científica: M01.3 (10 questões), comum em contexto biológico. |
| 45 | mat-f142 | M14.2 | 2 | Num gráfico de setores, que ângulo central corresponde a 25%? | Setor de 25% = 90°: FMJ 2026; leitura de gráficos (M14.2) tem 17 questões. |
| 46 | mat-f155 | M17.1 | 2 | Pelas leis de De Morgan, qual é a negação de “p e q”? E de “p ou q”? | De Morgan: Fatec 2015, 2016/2; segundo ponto mais cobrado de lógica. |
| 47 | mat-f115 | M12.4 | 2 | Qual é a equação reduzida da circunferência de centro (a, b) e raio r? | Equação da circunferência: M12.4 (6 questões), Unesp 2025/2. |
| 48 | mat-f118 | M12.5 | 2 | Como se calcula a área de um triângulo dados os três vértices por coordenadas? | Área por coordenadas: M12.5 tem peso alto por causa da São Camilo 2024 (área do quadrilátero na malha). |
| 49 | mat-f012 | M02.2 | 2 | Como reconhecer que a regra de três é inversa? | Reconhecer a regra de três inversa: M02.2 (7 questões) e M02.4. |
| 50 | mat-f031 | M04.2 | 2 | Qual é a fórmula das raízes de ax² + bx + c = 0, com a ≠ 0? | Bhaskara é etapa de muitas questões (Sírio 2025/2 em probabilidade, Famema 2024, log com x(x − 3) = 10). |

## Mudanças em relação aos 160 cartões anteriores

- **Novos:** mat-f161 (atalho de somar/subtrair as equações do sistema), mat-f162 (volume deslocado / subida do nível), mat-f163 (tabela de 30°, 45° e 60°, que substitui mat-f091, f092 e f093).
- **Reescrito:** mat-f107 (cilindro), agora sobre a planificação da superfície lateral (2πr × h), para não repetir o volume do cartão mat-f102.
- **Fora por repetir uma ideia já escolhida:** ex.: f023 (repete a lógica de f024), f048 (exemplo de f045/f046), f066 (exemplo de f065), f054 (exponencial de base 2, mesma ideia de f063), f131 (VPP, contido em f129). O restante saiu por incidência baixa no banco e nos levantamentos.
