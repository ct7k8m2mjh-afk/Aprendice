# "Por que eu errei" fracos — feito no Claude Code, sem a API (dono, 20/11/2026)

O dono decidiu (20/11, 22h UTC): "ignora API, faça aqui no Claude". A linha de produção é a mesma da fábrica
(`ferramentas/fabrica/conteudo_api.py`, caixa `docs/resolucoes/caixa/conteudo.md`); só a etapa `erradas-roda`, que
chamava a API, é feita por AGENTES do Claude Code com os mesmos três prompts de lente. Nada de chave, nada de gasto no
`gastos.csv`.

Escopo: provas-alvo (`BASE_MAX=1`; o ENEM já foi feito). Fila por matéria: `python3 ferramentas/fabrica/conteudo_api.py
erradas-fila`.

## Por lote (25 questões de uma matéria)
1. `git pull --rebase --autostash origin app-prototipo-completo`; depois
   `ERRADAS_SERIE=<série> BASE_MAX=1 python3 ferramentas/fabrica/conteudo_api.py erradas-abre 25 <m>`.
   Commit e push IMEDIATOS de `fabrica_saida/conteudo/<lote>/entrada.json` (a fila exclui o que já tem entrada no git: é o
   que impede duas sessões de pegarem a mesma questão).
2. Prompts das lentes (já com o especialista da matéria):
   `python3 ferramentas/fabrica/conteudo_api.py erradas-prompt conteudo-erradas-escritor.md <m>` (idem `-fatos.md`,
   `-didatica.md`). Grave cada um em arquivo do lote e mande o agente LER o arquivo.
3. Escritor (agentes, ~5 questões cada): para cada questão da `entrada.json`, abre o print (Read na imagem), lê dados e
   `resolucao_atual`, e para cada letra de `fracas` devolve `{letra, acao: reescrever|manter, texto, equivoco}`.
4. Lente de fatos (agentes DIFERENTES, às cegas quanto ao escritor): resolve a questão sozinha pelo print, confirma o
   gabarito oficial e refaz o raciocínio de cada texto novo (conta em python). Veredito por letra: ok | corrigir
   (com `depois`) | rejeitar.
5. Lente didática (outros agentes): ok | melhorar (com `depois`) | alerta_fato.
6. Lente de fatos de novo (outro agente) só no que a didática mudou ou alertou. Sem veredito ok = fica de fora.
7. Monte `fabrica_saida/conteudo/<lote>/final.json`: `{"<id>": {"<letra>": {"texto", "equivoco", "antes"}}}`, onde
   `antes` = o texto ATUAL de `resolucao_atual.erradas[<letra>]`, copiado exatamente. Fora: rejeitados, "manter", e
   texto que ainda soe fraco ("não confere", "não bate", "não fecha", "daria", "dá X"). Guarde em `todos.json` o
   diário de cada letra (escritor, vereditos, motivos).
8. Conferência por amostra (20%, outro agente, que não escreveu nem fez lente):
   `erradas-amostra <lote>` → agente com `fabrica_saida/conteudo/CONFERE-ERRADAS.md` → `erradas-aplica <lote>`.
9. `git pull --rebase` e `erradas-grava <lote>` (merge só em erradas[letra] e equivocos[letra]; não toca em letra
   cujo texto mudou desde a abertura). Depois `cd app && flock /tmp/converte.lock python3 scripts/converte.py && npx tsc
   --noEmit -p . && npx vitest run` verde; commit só dos arquivos do lote e dos `resolucoes-<m>.json` tocados, com a
   palavra "erradas"; até 4 tentativas de push. Em conflito em `erradas-feitas.json`, junte as duas versões (união);
   em `resolucoes-*.json`, junte sem perder nada de ninguém.

Regras: não mudar gabarito, enunciado, resposta nem outros campos; fração "a/b" no texto (o site empilha); sem emoji;
nenhum site didático como fonte. Caixa: AVISO depois do 1º lote, FIM no fim ("continuar de …").
