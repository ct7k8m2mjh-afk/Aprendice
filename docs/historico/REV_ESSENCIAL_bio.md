# Revisão independente: Treino geral de Biologia (29/10)

Segunda leitura de `ESSENCIAL_bio.json`. Nada foi gravado em `dados.json` nem em `index.html`. O arquivo continua com 40 ABC e 40 frases de completar, no mesmo formato.

## ABC: 40 questões, nenhuma troca

Li o enunciado e as cinco alternativas de todas as 40 e resolvi cada uma. Nas que têm figura, abri o print real da questão (`bio/res/<sub>.json`) e conferi o gabarito olhando a figura.

- **Contas refeitas:** Pb570d83 (100 pb, 32 T → 68 C, 68 G, 32 A: **C**), P9dc2eb5 (parentais Gm e gM com 42% cada; recombinantes 8% + 8% = 16 UR, arranjo trans: **A**), Pe07eea7 (3 classes de raiz × 2 de flor = 6: **D**), Pf6d4ecb (2pq = 2 × 0,3 × 0,7 = 0,42: **C**), P0a240e7 (2n = 8, 4 cromossomos duplicados indo para cada polo = anáfase I: **D**).
- **Figuras conferidas no print:**
  - Pc682321: a seta aponta a cápsula do esporófito do musgo, onde se formam esporos por meiose: **A**.
  - P999b3de: o antibiótico 3 volta a subir e o 1 zera no dia 16, então D e E estão erradas: **C**.
  - Pa1cc3b0: o ATP por glicose cai depois da seta, o que indica fermentação alcoólica da levedura: **D**.
  - Pb99b11c: FSH sobe e depois o estrógeno sobe: **E**.
  - Pa99e300, Pe45f264 e Pc82dfe1: o próprio texto descreve o gráfico ou a tabela.
- **Raciocínio conferido sem conta:**
  - Bohr: no tecido, mais CO₂ deixa a forma protonada: **D**.
  - ABO: o plasma de Pablo aglutinou o sangue A, então ele tem anti-A e é do grupo B.
  - Hemograma: o indivíduo 1 tem hemácias altas, ou seja, é Rogério, que estava na altitude. O indivíduo 2 tem leucócitos altos e anemia: é Marcelo. O indivíduo 3 é normal: é Fábio.
  - Também conferi as demais (vacina, soro, maré vermelha, Pampa, mercúrio, controle biológico, fluxo de energia, malária, imunidade coletiva, teoria sintética, Lamarck/deriva/Darwin, raposas, retrovírus, âmnio, parede de fungo, especificidade do vírus, telomerase, diferenciação, frameshift, clonagem, cromossomo Y, X/Y na meiose I, nucléolo, traço comum, enzimas). Todos os gabaritos estão corretos.
- **Repetição:** não há duas questões que cobram a mesma coisa. Vacina (P03bc2b3), soro (P023b4d8) e imunidade coletiva (P540c9e2) tratam de pontos diferentes. O mesmo vale para cromossomo Y (P9c44554) × separação X/Y na meiose I (P831b9bb) e para retrovírus (Pd79452b) × receptor do vírus (Pb5912cb).
- **Observação, sem mudança:** em P715b848 (São Camilo 2024), o texto em `enun` perdeu as lacunas ("espécies de que liberam…", "é denominada ."). O app mostra o print, que traz as lacunas, então o aluno não é afetado.

## Completar: 3 mudanças

| id | antes | depois | motivo |
|---|---|---|---|
| bio-c005 | "A fermentação láctica não libera ___; quem libera gás é a alcoólica." → CO₂ (aceita "gás") | "Na fermentação láctica, o piruvato recebe os hidrogênios do NADH e vira ___." → ácido láctico (aceita lactato, ácido lático) | Na frase antiga, "etanol" também completava corretamente (a láctica não libera etanol). Além disso, "gás" estava em aceita. Usar a fermentação alcoólica (etanol e ___) repetiria o flashcard bio-f029. A frase nova é o `oque` do cartão B03.4 (Fermentação láctica) e só aceita uma resposta. |
| bio-c033 | "A teoria sintética soma às ideias de Darwin a mutação e a ___." → recombinação | "A seleção natural que favorece um dos extremos da curva de fenótipos é a ___." → direcional (aceita "seleção direcional") | A teoria sintética também incorpora a deriva genética, a migração e a genética mendeliana. Um aluno que digitasse "deriva" ou "genética" estaria certo e seria marcado como errado. A frase sobre Lamarck repetiria o flashcard bio-f131. A frase nova vem do cartão B11.2 (Tipos de seleção natural): caderno "direcional: favorece um extremo" e identificar "Curva deslocada: direcional". Disruptiva favorece os dois extremos e estabilizadora favorece o meio, então só uma resposta cabe. |
| bio-c035 | "Isolamento geográfico sozinho não basta: …" | "Para formar uma nova espécie, isolamento geográfico sozinho não basta: precisa surgir isolamento ___." | Sozinha, a frase não dizia para que o isolamento geográfico não basta. O complemento repete o que diz o `oque` do cartão B11.5. A resposta continua "reprodutivo". |

## Completar: conferido sem mudança (37)

Em cada frase conferi quatro pontos: fidelidade ao cartão (mesmo sub), correção científica, se outro termo também cabe na lacuna e se a lacuna é o termo-chave.

- c001 membranosas · c002 ribossomo · c003 sítio ativo (centro ativo e sítio catalítico são sinônimos reais) · c004 zero · c006 cromátides-irmãs · c007 euploidia (poliploidia e triploidia aceitas, porque também são corretas para "um lote inteiro a mais") · c008 supressores · c009 códon/trinca · c010 3 · c011 RNA polimerase · c012 menor · c013 frequente · c014 codominância · c015 recombinantes · c016 2n + 1 · c017 filhas
- c018 simples · c019 leucócitos · c020 emulsiona · c021 antígeno · c022 plasmócito · c023 progesterona · c024 unidirecional · c025 competem · c026 predador · c027 Amazônia · c028 fixação · c029 hemácias · c030 específica · c031 cisticercose · c032 seleciona · c034 q² (q2 é aceito) · c036 receptor · c037 glicogênio · c038 gametófito · c039 transpiração · c040 âmnio

Todas são recortes literais ou quase literais do cartão citado em `fonte`, têm acentos corretos e fazem sentido sozinhas.

## Validação (Python)

- 40 ids de ABC existentes e únicos, todos com gabarito e degrau > 0.
- 40 frases, cada uma com exatamente um "___", e ids únicos.
- Todos os mod/sub existem em `teoria` (algum cartão com esse sub) e em `nomesub`.
