
## 2026-11-13 UTC — FIM — session_01PveEKWhAdHoSJKa5to3K8D
Último lote gravado: por-0090. Gravados nesta sessão: por-0088 (58 ok, 2 pendentes), por-0089 (60 ok), por-0090 (60 ok). Nenhum lote aberto. Testes: 786 passaram.
Pendentes:
- P9714da52 — obra: Torto arado (a pergunta é sobre o narrador do romance inteiro; o trecho só mostra 1ª pessoa).
- Pb5cc8933 — classificação: é de Inglês (balões em inglês; a resposta depende de compreender o texto em inglês; é a versão em inglês da tirinha da questão P05099dcf).
Sugestões de reclassificação de subtema (não alterei; os equívocos usam o conteúdo atual da questão):
- P0e40084f (P03.3 → pontuação P10.4); Pc58aa8f5 (P03.3 → concordância P10.1); P39a9875a (P03.2, charge, talvez P03.3).
- por-0090, classificadas em P04.1: Pd573bc25 (concordância verbal), Pb69670cb (figura de linguagem P06.1), Pa732a9f5 (sinonímia P05.1), Pcf72e7e5 (literatura P12.1), P13e12fa2 (pontuação: aspas).
Gabarito do Aprendice (dois especialistas às cegas, iguais ao preliminar): P5bc0417a C, Pa5e4e8c0 D, Pe689171a D, P0e40084f B, Pc58aa8f5 A, P4b39fe34 D, P90c35caa C.

## 2026-11-19 15:13 UTC — FIM — session_01PveEKY3G8XPW7thJLdH3jL
Último lote gravado: por-0093. Gravados nesta sessão: por-0091 (60 ok), por-0092 (59 ok, 1 pendente), por-0093 (60 ok). Nenhum lote aberto. (A sessão parou dias 13–19/11 pelo limite semanal e retomou.)
Gabarito do Aprendice (dois especialistas às cegas, iguais ao preliminar): P0582aef9 C, P6d8851c8 B, P8120f5dd A, Pe9d9a6a5 D.
RECLASS P90b71578 P05.1 -> P10.5
RECLASS Pe0ccc88b P05.1 -> P08.1
RECLASS P8cc68a53 P05.1 -> P10.2
OUTRA P61c6a142: outra matéria: Artes
RECLASS Pe1df3e63 P05.2 -> P01.2
RECLASS Pa23e5a4d P05.2 -> P08.1
RECLASS Pe5634f50 P05.2 -> P04.4
RECLASS P81a8a946 P05.1 -> P04.1
RECLASS P0ab1ed43 P05.1 -> P05.2
RECLASS P8d800926 P05.1 -> P04.1
RECLASS Pacd6a1c0 P05.1 -> P04.2
DADO Pb6bacbc6 (Fatec 2023.2 q29): alternativa E termina com " 29" solto (número da questão) -> tirar
RECLASS P3c92e15d P05.1 -> P08.1
RECLASS P321a6a93 P05.1 -> P09.5
RECLASS Pd17f4b08 P05.2 -> P01.2
RECLASS P4bdb6a13 P05.2 -> P10.4
RECLASS Pbcfb88fc P05.2 -> P01.1
RECLASS P3b32eff0 P05.2 -> P05.4
RECLASS Pe9d9a6a5 P05.2 -> P05.4
RECLASS P6b71b6f7 P05.2 -> P01.2
RECLASS P3f9a5a35 P04.2 -> P09.2
RECLASS P75a706b0 P04.2 -> P08.3
RECLASS P6433066d P04.2 -> P10.4
RECLASS P525b7014 P04.2 -> P07.3
RECLASS P868a0d8d P04.2 -> P07.2 (porquês; não há conteúdo de ortografia, P07.2 é o mais próximo)
DADO Pe9d9a6a5: texto da entrada com acentos quebrados ("A verdade ´e que vocˆe") -> "A verdade é que você" (como no print)
Testes depois do por-0093: 786 passaram (tsc e converte ok).

## 2026-11-19 16:26 UTC — AVISO PILOTO FÁBRICA — session_01PveEKX1JnJpMCfgHmpRupU
Lote gravado: **por-0094** — 50 ok, 0 pendentes, 0 divergências. Nenhum lote aberto. Não publiquei o site.
Esta sessão não resolveu à mão: construiu e rodou o PILOTO da fábrica de resoluções pela API
(`ferramentas/fabrica/resolve_api.py`, prompts em `ferramentas/fabrica/prompts/por-*.md`), em Message Batches.

**Gasto real: US$ 6,11 no lote inteiro, US$ 0,12 por questão** (teto do piloto: US$ 10; teto do dono: US$ 200,
sobram US$ 193,89). Por etapa: resolvedor 0,98 · reconciliação 0,17 · gabarito cego 0,01 · lente de fatos 1,50 ·
lente didática 1,45 · lente de fatos (2ª passada) 1,37 · lentes avulsas 0,42 · teste inicial 0,20. Tudo em
`fabrica_saida/gastos.csv`. O cache de prompt derrubou a entrada de 32 mil para ~4 mil tokens por pedido.

**O que a fábrica entregou sozinha:** 48 ok, 2 pendentes, 3 divergências de gabarito (todas reconciliadas com a
letra oficial, com a leitura da banca explicada). O resolvedor, **às cegas, acertou a letra oficial em 47 de 50
(94%)**.

**A minha conferência (Claude Code + 3 agentes que não escreveram nada): 21 questões** — 100% das pendências,
divergências, obras, gabarito do Aprendice e das que as lentes mudaram muito, mais 10% das outras por sorteio.
Cerca de 30 itens apontados. Em número de questões:
- **erro de fato: 6** (afirmação não conferível no trecho da prova; citação com maiúscula diferente do print;
  inferência que não se sustenta; eliminação aritmeticamente errada; definição errada de "semelhante";
  equívoco rotulando um não-erro);
- **fontes escritas de memória: 45 questões, 78 entradas.** O mais grave: a etapa de API não abre a web, e os
  modelos escreveram endereços de site de cabeça, vários inexistentes. Apaguei todas; ficaram só as 4 que eu
  conferi na web, nas duas obras literárias;
- **pendência sem motivo que se sustentasse: 2** (as duas viraram resolução, ver abaixo);
- **defeito didático ou de forma: 14** (o campo `checagem` repetindo um passo em 6 questões — o defeito mais
  frequente; `erradas` fora do formato "Por que eu errei"; `tipo: "calcular"` em Português; `pista` entregando a
  resposta; `alerta` terminando em "o gabarito oficial prevalece"; passo sem `conta`).
Das 3 questões sorteadas, as 3 tinham algum item a corrigir, nenhuma com erro que mudasse a resposta.

**As duas pendências da fábrica não se sustentavam** (pendência à toa joga questão boa fora):
- `P01d5b29c`: "falta o texto de apoio no print". Falta no print DA QUESTÃO; o texto está em `q/001.webp` e
  `q/003.webp` da mesma prova (texto comum ao bloco). Acrescentei à fábrica o suporte a prints extra
  (`extras.json` por lote) e a questão foi resolvida.
- `Pc6fcb2d6`: pedido de anulação por causa de "burla". A lente de fatos, chamada de novo, mostrou que "burla"
  tem os dois sentidos em dicionário (engano/fraude e zombaria) e que a resposta não depende desse item: o item I
  sozinho derruba A, B e D. Resolvida com o gabarito oficial C, com o ponto no `alerta`.

**Já corrigido na fábrica para o próximo lote:** os cinco defeitos sistêmicos estão escritos nos quatro prompts;
`fontes` é obrigatoriamente vazio na etapa de API; prints extra por questão; e um furo da linha de produção foi
tapado — quando a lente didática via possível erro de fato, ela registrava (por regra não corrige fato) e ninguém
mais olhava; agora o apontamento dela entra na 2ª passada da lente de fatos.

**Recomendo continuar**, com duas condições: (1) a conferência do Claude Code com agentes continua obrigatória —
3 de 3 sorteadas tinham item a corrigir, então o lote não pode ir ao ar só com as lentes de API; (2) no próximo
lote, conferir 20% por sorteio em vez de 10%, para medir se as cinco regras novas derrubaram a taxa de defeito.
Custo projetado: US$ 0,12 por questão, ou cerca de US$ 196 para as 1.634 questões de Português que faltam —
acima do teto de US$ 200 do dono só com Português, então a decisão de seguir em outras matérias é do dono.

Testes depois do por-0094: converte ok, tsc sem erro, 786 testes passando (22 arquivos).

PENDENCIAS
RECLASS P01d5b29c P05.4 -> P07.4
RECLASS P16e3abb1 P05.4 -> P01.2
RECLASS P2d5d585d P05.4 -> P01.2
RECLASS P452408d7 P05.4 -> P07.4
RECLASS P4b20096c P05.4 -> P10.3
RECLASS P63e596b4 P05.4 -> P01.4
RECLASS P7b3c994a P05.4 -> P07.4
RECLASS P86a68ee9 P05.4 -> P04.2
RECLASS P9dab2089 P05.4 -> P01.2
RECLASS Pa46a5af1 P05.4 -> P12.1
RECLASS Pae412026 P05.4 -> P02.1
RECLASS Pe485b2a6 P05.4 -> P05.2
RECLASS Pe7cbdbb4 P05.4 -> P05.2
RECLASS Pee47b572 P05.4 -> P10.2
RECLASS Pf0102d50 P05.4 -> P07.3
RECLASS Pf43fcaa8 P05.4 -> P10.1
RECLASS Pfeb43531 P05.4 -> P03.3
RECLASS Pfff2073a P05.4 -> P01.1
RECLASS P4e385edb P05.4 -> P07.4 (sugestão do conferente, discutível: o núcleo é neologismo; os equívocos ficaram em P05.4)
RECLASS Pae412026 P05.4 -> P06.2 (alternativa da lente de fatos: gradação é figura de pensamento; os equívocos ficaram em P02.1 — escolha uma)
PRINT P01d5b29c (UNIRG 2022 Medicina 2022/1 – Paraíso do Tocantins q4): o print da questão não traz o texto de apoio, que está em q/001.webp e q/003.webp; `tem_figura` está false, mas a página do texto tem figura (recorte de dicionário). Levar o texto para a transcrição da questão.
DADO Pbf76130e: alternativas -> a transcrição troca "ti" por "Ɵ" (narraƟva, ﬁlhos); no print o texto é normal
DADO P4e385edb: texto_da_prova -> mesma troca de "ti" por "Ɵ"; e a alternativa C está sem a preposição no print ("com o objetivo fundamentar certa argumentação"), erro da própria prova
DADO Pa47d669e: texto_da_prova -> falta o "37 - A" no início do comando e a URL vem junta ("endereco-dematuto"); no print é "endereco-de- matu-to"
DADO P5db06ab0: texto_da_prova -> as falas da tirinha só aparecem no print; a alternativa D traz "ﬁgura" com ligadura tipográfica
DADO Pf43fcaa8: texto_da_prova -> "sinhá" e "Aves de Arribação" vêm marcados como riscados (~~ ~~); no print estão só em itálico. E a alternativa B traz "porta.." com dois pontos finais, erro da prova
DADO P48efc3e6: texto_da_prova -> acentos quebrados (L´ılia, ex´ıguo, poss´ıvel, g´ırias); no print são Lília, exíguo, possível, gírias
DADO P7861c933: texto_da_prova -> as aspas do print vêm como ― e ‖
DADO Pacc38901: alternativas -> a alternativa B traz "a importância elo de ler" no print (erro de digitação da prova), enquanto o texto-base traz "a importância de ler"
DADO Pd9d4368b (URCA 2027 PSU 2026.2/2027.1 q96): `n_caderno` está null em app/conteudo-fonte/provas/urca-2027-1/prova.json; no caderno a questão é a 36 (60 da Prova I + 36). Preencher para a citação da fonte bater com o PDF
OBRA Pa46a5af1: Canaã, de Graça Aranha — CONFERIDA na web por esta sessão (1902, Espírito Santo, Milkau × Lentz com teses opostas sobre miscigenação, romance de tese que abre o Pré-Modernismo). Sustenta o gabarito D. Fontes gravadas na questão
OBRA P29a3ea3b: Capão Pecado, de Ferréz — CONFERIDA na web por esta sessão (2000, Capão Redondo, literatura marginal/periférica com oralidade e gíria). Sustenta o gabarito B. Fontes gravadas na questão
OUTRA Pee47b572: dúvida de regra para a coordenadora decidir — o código do equívoco da letra C ficou em P10.3 (colocação pronominal) numa questão cujo conteúdo é P10.2 (regência). O conferente argumentou que o equívoco deve apontar o conteúdo DO ERRO, e o PROMPT-SESSAO manda usar o código do conteúdo CERTO DA QUESTÃO. Se a regra é a segunda, trocar para P10.2
OUTRA por-0094: 20 das 50 questões estavam no conteúdo errado, quase todas em P05.4 (variação linguística), que está virando depósito da matéria. Vale uma passada de reclassificação no banco de Português antes de abrir mais lotes
