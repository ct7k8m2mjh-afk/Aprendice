# BRIEF — Exemplo concreto em cada flashcard ({M})

Pedido do Vitor (vestibulando de Medicina, São Camilo): "A resolução está muito vaga. No flashcard 'Informação explícita × inferência' você só explicou o que é explícita e o que é inferência, mas não deu nenhum exemplo das duas. Não entendi o que é uma inferência. Tem que ter exemplo."

Hoje, ao corrigir um flashcard, o app mostra a resposta-modelo (`verso`), o "O que faltou" e o "Cuidado" (`erro_comum`). Vai entrar um bloco novo, **Exemplo**, logo abaixo da resposta-modelo.

Matéria: **{M}**. Leia com `cd /home/claude/escadas-sc && python3 -c "import dados_util as du; D=du.le('{M}'); print(len(D['flash']), len(D.get('flash_img',[])))"`.
Os cartões ficam em D['flash'] e D.get('flash_img', []), com os campos id, mod, sub, tipo, frente, verso, essencial, aceita e erro_comum.
Para manter coerência, use os cartões de teoria revisados, D['teoria'][mod]['cartoes'] (campos exemplo, caderno e identificar), e aproveite os exemplos deles sempre que servirem.

## O que escrever
Para CADA flashcard (todos, inclusive os com imagem), escreva `exemplo`: um caso concreto, curto (1 a 3 frases, até ~300 caracteres), que faça a resposta "clicar".
- Comparações (A × B): um exemplo de CADA lado. Por exemplo: Texto: "Ana chegou encharcada e fechou o guarda-chuva." Explícito: Ana chegou molhada. Inferência: estava chovendo, porque o texto não diz, mas obriga a concluir.
- Português: frases-exemplo reais ou criadas. Quando forem criadas, sinalize com "(criado)", como os cartões fazem. Inclua a análise: aponte na frase onde está o fenômeno.
- Matemática: um número concreto com a conta curta (por exemplo, "PG 2, 6, 18: razão 3, porque cada termo é o anterior × 3").
- Química e biologia: um caso real e conhecido (substância, organismo, doença, processo) com o detalhe que liga ao conceito.
- **Erro zero:** o exemplo precisa estar certo e ilustrar exatamente a resposta. Nada de exemplo que tenha exceção ou que contradiga o verso. Português correto, com acentos.
- Se o `verso` estiver vago ou incompleto a ponto de confundir, proponha um verso melhor em `verso_novo`. Mantenha a resposta atômica: a palavra-chave no começo e, se precisar, um complemento curto depois de " — ". Só faça isso quando for necessário.

## Saída
`/home/claude/escadas-sc/FLASH_EXEMPLO_{M}.json`: `{"<id>": {"exemplo": "...", "verso_novo": "..." (opcional)}, ...}`, com TODOS os ids de flash e flash_img.
NÃO grave em dados.json nem em index.html. Antes de terminar, valide com Python: todos os ids estão cobertos e nenhum exemplo está vazio.
Escreva também um relatório curto em `/home/claude/escadas-sc/FLASH_EXEMPLO_{M}.md`, explicando os critérios e a lista dos versos que você propõe mudar, com o motivo de cada um.
