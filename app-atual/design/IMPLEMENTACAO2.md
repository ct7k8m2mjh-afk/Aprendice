# Implementação 2: navegação por módulo, áreas, teoria em cartões e ícones (29/10/2026)

Arquivos editados: `design/materia.js`, `design/materia.css`, `design/icones.js`, `design/shell.html` e `design/gera_design.py`.
Cópia do que havia antes: `design/bak_impl_2910/*.antes_impl2`.
Não mexi em `<m>/app.js`, `<m>/index.html` nem nos dados. O build rodou só em `/home/claude/esc_test`, com cópias reais das matérias. **Falta rodar o `gera_design.py` de produção em `escadas-sc`.**
Prints em `design/depois2/` (claro 1366×800 e 1920×1080, escuro 1366×800, celular 390×844, nas 4 matérias).

## O que mudou para o Vitor

### 1. Módulo sem escolher tema por tema
Clicar num tema (faixa do topo, "Questões", Desempenho, busca ou área) abre a **página do módulo**. Ela traz:
- ícone grande e nome do tema;
- "N de M respondidas · acerto · K conteúdos";
- progresso por faixa: Básico, Intermediário, Avançado e Vestibular;
- botão grande **Começar**, com a composição embaixo (ex.: "12 questões de 6 conteúdos · 2 revisões vencidas · do mais fácil ao mais difícil");
- botão "Teoria em cartões · N";
- **O que você vai encontrar**: cada conteúdo com o seu ícone, a 1ª frase do "O que é" do cartão e o progresso.

Quem quiser escolher usa o link discreto "Prefere escolher? Ver por conteúdo". Ele mostra um botão "Escada" em cada conteúdo. Embaixo da página ficam o tema anterior e o próximo.

**A sessão do Começar** (`montaSessao`, 12 questões):
- entram primeiro as revisões vencidas do módulo (até 1/3 da sessão);
- depois as questões não respondidas, embaralhadas, por cotas de faixa a partir da mais baixa disponível: 40%, 30%, 20% e 10%;
- cada faixa leva primeiro no máximo 1 questão por conteúdo, escolhida em rodízio a partir do conteúdo que menos apareceu;
- quando as novas acabam, entram as erradas e depois as mais antigas.

**Ordem final:** as faixas nunca descem. Dentro da faixa, a próxima é a de menor nível que não repete os 2 últimos conteúdos (empate sorteado, preferindo alternar lista e vestibular).

**Conferido em 1.060 sessões simuladas:**
- a faixa desceu 0 vezes;
- conteúdo repetido em seguida: Biologia 7 em 2.640 passagens. Nos temas de Matemática com 2 ou 3 conteúdos (M15–M17) a repetição é inevitável.

A sessão usa o mesmo fluxo do treino: barra "Questão i de 12 · Citologia", resultado no fim, "Mais questões de Citologia" e "Voltar a Citologia". O Voltar da questão também volta ao módulo. A grade de "Questões" virou uma grade de temas com ícone, número de conteúdos e progresso.

### 2. Áreas de revisão no início da matéria
A seção "Revise por área" fica logo abaixo da capa. Cada área de `D.areas` é uma pílula com ícone; a escolhida fica na cor da matéria e é lembrada (`ad-area-<m>`). O painel da área mostra:
- "Revise química orgânica", com o resumo e os tópicos;
- "N de M respondidas nesta área";
- **Começar**, com a sessão sortida entre os módulos da área;
- os temas da área, cada um com progresso e link para a página do módulo.

Funciona pelo teclado com ← e →. A busca (Ctrl+K) ganhou o grupo "Áreas de revisão".

### 3. Teoria em cartões
Cada cartão mostra:
- ícone do conteúdo e título de 26 px;
- **O que é**;
- **Como identificar**;
- **Exemplo**, num bloco tingido; o texto entre `**…**` vira destaque na cor da matéria;
- **No caderno**, na letra de mão (Patrick Hand, 23 px) sobre papel quadriculado;
- **Cuidado**, num bloco âmbar com ícone de aviso.

Expoentes escritos com `^` viram `<sup>`: `16^(1/4)`, `16^0,25`, `a^m`.

**Na questão, aba Teoria:**
- primeiro, os cartões do conteúdo da questão (`q.sub`), na versão compacta;
- depois, o botão "Ver toda a teoria de X · N cartões";
- "Outros conteúdos deste tema", recolhido;
- "Resumo do tema em texto corrido", recolhido: é o resumo antigo, com fórmulas e erro clássico;
- a galeria.

O botão "Revisar a teoria de…" do erro e o botão de teoria da escada abrem os cartões já no conteúdo certo.

**Tela de teoria do módulo:**
- navegação fixa com um botão por conteúdo (ícone e nome) que rola até o grupo;
- cartões agrupados por conteúdo, em 2 colunas a partir de ~1000 px;
- "Praticar este tema", resumo antigo recolhido, galeria e "Teoria do próximo tema".

### 4. Ícones
O `gera_design.py` lê `design/icones_pro/*.svg` (`M-OUTRO.svg` vira `OUTRO`). Ele:
- tira o `<svg>` de fora;
- enxuga números com 3 ou mais casas decimais só dentro de `d`/`points`;
- troca `%ICOPRO%` em `icones.js`.

Cada matéria recebe só os seus ícones. O shell recebe todos, porque a busca e a "Atividade recente" mostram conteúdos das 4 matérias. Isso subiu o `index.html` do shell de 340 KB para cerca de 700 KB.

`ICO.tema(id)` usa o ícone pro do id. Se o id não tiver ícone, usa o do módulo; se o módulo também não tiver, usa o desenho antigo. O ícone pro aparece em todo lugar:
- faixa de temas e grade de temas;
- página do módulo e "O que você vai encontrar";
- áreas;
- cartões e navegação da teoria;
- conteúdos relacionados (cada um com o seu ícone);
- atalhos sob a questão;
- revisão, desempenho e motivo de fundo;
- busca e "Atividade recente" no shell.

Os créditos ficam no comentário de `icones.js` e em `icones_pro/LICENCAS.md`. Saiu o último glifo de teclado do app avulso (`nav.bot em`).

### 5. Figura na resolução
Depois de confirmar, logo abaixo do veredito aparece **Figura do conteúdo**:
- o pacote `img/<mod>.json` é filtrado pelas figuras que listam `q.sub`;
- vem primeiro a figura cujo conteúdo **principal** é o da questão, depois a mais específica;
- a imagem fica num cartão branco e abre ampliada ao clicar, com navegação entre as N figuras do conteúdo.

Galeria, figura e imagem ampliada estão sempre em papel branco nos dois temas, inclusive as de estilo "caderno", que antes eram creme.

### 6. Tela cheia (acréscimo do coordenador)
**Antes de responder:**
- a coluna da questão ocupa 70% (`7fr / 3fr`) e o painel fica estreito, sem "relacionados";
- o print enche a coluna. O JS mede a proporção do print já com o corte do rodapé (`--ar`), e a largura é limitada pela altura útil: `(100vh − 300px) × ar`;
- piso de 820 px, para nunca voltar a ficar pequeno;
- as letras A–E e a linha do Confirmar usam a mesma largura do print.

**Depois de responder**, a resolução alarga (`1.1fr / minmax(460px,1fr)`).

**Medido:**
- 1366×800: print com ~875 px (antes 680), tudo à vista sem rolar;
- 1920×1080: print com ~1260 px.

## Como foi conferido
Playwright/Chromium, roteiro `teste.js`, rodado no claro em 1366×800 e 1920×1080, no escuro em 1366×800 e no celular em 390×844, nas 4 matérias:
1. Início com as áreas e troca de área.
2. Página do módulo, em cima e em "O que você vai encontrar".
3. Começar.
4. Três questões respondidas: a 1ª errada de propósito, com prints da resolução com figura e da aba Teoria; as outras certas.
5. Teoria do módulo, em cima e no meio.
6. Tela cheia antes e depois de responder.
7. Grade de temas.
8. Recarga da página.

Roteiro à parte: busca ("membrana", "orgânica" → Enter abre a área), "Ver por conteúdo" → escada, teoria aberta num conteúdo, galeria e imagem ampliada.

**Resultados:**
- **0 pageerror e 0 erro de console** em todas as configurações.
- **Sessão:** na rodada final, as 3 primeiras questões vieram de 3 conteúdos diferentes nas 4 matérias e nas 4 configurações (ex.: bio B01.5 → B01.3 → B01.1; por P01.2 d2 → P01.4 d3 → P01.1 d3), em dificuldade que nunca desce.
- **Figura:** apareceu nas 3 resoluções de cada matéria.
- **Progresso:** grava em `saocamilo.<m>.v1` (4 respostas por matéria) e continua depois de recarregar ("3 de 42 respondidas · acerto 67%" no módulo). A ponte db não foi tocada.

## Para quem continuar
- Rodar `python3 design/gera_design.py` em `escadas-sc` para levar tudo aos apps reais.
- O resumo antigo continua nos dados e aparece recolhido; nada foi apagado.
- Em Química, só 23 dos 57 conteúdos têm figura no banco. Nos outros a resolução simplesmente não mostra figura.
