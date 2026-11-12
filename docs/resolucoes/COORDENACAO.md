# Coordenação das sessões de resolução

Arquivo de passagem entre sessões coordenadoras (decisão do dono, 12/11/2026: trocar a coordenação por uma sessão nova
para gastar menos do limite semanal). Leia inteiro antes de agir. Atualize no fim de cada rodada o que mudou.

## Papel
A coordenadora só organiza: questões no site, classificação, prints, gabaritos, publicação e o andamento das sessões.
NUNCA resolve questão. Fala com o dono em português do Brasil, direto, sem termos técnicos (CLAUDE.md).

## Regras de economia (dono, 12/11/2026)
- No máximo 5 sessões de resolução trabalhando ao mesmo tempo. Agora: Matemática, Física, Química, Biologia e Português.
- Pausadas (retomar só quando uma das 5 acabar a matéria ou o dono pedir): Inglês, Geografia, Filosofia e Sociologia,
  "Completar resoluções animadas" (ferramentas/resolucoes/completa.py). História acabou.
- Cada sessão de resolução troca por uma nova depois de 10 lotes (ou contexto acima de 40%): ela avisa com a palavra
  TROCA; a coordenadora abre uma sessão nova da mesma matéria (Opus, ambiente env_01PD36og67UPYvCWa3DcbQpX, repositório
  https://github.com/ct7k8m2mjh-afk/aprendice, ramo app-prototipo-completo, permission_mode acceptEdits, tag
  aprendice-resolucoes) com o prompt-padrão abaixo, e atualiza a tabela de sessões aqui.
- A própria coordenadora também é trocada quando a conversa passar de 40%: escreva o estado aqui e peça ao dono.
- Conferência agendada a cada 3 horas (não de hora em hora).

## Prompt-padrão de uma sessão de matéria
"Você é a sessão de resoluções de <MATÉRIA> do Aprendice. Leia CLAUDE.md e siga integralmente
docs/resolucoes/PROMPT-SESSAO-RESOLUCOES.md, com a sua matéria = <m>. Fale português do Brasil. Comece com
`cd app && flock /tmp/converte.lock python3 scripts/converte.py`, volte à raiz e siga a esteira
(`python3 ferramentas/resolucoes/lote.py proximo <m> --novo`, até 3 lotes abertos seus). Se houver lote aberto de uma
sessão anterior desta matéria, assuma com `--retomar <lote>`. Avise a coordenadora (<id da coordenadora>) com TROCA
quando chegar a hora (passo 9 do prompt)."

## Sessões (12/11/2026, 22h20 UTC)
| Matéria | Sessão | Situação |
|---|---|---|
| Matemática | session_01PveEKWYPGjW3SYacWGoS7w | trabalhando; conversa em 62%: trocar já |
| Física | session_01PveEKaLLM5an4P4mkWzqv3 | trabalhando |
| Química | session_01PveEKXEZ197XmbuWmKkDPw | trabalhando |
| Biologia | session_01PveEKaZX71znbULe85ap8G | trabalhando |
| Português | session_01PveEKZK2wY3DcaPfgMBKVX | trabalhando; conversa em 62%: trocar já |
| Inglês | session_01PveEKYvFj3v794d3jbEjQY | parada, tudo gravado (sem lote aberto): pode arquivar (dono avisado 12/11) |
| Geografia | session_01PveEKYE1nkNeafq9SNBU2b | terminando geo-0033 e para; avisar o dono para arquivar quando gravar |
| Filosofia e Sociologia | session_01PveEKWgecw6NvvouAmBWM2 | trabalhando até acabar a matéria (dono aprovou; pode passar de 5 por pouco tempo) |
| Completar animadas | session_01PveEKXSa4J8B5gRwFfa8Af | terminando o último lote e para; avisar o dono para arquivar quando gravar |
| História | session_01PveEKar9UR25QNispiKNT4 | matéria concluída |
Desativadas (não mandar nada): Fable session_01PveEKXU47Vds1gGREvakqY, session_01PveEKazGNg4UZjknkJiLtJ,
session_01PveEKaAcCyTZHYawMeybog; Inglês antiga session_01PveEKYMQYJ9tRsSFLsoey8; Matemática duplicada
session_01PveEKb4hnDGKRb7Gtd9hCr. A coordenadora antiga é session_01PveEKWW3t7ZxcdDQKNiYWa (conversa do dono "APRENDICE").

## Rodada da conferência (a cada 3 horas)
1. `git pull --rebase --autostash origin app-prototipo-completo`.
2. Para cada sessão trabalhando: get_session. Parada com matéria ainda por fazer → send_message (priority later):
   "Continue: próximo lote da sua matéria, sem encerrar a vez entre lotes, até o dono mandar parar." Falha por limite
   ou créditos → anotar em docs/resolucoes/conferencia.md e avisar o dono uma vez. Pedido de aprovação sem resposta →
   avisar o dono uma vez. Pediu TROCA → abrir a sessão nova (acima).
3. Prints: questões pendentes por print (docs/resolucoes/lotes-<m>.md) que não estejam em docs/provas/prints-refeitos.md
   → `python3 ferramentas/ingestao/refaz_print.py <prova> <n> ... --previa`, conferir a imagem, gravar, commit, avisar a
   sessão da matéria.
4. `cd app && flock /tmp/converte.lock python3 scripts/converte.py && npx tsc --noEmit -p . && npx vitest run`.
5. Publicação a cada 500 resoluções novas (compare com `ultima.resolvidas` de docs/resolucoes/publicacao.json), tudo
   verde: create_deployment produção (time team_ktkWAyK9Cc0bRLSR5qu5GW5b, projeto prj_hVOH7ZV6islXYIUgzmgiJqxvNspM,
   gitSource github ct7k8m2mjh-afk/Aprendice ref app-prototipo-completo sha=HEAD, projectSettings vite, rootDirectory
   app, installCommand "npm ci", buildCommand "python3 -m pip install -q --break-system-packages pillow numpy scipy &&
   python3 scripts/converte.py && npx vite build", outputDirectory dist, nodeVersion 22.x,
   sourceFilesOutsideRootDirectory true). As prévias automáticas da Vercel estão desligadas (12/11). Quando o site
   servir a contagem nova: atualizar publicacao.json, commit, push, avisar o dono em 2 linhas por matéria.
6. Nada novo: não fazer nada e não avisar.

## Esperando o dono
- Fema 2022 q13 (Pc90de958, prova fema-2021): gabarito oficial E contradiz os fatos (III é falsa; II também erra o
  número do avião); coerente seria D. Está fora do site. Recomendação: deixar fora. Alternativa: publicar com E e alerta.
- Teste da fábrica pela API (US$ 20), que não gasta o limite semanal da conta.
- Direitos: letras de música em Geografia (UERJ 2021 q4 "Morro Velho", Pcaf0f0ee; "Lucro", P8e5ccfb5); artigo do Le
  Monde Diplomatique com foto de Sebastião Salgado (P875a6d1a); prints com fotos de imprensa e charges. Sugestão: as
  duas de letra de música só como print.
- Mackenzie 2026/2 q11 (P855bb53e): fora do site (recomendado) ou com A e explicação.
- Checklist de provas para baixar à mão: https://claude.ai/artifact/AfS22NUUP69GNTWsEKV5YC (coleção `provas`;
  campos prova, gabarito, obs). Faltam, entre outras: Famema 2023 (caderno da Prova II v1), FMJ 2020 e 2023.

## Publicação
Última no ar: dpl_9RjZ5JUkUHkb2TFUNRpHKQre4mJP (commit cdc5959a, São Camilo completa), READY e conferida em
12/11: 13.522 resoluções no site (detalhe em docs/resolucoes/publicacao.json). Próxima ao passar de 14.022.
Contagem: `com_resolucao` de https://aprendice.vercel.app/conteudo/relatorio.json (ou do relatório local do converte).

Coordenadora atual: session_01PveEKabuyZnqVN65W5FfEc (desde 12/11, 23h UTC).
