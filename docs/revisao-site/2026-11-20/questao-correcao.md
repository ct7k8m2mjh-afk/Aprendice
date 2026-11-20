# Revisão do site, 20/11/2026 (2ª rodada): questão e correção

Revisor independente. Só li, não corrigi nada. Site em http://localhost:4190, build do commit b20901f9a (ramo app-prototipo-completo).

Escopo: 250 aberturas de questão nas 9 matérias.
- Matriz completa (390, 768, 1280 e 1440 px, claro e escuro) em Matemática, Biologia e Português. Nas outras matérias, 390 claro e 1280 escuro.
- Em cada matéria: questão básica, intermediária e avançada respondidas errado, uma questão respondida certo (a só de texto), uma com Gabarito do Aprendice, uma com figura e as indisponíveis.
- 74 resoluções animadas rodaram do início ao fim, em velocidade 2×. Todas chegaram a "Assistir de novo", sem erro.
- Também as Questões Aprendice da revisão essencial de Química (Q01 em 4 combinações; Q06 e Q07 a 1280 claro).
- Comparei cada item com `docs/revisao-site/2026-11-19/questao-correcao.md`. Segui o `PLANO.md`: os itens 14 e 18, que o dono vai decidir, não entram como problema.

Questões usadas (as mesmas da 1ª rodada; geo P5b2faf4b saiu do banco e foi trocada por P53c24fde):

| Matéria | Básica | Intermediária | Avançada | Gabarito do Aprendice | Indisponível | Só texto (certo) | Figura |
|---|---|---|---|---|---|---|---|
| bio | P6a0081fa | P2d058bf | P2a35fc65 | P6bb641ed | P1310e5f6, Pbd81dec9 | Pb570d83 | P10a1825 |
| qui | Pa444a65 | P3f9c475 | P6022027d | Pfb275ecd | Pecd73277 | P1a742a2 | Pea7d145 |
| mat | Peefb04b4 | e7a3ade5 | P49729ace | Pa9eb4212 | P6fc4c995 | eafcd1cf | 8196566b |
| fis | P36e40b31 | Pa3856771 | P19eed56c | P6478b5c2 | P8cad75ee | Pd70a0c7f | Pa3856771 |
| por | P496959b | Pdf25eee | P8525e8b6 | P2b7fd49f | Pcfeab3fb | Pdf25eee | Pfddef24 |
| geo | P53c24fde | P3eeff267 | P92f19030 | Pdf30965c | Pf675553a | P48755ad4 | P89f346e0 |
| his | P0e7ff395 | P1f24c6dc | P54e7a65d | P0c2676f4 | (nenhuma) | P6cf63570 | Pd86b11b5 |
| ing | Pbb2709e3 | P0a9cb507 | Pc765a862 | Pdca19115 | (nenhuma) | Pbc807da8 | P0a9cb507 |
| fs | P79c7da1d | Pf18d817b | P384c9012 | Pe78466f8 | (nenhuma) | Pf6ee2445 | P8ff3c488 |

Os prints e os dados brutos são temporários e ficam na pasta de rascunho da sessão (`qa2-q-*.png`, `qa2-q-todos.json`, `qa2-q-passo-*.png`).

## Parte 1: os itens da 1ª rodada, um por um

| # | Item de 19/11 | Situação | O que vi agora |
|---|---|---|---|
| 1 | Letra marcada sem vermelho ou verde | **resolvido** | Errada: `rgb(179,48,42)` sobre `rgb(252,234,231)` no claro e `rgb(255,123,107)` sobre `rgb(46,23,20)` no escuro, com o x e o rótulo "Sua". Certa: `rgb(10,117,80)` / `rgb(47,211,154)`, com o sinal de certo e "Correta". Conferido em 212 respostas. |
| 2 | Aba Fonte contradiz o Gabarito do Aprendice | **resolvido** | Nas 9 matérias a aba Fonte diz "Gabarito do Aprendice: a banca não publicou gabarito oficial", antes e depois de responder. Nas outras questões diz "Gabarito oficial publicado". |
| 3 | Aviso do Gabarito do Aprendice só depois de responder | **resolvido** | `.q-gab-ap` (etiqueta de aviso) aparece antes de responder, em todas as larguras. Depois, `.res-gab-ap` aparece no cabeçalho da correção. |
| 4 | Questão só de texto perde o sublinhado | **parcial** | por Pdf25eee agora abre direto no print, com o botão "Ver em texto (o sublinhado da prova só aparece no print)". O texto continua sem a marcação: dos textos que citam "sublinhado", só 1 tem `__…__` (por 308, ing 124, bio 4, qui 3, his 1 abrem no print). Ver o problema N10. |
| 5 | Quebras do PDF no meio da frase | **resolvido** | bio P6a0081fa a 1280: a prosa corre na linha inteira e os versos ficam em linhas separadas. Ver a sugestão N13 sobre o espaço entre prosa e versos. |
| 6 | Mat/Fís mostravam só o resultado de cada passo | **resolvido, com regressões** | mat Peefb04b4 agora mostra os passos numerados, com "faz", a conta (120 × 4,5 = 540; 20 × 6 + 30 × 4 + 25 × 3 = …; fração empilhada) e o "porque". Igual em fis P19eed56c, P6478b5c2 e mat P49729ace. A conta inteira por passo trouxe duas regressões: linhas cortadas (N1) e linhas repetidas (N4). |
| 7 | O que se cancela não é riscado | **parcial** | fis P6478b5c2, passo 2: os dois m são riscados (2 `.ra-risco`, visíveis). Mas fis P36e40b31 ("g cancela") e a Questão Aprendice Q07 ("Somar e cancelar: CO₂, H₂O e O₂ aparecem dos dois lados") não riscam nada. Ver N5. |
| 8 | Biologia e Química sem processo; Caveat em texto; separador cru | **parcial** | Melhorou: bio P6a0081fa e P2a35fc65 têm fluxos com setas e ponto correndo, e o heredograma tem quadro de Punnett montado (pais, gametas, casas, casa citada marcada). qui Pa444a65 escreve a reação em símbolos. Os itens "I correto / II correto / III falso / IV falso → C" ficam em linhas, sem "\|". Ainda falta: texto corrido em Caveat em Física e Matemática (N6); listas em ";" sem quebra em Química (qui Pea7d145, passo 3); "\|" cru nas resoluções em texto das 5 matérias de texto (N3). bio P2d058bf e P10a1825 e qui P3f9c475 continuam com etapas em caixas de texto (movimento máximo de 3 a 10 elementos). |
| 9 | "Por que eu errei" só testa a alternativa | **parcial** (pacote E em andamento) | mat Peefb04b4, letra A, ainda diz "2 não confere: daria 315 + 90 = 405 convites, média 3,375". Também qui P6022027d ("A não confere: …") e mat Pa9eb4212 ("I, III não confere: …"). No banco: Matemática 3.667 de 14.245 (26%; eram 40%), Química 1.783 de 11.050 (16%), Biologia 965 (9%), Física 539 (5%), Português 69. Ver também N7. |
| 10 | Fração na linha na aba Teoria | **parcial** | Os exemplos agora vêm empilhados ("(6 · 2 + 8 · 3) / (2 + 3) = 36/5"; "56/0,28"). A caixa de fórmulas da Teoria continua com a fração na linha: mat Peefb04b4 "x̄ = Σ(xᵢ · pᵢ) / Σpᵢ" (em Caveat, com os índices sobrepostos ao x); mat P49729ace "variação = (novo − antigo) / antigo" (em Familjen); mat Pa9eb4212 "ℚ = {a/b; a, b ∈ ℤ, b ≠ 0}". |
| 11 | Texto da indisponível escondido pelas abas do celular | **resolvido** | bio P1310e5f6 e Pbd81dec9 e geo Pf675553a a 390: o texto termina em y=769, e a barra `nav.tabs` começa em y=776. A folga é de 7px, sem sobrepor. |
| 12 | Contraste da etiqueta de nível | **resolvido** | Com o fundo composto, nas 9 matérias × 2 temas: mínimo 4,52 (bio escuro), 4,53 (ing escuro), 4,54 (geo escuro), 4,63 (fis claro), 4,68 (fs claro). Nenhum texto medido ficou abaixo de 4,5. |
| 13 | Botões menores que 44px | **parcial** | A área invisível de 44px funciona em Voltar, Pausar, Tela cheia, marcador, Ampliar, "Ver em texto" e Dica (testado com `elementFromPoint` a ±21px do centro). **Não funciona** nos chips de certeza (106×30): a 21px acima e abaixo o toque cai em `.q-resp` e `.q-acoes`. Nem no link da fonte no pé do print (`.q-print-fonte`, 52×20): o toque cai em `.q-print-pe`. Ver N8. |
| 15 | Print miúdo a 390 | **não** (sugestão) | Continua com 328px de largura (mat Peefb04b4 548→328; fis P6478b5c2 com a letra em cerca de 6px). |
| 16 | Espaço duplo na etiqueta da fonte | **resolvido** | "UEA 2025 · Conhecimentos Específicos – Exatas · questão 8 · Vunesp", sem espaço duplo em nenhuma das 169 etiquetas visíveis. |
| 17 | "PH, pOH" | **resolvido** | "pH, pOH e hidrólise de sais" (qui Pea7d145). |
| 19 | "Caderno da prova oficial" com link de cursinho | **resolvido** | Com link do Objetivo: "PDF de cursinho (Objetivo), com a prova" na aba Fonte e no rodapé. Ver N11 (links para a página inicial da instituição). |
| 20 | Questão Aprendice fora dos 4 blocos | **resolvido, com falha de dado** | Q01 e Q07: cabeçalho, Por que eu errei, Resposta correta + pegadinha, Resolução animada e Outras (fechado). Sem rótulo em maiúsculas. O aviso "Questão Aprendice: gabarito da banca do Aprendice, conferido pela lente de fatos" aparece no cabeçalho. Em Q06, marcando A, falta o bloco 1 (N2). |
| 21 | Expoente "10" ilegível | **resolvido** | "3d¹⁰" de Q01 lê-se bem a 390. Os índices do genótipo continuam miúdos e encostados no X (N9). |
| 22 | Aspas retas | **parcial** | Aspas duplas viraram curvas, mas as simples continuam retas: por P8525e8b6 "'uns olhos'", "'olhos tão belos'". Na animação de bio P6a0081fa, aspas retas por fora de curvas: `"são citadas “lombriga” e “ameba”, … aos reinos"`. |

Itens 14 (fonte no topo no celular) e 18 (provas antes de 2020): o PLANO deixa para o dono, então não entram como problema.

## Parte 2: problemas (os que continuam e os novos)

### N1. Conta comprida cortada na resolução animada (regressão do item 6)
- Gravidade: **erro** (princípio 9: nada cortado).
- O que está: a linha da conta (`.ra-linha.conta`, Caveat) não quebra, e `.ra-folha` tem `overflow: hidden`. O fim da conta some.
- Exemplo: mat Peefb04b4, passo 2, a 390 mostra "20 × 6 + 30 × 4 + 25 × 3 = 120 + 12" e o resto some. É justamente a passagem para 315 que o item 6 queria mostrar.
- Medidas (largura do conteúdo > largura visível):
  - a 390: mat Peefb04b4 372>262; mat Pa9eb4212 300>262; mat 8196566b 395, 386 e 281>262; qui Pfb275ecd 288>262 ("C = 7 + 4 + 1 + 6 + 4 + 1 + 5 + 1 = …"); qui Pea7d145 270>262;
  - a 1440, onde a resolução fica no painel lateral de 454px: mat Peefb04b4 461>324; mat Pa9eb4212 372>324; mat 8196566b 489, 477 e 348>324.
  - A 768 e 1280 o painel fica embaixo, com 972px de largura, e não corta.
- Prints: `qa2-q-passo-mat-Peefb04b4-390-claro-2.png`, `qa2-q-bas-mat-Peefb04b4-1440-claro-3anim-fim.png`, `qa2-q-passo-qui-Pfb275ecd-390-claro-1.png`.
- O que deveria: a conta quebrar depois de um "=" (ou descer em coluna, como já faz o processo com etapa comprida) e caber em 262px e 324px.

### N2. Questão Aprendice Q06 sem "Por que eu errei" para a letra marcada
- Gravidade: **erro** ("A correção da questão": o bloco 1 aparece sempre que o aluno erra).
- Tela: `/m/qui/essencial/Q06`, item "Questão resolvida", 1280 claro.
- O que está: marcando A (O₂), a correção pula de "Você marcou A. A resposta é D." direto para "Resposta correta".
- Causa: `por_que_erram` de Q06 (`qui/revisao/Q06.json`) só fala da C ("A armadilha típica leva à C: usar 22,4 L/mol…"). `separaArmadilhas` (`app/src/logica/questaoAprendice.ts`) não tem texto para A, B e E.
- Print: `qa2-q-aprendice-Q06-1280-claro-2.png`.

### N3. Separador "|" cru nas resoluções em texto
- Gravidade: **erro** (resto do item 8: a correção do motor só vale para a resolução animada).
- O que está: na resolução em texto (`.cor-texto`), os passos mostram " | " entre os itens.
- Exemplos:
  - por P8525e8b6, passo 1: `“Viva chama de ardente paixão,” | “Esses olhos me falam de amores.”`; passo 4: `A: “morte de 'uns olhos'” | B: “universal em particular” | C: … | E: “satisfação”`;
  - ing Pc765a862: `B: may (pode) | A: would (condicional) | C: will…`;
  - ing Pbc807da8: `B: its → it’s | C: whose → whom | D: …`;
  - geo P48755ad4; fs Pe78466f8, P384c9012, Pf6ee2445.
- Alcance (passos com " | " na conta): Português 862 de 4.951 resoluções, Geografia 1.190 de 2.621, Inglês 1.465 de 2.514, Filosofia e Sociologia 659 de 1.592, História 7.
- Print: `qa2-q-adv-por-P8525e8b6-1280-escuro-2lado.png`.
- O que deveria: a mesma regra do motor (um item por linha) na resolução em texto (`app/src/ui/Resolucao.tsx`).

### N4. Linha repetida no passo (regressão da junção passos + quadro)
- Gravidade: **erro** (conteúdo duplicado na animação).
- Exemplos:
  - fis P36e40b31, passo 2: "1,6 × V(submerso) = 480" e logo embaixo "1,6 × V(sub) = 480" (a linha do quadro, com a nota "empuxo = peso"). O motor não reconheceu que é a mesma conta.
  - mat Pa9eb4212, passo 4: a primeira linha diz em palavras, em Caveat, "1/x + 1/y = log de 2 + log de 7 (base 2744) = log de 14 (base 2744) = 1/3", e as duas linhas seguintes repetem a mesma coisa em notação ("= log₂₇₄₄ 2 + log₂₇₄₄ 7"; "= log₂₇₄₄ 14").
- Código: a regra "a linha do quadro que já está na conta deixa a nota" (`app/src/logica/motorConta.ts`, commit a2e9b43d7) só reconhece texto idêntico.
- Prints: `qa2-q-passo-fis-P36e40b31-1280-claro-2.png`, `qa2-q-passo-mat-Pa9eb4212-1280-claro-4.png`.

### N5. "Cancela" sem risco quando o passo cancela termos
- Gravidade: **erro** (CLAUDE.md: "o que se cancela é riscado"; resto do item 7).
- Exemplos:
  - Questão Aprendice Q07, passo 4 "Somar e cancelar: CO₂, H₂O e O₂ aparecem dos dois lados": a tela mostra só o resultado "2C + 2H₂ → C₂H₄". A soma das três equações e os termos riscados não aparecem.
  - fis P36e40b31, passo 2: o "porque" diz "g cancela", mas o g não aparece na conta nem é riscado.
- Prints: `qa2-q-aprendice-Q07-1280-claro-3anim.png`, `qa2-q-passo-fis-P36e40b31-1280-claro-2.png`.

### N6. Texto corrido em Caveat em Física e Matemática
- Gravidade: **diferença do sistema** (`DESIGN.md:100`: "Caveat: só conta e fórmula do caderno"; resto do item 8a).
- Exemplos:
  - fis P19eed56c, passo 1, a 390: "picos em ≈ 21,0 s e ≈ 29,3 s, com 6 intervalos entre eles →", à mão. Também falta espaço em "em≈".
  - mat Pa9eb4212, passo 4: "log de 2 + log de 7 (base 2744)" à mão.
  - mat Pa9eb4212, passo 1: "produtos: 0, −1, …".
  - O "→ alternativa C" do fim fica em Caveat em Matemática (Peefb04b4, P49729ace "5 L retirados → alternativa E") e em Familjen em Física (P36e40b31 "alternativa D"): a mesma peça sai com duas letras diferentes.
- Print: `qa2-q-passo-fis-P19eed56c-390-claro-1.png`.

### N7. "Por que eu errei" começando por "Correta:" nas questões "EXCETO"
- Gravidade: **erro de conteúdo** (princípio 5: explicar o raciocínio de quem marcou a letra).
- Exemplo: his P0c2676f4 (Acafe 2022, "…as alternativas abaixo, EXCETO"). Marcando B, o bloco "Por que eu errei" diz só "Correta: o absolutismo de Luís XVI concentrava o poder." O aluno lê "Correta" no bloco de erro e não entende o que faltou: notar o "EXCETO".
- Alcance (`erradas` que começam com "Correta:", "Verdadeira:" ou "Certa:"): Inglês 103, História 97, Filosofia e Sociologia 80, Química 40, Geografia 33, Português 30, Física 11, Biologia 3.
- Continua também o ponto de Português da 1ª rodada: em por P8525e8b6 a pegadinha começa com "A cita a morte…", e o "A" se lê como artigo.

### N8. Chips de certeza e link da fonte sem área de toque de 44px
- Gravidade: **erro** (resto do item 13).
- A 390, testado com `elementFromPoint`:
  - `.q-resp .certeza .chip` (106×30): a ±21px do centro, o toque cai em `.q-resp` e `.q-acoes`. A área invisível de `app/src/estilo/sistema.css:544-546` não chega a funcionar ali.
  - `.q-print-fonte` (52×20): o toque cai em `.q-print-pe` acima e abaixo.
  - Pausar (32×32): à direita, a área se sobrepõe à de Tela cheia (o toque a 21px cai em `.q-tela`).

### N9. Índices do genótipo miúdos e encostados no X
- Gravidade: **diferença** (resto do item 21).
- bio P2a35fc65: no quadro de Punnett e nos pares do passo 1 (Caveat 24px), o "ᴬ" e o "ᵃ" sobem colados ao X ou por cima dele ("XᴬXᵃ"). A 390 o "ᵃ" fica com cerca de 8px.
- Os gametas do cabeçalho do quadro (`.pn-g`) saem em cinza claro, bem mais fracos que as casas.
- Print: `qa2-q-passo-bio-P2a35fc65-1280-claro-3.png`.

### N10. Transcrições que citam "sublinhado" continuam sem a marcação
- Gravidade: **diferença** (princípio 1; o item 4 foi contornado, não resolvido).
- O que está: 440 questões abrem direto no print porque a transcrição não tem `__…__` (por 308, ing 124, bio 4, qui 3, his 1). Só 1 texto tem a marcação.
- "Ver em texto" mostra o texto sem o destaque. Quem usa leitor de tela fica sem saber qual é o termo sublinhado.

### N11. "Caderno da prova oficial" com link para a página inicial da instituição
- Gravidade: **sugestão** (princípio 1: fonte com link).
- O que está: a aba Fonte e o rodapé dizem "Caderno da prova oficial", mas o link abre só a página inicial do site:
  - mat Peefb04b4 → `https://www.uea.edu.br/`;
  - qui Pa444a65 e fs Pf18d817b → `https://www.vunesp.com.br/`;
  - fs Pe78466f8 → `https://emescam.br/`;
  - fis P8cad75ee → `https://vestibular.uemg.br/`.
- Em por P496959b o rodapé mostra um domínio técnico ao aluno: "caderno da prova, em arquivo hospedado (bkpsitecpsnew.blob.core.windows.net)".

### N12. Notação crua e símbolos trocados na animação
- Gravidade: **diferença**.
- mat Pa9eb4212, passo 4, nota: "raiz cúbica; 14 = 2744^(1/3)", com o "^(" cru. O marca-texto cai em "log₂₇₄₄ 14", e não no resultado "1/3".
- Grau no lugar do ordinal: "5° período" (Q01) e "1° lombriga, 2° ameba" (bio P6a0081fa). O certo é "5º", "1º", "2º".
- Q07: "2CO₂ ΔH = 2(−394)…" sem espaço entre a equação e o ΔH, que parecem uma coisa só.
- fis Pa3856771: a nota "m/s, média" repete a unidade logo depois de "10 m/s".

### N13. Prosa e versos no mesmo parágrafo
- Gravidade: **sugestão**.
- bio P6a0081fa: a frase de abertura, os 5 versos em negrito e a pergunta ficam num só `<p>`, sem espaço entre os três trechos. A prova separa os três blocos.

### N14. Os dois cronômetros sem rótulo a 768
- Gravidade: **sugestão**.
- A 768, a barra da questão mostra "0:03" e "0:03" lado a lado, sem os rótulos "Total" e "Questão" (que aparecem a 1280). O nome do tema também quebra em duas linhas ("Genética clássica · Avançado · / 40 de 46").
- Print: `qa2-q-adv-bio-P2a35fc65-768-escuro-3anim-m1.png`.

### N15. Conteúdo da etiqueta não confere com a questão
- Gravidade: **sugestão** (dado).
- bio P6a0081fa (lombriga e ameba, reinos Animalia e Protista) está no conteúdo B12.6, "Vertebrados, classificação, nomenclatura e filogenia".

## O que conferi e passou
- **Funcionamento:**
  - nenhum erro de console e nenhuma requisição falhou nas 250 aberturas; as 8 falhas do registro são da queda do contêiner, e as aberturas foram refeitas;
  - nenhum print quebrado;
  - nenhuma rolagem lateral, antes nem depois de responder;
  - nenhum fundo `#FFFFFF` ou `#000000` fora do papel da prova;
  - o tema pedido foi aplicado em todos os casos.
- **Antes de responder:**
  - etiqueta de nível coerente com a dificuldade;
  - aviso do Gabarito do Aprendice visível;
  - print com "Ampliar" (Esc fecha) e link da fonte;
  - "Ver em texto" nas questões com print e "Ver a questão original" nas de texto;
  - marcador, cronômetro, teclado (letra escolhe, Enter confirma).
- **Correção:** em 212 respostas, os blocos vêm sempre nesta ordem: cabeçalho → Por que eu errei (só quando erra; ausente nas 36 respostas certas) → Resposta correta + A pegadinha → resolução animada (bio, qui, mat, fis) ou em texto (por, geo, his, ing, fs) → "Por que as outras estão erradas" (fechado, abre ao clicar, sem repetir a letra marcada) → rodapé com a fonte.
- **Animação:**
  - 74 de 74 rodaram até o fim (de 8 a 28 s em 2×);
  - a barra de controles ficou à vista em todos os passos;
  - número do passo em círculo (Familjen 600, 14px; 13px no celular), "faz" 600 16px, "porque" em Literata 17/16,5px e conta em Caveat 500 26/21px, como em `DESIGN.md:95` e `:185`;
  - frações da animação todas empilhadas;
  - risco visível em fis P6478b5c2;
  - termos se movem (até 99 elementos animados de uma vez, em mat Pa9eb4212);
  - quadro de Punnett em bio P2a35fc65, cabendo nos 262px do celular;
  - fluxos com seta em bio e qui, descendo em coluna no celular, sem cortar palavra.
- **Questão indisponível** (bio, qui, mat, fis, por, geo):
  - sem alternativas e sem correção;
  - o texto "Gabarito oficial com erro e sem correção da banca. Só para consulta." fica à vista em todas as larguras;
  - a aba Fonte explica o motivo e mostra a origem certa ("PDF de cursinho (Objetivo), com a prova").
- **Painel lateral:** abas Resolução, Teoria e Fonte, e "Conteúdos relacionados" com pontinho na cor da matéria.
- **Contraste:** nenhum texto medido abaixo de 4,5, com o fundo composto, nas 9 matérias e nos 2 temas. Inclui os botões primários: "Assistir resolução" de 4,85 a 9,05; "Próxima questão" de 6,26 a 9,4.
- **Questão Aprendice:** etiqueta "Questão Aprendice", com a frase "Questão nova, no estilo das provas, escrita para esta revisão."; as 4 combinações de Q01 sem rolagem lateral e sem erro.
