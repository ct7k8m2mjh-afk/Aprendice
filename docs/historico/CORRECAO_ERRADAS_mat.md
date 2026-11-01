# Correção das alternativas erradas especulativas — Matemática

29/10/2026 · pacotes `mat/res/<sub>.json` (pasta real `/home/claude/scapp/res`), campo `erradas`.

## Resumo

- **Escopo:** as 611 questões do banco de mat (`D["banco"]`). Listagem por script: comentários de errada com "Provavelmente", "não sai de conta nenhuma", "distrator", "chute", "talvez". Resultado: **608 comentários em 349 questões** (a auditoria estimou ~340 questões). As 339 resoluções órfãs (questões fora do banco) não foram tocadas.
- **Regra aplicada:** cada comentário reescrito diz por que o valor/afirmação não serve (teste de volta, conta certa, propriedade que o derruba). Quando um erro típico real leva exatamente ao valor, o texto diz "X sai de …" e mostra a conta; quando nenhuma conta plausível chega ao valor, diz "não confere" e por quê, sem inventar origem.
- **Com erro real reproduzido ("sai de …"):** 18 comentários. Os demais são "não confere" com teste objetivo.
- **Caso P5753d79 (B):** agora "R$ 2.880,00 sai de cobrar R$ 18 por camisa nas 160: 160 × 18 = 2 880 …".
- **Verificação:** cada reescrita tem uma expressão Python avaliada (coluna "conta conferida"; `None` = afirmação qualitativa ou de leitura de figura). Script de checagem bloqueou frases > 30 palavras (contando símbolos), termos especulativos e qualquer edição na letra do gabarito.
- **Integridade:** só o campo `erradas[letra]` dos 608 itens mudou; demais campos e demais letras conferidos iguais ao backup; 77 pacotes regravados no formato original (JSON compacto, UTF-8) e relidos como JSON válido. Backup dos 77 em `mat/res/_bak_erradas/`.
- **2.ª passada:** amostra aleatória de 40 reescritas (marcadas com ✔ abaixo) refeita à mão contra enunciado, alternativas e resolução: 40/40 corretas, nenhuma correção necessária.
- **Fora do escopo, sem mudança:** 48 comentários não marcados que usam "não sai de nenhuma conta", "isca" ou "enchimento", mas já trazem o teste objetivo (ex.: 8196566b-B, dec763bd-B, 02199bcc-E).

## Registro (id · letra · antes → depois · conta conferida)

### P5753d79 · A [R$ 3.540,00] (gab E)
- antes: R$ 3.540,00 não sai de conta nenhuma com os dados; é distrator.
- depois: R$ 3.540,00 não corresponde a nenhuma faixa aplicada a 44 brancas e 116 coloridas: as três faixas dão R$ 4.580, R$ 3.780 e R$ 2.748.
- conta conferida: `44*20+116*25` → 3780

### P5753d79 · B [R$ 2.880,00] (gab E)
- antes: R$ 2.880,00 não sai de conta nenhuma com os dados; é distrator.
- depois: R$ 2.880,00 sai de cobrar R$ 18 por camisa nas 160: 160 × 18 = 2 880. R$ 18 é só a colorida acima de 200; com 160 camisas vale a faixa de 101 a 200.
- conta conferida: `160*18` → 2880

### P5753d79 · C [R$ 2.960,00] (gab E)
- antes: R$ 2.960,00 não sai de conta nenhuma com os dados; é distrator.
- depois: R$ 2.960,00 não confere: com 44 brancas e 116 coloridas, nenhuma faixa da tabela dá esse total. Na faixa certa, 44 · 20 + 116 · 25 = 3 780.
- conta conferida: `44*20+116*25` → 3780

### P5753d79 · D [R$ 3.320,00] (gab E)
- antes: R$ 3.320,00 não sai de conta nenhuma com os dados; é distrator. Os erros naturais também não estão entre as opções: manter os preços da 1ª semana dá 2·2290 = 4580, e usar a faixa acima de 200 dá 44·15 + 116·18 = 2748.
- depois: R$ 3.320,00 não confere com nenhuma faixa. Manter os preços da 1ª semana dá 2 · 2 290 = 4 580; usar a faixa acima de 200 dá 44 · 15 + 116 · 18 = 2 748.
- conta conferida: `44*15+116*18` → 2748

### ac24dc12 · A [8,4 × 10³] (gab C)
- antes: 8,4 × 10³. Provavelmente descontou zeros demais na última divisão: 8,4 × 10¹⁶ ÷ 10¹³ = 8,4 × 10³. Giga são 9 zeros, não 13.
- depois: 8,4 × 10³ fica 10⁴ vezes abaixo do certo. A diferença é 7 × 10⁹ tep × 1,2 × 10⁷ Wh = 8,4 × 10¹⁶ Wh, e ÷ 10⁹ dá 8,4 × 10⁷ GWh.
- conta conferida: `7e9*1.2e7/1e9` → 8.4e+07

### ac24dc12 · B [8,4 × 10⁵] (gab C) ✔
- antes: 8,4 × 10⁵. Provavelmente descontou o giga duas vezes: dividiu por 10⁹ (correto) e tirou mais 10² por conta do 1,2 × 10⁷, chegando a 8,4 × 10¹⁶ ÷ 10¹¹ = 8,4 × 10⁵.
- depois: 8,4 × 10⁵ fica 10² vezes abaixo do certo. Em Wh a diferença é 8,4 × 10¹⁶; passar para GWh é dividir só por 10⁹, o que dá 8,4 × 10⁷.
- conta conferida: `7e9*1.2e7/1e9` → 8.4e+07

### 8196566b · D [5,232 · 10¹³] (gab E)
- antes: 5,232 ⋅ 10¹³ é exatamente o dobro da resposta (2 × 2,616 = 5,232). Provavelmente contou cada orçamento duas vezes na hora de somar.
- depois: 5,232 · 10¹³ é o dobro exato da soma certa (2 × 2,616 = 5,232). A soma tem só as três parcelas: 2,132 + 0,088 + 0,396 = 2,616, em 10¹³.
- conta conferida: `2*(4.1e12*5.2+2.2e13*0.04+7.2e11*5.5)` → 5.232e+13

### 4c8a0383 · D [milhões.] (gab E)
- antes: 'milhões'. Provavelmente não usou os dados e se guiou por um fatorial familiar: 10! = 3 628 800, uns 3,6 milhões. Acontece que de 10! para 16! ainda se multiplica por 11 × 12 × 13 × 14 × 15 × 16 = 5 765 760, o que empurra o resultado sete casas acima, para 10¹³.
- depois: Milhões são a casa de 10⁶, a de 10! = 3 628 800. Com os dados, log 16! = log 15! + 4 · log 2 = 12 + 1,2 = 13,2: a casa é 10¹³, trilhões.
- conta conferida: `12+4*0.3` → 13.2

### b4e59de5 · A [2271.] (gab B)
- antes: 2271 é 255 anos depois de 2016, e 255 = 15 × 17: é múltiplo de 17, mas não de 13 (255 ÷ 13 = 19,6). Nesse ano só a espécie de 17 anos aparece. Provavelmente multiplicou 17 por 15 em vez de por 13.
- depois: 2271 fica 255 anos depois de 2016, e 255 = 15 × 17 é múltiplo de 17, mas não de 13 (255 ÷ 13 ≈ 19,6). Nesse ano só a C2 emerge.
- conta conferida: `2016+15*17` → 2271

### b4e59de5 · C [2145.] (gab B)
- antes: 2145 é 129 anos depois de 2016, e 129 não é múltiplo de 13 (129 ÷ 13 = 9,9) nem de 17 (129 ÷ 17 = 7,6): nesse ano nenhuma das duas espécies emerge. Provavelmente errou o produto 13 × 17, que dá 221.
- depois: 2145 fica 129 anos depois de 2016, e 129 não é múltiplo de 13 (≈ 9,9) nem de 17 (≈ 7,6). O reencontro vem após 13 × 17 = 221 anos.
- conta conferida: `2016+129` → 2145

### 10a1dc7e · C [24 dias.] (gab D)
- antes: Provavelmente devolve um número que já estava no enunciado: as 24 h de trabalho do terceiro funcionário. Esse 24 é jornada, não resposta — e o 24 que aparece na solução é o número de horas de um dia, usado para dividir.
- depois: 24 dias são 576 h, e 576 não é múltiplo de 54 (576 ÷ 54 ≈ 10,7): o segundo funcionário está no meio do ciclo. O primeiro encontro é em 432 h.
- conta conferida: `24*24/54` → 10.6667

### 72fdc10b · A [15.] (gab D)
- antes: Provavelmente devolve o próprio divisor que está no enunciado. O 15 é o número por quem se divide; a pergunta é quantos pares (a, b) funcionam, e para cada um dos 2 valores de b existem 3 valores de a.
- depois: 15 é o divisor do enunciado, não uma contagem. O b só pode ser 0 ou 5, e cada um aceita 3 valores de a: 2 × 3 = 6 números.
- conta conferida: `2*3` → 6

### 72fdc10b · C [9.] (gab D)
- antes: Provavelmente conta 3 valores para o a, 3 valores para o b e multiplica 3 × 3. O b não tem 3 opções: o critério do 5 deixa apenas 0 e 5, e para cada um deles os valores de a são diferentes.
- depois: 9 não confere. O critério do 5 deixa só b = 0 ou b = 5, e cada um aceita 3 valores de a: 2 × 3 = 6.
- conta conferida: `2*3` → 6

### 14854ecf · C [2 499.] (gab A)
- antes: Vem de tomar r = 2, ou de fazer 500 × 5 = 2 500 e tirar 1 para 'ser o menor'. Tirar 1 no chute não respeita a identidade: cada N só vale se N + 43 for 2 540, 2 541, 2 542, 2 543 ou 2 544.
- depois: 2 499 também cumpre a condição (2 499 + 43 = 2 542 = 5 × 508 + 2), mas não é o menor. Com resto 0, N = 2 540 − 43 = 2 497.
- conta conferida: `2542-43` → 2499

### 48de18d0 · D [68.] (gab B)
- antes: Provavelmente acha o lado de 34 cm e dobra o valor por causa das duas cores (34 × 2 = 68), ou soma 34 + 34. O número de peças sai de multiplicar 6 por 11; ele não tem relação com dobrar o 34.
- depois: 68 = 2 × 34 é o dobro do lado do retalho, uma medida, não uma contagem. O número de retalhos é (204 ÷ 34) × (374 ÷ 34) = 6 × 11 = 66.
- conta conferida: `2*34` → 68

### 48de18d0 · E [51.] (gab B)
- antes: Provavelmente monta o MDC com fatores que não são comuns aos dois números: 3 × 17 = 51. O 3 aparece apenas no 204, então 374 ÷ 51 ≈ 7,3 não é divisão exata e um quadrado de 51 cm de lado não recobriria o tapete.
- depois: 51 não é uma contagem possível. O lado tem de dividir 204 e 374; com o maior deles, 34 cm, a grade é 6 × 11 = 66. Lados menores dão mais retalhos.
- conta conferida: `(204//34)*(374//34)` → 66

### ff77e026 · B [um quadrado perfeito.] (gab C)
- antes: Provavelmente usa só a primeira condição — sobra 1 na caixa de 2, ou seja, o número é ímpar — e procura na faixa um ímpar que também seja quadrado perfeito, parando em 81 = 9 × 9. Mas 81 ÷ 5 deixa resto 1, e o enunciado exige resto 4.
- depois: Quadrado perfeito não serve: n + 1 é múltiplo de 70, e na faixa só n = 69 atende. O único quadrado ímpar da faixa, 81, deixa resto 1 por 5, não 4.
- conta conferida: `81%5` → 1

### e768042d · A [Sexta-feira] (gab E) ✔
- antes: Sexta-feira. Provavelmente supôs uma caixa por dia: 12 caixas dariam 12 dias, e o dia 12 cai na sexta (dia 8 segunda, 9 terça, 10 quarta, 11 quinta, 12 sexta). Mas cada caixa de 1 000 mL rende mais de um dia, porque o consumo diário é de 750 mL.
- depois: Sexta sai de contar 1 litro por dia: 12 caixas, 12 dias, e o dia 12 é sexta. Como o consumo diário é 750 mL, o leite rende 12 000 ÷ 750 = 16 dias.
- conta conferida: `12000/750` → 16

### e768042d · C [Domingo] (gab E)
- antes: Domingo. Provavelmente arredondou os 16 dias para duas semanas cheias: o dia 14 é domingo (dia 7 e dia 14 fecham as semanas). Mas 16 dias são duas semanas MAIS dois dias.
- depois: Domingo é o 14.º dia, o fim de duas semanas. O leite rende 12 000 ÷ 750 = 16 dias, dois a mais: o último é terça.
- conta conferida: `12000/750` → 16

### b6ed856c · B [par e não divisível por 4.] (gab A)
- antes: 'par e não divisível por 4' não serve para nenhum valor possível: como N − 1 é múltiplo de 12 (sempre par), N é sempre ímpar — 13, 25, 37, 49 e assim por diante. Provavelmente quem marca B contou o aluno de fora duas vezes: 36 nos grupos, mais 1 de fora, mais 1 somado por engano, dando 38, que é par e não divisível por 4.
- depois: 'Par e não divisível por 4' não serve: N − 1 é múltiplo de 12, que é par, então N é sempre ímpar (13, 25, 37, 49...).
- conta conferida: `37%2` → 1

### b6ed856c · E [cubo perfeito.] (gab A)
- antes: 'cubo perfeito' não serve para nenhum valor da lista (13, 25, 37, 49, 61, 73...). Provavelmente testou 27 = 3³ ou 64 = 4³: 27 ÷ 4 deixa resto 3 (e não 1), e 64 ÷ 4 é exato (não sobra ninguém). Nenhum dos dois atende às duas condições do enunciado.
- depois: Cubo perfeito não serve: N = 37 não é cubo. Os cubos próximos, 27 e 64, deixam resto 3 e 0 na divisão por 4, e não 1.
- conta conferida: `(27%4,64%4)` → (3, 0)

### ef1a1d02 · B [20] (gab C)
- antes: Provavelmente interrompe a conta no passo 2 e entrega o número que acabou de achar: os 20 L de gasolina. Testando: acrescentar 20 L de álcool deixa 50 L de álcool contra 20 L de gasolina, e 20 : 50 é 2 : 5.
- depois: 20 L é a gasolina que já está no tanque, não o acréscimo. Com 20 L de álcool a mais, ficam 20 : 50 = 2 : 5, e não 1 : 3.
- conta conferida: `20/(30+20)` → 0.4

### E04f8565 · B [2,75%.] (gab D)
- antes: 2,75 % corresponderia a uma palavra de 2,75 ÷ 1,5 ≈ 1,83 cm, quase do tamanho de 'azul'. Provavelmente vem de olhar o desenho no olho e supor que 'mundo' é só um pouco maior que 'azul', ignorando os números 1 e 3,5 da régua.
- depois: 2,75 % pediria uma palavra de 2,75 ÷ 1,5 ≈ 1,83 cm. 'Mundo' mede 1 + 3,5 = 4,5 cm, o que dá 4,5 × 1,5 % = 6,75 %.
- conta conferida: `2.75/1.5` → 1.83333

### d6e49c70 · A [0,12] (gab B)
- antes: Provavelmente arredonda a razão das massas para 0,88 (o que corresponde a usar RM ÷ RH ≈ 0,73 em vez de 0,707) e faz 1 − 0,88 = 0,12. Arredondar grosso no meio da conta derruba a segunda casa decimal do resultado, que é justamente onde as alternativas se diferenciam.
- depois: 0,12 exigiria que (M × RM) ÷ (H × RH) valesse 0,88. Com os dados, ela vale 1,2 × 1 330,75 ÷ 1 881,75 ≈ 0,849, e o CDRS fica em torno de 0,15.
- conta conferida: `1.2*1330.75/1881.75` → 0.848625

### d6e49c70 · C [0,20] (gab B)
- antes: Provavelmente arredonda 1 330,75 ÷ 1 881,75 para 2 ÷ 3 ≈ 0,67; aí 1,2 × 0,67 = 0,80 e 1 − 0,80 = 0,20. Mas 1 330,75 ÷ 1 881,75 é 0,707, mais perto de 0,71 do que de 0,67.
- depois: 0,20 exigiria RM ÷ RH ≈ 0,67, para a razão total dar 1,2 × 0,67 ≈ 0,80. O valor real é 1 330,75 ÷ 1 881,75 ≈ 0,707.
- conta conferida: `1330.75/1881.75` → 0.707187

### d6e49c70 · D [0,24] (gab B)
- antes: Provavelmente calcula primeiro a desigualdade só de salário, 1 − 1 330,75 ÷ 1 881,75 ≈ 0,293, e depois DIVIDE por 1,2 em vez de aplicar o 1,2 dentro da fração: 0,293 ÷ 1,2 ≈ 0,24. O 1,2 multiplica a massa de rendimento das mulheres antes de subtrair de 1; ele não pode ser aplicado no resultado final.
- depois: 0,24 exigiria que (M × RM) ÷ (H × RH) valesse 0,76. Ela vale 1,2 × 0,707 ≈ 0,849, bem mais, então o CDRS é menor.
- conta conferida: `1.2*1330.75/1881.75` → 0.848625

### 857e13da · A [25.] (gab C)
- antes: Provavelmente escreve a razão como 47 + C = 3/8 de 272, sem descontar o C dos adultos, e ainda passa um C para o outro lado: 47 + C = 102 − C dá C = 27,5, que o aluno arredonda para a alternativa 25. Teste: com 25, as crianças somam 72 e os adultos 247, e 72 ÷ 247 ≈ 0,29, não 0,375.
- depois: Com 25 crianças no domingo, elas somam 47 + 25 = 72 e os adultos 144 + 103 = 247. 72 ÷ 247 ≈ 0,29, não 3/8 = 0,375.
- conta conferida: `72/247` → 0.291498

### 857e13da · E [31.] (gab C)
- antes: Provavelmente aplica a razão 3:8 só ao domingo: 128 cortes em 3 + 8 = 11 partes dá 128 ÷ 11 ≈ 11,6 e 3 partes ≈ 34,9, valor que o aluno aproxima para a alternativa 31. Isso joga fora os 47 e os 144 do sábado, que a razão do enunciado inclui. Teste: com 31, as crianças somam 78 e os adultos 241, e 78 ÷ 241 ≈ 0,32.
- depois: Com 31 crianças no domingo, elas somam 47 + 31 = 78 e os adultos 144 + 97 = 241. 78 ÷ 241 ≈ 0,32, não 3/8 = 0,375.
- conta conferida: `78/241` → 0.323651

### Ecacd283 · A [490.] (gab E)
- antes: Provavelmente manteve o chocolate da tarde igual ao da manhã, 200 L, e usou a razão só para achar a baunilha: 5 ÷ 2 × 200 = 500 L, marcando o valor mais próximo da lista, 490. O enunciado nunca diz que o chocolate repetiu de manhã para a tarde; ele dá apenas o total da tarde e a razão.
- depois: Com 490 L de baunilha, sobram 630 − 490 = 140 L de chocolate à tarde, e 140 : 490 = 2 : 7, não 2 : 5.
- conta conferida: `140/490` → 0.285714

### Ecacd283 · B [570.] (gab E)
- antes: Provavelmente leu "superou em 110 litros" como "foi 110 % do total da manhã": 1,10 × 520 = 572, arredondado para 570. Superar em 110 litros é somar 110, não multiplicar por 1,10.
- depois: Com 570 L de baunilha, sobram 630 − 570 = 60 L de chocolate à tarde, e 60 : 570 = 2 : 19, não 2 : 5.
- conta conferida: `60/570` → 0.105263

### Ecacd283 · C [530.] (gab E)
- antes: Provavelmente somou os 110 litros duas vezes (520 + 110 + 110 = 740) e tirou 5 das 7 partes: 5 ÷ 7 × 740 = 528,6, arredondado para 530. O 110 entra uma vez só.
- depois: Com 530 L de baunilha, sobram 630 − 530 = 100 L de chocolate à tarde, e 100 : 530 = 10 : 53, longe de 2 : 5.
- conta conferida: `100/530` → 0.188679

### 997a85b7 · C [190.] (gab A)
- antes: Provavelmente acha as 180 utilizadas e soma as 15 seringas transferidas (180 + 15 = 195), arredondando para 190; as 15 não são o grupo das não utilizadas, que vale 2 × 20 = 40. O filtro também reprova esse número: 190 ÷ 11 ≈ 17,3, ou seja 190 não se divide em 11 partes iguais e não existe razão 2:9 com esse total.
- depois: 190 não serve: o total é 2k + 9k = 11k, múltiplo de 11, e 190 ÷ 11 ≈ 17,3. Com k = 20, o total é 220.
- conta conferida: `190/11` → 17.2727

### 997a85b7 · D [200.] (gab A)
- antes: Provavelmente acha as 180 utilizadas e soma só UMA parte de 20 em vez das duas partes de seringas não utilizadas (40): 180 + 20 = 200. Teste: 200 não é múltiplo de 11 e, com 180 utilizadas, as não utilizadas seriam 20, dando 20 ÷ 180 = 1 ÷ 9 e não 2 ÷ 9.
- depois: 200 não serve: o total é 11k, múltiplo de 11, e 200 ÷ 11 ≈ 18,2. Com 180 utilizadas, sobrariam 20, e 20 ÷ 180 = 1/9, não 2/9.
- conta conferida: `200/11` → 18.1818

### 997a85b7 · E [210.] (gab A)
- antes: Provavelmente acha as 180 utilizadas e soma 2 × 15 = 30, confundindo as 15 seringas transferidas com as partes da razão. Teste: 210 ÷ 11 ≈ 19,1, então 210 também não se divide na razão 2:9.
- depois: 210 não serve: o total é 11k, múltiplo de 11, e 210 ÷ 11 ≈ 19,1. Com k = 20, o total é 220.
- conta conferida: `210/11` → 19.0909

### 907bcd2a · A [54 000.] (gab C)
- antes: Provavelmente erra o produto 4 × 1 200, usando 4 000, e resolve 8k = 20 000 − 4 000 = 16 000, o que dá k = 2 000 e 27 × 2 000 = 54 000. Teste: com k = 2 000, a razão do dia seria 60 000 ÷ 15 200 ≈ 3,95, e não 4. (Outro caminho que cai aqui é aplicar a razão 4 já na primeira metade do dia, que é justamente o que o enunciado não diz.)
- depois: 54 000 = 27 × 2 000 daria k = 2 000. A razão do dia seria (40 000 + 20 000) ÷ (14 000 + 1 200) ≈ 3,95, não 4.
- conta conferida: `60000/15200` → 3.94737

### 907bcd2a · B [56 700.] (gab C) ✔
- antes: Provavelmente erra a conta 4 × 1 200 por baixo e resolve 8k = 16 800, chegando a k = 2 100 e 27 × 2 100 = 56 700. Teste: com k = 2 100, a razão do dia seria 62 000 ÷ 15 900 ≈ 3,90, e não 4.
- depois: 56 700 = 27 × 2 100 daria k = 2 100. A razão do dia seria (42 000 + 20 000) ÷ (14 700 + 1 200) ≈ 3,90, não 4.
- conta conferida: `62000/15900` → 3.89937

### 907bcd2a · D [48 600.] (gab C)
- antes: Provavelmente erra a última divisão, tomando 15 200 ÷ 8 como 1 800 (8 × 1 800 = 14 400, não 15 200); 27 × 1 800 = 48 600. Teste: com k = 1 800, a razão do dia seria 56 000 ÷ 13 800 ≈ 4,06, e não 4.
- depois: 48 600 = 27 × 1 800 daria k = 1 800. A razão do dia seria (36 000 + 20 000) ÷ (12 600 + 1 200) ≈ 4,06, não 4.
- conta conferida: `56000/13800` → 4.05797

### 907bcd2a · E [59 400.] (gab C)
- antes: Provavelmente divide 15 200 pelo 7 da razão em vez de pelo 8 da equação (15 200 ÷ 7 ≈ 2 171) e marca o múltiplo de 27 mais próximo, 27 × 2 200 = 59 400. Teste: com k = 2 200, a razão do dia seria 64 000 ÷ 16 600 ≈ 3,86, e não 4.
- depois: 59 400 = 27 × 2 200 daria k = 2 200. A razão do dia seria (44 000 + 20 000) ÷ (15 400 + 1 200) ≈ 3,86, não 4.
- conta conferida: `64000/16600` → 3.85542

### 1c51501c · D [169.] (gab A) ✔
- antes: Provavelmente o mesmo começo errado (4 : 5 : 11, sem igualar o termo comum) com outro arredondamento no fim. Um teste rápido descarta: a resposta tem de ser 27 × k com k inteiro, e 169 não é múltiplo de 27, porque 27 × 6 = 162 e 27 × 7 = 189.
- depois: 169 não serve: a diferença entre cinzas e azuis vale 55 − 28 = 27 partes, e 169 não é múltiplo de 27 (27 × 6 = 162; 27 × 7 = 189).
- conta conferida: `169/27` → 6.25926

### 1c51501c · E [179.] (gab A)
- antes: Provavelmente quem monta a proporção certa e erra a subtração das quantidades reais, fazendo 385 − 206 em vez de 385 − 196, já que 28 × 7 = 196. O mesmo teste descarta: 179 não é múltiplo de 27.
- depois: 179 não serve: a diferença entre cinzas e azuis vale 27 partes, e 179 não é múltiplo de 27. Com k = 7, são 385 − 196 = 189.
- conta conferida: `385-196` → 189

### 6a5988ad · B [4 e 125.] (gab A)
- antes: Acerta os 4 elementos e erra a divisão. Provavelmente embaralha as vírgulas e calcula 99 ÷ 0,8 = 123,75 em vez de 9,9 ÷ 0,18, marcando 125. Teste pela volta: 125 × 180 mg = 22 500 mg = 22,5 g, mais que o dobro da dose letal de 9,9 g.
- depois: 125 xícaras dariam 125 × 180 mg = 22,5 g, mais que o dobro da dose letal. O mínimo é 9 900 ÷ 180 = 55 xícaras.
- conta conferida: `125*180/1000` → 22.5

### 489813f1 · A [1,5] (gab E)
- antes: Provavelmente faz a conversão duas vezes: divide 2 190 por 687 (≈ 3,2) e depois divide de novo por 1,88, que é quanto vale um ano marciano em anos terrestres, chegando a cerca de 1,7 e marcando 1,5. Teste: 1,5 ano marciano é 1,5 × 687 ≈ 1 030 dias terrestres, menos de 3 anos terrestres, quando só a espera já é de 6 anos.
- depois: 1,5 ano marciano são 1,5 × 687 ≈ 1 030 dias terrestres, menos que os 2 190 dias só de espera. O total é 2 400 ÷ 687 ≈ 3,5.
- conta conferida: `1.5*687` → 1030.5

### 489813f1 · B [2,0] (gab E)
- antes: Provavelmente converte o total para anos terrestres (2 400 ÷ 365 ≈ 6,6) e divide por 3, usando 'um ano marciano vale uns 3 anos terrestres', quando ele vale 1,88. Teste: 2 × 687 = 1 374 dias, ou seja 3,8 anos terrestres, menos que a própria espera.
- depois: 2 anos marcianos são 2 × 687 = 1 374 dias terrestres, menos que os 2 190 dias de espera. O total é 2 400 ÷ 687 ≈ 3,5.
- conta conferida: `2*687` → 1374

### 489813f1 · C [2,5] (gab E)
- antes: Provavelmente arredonda 687 para 1 000 dias antes de dividir: 2 400 ÷ 1 000 = 2,4, que o aluno aproxima para 2,5. Arredondar o divisor em quase 50 % destrói o resultado. Teste: 2,5 × 687 ≈ 1 718 dias, isto é 4,7 anos terrestres, ainda abaixo dos 6,6 anos do enunciado.
- depois: 2,5 anos marcianos são 2,5 × 687 ≈ 1 718 dias terrestres, menos que os 2 190 dias de espera. O total é 2 400 ÷ 687 ≈ 3,5.
- conta conferida: `2.5*687` → 1717.5

### e7a3ade5 · A [14 000.] (gab E) ✔
- antes: Provavelmente lê o dado errado e divide por 1,35 em vez de 1,85 (18 720 ÷ 1,35 ≈ 13 867), marcando 14 000. Teste pela volta: 14 000 milhas × 1,85 = 25 900 km, distância que, a 15 km/h, exigiria cerca de 1 727 h, isto é 72 dias de viagem, e não 52.
- depois: 14 000 milhas × 1,85 = 25 900 km, mas o navio percorreu 15 × 24 × 52 = 18 720 km. Isso dá 18 720 ÷ 1,85 ≈ 10 100 milhas.
- conta conferida: `14000*1.85` → 25900

### e7a3ade5 · B [13 000.] (gab E)
- antes: Provavelmente faz a divisão 'de cabeça' como se fosse tirar 30 % (18 720 × 0,7 ≈ 13 104) e marca 13 000. Dividir por 1,85 não é tirar 30 %, é ficar com cerca de 54 % do número. Teste pela volta: 13 000 × 1,85 = 24 050 km, bem acima dos 18 720 km percorridos.
- depois: 13 000 milhas × 1,85 = 24 050 km, acima dos 18 720 km percorridos (15 km/h × 24 h × 52 dias).
- conta conferida: `13000*1.85` → 24050

### e7a3ade5 · C [12 000.] (gab E)
- antes: Provavelmente arredonda o dado para 1,5 km por milha antes de dividir: 18 720 ÷ 1,5 = 12 480, que o aluno aproxima para 12 000. Teste pela volta: 12 000 × 1,85 = 22 200 km, mais do que o navio andou.
- depois: 12 000 milhas × 1,85 = 22 200 km, acima dos 18 720 km percorridos (15 km/h × 24 h × 52 dias).
- conta conferida: `12000*1.85` → 22200

### e7a3ade5 · D [11 000.] (gab E)
- antes: Provavelmente arredonda o dado para 1,7 km por milha: 18 720 ÷ 1,7 ≈ 11 012, marcando 11 000. É o erro mais sutil da lista, por isso convém sempre voltar: 11 000 × 1,85 = 20 350 km, ainda acima dos 18 720 km calculados.
- depois: 11 000 milhas × 1,85 = 20 350 km, ainda acima dos 18 720 km percorridos. A conta certa dá 18 720 ÷ 1,85 ≈ 10 119 milhas.
- conta conferida: `18720/1.85` → 10118.9

### dec763bd · A [R$ 43,20.] (gab D)
- antes: Divide só a gasolina pelos cinco (216,00 ÷ 5 = 43,20) e esquece os pedágios. É o distrator exato desse esquecimento: a diferença até a resposta certa, R$ 7,84, é justamente a parte de cada um nos pedágios.
- depois: R$ 43,20 sai de dividir só a gasolina: 216,00 ÷ 5 = 43,20. Faltam os pedágios de ida e volta, 39,20 ÷ 5 = R$ 7,84 por pessoa.
- conta conferida: `216/5` → 43.2

### 7fa8608d · C [1,7 135] (gab A) ✔
- antes: Copia o 1,7 do texto sem multiplicar pelas 9 t nem dividir pelas 12 h, e no açúcar provavelmente usa 15 kg por tonelada em vez de 150 (9 × 15 = 135). Os dois números vêm de ler o dado em vez de usá-lo.
- depois: 1,7 é a energia de uma tonelada, sem passar para a jornada: 9 × 1,7 ÷ 12 ≈ 1,3 Gcal/h. E 135 kg é um décimo de 9 × 150 = 1 350 kg.
- conta conferida: `9*1.7/12` → 1.275

### 0d13158f · A [162,5 km.] (gab C)
- antes: Provavelmente lê a figura 2 no olho, parando um pouco adiante do tracinho do meio: 162,5 km equivalem a 162,5 ÷ 60 ≈ 2,71 quadradinhos. A barra existe justamente para não precisar estimar, e a pintura para exatamente no tracinho da metade do terceiro quadradinho.
- depois: 162,5 km equivalem a 162,5 ÷ 60 ≈ 2,7 quadradinhos. A figura 2 marca 2,5 quadradinhos, e 2,5 × 60 = 150 km.
- conta conferida: `162.5/60` → 2.70833

### 0d13158f · D [154 km.] (gab C) ✔
- antes: Provavelmente conta 7 quadradinhos pintados na figura 1 e 3 na figura 2: 360 ÷ 7 ≈ 51,4 km cada e 3 × 51,4 ≈ 154 km. Na figura 1 são 6 pintados, e na figura 2 a pintura para no meio do terceiro quadradinho, valendo 2,5.
- depois: 154 km equivalem a 154 ÷ 60 ≈ 2,57 quadradinhos, que a barra não marca. Ela mostra 2,5 quadradinhos: 2,5 × 60 = 150 km.
- conta conferida: `154/60` → 2.56667

### 0d13158f · E [160 km.] (gab C)
- antes: Provavelmente lê a figura 2 como dois terços do terceiro quadradinho (2,67 × 60 = 160 km) ou arredonda a resposta certa para um número mais redondo. O tracinho do meio só permite ler quadradinho inteiro ou metade, e 2,5 quadradinhos dão exatamente 150 km.
- depois: 160 km equivalem a 160 ÷ 60 ≈ 2,67 quadradinhos. A figura 2 para na metade do terceiro: 2,5 × 60 = 150 km.
- conta conferida: `160/60` → 2.66667

### 2c968302 · C [1 000.] (gab B)
- antes: Provavelmente vem de usar de cabeça uma regra decorada do tipo 'em mapa, 1 cm vale 100 km' e fazer 10 × 100 = 1 000, sem olhar o 25 000 000 que a questão deu. Cada escala tem o seu próprio valor por centímetro, e nesta 1 cm vale 250 km.
- depois: 1 000 km dariam 100 km por centímetro, escala 1 : 10 000 000. Em 1 : 25 000 000, cada centímetro vale 250 km, e 10 cm valem 2 500 km.
- conta conferida: `1000/10` → 100

### 2c968302 · D [500.] (gab B)
- antes: Provavelmente vem de dividir o resultado certo pelos 5 dias entre os dois jogos (12 e 17 de junho): 2 500 ÷ 5 = 500, como se a pergunta fosse quantos quilômetros por dia.
- depois: 500 km dariam 50 km por centímetro, escala 1 : 5 000 000. Em 1 : 25 000 000, 10 cm valem 10 × 250 = 2 500 km.
- conta conferida: `500/10` → 50

### 081b01af · A [3h52min.] (gab D)
- antes: Provavelmente vem de duas trocas somadas: usar 25 dentes no lugar dos 30 de B, o que dá 120 ÷ 25 = 4,8 giros (4 h 48 min), e ainda girar o relógio para trás: 8 h 40 min − 4 h 48 min = 3 h 52 min. Repare que é o único horário da lista que não está a um número inteiro de horas de 8h40min, sinal de que a razão de dentes foi trocada.
- depois: 3h52min não pode ser: D dá 4 voltas inteiras, e cada volta é 1 hora cheia. Os minutos continuam em 40, e o sentido indicado adianta o relógio.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### 7a3db28a · D [R2 = 1,50 . R1] (gab E)
- antes: Provavelmente vem de trocar os percentuais de lugar e esquecer o quadrado: 1,20 ÷ 0,80 = 1,50. O 60 % é do comprimento (fator 1,60) e o 20 % é do diâmetro (fator 0,80, que ainda vai ao quadrado).
- depois: 1,50 não confere: R₂ ÷ R₁ = 1,60 ÷ 0,80² = 1,60 ÷ 0,64 = 2,50. Mesmo esquecendo o quadrado, 1,60 ÷ 0,80 daria 2,00.
- conta conferida: `1.6/0.8**2` → 2.5

### deb002c4 · A [1,40.] (gab C)
- antes: Provavelmente vem de arredondar antes da hora: trocar a razão 0,66 por 0,70 e inverter, 1 ÷ 0,70 = 1,4285..., o que puxa para 1,40. Arredondar antes de dividir mexe justamente na segunda casa decimal, onde as alternativas se separam.
- depois: 1,40 não confere: a razão de preços é a inversa das áreas, 400 ÷ 264 ≈ 1,52. Para dar 1,40, o setor C teria 264 × 1,40 ≈ 370 m².
- conta conferida: `264*1.4` → 369.6

### deb002c4 · D [1,15.] (gab C)
- antes: Provavelmente vem de comparar os setores por diferença e não por razão, ou de usar alguma medida linear da planta no lugar da área. Não há conta direta com 264 m² e 400 m² que caia em 1,15: esse valor atende quem só concluiu que o ingresso de B é um pouco mais caro e escolheu o menor número acima de 1.
- depois: 1,15 não confere: a razão de preços é 400 ÷ 264 ≈ 1,52. Para dar 1,15, o setor C teria 264 × 1,15 ≈ 304 m², e ele tem 400 m².
- conta conferida: `264*1.15` → 303.6

### c24fc6d8 · A [R$ 58.000,00.] (gab B)
- antes: Provavelmente somou errado o total pago, usando 90 no lugar de 84: 5 250 000 ÷ 90 = 58 333, que arredonda para os R$ 58.000,00 da lista. O total correto é 28 + 21 + 35 = 84.
- depois: R$ 58.000,00 não confere. Caio pagou 35 de 84, isto é 5/12 do custo, e 5/12 de 150 000 = 62 500.
- conta conferida: `150000*35/84` → 62500

### c24fc6d8 · D [R$ 61.000,00.] (gab B)
- antes: Provavelmente errou a soma dos pagamentos para 86 (28 + 21 + 35 contado com um a mais duas vezes): 5 250 000 ÷ 86 = 61 046, que arredonda para os R$ 61.000,00.
- depois: R$ 61.000,00 não confere. Caio pagou 35 de 84, isto é 5/12 do custo, e 5/12 de 150 000 = 62 500.
- conta conferida: `150000*35/84` → 62500

### c24fc6d8 · E [R$ 64.000,00.] (gab B)
- antes: Provavelmente errou a soma dos pagamentos para 82: 5 250 000 ÷ 82 = 64 024, que arredonda para os R$ 64.000,00. Repare como um deslize de dois reais no total muda a resposta em milhares.
- depois: R$ 64.000,00 passa da parte de Caio. Ele pagou 35 de 84, isto é 5/12 do custo, e 5/12 de 150 000 = 62 500.
- conta conferida: `150000*35/84` → 62500

### 70d931f4 · A [1] (gab C)
- antes: 1 não sai de conta nenhuma. Parar em 0,177 × 0,45 = 0,0797 daria um número perto de 0, e não de 1: esse 0,0797 é a fração do grupo, e falta multiplicar por 100 para virar gente: 0,0797 × 100 = 7,97.
- depois: 1 fica muito abaixo do certo: 0,177 × 0,45 = 0,0797, e em cada 100 paulistanos isso dá 0,0797 × 100 ≈ 7,97, perto de 8.
- conta conferida: `0.177*0.45*100` → 7.965

### 24e017c6 · B [Coffea excelsa.] (gab D)
- antes: Coffea excelsa (1,9 %) daria 0,019 × 500 = 9,5 g, e não os 11 g medidos. Provavelmente vem de arredondar 11 g para 10 g, achar 2 % e descer para o vizinho de baixo do quadro em vez de subir.
- depois: Coffea excelsa (1,9 %) daria 0,019 × 500 = 9,5 g, e não os 11 g medidos. A taxa medida é 11 ÷ 500 = 2,2 %.
- conta conferida: `0.019*500` → 9.5

### 24e017c6 · E [Coffea robusta.] (gab D)
- antes: Coffea robusta (2,4 %) daria 0,024 × 500 = 12 g. Provavelmente vem de arredondar os 11 g para 12 g para facilitar a divisão, ou de escolher a variedade com mais cafeína por eliminação.
- depois: Coffea robusta (2,4 %) daria 0,024 × 500 = 12 g, 1 g acima do medido. A taxa medida é 11 ÷ 500 = 2,2 %.
- conta conferida: `0.024*500` → 12

### 02199bcc · D [48%.] (gab A)
- antes: 48 % — Provavelmente vem de achar o fator 1,52 e responder o que falta para completar 100 (100 − 52 = 48), como se o aumento fosse o complemento. Um aumento de 48 % exigiria uma base de 1 113 ÷ 1,48 = 752 casos em janeiro, e o texto informa 732.
- depois: 48 % exigiria 1 113 ÷ 1,48 ≈ 752 casos em janeiro, e o boletim informa 732. O aumento é (1 113 − 732) ÷ 732 ≈ 52 %.
- conta conferida: `1113/1.48` → 752.027

### 9056628e · A [114 a 143.] (gab C)
- antes: 114 a 143 — Provavelmente parte de uma frequência máxima de 190 bpm, porque 114 ÷ 0,60 = 190 e 0,75 × 190 = 142,5, que arredonda para 143. Os 190 apareceriam ao subtrair 30 em vez de 40, ou ao trocar o 220 por 230; com K = 220 e 40 anos o máximo é 180 bpm.
- depois: 114 a 143 corresponde a um máximo de 190 bpm: 0,60 × 190 = 114 e 0,75 × 190 = 142,5. Para um homem de 40 anos, o máximo é 220 − 40 = 180.
- conta conferida: `0.6*190` → 114

### 9056628e · E [102 a 128.] (gab C)
- antes: 102 a 128 — Provavelmente parte de uma frequência máxima de 170 bpm, porque 102 ÷ 0,60 = 170 e 0,75 × 170 = 127,5, arredondado para 128. Os 170 sairiam de 220 − 50 ou de 210 − 40, enquanto a conta certa é 220 − 40 = 180.
- depois: 102 a 128 corresponde a um máximo de 170 bpm: 0,60 × 170 = 102 e 0,75 × 170 = 127,5. Para um homem de 40 anos, o máximo é 220 − 40 = 180.
- conta conferida: `0.6*170` → 102

### c1579444 · B [38.] (gab D)
- antes: 38 não sai de conta nenhuma. A leitura errada mais próxima, entender 'na metade da distância' como metade do que ainda falta, põe o posto em 25 % + 37,5 % = 62,5 % do trajeto e dá 14,5 ÷ 0,375 = 38,67, que arredonda para 39, e não 38. A metade citada é a do trajeto todo, entre as duas cidades.
- depois: Com 38 km, o posto fica em 19 km e a quebra em 9,5 km. O trecho entre eles seria 9,5 km, não 14,5 km.
- conta conferida: `38/2-38/4` → 9.5

### c1579444 · C [48.] (gab D)
- antes: 48 — Provavelmente sai de trocar o quarto do trajeto por 30 %: 14,5 ÷ 0,30 = 48,3. Conferindo no desenho, 48 km dariam metade em 24 km e 25 % em 12 km, com um pedaço de 12 km entre os pontos, e não de 14,5 km.
- depois: Com 48 km, o posto fica em 24 km e a quebra em 12 km. O trecho entre eles seria 12 km, não 14,5 km.
- conta conferida: `48/2-48/4` → 12

### c1579444 · E [96.] (gab D)
- antes: 96 — Provavelmente é o dobro do número da alternativa C, de quem dobra o resultado por achar que falta contar a outra metade do trajeto. Esse valor só fecharia se os 14,5 km fossem cerca de 15 % do caminho (14,5 ÷ 96 = 0,151); em 96 km, a metade é 48 km, 25 % é 24 km, e o pedaço entre os pontos seria de 24 km.
- depois: Com 96 km, o posto fica em 48 km e a quebra em 24 km. O trecho entre eles seria 24 km, não 14,5 km.
- conta conferida: `96/2-96/4` → 24

### 2eba8a7e · A [240.] (gab E)
- antes: 240 não sai de conta nenhuma. O caminho errado mais próximo, aplicar os 40 % sobre todos os tubos sem defeito sem descontar os 36 já usados (0,40 × 0,95x = 92, ou 0,38x = 92), dá x = 242,1, que nem é inteiro. Os 60 % e os 40 % incidem sobre o que sobrou depois dos 36 tubos usados.
- depois: Com 240 tubos: 228 sem defeito, 192 depois dos 36 usados, e 40 % de 192 = 76,8 nos armários, não 92.
- conta conferida: `0.4*(0.95*240-36)` → 76.8

### 2eba8a7e · D [260.] (gab E)
- antes: 260 não sai de conta nenhuma. O tropeço mais próximo é esquecer os 5 % com defeito: 92 ÷ 0,40 = 230, mais os 36 usados, dá 266, e não 260. Falta devolver os tubos defeituosos, dividindo 266 por 0,95, o que dá 280.
- depois: Com 260 tubos: 247 sem defeito, 211 depois dos 36 usados, e 40 % de 211 = 84,4 nos armários, não 92.
- conta conferida: `0.4*(0.95*260-36)` → 84.4

### 425a7ba1 · B [99.] (gab A) ✔
- antes: 99 — Provavelmente sai de errar o produto das duas taxas, escrevendo 0,80 × 0,35 = 0,218 em vez de 0,28. O coeficiente dos aprovados viraria 0,65 + 0,218 = 0,868, com 651 ÷ 0,868 = 750 e 750 − 651 = 99. O produto correto é 0,28.
- depois: Com 99 não aprovados, a turma teria 651 + 99 = 750 alunos. Mas 93 % de 750 = 697,5 aprovados, não 651.
- conta conferida: `0.93*750` → 697.5

### 425a7ba1 · C [149.] (gab A)
- antes: 149 — Provavelmente sai de aplicar os 80 % sobre todos os alunos, e não sobre os 35 % que reprovaram na primeira tentativa. Com 80 % de aprovação total, 0,80x = 651 daria x = 813,75 alunos e 162,75 não aprovados, e 149 é o valor mais próximo disso na lista. Os 80 % incidem só sobre quem reprovou de início.
- depois: Com 149 não aprovados, a turma teria 651 + 149 = 800 alunos. Mas 93 % de 800 = 744 aprovados, não 651.
- conta conferida: `0.93*800` → 744

### 425a7ba1 · D [199.] (gab A) ✔
- antes: 199 — Provavelmente sai de tomar os 28 % (0,80 × 0,35) como se fossem os REPROVADOS, e não os aprovados na segunda tentativa: 0,28 × 700 = 196, valor que puxa para 199. Os 28 % passaram; quem ficou são os 20 % dos 35 %, isto é 7 % do total.
- depois: Com 199 não aprovados, a turma teria 651 + 199 = 850 alunos. Mas 93 % de 850 = 790,5 aprovados, não 651.
- conta conferida: `0.93*850` → 790.5

### 7a87837b · E [32%.] (gab B)
- antes: Provavelmente é o erro da alternativa C levado mais um passo adiante: 60 % menos 20 pontos dá 40 %, e depois 40 % × 0,8 = 32 %. São dois descontos em sequência, um deles feito como subtração de pontos em vez de multiplicação.
- depois: 32 % fica abaixo do produto das três frações: 3/4 × 4/5 × 4/5 = 48/100. Para dar 32 %, a primeira fração teria de ser 1/2.
- conta conferida: `0.5*0.8*0.8` → 0.32

### 06c292ed · A [45%.] (gab E)
- antes: Provavelmente vem de somar aos 35 % apenas metade dos votos que faltam (0,35 + 0,10 = 0,45), supondo que no melhor caso X divide o restante com os adversários. No cenário máximo ele leva os 20 % inteiros, e os 35 % ainda precisavam virar 28 % do total.
- depois: 45 % não é o máximo. X já tem 0,80 × 0,35 = 28 % do total e, no melhor caso, leva os 20 % restantes: 48 %.
- conta conferida: `0.8*0.35+0.2` → 0.48

### 7196b27b · E [o candidato A disputará o 2º turno e teve 25% dos votos válidos.] (gab C)
- antes: Provavelmente vem de supor que 80 % dos votos são válidos, em vez de somar a tabela: 20,3 ÷ 80 ≈ 25 %. O percentual de válidos não se supõe, ele se calcula somando os quatro candidatos: 20,3 + 15,5 + 32,2 + 2,0 = 70 %.
- depois: 25 % não confere: os válidos somam 20,3 + 15,5 + 32,2 + 2,0 = 70 % dos votos, e A tem 20,3 ÷ 70 = 29 % deles.
- conta conferida: `20.3/70` → 0.29

### cfdb1b41 · B [66,5%.] (gab A)
- antes: Provavelmente vem de trocar o complementar: usar 80 % em vez de 92 % como fatia de alfabetizados entre os de 15 anos ou mais. Assim, 0,80 × 8 000 = 6 400, mais 250, dá 6 650, isto é, 66,5 %. O complementar de 8 % é 92 %.
- depois: 66,5 % sai de usar 80 % em vez de 92 %: 0,80 × 8 000 + 250 = 6 650, que é 66,5 % de 10 000. O complementar de 8 % é 92 %.
- conta conferida: `(0.8*8000+250)/10000` → 0.665

### cfdb1b41 · D [89,0%.] (gab A)
- antes: Provavelmente repete o erro do distrator anterior e ainda troca o sinal das crianças: 0,92 × 10 000 = 9 200 e 9 200 − 250 = 8 950, que é 89,5 % — e 89,0 % é o valor mais próximo disso na lista. São dois erros de uma vez: os 92 % valem só para os 8 000 de 15 anos ou mais, e as 250 crianças alfabetizadas entram somando, não subtraindo.
- depois: 89,0 % seriam 8 900 alfabetizados. Pela tabela, são 0,92 × 8 000 = 7 360 com 15 anos ou mais, mais 250 crianças: 7 610, ou 76,1 %.
- conta conferida: `0.92*8000+250` → 7610

### 50e72dfc · D [30,3%.] (gab C) ✔
- antes: 30,3 % — Provavelmente sai de montar o fator com o complemento: quem faz 1 − 0,465 = 0,535 e usa 1,535 como fator obtém 46,6 ÷ 1,535 = 30,36, e 30,3 % é o valor mais próximo desse número na lista. O fator de um aumento de 46,5 % é 1 + 0,465 = 1,465, e não 1,535.
- depois: 30,3 % não confere: 30,3 × 1,465 ≈ 44,4, e não 46,6. O valor de 2012 é 46,6 ÷ 1,465 ≈ 31,8 %.
- conta conferida: `30.3*1.465` → 44.3895

### 20c54bd1 · B [teve uma redução de mais de 1%.] (gab A)
- antes: Redução de mais de 1 % — Provavelmente vem de arredondar o 1,331 para 1,3 antes de aplicar o desconto: 1,3 × 0,75 = 0,975, o que apareceria como uma queda de 2,5 %. O desconto precisa ser calculado sobre 1,331, e aí a queda é de 0,175 %.
- depois: A queda é menor que 1 %: 1,10³ × 0,75 = 1,331 × 0,75 = 0,99825, isto é, 0,175 % abaixo do preço inicial.
- conta conferida: `1.1**3*0.75` → 0.99825

### 20c54bd1 · E [teve um aumento de menos de 1%.] (gab A)
- antes: Aumento de menos de 1 % — Provavelmente vem de calcular 1,10³ de cabeça como 1,34: 1,34 × 0,75 = 1,005, o que apareceria como um aumento de 0,5 %. O valor exato é 1,331, e 1,331 × 0,75 fica logo abaixo de 1.
- depois: Não houve aumento: 1,10³ × 0,75 = 1,331 × 0,75 = 0,99825, abaixo de 1. O preço final é 0,175 % menor que o inicial.
- conta conferida: `1.1**3*0.75` → 0.99825

### 4095ec33 · B [12 e 12,85.] (gab C)
- antes: 12 e 12,85 acerta o desconto e erra o consumo: reduzir 20 % deixa 80 % do consumo, isto é 0,80 × 30 = 24 m³, e não 40 %. Provavelmente o 12 vem de aplicar ao consumo um corte muito maior do que o enunciado pede.
- depois: 12 m³ seria um corte de 60 %. Reduzir 20 % deixa 0,80 × 30 = 24 m³; só o desconto de R$ 12,85 está certo.
- conta conferida: `0.8*30` → 24

### 4095ec33 · D [24 e 17,25.] (gab C)
- antes: 24 e 17,25 acerta o consumo. Provavelmente os R$ 17,25 saem de supor um valor cheio de R$ 57,50, porque 0,30 × 57,50 = 17,25, e esse valor cheio não vem de nenhuma conta do enunciado. A conferência derruba o número: se o desconto fosse R$ 17,25, o valor cheio seria 30 + 17,25 = R$ 47,25, e 30 % de 47,25 é R$ 14,18, não R$ 17,25.
- depois: R$ 17,25 não confere: a conta cheia é 30 ÷ 0,70 ≈ R$ 42,86, e o desconto é a diferença, perto de R$ 12,85.
- conta conferida: `30/0.7-30` → 12.8571

### 547a29b9 · B [336.] (gab D)
- antes: 336 corresponde a um EM de 350 alunos em 2024, porque 0,96 × 350 = 336. Provavelmente vem de uma equação com o fator do total trocado de lugar. A conferência derruba: 400 + 350 = 750 e 2 % a mais daria 765, enquanto 420 + 336 = 756.
- depois: 336 = 0,96 × 350 daria 350 alunos no EM em 2024. Então 1,02 × (400 + 350) = 765, mas 420 + 336 = 756.
- conta conferida: `1.02*750` → 765

### 547a29b9 · C [240.] (gab D)
- antes: 240 — Provavelmente sai de usar uma queda de 3 % no EM em vez de 4 %: a equação viraria 408 + 1,02m = 420 + 0,97m, com 0,05m = 12 e m = 240, e esse m de 2024 é entregue como se fosse o número de 2025. A conferência derruba: 240 corresponderia a 250 alunos em 2024, e 400 + 250 = 650 com 2 % a mais daria 663, enquanto 420 + 240 = 660.
- depois: 240 = 0,96 × 250 daria 250 alunos no EM em 2024. Então 1,02 × (400 + 250) = 663, mas 420 + 240 = 660.
- conta conferida: `1.02*650` → 663

### 547a29b9 · E [144.] (gab D) ✔
- antes: 144 corresponde a um EM de 150 alunos em 2024, porque 0,96 × 150 = 144. Provavelmente vem de trocar o sinal de uma das variações na equação, o que deixa o EM pequeno demais. A conferência derruba: 400 + 150 = 550 e 2 % a mais daria 561, enquanto 420 + 144 = 564.
- depois: 144 = 0,96 × 150 daria 150 alunos no EM em 2024. Então 1,02 × (400 + 150) = 561, mas 420 + 144 = 564.
- conta conferida: `1.02*550` → 561

### 092f005d · C [10.] (gab A)
- antes: Provavelmente o aluno divide os 80 kg do paciente pelos 8 mg do frasco: 80 ÷ 8 = 10. É massa de gente dividida por massa de remédio, duas coisas que não se dividem. Conferindo: 10 frascos dariam 10 × 8 = 80 mg, bem mais que os 48 mg administrados.
- depois: 10 frascos dariam 10 × 8 = 80 mg. A dose total é 2 µg × 80 kg × 300 min = 48 000 µg = 48 mg, o que dá 6 frascos.
- conta conferida: `2*80*300/1000/8` → 6

### 092f005d · D [4.] (gab A)
- antes: Provavelmente o aluno devolve o próprio 4 do enunciado, tratando os 4 mL de cada frasco como se fossem a quantidade de frascos. Conferindo: 4 frascos dão 4 × 8 = 32 mg, menos que os 48 mg necessários, e a infusão pararia antes das 5 horas.
- depois: 4 frascos dão 4 × 8 = 32 mg, menos que os 48 mg do tratamento (2 µg × 80 kg × 300 min).
- conta conferida: `2*80*300/1000` → 48

### Ed18069f · C [4,5 mL.] (gab A)
- antes: Provavelmente vem de usar uma massa menor que a do enunciado. 4,5 mL entregam 4,5 × 312,5 ÷ 5 = 281,25 mg por tomada, ou 843,75 mg por dia — essa é a dose de 25 mg/kg de uma criança de 33,75 kg, e não dos 39 kg do paciente.
- depois: 4,5 mL entregam 4,5 × 312,5 ÷ 5 = 281,25 mg, menos que os 325 mg da tomada (25 × 39 ÷ 3).
- conta conferida: `4.5*312.5/5` → 281.25

### Ed18069f · D [5,4 mL.] (gab A) ✔
- antes: Provavelmente vem de arredondar a concentração de 312,5 mg para 300 mg em 5 mL: 325 × 5 ÷ 300 ≈ 5,4. Conferindo pelo outro lado, 5,4 mL entregam 337,5 mg por tomada, acima dos 325 mg que a conta pede.
- depois: 5,4 mL entregam 5,4 × 312,5 ÷ 5 = 337,5 mg, acima dos 325 mg da tomada (25 × 39 ÷ 3).
- conta conferida: `5.4*312.5/5` → 337.5

### 9ad68f27 · A [R$ 2,90.] (gab D)
- antes: Provavelmente um erro no 1,10 × 200: escrevendo 230 em vez de 220, a conta vira 375 − 230 = 145 e 145 ÷ 50 = 2,90. Testando: com q = 2,90 as compras ficam R$ 549,00 e R$ 490,00, e 549 ÷ 490 = 1,1204, ou seja, 12,04 % a mais, e não 10 %.
- depois: Com q = 2,90, as compras dão R$ 549,00 e R$ 490,00, e 549 ÷ 490 ≈ 1,12: 12 % a mais, não 10 %.
- conta conferida: `(375+60*2.9)/(200+100*2.9)` → 1.12041

### 9ad68f27 · B [R$ 3,20.] (gab D)
- antes: Provavelmente um erro na subtração: 375 − 220 anotado como 160 em vez de 155, e 160 ÷ 50 = 3,20. Testando: as compras ficam R$ 567,00 e R$ 520,00, e 567 ÷ 520 = 1,0904, isto é, só 9,04 % a mais.
- depois: Com q = 3,20, as compras dão R$ 567,00 e R$ 520,00, e 567 ÷ 520 ≈ 1,09: só 9 % a mais, não 10 %.
- conta conferida: `(375+60*3.2)/(200+100*3.2)` → 1.09038

### 5557e7da · C [3,50.] (gab E)
- antes: 3,50 não sai de conta nenhuma. Nem esquecer uma das dobras chega a ele: com base 12 − x a equação fica x² − 12x + 18 = 0, de raízes aproximadamente 1,76 e 10,24. Testando 3,50 na situação certa: base 12 − 2 × 3,50 = 5 m e área 5 × 3,50 = 17,5 m², e não 18 m².
- depois: 3,50 não confere: a base fica 12 − 2 × 3,50 = 5 m, e a área, 5 × 3,50 = 17,5 m², não 18 m².
- conta conferida: `(12-2*3.5)*3.5` → 17.5

### f1019154 · A [10x² + 26x + 29.] (gab E)
- antes: Provavelmente dois deslizes no mesmo lugar: usar (3x + 2)² em vez de (3x − 2)², o que faz 14x + 12x = 26x, e trocar o 49 de (x + 7)² por 25, somando 25 + 4 = 29. Testando x = 2 essa expressão dá 40 + 52 + 29 = 121, mas o retângulo 9 por 4 tem diagonal ao quadrado igual a 97.
- depois: Testando x = 2, essa expressão dá 40 + 52 + 29 = 121. O retângulo fica 9 por 4, com diagonal ao quadrado 81 + 16 = 97.
- conta conferida: `10*4+26*2+29` → 121

### 96e70b70 · A [30.] (gab D)
- antes: Provavelmente supõe que a coluna W repete o mesmo símbolo nas duas casas, como a coluna Y faz, e escolhe o símbolo de valor 15: 15 + 15 = 30. Só que o símbolo repetido é o de valor 8, e a coluna W não é feita de símbolos iguais.
- depois: 30 não confere: pelos valores achados (8, 9 e 15), a coluna W tem os símbolos de 9 e de 8, que somam 17.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### b1d0baae · E [45.] (gab D)
- antes: Provavelmente mistura os dois números que aparecem no caminho: acha 96 mulheres e 51 falantes e subtrai um do outro (96 − 51 = 45), como se os falantes saíssem do grupo das mulheres. Os 51 falantes incluem 27 homens, então essa subtração não representa nada no problema.
- depois: 45 não confere: as mulheres são 96, e 25 % de 96 = 24. Para 45 falantes, seriam precisas 45 ÷ 0,25 = 180 mulheres, mais que o grupo.
- conta conferida: `45/0.25` → 180

### f283ad93 · A [R$ 17,80.] (gab C)
- antes: Provavelmente lê o 46,70 como 46,30 (troca os centavos) e faz 64,10 − 46,30 = 17,80. O caminho está certo; o que falha é a leitura do valor na subtração.
- depois: R$ 17,80 não confere: a 2.ª compra menos a 1.ª é exatamente 1 suco + 1 sanduíche, e 64,10 − 46,70 = 17,40.
- conta conferida: `64.10-46.70` → 17.4

### f283ad93 · D [R$ 17,20.] (gab C)
- antes: Provavelmente lê o 46,70 como 46,90 e faz 64,10 − 46,90 = 17,20. Mesmo tipo de tropeço da alternativa A, para o outro lado.
- depois: R$ 17,20 não confere: a 2.ª compra menos a 1.ª é exatamente 1 suco + 1 sanduíche, e 64,10 − 46,70 = 17,40.
- conta conferida: `64.10-46.70` → 17.4

### 18781451 · B [12.] (gab A)
- antes: Provavelmente erra a subtração 50010 − 48000 em 30 reais (usa 1980), chegando a b = 66 e a = 54, cuja diferença é 12. Como a diferença é 2b − 120, cada unidade errada no b desloca a resposta em 2 — e é por isso que as alternativas vão de 2 em 2.
- depois: Diferença 12 daria b = 66 e a = 54. Mas 400 × 54 + 430 × 66 = 49 980, e não 50 010.
- conta conferida: `400*54+430*66` → 49980

### 18781451 · C [10.] (gab A)
- antes: Provavelmente erra a divisão final: 2010 ÷ 30 dá 67, mas o aluno escreve 65 (e 30 × 65 = 1950, não 2010). Com b = 65 e a = 55, a diferença sai 10.
- depois: Diferença 10 daria b = 65 e a = 55. Mas 400 × 55 + 430 × 65 = 49 950, e não 50 010.
- conta conferida: `400*55+430*65` → 49950

### 18781451 · D [16.] (gab A)
- antes: Provavelmente erra a subtração 50010 − 48000 para o outro lado (usa 2040), chegando a b = 68 e a = 52, com diferença 16.
- depois: Diferença 16 daria b = 68 e a = 52. Mas 400 × 52 + 430 × 68 = 50 040, e não 50 010.
- conta conferida: `400*52+430*68` → 50040

### 18781451 · E [18.] (gab A)
- antes: Provavelmente usa 2070 na subtração (erro de 60), achando b = 69 e a = 51, com diferença 18. Vale conferir sempre: 400 × 51 + 430 × 69 = 20400 + 29670 = 50070, e não os R$ 50.010,00 do enunciado.
- depois: Diferença 18 daria b = 69 e a = 51. Mas 400 × 51 + 430 × 69 = 50 070, e não 50 010.
- conta conferida: `400*51+430*69` → 50070

### 49eb6f37 · E [a um quarto do número de painéis nos vagões de trens.] (gab C)
- antes: Provavelmente testa frações redondas sem conferir o total: um quarto significa 24 painéis no metrô e 96 nos vagões, e 300 × 24 + 950 × 96 = 7200 + 91200 = 98400, diferente dos R$ 88.000,00.
- depois: Um quarto daria 24 painéis no metrô e 96 nos vagões: 300 × 24 + 950 × 96 = 98 400, acima dos R$ 88.000,00.
- conta conferida: `300*24+950*96` → 98400

### 8cef8caa · E [1,95 m.] (gab D)
- antes: Provavelmente conta mal os degraus nas duas direções: usa 2 degraus na vertical (2x + 0,8 = 2,9, dando x = 1,05) e esquece de descontar os 0,3 m na horizontal (2y + 1,1 = 2,9, dando y = 0,9), somando 1,05 + 0,90 = 1,95.
- depois: 1,95 não confere: 3x + 0,8 = 2,9 dá x = 0,70, e 2y − 0,3 + 1,1 = 2,9 dá y = 1,05. A soma é 1,75.
- conta conferida: `(2.9-0.8)/3+(2.9-1.1+0.3)/2` → 1.75

### Eeb210b6 · E [28/5] (gab B)
- antes: Provavelmente vem de casar o k com os números do lado direito, escrevendo k ÷ 4 = 7/5 e obtendo k = 28/5. Mas o lado direito não entra na condição de paralelismo: ele serve só para verificar, depois, que as retas não são a mesma. Com k = 28/5 a razão em x seria 7/5, diferente de 3/5, e as retas se cruzariam.
- depois: Com k = 28/5, a razão em x seria (28/5) ÷ 4 = 7/5, diferente dos 3/5 da razão em y: as retas se cruzariam.
- conta conferida: `28/5/4` → 1.4

### 06592d5b · C [R$ 14,80.] (gab A)
- antes: Provavelmente erra a subtração 24,20 − 14,60 (usa 7,60 em vez de 9,60), chegando a a = 7,60 ÷ 4 = 1,90 e somando 12,90 + 1,90 = 14,80. O método está certo e o tropeço é só nessa subtração com centavos.
- depois: R$ 14,80 não confere: o buquê 4 é o buquê 1 com uma flor azul a mais, e 12,90 + 2,40 = 15,30.
- conta conferida: `12.90+2.40` → 15.3

### 06592d5b · E [R$ 15,50.] (gab A)
- antes: Provavelmente divide o número errado por 4: usa 10,40 em vez de 9,60, chegando a a = 2,60 e somando 12,90 + 2,60 = 15,50. Vale conferir o valor achado nas equações antes de somar.
- depois: R$ 15,50 não confere: o buquê 4 é o buquê 1 com uma flor azul a mais, e 12,90 + 2,40 = 15,30.
- conta conferida: `12.90+2.40` → 15.3

### Ec0c9aa5 · A [2 192.] (gab D)
- antes: Provavelmente vem de misturar os dois valores de x (204 e 2 004) numa conta que não é a subtração — 2 192 fica perto de 2 208 e de 2 004 justamente para atrair quem não terminou o raciocínio. Nenhum passo do sistema produz 2 192: os únicos valores de x são 204 e 2 004, e o aumento é 2 004 − 204 = 1 800.
- depois: 2 192 não confere: x vale 204 com m = 1,99 e 2 004 com m = 1,999. O aumento é 2 004 − 204 = 1 800.
- conta conferida: `(4-2/(1.999-2))-(4-2/(1.99-2))` → 1800

### 42968790 · B [15.] (gab E)
- antes: Provavelmente divide por 36 (número que aparece se o aluno somar coeficientes de linhas diferentes, como 28 + 8): 544 ÷ 36 fica perto de 15,1, e ele arredonda para 15. A divisão que fecha exata é 544 ÷ 32 = 17.
- depois: 15 não confere: somando as equações, 32u + 32p + 32a = 544, e 544 ÷ 32 = 17. Com 15 turistas, a soma seria 32 × 15 = 480.
- conta conferida: `32*15` → 480

### 42968790 · C [18.] (gab E)
- antes: Provavelmente erra a divisão final: 32 × 18 = 576, e não 544. Vale sempre multiplicar de volta para testar o resultado de uma divisão.
- depois: 18 não confere: somando as equações, 32u + 32p + 32a = 544, e 544 ÷ 32 = 17. Com 18 turistas, a soma seria 32 × 18 = 576.
- conta conferida: `32*18` → 576

### 098bfb3c · A [R$ 0,50.] (gab B)
- antes: Provavelmente o aluno chega aos R$ 49,00 e ainda tira R$ 0,50, misturando o total com a nota de R$ 50,00. Para o troco ser R$ 0,50 a compra teria de custar R$ 49,50, e isso é impossível aqui: com preços de R$ 7,00, R$ 4,00 e R$ 5,00, nenhuma contagem de itens produz centavos.
- depois: R$ 0,50 exigiria uma compra de R$ 49,50, com centavos. Os preços saem inteiros (7, 4 e 5 reais): 2 × 7 + 5 × 4 + 3 × 5 = 49.
- conta conferida: `2*7+5*4+3*5` → 49

### 098bfb3c · D [R$ 2,50.] (gab B) ✔
- antes: Provavelmente o aluno soma os 10 itens (2 + 5 + 3) e multiplica por um preço médio arredondado, algo como R$ 4,75, chegando a R$ 47,50. Os itens têm preços diferentes: são 2 de R$ 7,00, 5 de R$ 4,00 e 3 de R$ 5,00, cada quantidade com o seu próprio preço.
- depois: R$ 2,50 exigiria uma compra de R$ 47,50. Com algodão a R$ 7, gaze a R$ 4 e esparadrapo a R$ 5, a compra dá 14 + 20 + 15 = 49.
- conta conferida: `2*7+5*4+3*5` → 49

### 37cde68a · A [2,2 gramas.] (gab C)
- antes: Provavelmente o aluno acha p + g = 7,1 e estima a diferença no olho. Testando 2,2 como diferença: ela obrigaria p = 2,45 e g = 4,65, e aí a primeira pesagem daria 20 × 2,45 + 30 × 4,65 = 188,5 gramas, e não 190.
- depois: 2,2 não confere: subtraindo as pesagens, 10g − 10p = 190 − 165 = 25, e g − p = 2,5 gramas.
- conta conferida: `(190-165)/10` → 2.5

### 7f6d9662 · D [R$ 110,00 e 320 unidades] (gab B)
- antes: Provavelmente o aluno erra o sinal e escreve 5p = 500 + 50 = 550, chegando a p = 110, mas calcula a quantidade com o 90 que já tinha no rascunho. O +50 ao mudar de lado vira −50, então 500 − 50 = 450 e p = 90.
- depois: R$ 110,00 não é o equilíbrio: a oferta seria 3 × 110 + 50 = 380 e a demanda −2 × 110 + 500 = 280. As 320 unidades valem para p = 90.
- conta conferida: `3*110+50` → 380

### 9b3337a4 · D [R$ 3.110,00.] (gab B)
- antes: 3.110 não sai de conta nenhuma. O tropeço mais próximo é achar d = 900 e c = 1500 e, ao calcular t, dividir o 4200 por 6 em vez de 3 (confundindo os 3 cilindros de 30 L de um pedido com os 6 dos dois pedidos somados): t = 700 e total 1500 + 700 + 900 = 3100, e não 3110.
- depois: R$ 3.110,00 não confere: os preços são R$ 1.500, R$ 1.400 e R$ 900, e 1 500 + 1 400 + 900 = 3 800.
- conta conferida: `1500+(7200-3000)/3+900` → 3800

### Ec874b2e · B [√15/3 < t < √15] (gab A)
- antes: Provavelmente vem de resolver uma equação do 2º grau diferente da que o problema gera, porque nem √15 nem √15 ÷ 3 são raízes de t² − 5t + 4: pondo √15, que vale cerca de 3,873, a conta 15 − 5 × 3,873 + 4 dá cerca de −0,36, e não zero. Teste os dois extremos direto na função: em t = √15 ÷ 3, que é cerca de 1,291, a concentração fica perto de 4,56; em t = √15 ela fica perto de 4,08. Nos dois instantes a concentração ainda está acima de 4, então nenhum deles pode ser fronteira do intervalo.
- depois: √15 não é raiz de t² − 5t + 4: 15 − 5√15 + 4 ≈ −0,36. Na função, c(√15/3) ≈ 4,56 e c(√15) ≈ 4,08, ainda acima de 4.
- conta conferida: `20*sqrt(15)/(15+4)` → 4.07682

### f6c19dc8 · E []2, 3[] (gab B)
- antes: Provavelmente fatora errado o trinômio como (q − 2) × (q − 3), que corresponde a q² − 5q + 6 e não a q² − 3q + 2, e marca o intervalo entre essas raízes falsas. Em q = 2,5, que está dentro de ]2, 3[, a função vale 0,8 + 2,5 − 3 = 0,3, positiva.
- depois: ]2, 3[ não serve: em q = 2,5, f = 2/2,5 + 2,5 − 3 = 0,3, positivo. O numerador (q − 1)(q − 2) só é negativo entre 1 e 2.
- conta conferida: `2/2.5+2.5-3` → 0.3

### 36a74665 · C [0.] (gab E)
- antes: Provavelmente vem de um tropeço em 8 − 15, lido como −9. Daí 2 × (−9) − 3 × (−6) = −18 + 18 = 0. O valor certo do primeiro parêntese é −7, não −9.
- depois: 0 não confere: 4 # 5 = 8 − 15 = −7, e (−7) # (−6) = −14 + 18 = 4.
- conta conferida: `2*(2*4-3*5)-3*(-6)` → 4

### 835f0385 · B [R$ 250,00.] (gab D) ✔
- antes: Provavelmente vem de dividir 6 950 por 11 sem antes tirar os 900 do primeiro mês: 6 950 ÷ 11 dá cerca de 631,80, e 900 − 631,80 = 268,20, valor que o aluno arredonda para a alternativa mais próxima, R$ 250,00. Os 900 do primeiro mês já estão pagos e têm de sair da conta antes da divisão: o certo é 6 050 ÷ 11 = 550.
- depois: Com taxa de R$ 250,00, o aluguel seria 900 − 250 = 650, e o ano daria 900 + 11 × 650 = 8 050, não 6 950.
- conta conferida: `900+11*650` → 8050

### 064f7ec8 · C [colocar um cubo no prato A.] (gab B)
- antes: Provavelmente é de quem conta errado as peças de uma das figuras, por exemplo lendo 6 cubos no prato B. Com A valendo 5 cubos e B valendo 7, acrescentar 1 cubo em A dá 6c contra 7c: a balança continua torta.
- depois: Um cubo a mais no prato A deixa 6c contra 7c: ainda falta 1 cubo. O desnível é de 2 cubos, e só tirar 2 cubos de B o desfaz.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### a965c679 · D [15 e 20.] (gab A)
- antes: Provavelmente é a faixa de quem não monta o sistema e se segura no único número de anos escrito no enunciado, os 16 de diferença entre Isidoro e Felipe. Essa diferença não é a idade de ninguém.
- depois: 15 a 20 não confere: o sistema dá f = 28 anos. O 16 do enunciado é a diferença entre Isidoro e Felipe, não uma idade.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### 7afcff46 · D [718.] (gab B)
- antes: Provavelmente também é uma soma disfarçada, como 714 + 4 = 718. Com os algarismos 7, 1 e 4, nenhuma subtração de um número de três algarismos por um de dois resulta em 718.
- depois: 718 não confere: com a = 7, b = 1 e c = 4, 'bac' − 'ca' = 174 − 47 = 127.
- conta conferida: `174-47` → 127

### 99dc3b22 · B [12 anos.] (gab E)
- antes: Provavelmente calculou 1/5 de 60 (60 ÷ 5 = 12) em vez de 30 % de 60. Esse 12 é a infância de Catarina, um dos trechos usados para montar a equação.
- depois: 12 anos é 1/5 de 60, a infância de Catarina. O filho viveu 30 % de 60 = 18 anos.
- conta conferida: `60/5` → 12

### 99dc3b22 · D [21 anos.] (gab E)
- antes: Provavelmente trocou "30 % da vida dela" por "30 anos" e descontou os 9 anos finais: 30 − 9 = 21. O 30 aparece como porcentagem, e 30 % de 60 anos dá 18 anos, não 30.
- depois: 21 anos seria 35 % dos 60 anos de Catarina. O filho viveu 30 % de 60 = 18 anos.
- conta conferida: `21/60` → 0.35

### 4155b637 · A [R$ 3.540,00.] (gab E)
- antes: Provavelmente vem de um sistema resolvido errado na primeira semana. Para chegar a 3 540 com os preços certos da faixa nova seriam necessárias 92 brancas e 68 coloridas (92 × 20 + 68 × 25 = 3 540), ou seja, 46 e 34 na primeira semana — que gastariam 2 170, e não 2 290.
- depois: R$ 3.540,00 não corresponde a nenhuma faixa aplicada a 44 brancas e 116 coloridas: as três faixas dão R$ 4.580, R$ 3.780 e R$ 2.748.
- conta conferida: `44*25+116*30` → 4580

### 4155b637 · C [R$ 2.960,00.] (gab E)
- antes: Provavelmente é de quem arredondou as quantidades para 20 brancas e 60 coloridas, dobrou para 40 e 120 e misturou duas linhas da tabela: 40 × 20 + 120 × 18 = 2 960. As quantidades exatas são 22 e 58, e a faixa é uma só.
- depois: R$ 2.960,00 não confere: com 44 brancas e 116 coloridas, nenhuma faixa da tabela dá esse total. Na faixa certa, 44 × 20 + 116 × 25 = 3 780.
- conta conferida: `44*20+116*25` → 3780

### a83fc151 · B [h (x) = – 0,1 x + 20,7] (gab D)
- antes: O coeficiente linear está certo (20,7 em 2010), mas a taxa não. Provavelmente dividiu os 3 milhões por 30 em vez de por 6. Teste: h(6) = −0,1 × 6 + 20,7 = 20,1 milhões, enquanto o enunciado exige 17,7.
- depois: A taxa está errada: a queda é de 3 milhões em 6 anos, 0,5 por ano. Com −0,1, h(6) = 20,1, e não 17,7.
- conta conferida: `-0.1*6+20.7` → 20.1

### 8300798f · A [4,5.] (gab D)
- antes: Provavelmente vem de ler o −24 como −4 na hora do Δ: nesse caso Δ = 4 + 16 = 20 e a distância entre as raízes sai √20 ≈ 4,47, que arredonda para 4,5. Com o −24 correto o Δ é 100.
- depois: 4,5 não confere: as raízes são −4 e 6, e a distância entre elas é 6 − (−4) = 10, que é √Δ = √100.
- conta conferida: `sqrt(4+96)` → 10

### e2d4989b · C [11.] (gab A)
- antes: Provavelmente é g(4): 2 × 4² − 7 × 4 + 7 = 32 − 28 + 7 = 11. Acontece com quem erra a subtração p − 2 e usa 4 no lugar de 5.
- depois: 11 é g(4) = 32 − 28 + 7. Com p = 7, o ponto pedido é p − 2 = 5, e g(5) = 50 − 35 + 7 = 22.
- conta conferida: `2*16-7*4+7` → 11

### e2d4989b · E [33.] (gab A)
- antes: Provavelmente é o distrator alto da lista: nenhuma substituição direta em g(x) = 2x² − 7x + 7 chega a 33 (g(4) = 11, g(5) = 22, g(6) = 37). Quem cai nele precisa refazer 2 × 25 − 7 × 5 + 7 parcela por parcela.
- depois: 33 não é g(5): com p = 7, g(5) = 2 × 25 − 7 × 5 + 7 = 22. Os vizinhos dão g(4) = 11 e g(6) = 37.
- conta conferida: `2*36-42+7` → 37

### f00105b5 · B [−2.] (gab D)
- antes: Provavelmente é de quem testa valores redondos de cabeça: com k = −2 o vértice fica em x = −1 e f(−1) = −2 + 4 − 10 = −8. É o valor mais distante de −9,6 entre as alternativas.
- depois: Com k = −2, o vértice fica em x = −1 e o máximo é f(−1) = −2 + 4 − 10 = −8, e não −9,6.
- conta conferida: `-2*1+4-10` → -8

### f00105b5 · C [−16.] (gab D)
- antes: Provavelmente vem de guardar o 16 de (−4)² = 16 (o primeiro pedaço do Δ) e acrescentar o sinal negativo só porque se percebeu que k tem de ser negativo. Com k = −16 o máximo seria f(−0,125) = −0,25 + 0,5 − 10 = −9,75.
- depois: Com k = −16, o vértice fica em x = −0,125 e o máximo é −0,25 + 0,5 − 10 = −9,75, e não −9,6.
- conta conferida: `-16*0.125**2+4*0.125-10` → -9.75

### E6b68c42 · A [R$ 450.000,00.] (gab B)
- antes: R$ 450.000,00 não sai de nenhum passo correto: um ganho de 0,45 milhão exigiria lucro novo de 4,25 + 0,45 = 4,70 milhões, e L*(0,5) = −1 + 2 + 4 = 5. É o distrator de quem compara as duas funções fora do vértice: a diferença L*(x) − L(x) = −3x² + 3x vale 0,45 em x ≈ 0,18 e em x ≈ 0,82, mas nesses pontos a empresa não estaria no maior lucro possível, que é o que o enunciado garante.
- depois: R$ 450.000,00 não confere: o lucro máximo passa de L(0,5) = 4,25 para L*(0,5) = 5 milhões, um aumento de 0,75 milhão.
- conta conferida: `(-4*0.25+2+4)-(-0.25+0.5+4)` → 0.75

### 49fda58b · A [2,5 km.] (gab D)
- antes: Provavelmente é a média entre as duas respostas que saem das duas raízes: usando x = 5 dá 4 km, usando x = 8 dá 1 km, e a média é 2,5 km. Também é o 9 − 6,5 de quem usa o vértice da equação auxiliar x² − 13x + 40 = 0, que fica em 6,5, em vez do vértice da trajetória, que fica em 7.
- depois: 2,5 km não confere: P = (5, 5) e V = (7, f(7)) = (7, 9). O ganho de altitude é 9 − 5 = 4 km.
- conta conferida: `-49+98-40-5` → 4

### 49fda58b · C [3,5 km.] (gab D)
- antes: Provavelmente é de quem lê a altura do vértice no desenho, estimando algo em torno de 8,5 km, e subtrai os 5 km de P. Calculada, a altura do vértice é exatamente 9 km.
- depois: 3,5 km não confere: P = (5, 5) e V = (7, f(7)) = (7, 9). O ganho de altitude é 9 − 5 = 4 km.
- conta conferida: `-49+98-40-5` → 4

### 996afd55 · C [0.] (gab E)
- antes: Provavelmente vem de supor que a parábola é simétrica em relação ao meio dos dois pontos e que isso obrigaria q = −p, o que daria p + q = 0 sem resolver o sistema. Essa simetria não existe aqui: os dois pontos têm alturas diferentes (11 e 7), logo não são simétricos em relação ao eixo da parábola.
- depois: 0 não confere: os pontos são (−1, 11) e (3, 7). Com eles, p − q = 7 e 3p + q = 1, o que dá p = 2, q = −5 e p + q = −3.
- conta conferida: `2+(-5)` → -3

### 5210190a · A [o crescimento dos deslocamentos será linear, enquanto que o crescimento populacional será exponencial.] (gab D)
- antes: Inverte os dois casos. Chama dobrar de linear, talvez por ser uma regra simples que se repete, e chama a porcentagem de exponencial. Dobrar é multiplicar por 2, o que já é exponencial, e aqui é o crescimento mais rápido dos dois.
- depois: Acerta o populacional e erra os deslocamentos. Dobrar a cada década é multiplicar sempre por 2: crescimento exponencial, não linear.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### e152c887 · B [3.] (gab C)
- antes: Provavelmente vem de parar em 3^(k − 2) = 9 e responder o 3 que está na base, lendo 9 = 3 × 3 como se o 3 fosse o expoente procurado. O expoente que faz 3 elevado a ele dar 9 é 2, porque 9 = 3², e daí k − 2 = 2.
- depois: Com k = 3, g(1) = 3^(−2 + 3) = 3, e não 9. Como 9 = 3², é preciso k − 2 = 2, isto é, k = 4.
- conta conferida: `3**(-2+3)` → 3

### ff5b91a2 · D [1,5%.] (gab C) ✔
- antes: Provavelmente vem de chegar a 1 % e arredondar para cima, por achar que BASE jumping tem de ser mais perigoso que isso. 1,5 % seria 1 em 66,7, e o índice de 1 em 66,7 é 10 − 1,82 = 8,18, não 8.
- depois: 1,5 % seria 1 em 66,7, com índice 10 − log 66,7 ≈ 8,18, e não 8. Índice 8 dá log n = 2 e n = 100: 1 %.
- conta conferida: `10-log10(1/0.015)` → 8.17609

### 7f7a4b26 · B [0,3.] (gab A)
- antes: Provavelmente vem de responder com o logaritmo decorado em vez de usar o gráfico, já que log 2 = 0,30. No gráfico, 0,3 é a altura em x = 1, porque log(1 + 1) = log 2; o ponto que interessa é x = 2,25.
- depois: 0,3 é log 2, a altura do gráfico em x = 1. O pedido é log (13 ÷ 4) = log 3,25, lido em x = 2,25: cerca de 0,5.
- conta conferida: `log10(13/4)` → 0.511883

### 87dcc32b · B [5,6.] (gab A)
- antes: Provavelmente vem de um erro na multiplicação 2,8 × 3,4: quem faz essa conta como 10,6 em vez de 9,52 chega a −5,02 + 10,6 = 5,58, que arredonda para o 5,6 da alternativa. Conferindo devagar: 2,8 × 3 = 8,4 mais 2,8 × 0,4 = 1,12, total 9,52.
- depois: 5,6 exigiria log d = (5,6 + 5,02) ÷ 2,8 ≈ 3,79. Com d = 2 600 km, log d = 0,3 + 1,1 + 2 = 3,4 e M = −5,02 + 9,52 = 4,5.
- conta conferida: `(5.6+5.02)/2.8` → 3.79286

### 4f16a337 · C [15.] (gab B)
- antes: 15: Provavelmente erro de vírgula na divisão, do tipo dividir 0,69 por 0,046 em vez de 0,006. Um teste rápido derruba esse valor: 0,006 × 15 = 0,09, muito longe de 0,69.
- depois: Com t = 15, o expoente fica 0,006 × 15 = 0,09, longe de ln 2 ≈ 0,69. Dobrar exige t = 0,69 ÷ 0,006 = 115.
- conta conferida: `0.006*15` → 0.09

### 4f16a337 · D [151.] (gab B)
- antes: 151: Provavelmente quem inverte os algarismos do quociente ao fazer 690 ÷ 6 na mão. Conferindo: 0,006 × 151 = 0,906, e não 0,69.
- depois: Com t = 151, o expoente fica 0,006 × 151 ≈ 0,91, acima de ln 2 ≈ 0,69. Dobrar exige t = 0,69 ÷ 0,006 = 115.
- conta conferida: `0.006*151` → 0.906

### db122a84 · E [537,50 mg.] (gab B)
- antes: 537,50 mg: Provavelmente quem erra a idade das doses e soma 400 + 100 + 25 + 12,50, dando 1, 3, 5 e 6 cortes pela metade, com uma quarta parcela que não existe. As contagens certas, pelo tempo de cada dose, são 1, 4 e 7 meias-vidas.
- depois: 537,50 mg não confere. Na 14.ª hora, as doses têm 14, 8 e 2 horas, isto é, 7, 4 e 1 meias-vidas: 6,25 + 50 + 400 = 456,25 mg.
- conta conferida: `800/2**7+800/2**4+800/2` → 456.25

### 993da353 · A [fevereiro de 2024.] (gab E)
- antes: fevereiro de 2024: é a 26.ª medição, quando a população já vale 200 + 75 × 25 = 2 075 mil — passou de 1,5 milhão muito antes disso. Provavelmente quem resolve a inequação para o alvo errado de 2 milhões: 200 + 75 × (n − 1) > 2 000 dá n − 1 > 24, ou seja n = 26, que é exatamente fevereiro de 2024.
- depois: Fevereiro de 2024 é a 26.ª medição, com 200 + 75 × 25 = 2 075 mil. Os 1 500 mil já foram passados na 19.ª, julho de 2023.
- conta conferida: `200+75*25` → 2075

### 993da353 · D [dezembro de 2022.] (gab E)
- antes: dezembro de 2022: é a 12.ª medição, com 200 + 75 × 11 = 1 025 mil. Provavelmente quem resolve para 1 milhão em vez de 1,5 milhão: (1 000 − 200) ÷ 75 = 10,67 leva justamente a n = 12.
- depois: Dezembro de 2022 é a 12.ª medição, com 200 + 75 × 11 = 1 025 mil, ainda abaixo de 1 500 mil.
- conta conferida: `200+75*11` → 1025

### 199d4719 · B [6.] (gab E) ✔
- antes: 6: Provavelmente quem conta dois passos para trás e lê o 4 como a₃: então a₁ = 4 − 2 × 3 = −2, a₉ = −2 + 24 = 22 e 22 − 16 = 6. São só um passo e uma razão entre a₁ e o 4.
- depois: 6 não confere: r = (16 − 4) ÷ 4 = 3 e q = 3 ÷ 6 = 0,5. Então a₉ = 1 + 8 × 3 = 25 e b₃ = 4 ÷ 0,5² = 16, e a diferença é 9.
- conta conferida: `25-4/0.5**2` → 9

### 8d5fdcdc · A [53.] (gab D)
- antes: 53: corresponde a n = 31 e m = 22. Provavelmente quem erra o sinal ao simplificar 22m = 16n + 6 e escreve 11m = 8n − 6. Conferindo: as últimas casas seriam 16 × 31 − 8 = 488 e 22 × 22 − 11 = 473, ou seja, a ímpar ficaria 15 unidades MENOR que a par, o contrário do enunciado.
- depois: 53 corresponde a n = 31 e m = 22. As últimas casas seriam 16 × 31 − 8 = 488 e 22 × 22 − 11 = 473: a ímpar ficaria 15 abaixo, e não 3 acima.
- conta conferida: `22*22-11-(16*31-8)` → -15

### 8d5fdcdc · B [67.] (gab D)
- antes: 67: corresponde a n = 38 e m = 29. Provavelmente quem mistura o 3 e o 9 numa só condição e trabalha com uma diferença de 3 × 9 = 27 entre os números das últimas casas. Conferindo: 16 × 38 − 8 = 600 e 22 × 29 − 11 = 627, com diferença 27, e não 3.
- depois: 67 corresponde a n = 38 e m = 29. As últimas casas seriam 16 × 38 − 8 = 600 e 22 × 29 − 11 = 627: diferença de 27, e não de 3.
- conta conferida: `22*29-11-(16*38-8)` → 27

### 8d5fdcdc · E [47.] (gab D)
- antes: 47: corresponde a n = 28 e m = 19. Provavelmente quem inverte a primeira condição, como se fosse o lado par a exceder o ímpar, e ainda erra a simplificação. Conferindo: 16 × 28 − 8 = 440 e 22 × 19 − 11 = 407 — a última casa ímpar ficaria 33 unidades menor que a par.
- depois: 47 corresponde a n = 28 e m = 19. As últimas casas seriam 16 × 28 − 8 = 440 e 22 × 19 − 11 = 407: a ímpar ficaria 33 abaixo.
- conta conferida: `22*19-11-(16*28-8)` → -33

### 5ea79163 · A [29.] (gab E)
- antes: 29: Provavelmente quem erra a posição do sucessor e pega um termo de A seis lugares atrás (a₃ₖ₋₅ = 9k − 30 em vez de a₃ₖ₊₁ = 9k − 12), chegando a 143 < 5k e k > 28,6. Em k = 29 a desigualdade de fato vale (229 < 249), mas ela já valia em k = 26, e a questão pede o MENOR k.
- depois: Em k = 29 a desigualdade vale (4 × 29 + 113 = 229 < 9 × 29 − 12 = 249), mas já valia antes. De 5k > 125 sai k > 25, e o menor é 26.
- conta conferida: `(4*29+113, 9*29-12)` → (229, 249)

### 04bcdd69 · A [2,5 m².] (gab D)
- antes: 2,5 m²: Provavelmente quem usa razão 5 em vez de 4 ao ler as bases na figura: a₁₀₀ = 2 + 99 × 5 = 497 e S = 100 × (2 + 497) ÷ 2 = 24 950 cm², que arredonda para 2,5 m². Com as bases crescendo de 4 em 4, o centésimo retângulo tem 398 cm².
- depois: 2,5 m² seriam 25 000 cm². Com bases de razão 4 a partir de 2, a₁₀₀ = 398 e S = 100 × (2 + 398) ÷ 2 = 20 000 cm² = 2 m².
- conta conferida: `100*(2+398)/2` → 20000

### 04bcdd69 · C [5 m².] (gab D)
- antes: 5 m²: Provavelmente quem infla a soma usando razão 10 em vez de 4 (o que daria por volta de 50 000 cm²) ou quem erra a conversão de unidade. Com a₁ = 2 cm² e razão 4, a soma dos 100 termos é 20 000 cm², e 20 000 ÷ 10 000 = 2.
- depois: 5 m² seriam 50 000 cm². Com bases de razão 4 a partir de 2, a₁₀₀ = 398 e S = 100 × (2 + 398) ÷ 2 = 20 000 cm² = 2 m².
- conta conferida: `100*(2+398)/2` → 20000

### 04bcdd69 · E [4,5 m².] (gab D) ✔
- antes: 4,5 m²: para dar 4,5 m² a soma teria de ser 45 000 cm², ou seja, uma área média de 450 cm² por retângulo — mais que o dobro da média real, que é 200 cm². Provavelmente quem esquece o ÷ 2 da soma e ainda usa uma razão maior que 4.
- depois: 4,5 m² seriam 45 000 cm², média de 450 cm² por retângulo. A média real é (2 + 398) ÷ 2 = 200 cm², e o total, 20 000 cm² = 2 m².
- conta conferida: `(2+398)/2` → 200

### 15c23baf · B [0,9 mm.] (gab C)
- antes: Provavelmente é erro de soma à mão: quem adiciona 1 + 2 + … + 24 em blocos e perde uma centena chega a 200 em vez de 300, e 180 ÷ 200 = 0,9.
- depois: 0,9 mm daria deslocamento total de 300 × 0,9 = 270 mm, mais que os 180 mm do retângulo. Como 1 + 2 + … + 24 = 300, x = 180 ÷ 300 = 0,6 mm.
- conta conferida: `sum(range(1,25))*0.9` → 270

### E9a45917 · C [0h21 e 0h22.] (gab D)
- antes: Até 0h22 o acumulado é S(22) = 22 × (66 + 5) ÷ 2 = 22 × 71 ÷ 2 = 781, bem longe de 1 000. Provavelmente vem de somar o acumulado minuto a minuto e perder a conta no meio do caminho.
- depois: Até 0h22 o acumulado é S(22) = 22 × (4 + 67) ÷ 2 = 781, bem abaixo de 1 000. O total só passa de 1 000 entre 0h25 e 0h26.
- conta conferida: `22*(4+67)/2` → 781

### 484d2f30 · A [1.] (gab C)
- antes: Provavelmente é a soma de dois erros: contar os saltos no sentido anti-horário, o que produz o ciclo 4, 3, 1, 4, 3, 1 …, e ainda perder uma posição na contagem, caindo no 1, que nessa leitura errada ocupa a 9.ª posição.
- depois: 1 não aparece na sequência correta: 4, 5, 2, 3, 5, 2, 3, 5, 2, 3. Depois do 4, o ciclo 5, 2, 3 se repete, e a 10.ª lâmpada é a 3.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### 44b8a69e · A [6,25 cm².] (gab B)
- antes: Provavelmente é de quem chega ao triângulo 3-4-5 do rastro mas calcula a área a partir da hipotenusa: 5² ÷ 4 = 25 ÷ 4 = 6,25. A área do triângulo retângulo sai dos catetos (3 × 4 ÷ 2), não da hipotenusa.
- depois: 6,25 cm² não confere: o centro percorre um triângulo de catetos 3 cm e 4 cm, cuja área é 3 × 4 ÷ 2 = 6 cm².
- conta conferida: `3*4/2` → 6

### 44b8a69e · C [6,75 cm².] (gab B)
- antes: Provavelmente é de quem acha que o centro contorna cada canto em curva e soma um pedaço de círculo ao triângulo de catetos 3 cm e 4 cm: 6 + π ÷ 4, com π (pi) valendo cerca de 3,14, dá 6 + 0,79 ≈ 6,8, o que empurra para o 6,75. Nos cantos o círculo gira no lugar e o centro fica parado, então não há pedaço a somar.
- depois: 6,75 cm² não confere: o centro percorre um triângulo de catetos 3 cm e 4 cm, de área 6 cm². Nos cantos ele fica parado, sem arco a somar.
- conta conferida: `3*4/2` → 6

### e898f319 · B [4,2.] (gab D)
- antes: Provavelmente sai de errar a porcentagem: tomando a grama como 45 % (9 m²) em vez de 48 % (9,6 m²), fica 6,5x = 11, x ≈ 1,69 e lago ≈ 4,2 m².
- depois: 4,2 m² exigiria largura 4,2 ÷ 2,5 = 1,68 m. A equação dá x = 10,4 ÷ 6,5 = 1,6 m, e o lago tem 2,5 × 1,6 = 4,0 m².
- conta conferida: `10.4/6.5*2.5` → 4

### 2e803be0 · C [0,85.] (gab B)
- antes: Provavelmente é um valor estimado no olho: ele não é a metade de nenhuma cota da norma (1,20 ÷ 2 = 0,60 e 1,50 ÷ 2 = 0,75). Aparece em quem calcula o espaço por impressão em vez de ler a figura.
- depois: 0,85 não é a metade de nenhuma cota das figuras (1,20 ÷ 2 = 0,60; 1,50 ÷ 2 = 0,75). O raio pedido para o giro de 360° é 0,75 m.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### 63634aa7 · D [26.] (gab A)
- antes: Provavelmente vem de escrever 2 × π como 2,6 em vez de 6,28: 68 ÷ 2,6 ≈ 26. O dobro de π é pouco mais que 6, nunca pouco mais que 2.
- depois: Um raio de 26 cm daria contorno de 2 × 3,14 × 26 ≈ 163 cm, mais que o dobro dos 68 cm. O raio é 68 ÷ 6,28 ≈ 10,8 cm.
- conta conferida: `2*3.14*26` → 163.28

### 7d50c2b2 · A [258.] (gab E)
- antes: Provavelmente trocou a distância por 81 km: 81 000 ÷ 314 = 257,9, que arredondado dá 258. O mesmo número aparece em quem usa volta de 325 m (π = 3,25).
- depois: 258 voltas somam 258 × 314 = 81 012 m, e o treino teve 84 000 m. Cabem 84 000 ÷ 314 ≈ 267,5, isto é, 267 voltas completas.
- conta conferida: `258*314` → 81012

### 7d50c2b2 · B [261.] (gab E)
- antes: Provavelmente perdeu quilômetros na conversão e usou 82 km: 82 000 ÷ 314 = 261,1, que cai em 261. O enunciado diz 84 km, e cada quilômetro a menos custa mais de 3 voltas.
- depois: 261 voltas somam 261 × 314 = 81 954 m, e o treino teve 84 000 m. Cabem 84 000 ÷ 314 ≈ 267,5, isto é, 267 voltas completas.
- conta conferida: `261*314` → 81954

### 7d50c2b2 · C [264.] (gab E)
- antes: Provavelmente o tamanho da volta saiu errado. Para a resposta cair em 264, a volta teria de medir 318 m — é o que dá usar π = 3,18 em vez de 3,14 (2 × 3,18 × 50 = 318 e 84 000 ÷ 318 = 264,1). Confira sempre 2 × 3,14 × 50 = 314.
- depois: 264 voltas somam 264 × 314 = 82 896 m, e o treino teve 84 000 m. Cabem 84 000 ÷ 314 ≈ 267,5, isto é, 267 voltas completas.
- conta conferida: `264*314` → 82896

### 7d50c2b2 · D [255.] (gab E)
- antes: Provavelmente arredondou 84 km para 80 km 'para facilitar a divisão': 80 000 ÷ 314 = 254,8, que vira 255. Arredondar o dado antes da conta estraga o resultado — aqui 4 km valem 12 voltas.
- depois: 255 voltas somam 255 × 314 = 80 070 m, e o treino teve 84 000 m. Cabem 84 000 ÷ 314 ≈ 267,5, isto é, 267 voltas completas.
- conta conferida: `255*314` → 80070

### 9fb8887c · C [5.] (gab B)
- antes: Provavelmente errou a contagem na figura para mais ou dividiu por 6 em vez de 8 (28 ÷ 6 = 4,67, arredondando para 5). Seriam necessários 33 a 40 setores para precisar de 5 círculos.
- depois: 5 círculos rendem 40 setores, 12 a mais que os 28 da pulseira. Bastam 4 círculos (32 setores), pois 3 dão só 24.
- conta conferida: `5*8` → 40

### 9fb8887c · D [6.] (gab B)
- antes: Provavelmente supôs que cada círculo rende menos pedaços do que rende, por exemplo 5 (28 ÷ 5 = 5,6, arredondando para 6). O enunciado é explícito: oito setores por círculo.
- depois: 6 círculos rendem 48 setores, 20 a mais que os 28 da pulseira. Bastam 4 círculos (32 setores), pois 3 dão só 24.
- conta conferida: `6*8` → 48

### 9fb8887c · E [7.] (gab B)
- antes: Provavelmente contou que metade de cada círculo se perde no recorte e que sobram 4 setores úteis por círculo: 28 ÷ 4 = 7. Nada no enunciado fala de perda — os 8 setores saem todos do mesmo círculo.
- depois: 7 círculos rendem 56 setores, o dobro dos 28 da pulseira. Bastam 4 círculos (32 setores), pois 3 dão só 24.
- conta conferida: `7*8` → 56

### 021d9373 · C [34.] (gab B)
- antes: Provavelmente exagerou o avanço do ponteiro das horas e o colocou no risco dos 11 minutos (66° em vez de 57°): o ângulo sobe para 102° e 102 ÷ 3 = 34 cm. Em um relógio, 54 minutos levam o ponteiro das horas a 0,5 × 54 = 27° depois do 1, e não a 36°.
- depois: 34 cm corresponderia a 34 ÷ 120 × 360 = 102°. Às 1h54 os ponteiros estão em 57° e 324°, a 360 − 267 = 93°: arco de 31 cm.
- conta conferida: `34/120*360` → 102

### 356c6c26 · C [(9π – 24) cm².] (gab E)
- antes: Provavelmente erra a área do círculo. A conta geral é 2 × (área do círculo) − 24; com 4π sai 8π − 24, e para sair 9π − 24 a área do círculo teria de ser 4,5π. Com raio 2 cm, π × 2² = 4π, sem meio nenhum.
- depois: 9π − 24 não confere: a diferença é 2 × (área do círculo) − 24, e com raio 2 a área é π × 2² = 4π. Isso dá 8π − 24.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### 6f378c36 · E [5,75.] (gab A)
- antes: Provavelmente esquece um dos cantos pequenos ou troca o triângulo de 2L² por 1L²: 20 − 1 − 2 − 4,5 − 1 = 11,5L², e 11,5 ÷ 2 = 5,75. Vale conferir se os quatro cantos realmente somam 9,5L².
- depois: 5,75 não confere: S₂ = 20 − (1 + 2 + 4,5 + 2) = 10,5 quadradinhos e S₁ = 2, então S₂ ÷ S₁ = 5,25.
- conta conferida: `(20-(1+2+4.5+2))/2` → 5.25

### 7e2e2ef8 · C [12 – 2π.] (gab A)
- antes: Provavelmente acerta o setor e erra o triângulo, tratando a região como trapézio de bases 4 e 2 com altura 4: (4 + 2) × 4 ÷ 2 = 12, daí 12 − 2π. A figura que contém a região é o triângulo de catetos 4 e 4, cuja área é 8.
- depois: 12 − 2π não confere: a região está dentro do triângulo de catetos 4 e 4, de área 8, e dele sai o setor de área 2π.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### Eaa64e21 · D [142 cm.] (gab E)
- antes: Provavelmente vem de contar três lados de 10 cm em cada paralelogramo em vez de dois: 3 + 10 + 10 + 10 = 33, e 28 + 24 + 33 + 33 + 24 = 142. O paralelogramo só tem dois lados inclinados de 10 cm; os outros dois medem 3 cm.
- depois: 142 não confere: os contornos são 28 cm (faixa), 24 cm (cada triângulo 6-8-10) e 26 cm (cada paralelogramo 3-10). 28 + 2 × 24 + 2 × 26 = 128.
- conta conferida: `28+2*24+2*26` → 128

### b4eadbcb · A [28.] (gab D) ✔
- antes: Provavelmente troca a altura de 500 m por 1 km (ou supõe o triângulo com os dois catetos iguais): d = √(1² + 1²) = √2 ≈ 1,41 e 40 ÷ 1,41 = 28,3, que cai em 28. A altura dada é 0,5 km.
- depois: 28 km/h exigiria que a nuvem andasse 0,05 × 800 ÷ 28 ≈ 1,43 km. Ela anda √(1² + 0,5²) ≈ 1,12 km, o que dá 40 ÷ 1,12 ≈ 36 km/h.
- conta conferida: `0.05*800/28` → 1.42857

### b4eadbcb · B [24.] (gab D)
- antes: Provavelmente conta a altura duas vezes, somando os 0,5 km à hipotenusa já calculada: 1,12 + 0,5 = 1,62 e 40 ÷ 1,62 = 24,7, que o aluno marca como 24. A altura já está dentro do 1,12 km.
- depois: 24 km/h exigiria que a nuvem andasse 0,05 × 800 ÷ 24 ≈ 1,67 km. Ela anda √(1² + 0,5²) ≈ 1,12 km, o que dá 40 ÷ 1,12 ≈ 36 km/h.
- conta conferida: `0.05*800/24` → 1.66667

### b4eadbcb · C [40.] (gab D) ✔
- antes: Esquece que a bomba explodiu a 500 m de altura e usa d = 1 km: 0,05 × 800 ÷ 1 = 40 km/h, exato e redondo — é o distrator montado para esse erro. Com a altura, a nuvem anda 1,12 km, e não 1 km.
- depois: 40 km/h sai de ignorar os 500 m de altura e usar 1 km: 0,05 × 800 ÷ 1 = 40. A nuvem percorre √(1² + 0,5²) ≈ 1,12 km.
- conta conferida: `0.05*800/1` → 40

### 5ad3dbbe · B [4,5 cm.] (gab D)
- antes: Provavelmente perde a conta de qual paralela está sendo pedida e para num valor entre BI (3 cm) e CH (6 cm) — a média 4,5 cm. O mesmo número sai de aplicar a razão 3 ÷ 8 em vez de 1 ÷ 4 (12 × 3 ÷ 8 = 4,5). BI é a primeira paralela, a mais curta das quatro.
- depois: 4,5 cm não confere: BI ÷ EF = AB ÷ AE = 1/4, então BI = 12 ÷ 4 = 3 cm. As quatro paralelas medem 3, 6, 9 e 12 cm.
- conta conferida: `12/4` → 3

### 5ad3dbbe · C [3,5 cm.] (gab D)
- antes: Provavelmente subtrai os dados em vez de usar proporção: 12 − 8,5 = 3,5. Esses dois números medem coisas diferentes (um é a base EF, o outro é o lado AE) e subtrair um do outro não tem significado geométrico aqui.
- depois: 3,5 cm é 12 − 8,5, uma diferença que não vem da semelhança. Pela proporção, BI = EF × (AB ÷ AE) = 12 ÷ 4 = 3 cm.
- conta conferida: `12-8.5` → 3.5

### 1ea698c6 · D [10,0 cm.] (gab E)
- antes: Provavelmente usa Pitágoras, como se o triângulo fosse retângulo: QR² = PR² − PS² = 144 − 44,4 = 99,6 e QR = 9,98, que marca 10,0. Nada no enunciado diz que há ângulo de 90°; a ferramenta aqui é semelhança, não Pitágoras.
- depois: 10,0 daria QR² = 100. A semelhança dá QR² = PR × SR = 12 × 16/3 = 64, logo QR = 8 cm.
- conta conferida: `12*16/3` → 64

### 3ed4f15e · B [14 cm.] (gab E)
- antes: Provavelmente mistura diâmetro com corda e subtrai a distância: 20 − 6 = 14. O diâmetro (20 cm) é a maior corda possível, mas encurtá-lo não é subtrair a distância: a relação é Pitágoras, 2 × √(10² − 6²).
- depois: 14 cm não confere. O centro de b fica a 10 × 30 ÷ 50 = 6 cm da reta, e a corda mede 2 × √(10² − 6²) = 16 cm.
- conta conferida: `2*sqrt(100-36)` → 16

### 3ed4f15e · D [15 cm.] (gab E)
- antes: Provavelmente usa os segmentos errados na semelhança, comparando distância entre centros com distância entre centros: x ÷ 10 = 20 ÷ 30, que dá x = 6,67, e daí 2 × √(100 − 44,4) ≈ 14,9, marcado como 15. A proporção certa usa AO_b = 30 e AB = 50, as distâncias medidas a partir de A.
- depois: 15 cm não confere. O centro de b fica a 10 × 30 ÷ 50 = 6 cm da reta, e a corda mede 2 × √(10² − 6²) = 16 cm.
- conta conferida: `2*sqrt(100-36)` → 16

### Ecc83b72 · D [750°] (gab E)
- antes: Também não sai de conta nenhuma: 750 ÷ 180 = 4,17 não é inteiro, e a soma tem de ser múltiplo de 180°, já que cada um dos cinco vértices contribui com 180° mais um giro e os giros se anulam. Os cinco ângulos marcados nem são iguais entre si (três passam de 180° e dois ficam abaixo), então não há como chegar ao total multiplicando um valor médio por 5; o que fecha a conta é o paralelismo entre AB e FG.
- depois: 750° não é múltiplo de 180° (750 ÷ 180 ≈ 4,17), e a soma tem de ser: cada vértice dá 180° mais um giro, e os giros se anulam.
- conta conferida: `750/180` → 4.16667

### E931ce77 · B [50/3 cm] (gab A)
- antes: Provavelmente é um valor-isca. Para sair 50/3 cm (≈ 16,67 cm) a razão RQ ÷ RP teria de valer 25/36 ≈ 0,69, e não 5/8 = 0,625. Nenhuma relação da figura produz 25/36; o que o desenho entrega é cos θ = RQ ÷ 24.
- depois: 50/3 cm exigiria cos θ = (50/3) ÷ 24 = 25/36 ≈ 0,69, e não 5/8. Como RQ = 24 × cos θ, RQ = 24 × 5/8 = 15 cm.
- conta conferida: `50/3/24` → 0.694444

### E931ce77 · C [95/6 cm] (gab A)
- antes: Provavelmente outro valor-isca, colado no 15. Para dar 95/6 cm (≈ 15,83 cm) a razão RQ ÷ RP precisaria ser 95/144 ≈ 0,66, diferente do 5/8 = 0,625 que o enunciado deu.
- depois: 95/6 cm exigiria cos θ = (95/6) ÷ 24 = 95/144 ≈ 0,66, e não 5/8. Como RQ = 24 × cos θ, RQ = 24 × 5/8 = 15 cm.
- conta conferida: `95/6/24` → 0.659722

### ddea88c2 · D [0,74.] (gab E)
- antes: 0,74: Provavelmente de quem erra o Pitágoras somando os lados em vez dos quadrados (12 + 5 = 17) e faz 12 ÷ 17 ≈ 0,71, caindo no valor mais próximo da lista. Pitágoras soma os quadrados: 144 + 25 = 169.
- depois: 0,74 não é razão entre os lados 5, 12 e 13 do triângulo. O cosseno de CDN é DC ÷ DN = 12 ÷ 13 ≈ 0,92.
- conta conferida: `12/13` → 0.923077

### 95784e8a · C [1 620 cm².] (gab A)
- antes: Também não sai de conta nenhuma: pelo mesmo atalho, 1 620 cm² exigiria uma diferença de áreas de 1 620 × 6 ÷ 11 ≈ 883,6 cm², e o enunciado dá 960 cm². Repare que as quatro alternativas erradas são todas vizinhas de 1 760 cm², o que deixa a estimativa inútil: aqui só a conta separa.
- depois: 1 620 cm² não confere: de 15k² = 960 sai k = 8, e ADG tem área (11k × 5k) ÷ 2 = 27,5 × 64 = 1 760 cm².
- conta conferida: `27.5*64` → 1760

### 70cc1a1b · D [7,5 s.] (gab C)
- antes: 7,5 s: Provavelmente de quem soma os 2 m no lugar errado, no cateto horizontal em vez da altura: (4√3 + 2) × √3 = 12 + 2√3 ≈ 15,5 e 15,5 ÷ 2 ≈ 7,7, caindo no valor mais próximo da lista. Os 2 m são verticais; eles não entram na distância medida no chão.
- depois: 7,5 s levariam o balão a 2 × 7,5 = 15 m. A mira está a 2 + 4√3 × √3 = 2 + 12 = 14 m, o que dá 14 ÷ 2 = 7 s.
- conta conferida: `2+4*3` → 14

### ce1ec442 · B [28.] (gab E)
- antes: 28: Provavelmente de quem arredonda PQ para 10 m: 1 000 × 0,5 = 500 e 500 ÷ 18 ≈ 27,8, que puxa para 28. O enunciado dá 9 m, e a conta tem de fechar num número inteiro de degraus, o que 27,8 não faz.
- depois: 28 degraus dariam sombra de 28 × 18 = 504 cm. A sombra de PQ é 900 × cos 60° = 450 cm, isto é, 450 ÷ 18 = 25 degraus.
- conta conferida: `28*18` → 504

### d49f6d0a · B [12 300.] (gab E)
- antes: Provavelmente vem de tratar o trajeto como se fosse uma linha reta só: quem aplica Pitágoras nos dois trechos obtém √(3 700² + 11 697²) ≈ 12 268 km e cai em 12 300. O enunciado descreve um caminho A → B → C, que é soma de dois trechos, e não a hipotenusa de um triângulo retângulo.
- depois: 12 300 km não confere. Pela lei dos senos, BC = 3 700 × 0,98 ÷ 0,31 ≈ 11 697 km. O trajeto soma 3 700 + 11 697 ≈ 15 400 km.
- conta conferida: `3700+3700*0.98/0.31` → 15396.8

### d49f6d0a · D [14 300.] (gab E)
- antes: Também não sai de conta nenhuma: 14 300 km exigiria BC ≈ 10 600 km, isto é, a razão 0,98 ÷ 0,31 valendo 2,86 em vez de 3,16. Com o valor certo, BC ≈ 11 697 km e o total fica em 15 397 km, a 97 km de 15 300 e a mais de mil quilômetros de qualquer outra alternativa. As alternativas sobem de mil em mil exatamente para separar quem faz essa divisão com cuidado.
- depois: 14 300 km não confere. Pela lei dos senos, BC = 3 700 × 0,98 ÷ 0,31 ≈ 11 697 km. O trajeto soma 3 700 + 11 697 ≈ 15 400 km.
- conta conferida: `3700+3700*0.98/0.31` → 15396.8

### Ec332e6e · D [1108 cm².] (gab A) ✔
- antes: Provavelmente erro na área do círculo. Para o resultado final ser 1 108 cm², o círculo teria de ter 1 478 cm², ou seja, raio de cerca de 21,7 cm. Com sen 30° = 0,5 o raio sai exatamente 20 cm e o círculo, 1 256 cm².
- depois: 1 108 cm² exigiria um círculo de 1 108 + 370 = 1 478 cm². Com R = 20 ÷ (2 × 0,5) = 20 cm, o círculo tem 3,14 × 400 = 1 256 cm².
- conta conferida: `3.14*400` → 1256

### Ec332e6e · E [924 cm².] (gab A)
- antes: Provavelmente arredondamento de π. Para dar 924 cm², o círculo precisaria de 1 294 cm², e 1 294 ÷ 400 ≈ 3,24 — ou seja, é o que aparece ao usar π perto de 3,24 em vez do 3,14 que o enunciado exigiu. Com 3,14 o círculo é 1 256 cm² e o resultado é 886 cm².
- depois: 924 cm² exigiria um círculo de 924 + 370 = 1 294 cm². Com R = 20 cm e π = 3,14, o círculo tem 1 256 cm², e 1 256 − 370 = 886.
- conta conferida: `3.14*400-370` → 886

### fe5adf2a · B [39 cm.] (gab D)
- antes: Provavelmente vem de somar comprimentos soltos: quem acha AC = 14 cm, faz 2 × 14 = 28 e ainda acrescenta os 11 cm de BC, chega a 39 cm. BC é lado do triângulo; o lado do retângulo que encosta nele mede 4 cm, igual ao lado do quadrado.
- depois: 39 cm não confere: a lei dos cossenos dá AC = 14 cm, logo CF = 14 − 4 = 10 cm. O perímetro é 2 × (10 + 4) = 28 cm.
- conta conferida: `sqrt(64+121+2*8*11/16)` → 14

### Ed79d235 · C [(5√34)/85] (gab A)
- antes: 5√34 ÷ 85 é o mesmo que 10 ÷ (5√34), ou seja, um numerador 10 no lugar do 9. Provavelmente errou a medida de PR: 10 só apareceria se PR² valesse 39, porque (34 + 25 − 39) ÷ 2 = 10. Pelos deslocamentos 5 e 4, PR² = 41.
- depois: 5√34/85 é 10 ÷ (5√34), com numerador 10. Com QP² = 34, QR² = 25 e PR² = 41, o numerador é (34 + 25 − 41) ÷ 2 = 9.
- conta conferida: `5*sqrt(34)/85*5*sqrt(34)` → 10

### Ed79d235 · D [(3√34)/85] (gab A)
- antes: 3√34 ÷ 85 é o mesmo que 6 ÷ (5√34), ou seja, numerador 6 no lugar do 9. Provavelmente usou PR² = 47 em vez de 41, já que (34 + 25 − 47) ÷ 2 = 6. Com os deslocamentos certos, PR² = 25 + 16 = 41.
- depois: 3√34/85 é 6 ÷ (5√34), com numerador 6. Com QP² = 34, QR² = 25 e PR² = 41, o numerador é (34 + 25 − 41) ÷ 2 = 9.
- conta conferida: `3*sqrt(34)/85*5*sqrt(34)` → 6

### abc4c6e5 · D [0,912.] (gab E)
- antes: Provavelmente vem do caminho pelo cubo da soma com arredondamento no meio: sen³x + cos³x = (sen x + cos x)³ − 3 × sen x × cos x × (sen x + cos x) = 0,512 + 3 × 0,18 × 0,8. Quem arredonda 3 × 0,18 × 0,8 = 0,432 para 0,4 obtém 0,512 + 0,4 = 0,912, enquanto a conta exata dá 0,512 + 0,432 = 0,944.
- depois: 0,912 não confere: sen x cos x = (0,64 − 1) ÷ 2 = −0,18, e sen³x + cos³x = 0,8 × (1 + 0,18) = 0,944.
- conta conferida: `0.8*(1+0.18)` → 0.944

### E3c1ad71 · B [4(2 + √10) cm] (gab D)
- antes: 4(2 + √10) = 8 + 4√10 ≈ 20,6 cm. Provavelmente somou os lados do triângulo errado (AB = 6 e AD = 2 dão 8, mas esses são lados de ABD, não de BCD) e ainda simplificou √40 como 4√10. A simplificação certa é √40 = √4 × √10 = 2√10.
- depois: 4(2 + √10) = 8 + 4√10 não confere. Os lados de BCD são CD = 6, BC = 10 e BD = 2√10, que somam 16 + 2√10 = 2(8 + √10).
- conta conferida: — (afirmação qualitativa/leitura de figura)

### E3c1ad71 · E [2(4 + 3√10) cm] (gab D)
- antes: 2(4 + 3√10) = 8 + 6√10 ≈ 27,0 cm. Provavelmente somou 6 + 2 = 8 (os catetos do triângulo ABD) em vez de 6 + 10 = 16 (os lados CD e BC) e triplicou BD, usando 6√10 no lugar de 2√10.
- depois: 2(4 + 3√10) = 8 + 6√10 não confere. Os lados de BCD são CD = 6, BC = 10 e BD = 2√10, que somam 16 + 2√10 = 2(8 + √10).
- conta conferida: — (afirmação qualitativa/leitura de figura)

### ef109583 · D [432º] (gab C)
- antes: Provavelmente vem de tratar as abscissas como múltiplos dos 72° que apareceram no ponto A: 2 × 72° = 144° e 4 × 72° = 288°, somando 432°. O 72° de A não é um passo que se repete; o que se repete é o desvio de 18° em torno dos arcos onde a curva zera.
- depois: 432° não confere: B e C estão na curva y = cos x, simétricos em relação a 270°, em 252° e 288°. A soma é 540°.
- conta conferida: `252+288` → 540

### ef109583 · E [460º] (gab C)
- antes: Também não sai de conta nenhuma: qualquer par simétrico em relação a 270° soma 540°, e B e C são simétricos porque estão na mesma curva, com ordenadas opostas em torno do zero dela. Os valores são 252° e 288°. Para a soma cair em 460°, os dois pontos teriam de estar, juntos, 80° deslocados dessa simetria.
- depois: 460° não confere: B e C estão na curva y = cos x, simétricos em relação a 270°, em 252° e 288°. A soma é 540°.
- conta conferida: `252+288` → 540

### 226c7ad2 · D [238 cm².] (gab E)
- antes: 238 cm² não sai de contagem nenhuma das faces desta caixa. As três faces diferentes medem 27 cm², 21 cm² e 63 cm², todas múltiplas de 3; qualquer soma delas, com faces a mais ou a menos, também é múltipla de 3, e 238 não é (2 + 3 + 8 = 13). Esse teste de divisibilidade por 3 derruba a alternativa em dois segundos, sem somar nada.
- depois: 238 cm² não confere: as faces medem 27, 21 e 63 cm², e 2 × (27 + 21 + 63) = 222 cm². Toda soma dessas faces é múltipla de 3, e 238 não é.
- conta conferida: `2*(27+21+63)` → 222

### bb65cd86 · E [3 256.] (gab B)
- antes: Provavelmente ancoragem. Conferindo de volta: com altura 20 cm, a base teria de medir 3 256 ÷ 20 = 162,8 cm², e nenhuma combinação dos recortes inteiros desta figura dá 162,8 cm². Quem marca E costuma descontar um recorte que a figura não tem.
- depois: 3 256 cm³ exigiria base de 3 256 ÷ 20 = 162,8 cm². A base da figura tem 320 − 24 − 24 − 50 = 222 cm², e 222 × 20 = 4 440 cm³.
- conta conferida: `3256/20` → 162.8

### 9ae98125 · C [1,75 m.] (gab A)
- antes: Conferindo de volta: para o nível cair 1,75 m teriam de sair 12 × 1,75 = 21 m³ = 21 000 L, o que exige 210 minutos de bomba, isto é, 3 horas e 30 minutos — tempo que o enunciado não dá. Provavelmente marca C quem conta as 2 horas, os 30 minutos e ainda soma uma hora a mais na conversão.
- depois: 1,75 m exigiria retirar 12 × 1,75 = 21 m³, isto é, 210 minutos de bomba. Em 150 minutos saem 15 m³, e 15 ÷ 12 = 1,25 m.
- conta conferida: `12*1.75*1000/100` → 210

### 9ae98125 · E [1,00 m.] (gab A)
- antes: É o distrator feito para quem lê 2 horas e 30 minutos como 120 minutos (ou lê 2,5 h como 2 h): 100 × 120 = 12 000 L = 12 m³, e 12 ÷ 12 = 1,00 m, um valor redondo — e justamente por ser redondo ele atrai.
- depois: 1,00 m sai de usar 2 h = 120 min e esquecer os 30 minutos. Saem 100 × 120 = 12 000 L = 12 m³, e 12 ÷ 12 = 1,00.
- conta conferida: `100*120/1000/12` → 1

### ea6ade90 · E [28%.] (gab D)
- antes: Provavelmente é a âncora colada no valor certo, para pegar quem arredonda 26,3 % para cima sem olhar as opções. Conferindo: 28 % de 38 cm² seriam 0,28 × 38 ≈ 10,6 cm² de superfície nova, e as duas faces do corte medem exatamente 5 × 1 = 5 cm² cada, somando 10 cm² — nem um centímetro quadrado a mais.
- depois: 28 % de 38 cm² seriam 10,6 cm² de faces novas. As duas faces do corte medem 5 × 1 = 5 cm² cada, e 10 ÷ 38 ≈ 26,3 %.
- conta conferida: `10/38` → 0.263158

### 7565e0e4 · A [552 cm³.] (gab C)
- antes: Provavelmente âncora. Pelo atalho V = 9ℓ², o valor 552 exigiria ℓ² = 552 ÷ 9 = 61,33, ou seja, ℓ ≈ 7,83 cm — mas a razão 3ℓ ÷ 4 = 6 obriga ℓ = 8 cm exatos. Na escadinha de 12 em 12 (540, 552, 564, 576, 588), ele fica dois degraus abaixo do gabarito, a 24 cm³ de distância.
- depois: 552 cm³ exigiria ℓ² = 552 ÷ 9 ≈ 61,3. Mas a razão 3ℓ ÷ 4 = 6 dá ℓ = 8 cm, e V = 9ℓ² = 9 × 64 = 576 cm³.
- conta conferida: `552/9` → 61.3333

### 7565e0e4 · B [588 cm³.] (gab C)
- antes: Provavelmente âncora: é o degrau logo acima do gabarito. Pelo atalho V = 9ℓ², 588 ÷ 9 = 65,33, o que pediria ℓ ≈ 8,08 cm, e a razão 3ℓ ÷ 4 = 6 obriga ℓ = 8 cm exatos. Repare que trocar √3 por 1,73 também não leva até aqui: 96 × 1,73 = 166,08 e 166,08 × 3,46 = 574,6, que não é 576 nem 588. Mantendo √3 × √3 = 3 não há arredondamento nenhum: 192 × 3 = 576.
- depois: 588 cm³ exigiria ℓ² = 588 ÷ 9 ≈ 65,3. Mas a razão 3ℓ ÷ 4 = 6 dá ℓ = 8 cm, e V = 9ℓ² = 9 × 64 = 576 cm³.
- conta conferida: `588/9` → 65.3333

### 7565e0e4 · D [540 cm³.] (gab C)
- antes: Provavelmente âncora, e é a única da lista que dá divisão redonda pelo atalho: 540 ÷ 9 = 60. Mas esse 60 teria de ser ℓ², e nenhum lado inteiro ao quadrado dá 60 (7² = 49 e 8² = 64). Quem marca D normalmente usou ℓ ≈ 7,75 cm.
- depois: 540 cm³ exigiria ℓ² = 540 ÷ 9 = 60. Mas a razão 3ℓ ÷ 4 = 6 dá ℓ = 8 cm, e V = 9ℓ² = 9 × 64 = 576 cm³.
- conta conferida: `540/9` → 60

### 7565e0e4 · E [564 cm³.] (gab C)
- antes: Provavelmente âncora: 564 ÷ 9 = 62,67, o que pediria ℓ ≈ 7,92 cm. As cinco alternativas formam uma escadinha de 12 em 12 (540, 552, 564, 576, 588), montada para pegar quem chega perto por aproximação em vez de cair exatamente em 576.
- depois: 564 cm³ exigiria ℓ² = 564 ÷ 9 ≈ 62,7. Mas a razão 3ℓ ÷ 4 = 6 dá ℓ = 8 cm, e V = 9ℓ² = 9 × 64 = 576 cm³.
- conta conferida: `564/9` → 62.6667

### 74127ce2 · D [20 cm] (gab B)
- antes: Provavelmente vem de arredondar: √381 ≈ 19,52 e quem não reconhece a alternativa escrita em forma de raiz empurra o valor para 20 cm. Conferindo, 20 × 20 = 400, e a soma dos quadrados é 381, não 400 — então 20 cm é grande demais.
- depois: 20 cm daria a² + b² + c² = 400, mas as arestas são 8, 14 e 11 cm: 64 + 196 + 121 = 381. A diagonal é √381 ≈ 19,5 cm.
- conta conferida: `64+196+121` → 381

### ccb2d05f · B [60% da capacidade total do tanque.] (gab C) ✔
- antes: Provavelmente vem de aplicar ao tanque uma fórmula de pirâmide ou de cone, dividindo o volume por 3: 4 ÷ 3 ≈ 1,33 m³, ou 1 333 litros, e 800 ÷ 1 333 ≈ 0,6 = 60 %. O tanque tem paredes retas e cantos retos, então não há divisão por 3 em lugar nenhum.
- depois: 60 % de 4 000 L seriam 2 400 L. A laje capta 80 m² × 10 mm = 800 L, e 800 ÷ 4 000 = 20 %.
- conta conferida: `0.6*4000` → 2400

### 55040d62 · E [0,8 cm.] (gab B)
- antes: Provavelmente vem de confundir o que transborda: quem imagina que sai toda a coluna de água acima da pegada do cubo R, de 2 cm × 2 cm de base e 3 cm de altura, obtém 12 cm³ e faz 12 ÷ 16 = 0,75, marcando 0,8 cm. O que transborda é o volume do próprio R, 8 cm³, e não uma coluna de altura 3 cm.
- depois: 0,8 cm exigiria 0,8 × 16 = 12,8 cm³ na moldura. Transbordam só os 8 cm³ do cubo R, e 8 ÷ (25 − 9) = 0,5 cm.
- conta conferida: `8/(25-9)` → 0.5

### c43d72fc · B [35,4 e 35,7.] (gab A)
- antes: Provavelmente vem de arredondar √2 para cima: com 1,44 sai 24 + 8 × 1,44 = 35,52, que cai nessa faixa. As cinco alternativas são faixas vizinhas de 0,3 m de largura exatamente para punir o arredondamento grosseiro — com √2 ≈ 1,41 já se obtém 35,28, dentro de A.
- depois: Faixa errada: o total é 24 + 8√2 ≈ 24 + 11,31 = 35,31 m, que fica entre 35,1 e 35,4.
- conta conferida: `24+8*sqrt(2)` → 35.3137

### c43d72fc · C [35,7 e 36.] (gab A)
- antes: Provavelmente vem de um arredondamento ainda mais folgado, do tipo √2 ≈ 1,47: 24 + 8 × 1,47 = 35,76, que cai nessa faixa. O valor exato, 24 + 8√2, não passa de 35,32, então só se chega aqui forçando a raiz para cima.
- depois: Faixa errada: o total é 24 + 8√2 ≈ 24 + 11,31 = 35,31 m, que fica entre 35,1 e 35,4.
- conta conferida: `24+8*sqrt(2)` → 35.3137

### 030bbe14 · E [17.] (gab C)
- antes: Provavelmente vem de somar as partes com as facas: 14 pedaços mais os 3 planos verticais dá 17, como se cada plano fosse também uma parte. Plano é o corte, não o pedaço.
- depois: 17 não confere: os três cortes verticais deixam 1 + 3 + 3 = 7 regiões no círculo, e o corte horizontal dobra: 7 × 2 = 14. N tem de ser par.
- conta conferida: `(1+3+3)*2` → 14

### dea8a503 · A [250.] (gab C)
- antes: Provavelmente vem de trocar a altura do suco pela altura do copo: 3 × 4² × 7 = 336 cm³ de suco na garrafa e 336 − 84 = 252 cm³, que vira o 250 da lista. Os 7 cm são a altura do copo; o suco na garrafa chega a 13 cm.
- depois: 250 cm³ não confere: a garrafa tinha 3 × 4² × 13 = 624 cm³, e o copo leva 3 × 2² × 7 = 84 cm³. Restam 540 cm³.
- conta conferida: `3*16*13-3*4*7` → 540

### dea8a503 · B [380.] (gab C)
- antes: Provavelmente vem de dois tropeços somados: usar o diâmetro 8 cm como altura do suco, 3 × 4² × 8 = 384 cm³, e parar aí, sem descontar o copo — 384 vira o 380 da lista. O 8 cm é diâmetro (e já virou raio 4 cm), a altura do suco é 13 cm, e a pergunta é quanto RESTA na garrafa.
- depois: 380 cm³ não confere: a garrafa tinha 3 × 4² × 13 = 624 cm³, e o copo leva 3 × 2² × 7 = 84 cm³. Restam 540 cm³.
- conta conferida: `3*16*13-3*4*7` → 540

### dea8a503 · E [800.] (gab C)
- antes: Provavelmente é âncora para quem multiplica demais. Conferindo de volta: 800 cm³ numa garrafa de base 48 cm² corresponderiam a 800 ÷ 48 ≈ 16,7 cm de suco, mais do que os 13 cm do enunciado — esse volume não caberia no suco que havia.
- depois: 800 cm³ é mais que todo o suco que havia: 3 × 4² × 13 = 624 cm³. Tirando o copo, 3 × 2² × 7 = 84 cm³, restam 540 cm³.
- conta conferida: `3*16*13` → 624

### E082a568 · A [30.] (gab B)
- antes: Provavelmente dividiu a área da faixa pelo comprimento dela: 9 420 ÷ 314 = 30. Essa conta só devolve a largura da própria faixa, 30 cm, que já estava no enunciado, e não tem relação com o tamanho de uma volta do rolo.
- depois: Cada giro pinta 2 × 3,14 × 3 × 10 = 188,4 cm². 30 giros cobrem 5 652 cm², menos que os 30 × 314 = 9 420 cm² da faixa.
- conta conferida: `30*188.4` → 5652

### E082a568 · C [48.] (gab B)
- antes: Provavelmente contou por passadas e cortou a sobra: 314 ÷ 18,84 ≈ 16,67 voltas por passada, arredondado para 16, e 3 × 16 = 48. Mas 16 voltas avançam 16 × 18,84 = 301,4 cm e deixam quase 13 cm sem tinta em cada passada, e a questão pede o número de voltas para passar por toda a área.
- depois: Cada giro pinta 2 × 3,14 × 3 × 10 = 188,4 cm². 48 giros cobrem 9 043,2 cm², menos que os 9 420 cm² da faixa.
- conta conferida: `48*188.4` → 9043.2

### E082a568 · D [36.] (gab B)
- antes: Provavelmente somou as duas tampas circulares do cilindro à área que o rolo pinta: 188,4 + 2 × 3,14 × 3² = 188,4 + 56,5 = 244,9 cm², o que daria 9 420 ÷ 244,9 ≈ 38 e levaria à alternativa mais próxima da lista. As tampas do rolo não encostam na parede; quem pinta é só a superfície lateral.
- depois: Cada giro pinta 2 × 3,14 × 3 × 10 = 188,4 cm². 36 giros cobrem 6 782,4 cm², menos que os 9 420 cm² da faixa.
- conta conferida: `36*188.4` → 6782.4

### E082a568 · E [52.] (gab B)
- antes: Provavelmente usou o diâmetro no lugar do comprimento da volta: 314 ÷ 6 ≈ 52,3. O rolo não avança 6 cm por volta, avança 2 × 3,14 × 3 = 18,84 cm — o diâmetro atravessa o círculo, enquanto a circunferência contorna o círculo e é mais de três vezes maior.
- depois: 52 giros cobrem 52 × 188,4 = 9 796,8 cm², mais que o necessário. O mínimo é 9 420 ÷ 188,4 = 50 giros.
- conta conferida: `9420/188.4` → 50

### 927c29a6 · B [2 540 cm³.] (gab A)
- antes: Provavelmente âncora. Conferindo de volta: com altura 20 cm, 2 540 cm³ exigiriam base de 2 540 ÷ 20 = 127 cm², ou seja, r ≈ 6,4 cm e uma volta de 2 × 3,1 × 6,4 ≈ 39,7 cm. Mas folha e fita juntas não dão mais de 27 + 5 = 32 cm de volta.
- depois: 2 540 cm³ exigiria base de 127 cm², raio ≈ 6,4 cm e volta ≈ 39,7 cm. A volta é 27 + 4 = 31 cm, o que dá r = 5 cm e V = 1 550 cm³.
- conta conferida: `2*3.1*sqrt(127/3.1)` → 39.6837

### 3a7ec1ed · D [10 cm.] (gab B)
- antes: Provavelmente âncora. Conferindo de volta: se r fosse 10 cm, de r × h = 18 viria h = 1,8 cm, e o volume do cilindro seria π × 20² × 1,8 = 720π, enquanto 6 cones de raio 10 cm e altura 18 cm dão 6 × (1 ÷ 3) × π × 100 × 18 = 3 600π. Não fecha nem perto.
- depois: Com r = 10 cm, rh = 18 dá h = 1,8 cm, e o cilindro teria π × 20² × 1,8 = 720π. Seis cones dariam 3 600π.
- conta conferida: `400*1.8` → 720

### 3a7ec1ed · E [6 cm.] (gab B)
- antes: Provavelmente é o número pescado do próprio enunciado, o 6 de 6 vezes o volume do cone. Conferindo: com r = 6 cm, r × h = 18 daria h = 3 cm, e o cilindro teria volume π × 12² × 3 = 432π contra 6 × (1 ÷ 3) × π × 36 × 18 = 1 296π dos seis cones.
- depois: Com r = 6 cm, rh = 18 dá h = 3 cm, e o cilindro teria π × 12² × 3 = 432π. Seis cones dariam 1 296π.
- conta conferida: `144*3` → 432

### 5e043739 · A [13,5 cm.] (gab E)
- antes: Provavelmente âncora. Conferindo de volta: 13,5 cm de prisma pediriam h = 13,5 − 5,5 = 8 cm de cone, e a relação πh = 2H daria 3,1 × 8 = 24,8 contra 2 × 13,5 = 27 — os dois lados não batem.
- depois: Com H = 13,5 cm, o cone teria h = 8 cm, e πh = 3,1 × 8 = 24,8 não iguala 2H = 27. Só H = 15,5 equilibra: 3,1 × 10 = 31.
- conta conferida: `3.1*8` → 24.8

### 5e043739 · B [18,0 cm.] (gab E)
- antes: Provavelmente âncora. Conferindo: 18 cm de prisma pediriam h = 12,5 cm, e 3,1 × 12,5 = 38,75 teria de ser igual a 2 × 18 = 36 — não é. Só H = 15,5 cm equilibra: 3,1 × 10 = 31 = 2 × 15,5.
- depois: Com H = 18 cm, o cone teria h = 12,5 cm, e πh = 3,1 × 12,5 = 38,75 não iguala 2H = 36. Só H = 15,5 equilibra: 3,1 × 10 = 31.
- conta conferida: `3.1*12.5` → 38.75

### 5e043739 · C [8,5 cm.] (gab E)
- antes: Provavelmente vem de elevar o raio ao quadrado pela metade: quem escreve (a ÷ 2)² = a² ÷ 2 em vez de a² ÷ 4 chega a πh = H, ou seja, 3,1h = h + 5,5, com h ≈ 2,6 cm e H ≈ 8,1 cm, valor que puxa para os 8,5 da lista. O correto é (a ÷ 2)² = a² ÷ 4.
- depois: Com H = 8,5 cm, o cone teria h = 3 cm, e πh = 3,1 × 3 = 9,3 fica longe de 2H = 17. Só H = 15,5 equilibra: 3,1 × 10 = 31.
- conta conferida: `3.1*3` → 9.3

### ec975163 · B [1 560√13 cm²] (gab C)
- antes: Provavelmente radicando inventado na hora de simplificar a raiz: para aparecer √13 seria preciso ter 400 × 13 = 5 200 dentro dela, e nenhuma soma ou diferença entre 6 400 e 400 produz 5 200. Repare ainda que 1 560√13 ≈ 5 625 cm² é menor que a área de duas paredes da caixa (2 × 3 200 = 6 400 cm²), o que já denuncia o valor.
- depois: √13 exigiria 400 × 13 = 5 200 dentro da raiz. O apótema vem de 80² + 20² = 6 800 = 400 × 17, o que dá 1 600√17.
- conta conferida: `80**2+20**2` → 6800

### ec975163 · E [1 520√19 cm²] (gab C)
- antes: É a alternativa mais perigosa da lista: 1 520√19 ≈ 6 626 cm² fica a só 29 cm² de 1 600√17 ≈ 6 597 cm², então resolver em decimais não separa as duas — é obrigatório chegar à forma exata. E o √19 não sai de conta nenhuma: exigiria 400 × 19 = 7 600 dentro da raiz, e a soma é 6 400 + 400 = 6 800. Usar a metade da diagonal (20√2) no lugar do apótema levaria a 4 800√2 ≈ 6 788 cm², que nem está na lista.
- depois: √19 exigiria 400 × 19 = 7 600 dentro da raiz, e 80² + 20² = 6 800 = 400 × 17. Em decimais, 1 520√19 ≈ 6 626 fica perto de 1 600√17 ≈ 6 597.
- conta conferida: `1520*sqrt(19)` → 6625.53

### 4a2f7649 · C [18,5 cm.] (gab A) ✔
- antes: 18,5 não sai de conta nenhuma: 18,5² = 342,25, e a aresta exige VH² = 7,5² + 18² = 380,25. Como 380,25 já passa de 19² = 361, a aresta tem de ser maior que 19 cm — isso derruba 18,0, 18,5 e 19,0 de uma vez. E 19,5² = 380,25 fecha exato.
- depois: 18,5 não confere: VH² = 7,5² + 18² = 380,25, que dá VH = 19,5 cm. Já 18,5² = 342,25.
- conta conferida: `sqrt(7.5**2+18**2)` → 19.5

### E4bb3dab · C [3/4] (gab A)
- antes: 3/4 é uma razão entre comprimentos, não entre volumes. Provavelmente vem de usar (1÷2) no lugar de (1÷3) na fórmula da pirâmide: isso daria CL = 4h, LG = 3h e razão 3÷4 — e a resposta pararia aí, sem elevar ao cubo.
- depois: 3/4 não confere: LG = 5h e LC = 6h dão razão 5/6, e volumes vão ao cubo: (5/6)³ = 125/216.
- conta conferida: `(5/6)**3` → 0.578704

### 34d15a77 · A [2 100 km.] (gab B)
- antes: Provavelmente erra o ângulo lido na figura e soma 20° + 20° = 40° em vez de 15° + 15°: 19 200 × 40 ÷ 360 ≈ 2 133 km, que ele marca como 2 100.
- depois: 2 100 km corresponderia a 2 100 ÷ 19 200 × 360 ≈ 39° do paralelo. O arco de M a N é de 30°, e 19 200 ÷ 12 = 1 600 km.
- conta conferida: `2100/19200*360` → 39.375

### 34d15a77 · E [1 200 km.] (gab B)
- antes: Provavelmente divide a volta em 16 partes em vez de 12, lendo o arco como 22,5°: 19 200 ÷ 16 = 1 200 km. A conversão correta é 30 ÷ 360 = 1/12.
- depois: 1 200 km corresponderia a 1 200 ÷ 19 200 × 360 = 22,5° do paralelo. O arco de M a N é de 30°, e 19 200 ÷ 12 = 1 600 km.
- conta conferida: `1200/19200*360` → 22.5

### 77b2e057 · D [1 320π √3 km] (gab C)
- antes: 1 320 não sai de conta nenhuma: contar um setor de longitude a mais e usar 75° daria (75 ÷ 360) × 2 × 3 150 = 1 312,5, que é outro número. O ângulo entre P e Q é 45 + 15 = 60°, porque as longitudes estão em lados opostos de Greenwich. E 1 320π√3 ≈ 7 183 km passa dos 6 597 km que 60° valem no Equador, o que já é impossível.
- depois: 1 320π√3 ≈ 7 183 km passa dos 6 597 km que 60° valem no Equador, o que é impossível. O ângulo é 45 + 15 = 60°, e o arco, 1 050π√3 km.
- conta conferida: `1320*pi*sqrt(3)` → 7182.65

### 72a163e2 · C [prisma 1220] (gab D)
- antes: Faz toda a conta certa e chega a 1 220 cm², mas marca prisma na primeira lacuna, provavelmente por olhar a caixinha pronta e pensar caixa. Prisma exige as duas bases do mesmo tamanho; aqui são 10 cm e 20 cm.
- depois: 'Prisma' está errado: as bases medem 10 cm e 20 cm, e prisma exige bases iguais. Só a área de 1 220 cm² está certa.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### E28a94d4 · B [21/10] (gab A)
- antes: 21/10 = 2,1 não sai de conta nenhuma: o numerador da fórmula é |3 × 0 + 4 × 0 − 12| = 12 e o denominador é √(9 + 16) = 5, então d = 12 ÷ 5 = 2,4. Para d valer 2,1, o numerador teria de ser 10,5.
- depois: 21/10 não confere: d = |3 × 0 + 4 × 0 − 12| ÷ √(3² + 4²) = 12 ÷ 5. Para dar 21/10, o numerador teria de ser 10,5.
- conta conferida: `12/5` → 2.4

### E28a94d4 · C [11/5] (gab A)
- antes: 11/5 = 2,2. Provavelmente vem de trocar o 12 por 11 no numerador ao substituir às pressas. O termo independente da reta 3x + 4y − 12 = 0 é −12, e |−12| = 12.
- depois: 11/5 não confere: d = |3 × 0 + 4 × 0 − 12| ÷ √(3² + 4²) = 12 ÷ 5. O termo independente é −12, e |−12| = 12.
- conta conferida: `12/5` → 2.4

### Eb2874de · C [−3/5] (gab D)
- antes: Com m = −3÷5 a inclinação fica (−3÷5 − 1) ÷ 3 = (−8÷5) ÷ 3 = −8÷15, diferente de −2÷5. Provavelmente vem de montar a razão com os números que multiplicam o y: o −3 da primeira equação sobre o 5 da segunda, dando −3÷5, e chamar isso de m.
- depois: Com m = −3/5, a inclinação fica (−3/5 − 1) ÷ 3 = −8/15, diferente de −2/5: as retas se cruzam.
- conta conferida: `(-3/5-1)/3` → -0.533333

### Eb2874de · E [−4/5] (gab D)
- antes: Com m = −4÷5 a inclinação fica (−4÷5 − 1) ÷ 3 = (−9÷5) ÷ 3 = −3÷5, diferente de −2÷5. Provavelmente vem de igualar (m − 1) ÷ 3 a −3÷5 (a razão entre os coeficientes de y) em vez de a −2÷5, que é a inclinação verdadeira da segunda reta.
- depois: Com m = −4/5, a inclinação fica (−4/5 − 1) ÷ 3 = −3/5, diferente de −2/5: as retas se cruzam.
- conta conferida: `(-4/5-1)/3` → -0.6

### 1cf704d4 · B [23,5.] (gab C)
- antes: 23,5 não sai de conta nenhuma. Os quatro vértices caem em cantos da malha, então o recorte pela diagonal SQ dá áreas exatas: 16 e 7, somando 23. A fórmula dos vértices confirma, 46 ÷ 2 = 23. Meio quadrículo a mais só aparece em quem conta pedaços partidos no olho, e aqui não há pedaço partido para contar.
- depois: 23,5 não confere: os vértices caem em cantos da malha, e a área sai exata. A diagonal SQ divide a figura em 16 + 7 = 23.
- conta conferida: `16+7` → 23

### 1cf704d4 · D [22,5.] (gab C)
- antes: 22,5 também não sai de conta nenhuma: fica meio quadrículo abaixo do valor exato. Os dois triângulos dão 16 + 7 = 23, e a fórmula dos vértices dá 46 ÷ 2 = 23. Como a reflexão preserva a área, dá para calcular tudo na figura original, cujos vértices estão em cantos da malha.
- depois: 22,5 não confere: a diagonal SQ divide a figura em triângulos de 16 e 7, e a fórmula dos vértices dá 46 ÷ 2 = 23.
- conta conferida: `46/2` → 23

### 1cf704d4 · E [24,5.] (gab C)
- antes: 24,5 fica um quadrículo e meio acima do valor exato e não sai de conta nenhuma: o quadrilátero vale 16 + 7 = 23 pelos dois triângulos e 46 ÷ 2 = 23 pela fórmula dos vértices. A reflexão não cria nem destrói área, então o número do lado espelhado é o mesmo do lado original.
- depois: 24,5 não confere: a reflexão preserva a área, e o quadrilátero original vale 16 + 7 = 23 pelos dois triângulos.
- conta conferida: `16+7` → 23

### Eb3ca262 · C [51/5] (gab E)
- antes: 51/5 = 10,2. Provavelmente vem de usar 5,2 no lugar de 4,8 como abscissa de R: (10 + 2 × 5,2) ÷ 2 = 10,2. A conta correta é 12 ÷ (5÷2) = 12 × 2 ÷ 5 = 24÷5 = 4,8.
- depois: 51/5 = 10,2 não confere: P = (2, 7), R = (4,8; 0) e S = (0, 5), e a fórmula dá (10 + 2 × 4,8) ÷ 2 = 9,8 = 49/5.
- conta conferida: `abs(2*(0-5)+4.8*(5-7))/2` → 9.8

### Ebda433a · B [40.] (gab A)
- antes: 40 seria a área do quadrado se AC² = 40, ou seja, se (k + 1)² = 40 − 16 = 24 e k ≈ 3,90. Com esse k a área do triângulo sairia (5 × 3,90 − 3) ÷ 2 ≈ 8,2, e não 11. Provavelmente vem de um deslize na equação do módulo, que empurra k para baixo de 5.
- depois: 40 exigiria (k + 1)² = 24, ou k ≈ 3,90, e a área do triângulo seria (5 × 3,90 − 3) ÷ 2 ≈ 8,2, não 11.
- conta conferida: `(5*(sqrt(24)-1)-3)/2` → 8.24745

### Ebda433a · E [48.] (gab A) ✔
- antes: 48 pediria AC² = 48, ou seja, (k + 1)² = 48 − 16 = 32 e k ≈ 4,66. A área do triângulo com esse k seria (5 × 4,66 − 3) ÷ 2 ≈ 10,1, e não 11. Provavelmente vem de trocar um sinal dentro do módulo, o que muda a raiz encontrada.
- depois: 48 exigiria (k + 1)² = 32, ou k ≈ 4,66, e a área do triângulo seria (5 × 4,66 − 3) ÷ 2 ≈ 10,1, não 11.
- conta conferida: `(5*(sqrt(32)-1)-3)/2` → 10.1421

### 278973d0 · B [127²⁵] (gab D)
- antes: Lida como 127 elevado a 25, acerta o expoente e erra a base. Provavelmente de quem divide a escala pela metade (255 ÷ 2 ≈ 127), imaginando que metade dos tons se repete. Cada pixel tem 256 opções, nenhuma descartada.
- depois: 127²⁵ acerta o expoente e erra a base: cada pixel tem 256 opções, sem descarte, e o total é 256²⁵.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### 2923ee06 · E [524.] (gab B)
- antes: Provavelmente é um número-isca, colocado perto do valor certo. Dá para descartar sem fazer conta nenhuma: o último bloco contribui com 3² = 9, então a resposta tem de ser múltipla de 9, e 524 não é (5 + 2 + 4 = 11, que não é múltiplo de 9).
- depois: 524 não é múltiplo de 9 (5 + 2 + 4 = 11), e a resposta tem de ser, pelo bloco final 3² = 9. O total é 4 × 16 × 9 = 576.
- conta conferida: `4*16*9` → 576

### 96a07d8c · D [180.] (gab A)
- antes: É 12 × 15 = 180. Provavelmente de quem conta 12 buracos para a bola grande — por exemplo excluindo apenas três letras das 15, ou lendo a lista como um intervalo contínuo de A até L. Os buracos permitidos à bola grande são 8.
- depois: 180 = 12 × 15 exigiria 12 buracos para a bola grande. Ela tem 8 (A, B, C, D, L, M, N, O), e 8 × 15 = 120.
- conta conferida: `8*15` → 120

### 53139e38 · E [211.] (gab B)
- antes: Provavelmente 2 × 105 + 1 = 211, de quem chega a 105 e dobra o valor 'porque o crachá tem duas letras' antes de somar 1. Dobrar não tem papel aqui: as duas letras já entraram na conta, uma no fator 5 e outra no fator 26.
- depois: 211 não confere: os tipos de crachá são 5 vogais × 26 letras = 130, e o mínimo que garante repetição é 130 + 1 = 131.
- conta conferida: `5*26+1` → 131

### 8f3937a7 · A [1 225.] (gab D)
- antes: Provavelmente 35 × 35 = 1 225, de quem usa duas vezes o C(7,3) = 35 (combinação: de quantos jeitos escolher 3 lugares entre 7 quando a ordem não importa), como se bastasse separar os lugares em grupos sem dizer quem senta onde. Dá para descartar sem conta: a resposta certa tem o fator 3 da escolha do motorista, e 1 225 não é múltiplo de 3 (1 + 2 + 2 + 5 = 10).
- depois: 1 225 não é múltiplo de 3 (1 + 2 + 2 + 5 = 10). O total carrega o fator 3 do motorista: 3 × 12 × 24 = 864.
- conta conferida: `3*12*24` → 864

### 8f3937a7 · E [6 912.] (gab D)
- antes: É 864 × 8 = 6 912, de quem conta a mesma acomodação várias vezes. Provavelmente arruma os 4 que sobraram (4! = 24) e depois reordena de novo adultos e crianças dentro desses mesmos lugares. Cada acomodação só pode entrar uma vez na conta.
- depois: 6 912 = 8 × 864 conta cada acomodação 8 vezes. O total é 3 motoristas × 12 modos do fundo × 4! = 864.
- conta conferida: `6912/864` → 8

### 7cac20c7 · C [10.] (gab A)
- antes: Provavelmente de quem soma 'as 6 letras úteis mais 4 inúteis' que viriam no caminho, ou de quem continua o ciclo esperando um segundo R aparecer na urna 1 — que tem R só uma vez. Em 10 retiradas realmente dá para montar a palavra, mas já dava com 8, e a pergunta é pelo mínimo.
- depois: 10 funciona, mas não é o mínimo. Com 8 retiradas, a urna 2 pode ceder P, A e R, a urna 3, Z e E, e a urna 1, o outro R.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### 4b2af4b8 · B [9.] (gab E)
- antes: Provavelmente mistura as duas grandezas e divide 96 pela soma 8 + 3 = 11: 96 ÷ 11 ≈ 8,7, arredondado para 9. Divide-se só por 8, o número de alunos, porque é por aluno que se quer o resultado.
- depois: 9 não confere: 8 alunos × 9 startups dariam 72 ligações, e são 32 × 3 = 96. Cada aluno auxilia 96 ÷ 8 = 12.
- conta conferida: `8*9` → 72

### 7628b85f · B [90.] (gab C)
- antes: Provavelmente de quem chega a 80 e soma as 10 maneiras de escolher 2 cores entre 5 (combinação em que a ordem não importa), achando que faltava contar os casos de cor repetida: 80 + 10 = 90. Esses casos já estão dentro dos 80 — o passo 5 permite que o T repita a cor de F/C.
- depois: 90 não confere. F/C e A/E recebem cores diferentes (5 × 4 = 20), e o T só precisa diferir de A/E (4 opções): 20 × 4 = 80.
- conta conferida: `5*4*4` → 80

### cb871319 · A [72.] (gab B)
- antes: Provavelmente: permuta só as quatro letras diferentes (B, E, L, R), 4! = 24, e multiplica por 3 imaginando que o segundo R tem 3 lugares novos para entrar: 24 × 3 = 72. Numa palavra de 4 letras existem 5 espaços para encaixar uma letra nova, e vários desses encaixes geram a mesma sigla — por isso esse caminho conta uns casos e perde outros.
- depois: 72 não confere: são 5! = 120 ordens das cinco letras, divididas por 2! porque os dois R são iguais: 120 ÷ 2 = 60.
- conta conferida: `fact(5)/2` → 60

### 6421ab82 · B [160.] (gab A)
- antes: Provavelmente: 160 não sai de nenhuma conta fechada deste problema. Repare que as cinco alternativas são 180, 160, 140, 120 e 100, de 20 em 20: só a 180 vem de uma conta do enunciado. A 160 é o degrau logo abaixo e pega quem faz 720 ÷ 4 de cabeça e escolhe o vizinho do número certo. Feita no papel a divisão é segura: 72 ÷ 4 = 18, e o zero volta no fim → 180.
- depois: 160 não confere: 6! ÷ (2! × 2!) = 720 ÷ 4 = 180. Com 160 sequências, as ordens seriam 160 × 4 = 640, e não 720.
- conta conferida: `fact(6)/4` → 180

### 6421ab82 · E [100.] (gab A)
- antes: Provavelmente: 100 é o degrau mais baixo da escada e aparece para quem abandona a divisão e arredonda para uma centena. Dá para eliminar na hora: se a resposta fosse 100, o total de ordens seria 100 × 4 = 400, mas 6! = 720.
- depois: 100 não confere: 6! ÷ (2! × 2!) = 720 ÷ 4 = 180. Com 100 sequências, as ordens seriam 100 × 4 = 400, e não 720.
- conta conferida: `fact(6)/4` → 180

### 90a6da61 · A [20.] (gab E)
- antes: Provavelmente: acerta o primeiro caso (12) e, no segundo, divide 24 por 3 em vez de por 2! = 2, chegando a 8, e soma 12 + 8 = 20. Nos dois casos o miolo tem exatamente uma letra repetida duas vezes, logo a divisão é por 2 nos dois.
- depois: 20 não confere. Com A nas pontas, o miolo FMEM dá 4! ÷ 2! = 12; com M nas pontas, FAEA dá mais 12. Total 24.
- conta conferida: `fact(4)/2*2` → 24

### 90a6da61 · B [28.] (gab E)
- antes: Provavelmente: soma os dois casos certos (12 + 12 = 24) e ainda acrescenta 4 palavras achando que o F ou o E também poderiam abrir e fechar a palavra. Não podem: existe um único F e um único E em FAMEMA, e abrir e fechar com a mesma letra exige duas cópias.
- depois: 28 não confere: só A e M têm duas cópias para abrir e fechar a palavra. Cada caso dá 4! ÷ 2! = 12, e 12 + 12 = 24.
- conta conferida: `fact(4)/2*2` → 24

### c6944ef3 · A [302 400.] (gab B)
- antes: Provavelmente: erra a potência e divide 10! por 12 em vez de 32 (por exemplo usando 2! × 3! = 12): 3 628 800 ÷ 12 = 302 400. São cinco pares repetidos, logo cinco fatores 2 multiplicados: 2 × 2 × 2 × 2 × 2 = 32.
- depois: 302 400 = 10! ÷ 12 não confere. Cada uma das 5 letras aparece 2 vezes, então 10! ÷ 2⁵ = 3 628 800 ÷ 32 = 113 400.
- conta conferida: `fact(10)/12` → 302400

### b821aede · A [31.] (gab B)
- antes: Provavelmente perdeu três caminhos ao listar os casos na mão. O ponto exato em que some caminho é o de descer 2 letras: é preciso contar separadamente quando as duas descidas estão coladas, formando um bloco só (tipo D B B D, 8 maneiras), e quando elas ficam separadas, uma em cada ponta (tipo B D B, 1 maneira). Esquecer uma dessas famílias derruba o total de 34.
- depois: 31 não confere. Com 9 descidas e 3 mudanças há 2 × 8 = 16 caminhos; com 1 ou 2 descidas e 2 mudanças, 9 + 9 = 18. Total 34.
- conta conferida: `16+18` → 34

### 3d72a078 · B [360.] (gab A)
- antes: Provavelmente de quem chega a 720 por um dos caminhos errados e divide por 2, imaginando que ler a fileira da direita para a esquerda dá a mesma arrumação. As cadeiras são numeradas: sentar na cadeira 1 não é o mesmo que sentar na 7, então não há nada para dividir.
- depois: 360 não confere: as moças ficam nas cadeiras 1, 3, 5 e 7 (4! = 24 modos) e os rapazes nas 2, 4 e 6 (3! = 6): 24 × 6 = 144.
- conta conferida: `fact(4)*fact(3)` → 144

### 3d72a078 · D [1240.] (gab A)
- antes: Provavelmente número-isca. Dá para descartar sem conta: qualquer resposta aqui é múltipla de 3! = 6, porque os três rapazes podem ser trocados entre si de 6 maneiras sem mexer no resto. E 1 240 não é múltiplo de 6 (6 × 206 = 1 236).
- depois: 1 240 não é múltiplo de 6, e a resposta tem de ser, pois os rapazes trocam entre si de 3! = 6 modos. O total é 4! × 3! = 144.
- conta conferida: `1240/6` → 206.667

### dce44dbc · A [4.] (gab B)
- antes: Provavelmente de quem só desloca a senha em bloco, como numa roda: #Fa1 vira Fa1#, depois a1#F, depois 1#Fa; com a original, dá 4. Os deslocamentos circulares são apenas 3 das 9 senhas válidas, e faltam as que trocam caracteres aos pares, como F#1a.
- depois: 4 não confere: as ordens em que nenhum caractere fica na posição antiga são D(4) = 9, como Fa1#, F#1a e a1#F.
- conta conferida: `fact(4)*(1-1+1/2-1/6+1/24)` → 9

### 3306cb4c · A [12.] (gab B)
- antes: Provavelmente: multiplica as 3 escolhas pelas trocas de lugar dentro de cada horário, 3 × 2! × 2! = 12, como se mudar quem senta ao lado de quem criasse uma distribuição nova. A pergunta é apenas quem almoça em cada horário.
- depois: 12 não confere: só se escolhe quais 2 dos 3 indiferentes vão às 12h, C(3,2) = 3. A ordem dentro do horário não conta.
- conta conferida: `comb(3,2)` → 3

### 3306cb4c · D [2.] (gab B)
- antes: Provavelmente: enxerga apenas duas pessoas livres para distribuir (ou conta só as duas opções de horário) e entrega 2. São 3 indiferentes para 2 vagas às 12h mais 1 vaga às 13h, o que dá C(3,2) = 3.
- depois: 2 não confere: são 3 indiferentes para 2 vagas às 12h e 1 às 13h, e isso dá C(3,2) = 3 maneiras.
- conta conferida: `comb(3,2)` → 3

### 100e9c64 · D [13.] (gab E)
- antes: Provavelmente: soma as 5 escolhas de uma disciplina e o par AB, mas lista na mão os pares entre as cinco livres e para em 7 (D1D2, D1D3, D1D4, D1D5, D2D3, D2D4, D2D5), esquecendo D3D4, D3D5 e D4D5: 5 + 1 + 7 = 13. Usando C(5,2) = 10 isso não acontece.
- depois: 13 não confere: há 5 escolhas de uma disciplina só, 1 do par AB e C(5,2) = 10 pares entre as livres. 5 + 1 + 10 = 16.
- conta conferida: `5+1+comb(5,2)` → 16

### 755b27c3 · A [95.] (gab D)
- antes: Provavelmente: fixa um enfermeiro na equipe e conta as 3 vagas restantes entre as 11 pessoas que sobram, C(11,3) = 165, e ainda desconta as 70 equipes sem enfermeiro: 165 − 70 = 95. Os dois passos brigam entre si: fixar um enfermeiro já garante a condição, e nenhuma das 165 equipes está sem enfermeiro para ser descontada.
- depois: 95 não confere: o total é C(12,4) = 495, e sem enfermeiro há C(8,4) = 70 equipes. Logo 495 − 70 = 425.
- conta conferida: `comb(12,4)-comb(8,4)` → 425

### 755b27c3 · B [285.] (gab D)
- antes: Provavelmente: acerta o total (495) mas erra o tamanho do grupo sem enfermeiros, usando 10 pessoas em vez de 8 (por exemplo, somando errado os 2 + 2 + 2 + 1 + 1 e deixando dois enfermeiros ali dentro): C(10,4) = 210 e 495 − 210 = 285.
- depois: 285 = 495 − 210 usa C(10,4) = 210 equipes sem enfermeiro. Mas sem os 4 enfermeiros sobram 8 pessoas, e C(8,4) = 70.
- conta conferida: `comb(12,4)-comb(10,4)` → 285

### 582157df · A [90.] (gab D)
- antes: Provavelmente: o aluno conta vagas em vez de pessoas — 5 vagas no barco das 8h × 6 vagas no das 10h × 3 turistas que preferem as 8h = 90 — ou escolhe 2 pessoas com ordem entre 10, 10 × 9 = 90. A escolha pedida é de 5 pessoas entre 11 e sem ordem, o que dá C(11,5) = 462.
- depois: 90 não confere: as 5 vagas livres do barco das 8h saem de 5 dos 11 sem preferência, sem ordem: C(11,5) = 462.
- conta conferida: `comb(11,5)` → 462

### 582157df · B [264.] (gab D)
- antes: Provavelmente: 264 = 11 × 24 — multiplica as 11 pessoas sem preferência pelas 4! = 24 ordens que imagina existirem dentro do barco, misturando 'quem embarca' com 'em que ordem senta'. Lugar marcado não existe nesse problema.
- depois: 264 não confere: as 5 vagas livres do barco das 8h saem de 5 dos 11 sem preferência, sem ordem: C(11,5) = 462.
- conta conferida: `comb(11,5)` → 462

### 5395cc99 · A [22.] (gab E)
- antes: Provavelmente o aluno conta como se a ordem importasse: 5 × 5 × 5 = 125 sequências possíveis, menos 5 × 4 × 3 = 60 sequências com três cores distintas, sobram 65 com repetição. Aí ele divide 65 por 3 (em vez de tratar cada caso em separado): 65 ÷ 3 ≈ 21,7, e marca o 22.
- depois: 22 não confere. As escolhas de 3 folhas com repetição entre 5 cores são C(7,3) = 35; com cores todas distintas, C(5,3) = 10. Sobram 25.
- conta conferida: `comb(7,3)-comb(5,3)` → 25

### 5395cc99 · B [12.] (gab E)
- antes: Provavelmente ele fixa uma cor para repetir e multiplica só o que sobra: 3 folhas × 4 cores restantes = 12. Nessa conta ele perde as 5 escolhas de qual cor repete e esquece por completo o caso das três folhas iguais.
- depois: 12 não confere: a cor do par tem 5 opções e a da folha solta, 4, o que dá 5 × 4 = 20. Somando as 5 de três iguais, 25.
- conta conferida: `5*4+5` → 25

### 5395cc99 · D [18.] (gab E)
- antes: Provavelmente é a soma de três parcelas: C(5,2) = 10 pares de cores, mais 5 seleções de uma cor só, mais 3 por achar que ainda falta escolher qual das três folhas é a diferente — 10 + 5 + 3 = 18. Esse último 3 não existe, porque as folhas não se distinguem.
- depois: 18 não confere: com par repetido há 5 × 4 = 20 escolhas, e com as três iguais, mais 5. Total 25.
- conta conferida: `5*4+5` → 25

### 7046d25d · B [245.] (gab E)
- antes: Provavelmente ele imagina que só uma enfermeira muda do sábado para o domingo e conta 7 maneiras de escolher essa enfermeira: 35 × 7 = 245. Além disso esquece as 3 escolhas de médicas. O domingo tem 5 enfermeiras — 3 obrigatórias e 2 escolhidas entre 4.
- depois: 245 não confere: são 3 pares de médicas, C(7,4) = 35 grupos no sábado e C(4,2) = 6 escolhas no domingo. 3 × 35 × 6 = 630.
- conta conferida: `3*comb(7,4)*comb(4,2)` → 630

### 7046d25d · D [490.] (gab E) ✔
- antes: Provavelmente o mesmo caminho errado de B (35 × 7 = 245), mas multiplicando por 2 em vez de por C(3,2) = 3, como se as médicas do sábado fossem duas escolhas e não três pares possíveis: 2 × 35 × 7 = 490.
- depois: 490 não confere: são 3 pares de médicas, C(7,4) = 35 grupos no sábado e C(4,2) = 6 escolhas no domingo. 3 × 35 × 6 = 630.
- conta conferida: `3*comb(7,4)*comb(4,2)` → 630

### 6bc6b76c · A [135.] (gab E)
- antes: As cinco alternativas são 108, 117, 126, 135 e 144, espaçadas de 9 em 9 em volta do valor certo. O 135 é 126 + 9: provavelmente o aluno soma 9 no fim, achando que ainda falta escolher qual das 9 lojas é a vizinha. Ela não é escolhida — é uma loja dada pelo enunciado.
- depois: 135 não confere. Com a loja vizinha, Verônica escolhe mais 5 das outras 8, C(8,5) = 56; sem ela, escolhe 4 das 8, C(8,4) = 70. Total 126.
- conta conferida: `comb(8,5)+comb(8,4)` → 126

### 8aad0be3 · C [12,43%.] (gab D)
- antes: Provavelmente o aluno usa só os 12 % da faixa de idade e não cruza com os 77 % de mulheres. A alternativa está colada em 12 % de propósito, para parecer o valor lido direto no gráfico; mas o sorteado também precisa ser mulher, o que reduz o valor.
- depois: 12,43 % não confere: a chance é 0,77 × 0,12 = 0,0924, ou 9,24 %. Ela não pode passar dos 12 % da faixa de 65 anos ou mais.
- conta conferida: `0.77*0.12` → 0.0924

### 97a0eb21 · A [72,8%.] (gab E)
- antes: É a única alternativa errada que corresponde a um número inteiro de crianças: 0,728 × 125 = 91 meninas, duas a menos que as 93 reais. Provavelmente vem de calcular 30 % de 70 como 23 em vez de 21, deixando 70 − 23 = 47 meninas unilaterais: 44 + 47 = 91 e 91 ÷ 125 = 0,728.
- depois: 72,8 % são 91 meninas em 125. As meninas são 0,80 × 55 = 44 bilaterais e 0,70 × 70 = 49 unilaterais: 93 ÷ 125 = 74,4 %.
- conta conferida: `0.728*125` → 91

### f66416d7 · D [50%] (gab B)
- antes: Provavelmente o aluno não conta nada e supõe que há dois resultados igualmente prováveis, com efeito e sem efeito: 1 ÷ 2 = 50 %. Resultados só são igualmente prováveis quando há a mesma quantidade de casos de cada lado, e aqui são 3 contra 7.
- depois: 50 % não confere: dos C(5,3) = 10 trios possíveis, só 3 contêm as duas substâncias que se anulam, e 3 ÷ 10 = 30 %.
- conta conferida: `3/comb(5,3)` → 0.3

### 9a79ecbf · E [39% e 40%.] (gab D)
- antes: Provavelmente ele multiplica as consoantes mas soma os totais e ainda dobra por serem dois sorteios: (3 × 4) ÷ (7 + 8) ÷ 2 = 12 ÷ 30 = 0,40 = 40 %. O denominador certo é 7 × 8 = 56, não 15 nem 30.
- depois: 39 % a 40 % não confere: JUNDIAI tem 3 consoantes em 7 e MEDICINA, 4 em 8. P = (3/7) × (4/8) = 12/56 ≈ 21,4 %.
- conta conferida: `3/7*4/8` → 0.214286

### 6829b9c8 · B [primo.] (gab E)
- antes: Provavelmente o aluno nem usa a tabela e supõe que a colher é como uma moeda, com 50 % para cada lado. Número primo no dado vale 3 ÷ 6 = 1 ÷ 2, ou seja, 50 %. Mas o experimento registrou 652 em 978, que não é metade.
- depois: Primo no dado é 2, 3 ou 5: 3/6 = 1/2. A colher caiu para cima em 652 ÷ 978 = 2/3 das vezes.
- conta conferida: `652/978` → 0.666667

### 6829b9c8 · C [menor que 6.] (gab E) ✔
- antes: Provavelmente ele percebe que para cima foi o caso mais frequente e marca a alternativa de maior probabilidade sem calcular: menor que 6 vale 5 ÷ 6 ≈ 83 %. O valor da tabela é 2 ÷ 3 ≈ 67 %, bem abaixo disso.
- depois: Menor que 6 no dado é 1, 2, 3, 4 ou 5: 5/6. A colher caiu para cima em 652 ÷ 978 = 2/3 das vezes.
- conta conferida: `652/978` → 0.666667

### 6829b9c8 · D [múltiplo de 5.] (gab E)
- antes: Múltiplo de 5 no dado é só a face 5: 1 ÷ 6 ≈ 17 %. Provavelmente vem de dividir ainda mais a fração errada (a metade de 1 ÷ 3) ou de ler na tabela um número pequeno de ocorrências. Nenhuma leitura correta da tabela chega a 1 ÷ 6.
- depois: Múltiplo de 5 no dado é só a face 5: 1/6. A colher caiu para cima em 652 ÷ 978 = 2/3 das vezes.
- conta conferida: `652/978` → 0.666667

### f6afc256 · A [18%.] (gab B)
- antes: Provavelmente contou as duplas vizinhas em ordem, achando 18 (cada vizinhança contada duas vezes, como 1 e 2 e depois 2 e 1), e então dividiu por 100 em vez de dividir pelos 90 pares ordenados: 18 ÷ 100 = 0,18. Com o denominador certo, 18 ÷ 90, voltariam os mesmos 20 %.
- depois: 18 % não confere: há 9 pares de posições vizinhas entre C(10,2) = 45 pares possíveis, e 9 ÷ 45 = 20 %.
- conta conferida: `9/comb(10,2)` → 0.2

### f6afc256 · C [16%.] (gab B)
- antes: Provavelmente tratou o problema como eventos independentes: chance de pegar um defeituoso vezes chance de pegar um bom, 2 ÷ 10 × 8 ÷ 10 = 0,16. Essa conta responde outra pergunta e ainda coloca um teste bom no lugar do segundo defeituoso.
- depois: 16 % não confere: há 9 pares de posições vizinhas entre C(10,2) = 45 pares possíveis, e 9 ÷ 45 = 20 %.
- conta conferida: `9/comb(10,2)` → 0.2

### f6afc256 · D [15%.] (gab B)
- antes: Provavelmente acertou as 9 duplas vizinhas mas errou o total de duplas, usando 60 no lugar de 45 ao calcular C(10,2): 9 ÷ 60 = 0,15. O total correto é (10 × 9) ÷ 2 = 45.
- depois: 15 % não confere: há 9 pares de posições vizinhas entre C(10,2) = 45 pares possíveis, e 9 ÷ 45 = 20 %.
- conta conferida: `9/comb(10,2)` → 0.2

### f6afc256 · E [12%.] (gab B)
- antes: Provavelmente contou mal as posições vizinhas, chegando a 12 em vez de 9, e dividiu por 100: 12 ÷ 100 = 0,12. Numa fila de 10 lugares existem exatamente 9 pares de lugares vizinhos.
- depois: 12 % não confere: há 9 pares de posições vizinhas entre C(10,2) = 45 pares possíveis, e 9 ÷ 45 = 20 %.
- conta conferida: `9/comb(10,2)` → 0.2

### ea7808d7 · B [29.] (gab A)
- antes: Essa diferença corresponde a 55 engenheiros e 26 administradores; conferindo, 55 × 26 = 1 430 e 1 430 ÷ 3 240 ≈ 0,441, cerca de 44 % — e não 35 %. Provavelmente o aluno lê 7 ÷ 20 como a probabilidade de os dois terem a MESMA formação; essa equação fica x² − 81x + 2 106 = 0, com Δ = −1 863, ou seja, sem raiz real, e ele acaba chutando entre alternativas espaçadas de 4 em 4.
- depois: Diferença 29 daria 55 engenheiros e 26 administradores: 55 × 26 ÷ 3 240 ≈ 0,44, e não 7/20 = 0,35.
- conta conferida: `55*26/3240` → 0.441358

### ea7808d7 · D [37.] (gab A)
- antes: Corresponde a 59 engenheiros e 22 administradores: 59 × 22 = 1 298 e 1 298 ÷ 3 240 ≈ 0,401, cerca de 40 %. Provavelmente vem de errar o Δ ou de arredondar √2 025, que vale exatamente 45.
- depois: Diferença 37 daria 59 engenheiros e 22 administradores: 59 × 22 ÷ 3 240 ≈ 0,40, e não 7/20 = 0,35.
- conta conferida: `59*22/3240` → 0.400617

### ea7808d7 · E [41.] (gab A)
- antes: Corresponde a 61 engenheiros e 20 administradores: 61 × 20 = 1 220 e 1 220 ÷ 3 240 ≈ 0,377, cerca de 38 % — o chute mais perto, mas ainda errado. Provavelmente vem de usar 81 × 80 = 6 480 sem dividir por 2 no total de pares: aí x × (81 − x) = 2 268, o Δ fica negativo, não há raiz real e o aluno escolhe o valor que lhe parece mais próximo.
- depois: Diferença 41 daria 61 engenheiros e 20 administradores: 61 × 20 ÷ 3 240 ≈ 0,38, e não 7/20 = 0,35.
- conta conferida: `61*20/3240` → 0.376543

### 2025497c · B [30%.] (gab A)
- antes: Provavelmente sai de encolher o total pelo grupo errado: tirar os 430 que responderam 'regular', achando que quem acha 'regular' não opinou de verdade. Isso dá 170 ÷ 570 = 0,298, perto de 30 %. Mas 'regular' é uma opinião; quem sai do total são apenas os 150 que não opinaram.
- depois: 30 % não confere: entre os 850 que opinaram, 170 votaram em péssimo, e 170 ÷ 850 = 20 %.
- conta conferida: `170/850` → 0.2

### e7cbdda3 · C [65%.] (gab E)
- antes: Provavelmente sai de contar falsos positivos de menos. Com 98 falsos positivos no lugar de 294, por exemplo, daria 180 ÷ 278 = 0,647, perto de 65 %. O que esse caminho não enxerga é que o grupo saudável é 49 vezes maior que o infectado, então 3 % dele ainda é muita gente.
- depois: 65 % não confere. Em 10 000 pessoas, há 0,90 × 200 = 180 verdadeiros positivos e 0,03 × 9 800 = 294 falsos: 180 ÷ 474 ≈ 38 %.
- conta conferida: `180/474` → 0.379747

### e7cbdda3 · D [56%] (gab E)
- antes: Provavelmente vem de trocar os papéis de 2 % e 3 %. Tratando 3 % como a fatia de infectados e 2 % como a taxa de erro, viria 0,03 × 0,90 = 0,027 contra 0,97 × 0,02 = 0,0194, ou seja, 270 ÷ 464 ≈ 58 %, que o aluno encaixa no 56 %. A prevalência é 2 % e a taxa de falso positivo é 3 %.
- depois: 56 % não confere. Em 10 000 pessoas, há 0,90 × 200 = 180 verdadeiros positivos e 0,03 × 9 800 = 294 falsos: 180 ÷ 474 ≈ 38 %.
- conta conferida: `180/474` → 0.379747

### E4e0d261 · D [1/400] (gab C)
- antes: 1/400 = 0,0025. Provavelmente vem de multiplicar e ainda errar o produto: a chance de ser da marca B E ter defeito é 0,20 × 0,01 = 0,002, que é 1/500 e não 1/400. E mesmo 1/500 não responde à pergunta, porque falta dividir por 0,026.
- depois: 1/400 não confere: P(B e defeito) = 0,20 × 0,01 = 1/500, e ainda falta dividir por P(defeito) = 0,026. O resultado é 2 ÷ 26 = 1/13.
- conta conferida: `0.002/0.026` → 0.0769231

### Eaeeca7d · D [5/8] (gab C) ✔
- antes: 5/8. Provavelmente vem de juntar dois números que aparecem no problema sem fazer a divisão pedida: o 5 é o numerador de P(1 e 1) = 5/128 e o 8 é a quantidade de números do sorteio. A conta correta é (4/128) ÷ (5/128) = 4/5.
- depois: 5/8 não confere: P(coroa e 1, 1) = 1/2 × 1/16 = 4/128 e P(cara e 1, 1) = 1/2 × 1/64 = 1/128. A razão é 4 ÷ (4 + 1) = 4/5.
- conta conferida: `(1/32)/(1/32+1/128)` → 0.8

### 5d886d41 · B [12.] (gab D)
- antes: Provavelmente vem de chutar sem conferir. Com x = 12, o grupo de quem fez alguma atividade seria 42 + 36 − 12 = 66, e sobrariam 75 − 66 = 9 alunos sem nenhuma atividade. O enunciado diz 17, e não 9.
- depois: Com x = 12, quem fez alguma atividade seria 42 + 36 − 12 = 66, e sobrariam 75 − 66 = 9 sem nenhuma. O enunciado diz 17.
- conta conferida: `75-(42+36-12)` → 9

### 2342cfb9 · A [1,00%.] (gab D)
- antes: Provavelmente vem de errar a casa decimal da intersecção e descontá-la inteira: quem faz 3 × 1 = 3 e chama isso de 3 % acaba em 3 % + 1 % − 3 % = 1 %. O produto correto é 0,03 × 0,01 = 0,0003, que vale 0,03 % e não 3 %.
- depois: 1 % não confere: p = 0,03 + 0,01 − 0,03 × 0,01 = 0,0397, ou 3,97 %.
- conta conferida: `0.03+0.01-0.03*0.01` → 0.0397

### 2342cfb9 · C [3,45%] (gab D)
- antes: 3,45 % também não sai de conta nenhuma: ele é 4 % − 0,55 %, e não há como a intersecção valer 0,55 %. Ela é o produto exato 0,03 × 0,01 = 0,0003, ou seja 0,03 %, então a única resposta possível depois do desconto é 4 % − 0,03 % = 3,97 %. O valor foi posto entre 3 % e 4 % para pegar quem percebeu que precisa descontar algo, mas não calculou quanto.
- depois: 3,45 % não confere: a interseção é 0,03 × 0,01 = 0,0003, e p = 0,03 + 0,01 − 0,0003 = 3,97 %.
- conta conferida: `0.03+0.01-0.03*0.01` → 0.0397

### 2342cfb9 · E [4,00%.] (gab D)
- antes: É 3 % + 1 % sem o desconto da intersecção. É o distrator principal: quem lê 'ou' como ordem de somar para aqui. O desconto é pequeno, 0,03 %, mas é exatamente ele que separa 4,00 % de 3,97 %.
- depois: 4,00 % sai de somar 3 % + 1 % sem descontar a interseção. Ela vale 0,03 × 0,01 = 0,03 %, e o resultado é 3,97 %.
- conta conferida: `0.03+0.01` → 0.04

### c7b5fef2 · B [55%.] (gab A)
- antes: Provavelmente vem de tratar as duas veteranas como sorteios independentes: cada uma com 5 ÷ 15 de chance, 'nenhuma das duas' daria (2 ÷ 3) × (2 ÷ 3) = 4 ÷ 9, e a resposta seria 1 − 4 ÷ 9 ≈ 55,6 %. Elas não são independentes: se uma já ocupou uma vaga, sobram 4 vagas para a outra, e não 5.
- depois: 55 % sai de tratar as duas veteranas como independentes: 1 − (10/15)² = 5/9 ≈ 55,6 %. Sem reposição, P(nenhuma) = C(13,5) ÷ C(15,5) = 3/7.
- conta conferida: `1-(10/15)**2` → 0.555556

### c7b5fef2 · E [46%.] (gab A)
- antes: 46 % não sai de conta nenhuma: toda probabilidade desta questão é um número de grupos dividido por C(15,5) = 3 003, e 0,46 × 3 003 = 1 381,38 não é um número inteiro de grupos. O caminho errado que chega mais perto é contar os grupos sem veterana como C(15,4) = 1 365 em vez de C(13,5) = 1 287 (o que deve mudar é o 15 virar 13; o 5 continua 5) e parar em 1 365 ÷ 3 003 ≈ 0,455, isto é 45,5 %, que nem arredonda para 46 %. Além disso, esse número seria uma chance de nenhuma veterana mal calculada, e a pergunta pede ao menos uma, que é 1 menos a chance de nenhuma: 1 − 3 ÷ 7 ≈ 57 %.
- depois: 46 % não confere: P(nenhuma veterana) = C(13,5) ÷ C(15,5) = 1 287 ÷ 3 003 = 3/7, e a resposta é 1 − 3/7 ≈ 57 %.
- conta conferida: `1-comb(13,5)/comb(15,5)` → 0.571429

### E7191586 · D [1/2] (gab B)
- antes: 1/2 é o mesmo que 15/30. Provavelmente vem de somar os 11 votos da opção 1 com apenas as 4 mulheres que votaram nela (11 + 4 = 15), esquecendo as 9 mulheres que votaram na opção 2 — elas também entram na união, porque são mulheres.
- depois: 1/2 = 15/30 não confere. A união tem 13 mulheres + 11 da opção 1 − 4 contadas duas vezes = 20 estudantes, e 20/30 = 2/3.
- conta conferida: `(13+11-4)/30` → 0.666667

### 0e9877e3 · A [11.] (gab D)
- antes: Provavelmente vem de mexer no 13 sem motivo: 13 − 2 = 11, como se o 'dois alunos no mesmo curso' mandasse descontar 2 dos cursos. O 2 da pergunta diz quantos alunos devem coincidir, não quanto se tira do número de gavetas.
- depois: Com 11 alunos, cada um pode estar num curso diferente, e ainda sobram 2 cursos. Para garantir repetição, são precisos 13 + 1 = 14.
- conta conferida: `13+1` → 14

### 0e9877e3 · E [15.] (gab D)
- antes: Provavelmente vem de somar os 2 alunos que devem coincidir: 13 + 2 = 15. Com 15 realmente há repetição, mas a pergunta é pelo MENOR N que garante, e o 14 já garante. Pedir mais do que o necessário também erra a questão.
- depois: 15 garante repetição, mas não é o mínimo: com 14 alunos e 13 cursos, dois já coincidem.
- conta conferida: `13+1` → 14

### d4f7b880 · A [1] (gab B)
- antes: Provavelmente vem de ler 'acima da média' como 'a melhor de todas' e marcar só a plataforma VI. A média é uma linha de corte, não o campeão: tudo que passa de 12,73 serve, e 15,63 passa com folga.
- depois: 1 não confere: a média é 76,39 ÷ 6 ≈ 12,73, e ficam acima dela duas plataformas, a V (15,63) e a VI (18,10).
- conta conferida: `76.39/6` → 12.7317

### d4f7b880 · E [5] (gab B)
- antes: Provavelmente vem de comparar cada valor com o menor da coluna (9,66) em vez da média: cinco valores são maiores que 9,66. Ficar acima do pior não é a mesma coisa que ficar acima da média.
- depois: 5 não confere: a média é 76,39 ÷ 6 ≈ 12,73, e só a V (15,63) e a VI (18,10) ficam acima dela.
- conta conferida: `(9.66+10.12+11.64+11.24+15.63+18.10)/6` → 12.7317

### 4f5d47b0 · C [16,7.] (gab A)
- antes: Provavelmente vem de incluir a Índia entre 'os demais países': (22,3 + 21,9 + 20,9 + 19,8 + 18,6) ÷ 5 = 103,5 ÷ 5 = 20,7 e 37,5 − 20,7 = 16,8, que o aluno encaixa no 16,7 mais próximo. A Índia é asiática e fica de fora do recorte.
- depois: 16,7 não confere: a média de Chile, México, Peru e Costa Rica é 81,2 ÷ 4 = 20,3, e 37,5 − 20,3 = 17,2.
- conta conferida: `37.5-(21.9+20.9+19.8+18.6)/4` → 17.2

### 58d325ba · E [183 cm e 199 cm.] (gab C) ✔
- antes: Vem do mesmo tipo de deslize, agora 1 cm para menos (1 324 no lugar de 1 325): 1 324 − 942 = 382 e 183 + 199 = 382. É o distrator montado para quem erra a adição por pouco.
- depois: 183 + 199 = 382, e os ausentes têm de somar 1 325 − 5 × 188,4 = 383. Entre as alturas, só 185 + 198 = 383 fecha.
- conta conferida: `1325-5*188.4` → 383

### 0e7d408a · E [588 anos.] (gab C)
- antes: Equivale à média 'redonda' de 28 anos, pois 21 × 28 = 588. Testando: 588 − 60 = 528 e 528 ÷ 20 = 26,4; a diferença 28 − 26,4 = 1,6 ano. É o chute mais próximo do alvo, e só a média 30 produz exatamente 1,5.
- depois: Com soma 588, as 20 mais novas somariam 528, com média 26,4, e o grupo teria média 28. A diferença seria 1,6 ano, e não 1,5.
- conta conferida: `588/21-528/20` → 1.6

### 526f9fe7 · B [6.] (gab A)
- antes: Provavelmente de aceitar um encontro aproximado: com n = 6 a equipe A cai para 57 − 6 = 51 e a B sobe para 36 + 12 = 48. Os números ficam parecidos, mas ainda sobram 3 lances de diferença, e o enunciado pede médias exatamente iguais.
- depois: Com n = 6, as médias ficam 57 − 6 = 51 e 36 + 12 = 48, ainda 3 lances distantes. Igualar exige 3n = 21, isto é, n = 7.
- conta conferida: `57-6-(36+12)` → 3

### 526f9fe7 · D [4.] (gab A)
- antes: Provavelmente de dividir a diferença 21 por um número errado de deslocamentos: 21 ÷ 5 = 4,2, arredondado para 4. O deslocamento total por unidade de n é n + 2n = 3n, então o divisor é 3. Com n = 4 as médias ficam 53 e 44, nove lances de distância.
- depois: Com n = 4, as médias ficam 57 − 4 = 53 e 36 + 8 = 44, ainda 9 lances distantes. Igualar exige 3n = 21, isto é, n = 7.
- conta conferida: `57-4-(36+8)` → 9

### 6ffb8e1e · A [6,75.] (gab C)
- antes: Provavelmente de tentar valores em vez de montar a equação. Se os 4 alunos tivessem 6,75, a média da turma seria (45,5 + 4 × 6,75) ÷ 11 = 72,5 ÷ 11 = 6,59, que não é igual a 6,75. As alternativas sobem de 0,25 em 0,25 justamente para punir o chute.
- depois: Testando 6,75: (45,5 + 4 × 6,75) ÷ 11 = 72,5 ÷ 11 ≈ 6,59, diferente de 6,75. Só 6,5 fecha: (45,5 + 26) ÷ 11 = 6,5.
- conta conferida: `(45.5+4*6.75)/11` → 6.59091

### 6ffb8e1e · B [7,25.] (gab C)
- antes: Provavelmente de contar errado quantos alunos faltam: quem esquece de incluir o aluno da nota 0,5 na contagem acha 11 − 6 = 5 restantes e cai em 45,5 = 6M, ou seja M ≈ 7,58, marcando o valor mais próximo da lista. Testando 7,25: (45,5 + 29) ÷ 11 = 6,77, diferente de 7,25.
- depois: Testando 7,25: (45,5 + 4 × 7,25) ÷ 11 = 74,5 ÷ 11 ≈ 6,77, diferente de 7,25. Só 6,5 fecha: (45,5 + 26) ÷ 11 = 6,5.
- conta conferida: `(45.5+4*7.25)/11` → 6.77273

### 9f20bb8d · A [36 anos.] (gab D)
- antes: Provavelmente de errar a multiplicação 29 × 28, usando 820 no lugar de 812: aí 870 − 820 = 50 viraria a idade de parada e 50 − 14 = 36. Testando 36: ela teria parado aos 50, a soma das idades de parada seria 862 e a média dos tempos sem lutar daria 728 ÷ 30 = 24,27 anos, e não 24.
- depois: Começando aos 36, ela teria parado aos 50, e as idades de parada somariam 812 + 50 = 862. Elas somam 1 590 − 720 = 870.
- conta conferida: `812+50` → 862

### 9f20bb8d · E [32 anos.] (gab D)
- antes: Provavelmente de um deslize na subtração 870 − 812, saindo 46 em vez de 58, o que leva a 46 − 14 = 32. Testando 32: parada aos 46, soma das idades de parada 858 e média dos tempos sem lutar 732 ÷ 30 = 24,4 anos, acima dos 24 anos do enunciado.
- depois: Começando aos 32, ela teria parado aos 46, e as idades de parada somariam 812 + 46 = 858. Elas somam 1 590 − 720 = 870.
- conta conferida: `812+46` → 858

### 75b9d5aa · C [0,6 MTEP.] (gab B)
- antes: Provavelmente um erro de uma casa decimal na soma de uma das colunas: para a diferença sair 0,6 MTEP, um dos totais teria de ser 119,7 ou 120,4, e os valores corretos são 119,8 e 120,3.
- depois: 0,6 não confere: os totais são 39,2 + 43,6 + 25,7 + 11,8 = 120,3 em 2012 e 39,9 + 42,8 + 26,0 + 11,1 = 119,8 em 2011. A diferença é 0,5.
- conta conferida: `(39.2+43.6+25.7+11.8)-(39.9+42.8+26.0+11.1)` → 0.5

### 75b9d5aa · E [0,9 MTEP.] (gab B)
- antes: Provavelmente de trocar o sinal da linha 'outras' ao somar as variações fonte a fonte: −0,7 + 0,8 − 0,3 − 0,7 = −0,9, e quem ignora o sinal marca 0,9. Na tabela, 'outras' subiu de 11,1 para 11,8, então entra somando.
- depois: 0,9 não confere: o total vai de 119,8 em 2011 para 120,3 em 2012, uma variação de 0,5 MTEP.
- conta conferida: `120.3-119.8` → 0.5

### 1253193c · B [46º.] (gab A)
- antes: Provavelmente de estimar o setor olhando o desenho em vez de calcular. Um setor de 46° corresponderia a 46 ÷ 360 × 144 = 18,4 peças do tipo A, e o estoque tem 16.
- depois: 46° corresponderia a 46 ÷ 360 × 144 = 18,4 peças, e o tipo A tem 16. O setor é 16 ÷ 144 × 360 = 40°.
- conta conferida: `46/360*144` → 18.4

### 1253193c · C [38º.] (gab A)
- antes: Provavelmente de errar a soma do total para mais, usando 152 peças: 360° × 16 ÷ 152 = 37,9°, que arredonda para 38°. Esse ângulo valeria 15,2 peças do tipo A.
- depois: 38° corresponderia a 38 ÷ 360 × 144 = 15,2 peças, e o tipo A tem 16. O setor é 16 ÷ 144 × 360 = 40°.
- conta conferida: `38/360*144` → 15.2

### 1253193c · E [44º.] (gab A)
- antes: Provavelmente de usar 400 no lugar de 360 para a volta completa: 400 × 16 ÷ 144 = 44,4°. A volta de um círculo em graus é 360°.
- depois: 44° corresponderia a 44 ÷ 360 × 144 = 17,6 peças, e o tipo A tem 16. O setor é 16 ÷ 144 × 360 = 40°.
- conta conferida: `44/360*144` → 17.6

### 0b9716e8 · A [menos – menos – mais] (gab B)
- antes: Acerta a inflação e o PIB e erra os tributos, provavelmente ligando 'inflação caindo' a 'pagar menos imposto'. A coluna da arrecadação sobe de 1,70 para 1,86 trilhão, então paga-se mais.
- depois: A segunda lacuna está errada: a arrecadação sobe de 1,70 para 1,78 e 1,86 trilhão, então se paga mais tributo.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### 0b9716e8 · D [menos – mais – menos] (gab B)
- antes: Acerta as duas primeiras lacunas e erra a do PIB, provavelmente confundindo a queda da inflação com uma queda da produção. O PIB vai de 4,92 para 5,25 trilhões, ou seja, cresce.
- depois: A terceira lacuna está errada: o PIB sobe de 4,92 para 5,02 e 5,25 trilhões, então se produz mais.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### d6a93e83 · B [20%] (gab C)
- antes: Provavelmente de somar o total errado contando a maior fatia duas vezes: 38,69 + 19,42 = 58,11, e 11,66 ÷ 58,11 = 20,1 %. Um total inflado derruba a porcentagem.
- depois: 20 % não confere: o setor privado sem carteira tem 11,66 dos 38,69 milhões de informais, e 11,66 ÷ 38,69 ≈ 30 %.
- conta conferida: `11.66/38.69` → 0.30137

### E0200cd3 · C [entre 12% e 25%.] (gab E)
- antes: Para o acréscimo ficar entre 12 % e 25 %, o total de 1675 teria de ficar entre 133 × 1,12 ≈ 149 e 133 × 1,25 ≈ 166 milhões. Provavelmente vem de subestimar a coluna de 1675, por exemplo lendo o pico azul como 60 em vez de 88 — mas esse pico sozinho já passa de 85 milhões.
- depois: 12 % a 25 % exigiria um total de 1675 entre 133 × 1,12 ≈ 149 e 133 × 1,25 ≈ 166 milhões. O gráfico dá cerca de 228 milhões.
- conta conferida: `133*1.12` → 148.96

### E0200cd3 · D [inferior a 12%.] (gab E)
- antes: Abaixo de 12 % o total de 1675 ficaria no máximo em 133 × 1,12 ≈ 149 milhões, quase parado. Provavelmente sai de comparar a coluna errada: em 1725 o gráfico mostra cerca de 88 (Reino Unido) + 77 (Alemanha) + 72 (França) ≈ 237 milhões, e de 228 para 237 o acréscimo é 9 ÷ 228 ≈ 0,04, só 4 %, que de fato é inferior a 12 %.
- depois: Abaixo de 12 %, o total de 1675 ficaria abaixo de 149 milhões. O gráfico dá cerca de 228, um acréscimo de 228 ÷ 133 − 1 ≈ 71 %.
- conta conferida: `228/133-1` → 0.714286

### E4068eb4 · B [80%.] (gab A)
- antes: Provavelmente sai de supor que todos os 10 pacientes acabaram tratados e que só os dois casos mais chamativos do dia 1 (o 6, acima de 160, e o 2, bem à direita de 100) já tinham indicação antes: 8 ÷ 10 = 80 %. Mas quatro pacientes nunca fecham critério nenhum, e o 3 também já estava indicado no dia 1.
- depois: 80 % não confere: 6 pacientes receberam indicação, e só 3 deles (7, 8 e 10) depois do dia 31. 3 ÷ 6 = 50 %.
- conta conferida: `3/6` → 0.5

### E4068eb4 · E [40%.] (gab A)
- antes: 40 % é 4 ÷ 10. Provavelmente vem de contar como novo também o paciente 9, que no dia 1 está entre as linhas de 90 e 100 mas no dia 31 fica à esquerda da linha de 90, e de dividir pelos 10 pacientes em vez de pelos 6 indicados.
- depois: 40 % não confere: 6 pacientes receberam indicação, e só 3 deles (7, 8 e 10) depois do dia 31. 3 ÷ 6 = 50 %.
- conta conferida: `3/6` → 0.5

### 2761e41f · C [55.] (gab A)
- antes: Provavelmente de errar as duas pontas ao mesmo tempo, usando os 48 % dos homens e ainda esquecendo a faixa de 60 anos ou mais: 0,48 × 113,9 = 54,7 milhões, que arredonda para 55.
- depois: 55 milhões não confere: com 18 anos ou mais há 190,8 − 56,3 = 134,5 milhões, e 52 % disso são 0,52 × 134,5 ≈ 70 milhões.
- conta conferida: `0.52*(190.8-56.3)` → 69.94

### 5cc56053 · A [1,750%.] (gab C)
- antes: É exatamente o dobro do valor certo. Provavelmente de dividir o 1,4 milhão de pessoas pela média dos tamanhos das faixas, 80 milhões, em vez de dividir pelo total: 1,4 ÷ 80 = 0,0175, ou 1,75 %. O denominador tem de ser o grupo inteiro, 160 milhões.
- depois: 1,750 % é o dobro do certo. Param 0,015 × 60 + 0,005 × 100 = 1,4 milhão de pessoas, e 1,4 ÷ 160 = 0,875 %.
- conta conferida: `(0.015*60+0.005*100)/160` → 0.00875

### 5cc56053 · D [0,975%.] (gab C)
- antes: Provavelmente um deslize na divisão final. Para o resultado ser 0,975 %, o número de pessoas que pararam teria de ser 0,00975 × 160 = 1,56 milhão, e a soma das duas faixas dá 1,4 milhão.
- depois: 0,975 % exigiria 0,00975 × 160 = 1,56 milhão de pessoas paradas. São 0,9 + 0,5 = 1,4 milhão, e 1,4 ÷ 160 = 0,875 %.
- conta conferida: `0.00975*160` → 1.56

### 5cc56053 · E [0,775%.] (gab C)
- antes: Provavelmente de dividir por um total errado: usando 180 milhões no lugar de 160, sai 1,4 ÷ 180 = 0,00778, ou seja 0,778 %. Para dar 0,775 % seria preciso que 1,24 milhão de pessoas tivessem parado, e não 1,4 milhão.
- depois: 0,775 % exigiria 0,00775 × 160 = 1,24 milhão de pessoas paradas. São 0,9 + 0,5 = 1,4 milhão, e 1,4 ÷ 160 = 0,875 %.
- conta conferida: `0.00775*160` → 1.24

### 316bee65 · A [R$ 28.000,00.] (gab D)
- antes: Provavelmente de acertar o PIB total e errar a população: quem esquece os 3 milhões do estado C divide 675 000 por 24 e encontra 28 125, que é o valor mais próximo de R$ 28.000,00. O denominador tem de reunir TODOS os habitantes da região, os 27 milhões.
- depois: R$ 28.000,00 não confere. Somando população × per capita, o PIB é 675 000 para 27 milhões de habitantes, e 675 000 ÷ 27 = 25 000.
- conta conferida: `(1*15000+8*15000+3*30000+15*30000)/27` → 25000

### 316bee65 · C [R$ 27.500,00.] (gab D)
- antes: Provavelmente de perder uma parcela de cada lado da divisão: deixar o estado A fora da soma dos PIB (120 000 + 90 000 + 450 000 = 660 000) e o estado C fora da população (1 + 8 + 15 = 24) dá 660 000 ÷ 24 = 27 500. Cada estado precisa entrar nas duas somas.
- depois: R$ 27.500,00 não confere. Somando população × per capita, o PIB é 675 000 para 27 milhões de habitantes, e 675 000 ÷ 27 = 25 000.
- conta conferida: `675000/27` → 25000

### 316bee65 · E [R$ 29.500,00.] (gab D)
- antes: Provavelmente de ler a tabela trocando a linha do estado B e dar a ele também o per capita de 30 000: o PIB total viraria 15 000 + 240 000 + 90 000 + 450 000 = 795 000 e a divisão por 27 daria cerca de 29 444, perto de R$ 29.500,00. O estado B tem 8 milhões de habitantes com per capita de 15 000.
- depois: R$ 29.500,00 não confere: fica quase no per capita dos estados C e D. Ponderando pela população, 675 000 ÷ 27 = 25 000.
- conta conferida: `675000/27` → 25000

### 6b8b2db6 · C [4.] (gab E) ✔
- antes: Provavelmente de parar no meio do completamento de quadrado: k² − 4k + 3 = 0 pode ser escrito como (k − 2)² = 1, e quem lê isso como k − 2 = 0 conclui k = 2 e k² = 4. Falta extrair a raiz dos dois lados, que dá k − 2 = 1 ou k − 2 = −1.
- depois: k² = 4 daria k = ±2, mas k = 2 viola k < 2, e k = −2 não zera k² − 4k + 3 (dá 15). As raízes são 1 e 3, e só k = 1 serve.
- conta conferida: `(-2)**2-4*(-2)+3` → 15

### 6ba3e595 · E [– 4.] (gab B)
- antes: Provavelmente de multiplicar pela metade a casa da linha 2 com a coluna 2, usando só o último produto (1 × 2 = 2) em vez da soma 6 − 2 + 2. O determinante sairia (−2) × 2 − 0 = −4.
- depois: −4 não confere: as igualdades casa a casa dão m = 2, e det C = (−m) × 6 − 0 × 3m = −6 × 2 = −12.
- conta conferida: `-6*2` → -12

### d6f5b49d · B [12.] (gab A)
- antes: Provavelmente de errar o sinal do termo x² ao abrir o determinante, ficando com p(x) = x³ − x² − 2x − m. Aí p(3) = 27 − 9 − 6 − m = 12 − m e a conta devolve m = 12. O +x² nasce de −(−1) × x dentro do determinante menor.
- depois: Com m = 12, p(3) = 27 + 9 − 6 − 12 = 18, e não 0. Como p(x) = x³ + x² − 2x − m, a divisão por x − 3 exige m = 30.
- conta conferida: `27+9-6-12` → 18

### d6f5b49d · D [– 3.] (gab A)
- antes: Provavelmente de parar antes do fim e responder a própria raiz com o sinal trocado, como se a pergunta fosse pela raiz do divisor e não pelo m. O −3 não aparece em nenhuma linha da conta: o que se iguala a zero é p(3), não o m.
- depois: Com m = −3, p(3) = 27 + 9 − 6 + 3 = 33, e não 0. Como p(x) = x³ + x² − 2x − m, a divisão por x − 3 exige m = 30.
- conta conferida: `27+9-6+3` → 33

### 5b1a7ee1 · D [7.] (gab B)
- antes: Provavelmente vem de somar as quatro contagens que o público viu, 1 + 2 + 2 + 3 = 8, e descontar um ponto ao perceber que alguma coisa se repete no meio do truque. O desconto é pequeno demais: o que se repete não é um ponto, são faces inteiras, cada uma contada duas vezes.
- depois: 7 não é o mínimo: basta desenhar 2 pontos na frente e 3 no verso, que exibem 1, 2, 2 e 3. Total 5.
- conta conferida: `2+3` → 5

### Ed396d93 · A [4.] (gab C)
- antes: O 4 é o N, e ele sai logo na primeira coluna: N + 1 termina em 5, então N = 4. Provavelmente quem marca 4 não chegou a resolver a coluna das unidades e, não enxergando nenhum 4 na conta, concluiu que ele era o que faltava.
- depois: 4 está associado a uma letra: na coluna das unidades, N + 1 termina em 5, logo N = 4. O algarismo que sobra é o 8.
- conta conferida: `5-1` → 4

### E774f0c7 · A [(1 : 2 : 3 : 2) na base 6] (gab B)
- antes: Essa escrita vale 1 × 216 + 2 × 36 + 3 × 6 + 2 = 308, e não 363: faltam 55. Provavelmente errou a casa de 36, enxergando dois 36 em 147 (2 × 36 = 72) em vez de quatro (4 × 36 = 144), e tentou compensar nas casas pequenas, que não têm tamanho para cobrir a diferença.
- depois: (1 : 2 : 3 : 2) na base 6 vale 216 + 72 + 18 + 2 = 308. O número é 343 + 14 + 6 = 363, que dá (1 : 4 : 0 : 3).
- conta conferida: `216+72+18+2` → 308

### E774f0c7 · C [(1 : 1 : 4 : 0) na base 6] (gab B)
- antes: Essa escrita vale 1 × 216 + 1 × 36 + 4 × 6 + 0 = 276. Provavelmente trocou de posição os algarismos 4 e 1: o 4 pertence à casa de 36 e o 1 à casa de 216. Mudar a ordem muda o número, porque cada posição carrega uma potência diferente.
- depois: (1 : 1 : 4 : 0) na base 6 vale 216 + 36 + 24 + 0 = 276. O número é 343 + 14 + 6 = 363, que dá (1 : 4 : 0 : 3).
- conta conferida: `216+36+24` → 276

### E774f0c7 · D [(1 : 0 : 5 : 4) na base 6] (gab B)
- antes: Essa escrita vale 1 × 216 + 0 × 36 + 5 × 6 + 4 = 250. Provavelmente copiou o desenho dos algarismos da base 7 (1, 0, 2, 6), mantendo o 1 e o 0 na frente e mexendo só no final. Traduzir algarismo por algarismo de uma base para outra não funciona: é preciso passar pelo valor, 363.
- depois: (1 : 0 : 5 : 4) na base 6 vale 216 + 0 + 30 + 4 = 250. O número é 343 + 14 + 6 = 363, que dá (1 : 4 : 0 : 3).
- conta conferida: `216+30+4` → 250

### E774f0c7 · E [(1 : 3 : 1 : 2) na base 6] (gab B)
- antes: Essa escrita vale 1 × 216 + 3 × 36 + 1 × 6 + 2 = 332, 31 a menos que 363. Provavelmente usou 3 na casa de 36 (3 × 36 = 108) e ficou com 39 de sobra, que não cabe nas casas de baixo com algarismos de 0 a 5 — e é exatamente esse resto grande demais que denuncia o algarismo errado na casa de 36.
- depois: (1 : 3 : 1 : 2) na base 6 vale 216 + 108 + 6 + 2 = 332. O número é 343 + 14 + 6 = 363, que dá (1 : 4 : 0 : 3).
- conta conferida: `216+108+6+2` → 332

### Ea192016 · C [(16, 1, 26, 15, 25, 24, 9).] (gab A)
- antes: A abertura é igual à da correta e a divergência está só na rodada 5. Com a lista (9, 24, 25), 25 ÷ 3 deixa resto 1 (3 × 8 = 24), então r = 2 e sai o 24. Para sair o 25 seria preciso r = 3, isto é, resto 2, e esse resto não sai de conta nenhuma. E a alternativa nem assim fecha: depois de tirar o 25 sobrariam o 9 e o 24, e o algoritmo os retiraria nessa ordem (d = 2, D = 50 − 24 = 26, resto 0, r = 1 tira o 9; depois o 24), enquanto a alternativa traz 24 e depois 9.
- depois: Diverge na rodada 5. Com a lista (9, 24, 25), D = 25 e o resto de 25 ÷ 3 é 1, logo r = 2 e sai o 24, não o 25.
- conta conferida: `25%3+1` → 2

### d1d87aac · C [RETOS.] (gab E)
- antes: Provavelmente pega as letras de posições erradas e ainda inverte as restantes: com as posições 3 e 5 de SORTE (R e E) e as sobras S, O, T escritas de trás para a frente (T, O, S), sai R + E + TOS = RETOS. São duas regras quebradas na mesma conta: as posições são as do enunciado (2 e 5, depois 5 e 2) e as restantes mantêm a ordem original.
- depois: RETOS não confere. A 1.ª função dá O + E + SRT = OESRT; a 2.ª, com posições 5 e 2, dá T + E + OSR = TEOSR.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### d1d87aac · D [ERTOS.] (gab E)
- antes: Provavelmente é o mesmo caminho de C, com as sobras invertidas (T, O, S), só que entregando as duas letras escolhidas na ordem trocada: E + R + TOS = ERTOS. Repare que C e D são a mesma palavra com as duas primeiras letras permutadas — o par clássico de distratores para quem chutou a ordem de p e q.
- depois: ERTOS não confere. A 1.ª função dá O + E + SRT = OESRT; a 2.ª, com posições 5 e 2, dá T + E + OSR = TEOSR.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### 5f0d282a · D [2 e 16.] (gab E) ✔
- antes: Provavelmente lê a raiz do divisor como se fosse o valor de a: por causa de x − 2, escreve a = 2. Depois calcula a × 2³ = 2 × 8 = 16 e copia esse 16 como se fosse b. Nenhuma das duas condições da questão chega a ser usada.
- depois: Com a = 2 e b = 16, P(2) = 16 + 4 + 16 = 36, e não 0: x − 2 não divide. As duas condições dão a = 1 e b = −12.
- conta conferida: `2*8+4+16` → 36

### d6793422 · B [(1 – i)2.] (gab C)
- antes: Provavelmente o aluno percebe que sobra um fator de grau 2 e supõe que ele tem raiz dupla, escolhendo 1 − i repetido. Duas raízes iguais a 1 − i somariam 2 − 2i, e a soma precisa ser 0. E lido ao pé da letra, (1 − i)² é um número só, igual a −2i, enquanto a questão pede duas raízes.
- depois: (1 − i)² = −2i é um número só. E duas raízes iguais a 1 − i somariam 2 − 2i, mas as que faltam somam 3 − 3 = 0.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### d6793422 · E [(1 – i) e (1 + i).] (gab C)
- antes: Erra um coeficiente na divisão por (x − 1)³ e chega a x² − 2x + 2 = 0, cujas raízes são 1 − i e 1 + i. É o distrator mais forte porque é um par conjugado de aparência correta, mas ele soma 2, quando precisa somar 0, e multiplica 2, quando precisa dar 1.
- depois: 1 − i e 1 + i somam 2 e multiplicam 2. As duas raízes que faltam somam 3 − 3 = 0 e têm produto 1: são −i e +i.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### 7c7b8cac · A [7.] (gab E)
- antes: Provavelmente soma apenas a parte real de dois dos três pares: faz 5 + 2 = 7, em vez de 5 + (2 + i) + (2 − i) = 9. Os dois i se cancelam entre si, e é por isso que b sai real e vale 9. E ainda entrega esse 7 como resposta, sem somar o a.
- depois: 7 não confere: as raízes são 2 + i, 2 − i e 1, o que dá a = −5 e b = 5 + 4 = 9. Então a + b = 4.
- conta conferida: `-5+9` → 4

### P7a272fd · A [130] (gab D)
- antes: Provavelmente entendeu que, ficando maior, o animal passa a gastar menos por quilograma, e fez 250 ÷ 2 = 125, arredondando para 130. Dividir por 2 não se apoia em nada do enunciado: o consumo acompanha a área, e a área aumentou de 0,14 m² para 0,22 m², não diminuiu.
- depois: 130 kcal seria menos que os 250 iniciais, mas a área cresce de 0,14 para 0,22 m². O consumo vai a 250 × 0,22 ÷ 0,14 ≈ 393 kcal.
- conta conferida: `250*0.22/0.14` → 392.857

### P7a272fd · B [250] (gab D)
- antes: Provavelmente concluiu que, como a curva vai ficando deitada, a área praticamente não muda, e repetiu o número que já estava no enunciado. Mas o próprio gráfico mostra a área subindo de 0,14 m² para 0,22 m², um aumento de mais de 50 %.
- depois: 250 kcal manteria a área fixa. O gráfico mostra a área indo de 0,14 para 0,22 m², e 250 × 0,22 ÷ 0,14 ≈ 393 kcal.
- conta conferida: `250*0.22/0.14` → 392.857

### P7a272fd · C [310] (gab D)
- antes: Provavelmente leu a primeira área alto demais, em 0,18 m² (no gráfico, esse valor corresponde a pouco mais de 5 kg, e não a 3,5 kg), e fez 250 × 0,22 ÷ 0,18 ≈ 306, arredondando para 310.
- depois: 310 kcal exigiria razão de áreas 1,24. Pelo gráfico ela é 0,22 ÷ 0,14 ≈ 1,57, e 250 × 1,57 ≈ 393 kcal.
- conta conferida: `310/250` → 1.24

### P107f227 · A [da altura de um poste.] (gab D)
- antes: Provavelmente quem troca 2³² por 2¹⁶ ao tentar simplificar (2¹⁶)² usando só a base: 0,1 mm × 65 536 = 6 553,6 mm ≈ 6,5 m, que é a altura de um poste.
- depois: Um poste tem cerca de 10 m. A pilha tem 2³² folhas × 0,1 mm ≈ 4,3 × 10⁸ mm, ou cerca de 430 km.
- conta conferida: `2**32*0.1/1e6` → 429.497

### P107f227 · B [da altura de um prédio de 30 andares.] (gab D)
- antes: Provavelmente quem usa 2¹⁰ ≈ 10³ e para no 2²⁰, esquecendo o resto do expoente: 0,1 mm × 1 048 576 ≈ 104 858 mm ≈ 105 m, que é a casa de um prédio.
- depois: Um prédio de 30 andares tem cerca de 100 m. A pilha tem 2³² folhas × 0,1 mm ≈ 4,3 × 10⁸ mm, ou cerca de 430 km.
- conta conferida: `2**32*0.1/1e6` → 429.497

### Pd58ea77 · E [6,0 m3] (gab A)
- antes: Provavelmente quem soma o bloco inteiro que envolve a escada (400 × 50 × 200 = 4 000 000 cm³) com a metade triangular (2 000 000 cm³), contando duas vezes o mesmo material: 6 000 000 cm³ = 6,0 m³.
- depois: 6,0 m³ é quase o triplo do certo. As 20 colunas têm alturas de 10 a 200 cm: 1 000 × (10 + 200) × 20 ÷ 2 = 2 100 000 cm³ = 2,1 m³.
- conta conferida: `1000*(10+200)*20/2` → 2.1e+06

### P17de0d9 · C [60 54] (gab E)
- antes: Provavelmente arredondou em vez de calcular: na primeira coluna chutou um número redondo acima da média (60) em lugar dos 61,3 que saem da equação, e na segunda apenas arredondou o valor dos homens aos 20 anos, 53,8, para 54, esquecendo de fazer a média com o valor das mulheres.
- depois: 60 não confere: EVM19 = 2 × 58 − 54,7 = 61,3. E 54 não é a média dos 20 anos, que é (53,8 + 60,4) ÷ 2 = 57,1.
- conta conferida: `(53.8+(53.8+2*58-2*54.7))/2` → 57.1

### P2263bc6 · B [r′ = 2a1] (gab A)
- antes: Provavelmente achou que cada passo de (bₙ) consome dois termos de (aₙ) e somou a₁ + a₂; como (aₙ) acabou sendo constante, a₂ = a₁ e a soma deu 2a₁. Mas a lei bₙ₊₁ = bₙ + aₙ soma um único termo de (aₙ) por passo.
- depois: 2a₁ não confere: bₙ₊₁ − bₙ = aₙ, um termo só. Para (bₙ) ser PA, aₙ tem de ser constante (r = 0), e então r′ = a₁.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### P2263bc6 · D [r′ = 2r] (gab A)
- antes: Provavelmente testou o exemplo do enunciado: em (bₙ) = 0, 1, 4, 9, 16, … os saltos são 1, 3, 5, 7 e crescem de 2 em 2, que é o r de (aₙ). Chamou esse 2 em 2 de razão e dobrou o r. Só que nesse exemplo (bₙ) não é PA, então ele não serve para achar r′.
- depois: 2r não confere: para (bₙ) ser PA, aₙ tem de ser constante, logo r = 0. O salto de (bₙ) é aₙ = a₁, então r′ = a₁.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### P3df432d · A [R$ 9,40.] (gab E)
- antes: Provavelmente vem de errar a subtração que isola o b e sair com −1 880 em vez de −1 900: 1 880 ÷ 200 = 9,40. A diferença correta é 300 − (−1 600) = 1 900, e subtrair um número negativo soma.
- depois: R$ 9,40 exigiria b = −1 880. Das duas vendas, 6b − 5b = −1 600 − 300, isto é, b = −1 900, e o vértice fica em 1 900 ÷ 200 = 9,50.
- conta conferida: `(-1600-300)/-200` → 9.5

### P3df432d · B [R$ 9,45.] (gab E)
- antes: Provavelmente vem de chutar um valor entre os preços dados e o vértice, sem fechar a conta. Para dar 9,45 o b teria de ser −1 890 (porque 9,45 × 200 = 1 890), e nenhuma das duas equações produz esse número.
- depois: R$ 9,45 exigiria b = −1 890. Das duas vendas, 6b − 5b = −1 600 − 300, isto é, b = −1 900, e o vértice fica em 1 900 ÷ 200 = 9,50.
- conta conferida: `(-1600-300)/-200` → 9.5

### P3df432d · C [R$ 9,55.] (gab E)
- antes: Provavelmente vem de somar errado ao juntar 1 600 com 300 e obter 1 910: 1 910 ÷ 200 = 9,55. Repare que todas essas alternativas são 1 900 ÷ 200 com o 1 900 levemente trocado — por isso a conta precisa ser feita, não estimada.
- depois: R$ 9,55 exigiria b = −1 910. Das duas vendas, 6b − 5b = −1 600 − 300, isto é, b = −1 900, e o vértice fica em 1 900 ÷ 200 = 9,50.
- conta conferida: `(-1600-300)/-200` → 9.5

### P3df432d · D [R$ 9,60.] (gab E)
- antes: Provavelmente vem de dividir 1 900 por 200 “por aproximação” e parar em 9,6, ou de arredondar o b para −1 920. A divisão é exata: 200 × 9,5 = 1 900, sem sobra.
- depois: R$ 9,60 exigiria b = −1 920. Das duas vendas, 6b − 5b = −1 600 − 300, isto é, b = −1 900, e o vértice fica em 1 900 ÷ 200 = 9,50.
- conta conferida: `(-1600-300)/-200` → 9.5

### P52ba6c8 · A [21 segundos.] (gab D)
- antes: Provavelmente faz 180 ÷ 12 = 15 corretamente e depois soma os 6 °/s do ponteiro grande como se fossem segundos: 15 + 6 = 21. Velocidade e tempo não se somam.
- depois: Em 21 s a diferença seria 12 × 21 = 252°, além de 180°. Ela cresce 18 − 6 = 12° por segundo e chega a 180° em 15 s.
- conta conferida: `12*21` → 252

### P52ba6c8 · B [18 segundos.] (gab D)
- antes: Provavelmente entrega a velocidade no lugar do tempo: 18 é o número de graus por segundo do ponteiro pequeno (360 ÷ 20), não o instante em que eles se opõem.
- depois: Em 18 s a diferença seria 12 × 18 = 216°, além de 180°. Ela cresce 18 − 6 = 12° por segundo e chega a 180° em 15 s.
- conta conferida: `12*18` → 216

### Pc037c48 · A [204.] (gab E)
- antes: Provavelmente quem usou o caminho do líder (6 maneiras de escolher o líder) mas errou a contagem dos acompanhantes, usando 34 em vez de 31: 6 × 34 = 204. O número de grupos não vazios que se pode formar com as 5 pessoas restantes é 2⁵ − 1 = 31.
- depois: 204 não confere: escolhe-se o líder (6 modos) e um grupo não vazio das outras 5 pessoas (2⁵ − 1 = 31): 6 × 31 = 186.
- conta conferida: `6*(2**5-1)` → 186

### Pc037c48 · B [210.] (gab E)
- antes: Provavelmente quem também seguiu o caminho do líder e contou 35 escolhas de acompanhantes, somando 4 possibilidades que não existem: 6 × 35 = 210. Os subconjuntos das outras 5 pessoas são 2⁵ = 32 no total, e só 31 deles servem.
- depois: 210 não confere: escolhe-se o líder (6 modos) e um grupo não vazio das outras 5 pessoas (2⁵ − 1 = 31): 6 × 31 = 186.
- conta conferida: `sum(k*comb(6,k) for k in range(2,7))` → 186

### P228b516 · C [0,264.] (gab E)
- antes: Somou os dois caminhos que passam por B (0,048 + 0,216 = 0,264) e esqueceu o caminho direto A→C→F. Provavelmente leu a seta A→C como se ela não existisse, achando que todo carro sai de A para B.
- depois: 0,264 deixa de fora o caminho A → C → F, que vale 0,2 × 0,6 = 0,12. Somando os três: 0,048 + 0,216 + 0,12 = 0,384.
- conta conferida: `0.8*0.1*0.6+0.8*0.9*0.3+0.2*0.6` → 0.384

### Pc4620d6 · E [250%.] (gab B)
- antes: Provavelmente quem descontou só metade da inflação do aumento nominal, fazendo 300 % − 50 % = 250 %, por tratar o efeito da inflação como se valesse meio aumento. Continua sendo subtração de porcentagens, que é justamente o que não vale aqui.
- depois: 250 % não confere: o salário vira 4x e a inflação leva o custo a 2x, então o ganho real é 4x ÷ 2x − 1 = 100 %.
- conta conferida: `4/2-1` → 1

### P67c88e6 · B [10 cm.] (gab A)
- antes: Provavelmente misturou um comprimento com um quadrado: achou a diagonal da face quadrada de 4 cm × 4 cm, que vale √32, cerca de 5,7 cm, e somou direto a aresta de 4 cm, chegando a aproximadamente 9,7 cm, arredondado para 10 cm. Os lados têm de entrar na conta elevados ao quadrado, não somados crus.
- depois: 10 cm não confere: o diâmetro é a diagonal da caixa, √(7² + 4² + 4²) = √81 = 9 cm.
- conta conferida: `sqrt(49+16+16)` → 9

### P4f670c8 · B [R$ 3.200,00] (gab C)
- antes: Provavelmente testou descontos inteiros na mão e parou cedo: com R$ 2,00 de desconto, 8 × 400 = 3 200, sem conferir R$ 3,00 e R$ 4,00. O mesmo valor aparece com R$ 6,00 de desconto, que já passou do topo.
- depois: R$ 3.200,00 sai com R$ 2,00 de desconto (8 × 400) ou R$ 6,00 (4 × 800), mas não é o máximo. Com R$ 4,00, 6 × 600 = 3 600.
- conta conferida: `8*400` → 3200

### Pb462d0a · A [19] (gab C)
- antes: Provavelmente quem para no primeiro número da faixa: toma n = 20 e aplica nele a regra que só vale para primo, contando todos os 19 números de 1 a 19 como se tivessem mdc 1 com 20. O valor certo é E(20) = 8, porque 9 desses números são pares e mais 2 são múltiplos de 5 (o 5 e o 15): 19 − 9 − 2 = 8.
- depois: 19 não é E(n) de nenhum n de 20 a 25: E(20) = 8, por exemplo. O maior valor é E(23) = 22, porque 23 é primo.
- conta conferida: `23-1` → 22

### P0b35a06 · B [5.] (gab A)
- antes: Provavelmente testou inteiros consecutivos, a = 2 e b = 3, porque eles respeitam b − a = 1, e somou 2 + 3 = 5. Mas esse par não passa nas outras duas linhas: a² − b² daria 4 − 9 = −5, e o necessário é −3; e b³ − a³ daria 27 − 8 = 19, não 7.
- depois: Com a = 2 e b = 3 (soma 5), a² − b² = −5, mas o termo em x exige −9 ÷ 3 = −3. A solução é a = 1 e b = 2.
- conta conferida: `4-9` → -5

### P0b35a06 · C [6.] (gab A)
- antes: Provavelmente trocou a divisão por uma soma ao isolar a² − b²: em vez de −9 ÷ 3 = −3, fez −9 + 3 = −6. Como a − b = −1, isso dá (a + b) × (−1) = −6 e a + b = 6. O 3 está multiplicando, então ele sai dividindo: −9 ÷ 3 = −3.
- depois: a + b = 6 com b − a = 1 daria a = 2,5 e b = 3,5, e a² − b² = −6, não −3. A solução é a = 1 e b = 2.
- conta conferida: `2.5**2-3.5**2` → -6

### P0b35a06 · E [12.] (gab A)
- antes: Provavelmente nem montou o sistema e combinou os números que já apareciam na expressão: 3 (do 3x²) somado com 9 (do −9x) dá 12. Os coeficientes não são a e b; eles são o resultado de contas com a e b, e precisam ser comparados um a um.
- depois: a + b = 12 com b − a = 1 daria a² − b² = −12, não −3. Os coeficientes dão a = 1 e b = 2, e a + b = 3.
- conta conferida: `-12*1` → -12

### Pdc0b730 · A [é um conjunto vazio.] (gab D)
- antes: Concluiu que nenhuma das retas alcança a circunferência, provavelmente errando o sinal ao substituir e achando Δ negativo nos dois sistemas. Mas o centro (1; 3) está a cerca de 1,41 da reta y = x, bem menos que o raio 2,83, então essa reta corta a circunferência com folga.
- depois: Não é vazio: o centro (1, 3) está a |1 − 3| ÷ √2 ≈ 1,41 da reta y = x, menos que o raio √8 ≈ 2,83. Essa reta corta o círculo.
- conta conferida: `abs(1-3)/sqrt(2)` → 1.41421

### Pc0a5d0a · B [17 mm.] (gab D)
- antes: Provavelmente vem de pegar o maior número da tabela — 17 mm, domingo no Setor Norte — e tratá-lo como o índice da cidade, supondo que o total da cidade é o maior total registrado. Ele é apenas uma das quatro medidas, de um dia e de um setor.
- depois: 17 mm não confere: ponderando pela área, sábado dá (7 × 10 + 11 × 30) ÷ 40 = 10 e domingo dá 15. Total: 25 mm.
- conta conferida: `(7*10+11*30)/40+(9*10+17*30)/40` → 25

### P5355fb8 · B [2,80] (gab E)
- antes: Provavelmente descontou, no lado de A, a leitura de 3,60 m em vez da altura do aparelho: 4,88 − 3,60 = 1,28, e somou com o 1,48 correto do lado de B, chegando a 2,76, que arredonda para 2,80. Os 3,60 m são a leitura da mira de B e não têm nada a ver com o lado de A.
- depois: 2,80 m não confere. O chão de A fica 40 × 0,122 = 4,88 m abaixo da luneta, e o de B, 3,60 − 40 × 0,087 = 0,12 m abaixo. Diferença: 4,76 m.
- conta conferida: `40*0.122-(3.60-40*0.087)` → 4.76

### P5355fb8 · D [3,96] (gab E)
- antes: Provavelmente fez 4,88 + 3,48 = 8,36, descontou a leitura 3,60 m e ainda tirou metade da altura do aparelho: 8,36 − 3,60 − 0,80 = 3,96. Nenhuma parte do problema justifica usar metade de 1,6 m — o aparelho ou é descontado inteiro no lugar certo, ou se cancela.
- depois: 3,96 m não confere. O chão de A fica 40 × 0,122 = 4,88 m abaixo da luneta, e o de B, 3,60 − 40 × 0,087 = 0,12 m abaixo. Diferença: 4,76 m.
- conta conferida: `40*0.122-(3.60-40*0.087)` → 4.76

### P108887f · A [proporcionalidade inversa entre duas grandezas.] (gab B)
- antes: Provavelmente trocou o segundo bigger (maior) por smaller (menor) na tradução. Quanto maior o público, menor o mercado é que seria proporcionalidade inversa. A frase diz maior nas duas metades.
- depois: Proporcionalidade inversa seria 'quanto maior o público, menor o mercado'. A frase diz bigger nas duas metades: as grandezas crescem juntas.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### P108887f · C [intersecção de dois conjuntos de dados.] (gab B) ✔
- antes: Provavelmente leu audience e market como dois conjuntos e pensou na parte comum entre eles (quem é público e consumidor ao mesmo tempo). A frase não fala de elementos em comum: ela compara o tamanho de um com o tamanho do outro.
- depois: A frase não fala de elementos comuns a dois conjuntos. Ela liga o tamanho do público ao tamanho do mercado.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### P108887f · D [decrescimento quadrático.] (gab B)
- antes: Provavelmente viu que a frase fala de tamanho e imaginou uma curva, escolhendo a palavra quadrático. Nada na frase dá expoente, e decrescimento inverte o sentido: a frase fala de aumentar, não de diminuir.
- depois: Decrescimento contraria a frase, que fala em crescer junto (bigger … bigger). E nada nela indica um expoente 2.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### P108887f · E [decrescimento exponencial.] (gab B)
- antes: Provavelmente associou crescer muito à palavra exponencial e marcou sem reparar no decrescimento. Além de inverter o sentido, a frase não diz a que ritmo o mercado cresce, só diz que ele cresce junto com o público.
- depois: Decrescimento contraria a frase, que fala em crescer junto (bigger … bigger). E nada nela indica um ritmo exponencial.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### P60baf57 · D [3/8] (gab E)
- antes: Provavelmente conta apenas 3 casos favoráveis (só as vitórias sobre o 15) e ainda perde um par ao listar o total, ficando com 8 em vez de 9 no denominador: 3 ÷ 8. O total é sempre 3 × 3 = 9, porque cada resultado de Ana se cruza com cada um dos de Beto.
- depois: 3/8 não confere. São 3 × 3 = 9 pares (somas 17, 18, 19 contra produtos 15, 18, 30), e Ana fica maior ou igual em 5: 5/9.
- conta conferida: `sum(1 for s in (17,18,19) for p in (15,18,30) if s>=p)/9` → 0.555556

### P1ca8c20 · A [12] (gab B)
- antes: Provavelmente resolveu por tentativa e parou em 31 acertos e 19 erros, par que dá 5 × 31 − 2 × 19 = 155 − 38 = 117 pontos, e não 124. A diferença desse par é 31 − 19 = 12.
- depois: Diferença 12 daria 31 acertos e 19 erros: 5 × 31 − 2 × 19 = 117 pontos, e não 124.
- conta conferida: `5*31-2*19` → 117

### P1ca8c20 · C [16] (gab B)
- antes: Provavelmente errou a divisão final, achando 224 ÷ 7 = 33 em vez de 32. Com 33 acertos e 17 erros a diferença fica 33 − 17 = 16 (e a pontuação daria 165 − 34 = 131, não 124).
- depois: Diferença 16 daria 33 acertos e 17 erros: 5 × 33 − 2 × 17 = 131 pontos, e não 124.
- conta conferida: `5*33-2*17` → 131

### P1ca8c20 · E [20] (gab B)
- antes: Provavelmente testou 35 acertos e 15 erros, um par redondo que soma 50. Ele dá 5 × 35 − 2 × 15 = 175 − 30 = 145 pontos, acima dos 124, e diferença 35 − 15 = 20.
- depois: Diferença 20 daria 35 acertos e 15 erros: 5 × 35 − 2 × 15 = 145 pontos, e não 124.
- conta conferida: `5*35-2*15` → 145

### Pe1791cf · A [60] (gab E)
- antes: Provavelmente divide 60 e 24 por 6 (dando 10 e 4), mas divide o 18 por 12 — e 12 é o MDC só de 60 e 24, não dos três. Sai 18 ÷ 12 = 1,5 e 10 × 4 × 1,5 = 60. O sinal de que algo está errado é justamente o 1,5: não existe meio cubo.
- depois: 60 cubos teriam 25 920 ÷ 60 = 432 cm³ cada, e 432 não é cubo perfeito (7³ = 343, 8³ = 512). Com aresta 6, são 10 × 4 × 3 = 120.
- conta conferida: `60*24*18/60` → 432

### Pe1791cf · D [96] (gab E)
- antes: 96 cubos corresponderia a cada cubo ocupar 25 920 ÷ 96 = 270 cm³, isto é, uma aresta de cerca de 6,5 cm. Provavelmente vem de esticar a aresta para além do MDC, usando um valor que não divide as três medidas; com 6,5 cm sobrariam pedaços nas três direções.
- depois: 96 cubos teriam 25 920 ÷ 96 = 270 cm³ cada, e 270 não é cubo perfeito. Com aresta 6 = MDC(60, 24, 18), são 10 × 4 × 3 = 120.
- conta conferida: `60*24*18/96` → 270

### P6a37d19 · C [80.] (gab E) ✔
- antes: Provavelmente quebrar 15 = 3 × 5 e errar a coluna da tabela, lendo ln 7 = 1,95 no lugar de ln 5 = 1,60. A soma vira 1,10 + 1,95 = 3,05 (que é o ln de 21, não o de 15) e sai 31 + 16 × 3,05 = 79,8, arredondado para cima como 80 em vez de contar anos completos.
- depois: 80 exigiria ln x = (80 − 31) ÷ 16 ≈ 3,06, um cão de uns 21 anos. Com N = 15, ln 15 = 1,10 + 1,60 = 2,70 e 31 + 16 × 2,70 = 74,2.
- conta conferida: `31+16*(1.10+1.60)` → 74.2

### Pf440dfb · E [inferior a 9%.] (gab A)
- antes: Provavelmente dividiu o excesso de volume pelos 4 cilindros, fazendo 33,3 % ÷ 4 ≈ 8,3 %, como se o acréscimo fosse repartido entre os cilindros. O que se reparte é o volume; a porcentagem do raio não se divide assim.
- depois: Inferior a 9 % não confere: com 3 cilindros no lugar de 4, cada um cresce 4/3 em volume, e o raio cresce √(4/3) ≈ 1,155, isto é, 15,5 %.
- conta conferida: `sqrt(4/3)` → 1.1547

### P038cd4b · E [11,8.] (gab C)
- antes: Provavelmente refez a razão com um total de candidatos menor que o real, como se cada vaga nova tivesse retirado 3 candidatos da disputa: 1 860 − 90 = 1 770 e 1 770 ÷ 150 = 11,8.
- depois: 11,8 não confere: os candidatos são 15,5 × 120 = 1 860, e 1 860 ÷ 150 = 12,4.
- conta conferida: `15.5*120/150` → 12.4

### P07eccef · A [2.] (gab E)
- antes: Provavelmente achou os limites 8 e 12 e contou só as duas pontas, como quem responde o mínimo e o máximo de vitórias. A pergunta é quantas ternas existem, e cada valor inteiro entre 8 e 12 também gera uma.
- depois: 2 não confere: e = 36 − 3v ≥ 0 e d = 2v − 16 ≥ 0 dão 8 ≤ v ≤ 12. Cada inteiro de 8 a 12 gera uma terna: são 5.
- conta conferida: `12-8+1` → 5

### P07eccef · B [3.] (gab E)
- antes: Provavelmente escreveu as restrições com maior que em vez de maior ou igual, exigindo empates e derrotas acima de zero, e com isso jogou fora os casos de zero empate e zero derrota. Sobrariam v = 9, 10 e 11. Mas um time pode terminar sem nenhum empate ou sem nenhuma derrota, então v = 8 e v = 12 valem.
- depois: 3 não confere: zero empate ou zero derrota é permitido. Com e = 36 − 3v ≥ 0 e d = 2v − 16 ≥ 0, valem v = 8 a 12: 5 ternas.
- conta conferida: `12-8+1` → 5

### P07eccef · C [1.] (gab E)
- antes: Provavelmente tratou o sistema como se tivesse solução única: achou uma terna que fecha as contas, por exemplo (8, 12, 0), e parou aí. Com duas equações e três incógnitas não há uma resposta só, e é por isso que a pergunta é quantas são.
- depois: 1 não confere: duas equações com três incógnitas admitem várias soluções. Com 8 ≤ v ≤ 12, são 5 ternas.
- conta conferida: `12-8+1` → 5

### P07eccef · D [4.] (gab E)
- antes: Provavelmente contou os inteiros de 8 a 12 fazendo 12 − 8 = 4 e esqueceu de somar 1. Entre 8 e 12 existem cinco números inteiros: 8, 9, 10, 11 e 12.
- depois: 4 não confere: de 8 a 12 há 12 − 8 + 1 = 5 inteiros, e cada um dá uma terna (v, e, d).
- conta conferida: `12-8+1` → 5

### Pe035d6f · D [1/90] (gab A)
- antes: 1/90 é o mesmo que 10/900. Provavelmente vem da contagem de 9 duplas acima mais a dupla (1, 87), por não perceber que não existe cartão 87 na urna.
- depois: 1/90 = 10/900 não confere. Os produtos 1, 3, 29 e 87 saem de 7 duplas: (1,1), (1,3), (3,1), (1,29), (29,1), (3,29) e (29,3).
- conta conferida: `sum(1 for a in range(1,31) for b in range(1,31) if 87%(a*b)==0)` → 7

### Pe6898d1 · D [3 + 4√3] (gab C)
- antes: Provavelmente troca dois lados pelos segmentos auxiliares: usa AG = 3 cm no lugar de AE e o lado CD = 2√3 cm no lugar da diagonal CE, chegando a 2√3 + 2√3 + 3 = 3 + 4√3. Os dois números aparecem durante a resolução, mas nenhum deles é lado do triângulo ACE.
- depois: 3 + 4√3 não confere: AE = 2 cm, CE = √(12 + 4) = 4 cm e AC = 2√3 cm, que somam 6 + 2√3.
- conta conferida: `sqrt(12+4)` → 4

### Pa9f2935 · E [R$ 4.382,00] (gab D)
- antes: Provavelmente um erro na subtração final: 4 536 − 228 virou 4 382 em vez de 4 308. Dá para flagrar sem refazer a conta: todas as parcelas são múltiplos de 6 e 4 382 não é múltiplo de 6 (4 382 ÷ 6 = 730,33...), então ele não pode ser soma de parcelas dessa progressão.
- depois: 4 382 não é múltiplo de 6, e toda soma dessas parcelas é (vão de 120 a 258, de 6 em 6). O total é 4 536 − 228 = 4 308.
- conta conferida: `(120+258)*24/2-(120+18*6)` → 4308

### P3a8842d · C [7⁄10] (gab B)
- antes: Provavelmente chegou a a/g = 10/15, foi para a calculadora, viu 10 ÷ 15 = 0,666… e arredondou para 0,7, marcando 7/10 sem perceber que 0,666… é exatamente o 2/3 escrito na alternativa B.
- depois: 7/10 não confere: 18a + 32g = 1,1 × (30a + 20g) dá 10g = 15a, e a/g = 10/15 = 2/3.
- conta conferida: `10/15` → 0.666667

### P3a8842d · D [3⁄4] (gab B)
- antes: Provavelmente montou a razão final com o número errado embaixo: usou o 15 que acompanha o a em cima e repescou os 20 litros originais de gasolina embaixo, escrevendo 15/20 = 3/4, em vez de usar o 10 que sobrou do lado do g.
- depois: 3/4 não confere: 18a + 32g = 1,1 × (30a + 20g) dá 10g = 15a, e a/g = 10/15 = 2/3.
- conta conferida: `10/15` → 0.666667

### P930d099 · B [54] (gab E)
- antes: Provavelmente trocou combinação por multiplicação simples e ainda somou no fim: fez 3 × 2 = 6 na Matemática, 8 × 6 = 48 na Física e somou 6 + 48 = 54. Multiplicar o total de questões pelo número que se quer escolher não conta grupos, e no final as duas matérias se multiplicam, não se somam.
- depois: 54 não confere: são C(3,2) = 3 escolhas na Matemática e C(8,6) = 28 na Física, que se multiplicam: 3 × 28 = 84.
- conta conferida: `comb(3,2)*comb(8,6)` → 84

### P930d099 · C [62] (gab E)
- antes: Provavelmente errou qual número escolher na Física e ainda somou: calculou C(8,3) = 56, como se fossem 3 questões de Física em vez de 6, e somou os 6 arranjos ordenados de Matemática: 56 + 6 = 62. São 6 questões de Física, e as duas contagens se multiplicam.
- depois: 62 não confere: são C(3,2) = 3 escolhas na Matemática e C(8,6) = 28 na Física, que se multiplicam: 3 × 28 = 84.
- conta conferida: `comb(3,2)*comb(8,6)` → 84

### P2b0c877 · A [128π cm3] (gab B)
- antes: Provavelmente usar uma fórmula de área no lugar da de volume: 2 × π × 8² = 128π é a área das duas tampas circulares do cilindro. Repare que essa conta nem chega a usar a subida de 3,5 cm, ou seja, ignora o dado principal da questão.
- depois: 128π não confere: o volume da pedra é o da água que subiu, π × 8² × 3,5 = 224π cm³.
- conta conferida: `64*3.5` → 224

### P2b0c877 · C [240π cm3] (gab B)
- antes: Provavelmente estimar 64 × 3,5 de cabeça como 60 × 4 = 240 em vez de fazer a conta. O valor exato é 224, e a diferença de 16 vem justamente de arredondar os dois fatores para cima.
- depois: 240π exigiria subida de 240 ÷ 64 = 3,75 cm. A água subiu 3,5 cm, e π × 64 × 3,5 = 224π cm³.
- conta conferida: `240/64` → 3.75

### P2b0c877 · D [282π cm3] (gab B)
- antes: Provavelmente trocar os papéis dos números: usar 3,5 cm como raio e a altura final de cerca de 23 cm como altura, o que dá π × 3,5² × 23 ≈ 282π. O 3,5 é quanto a água subiu, não o raio; o raio é 8 cm e está escrito no enunciado.
- depois: 282π exigiria subida de 282 ÷ 64 ≈ 4,4 cm. A água subiu 3,5 cm, e π × 64 × 3,5 = 224π cm³.
- conta conferida: `282/64` → 4.40625

### P5fdfcdb · A [2300] (gab C)
- antes: Provavelmente quem parou em 2 300 só por ser um número redondo logo acima de 2 000, sem testar os fatores. 2 300 é divisível por 2 e por 5, mas a soma dos algarismos 2 + 3 + 0 + 0 = 5 não é múltiplo de 3, então 2 300 nem sequer tem o fator 3 que todo primorial de n maior que ou igual a 3 precisa ter.
- depois: 2 300 não tem o fator 3 (2 + 3 + 0 + 0 = 5), e todo primorial a partir de 3# tem. O menor acima de 2 000 é 11# = 2 310.
- conta conferida: `2*3*5*7*11` → 2310

### P5fdfcdb · B [2305] (gab C)
- antes: Provavelmente quem lembrou que o resultado tem o fator 5 (logo termina em 0 ou em 5) e chutou o número terminado em 5 mais próximo de 2 300. Mas 2 305 é ímpar, ou seja, nem o fator 2 ele tem, e todo primorial começa multiplicando por 2.
- depois: 2 305 é ímpar, e todo primorial tem o fator 2. Como 7# = 210, o menor acima de 2 000 é 11# = 2 310.
- conta conferida: `2*3*5*7*11` → 2310

### P5fdfcdb · D [2312] (gab C)
- antes: Provavelmente quem errou o produto final 210 × 11, somando 2 a mais por achar que o fator 2 do começo tinha ficado de fora. 2 312 é par, mas não termina em 0 nem em 5, então não é múltiplo de 5 e não pode ser 11#.
- depois: 2 312 não termina em 0 nem em 5, e todo primorial a partir de 5# tem o fator 5. O menor acima de 2 000 é 11# = 2 310.
- conta conferida: `2*3*5*7*11` → 2310

### Pc141080 · B [253.] (gab A)
- antes: Provavelmente confunde o pior caso com 'ir esvaziando os números em ordem' e soma a PA até passar de 250: 1 + 2 + … + 22 = (1 + 22) × 22 ÷ 2 = 253. A soma da PA está certa, mas responde a outra pergunta — a partir do número 10 não é preciso esvaziar nada, bastam 9 cartões de cada.
- depois: 253 não garante. Dá para tirar todos os cartões de 1 a 9 (45) e 9 de cada número de 10 a 100 (819) sem 10 iguais. São 864, e o mínimo é 865.
- conta conferida: `45+9*91+1` → 865

### Pce8554c · A [− 34/25] (gab D)
- antes: Provavelmente arredondar cedo demais: tomar x ≈ −0,4 em vez de −5/13 = −0,3846 e voltar na reta AD, y = 6 × (−0,4) + 1 = −1,4. Entre as opções, a mais próxima de −1,4 é −34/25, que vale −1,36. O arredondamento do x é multiplicado por 6 e vira um erro seis vezes maior no y.
- depois: −34/25 = −1,36 não confere: o sistema dá x = −5/13, e y = 6 × (−5/13) + 1 = −17/13 ≈ −1,31.
- conta conferida: `6*(-5/13)+1` → -1.30769

### Pce8554c · E [− 27/20] (gab D)
- antes: Provavelmente arredondar x para −0,39 e voltar na reta AD: y = 6 × (−0,39) + 1 = −1,34, escolhendo então a alternativa de valor mais próximo, −27/20 = −1,35. Todas as opções estão entre −1,30 e −1,36 de propósito, para punir exatamente esse arredondamento.
- depois: −27/20 = −1,35 não confere: o sistema dá x = −5/13, e y = 6 × (−5/13) + 1 = −17/13 ≈ −1,31.
- conta conferida: `6*(-5/13)+1` → -1.30769

### Pffe3912 · A [– 0,8.] (gab C)
- antes: Provavelmente estimou a altura de M olhando o desenho em vez de calcular, marcando um valor um pouco acima de −1. O gráfico do caderno não tem escala no eixo y, então ler a olho não decide nada.
- depois: −0,8 não confere: P = (1, 0) e Q = (2, 0), então xM = 1,5 e yM = log₂ 0,5 = −1, valor exato.
- conta conferida: `math.log2(0.5)` → -1

### Pffe3912 · D [– 0,9.] (gab C)
- antes: Provavelmente achou que, sendo xM um número quebrado (1,5), o yM também teria de ser quebrado, e ajustou o −1 para −0,9. Mas 1,5 − 1 dá 0,5, que é uma potência exata de 2.
- depois: −0,9 não confere: xM = (1 + 2) ÷ 2 = 1,5 e yM = log₂ (1,5 − 1) = log₂ 0,5 = −1, valor exato.
- conta conferida: `math.log2(0.5)` → -1

### Pffe3912 · E [–1,2.] (gab C)
- antes: Provavelmente marcou M mais fundo do que ele está, estimando que a altura de M fosse a metade do caminho entre a assíntota e o eixo. As quatro alternativas erradas são vizinhas de −1 de propósito: elas só pegam quem lê a altura no desenho em vez de resolver o logaritmo.
- depois: −1,2 não confere: xM = (1 + 2) ÷ 2 = 1,5 e yM = log₂ (1,5 − 1) = log₂ 0,5 = −1, valor exato.
- conta conferida: `math.log2(0.5)` → -1

### Pcdaa780 · A [Existem 5 pares de pessoas diferentes (Pi ≠ Pj) que não possuem conexões de grau 2.] (gab B)
- antes: Fora da diagonal há exatamente 4 posições com zero: b12, b14, b23 e b43. Provavelmente contou uma a mais por tratar o par P1 e P2 em dobro, marcando b12 e b21 como zeros, quando b21 vale 1.
- depois: 5 não confere: fora da diagonal, M² tem exatamente 4 zeros, em b12, b14, b23 e b43. São 4 pares sem conexão de grau 2.
- conta conferida: `sum(1 for i in range(4) for j in range(4) if i!=j and sum([[0,1,0,1],[0,0,1,0],[1,1,0,1],[1,0,1,0]][i][k]*[[0,1,0,1],[0,0,1,0],[1,1,0,1],[1,0,1,0]][k][j] for k in range(4))==0)` → 4

### P05514f3 · A [96] (gab B)
- antes: Provavelmente só aceitou os algarismos que o espelho devolve iguais a eles mesmos (0, 1, 3 e 8) e esqueceu que o 2 e o 5 trocam entre si. Com essa lista menor: 2 × 4 × 3 × 4 = 96, contando três opções (0, 1 e 3) na dezena do minuto. O próprio exemplo do enunciado mostra o 2 virando 5.
- depois: 96 não confere: além de 0, 1, 3 e 8, o 2 e o 5 também refletem, um virando o outro. Com eles, a contagem é 2 × 6 × 5 × 6 = 360.
- conta conferida: `2*6*5*6` → 360

### P05514f3 · C [540] (gab B)
- antes: Provavelmente aceitou o 2 na primeira casa da hora, afinal o 2 é um algarismo que sobrevive ao espelho. Só que ele reflete como 5, e hora começada em 5 não existe. Com 3 opções nessa casa a conta vira 3 × 6 × 5 × 6 = 540.
- depois: 540 não confere: na primeira casa da hora, o 2 reflete como 5, e não existe hora 5x. Ficam 2 × 6 × 5 × 6 = 360.
- conta conferida: `3*6*5*6` → 540

### P05514f3 · D [640] (gab B)
- antes: Provavelmente incluiu o 6 e o 9 na lista, imaginando que um vira o outro no espelho. No desenho de sete segmentos do visor isso não acontece: o 6 virado de cabeça para baixo não fecha o desenho do 9. Com oito algarismos aceitos: 2 × 8 × 5 × 8 = 640.
- depois: 640 não confere: no visor de sete segmentos, 6 e 9 refletidos não formam algarismos. Com 0, 1, 2, 3, 5 e 8, são 2 × 6 × 5 × 6 = 360.
- conta conferida: `2*8*5*8` → 640

### P05514f3 · E [960] (gab B)
- antes: Provavelmente juntou os dois erros: aceitou 6 e 9 como par que se reflete e ainda deixou o 2 valer na primeira casa da hora. Isso dá 3 × 8 × 5 × 8 = 960, quase o triplo do total correto.
- depois: 960 não confere: 6 e 9 refletidos não formam algarismos, e o 2 na primeira casa da hora vira 5. A contagem é 2 × 6 × 5 × 6 = 360.
- conta conferida: `3*8*5*8` → 960

### P7db876d · A [162 é o 15º número triangular.] (gab D)
- antes: Provavelmente vem de aceitar o número sem aplicar a fórmula. O 15º triangular é 15 × 16 ÷ 2 = 120, bem longe de 162 — e 162 não é triangular em posição nenhuma: os vizinhos são 153 (17º) e 171 (18º).
- depois: O 15.º triangular é 15 × 16 ÷ 2 = 120. E 162 não é triangular: fica entre 153 (17.º) e 171 (18.º).
- conta conferida: `15*16/2` → 120

### P4a0388f · B [108(10 − √2) cm³] (gab A)
- antes: 108(10 − √2) = 1 080 − 108√2. O desconto dos dois cubos (108√2) está certo, mas o volume do bloco virou 1 080 em vez de 1 440. Provavelmente veio de fatorar 1 440 − 108√2 colocando o 108 em evidência e dividir 1 440 por 108 de cabeça, escrevendo 10 (o certo seria 13,33..., que não é inteiro — sinal de que 108 não é o fator comum a usar).
- depois: 1 080 − 108√2 não confere: o bloco tem 20 × 6√2 × 6√2 = 1 440 cm³, e o resto é 1 440 − 108√2 = 36(40 − 3√2).
- conta conferida: `20*72` → 1440

### P4a0388f · E [30(10 − 3√2) cm³] (gab A)
- antes: 30(10 − 3√2) = 300 − 90√2, cerca de 173 cm³. Também não sai de conta nenhuma: o bloco tem 1 440 cm³ e o desconto é 108√2, não 90√2. O fator 36 em evidência aparece justamente porque 36 × 40 = 1 440 e 36 × 3√2 = 108√2; trocá-lo por 30 desmonta os dois termos ao mesmo tempo.
- depois: 300 − 90√2 não confere: o bloco tem 20 × 6√2 × 6√2 = 1 440 cm³, e os dois cubos tiram 2 × (3√2)³ = 108√2.
- conta conferida: `2*(3*sqrt(2))**3/sqrt(2)` → 108

### Pe92b4a2 · A [16,25%] (gab B)
- antes: Provavelmente usou porcentagens da metade errada do quadro. Uma conta que dá exatamente esse valor é 0,5 × 0,5 × (0,5 × 0,7 + 0,5 × 0,6) = 0,25 × 0,65 = 0,1625, que trata o 70 % do time 4 e o 60 % do time 1 como se fossem adversários na final — e esses dois estão na mesma metade do chaveamento.
- depois: 16,25 % não confere. O time 1 chega à final com 0,6 × 0,5 = 0,30, e o rival é o 5 ou o 7 com 0,25 + 0,225 = 0,475. 0,30 × 0,475 = 14,25 %.
- conta conferida: `0.6*0.5*(0.5*0.5+0.45*0.5)` → 0.1425

### Pe92b4a2 · D [15,50%] (gab B)
- antes: Provavelmente também pegou números do lado errado do quadro: 0,25 × (0,4 × 0,5 + 0,7 × 0,6) = 0,25 × 0,62 = 0,155 usa os times 2 e 4, que estão na mesma metade do time 1 e por isso nunca poderiam ser o adversário dele na final.
- depois: 15,50 % não confere. O time 1 chega à final com 0,6 × 0,5 = 0,30, e o rival é o 5 ou o 7 com 0,25 + 0,225 = 0,475. 0,30 × 0,475 = 14,25 %.
- conta conferida: `0.6*0.5*(0.5*0.5+0.45*0.5)` → 0.1425

### P1635e2a · B [6,0.] (gab A)
- antes: Provavelmente troca a semelhança por uma subtração direta, fazendo 10 − 4 = 6. Esse cilindro até cabe (na altura 6 m a pirâmide ainda oferece 0,4 × 4 = 1,6 m, mais que o raio de 1 m), mas sobra espaço: não é o maior possível.
- depois: 6,0 m cabe, mas não é o máximo: nessa altura a pirâmide ainda oferece meia-largura 4 × 4 ÷ 10 = 1,6 m. O limite 4 × (10 − h) ÷ 10 = 1 dá h = 7,5.
- conta conferida: `4*(10-6)/10` → 1.6

### P1635e2a · C [6,5.] (gab A)
- antes: Provavelmente erra a aritmética final, escrevendo 4h = 26 em vez de 4h = 30 na conta 10 = 40 − 4h. Em 6,5 m a pirâmide ainda oferece 0,4 × 3,5 = 1,4 m de meia-largura, ou seja, ainda dá para subir.
- depois: 6,5 m cabe, mas não é o máximo: nessa altura a pirâmide ainda oferece meia-largura 4 × 3,5 ÷ 10 = 1,4 m. O limite 4 × (10 − h) ÷ 10 = 1 dá h = 7,5.
- conta conferida: `4*(10-6.5)/10` → 1.4

### P1635e2a · E [7,0.] (gab A)
- antes: Provavelmente arredonda a fração 1/4 da proporção para 0,3, obtendo (10 − h) ÷ 10 = 0,3 e h = 7. Em 7 m ainda sobram 0,4 × 3 = 1,2 m de meia-largura contra 1 m de raio, então ainda há 0,2 m de folga — o cilindro pode ser mais alto.
- depois: 7,0 m cabe, mas não é o máximo: nessa altura a pirâmide ainda oferece meia-largura 4 × 3 ÷ 10 = 1,2 m. O limite 4 × (10 − h) ÷ 10 = 1 dá h = 7,5.
- conta conferida: `4*(10-7)/10` → 1.2

### P7a0c133 · B [38] (gab D)
- antes: Provavelmente trocou 'o dobro' por 'duas a mais': com P = (L + R) + 2, o total fica (L + R) + (L + R) + 2 = 78, o que dá L + R = 38, e esse 38 é entregue como resposta.
- depois: 38 não confere: P = 2(L + R) dá 3(L + R) = 78, L + R = 26 e P = 52. Com L = 16 e R = 10, P + R = 62.
- conta conferida: `52+10` → 62

### P7a0c133 · C [42] (gab D)
- antes: 42 não sai de conta nenhuma. Inverter a relação do dobro (L + R = 2 × P) dá P = 26 e L + R = 52, mas aí Lisboa sairia 100/3, que nem é inteiro. O 42 só aparece misturando caminhos: o 26 dessa conta errada com o 16 de Lisboa da conta certa, 26 + 16 = 42.
- depois: 42 não confere: P = 2(L + R) dá 3(L + R) = 78, L + R = 26 e P = 52. Com L = 16 e R = 10, P + R = 62.
- conta conferida: `52+10` → 62

### P3600556 · A [6 pontos.] (gab C)
- antes: Provavelmente chutou o valor de 10 elevado a 0,6 achando que 0,6 já está perto de 1 e que o resultado seria perto de 10, usando algo como 9. Isso daria EA = 9 ÷ 10 = 0,9 e 60 × (1 − 0,9) = 6. O valor exato não é chute: log₁₀ 4 = 0,6, então 10^0,6 = 4.
- depois: 6 exigiria EA = 0,9. Como 10^0,6 = 10^(2 × 0,3) = 2² = 4, EA = 4 ÷ 5 = 0,8 e o aumento é 60 × 0,2 = 12.
- conta conferida: `60*(1-0.9)` → 6

### P3600556 · B [10 pontos.] (gab C)
- antes: Provavelmente aproximou 10 elevado a 0,6 por 5, pensando que o expoente 0,6 cairia mais ou menos na metade do caminho entre 1 e 10. Com isso EA = 5 ÷ 6 e o aumento sai 60 × (1 ÷ 6) = 10 pontos.
- depois: 10 exigiria EA = 5/6. Como 10^0,6 = 10^(2 × 0,3) = 2² = 4, EA = 4 ÷ 5 = 0,8 e o aumento é 60 × 0,2 = 12.
- conta conferida: `60*(1-5/6)` → 10

### P3c7baaa · B [(1/2) − (5/2) log₂ 3] (gab A)
- antes: Provavelmente perde o sinal de menos de fora do colchete e ainda junta as duas parcelas de log, chegando a uma expressão negativa: 1/2 − (5/2) × log₂ 3 ≈ 0,5 − 3,96 ≈ −3,46. Entropia nunca é negativa, e só esse teste já elimina a alternativa.
- depois: (1/2) − (5/2) log₂ 3 ≈ −3,46 é negativo, e a entropia não pode ser. A conta dá −[3 × (3/4) log₂ (3/4) + (1/4) log₂ (1/4)] ≈ 1,43.
- conta conferida: `0.5-2.5*math.log2(3)` → -3.46241

### P3c7baaa · C [3/2] (gab A)
- antes: Provavelmente não faz a conta e interpola: o enunciado mostra 1 para a sequência de 2 letras e 2 para a de 4 letras equilibradas, e 3/2 = 1,5 é o valor 'do meio'. O chute chega perto (a resposta é 1,43), mas vem de comparar casos, não de somar as quatro parcelas.
- depois: 3/2 não confere: E = −[3 × (3/4) log₂ (3/4) + (1/4) log₂ (1/4)] = 5 − (9/4) log₂ 3 ≈ 1,43.
- conta conferida: `-(3*0.75*math.log2(0.75)+0.25*math.log2(0.25))` → 1.43383

### P3c7baaa · E [3] (gab A)
- antes: Provavelmente segue a sequência dos exemplos como se fosse um padrão de contagem (2 letras dão 1, 4 letras dão 2, logo o próximo seria 3), ou soma 1 para cada letra azul. A fórmula não depende de quantas letras existem, e sim das probabilidades.
- depois: 3 não confere: E = −[3 × (3/4) log₂ (3/4) + (1/4) log₂ (1/4)] = 5 − (9/4) log₂ 3 ≈ 1,43.
- conta conferida: `5-2.25*math.log2(3)` → 1.43383

### P19be5ec · C [Entre 2 e 4 semanas.] (gab E) ✔
- antes: Provavelmente vem de estimar o crescimento como 10 % fixos sobre o alvo: 10 % de 300 são 30 mil por semana, e faltam 100 mil para sair de 200 mil, então 100 ÷ 30 ≈ 3,3 semanas. O erro é usar 10 % de 300 desde o começo, quando na primeira semana os 10 % incidem sobre 200 (20 mil) e só depois vão aumentando.
- depois: Entre 2 e 4 não confere: 1,1⁴ = 1,4641 ainda é menor que 1,5. Pelos logs, t > 0,1761 ÷ 0,0414 ≈ 4,25 semanas.
- conta conferida: `(0.4771-0.3010)/(1.0414-1)` → 4.25362

### Pd553662 · A [30.] (gab B)
- antes: Provavelmente quem conta pares ordenados de cilindros, como se a ordem de desligar importasse: 6 × 5 = 30. Aqui só importa quais cilindros ficam ligados, não em que ordem.
- depois: 30 não confere: cada cilindro fica ligado ou não, 2⁶ = 64 combinações, menos a de todos desligados: 63.
- conta conferida: `2**6-1` → 63

### Pd553662 · E [72.] (gab B)
- antes: Provavelmente quem chega a 6 × 6 = 36 e depois dobra o resultado para contar ligado e desligado mais uma vez: 2 × 36 = 72, aplicando o fator 2 duas vezes.
- depois: 72 não confere: cada cilindro fica ligado ou não, 2⁶ = 64 combinações, menos a de todos desligados: 63.
- conta conferida: `2**6-1` → 63

### Pe41b829 · C [1/15] (gab B)
- antes: Provavelmente trocou "um quarto dos meninos são canhotos" por "metade dos meninos são canhotos", o que dobra as meninas canhotas (3 × mc = h ÷ 2, logo mc = h ÷ 6): na sala de 30 isso dá 2 meninas canhotas e 2 ÷ 30 = 1/15.
- depois: 1/15 não confere. Numa sala de 30, os meninos destros são 9, logo há 12 meninos e 3 canhotos. Com mc = (3 + mc) ÷ 4, mc = 1: 1/30.
- conta conferida: `(3+1)/4` → 1

### P7547274 · B [6√2 − 5] (gab A)
- antes: Provavelmente distribuiu o √2 só no 6 e deixou o x de fora, e ainda arredondou x = 2√6 ≈ 4,9 para 5: (6 − x) × √2 virou 6√2 − 5. O √2 multiplica os dois termos do parêntese, não só o primeiro.
- depois: 6√2 − 5 ≈ 3,49 não confere. De x²/2 = 36 − x² sai x = 2√6, e PN = (6 − 2√6)√2 = 6√2 − 4√3 ≈ 1,56 cm.
- conta conferida: `(6-2*sqrt(6))*sqrt(2)` → 1.55708

### P7547274 · C [2(2√2 − 1)] (gab A)
- antes: Provavelmente trocou a área da folha (36 cm²) pelo lado (6 cm) ao montar a igualdade, escrevendo x² ÷ 2 = 6 − x². Isso dá 3x² = 12, x = 2 e lado 6 − 2 = 4, cuja diagonal é 4√2; descontando mais 2 cm da dobra chega-se a 4√2 − 2, que é o 2 × (2√2 − 1) da alternativa. A comparação do enunciado é entre áreas, e a área da folha é 6 × 6 = 36 cm².
- depois: 2(2√2 − 1) ≈ 3,66 não confere. De x²/2 = 36 − x² sai x = 2√6, e PN = (6 − 2√6)√2 = 6√2 − 4√3 ≈ 1,56 cm.
- conta conferida: `2*(2*sqrt(2)-1)` → 3.65685

### P7547274 · D [2(3√2 − √3)] (gab A)
- antes: Provavelmente errou só a simplificação do radical no fim: 2√12 vira 2 × 2√3 = 4√3, mas quem escreve 2√12 = 2√3 chega a 6√2 − 2√3, exatamente essa alternativa. Dentro de √12 cabe o fator 4, e √4 = 2 sai para fora do radical.
- depois: 6√2 − 2√3 sai de escrever 2√12 como 2√3. Como √12 = 2√3, o certo é (6 − 2√6)√2 = 6√2 − 4√3.
- conta conferida: `(6-2*sqrt(6))*sqrt(2)-(6*sqrt(2)-4*sqrt(3))` → -6.66134e-16

### P7547274 · E [6(√2 − 1)] (gab A)
- antes: Provavelmente esqueceu de dividir a área do triângulo por 2 e usou x² no lugar de x² ÷ 2: a igualdade vira x² = 36 − x², que dá x² = 18 e x = 3√2. Daí PN = (6 − 3√2) × √2 = 6√2 − 3 × 2 = 6√2 − 6 = 6 × (√2 − 1). O triângulo VPS é metade do quadradinho, e não o quadradinho inteiro.
- depois: 6(√2 − 1) sai de usar x² no lugar de x²/2: x² = 36 − x² dá x = 3√2 e PN = (6 − 3√2)√2 = 6√2 − 6.
- conta conferida: `(6-3*sqrt(2))*sqrt(2)-6*(sqrt(2)-1)` → -1.33227e-15

### Pc43b444 · A [122º.] (gab E)
- antes: Provavelmente errou a subtração 360° − 298°, achando 61° em vez de 62° (por somar os três ângulos da figura como 299°), e depois dobrou: 2 × 61° = 122°.
- depois: 122° não confere: no quadrilátero, x ÷ 2 = 360° − (102° + 120° + 76°) = 62°, logo x = 124°.
- conta conferida: `2*(360-298)` → 124

### Pc43b444 · D [128º.] (gab E)
- antes: Provavelmente errou a subtração final achando 64° em vez de 62° para a metade de x (como se os três ângulos somassem 296°), e dobrou: 2 × 64° = 128°.
- depois: 128° não confere: no quadrilátero, x ÷ 2 = 360° − (102° + 120° + 76°) = 62°, logo x = 124°.
- conta conferida: `2*(360-298)` → 124

### Pafad565 · B [66,5%.] (gab A)
- antes: Provavelmente trocar os valores exatos por aproximações grosseiras em vez de usar o 0,548 que o enunciado entrega: com π ≈ 3 e √3 ≈ 1,7 sai 5 × 3 ÷ (16 + 6,8) = 15 ÷ 22,8 ≈ 0,658, que leva à opção de 66,5 %.
- depois: 66,5 % não confere. O setor tem 150° e raio NT = 2√3, área 5π; o pentágono tem 16 + 4√3. A razão é (5/4) × 0,548 = 0,685.
- conta conferida: `1.25*0.548` → 0.685

### Pafad565 · C [70,5%.] (gab A)
- antes: Provavelmente usar √3 ≈ 1,6 na área do triângulo: o pentágono vira 16 + 6,4 = 22,4 cm² e a divisão dá 15,7 ÷ 22,4 ≈ 0,701, próximo de 70,5 %. O valor de √3 é 1,732, e o enunciado nem pede que você o use, justamente para evitar esse arredondamento.
- depois: 70,5 % não confere. O setor tem 150° e raio NT = 2√3, área 5π; o pentágono tem 16 + 4√3. A razão é (5/4) × 0,548 = 0,685.
- conta conferida: `5*pi/(16+4*sqrt(3))` → 0.685094

### Pafad565 · E [74,5%.] (gab A)
- antes: Provavelmente encolher a área do pentágono ao arredondar 4 × √3 = 6,93 para 5, deixando 16 + 5 = 21 cm². Dividir a mesma fatia por um pentágono menor infla o resultado: 15,7 ÷ 21 ≈ 0,748, perto de 74,5 %.
- depois: 74,5 % não confere. O setor tem 150° e raio NT = 2√3, área 5π; o pentágono tem 16 + 4√3. A razão é (5/4) × 0,548 = 0,685.
- conta conferida: `5*pi/(16+4*sqrt(3))` → 0.685094

### P7686090 · B [No primeiro trimestre de 2023, a quantidade de fêmeas abatidas foi de, aproximadamente, 2 milhões.] (gab D)
- antes: Provavelmente ler o total de 2023 na metade da escala, uns 4,5 milhões em vez dos 7,44 que o gráfico marca, e aplicar os 44,8 %: 0,448 × 4,5 ≈ 2,0 milhões. Com o total correto a conta dá 3,33 milhões.
- depois: 2 milhões não confere: em 2023 o total foi 7,44 milhões, e 0,448 × 7,44 ≈ 3,33 milhões de fêmeas.
- conta conferida: `0.448*7.44` → 3.33312

### Pde4102b · D [2600π] (gab A)
- antes: Provavelmente parte do mesmo cilindro de raio 10 cm e altura 24 cm (2 400π) e, em vez de descontar o que falta na cintura, ainda soma os dois coninhos de raio 5 cm e altura 12 cm: 2 × (π × 5² × 12 ÷ 3) = 200π, chegando a 2 400π + 200π = 2 600π.
- depois: 2 600π não confere. Cada metade é um tronco de volume (π × 12 ÷ 3) × (100 + 50 + 25) = 700π; as duas dão 1 400π.
- conta conferida: `2*12/3*(100+50+25)` → 1400

### Pbb7757e · A [36] (gab E)
- antes: Provavelmente somou só os três lados inteiros da trilha: 12 + 12 + 12 = 36 m, deixando de fora a metade do lado norte (6 m) e a rampa. O enunciado diz que os estudantes percorreram a trilha e subiram a rampa, então as duas partes entram na conta.
- depois: 36 m são só três lados da base (3 × 12). Faltam a metade do lado norte (6 m) e a rampa, √(6² + 18²) ≈ 19 m: total ≈ 61 m.
- conta conferida: `3.5*12+sqrt(36+324)` → 60.9737

### Pbb7757e · B [41] (gab E)
- antes: Provavelmente esqueceu o dividido por 3 do volume da pirâmide: de a² × 18 = 864 sairia a² = 48 e a ≈ 6,9 m. Com esse lado, a trilha daria 3,5 × 6,9 ≈ 24,2 m e a rampa √(3,46² + 18²) ≈ 18,3 m, somando cerca de 42,6 m, o que leva a marcar o 41. O volume da pirâmide é um terço do volume do prisma de mesma base e mesma altura.
- depois: 41 m não confere: de a² × 18 ÷ 3 = 864 sai a = 12 m. A trilha já tem 3,5 × 12 = 42 m, e a rampa soma mais ≈ 19 m.
- conta conferida: `sqrt(864*3/18)` → 12

### Pbb7757e · C [48] (gab E)
- antes: Provavelmente usou como rampa o apótema da base, que é a distância do centro até o meio do lado (6 m), em vez do apótema da pirâmide: 42 + 6 = 48 m. Esse 6 m é apenas um dos catetos do triângulo; a rampa é a hipotenusa, que mede quase 19 m.
- depois: 48 m sai de usar como rampa o apótema da base, 6 m: 42 + 6 = 48. A rampa é √(6² + 18²) ≈ 19 m, e o total fica ≈ 61 m.
- conta conferida: `42+6` → 48

### Pbb7757e · D [54] (gab E)
- antes: Provavelmente trocou a rampa pela altura e ainda esqueceu a metade do lado norte: 36 + 18 = 54 m. A altura de 18 m é medida por dentro da pirâmide, do centro da base até o vértice, e ninguém sobe por dentro; a subida é pela face.
- depois: 54 m não confere: a trilha tem 3,5 × 12 = 42 m e a rampa √(6² + 18²) ≈ 19 m, total ≈ 61 m.
- conta conferida: `42+sqrt(360)` → 60.9737

### P36962e9 · A [5] (gab B) ✔
- antes: Provavelmente repete o 5 que aparece no enunciado, tomando o menor diâmetro da faixa como se ele fosse a própria resposta de altura. Os 5 cm e 8 cm são medidas da boca da lata, não da sua altura.
- depois: 5 cm não confere: a menor altura vem do maior diâmetro, 8 cm, e h = 350 ÷ (π × 4²) ≈ 7 cm.
- conta conferida: `350/(pi*16)` → 6.96303

### P36962e9 · C [13] (gab B)
- antes: Provavelmente usa a área lateral no lugar do volume: 2 × π × r × h = 350 daria h = 350 ÷ (3,14 × 8) ≈ 13,9 cm. A área lateral é a superfície de alumínio enrolada; o que guarda os 350 mL de água é o volume, com o raio ao quadrado.
- depois: 13 cm não é a menor altura: com o maior diâmetro, 8 cm, h = 350 ÷ (π × 4²) ≈ 7 cm.
- conta conferida: `350/(pi*16)` → 6.96303

### P461b692 · C [1/3] (gab A)
- antes: Provavelmente responder com a fatia do dinheiro e não a fatia da massa: as cápsulas rendem 0,04 × 150,00 = 6,00 dos 16,70 do preço médio, e 6,00 ÷ 16,70 ≈ 0,36, valor que o aluno arredonda para 1/3. A pergunta é sobre massa de café, não sobre faturamento.
- depois: 1/3 não confere: com x kg em cápsulas, 5,10 + 20 × (0,32 − x) + 150x = 16,70 dá x = 0,04, e 0,04 ÷ 0,32 = 1/8.
- conta conferida: `(16.70-5.10-20*0.32)/130/0.32` → 0.125

### P461b692 · D [1/50] (gab A)
- antes: Provavelmente dividir os 0,04 kg por 2, por causa dos dois pacotes de 500 g que formam 1 kg: 0,04 ÷ 2 = 0,02, que é 1/50. O denominador certo é a massa de café torrado, 0,32 kg.
- depois: 1/50 não confere: com x kg em cápsulas, 5,10 + 20 × (0,32 − x) + 150x = 16,70 dá x = 0,04, e 0,04 ÷ 0,32 = 1/8.
- conta conferida: `(16.70-5.10-20*0.32)/130/0.32` → 0.125

### P461b692 · E [3/10] (gab A)
- antes: Provavelmente responder com a outra fatia e contra a referência errada: sobram 0,32 − 0,04 = 0,28 kg para os pacotes, e medir esses 0,28 kg contra o 1 kg colhido dá 0,28, que o aluno arredonda para 3/10. São dois erros somados: a fatia trocada e o total trocado.
- depois: 3/10 não confere: com x kg em cápsulas, 5,10 + 20 × (0,32 − x) + 150x = 16,70 dá x = 0,04, e 0,04 ÷ 0,32 = 1/8.
- conta conferida: `(16.70-5.10-20*0.32)/130/0.32` → 0.125

### P411fdf4 · C [5√3 cm²] (gab B)
- antes: Provavelmente soma, em vez de usar, os dois números que aparecem na conta: toma 3 (o lado LU) mais 2 (o lado do losango) como se os lados do retângulo fossem 5 e √3, chegando a 5√3 ≈ 8,66 cm². O retângulo tem 3 cm de base, não 5 cm.
- depois: 5√3 não confere. Com BL = 2√3 e ângulo de 30°, LU = 2√3 × cos 30° = 3. E BU = 2√3 × sen 30° = √3, logo a área é 3√3.
- conta conferida: `2*sqrt(3)*math.cos(pi/6)` → 3

### P411fdf4 · D [7√3 ÷ 2 cm²] (gab B)
- antes: Provavelmente conta um pedaço duas vezes: soma a área do retângulo (3√3) com a do triângulo BUO, que vale (1 × √3) ÷ 2 = √3 ÷ 2, obtendo 3√3 + √3 ÷ 2 = 7√3 ÷ 2 ≈ 6,06 cm². Mas esse triângulo já está dentro do retângulo.
- depois: 7√3/2 não confere: com BL = 2√3 e ângulo de 30°, os lados são LU = 3 e BU = √3, e a área é 3 × √3 = 3√3.
- conta conferida: `2*sqrt(3)*math.sin(pi/6)` → 1.73205

### P4188717 · A [955.] (gab C)
- antes: Provavelmente quem erra a soma da tabela (lendo 430 no lugar de 480, por exemplo) e trabalha com o total 2 410: o sábado sai 1 090 e a média dos dois dias fica (820 + 1 090) ÷ 2 = 955.
- depois: 955 exigiria sábado de 2 × 955 − 820 = 1 090. Com média de 410 + 90 = 500 em 7 dias, o sábado é 3 500 − 2 460 = 1 040.
- conta conferida: `2*955-820` → 1090

### P4188717 · D [935.] (gab C)
- antes: Provavelmente quem erra a multiplicação 500 × 7 e usa 3 510: o sábado vira 1 050 e a média dos dois dias fica (820 + 1 050) ÷ 2 = 935.
- depois: 935 exigiria sábado de 2 × 935 − 820 = 1 050. Com média de 410 + 90 = 500 em 7 dias, o sábado é 3 500 − 2 460 = 1 040.
- conta conferida: `2*935-820` → 1050

### P66d1f7b · A [(4,75; 3).] (gab D)
- antes: Provavelmente usa a massa errada no termo novo do eixo x, somando 2 × 2 = 4 em vez de 3 × 2 = 6 e chegando a 38 ÷ 8 = 4,75, enquanto o y sai certo. O peso da placa circular é 3 kg nos dois eixos; não há motivo para ela pesar diferente no x e no y.
- depois: x = 4,75 não confere: x = (2 × 2 + 3 × 10 + 3 × 2) ÷ 8 = 40 ÷ 8 = 5. O y = 3 está certo.
- conta conferida: `(4+30+6)/8` → 5

### P66d1f7b · C [(6; 3,5).] (gab D)
- antes: Provavelmente confunde o raio 1 com a massa da placa circular, usando 1 kg: x = (4 + 30 + 2) ÷ (2 + 3 + 1) = 36 ÷ 6 = 6, que é o 6 da alternativa. O raio é uma medida de tamanho e não entra na ponderação; a massa dada é 3 kg.
- depois: (6; 3,5) não confere. Com a placa circular de 3 kg, x = (4 + 30 + 6) ÷ 8 = 5. E y = (6 + 15 + 3) ÷ 8 = 3.
- conta conferida: `(6+15+3)/8` → 3

### P569563b · A [70 anos.] (gab B)
- antes: Provavelmente multiplicou a nova média por um número de pessoas menor que 18, como se tivesse saído mais gente. Quanto menos gente se conta no grupo que ficou, maior fica a soma que sobra para os dois: usando 700 no lugar de 720, a conta daria 840 − 700 = 140 e 140 ÷ 2 = 70 anos. O grupo que fica tem exatamente 20 − 2 = 18 pessoas, e 40 × 18 = 720.
- depois: 70 anos não confere: o grupo soma 20 × 42 = 840 e os 18 que ficam, 18 × 40 = 720. Enzo e Noel somam 120, média 60.
- conta conferida: `(840-720)/2` → 60

### P569563b · C [40 anos.] (gab B)
- antes: Provavelmente descontou só uma pessoa em vez de duas: 40 × 19 = 760, depois 840 − 760 = 80 e 80 ÷ 2 = 40 anos. Saíram duas pessoas do grupo, então o grupo restante tem 18, e não 19.
- depois: 40 sai de descontar uma pessoa só: 840 − 19 × 40 = 80, e 80 ÷ 2 = 40. Saíram dois, então ficam 18, e (840 − 720) ÷ 2 = 60.
- conta conferida: `(840-19*40)/2` → 40

### P569563b · D [50 anos.] (gab B)
- antes: Provavelmente tirou a média entre as duas médias (42 e 40 dão 41) e usou esse 41 como média do grupo de 20: 41 × 20 = 820, depois 820 − 720 = 100 e 100 ÷ 2 = 50 anos. A média do grupo de 20 já está dada no enunciado e é 42; aqui não se faz média de médias.
- depois: 50 anos não confere: o grupo soma 20 × 42 = 840 e os 18 que ficam, 18 × 40 = 720. Enzo e Noel somam 120, média 60.
- conta conferida: `(840-720)/2` → 60

### P569563b · E [80 anos.] (gab B)
- antes: Provavelmente dobrou a média do grupo que ficou, trocando média dos dois por dobro de 40: 2 × 40 = 80. Dobrar serve para achar a soma de duas parcelas iguais, não para achar a média. A conta pedida é somar as duas idades (120) e dividir por 2.
- depois: 80 anos não confere: o grupo soma 20 × 42 = 840 e os 18 que ficam, 18 × 40 = 720. Enzo e Noel somam 120, média 60.
- conta conferida: `(840-720)/2` → 60

### Pd07bb6e · D [3 200π cm3.] (gab B)
- antes: Provavelmente trocou os papéis das medidas: usou 20 cm (o lado AB) como raio e 24 cm (o dobro de AE = 12 cm, como se fosse um diâmetro servindo de altura) na fórmula do cone, chegando a (1 ÷ 3) × π × 20² × 24 = 3 200π. O raio é a distância até o eixo, e as alturas são os pedaços 9 cm e 16 cm do próprio eixo.
- depois: 3 200π não confere. Girando 180°, cada triângulo gera meio par de cones de raio 12 cm e alturas 9 e 16 cm: 600π. Os dois somam 1 200π.
- conta conferida: `2*0.5*(1/3)*144*25` → 1200

### P35b5cc1 · A [70% e 80%.] (gab D)
- antes: Provavelmente soma e subtrai variações em vez de multiplicá-las: calcula que o PIB por pessoa do mundo cresceu cerca de 100 % e desconta daí os cerca de 23 % de queda da fatia (de 1,3 % para 1 %), chegando a uns 77 %. Variações percentuais não se somam, elas se multiplicam.
- depois: 70 % a 80 % não confere. O per capita dos 20 % mais pobres era 4,16 × 10¹¹ ÷ (1,2 × 10⁹) ≈ 347 US$. Passou a 7,8 × 10¹¹ ÷ (1,46 × 10⁹) ≈ 534 US$, alta de ≈ 54 %.
- conta conferida: `(7.8e11/1.46e9)/(4.16e11/1.2e9)-1` → 0.541096

### P35b5cc1 · B [60% e 70%.] (gab D)
- antes: Provavelmente arredonda os dados da tabela: usando 7 × 10⁹ no lugar de 7,3 × 10⁹ pessoas em 2013, o consumo por pessoa sobe para 7,8 × 10¹¹ ÷ (1,4 × 10⁹) ≈ 557 US$ e a razão vira 557 ÷ 346,67 ≈ 1,61, ou seja uns 61 %. Um arredondamento de uma casa já muda a faixa da resposta.
- depois: 60 % a 70 % não confere. O per capita dos 20 % mais pobres era 4,16 × 10¹¹ ÷ (1,2 × 10⁹) ≈ 347 US$. Passou a 7,8 × 10¹¹ ÷ (1,46 × 10⁹) ≈ 534 US$, alta de ≈ 54 %.
- conta conferida: `(7.8e11/1.46e9)/(4.16e11/1.2e9)-1` → 0.541096

### P116f0d5 · A [x/2] (gab E) ✔
- antes: Provavelmente nem chegou a compor: cortou pedaços soltos dentro da própria fração de f, cancelando o x de cima com o x de baixo e deixando o 2 do x − 2 embaixo, o que dá x dividido por 2. Só se pode cancelar fator que multiplica a expressão inteira, nunca parcela de uma soma como 2x + 1 ou x − 2.
- depois: Testando x = 3: f(3) = 7 e f(7) = 15 ÷ 5 = 3, então g(3) = 3, e x/2 daria 1,5. Em geral, f(f(x)) = 5x ÷ 5 = x.
- conta conferida: `(2*7+1)/(7-2)` → 3

### P116f0d5 · B [x²] (gab E)
- antes: Provavelmente leu f(f(x)) como f(x) multiplicado por f(x), ou seja, como o quadrado de f. Composição não é multiplicação: em f(f(x)) a função inteira entra no lugar do x. Quem multiplica e ainda cancela (x − 2) com (x − 2) acaba escrevendo algo do tipo x².
- depois: Testando x = 3: f(3) = 7 e f(7) = 15 ÷ 5 = 3, então g(3) = 3, e x² daria 9. Em geral, f(f(x)) = 5x ÷ 5 = x.
- conta conferida: `(2*7+1)/(7-2)` → 3

### P116f0d5 · C [2x] (gab E)
- antes: Provavelmente trocou f(f(x)) por 2 × f(x), lendo f de f como dois f. Mesmo na composição certa, parar no 2 × f(x) do numerador, esquecer o + 1 de cima e o f(x) − 2 de baixo, e ainda trocar f(x) por x, deixa só 2x.
- depois: Testando x = 3: f(3) = 7 e f(7) = 15 ÷ 5 = 3, então g(3) = 3, e 2x daria 6. Em geral, f(f(x)) = 5x ÷ 5 = x.
- conta conferida: `(2*7+1)/(7-2)` → 3

### P116f0d5 · D [2x + 3] (gab E)
- antes: Provavelmente somou os termos soltos em vez de montar a fração: pegou o 2x + 1 do numerador de f e juntou com o 2 que aparece em f(x) − 2 trocando o sinal, chegando a 2x + 1 + 2 = 2x + 3. Esses pedaços estão em andares diferentes da fração e não podem ser somados direto.
- depois: Testando x = 3: f(3) = 7 e f(7) = 15 ÷ 5 = 3, então g(3) = 3, e 2x + 3 daria 9. Em geral, f(f(x)) = 5x ÷ 5 = x.
- conta conferida: `(2*7+1)/(7-2)` → 3

### P15af562 · B [−6] (gab A)
- antes: Provavelmente errou a subtração das equações: escreveu 2a = 16, copiando só o 16 do lado direito sem descontar o 4 da outra equação, o que dá a = 8, mas manteve o b = −14 achado com o a certo. A soma vira 8 + (−14) = −6. Subtrair equação de equação é subtrair os dois lados: 16 − 4 = 12, logo 2a = 12.
- depois: −6 não confere. Os pontos dão 3a + b = 2² = 4 e 5a + b = 2⁴ = 16. Logo a = 6, b = −14 e a + b = −8.
- conta conferida: `6-14` → -8

### P15af562 · C [0] (gab A)
- antes: Provavelmente multiplicou em vez de elevar: leu log₂(3a + b) = 2 como 3a + b = 2 × 2 = 4 (que por coincidência dá certo) e log₂(5a + b) = 4 como 5a + b = 2 × 4 = 8. Com 3a + b = 4 e 5a + b = 8 sai a = 2 e b = −2, logo a + b = 0. O certo é 2 elevado a 4, que é 16, e não 8.
- depois: 0 sai de trocar 2⁴ por 2 × 4 = 8: 3a + b = 4 e 5a + b = 8 dão a = 2 e b = −2. Com 2⁴ = 16, a = 6, b = −14 e a + b = −8.
- conta conferida: `2+(-2)` → 0

### P15af562 · D [4] (gab A)
- antes: Provavelmente desfez o logaritmo só no primeiro ponto e, no segundo, copiou o y sem transformar: ficou com 3a + b = 4 e 5a + b = 4. Essas duas dão a = 0 e b = 4, logo a + b = 4. O y = 4 precisa virar 2⁴ = 16 antes de entrar no sistema.
- depois: 4 sai de não desfazer o log no segundo ponto: 3a + b = 4 e 5a + b = 4 dão a = 0, b = 4. Com 5a + b = 2⁴ = 16, a + b = −8.
- conta conferida: `0+4` → 4

### P15af562 · E [8] (gab A)
- antes: Provavelmente somou 6 com −14 como quem faz o maior menos o menor: 14 − 6 = 8. Numa soma de sinais diferentes, o resultado fica com o sinal do número de maior valor absoluto, que aqui é o −14. Então 6 − 14 = −8.
- depois: 8 é o resultado com o sinal trocado: a = 6 e b = −14 dão a + b = 6 − 14 = −8.
- conta conferida: `-(6-14)` → 8

### P26b0fc4 · E [30] (gab C)
- antes: Provavelmente quem acerta a conta até n ≈ 27,7 mas conta as etapas a partir da figura, somando as etapas já desenhadas no enunciado, e empurra a resposta duas casas para frente.
- depois: 30 não é a primeira: já na etapa 28 o lado é (1/√2)²⁷ = 2^(−13,5) ≈ 8,6 × 10⁻⁵, abaixo de 10⁻⁴. Na 27, 2⁻¹³ ≈ 1,2 × 10⁻⁴.
- conta conferida: `2**-13.5` → 8.63167e-05

### P4bb7a99 · A [d < 2] (gab C)
- antes: Provavelmente quem esqueceu de tirar as raízes e trabalhou com os números de dentro: 394 + 305 − 905 = − 206. Vendo um resultado negativo, concluiu que a economia é quase nada, menos de 2 m. Soma de raízes não é a raiz da soma, então esses números não podem ser somados assim.
- depois: d < 2 não confere: OB = √394 ≈ 19,85, BC = √305 ≈ 17,46 e OC = √905 ≈ 30,08. Logo d ≈ 37,31 − 30,08 ≈ 7,2 m.
- conta conferida: `sqrt(394)+sqrt(305)-sqrt(905)` → 7.23046

### Pe4abaf7 · C [considerou que sen (π/2) vale 1.] (gab D)
- antes: sen (π/2) é o seno de 90°, e vale 1 mesmo. Essa linha dele está certa. Quem marca esta alternativa provavelmente confunde sen (π/2), que vale 1, com sen π, que vale 0.
- depois: Essa linha está certa: sen (π/2) = 1. O erro foi escrever sen (2x) = 2 sen x, em vez de 2 sen x cos x.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### P8b13820 · A [5,09.] (gab C) ✔
- antes: Provavelmente quem soma dois valores lidos no gráfico em vez de somar t com u: 1,62 (do ponto x = 18) com 3,47 (do ponto x = 7) dá exatamente 5,09, e o t = 3 do instante zero desaparece da conta.
- depois: 5,09 não confere: f(0) = 3 dá t = 3, e 3 × u⁷ = 18 000 dá u = 6 000^(1/7) ≈ 3,47. A soma é 6,47.
- conta conferida: `3+6000**(1/7)` → 6.46526

### P8b13820 · B [10,26.] (gab C)
- antes: Provavelmente quem lê o gráfico na coluna errada, em x = 6 (valor 4,26), e ainda soma 6 no lugar de t = 3, confundindo o número de meses com a constante inicial: 6 + 4,26 = 10,26.
- depois: 10,26 não confere: f(0) = 3 dá t = 3, e 3 × u⁷ = 18 000 dá u = 6 000^(1/7) ≈ 3,47. A soma é 6,47.
- conta conferida: `3+6000**(1/7)` → 6.46526

### P8cdf3c8 · C [R$ 1,80.] (gab E)
- antes: Provavelmente quem trata os 2,5 % como R$ 2,50 fixos por hora: 2,50 × 6 = 15,00 e 15,00 ÷ 8 = 1,875, que puxa para o 1,80 da lista. O erro é confundir uma taxa em porcentagem com um valor em reais.
- depois: R$ 1,80 não confere. A taxa é 0,025 × 40 = R$ 1,00 por hora nas 6 primeiras, R$ 6,00 no dia, e 6 ÷ 8 = R$ 0,75.
- conta conferida: `0.025*40*6/8` → 0.75

### P77b38ad · C [230 000 km² e 240 000 km².] (gab B)
- antes: Provavelmente perde a fração do círculo no meio do caminho: a faixa de 230 000 a 240 000 km² corresponde a usar uma abertura em torno de 200 graus (cerca de 55 % do círculo) em vez dos 120 graus do enunciado — por exemplo, contando também parte do mapa colorido que está fora das duas linhas amarelas.
- depois: 230 000 a 240 000 km² não confere: o setor de 120° é 1/3 do círculo, e (1/3) × 3,14 × 370² ≈ 143 300 km².
- conta conferida: `3.14*370**2/3` → 143289

### P77b38ad · D [310 000 km² e 320 000 km².] (gab B)
- antes: Provavelmente usa o ângulo que sobra em vez do ângulo do feixe: 310 000 a 320 000 km² é mais ou menos o que daria uma abertura perto de 265 graus, vizinha dos 240 graus que ficam fora da fatia (360 − 120 = 240).
- depois: 310 000 a 320 000 km² não confere: o setor de 120° é 1/3 do círculo, e (1/3) × 3,14 × 370² ≈ 143 300 km².
- conta conferida: `3.14*370**2/3` → 143289

### P327a043 · C [4,8.] (gab A)
- antes: Provavelmente lê o "2 × P" da fórmula como se o atendimento valesse metade do produto, isto é, A = P ÷ 2. Aí sobra só a fórmula: P ÷ 2 + 2 × P = 12, ou seja, 2,5 × P = 12 e P = 4,8. Essa conta joga fora o dado da soma 760, que é justamente a segunda equação de que o sistema precisa.
- depois: 4,8 não confere: as somas dão A + P = 760 ÷ 100 = 7,6, e a nota geral dá A + 2P = 12. Subtraindo, P = 4,4.
- conta conferida: `12-7.6` → 4.4

### P40630c1 · B [85%.] (gab A)
- antes: Provavelmente desconta a fatia de maliciosas do índice de acerto: 95 % − 10 % = 85 %. São porcentagens de bases diferentes (uma é de todas as mensagens, a outra é só das maliciosas) e não podem ser subtraídas uma da outra.
- depois: 85 % não confere. Em 1 000 mensagens, há 0,95 × 100 = 95 alertas corretos e 0,03 × 900 = 27 falsos: 95 ÷ 122 ≈ 78 %.
- conta conferida: `95/122` → 0.778689

### P40630c1 · C [82%.] (gab A)
- antes: Provavelmente erra a base dos falsos alertas no meio da conta, aplicando os 3 % a um grupo menor que as 900 mensagens inofensivas — por exemplo, 3 % de 700, que dá 21 e leva a 95 ÷ (95 + 21) = 95 ÷ 116 ≈ 82 %. Os 3 % valem para todas as mensagens não maliciosas.
- depois: 82 % não confere. Em 1 000 mensagens, há 0,95 × 100 = 95 alertas corretos e 0,03 × 900 = 27 falsos: 95 ÷ 122 ≈ 78 %.
- conta conferida: `95/122` → 0.778689

### P40630c1 · D [92%.] (gab A)
- antes: Provavelmente desconta os falsos alertas diretamente do índice de acerto: 95 % − 3 % = 92 %. É a mesma confusão de bases: os 3 % se referem às mensagens inofensivas, não às maliciosas.
- depois: 92 % não confere. Em 1 000 mensagens, há 0,95 × 100 = 95 alertas corretos e 0,03 × 900 = 27 falsos: 95 ÷ 122 ≈ 78 %.
- conta conferida: `95/122` → 0.778689

### Ped0bb37 · E [((8 + 2√3)/3)π] (gab C)
- antes: Provavelmente conta três arcos em vez de dois: usa os ângulos de giro certos (150°, 90° e 120°) mas dá um raio a B em cada um deles (2, 2 e √3), chegando a 5π/3 + π + 2√3π/3 = ((8 + 2√3) ÷ 3) × π. No terceiro giro B é o centro da rotação e não percorre nada.
- depois: (8 + 2√3)π/3 não confere: B só se move em dois giros, 150° com raio 2 e 90° com raio 1. (150/360) × 4π + (90/360) × 2π = 13π/6.
- conta conferida: `150/360*4+90/360*2-13/6` → 4.44089e-16

### P28e377c · A [1/9] (gab B)
- antes: Provavelmente conta como favoráveis 3³ = 27 sequências, imaginando que três rodadas ficam livres e duas ficam "amarradas" para cancelar o movimento: 27 ÷ 243 = 1/9. As rodadas não se dividem assim, e a contagem correta dos favoráveis é 51.
- depois: 1/9 = 27/243 não confere: voltam ao zero 1 sequência só de paradas, 20 com uma ida e uma volta e 30 com duas de cada. 51/243 = 17/81.
- conta conferida: `(1+fact(5)/(fact(3))+fact(5)/(2*2))/243` → 0.209877

### P501e69c · B [28.] (gab E)
- antes: Também não sai de conta nenhuma. Pelo alcance ser 2 × AB − 3, os 28 cm exigiriam AB = 15,5 cm, e 15,5² − 8 × 15,5 = 116,25, enquanto a lei dos cossenos pede 128. A equação é u² − 8u − 128 = 0, com Δ = 64 + 512 = 576: o sinal de c é negativo, então −4ac soma, e a raiz positiva é exatamente 16.
- depois: 28 cm exigiria AB = (28 + 3) ÷ 2 = 15,5 cm. A lei dos cossenos dá AB² − 8 × AB = 128, isto é, AB = 16, e o alcance é 2 × 16 − 3 = 29 cm.
- conta conferida: `16**2-8*16` → 128

### P5879ccf · A [112.] (gab C)
- antes: 112 cm³ não sai de conta nenhuma, e há um cerco que mostra isso sem calcular nada: o sólido contém um prisma reto de base 6 cm² e altura 8 cm (48 cm³) e cabe dentro de um prisma reto de base 6 cm² e altura 12 cm (72 cm³), então o volume está entre 48 cm³ e 72 cm³. Somar as três arestas e multiplicar pela base, sem dividir por 3, daria 6 × 30 = 180 cm³, que também não está na lista. A altura que entra na fórmula é a média das três arestas: (10 + 8 + 12) ÷ 3 = 10 cm.
- depois: 112 cm³ não confere. O volume é 6 × (10 + 8 + 12) ÷ 3 = 60 cm³. Ele tem de ficar entre 6 × 8 = 48 e 6 × 12 = 72.
- conta conferida: `6*(10+8+12)/3` → 60

### Pdfe312a · A [10.] (gab E)
- antes: Provavelmente vem de adotar 1,6 como linha de corte, o que acontece ao calcular 0,60 ÷ 0,40 de cabeça e obter 1,6 em vez de 1,5. Com corte em 1,6 a contagem daria 11, e perder uma das quatro barras vizinhas de mesma altura 1,6 (BA, CE, MG e PE), que ficam coladas no gráfico, leva exatamente a 10.
- depois: 10 não confere: 60 % na rede privada equivale a razão ≥ 0,60 ÷ 0,40 = 1,5, e há 12 barras assim, de SP até RS.
- conta conferida: `sum(1 for v in [3.5,2.7,2.2,2.0,2.0,1.9,1.8,1.6,1.6,1.6,1.6,1.5,1.4,1.3,1.3,1.2,1.1,1.1,1.1,1.0,1.0,1.0,0.9,0.8,0.8,0.8,0.7] if v>=1.5)` → 12

### P15f5be1 · B [5%.] (gab A)
- antes: Provavelmente vem de misturar as duas moedas na mesma conta: achar o preço brasileiro em dólares, 16,90 ÷ 3,85 = 4,39, tirar a diferença 5,51 − 4,39 = 1,12 (que está em dólares) e dividir esse 1,12 por um valor em reais, 21,21, o que dá 0,053, perto de 5 %.
- depois: 5 % não confere: o preço esperado é 5,51 × 3,85 ≈ R$ 21,21, e (21,21 − 16,90) ÷ 21,21 ≈ 0,20, isto é, 20 %.
- conta conferida: `(5.51*3.85-16.90)/(5.51*3.85)` → 0.203337

### P15f5be1 · E [10%.] (gab A) ✔
- antes: Provavelmente usar a soma dos dois preços como referência: 4,3135 ÷ (21,2135 + 16,90) = 4,3135 ÷ 38,1135 = 0,113, arredondado para perto de 10 %. A soma não é o valor de referência de nada aqui.
- depois: 10 % não confere: o preço esperado é 5,51 × 3,85 ≈ R$ 21,21, e (21,21 − 16,90) ÷ 21,21 ≈ 0,20, isto é, 20 %.
- conta conferida: `(5.51*3.85-16.90)/(5.51*3.85)` → 0.203337

### P3bef75f · D [989 901 bens.] (gab E)
- antes: Provavelmente tratar o bloco de 2 dígitos da secretaria como livre, de 01 até 99, em vez de fixo nas 8 secretarias que o enunciado deu: 9 999 × 99 = 989 901.
- depois: 989 901 não confere: o bloco da secretaria só admite as 8 secretarias. São 8 × 9 999 sequenciais (0001 a 9999) = 79 992 bens.
- conta conferida: `8*9999` → 79992

### P23effe7 · A [9 600 L.] (gab B)
- antes: 9 600 não sai de conta nenhuma. O caminho mais próximo, supor que todo o produto saiu ao preço por litro do container (5 200 ÷ 1 000 = 5,20 reais por litro) e fazer 50 100 ÷ 5,20, dá 9 634,6, e não 9 600. E nem existe um preço único por litro: ele é 6 reais na bombona pequena, 4,75 na grande e 5,20 no container.
- depois: 9 600 L não confere. As equações dão 20 bombonas pequenas, 30 grandes e 3 containers: 50 × 20 + 200 × 30 + 1 000 × 3 = 10 000 L.
- conta conferida: `50*20+200*30+1000*3` → 10000

### P85f1025 · E [5,8 milhões.] (gab B)
- antes: 5,8 não sai de conta nenhuma. O caminho mais parecido, subtrair as porcentagens em vez de encadeá-las (28,4 % − 23,4 % = 5 % e 0,05 × 117,5 = 5,875), dá 5,875, que arredonda para 5,9, e não para 5,8. Porcentagem de porcentagem se multiplica, não se subtrai.
- depois: 5,8 milhões não confere: 0,234 × 117,5 ≈ 27,5 milhões têm diploma, e 0,284 × 27,5 ≈ 7,8 milhões moram em São Paulo.
- conta conferida: `0.284*0.234*117.5` → 7.80858

### P3c8ff70 · E [√3/2] (gab D)
- antes: Provavelmente chutar um ângulo notável, 30°, porque a maioria das equações trigonométricas de prova cai em 30°, 45° ou 60°. Com α = 30°, o determinante vale 0,25 + 0,866 = 1,116, que não é zero.
- depois: √3/2 não confere: o determinante sen²α + cos α tem de ser 0, e com cos α = √3/2 ele vale 0,25 + 0,866 ≈ 1,12.
- conta conferida: `0.25+sqrt(3)/2` → 1.11603

### P26ce383 · E [24,5] (gab C)
- antes: 24,5 não sai de conta nenhuma com os dados; é distrator vizinho do valor certo.
- depois: 24,5 não confere: a reflexão preserva a área, e a figura original se decompõe em 14 + 1 + 8 = 23 quadrículos.
- conta conferida: `2*7+2*1/2+2*8/2` → 23

### P7b015a0 · C [0,4 cm] (gab B)
- antes: 0,4 cm não sai de conta nenhuma com os dados; é distrator.
- depois: 0,4 cm daria 0,4 × 16 = 6,4 cm³ na moldura. Transbordam os 8 cm³ do cubo R, e 8 ÷ (25 − 9) = 0,5 cm.
- conta conferida: `0.4*16` → 6.4

### P7b015a0 · D [0,2 cm] (gab B)
- antes: 0,2 cm não sai de conta nenhuma com os dados; é distrator.
- depois: 0,2 cm daria 0,2 × 16 = 3,2 cm³ na moldura. Transbordam os 8 cm³ do cubo R, e 8 ÷ (25 − 9) = 0,5 cm.
- conta conferida: `0.2*16` → 3.2

### P7b015a0 · E [0,8 cm] (gab B)
- antes: 0,8 cm não sai de conta nenhuma com os dados; é distrator. Usar a base inteira de Q daria 8 ÷ 25 = 0,32, que não está entre as opções.
- depois: 0,8 cm daria 0,8 × 16 = 12,8 cm³ na moldura. Transbordam só os 8 cm³ do cubo R, e 8 ÷ (25 − 9) = 0,5 cm.
- conta conferida: `0.8*16` → 12.8

### Pa1aab41 · A [15,5 anos] (gab D)
- antes: 15,5 anos não sai de conta nenhuma com os dados; é distrator.
- depois: 15,5 não confere. Vão 18 alunos de cada idade (1/5 de 90, 1/8 de 144, 1/7 de 126), e a média de 15, 16 e 17 fica 16.
- conta conferida: `(18*15+18*16+18*17)/54` → 16

### Pa1aab41 · B [16,2 anos] (gab D)
- antes: 16,2 anos não sai de conta nenhuma com os dados; é distrator. O erro natural, fazer a média dos 360 alunos, dá 5796 ÷ 360 = 16,1, que não está entre as opções.
- depois: 16,2 não confere: vão 18 alunos de cada idade, e a média fica (15 + 16 + 17) ÷ 3 = 16. Mesmo a média dos 360 alunos daria 16,1.
- conta conferida: `(90*15+144*16+126*17)/360` → 16.1

### Pa1aab41 · C [15,2 anos] (gab D)
- antes: 15,2 anos não sai de conta nenhuma com os dados; é distrator.
- depois: 15,2 não confere. Vão 18 alunos de cada idade (1/5 de 90, 1/8 de 144, 1/7 de 126), e a média de 15, 16 e 17 fica 16.
- conta conferida: `(90/5,144/8,126/7)` → (18.0, 18.0, 18.0)

### Pa1aab41 · E [15,8 anos] (gab D)
- antes: 15,8 anos não sai de conta nenhuma com os dados; é distrator.
- depois: 15,8 não confere. Vão 18 alunos de cada idade (1/5 de 90, 1/8 de 144, 1/7 de 126), e a média de 15, 16 e 17 fica 16.
- conta conferida: `864/54` → 16

### W1f4a211 · E [35 cm] (gab C)
- antes: Provavelmente vem de achar o 25 e tomá-lo como se fosse o pedaço DB, somando depois o AD: 10 + 25 = 35. O 25 já é o lado AB inteiro, com o AD contado dentro dele.
- depois: 35 não confere: AD ÷ AB = AE ÷ AC dá AB = 10 × 50 ÷ 20 = 25 cm, já com o AD dentro.
- conta conferida: `10*50/20` → 25

### W4666ece · A [48 metros] (gab D)
- antes: Provavelmente multiplicou os dois senos em vez de dividir por um deles: 70 × 0,96 × 0,70 = 47,04, que arredonda para os 48 da lista. Na lei dos senos, o seno do ângulo oposto ao lado conhecido fica embaixo, dividindo.
- depois: 48 m não confere: o ângulo B mede 180° − 62° − 74° = 44°, e AB = 70 × 0,96 ÷ 0,70 = 96 m.
- conta conferida: `70*0.96/0.70` → 96

### W4666ece · B [78 metros] (gab D) ✔
- antes: Provavelmente usou o cos 28° = 0,88 como se fosse o seno de baixo e esqueceu o 0,96 de cima: 70 ÷ 0,88 = 79,5, que leva aos 78 da lista. Esse cosseno está no enunciado só para distrair: ele não entra em nenhuma etapa da resolução.
- depois: 78 m não confere: o ângulo B mede 180° − 62° − 74° = 44°, e AB = 70 × 0,96 ÷ 0,70 = 96 m.
- conta conferida: `70*0.96/0.70` → 96

### W4666ece · C [85 metros] (gab D)
- antes: Provavelmente calculou o lado errado do triângulo. Pondo 0,88 no lugar de 0,96 em cima acha-se BC, a distância de B até o ponto C: 70 × 0,88 ÷ 0,70 ≈ 88, valor que puxa para os 85 da lista. Só que a pergunta é a distância entre as árvores, que é AB.
- depois: 85 m não confere: o ângulo B mede 180° − 62° − 74° = 44°, e AB = 70 × 0,96 ÷ 0,70 = 96 m.
- conta conferida: `70*0.96/0.70` → 96

### W4666ece · E [102 metros] (gab D) ✔
- antes: Provavelmente parou no meio da conta: dividiu o 70 por sen 44° = 0,70 e esqueceu de multiplicar por sen 74°, obtendo 70 ÷ 0,70 = 100, que leva aos 102 da lista.
- depois: 102 m não confere: o ângulo B mede 180° − 62° − 74° = 44°, e AB = 70 × 0,96 ÷ 0,70 = 96 m.
- conta conferida: `70*0.96/0.70` → 96

### Wdc1e64d · A [38 metros] (gab C)
- antes: Provavelmente esqueceu o 2 do termo 2 × AT × BT × cos: usou 32 × 13 × 0,5 = 208, chegando a 1 024 + 169 + 208 = 1 401, cuja raiz é 37,4, valor aproximado para 38. O 2 faz parte da fórmula.
- depois: 38 m não confere. AB² = 32² + 13² − 2 × 32 × 13 × (−0,5) = 1 609, e √1 609 ≈ 40,1 m.
- conta conferida: `sqrt(1024+169+416)` → 40.1123

### Wdc1e64d · B [39 metros] (gab C)
- antes: Provavelmente escorregou na multiplicação 32 × 13: fez 320 + 8 = 328 no lugar de 320 + 96 = 416. Isso leva a 1 024 + 169 + 328 = 1 521, e √1 521 é exatamente 39.
- depois: 39 m não confere: AB² = 1 024 + 169 + 416 = 1 609, e 39² = 1 521 fica abaixo. √1 609 ≈ 40,1 m.
- conta conferida: `39**2` → 1521

### Wdc1e64d · E [42 metros] (gab C)
- antes: Provavelmente tratou cos 120° como −1 em vez de −1/2: isso dá 1 024 + 169 + 832 = 2 025, cuja raiz é exatamente 45, e, sem 45 na lista, sobra a alternativa mais alta. O cosseno só chega a −1 em 180°, caso em que o triângulo se achata e AB passaria a valer 32 + 13 = 45 m.
- depois: 42 m não confere: AB² = 1 024 + 169 + 416 = 1 609, e 42² = 1 764 fica acima. √1 609 ≈ 40,1 m.
- conta conferida: `42**2` → 1764

### We8e579e · B [-1] (gab A)
- antes: Provavelmente escorregou na divisão final: chegou em −14x = 28 e dividiu o 28 por ele mesmo em vez de dividir por 14, respondendo −1. Testando: de (−1, 0) até A dá √(4 + 16) = √20, e até B dá √(25 + 9) = √34. As distâncias não são iguais.
- depois: Com x = −1, P fica a √(4 + 16) = √20 de A e a √(25 + 9) = √34 de B: não é equidistante. A equação dá −14x = 28, x = −2.
- conta conferida: `(4+16,25+9)` → (20, 34)

### W547a774 · A [0] (gab C)
- antes: Provavelmente chegou a −x² = −1 e, ao trocar os sinais, leu x² = −1, concluindo que nenhum número real resolve. Ao multiplicar os dois lados por −1, os dois negativos somem ao mesmo tempo: o certo é x² = +1.
- depois: 0 não confere: x² = 2x² − 1 dá x² = 1, com x = 1 e x = −1. São os pontos (1, 1) e (−1, 1).
- conta conferida: — (afirmação qualitativa/leitura de figura)

### W547a774 · D [3] (gab C)
- antes: Encontrou as duas soluções e ainda contou a origem (0, 0) como ponto comum, provavelmente porque ela pertence a y = x². Mas na segunda parábola o ponto de x = 0 é (0, −1), então a origem não está nas duas curvas.
- depois: 3 não confere: x² = 2x² − 1 só tem x = ±1. A origem não é comum, porque na segunda parábola x = 0 dá y = −1.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### Wb1f3d36 · C [9.] (gab A)
- antes: Provavelmente leu mal o terceiro vértice. Nenhuma leitura correta dos três pontos dados produz 9: para a área dar 9, esse vértice teria de ser (4, −4) em vez de (4, −1).
- depois: 9 não confere. D = 1 × (4 + 1) − 2 × (3 − 4) + (−3 − 16) = −12, e a área é 12 ÷ 2 = 6.
- conta conferida: `abs(1*(4+1)-2*(3-4)+(3*-1-4*4))/2` → 6

### W0f1a5d6 · A [68.] (gab C)
- antes: Provavelmente é chute. O total tem de ser x + 2x = 3x, ou seja, um múltiplo de 3, e 68 não é múltiplo de 3 (6 + 8 = 14, que não é divisível por 3). Nenhuma solução deste problema pode terminar em 68.
- depois: 68 não é múltiplo de 3, e o total é x + 2x = 3x. De 0,60x = 15,60 sai x = 26, e o total é 78.
- conta conferida: `3*15.60/0.60` → 78

### Weddc84f · D [−1/2 − (2/3) i] (gab B)
- antes: Não sai de conta nenhuma. É a alternativa C com o sinal da parte imaginária trocado: o 2/3 já é a fração 3/2 de cabeça para baixo, e o sinal de menos não tem de onde vir. Multiplicar em cima e embaixo por (1 − i) em vez de (1 + i) não troca sinal nenhum: multiplicar em cima e embaixo pelo mesmo número nunca muda o valor da fração, só deixa o i no denominador.
- depois: −1/2 − (2/3)i não confere: (1 + 2i)(1 + i) ÷ 2 = (−1 + 3i) ÷ 2, com parte imaginária +3/2.
- conta conferida: `(1+2j)/(1-1j)` → (-0.5+1.5j)

### Weddc84f · E [1/2 − (3/2) i] (gab B)
- antes: Não sai de conta nenhuma. É exatamente o conjugado da alternativa A, mas nenhum deslize simples chega nele: usar (1 − i) no lugar do conjugado dá (1 + 2i)(1 − i) = 3 + i em cima e (1 − i)(1 − i) = −2i embaixo, o mesmo número de antes com o i ainda no denominador.
- depois: 1/2 − (3/2)i não confere: (1 + 2i)(1 + i) ÷ 2 = (−1 + 3i) ÷ 2, com parte real −1/2 e imaginária +3/2.
- conta conferida: `(1+2j)/(1-1j)` → (-0.5+1.5j)

### We55fa78 · B [9,43 kg] (gab A)
- antes: Provavelmente é um número de enchimento: nenhum caminho natural com 1/5, 2/3 e 50 kg chega nele. O mais perto é grudar os dois denominadores num número só e fazer 50 ÷ 5,3 = 9,43 — conta que não representa nada nesta situação.
- depois: 9,43 kg não confere: sobra 1 − 1/5 − 2/3 = 2/15 do saco, e 2/15 × 50 ≈ 6,67 kg.
- conta conferida: `2/15*50` → 6.66667

### W232e73e · A [6] (gab B)
- antes: Provavelmente achou que a raiz e o expoente 0,4 se anulam e que sobra só a base, respondendo 6. Eles não se anulam: a raiz multiplica o expoente por 0,5 e o 0,4 multiplica de novo, o que deixa 6², não 6¹.
- depois: 6 não confere: √(6¹⁰) = 6⁵, e (6⁵)^0,4 = 6^(5 × 0,4) = 6² = 36.
- conta conferida: `(sqrt(6**10))**0.4` → 36

### W232e73e · C [√6] (gab B)
- antes: Provavelmente apagou o expoente √100 (como se fosse 1) e também ignorou o 0,4, ficando só com a raiz quadrada do 6. Usou o dado errado em dois lugares: o 10 de dentro e o 0,4 de fora.
- depois: √6 não confere: √(6¹⁰) = 6⁵, e (6⁵)^0,4 = 6^(5 × 0,4) = 6² = 36.
- conta conferida: `(sqrt(6**10))**0.4` → 36

### W232e73e · D [216] (gab B)
- antes: Provavelmente trocou o expoente de fora, usando 0,6 no lugar de 0,4. Daí sai 5 × 0,6 = 3 e 6³ = 216.
- depois: 216 = 6³ exigiria expoente final 3. Mas √(6¹⁰) = 6⁵, e 5 × 0,4 = 2: o resultado é 6² = 36.
- conta conferida: `5*0.4` → 2

### W232e73e · E [0,6] (gab B)
- antes: Provavelmente acreditou que um expoente menor que 1 sempre deixa o número menor que 1, e respondeu o próprio 6 com a vírgula deslocada. Expoente menor que 1 diminui a potência, mas aqui havia o expoente 10 por baixo: o resultado final ainda é maior que o 6.
- depois: 0,6 não confere: √(6¹⁰) = 6⁵, e (6⁵)^0,4 = 6^(5 × 0,4) = 6² = 36.
- conta conferida: `(sqrt(6**10))**0.4` → 36

### W182285b · A [I, apenas.] (gab C)
- antes: Aceitou a I e recusou a II, provavelmente lendo interseção como se fosse união: quem junta R, N e Z pensa logo em R, vê a afirmação dizendo N e acha que está errada. Interseção faz o contrário da união: ela fica com o menor dos três, que é N.
- depois: Recusar a II está errado: N está dentro de Z, que está dentro de R, e a interseção dos três é o menor deles, N.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### W182285b · D [II e III, apenas.] (gab C)
- antes: Acertou a II, caiu na mesma armadilha da III (achar que tirar N de Z não deixa nada) e recusou a I, provavelmente achando que a união de dois conjuntos diferentes tem de produzir um terceiro conjunto, maior que os dois.
- depois: A III é falsa: −1 está em Z e não em N, logo Z − N não é vazio. E a I é verdadeira, pois Z ∪ R = R.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### W9aff871 · D [R$ 8750,00.] (gab E)
- antes: É o valor mais próximo do certo e por isso o mais perigoso, mas não sai de conta nenhuma: 8 750 × 0,03 × 7 = 1 837,50, ou seja, esse capital renderia R$ 52,50 a mais do que o enunciado informa. A divisão 1 785 ÷ 0,21 não tem resto nem arredondamento: dá 8 500 cravado.
- depois: R$ 8.750,00 renderia 8 750 × 0,03 × 7 = R$ 1.837,50 de juros, R$ 52,50 a mais. O capital é 1 785 ÷ 0,21 = 8 500.
- conta conferida: `8750*0.03*7` → 1837.5

### W473f90c · B [16 km] (gab A)
- antes: Provavelmente errou a subtração do segundo passo, fazendo 19,00 − 4,60 = 15,40 em vez de 14,40 (um tropeço clássico no empréstimo da casa decimal). Daí 15,40 ÷ 0,96 = 16,04, arredondado para 16 km.
- depois: 16 km custariam 4,60 + 0,96 × 16 = R$ 19,96, e não R$ 19,00. A distância é 14,40 ÷ 0,96 = 15 km.
- conta conferida: `4.60+0.96*16` → 19.96

### W473f90c · C [17 km] (gab A)
- antes: Provavelmente é um degrau de enchimento, posto ali só para formar a sequência 15, 16, 17, 18, 19. Para dar 17 km, a bandeirada teria que ser de R$ 2,60 e não de R$ 4,60, porque (19,00 − 2,60) ÷ 0,96 = 17,08.
- depois: 17 km custariam 4,60 + 0,96 × 17 = R$ 20,92, e não R$ 19,00. A distância é 14,40 ÷ 0,96 = 15 km.
- conta conferida: `4.60+0.96*17` → 20.92

### W730cc1c · A [março] (gab D)
- antes: Provavelmente dividiu as produções iniciais uma pela outra — 3 000 ÷ 1 100 = 2,7 — e arredondou para 3, lendo o terceiro mês. Essa divisão não tem relação com a pergunta: o que importa é a diferença de 1 900 pares e a diferença de ritmo de 220 pares por mês.
- depois: Em março (x = 3), A faz 3 210 pares e B, 1 970. B só passa A quando 220x > 1 900, isto é, x = 9: setembro.
- conta conferida: `1900/220` → 8.63636

### W7eecf74 · D [S = {−3, 1}] (gab B)
- antes: Provavelmente pega um valor de cada caminho: o −3 vem certo de |x| = 3, e o 1 vem da raiz y = −1 com o sinal apagado, como se desse |x| = 1. O sinal de y = −1 não se apaga; esse valor simplesmente não serve.
- depois: {−3, 1} não confere: x = 1 dá 1 − 2 − 3 = −4. Com y = |x|, y² − 2y − 3 = 0 dá y = 3 ou y = −1, e só |x| = 3 serve.
- conta conferida: `1-2-3` → -4

### W7eecf74 · E [S = {1, 3}] (gab B)
- antes: Provavelmente vem da ideia de que, como módulo só dá resultado positivo, o próprio x também teria de ser positivo. Aí o −3 some e no lugar dele entra o 1, tirado da raiz y = −1 sem o sinal. Quem é obrigado a não ser negativo é o |x|, não o x.
- depois: {1, 3} não confere: x = 1 dá 1 − 2 − 3 = −4. E x = −3 também resolve, pois |−3| = 3. A solução é {−3, 3}.
- conta conferida: `1-2-3` → -4

### W305db29 · B [S = {0, 1/3}] (gab C)
- antes: Provavelmente escorregou no segundo caso: escreveu 2x − 1 = −x + 1 e passou só o x para a esquerda, esquecendo de passar o −1 para a direita, chegando a 3x = 1 e x = 1/3. O certo é 3x = 2 — e mesmo esse valor a condição reprova.
- depois: x = 1/3 não serve: o lado direito vale 1/3 − 1 = −2/3, negativo, e um módulo nunca é negativo. S = Ø.
- conta conferida: `1/3-1` → -0.666667

### W305db29 · D [S = {0, – 1}] (gab C)
- antes: Provavelmente distribuiu o sinal pela metade no segundo caso, escrevendo −(x − 1) = −x − 1: isso leva a 2x − 1 = −x − 1, ou seja, 3x = 0 e x = 0 de novo. Ao testar x = 0, viu o lado direito valer 0 − 1 = −1 e levou esse −1 para dentro do conjunto como se fosse raiz.
- depois: {0, −1} não serve: com x = 0 ou x = −1, o lado direito x − 1 é negativo, e um módulo não pode valer isso.
- conta conferida: `(0-1,-1-1)` → (-1, -2)

### W305db29 · E [S = {0, 4/3}] (gab C)
- antes: Provavelmente elevou os dois lados ao quadrado e errou o desenvolvimento de (x − 1)², escrevendo x² + 1 e perdendo o termo do meio, −2x. Isso dá 4x² − 4x + 1 = x² + 1, ou seja, 3x² − 4x = 0, cujas raízes são 0 e 4/3. Com (x − 1)² = x² − 2x + 1, as raízes seriam 0 e 2/3 — e mesmo essas a condição reprova.
- depois: x = 4/3 não confere: |2 × 4/3 − 1| = 5/3, mas 4/3 − 1 = 1/3. E x = 0 deixa o lado direito em −1.
- conta conferida: `(abs(8/3-1),4/3-1)` → (1.6666666666666665, 0.33333333333333326)

### We42e829 · C [−2] (gab B)
- antes: Provavelmente é o produto das raízes desse mesmo trinômio de dentro (2 × (−1) = −2), ou o termo independente −2 copiado direto do enunciado. A pergunta é pela soma dos valores de x que satisfazem a igualdade inteira.
- depois: −2 não confere: as soluções são −1, 0 e 4 (todas conferem na igualdade), e −1 + 0 + 4 = 3.
- conta conferida: `sum(x for x in range(-10,11) if abs(x*x-x-2)==2*x+2)` → 3

### W26d1288 · A [1/2] (gab C)
- antes: Provavelmente errou o sinal ao descascar o log₃: escreveu log₂ x = −1/3 em vez de 3⁻¹ = 1/3. Com isso x = 2 elevado a −1/3 e x³ = 2⁻¹ = 1/2 — que é, não por acaso, o número que já aparecia no enunciado.
- depois: 1/2 não confere. De 2^(log₃ log₂ x) = 2⁻¹ sai log₃ log₂ x = −1, logo log₂ x = 1/3 e x³ = (2^(1/3))³ = 2.
- conta conferida: `(2**(1/3))**3` → 2

### W26d1288 · B [1] (gab C)
- antes: Provavelmente parou no valor de x e arredondou: x = 2 elevado a 1/3 ≈ 1,26, que de cabeça vira 1. A pergunta é pelo cubo, e elevar 1,26 ao cubo devolve 2.
- depois: 1 não confere. De 2^(log₃ log₂ x) = 2⁻¹ sai log₃ log₂ x = −1, logo log₂ x = 1/3 e x³ = (2^(1/3))³ = 2.
- conta conferida: `(2**(1/3))**3` → 2

### W26d1288 · E [8] (gab C)
- antes: Provavelmente perdeu o sinal de menos e ainda parou em x: com log₃(log₂ x) = 1 sai log₂ x = 3 e x = 2³ = 8, que foi marcado direto. São dois tropeços somados, o sinal do 1/2 e a pergunta ser por x³.
- depois: 8 não confere. De 2^(log₃ log₂ x) = 2⁻¹ sai log₃ log₂ x = −1, logo log₂ x = 1/3 e x³ = (2^(1/3))³ = 2.
- conta conferida: `(2**(1/3))**3` → 2

### Wae58190 · D [9] (gab B)
- antes: Provavelmente é o expoente 7 somado aos dois dias já escritos no enunciado (o de 3 e o de 9 acessos), como se eles viessem antes da contagem: 7 + 2 = 9. Esses dois dias já são o dia 1 e o dia 2 dentro da própria contagem.
- depois: 9 não confere: no dia n há 3ⁿ acessos, e 3⁹ = 19 683. Como 2 187 = 3⁷, o dia é o 7.
- conta conferida: `3**9` → 19683

### Wae58190 · E [10] (gab B)
- antes: Provavelmente soma o expoente 7 com o valor do primeiro termo, que também é 3: 7 + 3 = 10. É a mistura clássica desta questão — o valor do termo entrando no lugar da posição dele.
- depois: 10 não confere: no dia n há 3ⁿ acessos, e 3¹⁰ = 59 049. Como 2 187 = 3⁷, o dia é o 7.
- conta conferida: `3**10` → 59049

### W72446e6 · C [2/30] (gab A)
- antes: Provavelmente multiplicou certo os numeradores (1 × 2 = 2) e errou a tabuada do denominador, fazendo 8 × 5 = 30 em vez de 8 × 5 = 40.
- depois: 2/30 não confere: 2/5 de 1/8 é (2 × 1) ÷ (5 × 8) = 2/40 = 1/20.
- conta conferida: `2/5*1/8` → 0.05

### Wd662251 · A [completamente proporcionais.] (gab E)
- antes: Provavelmente leu a palavra proporcionais na primeira alternativa e marcou sem ler o resto. Completamente proporcionais não é um nome usado em matemática: existem só os dois tipos, diretamente e inversamente.
- depois: 'Completamente proporcionais' não é classificação matemática. Com a distância fixa, velocidade × tempo é constante: inversamente proporcionais.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### Wd662251 · D [subitamente proporcionais.] (gab E)
- antes: Subitamente proporcionais não existe como classificação. Provavelmente leu rápido e confundiu subitamente com inversamente, que é a palavra parecida da alternativa E.
- depois: 'Subitamente proporcionais' não é classificação matemática. Com a distância fixa, velocidade × tempo é constante: inversamente proporcionais.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### We0833a1 · D [0,35] (gab C)
- antes: Provavelmente aplicou um lucro de 40 % em vez de 20 %, dobrando a margem por achar que os cinco bombons comidos precisavam ser compensados: 5 × 1,40 = 7 e 7 ÷ 20 = 0,35. O enunciado diz que o lucro obtido foi de 20 %, já contando com os bombons comidos.
- depois: R$ 0,35 daria 20 × 0,35 = R$ 7,00, lucro de 40 %. Para 20 %, a venda rende 5 × 1,20 = R$ 6,00, e 6 ÷ 20 = 0,30.
- conta conferida: `20*0.35/5-1` → 0.4

### W906d42a · A [3 anos e 4 meses.] (gab E)
- antes: 3 anos e 4 meses são 40 meses. Provavelmente usou a taxa de 2,5 % ao mês no lugar de 2 %: 1 ÷ 0,025 = 40. Conferindo com a taxa certa, 40 meses × 2 % = 80 % de juros, ou seja, o montante chegaria a 1,8 vez o capital, não ao dobro.
- depois: 3 anos e 4 meses são 40 meses, e 40 × 2 % = 80 % de juros: o montante não chega ao dobro. São precisos 100 ÷ 2 = 50 meses.
- conta conferida: `40*0.02` → 0.8

### W906d42a · B [3 anos e 6 meses.] (gab E)
- antes: 3 anos e 6 meses são 42 meses, e esse número não sai de conta nenhuma: a divisão 1 ÷ 0,02 é exata e dá 50. Conferindo, 42 meses × 2 % = 84 % de juros, ou seja, o montante chegaria a 1,84 vez o capital, ainda longe do dobro.
- depois: 3 anos e 6 meses são 42 meses, e 42 × 2 % = 84 % de juros: o montante não chega ao dobro. São precisos 100 ÷ 2 = 50 meses.
- conta conferida: `42*0.02` → 0.84

### W906d42a · C [3 anos e 9 meses.] (gab E)
- antes: 3 anos e 9 meses são 45 meses. Provavelmente calculou com 90 % de juros em vez de 100 %, que é o que acontece quando se confunde 'dobrar' com 'aumentar 90 %': 90 ÷ 2 = 45 meses.
- depois: 3 anos e 9 meses são 45 meses, e 45 × 2 % = 90 % de juros: o montante não chega ao dobro. São precisos 100 ÷ 2 = 50 meses.
- conta conferida: `45*0.02` → 0.9

### W906d42a · D [4 anos.] (gab E)
- antes: 4 anos são 48 meses. Provavelmente chegou aos 50 meses certos e arredondou para o número redondo de 4 anos, jogando fora os 2 meses que faltavam. Conferindo: em 48 meses os juros são 48 × 2 % = 96 % do capital, quase o dobro, mas ainda não o dobro.
- depois: 4 anos são 48 meses, e 48 × 2 % = 96 % de juros: o montante não chega ao dobro. São precisos 100 ÷ 2 = 50 meses.
- conta conferida: `48*0.02` → 0.96

### W16d7a80 · A [R$ 1320,80] (gab C)
- antes: R$ 1 320,80 fica abaixo do capital aplicado, o que já é impossível: numa aplicação a juros o dinheiro só cresce. E o número não sai de conta nenhuma — ele corresponde a multiplicar 1 500 por 0,88053, enquanto aplicar o desconto de 2 % duas vezes daria 1 500 × 0,98 × 0,98 = 1 440,60. O fator certo é 1,02² = 1,0404.
- depois: R$ 1.320,80 fica abaixo do capital, o que é impossível com juros. O montante é 1 500 × 1,02² = 1 500 × 1,0404 = 1 560,60.
- conta conferida: `1500*1.02**2` → 1560.6

### W1316955 · C [2,57.] (gab B)
- antes: Provavelmente aplicou o fator da concentração duas vezes, multiplicando o resultado por ele mesmo em vez de parar na divisão: 1,604 × 1,604 = 2,57. É o erro de repetir a fórmula quando ela já foi usada.
- depois: 2,57 g/L não confere: há 80,2 × 0,1 = 8,02 g de etanol em 5 L de sangue, e 8,02 ÷ 5 ≈ 1,60 g/L.
- conta conferida: `80.2*0.1/5` → 1.604

### W1316955 · E [4,16.] (gab B)
- antes: É o maior valor da lista e não sai de conta nenhuma: para a concentração ser 4,16 g/L nos 5 L de sangue, a pessoa teria ingerido 4,16 × 5 = 20,8 g de etanol, o que exigiria 20,8 ÷ 80,2 = 0,26 L de vinho — quase 260 mL, e o enunciado diz 100 mL. Com 100 mL a massa é 8,02 g e a concentração, 1,60 g/L.
- depois: 4,16 g/L em 5 L exigiria 4,16 × 5 = 20,8 g de etanol, cerca de 260 mL de vinho. Com 100 mL, são 8,02 g e 1,60 g/L.
- conta conferida: `20.8/80.2` → 0.259352

### W4be4bdc · A [6 horas] (gab D)
- antes: Provavelmente dobrou o ponto de empate, imaginando que o limite ficava bem depois dele. Em 6 horas Daniel cobra 55 + 35 × 6 = 265 reais e Carlos cobra 100 + 20 × 6 = 220 reais: Daniel está 45 reais mais caro.
- depois: Em 6 horas Daniel cobra 55 + 35 × 6 = R$ 265 e Carlos, 100 + 20 × 6 = R$ 220: Daniel fica mais caro. O limite é 15x ≤ 45, x = 3.
- conta conferida: `55+35*6` → 265

### W17389d1 · A [R$ 950,00] (gab B)
- antes: 950 não sai de conta nenhuma. O tropeço mais próximo, trocar a fração da alimentação de 1/4 por 1/5, deixa sobrar 2x ÷ 5 do salário, e 2x ÷ 5 ≥ 385 dá x ≥ 962,50, e não 950. Testando o 950: 237,50 + 380 + 300 = 917,50 de gastos, e a sobra é de só R$ 32,50.
- depois: Com R$ 950,00, os gastos são 237,50 + 380 + 300 = R$ 917,50, e sobram só R$ 32,50. O mínimo sai de 7x ÷ 20 ≥ 385: x = 1 100.
- conta conferida: `950-950/4-2*950/5-300` → 32.5

### W17389d1 · C [R$ 980,00] (gab B)
- antes: 980 não sai de conta nenhuma do enunciado; ele só aparece como erro na divisão final 7 700 ÷ 7. Confira pela multiplicação: 7 × 980 = 6 860, e não 7 700. O número que multiplicado por 7 dá 7 700 é 1 100.
- depois: Com R$ 980,00, os gastos são 245 + 392 + 300 = R$ 937,00, e sobram só R$ 43,00. O mínimo sai de 7x ÷ 20 ≥ 385: x = 1 100.
- conta conferida: `980-980/4-2*980/5-300` → 43

### W17389d1 · D [R$ 1500,00] (gab B)
- antes: 1 500 não sai de conta nenhuma. O tropeço mais próximo, ler 2/5 como 1/2, faz os gastos fracionários darem 1/4 + 1/2 = 3/4 do salário; sobra x ÷ 4, e x ÷ 4 ≥ 385 dá x ≥ 1 540, e não 1 500. Com 2/5 o aluguel é 0,4 do salário, não 0,5.
- depois: R$ 1.500,00 atende (sobram R$ 225,00), mas não é o mínimo. De 7x ÷ 20 ≥ 385 sai x ≥ 1 100.
- conta conferida: `1500-1500/4-2*1500/5-300` → 225

### W17389d1 · E [R$ 1000,00] (gab B)
- antes: 1 000 não sai de conta nenhuma: é o número redondo perto de 1 100. Testando: 1 000 ÷ 4 = 250, (1 000 ÷ 5) × 2 = 400, mais 300 de roupas e lazer dá 950 de gastos, e sobram só R$ 50,00, abaixo dos R$ 85,00 exigidos.
- depois: Com R$ 1.000,00, os gastos são 250 + 400 + 300 = R$ 950,00, e sobram só R$ 50,00. O mínimo sai de 7x ÷ 20 ≥ 385: x = 1 100.
- conta conferida: `1000-1000/4-2*1000/5-300` → 50

### W4d1459c · B [10 km] (gab C)
- antes: Provavelmente descontou a bandeirada duas vezes: 19 − 4,60 − 4,60 = 9,80 e depois 9,80 ÷ 0,96 ≈ 10,2, arredondando para 10. A bandeirada é cobrada uma única vez na corrida.
- depois: 10 km custariam 4,60 + 0,96 × 10 = R$ 14,20, e não R$ 19,00. A distância é 14,40 ÷ 0,96 = 15 km.
- conta conferida: `4.60+0.96*10` → 14.2

### W7a7947f · D [2 000] (gab C)
- antes: Provavelmente ignorou os dois trechos e dividiu o volume total pelo tempo total: 6 000 ÷ 3 = 2 000 L/h. Isso é a vazão média do esvaziamento inteiro, que não corresponde a bomba nenhuma.
- depois: 2 000 L/h é a vazão média, 6 000 ÷ 3, e não a da bomba nova. Juntas tiram 5 000 ÷ 2 = 2 500 L/h, e a nova faz 2 500 − 1 000 = 1 500.
- conta conferida: `6000/3` → 2000

### W2ff02ca · D [6] (gab C)
- antes: Provavelmente incluiu o x = 3 na lista (0 + 1 + 2 + 3 = 6), sem testar: |3 − 4| = 1 e 1 ≥ 3 é falso, então o 3 não pertence à solução.
- depois: 6 inclui o 3, que não serve: |3 − 4| = 1 e 1 ≥ 3 é falso. A solução nos naturais é 0, 1 e 2, e 0 + 1 + 2 = 3.
- conta conferida: `sum(x for x in range(0,20) if abs(x-4)>=x)` → 3

### W2b4048d · A [10] (gab B)
- antes: Provavelmente subtraiu o 1 duas vezes no último passo: 3 × 4 = 12, depois 12 − 1 = 11 e 11 − 1 = 10. A regra f(x) = 3x − 1 tira um 1, uma única vez.
- depois: 10 não confere: f(1) = 2, g(2) = 4 e f(4) = 3 × 4 − 1 = 11.
- conta conferida: `3*(3*1-1)**2-1` → 11

### W2b4048d · E [14] (gab B)
- antes: Provavelmente somou de volta o 2 que tinha saído de f(1): 3 × 4 = 12 e 12 + 2 = 14. Na composição, cada resultado substitui o anterior; o 2 já foi usado quando virou g(2) = 4 e não entra de novo.
- depois: 14 não confere: f(1) = 2, g(2) = 4 e f(4) = 3 × 4 − 1 = 11.
- conta conferida: `3*(3*1-1)**2-1` → 11

### Wc4ac330 · A [inteiras] (gab E) ✔
- antes: Provavelmente compôs na ordem trocada e resolveu g(f(x)) = 0, ou seja, (2x + 1)² − 1 = 0, cujas raízes são 0 e −1, ambas inteiras. Outro caminho que leva a 'inteiras' é resolver g(x) = 0 sozinha, que dá 1 e −1. A equação pedida é a da composta na ordem f(g(x)).
- depois: Inteiras não confere: f(g(x)) = 2(x² − 1) + 1 = 2x² − 1, e 2x² − 1 = 0 dá x = ±√2/2, irracionais e opostas.
- conta conferida: `sqrt(2)/2` → 0.707107

### Wa3499d7 · A [67 anos] (gab D)
- antes: Provavelmente travou no log 3000 e chutou um valor de expectativa de vida que soa razoável. Não existe conta com 250, 844, 16 e log 3 = 0,4 que produza 67. Quem multiplica os logaritmos em vez de somar (0,4 × 3 = 1,2) chega a 250 × 1,2 − 844 = −544, um número sem sentido, e acaba marcando o menor valor da lista.
- depois: 67 não confere: log 3 000 = 0,4 + 3 = 3,4, e T = 16 × (250 × 3,4 − 844) = 16 × 6 = 96 anos.
- conta conferida: `16*(250*3.4-844)` → 96

### W1e3a33a · E [48.000] (gab D)
- antes: Provavelmente somou acréscimos demais: 33 000 + 10 × 1 500 = 48 000, que seria novembro. Acontece com quem conta os saltos no dedo e passa do mês pedido.
- depois: 48 000 = 33 000 + 10 × 1 500 é o valor de novembro. Julho tem 6 acréscimos: 33 000 + 6 × 1 500 = 42 000.
- conta conferida: `33000+10*1500` → 48000

### W3f205a7 · A [quadrilátero] (gab C)
- antes: Quadrilátero tem 4 lados. Provavelmente contou só os quatro cantos mais marcados, os dois de cima e os dois de baixo, e deixou de fora os dois vértices das pontas, o da esquerda e o da direita.
- depois: Quadrilátero tem 4 lados, e a figura tem 6 vértices, logo 6 lados: é um hexágono.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### W3f205a7 · B [pentágono] (gab C)
- antes: Pentágono tem 5 lados. Provavelmente perdeu um vértice na contagem — é o erro de quem conta sem marcar por onde começou e para antes de fechar a volta inteira.
- depois: Pentágono tem 5 lados, e a figura tem 6 vértices, logo 6 lados: é um hexágono.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### W3f205a7 · D [heptágono] (gab C)
- antes: Heptágono tem 7 lados. Provavelmente contou duas vezes a bolinha de partida, uma ao começar a volta e outra ao chegar nela de novo. A bolinha inicial conta uma vez só.
- depois: Heptágono tem 7 lados, e a figura tem 6 vértices, logo 6 lados: é um hexágono.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### W3f205a7 · E [decágono] (gab C)
- antes: Decágono tem 10 lados. Provavelmente chutou pelo nome que soa a 'figura de muitos lados', sem contar: 'deca' é dez, e a figura tem bem menos que isso.
- depois: Decágono tem 10 lados, e a figura tem 6 vértices, logo 6 lados: é um hexágono.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### Wbba1585 · C [Perímetro total de 350 metros; 2.800 metros de fios; custo de R$ 4.200.] (gab D)
- antes: Também não sai de conta nenhuma: 350 − 280 = 70 m para o terceiro lado, e 70 não vem de nenhuma operação com 120 e 160. E há um teste que derruba 350 m e 300 m juntos, sem Pitágoras: a hipotenusa é o maior lado do triângulo, então ela não pode ser menor que os catetos de 120 m e 160 m — o perímetro tem de passar de 120 + 160 + 160 = 440 m.
- depois: 350 m não confere: a hipotenusa é √(120² + 160²) = 200 m, e o perímetro é 120 + 160 + 200 = 480 m.
- conta conferida: `120+160+sqrt(120**2+160**2)` → 480

### Wbeafe0b · A [3,2 m] (gab D)
- antes: Provavelmente usou a diferença entre sombra e altura da árvore, 11,2 − 7,2 = 4,0 m, como se fosse a altura do passarinho mais baixo, e fez 7,2 − 4,0 = 3,2 m. Essa diferença mistura duas grandezas distintas e não significa nada aqui.
- depois: 3,2 m não confere: a distância entre os passarinhos é a das sombras vezes a razão da árvore, 4,2 × 7,2 ÷ 11,2 = 2,7 m.
- conta conferida: `4.2*7.2/11.2` → 2.7

### Wbeafe0b · B [2,2 m] (gab D)
- antes: Provavelmente arredondou a altura encontrada de 4,5 m para 5,0 m antes de subtrair: 7,2 − 5,0 = 2,2 m. O arredondamento no meio do caminho estraga a resposta.
- depois: 2,2 m não confere: a distância entre os passarinhos é a das sombras vezes a razão da árvore, 4,2 × 7,2 ÷ 11,2 = 2,7 m.
- conta conferida: `4.2*7.2/11.2` → 2.7

### Wbeafe0b · C [2,5 m] (gab D)
- antes: Provavelmente arredondou a razão 7,2 ÷ 11,2 para 0,6 e aplicou direto nos 4,2 m: 4,2 × 0,6 = 2,52, que arredonda para 2,5 m. A razão verdadeira é 0,642857..., e usar 0,6 derruba o resultado.
- depois: 2,5 m sai de aproximar a razão 7,2 ÷ 11,2 por 0,6: 4,2 × 0,6 = 2,52. A razão é ≈ 0,643, e 4,2 × 7,2 ÷ 11,2 = 2,7 m.
- conta conferida: `4.2*0.6` → 2.52

### W69b5dd2 · B [3,0 metros.] (gab D)
- antes: Provavelmente dividiu a altura total pela altura já vencida (2,2 ÷ 0,8 = 2,75) e arredondou para 3,0, tratando esse quociente como se fosse uma distância em metros. Esse número diz quantas vezes 0,8 cabe em 2,2, não quantos metros faltam andar.
- depois: 3,0 m não confere: a rampa toda mede 3,2 × 2,2 ÷ 0,8 = 8,8 m, e faltam 8,8 − 3,2 = 5,6 m.
- conta conferida: `3.2*2.2/0.8-3.2` → 5.6

### Wbc19c08 · C [30] (gab A)
- antes: Provavelmente arredondou a razão do poste de 5 ÷ 3 ≈ 1,67 para 2 e multiplicou: 15 × 2 = 30 m. O arredondamento inflou a altura; a fração 5/3 precisa ser usada inteira.
- depois: 30 m daria razão 30 ÷ 15 = 2, e a do poste é 5 ÷ 3 ≈ 1,67. A altura é 15 × 5 ÷ 3 = 25 m.
- conta conferida: `15*5/3` → 25

### W8e1567d · B [12,65] (gab D)
- antes: Também não sai de conta nenhuma: 12,65 m exigiria um trecho visado de 11 m, ou seja, tangente 11 ÷ 22,52 = 0,489, que é a tangente de cerca de 26°. Trocar a tangente pelo seno também não leva até aqui: daria 22,52 ÷ 2 = 11,26 e 11,26 + 1,65 = 12,91 m, que não está na lista. O seno usa a hipotenusa, que o enunciado não dá; quem liga os dois catetos é a tangente.
- depois: 12,65 m não confere: o trecho acima do teodolito é (√3 ÷ 3) × 13√3 = 13 m exatos, e 13 + 1,65 = 14,65 m.
- conta conferida: `math.tan(pi/6)*13*sqrt(3)+1.65` → 14.65

### Wd0f30e2 · A [2] (gab C)
- antes: Provavelmente esqueceu um zero e usou 18 no lugar de 180: 0,105 × 18 = 1,89, que arredonda para 2. A equivalência é com 180°, que é meia volta.
- depois: 2° não confere: 0,105 × 180 ÷ π ≈ 18,9 ÷ 3,14 ≈ 6,0°.
- conta conferida: `0.105*180/pi` → 6.01606

### Wd0f30e2 · D [8] (gab C)
- antes: Também não sai de conta nenhuma: para o ângulo dar 8°, o divisor teria de ser 18,9 ÷ 8 = 2,36, e o divisor é π = 3,14. Com o valor certo, 18,9 ÷ 3,14 = 6,02°.
- depois: 8° não confere: 0,105 × 180 ÷ π ≈ 18,9 ÷ 3,14 ≈ 6,0°.
- conta conferida: `0.105*180/pi` → 6.01606

### Wd0f30e2 · E [10] (gab C)
- antes: Provavelmente multiplicou por 100 em vez de usar 180 ÷ π: 0,105 × 100 = 10,5, que arredonda para 10. A conversão não é feita com 100; ela depende de 180 e de π.
- depois: 10° não confere: 0,105 × 180 ÷ π ≈ 18,9 ÷ 3,14 ≈ 6,0°.
- conta conferida: `0.105*180/pi` → 6.01606

### W9b31ac9 · A [π/3] (gab D)
- antes: Provavelmente tirou o arco côngruo da parte decimal pelo número errado: de 7 344 ÷ 360 = 20,4, multiplicar 0,4 por 300 dá 120°, que reduzido ao 1.º quadrante vira 180° − 120° = 60°, ou seja, π/3. A parte decimal tem de ser multiplicada por 360, não por 300: 0,4 × 360 = 144°, e a redução dá 36°.
- depois: π/3 = 60° não confere: 7 344 − 20 × 360 = 144°, e a redução ao 1.º quadrante dá 180° − 144° = 36° = π/5.
- conta conferida: `180-(7344-20*360)` → 36

### W9b31ac9 · B [π/2] (gab D)
- antes: Provavelmente parou na fronteira do quadrante: viu que 144° fica entre 90° e 180° e respondeu os próprios 90° (π/2), que é a linha que separa o 1.º do 2.º quadrante. O que a questão pede é a redução, 180° − 144°.
- depois: π/2 = 90° não confere: 7 344 − 20 × 360 = 144°, e a redução ao 1.º quadrante dá 180° − 144° = 36° = π/5.
- conta conferida: `180-(7344-20*360)` → 36

### W9b31ac9 · C [2π/3] (gab D)
- antes: Provavelmente multiplicou a parte decimal da divisão pelo número errado: de 7344 ÷ 360 = 20,4, usou 0,4 × 300 = 120° como arco côngruo, e 120° em radianos é 2π/3. O certo é 0,4 × 360 = 144°, e depois ainda falta reduzir ao 1.º quadrante.
- depois: 2π/3 = 120° não confere: 7 344 − 20 × 360 = 144°, e a redução ao 1.º quadrante dá 180° − 144° = 36° = π/5.
- conta conferida: `180-(7344-20*360)` → 36

### Wf0a570d · B [1/6] (gab C)
- antes: Provavelmente listou as combinações sem olhar a ordem: {1,1}, {1,3}, {1,5}, {3,3}, {3,5} e {5,5}, achando 6 possibilidades, com apenas {3,5} servindo, o que dá 1/6. Com dois dados, (3,5) e (5,3) são resultados distintos, então as possibilidades são 9 e os casos favoráveis são 2.
- depois: 1/6 não confere: com os dois dados ímpares há 3 × 3 = 9 pares ordenados, e só (3, 5) e (5, 3) somam 8: 2/9.
- conta conferida: `sum(1 for a in (1,3,5) for b in (1,3,5) if a+b==8)/9` → 0.222222

### Wf0a570d · E [2/18] (gab C)
- antes: Provavelmente montou o espaço amostral com 18 resultados, misturando um dado completo de 6 faces com um dado restrito a 3 ímpares (6 × 3 = 18). A restrição vale para os dois dados ao mesmo tempo, o que dá 3 × 3 = 9.
- depois: 2/18 não confere: com os dois dados ímpares há 3 × 3 = 9 pares ordenados, e só (3, 5) e (5, 3) somam 8: 2/9.
- conta conferida: `2/9` → 0.222222

### W4121a4c · A [domingo.] (gab C)
- antes: Provavelmente errou o divisor e usou 6 dias em vez de 7: 1 484 ÷ 6 = 247,33, e o dia mais próximo desse valor seria domingo, com 250. O quadro tem sete linhas, então o divisor é 7.
- depois: O domingo (250) está a 38 pães da média, 1 484 ÷ 7 = 212. A terça, com 215, está a só 3.
- conta conferida: `(250+208+215+251+187+187+186)/7` → 212

### W264c89e · C [Pizzaria Y e Alfinetes V.] (gab D)
- antes: Provavelmente calculou as médias de cima para baixo e parou cedo: achou 220 para Alfinetes V e 230 para Pizzaria Y e escolheu essas duas, sem calcular que Chocolates X tem média 225, maior que a de V.
- depois: Alfinetes V tem média 220, abaixo de Chocolates X, com 225. As duas maiores médias são Pizzaria Y (230) e Chocolates X.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### W0830ebd · B [grupo 2] (gab D) ✔
- antes: Provavelmente procurou nas idades em vez da coluna σ e escolheu o grupo por ele conter a idade mais baixa da tabela (19 anos). A idade mínima não diz nada sobre o espalhamento: o grupo 2 vai de 19 a 45 anos, com σ = 10,1, um dos maiores.
- depois: O grupo 2 tem σ = 10,1, um dos maiores da tabela. O mais homogêneo é o de menor σ, o grupo 4, com 3,4.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### W0830ebd · E [grupo 5] (gab D)
- antes: Provavelmente descartou o grupo 4 por ter a maior média da tabela (35,8) e pegou o segundo menor desvio, 6,3. A média não entra no critério: a pergunta é só sobre o quanto as idades se aproximam entre si.
- depois: O grupo 5 tem σ = 6,3, maior que o 3,4 do grupo 4. A média não entra no critério; só o desvio-padrão.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### W45b8280 · B [II] (gab C)
- antes: Provavelmente decidiu pela coluna da moda, imaginando que vence quem faz o menor tempo, e pegou a segunda menor (41) depois de achar a Equipe I rápida demais. A prova é de regularidade, não de velocidade: completar em 41 minutos é ficar 4 minutos longe dos 45 pedidos.
- depois: A Equipe II tem desvio-padrão 4. Como todas têm média 45, vence a de menor desvio, a III, com 1.
- conta conferida: — (afirmação qualitativa/leitura de figura)

### W386e63b · A [59] (gab D)
- antes: Corresponde a contar só 1 região acima da média e 7 abaixo: 1 × 10 + 7 × 7 = 10 + 49 = 59. Quem marcou aqui provavelmente considerou acima da média apenas a região com 300 casos, o maior número da tabela, em vez de comparar cada valor com os 229.
- depois: 59 = 1 × 10 + 7 × 7 põe só uma região acima da média. Com média 1 832 ÷ 8 = 229, são 5 acima: 5 × 10 + 3 × 7 = 71.
- conta conferida: `5*10+3*7` → 71

### W386e63b · C [68] (gab D)
- antes: Corresponde a 4 regiões acima e 4 abaixo: 4 × 10 + 4 × 7 = 40 + 28 = 68. Provavelmente deixou de fora a região com 237 casos, por parecer colada na média; mas 237 é maior que 229 e entra na regra I.
- depois: 68 = 4 × 10 + 4 × 7 põe 4 regiões acima da média. Com média 229, são 5 acima (237, 262, 278, 278 e 300): 5 × 10 + 3 × 7 = 71.
- conta conferida: `(237+262+158+159+160+278+300+278)/8` → 229

### We4f956f · C [192.] (gab B)
- antes: Provavelmente usou 25 como média (o valor do 3.º mês, ou a média arredondada para cima): 12 × 25 = 300 e 300 − 108 = 192. A média de verdade é 120 ÷ 5 = 24, e não 25.
- depois: 192 não confere: a média é 120 ÷ 5 = 24, o estoque desejado é 12 × 24 = 288 e restam 228 − 120 = 108. A compra é 180.
- conta conferida: `12*24-(228-120)` → 180

### W5ac5c10 · D [(−1 ÷ 2) − (2i ÷ 3)] (gab B)
- antes: Não sai de conta nenhuma. É a alternativa C com o sinal da parte imaginária trocado: o 2i ÷ 3 já é a fração 3 ÷ 2 de cabeça para baixo, e o sinal de menos não tem de onde vir. Multiplicar em cima e embaixo por qualquer número, mesmo um conjugado errado, não muda o valor da fração.
- depois: (−1 ÷ 2) − (2i ÷ 3) não confere: (1 + 2i)(1 + i) ÷ 2 = (−1 + 3i) ÷ 2, com parte imaginária +3/2.
- conta conferida: `(1+2j)/(1-1j)` → (-0.5+1.5j)

### W5ac5c10 · E [(1 − 3i) ÷ 2] (gab B)
- antes: Não sai de conta nenhuma. É a alternativa A com o sinal da parte imaginária trocado. Usar (1 − i) no lugar do conjugado também não leva a ela: dá (1 + 2i)(1 − i) = 1 − i + 2i − 2i² = 3 + i em cima e (1 − i)(1 − i) = 1 − 2i + i² = −2i embaixo, e o i continua no denominador; multiplicar em cima e embaixo pelo mesmo número nunca muda o valor da fração.
- depois: (1 − 3i) ÷ 2 não confere: (1 + 2i)(1 + i) ÷ 2 = (−1 + 3i) ÷ 2, com parte real −1/2 e imaginária +3/2.
- conta conferida: `(1+2j)/(1-1j)` → (-0.5+1.5j)
