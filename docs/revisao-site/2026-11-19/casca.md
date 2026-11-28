# Revisão do site, 19/11/2026: casca

Revisor independente (não corrigiu nada). Parte: casca — entrada/login, cadastro e recuperação de senha, boas-vindas, início, menu lateral, trilho e abas do celular, busca, perfil, configurações, simulados (lista, por conteúdo, execução, pausa, entrega, resultado), revisão espaçada (tela e uma sessão), telas de aviso, erro e vazio.

Método: build local em http://localhost:4190 (ramo `app-prototipo-completo`), Playwright/Chromium, deviceScaleFactor 1, larguras 390, 768, 1280 e 1440, temas claro e escuro; medidas por `getComputedStyle`; rolagem lateral, estouro, truncamento, fundos neutros, emoji, áreas de toque e erros de console/rede verificados por script. Prints: `qa-casca-*.png` no scratchpad da sessão.

Gravidade: **erro** · **diferença do sistema** · **sugestão (decisão do dono)**.

## Problemas

### Entrada (login) e boas-vindas

1. **Entrada, 390 e 768, claro e escuro — `.l-painel` (formulário de login).** Atual: o painel começa em y=843 (tela de 844px) em 390 e em y=911 (tela de 1024px) em 768; o aluno precisa rolar por título, texto, ilustração e três vantagens para achar o e-mail. Referência: o login deve estar à vista ao abrir no celular. **Erro.**
2. **Entrada e boas-vindas, todas as larguras, tema escuro.** Atual: com o sistema no escuro, `html[data-theme]` continua `light`; não há tema escuro nem botão Dia/Noite antes de entrar; `app/src/estilo/login.css` não tem regra de escuro. Referência: CLAUDE.md, princípio 8 (tema claro padrão e escuro). **Erro.**
3. **Entrada, todas as larguras — `.l-painel` e `.l-google`.** Atual: fundo `rgba(255,255,255,.77)` e `rgba(255,255,255,.6)` (branco quase puro). Referência: DESIGN.md linhas 37–45 ("Superfícies": cartão nunca branco; folha fora das matérias #FCFAF5 / #24201A). **Diferença do sistema.**
4. **Entrada — `.l-rodape` ("Versão de demonstração • tudo fica salvo só neste aparelho").** Atual: 10px, cor #9B9397, contraste 2,9:1 sobre o painel (`login.css:123`). Referência: contraste mínimo 4,5:1; texto secundário `--fs-info` 13,5/14px (DESIGN.md, Tipografia). **Erro.**
5. **Entrada, 390 — textos pequenos.** Atual: `.l-selo` 10,5px; `.l-faixa` 12px; `.l-lead` 14,3px. Referência: texto 16px e secundário 13,5px no celular (DESIGN.md, Tipografia). **Diferença do sistema.**
6. **Entrada, 390 — áreas de toque menores que 44px.** Atual: `.l-esqueci` 137×17; `.l-trocar button` ("Criar conta") 84×18; `.l-olho` 36×35. Referência: 44px mínimo no celular. **Erro.**
7. **Entrada, modo "Criar conta" — `.l-esqueci`.** Atual: "Esqueceu sua senha?" aparece também no modo de criar conta (`app/src/telas/Login.tsx:68` não depende de `modo`). Referência: só no modo "Entrar". **Erro.**
8. **Entrada, 1440 — `.l-painel-sub`.** Atual: a frase quebra e "evolução." fica sozinha na segunda linha. **Sugestão.**
9. **Boas-vindas, 390, claro — passo "Provas-alvo" (`.bv-corpo h1`).** Atual: depois de "Entrar no Aprendice" a tela nova abre rolada 164px (`scrollY` 164; título em y=-7): título e etapas cortados em cima. Referência: abrir no topo. Print `qa-casca-bv-provas-390-claro-tela.png`. **Erro.**
10. **Boas-vindas — "Voltar" no passo 2 (`.bv-acoes .btn.fantasma`).** Atual: volta ao login com o e-mail apagado (o passo 0 de `BoasVindas.tsx` é o `Login`, e o formulário antigo do passo 0 ficou sem uso). **Sugestão.**
11. **Boas-vindas e Perfil — `.ep-item .etq.ok` ("1097 questões") e `.bv-passos li.feito span`.** Atual: verde de "certo" (#0A7550 sobre #E2F6EE) para informação neutra. Referência: DESIGN.md linha 27 ("certo / certo-bg … só certo"). **Diferença do sistema.**
12. **Perfil e Boas-vindas — lista de provas-alvo enquanto o banco carrega.** Atual: todas as provas, inclusive "Enem · INEP" e Fuvest, aparecem com "em preparação" até carregar (`app/src/telas/EscolhaProvas.tsx:43`). Referência: mostrar "carregando", nunca uma informação falsa. Print `qa-casca-perfil-390-claro.png`. **Erro.**
13. **Nome do ENEM escrito de três jeitos.** Atual: "Enem · INEP" (provas-alvo), "ENEM" (simulados, busca), "banca Inep" (cabeçalho do grupo ENEM em Simulados). Referência: um nome só. **Erro de texto.**

### Simulados

14. **Simulados, aba Provas, chip "Minha região" (provas-alvo = ENEM), todas as larguras.** Atual: aparecem Anhembi Morumbi 2022 (SP) e UEMG 2024/2022 (MG) junto do ENEM; causa `app/src/telas/Simulados.tsx:33` (`return !r || conj.has(r)`: prova sem região conhecida entra em qualquer filtro). A Anhembi Morumbi também aparece sem instituição e sem "Sobre a prova". Referência: DESIGN.md, Filtro de região (Simulados abrem em "Minha região"). Print `qa-casca-simulados-1440-claro.png`. **Erro.**
15. **Simulados, lista de provas — `.cs-titulo` ("ENEM 2025").** Atual: 17px 600 na cor `lapis` (#585B64 claro / #A3A6B0 escuro), enquanto os títulos de "Em preparação" (`.sim-linha.prep .sim-txt b`) estão em `tinta`; as provas disponíveis parecem desativadas e as indisponíveis parecem ativas (`app/src/estilo/sistema.css:458`). Referência: título em `tinta`, 600, `--fs-tema` (DESIGN.md, Tipografia; Simulado: "Lista: folha por instituição"). **Erro de hierarquia.**
16. **Simulados, "Em preparação" — `.sim-linha.prep .sim-txt > span`.** Atual: mostra ao aluno textos de produção, como "caderno a baixar manualmente (site da Vunesp)" e "itens de certo ou errado (formato Cebraspe)", com inicial minúscula (`app/src/dados/provas.ts:93-96`). **Sugestão (decisão do dono).**
17. **Simulado por conteúdo — descrição na configuração (`.titulo-pag .sub`).** Atual: "…da mais fácil à mais difícil. Gabarito oficial." (`app/src/logica/simulados.ts:64`), mas `planoDoConteudo` (`simulados.ts:51`) não exclui `gabFonte:'aprendice'` (89 questões em Bio, 72 em His, 75 em Geo; exemplo: Bio B07.5). Referência: CLAUDE.md, princípio 2 ("Gabarito do Aprendice" sempre identificado). **Erro.**
18. **Simulado por conteúdo, Biologia, região ENEM — `.sc-barra .chip` (10/20/30/45).** Atual: os conteúdos têm 1 a 3 questões; o aluno escolhe 45 e recebe 3 ("3 conteúdos · 3 questões"), sem aviso do motivo nem atalho para "Todas as regiões". **Sugestão.**
19. **Simulado por conteúdo, 390 — `.sc-barra` fixa no pé.** Atual: cerca de 170px de altura sobre as abas de 70px; sobram cerca de 560px de tela para a lista. **Sugestão.**
20. **Resultado do simulado (por conteúdo), todas as larguras — `.res-sim .fraco`.** Atual: "Os erros e as questões em branco já entraram na revisão espaçada." (`app/src/telas/SimuladoResultado.tsx:43`), mas `SimuladoExec.tsx:143` só grava itens com letra (`x.letra`): com 2 erradas e 1 em branco, a revisão mostrou 2. **Erro.**
21. **Simulado em andamento, 390 — áreas de toque.** Atual: `.q-volta` (Sair) 32×30; `.folha-btn` 32×38; `.crono` (pausa) 59×28; `.q-marca` 36×36; `.q-amplia` 85×28; `.certeza .chip` 30px de altura. Referência: 44px. **Erro.**
22. **Simulado pausado — `.pausa-tela`.** Atual: as questões ficam escondidas, mas "Entregar" e a folha de respostas continuam ativos na barra. **Sugestão.**
23. **Menu lateral e abas do celular, rotas `/simulado/agora` e `/simulado/resultado/*`.** Atual: o item "Simulados" não fica ativo (o NavLink de `/simulados` não casa com `/simulado/...`, `app/src/ui/Casca.tsx`). **Erro.**
24. **`#/simulado/resultado/123` (resultado inexistente).** Atual: só "Resultado não encontrado" e o botão "Simulados", sem explicação. **Sugestão.**
25. **Rota inexistente `#/xyz`.** Atual: redireciona ao Início sem nenhum aviso (`app/src/App.tsx:75`); não há tela de página não encontrada. **Sugestão (decisão do dono).**

### Busca

26. **Busca, todas as larguras — Esc.** Atual: com o foco no botão Fechar ou num resultado (depois de Tab), Esc não fecha; o atalho só existe no `onKeyDown` do campo (`app/src/telas/Busca.tsx:74`). Referência: Configurações, "Esc: sair da questão ou fechar". **Erro.**
27. **Busca — o que ela procura.** Atual: o botão do topo diz "Buscar conteúdo, questões ou simulados…" (`Casca.tsx`), mas o índice não tem questões: "Fuvest 2024" traz só o simulado. O texto dentro da janela é outro ("Buscar conteúdos, temas, provas, cartões"). **Erro.**
28. **Busca "função".** Atual: o tema "Funções afim e quadrática" não aparece (sem plural), e o grupo Cartões vem antes de Conteúdos, que são mais relevantes. **Erro.**
29. **Busca — `.busca-item .det` ("Fotossíntese… · 3 questões").** Atual: a contagem já vem filtrada pela região do aluno, sem dizer isso. **Sugestão.**

### Revisão

30. **Sessão de revisão (`/m/bio/q/<id>?ctx=revisao`) — contador da `.q-barra`.** Atual: a primeira questão mostra "Ecologia · 1 de 4"; depois de responder, a seguinte mostra "1 de 3" em vez de "2 de 4". **Erro.**
31. **Sessão de revisão, 390 — `.tabs a.ativo`.** Atual: a aba ativa é "Matérias", porque a rota é `/m/...`. Referência: "Revisão". **Erro.**
32. **Revisão, 390 — ordem da tela.** Atual: as questões do dia (`.grade.g2 .bloco`) começam em y≈1314, abaixo do destaque "Revisão geral" (398px), da agenda, das abas e dos chips de região. **Sugestão.**
33. **Revisão, 390.** **Erro.** Atual:
    - as 6 abas (`.abas-rev`) ocupam 3 linhas de 2 colunas;
    - "Revisão geral" aparece duas vezes (destaque `.rv-geral-dest` e aba);
    - nas linhas `.linha-lista` a etiqueta ocupa metade da largura e o título quebra como "ENEM 2020 · questão / 95".
34. **Revisão — agenda (`AgendaRevisao`).** **Sugestão.** Atual:
    - letras dos dias "S S D S T Q Q": "S" vale para sexta, sábado e segunda;
    - a frase "4 questões voltam nos próximos 7 dias, 4 hoje." confunde, porque as 4 estão atrasadas desde hoje.

### Menu, topo, Perfil e Configurações

35. **Menu lateral, 1440×900, "Outras matérias" aberta — `.lado`.** Atual: o conteúdo passa da altura (946/900px), "Configurações" sai da tela, e a onda e o pontilhado ficam por cima de "meta da semana". Referência: DESIGN.md, Casca ("Onda verde e pontilhado no pé, nunca cortados"). Print `qa-casca-menu-outras-1440-claro.png`. **Erro.**
36. **Menu e trilho — ícones de História, Filosofia e Sociologia e Inglês (`.ic-mat`).** Atual: ícones coloridos (prédio, lâmpada, bandeira britânica), diferentes dos ícones de traço das outras matérias. Referência: DESIGN.md, Outros ("Ícones de interface: Lucide, traço 1.75"). Print `qa-casca-menu-recolhido-his-1440-claro.png`. **Diferença do sistema.**
37. **Medidas que não batem com o DESIGN.md.** **Diferença do sistema.**

    | Elemento (seletor) | Largura | Medido | Referência |
    |---|---|---|---|
    | Topo, Dia/Noite (`.tema-seg button`) | 390 | 39×29 (menos de 44) | área de toque 44px |
    | Chip (`.chip`, `app.css:209` sobreposto por `tipografia.css`) | todas | 15px 600; 31px de altura em 390 | 14,5px 500 (DESIGN.md, Outros) |
    | Abas do celular (`.tabs a`) | 390 | 13,5px 600 | 12px 500 (DESIGN.md, Casca) |
    | Grupo do menu (`.lado .grupo`, "Estudo") | 1440 | 14px 600 | 14px 500 (DESIGN.md, Casca) |

38. **Configurações e Perfil — textos e funcionamento.** **Erro.**
    - **Créditos:** "cada questão traz o link da fonte e o gabarito publicado" contradiz o gabarito do Aprendice (`app/src/telas/Config.tsx:102`; CLAUDE.md, princípio 2). As fontes citam Familjen, Caveat e DM Sans, mas faltam Dancing Script e Literata (`Config.tsx:105`; DESIGN.md, Tipografia). "Aprendice · versão 0.1 (protótipo local)" aparece no site público (`Config.tsx:108`).
    - **Atalhos de teclado, 1440 (`.atalhos`):** tecla à esquerda e descrição longe, na direita; difícil de ler.
    - **"Sair da conta" (`app/src/telas/Perfil.tsx:66`):** zera o perfil inteiro (nome, provas-alvo, datas das provas, meta). Ao entrar de novo tudo volta ao padrão (ENEM, 150), embora o aviso diga "Sair não apaga o seu progresso".

## O que foi conferido e passou

- Sem rolagem lateral em 390, 768, 1280 e 1440, claro e escuro, em: entrada, boas-vindas, início, perfil, configurações, simulados (Provas, Por conteúdo, Histórico), configuração, execução e resultado do simulado, revisão (todas as abas), sessão de revisão e busca.
- Sem emoji e sem texto cortado com reticências.
- Fundo creme #F5F0E6 / #1A1712 e cartões #FCFAF5 / #24201A corretos na área logada; nenhum fundo branco ou preto puro fora do login.
- Login: avisos de e-mail inválido, senha curta, Google e recuperação aparecem; a entrada leva ao Início.
- Busca: Ctrl+K abre, Enter abre o resultado, "Nada encontrado para…" quando não há resultado.
- Simulado: o cronômetro conta e para na pausa; sair e retomar mantém o andamento; o aviso de entrega conta as questões em branco; o resultado mostra a nota por conteúdo; a correção abre com "Por que eu errei", "Resposta correta" e a resolução animada.
- Menu: recolher, trilho de ícones em 768, esconder e mostrar a barra, foco visível (contorno 2px afastado 2px), menu e abas assumindo a cor da matéria.
- Medidas conforme o DESIGN.md: título da tela 25/32px; seção 19/21px; campos 48px canto 12; botões 46px; topo 57/61px; menu 244px com itens de 38px.
- Nenhum erro de console nem requisição com falha (só avisos de "future flag" do React Router).
