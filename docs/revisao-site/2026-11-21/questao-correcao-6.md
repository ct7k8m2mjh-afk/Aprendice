# Revisão do site, 21/11/2026 (3ª rodada, 7ª passada): questão, correção e teoria

Revisor independente. Só li, medi e escrevi; não corrigi nada. Site em http://localhost:4191 (build com os commits "passada 6" Y1–Y5; HEAD `b3f49bad`), login em modo de demonstração. As cores novas de 22/11 (DESIGN.md) não foram tratadas como erro.

Escopo restrito: Y1–Y5 (`questao-correcao-5.md`) e o que essas mudanças podem ter quebrado.

## Como medi

**Por script.**
- Compilei o `fracao.ts` atual e o de antes do Y1, e o `motorConta.ts` atual e o de antes do Y5.
- Rodei os dois `fracao.ts` sobre todos os textos de `public/conteudo`: 178 textos mudaram. Li todas as frações novas.
- **Y1, valor:** separei as 1 209 frações em que a potência de 10 pode ir para baixo ou ficar fora: denominador "b × 10ⁿ", ou fração seguida de "× 10ⁿ". Para cada uma, calculei:
  - o valor mostrado;
  - o valor da outra leitura;
  - o resultado escrito depois do "=" ou do "≈".
- **Y5:** montei o roteiro das 1 420 resoluções que têm " | " no quadro, com o motor de antes e o de agora (1 300 mudaram). Procurei nos dois:
  - item perdido ou repetido;
  - "|" que sobrou;
  - linha só com rótulo ou só com número;
  - parêntese aberto e não fechado.

**Na tela.** Playwright, Chromium, `deviceScaleFactor` 1. Prints `r7-qc-*.png` na pasta de rascunho.
- **16 resoluções animadas até o fim** (Mat, Fís e Quí com o quadro mudado), a 1280 claro e a 390 escuro:
  - mat P9a5d64d9, P756b978d, P47d11207, P65c800ad, P5efec0b8, P5943cbb6 e Pc55df42c;
  - quí Pa8675894, Pf90acda4, Paca34b46, Pad0b7767 e Paff10b5f;
  - fís Pce134e95, P9ba33c4c, Pc0effe18 e P0b24ca44.
- Mais 5 delas a 390 claro e a 1280 escuro: P756b978d, Pa8675894, P5943cbb6, P65c800ad e Pf90acda4.
- Todas chegaram a "Assistir de novo". Os controles ficaram sempre à vista. Nenhuma linha passou da folha.
- **20 questões com a correção aberta e 3 teorias**, a 1280 claro e a 390 escuro:
  - fís Pabef4082, Pdd874c02, P8be725f1, P55cd34e9 e P4d88d6f7;
  - mat P8af6b4ab e 810f54c4;
  - quí P23cb376, P1dfb107, P3187c6e8, P88e49d5b e P0229d63;
  - bio Pfdf5d827 e P69101fcc;
  - por P64f920a1 e Pb4377de5;
  - his P8e242b1d e Pc33f6973;
  - geo P3eeff267;
  - ing Pe7abdf75;
  - teoria de M10, M03 e F09.
- Em todas as execuções: nenhuma rolagem lateral e nenhum erro de console ou de rede.

**Texto comum continua na linha:**
- "e/ou" (bio Pfdf5d827 e P69101fcc, ing Pe7abdf75);
- "amor/ódio, ampliou/caçada, fácil/difícil" (por P64f920a1);
- "medo/desinformação" (his Pc33f6973);
- datas "1/9/1939" e "3/9" (his P8e242b1d);
- unidades: "mol/L", "g/mol", "hab/km²", "mg/kg", "mg/mL";
- o texto da prova de Português (por Pb4377de5).

Nenhuma fração nova junta palavras comuns fora de fórmula.

## 1. Itens da passada anterior

| # | Item | Situação | O que vi agora |
|---|---|---|---|
| Y1 | "× 10ⁿ" de fora ia para o denominador | **resolvido** | Os três casos mostram o valor certo:<br>- quí P3187c6e8 e cederj-2025-1: "3,75 × 10⁻⁵ × (32 sobre 600) × 10⁶ = 2,00" e "(2,40 × 10⁻³ sobre 600) × 10⁶ = 4,00 ppm";<br>- quí P88e49d5b e uel-2022: "(80 × 10⁻⁶ sobre 137,3) × 10⁻² ≈ 5,8 × 10⁻⁹".<br>Na tela, a 1280 claro e a 390 escuro.<br>Nas 1 209 frações conferidas, nenhuma mostra valor errado: onde o resultado escrito decide, a leitura mostrada bate com ele. Só 4 parecem não bater, mas é unidade: "5/(350 × 10³) ≈ 14,3 µA" está certo em ampères.<br>Também continua certo: "3,0 × 10⁸ sobre 13,6 × 10⁶ ≈ 22". |
| Y2 | Nome da função dentro da fração | **resolvido** | Agora:<br>- "f(9) = sen (3π sobre 2) = −1" (mat P5943cbb6, animação, print `r7-qc-anim-mat-P5943cbb6-1280-claro.png`);<br>- "sen 2θ sobre cos 2θ", com o θ embaixo (mat P8af6b4ab);<br>- M10: "30°: sen (1 sobre 2)" e "8 · sen 75° sobre sen 60°";<br>- detector: "cos 3π/4", "sen 7π/6", "sen 2π/3" e "cos 5π/4" com a função fora. |
| Y3 | Palavra virava numerador | **resolvido** | Ficam na linha: "x ao quadrado ÷ C = K" (quí P23cb376), "(2 × 10⁻⁴) ao quadrado ÷ 0,02" (quí P1dfb107), "7,2 × 10¹⁷ átomos ÷ 6,0 × 10²³", "(distância ao vértice ÷ h)²", "não ÷ novo" e "nem ÷ média".<br>Empilha com o nome inteiro: "5 sobre preço antigo" (M04.5).<br>Os casos que ficaram na linha estão no Z4. |
| Y4 | Frações de conta na linha | **resolvido** | Empilham:<br>- "tTerra/tLua = gTerra/gLua" (fís P8be725f1, nas duas larguras);<br>- todas as do relatório anterior: "η = P_útil/P_total", "sen θL = n_casca/n_núcleo", "P_lâmpada/P_total = R_lâmpada/R_total", "p_janela/p_tímpano = …", "tg θ = B_eletroímã/B_Terra", "variação = (novo − antigo)/antigo", "IMC", "luminância", "meses", "h", "tg β", "altura do poste / sombra do poste = …", "tamanho da imagem / … ", "E = desenho / real" e "média mensal";<br>- na tela, M03: "variação = (novo − antigo) / antigo" e "valor antigo = novo ÷ (1 + i)".<br>Ficam na linha, de propósito, as razões sem "=" (Z4). |
| Y5 | "\|" da conta à mão parecia barra de divisão | **resolvido no caso pedido, com efeito colateral** | Em mat P5943cbb6, as três linhas de resumo saíram e as notas ("arcos", "tira voltas", "senos") foram para as contas.<br>Nos 1 300 roteiros mudados:<br>- nenhuma linha guarda "\|" de separador;<br>- ficaram inteiros "P(não atingiu \| aderiu)" (mat P65c800ad) e as barras de módulo "\|−3\| = 3" (mat P5efec0b8);<br>- rótulos "a) 3–2", "b) 2–1"… ficam com o seu item (quí Paff10b5f);<br>- nenhum texto cortado;<br>- nenhum item perdido: os 40 suspeitos do script já estavam na conta do passo, como em quí P0fc6f7b7.<br>Mas a lista de valores virou coluna de números soltos (Z1). Um rótulo de reação ficou com a reação errada (Z2). |

## 2. Achados novos

### Z1. Y5: lista de valores "rótulo: a | b | c" vira coluna de números soltos, e às vezes repete a conta de cima
- **ERRO** (leitura da conta; vem do Y5).
- Quando a linha do quadro é um rótulo seguido de valores, cada valor vai para uma linha. O rótulo fica só no primeiro valor e a nota só no último. Exemplos, na animação até o fim, nas 4 combinações de largura e tema:
  - **mat P756b978d** (ueg-2023-1), passo 3: a linha de Briot-Ruffini "1 | 1 | 4 | 0" sai em pé, "1", "1", "4", "0", um embaixo do outro. A nota "Briot-Ruffini com a = 3" fica ao lado do "0". Print `r7-qc-anim-mat-P756b978d-1280-claro.png`.
  - **quí Pa8675894** (uema-paes-2022), passos 1 e 2: "Ca (Z = 20): 2", depois "8", "8", "2". O aluno lê "Ca: 2". Igual em "Sr (Z = 38): 2", "8", "18", "8", "2". Print `r7-qc-anim-qui-Pa8675894-390-escuro.png`.
  - **mat P47d11207** (unitins-2024-1), passo 2: "200 − 40 = 160", depois "160", "40" e "70 A | AB | B". O 70 aparece antes de ser calculado no passo 4, e a nota dá a entender que "70" é "A | AB | B". Print `r7-qc-anim-mat-P47d11207-1280-claro.png`.
  - **mat P9a5d64d9** (unicamp-2027): "azul: 5", "3,25", "13", "17", logo abaixo de "(1, 2): 5", "(−3/2, −1): 3,25"… Os mesmos números aparecem duas vezes. Igual com "vermelha".
  - **quí Pf90acda4** (unimontes-2024-ps1): "pH: 4,0", "3,6", "2,5" aparece no passo 3 e de novo no passo 4. "lipídios: 0,54", "2,47", "3,61" e "Mg: 70,0", "48,0", "23,0" repetem em coluna o que o passo 2 já escreveu em uma linha.
  - **quí Pad0b7767** (pucrio-2023): "butano 58 … etilenoglicol 62 g/mol", seguido de "58", "58", "60" e "62 g/mol" soltos.
  - **fís Pce134e95**: "0%: 0,57 … 7,4%: 0,61", seguido de "µ: 0,57", "0,54", "0,50" e "0,61".
  - **fís Pc0effe18** (fuvest-2027): "∛8 = 2 → raios: 1", depois "4", "10" e "20 km".
  - **mat Pc55df42c**: "empate 3/9 = 1/3", "não empate 2/3" e, logo abaixo, "1/3" e "2/3" soltos.
  - Pelo script, também: mat Pe2690eb6 ("grupos: 1", "2", "3", "1"), P359dcef8 ("4", "12", "16") e Pdfcfe2a2 ("15", "15"); quí P03ff24db ("C1: H", "NHCH3", "CH2", "C aromático", repetindo a conta de cima).
- Medida: resoluções com 2 ou mais linhas só de número passaram de 33 para 44 (Mat 30, Quí 10, Fís 4). As 33 de antes vêm da conta dos passos, como as listas de dados de M14.1, e não são deste item.
- Onde: `app/src/logica/motorConta.ts`, `pedacos`/`itensDoQuadro` em `montaRoteiro` (commit `13a19946`).
- Como corrigir:
  - **Lista de valores:** não partir em linhas quando os pedaços depois do primeiro forem só valores (número, com ou sem unidade, sem ":" nem "="). Trocar o " | " por um separador que não pareça barra, como "; " ou um espaço largo, sem estilo novo. Ou reescrever nos dados ("2, 8, 8, 2").
  - **Linha repetida:** se cada valor já está numa linha da conta do mesmo passo, a linha do quadro não entra. A regra nova já faz isso quando os itens são iguais, mas não quando só o número bate ("azul: 5" × "(1, 2): 5").

### Z2. Y5: rótulo de reação vai para a reação errada (quí Paca34b46)
- **ERRO** (leitura da conta; vem do Y5).
- Tela: quí Paca34b46 (também na prova udesc-2024-2), passo 1, animação até o fim, a 1280 claro e a 390 escuro.
- Na conta, "1) Mg: 0 → +2 | H: +1 → 0  3) Mg: 0 → +2 | N: 0 → −3  6) …" separa os nox com " | " e as reações com espaço duplo. Agora o parêntese do rótulo não conta mais como grupo aberto, e a conta é partida no " | ". As linhas ficam assim:
  - "1) Mg: 0 → +2";
  - "H: +1 → 0 3) Mg: 0 → +2";
  - "N: 0 → −3 6) Mg: 0 → +2";
  - "O: 0 → −2".
- O H da reação 1 fica na linha da reação 3, e o N da 3 fica na linha da 6. Antes, a conta saía numa linha só.
- Este foi o único caso que achei na varredura das contas com rótulo "n)" e " | ". Os outros 25 casos ficam certos: um item por rótulo, como "a) caso", "b) pois"…
- Onde: `motorConta.ts`, `cortes` (`prof = Math.max(0, prof - 1)`), junto com o Y5.
- Como corrigir:
  - nos dados, separar as reações com " | " e os nox de cada reação com ", ", como em "1) Mg: 0 → +2, H: +1 → 0 | 3) …";
  - ou também cortar antes de um rótulo "n)" que vem depois de dois espaços.

### Z3. Letra com índice escrito como número fica fora da fração ("ε0A/λ", "θ1/4")
- **ERRO** (conta empilhada que o aluno lê com outro valor). Já existia antes da passada 6; não vem do Y1–Y5.
- Telas, com a correção aberta, a 1280 claro e a 390 escuro:
  - fís Pabef4082 (também na prova ime-2021), "Por que as outras", letra E: "0,433 · ε0A/λ" sai como "ε" na linha e "0A" sobre "λ". O aluno lê ε · (0 · A)/λ. O certo é ε₀A sobre λ. O mesmo acontece no campo "essencial", em "C = ε0A/d".
  - fís Pdd874c02 (uft-2024-1), letras A e B: "θ3 = θ1/4" e "θ1/2 = π/360" saem como "θ" na linha e "1" sobre "4" (ou "2"). O índice vira numerador, e o aluno lê θ · (1/4).
- No detector, também: mat M16.2 Pc332c2b7, "θ1 + θ1/2".
- Onde: `fracao.ts`, termo da esquerda da barra. Corta a letra grega do dígito colado a ela.
- Como corrigir:
  - tratar letra + dígito colado ("ε0", "θ1") como um nome só, como já acontece com "n1/n3";
  - de preferência, escrever "ε₀" e "θ₁" nos dados.

### Z4. Divisões que ficam na linha de propósito (casos de fronteira)
- **DECISÃO DO DONO.**
- Ficam na linha, sem empilhar:
  - "a razão carga/massa", "razão lucro/custo" e "a razão B/A é comprimento/tempo" (fís P55cd34e9, na tela): sem "=", a barra pode ser "ou" ou par de alternativas;
  - "trabalho que falta ÷ ritmo novo";
  - Y3: "x ao quadrado ÷ C = K" (quí P23cb376), "(2 × 10⁻⁴) ao quadrado ÷ 0,02" (quí P1dfb107), "7,2 × 10¹⁷ átomos ÷ 6,0 × 10²³" (Q04.1) e "(distância ao vértice ÷ h)²" (M11.3).
- Recomendação: deixar na linha. Nenhum deles mostra valor errado.
- Se o dono quiser tudo empilhado, o caminho seguro é reescrever esses dados como fórmula ("x²/C", "(2 × 10⁻⁴)²/0,02"), e não alargar a regra.

Total: 3 ERROS, 1 DECISÃO DO DONO
