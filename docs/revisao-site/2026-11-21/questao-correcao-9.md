# Revisão do site, 21/11/2026 (3ª rodada, 9ª passada): correção de A1–A4

Revisor novo e independente. Só li, medi e escrevi; não corrigi nada. Site em http://localhost:4191 (build de 22/11 12:26, depois do último commit de código `24ad9927`; HEAD `1292422b`), login em modo de demonstração.

Escopo: os achados A1–A4 de `questao-correcao-7.md`, as correções descritas em `correcao-A1-A4.md` e o efeito colateral delas.

## Como medi

**Por script.** Tirei do git `app/src` do commit `6bae83e4` (antes da correção) e rodei com `vite-node` o `montaRoteiro` de antes e o de agora sobre todas as 12 437 resoluções de Mat, Fís, Quí e Bio.
- 145 roteiros mudaram (Mat 70, Quí 43, Fís 21, Bio 11).
- Nenhum número sumiu: todo número que existia antes ainda aparece na resolução.
- Nenhuma nota sumiu. As notas que antes vinham juntas ("média; mediana") agora vão cada uma para a sua linha.
- Procurei linhas repetidas novas e relações que agora ficam juntas numa linha só. Só 2 casos pioraram: B3 e, em parte, B5.

**Na tela.** Playwright, Chromium, `deviceScaleFactor` 1, velocidade 2×, resposta A. Prints na pasta de rascunho `scratchpad/passada9/` (fora do repositório).
- **10 resoluções de A1–A4, animadas até o fim** ("De novo" na barra), nas 8 combinações (390, 768, 1280 e 1440 px, claro e escuro):
  - mat Pc9132e4a, P476c4b22, Pf7605a63, P13525e2d e P5be7ca9e;
  - bio P85452565;
  - quí P16af84a2, P4f99343f e Pf90acda4;
  - fís Pce134e95.
- **Mais 18 resoluções, para ver efeito colateral:**
  - amostra aleatória (semente fixa): bio Pfa1ff15d, Pee27ef16 e P44b32998; quí P81ae9450, P7bfd68b8 e Pe28a5b82; mat P4abfc5e2, Pc43b444 e P19c58757; fís Pd346ae53, Pc0e0d5a1 e Pe26a48a4;
  - 6 que a correção mudou: mat Pb28d85a4, Pfe3cc0ba e P9c957c10; quí Pf2101c1e; fís P9ba33c4c; bio P40d9ac92.
  - Cada uma animada até o fim a 1280 claro e a 390 escuro, e com "Ver sem animação" nas outras 6 combinações.
- **Resultado em todos os 224 renders:**
  - a animação chegou ao fim;
  - nenhuma rolagem lateral;
  - nenhuma linha, nota ou frase passa da borda da folha;
  - nenhum erro de console;
  - nenhuma fração escrita na linha: só "kJ/mol" e "mg/100 g", que são unidades;
  - "÷" e "/" aparecem empilhados na letra à mão (mat Pc43b444, fís P9ba33c4c);
  - nenhuma sequência de 2 ou mais linhas só de número.

## 1. Itens da passada anterior

| # | Item | Situação | O que vi agora |
|---|---|---|---|
| A1 | Linha do quadro repetida (cerca de 45) | **resolvido nos casos citados; sobra o caso de texto parecido (B2)** | Sem a linha repetida, com a nota na última linha da conta:<br>- mat P476c4b22: "2016: A/1,28 ≈ 0,781A «áreas»";<br>- quí P16af84a2: a linha "gás: …" saiu;<br>- bio P85452565: "IAi × IBIB → IAIB" e "IBi «metade de cada»";<br>- mat Pc9132e4a: as 5 linhas repetidas saíram, mas a conta tem outro erro (B1).<br>Ainda repetem: quí Pf90acda4, "Mg: 70,0; 48,0; 23,0" no passo 4, e mat P9c957c10, "GB 65; França 64; Austrália 53" (B2). |
| A2 | Nota ou linha no lugar errado | **resolvido nos casos citados** | - mat Pf7605a63: "média" no passo 1 e "mediana" no passo 3;<br>- mat P13525e2d: a nota fica na lista ordenada, e "centrais" vem depois dela;<br>- fís Pce134e95: "atrito = µ × N" vem antes da tabela;<br>- quí P4f99343f: a nota do item IV fica no passo 4.<br>Efeito novo pequeno em fís P9ba33c4c (B3). |
| A3 | Lista de valores da conta virava coluna | **resolvido** | quí Pf90acda4, passo 3, em todas as 8 combinações: "pH: 4,0; 3,6; 2,5 → todos < 7 → caráter ácido", numa linha.<br>Igual em mat Pb28d85a4 e Pfe3cc0ba. Nas 28 resoluções vistas na tela, nenhuma linha só de número.<br>Não cobre a conta com " ; " entre registros (B1). |
| A4 | Frase cortada a 390 (mat P5be7ca9e, passo 5) | **resolvido** | A 390, no claro e no escuro: "as cinco afirmações de D são / verdadeiras → / alternativa D". Tudo dentro da folha (33–357 px). |

## 2. Achados

### B1. Conta com " ; " entre registros e " | " entre campos vira coluna, e a nota cai na linha do jogador seguinte
- **ERRO.**
- Onde: mat Pc9132e4a, passo 1, nas 8 combinações.
- O que se vê: 11 linhas. "Alice: V 1", "E 2", "D 1 ; Bruno: V 3  linha de Alice", "E 0", "D 1 ; Carla: V 2  linha de Bruno"… "D 2  único sem vitória". A nota "linha de Alice" fica ao lado da linha que começa os dados de Bruno, e assim por diante. A tabela de cada jogador fica partida em três linhas. Print `L-mat-Pc9132e4a-390-claro-tudo.png` e `mat-Pc9132e4a-1280-claro-anim.png`.
- O dado: "Alice: V 1 | E 2 | D 1 ; Bruno: V 3 | E 0 | D 1 ; …"
- Provável causa: `motorConta.ts`, `itensDaConta`. Corta em " | ". O item "E 2" tem rótulo e abre linha, e o " ; " fica dentro do item "D 1 ; Bruno: V 3". A regra do A3 só junta o item que começa por número.
  - O casamento com o quadro (A1) então põe a nota na última linha que contém o campo "D 1". Antes da correção as linhas eram as mesmas, mas a nota ia para as 5 linhas repetidas.
  - Já funciona quando o campo começa por número: mat Pa8de4820 dá "2004: 120 kg/ha; 38 kg/t".
- Sugestão:
  - cortar primeiro em " ; " (um registro por linha);
  - depois juntar os campos " | " de cada registro com "; " ("Alice: V 1; E 2; D 1"), a não ser que todos sejam relações;
  - a linha do quadro "Alice: V 1 | E 2 | D 1" então casa com a linha inteira, e a nota fica na linha de Alice.

### B2. Linha do quadro com texto parecido, mas não igual, ao da conta ainda entra repetida, às vezes em outro passo e levando a nota
- **ERRO.** Já existia: os casos abaixo estão iguais em `6bae83e4`, menos os dois que o A1 listava. Não vem de A1–A4, mas é o mesmo defeito do A1 e deixa A1 incompleto.
- Na tela, a 1280 claro e a 390 escuro (iguais nas outras combinações):
  - **quí Pf90acda4**, passo 4: "Mg: 70,0; 48,0; 23,0 «cajá é o menor: D cai»", depois de "8,61% e 7,49% > 5,13% → alternativa A". O passo 2 já escreve "Mg: abacaxi 70,0 > acerola 48,0 > cajá 23,0 mg/100 g". Print `qui-Pf90acda4-390-escuro-anim.png`;
  - **mat P9c957c10**, passo 1: "GB 65; França 64; Austrália 53 «3.º a 5.º»" antes da lista, que depois traz "Austrália 53", "França 64" e "Grã-Bretanha 65";
  - **quí P16af84a2**:
    - passo 1: "↑ pressão → lado com 2 mol → I correta «menos gás»", que o passo 2 repete com "mais NH3";
    - passo 4: "↓ T → sentido exotérmico → II correta «alternativa C»", depois da conclusão. A linha é do passo 3, e a nota "alternativa C" fica longe de "I e II corretas → alternativa C".
    - Print `qui-P16af84a2-1280-claro-anim.png`;
  - **fís Pce134e95**: "µ mínimo = 0,50 → 3,2% «menor atrito»" no passo 1. O passo 2 é "menor coeficiente: 0,50 → 3,2% de água";
  - **quí Pf2101c1e**, passo 5: "H: 2 + 2 = 4", "2 × 2 = 4", "O: 4 + 2 = 6", "4 + 2 = 6" e "Na: 2; 2 S: 1; 1". O passo 2 acabou de escrever tudo isso. Print `qui-Pf2101c1e-1280-claro-anim.png`;
  - **mat Pfe3cc0ba**:
    - passo 3: "III: 66 ≈ 2/3 · 100 = 66,7" e depois "III: não bebeu 66% ≈ 2/3 = 66,7%";
    - passo 4: "IV: 12 ≠ 1/4 · 100 = 25 → falsa «mulheres em binge»" depois da conclusão. O IV já foi julgado no passo 2;
  - **outros iguais**:
    - quí Pe28a5b82, passo 2: "Cu: +0,34 V e Al: +1,66 V > −0,55 V" e depois "Cu: +0,34 > −0,55" e "Al: +1,66 > −0,55";
    - mat P4abfc5e2, passo 2: "120 mg → 60 mg (14h) → 30 mg (20h)", depois "120 → 60" e "60 → 30";
    - mat P5be7ca9e, passo 2: "i(−x) = −2 × (−x) = 2x = −i(x)" e, duas linhas abaixo, "i(−x) = 2x = −i(x) → i ímpar";
    - mat Pb28d85a4, passo 4: "2012: 74,5 − 51,9 = 22,6 ≠ 11,7 «derruba a D»" e "D: 74,5 − 51,9 = 22,6".
- Provável causa: `montaRoteiro` só deixa de mostrar a linha do quadro quando ela casa com a conta pelo texto, pelos pedaços ou pelos valores na ordem. Com uma palavra a mais ou a menos ("(esquerda)", "abacaxi", "de água"), ela entra como linha nova. É inserida perto da linha vizinha casada, inclusive em outro passo.
- Sugestão:
  - casar também pela "assinatura" da linha: os números e os sinais (=, <, >, →), sem as palavras;
  - se todos os números da linha do quadro já estão numa conta do mesmo passo ou do passo seguinte, ela não entra, e a nota vai para essa conta;
  - para P9c957c10, tratar "GB" = "Grã-Bretanha" nos dados (passa pelas lentes).

### B3. fís P9ba33c4c: a nota "decai com 1/d" fica numa linha repetida nova
- **DETALHE** (vem do A2).
- Onde: passo 4, nas 8 combinações.
- O que se vê:
  - depois de "d > r: V decai com 1/d" entra "d = 2r → V/2  decai com 1/d";
  - a linha repete o "d = 2r: V = (k · Q/r)/2" do passo 2;
  - a nota fica ao lado de "V/2", e não da frase que ela explica.
  - Antes da correção, essa linha casava no passo 2. Print `L-fis-P9ba33c4c-768-escuro-tudo.png`.
- Provável causa: a busca por pedaços no mesmo passo (A2) não acha "d = 2r → V/2" no passo 4 e insere a linha ali, em vez de casar com o passo 2.
- Sugestão: quando a linha do quadro não casa no passo da vizinha, tentar os passos anteriores antes de inserir. A regra de B2 também resolve.

### B4. Nota que repete a linha ou junta os dois rótulos, e par desenhado de dois jeitos
- **DETALHE.**
- quí P16af84a2, passo 1:
  - "direita: 2 mol  esquerda; direita". A nota "esquerda | direita" do quadro virou "esquerda; direita" e fica só na linha da direita;
  - "esquerda: 1 + 3 = 4 mol" sai escrita à mão, e "direita: [2 mol]" sai em caixa de diagrama. São dois desenhos para o mesmo par.
- bio P40d9ac92, passo 2: "Aa (metade cada)  metade cada".
- bio P85452565, passo 2: os filhos do cruzamento ficam em duas linhas, "IAi × IBIB → IAIB" e "IBi". Lê-se melhor "IAi × IBIB → IAIB; IBi".
- Sugestão:
  - nota com " | " cujos pedaços são os rótulos das linhas casadas: repartir pelos pedaços, ou não mostrar;
  - não mostrar nota igual a um trecho da linha;
  - "→ X | Y" de cruzamento: juntar com "; ".

### B5. Listas que ficaram numa linha só, mas difíceis de ler
- **DETALHE.**
- mat P13525e2d, passo 1, a 390: os 8 tempos fora de ordem, "→" e os 8 em ordem viram 4 linhas corridas, com o "→ 23,50;" no meio da 2ª linha. Não se vê onde começa a lista ordenada. Print `L-mat-P13525e2d-390-claro-tudo.png`.
- mat bbe1880a: "8 cm; 8 × 0,5 = 4 cm; 4 × 0,5 = 2 cm" e mat P7db876d: "1; 1 + 2 = 3; 1 + 2 + 3 = 6; …". Contas em sequência que antes tinham uma linha cada agora vão numa linha só (pelo script).
- quí Pf2101c1e: no passo 5, "Na: 2; 2 S: 1; 1" (o espaço triplo do dado some e fica "2 S"). No passo 2, "O: 4 + 2 = 6; 4 + 2 = 6" (é o A6, ainda nos dados).
- Sugestão:
  - quebrar a linha depois de "→" quando a lista dos dois lados não couber;
  - quando o 1.º item é um valor e os seguintes são relações, deixar uma relação por linha;
  - nos dados, "Na: 2 = 2 | S: 1 = 1".

### B6. Aspas retas numa linha e curvas nas vizinhas
- **DETALHE.**
- mat P5be7ca9e, passo 3: "C: 'imagem de g é ℝ' falsa, Im(g) = [−2, +∞[" sai com aspas retas, e A, B e E saem com aspas curvas ("‘g linear’").
- Provável causa: `textoVisivel` não aplica `textoCorrecao` às linhas de conta, e essa linha é conta por causa do "=".
- Sugestão: trocar as aspas também nas linhas de conta que têm texto entre aspas.

Total: 2 ERROS (B1; B2, que já existia), 4 DETALHES (B3 a B6), 0 DECISÃO DO DONO.
