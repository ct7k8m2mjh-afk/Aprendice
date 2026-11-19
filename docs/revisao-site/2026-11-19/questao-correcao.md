# Revisão do site, 19/11/2026: questão e correção

Revisor independente (só leitura, nada corrigido). Site em http://localhost:4190, build do commit e6b9c5533 (ramo app-prototipo-completo).

Escopo: 145 aberturas de questão nas 9 matérias. Matriz completa (390/768/1280/1440, claro e escuro) em Matemática, Biologia e Português; nas outras matérias, 390 claro e 1280 escuro. Em cada matéria: uma questão básica, uma intermediária e uma avançada (respondidas errado), uma respondida certo, uma com Gabarito do Aprendice, uma questão indisponível (quando existe), uma só de texto e uma com figura. Também a Questão Aprendice da revisão essencial de Química (`/m/qui/essencial/Q01`).

Questões usadas:

| Matéria | Básica | Intermediária | Avançada | Gabarito do Aprendice | Indisponível | Só texto | Figura |
|---|---|---|---|---|---|---|---|
| bio | P6a0081fa | P2d058bf | P2a35fc65 | P6bb641ed | Pbd81dec9, P1310e5f6 | Pb570d83 | P10a1825 |
| qui | Pa444a65 | P3f9c475 | P6022027d | Pfb275ecd | Pecd73277 | P1a742a2 | Pea7d145 |
| mat | Peefb04b4 | e7a3ade5 | P49729ace | Pa9eb4212 | P6fc4c995 | eafcd1cf | 8196566b |
| fis | P36e40b31 | Pa3856771 | P19eed56c | P6478b5c2 | P8cad75ee | Pd70a0c7f | Pa3856771 |
| por | P496959b | Pdf25eee | P8525e8b6 | P2b7fd49f | Pcfeab3fb | Pdf25eee | Pfddef24 |
| geo | P5b2faf4b | P3eeff267 | P92f19030 | Pdf30965c | Pf675553a | P48755ad4 | P89f346e0 |
| his | P0e7ff395 | P1f24c6dc | P54e7a65d | P0c2676f4 | (nenhuma) | P6cf63570 | Pd86b11b5 |
| ing | Pbb2709e3 | P0a9cb507 | Pc765a862 | Pdca19115 | (nenhuma) | Pbc807da8 | P0a9cb507 |
| fs | P79c7da1d | Pf18d817b | P384c9012 | Pe78466f8 | (nenhuma) | Pf6ee2445 | P8ff3c488 |

Prints e dados brutos (temporários): `/tmp/claude-0/-home-user-aprendice/c827fc79-4b7e-5006-8476-c0943dc5eb0f/scratchpad/` (`qa-q-*.png`, `qa-q-saida-<m>.json`).

## Problemas

### 1. A letra marcada não fica vermelha nem verde depois de responder
- Gravidade: **erro**.
- Tela: questão (`/m/<m>/q/<id>`), todas as larguras, temas e matérias.
- Elemento: `.q-bolhas .alt.sel.errada` e `.q-bolhas .alt.sel.certa`.
- O que está: a letra continua na cor da matéria. Medido: Física `rgb(178,88,13)` sobre `rgb(255,240,232)` na errada; Matemática `rgb(31,63,166)` na certa.
- Causa: `app/src/estilo/tipografia.css:118` (`.q-bolhas .alt.sel`) é carregado depois e vence `app/src/estilo/sistema.css:134-135` (mesma especificidade).
- O que deveria: errada em `--errado` (#B3302A) sobre `--errado-bg` (#FCEAE7); certa em `--certo` (#0A7550) sobre `--certo-bg`. No protótipo (`app-atual/design/materia.css:297-300`) a letra ainda leva um ícone de "certo" ou "x" no canto.
- Print: `qa-q-crop2.png`.

### 2. A aba Fonte contradiz o Gabarito do Aprendice
- Gravidade: **erro** (princípio 2).
- Tela: questão, aba Fonte (`.q-fonte-aba`), linha "Gabarito".
- O que está: "Publicado (oficial ou resolução reconhecida)" nas 9 questões com gabarito do Aprendice testadas (bio P6bb641ed, qui Pfb275ecd, mat Pa9eb4212, fis P6478b5c2, por P2b7fd49f, geo Pdf30965c, his P0c2676f4, ing Pdca19115, fs Pe78466f8). O cabeçalho da correção das mesmas questões diz "Gabarito do Aprendice: a banca não publicou gabarito oficial".
- Causa: `app/src/ui/QuestaoCartao.tsx:235` só trata o caso `indisponivel`.
- O que deveria: usar `origemGabarito(q)` (`app/src/dados/tipos.ts:77-79`).

### 3. O aviso do Gabarito do Aprendice só aparece depois de responder
- Gravidade: **sugestão que exige decisão do dono**.
- O que está: antes de responder não há etiqueta nenhuma; depois, o aviso aparece só em texto fraco de 14px (`.res-cab .fraco`, cor `--fraco`).
- Referência: princípio 2, "a questão aparece com o aviso".

### 4. Questão só de texto perde o sublinhado da prova
- Gravidade: **erro** (princípio 1).
- Exemplo: por Pdf25eee (Einstein 2020, questão 9), todas as larguras. O enunciado diz "o termo sublinhado pode ser substituído", mas na transcrição nada está sublinhado; no print oficial (`provas/einstein-2020/q/009.webp`), "trai" está.
- Causa: `TextoBanca` (`app/src/ui/QuestaoCartao.tsx:32`) só entende `**negrito**` e `~~itálico~~`.
- Alcance: 71 transcrições citam "sublinhado" (por 43, ing 25, bio 2, his 1).
- Também: o recuo de parágrafo da prova some.

### 5. Transcrição guarda as quebras de linha do PDF no meio da frase
- Gravidade: **diferença do sistema** (princípio 1, "organizada como a banca organizou").
- Exemplo: bio P6a0081fa a 1280: "…de Edu Lobo e / Chico Buarque." e "…as quais pertencem, / respectivamente, aos reinos". A linha quebra em cerca de 600px, num cartão de 930px.
- O que deveria: parágrafo de prosa corrido; quebra só onde a banca quebrou de propósito (versos).
- Print: `qa-q-bas-bio-P6a0081fa-1280-claro-1antes-vp.png`.

### 6. Em Matemática e Física, a "resolução animada" mostra só o resultado de cada passo
- Gravidade: **erro** (CLAUDE.md, "Resolução animada": conta passo a passo, termos se movendo).
- Exemplo: mat Peefb04b4 (UEA 2025, q. 8). Aparece "540 total / 315 P, Q, R / 225/45 = 5 S", sem número de passo, sem explicação e sem a conta que leva ao 540 (120 × 4,5) e ao 315 (20 × 6 + 30 × 4 + 25 × 3), que estão nos `passos` do dado.
- Causa: quando existe `res.quadro`, o motor usa só ele e ignora os `passos` (`app/src/logica/motorConta.ts:983-1008`).
- Alcance: 3216 de 3787 resoluções em Matemática e 2772 de 2773 em Física têm `quadro`; Química 1657 de 3007; Biologia 90 de 2911. Mesmo formato em mat P49729ace e fis P19eed56c.
- Prints: `qa-q-t1-mat-Peefb04b4-1280-claro-3anim-fim.png`, `qa-q-av-mat-P49729ace-1440-claro-3anim-fim.png`.

### 7. O que se cancela não é riscado
- Gravidade: **erro** (CLAUDE.md: "o que se cancela é riscado").
- O que está: 0 riscos (`.ra-risco`) em todas as animações testadas. Exemplo: fis P6478b5c2, passo "cancela m" (μ × m × g = m × v²/R → μ = v²/(R × g)): o m não é riscado.
- Print: `qa-q-ga-fis-P6478b5c2-1280-claro-3anim-fim.png`.

### 8. Biologia e parte de Química não animam o processo
- Gravidade: **erro** (CLAUDE.md: "Biologia e Química: animação do que acontece — processo, estrutura, reação, molécula, fluxo").
- O que está: em bio P6a0081fa e P2d058bf, e qui Pa444a65, P3f9c475 e P1a742a2, nada se mexe na tela (movimento medido 0). São frases em caixas, entrando uma por vez, com marca-texto.
- Bio P2a35fc65 (heredograma): frases inteiras em Caveat ("só homem afetado + variante passando por mulheres que não manifestam →"), sem desenhar o heredograma. A Caveat é para conta; aqui está em texto corrido.
- Separadores crus visíveis: "heterozigota não manifesta |" e "I correto | II correto | III falso | IV falso → C". Também em Português (por P8525e8b6, passo 4: `A: "…" | B: "…"`).
- Print: `qa-q-av-bio-P2a35fc65-1280-escuro-3anim-fim.png`.

### 9. "Por que eu errei" muitas vezes não explica o raciocínio do aluno
- Gravidade: **erro de conteúdo** (princípio 5 e "A correção da questão": "o que faltou no raciocínio de quem marcou aquela letra").
- Exemplo: mat Peefb04b4, letra A: "2 não confere: daria 315 + 90 = 405 convites, média 3,375." Só testa a alternativa.
- Alcance (`erradas` que começam com "não confere"): Matemática 5690 de 14268 (40%), Química 2276 de 11183 (20%), Física 1473 de 10345 (14%), Biologia 1046 de 10706 (10%), Português 71 de 18381.
- Em Português (por P8525e8b6) o texto não diz de qual alternativa fala: "Fala em aproximação do amado…" e, na pegadinha, "A cita a morte…" (o "A" se lê como artigo).

### 10. Fração na mesma linha na aba Teoria do painel
- Gravidade: **erro** (CLAUDE.md: "Fração sempre empilhada… nunca 3/5 ou 3 ÷ 5 na mesma linha").
- Exemplos:
  - mat Peefb04b4: "(6 · 2 + 8 · 3)/(2 + 3) = 36/5 = 7,2" e "x̄ = Σ(xᵢ · pᵢ) / Σpᵢ";
  - mat e7a3ade5: "400 · (4/5) · (10/8) = 400 peças";
  - mat P49729ace: "volume = 300 ÷ 20 = 15 mL";
  - mat Pa9eb4212: "0,333… = 1/3" e "ℚ = {a/b; a, b ∈ ℤ, b ≠ 0}".
- Na correção não vi fração na linha; o que apareceu com barra eram unidades (m/s, km/h, mol/L, hab/km²).

### 11. Texto da "Questão indisponível" fica escondido atrás das abas do celular
- Gravidade: **erro**.
- Tela: bio P1310e5f6 a 390 (claro e escuro).
- Elemento: `.q-resp.q-indisp` / `.q-indisp-txt`. O texto vai de y=747 a 789, mas a barra fixa `nav.tabs` começa em y=774: "Só para consulta." fica coberto.
- CSS: `app/src/estilo/sistema.css:119-123` e `:168`.
- Print: `qa-q-ind2-bio-P1310e5f6-390-escuro-1antes-vp.png`.

### 12. Contraste abaixo de 4,5:1 na etiqueta de nível (13px)
- Gravidade: **erro**.
- Elemento: `.q-meta .etq.nivel` (também a letra marcada, por causa do item 1).
- Claro: Física 4,40 (`rgb(178,88,13)` sobre `rgb(255,240,232)`), Química 4,37 (`rgb(211,26,141)` sobre `rgb(255,238,245)`), Filosofia e Sociologia 4,47 (`rgb(140,108,2)` sobre `rgb(255,243,213)`).
- Escuro: História 3,94 (`rgb(183,123,76)` sobre `rgb(71,35,2)`), Inglês 3,99 (`rgb(254,62,58)` sobre `rgb(75,29,31)`), Geografia 4,48 (`rgb(89,160,171)` sobre `rgb(0,53,59)`).
- Referência: `DESIGN.md:64`, cor da matéria ≥ 4,65:1 no cartão.

### 13. Botões menores que 44px no celular
- Gravidade: **erro**.
- Medidas a 390, em todas as matérias:
  - Voltar (`.q-volta`) 32×30; Pausar (`.q-pausa`) 32×32; Tela cheia (`.q-tela`) 32×32 (`app/src/estilo/sistema.css:26, 44, 48`); marcador (`.q-marca`) 36×36;
  - Ampliar (`.q-amplia`) 85×28; fonte no pé do print (`.q-print-fonte`) 50–86×20; "Ver em texto" (`.q-ver-txt`) 218×27;
  - chips de certeza (`.certeza .chip`) 106×30; Dica (`.q-dica`) 73×37; links de conteúdos relacionados (`.q-rel a`) 324×34;
  - controles da animação (`.ra-bt`) 36×36.

### 14. A fonte da questão some do topo no celular
- Gravidade: **diferença, exige decisão do dono**.
- O que está: até 700px a etiqueta "UEA 2025 · Conhecimentos Específicos – Exatas · questão 8 · Vunesp" fica oculta (`app/src/estilo/sistema.css:94`, `.q-meta .q-fonte { display: none; }`). Sobra só o nome da banca no pé do print, depois de rolar; ano e número da questão não aparecem antes de responder.
- Referência: princípio 1 (fonte com prova, ano, número, link).

### 15. Print muito miúdo a 390
- Gravidade: **sugestão**.
- O print de 548–1000px vira 328px (60% ou menos), e a letra fica com uns 8–9px. Exemplos: mat Peefb04b4, bio P1310e5f6. Só dá para ler pelo "Ampliar".

### 16. Espaço duplo na etiqueta da fonte
- Gravidade: **diferença**.
- O que está: "Cederj 2026  · 2026.2", "UEA 2025  · Conhecimentos…": sobra espaço entre o `<b>` e o " · " em `.q-fonte` (`app/src/ui/QuestaoCartao.tsx`, `EnunciadoQuestao`).

### 17. Nome de conteúdo com maiúscula errada
- Gravidade: **erro de português**.
- O que está: "PH, pOH e hidrólise de sais" (qui Pea7d145, etiqueta e barra). `cap()` deixa a primeira letra maiúscula; deveria ser "pH".

### 18. Provas anteriores a 2020 aparecem
- Gravidade: **sugestão que exige decisão do dono**.
- Exemplos: "Fatec 2017/2" (mat e7a3ade5), "Santa Casa (FCMSCSP) 2018" (qui Pea7d145), Einstein 2019 (bio P0a240e7).
- Alcance no banco visível: Matemática 192, Português 142, Química 113, Biologia 69.
- Referência: CLAUDE.md, "Meta: provas de 2020 a 2026… provas anteriores a 2020 não são baixadas".

### 19. "Caderno da prova oficial" com link de cursinho
- Gravidade: **sugestão** (princípio 10, registro da origem).
- O que está: a aba Fonte ("Origem: Caderno da prova oficial") e o rodapé da correção ("Fonte: caderno de prova") aparecem mesmo quando o link é um PDF de cursinho (ex.: curso-objetivo.br na bio P0a240e7).
- Alcance: cerca de 3.400 questões (por 716, mat 576, ing 384, qui 343, bio 341, geo 335, his 329, fis 276, fs 94).
- Código: `app/src/ui/Resolucao.tsx:96` e `app/src/ui/QuestaoCartao.tsx:233-234`.

### 20. Questão Aprendice da revisão essencial fora do formato de correção
- Gravidade: **erro** (CLAUDE.md, "A correção da questão": só 4 blocos, nesta ordem).
- Tela: `/m/qui/essencial/Q01`, item "Questão resolvida", 1280 claro e 390.
- O que está: depois de responder errado aparecem só "Você marcou A. A resposta é C.", a resolução animada e "POR QUE ERRAM" (todas as armadilhas juntas).
- Falta: "Por que eu errei" para a letra marcada, "Resposta correta + a pegadinha" e "Por que as outras estão erradas" (fechado).
- "POR QUE ERRAM" está em maiúsculas espaçadas (`app/src/estilo/revisao.css:313`), o rótulo-chamada que `DESIGN.md:15` proíbe. O rótulo "Questão resolvida" se repete logo acima do título "Questão resolvida".
- Código: `app/src/telas/RevisaoEssencial.tsx:183-219`.
- Passou: a etiqueta "Questão Aprendice" com a frase "Questão nova, no estilo das provas, escrita para esta revisão."
- Só existem Questões Aprendice em Química (revisões Q01, Q06 e Q07); nenhuma no banco de questões.
- Prints: `qa-q-aprendice-1280-claro-*.png`, `qa-q-aprendice-390-escuro-*.png`.

### 21. Expoente "10" ilegível na conta à mão
- Gravidade: **diferença**.
- O que está: em "3d¹⁰" (Questão Aprendice de Química, Q01), o "10" em Caveat pequeno se lê como "ᴾ". O índice "ᵃ" em "XᴬXᵃ" (bio P2a35fc65) também fica minúsculo.
- Print: `qa-q-crop1.png`.

### 22. Aspas retas no texto da resolução
- Gravidade: **sugestão**.
- Exemplo: por P8525e8b6: "Viva chama de ardente paixão," e 'uns olhos' com aspas retas, em vez de “ ” e ‘ ’.

## O que conferi e passou
- **Funcionamento geral:** nenhum erro de console, nenhuma requisição falhou, nenhum print quebrado e nenhuma rolagem lateral nas 145 aberturas e nas 8 combinações de largura e tema.
- **Antes de responder:**
  - print carrega, com "Ampliar" (abre em tamanho natural, Esc fecha) e link da fonte no pé;
  - "Ver em texto (leitor de tela, busca)" nas questões com print; "Ver a questão original (print da prova)" nas questões de texto;
  - transcrição com negrito, itálico e versos (ing Pbb2709e3: 16 itálicos; fs P384c9012: 5 itálicos; bio P6a0081fa: versos em negrito) e com a fonte entre parênteses no começo;
  - etiqueta de nível coerente com a dificuldade (básico, intermediário, avançado);
  - marcador "Revisar depois";
  - cronômetro "Total" e "Questão" correndo; tecla P pausa e esconde a questão;
  - teclado: A–E e 1–5 escolhem, Shift+letra risca, H mostra a dica, Enter confirma e avança; foco visível (contorno de 2px na cor da matéria).
- **Correção, sempre nesta ordem:** cabeçalho → 1 "Por que eu errei" (só quando erra; some quando acerta, conferido nas 9 matérias) → 2 "Resposta correta" + "A pegadinha" → 3 resolução → 4 "Por que as outras estão erradas" (fechado nos 145 casos, abre ao clicar, não repete a letra marcada) → rodapé com a fonte.
- **Resolução por matéria:** animada só em Biologia, Química, Matemática e Física; texto passo a passo em Português, Geografia, História, Inglês e Filosofia e Sociologia. Todas as animações rodaram até "Assistir de novo"; contas em Caveat; frações empilhadas na animação e nos textos da correção. Termos se movem em Matemática (intermediária e avançada) e Física.
- **Medidas que batem com o protótipo:** letras com 50px de altura, canto 12, 600 18px (`materia.css:1786`); botão "Assistir resolução" 600 17px, padding 13/22 (`materia.css:1380`); controles da animação 36px (o mínimo de toque fica no item 13).
- **Questão indisponível** (bio, qui, mat, fis, por, geo): sem alternativas e sem correção, com rótulo "Questão indisponível", abas Teoria e Fonte e o motivo na aba Fonte.
- **Painel lateral:** abas Resolução, Teoria e Fonte (setas do teclado trocam de aba) e "Conteúdos relacionados" com pontinho na cor da matéria.
- **Fundo:** véu da cor da matéria e cartão levemente tingido; nenhum fundo branco ou preto puro fora do print (papel da prova) e do caderno.
