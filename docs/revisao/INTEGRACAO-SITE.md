# Revisão geral — hand-off para o site

Para quem vai levar a "revisão geral" para o site. Tudo aqui está em `docs/revisao/`; nada fora dessa pasta foi alterado. O que mudou em cada tópico, e por quê, está em `docs/revisao/REVISAO-DA-REVISAO.md`.

## 1. Arquivos prontos

| Matéria | Arquivo | Tópicos | Prefixos de id | Estado |
|---|---|---|---|---|
| Português | `docs/revisao/por/geral.json` | 139 | PK (Gramática, 52), LK (Literatura, 38), IK (Interpretação, 27), RK (Produção de Texto, 22) | revisada completa, com 3 item(ns) "conferir" |
| Matemática | `docs/revisao/mat/geral.json` | 112 | ids de subtema (M01.1 … M17.2) e G01 … G32 (complementos) | revisada completa |
| Biologia | `docs/revisao/bio/geral.json` | 58 | BK01 … BK46, com sufixos de letra (BK09b, BK14a, BK21a–e, BK26a–b, BK45b) | revisada completa, com 2 item(ns) "conferir" |
| Física | `docs/revisao/fis/geral.json` | 50 | FK01 … FK42, com sufixos de letra (FK02b, FK05b, FK09b, FK11b, FK15b–c, FK21b, FK29b) | revisada completa |
| Química | `docs/revisao/qui/geral.json` | 58 | QK01 … QK58 | revisada completa, com 1 item(ns) "conferir" |
| Geografia | `docs/revisao/geo/geral.json` | 45 | GK01 … GK45 | revisada completa, com 2 item(ns) "conferir" |
| História | `docs/revisao/his/geral.json` | 57 | HK01 … HK57 | revisada completa, com 2 item(ns) "conferir" |
| Filosofia e Sociologia | `docs/revisao/fs/geral.json` | 86 | FK01 … FK38 (Filosofia) e SK01 … SK48 (Sociologia) | revisada completa, com 2 item(ns) "conferir" |
| Inglês | `docs/revisao/ing/geral.json` | 49 | ids de subtema (I01.1 … I04.6); os 18 novos levam o id do subtema com letra (I02.2b, I02.2c…) | revisada e ampliada (31 tópicos do site + 18 novos) |

Total: 654 tópicos em 9 arquivos. Nenhuma matéria ficou parcial.

"Revisada completa" = os 100% dos tópicos passaram pelas 3 lentes (fatos → compreensão do aluno → fatos de novo no que mudou) e pelo validador. "Conferir" = dado que só existe no livro e não pôde ser checado em fonte pública; a lista fica no campo `lacunas` do próprio arquivo, em linhas que contêm `conferir:`.

Segunda rodada (12/11/2026, decisões do dono):

- **Questões de prova**: nenhuma letra de gabarito ficou nos arquivos. Onde a questão pôde ser resolvida aqui (contas de Física e Química, a escala de Geografia), ficou como "Exemplo" com a resolução e o nome da prova indicado pelo livro. Onde dependia do texto ou da imagem da prova, a questão saiu, e o conteúdo que ela ensinava ficou como ponto comum ou exemplo próprio. A questão da Santa Casa 2020 (Português, IK10) saiu.
- **Fórmulas**: Física, Química e Biologia agora trazem as fórmulas em LaTeX entre cifrões, com toda fração empilhada (`\frac`), como Matemática. Não é preciso converter nada no site.
- **Inglês**: revisado e ampliado com 18 tópicos novos.

## 2. Esquema dos campos

Topo do arquivo: `materia`, `base`, `como_usar`, `topicos` (lista, na ordem de exibição) e `lacunas` (lista de textos; uso interno, não é conteúdo para o aluno). Inglês tem também `cobertura_temas`.

Cada tópico tem exatamente estes campos, nesta ordem:

| Campo | Tipo | O que é |
|---|---|---|
| `id` | texto | Identificador fixo do tópico (ver regras abaixo). |
| `capitulo` | texto | Capítulo ou frente; serve para agrupar. |
| `titulo` | texto | Título do tópico. |
| `subs` | lista de textos | Ids dos subtemas do site em que o tópico se encaixa (ex.: `F02.1`, `M05.2`, `I03.2`); o primeiro é o principal. É a ponte entre "revisar por subtema" e "revisar a matéria inteira": na tela do subtema, mostrar os tópicos da revisão geral que o citam em `subs`; no tópico da revisão geral, mostrar o nome dos subtemas com link. Preenchido em todas as matérias; fica vazio, de propósito, onde não há subtema correspondente no site (33 tópicos em Português, 9 em Geografia, 6 em História e 6 em Filosofia e Sociologia): esses tópicos aparecem só na revisão da matéria inteira. |
| `busca` | lista de textos | Termos que levam ao tópico na busca: nomes técnicos, sinônimos, nomes populares, siglas, perguntas ("quando usar crase") e grafias erradas comuns ("báskara", "in media res"). Comparar sem diferenciar maiúsculas e acentos. Uma grafia errada pode estar aqui de propósito e não deve ser mostrada ao aluno como texto. |
| `pontos` | lista de textos | O conteúdo: um ponto por item, do simples ao complexo. |
| `pegadinha` | texto | O que a banca costuma fazer e como evitar. |
| `imagem` | objeto | `tipo` (sempre `caixa_imagem`), `descricao` (o que a imagem deve mostrar) e, fora de Matemática e Inglês, `falta_imagem` (verdadeiro/falso) e `aviso` (texto "EM CONSTRUÇÃO…"). |

Fórmulas e texto:

- **Matemática, Física, Química e Biologia**: fórmulas em LaTeX entre cifrões (`$v_m=\frac{\Delta s}{\Delta t}$`), com fração sempre empilhada (`\frac`), vírgula decimal como `{,}`, multiplicação como `\cdot`, seno como `\text{sen}`, índices com chaves (`v_{0x}`, `K_{ps}`, `d_{líquido}`). Usam o mesmo renderizador de fórmulas do resto do site. Há três fórmulas com fração dentro de fração (relatividade, em `fis:FK39`); se o motor de animação não as aceitar, vale a saída estática descrita em `PEDIDOS-MOTOR.md`, item 3.
- **Química**: só a matemática foi para LaTeX. Fórmulas químicas e equações de reação continuam em texto simples (`H2O`, `CO2`, `2 H2 + O2 → 2 H2O`), como nos demais conteúdos; íons dentro de constantes de equilíbrio estão em LaTeX (`[H^+]`).
- **Unidades** ficam fora dos cifrões, em texto (`m/s`, `mol/L`, `N·m²/C²`): a barra de unidade não é fração de conta.
- **Inglês**: palavras e frases em inglês vêm no próprio texto do ponto, seguidas da tradução; dois pontos antigos usam `$\text{…}$` para montar estrutura de frase.
- Os demais arquivos são texto simples, com exemplos entre aspas simples. Não há HTML nem markdown em nenhum arquivo.

Diferenças entre matérias que o site precisa tratar:

- **Matemática e Inglês**: o campo `imagem` só tem `tipo` e `descricao` (não tem `falta_imagem` nem `aviso`). Tratar a ausência como "imagem ainda não feita".
- **Filosofia e Sociologia** estão no mesmo arquivo (`fs`); o prefixo do id separa as duas (FK × SK). Atenção: `FK` também é o prefixo de Física (`fis`) e `IK` é Interpretação em Português. O id só é único dentro do arquivo; para uma chave global, usar `<matéria>:<id>` (ex.: `fis:FK01`, `fs:FK01`).

## 3. Regras de ids

1. Os ids não mudaram e **não podem mudar**: são a chave para progresso, favoritos e revisão espaçada do aluno (princípio 7 do CLAUDE.md).
2. Nenhum tópico foi apagado nem renumerado; a ordem da lista é a ordem de exibição.
3. Os únicos tópicos criados nesta revisão são 18 de Inglês. Por decisão do dono, cada um leva o id do subtema em que se encaixa, com uma letra no fim (`I02.2b`, `I02.2c`), e fica logo depois do tópico desse subtema. Tópico novo, em qualquer matéria, segue essa regra: id do subtema + próxima letra livre, sem reaproveitar id.
4. Os ids não são únicos entre arquivos. Use a matéria junto.
5. `subs` aponta para ids de subtemas do site (os de `<matéria>/resumos.json` e, em Português e Biologia, os de `app-atual/<matéria>/dados.json`); o catálogo completo está em `SUBTEMAS.md` e `SUBTEMAS.json`; os que já estavam preenchidos não foram alterados. Em `fs`, um tópico de Filosofia pode apontar para subtema de Sociologia e vice-versa (ex.: Escola de Frankfurt).

## 4. Como conferir

```bash
python3 docs/revisao/valida_geral.py
```

O script confere JSON válido, ids únicos, campos na ordem do esquema, nenhum campo vazio, cifrões e chaves de LaTeX balanceados e ausência de fração com barra dentro de fórmula. Deve imprimir "ok" para todas as matérias.

## 5. Imagens que faltam

- Nenhum tópico da revisão geral tem imagem pronta (654 caixas). Enquanto a imagem não existir, o site deve mostrar a caixa "EM CONSTRUÇÃO" com o texto de `imagem.aviso` (ou, em Matemática e Inglês, de `imagem.descricao`).
- `docs/revisao/IMAGENS-PARA-GERAR.md` lista as imagens **por subtema** (ex.: `B01.1.png`, em `docs/imagens/<matéria>/`). Ela não cobre os tópicos da revisão geral, cujos ids são outros.
- A lista por tópico da revisão geral está no fim deste arquivo (seção 8), gerada a partir de `imagem.descricao`. A descrição diz o que o livro mostrava; por direito autoral, a imagem do livro não é copiada: é refeita no padrão do site (princípios 10 e 12). As descrições antigas não foram alteradas.
- Algumas descrições antigas ainda citam "questão resolvida" de uma prova. Essas questões saíram dos tópicos: ao produzir a imagem, não incluir a questão.
- Atenção em `qui:QK18`: a descrição cita uma curva de solubilidade do NaOH; se o original a mostra decrescente, não reproduzir assim (ver `lacunas`).

## 6. Decisões pendentes do dono

- **Português** — As descrições de imagem de alguns tópicos ainda citam 'questão resolvida' (o campo imagem foi preservado). Ao produzir essas imagens, não incluir a questão: ela saiu do tópico.
- **Matemática** — Matemática: o campo `imagem` não tem `falta_imagem` nem `aviso`, ao contrário das outras matérias. Não foi alterado (a regra é preservar o campo). Decidir se o site trata a ausência como "imagem ainda não feita" ou se o campo deve ser igualado.
- **Matemática** — Matemática: o campo `lacunas` foi criado (não existia) para registrar a revisão, como nas outras matérias.
- **Biologia** — BK12: decidir se o site mostra 32 ATP (contagem atual) ou também 36/38, usados por provas antigas.
- **Química** — QK18: se a imagem do livro mostrar a curva do NaOH como decrescente, não reproduzir; decidir qual gráfico entra.
- **Geografia** — GK43: manter o corte do livro para cidade média (100 mil a 1 milhão) ou adotar o do IBGE/Ipea (100 mil a 500 mil)?
- **História** — HK24: o livro erra o rei de Pombal (D. João V); o tópico agora traz D. José I. Se o site reproduzir alguma página do livro sobre o tema, o erro reaparece.
- **Filosofia e Sociologia** — SK41: manter a atribuição do livro (mobilização de recursos = Tilly) ou corrigir para a atribuição usual (McCarthy e Zald; Tilly = processo político)?
- **Filosofia e Sociologia** — Os tópicos de Filosofia e Sociologia são longos (vários pontos com mais de 400 caracteres). Foram mantidos para não perder conteúdo; se o site precisar de pontos mais curtos, o corte deve ser feito na tela, não no arquivo, ou em nova rodada de edição.

Decisões já tomadas pelo dono (12/11/2026):

- **Tópicos sem subtema** ficam só na revisão geral da matéria: não se criam subtemas nem temas novos para eles. Vale para a redação e para os demais tópicos de Português sem subtema existente, e para os de Geografia, História e Filosofia e Sociologia. O campo `subs` vazio é proposital; a lista está em `lacunas` de cada arquivo e na coluna `subs` de `SUBTEMAS.md`.

## 7. O que o site não deve fazer

- Não mostrar `lacunas` ao aluno: são notas de trabalho.
- Não mostrar ao aluno os termos de `busca` como se fossem conteúdo (há grafias erradas propositais).
- Não renumerar, fundir ou dividir tópicos sem migração do progresso do aluno.
- Não apresentar os "Exemplos" como questão de prova com gabarito: eles não trazem alternativas nem letra; são resoluções feitas na revisão (princípios 1 e 2).

## 8. Lista de imagens por tópico da revisão geral

### Português (`por`) — 139 imagens

- `PK01` As dez classes de palavras: variáveis e invariáveis: Esquema do livro: quadro com as 10 classes divididas em variáveis e invariáveis.
- `PK02` Substantivos: classificações semânticas e quanto à forma: Quadros do livro com as classificações semânticas e quanto à forma; ilustração freepik.
- `PK03` Substantivos: flexão de gênero, número e grau: Quadro 'Flexão de plural dos substantivos conforme a terminação' do livro.
- `PK04` Adjetivos: flexão de gênero, número e grau: Quadros do livro: gênero de adjetivos, tipos de comparativo e de superlativo.
- `PK05` Artigos: definidos, indefinidos, contração e funções: Exemplos do livro de contração de preposição + artigo.
- `PK06` Numerais: cardinal, ordinal, multiplicativo e fracionário: Quadro do livro: classificação e função dos numerais com exemplos.
- `PK07` Pronomes pessoais e pronomes de tratamento: Quadro do livro: pronomes retos e oblíquos; ilustrações de Shutterstock.
- `PK08` Pronomes possessivos, indefinidos e interrogativos: Quadros do livro de possessivos, indefinidos e interrogativos.
- `PK09` Pronomes demonstrativos e relativos: Quadro do livro: relação de proximidade/distanciamento dos demonstrativos; ilustração Shutterstock.
- `PK10` Verbos e advérbios (classificação, graus e palavras denotativas): Quadro do livro: classificação dos advérbios e locuções.
- `PK11` Preposições, conjunções e interjeições: Exemplo do livro: texto de redação nota 1000 do Enem 2019 com conjunções destacadas.
- `PK12` Estrutura das palavras: morfemas, radical, vogal temática e desinências: Quadros do livro: desinências número-pessoais, modo-temporais e verbonominais.
- `PK13` Formação de palavras: derivação, composição e outros processos: Quadros do livro com exemplos de cada processo de formação.
- `PK14` Frase, oração e período (simples e composto): Quadro do livro: frase, oração, período simples e composto.
- `PK15` Sujeito: simples, composto, oculto, indeterminado e oração sem sujeito: Esquemas do livro de análise de sujeito simples, composto, oculto e indeterminado.
- `PK16` Vocativo e predicado (nominal, verbal e verbo-nominal): Esquemas de análise sintática do livro (sujeito, predicativo, verbo de ligação).
- `PK17` Transitividade verbal e complementos (objeto direto e indireto): Esquemas do livro de análise de objeto direto e indireto.
- `PK18` Adjunto adverbial e agente da passiva: Esquema do livro: transposição da voz passiva para a ativa (o cavalo/os bombeiros).
- `PK19` Adjunto adnominal e complemento nominal: Esquemas do livro: adjunto adnominal em volta do núcleo; complemento nominal com adjetivo, advérbio e substantivo.
- `PK20` Aposto e predicativo (do sujeito e do objeto): Quadros do livro: tipos de aposto; esquemas de predicativo do sujeito e do objeto.
- `PK21` Funções sintáticas dos pronomes pessoais (retos e oblíquos): Esquema do livro: mapa das funções sintáticas dos pronomes pessoais.
- `PK22` Classificação dos verbos: regulares, irregulares, anômalos, defectivos, abundantes e semântica: Quadros do livro: classificação morfológica e semântica dos verbos.
- `PK23` Estrutura do verbo, conjugações, transitividade e formas nominais: Quadro do livro: formas nominais do verbo e esquemas de conjugação.
- `PK24` Tempo, modo, aspecto e perífrase verbal: Quadro do livro: modos verbais (indicativo, subjuntivo, imperativo) com exemplos.
- `PK25` Vozes verbais: ativa, passiva (analítica e sintética), reflexiva e o 'se': Esquema do livro: vozes verbais (ativa, reflexiva, passiva analítica e sintética).
- `PK26` Correlação verbal (tempos e modos que combinam no período): Quadro do livro: pares de correlação verbal com exemplos.
- `PK27` Orações coordenadas assindéticas e sindéticas (aditiva, alternativa, adversativa, explicativa, conclusiva): Quadro do livro com as sindéticas, exemplos e conectivos; questão resolvida da Unemat-MT.
- `PK28` Orações subordinadas substantivas (desenvolvidas e reduzidas): Quadro do livro: sete funções das substantivas com exemplos.
- `PK29` Orações subordinadas adjetivas: explicativas e restritivas (e reduzidas): Quadro do livro: adjetivas reduzidas de particípio, gerúndio e infinitivo.
- `PK30` Orações subordinadas adverbiais (nove tipos) e reduzidas: Quadro do livro: nove tipos de adverbiais com conjunções e exemplos.
- `PK31` Funções do 'que': Quadro do livro: funções do 'que' com exemplos.
- `PK32` Funções do 'se': Quadro do livro: funções do 'se' com exemplos.
- `PK33` Concordância verbal: sujeito simples, pronomes 'que' e 'quem', verbos impessoais: Esquemas do livro: sujeito, verbo e objeto direto nas frases com haver/fazer.
- `PK34` Concordância com o verbo 'ser' e na voz passiva sintética: Quadros do livro sobre o verbo 'ser' e sobre passiva sintética x indeterminação.
- `PK35` Concordância verbal com sujeito composto, coletivo e substantivos de sentido singular ou plural: Quadros do livro: concordância com substantivos de sentido singular/plural e com sujeito composto.
- `PK36` Concordância nominal: adjetivo com dois ou mais substantivos e predicativo: Quadro do livro: adjetivo posposto aos substantivos conforme gênero e número.
- `PK37` Concordância nominal: casos de dúvida (mesmo, anexo, obrigado, meio, bastante, é proibido) e silepse: Quadros do livro de casos de dúvida; questão resolvida UFMS 2018.
- `PK38` Regência verbal: verbos que geram dúvida, pronome relativo e complemento comum: Quadro do livro: verbos com dúvidas de regência e suas preposições.
- `PK39` Regência nominal: a preposição que cada nome pede: Quadro do livro: regências de substantivos e adjetivos; questão resolvida Acafe-SC 2023.
- `PK40` Crase: conceito e uso obrigatório: Quadro do livro: usos obrigatórios da crase com exemplos.
- `PK41` Crase: uso proibido: Quadro do livro: usos proibidos da crase.
- `PK42` Crase facultativa, casos especiais (casa, terra, distância) e contextos ambíguos: Quadros do livro: casos especiais e contextos ambíguos; questão resolvida EEAR-SP 2023.
- `PK43` Colocação pronominal: próclise e palavras atrativas: Quadro do livro: casos de próclise com exemplos.
- `PK44` Mesóclise, ênclise e colocação nas locuções verbais: Esquemas do livro: colocação do pronome em locuções verbais com infinitivo, gerúndio e particípio.
- `PK45` Ortografia: grafias dos sons /ʒ/, /ʃ/, /s/ e /z/: Quadro do livro: grafias possíveis para cada som com exemplos.
- `PK46` Emprego do hífen (prefixos e palavras compostas): Quadro do livro: regras do hífen por critérios ortográficos e fonéticos.
- `PK47` Homônimos e parônimos: Quadro do livro: parônimos que mais geram dúvidas.
- `PK48` Dúvidas comuns: por que/por quê/porque/porquê, onde/aonde, mau/mal, senão/se não, mas/mais, a fim de/afim: Quadros do livro de dúvidas comuns com exemplos.
- `PK49` Acentuação gráfica: tonicidade, regras por classe, hiatos e acento diferencial: Quadros do livro: classificação quanto à tonicidade e regras de acentuação.
- `PK50` Vírgula: usos e proibições: Esquemas do livro: posição do adjunto adverbial e uso de vírgula na subordinada adverbial.
- `PK51` Outros sinais de pontuação: Quadro do livro: sinais de pontuação e suas funções; ilustração Shutterstock.
- `PK52` Vícios de linguagem: queísmo, pleonasmo, barbarismo, estrangeirismo, solecismo, gerundismo, ambiguidade, eco, cacofonia: Quadro do livro de vícios de linguagem com exemplos.
- `LK01` Linguagem literária: efeito estético, mimesis, gêneros e literariedade: Busto de Aristóteles (Museu Nacional de Roma) e quadro dos elementos da narrativa.
- `LK02` Elementos da narrativa: narrador, personagens, enredo, tempo, espaço e discurso: Quadro do livro: elementos da narrativa com características.
- `LK03` Trovadorismo: cantigas líricas e satíricas, trovador, jogral e menestrel: Fac-símile da cantiga de D. Dinis no Cancioneiro da Vaticana; tabuleta cuneiforme da Epopeia de Gilgamesh (Museu Britânico).
- `LK04` Humanismo: transição para o Renascimento, Fernão Lopes e Gil Vicente: Prólogo do Cancioneiro Geral Português; trecho do Auto da Barca do Inferno (diálogo do Frade com o Diabo).
- `LK05` Classicismo: Renascimento, Camões épico e lírico: Estátua Davi, de Michelangelo, como exemplo do ideal renascentista; trecho de Os Lusíadas (episódio da Máquina do Mundo).
- `LK06` Classicismo em resumo: contexto, características e a épica e a lírica de Camões: O Homem vitruviano, de Leonardo da Vinci; esquemas do livro sobre Classicismo e as lírica e épica camonianas.
- `LK07` Quinhentismo: Carta de Caminha e literatura jesuítica (Anchieta): Fac-símile da Carta de Caminha (Arquivo Nacional de Portugal, Lisboa); retrato do Padre Anchieta por Benedito Calixto (Museu Paulista).
- `LK08` Barroco: contexto, cultismo e conceptismo, Vieira e Gregório de Matos: Pieter Claesz, Vanitas Still Life (1630); Caravaggio, O sepultamento de Cristo (1602); desfile Dolce & Gabbana inspirado no Barroco; mapa mental do Barroco.
- `LK09` Arcadismo: Neoclassicismo, fingimento poético, Inconfidência e os árcades brasileiros: Pedro Américo, Tiradentes esquartejado (1893); poemas de Cláudio Manuel da Costa e Tomás Antônio Gonzaga reproduzidos no livro.
- `LK10` Romantismo no Brasil: contexto histórico e as três gerações poéticas: Delacroix, A liberdade guiando o povo (1830); trechos de I-Juca-Pirama, 'Se eu morresse amanhã' e O navio negreiro no livro.
- `LK11` Prosa romântica: folhetim, romances de costumes, José de Alencar e Maria Firmina dos Reis: José Maria de Medeiros, Iracema (1884); trecho de Iracema (diálogo Araquém e Martim).
- `LK12` Romantismo em resumo: contexto, gerações e prosa (esquema do livro): Mapa mental do Romantismo no Brasil (características, contexto, três gerações, prosa).
- `LK13` Realismo: contexto científico, Portugal (Questão Coimbrã, Eça) e Brasil (Machado, Júlia Lopes): Prólogo 'Ao leitor' de Memórias póstumas (leitor incluso); trecho de Memórias de Martha.
- `LK14` Naturalismo: romance de tese, zoomorfização, Aluísio Azevedo e Raul Pompeia: Almeida Júnior, Caipira picando fumo (1893), Pinacoteca de São Paulo.
- `LK15` Realismo x Naturalismo: quadro comparativo: Quadro-resumo do livro comparando Realismo e Naturalismo em Portugal e no Brasil.
- `LK16` Parnasianismo: arte pela arte, forma fixa e Olavo Bilac: Soneto 'Via Láctea' (XIII), de Bilac, reproduzido no livro.
- `LK17` Simbolismo: poesia das sensações, musicalidade e simbolistas brasileiros: Poema 'Balada', de Francisca Júlia (Mármores), reproduzido no livro.
- `LK18` Pré-Modernismo: transição, Euclides da Cunha, Lima Barreto, Monteiro Lobato e Augusto dos Anjos: Trecho de Triste fim de Policarpo Quaresma e poema 'Psicologia de um vencido', de Augusto dos Anjos.
- `LK19` Vanguardas europeias: Futurismo, Expressionismo, Cubismo, Dadaísmo e Surrealismo: Munch, O grito (1893); Dalí, A persistência da memória (1931); Duchamp, A fonte (1917); retratos de Marinetti, Picasso e Breton.
- `LK20` Modernismo em Portugal: revista Orpheu e contexto: Capa da primeira edição da revista Orpheu (1915).
- `LK21` Fernando Pessoa: poesia ortônima e heterônimos (Caeiro, Reis, Campos): Poemas 'Autopsicografia' e 'Poema em linha reta' reproduzidos no livro; capa de Mensagem (1934); mapa mental de Pessoa.
- `LK22` Modernismo no Brasil: Semana de 1922 e primeira geração (Mário, Oswald, Bandeira): Fotografia do almoço em homenagem a Paulo Prado (1924); trechos de Macunaíma e do Manifesto Antropófago; entrevista de Bandeira sobre 'Os sapos'.
- `LK23` Segunda geração modernista (1930) e Carlos Drummond de Andrade (três fases): Capas e folha de rosto das primeiras edições de Alguma poesia, A rosa do povo e Claro enigma; esquema das três fases.
- `LK24` Poesia da segunda geração: Cecília Meireles, Vinicius de Moraes, Jorge de Lima e Murilo Mendes: Poema 'Essa negra Fulô' (Jorge de Lima) reproduzido no livro; questão resolvida da Fuvest 2018.
- `LK25` Romance de 30: Rachel de Queiroz, Jorge Amado, Graciliano Ramos, José Lins do Rego e Erico Verissimo: Mapa do livro de autores do romance de 30.
- `LK26` Terceira geração (1945): Clarice Lispector e João Cabral de Melo Neto: Quadros-resumo da terceira geração.
- `LK27` Guimarães Rosa: regionalismo universalista, neologismos e obras principais: Capa da primeira edição de Grande sertão: veredas (1956); esquema de obras e características.
- `LK28` Concretismo, Neoconcretismo e Ferreira Gullar: Fotografia de Augusto de Campos, Décio Pignatari e Haroldo de Campos (1996).
- `LK29` Narrativas contemporâneas: urbanas, realismo insólito, Hatoum e Bernardo Carvalho: Foto de Milton Hatoum (Folhapress).
- `LK30` Literatura escrita por mulheres: Geração Mimeógrafo, Ana Cristina Cesar, Adélia Prado, Lygia, Sophia: Mimeógrafo e capas de livros do período.
- `LK31` Literatura afrodescendente: Carolina Maria de Jesus, Conceição Evaristo, Ana Maria Gonçalves e outros: Poema 'Tempo de nos aquilombar' (Conceição Evaristo) reproduzido no livro.
- `LK32` Literatura marginalizada ou periférica: Ferréz, Cooperifa, Racionais, slam: Foto de sarau e capas das obras citadas.
- `LK33` Literaturas africanas de língua portuguesa: contexto e quatro momentos: Mapa mental das literaturas africanas.
- `LK34` Literatura moçambicana: fases colonial, nacionalista e pós-colonial: Mapa de autores moçambicanos.
- `LK35` Literatura angolana pós-colonial: Pepetela, Agualusa, Ondjaki e Djaimilia Pereira de Almeida: Trecho de A visão das plantas reproduzido no livro.
- `LK36` Literaturas indígenas: linha do tempo, Lei 11.645/2008, escrita como tradução cultural: Linha do tempo das literaturas indígenas; foto de Joênia Wapichana na ONU; capa de Histórias de índio.
- `LK37` Território, cosmologia e identidade: Kopenawa, Krenak, Kambeba, Dorrico, Potiguara e Graúna: Trechos dos poemas 'Ay kakyri tama', 'Eu sou macuxi' e 'Eu não tenho minha aldeia'.
- `LK38` Oralidade e tradição: Daniel Munduruku, Kaká Werá Jecupé e síntese temática: Mapa mental 'Literaturas indígenas' com os sete autores e três eixos.
- `IK01` Linguagem conotativa e figuras semânticas de comparação: Fotos de 'coração de pedra' e 'asa da xícara'; quadro dos tipos de metonímia.
- `IK02` Figuras de oposição: antítese, paradoxo, ironia, sarcasmo e preterição: Quadro de Caravaggio (A ceia de Emaús) e quadro de Matisse/arte moderna do box.
- `IK03` Figuras de intensidade e realce: hipérbole, eufemismo, gradação, sinestesia, apóstrofe e oximoro: Quadro de Kandinsky; mapa mental das figuras semânticas.
- `IK04` Figuras sintáticas de apagamento: elipse, zeugma e assíndeto: Quadro das figuras sintáticas (apagamento, repetição, ruptura, inversão).
- `IK05` Figuras sintáticas de repetição: polissíndeto, anáfora, epístrofe e pleonasmo: Quadro 'Figuras sintáticas' do livro.
- `IK06` Figuras sintáticas de ruptura e inversão: silepse, anacoluto, quiasmo e hipérbato: Foto das pirâmides invertidas do Louvre; esquema ABBA do poema parnasiano.
- `IK07` Figuras sonoras: assonância, aliteração, onomatopeia, cacofonia e paronomásia: Quadrinho de paronomásia e mapa mental das figuras sintáticas e sonoras.
- `IK08` Texto narrativo: foco narrativo, tempo e quebras da progressão temporal: Tirinha de Andre Dahmer; linha do tempo linear × não linear.
- `IK09` Texto descritivo, injuntivo e prescritivo: Tirinha de Adão Iturrusgarai sobre velocidade.
- `IK10` Texto dissertativo: argumentativo × expositivo e desenvolvimento dedutivo × indutivo: Mapa mental da tipologia textual.
- `IK11` Discurso direto e indireto e a conversão entre eles: Quadro de conversão entre discursos.
- `IK12` Discurso indireto livre: Mapa mental 'Discurso textual'.
- `IK13` Gêneros textuais: características composicionais e esferas jornalística e propagandística: Quadro de gêneros textuais.
- `IK14` Gêneros da esfera digital: divulgação científica, podcast e memes: Peça publicitária da questão; mapa mental dos gêneros textuais.
- `IK15` Funções da linguagem: elementos da comunicação, emotiva e apelativa (conativa): Esquema do circuito de comunicação com as seis funções.
- `IK16` Funções fática, poética, referencial e metalinguística: Poema concreto 'Anti-ruído', peça publicitária da urna eletrônica e mapa mental das funções.
- `IK17` Coesão textual: relações de progressão e conectores subordinativos: Tabela de conectores subordinativos.
- `IK18` Conectores coordenativos e coesão por remissão (anafórica): Tabela de conectores coordenativos.
- `IK19` Coesão por antecipação (catafórica): Quadro das três relações de coesão.
- `IK20` Ambiguidade semântica: polissemia, duplo sentido e homonímia: Imagem pato/coelho, tirinha da Mafalda e quadro de homofonias.
- `IK21` Ambiguidade sintática: qualificador, pronome e elipse: Mapa mental 'Ambiguidade textual'.
- `IK22` Intertextualidade explícita: citação e epígrafe: Quadro 'Relações explícitas e implícitas'.
- `IK23` Intertextualidade implícita: alusão, paráfrase e paródia: Cartaz 'We Can Do It!' e a paródia 'Yes I Cat!'; comparação 'Canção do Exílio' x Hino Nacional.
- `IK24` Paráfrase × paródia na prática e quadro das intertextualidades implícitas: Textos 1 (miojo) e 2 (Canção do Exílio) da questão; mapa de intertextualidade.
- `IK25` Tipos de variação linguística: geográfica, histórica, situacional e social: Mapa 'Variação linguística' e linha de mudança de 'Virgem Maria' a 'iti malia'.
- `IK26` Preconceito linguístico: Quadro de variação linguística com balões de gírias.
- `IK27` Tipos de questão: paráfrase, inferência, síntese analítica e síntese comparativa: Mapa mental 'Tipos de questão'.
- `RK01` Formato da prova e as 5 competências da redação do Enem: Esquema do caderno de prova e das 5 competências.
- `RK02` Estrutura da redação Enem: 4 parágrafos, tese e conclusão: Esquema macro e microestrutura da redação.
- `RK03` Abordagem do tema: temas 2016–2025 e como problematizar: Lista de temas Enem 2016–2025 e quadro de perguntas.
- `RK04` Introdução: contexto, ponte e tese (progressão argumentativa): Quadro 'contexto, ponte e tese' com os quatro modelos de contextualização.
- `RK05` Repertório sociocultural na Competência 2: legitimado, pertinente e produtivo: Fluxograma de avaliação do repertório (níveis 2 a 5).
- `RK06` Parágrafo argumentativo: TF, expansão, repertório e fecho; tipos de argumento e lacunas: Esquema do parágrafo TF–EXP–REP–FECHO com exemplos de redações nota 1000.
- `RK07` Recursos coesivos referenciais e sequenciais (operadores argumentativos) — Competência 4: Tabela dos oito tipos de operadores argumentativos.
- `RK08` Proposta de intervenção: os 5 elementos e três modelos de frase: Quadro dos 5 elementos e exemplo de proposta nota 1000.
- `RK09` Passo a passo: como fazer uma boa redação no Enem: Fluxograma 'Como fazer uma boa redação no Enem'.
- `RK10` Dissertação clássica: quem cobra, estrutura e estratégias de introdução e conclusão: Esquema 'Estrutura da dissertação sem proposta de intervenção'.
- `RK11` Leitura da coletânea, assunto × tema e ampliação temática: Tabela de assuntos e recortes e fluxo da ampliação temática (página lida por captura de tela, pois o texto não estava disponível).
- `RK12` Como expandir argumentos e recursos de autoria: campo semântico (exemplo Fuvest 2025): Redação 50/50 da Fuvest 2025 anotada e mapa mental 'resumão'.
- `RK13` Gêneros textuais: conceito, interlocutores, prática social e vestibulares que cobram: Mapa 'Tipos de texto: funções e gêneros textuais'.
- `RK14` Texto narrativo: enredo, narrador, personagem, espaço e tempo: Esquema dos 5 elementos da narrativa.
- `RK15` Gêneros narrativos: narrativa clássica, conto, crônica, relato pessoal, diário e carta pessoal: Mapa dos gêneros narrativos.
- `RK16` Gêneros expositivos: notícia, reportagem, divulgação científica, resumo, verbete e relatório: Mapa dos gêneros expositivos.
- `RK17` Gêneros argumentativos: artigo de opinião, cartas, abaixo-assinado: Quadro dos tipos de carta (remetente, destinatário, propósito).
- `RK18` Postagem em fórum, post em rede social, resenha crítica, manifesto e discurso político: Quadro de postagens e esquema da resenha.
- `RK19` Gêneros injuntivos: texto instrucional, receita culinária e guia de viagem: Mapa dos gêneros injuntivos.
- `RK20` Redação por tarefas específicas (UFPR): comandos identifique, sintetize, inicie e finalize: Quadro de comandos e a prova UFPR 2025.
- `RK21` Resposta argumentativa × resposta interpretativa (UEM): Mapa 'Redação em outros padrões'.
- `RK22` Checklist da redação: todas as etapas: Checklist ilustrado da redação.

### Matemática (`mat`) — 112 imagens

- `M01.1` Frações e decimais: Barra de 1 inteiro dividida em 12 partes: 1/2, 1/3 e 1/4 pintadas em cores, com o resultado 1/2+1/3 = 5/6 mostrado pela soma das partes.
- `M01.2` Potências e radicais: Quadro com três cartões de propriedades de potência (produto, quociente, potência de potência) e uma flecha ligando $a^{1/2}$ a $\sqrt{a}$.
- `G30` Radiciação: propriedades e racionalização: Fração $\frac{1}{\sqrt3+\sqrt2}$ sendo multiplicada em cima e embaixo pelo conjugado, passo a passo.
- `M01.3` Notação científica e ordem de grandeza: Reta numérica em escala de potências de 10 (de $10^{-9}$ a $10^{9}$) com exemplos: vírus, célula, formiga, pessoa, Terra.
- `M01.4` Divisibilidade, MMC e MDC: Duas árvores de fatoração (18 e 24) lado a lado, com os primos em cores e um quadro destacando maiores expoentes (MMC) e menores (MDC).
- `G02` Divisibilidade, primos, MMC e MDC (detalhe): Árvore de fatoração de 360 com os expoentes e a conta (3+1)(2+1)(1+1) = 24 divisores.
- `M01.5` Conjuntos numéricos: Diagrama de círculos concêntricos ($\mathbb{N}$ dentro de $\mathbb{Z}$, $\mathbb{Q}$, $\mathbb{R}$) com $\mathbb{I}$ ao lado, e exemplos em cada região.
- `G01` Teoria dos conjuntos e operações: Diagrama de Venn com três círculos, as oito regiões numeradas e a ordem de preenchimento (do centro para fora).
- `M02.1` Razão e proporção: Balança em equilíbrio com razões iguais nos dois pratos e as setas da multiplicação cruzada.
- `M02.2` Regra de três simples e composta: Dois quadros: pedreiros × dias (setas opostas = inversa) e litros × preço (setas iguais = direta), com a conta montada ao lado.
- `M02.3` Escalas e densidade: Mapa com régua: 3 cm no papel = 150 km, e um quadrado de 1 cm² no mapa representando um quadrado grande no terreno.
- `M02.4` Grandezas direta e inversamente proporcionais: Dois gráficos lado a lado: reta pela origem (direta) e hipérbole (inversa), com pontos marcados e a constante k.
- `M02.5` Divisão proporcional: Barra de R$ 1.200 cortada em 3 pedaços proporcionais a 2, 3 e 5, com cada pedaço em cor e o valor.
- `M03.1` Porcentagem simples: Barra de 100 quadradinhos com 35 pintados (35%), e ao lado parte/todo para achar a taxa.
- `M03.2` Aumentos e descontos sucessivos: Três degraus com R$ 100 → 110 → 121 (dois aumentos de 10%) e uma seta mostrando que +10% e −10% termina em 99.
- `M03.3` Juros simples: Gráfico montante × tempo com uma reta que sobe degrau fixo a cada mês.
- `M03.4` Juros compostos: Dois gráficos sobrepostos: reta (simples) e curva (composta) saindo do mesmo capital, abrindo vantagem para a curva com o tempo.
- `M03.5` Dose, concentração e proporção aplicada à saúde: Frasco de soro com rótulo 5 mg/mL e uma seringa de 2 mL, com a conta da dose ao lado.
- `M04.1` Equação do 1.º grau: Balança de dois pratos: x e pesos de 3 e 5 em cada lado, com a retirada de pesos iguais dos dois lados.
- `G03` Sentenças, equações e identidades: Duas colunas: equação (x = 3 marca um ponto) e identidade (vale para toda a reta real).
- `M04.2` Equação do 2.º grau: Três parábolas lado a lado (Δ>0, Δ=0, Δ<0) com as raízes marcadas no eixo x.
- `G04` Fatoração e produtos notáveis: Quadrado de lado a+b dividido em quatro regiões (a², b² e dois retângulos ab) mostrando $(a+b)^2$.
- `M04.3` Sistemas lineares: Plano com três pares de retas: cruzando (SPD), coincidindo (SPI) e paralelas (SI), com o rótulo de cada caso.
- `M04.4` Inequações: Reta real com intervalos sombreados (bolinha aberta e fechada) e um quadro de sinais com três linhas.
- `G07` Inequações, estudo do sinal e forma fatorada: Quadro de sinais de $(x-1)(x-3)/(x+2)$ com três linhas e o resultado na reta real.
- `M04.5` Problemas de modelagem algébrica: Frase de enunciado ao lado da equação correspondente, com as palavras-chave ligadas por linhas aos símbolos.
- `M05.1` Função afim: Duas retas (a>0 e a<0) com b e a raiz destacados e o triângulo do coeficiente angular.
- `M05.2` Função quadrática e vértice: Parábola com eixo de simetria tracejado, vértice marcado com coordenadas, e a seta mostrando máximo ou mínimo.
- `G08` Parábola (lugar geométrico): Parábola com foco, diretriz, vértice e eixo de simetria, e um ponto P com duas setas iguais (a P-foco e a P-diretriz).
- `M05.3` Leitura de gráficos de funções: Gráfico de uma função qualquer com trechos marcados (cresce, decresce, constante) e as quatro translações em mini-gráficos.
- `G05` Par ordenado, produto cartesiano, relação e função: Diagrama de flechas de A para B com domínio, contradomínio e imagem pintados em cores diferentes.
- `G06` Classificação das funções: sobrejetora, injetora, monotonicidade, paridade, periodicidade: Seis mini-gráficos: sobrejetora, injetora, bijetora, par, ímpar e periódica, cada um com a condição escrita.
- `M05.4` Função definida por partes e modular: Gráfico de uma parábola e, ao lado, o gráfico de seu módulo com a parte negativa dobrada para cima.
- `M05.5` Composição e inversa: Diagrama com três conjuntos (A, B, C) e setas f e g compondo, e ao lado gráfico de f e f⁻¹ espelhados na reta y = x.
- `M06.1` Função exponencial: Duas curvas no mesmo plano (a=2 sobe e a=1/2 desce), as duas passando por (0,1) e se aproximando do eixo x.
- `M06.2` Equação exponencial: Quadro de três passos: igualar bases, igualar expoentes, resolver; e um exemplo com a troca 2^x = y.
- `G29` Inequações exponencial e logarítmica, cologaritmo: Dois gráficos (base 2 e base 1/2) com um intervalo no eixo x e a desigualdade resultante em cada caso.
- `M06.3` Definição e propriedades do logaritmo: Ponte entre 'potência' e 'logaritmo': $2^3=8$ ligado a $\log_2 8=3$, com as propriedades em cartões.
- `M06.4` Equação logarítmica: Reta real com a condição x > 0 sombreada e um 'filtro' que descarta uma solução fora do domínio.
- `M06.5` Meia-vida, decaimento e crescimento: Curva de decaimento com a quantidade caindo pela metade em cada intervalo T marcado no eixo do tempo.
- `M07.1` Progressão aritmética: Degraus de uma escada: cada degrau acrescenta r à altura, com a_1, a_2, a_3 marcados.
- `M07.2` Progressão geométrica: Quadrados que dobram de largura (1, 2, 4, 8) em sequência, com a razão q = 2 em cada seta.
- `M07.3` Soma de termos: Gauss: fileira de números 1 a 10 com pares ligados por arcos (1+10, 2+9, ...), cada um somando 11.
- `M07.4` Padrões e recorrências: Espiral de quadrados de Fibonacci e, abaixo, uma tabela com os 8 primeiros termos.
- `M08.1` Triângulos: Triângulo com base, altura tracejada e ângulo entre dois lados marcado, com as três fórmulas de área ao lado.
- `G14` Classificação, existência e ângulos do triângulo: Triângulo com o ângulo externo marcado e a igualdade com os dois internos opostos; ao lado, 3 palitos (2, 3, 6) que não fecham.
- `G15` Pontos notáveis do triângulo: Quatro triângulos, um para cada ponto notável, com as cevianas correspondentes em cores.
- `M08.2` Quadriláteros: Cinco quadriláteros (retângulo, quadrado, paralelogramo, losango, trapézio) com base, altura e diagonais tracejadas.
- `M08.3` Circunferência e círculo: Círculo com setor de 60° pintado e, ao lado, círculo com um segmento circular e o triângulo do setor tracejado.
- `M08.4` Polígonos regulares: Triângulo, quadrado e hexágono regulares inscritos, cada um com apótema (verde) e raio (vermelho) marcados.
- `M08.5` Áreas compostas e hachuradas: Figura com quadrado e quarto de círculo hachurado, com a divisão em partes e a conta 'quadrado − quarto de círculo'.
- `M08.6` Áreas básicas: Malha quadriculada com um retângulo, um quadrado e um triângulo, cada um com a conta embaixo.
- `M09.1` Teorema de Pitágoras: Triângulo 3-4-5 com um quadrado sobre cada lado e as áreas 9 + 16 = 25 escritas dentro.
- `M09.2` Teorema de Tales: Três retas paralelas cortadas por duas transversais, com os segmentos nomeados e a proporção escrita.
- `G16` Congruência e teoremas da Geometria plana: Triângulo com os pontos médios de dois lados ligados (base média) e um trapézio com a base média e o segmento das diagonais.
- `G32` Divisão de segmento: média, harmônica e áurea: Reta com A e B, os pontos S (interior) e S' (exterior) conjugados harmônicos, e abaixo um segmento dividido na razão áurea.
- `M09.3` Semelhança de triângulos: Dois triângulos semelhantes (um maior) com ângulos iguais marcados em cores e lados correspondentes ligados.
- `M09.4` Relações métricas no triângulo retângulo: Triângulo retângulo com altura h sobre a hipotenusa, projeções m e n coloridas e as quatro relações em cartões.
- `M09.5` Ângulos e propriedades: Circunferência com ângulo central e inscrito no mesmo arco, e a figura de potência de ponto com duas secantes.
- `G31` Isometrias: translação, rotação e reflexões: Quatro painéis com a mesma figura: transladada, girada, refletida em ponto e refletida em reta, cada um com a regra escrita.
- `M10.1` Razões trigonométricas no triângulo retângulo: Triângulo retângulo com o ângulo α marcado, cateto oposto, adjacente e hipotenusa em cores e as três razões escritas.
- `M10.2` Lei dos senos: Triângulo qualquer inscrito numa circunferência, com lados e ângulos opostos de mesma cor e o raio R indicado.
- `M10.3` Lei dos cossenos: Triângulo ABC com os lados b e c e o ângulo A entre eles, e a seta apontando para o lado oposto a.
- `M10.4` Ciclo trigonométrico e arcos: Circunferência trigonométrica com os ângulos notáveis de 0° a 360° e as coordenadas (cos, sen) de cada ponto do primeiro quadrante.
- `G28` Transformações trigonométricas: Ciclo com dois arcos a e b somando e um quadro com as três fórmulas de soma em cores.
- `M10.5` Funções trigonométricas e gráficos: Gráfico do seno em um período, com amplitude, período e imagem marcados, e uma segunda curva deslocada e esticada para comparar.
- `M11.1` Prismas e cubos: Cubo e paralelepípedo com a diagonal da face e a do sólido tracejadas, e um poliedro com V, A e F contados.
- `G17` Geometria de posição e poliedros: Os cinco poliedros de Platão em linha, com F, A e V escritos embaixo de cada um.
- `M11.2` Cilindros: Cilindro planificado: dois círculos e um retângulo de comprimento 2πr, com r e h marcados.
- `M11.3` Pirâmides e cones: Cone com r, h e geratriz g, e uma pirâmide ao lado com a altura e o apótema, cada uma dentro do prisma correspondente em linha tracejada.
- `G18` Pirâmide regular, tronco e inscrições de sólidos: Pirâmide quadrangular com h, g e a em um triângulo retângulo, e ao lado a esfera dentro de um cilindro equilátero.
- `M11.4` Esfera: Esfera com plano de corte, o triângulo retângulo R, d e r da secção, e uma cunha e um fuso destacados em cores.
- `M11.5` Troncos, sólidos compostos e densidade/volume: Cone cortado por plano paralelo à base: cone menor tracejado, tronco colorido, com r, R e h marcados.
- `M11.6` Volumes básicos: Painel com os seis sólidos básicos e a fórmula do volume sob cada um.
- `M12.1` Distância entre pontos e ponto médio: Plano cartesiano com dois pontos, o triângulo retângulo formado pelos catetos Δx e Δy e o ponto médio marcado.
- `M12.2` Equação da reta: Reta no plano com dois pontos, o triângulo do coeficiente angular e o ângulo α com o eixo x.
- `M12.3` Posição relativa e paralelismo: Três pares de retas (paralelas, concorrentes, perpendiculares) com os coeficientes angulares escritos.
- `G13` Bissetrizes e ângulo entre retas: Duas retas concorrentes com as duas bissetrizes (perpendiculares entre si) e a distância do ponto às retas.
- `M12.4` Circunferência no plano cartesiano: Circunferência no plano com centro, raio, uma reta tangente e outra secante, e a distância d do centro às retas marcada.
- `G09` Elipse: Elipse com focos, os eixos 2a e 2b, a distância focal 2c e o triângulo retângulo a, b, c destacado.
- `G10` Hipérbole: Hipérbole com focos, vértices, retângulo de lados 2a e 2b e as duas assíntotas tracejadas.
- `G11` Inequações com duas variáveis e regiões do plano: Plano com uma elipse e um círculo, a região interior comum pintada, e o ponto teste (0,0) marcado.
- `M12.5` Áreas por coordenadas: Triângulo de vértices (0,0), (4,0), (0,3) com a malha do plano e o determinante ao lado dando a área 6.
- `G12` Área de polígono por coordenadas e alinhamento: Quadrilátero no plano com os vértices numerados em ordem e a tabela das multiplicações cruzadas.
- `M13.1` Princípio multiplicativo: Árvore de possibilidades: 3 camisas × 2 calças × 2 sapatos, com os ramos e o total 12 no final.
- `M13.2` Arranjos e permutações: Mesa redonda com 4 pessoas: duas rotações iguais marcadas como 'mesma disposição', ao lado de uma fila com ordem importando.
- `M13.3` Combinações: Seis bolinhas numeradas com três escolhidas e as 6 ordens possíveis do mesmo trio riscadas (conta como 1 combinação).
- `M13.4` Probabilidade simples: Tabela 6×6 das somas de dois dados, com as células da soma 7 destacadas.
- `G20` Experimento, espaço amostral e produto de probabilidades: Árvore de probabilidades com dois sorteios sem reposição, mostrando a multiplicação ao longo dos ramos.
- `M13.5` Probabilidade condicional e teste diagnóstico: Tabela 2×2 (exposto/não exposto × doente/sem doença) com a linha 'dado que' destacada em cor e a fração montada ao lado.
- `M13.6` União, intersecção e evento complementar: Diagrama de Venn de A e B com a interseção em cor diferente e a fórmula da união ao lado.
- `M13.9` Combinatória e probabilidade — outros casos: Triângulo de Pascal até a linha 5, com a relação de Stifel destacada em dois números somando-se ao de baixo.
- `G19` Fatorial, binomial, Pascal e Newton: Triângulo de Pascal até a linha 6 com Stifel e uma diagonal somada marcados em cores.
- `M14.1` Média, mediana e moda: Cinco barras de alturas diferentes ordenadas, com a do meio marcada (mediana) e uma linha horizontal na altura da média.
- `M14.2` Leitura de tabelas e gráficos: Mesmo conjunto de dados em quatro gráficos pequenos (barras, histograma, setores, linhas), cada um com seu uso escrito embaixo.
- `G21` Definições, frequências e tabelas: Tabela de distribuição de frequências com colunas f, fr, Fac e Frac coloridas e uma linha preenchida passo a passo.
- `M14.3` Dispersão e desvio padrão: Dois conjuntos na reta com a mesma média: um agrupado e outro espalhado, com setas dos desvios até a média e o desvio padrão ao lado.
- `M14.4` Média ponderada: Balança com blocos de pesos diferentes sobre as notas 6, 8 e 10 e o ponto de equilíbrio (média) marcado.
- `G22` Média geométrica, harmônica e ponderada: Três balanças: aritmética, geométrica e harmônica, cada uma com a fórmula e um exemplo curto.
- `M14.5` Interpretação de dados em saúde: Tabela 2×2 de exposição e doença com as duas probabilidades condicionais calculadas e a razão final.
- `M15.1` Operações com matrizes: Duas matrizes pequenas com a linha 2 de A e a coluna 1 de B destacadas e a conta dando um elemento de C.
- `G25` Tipos de matrizes e propriedades da transposta: Matrizes 3×3 coloridas mostrando onde ficam os zeros em cada tipo (diagonal, triangular sup., inf., identidade).
- `M15.2` Determinantes: Matriz 3×3 com as duas colunas repetidas à direita e as seis diagonais do Sarrus em cores (três positivas, três negativas).
- `G26` Determinantes: propriedades, Laplace, Chió e Vandermonde: Matriz 3×3 com a fila de maior número de zeros destacada e os cofatores com sinais alternados em xadrez (+ − +).
- `M15.3` Aplicação em sistemas: Sistema 2×2 escrito ao lado da forma matricial, com a inversa aplicada dos dois lados.
- `G27` Matriz inversa, Cramer e escalonamento: Sistema 3×3 sendo escalonado em três quadros, com o pivô circulado em cada etapa.
- `M16.1` Polinômios e relações de Girard: Quadro de divisão pela chave (P(x) por x−2) ao lado do dispositivo de Briot-Ruffini com os coeficientes alinhados.
- `G23` Equações polinomiais: raízes e teoremas: Gráfico de um polinômio cúbico cruzando o eixo x em três pontos, com Girard escrito ao lado.
- `G24` Divisão de polinômios, Briot-Ruffini e teoremas: Dispositivo de Briot-Ruffini com a raiz à esquerda, os coeficientes em linha e o resto destacado.
- `M16.2` Números complexos: Plano de Argand-Gauss: eixo real e eixo imaginário, o ponto a+bi, o módulo r como seta e o ângulo θ.
- `M17.1` Raciocínio lógico e dedução: Diagramas de Venn para 'todo A é B', 'algum A é B' e 'nenhum A é B', com a negação de cada um escrita embaixo.
- `M17.2` Algoritmos e sistemas de numeração: Divisão sucessiva por 2 do número 13, com os restos 1, 0, 1, 1 e a leitura de baixo para cima formando 1101.

### Biologia (`bio`) — 58 imagens

- `BK01` Características dos seres vivos e método científico: Esquema dos níveis de organização, do átomo à biosfera, em escada.
- `BK02` Água e sais minerais: Molécula de água com cargas parciais e as ligações de hidrogênio entre moléculas nos três estados.
- `BK03` Carboidratos: Esquema da síntese por desidratação de duas glicoses formando maltose.
- `BK04` Lipídios: Fosfolipídio e bicamada, e triglicerídeo com 3 ácidos graxos.
- `BK05` Proteínas e enzimas: Três gráficos: velocidade x temperatura, x pH (pepsina e tripsina) e x substrato (saturação).
- `BK06` Ácidos nucleicos e código genético: Fluxo DNA para RNAm para proteína, com transcrição e tradução.
- `BK07` Tipos celulares e organelas: Célula animal e célula vegetal lado a lado, com as organelas nomeadas.
- `BK08` Parede celular e membrana plasmática: Hemácia em solução hipo, iso e hipertônica; célula vegetal túrgida e plasmolisada.
- `BK09` Núcleo, cromossomos e ploidia: Nucleossomos, cromatina e cromossomo duplicado com centrômero e telômeros.
- `BK09b` Mapa mental: Biologia celular (visão geral): Mapa mental colorido da célula procariótica, animal e vegetal, com as organelas, o citoesqueleto, o mosaico fluido e o transporte pela membrana.
- `BK10` Ciclo celular e mitose: Roda do ciclo celular G1, S, G2, M e G0.
- `BK10b` Etapas da mitose e da meiose (esquema): Esquema com as fases da mitose em célula animal e as fases da meiose I e II, com o quiasma destacado.
- `BK11` Gametogênese: Espermatogênese e ovogênese em paralelo, com os números de cromossomos (2n e n).
- `BK12` Respiração celular e fermentação: Respiração em três etapas, com local e ATP de cada uma.
- `BK13` Fotossíntese e quimiossíntese: Fotossíntese com as duas fases e gráficos de luz, CO2 e temperatura.
- `BK14` Classificação dos seres vivos: Árvore dos três domínios.
- `BK14a` Fungos: Ciclo de vida do cogumelo: plasmogamia, micélio dicariótico, corpo de frutificação, cariogamia, meiose e esporos.
- `BK14b` Protozoários: Divisão do núcleo e depois do citoplasma em protozoário (esquizogonia).
- `BK15` Vírus, bactérias e arqueas: Fases da reprodução do vírus (1 a 6) e os três mecanismos de troca de DNA em bactérias.
- `BK16` Ciclos de vida e algas: Os três ciclos reprodutivos com fases n e 2n.
- `BK17` Classificação e reprodução das plantas (briófitas, pteridófitas, gimnospermas, angiospermas): Quatro ciclos de vida (musgo, samambaia, pinheiro e angiosperma) com fases n e 2n, e as quatro técnicas de propagação vegetativa.
- `BK18` Tecidos vegetais e órgãos (meristemas, epiderme, folha, caule e raiz): Quadro comparativo mono x eudicotiledônea; meristema apical (gema e raiz); estrutura primária x secundária do caule; corte da folha; tipos de caule e de raiz.
- `BK19` Flor, fruto e semente: Flor completa com todas as partes e corte de um fruto.
- `BK20` Nutrição, transpiração, seiva, hormônios e movimentos vegetais: Mapa mental de Fisiologia vegetal; corte da folha com estômato; via apoplástica e simplástica com estria de Caspary; experimento de Münch; anelamento de Malpighi; gravitropismo; gráficos de fotoperiodismo.
- `BK21` Anelídeos e artrópodes: Tabela comparativa de crustáceos, insetos, aracnídeos, quilópodes e diplópodes.
- `BK21a` Embriologia dos animais: Do ovo fertilizado à gástrula, com mórula, blástula e os folhetos.
- `BK21b` Poríferos e cnidários: Esponja em corte (poros, átrio, ósculo, coanócitos); pólipo e medusa; cnidócito com nematocisto.
- `BK21c` Platelmintos e nematódeos: Planária em corte e nematódeo com pseudoceloma e sistema digestório completo.
- `BK21d` Moluscos e anelídeos: Esquema do molusco (cabeça, pé, massa visceral, manto, concha) e corte da minhoca.
- `BK21e` Equinodermos: Estrela-do-mar com placa madrepórica, ampolas e pés ambulacrários.
- `BK22` Cordados e vertebrados (ágnatos, peixes, anfíbios, amniotas): Corpo de um cordado com as quatro características exclusivas; circulação dos peixes e dos anfíbios.
- `BK23` Tecidos epitelial, conjuntivo e muscular: Sarcômero relaxado e contraído.
- `BK24` Digestório e respiratório: Movimentos respiratórios e a reação CO2 + H2O para H2CO3 para HCO3- + H+.
- `BK25` Sistema cardiovascular e imunitário: Mapa mental da fisiologia humana; corte de artéria, capilar e veia; coração humano com setas do fluxo; circulação em peixe e anfíbio.
- `BK26` Sistema nervoso (neurônio, impulso, SNC e SNP): Neurônio com bainha de mielina; arco reflexo na medula; meninges; esquema das divisões simpática e parassimpática.
- `BK26a` Sistema urinário e formação da urina: Corte do rim, aparelho urinário completo e néfron com túbulos, alça e ducto coletor.
- `BK26b` Osmorregulação: Dois esquemas: peixe de água doce e peixe marinho, com setas de água e sal.
- `BK27` Sistema endócrino: Eixo hipotálamo, hipófise e tireoide com feedback; ação de insulina e glucagon.
- `BK28` Sistema genital, ciclo menstrual e métodos contraceptivos: Aparelhos genitais masculino e feminino com as estruturas; ciclo ovariano e uterino com hormônios.
- `BK29` Conceitos e viroses: Quadro de viroses com transmissão e profilaxia.
- `BK30` Bacterioses: Quadro de bacterioses.
- `BK31` Protozooses: Quadro de protozooses.
- `BK32` Verminoses: Quadro de verminoses.
- `BK33` Conceitos básicos e probabilidade: Heredograma com os símbolos de homem, mulher, afetado e casamento.
- `BK34` Leis de Mendel e variações: Cruzamento de P (roxa x branca) até F2 3:1.
- `BK35` Alelos múltiplos e grupos sanguíneos: Setas de transfusão entre A, B, AB e O, com Rh+ e Rh-.
- `BK36` Interações e ligações gênicas: Meiose com crossing-over e gametas parentais e recombinantes.
- `BK37` Herança relacionada ao sexo: Cruzamento XX x XY e inativação do X (mosaico).
- `BK38` Mutações e Hardy-Weinberg: Não disjunção na meiose I e II e cariótipo de trissomia do 21.
- `BK39` Células-tronco, clonagem e engenharia genética: Clonagem da ovelha Dolly e formação de DNA recombinante em bactéria.
- `BK40` Lamarck, Darwin e teoria moderna: Três gráficos de seleção estabilizadora, direcional e disruptiva.
- `BK41` Evidências, adaptações e especiação: Estruturas homólogas (nadadeira, pata, asa) e análogas (asa de inseto e de ave).
- `BK42` Níveis de organização, cadeias e pirâmides: Pirâmides de números, biomassa e energia, com exemplos.
- `BK43` Ciclos biogeoquímicos: Ciclo do nitrogênio com as seis etapas (A a F).
- `BK44` Sucessão ecológica e relações ecológicas: Sucessão primária e secundária lado a lado e quadro das relações com sinais.
- `BK45` Dinâmica populacional e biomas: Gráfico potencial biótico x resistência x carga biótica máxima e mapa de biomas.
- `BK45b` Biomas brasileiros: Cerrado, Caatinga, Pampas, Pantanal e Manguezal: Mapa da distribuição dos biomas terrestres e marinhos no Brasil (Amazônia, Caatinga, Cerrado, Mata Atlântica, Pampa, Pantanal e sistema costeiro-marinho) e fotos de cada bioma.
- `BK46` Alterações ambientais e desenvolvimento sustentável: Gráfico do lago eutrofizado (nutrientes, bactérias anaeróbias e aeróbias, oxigênio ao longo do tempo), esquema da camada de ozônio com UVA, UVB e UVC e corte de aterro sanitário.

### Física (`fis`) — 50 imagens

- `FK01` Introdução à cinemática, MU, MUV e gráficos: Quadro-resumo do mapa mental de Cinemática (tipos de movimento e fórmulas) e os gráficos de s, v e a para MU e MUV progressivo e retrógrado, com tangente e área marcadas.
- `FK02` Movimento circular: grandezas angulares, período e frequência: Figura da trajetória circular com o arco Δs, o ângulo Δθ e o raio R entre as posições P1 e P2.
- `FK02b` MCU, MCUV e transmissão de movimento circular: Duas polias de raios diferentes ligadas por correia e duas rodas sobre o mesmo eixo, com as tabelas de grandezas lineares e angulares.
- `FK03` Cinemática vetorial e composição de movimentos: Vetores somados pelos três métodos (poligonal, paralelogramo, decomposição) e esquema das direções tangencial e normal em uma trajetória curva.
- `FK04` Lançamento oblíquo no vácuo: Parábola do lançamento oblíquo com v0, θ, componentes v0x e v0y, e vx e vy em vários pontos (vy = 0 no topo).
- `FK05` Resolução de problemas de Dinâmica, molas, polias e plano inclinado: Diagramas de forças: dinamômetro, polia fixa e móvel e plano inclinado com Px e Py.
- `FK05b` Mapa mental de Dinâmica, definições e leis de Newton: Mapa mental colorido de Dinâmica com forças (elástica, atrito, peso, normal, tração) e as três leis de Newton.
- `FK06` Força de atrito, resistência dos fluidos e movimento circular: Esquema do atrito entre o livro e a superfície, com Fat e N, e as direções tangencial e centrípeta em uma curva.
- `FK07` Trabalho e potência: Esquemas de força formando ângulo θ com o deslocamento e gráfico F×s com a área sombreada.
- `FK08` Energia mecânica e conservação: Mapa mental de Trabalho e Energia (potência, trabalho, energia cinética, potencial e mecânica, teorema da energia cinética, gráfico F×s).
- `FK09` Impulso, quantidade de movimento e colisões: Mapa mental de Dinâmica impulsiva (impulso, quantidade de movimento e tipos de colisão) e gráficos F×t com a área.
- `FK09b` Colisão, energia e centro de massa: Esquema do dinamômetro com prato e pacote caindo de 45 cm.
- `FK10` Estática: centro de massa, equilíbrio, torque e alavancas: Esquemas de torque com braço de alavanca, tipos de equilíbrio (estável, instável, indiferente) e os três tipos de alavanca.
- `FK11` Densidade e pressão: Esquema de pressão (força, área) e comparação entre massa específica e densidade de um corpo oco.
- `FK11b` Teorema de Stevin, Pascal, Arquimedes e hidrodinâmica: Béquer com pontos de pressão a profundidades diferentes, vasos comunicantes, elevador hidráulico com pistões de áreas A1 e A2 e tubulação com estreitamento (A1, v1, A2, v2).
- `FK12` Termometria, escalas e calor: Mapa mental de Termologia e termômetros nas escalas Fahrenheit, Celsius e Kelvin com ponto de gelo e de vapor.
- `FK13` Dilatação térmica: Esquema das dilatações linear, superficial e volumétrica e gráfico do volume da água entre 0 e 4 °C.
- `FK14` Calorimetria e sistemas termicamente isolados: Quadro de calor sensível e latente e esquema do copo dentro da vasilha com água.
- `FK15` Mudanças de estado físico: Diagrama das mudanças de estado (fusão, solidificação, vaporização, liquefação, sublimação) entre sólido, líquido e vapor e tabela dos estados.
- `FK15b` Curvas de aquecimento, calor latente e diagrama de estados: Curva de aquecimento da água (−65 °C a acima de 100 °C com patamares A–F), curva de mistura e diagrama de estados P × T com ponto triplo e ponto crítico.
- `FK15c` Processos de transferência de calor: Barra metálica entre água em ebulição e gelo com isolante, panela com correntes de convecção e corte do vaso de Dewar com tampa, plástico, paredes espelhadas e vácuo.
- `FK16` Gases ideais e transformações gasosas: Esquema do efeito estufa (radiação solar, absorção na superfície, infravermelho retido na atmosfera, parte refletida ao espaço) e gráficos P×V, P×T e V×T das transformações.
- `FK17` Termodinâmica: trabalho, energia interna e primeira lei: Diagramas de Clapeyron de cada transformação (isotérmica, isovolumétrica, isobárica, adiabática e cíclica) e o esquema isobárica/isocórica/isotérmica A-B-C.
- `FK18` Segunda lei da termodinâmica e máquinas térmicas: Esquema da máquina térmica (fonte quente, fonte fria, trabalho) e do ciclo de Carnot no diagrama PV.
- `FK19` Introdução à óptica geométrica e princípios: Espectro eletromagnético com comprimentos de onda e frequências da luz visível, esquema de sombra e penumbra, eclipses e câmara escura, e reflexão regular e difusa.
- `FK20` Reflexão da luz e espelhos planos: Esquema das leis da reflexão com normal, raios incidente e refletido, imagem e objeto simétricos, campo visual e associação de espelhos planos.
- `FK21` Espelhos esféricos: equações e sinais: Espelhos côncavo e convexo com raios notáveis e as cinco posições do objeto no côncavo, e quadro de sinais.
- `FK21b` Espelhos esféricos: elementos, raios notáveis e imagens: Calota esférica com centro de curvatura, raio R, ângulo θ e eixo principal; espelho côncavo e convexo com a luz incidente; construção de imagens com raios (1), (2), (3) e (4).
- `FK22` Refração da luz, Snell-Descartes e ângulo limite: Raio refratado com normal, ângulos î e r̂ entre dois meios, reflexão total no ângulo limite, prisma com dispersão e lâmina de faces paralelas.
- `FK23` Lentes esféricas delgadas: Lentes convergente e divergente com raios notáveis e os seis formatos de lente, e as posições do objeto no eixo (A, F, O).
- `FK24` Estudo analítico das lentes e vergência: Quadro de sinais das abscissas e esquema das faces de uma lente com R1 e R2.
- `FK25` Instrumentos ópticos e óptica da visão: Esquemas do olho humano com as estruturas nomeadas, das imagens no olho hipermetrope e míope, da lupa, do microscópio composto, da luneta e da máquina fotográfica.
- `FK26` MHS: massa-mola, pêndulo e equações: Sistemas massa-mola e pêndulo com amplitude marcada, gráfico das energias no MHS e o MCU projetado.
- `FK27` Ondas: classificação e ondas periódicas: Mapa mental de Ondas e onda com crista, vale, amplitude e comprimento de onda.
- `FK28` Fenômenos ondulatórios, interferência e ondas estacionárias: Esquemas de interferência construtiva e destrutiva, do experimento de dupla fenda de Young e da onda estacionária com nós, ventres e fuso.
- `FK29` Acústica: som, fenômenos acústicos, Doppler e tubos: Onda sonora longitudinal com compressões e rarefações, faixas de frequência (infra, audível, ultra), ouvido humano, Doppler com fonte e observador e padrões de tubos aberto e fechado.
- `FK29b` Nível sonoro e intensidade sonora: Escala de níveis sonoros em decibéis com exemplos de fontes.
- `FK30` Carga elétrica, processos de eletrização e lei de Coulomb: Mapa mental de Eletrostática e esquemas das três eletrizações (atrito, contato, indução com aterramento), e da força de Coulomb entre cargas.
- `FK31` Campo elétrico, potencial e trabalho da força elétrica: Linhas de força e equipotenciais de uma carga puntiforme, campo uniforme entre placas paralelas, distribuição de carga com poder das pontas e condutor com E e V dentro, na superfície e fora.
- `FK32` Esfera condutora, campo uniforme e movimento de cargas: Gráficos de E × d e de V × d de uma esfera condutora, esfera eletrizada com cargas na superfície e gaiola de Faraday.
- `FK33` Corrente elétrica, potência e energia: Mapa mental de Eletrodinâmica, esquema de condutor com elétrons em deriva (sentido real e convencional) e gráfico i × t com a área.
- `FK34` Resistores, leis de Ohm e associações: Esquemas de associação em série e paralelo, gráfico U × i do condutor ôhmico, ponte de Wheatstone e ponte de fio, e circuito com lâmpada em curto-circuito.
- `FK35` Geradores, receptores, Kirchhoff, medidores e capacitores: Símbolos e curvas características de resistor, gerador e receptor, circuito de duas malhas com nós e ramos, amperímetro em série e voltímetro em paralelo, e associações de capacitores.
- `FK36` Magnetismo, ímãs e campo magnético terrestre: Mapa mental de Eletromagnetismo, ímãs com linhas de indução, atração e repulsão, partição de ímã, domínios magnéticos e campo magnético terrestre com auroras.
- `FK37` Campo magnético de correntes e força magnética: Regra da mão direita em fio, espira e solenoide, regra da mão esquerda da força magnética, trajetórias retilínea, circular e helicoidal, e dois fios paralelos com forças.
- `FK38` Indução eletromagnética e transformadores: Ímã se aproximando e se afastando de uma espira com sentido da corrente, fluxo atravessando superfície com ângulo θ e transformador com núcleo e enrolamentos.
- `FK39` Análise dimensional e teoria da relatividade: Quadro de dimensões das grandezas fundamentais e esquema do experimento de Michelson-Morley.
- `FK40` Corpo negro, quantização e modelos atômicos: Curvas de emissão do corpo negro em várias temperaturas (3000 a 6000 K), níveis de energia de Bohr com saltos quânticos e espectros de emissão e absorção.
- `FK41` Leis de Kepler e lei da gravitação universal: Elipse com Sol em um foco, periélio, afélio, semieixos maior e menor, áreas varridas e as duas massas m e M com forças de interação.
- `FK42` Campo gravitacional, energia potencial, velocidade de escape e eclipses: Esquema das fases da Lua e do alinhamento Sol, Terra e Lua nos eclipses solar e lunar.

### Química (`qui`) — 58 imagens

- `QK01` Estados físicos, curvas de aquecimento, substância pura e mistura: Diagrama das mudanças de estado com processos endotérmicos e exotérmicos, e as curvas de aquecimento 1 (substância pura) e 2 (mistura) com PF e PE.
- `QK02` Métodos de separação de misturas: Aparelhagens de filtração, decantação com sifão, funil de bromo, centrifugação, destilação simples e destilação fracionada com coluna, e esquema de dissolução fracionada de areia e sal.
- `QK03` Evolução dos modelos atômicos (Dalton, Thomson, Rutherford): Linha do tempo dos modelos (Dalton, Thomson, Rutherford, Bohr) com a ilustração de cada modelo, tabela de partículas, experimento da lâmina de ouro com fonte radioativa, bloco de chumbo e placa fluorescente.
- `QK04` Modelo de Bohr, Sommerfeld e partículas fundamentais: Esquema de absorção e emissão de energia pelo elétron entre níveis, modelo de Rutherford-Bohr e tabela de partículas fundamentais.
- `QK05` Número atômico, massa, íons e semelhanças atômicas: Representação X com A (número de massa) e Z (número atômico) e a carga, e o diagrama átomo neutro, cátion e ânion.
- `QK06` Distribuição eletrônica, números quânticos e regra de Hund: Diagrama de Linus Pauling com as diagonais, quadro de camadas e número máximo de elétrons, e os orbitais s, p, d, f com seus valores de mℓ e as setas de spin.
- `QK07` Organização da tabela periódica e famílias: Tabela periódica completa com símbolo, número atômico e massa, mais mapas de metais/ametais/gases nobres e dos blocos s, p, d, f.
- `QK08` Propriedades periódicas: Cinco tabelas periódicas com setas de variação (raio atômico, energia de ionização, afinidade eletrônica, eletronegatividade, eletropositividade) e as de temperatura de fusão/ebulição e densidade.
- `QK09` Ligações iônica, covalente e metálica; alotropia: Estruturas de Lewis e fórmulas estruturais de O2 e N2, formação de HCl e a nuvem eletrônica do retículo metálico com cátions.
- `QK10` Geometria molecular (VSEPR) e polaridade: Tabela de geometrias com desenho de cada molécula e ângulos, e vetores dipolares somando zero (apolar) ou não (polar).
- `QK11` Forças intermoleculares e propriedades físicas: Fluxograma de classificação (iônica/covalente, polar, F-H O-H N-H) e figuras de dipolo induzido, dipolo permanente, ligação de hidrogênio e íon-dipolo.
- `QK12` Sabões e detergentes: Micela com cauda hidrofóbica e cabeça hidrofílica e a ação de limpeza (adesão, desligamento e emulsão).
- `QK13` Massas, mol e determinação de fórmulas: Fórmula e esquema das conversões entre fórmula molecular, mínima e centesimal, e o cálculo da massa atômica média do cloro.
- `QK14` Leis ponderais e volumétrica; cálculo estequiométrico: Esquemas da lei de Lavoisier, proporção de Proust em duas experiências e proporção em mol, massa, volume e moléculas para N2 + 3H2.
- `QK15` Teoria de Arrhenius, ácidos e bases: Esquemas de condutividade, estruturas de ácidos e bases e o papel tornassol azul e vermelho em meios ácido e básico com pH.
- `QK16` Óxidos e sais: Quadro de óxidos (ácido, básico, anfótero, neutro, duplo, peróxido, superóxido) com exemplos e a tabela de solubilidade de sais por ânion.
- `QK17` Tipos de reação, reatividade e dupla-troca: Setas de reatividade dos metais comuns e nobres e dos ametais, esquemas das reações de síntese, decomposição, simples troca e dupla-troca.
- `QK18` Classificação de soluções, solubilidade e concentrações: Gráfico de curvas de solubilidade (KNO3, NaOH, NaCl) com os pontos x, y, z e os béqueres insaturada, saturada, saturada com corpo de fundo e supersaturada.
- `QK19` Diluição, mistura, titulação e propriedades coligativas: Esquemas de diluição e mistura de soluções, aparelhagem de titulação (bureta, erlenmeyer e suporte), gráfico de PMV × T com ΔTe e a osmose com membrana semipermeável.
- `QK20` Entalpia, reações exo e endotérmicas e fatores que alteram o ΔH: Diagramas de entalpia (caminho da reação) para exotérmica e endotérmica e os diagramas das formas alotrópicas.
- `QK21` Energia de ligação, lei de Hess e entalpia de formação: Esquema do cálculo de energia de ligação da propanona para isopropanol com a tabela de energias de ligação (C=O 745, H-H 436, C-H 413, C-O 358, O-H 463 kJ/mol) e a soma das equações da lei de Hess.
- `QK22` Variáveis de estado, transformações gasosas e Clapeyron: Gráficos P×V, V×T e P×T das transformações isotérmica, isobárica e isocórica, e os quadros de conversão de unidades de volume, temperatura e pressão.
- `QK23` Misturas gasosas, densidade e lei de Graham: Esquemas de pressões parciais e volumes parciais em uma mistura gasosa, as fórmulas de densidade e Graham.
- `QK24` Velocidade das reações, colisões, energia de ativação, catalisador e lei da ação das massas: Gráfico de entalpia versus caminho da reação com Ea direta e inversa, gráfico comparando as curvas com e sem catalisador (Ea sem e com NO), e a teoria das colisões com os choques não frontal, de baixa energia e efetivo de H2 e I2.
- `QK25` Equilíbrio químico, constantes Kc e Kp e Le Chatelier: Gráfico de velocidades direta e inversa se igualando e o quadro de deslocamentos de Le Chatelier com setas.
- `QK26` Equilíbrio iônico: Ka, Kb e lei de Ostwald: Esquema de ionização de HA e C(OH) com as setas de força crescente e a fórmula da lei de Ostwald.
- `QK27` Autoionização da água, pH e pOH: Escala de pH de 0 a 14 com exemplos do cotidiano (ácido estomacal, limão, leite, água pura, bicarbonato, sabão, amônia, soda cáustica).
- `QK28` Hidrólise de sais: Quadro dos quatro tipos de hidrólise com o meio resultante e a fórmula de Kh.
- `QK29` Conceitos de ácido e base: Arrhenius, Brönsted-Lowry, Lewis: Fórmula estrutural da formação do aduto entre NH3 (fornecedor do par) e H+ (receptor), e as setas do par ácido-base conjugado.
- `QK30` Produto de solubilidade (Kps): Esquemas da mistura de soluções com cátion e ânion e as três situações de Qps × Kps (precipitado, saturada, insaturada).
- `QK31` Oxidação, redução e número de oxidação (Nox): Reação de I2 com HNO3 mostrando Nox acima de cada átomo, com setas de oxidação e redução.
- `QK32` Balanceamento por oxirredução: Passo a passo do balanceamento de Br2 + HClO + H2O com os Nox e os ΔNox invertidos.
- `QK33` Pilhas e pilha de Daniell: Esquema completo da pilha de Daniell (zinco, cobre, ponte salina, receptor, fluxo de elétrons e de íons) e o esquema comparando pilha e eletrólise.
- `QK34` Potencial, força eletromotriz, pilhas comuns e corrosão: Visão interna da pilha seca (invólucro, pasta, separador, grafite) e esquema do eletrodo padrão de hidrogênio.
- `QK35` Eletrólise e eletroquímica quantitativa: Esquema de cuba eletrolítica (bateria, íons livres, eletrodos) e de cubas eletrolíticas em série, e a fila de facilidade de descarga.
- `QK36` Emissões radioativas e leis de Soddy: Quadro das emissões (representação, carga, número de massa, poder de penetração) e o esquema de papel, alumínio, chumbo e concreto barrando alfa, beta e gama.
- `QK37` Fissão, fusão, usinas e bomba atômica: Esquema do reator nuclear com circuitos, barras de controle, turbina e condensador, reação em cadeia da fissão do urânio e esquema simplificado da bomba atômica.
- `QK38` Meia-vida e datação por carbono-14: Gráfico de massa por tempo caindo a m0/2, m0/4, m0/8 e m0/16 a cada meia-vida e o modelo de redução de 50% a cada intervalo.
- `QK39` Introdução: vitalismo, carbono e classificação de carbonos e cadeias: Fórmulas estrutural, condensada e em bastão do mesmo composto com carbonos 1º, 2º, 3º e 4º marcados, e os exemplos de cadeias saturada, insaturada, aberta, fechada, normal, ramificada, homogênea e heterogênea.
- `QK40` Nomenclatura substitutiva e hidrocarbonetos: Quadros de prefixos, infixos e sufixos, esquema das posições da dupla no buteno, e os grupos substituintes (metil, etil, propil, isopropil, butil, sec-butil, terc-butil, isobutil, vinil, fenil, benzil).
- `QK41` Funções orgânicas: grupos e nomenclatura: Quadro de funções orgânicas com grupo funcional, sufixo e exemplo, e as estruturas dos fármacos paracetamol, aspirina, Ketalar e diclofenaco com as funções marcadas.
- `QK42` Caráter ácido-básico de compostos orgânicos: Tabelas de Ka dos ácidos fórmico, acético, propanoico e dos ácidos acético, cloroacético e dicloroacético com suas estruturas.
- `QK43` Recursos orgânicos: petróleo, gás natural, carvão e xisto: Coluna de fracionamento do petróleo com as faixas de temperatura e carbono de cada fração (gases, nafta, gasolina, querosene, diesel, lubrificantes, resíduo).
- `QK44` Biocombustíveis e matriz energética: Esquema de produção de etanol (cana, garapa, melaço, mosto, fermentação, destilação) e esquema de obtenção e uso do biodiesel.
- `QK45` Isomeria plana (função, cadeia, posição, metameria, tautomeria): Quadro de isomeria plana com as estruturas de etanol/éter, enol/cetona, pentano/2-metilbutano, butanol de posição e as aminas ou éteres de metameria.
- `QK46` Isomeria espacial: geométrica e óptica: Pares cis e trans-1,2-dicloroeteno, o carbono quiral com os quatro ligantes diferentes, par de enantiômeros diante do espelho (estruturas não sobreponíveis) e o esquema do polarímetro.
- `QK47` Cisão de ligações e substituição em alcanos: Esquema das cisões homolítica e heterolítica e as equações de cloração do metano e do propano com as porcentagens de 2-cloropropano e 1-cloropropano.
- `QK48` Substituição em aromáticos e grupos dirigentes: Equações de halogenação, nitração, sulfonação, alquilação e acilação do benzeno e os dois quadros de grupos orto-para e meta dirigentes.
- `QK49` Substituição em haletos, álcoois e grupos acila (esterificação e hidrólise): Equações de substituição do Cl por OH no 2-cloropropano, da OH por Cl no álcool, de esterificação, de hidrólise ácida e básica e de transesterificação.
- `QK50` Reações de adição: Equações de hidrogenação do eteno e do etino, halogenação do eteno, adição de HCl e HBr (com e sem peróxido), hidratação do eteno, adição em dieno, hidrogenação de aldeído e cetona, reação de Grignard e ciclopropano/ciclobutano versus ciclopentano/ciclo-hexano.
- `QK51` Oxidação de compostos orgânicos: Equações de oxidação do etanol e do propan-2-ol, ozonólise do 2-metilpent-2-eno, oxidação do tolueno e do etilbenzeno e esquemas de oxidação branda e energética de alceno e alcino.
- `QK52` Reações de eliminação: Equações de eliminação de HCl do 2-cloropropano, de HBr do 2-bromobutano e de desidratação intramolecular do etanol.
- `QK53` Reações de redução: Equações de redução de aldeído, cetona, ácido, nitrobenzeno, propanonitrila e etanamida e o esquema o-hidroquinona (branca) para o-benzoquinona (escura).
- `QK54` Classificação e polímeros de adição: Reações de formação de PE, PP, PVC, teflon, PS, PVA, poliacrilonitrila, poli(cianoacrilato), borracha natural e SBR, e esquemas de homopolímero e copolímero.
- `QK55` Polímeros de condensação: Reações de formação de PET, PLA, náilon-6,6 e Kevlar com monômeros e fórmula estrutural do polímero.
- `QK56` Aminoácidos, ligação peptídica e proteínas: Fórmula do α-aminoácido, zwitterion, formação da ligação peptídica, hélice alfa e folha beta e proteína nativa versus desnaturada.
- `QK57` Lipídeos: ácidos graxos, triacilgliceróis e fosfolipídeos: Reação de glicerol com três ácidos graxos formando triacilglicerol e a estrutura do fosfolipídeo com cabeça fosfato hidrofílica.
- `QK58` Carboidratos: monossacarídeos, dissacarídeos e polissacarídeos: Estruturas da D-glicose (aldose) e D-frutose (cetose) abertas e cíclicas (α e β-glicopiranose), formação da sacarose com ligação glicosídica e os trechos de amido, glicogênio e celulose.

### Geografia (`geo`) — 45 imagens

- `GK01` Origens da Geografia: clássica, determinismo, possibilismo e Geografia crítica: Fotos de Ratzel, Vidal de la Blache e Milton Santos e um quadro comparando Geografia clássica, determinismo, possibilismo e Geografia crítica.
- `GK02` Linguagem geográfica, espaço vivido e cidadania: Imagem de satélite de Manaus mostrando o contraste entre a cidade e a Floresta Amazônica.
- `GK03` Escala, coordenadas, meridianos e paralelos: Esquema de paralelos (latitude) e meridianos (longitude) com Equador, Greenwich, Norte, Sul, Leste e Oeste.
- `GK04` Projeções cartográficas, tipos de mapa e elementos do mapa: Mapa-múndi nas projeções de Mercator e de Peters lado a lado e um mapa com título, escala numérica e gráfica, legenda, orientação e projeção.
- `GK05` Tecnologias na representação espacial: Esquema de camadas de informação espacial (rede viária, edificações, vegetação) integradas em um SIG.
- `GK06` Estrutura da Terra, placas tectônicas e forças endógenas: Esquema da estrutura interna da Terra (núcleo, manto, astenosfera, crosta, litosfera, sial e sima), dobramentos (anticlinal e sinclinal) e tipos de falha (normal, lateral, horst e graben).
- `GK07` Forças exógenas, ciclo das rochas e riscos naturais: Esquema do ciclo das rochas, tipos de falha tectônica e o mapa dos escudos cristalinos nos continentes (questão Unicamp).
- `GK08` Relevo do Brasil (classificação de Jurandyr Ross): Mapa do relevo do Brasil segundo Jurandyr Ross com os 28 compartimentos numerados (planaltos, depressões e planícies) e fotos de cada tipo.
- `GK09` Clima: elementos, fatores e tipos de chuva: Mapa das correntes marítimas quentes e frias e foto de nuvens densas sobre São Paulo indicando chuva convectiva.
- `GK10` Zonas climáticas, climas e vegetação: Mapas do mundo de climas e de vegetação original com legenda completa.
- `GK11` Mudanças climáticas, efeito estufa e ilhas de calor: Gráfico do aquecimento global com concentração de gases de efeito estufa e esquema de ilha de calor em perfil urbano e rural.
- `GK12` Hidrografia, bacias hidrográficas e aquíferos: Mapa do Brasil com as regiões hidrográficas e esquema do ciclo da água com nascentes e aquíferos.
- `GK13` Questões ambientais contemporâneas: escasseamento, crise hídrica e poluição: Esquema do ciclo da eutrofização e fotos de desmatamento, microplástico e poluição de rio.
- `GK14` Biomas brasileiros, desmatamento e políticas ambientais: Gráfico da queda da vegetação nativa no Brasil de 1985 a 2024 e mapa dos biomas brasileiros com as porcentagens remanescentes.
- `GK15` Revoluções industriais e modelos industriais: Linha do tempo das quatro revoluções industriais e esquemas de linha de montagem (fordismo) e de produção just in time (toyotismo).
- `GK16` Urbanização, metropolização e segregação socioespacial: Mapa de uma metrópole conurbada e gráfico da taxa de urbanização mundial.
- `GK17` Estrutura fundiária, relações de trabalho e reforma agrária: Gráfico de barras da estrutura fundiária do Brasil em 2019 (número de imóveis e área por faixa de hectares).
- `GK18` Modelos agrícolas: intensivo, extensivo, familiar, agroecologia e agronegócio: Cartaz da FAO sobre agroecologia (questão Famerp) e comparativo entre agricultura familiar, agroecologia e agronegócio.
- `GK19` Capitalismo, territorialidades e divisão territorial do trabalho: Esquema da antiga DIT: economias industrializadas trocando produtos industrializados por minérios, alimentos e matérias-primas das economias primário-exportadoras.
- `GK20` Serviços, globalização, financeirização e nova divisão internacional do trabalho: Mapa de uma cadeia global de valor com etapas da produção em diferentes países e gráfico do peso dos serviços na economia.
- `GK21` Trabalho, neoliberalismo, informalidade e gig economy: Infográfico da gig economy: definição, contextos (política, tecnologia, social, econômico, cultural) e críticas.
- `GK22` Conceitos fundamentais da Geografia: espaço, território, paisagem, lugar e região: Esquema com os cinco conceitos (espaço, território, paisagem, lugar, região) e fotos que ilustram cada um.
- `GK23` Dinâmicas populacionais: crescimento, estrutura etária e políticas demográficas: Pirâmides etárias de país desenvolvido e em desenvolvimento e gráfico de crescimento vegetativo.
- `GK24` Migrações, refugiados, políticas anti-imigratórias e xenofobia: Foto de civis em fuga de conflito na fronteira Tailândia-Camboja e mapa de fluxos migratórios.
- `GK25` Transição demográfica e transformações populacionais: Gráfico da transição demográfica (natalidade, mortalidade e crescimento) e pirâmides etárias do Brasil 1950 e 2022.
- `GK26` Cultura, identidades e territórios de povos tradicionais: Mapa do Brasil: reservas e terras indígenas em 2022, por fase do processo administrativo (IBGE).
- `GK27` Direito à cidade, macrocefalia urbana, habitação e mobilidade: Mapa de megacidades e cidades globais e foto de conjunto habitacional popular em Belém (PA).
- `GK28` Formação histórica do território brasileiro: Mapa histórico da ocupação do território brasileiro (litoral, bandeiras, ferrovias do café, rodovias e Brasília).
- `GK29` Regionalizações do Brasil, desigualdades regionais e políticas de desenvolvimento: Mapas lado a lado: regiões do IBGE (cinco), geoeconômicas de Geiger (três) e os quatro Brasis de Milton Santos.
- `GK30` Industrialização, urbanização, desindustrialização e desconcentração no Brasil: Gráfico da evolução da população rural e urbana do Brasil (1950–2020) e mapa do eixo industrial São Paulo-Rio-Belo Horizonte.
- `GK31` Agropecuária, mineração e extrativismo no Brasil: Mapa das áreas de mineração (quadrilátero ferrífero, Carajás, Trombetas) e fronteira agrícola do Brasil.
- `GK32` Questões ambientais no Brasil: desmatamento e crises hídricas: Mapa do desmatamento na fronteira agrícola e esquema de como o desmatamento reduz chuva e infiltração.
- `GK33` Políticas ambientais e populações tradicionais no Brasil: Mapa do Brasil com unidades de conservação, terras indígenas e territórios quilombolas.
- `GK34` Colonialismo, imperialismo e guerras mundiais: Mapa da partilha da África e da Ásia no século XIX e do mundo bipolar após Yalta e Potsdam.
- `GK35` Guerra Fria, nova ordem mundial e multipolaridade: Mapa dos blocos da Guerra Fria (OTAN e Pacto de Varsóvia) e dos blocos econômicos atuais.
- `GK36` Ascensão da China e a nova ordem global: Mapa da Nova Rota da Seda (ferrovias, rota marítima, cinturão econômico) e mapa do comércio EUA-China em 1980 e 2018.
- `GK37` Conflitos contemporâneos: disputas territoriais, étnicas e religiosas: Mapa dos conflitos contemporâneos (Ucrânia, Geórgia, Oriente Médio, Sahel, Essequibo).
- `GK38` Terrorismo, guerra ao terror, intervenções e refugiados: Mapa dos grupos extremistas por região e dos fluxos de refugiados.
- `GK39` Geopolítica da energia e dos recursos naturais: Mapa mundial das reservas de petróleo, gás, terras raras e lítio.
- `GK40` Geopolítica ambiental e climática e justiça climática: Linha do tempo dos marcos ambientais (Estocolmo 1972, Montreal 1987, IPCC 1988, ECO-92, Kyoto 1997, Paris 2015).
- `GK41` Funções urbanas predominantes: Quadro com as seis funções urbanas e um exemplo de cidade para cada uma.
- `GK42` Redes urbanas, hierarquia, conurbação, metropolização, megacidades e cidades globais: Mapa das cidades globais (Nova York, Londres, Tóquio) e das megacidades; esquema de conurbação entre municípios.
- `GK43` Desconcentração urbana e cidades médias: Gráfico comparando o crescimento de cidades médias e de metrópoles.
- `GK44` Transportes e infraestruturas: modais: Quadro comparativo dos quatro modais (custo, distância ideal, flexibilidade, impacto ambiental).
- `GK45` Tecnologia, ciberespaço, exclusão digital, plataformização e algoritmização: Linha do tempo da internet (1980 a 2010) e esquema do fluxo de dados entre usuários, plataformas e algoritmos.

### História (`his`) — 57 imagens

- `HK01` A ciência histórica e a periodização: Linha do tempo com os cinco períodos da periodização tradicional.
- `HK02` Pré-História e origens humanas: Paleolítico e Neolítico: Crânios de Homo sapiens e neandertal; mapa da dispersão humana a partir da África.
- `HK03` Povos do Oriente Médio e do Norte da África: Mapa do Crescente Fértil com Mesopotâmia, Egito, Anatólia, Palestina, Assíria e rios Tigre, Eufrates, Nilo e Jordão.
- `HK04` Grécia antiga: períodos, pólis, Atenas e Esparta: Mapa da Grécia antiga e quadro dos cinco períodos.
- `HK05` Roma antiga: Monarquia, República e Império: Esquema da cidadania romana, mapa da expansão romana na República e linha do tempo da Monarquia ao Império.
- `HK06` Crise de Roma, cristianismo e queda do Império do Ocidente: Mapa do Império Romano do Ocidente e do Oriente em 395 d.C. com as migrações bárbaras e estátua de Constantino.
- `HK07` O mundo islâmico medieval: Foto da grande mesquita de Córdoba (século X) e mapa da expansão do Império Islâmico.
- `HK08` Império Bizantino (Império Romano do Oriente): Mapa do Império Bizantino no século VI (conquistas de Justiniano) e foto da Basílica de Santa Sofia.
- `HK09` Alta Idade Média: Império Franco, merovíngios e carolíngios: Iluminura da coroação de Carlos Magno e mapa da divisão do Império Carolíngio no Tratado de Verdun.
- `HK10` Feudalismo: características e apogeu (séculos IX–XI): Esquema da pirâmide feudal e calendário agrícola do século XV.
- `HK11` Baixa Idade Média (séculos XI–XIII): Cruzadas e renascimentos comercial e urbano: Mapa das rotas das Cruzadas e esquema de cidades, feiras e Liga Hanseática.
- `HK12` Crise do mundo medieval (séculos XIV–XV): peste e guerras: Afresco O triunfo da morte (Clusone, século XV) e mapa da disseminação da peste na Europa.
- `HK13` Passagem da Idade Média à Época Moderna e Renascimento: Davi de Michelangelo e A Escola de Atenas de Rafael.
- `HK14` Reforma Protestante e Contrarreforma: Retratos de Lutero e Calvino e mapa da Europa religiosa.
- `HK15` Absolutismo monárquico e monarquias francesa e inglesa: Capa do Leviatã de Hobbes (1651) e quadro comparativo das monarquias francesa e inglesa.
- `HK16` Reconquista, Revolução de Avis e formação dos reinos ibéricos: Mapa da Reconquista (séculos X a XV) e retrato dos reis católicos.
- `HK17` Mercantilismo e expansão marítima: Mapa das rotas das grandes navegações portuguesas e espanholas.
- `HK18` Primeiras navegações e povos nativos da América: Capa do Códice Mendoza e foto de um quipo; mapa dos povos nativos da América.
- `HK19` Conquista e estabelecimento das colônias espanholas: Códice Lienzo de Tlaxcala e pintura de castas coloniais (Do espanhol e da Índia, mestiça).
- `HK20` Início da colonização, capitanias hereditárias, câmaras e governo-geral: Mapa das capitanias hereditárias (Luís Teixeira, século XVI) e quadro do sistema colonial.
- `HK21` União Ibérica e Brasil holandês: Pintura Engenho (Frans Post, 1661) e Alegoria da Santa Aliança de El Greco (Filipe II).
- `HK22` Restauração portuguesa, crise do açúcar, interiorização e bandeiras: Estátua de Borba Gato (São Paulo) e mapa das bandeiras e da expansão da pecuária.
- `HK23` Economia e sociedade mineradora e revoltas nativistas: Igreja de São Francisco de Assis (Ouro Preto) e esquema de quinto, Casas de Fundição e derrama.
- `HK24` Reformas pombalinas e esgotamento da economia colonial: Gravura do terremoto de Lisboa (1755) e Praça Tiradentes em Ouro Preto.
- `HK25` Revoltas emancipacionistas: Inconfidência Mineira e Conjuração Baiana: Tiradentes esquartejado (Pedro Américo, 1893) e hospício da Piedade (Rugendas), local da execução na Bahia.
- `HK26` Independências na América espanhola: Retábulo da Independência do México (O'Gorman) e mapa das independências sul-americanas com Bolívar, San Martín e O'Higgins.
- `HK27` Independência da América portuguesa: Governo Joanino e Dia do Fico: Pintura Independência ou Morte (Pedro Américo) e gravura do embarque da família real para o Brasil.
- `HK28` Revolução Industrial: Gravura de 1835 de teares mecânicos e linha do tempo das conquistas trabalhistas.
- `HK29` Iluminismo e despotismo esclarecido: Frontispício da Enciclopédia e pintura da mesa redonda de Frederico II.
- `HK30` Independência das Treze Colônias: Gravura Os bostonianos pagando impostos (Dawe, 1774) e quadro comparativo Norte × Sul das Treze Colônias.
- `HK31` Revolução Haitiana: Batalha de São Domingos (Suchodolski) e retrato de Toussaint Louverture.
- `HK32` Revolução Francesa: Antigo Regime, Constituinte, Convenção e Diretório: Gravura da morte de Luís XVI na guilhotina e quadro das três fases da Revolução.
- `HK33` Era napoleônica e Congresso de Viena: Mapa do Império Napoleônico em 1812 e pintura Napoleão entronizado (Ingres).
- `HK34` Expansão para o Oeste, Guerra de Secessão e imperialismo estadunidense: Mapa da expansão dos EUA para o Oeste nos séculos XVIII e XIX e quadro Norte × Sul na Guerra de Secessão.
- `HK35` Primeiro Reinado: Constituição de 1824 e crise do governo de D. Pedro I: Pintura A execução de Frei Caneca e quadro dos quatro poderes da Constituição de 1824.
- `HK36` Período Regencial e Golpe da Maioridade: Mapa das revoltas regenciais e retrato de Dom Pedro de Alcântara (1830).
- `HK37` Segundo Reinado: política, economia, Guerra do Paraguai, abolição e crise: Esquema do Segundo Reinado e linha do tempo das leis abolicionistas (1850, 1871, 1885, 1888).
- `HK38` O longo século XIX: ideias, reorganização da Europa e Segunda Revolução Industrial: Mapa mental do longo século XIX (ideias, política e imperialismo).
- `HK39` Imperialismo na África e na Ásia: Mapa da partilha da África após a Conferência de Berlim e pintura de oficial da Companhia das Índias Orientais.
- `HK40` República da Espada e República Oligárquica: Mapa mental da Primeira República (política, economia, revoltas) e linha do tempo das revoltas.
- `HK41` Primeira Guerra Mundial: causas: Mapa dos povos e etnias do Império Austro-Húngaro no século XIX e foto das ruas de Sarajevo após o atentado.
- `HK42` Primeira Guerra Mundial: a guerra e suas consequências: Foto de trincheira no rio Somme (1916) e cartaz de recrutamento dos EUA (1917).
- `HK43` Rússia antes da Revolução e Revolução Russa de 1917: Desenho do Domingo Sangrento (1905) e fotografia de Lênin discursando em Moscou (1920).
- `HK44` Stalinismo e União Soviética até a Segunda Guerra: Fotos de Trótski (1921) e Stálin (1937) e pintura realista socialista (Mashkov, 1930).
- `HK45` Governo Provisório e Governo Constitucional (1930–1937): Quadro comparativo AIB × ANL e linha do tempo de 1930 a 1937.
- `HK46` Ditadura do Estado Novo (1937–1945): Propaganda do Estado Novo (1937) e quadro dos partidos de 1945.
- `HK47` Entreguerras: Versalhes, crise de 1929, fascismo e Eixo: Mapa mental do entreguerras: Versalhes, Revolução Russa, crise de 1929, fascismos e Eixo.
- `HK48` Ascensão do nazifascismo: Foto de cerimônia fascista com crianças em Roma (1942) e linha do tempo da ascensão de Hitler (1919 a 1934).
- `HK49` Segunda Guerra Mundial: fases, fim e ordem do pós-guerra: Cogumelo da bomba de Hiroshima (1945), soldados soviéticos em Stalingrado (1943) e mapa das frentes da guerra.
- `HK50` Guerra Fria: tensões, guerras e fim: Mapa mental da Guerra Fria e linha do tempo de 1945 a 1991.
- `HK51` Populismo na América Latina: Argentina e México: Fotos de Perón e Evita (1955), de Lázaro Cárdenas (1937) e de Carmen Miranda (1941).
- `HK52` Dutra e o segundo governo Vargas: Selo da criação da Petrobras com Vargas e foto de Carlos Lacerda (1954).
- `HK53` JK, Jânio Quadros, João Goulart e o golpe de 1964: Condecoração de Che Guevara por Jânio (1961) e marcha da família, São Paulo (1964).
- `HK54` Ditaduras na América Latina e ditadura militar no Brasil: Mapa das ditaduras latino-americanas e linha do tempo da ditadura brasileira (1964, AI-2, AI-5, anistia, Diretas Já).
- `HK55` Nova República: Sarney, Collor, Itamar e FHC: Caras-pintadas em Brasília (1992) e linha do tempo dos planos econômicos (Cruzado, Collor, Real).
- `HK56` Governos Lula, Dilma, Temer e Bolsonaro: Foto das manifestações de junho de 2013 e linha do tempo das eleições de 2002 a 2022.
- `HK57` América Latina no século XXI: neoliberalismo e mudanças sociopolíticas: Passeata de estudantes chilenos por educação (Santiago, 2012) e mapa político da América Latina.

### Filosofia e Sociologia (`fs`) — 86 imagens

- `FK01` Definição de filosofia: Platão (O banquete) e Aristóteles: Escultura O pensador (Rodin, 1904) e esquema da ascensão do conhecimento em Platão.
- `FK02` Do mito à filosofia: contexto, mito e logos: Foto da Acrópole de Atenas e do Monte Olimpo e quadro comparativo mito x filosofia.
- `FK03` Filósofos pré-socráticos e o arché: Tabela dos pré-socráticos com escola, arché e explicação; retrato de Tales de Mileto.
- `FK04` Democracia ateniense: contexto, instituições e limites: Esquema das instituições (Eclésia, Boulé e Helieia) e ruínas do teatro de Mileto.
- `FK05` Os sofistas: retórica, relativismo e críticas: Busto de Górgias (Siracusa) e quadro Protágoras x Górgias.
- `FK06` Sócrates: método socrático, ideias e condenação: Pinturas A morte de Sócrates (David, 1787) e Discurso de Sócrates (Lebrun, 1867) e busto de Sócrates (Louvre).
- `FK07` Platão: contexto social, político e filosófico: Busto de Platão (Museu Capitolino) e esquema das influências sobre Platão.
- `FK08` Teoria das ideias, alegoria da caverna e Demiurgo: Ilustração da alegoria da caverna e esquema da teoria das ideias (mundo sensível x mundo inteligível).
- `FK09` Pensamento político de Platão: A República, classes e justiça: Esquema das três classes da República e das três partes da alma (razão, vontade e desejo).
- `FK10` Aristóteles: relação com Platão, quatro causas, hilemorfismo, ato e potência: Detalhe de A Escola de Atenas (Rafael) com Platão apontando para o alto e Aristóteles com a palma para baixo; esquema das quatro causas da estátua.
- `FK11` Ética aristotélica: eudaimonia, virtude e justo meio: Esquema do justo meio (coragem entre covardia e imprudência).
- `FK12` Política aristotélica: formas de governo, justiça e zoon politikon: Tabela das formas de governo de Aristóteles (número de governantes x forma justa e corrompida) e balança em equilíbrio, símbolo da justiça.
- `FK13` Período helenístico e epicurismo: Mosaico de Alexandre (detalhe, c. 120 a.C., Nápoles) e busto de Epicuro.
- `FK14` Estoicismo: Busto de bronze de Marco Aurélio (séc. II d.C.) e esquema comparando epicurismo e estoicismo.
- `FK15` Ceticismo, outras escolas helenísticas e legado: Esquema das escolas helenísticas (epicurismo, estoicismo, ceticismo, cinismo) com os fundadores.
- `FK16` Patrística e Santo Agostinho: Imagem de Santo Agostinho em seu estúdio (Botticelli, Uffizi).
- `FK17` Escolástica e Tomás de Aquino: Ilustração medieval de Santo Tomás de Aquino (séc. XIII) e esquema das cinco vias.
- `FK18` Filosofia do Renascimento e Humanismo (Erasmo e Thomas More): Afresco A Trindade (Masaccio, c.1427), com perspectiva, e estátua de Leonardo da Vinci como exemplo de polímata.
- `FK19` Maquiavel e o realismo político: Retrato de Maquiavel (Santi di Tito, séc. XVI).
- `FK20` Revolução Científica: Copérnico, Kepler e Galileu: Pinturas O astrônomo Copérnico (Matejko, 1873) e Galileu perante a Inquisição Romana (Banti, 1857).
- `FK21` Racionalismo e Descartes: Retrato de René Descartes (Frans Hals, c.1649, Louvre).
- `FK22` Empirismo: Locke, Berkeley e Hume: Retratos de Locke e esquema de qualidades primárias e secundárias.
- `FK23` Kant: criticismo, revolução copernicana e conhecimento: Retrato de Kant e esquema fenômeno x númeno.
- `FK24` Quadro comparativo: racionalismo, empirismo e criticismo: Quadro de três colunas (racionalismo, empirismo, criticismo) com fundamentos, método, crítica e influência.
- `FK25` Ética kantiana: deontologia e imperativo categórico: Quadro de teorias éticas modernas (deontológica x utilitarismo).
- `FK26` Utilitarismo: Bentham e Stuart Mill: Retrato de Jeremy Bentham (Pickersgill, 1829) e quadro Kant x utilitarismo.
- `FK27` Contratualismo: Hobbes, Locke e Rousseau: Retrato de Thomas Hobbes (Wright, c.1669) e esquema comparando os três contratualistas.
- `FK28` Hegel e Marx: idealismo e materialismo: Retrato de Hegel (Schlesinger, 1831) e esquema da dialética (tese, antítese, síntese).
- `FK29` Schopenhauer, Kierkegaard, Nietzsche e crítica à razão: Esboço de Kierkegaard (c.1840), fotografia de Nietzsche (c.1875) e de Schopenhauer (1852).
- `FK30` Filosofia da linguagem: Frege, Russell e Wittgenstein: Retrato de Bertrand Russell (1936) e esquema das duas fases de Wittgenstein.
- `FK31` Popper: falsificabilidade e crítica à indução: Imagem de cisne negro entre cisnes brancos ilustrando a refutação.
- `FK32` Kuhn: paradigmas e revoluções científicas, Popper x Kuhn: Retrato de Thomas Kuhn (1973) e esquema do ciclo ciência normal, crise, revolução.
- `FK33` Mapa mental: Popper e Kuhn (resumo): Mapa mental Filosofia da ciência (Popper e Kuhn), com seus conceitos-chave.
- `FK34` Escola de Frankfurt: indústria cultural, razão instrumental e Benjamin: Foto de Theodor Adorno (teoria crítica com Horkheimer) e esquema da indústria cultural.
- `FK35` Existencialismo: Sartre, Heidegger e Camus: Fotos de Sartre, Heidegger e Camus e quadro dos existencialismos.
- `FK36` Rawls (liberalismo igualitário) e Nozick (libertarianismo): Esquema comparando Rawls e Nozick.
- `FK37` Habermas, Hans Jonas e Peter Singer: Quadro de Habermas, Jonas e Singer com ideias centrais.
- `FK38` Inteligência artificial: Turing e Searle: Cartaz do filme O jogo da imitação e esquema da Sala Chinesa.
- `SK01` Surgimento da Sociologia, fundadores e senso comum x conhecimento sociológico: Retratos de Auguste Comte e Émile Durkheim; de Karl Marx e Max Weber.
- `SK02` Métodos e técnicas de pesquisa sociológica: Quadro dos métodos (quantitativo, qualitativo) e das quatro técnicas de pesquisa.
- `SK03` Estrutura social: status, papel, grupo e interação social: Quadro com status, papel social, grupo social e os quatro tipos de interação.
- `SK04` Influências sobre a Sociologia: Comte, Darwin e Spencer (evolucionismo social): Esquema das influências: Comte, Darwin e Spencer sobre a Sociologia.
- `SK05` Cultura: conceito, cultura material e imaterial: Fotos do Largo do Pelourinho (Salvador) e do queijo da Canastra.
- `SK06` Normas e valores culturais, coesão e controle social: Quadro de normas formais e informais, com exemplos.
- `SK07` Patrimonialização da cultura: Foto da Festa do Divino Espírito Santo, em Paraty (RJ).
- `SK08` Religião, sagrado e profano, secularização e retorno das religiões: Foto da Marcha para Jesus (São Paulo, 2024), exemplo de religião convivendo com a secularização.
- `SK09` Instituições sociais e a família: Quadro de configurações familiares e foto de família judaica em rito de bênção.
- `SK10` A escola como instituição social: Foto de sala de aula com recursos tecnológicos e de família de três gerações (avó, mãe e filho).
- `SK11` Estratificação social: casta, estamento e classe social: Foto de sacerdotes em ritual no rio Ganges (Varanasi, 2020) e gravura A fortaleza da fé (Lacroix, 1873) mostrando o caráter estamental.
- `SK12` Teorias da desigualdade: Marx, Weber e Bourdieu: Quadro Marx, Weber e Bourdieu (autor, conceitos, ideia central).
- `SK13` Pobreza, desigualdade no Brasil e criminalidade: Foto do contraste entre o Aglomerado da Serra e o bairro Horto (Belo Horizonte, 2021) e quadro de dimensões da desigualdade.
- `SK14` Desvio e controle social: Becker, Foucault e Goffman: Retratos de Foucault, Goffman e Becker e projeto do panóptico em Cuba.
- `SK15` Estado moderno, soberania e Estado de direito; tipos de Estado: Foto da reunião do Conselho de Segurança da ONU (Nova York, 2024) e mapa mental do Estado moderno.
- `SK16` Modelos de democracia: direta, representativa e participativa: Quadro dos três modelos de democracia, com exemplos.
- `SK17` Divisão de poderes, Montesquieu e freios e contrapesos: Foto do Congresso Nacional (Brasília, DF) com duas câmaras e esquema dos três poderes.
- `SK18` Desafios da democracia no Brasil: representatividade, corrupção, redes sociais e desigualdade: Mapa mental dos desafios da democracia (crise de confiança, redes sociais, desigualdade).
- `SK19` Poder, dominação e poder nas instituições: Foto simbolizando o poder da mídia sobre a opinião pública e esquema do poder nas instituições.
- `SK20` Poder em Weber, Foucault e Bourdieu: Quadros dos três tipos de dominação de Weber, das três formas de poder de Foucault e das três dimensões de Bourdieu.
- `SK21` Estudos contemporâneos sobre o poder: necropolítica e psicopolítica: Fotos de Achille Mbembe (2021) e Byung-Chul Han (2019).
- `SK22` Positivismo: lei dos três estados, hierarquia das ciências e funcionalismo: Esquema da hierarquia das ciências de Comte (da Matemática à Sociologia) e dos três estados.
- `SK23` Durkheim: método, fato social, anomia, suicídio e solidariedade: Capas dos livros As regras do método sociológico (1895) e O suicídio (1897).
- `SK24` Weber: sociologia compreensiva, ação social e tipos ideais: Quadro dos quatro tipos de ação social e foto de modelo representando a professora como tipo ideal.
- `SK25` Weber: dominação, estratificação, racionalização e ética protestante: Quadro dos três tipos de dominação com exemplos.
- `SK26` Marx: origens e materialismo histórico-dialético: Pintura A Liberdade guiando o povo (Delacroix, 1830).
- `SK27` Marx: valor-trabalho, mais-valia, alienação, ideologia, revolução e religião: Capas dos livros de O capital (1867) e esquema da mais-valia com os valores do exemplo.
- `SK28` Apropriações da obra de Marx no século XX: Linha do tempo das revoluções socialistas (1917, 1949, 1959).
- `SK29` Quadro-resumo: Durkheim, Weber e Marx: Mapa mental Teorias clássicas (Durkheim, Weber e Marx) com os conceitos de cada um.
- `SK30` Antropologia, etnologia, evolucionismo, universalismo, Tylor e Morgan: Esquema dos três estágios de Tylor (selvageria, barbárie, civilização).
- `SK31` Boas, Malinowski, Mauss e Lévi-Strauss: críticas ao evolucionismo: Foto de Malinowski com nativos das Ilhas Trobriand (1917–1918) e quadro dos autores da Antropologia.
- `SK32` Sociologia acadêmica no Brasil: Foto de uma das primeiras universidades brasileiras ou de um centro de pesquisa social.
- `SK33` Intérpretes do Brasil: Gilberto Freyre e Darcy Ribeiro: Capas de Casa-grande & senzala e de O povo brasileiro e retratos de Freyre e Darcy Ribeiro.
- `SK34` Sérgio Buarque de Holanda, DaMatta e Florestan Fernandes: Quadro Autores e contribuições (Buarque: homem cordial; DaMatta: jeitinho brasileiro) e retratos.
- `SK35` Sociologia urbana: Escola de Chicago e Henri Lefebvre: Quadro comparativo Escola de Chicago x Lefebvre (enfoque, método, objetivo, impacto).
- `SK36` Massificação, cultura de massa e Escola de Frankfurt: Esquema da cultura de massa (produção padronizada, consumo, alienação).
- `SK37` Norbert Elias e o processo civilizador: Esquema da evolução do autocontrole ao longo da história.
- `SK38` A questão racial: W. E. B. Du Bois e Angela Davis: Foto da Marcha sobre Washington (1963), do Movimento pelos Direitos Civis.
- `SK39` Ação coletiva e comportamento de massa: Le Bon e Olson: Quadro dos autores da ação coletiva (Le Bon e Olson).
- `SK40` Movimentos sociais: características e tipos: Quadro dos cinco tipos de movimento social, com exemplos.
- `SK41` Teorias dos movimentos sociais: Tilly, Tarrow, Touraine e Castells: Quadro comparativo dos autores (Le Bon, Olson, Tilly, Tarrow) e mapa mental dos movimentos sociais.
- `SK42` Pós-modernidade: conceito e características: Esquema das quatro características da pós-modernidade.
- `SK43` Bauman (modernidade líquida) e Lipovetsky (hipermodernidade): Foto de pessoas em meio ao consumo (compras) ilustrando a sociedade do consumo e identidade.
- `SK44` Pós-verdade e desinformação: Foto do deepfake do Papa Francisco de jaqueta puffer (Midjourney) e esquema dos mecanismos da desinformação.
- `SK45` Globalização: características e mutações no século XXI: Foto de letreiro sobre o Brexit na Estação Central de Glasgow (2019) e mapa da integração econômica global.
- `SK46` Sociedade da informação, Revolução 4.0 e riscos contemporâneos: Esquema da Quarta Revolução Industrial (IA, robótica, biotecnologia) e seus desafios éticos.
- `SK47` Interpretações da globalização: Bauman e Ulrich Beck: Foto dos destroços de uma escola infantil perto da usina de Chernobyl (explosão em 1986).
- `SK48` Mundo do trabalho, globalização e impactos culturais, econômicos e sociais: Mapa mental Mundo do trabalho, globalização e impactos culturais, econômicos e sociais.

### Inglês (`ing`) — 49 imagens

- `I01.1` Tema e ideia principal: Um texto curto em inglês com a frase de tema destacada em cor e um quadro que liga as ideias a uma ideia principal.
- `I01.1b` Passo a passo para resolver uma questão de leitura: Fluxograma com os cinco passos, do enunciado até a eliminação de alternativas.
- `I01.2` Objetivo do texto e público-alvo: Um texto com duas setas, uma para quem escreveu (objetivo) e outra para quem lê (público-alvo), e três verbos de objetivo: informar, convencer, entreter.
- `I01.2b` Como o inglês é cobrado no ENEM e nos vestibulares: Quadro lado a lado: questão no modelo ENEM (texto em inglês, pergunta em português) e questão de vestibular com pergunta em inglês.
- `I01.3` Informação explícita: Um texto curto com um trecho grifado que responde diretamente a uma pergunta, com a seta ligando a pergunta à resposta explícita.
- `I01.3b` Comandos de questão em inglês: Lista de comandos em inglês, cada um ligado ao tipo de pergunta (explícita, inferência, vocabulário, referência).
- `I01.4` Inferência e sentido implícito: Um iceberg: a parte de cima é o que está escrito, a de baixo é o sentido implícito, com setas que levam do texto à inferência.
- `I01.5` Título, fonte e imagem como pista: Uma página com título, fonte e imagem circulados, cada elemento apontando para uma pista sobre o conteúdo antes de ler.
- `I01.6` Opinião, tom e atitude do autor: Um texto com palavras de tom (however, unfortunately, clearly) destacadas e uma escala de tom da crítica ao elogio.
- `I01.7` Anúncio, campanha e cartaz: Um anúncio com slogan, imagem e logo, e setas explicando a intenção do anunciante e o público.
- `I01.8` Tirinha, cartum, charge e meme: Uma tirinha com três quadros e um balão, e as pistas visuais (expressão, ironia) apontadas, com o humor explicado.
- `I01.9` Poema e letra de canção: Um verso de poema com palavras de imagem destacadas e uma pauta musical, mostrando tema, tom e figuras.
- `I01.10` Notícia, opinião e divulgação científica: Três recortes de jornal rotulados notícia (fatos), opinião (ponto de vista) e divulgação científica (explicação de pesquisa).
- `I01.11` Aspectos culturais e interdisciplinares: Um globo com tópicos culturais (festas, música, esporte) e ligações com outras matérias, mostrando um texto sobre cultura.
- `I01.11b` Temas que mais aparecem nos textos da prova: Cinco blocos temáticos, cada um com seis palavras-chave em inglês e a tradução.
- `I01.11c` Inglês como língua global e variedades do inglês: Mapa-múndi destacando países onde o inglês é língua materna, língua oficial ou língua estrangeira estudada.
- `I02.1` Sentido da palavra no contexto e sinônimos: Uma palavra em duas frases com sentidos diferentes, ligada ao significado de cada contexto, e setas para sinônimos.
- `I02.1b` Pares de palavras que a prova confunde: Pares de palavras ligados por uma seta dupla, cada um com um exemplo curto.
- `I02.2` Falsos cognatos: Pares de palavras lado a lado (actually/atualmente, pretend/pretender, push/puxar) com a tradução enganosa riscada e a correta ao lado.
- `I02.2b` Cognatos: as palavras que você já conhece: Parágrafo curto em inglês com os cognatos destacados em cor, mostrando quanto do texto já se entende.
- `I02.2c` Falsos cognatos: lista ampliada: Tabela de três colunas: palavra em inglês, o que parece ser e o que realmente significa.
- `I02.3` Phrasal verbs: Um verbo base mudando de sentido com cada partícula (give up, give in, give away), cada combinação numa pequena cena.
- `I02.4` Expressões idiomáticas e provérbios: Cartas com expressões idiomáticas (it's raining cats and dogs, a piece of cake) e o desenho literal ao lado do sentido real.
- `I02.5` Formação de palavras: prefixos e sufixos: Uma palavra-raiz com prefixos e sufixos formando palavras novas (happy, unhappy, happiness), mostrando como o sentido muda.
- `I02.5b` Prefixos e sufixos: quadro ampliado: Uma palavra-raiz (use) no centro e, em volta, as palavras formadas: useful, useless, user, reuse, misuse, usable.
- `I03.1` Referência pronominal: it, they, this, which: Uma frase com setas curvas ligando it, they, this e which ao termo que cada um retoma, em cores diferentes.
- `I03.1b` Pronomes: sujeito, objeto, possessivos e reflexivos: Tabela de pronomes em cinco colunas (sujeito, objeto, possessivo adjetivo, possessivo pronome, reflexivo), linha por pessoa.
- `I03.2` Conectivos e relações lógicas: Quatro grupos de conectivos (adição, contraste, causa, consequência) em quatro caixas, cada uma com exemplos.
- `I03.2b` Conectivos: quadro ampliado: Quadro de conectivos em seis colunas por relação lógica (adição, contraste, causa, resultado, finalidade, condição).
- `I03.3` Modais e grau de certeza: Uma escala de certeza com modais, must e can't no alto, should e may no meio, might e could embaixo, com exemplos.
- `I03.4` Comparativos, superlativos, intensificadores e quantificadores: Duas torres de tamanhos diferentes com tall, taller, the tallest, e quantificadores (much, many, few, little) em jarros de quantidade.
- `I03.5` Voz passiva: Uma frase ativa virando passiva, com setas que trocam sujeito e objeto e a estrutura be + particípio destacada.
- `I03.6` Discurso direto e indireto: Dois balões de fala viram uma frase reportada, com a mudança de tempo verbal, pronome e advérbio marcada por setas.
- `I03.7` Condicionais e orações relativas: Quatro tipos de condicional (zero, 1º, 2º, 3º) como uma escada de probabilidade, e uma oração relativa com who, which e that.
- `I03.7b` Orações relativas em detalhe: Duas frases quase iguais, com e sem vírgulas, mostrando a mudança de sentido entre restritiva e explicativa.
- `I03.7c` Desejo e hipótese: wish, if only, would rather e had better: Balão de pensamento com 'I wish I had…' ao lado da situação real, mostrando o contraste entre desejo e realidade.
- `I03.8` Classes de palavras: substantivo, adjetivo, pronome e preposição: Uma frase com cada palavra colorida segundo a classe (substantivo, adjetivo, pronome, preposição) e um quadro de funções.
- `I03.8b` Substantivos: plural, contáveis e caso genitivo: Dois quadros: plurais irregulares com desenho (one child, two children) e o 's ligando o dono à coisa.
- `I03.8c` Adjetivos e advérbios: posição, -ed × -ing e frequência: Duas figuras: pessoa entediada (bored) diante de uma aula chata (boring), e uma régua de frequência de never a always.
- `I03.9` Negação e palavras de sentido restritivo: Frases com not, never, hardly e only, a palavra de negação ou restrição destacada, com uma pequena escala de força da negação.
- `I03.9b` Perguntas: palavras interrogativas, ordem e question tags: Esquema da ordem da pergunta em blocos coloridos (interrogativa, auxiliar, sujeito, verbo) com dois exemplos.
- `I04.1` Presente simples e contínuo: Duas cenas, uma rotina diária (presente simples) e uma ação no momento (contínuo), com a marca temporal de cada.
- `I04.1b` Quadro-resumo dos tempos verbais: Linha do tempo (passado, agora, futuro) com os quatro aspectos marcados por pontos, intervalos e setas.
- `I04.2` Passado simples, contínuo e used to: Uma linha do tempo com um passado simples, uma ação em curso interrompida por outra e um hábito antigo (used to).
- `I04.3` Present perfect × simple past: Uma linha do tempo com uma data fixa no passado (simple past) e uma ação ligada ao presente (present perfect), com as palavras-pista.
- `I04.4` Past perfect e sequência de tempos: Uma linha do tempo com duas ações no passado, a primeira em past perfect e a segunda em simple past.
- `I04.5` Futuro: will, going to e presente: Três cenas de futuro, uma decisão na hora (will), um plano já feito (going to) e um horário marcado (presente), com as formas.
- `I04.6` Irregulares, gerúndio e infinitivo: Uma lista de verbos irregulares com as três formas e uma caixa de quando usar gerúndio ou infinitivo.
- `I04.6b` Verbos irregulares mais cobrados: Tabela de verbos irregulares em três colunas (base, passado, particípio), agrupados por padrão de mudança.

