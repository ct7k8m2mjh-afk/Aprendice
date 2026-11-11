# Subtemas existentes na pasta docs/revisao

Catálogo gerado dos arquivos da pasta. Serve para organizar o conteúdo para o site. Cada matéria tem três camadas:

- **Temas e subtemas por arquivo** (`<TEMA>.json`): nome do tema, subtemas (campo `cartoes[].sub` e chaves de `slides`) com título e nº de slides.
- **Temas e subtemas sem arquivo por tema**: subtemas que existem no site ou em `resumos.json`, mas ainda não têm arquivo `<TEMA>.json` nesta pasta (Química Q02–Q05 e Q08–Q12, Matemática, Biologia B03, B05–B08, B10 e B12, Português).
- **Tópicos da revisão geral** (`geral.json`): id, capítulo e título de cada tópico, com o campo `subs`: os subtemas em que o tópico se encaixa (o primeiro é o principal).

Atualizado em 12/11/2026 pelo revisor: o mapeamento tópico → subtema está feito em todas as matérias. Onde a coluna `subs` traz "—", não há subtema correspondente no site (lista em `INTEGRACAO-SITE.md`, seção 6). Em Português, os subtemas marcados [NOVO] foram propostos pelo revisor e ainda não existem no site (`por/subtemas.json`).


## Português (`por`)

_Sem arquivos por tema nesta matéria (só `geral.json` e `subtemas.json`)._

### Temas e subtemas sem arquivo por tema

| tema | nome | subtemas (id: título) | origem |
|---|---|---|---|
| P01 | Leitura e compreensão | P01.1: tema, tese e ideia principal do texto; P01.2: informação explícita × inferência; P01.3: título, fonte, data e paratexto como pista de leitura; P01.4: finalidade do texto e interlocutor; P01.5: funções da linguagem [NOVO] | site (app-atual/por/dados.json) + 10 novos propostos; ver por/subtemas.json |
| P02 | Argumentação | P02.1: tipos de argumento e como o autor sustenta a tese; P02.2: ponto de vista, modalização e marcas de opinião; P02.3: ironia, humor e sentido implícito; P02.4: contra-argumento, concessão e refutação | site (app-atual/por/dados.json) + 10 novos propostos; ver por/subtemas.json |
| P03 | Gêneros e tipos textuais | P03.1: tipos textuais: narração, descrição, dissertação e injunção; P03.2: gêneros jornalísticos: notícia, reportagem, editorial e crônica; P03.3: charge, tirinha, cartaz e infográfico; P03.4: divulgação científica e texto digital | site (app-atual/por/dados.json) + 10 novos propostos; ver por/subtemas.json |
| P04 | Coesão e coerência | P04.1: referência: pronome, elipse e substituição lexical; P04.2: conjunções e relações lógicas; P04.3: progressão temática, parágrafo e ordem das ideias; P04.4: ambiguidade, redundância e quebra de coerência; P04.5: intertextualidade: citação, alusão, paráfrase e paródia [NOVO] | site (app-atual/por/dados.json) + 10 novos propostos; ver por/subtemas.json |
| P05 | Semântica e vocabulário | P05.1: sentido da palavra no contexto e substituição sem mudar o sentido; P05.2: denotação, conotação e polissemia; P05.3: sinonímia, antonímia e campo semântico; P05.4: variação linguística, registro e adequação | site (app-atual/por/dados.json) + 10 novos propostos; ver por/subtemas.json |
| P06 | Figuras de linguagem | P06.1: metáfora, comparação e metonímia; P06.2: figuras de pensamento: ironia, antítese, paradoxo, eufemismo, hipérbole, personificação; P06.3: figuras de som e de construção: aliteração, anáfora, elipse, hipérbato, zeugma, pleonasmo | site (app-atual/por/dados.json) + 10 novos propostos; ver por/subtemas.json |
| P07 | Morfologia | P07.1: substantivo, adjetivo e advérbio: classificação e função; P07.2: pronomes: classificação e emprego; P07.3: verbo: tempo, modo, aspecto e flexão; P07.4: formação de palavras: derivação, composição e sentido do afixo; P07.5: artigo, numeral, preposição, conjunção e interjeição [NOVO]; P07.6: estrutura das palavras: radical, afixos e desinências [NOVO] | site (app-atual/por/dados.json) + 10 novos propostos; ver por/subtemas.json |
| P08 | Período simples | P08.1: sujeito e predicado, inclusive sujeito oculto e oração sem sujeito; P08.2: objeto direto e indireto, complemento nominal e agente da passiva; P08.3: adjunto adnominal e adverbial, aposto e vocativo; P08.4: transitividade verbal e predicação | site (app-atual/por/dados.json) + 10 novos propostos; ver por/subtemas.json |
| P09 | Período composto | P09.1: coordenação e o sentido de cada conjunção coordenativa; P09.2: orações subordinadas substantivas; P09.3: orações subordinadas adjetivas: restritiva × explicativa; P09.4: orações subordinadas adverbiais; P09.5: orações reduzidas de infinitivo, gerúndio e particípio; P09.6: funções do 'que' e do 'se' [NOVO] | site (app-atual/por/dados.json) + 10 novos propostos; ver por/subtemas.json |
| P10 | Norma e emprego | P10.1: concordância verbal e nominal; P10.2: regência verbal e nominal, e crase; P10.3: colocação pronominal: próclise, mesóclise e ênclise; P10.4: pontuação: vírgula, ponto e vírgula, dois-pontos e travessão; P10.5: vozes verbais e discurso direto, indireto e indireto livre; P10.6: ortografia, hífen, homônimos e parônimos [NOVO]; P10.7: acentuação gráfica [NOVO] | site (app-atual/por/dados.json) + 10 novos propostos; ver por/subtemas.json |
| P11 | Literatura: do Barroco ao Simbolismo | P11.1: Barroco e Arcadismo; P11.2: Romantismo: poesia das três gerações e prosa; P11.3: Realismo e Naturalismo, com Machado de Assis; P11.4: Parnasianismo e Simbolismo; P11.5: Trovadorismo, Humanismo e Classicismo [NOVO]; P11.6: Quinhentismo: literatura de informação e jesuítica [NOVO] | site (app-atual/por/dados.json) + 10 novos propostos; ver por/subtemas.json |
| P12 | Literatura: Pré-Modernismo em diante | P12.1: Pré-Modernismo: Euclides da Cunha, Lima Barreto, Augusto dos Anjos; P12.2: Modernismo de 1922, vanguardas europeias e manifestos; P12.3: Modernismo de 30: romance do Nordeste, Drummond e Bandeira; P12.4: Geração de 45 e prosa de ruptura: Guimarães Rosa, Clarice Lispector, João Cabral; P12.5: literatura contemporânea e autores africanos de língua portuguesa; P12.6: Modernismo em Portugal e Fernando Pessoa [NOVO] | site (app-atual/por/dados.json) + 10 novos propostos; ver por/subtemas.json |

### Tópicos da revisão geral

| id | capítulo | título | subs |
|---|---|---|---|
| PK01 | Gramática – Classes de palavras | As dez classes de palavras: variáveis e invariáveis | P07.1 |
| PK02 | Gramática – Classes de palavras | Substantivos: classificações semânticas e quanto à forma | P07.1 |
| PK03 | Gramática – Classes de palavras | Substantivos: flexão de gênero, número e grau | P07.1 |
| PK04 | Gramática – Classes de palavras | Adjetivos: flexão de gênero, número e grau | P07.1 |
| PK05 | Gramática – Classes de palavras | Artigos: definidos, indefinidos, contração e funções | P07.5 |
| PK06 | Gramática – Classes de palavras | Numerais: cardinal, ordinal, multiplicativo e fracionário | P07.5 |
| PK07 | Gramática – Classes de palavras | Pronomes pessoais e pronomes de tratamento | P07.2 |
| PK08 | Gramática – Classes de palavras | Pronomes possessivos, indefinidos e interrogativos | P07.2 |
| PK09 | Gramática – Classes de palavras | Pronomes demonstrativos e relativos | P07.2, P04.1 |
| PK10 | Gramática – Classes de palavras | Verbos e advérbios (classificação, graus e palavras denotativas) | P07.3, P07.1 |
| PK11 | Gramática – Classes de palavras | Preposições, conjunções e interjeições | P07.5, P04.2 |
| PK12 | Gramática – Estrutura e formação de palavras | Estrutura das palavras: morfemas, radical, vogal temática e desinências | P07.6, P07.4 |
| PK13 | Gramática – Estrutura e formação de palavras | Formação de palavras: derivação, composição e outros processos | P07.4 |
| PK14 | Gramática – Termos constituintes da oração | Frase, oração e período (simples e composto) | P08.1 |
| PK15 | Gramática – Termos constituintes da oração | Sujeito: simples, composto, oculto, indeterminado e oração sem sujeito | P08.1 |
| PK16 | Gramática – Termos constituintes da oração | Vocativo e predicado (nominal, verbal e verbo-nominal) | P08.1, P08.3 |
| PK17 | Gramática – Termos constituintes da oração | Transitividade verbal e complementos (objeto direto e indireto) | P08.4, P08.2 |
| PK18 | Gramática – Termos constituintes da oração | Adjunto adverbial e agente da passiva | P08.3, P08.2 |
| PK19 | Gramática – Termos constituintes da oração | Adjunto adnominal e complemento nominal | P08.3, P08.2 |
| PK20 | Gramática – Termos constituintes da oração | Aposto e predicativo (do sujeito e do objeto) | P08.3 |
| PK21 | Gramática – Termos constituintes da oração | Funções sintáticas dos pronomes pessoais (retos e oblíquos) | P07.2, P08.2 |
| PK22 | Gramática – Verbos | Classificação dos verbos: regulares, irregulares, anômalos, defectivos, abundantes e semântica | P07.3 |
| PK23 | Gramática – Verbos | Estrutura do verbo, conjugações, transitividade e formas nominais | P07.3 |
| PK24 | Gramática – Verbos | Tempo, modo, aspecto e perífrase verbal | P07.3 |
| PK25 | Gramática – Verbos | Vozes verbais: ativa, passiva (analítica e sintética), reflexiva e o 'se' | P10.5 |
| PK26 | Gramática – Verbos | Correlação verbal (tempos e modos que combinam no período) | P07.3 |
| PK27 | Gramática – Orações coordenadas | Orações coordenadas assindéticas e sindéticas (aditiva, alternativa, adversativa, explicativa, conclusiva) | P09.1 |
| PK28 | Gramática – Orações subordinadas | Orações subordinadas substantivas (desenvolvidas e reduzidas) | P09.2, P09.5 |
| PK29 | Gramática – Orações subordinadas | Orações subordinadas adjetivas: explicativas e restritivas (e reduzidas) | P09.3, P09.5 |
| PK30 | Gramática – Orações subordinadas | Orações subordinadas adverbiais (nove tipos) e reduzidas | P09.4, P09.5 |
| PK31 | Gramática – Funções do que e do se | Funções do 'que' | P09.6 |
| PK32 | Gramática – Funções do que e do se | Funções do 'se' | P09.6 |
| PK33 | Gramática – Concordância verbal | Concordância verbal: sujeito simples, pronomes 'que' e 'quem', verbos impessoais | P10.1 |
| PK34 | Gramática – Concordância verbal | Concordância com o verbo 'ser' e na voz passiva sintética | P10.1 |
| PK35 | Gramática – Concordância verbal | Concordância verbal com sujeito composto, coletivo e substantivos de sentido singular ou plural | P10.1 |
| PK36 | Gramática – Concordância nominal | Concordância nominal: adjetivo com dois ou mais substantivos e predicativo | P10.1 |
| PK37 | Gramática – Concordância nominal | Concordância nominal: casos de dúvida (mesmo, anexo, obrigado, meio, bastante, é proibido) e silepse | P10.1 |
| PK38 | Gramática – Regência | Regência verbal: verbos que geram dúvida, pronome relativo e complemento comum | P10.2 |
| PK39 | Gramática – Regência | Regência nominal: a preposição que cada nome pede | P10.2 |
| PK40 | Gramática – Crase | Crase: conceito e uso obrigatório | P10.2 |
| PK41 | Gramática – Crase | Crase: uso proibido | P10.2 |
| PK42 | Gramática – Crase | Crase facultativa, casos especiais (casa, terra, distância) e contextos ambíguos | P10.2 |
| PK43 | Gramática – Colocação pronominal | Colocação pronominal: próclise e palavras atrativas | P10.3 |
| PK44 | Gramática – Colocação pronominal | Mesóclise, ênclise e colocação nas locuções verbais | P10.3 |
| PK45 | Gramática – Ortografia | Ortografia: grafias dos sons /ʒ/, /ʃ/, /s/ e /z/ | P10.6 |
| PK46 | Gramática – Ortografia | Emprego do hífen (prefixos e palavras compostas) | P10.6 |
| PK47 | Gramática – Ortografia | Homônimos e parônimos | P10.6, P05.3 |
| PK48 | Gramática – Ortografia | Dúvidas comuns: por que/por quê/porque/porquê, onde/aonde, mau/mal, senão/se não, mas/mais, a fim de/afim | P10.6 |
| PK49 | Gramática – Acentuação | Acentuação gráfica: tonicidade, regras por classe, hiatos e acento diferencial | P10.7 |
| PK50 | Gramática – Pontuação | Vírgula: usos e proibições | P10.4 |
| PK51 | Gramática – Pontuação | Outros sinais de pontuação | P10.4 |
| PK52 | Gramática – Vícios de linguagem | Vícios de linguagem: queísmo, pleonasmo, barbarismo, estrangeirismo, solecismo, gerundismo, ambiguidade, eco, cacofonia | P04.4 |
| LK01 | Literatura – Fundamentos da linguagem literária | Linguagem literária: efeito estético, mimesis, gêneros e literariedade | P03.1, P05.2 |
| LK02 | Literatura – Fundamentos da linguagem literária | Elementos da narrativa: narrador, personagens, enredo, tempo, espaço e discurso | P03.1 |
| LK03 | Literatura – Literatura medieval | Trovadorismo: cantigas líricas e satíricas, trovador, jogral e menestrel | P11.5 |
| LK04 | Literatura – Literatura medieval | Humanismo: transição para o Renascimento, Fernão Lopes e Gil Vicente | P11.5 |
| LK05 | Literatura – Origens da literatura em língua portuguesa | Classicismo: Renascimento, Camões épico e lírico | P11.5 |
| LK06 | Literatura – Origens da literatura em língua portuguesa | Classicismo em resumo: contexto, características e a épica e a lírica de Camões | P11.5 |
| LK07 | Literatura – Literatura de formação no Brasil | Quinhentismo: Carta de Caminha e literatura jesuítica (Anchieta) | P11.6 |
| LK08 | Literatura – Barroco | Barroco: contexto, cultismo e conceptismo, Vieira e Gregório de Matos | P11.1 |
| LK09 | Literatura – Arcadismo | Arcadismo: Neoclassicismo, fingimento poético, Inconfidência e os árcades brasileiros | P11.1 |
| LK10 | Literatura – Romantismo | Romantismo no Brasil: contexto histórico e as três gerações poéticas | P11.2 |
| LK11 | Literatura – Romantismo | Prosa romântica: folhetim, romances de costumes, José de Alencar e Maria Firmina dos Reis | P11.2 |
| LK12 | Literatura – Romantismo | Romantismo em resumo: contexto, gerações e prosa (esquema do livro) | P11.2 |
| LK13 | Literatura – Realismo e Naturalismo | Realismo: contexto científico, Portugal (Questão Coimbrã, Eça) e Brasil (Machado, Júlia Lopes) | P11.3 |
| LK14 | Literatura – Realismo e Naturalismo | Naturalismo: romance de tese, zoomorfização, Aluísio Azevedo e Raul Pompeia | P11.3 |
| LK15 | Literatura – Realismo e Naturalismo | Realismo x Naturalismo: quadro comparativo | P11.3 |
| LK16 | Literatura – Parnasianismo e Simbolismo | Parnasianismo: arte pela arte, forma fixa e Olavo Bilac | P11.4 |
| LK17 | Literatura – Parnasianismo e Simbolismo | Simbolismo: poesia das sensações, musicalidade e simbolistas brasileiros | P11.4 |
| LK18 | Literatura – Pré-Modernismo | Pré-Modernismo: transição, Euclides da Cunha, Lima Barreto, Monteiro Lobato e Augusto dos Anjos | P12.1 |
| LK19 | Literatura – Vanguardas europeias | Vanguardas europeias: Futurismo, Expressionismo, Cubismo, Dadaísmo e Surrealismo | P12.2 |
| LK20 | Literatura – Modernismo em Portugal | Modernismo em Portugal: revista Orpheu e contexto | P12.6 |
| LK21 | Literatura – Modernismo em Portugal | Fernando Pessoa: poesia ortônima e heterônimos (Caeiro, Reis, Campos) | P12.6 |
| LK22 | Literatura – Modernismo no Brasil | Modernismo no Brasil: Semana de 1922 e primeira geração (Mário, Oswald, Bandeira) | P12.2 |
| LK23 | Literatura – Modernismo no Brasil | Segunda geração modernista (1930) e Carlos Drummond de Andrade (três fases) | P12.3 |
| LK24 | Literatura – Modernismo no Brasil | Poesia da segunda geração: Cecília Meireles, Vinicius de Moraes, Jorge de Lima e Murilo Mendes | P12.3 |
| LK25 | Literatura – Modernismo no Brasil | Romance de 30: Rachel de Queiroz, Jorge Amado, Graciliano Ramos, José Lins do Rego e Erico Verissimo | P12.3 |
| LK26 | Literatura – Modernismo no Brasil | Terceira geração (1945): Clarice Lispector e João Cabral de Melo Neto | P12.4 |
| LK27 | Literatura – Modernismo no Brasil | Guimarães Rosa: regionalismo universalista, neologismos e obras principais | P12.4 |
| LK28 | Literatura – Concretismo e desdobramentos | Concretismo, Neoconcretismo e Ferreira Gullar | P12.5 |
| LK29 | Literatura – Vertentes da literatura contemporânea | Narrativas contemporâneas: urbanas, realismo insólito, Hatoum e Bernardo Carvalho | P12.5 |
| LK30 | Literatura – Vertentes da literatura contemporânea | Literatura escrita por mulheres: Geração Mimeógrafo, Ana Cristina Cesar, Adélia Prado, Lygia, Sophia | P12.5 |
| LK31 | Literatura – Vertentes da literatura contemporânea | Literatura afrodescendente: Carolina Maria de Jesus, Conceição Evaristo, Ana Maria Gonçalves e outros | P12.5 |
| LK32 | Literatura – Vertentes da literatura contemporânea | Literatura marginalizada ou periférica: Ferréz, Cooperifa, Racionais, slam | P12.5 |
| LK33 | Literatura – Literaturas africanas em língua portuguesa | Literaturas africanas de língua portuguesa: contexto e quatro momentos | P12.5 |
| LK34 | Literatura – Literaturas africanas em língua portuguesa | Literatura moçambicana: fases colonial, nacionalista e pós-colonial | P12.5 |
| LK35 | Literatura – Literaturas africanas em língua portuguesa | Literatura angolana pós-colonial: Pepetela, Agualusa, Ondjaki e Djaimilia Pereira de Almeida | P12.5 |
| LK36 | Literatura – Literaturas indígenas no Brasil | Literaturas indígenas: linha do tempo, Lei 11.645/2008, escrita como tradução cultural | P12.5 |
| LK37 | Literatura – Literaturas indígenas no Brasil | Território, cosmologia e identidade: Kopenawa, Krenak, Kambeba, Dorrico, Potiguara e Graúna | P12.5 |
| LK38 | Literatura – Literaturas indígenas no Brasil | Oralidade e tradição: Daniel Munduruku, Kaká Werá Jecupé e síntese temática | P12.5 |
| IK01 | Interpretação de Texto – Figuras de linguagem | Linguagem conotativa e figuras semânticas de comparação | P06.1, P05.2 |
| IK02 | Interpretação de Texto – Figuras de linguagem | Figuras de oposição: antítese, paradoxo, ironia, sarcasmo e preterição | P06.2 |
| IK03 | Interpretação de Texto – Figuras de linguagem | Figuras de intensidade e realce: hipérbole, eufemismo, gradação, sinestesia, apóstrofe e oximoro | P06.2 |
| IK04 | Interpretação de Texto – Figuras de linguagem | Figuras sintáticas de apagamento: elipse, zeugma e assíndeto | P06.3 |
| IK05 | Interpretação de Texto – Figuras de linguagem | Figuras sintáticas de repetição: polissíndeto, anáfora, epístrofe e pleonasmo | P06.3 |
| IK06 | Interpretação de Texto – Figuras de linguagem | Figuras sintáticas de ruptura e inversão: silepse, anacoluto, quiasmo e hipérbato | P06.3 |
| IK07 | Interpretação de Texto – Figuras de linguagem | Figuras sonoras: assonância, aliteração, onomatopeia, cacofonia e paronomásia | P06.3 |
| IK08 | Interpretação de Texto – Tipologia textual | Texto narrativo: foco narrativo, tempo e quebras da progressão temporal | P03.1 |
| IK09 | Interpretação de Texto – Tipologia textual | Texto descritivo, injuntivo e prescritivo | P03.1 |
| IK10 | Interpretação de Texto – Tipologia textual | Texto dissertativo: argumentativo × expositivo e desenvolvimento dedutivo × indutivo | P03.1, P02.1 |
| IK11 | Interpretação de Texto – Tipos de discurso | Discurso direto e indireto e a conversão entre eles | P10.5 |
| IK12 | Interpretação de Texto – Tipos de discurso | Discurso indireto livre | P10.5 |
| IK13 | Interpretação de Texto – Gêneros textuais | Gêneros textuais: características composicionais e esferas jornalística e propagandística | P03.2 |
| IK14 | Interpretação de Texto – Gêneros textuais | Gêneros da esfera digital: divulgação científica, podcast e memes | P03.4 |
| IK15 | Interpretação de Texto – Funções da linguagem | Funções da linguagem: elementos da comunicação, emotiva e apelativa (conativa) | P01.5 |
| IK16 | Interpretação de Texto – Funções da linguagem | Funções fática, poética, referencial e metalinguística | P01.5 |
| IK17 | Interpretação de Texto – Coesão textual | Coesão textual: relações de progressão e conectores subordinativos | P04.2 |
| IK18 | Interpretação de Texto – Coesão textual | Conectores coordenativos e coesão por remissão (anafórica) | P04.2, P04.1 |
| IK19 | Interpretação de Texto – Coesão textual | Coesão por antecipação (catafórica) | P04.1 |
| IK20 | Interpretação de Texto – Ambiguidade textual | Ambiguidade semântica: polissemia, duplo sentido e homonímia | P04.4, P05.2 |
| IK21 | Interpretação de Texto – Ambiguidade textual | Ambiguidade sintática: qualificador, pronome e elipse | P04.4 |
| IK22 | Interpretação de Texto – Intertextualidade | Intertextualidade explícita: citação e epígrafe | P04.5 |
| IK23 | Interpretação de Texto – Intertextualidade | Intertextualidade implícita: alusão, paráfrase e paródia | P04.5 |
| IK24 | Interpretação de Texto – Intertextualidade | Paráfrase × paródia na prática e quadro das intertextualidades implícitas | P04.5 |
| IK25 | Interpretação de Texto – Variações linguísticas | Tipos de variação linguística: geográfica, histórica, situacional e social | P05.4 |
| IK26 | Interpretação de Texto – Variações linguísticas | Preconceito linguístico | P05.4 |
| IK27 | Interpretação de Texto – Tipos de questão | Tipos de questão: paráfrase, inferência, síntese analítica e síntese comparativa | P01.2, P01.1 |
| RK01 | Produção de Texto – A redação no Enem | Formato da prova e as 5 competências da redação do Enem | — |
| RK02 | Produção de Texto – A redação no Enem | Estrutura da redação Enem: 4 parágrafos, tese e conclusão | — |
| RK03 | Produção de Texto – A redação no Enem | Abordagem do tema: temas 2016–2025 e como problematizar | — |
| RK04 | Produção de Texto – A redação no Enem | Introdução: contexto, ponte e tese (progressão argumentativa) | — |
| RK05 | Produção de Texto – A redação no Enem | Repertório sociocultural na Competência 2: legitimado, pertinente e produtivo | — |
| RK06 | Produção de Texto – A redação no Enem | Parágrafo argumentativo: TF, expansão, repertório e fecho; tipos de argumento e lacunas | P02.1 |
| RK07 | Produção de Texto – A redação no Enem | Recursos coesivos referenciais e sequenciais (operadores argumentativos) — Competência 4 | P04.2 |
| RK08 | Produção de Texto – A redação no Enem | Proposta de intervenção: os 5 elementos e três modelos de frase | — |
| RK09 | Produção de Texto – A redação no Enem | Passo a passo: como fazer uma boa redação no Enem | — |
| RK10 | Produção de Texto – A dissertação clássica | Dissertação clássica: quem cobra, estrutura e estratégias de introdução e conclusão | — |
| RK11 | Produção de Texto – A dissertação clássica | Leitura da coletânea, assunto × tema e ampliação temática | — |
| RK12 | Produção de Texto – A dissertação clássica | Como expandir argumentos e recursos de autoria: campo semântico (exemplo Fuvest 2025) | — |
| RK13 | Produção de Texto – Gêneros textuais | Gêneros textuais: conceito, interlocutores, prática social e vestibulares que cobram | P03.1 |
| RK14 | Produção de Texto – Gêneros textuais | Texto narrativo: enredo, narrador, personagem, espaço e tempo | P03.1 |
| RK15 | Produção de Texto – Gêneros textuais | Gêneros narrativos: narrativa clássica, conto, crônica, relato pessoal, diário e carta pessoal | P03.2 |
| RK16 | Produção de Texto – Gêneros textuais | Gêneros expositivos: notícia, reportagem, divulgação científica, resumo, verbete e relatório | P03.2, P03.4 |
| RK17 | Produção de Texto – Gêneros textuais | Gêneros argumentativos: artigo de opinião, cartas, abaixo-assinado | P03.2, P02.1 |
| RK18 | Produção de Texto – Gêneros textuais | Postagem em fórum, post em rede social, resenha crítica, manifesto e discurso político | P03.4 |
| RK19 | Produção de Texto – Gêneros textuais | Gêneros injuntivos: texto instrucional, receita culinária e guia de viagem | P03.1 |
| RK20 | Produção de Texto – Outros padrões de redação | Redação por tarefas específicas (UFPR): comandos identifique, sintetize, inicie e finalize | — |
| RK21 | Produção de Texto – Outros padrões de redação | Resposta argumentativa × resposta interpretativa (UEM) | — |
| RK22 | Produção de Texto – Checklist | Checklist da redação: todas as etapas | — |

## Matemática (`mat`)

_Sem arquivos por tema nesta matéria (só `geral.json` e `resumos.json`)._

### Temas e subtemas sem arquivo por tema

| tema | nome | subtemas (id: título) | origem |
|---|---|---|---|
| M01 | Fundamentos | M01.1: Frações e decimais; M01.2: Potências e radicais; M01.3: Notação científica e ordem de grandeza; M01.4: Divisibilidade, MMC e MDC; M01.5: Conjuntos numéricos | resumos.json (sem arquivo por tema) |
| M02 | Razão e proporção | M02.1: Razão e proporção; M02.2: Regra de três simples e composta; M02.3: Escalas e densidade; M02.4: Grandezas direta e inversamente proporcionais; M02.5: Divisão proporcional | resumos.json (sem arquivo por tema) |
| M03 | Porcentagem e finanças | M03.1: Porcentagem simples; M03.2: Aumentos e descontos sucessivos; M03.3: Juros simples; M03.4: Juros compostos; M03.5: Dose, concentração e proporção aplicada à saúde | resumos.json (sem arquivo por tema) |
| M04 | Equações e sistemas | M04.1: Equação do 1.º grau; M04.2: Equação do 2.º grau; M04.3: Sistemas lineares; M04.4: Inequações; M04.5: Problemas de modelagem algébrica | resumos.json (sem arquivo por tema) |
| M05 | Funções afim e quadrática | M05.1: Função afim; M05.2: Função quadrática e vértice; M05.3: Leitura de gráficos de funções; M05.4: Função definida por partes e modular; M05.5: Composição e inversa | resumos.json (sem arquivo por tema) |
| M06 | Exponencial e logaritmo | M06.1: Função exponencial; M06.2: Equação exponencial; M06.3: Definição e propriedades do logaritmo; M06.4: Equação logarítmica; M06.5: Meia-vida, decaimento e crescimento | resumos.json (sem arquivo por tema) |
| M07 | Sequências | M07.1: Progressão aritmética; M07.2: Progressão geométrica; M07.3: Soma de termos; M07.4: Padrões e recorrências | resumos.json (sem arquivo por tema) |
| M08 | Geometria plana — áreas | M08.1: Triângulos; M08.2: Quadriláteros; M08.3: Circunferência e círculo; M08.4: Polígonos regulares; M08.5: Áreas compostas e hachuradas; M08.6: Áreas básicas | resumos.json (sem arquivo por tema) |
| M09 | Geometria plana — relações | M09.1: Teorema de Pitágoras; M09.2: Teorema de Tales; M09.3: Semelhança de triângulos; M09.4: Relações métricas no triângulo retângulo; M09.5: Ângulos e propriedades | resumos.json (sem arquivo por tema) |
| M10 | Trigonometria | M10.1: Razões trigonométricas no triângulo retângulo; M10.2: Lei dos senos; M10.3: Lei dos cossenos; M10.4: Ciclo trigonométrico e arcos; M10.5: Funções trigonométricas e gráficos | resumos.json (sem arquivo por tema) |
| M11 | Geometria espacial | M11.1: Prismas e cubos; M11.2: Cilindros; M11.3: Pirâmides e cones; M11.4: Esfera; M11.5: Troncos, sólidos compostos e densidade/volume; M11.6: Volumes básicos | resumos.json (sem arquivo por tema) |
| M12 | Geometria analítica | M12.1: Distância entre pontos e ponto médio; M12.2: Equação da reta; M12.3: Posição relativa e paralelismo; M12.4: Circunferência no plano cartesiano; M12.5: Áreas por coordenadas | resumos.json (sem arquivo por tema) |
| M13 | Combinatória e probabilidade | M13.1: Princípio multiplicativo; M13.2: Arranjos e permutações; M13.3: Combinações; M13.4: Probabilidade simples; M13.5: Probabilidade condicional e teste diagnóstico; M13.6: União, intersecção e evento complementar; M13.9: Combinatória e probabilidade — outros casos | resumos.json (sem arquivo por tema) |
| M14 | Estatística | M14.1: Média, mediana e moda; M14.2: Leitura de tabelas e gráficos; M14.3: Dispersão e desvio padrão; M14.4: Média ponderada; M14.5: Interpretação de dados em saúde | resumos.json (sem arquivo por tema) |
| M15 | Matrizes e determinantes | M15.1: Operações com matrizes; M15.2: Determinantes; M15.3: Aplicação em sistemas | resumos.json (sem arquivo por tema) |
| M16 | Polinômios e complexos | M16.1: Polinômios e relações de Girard; M16.2: Números complexos | resumos.json (sem arquivo por tema) |
| M17 | Lógica e algoritmos | M17.1: Raciocínio lógico e dedução; M17.2: Algoritmos e sistemas de numeração | resumos.json (sem arquivo por tema) |

### Tópicos da revisão geral

| id | capítulo | título | subs |
|---|---|---|---|
| M01.1 | Conjuntos numéricos | Frações e decimais | M01.1 |
| M01.2 | Conjuntos numéricos | Potências e radicais | M01.2 |
| G30 | Radiciação | Radiciação: propriedades e racionalização | M01.2 |
| M01.3 | Conjuntos numéricos | Notação científica e ordem de grandeza | M01.3 |
| M01.4 | Conjuntos numéricos | Divisibilidade, MMC e MDC | M01.4 |
| G02 | Conjuntos numéricos | Divisibilidade, primos, MMC e MDC (detalhe) | M01.4 |
| M01.5 | Conjuntos numéricos | Conjuntos numéricos | M01.5 |
| G01 | Teoria elementar dos conjuntos | Teoria dos conjuntos e operações | M01.5 |
| M02.1 | Expressões numéricas e algébricas | Razão e proporção | M02.1 |
| M02.2 | Expressões numéricas e algébricas | Regra de três simples e composta | M02.2 |
| M02.3 | Expressões numéricas e algébricas | Escalas e densidade | M02.3 |
| M02.4 | Expressões numéricas e algébricas | Grandezas direta e inversamente proporcionais | M02.4 |
| M02.5 | Expressões numéricas e algébricas | Divisão proporcional | M02.5 |
| M03.1 | Matemática financeira | Porcentagem simples | M03.1 |
| M03.2 | Matemática financeira | Aumentos e descontos sucessivos | M03.2 |
| M03.3 | Matemática financeira | Juros simples | M03.3 |
| M03.4 | Matemática financeira | Juros compostos | M03.4 |
| M03.5 | Matemática financeira | Dose, concentração e proporção aplicada à saúde | M03.5 |
| M04.1 | Função do 1.º e do 2.º grau | Equação do 1.º grau | M04.1 |
| G03 | Expressões numéricas e algébricas | Sentenças, equações e identidades | M04.1 |
| M04.2 | Função do 1.º e do 2.º grau | Equação do 2.º grau | M04.2 |
| G04 | Expressões numéricas e algébricas | Fatoração e produtos notáveis | M04.2, M01.2 |
| M04.3 | Função do 1.º e do 2.º grau | Sistemas lineares | M04.3 |
| M04.4 | Função do 1.º e do 2.º grau | Inequações | M04.4 |
| G07 | Função do 1.º e 2.º grau | Inequações, estudo do sinal e forma fatorada | M04.4, M05.1, M05.2 |
| M04.5 | Função do 1.º e do 2.º grau | Problemas de modelagem algébrica | M04.5 |
| M05.1 | Funções | Função afim | M05.1 |
| M05.2 | Funções | Função quadrática e vértice | M05.2 |
| G08 | Cônicas | Parábola (lugar geométrico) | M05.2, M12.4 |
| M05.3 | Funções | Leitura de gráficos de funções | M05.3 |
| G05 | Introdução às funções | Par ordenado, produto cartesiano, relação e função | M05.3 |
| G06 | Introdução às funções | Classificação das funções: sobrejetora, injetora, monotonicidade, paridade, periodicidade | M05.3 |
| M05.4 | Funções | Função definida por partes e modular | M05.4 |
| M05.5 | Funções | Composição e inversa | M05.5 |
| M06.1 | Exponenciais e logaritmos | Função exponencial | M06.1 |
| M06.2 | Exponenciais e logaritmos | Equação exponencial | M06.2 |
| G29 | Exponencial e logaritmo | Inequações exponencial e logarítmica, cologaritmo | M06.2, M06.4 |
| M06.3 | Exponenciais e logaritmos | Definição e propriedades do logaritmo | M06.3 |
| M06.4 | Exponenciais e logaritmos | Equação logarítmica | M06.4 |
| M06.5 | Exponenciais e logaritmos | Meia-vida, decaimento e crescimento | M06.5 |
| M07.1 | Sequências numéricas | Progressão aritmética | M07.1 |
| M07.2 | Sequências numéricas | Progressão geométrica | M07.2 |
| M07.3 | Sequências numéricas | Soma de termos | M07.3 |
| M07.4 | Sequências numéricas | Padrões e recorrências | M07.4 |
| M08.1 | Áreas e polígonos | Triângulos | M08.1 |
| G14 | Triângulos | Classificação, existência e ângulos do triângulo | M08.1, M09.5 |
| G15 | Triângulos | Pontos notáveis do triângulo | M08.1, M09.3 |
| M08.2 | Áreas e polígonos | Quadriláteros | M08.2 |
| M08.3 | Áreas e polígonos | Circunferência e círculo | M08.3 |
| M08.4 | Áreas e polígonos | Polígonos regulares | M08.4 |
| M08.5 | Áreas e polígonos | Áreas compostas e hachuradas | M08.5 |
| M08.6 | Áreas e polígonos | Áreas básicas | M08.6 |
| M09.1 | Introdução à Geometria plana | Teorema de Pitágoras | M09.1 |
| M09.2 | Introdução à Geometria plana | Teorema de Tales | M09.2 |
| G16 | Triângulos | Congruência e teoremas da Geometria plana | M09.2, M09.3 |
| G32 | Razão de divisão de segmento | Divisão de segmento: média, harmônica e áurea | M09.2 |
| M09.3 | Introdução à Geometria plana | Semelhança de triângulos | M09.3 |
| M09.4 | Introdução à Geometria plana | Relações métricas no triângulo retângulo | M09.4 |
| M09.5 | Introdução à Geometria plana | Ângulos e propriedades | M09.5 |
| G31 | Isometrias | Isometrias: translação, rotação e reflexões | M09.5 |
| M10.1 | Trigonometria | Razões trigonométricas no triângulo retângulo | M10.1 |
| M10.2 | Trigonometria | Lei dos senos | M10.2 |
| M10.3 | Trigonometria | Lei dos cossenos | M10.3 |
| M10.4 | Trigonometria | Ciclo trigonométrico e arcos | M10.4 |
| G28 | Trigonometria | Transformações trigonométricas | M10.4, M10.5 |
| M10.5 | Trigonometria | Funções trigonométricas e gráficos | M10.5 |
| M11.1 | Geometria espacial | Prismas e cubos | M11.1 |
| G17 | Geometria posicional e poliedros | Geometria de posição e poliedros | M11.1 |
| M11.2 | Geometria espacial | Cilindros | M11.2 |
| M11.3 | Geometria espacial | Pirâmides e cones | M11.3 |
| G18 | Corpos redondos | Pirâmide regular, tronco e inscrições de sólidos | M11.3, M11.5 |
| M11.4 | Geometria espacial | Esfera | M11.4 |
| M11.5 | Geometria espacial | Troncos, sólidos compostos e densidade/volume | M11.5 |
| M11.6 | Geometria espacial | Volumes básicos | M11.6 |
| M12.1 | Geometria analítica | Distância entre pontos e ponto médio | M12.1 |
| M12.2 | Geometria analítica | Equação da reta | M12.2 |
| M12.3 | Geometria analítica | Posição relativa e paralelismo | M12.3 |
| G13 | Geometria analítica | Bissetrizes e ângulo entre retas | M12.3 |
| M12.4 | Geometria analítica | Circunferência no plano cartesiano | M12.4 |
| G09 | Cônicas | Elipse | M12.4 |
| G10 | Cônicas | Hipérbole | M12.4 |
| G11 | Geometria analítica | Inequações com duas variáveis e regiões do plano | M12.4, M05.3 |
| M12.5 | Geometria analítica | Áreas por coordenadas | M12.5 |
| G12 | Geometria analítica | Área de polígono por coordenadas e alinhamento | M12.5, M12.2 |
| M13.1 | Análise combinatória e probabilidade | Princípio multiplicativo | M13.1 |
| M13.2 | Análise combinatória e probabilidade | Arranjos e permutações | M13.2 |
| M13.3 | Análise combinatória e probabilidade | Combinações | M13.3 |
| M13.4 | Análise combinatória e probabilidade | Probabilidade simples | M13.4 |
| G20 | Probabilidade | Experimento, espaço amostral e produto de probabilidades | M13.4, M13.5 |
| M13.5 | Análise combinatória e probabilidade | Probabilidade condicional e teste diagnóstico | M13.5 |
| M13.6 | Análise combinatória e probabilidade | União, intersecção e evento complementar | M13.6 |
| M13.9 | Análise combinatória e probabilidade | Combinatória e probabilidade — outros casos | M13.9 |
| G19 | Análise combinatória | Fatorial, binomial, Pascal e Newton | M13.9, M13.3 |
| M14.1 | Estatística | Média, mediana e moda | M14.1 |
| M14.2 | Estatística | Leitura de tabelas e gráficos | M14.2 |
| G21 | Estatística | Definições, frequências e tabelas | M14.2, M14.1 |
| M14.3 | Estatística | Dispersão e desvio padrão | M14.3 |
| M14.4 | Estatística | Média ponderada | M14.4 |
| G22 | Estatística | Média geométrica, harmônica e ponderada | M14.4, M14.1 |
| M14.5 | Estatística | Interpretação de dados em saúde | M14.5 |
| M15.1 | Álgebra linear | Operações com matrizes | M15.1 |
| G25 | Álgebra linear | Tipos de matrizes e propriedades da transposta | M15.1 |
| M15.2 | Álgebra linear | Determinantes | M15.2 |
| G26 | Álgebra linear | Determinantes: propriedades, Laplace, Chió e Vandermonde | M15.2 |
| M15.3 | Álgebra linear | Aplicação em sistemas | M15.3 |
| G27 | Álgebra linear | Matriz inversa, Cramer e escalonamento | M15.3, M04.3 |
| M16.1 | Polinômios e números complexos | Polinômios e relações de Girard | M16.1 |
| G23 | Equações polinomiais | Equações polinomiais: raízes e teoremas | M16.1 |
| G24 | Polinômios | Divisão de polinômios, Briot-Ruffini e teoremas | M16.1 |
| M16.2 | Polinômios e números complexos | Números complexos | M16.2 |
| M17.1 | Lógica e sistemas de numeração | Raciocínio lógico e dedução | M17.1 |
| M17.2 | Lógica e sistemas de numeração | Algoritmos e sistemas de numeração | M17.2 |

## Biologia (`bio`)

### Temas e subtemas (arquivos por tema)

| tema | nome | subtemas (id: título) | slides |
|---|---|---|---|
| B01 | Citologia | B01.1: Bicamada, difusão e osmose; B01.2: Bombas, cotransporte e vesículas; B01.3: Parede, junções e tipos celulares; B01.4: Endomembranas em ação; B01.5: Organelas que já foram bactérias; B01.6: Cromatina, telômeros e microtúbulos | 60 |
| B02 | Bioquímica celular | B02.1: Água: polaridade e propriedades; B02.2: Açúcares e gorduras: unidades e ligações; B02.3: Aminoácidos e níveis da proteína; B02.4: Cofatores e gráficos de enzima; B02.5: Nucleotídeo, ATP e papel das vitaminas | 50 |
| B04 | Divisão celular e câncer | B04.1: Ciclo celular e pontos de checagem; B04.2: Mitose; B04.3: Meiose e crossing-over; B04.4: Gametogênese e não disjunção; B04.5: Apoptose e câncer | 50 |
| B09 | Ecologia | B09.1: Níveis de organização e níveis tróficos; B09.2: Produtividade e eficiência; B09.3: Carbono, metano e nitrogênio; B09.4: Sinais das relações ecológicas; B09.5: Sucessão e crescimento populacional; B09.6: Pistas dos biomas e cadeias de impacto | 60 |
| B11 | Evolução | B11.1: Fósseis e datação; B11.2: Seleção natural na prática; B11.3: Mutação, gargalo e fundador; B11.4: Hardy-Weinberg em três passos; B11.5: Origem da vida: a ordem dos fatos | 50 |

### Temas e subtemas sem arquivo por tema

| tema | nome | subtemas (id: título) | origem |
|---|---|---|---|
| B03 | Metabolismo energético | B03.1: respiração celular: visão geral e glicólise; B03.2: ciclo de Krebs e cadeia transportadora de elétrons; B03.3: balanço energético e o papel do oxigênio; B03.4: fermentação láctica e alcoólica; B03.5: fotossíntese: fase fotoquímica e ciclo de Calvin; B03.6: fatores limitantes, plantas C4 e CAM, fotorrespiração e quimiossíntese | site (app-atual/bio/dados.json), sem arquivo por tema |
| B05 | Genética molecular | B05.1: DNA: estrutura, pareamento e replicação semiconservativa; B05.2: transcrição e processamento do RNA; B05.3: código genético e tradução; B05.4: mutações: pontual, frameshift e cromossômica; B05.5: regulação da expressão gênica: fatores de transcrição e diferenciação celular; B05.6: biotecnologia: PCR, eletroforese, DNA recombinante, transgênicos, CRISPR e clonagem | site (app-atual/bio/dados.json), sem arquivo por tema |
| B06 | Genética clássica | B06.1: 1ª lei de Mendel, segregação e probabilidade em cruzamentos; B06.2: 2ª lei de Mendel e segregação independente; B06.3: heredogramas: identificar dominante ou recessiva; B06.4: dominância incompleta, codominância, alelos múltiplos, sistema ABO e fator Rh; B06.5: herança ligada ao sexo; B06.6: linkage e permuta, epistasia, pleiotropia e herança quantitativa | site (app-atual/bio/dados.json), sem arquivo por tema |
| B07 | Fisiologia humana I | B07.1: os quatro tecidos fundamentais; B07.2: digestão, absorção intestinal, fígado e pâncreas; B07.3: ventilação pulmonar, hematose e controle da respiração; B07.4: coração e as duas circulações; B07.5: sangue, coagulação e pressão arterial; B07.6: néfron, formação da urina e equilíbrio hidrossalino | site (app-atual/bio/dados.json), sem arquivo por tema |
| B08 | Neuro, hormônios, imune e reprodução | B08.1: neurônio, potencial de repouso e potencial de ação; B08.2: sinapse e neurotransmissores; B08.3: sistema nervoso autônomo e arco reflexo; B08.4: eixo hipofisário e feedback negativo; B08.5: hormônios: insulina e glucagon, tireoide, cortisol e adrenalina; B08.6: imunidade inata e adaptativa, vacina × soro e memória imunológica; B08.7: ciclo menstrual, fecundação, clivagem e folhetos embrionários | site (app-atual/bio/dados.json), sem arquivo por tema |
| B10 | Saúde e doenças | B10.1: viroses e arboviroses; B10.2: bacterioses e resistência bacteriana; B10.3: protozooses e seus vetores; B10.4: verminoses: ciclos e via de entrada; B10.5: profilaxia, saneamento, imunização e ISTs | site (app-atual/bio/dados.json), sem arquivo por tema |
| B12 | Diversidade dos seres vivos | B12.1: vírus e bactérias: estrutura, ciclos e reprodução; B12.2: protistas e fungos; B12.3: tecidos vegetais, xilema; B12.4: estômatos, transpiração, hormônios vegetais e fotoperiodismo; B12.5: invertebrados: novidades evolutivas; B12.6: vertebrados, classificação, nomenclatura e filogenia | site (app-atual/bio/dados.json), sem arquivo por tema |

### Tópicos da revisão geral

| id | capítulo | título | subs |
|---|---|---|---|
| BK01 | Introdução à Biologia | Características dos seres vivos e método científico | B09.1 |
| BK02 | Química dos seres vivos | Água e sais minerais | B02.1 |
| BK03 | Química dos seres vivos | Carboidratos | B02.2 |
| BK04 | Química dos seres vivos | Lipídios | B02.2 |
| BK05 | Química dos seres vivos | Proteínas e enzimas | B02.3, B02.4 |
| BK06 | Química dos seres vivos | Ácidos nucleicos e código genético | B02.5 |
| BK07 | Biologia celular | Tipos celulares e organelas | B01.4, B01.5 |
| BK08 | Biologia celular | Parede celular e membrana plasmática | B01.1, B01.2, B01.3 |
| BK09 | Biologia celular | Núcleo, cromossomos e ploidia | B01.6 |
| BK09b | Biologia celular | Mapa mental: Biologia celular (visão geral) | B01.1, B01.4, B01.5, B01.6 |
| BK10 | Biologia celular | Ciclo celular e mitose | B04.1, B04.2, B04.5 |
| BK10b | Divisão celular | Etapas da mitose e da meiose (esquema) | B04.1, B04.2, B04.3 |
| BK11 | Biologia celular | Gametogênese | B04.3, B04.4 |
| BK12 | Bioenergética | Respiração celular e fermentação | B03.1, B03.2, B03.3, B03.4 |
| BK13 | Bioenergética | Fotossíntese e quimiossíntese | B03.5, B03.6 |
| BK14 | Taxonomia e microbiologia | Classificação dos seres vivos | B12.6 |
| BK14a | Fungos e protozoários | Fungos | B12.2 |
| BK14b | Fungos e protozoários | Protozoários | B12.2 |
| BK15 | Microbiologia | Vírus, bactérias e arqueas | B12.1 |
| BK16 | Ciclos reprodutivos e algas | Ciclos de vida e algas | B12.2 |
| BK17 | Botânica | Classificação e reprodução das plantas (briófitas, pteridófitas, gimnospermas, angiospermas) | B12.3 |
| BK18 | Anatomia vegetal | Tecidos vegetais e órgãos (meristemas, epiderme, folha, caule e raiz) | B12.3 |
| BK19 | Botânica | Flor, fruto e semente | B12.3 |
| BK20 | Fisiologia vegetal | Nutrição, transpiração, seiva, hormônios e movimentos vegetais | B12.4 |
| BK21 | Zoologia | Anelídeos e artrópodes | B12.5 |
| BK21a | Embriologia | Embriologia dos animais | B08.7 |
| BK21b | Zoologia | Poríferos e cnidários | B12.5 |
| BK21c | Zoologia | Platelmintos e nematódeos | B12.5 |
| BK21d | Zoologia | Moluscos e anelídeos | B12.5 |
| BK21e | Zoologia | Equinodermos | B12.5 |
| BK22 | Zoologia | Cordados e vertebrados (ágnatos, peixes, anfíbios, amniotas) | B12.6 |
| BK23 | Histologia animal | Tecidos epitelial, conjuntivo e muscular | B07.1 |
| BK24 | Fisiologia humana | Digestório e respiratório | B07.2, B07.3 |
| BK25 | Fisiologia humana | Sistema cardiovascular e imunitário | B07.4, B07.5, B08.6 |
| BK26 | Fisiologia humana | Sistema nervoso (neurônio, impulso, SNC e SNP) | B08.1, B08.2, B08.3 |
| BK26a | Fisiologia humana | Sistema urinário e formação da urina | B07.6 |
| BK26b | Fisiologia humana | Osmorregulação | B07.6 |
| BK27 | Fisiologia humana | Sistema endócrino | B08.4, B08.5 |
| BK28 | Fisiologia humana | Sistema genital, ciclo menstrual e métodos contraceptivos | B08.7 |
| BK29 | Parasitologia | Conceitos e viroses | B10.1, B10.5 |
| BK30 | Parasitologia | Bacterioses | B10.2 |
| BK31 | Parasitologia | Protozooses | B10.3 |
| BK32 | Parasitologia | Verminoses | B10.4 |
| BK33 | Genética | Conceitos básicos e probabilidade | B06.1, B06.3 |
| BK34 | Genética | Leis de Mendel e variações | B06.1, B06.2, B06.4 |
| BK35 | Genética | Alelos múltiplos e grupos sanguíneos | B06.4 |
| BK36 | Genética | Interações e ligações gênicas | B06.6 |
| BK37 | Genética | Herança relacionada ao sexo | B06.5 |
| BK38 | Genética | Mutações e Hardy-Weinberg | B11.3, B11.4 |
| BK39 | Biotecnologia | Células-tronco, clonagem e engenharia genética | B05.6 |
| BK40 | Evolução biológica | Lamarck, Darwin e teoria moderna | B11.2, B11.3 |
| BK41 | Evolução biológica | Evidências, adaptações e especiação | B11.1, B11.5 |
| BK42 | Ecologia | Níveis de organização, cadeias e pirâmides | B09.1, B09.2 |
| BK43 | Ecologia | Ciclos biogeoquímicos | B09.3 |
| BK44 | Ecologia | Sucessão ecológica e relações ecológicas | B09.4, B09.5 |
| BK45 | Ecologia | Dinâmica populacional e biomas | B09.5, B09.6 |
| BK45b | Ecologia | Biomas brasileiros: Cerrado, Caatinga, Pampas, Pantanal e Manguezal | B09.6 |
| BK46 | Ecologia | Alterações ambientais e desenvolvimento sustentável | B09.6 |

## Física (`fis`)

### Temas e subtemas (arquivos por tema)

| tema | nome | subtemas (id: título) | slides |
|---|---|---|---|
| F01 | Fundamentos e grandezas | F01.1: Grandezas, unidades do SI e conversões; F01.2: Notação científica, ordem de grandeza e algarismos significativos; F01.3: Vetores e análise dimensional; F01.4: Relatividade restrita; F01.5: Fóton, efeito fotoelétrico e modelo de Bohr; F01.6: Radioatividade, meia-vida e física nuclear | 60 |
| F02 | Cinemática | F02.1: Velocidade média e movimento uniforme; F02.2: Movimento uniformemente variado e Torricelli; F02.3: Gráficos s × t, v × t e a × t; F02.4: Queda livre e lançamento vertical; F02.5: Lançamento horizontal e oblíquo; F02.6: Movimento circular, correias e engrenagens; F02.7: Composição de movimentos e velocidade relativa | 69 |
| F03 | Dinâmica e forças | F03.1: Leis de Newton e diagrama de forças; F03.2: Peso, normal, tração, blocos e polias; F03.3: Atrito e plano inclinado; F03.4: Força elástica e lei de Hooke; F03.5: Força centrípeta e curvas; F03.6: Estática: equilíbrio, torque e alavancas | 60 |
| F04 | Trabalho, energia e potência | F04.1: Trabalho de uma força; F04.2: Energia cinética e energia potencial; F04.3: Conservação da energia mecânica; F04.4: Potência e rendimento; F04.5: Fontes de energia, usinas e impacto ambiental | 49 |
| F05 | Impulso e quantidade de movimento | F05.1: Impulso e teorema do impulso; F05.2: Conservação da quantidade de movimento; F05.3: Colisões e coeficiente de restituição; F05.4: Centro de massa | 37 |
| F06 | Gravitação e astronomia | F06.1: Leis de Kepler; F06.2: Gravitação universal e gravidade; F06.3: Satélites, órbitas e imponderabilidade; F06.4: Sistema Solar, Lua e buracos negros | 40 |
| F07 | Hidrostática | F07.1: Densidade e pressão; F07.2: Stevin, pressão atmosférica e vasos comunicantes; F07.3: Princípio de Pascal e prensa hidráulica; F07.4: Empuxo e flutuação; F07.5: Vazão, continuidade e Bernoulli | 48 |
| F08 | Termologia | F08.1: Temperatura e escalas termométricas; F08.2: Dilatação térmica; F08.3: Calor sensível, calor latente e mudanças de estado; F08.4: Trocas de calor e equilíbrio térmico; F08.5: Propagação do calor, efeito estufa e conforto térmico; F08.6: Gases e transformações gasosas; F08.7: Trabalho de um gás e 1ª lei da termodinâmica; F08.8: Máquinas térmicas, 2ª lei e ciclo de Carnot | 80 |
| F09 | Óptica | F09.1: Princípios da óptica, cor, sombra e câmara escura; F09.2: Reflexão e espelhos planos; F09.3: Espelhos esféricos; F09.4: Refração, lei de Snell e reflexão total; F09.5: Lentes e vergência; F09.6: Óptica da visão e defeitos visuais; F09.7: Instrumentos ópticos e dispersão da luz | 69 |
| F10 | Ondulatória e acústica | F10.1: Características das ondas e v = λ · f; F10.2: Espectro eletromagnético e radiações; F10.3: Reflexão, refração, difração e interferência; F10.4: Ressonância e polarização; F10.5: Som: altura, intensidade, timbre e nível sonoro; F10.6: Cordas, tubos sonoros e ondas estacionárias; F10.7: Efeito Doppler; F10.8: Movimento harmônico simples e pêndulo | 77 |
| F11 | Eletricidade e circuitos | F11.1: Carga elétrica e eletrização; F11.2: Lei de Coulomb e campo elétrico; F11.3: Potencial, energia e condutores; F11.4: Corrente, leis de Ohm e resistividade; F11.5: Associação de resistores; F11.6: Potência, kWh e conta de luz; F11.7: Geradores, receptores e Kirchhoff; F11.8: Medidores, fusíveis e choque; F11.9: Capacitores | 88 |
| F12 | Magnetismo e eletromagnetismo | F12.1: Ímãs, campo magnético e magnetismo terrestre; F12.2: Força magnética sobre carga e sobre fio; F12.3: Campo magnético de fio, espira e solenoide; F12.4: Indução eletromagnética: Faraday e Lenz; F12.5: Transformadores, geradores e motores elétricos | 50 |

### Tópicos da revisão geral

| id | capítulo | título | subs |
|---|---|---|---|
| FK01 | Cinemática | Introdução à cinemática, MU, MUV e gráficos | F02.1, F02.2, F02.3, F02.4 |
| FK02 | Cinemática | Movimento circular: grandezas angulares, período e frequência | F02.6 |
| FK02b | Cinemática | MCU, MCUV e transmissão de movimento circular | F02.6 |
| FK03 | Cinemática | Cinemática vetorial e composição de movimentos | F01.3, F02.7 |
| FK04 | Cinemática | Lançamento oblíquo no vácuo | F02.5 |
| FK05 | Dinâmica | Resolução de problemas de Dinâmica, molas, polias e plano inclinado | F03.2, F03.4, F03.3 |
| FK05b | Dinâmica | Mapa mental de Dinâmica, definições e leis de Newton | F03.1, F03.2 |
| FK06 | Dinâmica | Força de atrito, resistência dos fluidos e movimento circular | F03.3, F03.5 |
| FK07 | Trabalho e energia | Trabalho e potência | F04.1, F04.4 |
| FK08 | Trabalho e energia | Energia mecânica e conservação | F04.2, F04.3 |
| FK09 | Dinâmica impulsiva | Impulso, quantidade de movimento e colisões | F05.1, F05.2, F05.3 |
| FK09b | Dinâmica impulsiva | Colisão, energia e centro de massa | F05.4, F05.3 |
| FK10 | Estática | Estática: centro de massa, equilíbrio, torque e alavancas | F03.6, F05.4 |
| FK11 | Hidrostática | Densidade e pressão | F07.1 |
| FK11b | Hidrostática | Teorema de Stevin, Pascal, Arquimedes e hidrodinâmica | F07.2, F07.3, F07.4, F07.5 |
| FK12 | Termologia | Termometria, escalas e calor | F08.1 |
| FK13 | Termologia | Dilatação térmica | F08.2 |
| FK14 | Termologia | Calorimetria e sistemas termicamente isolados | F08.3, F08.4 |
| FK15 | Termologia | Mudanças de estado físico | F08.3 |
| FK15b | Termologia | Curvas de aquecimento, calor latente e diagrama de estados | F08.3 |
| FK15c | Termologia | Processos de transferência de calor | F08.5 |
| FK16 | Termologia | Gases ideais e transformações gasosas | F08.6, F08.5 |
| FK17 | Termologia | Termodinâmica: trabalho, energia interna e primeira lei | F08.7 |
| FK18 | Termologia | Segunda lei da termodinâmica e máquinas térmicas | F08.8 |
| FK19 | Óptica | Introdução à óptica geométrica e princípios | F09.1 |
| FK20 | Óptica | Reflexão da luz e espelhos planos | F09.2 |
| FK21 | Óptica | Espelhos esféricos: equações e sinais | F09.3 |
| FK21b | Óptica | Espelhos esféricos: elementos, raios notáveis e imagens | F09.3 |
| FK22 | Óptica | Refração da luz, Snell-Descartes e ângulo limite | F09.4, F09.7 |
| FK23 | Óptica | Lentes esféricas delgadas | F09.5 |
| FK24 | Óptica | Estudo analítico das lentes e vergência | F09.5 |
| FK25 | Óptica | Instrumentos ópticos e óptica da visão | F09.6, F09.7 |
| FK26 | Movimento harmônico simples | MHS: massa-mola, pêndulo e equações | F10.8 |
| FK27 | Ondulatória | Ondas: classificação e ondas periódicas | F10.1 |
| FK28 | Ondulatória | Fenômenos ondulatórios, interferência e ondas estacionárias | F10.3, F10.4, F10.6 |
| FK29 | Ondulatória | Acústica: som, fenômenos acústicos, Doppler e tubos | F10.5, F10.7, F10.6 |
| FK29b | Ondulatória | Nível sonoro e intensidade sonora | F10.5 |
| FK30 | Eletrostática | Carga elétrica, processos de eletrização e lei de Coulomb | F11.1, F11.2 |
| FK31 | Eletrostática | Campo elétrico, potencial e trabalho da força elétrica | F11.2, F11.3, F11.9 |
| FK32 | Eletrostática | Esfera condutora, campo uniforme e movimento de cargas | F11.3 |
| FK33 | Eletrodinâmica | Corrente elétrica, potência e energia | F11.4, F11.6 |
| FK34 | Eletrodinâmica | Resistores, leis de Ohm e associações | F11.4, F11.5 |
| FK35 | Eletrodinâmica | Geradores, receptores, Kirchhoff, medidores e capacitores | F11.7, F11.8, F11.9 |
| FK36 | Eletromagnetismo | Magnetismo, ímãs e campo magnético terrestre | F12.1 |
| FK37 | Eletromagnetismo | Campo magnético de correntes e força magnética | F12.3, F12.2 |
| FK38 | Eletromagnetismo | Indução eletromagnética e transformadores | F12.4, F12.5 |
| FK39 | Física moderna | Análise dimensional e teoria da relatividade | F01.4, F01.3 |
| FK40 | Física moderna | Corpo negro, quantização e modelos atômicos | F01.5 |
| FK41 | Gravitação | Leis de Kepler e lei da gravitação universal | F06.1, F06.2, F06.3 |
| FK42 | Gravitação | Campo gravitacional, energia potencial, velocidade de escape e eclipses | F06.2, F06.3, F06.4 |

## Química (`qui`)

### Temas e subtemas (arquivos por tema)

| tema | nome | subtemas (id: título) | slides |
|---|---|---|---|
| Q01 | Átomo e tabela periódica | Q01.1: Modelos e experimentos; Q01.1: Bohr, cores e modelo atual; Q01.2: Z, A, nêutrons e íons; Q01.3: Distribuição eletrônica; Q01.4: Localizar o elemento na tabela; Q01.5: Tendências das propriedades periódicas | 0 |
| Q06 | Gases | Q06.1: Transformações gasosas e equação geral; Q06.2: Clapeyron, volume molar e densidade; Q06.3: Misturas, pressão parcial e difusão | 0 |
| Q07 | Termoquímica | Q07.1: Entalpia, exotérmica e endotérmica; Q07.2: Lei de Hess e entalpia de formação; Q07.3: Energia de ligação e combustíveis | 0 |

### Temas e subtemas sem arquivo por tema

| tema | nome | subtemas (id: título) | origem |
|---|---|---|---|
| Q02 | Ligações e forças entre moléculas | Q02.1: Ligação iônica; Q02.2: Covalente: quantas ligações; Q02.3: Geometria pelas nuvens; Q02.4: Forças intermoleculares; Q02.5: Ligação metálica e ligas | resumos.json (sem arquivo por tema) |
| Q03 | Funções inorgânicas e nox | Q03.1: Ácido e base: três teorias; Q03.2: Sais: nome e fórmula; Q03.3: Tipos de reação inorgânica; Q03.4: Cálculo do nox; Q03.5: Substância, mistura e alotropia | resumos.json (sem arquivo por tema) |
| Q04 | Mol e estequiometria | Q04.1: Mol e massa molar; Q04.2: Fórmula mínima e molecular; Q04.3: Estequiometria direta; Q04.4: Reagente limitante; Q04.5: Lavoisier e Proust | resumos.json (sem arquivo por tema) |
| Q05 | Soluções e concentração | Q05.1: Concentração comum; Q05.2: Concentração em mol/L; Q05.3: Diluição; Q05.4: Título e porcentagem; Q05.5: Curva de solubilidade | resumos.json (sem arquivo por tema) |
| Q08 | Cinética, equilíbrio e pH | Q08.1: Fatores da velocidade; Q08.2: Catalisador e ativação; Q08.3: Expressão de Kc; Q08.4: Le Chatelier: concentração; Q08.5: Ka, Kb e força; Q08.6: pH e pOH; Q08.7: Solução-tampão | resumos.json (sem arquivo por tema) |
| Q09 | Pilhas, eletrólise e radioatividade | Q09.1: Pilha: ânodo e cátodo; Q09.2: Eletrólise ígnea e aquosa; Q09.3: Corrosão e metal de sacrifício; Q09.4: Alfa, beta e gama; Q09.5: Meia-vida | resumos.json (sem arquivo por tema) |
| Q10 | Propriedades coligativas | Q10.1: Contar partículas; Q10.2: Osmose e tonicidade | resumos.json (sem arquivo por tema) |
| Q11 | Orgânica: estrutura e isomeria | Q11.1: Classificação do carbono; Q11.2: Nome: prefixo, infixo, sufixo; Q11.3: Álcool, fenol e éter; Q11.4: Amina e amida; Q11.5: Cadeia, posição e função; Q11.6: Isomeria geométrica; Q11.7: Ebulição em orgânica | resumos.json (sem arquivo por tema) |
| Q12 | Orgânica: reações, polímeros e ambiente | Q12.1: Reação de adição; Q12.2: Oxidação de álcoois; Q12.3: Polímero de adição; Q12.4: Carboidratos; Q12.5: Efeito estufa | resumos.json (sem arquivo por tema) |

### Tópicos da revisão geral

| id | capítulo | título | subs |
|---|---|---|---|
| QK01 | Estados físicos e suas mudanças | Estados físicos, curvas de aquecimento, substância pura e mistura | Q03.5 |
| QK02 | Estados físicos e suas mudanças | Métodos de separação de misturas | Q03.5 |
| QK03 | O átomo | Evolução dos modelos atômicos (Dalton, Thomson, Rutherford) | Q01.1 |
| QK04 | O átomo | Modelo de Bohr, Sommerfeld e partículas fundamentais | Q01.1, Q01.2 |
| QK05 | O átomo | Número atômico, massa, íons e semelhanças atômicas | Q01.2 |
| QK06 | O átomo | Distribuição eletrônica, números quânticos e regra de Hund | Q01.3 |
| QK07 | Tabela periódica | Organização da tabela periódica e famílias | Q01.4 |
| QK08 | Tabela periódica | Propriedades periódicas | Q01.5 |
| QK09 | Ligações químicas | Ligações iônica, covalente e metálica; alotropia | Q02.1, Q02.2, Q02.5, Q03.5 |
| QK10 | Ligações químicas | Geometria molecular (VSEPR) e polaridade | Q02.3 |
| QK11 | Ligações químicas | Forças intermoleculares e propriedades físicas | Q02.4 |
| QK12 | Ligações químicas | Sabões e detergentes | Q12.2, Q02.4 |
| QK13 | Cálculo estequiométrico | Massas, mol e determinação de fórmulas | Q04.1, Q04.2 |
| QK14 | Cálculo estequiométrico | Leis ponderais e volumétrica; cálculo estequiométrico | Q04.5, Q04.3, Q04.4 |
| QK15 | Funções inorgânicas | Teoria de Arrhenius, ácidos e bases | Q03.1 |
| QK16 | Funções inorgânicas | Óxidos e sais | Q03.2 |
| QK17 | Reações inorgânicas | Tipos de reação, reatividade e dupla-troca | Q03.3 |
| QK18 | Soluções | Classificação de soluções, solubilidade e concentrações | Q05.5, Q05.1, Q05.2, Q05.4 |
| QK19 | Soluções | Diluição, mistura, titulação e propriedades coligativas | Q05.3, Q10.1, Q10.2 |
| QK20 | Termoquímica | Entalpia, reações exo e endotérmicas e fatores que alteram o ΔH | Q07.1 |
| QK21 | Termoquímica | Energia de ligação, lei de Hess e entalpia de formação | Q07.3, Q07.2 |
| QK22 | Gases | Variáveis de estado, transformações gasosas e Clapeyron | Q06.1, Q06.2 |
| QK23 | Gases | Misturas gasosas, densidade e lei de Graham | Q06.3, Q06.2 |
| QK24 | Cinética química | Velocidade das reações, colisões, energia de ativação, catalisador e lei da ação das massas | Q08.1, Q08.2 |
| QK25 | Equilíbrios químicos | Equilíbrio químico, constantes Kc e Kp e Le Chatelier | Q08.3, Q08.4 |
| QK26 | Equilíbrios químicos | Equilíbrio iônico: Ka, Kb e lei de Ostwald | Q08.5 |
| QK27 | Equilíbrios químicos | Autoionização da água, pH e pOH | Q08.6 |
| QK28 | Equilíbrios químicos | Hidrólise de sais | Q08.6 |
| QK29 | Equilíbrios químicos | Conceitos de ácido e base: Arrhenius, Brönsted-Lowry, Lewis | Q03.1 |
| QK30 | Equilíbrios químicos | Produto de solubilidade (Kps) | Q08.7 |
| QK31 | Oxirredução | Oxidação, redução e número de oxidação (Nox) | Q03.4 |
| QK32 | Oxirredução | Balanceamento por oxirredução | Q03.4 |
| QK33 | Eletroquímica | Pilhas e pilha de Daniell | Q09.1 |
| QK34 | Eletroquímica | Potencial, força eletromotriz, pilhas comuns e corrosão | Q09.1, Q09.3 |
| QK35 | Eletroquímica | Eletrólise e eletroquímica quantitativa | Q09.2 |
| QK36 | Radioatividade | Emissões radioativas e leis de Soddy | Q09.4 |
| QK37 | Radioatividade | Fissão, fusão, usinas e bomba atômica | Q09.5 |
| QK38 | Radioatividade | Meia-vida e datação por carbono-14 | Q09.5 |
| QK39 | Química orgânica | Introdução: vitalismo, carbono e classificação de carbonos e cadeias | Q11.1 |
| QK40 | Química orgânica | Nomenclatura substitutiva e hidrocarbonetos | Q11.2 |
| QK41 | Química orgânica | Funções orgânicas: grupos e nomenclatura | Q11.3, Q11.4 |
| QK42 | Química orgânica | Caráter ácido-básico de compostos orgânicos | Q11.7 |
| QK43 | Química orgânica | Recursos orgânicos: petróleo, gás natural, carvão e xisto | Q12.5 |
| QK44 | Química orgânica | Biocombustíveis e matriz energética | Q12.5 |
| QK45 | Isomeria | Isomeria plana (função, cadeia, posição, metameria, tautomeria) | Q11.5 |
| QK46 | Isomeria | Isomeria espacial: geométrica e óptica | Q11.6 |
| QK47 | Reações orgânicas | Cisão de ligações e substituição em alcanos | Q12.1 |
| QK48 | Reações orgânicas | Substituição em aromáticos e grupos dirigentes | Q12.1 |
| QK49 | Reações orgânicas | Substituição em haletos, álcoois e grupos acila (esterificação e hidrólise) | Q12.2, Q12.1 |
| QK50 | Reações orgânicas | Reações de adição | Q12.1 |
| QK51 | Reações orgânicas | Oxidação de compostos orgânicos | Q12.2 |
| QK52 | Reações orgânicas | Reações de eliminação | Q12.1 |
| QK53 | Reações orgânicas | Reações de redução | Q12.2 |
| QK54 | Polímeros | Classificação e polímeros de adição | Q12.3 |
| QK55 | Polímeros | Polímeros de condensação | Q12.3 |
| QK56 | Bioquímica | Aminoácidos, ligação peptídica e proteínas | Q12.4 |
| QK57 | Bioquímica | Lipídeos: ácidos graxos, triacilgliceróis e fosfolipídeos | Q12.4 |
| QK58 | Bioquímica | Carboidratos: monossacarídeos, dissacarídeos e polissacarídeos | Q12.4 |

## Geografia (`geo`)

### Temas e subtemas (arquivos por tema)

| tema | nome | subtemas (id: título) | slides |
|---|---|---|---|
| G03 | Clima e atmosfera | G03.1: Tempo, clima, elementos e fatores; G03.2: Pressão, ventos, massas e frentes; G03.3: Climas do Brasil e climogramas; G03.4: Climas do mundo; G03.5: El Niño, La Niña, ilha de calor e inversão; G03.6: Aquecimento global e mudanças climáticas | 60 |
| G04 | Hidrografia | G04.1: Ciclo da água, bacia e regime dos rios; G04.2: Bacias brasileiras, hidrelétricas e hidrovias; G04.3: Águas subterrâneas e aquíferos; G04.4: Crise hídrica, uso da água e transposição; G04.5: Oceanos, mares e recursos marinhos | 49 |
| G05 | Biomas e vegetação | G05.1: Biomas brasileiros; G05.2: Domínios morfoclimáticos de Ab'Sáber; G05.3: Biomas e formações vegetais do mundo; G05.4: Desmatamento, queimadas e perda de biodiversidade | 39 |
| G06 | População e demografia | G06.1: Conceitos, indicadores e teorias demográficas; G06.2: Transição demográfica e pirâmides etárias; G06.3: Migrações internacionais e refugiados; G06.4: Migrações internas no Brasil; G06.5: População brasileira: composição, envelhecimento e trabalho; G06.6: IDH, desigualdade e indicadores sociais | 59 |
| G07 | Urbanização | G07.1: Urbanização mundial e metropolização; G07.2: Rede urbana, hierarquia e cidades globais; G07.3: Urbanização brasileira e êxodo rural; G07.4: Problemas urbanos: segregação, favelização e gentrificação; G07.5: Mobilidade e ambiente urbano | 50 |
| G08 | Agropecuária e espaço agrário | G08.1: Estrutura fundiária e reforma agrária; G08.2: Conflitos no campo e grilagem; G08.3: Revolução Verde, agronegócio e fronteira agrícola; G08.4: Agricultura familiar e agroecologia; G08.5: Impactos ambientais da agropecuária; G08.6: Sistemas agrícolas e agricultura no mundo | 59 |
| G09 | Indústria e energia | G09.1: Revoluções industriais; G09.2: Fordismo, toyotismo e acumulação flexível; G09.3: Industrialização brasileira e desconcentração; G09.4: Fontes de energia e matriz energética; G09.5: Energia no Brasil; G09.6: Transportes e logística | 60 |
| G10 | Geopolítica e globalização | G10.1: Globalização, redes e fluxos; G10.2: DIT, desenvolvimento e comércio; G10.3: Blocos e organismos internacionais; G10.4: Ordem mundial: da Guerra Fria ao multipolar; G10.5: Conflitos atuais; G10.6: Nacionalismos, separatismos e terrorismo; G10.7: Recursos estratégicos; G10.8: Grandes potências e regiões do mundo | 80 |
| G11 | Brasil e regiões brasileiras | G11.1: Formação territorial e fronteiras; G11.2: Regionalizações: IBGE, Geiger e Milton Santos; G11.3: Amazônia; G11.4: Nordeste e semiárido; G11.5: Centro-Oeste, Sudeste e Sul; G11.6: Terras indígenas, quilombolas e povos tradicionais; G11.7: Políticas regionais e planejamento | 70 |
| G12 | Meio ambiente e sustentabilidade | G12.1: Conferências e acordos ambientais; G12.2: Desenvolvimento sustentável e unidades de conservação; G12.3: Poluição do ar, da água e do solo; G12.4: Resíduos sólidos, reciclagem e saneamento; G12.5: Desertificação e degradação ambiental; G12.6: Justiça ambiental e movimentos socioambientais | 60 |

### Tópicos da revisão geral

| id | capítulo | título | subs |
|---|---|---|---|
| GK01 | A construção do pensamento geográfico | Origens da Geografia: clássica, determinismo, possibilismo e Geografia crítica | — |
| GK02 | A construção do pensamento geográfico | Linguagem geográfica, espaço vivido e cidadania | — |
| GK03 | Cartografia e geotecnologias | Escala, coordenadas, meridianos e paralelos | — |
| GK04 | Cartografia e geotecnologias | Projeções cartográficas, tipos de mapa e elementos do mapa | — |
| GK05 | Cartografia e geotecnologias | Tecnologias na representação espacial | — |
| GK06 | A dinâmica da natureza e o meio ambiente | Estrutura da Terra, placas tectônicas e forças endógenas | — |
| GK07 | A dinâmica da natureza e o meio ambiente | Forças exógenas, ciclo das rochas e riscos naturais | — |
| GK08 | A dinâmica da natureza e o meio ambiente | Relevo do Brasil (classificação de Jurandyr Ross) | — |
| GK09 | A dinâmica da natureza e o meio ambiente | Clima: elementos, fatores e tipos de chuva | G03.1, G03.2 |
| GK10 | A dinâmica da natureza e o meio ambiente | Zonas climáticas, climas e vegetação | G03.4, G05.3 |
| GK11 | A dinâmica da natureza e o meio ambiente | Mudanças climáticas, efeito estufa e ilhas de calor | G03.6, G03.5 |
| GK12 | A dinâmica da natureza e o meio ambiente | Hidrografia, bacias hidrográficas e aquíferos | G04.1, G04.2, G04.3 |
| GK13 | A dinâmica da natureza e o meio ambiente | Questões ambientais contemporâneas: escasseamento, crise hídrica e poluição | G12.3, G04.4, G12.5 |
| GK14 | A dinâmica da natureza e o meio ambiente | Biomas brasileiros, desmatamento e políticas ambientais | G05.1, G05.4, G12.1, G12.2 |
| GK15 | O espaço da produção e do consumo | Revoluções industriais e modelos industriais | G09.1, G09.2 |
| GK16 | O espaço da produção e do consumo | Urbanização, metropolização e segregação socioespacial | G07.1 |
| GK17 | O espaço da produção e do consumo | Estrutura fundiária, relações de trabalho e reforma agrária | G08.1 |
| GK18 | O espaço da produção e do consumo | Modelos agrícolas: intensivo, extensivo, familiar, agroecologia e agronegócio | G08.4, G08.3, G08.6 |
| GK19 | Sistemas econômicos e organização do espaço | Capitalismo, territorialidades e divisão territorial do trabalho | G10.2 |
| GK20 | Sistemas econômicos e organização do espaço | Serviços, globalização, financeirização e nova divisão internacional do trabalho | G10.1, G10.2 |
| GK21 | Sistemas econômicos e organização do espaço | Trabalho, neoliberalismo, informalidade e gig economy | G10.1 |
| GK22 | Território, população, cultura e poder | Conceitos fundamentais da Geografia: espaço, território, paisagem, lugar e região | — |
| GK23 | Território, população, cultura e poder | Dinâmicas populacionais: crescimento, estrutura etária e políticas demográficas | G06.1, G06.5 |
| GK24 | Território, população, cultura e poder | Migrações, refugiados, políticas anti-imigratórias e xenofobia | G06.3 |
| GK25 | Território, população, cultura e poder | Transição demográfica e transformações populacionais | G06.2 |
| GK26 | Território, população, cultura e poder | Cultura, identidades e territórios de povos tradicionais | G11.6 |
| GK27 | Território, população, cultura e poder | Direito à cidade, macrocefalia urbana, habitação e mobilidade | G07.4, G07.5, G07.2 |
| GK28 | O espaço brasileiro em perspectiva | Formação histórica do território brasileiro | G11.1 |
| GK29 | O espaço brasileiro em perspectiva | Regionalizações do Brasil, desigualdades regionais e políticas de desenvolvimento | G11.2, G11.7 |
| GK30 | O espaço brasileiro em perspectiva | Industrialização, urbanização, desindustrialização e desconcentração no Brasil | G09.3, G07.3 |
| GK31 | O espaço brasileiro em perspectiva | Agropecuária, mineração e extrativismo no Brasil | G08.3, G08.4 |
| GK32 | O espaço brasileiro em perspectiva | Questões ambientais no Brasil: desmatamento e crises hídricas | G05.4, G04.4 |
| GK33 | O espaço brasileiro em perspectiva | Políticas ambientais e populações tradicionais no Brasil | G12.2, G11.6 |
| GK34 | A ordem mundial e suas transformações | Colonialismo, imperialismo e guerras mundiais | G10.4 |
| GK35 | A ordem mundial e suas transformações | Guerra Fria, nova ordem mundial e multipolaridade | G10.4, G10.3 |
| GK36 | A ordem mundial e suas transformações | Ascensão da China e a nova ordem global | G10.8 |
| GK37 | A ordem mundial e suas transformações | Conflitos contemporâneos: disputas territoriais, étnicas e religiosas | G10.5, G10.6 |
| GK38 | A ordem mundial e suas transformações | Terrorismo, guerra ao terror, intervenções e refugiados | G10.6 |
| GK39 | A ordem mundial e suas transformações | Geopolítica da energia e dos recursos naturais | G10.7 |
| GK40 | A ordem mundial e suas transformações | Geopolítica ambiental e climática e justiça climática | G12.1, G12.6 |
| GK41 | Redes, fluxos e tecnologias da informação | Funções urbanas predominantes | G07.2 |
| GK42 | Redes, fluxos e tecnologias da informação | Redes urbanas, hierarquia, conurbação, metropolização, megacidades e cidades globais | G07.2, G07.1 |
| GK43 | Redes, fluxos e tecnologias da informação | Desconcentração urbana e cidades médias | G07.1, G07.2 |
| GK44 | Redes, fluxos e tecnologias da informação | Transportes e infraestruturas: modais | G09.6 |
| GK45 | Redes, fluxos e tecnologias da informação | Tecnologia, ciberespaço, exclusão digital, plataformização e algoritmização | G10.1 |

## História (`his`)

### Temas e subtemas (arquivos por tema)

| tema | nome | subtemas (id: título) | slides |
|---|---|---|---|
| H01 | Antiguidade | H01.1: História, fontes e tempo histórico; H01.2: Pré-História e revolução neolítica; H01.3: Egito e Mesopotâmia; H01.4: Hebreus, fenícios e persas; H01.5: Grécia: pólis, Atenas, Esparta e democracia; H01.6: Cultura grega e helenismo; H01.7: Roma: monarquia e república; H01.8: Império Romano, cristianismo e crise | 80 |
| H02 | Idade Média | H02.1: Reinos germânicos e feudalismo; H02.2: Igreja e cultura medieval; H02.3: Império Bizantino e mundo islâmico; H02.4: Reinos e impérios africanos; H02.5: Cruzadas, cidades e crise do séc. XIV; H02.6: Renascimento e humanismo; H02.7: Reformas protestantes e Contrarreforma; H02.8: Estados nacionais, absolutismo e mercantilismo; H02.9: Expansão marítima europeia | 90 |
| H03 | Brasil Colonial | H03.1: Povos indígenas e o contato; H03.2: Pré-colombianos e conquista; H03.3: América espanhola e inglesa; H03.4: Capitanias, governo-geral e câmaras; H03.5: Açúcar e escravidão africana; H03.6: Resistência e quilombos; H03.7: União Ibérica, holandeses e fronteiras; H03.8: Ouro, fisco e sociedade mineira; H03.9: Revoltas nativistas e inconfidências | 90 |
| H04 | Independência e Império | H04.1: Período joanino (1808–1821); H04.2: Independência do Brasil (1820–1825); H04.3: Primeiro Reinado (1822–1831); H04.4: Período Regencial (1831–1840); H04.5: Segundo Reinado: política e café; H04.6: Imigração e trabalho livre; H04.7: Guerra do Paraguai (1864–1870); H04.8: Abolição e pós-abolição; H04.9: Crise do Império e República | 90 |
| H05 | República Brasileira | H05.1: República da Espada e Constituição de 1891; H05.2: Coronelismo, oligarquias e café com leite; H05.3: Conflitos sociais na Primeira República; H05.4: Tenentismo, Semana de 1922 e crise dos anos 1920; H05.5: Revolução de 1930 e governo constitucional de Vargas; H05.6: Estado Novo e trabalhismo; H05.7: República de 1946: de Dutra a Jango | 70 |
| H06 | Revoluções | H06.1: Revoluções Inglesas do século XVII; H06.2: Iluminismo e despotismo esclarecido; H06.3: Independência dos Estados Unidos; H06.4: Revolução Francesa; H06.5: Era Napoleônica e Congresso de Viena; H06.6: Revolução Industrial e mundo do trabalho; H06.7: Independências da América espanhola e do Haiti; H06.8: Liberalismo, socialismo e movimento operário; H06.9: Nacionalismos, unificações e revoluções de 1848; H06.10: Estados Unidos no século XIX | 100 |
| H07 | Guerras Mundiais | H07.1: Imperialismo na África e na Ásia; H07.2: Primeira Guerra Mundial; H07.3: Revolução Russa e stalinismo; H07.4: Crise de 1929; H07.5: Fascismo e nazismo; H07.6: Segunda Guerra Mundial; H07.7: Holocausto e genocídios | 69 |

### Tópicos da revisão geral

| id | capítulo | título | subs |
|---|---|---|---|
| HK01 | História e Pré-História | A ciência histórica e a periodização | H01.1 |
| HK02 | História e Pré-História | Pré-História e origens humanas: Paleolítico e Neolítico | H01.2 |
| HK03 | Povos da Antiguidade | Povos do Oriente Médio e do Norte da África | H01.3, H01.4 |
| HK04 | Povos da Antiguidade | Grécia antiga: períodos, pólis, Atenas e Esparta | H01.5, H01.6 |
| HK05 | Povos da Antiguidade | Roma antiga: Monarquia, República e Império | H01.7, H01.8 |
| HK06 | Povos da Antiguidade | Crise de Roma, cristianismo e queda do Império do Ocidente | H01.8 |
| HK07 | Outras Idades Médias | O mundo islâmico medieval | H02.3 |
| HK08 | Outras Idades Médias | Império Bizantino (Império Romano do Oriente) | H02.3 |
| HK09 | Idade Média na Europa Ocidental | Alta Idade Média: Império Franco, merovíngios e carolíngios | H02.1 |
| HK10 | Idade Média na Europa Ocidental | Feudalismo: características e apogeu (séculos IX–XI) | H02.1, H02.2 |
| HK11 | Idade Média na Europa Ocidental | Baixa Idade Média (séculos XI–XIII): Cruzadas e renascimentos comercial e urbano | H02.5 |
| HK12 | Idade Média na Europa Ocidental | Crise do mundo medieval (séculos XIV–XV): peste e guerras | H02.5 |
| HK13 | Idade Moderna | Passagem da Idade Média à Época Moderna e Renascimento | H02.6 |
| HK14 | Religião e monarquia na Época Moderna | Reforma Protestante e Contrarreforma | H02.7 |
| HK15 | Religião e monarquia na Época Moderna | Absolutismo monárquico e monarquias francesa e inglesa | H02.8, H06.1 |
| HK16 | Formação dos impérios ibéricos | Reconquista, Revolução de Avis e formação dos reinos ibéricos | H02.8 |
| HK17 | Formação dos impérios ibéricos | Mercantilismo e expansão marítima | H02.8, H02.9 |
| HK18 | Colonização da América espanhola | Primeiras navegações e povos nativos da América | H02.9, H03.2 |
| HK19 | Colonização da América espanhola | Conquista e estabelecimento das colônias espanholas | H03.2, H03.3 |
| HK20 | Colonização da América portuguesa | Início da colonização, capitanias hereditárias, câmaras e governo-geral | H03.1, H03.4, H03.5 |
| HK21 | Colonização da América portuguesa | União Ibérica e Brasil holandês | H03.7 |
| HK22 | Colonização da América portuguesa | Restauração portuguesa, crise do açúcar, interiorização e bandeiras | H03.7, H03.6 |
| HK23 | Colonização da América portuguesa | Economia e sociedade mineradora e revoltas nativistas | H03.8, H03.9 |
| HK24 | Emancipação da América | Reformas pombalinas e esgotamento da economia colonial | H03.8, H06.2 |
| HK25 | Emancipação da América | Revoltas emancipacionistas: Inconfidência Mineira e Conjuração Baiana | H03.9 |
| HK26 | Emancipação da América | Independências na América espanhola | H06.7 |
| HK27 | Emancipação da América | Independência da América portuguesa: Governo Joanino e Dia do Fico | H04.1, H04.2 |
| HK28 | Século XVIII: Revolução Industrial e Iluminismo | Revolução Industrial | H06.6 |
| HK29 | Século XVIII: Revolução Industrial e Iluminismo | Iluminismo e despotismo esclarecido | H06.2 |
| HK30 | Revoluções Atlânticas | Independência das Treze Colônias | H06.3 |
| HK31 | Revoluções Atlânticas | Revolução Haitiana | H06.7 |
| HK32 | Revoluções Atlânticas | Revolução Francesa: Antigo Regime, Constituinte, Convenção e Diretório | H06.4 |
| HK33 | Revoluções Atlânticas | Era napoleônica e Congresso de Viena | H06.5 |
| HK34 | Estados Unidos no século XIX | Expansão para o Oeste, Guerra de Secessão e imperialismo estadunidense | H06.10 |
| HK35 | Brasil Imperial | Primeiro Reinado: Constituição de 1824 e crise do governo de D. Pedro I | H04.3 |
| HK36 | Brasil Imperial | Período Regencial e Golpe da Maioridade | H04.4 |
| HK37 | Brasil Imperial | Segundo Reinado: política, economia, Guerra do Paraguai, abolição e crise | H04.5, H04.7, H04.8, H04.9 |
| HK38 | O longo século XIX | O longo século XIX: ideias, reorganização da Europa e Segunda Revolução Industrial | H06.8, H06.9 |
| HK39 | O longo século XIX | Imperialismo na África e na Ásia | H07.1 |
| HK40 | Primeira República (1889–1930) | República da Espada e República Oligárquica | H05.1, H05.2, H05.3, H05.4 |
| HK41 | Primeira Guerra Mundial (1914–1918) | Primeira Guerra Mundial: causas | H07.2 |
| HK42 | Primeira Guerra Mundial (1914–1918) | Primeira Guerra Mundial: a guerra e suas consequências | H07.2 |
| HK43 | Revolução Russa e União Soviética | Rússia antes da Revolução e Revolução Russa de 1917 | H07.3 |
| HK44 | Revolução Russa e União Soviética | Stalinismo e União Soviética até a Segunda Guerra | H07.3 |
| HK45 | Era Vargas | Governo Provisório e Governo Constitucional (1930–1937) | H05.5 |
| HK46 | Era Vargas | Ditadura do Estado Novo (1937–1945) | H05.6 |
| HK47 | Entreguerras | Entreguerras: Versalhes, crise de 1929, fascismo e Eixo | H07.4, H07.5 |
| HK48 | Segunda Guerra Mundial (1939–1945) | Ascensão do nazifascismo | H07.5, H07.7 |
| HK49 | Segunda Guerra Mundial (1939–1945) | Segunda Guerra Mundial: fases, fim e ordem do pós-guerra | H07.6 |
| HK50 | Guerra Fria | Guerra Fria: tensões, guerras e fim | — |
| HK51 | Populismo na América Latina | Populismo na América Latina: Argentina e México | — |
| HK52 | República Democrática (1946–1964) | Dutra e o segundo governo Vargas | H05.7 |
| HK53 | República Democrática (1946–1964) | JK, Jânio Quadros, João Goulart e o golpe de 1964 | H05.7 |
| HK54 | Ditaduras na América Latina | Ditaduras na América Latina e ditadura militar no Brasil | — |
| HK55 | Nova República (1985–) | Nova República: Sarney, Collor, Itamar e FHC | — |
| HK56 | Nova República (1985–) | Governos Lula, Dilma, Temer e Bolsonaro | — |
| HK57 | América Latina no século XXI | América Latina no século XXI: neoliberalismo e mudanças sociopolíticas | — |

## Filosofia e Sociologia (`fs`)

### Temas e subtemas (arquivos por tema)

| tema | nome | subtemas (id: título) | slides |
|---|---|---|---|
| L01 | Pré-socráticos | L01.1: Do mito ao lógos; L01.2: Escola jônica e a arché; L01.3: Heráclito e Parmênides: devir e ser; L01.4: Pitagóricos, pluralistas e atomistas; L01.5: Sofistas; L01.6: O que é filosofia e suas áreas | 60 |
| L02 | Sócrates, Platão e Aristóteles | L02.1: Sócrates: ironia e maiêutica; L02.2: Platão: teoria das ideias e caverna; L02.3: Platão: a cidade justa; L02.4: Aristóteles: causas, forma e potência; L02.5: Aristóteles: política e animal político; L02.6: Helenismo: epicuristas, estoicos e céticos; L02.7: Filosofia medieval: Agostinho e Tomás | 70 |
| L03 | Ética | L03.1: Ética e moral; L03.2: Ética das virtudes de Aristóteles; L03.3: Kant: dever e imperativo categórico; L03.4: Utilitarismo; L03.5: Bioética e ética aplicada | 49 |
| L04 | Lógica | L04.1: Proposições, argumentos e validade; L04.2: Dedução, indução e silogismo; L04.3: Falácias; L04.4: Conectivos lógicos e tabela-verdade | 38 |
| L05 | Filosofia política | L05.1: Maquiavel; L05.2: Hobbes e o contrato social; L05.3: Locke: direitos naturais e liberalismo; L05.4: Rousseau: vontade geral; L05.5: Montesquieu e a separação dos poderes; L05.6: Hannah Arendt e o totalitarismo; L05.7: Democracia, justiça e direitos humanos | 68 |
| L06 | Racionalismo e empirismo | L06.1: Revolução científica: Bacon e Galileu; L06.2: Descartes e a dúvida metódica; L06.3: Empirismo: Locke, Berkeley e Hume; L06.4: Kant: os limites da razão; L06.5: Filosofia da ciência: Popper, Kuhn e pragmatismo; L06.6: Filosofia analítica e virada linguística | 60 |
| L07 | Iluminismo | L07.1: Razão, progresso e autonomia; L07.2: Kant: o que é esclarecimento; L07.3: Voltaire, enciclopedistas e tolerância; L07.4: Escola de Frankfurt e razão instrumental | 40 |
| L08 | Existencialismo | L08.1: Kierkegaard e as origens do existencialismo; L08.2: Sartre: liberdade, má-fé e responsabilidade; L08.3: Simone de Beauvoir; L08.4: Camus e o absurdo; L08.5: Heidegger e a fenomenologia; L08.6: Nietzsche: niilismo e crítica da moral | 58 |
| S01 | Cultura e sociedade | S01.1: Cultura, etnocentrismo e relativismo; S01.2: Alteridade, diversidade e identidade; S01.3: Matrizes indígenas e africanas; S01.4: Religião e sociedade; S01.5: Patrimônio e expressões culturais; S01.6: Fato social e ação social | 55 |
| S02 | Socialização | S02.1: Socialização primária e secundária; S02.2: Instituições: família, escola e religião; S02.3: Papéis, identidade e controle social; S02.4: Juventude, educação e escola | 37 |
| S03 | Trabalho e capitalismo | S03.1: Marx: classes, mais-valia e alienação; S03.2: Weber: ética protestante e burocracia; S03.3: Durkheim: divisão do trabalho social; S03.4: Taylorismo, fordismo e toyotismo; S03.5: Precarização, uberização e informalidade; S03.6: Trabalho no Brasil: escravidão, CLT e desemprego | 60 |
| S04 | Desigualdade social | S04.1: Estratificação: classe, casta e estamento; S04.2: Desigualdade de renda e pobreza no Brasil; S04.3: Racismo e relações étnico-raciais; S04.4: Gênero, feminismo e violência contra a mulher; S04.5: Mobilidade social e meritocracia; S04.6: Minorias: LGBTQIA+, pessoas com deficiência e outras | 60 |
| S05 | Poder e Estado | S05.1: Poder, dominação e legitimidade; S05.2: Estado moderno e formas de governo; S05.3: Cidadania e direitos no Brasil; S05.4: Foucault: poder disciplinar e biopoder; S05.5: Violência, segurança pública e prisões; S05.6: Ideologia e hegemonia | 57 |
| S06 | Movimentos sociais | S06.1: Conceito e tipos de movimento social; S06.2: Movimento operário e sindicalismo; S06.3: Movimentos do campo e luta pela terra; S06.4: Movimento negro, feminista e LGBTQIA+; S06.5: Movimentos indígenas e socioambientais; S06.6: Novos movimentos e redes digitais | 56 |
| S07 | Globalização | S07.1: Globalização e sociedade em rede; S07.2: Modernidade líquida e sociedade de risco; S07.3: Migrações e xenofobia; S07.4: Sociedade de consumo; S07.5: Tecnologia, big techs e capitalismo de plataforma | 49 |
| S08 | Mídia e indústria cultural | S08.1: Indústria cultural: Adorno e Horkheimer; S08.2: Meios de comunicação, opinião pública e espetáculo; S08.3: Internet, redes sociais e desinformação; S08.4: Cultura de massa, popular e erudita; S08.5: Benjamin: arte e reprodutibilidade técnica | 48 |

### Tópicos da revisão geral

| id | capítulo | título | subs |
|---|---|---|---|
| FK01 | Introdução à Filosofia | Definição de filosofia: Platão (O banquete) e Aristóteles | L01.6 |
| FK02 | O nascimento da filosofia | Do mito à filosofia: contexto, mito e logos | L01.1 |
| FK03 | O nascimento da filosofia | Filósofos pré-socráticos e o arché | L01.2, L01.3, L01.4 |
| FK04 | O nascimento da filosofia | Democracia ateniense: contexto, instituições e limites | L01.5 |
| FK05 | O nascimento da filosofia | Os sofistas: retórica, relativismo e críticas | L01.5 |
| FK06 | Sócrates | Sócrates: método socrático, ideias e condenação | L02.1 |
| FK07 | Platão | Platão: contexto social, político e filosófico | L02.2 |
| FK08 | Platão | Teoria das ideias, alegoria da caverna e Demiurgo | L02.2 |
| FK09 | Platão | Pensamento político de Platão: A República, classes e justiça | L02.3 |
| FK10 | Aristóteles | Aristóteles: relação com Platão, quatro causas, hilemorfismo, ato e potência | L02.4 |
| FK11 | Aristóteles | Ética aristotélica: eudaimonia, virtude e justo meio | L03.2 |
| FK12 | Aristóteles | Política aristotélica: formas de governo, justiça e zoon politikon | L02.5 |
| FK13 | Filosofia helenística | Período helenístico e epicurismo | L02.6 |
| FK14 | Filosofia helenística | Estoicismo | L02.6 |
| FK15 | Filosofia helenística | Ceticismo, outras escolas helenísticas e legado | L02.6 |
| FK16 | Filosofia medieval | Patrística e Santo Agostinho | L02.7 |
| FK17 | Filosofia medieval | Escolástica e Tomás de Aquino | L02.7 |
| FK18 | Renascimento | Filosofia do Renascimento e Humanismo (Erasmo e Thomas More) | — |
| FK19 | Renascimento | Maquiavel e o realismo político | L05.1 |
| FK20 | Revolução Científica | Revolução Científica: Copérnico, Kepler e Galileu | L06.1 |
| FK21 | Filosofia moderna | Racionalismo e Descartes | L06.2 |
| FK22 | Filosofia moderna | Empirismo: Locke, Berkeley e Hume | L06.3 |
| FK23 | Filosofia moderna | Kant: criticismo, revolução copernicana e conhecimento | L06.4 |
| FK24 | Filosofia moderna | Quadro comparativo: racionalismo, empirismo e criticismo | L06.2, L06.3, L06.4 |
| FK25 | Ética e política moderna | Ética kantiana: deontologia e imperativo categórico | L03.3 |
| FK26 | Ética e política moderna | Utilitarismo: Bentham e Stuart Mill | L03.4 |
| FK27 | Ética e política moderna | Contratualismo: Hobbes, Locke e Rousseau | L05.2, L05.3, L05.4 |
| FK28 | Filosofia contemporânea (séc. XIX) | Hegel e Marx: idealismo e materialismo | S03.1 |
| FK29 | Filosofia contemporânea (séc. XIX) | Schopenhauer, Kierkegaard, Nietzsche e crítica à razão | L08.6, L08.1 |
| FK30 | Filosofia analítica | Filosofia da linguagem: Frege, Russell e Wittgenstein | L06.6 |
| FK31 | Filosofia da ciência | Popper: falsificabilidade e crítica à indução | L06.5 |
| FK32 | Filosofia da ciência | Kuhn: paradigmas e revoluções científicas, Popper x Kuhn | L06.5 |
| FK33 | Filosofia da ciência | Mapa mental: Popper e Kuhn (resumo) | L06.5 |
| FK34 | Tradição continental | Escola de Frankfurt: indústria cultural, razão instrumental e Benjamin | L07.4, S08.1, S08.5 |
| FK35 | Tradição continental | Existencialismo: Sartre, Heidegger e Camus | L08.2, L08.5, L08.4 |
| FK36 | Ética e política contemporânea | Rawls (liberalismo igualitário) e Nozick (libertarianismo) | L05.7 |
| FK37 | Ética e política contemporânea | Habermas, Hans Jonas e Peter Singer | L03.5, L05.7 |
| FK38 | Filosofia contemporânea | Inteligência artificial: Turing e Searle | — |
| SK01 | Sociologia: uma ciência da sociedade | Surgimento da Sociologia, fundadores e senso comum x conhecimento sociológico | S01.6 |
| SK02 | Sociologia: uma ciência da sociedade | Métodos e técnicas de pesquisa sociológica | — |
| SK03 | Sociologia: uma ciência da sociedade | Estrutura social: status, papel, grupo e interação social | S02.3 |
| SK04 | Sociologia: uma ciência da sociedade | Influências sobre a Sociologia: Comte, Darwin e Spencer (evolucionismo social) | S01.1 |
| SK05 | Sociologia da cultura | Cultura: conceito, cultura material e imaterial | S01.1, S01.5 |
| SK06 | Sociologia da cultura | Normas e valores culturais, coesão e controle social | S02.3 |
| SK07 | Sociologia da cultura | Patrimonialização da cultura | S01.5 |
| SK08 | Religião, Estado e sociedade | Religião, sagrado e profano, secularização e retorno das religiões | S01.4 |
| SK09 | Instituições sociais: família e escola | Instituições sociais e a família | S02.2, S02.1 |
| SK10 | Instituições sociais: família e escola | A escola como instituição social | S02.4, S02.2 |
| SK11 | Desigualdade, pobreza e conflito social | Estratificação social: casta, estamento e classe social | S04.1 |
| SK12 | Desigualdade, pobreza e conflito social | Teorias da desigualdade: Marx, Weber e Bourdieu | S04.1, S04.5 |
| SK13 | Desigualdade, pobreza e conflito social | Pobreza, desigualdade no Brasil e criminalidade | S04.2, S05.5 |
| SK14 | Desvio e controle social | Desvio e controle social: Becker, Foucault e Goffman | S05.4, S02.3, S05.5 |
| SK15 | Estado, democracia e participação política | Estado moderno, soberania e Estado de direito; tipos de Estado | S05.2 |
| SK16 | Estado, democracia e participação política | Modelos de democracia: direta, representativa e participativa | L05.7, S05.3 |
| SK17 | Estado, democracia e participação política | Divisão de poderes, Montesquieu e freios e contrapesos | L05.5 |
| SK18 | Estado, democracia e participação política | Desafios da democracia no Brasil: representatividade, corrupção, redes sociais e desigualdade | S05.3, S08.3 |
| SK19 | Poder e dominação | Poder, dominação e poder nas instituições | S05.1 |
| SK20 | Poder e dominação | Poder em Weber, Foucault e Bourdieu | S05.1, S05.4 |
| SK21 | Poder e dominação | Estudos contemporâneos sobre o poder: necropolítica e psicopolítica | S05.4 |
| SK22 | Positivismo de Comte | Positivismo: lei dos três estados, hierarquia das ciências e funcionalismo | S01.6 |
| SK23 | A sociologia de Émile Durkheim | Durkheim: método, fato social, anomia, suicídio e solidariedade | S01.6, S03.3 |
| SK24 | Max Weber | Weber: sociologia compreensiva, ação social e tipos ideais | S01.6, S03.2 |
| SK25 | Max Weber | Weber: dominação, estratificação, racionalização e ética protestante | S05.1, S03.2 |
| SK26 | Karl Marx | Marx: origens e materialismo histórico-dialético | S03.1 |
| SK27 | Karl Marx | Marx: valor-trabalho, mais-valia, alienação, ideologia, revolução e religião | S03.1, S05.6 |
| SK28 | Karl Marx | Apropriações da obra de Marx no século XX | S05.6 |
| SK29 | Teorias clássicas | Quadro-resumo: Durkheim, Weber e Marx | S01.6, S03.1, S03.2, S03.3 |
| SK30 | Antropologia e Etnologia | Antropologia, etnologia, evolucionismo, universalismo, Tylor e Morgan | S01.1 |
| SK31 | Antropologia e Etnologia | Boas, Malinowski, Mauss e Lévi-Strauss: críticas ao evolucionismo | S01.1, S01.2 |
| SK32 | Sociologia e Antropologia no Brasil | Sociologia acadêmica no Brasil | — |
| SK33 | Sociologia e Antropologia no Brasil | Intérpretes do Brasil: Gilberto Freyre e Darcy Ribeiro | S01.3 |
| SK34 | Sociologia e Antropologia no Brasil | Sérgio Buarque de Holanda, DaMatta e Florestan Fernandes | S04.3 |
| SK35 | Sociologias do século XX | Sociologia urbana: Escola de Chicago e Henri Lefebvre | — |
| SK36 | Sociologias do século XX | Massificação, cultura de massa e Escola de Frankfurt | S08.4, S08.1 |
| SK37 | Sociologias do século XX | Norbert Elias e o processo civilizador | — |
| SK38 | Sociologias do século XX | A questão racial: W. E. B. Du Bois e Angela Davis | S04.3, S06.4 |
| SK39 | Movimentos sociais | Ação coletiva e comportamento de massa: Le Bon e Olson | S06.1 |
| SK40 | Movimentos sociais | Movimentos sociais: características e tipos | S06.1 |
| SK41 | Movimentos sociais | Teorias dos movimentos sociais: Tilly, Tarrow, Touraine e Castells | S06.6, S06.1 |
| SK42 | A pós-modernidade | Pós-modernidade: conceito e características | S07.2 |
| SK43 | A pós-modernidade | Bauman (modernidade líquida) e Lipovetsky (hipermodernidade) | S07.2, S07.4 |
| SK44 | A pós-modernidade | Pós-verdade e desinformação | S08.3 |
| SK45 | Desafios do século XXI | Globalização: características e mutações no século XXI | S07.1 |
| SK46 | Desafios do século XXI | Sociedade da informação, Revolução 4.0 e riscos contemporâneos | S07.5 |
| SK47 | Desafios do século XXI | Interpretações da globalização: Bauman e Ulrich Beck | S07.2 |
| SK48 | Desafios do século XXI | Mundo do trabalho, globalização e impactos culturais, econômicos e sociais | S03.5, S07.1 |

## Inglês (`ing`)

### Temas e subtemas (arquivos por tema)

| tema | nome | subtemas (id: título) | slides |
|---|---|---|---|
| I01 | Leitura e interpretação de textos | I01.1: Tema e ideia principal; I01.2: Objetivo do texto e público-alvo; I01.3: Informação explícita; I01.4: Inferência e sentido implícito; I01.5: Título, fonte e imagem como pista; I01.6: Opinião, tom e atitude do autor; I01.7: Anúncio, campanha e cartaz; I01.8: Tirinha, cartum, charge e meme; I01.9: Poema e letra de canção; I01.10: Notícia, opinião e divulgação científica; I01.11: Aspectos culturais e interdisciplinares | 86 |
| I02 | Vocabulário | I02.1: Sentido da palavra no contexto e sinônimos; I02.2: Falsos cognatos; I02.3: Phrasal verbs; I02.4: Expressões idiomáticas e provérbios; I02.5: Formação de palavras: prefixos e sufixos | 45 |
| I03 | Gramática | I03.1: Referência pronominal: it, they, this, which; I03.2: Conectivos e relações lógicas; I03.3: Modais e grau de certeza; I03.4: Comparativos, superlativos, intensificadores e quantificadores; I03.5: Voz passiva; I03.6: Discurso direto e indireto; I03.7: Condicionais e orações relativas; I03.8: Classes de palavras: substantivo, adjetivo, pronome e preposição; I03.9: Negação e palavras de sentido restritivo | 86 |
| I04 | Tempos verbais | I04.1: Presente simples e contínuo; I04.2: Passado simples, contínuo e used to; I04.3: Present perfect × simple past; I04.4: Past perfect e sequência de tempos; I04.5: Futuro: will, going to e presente; I04.6: Irregulares, gerúndio e infinitivo | 54 |

### Tópicos da revisão geral

| id | capítulo | título | subs |
|---|---|---|---|
| I01.1 | Leitura e interpretação de textos | Tema e ideia principal | I01.1 |
| I01.1b | Leitura e interpretação de textos | Passo a passo para resolver uma questão de leitura | I01.1, I01.3, I01.4 |
| I01.2 | Leitura e interpretação de textos | Objetivo do texto e público-alvo | I01.2 |
| I01.2b | Leitura e interpretação de textos | Como o inglês é cobrado no ENEM e nos vestibulares | I01.2, I01.1 |
| I01.3 | Leitura e interpretação de textos | Informação explícita | I01.3 |
| I01.3b | Vocabulário | Comandos de questão em inglês | I01.3, I01.4, I03.1 |
| I01.4 | Leitura e interpretação de textos | Inferência e sentido implícito | I01.4 |
| I01.5 | Leitura e interpretação de textos | Título, fonte e imagem como pista | I01.5 |
| I01.6 | Leitura e interpretação de textos | Opinião, tom e atitude do autor | I01.6 |
| I01.7 | Leitura e interpretação de textos | Anúncio, campanha e cartaz | I01.7 |
| I01.8 | Leitura e interpretação de textos | Tirinha, cartum, charge e meme | I01.8 |
| I01.9 | Leitura e interpretação de textos | Poema e letra de canção | I01.9 |
| I01.10 | Leitura e interpretação de textos | Notícia, opinião e divulgação científica | I01.10 |
| I01.11 | Leitura e interpretação de textos | Aspectos culturais e interdisciplinares | I01.11 |
| I01.11b | Leitura e interpretação de textos | Temas que mais aparecem nos textos da prova | I01.11, I01.6 |
| I01.11c | Leitura e interpretação de textos | Inglês como língua global e variedades do inglês | I01.11 |
| I02.1 | Vocabulário | Sentido da palavra no contexto e sinônimos | I02.1 |
| I02.1b | Vocabulário | Pares de palavras que a prova confunde | I02.1 |
| I02.2 | Vocabulário | Falsos cognatos | I02.2 |
| I02.2b | Vocabulário | Cognatos: as palavras que você já conhece | I02.2, I02.1 |
| I02.2c | Vocabulário | Falsos cognatos: lista ampliada | I02.2 |
| I02.3 | Vocabulário | Phrasal verbs | I02.3 |
| I02.4 | Vocabulário | Expressões idiomáticas e provérbios | I02.4 |
| I02.5 | Vocabulário | Formação de palavras: prefixos e sufixos | I02.5 |
| I02.5b | Vocabulário | Prefixos e sufixos: quadro ampliado | I02.5 |
| I03.1 | Gramática | Referência pronominal: it, they, this, which | I03.1 |
| I03.1b | Gramática | Pronomes: sujeito, objeto, possessivos e reflexivos | I03.1, I03.8 |
| I03.2 | Gramática | Conectivos e relações lógicas | I03.2 |
| I03.2b | Gramática | Conectivos: quadro ampliado | I03.2 |
| I03.3 | Gramática | Modais e grau de certeza | I03.3 |
| I03.4 | Gramática | Comparativos, superlativos, intensificadores e quantificadores | I03.4 |
| I03.5 | Gramática | Voz passiva | I03.5 |
| I03.6 | Gramática | Discurso direto e indireto | I03.6 |
| I03.7 | Gramática | Condicionais e orações relativas | I03.7 |
| I03.7b | Gramática | Orações relativas em detalhe | I03.7 |
| I03.7c | Gramática | Desejo e hipótese: wish, if only, would rather e had better | I03.7, I03.3 |
| I03.8 | Gramática | Classes de palavras: substantivo, adjetivo, pronome e preposição | I03.8 |
| I03.8b | Gramática | Substantivos: plural, contáveis e caso genitivo | I03.8, I03.4 |
| I03.8c | Gramática | Adjetivos e advérbios: posição, -ed × -ing e frequência | I03.8, I03.4 |
| I03.9 | Gramática | Negação e palavras de sentido restritivo | I03.9 |
| I03.9b | Gramática | Perguntas: palavras interrogativas, ordem e question tags | I03.9, I04.1 |
| I04.1 | Tempos verbais | Presente simples e contínuo | I04.1 |
| I04.1b | Tempos verbais | Quadro-resumo dos tempos verbais | I04.1, I04.2, I04.3, I04.4, I04.5 |
| I04.2 | Tempos verbais | Passado simples, contínuo e used to | I04.2 |
| I04.3 | Tempos verbais | Present perfect × simple past | I04.3 |
| I04.4 | Tempos verbais | Past perfect e sequência de tempos | I04.4 |
| I04.5 | Tempos verbais | Futuro: will, going to e presente | I04.5 |
| I04.6 | Tempos verbais | Irregulares, gerúndio e infinitivo | I04.6 |
| I04.6b | Tempos verbais | Verbos irregulares mais cobrados | I04.6 |
