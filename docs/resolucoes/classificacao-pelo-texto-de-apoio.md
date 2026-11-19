# A questão etiquetada pelo texto de apoio

**Levantado na fábrica de Português, 19/11/2026. Vale para todas as matérias.**

## O que foi encontrado

Em três lotes seguidos de Português, **41 de 122 questões (34%) estão
classificadas no conteúdo errado**. Sempre pelo mesmo motivo: a questão foi
etiquetada pelo **assunto do texto de apoio**, e não pelo que o comando cobra do
aluno.

| Lote | Questões | RECLASS | Prefixo a corrigir | Divergência legítima |
|---|---|---|---|---|
| por-0106 | 50 | 12 | 3 | — |
| por-0107 | 50 | 22 | 0 | 5 |
| por-0108 | 22 | 7 | 2 | 0 |
| **total** | **122** | **41** | **5** | **5** |

Cada caso foi decidido por um agente que **abriu o print** e leu a questão, não
por regra automática.

## Como o erro se parece

**Literatura virou lixeira.** Se o texto de apoio é de um escritor conhecido, a
questão vai para o tema de literatura daquele escritor — mesmo quando o comando
não pede nada de história literária:

- ITA 2020 q17, com um trecho de *São Bernardo*, ficou em **P11.3 (Machado de
  Assis)**. É de Modernismo de 30 — e o que a questão cobra é leitura.
- ITA 2022 q19, com texto literário, ficou em **P12.1 (Pré-Modernismo)**. O
  comando é sobre **discurso indireto livre**.
- ITA 2022 q20 ficou em P12.1. O comando é sobre **ponto de vista do narrador**.
- PUCRS 2025 q52, com Cecília Meireles de 1942, ficou em **P11.4 (Parnasianismo
  e Simbolismo)**.
- PUCRS 2025 q56, com Conceição Evaristo, ficou em **P12.1 (Pré-Modernismo)**.
- PUC-SP 2026 q43 ficou em P11.4 **por causa do sobrenome**: o simbolista é o
  pai, Alphonsus de Guimaraens; quem escreveu o texto é João Alphonsus,
  prosador modernista.
- ENEM 2020 q41, com a petição do Policarpo Quaresma, ficou em **P12.1**. O
  comando pergunta **por que a petição usa a norma-padrão** — é registro.

**O inverso também ocorre.** Questões de figura de linguagem, de variação
linguística e de tempo verbal foram para literatura contemporânea só porque o
autor do texto era contemporâneo (UFU 2023 q63, UDESC 2026.1 q44 e q49, cinco
questões do por-0108 em "Geração de 45").

**E há o gênero do suporte.** Um conto de Alê Motta e uma crônica de Rubem Braga
ficaram em **P03.2 (gêneros jornalísticos)**; uma crônica de Scliar também, numa
questão cujas quatro afirmativas julgam **tempos verbais**.

## Por que não é detalhe de catálogo

O código do conteúdo faz três coisas no site, e as três quebram:

1. **A revisão espaçada erra o destino.** Cada `equivocos.<letra>` de uma
   resolução começa pelo código do conteúdo a que o aluno volta quando erra
   aquela letra. O aluno erra uma questão de referência pronominal e o site o
   manda estudar Pré-Modernismo.
2. **O "Treine sua evolução" fica torto.** O conteúdo percorre as questões do
   mais fácil ao mais difícil. Questão de leitura dentro de um conteúdo de
   literatura desregula a escada dos dois.
3. **O raio-x da prova mente.** A prioridade de conteúdo vem do que as provas
   cobram. Se 8 questões de leitura estão contadas como literatura, o raio-x diz
   que a banca cobra literatura onde ela cobra leitura.

## Como achar os casos, de graça

`ferramentas/fabrica/confere_amostra.py` tem a função `equivocos_fora()`: ela
compara o prefixo de conteúdo de cada `equivocos.<letra>` com o conteúdo em que
a questão está classificada e aponta dois casos —

- os prefixos **discordam entre si** (o aluno cai numa revisão diferente
  conforme a letra que marcou, na mesma questão);
- todos concordam mas apontam **outro conteúdo** que não o da questão.

São duas linhas de código e rodam em qualquer lote. No por-0107 apontaram 27 das
50 questões. **Vale rodar nas outras matérias.**

## O que a divergência NÃO é

Prefixo diferente por letra **pode estar certo**. Numa questão de proposições,
quem marcou B pode ter confundido o foco narrativo e quem marcou A, predicativo
do sujeito com predicativo do objeto: são dois estudos diferentes, e cada letra
aponta o seu. Aconteceu em 5 das 122. Por isso o verificador diz "conferir", e
quem lê a questão decide — nunca o contrário.

## Regra escrita no prompt da fábrica

`ferramentas/fabrica/prompts/por-resolvedor.md` passou a dizer que o código antes
dos dois-pontos é **o conteúdo que o aluno precisa rever para não repetir aquele
erro**; que em quase toda questão isso é o conteúdo em que ela está
classificada; que pode divergir por letra quando os erros são de conteúdos
diferentes de verdade; e que quem achar a questão classificada errado **diz isso
em `reclass`** em vez de usar outro código em silêncio.

Antes o prompt só pedia "o código do conteúdo certo da questão", sem dizer o que
fazer quando o resolvedor discorda da classificação — e era aí que ele inventava.
