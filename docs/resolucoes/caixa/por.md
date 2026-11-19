
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

## 2026-11-19 16:26 UTC — FIM — session_01PveEKX1JnJpMCfgHmpRupU
Sessão da FÁBRICA de Português (piloto pela API). Último lote gravado: **por-0094** (50 ok, 0 pendentes, 0
divergências). Nenhum lote aberto. Não abri o segundo lote: o dono decide se a fábrica continua (era a regra
do piloto). Não publiquei o site.
Faltam 1584 questões de Português sem resolução (`python3 ferramentas/resolucoes/lote.py status`).
Gasto total da fábrica até aqui: US$ 6,11 de um teto de US$ 200 (`fabrica_saida/gastos.csv`).
O que fica pronto para a próxima sessão: `ferramentas/fabrica/resolve_api.py` (comandos `estima`, `teste`,
`roda`, `lente`), os prompts em `ferramentas/fabrica/prompts/por-*.md` já com os cinco defeitos do piloto
corrigidos, e `ferramentas/fabrica/confere_amostra.py`. Para rodar o lote seguinte:
`python3 ferramentas/resolucoes/lote.py proximo por 50 --novo` e depois
`python3 ferramentas/fabrica/resolve_api.py roda <entrada> --saida <saida> --teto <teto>`.
As pendências deste lote estão no bloco AVISO PILOTO FÁBRICA logo acima.

## 2026-11-19 17:50 UTC — PENDENCIAS — session_01PveEKX1JnJpMCfgHmpRupU
Lotes gravados nesta leva: **por-0095** (50 ok, 0 pendentes) e **por-0096** (49 ok, 1 pendente), em 45 e 41
provas. Gasto: US$ 5,22 e US$ 4,93; fábrica US$ 16,26 de US$ 200. Testes depois dos dois: converte ok, tsc sem
erro, 786 testes passando. Lotes por-0097 e por-0098 em andamento na fábrica (esteira pedida pelo dono).

Conferência: 4 agentes, 35 questões (100% das pendências, divergências, obras, gabarito do Aprendice, alerta de
lente e das que as lentes mudaram muito, mais 10% por sorteio), ~50 itens apontados e TODOS aplicados (78
correções de campo e um passo cortado por só repetir as `erradas`). As cinco regras do piloto deram resultado:
nenhum dos dois lotes teve erro no lote.py valida, e a `checagem` que repete um passo caiu de 6 em 21 questões
para 4 em 35. Dois furos da própria fábrica foram achados e tapados (o conserto mecânico desfazia o código de
equívoco escolhido pelas lentes, em sete questões; e as lentes nunca viam o campo `caminhos`, onde estavam quase
todos os erros que sobraram).

Gabarito do Aprendice (duas letras às cegas, iguais ao preliminar): P59a37132 B, Pa7b6e203 B, Pb2efb20d D, Pc624b594 D, Pf5b95e48 B.
Obras conferidas na web por esta sessão: P1cd41fe9 ("No meio do caminho", Drummond, Revista de Antropofagia 1928,
depois em Alguma Poesia 1930) e Pc624b594 (Hércules-Quasímodo, parte "O Homem" de Os Sertões, de Euclides da
Cunha). As duas sustentam a letra oficial, e a fonte acadêmica ficou gravada na questão.

**Três coisas que precisam de decisão sua:**
1. **ANULAR P97b8da45** (abaixo): o conferente refez a contagem de fonemas e o erro é da banca, não nosso.
2. **O subtema P06.1/P06.2 está virando depósito de Português**, como o P05.4 no lote anterior: 29 das 100
   questões destes dois lotes estão no conteúdo errado (lista de RECLASS abaixo). Vale uma passada de
   reclassificação no banco antes de abrir muitos lotes, senão a revisão espaçada manda o aluno para o
   conteúdo errado.
3. **Falta um subtema de fonética/fonologia em Português.** Duas questões destes lotes são de contagem de
   fonemas e não há conteúdo que as receba (ficaram em P06.3, figuras de som). Criar o subtema ou decidir o destino.

PENDENCIAS
ANULAR P97b8da45 (URCA 2025 PSU 2025.2/2026.1 q? — ver registro): a contagem correta de fonemas é semipenumbra 11, quarto 6, sorrir 5, carcomida 9, atravancam 9, e NENHUMA alternativa traz essa sequência. A oficial E dá 8 a "carcomida" (são 9: c-a-r-c-o-m-i-d-a, sem dígrafo). A banca não anulou. O conferente sugere a alternativa de manter com o gabarito E, resolvida por eliminação (E é a única certa nos itens 1, 2, 3 e 5), com `alerta` dizendo que o item 4 tem 9 fonemas e a alternativa traz 8 — erro da banca. Deixei como pendente para você escolher entre as duas saídas
OUTRA por-0095/0096: criar um subtema de fonética/fonologia em Português (P72d7b23a e P97b8da45 são contagem de fonemas e estão em P06.3, figuras de som, que não cobre isso)
OUTRA URCA: a numeração das questões da URCA está deslocada em exatamente 60 (a entrada diz 93, 94, 97, 103, 104, 105 e o print traz 33, 34, 37, 43, 44, 45). Parece a soma dos 60 itens da Prova I; conferir antes de publicar, porque o aluno vê o número
OUTRA Unifor/Fatec/UFRR: em seis questões a transcrição colou na alternativa E um texto que no print não é dela (o aviso "ATENÇÃO: As questões de números 55 a 60...", o título "Questão 43/54", o "CLIC!" do balão da charge, o enunciado do texto seguinte). É defeito repetido da ingestão dessas provas, e o aluno vê a alternativa errada: vale uma correção em lote
OUTRA URCA/UNIRG/Unifor: acentos quebrados na transcrição ("mem´oria", "ausˆencia", "avanc¸o", "L´ılia") e ligadura "fi" separada ("fi gueira", "fi lha"). Mesmo defeito do lote anterior; as resoluções usaram a forma correta do print
RECLASS P1ba934c0 P07.1 -> P05.1
RECLASS P1c014429 P06.3 -> P10.1
RECLASS P1cd41fe9 P06.1 -> P02.3  (lente sugeriu P02.3/P04.4; equívocos usam P02.3)
RECLASS P248d3a38 P06.1 -> P01.2
RECLASS P3175dcda P07.1 -> P09.4  (lente sugeriu P04.2/P09.4; equívocos usam P09.4)
RECLASS P362193fa P06.1 -> P01.2
RECLASS P3b461aba P06.2 -> P02.2
RECLASS P3e6070cb P06.2 -> P05.3  (lente sugeriu P02.3/P05.3; equívocos usam P05.3)
RECLASS P473df78f P06.1 -> P06.3
RECLASS P5931cbf4 P06.2 -> P03.1
RECLASS P674b8154 P06.2 -> P01.4
RECLASS P6ab9c2aa P06.2 -> P01.2
RECLASS P6c9a2070 P06.2 -> P06.1
RECLASS P6ca5459d P06.3 -> P04.3
RECLASS P7ea629d0 P06.1 -> P01.1
RECLASS P806a310e P07.1 -> P06.2
RECLASS P82a63834 P06.2 -> P04.2
RECLASS P8bd61891 P06.1 -> P01.2
RECLASS P991f680d P06.1 -> P06.3
RECLASS P9eac9f9e P07.1 -> P07.2
RECLASS Pac9e8b3e P06.3 -> P08.1
RECLASS Pae8fd1b8 P06.1 -> P06.2
RECLASS Pb09e987b P06.3 -> P06.1
RECLASS Pb2efb20d P06.1 -> P06.2
RECLASS Pbccdcba8 P06.1 -> P06.2
RECLASS Pc624b594 P06.1 -> P12.1
RECLASS Pdd71e0f1 P06.1 -> P06.2
RECLASS Pe3c9bfd7 P06.2 -> P06.3
RECLASS Peb94b72e P06.1 -> P10.2
RECLASS Pf114ba2e P06.1 -> P06.2
RECLASS Pf939e2cc P07.1 -> P08.3
RECLASS Pfb341f53 P06.1 -> P06.3
DADO P1cd41fe9 (FCM-MG 2021 2º semestre · questão 9): alternativas -> no print, a alternativa A traz "No meio de meu rim tinha uma pedra" (o texto transcrito usa a mesma redação); a alternativa B termina com aspas simples e duplas coladas; sem outra dive
DADO P362193fa (UEMA 2024 PAES · questão 3): Na alternativa E do print há aspas soltas no meio: '“Do barro de que você foi gerada/ “Me veio inspiração”'. A resolução cita sem essas aspas internas. A diferença é só tipográfica e não altera a anál
DADO P3e68f939 (Unifor 2026 2º semestre · questão 52): A transcrição traz 'fi gueira' e 'fi lha' (ligadura quebrada); o print mostra 'figueira' e 'filha'. A resolução usou a forma correta, então nada muda.
DADO P46e0daaf (URCA 2026 2026.1 · questão 104): A transcrição traz artefatos de digitação ('ru´ınas', 'expl´ıcito', 'cr´ıtico', 'impl´ıcita', 'ju´ızo', 'eu- femismo', 'desumani- zados') que não aparecem no print. A resolução cita a forma correta do
DADO P473df78f (URCA 2024 2024.2 · questão 93): texto_da_prova -> no print o nome é "Vinícius" (a transcrição quebrou o acento) e o verso aparece como "E um grito de igualdade foi ouvido como um sino a soar"
DADO P58777ca3 (URCA 2024 2024.2 · questão 104): alternativas.D -> no print está 'específico' e a alternativa E traz 'linguagem' inteiro; a transcrição quebrou acento e sílaba
DADO P59a37132 (URCA 2027 PSU 2026.2/2027.1 (nov/2026) · questão 94): alternativas -> a transcrição traz acentos quebrados ('b´ıblica', 'atribu´ıda') e hifenização solta ('im- pede'); no print as palavras estão corretas: 'bíblica', 'atribuída', 'impede'
DADO P65568ade (Unifor 2026 1º semestre · questão 49): No texto transcrito, a alternativa E aparece como "Hipálage CLIC!", mas no print ela é só "Hipálage": o "CLIC!" é o texto da charge, colado por engano. Há também "fi gura" e "geografi auenp" com espaç
DADO P677a5ce5 (Unifor 2025 1º semestre · questão 43): No JSON, a alternativa E foi transcrita como 'Onomatopeia. Questão 43'. No print a alternativa é só 'Onomatopeia.'. A resolução não usou esse trecho, então não há impacto.
DADO P6ab9c2aa (FCM-MG 2025 1º semestre · questão 1): alternativas A -> no print está "A interlocutora" (a transcrição colou "Ainterlocutora"); enunciado -> "CORRETA a respeito" (a transcrição colou "CORRETAa")
DADO P7009a8a7 (Unifor 2026 1º semestre · questão 54): Na transcrição, a alternativa E absorveu o aviso 'ATENÇÃO: As questões de números 55 a 60...', que no print é um quadro separado, abaixo da questão. A resolução não usa esse trecho, então nada muda.
DADO P70d906b4 (FCM-MG 2023 1º semestre · questão 6): A alternativa D diz 'Almoçou e fez barba', mas o poema diz 'Almoçou e fez a barba'. A resolução cita o texto da alternativa, então a diferença não afeta a análise.
DADO P7ea629d0 (FCM-MG 2024 2º semestre · questão 1): O texto_da_prova junta os versos em blocos ('A cidade perfura o corpo até a medula.'). No print, cada verso ocupa uma linha ('A cidade perfura' / 'o corpo' / 'até a medula.'), num bloco único de 15 ve
DADO P81b44e66 (Unifor 2026 2º semestre · questão 54): No JSON, a alternativa E inclui o texto do quadro 'ATENÇÃO' do rodapé da página. No print, ele não faz parte da alternativa. A resolução não usou esse trecho, então não houve prejuízo.
DADO P82a63834 (Unicentro 2026 Vestibular · questão 3): texto_da_prova -> no print o texto tem sete parágrafos, com recuo de início em 'Essa foi uma das grandes pautas', 'O levantamento revelou', 'Apesar disso', 'A IA pode', 'No cenário internacional', 'A 
DADO P991f680d (URCA 2023 2023.2 · questão 97): alternativas.D -> no print a frase termina em 'ressaltar o absurdo da situação' (a transcrição traz 'a absurdo'); acentos quebrados na transcrição (r´ıtmico, Ass´ındeto, Ant´ıtese, impl´ıcita) valem c
DADO Pa7b6e203 (URCA 2027 PSU 2026.2/2027.1 (nov/2026) · questão 103): texto_da_prova e alternativas -> no print o enunciado começa por "43. (URCA/2027.1) Leia os três enunciados..." e os acentos aparecem corretos (a transcrição está com acentos quebrados)
DADO Pabdc1e4c (UNIRG 2022 Medicina 2022/1 · questão 9): texto_da_prova -> no print está 'horrível', com acento
DADO Pac9e8b3e (URCA 2025 2025.2 · questão 104): alternativas A -> "po- der" é só quebra de linha do print, a palavra é "poder"; texto_da_prova -> "dom´ınio" é "domínio" no print
DADO Pd5ab7316 (Unitins 2021 Vestibular 2021/1 · questão 32): A transcrição traz 'obre o poema de Eliane Potiguara' onde o print mostra '32- Sobre o poema de Eliane Potiguara'; a resolução não usa esse trecho, então nada muda.
DADO Pdfb1ef7e (UFJF 2023 PISM III · questão 9): O enunciado cita o verso como "um peito sem dureza!", com ponto de exclamação, mas no poema transcrito o verso termina em ponto. O título aparece como "Soneto XVVIII", numeração irregular. Nenhum dos 
DADO Pe3c9bfd7 (UTFPR 2024 Verão · questão 9): O texto transcrito omite o que está escrito dentro da tirinha: "GRR..." no primeiro quadro, "POW" no segundo e "THE END" no canto inferior direito do último quadro. A resolução usou as duas primeiras 
DADO Peb92d285 (UEMA 2022 PAES · questão 9): texto_da_prova -> no print, o parágrafo "Eles disseram que ela era generosa" abre um parágrafo separado; a transcrição o colou ao anterior
DADO Pf49f3f6b (Fatec 2026 1º semestre · questão 54): alternativas E -> 'onomatopeia.' apenas; o trecho 'Questão 54' que aparece colado nela é o título da questão no print
DADO Pf5b95e48 (UFRR 2026 Vestibular 2026 – Prova Integral · questão 6): No JSON, a alternativa E traz colado o enunciado do texto V ('Leia atentamente o texto V...'), que no print não faz parte da alternativa; a alternativa é só 'Mortalidade.'. As aspas do enunciado apare
DADO Pfb341f53 (UNIRG 2024 Medicina 2024/2 · questão 15): No enunciado do print o fragmento aparece como “’Pobre Alphonsus! Pobre Alphonsus’”, sem o ponto de exclamação final. No poema, o verso tem as duas exclamações. A resolução cita a forma do poema, que 
DADO Pff10eaf9 (Unitins 2025 Vestibular 2025/1 — Todos os Câmpus · questão 45): Na transcrição, os versos 'Papo reto, como esqueletos, de outro dialeto' e 'Só desafeto, vida de inseto imundo' aparecem colados numa linha só, assim como 'Nação sem teto...' e 'A cor de Eto...'. O tí

## 2026-11-19 20:40 UTC — PENDENCIAS (lotes por-0097 a por-0105) — session_01PveEKX1JnJpMCfgHmpRupU

As pendências questão por questão já estão em `docs/resolucoes/registro-por.json`
(`pendentes`), com prova, conteúdo e motivo, e a coordenação já abriu lotes
`por-pend-*` com elas. Este bloco traz **só o que o registro não carrega**: as
decisões que não são minhas e os problemas que se repetem em muitas questões.

### 1. Decisões que precisam da coordenação ou do dono

**P49978098 — EMESCAM 2022 Medicina 2022/1, questão 4 (P09.3, orações adjetivas).**
Três especialistas resolveram às cegas, sem ver a resposta um do outro, e os três
deram **A**. O gabarito que a prova publicou é **preliminar** e dá **B**. Pela
regra de 11/11/2026, o gabarito do Aprendice só vale quando bate com o
preliminar — não bate. A questão está fora, marcada como pendente. Ela parece
defeituosa (as duas leituras se sustentam). Decisão: **anular** (sai do banco de
vez) ou **esperar** gabarito definitivo da banca, se houver.

**P448cc999 — Viver é prejudicial à saúde, de Jamil Snege (UFPR/Gazeta).**
A prova não traz trecho nenhum: a resposta depende de lembrar quem são Joana,
Harry, Lucimara e Marcelo. Um agente procurou em fonte publicada (editora,
repositórios, Cândido/Biblioteca Pública do Paraná, Rascunho, Gazeta do Povo) e
só confirmou que o narrador-protagonista é arquiteto. Nada publicado descreve as
personagens. Sustentar a letra assim seria palpite com cara de fato.
Decisão: **só se resolve com o livro em mãos**, ou a questão fica fora.

**Pe350965f — Tribo Cara Baixa (Editora Kelps).**
Mesmo caso. A editora confirma tema e postura do autor e classifica o livro como
não ficção, o que já derruba duas alternativas; mas nada publicado descreve a
estrutura do livro ("pequenos textos cronísticos", a letra C) nem permite negar a
letra A. Decisão: **só com o livro em mãos**.

Nos três casos a pendência foi conferida por um agente que não escreveu a
resolução, e confirmada. Não são pendências de preguiça da fábrica.

### 2. Pendências de print: a resolução está pronta, falta a imagem

Oito questões ficaram fora por um defeito do print, não do conteúdo. **A resolução
inteira já está escrita e conferida**, guardada no `patch-*.json` do lote. Basta
refazer o print e aplicar o patch.

| Questão | Lote | O que falta no print |
|---|---|---|
| P8ce7e755 | por-0100 | o soneto de Gregório de Matos a que o enunciado se refere; está em `q/010.webp` da mesma prova |
| Pb3cab0df | por-0100 | o TEXTO II (Gregório de Matos, "Ao casamento de Pedro Álvares da Neiva") não está em print nenhum da prova (conferidos 004 a 011), só na camada de texto do PDF oficial |
| P875a491e | por-0100 | a FIGURA I (Pereda, *Alegoria da Vaidade*, 1634); está no rodapé de `q/008.webp` |
| P6b2a2eec | por-0101 | o poema "Eu, Marília, não sou algum vaqueiro"; o print tem só o comando e as alternativas |
| Pee5e3224 | por-0101 | o poema "Benze-se o poeta...", de Gregório de Matos |
| Pbdf66d29 | por-0101 | a canção de Erasmo Carlos que o enunciado manda comparar com o poema de Gonçalves Dias |
| P56bd4868 | por-0103 | os versos do texto de apoio; o print traz só "Texto para as questões 41 e 42", o comando e as alternativas |
| P63da1bf6 | por-0103 | o conto "A Sauna"; o print traz só o comando e as alternativas |

**Por que não resolvi juntando dois prints:** no banco, `print` é **um caminho só**
e `figura` é um booleano — o aluno vê **uma imagem por questão**. Um agente
chegou a recuperar o texto de apoio em prints vizinhos da mesma prova, e eu ia
aceitar as quatro resoluções; conferi o banco antes e devolvi três para pendente.
O texto de apoio tem de estar **dentro** do print da questão. Quem mexer no
gerador de prints precisa saber disso.

### 3. Questões de outra matéria caem em Português

As que achei estão no registro, uma a uma (Artes: P0aaed1c4, Pb2f7e5d3,
Pfc99ec33, Pbf58c381, P61c6a142; História: Peefa95fe; Filosofia: Pc401d7b0;
Química: P15e171f5).

O problema é maior que a lista. O `converte.py` conta hoje **156 questões do banco
nacional que são de outra matéria**: 109 de **Artes** e 47 de **Educação Física** —
matérias que o site não tem. Elas entram classificadas em Português porque pedem
leitura de um texto de apoio. Hoje ficam só no simulado da prova inteira, fora
dos exercícios, o que está certo; mas enquanto a classificação disser "por", elas
vão continuar entrando nos meus lotes e gastando crédito. Vale classificá-las
como `artes` / `edfis` na fonte, mesmo sem a matéria existir no site.

### 4. Subtemas que faltam em Português

Os 12 temas atuais (P01 a P12) não têm onde pôr três assuntos que as provas cobram:

- **fonologia e fonética** (contagem de fonemas, encontros, dígrafos) — hoje cai em
  P05.4 ou P07, que não é o lugar;
- **acentuação e ortografia** — hoje cai em P10 "Norma e emprego", misturada com
  regência e concordância;
- **Classicismo** (Camões) — P11 começa no Barroco.

Enquanto não existirem, essas questões viram RECLASS ou pendência de
classificação a cada lote. Também registro que **P05.4 e P06 viraram depósito**:
num levantamento de 100 questões desses dois conteúdos, 29 estavam classificadas
em lugar errado.

### 5. URCA: numeração e origem dos prints (princípio 10)

- **Deslocamento de numeração:** nas provas da URCA, o número da questão no print
  está **60 à frente** do número no `prova.json` em parte do caderno. Confirmei
  caso a caso nos lotes, mas é um defeito do levantamento da prova, não das
  questões: vale conferir o caderno inteiro de uma vez.
- **Origem dos prints:** os prints de algumas provas da URCA têm cara de
  compilação de terceiros (margem, marca d'água e recorte que não são do caderno
  oficial), não de PDF da banca. Pelo princípio 10 isso é decisão do dono, e eu
  só registro: **vale conferir de onde vieram antes de publicar**.

### 6. "Brasil Escola" no acervo: dois casos diferentes

**Caso 1 — registro de origem (não aparece ao aluno).** 94 arquivos `prova.json`
citam Brasil Escola nos campos `origem.*` e `nota`: é o registro de onde saiu o
PDF da prova, que o princípio 10 manda guardar. Conferi o código do site: nenhuma
tela lê `prova.nota` nem `prova.origem`. **Não chega ao aluno. Nada a fazer.**

**Caso 2 — a própria banca citou o site (aparece ao aluno).** 76 questões reais de
prova trazem "Brasil Escola" ou "Mundo Educação" **na citação de fonte que a banca
imprimiu** no enunciado: geo 25, bio 12, his 11, qui 7, **por 9**, fs 6, fis 5,
mat 1. As 9 de Português são Pda751756 (UDESC 2023/2), Ped215a60 (UNEMAT 2025/1),
P6bbd3303 (UTFPR 2024) e seis da Mackenzie 2026/1 (P4be591fb, Pc937c585,
Pc02ba2c3, Pf19fc0df, Pf734dcad, P9ac700db) — **todas já com resolução no ar**.
Isso não é questão de site didático: é questão de prova cujo texto de apoio a
banca tirou de um site. O nome está dentro da imagem do print e não dá para
apagar. Decisão do dono: **mantém** (é citação da banca, não nossa) ou **tira as
76**. Enquanto não houver decisão, elas seguem no ar.

### 7. O que a fábrica não pega (para quem for conferir os próximos lotes)

Depois de 12 lotes, o defeito que as lentes da API **não** pegam é a **leitura
invertida**: a resolução atribui a um personagem, a um texto ou a uma voz o que
pertence a outro, e cada afirmação isolada continua defensável. Exemplo:
`Pb9d8bba2`, em que a resolução atribuía aos sertanejos a falta de tática que o
texto diz da coluna do Exército — letra certa, citação literal, e **as duas lentes
de fatos assinaram**. Só a conferência humana (ou um agente com o print aberto)
pega isso.

O segundo defeito é o oposto: a fábrica **pede pendência demais**. Contando os
lotes, de 10 pendências pedidas, até 8 eram infundadas. É o defeito mais caro,
porque joga fora questão boa sem fazer barulho. Daí a regra: **toda pendência
passa por um agente que não escreveu a resolução** antes de virar pendência de
verdade.

Terceiro: a nota "OBRA: confirmar" que a lente deixa é **uma pista, não uma
ordem**. Numa delas (`Pe9950ce3`) a lente pediu para confirmar o **contrário** do
que a resolução, correta, dizia; obedecer teria estragado conteúdo certo.
