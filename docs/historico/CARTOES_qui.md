# Cartões de teoria — Química (qui), 29/10/2026

Gravado em `qui/index.html` e `qui/dados.json` (`D['teoria'][mod]['cartoes']` e `D['areas']`). Backups: `qui/index.html.bak_cartoes`, `qui/dados.json.bak_cartoes`.
Conferência pós-gravação: JSON válido; `dados.json` = bloco do `index.html`; banco com 571 questões, idêntico; `nomesub`, `glossario` e os campos antigos da teoria (resumo, formulas, erro) intactos; HTML fora do `<script id="dados">` intacto. Só entraram `cartoes` e `areas`.

## Método de conferência
- Base: nomes dos 57 conteúdos, teoria atual e o campo `conceito` das 571 questões, agrupado por conteúdo, para cobrir o que de fato cai.
- Formato checado por script: título ≤ 5 palavras; 'oque' ≤ 2 frases; frases ≤ 22 palavras; caderno ≤ 4 linhas de ≤ 60 caracteres; vírgula decimal; sem emoji.
- 36 equações químicas balanceadas conferidas por script (átomos e carga) e 3 equações nucleares (A e Z); números atômicos conferidos na tabela do RDKit.
- RDKit: fórmulas de isômeros (C₂H₆O, C₄H₁₀O, C₄H₈, C₃H₆O, C₂H₄O, C₆H₁₂O₆), carbono quiral do ácido lático, cis-trans do but-2-eno (e ausência no but-1-eno), classes de carbono do metilpropano, amina primária da terc-butilamina, contagem σ/π de eteno e etino, massas molares e balanço Gly + Ala → dipeptídeo + H₂O.
- Todas as contas dos exemplos refeitas em Python (pH do ácido acético, Hess, ΔHf do metano, energia de ligação do HCl, Faraday, gases, diluição, titulação etc.).
- Segunda passada só caçando erro factual, exemplo errado e frase longa: corrigidos 'óxido básico = metal dos grupos 1 e 2' (BeO é anfótero; virou lista de exemplos), 'teste de Tollens/Fehling positivo indica aldeído' (frutose também dá positivo; virou 'em geral'), poder calorífico da gasolina (47 → 46 kJ/g), coerência da regra de cadeia principal.

## Decisão a registrar
- Cadeia principal: os cartões usam a regra cobrada nos vestibulares brasileiros (a mais longa que contém as insaturações, IUPAC 1993). A recomendação IUPAC 2013 prioriza só o comprimento; os casos em que as duas divergem são raros em prova.

## Áreas de revisão (`D['areas']`)
- **Química geral e inorgânica** (`qger`; Q01, Q02, Q03): Átomo, tabela periódica, ligações, funções inorgânicas, nox e separação de misturas. Tópicos: Modelos atômicos e distribuição eletrônica; Tabela e propriedades periódicas; Ligações, geometria e forças intermoleculares; Ácidos, bases, sais e óxidos; Nox e oxirredução; Substâncias e separação de misturas.
- **Cálculos químicos** (`qcalc`; Q04, Q05, Q06): Contas com mol: estequiometria, concentração de soluções e gases. Tópicos: Mol e massa molar; Fórmulas mínima e molecular; Estequiometria, limitante, pureza e rendimento; Concentração, diluição e titulação; Solubilidade; Gases: PV = nRT e misturas.
- **Físico-química** (`qfis`; Q07, Q08, Q10): Energia, velocidade e equilíbrio das reações, pH e propriedades coligativas. Tópicos: Termoquímica e lei de Hess; Cinética e catalisador; Equilíbrio e Le Chatelier; pH, hidrólise, tampão e Kps; Propriedades coligativas e osmose.
- **Eletroquímica e radioatividade** (`qele`; Q09, Q03): Pilhas, eletrólise, corrosão e reações nucleares, com base em nox e oxirredução. Tópicos: Nox e oxirredução; Pilhas e ddp; Eletrólise e Faraday; Corrosão e metal de sacrifício; Emissões radioativas e meia-vida; Fissão e fusão.
- **Química orgânica** (`qorg`; Q11, Q12): Funções, nomenclatura, isomeria, propriedades e reações dos compostos de carbono. Tópicos: Cadeias carbônicas; Funções orgânicas; Nomenclatura; Isomeria plana e espacial; Propriedades físicas, acidez e basicidade; Reações orgânicas; Polímeros.
- **Química da vida e do ambiente** (`qvid`; Q12, Q10, Q08): Biomoléculas, osmose e tampão no corpo, e os problemas ambientais ligados à química. Tópicos: Carboidratos, lipídios e proteínas; Osmose e soro fisiológico; Tampão do sangue; Efeito estufa e chuva ácida; Camada de ozônio; Combustíveis e hidrogênio.

## Cartões por módulo

### Q01 — Átomo e tabela periódica (10 cartões)

**Q01.1 · Modelos atômicos em ordem**  
O que é: Cada modelo nasceu de um experimento que derrubou o anterior. Dalton: esfera maciça; Thomson: pudim com passas; Rutherford: núcleo e eletrosfera; Bohr: níveis de energia.  
Como identificar: O enunciado descreve um desenho ou um experimento e pede o autor. Raios catódicos: Thomson. Folha de ouro: Rutherford. Cor emitida: Bohr.  
Exemplo: Rutherford lançou partículas alfa contra uma folha fina de ouro. Quase todas passaram direto e poucas desviaram muito. Conclusão: átomo quase vazio, com núcleo pequeno, denso e positivo.  
Caderno: Dalton (1808): esfera maciça e indivisível | Thomson (1904): massa positiva com elétrons | Rutherford (1911): núcleo + eletrosfera | Bohr (1913): elétron em níveis de energia  
Cuidado: O nêutron é de Chadwick (1932), não de Rutherford; Rutherford propôs o núcleo e identificou o próton.

**Q01.1 · Bohr e as cores**  
O que é: No modelo de Bohr, o elétron só ocupa níveis de energia permitidos. Ao receber energia ele sobe; ao voltar, emite luz de cor definida.  
Como identificar: Fogos de artifício, teste de chama, letreiro luminoso ou lâmpada de sódio: a resposta é o modelo de Bohr.  
Exemplo: Sal de cozinha caído na chama do fogão deixa a chama amarela (sódio). Nos fogos, estrôncio dá vermelho e cobre dá verde-azulado.  
Caderno: absorve energia: elétron sobe de nível | volta ao nível de origem: emite luz (fóton) | cor = diferença de energia entre os níveis | cada elemento tem cores próprias (espectro)  
Cuidado: Thomson e Rutherford não explicam a cor emitida; só Bohr introduz níveis de energia fixos.

**Q01.2 · Z, A e nêutrons**  
O que é: Z é o número de prótons e define o elemento. A é a soma de prótons e nêutrons do núcleo.  
Como identificar: Notação com dois números junto ao símbolo: o de cima é A, o de baixo é Z. Pediu nêutrons? Subtraia.  
Exemplo: Cloro-37: Z = 17 e A = 37, então N = 37 − 17 = 20 nêutrons. O cloro-35 tem 18 nêutrons.  
Caderno: A = Z + N | N = A − Z | átomo neutro: elétrons = prótons = Z | notação: A em cima, Z embaixo (³⁷₁₇Cl)  
Cuidado: A não é a massa atômica da tabela: A é inteiro e vale para um isótopo; a massa da tabela é uma média.

**Q01.2 · Íons: conta de elétrons**  
O que é: Íon é átomo que ganhou ou perdeu elétrons. Os prótons não mudam; só muda a eletrosfera.  
Como identificar: Carga escrita no alto, à direita (²⁺, ³⁻). A questão pede elétrons ou espécies isoeletrônicas, com o mesmo número de elétrons.  
Exemplo: Fe³⁺ (Z = 26) tem 26 prótons e 23 elétrons. Na⁺, Mg²⁺, F⁻ e O²⁻ têm 10 elétrons cada: são isoeletrônicos.  
Caderno: elétrons = Z − carga | cátion X²⁺: perdeu 2 e⁻ → Z − 2 elétrons | ânion Y²⁻: ganhou 2 e⁻ → Z + 2 elétrons | isoeletrônicos: mesmo número de elétrons  
Cuidado: Cátion não perde próton: quem sai é elétron, e o Z continua o mesmo.

**Q01.2 · Isótopos, isóbaros e isótonos**  
O que é: São comparações entre núcleos. Isótopos têm o mesmo Z; isóbaros, o mesmo A; isótonos, o mesmo número de nêutrons.  
Como identificar: Dois nuclídeos lado a lado e a pergunta sobre a relação entre eles. Compare Z, A e N, um de cada vez.  
Exemplo: ¹H, ²H e ³H são isótopos do hidrogênio, com 0, 1 e 2 nêutrons. ¹⁴C e ¹⁴N são isóbaros. ³⁷Cl e ⁴⁰Ca são isótonos (20 nêutrons).  
Caderno: isótoPos: mesmo Z (Prótons) | isóbAros: mesmo A (massa) | isótoNos: mesmo N (Nêutrons) | só isótopos são o mesmo elemento  
Cuidado: Isóbaros são elementos diferentes, apesar do mesmo número de massa.

**Q01.3 · Distribuição eletrônica**  
O que é: Os elétrons ocupam os subníveis em ordem crescente de energia, pelo diagrama de Pauling. Capacidade: s 2, p 6, d 10, f 14.  
Como identificar: A questão dá Z e pede o subnível mais energético, a camada de valência ou o número de camadas.  
Exemplo: Ferro, Z = 26: 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶. Mais energético: 3d⁶. Camada de valência: a 4ª (4s²).  
Caderno: ordem: 1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p | depois: 6s 4f 5d 6p 7s 5f 6d 7p | máximo por subnível: s² p⁶ d¹⁰ f¹⁴ | valência = camada de maior número  
Cuidado: O 4s enche antes do 3d, mas a valência é a camada de maior número: no ferro, a 4ª.

**Q01.4 · Localizar pela distribuição**  
O que é: O período é o número de camadas ocupadas. Nos elementos representativos, a família sai dos elétrons da camada de valência.  
Como identificar: A questão dá Z ou a distribuição e pede grupo, período ou classificação: metal, ametal, gás nobre, transição.  
Exemplo: Cloro, Z = 17: 1s² 2s² 2p⁶ 3s² 3p⁵. Três camadas: 3º período. Sete elétrons de valência: grupo 17 (7A), halogênio.  
Caderno: período = número de camadas | termina em s ou p: representativo | termina em d: transição; em f: transição interna | grupo: s¹ → 1; s² → 2; p¹ → 13 … p⁶ → 18  
Cuidado: O hélio termina em 1s², mas é gás nobre (grupo 18), não metal alcalinoterroso.

**Q01.4 · Famílias com nome próprio**  
O que é: Elementos da mesma família têm o mesmo número de elétrons de valência. Por isso reagem de modo parecido.  
Como identificar: O enunciado cita alcalino, halogênio ou calcogênio, ou pede semelhança química entre dois elementos.  
Exemplo: Sódio e potássio, ambos do grupo 1, reagem violentamente com água e liberam gás hidrogênio. Por isso ficam guardados sob querosene.  
Caderno: 1: metais alcalinos (Li, Na, K…) | 2: metais alcalinoterrosos (Be, Mg, Ca…) | 16: calcogênios (O, S, Se…) | 17: halogênios; 18: gases nobres  
Cuidado: O hidrogênio aparece no grupo 1, mas não é metal alcalino.

**Q01.5 · Raio atômico e iônico**  
O que é: O raio cresce descendo na família, porque há mais camadas. No período, cresce para a esquerda, porque o núcleo atrai menos.  
Como identificar: Pede o maior átomo, ordena raios ou compara um átomo com seu íon.  
Exemplo: Na⁺ é menor que Na, porque perdeu a 3ª camada. Cl⁻ é maior que Cl. Entre isoeletrônicos: O²⁻ > F⁻ > Na⁺ > Mg²⁺.  
Caderno: raio: ↑ descendo a família; ↑ para a esquerda | cátion < átomo neutro < ânion | isoeletrônicos: mais prótons → menor raio  
Cuidado: No mesmo período o número de camadas é igual; quem encolhe o raio é a carga nuclear maior.

**Q01.5 · Ionização e eletronegatividade**  
O que é: Energia de ionização é a energia para arrancar um elétron do átomo isolado, gasoso. Eletronegatividade é a força de atrair elétrons numa ligação.  
Como identificar: Pede quem perde elétron mais fácil, qual ligação é mais polar, ou a leitura de um gráfico de energia de ionização por Z.  
Exemplo: O flúor é o elemento mais eletronegativo; por isso a ligação H–F é muito polar. Em cada período, o gás nobre tem a maior energia de ionização.  
Caderno: EI e eletronegatividade: ↑ para cima e direita | ordem: F > O > N ≈ Cl > Br > I > S > C > H | raio maior → energia de ionização menor | 2ª energia de ionização > 1ª, sempre  
Cuidado: Do N para o O a 1ª energia de ionização cai, contrariando a tendência; essa anomalia é cobrada.

### Q02 — Ligações e forças entre moléculas (8 cartões)

**Q02.1 · Ligação iônica**  
O que é: Metal cede elétrons e ametal recebe; os íons formados se atraem. O sólido é um retículo cristalino, não uma molécula.  
Como identificar: Metal (grupos 1, 2, alumínio) com ametal (O, S, halogênios), ou propriedades: duro, quebradiço, alto ponto de fusão.  
Exemplo: Ca²⁺ e Cl⁻: cruzando as cargas, CaCl₂. Al³⁺ e O²⁻: Al₂O₃. O sal de cozinha sólido não conduz corrente; dissolvido, conduz.  
Caderno: cruze as cargas: Al³⁺ e O²⁻ → Al₂O₃ | simplifique: Ca²⁺ e O²⁻ → CaO | grupo 1: +1; grupo 2: +2; Al: +3 | grupo 16: −2; grupo 17: −1  
Cuidado: Sólido iônico não conduz: os íons só ficam livres quando o composto é fundido ou dissolvido.

**Q02.2 · Covalente: quantas ligações**  
O que é: Ametais compartilham pares de elétrons até completar o octeto. Cada elemento faz um número típico de ligações.  
Como identificar: Pede a fórmula molecular ou estrutural a partir da família, ou a contagem de ligações simples, duplas e triplas.  
Exemplo: N₂ tem ligação tripla (N≡N); O₂ tem dupla (O=O); o gás carbônico é O=C=O; o ácido cianídrico é H–C≡N.  
Caderno: H: 1 ligação; O e S: 2 | N e P: 3; C e Si: 4 | halogênios (F, Cl, Br, I): 1 | meta: 8 elétrons na valência (H: 2)  
Cuidado: Há exceções ao octeto: no BF₃ o boro fica com 6 elétrons e no SF₆ o enxofre fica com 12.

**Q02.2 · Ligações sigma e pi**  
O que é: Toda ligação simples é sigma (σ). A dupla tem 1 σ e 1 π; a tripla tem 1 σ e 2 π.  
Como identificar: Pede a contagem de σ e π ou a hibridização de um carbono numa estrutura desenhada.  
Exemplo: Eteno, H₂C=CH₂: 5 ligações σ (4 C–H e 1 C–C) e 1 π. Etino, HC≡CH: 3 σ e 2 π.  
Caderno: simples = σ; dupla = σ + π; tripla = σ + 2π | C com 4 simples: sp³ (109,5°) | C com 1 dupla: sp² (120°) | C com tripla ou 2 duplas: sp (180°)  
Cuidado: O hidrogênio só faz ligação σ, sempre com orbital s; ligação π nunca envolve H.

**Q02.3 · Geometria pelas nuvens**  
O que é: Conte as nuvens de elétrons em volta do átomo central: ligações e pares livres. Elas se afastam o máximo possível.  
Como identificar: Pede geometria ou ângulo de ligação. O átomo central costuma ser o que aparece uma vez só na fórmula.  
Exemplo: CH₄: 4 nuvens, todas ligantes, tetraédrica (109,5°). NH₃: 4 nuvens, 1 par livre, piramidal. H₂O: 2 pares livres, angular.  
Caderno: 2 nuvens: linear (CO₂, 180°) | 3 nuvens: trigonal plana (BF₃) ou angular (SO₂) | 4 nuvens: tetraédrica, piramidal ou angular | dupla ou tripla conta como 1 nuvem  
Cuidado: Par livre conta como nuvem, mas não entra no nome da geometria: NH₃ é piramidal, não tetraédrica.

**Q02.3 · Polaridade da molécula**  
O que é: Ligação polar une átomos de eletronegatividades diferentes. A molécula só é polar se esses polos não se cancelam pela geometria.  
Como identificar: Pede molécula polar ou apolar, solubilidade em água, ou por que CO₂ é apolar e H₂O é polar.  
Exemplo: CO₂ é linear: as duas ligações C=O, polares, se cancelam, e a molécula é apolar. H₂O é angular: não cancelam, e a molécula é polar.  
Caderno: central sem par livre + ligantes iguais: apolar | apolares: CO₂, BF₃, CH₄, CCl₄ | polares: H₂O, NH₃, HCl, CHCl₃ | par livre no átomo central: em geral, polar  
Cuidado: Ligação polar não garante molécula polar: CCl₄ tem quatro ligações polares e é apolar.

**Q02.4 · Forças intermoleculares**  
O que é: São atrações entre moléculas. Da mais forte para a mais fraca: ligação de hidrogênio, dipolo-dipolo e dipolo induzido.  
Como identificar: Pede o tipo de interação, ou explica ebulição, solubilidade ou tensão superficial.  
Exemplo: A água faz ligação de hidrogênio; o HCl faz dipolo-dipolo; CO₂ e CH₄ fazem só dipolo induzido (forças de London).  
Caderno: ligação de H: H ligado a F, O ou N | dipolo-dipolo: moléculas polares | dipolo induzido: em todas; únicas nas apolares | íon-dipolo: sal dissolvido em água  
Cuidado: Ter oxigênio não basta: no éter dimetílico todo H está ligado a C, e as moléculas não fazem ligação de H entre si.

**Q02.4 · Ebulição e solubilidade**  
O que é: Quanto mais forte a atração entre moléculas, maior o ponto de ebulição. Semelhante dissolve semelhante: polar em polar, apolar em apolar.  
Como identificar: Tabela de temperaturas de ebulição, mistura de água e óleo, ou pergunta sobre qual líquido evapora primeiro.  
Exemplo: H₂O ferve a 100 °C e H₂S a cerca de −60 °C, embora o H₂S seja mais pesado. A água faz ligação de hidrogênio.  
Caderno: 1º compare o tipo de força | mesmo tipo: maior massa molar → maior PE | mesma massa: menos ramificado → maior PE | mais volátil: menor PE, maior pressão de vapor  
Cuidado: Ferver não quebra a ligação covalente O–H: só afasta as moléculas umas das outras.

**Q02.5 · Ligação metálica e ligas**  
O que é: Cátions metálicos ficam fixos num retículo, imersos num mar de elétrons livres. Isso explica brilho, condutividade e maleabilidade.  
Como identificar: Propriedades de fio, panela ou joia, ou a composição de uma liga pedida pelo nome.  
Exemplo: O fio de cobre conduz porque os elétrons livres se movem. Ouro 18 quilates tem 75% de ouro em massa (18 ÷ 24).  
Caderno: aço: ferro + carbono | bronze: cobre + estanho | latão: cobre + zinco | ouro 18 k: 75% de Au (resto, em geral, Cu e Ag)  
Cuidado: Bronze e latão têm cobre; o que os separa é o estanho (bronze) ou o zinco (latão).

### Q03 — Funções inorgânicas e nox (10 cartões)

**Q03.1 · Ácido e base: três teorias**  
O que é: Arrhenius: em água, ácido libera H⁺ e base libera OH⁻. Brønsted-Lowry: ácido doa H⁺ e base recebe; Lewis: base doa par de elétrons.  
Como identificar: Troca de próton entre duas espécies: use Brønsted. Par de elétrons ou espécie como BF₃: use Lewis.  
Exemplo: NH₃ + H₂O ⇌ NH₄⁺ + OH⁻: a água doa H⁺ e é o ácido; a amônia recebe e é a base. A água é anfótera.  
Caderno: Arrhenius: ácido → H⁺ (H₃O⁺); base → OH⁻ | Brønsted: ácido doa H⁺; base recebe H⁺ | Lewis: ácido recebe par de e⁻; base doa | par conjugado: HA / A⁻ (diferem de um H⁺)  
Cuidado: Ácido forte tem base conjugada fraca: o ânion que sobra quase não recebe o H⁺ de volta.

**Q03.1 · Nome dos ácidos**  
O que é: Hidrácido, sem oxigênio, termina em -ídrico. Oxiácido termina em -ico ou -oso, conforme o nox do elemento central.  
Como identificar: Pede o nome a partir da fórmula, o número de hidrogênios ionizáveis ou a classificação em mono-, di- ou triácido.  
Exemplo: HCl: ácido clorídrico. H₂SO₄: sulfúrico; H₂SO₃: sulfuroso. H₃PO₃ (fosforoso) tem 3 H, mas só 2 ionizáveis.  
Caderno: -ídrico → -eto (HCl → cloreto) | -ico → -ato (H₂SO₄ → sulfato) | -oso → -ito (H₂SO₃ → sulfito) | oxiácido: ionizável é o H ligado a O  
Cuidado: H₃PO₂ tem só 1 H ionizável: conte os H ligados a oxigênio, não todos os H da fórmula.

**Q03.2 · Sais: nome e fórmula**  
O que é: Sal vem da neutralização: cátion da base com ânion do ácido. O nome é o do ânion, mais 'de', mais o do cátion.  
Como identificar: Pede a fórmula a partir do nome, ou o inverso, inclusive de sal hidratado.  
Exemplo: Sulfato de ferro(II) hepta-hidratado: FeSO₄·7H₂O. Carbonato de cálcio, CaCO₃, é o calcário e a casca do ovo.  
Caderno: nome: ânion + de + cátion | Fe²⁺: ferro(II), ferroso; Fe³⁺: ferro(III), férrico | SO₄²⁻ sulfato; NO₃⁻ nitrato; CO₃²⁻ carbonato | PO₄³⁻ fosfato; HCO₃⁻ hidrogenocarbonato  
Cuidado: O algarismo romano é a carga do metal, não um índice: em Fe₂(SO₄)₃ o ferro é +3.

**Q03.2 · Óxidos: classificação**  
O que é: Óxido é composto de dois elementos em que o oxigênio é o mais eletronegativo. O comportamento frente à água, ácido e base define o tipo.  
Como identificar: Gás borbulhado em água muda o pH? A questão pede óxido ácido, básico, anfótero ou neutro.  
Exemplo: CO₂ + H₂O ⇌ H₂CO₃ deixa o refrigerante ácido. CaO + H₂O → Ca(OH)₂: a cal viva vira cal hidratada, básica.  
Caderno: ácido: ametal + O (CO₂, SO₂, SO₃, NO₂) | básico: Na₂O, K₂O, CaO, MgO | anfótero: ZnO, Al₂O₃ | neutro: CO, NO, N₂O  
Cuidado: O CO é óxido neutro: é muito tóxico, mas não acidifica a água da chuva.

**Q03.3 · Tipos de reação inorgânica**  
O que é: Síntese junta, análise separa, simples troca substitui um elemento e dupla troca permuta os íons.  
Como identificar: Conte reagentes e produtos. Dupla troca ocorre quando forma precipitado, gás ou água.  
Exemplo: Zn + 2 HCl → ZnCl₂ + H₂ é simples troca. CaCO₃ + 2 HCl → CaCl₂ + H₂O + CO₂ é dupla troca com liberação de gás.  
Caderno: síntese: A + B → AB | análise: AB → A + B | simples troca: A + BC → AC + B | dupla troca: AB + CD → AD + CB  
Cuidado: Simples troca só ocorre se o elemento livre for mais reativo: Cl₂ desloca Br⁻, mas I₂ não desloca Cl⁻.

**Q03.3 · Balanceamento por tentativa**  
O que é: Ajuste os coeficientes até cada elemento ter o mesmo número de átomos dos dois lados. Use os menores inteiros.  
Como identificar: Pede a soma dos coeficientes ou a equação corretamente balanceada.  
Exemplo: Al(OH)₃ + 3 HCl → AlCl₃ + 3 H₂O. Soma dos coeficientes: 1 + 3 + 1 + 3 = 8.  
Caderno: ordem MACHO: metal, ametal, C, H, O | coeficiente multiplica a fórmula inteira | nunca mude o índice da fórmula | deu fração? multiplique tudo para inteiros  
Cuidado: O coeficiente 1 não se escreve, mas entra na soma dos coeficientes.

**Q03.4 · Cálculo do nox**  
O que é: Nox é a carga que o átomo teria se todas as ligações fossem iônicas. A soma dos nox dá a carga da espécie.  
Como identificar: Pede o nox de um elemento numa fórmula, ou o maior e o menor nox de um elemento entre várias espécies.  
Exemplo: H₂SO₄: 2(+1) + x + 4(−2) = 0, então o enxofre é +6. No SO₂ ele é +4; no H₂S, −2.  
Caderno: Σ nox = 0 (neutro) ou = carga (íon) | H: +1 (−1 em hidreto metálico) | O: −2 (−1 em peróxido; +2 em OF₂) | substância simples: 0; grupo 1: +1; grupo 2: +2  
Cuidado: No O₂ e no O₃ o nox do oxigênio é 0, porque são substâncias simples.

**Q03.4 · Oxidante e redutor**  
O que é: Oxidação é perda de elétrons, e o nox sobe; redução é ganho, e o nox desce. As duas acontecem sempre juntas.  
Como identificar: Equação com elementos que mudam de nox; pede quem oxida, quem reduz, o agente oxidante ou o redutor.  
Exemplo: Zn + Cu²⁺ → Zn²⁺ + Cu. O zinco oxida (0 → +2) e é o agente redutor. O Cu²⁺ reduz (+2 → 0) e é o agente oxidante.  
Caderno: oxida: perde e⁻, nox ↑ → agente redutor | reduz: ganha e⁻, nox ↓ → agente oxidante | elétrons perdidos = elétrons ganhos | balanceio: Δnox × atomicidade, depois cruze  
Cuidado: Agente oxidante é quem se reduz: o nome diz o que ele faz com o outro, não o que sofre.

**Q03.5 · Substância, mistura e alotropia**  
O que é: Substância pura tem composição fixa e temperaturas de fusão e ebulição constantes. Mistura, em geral, muda de estado com temperatura variando.  
Como identificar: Gráfico de aquecimento com patamares, classificação de água, ar ou ozônio, ou pergunta sobre alótropos.  
Exemplo: O₂ e O₃ são alótropos do oxigênio; grafite e diamante, do carbono. Água é substância composta; o ar é mistura.  
Caderno: simples: 1 elemento (O₂, Fe); composta: 2+ (H₂O) | alotropia: um elemento, substâncias diferentes | C: grafite, diamante, fulereno; O: O₂ e O₃ | azeotrópica: ebulição a T fixa; eutética: fusão  
Cuidado: Mistura azeotrópica ferve a temperatura constante e não se separa por destilação comum.

**Q03.5 · Separação de misturas**  
O que é: O método depende da propriedade que difere entre os componentes: tamanho, densidade, ponto de ebulição ou solubilidade.  
Como identificar: Descrição de aparelho ou de processo do cotidiano, como coar café ou tratar água, e pede o nome do método.  
Exemplo: Coar café é extração (a água quente dissolve parte do pó) seguida de filtração. Água e óleo se separam no funil de decantação.  
Caderno: sólido + líquido: filtração, decantação | líquidos imiscíveis: funil de decantação | líquidos miscíveis: destilação fracionada | sólido dissolvido: evaporação, destilação simples  
Cuidado: Destilação simples separa sólido dissolvido do líquido; dois líquidos miscíveis pedem a fracionada.

### Q04 — Mol e estequiometria (7 cartões)

**Q04.1 · Mol e massa molar**  
O que é: Mol é a unidade de quantidade de matéria. Massa molar é a massa de 1 mol, em g/mol, somada a partir da fórmula.  
Como identificar: Massa em g, mg ou kg e a pergunta em mol, ou o inverso. Confira a unidade antes de dividir.  
Exemplo: H₂O: 2 × 1 + 16 = 18 g/mol. Então 36 g de água são 36 ÷ 18 = 2 mol.  
Caderno: n = m ÷ M | M = Σ (massa atômica × índice) | Ca(OH)₂: 40 + 2 × (16 + 1) = 74 g/mol | 1 g = 1 000 mg; 1 kg = 1 000 g  
Cuidado: Parênteses multiplicam tudo o que está dentro: Ca(OH)₂ tem 2 O e 2 H.

**Q04.1 · Avogadro: contar partículas**  
O que é: 1 mol de qualquer entidade tem 6,02 × 10²³ unidades. Esse número leva de mol para átomos, moléculas ou íons.  
Como identificar: Pede número de átomos, de moléculas, de íons, ou a massa de uma única molécula.  
Exemplo: 18 g de água = 1 mol = 6,02 × 10²³ moléculas. Como cada uma tem 2 H, são 1,2 × 10²⁴ átomos de hidrogênio.  
Caderno: N = n × 6,02 × 10²³ | massa de 1 molécula = M ÷ (6,02 × 10²³) | átomos = moléculas × átomos por fórmula | massa atômica: comparada a 1/12 do ¹²C (u)  
Cuidado: Se a pergunta é 'quantos átomos', multiplique as moléculas pelo número de átomos da fórmula.

**Q04.2 · Fórmula mínima e molecular**  
O que é: A fórmula mínima dá a menor proporção inteira entre os átomos. A molecular é a mínima multiplicada por um inteiro n.  
Como identificar: Dados de porcentagem em massa ou de massas obtidas na combustão, mais a massa molar para achar n.  
Exemplo: Glicose: fórmula molecular C₆H₁₂O₆, mínima CH₂O (n = 6). Porcentagem de carbono: 72 ÷ 180 = 40%.  
Caderno: % de cada elemento ÷ massa atômica | divida tudo pelo menor quociente | n = M(molecular) ÷ M(mínima) | % elemento = massa dele na fórmula ÷ M × 100  
Cuidado: Quociente 1,5 não se arredonda: multiplique todos por 2 para chegar a inteiros.

**Q04.3 · Estequiometria direta**  
O que é: Os coeficientes da equação balanceada são a proporção em mol. Passe o dado para mol, aplique a proporção e volte à unidade pedida.  
Como identificar: Dado de um participante e pergunta sobre outro: massa, volume de gás ou número de partículas.  
Exemplo: CH₄ + 2 O₂ → CO₂ + 2 H₂O. 16 g de metano (1 mol) produzem 1 mol de CO₂, isto é, 44 g.  
Caderno: 1) balanceie  2) dado → mol | 3) aplique a proporção dos coeficientes | 4) mol → unidade pedida | gás: 1 mol = volume molar dado  
Cuidado: Coeficiente é proporção em mol, não em massa: em 2 H₂ + O₂ → 2 H₂O não são 2 g para 1 g.

**Q04.4 · Reagente limitante**  
O que é: O limitante é o reagente que acaba primeiro e define quanto produto se forma. O outro sobra em excesso.  
Como identificar: O enunciado dá quantidades de dois ou mais reagentes e pergunta o produto máximo ou o que sobra.  
Exemplo: N₂ + 3 H₂ → 2 NH₃ com 1 mol de N₂ e 2 mol de H₂: 1 ÷ 1 = 1 e 2 ÷ 3 ≈ 0,67. O H₂ é o limitante.  
Caderno: passe cada reagente para mol | divida pelo seu coeficiente | menor quociente = limitante | calcule o produto pelo limitante  
Cuidado: O limitante não é o de menor massa nem o de menos mols: é o menor quociente mol ÷ coeficiente.

**Q04.4 · Pureza e rendimento**  
O que é: Pureza diz quanto da amostra é o reagente e entra antes da conta. Rendimento diz quanto do produto teórico se obteve e entra depois.  
Como identificar: Expressões como 'amostra com 80% de pureza', 'impurezas', 'rendimento de 90%' ou 'excesso de 10%'.  
Exemplo: 100 g de calcário com 80% de CaCO₃ têm 80 g de CaCO₃ (0,8 mol). CaCO₃ → CaO + CO₂ dá 0,8 mol de CO₂; com 90% de rendimento, 0,72 mol.  
Caderno: massa pura = massa da amostra × pureza | produto real = produto teórico × rendimento | rendimento = real ÷ teórico × 100%  
Cuidado: Pureza e rendimento não se somam nem se trocam: um reduz o reagente, o outro reduz o produto.

**Q04.5 · Lavoisier e Proust**  
O que é: Lavoisier: em sistema fechado, a massa total se conserva. Proust: cada substância tem proporção fixa de massas entre seus elementos.  
Como identificar: Prato de balança que sobe ou desce em sistema aberto, ou tabela de experimentos com massas proporcionais.  
Exemplo: Palha de aço queimando ganha massa, porque incorpora O₂. Papel queimando perde massa, porque CO₂ e vapor escapam. Em frasco fechado, nada muda.  
Caderno: Lavoisier: Σ m(reagentes) = Σ m(produtos) | Proust: 2 g H₂ + 16 g O₂ → 18 g H₂O | dobrou um reagente? dobra tudo na proporção | sistema aberto: gás que entra ou sai pesa  
Cuidado: A massa só parece sumir em sistema aberto; num frasco selado ela sempre se conserva.

### Q05 — Soluções e concentração (10 cartões)

**Q05.1 · Concentração comum**  
O que é: Concentração comum é a massa de soluto por litro de solução. A unidade usual é g/L.  
Como identificar: Rótulo de água mineral, exame de sangue, soro: mg/L, g/L, mg/dL. Pede a massa de soluto num volume.  
Exemplo: Soro fisiológico tem 0,9% de NaCl (m/v), ou seja, 9 g/L. Uma bolsa de 500 mL tem 4,5 g de NaCl.  
Caderno: C = m(soluto) ÷ V(solução) | V em litros: mL ÷ 1 000 | mg/dL × 10 = mg/L | m(soluto) = C × V  
Cuidado: O volume da fórmula é o da solução final, não o do solvente que foi colocado.

**Q05.1 · Densidade não é concentração**  
O que é: Densidade é a massa da solução inteira por volume. Concentração é só a massa do soluto por volume.  
Como identificar: O enunciado dá a densidade em g/mL e pede massa de solução, ou mistura densidade com porcentagem.  
Exemplo: 1 L de solução com d = 1,2 g/mL pesa 1 200 g. Se 10% dessa massa é soluto, são 120 g de soluto.  
Caderno: d = m(solução) ÷ V(solução) | C (g/L) = título × d (g/L) | 1 g/mL = 1 000 g/L  
Cuidado: Densidade costuma vir em g/mL e concentração em g/L: multiplique por 1 000 antes de comparar.

**Q05.2 · Concentração em mol/L**  
O que é: Concentração em quantidade de matéria é o número de mols de soluto por litro de solução, também escrita mol·L⁻¹.  
Como identificar: Pede mol/L a partir da massa, ou a massa necessária para preparar certo volume com dada concentração.  
Exemplo: Para 250 mL de NaCl 1 mol/L: n = 1 × 0,25 = 0,25 mol; m = 0,25 × 58,5 ≈ 14,6 g.  
Caderno: [X] = n ÷ V(L) | n = m ÷ M  (M = massa molar) | m = [X] × V × M | C (g/L) = [X] (mol/L) × M (g/mol)  
Cuidado: Volume sempre em litros: 250 mL entram na conta como 0,25 L.

**Q05.3 · Diluição**  
O que é: Diluir é acrescentar solvente. A quantidade de soluto não muda; a concentração cai e o volume sobe.  
Como identificar: Ampola, solução estoque, 'completou com água até', dose a aspirar de um frasco concentrado.  
Exemplo: 10 mL de solução 2 mol/L diluídos até 100 mL: C₂ = 2 × 10 ÷ 100 = 0,2 mol/L. Água acrescentada: 90 mL.  
Caderno: C₁V₁ = C₂V₂ | n(soluto) antes = n(soluto) depois | água adicionada = V₂ − V₁  
Cuidado: V₂ é o volume final da solução; a água colocada é V₂ − V₁.

**Q05.3 · Mistura de soluções**  
O que é: Mesmo soluto, sem reação: some as quantidades de soluto e some os volumes. Concentração não se soma.  
Como identificar: Duas soluções do mesmo soluto juntadas num frasco; pede a concentração final.  
Exemplo: 100 mL de NaCl 1 mol/L + 300 mL de NaCl 0,2 mol/L: (0,1 + 0,06) ÷ 0,4 = 0,4 mol/L.  
Caderno: C = (C₁V₁ + C₂V₂) ÷ (V₁ + V₂) | só para o mesmo soluto, sem reação  
Cuidado: Se os solutos reagem, como ácido e base, não é média: faça a estequiometria e veja o excesso.

**Q05.3 · Titulação**  
O que é: Titulação descobre uma concentração desconhecida pela reação com uma solução de concentração conhecida. O indicador marca o ponto final.  
Como identificar: Bureta, indicador como fenolftaleína, 'volume gasto até a mudança de cor'.  
Exemplo: 25 mL de HCl gastam 20 mL de NaOH 0,1 mol/L. n(NaOH) = 0,002 mol = n(HCl). [HCl] = 0,002 ÷ 0,025 = 0,08 mol/L.  
Caderno: use a proporção da equação balanceada | 1 : 1 → C(ácido)·V(ácido) = C(base)·V(base) | H₂SO₄ + 2 NaOH: n(NaOH) = 2 · n(H₂SO₄)  
Cuidado: Com H₂SO₄ a proporção é 1 : 2; aplicar C₁V₁ = C₂V₂ direto dá o dobro ou a metade.

**Q05.4 · Título e porcentagem**  
O que é: Título é a fração da massa da solução que é soluto. Multiplicado por 100, vira porcentagem em massa.  
Como identificar: Palavras como teor, título, '% m/m', '% em massa', ou rótulos de produtos.  
Exemplo: Uma solução de 200 g com 5% em massa de açúcar tem 10 g de açúcar e 190 g de água.  
Caderno: τ = m(soluto) ÷ m(solução) | % m/m = τ × 100 | m(solução) = m(soluto) + m(solvente) | % v/v: 40 °GL = 40 mL de etanol em 100 mL  
Cuidado: Divida pela massa da solução, não do solvente: 10 g de sal em 90 g de água dão 10%.

**Q05.4 · Partes por milhão (ppm)**  
O que é: ppm significa 1 parte de soluto em 10⁶ partes da amostra, em massa. Serve para quantidades muito pequenas.  
Como identificar: Contaminantes, flúor na água, limite de metais; a resposta costuma ser pedida em mg ou g.  
Exemplo: Água com 0,7 ppm de flúor tem cerca de 0,7 mg de flúor por litro. Motivo: 1 L dessa água pesa cerca de 1 kg.  
Caderno: 1 ppm = 1 mg/kg = 1 g/t | água diluída: 1 ppm ≈ 1 mg/L | ppm = m(soluto) ÷ m(total) × 10⁶ | 1 ppb = 1 μg/kg  
Cuidado: mg/L só equivale a ppm quando a densidade é perto de 1 kg/L; em sólido, use mg/kg.

**Q05.5 · Curva de solubilidade**  
O que é: Coeficiente de solubilidade (CS) é a massa máxima de soluto que se dissolve em 100 g de água, numa dada temperatura.  
Como identificar: Gráfico de g de soluto por 100 g de água contra temperatura; pede a massa que cristaliza ao resfriar.  
Exemplo: Suponha CS de 40 g a 60 °C e de 20 g a 20 °C. Resfriar a solução saturada feita com 100 g de água cristaliza 20 g.  
Caderno: CS: g de soluto por 100 g de água | regra de três com a massa real de água | cristaliza = dissolvido − CS na nova T | gás: solubilidade cai quando aquece  
Cuidado: O CS é por 100 g de água, não de solução: 140 g de solução saturada com CS 40 têm só 100 g de água.

**Q05.5 · Saturada ou supersaturada**  
O que é: Abaixo do CS, a solução é insaturada; no CS, saturada. Acima do CS sem precipitar, é supersaturada e instável.  
Como identificar: Compara a massa dissolvida com o CS na mesma temperatura, ou descreve cristal que se forma de repente.  
Exemplo: Bolsa térmica de acetato de sódio: ao dobrar a plaquinha, a solução supersaturada cristaliza e libera calor.  
Caderno: massa < CS: insaturada | massa = CS: saturada (pode ter corpo de fundo) | massa > CS, sem precipitado: supersaturada | agitar ou pôr um cristal: excesso precipita  
Cuidado: Corpo de fundo indica solução saturada; a supersaturada nunca tem corpo de fundo.

### Q06 — Gases (7 cartões)

**Q06.1 · Transformações gasosas**  
O que é: Com a quantidade de gás fixa, mexer em uma variável muda outra. Em cada transformação, uma grandeza fica constante.  
Como identificar: Recipiente rígido: volume constante. Êmbolo livre: pressão constante. 'Mesma temperatura': isotérmica.  
Exemplo: Pneu a 27 °C (300 K) aquece a 57 °C (330 K) com volume constante: a pressão sobe 10%, porque 330 ÷ 300 = 1,1.  
Caderno: isotérmica (Boyle): P₁V₁ = P₂V₂ | isobárica: V₁/T₁ = V₂/T₂ | isovolumétrica: P₁/T₁ = P₂/T₂ | T(K) = θ(°C) + 273  
Cuidado: Temperatura sempre em kelvin: de 10 °C para 20 °C a temperatura absoluta não dobra (283 K → 293 K).

**Q06.1 · Equação geral dos gases**  
O que é: Quando pressão, volume e temperatura mudam juntos, use a equação geral. Ela vale para a mesma quantidade de gás.  
Como identificar: Três pares de dados, antes e depois; bolha que sobe do fundo do mar; balão que sobe na atmosfera.  
Exemplo: Gás a 2 atm, 10 L e −73 °C (200 K) passa a 1 atm e 27 °C (300 K): V₂ = 2 × 10 × 300 ÷ (200 × 1) = 30 L.  
Caderno: P₁V₁/T₁ = P₂V₂/T₂ | T(K) = θ(°C) + 273 | P e V: qualquer unidade, a mesma dos 2 lados  
Cuidado: Temperatura negativa em graus Celsius fica positiva em kelvin: −23 °C = 250 K.

**Q06.2 · Equação de Clapeyron**  
O que é: PV = nRT liga pressão, volume, quantidade de matéria e temperatura de um gás num único estado.  
Como identificar: Um estado só e a pergunta em mol, massa ou massa molar; o valor de R vem no enunciado, com unidades.  
Exemplo: 1 mol a 0 °C (273 K) e 1 atm: V = 1 × 0,082 × 273 ÷ 1 ≈ 22,4 L.  
Caderno: PV = nRT | R = 0,082 atm·L/(mol·K) | R = 62,3 mmHg·L/(mol·K) = 8,31 J/(mol·K) | n = m/M → PV = (m/M)·R·T  
Cuidado: Escolha o R pela unidade de P e V do enunciado; com 8,31 use pascal e metro cúbico.

**Q06.2 · Volume molar e CNTP**  
O que é: Volume molar é o volume ocupado por 1 mol de gás. Depende só da pressão e da temperatura, não do gás.  
Como identificar: Aparecem 'CNTP', 'condições ambientes' ou um volume molar dado, como 25 L/mol.  
Exemplo: 44 g de CO₂ (1 mol) ocupam 22,4 L nas CNTP. A 25 °C e 1 atm, ocupam cerca de 24,5 L.  
Caderno: CNTP (0 °C e 1 atm): 22,4 L/mol | 0 °C e 1 bar (IUPAC): 22,7 L/mol | 25 °C e 1 atm: ≈ 24,5 L/mol | enunciado deu outro valor? use o dele  
Cuidado: 22,4 L/mol só vale a 0 °C e 1 atm; nas outras condições use o valor dado ou PV = nRT.

**Q06.2 · Densidade de um gás**  
O que é: A densidade de um gás sai de Clapeyron. Ela cresce com a pressão e a massa molar e cai com a temperatura.  
Como identificar: Balão que sobe ou desce, gás que se acumula junto ao chão, comparação entre camadas de ar.  
Exemplo: CO₂ (44 g/mol) é mais denso que o ar (≈ 29 g/mol) e se acumula no fundo de poços e adegas.  
Caderno: d = PM ÷ RT | mesma P e T: d proporcional a M | ar ≈ 29 g/mol: M > 29 desce; M < 29 sobe  
Cuidado: Na fórmula d = PM ÷ RT a temperatura vai em kelvin; com P em atm e R = 0,082, d sai em g/L.

**Q06.3 · Pressão parcial (Dalton)**  
O que é: Numa mistura, cada gás exerce a pressão que teria se estivesse sozinho no recipiente. A soma dá a pressão total.  
Como identificar: Ar com 21% de O₂, gás recolhido sobre água, mistura de massas de dois gases num mesmo frasco.  
Exemplo: Ar a 1 atm com 21% de O₂ em volume: p(O₂) = 0,21 × 1 = 0,21 atm.  
Caderno: P(total) = p₁ + p₂ + … | pᵢ = xᵢ × P(total) | xᵢ = nᵢ ÷ n(total) = % em volume ÷ 100 | sobre água: p(gás) = P(total) − p(vapor)  
Cuidado: Cada gás ocupa o volume inteiro do recipiente; o volume não se divide entre eles.

**Q06.3 · Difusão (Graham)**  
O que é: Gases leves se espalham mais rápido. A velocidade é inversamente proporcional à raiz quadrada da massa molar.  
Como identificar: Algodões com NH₃ e HCl nas pontas de um tubo, cheiro que chega antes, vazamento de gás.  
Exemplo: NH₃ (17 g/mol) e HCl (36,5 g/mol) nas pontas de um tubo: o anel branco de NH₄Cl surge mais perto do HCl. O NH₃ é mais rápido.  
Caderno: v₁ ÷ v₂ = √(M₂ ÷ M₁) | menor massa molar → maior velocidade | H₂ (2 g/mol) é o gás mais rápido  
Cuidado: A raiz não pode sumir: o H₂ difunde 4 vezes mais rápido que o O₂, não 16.

### Q07 — Termoquímica (7 cartões)

**Q07.1 · Exotérmica e endotérmica**  
O que é: Exotérmica libera calor e tem ΔH < 0. Endotérmica absorve calor e tem ΔH > 0.  
Como identificar: Sensação de frio ou de calor, compressa, mudança de estado, combustão; pede o sinal de ΔH.  
Exemplo: Álcool na pele evapora e retira calor do corpo: processo endotérmico, sensação de frio. Toda combustão é exotérmica.  
Caderno: ΔH = H(produtos) − H(reagentes) | ΔH < 0: exotérmica, libera calor | ΔH > 0: endotérmica, absorve calor | fusão, vaporização, sublimação: endotérmicas  
Cuidado: Quem sente frio é o corpo que perdeu calor; o processo que recebeu esse calor é endotérmico.

**Q07.1 · Diagrama de energia**  
O que é: O diagrama mostra a entalpia ao longo da reação. O desnível entre as pontas é o ΔH; o pico é o complexo ativado.  
Como identificar: Gráfico com 'caminho da reação' no eixo horizontal; pede ΔH, energia de ativação ou efeito do catalisador.  
Exemplo: Reagentes a 5 kcal/mol, pico a 30 e produtos a 20: ΔH = 20 − 5 = +15 kcal/mol; Ea = 30 − 5 = 25 kcal/mol.  
Caderno: ΔH = H(produtos) − H(reagentes) | Ea = H(pico) − H(reagentes) | catalisador: pico mais baixo, mesmo ΔH  
Cuidado: A energia de ativação se mede a partir dos reagentes, não do zero do eixo nem dos produtos.

**Q07.1 · Calorimetria**  
O que é: O calor trocado por uma massa que muda de temperatura é Q = m·c·ΔT. É assim que se mede o calor de uma reação.  
Como identificar: Calorímetro, 'a água aqueceu de 20 °C para 55 °C', alimento queimado sob um recipiente com água.  
Exemplo: 500 g de água de 20 °C a 30 °C: Q = 500 × 1 × 10 = 5 000 cal = 5 kcal, cerca de 20,9 kJ.  
Caderno: Q = m · c · ΔT | c(água) = 1 cal/(g·°C) = 4,18 J/(g·°C) | 1 cal = 4,18 J; 1 kcal = 1 000 cal | ΔT = T(final) − T(inicial)  
Cuidado: A massa da fórmula é a do que aqueceu, em geral a água, não a do combustível queimado.

**Q07.2 · Lei de Hess**  
O que é: O ΔH depende só dos estados inicial e final, não do caminho. Some etapas para montar a equação pedida.  
Como identificar: Duas ou três equações com seus ΔH e uma equação-alvo diferente de todas elas.  
Exemplo: C(grafite) + O₂ → CO₂, ΔH = −394 kJ. CO + ½ O₂ → CO₂, ΔH = −283 kJ. Invertendo a 2ª e somando: C + ½ O₂ → CO, ΔH = −111 kJ.  
Caderno: inverteu a equação: troca o sinal de ΔH | multiplicou por k: ΔH × k | some as equações e some os ΔH | o que aparece dos 2 lados se cancela  
Cuidado: Se a mesma equação foi invertida e multiplicada, aplique as duas coisas ao ΔH: sinal e fator.

**Q07.2 · Entalpia de formação**  
O que é: Entalpia de formação é o ΔH para formar 1 mol da substância a partir das substâncias simples mais estáveis.  
Como identificar: Tabela de ΔHf e pedido do ΔH de uma reação, ou de qual equação representa uma formação.  
Exemplo: CH₄ + 2 O₂ → CO₂ + 2 H₂O(l): ΔH = [−394 + 2 × (−286)] − [−75 + 0] = −891 kJ/mol.  
Caderno: ΔH = Σ ΔHf(produtos) − Σ ΔHf(reagentes) | multiplique cada ΔHf pelo coeficiente | O₂, H₂, N₂, C(grafite): ΔHf = 0 | O₃ e C(diamante): ΔHf ≠ 0  
Cuidado: ΔHf vale zero só para a forma mais estável: diamante e ozônio não valem zero.

**Q07.3 · Energia de ligação**  
O que é: Romper ligação absorve energia; formar ligação libera. O ΔH é a energia das ligações rompidas menos a das formadas.  
Como identificar: Tabela de energias de ligação em kJ/mol e fórmulas estruturais dos participantes.  
Exemplo: H₂ + Cl₂ → 2 HCl: rompe 436 + 243 = 679 kJ; forma 2 × 432 = 864 kJ. ΔH = 679 − 864 = −185 kJ.  
Caderno: ΔH = Σ E(rompidas) − Σ E(formadas) | rompidas: todas as dos reagentes | formadas: todas as dos produtos | cada ligação × coeficiente da equação  
Cuidado: Dupla ligação tem valor próprio: C=O não é o dobro de C–O. Use o valor da tabela para cada tipo.

**Q07.3 · Poder calorífico**  
O que é: Poder calorífico é a energia liberada por grama, ou quilograma, de combustível queimado. Compara combustíveis pela massa.  
Como identificar: Tabela em kJ/g ou kcal/g, ou cálculo da massa de combustível para fornecer certa energia.  
Exemplo: Hidrogênio libera cerca de 142 kJ/g; gasolina, cerca de 46 kJ/g. Por grama, o H₂ rende cerca de três vezes mais.  
Caderno: poder calorífico = |ΔH| ÷ M  (kJ/g) | energia = massa × poder calorífico | energia (J) = potência (W) × tempo (s) | 1 kWh = 3,6 × 10⁶ J  
Cuidado: Comparar por mol e por grama pode dar ordens diferentes: veja qual base o enunciado pede.

### Q08 — Cinética, equilíbrio e pH (13 cartões)

**Q08.1 · Fatores da velocidade**  
O que é: A reação acelera com mais temperatura, concentração, superfície de contato e com catalisador.  
Como identificar: Situação do cotidiano, como geladeira, panela de pressão ou comprimido triturado, e pede o fator.  
Exemplo: Comprimido efervescente em pó reage mais rápido que inteiro (superfície). Em água quente, mais rápido que em água gelada (temperatura).  
Caderno: ↑ temperatura: choques mais frequentes e fortes | ↑ concentração ou pressão: mais choques | ↑ superfície: sólido em pó reage mais rápido | catalisador: caminho com Ea menor  
Cuidado: A geladeira não impede a decomposição do alimento: só a torna mais lenta.

**Q08.1 · Lei de velocidade**  
O que é: v = k[A]ᵃ[B]ᵇ. Os expoentes, chamados ordens, vêm de experimentos, não dos coeficientes da equação.  
Como identificar: Tabela com experimentos, concentrações iniciais e velocidades; pede as ordens ou a constante k.  
Exemplo: Dobrando [A] com [B] fixo, a velocidade quadruplica: ordem 2 em A. Dobrando [B], ela dobra: ordem 1 em B. Ordem global: 3.  
Caderno: v = k [A]ᵃ [B]ᵇ | concentração × 2 e v × 2: ordem 1 | concentração × 2 e v × 4: ordem 2 | concentração × 2 e v igual: ordem 0  
Cuidado: Expoente igual ao coeficiente só em reação elementar; com tabela, use sempre os dados.

**Q08.2 · Catalisador e ativação**  
O que é: Energia de ativação é a barreira que a reação precisa vencer. O catalisador abre um caminho com barreira menor e sai intacto.  
Como identificar: Diagrama com dois picos, enzima, conversor catalítico, a expressão 'não é consumido'.  
Exemplo: No conversor catalítico do carro, platina, paládio e ródio aceleram a transformação de CO e NOₓ em CO₂ e N₂.  
Caderno: catalisador: ↓ Ea → ↑ velocidade | não altera ΔH nem a constante K | não desloca o equilíbrio | é regenerado no fim; intermediário não  
Cuidado: Catalisador entra numa etapa e sai noutra; intermediário é formado numa etapa e consumido na seguinte.

**Q08.3 · Expressão de Kc**  
O que é: No equilíbrio, as velocidades direta e inversa se igualam e as concentrações ficam constantes. Kc relaciona essas concentrações.  
Como identificar: Equação balanceada e pedido da expressão de K, ou do valor a partir da tabela início-reage-equilíbrio.  
Exemplo: N₂(g) + 3 H₂(g) ⇌ 2 NH₃(g): Kc = [NH₃]² ÷ ([N₂]·[H₂]³).  
Caderno: aA + bB ⇌ cC + dD | Kc = [C]ᶜ·[D]ᵈ ÷ ([A]ᵃ·[B]ᵇ) | sólido e líquido puro: ficam fora | K grande: equilíbrio favorece os produtos  
Cuidado: Equilíbrio não é concentrações iguais: é velocidades iguais e concentrações constantes.

**Q08.3 · Kp e equilíbrio heterogêneo**  
O que é: Kp usa pressões parciais e só inclui gases. Ele se relaciona com Kc pela variação do número de mols de gás.  
Como identificar: Equilíbrio com gases e pedido de Kp, ou equilíbrio com sólido e gás juntos.  
Exemplo: CaCO₃(s) ⇌ CaO(s) + CO₂(g): Kp = p(CO₂) e Kc = [CO₂]. Os sólidos não entram.  
Caderno: Kp = Kc · (RT)^Δn | Δn = mols de gás: produtos − reagentes | Δn = 0 → Kp = Kc | R = 0,082 atm·L/(mol·K); T em kelvin  
Cuidado: Sólido e líquido puro nunca aparecem na expressão de K, nem de Kc nem de Kp.

**Q08.4 · Le Chatelier: concentração**  
O que é: Perturbado, o equilíbrio se desloca para reduzir a perturbação. Adicionar uma espécie desloca para consumi-la; retirar desloca para repô-la.  
Como identificar: Verbos como adicionou, retirou, precipitou ou neutralizou uma espécie do equilíbrio; pede a cor ou o produto.  
Exemplo: 2 CrO₄²⁻ + 2 H⁺ ⇌ Cr₂O₇²⁻ + H₂O. Ácido desloca para o dicromato, laranja. Base retira H⁺ e volta o cromato, amarelo.  
Caderno: adicionou X: desloca para consumir X | retirou X: desloca para formar X | íon comum: desloca para longe dele | concentração não muda o valor de K  
Cuidado: Deslocar não muda K: só a temperatura altera o valor da constante.

**Q08.4 · Pressão e temperatura**  
O que é: Aumentar a pressão desloca para o lado com menos mols de gás. Aquecer favorece o sentido endotérmico.  
Como identificar: Equilíbrio gasoso com ΔH dado; pede o efeito de comprimir, expandir, aquecer ou resfriar.  
Exemplo: N₂ + 3 H₂ ⇌ 2 NH₃, ΔH < 0: alta pressão favorece a amônia (4 mols → 2 mols). Aquecer desloca para os reagentes e diminui K.  
Caderno: ↑ P: lado com menos mol de gás | Δn(gás) = 0: pressão não desloca | ↑ T: sentido endotérmico (K muda) | catalisador: não desloca  
Cuidado: Só contam os mols de gás: sólidos e líquidos ficam fora da contagem.

**Q08.5 · Ka, Kb e força**  
O que é: Ka mede quanto o ácido se ioniza; Kb, quanto a base. Quanto maior a constante, mais forte.  
Como identificar: Tabela de Ka em notação científica; pede o ácido mais forte ou o pH de ácido ou base fraca.  
Exemplo: Ácido acético 0,1 mol/L, Ka = 1,8 × 10⁻⁵: [H⁺] ≈ √(1,8 × 10⁻⁶) ≈ 1,3 × 10⁻³ mol/L, e pH ≈ 2,9.  
Caderno: HA ⇌ H⁺ + A⁻;  Ka = [H⁺]·[A⁻] ÷ [HA] | ácido fraco: [H⁺] ≈ √(Ka · C) | base fraca: [OH⁻] ≈ √(Kb · C) | maior Ka → ácido mais forte  
Cuidado: 10⁻⁴ é maior que 10⁻⁵: compare expoentes negativos com atenção.

**Q08.5 · Grau de ionização**  
O que é: Grau de ionização (α) é a fração das moléculas dissolvidas que se ionizaram.  
Como identificar: Frases como 'de cada 100 moléculas, 3 se ionizam', ou pedido de Ka a partir de α e da concentração.  
Exemplo: HA 0,1 mol/L com α = 1%: [H⁺] = 0,1 × 0,01 = 10⁻³ mol/L, pH = 3. Ka ≈ α² · C = 10⁻⁵.  
Caderno: α = ionizadas ÷ dissolvidas | [H⁺] = α · C  (monoácido) | Ostwald: Ka = α²C ÷ (1 − α) ≈ α²C | diluir: α aumenta, Ka não muda  
Cuidado: Diluir aumenta α, mas Ka continua o mesmo; só a temperatura muda Ka.

**Q08.6 · pH e pOH**  
O que é: pH = −log[H⁺]. A 25 °C, abaixo de 7 é ácido, 7 é neutro e acima de 7 é básico.  
Como identificar: Pede pH a partir de [H⁺] ou [OH⁻], a razão de acidez entre dois pH, ou a cor de um indicador.  
Exemplo: Suco de limão com pH 2 tem [H⁺] = 10⁻² mol/L; água pura, pH 7, tem 10⁻⁷. O suco tem 10⁵ vezes mais H⁺.  
Caderno: pH = −log[H⁺];  [H⁺] = 10⁻ᵖᴴ | pOH = −log[OH⁻] | pH + pOH = 14 (a 25 °C) | 1 unidade de pH = fator 10 em [H⁺]  
Cuidado: pH pode ser menor que 0 ou maior que 14; a faixa de 0 a 14 é só a mais comum.

**Q08.6 · Hidrólise de sais**  
O que é: O íon que vem de ácido fraco ou de base fraca reage com a água e muda o pH. O lado forte define o caráter.  
Como identificar: Sal dissolvido em água e pergunta sobre o pH (ácido, básico ou neutro) ou a cor do indicador.  
Exemplo: NaHCO₃ (bicarbonato) dá solução básica: vem de base forte (NaOH) e ácido fraco (H₂CO₃). NH₄Cl dá solução ácida.  
Caderno: ácido forte + base forte: neutro (NaCl) | ácido forte + base fraca: ácido (NH₄Cl) | ácido fraco + base forte: básico (CH₃COONa) | fraco + fraco: depende de Ka e Kb  
Cuidado: Água pura a 37 °C tem pH abaixo de 7 e continua neutra, porque [H⁺] = [OH⁻].

**Q08.7 · Solução-tampão**  
O que é: Tampão resiste à variação de pH. É um ácido fraco com sal do seu ânion, ou uma base fraca com sal do seu cátion.  
Como identificar: Sangue, 'pH praticamente constante', mistura de ácido fraco com seu sal.  
Exemplo: No sangue, H₂CO₃ ⇌ H⁺ + HCO₃⁻ mantém o pH perto de 7,4. Excesso de H⁺ é consumido pelo HCO₃⁻.  
Caderno: ácido: CH₃COOH + CH₃COONa | básico: NH₃ + NH₄Cl | pH = pKa + log([A⁻] ÷ [HA]) | [A⁻] = [HA] → pH = pKa  
Cuidado: Ácido forte com seu sal, como HCl e NaCl, não forma tampão: o ácido precisa ser fraco.

**Q08.7 · Produto de solubilidade**  
O que é: Kps é a constante do equilíbrio entre o sal sólido e seus íons numa solução saturada.  
Como identificar: Sal descrito como pouco solúvel; pede Kps a partir da solubilidade, ou se vai precipitar.  
Exemplo: Mg(OH)₂(s) ⇌ Mg²⁺ + 2 OH⁻. Com solubilidade S: Kps = S · (2S)² = 4S³.  
Caderno: AB: Kps = S² | AB₂ ou A₂B: Kps = 4S³ | produto dos íons > Kps: precipita | S em mol/L (g/L ÷ massa molar)  
Cuidado: O coeficiente entra duas vezes: multiplica S (vira 2S) e vira expoente ((2S)²).

### Q09 — Pilhas, eletrólise e radioatividade (9 cartões)

**Q09.1 · Pilha: ânodo e cátodo**  
O que é: Pilha gera corrente a partir de uma reação espontânea. Os elétrons saem do ânodo, onde há oxidação, e vão ao cátodo, onde há redução.  
Como identificar: Dois metais em soluções, ponte salina, tabela de potenciais de redução, bateria do cotidiano.  
Exemplo: Pilha de Daniell: Zn | Zn²⁺ || Cu²⁺ | Cu. A placa de zinco corrói (ânodo, polo −); o cobre se deposita (cátodo, polo +).  
Caderno: ânodo: oxidação; na pilha, polo − | cátodo: redução; na pilha, polo + | elétrons: do ânodo ao cátodo, pelo fio | maior E° de redução: sofre redução  
Cuidado: O ânodo é sempre oxidação, mas o sinal muda: negativo na pilha e positivo na eletrólise.

**Q09.1 · Diferença de potencial**  
O que é: A ddp mede a força da pilha. É a diferença entre os potenciais de redução do cátodo e do ânodo.  
Como identificar: Tabela de E° de redução; pede a ddp, o melhor par de metais ou se um metal é atacado por ácido.  
Exemplo: Daniell: E°(Cu²⁺/Cu) = +0,34 V e E°(Zn²⁺/Zn) = −0,76 V. ddp = 0,34 − (−0,76) = 1,10 V.  
Caderno: ΔE° = E°red(cátodo) − E°red(ânodo) | ΔE° > 0: reação espontânea | multiplicar semirreação não muda E° | pilhas em série: as ddp se somam  
Cuidado: Para igualar os elétrons multiplica-se a semirreação, mas o potencial fica o mesmo.

**Q09.2 · Eletrólise ígnea e aquosa**  
O que é: Eletrólise é uma reação não espontânea forçada por corrente elétrica. A ígnea usa o sal fundido; na aquosa, a água compete.  
Como identificar: Gerador, 'sal fundido', produção de alumínio, sódio, cloro ou soda; pede o produto de cada eletrodo.  
Exemplo: NaCl fundido: sódio no cátodo e Cl₂ no ânodo. NaCl em água: H₂ no cátodo, Cl₂ no ânodo, e a solução fica com NaOH.  
Caderno: cátodo (−): redução; ânodo (+): oxidação | aquosa: cátions dos grupos 1, 2 e Al³⁺ → sai H₂ | ânion oxigenado ou F⁻ → sai O₂ no ânodo | Cl⁻, Br⁻, I⁻ oxidam antes da água  
Cuidado: Em água, Na⁺ não vira sódio metálico: quem se reduz é a água, que libera H₂.

**Q09.2 · Leis de Faraday**  
O que é: A massa formada num eletrodo é proporcional à carga que passou. 1 mol de elétrons carrega cerca de 96 500 C.  
Como identificar: Corrente em ampères, tempo e massa depositada; pede massa, tempo ou corrente.  
Exemplo: Cu²⁺ + 2 e⁻ → Cu. 9 650 C = 0,1 mol de e⁻ → 0,05 mol de Cu ≈ 3,2 g (Cu = 63,5 g/mol).  
Caderno: Q = i · t  (A × s = C) | 1 F = 96 500 C = 1 mol de e⁻ | n(e⁻) = Q ÷ 96 500 | Cu²⁺ + 2 e⁻ → Cu: 2 mol de e⁻ por mol de Cu  
Cuidado: Tempo sempre em segundos: 1 h = 3 600 s e 1 min = 60 s.

**Q09.3 · Corrosão e metal de sacrifício**  
O que é: O ferro enferruja ao oxidar com oxigênio e água. Um metal mais reativo, ligado ao ferro, oxida no lugar dele.  
Como identificar: Casco de navio, tubulação enterrada, ferro galvanizado; pede o metal que protege o ferro.  
Exemplo: Ferro galvanizado leva camada de zinco. E°(Zn) = −0,76 V é menor que E°(Fe) = −0,44 V: o zinco oxida primeiro.  
Caderno: sacrifício: E° de redução menor que o do Fe | Zn, Mg e Al protegem o ferro | Cu, Sn e Ag não protegem (E° maior) | ferrugem: Fe₂O₃·nH₂O (precisa de ar e água)  
Cuidado: O estanho da lata só protege enquanto intacto; arranhado, o ferro exposto oxida mais rápido.

**Q09.4 · Alfa, beta e gama**  
O que é: Núcleos instáveis emitem radiação. Alfa (⁴₂α) é um núcleo de hélio; beta (⁰₋₁β) é um elétron; gama é onda, sem massa nem carga.  
Como identificar: Série de decaimento ou 'emitiu uma partícula'; pede o nuclídeo final ou quantas emissões alfa e beta.  
Exemplo: ²³⁸₉₂U → ²³⁴₉₀Th + ⁴₂α. Depois, ²³⁴₉₀Th → ²³⁴₉₁Pa + ⁰₋₁β.  
Caderno: alfa: A − 4, Z − 2 | beta: A igual, Z + 1 | gama: A e Z iguais | penetração: α < β < γ  
Cuidado: Na emissão beta o número atômico sobe: um nêutron vira próton e o elétron é expulso.

**Q09.4 · Equações nucleares**  
O que é: Toda equação nuclear conserva a soma dos números de massa e a soma dos números atômicos.  
Como identificar: Equação com partícula desconhecida X, bombardeio com nêutron, pósitron (⁰₊₁β) em fusão.  
Exemplo: ¹⁴₇N + ¹₀n → ¹⁴₆C + ¹₁p: é assim que o carbono-14 se forma na alta atmosfera.  
Caderno: Σ A (esquerda) = Σ A (direita) | Σ Z (esquerda) = Σ Z (direita) | nêutron ¹₀n; próton ¹₁p; pósitron ⁰₊₁β | Z novo: consulte a tabela para o símbolo  
Cuidado: O pósitron tem carga +1: na emissão β⁺ o número atômico cai 1.

**Q09.5 · Meia-vida**  
O que é: Meia-vida é o tempo para metade dos núcleos radioativos de uma amostra decair. Ela não depende da quantidade inicial.  
Como identificar: Gráfico de atividade contra tempo, datação por carbono-14, massa restante depois de certo tempo.  
Exemplo: O iodo-131 tem meia-vida de cerca de 8 dias. Após 24 dias, ou 3 meias-vidas, resta 1/8 da amostra.  
Caderno: m = m₀ ÷ 2ⁿ | n = tempo ÷ t½ | 1 → ½ → ¼ → ⅛ → 1/16 | ¹⁴C: t½ ≈ 5 730 anos  
Cuidado: Depois de duas meias-vidas a amostra não acabou: resta 1/4, e 3/4 decaíram.

**Q09.5 · Fissão e fusão**  
O que é: Fissão parte um núcleo pesado em núcleos menores; fusão junta núcleos leves. Ambas liberam energia pela perda de massa.  
Como identificar: Usina nuclear, bomba atômica, energia do Sol, reação em cadeia.  
Exemplo: Em Angra, a energia vem da fissão do urânio-235 por nêutrons. No Sol, vem da fusão de hidrogênio em hélio.  
Caderno: fissão: núcleo pesado + n → 2 menores + n | fusão: núcleos leves → núcleo maior | E = Δm · c² (massa perdida vira energia) | reação em cadeia: nêutrons liberados  
Cuidado: Fissão não é decaimento alfa: na fissão o núcleo se parte em dois pedaços grandes.

### Q10 — Propriedades coligativas (4 cartões)

**Q10.1 · Contar partículas**  
O que é: Propriedades coligativas dependem do número de partículas dissolvidas, não da natureza delas.  
Como identificar: Várias soluções com concentrações diferentes; pede a ordem de ebulição, de congelamento ou de pressão de vapor.  
Exemplo: 0,1 mol/L de glicose dá 0,1 de partículas; de NaCl, 0,2; de CaCl₂, 0,3. A de CaCl₂ congela na menor temperatura.  
Caderno: partículas = concentração × i | molecular (glicose, sacarose): i = 1 | NaCl: 2; CaCl₂: 3; Al₂(SO₄)₃: 5 | dissociação parcial: i = 1 + α(q − 1)  
Cuidado: O número impresso engana: CaCl₂ 0,1 mol/L tem mais partículas que glicose 0,2 mol/L.

**Q10.1 · Tono, ebulio e crioscopia**  
O que é: Soluto não volátil abaixa a pressão de vapor do solvente. Por isso a solução ferve mais quente e congela mais fria.  
Como identificar: Sal na água do macarrão, sal na estrada com neve, aditivo no radiador, água do mar.  
Exemplo: Etilenoglicol no radiador baixa o congelamento e sobe a ebulição da água. A água do mar congela abaixo de 0 °C.  
Caderno: tonoscopia: ↓ pressão de vapor | ebulioscopia: ↑ temperatura de ebulição | crioscopia: ↓ temperatura de congelamento | ΔT = K · W · i  (W = molalidade, mol/kg)  
Cuidado: Crioscopia e ebulioscopia usam molalidade (mol por kg de solvente), não mol por litro de solução.

**Q10.2 · Osmose e tonicidade**  
O que é: Osmose é a passagem de solvente por membrana semipermeável, do meio menos concentrado para o mais concentrado.  
Como identificar: Hemácias que incham ou murcham, salada que murcha com sal, soro, conservas.  
Exemplo: Hemácia em água pura incha e pode romper (hemólise). Em salmoura, perde água e murcha. Em soro a 0,9%, não muda.  
Caderno: a água vai do hipotônico para o hipertônico | isotônicos: mesma pressão osmótica | hemácia em meio hipotônico: incha | hemácia em meio hipertônico: murcha  
Cuidado: Quem atravessa a membrana é a água, não o soluto.

**Q10.2 · Pressão osmótica**  
O que é: Pressão osmótica é a pressão que impede a osmose. Cresce com a concentração de partículas e com a temperatura.  
Como identificar: Pede π, a massa molar de uma proteína medida por osmose, ou compara soluções isotônicas.  
Exemplo: Glicose 0,1 mol/L a 27 °C: π = 0,1 × 0,082 × 300 × 1 ≈ 2,5 atm.  
Caderno: π = [X] · R · T · i | [X] em mol/L; T em kelvin | R = 0,082 atm·L/(mol·K) | isotônicas: mesmo valor de [X] · i  
Cuidado: Não esqueça o fator i: NaCl 0,1 mol/L tem a pressão osmótica de glicose 0,2 mol/L.

### Q11 — Orgânica: estrutura e isomeria (15 cartões)

**Q11.1 · Classificação do carbono**  
O que é: Cada carbono é classificado pelo número de outros carbonos ligados a ele: primário (1), secundário (2), terciário (3), quaternário (4).  
Como identificar: Estrutura desenhada ou nome; pede quantos carbonos de cada tipo, ou a classe de um álcool.  
Exemplo: Em CH₃–CH(CH₃)–CH₃, o metilpropano, há 3 carbonos primários e 1 terciário.  
Caderno: primário: ligado a 1 C (ou a nenhum, no CH₄) | secundário: 2 C; terciário: 3 C | quaternário: 4 C | dupla com um C conta como 1 vizinho  
Cuidado: Conte só carbonos vizinhos: O, N e H não entram nessa classificação.

**Q11.1 · Classificação da cadeia**  
O que é: A cadeia é aberta ou fechada, normal ou ramificada, saturada ou insaturada, homogênea ou heterogênea.  
Como identificar: Estrutura de fármaco ou produto natural; pede as classificações todas de uma vez.  
Exemplo: CH₃–CH₂–O–CH₃: aberta, normal, saturada e heterogênea (O entre carbonos). CH₂=CH–CH₃: insaturada e homogênea.  
Caderno: insaturada: tem C=C ou C≡C | heterogênea: heteroátomo ENTRE carbonos | ramificada: cadeia aberta com 3+ pontas | aromática: tem anel benzênico  
Cuidado: OH na ponta não torna a cadeia heterogênea: o heteroátomo precisa estar entre dois carbonos.

**Q11.2 · Nome: prefixo, infixo, sufixo**  
O que é: O nome oficial junta prefixo (número de carbonos), infixo (tipo de ligação) e sufixo (função).  
Como identificar: Pede a fórmula a partir do nome, ou o nome de um hidrocarboneto desenhado.  
Exemplo: Propeno: prop (3 C) + en (dupla) + o (hidrocarboneto) = CH₂=CH–CH₃. But-2-ino: CH₃–C≡C–CH₃.  
Caderno: met 1, et 2, prop 3, but 4, pent 5 | hex 6, hept 7, oct 8, non 9, dec 10 | an: simples; en: dupla; in: tripla | o: hidrocarboneto; ciclo-: cadeia fechada  
Cuidado: Alceno e ciclano têm a mesma fórmula geral, CₙH₂ₙ; não identifique a função só pelo número de H.

**Q11.2 · Ramificações e numeração**  
O que é: A cadeia principal é a sequência mais longa de carbonos que contém as insaturações. Os grupos de fora são ramificações.  
Como identificar: Estrutura com grupos CH₃ ou C₂H₅ pendurados; pede o nome oficial ou os números de posição.  
Exemplo: CH₃–CH(CH₃)–CH₂–CH₂–CH₃ é 2-metilpentano, não 4-metilpentano: numere pela ponta mais próxima do metil.  
Caderno: 1) cadeia principal: mais longa, com a insaturação | 2) numere: insaturação, depois ramificação | 3) radicais em ordem alfabética | metil –CH₃; etil –C₂H₅; isopropil –CH(CH₃)₂  
Cuidado: Metil no carbono da ponta não é ramificação: ele só prolonga a cadeia principal.

**Q11.3 · Álcool, fenol e éter**  
O que é: Álcool tem OH em carbono saturado; fenol tem OH direto no anel aromático. Éter tem oxigênio entre dois carbonos.  
Como identificar: Estrutura com oxigênio: olhe os vizinhos do O para decidir a função.  
Exemplo: Etanol, CH₃CH₂OH, é álcool; C₆H₅OH é o fenol comum; éter dietílico, CH₃CH₂–O–CH₂CH₃, foi usado como anestésico.  
Caderno: álcool: R–OH (C saturado) → -ol | fenol: OH ligado ao anel aromático | éter: R–O–R' | álcool 1º, 2º, 3º: classe do C com o OH  
Cuidado: OH ligado direto ao anel é fenol; OH numa cadeia lateral presa ao anel é álcool.

**Q11.3 · Carbonila: aldeído a éster**  
O que é: Carbonila é o grupo C=O. Na ponta da cadeia, aldeído; no meio, cetona; com OH, ácido carboxílico; com O ligado a carbono, éster.  
Como identificar: Grupo C=O na estrutura: veja o que mais está ligado ao carbono da carbonila.  
Exemplo: Formol tem metanal, um aldeído; acetona é propanona, cetona; vinagre tem ácido acético; aroma de frutas vem de ésteres.  
Caderno: aldeído: R–CHO → -al | cetona: R–CO–R' → -ona | ácido: R–COOH → ácido …-oico | éster: R–COO–R' → …-ato de …-ila  
Cuidado: Éster e éter diferem por uma carbonila: sem C=O ao lado do oxigênio, é éter.

**Q11.4 · Amina e amida**  
O que é: Amina tem nitrogênio ligado só a carbonos e hidrogênios; deriva da amônia. Amida tem nitrogênio ligado direto à carbonila.  
Como identificar: Estrutura com N: veja se o carbono vizinho do nitrogênio tem C=O.  
Exemplo: Metilamina, CH₃–NH₂, é amina; ureia, CO(NH₂)₂, é amida. As aminas têm caráter básico, como a amônia.  
Caderno: amina: R–NH₂ (1ª), R₂NH (2ª), R₃N (3ª) | amida: R–CO–NH₂ | amina: básica; amida: praticamente neutra | ligação peptídica = grupo amida  
Cuidado: A classe da amina conta os carbonos ligados ao N: (CH₃)₃C–NH₂ é amina primária.

**Q11.4 · Haletos e funções mistas**  
O que é: Haleto orgânico tem halogênio ligado a carbono. Funções mistas reúnem vários grupos funcionais na mesma molécula.  
Como identificar: Estrutura de fármaco ou produto natural; pede todas as funções presentes, ou a que está ausente.  
Exemplo: Glicina, H₂N–CH₂–COOH, tem amina e ácido carboxílico. Clorofórmio, CHCl₃, é haleto orgânico.  
Caderno: haleto: R–X (X = F, Cl, Br, I) | aminoácido: amina + ácido carboxílico | varra cada O e cada N, um de cada vez | nitrila: R–C≡N  
Cuidado: Grupo funcional não é função: 'carbonila' ou 'hidroxila' aparece como isca quando se pede a função.

**Q11.5 · Cadeia, posição e função**  
O que é: Isômeros têm a mesma fórmula molecular e estruturas diferentes. Na isomeria plana, a diferença aparece na fórmula estrutural.  
Como identificar: Duas estruturas e o pedido do tipo de isomeria. Confira primeiro se a fórmula molecular é a mesma.  
Exemplo: C₂H₆O: etanol (álcool) e metoximetano (éter) são isômeros de função. But-1-eno e but-2-eno são de posição.  
Caderno: cadeia: muda o esqueleto (aberta × fechada…) | posição: muda o lugar do grupo ou da dupla | função: funções orgânicas diferentes | mesma fórmula molecular é obrigatório  
Cuidado: Ciclobutano e but-1-eno (C₄H₈) são isômeros de cadeia, aberta e fechada, não de função.

**Q11.5 · Metameria e tautomeria**  
O que é: Na metameria, ou compensação, o heteroátomo muda de posição. Na tautomeria, dois isômeros ficam em equilíbrio pela migração de um H.  
Como identificar: Dois éteres ou ésteres com o O em posições diferentes, ou enol em equilíbrio com aldeído ou cetona.  
Exemplo: Metoxipropano e etoxietano (C₄H₁₀O) são metâmeros. Etenol ⇌ etanal é tautomeria aldo-enólica.  
Caderno: metameria: heteroátomo em outra posição | tautomeria: enol ⇌ aldeído ou cetona | ceto-enólica: prop-1-en-2-ol ⇌ propanona | aldo-enólica: etenol ⇌ etanal  
Cuidado: O enol quase nunca é isolado: no equilíbrio predomina a forma com carbonila.

**Q11.6 · Isomeria geométrica**  
O que é: Cis-trans aparece em dupla C=C, ou em anel, quando cada carbono envolvido tem dois ligantes diferentes entre si.  
Como identificar: Duas estruturas que só diferem pelo lado dos grupos em relação à dupla.  
Exemplo: But-2-eno tem forma cis e trans; but-1-eno não, porque o C1 tem dois H. Ácido maleico é cis; fumárico é trans.  
Caderno: exige: C=C (ou anel) + ligantes diferentes | cis: grupos iguais do mesmo lado | trans: grupos iguais em lados opostos | cis costuma ser mais polar  
Cuidado: Se um carbono da dupla tem dois ligantes iguais, não há cis-trans.

**Q11.6 · Carbono quiral e isomeria óptica**  
O que é: Carbono quiral tem quatro ligantes diferentes. Ele gera isômeros que são imagens no espelho não sobreponíveis, os enantiômeros.  
Como identificar: Pede quantos carbonos quirais há, se existe atividade óptica, ou o número de isômeros ópticos.  
Exemplo: Ácido lático, CH₃–CH(OH)–COOH: o carbono central tem H, OH, CH₃ e COOH. Por isso há dois enantiômeros.  
Caderno: quiral: C saturado com 4 ligantes diferentes | isômeros ópticos ativos: 2ⁿ (n = C quirais) | racêmico: 50% de cada, opticamente inativo | C com dupla ou com 2 H nunca é quiral  
Cuidado: Compare o ligante inteiro, não só o átomo vizinho: –CH₂CH₃ e –CH₂CH₂CH₃ são diferentes.

**Q11.7 · Ebulição em orgânica**  
O que é: Mais interação entre moléculas, maior o ponto de ebulição. Para massas parecidas: ácido > álcool > aldeído e cetona > éter > hidrocarboneto.  
Como identificar: Lista de compostos de massas parecidas e funções diferentes, ou de mesma função e tamanhos diferentes.  
Exemplo: Etanol (46 g/mol) ferve a 78 °C; éter dimetílico (46 g/mol), a −24 °C. Só o etanol faz ligação de hidrogênio.  
Caderno: ác. carboxílico > álcool > cetona > éter | hidrocarboneto: menor PE (só London) | mesma função: cadeia maior → PE maior | mesma massa: mais ramificada → PE menor  
Cuidado: Massa molar só decide quando a força entre as moléculas é do mesmo tipo.

**Q11.7 · Solubilidade em orgânica**  
O que é: Grupos polares (OH, COOH, NH₂) puxam a molécula para a água; a cadeia de carbonos puxa para o óleo. Vence a parte maior.  
Como identificar: Pede o composto mais solúvel em água, o melhor solvente apolar, ou explica sabão e detergente.  
Exemplo: Metanol e etanol se misturam com água em qualquer proporção; o hexan-1-ol é pouco solúvel, porque a cadeia longa domina.  
Caderno: semelhante dissolve semelhante | mais OH e menos C → mais solúvel em água | hidrocarboneto: insolúvel em água | sabão: cauda apolar + cabeça polar  
Cuidado: Ter um OH não garante solubilidade em água: com cadeia longa, a parte apolar vence.

**Q11.7 · Acidez e basicidade**  
O que é: Ácido carboxílico é mais ácido que fenol, que é mais ácido que álcool. Aminas são as bases orgânicas típicas.  
Como identificar: Ordenar acidez, achar o ponto básico de uma molécula, ou prever reação com NaOH ou com HCl.  
Exemplo: Fenol reage com NaOH; etanol, praticamente não. Aminas reagem com HCl e formam sais solúveis, como os cloridratos de remédios.  
Caderno: acidez: ác. carboxílico > fenol > água > álcool | basicidade: amina (N com par livre) | amida: praticamente neutra | halogênio perto do COOH: ácido mais forte  
Cuidado: Amida tem nitrogênio, mas não é básica: o par do N fica deslocalizado com a carbonila.

### Q12 — Orgânica: reações, polímeros e ambiente (16 cartões)

**Q12.1 · Reação de adição**  
O que é: Na adição, a dupla ou a tripla se abre e os átomos entram, sem nada sair. É típica de alcenos e alcinos.  
Como identificar: Reagente com C=C ou C≡C e um produto só: hidrogenação, halogenação, adição de água ou de HX.  
Exemplo: CH₂=CH₂ + H₂ → CH₃–CH₃, com níquel como catalisador. A margarina é feita assim, hidrogenando óleo vegetal.  
Caderno: Markovnikov: H vai ao C mais hidrogenado | CH₂=CH–CH₃ + HBr → CH₃–CHBr–CH₃ | alcino + H₂O → enol → cetona (ou aldeído) | Br₂ descora: teste de insaturação  
Cuidado: Se nada sai da molécula, é adição; substituição exige que algum átomo saia.

**Q12.1 · Reação de substituição**  
O que é: Na substituição, um átomo ou grupo sai e outro entra no lugar. É típica de alcanos, aromáticos e haletos.  
Como identificar: Dois produtos, um deles pequeno (HCl, HBr, H₂O); reagente saturado ou benzeno.  
Exemplo: CH₄ + Cl₂ → CH₃Cl + HCl, com luz. C₆H₆ + HNO₃ → C₆H₅NO₂ + H₂O, com H₂SO₄: nitração do benzeno.  
Caderno: alcano + X₂ → haleto + HX (luz) | benzeno + X₂ → C₆H₅X + HX (catalisador) | R–X + OH⁻ → R–OH + X⁻ | halogenação: H de C terciário sai mais fácil  
Cuidado: No benzeno a reação típica é substituição, não adição: o anel aromático é preservado.

**Q12.1 · Reação de eliminação**  
O que é: Na eliminação, saem dois átomos ou grupos de carbonos vizinhos, e forma-se uma dupla ligação.  
Como identificar: Desidratação de álcool com H₂SO₄ a quente, haleto com base forte em álcool, produto com C=C.  
Exemplo: CH₃CH₂OH → CH₂=CH₂ + H₂O, com H₂SO₄ a cerca de 170 °C: desidratação intramolecular do etanol.  
Caderno: álcool → alceno + H₂O (intramolecular) | 2 álcool → éter + H₂O (intermolecular) | Zaitsev: forma o alceno mais substituído | haleto + KOH em álcool → alceno  
Cuidado: Temperatura menor dá éter (intermolecular); temperatura maior dá alceno (intramolecular).

**Q12.2 · Oxidação de álcoois**  
O que é: Álcool primário oxida a aldeído e depois a ácido; secundário, a cetona. Terciário não oxida em condição branda.  
Como identificar: KMnO₄, K₂Cr₂O₇ (dicromato), bafômetro, teste de Tollens ou de Fehling.  
Exemplo: No bafômetro químico, o etanol oxida a etanal e a ácido acético, e o dicromato laranja vira Cr³⁺ verde.  
Caderno: 1º: álcool → aldeído → ácido carboxílico | 2º: álcool → cetona | 3º: não oxida (condição branda) | Tollens (Ag⁺) e Fehling (Cu²⁺): aldeído +  
Cuidado: Cetona simples, como a propanona, não reage com Tollens nem Fehling; teste positivo, em geral, indica aldeído.

**Q12.2 · Ozonólise e oxidação enérgica**  
O que é: Ozonólise e oxidação enérgica (KMnO₄ a quente, meio ácido) quebram a dupla C=C. Cada carbono da dupla ganha um C=O.  
Como identificar: Alceno com O₃ e Zn, ou com KMnO₄ e H⁺, e produtos com carbonila; pede o alceno de partida ou os produtos.  
Exemplo: Ozonólise do 2-metilbut-2-eno, (CH₃)₂C=CH–CH₃, dá propanona e etanal.  
Caderno: ozonólise: C da dupla com H → aldeído | C da dupla sem H → cetona | enérgica: C da dupla com H → ácido | =CH₂ na enérgica → CO₂ + H₂O  
Cuidado: Na oxidação enérgica o aldeído não para: vira ácido carboxílico, e o =CH₂ vira CO₂.

**Q12.2 · Esterificação e hidrólise**  
O que é: Ácido carboxílico + álcool ⇌ éster + água. O caminho inverso, éster + água, é a hidrólise.  
Como identificar: Aroma de fruta, nome terminado em '-ato de -ila', pedido do ácido e do álcool de origem.  
Exemplo: CH₃COOH + CH₃CH₂OH ⇌ CH₃COOCH₂CH₃ + H₂O. O etanoato de etila é o cheiro de removedor de esmalte.  
Caderno: ácido + álcool ⇌ éster + H₂O (meio ácido) | nome: [ácido]-ato de [álcool]-ila | a parte com C=O do éster vem do ácido | hidrólise: éster + H₂O ⇌ ácido + álcool  
Cuidado: Em 'etanoato de metila', etanoato vem do ácido (2 C) e metila vem do álcool (1 C).

**Q12.2 · Saponificação**  
O que é: Saponificação é a hidrólise de um éster em meio básico. Com gordura (triglicerídeo), dá sabão e glicerol.  
Como identificar: Óleo ou gordura com NaOH ou KOH; pede o sabão, o glicerol ou o tipo de reação.  
Exemplo: Triglicerídeo + 3 NaOH → 3 R–COO⁻Na⁺ (sabão) + glicerol. O sabão tem cauda apolar e cabeça iônica.  
Caderno: triglicerídeo + 3 NaOH → 3 sabão + glicerol | sabão: R–COO⁻ Na⁺ | glicerol: propano-1,2,3-triol | praticamente irreversível  
Cuidado: A saponificação não forma ácido carboxílico livre: forma o sal dele, o carboxilato, que é o sabão.

**Q12.3 · Polímero de adição**  
O que é: Monômeros com dupla C=C se somam em cadeia: a dupla se abre e nada sai.  
Como identificar: Nome 'poli' + monômero com dupla: polietileno, PVC, poliestireno, teflon.  
Exemplo: n CH₂=CHCl → (–CH₂–CHCl–)ₙ: é o PVC dos canos. O polietileno das sacolas vem do eteno.  
Caderno: eteno → polietileno (sacolas) | cloroeteno → PVC (canos) | estireno → poliestireno (isopor) | tetrafluoroeteno → teflon (PTFE)  
Cuidado: O monômero tem dupla; a unidade que se repete no polímero já não tem.

**Q12.3 · Polímero de condensação**  
O que é: Dois grupos funcionais reagem e liberam uma molécula pequena, em geral água, a cada ligação formada.  
Como identificar: Poliéster (PET), poliamida (náilon, kevlar), proteína, amido; estrutura com –COO– ou –CO–NH– repetido.  
Exemplo: PET vem de diácido + diálcool, com ligação éster. Náilon vem de diácido + diamina, com ligação amida, a mesma das proteínas.  
Caderno: diácido + diálcool → poliéster + H₂O | diácido + diamina → poliamida + H₂O | vulcanização: borracha + enxofre (pontes S) | termoplástico: pode ser refundido e reciclado  
Cuidado: Náilon e kevlar são poliamidas, feitas por condensação, não polímeros de adição.

**Q12.4 · Carboidratos**  
O que é: Carboidratos são poli-hidroxialdeídos ou poli-hidroxicetonas. Monossacarídeos se unem por condensação e formam di e polissacarídeos.  
Como identificar: Glicose, frutose, sacarose, amido, celulose ou glicogênio; pede grupo funcional ou classificação.  
Exemplo: Glicose (aldose) e frutose (cetose) são isômeros, C₆H₁₂O₆. Sacarose é glicose + frutose, com saída de uma água.  
Caderno: mono: glicose, frutose, galactose | di: sacarose, lactose, maltose | poli: amido, celulose (planta); glicogênio (animal) | glicose aberta: aldeído + 5 OH  
Cuidado: Amido e celulose são polímeros de glicose; diferem no tipo de ligação, e só o amido nós digerimos.

**Q12.4 · Lipídios**  
O que é: Óleos e gorduras são triglicerídeos: ésteres formados por glicerol e três ácidos graxos.  
Como identificar: Ácido graxo saturado ou insaturado, gordura trans, hidrogenação, saponificação.  
Exemplo: Óleos vegetais, ricos em insaturados, são líquidos; gordura animal, rica em saturados, é sólida. Hidrogenar óleo dá margarina.  
Caderno: triglicerídeo = glicerol + 3 ácidos graxos | saturado: só C–C (gordura, sólida) | insaturado: tem C=C (óleo, líquido) | ômega-3: 1ª dupla no 3º C a partir do CH₃  
Cuidado: Gordura trans surge na hidrogenação parcial: a dupla que sobra pode passar para a forma trans.

**Q12.4 · Proteínas**  
O que é: Proteínas são polímeros de α-aminoácidos unidos por ligação peptídica, uma ligação amida, com saída de água.  
Como identificar: Estrutura com –CO–NH– repetido, aminoácidos, desnaturação, hidrólise de peptídeo.  
Exemplo: Glicina + alanina → dipeptídeo Gly-Ala + H₂O. Cozinhar o ovo desnatura a albumina, mas a sequência de aminoácidos fica igual.  
Caderno: aminoácido: H₂N–CHR–COOH | ligação peptídica: –CO–NH– | n aminoácidos: n − 1 ligações e n − 1 H₂O | desnaturação: perde a forma, mantém a sequência  
Cuidado: A ligação peptídica une o carbono da carbonila de um aminoácido ao nitrogênio do seguinte.

**Q12.5 · Efeito estufa**  
O que é: Gases como CO₂, CH₄ e vapor de água absorvem o infravermelho emitido pela Terra e retêm calor. O efeito é natural; a intensificação é humana.  
Como identificar: Gráfico de CO₂ ao longo do tempo, queima de combustível fóssil, desmatamento, metano do gado.  
Exemplo: O CO₂ do ar passou de cerca de 280 ppm, antes da Revolução Industrial, para mais de 420 ppm hoje.  
Caderno: gases: CO₂, CH₄, N₂O, H₂O (vapor), CFC | luz do Sol entra; infravermelho fica retido | fóssil libera C antigo; etanol recicla C recente | CH₄ retém mais calor por molécula que CO₂  
Cuidado: Efeito estufa e buraco na camada de ozônio são problemas diferentes, causados por mecanismos diferentes.

**Q12.5 · Chuva ácida**  
O que é: Óxidos de enxofre e de nitrogênio reagem com a água da chuva e formam ácidos fortes. A chuva normal já é levemente ácida.  
Como identificar: Queima de carvão ou diesel, corrosão de mármore e de estátuas, lagos ácidos; pede os óxidos responsáveis.  
Exemplo: SO₂ + ½ O₂ → SO₃ e SO₃ + H₂O → H₂SO₄. O mármore se desgasta: CaCO₃ + H₂SO₄ → CaSO₄ + H₂O + CO₂.  
Caderno: SO₃ + H₂O → H₂SO₄ | 3 NO₂ + H₂O → 2 HNO₃ + NO | chuva normal: pH ≈ 5,6 (por causa do CO₂) | chuva ácida: pH < 5,6  
Cuidado: CO e CO₂ não causam chuva ácida: o CO é neutro, e o CO₂ só leva o pH a 5,6.

**Q12.5 · Camada de ozônio**  
O que é: O ozônio da estratosfera absorve radiação ultravioleta. Os CFCs liberam átomos de cloro que destroem o O₃ em cadeia.  
Como identificar: Propelente de aerossol, geladeira antiga, buraco sobre a Antártida, radicais livres.  
Exemplo: Cl + O₃ → ClO + O₂, e depois ClO + O → Cl + O₂. O cloro volta ao início e destrói milhares de moléculas de O₃.  
Caderno: CFC + luz UV → Cl (radical livre) | Cl + O₃ → ClO + O₂ | ClO + O → Cl + O₂ | Protocolo de Montreal (1987): fim dos CFCs  
Cuidado: Ozônio é protetor na estratosfera, mas é poluente quando se forma perto do solo.

**Q12.5 · Combustíveis e hidrogênio**  
O que é: O petróleo é separado por destilação fracionada e modificado por craqueamento. O hidrogênio só é limpo se produzido sem emitir CO₂.  
Como identificar: Refino, craqueamento, hidrogênio verde ou cinza, biocombustível, balanço de carbono.  
Exemplo: Hidrogênio verde vem da eletrólise da água com energia renovável: 2 H₂O → 2 H₂ + O₂. O cinza vem do gás natural e emite CO₂.  
Caderno: destilação fracionada: separa por PE | craqueamento: quebra cadeias longas | 2 H₂ + O₂ → 2 H₂O (sem CO₂) | verde: eletrólise com energia renovável  
Cuidado: A queima do H₂ não emite CO₂, mas a produção dele pode emitir: olhe a rota de obtenção.

## Fontes
- OpenStax, *Chemistry 2e* (Flowers et al., 2019): cap. 2 (átomo), 6 (tabela e propriedades periódicas), 7 (ligações; Tabela 7.2, energias H–H 436, Cl–Cl 243, H–Cl 432 kJ/mol e exemplo ΔH = −185 kJ, conferido em https://openstax.org/books/chemistry-2e/pages/7-5-strengths-of-ionic-and-covalent-bonds), 8 (hibridização), 9 (gases), 10–11 (forças intermoleculares, soluções, coligativas), 4 (estequiometria, nox), 5 (termoquímica), 12–15 (cinética, equilíbrio, ácido-base, Kps), 17 (eletroquímica; E° Cu²⁺/Cu +0,34 V, Zn²⁺/Zn −0,76 V, Fe²⁺/Fe −0,44 V), 20 (orgânica), 21 (nuclear).
- IUPAC Gold Book, 'standard conditions for gases' (0 °C e 10⁵ Pa; 22,7 L/mol) e nomenclatura orgânica (recomendações de 1993 e 2013).
- Poder calorífico superior do H₂ ≈ 142 MJ/kg: Wikipedia, 'Heat of combustion' (https://en.wikipedia.org/wiki/Heat_value); gasolina ≈ 46 MJ/kg (faixa 46–47 nas tabelas de PCS).
- Dados de uso corrente conferidos em referência-padrão: t½ do ¹³¹I ≈ 8 dias e do ¹⁴C ≈ 5 730 anos; CO₂ atmosférico ≈ 280 ppm pré-industrial e > 420 ppm (NOAA, média 2024 ≈ 424 ppm); Protocolo de Montreal, 1987; pH da chuva não poluída ≈ 5,6; Kw a 37 °C ≈ 2,4 × 10⁻¹⁴ (pH neutro ≈ 6,8).
- Ferramentas: RDKit 2026.03 (fórmulas, quiralidade, estereoquímica, massas molares) e script próprio de balanceamento (átomos e carga).
