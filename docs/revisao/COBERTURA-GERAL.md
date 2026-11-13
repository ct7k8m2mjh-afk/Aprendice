# Cobertura da Revisão geral (11/11/2026)

Objetivo: todo subtema que tem questão no site (`app/public/conteudo/<m>/banco.json`, campo `sub`) aparece em `subs` de algum tópico de `docs/revisao/<m>/geral.json`.
Regra usada: primeiro ligar o subtema a um tópico que já trata do assunto; se nenhum trata, criar tópico novo no fim do arquivo, só com o que está na fonte aprovada indicada.
Tópicos novos: imagem em construção (`falta_imagem: true`, aviso "EM CONSTRUÇÃO... (o que será colocado: …)"), fórmulas em LaTeX com `\frac`.

## Biologia (`bio/geral.json`)

Ligados a tópico existente:
- B05.1, B05.2, B05.3 → BK06 "Ácidos nucleicos e código genético" (já trata estrutura e replicação do DNA, transcrição com splicing, tradução e código genético).
- B05.4 → BK38 "Mutações e Hardy-Weinberg" (já trata mutações gênicas e cromossômicas).

Tópico novo:
- BK47 "Expressão gênica e diferenciação celular" (B05.5). Fonte: `app/public/conteudo/bio/materia.json`, módulo B05, cartão "Expressão gênica e diferenciação" (sub B05.5).

## Português (`por/geral.json`)

Ligado a tópico existente:
- P01.4 → IK15 "Funções da linguagem: elementos da comunicação, emotiva e apelativa (conativa)" e IK16 "Funções fática, poética, referencial e metalinguística" (os cartões de P01.4 são quase todos das funções da linguagem).

Tópicos novos (fonte: `app/public/conteudo/por/materia.json`, cartões de teoria do subtema indicado):
- IK28 "Paratexto: título, fonte, data e nota de rodapé como pistas de leitura" (P01.3). Cartão P01.3 "Título, fonte e data".
- IK29 "Ponto de vista e modalização: as marcas de opinião do autor" (P02.2). Cartões P02.2 "Autor na 1ª pessoa", "“Nós” que inclui o leitor", "Modalizadores", "Palavras que avaliam", "Autor × vozes citadas", "Narrador × personagem".
- IK30 "Ironia, humor e sentido implícito" (P02.3). Cartões P02.3 "Ironia", "Sentido implícito", "Humor e quebra".
- IK31 "Contra-argumento: concessão e refutação" (P02.4). Cartões P02.4 "Concessão", "Refutação".
- IK32 "Charge, cartum, tirinha, cartaz, infográfico e meme" (P03.3). Cartões P03.3 "Charge", "Cartum e tirinha", "Cartaz e anúncio", "Infográfico e meme" (o cartão "Intertextualidade" já está coberto por IK22–IK24).
- IK33 "Progressão temática e ordem das ideias" (P04.3). Cartão P04.3 "Progressão e ordem das ideias".
- IK34 "Sentido da palavra no contexto, neologismo e estrangeirismo" (P05.1). Cartões P05.1 "Sinônimo no contexto", "Parônimos e homônimos", "Palavra nova ou estrangeira".

## Física (`fis/geral.json`)

Nenhum tópico existente tratava destes assuntos. Tópicos novos (fonte: `docs/revisao/fis/resumos.json`, `subtemas[].sub` indicado):
- FK43 "Unidades do SI, conversões, notação científica e ordem de grandeza" (F01.1, F01.2). Resumos F01.1 e F01.2.
- FK44 "Radioatividade, meia-vida e física nuclear" (F01.6). Resumo F01.6.
- FK45 "Fontes de energia, usinas e impacto ambiental" (F04.5). Resumo F04.5.
- FK46 "Espectro eletromagnético e radiações" (F10.2). Resumo F10.2.

## Filosofia e Sociologia (`fs/geral.json`)

Nenhum tópico existente tratava destes assuntos de verdade (SK47 fala de Bauman e das elites extraterritoriais, mas não de migração nem de xenofobia; por isso S07.3 ganhou tópico próprio). Tópicos novos (fonte: `docs/revisao/fs/resumos.json`, `subtemas[].sub` indicado):
- FK39 "Ética e moral" (L03.1).
- FK40 "Proposições, argumentos, validade, dedução e indução" (L04.1, L04.2).
- FK41 "Falácias" (L04.3).
- FK42 "Conectivos lógicos e tabela-verdade" (L04.4).
- FK43 "Hannah Arendt e o totalitarismo" (L05.6).
- FK44 "Iluminismo e Kant: razão, autonomia e esclarecimento" (L07.1, L07.2).
- FK45 "Voltaire, enciclopedistas e tolerância" (L07.3).
- FK46 "Simone de Beauvoir e O segundo sexo" (L08.3).
- SK49 "Taylorismo, fordismo e toyotismo" (S03.4).
- SK50 "Trabalho no Brasil: escravidão, CLT e desemprego" (S03.6).
- SK51 "Gênero, feminismo e violência contra a mulher" (S04.4).
- SK52 "Minorias: LGBTQIA+, pessoas com deficiência e outros grupos" (S04.6).
- SK53 "Movimento operário e sindicalismo" (S06.2).
- SK54 "Movimentos indígenas e socioambientais" (S06.5).
- SK55 "Migrações e xenofobia na globalização" (S07.3).
- SK56 "Meios de comunicação, opinião pública e espetáculo" (S08.2).

Com isso Filosofia passa de 38 para 46 tópicos e Sociologia de 48 para 56; os números fixos do teste `app/src/testes/revisaoGeral.test.ts` foram atualizados.

## Geografia (`geo/geral.json`)

Nenhum tópico existente tratava destes assuntos de verdade (GK10 trata climas do mundo, GK14 biomas do IBGE, GK24 migrações internacionais, GK17 reforma agrária, GK32 desmatamento e crise hídrica). Tópicos novos (fonte: `docs/revisao/geo/resumos.json`, `subtemas[].sub` indicado):
- GK46 "Climas do Brasil e climogramas" (G03.3).
- GK47 "Oceanos, mares e recursos marinhos" (G04.5).
- GK48 "Domínios morfoclimáticos de Ab'Sáber" (G05.2).
- GK49 "Migrações internas no Brasil" (G06.4).
- GK50 "IDH, desigualdade e indicadores sociais" (G06.6).
- GK51 "Conflitos no campo e grilagem" (G08.2).
- GK52 "Impactos ambientais da agropecuária" (G08.5).
- GK53 "Fontes de energia e matriz energética" (G09.4).
- GK54 "Energia no Brasil: matriz, petróleo, pré-sal e renováveis" (G09.5).
- GK55 "Amazônia: delimitações, ocupação e reserva legal" (G11.3).
- GK56 "Nordeste: sub-regiões e semiárido" (G11.4).
- GK57 "Centro-Oeste, Sudeste e Sul" (G11.5).
- GK58 "Resíduos sólidos, reciclagem e saneamento" (G12.4).

## História (`his/geral.json`)

HK37 (Segundo Reinado) cita a imigração e a Lei de Terras, mas não trata parceria, colonato nem branqueamento; por isso H04.6 ganhou tópico próprio. Tópicos novos (fonte: `docs/revisao/his/resumos.json`, `subtemas[].sub` indicado):
- HK58 "Reinos e impérios africanos" (H02.4).
- HK59 "Imigração e trabalho livre no Império" (H04.6).

## Tópicos do livro ligados depois (11/11/2026, sessão principal)

Os tópicos do Revisaí com `subs` vazio que tratam do núcleo do subtema foram ligados (o conteúdo já é a fonte aprovada da revisão geral; nada foi escrito):
GK01 → G13.2; GK22 → G13.1; GK03 → G01.1, G01.2; GK04 → G01.4, G01.6; GK05 → G01.7; GK06 → G02.1, G02.2; GK07 → G02.3, G02.4; GK08 → G02.6; HK50 → H08.7; HK54 → H05.8, H05.10; HK55 → H05.10, H05.11; HK56 → H05.11.
Cobertura parcial registrada em `lacunas` de geo: orientação e movimentos da Terra (G01.1), anamorfoses (G01.6), tempo geológico (G02.1), assoreamento (G02.4), rede (G13.1), climogramas (G03.3) e saneamento (G12.4).
Não ligados por só mencionarem o assunto: H08.1 e H08.2 (HK50) e H08.5 (HK54).
Correções da conferência (lente separada, com volta): HK54 Guatemala 1954–1986 (o livro dizia 1996, ano do acordo de paz); GK54 com os números do BEN 2025, ano-base 2024 (50% e 88,2%); demais ajustes de clareza em BK38, IK15, IK28, IK33, IK34, FK42–FK44, SK50, SK53, SK54, GK06, GK51, HK56.

## Ainda sem tópico

Nenhum. Os 11 subtemas que estavam aqui (310 questões) e as 7 coberturas parciais de Geografia ganharam tópico em 11/11/2026. Fonte: conhecimento consolidado de livro didático, autorizado pelo dono em 11/11/2026; datas e números conferidos nas fontes oficiais listadas abaixo (o que não pôde ser confirmado foi cortado).

Geografia (`geo/geral.json`, 58 → 68 tópicos):
- G01.3 fusos horários → GK59 "Fusos horários: cálculo da hora e fusos do Brasil".
- G01.5 curvas de nível e perfil topográfico → GK60 "Curvas de nível, perfil topográfico e mapa hipsométrico".
- G02.5 solos → GK61 "Solos: formação, horizontes, tipos e conservação".
- Tópicos curtos para o que faltava: orientação e movimentos da Terra (G01.1) → GK62; anamorfoses (G01.6) → GK63; tempo geológico (G02.1) → GK64; assoreamento (G02.4) → GK65; rede (G13.1) → GK66; climogramas (G03.3) → GK67; saneamento básico (G12.4) → GK68.

História (`his/geral.json`, 59 → 67 tópicos):
- H08.1 origens e blocos da Guerra Fria → HK60.
- H08.2 Coreia, Vietnã e crise dos mísseis → HK61.
- H08.3 Revolução Chinesa → HK62.
- H08.4 descolonização da África e da Ásia → HK63.
- H08.5 Revolução Cubana e ditaduras (Cuba e a ligação com as ditaduras; as ditaduras seguem em HK54) → HK64.
- H08.6 contracultura e direitos civis → HK65.
- H08.8 mundo atual (até 2024) → HK66.
- H05.9 cultura e resistência à ditadura → HK67.

Datas e números conferidos na web (11/11/2026):
- Quatro fusos do Brasil, Acre e oeste do Amazonas em UTC−5 (Lei 12.876/2013): Observatório Nacional, https://www.gov.br/observatorio/pt-br/assuntos/areas-de-atuacao/tempo-e-frequencia/brasil e Ministério da Defesa, https://sisclaten.defesa.gov.br/edgv/dominios/dominios-tematicos/fuso.html (GK59).
- Metas do Marco Legal do Saneamento (Lei 14.026/2020: 99% água, 90% coleta e tratamento de esgoto até 31/12/2033): https://www2.camara.leg.br/legin/fed/lei/2020/lei-14026-15-julho-2020-790419-publicacaooriginal-161096-pl.html; Norte com os menores índices: Ministério das Cidades, https://www.gov.br/cidades/pt-br/assuntos/noticias-1/noticia-mcid-n-1467 (GK68).
- Latossolos como a classe de solo mais extensa do Brasil: Embrapa, https://www.embrapa.br/en/tema-solos-brasileiros/solos-do-brasil (GK61).
- 17 independências africanas em 1960: Britannica, https://www.britannica.com/topic/list-of-African-Countries-Independence-Dates (HK63).
- Conferência de Bandung (1955) e conferência dos não alinhados em Belgrado (1961): Britannica, https://www.britannica.com/event/Bandung-Conference e https://www.britannica.com/topic/neutralism (HK63).
- Pacto de Varsóvia (14/5/1955), depois da entrada da Alemanha Ocidental na OTAN (6/5/1955): Britannica, https://www.britannica.com/event/Warsaw-Pact e OTAN, https://www.nato.int/cps/en/natohq/declassified_185912.htm (HK60).
- Fim da crise dos mísseis (promessa de não invadir Cuba, retirada dos mísseis da Turquia, linha direta em 1963): Britannica, https://www.britannica.com/event/Cuban-missile-crisis, Office of the Historian, https://history.state.gov/milestones/1961-1968/cuban-missile-crisis e JFK Library, https://www.jfklibrary.org/learn/about-jfk/jfk-in-history/cuban-missile-crisis (HK61).
- Emenda Platt (1901), base de Guantánamo e ocupação dos EUA até 1902: Britannica, https://www.britannica.com/topic/Platt-Amendment (HK64).
- As demais datas são de conhecimento consolidado de livro didático e não foram buscadas uma a uma; nenhum número novo além dos acima foi acrescentado.

## Conferência

- `python3 docs/revisao/valida_geral.py`: todas as matérias ok.
- `cd app && python3 scripts/converte.py` e `npx vitest run`: 19 arquivos, 770 testes, todos passando.
