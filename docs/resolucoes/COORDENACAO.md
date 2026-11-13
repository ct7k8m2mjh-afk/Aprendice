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
sessão anterior desta matéria, assuma com `--retomar <lote>`. Trabalhe continuamente, sem parar
esperando aprovação: enquanto a lente confere um lote, já adiante o próximo; só pare para o que não tem volta (CLAUDE.md).
Avise a coordenadora (<id da coordenadora>) com TROCA quando chegar a hora (passo 9 do prompt)."
Ao abrir: extra_allowed_tools = ["Bash","Edit","Write","Read","Glob","Grep","Agent","Skill","WebFetch","WebSearch",
"mcp__claude-code-remote__send_message"] (dono, 13/11: resolvedores não pedem autorização; também em .claude/settings.json).

## Sessões (13/11/2026, 00h30 UTC)
| Matéria | Sessão | Situação |
|---|---|---|
| Matemática | session_01PveEKX177vB2BRfF6zV6S5 | trabalhando (aberta 13/11 00h46; antiga session_01PveEKWYPGjW3SYacWGoS7w mandou TROCA após mat-0049: pode arquivar) |
| Física | session_01PveEKaLLM5an4P4mkWzqv3 | trabalhando |
| Química | session_01PveEKXnC2DKmBd64gp3Zn3 | trabalhando (aberta 13/11 01h14; antiga session_01PveEKXEZ197XmbuWmKkDPw mandou TROCA após qui-0039: pode arquivar) |
| Biologia | session_01PveEKaZX71znbULe85ap8G | trabalhando |
| Português | session_01PveEKaTKHh9kRmYcfPdmUA | trabalhando (aberta 13/11 00h50; antiga session_01PveEKZK2wY3DcaPfgMBKVX mandou TROCA após por-0071: pode arquivar) |
| Inglês | session_01PveEKYvFj3v794d3jbEjQY | matéria concluída, tudo gravado: pode arquivar (dono avisado) |
| Geografia | session_01PveEKYE1nkNeafq9SNBU2b | pausada, tudo gravado (até geo-0038; faltam 1.476): pode arquivar (dono avisado 13/11) |
| Filosofia e Sociologia | session_01PveEKWgecw6NvvouAmBWM2 | matéria concluída (13/11), tudo gravado: pode arquivar (dono avisado) |
| Completar animadas | session_01PveEKXSa4J8B5gRwFfa8Af | pausada, tudo gravado; deixou pendentes P0eaf87df (Unicamp 2025 q72), passo 2 de Pb942e52d, gabaritos P1ba4d126 e P140521…: pode arquivar (dono avisado 13/11) |
| História | session_01PveEKar9UR25QNispiKNT4 | matéria concluída |
Desativadas (não mandar nada): Fable session_01PveEKXU47Vds1gGREvakqY, session_01PveEKazGNg4UZjknkJiLtJ,
session_01PveEKaAcCyTZHYawMeybog; Inglês antiga session_01PveEKYMQYJ9tRsSFLsoey8; Matemática duplicada
session_01PveEKb4hnDGKRb7Gtd9hCr. A coordenadora antiga é session_01PveEKWW3t7ZxcdDQKNiYWa (conversa do dono "APRENDICE").

## Reclassificar (recados das sessões, 13/11)
- Matemática: P7c50dc09 (Física, ondas), Pb3deaa68 (Biologia, níveis tróficos), Pb906bf2a (Geografia); subtema errado:
  Pea59fe40, P632bbc24, P17e6f8b1, Pb9248592, Pc79dc928, P0ca7ab6a. Prints/dados: P19d0e8df (tabela vazia no print),
  Pf5b6a3c2 (caderno pula a D), número divergente P14017141, P4b446079, Pf025255d.
- Português: para Biologia P7b12298d, P73a24ac0; subtema errado Ped65eba5, P3bdc3073, Pbe8025a1, Pfe767de0, P98fee0ad,
  P273c97a5, P5bd2916f, P9889395d, Pd86425b8, P087b8c9f. Dado: P40c29de8 (alternativa E com coluna do poema colada).
  Química: Pa2383034 (UEG 2023-2 q36) alternativa B com "~~emissão~~" tachado na entrada; no print é itálico.
  63 pendentes "obra:" (lotes 61-71). FMABC 2022 q16 (Pd7fbdc3f) com nota_gabarito, esperando o dono.
- Biologia: para Física P3c08d8ee; para Química Pc68c4acb. Dados: P039ae129 (print pega o título "LÍNGUA
  ESTRANGEIRA" e a alternativa E termina com ele); itálico virou ~~riscado~~ no texto_da_prova de Pa582852a, Pd28a6e90,
  P1daa8136, Pff5a68fe, P0bf82481, P2ea30ef7 (nomes científicos).

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
6. Painel "O que falta": só se passou de mais 1.000 resolvidas desde a última atualização (seção abaixo).
7. Nada novo: não fazer nada e não avisar.

## Esperando o dono
- Unifor 2026.2 Medicina q01 (Pb1863457): erro de enunciado (36 cápsulas não chegam a 4 665 mg; gabarito D só ignorando o
  "36"). Recomendação: deixar fora do site.
- Limite semanal da conta em aviso (renova 19/11). Teste de cobertura animada de Matemática voltou ao verde (82,3%, 13/11).
- Fema 2022 q13 (Pc90de958, prova fema-2021): gabarito oficial E contradiz os fatos (III é falsa; II também erra o
  número do avião); coerente seria D. Está fora do site. Recomendação: deixar fora. Alternativa: publicar com E e alerta.
- Teste da fábrica pela API (US$ 20), que não gasta o limite semanal da conta.
- Direitos: letras de música em Geografia (UERJ 2021 q4 "Morro Velho", Pcaf0f0ee; "Lucro", P8e5ccfb5); artigo do Le
  Monde Diplomatique com foto de Sebastião Salgado (P875a6d1a); prints com fotos de imprensa e charges. Sugestão: as
  duas de letra de música só como print.
- Mackenzie 2026/2 q11 (P855bb53e): fora do site (recomendado) ou com A e explicação.
- Checklist de provas para baixar à mão: https://claude.ai/artifact/AfS22NUUP69GNTWsEKV5YC (coleção `provas`;
  campos prova, gabarito, obs). Faltam, entre outras: Famema 2023 (caderno da Prova II v1), FMJ 2020 e 2023.

## Painel "O que falta no Aprendice" (pedido do dono, 13/11)
Artefato: https://claude.ai/artifact/L5VSRBJLyyadbmaWMmNwj4 (tem o link do site no topo). Atualizar SÓ a cada 1.000
questões resolvidas a mais (dono, 13/11). Última atualização: 16.464 feitas → próxima ao passar de 17.464. Para atualizar: mude o item em docs/resolucoes/o-que-falta.json (estado falta/andamento/decidir/feito), rode o converte,
depois `python3 ferramentas/resolucoes/painel_falta.py` e publique docs/resolucoes/o-que-falta.html nesse URL (Artifact,
`url` = o link acima, de outra conversa; read antes).

## Publicação
Última no ar: dpl_F5FyQ927LL92bBa7fihgbaPFWbBJ (commit 3f9191a7, 13/11, a pedido do dono): 16.108 resoluções.
Próxima ao passar de 16.608.
Contagem: `com_resolucao` de https://aprendice.vercel.app/conteudo/relatorio.json (ou do relatório local do converte).

Coordenadora atual: session_01PveEKabuyZnqVN65W5FfEc (desde 12/11, 23h UTC).
