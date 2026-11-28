# Super revisão (pedido do dono, 23/11/2026)

Objetivo: **nenhum erro para o usuário** antes de o site abrir ao público. Cada questão do site passa por um
**professor** e por um **aluno**; cada conteúdo passa por um **crítico de tela**. O que eles acharem é corrigido e
conferido de novo (princípio 3: a 1ª lente volta em tudo que mudou).

**O que se revisa é o SITE (dono, 23/11/2026).** Revisamos as questões do site, como o aluno as vê: as que estão
no ar em https://aprendice.vercel.app (o `banco.json` e `res/` de cada matéria em `/conteudo/<m>/`, iguais ao build
local de `app/`). Professor e aluno recebem a questão e a correção **como o site mostra** (enunciado ou print, as
alternativas, os 4 blocos da correção, a animação), não o rascunho da fábrica. Questão que não aparece no site não
entra. A correção é feita no arquivo-fonte (o que o `converte.py` lê) e conferida de novo **no site** (build local)
antes do commit.

Palavras do dono: "a resolução tem que estar de uma forma que o aluno entenda e consiga refazer o exercício olhando
ela". Não é para acrescentar linhas nem texto: é para a resolução ficar **clara e completa no essencial**. Encurtar
também vale.

## Divisão (no máximo 3 sessões de trabalho ao mesmo tempo, regra do dono 21/11)

| Sessão | Matérias, nesta ordem | Questões |
|---|---|---|
| SR-1 | Matemática → Física → Filosofia e Sociologia | 3.817 + 2.809 + 1.598 |
| SR-2 | Biologia → Química → Geografia | 2.894 + 2.989 + 2.592 |
| SR-3 | Português → História | 5.021 + 2.444 |
| Coordenação | Inglês | 2.508 |

Ordem dentro da matéria: conteúdo por conteúdo (subtema), começando pelas questões das provas-alvo e do ENEM
(mesma prioridade do `ferramentas/resolucoes/lote.py`), do nível básico ao avançado.

## Os três papéis (cada um é um agente separado; quem corrige não confere o próprio trabalho)

### 1. Professor (por lote de até 15 questões do mesmo conteúdo)
Professor experiente da matéria, de cursinho de ponta. Recebe a questão inteira (texto, alternativas, **print quando
houver figura ou quando o texto estiver estranho**), o gabarito oficial e a resolução como o site mostra.
1. Resolve a questão **sozinho, antes de ler a resolução**.
2. Lê a resolução e confere, campo por campo: a resolução responde **o que o enunciado pede**? Cada conta está certa
   (refazer em python)? Cada fato está certo? O passo a passo leva mesmo à resposta? A pegadinha é a desta questão?
   "Por que eu errei" de cada letra explica o erro de quem marcou **aquela** letra? "Por que as outras estão erradas"
   bate com o texto real de cada alternativa?
3. Confere a **animação** pelos dados que o motor desenha (`passos[].conta`, `quadro`, `visual`): uma transformação
   por linha, linha certa no passo certo, sem linha repetida, termo que muda de lado com o sinal certo, fração
   empilhável (`a/b`), resultado novo no lugar. Bio e Quí: o desenho mostra o fenômeno que a questão pede.
4. Devolve, por questão: `ok` ou a lista de problemas, cada um com **campo, o que está errado, como deve ficar**.
Gabarito oficial que parecer errado: **não muda nada**; segue a regra de `docs/resolucoes/PROMPT-SESSAO-RESOLUCOES.md`
(web, errata, anulação; "anular" vai para a coordenadora).

### 2. Aluno (mesmo lote, agente diferente do professor)
Estudante de 3º ano do ensino médio, bom mas não especialista; usa só o que um aluno sabe.
1. Faz a questão **sem ver nada** e marca uma letra (com certeza: alta, média ou baixa).
2. Abre a correção como o site mostra (os 4 blocos: Por que eu errei — se errou —, Resposta correta + pegadinha,
   Resolução animada, Por que as outras estão erradas).
3. **Refaz a questão só com o que a resolução mostrou**, escrevendo o caminho. Se não consegue, ou se precisou de
   algo que a resolução não deu, a resolução **falhou**: diz em que passo travou e o que faltou (uma frase).
4. Se errou de início: o "Por que eu errei" da letra dele explicou o erro **dele**? Sim ou não, e por quê.
5. Aponta qualquer coisa confusa, ambígua, longa demais, com termo que aluno não conhece, ou visual estranho.

### 3. Crítico de tela (por conteúdo, agente diferente)
Abre o site (build local, `npx vite` em `app/`, login de demonstração) e percorre o conteúdo como usuário: lista de
questões, responder, correção, **animação do início ao fim**, revisão, flashcards e teoria do conteúdo, em 390 e
1280 px, tema claro e escuro (princípio 9). Procura: texto cortado, sobreposição, rolagem lateral, animação que trava
ou desenha errado, fração na linha, botão que não responde, contagem errada, erro no console. Uma a três questões por
conteúdo (as que o professor ou o aluno marcaram primeiro). Achado de código vale para o site todo: registra uma vez.

## Correção
- A sessão corrige o que professor e aluno apontaram, **no arquivo-fonte da resolução** (o mesmo que o
  `lote.py` grava; nunca no `public/`), mantendo o formato de `res/` e as regras da skill `resolucao-exercicios`.
- Corrigir = deixar certo e claro. Proibido inflar: se a correção aumenta o texto, tem de ser porque faltava um
  passo de que o aluno precisou.
- Questão de prova (enunciado, print, gabarito, ids) **não se altera**. Fração sempre empilhada. Nada de emoji.
- Tudo o que mudou volta para um **professor novo** (outro agente), que confere só as mudanças. Só depois entra.
- Erro do motor de animação ou da tela: corrigir no código, com teste em `app/` (vitest), um commit por achado.

## Registro (para retomar de onde parou)
- `docs/revisao-site/super-revisao/<m>.md`: andamento da matéria (conteúdos feitos, questões, achados por tipo,
  correções feitas, pendências do dono). Atualizar a cada conteúdo.
- `docs/revisao-site/super-revisao/<m>-achados.jsonl`: uma linha por achado
  `{"id","sub","papel","campo","problema","correcao","status"}`.
- Commits em português, um por conteúdo (ou por achado de código). `git pull --rebase` antes de cada push; nunca
  `git add -A`; nunca dado pessoal em arquivo.

## Fim de cada matéria
`npx tsc --noEmit` e `npx vitest run` verdes, `python3 scripts/converte.py` sem erro; resumo no `<m>.md`; aviso à
coordenação (ela publica no ar e avisa o dono).
