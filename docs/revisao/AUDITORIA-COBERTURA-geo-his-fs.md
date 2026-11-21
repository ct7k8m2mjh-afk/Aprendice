# Auditoria de cobertura da Revisão geral: Geografia, História, Filosofia e Sociologia

Data: 11/11/2026. Pedido do dono: toda questão do site precisa ter, na revisão, o conteúdo do assunto que ela trata.

Método: para cada subtema com questões no banco (`app/public/conteudo/<m>/banco.json`), li uma amostra de 5 a 6 questões (texto em `txt/<sub>.json`; o campo `conceito` está quase sempre vazio), levantei os termos frequentes das questões que não aparecem em nenhum tópico de `geral.json` e comparei com os pontos dos tópicos ligados em `subs`. Onde a revisão não ensinava o que as questões cobram, acrescentei pontos curtos ao tópico ligado ou criei um tópico novo no fim do arquivo. Nenhum ponto existente foi alterado; os tópicos GK59–GK68 e HK60–HK67 não foram tocados (o que seria acréscimo a GK62 virou o tópico novo GK76). `python3 docs/revisao/valida_geral.py` passa.

Fontes: fatos de livro didático consolidado (Geografia, História, Filosofia e Sociologia do ensino médio) e, para dados recentes ou números, as fontes oficiais listadas no fim.

## Geografia

| Subtema | Questões | Resultado |
|---|---|---|
| G01.1 coordenadas geográficas, orientação e movimentos da Terra | 44 | GK76 (novo: movimento aparente do Sol, face norte, sol da meia-noite, antípodas) |
| G01.2 escala numérica e gráfica | 30 | GK03 +2 pontos (escala grande x pequena; planta, carta, mapa e croqui) |
| G01.3 fusos horários | 24 | OK |
| G01.4 projeções cartográficas | 27 | GK04 +2 pontos (conformes, equivalentes, equidistantes, afiláticas e Robinson; cilíndrica, cônica e azimutal) |
| G01.5 curvas de nível e perfil topográfico | 5 | OK |
| G01.6 mapas temáticos e anamorfoses | 26 | GK69 (novo: modos de implantação, relações de diversidade, ordem e proporcionalidade, coroplético, isolinhas, fluxos) |
| G01.7 sensoriamento remoto, GPS e geotecnologias | 25 | OK |
| G02.1 estrutura interna da Terra e tempo geológico | 10 | OK (GK64 cobre eras; estrutura geológica do Brasil em GK07 e GK64) |
| G02.2 tectônica de placas, sismos e vulcanismo | 55 | GK06 +3 pontos (subducção, fossa, dorsal; magnitude x intensidade; Brasil intraplaca) |
| G02.3 rochas, minerais e recursos minerais | 28 | GK07 +2 pontos (exemplos de rochas; bauxita e laterização) |
| G02.4 intemperismo, erosão e assoreamento | 41 | GK07 +1 ponto (subsidência) |
| G02.5 solos: formação, tipos e conservação | 15 | OK |
| G02.6 relevo brasileiro e suas classificações | 37 | GK08 +1 ponto (inselbergues, cuestas, chapadas) |
| G03.1 tempo e clima: elementos e fatores climáticos | 31 | GK09 +2 pontos (troposfera e gradiente térmico; chuva orográfica, barlavento e sotavento) |
| G03.2 pressão, ventos, massas de ar e frentes | 27 | GK70 (novo: pressão e ventos, ZCIT e alísios, ciclone e anticiclone, frente fria, monções) |
| G03.3 climas do Brasil e climogramas | 24 | GK46 +2 pontos (massas de ar do Brasil; friagem); GK70 ligado |
| G03.4 climas do mundo | 12 | GK10 +2 pontos (Köppen; correntes frias, desertos costeiros e ciclones) |
| G03.5 El Niño, La Niña, ilha de calor e inversão térmica | 30 | GK71 (novo: El Niño, La Niña, inversão térmica) |
| G03.6 aquecimento global e mudanças climáticas | 28 | GK11 +3 pontos (permafrost; elevação do nível do mar; ozônio x efeito estufa) |
| G04.1 ciclo hidrológico, bacia hidrográfica e regime dos rios | 34 | GK72 (novo: regimes, perenes e intermitentes, divisores, padrões de canal) |
| G04.2 bacias brasileiras, hidrelétricas e hidrovias | 20 | GK72 (rios de planalto, São Francisco, hidrovias) |
| G04.3 águas subterrâneas e aquíferos | 6 | GK12 +1 ponto (Guarani: arenitos, confinamento e recarga; SAGA) |
| G04.4 crise hídrica, uso da água e transposição | 24 | OK |
| G04.5 oceanos, mares e recursos marinhos | 13 | GK47 +2 pontos (manguezal, restinga, falésia, delta, estuário; ressurgência) |
| G05.1 biomas brasileiros | 39 | OK |
| G05.2 domínios morfoclimáticos de Ab'Sáber | 19 | OK |
| G05.3 biomas e formações vegetais do mundo | 17 | OK |
| G05.4 desmatamento, queimadas e perda de biodiversidade | 52 | GK32 +1 ponto (Mariana e Brumadinho) |
| G06.1 conceitos e indicadores demográficos | 33 | GK73 (novo: teorias demográficas); GK23 +1 ponto (populoso x povoado) |
| G06.2 transição demográfica e pirâmides etárias | 43 | GK25 +1 ponto (bônus demográfico; crescimento vegetativo negativo) |
| G06.3 migrações internacionais e refugiados | 57 | GK24 +1 ponto (apátrida; Lei de Migração; Operação Acolhida) |
| G06.4 migrações internas no Brasil | 16 | OK |
| G06.5 população brasileira: composição, envelhecimento e trabalho | 25 | OK |
| G06.6 IDH, desigualdade e indicadores sociais | 36 | GK50 +2 pontos (mortalidade infantil regional; Mapa da Fome) |
| G07.1 urbanização mundial e metropolização | 29 | OK |
| G07.2 rede urbana, hierarquia e cidades globais | 37 | GK74 (novo: REGIC 2018 e megalópole) |
| G07.3 urbanização brasileira e êxodo rural | 26 | OK |
| G07.4 problemas urbanos: segregação, favelização e gentrificação | 73 | OK |
| G07.5 mobilidade e ambiente urbano | 33 | GK27 +1 ponto (impermeabilização, canalização, enchentes, jardins de chuva, verticalização) |
| G08.1 estrutura fundiária e reforma agrária | 15 | GK17 +2 pontos (Lei de Terras, terras devolutas, Estatuto da Terra, parceria e arrendamento) |
| G08.2 conflitos no campo e grilagem | 12 | GK17 (Lei de Terras e terras devolutas) – GK51 já cobre grilagem |
| G08.3 Revolução Verde, agronegócio e fronteira agrícola | 76 | GK18 +2 pontos (Revolução Verde; Matopiba e commodities; sementes crioulas; segurança alimentar) |
| G08.4 agricultura familiar e agroecologia | 28 | OK |
| G08.5 impactos ambientais da agropecuária | 17 | GK52 +1 ponto (polinizadores; salinização) |
| G08.6 sistemas agrícolas e agricultura no mundo | 10 | OK |
| G09.1 revoluções industriais | 16 | OK |
| G09.2 fordismo, toyotismo e acumulação flexível | 12 | GK15 +1 ponto (desemprego estrutural x conjuntural; acumulação flexível) |
| G09.3 industrialização brasileira e desconcentração industrial | 44 | OK |
| G09.4 fontes de energia e matriz energética | 22 | GK53 +1 ponto (geotérmica, nuclear, biomassa) |
| G09.5 energia no Brasil: hidrelétricas, petróleo, biocombustíveis e renováveis | 22 | OK |
| G09.6 transportes e logística | 32 | OK |
| G10.1 globalização, redes e fluxos | 87 | OK |
| G10.2 Divisão Internacional do Trabalho, desenvolvimento e comércio | 68 | GK20 +1 ponto (balança comercial; protecionismo e tarifas) |
| G10.3 blocos econômicos e organismos internacionais | 65 | GK75 (novo: etapas de integração, Mercosul, UE, USMCA, BRICS, OMC, FMI, Banco Mundial) |
| G10.4 ordem mundial: da Guerra Fria ao mundo multipolar | 31 | OK |
| G10.5 conflitos atuais: Oriente Médio, Leste Europeu e África | 96 | OK |
| G10.6 nacionalismos, separatismos e terrorismo | 29 | GK37 +1 ponto (Iugoslávia, Kosovo, Catalunha, Macedônia do Norte) |
| G10.7 recursos estratégicos: água, petróleo e minerais | 27 | GK39 +2 pontos (estreitos e canais estratégicos; rotas do Ártico; água e o Indo) |
| G10.8 grandes potências e regiões do mundo | 46 | OK |
| G11.1 formação territorial e fronteiras | 15 | OK |
| G11.2 regionalizações: IBGE e complexos geoeconômicos | 25 | OK |
| G11.3 Amazônia | 25 | GK55 +1 ponto (Transamazônica, BR-319, Ferrogrão, garimpo e mercúrio) |
| G11.4 Nordeste e semiárido | 18 | OK |
| G11.5 Centro-Oeste, Sudeste e Sul | 13 | OK |
| G11.6 terras indígenas, quilombolas e povos tradicionais | 41 | GK26 +1 ponto (marco temporal) |
| G11.7 políticas regionais e planejamento | 7 | OK |
| G12.1 conferências e acordos ambientais | 40 | GK40 +2 pontos (Kyoto e créditos de carbono; Paris e NDCs; Rio+20, ODS, Cartagena) |
| G12.2 desenvolvimento sustentável e unidades de conservação | 49 | OK |
| G12.3 poluição do ar, da água e do solo | 31 | OK |
| G12.4 resíduos sólidos, reciclagem e saneamento | 26 | GK58 +1 ponto (compostagem, coleta seletiva, incineração) |
| G12.5 desertificação e degradação ambiental | 21 | GK13 +1 ponto (desertificação pela definição da ONU x arenização no RS) |
| G12.6 justiça ambiental e movimentos socioambientais | 18 | GK40 +1 ponto (racismo ambiental; Antropoceno) |
| G13.1 conceitos-chave: espaço, lugar, região, paisagem, território e rede | 19 | OK |
| G13.2 correntes do pensamento geográfico | 11 | GK01 +1 ponto (Geografia teorético-quantitativa e humanista) |

## História

| Subtema | Questões | Resultado |
|---|---|---|
| H01.1 história, fontes e tempo histórico | 35 | HK01 +2 pontos (história positivista x Escola dos Annales; fontes, presente e memória) |
| H01.2 pré-história e revolução neolítica | 14 | HK02 +1 ponto (pedra lascada e polida; Serra da Capivara) |
| H01.3 Egito e Mesopotâmia | 28 | HK03 +1 ponto (vida após a morte, construtores das pirâmides, Núbia/Kush) |
| H01.4 hebreus, fenícios e persas | 2 | HK03 +1 ponto (Hammurabi e talião; satrapias; moeda lídia) |
| H01.5 Grécia: pólis, Atenas, Esparta e democracia | 38 | HK04 +2 pontos (Sólon, Clístenes, Péricles, Eclésia, isonomia, ostracismo; Esparta) |
| H01.6 cultura grega e helenismo | 17 | HK04 +1 ponto (helenismo, Alexandria, Eratóstenes, escultura clássica, paideia) |
| H01.7 Roma: monarquia e república | 28 | OK |
| H01.8 Império Romano, cristianismo e crise | 35 | OK |
| H02.1 reinos germânicos e feudalismo | 36 | HK10 +1 ponto (corveia, talha, banalidades, mão-morta) |
| H02.2 Igreja e cultura medieval | 32 | HK68 (novo: Igreja e cultura medieval) |
| H02.3 Império Bizantino e mundo islâmico | 24 | HK07 +1 ponto (califados, Casa da Sabedoria, Avicena, Talas) |
| H02.4 reinos e impérios africanos | 16 | HK58 +1 ponto (Etiópia/Aksum, Afonso I do Congo, Njinga) |
| H02.5 Baixa Idade Média: Cruzadas, cidades e crise do século XIV | 31 | HK11 +1 ponto (Veneza, Gênova, feiras de Champagne) |
| H02.6 Renascimento e humanismo | 42 | HK13 +1 ponto (artistas, Montaigne, Vesálio, Gutenberg) |
| H02.7 Reformas protestantes e Contrarreforma | 27 | OK |
| H02.8 Estados nacionais, absolutismo e mercantilismo | 20 | HK17 +1 ponto (colbertismo) |
| H02.9 expansão marítima europeia | 30 | HK17 (Bartolomeu Dias, Vasco da Gama, 370 léguas) |
| H03.1 povos indígenas e o contato com os europeus | 52 | HK69 (novo: indígenas, jesuítas, aldeamentos, guerra justa, resistência) |
| H03.2 povos pré-colombianos e conquista espanhola | 24 | OK |
| H03.3 colonização espanhola e inglesa na América | 13 | OK |
| H03.4 administração colonial: capitanias e governo-geral | 26 | OK |
| H03.5 economia açucareira e escravidão africana | 66 | HK70 (novo: tráfico atlântico e engenho) |
| H03.6 resistência escravizada e quilombos | 14 | HK22 +1 ponto (formas de resistência, irmandades, candomblé, Palmares e Zumbi) |
| H03.7 União Ibérica, holandeses e expansão territorial | 22 | HK22 +1 ponto (Tratado de Madri, uti possidetis) |
| H03.8 mineração e sociedade do século XVIII | 40 | HK23 +1 ponto (tropeiros, abastecimento, faiscadores) |
| H03.9 revoltas coloniais e inconfidências | 20 | OK |
| H04.1 período joanino | 15 | OK |
| H04.2 independência do Brasil | 22 | OK |
| H04.3 Primeiro Reinado | 19 | OK |
| H04.4 período regencial e revoltas | 24 | HK36 +1 ponto (Rusga) |
| H04.5 Segundo Reinado: política e café | 25 | OK |
| H04.6 imigração e trabalho livre | 15 | OK |
| H04.7 Guerra do Paraguai | 13 | HK37 +1 ponto (Solano López, Voluntários da Pátria, escravizados no Exército) |
| H04.8 abolição da escravidão e pós-abolição | 59 | HK37 (lei de 1831, Bill Aberdeen) |
| H04.9 crise do Império e proclamação da República | 10 | HK37 (Reforma Saraiva de 1881; positivismo e militares) |
| H05.1 República da Espada e Constituição de 1891 | 18 | OK |
| H05.2 coronelismo, oligarquias e café com leite | 33 | OK |
| H05.3 conflitos sociais na Primeira República | 75 | HK40 +2 pontos (Revolta da Vacina e reforma Pereira Passos; Chibata; Canudos, Contestado, greve de 1917, gripe espanhola, borracha) |
| H05.4 tenentismo, Semana de 1922 e crise dos anos 1920 | 22 | HK40 +1 ponto (18 do Forte, Coluna Prestes, Semana de 22, Manifesto Antropófago) |
| H05.5 Revolução de 1930 e governo constitucional de Vargas | 50 | OK |
| H05.6 Estado Novo e trabalhismo | 65 | OK |
| H05.7 República de 1946: de Dutra a Jango | 86 | OK |
| H05.8 ditadura militar: repressão, AI-5 e milagre econômico | 99 | OK |
| H05.9 cultura e resistência à ditadura | 28 | OK |
| H05.10 abertura, Diretas Já e Constituição de 1988 | 50 | OK |
| H05.11 Nova República e Brasil contemporâneo | 50 | HK56 +1 ponto (Lei de Cotas) |
| H06.1 Revoluções Inglesas do século XVII | 3 | OK |
| H06.2 Iluminismo e despotismo esclarecido | 20 | HK29 +1 ponto (Locke e direitos naturais) |
| H06.3 independência dos Estados Unidos | 4 | OK |
| H06.4 Revolução Francesa | 30 | HK32 +1 ponto (mulheres na Revolução, Olympe de Gouges) |
| H06.5 Era Napoleônica e Congresso de Viena | 5 | OK |
| H06.6 Revolução Industrial e mundo do trabalho | 61 | OK |
| H06.7 independências da América espanhola | 28 | OK |
| H06.8 liberalismo, socialismo e movimento operário | 26 | HK38 +1 ponto (Rerum Novarum) |
| H06.9 nacionalismos, unificações e revoluções de 1848 | 8 | HK38 (unificações italiana e alemã) |
| H06.10 Estados Unidos no século XIX: expansão e Guerra de Secessão | 19 | OK |
| H07.1 imperialismo na África e na Ásia | 41 | OK |
| H07.2 Primeira Guerra Mundial | 26 | OK |
| H07.3 Revolução Russa e stalinismo | 21 | OK |
| H07.4 crise de 1929 | 17 | OK |
| H07.5 fascismo e nazismo | 45 | HK47 +1 ponto (Guerra Civil Espanhola, Guernica) |
| H07.6 Segunda Guerra Mundial | 26 | HK49 +1 ponto (Munique, pacto germano-soviético, invasão da Polônia) |
| H07.7 Holocausto e genocídios | 18 | HK71 (novo: Holocausto e outros genocídios) |
| H08.1 origens e blocos da Guerra Fria | 62 | OK |
| H08.2 Coreia, Vietnã e crise dos mísseis | 12 | OK |
| H08.3 Revolução Chinesa | 10 | OK |
| H08.4 descolonização da África e da Ásia | 42 | OK |
| H08.5 Revolução Cubana e ditaduras na América Latina | 40 | HK72 (novo: Chile e Argentina, justiça de transição) |
| H08.6 contracultura e direitos civis nos anos 1960 | 25 | OK |
| H08.7 fim da URSS e nova ordem mundial | 24 | HK50 +1 ponto (Iugoslávia, Srebrenica, Dayton) |
| H08.8 mundo atual: Oriente Médio, terrorismo e conflitos recentes | 47 | OK |

## Filosofia e Sociologia

| Subtema | Questões | Resultado |
|---|---|---|
| L01.1 do mito ao logos | 36 | FK02 +1 ponto (thaumazein; Vernant: continuidade e ruptura) |
| L01.2 escola jônica e a busca da arché | 7 | FK02 +1 ponto (cosmogonia x cosmologia) |
| L01.3 Heráclito e Parmênides: devir e ser | 7 | OK |
| L01.4 pitagóricos e atomistas | 1 | OK |
| L02.1 Sócrates: ironia e maiêutica | 16 | OK |
| L02.2 Platão: teoria das ideias e alegoria da caverna | 23 | OK |
| L02.3 Platão: a cidade justa | 7 | OK |
| L02.4 Aristóteles: metafísica, causas e conhecimento | 16 | OK |
| L02.5 Aristóteles: política e o animal político | 10 | OK |
| L02.6 helenismo: estoicos, epicuristas e céticos | 13 | OK |
| L02.7 filosofia medieval: Agostinho e Tomás de Aquino | 22 | OK |
| L03.1 ética e moral: conceitos | 29 | FK39 +1 ponto (juízo de fato x de valor; altruísmo) |
| L03.2 ética das virtudes de Aristóteles | 9 | OK |
| L03.3 ética kantiana: dever e imperativo categórico | 8 | OK |
| L03.4 utilitarismo | 4 | OK |
| L03.5 bioética e ética aplicada | 20 | FK37 +1 ponto (princípios da bioética; especismo) |
| L04.1 proposições, argumentos e validade | 5 | FK40 +1 ponto (identidade, não contradição, terceiro excluído; contraditórias) |
| L04.2 dedução, indução e silogismo | 11 | OK |
| L04.3 falácias | 2 | FK41 +1 ponto (apelo à força, à piedade, à ignorância) |
| L04.4 conectivos lógicos e tabela-verdade | 1 | OK |
| L05.1 Maquiavel | 16 | OK |
| L05.2 Hobbes e o contrato social | 20 | FK27 +2 pontos (direito natural x positivo; direito de resistência; Rousseau e a propriedade) |
| L05.3 Locke: direitos naturais e liberalismo | 10 | FK27 (direito de resistência em Locke) |
| L05.4 Rousseau: vontade geral | 10 | FK27 (Discurso sobre a origem da desigualdade; vontade geral) |
| L05.5 Montesquieu e a separação dos poderes | 4 | OK |
| L05.6 Hannah Arendt e o totalitarismo | 16 | FK43 +1 ponto (esfera privada x pública; mentira e verdade factual) |
| L05.7 democracia, justiça e direitos humanos | 40 | OK |
| L06.1 revolução científica e método: Bacon e Galileu | 16 | FK20 +1 ponto (Bacon, Novum Organum, ídolos) |
| L06.2 Descartes e a dúvida metódica | 28 | OK |
| L06.3 empirismo: Locke, Berkeley e Hume | 19 | OK |
| L06.4 Kant: os limites da razão | 13 | OK |
| L06.5 filosofia da ciência: Popper, Kuhn e pragmatismo | 28 | OK |
| L07.1 razão, progresso e autonomia | 8 | OK |
| L07.2 Kant: o que é esclarecimento | 3 | OK |
| L07.3 Voltaire, enciclopedistas e tolerância | 4 | OK |
| L07.4 crítica da razão instrumental: Escola de Frankfurt | 10 | OK |
| L08.1 Kierkegaard e as origens do existencialismo | 2 | OK |
| L08.2 Sartre: liberdade, má-fé e responsabilidade | 11 | OK |
| L08.3 Simone de Beauvoir | 2 | OK |
| L08.5 Heidegger e a fenomenologia | 10 | FK35 +1 ponto (Merleau-Ponty, Cézanne; fenomenologia) |
| L08.6 Nietzsche: niilismo e crítica da moral | 16 | FK29 +1 ponto (apolíneo e dionisíaco; niilismo) |
| S01.1 cultura, etnocentrismo e relativismo cultural | 28 | SK57 (novo: endoculturação, aculturação, sincretismo, etnocentrismo) |
| S01.2 alteridade, diversidade e identidade | 15 | SK57 (alteridade, multiculturalismo) |
| S01.3 cultura brasileira: matrizes indígenas e africanas | 33 | SK58 (novo: Krenak, transfiguração étnica, Leis 10.639 e 11.645) |
| S01.4 religião e sociedade | 13 | SK08 +1 ponto (religiões de matriz africana e intolerância; sagrado e profano) |
| S01.5 arte, patrimônio e expressões culturais | 145 | SK62 (novo: arte) e SK63 (novo: práticas corporais). ATENÇÃO: este subtema reúne muitas questões de Arte e Educação Física (classificação dos esportes, dança, música, artes visuais); sugere-se rever a classificação |
| S01.6 fato social e ação social: Durkheim e Weber | 61 | SK01 +1 ponto (Harriet Martineau, Simmel) |
| S02.1 socialização primária e secundária | 5 | SK09 +1 ponto (socialização primária e secundária; educação formal e difusa) |
| S02.2 instituições sociais: família, escola e religião | 9 | OK |
| S02.3 papéis sociais, identidade e controle social | 2 | SK06 +1 ponto (Norbert Elias e etiqueta) |
| S02.4 juventude, educação e escola | 13 | SK10 +1 ponto (Paulo Freire; Bourdieu e reprodução) |
| S03.1 Marx: classes, mais-valia e alienação | 47 | OK (SK26, SK27 e FK28 cobrem classes, mais-valia e alienação) |
| S03.2 Weber: ética protestante e burocracia | 6 | OK |
| S03.3 Durkheim: divisão do trabalho social | 6 | SK23 +1 ponto (direito repressivo x restitutivo; funcionalismo) |
| S03.4 taylorismo, fordismo e toyotismo | 13 | OK |
| S03.5 precarização, uberização e informalidade | 44 | SK48 +1 ponto (uberização; Byung-Chul Han) |
| S03.6 trabalho no Brasil: escravidão, CLT e desemprego | 17 | OK |
| S04.1 estratificação: classe, casta e estamento | 12 | SK12 +1 ponto (mobilidade vertical e horizontal; Bourdieu e gosto; Jessé Souza) |
| S04.2 desigualdade de renda e pobreza no Brasil | 19 | OK |
| S04.3 racismo e relações étnico-raciais | 71 | SK59 (novo: racismo estrutural, democracia racial, Fanon, Censo 2022, Lei 14.532) |
| S04.4 gênero, feminismo e violência contra a mulher | 52 | SK51 +1 ponto (cinco formas de violência da Lei Maria da Penha) |
| S04.5 mobilidade social e meritocracia | 6 | SK12 (meritocracia) |
| S04.6 minorias: LGBTQIA+, pessoas com deficiência e outras | 12 | OK |
| S05.1 poder, dominação e legitimidade | 18 | OK |
| S05.2 Estado moderno e formas de governo | 24 | SK15 +1 ponto (monopólio da violência legítima; presidencialismo e parlamentarismo) |
| S05.3 cidadania e direitos no Brasil | 19 | SK60 (novo: Marshall e José Murilo de Carvalho) |
| S05.4 Foucault: poder disciplinar e biopoder | 18 | SK14 +1 ponto (suplício, panóptico, corpos dóceis, biopoder) |
| S05.5 violência, segurança pública e sistema prisional | 9 | OK |
| S05.6 ideologia e hegemonia | 11 | SK61 (novo: ideologia e hegemonia) |
| S06.1 conceito e tipos de movimento social | 18 | OK |
| S06.2 movimento operário e sindicalismo | 1 | OK |
| S06.4 movimento negro, feminista e LGBTQIA+ | 13 | SK59 (Lélia Gonzalez, Abdias) |
| S06.5 movimentos indígenas e socioambientais | 17 | OK |
| S06.6 novos movimentos e redes digitais | 4 | SK41 +1 ponto (Primavera Árabe, Occupy, Jornadas de Junho) |
| S07.1 globalização e sociedade em rede | 11 | SK45 +1 ponto (Canclini) |
| S07.2 modernidade líquida e sociedade de risco | 8 | SK47 +1 ponto (Giddens) |
| S07.3 migrações e xenofobia | 7 | OK |
| S07.4 sociedade de consumo | 11 | SK43 +1 ponto (Inglehart; Maffesoli) |
| S07.5 tecnologia, big techs e capitalismo de plataforma | 17 | SK46 +1 ponto (big techs, capitalismo de vigilância, Morozov, vieses da IA) |
| S08.1 indústria cultural: Adorno e Horkheimer | 22 | FK34 +1 ponto (Marcuse) |
| S08.2 meios de comunicação, opinião pública e espetáculo | 16 | OK |
| S08.3 internet, redes sociais e desinformação | 19 | OK |
| S08.4 cultura de massa, popular e erudita | 7 | SK36 +1 ponto (cultura erudita, popular e de massa; arte conceitual); SK62 ligado |
| S08.5 Benjamin: arte e reprodutibilidade técnica | 11 | OK |

## Fontes conferidas na web (fatos novos com dado recente ou número)

- Censo 2022, cor ou raça (45,3% pardos, 43,5% brancos, 10,2% pretos), SK59: [IBGE, Agência de Notícias](https://agenciadenoticias.ibge.gov.br/agencia-noticias/2012-agenciade-noticias/noticias/38719-censo-2022-pela-primeira-vez-desde-1991a-maior-parte-da-populacao-do-brasil-se-declara-parda)
- REGIC 2018 (São Paulo Grande Metrópole Nacional; Rio e Brasília Metrópoles Nacionais; 15 metrópoles, Campinas a única não capital), GK74: [IBGE, REGIC 2018](https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/28042-regic-2018-campinas-sp-florianopolis-sc-e-vitoria-es-passam-a-estar-entre-as-15-metropoles-do-pais.html)
- Lei 14.532/2023 (injúria racial tipificada como racismo), SK59: [Planalto](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14532.htm)
- Mapa da Fome (Brasil saiu em 2014, voltou em 2018–2020, saiu de novo no SOFI 2025; limite de 2,5%), GK50: [FAO Brasil](https://www.fao.org/brasil/news/detail/Brasil-voltou-a-sair-do-Mapa-da-Fome)
- Marco temporal (STF, Tema 1.031, setembro de 2023; Lei 14.701/2023; ações no STF), GK26: [STF, notícia sobre a Lei do Marco Temporal](https://noticias.stf.jus.br/postsnoticias/stf-considera-inconstitucional-trecho-de-lei-que-institui-marco-temporal-para-terras-indigenas/)
- BRICS (Egito, Etiópia, Irã e Emirados em 2024; Indonésia em 2025; Arábia Saudita deixada de fora por não ter formalizado a adesão), GK75: [BRICS Policy Center, PUC-Rio](https://bricspolicycenter.org/wp-content/uploads/2025/05/BPC-Paper-Novos-membros-e-parceiros-BRICS-compactado.pdf)
- El Niño e seus efeitos no Brasil (menos chuva no norte e no Nordeste, mais chuva no Sul), GK71: [CPTEC/INPE, nota técnica](https://ftp.cptec.inpe.br/clima/nota_tecnica/2025/Nota_Tecnica_NDJ2025.pdf) e [INMET, Painel El Niño](https://portal.inmet.gov.br/uploads/notastecnicas/Painel-El-Ni%C3%B1o-5-edi%C3%A7%C3%A3o1.pdf)
- Tráfico atlântico (cerca de 4,86 milhões de africanos desembarcados no Brasil), HK70: [Slave Voyages](https://www.slavevoyages.org/)
- Classificação dos esportes pela lógica interna (marca, precisão, técnico-combinatório, rede ou quadra dividida e parede de rebote, campo e taco, invasão, combate), SK63: [BNCC, Educação Física](http://basenacionalcomum.mec.gov.br/abase/#fundamental/educacao-fisica)

## Observações para o dono

- S01.5 (145 questões) mistura Sociologia da cultura com muitas questões de Arte e de Educação Física (Unicentro, UEL, UECE). Criei SK62 e SK63 para que elas tenham revisão, mas o certo é rever a classificação desse subtema.
- Itens de dado recente (BRICS, marco temporal, Mapa da Fome, El Niño) mudam com o tempo: convém reconferir na próxima revisão.

Resumo: 229 subtemas auditados; 117 completados; tópicos novos GK69–GK76, HK68–HK72, SK57–SK63.
