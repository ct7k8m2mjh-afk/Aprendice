# Flashcards (estilo Anki) — implementação (30/10/2026)

Pedido do dono: na revisão de cada matéria, flashcards do que os vestibulares mais cobram. Ele lê a frente, **escreve** a resposta com as palavras dele, corrige, e o app aceita resposta certa dita com outras palavras. Logo depois aparecem a correção e a resposta-modelo.

**Arquivos editados:**
- `design/materia.js`
- `design/materia.css`
- `design/shell.html`
- `design/icones.js`
- `design/gera_design.py`

**Cópia do que havia antes:** `design/bak_flash/`.
**Não editei** `<m>/app.js`, `<m>/index.html` nem os dados. As duas mudanças necessárias no `app.js` entram pelo build, como as outras.
**Build:** rodou só em `/home/claude/esc_test`. **Falta rodar `python3 design/gera_design.py` em escadas-sc.**

## Onde fica
- **Revisão de cada matéria.** Ganhou duas abas: **Questões**, que é a fila de erros de antes, e **Flashcards**, com um selo mostrando quantos vencem hoje.
- **Tela dos flashcards.** No topo ficam três números: para revisar hoje, novos e firmes. Embaixo:
  - botão **Começar**, com a composição da sessão (ex.: "20 cartões: 3 para revisar · 17 novos");
  - filtro por **área** (`D.areas`), em pílulas;
  - lista de **temas**, cada um com uma barra de firmes e as contagens. Tocar num tema filtra só ele.
  - O filtro fica lembrado (`ad-fl-area-<m>` e `ad-fl-mod-<m>`).
- **Shell:**
  - no Início, a linha **"Flashcards de hoje"** no bloco Hoje. Ela mostra "N para revisar · Biologia 5 · Química 3" ou "20 cartões novos de X" e abre a matéria com mais cartões vencidos;
  - item **Flashcards** no menu lateral e na folha "Mais" do celular;
  - **"Flashcards · Matéria"** na busca (Ctrl+K).
- **Matéria sem cartões** (`D.flash` vazio ou ausente): a aba, o item do menu, a linha do Início e a busca somem. O comando `flash` cai na Revisão de questões. Conferido tirando o `D.flash` de Português no teste.

## O cartão
1. **Frente grande:** 30 px no PC e 23 px no celular. Acima dela vêm o ícone do conteúdo, o tema e o conteúdo, e os selos de tipo (Conceito, Fórmula, Como identificar, Comparação, Processo, Exemplo) e de Novo, Revisão ou De novo.
2. **Campo de texto:** "Sua resposta, com as suas palavras", em 19 px.
   - **Corrigir** também funciona com Enter. Shift+Enter pula linha.
   - **"Não sei: ver a resposta"** mostra a resposta direto e sugere Errei.
3. **Depois de corrigir aparecem:**
   - o veredito com cor: **Certo** em verde, **Quase** em âmbar e **Ainda não** em coral;
   - de onde veio a correção: "Correção por IA" ou "Comparação automática, sem IA: confira você";
   - o comentário;
   - **Sua resposta** e a **Resposta-modelo**, lado a lado no PC;
   - **O que faltou**;
   - **Cuidado** (`erro_comum`), só quando a resposta não está certa.
4. **Botões de resultado:** **Errei / Quase / Acertei**, cada um dizendo quando o cartão volta (ex.: "volta hoje", "volta amanhã", "volta amanhã, depois em 3 dias").
   - O botão sugerido pela correção vem destacado e com o foco: Enter confirma.
   - O aluno pode escolher outro, ou seja, discordar da IA. As teclas 1, 2 e 3 também marcam.
5. **Sessão:** 20 cartões, com barra "Cartão i de n" e Voltar.
   - Errei: o cartão reaparece uma vez no fim da sessão.
   - **Tela de resultado:** "N de M certos", quadradinhos (verde, âmbar, coral), "acertei · quase · errei", cartões novos aprendidos e quando voltam. Botões "Mais N cartões" e "Voltar aos flashcards". Sair no meio também leva ao resultado.
6. **Ícones:** só SVG: `ICO.ui.cartoes` e `ICO.ui.lapis`, que são novos em `icones.js`, além de check, x e meio círculo para o Quase. Nenhum emoji e nenhum glifo de teclado.

## Correção
**Com IA:**
- **Quem chama.** As matérias rodam em quadros, sem `window.claude`. Elas pedem ao shell por mensagem (`{ia:'oi'|'req'|'cancel'}`) e recebem `{ia:'disp'|'res'}`, como a ponte do db.
- **Disponibilidade.** O shell usa `const sample = await claude.use('sample')`; se vier `null`, a IA não existe e a matéria usa a correção manual. A IA só é chamada no clique em Corrigir, porque o primeiro uso pede consentimento.
- **Chamada.** `sample.json(prompt, {modelTier:'quick', signal})`. O prompt manda frente, verso, `essencial`, `aceita`, `erro_comum` e a resposta (entre `<<<` e `>>>`, com a ordem de ignorar instruções dentro dela).
- **Critério pedido.** "certo" quando todas as ideias essenciais aparecem, mesmo com sinônimos ou em outra ordem; "quase" quando falta uma parte; "errado" quando contradiz ou falta o essencial. O prompt também pede que a correção não seja exigente com ortografia nem com a forma.
- **Resposta.** JSON `{veredito, faltou[], comentario}`, conferido no shell: veredito fora dos três vira `invalid_json`; `faltou` fica com no máximo 4 itens; o comentário é cortado em 600 caracteres.
- **Enquanto espera:** "Corrigindo a sua resposta…" e o botão **"Corrigir sem IA"**, que cancela o pedido (`AbortController`).
- **Erros:**
  - `not_granted`, `sampling_disabled`, `not_declared`, `capability_*`: a IA some até o fim da visita, o shell avisa todos os quadros e a correção vira manual;
  - `rate_limited`: aviso "a correção por IA atingiu o limite de uso agora" e correção manual;
  - qualquer outro erro: aviso genérico e correção manual. Nada é repetido sozinho.

**Sem IA, ou se a IA falhar.** Uma comparação local tolerante só *sugere* o resultado, e o aluno confirma vendo o verso.
- **Normalização:**
  - tira acentos e caixa;
  - números por extenso viram algarismos;
  - os símbolos > < ≥ ≤ ≠ = − + · / ^ viram palavras;
  - subscritos e sobrescritos viram dígitos (NFKD);
  - tira palavras vazias. Letra solta é mantida quando o essencial é matemático.
- **Peso das palavras:** cada palavra pesa pela raridade nos cartões da matéria (IDF), então termo técnico conta mais que "modelo" ou "célula".
- **Erros de digitação:** uma letra a mais, a menos ou trocada (palavras com 5 letras ou mais), radical comum (6 letras ou mais) e plural (menor/menores) contam como a mesma palavra.
- **Cada ideia essencial:** coberta com 70% ou mais do peso; parcial com 34% ou mais.
  - Uma forma de `aceita` encontrada cobre a ideia essencial com que ela tem mais palavras em comum.
  - Reproduzir a resposta-modelo (80% ou mais) vale como certo.
- **Sentido invertido:** "do hipertônico para o hipotônico", ou "do mais concentrado pro menos concentrado" quando o `aceita` diz o contrário, vira "Ainda não", com a explicação de que a resposta inverte o sentido.
- **Varredura (633 cartões das 4 matérias):**
  - o verso como resposta dá Certo em 633 de 633;
  - os `essencial` juntos, também 633 de 633;
  - a 1ª forma de `aceita` (cartões com 1 essencial) dá Certo em 193 de 193;
  - uma resposta vaga ("não lembro, acho que é outra coisa") dá Errado em 626 e Quase em 7.

## Revisão espaçada (por cartão)
**Estado:** `S.flash[id] = {etapa, vence, hist:[{ts, v:'e'|'q'|'a', c:'ia'|'ia-mudou'|'local'|'nao'}]}`. O histórico guarda os 12 últimos registros.

**Regras:**
- **Acertei:** novo → 1 dia; depois sobe um degrau (1, 3, 7, 16, 35, 80 dias), com teto em 80.
- **Quase:** volta amanhã e desce um degrau.
- **Errei:** `etapa = -1` e vence agora, ou seja, volta hoje e conta como "para revisar". Na sessão, ele reaparece no fim.

**Ordem da sessão:**
- vencidos primeiro (os mais atrasados antes);
- depois os novos: peso 3 antes, alternando os temas;
- a ordem final intercala revisão e novo e evita dois cartões do mesmo conteúdo seguidos.

**Firmes:** etapa 2 ou mais (intervalo de 7 dias ou mais).

## Persistência: não zera nada
- **Mesmo estado de progresso.** O `S.flash` fica no mesmo `S` de `saocamilo.<m>.v1` e é salvo pelo `salva()` do app. O resto de `S` não é tocado: o objeto `flash` só é criado na primeira resposta.
- **Conta.** O `app.js` gravava na conta só `{q, sims, atualizado}`. O `gera_design.py` agora troca, de forma idempotente, para `{q, sims, flash, atualizado}`. Ao ler a conta, junta os cartões com `window.adFlashMescla`: por cartão, vale o respondido por último, e os históricos se juntam. Sem essas duas trocas, a próxima gravação apagaria os flashcards da conta.
- **Shell:**
  - lê `flash` do navegador e da conta para a linha do Início;
  - a ponte `get` com o legado v20 não descarta mais o `flash`;
  - o índice ganhou `IDX[m].fl`, a lista de ids dos cartões.

## Como foi conferido
- **Onde:** `/home/claude/esc_test`. As matérias foram copiadas (`tar`, sem `res/`, que segue como link só de leitura) e são pastas reais, não links. O build foi rodado duas vezes para conferir que é idempotente: 1 ocorrência de cada troca no `app.js` e no `index.html` das 4 matérias.
- **Ambiente:** servidor em `:8766` e Playwright/Chromium.
- **Rodadas:** 1366×768 claro com IA e sem IA, 1920×1080 claro com IA, 390×844 por toque com IA e sem IA, e "Português sem cartões" a 1366. Também um print no tema escuro.
- **Stub da IA:** só no teste, injetado por `addInitScript` apenas na página principal. Ele devolve certo, quase ou errado, `rate_limited` e `not_granted` conforme o texto digitado. Não ficou nada dele no código.
- **Conta simulada:** `teste_sync.js`, com db e user em memória, também só no teste.

**Resultados:**
- **0 pageerror e 0 erro de console** em todas as rodadas. Nenhuma rolagem horizontal.
- **Caminho com IA:**
  - as chamadas usam `modelTier:'quick'` e o prompt traz essencial, aceita, erro comum e o formato JSON;
  - Certo, Quase e Ainda não aparecem com o comentário;
  - o aluno discordou no 2º cartão (Quase → Acertei) e valeu a escolha dele;
  - `rate_limited` mostra o aviso e passa para a correção manual;
  - `not_granted` desliga a IA: o cartão seguinte já vai direto para a comparação local.
- **Caminho manual:** verso → Certo, forma de `aceita` → Certo, resposta vaga → Ainda não, "Não sei" → Errei sugerido.
- **Persistência:**
  - o progresso antigo (3 questões de Biologia) continua depois de recarregar (3 de 3);
  - os cartões persistem (`qui.flash` = 4 a 7, conforme a rodada);
  - a linha do Início passa a dizer "3 para revisar · Química 3";
  - a capa mostra "3 para revisar hoje · 151 novos".
- **Conta:** os cartões vão para a conta (`prog_qui`: q=1 antigo, flash=3). Num navegador limpo, só com a conta, eles voltam: a linha do Início e a capa mostram 3 para revisar.

**Prints:** `design/flash_prints/`. Também estão lá os roteiros `teste_flash.js`, `teste_local.js`, `teste_casos.js` e `teste_sync.js`.

## Para publicar
- Rodar `python3 design/gera_design.py` em escadas-sc.
- O Artifact precisa declarar a capacidade **`sample`** (`capabilities: {..., sample: {}}`) além de db/user. Sem ela, `claude.use('sample')` dá `null` e os flashcards funcionam só no modo manual.
