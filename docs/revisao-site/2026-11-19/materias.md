# Revisão do site — parte "matérias" (19/11/2026)

Revisor independente (não corrigiu nada). Build servido em http://localhost:4190 (ramo `app-prototipo-completo`).
Escopo: página da matéria, cada tema, escada "Treine sua evolução", teoria em cartões, flashcards e treino geral das 9 matérias.
Matriz completa (390, 768, 1280, 1440 × claro, escuro) em Biologia, Matemática e Português; nas outras 6, 390 claro e 1280 escuro, e todos os 106 temas abertos em 1280 claro.
Prints: `qa-mat-*.png` no scratchpad da sessão (não versionados).

Gravidades: **erro** · **diferença do sistema** · **sugestão (dono)** = exige decisão do dono.

## Problemas

### Conteúdo e informação

1. **A escada entrega a resposta** — `/m/<m>/escada/<sub>`, todas as larguras e temas, `.degrau b` = `q.conceito` (`app/src/telas/Escada.tsx:132` e `:148`). Em cerca de 20 questões de Biologia o texto traz a letra certa antes de o aluno responder:
   - "A incorreta é a E: o transporte ativo…" (Unespar 2024, q. 35, B01.2)
   - "…a D liga esse transporte ativo…" (UFRR 2025, q. 19, B01.2)
   - P55affe4d "A incorreta é a C…"; P04840c21 "A afirmação incorreta é a D…"; P73f873db "A afirmação incorreta é a A…"
   - Outros: Inglês P9fba3516, P32054f14; Química P4a404e80; Português P49f378e.
   - Deveria: o `conceito` exibido na escada nunca cita a letra (princípio 5). **Erro.**

2. **`**` literal na teoria de Português** — `/m/por/tema/P10?aba=teoria`, todas as larguras e temas, `.cartao-teoria p`: “**As obras** de Frida Kahlo **são**…”, “**Havia** muitos problemas”. Os 177 cartões de Português têm `**` em `por/materia.json`; nenhuma outra matéria tem. Deveria: negrito renderizado ou `**` removido dos dados. **Erro.**

3. **Contagens que se contradizem** — Citologia: na matéria "0 de 152 feitas" (`.at-txt small`); no tema `/m/bio/tema/B01` "0 de 60 respondidas", aviso "Só 3 questões do ENEM neste tema" e "Ver de outras regiões (149)". Na mesma lista de conteúdos o critério muda: "Membrana plasmática 0/1" (só ENEM; o banco tem 39) ao lado de "Transporte ativo 0/14" (todas as regiões, porque não há ENEM). Igual em Pré-socráticos (fs/L01): "3 do ENEM" × "0 de 4". Deveria: um critério só na matéria, no tema, na lista e no aviso (DESIGN.md, "Filtro de região"). **Erro.**

4. **Quantidade de questões na matéria e no tema** (CLAUDE.md: só nos conteúdos):
   - Matéria: "Meu progresso" `.mp` "de 2.907 questões resolvidas"; lista por área "6 conteúdos · 0 de 152 feitas" (`app/src/telas/Materia.tsx:280`).
   - Tema: `.tp-stat` "0 de 60 respondidas", `.tp-nivel` "0 de 25", `.tp-comp` "60 questões de 6 conteúdos" (`app/src/telas/Tema.tsx` ~133, ~142, ~150).
   - Vale nas 9 matérias. O DESIGN.md ("Tema") prevê "N questões de K conteúdos" e contradiz o CLAUDE.md. **Erro** (contradição a decidir pelo dono).

5. **Flashcards citam sites didáticos** — `/m/<m>/flashcards/sessao`, verso, `.fc-fonte a`:

   | Site | Bio | Quí | Mat | Por |
   |---|---|---|---|---|
   | Brasil Escola | 15 | 3 | 1 | – |
   | Mundo Educação | 5 | – | – | – |
   | InfoEscola | – | 12 | – | – |
   | Prepara Enem | – | 11 | 4 | 2 |
   | Toda Matéria | 27 | 30 | 47 | 36 |

   A regra de 05/11 ("nem nome") foi escrita para questões. **Sugestão (dono).**

6. **Física, História, Geografia, Inglês e Filosofia e Sociologia sem nenhum flashcard nem frase para completar** — treino geral só de questões. `/m/fis/flashcards` (pelo endereço) mostra "0 cartões", botão desabilitado "Tudo em dia" e "Volte amanhã para a revisão dos que você já viu" (falso); a sessão diz "Nenhum cartão para agora". **Erro** (conteúdo faltando e mensagem enganosa).

7. **Glifo "✗" no caderno da teoria de Português** — tema P10 (pontuação): "sujeito ✗ verbo", "verbo ✗ complemento". Ícone de glifo é proibido (DESIGN.md, Regras de base). **Erro.**

8. **"Imagem em preparação" visível ao aluno** — Resumo da escada (B01.2, M05.2…): quadro tracejado descrevendo imagem inexistente. Material incompleto não vai ao ar (princípio 3). **Erro.**

9. **Figuras da teoria ilegíveis, repetidas e com legenda técnica** — `/m/por/tema/P10?aba=teoria`, 1280 claro: a mesma figura ("Concordância verbal: casos frequentes") em dois cartões vizinhos, em miniatura ilegível; legenda "Desenho original (SVG gerado por código, Python)" / "Gerado por código (Python, SVG…)" em `small` 11,25px. Mínimo do sistema: 13,5/14px (`--fs-info`, DESIGN.md "Tipografia"). **Erro** (tamanho) e **sugestão** (texto e repetição).

10. **Temas repetidos em duas áreas** na página da matéria — Bio: B08 em "Corpo humano" e "Saúde e parasitologia"; B12 em "Saúde e parasitologia" e "Evolução e diversidade". Quí: Q03, Q08, Q10, Q12 em duas áreas cada. Por: P08 e P09. **Sugestão (dono).**

11. **Nomes de temas e conteúdos** — **sugestão (dono)**:
    - H02 "Idade Média" inclui Renascimento, Reformas, absolutismo e expansão marítima (Idade Moderna).
    - H03 "Brasil Colonial" inclui "povos pré-colombianos e conquista espanhola" e "colonização espanhola e inglesa na América".
    - F01 "Fundamentos e grandezas" inclui relatividade, fóton e física nuclear.
    - B07 "Fisiologia humana I" sem "II"; B08 começa com a abreviação "Neuro".
    - B12.3 "tecidos vegetais, xilema" incompleto (falta floema).
    - M13.9 "combinatória e probabilidade — outros casos", M08.6 "áreas básicas", M11.6 "volumes básicos" vagos.
    - M11.5 com barra ("densidade/volume"); Q03 "nox" minúsculo.
    - Maiúsculas inconsistentes: "Brasil Colonial", "República Brasileira" × "Genética molecular", "Divisão celular".
    - Frase da escada "para você subir de nível com base" soa estranha.
    - Não há erro de grafia nos 106 temas e nos subtemas.

12. **Subtemas sem questão somem da lista do tema sem aviso** — fs L01.5 sofistas, L08.4 Camus e o absurdo, S06.3 movimentos do campo e luta pela terra. **Sugestão.**

13. **Migalha da escada termina em "Conteúdo"** em vez do nome do conteúdo ("Biologia › Citologia › Conteúdo"); em 390 essa palavra cai sozinha numa linha. **Sugestão.**

14. **Flashcards sem a faixa de temas no topo** — `/m/<m>/flashcards` só tem título e capa. CLAUDE.md: "Faixa de temas sempre no topo da matéria". **Diferença do sistema.**

### Sistema de design

15. **Chip** `.chip` (filtro de região, "Curtiu? Sim/Não"): 15px, peso 600, entrelinha 1. Deveria 14,5px peso 500 (`app/src/estilo/app.css:209`, DESIGN.md "Chip"); sobrescrito por `app/src/estilo/tipografia.css:84`. **Diferença do sistema.**

16. **Lista por área apertada em 1280** — `.area-lista` em 3 colunas de 289px; mínimo 340px (`app/src/estilo/telas.css:142`, DESIGN.md "Folha das áreas"); forçado por `telas.css:689-691` (corte em 1279). "Neuro, hormônios, imune e reprodução" em 4 linhas, "Sócrates, Platão e Aristóteles" em 3, barra de ~90px. **Diferença do sistema.**

17. **Capa do Treino geral (1280 e 1440)**:
    - arte visível (230×190 e 260×210); pelo DESIGN.md some entre 1101 e 1500px;
    - `.btn-capa` 293px e 364px; mínimo 380px;
    - `.tg-n` 91×114 e 115×114; padrão até 170px (~170×102); "Questões de prova" em 2 linhas;
    - `.tg-n i` 12,5px, abaixo de 13,5px.
    **Diferença do sistema.**

18. **Etiquetas** `.etq` (Processo, Novo, Básico, Complete a frase) com `border-radius: 999px`; DESIGN.md: canto 8. **Diferença do sistema.**

19. **Contraste < 4,5:1** — `.fr-trocar` "Trocar" sobre o fundo: Bio 4,34, Quí 4,18, Fís 4,38 (claro, 390 e 1280). `.nivel-etq` Básico/Intermediário em Bio: #138404 sobre #E3FCE0 = 4,45. **Erro.**

20. **Alvos de toque < 44px (390)** — chips de região 31px (26px no treino); "Trocar" 44×15; "Ver de outras regiões" 14px de altura; migalhas 32px; `.btn.peq` "Treinar básico" 38px; `.sanfona` 36px; Voltar e Tela cheia da sessão 32×30 e 32×32; "Curtiu? Sim/Não" 27px; setas da faixa 40px; Dia/Noite 39×29. **Erro.**

21. **Setas da faixa cobrem o nome do tema** — `.ft-seta.esq` sobre "Período composto" (768 escuro) e "Literatura: do Barroco…" (390 escuro), na faixa compacta do tema e da escada. **Diferença do sistema.**

22. **Ícone do cabeçalho do tema** `.tp-ic` com 74px em 390; `docs/icones/ONDE-USAR.md` fixa 100px. **Diferença (dono decide se o celular reduz).**

23. **Dois estilos de caixa de aviso na teoria** — "Erro que mais derruba" em Familjen 16px; "Cuidado" de cada cartão em Literata 17px. **Diferença do sistema.**

24. **"Meu progresso" e capa do treino desequilibrados** — em fs a capa tem um contador sozinho; em Bio (1280) e fs, "Meu progresso" fica com vazio grande embaixo (altura da capa, 471px a 1280). Dias do gráfico com letras ambíguas ("S S D S T Q Q"). **Sugestão.**

25. **"Tema todos"** em minúscula no filtro da página de Flashcards. **Sugestão.**

26. **"0/6" e "0/14" com barra** no placar do "Treino concluído" e no contador de cada conteúdo do tema; a regra de fração empilhada não lista placar como exceção. **Sugestão (dono).**

### Menores

27. **Treino geral sem capa própria** — `/m/<m>/treino` abre direto na questão 1; a capa fica na página da matéria. **Sugestão.**
28. **Rótulo cortado na barra do treino** — fs, 1280 escuro, "Treino geral · 1 de 15" truncado (`.t.num`). **Erro.**
29. **Chips de região em 2 linhas a 1280** dentro da coluna de 880px ("Centro-Oeste" sozinho). **Sugestão.**
30. **Ícone parecido** — M16 "Polinômios e complexos" usa gráfico de função muito parecido com o de M05. **Sugestão (dono).**

## O que foi conferido e passou

- Nenhuma rolagem lateral em nenhuma tela, largura ou tema.
- Fundo tingido no tom de cada matéria, nos valores do DESIGN.md (ex.: Bio #EEF4EA claro, #0F1A12 escuro); nenhum fundo ou cartão branco/preto (o único branco é o papel do print da prova, exceção prevista).
- Título da matéria em Dancing Script 700, 54px (computador) e 42px (celular), na cor `--t` certa nos dois temas, nas 9 matérias.
- Faixa de temas logo abaixo da capa nas 9 matérias; os 106 ícones carregam e são os `ic/<id>.webp` certos (faixa, lista por área e cabeçalho dos 106 temas em 1280 claro); nenhum faltando.
- Faixa: nomes sem corte; tema atual destacado; roda do mouse rola a faixa sem rolar a página; ícone salta 10px no hover e no foco pelo teclado; foco visível de 2px na cor da matéria.
- Subtemas com pontinho de 8px na cor da matéria, sem ícone, nos 106 temas e na faixa do flashcard.
- Escada: níveis Básico/Intermediário/Avançado, filtro de região, aviso de região, "Teoria antes de começar".
- Flashcards: frente, verso, resposta-modelo, erro comum, fonte e "Curtiu este cartão? Sim/Não".
- Treino geral (Bio): mistura questão, flashcard e frase para completar; termina em "Treino concluído" (6, 5 e 4).
- Sem erro de console, requisição falhando, imagem quebrada, emoji ou texto em inglês na interface.
