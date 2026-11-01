# Revisão final independente — ATIVIDADES DIARIAS

Data: 29/10/2026 · Revisor independente (não participou da construção) · Nenhum arquivo do app foi editado.
Método: Playwright/Chromium em http://localhost:8765/index.html, perfil persistente (o progresso acumula entre as rodadas). Viewports: 1366×768 e 1920×1080 (claro, também em tela cheia), 390×844 (celular, toque) e tema Noite. Prints em `design/rev_final/`.

O que foi exercitado: 4 matérias × 6+ questões no Treino de hoje (alternando acerto e erro, com o gabarito lido de `POR[S.ult].gab`), "Continuar de onde parei", módulo (Gases → Começar, 5 questões), área (Revise química orgânica → Começar, 5 questões), Teoria em cartões (Gases, Coesão e coerência) e aba Teoria/Fonte na questão, Simulado rápido de Matemática até a tela de resultado (3 vezes), Desempenho, Revisão, Questões, busca Ctrl+K com Enter, Dica, Pausa, teclado (C + Enter), controles do passo a passo, tela cheia (botão do quadro e da barra), Configurações, recarregar a página, menu "Mais" no celular.
Varredura automática: emoji e símbolos de teclado no DOM visível de cada tela (texto e `::before`/`::after`), imagens quebradas, rolagem horizontal, ícones repetidos em "O que você vai encontrar" (todas as matérias e todos os temas), palavras sem acento no `dados.json`.
**Console/pageerror: zero erros e zero avisos em todas as rodadas.** Nenhuma imagem quebrada. Nenhuma rolagem horizontal a 390 px.

## Checklist do dono

| # | Item | Resultado | Prints |
|---|------|-----------|--------|
| 1 | Seletor Dia/Noite visível; tema claro bonito e principal | OK. Seletor no topo (desktop e celular), o tema muda também dentro dos quadros e fica salvo | 01_inicio_1366, 23_escuro_inicio, 40_cel_inicio |
| 2 | Hierarquia clara, cor da matéria só no que importa, secundário sem caixa | OK. Um bloco de destaque por tela; listas secundárias sem caixa; a cor da matéria fica no CTA, na aba ativa e nos ícones | 01, 02_qui_home, 14_qui_modulo_gases, 35_bio_desempenho |
| 3 | Botão de tela cheia; em tela cheia a questão é o foco | OK. Esconde a barra lateral e o topo, o print ocupa cerca de 2/3 da largura. Ressalva P2-4: depois de responder, a 1920 o botão Próxima fica cortado | 12_bio_telacheia_1366, 12_bio_telacheia_1920, 51_1920_shell_telacheia |
| 4 | Alternativas lado a lado só com a letra | OK (A–E numa linha, em todos os tamanhos) | 04_qui_q_rolada, 42_cel_qui_q |
| 5 | Sem símbolo/logo ao lado de "ATIVIDADES DIARIAS" | OK | 01 |
| 6 | Módulo com "O que você vai encontrar" + Começar sortido; áreas de revisão no início | OK. Módulo Gases: Começar sorteou Q06.3, Q06.2, Q06.1… e a área Orgânica sorteou Q11.3, Q12.2, Q12.4…, ou seja, conteúdos misturados. "Revise por área" fica na 1ª tela de cada matéria, logo abaixo do destaque (a 1366 o conteúdo da área exige rolar) | 14, 15_qui_modulo_gases_b, 16_qui_modulo_comecar, 17_qui_area_organica |
| 7 | Texto grande e legível em tudo | **FALHA**. O enunciado (print) fica com letra efetiva de ~9–11 px fora da tela cheia e ilegível no celular (P1-1). Figura de resolução com texto minúsculo (P2-2) | P1_enunciado_1366_100pct, P1_enunciado_1920_100pct, P1_enunciado_390_zoom2x, 48_1920_por_res |
| 8 | Teoria em cartões (o que é / como identificar / exemplo / caderno / cuidado); Português com exemplos; Química em notação | OK com ressalva. Cartões completos. Anáfora, catáfora, elipse, dêiticos e este/esse/aquele têm exemplo real e exemplo criado. Gases usa PV = nRT e P₁V₁/T₁ com subscrito. **Ressalva P2-6:** parte das resoluções mostra fórmula sem subscrito (CHCl3, C12H22O11) | 19–22, 44_cel_qui_passo |
| 9 | Proibido emoji ou símbolo de teclado como ícone | OK no que aparece na tela: a varredura não achou nenhum em nenhuma tela. As setas → e ← aparecem só como notação dentro do texto ("pronome → referente"), não como ícone. Ressalvas P3: ✕ ▣ ⏱ ▤ ◎ ⇄ ⤢ continuam no DOM em elementos ocultos e antigos, e o ícone de Matemática é o caractere "π" desenhado em `<text>` de fonte | — |
| 10 | Ícones de conteúdo diferentes entre si e coerentes | OK. Nenhum ícone repetido em "O que você vai encontrar" nos 53 temas das 4 matérias; os Conteúdos relacionados também são distintos. P3: em Química, área e tema repetem ícone (hexágono, reciclagem) | 17_qui_area_organica, 03_qui_questao |
| 11 | Figuras legíveis nos dois temas, papel branco; figura do conteúdo na resolução | **FALHA PARCIAL**. As figuras do conteúdo ficam em branco puro nos dois temas, e a de membrana/osmose aparece certa (t_bio_r0). Mas a figura nem sempre corresponde à questão (P2-1), a do Período composto é ilegível (P2-2) e no tema Noite o print da questão fica cinza (240), não branco (P3) | t_bio_r0, 05_qui_resol_inicio, 43_cel_qui_res, 48_1920_por_res, 26_escuro_bio_res |
| 12 | Resolução animada passo a passo; controles com ícones SVG | OK com bug. Escreve aos poucos (1/4 → 2/4 → 3/4 a cada ~3 s); Pausar, anterior e próximo têm SVG; velocidade e "Ver tudo" funcionam. Bug P2-5 no estado depois de pausar | 09_qui_passo_a, 10_qui_passo_b, 59_bio_passo_pausado_estado |
| 13 | Progresso grava e persiste ao recarregar | OK. 52 de 150 antes e depois do reload; contadores por matéria, Desempenho, Revisão (3 erros agendados para amanhã) e Atividade recente batem com o que foi respondido | 34_inicio_apos_reload, 35, 36_bio_revisao |

## Defeitos priorizados

### P1 — impede publicar

**P1-1. O enunciado da questão (print do banco) não é "grande e legível" fora da tela cheia.**
- Onde: tela da questão, todas as matérias.
  - A 1366×768 o print ocupa ~550 px de largura e a letra efetiva fica em ~9–10 px.
  - A 1920×1080 o print fica limitado a ~640 px, com ~1.000 px sobrando ao lado, e a letra fica em ~11 px.
  - A 390×844 o texto fica ilegível (~5 px), principalmente em textos longos (Fundatec "Escola do crime").
- Como reproduzir: Início → Biologia → Treino de hoje.
- Contraste: na tela cheia o mesmo print fica legível (12_bio_telacheia_1366/1920). O problema é o modo normal, que é o uso principal.
- Prints: P1_enunciado_1366_100pct, P1_enunciado_1920_100pct, 11_bio_q_1920, P1_enunciado_390_zoom2x, 42_cel_qui_q, 62_cel_treino.

### P2 — importante

- **P2-1. A "Figura do conteúdo" na resolução não corresponde à questão.** Parece mostrar a 1ª figura da galeria do conteúdo.
  - Questão do pudim com passas (Thomson): mostra "Modelo atômico de Dalton (1808)".
  - Questão do modelo saturniano (Rutherford): mostra de novo a esfera de Dalton.
  - Questão do clorofórmio (CHCl₃, haleto): mostra "Cloreto de etanoíla (cloreto de acila)", numa galeria de 35 figuras.
  - Reproduzir: Química → Treino de hoje → 1ª questão → responder. Prints: 05_qui_resol_inicio, 08_qui_errou, 43_cel_qui_res.
- **P2-2. Figura com texto minúsculo na resolução.** "Período composto: classificação" aparece com ~255 px de largura e letra de ~6–7 px, mesmo a 1920. Reproduzir: Português → Treino de hoje → questão "Contudo" (Cespe) → responder. Print: 48_1920_por_res.
- **P2-3. A 1366×768, as alternativas A–E e o Confirmar ficam abaixo da dobra quando o print é alto.** É preciso rolar para responder. Reproduzir: Química → Treino → questão do pudim com passas. Prints: 03_qui_questao, 04_qui_q_rolada.
- **P2-4. Tela cheia a 1920: depois de responder, "Próxima questão" fica cortado na borda de baixo.** Reproduzir: Português → Treino → responder → Tela cheia. Print: 51_1920_shell_telacheia.
- **P2-5. Passo a passo com estado quebrado depois de pausar.**
  - Pausar em 1/4 mostra "Assistir resolução". Em seguida, "Próximo passo" pula para 3/4 (o passo 2 é pulado) e o botão volta a dizer "Pausar", embora a animação esteja parada (4 s depois continua em 3/4).
  - Reproduzir: Biologia → Treino → responder → Pausar logo no 1º passo → Próximo passo.
  - Print: 59_bio_passo_pausado_estado.
- **P2-6. Química: fórmulas sem subscrito em parte das resoluções.**
  - Exemplos: "CHCl3: 1 carbono, 1 hidrogênio e 3 cloros" no caderno e no glossário, e "C12H22O11".
  - O renderizador converte boa parte das fórmulas, mas não todas. Os arquivos `qui/res/*.json` guardam fórmulas em ASCII (CO2 ×666, H2O ×492…).
  - Print: 44_cel_qui_passo.
- **P2-7. Celular: o rodapé fixo (Certeza / Dica / Confirmar) cobre a linha de alternativas A–E.** Reproduzir: 390×844 → Treino. Print: 62_cel_treino (3º quadro de m_cel2).

### P3 — acabamento

1. Tema Noite: o print da questão aparece em cinza (240,240,240), não em papel branco (26_escuro_bio_res).
2. Rótulos cortados no carrossel de temas ("Ligações e forças entre…", "Funções inorgânicas e..", "Neuro, hormônios,…") (02_qui_home, 35).
3. Resultado do simulado: o cabeçalho "Matemática ·" termina num ponto solto (33_mat_simulado_fim).
4. A velocidade aparece com ponto ("0.75×", "1.5×"); em pt-BR o certo é "0,75×" (58_bio_passo_pausado).
5. Símbolos antigos ocultos no DOM dos quadros (#sair-foco "✕", nav.bot "▣ ∑ ⏱ ▤", #bfull "⤢", "◎", "⇄"). Não aparecem hoje, mas basta uma mudança de CSS para voltarem. Melhor remover.
6. O ícone de Matemática no cabeçalho do quadro é o caractere "π" em fonte Georgia (`<text>`), não um ícone desenhado (30_mat_simulados).
7. "ATIVIDADES DIARIAS" sem acento (DIÁRIAS). Confirmar com o dono se é intencional.
8. Química: a área "Química orgânica" e o tema "Orgânica: estrutura" usam o mesmo hexágono; "Química da vida e do ambiente" e "Orgânica: reações…" usam a mesma reciclagem (17).
9. "Onde você precisa reforçar" lista item começando em minúscula ("forças intermoleculares…") (17).
10. Escada: a barra de progresso destaca o "próximo degrau" e deixa o degrau vencido cinza (39_busca_enter).
11. Português: o chip mostra só "Iniciante", enquanto as outras matérias mostram "Degrau 1 de 7 · Iniciante" (48).
12. Dois botões "Tela cheia" ao mesmo tempo (barra superior e cabeçalho do quadro) (03).
13. O simulado cronometrado mostra Dica e gabarito/resolução logo após cada questão. Vale decidir se é intencional.
14. Pausar o cronômetro deixa a questão visível e respondível (54_mat_pausa).
15. O print do banco mostra "QUESTÃO 2" / "QUESTÃO 11" da fonte, enquanto o app diz "Questão 1 de 12" (12_bio_telacheia). Vem do material de origem; dá para recortar.

## O que funcionou sem ressalvas
Busca Ctrl+K (setas, Enter abre a escada do conteúdo), teclado na questão (letra + Enter), Dica progressiva (1/3 → 2/3), Configurações, menu "Mais" no celular, Revisão espaçada (1, 3, 7, 16, 35 dias), Desempenho por tema, lista de simulados por banca e por objetivo, persistência por matéria (`saocamilo.<mat>.v1`), conteúdo dos cartões conferido por amostragem (Gases: 330/300 = 1,1 e 2·10·300/(200·1) = 30 L, ambos corretos; Coesão: exemplos de este/aquele, anáfora e catáfora corretos).


---

## Correções da revisão final (29/10/2026)

**Arquivos editados:** `design/materia.css`, `design/materia.js` e `design/icones.js`. Não precisei mexer em `shell.html` nem em `gera_design.py`. Não toquei em `<m>/app.js`, `<m>/index.html` nem nos dados. A cópia de antes está em `design/bak_revfinal/`.

**Teste:** em `/home/claude/esc_test`. As matérias foram copiadas sem `res/`, e `bio/qui/mat/por` ficaram como pastas reais. O build rodou lá; **não rodei em escadas-sc**. Usei Playwright em 1366×768 e 1920×1080 (tema claro), 1366 no tema escuro, 390×844 por toque e tela cheia a 1920. Os prints de antes estão em `rev_final/fix_antes/` e os de depois em `rev_final/fix_depois/`.

**Resultados gerais:**
- **0 pageerror e 0 erro de console** em todas as rodadas.
- Nenhuma rolagem horizontal a 390 px.
- O progresso continua depois de recarregar (`saocamilo.bio.v1`).

| # | Defeito | Situação | Medida antes → depois | Prints (antes / depois) |
|---|---|---|---|---|
| P1-1 | Print pequeno fora da tela cheia | **CORRIGIDO** | **Colunas:** antes de responder, a coluna da questão ocupa 64% (`1.8fr/1fr`). **Largura:** o print usa toda a largura da coluna. **Margens:** as margens brancas laterais do próprio print são medidas num canvas e cortadas, o que amplia o texto cerca de 14%. **Altura:** o print só estreita se couber inteiro na altura ainda com ≥ 90% do tamanho natural; nunca passa de 1,3× o natural. **Números:** a 1366 o print foi de 550 para 633 px (imagem efetiva de 680 px, escala 0,61 → 0,76, letra de ~9,5 para ~12,5 px). A 1920 foi de 640 para 915 px (escala 0,71 → 1,09, letra de ~11 para ~17 px). **Celular:** o print vai de borda a borda (328 → 388 px, imagem efetiva de 417 px), e tocar nele abre a lupa com zoom até 4×. Conferido: `#lupa` abre ao tocar. | fix_antes/1366_qui_q, 1920_por_q, cel_qui_q / fix_depois/1366_qui_q, 1920_por_q, cel_qui_q, cel_lupa |
| P2-1 | Figura do conteúdo errada | **CORRIGIDO** | **Regra nova:** o núcleo do título da figura (o nome, antes de ":" ou "(") precisa aparecer inteiro no que a questão cobra. Cada palavra que distingue a figura das outras do conteúdo tem de estar em 2 de 3 fontes: conceito, resposta e "pede/chave". **O que não conta:** enunciado e alternativas, que citam os distratores, e mencionar algo negado, como "sem depender do encéfalo". Núcleo de 1 palavra só vale se ela também estiver no conceito; núcleo que é quase todo sigla ("Plantas C3, C4 e CAM") não vale. **Se nenhuma figura casa, a resolução fica sem figura.** **Exemplos:** Thomson: Dalton → **Thomson (1904)**. Saturniano: Dalton → **Rutherford (1911)**. Clorofórmio: "Cloreto de etanoíla" → **sem figura**. **Varredura de todo o banco (2.212 questões com figura candidata):** a figura aparece em 94 delas, e conferi as 94 à mão. Nas outras a resolução não mostra figura. A galeria da aba Teoria continua com todas as figuras. | 05_qui_resol_inicio / fix_depois/1366_qui_res_thomson, 1366_qui_res_rutherford, 1366_qui_res_cloroformio |
| P2-2 | Figura com letra minúscula | **CORRIGIDO** | **Cálculo:** a letra de cada figura (SVG) vem do `font-size` e do `viewBox` e define a largura mínima para letra de 12 px. **Na resolução:** se o tamanho padrão deixa a letra menor, a figura cresce até essa largura. Se nem a coluna inteira basta, o botão vira **"Ampliar para ler"** (destacado), e a ampliada abre a figura nessa largura, com rolagem se for preciso. Figura que precisaria de mais de 1.400 px não é usada. **Exemplos:** a questão "Contudo" (Cespe) não mostra mais o "Período composto" (não casa com a questão). "Órgãos homólogos" aparece com 509 px a 1366, com "Ampliar para ler", e com 752 px a 1920. | 48_1920_por_res / fix_depois/1920_por_res, 1366_bio_res_homologos, 1920_bio_res_homologos |
| P2-3 | A–E e Confirmar abaixo da dobra a 1366 | **CORRIGIDO** | **Barra grudada:** a linha A–E e Confirmar (com Certeza e Dica) fica grudada no pé da coluna (sticky) quando o print é mais alto que a tela, com uma linha fina por cima. **Medido a 1366×768:** A–E vai de y=725–781 para 575–641, e Confirmar de y=840 (fora da tela) para 651–693. Os dois ficam livres, sem nada por cima (`elementFromPoint`). | 03_qui_questao / fix_depois/1366_qui_q, esc1366_qui_q |
| P2-4 | "Próxima questão" cortado na tela cheia a 1920 | **CORRIGIDO** | O botão também fica na barra grudada, e o print na tela cheia segue a mesma regra de altura. **Antes:** o botão terminava em y=1080 (cortado). **Depois:** fica em y=1024–1066, inteiro. | 51_1920_shell_telacheia, fix_antes/foco1920_por_res / fix_depois/foco1920_por_q, foco1920_por_res |
| P2-5 | Passo a passo com estado quebrado ao pausar | **CORRIGIDO** | **Antes:** Pausar → "Assistir resolução"; Próximo → 3/4 com "Pausar" e animação rodando. **Depois:** Pausar → **"Continuar" 1/4**; Próximo → **"Continuar" 2/4**, parado (4 s depois continua em 2/4); Anterior → "Continuar" 1/4; Continuar → "Pausar" 2/4; Ver tudo → "Assistir de novo" 4/4. **Regra:** tocando, ◀ e ▶ pulam e seguem tocando; parado, mostram ou escondem um passo e continuam parados. Os botões ficam desativados nas pontas. | 59_bio_passo_pausado_estado / fix_depois/passo_1_pausado, passo_2_prox_parado |
| P2-6 | Química sem subscrito | **CORRIGIDO** | **Como converte:** em todo texto exibido no app de Química (resolução, abas, cartões de teoria, glossário, caderno), também no que aparece depois, com dígitos em subscrito Unicode. **Só converte fórmula de verdade:** sequência de símbolos de elementos reais (e parênteses) com número. Exemplos: CHCl₃, C₁₂H₂₂O₁₁, Ca(OH)₂, Al₂(SO₄)₃, SO₄²⁻, NH₄⁺, P₁V₁/T₁. **Não mexe em:** carga (Fe3+, HCO3- no fim), isótopo (C14, U235), SN1/SN2/E1/E2, vitamina B5/B12, 1s2 2s2, Q06.3, anos e texto comum. O coeficiente fica normal (2H₂O). **Medido:** a resolução do clorofórmio passou de 4 fórmulas ASCII para 0 (CHCl₃ ×4). Aba Teoria, Teoria de Gases e de Orgânica: 0 fórmulas sem subscrito. | 44_cel_qui_passo, 64_qui_formula_sem_subscrito / fix_depois/qui_formula_com_subscrito, qui_aba_teoria_formula, qui_teoria_Q11 |
| P2-7 | Rodapé fixo do celular cobrindo A–E | **CORRIGIDO** | A–E agora faz parte do rodapé grudado (A–E, depois Certeza, depois Dica + Confirmar), de borda a borda. O print não aparece pelas laterais. **Antes:** A–E coberto (`bolhasLivres=false`). **Depois:** livre. O cabeçalho do cartão ficou mais curto: a banca já aparece no pé do print e o marcador foi para o canto. | 62_cel_treino / fix_depois/cel_qui_q, cel_por_q |
| P3-1 | Print cinza no tema Noite | **CORRIGIDO** | Sem `filter`; o fundo é branco (255). | 26_escuro_bio_res / fix_depois/esc1366_qui_q |
| P3-2 | Rótulos cortados no carrossel | **CORRIGIDO** | O cartão tem 132 px e até 4 linhas; nenhum rótulo cortado em Química. | 02_qui_home / fix_depois/qui_inicio_temas |
| P3-3 | "Matemática ·" com ponto solto | **CORRIGIDO** | No resultado, o separador sai. | 33_mat_simulado_fim / fix_depois/mat_simulado_resultado |
| P3-4 | Velocidade "0.75×" | **CORRIGIDO** | Agora mostra "0,75×". | 58 / passo (vel = 0,75×) |
| P3-5 | Glifos antigos ocultos no DOM | **CORRIGIDO** | Saíram ⤢ do #bfull, ✕ do #sair-foco, ▣ ❦ ⌬ ∑ ¶ ⏱ ▤ do nav.bot e ☆/★ do #b-rev, inclusive quando o app reescreve esses elementos. | — |
| P3-6 | "π" em fonte no cabeçalho de Matemática | **CORRIGIDO** | O π agora é desenhado com traço, o mesmo do menu da página principal. Nenhum `<text>` nos glifos. | 30_mat_simulados / fix_depois/mat_simulado_resultado |
| P3-7 | "DIARIAS" sem acento | **Mantido** | É escolha do dono. | — |
| P3-8 | Área e tema com o mesmo ícone | **CORRIGIDO** | A área usa o ícone do 1º conteúdo do seu 1º tema; o painel ao lado lista os temas. Conferido em "Química orgânica": 0 ícones iguais. | 17 / fix_depois/qui_area_organica |
| P3-9 | Item em minúscula em "Onde você precisa reforçar" | **CORRIGIDO** | Primeira letra maiúscula por CSS (`.linha .nm`). | 17 / fix_depois/qui_area_organica |
| P3-10 | Barra da escada | **CORRIGIDO** | Degrau vencido em verde de acerto, errado em coral; o próximo fica só contornado na cor da matéria. | 39 / fix_depois/qui_escada_barra |
| P3-11 | Português só com "Iniciante" | Não corrigido | Vem do dado: as questões sem `degrau` não têm escada. Mexer exigiria alterar os dados. | — |
| P3-12 | Dois botões "Tela cheia" | **CORRIGIDO** | Dentro da página principal fica só o do topo. O do quadro aparece só na tela cheia, como "Sair da tela cheia". | fix_depois/1366_qui_q |
| P3-13 | Dica e gabarito no simulado cronometrado | Decisão do dono | Não mexi. | — |
| P3-14 | Pausa deixa a questão visível | **CORRIGIDO** | Com o cronômetro pausado, a questão e o painel ficam embaçados e não aceitam clique até retomar. | fix_depois/qui_pausa |
| P3-15 | "QUESTÃO 2" do print da fonte | Não corrigido | Recortar o print arriscaria cortar o enunciado. Fica como está. | — |

**Falta rodar** `python3 design/gera_design.py` em escadas-sc para levar as correções aos apps reais. O build de produção não foi rodado aqui.
