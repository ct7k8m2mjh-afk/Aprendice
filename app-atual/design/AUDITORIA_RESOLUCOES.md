# Auditoria da FORMA das resoluções — escadas São Camilo

29/10/2026 · nenhum arquivo do app foi editado.

## Escopo e método

- **Universo medido:** todas as 2.223 resoluções das questões que estão hoje no banco (`<m>/dados.json → banco`): bio 500, qui 571, mat 611, por 541. Os `res/*.json` têm mais 681 resoluções órfãs, de questões cortadas (bio 95, qui 87, mat 339, por 160), que ficaram fora da conta.
- **Leitura humana:** 48 resoluções, 12 por matéria, numa amostra estratificada por dificuldade (1–3 / 4–6 / 7+), por tipo (`site` = lista, `prova`, e em mat também `texto` e `imagem`) e com 3 a 4 da São Camilo em cada matéria.
  - bio: Pbd4716c, P051777a, Pc682321 (SC), W42a7316, P9f037b6, W6b81b3f, P262e5ea, P95b2a5f, Wc420fe2, P831b9bb, P5c11987, P5c31a9c
  - qui: P143705b, P6771e98, P16bd0d3, P561437c, P3837fa0 (SC), We695b78, W7e2049b, P1965ba5, W491d7ba, P1355857, P6f2221b, P845fd22
  - mat: P5753d79, P7b015a0, 1cf704d4 (SC), W57cac95, 8af89e28, Wdc1e64d, Ec332e6e, P15f5be1, a965c679, P0e279d9, 15c23baf, ce1ca060
  - por: Pbedc501, P1d81378, Pab03e36, Pcfb01e1 (SC), W1b0b643, Pc5d6dff, Wfce1e3a, Pf3a25c8, P25ef632, P197ca19, P0f73f90, Pf564041
- **Repetição:** as frases foram cortadas em `. ! ? ;`. Uma frase do bloco X conta como "repetida em Y" quando ao menos 60% das palavras de conteúdo dela (mais de 3 letras, sem palavras vazias) aparecem numa mesma frase de Y. O número entre parênteses usa o corte mais duro, de 75%.
- **Contagem de palavras:** soma `essencial` + `antes` (texto, fórmulas e símbolos) + passos (`faz`, `conta`, `porque`) + `resposta` + `checagem` + `erradas` + `armadilha` + `alerta`.
- **Gabaritos:** os cálculos da amostra foram refeitos à mão. Em duas questões, a imagem da prova (`r.img`) foi conferida.
- **Scripts:** ficaram fora do app, em `/tmp/claude-0/-home-claude/e5566652-8789-513e-9e19-aca7ab2e3491/scratchpad/` (`met.py`, `met2.py`, `sum.py`).

## 1. Números gerais (as 2.223)

| medida | bio | qui | mat | por | todas |
|---|---|---|---|---|---|
| passos (mediana · mín–máx) | 5 · 3–6 | 5 · 3–6 | 5 · 3–7 | 5 · 3–6 | 5 · 3–7 |
| palavras por passo (mediana · p90) | 48 · 68 | 45 · 64 | 49 · 73 | 47 · 63 | 47 · 67 |
| — `faz` / `conta` / `porque` (mediana) | 7/16/24 | 6/17/20 | 6/10/32 | 6/10/29 | 6/13/27 |
| palavras totais (mediana · p90 · máx) | 666 · 826 · 1069 | 641 · 804 · 1114 | 755 · 945 · 1256 | 658 · 813 · 1064 | 679 · 860 · 1256 |
| palavras até chegar ao bloco "Resposta" (mediana) | 428 | 416 | 458 | 419 | 429 |
| "Antes de tudo" (mediana · fatia do total) | 163 · 24% | 158 · 24% | 159 · 21% | 148 · 22% | 156 · 23% |
| "Por que as outras" (mediana · fatia do total) | 120 · 18% | 123 · 20% | 182 · 24% | 121 · 19% | 134 · 21% |
| explicam as 4 alternativas erradas | 100% | 99% | 100% | 100% | 100% |
| têm figura própria (SVG no passo) | 18 (4%) | 5 (1%) | 1 (0%) | 0 | 24 (1%) |
| têm ao menos 1 frase com mais de 30 palavras | 100% | 99% | 100% | 100% | 100% |
| fatia das frases com mais de 30 palavras · mediana por resolução | 10% · 3 | 17% · 5 | 17% · 6 | 14% · 4 | 15% · 5 |
| **Repetição entre blocos** (60% · 75%) | | | | | |
| "Em uma olhada" repete "Antes de tudo" | 66 · 35% | 67 · 39% | 57 · 28% | 47 · 25% | **59 · 32%** |
| "Em uma olhada" repete os passos | 32 · 13% | 31 · 13% | 36 · 13% | 23 · 9% | 31 · 12% |
| "Antes de tudo" repete os passos | 23 · 9% | 28 · 12% | 26 · 7% | 12 · 6% | 22 · 8% |
| "Resposta" repete os passos | 12 · 3% | 9 · 2% | 11 · 3% | 9 · 2% | 10 · 3% |
| "Confira" repete os passos | 7 · 2% | 11 · 2% | 15 · 5% | 22 · 10% | 14 · 5% |
| `cuidado` repete a "Armadilha" (50% · 75%) | 79 · 44% | 76 · 48% | 80 · 46% | 78 · 46% | **78 · 46%** |
| texto da alternativa certa aparece em 3 ou mais destes 5 blocos: `chave`, Antes, últimos passos, Resposta, Confira | 33% | 50% | 64% | 28% | **44%** |

**Calibração por dificuldade (todas as matérias juntas):**
- dif 1–3: mediana de 617 palavras e 4 passos
- dif 4–6: 685 palavras e 5 passos
- dif 7–10: 781 palavras e 5 passos

O texto encolhe pouco nas questões fáceis: 332 delas passam de 600 palavras.

**São Camilo (146 questões):** a mediana é de 512 palavras, contra 687 nas outras escolas, com 37 palavras por passo, contra 48. É a forma mais enxuta, mas é também onde se concentram duas falhas: o "Antes" que já entrega a resposta (12%, contra 2,6% nas outras) e as alternativas despachadas com "não sai de conta nenhuma; é distrator" (14%, contra 3%).

## 2. Diagnóstico por matéria

**Biologia.** É a resolução mais "aula": o "Antes" mais longo (163 palavras), com glossário de 4 a 5 termos. Em 76% delas há um passo do tipo `eliminar` que já discute alternativa por alternativa, e isso faz 20% dos comentários de alternativa errada repetirem um passo (P262e5ea: os passos 2 a 5 são as alternativas A, C, D e E reescritas). Há 84 passos marcados `calcular` sem conta nenhuma. Em 35% dos casos, a primeira frase do "Em uma olhada" volta inteira no "Antes".

**Química.** É a forma mais limpa. O `conta` é de verdade conta: não há nenhum `conta` vazio, e só 15 passos `calcular` não têm número. Os problemas são outros:
- metade das resoluções (50%) repete o resultado em 3 ou mais blocos (P6771e98 traz "+15 e 25" no `chave`, no Antes, nos passos, na Resposta e no Confira);
- 46 resoluções despacham alternativas com "não sai de conta nenhuma";
- contém os dois erros de conteúdo encontrados na amostra (seção 4).

**Matemática.** É a mais longa: mediana de 755 palavras, e 222 resoluções passam de 800. O `porque` também é o mais longo (mediana de 32 palavras; 22% dos passos têm mais de 40 e 27% têm 3 frases ou mais), e 17% das frases passam de 30 palavras. Os comentários das erradas são o maior bloco (24% do texto) e trazem "Provavelmente…" em 51% das resoluções (533 ocorrências), ou seja, um diagnóstico de erro que muitas vezes é inventado:
- ce1ca060-C: "soma os fatoriais 6!÷(2!+2!+2!)";
- 15c23baf-B: "perde uma centena".

A forma em si é boa: as contas são reais, sempre há uma checagem por outro caminho, e a amostra não tem nenhum erro de gabarito.

**Português.** O `conta` é usado como citação do texto. Isso funciona, mas 10% dos passos ficam com `conta` vazio (33% das resoluções têm pelo menos um), e aí o passo vira só o `porque`. Esse `porque` tem 3 frases ou mais em 27% dos passos. Outros pontos:
- 18% dos passos são de "leia/localize", e 130 resoluções têm 2 ou mais passos assim;
- a "Resposta" re-explica tudo (50% passam de 25 palavras);
- 82 passos levam o chip `calcular` sem haver cálculo nenhum.

## 3. Os 8 problemas de forma mais frequentes

1. **O `cuidado` e a "Armadilha" dizem a mesma coisa.** Acontece em 78% das resoluções pelo critério de 50% e em 46% pelo de 75%, distribuído por igual entre as matérias. O aluno lê a mesma frase no começo e no fim da resolução.
   - bio W5da2f57: `cuidado` "A metástase é o traço mais lembrado, mas nem todo câncer a faz; o comando pede o que é comum a todos" e `armadilha` "A metástase é o traço mais lembrado do câncer… o comando pede o que é comum a todos".
   - Outros: P8a92fa5, P90f64ba, W42679ca, W42a7316, 15c23baf.
2. **A resposta fica enterrada e é repetida.** O bloco "Resposta" só chega depois de uma mediana de 429 palavras, em 100% das resoluções. Isso apesar de o veredito do topo já mostrar a letra. Ao mesmo tempo, o conteúdo da resposta aparece em 3 a 5 blocos em 44% dos casos.
   - P6771e98 (o resultado aparece 5 vezes), P5753d79, P7b015a0, Pc682321.
3. **O "Em uma olhada" repete o "Antes de tudo".** Acontece em 59% (32% no critério duro), porque `pede`/`chave` reescrevem a regra que o "Antes" explica logo abaixo.
   - P051777a: `chave` "Cada uma age sobre um só substrato e num pH próprio: são enzimas específicas" e, no Antes, "cada uma age sobre um único substrato e num pH próprio… atuaram como enzimas específicas".
   - Outros: P4f909ea, P003f179.
4. **O tamanho é o mesmo para tudo.** A mediana é de 679 palavras, e 416 resoluções passam de 800. As fáceis (dif 1–3) têm 617, só 21% menos que as difíceis.
   - W42a7316: "qual filo inclui os vertebrados?", dif 1, com 4 passos, 5 termos de glossário e uma alternativa errada com 40 palavras.
   - Outras: W7487764 e W16d7a80 (dif 2, cerca de 815 palavras cada).
5. **Frases longas.** 100% das resoluções têm alguma frase com mais de 30 palavras, e 15% de todas as frases passam disso. O pior está em mat e qui (17%).
   - Pb6bb13a, W539185d e 6b8b2db6 têm trechos de 180 a 200 palavras sem ponto, porque listas foram emendadas com dois-pontos e vírgulas.
6. **O `porque` está inchado.** 17% dos passos têm 3 frases ou mais (27% em mat e em por), e 11% passam de 40 palavras (678 resoluções têm pelo menos um passo assim). O `porque` explica a conta e, de quebra, antecipa o passo seguinte.
   - 1cf704d4-P2: são 3 frases para dizer que as coordenadas estão escritas na figura.
   - P0e279d9-P1: 5 frases para dizer "média × quantidade = soma".
7. **As erradas repetem os passos de eliminar.** 15% dos comentários de alternativa errada repetem um passo (cerca de 20% em bio, qui e por; 5% em mat), e 345 resoluções (16%) têm 2 ou mais letras repetidas.
   - P262e5ea, Pf387c35, P0a240e7. Em Pab03e36-P4 e P197ca19-P5, um passo só elimina as quatro alternativas, o que torna o bloco de baixo uma segunda versão.
8. **Comentários de errada especulativos ou vazios.** São 420 resoluções (19%): 349 com "Provavelmente" (mat 310, qui 37) e 96 com "não sai de conta nenhuma / é distrator" (qui 46, mat 49, 20 delas da SC).
   - P5753d79: A, B, C e D recebem todas a mesma frase.
   - ce1ca060-C: o "erro" descrito foi inventado para casar com o número.
   - Às vezes a frase é falsa: P5753d79-B diz que R$ 2.880 "não sai de conta nenhuma", mas 160 × R$ 18 = 2.880, que é o preço de "acima de 200" aplicado a todas as camisas.

**Outros problemas, menos frequentes:**
- 40% dos 8.685 termos de `simbolos` já são definidos no próprio texto do "Antes".
- 11% dos passos são de pura leitura ("Leia/Identifique/Localize…"), e 254 resoluções têm 2 ou mais; W42a7316-P1 só repete o enunciado.
- 5% dos passos têm `conta` vazio (por 10%, bio 8%).
- 193 passos levam o chip `calcular` sem número nem "=".
- O "Antes" já conclui a resposta em 72 resoluções (3%), 17 delas da São Camilo (12%). Pc682321: "Por isso a resposta é esporos por meiose"; Pcfb01e1: "Por isso a resposta é concessão".
- O `alerta`, que às vezes explica de onde saem dados essenciais (P1355857), é renderizado por último: aparece em 222 resoluções (10%).

## 4. Erros de conteúdo e gabarito encontrados na amostra

Os 48 gabaritos da amostra estão corretos: todas as contas de mat e qui foram refeitas. Mas há erros de conteúdo dentro das explicações:

1. **qui P6771e98 (São Camilo 2024, q28) — a explicação inverte o gráfico sem dizer isso, e o comentário da D está errado.**
   - O que a prova mostra (conferido em `r.img`): A+B em 20 kcal/mol, C+D em 5, pico em 30, seta direta de A+B para C+D. O comando pede a reação "no sentido inverso".
   - A resolução diz "ΔH = produtos − reagentes = 20 − 5" e, no Confira, "produto (20) acima do reagente (5)". Ela nunca diz que está lendo a reação inversa (C+D → A+B). Quem olha o gráfico vê C+D como produto.
   - O comentário da D diz "sinal errado para uma reação em que o produto tem mais energia". Na verdade, a D (exotérmica, −15, Ea = 10) é exatamente a reação direta. A armadilha da questão é ler no sentido direto, e ela não aparece nem no `cuidado` nem na "Armadilha".
   - O gabarito C está certo.
2. **qui P6f2221b (Unesp 2015) — a estrutura do BMDM está descrita errado.**
   - A prova desenha o BMDM na forma enólica: C=O, depois CH=C, depois OH (conferido em `r.img`). O "Em uma olhada" descreve isso corretamente.
   - Os passos 1 e 4 afirmam "C(=O)−CH2−C(=O)" e "o carbono entre as carbonilas é CH2, com dois hidrogênios iguais", e o Confira repete a ideia. Isso não é o que está desenhado.
   - A conclusão (tautomeria, sem carbono quiral) e o gabarito C continuam certos.
   - O enunciado transcrito chama o filtro 2 de "metoxicinamato de 2-etil-hexila (octildimetilPABA)". Isso é fiel à prova, mas o nome não bate com a estrutura desenhada, e a resolução não avisa.
3. **mat P5753d79 (São Camilo 2024) — "não sai de conta nenhuma" é falso para a B** (2.880 = 160 × 18), como mostrado no problema 8. Os demais comentários dessa questão não explicam nada.

## 5. Propostas

### (a) Só apresentação: o front-end aplica sem mexer nos dados

**Como localizar cada bloco.** Tudo é renderizado por `montaResolucao()` dentro de `#ad-painel .resolucao`. Só o "Em uma olhada" tem classe própria (`.bloco.essencial`); os outros se localizam pelo filho:

| bloco | seletor |
|---|---|
| Antes de tudo | `.bloco:has(> .antes)` |
| Passo a passo | `.bloco:has(> .passo)` |
| Resposta | `.bloco:has(> .resp)` |
| Confira você mesmo | `.bloco:has(> p.checa)` |
| Por que as outras | `.bloco:has(> .errada)` |
| Armadilha | `.bloco:has(.armad)` |
| Observação | `.alerta-box` |

O ponto de entrada natural é o observador que já existe em `design/materia.js` (cerca da linha 814, onde `.resolucao` é detectada e `poeFigura` é chamada). Já estão feitos, e por isso não entram na lista: a ordem "você marcou esta primeiro" quando o aluno erra, o player que anima os passos e o glossário ao toque.

Em ordem de prioridade (impacto ÷ esforço):

1. **Resposta no topo.** Mover `.bloco:has(> .resp)` para logo depois do `.veredito` e antes de `.essencial`. Regra: sempre. Efeito: a resposta passa de cerca de 430 palavras de distância para 0, nas 2.223 resoluções.
2. **Esconder a armadilha que repete o `cuidado`.** Na hora de renderizar, calcular o conjunto de palavras de conteúdo (4 letras ou mais, minúsculas, sem acento) de `.ess.cuidado p` e de `.armad`. Se pelo menos 50% das palavras do `cuidado` estiverem na armadilha, dar `hidden` ao `.bloco:has(.armad)`, porque o `cuidado` já está no topo. Se o aluno marcou exatamente a letra citada na armadilha, manter as duas. Afeta cerca de 1.730 resoluções (78%).
3. **Recolher o "Antes de tudo" por padrão.** Trocar `.bloco:has(> .antes)` por `<details>` cujo resumo é "Teoria de base · {n} fórmulas · {m} termos".
   - Se o aluno acertou: tudo fechado.
   - Se errou: fica visível só o `.formula`, e o `p` do texto e o `dl.simbolos` vão para dentro do `<details>`.
   - Corta uma mediana de 156 palavras (23%) da leitura obrigatória, em 100% das resoluções.
4. **Recolher "Por que as outras" de acordo com o resultado.**
   - Acertou: o bloco inteiro vira `<details>` ("Por que as outras não servem · 4").
   - Errou: só `.errada.sua` fica aberta, e as demais vão para um `<details>` "ver as outras 3".
   - Além disso, se o texto de uma `.errada` repete em 50% ou mais algum `.passo .porque`/`.conta`, ela vai sempre para o recolhido.
   - Corta cerca de 134 palavras quando o aluno acerta.
5. **Modo curto para questão fácil acertada.** Se `ok && +q.dif <= 3`, mostrar só o veredito, a Resposta e o "Em uma olhada". O resto vai para trás de um botão "ver resolução completa". Afeta 600 resoluções (27%), 332 delas com mais de 600 palavras.
6. **Limitar a largura da linha.**
   ```css
   #ad-painel .resolucao :is(p, .ess p, .errada p, .checa, .armad, .antes p) { max-width: 68ch }
   ```
   Hoje o painel tem `minmax(440px, 1.25fr)` e chega a cerca de 780 px (90 ou mais caracteres por linha a 17 px). Abaixo de 1.060 px, a coluna única chega a cerca de 1.000 px (cerca de 115 caracteres).
7. **`porque` em duas linhas com "mais".** Aplicar `.passo .porque{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}` somente quando o `porque` tem mais de 40 palavras, com um botão "por quê, completo" que tira o clamp. No modo animado, o clamp sai no passo atual. Afeta 1.164 passos de 678 resoluções (mat 22% dos passos).
8. **Destacar a conta.** Dentro de `.passo .conta:not(.bloco)`, envolver em `<mark class="res">` o trecho depois do último `=`, `→` ou `≈` (exemplos: "= 0,5 cm", "→ f = 28"), com regex sobre o `textContent` antes do fatiamento do player. Só se aplica quando o `.conta` tem dígito.
9. **Passo sem `conta`.** Se `.passo` não tem `.conta`, dar ao `.porque` o estilo do `.conta` (`.passo:not(:has(.conta)) .porque{…}`) para que o passo não pareça vazio. Afeta 534 passos (por 10%).
10. **Chip honesto.** Não mostrar `.tipo` "calcular" quando o `.conta` não tem dígito nem `=`. Afeta 193 passos (bio 84, por 82).
11. **Observação para cima.** Mover `.alerta-box` para logo depois da Resposta, porque ela explica de onde saem dados (P1355857, P845fd22). Afeta 222 resoluções.
12. **Glossário sem duplicata.** Esconder o `dt`/`dd` de `dl.simbolos` quando o termo já é um `button.gl` no mesmo `.antes p`, ou quando o termo aparece no próprio texto do "Antes". Afeta cerca de 3.460 de 8.685 termos (40%).

### (b) Exige reescrever dados

Em ordem de prioridade (contagem sobre as 2.223):

| # | reescrita | resoluções |
|---|---|---|
| 1 | Corrigir os dois erros de conteúdo da seção 4. Em P6771e98: passo "inverta a reação", comentário da D, `cuidado` e armadilha. Em P6f2221b: forma enólica nos passos 1 e 4 e no Confira. | 2 |
| 2 | Comentários de errada especulativos ou vazios. Trocar "Provavelmente…" e "não sai de conta nenhuma" por uma razão verificável de eliminação. Manter o caminho do erro só quando a conta reproduz exatamente o número. | 420 (mat 340, qui 77) |
| 3 | O "Antes" que conclui a resposta. Cortar a última frase ("Por isso a resposta é…", "Logo, … = …"). Vale priorizar a São Camilo. | 72 (17 da SC); 172 pelo critério largo |
| 4 | Fundir `cuidado` e `armadilha` num campo só: o `cuidado` fica com 1 frase e a armadilha diz *qual letra* captura o erro. Só é necessário se a proposta (a)2 não for adotada. | 1.020 (crit. 75%) a 1.730 |
| 5 | `chave` diferente do "Antes": o `chave` passa a dizer só o movimento decisivo (até 20 palavras), sem reapresentar a regra. | cerca de 710 (crit. 75%) |
| 6 | Cortar o `porque` com mais de 40 palavras para no máximo 2 frases, com a sobra para a teoria. | 678 (mat 346, por 182) |
| 7 | Tirar dos passos `eliminar` o que repete as erradas. O passo fica com uma linha ("A, C e E caem porque X") e o detalhe vai para as erradas. | 345 |
| 8 | Calibrar por dificuldade: para dif 1–3, até 3 passos e cerca de 350 palavras. | 332 (fáceis com mais de 600 palavras) |
| 9 | Juntar ou cortar os passos de pura leitura ("Leia/Identifique…" que repetem o enunciado). | 254 com 2 ou mais desses passos |
| 10 | Quebrar as frases com mais de 30 palavras, sobretudo as listas emendadas com ":" e ";". | todas têm alguma; prioridade às 1.779 com 3 ou mais |
| 11 | Reclassificar o `tipo` dos passos `calcular` sem conta. | 193 passos |
| 12 | Figuras próprias onde a estrutura espacial decide: geometria de mat, heredogramas e gráficos de bio e qui. Hoje só 24 resoluções têm figura (mat 1, por 0). | candidatas: mat `tipo=imagem` (55) e geometria; a quantidade exata exige triagem |
