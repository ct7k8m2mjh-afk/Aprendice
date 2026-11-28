# Revisão do site, 21/11/2026 (3ª rodada, 2ª passada): questão, correção e simulados

Revisor independente. Só li, medi e escrevi; não corrigi nada. Site em http://localhost:4191 (build do commit `14147be9`; HEAD do repositório no momento da leitura: `d930d38d`), login em modo de demonstração.

Esta passada olhou só o que mudou e o que estava errado na 1ª passada: N1 a N7 de `questao-correcao.md` (N8 é decisão do dono), N1 de `dados.md` e R1 de `dados-2.md`.

## Como medi

**Detector de frações.** Rodei o próprio `app/src/logica/fracao.ts` (Node, sem build) com a matéria certa sobre todos os textos de `res/`, `revisao/` e `materia.json` das 10 matérias. Depois separei só os campos que aparecem na tela: passos, quadro, resposta, armadilha, erradas, pista, Teoria e revisão.

**Na tela.** Playwright, Chromium e `deviceScaleFactor` 1.
- 19 questões com a resolução animada rodando do começo ao fim, em velocidade 2×:
  - todas a 390 claro e a 1280 escuro;
  - 6 delas também a 390 escuro e a 1280 claro;
  - 2 de Biologia com genótipo (Ab/aB, AB/ab) a 390 escuro e a 1280 claro.
- 11 questões de Bio, His, Geo e Por, só a correção, a 1280 claro.
- Teoria:
  - mat P49729ace;
  - temas qui Q03 e Q09 e bio B07.
- Q06 da revisão essencial de Química, a 390 claro e a 1280 escuro.
- Simulado por conteúdo de Física e de Matemática, a 390 (claro e escuro), 768 escuro e 1280 escuro.

Prints e dados brutos (temporários) na pasta de rascunho da sessão: `r3b-qc-*.png` e `qc2/`.

**O que passou em tudo que medi:**
- As 50 execuções da animação chegaram a "Assistir de novo", com os controles sempre à vista.
- Nenhum erro de console ou de rede e nenhuma rolagem lateral.
- Frações que empilham como deviam:
  - fis P19eed56c;
  - mat P5cb97bb6, com `(x + 4)²/25 + (y − 3)²/9 = 1` na resposta e nos passos 3 e 4;
  - fís P5b8f3493, com a resposta e o passo 4 `(x₁ − x₀)²/(2ℓ²)`;
  - qui P13b1944f, com `27,1/164/3` em cadeia;
  - mat Pe922fcad;
  - mat Pb572cf81, com `20^(n−1)/27^n`;
  - mat P12f2c58e;
  - fís P4db22f5e, com `(k × F²/k²)/2`;
  - fís Pbc3a3190, com `(0,02)²/(9·10⁹)`;
  - qui Pd1cc7946 e qui P1d8392fe, com `PM/(RT)`.
- O que não é fração continua na linha:
  - unidades: `m/s`, `km/h`, `kJ/mol`, `R$ 0,30/kWh`, `g/L`;
  - pares: `Cu/Zn`, `Zn/Cu`, `Na⁺/K⁺`, `DNA/RNA`, `ATP/ADP`;
  - genótipos: `Ab/aB` e `AB/ab`, na animação de bio P5f0662fa e Pc62c40f0;
  - anos, datas, leis e versos (ver R1 de dados-2 na tabela).

## 1. Itens da 1ª passada

| # | Item | Situação | O que vi agora |
|---|---|---|---|
| N1 | "L/g" na linha em fis P19eed56c | **parcial** | "4π² · L/g" agora empilha, nas 4 combinações (390 e 1280, claro e escuro). O marca-texto do passo 1 ("1,4 s") e o do passo 4 (pílula "aproximadamente 50 cm") estão inteiros. O do passo 2 continua em pedaços: ver R1. |
| N2 | Questão Aprendice sem teclado (Q06) | **resolvido** | Testado a 390 claro e a 1280 escuro. A tecla A marca (`aria-checked`) e libera "Conferir"; a tecla C troca a marcação. Tab entra no grupo; as setas para baixo e para cima andam e marcam, com `tabindex` itinerante. Enter confere e mostra "Por que eu errei". |
| N3 | Contraste da folha de respostas no escuro | **resolvido** | O número da casa respondida tem 5,73:1 em Física (`rgb(163,166,176)` sobre `rgb(72,34,6)`) e 5,64:1 em Matemática, a 390, 768 e 1280. A casa não respondida tem 5,02:1. |
| N4 | Toque de 44 px na barra do simulado | **resolvido** | A 390, claro e escuro, "Folha de respostas" (x 193) e "Sair" acertam nas 4 direções a 21 px do centro. O cronômetro começa em x 232 e não recebe o toque. |
| N5 | Seta solta no fluxo de qui Pfb275ecd a 390 | **resolvido** | A 390 (claro e escuro), a segunda cadeia também desce em coluna ("C≡N no anel de cima", seta para baixo, "nitrila"). A 1280 fica em linha. |
| N6 | Quebra entre a incógnita e o "≈" | **resolvido** | "T ≈ (29,3 − 21,0)/6 ≈ 1,4 s" fica num bloco só. A 390, a linha quebra depois da seta "→". |
| N7 | Fórmulas da Teoria de mat P49729ace | **resolvido** | As 3 igualdades saem em Caveat, inclusive "variação = (novo − antigo)/antigo". A mesma mistura de letras aparece na Teoria de Química, Q03: ver R9. |
| dados N1 | Grupo com expoente e potência na linha | **parcial** | Empilham: mat P5cb97bb6, fís P5b8f3493 (resposta e passo 4), mat P12f2c58e, fís P4db22f5e, fís Pbc3a3190, mat Pb572cf81 e qui P13b1944f (`27,1/164/3`). Pelo detector também empilham "Mm(ΔT − 100)/(Ke + Kc)", "p ÷ (p − 5)", "15° ÷ 15°/h" e "alcance ÷ tempo de voo". Continua na linha tudo o que tem a letra "ℓ": ver R2. |
| dados-2 R1 | Data, ano, lei, verso e sigla empilhados | **resolvido** | Conferido na tela, na linha: "(1884/1885)" (his P65b978f7); "2009/2010 e 2020/2021" (geo Pd93cad4b); "De 31/5 a 7/6" (por Pcca988f3); "PL 2.338/23" (por P5a934be7); "linhas 16/17" (por P1f501be8); "RJ/ES" (geo Pf968ffcc); "1a/1b" e "3a/3b" (bio Pf6a27ac5); "Rua 15 / E o progresso" (por P553e8c3b). No tema bio B07, nenhum "120/80" empilha. Nas 369 frações que o detector acha em Por, His, Geo, F/S e Ing, só sobra conta de verdade nos campos mostrados. |

## 2. Achados novos

### R1. O marca-texto do resultado ainda cai em pedaços quando o resultado tem fração
- **ERRO** (resto do N1; leitura do destaque).
- Tela: resolução animada, nas 4 combinações (390 e 1280, claro e escuro).
- Onde aparece:
  - fis P19eed56c, passo 2, "L = g · T²/(4π²)": um bloco baixo atrás do "g", outro atrás do "·" (com vão entre os dois) e um bloco alto atrás da fração. Prints: `qc2/z1.png` (1280 escuro) e `qc2/z2.png` (390 claro).
  - fís P5b8f3493, passo 4, "cos θ = 1 − (x₁ − x₀)²/(2ℓ²)": o "1 −" tem um bloco baixo e a fração tem um bloco alto separado. Print: `r3b-qc-anim-fis-P5b8f3493-1280-claro.png`.
- Onde no código: o destaque vai em cada peça (`.ra-marca` em `.ra-t` e `.ra-esp`), e não no trecho inteiro.
- Como corrigir: um só retângulo atrás do trecho marcado, da altura da peça mais alta (a fração).

### R2. Fração com "ℓ" continua na linha
- **ERRO** ("Fração sempre empilhada", CLAUDE.md; resto de dados N1).
- Tela: fís P5b8f3493, a 1280 claro e a 390.
- O que está:
  - Passo 1: "2π · √(m/k) = 2π · √(ℓ/g) → k/m = g/ℓ". O "m/k" e o "k/m" empilham, mas o "ℓ/g" e o "g/ℓ" saem na linha, lado a lado com os empilhados.
  - Passo 2: "(g/ℓ) · (x₁ − x₀)²". Passo 4: "(g/ℓ)".
  - Em "Por que as outras estão erradas", letra D: "o termo 2ℓ²/(x₁ − x₀)² cresce…". Print: `qc2/e1.png`.
- Alcance nos dados: 6 questões (Física 4, Matemática 2), por exemplo fís Pa69a4a3c "λ = 2ℓ/3", fís P6335eb04 "k₀Q/ℓ²" e mat P6f0e5f3e "a = ℓ/3".
- Onde no código: `app/src/logica/fracao.ts:41` e `:46`. As classes de letra de `TERMO` e `PRODUTO` (`[a-zA-Zα-ωπθΦ]`) não têm o "ℓ". Ele só entra como letra colada antes de uma raiz.
- Como corrigir: incluir o "ℓ" nas letras de `TERMO`, `PRODUTO` e `FUNCAO`, e cobrir com um teste ("√(ℓ/g)", "g/ℓ", "2ℓ²/(x₁ − x₀)²").

### R3. Barra entre fórmulas, espécies químicas e rótulos empilhada como fração em Química
- **ERRO** (texto falso: "Fração sempre empilhada" vale só para fração).
- O que está, visto na tela:
  - qui Pc829977e, passo 1 da animação: "3 O–H, 1 N–H e 2 C=O/P=O" sai como "C =", depois o "O" sobre o "P" e depois "= O". A 390 claro e a 1280 escuro. Print: `r3b-qc-anim-qui-Pc829977e-1280-escuro.png`.
  - qui Paf58a2c0, passo 1: "H₂O / CO₂ / Cl⁻" sai como "H₂", depois o "O" sobre o "CO₂" e depois "/ Cl⁻". A 390 e a 1280. Print: `r3b-qc-anim-qui-Paf58a2c0-390-claro.png`.
  - qui Paa8de177, quadro da animação: "ΔE° (O2/OH⁻)", par redox empilhado.
  - qui P395ba73c, "Por que as outras estão erradas", letra D: "o par (R)/(S)" com R sobre S.
  - Teoria do tema qui Q03 ("Ácido e base: três teorias"), caderno: "par conjugado: HA / A⁻" com HA sobre A⁻. O mesmo texto está em `revisao/resumos.json` (Q03.1). Print: `qc2/e3.png`.
- Onde no código:
  - `fracao.ts:59-61`: a regra da fórmula química só vale com dois ou mais símbolos, e "O" e "P" sozinhos passam.
  - `fracao.ts:214`: dois grupos entre parênteses ("(R)/(S)") viram fração sempre.
  - `divisoes()` (" / " com espaços): na passada sem sinal de conta, não reconhece espécie química.
- Como corrigir:
  - em Química, a barra entre símbolos químicos ou espécies com carga ("O2/OH⁻", "HA / A⁻", "C=O/P=O") fica na linha;
  - "(R)/(S)" e "E/Z" são rótulos e ficam na linha;
  - " / " entre fórmulas só empilha com sinal de conta;
  - teste com estes 5 casos.

### R4. "t½" partido: o "½" fica fora da fração
- **ERRO** (texto falso: a fração mostra outra conta).
- O que está:
  - qui Pd7109aee, passo 1 e quadro da animação: "t/t½ = (1,40 × 10⁹)/(7,05 × 10⁸)" sai como t sobre t, com o "½" solto depois da barra. Lido como está, dá "1 × ½". A 390 claro e a 1280 escuro. Print: `r3b-qc-anim-qui-Pd7109aee-1280-escuro.png`.
  - Teoria do tema qui Q09 ("Meia-vida"), caderno: "n = tempo ÷ t½" sai como "tempo" sobre "t", com o "½" solto. Na linha de baixo, "1 → ½ → ¼ → ⅛ → 1/16" mistura frações Unicode inclinadas na linha com o "1/16" empilhado. Print: `qc2/e4.png` (1280 escuro). O mesmo texto está em `revisao/resumos.json` (Q09.5).
- Onde no código: `fracao.ts`. O `TERMO` e o `SIMPLES` não aceitam "½" como índice da letra.
- Como corrigir:
  - tratar "t½" (letra com "½") como um termo só;
  - na lista do caderno, desenhar "½", "¼" e "⅛" empilhados como o "1/16".

### R5. Palavra solta ou pedaço do nome empilhado na divisão com "÷"
- **ERRO** (texto falso).
- O que está, visto na tela:
  - mat P4a70eda9, letra D e "A pegadinha": "esquecer o ÷ 2 da área" sai com o artigo "o" sobre o 2. Print: `qc2/e9.png`.
  - geo P40612968, passo 3 da resolução em texto: "US$ 37 mi ÷ US$ 60,2 mi" sai como "US$", depois "37 mi" sobre "US" e depois "$ 60,2 mi". O mesmo acontece em "US$ 71,4 mi ÷ US$ 330 mi". Print: `qc2/e8.png`.
  - geo P5b97aa7b, passo 4: "US$ 517,4 milhões ÷ US$ 366,3 milhões".
- Alcance nos dados:
  - "o ÷ 2", "o ÷ 3", "o ÷ 4", "um ÷ 14" e "do total ÷ 70": cerca de 31 questões (Matemática 25, Física 3, Geografia 2, Química 1). Por exemplo, mat P70a19f50 "Cada um ÷ 14".
  - O detector também corta nomes:
    - teoria do tema Q04 de Química: "massa (g) ÷ massa molar (g/mol)" vira "(g)" sobre "massa molar";
    - revisão de Matemática: "segmento correspondente ÷ segmento correspondente";
    - revisão de Matemática: "(expostos ÷ não expostos)" vira "expostos" sobre "não".
  - Esses três não foram abertos na tela.
- Onde no código: `fracao.ts`, `divisoes()`.
  - O operando com palavra (`PALAVRA_OP`, linha 360) e a letra solta de `SIMPLES` aceitam artigos e preposições ("o", "um", "do").
  - O operando da esquerda não leva o "US$" junto do número.
- Como corrigir:
  - artigo ou preposição nunca é numerador ou denominador;
  - valor com moeda ("US$ 37 mi") é um operando inteiro;
  - quando o nome da razão não cabe inteiro dos dois lados, a divisão fica na linha.

### R6. "0 / 0" do sinal de interação ecológica empilhado
- **ERRO** (texto falso: "0 sobre 0" parece uma conta indeterminada).
- Tela: bio P7e3a78a1, a 390 claro e a 1280 escuro.
- O que está:
  - "Por que eu errei", letra A: "X e Y crescem como sozinhas (0 / 0)", com 0 sobre 0. Print: `qc2/e5.png`.
  - Passo 4 da animação: "competição exige − / −, e X + Y dá 0 / 0", com o último par empilhado e os sinais "+ / +" e "− / −" na linha. Print: `qc2/e6.png`.
- Como corrigir: " / " entre sinais de interação (0, +, −) fica na linha; denominador zero nunca empilha.

### R7. Unidade empilhada na nota do passo
- **ERRO** (unidade não é fração).
- Tela: qui P08cd85a8, passo 4 da animação, nota ao lado da conta, a 390 claro e a 1280 escuro.
- O que está: "isole ΔE°; kJ vira J; J/C = volt" sai com J sobre C. Logo abaixo, a explicação diz "J/C dá volt" na linha. Print: `qc2/e7.png`.
- Onde no código: `fracao.ts:242`. Dois símbolos de unidade antes de "=" viram fração.
- Como corrigir: o par de unidades seguido de "= volt", "= ampère" ou de outro nome de unidade fica na linha.

### R8. Conta com rolagem interna a 390
- **ERRO** (conta cortada na largura do celular; a 1ª passada mediu 0 linhas com rolagem).
- Tela: mat Pe922fcad, resolução animada, a 390 claro e a 390 escuro. A 1280 está certo.
- O que está: "u × v = (1/3·(−1) − 0·1, 0·1/3 − (−1/3)·(−1), (−1/3)·1 − 1/3·1/3) → (−1/3, −1/3, −4/9)". A linha recebe `.ra-linha.conta.rola` e mostra só até "(−1". O resto exige rolar dentro da linha. Print: `qc2/e2.png`.
- Agora que as frações empilham, cada coordenada ficou mais larga.
- Como corrigir: quebrar entre as coordenadas do vetor (depois de cada vírgula de nível 1) antes de cair na rolagem.

### R9. Caderno da Teoria de Química mistura duas letras
- **ERRO** (`DESIGN.md`: fórmula do caderno em Caveat; a mesma peça com uma letra só; mesma regra do N7).
- Tela: tema qui Q03 (`#/m/qui/tema/Q03?aba=teoria`), cartão "Ácido e base: três teorias", a 390 claro.
- O que está:
  - Em Caveat: "Arrhenius: ácido → H⁺ (H₃O⁺); base → OH⁻", "Brønsted: ácido doa H⁺; base recebe H⁺" e "par conjugado: HA / A⁻".
  - Em Familjen pequena, como texto: "Lewis: ácido recebe par de e⁻; base doa".
  - Print: `qc2/e3.png`.
- Onde no código: `app/src/telas/Tema.tsx:37` (`formulaEhTexto` linha a linha).
- Como corrigir: decidir a letra pela lista inteira do caderno, e não linha a linha.

### R10. Número de massa na linha ("235U")
- **ERRO** (notação: o número de massa vai em cima, como nas outras resoluções).
- Tela: qui Pd7109aee, passo 3 da animação, caixa "235U em arma", a 390 e a 1280.
- Onde: dados, `app/public/conteudo/qui/res/Q09.5.json`, Pd7109aee, `passos[2].conta`.
- Como corrigir: "²³⁵U".

Total: 10 ERROS, 0 DECISÕES DO DONO
