# Revisão do site, 21/11/2026 (3ª rodada, 10ª passada): correção de B1–B3

Revisor novo e independente. Só li, medi e escrevi; não corrigi nada. Site em http://localhost:4191 (build de 22/11 13:34, depois do último commit de código `61f7bd9e`; HEAD `5586146a`), login em modo de demonstração.

Escopo: B1–B3 de `questao-correcao-9.md`, as correções descritas em `correcao-A1-A4.md` (A1–A5 e B1–B3), se A1–A4 continuam valendo, e efeito colateral numa amostra nova.

## Como medi

**Na tela.** Playwright, Chromium, `deviceScaleFactor` 1, velocidade 2×, resposta A, "Assistir resolução" até o botão virar "De novo" (todos os passos até o fim). Prints na pasta de rascunho `scratchpad/passada10/` (fora do repositório).
- **10 resoluções citadas, animadas até o fim nas 8 combinações** (390, 768, 1280 e 1440 px, claro e escuro): mat Pc9132e4a, P476c4b22, Pf7605a63, P13525e2d, P5be7ca9e; bio P85452565; quí P16af84a2, P4f99343f, Pf90acda4; fís Pce134e95.
- **Mais 24 resoluções**, animadas até o fim a 1280 claro e a 390 escuro, e com "Ver sem animação" nas outras 6 combinações:
  - amostra aleatória nova (semente 20261122, só questões de prova com 3 passos ou mais, fora das 28 da passada 9): bio Pd1bcc660, Pba6766ee, P59034eb9, Pe50301ac; quí P854923a9, Peb5ea8ca, Pd859d1b, P0d56efd8; mat P146f445c, Pc5ea91de, P7c100bf7, Pfe4c03f6; fís P0729a463, P41dcc9b8, Pa0724c9a;
  - 4 que o B1 mudou: mat Pf994201f, Pa153d593; fís P5a001974; bio Pa1a2d61e;
  - 5 que o B2/B3 mudou: quí Pf2101c1e, Pe28a5b82; mat Pfe3cc0ba, P4abfc5e2; fís P9ba33c4c.
- **Resultado nos 272 renders:**
  - toda animação chegou ao fim;
  - nenhuma rolagem lateral; nenhuma linha, nota ou frase fora da folha (só 1 px do "→" em mat Pf994201f a 390, que não se vê);
  - nenhum erro de console;
  - o texto de cada resolução é o mesmo nas 8 combinações;
  - nenhuma sequência de 2 ou mais linhas só de número;
  - fração na linha só em unidades ("kJ/mol", "mg/100 g", "mol/L") e num título de passo (C3).

**Por script.** Para saber se cada achado é novo, rodei com `vite-node` o `montaRoteiro` de `797fcdfe` (antes de B1–B3) e o de agora nas resoluções com problema. Também contei nos dados os casos de C3 e C4.

## 1. Itens da passada anterior

| # | Item | Situação | O que vi agora |
|---|---|---|---|
| A1 | Linha do quadro repetida | **continua resolvido** | mat P476c4b22 ("2016: A/1,28 ≈ 0,781A «áreas»"), bio P85452565, quí P16af84a2: sem repetição. |
| A2 | Nota ou linha no lugar errado | **continua resolvido nos casos citados** | mat Pf7605a63 ("mediana" no passo 3); mat P13525e2d; fís Pce134e95 ("atrito = µ × N" antes da tabela); quí P4f99343f (nota do IV no passo 4). Outros casos na amostra: C2. |
| A3 | Lista de valores virava coluna | **continua resolvido** | quí Pf90acda4: "pH: 4,0; 3,6; 2,5 → todos < 7 → caráter ácido" numa linha, nas 8 combinações. |
| A4 | Frase cortada a 390 | **continua resolvido** | mat P5be7ca9e, passo 5, a 390 claro e escuro: dentro da folha. |
| B1 | Tabela com " ; " entre registros | **resolvido** | mat Pc9132e4a, passo 1, nas 8 combinações: "Alice: V 1; E 2; D 1 «linha de Alice»" … "Elias: V 0; E 2; D 2 «único sem vitória»", um jogador por linha, cada nota na linha dele. bio Pa1a2d61e e mat Pf994201f também ficaram um registro por linha. Efeito pequeno quando os campos são relações: C4. |
| B2 | Linha do quadro com outras palavras entra repetida | **resolvido nos casos citados; continua em outras resoluções (C1)** | Sem repetição: quí Pf90acda4 ("Mg" só no passo 2), quí P16af84a2 (nota "alternativa C" no passo 3, na linha do II), fís Pce134e95, quí Pf2101c1e (passo 5 só com a equação), mat Pfe3cc0ba, quí Pe28a5b82, mat P4abfc5e2. Ficam, como o relatório da correção já diz: mat P9c957c10 ("GB"), mat P5be7ca9e e Pb28d85a4. |
| B3 | fís P9ba33c4c, nota "decai com 1/d" em linha repetida | **resolvido** | Passo 2: "… d = 2r: V = (k · Q/r)/2 «como carga pontual; decai com 1/d»"; passo 4 só "d > r: V decai com 1/d". |
| B4 | Nota que repete a linha; par desenhado de dois jeitos | **igual (não piorou)** | quí P16af84a2 "direita: 2 mol «esquerda; direita»"; bio P85452565 "IBi «metade de cada»". Na amostra, mais do mesmo tipo: fís P9ba33c4c "… patamar constante, V > 0 «patamar constante»", mat Pfe3cc0ba "IV: mulheres em binge … «mulheres em binge»", bio Pba6766ee passo 3 ("ii rr (O Rh⁻)" em caixa cinza, abaixo do diagrama do cruzamento). |
| B5 | Listas numa linha só, difíceis de ler | **igual** | mat P13525e2d, passo 1: o mesmo texto da passada 9. |
| B6 | Aspas retas e curvas | **igual** | mat P5be7ca9e, passo 3, C com aspas retas. |

## 2. Achados

### C1. Linha do quadro que repete a conta ainda entra em várias resoluções (resto do B2)
- **ERRO** (o aluno lê a mesma conta duas vezes, às vezes com arredondamento diferente, e a nota e o marca-texto vão para a linha repetida). Já existia: todos os casos abaixo dão o mesmo roteiro com o motor de `797fcdfe`. A regra `parecida` do B2 não pega estes, porque a linha do quadro é um pedaço da conta (menos números) ou troca o rótulo.
- Na tela, a 1280 claro e a 390 escuro (o texto é igual nas outras combinações):
  - **mat Pf994201f**, passos 2 e 3: "(4,40 − 4,29)/4,29 = 0,11/4,29 ≈ 0,02564 → 2,56 %" e logo abaixo "0,11/4,29 ≈ 0,0256 → 2,56 % «dividir pela base»". O mesmo no passo 3 com 0,06265 e 0,0626. Dois arredondamentos para o mesmo número. Print `mat-Pf994201f-390-claro-tudo.png`.
  - **mat P146f445c**, passo 2: depois de "(32 − 6c)² − 4 · 25 · (c² − 48) = 0 → −64c² − 384c + 5824 = 0 → c² + 6c − 91 = 0" vem "(32 − 6c)² − 100(c² − 48) = 0 «quadrado perfeito em y»". A linha é uma passagem do meio da conta, escrita depois do fim. O marca-texto do passo fica no "0" dessa linha, e não em "c² + 6c − 91 = 0". Print `mat-P146f445c-1280-claro-anim.png`.
  - **quí Peb5ea8ca**, passo 3: "C = (2,70 × 10⁻³ mol)/(3,4 × 10⁻³ L) ≈ 0,79 mol/L" e depois "C = (2,70 × 10⁻³ mol)/(0,0034 L) ≈ 0,79 mol/L «divide pelo volume final»".
  - **fís P41dcc9b8**, passos 1 e 2: "A: P − NA = m v²/R «resultante para baixo»" e depois "A: centro para baixo → P − NA = m v²/R → NA < P «topo»". O mesmo para B no passo 2.
  - **mat P7c100bf7**, passo 1: "… → soma 840 → média 120" e depois "840/7 = 120 «média»".
  - **bio Pba6766ee**, passos 1 e 2: "O Rh⁺ com mãe Rh⁻ (rr) → ii Rr" e depois "homem: ii Rr «O Rh⁺ com mãe Rh⁻»"; o mesmo com "mulher: ii rr". Print `bio-Pba6766ee-1280-claro-anim.png`.
  - **mat P13525e2d**, passos 1 e 2: "centrais: 24,50 e 24,80 «4.º e 5.º de 8 valores»" no passo 1, e o passo 2 diz "8 valores → 4.º = 24,50 e 5.º = 24,80".
  - **mat Pb28d85a4**, passo 1: "2020: 47,3" e "2021: 52,3" na lista, e depois "mulheres: 2020 = 47,3" e "2021 = 52,3 «ler os dois pontos da linha tracejada»".
- Em 15 resoluções da amostra aleatória, 5 têm esse defeito.
- Provável causa: `montaRoteiro` (`motorConta.ts`). A linha do quadro só deixa de entrar quando casa com a conta pelo texto, pelos pedaços, pelos valores em ordem ou pela regra `parecida` (mesmos números, no máximo um a mais). Quando ela tem **menos** números que a conta (é um trecho dela) ou é a mesma relação com outro rótulo ("homem:" × "→"), entra como linha nova.
- Sugestão:
  - não mostrar a linha do quadro se todos os números dela (fora 0 e 1) já estão, na mesma ordem, numa conta do mesmo passo ou do passo anterior; a nota vai para essa conta;
  - comparar números arredondados ("0,0256" = "0,02564" com menos casas);
  - para a mesma relação com outro rótulo ("homem: ii Rr" × "→ ii Rr"), comparar o lado direito do último "→" ou ":".

### C2. Linha do quadro entra no passo errado, depois da conclusão ou no passo de outro item
- **ERRO** (a linha e a nota explicam outra coisa que não a do passo; o aluno lê a conclusão e depois uma conta solta). Já existia: os casos dão o mesmo roteiro em `797fcdfe`.
- Na tela, nas combinações vistas:
  - **mat P5be7ca9e**:
    - passo 5 ("Ligue à alternativa"): "j(1) = 0 → j(2) = −1 «j decresce»" vem depois de "as cinco afirmações de D são verdadeiras → alternativa D". É a prova do "j decrescente" do passo 4;
    - passo 2 ("Teste as simetrias"): "|x| ≥ 0 → |x| − 2 ≥ −2 «Im(g) = [−2, +∞[, não ℝ»" fica entre as simetrias. É o argumento da afirmação C, do passo 3.
  - **quí P0d56efd8**, passo 1 ("Julgue I e IV"): "137 = 137 + 0 «massa»". É a conservação da massa da equação do item II, que está no passo 2.
  - **bio Pba6766ee**, passo 4 ("Elimine C, D e E"): depois do E entra "Rr × rr → Rr; rr «½ Rh⁺ e ½ Rh⁻»", com o quadro de Punnett "Rr × rr" embaixo. É o cruzamento do passo 3 ("Cruze"). Print `bio-Pba6766ee-1280-claro-anim.png`.
  - **mat Pb28d85a4**, passo 4: "maior alta = 5,0 → C «conclusão»" fica no meio das letras, entre o D ("2012: …") e o B; depois dele vêm B, D (de novo) e E.
- Provável causa: a linha do quadro que não casa com nenhuma conta entra perto da vizinha do quadro que casou. Quando a vizinha está no último passo, ou o quadro está em outra ordem que os passos, ela cai depois da conclusão ou no passo de outro item.
- Sugestão:
  - não inserir linha do quadro depois da linha de conclusão de um passo ("→ alternativa", "→ C") nem no passo "Ligue à alternativa";
  - escolher o passo pelas palavras do "faz" e da linha (j × "j decrescente"; "massa" × equação nuclear; "Rr × rr" × "Cruze");
  - se não houver lugar claro, não mostrar a linha (a nota pode ir para a conta mais parecida).

### C3. Fração na linha no título do passo
- **ERRO** ("Fração sempre empilhada", CLAUDE.md; mesma classe que R2 da 2ª passada). Já existia; não vem de B1–B3.
- Na tela: fís P5a001974, passo 3, título "Calcule T/V em cada ponto", nas 8 combinações. Logo abaixo, no mesmo passo, "T0/V0" sai empilhado. Print `fis-P5a001974-1280-claro-anim.png`.
- O título passa por `comFracoes` (`ResolucaoAnimada.tsx:243`), mas `partesFracao("Calcule T/V em cada ponto")` não acha fração; `partesFracao("razão T/V")` acha.
- Alcance nos dados (títulos de passo com fração de letras ou números que fica na linha, fora unidades e rótulos): cerca de 16, por exemplo mat Pf7386fe5 "Calcule a/b²", Pe7d0a824 "Ache a fração AP/AC", P0d2bc88b "Some i/j…", P053636f4 "Calcule (ab)/c", P08bd1f74 "Calcule o quociente a/b"; fís P8f1936d9 "h/g", Pd2b4ad62 "isole D/R", P0361bb18 "r ∝ T^(2/3)", Pf2d6b161 "isole L/S", Pfb7662f6 "L/(k·A)", Pf452131d "V/T não muda", P6f60a2e4 "Troque λ por c/f", Pb6ec896d "q/m", P97432828 "Isole v/R".
- Provável causa: `fracao.ts` trata "Verbo X/Y" no texto corrido como palavra/palavra ("preço/massa", "e/ou").
- Sugestão: no título do passo, letra única (ou letra com índice, potência ou parênteses) dos dois lados da barra empilha; manter na linha só unidades, datas, rótulos e palavra/palavra. Cobrir com um teste a lista acima.

### C4. Registro com campos que são relações fica partido, um campo por linha (efeito do B1)
- **DETALHE** (a leitura está certa; a tabela não fica um registro por linha).
- fís P5a001974, passo 1, nas 8 combinações: "X: T = 2T0", "V = 2V0", "Y: T = 3T0", "V = 3V0", "Z: T = 3T0", "V = 2V0". As linhas do V ficam sem rótulo. Antes do B1 era pior ("V = 2V0 ; Y: T = 3T0" numa linha).
- Nos dados, só 4 contas têm esse formato: também mat P1ceeaf64 ("1990: aterro ≈ 15" / "total ≈ 18,5"), fís Pc2373321 ("fevereiro: máx. ≈ 29 °C" / "mín. ≈ 20 °C") e mat P6b2cea4d ("AP = 1 | PB = 2 ; BQ = 1 | QC = 2", em que um por linha está certo).
- Provável causa: `itensDaConta`, regra do B1 "a não ser que todos sejam relações".
- Sugestão: quando o registro começa por rótulo ("X:", "1990:", "fevereiro:"), juntar os campos com "; " mesmo que sejam relações ("X: T = 2T0; V = 2V0"); manter um por linha só quando não há rótulo (P6b2cea4d).

### C5. mat Pa153d593: "resto 0" desenhado de dois jeitos
- **DETALHE.**
- Passo 2: "1 −5 9 −7 2 → 1 −4 5 −2" e embaixo "resto 0" numa caixa cinza de texto. Passo 3 (mudou com o B1): "1 −4 5 −2 → 1 −3 2; resto 0", na mesma linha, à mão. Passo 4: "resto −1 ≠ 0" em linha própria. Print `mat-Pa153d593-1280-claro-anim.png`.
- Na mesma resolução, as linhas de coeficientes do Briot-Ruffini ("1 −5 9 −7 2") não têm separador; à mão, o "−" fica quase à mesma distância dos dois números.
- Sugestão: tratar igual a linha com um registro só e com vários ("… → 1 −4 5 −2; resto 0"); nos dados, separar os coeficientes ("1; −5; 9; −7; 2"), o que passa pelas lentes.

### C6. Índice que some num lado da fração e aparece no outro
- **DETALHE** (mesma classe do A5).
- fís P5a001974, passos 1, 3 e 4: "2T0", "3V0", e na fração "T0" em cima e "V₀" embaixo, com o 0 como índice só no denominador. O texto do passo 1 também diz "2T0" e "2V0".
- Sugestão: "T0"/"V0" depois de número ou sozinhos → "T₀"/"V₀", como já se faz no denominador.

### C7. "→" sozinho numa linha a 390
- **DETALHE.**
- mat P146f445c, passo 1, a 390 escuro (animação até o fim): "Δₓ = (cy − 3)² − 8(6y² − 4y − 2)", depois uma linha só com "→", depois "Δₓ = (c² − 48)y² + …". Nas outras contas a 390 o "→" fica no fim da linha de cima. Print `mat-P146f445c-390-escuro-anim.png`.
- Provável causa: `quebrasConta` quebra antes e depois do "→" quando a parte da direita não cabe.
- Sugestão: o "→" fica sempre colado ao fim da linha de cima.

### C8. " ; " com espaço antes, ao lado de "; " sem espaço
- **DETALHE.**
- mat Pa153d593 passo 5 "m(1) = 3 ; m(2) = 1 → máx = 3"; fís P41dcc9b8 passo 3 "NA < P ; NB > P"; fís P5a001974 passo 4 "… T0/V0 ; PZ = 1,5 · PX …". Nas outras linhas (inclusive as do B1) sai "; " sem espaço antes.
- Provável causa: o corte em " ; " do B1 só vale para linha com " | ".
- Sugestão: trocar " ; " por "; " em toda linha de conta (fora parênteses e colchetes, como "(V₀ ; P₀)").

Total: 3 ERROS (C1, C2, C3; todos já existiam antes de B1–B3), 5 DETALHES (C4 a C8), 0 DECISÃO DO DONO. B4–B6 continuam como pendências conhecidas, sem piorar.
