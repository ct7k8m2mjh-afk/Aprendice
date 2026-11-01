# Flashcards de Matemática (mat) — 29/10

160 cartões gravados em D['flash'] de mat/index.html e mat/dados.json (ids mat-f001 a mat-f160).
Cópias antes da gravação: mat/index.html.bak_flash e mat/dados.json.bak_flash.

## Método
- Lidos D['teoria'] (resumo, fórmulas, erro e os 102 cartões revisados) e D['nomesub'] (79 conteúdos).
- Peso: questões do banco (611) contadas por módulo e conteúdo; os cartões seguem essa proporção, ajustada pelo que cai em Medicina (log, porcentagem, probabilidade/teste diagnóstico, geometria espacial).
- Conferência: script sympy com 101 checagens (Bhaskara, soma e produto, vértice, inequações, módulo, domínio, inversa, log e exponencial, meia-vida, somas de PA/PG, áreas, trigonometria e valores notáveis, leis dos senos e cossenos, sólidos, circunferência, contagem, probabilidade, VPP, estatística, determinantes, resto e Girard, potências de i, equivalências lógicas por tabela-verdade). Todas passaram.
- Segunda passada: caça a erro factual, pergunta com duas respostas e 'essencial' exigente demais. Ajustes: 'essencial' de regra de três inversa e de escala reduzidos a uma ideia; ordem de grandeza com o critério (√10) escrito na frente; 'nem todo médico é calmo' aceito na negação.
- Formato: frente ≤ 25 palavras, verso ≤ 35, 1–4 itens em 'essencial', vírgula decimal, sen/tg, notação Unicode. Zero emoji.
- Fontes: teoria do próprio app (já revisada em REV_CARTOES_qui_mat.md) e definições-padrão do ensino médio; nenhuma afirmação dependia de fonte externa além do conferido com sympy.

## Distribuição
| Módulo | Questões no banco | Cartões |
|---|---|---|
| M01 Fundamentos | 36 | 10 |
| M02 Razão e proporção | 39 | 8 |
| M03 Porcentagem e finanças | 44 | 12 |
| M04 Equações e sistemas | 57 | 12 |
| M05 Funções afim e quadrática | 34 | 10 |
| M06 Exponencial e logaritmo | 38 | 12 |
| M07 Sequências | 27 | 8 |
| M08 Geometria plana — áreas | 30 | 9 |
| M09 Geometria plana — relações | 22 | 8 |
| M10 Trigonometria | 43 | 12 |
| M11 Geometria espacial | 52 | 10 |
| M12 Geometria analítica | 25 | 7 |
| M13 Combinatória e probabilidade | 70 | 18 |
| M14 Estatística | 48 | 11 |
| M15 Matrizes e determinantes | 13 | 3 |
| M16 Polinômios e complexos | 10 | 4 |
| M17 Lógica e algoritmos | 23 | 6 |

Tipos: {'formula': 68, 'exemplo': 37, 'conceito': 28, 'identificar': 9, 'comparar': 6, 'processo': 12}. Pesos: {1: 10, 2: 91, 3: 59}.

## Cartões

### M01 Fundamentos
- **mat-f001** (M01.1, formula, peso 1) — Como se divide uma fração por outra: a/b ÷ c/d?  
  Verso: Multiplica-se a primeira pelo inverso da segunda: a/b ÷ c/d = a/b · d/c = ad/(bc).  
  Essencial: multiplicar a primeira pelo inverso da segunda · Aceita: inverte a segunda e multiplica; a/b · d/c; ad/bc  
  Erro comum: Inverter a primeira fração em vez da segunda.
- **mat-f002** (M01.1, exemplo, peso 2) — Usou-se 2/5 de um total e depois 1/3 do que sobrou. Que fração do total foi usada na segunda vez?  
  Verso: Sobram 3/5; 1/3 de 3/5 = 1/5 do total. O “de” entre frações vira multiplicação sobre o resto.  
  Essencial: 1/5 do total · Aceita: 0,2 do total; 20% do total; um quinto  
  Erro comum: Calcular 1/3 do total inicial em vez de 1/3 do que sobrou.
- **mat-f003** (M01.2, formula, peso 2) — Como se escreve ⁿ√(aᵐ) como potência, para a > 0?  
  Verso: ⁿ√(aᵐ) = a^(m/n): o índice da raiz vai para o denominador do expoente.  
  Essencial: a^(m/n) · Aceita: a elevado a m sobre n; a elevado a m/n  
  Erro comum: Pôr o índice no numerador e escrever a^(n/m).
- **mat-f004** (M01.2, conceito, peso 2) — Quanto valem a⁰ e a⁻ⁿ, para a ≠ 0?  
  Verso: a⁰ = 1 e a⁻ⁿ = 1/aⁿ: expoente negativo inverte a base, não muda o sinal.  
  Essencial: a⁰ = 1; a⁻ⁿ = 1/aⁿ · Aceita: (1/a)ⁿ; um sobre a elevado a n; o inverso de aⁿ  
  Erro comum: Achar que expoente negativo deixa o resultado negativo (2⁻³ = −8; o certo é 1/8).
- **mat-f005** (M01.3, conceito, peso 2) — Em notação científica, N = k × 10ⁿ. Que condição k precisa cumprir?  
  Verso: 1 ≤ k < 10: um único algarismo não nulo antes da vírgula.  
  Essencial: 1 ≤ k < 10 · Aceita: k maior ou igual a 1 e menor que 10; k entre 1 (inclusive) e 10 (exclusive)  
  Erro comum: Deixar 15 × 10⁻² como resposta; em notação científica é 1,5 × 10⁻¹.
- **mat-f006** (M01.3, exemplo, peso 2) — Pelo critério usual (comparar com √10 ≈ 3,16), qual é a ordem de grandeza de 4 × 10⁵?  
  Verso: 10⁶, porque 4 > √10 ≈ 3,16. Se k fosse menor que 3,16, a ordem seria 10⁵.  
  Essencial: 10⁶ · Aceita: dez elevado a seis; 1 000 000; um milhão  
  Erro comum: Responder só a potência da notação, 10⁵, sem comparar k com 3,16.
- **mat-f007** (M01.3, formula, peso 2) — Que potências de 10 valem os prefixos mili (m), micro (μ) e nano (n)?  
  Verso: mili = 10⁻³, micro = 10⁻⁶ e nano = 10⁻⁹.  
  Essencial: mili 10⁻³; micro 10⁻⁶; nano 10⁻⁹ · Aceita: milésimo, milionésimo, bilionésimo; 0,001; 0,000001; 0,000000001  
  Erro comum: Trocar micro (10⁻⁶) por mili (10⁻³).
- **mat-f008** (M01.4, identificar, peso 3) — Ciclos que “voltam a coincidir” (remédios, plantões, ônibus) pedem MMC ou MDC?  
  Verso: MMC: o menor múltiplo comum dos intervalos dá quando os eventos coincidem de novo.  
  Essencial: MMC · Aceita: mínimo múltiplo comum; menor múltiplo comum  
  Erro comum: Usar o MDC porque a resposta parece um número menor.
- **mat-f009** (M01.4, identificar, peso 3) — “Maior tamanho possível” de partes iguais, sem sobra, pede MMC ou MDC?  
  Verso: MDC: o maior divisor comum dá a maior peça que divide todas as medidas exatamente.  
  Essencial: MDC · Aceita: máximo divisor comum  
  Erro comum: Usar o MMC; “menor número de peças” também pede o MDC.
- **mat-f010** (M01.4, exemplo, peso 2) — Hoje é segunda-feira. Que dia da semana será daqui a 100 dias?  
  Verso: Quarta-feira: 100 = 7 · 14 + 2, então são 2 dias depois de segunda.  
  Essencial: quarta-feira · Aceita: quarta  
  Erro comum: Contar o próprio dia de hoje ou usar o quociente em vez do resto.

### M02 Razão e proporção
- **mat-f011** (M02.1, exemplo, peso 2) — Meninos e meninas estão na razão 2 : 3, com 40 alunos no total. Quantos são meninos?  
  Verso: 16: 2k + 3k = 40 dá k = 8, então 16 meninos e 24 meninas.  
  Essencial: 16 · Aceita: dezesseis  
  Erro comum: Calcular 2/3 de 40; a fração dos meninos no total é 2/5.
- **mat-f012** (M02.2, identificar, peso 3) — Como reconhecer que a regra de três é inversa?  
  Verso: Quando uma grandeza dobra e a outra cai à metade; o produto fica constante. Ex.: operários × dias.  
  Essencial: uma aumenta e a outra diminui na mesma proporção (produto constante) · Aceita: mais de um, menos do outro; x · y constante  
  Erro comum: Montar regra de três direta para mais máquinas e menos tempo.
- **mat-f013** (M02.2, exemplo, peso 2) — 6 pedreiros fazem um muro em 10 dias. Em quantos dias 4 pedreiros fazem o mesmo muro?  
  Verso: 15 dias. É inversa: 6 · 10 = 4 · x, logo x = 15.  
  Essencial: 15 dias · Aceita: quinze dias  
  Erro comum: Fazer direta e achar 6,67 dias (menos pedreiros não pode levar menos tempo).
- **mat-f014** (M02.3, conceito, peso 2) — O que é a escala de um mapa?  
  Verso: A razão entre a medida no desenho e a medida real, as duas na mesma unidade: E = desenho/real.  
  Essencial: medida no desenho dividida pela medida real · Aceita: medida no mapa sobre medida real; d/D  
  Erro comum: Dividir o real pelo desenho ou misturar cm com km.
- **mat-f015** (M02.3, exemplo, peso 2) — Numa planta na escala 1 : 100, qual é a razão entre a área desenhada e a área real?  
  Verso: 1 : 10 000, pois a razão das áreas é o quadrado da escala linear: (1/100)².  
  Essencial: 1 : 10 000 · Aceita: 1/10 000; (1/100)²; um para dez mil  
  Erro comum: Usar 1 : 100 também para áreas.
- **mat-f016** (M02.3, formula, peso 2) — Qual é a fórmula da densidade, e quanto vale 1 g/cm³ em kg/L e em kg/m³?  
  Verso: d = m/V. 1 g/cm³ = 1 kg/L = 1 000 kg/m³.  
  Essencial: d = m/V; 1 kg/L; 1 000 kg/m³ · Aceita: massa sobre volume; 1000 kg/m³  
  Erro comum: Achar que g/cm³ e kg/m³ são iguais; diferem por 1 000.
- **mat-f017** (M02.4, comparar, peso 3) — Grandezas direta × inversamente proporcionais: o que fica constante em cada caso?  
  Verso: Direta: a razão y/x é constante (y = kx). Inversa: o produto x · y é constante (y = k/x).  
  Essencial: direta: razão constante; inversa: produto constante · Aceita: y/x constante e xy constante; quociente constante e produto constante  
  Erro comum: Trocar razão por produto.
- **mat-f018** (M02.4, exemplo, peso 2) — Num mesmo percurso, a velocidade aumenta 25%. Em quanto por cento o tempo diminui?  
  Verso: 20%: o tempo novo é t/1,25 = 0,8t.  
  Essencial: 20% · Aceita: vinte por cento; cai para 80%  
  Erro comum: Responder 25%: tempo e velocidade são inversamente proporcionais.

### M03 Porcentagem e finanças
- **mat-f019** (M03.1, formula, peso 3) — Por qual fator se multiplica um valor num aumento de x%? E num desconto de x%?  
  Verso: Aumento: × (1 + x/100). Desconto: × (1 − x/100). Ex.: +15% → × 1,15; −15% → × 0,85.  
  Essencial: aumento: 1 + x/100; desconto: 1 − x/100 · Aceita: 1 + i e 1 − i; (100 + x)% e (100 − x)%  
  Erro comum: Somar e subtrair porcentagens em vez de multiplicar fatores.
- **mat-f020** (M03.1, formula, peso 3) — Qual é a fórmula da variação percentual de um valor antigo para um novo?  
  Verso: Variação = (novo − antigo)/antigo × 100%. A base é sempre o valor antigo.  
  Essencial: (novo − antigo)/antigo · Aceita: diferença dividida pelo valor inicial; novo/antigo − 1  
  Erro comum: Dividir a diferença pelo valor novo em vez do antigo.
- **mat-f021** (M03.1, comparar, peso 2) — Uma taxa passou de 10% para 15%. Quantos pontos percentuais subiu, e qual foi o aumento relativo?  
  Verso: Subiu 5 pontos percentuais; o aumento relativo foi de 50% (5/10).  
  Essencial: 5 pontos percentuais; 50% · Aceita: 5 p.p.; cinco pontos; aumento de metade  
  Erro comum: Dizer que subiu 5%; isso confunde ponto percentual com variação relativa.
- **mat-f022** (M03.1, exemplo, peso 2) — 35% de uma turma reprovou, e 80% desses estudam à noite. Que porcentagem da turma reprovou e estuda à noite?  
  Verso: 28%: porcentagem de porcentagem multiplica, 0,8 · 0,35 = 0,28.  
  Essencial: 28% · Aceita: 0,28; vinte e oito por cento  
  Erro comum: Subtrair (80% − 35%) ou somar as porcentagens.
- **mat-f023** (M03.2, exemplo, peso 3) — Dois aumentos sucessivos de 10%: qual é o aumento total?  
  Verso: 21%, porque 1,1 · 1,1 = 1,21.  
  Essencial: 21% · Aceita: fator 1,21; vinte e um por cento  
  Erro comum: Somar e responder 20%.
- **mat-f024** (M03.2, exemplo, peso 3) — Um preço sobe 20% e depois cai 20%. Como fica em relação ao original?  
  Verso: Fica 4% menor: 1,2 · 0,8 = 0,96.  
  Essencial: 4% menor · Aceita: fator 0,96; perde 4%; 96% do original  
  Erro comum: Achar que volta ao valor original.
- **mat-f025** (M03.2, processo, peso 2) — Depois de um desconto de 20%, que aumento faz o preço voltar ao valor original?  
  Verso: 25%: divide-se pelo fator, 1/0,8 = 1,25.  
  Essencial: 25% · Aceita: fator 1,25; vinte e cinco por cento  
  Erro comum: Aplicar de volta os mesmos 20%.
- **mat-f026** (M03.3, formula, peso 2) — Em juros simples, quais são as fórmulas do juro J e do montante M (capital C, taxa i, n períodos)?  
  Verso: J = C · i · n e M = C(1 + i · n), com taxa e tempo na mesma unidade.  
  Essencial: J = C · i · n; M = C(1 + i · n) · Aceita: J = Cin; M = C + J  
  Erro comum: Usar taxa ao ano com tempo em meses sem converter.
- **mat-f027** (M03.4, formula, peso 3) — Qual é a fórmula do montante em juros compostos?  
  Verso: M = C · (1 + i)ⁿ, com i na forma decimal e n no mesmo período da taxa.  
  Essencial: M = C(1 + i)ⁿ · Aceita: capital vezes (1 + i) elevado a n  
  Erro comum: Usar C(1 + i · n), que é a fórmula dos juros simples.
- **mat-f028** (M03.4, comparar, peso 2) — Juros simples × compostos: como o montante cresce em cada regime?  
  Verso: Simples: linearmente, juro sempre sobre o capital inicial (PA). Compostos: exponencialmente, juro sobre juro (PG).  
  Essencial: simples: linear ou PA; compostos: exponencial ou PG · Aceita: simples em linha reta, composto em curva; juro sobre juro  
  Erro comum: Achar que 2 meses a 10% compostos rendem 20% (rendem 21%).
- **mat-f029** (M03.5, exemplo, peso 3) — Prescrição: 15 mg/kg para criança de 20 kg. O xarope tem 100 mg/5 mL. Quantos mL dar?  
  Verso: 15 mL: dose = 15 · 20 = 300 mg; concentração = 20 mg/mL; 300 ÷ 20 = 15 mL.  
  Essencial: 15 mL · Aceita: quinze mililitros  
  Erro comum: Esquecer de converter 100 mg/5 mL para 20 mg/mL.
- **mat-f030** (M03.5, formula, peso 2) — Na diluição, qual é a relação entre concentração e volume antes (1) e depois (2)?  
  Verso: C₁ · V₁ = C₂ · V₂, porque a quantidade de soluto não muda.  
  Essencial: C₁V₁ = C₂V₂ · Aceita: C1 · V1 = C2 · V2; massa de soluto constante  
  Erro comum: Usar como V₂ só o volume de água acrescentado, e não o volume final.

### M04 Equações e sistemas
- **mat-f031** (M04.2, formula, peso 3) — Qual é a fórmula das raízes de ax² + bx + c = 0, com a ≠ 0?  
  Verso: x = (−b ± √Δ)/(2a), com Δ = b² − 4ac.  
  Essencial: x = (−b ± √Δ)/(2a); Δ = b² − 4ac · Aceita: fórmula de Bhaskara; x = (−b ± √(b² − 4ac))/2a  
  Erro comum: Dividir só a raiz por 2a, esquecendo o −b.
- **mat-f032** (M04.2, conceito, peso 3) — Quantas raízes reais tem uma equação do 2.º grau conforme o sinal de Δ?  
  Verso: Δ > 0: duas raízes reais distintas. Δ = 0: uma raiz (dupla). Δ < 0: nenhuma raiz real.  
  Essencial: Δ > 0: duas; Δ = 0: uma; Δ < 0: nenhuma real · Aceita: duas iguais quando Δ = 0; raiz dupla  
  Erro comum: Dizer que Δ < 0 dá raízes negativas.
- **mat-f033** (M04.2, formula, peso 3) — Sem resolver, quanto valem a soma S e o produto P das raízes de ax² + bx + c = 0?  
  Verso: S = −b/a e P = c/a.  
  Essencial: S = −b/a; P = c/a · Aceita: soma menos b sobre a, produto c sobre a  
  Erro comum: Esquecer o sinal de menos na soma.
- **mat-f034** (M04.2, processo, peso 2) — Que condições garantem duas raízes reais, distintas e positivas em ax² + bx + c = 0?  
  Verso: Δ > 0, S = −b/a > 0 e P = c/a > 0.  
  Essencial: Δ > 0; S > 0; P > 0 · Aceita: delta positivo, soma positiva e produto positivo  
  Erro comum: Exigir só Δ > 0, que garante raízes distintas, não positivas.
- **mat-f035** (M04.3, processo, peso 2) — No método da adição, o que se faz para eliminar uma incógnita de um sistema?  
  Verso: Multiplicam-se as equações para que uma incógnita fique com coeficientes opostos e somam-se as equações.  
  Essencial: coeficientes opostos; somar as equações · Aceita: simétricos; subtrair equações com coeficientes iguais  
  Erro comum: Multiplicar só um lado da equação.
- **mat-f036** (M04.3, exemplo, peso 2) — 20 moedas, de 25 e de 50 centavos, somam R$ 7,00. Quantas são de 50 centavos?  
  Verso: 8: x + y = 20 e 0,25x + 0,50y = 7 dão x = 12 (de 25) e y = 8 (de 50).  
  Essencial: 8 · Aceita: oito  
  Erro comum: Responder 12, que é a quantidade de moedas de 25 centavos.
- **mat-f037** (M04.3, conceito, peso 3) — Quantas soluções tem um sistema SPD, um SPI e um SI?  
  Verso: SPD (possível determinado): uma única. SPI (possível indeterminado): infinitas. SI (impossível): nenhuma.  
  Essencial: SPD: uma; SPI: infinitas; SI: nenhuma · Aceita: única, infinitas e nenhuma  
  Erro comum: Achar que SPI é impossível.
- **mat-f038** (M04.3, identificar, peso 2) — Num sistema 2×2 com determinante zero, como distinguir SPI de SI?  
  Verso: Compare as razões: a/a′ = b/b′ = c/c′ dá SPI (infinitas); a/a′ = b/b′ ≠ c/c′ dá SI (nenhuma).  
  Essencial: termos independentes proporcionais: SPI; não proporcionais: SI · Aceita: retas coincidentes: SPI; retas paralelas distintas: SI  
  Erro comum: Concluir que det = 0 sempre é sistema impossível.
- **mat-f039** (M04.4, conceito, peso 3) — O que acontece com uma desigualdade quando se multiplicam ou dividem os dois lados por um número negativo?  
  Verso: O sentido se inverte. Ex.: −2x > 6 ⇒ x < −3.  
  Essencial: inverte o sentido · Aceita: troca > por <; vira o sinal da desigualdade  
  Erro comum: Manter o sentido e achar x > −3.
- **mat-f040** (M04.4, processo, peso 2) — Na inequação (x − 3)/(x + 1) ≤ 0, qual é a solução e por que −1 fica de fora?  
  Verso: −1 < x ≤ 3. O −1 fica de fora porque zera o denominador.  
  Essencial: −1 < x ≤ 3; −1 zera o denominador · Aceita: ]−1, 3]; x entre −1 (aberto) e 3 (fechado)  
  Erro comum: Fechar a bola no −1.
- **mat-f041** (M04.5, formula, peso 2) — Como se escreve o número de dois algarismos “ab” em função de a e b?  
  Verso: 10a + b (a é a dezena e b, a unidade).  
  Essencial: 10a + b · Aceita: 10 · a + b; dez a mais b  
  Erro comum: Escrever a + b ou a · b.
- **mat-f042** (M04.5, identificar, peso 2) — Em problemas de idade, como se escrevem a idade de alguém “há t anos” e “daqui a t anos”?  
  Verso: Há t anos: x − t. Daqui a t anos: x + t, sendo x a idade atual.  
  Essencial: há t anos: x − t; daqui a t anos: x + t · Aceita: idade atual menos t e idade atual mais t  
  Erro comum: Mudar a idade de só uma das pessoas; o tempo passa igual para todas.

### M05 Funções afim e quadrática
- **mat-f043** (M05.1, conceito, peso 3) — Em f(x) = ax + b, o que significam a e b?  
  Verso: a é a taxa de variação (inclinação da reta); b é o valor de f em x = 0, onde a reta corta o eixo y.  
  Essencial: a: taxa de variação; b: valor em x = 0 · Aceita: a coeficiente angular; b coeficiente linear; b valor inicial  
  Erro comum: Confundir a taxa de variação a com o valor inicial b.
- **mat-f044** (M05.1, formula, peso 2) — Como se calcula o coeficiente a da reta que passa por (x₁, y₁) e (x₂, y₂)?  
  Verso: a = (y₂ − y₁)/(x₂ − x₁) = Δy/Δx.  
  Essencial: a = (y₂ − y₁)/(x₂ − x₁) · Aceita: Δy/Δx; variação de y sobre variação de x  
  Erro comum: Inverter a divisão: Δx/Δy.
- **mat-f045** (M05.2, formula, peso 3) — Quais são as coordenadas do vértice de f(x) = ax² + bx + c?  
  Verso: xᵥ = −b/(2a) e yᵥ = −Δ/(4a), que é o mesmo que f(xᵥ).  
  Essencial: xᵥ = −b/(2a); yᵥ = −Δ/(4a) · Aceita: yᵥ = f(xᵥ); x do vértice −b/2a  
  Erro comum: Esquecer o sinal de menos em −Δ/(4a).
- **mat-f046** (M05.2, identificar, peso 3) — Uma questão pergunta “qual é o lucro máximo”. A resposta é o xᵥ ou o yᵥ?  
  Verso: O yᵥ, que é o valor máximo. O xᵥ só diz onde ou quando o máximo ocorre.  
  Essencial: yᵥ · Aceita: y do vértice; ordenada do vértice; −Δ/(4a)  
  Erro comum: Responder o xᵥ (a quantidade produzida) no lugar do lucro.
- **mat-f047** (M05.2, conceito, peso 3) — Como o sinal de a em f(x) = ax² + bx + c decide se o vértice é ponto de máximo ou de mínimo?  
  Verso: a > 0: concavidade para cima, vértice é mínimo. a < 0: concavidade para baixo, vértice é máximo.  
  Essencial: a > 0: mínimo; a < 0: máximo · Aceita: boca para cima: mínimo; boca para baixo: máximo  
  Erro comum: Trocar: achar que a > 0 dá máximo.
- **mat-f048** (M05.2, exemplo, peso 2) — Lucro L(x) = −x² + 40x − 300. Qual é o lucro máximo?  
  Verso: 100: xᵥ = −40/(2 · (−1)) = 20 e L(20) = −400 + 800 − 300 = 100.  
  Essencial: 100 · Aceita: cem; L máximo = 100  
  Erro comum: Responder 20, que é o xᵥ.
- **mat-f049** (M05.3, conceito, peso 2) — O gráfico de g(x) = f(x − 2) + 1 é o de f deslocado como?  
  Verso: 2 unidades para a direita e 1 unidade para cima.  
  Essencial: 2 para a direita; 1 para cima · Aceita: translação horizontal +2 e vertical +1  
  Erro comum: Deslocar para a esquerda por causa do sinal de menos.
- **mat-f050** (M05.3, processo, peso 2) — Qual é o domínio real de f(x) = √(x − 2)/(x − 3)?  
  Verso: x ≥ 2 e x ≠ 3: radicando de raiz par ≥ 0 e denominador ≠ 0.  
  Essencial: x ≥ 2; x ≠ 3 · Aceita: [2, 3) ∪ (3, +∞); [2, 3[ ∪ ]3, +∞[  
  Erro comum: Esquecer de tirar o valor que zera o denominador.
- **mat-f051** (M05.4, formula, peso 2) — Como se resolve |A| ≤ k e |A| ≥ k, com k > 0?  
  Verso: |A| ≤ k ⇔ −k ≤ A ≤ k. |A| ≥ k ⇔ A ≤ −k ou A ≥ k.  
  Essencial: |A| ≤ k: −k ≤ A ≤ k; |A| ≥ k: A ≤ −k ou A ≥ k · Aceita: menor: entre −k e k; maior: fora do intervalo  
  Erro comum: Resolver só A ≤ k e esquecer o lado negativo.
- **mat-f052** (M05.5, processo, peso 2) — Qual é a inversa de f(x) = 2x + 1?  
  Verso: f⁻¹(x) = (x − 1)/2: troque x por y em y = 2x + 1 e isole y.  
  Essencial: f⁻¹(x) = (x − 1)/2 · Aceita: x/2 − 1/2; (x − 1) ÷ 2  
  Erro comum: Confundir inversa com 1/f(x).

### M06 Exponencial e logaritmo
- **mat-f053** (M06.1, conceito, peso 2) — Em f(x) = a · bˣ, com a > 0, b > 0 e b ≠ 1, quando f é crescente e quando é decrescente?  
  Verso: Crescente se b > 1; decrescente se 0 < b < 1.  
  Essencial: b > 1: crescente; 0 < b < 1: decrescente · Aceita: base maior que 1 cresce; base entre 0 e 1 decresce  
  Erro comum: Achar que expoente negativo é o que faz decrescer, ignorando a base.
- **mat-f054** (M06.1, formula, peso 3) — Uma população começa com N₀ e dobra a cada T horas. Qual é a lei N(t)?  
  Verso: N(t) = N₀ · 2^(t/T), com t em horas.  
  Essencial: N₀ · 2^(t/T) · Aceita: N₀ vezes 2 elevado a t sobre T  
  Erro comum: Escrever N₀ · 2t ou 2N₀ · t (crescimento linear).
- **mat-f055** (M06.1, exemplo, peso 2) — Crescer 5% ao ano por 10 anos dá aumento de 50%? Qual é o fator total?  
  Verso: Não. O fator é 1,05¹⁰ ≈ 1,63, aumento de cerca de 63%.  
  Essencial: não; 1,05¹⁰ ≈ 1,63 · Aceita: cerca de 63%; aproximadamente 1,6  
  Erro comum: Multiplicar 5% por 10 como se fosse juro simples.
- **mat-f056** (M06.2, processo, peso 2) — Como se resolve 4ˣ⁺¹ = 8?  
  Verso: Mesma base: 2^(2x + 2) = 2³, então 2x + 2 = 3 e x = 1/2.  
  Essencial: x = 1/2 · Aceita: x = 0,5; um meio  
  Erro comum: Escrever 4ˣ⁺¹ como 2^(x + 2) sem multiplicar o expoente por 2.
- **mat-f057** (M06.3, conceito, peso 3) — O que significa log_b a = x?  
  Verso: Significa bˣ = a: o logaritmo é o expoente a que se eleva a base b para obter a.  
  Essencial: bˣ = a · Aceita: o expoente da base que dá a; b elevado a x é a  
  Erro comum: Inverter base e logaritmando: xᵇ = a ou aˣ = b.
- **mat-f058** (M06.3, conceito, peso 3) — Quais são as condições de existência de log_b a?  
  Verso: a > 0 (logaritmando positivo), b > 0 e b ≠ 1.  
  Essencial: a > 0; b > 0; b ≠ 1 · Aceita: logaritmando positivo, base positiva e diferente de 1  
  Erro comum: Aceitar logaritmando zero ou negativo.
- **mat-f059** (M06.3, formula, peso 3) — Quanto valem log(a · b), log(a/b) e log(aⁿ), com a, b > 0?  
  Verso: log(a · b) = log a + log b; log(a/b) = log a − log b; log(aⁿ) = n · log a.  
  Essencial: produto vira soma; quociente vira diferença; potência: n · log a · Aceita: log a + log b; log a − log b; n log a  
  Erro comum: Usar log(a + b) = log a + log b, que é falso.
- **mat-f060** (M06.3, formula, peso 2) — Qual é a fórmula de mudança de base para log_b a?  
  Verso: log_b a = log_c a / log_c b, para qualquer base c válida. Ex.: log a / log b, na base 10.  
  Essencial: log a / log b · Aceita: log_c a / log_c b; ln a / ln b  
  Erro comum: Inverter a fração: log b / log a.
- **mat-f061** (M06.3, exemplo, peso 2) — Com log 2 ≈ 0,30 e log 3 ≈ 0,48, quanto vale log 12?  
  Verso: ≈ 1,08: log 12 = log(2² · 3) = 2 log 2 + log 3 = 0,60 + 0,48.  
  Essencial: 1,08 · Aceita: aproximadamente 1,08  
  Erro comum: Fazer log 12 = log 2 · log 2 · log 3.
- **mat-f062** (M06.4, processo, peso 2) — Resolva log x + log(x − 3) = 1 (base 10). Qual raiz vale e por que a outra cai?  
  Verso: x = 5. Juntando, x(x − 3) = 10 dá 5 ou −2; −2 deixa logaritmando negativo.  
  Essencial: x = 5; −2 é descartado por logaritmando negativo · Aceita: S = {5}; condição de existência  
  Erro comum: Aceitar x = −2 sem testar a condição de existência.
- **mat-f063** (M06.5, formula, peso 3) — Qual é a quantidade restante N após um tempo t, para meia-vida T e quantidade inicial N₀?  
  Verso: N = N₀ · (1/2)^(t/T).  
  Essencial: N₀ · (1/2)^(t/T) · Aceita: N₀ / 2^(t/T); N₀ · 2^(−t/T)  
  Erro comum: Dividir N₀ por t/T (decaimento linear).
- **mat-f064** (M06.5, exemplo, peso 3) — Um fármaco tem meia-vida de 6 h. Dose de 400 mg: quanto resta após 24 h?  
  Verso: 25 mg: 24 h são 4 meias-vidas, e 400 · (1/2)⁴ = 25.  
  Essencial: 25 mg · Aceita: vinte e cinco miligramas  
  Erro comum: Subtrair metade da dose a cada vez (400 − 4 · 200) ou contar 3 meias-vidas.

### M07 Sequências
- **mat-f065** (M07.1, formula, peso 3) — Qual é o termo geral da PA, de primeiro termo a₁ e razão r?  
  Verso: aₙ = a₁ + (n − 1) · r.  
  Essencial: aₙ = a₁ + (n − 1)r · Aceita: a_n = a1 + (n − 1)r  
  Erro comum: Usar n · r em vez de (n − 1) · r.
- **mat-f066** (M07.1, exemplo, peso 2) — Quantos termos tem a PA 43, 47, 51, …, 183?  
  Verso: 36 termos: 183 = 43 + (n − 1) · 4 ⇒ n − 1 = 35 ⇒ n = 36.  
  Essencial: 36 · Aceita: trinta e seis  
  Erro comum: Responder 35, que é o número de saltos.
- **mat-f067** (M07.2, formula, peso 3) — Qual é o termo geral da PG, de primeiro termo a₁ e razão q?  
  Verso: aₙ = a₁ · qⁿ⁻¹.  
  Essencial: aₙ = a₁ · q^(n − 1) · Aceita: a_n = a1 · q^(n−1)  
  Erro comum: Usar qⁿ no lugar de qⁿ⁻¹.
- **mat-f068** (M07.2, comparar, peso 2) — Três termos consecutivos a, b, c: que relação vale numa PA? E numa PG?  
  Verso: PA: b = (a + c)/2 (média aritmética). PG: b² = a · c (média geométrica, se positivos).  
  Essencial: PA: b = (a + c)/2; PG: b² = a · c · Aceita: 2b = a + c; média aritmética e média geométrica  
  Erro comum: Trocar as duas relações.
- **mat-f069** (M07.3, formula, peso 3) — Qual é a soma dos n primeiros termos de uma PA?  
  Verso: Sₙ = (a₁ + aₙ) · n/2.  
  Essencial: Sₙ = (a₁ + aₙ) · n/2 · Aceita: média do primeiro e do último vezes n  
  Erro comum: Fazer a₁ · n ou esquecer de calcular aₙ antes.
- **mat-f070** (M07.3, formula, peso 2) — Qual é a soma dos n primeiros termos de uma PG de razão q ≠ 1?  
  Verso: Sₙ = a₁ · (qⁿ − 1)/(q − 1).  
  Essencial: Sₙ = a₁(qⁿ − 1)/(q − 1) · Aceita: a₁(1 − qⁿ)/(1 − q)  
  Erro comum: Usar qⁿ⁻¹ no numerador.
- **mat-f071** (M07.3, conceito, peso 2) — Quando a soma infinita de uma PG existe, e quanto vale?  
  Verso: Quando −1 < q < 1: S∞ = a₁/(1 − q).  
  Essencial: |q| < 1; a₁/(1 − q) · Aceita: −1 < q < 1; razão entre −1 e 1  
  Erro comum: Aplicar a fórmula com q = 2 ou q = −1.
- **mat-f072** (M07.4, processo, peso 2) — Uma sequência se repete em ciclo de período p. Como achar o termo de posição n?  
  Verso: Divida n por p: o termo é o da posição igual ao resto no ciclo; resto 0 é o último do ciclo.  
  Essencial: resto da divisão de n por p; resto 0 é o último do ciclo · Aceita: n mod p  
  Erro comum: Usar o quociente ou tratar resto 0 como primeiro termo.

### M08 Geometria plana — áreas
- **mat-f073** (M08.1, formula, peso 2) — Qual é a área do triângulo com dois lados a e b e ângulo θ entre eles?  
  Verso: A = (1/2) · a · b · sen θ.  
  Essencial: (1/2) · a · b · sen θ · Aceita: ab sen θ / 2; metade de a vezes b vezes seno  
  Erro comum: Usar o seno de um ângulo que não está entre os dois lados.
- **mat-f074** (M08.1, formula, peso 3) — Quais são a área e a altura de um triângulo equilátero de lado L?  
  Verso: A = L²√3/4 e h = L√3/2.  
  Essencial: A = L²√3/4; h = L√3/2 · Aceita: (√3/4)L²; (√3/2)L  
  Erro comum: Trocar os denominadores 4 e 2.
- **mat-f075** (M08.2, formula, peso 2) — Qual é a área do trapézio de bases B e b e altura h? E do losango de diagonais D e d?  
  Verso: Trapézio: (B + b) · h/2. Losango: D · d/2.  
  Essencial: trapézio: (B + b)h/2; losango: D · d/2 · Aceita: média das bases vezes altura; produto das diagonais sobre 2  
  Erro comum: Esquecer a divisão por 2 em qualquer uma das duas.
- **mat-f076** (M08.3, formula, peso 3) — Quais são o comprimento da circunferência e a área do círculo de raio r?  
  Verso: C = 2πr (= πd) e A = πr².  
  Essencial: C = 2πr; A = πr² · Aceita: C = πd; comprimento 2 pi r e área pi r ao quadrado  
  Erro comum: Usar o diâmetro no lugar do raio na área, o que a quadruplica.
- **mat-f077** (M08.3, formula, peso 2) — Qual é a área do setor circular de ângulo central θ (em graus) e raio r?  
  Verso: A = (θ/360°) · πr².  
  Essencial: (θ/360) · πr² · Aceita: θπr²/360; fração θ/360 do círculo  
  Erro comum: Usar 180° no denominador.
- **mat-f078** (M08.3, conceito, peso 2) — Se o raio de um círculo dobra, o que acontece com a área?  
  Verso: Quadruplica, porque (2r)² = 4r².  
  Essencial: quadruplica · Aceita: fica 4 vezes maior; multiplica por 4  
  Erro comum: Dizer que a área dobra.
- **mat-f079** (M08.4, formula, peso 2) — Num polígono de n lados, quanto vale a soma dos ângulos internos? E cada ângulo interno, se for regular?  
  Verso: Sᵢ = (n − 2) · 180°. Regular: cada ângulo interno = (n − 2) · 180°/n.  
  Essencial: (n − 2) · 180°; dividir por n · Aceita: (n − 2)180 / n  
  Erro comum: Usar n · 180°.
- **mat-f080** (M08.4, formula, peso 2) — Qual é a área do hexágono regular de lado L?  
  Verso: A = 3L²√3/2: são 6 triângulos equiláteros de lado L.  
  Essencial: 3L²√3/2 · Aceita: 6 · L²√3/4; seis triângulos equiláteros  
  Erro comum: Usar só um triângulo ou esquecer o fator 6.
- **mat-f081** (M08.5, exemplo, peso 2) — Qual é a área entre um quadrado de lado 4 e o círculo inscrito nele?  
  Verso: 16 − 4π ≈ 3,43: quadrado (16) menos círculo de raio 2 (4π).  
  Essencial: 16 − 4π · Aceita: 4(4 − π); ≈ 3,43  
  Erro comum: Usar raio 4 (o lado) em vez de raio 2.

### M09 Geometria plana — relações
- **mat-f082** (M09.1, formula, peso 3) — O que diz o teorema de Pitágoras?  
  Verso: No triângulo retângulo, a² = b² + c²: o quadrado da hipotenusa (oposta ao ângulo reto) é a soma dos quadrados dos catetos.  
  Essencial: a² = b² + c²; a é a hipotenusa · Aceita: hipotenusa² = cateto² + cateto²  
  Erro comum: Pôr um cateto sozinho no lugar da hipotenusa.
- **mat-f083** (M09.1, exemplo, peso 2) — Uma escada de 5 m tem o pé a 3 m da parede. A que altura ela toca a parede?  
  Verso: 4 m: h² + 3² = 5², então h² = 16.  
  Essencial: 4 m · Aceita: quatro metros  
  Erro comum: Somar 3² + 5² e achar √34.
- **mat-f084** (M09.1, formula, peso 2) — Quanto mede a diagonal de um quadrado de lado L? E a de um cubo de aresta a?  
  Verso: Quadrado: L√2. Cubo: a√3.  
  Essencial: L√2; a√3 · Aceita: raiz de 2 vezes o lado; raiz de 3 vezes a aresta  
  Erro comum: Usar a√2 também para a diagonal do cubo.
- **mat-f085** (M09.2, conceito, peso 2) — O que diz o teorema de Tales?  
  Verso: Um feixe de retas paralelas cortado por duas transversais determina nelas segmentos correspondentes proporcionais.  
  Essencial: paralelas cortadas por transversais; segmentos proporcionais · Aceita: a/b = c/d; feixe de paralelas  
  Erro comum: Comparar segmentos que não se correspondem.
- **mat-f086** (M09.3, conceito, peso 3) — Se a razão de semelhança entre os lados é k, qual é a razão entre as áreas? E entre os volumes?  
  Verso: Áreas: k². Volumes: k³.  
  Essencial: áreas: k²; volumes: k³ · Aceita: quadrado e cubo da razão  
  Erro comum: Usar k direto nas áreas.
- **mat-f087** (M09.3, exemplo, peso 2) — Um poste de 3 m faz sombra de 2 m; no mesmo instante, um prédio faz sombra de 30 m. Qual a altura do prédio?  
  Verso: 45 m: 3/2 = h/30.  
  Essencial: 45 m · Aceita: quarenta e cinco metros  
  Erro comum: Montar a proporção cruzando altura com sombra (3/30 = h/2).
- **mat-f088** (M09.5, conceito, peso 2) — Qual é a relação entre um ângulo inscrito e o ângulo central que enxergam o mesmo arco?  
  Verso: O inscrito vale metade do central. Inscrito numa semicircunferência vale 90°.  
  Essencial: inscrito = central/2 · Aceita: metade; o central é o dobro  
  Erro comum: Dizer que são iguais.
- **mat-f089** (M09.5, conceito, peso 2) — Duas paralelas cortadas por uma transversal: como são os ângulos alternos internos e os colaterais internos?  
  Verso: Alternos internos são iguais; colaterais internos são suplementares (somam 180°).  
  Essencial: alternos: iguais; colaterais: somam 180° · Aceita: alternos congruentes; colaterais suplementares  
  Erro comum: Tratar colaterais como iguais.

### M10 Trigonometria
- **mat-f090** (M10.1, formula, peso 3) — No triângulo retângulo, como se definem seno, cosseno e tangente de um ângulo agudo?  
  Verso: sen = oposto/hipotenusa; cos = adjacente/hipotenusa; tg = oposto/adjacente.  
  Essencial: sen = oposto/hipotenusa; cos = adjacente/hipotenusa; tg = oposto/adjacente · Aceita: tg = sen/cos; cateto oposto, cateto adjacente  
  Erro comum: Escolher oposto e adjacente sem marcar o ângulo antes.
- **mat-f091** (M10.1, formula, peso 3) — Quanto valem sen 30°, cos 30° e tg 30°?  
  Verso: sen 30° = 1/2; cos 30° = √3/2; tg 30° = √3/3.  
  Essencial: 1/2; √3/2; √3/3 · Aceita: tg 30° = 1/√3; 0,5  
  Erro comum: Trocar tg 30° (√3/3) com tg 60° (√3).
- **mat-f092** (M10.1, formula, peso 3) — Quanto valem sen 45°, cos 45° e tg 45°?  
  Verso: sen 45° = cos 45° = √2/2; tg 45° = 1.  
  Essencial: √2/2; √2/2; 1 · Aceita: 1/√2  
  Erro comum: Escrever tg 45° = √2/2.
- **mat-f093** (M10.1, formula, peso 3) — Quanto valem sen 60°, cos 60° e tg 60°?  
  Verso: sen 60° = √3/2; cos 60° = 1/2; tg 60° = √3.  
  Essencial: √3/2; 1/2; √3 · Aceita: 0,5  
  Erro comum: Trocar sen 60° com cos 60°.
- **mat-f094** (M10.2, formula, peso 2) — O que diz a lei dos senos?  
  Verso: a/sen A = b/sen B = c/sen C = 2R, cada lado com o ângulo oposto; R é o raio da circunferência circunscrita.  
  Essencial: a/sen A = b/sen B = c/sen C; 2R · Aceita: lado sobre seno do ângulo oposto é constante  
  Erro comum: Dividir o lado pelo seno de um ângulo vizinho, não do oposto.
- **mat-f095** (M10.3, formula, peso 3) — O que diz a lei dos cossenos para o lado a, oposto ao ângulo A?  
  Verso: a² = b² + c² − 2bc · cos A.  
  Essencial: a² = b² + c² − 2bc cos A · Aceita: cos A = (b² + c² − a²)/(2bc)  
  Erro comum: Usar um ângulo que não está entre os lados b e c.
- **mat-f096** (M10.3, comparar, peso 2) — Lei dos senos × lei dos cossenos: que dados pedem cada uma?  
  Verso: Senos: dois ângulos e um lado, ou um lado com seu ângulo oposto. Cossenos: dois lados e o ângulo entre eles, ou os três lados.  
  Essencial: senos: lado e ângulo oposto conhecidos; cossenos: dois lados e o ângulo entre eles ou três lados · Aceita: senos: dois ângulos e um lado; cossenos: LAL ou LLL  
  Erro comum: Usar lei dos cossenos com ângulo que não está entre os dois lados dados.
- **mat-f097** (M10.3, exemplo, peso 2) — Dois lados medem 3 e 5 e formam 120°. Quanto mede o terceiro lado?  
  Verso: 7: a² = 9 + 25 − 2 · 3 · 5 · (−1/2) = 49.  
  Essencial: 7 · Aceita: sete  
  Erro comum: Usar cos 120° = +1/2 e achar √19.
- **mat-f098** (M10.4, formula, peso 2) — π rad equivalem a quantos graus? E 3π/4 rad, a quantos graus?  
  Verso: π rad = 180°; 3π/4 rad = 135°.  
  Essencial: 180°; 135° · Aceita: cento e oitenta e cento e trinta e cinco  
  Erro comum: Usar π = 360°.
- **mat-f099** (M10.4, formula, peso 3) — Qual é a relação fundamental da trigonometria?  
  Verso: sen²x + cos²x = 1, para todo x.  
  Essencial: sen²x + cos²x = 1 · Aceita: seno ao quadrado mais cosseno ao quadrado é 1  
  Erro comum: Escrever sen x + cos x = 1.
- **mat-f100** (M10.4, conceito, peso 2) — Em que quadrantes o seno é positivo? E o cosseno?  
  Verso: Seno: 1.º e 2.º quadrantes. Cosseno: 1.º e 4.º quadrantes.  
  Essencial: seno: 1.º e 2.º; cosseno: 1.º e 4.º · Aceita: seno positivo acima do eixo x; cosseno positivo à direita do eixo y  
  Erro comum: Achar cosseno positivo no 2.º quadrante (cos 120° = −1/2).
- **mat-f101** (M10.5, formula, peso 2) — Em y = a + b · sen(cx), com b ≠ 0 e c ≠ 0, quais são o máximo, o mínimo e o período?  
  Verso: Máximo a + |b|; mínimo a − |b|; período 2π/|c|.  
  Essencial: máximo a + |b|; mínimo a − |b|; período 2π/|c| · Aceita: imagem [a − |b|, a + |b|]  
  Erro comum: Achar que multiplicar x por c multiplica o período por c.

### M11 Geometria espacial
- **mat-f102** (M11.1, formula, peso 3) — Qual é o volume de um prisma ou de um cilindro?  
  Verso: V = A_base · h: área da base vezes altura.  
  Essencial: área da base vezes altura · Aceita: V = Ab · h; Bh  
  Erro comum: Usar a área total no lugar da área da base.
- **mat-f103** (M11.1, formula, peso 3) — Quanto valem 1 m³, 1 dm³ e 1 cm³ em litros?  
  Verso: 1 m³ = 1 000 L; 1 dm³ = 1 L; 1 cm³ = 1 mL = 0,001 L.  
  Essencial: 1 m³ = 1 000 L; 1 dm³ = 1 L; 1 cm³ = 1 mL · Aceita: 1000 L; 1 cm³ = 0,001 L  
  Erro comum: Achar que 1 m³ = 100 L ou que 1 cm³ = 1 L.
- **mat-f104** (M11.1, exemplo, peso 2) — Uma caixa-d'água com base de 3 m² perde 600 L. Quanto baixa o nível da água?  
  Verso: 0,2 m = 20 cm: 600 L = 0,6 m³ e 0,6 ÷ 3 = 0,2.  
  Essencial: 0,2 m; 20 cm · Aceita: vinte centímetros  
  Erro comum: Dividir 600 por 3 sem converter litros em m³.
- **mat-f105** (M11.1, conceito, peso 2) — Se a aresta de um cubo dobra, o volume é multiplicado por quanto?  
  Verso: Por 8, porque (2a)³ = 8a³.  
  Essencial: 8 · Aceita: oito vezes  
  Erro comum: Dizer que o volume dobra.
- **mat-f106** (M11.1, formula, peso 2) — Qual é a área total de um paralelepípedo de arestas a, b e c?  
  Verso: A = 2(ab + ac + bc).  
  Essencial: 2(ab + ac + bc) · Aceita: 2ab + 2ac + 2bc  
  Erro comum: Confundir área total com volume (abc).
- **mat-f107** (M11.2, formula, peso 3) — Quais são o volume e a área lateral de um cilindro de raio r e altura h?  
  Verso: V = πr²h; área lateral = 2πrh.  
  Essencial: V = πr²h; A_lateral = 2πrh · Aceita: pi r² h e 2 pi r h  
  Erro comum: Elevar o raio ao quadrado também na área lateral.
- **mat-f108** (M11.3, formula, peso 3) — Qual é o volume de uma pirâmide ou de um cone?  
  Verso: V = A_base · h/3: um terço do prisma ou cilindro de mesma base e altura.  
  Essencial: A_base · h/3; um terço · Aceita: (1/3) Ab h; πr²h/3 para o cone  
  Erro comum: Esquecer o 1/3.
- **mat-f109** (M11.3, formula, peso 2) — No cone reto, como se relacionam geratriz g, altura h e raio r? Qual é a área lateral?  
  Verso: g² = h² + r²; área lateral = πrg.  
  Essencial: g² = h² + r²; área lateral = πrg · Aceita: Pitágoras com g de hipotenusa; π · r · g  
  Erro comum: Usar a altura no lugar da geratriz na área lateral.
- **mat-f110** (M11.4, formula, peso 3) — Quais são o volume e a área da superfície de uma esfera de raio r?  
  Verso: V = 4πr³/3; A = 4πr².  
  Essencial: V = 4πr³/3; A = 4πr² · Aceita: (4/3)πr³  
  Erro comum: Trocar r³ e r² entre as duas fórmulas.
- **mat-f111** (M11.5, exemplo, peso 2) — Um cone é cortado por um plano paralelo à base, na metade da altura. Que fração do volume fica no tronco?  
  Verso: 7/8: o cone pequeno tem (1/2)³ = 1/8 do volume.  
  Essencial: 7/8 · Aceita: 87,5%; sete oitavos  
  Erro comum: Dizer 1/2, como se o volume fosse proporcional à altura.

### M12 Geometria analítica
- **mat-f112** (M12.1, formula, peso 2) — Qual é a distância entre os pontos (x₁, y₁) e (x₂, y₂)?  
  Verso: d = √((x₂ − x₁)² + (y₂ − y₁)²).  
  Essencial: √((x₂ − x₁)² + (y₂ − y₁)²) · Aceita: √(Δx² + Δy²); Pitágoras com coordenadas  
  Erro comum: Somar as diferenças sem elevar ao quadrado.
- **mat-f113** (M12.2, formula, peso 2) — Qual é a equação da reta que passa por (x₀, y₀) com coeficiente angular m?  
  Verso: y − y₀ = m(x − x₀), com m = Δy/Δx = tg θ.  
  Essencial: y − y₀ = m(x − x₀) · Aceita: y = mx + n passando pelo ponto  
  Erro comum: Trocar x₀ com y₀ na equação.
- **mat-f114** (M12.3, conceito, peso 3) — Quando duas retas não verticais, de coeficientes m₁ e m₂, são paralelas? E perpendiculares?  
  Verso: Paralelas: m₁ = m₂. Perpendiculares: m₁ · m₂ = −1.  
  Essencial: paralelas: m₁ = m₂; perpendiculares: m₁ · m₂ = −1 · Aceita: m₂ = −1/m₁  
  Erro comum: Para a perpendicular, só trocar o sinal (de 2 para −2).
- **mat-f115** (M12.4, formula, peso 3) — Qual é a equação reduzida da circunferência de centro (a, b) e raio r?  
  Verso: (x − a)² + (y − b)² = r².  
  Essencial: (x − a)² + (y − b)² = r² · Aceita: distância ao centro igual a r  
  Erro comum: Escrever = r em vez de = r².
- **mat-f116** (M12.4, exemplo, peso 2) — Quais são o centro e o raio de (x − 3)² + (y + 2)² = 16?  
  Verso: Centro (3, −2) e raio 4.  
  Essencial: centro (3, −2); raio 4 · Aceita: C(3, −2), r = 4  
  Erro comum: Dar centro (−3, 2) ou raio 16.
- **mat-f117** (M12.4, identificar, peso 2) — Como saber se uma reta é secante, tangente ou exterior a uma circunferência?  
  Verso: Compare a distância d do centro à reta com o raio r: d < r, secante; d = r, tangente; d > r, exterior.  
  Essencial: comparar distância do centro à reta com o raio; d < r secante, d = r tangente, d > r exterior · Aceita: resolver o sistema e olhar o Δ  
  Erro comum: Comparar com o diâmetro em vez do raio.
- **mat-f118** (M12.5, formula, peso 2) — Como se calcula a área de um triângulo dados os três vértices por coordenadas?  
  Verso: A = |D|/2, onde D é o determinante das linhas (x₁ y₁ 1), (x₂ y₂ 1), (x₃ y₃ 1). Se D = 0, os pontos são colineares.  
  Essencial: metade do módulo do determinante · Aceita: |D|/2; |det|/2  
  Erro comum: Esquecer o módulo e dar área negativa.

### M13 Combinatória e probabilidade
- **mat-f119** (M13.1, conceito, peso 3) — O que diz o princípio multiplicativo da contagem?  
  Verso: Se uma escolha tem n₁ opções e a seguinte, independente, tem n₂, as duas juntas têm n₁ · n₂ maneiras.  
  Essencial: multiplicar o número de opções de cada etapa · Aceita: princípio fundamental da contagem; n₁ · n₂ · …  
  Erro comum: Somar as opções das etapas.
- **mat-f120** (M13.2, formula, peso 3) — Quantas são as permutações de n elementos distintos? E os arranjos de n tomados p a p?  
  Verso: Pₙ = n!; A(n, p) = n!/(n − p)!.  
  Essencial: Pₙ = n!; A(n, p) = n!/(n − p)! · Aceita: n fatorial  
  Erro comum: Usar o arranjo quando a ordem não importa.
- **mat-f121** (M13.2, exemplo, peso 2) — Quantos anagramas tem a palavra BANANA?  
  Verso: 60 = 6!/(3! · 2!): divide-se pelas repetições do A (3) e do N (2).  
  Essencial: 60 · Aceita: sessenta  
  Erro comum: Responder 6! = 720, contando várias vezes o mesmo anagrama.
- **mat-f122** (M13.2, exemplo, peso 2) — Oito atletas disputam ouro, prata e bronze. De quantos modos o pódio pode ser formado?  
  Verso: 336 = 8 · 7 · 6: a ordem importa, A(8, 3).  
  Essencial: 336 · Aceita: 8 · 7 · 6; A(8, 3)  
  Erro comum: Usar combinação e achar 56.
- **mat-f123** (M13.3, formula, peso 3) — Qual é a fórmula da combinação de n elementos tomados p a p?  
  Verso: C(n, p) = n!/(p! · (n − p)!).  
  Essencial: n!/(p!(n − p)!) · Aceita: binomial n sobre p; A(n, p)/p!  
  Erro comum: Esquecer o p! no denominador (isso é arranjo).
- **mat-f124** (M13.3, identificar, peso 3) — Arranjo ou combinação: qual é o teste decisivo?  
  Verso: Troque a ordem dos escolhidos: se gera resultado novo, é arranjo; se não muda nada, é combinação.  
  Essencial: a ordem importa: arranjo; a ordem não importa: combinação · Aceita: comissão é combinação, pódio é arranjo  
  Erro comum: Usar arranjo para comissões, contando o mesmo grupo várias vezes.
- **mat-f125** (M13.3, exemplo, peso 2) — Quantas comissões de 3 pessoas podem ser formadas com 8 pessoas?  
  Verso: 56 = C(8, 3) = 8 · 7 · 6/3!.  
  Essencial: 56 · Aceita: cinquenta e seis; C(8, 3)  
  Erro comum: Responder 336 (arranjo).
- **mat-f126** (M13.4, formula, peso 3) — Como se define a probabilidade de um evento num espaço com resultados igualmente prováveis?  
  Verso: P(A) = casos favoráveis / casos possíveis, com 0 ≤ P(A) ≤ 1.  
  Essencial: favoráveis / possíveis · Aceita: n(A)/n(Ω)  
  Erro comum: Dividir favoráveis por desfavoráveis.
- **mat-f127** (M13.4, exemplo, peso 2) — Lançando dois dados comuns, qual é a probabilidade de a soma ser 7?  
  Verso: 1/6: são 6 casos favoráveis em 36.  
  Essencial: 1/6 · Aceita: 6/36; ≈ 16,7%  
  Erro comum: Contar 11 somas possíveis e responder 1/11.
- **mat-f128** (M13.4, exemplo, peso 2) — Urna com 3 bolas brancas e 2 pretas. Retiram-se 2, sem reposição. Qual a probabilidade de ambas serem brancas?  
  Verso: 3/10: 3/5 · 2/4.  
  Essencial: 3/10 · Aceita: 0,3; 30%  
  Erro comum: Manter o denominador 5 na segunda retirada (9/25).
- **mat-f129** (M13.5, formula, peso 3) — Qual é a fórmula da probabilidade condicional P(A | B)?  
  Verso: P(A | B) = P(A ∩ B)/P(B), com P(B) > 0.  
  Essencial: P(A ∩ B)/P(B) · Aceita: probabilidade de A e B sobre a de B  
  Erro comum: Dividir pelo total em vez de pelo grupo da condição.
- **mat-f130** (M13.5, conceito, peso 3) — O que são sensibilidade e especificidade de um teste diagnóstico?  
  Verso: Sensibilidade = P(positivo | doente). Especificidade = P(negativo | sadio).  
  Essencial: sensibilidade: positivo entre doentes; especificidade: negativo entre sadios · Aceita: taxa de verdadeiros positivos e de verdadeiros negativos  
  Erro comum: Trocar uma pela outra.
- **mat-f131** (M13.5, formula, peso 3) — O que é e como se calcula o valor preditivo positivo (VPP)?  
  Verso: É P(doente | positivo): VPP = VP/(VP + FP), verdadeiros positivos sobre todos os positivos.  
  Essencial: P(doente | positivo); VP/(VP + FP) · Aceita: verdadeiros positivos sobre todos os positivos  
  Erro comum: Confundir VPP com sensibilidade.
- **mat-f132** (M13.5, exemplo, peso 2) — Prevalência 1%, sensibilidade 90%, falso positivo em 5% dos sadios. Qual é o VPP, aproximadamente?  
  Verso: ≈ 15,4%: em 10 000 pessoas, 90 VP e 495 FP; 90/585.  
  Essencial: cerca de 15% · Aceita: 90/585; 2/13; cerca de 15,4%  
  Erro comum: Responder 90%: com prevalência baixa, a maioria dos positivos é falsa.
- **mat-f133** (M13.6, formula, peso 3) — Qual é a fórmula de P(A ∪ B)?  
  Verso: P(A ∪ B) = P(A) + P(B) − P(A ∩ B).  
  Essencial: P(A) + P(B) − P(A ∩ B) · Aceita: soma menos a intersecção  
  Erro comum: Somar P(A) + P(B) sem tirar a intersecção.
- **mat-f134** (M13.6, processo, peso 3) — Como se calcula a probabilidade de “pelo menos um” sucesso?  
  Verso: Pelo complementar: P(pelo menos um) = 1 − P(nenhum).  
  Essencial: 1 − P(nenhum) · Aceita: evento complementar  
  Erro comum: Somar as chances de cada evento (3 · 10% = 30%).
- **mat-f135** (M13.6, conceito, peso 2) — Se A e B são independentes, quanto vale P(A ∩ B)?  
  Verso: P(A ∩ B) = P(A) · P(B).  
  Essencial: P(A) · P(B) · Aceita: produto das probabilidades  
  Erro comum: Confundir independentes com mutuamente exclusivos (P(A ∩ B) = 0).
- **mat-f136** (M13.9, exemplo, peso 1) — Numa gaveta escura há meias de 4 cores. Quantas meias, no mínimo, garantem duas da mesma cor?  
  Verso: 5: no pior caso, as 4 primeiras são de cores diferentes (casa dos pombos).  
  Essencial: 5 · Aceita: cinco; 4 + 1  
  Erro comum: Responder 2, pensando no caso mais provável e não no pior.

### M14 Estatística
- **mat-f137** (M14.1, processo, peso 3) — Como se acha a mediana de um conjunto de n valores?  
  Verso: Ordene os dados. n ímpar: o termo central, posição (n + 1)/2. n par: média dos dois centrais.  
  Essencial: ordenar; ímpar: termo central; par: média dos dois centrais · Aceita: valor do meio  
  Erro comum: Pegar o valor do meio sem ordenar.
- **mat-f138** (M14.1, exemplo, peso 2) — Qual é a mediana de 3, 9, 4, 7, 4, 10? E a moda?  
  Verso: Ordenando: 3, 4, 4, 7, 9, 10. Mediana = (4 + 7)/2 = 5,5; moda = 4.  
  Essencial: mediana 5,5; moda 4 · Aceita: 5 e meio  
  Erro comum: Tomar 4 e 7 sem ordenar, ou dar a mediana como 4 ou 7.
- **mat-f139** (M14.1, exemplo, peso 2) — 5 notas têm média 7. Que 6.ª nota faz a média subir para 7,5?  
  Verso: 10: a soma passa de 35 para 6 · 7,5 = 45.  
  Essencial: 10 · Aceita: dez  
  Erro comum: Calcular a média das médias, (7 + x)/2 = 7,5, e achar 8.
- **mat-f140** (M14.1, comparar, peso 2) — Um valor extremo (muito alto ou muito baixo) afeta mais a média ou a mediana?  
  Verso: A média; a mediana quase não se altera com valores extremos.  
  Essencial: a média · Aceita: média é sensível, mediana é resistente  
  Erro comum: Achar que a mediana também é puxada pelo valor extremo.
- **mat-f141** (M14.1, conceito, peso 2) — Somando k a todos os valores, o que acontece com a média e com o desvio padrão?  
  Verso: A média aumenta k; o desvio padrão não muda.  
  Essencial: média + k; desvio padrão igual · Aceita: dispersão não muda  
  Erro comum: Somar k também ao desvio padrão.
- **mat-f142** (M14.2, exemplo, peso 2) — Num gráfico de setores, que ângulo central corresponde a 25%?  
  Verso: 90°: 0,25 · 360°.  
  Essencial: 90° · Aceita: noventa graus; um quarto da volta  
  Erro comum: Usar 180° como volta completa.
- **mat-f143** (M14.3, formula, peso 2) — Como se calculam a variância e o desvio padrão (populacionais) de n valores?  
  Verso: σ² = Σ(x − x̄)²/n; σ = √σ².  
  Essencial: σ² = Σ(x − x̄)²/n; σ = √σ² · Aceita: média dos quadrados dos desvios; raiz da variância  
  Erro comum: Somar desvios sem elevar ao quadrado (dá sempre 0).
- **mat-f144** (M14.3, identificar, peso 3) — Dois grupos têm médias iguais. Qual é o “mais regular” ou “mais homogêneo”?  
  Verso: O de menor desvio padrão.  
  Essencial: menor desvio padrão · Aceita: menor variância; menor dispersão  
  Erro comum: Dizer que são iguais porque as médias são iguais.
- **mat-f145** (M14.4, formula, peso 3) — Qual é a fórmula da média ponderada?  
  Verso: x̄ = Σ(xᵢ · pᵢ)/Σpᵢ: soma de valor vezes peso dividida pela soma dos pesos.  
  Essencial: Σ(xᵢ · pᵢ)/Σpᵢ · Aceita: soma dos produtos sobre soma dos pesos  
  Erro comum: Dividir pelo número de valores em vez da soma dos pesos.
- **mat-f146** (M14.4, exemplo, peso 2) — Nota 6 com peso 2 e nota 8 com peso 3. Qual é a média ponderada?  
  Verso: 7,2 = (6 · 2 + 8 · 3)/(2 + 3) = 36/5.  
  Essencial: 7,2 · Aceita: 36/5  
  Erro comum: Fazer a média simples, 7.
- **mat-f147** (M14.5, exemplo, peso 2) — Uma cidade de 250 000 habitantes teve 75 casos. Qual é a taxa por 100 mil habitantes?  
  Verso: 30 casos por 100 mil: 75/250 000 · 100 000.  
  Essencial: 30 por 100 mil · Aceita: trinta  
  Erro comum: Comparar números absolutos de cidades de tamanhos diferentes.

### M15 Matrizes e determinantes
- **mat-f148** (M15.1, conceito, peso 1) — Quando existe o produto A · B, e qual é a ordem do resultado?  
  Verso: Quando o nº de colunas de A é igual ao nº de linhas de B: A(m×n) · B(n×p) = C(m×p).  
  Essencial: colunas de A = linhas de B; m × p · Aceita: ordens internas iguais  
  Erro comum: Multiplicar elemento a elemento ou exigir matrizes de mesma ordem.
- **mat-f149** (M15.2, formula, peso 1) — Como se calcula o determinante de [a b; c d]?  
  Verso: det = ad − bc (diagonal principal menos diagonal secundária).  
  Essencial: ad − bc · Aceita: principal menos secundária  
  Erro comum: Fazer ab − cd.
- **mat-f150** (M15.2, conceito, peso 1) — Quando uma matriz quadrada tem inversa?  
  Verso: Quando seu determinante é diferente de zero.  
  Essencial: det ≠ 0 · Aceita: determinante não nulo; matriz invertível  
  Erro comum: Achar que toda matriz quadrada é invertível.

### M16 Polinômios e complexos
- **mat-f151** (M16.1, formula, peso 1) — Qual é o resto da divisão de P(x) por (x − a)? E por (x + 3)?  
  Verso: Por (x − a): P(a). Por (x + 3): P(−3).  
  Essencial: P(a); P(−3) · Aceita: teorema do resto  
  Erro comum: Usar P(3) para a divisão por x + 3.
- **mat-f152** (M16.1, formula, peso 1) — Em ax³ + bx² + cx + d = 0, quanto valem a soma, a soma dois a dois e o produto das raízes?  
  Verso: Soma = −b/a; dois a dois = c/a; produto = −d/a (relações de Girard).  
  Essencial: −b/a; c/a; −d/a · Aceita: Girard  
  Erro comum: Usar d/a no produto, sem o sinal de menos.
- **mat-f153** (M16.2, formula, peso 1) — Quanto valem i², i³ e i⁴?  
  Verso: i² = −1; i³ = −i; i⁴ = 1. As potências se repetem de 4 em 4.  
  Essencial: i² = −1; i³ = −i; i⁴ = 1 · Aceita: ciclo de 4  
  Erro comum: Achar que i² = 1.
- **mat-f154** (M16.2, formula, peso 1) — Quais são o conjugado e o módulo de z = a + bi?  
  Verso: Conjugado: z̄ = a − bi. Módulo: |z| = √(a² + b²).  
  Essencial: z̄ = a − bi; |z| = √(a² + b²) · Aceita: troca o sinal da parte imaginária  
  Erro comum: Trocar também o sinal da parte real no conjugado.

### M17 Lógica e algoritmos
- **mat-f155** (M17.1, formula, peso 2) — Pelas leis de De Morgan, qual é a negação de “p e q”? E de “p ou q”?  
  Verso: ¬(p ∧ q) ≡ ¬p ∨ ¬q; ¬(p ∨ q) ≡ ¬p ∧ ¬q.  
  Essencial: não p ou não q; não p e não q · Aceita: ¬p ∨ ¬q; ¬p ∧ ¬q; “e” vira “ou” e vice-versa  
  Erro comum: Negar as partes e manter o conectivo.
- **mat-f156** (M17.1, exemplo, peso 3) — Qual é a negação de “Todo médico é calmo”?  
  Verso: “Algum médico não é calmo.”  
  Essencial: algum médico não é calmo · Aceita: existe médico que não é calmo; pelo menos um médico não é calmo; nem todo médico é calmo  
  Erro comum: Responder “Nenhum médico é calmo”.
- **mat-f157** (M17.1, conceito, peso 2) — Quando a condicional “se p, então q” é falsa?  
  Verso: Só quando p é verdadeira e q é falsa.  
  Essencial: p verdadeira e q falsa · Aceita: V → F; antecedente verdadeiro e consequente falso  
  Erro comum: Achar que é falsa sempre que p é falsa.
- **mat-f158** (M17.1, formula, peso 2) — Qual é a contrapositiva de “se p, então q”, que é equivalente a ela?  
  Verso: “Se não q, então não p” (¬q → ¬p).  
  Essencial: se não q, então não p · Aceita: ¬q → ¬p  
  Erro comum: Usar a recíproca (q → p), que não é equivalente.
- **mat-f159** (M17.1, formula, peso 2) — Qual é a negação de “se p, então q”?  
  Verso: “p e não q” (p ∧ ¬q).  
  Essencial: p e não q · Aceita: p ∧ ¬q  
  Erro comum: Responder “se não p, então não q”.
- **mat-f160** (M17.2, processo, peso 1) — Como se converte um número da base 10 para a base 2?  
  Verso: Divide-se sucessivamente por 2 e leem-se os restos do último para o primeiro.  
  Essencial: dividir sucessivamente por 2; ler os restos de trás para a frente · Aceita: restos de baixo para cima  
  Erro comum: Ler os restos na ordem em que aparecem.
