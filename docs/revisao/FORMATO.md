# Formato dos arquivos de revisão (`docs/revisao/<matéria>/<TEMA>.json`)

Gerados a partir dos livros que o dono enviou (fichamentos de cada capítulo, com página), escritos com nossas palavras e revisados em lentes (fatos → didática → fatos). Cada arquivo é um tema do site; ids de tema e conteúdo são os do site.
Uso no site: aba de revisão do tema, ciclo de 5 tempos (`docs/estrategia-revisao.md`, pilar 1). Os campos `resumo`, `formulas`, `erro` e `cartoes` seguem o mesmo formato da "Teoria em cartões" que já existe.

## Estrutura (um arquivo por tema, JSON UTF-8)
```
{
 "id": "F02", "nome": "<nome do tema como em conteudos-site.txt>",
 "resumo": "3 a 4 frases: a ideia que liga o tema e o que a banca faz com ele",
 "formulas": ["linhas curtas do caderno: fórmula ou regra, com \\frac{}{} para fração"],
 "erro": "o erro que mais derruba neste tema, em 1 a 2 frases",
 "cartoes": [ {"sub":"F02.1","titulo":"...","oque":"2 frases","identificar":"Pistas: ...","exemplo":"1 a 2 frases com números","caderno":["3 a 5 linhas"],"cuidado":"1 frase"} ],
 "slides": { "F02.1": [ <SLIDE>, ... ], "F02.2": [ ... ] },
 "fontes": [ {"chave":"L1-F1-C02","paginas":"23–36"} ],
 "pendencias": [ "conteúdo do tema que os livros não cobrem, se houver" ]
}
```
Um cartão e uma lista de slides para CADA conteúdo do tema. Se as fichas não cobrem um conteúdo, escreva com seu conhecimento só se tiver certeza absoluta e marque em `pendencias` ("F06.4 escrito sem base nos livros: conferir").

### SLIDE
```
{
 "tipo": "abertura | conceito | formula | grafico | exemplo | pegadinha | na_prova | fixe",
 "titulo": "até 7 palavras",
 "texto": "até 40 palavras, frases curtas",
 "destaque": "opcional: a frase que o aluno deve guardar (até 15 palavras)",
 "formula": "opcional, LaTeX: s = s_0 + v \\cdot t ; fração SEMPRE \\frac{a}{b}",
 "legenda": ["opcional: s: posição (m)", "v: velocidade (m/s)"],
 "passos": [ {"faz":"o que fazer","conta":"LaTeX da conta","mov":"o que se move na tela nesta passagem"} ],
 "visual": {
   "tipo": "animacao | esquema | grafico | foto",
   "descricao": "o que aparece na tela (objetos, eixos, cores: destaque na cor de Física, laranja #F27700)",
   "movimento": ["1. ...", "2. ...", "3. ..."],
   "foto": {"url": "página do Wikimedia Commons", "arquivo": "File:...", "autor": "...", "licenca": "CC BY-SA 4.0 / domínio público", "por_que": "..."},
   "alt": "descrição para leitor de tela"
 },
 "fonte": "L1-F1-C02 p. 24"
}
```
Sequência por conteúdo (6 a 10 slides; nem todo conteúdo usa todos os tipos):
1. `abertura`: uma situação real que faz o aluno querer entender (com visual).
2. `conceito` (1 a 3): a ideia, do mais básico ao mais avançado.
3. `formula`: a fórmula, o que é cada letra e a unidade no SI (legenda).
4. `grafico`: quando o conteúdo tem gráfico (s × t, v × t, curva de aquecimento, etc.).
5. `exemplo`: um exemplo NOVO no estilo das provas (não copie exercício do livro), resolvido em `passos` de conta. Cada passo diz em `mov` como os termos se movem: o termo atravessa o "=" e troca de sinal; o que multiplica vai dividindo; o que se cancela é riscado; o resultado aparece no lugar.
6. `pegadinha`: a armadilha que a banca usa e como não cair.
7. `na_prova`: como cai (quais provas, que tipo de questão, do básico ao difícil), tirado da seção "O que as provas cobram" das fichas.
8. `fixe`: 3 linhas para levar (o essencial).

### Visual (obrigatório em todo slide exceto `na_prova` e `fixe`)
- A regra do site é "ver a coisa acontecer": prefira `animacao` (o site desenha em SVG e anima com um único motor). Descreva o visual como um roteiro de animação: objetos, posições, o que se move, em que ordem, o que muda nos números ao lado. Use as ideias de animação das fichas e melhore-as.
- `foto`: o dono autorizou (06/11/2026) imagens e referências que ajudem a compreensão (obras, fotos, mapas, gravuras). Prefira licença livre (Wikimedia Commons) quando houver versão equivalente; em qualquer caso registre página, autor e licença ou acervo e mostre o crédito no slide.
- Nada de emoji, nada de visual "de IA", nada de texto dentro de imagem que dependa de inglês.

## Convenções
- `fixe`: as 3 linhas em `texto`, separadas por "\n". Sem fração em linha nem ali: "(a/2)·t²" NÃO; escreva por extenso ("metade de a vezes t²") ou deixe a fórmula para o campo `formula`.
- Cores do visual: laranja #F27700 (ou a cor da matéria) para o que importa; eixos e o resto em cinza; segunda grandeza tracejada.
- Matemática no `caderno` dos cartões entre `$…$`, com \frac; `formula`, `conta` e `formulas` em LaTeX puro.
- Espaço fino de milhar: U+202F.

