# Revisão do site, 3ª rodada, 2ª passada: parte "matérias" (22/11/2026)

Revisor independente: só aponta, não corrige nada. Build servido em http://localhost:4191, commit `dc33dfbd`.
Escopo: só o que mudou desde `82d57265` e os achados N1–N3 da 1ª passada (`materias.md`). N4 é decisão do dono e não
foi reaberto. Mudanças conferidas: `a1508d19` (N1, figuras), `bfb959b8` (N2, cartões de nível), `dc33dfbd` (N3,
revisão essencial).

Método: Playwright/Chromium, deviceScaleFactor 1 (2 nos recortes das legendas), espera de 3,4 s pela abertura animada,
modo demonstração (perfil no `localStorage`).
- **N1:** (a) script que decodifica todas as figuras servidas (`dist/conteudo/<m>/figuras.json`), lê o texto de cada
  `<text>` e procura "a/b"; (b) comparação, figura por figura, do texto desenhado novo com o original de
  `app-atual/<m>/img/<mod>.json` (mesma ordem, tirando só espaços, parênteses, "/" e "^", com sub/sobrescritos
  normalizados); (c) varredura de sobreposição entre textos (`getBBox`) e de texto para fora do `viewBox`, novo contra
  original; (d) 21 figuras abertas na aba Teoria dos temas em 390 claro/escuro, 768 claro, 1280 claro/escuro e 1440
  escuro (126 prints `r3-materias2-fig-*.png`), olhados os de 1280 escuro e 390 claro, mais o original lado a lado
  com o novo nas figuras que o script apontou; (e) leitura das 485 legendas de figura de Mat/Quí/Bio/Fís.
- **N2:** escadas His H01.1, Bio B01.1, Filo/Soc L01.1, Geo G03.1, Ing I01.1 e Fís F01.1, em 390/768/1280/1440, claro e
  escuro (48 medições), contraste de cada texto dos cartões composto sobre o fundo real.
- **N3:** `/m/qui/essencial`, `/m/bio/essencial`, `/m/fis/essencial` e, para comparar, `/m/qui/flashcards` e
  `/m/qui/tema/Q01`, nas mesmas 8 combinações.
Prints no scratchpad: `r3-materias2-*.png` (não versionados).

Classificação: **ERRO** · **DECISÃO DO DONO**.

## 1. Situação de N1–N3

| Item | O que era | Situação | O que se vê agora |
|---|---|---|---|
| N1 | Fração em linha e "^" dentro das figuras da teoria | **resolvido no desenho; parcial nas legendas** | **Contagem por script:** nenhuma fração em linha sobrou no `<text>` das figuras de Mat (157 únicas), Quí (292) e Bio (217); Fís não tem figuras. Os "a/b" que restam são unidades (mg/mL, mol/L, g/L, kJ/mol, mg/dL, g/cm³), notação (`% (m/V)`, E°(Cu²⁺/Cu), K₂Cr₂O₇/H⁺), pares e listas (DNA/RNA, V/v, AB/ab, Na⁺/K⁺, T₃/T₄, "+ / −", G1/S, ¹⁵N/¹⁴N, início/fim, r // s) e "120/80 mmHg": nenhum é fração. "½ O₂" e "t½" de Quí/Bio são notação de química/meia-vida, como na 1ª passada. **Valores:** as 84 figuras corrigidas (Mat 78, Quí 4, Bio 2; 75 títulos) têm o texto desenhado idêntico ao original, na mesma ordem, fora parênteses, espaços, "/" e "^": nenhum número mudou. **Visual:** tabela trigonométrica, triângulo (A = bh/2 = 6·4/2 = 12), exponenciais, logarítmica, meia-vida (Mat e Quí), Cramer, ciclo trigonométrico (14 arcos), quadriláteros, Tales, regra de três, dois dados, esfera, média ponderada, desvio padrão, frações equivalentes, soro fisiológico, isóbaras e Hardy-Weinberg com numerador, barra e denominador, sem nada cortado e sem rolagem lateral. Sobra a fração dupla da PG (R2). Nas legendas ficaram 3 frações em linha (R1). |
| N2 | Cartões de nível com opacidade .72, contraste baixo e cara de desativado com botão ativo | **resolvido** | Sem opacidade (1 em todos). "Vazio" só no nível sem questão nenhuma, que fica sem botão (Bio B01.1, Filo/Soc L01.1 e Fís F01.1 "Avançado · Ainda sem questões neste nível"); o nível com questões de outras regiões fica normal, com o botão. Menor contraste nos 6 conteúdos, 4 larguras, 2 temas: 4,52:1 (etiqueta "Básico" Bio escuro); His "11 questões de outras regiões" 5,55 claro / 5,40 escuro (era 3,15/3,39); Bio "Avançado" vazio 5,63 / 4,99 (era 3,04); Filo/Soc "9 questões de outras regiões" 5,67 / 4,69 (era 3,17). Nenhum texto abaixo de 4,5:1. |
| N3 | Revisão essencial da matéria fora do sistema | **resolvido** | Quí, Bio e Fís: nome da matéria em Dancing Script 700 (42 px em 390, 54 px a partir de 768) na cor da matéria, faixa de temas compacta (mesma classe e altura da dos flashcards: 165 px em 390, 170 px acima), capa `.tp-capa` com "Revisão essencial" em Familjen Grotesk 700 25/32 px (igual a "Flashcards"), lista de Quí ("Átomo e tabela periódica", "Gases", "Termoquímica") dentro da folha `.tp-bloco` (raio 14/16 px, mesmo véu da matéria). Bio e Fís mostram "Em preparação" dentro da folha. Sem rolagem lateral e sem texto abaixo de 4,5:1 nas 24 medições. |

## 2. Achados novos

**R1. Três legendas de figura ainda com fração em linha (expoente e índice).**
- Tela: `/m/mat/tema/M03?aba=teoria` e `/m/mat/tema/M06?aba=teoria`, todas as larguras e temas.
- O que está errado (texto lido no DOM das 485 legendas de Mat/Quí/Bio/Fís):
  - "Decaimento por meia-vida: m(t) = 100·(½)^(t/6)": o ½ empilha, mas o expoente sai `<sup>t/6</sup>`, fração na mesma
    linha (M03 e M06).
  - "Crescimento exponencial: N(t) = 1000·2^(t/20)": expoente `<sup>t/20</sup>` (M06).
  - "Função logarítmica decrescente f(x) = log₁/₂ x": base "₁/₂" em linha, sem nenhuma marcação (M06).
  - No desenho das mesmas figuras o expoente já é fração empilhada ("2^{t/20}", "log_{1/2}"); só a legenda ficou para trás.
  - Nota (não é erro de valor): a legenda "Área do triângulo: A = b·h/2" empilha só o "h" (b·h/2 vira b · (h sobre 2)),
    enquanto o desenho empilha "b·h" sobre 2.
- Onde: `comFracoes` (legenda em `app/src/telas/Tema.tsx:42`) não trata fração dentro de `^( )` nem índice com "/".
- Como corrigir: empilhar a fração também dentro do expoente sobrescrito e do índice (ou corrigir esses 3 títulos na
  camada `figuras-corrigidas`); incluir as legendas no teste de "a/b".
- **ERRO.**

**R2. Fração dupla encavalada na figura da PG.**
- Tela: `/m/mat/tema/M07?aba=teoria`, figura "Progressão geométrica decrescente 64, 32, 16, … (q = ½)", todas as larguras.
- O que está errado: a linha "Sₙ → a₁/(1 − q) = 64/(1/2) = 128" virou fração dentro de fração. O "1" da fração de baixo
  encosta e cruza a barra da fração de cima, logo abaixo do "64" (sobreposição de 3,9 × 1,1 px medida pelo `getBBox`;
  visto em recorte a 4×). Os números da fração interna ficam com cerca de 7 px a 1280 e menos de 4 px em 390.
- Onde: `app/conteudo-fonte/figuras-corrigidas/marcacao.json`, chave "Progressão geométrica decrescente…",
  `{64¦{1¦2}}`, gerado por `app/scripts/figuras_fracao.cjs`.
- Como corrigir: abrir espaço vertical para a fração interna (barra de cima mais alta, ou a linha descer com `\y{}`), ou
  escrever "64 ÷ ½" como "64 · 2 = 128" na figura sem fração dupla (decisão de conteúdo da banca de Mat).
- **ERRO.**

**R3. Figuras de Biologia ilegíveis no tema escuro (texto escuro sobre o cartão escuro).**
- Tela: `/m/bio/tema/<B..>?aba=teoria`, tema escuro, todas as larguras. Visto em Hardy-Weinberg (B11) e Linkage (B06),
  com o aparelho em claro e em escuro (`colorScheme` do Playwright) e o site no escuro.
- O que está errado: as 183 figuras de Bio trazem o próprio estilo com `@media (prefers-color-scheme: light)`; dentro de
  `<img>` elas ficam sempre no tom claro (texto `#1E2440`) e sem fundo, então no cartão escuro do site o texto fica
  quase invisível (ex.: "q² = 1/10.000 = 0,0001", "p = 1 − 0,01 = 0,99", títulos e rótulos dos genes). Só o texto
  colorido (laranja, barras) aparece. Não vem desta correção (o original tem o mesmo estilo), mas atinge as duas
  figuras de Bio corrigidas no N1 e passou nas rodadas anteriores.
  Mat e Quí não usam esse estilo e aparecem bem no escuro.
- Onde: SVG das figuras em `app/public/conteudo/bio/figuras.json` (origem `app-atual/bio/img/*.json`); exibição em
  `app/src/telas/Tema.tsx:41` e `.fig-teoria` em `app/src/estilo/telas.css:243-245`.
- Como corrigir: no `converte.py` (fora de `app-atual/`), gerar para Bio uma versão com as cores do tema escuro (o
  próprio SVG já tem os valores de `svg{color:#E7E9F5}`) e trocar a figura pelo tema do site; ou, mais simples, dar à
  figura de Bio um fundo claro próprio (tom da folha do tema claro) no escuro. Teste de contraste do texto das figuras
  no tema escuro.
- **ERRO** (contraste, figura ilegível).

**R4. Figuras da teoria pequenas demais no celular, e as frações novas ficam menores ainda.**
- Tela: aba Teoria de qualquer tema com figura, 390 e 768 px.
- O que acontece: a figura fica dentro do cartão de teoria, que fica dentro da folha, e a imagem é exibida com 256 px
  de largura em 390 e 221 px em 768 (387 px em 1280). Numa figura de 640–900 px de largura, o texto desenhado cai para
  5–7 px, e os números das frações empilhadas (78% do tamanho da linha) para 4,7–5,6 px: "oposto/hipotenusa" na figura
  "Seno, cosseno e tangente…", os denominadores de "Quadriláteros" e "IMC", os arcos do ciclo trigonométrico. Não dá
  para ler sem ampliar a página. Não há toque para ampliar.
- Onde: `.fig-teoria` (`app/src/estilo/telas.css:243-245`, `padding: 10px`, `max-width: 640px`) dentro de
  `.cartao-teoria` e `.tp-bloco`.
- Por que fica com o dono: resolver pede mudança visual nova (figura abrindo ampliada ao toque, ou a figura saindo do
  cartão para a largura da folha no celular).
- **DECISÃO DO DONO.**

## 3. O que foi conferido e passou

- **Fração no desenho (N1):** zero fração em linha nas 666 figuras únicas de Mat/Quí/Bio (Fís não tem figuras).
  Nenhum valor mudou nas 84 figuras corrigidas (texto idêntico ao original, na ordem). A varredura de sobreposição só
  apontou a PG (R2) e três casos olhados que passam: "Vmáx/2" (Bio, o "2" fica logo acima da linha pontilhada, sem
  encostar; essa figura não está em nenhum cartão do site), "V/T" e "P/T" das isóbaras/isócoras (o "T" desce até o topo
  do gráfico, sem tocar linha nem texto) e o último número de "Frações equivalentes" (2 px da borda, sem corte).
- **Cartões de nível (N2):** coerência apagado/botão certa nos 6 conteúdos; nenhum cartão com opacidade.
- **Revisão essencial (N3):** topo, faixa, capa e folha iguais aos dos flashcards da mesma matéria; Bio e Fís com
  "Em preparação" na folha.
- **Rolagem lateral:** nenhuma nas 88 medições de N2/N3 nem nas 126 aberturas de figura. Os únicos elementos além da
  borda são os cartões da faixa de temas, que rolam dentro dela (iguais em flashcards e tema).
- **Console/rede:** nenhum erro.

Total: 3 ERROS, 1 DECISÃO DO DONO
