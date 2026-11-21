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

## 2026-11-21 — FIM — erradas (série fis, sem API)
Lotes gravados: conteudo-erradas-fis-01, fis-02 e fis-03 (Física, provas-alvo, 75 questões, 211 letras fracas).
Nenhum lote aberto. Sessão encerrada no limite de contexto combinado (40%).
Feito por agentes do Claude Code, cada etapa um agente diferente (escritor, lente de fatos, lente didática, lente de
fatos de novo, amostra); no máximo 3 agentes em paralelo por etapa desde o fis-03 (regra nova do dono).
Resultado: 66 letras reescritas e gravadas em 34 questões (fis-01: 27 em 12, Unesp; fis-02: 23 em 11, Unesp, ENEM,
Fuvest, UERJ; fis-03: 16 em 11, UERJ). As demais letras não têm equívoco honesto que leve a elas e ficaram com o texto
antigo; nenhuma rejeitada. Lentes de fatos corrigiram 12 textos (origem trocada por equívoco plausível, frase ambígua,
"esquece os 800 g" que não leva à letra, campo da Terra esquecido, textos longos).
Amostra (20%): 10 letras, 2 com erro (1 texto longo; 1 sem dizer de onde vinha o 7 s), consertados; nenhum erro de fato.
Testes: converte e tsc verdes; vitest 915 de 916 no fis-03 — a falha é contaNuvem.test.ts (mensagem de login
"Confirme…" mudada em outra frente, sem relação com resoluções); fis-01 e fis-02 com 916 verdes. Gasto de API: zero.
Continuar de: `ERRADAS_SERIE=fis BASE_MAX=1 python3 ferramentas/fabrica/conteudo_api.py erradas-abre 25 fis` (próximo
lote: conteudo-erradas-fis-04; fila de Física provas-alvo pela `erradas-fila`), seguindo
docs/resolucoes/PROMPT-ERRADAS-CLAUDE.md.

## 2026-11-21 — FIM — erradas (série fis, sem API, 2ª sessão)
Lotes gravados nesta sessão: conteudo-erradas-fis-04 e fis-05 (Física, provas-alvo UERJ, UFPR e UEL, 50 questões,
119 letras fracas). Nenhum lote aberto. Sessão encerrada no limite de contexto combinado (40%).
Feito por agentes do Claude Code, cada etapa um agente diferente (escritor, lente de fatos, lente didática, lente de
fatos de novo, amostra); no máximo 3 agentes em paralelo por etapa.
Resultado: 49 letras reescritas e gravadas em 32 questões (fis-04: 14 em 11, UERJ 2021 e UFPR 2024–2026; fis-05: 35 em
21, UFPR 2020–2023 e UEL 2024/2026). As demais letras não têm equívoco honesto que leve a elas e ficaram com o texto
antigo; nenhuma rejeitada. Lente de fatos corrigiu 2 (trabalho do peso não depende do atrito; trovão não é onda
"esférica"); lente didática melhorou 17 (todas reconferidas, ok). Um texto barrado pelo filtro só por "dá 12,5 m" teve
a redação trocada para "chegando a 12,5 m" e entrou na amostra.
Amostra (20%): fis-04 2 letras, 1 com erro (tamanho, 41 palavras), consertada; fis-05 7 letras, nenhum erro.
Aviso: UFPR 2022 q25 (P34628cf3) — a camada de texto perdeu o µ (o print mostra 1,6 µC).
Testes: converte e tsc verdes; vitest 922 de 922 nos dois lotes. Gasto de API: zero.
Continuar de: `ERRADAS_SERIE=fis BASE_MAX=1 python3 ferramentas/fabrica/conteudo_api.py erradas-abre 25 fis` (próximo
lote: conteudo-erradas-fis-06; fila de Física provas-alvo pela `erradas-fila`), seguindo
docs/resolucoes/PROMPT-ERRADAS-CLAUDE.md.

## 2026-11-21 — FIM — erradas (série mq, sem API, 2ª sessão)
Lotes gravados: conteudo-erradas-mq-04, mq-05 e mq-06 (Matemática, provas-alvo, 75 questões, 176 letras fracas).
Nenhum lote aberto. Sessão encerrada no limite de contexto combinado (40%).
Feito por agentes do Claude Code, cada etapa um agente diferente (escritor, lente de fatos, lente didática, lente de
fatos de novo, amostra); no máximo 3 agentes em paralelo.
Resultado: 56 letras reescritas e gravadas em 37 questões (mq-04: 25 em 12; mq-05: 12 em 10; mq-06: 19 em 15). As demais
letras não têm equívoco honesto que leve a elas e ficaram com o texto antigo; 1 rejeitada pela lente de fatos (mq-05).
Amostra (20%): 9 letras, 1 com erro (mq-06, Pded737a1 C: fração escrita na linha "c · h ÷ H"), consertada; nenhum erro
de fato. Testes: converte, tsc e vitest verdes (922). Gasto de API: zero.
Nota: o escritor da parte 1 do mq-04 travou (pedido com número da parte faltando) e foi refeito por um agente novo.
Continuar de: `ERRADAS_SERIE=mq BASE_MAX=1 python3 ferramentas/fabrica/conteudo_api.py erradas-abre 25 mat` (próximo
lote: conteudo-erradas-mq-07; na fila: Matemática provas-alvo ~300, depois Química provas-alvo ~438), seguindo
docs/resolucoes/PROMPT-ERRADAS-CLAUDE.md.

## 2026-11-21 — AVISO — erradas (série fis, sem API, 3ª sessão)
Lote conteudo-erradas-fis-06 gravado (Física, provas-alvo UEL 2020–2024 e UFU 2023–2026, 25 questões, 66 letras
fracas): 48 letras reescritas em 18 questões; 18 mantidas (sem equívoco honesto que leve a elas); nenhuma rejeitada.
Lente de fatos corrigiu 5 (lei zero x 2ª lei; 4 só por "não confere"/"dá X"); didática melhorou 15, todas reconferidas
ok. Amostra: 11 letras, 0 erro. Testes: converte, tsc e vitest 922/922 verdes. Gasto de API: zero.
Nota da lente: UEL (Pd64fa892, tubo de Pitot) — gabarito oficial E (Pascal) é discutível (Pitot usa Bernoulli); vale o oficial.

## 2026-11-21 — FIM — erradas (série fis, sem API, 3ª sessão)
Lotes gravados nesta sessão: conteudo-erradas-fis-06 e fis-07 (Física, provas-alvo UEL 2020–2024, UFU 2020–2026 e
Famerp 2025–2026, 50 questões, 127 letras fracas). Nenhum lote aberto. Sessão encerrada perto do limite de contexto
combinado (40%).
Feito por agentes do Claude Code, cada etapa um agente diferente (escritor, lente de fatos, lente didática, lente de
fatos de novo, amostra); no máximo 3 agentes em paralelo por etapa.
Resultado: 91 letras reescritas e gravadas em 38 questões (fis-06: 48 em 18; fis-07: 43 em 20). As demais 36 letras não
têm equívoco honesto que leve a elas e ficaram com o texto antigo; nenhuma rejeitada. Lente de fatos corrigiu 8 (lei
zero x 2ª lei; luz chamada de onda mecânica; reação da normal no contato pneu–solo; "soma das densidades" x soma das
variações; 4 só por "não confere"/"dá X"); didática melhorou 24, todas reconferidas.
Amostra (20%): fis-06 11 letras, 0 erro; fis-07 9 letras, 1 erro (Famerp 2026 q68, letra D: equívoco descrito não
levava à D), consertado.
Testes: converte, tsc e vitest 922/922 verdes nos dois lotes. Gasto de API: zero.
Continuar de: `ERRADAS_SERIE=fis BASE_MAX=1 python3 ferramentas/fabrica/conteudo_api.py erradas-abre 25 fis` (próximo
lote: conteudo-erradas-fis-08; fila de Física provas-alvo pela `erradas-fila`), seguindo
docs/resolucoes/PROMPT-ERRADAS-CLAUDE.md.

## 2026-11-21 — AVISO — erradas (série mq, sem API, 3ª sessão)
Lote conteudo-erradas-mq-07 gravado (Matemática, provas-alvo UECE, 25 questões, 63 letras fracas): 13 letras reescritas
em 9 questões; 50 mantidas (sem equívoco honesto que leve a elas); nenhuma rejeitada. Lente de fatos corrigiu 1
("seno e cosseno só são iguais em 45° e 225°" sem "numa volta"); didática melhorou 9, todas reconferidas ok (uma trocava
"a/b" por "÷"; o organizador voltou para "a/b"). Amostra: 4 letras, 0 erro. Testes: converte, tsc e vitest 922/922
verdes. Gasto de API: zero.
Nota: o 1º escritor da parte 1 marcou tudo "manter" sem abrir os prints; foi descartado e refeito por um agente novo.

## 2026-11-21 — AVISO — erradas (série fis, sem API, 4ª sessão)
Lote conteudo-erradas-fis-08 gravado (Física, provas-alvo Famerp 2022–2025, 25 questões, 82 letras fracas): 52 letras
reescritas em 18 questões; 30 mantidas (sem equívoco honesto que leve a elas); nenhuma rejeitada. Lente de fatos
corrigiu 2; didática melhorou 6, todas reconferidas ok. Amostra: 11 letras, 0 erro. Testes: converte, tsc e vitest
922/922 verdes. Gasto de API: zero.

## 2026-11-21 — FIM — erradas (série mq, sem API, 3ª sessão)
Lotes gravados nesta sessão: conteudo-erradas-mq-07 e mq-08 (Matemática, provas-alvo UECE, 50 questões, 123 letras
fracas). Nenhum lote aberto. Sessão encerrada perto do limite de contexto combinado (40%).
Feito por agentes do Claude Code, cada etapa um agente diferente (escritor, lente de fatos, lente didática, lente de
fatos de novo, amostra); no máximo 3 agentes em paralelo por etapa.
Resultado: 27 letras reescritas e gravadas em 19 questões (mq-07: 13 em 9; mq-08: 14 em 10). As demais 96 letras não
têm equívoco honesto que leve a elas e ficaram com o texto antigo; nenhuma rejeitada. Lente de fatos corrigiu 1 (mq-07);
didática melhorou 16, todas reconferidas ok. Amostra (20%): mq-07 4 letras, 0 erro; mq-08 5 letras, 0 erro.
Testes: converte, tsc e vitest 922/922 verdes nos dois lotes. Gasto de API: zero.
Continuar de: `ERRADAS_SERIE=mq BASE_MAX=1 python3 ferramentas/fabrica/conteudo_api.py erradas-abre 25 mat` (próximo
lote: conteudo-erradas-mq-09; na fila: Matemática provas-alvo, depois Química provas-alvo), seguindo
docs/resolucoes/PROMPT-ERRADAS-CLAUDE.md.

## 2026-11-21 — FIM — erradas (série fis, sem API, 4ª sessão)
Lotes gravados nesta sessão: conteudo-erradas-fis-08 e fis-09 (Física, provas-alvo Famerp 2020–2025 e Santa Casa
2026–2027, 50 questões, 158 letras fracas). Nenhum lote aberto. Sessão encerrada perto do limite de contexto combinado
(40%).
Feito por agentes do Claude Code, cada etapa um agente diferente (escritor, lente de fatos, lente didática, lente de
fatos de novo, amostra); no máximo 3 agentes em paralelo por etapa.
Resultado: 88 letras reescritas e gravadas em 33 questões (fis-08: 52 em 18; fis-09: 36 em 15). As demais 70 letras não
têm equívoco honesto que leve a elas e ficaram com o texto antigo; nenhuma rejeitada. Lente de fatos corrigiu 3 (1 na
2ª passagem: "tamanho das cristas" ambíguo trocado por altura/amplitude); didática melhorou 11, todas reconferidas.
Um texto barrado pelo filtro só por "o enunciado dá 4,0 kΩ" teve a palavra trocada por "informa" e foi conferido pela
amostra (ok).
Amostra (20%): fis-08 11 letras, 0 erro; fis-09 10 letras, 1 erro (Santa Casa, Pd218d854 D: origem não levava à D —
"objeto entre o espelho e o foco"), consertado.
Testes: converte, tsc e vitest 922/922 verdes nos dois lotes. Gasto de API: zero.
Continuar de: `ERRADAS_SERIE=fis BASE_MAX=1 python3 ferramentas/fabrica/conteudo_api.py erradas-abre 25 fis` (próximo
lote: conteudo-erradas-fis-10; fila de Física provas-alvo pela `erradas-fila`), seguindo
docs/resolucoes/PROMPT-ERRADAS-CLAUDE.md.

## 2026-11-21 — AVISO — erradas (série fis, sem API, 5ª sessão)
Lote conteudo-erradas-fis-10 gravado (Física, provas-alvo Santa Casa 2022–2026, 25 questões, 76 letras fracas): 35 letras
reescritas em 18 questões; 41 mantidas (sem equívoco honesto que leve a elas); nenhuma rejeitada. Lente de fatos: 35 ok;
didática melhorou 9, reconferidas (8 ok, 1 corrigida). Amostra: 11 letras, 2 só acima de ~35 palavras, encurtadas.
Testes: converte, tsc e vitest 922/922 verdes. Gasto de API: zero.

## 2026-11-21 — FIM — erradas (série mq, sem API, 4ª sessão)
Lotes gravados nesta sessão: conteudo-erradas-mq-09 (UECE 2020.2 2ª fase e UEA 2027) e mq-10 (UEA 2026, UEA 2027
Exatas e UEA SIS 3 2027) — Matemática, provas-alvo, 50 questões, 137 letras fracas. Nenhum lote aberto. Sessão
encerrada perto do limite de contexto combinado (40%).
Feito por agentes do Claude Code, cada etapa um agente diferente (escritor, lente de fatos, lente didática, lente de
fatos de novo, amostra); no máximo 3 agentes em paralelo por etapa.
Resultado: 29 letras reescritas e gravadas em 20 questões (mq-09: 16 em 10; mq-10: 13 em 10). As demais 108 letras não
têm equívoco honesto que leve a elas e ficaram com o texto antigo; nenhuma rejeitada. Lente de fatos corrigiu 2 (mq-09
Pe629d1ff A: faltava a raiz x = 1; mq-10 P406fcc32 C: origem do 58 = 50 + 8); didática melhorou 18 (potência e log
em notação certa, textos mais curtos), todas reconferidas ok na 2ª passagem. Amostra (20%): mq-09 4 letras, 0 erro;
mq-10 2 letras, 0 erro.
Testes: converte, tsc e vitest 922/922 verdes nos dois lotes. Gasto de API: zero.
Continuar de: `ERRADAS_SERIE=mq BASE_MAX=1 python3 ferramentas/fabrica/conteudo_api.py erradas-abre 25 mat` (próximo
lote: conteudo-erradas-mq-11; na fila: 196 de Matemática provas-alvo, depois Química provas-alvo), seguindo

## 2026-11-21 — FIM — erradas (série fis, sem API, 5ª sessão)
Lotes gravados nesta sessão: conteudo-erradas-fis-10 e fis-11 (Física, provas-alvo Santa Casa 2020–2026 e Einstein
2024–2026, 50 questões, 147 letras fracas). Nenhum lote aberto. Sessão encerrada perto do limite de contexto combinado
(40%); no meio do fis-11 a conta bateu o limite de 5 horas (09h08 UTC) e o trabalho foi retomado após a renovação.
Feito por agentes do Claude Code, cada etapa um agente diferente (escritor, lente de fatos, lente didática, lente de
fatos de novo, amostra); no máximo 3 agentes em paralelo por etapa.
Resultado: 77 letras reescritas e gravadas em 38 questões (fis-10: 35 em 18; fis-11: 42 em 20). As demais 70 letras não
têm equívoco honesto que leve a elas e ficaram com o texto antigo; nenhuma rejeitada. Lente de fatos corrigiu 2 no fis-11
(1ª passagem); 2ª passagem corrigiu 1 no fis-10 e 7 no fis-11 (6 só encurtadas para até 35 palavras; 1 fato: no esquema
da Santa Casa P3eb66148 A, I1 e I2 estão em fios diferentes, não "no mesmo fio"). Didática melhorou 9 + 14.
Atenção de processo: o escritor da p02 do fis-11 regravou os textos depois que a entrada da lente foi gerada; a lente foi
parada e refeita sobre a versão final. Conferido também o fis-10: 2 letras com diferença, ambas cobertas (uma só trocou
"dá" por "fica"; a outra foi reescrita pela didática e reconferida pela 2ª lente). Gerar entrada de lente só depois do
aviso de término do escritor.
Amostra (20%): fis-10 11 letras, 2 só acima de ~35 palavras (encurtadas); fis-11 7 letras, 0 erro.
Testes: converte, tsc e vitest 922/922 verdes nos dois lotes. Gasto de API: zero.
Continuar de: `ERRADAS_SERIE=fis BASE_MAX=1 python3 ferramentas/fabrica/conteudo_api.py erradas-abre 25 fis` (próximo
lote: conteudo-erradas-fis-12; fila de Física provas-alvo pela `erradas-fila`), seguindo
docs/resolucoes/PROMPT-ERRADAS-CLAUDE.md.

## 2026-11-21 — AVISO — erradas (série mq, sem API, 5ª sessão)
Lote conteudo-erradas-mq-11 gravado (Matemática, provas-alvo UEA, 25 questões, 75 letras fracas): 18 letras reescritas em
14 questões; 57 mantidas (sem equívoco honesto que leve a elas); nenhuma rejeitada. Lente de fatos: 18 ok; didática
melhorou 9, todas reconferidas ok na 2ª passagem. Amostra: 3 letras, 0 erro. Testes: converte, tsc e vitest 922/922
verdes. Gasto de API: zero. Em andamento: conteudo-erradas-mq-12.

## 2026-11-21 — FIM — erradas (série fis, sem API, 6ª sessão)
Lotes gravados nesta sessão: conteudo-erradas-fis-12 e fis-13 (Física, provas-alvo, 50 questões, 149 letras fracas).
Nenhum lote aberto. Sessão encerrada perto do limite de contexto combinado (40%).
Feito por agentes do Claude Code, cada etapa um agente diferente (escritor, lente de fatos, lente didática, lente de
fatos de novo, amostra); no máximo 3 agentes em paralelo por etapa. Entradas de cada lente geradas só depois do aviso
de término da etapa anterior.
Resultado: 41 letras reescritas e gravadas em 21 questões (fis-12: 30 em 13; fis-13: 11 em 8). As demais 108 letras não
têm equívoco honesto que leve a elas e ficaram com o texto antigo; nenhuma rejeitada. Lente de fatos corrigiu 2 no
fis-12 e 1 no fis-13 (notação M²); didática melhorou 9 + 7; 2ª passagem corrigiu 1 no fis-12 (Pd9c57f27 E: "chega ao
fundo 2,5 m à frente") e 3 no fis-13 (só encurtadas para até 35 palavras).
Amostra (20%): fis-12 5 letras, 1 erro consertado (P2b6fd58e E: a origem real é parar no coeficiente aparente 2γV e não
dividir por 2); fis-13 2 letras, 0 erro.
Testes: converte, tsc e vitest 922/922 verdes nos dois lotes. Gasto de API: zero. Em erradas-feitas.json houve conflito
com a série mq; resolvido por união (nenhuma entrada perdida).
Continuar de: `ERRADAS_SERIE=fis BASE_MAX=1 python3 ferramentas/fabrica/conteudo_api.py erradas-abre 25 fis` (próximo
lote: conteudo-erradas-fis-14; na fila: 506 de Física provas-alvo), seguindo docs/resolucoes/PROMPT-ERRADAS-CLAUDE.md.

## 2026-11-21 — FIM — erradas (série mq, sem API, 5ª sessão)
Lotes gravados nesta sessão: conteudo-erradas-mq-11, mq-12 e mq-13 (Matemática, provas-alvo UEA 2020–2027 e UDESC
2026.1, 75 questões, 220 letras fracas). Nenhum lote aberto. Sessão encerrada perto do limite de contexto combinado (40%).
Feito por agentes do Claude Code, cada etapa um agente diferente (escritor, lente de fatos, lente didática, lente de
fatos de novo, amostra); no máximo 3 agentes em paralelo por etapa.
Resultado: 56 letras reescritas e gravadas em 42 questões (mq-11: 18 em 14; mq-12: 22 em 14; mq-13: 16 em 13). As
demais 163 letras não têm equívoco honesto que leve a elas e ficaram com o texto antigo; nenhuma rejeitada. Lente de
fatos corrigiu 2 na 1ª passagem (mq-12 Pf82e747e D: o empréstimo foi quitado de uma vez, sem "parcela mensal"; mq-13
P80292b83 A: origem do 92 = 86 + 5 + 1) e 1 na 2ª (mq-12 Pf82e747e D: o empréstimo é que vale 2.500). Didática melhorou
9 + 9 + 8, todas reconferidas. Fora por filtro de texto fraco: mq-13 P6c6ce9da E (fecha em "dá 3"); no mq-12, "dá a
Marcos o mesmo bônus" é o verbo dar, não resultado, e entrou.
Amostra (20%): mq-11 3 letras, mq-12 5, mq-13 5; 0 erro.
Conflito em erradas-feitas.json com a série fis (mq-12): resolvido por união, sem perder nada.
Testes: converte, tsc e vitest 922/922 verdes nos três lotes. Gasto de API: zero.
Continuar de: `ERRADAS_SERIE=mq BASE_MAX=1 python3 ferramentas/fabrica/conteudo_api.py erradas-abre 25 mat` (próximo
lote: conteudo-erradas-mq-14; na fila: 121 de Matemática provas-alvo, depois Química provas-alvo), seguindo
docs/resolucoes/PROMPT-ERRADAS-CLAUDE.md.

## 2026-11-21 — AVISO — erradas (série fis, sem API, 7ª sessão)
Lote conteudo-erradas-fis-14 gravado (Física, provas-alvo, 25 questões, 69 letras fracas): 15 letras reescritas em 8
questões; 54 mantidas (sem equívoco honesto que leve a elas); nenhuma rejeitada. Lente de fatos: 13 ok, 2 corrigidas;
didática melhorou 5; 2ª passagem corrigiu 2 (Pe95e05cc A; Pdb7908b8 B). Duas letras só trocaram
"dá" por sinônimo (Pe76fb676 B, Paecdb161 D), conferidas junto com a amostra. Amostra: 3 letras, 0 erro. Testes:
converte, tsc e vitest 922/922 verdes. Gasto de API: zero. Em andamento: conteudo-erradas-fis-15.

## 2026-11-21 — FIM — erradas (série fis, sem API, 7ª sessão)
Lotes gravados nesta sessão: conteudo-erradas-fis-14, fis-15 e fis-16 (Física, provas-alvo, 75 questões, 215 letras
fracas). Nenhum lote aberto. Sessão encerrada perto do limite de contexto combinado (40%).
Feito por agentes do Claude Code, cada etapa um agente diferente (escritor, lente de fatos, lente didática, lente de
fatos de novo, amostra); no máximo 3 agentes em paralelo por etapa.
Resultado: 71 letras reescritas e gravadas em 40 questões (fis-14: 15 em 8; fis-15: 29 em 15; fis-16: 27 em 17). As
demais 144 letras não têm equívoco honesto que leve a elas e ficaram com o texto antigo; nenhuma rejeitada.
fis-15: lente de fatos corrigiu 5 (1 de fato: P97dde726 E, farol não concentra luz; 4 só encurtadas); didática melhorou
11; 2ª passagem corrigiu 8 (3 de fato na FMABC 2022 q56 C e q59 C/E; demais só tamanho). Amostra: 4 letras, 0 erro.
fis-16: lente de fatos corrigiu 6 (Pc67ee8e1 B: descida entre níveis excitados também emite fóton); didática melhorou
12 (símbolos trocados por palavras); 2ª passagem corrigiu 2 (só tamanho/≈). Amostra: 3 letras, 1 consertada
(P2a28cd0d B, só tamanho).
Para o dono/banca: na P7f372339 (FMABC, Física) o texto_da_prova traz "2v" nas alternativas A, D e E, mas o print diz
"v/2"; os textos novos seguem o print; a transcrição do enunciado precisa de conserto (não mexido aqui).
Processo: um `git pull --rebase --autostash` ficou preso (rebase sem head-name) após reinício do worker; resolvido com
`git rebase --quit`, guardando o autostash no stash e reaplicando — nada perdido.
Testes: converte, tsc e vitest 922/922 verdes (fis-14; fis-15 e fis-16 juntos). Gasto de API: zero.
Continuar de: `ERRADAS_SERIE=fis BASE_MAX=1 python3 ferramentas/fabrica/conteudo_api.py erradas-abre 25 fis` (próximo
lote: conteudo-erradas-fis-17), seguindo docs/resolucoes/PROMPT-ERRADAS-CLAUDE.md.
## 2026-11-21 — AVISO — erradas (série mq, sem API, 6ª sessão)
Lote conteudo-erradas-mq-14 gravado (Matemática, provas-alvo UDESC 2025.1–2026.2, 25 questões, 60 letras fracas): 18
letras reescritas em 11 questões; 40 mantidas (sem equívoco honesto que leve a elas); nenhuma rejeitada. Lente de fatos:
19 ok, 1 corrigida (P169b8d2e B: linha nula não é o único jeito de zerar o determinante; a questão pede det M²); didática
melhorou 8; 2ª passagem corrigiu 1 (P18859593 C: a parábola não tem raízes reais). Fora por filtro: P18859593 C (43
palavras) e P3a847a9c A ("dá 8"). Amostra: 2 letras, 1 consertada (Pc22ec9ed E: função h(t), não A(t)). Testes:
converte, tsc e vitest 922/922 verdes. Gasto de API: zero. Em andamento: conteudo-erradas-mq-15.

## 2026-11-21 — FIM — erradas (série mq, sem API, 6ª sessão)
Lotes gravados nesta sessão: conteudo-erradas-mq-14 e mq-15 (Matemática, provas-alvo UDESC 2023.2–2026.2, 50
questões, 122 letras fracas). Nenhum lote aberto. Sessão encerrada perto do limite de contexto combinado (40%).
Feito por agentes do Claude Code, cada etapa um agente diferente (escritor, lente de fatos, lente didática, lente de
fatos de novo, amostra); no máximo 3 agentes em paralelo por etapa.
Resultado: 38 letras reescritas e gravadas em 27 questões (mq-14: 18 em 11; mq-15: 20 em 16). 80 letras sem equívoco
honesto ficaram com o texto antigo. mq-15: lente de fatos 18 ok, 4 corrigidas (P399efb93 A e P5e651adc C completadas
até o valor da alternativa); P05ee8563 B e D ficaram de fora porque a área errada (8,5 e 11) não tem origem
identificada — a alternativa não é explicada inteira. Didática melhorou 10, todas reconferidas (10 ok).
Amostra: mq-14 2 letras (1 consertada: nome da função h(t)), mq-15 5 letras, 0 erro.
Conflito em erradas-feitas.json e na caixa com a série fis (mq-14): resolvido por união, sem perder nada.
Testes: converte, tsc e vitest 922/922 verdes nos dois lotes. Gasto de API: zero.
Continuar de: `ERRADAS_SERIE=mq BASE_MAX=1 python3 ferramentas/fabrica/conteudo_api.py erradas-abre 25 mat` (próximo
lote: conteudo-erradas-mq-16; na fila: 71 de Matemática provas-alvo, depois Química provas-alvo), seguindo
docs/resolucoes/PROMPT-ERRADAS-CLAUDE.md.

## 2026-11-21 — AVISO — erradas (série fis, sem API, 8ª sessão)
Lote conteudo-erradas-fis-17 gravado (Física, provas-alvo PUC-Campinas 2022–2027, 25 questões, 65 letras fracas): 22
letras reescritas em 12 questões; 43 mantidas (sem equívoco honesto que leve a elas); nenhuma rejeitada. Lente de
fatos: 20 ok, 2 corrigidas (Pf9c381f6 C: texto ambíguo; Pcda1d771 E: tirado "daria"); didática melhorou 14, todas
reconferidas (2ª passagem: 12 ok, 2 só encurtadas). Amostra: 4 letras, 0 erro. Testes: converte, tsc e vitest 922/922
verdes. Gasto de API: zero. Em andamento: conteudo-erradas-fis-18.

## 2026-11-21 — AVISO — erradas (série mq, sem API, 7ª sessão)
conteudo-erradas-mq-16 gravado (Matemática, provas-alvo UDESC 2020.1/2023.2 e Acafe 2026): 19 letras reescritas em 13
questões, de 58 fracas (39 sem equívoco honesto ficaram com o texto antigo). Fatos 18 ok e 1 corrigida; didática
melhorou 5, todas reconferidas (4 ok, 1 corrigida: Pe9b8d75f B). 3 textos tinham "dá <número>" descrevendo conta
certa; só o verbo foi trocado e o conferente da amostra confirmou os 3 contra o print. Amostra: 4 letras, 0 erro.
Conflito em erradas-feitas.json resolvido por união. converte, tsc e vitest 922/922 verdes. Gasto de API: zero.
Lote conteudo-erradas-mq-17 aberto (25 questões, 45 letras fracas), em andamento.

## 2026-11-21 — AVISO — erradas (série fis, sem API, 8ª sessão)
Lote conteudo-erradas-fis-18 gravado (Física, provas-alvo Mackenzie 2026–2027, 25 questões, 78 letras fracas): 26
letras reescritas em 11 questões; 52 mantidas (sem equívoco honesto que leve a elas); nenhuma rejeitada. Lente de
fatos: 25 ok, 1 corrigida (Pcd956824 A: "no prisma", o enunciado não diz que é vidro); didática melhorou 12, todas
reconferidas (2ª passagem: 10 ok, 2 só encurtadas). Amostra: 5 letras, 0 erro. Testes: converte, tsc e vitest 922/922
verdes. Gasto de API: zero. Em andamento: conteudo-erradas-fis-19.

## 2026-11-21 — ACABOU (provas-alvo de Matemática)
`erradas-fila` não mostra mais Matemática na faixa 1. Últimos lotes: conteudo-erradas-mq-17 (27 letras em 20
questões, Acafe 2023–2025; fatos rejeitou 1 por equívoco inventado; amostra 4 letras, 0 erro) e mq-18 (29 letras em 17
questões, Acafe 2021–2023; amostra 6 letras, 1 consertada: P5e621c84 D passou a explicar o item II). converte, tsc e
vitest 922/922 verdes nos dois. Gasto de API: zero. A série mq segue em Química (lote mq-19 aberto).

## 2026-11-21 — FIM — erradas (série fis, sem API, 8ª sessão)
Lotes gravados nesta sessão: conteudo-erradas-fis-17, fis-18 e fis-19 (Física, provas-alvo PUC-Campinas, Mackenzie e
UPE SSA3, 75 questões, 220 letras fracas). Nenhum lote aberto. Sessão encerrada perto do limite de contexto combinado (40%).
Feito por agentes do Claude Code, cada etapa um agente diferente (escritor, lente de fatos, lente didática, lente de
fatos de novo, amostra); no máximo 3 agentes em paralelo por etapa.
Resultado: 67 letras reescritas e gravadas em 32 questões (fis-17: 22 em 12; fis-18: 26 em 11; fis-19: 19 em 9). As
demais letras não têm equívoco honesto que leve a elas e ficaram com o texto antigo.
fis-19: lente de fatos 20 ok, 4 corrigidas (Pfdbbadb7 E: energia cinética não se conserva; P696c5c2f D: carga "de
módulo 3 vezes maior"); didática melhorou 15 e deu 1 alerta; 2ª passagem rejeitou 3 cuja conta só chega PERTO da
alternativa (Pfdbbadb7 E ≈ 54 m/s contra 50; P3e7482a6 A ≈ 0,067 s contra 0,064; P18de5213 C ≈ 3488 m contra 3480) e
corrigiu P63a2f5b6 A (6,0 N é só o acréscimo da força; equívoco renomeado). Fora por filtro: Pe6f6cf41 C (55 palavras).
Amostra: 5 letras, 0 erro.
Conflito em erradas-feitas.json com a série mq (fis-18): resolvido por união, sem perder nada.
Testes: converte, tsc e vitest 922/922 verdes nos três lotes. Gasto de API: zero.
Continuar de: `ERRADAS_SERIE=fis BASE_MAX=1 python3 ferramentas/fabrica/conteudo_api.py erradas-abre 25 fis` (próximo
lote: conteudo-erradas-fis-20; na fila: 356 de Física provas-alvo), seguindo docs/resolucoes/PROMPT-ERRADAS-CLAUDE.md.
## 2026-11-21 — FIM — erradas (série mq, sem API, 7ª sessão)
Lotes gravados nesta sessão: conteudo-erradas-mq-16, mq-17 e mq-18 (Matemática, provas-alvo UDESC e Acafe; com eles
ACABOU a faixa 1 de Matemática) e mq-19 (Química, provas-alvo ENEM 2022/2024/2025 e Fuvest 2020–2027). Nenhum lote
aberto. Sessão encerrada perto do limite de contexto combinado (40%).
Feito por agentes do Claude Code, cada etapa um agente diferente (escritor, lente de fatos, lente didática, lente de
fatos de novo, amostra); no máximo 3 agentes em paralelo por etapa.
Resultado: 121 letras reescritas e gravadas em 71 questões (mq-16: 19 em 13; mq-17: 27 em 20; mq-18: 29 em 17; mq-19:
46 em 21). mq-19: fatos 45 ok e 5 corrigidas (HNO2 em P22a54283 D; frase sobre esquema que não está no print tirada de
Pd096fa40 D), didática melhorou 7, todas reconferidas (7 ok). Amostra mq-19: 5 letras, 0 erro.
Testes: converte, tsc e vitest 922/922 verdes em todos os lotes. Gasto de API: zero.
Continuar de: `ERRADAS_SERIE=mq BASE_MAX=1 python3 ferramentas/fabrica/conteudo_api.py erradas-abre 25 qui` (próximo
lote: conteudo-erradas-mq-20; na fila: ~413 de Química provas-alvo), seguindo docs/resolucoes/PROMPT-ERRADAS-CLAUDE.md.
## 2026-11-21 — AVISO — erradas (série fis, sem API, 9ª sessão)
conteudo-erradas-fis-20 gravado: 20 letras reescritas em 11 questões (UPE SSA3 2021–2024). Fatos 19 ok e 1 corrigida
(Paca5f8e2 A: óculos polarizados filtram a luz que a reflexão já polarizou); didática melhorou 8, 2ª passagem 8 ok.
Amostra: 4 letras, 2 encurtadas (P5b614bba B e C). Testes 922/922. Seguindo com fis-21.
## 2026-11-21 — AVISO — erradas (série mq, sem API, 8ª sessão)
Lote conteudo-erradas-mq-20 (Química, provas-alvo Unesp/Unicamp) gravado: 45 letras em 22 questões (10 mantidas por falta
de equívoco honesto). Fatos 44 ok e 1 corrigida (P41ff8a18 B, frase forte demais); didática melhorou 8, todas
reconferidas (8 ok). Amostra: 10 letras, 0 erro. converte, tsc e vitest 922/922 verdes. Conflito em erradas-feitas.json
resolvido por união. Gasto de API: zero. Segue o mq-21 (na fila: 391 de Química provas-alvo).
## 2026-11-21 — FIM — erradas (série mq, sem API, 8ª sessão)
Lotes gravados nesta sessão: conteudo-erradas-mq-20 e mq-21 (Química, provas-alvo Unesp/Unicamp e outras). Nenhum lote
aberto. Sessão encerrada perto do limite de contexto combinado (40%).
Feito por agentes do Claude Code, cada etapa um agente diferente (escritor, lente de fatos, lente didática, lente de
fatos de novo, amostra); no máximo 3 agentes em paralelo por etapa.
Resultado: 84 letras reescritas e gravadas em 42 questões (mq-20: 45 em 22; mq-21: 39 em 20); 24 letras mantidas por
falta de equívoco honesto. mq-21: fatos 37 ok e 2 corrigidas (P74ebdbf5 D, "ácido da maçã" ambíguo; P673a1e9a E,
contagem de elétrons), didática melhorou 12, reconferidas (11 ok, 1 corrigida: P4ebd1bab D, gás mostarda é arma
química usada desde a Primeira Guerra). Amostra mq-21: 8 letras, 0 erro.
Testes: converte, tsc e vitest 922/922 verdes nos dois lotes. Gasto de API: zero.
Continuar de: `ERRADAS_SERIE=mq BASE_MAX=1 python3 ferramentas/fabrica/conteudo_api.py erradas-abre 25 qui` (próximo
lote: conteudo-erradas-mq-22; na fila: 366 de Química provas-alvo), seguindo docs/resolucoes/PROMPT-ERRADAS-CLAUDE.md.
