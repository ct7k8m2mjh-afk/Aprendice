# Revisão do site, 21/11/2026 (3ª rodada), 4ª passada: área "matérias"

Revisor independente, só leitura (nada foi corrigido). Build servido em http://localhost:4191, commit `fcccc21d`.

**Escopo restrito:**
- `passada-3.md` N2: textos das figuras de Biologia no tema escuro.
- `questao-correcao-2.md` R9: uma letra só por lista no caderno da Teoria.
- Se essas correções quebraram algo vizinho.

**Método.** Playwright/Chromium, modo demonstração (perfil no `localStorage`).
- **N2: o que aparece em cada tema.** Os temas B01–B12 de Bio foram abertos na aba Teoria a 1280, no claro e no escuro. A coleta registrou, figura por figura, qual `<img>` fica visível.
- **N2: contraste medido na imagem desenhada.** Cada figura que aparece no escuro foi desenhada num canvas a cerca de 1600 px. A cor de fundo é a do cartão real, `rgb(20,27,25)`. Cada figura foi desenhada duas vezes: como está e com os textos transparentes. A diferença entre as duas dá os pixels de cada letra. A caixa de cada texto vem de um `Range` sobre o SVG em linha. Para cada texto, o contraste vem dos pixels do miolo da letra (os 30% que mais mudam) contra o pixel da mesma posição sem o texto, ou seja, a forma que fica de fato atrás. O valor registrado é a mediana. Foram medidos **3 438 textos em 193 figuras**, sem contar a glicose de B02.
- **N2: conferência no site.** O caso que falhou foi conferido no print real do site (amostra de pixels no PNG).
- **N2: tema claro.** A `src` visível foi comparada com o `u` original de `app-atual/bio/img/<tema>.json`.
- **R9: leitura por script.** A letra de cada linha do caderno foi lida pela `fontFamily` de cada pedaço de texto (Caveat / Familjen / mistura). A leitura cobriu todas as listas (`ul.caderno`, "No caderno" e cartões) de **74 temas** (Quí, Mat, Fís, Bio, Geo, His), **630 listas**, a 1280 claro.
- **Prints:** `r3-materias3-*.png` no scratchpad, olhados um a um.
  - Telas: Q03 (ácido e base), Q09 (meia-vida), F03 ("No caderno"), F11 (Coulomb), M02, M04, M13, B05, B11, G01, H01.
  - Figuras: B05 (alterações), B09 (pirâmides), B03 (cadeia) e B04 (aneuploidias).
  - Larguras e temas: 390 e 1280 nos temas claro e escuro, mais 768 claro (Q09, B05), 768 escuro (B04) e 1440 escuro (Q09, H01).
- **Rolagem lateral e console:** nenhuma rolagem lateral e nenhum erro de console nas telas abertas.

## 1. Situação dos itens

| Origem | Item | Situação | Medida / o que se vê agora |
|---|---|---|---|
| passada-3 N2 | Texto das figuras de Bio no escuro ≥ 4,5:1 contra a forma de trás | **parcial** | **3 434 de 3 438 textos passam.** Os 51 casos da passada 3 subiram para 4,58 a 5,5:1. Exemplos: "consumidores 3º" e "10 kcal" na pirâmide (4,58), "II" na cadeia (4,62), "A"/"B" no Linkage (4,58), "G2"/"~4 h" (4,71), "O₂ → H₂O" (4,99), "(estroma)" (5,41), vermelho "47,XX…"/"parada" (5,48). **Sobram 4 letras a 4,49:1** (ver T1). As 11 figuras sem versão escura (ícones de organelas e órgãos) não têm texto. **Claro:** a imagem certa aparece em cada tema: só a `fig-claro` no claro e só a `fig-escuro` no escuro. **192 de 193** figuras são idênticas ao original. A diferente é a de Hardy-Weinberg (B11), corrigida antes por causa da fração. |
| questao-correcao-2 R9 | Uma letra por lista no caderno da Teoria | **parcial** | **Listas sem LaTeX: resolvido.** Em Quí, Mat, Bio, Geo e His, nenhuma das 544 listas mistura Caveat e Familjen. Q03 "Ácido e base: três teorias" está toda em Caveat, inclusive "Lewis: ácido recebe par de e⁻; base doa" (print 390 claro). Q09 está certa: "No caderno" em Familjen e cada cartão numa letra só. **½ ¼ no Q09:** em "1 → ½ → ¼ → ⅛ → 1/16" (cartão Meia-vida), todas as frações saem empilhadas a 390, 768, 1280 e 1440, nos dois temas. **Física: não resolvido.** 69 das 86 listas misturam as duas letras: 11 "No caderno" e 58 cartões (ver T2). |

## 2. Achados novos

### T1. Quatro letras da figura "Alterações cromossômicas estruturais" (B05) a 4,49:1 no escuro
- **Tela:** `#/m/bio/tema/B05?aba=teoria`, tema escuro, todas as larguras.
- **O que está errado:**
  - Na linha "translocação", as letras "J", "K", "H" e "I" (`#0F1529`) ficam sobre caixas cinza `#9AA0BD` com `fill-opacity="0.75"`.
  - Na tela, a caixa sai `rgb(120,126,148)`. Isso foi lido no print real do site a 1280 (364 pixels dessa cor dentro da caixa do "J").
  - O contraste é **4,49:1**, abaixo do mínimo de 4,5:1.
- **Onde:** `app/src/logica/figuraEscura.ts:366`.
  - O ajuste pula a forma quando o contraste estimado é ≥ 4,5. A estimativa usa a cor do cartão em ponto flutuante e dá 4,54:1.
  - O navegador desenha em 8 bits e arredonda para baixo, o que dá 4,49:1.
  - Quando o ajuste age, as linhas 376–377 já usam folga (`ALVO_FIGURA + 0.05`). O teste de entrada não usa.
- **Como corrigir:** usar a mesma folga no teste da linha 366 (`t.contraste >= ALVO_FIGURA + 0.05`). A caixa cinza fica um pouco mais opaca, como nas outras.
- **ERRO** (contraste).

### T2. Física: o caderno ainda mistura Caveat e Familjen na mesma lista
- **Tela:** `#/m/fis/tema/F01`…`F12?aba=teoria`, "No caderno" e cartões, todas as larguras e temas.
- **O que está errado (listas com LaTeX, que a correção do R9 deixou de fora):**
  - **"No caderno" (11 temas, todos menos F11).** O rótulo em `\text{}` muda de letra conforme o número de palavras.
    - F03, print 1280 claro: "rampa:", "Hooke:", "série:", "loop:", "rotor:", "Lamy:" e "alavanca:" saem em Caveat.
    - Na mesma lista, "polias móveis:", "iminência na rampa:", "curva plana:", "pêndulo cônico:" e "αᵢ = ângulo entre as outras duas forças" saem em Familjen.
    - O mesmo acontece em F02 ("MU:", "queda:" em Caveat; "gráficos: inclinação dá" em Familjen) e em F09 ("Gauss:", "índice:" em Caveat; "câmara escura:", "espelho esférico:", "ângulo limite:" em Familjen).
  - **Cartões (58).** As linhas em `$…$` (`com-fm`) têm a prosa em Familjen e a conta em Caveat. As linhas sem LaTeX da mesma lista seguem a maioria e saem inteiras em uma das letras.
    - F02, "Velocidade média": "vm = Δs/Δt, com o tempo total (paradas incluídas)" tem a prosa em Familjen. Logo abaixo, "m/s para km/h: multiplique por 3,6; de volta, divida por 3,6" sai toda em Caveat.
    - F09, "Reflexão": "N = 360°/α − 1" em Caveat, e "espelho anda x, imagem anda 2x…" em Familjen.
- **Onde:**
  - `app/src/logica/latex.ts:120`: o `\text{}` com duas palavras vira texto, e com uma palavra fica na fórmula.
  - `app/src/telas/Tema.tsx:39` e `:64`: a maioria conta só as linhas sem LaTeX (`filter(!ehLatex)`). As linhas com LaTeX seguem regra própria.
- **Como corrigir:**
  - Decidir a letra pela lista inteira também quando há LaTeX.
  - No "No caderno" de matéria de cálculo, todo `\text{}` de rótulo deve ir na letra da fórmula (Caveat), como já sai "rampa:".
  - Nos cartões, as linhas sem LaTeX devem seguir a mesma regra das linhas `com-fm` da lista.
- **ERRO** (`DESIGN.md`: a mesma peça com uma letra só; R9 resolvido só em parte).

### T3. Frase de texto corrido em Caveat por causa da maioria
- **Tela:** cartões da Teoria de Mat, Fís, Bio e Quí.
- **O que se vê:** com a regra da maioria (R9), frases inteiras saem à mão. A leitura fica mais lenta no celular. Exemplos vistos nos prints:
  - mat M02, "No caderno", 390 escuro: "inversa: dobrando uma, a outra cai à metade (produto constante) → inverte uma das razões" (3 linhas em Caveat).
  - mat M13, "Probabilidade condicional", 390 claro: "tabela: valor da célula dividido pelo total da linha ou coluna dada".
  - fís F11, "Lei de Coulomb", 1280 claro: "força proporcional ao produto das cargas e ao inverso de d²" e "Q > 0: campo sai; Q < 0: campo entra; q < 0 sente força oposta ao campo".
  - bio B05, "Código genético", 768 claro: "degenerado: vários códons para o mesmo aminoácido".
- **No sentido contrário:** algumas contas ficam em Familjen porque a lista é de texto, sem prejuízo de leitura, e a fração empilha. Exemplos: mat M04 "ax + b = 0 ⇒ x = −b/a (a ≠ 0)"; bio B11 "Hardy-Weinberg: p + q = 1 e p² + 2pq + q² = 1".
- **Ponto de conflito:** o comentário de `Formula.tsx:12` diz "cursiva nunca em texto corrido". A regra "uma letra por lista" bate com isso nessas frases.
- **Escolha para o dono:**
  - manter a lista com uma letra só, como está;
  - ou abrir exceção para frases longas, por exemplo acima de umas 8 palavras sem sinal de conta.
- **DECISÃO DO DONO.**

### T4. Linha quebrada no meio de "q < 0"
- **Tela:** fís F11, cartão "Lei de Coulomb e campo elétrico", 1280 claro (print `r3-materias3-fisF11coul-1280-claro.png`).
- **O que está errado:** "…q <" fica no fim de uma linha e o "0 sente força oposta ao campo" vai para a seguinte. A desigualdade fica partida.
- **Onde:** caderno sem texto em LaTeX (`comFracoes`). Não há espaço inseparável em volta de `<`, `>`, `=`, `≤` e `≥`.
- **Como corrigir:** juntar o termo, o sinal e o termo seguinte (espaço fino inseparável ou `white-space: nowrap` no trecho "q < 0").
- **ERRO** (leitura).

### T5. Fração na linha no caderno de Probabilidade condicional
- **Tela:** mat M13, cartão "Probabilidade condicional", 390 claro e 1280.
- **O que está errado:** "P(A|B) = P(A ∩ B) / P(B)" sai na linha, com a barra. Não empilha.
- **Origem:** é anterior às correções desta passada. O detector não aceita "∩" e "|" dentro dos parênteses.
- **Onde:** `app/src/logica/fracao.ts` (`barras`).
- **Como corrigir:**
  - aceitar "∩", "∪" e "|" dentro de um grupo entre parênteses no numerador e no denominador;
  - ou escrever a linha em LaTeX com `\frac`.
- **ERRO** ("Fração sempre empilhada", CLAUDE.md).

### T6. Geografia G01, "No caderno": duas linhas viraram uma frase só
- **Tela:** `#/m/geo/tema/G01?aba=teoria`, 390 claro.
- **O que está errado:**
  - O dado tem duas linhas: "latitude: 0° a 90° N ou S do Equador" e "longitude: 0° a 180° L ou O de Greenwich".
  - Na tela elas saem juntas: "…N ou S do Equador longitude: 0° a 180°…". Parece que "Equador longitude" é uma coisa só.
  - Os outros itens da mesma lista mantêm as duas linhas. Exemplo: "escala grande…" / "escala pequena…".
- **Origem:** é anterior às correções desta passada.
- **Onde:** `app/src/ui/Formula.tsx:24` (`juntaFrases`/`continuaFrase`). A função junta a linha que não termina em pontuação com a seguinte.
- **Como corrigir:** não juntar quando a linha seguinte começa com um rótulo "palavra:".
- **ERRO** (texto alterado na tela).

Total: 5 ERROS, 1 DECISÃO DO DONO
