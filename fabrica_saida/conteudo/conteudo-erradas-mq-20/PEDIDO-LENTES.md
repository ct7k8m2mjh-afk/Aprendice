# Pedido às lentes — lote conteudo-erradas-mq-20 (Química, sem API)

Pasta: /home/user/Aprendice/fabrica_saida/conteudo/conteudo-erradas-mq-20/ (prints com caminho relativo a /home/user/Aprendice).
Não use a API da Anthropic; não faça commit. Português do Brasil. Toda conta em python.

## FATOS (etapa 4) — parte N
Instruções completas: prompt-fatos.md. Entrada: parte-N.json (questões) + escritor-N.json (textos novos).
Para cada questão: abra o print (Read), resolva SOZINHO antes de ler os textos novos e confirme o gabarito_oficial.
Depois, para cada letra com acao "reescrever": refaça a conta/leitura descrita — leva EXATAMENTE àquela alternativa? é
equívoco plausível (não inventado)? números, fatos e trechos batem com o print? Veredito: ok | corrigir (com `depois`, texto
corrigido) | rejeitar (com motivo). Ignore letras "manter".
Saída: fatos-N.json = {"<id>": {"<letra>": {"veredito": "...", "depois": "", "motivo": ""}}}. Valide o JSON.

## DIDÁTICA (etapa 5) — parte N
Instruções completas: prompt-didatica.md. Entrada: parte-N.json + escritor-N.json + fatos-N.json.
Avalie o texto final de cada letra (o `depois` da lente de fatos se veredito "corrigir"; o do escritor se "ok"; ignore
"rejeitar" e "manter"). Limite ABSOLUTO de 40 palavras (conte em python; mire ~35). Diz o que faltou no raciocínio de
quem marcou a letra? O aluno se reconhece? Sem "não confere/não bate/não fecha/daria/dá X" como explicação, sem
"provavelmente/talvez/chute/distrator", fração SEMPRE "a/b" (o site empilha; "a/b" é o certo, nunca troque por "÷" nem por "a sobre b"), sem emoji. Veredito: ok | melhorar (com `depois`, sem mudar fato nem
conta) | alerta_fato (com motivo).
Saída: didatica-N.json = {"<id>": {"<letra>": {"veredito": "...", "depois": "", "motivo": ""}}}. Valide o JSON.

## FATOS DE NOVO (etapa 6)
Entrada: fatos2-entrada.json (lista de {id, letra, print, gabarito_oficial, texto_da_prova, resolucao_atual, texto}).
Para cada item: abra o print, refaça a conta/leitura do texto. Veredito: ok | corrigir (com `depois`) | rejeitar.
Até 40 palavras. Saída: fatos2.json = {"<id>": {"<letra>": {"veredito", "depois", "motivo"}}}. Valide o JSON.
