# BRIEF COMUM — Painel de revisão do app ATIVIDADES DIARIAS (30/10/2026)

## O app
App de estudo do Vitor (vestibulando de Medicina; prioridade São Camilo, banca Vunesp; também Santa Casa, Einstein, Unesp, Fuvest). Ele usa principalmente um PC Windows no tema claro, e também o celular.
- **Matérias:** Biologia, Química, Matemática e Português.
- **Questões:** só reais (prints das provas e de listas públicas). Elas ficam organizadas em escadas por conteúdo, da mais fácil à mais difícil.
- **Resoluções:** animadas e escritas à mão. Na matemática há termos que trocam de lado na equação.
- **Treino geral:** a capa de cada matéria. Mistura questões ABC, frases para completar e flashcards.
- **Outros recursos:**
  - Flashcards escritos (correção por IA ou automática), com exemplos;
  - teoria em cartões;
  - dicionário com tooltip;
  - revisão espaçada;
  - simulados;
  - desempenho;
  - página principal com a matéria do dia.

**Gosto declarado do Vitor:**
- Visual: ilustração realista misturada com desenho; nada de emoji, nada de visual "de IA" genérico, nada de logo oficial.
- Meio-termo, sem extremos; tema claro primeiro; texto grande.
- Coisas que pareçam "feitas com carinho", movimento natural.
- Conteúdo: erro zero no material de estudo e fonte explícita.

## Como abrir e testar (não mexa em nenhum arquivo do app)
- Código: /home/claude/escadas-sc. A camada visual fica em design/materia.js, design/materia.css e design/shell.html. Dados: `cd /home/claude/escadas-sc && python3 -c "import dados_util as du; D=du.le('bio')"`, com as chaves banco, teoria, flash, essencial e dic.
- Sirva o app numa porta só sua: `cd /home/claude/escadas-sc && python3 -m http.server <PORTA>`, em background. Páginas: `/index.html` (principal, que carrega a matéria num iframe) e `/bio/index.html`, `/qui/index.html`, `/mat/index.html`, `/por/index.html`.
- Playwright (node): `const { chromium } = require('playwright'); const b = await chromium.launch();`. Para o tema escuro, `localStorage.setItem('ad-tema','dark')` via addInitScript.
- No contexto da página da matéria:
  - abrir uma questão: `abrirQuestao(id, {lista:[id], i:0})`;
  - responder: clicar em `#bolhas .bolha`, depois em `#b-conf`, e confirmar a certeza em `#ad-conf button` se ele aparecer;
  - flashcards: `window.postMessage({ad:'ir', v:'flash'}, '*')`;
  - Treino geral: clicar em `#ad-tg`;
  - simulados: `postMessage({ad:'ir', v:'simulado'})`;
  - progresso: `postMessage({ad:'ir', v:'progresso'})`;
  - resolução animada (só mat, e qui com equação): `.ad-ass-bt`.
- Tire prints de 1440×900 e de 390×844, e OLHE cada print com a ferramenta Read. Salve em /tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/painel/<seu-papel>/.
- Já existem 2 revisões; não repita o que elas dizem, a menos que ainda esteja errado: /home/claude/escadas-sc/REVISAO_PRO_3010.md e /home/claude/escadas-sc/AUDITORIA_PEDIDOS.md.

## Entrega
Escreva /home/claude/escadas-sc/painel/<SEU-PAPEL>.md em português com:
1. Como foi usar o app no seu papel: o que você tentou, onde travou, o que gostou. Cite o print.
2. Problemas concretos, priorizados (P0/P1/P2), com local exato e a correção sugerida, no nível de CSS/JS ou de conteúdo quando der.
3. 5 a 10 ideias novas e ousadas para o seu papel, cada uma com como ficaria e o esforço.

Seja específico e visual; nada de conselho genérico. Devolva um resumo de 8 linhas.
