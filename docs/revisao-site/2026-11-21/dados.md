# Revisão do site, 21/11/2026 (3ª rodada): dados

Revisor independente, só leitura. Build do commit `82d57265` servido em http://localhost:4191 (`vite preview`, pasta `app/dist`). Dados lidos de `app/dist/conteudo` (igual a `app/public/conteudo`). Login em modo demonstração, com perfil e preferências injetados no `localStorage` (`aprendice.v1`, versão 8, prova-alvo só ENEM). Comparado com `docs/revisao-site/2026-11-20/dados.md` (2ª rodada) e `2026-11-19/dados.md`. Decisões do dono já tomadas não entram como problema: texto da prova oficial que cita site didático, provas antes de 2020, aviso de questão indisponível etc.

**Método.**
- **Por script, sobre o conteúdo:** contagens, fonte e gabarito, campos da correção, sites didáticos, emoji, palavras proibidas em `erradas` e fração na linha. A fração foi medida com o detector do próprio site (`app/src/logica/fracao.ts`, compilado com esbuild), só nos campos que a correção mostra (`resposta`, `armadilha`, `erradas`, `passos.faz/conta/porque`, `quadro.linha/nota`), na teoria, nos flashcards, nas frases e na revisão.
- **No navegador (Playwright/Chromium):**
  - contagem de cada conteúdo nos 106 temas, com "Todas as regiões" e com "Minha região";
  - 88 questões abertas em 1280 px (aleatórias, Gabarito do Aprendice, indisponíveis, pendentes, sem resolução, M08.6, M11.6), com uma letra errada marcada e "Ver sem animação" aberto;
  - mais 149 questões só para procurar divisão na linha na correção (as 89 apontadas pelo script e 60 aleatórias de Mat, Fís e Quí);
  - fichas de vestibular e telas de configuração do simulado;
  - sessões de flashcards;
  - 6 telas em 390, 768, 1280 e 1440 px, nos temas claro e escuro (tema M08, questão com fração, simulado UERJ, verso de flashcard, revisão Q04.2, tema S06).
- **Prints:** `r3-dados-*.png` na pasta de rascunho da sessão. Olhei a questão com fração em 390 claro, o simulado UERJ, o tema S06, o verso do flashcard em 390 escuro e as correções de qui P6364cfb e fís P5b8f3493.

**Listas completas** em `dados/`, ao lado deste arquivo:
- `qa3_dados_out.json`: contagens e achados por categoria;
- `qa3_frac.json`: divisão que sobra na linha, trecho a trecho;
- `qa3-contagens.json`: números lidos na tela;
- `qa3-amostra-out.json` e `qa3-amostra-frac-out.json`: as questões abertas no navegador;
- `qa3-telas.json`, `qa3-flash.json` e `qa3-larguras.json`: simulados e fichas, flashcards e as 4 larguras nos 2 temas;
- `scripts/`: os scripts usados, para a próxima rodada.

## Parte 1: situação dos itens das rodadas anteriores

| # (20/11) | Problema | Situação 21/11 |
|---|---|---|
| 1 | Divisão na linha depois do empilhamento | **Parcial.** Os casos com "÷" da 2ª rodada sumiram: teoria e "No caderno" 0 (eram 14), frase mat-k006 reescrita, flashcards 0. Na tela, qui P6364cfb mostra "V1 = 0,05 sobre 25" empilhado. Sobram 3 "÷" na correção (mat 810f54c4, mat P7b617002, fís P7d7dd5eb). O padrão que mais aparece agora é outro: grupo com expoente sobre número, "(x + 4)²/25" (ver N1). |
| 2 | Toda Matéria e outros sites didáticos no material | **Resolvido.** mat-d022 agora cita mathworld.wolfram.com. O `dic` não tem mais nenhuma fonte de site didático. O script não acha Brasil Escola, Mundo Educação, Prepara Enem, InfoEscola nem Toda Matéria em resoluções, teoria, flashcards, frases, dicionário, glossário ou revisão. Os únicos "toda matéria" são a expressão comum: qui P801606f5, fís P7af99cc3, geo Pabfe899e e por P03, cartão 6. |
| 3 | Ficha do IME e da UFRR com Brasil Escola | **Resolvido.** `#/provas/ime` mostra ime.eb.mil.br; `#/provas/ufrr` mostra ufrr.br/cpv e editais.ufrr.br. Problema parecido em outra tela: N2. |
| 4 | Conceito que entrega a resposta em Revisão > Marcadas | **Resolvido.** `Revisao.tsx:177` usa `conceitoMarcada` (`logica/escada.ts:22`), que só mostra o conceito de questão já respondida. Os 51 conceitos do tipo "II e IV estão corretas" (bio 29, mat 1, ing 21) continuam nos dados, mas nenhuma tela os mostra antes de o aluno responder. |
| 5 | "Talvez" e "provavelmente" em `erradas` de Física | **Resolvido** nos 2 (fís P42ae2d37 e Peed4a9aa). Há 1 caso novo de "chuta": N4. |
| 6 | Sessão de flashcards mostra o fim da sessão de outra matéria | **Resolvido.** Terminei a sessão de Matemática (20 cartões) e a de Biologia. Depois, "Começar" em Português e o endereço direto de Física e de Geografia abrem "Flashcards · 1 de 20" da matéria certa. A rota agora usa `NovaPorVisita` (`App.tsx:70-71`). |
| 7 | Questões sem resolução | **Parcial: de 23 para 10.** mat P17aea30d; por Pfc99ec33, P448cc999, P888a1ba3, P0aaed1c4, Pd7b11d0e, Pe350965f, Pb816c091; geo Pd4ca228f; his P881983dc. Na tela (geo Pd4ca228f, por Pfc99ec33) aparece o aviso "ainda está em revisão" com o gabarito, sem tela quebrada. São as mesmas 10 que faltam nas provas completas: das 812 questões de prova sem `res` próprio, 802 usam a resolução da duplicata no banco. Pendência de conteúdo (pacote E). |
| 8 | Aviso "Só N questões do ENEM neste tema" | **Resolvido.** O aviso do tema não traz mais número (`AvisoRegiao … semNumero`, `Tema.tsx:142`). Nos 106 temas, nos dois filtros, nenhum número de questões aparece no nível do tema. |
| 13 (sug.) | Questão só de texto sem link antes da aba Fonte | **Não mexido (sugestão).** `QuestaoCartao.tsx:175` continua mostrando o link só quando não há print. |
| 14 (info) | Conteúdos sem questão | **Melhorou.** Agora só S06.3 (Movimentos do campo e luta pela terra) não tem questão. L01.5 e L08.4 ganharam questões. O tema S06 esconde esse conteúdo da lista ("5 conteúdos"), e o endereço direto mostra "Este conteúdo ainda não tem questões. Elas estão em preparação." Informação. |

## Parte 2: achados novos

### N1. Fração na linha quando o numerador é um grupo com expoente ou uma potência (ERRO: "Fração sempre empilhada", CLAUDE.md)
- **Tela:** correção da questão (blocos 1, 2 e 4 e a resolução animada). Visto em 1280 claro e em 390 claro. Prints: `r3-dados-questao-frac-390-claro.png` e `r3-dados-frac-fis-P5b8f3493.png`.
- **O que está errado:** o detector não empilha quando o numerador é um grupo entre parênteses com expoente depois, nem quando é uma potência escrita com `^( )`. Exemplos na tela:
  - mat P5cb97bb6, "Resposta correta": "Alternativa A — (x + 4)²/25 + (y − 3)²/9 = 1". No passo 3 da animação, a mesma equação aparece escrita à mão em linha.
  - fís P5b8f3493, "Resposta correta": "cos θ = 1 − (x₁ − x₀)²/(2ℓ²)". O passo 4 da animação também está em linha, e no passo 1 "√(ℓ/g)" e "= g/ℓ" ficam na linha.
  - qui Pd1b2c6cf, resposta: "Mm(ΔT − 100)/(Ke + Kc)".
  - Outros: mat P12f2c58e "(√3)²/2"; fís P4db22f5e "(mg)²/(2kF)"; fís Pbc3a3190 "9·10⁹·(10⁻⁷)²/(0,02)²"; mat Pb572cf81 "20^(n−1)/27^n".
- **Quantas:**
  - **89 questões** têm esse tipo de trecho nos campos que a correção mostra: qui 13, mat 43, fís 33. Lista em `dados/qa3_frac.json` (`qids`).
  - Fora da animação, em `resposta`, `armadilha` e `erradas`, são 28 trechos em 24 questões. Na tela, o texto fora da animação confirmou 31 dessas questões.
  - A animação usa outro desenho (texto à mão em SVG) e o script de tela não lê esse texto, mas o print mostra que o mesmo padrão sai em linha também nela.
  - Nas 60 questões aleatórias de Mat, Fís e Quí, só 1 tinha resíduo, e era uma fração dentro de expoente, o que é aceitável.
- **Também ficam na linha** (3 com "÷"):
  - mat 810f54c4, `erradas.C`: "p ÷ (p − 5)";
  - mat P7b617002, conta: "15° ÷ 15°/h";
  - fís P7d7dd5eb, nota do quadro: "alcance ÷ tempo de voo";
  - qui P13b1944f, `erradas.A`: barra em cadeia "27,1/164/3".
- **Onde no código:** `app/src/logica/fracao.ts:34` (`TERMO`). A alternativa `GRUPO` (linha 32) não aceita expoente depois do parêntese (`[²³…]` ou `^…`), e o operando simples não aceita base com `^( )` antes da barra. O motor da animação (`app/src/logica/motorConta.ts`) segue o mesmo critério.
- **Como corrigir:**
  - No `TERMO`, aceitar expoente depois de `GRUPO` (`${GRUPO}[²³⁴⁵⁶⁷⁸⁹¹⁰⁻]*` e `${GRUPO}(?:\^\([^()]*\)|\^\S+)?`) e potência `x^(…)` como numerador ou denominador.
  - Rodar de novo o teste de fração com estes 89 ids.
  - Os 4 casos com "÷" e a barra em cadeia saem reescrevendo o dado (banca da matéria).

### N2. Tela do simulado mostra "Brasil Escola" e notas internas da coleta (ERRO: "Questões de sites didáticos saem", CLAUDE.md: "nem print, nem foto, nem logo, nem nome")
- **Tela:** configuração do simulado da prova inteira (`#/simulados/prova/<id>`). Visto em todas as larguras e nos dois temas, sem rolagem lateral. Print: `r3-dados-simulado-nota-uerj.png`.
- **O que está errado:**
  - O parágrafo abaixo do número de questões é o campo `nota` da prova, gravado para registro.
  - Em **50 das 399 provas**, a nota cita o Brasil Escola. Exemplo, `uerj-2021`: "Arquivos obtidos em cópia pública (Brasil Escola): o site da UERJ não permite acesso automático."
  - Em `anhembi-2022`: "Caderno e gabarito oficiais da Vunesp, em cópia pública no Brasil Escola (vestibular.brasilescola.uol.com.br): o portal da Vunesp bloqueia acesso automático."
  - Em `uea-2025`: "…baixados da página de downloads do Brasil Escola (link do dono; …)".
  - Além do nome do site, o aluno lê detalhes internos da coleta: "acesso automático", "link do dono".
- **Provas afetadas:**
  - anhembi-2022;
  - einstein-2021, einstein-2021-2-enf, einstein-2022-2-enf, einstein-2023;
  - fmj-2021, fmj-2022;
  - santacasa-2021, santacasa-2022, santacasa-2022-demais;
  - saocamilo-2021-2, saocamilo-2022-2;
  - uea-2021, uea-2021-bio, uea-2025 (-bio, -exa, -hum), uea-2026 (-bio, -exa, -hum), uea-2027 (-bio, -exa, -hum);
  - uea-sis3-2020, uea-sis3-2021, uea-sis3-2025, uea-sis3-2026, uea-sis3-2027;
  - uerj-2021, uerj-2022, uerj-2023, uerj-2025-1, uerj-2025-2, uerj-2026-1, uerj-2026-2, uerj-2027-1;
  - uft-2023-2;
  - unicamp-2021, unicamp-2021-exh, unicamp-2022, unicamp-2023, unicamp-2024, unicamp-2025, unicamp-2026, unicamp-2027;
  - unicamp-indigena-2021, unicamp-indigena-2022.
  - Lista em `dados/qa3_dados_out.json` (`R.site_provas_fontes`).
- **Onde no código:** `app/src/telas/SimuladoExec.tsx:47` passa `prova?.nota` para `ConfigSimulado`, que mostra o campo na linha 71. Os dados estão em `app/public/conteudo/provas/<id>/prova.json` (`nota`). O campo `origem` das 88 provas também cita o Brasil Escola, mas não aparece na tela. É registro, e está certo ficar.
- **Como corrigir:** não mostrar `nota` ao aluno, ou mostrar só uma frase própria para ele (prova, dia, quantas questões, "anuladas ficam fora"). O registro da cópia usada fica no `origem`, que o site não mostra.

### N3. Questões da São Camilo sem número e com link para página de questão ou blog da Estratégia, descrito como "PDF de resolução publicada" (ERRO: princípio 1, fonte com prova, ano, número e link)
- **Tela:** cabeçalho da questão e rodapé da correção, 1280 claro (bio Pe9ee0e1, mat Pa8482f6).
- **O que está errado:**
  - O cabeçalho mostra só "São Camilo 2014 · Fase Única · Vunesp", sem o número da questão. A correção mostra "Gabarito oficial publicado · São Camilo 2014", também sem número.
  - O rodapé diz "Fonte: PDF de resolução publicada, com a prova", mas o link é uma página de questão do banco da Estratégia (`vestibulares.estrategia.com/public/questoes/…`), não um PDF.
  - Em bio P113600a (São Camilo 2022), o link é um post de blog ("…/portal/atualidades-e-dicas/questoes-sobre-virus-e-bact…").
- **Questões (10, todas no ar):**
  - bio: Pe9ee0e1 (2014), Pf2fba16, P00898a3, P0d5c067 (2015), P94475b9, Pe1879a7 (2021), P113600a (2022);
  - mat: Pa8482f6 (2014), Pf2653f4, P2e9de75 (2015).
- **Onde no código:**
  - O dado está em `bio/banco.json` e `mat/banco.json` (`n` vazio, `url` da Estratégia).
  - O rótulo vem de `app/src/logica/origemLink.ts:11` (estrategia.com na lista `CURSINHOS`) e da linha 34, que dá a todo cursinho o rótulo "PDF de resolução publicada, com a prova".
- **Como corrigir:**
  - Achar o número no caderno oficial da São Camilo do ano e trocar o link pelo caderno (para 2021 e 2022, as provas já existem no site em formato completo).
  - Até lá, rótulo próprio para página de questão de cursinho ("Página da questão em site de cursinho"), não "PDF".
  - O post de blog (P113600a) se parece com site didático: o dono decide se a questão fica sem a prova oficial.

### N4. "Chuta" em "Por que eu errei" de Física (ERRO de estilo, skill resolucao-exercicios, mesma regra do item 5 da 2ª rodada)
- **Onde:** fís Pacdab1ea (Famema 2022, q. 38), `erradas.D`: "Quem marca D chuta uma média com quadrados." Visto na tela, no bloco "Por que eu errei" e em "Por que as outras estão erradas". Aparece também na resolução do simulado famema-2022.
- **Como corrigir:** dizer o que o aluno fez ("Quem marca D tira uma média dos quadrados…"), sem supor chute.
- Os outros "talvez", "chuta" e "provavelmente" em `erradas` (por P6a467b8, P472e37e, P19dcb70, P256792e, Paea75665, P10140bec, P80154a7b; ing Pf3356411) citam palavras do texto da prova. Estão certos.

## O que conferi e passou
- **Contagens na tela = banco, sem nenhuma diferença.**
  - Com "Todas as regiões", a soma dos conteúdos nos 106 temas bate com o banco disponível, conteúdo por conteúdo: bio 2868, qui 2971, mat 3797, por 4991, fís 2796, geo 2580, his 2440, fs 1458, ing 2506.
  - Com "Minha região" (só ENEM), cada conteúdo mostra as questões do ENEM ou, quando não há nenhuma, todas as regiões.
  - A matéria não mostra quantidade do banco, só "15 itens por rodada…". O tema mostra "N conteúdos" e porcentagem.
  - Única diferença esperada: S06.3, vazio, fica fora da lista.
  - 0 erros de console.
- **Banco** (total / no ar / indisponíveis / pendentes / outra matéria / anuladas Aprendice):
  - bio 2894/2868/11/15/13/0
  - qui 2989/2971/12/6/0/1
  - mat 3817/3797/15/5/0/5
  - por 5021/4991/12/18/10/1
  - fís 2809/2796/8/5/0/4
  - geo 2592/2580/9/3/0/0
  - his 2444/2440/0/4/2/1
  - fs 1598/1458/0/140/139/0
  - ing 2508/2506/0/2/0/1
- **Fora da tela:** as 9 questões pendentes testadas (uma por matéria) dão "não encontrada" pelo endereço direto. As 6 indisponíveis testadas abrem só com o print e o selo "Erro no gabarito oficial, sem errata da banca. Só para consulta.", sem botões de resposta e sem gabarito.
- **Subtemas novos:**
  - M08.6 ("Áreas de figuras simples, unidades e escala", 23 questões) e M11.6 (26) estão no tema, com questões que abrem e se corrigem (mat a541e032, c48f4d25).
  - Nenhum conteúdo do banco fica fora da lista de conteúdos do tema.
- **Fonte e gabarito:**
  - Toda questão no ar tem escola, ano e link http, menos o número nas 10 da N3.
  - Nenhuma `origem: 'site'` no ar.
  - Gabarito dentro das alternativas em todas. qui P859363c tem `alts` vazio no banco, mas a tela mostra A a E pelo texto da prova e corrige.
  - Gabarito do Aprendice no ar: bio 88, qui 103, mat 106, por 111, fís 104, geo 73, his 71, fs 16, ing 78. As 9 da amostra mostram o aviso "Gabarito do Aprendice: a banca não publicou gabarito oficial".
  - Provas completas: 399 provas e 25.947 questões. Gabarito em A–E. Nenhuma resolução com `erradas` faltando.
- **Correção:**
  - Em todas as questões com resolução, `erradas` cobre todas as letras erradas, e há resposta, passos e armadilha (0 campos vazios). Nenhuma explica a letra certa em `erradas`.
  - Na amostra, 73 questões foram respondidas com letra errada. As 71 que têm resolução mostraram "Por que eu errei", "Resposta correta", a resolução e "Por que as outras estão erradas", nessa ordem. As 2 sem resolução mostraram o aviso. Nas 149 questões da varredura de frações, todas as 149 mostraram "Por que eu errei".
- **Sites didáticos:**
  - 0 no nosso material.
  - Restam só no texto copiado da prova (decisão do dono): 4 enunciados no banco (bio P726efe3; qui Pa49bb58, Pa2be10a, P7ac905b) e 179 trechos em `txt/`.
  - No JS do build, só a lista de domínios de `origemLink.ts`, usada para esconder esses sites, que não aparece na tela.
  - Exceção: o campo `nota` dos simulados (N2).
- **Emoji e glifos no nosso material:** 0 em resoluções, teoria, flashcards, frases, dicionário, revisão e resoluções das provas completas.
- **Flashcards:**
  - Todos os 540 cartões de texto e as 360 frases têm `fonte`. Os 27 cartões com imagem têm `credito` ("Servier Medical Art, CC BY 3.0" etc.), que o verso mostra como "Fonte: …".
  - Sessões de 20 cartões em Mat e Bio: todos os versos com "Fonte: …" (openstax.org, ncbi.nlm.nih.gov, mathworld.wolfram.com, medlineplus.gov…), nenhum site didático, nenhum "÷".
- **Larguras e temas** (tema M08, questão mat P5cb97bb6 com correção, simulado UERJ, verso de flashcard bio, tema S06; 390, 768, 1280 e 1440 px; claro e escuro):
  - nenhuma rolagem lateral;
  - nenhum texto cortado nos blocos da correção;
  - nenhum emoji;
  - nenhum erro de console ou de rede.
  - O único fundo branco puro medido é o quadro do print da prova (`.q-print-img`), que é o papel da prova. É da área questão-correcao, não de dados.
- **Imagens:** nenhuma imagem quebrada nas 237 questões abertas. Todo print de questão no ar existe no disco (0 faltando).

Total: 4 ERROS, 0 DECISÕES DO DONO
