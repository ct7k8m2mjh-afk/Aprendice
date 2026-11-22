# Revisão de 21/11/2026 — correções de dados (N2, N3, N4)

Achados de `dados.md`. O N1 é de outra frente.

## N2. Nota da prova no simulado — corrigido
- **Onde estava:** o campo `nota` de `app/conteudo-fonte/provas/<id>/prova.json` ia inteiro para o site e aparecia na configuração do simulado (`SimuladoExec.tsx`, `ConfigSimulado`).
- **Como ficou:**
  - A fonte não mudou: o `nota` da fonte continua como registro da coleta para o dono (de onde veio cada arquivo, cópias, acessos). O `origem` também continua com os endereços usados (princípio 10).
  - O `scripts/converte.py` (`nota_aluno`, chamado em `prova_publicada`) publica só o texto para o aluno. Saem o nome de site didático e os detalhes internos: "acesso automático", "link do dono", "Drive do dono", "cópia pública/hospedada/guardada", "gab_preliminar", "pacote", "não respondeu daqui", links, OCR, "achado pela sessão".
  - Exemplos:
    - `uerj-2021`: termina em "Gabarito oficial do DSEA/UERJ; anuladas ficam fora." A frase sobre o Brasil Escola saiu.
    - `anhembi-2022`: "Caderno e gabarito oficiais da Vunesp."
    - `ufrr-2024`: "Só o gabarito PRELIMINAR (Edital Nº 89/23-CPV)."
- **Conferido por script nas 399 provas:**
  - 147 notas mudaram e nenhuma ficou vazia.
  - Nenhuma nota publicada cita site didático ou detalhe interno.
  - Teste novo em `app/src/testes/provas.test.ts`.

## N3. São Camilo: rótulo do link e número da questão
- **(a) Rótulo — corrigido.** `app/src/logica/origemLink.ts` só diz "PDF de resolução publicada, com a prova" quando o link é um PDF. Página de questão ou post de cursinho mostra "Resolução publicada por cursinho". Os testes estão em `origemLink.test.ts`.
  - Os 3.399 links do Objetivo e os 48 do Química para o Vestibular são PDF e continuam com "PDF". Os 10 da Estratégia mudam.
- **(b) Número da questão — PENDENTE** (não inventado, princípio 1).
  - **Questões:**
    - bio: Pe9ee0e1 (2014), Pf2fba16, P00898a3, P0d5c067 (2015), P94475b9, Pe1879a7 (2021), P113600a (2022);
    - mat: Pa8482f6 (2014), Pf2653f4, P2e9de75 (2015).
  - **O que foi tentado (22/11/2026):**
    - **Provas completas no repositório:** o texto de `saocamilo-2021-2` e de `saocamilo-2022-2` foi comparado com o das 3 questões de 2021/2022 (P94475b9, Pe1879a7, P113600a). Nenhuma está nesses cadernos, que são a Prova II do 2º semestre. Elas devem ser de outra edição (1º semestre) ou da Prova I, que não estão no repositório.
    - **Busca na web (WebSearch):** não achou o enunciado com número. Apareceu o caderno oficial de 2015, `https://saocamilo-sp.br/assets/uploads/processo_seletivo_2015_1.pdf`, mas a rede desta sessão não abre `saocamilo-sp.br` nem `vestibulares.estrategia.com`. Por isso não foi possível ler os números.
  - **Para fechar:**
    1. Abrir os cadernos oficiais da São Camilo de 2014 e 2015 (o de 2015 é o link acima) e os de 2021 e 2022 do 1º semestre.
    2. Achar o número de cada questão.
    3. Trocar o `url` pelo caderno oficial.
    - As questões vêm de `app-atual/<m>/dados.json`, que não se altera. Hoje não há arquivo de ajuste por questão do banco antigo em `app/conteudo-fonte/`, então será preciso criar um (por exemplo, `ajustes-questoes.json`, aplicado em `questao()` do `converte.py`).
  - **P113600a:** o link é um post de blog do Estratégia (`.../portal/atualidades-e-dicas/questoes-sobre-virus-e-bacterias/`). O dono decide se a questão fica até ser trocada pelo caderno oficial.

## N4. "Chuta" em Física — corrigido
- **Questão:** fís Pacdab1ea (Famema 2022, q. 38), `erradas.D`, na fonte `app/conteudo-fonte/provas/famema-2022/resolucoes-fis.json`.
- **Antes:** "Quem marca D chuta uma média com quadrados."
- **Agora:** "Quem marca D tira a raiz da média dos quadrados das duas leituras (média quadrática). Ela dá M quando a balança é honesta, mas no teste x = 1, y = 2 e M = 1 kg dá cerca de 1,46 kg."
  - O resto do texto não mudou.
  - A conta foi conferida contra a alternativa D e o `caminhos` da própria resolução: √((0,5² + 2²)/2) ≈ 1,46.
- Gerado de novo em `fis/res/F03.6.json` e na prova `famema-2022`.

# 2ª passada (`dados-2.md`): R1, R2, R3 e o resto do N1 — 22/11/2026

## N1 (sobra). Mat Pe922fcad, `erradas.C` — corrigido
- O texto é da resolução do Aprendice (não da prova): `app/conteudo-fonte/provas/ime-2025/resolucoes-mat.json`.
- **Antes:** "a área não passa de B1H1·D1H1/2 = …". **Agora:** "a área não passa de (B1H1 · D1H1)/2 = …", que o detector empilha (B1H1 · D1H1 sobre 2). Valor e raciocínio iguais.

## R1. Data, ano, lei, sigla e verso empilhados como fração — corrigido
- `app/src/logica/fracao.ts`, função nova `naoEhFracao`, chamada por `ehFracao`; `divisoes` ganhou a regra do " / " de verso, siglas e enumeração.
- **Nunca empilha (todas as matérias, fora de conta):** período entre anos seguidos ("1884/1885", "safra 2009/2010", "≈1907/1909", "IME 2022/2023"); número de lei, projeto, edital, comunicado, veto, RDC ou CONAMA, também em lista ("PL 2.338/23", "Lei Federal nº 9 605/98", "LC 14/1973 (oito RMs) e 20/1974", "Resoluções Condel/Sudene 150/2021, 155/2022…"); código com "-SIGLA" ("81/2025-CEV", "89/25-CPV"); intervalo de datas ("De 31/5 a 7/6", "de 3/1 a 15/4"); "linhas 16/17"; "120/80 mmHg"; "24/7"; "50/50"; "T3/T4"; "1a/1b"; "O2/O3"; "mistura 46/47"; "CF/1988"; "Rua 15 / E o progresso"; "I - H / II - D"; "PF / PE", "E / W".
- **Matérias de texto (Por, His, Geo, F/S, Ing), regra mais estrita (proposta (a) da revisão):** a matéria chega ao detector pelo contexto `MateriaDoTexto` (`app/src/ui/Fracao.tsx`), dado pela rota `/m/<m>`, pela correção da questão (`Resolucao.tsx`) e pelos cartões (`Cartoes.tsx`). Nelas também ficam na linha: qualquer par de anos ("1054/1378"), número sobre ano ("125/2007", "Veto 20/2025"), número igual em cima e embaixo ("10/10"), data entre parênteses ou antes de nome ("(10/6)", "(13/3)", "13/6 MetLife"), data depois de "em", "dia", "até", "desde" ("em 3/9") ou ao lado de outra data ("31/3 e 1/4"), "RJ/ES", "AC/DC", "vogal + r/s", "V/F". Fração de verdade continua empilhada ("cerca de 1/3 dos que cumpriram pena", "costa (3/4)", "40/20", "62/63 ≈ 0,98").
- **Dentro de conta** (sinal logo antes ou depois) tudo continua fração ("= 1013/2026 − 1/2026", "a = 10/10 = 1 m/s²", "AC/DC = 3/√3"). Em Mat, "1012/1013", "288/2019", "ln(1001/1002)", "(2000/3)π", "(19/6)", "até 1/2", "em 1/3" continuam fração.
- **Comparação antes/depois** (script na pasta de rascunho, sobre todo o texto renderizável de `app/public/conteudo`: resoluções, `materia.json` e `revisao/`, das 9 matérias, com a matéria de cada arquivo): 82 600 trechos empilhados antes, 82 381 depois; **219 deixam de empilhar, 0 novos**. Por matéria: bio 30, qui 11, mat 37, por 39, fís 7, geo 61, his 10, F/S 18, ing 2. Os 219 foram conferidos um a um: todos são data, ano, lei, sigla, par, linha de gráfico ("linha 4/5"), item, verso ou rótulo, nenhum é fração de conta.
- Testes: `fracao.test.ts` (bloco "dados R1", todos os casos da revisão e os que não podem mudar) e `fracaoMateria.test.ts` (o contexto chega ao desenho).

## R2. Nota de prova contraditória — corrigido
- `app/scripts/converte.py`: `nota_aluno(nota, prova)` com `_nota_conforme_gabarito`. Quando o registro diz que o definitivo foi publicado: saem "só o gabarito PRELIMINAR" e "definitivo não publicado ou não localizado"; se a prova ainda usa o gabarito do Aprendice, entra "O gabarito definitivo foi publicado pela banca, mas ainda não foi conferido pelo Aprendice; até lá, vale o gabarito do Aprendice (…)".
- **Conferido por script nas 399 notas:** só 5 tinham a contradição e só elas mudaram: ufrr-2024 (agora: "… Redação fora. Gabarito oficial definitivo: Edital 90/23-CPV (11/12/2023), Anexo I, Prova Integral com Inglês. Anuladas: 5, 23, 43 e 68."), ime-2024, ime-2025, ufrr-2025 e ufrr-2026 (as duas últimas diziam "não publicado ou não localizado", embora a banca tenha publicado os Editais 97/24-CPV e 93/25-CPV). As outras 8 notas com preliminar (acafe-2022-verao, emescam-2022-1, uece-2025-2, uemg-2022, uft-2023-2, unirg-2023-1, unirg-2027-1, urca-2027-1) estão coerentes e não mudaram.
- O `nota` da fonte não muda (registro do dono); cada uma das 5 provas ganhou `nota_revisoes` na fonte com a data e o motivo (não vai ao site).
- Teste novo em `provas.test.ts`: nenhuma nota diz ao mesmo tempo "foi publicado" e "não publicado", e só fala em gabarito do Aprendice a prova que o usa.
- Fica como estava: `gab_preliminar` nas questões da ufrr-2024 (registro do preliminar; o site não mostra).

## R3. Gabarito definitivo publicado e ainda não aplicado — PENDENTE (não inventado)
- **Provas:** ime-2024 (39 questões com gabarito do Aprendice), ime-2025 (39), ufrr-2025 (68), ufrr-2026 (69).
- **O que foi tentado (22/11/2026):** nenhum dos 4 gabaritos definitivos está no repositório (`app/conteudo-fonte/provas/<id>/` só tem `prova.json`, prints e resoluções; `fabrica_saida/ingestao/<id>/manifesto.json` só registra caderno e preliminar). A rede desta sessão recusa `editais.ufrr.br`, `ufrr.br`, `web.archive.org`, `www.ime.eb.mil.br` e `vestibulares.estrategia.com` (proxy 403 / host fora da lista). Por isso nenhuma letra foi trocada e **não há lista de letras diferentes**: sem o arquivo oficial, não dá para saber onde o Aprendice diverge.
- **O que já está no site:** ufrr-2025 q. 16 (P02f0b3a0) fora, anulada pela banca segundo a tabela de recursos do Edital 97/24 (`anuladas-aprendice.json`); ufrr-2025 q. 55 (P523fcc4a) e ufrr-2026 q. 11 (P12e54be4) indisponíveis (`indisponiveis.json`). A nota de cada prova agora diz que o definitivo foi publicado e ainda não foi conferido (R2).
- **Para fechar (com o arquivo em mãos, de outra rede ou pelo dono):**
  1. Gravar o PDF em `app/conteudo-fonte/provas/<id>/` e o endereço em `fontes['gabarito-definitivo']` (como na ufrr-2024).
  2. Em `prova.json`, pôr a letra oficial em `gab` de cada questão (o `converte.py` já usa `gab` e só cai no gabarito do Aprendice quando `gab` está vazio) e `gab: null` nas anuladas (saem do ar, como a 5, 23, 43 e 68 da ufrr-2024).
  3. Comparar a letra oficial com `gabarito_aprendice.letra` em `resolucoes-<m>.json`. Onde diferir, listar aqui e pôr a questão em `indisponiveis.json` até a resolução ser refeita pelas lentes.
  4. Tirar a frase de `nota_revisoes` que diz "Pendente" e rodar o `converte.py`.
