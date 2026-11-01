# Revisão independente: exemplos dos flashcards (Biologia)

Arquivo revisado: `FLASH_EXEMPLO_bio.json`, com 65 ids (50 de `flash` e 15 de `flash_img`). Li frente, verso e exemplo de cada um. Refiz as contas de f062, f066, f069, f071, f072, f103, f135 e f054 (a leitura dos códons depois da inserção) e conferi todas. Não há `verso_novo`; concordo que nenhum verso precisa mudar.
Validação em Python: os 65 ids estão cobertos, nenhum exemplo está vazio e o maior tem 285 caracteres.
Método: conferência contra o conteúdo de livro-texto (Campbell, Guyton, Amabis, o calendário do PNI). Quando um detalhe não tinha apoio firme, tirei o detalhe em vez de manter um número duvidoso.

## Os 3 pontos sinalizados pelo autor

| id | Antes | Depois | Motivo |
|---|---|---|---|
| bio-f099 | "...e o folículo se rompe cerca de 1 a 2 dias depois." | "...e o folículo maduro se rompe logo em seguida, liberando o ovócito." | O intervalo varia conforme se mede a partir do início do pico (cerca de 34 a 36 h) ou do ponto máximo (cerca de 10 a 16 h, segundo a fonte). "1 a 2 dias depois do pico" pode ser lido como errado. Tirei o número; o restante (feedback positivo do estrógeno e testes de farmácia que detectam o LH na urina) está correto. |
| bio-f127 | "...(dada aos 12 meses)..." | "...(a 1ª dose da tríplice viral é aos 12 meses)..." | Confirmado: no calendário do PNI, a 1ª dose (tríplice viral) é aos 12 meses e a 2ª aos 15 meses (tetraviral). A "dose zero", de 6 a 11 meses, só é usada em surtos. Deixei claro que se trata da 1ª dose do calendário. A volta do sarampo em 2018 (o Brasil perdeu a certificação em 2019) está correta. |
| bio-f139 | "Hoje, postos juntos, casais dos dois lados raramente se acasalam" | "Hoje, postos juntos, os dois lados formam bem menos casais e prole" | Knowlton et al. (1993) mostraram que a compatibilidade reprodutiva entre pares separados pelo istmo cai, mas a queda vai de leve a quase total conforme o par. "Raramente" generalizava demais. Mantive o Alpheus e os cerca de 3 milhões de anos (o valor do Campbell), porque é um caso de livro-texto. |

## Outras correções

| id | Antes | Depois | Motivo |
|---|---|---|---|
| bio-f056 | "liga... genes de neurotransmissores" | "liga... os genes das enzimas que fabricam seus neurotransmissores" | Muitos neurotransmissores (acetilcolina, dopamina) não são produtos diretos de genes, e sim de enzimas. |
| bio-f039 | "e cada célula fica com 2 cromossomos" | "e cada polo recebe 2 cromossomos" | Na anáfase I a célula ainda não se dividiu, então falar em "célula" estava impreciso. |
| bio-f096 | "neutraliza o veneno na hora" | "neutraliza logo o veneno circulante" | O soro neutraliza o veneno que ainda circula; não desfaz na hora a lesão local que já aconteceu. |
| bio-i04 | "nunca mais formou memórias novas" | "nunca mais conseguiu guardar fatos e eventos novos" | H.M. ainda aprendia habilidades motoras; ele perdeu só a memória declarativa nova. |
| bio-i15 | "como as do testículo" | "como as células de Leydig do testículo" | Nem toda célula do testículo produz esteroides; a precisão evita erro. |

## Conferidos e mantidos (amostra dos pontos mais arriscados)
- f072: AaCc × AaCc, com 9 agouti, 3 pretos e 4 albinos (3 A_cc + 1 aacc). Correto.
- f054: AUG GCA UUC GAA com um C inserido dá AUG CGC AUU CGA A… Correto.
- f135: 2 × 0,99 × 0,01 = 0,0198, ou seja, cerca de 198 portadores em 10 000. Correto.
- f060: Dolly, com o núcleo da Finn Dorset e o óvulo da Scottish Blackface (DNA mitocondrial da doadora do óvulo). Correto.
- f133: amish da Pensilvânia e a síndrome de Ellis-van Creveld (efeito do fundador). Correto.
- f118: bugios mortos em 2017 e 2018 (MG, SP e RJ), com Haemagogus e Sabethes. Correto.
- f143: o AZT foi o primeiro antirretroviral e inibe a transcriptase reversa. Correto.
- i02: opioides deprimem o centro respiratório do tronco, e os reflexos pupilar e de tosse são usados no teste de morte encefálica. Correto.
- i13: o cianeto bloqueia a citocromo c oxidase na membrana interna. Correto.
