# Cartões de teoria — Matemática (29/10/2026)

Gravado em `mat/index.html` e `mat/dados.json`: `D['teoria'][mod]['cartoes']` (102 cartões, todos os 78 conteúdos com questões) e `D['areas']` (6 áreas). Nada foi apagado; banco com 611 questões, idêntico ao anterior. Backups: `mat/index.html.bak_cartoes`, `mat/dados.json.bak_cartoes`.

Método: conteúdos lidos de `nomesub`, teoria atual e o campo `conceito` das 611 questões, para cobrir o que cai. Todas as contas e fórmulas dos exemplos foram conferidas em Python/sympy 1.14 (105 asserções, script `verifica.py` no scratchpad da sessão). Um validador automático conferiu o formato: título ≤ 5 palavras, frases ≤ 22 palavras, caderno ≤ 4 linhas de ≤ 60 caracteres, vírgula decimal, cobertura e ordem dos conteúdos. Depois, uma segunda passada caçou erro factual e ambiguidade (7 correções).

## Áreas de revisão

- **Aritmética e proporção** (M01, M02, M03): Frações, potências, MMC e MDC, regra de três, porcentagem, juros e dose por peso. Tópicos: Frações e potências; MMC, MDC e restos; Razão, proporção e regra de três; Porcentagem e juros; Dose e concentração.
- **Álgebra e funções** (M04, M05, M06, M07): Equações, sistemas, funções afim e quadrática, exponencial, logaritmo e progressões. Tópicos: Equações e sistemas; Inequações e módulo; Função afim e quadrática; Exponencial e logaritmo; PA e PG.
- **Geometria plana e trigonometria** (M08, M09, M10): Áreas, Pitágoras, semelhança, ângulos e razões trigonométricas em triângulos e no ciclo. Tópicos: Áreas de figuras planas; Pitágoras e semelhança; Ângulos; Trigonometria no triângulo; Ciclo e funções trigonométricas.
- **Geometria espacial e analítica** (M11, M12): Volumes e capacidades de sólidos, e ponto, reta e circunferência no plano cartesiano. Tópicos: Prismas e cilindros; Pirâmides, cones e esfera; Distância e ponto médio; Reta; Circunferência.
- **Contagem, probabilidade e estatística** (M13, M14): Contar casos, calcular chances (inclusive teste diagnóstico) e ler dados com média, mediana e desvio. Tópicos: Princípio multiplicativo; Permutação, arranjo e combinação; Probabilidade e condicional; Média, mediana e moda; Gráficos e tabelas.
- **Matrizes, polinômios e lógica** (M15, M16, M17): Matrizes e determinantes, teorema do resto, Girard, complexos, lógica e algoritmos. Tópicos: Matrizes e determinantes; Polinômios e Girard; Números complexos; Lógica proposicional; Bases e algoritmos.

## M01 — Fundamentos

### M01.1 · Frações e decimais
- **O que é:** Fração é parte de um todo: a/b divide em b partes e toma a. Decimal e porcentagem são outras formas do mesmo número.
- **Como identificar:** Pistas: “um terço de”, “do que sobrou”, “parte de parte”. O “de” entre frações vira multiplicação.
- **Exemplo:** Uma saca tem 50 kg. Usaram 2/5 dela e depois 1/3 do que sobrou. Restam 3/5 · 2/3 = 2/5 da saca, ou seja, 20 kg.
- **Caderno:**
  - `a/b + c/d = (ad + bc)/(bd)`
  - `a/b · c/d = (a·c)/(b·d)`
  - `a/b ÷ c/d = a/b · d/c`
  - `“do que sobrou”: multiplique as frações que restam`
- **Cuidado:** A fração “do que sobrou” incide sobre o resto, não sobre o total inicial.

### M01.2 · Potências e radicais
- **O que é:** Potência é multiplicação repetida; radical é potência de expoente fracionário. Com as regras, tudo vira uma só base.
- **Como identificar:** Expoente decimal (0,5 = 1/2), raiz de potência, simplificação de expressão, “qual é quadrado perfeito”.
- **Exemplo:** 8^(2/3) = (∛8)² = 2² = 4. 16^0,25 = 16^(1/4) = 2. √12 = √(4 · 3) = 2√3.
- **Caderno:**
  - `aᵐ · aⁿ = a^(m+n)   aᵐ ÷ aⁿ = a^(m−n)`
  - `(aᵐ)ⁿ = a^(m·n)   a⁰ = 1   a⁻ⁿ = 1/aⁿ  (a ≠ 0)`
  - `ⁿ√(aᵐ) = a^(m/n)  (a > 0)`
  - `√(a·b) = √a · √b  (a, b ≥ 0)`
- **Cuidado:** (a + b)² não é a² + b², e √(a + b) não é √a + √b.

### M01.3 · Notação científica
- **O que é:** Escrever o número como k × 10ⁿ, com 1 ≤ k < 10. Serve para números muito grandes ou muito pequenos.
- **Como identificar:** Pistas: prefixos (nano, micro, giga), contas com muitos zeros, células, bactérias, distâncias astronômicas.
- **Exemplo:** Uma partícula viral de 120 nm mede 1,2 × 10⁻⁷ m. E (3 × 10⁴) · (5 × 10⁻⁶) = 15 × 10⁻² = 1,5 × 10⁻¹.
- **Caderno:**
  - `N = k × 10ⁿ, com 1 ≤ k < 10`
  - `vírgula n casas à esquerda: some n ao expoente`
  - `k 10³ · M 10⁶ · G 10⁹`
  - `m 10⁻³ · μ 10⁻⁶ · n 10⁻⁹ · p 10⁻¹²`
- **Cuidado:** Para somar, iguale os expoentes: 2 × 10⁵ + 3 × 10⁴ = 2,3 × 10⁵, não 5 × 10⁹.

### M01.3 · Ordem de grandeza
- **O que é:** É a potência de 10 mais próxima do número. No critério usual, compara-se k com √10 ≈ 3,16.
- **Como identificar:** Pedido explícito de “ordem de grandeza” ou estimativa: grãos, células, batimentos, fatorial grande.
- **Exemplo:** Batimentos em um dia, a 70 por minuto: 70 · 60 · 24 = 100 800 ≈ 1,0 × 10⁵, ordem 10⁵. Já 4 × 10⁵ tem ordem 10⁶.
- **Caderno:**
  - `N = k × 10ⁿ`
  - `k < √10 ≈ 3,16 → ordem 10ⁿ`
  - `k ≥ √10 → ordem 10ⁿ⁺¹`
  - `2¹⁰ = 1 024 ≈ 10³`
- **Cuidado:** Ordem de grandeza não é só o expoente: 5 × 10³ tem ordem 10⁴.

### M01.4 · MMC: ciclos que coincidem
- **O que é:** MMC é o menor número que é múltiplo de todos os dados. Diz quando ciclos voltam a coincidir.
- **Como identificar:** Pistas: “voltam a se encontrar”, “ao mesmo tempo novamente”, escalas de plantão, remédios em horários diferentes.
- **Exemplo:** Remédio A a cada 6 h e B a cada 8 h, tomados juntos às 7 h. MMC(6, 8) = 24: juntos de novo às 7 h do dia seguinte.
- **Caderno:**
  - `fatore: 6 = 2 · 3   8 = 2³`
  - `MMC: todos os primos, maior expoente → 24`
  - `MDC: só os comuns, menor expoente → 2`
  - `MMC(a, b) · MDC(a, b) = a · b`
- **Cuidado:** Plantão de 12 h por 36 h tem ciclo de 48 h: use trabalho + folga no MMC.

### M01.4 · MDC: dividir sem sobra
- **O que é:** MDC é o maior número que divide todos os dados. Diz o maior tamanho de partes iguais, sem sobra.
- **Como identificar:** Pistas: “maior tamanho possível”, “sem sobras”, “menor número de pedaços”, ladrilhos quadrados num retângulo.
- **Exemplo:** Piso de 120 cm × 84 cm com ladrilhos quadrados, os maiores possíveis. MDC(120, 84) = 12: ladrilho de 12 cm, 10 · 7 = 70 ladrilhos.
- **Caderno:**
  - `120 = 2³ · 3 · 5   84 = 2² · 3 · 7`
  - `MDC = 2² · 3 = 12`
  - `quantidade = (120/12) · (84/12) = 70`
- **Cuidado:** Menor número de peças pede o MDC (peça maior), não o MMC.

### M01.4 · Resto e divisibilidade
- **O que é:** Na divisão inteira, D = d · q + r, com 0 ≤ r < d. O resto diz em que ponto do ciclo se para.
- **Como identificar:** Pistas: dia da semana daqui a n dias, “sobram”, “deixa resto”, “é múltiplo de”, critérios de divisibilidade.
- **Exemplo:** Hoje é segunda-feira. 100 = 7 · 14 + 2, então daqui a 100 dias é 2 dias depois de segunda: quarta-feira.
- **Caderno:**
  - `D = d · q + r, com 0 ≤ r < d`
  - `dia da semana: resto da divisão por 7`
  - `÷3: soma dos algarismos ÷3 · ÷5: termina em 0 ou 5`
  - `resto = divisor − 1 em todos: N + 1 é múltiplo comum`
- **Cuidado:** O resto nunca é negativo nem maior ou igual ao divisor.

### M01.5 · Conjuntos numéricos
- **O que é:** ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ. Irracional é o real que não vira fração: decimal infinito e não periódico.
- **Como identificar:** Pede classificar números, julgar afirmações sobre ℕ, ℤ, ℚ e ℝ, ou nomear propriedades (comutativa, associativa).
- **Exemplo:** 0,333… = 1/3 é racional (dízima periódica). √2 = 1,41421… e π são irracionais. √9 = 3 é natural.
- **Caderno:**
  - `ℕ = {0, 1, 2, …}   ℤ = {…, −1, 0, 1, …}`
  - `ℚ = {a/b; a, b ∈ ℤ, b ≠ 0}`
  - `ℝ = ℚ ∪ irracionais`
  - `comutativa: a + b = b + a  e  a·b = b·a`
- **Cuidado:** Dízima periódica é racional; só a infinita e não periódica é irracional.

## M02 — Razão e proporção

### M02.1 · Razão e proporção
- **O que é:** Razão é a divisão a/b com significado. Proporção é a igualdade de duas razões.
- **Como identificar:** Pistas: “na razão de 2 para 3”, “para cada”, “por 100 mil habitantes”. Veja se a razão é parte-parte ou parte-todo.
- **Exemplo:** Meninos e meninas na razão 2 : 3, total 40. Escreva 2k + 3k = 40: k = 8, logo 16 meninos e 24 meninas.
- **Caderno:**
  - `a/b = c/d ⇒ a·d = b·c`
  - `razão a : b ⇒ partes ak e bk`
  - `taxa por 100 mil = casos ÷ população × 100 000`
- **Cuidado:** Razão 2 : 3 entre partes dá frações 2/5 e 3/5 do total, não 2/3.

### M02.2 · Regra de três
- **O que é:** Com grandezas proporcionais, três valores dão o quarto. Na composta, entram três ou mais grandezas.
- **Como identificar:** Duas ou mais grandezas que variam juntas: operários, dias, horas por dia, produção, consumo, dose.
- **Exemplo:** 6 pedreiros fazem um muro em 10 dias; 4 pedreiros levam x dias. Inversa: 6 · 10 = 4 · x, x = 15. Composta: 5 máquinas fazem 400 peças em 8 h; 4 máquinas em 10 h fazem 400 · (4/5) · (10/8) = 400 peças.
- **Caderno:**
  - `direta: a/b = c/x`
  - `inversa: a · b = c · x`
  - `composta: multiplique pelos fatores de cada grandeza`
  - `teste: se uma dobra, a outra dobra ou cai à metade?`
- **Cuidado:** Converta as unidades antes de montar: mg com mg, horas com horas.

### M02.3 · Escala
- **O que é:** Escala é a razão entre a medida no desenho e a medida real, as duas na mesma unidade.
- **Como identificar:** Pistas: mapa, planta, maquete, “1 : 25 000”, “cada centímetro representa”.
- **Exemplo:** Mapa 1 : 25 000 000. Cidades a 4 cm no mapa estão a 4 · 25 000 000 cm = 100 000 000 cm = 1 000 km.
- **Caderno:**
  - `E = desenho / real (mesma unidade)`
  - `1 km = 1 000 m = 100 000 cm`
  - `áreas: use o quadrado da escala`
- **Cuidado:** Escala de áreas é o quadrado da escala linear.

### M02.3 · Densidade
- **O que é:** Densidade é massa por unidade de volume: d = m/V. Densidade demográfica é habitantes por km².
- **Como identificar:** Pistas: g/cm³, kg/L, “habitantes por km²”, trocar massa por volume ou o contrário.
- **Exemplo:** O álcool tem d ≈ 0,8 g/cm³. Então 500 mL = 500 cm³ de álcool pesam 0,8 · 500 = 400 g.
- **Caderno:**
  - `d = m / V`
  - `1 g/cm³ = 1 kg/L = 1 000 kg/m³`
  - `1 mL = 1 cm³`
- **Cuidado:** Confira as unidades: g/cm³ e kg/m³ diferem por um fator 1 000.

### M02.4 · Direta e inversa
- **O que é:** Diretamente proporcionais: a razão é constante. Inversamente proporcionais: o produto é constante.
- **Como identificar:** Teste mental: se uma dobra, a outra dobra (direta) ou cai à metade (inversa)? Velocidade e tempo são inversas.
- **Exemplo:** Engrenagens: dentes × voltas é constante. Uma de 40 dentes dá 3 voltas; a de 24 dentes dá 40 · 3/24 = 5 voltas.
- **Caderno:**
  - `direta: y = k·x  (y/x constante)`
  - `inversa: y = k/x  (x·y constante)`
  - `inversa ao quadrado: y = k/x²`
  - `em y = k/x², dobrar x divide y por 4`
- **Cuidado:** Velocidade 25% maior não corta 25% do tempo: t cai para 1/1,25 = 0,8, ou seja, 20% a menos.

### M02.5 · Divisão proporcional
- **O que é:** Repartir um total em partes proporcionais a pesos dados. Cada parte = total × peso ÷ soma dos pesos.
- **Como identificar:** Pistas: “proporcional ao valor investido”, “na razão de”, sociedade, herança, prêmio repartido.
- **Exemplo:** Lucro de R$ 18 000 entre sócios que investiram 2, 3 e 4 mil reais. Soma dos pesos 9: partes de R$ 4 000, R$ 6 000 e R$ 8 000.
- **Caderno:**
  - `partes: a·k, b·k, c·k`
  - `k = total / (a + b + c)`
  - `inversamente: use os pesos 1/a, 1/b, 1/c`
- **Cuidado:** Confira a ordem pedida: a alternativa pode listar as partes em outra ordem.

## M03 — Porcentagem e finanças

### M03.1 · Porcentagem simples
- **O que é:** x% é x/100. Toda porcentagem é de alguma base: achar a base é metade da questão.
- **Como identificar:** Pistas: “do total”, “dos que”, “supera em”, “em relação a”. Porcentagem de porcentagem multiplica.
- **Exemplo:** Numa turma, 35% reprovaram e 80% desses estudavam à noite: 0,8 · 0,35 = 0,28 = 28% da turma. Se esses 28% são 56 alunos, a turma tem 56 ÷ 0,28 = 200.
- **Caderno:**
  - `x% de A = (x/100) · A`
  - `total = parte ÷ (x/100)`
  - `variação = (novo − antigo) / antigo`
  - `pontos percentuais: diferença simples`
- **Cuidado:** De 10% para 15% são 5 pontos percentuais, mas um aumento relativo de 50%.

### M03.2 · Aumentos e descontos sucessivos
- **O que é:** Cada aumento ou desconto vira fator: × (1 + i) ou × (1 − i). Variações sucessivas se multiplicam.
- **Como identificar:** Pistas: “em seguida”, “sobre o novo preço”, “reajuste”, “voltar ao valor original”, inflação.
- **Exemplo:** Aumento de 20% e depois desconto de 20%: 1,2 · 0,8 = 0,96, perda de 4%. Para anular um desconto de 20%: 1/0,8 = 1,25, reajuste de 25%.
- **Caderno:**
  - `aumento i: × (1 + i)   desconto i: × (1 − i)`
  - `fator total = f₁ · f₂ · f₃ · …`
  - `valor antigo = novo ÷ (1 + i)`
  - `variação total = fator total − 1`
- **Cuidado:** Para voltar ao valor original, divida pelo fator; não subtraia a mesma porcentagem.

### M03.3 · Juros simples
- **O que é:** O juro de cada período incide sempre sobre o capital inicial. O montante cresce em linha reta.
- **Como identificar:** Pistas: “juros simples”, taxa ao mês ou ao ano, pedido de capital, prazo ou taxa a partir dos outros dados.
- **Exemplo:** R$ 2 000 a 3% ao mês por 5 meses: J = 2 000 · 0,03 · 5 = R$ 300; M = R$ 2 300. A 4% ao mês, o capital dobra quando i · n = 1: n = 25 meses.
- **Caderno:**
  - `J = C · i · n`
  - `M = C + J = C(1 + i·n)`
  - `taxa e tempo na mesma unidade`
  - `dobrar: J = C ⇒ i · n = 1`
- **Cuidado:** Taxa ao ano com tempo em meses: converta antes (12% ao ano = 1% ao mês, em juros simples).

### M03.4 · Juros compostos
- **O que é:** O juro de cada período entra no capital e passa a render juro. O montante cresce em progressão geométrica.
- **Como identificar:** Pistas: “juros compostos”, “capitalização mensal”, rendimento acumulado, comparação entre à vista e a prazo.
- **Exemplo:** R$ 1 000 a 10% ao mês, compostos, por 2 meses: M = 1 000 · 1,1² = R$ 1 210. Em juros simples seriam R$ 1 200.
- **Caderno:**
  - `M = C · (1 + i)ⁿ`
  - `J = M − C`
  - `taxa: (1 + i)ⁿ = M/C`
  - `tempo: n = log(M/C) / log(1 + i)`
- **Cuidado:** Em juros compostos, 2 meses a 10% rendem 21%, não 20%.

### M03.5 · Dose e concentração
- **O que é:** Dose por massa se multiplica pela massa do paciente. Concentração diz quanto soluto há em cada volume.
- **Como identificar:** Pistas: mg/kg, mg/mL, g/L, frasco, infusão por minuto, diluição em soro, “dividida em tomadas”.
- **Exemplo:** Prescrição de 15 mg/kg para uma criança de 20 kg: 300 mg. Xarope com 100 mg/5 mL = 20 mg/mL: volume = 300 ÷ 20 = 15 mL.
- **Caderno:**
  - `dose = (mg/kg) × massa (kg)`
  - `C = m / V`
  - `volume = dose ÷ C`
  - `diluição: C₁ · V₁ = C₂ · V₂`
- **Cuidado:** Separe dose por tomada de dose por dia: “dividida em 3 tomadas” divide por 3.

## M04 — Equações e sistemas

### M04.1 · Equação do 1.º grau
- **O que é:** Igualdade com incógnita de expoente 1. Isola-se x fazendo a mesma operação nos dois lados.
- **Como identificar:** Texto com um valor desconhecido e relação linear: parte fixa + parte variável, “10% a mais que”, comparação de planos.
- **Exemplo:** Táxi: R$ 5 de bandeirada + R$ 2,50 por km. A corrida custou R$ 30: 5 + 2,5x = 30, logo x = 10 km.
- **Caderno:**
  - `ax + b = 0 ⇒ x = −b/a  (a ≠ 0)`
  - `mude de lado com a operação inversa`
  - `com frações: multiplique tudo pelo MMC`
- **Cuidado:** Ao multiplicar pelo MMC, multiplique todos os termos, inclusive os que não têm fração.

### M04.2 · Equação do 2.º grau
- **O que é:** ax² + bx + c = 0, com a ≠ 0. Tem até duas raízes reais, conforme o sinal de Δ.
- **Como identificar:** Área de retângulo com lados x e x + k, produto de idades, “os gráficos se cruzam” (Δ ≥ 0).
- **Exemplo:** Retângulo de lados x e x + 3, área 40: x² + 3x − 40 = 0. Δ = 9 + 160 = 169; x = (−3 + 13)/2 = 5. A raiz −8 é descartada.
- **Caderno:**
  - `Δ = b² − 4ac`
  - `x = (−b ± √Δ) / (2a)`
  - `Δ > 0: 2 raízes · Δ = 0: 1 · Δ < 0: nenhuma real`
- **Cuidado:** Em problema real, descarte a raiz sem sentido, como medida ou tempo negativo.

### M04.2 · Soma e produto das raízes
- **O que é:** Sem resolver, as raízes de ax² + bx + c = 0 somam −b/a e têm produto c/a.
- **Como identificar:** Pede soma, produto ou sinal das raízes, ou condição para “duas raízes positivas distintas”.
- **Exemplo:** x² − 7x + 10 = 0: soma 7 e produto 10, logo raízes 2 e 5. Duas raízes positivas distintas exigem Δ > 0, S > 0 e P > 0.
- **Caderno:**
  - `S = x₁ + x₂ = −b/a`
  - `P = x₁ · x₂ = c/a`
  - `a = 1: x² − Sx + P = 0`
  - `raízes positivas: Δ > 0, S > 0, P > 0`
- **Cuidado:** Δ > 0 garante raízes distintas, não positivas: confira também S e P.

### M04.3 · Sistemas lineares
- **O que é:** Duas ou mais equações com as mesmas incógnitas, valendo juntas. Resolve-se por substituição ou adição.
- **Como identificar:** Texto com dois totais: quantidade e valor, peso e preço, km e gasto. Muitas vezes pede a soma ou a diferença.
- **Exemplo:** 20 moedas de 25 e 50 centavos somam R$ 7: x + y = 20 e 0,25x + 0,5y = 7. Resultado: x = 12 e y = 8.
- **Caderno:**
  - `substituição: isole uma e troque na outra`
  - `adição: multiplique e some para cancelar`
  - `pediu x + y ou x − y? some ou subtraia direto`
- **Cuidado:** Leia o que se pede: muitas vezes é x − y ou x + y, e não cada valor.

### M04.3 · Classificar sistemas
- **O que é:** Possível determinado tem uma solução; indeterminado, infinitas; impossível, nenhuma.
- **Como identificar:** Pede “para que valor de k” o sistema tem solução única, infinitas ou nenhuma.
- **Exemplo:** x + 2y = 3 e 2x + 4y = k têm coeficientes proporcionais (1/2 = 2/4). Se k = 6, é indeterminado; se k ≠ 6, é impossível.
- **Caderno:**
  - `SPD: det ≠ 0 (solução única)`
  - `det = 0: SPI ou SI, compare as equações`
  - `a/a' = b/b' = c/c' ⇒ SPI`
  - `a/a' = b/b' ≠ c/c' ⇒ SI`
- **Cuidado:** det = 0 não significa impossível: o sistema pode ter infinitas soluções.

### M04.4 · Inequações
- **O que é:** Desigualdade com incógnita. Resolve-se como equação, mas a resposta é um intervalo.
- **Como identificar:** Pistas: “no mínimo”, “no máximo”, “a partir de quando”, “vale mais a pena”, “ultrapassa”.
- **Exemplo:** Plano A: 50 + 2x; plano B: 80 + 0,5x. A é mais barato se 50 + 2x < 80 + 0,5x: 1,5x < 30, ou seja, x < 20.
- **Caderno:**
  - `multiplicou ou dividiu por negativo: inverta o sentido`
  - `−2x > 6 ⇒ x < −3`
  - `“no mínimo” = ≥   “no máximo” = ≤`
- **Cuidado:** Ao multiplicar ou dividir por número negativo, inverta o sentido da desigualdade.

### M04.4 · Inequação produto e quociente
- **O que é:** Para f · g ou f/g comparado a zero, estude o sinal de cada fator e combine num quadro de sinais.
- **Como identificar:** Fração com x no denominador, produto de parênteses, como (x − 1)(x − 2)/x < 0.
- **Exemplo:** (x − 3)/(x + 1) ≤ 0. Raízes 3 e −1. Pelo quadro de sinais: −1 < x ≤ 3. O −1 fica de fora, pois zera o denominador.
- **Caderno:**
  - `ache a raiz de cada fator`
  - `quadro de sinais: + ou − em cada intervalo`
  - `raiz do denominador: sempre bola aberta`
- **Cuidado:** Não multiplique os dois lados por um denominador de sinal desconhecido.

### M04.5 · Modelagem algébrica
- **O que é:** Traduzir o texto em equação: escolher a incógnita, escrever cada frase em símbolos e resolver.
- **Como identificar:** Problemas de idade, algarismos, balança, troco, aluguel com taxa. O difícil é a tradução, não a conta.
- **Exemplo:** Número de dois algarismos ab vale 10a + b. Trocando os algarismos, ele aumenta 27: (10b + a) − (10a + b) = 27, logo b − a = 3.
- **Caderno:**
  - `ab = 10a + b   abc = 100a + 10b + c`
  - `“há t anos”: idade − t   “daqui a t”: idade + t`
  - `“o dobro de x”: 2x   “x a mais que y”: y + x`
- **Cuidado:** Irmãs de uma menina: a própria menina não conta, então são m − 1.

## M05 — Funções afim e quadrática

### M05.1 · Função afim
- **O que é:** f(x) = ax + b: a é a taxa de variação, b é o valor em x = 0. O gráfico é uma reta.
- **Como identificar:** Parte fixa + parte que cresce sempre igual: bandeirada + km, assinatura + minutos, nível que cai a ritmo constante.
- **Exemplo:** Pontos (2, 7) e (5, 16): a = (16 − 7)/(5 − 2) = 3; b = 7 − 3 · 2 = 1. Logo f(x) = 3x + 1.
- **Caderno:**
  - `f(x) = ax + b`
  - `a = Δy/Δx = (y₂ − y₁)/(x₂ − x₁)`
  - `b = f(0): onde a reta corta o eixo y`
  - `raiz: x = −b/a`
- **Cuidado:** a é a variação por unidade de x; não o confunda com o valor inicial b.

### M05.2 · Função quadrática e vértice
- **O que é:** f(x) = ax² + bx + c tem gráfico parábola. O vértice dá o máximo (a < 0) ou o mínimo (a > 0).
- **Como identificar:** Pistas: “valor máximo”, “lucro máximo”, “altura máxima”, “em que instante”, área máxima com perímetro fixo.
- **Exemplo:** Lucro L(x) = −x² + 40x − 300. xᵥ = −40/(2 · (−1)) = 20 unidades; L(20) = −400 + 800 − 300 = 100. Lucro máximo: 100.
- **Caderno:**
  - `xᵥ = −b / (2a)`
  - `yᵥ = −Δ / (4a) = f(xᵥ)`
  - `a > 0: mínimo · a < 0: máximo`
  - `forma fatorada: f(x) = a(x − x₁)(x − x₂)`
- **Cuidado:** O valor máximo é o yᵥ; o xᵥ só diz onde ele ocorre (quanto produzir, quando).

### M05.3 · Leitura de gráficos
- **O que é:** Ler gráfico é traduzir: inclinação é taxa, cruzamento é igualdade, acima do eixo x é positivo.
- **Como identificar:** Posição × tempo, duas curvas no mesmo plano, “em que intervalo f(x) > g(x)”, gráficos transformados.
- **Exemplo:** Deslocando f(x) = x²: g(x) = (x − 2)² + 1 é a mesma parábola, 2 unidades para a direita e 1 para cima.
- **Caderno:**
  - `f(x − k): desloca k para a direita`
  - `f(x) + k: desloca k para cima`
  - `−f(x): reflete no eixo x`
  - `f(x) > g(x): trecho com f acima de g`
- **Cuidado:** f(x − 2) vai para a direita, não para a esquerda.

### M05.4 · Função definida por partes
- **O que é:** Cada trecho do domínio tem sua própria lei. Primeiro descubra em que trecho o x cai.
- **Como identificar:** Tarifas por faixa, imposto, conta de água, gráfico feito de segmentos com inclinações diferentes.
- **Exemplo:** Água: R$ 30 até 10 m³ e R$ 5 por m³ além disso. Consumo de 16 m³: 30 + 5 · 6 = R$ 60.
- **Caderno:**
  - `f(x) = lei 1 se x ≤ k;  lei 2 se x > k`
  - `1.º ache o trecho; 2.º use a lei dele`
- **Cuidado:** Na faixa excedente, a taxa vale só para o que passa do limite.

### M05.4 · Módulo
- **O que é:** |x| é a distância de x até zero: |x| = x se x ≥ 0, e |x| = −x se x < 0.
- **Como identificar:** Barras de módulo em equação ou inequação, “distância entre”, tolerância (“erro de no máximo”).
- **Exemplo:** |2x − 1| = 5: 2x − 1 = 5 ou 2x − 1 = −5, então x = 3 ou x = −2. Já |x − 10| ≤ 2 dá 8 ≤ x ≤ 12.
- **Caderno:**
  - `|A| = k (k ≥ 0) ⇒ A = k ou A = −k`
  - `|A| ≤ k ⇒ −k ≤ A ≤ k`
  - `|A| ≥ k ⇒ A ≤ −k ou A ≥ k`
  - `|A| = B exige B ≥ 0`
- **Cuidado:** Em |2x − 1| = x − 1, as raízes 0 e 2/3 deixam x − 1 negativo: nenhuma serve.

### M05.5 · Composição e inversa
- **O que é:** f(g(x)) aplica primeiro g e depois f. A inversa desfaz a função: troque x por y e isole.
- **Como identificar:** Notação f(g(x)), f∘g ou f⁻¹, “função que desfaz”, conversão de escalas de temperatura.
- **Exemplo:** f(x) = 2x + 1 e g(x) = x²: f(g(3)) = f(9) = 19, mas g(f(3)) = g(7) = 49. Inversa: f⁻¹(x) = (x − 1)/2.
- **Caderno:**
  - `(f∘g)(x) = f(g(x)): de dentro para fora`
  - `inversa: troque x e y e isole y`
  - `f(f⁻¹(x)) = x`
- **Cuidado:** Em geral f(g(x)) ≠ g(f(x)): a ordem importa.

## M06 — Exponencial e logaritmo

### M06.1 · Função exponencial
- **O que é:** f(x) = a · bˣ: a cada unidade de x, o valor é multiplicado pelo mesmo fator b.
- **Como identificar:** Pistas: “dobra a cada”, “cresce 3% ao ano”, “cai pela metade”, bactérias, população, juros compostos.
- **Exemplo:** Bactérias que dobram a cada 20 min, começando com 500: N(t) = 500 · 2^(t/20). Em 1 h: 500 · 2³ = 4 000.
- **Caderno:**
  - `f(x) = a · bˣ, com a = f(0)`
  - `b > 1: cresce · 0 < b < 1: decresce`
  - `cresce i por período: b = 1 + i`
  - `dobra a cada T: f(t) = a · 2^(t/T)`
- **Cuidado:** Crescer 5% ao ano por 10 anos não dá 50%: 1,05¹⁰ ≈ 1,63, ou seja, cerca de 63%.

### M06.2 · Equação exponencial
- **O que é:** Incógnita no expoente. Iguale as bases e compare os expoentes; se não der, aplique logaritmo.
- **Como identificar:** x no expoente: 2ˣ = 32, 4ˣ⁺¹ = 8, 1,1ⁿ = 2. Bases que viram potência de 2, 3 ou 5.
- **Exemplo:** 4ˣ⁺¹ = 8 ⇒ 2^(2x + 2) = 2³ ⇒ 2x + 2 = 3 ⇒ x = 1/2. E 1,1ⁿ = 2 ⇒ n = log 2 / log 1,1 ≈ 7,3.
- **Caderno:**
  - `aˣ = aʸ ⇒ x = y  (a > 0, a ≠ 1)`
  - `4 = 2²  8 = 2³  27 = 3³  125 = 5³`
  - `bases diferentes: log nos dois lados`
  - `aˣ = b ⇒ x = log b / log a`
- **Cuidado:** n ≈ 7,3 períodos: contando períodos inteiros, o valor só passa do dobro no 8.º.

### M06.3 · Logaritmo: definição
- **O que é:** Logaritmo é o expoente: log_b a = x significa bˣ = a. Sem base escrita, a base é 10.
- **Como identificar:** Escalas de pH, decibéis e Richter; tabelas com log 2 ≈ 0,30 e log 3 ≈ 0,48; x preso no expoente.
- **Exemplo:** log₂ 32 = 5, pois 2⁵ = 32. log 1 000 = 3. pH = −log[H⁺]: com [H⁺] = 10⁻⁴ mol/L, pH = 4.
- **Caderno:**
  - `log_b a = x ⇔ bˣ = a`
  - `condições: a > 0, b > 0, b ≠ 1`
  - `log_b 1 = 0   log_b b = 1`
  - `b^(log_b a) = a`
- **Cuidado:** Só existe logaritmo de número positivo.

### M06.3 · Propriedades do logaritmo
- **O que é:** As propriedades transformam produto em soma, divisão em subtração e potência em multiplicação.
- **Como identificar:** Pede log de número que se decompõe (log 12, log 2,5, log 3 000) ou razão entre intensidades.
- **Exemplo:** Com log 2 ≈ 0,30 e log 3 ≈ 0,48: log 12 = 2 log 2 + log 3 ≈ 1,08. log 2,5 = log 10 − log 4 ≈ 1 − 0,60 = 0,40.
- **Caderno:**
  - `log(a · b) = log a + log b`
  - `log(a/b) = log a − log b`
  - `log aⁿ = n · log a`
  - `mudança de base: log_b a = log a / log b`
- **Cuidado:** log(a + b) não é log a + log b: a propriedade vale para produto.

### M06.4 · Equação logarítmica
- **O que é:** Isole o log e aplique a definição: log_b A = k vira A = bᵏ. Depois, confira a condição de existência.
- **Como identificar:** x dentro do logaritmo: log₂(x − 1) = 3, log x + log(x − 3) = 1, fórmula de decibéis com incógnita.
- **Exemplo:** log₂(x − 1) = 3 ⇒ x − 1 = 2³ ⇒ x = 9. E log x + log(x − 3) = 1 ⇒ x(x − 3) = 10 ⇒ x = 5, pois −2 não serve.
- **Caderno:**
  - `log_b A = k ⇒ A = bᵏ`
  - `log_b A = log_b B ⇒ A = B  (A, B > 0)`
  - `junte os logs com as propriedades antes`
  - `teste: todo argumento > 0`
- **Cuidado:** Teste as raízes: a que deixa argumento negativo ou zero é descartada.

### M06.5 · Meia-vida e decaimento
- **O que é:** Meia-vida é o tempo para a quantidade cair à metade. A cada meia-vida, multiplique por 1/2.
- **Como identificar:** Pistas: fármaco no sangue, radioisótopo, “meia-vida de”, “restará quanto”, “após quantas horas”.
- **Exemplo:** Fármaco com meia-vida de 6 h, dose de 400 mg. Após 24 h, ou 4 meias-vidas: 400 · (1/2)⁴ = 25 mg.
- **Caderno:**
  - `N = N₀ · (1/2)^(t/T)`
  - `t = T · log₂(N₀/N)`
  - `cai p por hora: N = N₀ · (1 − p)ᵗ`
  - `duplicação: e^(kt) = 2 ⇒ t = ln 2 / k`
- **Cuidado:** Com doses repetidas, cada dose decai pelo seu próprio tempo; some o que resta de cada uma.

## M07 — Sequências

### M07.1 · Progressão aritmética
- **O que é:** Na PA, cada termo é o anterior mais uma razão r constante.
- **Como identificar:** Pistas: “aumenta sempre 3”, “a cada mês acrescenta”, poltronas por fileira, primeiro e último termo dados.
- **Exemplo:** PA com a₁ = 43 e r = 4: a₃₆ = 43 + 35 · 4 = 183. Logo, de 43 a 183 com razão 4 há 36 termos.
- **Caderno:**
  - `aₙ = a₁ + (n − 1) · r`
  - `r = a₂ − a₁`
  - `termo do meio: b = (a + c)/2`
  - `3 termos: x − r, x, x + r`
- **Cuidado:** Do 1.º ao n-ésimo termo há n − 1 saltos de razão, não n.

### M07.2 · Progressão geométrica
- **O que é:** Na PG, cada termo é o anterior multiplicado por uma razão q constante.
- **Como identificar:** Pistas: “dobra a cada”, “reduz à metade”, “cresce 10% por período”, média geométrica b² = a · c.
- **Exemplo:** PG 3, 6, 12, …: q = 2. a₈ = 3 · 2⁷ = 384.
- **Caderno:**
  - `aₙ = a₁ · qⁿ⁻¹`
  - `q = a₂ / a₁`
  - `termo do meio: b² = a · c`
  - `3 termos: x/q, x, x · q`
- **Cuidado:** O expoente é n − 1: a₈ usa q⁷, não q⁸.

### M07.3 · Soma da PA
- **O que é:** A soma de n termos de uma PA é a média do primeiro e do último, vezes n.
- **Como identificar:** Pistas: “total acumulado”, “soma das parcelas”, “quantos lugares no teatro”, “até superar”.
- **Exemplo:** Teatro com 20 fileiras: 10 lugares na 1.ª e 2 a mais em cada uma. a₂₀ = 10 + 19 · 2 = 48; S = (10 + 48) · 20/2 = 580 lugares.
- **Caderno:**
  - `Sₙ = (a₁ + aₙ) · n / 2`
  - `1 + 2 + … + n = n(n + 1)/2`
- **Cuidado:** Ache aₙ antes de somar; a soma não é a₁ · n.

### M07.3 · Soma da PG
- **O que é:** Na PG, a soma finita tem fórmula própria. Se |q| < 1, a soma infinita converge para um valor.
- **Como identificar:** Pistas: “lucro reaplicado”, “cada etapa leva metade do tempo”, processo infinito, figuras encaixadas.
- **Exemplo:** 1 + 1/2 + 1/4 + … = 1/(1 − 1/2) = 2. E 2 + 6 + 18 + 54 = 2 · (3⁴ − 1)/(3 − 1) = 80.
- **Caderno:**
  - `Sₙ = a₁ · (qⁿ − 1)/(q − 1)  (q ≠ 1)`
  - `S∞ = a₁ / (1 − q), se |q| < 1`
- **Cuidado:** A soma infinita só existe se |q| < 1.

### M07.4 · Padrões e recorrências
- **O que é:** Recorrência define cada termo a partir do anterior. Calcule termos até achar o padrão ou o ciclo.
- **Como identificar:** Pistas: “o próximo termo é”, figuras que crescem, “se for par, divida por 2”, tabelas de números.
- **Exemplo:** a₁ = 6; se par, divida por 2; se ímpar, faça 3a + 1. Sequência: 6, 3, 10, 5, 16, 8, 4, 2, 1, 4, 2, 1, … e entra em ciclo.
- **Caderno:**
  - `escreva os primeiros 5 a 8 termos`
  - `procure: soma fixa (PA), fator fixo (PG) ou ciclo`
  - `ciclo de período p: use o resto de n por p`
- **Cuidado:** Não chute a fórmula com dois termos; confirme no terceiro e no quarto.

## M08 — Geometria plana — áreas

### M08.1 · Triângulos
- **O que é:** A área do triângulo é base vezes altura sobre 2. A soma dos ângulos internos é 180°.
- **Como identificar:** Figura com triângulo, lados e ângulos dados, área pedida, triângulo equilátero ou retângulo.
- **Exemplo:** Lados 6 e 8 com 30° entre eles: A = (1/2) · 6 · 8 · sen 30° = 12. Equilátero de lado 4: A = 16√3/4 = 4√3.
- **Caderno:**
  - `A = b · h / 2`
  - `A = (1/2) · a · b · sen θ`
  - `equilátero: A = L²√3/4   h = L√3/2`
  - `soma dos ângulos internos = 180°`
- **Cuidado:** A altura é perpendicular à base; não use o lado inclinado como altura.

### M08.2 · Quadriláteros
- **O que é:** Retângulo, paralelogramo, losango, trapézio e quadrado. Cada um tem sua fórmula de área.
- **Como identificar:** Terrenos, lonas, cartazes, peças recortadas, diagonal do quadrado, trapézio em perfil de rampa.
- **Exemplo:** Trapézio de bases 10 e 6 e altura 4: A = (10 + 6) · 4/2 = 32. Losango de diagonais 8 e 6: A = 8 · 6/2 = 24.
- **Caderno:**
  - `retângulo e paralelogramo: A = b · h`
  - `trapézio: A = (B + b) · h / 2`
  - `losango: A = D · d / 2`
  - `quadrado: diagonal = L√2`
- **Cuidado:** No paralelogramo, a altura não é o lado inclinado.

### M08.3 · Circunferência e arco
- **O que é:** Circunferência é a linha; círculo é a região. O comprimento é C = 2πr, e o arco é uma fração dele.
- **Como identificar:** Pistas: rodas e voltas, pista circular, ponteiros de relógio, “quantas voltas”, ângulo central dado.
- **Exemplo:** Roda de raio 30 cm: C = 2π · 30 ≈ 188,4 cm, com π ≈ 3,14. Em 942 m, ela dá 94 200 ÷ 188,4 = 500 voltas.
- **Caderno:**
  - `C = 2πr = πd`
  - `arco de θ graus: ℓ = (θ/360°) · 2πr`
  - `arco em radianos: ℓ = θ · r`
- **Cuidado:** Confira se o dado é raio ou diâmetro: o diâmetro é o dobro do raio.

### M08.3 · Círculo e setor
- **O que é:** A área do círculo é πr². Setor é uma fatia: sua área é proporcional ao ângulo central.
- **Como identificar:** Pistas: fatia de pizza, área de giro, área regada por aspersor, ângulo central, coroa circular.
- **Exemplo:** Setor de 60° num círculo de raio 6: A = (60/360) · π · 36 = 6π. Coroa entre raios 5 e 3: π(25 − 9) = 16π.
- **Caderno:**
  - `A = πr²`
  - `setor de θ graus: A = (θ/360°) · πr²`
  - `coroa: A = π(R² − r²)`
- **Cuidado:** Dobrar o raio quadruplica a área: (2r)² = 4r².

### M08.4 · Polígonos regulares
- **O que é:** Lados iguais e ângulos iguais. Ângulo interno, ângulo externo e área dependem do número de lados n.
- **Como identificar:** Pistas: hexágono de colmeia, piso que encaixa (soma 360° em um vértice), “polígono de n lados”.
- **Exemplo:** Hexágono regular de lado 2: são 6 equiláteros, A = 6 · 4√3/4 = 6√3. Ângulo interno: 4 · 180°/6 = 120°.
- **Caderno:**
  - `Sᵢ = (n − 2) · 180°`
  - `ângulo interno = (n − 2) · 180° / n`
  - `ângulo externo = 360° / n`
  - `hexágono: A = 3L²√3/2`
- **Cuidado:** Para ladrilhar, os ângulos em torno de um vértice precisam somar exatamente 360°.

### M08.5 · Áreas compostas
- **O que é:** Região complicada é soma ou diferença de figuras simples. Decomponha antes de calcular.
- **Como identificar:** Região hachurada, figura em malha quadriculada, círculo dentro de quadrado, área entre curvas.
- **Exemplo:** Quadrado de lado 4 com círculo inscrito de raio 2: área hachurada = 16 − 4π ≈ 3,43.
- **Caderno:**
  - `hachurado = área de fora − área de dentro`
  - `malha: retângulo envolvente − triângulos dos cantos`
  - `círculo inscrito no quadrado: r = L/2`
  - `quadrado inscrito no círculo: diagonal = 2r`
- **Cuidado:** Não conte duas vezes a região de sobreposição.

## M09 — Geometria plana — relações

### M09.1 · Teorema de Pitágoras
- **O que é:** Em todo triângulo retângulo, o quadrado da hipotenusa é a soma dos quadrados dos catetos.
- **Como identificar:** Pistas: ângulo reto, escada encostada, diagonal, distância em linha reta, altura de triângulo isósceles.
- **Exemplo:** Escada de 5 m com o pé a 3 m da parede: h² + 3² = 5², logo h = 4 m. Ternos úteis: 3-4-5, 5-12-13, 6-8-10.
- **Caderno:**
  - `a² = b² + c²  (a = hipotenusa)`
  - `diagonal do quadrado: d = L√2`
  - `altura do equilátero: h = L√3/2`
  - `diagonal do bloco: D = √(a² + b² + c²)`
- **Cuidado:** A hipotenusa é o maior lado, oposto ao ângulo reto: ela fica sozinha na igualdade.

### M09.2 · Teorema de Tales
- **O que é:** Retas paralelas cortadas por duas transversais determinam segmentos proporcionais.
- **Como identificar:** Pistas: ruas paralelas cortadas por avenidas, lotes, reta paralela a um lado do triângulo.
- **Exemplo:** Ruas paralelas cortam a avenida A em trechos de 30 m e 45 m. Na avenida B, os trechos são 40 m e x. 30/45 = 40/x, logo x = 60 m.
- **Caderno:**
  - `a / b = c / d (segmentos correspondentes)`
  - `paralela a um lado: AD/AB = AE/AC`
- **Cuidado:** Compare segmentos correspondentes, na mesma ordem nas duas transversais.

### M09.3 · Semelhança de triângulos
- **O que é:** Triângulos semelhantes têm ângulos iguais e lados proporcionais. Dois ângulos iguais já bastam (caso AA).
- **Como identificar:** Pistas: sombras no mesmo instante, poste e prédio, paralela dentro de triângulo, mapa, ampliação.
- **Exemplo:** Poste de 3 m faz sombra de 2 m; no mesmo instante, um prédio faz 30 m de sombra. 3/2 = h/30, logo h = 45 m.
- **Caderno:**
  - `razão de semelhança: k = lado₁ / lado₂`
  - `razão das áreas = k²`
  - `razão dos volumes = k³`
  - `caso AA: dois ângulos iguais`
- **Cuidado:** Áreas usam k² e volumes usam k³; não use k direto.

### M09.4 · Relações métricas
- **O que é:** A altura relativa à hipotenusa divide o triângulo retângulo em dois triângulos semelhantes a ele.
- **Como identificar:** Pistas: altura até a hipotenusa, projeções m e n, triângulo inscrito em semicircunferência.
- **Exemplo:** Catetos 6 e 8, hipotenusa 10: h = 6 · 8/10 = 4,8. Projeções: m = 6²/10 = 3,6 e n = 8²/10 = 6,4.
- **Caderno:**
  - `a · h = b · c`
  - `b² = a · m  (m = projeção de b)`
  - `c² = a · n  (n = projeção de c)`
  - `h² = m · n   m + n = a`
- **Cuidado:** Triângulo inscrito em semicircunferência, com o diâmetro como lado, é retângulo.

### M09.5 · Ângulos e paralelas
- **O que é:** Paralelas cortadas por uma transversal formam ângulos alternos iguais e colaterais suplementares.
- **Como identificar:** Retas paralelas na figura, linha em zigue-zague entre paralelas, soma de ângulos de polígono.
- **Exemplo:** Bico entre duas paralelas: seus lados fazem 30° e 45° com as retas, ângulos abertos para o lado do bico. O bico mede 30° + 45° = 75°.
- **Caderno:**
  - `alternos internos: iguais`
  - `colaterais internos: somam 180°`
  - `bico entre paralelas: soma dos ângulos com elas`
  - `polígono de n lados: Sᵢ = (n − 2) · 180°`
- **Cuidado:** Colaterais somam 180°; não os trate como iguais.

### M09.5 · Ângulos na circunferência
- **O que é:** O ângulo inscrito vale metade do ângulo central que enxerga o mesmo arco.
- **Como identificar:** Vértice sobre a circunferência, triângulo com um lado no diâmetro, reta tangente ao círculo.
- **Exemplo:** Arco de 100°: ângulo central de 100°, inscrito de 50°. Inscrito que enxerga o diâmetro (arco de 180°) vale 90°.
- **Caderno:**
  - `inscrito = central / 2`
  - `inscrito na semicircunferência = 90°`
  - `tangente ⊥ raio no ponto de contato`
  - `tangente-corda = inscrito do mesmo arco`
- **Cuidado:** O ângulo inscrito é metade do central, não igual a ele.

## M10 — Trigonometria

### M10.1 · Seno, cosseno e tangente
- **O que é:** No triângulo retângulo, seno, cosseno e tangente ligam um ângulo agudo a dois lados.
- **Como identificar:** Pistas: ângulo de elevação, rampa, teodolito, sombra, “inclinação de”, tabela de senos dada.
- **Exemplo:** Rampa de 10 m inclinada 30°: altura = 10 · sen 30° = 5 m. Avanço horizontal = 10 · cos 30° = 5√3 ≈ 8,66 m.
- **Caderno:**
  - `sen θ = oposto / hipotenusa`
  - `cos θ = adjacente / hipotenusa`
  - `tg θ = oposto / adjacente = sen θ / cos θ`
  - `teodolito: some a altura do aparelho`
- **Cuidado:** Oposto e adjacente dependem do ângulo escolhido: marque o ângulo antes.

### M10.1 · Ângulos notáveis
- **O que é:** 30°, 45° e 60° têm seno, cosseno e tangente exatos. Os valores saem do equilátero e do quadrado.
- **Como identificar:** Enunciado com 30°, 45° ou 60° e alternativas com √2 ou √3.
- **Exemplo:** Pipa com 50 m de linha esticada, a 60° da horizontal: altura = 50 · sen 60° = 25√3 ≈ 43,3 m acima da mão.
- **Caderno:**
  - `30°: sen 1/2 · cos √3/2 · tg √3/3`
  - `45°: sen √2/2 · cos √2/2 · tg 1`
  - `60°: sen √3/2 · cos 1/2 · tg √3`
  - `sen θ = cos(90° − θ)`
- **Cuidado:** tg 30° = √3/3 e tg 60° = √3: não troque os dois.

### M10.2 · Lei dos senos
- **O que é:** Em qualquer triângulo, cada lado dividido pelo seno do ângulo oposto dá o mesmo valor, 2R.
- **Como identificar:** Triângulo não retângulo com dois ângulos e um lado, ou pedido do raio da circunferência circunscrita.
- **Exemplo:** Lado de 100 m oposto a 30°; o lado x é oposto a 45°. 100/sen 30° = x/sen 45°, então x = 200 · √2/2 = 100√2 ≈ 141 m.
- **Caderno:**
  - `a / sen A = b / sen B = c / sen C = 2R`
  - `3.º ângulo: A + B + C = 180°`
  - `sen(180° − θ) = sen θ`
- **Cuidado:** Cada lado vai com o seno do ângulo oposto a ele, não do vizinho.

### M10.3 · Lei dos cossenos
- **O que é:** Generaliza Pitágoras para qualquer triângulo: usa dois lados e o ângulo entre eles.
- **Como identificar:** Dois lados e o ângulo entre eles (acha o 3.º lado), ou três lados (acha um ângulo).
- **Exemplo:** Lados 3 e 5 com 120° entre eles: a² = 9 + 25 − 2 · 3 · 5 · (−1/2) = 49, logo a = 7.
- **Caderno:**
  - `a² = b² + c² − 2bc · cos A`
  - `cos A = (b² + c² − a²) / (2bc)`
  - `cos 120° = −1/2   cos 90° = 0`
  - `ângulo obtuso: cosseno negativo`
- **Cuidado:** Com ângulo obtuso, o cosseno é negativo e o último termo passa a somar.

### M10.4 · Arcos e radianos
- **O que é:** Radiano mede o ângulo pelo arco: π rad = 180°. No ciclo, o arco volta ao mesmo ponto a cada 360°.
- **Como identificar:** Ângulo em radianos, arco de muitas voltas (como 1 470°), ponteiros de relógio, comprimento de arco.
- **Exemplo:** 1 470° = 4 · 360° + 30°: mesma posição de 30°, ou π/6 rad. E 3π/4 rad = 135°.
- **Caderno:**
  - `π rad = 180°`
  - `graus → radianos: × π/180`
  - `arco reduzido: tire voltas de 360°`
  - `comprimento: ℓ = θ · r  (θ em radianos)`
- **Cuidado:** ℓ = θ · r só vale com θ em radianos.

### M10.4 · Identidades e arco duplo
- **O que é:** Relações entre seno e cosseno resolvem equações e simplificam expressões. A fundamental vale para todo x.
- **Como identificar:** Aparecem sen²x e cos²x juntos, sen 2x, (sen x + cos x)², ou cosseno de 15° ou 75°.
- **Exemplo:** sen x = 3/5, com x no 1.º quadrante: cos x = 4/5. Então sen 2x = 2 · 3/5 · 4/5 = 24/25.
- **Caderno:**
  - `sen²x + cos²x = 1`
  - `sen 2x = 2 · sen x · cos x`
  - `cos 2x = cos²x − sen²x`
  - `cos(a − b) = cos a · cos b + sen a · sen b`
- **Cuidado:** sen 2x não é 2 sen x: use 2 · sen x · cos x.

### M10.5 · Funções trigonométricas
- **O que é:** y = a + b · sen(cx) oscila. b muda a amplitude, c muda o período e a desloca o gráfico na vertical.
- **Como identificar:** Fenômenos periódicos: maré, temperatura ao longo do dia, roda-gigante; pede máximo, mínimo ou período.
- **Exemplo:** T(t) = 20 + 5 · sen(πt/12), t em horas: máximo 25 °C (sen = 1), mínimo 15 °C (sen = −1), período 2π ÷ (π/12) = 24 h.
- **Caderno:**
  - `−1 ≤ sen x ≤ 1   −1 ≤ cos x ≤ 1`
  - `y = a + b · sen(cx): máx a + |b|, mín a − |b|`
  - `período = 2π / |c|`
  - `imagem: [a − |b|, a + |b|]`
- **Cuidado:** Multiplicar x por 3 divide o período por 3, não o multiplica.

## M11 — Geometria espacial

### M11.1 · Prismas
- **O que é:** Prisma tem duas bases iguais e paralelas. Volume é área da base vezes altura.
- **Como identificar:** Caixas, piscinas, aquários, tanques, “quantos litros cabem”, nível da água que sobe ou desce.
- **Exemplo:** Caixa-d'água de 2 m × 1,5 m × 1 m: V = 3 m³ = 3 000 L. A base tem 3 m²; retirar 600 L baixa o nível 0,6 ÷ 3 = 0,2 m.
- **Caderno:**
  - `V = A_base · h`
  - `paralelepípedo: V = a · b · c`
  - `área total: 2(ab + ac + bc)`
  - `1 m³ = 1 000 L   1 dm³ = 1 L`
- **Cuidado:** Converta para m³ ou dm³ antes de passar para litros.

### M11.1 · Cubo e diagonais
- **O que é:** No cubo de aresta a, todas as arestas são iguais. A diagonal da face é a√2; a do cubo, a√3.
- **Como identificar:** Cubo inscrito em esfera, distância entre vértices opostos, sólido submerso que faz a água subir.
- **Exemplo:** Cubo de aresta 2 cm afundado num recipiente desloca 8 cm³ de água. Diagonal do cubo: 2√3 ≈ 3,46 cm.
- **Caderno:**
  - `V = a³   área total = 6a²`
  - `diagonal da face: a√2`
  - `diagonal do cubo: a√3`
  - `volume submerso = volume de água deslocada`
- **Cuidado:** Dobrar a aresta multiplica o volume por 8, não por 2.

### M11.2 · Cilindros
- **O que é:** O volume do cilindro é a área da base, πr², vezes a altura.
- **Como identificar:** Latas, copos, garrafas, canos, tanques deitados, rolos de pintura, folha enrolada.
- **Exemplo:** Lata de raio 4 cm e altura 10 cm: V = π · 16 · 10 = 160π ≈ 503 cm³, cerca de 0,5 L.
- **Caderno:**
  - `V = πr² · h`
  - `área lateral: 2πr · h`
  - `área total: 2πr · h + 2πr²`
  - `1 cm³ = 1 mL`
- **Cuidado:** O raio entra ao quadrado no volume, mas não na área lateral.

### M11.3 · Pirâmides e cones
- **O que é:** Pirâmide e cone têm um terço do volume do prisma ou cilindro de mesma base e altura.
- **Como identificar:** Funil, casquinha, telhado, tenda, pirâmide do Egito, sólido de revolução.
- **Exemplo:** Cone de raio 3 cm e altura 4 cm: V = π · 9 · 4/3 = 12π cm³. Geratriz: g = √(9 + 16) = 5 cm.
- **Caderno:**
  - `V = A_base · h / 3`
  - `cone: V = πr²h/3   g² = h² + r²`
  - `cone: área lateral = πr · g`
  - `pirâmide: apótema² = h² + (apótema da base)²`
- **Cuidado:** Não esqueça o 1/3; e geratriz não é altura.

### M11.4 · Esfera
- **O que é:** A esfera de raio r tem volume 4πr³/3 e superfície 4πr². Um paralelo terrestre tem raio R · cos(latitude).
- **Como identificar:** Bolas, gotas, células esféricas, planetas, hemisfério, cúpula, latitude e longitude.
- **Exemplo:** Raio 3 cm: V = 4π · 27/3 = 36π cm³ e A = 4π · 9 = 36π cm². Raio 11 vezes maior: volume 11³ = 1 331 vezes maior.
- **Caderno:**
  - `V = 4πr³ / 3`
  - `A = 4πr²`
  - `semiesfera: V = 2πr³/3   área curva = 2πr²`
  - `paralelo de latitude φ: raio = R · cos φ`
- **Cuidado:** Volume vai com o cubo do raio; área, com o quadrado.

### M11.5 · Troncos e sólidos compostos
- **O que é:** Tronco é o que sobra ao cortar a ponta de uma pirâmide ou de um cone. Use semelhança ou a fórmula própria.
- **Como identificar:** Baldes, vasos, copos que alargam, sólidos montados, cadeia volume → massa (densidade).
- **Exemplo:** Cone de altura 12 cortado na metade da altura: o cone de cima tem (1/2)³ = 1/8 do volume. O tronco fica com 7/8.
- **Caderno:**
  - `tronco = sólido grande − sólido pequeno`
  - `razão dos volumes = k³ (k = razão das alturas)`
  - `tronco de cone: V = πh(R² + Rr + r²)/3`
  - `massa = densidade · volume`
- **Cuidado:** Cortar na metade da altura não divide o volume pela metade.

## M12 — Geometria analítica

### M12.1 · Distância e ponto médio
- **O que é:** Distância entre pontos é Pitágoras com coordenadas. Ponto médio é a média das coordenadas.
- **Como identificar:** Pares (x, y) dados, “equidistante de”, “comprimento do segmento”, centro de um diâmetro.
- **Exemplo:** A(1, 2) e B(7, 10): d = √(6² + 8²) = √100 = 10; ponto médio M = (4, 6).
- **Caderno:**
  - `d = √((x₂ − x₁)² + (y₂ − y₁)²)`
  - `M = ((x₁ + x₂)/2, (y₁ + y₂)/2)`
  - `equidistante: iguale os d² (sem raiz)`
- **Cuidado:** Subtraia x com x e y com y; nunca misture as coordenadas.

### M12.2 · Equação da reta
- **O que é:** Toda reta não vertical é y = mx + n. m é a inclinação; n é onde ela corta o eixo y.
- **Como identificar:** Dois pontos dados, gráfico de reta, “coeficiente angular”, distância de ponto a reta.
- **Exemplo:** Reta por A(1, 3) e B(3, 7): m = (7 − 3)/(3 − 1) = 2; y − 3 = 2(x − 1), logo y = 2x + 1.
- **Caderno:**
  - `m = (y₂ − y₁)/(x₂ − x₁) = tg θ`
  - `y − y₀ = m(x − x₀)`
  - `ax + by + c = 0 ⇒ m = −a/b  (b ≠ 0)`
  - `d(P, r) = |ax₀ + by₀ + c| / √(a² + b²)`
- **Cuidado:** Reta vertical, x = k, não tem coeficiente angular.

### M12.3 · Paralelas e perpendiculares
- **O que é:** Paralelas têm o mesmo coeficiente angular. Perpendiculares têm produto dos coeficientes igual a −1.
- **Como identificar:** Pede k para que duas retas sejam paralelas, perpendiculares ou concorrentes.
- **Exemplo:** r: y = 2x + 1. Paralela a r passando por (0, 5): y = 2x + 5. Qualquer perpendicular a r tem m = −1/2.
- **Caderno:**
  - `paralelas distintas: m₁ = m₂ e n₁ ≠ n₂`
  - `coincidentes: m₁ = m₂ e n₁ = n₂`
  - `perpendiculares: m₁ · m₂ = −1`
  - `concorrentes: m₁ ≠ m₂`
- **Cuidado:** Para a perpendicular, inverta e troque o sinal: de 2 vai para −1/2, não para −2.

### M12.4 · Equação da circunferência
- **O que é:** Pontos à distância r do centro (a, b): (x − a)² + (y − b)² = r².
- **Como identificar:** Equação com x² e y² de mesmo coeficiente, diâmetro dado por dois pontos, “completar quadrados”.
- **Exemplo:** x² + y² − 6x + 4y − 3 = 0 ⇒ (x − 3)² + (y + 2)² = 16. Centro (3, −2) e raio 4.
- **Caderno:**
  - `(x − a)² + (y − b)² = r²`
  - `centro: troque o sinal do número no parêntese`
  - `completar: x² − 6x = (x − 3)² − 9`
  - `diâmetro AB: centro = ponto médio de AB`
- **Cuidado:** Em (y + 2)², a ordenada do centro é −2, não +2.

### M12.4 · Reta e circunferência
- **O que é:** Compare a distância do centro à reta com o raio: menor corta, igual tangencia, maior não toca.
- **Como identificar:** Pistas: “tangente”, “secante”, “corda determinada”, número de pontos de interseção.
- **Exemplo:** Centro (0, 0), raio 5 e reta y = 3: distância 3 < 5, reta secante. A corda mede 2√(25 − 9) = 8.
- **Caderno:**
  - `d < r: secante (2 pontos)`
  - `d = r: tangente (1 ponto)`
  - `d > r: exterior (nenhum ponto)`
  - `corda = 2√(r² − d²)`
- **Cuidado:** Entre duas circunferências, compare a distância dos centros com a soma dos raios.

### M12.5 · Áreas por coordenadas
- **O que é:** Com os três vértices, a área do triângulo é metade do módulo de um determinante.
- **Como identificar:** Vértices dados por coordenadas, figura em malha quadriculada, interseção de retas formando triângulo.
- **Exemplo:** A(0, 0), B(4, 0) e C(1, 3): área = |4 · 3 − 1 · 0|/2 = 6. Confere: base 4 e altura 3.
- **Caderno:**
  - `área = |D| / 2`
  - `D = det das linhas (x₁ y₁ 1), (x₂ y₂ 1), (x₃ y₃ 1)`
  - `com A na origem: |x_B · y_C − x_C · y_B| / 2`
  - `D = 0: os três pontos estão alinhados`
- **Cuidado:** Use o módulo: o determinante pode dar negativo, a área não.

## M13 — Combinatória e probabilidade

### M13.1 · Princípio multiplicativo
- **O que é:** Se uma escolha tem m opções e outra, independente, tem n, as duas juntas têm m · n.
- **Como identificar:** Pistas: senhas, placas, códigos, cardápio, “de quantas maneiras”, etapas em sequência.
- **Exemplo:** Senha com 3 letras (26 opções) e 4 algarismos, com repetição: 26³ · 10⁴ = 175 760 000. Sem repetir algarismos: 26³ · 10 · 9 · 8 · 7.
- **Caderno:**
  - `total = n₁ · n₂ · n₃ · …`
  - `comece pela posição com restrição`
  - `“e” (etapas) multiplica · “ou” (casos) soma`
- **Cuidado:** Comece pela posição mais restrita; deixá-la para o fim distorce a contagem.

### M13.2 · Permutações e arranjos
- **O que é:** Permutação ordena todos os elementos; arranjo escolhe p entre n, e a ordem importa.
- **Como identificar:** Pistas: filas, pódio, anagramas, presidente e vice, “em ordem”, posições diferentes.
- **Exemplo:** Anagramas de AMOR: 4! = 24. Pódio com 8 atletas: A(8, 3) = 8 · 7 · 6 = 336.
- **Caderno:**
  - `Pₙ = n!`
  - `A(n, p) = n! / (n − p)!`
  - `bloco junto: conte como 1 e permute dentro`
  - `restrição de posição: fixe-a primeiro`
- **Cuidado:** Bloco que deve ficar junto: multiplique pelas permutações internas, se a ordem interna puder variar.

### M13.2 · Permutação com repetição
- **O que é:** Com elementos repetidos, divide-se n! pelo fatorial de cada repetição.
- **Como identificar:** Anagramas com letras repetidas, caminhos em grade (direita e baixo), distribuições como “exatamente 2 de cada”.
- **Exemplo:** Anagramas de BANANA: 6!/(3! · 2!) = 60. Caminhos numa grade com 4 passos para a direita e 3 para baixo: 7!/(4! · 3!) = 35.
- **Caderno:**
  - `P = n! / (a! · b! · …)`
  - `grade: (d + b)! / (d! · b!)`
- **Cuidado:** Sem dividir pelas repetições, o mesmo anagrama é contado várias vezes.

### M13.3 · Combinações
- **O que é:** Combinação escolhe p entre n sem importar a ordem: grupos, comissões, equipes.
- **Como identificar:** Pistas: “comissão”, “grupo”, “equipe”, “escolher 3 entre 10”, sorteio de vários de uma vez.
- **Exemplo:** Comissão de 3 entre 8 pessoas: C(8, 3) = 56. Se 3 delas são enfermeiros, com pelo menos 1 enfermeiro: 56 − C(5, 3) = 46.
- **Caderno:**
  - `C(n, p) = n! / (p! · (n − p)!)`
  - `C(n, p) = C(n, n − p)`
  - `“pelo menos um” = total − nenhum`
  - `C(n, 1) + … + C(n, n) = 2ⁿ − 1`
- **Cuidado:** Se trocar a ordem dos escolhidos não gera um resultado novo, é combinação.

### M13.4 · Probabilidade simples
- **O que é:** Probabilidade é casos favoráveis sobre casos possíveis, todos igualmente prováveis. Vai de 0 a 1.
- **Como identificar:** Pistas: “chance”, “sorteio”, dados, cartas, urnas, frequência relativa em tabela.
- **Exemplo:** Dois dados: soma 7 em 6 dos 36 casos, P = 1/6. Urna com 3 brancas e 2 pretas, duas retiradas sem reposição, ambas brancas: 3/5 · 2/4 = 3/10.
- **Caderno:**
  - `P(A) = favoráveis / possíveis`
  - `independentes: P(A e B) = P(A) · P(B)`
  - `sem reposição: o total cai a cada retirada`
  - `0 ≤ P ≤ 1   (0,3 = 30%)`
- **Cuidado:** Sem reposição, o denominador diminui na segunda retirada.

### M13.5 · Probabilidade condicional
- **O que é:** P(A|B) é a chance de A sabendo que B ocorreu. O espaço amostral encolhe para B.
- **Como identificar:** Pistas: “sabendo que”, “dado que”, “entre os que”, tabela de dupla entrada.
- **Exemplo:** Pesquisa com 200 pessoas: 80 fumantes, 20 deles com tosse. Sabendo que é fumante: P(tosse) = 20/80 = 1/4.
- **Caderno:**
  - `P(A|B) = P(A ∩ B) / P(B)`
  - `tabela: célula ÷ total da linha ou coluna dada`
- **Cuidado:** O denominador é o grupo da condição, não o total de pesquisados.

### M13.5 · Teste diagnóstico
- **O que é:** Sensibilidade: o teste acerta o doente. Especificidade: acerta o sadio. Valor preditivo positivo: P(doente | positivo).
- **Como identificar:** Pistas: prevalência, falso positivo, “o teste deu positivo; qual a chance de ter a doença?”, Bayes.
- **Exemplo:** Prevalência 1%, sensibilidade 90% e falso positivo em 5% dos sadios. Em 10 000 pessoas: 90 verdadeiros positivos e 495 falsos. VPP = 90/585 ≈ 15,4%.
- **Caderno:**
  - `sensibilidade = P(+ | doente)`
  - `especificidade = P(− | sadio)`
  - `VPP = VP / (VP + FP)`
  - `imagine 10 000 pessoas e monte a tabela`
- **Cuidado:** Com prevalência baixa, a maioria dos positivos é falso positivo, mesmo com teste bom.

### M13.6 · União e intersecção
- **O que é:** P(A ∪ B) = P(A) + P(B) − P(A ∩ B): a intersecção foi contada duas vezes e sai uma.
- **Como identificar:** Pistas: “ou”, diagrama de Venn, “pelo menos um dos dois”, pesquisa com duas preferências.
- **Exemplo:** 100 alunos: 60 leem jornal, 50 leem revista, 20 leem os dois. Leem algum: 60 + 50 − 20 = 90; nenhum: 10.
- **Caderno:**
  - `n(A ∪ B) = n(A) + n(B) − n(A ∩ B)`
  - `“e” = ∩   “ou” = ∪   “não” = complementar`
  - `independentes: P(A ∩ B) = P(A) · P(B)`
- **Cuidado:** Quem não está em nenhum conjunto fica fora do diagrama; tire esse grupo antes.

### M13.6 · Evento complementar
- **O que é:** P(não A) = 1 − P(A). “Pelo menos um” quase sempre se resolve pelo complementar.
- **Como identificar:** Pistas: “pelo menos um”, “ao menos uma vez”, “no mínimo um”, vários eventos independentes.
- **Exemplo:** Três exames independentes, cada um com 10% de chance de falso positivo: P(pelo menos um falso) = 1 − 0,9³ = 0,271, ou 27,1%.
- **Caderno:**
  - `P(Ā) = 1 − P(A)`
  - `P(pelo menos um) = 1 − P(nenhum)`
  - `independentes: P(nenhum) = produto das chances de não`
- **Cuidado:** Não some as chances de cada evento: 3 · 10% = 30% está errado.

### M13.9 · Casa dos pombos
- **O que é:** Com n gavetas e n + 1 objetos, alguma gaveta recebe pelo menos dois. Serve para garantir um resultado.
- **Como identificar:** Pistas: “garantir”, “com certeza”, “número mínimo para ter certeza”, pior caso.
- **Exemplo:** Gaveta escura com meias de 4 cores: para garantir duas da mesma cor, tire 4 + 1 = 5 meias.
- **Caderno:**
  - `n gavetas e n + 1 objetos ⇒ uma gaveta com 2`
  - `garantir k iguais: n(k − 1) + 1`
  - `pense no pior caso possível`
- **Cuidado:** “Garantir” pede o pior caso, não o caso mais provável.

## M14 — Estatística

### M14.1 · Média aritmética
- **O que é:** Média é a soma dos valores dividida pela quantidade. Somar k a todos os valores soma k à média.
- **Como identificar:** Pistas: “média”, valor que saiu ou entrou no grupo, nota que falta para a aprovação.
- **Exemplo:** 5 notas com média 7 somam 35. Com a 6.ª nota, a média vai a 7,5: a soma passa a 45, então a nova nota é 10.
- **Caderno:**
  - `x̄ = Σx / n`
  - `soma = média · n`
  - `+k em todos: média + k`
  - `×k em todos: média × k`
- **Cuidado:** Para incluir ou excluir valores, trabalhe com a soma, não com a média.

### M14.1 · Mediana e moda
- **O que é:** Mediana é o valor central dos dados em ordem. Moda é o valor que mais aparece.
- **Como identificar:** Pistas: “mediana”, “moda”, tabela de frequências, valor extremo que distorce a média.
- **Exemplo:** Dados 3, 9, 4, 7, 4, 10. Em ordem: 3, 4, 4, 7, 9, 10. Mediana = (4 + 7)/2 = 5,5; moda = 4.
- **Caderno:**
  - `ordene os dados antes`
  - `n ímpar: termo na posição (n + 1)/2`
  - `n par: média dos termos n/2 e n/2 + 1`
  - `moda: maior frequência (pode haver mais de uma)`
- **Cuidado:** Não calcule a mediana sem ordenar os dados.

### M14.2 · Tabelas e gráficos
- **O que é:** Leia eixo, unidade e escala antes de calcular. Muitas questões são porcentagem disfarçada.
- **Como identificar:** Gráficos de barras, setores e linhas, tabelas com totais, “qual afirmação é correta”.
- **Exemplo:** Setor de 25% num gráfico de pizza: 0,25 · 360° = 90°. Barras de 40 e 50 milhões: aumento de 10 milhões, ou 25%.
- **Caderno:**
  - `setor: ângulo = fração · 360°`
  - `variação absoluta = novo − antigo`
  - `variação relativa = (novo − antigo)/antigo`
  - `confira a unidade do eixo (mil, milhões, %)`
- **Cuidado:** Diferença absoluta (em milhões) e variação percentual são coisas diferentes.

### M14.3 · Desvio padrão
- **O que é:** O desvio padrão mede o quanto os dados se espalham em torno da média. Menor desvio, grupo mais homogêneo.
- **Como identificar:** Pistas: “mais regular”, “mais homogêneo”, “mais constante”, desempate entre médias iguais.
- **Exemplo:** Notas 6, 8 e 10: média 8; variância (4 + 0 + 4)/3 = 8/3; desvio padrão √(8/3) ≈ 1,63.
- **Caderno:**
  - `variância: σ² = Σ(x − x̄)² / n`
  - `desvio padrão: σ = √σ²`
  - `amplitude = maior − menor`
  - `menor σ ⇒ dados mais regulares`
- **Cuidado:** Média igual não quer dizer desempenho igual: compare o desvio padrão.

### M14.4 · Média ponderada
- **O que é:** Cada valor conta conforme seu peso: soma de valor × peso dividida pela soma dos pesos.
- **Como identificar:** Pistas: “peso”, provas com pesos, PIB per capita de uma região, média de turmas de tamanhos diferentes.
- **Exemplo:** Nota 6 com peso 2 e nota 8 com peso 3: média = (6 · 2 + 8 · 3)/(2 + 3) = 36/5 = 7,2.
- **Caderno:**
  - `x̄ = Σ(xᵢ · pᵢ) / Σpᵢ`
  - `grupos de tamanhos diferentes: o peso é o tamanho`
- **Cuidado:** Média de médias de grupos de tamanhos diferentes exige ponderar pelo tamanho.

### M14.5 · Dados em saúde
- **O que é:** Taxas de saúde são razões com base fixa: casos por 100 mil habitantes, por mil nascidos vivos, ou porcentagem.
- **Como identificar:** Pistas: incidência, mortalidade, vacinas aplicadas por mês, casos por região, média para dimensionar estoque.
- **Exemplo:** Cidade de 250 000 habitantes com 75 casos: 75 ÷ 250 000 · 100 000 = 30 casos por 100 mil habitantes.
- **Caderno:**
  - `taxa = casos / população × base`
  - `base usual: 1 000 ou 100 000`
  - `média mensal = total / número de meses`
- **Cuidado:** Compare taxas, não números absolutos: cidades maiores têm mais casos.

## M15 — Matrizes e determinantes

### M15.1 · Operações com matrizes
- **O que é:** Matriz é uma tabela m × n. Soma-se elemento a elemento; multiplica-se linha da primeira por coluna da segunda.
- **Como identificar:** Lei de formação aᵢⱼ, tabela de produção, transformação de pontos, pixels, produto de matrizes.
- **Exemplo:** [1 2; 3 4] · [5; 6] = [1 · 5 + 2 · 6; 3 · 5 + 4 · 6] = [17; 39].
- **Caderno:**
  - `aᵢⱼ: i = linha, j = coluna`
  - `A(m×n) · B(n×p) = C(m×p)`
  - `cᵢⱼ = linha i de A · coluna j de B`
  - `transposta: linhas viram colunas`
- **Cuidado:** A · B em geral é diferente de B · A, e o produto não é elemento a elemento.

### M15.2 · Determinantes
- **O que é:** Determinante é um número associado a uma matriz quadrada. Se det = 0, a matriz não tem inversa.
- **Como identificar:** Pede det, ou “para que x o determinante vale 0”, ou área por coordenadas.
- **Exemplo:** |2 3; 1 4| = 2 · 4 − 3 · 1 = 5. E |x 2; 3 x| = 10 ⇒ x² − 6 = 10 ⇒ x = 4 ou x = −4.
- **Caderno:**
  - `2×2: det = ad − bc`
  - `3×3: Sarrus (diagonais ↘ menos diagonais ↙)`
  - `det(A · B) = det A · det B`
  - `det(k · A) = kⁿ · det A  (A de ordem n)`
- **Cuidado:** Em Sarrus, os produtos das diagonais secundárias entram com sinal trocado.

### M15.3 · Determinante e sistemas
- **O que é:** O determinante dos coeficientes decide se o sistema tem solução única. Homogêneo tem outras soluções só se det = 0.
- **Como identificar:** Pistas: “sistema homogêneo”, “solução não trivial”, “para que valores de k”, regra de Cramer.
- **Exemplo:** kx + y = 0 e 4x + ky = 0: det = k² − 4. Há soluções além de (0, 0) se k = 2 ou k = −2.
- **Caderno:**
  - `det ≠ 0: solução única (SPD)`
  - `homogêneo: (0, 0, …) é sempre solução`
  - `homogêneo com det = 0: infinitas soluções`
  - `Cramer: x = Dₓ / D`
- **Cuidado:** Sistema homogêneo nunca é impossível: (0, 0) sempre é solução.

## M16 — Polinômios e complexos

### M16.1 · Teorema do resto
- **O que é:** O resto da divisão de P(x) por (x − a) é P(a). Se P(a) = 0, a é raiz de P.
- **Como identificar:** Pistas: “resto da divisão por x − 2”, “é divisível por”, “a é raiz”, achar coeficientes.
- **Exemplo:** P(x) = x³ − 2x + 5 dividido por x − 2: resto P(2) = 8 − 4 + 5 = 9. Por x + 1: resto P(−1) = −1 + 2 + 5 = 6.
- **Caderno:**
  - `resto de P(x) ÷ (x − a) = P(a)`
  - `divisível por (x − a) ⇔ P(a) = 0`
  - `÷ (x + 3): calcule P(−3)`
  - `Briot-Ruffini divide rápido`
- **Cuidado:** Divisão por x + 3 usa P(−3), não P(3).

### M16.1 · Relações de Girard
- **O que é:** As relações de Girard dão soma e produto das raízes sem resolver a equação.
- **Como identificar:** Pede soma, produto ou soma dos inversos das raízes de equação de grau 3 ou maior.
- **Exemplo:** x³ − 6x² + 11x − 6 = 0: soma 6, soma dois a dois 11, produto 6. As raízes são 1, 2 e 3.
- **Caderno:**
  - `ax³ + bx² + cx + d = 0`
  - `x₁ + x₂ + x₃ = −b/a`
  - `x₁x₂ + x₁x₃ + x₂x₃ = c/a`
  - `x₁ · x₂ · x₃ = −d/a`
- **Cuidado:** Os sinais alternam: no grau 3, soma é −b/a e produto é −d/a.

### M16.2 · Números complexos
- **O que é:** z = a + bi, com i² = −1. Para dividir, multiplique em cima e embaixo pelo conjugado do denominador.
- **Como identificar:** Aparece i, “forma algébrica”, conjugado z̄, módulo |z|, divisão de complexos.
- **Exemplo:** (2 + i)/(1 − i) = (2 + i)(1 + i)/2 = (1 + 3i)/2 = 1/2 + (3/2)i. E |3 + 4i| = √(9 + 16) = 5.
- **Caderno:**
  - `i² = −1   i³ = −i   i⁴ = 1`
  - `conjugado de a + bi: a − bi`
  - `z · z̄ = a² + b²`
  - `|z| = √(a² + b²)`
- **Cuidado:** i² vale −1; esquecer isso troca o sinal da parte real.

### M16.2 · Raízes complexas conjugadas
- **O que é:** Se um polinômio de coeficientes reais tem raiz a + bi, também tem a raiz a − bi.
- **Como identificar:** Polinômio com uma raiz complexa dada e pedido das outras raízes.
- **Exemplo:** x³ − x² + x − 1 = 0 tem raiz i; logo −i também é raiz. A soma das raízes é 1, então a terceira raiz é 1.
- **Caderno:**
  - `raiz a + bi ⇒ raiz a − bi (coeficientes reais)`
  - `grau ímpar: pelo menos uma raiz real`
  - `use Girard para achar a raiz que falta`
- **Cuidado:** A regra do conjugado só vale se os coeficientes forem reais.

## M17 — Lógica e algoritmos

### M17.1 · Proposições e conectivos
- **O que é:** Proposição é frase declarativa que é verdadeira ou falsa. “E” exige as duas verdadeiras; “ou” basta uma.
- **Como identificar:** Pede valor lógico, “é proposição?”, tabela-verdade, frases com “se… então”.
- **Exemplo:** “2 + 2 = 5” é proposição falsa. “Feche a porta!” não é proposição. “Se chove, então molha” só é falsa quando chove e não molha.
- **Caderno:**
  - `p ∧ q: V só se ambas forem V`
  - `p ∨ q: F só se ambas forem F`
  - `p → q: F só se p for V e q for F`
  - `p → q ≡ ¬q → ¬p (contrapositiva)`
- **Cuidado:** Pergunta, ordem e exclamação não são proposições.

### M17.1 · Negações
- **O que é:** Negar inverte o valor lógico. Pelas leis de De Morgan, “e” vira “ou” e “ou” vira “e”.
- **Como identificar:** Pede “a negação de”, “equivale a”, ou frases com “todo”, “nenhum”, “algum”.
- **Exemplo:** Negação de “Todo médico é calmo”: “Algum médico não é calmo”. Negação de “Estudo e passo”: “Não estudo ou não passo”.
- **Caderno:**
  - `¬(p ∧ q) ≡ ¬p ∨ ¬q`
  - `¬(p ∨ q) ≡ ¬p ∧ ¬q`
  - `¬(p → q) ≡ p ∧ ¬q`
  - `¬(todo A é B) ≡ algum A não é B`
- **Cuidado:** A negação de “todo médico é calmo” não é “nenhum médico é calmo”.

### M17.1 · Dedução
- **O que é:** Das premissas aceitas como verdadeiras, conclui-se só o que decorre delas necessariamente.
- **Como identificar:** Pistas: “logo”, “conclui-se que”, restrições de ordem (quem vem antes de quem), quadros de lógica.
- **Exemplo:** Todo A é B, e x não é B. Logo, x não é A. Mas de “x é B” não se conclui que x é A.
- **Caderno:**
  - `“todo A é B” = “se A, então B”`
  - `monte uma tabela com as possibilidades`
  - `elimine o que contradiz alguma pista`
- **Cuidado:** Não conclua a recíproca: “se A, então B” não garante “se B, então A”.

### M17.2 · Bases e algoritmos
- **O que é:** Um número na base b é soma de potências de b. Algoritmo se resolve executando passo a passo.
- **Como identificar:** Pistas: binário, base 2 ou base 7, fluxograma, “repita até”, tabela de variáveis.
- **Exemplo:** (1011)₂ = 8 + 0 + 2 + 1 = 11. 13 em binário: dividindo por 2, os restos são 1, 0, 1, 1; lidos de trás para a frente, 1101.
- **Caderno:**
  - `(d₂d₁d₀)_b = d₂ · b² + d₁ · b + d₀`
  - `base 10 → b: divida por b e leia os restos ao contrário`
  - `algoritmo: anote cada variável a cada passo`
- **Cuidado:** Leia os restos do último para o primeiro.

## Fontes

- Contas: verificação simbólica e numérica em SymPy 1.14 (todas as igualdades dos exemplos).
- Ordem de grandeza (critério √10 ≈ 3,16): [Toda Matéria — Ordem de grandeza](https://www.todamateria.com.br/ordem-de-grandeza/); [Só Matemática](https://www.somatematica.com.br/fundam/notacao4.php).
- Fórmulas de geometria, trigonometria, logaritmos, combinatória e estatística: conteúdo padrão do ensino médio (BNCC); cada fórmula usada em exemplo foi checada em sympy.
- Convenção ℕ = {0, 1, 2, …}: BNCC e livros didáticos brasileiros.
- Desvio padrão com divisão por n (populacional), como no ensino médio e nas provas Enem/Vunesp.
