# Confirmação das obras literárias (etapa obrigatória, uma por lote)

**Por que existe.** A etapa de API da fábrica **não abre a web**, por isso `fontes` sai sempre vazio
e as lentes marcam itens como "OBRA (confirmar na web)" sem poder confirmar nada. No lote por-0103
isso apareceu em escala: `fontes` vazio nas 15 resoluções, 8 itens marcados para confirmar e nenhum
confirmado — porque a confirmação dependia de a sessão notar, e com o volume ela não deu conta.

O risco é específico e grave: a fábrica **sinaliza bem** quando não tem certeza (declara confiança
baixa, marca a obra), mas um palpite não atendido vai ao ar **com cara de fato**. Foi assim que
"o primo dela, Benevenuto" e "Numa é deputado e genro de senador" quase entraram no site, e que
"Gualberto Gaspar é homem casado" chegou a sustentar um gabarito.

**Quando roda.** Uma vez por lote, junto com a conferência, em agente próprio (ele precisa de web).

**O que o agente faz**, questão por questão, nas que se resolvem por dado de obra e não pelo texto do print:
1. Lista as afirmações sobre a obra que a resolução usa para sustentar a letra ou derrubar uma
   alternativa: enredo, personagem, parentesco, cargo, data, autoria, movimento, métrica, verso citado.
2. Confirma **cada uma** em fonte publicada e confiável: universidade, repositório acadêmico,
   editora, Academia Brasileira de Letras, enciclopédia de literatura. Nunca site didático de banco
   de questões, e nunca os quatro sites que o dono proibiu (princípio do CLAUDE.md).
3. O que se confirma entra em `fontes` da questão, com nome descritivo e o endereço que ele abriu.
4. **O que não se confirma sai.** A resolução passa a sustentar a letra só pelo que se confirma, ou
   pelo critério do próprio texto do print. Fato sem certeza não entra — nem nas `erradas`.
5. Devolve a lista do que confirmou (com a fonte) e do que não confirmou (com o que fez no lugar).

**Dois cuidados que a prática mostrou:**
- Em questão cujo print traz só o comando e as alternativas, a resolução tem de avisar o aluno, com
  todas as letras, que o dado vem da obra e não da prova — senão ele procura no print o que não está
  lá e conclui que entendeu errado.
- Aspas na resolução valem como cópia literal do print. Fala de personagem que não está no print
  **não** vai entre aspas.
