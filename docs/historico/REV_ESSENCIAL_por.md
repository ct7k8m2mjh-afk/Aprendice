# Revisão independente: Treino geral de Português (29/10/2026)

Esta é a segunda lente sobre `ESSENCIAL_por.json`. Não alterei `dados.json` nem `index.html`.

## ABC (40 ids): nenhuma troca
- **Gabaritos.** Li o enunciado, as cinco alternativas e o gabarito das 40. Conferi cada um com a resposta da resolução (`por/res`). Os 40 estão corretos.
- **Questões com imagem.** Decodifiquei o print de `res[id].img` e olhei a imagem de cada uma. O app mostra esse print como corpo da questão, então o aluno vê a figura.
  - **P024f7e3 (Calvin):** "Sr. Enciclopédia" é ironia, gab D. Confere.
  - **P30ab321 (Dahmer):** a interação social é artificial, gab D. Confere.
  - **Pcccc823 (Gonsales):** o humor vem da ambiguidade de "sentido", gab B. Confere.
  - **Pd454688 (soneto XCIX de Cláudio Manuel da Costa):** o soneto não está no `enun`, mas está no print. O poema desmonta o locus amoenus (fonte, céu, gado) até a morte de Nise, gab D. Confere.
- **Conferências pontuais:**
  - **P0e7d89c:** a rima pobre é fantasia/alegria/melancolia, todas substantivos. Gab B.
  - **Pbcd612f:** só a B põe o sujeito antes do verbo. A D e a E continuam com o verbo antes do sujeito. Gab B.
  - **Pe2c87bd:** "no desenrolar" é infinitivo com artigo, ou seja, derivação imprópria. Gab E.
  - **P71b2c7f:** "adulto" é adjetivo predicativo. Na B, o predicativo é substantivo. Gab D.
- **Centralidade e repetição.** Não há duas questões cobrando a mesma coisa.
  - P5e44fc6 e Pe9bfbef trocam conjunções, mas uma é concessiva e a outra causal.
  - Pddacb18 e P283d8a4 usam o mesmo texto, mas uma cobra prefixo e a outra escolas literárias.
  - A distribuição por tema do relatório original continua valendo.
- **Anotações, sem efeito no gabarito:**
  - Pa9cccba traz " 3" no fim da alternativa E, ruído de extração.
  - Pc7a70b2 é de "Santa Casa 2027". É o vestibular 2027, aplicado em 2026, e a URL da Objetivo confirma.
  - Pd454688 está com `figura: False`, mas depende do soneto, que só aparece no print. Vale marcar `figura: True` no banco.

## Completar (40 itens): 6 itens mudaram

| id | antes | depois | motivo |
|---|---|---|---|
| por-c001 | "Negue “Ele parou de fumar”: o ___ “ele fumava antes” continua valendo." · aceita [informação pressuposta] | "Negue “Ele parou de fumar”: o ___ “ele fumava antes”, marcado por “parar de”, continua valendo, ao contrário do subentendido." · aceita [informação pressuposta, pressuposição] | "Implícito" também completava a frase antiga. O contraste com o subentendido, tirado do mesmo cartão (oque + identificar), deixa só "pressuposto". |
| por-c014 | aceita [contrariá-la, ir contra, discordar de] | aceita [+ contradizer, opor-se a] | São sinônimos reais de "contrariar" nesse contexto. |
| por-c015 | "O tema cabe num ___; a tese é opinião..." → substantivo | "Uma alternativa verdadeira sobre um único parágrafo não é a ideia ___ do texto inteiro." → central · aceita [principal, geral] (cartão «Ideia central do texto» · cuidado) | Na frase antiga cabiam outras respostas certas ("título", "termo", "nome"). Trocar a lacuna por "tese" repetiria o flashcard "Posição que o autor defende → Tese". Fui então para o outro cartão do mesmo sub, o que também cobre um tema que não estava no Treino. |
| por-c021 | "___ é o sentido figurado que o contexto cria, como em “coração de pedra”." → Conotação | "Se a palavra não pode ser lida ao pé da letra naquela frase, o sentido é ___." → conotativo · aceita [figurado, sentido figurado, conotação, sentido conotativo] | "Metáfora" também completava a frase antiga ("coração de pedra" é metáfora). Além disso, ela repetia a definição que o flashcard de denotação/conotação já cobra. A nova frase usa o teste do cartão (identificar + caderno). |
| por-c022 | aceita [cautela] | aceita [cautela, tato, delicadeza, prudência] | "Agir com muito tato" também está correto, e o aluno que escrevesse isso seria marcado como errado. |
| por-c026 | "“Vai, Carlos! ser ___ na vida.”" (só a citação) | "O eu deslocado, que Drummond chama de ___ no “Poema de sete faces”, é traço central da sua poesia." → gauche | A frase antiga era só a memória de uma citação. Agora a lacuna fica ligada ao conceito do cartão ("o eu deslocado (gauche)"). Não citei *Alguma poesia (1930)* para não entregar o flashcard do livro de estreia. |

### Conferidos sem mudança (34)
Comparei cada um com o cartão citado na `fonte` (mesmo sub e título). Nenhum afirma algo que o cartão não afirma, o conteúdo está correto e só uma resposta cabe na lacuna:
c002 paráfrase · c003 explícita · c004 fizera (aceita tinha/havia feito) · c005 sujeito · c006 subjuntivo · c007 revelar · c008 ilustre · c009 causa ("na medida em que") · c010 mas · c011 hipérbole · c012 paradoxo · c013 expectativa · c016 tema · c017 catáfora · c018 primeiro · c019 classe · c020 dentro · c023 charge · c024 1881 · c025 zoomorfismo · c027 Gonçalves de Magalhães · c028 Antropofagia · c029 anacoluto · c030 ideias · c031 existir · c032 sinestesia · c033 sugere · c034 diastrática · c035 substantivo · c036 apassivador · c037 condição · c038 fosse · c039 onisciência · c040 conjunção.

Repetição com os 50 flashcards: c004, c012, c019, c020 e c040 tocam no mesmo tema de algum flashcard, mas a lacuna pede outra face dele. Mantive os cinco.

## Validação (Python)
- 40 ids de ABC, todos existentes no banco e sem repetição.
- 40 itens de completar, com ids únicos e exatamente um "___" por frase.
- Todos os mod/sub existem em `D['teoria']` e `D['nomesub']`.
- O arquivo anterior foi salvo em `/tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/ESSENCIAL_por.antes.json`.
