# Decisões do dono de 20/11/2026 ("todas sim") — sessão de conteúdo

Ramo `app-prototipo-completo`. Um commit por item. Em cada item: `converte.py`, `tsc` e `vitest` verdes (912 a 916 testes). Site **não** publicado.

## Item 3 — 66 "anular" como "Questão indisponível"
- Mesmo mecanismo das 52 primeiras: `app/conteudo-fonte/indisponiveis.json` (motivo "dono, 20/11: questão indisponível"; o texto do selo é o mesmo). Ids não mudam; tirar a linha devolve a questão.
- Entraram as **14** restantes dos registros (total **66**): P50441003 (UECE), Pcf680d36 (Acafe), P9615ec2a (UERR), Pf4c499ee (PUC-Rio), P12e54be4 (UFRR), P528013c1 (PUCPR), Pa1c1cf9f, Pe0b0afd4 (Unitins), Pb61271f8 (UFSM), P49978098 (EMESCAM), P93ec458e, Pcfc26fc6 (UDESC), Pdaf43568 (UNEMAT), P523fcc4a (UFRR). Lista com o motivo no fim de `docs/resolucoes/anular-para-o-dono.md`.
- Checagem na web: nenhuma tinha errata, anulação ou gabarito alterado. Limite: os PDFs da UFRR e da UFSM não abriram daqui (rede bloqueada); conferidos pelos trechos da busca.
- P02f0b3a0 (UFRR) continua fora como **anulada pela banca**, não como indisponível.
- Teste `indisponiveis.test.ts` atualizado de 52 para 66.

## Item 2 — 25 conteúdos (subtemas) novos, 266 questões movidas
Códigos novos no fim de cada tema, sem mexer em nenhum código nem id existente. Sem ícone (pontinho na cor da matéria, como os demais). Cada questão foi lida por um especialista da matéria e só mudou quando o **comando** cobra o conteúdo novo. Nenhuma questão de lote aberto foi tocada.

- **Biologia:** B12.7 grupos vegetais (23), B12.8 ciclos de vida das plantas (12), B12.9 flor, polinização, fruto e semente (27), B12.10 morfologia vegetal (6), B09.7 conceitos básicos de ecologia (8), B08.8 reprodução sexuada e assexuada (5).
- **Química:** Q07.4 entropia, energia livre e espontaneidade (10), Q03.6 vidrarias e técnicas de laboratório (6), Q03.7 fenômenos físicos e químicos (5), Q03.8 mudanças de estado e diagrama de fases (5).
- **Matemática:** M12.6 cônicas (18), M09.6 transformações geométricas (9), M11.7 geometria de posição (7), M11.8 poliedros e relação de Euler (5).
- **Português:** P03.5 funções da linguagem (28), P01.5 intertextualidade (20), P03.6 foco narrativo e tipos de narrador (14), P10.6 ortografia e acentuação (9), P07.5 fonologia (7), P11.5 Trovadorismo, Humanismo e Classicismo (6), P06.4 versificação (4).
- **Inglês:** I03.10 tipos de frase: simples, composta e complexa (6).
- **Filosofia e Sociologia:** S01.7 surgimento da sociologia e o positivismo de Comte (12), L03.6 estética e filosofia da arte (8), L01.6 o que é filosofia e para que serve (6).

Onde: nomes em `app-atual/<m>/dados.json` (`nomesub`, só acrescentados) e `app/conteudo-fonte/materias/{ing,fs}.json`; classificação em `app/conteudo-fonte/provas/*/prova.json` (campos `tema`/`conteudo`). Registro questão a questão em `docs/provas/reclassificacoes.md`. Guias da skill `resolucao-exercicios` (bio, quí, mat, por, ing) com os conteúdos novos.

Ficou de fora:
- Sugestões com menos de 5 questões (Física, História e Geografia não tinham nenhuma com 5 ou mais), e "obras literárias indicadas" (não é conteúdo; cada obra já está no período literário dela).
- 2 questões ficaram onde estavam porque o comando cobra o conteúdo atual: Pf1cc20d9 (B11.3) e P121417c5 (P12.5).
- P79f70c92 (Einstein 2024 q1) é a mesma questão da antiga P5e74fc4 do protótipo, que guarda a classificação (P03.3); mudá-la exigiria mover a resolução do protótipo, então ficou.
- Pontos de fronteira para o dono olhar, se quiser: L03.6 (estética) ficou no tema de Ética; P11.5 fica no tema "do Barroco ao Simbolismo" (o nome do tema não foi mudado); P01b3a78d (Camões) foi para P11.5; P101726a0 (PUC Minas 2024) foi para P01.5.
- Os códigos de equívoco dentro das resoluções (ex.: "P06.2:...") não foram trocados: são só rótulos nos dados, não usados pelo site hoje, e os arquivos de resolução são das outras sessões.

## Item 1 — 23 cartões com fonte de site didático ou de cursinho
Trocados os 23 (Biologia Net, Só Matemática, Descomplica, Estratégia, Sanar, Vestibulando Web, Kenhub, Lecturio, Norma Culta, SimpleStudy, Blog do Vestibular): bio-d010, d019, d036, d038, d047, d050, k006, k027; mat-d005, d012, d014, d015, d060, k006, k039, k040; por-d009, d028, d059, k014, k032; qui-d042, d049. Ids iguais. Arquivos: `app-atual/<m>/dados.json` e a fonte editável `app-atual/conteudo_fonte/*.json`.
- Fontes novas: OpenStax, NCBI StatPearls/PMC, MedlinePlus, NOAA, ChEBI, Portal da OBMEP (IMPA), Ciberdúvidas, Revista Virtual de Química (SBQ), SEDU-ES, Wikisource (Dicionário de Cultura Básica).
- Lentes: fatos (agente 1) → didática (agente 2) → fatos de novo (agente 3). 7 cartões tiveram texto corrigido: bio-d038 (tremores e depois paralisia), bio-d047 (erro comum), mat-d005, d012, d014, d015 (sem divisão na mesma linha; d015 sem "mg/kg"), além de links corrigidos em por-d028 e qui-d049.
- Fora do escopo (não é flashcard nem frase), achado na conferência: 2 verbetes do dicionário de Matemática ("contrapositiva" e a negação de "todo A é B", campo `dic` de `app-atual/mat/dados.json`) ainda citam Estratégia Concursos como fonte. Ficam para um próximo comando.
- Limite: a rede desta sessão não abre páginas externas; as fontes foram conferidas pelo texto que a busca na web devolve de cada URL exata (nenhuma página foi lida inteira). Vale reabrir quando a rede permitir, sobretudo bio-d050 (a frase de Odum apareceu numa cópia do artigo em Harvard) e por-d059/por-k014 (material da SEDU-ES).

FIM
