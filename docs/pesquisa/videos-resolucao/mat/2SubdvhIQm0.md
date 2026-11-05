<!-- fonte: https://www.youtube.com/watch?v=2SubdvhIQm0 | modelo: gemini-3.5-flash-lite | analisado em 2026-11-05 -->
# Geometric Progression 

- Canal: NA
- Link: https://www.youtube.com/watch?v=2SubdvhIQm0
- Duração: 10 min

Aqui está a descrição detalhada da resolução, baseada estritamente no vídeo:

## Questão(ões)
- **Prova/Ano/Número:** Não informado no vídeo.
- **Assunto/Subtema:** Progressões e Geometria Plana / Progressão Geométrica (PG) finita e infinita, área de triângulo equilátero.
- **Resumo:** Há duas questões resolvidas no vídeo. A primeira envolve o crescimento do número de inscritos em um canal do YouTube em progressão geométrica. A segunda envolve a soma das áreas de infinitos triângulos equiláteros formados pela união dos pontos médios de um triângulo inicial.

---

## Passo a passo da resolução

### Questão 1 (Inscritos no YouTube)
1. **[00:55]** O professor identifica a sequência de inscritos por vídeo: 1º vídeo = 5, 2º = 10, 3º = 20, 4º = 40, até o 10º vídeo ($a_{10}$).
2. **[01:21]** Identifica que a sequência é uma Progressão Geométrica (PG) finita com razão $q = 10/5 = 2$.
3. **[02:10]** Escreve a fórmula da soma da PG finita: $S_n = \frac{a_1 \cdot (q^n - 1)}{q - 1}$.
4. **[02:32]** Substitui os valores na fórmula: $a_1 = 5$, $q = 2$, $n = 10$.
5. **[03:20]** Calcula $2^{10} = 1024$.
6. **[03:24]** Efetua a operação: $5 \cdot \frac{1024 - 1}{2 - 1} = 5 \cdot 1023$.
7. **[03:37]** Faz a multiplicação $5 \cdot 1023 = 5115$.
8. **[04:02]** Marca a alternativa correta (letra C).

### Questão 2 (Triângulos e Áreas)
1. **[05:00]** Analisa o triângulo equilátero maior de lado 16 e identifica que unir os pontos médios gera um novo triângulo equilátero com metade do lado (8), e assim sucessivamente, formando infinitos triângulos.
2. **[06:10]** Calcula a área do triângulo equilátero maior ($ABC$) usando a fórmula $A = \frac{L^2\sqrt{3}}{4}$: $A_{ABC} = \frac{16^2\sqrt{3}}{4} = 64\sqrt{3}\text{ cm}^2$.
3. **[06:40]** Calcula a área do segundo triângulo ($EFD$) com lado 8: $A_{EFD} = \frac{8^2\sqrt{3}}{4} = 16\sqrt{3}\text{ cm}^2$.
4. **[07:10]** Calcula a área do terceiro triângulo com lado 4: $A_{GHI} = \frac{4^2\sqrt{3}}{4} = 4\sqrt{3}\text{ cm}^2$.
5. **[08:30]** Organiza a sequência das áreas: $(64\sqrt{3}, 16\sqrt{3}, 4\sqrt{3}, \dots)$, identificando que é uma PG infinita com razão $q = \frac{16\sqrt{3}}{64\sqrt{3}} = \frac{1}{4}$.
6. **[09:14]** Escreve a fórmula da soma da PG infinita: $S = \frac{a_1}{1 - q}$.
7. **[09:24]** Substitui os valores: $S = \frac{64\sqrt{3}}{1 - 1/4}$.
8. **[09:34]** Resolve o denominador ($1 - 1/4 = 3/4$) e faz a divisão de frações multiplicando pelo inverso: $64\sqrt{3} \cdot \frac{4}{3} = \frac{256\sqrt{3}}{3}\text{ cm}^2$.

---

## Leitura do enunciado
- **Questão 1:** Destaca termos como "primeiro vídeo obteve apenas 5 inscritos", "a cada novo vídeo, dobrar a quantidade de inscritos", "se no 1º mês ele postar 10 vídeos". Descarta o contexto narrativo e foca nos números-chave.
- **Questão 2:** Lê o enunciado resumidamente contando a história: "tem um triângulo equilátero de lado 16... unindo-se os pontos médios obtém-se um novo triângulo... e assim sucessivamente". Identifica que pede a soma das áreas de todos os triângulos formados (tendendo ao infinito).

---

## Organização dos dados e notação
- Anota os termos da PG em parênteses separados por ponto e vírgula: $(5; 10; 20; 40; \dots; a_{10})$.
- Utiliza letras como $q$ para razão, $a_1$ para primeiro termo, $n$ para número de termos, e $S$ para soma.
- Na segunda questão, faz um esquema visual no quadro com um triângulo equilátero grande, subdividido por linhas internas conectando os pontos médios, indicando as medidas dos lados (16, 8, 4) e ângulos de $60^\circ$.

---

## Teoria mobilizada
- **Progressão Geométrica (PG):** Conceito de razão, termos gerais, soma de PG finita e soma de PG infinita.
- **Geometria Plana:** Fórmula da área do triângulo equilátero ($A = \frac{L^2\sqrt{3}}{4}$) e propriedades dos pontos médios de um triângulo.
- O tempo gasto revisando a teoria é intercalado durante a resolução (fórmulas escritas no quadro à medida que são necessárias).

---

## Alternativas
- **Questão 1:** Apresenta 5 alternativas (a) 1024, b) 5120, c) 5115, d) 1023, e) 310). O professor calcula o valor exato (5115) e marca a letra C, sem analisar individualmente o erro dos distratores.

---

## Conferência
- **Questão 1:** Confere mentalmente potências de 2 ($2^1 = 2$ até $2^{10} = 1024$) e refaz a multiplicação final ($5000 + 115 = 5115$).
- **Questão 2:** Confere a razão da PG dividindo o segundo termo pelo primeiro e refaz o MMC e a divisão de frações no cálculo da soma infinita.

---

## Dicas, atalhos e pegadinhas
- "Você lê e não sabe se é PA ou PG... mas é contextualizada, a gente começa a leitura e observa."
- "Quando tende ao infinito, caracteriza o quê? Uma soma de PG infinita."
- Alerta sobre potências de base 2 importantes: "2 elevado a 10 é um valor que você faz nas mãos... 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024."

---

## Estilo didático
- **Ritmo e linguagem:** Dinâmico, informal, motivador ("E aí, friends!", "Curió quer se tornar um youtuber famoso...").
- **Interação:** Conversa com o aluno simulando dúvidas ("Sandro, e daí?", "Cadê o 10?").
- **Nível de detalhe:** Alto. Explica cada passagem algébrica (MMC, divisão de frações, fatoração, simplificações), tornando a aula acessível mesmo para quem tem dificuldades básicas.
