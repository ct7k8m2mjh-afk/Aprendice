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
