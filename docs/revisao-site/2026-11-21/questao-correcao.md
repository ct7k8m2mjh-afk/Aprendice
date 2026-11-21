# Revisão do site, 21/11/2026 (3ª rodada): questão, correção e simulados

Revisor independente. Só li, medi e escrevi; não corrigi nada. Site em http://localhost:4191 (build pronto, login em modo de demonstração), commit `82d57265`.

O que revisei:
- **Tela da questão e correção**, em 4 larguras (390, 768, 1280 e 1440 px) × 2 temas, em 6 questões respondidas errado: mat Peefb04b4, qui Pfb275ecd (Gabarito do Aprendice), bio P2a35fc65, fis P6478b5c2 (Gabarito do Aprendice), por P8525e8b6 e his P0c2676f4 (Gabarito do Aprendice, "EXCETO").
- Mais 8 questões a 390 e 1280, nos 2 temas:
  - respondidas certo: mat eafcd1cf, his P6cf63570, bio Pb570d83 e fs Pe78466f8 (esta com Gabarito do Aprendice);
  - respondidas errado: ing Pc765a862, geo P48755ad4, qui Pea7d145 e fis P36e40b31.
- **Antes de responder**, a 390, 768, 1280 e 1440 px: fonte no topo, pausa pela tecla P, alvo de toque e foco pelo teclado (40 paradas de Tab, todas com contorno visível).
- **Resolução animada**: 44 execuções até "Assistir de novo", em velocidade 2×.
  - 14 questões (4 de Matemática, 4 de Química, 3 de Biologia e 3 de Física) a 390 claro e 1440 escuro.
  - 4 delas também a 768 escuro, 1280 claro, 390 escuro e 1440 claro.
  - Em cada execução medi: linha cortada ou com rolagem interna, fração na linha, palavra em Caveat, risco onde o passo cancela, linha repetida, número de peças em movimento e controles à vista.
- **Questão Aprendice** Q06 (revisão essencial de Química), a 390 claro e 1280 escuro.
- **Simulados**:
  - lista por instituição e ano;
  - página da prova ENEM 2025;
  - simulado por conteúdo de Matemática com 3 conteúdos e 10 questões, de ponta a ponta (escolha, 10/20/30/45, cronômetro, pausa, Entregar e resultado por conteúdo), em 390 claro, 768 escuro, 1280 escuro e 1440 claro;
  - simulado por conteúdo de Física (folha de respostas) a 390 escuro, 1280 escuro e 1440 claro.

Prints e dados brutos (temporários) na pasta de rascunho da sessão: `r3-questao-correcao-*.png` e `r3q/*.json`.

**O que passou em tudo que medi:**
- **Funcionamento:** nenhum erro de console ou de rede, nenhuma rolagem lateral, nenhum fundo `#FFF` ou `#000` fora do papel da prova e nenhum emoji.
- **Contraste:** nenhum texto abaixo de 4,5:1 na questão e na correção.
- **Ordem da correção:** sempre Por que eu errei (ausente nas 4 respostas certas), Resposta correta + A pegadinha, Resolução animada (Bio, Quí, Mat, Fís) ou Resolução em texto (Por, His, Ing, Geo, Fs), e "Por que as outras estão erradas" (`<details>` fechado, que abre ao clicar).
- **Gabarito do Aprendice:** aviso antes de responder (`.q-gab-ap`) e no cabeçalho da correção (`.res-gab-ap`).
- **Resolução animada:** as 44 execuções chegaram ao fim, sem conta cortada e sem conta com rolagem interna (0 `.rola`), com os controles sempre à vista.
- **Pausa:** P para o relógio e esconde a questão. No simulado, o relógio congelou em 29:55 por 2,5 s.
- **Simulado por conteúdo:** questões em ordem crescente de nível nas 4 montagens (por exemplo 3, 3, 4, 4, 5, 5, 6, 6, 6, 7) e resultado "Por conteúdo" com "x de y".

## 1. Itens das rodadas anteriores

| # | Item | Situação | O que vi agora |
|---|---|---|---|
| 19/4 e 20/N10 | Transcrição que cita "sublinhado" sem a marcação | **não** | Nos `txt/`, só 4 de 441 textos que citam "sublinhad" têm `__…__`: Português 4 de 309, Inglês 0 de 124, Biologia 0 de 4, Química 0 de 3, História 0 de 1. |
| 19/6 e 20/N1 | Conta comprida cortada | **resolvido** | 0 linhas cortadas e 0 com rolagem em 44 execuções. mat Peefb04b4 a 390: "20 × 6 + 30 × 4 + 25 × 3" e, embaixo, "= 120 + 120 + 75 = 315". mat 8196566b quebra depois do "=" nas 4 larguras. |
| 20/N2 | Q06 sem "Por que eu errei" | **resolvido** | Marcando A: "O₂ (A) não confere: M = 2 × 16 = 32 g/mol, e 0,20 mol de O₂ pesariam … 6,4 g". B e E também têm texto em `qui/revisao/Q06.json`. |
| 20/N3 | "\|" cru na resolução em texto | **resolvido** | por P8525e8b6, ing Pc765a862, geo P48755ad4 e his: um item por linha, sem " \| " no texto visível. |
| 20/N4 | Linha repetida no passo | **parcial** | fis P36e40b31 e mat Pa9eb4212 já não repetem. Casos novos: fis P19eed56c, passo 3 ("L = 10 × 1,4²/(4 × 3²) → L = 19,6/36 ≈ 0,54 m" e logo embaixo "L = 10 × 1,96/36 ≈ 0,54 m ≈ 50 cm"); qui Pfb275ecd, passo 3 (a soma dos carbonos em texto e de novo como conta). |
| 19/7 e 20/N5 | "Cancela" sem risco | **resolvido (no que refiz)** | fis P36e40b31, passo 2: "× g" riscado nos dois lados (`.ra-risco`). Q07 não foi refeita. |
| 19/8 | Bio e Quí sem processo animado | **parcial** | Com movimento: bio P2a35fc65 (quadro de Punnett) e qui Pfb275ecd (16 peças se movendo). Sem nenhuma peça em movimento (máximo 0): bio P6a0081fa, bio P2d058bf e qui Pa444a65. São caixas de texto ligadas por setas, e qui Pa444a65 tem só uma linha de reação. |
| 20/N6 | Texto corrido em Caveat | **resolvido** | "log de", "picos em", "com" e "intervalos entre eles" agora saem em Familjen (`.ra-t.pal`). Só sobram palavras de unidade ("reais", "submerso" em V(submerso)). |
| 19/9 | "Por que eu errei" só testa a alternativa | **parcial** | Ainda aparece "X não confere: …" em Matemática 4.725 de 14.294 letras (33%), Química 2.106 de 11.062 (19%), Física 1.347 de 10.432 (13%), Biologia 1.009 de 10.559 (10%) e Geografia 835 de 9.629 (9%). Exemplo: mat Peefb04b4, letra A, "2 não confere: daria 315 + 90 = 405 convites, média 3,375". |
| 20/N7 | "Correta:" no "Por que eu errei" (EXCETO) | **resolvido** | his P0c2676f4, letra B: "Esta afirmação é verdadeira, e a questão pede a exceção…". Sobram 11 casos em todo o banco (His 3, Geo 4, Fs 4). Continua a pegadinha de por P8525e8b6, que começa com "A cita a morte…", e o "A" se lê como artigo. |
| 19/10 | Fração na linha na aba Teoria | **resolvido** | mat P49729ace: "x/100", "56 ÷ 0,28", "(novo − antigo)/antigo" e "parte ÷ (x/100)" empilhadas. Ver N7 sobre a letra. |
| 19/13 e 20/N8 | Alvo de toque menor que 44 px na questão | **resolvido** | A 390, testado a 21 px do centro nas 4 direções, todos acertam: chips de certeza, link da fonte, Pausar, Tela cheia, Voltar, marcador, Ampliar, "Ver em texto" e Dica. No simulado ainda falha (N4). |
| 19/15 | Print miúdo a 390 | **não** (sugestão) | Sem mudança. |
| 19/21 e 20/N9 | Índices do genótipo | **parcial** | Os gametas do quadro agora têm a mesma força das casas. O "ᴬ" e o "ᵃ" continuam encostados no braço do X ("XᴬXᵃ"), no quadro e nos pares do passo 1 (bio P2a35fc65, 390 escuro). |
| 19/22 | Aspas retas | **resolvido** | "‘uns olhos’" e "‘olhos tão belos’" com aspas curvas. |
| 20/N11 | Link para a página inicial da instituição | **resolvido** | "Fonte: site da instituição (sem link direto para o caderno)". por P496959b: "caderno da prova, em arquivo hospedado na internet", sem o domínio técnico. |
| 20/N12 | Notação crua e símbolos | **resolvido (no que refiz)** | "14 = 2744^(1/3)" sai com expoente. O "1º lombriga, 2º ameba" usa o ordinal certo (U+00BA); na Familjen ele parece um sinal de grau, mas o caractere está certo. Q07 e fis Pa3856771 não foram refeitas. |
| 20/N13 | Prosa e versos no mesmo parágrafo | **resolvido** | bio P6a0081fa: abertura, versos em negrito e pergunta em blocos separados. |
| 20/N14 | Cronômetros sem rótulo a 768 | **resolvido** | "TOTAL 0:05 / QUESTÃO 0:05" a 768. |
| 20/N15 | Etiqueta do conteúdo não confere | **não** | bio P6a0081fa (lombriga e ameba) continua em B12.6, "Vertebrados, classificação, nomenclatura e filogenia". |

## 2. Achados novos

### N1. Fração na linha dentro da conta animada ("L/g")
- **ERRO** (CLAUDE.md: "Fração sempre empilhada … em textos, fórmulas e animações").
- Tela: fis P19eed56c (Fuvest 2021), resolução animada, passo 2. Visto a 768 escuro e 1280 claro; o texto é o mesmo nas 4 larguras.
- O que está: os dados trazem "T = 2π√(L/g) → T² = 4π² · L/g → L = g · T²/(4π²)". O primeiro "L/g" (dentro da raiz) e o "T²/(4π²)" saem empilhados. O "L/g" do meio sai na linha: "4π² · L/g".
- Também no passo 2: o marca-texto do resultado cai em pedaços soltos, um retângulo atrás do "g" e outro no vão entre o "·" e a fração. Print: `r3-questao-correcao-anim-fis-P19eed56c-768-escuro.png`.
- Onde: a detecção de fração em `app/src/logica/fracao.ts` (`partesFracao`), usada por `app/src/logica/motorConta.ts:86`, não reconhece letra/letra depois de "·".
- Alcance provável: há cerca de 1.100 contas com "letra/letra" fora de unidades (Física 811, Matemática 169, Química 113; por exemplo "ω = v/r", "R/r = 4"). Só conferi a tela de P19eed56c.
- Como corrigir: tratar "a/b" entre nomes como fração também depois de "·" e "×", e cobrir com um teste.

### N2. Questão Aprendice não responde pelo teclado
- **ERRO** (princípio 6: "responder pelo teclado").
- Tela: `/m/qui/essencial/Q06`, cartão 11 de 12 ("Questão Aprendice"), a 390 claro e 1280 escuro.
- O que está: a tecla A não marca a alternativa (continua `aria-checked="false"`, e "Conferir" segue desabilitado). Enter não confere. O grupo tem `role="radiogroup"`, mas as setas não andam entre as opções. Na tela da questão de prova, A–E e Enter funcionam.
- Onde: `app/src/telas/RevisaoEssencial.tsx:218-232` (só `onClick`). O `keydown` da tela (linha 64) só cuida da navegação entre cartões.
- Como corrigir: A–E marca, Enter confere, e setas dentro do radiogroup, como em `QuestaoCartao`.

### N3. Número da questão respondida com pouco contraste na folha de respostas do simulado (escuro)
- **ERRO** (contraste mínimo de 4,5:1).
- Tela: simulado em andamento, painel "Folha de respostas", tema escuro, a 390, 768 e 1280.
- O que está: o número da questão (12 px) nas casas já respondidas:
  - Física: `rgb(140,143,153)` sobre `rgb(72,34,6)`, 4,32:1;
  - Matemática: 4,25:1.
- No claro passa: `rgb(98,101,111)` sobre `rgb(255,240,232)`.
- Onde: `app/src/estilo/telas.css:449` (`.fr-q { color: var(--fraco) }`) com `:451` (`.fr-q.resp { background: var(--sv) }`).
- Como corrigir: no `.fr-q.resp`, número em `var(--tinta)` ou num tom de `--fraco` que chegue a 4,5:1 no escuro.
- Print: `r3-questao-correcao-sim-folha-1280-escuro.png`.

### N4. Botões da barra do simulado sem área de toque de 44 px no celular
- **ERRO** (alvo de toque de 44 px).
- Tela: simulado em andamento, a 390 claro e escuro.
- O que está:
  - "Folha de respostas" tem 32×38 px. A 21 px à direita do centro, o toque cai no cronômetro (`.crono`).
  - "Sair" tem 32×30 px. A 21 px à direita, o toque não cai em nenhum botão.
- Na tela da questão comum, os mesmos testes passam.
- Onde: `app/src/estilo/sistema.css:525` (`.questao-tela.simulado .q-barra .folha-btn { width: 32px }`). A área invisível vem de `app/src/estilo/app.css:262-265`.
- Como corrigir: mais espaço entre a folha e o cronômetro, ou a área invisível limitada ao vão livre, como foi feito no Pausar e no Tela cheia da questão.

### N5. Seta solta apontando para o vazio no fluxo a 390
- **ERRO** (nada desalinhado).
- Tela: qui Pfb275ecd, resolução animada, passo 2, a 390 claro.
- O que está:
  - a primeira cadeia desce em coluna ("O entre dois C, sem C═O", seta para baixo, "éter");
  - na segunda, a caixa "C≡N no anel de cima" fica com a seta horizontal "⟶" apontando para a margem direita, e "nitrila" cai sozinha na linha de baixo, sem seta chegando.
  - A 1280 as duas cadeias ficam em linha e estão certas.
- Print: `r3-questao-correcao-final-qui-Pfb275ecd-390-claro.png`.
- Como corrigir: aplicar à segunda cadeia a mesma regra de coluna da primeira quando não couber.

### N6. Quebra que separa a incógnita da sua igualdade
- **ERRO** (leitura da conta).
- Tela: fis P19eed56c, passo 1, a 768 escuro e a 390.
- O que está: "… com 6 intervalos entre eles → T" termina a linha, e "≈ (29,3 − 21,0)/6 ≈ 1,4 s" começa a seguinte. O "T" fica sozinho no fim da linha de cima, longe da conta que o define.
- Onde: regra de quebra antes de "≈" e "=" numa igualdade encadeada (`app/src/estilo/correcao.css:94-99`, `quebrasConta` em `motorConta.ts`).
- Como corrigir: quebrar depois da seta "→", e não antes do "≈" que vem logo após a incógnita.

### N7. Caixa de fórmulas da Teoria mistura duas letras
- **ERRO** (`DESIGN.md`: fórmula do caderno em Caveat; a mesma peça com uma letra só).
- Tela: aba Teoria de mat P49729ace, a 1280 claro.
- O que está: na mesma caixa, "x% de A = (x/100) · A" e "total = parte/(x/100)" saem em Caveat. Já "variação = (novo − antigo)/antigo" sai em Familjen pequena, como se fosse texto.
- Onde: a escolha vem de `contaEhTexto` (`app/src/logica/fracao.ts:491`), que trata como texto a fórmula escrita com palavras.
- Como corrigir: na lista de fórmulas, uma igualdade com "=" vai sempre para a letra da fórmula; só a linha sem "=" ("pontos percentuais: diferença simples") fica em texto.
- Print: `r3-questao-correcao-teoria-P49729ace.png`.

### N8. Resultado do simulado por conteúdo sem a cor da matéria
- **DECISÃO DO DONO** (mudança visual).
- Tela: `/simulado/resultado/…` de um simulado por conteúdo de Matemática, nas 4 larguras.
- O que está: a página de configuração do mesmo simulado usa a cor da matéria (`sim-config folha m-mat`). No resultado, o anel do percentual, os pontinhos e as barras de "Por conteúdo" ficam pretos ou cinza.
- Opção: aplicar `m-<matéria>` no resultado do simulado por conteúdo, para o anel, as barras e os pontinhos ficarem na cor da matéria. O simulado de prova inteira continua neutro.
- Print: `r3-questao-correcao-sim-resultado-full-390-claro.png`.

Total: 7 ERROS, 1 DECISÃO DO DONO
