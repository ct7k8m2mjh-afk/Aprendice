# Pedido ao ESCRITOR — lote conteudo-erradas-mq-10 (Matemática, sem API)

Pasta: /home/user/Aprendice/fabrica_saida/conteudo/conteudo-erradas-mq-10/ (prints com caminho relativo a /home/user/Aprendice).
Não use a API da Anthropic; não faça commit nem git. Português do Brasil. Toda conta em python.
O número N da sua parte vem no pedido do organizador.

1. Leia /home/user/Aprendice/.claude/skills/resolucao-exercicios/SKILL.md e o guia de Matemática em
   .claude/skills/resolucao-exercicios/materias/ (só o que precisar).
2. Leia prompt-escritor.md (instruções completas da etapa).
3. Entrada: parte-N.json (lista de questões). Para cada questão: abra o print com Read (campo "print"), leia
   texto_da_prova, alternativas, gabarito_oficial e resolucao_atual; resolva a questão. Para cada letra de "fracas",
   ache o equívoco honesto e plausível que leva EXATAMENTE àquela alternativa (confira a conta em python) e escreva o
   texto: até 35 palavras (limite absoluto 40); "quem marca X ..."; fração "a/b"; sem "não confere/não bate/não
   fecha/daria/dá X"; sem "provavelmente/talvez/chute/distrator"; sem emoji. Se não houver equívoco honesto, acao
   "manter" com o texto atual.
4. Saída: escritor-N.json = {"<id>": {"<letra>": {"acao": "reescrever"|"manter", "texto": "...", "equivoco":
   "<conteúdo>:<equivoco-com-hifen>"}}}, cobrindo TODAS as letras fracas de todas as questões da parte. Valide o JSON
   com python e conte as palavras.
