# Revisão profissional: design, UX e ciência da aprendizagem (30/10/2026)

**Método**
- App servido em `http://localhost:8791`. Playwright/Chromium, temas claro e escuro (`ad-tema`).
- Tamanhos testados:
  - 1440×900 (principal);
  - 960×1000 (meia tela do Windows, com Snap);
  - 1024, 1280 e 1920;
  - 390×844 com toque.
- Fluxos percorridos nas 4 matérias:
  - shell: início, busca Ctrl+K, Configurações, barra lateral recolhida;
  - capa da matéria, faixa de temas, "Revise por área", Estudar, módulo e escada;
  - questão, dica 1→3, pausa, resposta errada, resolução completa, aba Teoria e teoria em cartões;
  - Revisão, Flashcards (sessão, "Não sei", nota), Simulados, Desempenho;
  - Treino geral do começo ao fim: 15 itens até a tela de resultado.
- Também foram medidos:
  - largura do print antes e depois de responder;
  - contraste (fórmula WCAG) dos tokens de cor de cada matéria;
  - inventário dos bancos por matéria;
  - vazamento de gabarito nas dicas, varrendo os 2.223 `res/*.json`.
- Console: **0 erros** em todas as rodadas.

**Prints:** `/tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/rv/`. No texto, cito só o nome do arquivo.
- Prefixo `<mat>_<L|D><d|m>_`: L = claro, D = escuro; d = 1440, m = 390.
- `sh_` = shell no PC; `shm_` = shell no celular; `w960_` / `w1024_` = larguras intermediárias.

**Fora do escopo** (já estão sendo refeitos): a colagem do Treino geral e a caneta da animação de escrita. Também não repito o que `design/REVISAO_FINAL.md` e `design/CRITICA_DESIGN.md` já registraram e que já foi resolvido.

---

## 1. Problemas priorizados

### P0: quebrado ou ilegível

**P0-1. O cartão do Treino geral se desmonta no celular (abaixo de 900 px).**
- Prints: `bio_Lm_01_capa.png`, `bio_Lm_01_capa_s1.png` e `bio_Lm_01_capa_s2.png`. O mesmo CSS vale para as 4 matérias.
- O que se vê:
  - o título "Treino geral" quebra em 2 linhas;
  - a descrição sai uma palavra por linha;
  - os 3 contadores ficam empilhados uns sobre os outros ("0 de 65" em cima de "0 de 40");
  - "Começar o treino geral" vira um botão de ~60 px de largura, com 3 linhas.
- Causa: em `design/materia.css:1283`, a regra `html.ad #v-inicio .capa.ad-tem-tg{grid-template-columns:minmax(0,max-content) minmax(0,max-content) minmax(0,1fr) 300px}` é mais específica que a regra do celular (`:149`). O `@media (max-width:899px)` da linha 1302 troca só as *areas* e mantém as 4 colunas. A `.ad-tg-arte`, sem área definida, ainda cria uma coluna implícita.
- Correção, dentro do `@media (max-width:899px)` de `:1302`:
  ```css
  html.ad #v-inicio .capa.ad-tem-tg{grid-template-columns:minmax(0,1fr);
    grid-template-areas:"arte" "tit" "sub" "stat" "b1" "d1" "b2" "d2"}
  html.ad #v-inicio .capa > .ad-arte.ad-tg-arte{grid-area:arte;justify-self:center;width:220px;height:170px;margin:-6px 0 4px}
  html.ad #v-inicio .capa.ad-tem-tg #ad-tg,
  html.ad #v-inicio .capa.ad-tem-tg #b-treino{width:100%;justify-content:center}
  @media (max-width:420px){html.ad #v-inicio .capa > .ad-arte.ad-tg-arte{display:none}}
  ```
- Teste de aceite: a 390 px, o cartão inteiro cabe em ≤ 1,3 tela, e o botão ocupa a largura toda.

**P0-2. O enunciado encolhe 32% no momento em que o aluno mais precisa relê-lo (logo depois de responder).**
- Medição em Química (Wf93026e, print de 900 px naturais):

  | Tela | Antes de responder | Depois de responder |
  |---|---|---|
  | 1366 | 633 px | 427 px |
  | 1440 | 681 px | 460 px |
  | 1920 | 915 px | 622 px |

- Nos prints de lista (Mundo Educação e Brasil Escola), o texto efetivo cai para cerca de 6 px. Prints: `qui_Ld_09_resolucao.png`, `bio_Dd_09_resolucao.png` e `qui_1920_res.png`.
- Causa: `materia.css:255` `html.ad.ad-resp #q-corpo.ad-q{grid-template-columns:minmax(0,1fr) minmax(440px,1.25fr)}`.
- Correção:
  ```css
  html.ad.ad-resp #q-corpo.ad-q{grid-template-columns:minmax(560px,1.1fr) minmax(420px,1fr)}
  @media (max-width:1280px){html.ad.ad-resp #q-corpo.ad-q{grid-template-columns:minmax(0,1fr) minmax(400px,1fr)}}
  html.ad.ad-resp #ad-painel{position:sticky;top:64px;max-height:calc(100vh - 80px);overflow:auto}
  ```
- Segunda parte (esforço M): resolver os prints de lista, que já nascem com letra pequena.
  - Gravar em `img.json`, para cada print, a altura-x do texto em pixels naturais. Dá para medir offline pelo perfil horizontal de tinta.
  - Na hora de mostrar: se `largura_exibida/largura_natural × altura-x < 8 px`, aplicar `html.ad-resp.q-pequena`, que põe a resolução *abaixo* do print (uma coluna só, print a 100%), e mostrar "Ampliar" já destacado.
  - Nada é redigitado: é o mesmo print, mostrado maior.
- No celular (`bio_Lm_06_questao.png`), o print fica com ~4–5 px de letra. Tocar no print deve abrir o "Ampliar" em tela cheia, com `touch-action:pinch-zoom`, já ajustado à largura do texto.

### P1: erro de conteúdo, confusão de fluxo ou desvio do gosto do Vitor

**P1-1. A "Dica 3" entrega a letra certa em 16 questões.**
- Exemplo real: Português, BANCO[40] (gabarito B). A dica 3 diz "Comece assim: **Isole as duas metades da alternativa B**".
- Origem: `camada_pc.py:199` monta a dica 3 a partir de `P[0].faz` (o 1º passo da resolução), e esse passo às vezes nomeia a alternativa certa.
- IDs afetados (varredura de `res/*.json`, padrão `alternativa|letra <gabarito>`):
  - Bio: `Wcf2472d`;
  - Por: `P0f6f6c1 P2a6fff1 P2d5de37 P346346c P392b9bb P9a843fa P9d6d7b1 Pc25260d Pc3fde51 Pd694c75 W0fdaa24 W3b2ac08 W75ef962 W91dcfea W9a1ac0e`.
- Correção: em `camada_pc.py:199`, quando `/\b(alternativa|letra)\s+[A-E]\b/i.test(P[0].faz)`, trocar o trecho por "cada alternativa" ou pular a dica 3 e usar a `pista`. Rodar de novo a varredura (script na seção 4).

**P1-2. Dentro do Treino geral, a questão diz "Questão 1 de 1" e some a barra "N de 15".**
- Prints: `bio_Ld_21_tg_00b.png`, comparado com `bio_Ld_21_tg_01a.png`.
- A sessão tem 15 itens, mas nos itens de questão o topo mostra "Questão 1 de 1" e o botão alterna entre "Próximo item" e "Terminar". O aluno perde a noção de onde está.
- Correção: quando o contexto for Treino geral (`ctx.tg`):
  - `#ad-qtit` passa a mostrar "Treino geral · item 7 de 15";
  - a mesma barra `.ad-tg-barra` da tela de flashcards entra acima de `#q-corpo`;
  - o botão fica sempre "Próximo item", e só no 15º vira "Ver resultado".

**P1-3. O marca-texto da "Resposta" pinta só a 1ª linha.**
- Prints: `por_Ld_09_resolucao.png` e `bio_Ld_21_tg_03a.png` (a 2ª linha fica sem a faixa amarela).
- Causa: `materia.css:521` `.resolucao .resp::first-line{background:…}`.
- Correção: envolver o texto num `<span class="resp-mt">` e trocar a regra por:
  ```css
  html.ad #ad-painel .resp .resp-mt{background:linear-gradient(transparent 58%,var(--marca-cad) 58%);
    -webkit-box-decoration-break:clone;box-decoration-break:clone;padding:0 2px}
  ```

**P1-4. O crédito das ilustrações está errado em Português, e é genérico em Química e Matemática.**
- Print: `por_Ld_01_capa.png`.
- A faixa diz "Ilustrações: Servier Medical Art, CC BY 3.0", mas `design/icones_real/mapa.json` registra P01–P12 como "Gerado no projeto" (motor 3D). É informação incorreta na tela, o que o Vitor não aceita.
- Correção: montar o crédito de cada matéria a partir do `mapa.json`. Juntar as fontes únicas dos ícones visíveis na faixa e escrever, por exemplo, "Ilustrações: desenhadas para o app" em Português.

**P1-5. Barra do topo quebrada entre 960 e 1100 px (meia tela do Windows).**
- Prints: `w960_home.png`, `w960_q.png` e `w1024_por_capa.png`.
- A busca encolhe para um quadrado de 36 px, e o "Ctrl K" fica por cima de "Progresso salvo neste navegador".
- Correção em `design/shell.html`:
  ```css
  .busca-bt{min-width:220px}
  @media (max-width:1180px){.sync span{display:none} .busca-bt kbd{display:none}}
  @media (max-width:1100px){/* barra lateral recolhida por padrão */ .app-shell:not(.lado-aberto) .lado{width:72px}}
  ```

**P1-6. Em Português, o amarelo da matéria é a mesma cor de "aviso". Resultado: três caixas creme seguidas.**
- Medição: `--ad-t` de Português = `#8A6200` = `--aviso`.
- Em `por_Ld_09_resolucao.png`, "Resposta" (papel creme), "Em uma olhada" (tinta amarela) e "Cuidado" (creme de aviso) ficam quase iguais, e o "Cuidado" perde a função de alerta. O botão "Quase" do flashcard sofre do mesmo jeito.
- Correção, só no tema de Português:
  - `--aviso:#B4530A` (laranja-tijolo) e fundo do cuidado `color-mix(in srgb,#B4530A 10%,var(--folha))`;
  - "Em uma olhada" de Português vira fundo `var(--folha)` com filete esquerdo de 4 px `var(--ad-c)`.

**P1-7. A pausa não diz que está pausada, e ainda deixa clicar.**
- Print: `q_qui_pausa.png`.
- O conteúdo fica desfocado, mas:
  - não há mensagem nenhuma;
  - o único jeito de voltar é um botão de 32 px no canto de cima;
  - os links de baixo ("Simulado rápido", "Guardar esta questão") continuam nítidos e clicáveis.
- Correção:
  - um cartão no centro, `position:fixed`: "Pausado · 00:04", com botão grande "Continuar (P)" e "o tempo não corre";
  - o desfoque passa a valer para `#q-corpo, #ad-baixo, #ad-painel`, com `pointer-events:none` em tudo menos no cartão.

**P1-8. Os degraus da escada têm o nome da fonte, não do que ensinam.**
- Print: `bio_Ld_05_escada.png`. Os degraus 1, 2 e 3 se chamam todos "Mundo Educação". O aluno não sabe o que cada degrau pede.
- Correção:
  - título = `q.conceito`, cortado em 70 caracteres (o campo existe nas 4 bases);
  - subtítulo = "Mundo Educação · Iniciante · ainda não feito";
  - a fonte continua visível, mas deixa de ser o rótulo.

**P1-9. Em Português e Matemática, a escada começa no meio.**
- Pelo inventário (`dif` mínimo ≥ 3 por conteúdo):

  | Matéria | Conteúdos que começam no nível 3 ou acima |
  |---|---|
  | Português | 40 de 50 |
  | Matemática | 39 de 78 |
  | Química | 4 de 57 |
  | Biologia | 3 de 69 |

- Em `por_Ld_05_escada.png`, o "Degrau 1" já é Intermediário. Pela ciência da aprendizagem, falta rampa de entrada (*scaffolding*), justamente nas matérias em que o primeiro erro desmotiva mais.
- Correção: um "Degrau 0 · aquecimento" automático nos conteúdos sem `dif ≤ 2`, com 2 flashcards e 1 "completar a frase" do mesmo `sub`. O material já existe, e nenhuma questão é criada.

**P1-10. O destaque do Início usa a única arte "Paint" da tela e manda para um lugar diferente da capa.**
- Prints: `sh_L_home.png` e `sh_D_home.png`.
- "Primeiro degrau da escada" usa barras verdes chapadas, o único desenho genérico numa tela cheia de ilustrações realistas. Isso vai contra o gosto declarado do Vitor.
- Além disso, o "Começar" daqui abre a escada, enquanto a capa da matéria do dia oferece o Treino geral. São dois "comece aqui" diferentes.
- Correção:
  - o destaque vira "Treino geral de Biologia · matéria do dia", com os 3 contadores e o mesmo botão;
  - no lugar das barras entra uma ilustração realista de escada (degraus de madeira com sombra de contato), gerada pelo mesmo `gera_ilu3d.py`, ou o ícone grande da matéria.

**P1-11. Sobra roxo genérico como terceira cor de destaque.**
- Prints: `sh_L_home.png` e `bio_Ld_01_capa.png`.
- Aparece no Início ativo (fundo lilás, ícone roxo), no avatar "V" e no anel "meta da semana".
- Correção:
  - Início ativo: `background:color-mix(in srgb,var(--tinta) 7%,transparent);color:var(--tinta)`;
  - anel e avatar: na cor da matéria do dia, ou `var(--tinta)`.

**P1-12. Navegação duplicada e nomes que se confundem.**
- Na barra lateral, "Revisão" e "Flashcards" abrem a **mesma** página, que já tem as abas Questões | Flashcards (`bio_Ld_12_revisao.png`).
- Convivem três portas de "sessão do dia":
  - "Começar" no Início;
  - "Treino de hoje";
  - "Treino geral", que nem aparece na barra lateral.
- Correção (arquitetura de informação):
  - barra lateral: Treino geral · Escadas (Questões) · Revisão · Simulados · Desempenho;
  - "Flashcards" sai da barra lateral e fica como aba dentro de Revisão;
  - "Treino de hoje" é renomeado para "Só questões (12)" e vira o botão secundário do cartão do Treino geral, como já está na capa.

**P1-13. A faixa de temas se repete em todas as telas e empurra o conteúdo 300 px para baixo.**
- Prints: `bio_Ld_15_simulados.png`, `bio_Ld_16_progresso.png` e `bio_Ld_12_revisao.png`.
- O Vitor gosta dos ladrilhos brancos, então a ideia é manter, mas compactos fora do Início e do Estudar:
  ```css
  html.ad[data-v="simulado"] #ad-temas .ad-tema,
  html.ad[data-v="progresso"] #ad-temas .ad-tema,
  html.ad[data-v="revisao"] #ad-temas .ad-tema,
  html.ad[data-v="escada"] #ad-temas .ad-tema{width:118px;padding:6px 8px 10px;gap:4px}
  /* mesmos seletores */ … .ad-tema img{width:52px;height:52px}
  /* esconder também a linha de crédito nessas telas */
  ```

**P1-14. Contraste dos rótulos coloridos abaixo de 4,5:1 em texto de 13–14 px.**
- Rótulos afetados: "Pede / Decide / Cuidado", as etiquetas dos passos ("localizar", "eliminar") e o chip "Degrau 7 de 9 · Vestibular+" (medido em 3,93).
- Contraste da cor da matéria sobre a tinta de 14%:

  | Matéria | Contraste |
  |---|---|
  | Biologia | 4,26 |
  | Matemática | 4,29 |
  | Química | 4,65 |
  | Português | 4,53 |

- Correção, só para texto (o `--ad-c` continua igual em botões e barras):
  - `--ad-t`: Bio `#12692C`, Mat `#066570`, Quí `#A3124B`;
  - chip de dificuldade: escurecer o texto em 15%.

**P1-15. O botão "Errei" parece pré-selecionado na autoavaliação.**
- Prints: `bio_Ld_21_tg_01c.png` e `bio_Ld_21_tg_02c.png`.
- O foco automático pinta "Errei" com borda vermelha grossa. Isso induz a resposta, e a autoavaliação precisa ser neutra.
- Correção:
  ```css
  .ad-fl-nota button:focus:not(:focus-visible){outline:none;border-width:1px}
  ```
  Outra saída: dar o foco ao contêiner, não a "Errei".

### P2: acabamento

1. **Faixa da barra de sessão (Treino geral e Flashcards).** Atrás de "Flashcards · Cartão 1 de 20" aparece um retângulo mais claro, que não acompanha o degradê da página (`fl_qui_1.png`, `bio_Ld_21_tg_01a.png`). Correção: `background:color-mix(in srgb,var(--papel) 82%,transparent);backdrop-filter:blur(10px);border-radius:12px`.
2. **Crédito duplicado no flashcard com imagem.** "Servier Medical Art, CC BY 3.0" aparece dentro da figura e de novo embaixo (`bio_Ld_21_tg_01a.png`). Fica só o de baixo.
3. **Larguras de contêiner diferentes.**
   - Capa e faixa vão até x = 1408; Simulados, Desempenho e Revisão terminam em 1315 (`bio_Ld_15_simulados.png` contra `bio_Ld_01_capa.png`). A borda direita "pula" de uma tela para outra.
   - Correção: um único `--larg-max` para todas as seções de `#v-*`.
4. **Desempenho sem dados.** São 12 cartões "0 de 42 feitas · sem respostas", com barra pontilhada que parece carregamento (`bio_Ld_16_progresso.png`). Correção: estado vazio único, "Responda 10 questões para ver seu mapa", e a barra contínua.
5. **Medalhas "VUNESP / FUVEST" nos Simulados.** Parecem selos institucionais, o que conflita com a regra "nada de logo oficial". Trocar por objetos realistas neutros: caderno de prova com lápis, folha de respostas.
6. **Configurações repete a barra do topo.** O menu traz "Tema escuro" e "Tela cheia", que já estão lá (`sh_L_cfg.png`). Deixar só "Meus dados", os créditos e os atalhos.
7. **"Vestibular+" em vermelho.** O chip usa a mesma cor de "errado" e parece erro. Usar uma escala só de luminância da cor da matéria, ou âmbar → terracota sem vermelho puro.
8. **"Questões ABC" no Treino geral.** Rótulo estranho; trocar por "Questões de prova". "de 40" não explica o que é: usar "40 essenciais".
9. **Resultado do Treino geral.** Os quadradinhos 1–15 (`bio_Ld_21_tg_15a.png`) deveriam ser clicáveis e reabrir o item. Abaixo, entra "Reveja agora: 3 conteúdos", com os temas dos erros.
10. **Chip "~5 min".** Existe só em Matemática (campo `tempo`). Ou entra nas 4 matérias (estimado por banca), ou sai.

---

## 2. Ideias de produto (ciência da aprendizagem e encanto)

Esforço: P = horas, M = 1–2 dias, G = mais que isso.

**1. Mapa de confiança (calibração).**
- Por quê: o app já grava `conf` (Certeza, Acho que sim, Chutei), mas não mostra.
  - Erro com certeza é o erro mais perigoso: é crença errada.
  - Acerto no chute é falso domínio.
- Como fica: no Desempenho, um quadro 2×2 realista, como papel quadriculado com post-its.
  - Quadrantes: "Sabia e acertou", "Chutou e acertou", "Achou que sabia e errou", "Sabia que não sabia".
  - Cada post-it leva a contagem e abre a lista de questões.
  - Embaixo, uma frase: "Seu ponto cego: Genética molecular, 3 erros com certeza".
- Esforço: P.

**2. "Por que errei?" em um toque.**
- Por quê: análise de erro só vira aprendizagem quando o aluno classifica a causa.
- Como fica: logo abaixo de "Incorreto", 5 opções em pílula:
  - Não sabia o conceito;
  - Li errado;
  - Errei a conta;
  - Caí na pegadinha;
  - Faltou tempo.
- O app sugere uma opção destacada a partir da origem do distrator (`erradas[x].origem`), como "o distrator vem de dobrar o log".
- O Desempenho ganha "Seus padrões": "40% dos seus erros são de leitura", com a ação "Ative ler duas vezes".
- Esforço: M.

**3. Caderno de erros em PDF, toda semana.**
- Por quê: o Vitor prefere PDF, e o caderno de erros é a prática de maior retorno no vestibular.
- Como fica: uma página por erro, no papel quadriculado do app:
  - miniatura do print;
  - "Você marcou B · certa D";
  - a armadilha em letra de mão;
  - um espaço "Minha regra:" para escrever à caneta.
- Botão em Revisão: "Baixar caderno da semana (PDF)", pela capacidade de download.
- Esforço: M.

**4. Explique antes de ver (autoexplicação no erro).**
- Por quê: o efeito de autoexplicação é forte quando o aluno compara o próprio raciocínio com o correto.
- Como fica: depois de errar, antes de abrir a resolução, uma linha opcional: "Em uma frase: por que você marcou B?". Ao abrir a resolução, a frase aparece ao lado de "Por que a alternativa B não serve", como no "Sua resposta | Resposta-modelo" dos flashcards.
- Esforço: P.

**5. "De que conteúdo é esta?" (treino de discriminação).**
- Por quê: o ganho da intercalação vem de reconhecer *qual* ferramenta usar. Na prova, a questão não diz o tema.
- Como fica:
  - no Treino geral, 1 em cada 5 questões começa com o tema escondido: chip "?" no lugar de "Leis ponderais";
  - antes das alternativas aparecem 3 pílulas de tema, e a escolha certa vale um selo "olho clínico";
  - os dados vêm de `q.sub` e `NOMESUB`.
- Esforço: P.

**6. Degrau 0 de aquecimento.**
- Por quê: resolve o P1-9 e cria uma rampa de entrada.
- Como fica: na escada, antes do degrau 1, um degrau tracejado "Aquecimento · 2 cartões · 1 frase", com o ícone do tema. Ao terminar, ele vira sólido e o degrau 1 "acende".
- Esforço: P.

**7. Prova-espelho São Camilo.**
- Por quê: "a prova manda". O Treino geral pode ter o mesmo peso por área que a São Camilo 2024/2 (o único caderno público). Os pesos saem das 32 questões reais, sem inventar.
- Como fica:
  - um cartão "Rodada espelho": "A São Camilo cobrou 3 de Genética para 1 de Ecologia: esta rodada segue a mesma proporção";
  - uma barra empilhada que compara "prova" com "você domina".
- Esforço: M.

**8. Fim de sessão: "uma coisa que aprendi".**
- Por quê: a recuperação livre ao fim da sessão (*brain dump*) e a retomada no dia seguinte (*retrieval* espaçado) custam pouco e rendem muito.
- Como fica:
  - na tela de resultado, um campo com cara de bilhete adesivo: "Escreva em 1 frase o que você leva de hoje";
  - no dia seguinte, o Início abre com "Ontem você escreveu: '…'. Ainda é verdade?" e dois botões, "Sim" e "Quero rever".
- Esforço: P.

**9. Erro errado de propósito (*erroneous example*), com dados reais.**
- Por quê: achar o erro numa resolução ensina a armadilha melhor do que só ler.
- Como fica: na Revisão, um cartão "Ache o passo errado". É a resolução de uma questão já feita em que um passo foi trocado pela conta que gera o distrator real (de `erradas[x].origem`). O aluno toca no passo suspeito.
- Atenção às regras: nenhuma questão é criada. O passo trocado precisa passar pela mesma revisão em lentes antes de entrar.
- Esforço: M/G.

**10. Ritmo de prova.**
- Por quê: a São Camilo exige ritmo, e o cronômetro já existe.
- Como fica:
  - no resultado do Simulado, uma régua horizontal com cada questão como um pino, e a faixa verde "ritmo da prova" (calculada pelo tempo oficial ÷ número de questões do caderno 2024/2);
  - pinos acima da faixa saem em âmbar, com o texto "Nestas 3 você gastou o dobro: era conta longa ou indecisão?".
- Esforço: P.

**11. Selo de domínio no tema.**
- Por quê: um encanto com significado. O selo marca critério de domínio, não presença.
  - Critério: ≥ 80% na escada, todos os flashcards "firmes" e 1 revisão espaçada vencida e acertada.
- Como fica: no ladrilho branco da faixa de temas, um carimbo realista de tinta (verde da matéria, levemente torto e com textura). Aparece com uma animação de carimbo de 250 ms.
- Esforço: P.

**12. Raio-X de domingo em PDF.**
- Por quê: revisão semanal com metas (autorregulação).
- Como fica: um PDF de uma página, com:
  - acerto por área;
  - o mapa de confiança;
  - as 5 armadilhas mais repetidas;
  - o que vence na próxima semana;
  - 3 metas sugeridas ("subir Genética molecular de 40 para 60%").
- Esforço: M.

**13. Busca que também acha teoria e cartões.**
- Por quê: hoje a busca Ctrl+K só traz "Conteúdos" (`sh_L_busca_mitose.png`). Quem busca "mitose" quer, muitas vezes, o cartão de teoria ou o flashcard.
- Como fica: grupos "Conteúdos · Teoria em cartões · Flashcards · Questões que você errou". Os resultados abrem direto no cartão.
- Esforço: P.

**14. Pausa que vira Pomodoro.**
- Por quê: o Vitor sai do exercício e pausa. Dá para transformar isso em ritmo saudável: 25 minutos de foco e 5 de pausa.
- Como fica: o cartão de pausa do P1-7 ganha "Pausa de 5 min · volto 14:35", com um anel que se esvazia. Na volta, entra a pergunta de recuperação "Qual era o tema?".
- Esforço: P.

---

## 3. Inconsistências entre as 4 matérias

| Tema | Bio | Quí | Mat | Por | O que fazer |
|---|---|---|---|---|---|
| Questões no banco (Início) | 500 | **571** | 611 | **541** | Atualizar `PRODUCT.md` ("até 500 por matéria") ou explicar o excedente. O documento e o app divergem |
| Campo `pista` (dica 1) | sim | sim | **não** | sim | Em Matemática, a dica 1 vem de outra origem: gerar `pista` com a mesma revisão |
| Dica 3 vaza a letra | 1 | 0 | 0 | **15** | P1-1 |
| Conteúdos sem degrau fácil (dif ≥ 3) | 3/69 | 4/57 | **39/78** | **40/50** | P1-9, ideia 6 |
| Crédito das ilustrações | Servier + IBGE (correto) | Servier (incompleto) | Servier (ícones próprios) | **Servier (errado)** | P1-4 |
| Cor de aviso diferente da cor da matéria | ok | ok | ok | **igual** | P1-6 |
| Contraste do texto colorido sobre a tinta | 4,26 | 4,65 | 4,29 | 4,53 | P1-14 |
| Chip de tempo "~5 min" | não | não | **sim** | não | P2-10 |
| Temas na faixa | 12 | 12 | **17** | 12 | Em Matemática, 17 ladrilhos pedem 3 rolagens. Agrupar pelas áreas ou ordenar pelo peso da São Camilo |
| Flashcards | 65 | 62 | 58 | 50 | ok. O "de 40" do Treino geral é igual nas 4 e não explica o que é (P2-8) |
| Texto do botão principal | branco | branco | branco | **tinta escura** sobre amarelo | Correto pela acessibilidade (o amarelo com branco dá 1,69:1). Manter, e usar o mesmo peso e tamanho |
| Qualidade dos prints | Objetivo/Vunesp bons; listas pequenas | listas pequenas (Mundo Educação) | marca d'água "OBJETIVO" pesada | caderno bom; textos longos | P0-2. Nos prints com marca d'água, avaliar `filter:contrast(1.08)` só no print |

---

## 4. Como conferir depois de corrigir

- **Vazamento de gabarito nas dicas.** Para cada `res/*.json`, testar `re.search(r'\b(alternativa|letra)\s+'+gab+r'\b', passos[0].faz)`. O resultado esperado é 0.
- **Largura do print.** Com o `q-print`, medir `getBoundingClientRect().width` antes e depois de responder a 1366 e 1440. Esperado: ≥ 560 px nos dois momentos.
- **Celular.** A 390 px, o `#v-inicio .capa.ad-tem-tg` não pode ter nenhum filho mais estreito que 300 px.
- **Meia tela.** A 960 px, o `#b-busca` deve ter largura ≥ 220 px e não pode sobrepor o `.sync`.
