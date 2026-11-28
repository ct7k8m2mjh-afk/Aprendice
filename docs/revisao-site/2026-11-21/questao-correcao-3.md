# Revisão do site, 21/11/2026 (3ª rodada, 4ª passada): questão e correção

Revisor independente. Só li, medi e escrevi; não corrigi nada. Site em http://localhost:4191 (build de 22/11 04h25, com o commit `312cbe9c`; HEAD do repositório no momento da leitura: `e3d1f7d2`), login em modo de demonstração.

Escopo restrito: R1 a R8 e R10 de `questao-correcao-2.md`, N3 de `passada-3.md` e efeito colateral do detector de frações (commits de `fracao.ts`, `motorConta.ts`, `Fracao.tsx` e `ResolucaoAnimada.tsx` desde `bdda2f7e`).

## Como medi

**Detector.** Rodei o `app/src/logica/fracao.ts` atual e o de `bdda2f7e` (antes das correções) sobre todos os textos de `res/`, `revisao/` e `materia.json` das 9 matérias. 190 campos mudaram (Mat 59, Fís 43, Quí 83, Bio 3, Geo 2); li todos. Depois listei, nos campos que aparecem na correção (passos, quadro, resposta, armadilha, erradas, pista), as barras que continuam na linha.

**Na tela.** Playwright, Chromium e `deviceScaleFactor` 1.
- 17 questões com a resolução animada rodando do começo ao fim (velocidade 2×), 46 execuções:
  - todas a 390 e a 1280 (390 claro com 1280 escuro, ou 390 escuro com 1280 claro); 3 delas nas 4 combinações;
  - fís P5b8f3493, mat Pe922fcad e qui Pd7109aee também a 768 claro e 1440 escuro.
- 24 questões só com a correção (Mat, Fís, Quí, Por, His, Geo), a 1280 claro e a 390 escuro.
- Teoria de Química: temas Q03, Q04, Q08 e Q09, a 390 e a 1280, claro e escuro.

Prints na pasta de rascunho da sessão: `r3c-qc-*.png`.

**O que passou em tudo que medi:**
- As 46 execuções da animação chegaram a "Assistir de novo", com os controles sempre à vista. Nenhuma linha com rolagem interna ou passando da folha.
- Nenhum erro de console ou de rede e nenhuma rolagem lateral, em nenhuma largura.
- Texto comum continua na linha: "e/ou" (geo P86726448), "14/1973" e "20/1974" (lei), "amor/ódio" e "fácil/difícil" (por P64f920a1), "a/as" (por Pf4b7ce7f), "m/v", "mol/L·s", "kg/C" e "g/C".
- Conta em Por, His e Geo continua empilhada: "6.000 ÷ 1.000" (his P5d3ce9ce), "4,49/80,36" e as outras regiões (geo Pcc009a2f), escalas de geo Pa2b20bce.

## 1. Itens das passadas anteriores

| # | Item | Situação | O que vi agora |
|---|---|---|---|
| R1 | Marca-texto em pedaços quando o resultado tem fração | **resolvido** | Um só retângulo, da altura da fração, atrás de "L = g · T²/(4π²)" (fís P19eed56c, passo 2) e de "cos θ = 1 − (x₁ − x₀)²/(2ℓ²)" (fís P5b8f3493, passo 4), a 390 e a 1280, claro e escuro. Sem fração, o marca-texto ainda cai em pedaços: ver S6. |
| R2 | Fração com "ℓ" na linha | **parcial** | Empilham: "√(ℓ/g)", "g/ℓ" e "(g/ℓ) · (x₁ − x₀)²" (fís P5b8f3493), "2ℓ/3", "4ℓ/5" e "4ℓ/n" (fís Pa69a4a3c) e o primeiro "k₀Q/ℓ²" de cada alternativa (fís P6335eb04). Ficam na linha "ℓ2/ℓ1" e "ℓ3/ℓ1" e parte dos "k₀Q/ℓ²": ver S2. |
| R3 | Barra entre espécies e rótulos empilhada em Química | **resolvido** | Na linha: "2 C=O/P=O" (qui Pc829977e), "H₂O / CO₂ / Cl⁻" (qui Paf58a2c0), "ΔE° (O2/OH⁻)" (qui Paa8de177), "o par (R)/(S)" (qui P395ba73c) e "par conjugado: HA / A⁻" (Teoria Q03). |
| R4 | "t½" partido | **resolvido** | "t/t½" empilha com o "½" no denominador (qui Pd7109aee, passo 1 e quadro). Na Teoria Q09, "n = tempo/t½" está certo, e "1 → ½ → ¼ → ⅛ → 1/16" sai todo empilhado. |
| R5 | Palavra solta ou pedaço de nome empilhado na divisão com "÷" | **resolvido** | Na linha: "o ÷ 2 da área" (mat P4a70eda9) e "Cada um ÷ 14" (mat P70a19f50). Empilham inteiros: "US$ 37 mi ÷ US$ 60,2 mi" e "US$ 71,4 mi ÷ US$ 330 mi" (geo P40612968) e "US$ 517,4 milhões ÷ US$ 366,3 milhões" (geo P5b97aa7b). Teoria Q04: "massa (g) ÷ massa molar (g/mol)" fica na linha, inteira. |
| R6 | "0 / 0" do sinal ecológico empilhado | **resolvido** | Na linha, em bio P7e3a78a1, nas 4 combinações: "(0 / 0)" em "Por que eu errei" (letra A) e "+ / +", "− / −" e "0 / 0" no passo 4. Efeito colateral: ver S3. |
| R7 | "J/C" empilhado na nota | **resolvido** | "isole ΔE°; kJ vira J; J/C = volt" e "J/C dá volt" na linha (qui P08cd85a8), a 390 claro e a 1280 escuro. |
| R8 | Conta com rolagem interna a 390 | **resolvido** | Em mat Pe922fcad, "u × v = (…)" quebra depois de cada coordenada, em 4 linhas, sem rolagem. Medido a 390 claro e escuro, 768 claro, 1280 escuro e 1440 escuro: 0 linhas com `.rola`. |
| R9 | Caderno da Teoria com duas letras | **resolvido** (fora do escopo, visto de passagem) | Q03: as 4 linhas em Caveat, a 390 claro e a 1280 escuro. |
| R10 | "235U" na linha | **resolvido** | "²³⁵U em arma" na caixa do passo 3 (qui Pd7109aee), a 390 e a 1280. |
| passada-3 N3 | Numerador com colchete e fatorial no denominador | **resolvido** | mat Pba9549df, letra C: "2·[1]/(4·[3]) = 2/12 = 1/6" sai com as 3 frações empilhadas. mat Pe02178b3, passo da animação: "40320/3! = 40320/6 = 6 720" empilha, a 390 escuro e a 1280 claro. Colchete no denominador ainda não: ver S1. |

## 2. Achados novos

### S1. Denominador entre colchetes fica na linha
- **ERRO** ("Fração sempre empilhada", CLAUDE.md; mesma família do N3 da passada 3).
- Tela: mat Pd46353b6, passo 3 da animação e quadro, a 390 escuro e a 1280 claro.
- O que está: "c = (√3 + 1)²/[(√3 − 1)(√3 + 1)] = (4 + 2√3)/2". A primeira fração sai na linha, com a barra inclinada; a segunda, logo ao lado, empilha. Print: `r3c-qc-anim-mat-Pd46353b6-1280-claro.png`.
- Não vem desta rodada: o detector de `bdda2f7e` faz o mesmo.
- Onde: `app/src/logica/fracao.ts` (`barras`). A correção do N3 ensinou o colchete só no numerador.
- Como corrigir: aceitar um grupo entre colchetes também no denominador, com teste ("(√3 + 1)²/[(√3 − 1)(√3 + 1)]").

### S2. "ℓ" com algarismo e parte dos "k₀Q/ℓ²" continuam na linha
- **ERRO** (resto do R2).
- O que está:
  - fís P0a6b7f22, passos 3 e 4 da animação, "Por que as outras estão erradas" (letra A) e quadro: "ℓ2/ℓ1 = P1/P2" e "ℓ3/ℓ1 = P1/P3". O "P1/P2" empilha e o "ℓ2/ℓ1" fica na linha, lado a lado. Print: `r3c-qc-anim-fis-P0a6b7f22-1280-claro.png` (1280 claro).
  - fís P6335eb04, "Por que as outras estão erradas". O primeiro "k₀Q/ℓ²" de cada alternativa empilha. Ficam na linha:
    - na A, "maior que k₀Q/ℓ² (√3 ≈ 1,73 vezes)";
    - na B, "vetores de módulo k₀Q/ℓ² com 60°";
    - a C inteira, "k₀Q/ℓ² é o campo de uma só carga".
  - Print: `r3c-qc-S-kq-1280c.png`.
- Onde: `fracao.ts`. O "ℓ" seguido de algarismo não é aceito como termo. "k₀Q/ℓ²" no meio da frase cai na regra que deixa fração de letras na linha (ver S5).
- Como corrigir:
  - nos dados, escrever o índice como índice ("ℓ₂/ℓ₁", como "P₁" já está);
  - no detector, aceitar "ℓ" com algarismo e o "k₀Q/ℓ²" também no meio da frase.
  - O "ℓ1" da animação também sai partido ("ℓ 1", com espaço), no passo 2: ver S6.

### S3. "c/0" voltou para a linha (efeito do R6)
- **ERRO** (efeito colateral; "Fração sempre empilhada").
- Tela: fís P8d52a008. "Por que as outras estão erradas", letra E, e a explicação do passo 3 da animação, a 390 escuro e a 1280 claro.
- O que está: "a luz teria velocidade c/0, infinita". É uma divisão de verdade (v = c/n com n = 0). O detector de `bdda2f7e` empilhava; o de agora deixa na linha. Print: `r3c-qc-S-c0-1280c.png`.
- Onde: `fracao.ts`, regra nova do R6 ("denominador zero fora de conta fica na linha").
- Como corrigir: limitar a regra do zero ao par de sinais ecológicos (0, +, − dos dois lados da barra, com espaços). Uma letra ou número sobre 0 continua fração.

### S4. Fração com grau no numerador fica na linha
- **ERRO** ("Fração sempre empilhada"). Não vem desta rodada.
- O que está, na tela:
  - geo P3adaa388, passo 2 da resolução em texto: "360°/24 h = 15° por hora", na linha. O mesmo texto com "÷" empilha. Print: `r3c-qc-S-grau-1280c.png`.
  - mat Pe9cd1f75, animação: "sen(180°/n)" e "180°/n = 30°" na linha, com "(2r)/(4r) = 1/2" empilhado ao lado.
- Nos dados há ainda, por exemplo, "360°/6 = 60°" (mat Pc784cb63) e "720°/3 = 240°" (mat Pd5b9e245).
- Onde: `fracao.ts`. O "°" no fim do numerador não é aceito na barra "/".
- Como corrigir: aceitar o "°" como fim do numerador, como já acontece com "÷".

### S5. Fração de letras no meio da frase continua na linha
- **ERRO** ("Fração sempre empilhada", em textos, fórmulas e animações). Não vem desta rodada.
- Visto na tela, a 1280 claro:
  - fís P37451010, "Por que eu errei" (letra C): "AB/(A + B) tem unidade de comprimento". Na mesma correção, "B/(2A)" e "2AB/(A² + B²)" empilham.
  - fís P4d88d6f7:
    - resposta: "Alternativa E — (1/2)·m³g²/(q²B²)". Só o "1/2" empilha. O mesmo vale para as letras B, C e D e para o passo da animação "E_c = … = (1/2)·m³g²/(q²B²)".
  - fís P29193ade, animação: "T′/T = (P′ × V′)/(P × V)". O lado direito empilha e o "T′/T" não.
  - mat P7fea8b7c, animação: "A△/A□ = √3/4". Só o lado direito empilha.
  - fís P732427ed, passo 2: na conta, "m/q" empilha; na explicação logo abaixo, "fica só m/q" sai na linha. Print: `r3c-qc-S-mq-1280c.png`.
- Onde: `fracao.ts`. Letra com expoente ("m³g²"), com apóstrofo ("T′"), com símbolo (△, □) e letras soltas em texto corrido não entram como termo.
- Como corrigir:
  - aceitar letras com expoente, apóstrofo e símbolo geométrico como termo quando o outro lado da barra também é termo de conta;
  - em Mat, Fís e Quí, empilhar letra/letra também no texto corrido, mantendo as exceções que já existem (unidades, pares, siglas).

### S6. Marca-texto sem fração ainda cai em pedaços
- **ERRO** (resto do R1: o destaque vai em cada peça).
- Tela: fís P0a6b7f22, passo 2 da animação, a 1280 claro.
- O que está: "P₁ = 3300 W → ℓ1 é o maior". O marca-texto tem 4 blocos com vãos: "ℓ", "1 é", "o" e "maior". Os blocos têm alturas diferentes, porque o trecho mistura Caveat e Familjen. O "ℓ1" sai como "ℓ 1". Print ampliado: `r3c-qc-zoom-l1.png`.
- Onde: `app/src/ui/ResolucaoAnimada.tsx` (`Linha`). O retângulo único (`.ra-marca-g`) só entra quando o trecho tem fração (`marcaUnica`).
- Como corrigir:
  - usar o retângulo único em todo trecho marcado com mais de uma peça;
  - escrever "ℓ₁" nos dados (ver S2).

### S7. Citação da prova empilhada
- **DECISÃO DO DONO** (texto da prova).
- Tela: his P78979201, passo 2 da resolução em texto, a 390 claro e a 1280 claro.
- O que está: a citação do texto da prova "tentei T2/D3. E funcionou! Essa razão é igual para todos os planetas!" sai com "T2" sobre "D3". A razão de Kepler é de fato uma fração, mas o trecho reproduz o texto da banca, que escreve "T2/D3" na linha (e sem expoente). Print: `r3c-qc-S-t2-390c.png`.
- Opções:
  - deixar a citação como a banca escreveu, na linha (marcar o trecho entre aspas como texto da prova);
  - ou manter empilhada.

Total: 6 ERROS, 1 DECISÃO DO DONO
