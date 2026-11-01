# Revisão independente: Treino geral de Matemática (ESSENCIAL_mat)

29/10/2026 · segunda lente sobre `ESSENCIAL_mat.json`. `dados.json` e `index.html` não foram tocados. Cópia do arquivo antes da revisão: `/tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/ESSENCIAL_mat.antes.json`.

## Método

- **ABC:** li o enunciado e as alternativas das 40 questões e refiz cada conta à mão, sem olhar a coluna "conta" do primeiro analista. Nas questões que dependem de figura, abri o print da prova (`/home/claude/forma/prints/mat/` e o pacote do primeiro analista) e li os dados: ccb2d05f (tanque 2 × 2 × 1 m), f4f9c01e (gráfico de expectativa de vida), 8ab917de (18,2 em 1976 e 30,5 em 2005), 356c6c26 (azul = círculo menos o quadrado inscrito; amarelo = quadrado menos o círculo) e P26ce383 (ordem dos vértices P'Q'R'S').
- **Completar:** comparei cada frase com o cartão citado (`D['teoria'][mod]['cartoes']`, mesmo sub), conferi se a matemática está certa, tentei achar outro termo que também completasse a lacuna e revisei a lista "aceita". Também comparei com os 50 flashcards para ver se havia repetição literal. Não houve.

## Mudanças (antes → depois, motivo)

**ABC:** nenhuma troca. As 40 tiveram o gabarito confirmado.

**Completar:**

| id | antes | depois | motivo |
|---|---|---|---|
| mat-c003 | "Com elementos repetidos, divide-se n! pelo ___ de cada repetição." | "Na permutação com elementos repetidos, divide-se n! pelo ___ de cada repetição." | Sozinha, a frase não dizia de que assunto falava. O título do cartão ("Permutação com repetição") dá o contexto, sem informação nova. |
| mat-c002 | aceita: falsos positivos, falso-positivo, falsos-positivos | + "falsos", "falso" | O aluno pode escrever só "falsos"; é a mesma ideia, correta. |
| mat-c004 | aceita: restritiva, com restrição | + "limitada" | Sinônimo real de "posição mais restrita". |
| mat-c006 | aceita: delta, discriminante, b² − 4ac | + "b^2 - 4ac", "b2 - 4ac" | Formas comuns de digitar no celular. |
| mat-c015 | aceita: tamanho dos grupos, tamanho de cada grupo, número de elementos | + "tamanho do grupo", "quantidade de elementos" | Sinônimos reais. |
| mat-c019 | aceita: cosseno de x, cos(x), cosx | + "cosseno" | Forma por extenso sem o "x". |
| mat-c020 | aceita: maior que zero, maior que 0, > 0 | + "real positivo" | Resposta correta e mais completa. |
| mat-c027 | aceita: n-1, n menos 1, n menos um | + "n - 1" | Hífen com espaços (o "resp" usa o sinal de menos unicode). |
| mat-c028 | aceita: \|q\|<1, −1 < q < 1, -1<q<1, módulo de q menor que 1 | + "q entre −1 e 1", "módulo da razão menor que 1" | Formas verbais equivalentes. |
| mat-c031 | aceita: tangente, é tangente, tangência | + "toca em um ponto" | É a definição de tangente, sem ambiguidade. |
| mat-c033 | aceita: (vazio) | + "expoentes de 10" | Variação natural da resposta. |

## O que conferi e não mudei

**ABC: os 40 gabaritos, um por um (contas refeitas):**
8f3937a7 D (3 · 4 · 3 · 4! = 864) · c6944ef3 B (10!/2⁵ = 113 400) · 755b27c3 D (495 − 70) · 9a79ecbf D (3/7 · 4/8 ≈ 21,4%) · e7cbdda3 E (0,018/0,0474 ≈ 38%) · 3b95e1c3 D (a = 18, b = 12) · f283ad93 C (17,40) · 4155b637 E (22 e 58 → 44 e 116 na faixa 101–200 → 3 780) · f0c51255 A (lados 12 e 16 → r = 6) · 55040d62 B (8/16) · ccb2d05f C (800 L de 4 000 L) · dea8a503 C (624 − 84) · P37188ab B (x³ = 48) · Pa1aab41 D (18 + 18 + 18 → 16) · 58d325ba C (faltam 383 = 185 + 198, único par) · f4f9c01e B (AL ≈ 9,5 e BA ≈ 9,2 anos; as alternativas A, C, D e E são falsas no gráfico) · 70cc1a1b C (12 + 2 = 14 m → 7 s) · 63d469d5 C (sen 2α = 0,96 → 9,6 m) · E9ee4fbd C (0,72π ≈ 2,26 m) · 7f7a4b26 A (log 3,25 ≈ 0,51) · E180927e E (−17,602) · db122a84 B (6,25 + 50 + 400) · Ecacd283 E (630 · 5/7) · 9682e0ac D (6 + 9,5 h) · 02199bcc A (1 113/732 ≈ 1,52) · 50e72dfc C (46,6/1,465) · c59190e5 A (n − 1 = 35 → R = 4, único) · 06380462 B (66) · P09ac4ef C (25 000 km) · 356c6c26 E (8π − 24; a ordem inversa, 24 − 8π, não está entre as alternativas) · P26ce383 C (área 23 pelo determinante, a reflexão preserva a área) · Pc458dc9 E (d = 2√2 > 2) · eafcd1cf B (60 = 7 · 8 + 4 → quarta) · E5938146 D (3,018 · 10⁻¹³ g) · E6b68c42 B (5 − 4,25 = 0,75 mi) · 8ab917de C (≈ 36,0) · 7982b007 B (De Morgan) · E774f0c7 B (363 = (1403)₆) · 1ea698c6 E (QR² = 12 · 16/3) · bc294c0c B ((−y, x): rotação de 90° no sentido anti-horário).

**ABC, centralidade e repetição:** as questões cobrem 16 módulos na proporção da incidência. Os pares do mesmo conteúdo cobram ideias diferentes: 3b95e1c3 monta e resolve o sistema e f283ad93 usa o atalho de subtrair as equações; 70cc1a1b usa a tangente e 63d469d5 o arco duplo; 7f7a4b26 é log do quociente lido no gráfico e E180927e decompõe 2,5 = 10/4. Nenhuma é nicho para o peso do seu tema. A f4f9c01e exige ler o gráfico com cuidado, mas a resposta B é estável: os quatro estados com as maiores diferenças (AL, BA, SE e PI) são todos do Nordeste.

**Completar:** os outros 29 itens estão fiéis ao cartão, corretos e com uma única resposta possível. Casos em que testei respostas concorrentes:
- c013: "área total" e "da base" não servem, porque nelas o raio entra ao quadrado.
- c007: o método da comparação não "troca na outra".
- c016: "absoluta" já foi usada na frase.
- c021: sem base escrita, o log é de base 10, então a resposta é "log b".
- c038: a "inversa" seria "se não A, então não B", que é outra coisa.

**Observação para quem construir o corretor:** a função `norm` do app (mat/app.js:3044) apaga tudo o que não é letra ou número. Com ela, "Δ" vira vazio e "√3" vira "3". As respostas com símbolo (c006 Δ, c011 a√3, c017 √3, c028 |q| < 1, c005 A ∩ B) dependem da lista "aceita" (delta, raiz de 3 etc.), que já está preenchida.

## Validação final (Python)
40 ids ABC existentes e únicos no banco, todos com gabarito e degrau > 0. 40 itens de completar com ids únicos e exatamente um "___" por frase. mod e sub existem em `teoria` e `nomesub`, e cada sub tem cartão.
