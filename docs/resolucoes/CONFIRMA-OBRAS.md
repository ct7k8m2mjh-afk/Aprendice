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
- **A nota "OBRA (confirmar na web)" da lente é uma pista, não uma ordem.** Ela sai de um modelo que
  não pode abrir página nenhuma, e por isso às vezes aponta para o lado errado. Duas vezes já pediu
  para confirmar **o contrário** do que a resolução, correta, dizia: em `Pe9950ce3` (por-0104) e em
  `P7a831387` (por-0107), onde a nota mandava confirmar que o romance é narrado em primeira pessoa
  pelo protagonista, quando *O último conhaque* tem narrador em terceira pessoa (REVELL/UEMS, n. 11,
  2015) — obedecer teria derrubado a resolução certa, que é a do gabarito oficial. Julgue cada nota;
  confirme a **afirmação da resolução**, não a pergunta da lente.
- **Não confie em paráfrase de terceiro sobre o que a resolução diz — nem na minha.** No por-0107 eu
  passei a um agente de obras a descrição que um conferente havia feito de `P7a831387` ("narrador em
  terceira pessoa com focalização em Fernando"). O agente buscou essas palavras no lote todo e
  mostrou que a resolução **não dizia isso**: ela afirmava algo mais fraco, e sem fonte. Abra o campo
  e leia o que está escrito nele antes de confirmar ou derrubar qualquer coisa.
