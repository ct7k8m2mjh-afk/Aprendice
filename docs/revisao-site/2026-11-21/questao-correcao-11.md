# Revisão do site, 21/11/2026 (3ª rodada, 11ª passada): correção de C1–C3

Revisor novo e independente. Só li, medi e escrevi; não corrigi nada. Site em http://localhost:4192 (`vite preview` do build de 22/11 15:16, depois do último commit de código `155ddfbf`; HEAD `2885972c`), login em modo de demonstração.

Escopo: C1–C3 de `questao-correcao-10.md`, as correções descritas em `correcao-A1-A4.md` (A1–A5, B1–B3, C1–C3), se A1–A4 e B1–B3 continuam valendo, e efeito colateral numa amostra nova.

## Como medi

**Na tela.** Playwright, Chromium, `deviceScaleFactor` 1, velocidade 2×, resposta A, "Assistir resolução" até o botão virar "De novo" (todos os passos até o fim). Prints na pasta de rascunho `scratchpad/passada11/` (fora do repositório).
- **18 resoluções citadas, animadas até o fim nas 8 combinações** (390, 768, 1280 e 1440 px, claro e escuro): mat Pc9132e4a, P476c4b22, Pf7605a63, P5be7ca9e, Pf994201f, P146f445c, P7c100bf7, P13525e2d, Pb28d85a4; bio P85452565, Pba6766ee; quí P16af84a2, Pf90acda4, Peb5ea8ca, P0d56efd8; fís Pce134e95, P41dcc9b8, P5a001974.
- **Amostra aleatória nova** (semente 20261123, só questões de prova com 3 passos ou mais, fora das 47 das passadas 9 e 10), animada até o fim a 1280 claro e a 390 escuro e com "Ver sem animação" nas outras 6 combinações: bio Pd3b299b3, Pefb487ab, Pb6aa2d50, P3bbb12c0; quí P3d452da7, Pc4993dc4, P1e197d69, Pbda7b27e; mat P79959d86, P7c99fa0e, Pe77091fe, P3d3698a3; fís P0c1828f0, Pf8f2eeea, P1e12b1e2.
- **Títulos do C3**, "Ver sem animação" a 390 claro e 1280 escuro: mat Pf7386fe5, Pe7d0a824, P053636f4; fís P8f1936d9, Pd2b4ad62, Pfb7662f6, P6f60a2e4.
- **Resultado nos 278 renders:**
  - toda animação chegou ao fim; nenhum erro de console;
  - nenhuma rolagem lateral; nenhuma linha, nota ou frase fora da folha (só o mesmo 1 px do "→" em mat Pf994201f a 390, que não se vê, igual à passada 10);
  - nenhuma linha sobreposta à vizinha;
  - o texto de cada resolução é o mesmo nas 8 combinações.

**Por script.** Para saber se cada achado é novo, rodei com `vite-node` o `montaRoteiro` de `681992da~1` (antes de C1–C3) e o de agora nas resoluções com problema.

## 1. Itens das passadas anteriores

| # | Item | Situação | O que vi agora |
|---|---|---|---|
| A1 | Linha do quadro repetida | **continua resolvido** | mat P476c4b22, bio P85452565 (passo 2), quí P16af84a2: sem repetição. |
| A2 | Nota ou linha no lugar errado | **continua resolvido** | mat Pf7605a63 ("mediana" no passo 3); fís Pce134e95 ("atrito = µ × N" antes da tabela). |
| A3 | Lista de valores virava coluna | **continua resolvido** | quí Pf90acda4: "pH: 4,0; 3,6; 2,5 → todos < 7 → caráter ácido" numa linha, nas 8 combinações. |
| A4 | Frase cortada a 390 | **continua resolvido** | mat P5be7ca9e, passo 5, a 390 claro e escuro: dentro da folha. |
| B1 | Tabela com " ; " entre registros | **continua resolvido** | mat Pc9132e4a: um jogador por linha, cada nota na linha dele, nas 8 combinações. |
| B2/B3 | Linha do quadro com outras palavras | **continua resolvido nos casos citados** | quí Pf90acda4 ("Mg" só no passo 2), quí P16af84a2, fís Pce134e95. |
| C1 | Linha do quadro que repete a conta | **resolvido nos 8 casos citados; continua em outras (D2)** | mat Pf994201f (passos 2 e 3 só com a conta), P146f445c (marca-texto em "c² + 6c − 91 = 0"), P7c100bf7, P13525e2d; quí Peb5ea8ca; fís P41dcc9b8; bio Pba6766ee (passos 1 e 2 com uma linha só); mat Pb28d85a4 passo 1 (a nota foi para "2021: 52,3"). |
| C2 | Linha do quadro no passo errado | **resolvido nos 4 casos citados; efeito colateral (D1); continua em outras (D3)** | mat P5be7ca9e ("j(1) = 0 → j(2) = −1" no passo 4; "\|x\| ≥ 0 …" no passo 3, depois do C); quí P0d56efd8 (nota "massa; carga" na equação do passo 2); bio Pba6766ee ("Rr × rr" no passo 3, "Cruze"); mat Pb28d85a4 ("conclusão" no passo 5). |
| C3 | Fração na linha no título do passo | **resolvido** | fís P5a001974 "Calcule T/V" empilhado nas 8 combinações; também empilhados mat Pe7d0a824, Pf7386fe5, P053636f4; fís P8f1936d9, Pd2b4ad62, Pfb7662f6 ("L/(k·A)"), P6f60a2e4 ("c/f"). |
| B4–B6, C4–C8 | Pendências conhecidas | **iguais (não pioraram)** | C4/C6: fís P5a001974 passo 1 igual; C8: fís P41dcc9b8 "NA < P ; NB > P" e P5a001974 passo 4 iguais; B4: mat P053636f4 "a = −6 «a = −6, b = 11, c = −6»", fís P1e12b1e2 «m», «s». |

## 2. Achados

### D1. "→ B" de tipo sanguíneo tratado como conclusão: linhas do quadro entram antes da conta (efeito do C2)
- **ERRO** (o aluno lê "B: 1/2" antes de ver que IBi dá sangue B; a ordem do raciocínio fica trocada). **Novo**: o roteiro de antes de C1–C3 estava certo.
- **bio P85452565**, passo 3 ("Traduza em fenótipo"), nas 8 combinações: "IAIB → AB", "AB: 1/2", "B: 1/2 «fenótipos»", "IBi → B". Antes do C2: "IAIB → AB", "IBi → B", "AB: 1/2", "B: 1/2 «fenótipos»". Print `bio-P85452565-390-escuro-anim.png`.
- Provável causa: a regra do C2 "nunca depois da conclusão do passo ('→ B')" reconhece "IBi → B" como conclusão por letra, e o passo não é o de ligar à alternativa.
- Alcance provável: nos dados, 35 passos que não são o último têm conta terminando em "→ A…E" sem ser alternativa (tipos sanguíneos, códons "C → G", itens "II-B → A", bio P1c43ad38, P4cdabe51, Pe1ee67e9, P47b1bf66…); os que têm linha do quadro sem casar podem ter a mesma troca.
- Sugestão: só tratar como conclusão "alternativa X", "→ X" no último passo, ou "→ X" quando o passo é de ligar à alternativa; nos outros passos, uma letra depois de "→" é conteúdo, não conclusão. Cobrir com teste (P85452565).

### D2. Linha do quadro que repete a conta ainda entra (resto do C1)
- **ERRO** (o aluno lê a mesma conta duas vezes, às vezes com nome diferente para a mesma grandeza). Já existia: todos dão o mesmo roteiro antes de C1–C3.
- **fís Pd2b4ad62**, passo 1, a 390 claro e a 1280 escuro: "g' = g × (1 − D/R)" e logo abaixo "g’ = g × (1 − D/R) «gravidade na mina»", iguais a não ser pelo apóstrofo (reto × curvo). Print `fis-Pd2b4ad62-1280-escuro-tudo.png`.
- **fís P6f60a2e4**, passo 1: "vácuo: d/λ", "película: … = n · d/λ" e depois "ondas no vácuo: d/λ", "na película: n · d/λ «λ encolhe para λ/n»". Print `fis-P6f60a2e4-1280-escuro-tudo.png`.
- **fís P8f1936d9**, passos 1 e 2: "m/(m/s²) = s²" e depois "h/g → m/(m/s²) = s² «unidades»"; "√(s²) = s" e depois "√(h/g) → s «raiz»"; passo 3 nota "√(h/g)" e passo 4 só "√(h/g)". Print `fis-P8f1936d9-1280-escuro-tudo.png`.
- **fís Pfb7662f6**, passo 1: "Φ₂/Φ₁ = 0,4 com o mesmo ΔT → R₁/R₂ = 0,4 → R₂ = 2,5 R₁" e depois "Φ₂/Φ₁ = R₁/R₂ = 0,4 → R₂ = 2,5 R_w «mesmo ΔT»": a mesma conta, terminando uma em R₁ e a outra em R_w. Print `fis-Pfb7662f6-1280-escuro-tudo.png`.
- Já listados como "ficam" no relatório da correção, continuam: **mat P5be7ca9e**, passo 2, "i(−x) = −2 × (−x) = 2x = −i(x)" e logo "i(−x) = 2x = −i(x) → i ímpar"; **mat Pb28d85a4**, passo 4, "2012: 74,5 − 51,9 = 22,6 ≠ 11,7 «derruba a D»" e três linhas depois "D: 74,5 − 51,9 = 22,6".
- Provável causa: `parecida` compara aspas/apóstrofos sem normalizar ("'" × "’"); a linha com rótulo próprio ("ondas no vácuo:" × "vácuo:") e a linha que é a conta com um prefixo ("h/g → …") não casam.
- Sugestão: normalizar ’ ‘ ' antes de comparar; casar o lado direito do rótulo; casar quando a conta inteira aparece dentro da linha do quadro depois de "→"; na repetição de R₁ × R_w, a nota vai para a conta e a linha do quadro sai (a troca de nome é dos dados e passa pelas lentes).

### D3. Linha do quadro no passo errado (resto do C2)
- **ERRO** (a linha contradiz o texto do passo ou antecipa o passo seguinte). Já existia: o mesmo roteiro antes de C1–C3.
- **fís Pf8f2eeea**, passo 1 ("Veja pelo estudante"): "x = v × t «avança sem parar»" logo depois de "dentro do ônibus: sobe e desce na vertical", e o texto do passo diz "só vê o sobe-e-desce". A linha é do passo 2 ("Veja pela rua"). Print `fis-Pf8f2eeea-1280-claro-anim.png`.
- **fís P6f60a2e4**, passo 2 ("Calcule a diferença em número de ondas"): "λ = c/f → (n − 1) · d · f/c «troca λ pelos dados»"; é o passo 3 ("Troque λ por c/f"), que depois repete "(n − 1) · d/λ = (n − 1) · d · f/c". Print `fis-P6f60a2e4-1280-escuro-tudo.png`.
- Provável causa: a linha do quadro que não casa entra perto da vizinha casada; a escolha do passo pelas palavras (C2) não pega "x" × "rua/horizontal" nem "λ = c/f" × "Troque λ por c/f".
- Sugestão: comparar a fórmula da linha com o título do passo ("λ = c/f" × "Troque λ por c/f" vale como mesmo assunto); em "x = v × t", a variável "x/horizontal" casa com "horizontal:" do passo 2; sem lugar claro, não mostrar a linha.

### D4. Fração na linha dentro da conta e da nota
- **ERRO** ("Fração sempre empilhada", CLAUDE.md). Já existia (dados iguais e roteiro igual antes de C1–C3).
- **fís P8f1936d9**, passo 1, a 1280 escuro e a 390 claro: "h/g →" escrito à mão na linha, antes da fração empilhada "m sobre m/s²". Print `fis-P8f1936d9-1280-escuro-tudo.png`.
- **fís Pfb7662f6**, passo 4: "k_p/k_w = 0,6 cm/(1,5 × 10 cm) = 0,6/15 = 0,04" sai "0,6 cm/(1,5 × 10 cm)" na linha (o resto empilha).
- **mat P053636f4**, passo 4, nota "(ab)/c" na linha (o título e a conta empilham). Print `mat-P053636f4-390-claro-tudo.png`.
- Provável causa: `partesFracao` não empilha quando o termo da esquerda é seguido de "→" e é a primeira coisa da linha ("h/g →"), nem número com unidade sobre parênteses ("0,6 cm/(…)"); a nota não passa pela regra do título (C3).
- Sugestão: na conta, variável/variável antes de "→" empilha; "número unidade/(…)" com número no denominador empilha; a nota passa pela mesma regra do título.

### D5. Linha do quadro que repete a conta com outras palavras, em linhas só de texto
- **DETALHE** (a leitura está certa, só redundante).
- fís P0c1828f0 passos 2 e 3 ("além do vermelho → frequência menor → infravermelho" e "além do vermelho → infravermelho (invisível)"); mat P7c99fa0e passos 2 a 4 ("s ∥ t em α e r ⊥ s → r pode estar contida em α" e "II: s ∥ t → r pode estar em α"); fís Pf8f2eeea passo 3 ("… → parábola" e "x e y juntos → parábola"); quí Pc4993dc4 passos 1 e 2 (campos "massa:" e "número atômico:" e, no meio, a linha que junta os dois).
- Sugestão: quando a linha do quadro tem a mesma conclusão (lado direito do último "→") que uma linha do passo, a nota vai para essa linha e a do quadro sai.

### D6. Nota repetida dentro dela mesma
- **DETALHE** (família do B4).
- quí Pbda7b27e, passo 2: "HCl, NaOH: 2 × 0,1 = 0,2 mol/L «mol/L de íons; mol/L de íons»".
- Provável causa: duas linhas do quadro casam com a mesma conta e as notas são juntadas sem tirar as iguais.
- Sugestão: ao juntar notas com "; ", não repetir a mesma.

### D7. Expoente fracionário na linha na conta à mão
- **DETALHE.**
- mat Pf7386fe5, passo 2: "32·b^−1/2 = 16 → b^−1/2 = …" à mão com "−1/2" na linha; no texto do mesmo passo o expoente sai empilhado e pequeno. Print `mat-Pf7386fe5-1280-escuro-tudo.png`.
- Sugestão: usar na conta à mão o mesmo expoente empilhado do texto (`comNotacao`).

Total: 4 ERROS (D1 novo, efeito do C2; D2, D3 e D4 já existiam), 3 DETALHES (D5 a D7), 0 DECISÃO DO DONO. B4–B6 e C4–C8 continuam como pendências conhecidas, sem piorar.
