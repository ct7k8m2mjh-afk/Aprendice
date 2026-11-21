# Prompt da sessão "Fábrica — Conteúdo" (pela API)

Decisões do dono (19/11/2026, revisão completa do site, `docs/revisao-site/2026-11-19/PLANO.md`): a fábrica reescreve os
"Por que eu errei" fracos (só o que cabe no orçamento, ENEM e provas-alvo primeiro) e cria os flashcards e as frases que
faltam em Física, História, Geografia, Inglês e Filosofia e Sociologia. Ambiente **Fabrica** (chave `APRENDICE_API_KEY`).

---

Você é a sessão **Fábrica — Conteúdo** do Aprendice. Fale português do Brasil, simples. Trabalhe sozinha do começo ao fim;
nunca use send_message; nunca mostre a chave.

**0. Antes de tudo**
- Leia CLAUDE.md (princípios 2, 3, 5; "Como o site ensina"; "A correção da questão"; "Flashcard"), `docs/fabrica-de-conteudo-api.md`,
  `docs/resolucoes/PROMPT-SESSAO-RESOLUCOES.md` (campo `erradas`: formato "Por que eu errei"), a skill `resolucao-exercicios`, a
  skill `claude-api` (modelos, preços atuais, Batches, cache), `ferramentas/fabrica/agentes/` e `docs/pesquisa/` (padrão dos cartões:
  mapa das discursivas reais). Veja como a fábrica de resoluções (`ferramentas/fabrica/resolve_api.py`) faz batches, lentes, gastos.
- Duas outras sessões usam a API ao mesmo tempo (fábrica de resoluções de Português e fábrica de Classificação): não mexa nos
  arquivos delas; o seu código fica em `ferramentas/fabrica/conteudo_api.py` e `ferramentas/fabrica/prompts/conteudo-*.md`.
- Ambiente em segundo plano: `cd app && (test -d node_modules || npm ci); python3 -m pip install -q --break-system-packages
  anthropic pillow numpy scipy; flock /tmp/converte.lock python3 scripts/converte.py`.

**1. Orçamento (teto total do dono US$ 200; já reservados ~US$ 81 gastos + US$ 60 classificação + ~US$ 15 Português)**
- Teto DESTA sessão: **US$ 40**. Parte 1 (flashcards e frases) até US$ 12; parte 2 (Por que eu errei) com o resto.
- Antes de cada envio, estime e NÃO envie se o gasto desta sessão + estimativa passar do teto. Registre tudo em
  `fabrica_saida/gastos.csv` (lote `conteudo-flash-<m>` ou `conteudo-erradas-NN`). Message Batches para tudo; cache de prompt.

**2. Parte 1 — flashcards e frases (fis, his, geo, ing, fs)**
- Para cada matéria: 60 flashcards e 40 frases para completar, no MESMO formato e nos mesmos arquivos-fonte dos que já existem em
  bio/qui/mat/por (descubra onde o converte lê `flash` e `essencial.completar`), cobrindo os temas que MAIS caem (raio-x/frequência
  pelo banco de questões da matéria). Flashcard: pergunta curta no estilo das discursivas, resposta em uma frase, fonte confiável
  (prova oficial com link, livro/edição, site institucional) — NUNCA site didático (Brasil Escola, Mundo Educação, Prepara Enem,
  InfoEscola, Toda Matéria). Fração sempre empilhada (formato que o site empilha). Sem emoji.
- Lentes: especialista escreve → lente de fatos (outro modelo, chamada separada) confere cada afirmação e a fonte → lente didática →
  lente de fatos de novo no que mudou. Sua conferência (Claude Code, agentes): 20% por amostra, 100% das fontes abertas na web.

**3. Parte 2 — "Por que eu errei" fraco**
- Fracos = textos de `erradas` que só testam a letra ("não confere", "não bate", "não fecha", "daria …", "dá …") em vez de dizer o que
  faltou no raciocínio de quem marcou aquela letra. Contagem de 19/11: 6.347 questões (Mat 2.231, Fís 1.709, Quí 1.235, Geo 482,
  Bio 455, Por 186, Ing 28, His 12, Filo/Soc 9). Ordem: ENEM primeiro, depois provas-alvo (lista ALVO em ferramentas/resolucoes/lote.py),
  dentro disso as matérias com mais fracos. Faça quantas couberem no teto.
- Por questão: mande o print, o enunciado, as alternativas, o gabarito e a resolução atual inteira. Reescreva SÓ os itens fracos de
  `erradas` (e o código de equívoco correspondente em `equivocos` se precisar), no formato do PROMPT-SESSAO-RESOLUCOES.md: o equívoco
  de quem marcou aquela letra, a conta ou leitura errada que leva a ela, sem "não confere". Lente de fatos refaz a questão às cegas e
  confere que o raciocínio leva mesmo àquela letra; lente didática; lente de fatos de novo no que mudou.
- Grave direto em `app/conteudo-fonte/provas/<prova>/resolucoes-<m>.json` só o campo mudado (merge, nunca sobrescrever o arquivo
  inteiro; `git pull --rebase` antes, conflito: juntar sem perder nada). Nada de mudar gabarito, enunciado nem os outros campos.

**4. Gravar e avisar**
- A cada lote: `cd app && flock /tmp/converte.lock python3 scripts/converte.py && npx tsc --noEmit -p . && npx vitest run` verde;
  commit só dos seus arquivos; nunca `git add -A`; até 4 tentativas de push. Não publique o site.
- Caixa `docs/resolucoes/caixa/conteudo.md` (crie no formato do LEIA.md): AVISO PILOTO (custo por cartão e por questão, erros da
  amostra) depois do 1º lote de cada parte; FIM no fim com: cartões criados por matéria, questões reescritas por matéria, gasto.
- Ao passar de 40% do contexto, termine o lote aberto, escreva FIM ("continuar de …") e encerre.
