# Revisão do site, 21/11/2026 (3ª rodada, 5ª passada): questão e correção

Revisor independente. Só li, medi e escrevi; não corrigi nada. Site em http://localhost:4191 (build novo, com os commits "passada 4 S1–S6" e "T1–T6"; HEAD `4c6d0c99`), login em modo de demonstração.

Escopo restrito: S1 a S6 de `questao-correcao-3.md` e efeito colateral das correções da passada 4 nas questões vizinhas. S7 é decisão do dono e ficou de fora. As cores novas de 22/11 (DESIGN.md) não foram tratadas como erro.

## Como medi

**Detector.** Rodei o `app/src/logica/fracao.ts` atual sobre todos os textos de `public/conteudo` (260 678 linhas com barra). Comparei com a mesma varredura feita antes da passada 4. Mudaram 2 033 linhas: Fís 891, Mat 294, Quí 42, Geo 3 e provas 803 (as mesmas resoluções, copiadas nos simulados). Não mudou nada em Por, His, Ing e Bio.
- Procurei nas linhas que mudaram:
  - fração com palavra comum dentro;
  - par de unidades, siglas e datas empilhados;
  - apóstrofo que fica fora da fração.
- Achei só frações de verdade, por exemplo "n_lente/n_meio", "T/T_Terra", "ΔH(fusão)/Tf" e os "AP/PB" de Menelau. A exceção é o U3.

**Na tela.** Usei Playwright, Chromium e `deviceScaleFactor` 1. Prints em `r4-qc-*.png` na pasta de rascunho.
- **6 resoluções animadas do começo ao fim** (velocidade 2×), nas 4 combinações (390 claro e escuro, 1280 claro e escuro), 24 execuções: mat Pd46353b6, fís P0a6b7f22, mat Pe9cd1f75, fís P29193ade, mat P7fea8b7c e fís P732427ed.
  - Todas chegaram a "Assistir de novo".
  - Os controles ficaram sempre à vista.
  - Nenhuma linha passou da folha ou ficou com rolagem.
  - Fora unidades ("kg/C"), nenhuma barra ficou na linha.
- **25 questões só com a correção**, a 1280 claro e a 390 escuro:
  - Fís, Mat, Quí e Bio: P6335eb04, P8d52a008, P37451010, P4d88d6f7, Pca19482b, P41db795f, Pba9549df, P08cd85a8, Paf58a2c0 e P7e3a78a1;
  - Geo: P3adaa388, P18b11cbb, P86726448 e Pcc009a2f;
  - Por: P64f920a1 e Pf4b7ce7f;
  - His: P5d3ce9ce, Pc33f6973, P8e242b1d e P8468fbb5;
  - Ing: Pe7abdf75, P9fdc07b6, P74d72822, P283de0e7 e Pda3a4964.
- Em todas as execuções: nenhum erro de console ou de rede e nenhuma rolagem lateral.

**Texto comum continua na linha:**
- "e/ou": geo P86726448 e ing Pe7abdf75;
- leis "14/1973" e "20/1974";
- datas "1/9/1939" e "3/9" (his P8e242b1d);
- "medo/desinformação" (his Pc33f6973) e "amor/ódio", "fácil/difícil" (por P64f920a1);
- "a/as" (por Pf4b7ce7f);
- "Urgency/Emergency", "teaching/learning" e "who/which/that" (ing);
- "kg/C" e "g/C" em texto corrido.

**Conta em His e Geo continua empilhada:** "6.000 ÷ 1.000" (his P5d3ce9ce), "4,49/80,36" e as outras regiões (geo Pcc009a2f), "10° ÷ 5" (geo P18b11cbb).

## 1. Itens da passada anterior

| # | Item | Situação | O que vi agora |
|---|---|---|---|
| S1 | Denominador entre colchetes na linha | **resolvido** | mat Pd46353b6, passo 3 e quadro: "(√3 + 1)²/[(√3 − 1)(√3 + 1)]" empilha, com o colchete inteiro embaixo, a 390 e a 1280, claro e escuro. Nada vaza da folha. |
| S2 | "ℓ" com algarismo e "k₀Q/ℓ²" na linha | **resolvido** | fís P0a6b7f22, passos 3 e 4: "ℓ₂/ℓ₁ = P₁/P₂" e "ℓ₃/ℓ₁ = P₁/P₃" empilham, com o índice como índice. fís P6335eb04: todos os "k₀Q/ℓ²" de "Por que as outras estão erradas" empilham, também o da letra C. |
| S3 | "c/0" na linha | **resolvido** | fís P8d52a008, letra E e passo 3: "velocidade c/0, infinita" empilha. O "0 / 0" ecológico de bio P7e3a78a1 continua na linha. |
| S4 | Fração com grau em cima na linha | **resolvido** | geo P3adaa388: "360°/24 h" empilha. mat Pe9cd1f75: "sen(180°/n)" e "180°/n = 30°" empilham na animação e no texto. |
| S5 | Fração de letras no meio da frase | **parcial** | Empilham: "AB/(A + B)" (fís P37451010), "m³g²/(q²B²)" (fís P4d88d6f7, resposta e letras), "T′/T" (fís P29193ade), "A△/A□" (mat P7fea8b7c) e "fica só m/q" (fís P732427ed). Na mesma questão P4d88d6f7 ainda ficam na linha "mg/(qB)" e "2mg/(qB)": ver U1. |
| S6 | Marca-texto sem fração em pedaços | **resolvido** | fís P0a6b7f22, passo 2: "ℓ₁ é o maior" tem um só marca-texto contínuo (`.ra-marca-l`), sem vãos e com o "₁" como índice. Print ampliado: `r4-qc-z-l1.png`. Nas 6 animações, cada linha marcada tem um único bloco de marca-texto. |

## 2. Achados novos

### U1. "mg/(qB)" continua na linha em "Por que as outras estão erradas"
- **ERRO** ("Fração sempre empilhada"; resto do S5).
- Tela: fís P4d88d6f7, "Por que as outras estão erradas", a 1280 claro e a 390 escuro.
- O que está:
  - na B, "daria v² = (4/3)·(mg/(qB))²": o "4/3" empilha e o "mg/(qB)" fica na linha;
  - na C, "daria v = 2mg/(qB)", na linha, logo depois de "2m³g²/(q²B²)" empilhado;
  - na D, "(1/2)·(mg/(qB))²", igual à B.
- Print: `r4-qc-z-mg.png`.
- Onde: `app/src/logica/fracao.ts`. Letras juntas sem expoente ("mg") antes de um denominador entre parênteses, no texto corrido, não entram como termo.
- Como corrigir: aceitar um grupo de letras (com coeficiente) sobre "(…)" no texto corrido de Mat, Fís e Quí, como já acontece com "AB/(A + B)". Acrescentar um teste com "2mg/(qB)".

### U2. Razão de razões "(n/V)₂/(n/V)₁" toda na linha
- **ERRO** ("Fração sempre empilhada"). Não vem da passada 4: a varredura de antes dava o mesmo.
- Tela: fís Pca19482b, passo 1 da animação e quadro, a 1280 claro. Também na prova copiada nos simulados.
- O que está: "(n/V)₂/(n/V)₁ × R = (P₂/P₁) × (T₁/T₂) × R". As duas frações da direita empilham. A da esquerda (razão entre duas razões com índice depois do parêntese) fica na linha, com três barras inclinadas. Print: `r4-qc-z-nv.png`.
- Onde: `fracao.ts`. Um parêntese seguido de índice ("(…)₂") não é aceito como termo da barra.
- Como corrigir: aceitar "(…)" com índice ou expoente como termo. O ideal é empilhar a razão de fora, com "(n/V)₂" em cima e "(n/V)₁" embaixo, e as de dentro também empilhadas.

### U3. "R''" partido: um apóstrofo fica fora da fração
- **ERRO** (fórmula errada na tela). A passada 4 mudou este caso (antes os dois apóstrofos ficavam fora), mas ele continua errado.
- Tela: fís Pdba47980, passo 4 da animação (a mesma resolução aparece na prova acafe-2024-verao), a 1280 claro.
- O que está: o dado é "750 = 110²/R'' → R'' = R/4". Na tela sai a fração "110² sobre R′" seguida de um apóstrofo solto fora da fração. Assim o aluno lê "(110²/R′)′" em vez de "110²/R″".
- Onde: `fracao.ts`. O denominador aceita um só apóstrofo.
- Como corrigir:
  - aceitar dois apóstrofos seguidos (ou o sinal ″) no fim do denominador e do numerador;
  - de preferência, escrever "R″" nos dados;
  - acrescentar um teste com "110²/R''".

Total: 3 ERROS, 0 DECISÕES DO DONO
