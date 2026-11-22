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
