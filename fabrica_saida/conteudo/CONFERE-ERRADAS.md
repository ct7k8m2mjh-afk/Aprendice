# Conferência por amostra dos "Por que eu errei" reescritos (Fábrica — Conteúdo, Aprendice)

O campo `erradas[<letra>]` é o bloco "Por que eu errei" que o aluno que marcou aquela letra lê primeiro: precisa dizer o
que FALTOU no raciocínio de quem marcou a letra (o equívoco e a conta ou leitura que leva exatamente àquela
alternativa). Textos fracos ("não confere", "daria X") foram reescritos pela API e passaram por lente de fatos, lente
didática e lente de fatos de novo. Você é a conferência final (amostra), feita por quem não escreveu.

Entrada: o arquivo `amostra.json` indicado no pedido: lista de questões, cada uma com `id`, `print` (caminho relativo a
/home/user/aprendice), `gabarito_oficial`, `alternativas`, `texto_da_prova`, `resolucao_atual` e `novas` ({letra:
{"texto", "equivoco"}}).

Para cada questão: abra o print (Read na imagem), resolva sozinho e confirme o gabarito oficial. Depois, para cada letra
de `novas`: refaça a conta ou a leitura descrita — ela leva MESMO àquela alternativa? É um equívoco plausível (não uma
origem inventada)? Todo número, fato e trecho citado está certo e bate com o print? Até ~35 palavras, sem "não confere".
Toda conta em python.

Saída: grave `amostra.conferido.json` ao lado da entrada:
`{"<id>": {"<letra>": {"ok": true|false, "texto": "texto corrigido (só se ok=false e houver conserto seguro; senão vazio)",
"motivo": "o erro, em uma frase (vazio se ok)"}}}`
Valide o JSON. Devolva só UMA linha: "<lote>: X letras conferidas, Y com erro (Z consertadas, W a descartar)".
