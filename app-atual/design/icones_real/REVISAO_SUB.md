# Revisão independente: 255 ícones de conteúdo (sub/)

Revisor: outra lente, professor exigente de Biologia, Química, Matemática e Português. Revisão feita em 29/10/2026.

## Como revisei

- Montei folhas próprias para cada um dos 53 módulos. Cada ícone aparece a 170 px e a 64 px, com o nome do conteúdo (dados_util `nomesub`) e o `por_que` do mapa_<m>.json ao lado. Também fiz uma grade só a 64 px por matéria, para julgar a legibilidade no tamanho real.
- Ampliei para 480 px tudo o que tem conteúdo verificável e conferi item por item:
  - **Moléculas:** contagem de átomos e ligações em ATP, glicose → 2 piruvatos, HCN, etanol, propeno, 2-metilbutano, paracetamol, glicil-alanina, dímero do ácido acético, CHFClBr com espelho e polietileno.
  - **Química:** elétrons do Na (2-8-1), NaCl alternado, pizza da glicose, H₂:O₂ 2:1 na eletrólise, posição do anel de NH₄Cl, pilha de Daniell (1,10 V e polaridade).
  - **Matemática:** y = 2x+1, 2^x × log₂x, |x|, raízes da cúbica, z e iz, matriz aumentada (x=1, y=2, z=3 confere), área 11 por coordenadas, alavanca 3·1 = 1·3, média 4, soroban 30725, Pitágoras 9+16 = 25, proporção 1:2:3 das provetas (medida em pixels, cerca de 1 : 1,95 : 2,9).
  - **Biologia:** ordem G1→S→G2→M, tétrade com permuta, X submetacêntrico e Y acrocêntrico, Na⁺ saindo e K⁺ entrando, xilema interno e floema externo, adeno e neuro-hipófise, cornos da medula, mapa dos biomas, Hardy-Weinberg 0,36/0,24/0,16.
  - **Português:** obras citadas no mapa ('O espelho', 'Vaso grego', 'O ovo e a galinha', Vidas Secas, Os Sertões).
- Itens verificados e **sem problema** não entram na tabela.

## Tabela de problemas

Gravidade: **P1** = erro de conteúdo ou objeto que sugere outra coisa · **P2** = feio, ilegível a 64 px, parece marca ou repete outro ícone do módulo.
Todos os prints estão em `rev_sub/<id>.png`, com o ícone a 160 px e a 64 px.

| id | O que está errado | Grav. | Sugestão concreta |
|---|---|---|---|
| Q05.3 | A "pisseta" é um frasco com uma mangueira longa que mergulha dentro do béquer. Lê-se como sifão ou transferência de gás. Pisseta de verdade tem bico curto e curvo, e o jato cai por cima do líquido. A mangueira ainda tem uma emenda visível no meio. | **P1** | Desenhar uma pisseta de plástico (frasco macio, tampa com bico curto em gancho) inclinada sobre o béquer, com o filete de água caindo **por cima** da superfície. |
| Q12.3 | O "polietileno" é na verdade um octano fechado (CH₃ nas duas pontas). Não há sinal de cadeia que continua, ao contrário do que diz o mapa. A 64 px fica idêntico aos alcanos de Q11.5. | **P1** | Cortar as pontas com ligações soltas (tracejadas ou esmaecidas), ou envolver uma unidade –CH₂–CH₂– em colchetes com "n". Alternativa realista: sacolinha ou filme de PE com o trecho da cadeia em destaque. |
| B07.3 | Pulmões simétricos: falta a incisura cardíaca no esquerdo e a diferença de 3 lobos × 2 lobos. Os brônquios que o mapa promete não aparecem (só há traqueia). É muito pálido a 64 px e tem manchas amarelas soltas em volta (sobras do recorte das costelas). | **P1** | Usar pulmões em que o esquerdo seja menor e tenha a incisura cardíaca, com as fissuras visíveis e a árvore brônquica entrando pelos hilos. Aumentar a saturação do rosa e remover as manchas soltas. |
| B03.4 | O pote de iogurte parece caixa ou caixinha de leite. A 64 px só o vinho se reconhece, e a fermentação láctica some. | P2 | Trocar por um pote de iogurte típico (copo baixo, com tampa de alumínio meio aberta e colher), ou por um copo de iogurte com o conteúdo branco visível. |
| B08.4 | O hipotálamo é uma laje plana em cima de um talo. A 64 px o conjunto parece cogumelo ou mesa. | P2 | Desenhar o hipotálamo como parte de um corte sagital do encéfalo (contorno do diencéfalo), com a hipófise pendurada na sela turca. Ou aproximar o enquadramento só na hipófise. |
| B10.2 | Os halos amarelos estão em volta das colônias. Halo de inibição se forma em volta do disco de antibiótico, então a imagem é ambígua para "resistência bacteriana". | P2 | Montar um antibiograma: placa coberta de bactérias, 3 ou 4 discos brancos, halos claros em volta de alguns e um disco sem halo (cepa resistente). A cápsula pode ficar. |
| B10.3 | O *Trypanosoma* tem o tamanho do barbeiro, o que dá uma escala enganosa: o protozoário parece um verme. A 64 px o conjunto vira uma mancha marrom. | P2 | Pôr o tripanossomo num círculo de zoom (lupa) ao lado do inseto, ou ficar só com o barbeiro, bem grande e com o conexivo listrado laranja e preto que o identifica. |
| B10.5 | Mãos quase brancas sobre fundo claro: ilegível a 64 px. | P2 | Escurecer o tom de pele e o contorno, dar mais volume à espuma e à água e enquadrar mais fechado. |
| B11.2 | A 64 px o ícone é um bloco preto com uma mancha branca, e as mariposas escuras somem. | P2 | Mostrar dois troncos lado a lado (claro com mariposa escura visível e escuro com mariposa clara visível), ou aumentar as mariposas e clarear um pouco o tronco. |
| B04.3 (+B04.4) | Repetição no módulo: B04.3 e B04.4 são fileiras de bastões cromossômicos listrados quase iguais a 64 px. Em B04.3, as cromátides-irmãs não estão unidas no centrômero. | P2 | B04.3: tétrade com as 4 cromátides presas pelos centrômeros e um quiasma em X bem visível. B04.4: cariótipo em grade com o trio do 21 destacado em cor. |
| Q01.2 | Três átomos minúsculos numa faixa estreita: ilegível a 64 px. | P2 | Empilhar os três isótopos na vertical ou em diagonal, ocupando o quadro, com núcleos maiores. |
| Q03.3 | Tubo de ensaio fino e pálido que ocupa 1/6 da largura: ilegível a 64 px. | P2 | Inclinar o tubo a 30° e engrossá-lo, ou colocar dois tubos (KI incolor + Pb(NO₃)₂ → amarelo) com conta-gotas. |
| Q04.4 | O funil é um cilindro de vidro com placa (funil de placa porosa), e não um Büchner de porcelana. O conjunto todo é pálido. | P2 | Funil de Büchner branco, de porcelana, largo e baixo, com papel de filtro e sólido sobre ele, encaixado numa rolha no kitassato, com mangueira de vácuo na saída lateral. |
| Q05.1 | Proveta fina com densímetro quase invisível a 64 px. | P2 | Enquadrar mais fechado: proveta larga, densímetro grande com escala e lastro visíveis, e líquido mais saturado. |
| Q05.2 (+Q05.3, Q05.5) | Repetição no módulo: três béqueres azul-claros iguais. | P2 | Q05.2: balão volumétrico com o menisco na marca (é o preparo de solução clássico). Assim só um ícone continua sendo béquer. |
| Q09.3 | Fita de zinco cinza sobre prego cinza: fica invisível e o ícone lê-se só como "dois pregos". | P2 | Usar um bloco ou tira de magnésio/zinco com tom claramente diferente (branco-azulado), preso ao prego ou ao casco de um navio, com o prego protegido brilhante. |
| Q11.1 (+Q11.2, Q11.3, Q11.5) | Repetição no módulo: quatro bolas-e-varetas cinza quase iguais a 64 px. Q11.5 (duas cadeias finas) é ilegível. | P2 | Variar o objeto: Q11.2 com um produto real (gás de cozinha ou isqueiro com propano/butano), Q11.5 com as duas fórmulas em blocos coloridos lado a lado. Manter bola-e-vareta só onde a molécula é o assunto (Q11.1, Q11.3). |
| M06.2 (+M06.1, M06.5) | Repetição no módulo: M06.1 (1-2-4-8 no tabuleiro) e M06.2 (1-2-4-8 células) mostram exatamente a mesma sequência, e M06.5 é a mesma ideia invertida. | P2 | M06.2 (equação exponencial): balança equilibrando 2ˣ = 8 com blocos de potência, ou cultura de bactérias numa placa com contagem por hora. |
| M12.2 (+M12.1, M12.4, M12.5) | Repetição no módulo: 4 dos 5 ícones são folha quadriculada com alfinete ou lápis. M12.2 é pálido e ilegível a 64 px. | P2 | M12.2: rampa ou telhado com a inclinação marcada (coeficiente angular). M12.1: mapa com dois pinos e régua. Manter a folha quadriculada só em M12.4 e M12.5. |
| M08.3 | Compasso fino sobre folha branca: muito pálido a 64 px. | P2 | Aumentar o compasso, escurecer o traço da circunferência e dar cor ao raio. Ou usar um objeto circular real (prato ou roda) com o raio marcado. |
| P01.2 | A parte submersa do iceberg está dentro de um cilindro de água (parece pote de vidro) e a massa submersa não tem contraste. | P2 | Corte de oceano em faixa larga e sem bordas laterais, com a linha d'água bem marcada e a massa submersa mais clara que a água escura. |
| P07.4 | Blocos com pinos 2×2 e 2×3 em vermelho, azul e amarelo primários: é o trade dress da LEGO. | P2 | Trocar por blocos de madeira com encaixe macho-fêmea, ou por peças de quebra-cabeça com prefixo, radical e sufixo, sem pinos redondos. |
| P10.2 | Partitura cinza-clara com batuta fina: ilegível a 64 px. | P2 | Fechar o enquadramento na mão do maestro com a batuta, ou mostrar estante com partitura em contraste forte e as notas maiores. |

## Contagem

- **P1: 3** (Q05.3, Q12.3, B07.3)
- **P2: 20**
- Total de ícones com apontamento: 23 de 255 (os grupos de repetição contam uma vez, pelo id da linha).

## Observações fora da tabela (não contam)

- **Repetição entre módulos de matérias diferentes:** P02.4 e Q04.5 usam a mesma balança de dois pratos. Também se repetem tabuleiro de xadrez (M06.1, M17.1, P10.3), bonecas russas (M07.2, P09.2), cadeado (M13.1, P10.1), saleiro (B02.1, Q10.1), globo terrestre (B09.3, P12.5) e cloroplasto (B01.5, B03.5). Cada módulo está consistente por dentro, mas no app inteiro o aluno vai ver o mesmo objeto em dois lugares.
- **Marcas:** M13.3 (bolas brancas com números verdes, C(60,6)) lembra o sorteio da Mega-Sena, mas não tem logotipo, então deixei fora. Q07.3 (botijão azul) é genérico.
- **Conferidos e corretos, para registro:** B01.2, B02.5, B03.1, B04.1, B05.4 (GAG→GTG), B06.5, B08.3, B09.6, B11.4, B12.3, Q01.3, Q01.4, Q02.1, Q02.2, Q06.3, Q08.4, Q09.1, Q09.2, Q11.1–Q11.7 (estruturas), Q12.4, M01.1–M01.4, M02.4, M02.5, M03.1, M05.1, M05.4, M05.5, M07.3, M08.5, M09.1, M09.3, M09.4, M10.3, M12.1, M12.5, M14.1, M14.4, M15.3, M16.1, M16.2, M17.2.
