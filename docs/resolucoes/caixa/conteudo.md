# Caixa da sessão "Fábrica — Conteúdo" (flashcards e frases das matérias novas; "Por que eu errei" fracos)

Formato: docs/resolucoes/caixa/LEIA.md. Programa: ferramentas/fabrica/conteudo_api.py; prompts:
ferramentas/fabrica/prompts/conteudo-*.md; saídas: fabrica_saida/conteudo/<lote>/.

## 2026-11-20 00:10 UTC — AVISO — fabrica-conteudo
AVISO PILOTO parte 1 (flashcards e frases das matérias novas): 5 lotes conteudo-flash-<m> gravados (fis, his, geo, ing,
fs), cada um com 60 flashcards e 40 frases em app/conteudo-fonte/materias/<m>.json (campos flash e essencial.completar).
Linha: escritor (Sonnet) -> lente de fatos (Opus) -> lente didática (Opus) -> lente de fatos de novo no que mudou
(Opus); escreve 10% a mais e escolhe pela frequência dos conteúdos no banco de provas. História: a didática tirou 18
frases que repetiam cartões; uma rodada extra escreveu 14 novas (mesmas lentes).
Custo: US$ 3,63 na parte 1 = cerca de US$ 0,007 por item (US$ 0,60 a 0,75 por matéria).
Conferência do Claude Code (agentes com web): 100% das fontes abertas e trocadas por página institucional (OpenStax,
Stanford/IEP, Cambridge, Britannica, Planalto, IBGE, universidades); nenhuma de site didático; checagem automática de
todos os endereços: nenhum inexistente (os que falham são bloqueio de robô ou conexão do contêiner com sites .gov.br).
Amostra de 20% (100 itens): 1 erro (his-k044: faltava "movimento hippie" em aceita), corrigido; 7 correções feitas fora
da amostra ao conferir as fontes. Testes: converte, tsc e vitest verdes (o teste do treino geral, que exigia flash vazio
nas matérias novas, agora exige 60 cartões e 40 frases com fonte aberta e nunca de site didático).
AVISO (fora do meu escopo, é mudança visual): a tela de flashcards (app/src/ui/Cartoes.tsx) mostra frente, verso e
frase como texto cru, sem comFracoes(); fração "a/b" num cartão sai na linha, não empilhada. Os cartões novos evitam
fração; os antigos de Mat têm várias ("1/6", "15/16"). Corrigir pede a permissão do dono (CLAUDE.md, design).

## 2026-11-20 01:00 UTC — AVISO — fabrica-conteudo
AVISO PILOTO parte 2 ("Por que eu errei" fracos): lotes conteudo-erradas-01 a 12 gravados (todo o ENEM: 133 questões
de 9 matérias; e as primeiras 200 das provas-alvo: 100 de Matemática e 100 de Física, lotes 11 e 12).
Linha por questão (print + enunciado + alternativas + gabarito + resolução inteira): escritor (Sonnet) reescreve só as
letras fracas ou devolve "manter" quando nenhum equívoco honesto leva à letra -> lente de fatos (Opus, resolve sozinha
e refaz o raciocínio de cada letra) -> lente didática (Opus) -> lente de fatos de novo no que mudou.
Resultado: 405 questões processadas, 243 com texto novo, 465 letras reescritas e gravadas (merge só em erradas[letra] e
equivocos[letra] de provas/<prova>/resolucoes-<m>.json; gabarito, enunciado e outros campos intocados). Letras sem
origem honesta ficaram com o texto antigo.
Custo: US$ 12,98 = cerca de US$ 0,03 por questão processada (US$ 0,05 por questão com texto novo).
Conferência do Claude Code (agentes, amostra de 20%: 51 questões, 85 letras): 2 com erro (2,4%), consertadas.
Testes: converte, tsc e vitest verdes (839).
Em andamento: lotes 13 a 17 (500 questões das provas-alvo de Matemática).

## 2026-11-20 — FIM — fabrica-conteudo
Último lote gravado: conteudo-erradas-17. Nenhum lote aberto. Sessão encerrada no limite de contexto combinado.
Parte 1 — cartões criados (60 flashcards + 40 frases cada, em app/conteudo-fonte/materias/<m>.json): Física, História,
Geografia, Inglês, Filosofia e Sociologia = 300 flashcards e 200 frases. Gasto US$ 3,63.
Parte 2 — "Por que eu errei" reescrito (questões com texto novo / letras): Matemática 415, Física 87, Português 20,
Química 13, Geografia 6, Biologia 6, Inglês 1, História 1, Filosofia e Sociologia 1 = 550 questões, 939 letras, em 905
questões processadas (ENEM inteiro, 100 provas-alvo de Física e 600 provas-alvo de Matemática). As letras sem equívoco
honesto que leve a elas ficaram com o texto antigo (a questão conta como processada e sai da fila). Gasto US$ 29,63
(~US$ 0,03 por questão processada).
Conferência por amostra (20%, agentes): parte 2 = 181 letras, 5 com erro (2,8%), todas consertadas; parte 1 = 1 erro em
100 itens. Testes: converte, tsc e vitest verdes (859).
Gasto total da sessão: US$ 33,26 (teto US$ 40). Fábrica inteira: US$ 160,25 de US$ 200.
Continuar de: `python3 ferramentas/fabrica/conteudo_api.py erradas-fila` (próximos: provas-alvo de Matemática, ~436;
depois provas-alvo de Física, ~825; Química, ~435). Abrir: `BASE_MAX=1 python3 ferramentas/fabrica/conteudo_api.py
erradas-abre 100 mat`; rodar: `erradas-roda <lote>`; amostra: `erradas-amostra <lote>` + agentes com
fabrica_saida/conteudo/CONFERE-ERRADAS.md; `erradas-aplica <lote>`; `erradas-grava <lote>` (git pull antes).
Sobra do teto desta encomenda: US$ 6,74.

## 2026-11-20 — AVISO — erradas (série mq, sem API)
1º lote gravado: conteudo-erradas-mq-01 (Matemática, provas-alvo, 25 questões, 72 letras fracas). Feito por agentes do
Claude Code (escritor → lente de fatos → lente didática → lente de fatos de novo, cada etapa um agente diferente).
Resultado: 21 letras reescritas e gravadas em 14 questões; 49 letras sem equívoco honesto ficaram com o texto antigo;
2 rejeitadas pela lente de fatos (origem inventada). Amostra (outro agente): 3 letras, 1 com erro (texto longo demais,
49 palavras), consertada. Testes: converte, tsc e vitest verdes (912). Gasto de API: zero.
Em andamento: conteudo-erradas-mq-02 (Matemática).

## 2026-11-21 — FIM — erradas (série mq, sem API)
Lotes gravados: conteudo-erradas-mq-01, mq-02 e mq-03 (Matemática, provas-alvo, 75 questões, 204 letras fracas).
Nenhum lote aberto. Sessão encerrada no limite de contexto combinado (40%).
Feito por agentes do Claude Code, cada etapa um agente diferente (escritor, lente de fatos, lente didática, lente de
fatos de novo, amostra); no máximo 3 agentes em paralelo por etapa (regra nova do dono).
Resultado: 57 letras reescritas e gravadas em 39 questões (mq-01: 21; mq-02: 20; mq-03: 16). As demais letras não têm
equívoco honesto que leve a elas e ficaram com o texto antigo; 2 rejeitadas pela lente de fatos (origem inventada).
Amostra (20%): 8 letras, 3 com erro, todos de tamanho (texto acima de ~35 palavras), consertados; nenhum erro de fato.
A partir do mq-03 a lente didática recebe o limite de 40 palavras.
Testes: converte, tsc e vitest verdes (916). Gasto de API: zero.
Continuar de: `ERRADAS_SERIE=mq BASE_MAX=1 python3 ferramentas/fabrica/conteudo_api.py erradas-abre 25 mat` (próximo
lote: conteudo-erradas-mq-04; na fila: Matemática provas-alvo ~370, depois Química provas-alvo ~438), seguindo
docs/resolucoes/PROMPT-ERRADAS-CLAUDE.md.

## 2026-11-21 — AVISO — erradas (série fis, sem API)
1º lote gravado: conteudo-erradas-fis-01 (Física, provas-alvo Unesp, 25 questões, 67 letras fracas). Feito por agentes do
Claude Code (escritor → lente de fatos → lente didática → lente de fatos de novo → amostra, cada etapa um agente diferente).
Resultado: 27 letras reescritas e gravadas em 12 questões (5 arquivos resolucoes-fis.json da Unesp); 40 letras sem
equívoco honesto ficaram com o texto antigo; nenhuma rejeitada. Lente de fatos corrigiu 3 na 1ª passada e 5 na 2ª
(origem trocada por equívoco mais plausível, frase ambígua, campo da Terra esquecido, textos longos).
Amostra (outro agente): 5 letras, 1 com erro (texto longo, 43 palavras), consertada; nenhum erro de fato.
Testes: converte, tsc e vitest verdes (916). Gasto de API: zero.
Em andamento: conteudo-erradas-fis-02 (Física).
