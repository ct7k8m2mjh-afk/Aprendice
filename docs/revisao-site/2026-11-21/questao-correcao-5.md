# Revisão do site, 21/11/2026 (3ª rodada, 6ª passada): questão, correção e teoria

Revisor independente. Só li, medi e escrevi; não corrigi nada. Site em http://localhost:4191 (build com os commits "passada 5" U1–U3, V1–V2, W1–W3 e X1; HEAD `030501f4`), login em modo de demonstração. As cores novas de 22/11 (DESIGN.md) não foram tratadas como erro.

Escopo restrito: U1–U3 (`questao-correcao-4.md`), V1–V2 (`materias-4.md`), W1, W2, W3 e X1, e o que essas mudanças podem ter quebrado.

## Como medi

**Detector.** Compilei o `app/src/logica/fracao.ts` atual e rodei sobre todos os textos de `public/conteudo`. Comparei com a versão de antes da passada 5: mudaram 530 textos (Mat 304, Fís 164, Quí 40, provas 21, Ing 1; nada em Por, His, Geo e Bio).
- Li todas as 168 frações novas com palavras (X1) e todas as 79 com notação científica (W3).
- Conferi o valor de cada fração numérica contra o "= X" que vem depois.
- Procurei fração com palavra comum empilhada em Bio, Geo e Por: só aparecem fórmulas ("densidade = população ÷ área", "IMC = massa/(estatura)²").

**Na tela.** Playwright, Chromium, `deviceScaleFactor` 1. Prints `r5-qc-*.png` na pasta de rascunho.
- **3 resoluções animadas até o fim**, a 390 e a 1280, claro e escuro (12 execuções): fís Pca19482b, fís Pdba47980 e fís P8be725f1. Todas chegaram a "Assistir de novo". Os controles ficaram sempre à vista. Nenhuma linha passou da folha.
- **Mais 8 animadas até o fim**, a 1280 claro e a 390 escuro: fís P55cd34e9 e P2c0e1fa4, mat P8af6b4ab, Pa9eb23da, P5943cbb6 e Pf7f60419, quí P23cb376 e P3187c6e8.
- **25 questões com a correção aberta**, a 1280 claro e a 390 escuro: fís P4d88d6f7, P1813316a, P9ad20d1b, P2c0e1fa4, P7b503123 e Pecd60126; mat Pa420dcf6, Pca0cde73 e 810f54c4; quí P39160802, Pc0398599, P3187c6e8, P88e49d5b, P1dfb107 e P0229d63; bio P0ee6f8f8, Pfdf5d827 e P69101fcc; por Pb4377de5 (também "Ver em texto") e P64f920a1; geo P3eeff267 e Pcc009a2f; his P8e242b1d e Pc33f6973; ing Pe7abdf75.
- **Teoria** de M13, M10, F03, F07 e Q04, a 1280 claro e a 390 escuro.
- Em todas as execuções: nenhuma rolagem lateral e nenhum erro de console ou de rede.

**Texto comum continua na linha:**
- "e/ou" (ing Pe7abdf75, bio Pfdf5d827 e P69101fcc);
- "medo/desinformação" (his Pc33f6973);
- "amor/ódio" e "fácil/difícil" (por P64f920a1);
- datas "1/9/1939" e "3/9" (his P8e242b1d);
- unidades ("g/cm³", "g/mol", "mol/L", "hab/km²", "mL/(min · kg)").

O texto da prova de Português ("[...] / (justificação)", por Pb4377de5) não empilha, nem em "Ver em texto". O X1 não empilhou nenhum par de palavras comuns fora de fórmula.

## 1. Itens da passada anterior

| # | Item | Situação | O que vi agora |
|---|---|---|---|
| U1 | "mg/(qB)" na linha | **resolvido** | fís P4d88d6f7, "Por que as outras": "(4/3)·(mg/(qB))²", "2mg/(qB)" e "(1/2)·(mg/(qB))²" empilham, a 1280 claro e a 390 escuro. |
| U2 | "(n/V)₂/(n/V)₁" na linha | **resolvido** | fís Pca19482b, passo 1: a razão de fora empilha, com "(n/V)₂" em cima e "(n/V)₁" embaixo, e as de dentro também empilhadas. Igual nas 4 combinações. Print `r5-qc-anim-fis-Pca19482b-1280-claro.png`. |
| U3 | Apóstrofo de "R''" fora da fração | **resolvido** | fís Pdba47980, passo 4: "750 = 110²/R''" com "R″" inteiro embaixo, sem apóstrofo solto. |
| V1 | "favoráveis / possíveis" na linha | **resolvido** | M13, "No caderno" e cartão: empilha nas duas larguras e nos dois temas. |
| V2 | "cos θ" partido a 390 | **resolvido** | F03 "No caderno", 390 claro e escuro: "cos" e "θ" ficam na mesma linha nos 25 espaços finos medidos. Ainda acontece "N =" no fim de uma linha e "P cos θ" na seguinte (print `r5-qc-z-v2.png`). Esta quebra fica permitida pela regra do V2 e não está contada como erro. |
| W1 | "n!/(n−p)!" empilha | **resolvido** | M13: "A(n,p) = n!/(n−p)!", "C(n,p) = n!/(p!(n−p)!)", "6!/(3! · 2!)" e "7!/(4! · 3!)" empilham, com o fatorial em cima. |
| W2 | "tg = sen/cos" empilha | **resolvido** | M10 "No caderno": "tg = cateto oposto / cateto adjacente = sen/cos" empilha os dois lados. Também "tg θ = oposto / adjacente = sen θ / cos θ". |
| W3 | Notação científica dos dois lados da barra | **resolvido no caso pedido, com efeito colateral** | fís Pca19482b, passo 2: "(6,3 × 10⁴/1,0 × 10⁵) × (300/270)" empilha inteiro, na animação e no texto. Também ficaram certos F10.1 "3,0 × 10⁸/13,6 × 10⁶", F01.5 e F04.5. Mas a regra nova pega o "× 10ⁿ" que multiplica depois da fração: ver Y1. |
| X1 | Fórmula com palavras depois de "=" | **resolvido** | Empilham: "densidade = massa/volume" e "n = massa/massa molar" (detector); "A = força/comprimento", "B = força/tempo²" e "[B]/[A] = comprimento/tempo²" (fís P55cd34e9, animação); "EC = consumo/massa" (mat Pf7f60419). Nenhum falso positivo nas 168 frações novas. Restam razões sem "=" ou com variável de índice: ver Y4. |

## 2. Achados novos

### Y1. W3 põe no denominador o "× 10ⁿ" que multiplica depois da fração (valor errado)
- **ERRO** (conta com denominador errado; vem do W3).
- Telas:
  - quí P3187c6e8, letra C, a 1280 claro (print `r5-qc-z-cederj.png`). A mesma resolução aparece na prova cederj-2025-1.
  - quí P88e49d5b, letra C, a 390 escuro (print `r5-qc-z-uel.png`). A mesma resolução aparece na prova uel-2022.
- O que está:
  - "3,75 × 10⁻⁵ × 32 ÷ 600 × 10⁶ = 2,00" sai como 32 sobre "600 × 10⁶". O certo é (32 ÷ 600) × 10⁶. Como está, a conta dá 2 × 10⁻¹², e não 2,00.
  - Na prova cederj, também "2,40 × 10⁻³/600 × 10⁶ = 4,00 ppm" tem o 10⁶ embaixo.
  - "(80 × 10⁻⁶)/137,3 × 10⁻² ≈ 5,8 × 10⁻⁹" sai como 80 × 10⁻⁶ sobre "137,3 × 10⁻²". Isso dá 5,8 × 10⁻⁵. No dado, o parêntese já fechava o numerador e o 10⁻² multiplica depois.
- Onde: `app/src/logica/fracao.ts`, leitura de notação científica no denominador (commit `b64bec7b`).
- Como corrigir: só ler "b × 10ᵐ" como um número inteiro no denominador quando:
  - o numerador também for notação científica ("a × 10ⁿ" sem parêntese);
  - e b estiver entre 1 e 10, que é a mantissa da notação científica.
  Assim "600 × 10⁶" e "137,3 × 10⁻²" ficam de fora. Acrescentar testes com estas três linhas.
- Das 79 frações com "× 10" mudadas pelo W3, só estas três dão valor errado. As outras conferem com o resultado escrito depois.

### Y2. Função antes do número: "sen", "cos" ou "θ" fica no lugar errado da fração
- **ERRO** (conta empilhada que o aluno lê com outro valor). Já existia antes da passada 5.
- Telas vistas:
  - mat P5943cbb6, animação, passo 3, a 1280 claro: "f(9) = sen 3π/2 = −1" sai como "sen 3π" sobre "2". O aluno lê (sen 3π)/2, que vale 0, e não −1. O mesmo acontece com "g(9) = sen π/2". Print `r5-qc-anim-mat-P5943cbb6-1280-claro.png`.
  - mat P8af6b4ab, passo 1, texto: "A tangente de 2θ é sen 2θ/cos 2θ" sai como "sen 2θ" sobre "cos 2", com o "θ" fora da fração. Print `r5-qc-anim-mat-P8af6b4ab-1280-claro.png`.
  - M10 "Ângulos notáveis", "No caderno": "30°: sen 1/2" sai como "sen 1" sobre "2", e "60°: … cos 1/2" sai como "cos 1" sobre "2".
- No detector, o mesmo acontece em:
  - M10.4 e M10.5: "cos 3π/4", "sen 7π/6" e "sen 2π/3";
  - M16.2: "cos 5π/4" e "sen 5π/4";
  - M10.2: "8 · sen 75°/sen 60°" com o "°" fora.
- Onde: `fracao.ts`. O nome da função entra no numerador junto com o primeiro número. A letra ou o grau que vem depois do denominador não entra nele.
- Como corrigir:
  - quando a barra vem logo depois de "sen/cos/tg + número·π" sem parêntese, a fração é o argumento: "sen (3π/2)";
  - "sen 1/2" depois de um rótulo de ângulo é "sen = 1/2";
  - o denominador deve levar a letra ou o "°" que vem colado a ele;
  - de preferência, escrever "sen(3π/2)" nos dados.

### Y3. Palavra vira numerador
- **ERRO** (numerador errado). Já existia antes da passada 5.
- Telas vistas:
  - quí P23cb376, animação: "a expressão fica x ao quadrado ÷ C = K" sai como "quadrado" sobre "C", e se lê "x ao (quadrado/C)".
  - quí P1dfb107, "Por que as outras": "(2 × 10⁻⁴) ao quadrado ÷ 0,02" sai como "quadrado" sobre "0,02".
- No detector, o mesmo acontece em:
  - Q04.1 P0229d63: "7,2 × 10¹⁷ átomos ÷ 6,0 × 10²³", com "átomos" sozinho em cima;
  - M11.3: "(distância ao vértice ÷ h)²", com só "vértice" em cima;
  - M04.5 810f54c4, no campo "cuidado": "5 ÷ preço antigo", "não ÷ novo" e "nem ÷ média". Este campo não apareceu na correção.
- Onde: `fracao.ts`. O termo da esquerda de "÷" e "/" aceita uma palavra solta.
- Como corrigir:
  - não aceitar como numerador uma palavra comum depois de "ao", "não" ou "nem", nem uma unidade depois de número;
  - nesses casos, deixar na linha ou reescrever o dado como "x²/C" e "(6 × 10⁻⁴)²/0,02".

### Y4. Frações de conta que continuam na linha (casos de fronteira)
- **ERRO** ("Fração sempre empilhada").
- Na tela: fís P8be725f1, animação, passo 2. "tTerra/tLua = gLua/gTerra" sai inteiro na linha, com marcador de lista e duas barras, a 390 e a 1280, nos dois temas. Print `r5-qc-anim-fis-P8be725f1-1280-escuro.png`.
- No detector, ficam na linha:
  - **Razões com variável de índice escrita com "_":**
    - "η = P_útil/P_total" (Física, teoria);
    - "sen θL = n_casca/n_núcleo" (F09.4);
    - "P_lâmpada/P_total = R_lâmpada/R_total" (F11.5);
    - "tamanho_img/dist_img = tamanho_obj/dist_obj" (F09.1);
    - "p_janela/p_tímpano = (F_janela/F_tímpano) × (A_tímpano/A_janela)" (F07.1);
    - "tg θ = B_eletroímã/B_Terra" (F12.1).
  - **Parêntese de um lado, depois de "=":**
    - "variação = (novo − antigo)/antigo" (M03.1 e M07.1);
    - "IMC = massa/(altura)²" (M05.1);
    - "luminância = intensidade/(distância)²" (M02.1);
    - "meses = investimento/(economia por mês)" (M02.2);
    - "h = (cateto · cateto)/hipotenusa" (M09.4);
    - "tg β = (15 − lado)/lado" (M10.1).
  - **Palavras com espaço, dos dois lados do "=":**
    - "altura do poste / sombra do poste = altura do estudante / sombra do estudante" (M09.3);
    - "tamanho da imagem / tamanho do objeto = distância da imagem / distância do objeto" (F09.5);
    - "E = desenho / real" e "média mensal = total / número de meses" (Matemática, teoria).
  - **Razão sem "=" antes (de propósito no X1):** "a razão B/A é comprimento/tempo" (fís P55cd34e9, na tela), "razão lucro/custo" e "razão carga/massa".
- Alguns desses campos ("formulas") não aparecem na correção. Conferi na tela só o P8be725f1 e o P55cd34e9.
- Onde: `fracao.ts`, `opEsq`/`opDir`. Não aceitam "_" nem termo com parêntese de um lado só, quando há "=".
- Como corrigir:
  - aceitar identificador com "_índice" (de preferência, trocar por índice Unicode nos dados);
  - aceitar "(…)/palavra" e "palavra/(…)" quando há "=" na linha;
  - decidir se razão de palavras sem "=" empilha.

### Y5. Separador "|" na animação parece barra de divisão
- **ERRO** (leitura da conta).
- Tela: mat P5943cbb6, linha de resumo dos passos 1, 2 e 3, a 1280 claro.
- O que está: na letra Caveat, o separador "|" sai inclinado, igual a "/". O aluno lê:
  - "11π/2 / (1 − 9/2)π";
  - "3π/2 / −7π/2 + 4π";
  - "(sen 3π)/2 = −1 / sen π/2 = 1"
  como divisões. Print `r5-qc-anim-mat-P5943cbb6-1280-claro.png`.
- Onde: motor da animação (`app/src/ui/`, linha que junta as contas do passo com " | ").
- Como corrigir: trocar o "|" por um espaço largo com ponto médio, ou desenhar o separador como traço vertical (borda), não como letra da fonte.

Total: 5 ERROS, 0 DECISÕES DO DONO
