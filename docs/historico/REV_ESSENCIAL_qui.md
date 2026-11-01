# Revisão independente: Treino geral de Química (29/10/2026)

Arquivo revisado e corrigido: `ESSENCIAL_qui.json`. Continua com 40 ABC e 40 frases de completar. Não mexi em dados.json nem em index.html.

## Como conferi
- **ABC:** li o enunciado e as alternativas das 40 questões e resolvi cada uma de novo, sem olhar a conta do primeiro analista.
  - Nas questões com figura, extraí o print que o próprio app mostra (`qui/res/<sub>.json`, campo `img`) e conferi o gabarito contra a figura.
  - Prints conferidos: Pc5a19d7, P967a049, P4b8697a, Pf7012c2, P5a53055, P4ec3c8a, P641df45, P5079713, Pf41093f, P2e8e8c0, P382532c, P90f9f67, P0dfb369 e P4efb9f8 (a questão nova).
  - Assim, nenhuma questão depende de figura que o aluno não vê.
- **Completar:** comparei cada frase com o cartão citado em `fonte`. Testei se outro termo também completaria a lacuna. Cruzei a resposta com os 50 flashcards do mesmo sub.
- **Validação (Python):**
  - 40 ids existem no banco e não se repetem, todos com gabarito e degrau > 0;
  - 40 frases têm exatamente um "___";
  - mod, sub e título do cartão existem;
  - a distribuição por módulo ficou igual à original.

## Mudanças

### ABC (1 troca)
| antes | depois | motivo |
|---|---|---|
| Pf8747c6 (Santa Casa 2018, hidreto de maior ebulição = NH₃, Q02.4) | **P4efb9f8** (Unesp 2024, Q02.1, dif 4, gab C) | A questão antiga repetia a ideia da Pc5a19d7: as duas cobram a ligação de hidrogênio, que exige H em N, O ou F. Além disso, a ligação iônica (Q02.1) não tinha nenhuma questão. Na nova, X (2-8-8-1) é o K e Y (2-6) é o O, então a ligação é iônica e a fórmula é X₂Y. Gabarito conferido no print. |

### Completar (frases reescritas)
| id | antes | depois | motivo |
|---|---|---|---|
| c008 | "Dupla troca ocorre quando forma precipitado, gás ou ___." → água | "Dupla troca ocorre quando forma ___, gás ou água." → **precipitado** (aceita: sólido insolúvel, substância insolúvel, composto insolúvel) | "Eletrólito fraco" ou "substância pouco ionizada" também completariam a frase antiga de forma correta. Na lacuna nova só cabe precipitado, que é o termo-chave. |
| c019 | "No diagrama de energia, o desnível entre as pontas é o ΔH, e o pico é o ___." → complexo ativado | "No diagrama de energia, o catalisador deixa o pico mais baixo, mas mantém o mesmo ___." → **ΔH** (aceita: delta H, DH, variação de entalpia, entalpia de reação/da reação) | O flashcard qui-f073 já diz que o pico é o complexo ativado. A frase nova vem do caderno do mesmo cartão ("catalisador: pico mais baixo, mesmo ΔH"). |
| c025 | "Diluir um ácido fraco aumenta o grau de ionização α, mas não muda o valor de ___." → Ka | "Diluir um ácido fraco aumenta o seu ___ (α), mas o Ka continua o mesmo." → **grau de ionização** (aceita: α, alfa, grau de dissociação) | "pKa" também completaria a frase antiga de forma correta e não estava aceito. A lacuna nova é o próprio conceito do cartão. |

### Completar (ajustes em "aceita" e "fonte", sem mudar a frase)
- **c010 (mol):** + "número de mols".
- **c017 (273):** + "273.15", para quem digita com ponto decimal.
- **c030 (atômicos):** + "de prótons", sinônimo verdadeiro.
- **c036 (cadeia):** + "núcleo". Muitos livros chamam aberta × fechada de isomeria de núcleo, um subtipo da de cadeia.
- **c039 (cloroeteno):**
  - aceita: + "cloreto de vinil" e "cloroetileno";
  - fonte: "exemplo + caderno", porque o nome cloroeteno está no caderno do cartão e não no exemplo.
- **c040 (glicerol):** + "propanotriol".
- **c012 (74):** fonte corrigida para "cuidado + caderno". A conta 40 + 2 × (16 + 1) = 74 está no caderno do cartão, não no cuidado.

## Conferido sem mudança

### ABC (39 mantidas, todas com gabarito correto)
- **Q01:**
  - Pa0c25dd C: 85 − 83 = 2 nêutrons; o Nd³⁺ tem 57 e⁻; o óxido é Nd₂O₃.
  - P0d022d4 B: o Na⁺ é mais pesado e maior, então cabem menos íons.
- **Q02:**
  - P4005266 B: CO₂ e CCl₄.
  - Pc5a19d7 A: o 2-propanol (3) é doador e o nitrometano (2) é receptor. Conferido no print.
- **Q03:**
  - Pf8f018d B: x = 3 e y = 7, soma 10; o dicromato é laranja.
  - P79ad435 B: +4 e +4.
  - P79ae436 A: soma dos coeficientes 1 + 3 + 1 + 3 = 8.
- **Q04:**
  - P5a53055 C: 21 C contados no print, e o cálculo dá ≈ 1,6 × 10²¹.
  - P46d60c8 A: C₁₀H₁₆O.
  - Pa5f2c2b C: 10⁴ mol.
  - P591931f D: o H₂S é o limitante, e formam-se 2 mol.
- **Q05:**
  - P8ca9a74 A: 8,5 × 10⁻⁴ mol/L.
  - P6364cfb D: 2 × 10⁻³ L.
  - P967a049 B: 30 g/100 g a 50 °C, conferido no gráfico.
- **Q06:**
  - P941ccd1 A: 1 200 mol a 530 K dão ≈ 51 atm.
  - Pafed037 E: M ≈ 44 g/mol, é o CO₂.
- **Q07:**
  - P7ac905b A: −802,3 kJ.
  - P3837fa0 E: −520 kJ, exotérmica.
  - P4b8697a A: −10 − 20 = −30 kJ, conferido no gráfico.
- **Q08:**
  - P48783a7 D: pH 5, ácida.
  - Pfbabaa0 A: NaCl e acetato de amônio (Ka = Kb).
  - P70d720f D: resfriar e comprimir aumentam o CO₂.
  - P9579aee E: pH 5 < 11 > 9.
  - P8083be1 A: primeira ordem em cada reagente.
  - Pa2c8972 D: o catalisador não é consumido.
- **Q09:**
  - P6b8f55a C: Mn é o ânodo; ddp 0,95 V.
  - Pc6e102f E: O₂ no ânodo; 1,23 V.
  - P90f9f67 E: 960 C depositam ≈ 0,32 g de Cu (CuSO₄ no print).
  - Pd3d723d C: elétron, partícula α e pósitron.
  - Pf7012c2 C: t½ = 80 h no gráfico; 3 meias-vidas = 240 h = 10 dias.
- **Q10:**
  - P498924c A: partículas 2,0 > 1,8 > 1,6 > 1,5 > 0,9.
- **Q11:**
  - Pf41093f C: 2 carbonos quirais e 4 isômeros (print).
  - P4ec3c8a A: álcool secundário, cadeia insaturada e homogênea (print).
  - P2e8e8c0 B: éter e fenol (print).
  - P5079713 B: éster, amina e amida (print).
- **Q12:**
  - P641df45 E: o metanoato de isobutila vem de ácido metanoico e isobutanol (print).
  - P382532c C: aldeído; o Cu²⁺ sofre redução.
  - Pcd2f026 A: condensação, amida, proteínas.
  - P0dfb369 E: Y, insaturados, HDL.
- **Repetição de ideia:** fora a troca acima, não achei duas questões cobrando a mesma ideia. As duas de pH (P48783a7 e Pfbabaa0) cobram coisas diferentes: [OH⁻] → pH e hidrólise de sais.

### Completar (37 frases mantidas como estavam, com ou sem ajuste em "aceita")
c001, c002, c003, c004, c005, c006, c007, c009, c010, c011, c012, c013, c014, c015, c016, c017, c018, c020, c021, c022, c023, c024, c026, c027, c028, c029, c030, c031, c032, c033, c034, c035, c036, c037, c038, c039, c040.
- **Fiéis ao cartão:** c009 liga pureza a reagente e rendimento a produto. É a mesma ordem do cartão ("um reduz o reagente, o outro o produto") e está correto.
- **Cientificamente corretas:** NaHCO₃ dá solução básica. Ciclobutano × but-1-eno é isomeria de cadeia (aberta × fechada).
- **Uma resposta só:** a "menor" de c002 não é aceita como "maior", porque são 2 letras trocadas.
- **Flashcards:**
  - c027 (o potencial não se multiplica) toca na nota do verso do qui-f105, mas o flashcard pergunta a fórmula da ddp. Mantive.
  - As demais não repetem nenhum flashcard.

Pontos de atenção que não exigiram troca:
- c031 tem a lacuna em "inicial". É a ideia central do cartão: a meia-vida não depende da quantidade inicial.
- c015 aceita "M", que o próprio cartão define como massa molar.
