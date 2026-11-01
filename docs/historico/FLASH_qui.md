# Flashcards de Química (qui) — 29/10

158 cartões em D['flash'] (qui-f001 a qui-f158). Peso 3: 77; peso 2: 78; peso 1: 3.
Cópias antes da gravação: qui/index.html.bak_flash e qui/dados.json.bak_flash.

## Método
- Base lida antes: D['teoria'] (12 módulos, 116 cartões revisados) e D['nomesub'] (57 conteúdos). Todo cartão usa um 'sub' de nomesub; os 57 conteúdos têm pelo menos 1 cartão.
- Peso por cobrança: contagem das 571 questões do banco por módulo e por conteúdo (abaixo) e o campo 'conceito' de cada questão, para escolher o recorte que a banca usa (ex.: Le Chatelier, Hess, pH, isomeria óptica, limitante, Faraday).
- Equações: 26 equações conferidas por script (contagem de átomos e de carga por elemento, inclusive semirreação com e⁻ e coeficiente ½). Todas fecham.
- Nomes e fórmulas orgânicas: RDKit 2026.03.6 (fórmula molecular, massa, centros quirais, estereoisômeros cis-trans, ozonólise por SMARTS). Conferidos: 2-metilpentano (C₆H₁₄), 2-bromopropano, etanol × metoximetano (C₂H₆O), ácido lático (1 C quiral), but-1-eno sem cis-trans e but-2-eno com 2, 2-metilbut-2-eno → propanona + etanal, etanoato de etila (C₄H₈O₂), glicerol, glicose e frutose (C₆H₁₂O₆), monômeros dos polímeros, classes de carbono do metilpropano, e o ácido tartárico (3 estereoisômeros, não 4) como contraexemplo da regra 2ⁿ citado no erro comum.
- Contas refeitas por script: nox (S +6/+4/−2; Mn +7; Cr +6), Ca(OH)₂ = 74, limitante (1,33 mol de NH₃), 14,6 g de NaCl, 0,05 mol de Cu, 330/300 = 1,1, Graham √16 = 4, pH 11, Hess −111 kJ, energia de ligação −185 kJ, Daniell 1,10 V, 1/8 após 3 meias-vidas, U-238 − α = Th-234.
- Fontes de conferência: os próprios cartões de teoria já revisados (REV_CARTOES_qui_mat.md, que inclui a conferência IUPAC 2013 da cadeia principal), estruturas dos nomes conferidas por RDKit, PE do H₂S ≈ −60 °C (WebElements, https://webelements.co.uk/compounds/hydrogen/hydrogen_sulphide.html), meia-vida do ¹⁴C ≈ 5 730 anos (valor de Cambridge, usado na teoria). Ordem de PE ácido > álcool > cetona > éter conferida com valores tabelados de massas próximas (ácido acético 118 °C, propan-1-ol 97 °C, propanona 56 °C, metoxietano 7 °C); hidrocarboneto ficou fora da ordem porque éter dietílico (35 °C) e pentano (36 °C) quase empatam.

## Segunda passada (erro factual, ambiguidade, 'essencial')
- Ordem de ebulição: tirei 'hidrocarboneto' da sequência (par éter dietílico/pentano empata) para não haver resposta dupla.
- Lei de Hess: frente reescrita para caber em 25 palavras sem perder os dados.
- Removidos 3 cartões redundantes (% de C na glicose, racêmico × enantiômero, nome de éster já coberto pela esterificação) para ficar em 158.
- 'aceita': retirei 'plasmoptise' (termo usado para célula vegetal) e corrigi 'regra de Le Bel-Van't Hoff'.
- Cada 'essencial' tem de 1 a 4 itens e pede só o núcleo da resposta; exemplos e justificativas ficam no verso, não são exigidos.

## Distribuição (cartões × questões do banco)
| módulo | cartões | questões |
|---|---|---|
| Q01 Átomo e tabela periódica | 11 | 41 |
| Q02 Ligações e forças entre moléculas | 13 | 49 |
| Q03 Funções inorgânicas e nox | 14 | 47 |
| Q04 Mol e estequiometria | 13 | 55 |
| Q05 Soluções e concentração | 12 | 44 |
| Q06 Gases | 8 | 29 |
| Q07 Termoquímica | 11 | 39 |
| Q08 Cinética, equilíbrio e pH | 21 | 78 |
| Q09 Pilhas, eletrólise e radioatividade | 15 | 56 |
| Q10 Propriedades coligativas | 6 | 16 |
| Q11 Orgânica: estrutura e isomeria | 18 | 63 |
| Q12 Orgânica: reações, polímeros e ambiente | 16 | 54 |

## Cartões

### qui-f001 · Q01.1 (modelos atômicos e partículas subatômicas) · identificar · peso 2
- Frente: Qual modelo atômico explica a cor emitida nos fogos de artifício e no teste de chama?
- Verso: Modelo de Bohr: o elétron absorve energia e sobe de nível; ao voltar a um nível mais interno, emite luz de energia definida, que dá a cor.
- Essencial: modelo de Bohr | elétron volta de nível e emite luz (energia)
- Aceita: Rutherford-Bohr | níveis de energia quantizados | salto do elétron entre camadas | emite fóton
- Erro comum: Responder Rutherford: o modelo dele tem núcleo e eletrosfera, mas não tem níveis de energia fixos.

### qui-f002 · Q01.1 (modelos atômicos e partículas subatômicas) · processo · peso 1
- Frente: Que conclusão Rutherford tirou ao bombardear uma folha fina de ouro com partículas alfa?
- Verso: O átomo é quase todo espaço vazio, com um núcleo pequeno, denso e positivo; os elétrons ficam ao redor, na eletrosfera.
- Essencial: núcleo pequeno, denso e positivo | átomo com grande espaço vazio
- Aceita: átomo nuclear | núcleo + eletrosfera | a maioria das partículas atravessou porque o átomo é vazio
- Erro comum: Dizer que Rutherford descobriu o nêutron: o nêutron é de Chadwick (1932).

### qui-f003 · Q01.2 (número atômico, número de massa, isótopos, isóbaros e íons) · formula · peso 3
- Frente: Como calcular o número de nêutrons a partir do número atômico (Z) e do número de massa (A)?
- Verso: N = A − Z. Ex.: cloro-37 (Z = 17) tem 37 − 17 = 20 nêutrons.
- Essencial: N = A − Z
- Aceita: nêutrons = número de massa − número atômico | nêutrons = A menos prótons | n = A − Z
- Erro comum: Usar a massa atômica média da tabela (com casas decimais) como se fosse A, que é inteiro e vale para um isótopo.

### qui-f004 · Q01.2 (número atômico, número de massa, isótopos, isóbaros e íons) · exemplo · peso 3
- Frente: Quantos prótons e quantos elétrons tem o íon Fe³⁺ (Z = 26)?
- Verso: 26 prótons e 23 elétrons: o cátion perdeu 3 elétrons; os prótons não mudam.
- Essencial: 26 prótons | 23 elétrons
- Aceita: 26 p e 23 e⁻ | vinte e seis prótons e vinte e três elétrons
- Erro comum: Tirar prótons ou somar a carga positiva aos elétrons (29): cátion perde elétrons.

### qui-f005 · Q01.2 (número atômico, número de massa, isótopos, isóbaros e íons) · comparar · peso 2
- Frente: Isótopos, isóbaros e isótonos: o que cada grupo tem em comum?
- Verso: Isótopos: mesmo número atômico (Z). Isóbaros: mesmo número de massa (A). Isótonos: mesmo número de nêutrons (N).
- Essencial: isótopos: mesmo Z (prótons) | isóbaros: mesmo A (massa) | isótonos: mesmo N (nêutrons)
- Aceita: mesmo número de prótons = mesmo Z | mesmo número de massa = mesmo A
- Erro comum: Achar que isóbaros são o mesmo elemento: só os isótopos são o mesmo elemento.

### qui-f006 · Q01.3 (distribuição eletrônica, camadas e subníveis) · processo · peso 2
- Frente: Qual a distribuição eletrônica do ferro (Z = 26) em ordem de energia, pelo diagrama de Pauling?
- Verso: 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶. Subnível mais energético: 3d⁶; camada de valência: a 4ª (4s²).
- Essencial: 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶
- Aceita: [Ar] 4s² 3d⁶ | 1s2 2s2 2p6 3s2 3p6 4s2 3d6 | por camadas: K2 L8 M14 N2
- Erro comum: Encher o 3d antes do 4s, ou dizer que a camada de valência é a 3ª por causa do 3d.

### qui-f007 · Q01.4 (tabela periódica: períodos, famílias e localização do elemento) · processo · peso 3
- Frente: Como achar o período e a família de um elemento representativo pela distribuição eletrônica?
- Verso: Período = número de camadas ocupadas. Família = número de elétrons na camada de valência (grupos 13 a 18: some 10).
- Essencial: período = número de camadas | família = elétrons da camada de valência
- Aceita: período = camada mais externa | grupo A = elétrons de valência | nível mais alto = período
- Erro comum: Usar o subnível mais energético em vez da camada mais externa para definir o período.

### qui-f008 · Q01.4 (tabela periódica: períodos, famílias e localização do elemento) · conceito · peso 2
- Frente: Que nome recebem as famílias dos grupos 1, 2, 16, 17 e 18?
- Verso: 1: metais alcalinos; 2: metais alcalinoterrosos; 16: calcogênios; 17: halogênios; 18: gases nobres.
- Essencial: 1 alcalinos | 2 alcalinoterrosos | 16 calcogênios | 17 halogênios e 18 gases nobres
- Aceita: 1A, 2A, 6A, 7A, 8A (ou 0) | alcalino-terrosos
- Erro comum: Pôr o hidrogênio entre os metais alcalinos: ele fica no grupo 1, mas não é metal alcalino.

### qui-f009 · Q01.5 (propriedades periódicas) · comparar · peso 3
- Frente: Como variam o raio atômico e a energia de ionização na tabela periódica?
- Verso: Raio aumenta descendo a família e para a esquerda no período. Energia de ionização aumenta no sentido oposto: para cima e para a direita.
- Essencial: raio: aumenta para baixo e para a esquerda | energia de ionização: aumenta para cima e para a direita
- Aceita: raio e energia de ionização variam em sentidos opostos | eletronegatividade acompanha a energia de ionização
- Erro comum: Achar que o raio cresce para a direita no período: mais prótons, mesma camada, raio menor.

### qui-f010 · Q01.5 (propriedades periódicas) · comparar · peso 2
- Frente: Ordene pelo raio, do maior para o menor, os íons isoeletrônicos O²⁻, F⁻, Na⁺ e Mg²⁺.
- Verso: O²⁻ > F⁻ > Na⁺ > Mg²⁺: todos têm 10 elétrons, e quanto mais prótons, mais o núcleo atrai e menor o raio.
- Essencial: O²⁻ > F⁻ > Na⁺ > Mg²⁺ | mais prótons, menor raio
- Aceita: Mg²⁺ < Na⁺ < F⁻ < O²⁻
- Erro comum: Ordenar pela massa ou pelo número atômico sem perceber que o número de elétrons é igual.

### qui-f011 · Q01.5 (propriedades periódicas) · comparar · peso 2
- Frente: Qual a diferença entre energia de ionização e eletronegatividade?
- Verso: Energia de ionização: energia para arrancar um elétron do átomo isolado, no estado gasoso. Eletronegatividade: tendência de atrair os elétrons de uma ligação.
- Essencial: energia de ionização: energia para retirar elétron do átomo isolado (gasoso) | eletronegatividade: atração dos elétrons numa ligação
- Aceita: potencial de ionização | capacidade de puxar o par compartilhado
- Erro comum: Trocar as definições, ou confundir eletronegatividade com afinidade eletrônica (energia liberada ao ganhar elétron).

### qui-f012 · Q02.1 (ligação iônica: formação, fórmula e propriedades do composto) · formula · peso 3
- Frente: Qual a fórmula do composto iônico formado por Al³⁺ e O²⁻?
- Verso: Al₂O₃: cruzam-se as cargas, e a carga de cada íon vira o índice do outro.
- Essencial: Al₂O₃
- Aceita: Al2O3 | óxido de alumínio | alumina
- Erro comum: Escrever AlO ou Al₃O₂: o índice do Al vem da carga do O, e vice-versa.

### qui-f013 · Q02.1 (ligação iônica: formação, fórmula e propriedades do composto) · conceito · peso 2
- Frente: Por que o NaCl sólido não conduz corrente elétrica, mas fundido ou dissolvido em água conduz?
- Verso: No sólido os íons estão presos no retículo cristalino; fundido ou em solução, os íons ficam livres para se mover e transportar carga.
- Essencial: no sólido os íons estão fixos | fundido ou dissolvido, íons livres (móveis)
- Aceita: íons com mobilidade | dissociação iônica libera os íons
- Erro comum: Explicar por elétrons livres, que é o mecanismo dos metais, não dos compostos iônicos.

### qui-f014 · Q02.2 (ligação covalente, fórmula eletrônica e estrutural) · conceito · peso 2
- Frente: Quantas ligações covalentes comuns costumam fazer H, O, N e C?
- Verso: H: 1; O: 2; N: 3; C: 4 (para completar o octeto; o H fica com 2 elétrons).
- Essencial: H 1 | O 2 | N 3 | C 4
- Aceita: hidrogênio monovalente, oxigênio bivalente, nitrogênio trivalente, carbono tetravalente
- Erro comum: Dar ao nitrogênio 5 ligações por ter 5 elétrons de valência: ele compartilha 3 e fica com um par livre.

### qui-f015 · Q02.2 (ligação covalente, fórmula eletrônica e estrutural) · comparar · peso 2
- Frente: Quantas ligações sigma (σ) e pi (π) há numa ligação simples, numa dupla e numa tripla?
- Verso: Simples: 1 σ. Dupla: 1 σ e 1 π. Tripla: 1 σ e 2 π.
- Essencial: simples: 1 sigma | dupla: 1 sigma + 1 pi | tripla: 1 sigma + 2 pi
- Aceita: σ e π | sigma e pi
- Erro comum: Dizer que a dupla tem 2 ligações π: toda ligação múltipla tem exatamente uma σ.

### qui-f016 · Q02.3 (geometria molecular e polaridade da molécula) · identificar · peso 3
- Frente: Qual a geometria da molécula de NH₃ e por quê?
- Verso: Piramidal: o nitrogênio tem 3 pares ligantes e 1 par isolado (4 nuvens); o par isolado não entra no nome da geometria.
- Essencial: piramidal | par de elétrons isolado no N
- Aceita: pirâmide trigonal | piramidal trigonal | par não ligante
- Erro comum: Responder tetraédrica: esse é o arranjo das nuvens, não a geometria da molécula.

### qui-f017 · Q02.3 (geometria molecular e polaridade da molécula) · comparar · peso 3
- Frente: Por que o CO₂ é apolar e a H₂O é polar, se as duas têm ligações polares?
- Verso: CO₂ é linear, e os dipolos das duas ligações se cancelam. H₂O é angular (dois pares isolados no O), e os dipolos não se cancelam.
- Essencial: CO₂ linear: dipolos se cancelam | H₂O angular: dipolos não se cancelam
- Aceita: vetor momento dipolar resultante nulo no CO₂ | geometria simétrica × assimétrica
- Erro comum: Decidir a polaridade da molécula só pela polaridade das ligações, sem olhar a geometria.

### qui-f018 · Q02.3 (geometria molecular e polaridade da molécula) · identificar · peso 2
- Frente: Qual a geometria do CH₄, do BF₃ e do CO₂?
- Verso: CH₄: tetraédrica (109,5°). BF₃: trigonal plana (120°). CO₂: linear (180°).
- Essencial: CH₄ tetraédrica | BF₃ trigonal plana | CO₂ linear
- Aceita: triangular plana | trigonal planar
- Erro comum: Dar ao BF₃ geometria piramidal: o boro não tem par isolado, então são só 3 nuvens.

### qui-f019 · Q02.4 (forças intermoleculares e ponto de fusão, ebulição e solubilidade) · conceito · peso 3
- Frente: Qual a condição para haver ligação de hidrogênio entre moléculas?
- Verso: Hidrogênio ligado diretamente a F, O ou N, atraído pelo par de elétrons de um F, O ou N de outra molécula.
- Essencial: H ligado diretamente a F, O ou N
- Aceita: ponte de hidrogênio | H–F, H–O ou H–N
- Erro comum: Achar que basta haver oxigênio: no éter dimetílico todo H está ligado a carbono, e não há ligação de H entre as moléculas.

### qui-f020 · Q02.4 (forças intermoleculares e ponto de fusão, ebulição e solubilidade) · comparar · peso 3
- Frente: Ordene as forças entre moléculas neutras, da mais forte para a mais fraca.
- Verso: Ligação de hidrogênio > dipolo-dipolo (dipolo permanente) > dipolo induzido (forças de London).
- Essencial: ligação de hidrogênio > dipolo-dipolo > dipolo induzido
- Aceita: ponte de H > dipolo permanente > London | forças de Van der Waals de London como a mais fraca
- Erro comum: Pôr dipolo induzido acima de dipolo-dipolo; ele só vence quando as moléculas são muito maiores.

### qui-f021 · Q02.4 (forças intermoleculares e ponto de fusão, ebulição e solubilidade) · exemplo · peso 3
- Frente: Por que a H₂O ferve a 100 °C e o H₂S a cerca de −60 °C, se o H₂S é mais pesado?
- Verso: A água faz ligação de hidrogênio entre suas moléculas; o H₂S faz só dipolo-dipolo, interação mais fraca.
- Essencial: água: ligação de hidrogênio | H₂S: interação mais fraca (dipolo-dipolo)
- Aceita: ponte de hidrogênio na água | o enxofre não forma ligação de H
- Erro comum: Explicar pela massa molar: ela só decide quando o tipo de interação é o mesmo.

### qui-f022 · Q02.4 (forças intermoleculares e ponto de fusão, ebulição e solubilidade) · processo · peso 3
- Frente: Ao comparar pontos de ebulição de substâncias moleculares, o que se olha primeiro e o que desempata?
- Verso: Primeiro o tipo de força intermolecular: mais forte, maior PE. Com o mesmo tipo, maior massa molar e cadeia menos ramificada dão PE maior.
- Essencial: primeiro o tipo de interação intermolecular | desempate: massa molar (e ramificação)
- Aceita: maior superfície de contato, maior PE | mais ramificada, menor PE
- Erro comum: Comparar só a massa molar, ignorando que ligação de hidrogênio pesa mais que massa.

### qui-f023 · Q02.4 (forças intermoleculares e ponto de fusão, ebulição e solubilidade) · conceito · peso 2
- Frente: O que diz a regra 'semelhante dissolve semelhante'?
- Verso: Substância polar se dissolve bem em solvente polar, e apolar em apolar. Ex.: açúcar em água; óleo em hexano, não em água.
- Essencial: polar dissolve polar | apolar dissolve apolar
- Aceita: semelhante dissolve semelhante
- Erro comum: Achar que qualquer composto com oxigênio dissolve em água: cadeia carbônica grande torna a molécula pouco solúvel.

### qui-f024 · Q02.5 (ligação metálica, ligas e propriedades dos materiais) · identificar · peso 2
- Frente: Quais os principais componentes do aço, do bronze e do latão?
- Verso: Aço: ferro e carbono. Bronze: cobre e estanho. Latão: cobre e zinco.
- Essencial: aço: Fe + C | bronze: Cu + Sn | latão: Cu + Zn
- Aceita: Fe e C | Cu e Sn | Cu e Zn
- Erro comum: Trocar bronze e latão: os dois têm cobre; estanho é do bronze, zinco é do latão.

### qui-f025 · Q03.1 (ácidos e bases: definições (Arrhenius, Brønsted, Lewis) e nomenclatura) · comparar · peso 2
- Frente: Como Arrhenius, Brønsted-Lowry e Lewis definem ácido?
- Verso: Arrhenius: em água, libera H⁺ (H₃O⁺). Brønsted-Lowry: doa próton (H⁺). Lewis: recebe par de elétrons.
- Essencial: Arrhenius: libera H⁺ em água | Brønsted: doa H⁺ (próton) | Lewis: recebe par de elétrons
- Aceita: íon hidrônio | doador de próton | aceptor de par eletrônico
- Erro comum: Dizer que ácido de Lewis doa par de elétrons: quem doa o par é a base de Lewis.

### qui-f026 · Q03.1 (ácidos e bases: definições (Arrhenius, Brønsted, Lewis) e nomenclatura) · exemplo · peso 2
- Frente: Quantos hidrogênios ionizáveis tem o H₃PO₃ (ácido fosforoso)?
- Verso: Dois: só os H ligados a oxigênio se ionizam, e no H₃PO₃ um H está ligado direto ao fósforo. É um diácido.
- Essencial: 2 (dois) | só H ligado a O é ionizável
- Aceita: diácido | diprótico
- Erro comum: Contar todos os H da fórmula e responder 3.

### qui-f027 · Q03.1 (ácidos e bases: definições (Arrhenius, Brønsted, Lewis) e nomenclatura) · conceito · peso 3
- Frente: Como se forma o nome do ânion a partir do sufixo do ácido: -ídrico, -ico e -oso?
- Verso: -ídrico vira -eto; -ico vira -ato; -oso vira -ito. Ex.: clorídrico → cloreto; sulfúrico → sulfato; sulfuroso → sulfito.
- Essencial: -ídrico → -eto | -ico → -ato | -oso → -ito
- Aceita: ídrico/eto, ico/ato, oso/ito
- Erro comum: Trocar sulfito (SO₃²⁻, de -oso) com sulfato (SO₄²⁻, de -ico).

### qui-f028 · Q03.2 (sais e óxidos: classificação e nomenclatura) · formula · peso 2
- Frente: Qual a fórmula dos ânions sulfato, sulfito, nitrato, carbonato e fosfato?
- Verso: Sulfato SO₄²⁻; sulfito SO₃²⁻; nitrato NO₃⁻; carbonato CO₃²⁻; fosfato PO₄³⁻.
- Essencial: SO₄²⁻ | SO₃²⁻ | NO₃⁻ | CO₃²⁻ e PO₄³⁻
- Aceita: SO4 2- | SO3 2- | NO3 - | CO3 2- | PO4 3-
- Erro comum: Esquecer a carga ou trocar sulfato por sulfito.

### qui-f029 · Q03.2 (sais e óxidos: classificação e nomenclatura) · comparar · peso 2
- Frente: Classifique os óxidos CO₂, CaO, Al₂O₃ e CO.
- Verso: CO₂: ácido. CaO: básico. Al₂O₃: anfótero. CO: neutro (não reage com água, ácido nem base).
- Essencial: CO₂ ácido | CaO básico | Al₂O₃ anfótero | CO neutro
- Aceita: CO indiferente | anidrido carbônico = óxido ácido
- Erro comum: Classificar o CO como ácido por analogia com o CO₂: o CO é neutro.

### qui-f030 · Q03.3 (reações inorgânicas e balanceamento por tentativa) · formula · peso 2
- Frente: Escreva a neutralização total do Al(OH)₃ com HCl, balanceada.
- Verso: Al(OH)₃ + 3 HCl → AlCl₃ + 3 H₂O. Soma dos coeficientes: 8.
- Essencial: Al(OH)₃ + 3 HCl → AlCl₃ + 3 H₂O
- Aceita: soma dos coeficientes 8 | 1 Al(OH)3 + 3 HCl → 1 AlCl3 + 3 H2O
- Erro comum: Esquecer que o coeficiente 1 entra na soma dos coeficientes.

### qui-f031 · Q03.3 (reações inorgânicas e balanceamento por tentativa) · identificar · peso 2
- Frente: Quando ocorre uma reação de dupla troca em solução aquosa?
- Verso: Quando um produto sai da solução ou fica pouco ionizado: forma precipitado, gás ou água (ou outro eletrólito fraco).
- Essencial: forma precipitado | forma gás | forma água ou substância pouco ionizada
- Aceita: produto insolúvel | produto volátil | eletrólito mais fraco
- Erro comum: Achar que qualquer mistura de dois sais solúveis reage: sem precipitado, gás ou eletrólito fraco, os íons só ficam misturados.

### qui-f032 · Q03.3 (reações inorgânicas e balanceamento por tentativa) · exemplo · peso 2
- Frente: Que gás se libera quando o carbonato de cálcio reage com ácido clorídrico? Escreva a equação balanceada.
- Verso: CO₂. CaCO₃ + 2 HCl → CaCl₂ + H₂O + CO₂ (o H₂CO₃ formado se decompõe).
- Essencial: CO₂ (gás carbônico) | CaCO₃ + 2 HCl → CaCl₂ + H₂O + CO₂
- Aceita: dióxido de carbono | anidrido carbônico
- Erro comum: Escrever H₂ como gás: carbonato com ácido libera CO₂; H₂ sai de metal com ácido.

### qui-f033 · Q03.4 (número de oxidação, oxirredução e balanceamento por oxirredução) · formula · peso 3
- Frente: Qual o nox do enxofre em H₂SO₄, em SO₂ e em H₂S?
- Verso: H₂SO₄: +6. SO₂: +4. H₂S: −2. A soma dos nox é zero na espécie neutra.
- Essencial: H₂SO₄: +6 | SO₂: +4 | H₂S: −2
- Aceita: +6, +4 e −2
- Erro comum: Esquecer de multiplicar o nox do oxigênio pelo número de átomos (4 × −2 = −8 no H₂SO₄).

### qui-f034 · Q03.4 (número de oxidação, oxirredução e balanceamento por oxirredução) · conceito · peso 3
- Frente: O agente oxidante sofre oxidação ou redução?
- Verso: Sofre redução: ganha elétrons e seu nox diminui. É ele que provoca a oxidação da outra espécie.
- Essencial: sofre redução | ganha elétrons (nox diminui)
- Aceita: se reduz | recebe elétrons
- Erro comum: Chamar de oxidante quem oxidou: o nome indica o que ele faz com o outro, não o que sofre.

### qui-f035 · Q03.4 (número de oxidação, oxirredução e balanceamento por oxirredução) · exemplo · peso 2
- Frente: Em Zn + Cu²⁺ → Zn²⁺ + Cu, qual é o agente redutor e o que acontece com ele?
- Verso: O zinco metálico (Zn): oxida de 0 a +2, perdendo 2 elétrons, e com isso reduz o Cu²⁺.
- Essencial: Zn (zinco metálico) | oxida: nox 0 → +2 (perde elétrons)
- Aceita: Zn⁰ | zinco perde 2 e⁻
- Erro comum: Apontar o Cu²⁺, que é o agente oxidante (se reduz de +2 a 0).

### qui-f036 · Q03.4 (número de oxidação, oxirredução e balanceamento por oxirredução) · formula · peso 2
- Frente: Qual o nox do manganês no KMnO₄ e do cromo no K₂Cr₂O₇?
- Verso: Mn: +7 (1 + x − 8 = 0). Cr: +6 (2 + 2x − 14 = 0).
- Essencial: Mn +7 | Cr +6
- Aceita: sete e seis positivos
- Erro comum: No dicromato, esquecer que há dois cromos e achar +12.

### qui-f037 · Q03.5 (substância pura e mistura, alotropia e processos de separação de misturas) · identificar · peso 2
- Frente: Qual método separa líquidos miscíveis de pontos de ebulição diferentes, como as frações do petróleo?
- Verso: Destilação fracionada: numa coluna de fracionamento, cada componente se separa por sua faixa de temperatura de ebulição.
- Essencial: destilação fracionada
- Aceita: fracionamento | coluna de fracionamento
- Erro comum: Responder destilação simples, que separa sólido dissolvido de líquido.

### qui-f038 · Q03.5 (substância pura e mistura, alotropia e processos de separação de misturas) · comparar · peso 1
- Frente: Diferencie substância simples, substância composta e alotropia.
- Verso: Simples: formada por um só elemento (O₂). Composta: dois ou mais elementos (H₂O). Alotropia: um elemento formando substâncias simples diferentes (O₂ e O₃; grafite e diamante).
- Essencial: simples: um elemento | composta: dois ou mais elementos | alotropia: mesmo elemento, substâncias simples diferentes
- Aceita: alótropos | variedades alotrópicas
- Erro comum: Chamar O₂ e O₃ de isótopos: são alótropos (mesmo elemento, moléculas diferentes).

### qui-f039 · Q04.1 (massa atômica, massa molar, mol e constante de Avogadro) · formula · peso 3
- Frente: Como converter a massa de uma substância em quantidade de matéria (mol)?
- Verso: n = m ÷ M: massa em gramas dividida pela massa molar em g/mol. Ex.: 36 g de água ÷ 18 g/mol = 2 mol.
- Essencial: n = m ÷ M
- Aceita: mol = massa ÷ massa molar | n = m/M
- Erro comum: Multiplicar pela massa molar em vez de dividir, ou esquecer de passar mg ou kg para g.

### qui-f040 · Q04.1 (massa atômica, massa molar, mol e constante de Avogadro) · exemplo · peso 2
- Frente: Qual a massa molar do Ca(OH)₂ (Ca = 40; O = 16; H = 1)?
- Verso: 74 g/mol: 40 + 2 × (16 + 1).
- Essencial: 74 g/mol
- Aceita: 74 | 74 g·mol⁻¹
- Erro comum: Ignorar o parêntese e calcular 40 + 16 + 2 = 58.

### qui-f041 · Q04.1 (massa atômica, massa molar, mol e constante de Avogadro) · conceito · peso 3
- Frente: Quantas entidades há em 1 mol e que nome tem esse número?
- Verso: 6,02 × 10²³ entidades (átomos, moléculas, íons): é a constante de Avogadro.
- Essencial: 6,02 × 10²³ | constante (número) de Avogadro
- Aceita: 6 × 10²³ | 6,022 × 10²³
- Erro comum: Perguntaram átomos e responder moléculas: multiplique pelo número de átomos da fórmula.

### qui-f042 · Q04.2 (fórmula percentual, mínima e molecular) · comparar · peso 2
- Frente: Qual a fórmula mínima da glicose, C₆H₁₂O₆?
- Verso: CH₂O: menor proporção inteira 1 : 2 : 1. A fórmula molecular é a mínima multiplicada por 6.
- Essencial: CH₂O
- Aceita: CH2O | fórmula empírica CH₂O
- Erro comum: Responder C₃H₆O₃: ainda dá para dividir por 3.

### qui-f043 · Q04.2 (fórmula percentual, mínima e molecular) · processo · peso 2
- Frente: Quais os passos para achar a fórmula mínima a partir da composição percentual em massa?
- Verso: Divida a porcentagem de cada elemento pela massa atômica; divida tudo pelo menor quociente; se sobrar fração (ex.: 1,5), multiplique todos até virarem inteiros.
- Essencial: dividir % pela massa atômica | dividir pelo menor valor | ajustar para inteiros
- Aceita: considerar 100 g de amostra | regra de três por 100 g
- Erro comum: Arredondar 1,5 para 2 em vez de multiplicar todos por 2.

### qui-f044 · Q04.3 (cálculo estequiométrico direto) · processo · peso 3
- Frente: Quais são as etapas de um cálculo estequiométrico?
- Verso: Balancear a equação; converter o dado para mol; aplicar a proporção dos coeficientes; converter o resultado para a unidade pedida (massa, volume ou partículas).
- Essencial: balancear | converter para mol | usar a proporção dos coeficientes | voltar à unidade pedida
- Aceita: regra de três com a proporção da equação
- Erro comum: Usar os coeficientes como proporção em gramas.

### qui-f045 · Q04.3 (cálculo estequiométrico direto) · exemplo · peso 2
- Frente: Na combustão CH₄ + 2 O₂ → CO₂ + 2 H₂O, quantos gramas de CO₂ saem de 16 g de metano?
- Verso: 44 g: 16 g de CH₄ são 1 mol, que forma 1 mol de CO₂ (44 g/mol).
- Essencial: 44 g
- Aceita: 44 gramas | 1 mol de CO₂
- Erro comum: Fazer regra de três direto com as massas 16 e 44 sem conferir a proporção 1 : 1 em mol.

### qui-f046 · Q04.3 (cálculo estequiométrico direto) · conceito · peso 3
- Frente: Os coeficientes da equação balanceada indicam proporção em massa ou em mol?
- Verso: Em mol (ou em número de moléculas; para gases nas mesmas P e T, também em volume). Nunca diretamente em massa.
- Essencial: proporção em mol
- Aceita: quantidade de matéria | número de moléculas | volume para gases nas mesmas condições
- Erro comum: Ler 2 H₂ + O₂ → 2 H₂O como 2 g de H₂ para 1 g de O₂.

### qui-f047 · Q04.4 (reagente limitante, excesso, pureza e rendimento) · processo · peso 3
- Frente: Como identificar o reagente limitante?
- Verso: Converta cada reagente para mol e divida pelo seu coeficiente; o menor quociente é o limitante: acaba primeiro e define a quantidade de produto.
- Essencial: converter para mol | dividir pelo coeficiente | menor valor é o limitante
- Aceita: o que acaba primeiro | o outro está em excesso
- Erro comum: Escolher o reagente de menor massa ou de menos mols sem dividir pelo coeficiente.

### qui-f048 · Q04.4 (reagente limitante, excesso, pureza e rendimento) · comparar · peso 3
- Frente: Em que momento do cálculo entram a pureza e o rendimento?
- Verso: A pureza entra antes: reduz a massa de reagente que de fato reage. O rendimento entra depois: reduz o produto teórico ao realmente obtido.
- Essencial: pureza: antes, sobre o reagente | rendimento: depois, sobre o produto
- Aceita: massa pura = amostra × pureza | real = teórico × rendimento
- Erro comum: Aplicar a pureza sobre o produto ou somar pureza e rendimento.

### qui-f049 · Q04.4 (reagente limitante, excesso, pureza e rendimento) · exemplo · peso 2
- Frente: Em N₂ + 3 H₂ → 2 NH₃, com 1 mol de N₂ e 2 mol de H₂, qual é o reagente limitante?
- Verso: O H₂: 2 ÷ 3 ≈ 0,67 é menor que 1 ÷ 1 = 1. Formam-se cerca de 1,33 mol de NH₃ e sobra N₂.
- Essencial: H₂ é o limitante
- Aceita: hidrogênio | H2
- Erro comum: Apontar o N₂ porque tem menos mols, sem dividir cada quantidade pelo coeficiente.

### qui-f050 · Q04.5 (leis ponderais e conservação da massa) · comparar · peso 2
- Frente: O que dizem a lei de Lavoisier e a lei de Proust?
- Verso: Lavoisier: em sistema fechado, a massa total dos reagentes é igual à dos produtos. Proust: cada substância tem proporção fixa entre as massas de seus elementos.
- Essencial: Lavoisier: conservação da massa (sistema fechado) | Proust: proporções fixas (definidas)
- Aceita: lei das proporções constantes | nada se perde, nada se cria
- Erro comum: Trocar os autores, ou aplicar Lavoisier a sistema aberto em que gás escapa.

### qui-f051 · Q04.5 (leis ponderais e conservação da massa) · exemplo · peso 2
- Frente: Em sistema aberto, por que a palha de aço queimando ganha massa e o papel queimando perde?
- Verso: A palha de aço incorpora O₂ do ar e forma óxido de ferro. O papel forma CO₂ e vapor de água, que escapam.
- Essencial: palha de aço incorpora O₂ (óxido) | papel libera gases que escapam
- Aceita: ferro se oxida | CO₂ e H₂O saem do sistema
- Erro comum: Concluir que a massa não se conserva: em frasco fechado ela se conserva nos dois casos.

### qui-f052 · Q05.1 (concentração comum, densidade e massa de soluto) · formula · peso 3
- Frente: Qual a fórmula da concentração comum e sua unidade usual?
- Verso: C = massa de soluto ÷ volume de solução, em g/L (volume em litros).
- Essencial: C = m(soluto) ÷ V(solução) | g/L
- Aceita: concentração em massa | C = m/V
- Erro comum: Usar o volume de solvente adicionado em vez do volume final da solução.

### qui-f053 · Q05.1 (concentração comum, densidade e massa de soluto) · comparar · peso 2
- Frente: Qual a diferença entre densidade de uma solução e concentração comum?
- Verso: Densidade: massa da solução inteira ÷ volume da solução (em geral g/mL). Concentração comum: só a massa do soluto ÷ volume da solução (g/L).
- Essencial: densidade: massa da solução por volume | concentração: massa do soluto por volume
- Aceita: d = m(solução)/V | C = m(soluto)/V
- Erro comum: Usar a densidade como se fosse concentração, ou comparar g/mL com g/L sem multiplicar por 1 000.

### qui-f054 · Q05.2 (concentração em mol/L e preparo de solução) · formula · peso 3
- Frente: Como calcular a concentração em mol/L?
- Verso: [X] = n ÷ V: mols de soluto (n = m ÷ M) divididos pelo volume da solução em litros.
- Essencial: mol de soluto ÷ volume em litros | n = m ÷ M
- Aceita: molaridade | concentração em quantidade de matéria | M = n/V
- Erro comum: Deixar o volume em mL: 250 mL entram como 0,25 L.

### qui-f055 · Q05.2 (concentração em mol/L e preparo de solução) · exemplo · peso 2
- Frente: Que massa de NaCl (58,5 g/mol) é necessária para preparar 250 mL de solução 1 mol/L?
- Verso: Cerca de 14,6 g: n = 1 × 0,25 = 0,25 mol; m = 0,25 × 58,5 ≈ 14,6 g.
- Essencial: ≈ 14,6 g
- Aceita: 14,625 g | 14,6 gramas | aproximadamente 15 g
- Erro comum: Multiplicar por 250 em vez de 0,25 e achar 14 625 g.

### qui-f056 · Q05.3 (diluição e mistura de soluções) · formula · peso 3
- Frente: Que relação vale numa diluição e como achar a água acrescentada?
- Verso: C₁·V₁ = C₂·V₂, porque a quantidade de soluto não muda. A água acrescentada é V₂ − V₁.
- Essencial: C₁V₁ = C₂V₂ | água adicionada = V₂ − V₁
- Aceita: Ci·Vi = Cf·Vf | M1V1 = M2V2 | soluto constante
- Erro comum: Responder V₂ quando a pergunta é a água acrescentada.

### qui-f057 · Q05.3 (diluição e mistura de soluções) · formula · peso 2
- Frente: Como calcular a concentração final ao misturar duas soluções do mesmo soluto, sem reação?
- Verso: C = (C₁V₁ + C₂V₂) ÷ (V₁ + V₂): soma-se a quantidade de soluto e soma-se o volume.
- Essencial: somar soluto | dividir pelo volume total | C = (C₁V₁ + C₂V₂) ÷ (V₁ + V₂)
- Aceita: média ponderada pelos volumes
- Erro comum: Somar as concentrações, ou usar essa fórmula quando os solutos reagem (ácido com base).

### qui-f058 · Q05.3 (diluição e mistura de soluções) · exemplo · peso 2
- Frente: Na titulação de H₂SO₄ com NaOH, qual a proporção em mol entre ácido e base?
- Verso: 1 : 2. H₂SO₄ + 2 NaOH → Na₂SO₄ + 2 H₂O; logo n(NaOH) = 2 × n(H₂SO₄).
- Essencial: 1 mol de ácido : 2 mol de base
- Aceita: 1:2 | n(NaOH) = 2 n(H₂SO₄)
- Erro comum: Aplicar C₁V₁ = C₂V₂ direto, como se fosse 1 : 1.

### qui-f059 · Q05.4 (título, porcentagem em massa, ppm e dosagem) · formula · peso 2
- Frente: O que é o título (porcentagem em massa) de uma solução?
- Verso: Título = massa de soluto ÷ massa da solução (soluto + solvente). Multiplicado por 100, dá a porcentagem em massa.
- Essencial: massa de soluto ÷ massa da solução | × 100 = % em massa
- Aceita: τ = m1/m | % m/m
- Erro comum: Dividir pela massa do solvente: 10 g de sal em 90 g de água dão 10%, não 11%.

### qui-f060 · Q05.4 (título, porcentagem em massa, ppm e dosagem) · conceito · peso 3
- Frente: O que significa 1 ppm e quanto vale em água diluída?
- Verso: 1 parte de soluto em 10⁶ partes da amostra, em massa: 1 mg/kg. Em água diluída (densidade ≈ 1 kg/L), ≈ 1 mg/L.
- Essencial: 1 parte em 1 milhão (10⁶) | 1 mg/kg (≈ 1 mg/L em água)
- Aceita: parte por milhão | 1 g por tonelada
- Erro comum: Usar mg/L para amostra sólida, em que vale mg/kg.

### qui-f061 · Q05.5 (solubilidade, curva de solubilidade e saturação) · conceito · peso 2
- Frente: O que é coeficiente de solubilidade?
- Verso: Massa máxima de soluto que se dissolve numa quantidade fixa de solvente (em geral 100 g de água), a uma dada temperatura.
- Essencial: massa máxima de soluto | por quantidade fixa de solvente (100 g de água) | a uma temperatura
- Aceita: solubilidade | CS
- Erro comum: Aplicar o coeficiente à massa da solução em vez da massa de água.

### qui-f062 · Q05.5 (solubilidade, curva de solubilidade e saturação) · comparar · peso 2
- Frente: Diferencie solução insaturada, saturada e supersaturada.
- Verso: Insaturada: soluto abaixo do coeficiente de solubilidade. Saturada: igual a ele (pode ter corpo de fundo). Supersaturada: acima dele, sem precipitar; é instável.
- Essencial: insaturada: abaixo do CS | saturada: no CS | supersaturada: acima do CS, instável
- Aceita: corpo de fundo indica saturada
- Erro comum: Dizer que solução com corpo de fundo é supersaturada: ela é saturada.

### qui-f063 · Q05.5 (solubilidade, curva de solubilidade e saturação) · conceito · peso 2
- Frente: O que acontece com a solubilidade de um gás em água quando a temperatura aumenta?
- Verso: Diminui: água mais quente dissolve menos gás (por isso refrigerante quente perde gás mais rápido).
- Essencial: diminui
- Aceita: cai | fica menor
- Erro comum: Generalizar a regra dos sólidos (que costumam dissolver mais a quente) para os gases.

### qui-f064 · Q06.1 (transformações gasosas e equação geral dos gases) · formula · peso 3
- Frente: Qual é a equação geral dos gases e em que unidade entra a temperatura?
- Verso: P₁V₁/T₁ = P₂V₂/T₂, para a mesma quantidade de gás, com T em kelvin (T = θ + 273).
- Essencial: P₁V₁/T₁ = P₂V₂/T₂ | temperatura em kelvin
- Aceita: PV/T constante | escala absoluta
- Erro comum: Usar graus Celsius: de 10 °C para 20 °C a temperatura absoluta não dobra.

### qui-f065 · Q06.1 (transformações gasosas e equação geral dos gases) · comparar · peso 2
- Frente: O que fica constante nas transformações isotérmica, isobárica e isovolumétrica?
- Verso: Isotérmica: temperatura (P·V constante). Isobárica: pressão (V/T constante). Isovolumétrica ou isocórica: volume (P/T constante).
- Essencial: isotérmica: T constante | isobárica: P constante | isovolumétrica: V constante
- Aceita: isocórica | Boyle, Charles e Gay-Lussac
- Erro comum: Trocar isobárica com isovolumétrica.

### qui-f066 · Q06.1 (transformações gasosas e equação geral dos gases) · exemplo · peso 2
- Frente: Um gás em recipiente rígido é aquecido de 27 °C para 57 °C. Quanto varia a pressão?
- Verso: Sobe 10%: P₂/P₁ = T₂/T₁ = 330 K ÷ 300 K = 1,1.
- Essencial: aumenta 10% | razão 330/300 em kelvin
- Aceita: fica 1,1 vez maior | P₂ = 1,1 P₁
- Erro comum: Fazer 57 ÷ 27 em Celsius e achar que a pressão quase dobra.

### qui-f067 · Q06.2 (equação de Clapeyron, volume molar e CNTP) · formula · peso 3
- Frente: Qual é a equação de Clapeyron e o valor de R com pressão em atm e volume em L?
- Verso: PV = nRT, com R = 0,082 atm·L/(mol·K) e T em kelvin.
- Essencial: PV = nRT | R = 0,082 atm·L/(mol·K)
- Aceita: equação dos gases ideais | pV = nRT
- Erro comum: Usar R = 8,31 com atm e litro: esse valor pede pascal e metro cúbico.

### qui-f068 · Q06.2 (equação de Clapeyron, volume molar e CNTP) · conceito · peso 3
- Frente: Qual o volume molar de um gás nas CNTP e em que condição ele vale?
- Verso: 22,4 L/mol, só a 0 °C (273 K) e 1 atm. Em outras condições, use PV = nRT ou o volume molar dado no enunciado.
- Essencial: 22,4 L/mol | 0 °C e 1 atm
- Aceita: 273 K e 1 atm | CNTP
- Erro comum: Usar 22,4 L/mol a 25 °C, onde vale cerca de 24,5 L/mol.

### qui-f069 · Q06.2 (equação de Clapeyron, volume molar e CNTP) · formula · peso 2
- Frente: Como se calcula a densidade de um gás a partir de Clapeyron?
- Verso: d = P·M ÷ (R·T), com M a massa molar. Na mesma pressão e temperatura, a densidade é proporcional à massa molar.
- Essencial: d = PM ÷ RT
- Aceita: d = P·M/(R·T) | densidade proporcional à massa molar
- Erro comum: Esquecer o kelvin, ou concluir que gás mais leve que o ar (≈ 29 g/mol) desce.

### qui-f070 · Q06.3 (misturas gasosas, pressão parcial e difusão) · formula · peso 2
- Frente: Como calcular a pressão parcial de um gás numa mistura?
- Verso: pᵢ = xᵢ × P(total), com xᵢ a fração em mol. Em gases, a % em volume ÷ 100 já é a fração em mol.
- Essencial: p = fração molar × pressão total
- Aceita: lei de Dalton | fração em quantidade de matéria | % em volume = % em mol
- Erro comum: Repartir o volume entre os gases: cada gás ocupa o volume inteiro do recipiente.

### qui-f071 · Q06.3 (misturas gasosas, pressão parcial e difusão) · exemplo · peso 2
- Frente: Quantas vezes o H₂ se difunde mais rápido que o O₂, nas mesmas condições?
- Verso: 4 vezes. Lei de Graham: v(H₂)/v(O₂) = √(32 ÷ 2) = √16 = 4.
- Essencial: 4 vezes | raiz da razão das massas molares
- Aceita: quatro vezes | v₁/v₂ = √(M₂/M₁)
- Erro comum: Esquecer a raiz e responder 16 vezes.

### qui-f072 · Q07.1 (entalpia, reação exotérmica e endotérmica, diagrama de energia) · comparar · peso 3
- Frente: Qual o sinal de ΔH numa reação exotérmica e numa endotérmica?
- Verso: Exotérmica: ΔH < 0, libera calor. Endotérmica: ΔH > 0, absorve calor. ΔH = H(produtos) − H(reagentes).
- Essencial: exotérmica: ΔH negativo, libera calor | endotérmica: ΔH positivo, absorve calor
- Aceita: ΔH < 0 e ΔH > 0
- Erro comum: Achar que ΔH negativo significa que a reação absorve energia.

### qui-f073 · Q07.1 (entalpia, reação exotérmica e endotérmica, diagrama de energia) · identificar · peso 3
- Frente: Num diagrama de energia, como se leem o ΔH e a energia de ativação?
- Verso: ΔH = energia dos produtos − energia dos reagentes. Energia de ativação = energia do pico (complexo ativado) − energia dos reagentes.
- Essencial: ΔH = produtos − reagentes | Ea = pico − reagentes
- Aceita: Ea medida a partir dos reagentes | complexo ativado no topo
- Erro comum: Medir a energia de ativação a partir do zero do eixo ou dos produtos.

### qui-f074 · Q07.1 (entalpia, reação exotérmica e endotérmica, diagrama de energia) · exemplo · peso 2
- Frente: O álcool que evapora na pele dá sensação de frio. A evaporação é exotérmica ou endotérmica?
- Verso: Endotérmica: a evaporação absorve calor da pele, que esfria.
- Essencial: endotérmica | absorve calor da pele
- Aceita: ΔH > 0 | retira calor do corpo
- Erro comum: Associar sensação de frio a processo exotérmico.

### qui-f075 · Q07.1 (entalpia, reação exotérmica e endotérmica, diagrama de energia) · formula · peso 2
- Frente: Qual a fórmula do calor trocado usada em calorimetria e o calor específico da água?
- Verso: Q = m · c · ΔT. Para a água, c = 1 cal/(g·°C) ≈ 4,18 J/(g·°C).
- Essencial: Q = m·c·ΔT | c(água) = 1 cal/(g·°C)
- Aceita: Q = mcΔt | 4,18 J/(g·°C) | 4,2 J/(g·°C)
- Erro comum: Usar a massa do combustível queimado em vez da massa de água que aqueceu.

### qui-f076 · Q07.2 (lei de Hess e entalpia de formação) · processo · peso 3
- Frente: Na lei de Hess, o que acontece com o ΔH ao inverter e ao multiplicar uma equação?
- Verso: Inverter troca o sinal do ΔH; multiplicar a equação por k multiplica o ΔH por k. Depois somam-se as equações e os ΔH.
- Essencial: inverter: troca o sinal | multiplicar por k: ΔH × k | somar os ΔH
- Aceita: dividir também divide o ΔH
- Erro comum: Inverter e multiplicar a equação e aplicar ao ΔH só uma das duas mudanças.

### qui-f077 · Q07.2 (lei de Hess e entalpia de formação) · formula · peso 3
- Frente: Como calcular o ΔH de uma reação a partir das entalpias de formação?
- Verso: ΔH = Σ ΔHf(produtos) − Σ ΔHf(reagentes), multiplicando cada ΔHf pelo coeficiente da equação.
- Essencial: produtos − reagentes | multiplicar pelos coeficientes
- Aceita: ΔH = Hp − Hr
- Erro comum: Fazer reagentes − produtos, ou esquecer os coeficientes.

### qui-f078 · Q07.2 (lei de Hess e entalpia de formação) · conceito · peso 3
- Frente: Que substâncias têm entalpia de formação padrão igual a zero?
- Verso: Substâncias simples na forma alotrópica mais estável, no estado-padrão: O₂, H₂, N₂, C(grafite). O₃ e diamante não valem zero.
- Essencial: substância simples | forma mais estável (estado-padrão)
- Aceita: O₂, H₂, N₂ e grafite | elementos na forma mais estável
- Erro comum: Atribuir ΔHf = 0 ao ozônio ou ao diamante.

### qui-f079 · Q07.2 (lei de Hess e entalpia de formação) · exemplo · peso 2
- Frente: Qual o ΔH de C + ½ O₂ → CO, se a combustão do C (grafite) dá −394 kJ/mol e a do CO, −283 kJ/mol?
- Verso: −111 kJ: mantém-se a primeira e inverte-se a segunda (+283 kJ); −394 + 283 = −111 kJ.
- Essencial: −111 kJ
- Aceita: −111 kJ/mol | ΔH = −111
- Erro comum: Esquecer de trocar o sinal da equação invertida e chegar a −677 kJ.

### qui-f080 · Q07.3 (energia de ligação, poder calorífico e combustíveis) · formula · peso 3
- Frente: Como calcular o ΔH por energias de ligação?
- Verso: ΔH = Σ energias das ligações rompidas (reagentes) − Σ energias das ligações formadas (produtos). Romper absorve energia; formar libera.
- Essencial: rompidas − formadas | romper absorve, formar libera
- Aceita: quebradas − formadas | ΔH = E(reagentes) − E(produtos)
- Erro comum: Inverter a ordem (formadas − rompidas), o que troca o sinal do ΔH.

### qui-f081 · Q07.3 (energia de ligação, poder calorífico e combustíveis) · conceito · peso 2
- Frente: O que é poder calorífico de um combustível?
- Verso: Energia liberada por unidade de massa de combustível queimado (kJ/g ou kcal/g). Compara combustíveis por massa, não por mol.
- Essencial: energia liberada por massa de combustível
- Aceita: kJ/g | calor de combustão por grama
- Erro comum: Comparar combustíveis pelo ΔH por mol quando a pergunta é por massa.

### qui-f082 · Q07.3 (energia de ligação, poder calorífico e combustíveis) · exemplo · peso 2
- Frente: Com H–H = 436, Cl–Cl = 243 e H–Cl = 432 kJ/mol, qual o ΔH de H₂ + Cl₂ → 2 HCl?
- Verso: −185 kJ: rompe 436 + 243 = 679 kJ; forma 2 × 432 = 864 kJ; 679 − 864 = −185 kJ.
- Essencial: −185 kJ
- Aceita: −185 kJ/mol | libera 185 kJ
- Erro comum: Contar uma só ligação H–Cl em vez de duas.

### qui-f083 · Q08.1 (velocidade de reação e fatores que a alteram) · conceito · peso 3
- Frente: Quais fatores aumentam a velocidade de uma reação química?
- Verso: Aumento de temperatura, de concentração dos reagentes (ou pressão, em gases), de superfície de contato, e presença de catalisador.
- Essencial: temperatura | concentração (ou pressão) | superfície de contato | catalisador
- Aceita: sólido em pó reage mais rápido | choques mais frequentes e mais energéticos
- Erro comum: Achar que a geladeira impede a decomposição: ela só a torna mais lenta.

### qui-f084 · Q08.1 (velocidade de reação e fatores que a alteram) · processo · peso 3
- Frente: Como obter a ordem de um reagente a partir de uma tabela de experimentos?
- Verso: Compare dois experimentos em que só a concentração dele muda: dobrou e v dobrou, ordem 1; v quadruplicou, ordem 2; v não mudou, ordem 0.
- Essencial: comparar experimentos variando só esse reagente | ×2 → v×2: ordem 1; v×4: ordem 2; v igual: ordem 0
- Aceita: expoente da lei de velocidade | 2^x = fator da velocidade
- Erro comum: Copiar os coeficientes da equação como ordens: elas saem dos dados experimentais.

### qui-f085 · Q08.2 (energia de ativação, complexo ativado e catalisador) · conceito · peso 3
- Frente: O que o catalisador altera e o que ele não altera numa reação?
- Verso: Diminui a energia de ativação (outro caminho) e aumenta a velocidade. Não altera ΔH nem K, não desloca o equilíbrio e não é consumido.
- Essencial: diminui a energia de ativação | não altera ΔH nem K (não desloca o equilíbrio) | não é consumido
- Aceita: regenerado no final | aumenta igualmente as velocidades direta e inversa
- Erro comum: Dizer que o catalisador aumenta o rendimento ou desloca o equilíbrio: ele só faz chegar mais rápido ao equilíbrio.

### qui-f086 · Q08.2 (energia de ativação, complexo ativado e catalisador) · comparar · peso 2
- Frente: Num mecanismo de várias etapas, como distinguir catalisador de intermediário?
- Verso: Catalisador entra numa etapa e é regenerado noutra (aparece antes e depois). Intermediário é formado numa etapa e consumido numa etapa seguinte.
- Essencial: catalisador: consumido e regenerado | intermediário: formado e depois consumido
- Aceita: catalisador aparece nos reagentes da 1ª etapa | intermediário não aparece na equação global
- Erro comum: Classificar como catalisador uma espécie que surge numa etapa e some na outra: isso é intermediário.

### qui-f087 · Q08.3 (equilíbrio químico, Kc e Kp) · formula · peso 3
- Frente: Escreva a expressão de Kc para N₂(g) + 3 H₂(g) ⇌ 2 NH₃(g).
- Verso: Kc = [NH₃]² ÷ ([N₂]·[H₂]³): produtos sobre reagentes, cada concentração elevada ao seu coeficiente.
- Essencial: Kc = [NH₃]² / ([N₂][H₂]³)
- Aceita: [NH3]^2 / [N2][H2]^3
- Erro comum: Inverter a fração ou esquecer de elevar ao coeficiente.

### qui-f088 · Q08.3 (equilíbrio químico, Kc e Kp) · conceito · peso 2
- Frente: O que caracteriza o estado de equilíbrio químico?
- Verso: Velocidade da reação direta igual à da inversa, com concentrações constantes (não necessariamente iguais). É dinâmico e exige sistema fechado.
- Essencial: velocidade direta = velocidade inversa | concentrações constantes
- Aceita: equilíbrio dinâmico | as reações continuam ocorrendo
- Erro comum: Achar que no equilíbrio as concentrações de reagentes e produtos são iguais.

### qui-f089 · Q08.3 (equilíbrio químico, Kc e Kp) · identificar · peso 2
- Frente: Sólidos e líquidos puros entram na expressão de Kc e de Kp?
- Verso: Não: entram só gases e espécies em solução (no Kp, só gases). Ex.: CaCO₃(s) ⇌ CaO(s) + CO₂(g): Kc = [CO₂].
- Essencial: não entram
- Aceita: concentração constante, fica fora | Kp = p(CO₂)
- Erro comum: Pôr o CaCO₃ e o CaO na expressão da constante.

### qui-f090 · Q08.4 (deslocamento de equilíbrio) · conceito · peso 3
- Frente: O que diz o princípio de Le Chatelier?
- Verso: Um sistema em equilíbrio, quando perturbado, desloca-se no sentido que atenua a perturbação.
- Essencial: perturbado, o equilíbrio se desloca para reduzir a perturbação
- Aceita: foge da perturbação | contraria a alteração
- Erro comum: Achar que o deslocamento muda o valor de K: só a temperatura muda K.

### qui-f091 · Q08.4 (deslocamento de equilíbrio) · processo · peso 3
- Frente: Para que lado se desloca um equilíbrio gasoso quando a pressão aumenta?
- Verso: Para o lado com menor número de mols de gás. Se os dois lados têm o mesmo número de mols gasosos, não desloca.
- Essencial: para o lado com menos mols de gás
- Aceita: menor volume gasoso | contração de volume
- Erro comum: Contar sólidos e líquidos na soma dos mols: só os gases contam.

### qui-f092 · Q08.4 (deslocamento de equilíbrio) · conceito · peso 3
- Frente: Qual é o único fator que altera o valor da constante de equilíbrio?
- Verso: A temperatura. Concentração e pressão deslocam o equilíbrio sem mudar K, e o catalisador nem desloca.
- Essencial: temperatura
- Aceita: só a temperatura muda K
- Erro comum: Dizer que adicionar reagente aumenta K.

### qui-f093 · Q08.4 (deslocamento de equilíbrio) · exemplo · peso 3
- Frente: Em N₂ + 3 H₂ ⇌ 2 NH₃, com ΔH < 0, o que o aquecimento faz com o equilíbrio e com K?
- Verso: Desloca para os reagentes, no sentido endotérmico, e K diminui.
- Essencial: desloca para os reagentes (esquerda) | K diminui
- Aceita: favorece o sentido inverso | menos amônia
- Erro comum: Achar que aquecer sempre favorece os produtos.

### qui-f094 · Q08.5 (equilíbrio iônico, Ka, Kb e grau de ionização) · formula · peso 3
- Frente: Como estimar [H⁺] de um ácido fraco monoprótico a partir de Ka e da concentração C?
- Verso: [H⁺] ≈ √(Ka · C), aproximação válida quando a ionização é pequena.
- Essencial: [H⁺] ≈ √(Ka·C)
- Aceita: raiz de Ka vezes C | Ka ≈ [H⁺]²/C
- Erro comum: Esquecer a raiz quadrada e usar [H⁺] = Ka · C.

### qui-f095 · Q08.5 (equilíbrio iônico, Ka, Kb e grau de ionização) · conceito · peso 2
- Frente: Que relação existe entre o valor de Ka e a força de um ácido?
- Verso: Quanto maior o Ka, mais o ácido se ioniza e mais forte ele é. Ex.: Ka = 10⁻⁴ é mais forte que Ka = 10⁻⁵.
- Essencial: maior Ka, ácido mais forte
- Aceita: maior ionização | menor pKa, mais forte
- Erro comum: Ler o expoente negativo ao contrário e achar 10⁻⁵ maior que 10⁻⁴.

### qui-f096 · Q08.5 (equilíbrio iônico, Ka, Kb e grau de ionização) · formula · peso 2
- Frente: O que diz a lei de diluição de Ostwald?
- Verso: Ka = α²·C ÷ (1 − α) ≈ α²·C para α pequeno. Ao diluir, o grau de ionização α aumenta e Ka não muda.
- Essencial: Ka ≈ α²·C | diluir aumenta α; Ka constante
- Aceita: Ki = α²M/(1 − α)
- Erro comum: Dizer que diluir aumenta Ka: Ka só muda com a temperatura.

### qui-f097 · Q08.6 (pH, pOH e hidrólise de sais) · formula · peso 3
- Frente: Como se calcula o pH e qual a relação entre pH e pOH a 25 °C?
- Verso: pH = −log[H⁺]; pOH = −log[OH⁻]; pH + pOH = 14 a 25 °C.
- Essencial: pH = −log[H⁺] | pH + pOH = 14
- Aceita: [H⁺] = 10⁻ᵖᴴ | Kw = 10⁻¹⁴
- Erro comum: Parar no pOH quando o pedido era o pH.

### qui-f098 · Q08.6 (pH, pOH e hidrólise de sais) · exemplo · peso 3
- Frente: Qual o pH de uma solução de NaOH 0,001 mol/L a 25 °C?
- Verso: pH = 11: [OH⁻] = 10⁻³ mol/L, pOH = 3 e pH = 14 − 3 = 11.
- Essencial: pH = 11
- Aceita: 11 | pOH 3, pH 11
- Erro comum: Responder pH 3, calculando o log da concentração de OH⁻ como se fosse H⁺.

### qui-f099 · Q08.6 (pH, pOH e hidrólise de sais) · comparar · peso 3
- Frente: Qual o caráter da solução aquosa de NH₄Cl, de CH₃COONa e de NaCl?
- Verso: NH₄Cl: ácida (ácido forte + base fraca). CH₃COONa: básica (ácido fraco + base forte). NaCl: neutra (ácido forte + base forte).
- Essencial: NH₄Cl ácida | CH₃COONa básica | NaCl neutra
- Aceita: acetato de sódio básico | cloreto de amônio ácido
- Erro comum: Achar que todo sal dá solução neutra: o íon vindo de ácido ou base fraca sofre hidrólise.

### qui-f100 · Q08.6 (pH, pOH e hidrólise de sais) · conceito · peso 2
- Frente: Uma diferença de 1 unidade de pH corresponde a quanto em [H⁺]?
- Verso: A um fator 10: pH 3 tem [H⁺] 10 vezes maior que pH 4, porque a escala é logarítmica.
- Essencial: fator 10 (10 vezes)
- Aceita: dez vezes | escala logarítmica
- Erro comum: Achar que pH 3 é só um pouco mais ácido que pH 4, ou que pH 2 tem o dobro de H⁺ que pH 4.

### qui-f101 · Q08.7 (solução-tampão e produto de solubilidade) · conceito · peso 3
- Frente: O que forma uma solução-tampão e qual o principal tampão do sangue?
- Verso: Ácido fraco + sal do seu ânion (ou base fraca + sal do seu cátion). No sangue: H₂CO₃/HCO₃⁻, que mantém o pH perto de 7,4.
- Essencial: ácido fraco + sal do ânion (ou base fraca + sal do cátion) | sangue: H₂CO₃ / HCO₃⁻
- Aceita: ácido carbônico e bicarbonato | par conjugado
- Erro comum: Achar que ácido forte com seu sal (HCl + NaCl) forma tampão.

### qui-f102 · Q08.7 (solução-tampão e produto de solubilidade) · formula · peso 2
- Frente: Qual a expressão do Kps do Mg(OH)₂ em função da solubilidade S, em mol/L?
- Verso: Kps = [Mg²⁺]·[OH⁻]² = S·(2S)² = 4S³.
- Essencial: Kps = 4S³
- Aceita: S·(2S)² | [Mg²⁺][OH⁻]²
- Erro comum: Usar o coeficiente só uma vez e escrever S·(2S) = 2S², ou S·S² = S³.

### qui-f103 · Q08.7 (solução-tampão e produto de solubilidade) · identificar · peso 2
- Frente: Quando há precipitação, comparando o produto das concentrações dos íons com o Kps?
- Verso: Quando o produto iônico (com os expoentes) supera o Kps. Igual ao Kps, a solução está saturada; abaixo, não precipita.
- Essencial: produto iônico > Kps: precipita
- Aceita: Q > Kps | excede o Kps
- Erro comum: Comparar só a concentração de um íon com o Kps.

### qui-f104 · Q09.1 (pilhas: semirreações, potencial e espontaneidade) · comparar · peso 3
- Frente: Na pilha, onde ocorrem oxidação e redução e qual o sinal de cada polo?
- Verso: Ânodo: oxidação, polo negativo. Cátodo: redução, polo positivo. Os elétrons vão do ânodo para o cátodo pelo fio.
- Essencial: ânodo: oxidação, polo − | cátodo: redução, polo +
- Aceita: elétrons saem do ânodo | placa que corrói é o ânodo
- Erro comum: Levar o sinal da pilha para a eletrólise, onde o ânodo é o polo positivo.

### qui-f105 · Q09.1 (pilhas: semirreações, potencial e espontaneidade) · formula · peso 3
- Frente: Como calcular a ddp de uma pilha a partir dos potenciais de redução?
- Verso: ΔE° = E°red(cátodo) − E°red(ânodo); o cátodo é o de maior E° de redução. Multiplicar a semirreação não altera o E°.
- Essencial: ΔE° = E°(cátodo) − E°(ânodo) | cátodo: maior potencial de redução
- Aceita: maior − menor potencial de redução | E° não se multiplica
- Erro comum: Multiplicar o potencial pelo coeficiente usado para igualar os elétrons.

### qui-f106 · Q09.1 (pilhas: semirreações, potencial e espontaneidade) · exemplo · peso 2
- Frente: Qual a ddp da pilha de Daniell (E° Cu²⁺/Cu = +0,34 V; E° Zn²⁺/Zn = −0,76 V)?
- Verso: 1,10 V: 0,34 − (−0,76). O zinco é o ânodo (oxida) e o cobre é o cátodo (Cu²⁺ se reduz).
- Essencial: 1,10 V
- Aceita: 1,1 V | +1,10 V
- Erro comum: Fazer 0,76 − 0,34 = 0,42 V, ignorando o sinal negativo do zinco.

### qui-f107 · Q09.2 (eletrólise ígnea e aquosa, leis de Faraday) · comparar · peso 3
- Frente: Na eletrólise, qual o sinal do ânodo e do cátodo e o que ocorre em cada um?
- Verso: Ânodo: polo positivo, oxidação. Cátodo: polo negativo, redução. A polaridade é inversa à da pilha.
- Essencial: ânodo: polo +, oxidação | cátodo: polo −, redução
- Aceita: ânodo positivo na eletrólise
- Erro comum: Dizer que o cátodo é positivo, como na pilha.

### qui-f108 · Q09.2 (eletrólise ígnea e aquosa, leis de Faraday) · exemplo · peso 3
- Frente: Que produto se forma em cada eletrodo na eletrólise de NaCl em solução aquosa?
- Verso: Cátodo: H₂ (a água se reduz no lugar do Na⁺). Ânodo: Cl₂. A solução fica com NaOH.
- Essencial: cátodo: H₂ | ânodo: Cl₂
- Aceita: gás hidrogênio e gás cloro | sobra soda cáustica
- Erro comum: Pôr sódio metálico no cátodo: isso só ocorre na eletrólise ígnea (NaCl fundido).

### qui-f109 · Q09.2 (eletrólise ígnea e aquosa, leis de Faraday) · formula · peso 3
- Frente: Quais relações se usam na lei de Faraday?
- Verso: Q = i · t (coulomb = ampère × segundo) e 1 mol de elétrons = 96 500 C (1 faraday). Depois, a proporção da semirreação.
- Essencial: Q = i·t | 1 mol de e⁻ = 96 500 C
- Aceita: 1 F = 96 500 C | carga = corrente × tempo
- Erro comum: Deixar o tempo em minutos ou horas: precisa estar em segundos.

### qui-f110 · Q09.2 (eletrólise ígnea e aquosa, leis de Faraday) · exemplo · peso 2
- Frente: Quantos mols de cobre se depositam com 0,1 mol de elétrons, em Cu²⁺ + 2 e⁻ → Cu?
- Verso: 0,05 mol (cerca de 3,2 g): cada Cu²⁺ precisa de 2 elétrons.
- Essencial: 0,05 mol
- Aceita: ≈ 3,2 g de Cu | metade do número de mols de elétrons
- Erro comum: Usar proporção 1 : 1 entre elétrons e cobre e responder 0,1 mol.

### qui-f111 · Q09.3 (corrosão, metal de sacrifício e proteção) · conceito · peso 3
- Frente: Que condição um metal de sacrifício precisa cumprir para proteger o ferro?
- Verso: Ter potencial de redução menor que o do ferro, isto é, oxidar mais facilmente que ele. Ex.: zinco ou magnésio.
- Essencial: potencial de redução menor que o do ferro | oxida no lugar do ferro
- Aceita: mais reativo que o ferro | maior potencial de oxidação
- Erro comum: Escolher um metal mais nobre (cobre, estanho): ele acelera a corrosão do ferro exposto.

### qui-f112 · Q09.4 (emissões radioativas e equações nucleares) · comparar · peso 3
- Frente: O que acontece com o número de massa (A) e o número atômico (Z) numa emissão alfa e numa emissão beta?
- Verso: Alfa: A diminui 4 e Z diminui 2. Beta: A não muda e Z aumenta 1.
- Essencial: alfa: A − 4, Z − 2 | beta: A igual, Z + 1
- Aceita: ⁴₂α e ⁰₋₁β | na beta um nêutron vira próton
- Erro comum: Diminuir Z na emissão beta: na beta comum (β⁻), Z aumenta.

### qui-f113 · Q09.4 (emissões radioativas e equações nucleares) · conceito · peso 3
- Frente: O que se conserva numa equação nuclear?
- Verso: A soma dos números de massa (A) e a soma dos números atômicos (Z) dos dois lados da equação.
- Essencial: soma de A | soma de Z
- Aceita: número de massa e carga nuclear | números de cima e de baixo
- Erro comum: Conservar o elemento químico, como numa reação comum: na reação nuclear o elemento muda.

### qui-f114 · Q09.4 (emissões radioativas e equações nucleares) · exemplo · peso 2
- Frente: Que nuclídeo se forma quando o urânio-238 (Z = 92) emite uma partícula alfa?
- Verso: Tório-234 (²³⁴₉₀Th): A = 238 − 4 = 234 e Z = 92 − 2 = 90.
- Essencial: A = 234 | Z = 90 (tório)
- Aceita: ²³⁴Th | Th-234
- Erro comum: Tirar 4 também do número atômico.

### qui-f115 · Q09.5 (meia-vida, fissão e fusão nuclear) · formula · peso 3
- Frente: Que fração de uma amostra radioativa resta após 3 meias-vidas?
- Verso: 1/8 (12,5%): 1 → 1/2 → 1/4 → 1/8. Em geral, m = m₀ ÷ 2ⁿ.
- Essencial: 1/8
- Aceita: 12,5% | um oitavo
- Erro comum: Subtrair 1/3 por meia-vida, ou achar que a amostra acaba após 2 meias-vidas.

### qui-f116 · Q09.5 (meia-vida, fissão e fusão nuclear) · comparar · peso 2
- Frente: Diferencie fissão nuclear de fusão nuclear.
- Verso: Fissão: um núcleo pesado (ex.: urânio-235) se divide em núcleos menores, como nas usinas nucleares. Fusão: núcleos leves se unem, como no Sol.
- Essencial: fissão: núcleo pesado se divide | fusão: núcleos leves se juntam
- Aceita: usina = fissão | Sol = fusão de hidrogênio em hélio
- Erro comum: Dizer que a energia do Sol vem da fissão.

### qui-f117 · Q09.5 (meia-vida, fissão e fusão nuclear) · conceito · peso 2
- Frente: A meia-vida de um radioisótopo depende da massa inicial da amostra ou da temperatura?
- Verso: Não. A meia-vida é característica de cada radioisótopo e não depende da quantidade inicial, da temperatura nem da pressão.
- Essencial: não depende
- Aceita: é constante para o isótopo
- Erro comum: Achar que uma amostra maior demora mais para cair à metade.

### qui-f118 · Q09.5 (meia-vida, fissão e fusão nuclear) · exemplo · peso 2
- Frente: Qual a meia-vida aproximada do carbono-14 e para que ele é usado?
- Verso: Cerca de 5 730 anos; serve para datar materiais de origem biológica, como ossos e madeira.
- Essencial: ≈ 5 730 anos | datação de material de origem biológica
- Aceita: 5 700 anos | datação por carbono-14 | datação de fósseis
- Erro comum: Usá-lo para datar rochas de milhões de anos: após cerca de 50 mil anos quase não resta ¹⁴C.

### qui-f119 · Q10.1 (tonoscopia, ebulioscopia e crioscopia) · conceito · peso 3
- Frente: De que dependem as propriedades coligativas?
- Verso: Só do número de partículas de soluto dissolvidas, e não da natureza delas.
- Essencial: número de partículas dissolvidas
- Aceita: quantidade de partículas | concentração de partículas
- Erro comum: Comparar soluções pelo valor de mol/L impresso, sem contar os íons formados.

### qui-f120 · Q10.1 (tonoscopia, ebulioscopia e crioscopia) · exemplo · peso 3
- Frente: Quantas partículas por fórmula liberam, em água, glicose, NaCl, CaCl₂ e Al₂(SO₄)₃ (dissociação total)?
- Verso: Glicose: 1; NaCl: 2; CaCl₂: 3; Al₂(SO₄)₃: 5.
- Essencial: glicose 1 | NaCl 2 | CaCl₂ 3 | Al₂(SO₄)₃ 5
- Aceita: fator de van't Hoff i
- Erro comum: Contar átomos em vez de íons: o SO₄²⁻ é uma partícula só.

### qui-f121 · Q10.1 (tonoscopia, ebulioscopia e crioscopia) · comparar · peso 3
- Frente: Como um soluto não volátil altera a pressão de vapor, a temperatura de ebulição e a de congelamento do solvente?
- Verso: Pressão de vapor diminui (tonoscopia); temperatura de ebulição aumenta (ebulioscopia); temperatura de congelamento diminui (crioscopia).
- Essencial: pressão de vapor diminui | ebulição aumenta | congelamento diminui
- Aceita: tonometria | abaixa o ponto de fusão
- Erro comum: Achar que o soluto aumenta a temperatura de congelamento.

### qui-f122 · Q10.2 (osmose, pressão osmótica e soluções isotônicas) · conceito · peso 3
- Frente: Na osmose, o que atravessa a membrana semipermeável e em que sentido?
- Verso: O solvente (água) passa do meio menos concentrado (hipotônico) para o mais concentrado (hipertônico).
- Essencial: o solvente (água) | do menos para o mais concentrado
- Aceita: do hipotônico para o hipertônico
- Erro comum: Dizer que o soluto atravessa a membrana.

### qui-f123 · Q10.2 (osmose, pressão osmótica e soluções isotônicas) · exemplo · peso 2
- Frente: O que acontece com uma hemácia colocada em água pura e em solução hipertônica?
- Verso: Em água pura (hipotônica), ganha água, incha e pode romper (hemólise). Em meio hipertônico, perde água e murcha.
- Essencial: água pura: incha e pode romper | hipertônica: murcha
- Aceita: hemólise | crenação
- Erro comum: Inverter: hemácia murcha em água pura.

### qui-f124 · Q10.2 (osmose, pressão osmótica e soluções isotônicas) · formula · peso 2
- Frente: Qual a fórmula da pressão osmótica?
- Verso: π = [X] · R · T · i, com [X] em mol/L, T em kelvin e i o número de partículas por fórmula.
- Essencial: π = M·R·T·i
- Aceita: π = C·R·T·i | πV = nRTi
- Erro comum: Esquecer o fator i: NaCl 0,1 mol/L tem a pressão osmótica de glicose 0,2 mol/L.

### qui-f125 · Q11.1 (cadeias carbônicas, classificação do carbono e da cadeia) · conceito · peso 2
- Frente: Como se classifica um carbono em primário, secundário, terciário e quaternário?
- Verso: Pelo número de outros carbonos ligados a ele: 1 (primário), 2 (secundário), 3 (terciário) ou 4 (quaternário).
- Essencial: número de carbonos ligados a ele
- Aceita: carbonos vizinhos | 1, 2, 3, 4 carbonos
- Erro comum: Contar O, N ou H como vizinhos, ou contar a dupla como dois carbonos.

### qui-f126 · Q11.1 (cadeias carbônicas, classificação do carbono e da cadeia) · identificar · peso 2
- Frente: Quando uma cadeia carbônica é heterogênea?
- Verso: Quando há heteroátomo (O, N, S...) entre dois carbonos. OH ou NH₂ na ponta não torna a cadeia heterogênea.
- Essencial: heteroátomo entre dois carbonos
- Aceita: átomo diferente de C intercalado na cadeia
- Erro comum: Classificar como heterogênea a cadeia de um álcool só porque tem oxigênio.

### qui-f127 · Q11.2 (hidrocarbonetos: nomenclatura e identificação) · conceito · peso 2
- Frente: O que indicam o prefixo, o infixo e o sufixo no nome de um composto orgânico?
- Verso: Prefixo: número de carbonos da cadeia principal (met, et, prop...). Infixo: tipo de ligação (an, en, in). Sufixo: função (o, ol, al, ona...).
- Essencial: prefixo: número de carbonos | infixo: tipo de ligação | sufixo: função
- Aceita: intermediário = infixo
- Erro comum: Trocar 'en' (dupla) com 'in' (tripla).

### qui-f128 · Q11.2 (hidrocarbonetos: nomenclatura e identificação) · exemplo · peso 2
- Frente: Qual o nome IUPAC de CH₃–CH(CH₃)–CH₂–CH₂–CH₃?
- Verso: 2-metilpentano: cadeia principal de 5 carbonos, numerada pela ponta mais próxima do metil.
- Essencial: 2-metilpentano
- Aceita: 2-metil-pentano | isoexano (nome usual)
- Erro comum: Numerar pela outra ponta e escrever 4-metilpentano.

### qui-f129 · Q11.3 (funções oxigenadas) · comparar · peso 3
- Frente: Diferencie álcool, fenol e éter.
- Verso: Álcool: OH em carbono saturado. Fenol: OH ligado direto a anel aromático. Éter: oxigênio entre dois carbonos (R–O–R').
- Essencial: álcool: OH em C saturado | fenol: OH no anel aromático | éter: O entre carbonos
- Aceita: hidroxila | R–OH, Ar–OH, R–O–R'
- Erro comum: Chamar de fenol um OH preso a uma cadeia lateral do anel: isso é álcool.

### qui-f130 · Q11.3 (funções oxigenadas) · comparar · peso 3
- Frente: Como distinguir aldeído, cetona, ácido carboxílico e éster pelo entorno da carbonila (C=O)?
- Verso: Aldeído: C=O na ponta (–CHO). Cetona: C=O entre dois carbonos. Ácido carboxílico: –COOH. Éster: –COO– com o O ligado a outro carbono.
- Essencial: aldeído: –CHO (ponta) | cetona: C=O entre carbonos | ácido: –COOH | éster: –COO–C
- Aceita: formila | carboxila | R–COO–R'
- Erro comum: Confundir éster com éter: o éster tem a carbonila vizinha ao oxigênio.

### qui-f131 · Q11.4 (funções nitrogenadas, haletos e funções mistas) · comparar · peso 3
- Frente: Diferencie amina de amida.
- Verso: Amina: nitrogênio ligado só a carbonos e hidrogênios (R–NH₂), com caráter básico. Amida: nitrogênio ligado direto ao carbono da carbonila (R–CO–NH₂).
- Essencial: amina: N sem carbonila vizinha | amida: N ligado à carbonila
- Aceita: R–NH₂ e R–CO–NH₂ | amida é praticamente neutra
- Erro comum: Chamar de amina todo grupo com NH₂, sem olhar se há C=O ao lado.

### qui-f132 · Q11.4 (funções nitrogenadas, haletos e funções mistas) · identificar · peso 2
- Frente: Quais funções orgânicas estão presentes em todo α-aminoácido?
- Verso: Amina (–NH₂) e ácido carboxílico (–COOH), ligados ao mesmo carbono (o carbono α).
- Essencial: amina | ácido carboxílico
- Aceita: grupo amino e grupo carboxila | NH₂ e COOH
- Erro comum: Responder 'amida': a amida só aparece quando os aminoácidos se ligam (ligação peptídica).

### qui-f133 · Q11.5 (isomeria plana) · conceito · peso 3
- Frente: O que são isômeros?
- Verso: Compostos diferentes com a mesma fórmula molecular e estruturas diferentes.
- Essencial: mesma fórmula molecular | estruturas diferentes
- Aceita: mesmos átomos em arranjos diferentes
- Erro comum: Chamar de isômeros compostos da mesma função com fórmulas moleculares diferentes.

### qui-f134 · Q11.5 (isomeria plana) · exemplo · peso 3
- Frente: Etanol e metoximetano (ambos C₂H₆O) são que tipo de isômeros?
- Verso: Isômeros planos de função: um é álcool e o outro é éter.
- Essencial: isomeria de função
- Aceita: isomeria funcional | álcool × éter
- Erro comum: Responder metameria: metameria é entre compostos da mesma função.

### qui-f135 · Q11.5 (isomeria plana) · comparar · peso 2
- Frente: Diferencie isomeria de cadeia, de posição e metameria (compensação).
- Verso: Cadeia: muda o esqueleto carbônico (normal × ramificada, aberta × fechada). Posição: muda o lugar de grupo, ramificação ou insaturação. Metameria: muda a posição do heteroátomo, mesma função.
- Essencial: cadeia: muda o esqueleto | posição: muda o lugar do grupo ou da dupla | metameria: muda a posição do heteroátomo
- Aceita: compensação
- Erro comum: Chamar de isomeria de função o par ciclobutano/but-1-eno, que é de cadeia.

### qui-f136 · Q11.5 (isomeria plana) · conceito · peso 1
- Frente: O que é tautomeria e qual o exemplo clássico?
- Verso: Isomeria em equilíbrio dinâmico pela migração de um H: enol ⇌ aldeído ou cetona. Ex.: etenol ⇌ etanal.
- Essencial: isômeros em equilíbrio dinâmico | enol ⇌ aldeído ou cetona
- Aceita: ceto-enólica | aldo-enólica
- Erro comum: Achar que o enol predomina: no equilíbrio predomina a forma com carbonila.

### qui-f137 · Q11.6 (isomeria espacial: geométrica e óptica, carbono quiral) · conceito · peso 3
- Frente: Qual a condição para um alceno ter isomeria geométrica (cis-trans)?
- Verso: Dupla C=C em que cada carbono da dupla tem dois ligantes diferentes entre si.
- Essencial: dupla C=C | cada carbono da dupla com dois ligantes diferentes
- Aceita: isomeria E/Z | ligantes diferentes nos dois carbonos
- Erro comum: Ver cis-trans no but-1-eno: o C1 tem dois hidrogênios.

### qui-f138 · Q11.6 (isomeria espacial: geométrica e óptica, carbono quiral) · conceito · peso 3
- Frente: O que é carbono quiral (assimétrico)?
- Verso: Carbono saturado ligado a quatro grupos diferentes entre si.
- Essencial: quatro ligantes diferentes
- Aceita: carbono assimétrico | estereocentro
- Erro comum: Comparar só o átomo vizinho: –CH₂CH₃ e –CH₂CH₂CH₃ são ligantes diferentes.

### qui-f139 · Q11.6 (isomeria espacial: geométrica e óptica, carbono quiral) · formula · peso 3
- Frente: Quantos isômeros ópticos ativos tem uma molécula com n carbonos quirais diferentes?
- Verso: 2ⁿ isômeros ópticos ativos, que formam 2ⁿ⁻¹ misturas racêmicas.
- Essencial: 2ⁿ
- Aceita: 2 elevado a n | regra de Le Bel-Van't Hoff
- Erro comum: Usar 2ⁿ em molécula com carbonos quirais iguais, que pode ter forma meso.

### qui-f140 · Q11.6 (isomeria espacial: geométrica e óptica, carbono quiral) · exemplo · peso 2
- Frente: Quantos carbonos quirais tem o ácido lático, CH₃–CH(OH)–COOH?
- Verso: Um: o carbono central, ligado a H, OH, CH₃ e COOH. Por isso há dois enantiômeros.
- Essencial: 1 carbono quiral
- Aceita: um | dois isômeros ópticos ativos
- Erro comum: Contar o carbono da carboxila, que tem dupla ligação e não pode ser quiral.

### qui-f141 · Q11.7 (acidez, basicidade, solubilidade e ponto de ebulição em orgânica) · comparar · peso 3
- Frente: Para massas molares parecidas, ordene pelo ponto de ebulição: ácido carboxílico, álcool, cetona e éter.
- Verso: Ácido carboxílico > álcool > cetona > éter: o ácido faz mais ligações de hidrogênio, e cetona e éter não fazem entre si.
- Essencial: ácido > álcool > cetona > éter
- Aceita: éter < cetona < álcool < ácido
- Erro comum: Ordenar pela massa molar quando o tipo de interação é diferente.

### qui-f142 · Q11.7 (acidez, basicidade, solubilidade e ponto de ebulição em orgânica) · comparar · peso 3
- Frente: Ordene a acidez de álcool, fenol e ácido carboxílico.
- Verso: Ácido carboxílico > fenol > álcool.
- Essencial: ácido carboxílico > fenol > álcool
- Aceita: álcool < fenol < ácido carboxílico
- Erro comum: Pôr o fenol abaixo do álcool: o fenol reage com NaOH, o álcool praticamente não.

### qui-f143 · Q12.1 (adição, substituição e eliminação) · comparar · peso 3
- Frente: Diferencie reação de adição, de substituição e de eliminação.
- Verso: Adição: a dupla ou tripla se abre e átomos entram, sem nada sair. Substituição: um átomo ou grupo sai e outro entra. Eliminação: saem grupos de carbonos vizinhos e forma-se dupla.
- Essencial: adição: entra sem sair (abre dupla) | substituição: troca um grupo por outro | eliminação: sai e forma dupla
- Aceita: hidrogenação é adição | desidratação intramolecular é eliminação
- Erro comum: Chamar de substituição uma reação em que só entram átomos.

### qui-f144 · Q12.1 (adição, substituição e eliminação) · conceito · peso 3
- Frente: O que diz a regra de Markovnikov?
- Verso: Na adição de HX ou H₂O a um alceno, o H entra no carbono da dupla mais hidrogenado e o X (ou OH) no menos hidrogenado.
- Essencial: H vai para o carbono da dupla mais hidrogenado
- Aceita: X no carbono menos hidrogenado | carbono mais substituído recebe o X
- Erro comum: Inverter: pôr o H no carbono com menos hidrogênios.

### qui-f145 · Q12.1 (adição, substituição e eliminação) · exemplo · peso 2
- Frente: Qual o produto principal de CH₂=CH–CH₃ + HBr?
- Verso: 2-bromopropano, CH₃–CHBr–CH₃, pela regra de Markovnikov.
- Essencial: 2-bromopropano
- Aceita: CH₃CHBrCH₃ | brometo de isopropila
- Erro comum: Responder 1-bromopropano, pondo o Br no carbono da ponta.

### qui-f146 · Q12.2 (oxidação, redução, esterificação e saponificação) · comparar · peso 3
- Frente: O que se obtém na oxidação de um álcool primário, de um secundário e de um terciário?
- Verso: Primário: aldeído e depois ácido carboxílico. Secundário: cetona. Terciário: não oxida em condições brandas.
- Essencial: primário: aldeído → ácido | secundário: cetona | terciário: não oxida
- Aceita: KMnO₄ ou K₂Cr₂O₇ como oxidante
- Erro comum: Dizer que o secundário dá aldeído.

### qui-f147 · Q12.2 (oxidação, redução, esterificação e saponificação) · formula · peso 3
- Frente: Escreva a esterificação entre ácido acético e etanol.
- Verso: CH₃COOH + CH₃CH₂OH ⇌ CH₃COOCH₂CH₃ + H₂O: forma etanoato de etila (acetato de etila) e água.
- Essencial: ácido + álcool ⇌ éster + água | etanoato de etila
- Aceita: acetato de etila | CH₃COOC₂H₅
- Erro comum: Esquecer a água formada ou pôr a carbonila do éster vindo do álcool.

### qui-f148 · Q12.2 (oxidação, redução, esterificação e saponificação) · conceito · peso 3
- Frente: O que é saponificação e quais os produtos quando o éster é um triglicerídeo?
- Verso: Hidrólise de éster em meio básico. Triglicerídeo + base forte (NaOH) → sabão (sal de ácido graxo) + glicerol.
- Essencial: hidrólise básica de éster | sabão + glicerol
- Aceita: glicerina | propano-1,2,3-triol | carboxilato de sódio
- Erro comum: Dizer que forma ácido graxo livre: forma o sal dele, que é o sabão.

### qui-f149 · Q12.2 (oxidação, redução, esterificação e saponificação) · exemplo · peso 2
- Frente: Quais os produtos da ozonólise (com Zn) do 2-metilbut-2-eno, (CH₃)₂C=CH–CH₃?
- Verso: Propanona e etanal: o carbono da dupla sem H vira cetona; o que tem H vira aldeído.
- Essencial: propanona (acetona) | etanal (acetaldeído)
- Aceita: acetona e acetaldeído
- Erro comum: Dar ácido acético no lugar do etanal: ácido só sai na oxidação enérgica.

### qui-f150 · Q12.3 (polímeros de adição e de condensação, reciclagem) · comparar · peso 3
- Frente: Diferencie polímero de adição de polímero de condensação.
- Verso: Adição: monômeros com dupla C=C se somam e nada sai (polietileno, PVC). Condensação: grupos reagem liberando molécula pequena, em geral água (PET, náilon).
- Essencial: adição: monômero com dupla, nada sai | condensação: sai molécula pequena (água)
- Aceita: poliadição e policondensação
- Erro comum: Classificar náilon ou PET como polímero de adição.

### qui-f151 · Q12.3 (polímeros de adição e de condensação, reciclagem) · identificar · peso 2
- Frente: Quais os monômeros do PVC, do polietileno, do poliestireno e do teflon?
- Verso: PVC: cloroeteno (cloreto de vinila). Polietileno: eteno. Poliestireno: estireno (vinilbenzeno). Teflon: tetrafluoroeteno.
- Essencial: PVC: cloroeteno | polietileno: eteno | poliestireno: estireno | teflon: tetrafluoroeteno
- Aceita: cloreto de vinila | etileno | fenileteno
- Erro comum: Achar que o monômero do PVC é o cloroetano, sem a dupla.

### qui-f152 · Q12.3 (polímeros de adição e de condensação, reciclagem) · identificar · peso 2
- Frente: Que ligação une os monômeros no náilon e no kevlar?
- Verso: Ligação amida (–CO–NH–): são poliamidas, polímeros de condensação, com a mesma ligação das proteínas.
- Essencial: amida (–CO–NH–)
- Aceita: poliamida | ligação peptídica
- Erro comum: Dizer que é ligação éster, que é a do PET.

### qui-f153 · Q12.4 (bioquímica: carboidratos, lipídios, proteínas e ácidos nucleicos) · identificar · peso 3
- Frente: O que é a ligação peptídica?
- Verso: Ligação amida (–CO–NH–) entre o carbono da carbonila de um aminoácido e o nitrogênio do grupo amino do seguinte, com saída de água.
- Essencial: ligação amida | entre carboxila e grupo amino | sai água (condensação)
- Aceita: –CO–NH– | C da carbonila ligado ao N
- Erro comum: Apontar a ligação C–N do carbono α com o NH₂, que não é a ligação peptídica.

### qui-f154 · Q12.4 (bioquímica: carboidratos, lipídios, proteínas e ácidos nucleicos) · comparar · peso 2
- Frente: Classifique como mono, di ou polissacarídeo: glicose, sacarose, amido, celulose e glicogênio.
- Verso: Monossacarídeo: glicose. Dissacarídeo: sacarose (glicose + frutose). Polissacarídeos: amido e celulose (vegetais) e glicogênio (animal).
- Essencial: glicose: mono | sacarose: di | amido, celulose e glicogênio: poli
- Aceita: oses e osídeos
- Erro comum: Dizer que o glicogênio é reserva vegetal: é animal; a vegetal é o amido.

### qui-f155 · Q12.5 (química ambiental: combustíveis, poluentes, chuva ácida e efeito estufa) · identificar · peso 3
- Frente: Quais óxidos causam a chuva ácida?
- Verso: Óxidos de enxofre (SO₂, SO₃) e de nitrogênio (NO₂), que com a água formam H₂SO₃, H₂SO₄ e HNO₃.
- Essencial: óxidos de enxofre (SO₂, SO₃) | óxidos de nitrogênio (NO₂)
- Aceita: SOx e NOx
- Erro comum: Incluir CO: é óxido neutro e não acidifica a chuva.

### qui-f156 · Q12.5 (química ambiental: combustíveis, poluentes, chuva ácida e efeito estufa) · conceito · peso 2
- Frente: Por que a chuva sem poluição já é levemente ácida, com pH perto de 5,6?
- Verso: Pelo CO₂ do ar dissolvido, que forma ácido carbônico (H₂CO₃), um ácido fraco. Chuva ácida é a de pH abaixo de 5,6.
- Essencial: CO₂ dissolvido forma ácido carbônico
- Aceita: H₂CO₃ | gás carbônico
- Erro comum: Chamar de chuva ácida qualquer chuva com pH menor que 7.

### qui-f157 · Q12.5 (química ambiental: combustíveis, poluentes, chuva ácida e efeito estufa) · comparar · peso 2
- Frente: Qual o principal responsável pela intensificação do efeito estufa e qual pela destruição da camada de ozônio?
- Verso: Efeito estufa: principalmente o CO₂ (também CH₄ e N₂O). Camada de ozônio: os CFCs, que liberam cloro radicalar na estratosfera.
- Essencial: efeito estufa: CO₂ | ozônio: CFCs (cloro)
- Aceita: gás carbônico | clorofluorocarbonetos
- Erro comum: Tratar os dois problemas como um só, ou culpar o CO₂ pelo buraco na camada de ozônio.

### qui-f158 · Q12.5 (química ambiental: combustíveis, poluentes, chuva ácida e efeito estufa) · formula · peso 2
- Frente: Escreva a equação balanceada da combustão completa do etanol.
- Verso: C₂H₅OH + 3 O₂ → 2 CO₂ + 3 H₂O.
- Essencial: C₂H₅OH + 3 O₂ → 2 CO₂ + 3 H₂O
- Aceita: C₂H₆O + 3 O₂ → 2 CO₂ + 3 H₂O
- Erro comum: Esquecer o oxigênio do próprio etanol e pôr 3,5 O₂.
