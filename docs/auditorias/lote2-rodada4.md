# Auditoria separada — lote 2, rodada 4 (23 provas)

Data: 06/11/2026. Auditor separado (não fez a integração). Nada foi corrigido; este arquivo só lista defeitos.

Provas auditadas (`app/conteudo-fonte/provas/`): ufsm-2025, ufsm-2026, unemat-2022-2, unemat-2023, unemat-2024-1,
unemat-2025-1, unemat-2026-1, unimontes-2024, unimontes-2025, unespar-2023, unespar-2024, unespar-2026, urca-2023-1,
urca-2023-2, urca-2024-1, urca-2024-2, urca-2025-1, urca-2025-2, urca-2025-3, urca-2026-1, ueg-medicina-2024-2,
ueg-medicina-2025-2, ueg-medicina-2026-1.

## Como foi conferido

- **Amostra**: 8 questões sorteadas por prova (semente fixa 20261106) + todas as de inglês da URCA (106–120) =
  **301 questões**. Prints abertos e lidos (montagens com o rótulo de matéria/tema/conteúdo/nível ao lado).
- **Gabarito (b)** e **anuladas (f)**: conferidos em **todas as 1.758 questões**, lendo a camada de texto do PDF oficial
  em `fabrica_saida/ingestao/<prova>/` (UEG Medicina conferida também pela imagem do gabarito, por causa da linha
  de inglês 1–5 que fica abaixo da de espanhol).
- **Varreduras automáticas em todas as questões**: texto de apoio citado e presente (inglês da URCA), print com tinta
  encostada na borda (corte), áreas em branco grandes, transcrição com acento solto, cabeçalho e fórmula.
- **Transcrição (d)**: comparada com o print em todas as questões transcritas da amostra (34 fora da URCA, 133 da URCA).

## Taxa de erro por tipo

| Tipo | Base | Defeitos | Taxa |
|---|---|---|---|
| (b) gabarito diferente do oficial | 1.758 (todas) | 0 | 0% |
| (f) anulada no site / válida fora | 23 provas (todas) | 0 | 0% |
| (a) print — grave (corte de dado, texto de outra questão, texto de apoio faltando) | 301 amostra | 6 | 2,0% |
| (a) print — acabamento (área em branco grande, resto de outra coluna) | 301 amostra | 3 | 1,0% |
| (c) conteúdo/matéria errados (questões gerais) | 184 sorteadas | 14 | 7,6% |
| (c) conteúdo errado (inglês URCA) | 117 | 9 | 7,7% |
| (d) transcrição — URCA | 133 da amostra (438 no total) | 133 (438) | **100%** |
| (d) transcrição — demais provas | 34 | 6 | 18% |
| (e) título/fase da prova | 23 provas | 1 | 4% |
| rótulo de área do simulado | 23 + 13 UEG geral | ver seção própria | — |

## Defeitos graves

### G1. URCA — todas as 438 transcrições estão quebradas (tipo d)

O site mostra a transcrição no lugar do print por padrão (`QuestaoCartao.tsx`, `q.transcricao && !original`), então o
aluno lê esse texto. Em **todas** as 438 questões transcritas das 8 provas da URCA:

1. **Acento solto** (387 de 438): "Hist´oria", "cidad˜aos", "deposic¸˜ao", "berc¸o", "´e", "`a" (crase), "ˆe". A nota
   da rodada diz que o acento foi juntado só no campo `texto` (busca, `recorta.texto()`); o campo `transcricao` não
   passou pela mesma correção. Certo: "História", "cidadãos", "deposição", "berço", "é", "à".
2. **Resto do cabeçalho no início** (313): o 1º parágrafo começa com "/2023.1) …", "**/2024.2) …",
   "**2025.2/2026.1) …" (sobra de "NN. (URCA/2023.1)"). Certo: começar no enunciado, sem o número/rótulo.
3. **Parágrafo partido no meio da frase** em parte delas (ex.: urca-2023-1 #4: "Dessa" sozinho alinhado à direita;
   urca-2024-2 #72: "Ap´os a" à direita e o resto em outro parágrafo).
4. Hifenização perdida: urca-2023-1 #8 alt. B "situase" (certo "situa-se").
5. Símbolo trocado: urca-2025-2 #117 "pay C5", "a C2 fee" (no caderno é €5 e €2).

Exemplos conferidos com o print: urca-2023-1 #4, #8; urca-2024-2 #63, #72; urca-2025-3 #61, #66, #89;
urca-2026-1 #73, #77. Correção: refazer a transcrição da URCA com a mesma junção de acentos do `texto()`, cortar a
âncora "NN. (URCA/…)" e rever a junção de parágrafos; até lá, desligar a transcrição dessas 438 (fica o print).

### G2. URCA 2025.1 — questões 57–60 (site 117–120) levam o texto de outra questão (tipo a)

O print de 117, 118, 119 e 120 começa com "Texto 5 – Questão 56" (texto de apoio que é só da 56). Nenhuma delas usa
esse texto: a 57 tem a própria tirinha, a 58 traz as dicas, a 60 traz a frase de Naisbitt. Além disso a **119** (Q59:
"A palavra *major*, penúltima linha do último parêntese da Questão 58") precisa do texto da **Q58** e não o tem.
Certo: 117, 118 e 120 sem o Texto 5; 119 com o enunciado da Q58 anexado (como em `anexa`).

### G3. URCA 2023.1 #118 (Q58) — falta o Texto 3 citado (tipo a)

"Quando comparado ao caso de racismo relatado no **Texto 3**, esse caso do Texto 5…": o print só tem o Texto 5.
Certo: juntar o Texto 3 (questões 53–54) ao print, antes do Texto 5.

### G4. URCA 2023.2 #16 — print cortado no topo (tipo a)

Os numeradores das raízes √(5/7) e √(7/5) estão cortados na borda de cima (só aparece metade do 5 e do 7). O dado da
questão fica ilegível. Certo: recortar com margem acima da 1ª linha.

### G5. URCA 2024.2 #16/#17 — fórmula da 17 dividida entre dois prints (tipo a, fora da amostra, achado na varredura)

O pé do print da 16 traz o começo da fração de x (√5 − √2) da questão 17; o print da 17 começa com o numerador cortado.
Certo: a fração inteira só no print da 17.

### G6. UEG Medicina 2026/1 #4/#5 — tirinha da 5 dividida (tipo a, fora da amostra, achado na varredura)

O print da 4 termina com "Leia e observe o cartoon a seguir." e a faixa de cima da tirinha; o print da 5 começa com a
tirinha cortada no alto (placa "PHYSICIAN CONFERENCE") e sem a instrução. Certo: instrução e tirinha inteira só na 5.

### G7. Unespar 2023 #33 — fórmula estrutural transcrita (tipo d, princípio 1)

A transcrição tem a cadeia carbônica desenhada virada em parágrafos "C", "C", "H", "H", "C"… — proibido transcrever
fórmula. Certo: sem transcrição (fica o print).

### G8. UEG Medicina 2026/1 #46 — matéria errada (tipo c)

Questão sobre a nova organela "hemifusoma" (vesículas, bicamada, ribossomos) classificada como **qui Q12.4**. Certo:
**bio B01.4** (sistema de endomembranas).

## Demais defeitos

### Prints (tipo a)

| Prova | Questão | O que está errado | Certo |
|---|---|---|---|
| urca-2023-1 | 68 | print com ~1.280 px vazios no fim (só o fio da coluna) | cortar após a alternativa E |
| urca-2023-1 | 120 | ~800 px vazios no fim | idem |
| ufsm-2025 | 18 | dois "0" soltos à direita da tirinha (resto da outra coluna) | apagar |
| unespar-2024 | 32 | arco decorativo da página no canto superior direito | apagar (`apagar`) |

Varredura em todas as questões (área em branco ≥ 350 px; acabamento, não perde conteúdo): ufsm-2025 49;
unemat-2022-2 17, 27; unemat-2025-1 35; urca-2023-1 60, 68, 75, 90, 120; urca-2023-2 60, 120; urca-2024-1 6, 59;
urca-2024-2 2, 3, 60, 63, 105, 120; urca-2025-1 5, 60, 75, 120; urca-2025-2 105, 120; urca-2025-3 60; urca-2026-1 105, 120.

Observação (erro do próprio caderno, não da integração): UNEMAT 2025/1 #6 tem as letras impressas "(A), (A), (B), (D)" e
#13 "(A), (B), (C), (E)" — os botões do site são A–D; vale uma nota na questão para o aluno não se confundir.

### Classificação (tipo c)

| Prova | Questão | Está | O que a questão cobra | Certo |
|---|---|---|---|---|
| urca-2023-1 | 98 | P01.2 | valor de "e sim" como conjunção coordenativa e a vírgula | P09.1 |
| ufsm-2025 | 12 | B07.1 (quatro tecidos) | exercício físico e saúde (V/F sobre texto) | B10.5 ou B07.4 |
| unemat-2024-1 | 34 | I01.3 | sentido do conectivo *Yet* | I03.2 |
| unemat-2026-1 | 27 | P07.1 | "embora" = conjunção subordinativa concessiva | P09.4 |
| unemat-2026-1 | 28 | P09.1 (coordenação) | classificar oração subordinada adjetiva | P09.3 |
| unemat-2026-1 | 29 | P01.2 | reescrita com "dos quais / que / onde / em que" | P10.2 (ou P07.2) |
| unespar-2024 | 26 | F02.1 (velocidade média) | radar por bobina no asfalto (indução de Faraday) | F12.4 |
| ueg-medicina-2024-2 | 59 | Q12.5 | massa de CO por PV = nRT | Q06.2 |
| ueg-medicina-2026-1 | 45 | B10.1 (viroses) | esquistossomose e teníase | B10.4 |
| ueg-medicina-2026-1 | 46 | qui Q12.4 | organela hemifusoma | bio B01.4 (G8) |
| ueg-medicina-2026-1 | 49 | B05.6 (biotecnologia) | características dos basidiomicetos | B12.2 |
| unimontes-2024 | 30 | B12.5 | filogenia (baleias, crocodilos, equinodermos, cefalópodes) | B12.6 |
| urca-2024-1 | 97 | P06.3 (figuras de som) | contar fonemas | sem conteúdo exato: só o tema ou conteúdo novo (decisão) |
| urca-2025-1 | 32 | Q04.3 (estequiometria) | escolher vidrarias para titulação | sem conteúdo exato: só o tema |

Inglês da URCA: 115 das 117 estão em **I01.3** (informação explícita). Erradas na conferência:

| Prova | Questão | Cobra | Certo |
|---|---|---|---|
| urca-2025-1 | 108 | sinônimos de *hugely* | I02.1 |
| urca-2025-1 | 119 | sinônimo de *major* | I02.1 |
| urca-2025-2 | 112 | a que se refere *their* | I03.1 |
| urca-2025-2 | 113 | a que se refere a expressão (referência) | I03.1 |
| urca-2025-3 | 108 | "leveraging their authority" é sinônimo de | I02.1 |
| urca-2025-3 | 115 | metáfora "eye watering earnings" | I02.4 |
| urca-2026-1 | 107 | sinônimo de *figures* | I02.1 |
| urca-2026-1 | 112 | *such as* é sinônimo de | I03.2 |
| urca-2023-1 | 106, 108 | inferência ("Não fosse pelo futebol…", "inspirar jovens") | I01.4 |

Nível no inglês da URCA: questões do mesmo tipo (localizar informação literal no texto) vão de 2 a 8 sem critério
visível — ex.: urca-2023-1 #112 nível 8, #111 nível 7 e #116 nível 3, todas de localizar um fato. Rever o nível das
117 com a mesma régua.

### Transcrição fora da URCA (tipo d)

| Prova | Questão | O que está errado | Certo |
|---|---|---|---|
| unespar-2023 | 33 | fórmula estrutural transcrita (G7) | sem transcrição |
| unemat-2026-1 | 13 | alternativas são equações (2.000x + 1.500y = 1.000.000…) — fórmula | sem transcrição (regra do princípio 1) |
| unemat-2026-1 | 27 | "da Expedição" isolado à direita; fonte e enunciado ("O termo 'embora'…") no mesmo parágrafo | parágrafos como no caderno |
| unemat-2026-1 | 6 | referência "GODOY, L; …" e o enunciado colados ao texto, sem alinhamento próprio | fonte em parágrafo à direita; enunciado separado |
| unemat-2023 | 35 | assertiva V partida ("o que a outra pessoa disser." centralizado); título em itálico partido em 2 parágrafos | V inteira; um parágrafo só |
| unemat-2023 | 28 | "Considerando o excerto acima do livro de Clarice" / "Lispector, analise…" em 2 parágrafos | um parágrafo |
| unimontes-2024 | 15 | as 4 estrofes do poema viraram um bloco só (sem linha entre estrofes) | manter as estrofes |

(Na UNEMAT 2026/1 #27, o "¬icia" do link está assim no PDF oficial — não é erro da transcrição.)

### Fonte, título e ano (tipo e)

| Prova | O que está errado | Certo |
|---|---|---|
| unemat-2023 | título "UNEMAT 2023", fase "2023" | o caderno e o gabarito dizem **Concurso Vestibular 2023/2** → "UNEMAT 2023/2", fase "2023/2" (id não muda) |

Links, bancas, totais e números das questões (inclusive "NN (2º dia)" da URCA) conferem nas 23 provas.

Observação para o comando 14: a nota da rodada diz que na UFSM 2026 "a 40 da Prova 3 é comum"; o gabarito oficial dá
respostas diferentes para a 40 em espanhol (E) e inglês (D), então a 40 é da língua. O site usa a do inglês (D),
que está certa — só a nota está imprecisa.

## Rótulo de área do simulado

**Confirmado:** nas 13 provas da UEG geral (ueg-2020-1 … ueg-2026-2) **todas as questões** têm `area: "Inglês"`
(ex.: ueg-2024-1: 52 questões, todas "Inglês"; a matéria/conteúdo de cada uma está certa). Também está assim em
`app/public/conteudo/provas/indice.json` (`areas: {"Inglês": 52}`).

Onde aparece no site:
1. **Lista de provas e de simulados** (`telas/Provas.tsx` e `telas/Simulados.tsx`, `cs-mats`): o cartão da UEG mostra
   só "Inglês" como matéria da prova.
2. **Durante o simulado** (`telas/SimuladoExec.tsx`, `grupoDoItem` usa `it.a` antes da matéria): o cabeçalho de cada
   questão sai "N · Inglês" e a contagem por bloco fica "Inglês: 52".
3. **Resultado do simulado** (`telas/SimuladoResultado.tsx`): o desempenho por área sai todo em "Inglês" e o
   cabeçalho da questão aberta também.

Parecido, mas menos grave: UFSM 2025/2026, as 5 UNEMAT e as 3 UEG Medicina têm todo o resto em "Conhecimentos gerais"
(110 das 119 na UFSM 2025), então o simulado não separa por área nem por matéria. Como `grupoDoItem` prefere a área,
o aluno vê "Conhecimentos gerais" em vez de Biologia, Química etc. Na UNEMAT o gabarito oficial traz as áreas
(Natureza 1–12, Matemática 13–20, Humanas 21–28, Linguagens 29–35 em 2022/2), que poderiam ser usadas.

## Para o dono (direitos, uma vez)

UNEMAT 2022/2 #8 e #9 e UEG Medicina 2025/2 #34 são questões reais de prova que **citam como fonte** Brasil Escola e
InfoEscola (o nome aparece no print e no texto). Não são questões desses sites, então não entram na regra das 788,
mas o nome aparece no site; a decisão de manter é do dono.
