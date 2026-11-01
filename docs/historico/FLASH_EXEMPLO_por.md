# Exemplos dos flashcards — Português (por)

Arquivo: `FLASH_EXEMPLO_por.json`. Cobre 50 de 50 ids: 50 em `flash` e nenhum em `flash_img`, que está vazio em por. A validação em Python conferiu que todos os ids estão lá, que nenhum exemplo está vazio e que o mais longo tem 294 caracteres.

## Critérios
- **Um caso concreto por cartão**, com 1 a 3 frases, mostrando na própria frase onde está o fenômeno (o termo, a troca, o teste).
- **Comparações (A × B)**: um exemplo de cada lado, como inferência × palpite, paradoxo × antítese, elipse × zeugma, dêitico × anafórico, parônimo × homônimo, polissemia × homonímia, denotação × conotação e pois × portanto.
- **Cartões de processo**: o exemplo faz o teste passo a passo. Em f034, por exemplo, há um caso em que o termo mais próximo é a resposta errada, para mostrar o "Cuidado".
- **Coerência com a teoria revisada**: sempre que serviu, reaproveitei o exemplo de `D['teoria'][mod]['cartoes']`: Machado ("campos-santos", "Pai contra mãe", "A igreja do Diabo"), Hino Nacional, O cortiço, Lima Barreto, Juó Bananére, Einstein 2020 e Bilac, entre outros.
- **Rótulos**: "Real:" para trecho com autor ou prova, "Criado:" para frase inventada, seguindo o padrão dos cartões.
- **Erro zero**: não usei citações cuja redação exata eu não pudesse garantir. Em Gregório de Matos, por exemplo, ficou só o início "Pequei, Senhor"; em Álvares de Azevedo, o título "Se eu morresse amanhã". Também evitei casos discutíveis: "banco" ficou de fora como exemplo de polissemia, e em seu lugar entraram "pé" (polissemia) × "manga" (homônimos).
- **Ligação com o erro comum**: cada exemplo mostra a armadilha descrita em `erro_comum`, como "era" × "foi", o sujeito real no hipérbato, o "só" que denuncia extrapolação e o Jerônimo de O cortiço para o determinismo.

## Versos que proponho mudar
Nenhum. Os 50 versos estão corretos e atômicos. O problema que o Vitor apontou era a falta de exemplo, e o campo `exemplo` resolve isso. O único verso que poderia confundir é o de por-f040 ("Pois" × "portanto"): "pois" depois do verbo também é conclusivo. Em vez de mudar o verso, deixei isso explícito no exemplo ("leve, pois, o casaco").
