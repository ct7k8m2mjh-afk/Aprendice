# Revisão do site, 21/11/2026 (3ª rodada, 8ª passada): questão, correção e teoria

Revisor independente. Só li, medi e escrevi; não corrigi nada. Site em http://localhost:4191 (build com os commits da passada 7, Z1–Z3: `fcc5bcfa`, `70830002`, `bcdde3ca`; HEAD `9ee644f9`, que só muda o PLANO.md), login em modo de demonstração. As cores novas de 22/11 (fundo mais suave, cor nas matérias, título em destaque no escuro) não foram tratadas como erro.

Escopo restrito: Z1–Z3 (`questao-correcao-6.md`) e o que essas mudanças podem ter quebrado.

## Como medi

**Por script.**
- Tirei do git a pasta `app/src/logica` do commit `7e8ff1e5` (antes de Z1–Z3) e rodei com `vite-node` o `montaRoteiro` de antes e o de agora sobre todo o banco de Mat, Fís, Quí e Bio: 12 437 resoluções, 123 roteiros mudaram (Mat 50, Quí 44, Bio 15, Fís 14). Li todos.
- Em cada roteiro mudado procurei:
  - número perdido (contei os números de antes e de agora): nenhum;
  - "|" de separador que sobrou, no texto ou na nota: nenhum;
  - linha só de rótulo: nenhuma;
  - parêntese aberto sem fechar: só os intervalos "(1/2, 1]", que estão certos;
  - linha do quadro nova que repete o que a conta do passo já escreve;
  - nota ou linha que mudou de lugar.
- Conferi também o desenho de cada linha que ficou igual (diagrama, conta ou texto): nada mudou. O "[" de intervalo (Z2) não mexeu em nenhuma outra linha do banco.
- Rodei o `partesFracao` de antes e o de agora sobre todos os textos de `public/conteudo` (1,9 milhão de textos, todas as matérias, com e sem a opção "inteira"): 28 textos mudaram (56 com as duas opções). Li todos.

**Na tela.** Playwright, Chromium, `deviceScaleFactor` 1, velocidade 2×. Prints `r8-*.png` na pasta de rascunho (`scratchpad/r8/`).
- **12 resoluções animadas até o fim** ("De novo" na barra), a 1280 claro e a 390 escuro:
  - mat P756b978d, P47d11207, P9a5d64d9, Pc55df42c e P5be7ca9e;
  - quí Pa8675894, Paca34b46, Pf90acda4, Pad0b7767 e P03ff24db;
  - fís Pce134e95 e Pc0effe18.
- **As outras 6 combinações**, duas resoluções em cada:
  - 390 claro: P756b978d, Pa8675894 e P47d11207;
  - 768 claro: Paca34b46 e P9a5d64d9;
  - 768 escuro: P5be7ca9e e Pf90acda4;
  - 1280 escuro: Pad0b7767 e Pce134e95;
  - 1440 claro: P03ff24db e Pc0effe18;
  - 1440 escuro: Pc55df42c e Paca34b46.
- **Mais 8 animações até o fim, a 1280 claro**, para ver na tela os efeitos do Z1 achados no script: mat P476c4b22, Pc9132e4a, Pf7605a63, P13525e2d e P9c957c10; quí P4f99343f e P16af84a2; bio P85452565. E P5be7ca9e a 390 claro.
- **3 questões com a correção aberta** ("Por que as outras" aberto), a 1280 claro e a 390 escuro: fís Pabef4082 (marcando E), fís Pdd874c02 (marcando A) e mat Pc332c2b7.
- Em todas: a barra de controles ficou à vista; nenhuma rolagem lateral; nenhum erro de console ou de rede. Medi cada elemento da folha contra a borda dela: só P5be7ca9e passa da borda (A4).

## 1. Itens da passada anterior

| # | Item | Situação | O que vi agora |
|---|---|---|---|
| Z1 | Lista de valores do quadro virava coluna de números soltos e repetia a conta | **resolvido nos casos pedidos, com efeito colateral grande** | Na tela, nas combinações medidas:<br>- mat P756b978d: "1; 1; 4; 0  Briot-Ruffini com a = 3", numa linha (`r8-anim-mat-P756b978d-1280-claro.png`);<br>- quí Pa8675894: "Ca (Z = 20): 2; 8; 8; 2" e "Sr (Z = 38): 2; 8; 18; 8; 2";<br>- mat P47d11207: "200 − 40 = 160 «A»", "110 − 40 = 70 «B»"; o 70 não aparece antes do passo 4 (`r8-anim-mat-P47d11207-1280-claro.png`);<br>- mat P9a5d64d9, Pc55df42c, P359dcef8; quí Pad0b7767; fís Pce134e95 e Pc0effe18: a lista repetida saiu e a nota ficou na última linha do valor.<br>Nenhum número sumiu das linhas.<br>**Ainda repetem:** quí Pf90acda4, no passo 4, depois da conclusão: "lipídios: 0,54; 2,47; 3,61", "pH: 4,0; 3,6; 2,5 < 7" e "Mg: 70,0; 48,0; 23,0", que os passos 2 e 3 já escrevem (`r8-anim-qui-Pf90acda4-768-escuro.png`). E quí P03ff24db: "C1: H; NHCH3; CH2; C aromático → quiral", logo abaixo das mesmas quatro linhas.<br>**Efeito colateral:** cerca de 45 resoluções voltaram a ter uma linha do quadro repetida (A1), e em algumas a nota ou a linha foi para o lugar errado (A2). |
| Z2 | Rótulo de reação ia para a reação errada (quí Paca34b46) | **resolvido** | Passo 1, nas 4 combinações medidas (1280 claro, 390 escuro, 768 claro, 1440 escuro): "1) Mg: 0 → +2, H: +1 → 0", "3) Mg: 0 → +2, N: 0 → −3", "6) Mg: 0 → +2, O: 0 → −2". Cada rótulo com a sua reação (`r8-anim-qui-Paca34b46-390-escuro.png`).<br>"[" de intervalo: mat P5be7ca9e, passo 3, agora "C: 'imagem de g é ℝ' falsa, Im(g) = [−2, +∞[" e, na linha de baixo, "E: 'g linear' falsa".<br>No banco, essas duas são as únicas linhas de conta que mudaram. |
| Z3 | Letra com índice escrito como número ficava fora da fração | **resolvido** | Na tela, com a correção aberta, a 1280 claro e a 390 escuro:<br>- fís Pabef4082, "Por que eu errei" (E): "0,433 · ε0A sobre λ" e "0,5 · ε0A sobre λ" (`r8-corr-fis-Pabef4082-1280-claro.png`);<br>- fís Pdd874c02: A, "θ₃ = θ₁ sobre 4 = π sobre 720"; B, "θ₁ sobre 2 = π sobre 360" (`r8-corr-fis-Pdd874c02-390-escuro.png`).<br>O campo "essencial" ("C = ε0A/d") e o "caminhos" de mat Pc332c2b7 ("θ1 + θ1/2") não aparecem na correção (CLAUDE.md, 4 blocos). Conferi pelo script: "ε0A sobre d" e "θ1 sobre 2".<br>Os 28 textos que mudaram no banco estão todos com a leitura certa:<br>- "θ1/4", "θ1/2", "ε0A/λ", "ε0A/d";<br>- e, como bônus, "λ2/λ1", "λ5/λ6" e "B/λ1² − B/λ2²", que antes ficavam na linha. |

## 2. Achados novos

### A1. Z1: linha do quadro que o Y5 casava com a conta volta repetida (cerca de 45 resoluções)
- **ERRO** (linha repetida e nota fora do lugar; vem do Z1).
- O Y5 casava cada pedaço da linha do quadro com as linhas da conta do passo. Assim a linha não entrava de novo, e a nota ia para a última conta. Agora, uma linha em que nem todos os pedaços são relação ("1 100 | 681", "A(4, 0) | B(0, 2)", "IAIB | IBi") vira um texto só, com "; ". Esse casamento nunca é tentado, e a linha entra repetida, abaixo da conta que já a escreve. A nota sai da conta e vai para a linha repetida, e o marca-texto do passo também.
- Exemplos (antes ficavam só na conta, com a nota):
  - **mat Pc9132e4a** (lógica), passo 1: cinco linhas repetidas, "Alice: V 1; E 2; D 1 «linha de Alice»" … "Elias: V 0; E 2; D 2 «único sem vitória»", depois das 11 linhas que já mostram tudo. Print `r8-anim-mat-Pc9132e4a-1280-claro.png`;
  - **mat P476c4b22**: "A/1,35; A/1,45; A/1,28 «áreas»", logo abaixo de "2018: A/1,35…", "2017: A/1,45…" e "2016: A/1,28…". Print `r8-anim-mat-P476c4b22-1280-claro.png`;
  - **bio P85452565**, passo 2: "IAi × IBIB → IAIB", depois "IAIB; IBi «metade de cada»" e só então "IBi". A linha repetida parte o resultado do cruzamento ao meio. Print `r8-anim-bio-P85452565-1280-claro.png`. Igual em bio P40d9ac92: "Aa × AA → AA", "AA; Aa", "Aa (metade cada)";
  - **quí P707086a9**: "N2 + 3 O2 + H2 → 2 HNO3; −415 kJ «mantida»" e "2 HNO3 → N2O5 + H2O; +140 kJ «invertida»", repetindo a reação e o ΔH escritos na linha de cima;
  - **quí P16af84a2, P006b56e7 e P8f6262c8**: "gás: 1 + 3 = 4 mol; 2 mol «esquerda; direita»", depois de "esquerda: 1 + 3 = 4 mol" e "direita: 2 mol". Print `r8-anim-qui-P16af84a2-1280-claro.png`.
- Lista completa pelo script:
  - **Mat (24):**
    - Pc5100905, Pa88d059a, P476c4b22, Pe922fcad, Pbc1551f4, Pe6fe8ef2;
    - P7756854c, P5f58419f, P8b0952d5, Pc2943821, P3af453bc, Pd84b86bb;
    - P91ff5b07, Pa6655beb, P5db7db40, P48cddac5, P555cd856, P9c957c10;
    - Pfe3cc0ba, P6e7b4665, P3fbe983b, Pa429a328, Pc9132e4a, P97045b10.
  - **Mat, repetida em parte (3):** P2a454691, P5dcae1ce e P592ec81c.
  - **Fís (1):** P9ba33c4c.
  - **Quí (9):** P4ed54847, Pc9a1e7d4, P707086a9, P16af84a2, P006b56e7, P8f6262c8, P9f743be8, P395ba73c e P07a5e07e.
  - **Quí, repetida em parte (2):** P4f99343f e P8a81e98f.
  - **Bio (6):** Pc0ead898, P85452565, Pf57f13e8, P40d9ac92, P9bc66c39 e P6cfbf3b9.
- Somam-se a elas as duas que o Z1 não resolveu (quí Pf90acda4 e P03ff24db, tabela acima).
- Onde: `app/src/logica/motorConta.ts`, `montaRoteiro`. O casamento do Y5 (`const pq = pedacos(q.linha)` … `pq.length > 1`) usa `pedacos`, que agora junta a lista. E `valoresDaLista` só reconhece número puro, sem texto nem coordenada.
- Como corrigir:
  - no casamento com a conta, usar os pedaços crus (`partesBarra(q.linha)`), e não `pedacos`. A junção com "; " fica só para mostrar a linha que não casou;
  - incluir "∝", "↔", "⇔" e "∈" em `ehRelacao`. Assim "V ∝ 1/d | E ∝ 1/d²" (fís P9ba33c4c) volta a ser relação.

### A2. Z1: nota ou linha do quadro no lugar errado
- **ERRO** (a nota explica outra conta, ou a linha parte uma lista; vem do Z1).
- O casamento por valor (`porValor`) não avança a ordem das linhas seguintes do quadro. E a linha que não casa (A1) muda o ponto de inserção das vizinhas. Na tela, a 1280 claro:
  - **mat Pf7605a63**: a nota "mediana" foi para a conta da média, no passo 1: "… → x = 2,6  média; mediana". O passo 3, "a do meio: 5,2 → alternativa C", ficou sem nota. Print `r8-anim-mat-Pf7605a63-1280-claro.png`;
  - **mat P13525e2d**: no passo 1, "tempos em ordem crescente" fica no "24,80", o 5.º de 8. A linha "centrais: 24,50 e 24,80" entra no meio da lista ordenada, antes de "25,60", "26,50" e "26,50". Print `r8-anim-mat-P13525e2d-1280-claro.png`;
  - **fís Pce134e95**: "atrito = µ × N «normal constante»" entra no meio da tabela, entre "3,2%: 0,50" e "7,4%: 0,61". Print `r8-anim-fis-Pce134e95-1280-claro.png`, também a 390 e a 1280 escuro;
  - **quí P4f99343f**: a linha do item IV, "[Kr]4d10 5s2 5p2 → período 5; bloco p «IV: n máximo e último subnível»", foi para o passo 1, antes de julgar I e III. Antes, a nota ficava no passo 4 ("Localize o elemento da IV"), que agora não tem nota;
  - **fís P9ba33c4c**: "V ∝ 1/d; E ∝ 1/d²" aparece no passo 2, antes do passo 3 que a escreve. A nota "decai com 1/d" sai do passo 4 e vai para o passo 2;
  - **mat P9c957c10**: "topo" e "3.º a 5.º" saem de "China 91" e "Austrália 53" e vão para duas linhas repetidas no fim do passo. Print `r8-anim-mat-P9c957c10-1280-claro.png`;
  - **mat Pa429a328**: as duas notas da mesma linha se separam. "soma e produto" vai para uma linha repetida.
- Onde: `motorConta.ts`, `montaRoteiro`, laço `for (const q of quadro)` (`if (achou && !pv)`) e o passo 2, "o que não está na conta".
- Como corrigir:
  - resolver A1 já devolve a ordem de antes em todos esses casos, menos Pf7605a63 e P13525e2d;
  - nesses dois, o casamento por valor deve procurar os números na mesma ordem e no mesmo passo, e não "em qualquer ordem, deste passo em diante". Também deve avançar a ordem quando casa: em Pf7605a63, o 2,6 casou com o "x = 2,6" da média, e não com a lista de notas do passo 2.

### A3. A conta do passo com " | " ainda vira coluna de números soltos
- **ERRO** (leitura da conta). Já existia; não vem de Z1–Z3. O Z1 tratou só as linhas do quadro.
- Na tela: quí Pf90acda4, passo 3, a 768 escuro e a 390 escuro: "pH: 4,0", depois "3,6" sozinho e depois "2,5 → todos < 7 → caráter ácido". Print `r8-anim-qui-Pf90acda4-768-escuro.png`.
- Pelo script, 39 resoluções com 2 ou mais linhas só de número, todas vindas da conta dos passos (Mat 29, Quí 6, Fís 2, Bio 2). Exemplos:
  - mat Pb28d85a4: "altas anuais das mulheres: 1,0", "1,3", "0,2", "0,9", "5,0", "1,1", "0,5 → a maior é 5,0";
  - mat Pfe3cc0ba: "Total: 16", "17", "66 — Homens: 21", "15", "64 — Mulheres: 12", "20", "68";
  - mat P13525e2d e Pf7605a63: os tempos e as notas, um por linha.
- Onde: `motorConta.ts`, `itensDaConta`, o corte em " | ".
- Como corrigir: a mesma regra do Z1. Só partir em linhas quando todos os itens forem relações; senão juntar com "; ".

### A4. Texto cortado na borda da folha a 390 (mat P5be7ca9e)
- **ERRO** (texto cortado). Já existia; o passo 5 não mudou com Z1–Z3.
- Passo 5, a 390 claro e a 390 escuro: "as cinco afirmações de D são verdade" corta na borda. O "iras →" fica fora da folha: a linha vai de 82 a 393 px, e a folha, de 33 a 357 px. Print `r8-anim-mat-P5be7ca9e-390-escuro.png`.
- Onde: a quebra das linhas de texto com seta na folha estreita (`ResolucaoAnimada.tsx` / `motorAnima.ts`).
- Como corrigir: deixar a frase antes da seta quebrar linha, ou reduzir a linha para caber, como já é feito com a conta.

### A5. Z3: o índice de "ε0A" fica na linha, e o de "θ1" desce
- **DETALHE** (a leitura está certa; a forma não é a mesma nas duas).
- fís Pabef4082: a fração mostra "ε0A" sobre "λ", com o 0 na altura normal. Na mesma tela, a resposta certa mostra "ε₀ · A · sen θ", com o 0 como índice. Em fís Pdd874c02, "θ1" vira "θ₁" dentro da fração.
- Onde: a marcação de índice do numerador (`Fracao.tsx` / `notacao.ts`). Ela trata letra + dígito no fim ("θ1"), mas não letra + dígito + letra ("ε0A").
- Como corrigir: no numerador "ε0A", mostrar "ε₀A". Ou escrever "ε₀" nos dados.

### A6. Separador "; " em listas que já tinham outro espaçamento
- **DETALHE** (fica estranho, mas sem valor errado).
  - quí Pf2101c1e: "Na: 2; 2   S: 1; 1". O dado é "Na: 2 | 2   S: 1 | 1", os dois lados da equação. Lê-se melhor "Na: 2 = 2; S: 1 = 1".
  - quí Pf90acda4: "pH: 4,0; 3,6; 2,5 < 7". O "< 7" parece valer só para o 2,5.
  - mat Pdfcfe2a2: "15; 15 «contagens»", dois números sem rótulo.
  - mat P91ff5b07: "50 infectadas; 950 não".
- Como corrigir: nos dados, escrever essas linhas como frase ou relação ("Na: 2 = 2 | S: 1 = 1", "pH 4,0; 3,6; 2,5: todos < 7"). Ou, depois de A1, elas casam com a conta e não aparecem.

Total: 4 ERROS (2 vindos do Z1, A1 e A2; 2 que já existiam, A3 e A4), 2 DETALHES, 0 DECISÃO DO DONO
