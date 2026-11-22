# Revisão do site, 21/11/2026 (3ª rodada), 5ª passada: área "matérias"

Revisor independente, só leitura (nada foi corrigido). Build servido em http://localhost:4191, commit `4c6d0c99`.

**Escopo restrito:**
- Conferir T1, T2, T4, T5 e T6 de `materias-4` anterior (`materias-3.md`). T3 é decisão do dono e ficou de fora.
- Conferir se as correções quebraram algo vizinho. Os commits são "passada 4 T1/T2/T4/T5/T6": `8ccd35b6`, `6896b9cb`, `d07b4dfa`, `71837f97` e `4c6d0c99`.
- As cores novas das telas (22/11, `DESIGN.md`) não foram tratadas como erro.

**Método.** Playwright/Chromium, modo demonstração (perfil no `localStorage`). Scripts e dados em `scratchpad/m4/`.

- **T1, conta na figura.** Os temas B01–B12 foram abertos no escuro, a 1280. Em todos, a figura visível é a `fig-escuro`, com o fundo do cartão `rgb(20,27,25)`.
  - Cada figura foi desenhada a cerca de 1600 px, uma vez com os textos e outra sem eles, como na passada anterior.
  - Foram medidos **3 438 textos em 193 figuras**.
- **T1, print real do site.** Cada `img.fig-escuro` foi capturada direto da página, no escuro, a 1280 e a 390 (escala 2).
  - Dentro da caixa de cada texto, o fundo é a cor mais frequente. A letra é o pixel de maior contraste com esse fundo.
  - Em 5 textos a 1280 e 56 a 390, a caixa saiu lisa, sem letra (contraste 1 a 1,6). Nesses casos, a barra fixa do topo ou a barra de navegação de baixo cobria a figura no momento do print.
  - Para conferir, olhei essas figuras em prints próprios: B02 aminoácido, B07 coagulação, B05 DNA recombinante e B05 código genético. Em todas, o texto aparece normal.
- **T2.** A letra de cada pedaço de texto foi lida pela `fontFamily`, em todas as listas do caderno de 74 temas: Quí, Mat, Fís, Bio, Geo e His, a 1280 claro.
- **T4, T5, T6 e telas vizinhas.** Foram percorridas as telas F01–F12, M02, M04, M13, Q03, Q09, B05, B11, G01 e H01, a 390 e a 1280, nos temas claro e escuro. A varredura mediu:
  - rolagem lateral;
  - peça que sai da lista do caderno;
  - trecho `.nq` que quebrou de linha;
  - barra de fração que ficou na linha;
  - erros de console.
- **Prints olhados** (`r3-materias4-*.png`):
  - Teoria: F03 "No caderno" (1280 claro e 390 escuro) e F09 "No caderno" (768 claro).
  - Cartões de Física: F02 "Velocidade média" (390 claro), F02 "Queda livre" (1280 escuro), F09 "Reflexão" (390 claro) e F11 "Coulomb" (1280 claro e 390 escuro).
  - Mat M13: cartão "Probabilidade condicional" (390 claro e 1280 escuro) e "No caderno" (390 claro).
  - Cadernos de G01 (390 claro e 1280 escuro), H01 (390 escuro) e Filosofia e Sociologia S01 (390 claro).
  - Figuras de Bio: B05 alterações (1280 e 390 escuro, 390 claro), B04 ciclo (768 escuro) e B09 pirâmides (390 escuro).
- **Rolagem lateral e console:** nenhuma rolagem lateral e nenhum erro de console nas 84 combinações de tela, largura e tema.

## 1. Situação dos itens

| Item | Situação | Medida / o que se vê agora |
|---|---|---|
| T1: letras das figuras de Bio a ≥ 4,5:1 no escuro | **resolvido** | **Conta na figura: os 3 438 textos passam.** O menor é 4,60:1 ("S" e "~8 h" no ciclo celular, B04), seguido de 4,62:1 ("I"–"IV" na cadeia de B03, "Phe" na tradução de B05).<br>**"J", "K", "H" e "I" da translocação (B05): 4,95:1.** No print real a 1280, a caixa cinza sai `rgb(127,133,156)` sob a letra `rgb(15,21,41)`; antes eram 4,49:1.<br>**Print real a 1280:** fora as caixas cobertas pela barra (ver Método), nenhum texto fica abaixo de 4,60:1.<br>**A 390, letras miúdas:** "~8 h" e "~4 h" (B04, cerca de 5 px de altura) medem 4,27 e 4,35. A letra não chega à cor cheia por causa da suavização das bordas. O par de cores é o mesmo de 1280 (4,60 e 4,71), então não é falha de cor. |
| T2: "No caderno" de Física com uma letra só | **resolvido** | **"No caderno": 0 das 12 listas de Física misturam as letras** (antes, 11). F03 e F09 estão inteiros em Caveat, inclusive "polias móveis:", "iminência na rampa:", "curva plana:", "pêndulo cônico:" e "αᵢ = ângulo entre as outras duas forças" (print 1280 claro e 390 escuro).<br>**Cartões:** a prosa está sempre em Familjen. As linhas sem LaTeX seguem as linhas `com-fm` da mesma lista. Exemplo, F02 "Velocidade média": "m/s para km/h: multiplique por 3,6…" agora sai em Familjen, como a prosa da linha com $…$ acima. A conta dentro de $…$ continua em Caveat, que é a regra "Caveat: só conta e fórmula" do `DESIGN.md`.<br>**Amostra de Mat, Quí e Bio:** 0 das 382 listas misturam. Geo e His: 0 das 162. |
| T4: "q < 0" não quebra | **resolvido** | F11 "Lei de Coulomb", 1280 claro: "q < 0 sente força oposta ao campo" fica inteiro na linha. Nas 84 combinações, nenhum dos trechos `.nq` quebrou de linha. Exemplos de quantos há por tela: F11 tem 44 e F08 tem 35. |
| T5: "P(A ∩ B) / P(B)" empilha | **resolvido** | M13, cartão "Probabilidade condicional" e "No caderno", a 390 claro e 1280 escuro: P(A ∩ B) fica em cima e P(B) embaixo. Ver V1, de outra linha do mesmo tema. |
| T6: G01 "latitude" e "longitude" em duas linhas | **resolvido** | G01 "No caderno", 390 claro: "latitude: 0° a 90° N ou S do Equador" e "longitude: 0° a 180° L ou O de Greenwich" ficam em duas linhas.<br>**Vizinhos conferidos:** H01 (390 escuro) e Filosofia e Sociologia S01 (390 claro). "Milão (313)…" / "Tessalônica (380)…", "Durkheim…" / "Marx…" e "bem material…" / "bem imaterial…" ficam em linhas próprias. As continuações com seta ("periodização: 3300 a.C. → 476 → 1453 → 1789", "Atenas: Drácon → Sólon → …") seguem juntas. |

## 2. Achados novos

### V1. M13: "P(A) = favoráveis / possíveis" com a barra na linha
- **Tela:** `#/m/mat/tema/M13?aba=teoria`, "No caderno" e cartão de probabilidade. Visto em todas as larguras e nos dois temas; print 390 claro.
- **O que está errado:**
  - A linha "P(A) = favoráveis / possíveis" sai com a barra na linha.
  - Na mesma lista, "condicional: P(A|B) = P(A ∩ B) / P(B)" sai empilhada, logo abaixo.
- **Origem:** não vem das correções desta passada. A correção T5 trata só a forma "função(…) / função(…)". A divisão entre duas palavras com " / " continua na linha.
- **Onde:** `app/src/logica/fracao.ts`, função `divisoes` / `opEsq` / `opDir`, linhas 589–598. Não aceita uma palavra só de cada lado de " / " quando há "=" antes.
- **Como corrigir:** escolha uma das saídas.
  - Empilhar "palavra / palavra" quando a linha tem "=" antes (definição de fórmula). Os versos de Português (`por`), "e/ou" e as unidades ficam de fora.
  - Ou escrever a linha em LaTeX, com `\frac{\text{favoráveis}}{\text{possíveis}}`.
- **ERRO** ("Fração sempre empilhada", CLAUDE.md).

### V2. F03 "No caderno": "cos θ" partido entre duas linhas a 390
- **Tela:** `#/m/fis/tema/F03?aba=teoria`, "No caderno", 390 escuro (vale para os dois temas, porque a letra é a mesma).
- **O que está errado:**
  - Em "rampa: Pₓ = P sen θ    N = P cos θ", o "cos" fica no fim de uma linha e o "θ" sozinho na linha seguinte.
  - É o mesmo tipo de quebra do T4, agora dentro da fórmula em LaTeX.
- **Onde:** `app/src/ui/Formula.tsx`, saída de `\,`. O espaço fino vira `<span class="fm-esp e1">`, e o navegador pode quebrar a linha nesse ponto. No HTML: `P<span class="fm-esp e1"></span>cos<span class="fm-esp e1"></span>θ`.
- **Como corrigir:**
  - não deixar quebrar a linha no espaço fino (`fm-esp e1`) entre a função e o argumento: `sen θ`, `cos θ`, `tg θ`, `P sen`;
  - ou juntar "função + argumento" num trecho com `white-space: nowrap`.
  - A quebra no espaço largo entre duas relações (`e3`) pode continuar.
- **ERRO** (leitura).

Total: 2 ERROS, 0 DECISÕES DO DONO
