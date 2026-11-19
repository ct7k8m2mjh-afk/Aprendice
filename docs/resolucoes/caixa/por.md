
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

## 2026-11-19 20:16 UTC — ACABOU (pendentes, obras) — sessão de pendentes de obra
Lotes gravados: por-pend-0001 (23 ok, 2 pendentes), por-pend-0002 (25 ok), por-pend-0003 (25 ok), por-pend-0007 (5 ok, 1 pendente), por-pend-0009 (0 ok, 3 pendentes: as que sobraram, tentadas de novo).
Resolvidas: 78 das 82 pendentes por obra, todas com dois conferentes independentes e fontes registradas. Ficaram 4: 3 por obra (sem fonte confiável) e 1 com proposta de anular.
Pendências:
OBRA P448cc999: Viver é prejudicial à saúde (Jamil Snege). A biografia da UFPR (Fuchs, 2006) confirma parte do enredo, mas nenhuma fonte diz que Harry é o sócio nem esclarece Joana, Lucimara, Marcelo, o prefeito de Paranaguá ou Bariloche. Falta ler a novela.
OBRA P888a1ba3 (UDESC 2020.1 q38): a 5ª afirmativa (vertente política em O conto da mulher brasileira) decide entre A e B, e nenhuma edição, estudo ou resolução publicada a descreve. O blog Nave Literatura não serve e traz temas feministas e políticos.
OBRA Pd7b11d0e (UNIRG 2020/1 q12): Tribo cara baixa (Deusimar Pires). Nenhuma fonte acessível traz o que a crônica diz sobre a felicidade (tentados Kelps, Amazon/Kindle, Storytel, Indagação, imprensa do Tocantins, site da UNIRG).
ANULAR Pcfc26fc6 (UDESC 2025.1 q47): a II diz que Domingas é "nativa de Manaus", mas em Dois irmãos ela vem do Jurubaxi, perto de Santa Isabel do Rio Negro (revista Alere, Unemat); o gabarito E exige a II verdadeira
GABARITO Pba1d50a5 (Acafe Verão 2022 q11, A) e P65543cce (Acafe Verão 2022 q12, D): prova comentada e pareceres de recurso da Acafe mantêm A e D ("Manter a questão e o gabarito"); pode virar gabarito definitivo
GABARITO Pba1d50a5, P65543cce, P19846ee6 (Acafe Verão 2022 q11, q12 e a do Os Milagres do Cão Jerônimo): a Acafe publicou "Prova comentada" com A, D, C (https://storage.acafe.org.br/concurso/vestibular/2022/1/05%20-%20Provas/5.4%20-%20Prova%20comentada.pdf) e pareceres "Manter a questão e o gabarito"; a nota "sem gabarito publicado" está desatualizada — pode virar gabarito oficial. Gravadas como gabarito do Aprendice (resolvedor e conferente cego batem: A, D, C)
RECLASS Pce2b8e45 P12.4 -> P12.5 (Hatoum, Dois irmãos, literatura contemporânea)
RECLASS Pd0bacd15 P11.3 -> P12.5 (Fuvest 2022 q19)
RECLASS P10912a6c P04.2 -> P12.1 (UDESC 2020.1 q41)
RECLASS P64b3d9fa P12.4 -> P12.5 (UFPR 2024 q69, Quarto de despejo não é da geração de 45)
RECLASS Pec8254af P12.4 -> P11.3 (UFPR 2023 q50, Casa de Pensão é do Naturalismo)
RECLASS Pba1d50a5 P12.5 -> P11.4 (Acafe Verão 2022 q11)
RECLASS P3bd2c3bc P12.4 -> P12.3 (Rachel de Queiroz, Modernismo de 30)
RECLASS P9714da52 P03.1 -> P12.5 (UVA 2025.1 q5, Torto arado)
DADO P2c52f513: texto_da_prova -> o título "Texto 10" está antes da segunda coluna de falas; no print essas falas ("Isso dá certo lá no sertão…" até "não condene João") são do Texto 9 e o Texto 10 é só o cartaz do filme
DADO Pce2b8e45: alternativas -> campo vazio; no print: A V-F-F-F-F, B F-F-V-V-V, C V-V-F-V-V, D V-V-V-V-F, E F-V-F-V-F
DADO P81fafc63: alternativas.D -> "rejeição contundente" (o "15" no fim é o número da questão colado)
DADO P19faff2d: alternativas.D -> "a mentira é o degrau de todos os vícios" (o "16" no fim é o número da questão colado)
DADO P9882569d: alternativas.D -> termina em "(povo oyibo)."; a referência "(ADICHIE, C. N. No seu pescoço. ...)" é a fonte da questão e veio colada na alternativa
Testes: 786 passaram (converte, tsc e vitest verdes).

## 19/11/2026 20:19 UTC — ACABOU (pendentes, demais) — sessão de pendentes de Português (classificação, print, outra, gabarito, motivos soltos)
Lotes gravados: por-pend-0004 (14 ok), por-pend-0005 (6 ok), por-pend-0008 (4 ok); nas matérias novas: his-pend-0003 (2),
fs-pend-0002 (1), fs-pend-0003 (1), qui-pend-0002 (1), mat-pend-0003 (1), ing-pend-0003 (2), bio-pend-0003 (2).
Resolvidas: 35 (24 em Português + 11 reclassificadas e resolvidas na matéria nova). Todas conferidas por conferente independente.
Reclassificações JÁ APLICADAS no prova.json: P7a252a7f his H02.1, P47b890b0 his H04.8, Pc401d7b0 fs L08.2, P45330cff fs S03.3,
P15e171f5 qui Q08.6, Pb28d85a4 mat M14.2, Pb5cc8933 ing I01.8, P53983658 ing I01.10, Pb6aa2d50 bio B12.6, Pfa1a5f21 bio B02.5;
subtema de Português: Pd23309d1 P12.5, Pd0bef1cb P12.5, Pa7a2c5de P11.3, P61659fe2 P08.2, P59e81ce0 P12.1.
Outra matéria JÁ POSTAS em app/conteudo-fonte/outra-materia.json (confirmadas por especialista e conferente): Artes — Pc059bf56,
P82bbfc0a, P61c6a142, Pd2b4fc8b, Pbf58c381, P9c0bfb8d, Pac376d90, Pb7962540, P398e2a29; Educação Física — Pd7165e02.
Critério usado (dono vê a régua): questão de Linguagens com arte que se resolve só pelo texto verbal é Português (P5896fe96,
Pad8d070f, ENEM 2023, resolvidas); a que pede movimento, artista ou técnica sem leitura do texto é Artes.
Registro: tirei de registro-por.json 3 pendentes que já tinham resolução gravada na matéria nova (P41d362f2 fs, P8944ccb0 fis,
Pbdaf3ef9 geo). lote.py: --pendentes aceita prefixo exato com "=" (ex.: =a), senão "a" pegava "anular" e "o" pegava "obra".
Ficaram pendentes (4): ANULAR P93ec458e, P49978098, Pdaf43568 (para o dono decidir) e GABARITO Pb816c091 (abaixo).
Fora do meu alcance: P2cc479e5, P0aaed1c4, Peefa95fe (outra: Artes) e Pba73d27d (classificação: geo G05.1) estão no lote
por-0104, aberto por outra sessão; não mexi.
ANULAR P93ec458e (UDESC 2025 Inverno 2025.2 q44): gabarito definitivo D (https://vestibulares.estrategia.com/portal/wp-content/uploads/2025/06/udesc-2025-2-gabarito-definitivo.pdf) exige a 5ª proposição verdadeira, mas ela classifica a conjunção 'Mas' como 'adjunto adnominal' (conjunção não exerce função sintática; adjunto adnominal modifica substantivo). Pela gramática a sequência certa é F–V–F–F–F, que não está entre as alternativas.
ANULAR P49978098 (EMESCAM 2022/1 q4): sem gabarito definitivo na web (procurado em emescam.br, FUNDEP/gestaodeconcursos e buscas pelo enunciado). O preliminar B inclui a afirmativa II, que é falsa (transformar as adjetivas em orações substantivas mantém o período composto, contra o próprio comando). A única alternativa sem II é a A, mas ela exige IV falsa, e 'sem moradia' por 'que não têm onde morar' mantém o sentido. Nenhuma alternativa fecha com certeza.
PRINT P8ce7e755 (UFJF 2024 PISM III q9): texto de apoio (TEXTO III, soneto "Ao mesmo assunto", de Gregório de Matos, com glossário) está em app/conteudo-fonte/provas/ufjf-pism3-2024/q/010.webp e no PDF oficial logo antes da questão 9; juntar ao print 009.webp
PRINT Pb3cab0df (UFJF 2025 PISM III q7): texto de apoio (TEXTO II, "Ao casamento de Pedro Álvares da Neiva", de Gregório de Matos) está só no PDF oficial https://www2.ufjf.br/copese/wp-content/uploads/sites/42/2024/12/Pism-3-Saude-Dia-1.pdf, p. 6 (fim da coluna esquerda e topo da direita); nenhum q/*.webp o traz; juntar ao print 007.webp
PRINT P875a491e (UFJF 2025 PISM III q9): texto de apoio (FIGURA I, Pereda, Alegoria da Vaidade, 1634) está no rodapé de app/conteudo-fonte/provas/ufjf-pism3-2025/q/008.webp e no PDF oficial p. 7; juntar ao print 009.webp
PRINT P6b2a2eec (Unioeste 2022 q18): a prova não reproduz o poema (obra da lista de leituras); texto de apoio, a Lira I da Parte I de Marília de Dirceu, de Gonzaga (domínio público), está em https://digital.bbm.usp.br/bitstream/bbm/4717/1/009367-2_COMPLETO.pdf (ed. 1862) e https://www.portalsaofrancisco.com.br/?p=119514; juntar ao print
PRINT Pee5e3224 (Unioeste 2022 q21): a prova não reproduz o poema (obra da lista de leituras); texto de apoio, "Benze-se o poeta de várias ações que observava na sua pátria" (domínio público), está em Obras poéticas de Gregório de Mattos, t. I, 1882, p. 45-47, https://digital.bbm.usp.br/bitstream/bbm/3884/1/009589_COMPLETO.pdf; juntar ao print
PRINT Pbdf66d29 (UEMA PAES 2024 q4): texto de apoio (canção "Mulher (Sexo frágil)", de Erasmo Carlos) está em app/conteudo-fonte/provas/uema-paes-2024/q/003.webp (questão 03); juntar ao print 004.webp
PRINT Pe98ee5d0 (URCA 2026.1 q100): texto de apoio está no print da q98 da mesma prova (app/conteudo-fonte/provas/urca-2026-1/q/098.webp, poema 'Carta a Stalingrado', de Drummond, id P74ed0f28); juntar ao print
PRINT Pfeeca942 (Unespar 2024 Grupo I q17): texto de apoio está no print da q16 da mesma prova (app/conteudo-fonte/provas/unespar-2024/q/016.webp, trecho de O filho eterno, até a fonte 'TEZZA, Cristóvão'); juntar ao print
PRINT P59e81ce0 (UPE SSA3 2024 q7): texto de apoio está nos prints da q4 (Texto 2, Auto da Compadecida) e da q5 (Texto 3, Clara dos Anjos) da mesma prova (app/conteudo-fonte/provas/upe-ssa3-2024/q/004.webp e 005.webp); juntar ao print
PRINT P61659fe2 (URCA 2026.1 q96): texto de apoio está no print da q95 da mesma prova (app/conteudo-fonte/provas/urca-2026-1/q/095.webp, fragmento de Fanon, 'Racismo e Cultura'); juntar ao print
PRINT Pdaf43568 (UNEMAT 2024/1 q26): texto de apoio está no caderno oficial, p. 12, sob 'As questões 26 e 27 tomam como base o excerto a seguir' (Clarice Lispector, Perto do coração selvagem); juntar ao print (vale também para a q27, Pe5c2001b). A questão sai como ANULAR (ver motivo)
ANULAR Pdaf43568 (UNEMAT 2024/1 q26): gabarito D (todas corretas) exige aceitar trocas de tempo verbal 'sem mudança de sentido' que mudam o sentido (II e III); ver motivo
GABARITO Pb816c091 (URCA 2024.1 q105): oficial C (13) depende de confirmar as afirmativas I e II; a III é de Machado de Assis, não de Castro Alves; conferir em Antonio Candido, Formação da literatura brasileira
PRINT P56bd4868 (Unitins 2025/2 q42): texto de apoio está em app/conteudo-fonte/provas/unitins-2025-2/q/041.webp (poema de Drummond, Alguma poesia, "Gastei uma hora pensando um verso..."; prova.json q41, transcrição); juntar ao print
DADO P2e08b381 (Unicamp Indígena 2022 q13): area -> prova.json marca 'Matemática', mas é leitura de texto (Português); resolvida em por P01.2
DADO P112c6236 (UNEMAT 2022/2 q32): area -> prova.json marca 'Biologia', mas é gramática (haver impessoal); resolvida em por P10.1
OBRA P63da1bf6 (ITA 2021 q25): resolvida com conhecimento do conto 'A sauna' (Seminário dos ratos), epítetos confirmados em dissertação da UEL (2024); fontes na questão
DADO Pb28d85a4 (Fuvest 2026 q13, agora mat M14.2): alternativas.E -> sem o "#####" final, que não está no print
## 2026-11-19 21:30 UTC — PENDENCIAS (lote por-0105) — session_01PveEKX1JnJpMCfgHmpRupU

48 resoluções gravadas em 17 provas; 2 pendentes. Três conferentes
independentes abriram os prints e devolveram 33 achados, todos aplicados ou
decididos. O que precisa da coordenação:

### RECLASS (a classificação da questão está errada no `prova.json`)

| Questão | Hoje | Deveria ser | Por quê |
|---|---|---|---|
| P709b03ee | P12.5 literatura contemporânea e autores africanos | **P12.1** Pré-Modernismo | É de *Os Sertões*, Euclides da Cunha. Deixei os `equivocos` apontando P12.1, que é onde o aluno precisa voltar na revisão, e não mexi na classificação da questão, que não é minha. |
| P5335b921 | P12.5 | **P06.1** figuras de linguagem (a conferir) | A questão decide pela leitura da metáfora (a árvore espoliada = o sujeito periférico). Os `equivocos` ficaram em P06.1. O conferente não fechou qual é o certo: os dois se defendem. |
| Pfc99ec33 | P01.2 (Português) | **Artes** ou Português — duas leituras | O resolvedor da fábrica recusou duas vezes, por entender que a questão pede característica estilística do Maneirismo. O conferente, com o print aberto, sustenta que é leitura de texto e imagem: o enunciado já diz que a obra é maneirista, C e D só repetem o Texto II, A é comum à pintura clássica, E se desmente no print e B se vê na imagem. Gabarito oficial B. **Fica pendente até a coordenação decidir.** |

Em P204666bc os `equivocos` apontavam P01.2 e a questão é P12.5: corrigi os
três para P12.5. Esse defeito manda o aluno para o conteúdo errado na revisão
espaçada, e é o mesmo que já apareceu em lotes anteriores — vale olhar nos
lotes das outras matérias.

### Pendentes que continuam fora

- **Pe350965f** (*Tribo Cara Baixa*, UNIRG 2021 q12) — pendência **confirmada**
  por dois agentes em separado. O print não traz uma linha da obra e não há
  caminho por eliminação. Um deles procurou o título na web, inclusive junto
  às leituras obrigatórias da UNIRG, e não achou nenhuma página sobre a obra,
  o autor ou a estrutura do livro. Ou alguém lê o livro e registra a fonte, ou
  a questão sai do banco nacional.
- **Pfc99ec33** — acima, à espera da decisão de matéria.

### Duas pendências que a fábrica pediu e não se sustentavam

Pb2f7e5d3 (ENEM 2020 q25, Kosuth) e Pfc99ec33 foram declaradas pendentes pelo
resolvedor **antes de ele escrever qualquer resolução** — e por isso, quando o
conferente derrubou a pendência, não havia nada para aprovar. Pb2f7e5d3 foi
resolvida depois (letra A, igual ao gabarito oficial) e passou pela lente de
fatos por US$ 0,11. É o defeito mais caro da fábrica: ela desiste cedo e
descarta questão boa sem fazer barulho.

### Divergência entre conferentes, resolvida por regra

Em P4bb69996 e P709b03ee o conferente pediu `fontes` para dados de obra que o
print não traz: Mia Couto moçambicano, Baltasar Lopes cabo-verdiano, Lídia
Jorge portuguesa, a divisão de *Os Sertões* em "A Terra", "O Homem" e "A Luta".
O agente de obras já havia decidido o contrário, invocando a regra 5 do
`CONFIRMA-OBRAS`: fato consolidado de livro didático não precisa de fonte.
**Mantive a decisão do agente de obras**, porque a regra é expressa. Registro
para quem quiser rever a regra: ela é a fronteira entre "não enche a resolução
de referência óbvia" e "o aluno não tem como conferir".

### O que a conferência pegou e as lentes da API não

Uma **leitura invertida** em Pb02b7c85 (*O Homem Duplicado*): a `checagem`
dizia que António Claro impõe uma noite com Maria da Paz, "namorada de
Tertuliano, **que consente**" — e na obra quem cede é Tertuliano (entrega
roupas, documentos e chaves do carro); Maria da Paz é enganada e só descobre
depois. Letra certa, as duas lentes de fatos assinaram, e o sentido estava
trocado. Mais duas trocas de sujeito do mesmo tipo em Pe16dc549 ("quem
vasculha arquivos é o filme" em vez de Petra) e Pb269f53f.

Também dois casos de **justificativa circular**: `passos[3].porque` e
`erradas.C` de Pb02b7c85 sustentavam a afirmativa pelo gabarito ("a banca a deu
por correta"), que não ensina nada ao aluno. Trocados por fato da obra.

### Observação da fábrica para quem mexer nos prints

Em 5 questões da parte 2 (P66f51545, P8c683f2c, Pb269f53f, Pe16dc549,
Pf0dda522) o campo `figura` está marcado como verdadeiro, mas o print não tem
figura nenhuma: é só texto, e as cinco têm `texto_da_prova`. Pelo princípio 1,
questão de prova só de texto deve aparecer **escrita**, copiada da camada de
texto da prova, não como print. Não é defeito da resolução; é do levantamento
da prova.

## 2026-11-19 22:15 UTC — PENDENCIAS (lote por-0106) — session_01PveEKX1JnJpMCfgHmpRupU

50 resoluções gravadas em 18 provas, **zero pendentes e zero divergências** — o
primeiro lote assim. 60 achados de três conferentes e 11 patches do agente de
obras, todos aplicados. 19 fontes acadêmicas novas em 7 questões.

### RECLASS: 12 questões classificadas pelo assunto do texto, não pelo que cobram

Dois agentes abriram o print de cada uma e decidiram em separado. Em todas
estas o **prefixo dos equívocos está certo** (é o conteúdo que o aluno precisa
rever) e a **classificação da questão** é que erra. Os prefixos ficaram onde
estão; a reclassificação é da coordenação.

| Questão | Prova | Hoje | Deveria ser | Por quê |
|---|---|---|---|---|
| P23d99f05 | UDESC 2024.2 q50 | P03.2 gêneros jornalísticos | **P01.2** explícito × inferência | É um conto de Alê Motta, não notícia nem editorial; o que separa as alternativas é o dito × o inferido |
| Pd5c729d0 | UDESC 2024.2 q48 | P03.2 | **P04.1** referência e substituição | Uma crônica de Rubem Braga; o que decide é achar referentes ("cujo", "destes" = os Estados) |
| P497ef33d | UDESC 2024.2 q49 | P03.2 | **P03.1** tipos textuais | Conto de Alê Motta; as proposições julgam a construção narrativa |
| Pa8250845 | UEL 2022 q42 | P03.2 | **P07.3** verbo: tempo, modo, aspecto | Crônica de Scliar só como suporte; as quatro afirmativas julgam tempos verbais |
| P930b3687 | PUC-SP 2024 Verão q44 | P12.2 Modernismo de 1922 | **P01.4** finalidade e interlocutor | Mário de Andrade é só o autor do texto; o comando pede o recurso que envolve o leitor (o "você") |
| P25f6f6ef | ENEM 2020 q41 | P12.1 Pré-Modernismo | **P05.4** variação, registro e adequação | O comando pergunta por que a petição do Policarpo usa a norma-padrão |
| Pb5f2a603 | PUC-SP 2026 q43 | P11.4 Parnasianismo e Simbolismo | **P01.1** tema, tese e ideia principal | A classificação veio do sobrenome: o simbolista é o pai, Alphonsus de Guimaraens; João Alphonsus é prosador modernista |
| Pf811f664 | UEL 2022 q40 | P12.4 Geração de 45 | **P05.4** | As afirmativas julgam oralidade, variedade do grupo social e preconceito linguístico |
| P568ad8ee | UFPR 2025 q67 | P12.4 Geração de 45 | **P12.5** contemporânea | *Poema sujo*, de Ferreira Gullar, escrito no exílio em 1975 |
| Pa930e66b | FMABC 2024 q14 | P01.2 inferência | **P01.1** | O comando pede a citação que sintetiza a concepção de ciência, ideia que o texto enuncia |
| Pc086241b | UPE 2022 SSA3 q12 | P07.2 | **P05.1** sentido da palavra no contexto | Nenhuma alternativa trata de pronome: julgam o "como" comparativo, a perífrase, a preposição |
| Pfef78288 | UFU 2023 q55 | P02.2 | **P05.4** | As alternativas tratam de registro e interação |

Em outras 3 (P62bced19, P9605fc0c, Pb23f5e86) era o prefixo que estava errado e
já corrigi: 7 prefixos alinhados.

**O padrão vale para as outras matérias.** Em 15 das 50 questões deste lote o
código vinha do assunto do texto de apoio — literatura, porque o texto saiu de
um romance — e não do que a questão cobra do aluno. Pus a verificação no
`confere_amostra.py`: ela aponta sozinha, em todo lote, o prefixo que não bate.
No por-0107 apontou 27 das 50.

### Dois defeitos de dados de prova (não mexi: é texto de questão)

1. **Pd83d608f** (`alternativas.E`, que é **a alternativa correta**) termina com
   lixo de extração **`, j p p`**, que não está no print. O aluno vê isso hoje.
   Texto limpo, conferido contra o print: `"j p p"` sai e o resto fica como está.
2. **Pd83d608f** (`texto_da_prova`): os 14 versos de Pessoa vêm num bloco único,
   sem as quatro estrofes do print (4+4+4+2) — e os passos da resolução falam em
   "a 1ª e a 2ª estrofes". Princípio 1.
3. **Pf3d20973**: o print traz em negrito as expressões que a questão compara
   ("senso comum", "imaginário popular", "embranquecimento") e a transcrição
   perdeu todos. Princípio 1. O conferente não escreveu a correção para não
   introduzir erro redigitando o artigo.

Em quatro questões da parte 3 e duas da parte 2 a `texto_da_prova` está
corrompida ou truncada (a da PUC-SP vem em fonte codificada). Os conferentes
resolveram pelo print nas seis. Vale uma passada na extração dessas provas.

### A cadeia de conferência funcionou uma vez de forma visível

Em P13ee722b (*O drible*) a resolução dizia que Merequendu era a cidade de
Peralvo **e não** de Murilo Filho. O conferente achou a inversão e reescreveu; o
agente de obras, depois, confirmou na resenha de Valdemar Valente (*Estudos de
Literatura Brasileira Contemporânea*, n. 45, 2015) que os dois vieram de
Merequendu — ou seja, o texto corrigido é o certo, e o original estava errado.
As duas lentes de fatos da API tinham assinado a versão errada.

## 2026-11-19 22:50 UTC — PENDENCIAS (lote por-0107) — session_01PveEKX1JnJpMCfgHmpRupU

49 resoluções conferidas (três conferentes, 24 achados aplicados), 1 pendente.
O lote espera só a confirmação de obras para gravar.

### O número que importa deste lote: 22 RECLASS em 50 questões

O verificador novo apontou 27 questões com o prefixo de conteúdo fora do lugar.
Um agente abriu o print de cada uma. **Em nenhuma das 27 o conteúdo da questão
se mostrou o certo.** Onde havia divergência, o prefixo — escrito por quem leu
letra a letra — estava certo, e a classificação da questão estava errada.
Resultado: **22 RECLASS, 5 "deixar como está"** (divergência legítima entre
letras, porque os erros são de conteúdos diferentes), **0 prefixos a mudar**.

| Questão | Prova | De | Para |
|---|---|---|---|
| P778db3ab | UFU 2023 q63 | P12.5 | **P06.2** figuras de pensamento |
| Pe4921648 | UDESC 2026.1 q44 | P12.5 | **P06.3** figuras de som e construção |
| Pc1f664ef | UDESC 2026.1 q49 | P12.5 | **P05.4** variação linguística e registro |
| Pb7f48a1b | UNEMAT 2025/1 q27 | P01.1 | **P01.4** finalidade e interlocutor |
| Pe11dd740 | URCA 2025.1 q94 | P01.2 | **P01.1** tema, tese e ideia principal |
| Pc03d1d53 | Unifor 2026.1 q47 | P01.2 | **P07.4** formação de palavras |
| P6e3ec418 | PUCRS 2025 q26 | P02.1 | **P01.2** explícito × inferência |
| Pee7ebaca | UEG 2020/1 q7 | P02.1 | **P10.4** pontuação (travessão duplo) |
| P7623eae7 | UEG 2022/2 q8 | P02.1 | **P04.3** parágrafo e ordem das ideias |
| P8bbbd1e8 | UEG 2020/1 q8 | P02.2 | **P04.2** conjunções e relações lógicas |
| Pd1493c31 | PUCRS 2025 q29 | P02.3 | **P10.2** regência e crase |
| P3c3bc969 | FCM-MG 2025.1 q5 | P06.1 | **P06.2** figuras de pensamento (ironia) |
| P99058e57 | UEG 2024/1 q12 | P07.4 | **P01.2** explícito × inferência |
| Pb2f84ba3 | FCM-MG 2025.1 q4 | P08.3 | **P08.1** sujeito e predicado |
| Pe453ba3f | UERR 2026 q3 | P08.3 | **P07.1** classes de palavras |
| P532d099f | Unifor 2026.1 q50 | P09.3 | **P08.1** oração sem sujeito ("havia") |
| P85e9b021 | ITA 2020 q17 | P11.3 | **P12.3** Modernismo de 30 (São Bernardo) |
| P22ef923d | ITA 2020 q25 | P11.3 | **P01.2** explícito × inferência |
| P355dbff2 | PUCRS 2025 q52 | P11.4 | **P12.3** Cecília Meireles, 1942 |
| Pea87c782 | ITA 2022 q19 | P12.1 | **P10.5** discurso direto, indireto e indireto livre |
| P2cfe736f | ITA 2022 q20 | P12.1 | **P02.2** ponto de vista e marcas de opinião |
| P6033d517 | PUCRS 2025 q56 | P12.1 | **P12.5** contemporânea (Conceição Evaristo) |

**O padrão, em uma frase: literatura virou lixeira de classificação.** Oito
questões foram para P11/P12 só porque o texto de apoio era literário — ITA com
Graciliano Ramos ficou em "Machado de Assis", Cecília Meireles de 1942 ficou em
"Parnasianismo", Conceição Evaristo ficou em "Pré-Modernismo". Em três delas o
comando nem era de literatura: era discurso indireto livre, ponto de vista do
narrador e inferência. E o inverso também ocorre: três questões em P12.5 eram
figuras de som, figuras de pensamento e variação linguística, classificadas pelo
autor contemporâneo do texto de apoio.

Somando com o por-0106, são **34 RECLASS em 100 questões**, todos decididos com
o print aberto. Vale rodar o verificador nas outras matérias: ele está em
`ferramentas/fabrica/confere_amostra.py` e não custa nada.

### A pendência: Pedde3b3b (UFJF 2025 PISM III q5) — print

Esta merece ser contada porque o motivo mudou duas vezes.

A fábrica a devolveu como "a API não devolveu resposta válida". O conferente
abriu o print, teve de **fatiá-lo para ler** (8340 px de altura) e devolveu a
pendência como **errada**: segundo ele, o print traz o Texto I e o Texto III, e
as letras A, B, C e E caem com o que está neles, sobrando D.

Fui ver por que a API não respondeu: **o print passa do limite de 8000 px por
lado que a API aceita**, e o pedido voltava 400 — não era questão difícil nem
falha passageira. Corrigi a fábrica (reduz o print antes de enviar, em PNG sem
perda) e mandei resolver de novo. Com o print inteiro à vista, o resolvedor
devolveu pendência outra vez, agora por outro motivo, e com razão: **falta o
Texto II no print**, e a letra D afirma coisas sobre ele.

Então ela fica pendente **por print**, como as outras oito que já estão nesta
caixa, e não por falha de API. Entra quando o print trouxer os três textos.

### Dois buracos da fábrica fechados por causa disso

1. `garante_resolvedor`: questão que não volta do batch é refeita fora dele antes
   de virar pendente. Antes saía como pendência com motivo errado, e a
   conferência, sem saber, lia como questão difícil.
2. `imagem()` mede o print e reduz o que passa de 8000 px, avisando no log.

## 2026-11-19 21:15 UTC — AVISO — coordenação

RECLASS aplicados: 34 (lotes por-0106 e por-0107), só `tema`/`conteudo` no prova.json; ids e resoluções intactos.
Todos os códigos "Para" existem nos conteúdos de Português; nenhum "De" divergia do que estava gravado.
por-0106 (12): P23d99f05, Pd5c729d0, P497ef33d, Pa8250845, P930b3687, P25f6f6ef, Pb5f2a603, Pf811f664, P568ad8ee,
Pa930e66b, Pc086241b, Pfef78288.
por-0107 (22): P778db3ab, Pe4921648, Pc1f664ef, Pb7f48a1b, Pe11dd740, Pc03d1d53, P6e3ec418, Pee7ebaca, P7623eae7,
P8bbbd1e8, Pd1493c31, P3c3bc969, P99058e57, Pb2f84ba3, Pe453ba3f, P532d099f, P85e9b021, P22ef923d, P355dbff2,
Pea87c782, P2cfe736f, P6033d517.
converte.py, tsc e vitest (791 testes) verdes.

Medição (sem aplicar) da regra `equivocos_fora` do confere_amostra.py sobre as resoluções gravadas em
app/conteudo-fonte/provas: questões apontadas / resoluções — por 405/4478 (já sem estes 34), bio 409/2659,
qui 557/2688, mat 248/3058, fis 159/2769, geo 263/2565, his 210/2454, ing 4/2509, fs 6/1573.
