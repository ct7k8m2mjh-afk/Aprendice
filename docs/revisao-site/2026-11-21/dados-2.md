# Revisão do site, 21/11/2026 (3ª rodada), 2ª passada: dados

Revisor independente, só leitura. Commit `dc33dfbd`, build servido em http://localhost:4191, dados de `app/public/conteudo` (iguais a `app/dist/conteudo`). Esta passada confere só o que mudou desde `dados.md` (N1 a N4) e o que estava errado, como pede `dados-correcoes.md`.

**Método.**
- **N1:**
  - Rodei de novo `dados/scripts/frac.cjs` com o detector atual (`app/src/logica/fracao.ts`, compilado com esbuild).
  - Comparei o detector atual com a versão revisada na 1ª passada (cópia `fracao_old.ts` na pasta de rascunho) em todo o texto que o site mostra: resoluções, teoria, flashcards e revisão das 9 matérias. Foram 3.037 trechos que mudaram (1.276 diferentes), e olhei todos os acréscimos.
  - Também listei tudo o que o detector empilha nas matérias de texto (Por, His, Geo, F/S, Ing) e em Bio, e conferi na tela 15 questões e 2 telas de tema (Playwright, 1280 claro).
- **N2:**
  - As 399 notas publicadas (`provas/<id>/prova.json`, campo `nota`): lidas por script e comparadas com a fonte (`app/conteudo-fonte/provas/<id>/prova.json`).
  - As 399 telas `#/simulados/prova/<id>` abertas no navegador.
- **N3:** as 10 questões da São Camilo abertas e respondidas na tela.
- **N4:** lente de fatos, com o print da q. 38 da Famema 2022 (`provas/famema-2022/q/038.webp`) e a fonte `app/conteudo-fonte/provas/famema-2022/resolucoes-fis.json`.
- **Prints** na pasta de rascunho da sessão: `r2-dados-fp-*.png`, `r2-dados-nota-ufrr-2024.png`, `r2-dados-saocamilo-Pe9ee0e1.png` e `r2-q38.png`.

## Parte 1: situação de N1 a N4

| # | Problema (dados.md) | Situação nesta passada |
|---|---|---|
| N1 | Fração na linha: grupo com expoente, potência com "^", "÷" e barra em cadeia | **Quase resolvido.** O script dá 1 trecho só, em mat Pe922fcad, `erradas.C`: "a área não passa de B1H1·D1H1/2 = (l√19/3)(l√17/3)/2". O que vem depois do "=" empilha, mas "B1H1·D1H1/2" fica na linha (na tela, nenhum `.frac` com esse texto). **É erro**: é o produto B1H1 · D1H1 sobre 2, uma fração em linha. Correção: escrever "(B1H1 · D1H1)/2" no dado, que o detector já empilha (testado). Os outros 2 trechos que o script marca não são erro. O "÷ 3,6" de fís-d004 está em `aceita`, uma lista de respostas aceitas que o aluno não vê. O "massa dele na fórmula ÷ M" do resumo Q04.2 aparece empilhado na tela (`#/m/qui/tema/Q04`). Os casos citados no N1 (P5cb97bb6, P5b8f3493, Pd1b2c6cf, P12f2c58e, P4db22f5e, Pbc3a3190, Pb572cf81, os 3 "÷" e "27,1/164/3") não aparecem mais no script. **O detector novo não passou a empilhar o que não é fração.** As mudanças estão só em Mat, Fís e Quí, mais 1 em Bio. Conferi os 979 acréscimos, incluindo todos os que só têm letras (ex.: "A/B", "E/D", "C/A", "L/A", "dA/dB", "m/F"). Todos são razão ou fração de verdade, dentro de uma conta. Nenhum é unidade, data, genótipo ou par. O único trecho que não é conta ("qui_work/gera_q06", um caminho de arquivo) está em `revisao/Q06.json` › `fontes`, que o site não mostra. Os falsos positivos que existem são anteriores a esta mudança: ver R1. |
| N2 | Nota da prova no simulado com Brasil Escola e detalhe interno | **Resolvido no que foi pedido, com 2 exceções novas (R2 e R3).** Nenhuma das 399 notas está vazia. Nenhuma cita site didático, "acesso automático", "link do dono", "pacote", "não respondeu", link, OCR ou "achado pela sessão", nem no dado nem na tela. As 399 telas mostram a nota inteira, sem erro de console. Restam frases falsas ou contraditórias em ufrr-2024 e ime-2024/2025 (R2) e um gabarito definitivo que já existe e não é usado (R3). |
| N3 | Rótulo do link e número das 10 da São Camilo | **Rótulo resolvido.** As 10 mostram "Fonte: resolução publicada por cursinho · São Camilo <ano>". O link continua sendo a página da questão no Estratégia, e não aparece mais "PDF". O nome do cursinho não aparece. O cabeçalho mostra só o link "São Camilo". **Número da questão: continua pendente** (registrado em `dados-correcoes.md`, ainda é o ERRO N3 da 1ª passada). P113600a (post de blog) continua com o dono. |
| N4 | "Chuta" em fís Pacdab1ea, `erradas.D` | **CERTO** (lente de fatos, detalhe abaixo). O texto novo está igual em `fis/res/F03.6.json` e em `provas/famema-2022/prova.json`, e "chuta" saiu. Os outros "chut…" que sobram em `erradas` (geo P003f65f8 "casa chutada"; mat P838cbbf3 "questões chutadas") repetem o assunto do texto ou da pergunta da prova. Estão certos. |

### N4: conta refeita (lente de fatos)
- **Enunciado (print):** M no prato esquerdo (braço x) é equilibrado por m₁ à direita (braço y). M no prato direito é equilibrado por m₂ à esquerda. As alternativas são A (m₁ + m₂)/2; B √(m₁ + m₂); C √(m₁² + m₂²); D √((m₁² + m₂²)/2); E √(m₁·m₂). O gabarito é E (FGV, definitivo).
- **Equilíbrio:**
  - 1ª pesagem: M·x = m₁·y.
  - 2ª pesagem: m₂·x = M·y.
  - Multiplicando as duas: M²·xy = m₁m₂·xy, logo M = √(m₁m₂). O texto escreve "M·y = m₂·x", que é a mesma equação.
- **Teste x = 1, y = 2, M = 1 kg:**
  - m₁ = M·x/y = 0,5 kg e m₂ = M·y/x = 2 kg.
  - D = √((0,25 + 4)/2) = √2,125 = 1,4577… ≈ **1,46 kg**. Confere.
  - "Ela dá M quando a balança é honesta": com m₁ = m₂ = M, √(2M²/2) = M. Confere.
  - "Média quadrática" e "raiz da média dos quadrados das duas leituras" descrevem a fórmula D corretamente.
- **Resto da resolução, conferido no mesmo teste:**
  - A dá 1,25 kg.
  - B dá √2,5 ≈ 1,58.
  - C dá √4,25 ≈ 2,06, e no caso honesto √2·M.
  - Checagem: √(0,5 × 2) = 1 kg.
  - O `caminhos` ("passam A, D e E" no caso honesto) também confere.
- **Veredito:** o texto novo está certo, sem erro de fato.

## Parte 2: achados novos

### R1. Datas, anos, leis, códigos, separadores de verso e siglas aparecem empilhados como fração (ERRO: texto falso na tela, "Fração sempre empilhada" vale só para fração)
- **Tela:** correção da questão ("Resposta correta", resolução em texto, "Por que as outras estão erradas") e teoria do tema. Conferido na tela em 1280 claro (Playwright: `.frac` com o texto exato). Prints: `r2-dados-fp-*.png`.
- **O que está errado:** o detector trata como fração qualquer "número/número" sem zero na frente e alguns pares de letras e números. Isso não é de agora: a comparação com a versão anterior não mostra nenhuma mudança em Por, His, Geo, F/S e Ing. Mas está na tela. Exemplos conferidos na tela:
  - **Ano e período:**
    - his P65b978f7, "Resposta correta": "Conferência de Berlim (1884 sobre 1885)";
    - geo Pd93cad4b, `erradas.A/C`: safras "2009/2010", "2020/2021", "2014/2015", "2019/2020";
    - geo P1ece8818 "1960/1970";
    - geo Pbe18a3ec "1969/1970";
    - his P9bf2533a "1054/1378";
    - mat P3827a9a2: safras "2015/2016" a "2019/2020".
  - **Data:**
    - por Pcca988f3, passo 4: "De 31/5 a 7/6.", as duas empilhadas;
    - his P8e242b1d "em 3/9";
    - geo P63bf1f6d "13/6", "19/6", "24/6";
    - geo P045279bf "10/10";
    - geo P9704da6b "(10/6)".
  - **Lei, projeto, edital, comunicado:**
    - por P5a934be7 e P66da31c8 "PL 2.338/23";
    - por P40e7068f "PL 404/17";
    - por P72ffc765 "Lei Federal nº 9 605/98";
    - por Pd032cecc "Lei n. 10 639/2003";
    - geo P86726448 e teoria G08 "LC 14/1973", "20/1974";
    - geo P4d3fac12 "90/2013";
    - geo P36caf8ed "CONAMA 275/2001";
    - bio P5d2c2233 "Comunicado 81/2025-CEV/UECE".
  - **Verso e enumeração:**
    - por P553e8c3b e Pb4715527 "Sem que veja a Rua 15 / E o progresso", com o "15" sobre o "E" (print `r2-dados-fp-por-P553e8c3b.png`);
    - bio P1041e6ee "I - H / II - D / III - F / IV - C".
  - **Linhas do texto:** por P1f501be8 "linhas 16/17", "linhas 28/29".
  - **Sigla, hormônio, par:**
    - bio P1fba804a, P25a78e21, P7388f988, P6f40616d "T3/T4": "T3 sobre T4" na cadeia hipotálamo → tireoide (print `r2-dados-fp-bio-P1fba804a.png`);
    - bio Pf6a27ac5, "Resposta correta": "mimetismo (1a/1b)", "camuflagem (3a/3b)", que são itens da chave;
    - geo Pf968ffcc "RJ/ES";
    - fs P18377333 "AC/DC" (banda);
    - ing P91f391eb "conteúdo 24/7";
    - por P452408d7 "vogal + r/s".
  - **Medida:** teoria de Bio B07, cartão "Vasos e pressão arterial": "PA ≈ 120/80 mmHg", com "120 sobre 80" (`#/m/bio/tema/B07`).
  - **Na revisão geral, também empilhados:** por "≈1907/1909" e "Redação 50/50"; his "(13/3)", "(19/3)", "(25/3)", "31/3 e 1/4".
- **Onde no código:**
  - `app/src/logica/fracao.ts`, função `ehFracao`. Para "número/número" (linha ~126), só exclui zero na frente ("05/11") e ano com semestre ("2024/2"). Para ano embaixo (linha ~113), exige "Lei/PEC/nº…" antes ou milhar com ponto, e por isso "PL 2.338/23", "LC 14/1973" e "CONAMA 275/2001" passam. Também não olha "-" seguido de letras ("81/2025-CEV").
  - A 1ª passada (`dados/scripts/frac.cjs`) e a rodada de 20/11 tiravam datas e leis da conta de propósito. Por isso isso não apareceu como achado.
- **Como corrigir:**
  - (a) Nas matérias sem conta (Por, His, Geo, F/S, Ing), empilhar só "número/número" que esteja dentro de uma conta: com "=", "≈", "×", "·" ou "÷" no mesmo trecho, ou depois de "fração", "razão", "de cada". Fora disso, fica na linha.
  - (b) Em todas as matérias, nunca empilhar:
    - ano/ano ("1884/1885", "2009/2010");
    - número/ano ou número/dois dígitos depois de "PL", "LC", "Lei", "CONAMA", "Edital", "Comunicado";
    - código seguido de "-LETRAS";
    - "dd/mm" quando a palavra antes é "em", "de", "dia", "a", "até" ou "(";
    - " / " entre palavra com maiúscula (verso);
    - pares de algarismo + letra ("1a/1b", "T3/T4");
    - "120/80 mmHg".
  - (c) Teste com estes casos, para que não voltem.

### R2. Nota de prova com frase falsa ou contraditória sobre o gabarito: ufrr-2024, ime-2024 e ime-2025 (ERRO: texto falso na configuração do simulado)
- **Tela:** `#/simulados/prova/ufrr-2024`, `…/ime-2024` e `…/ime-2025`. Print: `r2-dados-nota-ufrr-2024.png`.
- **ufrr-2024. O que o aluno lê:** "Só o gabarito PRELIMINAR (Edital Nº 89/23-CPV). Gabarito definitivo não publicado ou não localizado: vale o gabarito do Aprendice (…). Gabarito oficial definitivo: Edital 90/23-CPV (11/12/2023), Anexo I, Prova Integral com Inglês. Anuladas: 5, 23, 43 e 68." As duas primeiras frases são desmentidas pela terceira.
- **ufrr-2024. O que é verdade pela fonte (`app/conteudo-fonte/provas/ufrr-2024/prova.json`):**
  - O gabarito oficial definitivo **foi publicado e localizado**: Edital 90/23-CPV, de 11/12/2023, Anexo I (Prova Integral com Inglês). A cópia do edital está em `fontes['gabarito-definitivo']`. As anuladas são 5, 23, 43 e 68.
  - O site já usa esse gabarito:
    - as 4 anuladas estão com `gab: null` e `indisponivel` (ficam fora);
    - as 72 questões da UFRR 2024 no banco estão **sem** `gabFonte: 'aprendice'`, ou seja, aparecem como "Gabarito oficial";
    - a resolução de geo P4200703c (`alerta`) diz que o preliminar e o definitivo foram conferidos.
  - Então "Só o gabarito PRELIMINAR" e "Gabarito definitivo não publicado ou não localizado: vale o gabarito do Aprendice" são **falsas**. O que fica errado é o texto da nota.
  - Resta um detalhe no dado: as 72 questões do `prova.json` ainda levam `gab_preliminar`. O site não usa esse campo na tela, mas ele contradiz o resto.
- **ufrr-2024. Como corrigir:**
  - Na fonte, apagar as frases do preliminar e do "não localizado". A nota fica assim: "… Redação fora. Gabarito oficial definitivo (Edital 90/23-CPV, de 11/12/2023, Anexo I, Prova Integral com Inglês); anuladas (5, 23, 43 e 68) ficam fora."
  - Tirar `gab_preliminar` das questões dessa prova.
- **ime-2024 e ime-2025. O que o aluno lê:** "Só o gabarito PRELIMINAR do IME; o definitivo foi publicado no site do IME. Gabarito definitivo não publicado ou não localizado: vale o gabarito do Aprendice". A nota diz que o definitivo foi publicado e, na frase seguinte, que não foi.
- **ime-2024 e ime-2025. A verdade pela fonte:** o definitivo foi publicado, mas não foi lido (o site do IME não abriu nesta rede). As 39 questões de cada ano estão com o gabarito do Aprendice.
- **ime-2024 e ime-2025. Como corrigir:** dizer só o que vale para o aluno, por exemplo: "O IME publicou o gabarito definitivo, mas ele ainda não foi conferido aqui. Até lá, vale o gabarito do Aprendice (…)". Melhor ainda, aplicar o definitivo (R3).
- **Onde no código:** o texto vem da fonte, filtrado por `nota_aluno` (`app/scripts/converte.py:550`). O filtro corta os trechos internos, mas não percebe frases que se contradizem.

### R3. Gabarito definitivo publicado pela banca e ainda não aplicado: ime-2024, ime-2025, ufrr-2025, ufrr-2026 (ERRO: princípio 2, "se a banca publicar o gabarito depois, vale o oficial")
- **O que está errado:** a fonte registra que o gabarito definitivo existe, com o nome ou o link do arquivo:
  - ufrr-2025: Edital 97/24-CPV, em `editais.ufrr.br/…/edital-n-97-24-gabarito-oficial-vestibular-2025.pdf`;
  - ufrr-2026: Edital 93/25-CPV, em `…/edital-n-93-25-gabarito-oficial-vestibular-ufrr-2026.pdf`;
  - IME 2024 e 2025: "o definitivo foi publicado no site do IME".
- Mesmo assim, as questões estão no ar com o gabarito do Aprendice:
  - ufrr-2025: 67 questões;
  - ufrr-2026: 69;
  - ime-2024: 39;
  - ime-2025: 39.
- A nota publicada diz "Gabarito definitivo não publicado ou não localizado", o que não é verdade para essas provas: ele foi publicado e localizado, só não foi lido. As anulações e as letras trocadas depois dos recursos não foram conferidas. Uma questão anulada no definitivo pode estar no ar com o gabarito do Aprendice, e o princípio 2 manda tirar questão anulada.
- **Como corrigir:**
  1. Baixar os 4 gabaritos definitivos de outra rede ou com o dono.
  2. Trocar `gab`, tirar as anuladas e remover `gab_preliminar` e o `gabFonte: 'aprendice'` dessas provas.
  3. Até lá, a nota deve dizer "publicado, ainda não conferido", e não "não publicado".

## O que conferi e passou
- **N1:**
  - 0 resíduo de fração na linha em teoria, flashcards, frases e revisão. Na correção, só o resíduo de Pe922fcad.
  - O detector novo não criou falso positivo: 979 acréscimos olhados, todos frações ou razões de conta.
  - Na tela, mat Pe922fcad mostra 59 frações empilhadas, e só o "B1H1·D1H1/2" fica na linha.
- **N2:**
  - 399 de 399 notas não vazias, sem site didático e sem detalhe interno, no dado e na tela.
  - Nenhum erro de console nas 399 telas.
  - As outras notas com gabarito preliminar estão coerentes com o dado: em todas, a prova está com o gabarito do Aprendice (`gabFonte: 'aprendice'`). São acafe-2022-verao, emescam-2022-1, uece-2025-2, uemg-2022, uft-2023-2, unirg-2023-1, unirg-2027-1 e urca-2027-1.
- **N3:** rótulo certo nas 10 questões, sem "PDF" e sem o nome do cursinho.
- **N4:** texto certo e igual nas duas saídas (banco e prova completa).

Total: 3 ERROS, 0 DECISÕES DO DONO
