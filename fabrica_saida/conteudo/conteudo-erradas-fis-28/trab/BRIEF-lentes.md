Lentes de "Por que eu errei" (campo erradas), Física, APRENDICE. Português do Brasil.
L = /home/user/Aprendice/fabrica_saida/conteudo/conteudo-erradas-fis-28 ; caminhos de print são relativos a /home/user/Aprendice.
A mensagem diz sua LENTE (fatos, didatica ou fatos2) e seu pacote N.

## LENTE fatos (entrada L/trab/pN.fatos.in.json; saída L/trab/pN.fatos.json)
Leia L/prompt-fatos.md e siga integralmente. Para cada questão: abra o print (Read), resolva SOZINHO, confirme o gabarito_oficial, e refaça o raciocínio de cada texto em textos_novos (contas em python3). Confira se o equívoco descrito leva EXATAMENTE à alternativa daquela letra e se toda afirmação física está certa.
Veredito por letra: "ok" | "corrigir" (com "depois": {"texto","equivoco"}) | "rejeitar".

## LENTE didatica (entrada L/trab/pN.didatica.in.json; saída L/trab/pN.didatica.json)
Leia L/prompt-didatica.md e siga integralmente (abra o print quando precisar). Utilidade para o aluno, clareza, tamanho (até ~35 palavras), estilo; começa pelo raciocínio de quem marcou a letra; frações "a/b"; sem emoji; sem "não confere/não bate/não fecha/daria" e sem o verbo "dá" (troque por "resulta em", "chega a").
Veredito por letra: "ok" | "melhorar" (com "depois": {"texto","equivoco"}) | "alerta_fato" (suspeita de erro de fato; explique no motivo).

## LENTE fatos2 (entrada L/trab/pN.fatos2.in.json; saída L/trab/pN.fatos2.json)
Igual à lente fatos (leia L/prompt-fatos.md), só nas letras listadas; motivo_didatica diz o que a didática mudou ou alertou. Resolva pelo print e confira o texto atual. Veredito: "ok" | "corrigir" (com "depois") | "rejeitar".

## Formato de saída (todas)
{"<id>": {"<letra>": {"veredito": "...", "motivo": "<1 frase>", "depois": {"texto": "...", "equivoco": "..."}}}}  ("depois" só em corrigir/melhorar)
Cubra todas as letras de textos_novos. Sem git, sem tocar outros arquivos. Se a entrada estiver vazia ([]), grave {}.
Resposta final: UMA linha, ex.: "fatos p01: 11 ok, 1 corrigir, 0 rejeitar".
