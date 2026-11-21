# Revisão do site, 20/11/2026 (2ª rodada): dados

Revisor independente, só leitura. Build do commit `b20901f9a` (ramo `app-prototipo-completo`) servido em http://localhost:4190 (pasta /tmp/qa). Dados lidos de `/tmp/qa/app/public/conteudo` e `app/conteudo-fonte`. Comparado com `docs/revisao-site/2026-11-19/dados.md` (1ª rodada). Os itens que o PLANO deixou "para o dono decidir depois" não entram como problema.

Listas completas em `dados/`, ao lado deste arquivo:

- `qa2_dados_out.json`: contagens por matéria e achados nos dados (sites didáticos, palavras proibidas, emoji e glifos, sem resolução, conceito que entrega a resposta, região);
- `qa2_frac_real.json`: divisão que sobra na linha **depois** do empilhamento, pelo detector do próprio site (`app/src/logica/fracao.ts`, compilado do build), sem datas, números de lei e códigos de prova;
- `qa2_http_out.json`: teste HTTP de cada imagem;
- `qa2-dados-contagens.json`: números lidos na tela (matéria e cada tema, com "Minha região" e "Todas as regiões");
- `qa2-dados-amostra-out.json`: as 60 questões abertas no navegador;
- `qa2-dados-telas.json` e `qa2-dados-flash.json`: aba Fonte, fichas de vestibular, simulados, resumos, Revisão > Marcadas, ÷ na tela e as sessões de flashcards das 9 matérias.

**Resumo.** Das 14 pendências da 1ª rodada: 9 resolvidas, 3 parciais, 1 não mexida (sugestão 13) e 1 era informação. As contagens batem 100% com o banco e nenhuma das 53.018 imagens falhou. Ficam 7 problemas novos ou restantes que exigem correção: divisão na linha em 102 questões e 14 trechos de teoria; Toda Matéria no flashcard mat-d022; Brasil Escola como fonte nas fichas do IME e da UFRR; conceito com a resposta em Revisão > Marcadas; "talvez" e "provavelmente" em 2 explicações novas de Física; a sessão de flashcards que mostra a sessão anterior de outra matéria.

## Parte 1: situação de cada problema da 1ª rodada

| # (19/11) | Problema | Situação 20/11 |
|---|---|---|
| 1 | Sessão de flashcards de Português fica em branco | **Resolvido.** 20 cartões seguidos em cada uma das 9 matérias, incluindo os de Português com fonte em texto (ex.: "Camões, soneto … · pt.wikisource.org"), sem tela em branco e sem erro de console. |
| 2 | Gabarito do Aprendice como "Publicado" na aba Fonte | **Resolvido.** bio P6bb641ed e ing Pdca19115 mostram "Gabarito do Aprendice: a banca não publicou gabarito oficial" antes de responder (`.q-gab-ap`) e na aba Fonte. Print: `qa2-dados-fonte-gab-aprendice.png`. |
| 3 | ÷ ou a/b na linha na correção | **Parcial.** De 535 + 173 questões caiu para **102 questões / 125 trechos** (qui 30, mat 42, fís 29, geo 1). Ver o problema novo 1. |
| 4 | Frações na linha em flashcards, frases e teoria | **Parcial.** Flashcards: 0 (eram 62). Frases: 1 (eram 2). Teoria e "No caderno": 14 trechos (eram 81 + 39). Ver o problema novo 1. |
| 5a | Fonte de site didático em flashcards e frases | **Parcial.** Os 99 cartões da lista foram trocados. Sobra **mat-d022** com "Fonte: todamateria.com.br", visto na sessão de Matemática (problema novo 2). O dicionário guarda fontes de sites didáticos, e a ficha do IME e a da UFRR mostram Brasil Escola (problemas novos 2 e 3). |
| 5b | Texto da prova oficial cita o site | Decisão do dono: o texto fica. Não é problema. |
| 6 | Quantidade de questões no tema | **Resolvido.** A lista de temas mostra "6 conteúdos 0%", e a página do tema mostra conteúdos e porcentagem. Resta só o aviso de poucas questões, que mostra o número no tema (sugestão 8). |
| 7 | "Imagem em preparação" no resumo | **Resolvido.** Nenhum texto "em preparação" nos resumos de qui Q04.3, fís F01.1 e geo G01.1. |
| 8 | Provas sem cadastro (Anhembi, Fema, UEMG) | **Resolvido.** O catálogo tem as três: Sudeste, SP/SP/MG. Fichas `#/provas/anhembi`, `uemg` e `fema` abrem com cidade e UF. Em "Minha região" do aluno só ENEM, nenhuma das três aparece. As 399 provas do índice têm região. |
| 9 | 23 questões sem resolução | **Não (pendência do pacote E).** Continuam 23: mat P528013c1, P17aea30d; por Pfc99ec33, P448cc999, P888a1ba3, Pcfc26fc6, P93ec458e, P0aaed1c4, Pedde3b3b, Pb61271f8, Pdaf43568, Pd7b11d0e, Pe350965f, Pe0b0afd4, Pa1c1cf9f, Pb816c091; fís Pcf680d36, Pf4c499ee, P9615ec2a; geo Pd4ca228f, P9688242b; his P881983dc, Peefa95fe (Peefa95fe passou de Português para História na reclassificação). |
| 10 | Palavras proibidas em `erradas` | **Resolvido** nos 20 da lista. Sobram só citações do texto da prova (por P6a467b8, P472e37e, P19dcb70, P256792e; ing Pf3356411), que são aceitáveis. Há **2 casos novos em Física** (problema novo 5). |
| 11 | Emoji e glifos no nosso material | **Resolvido.** Nenhum ✓ ✗ ✔ ♪ nem emoji em resoluções, teoria, flashcards, frases, revisão em slides ou resoluções das provas completas. Os que restam (♀ ♦ ➢ ➔ 👊 🖤) estão no texto copiado das provas: decisão do dono, ficam. |
| 12 | Ícones antigos no código | **Resolvido.** `app/src/assets/ic3d/` não existe mais. |
| 13 | Questão só de texto sem link da fonte no enunciado | **Não mexido (sugestão).** 18 das 60 questões da amostra são só de texto e não mostram link para a prova antes da aba Fonte ou da correção. O link do cabeçalho só aparece sem print (`app/src/ui/QuestaoCartao.tsx:174`), e o do pé do print só aparece no print (`:190`). |
| 14 | Conteúdos de Filosofia e Sociologia sem questão | Informação, sem mudança: L01.5, L08.4, S06.3. |

## Parte 2: problemas novos ou restantes

### 1. Divisão na linha que sobra depois do empilhamento (erro: "Fração sempre empilhada", CLAUDE.md)
Agora todo texto da correção, da teoria, dos flashcards e das frases passa por `comFracoes` (`app/src/ui/Fracao.tsx`). Mesmo assim, o detector deixa na linha estes casos:
- **"÷" entre palavras, letras ou números com unidade:** "0,05 mol ÷ 25 mol/L", "60 Ah ÷ 120 h", "10 colheres ÷ 2 colheres/porção", "750 mil km² ÷ 193 mil km²", "L ÷ A", "n ÷ V", "área de H2 ÷ área de H1", "V de Júpiter ÷ V da Terra".
- **"÷ n" sem numerador:** a anotação da operação, como "(÷ −2)", "(÷ 3)", "÷ 1000", "÷ 2 colheres", e notas de quadro como "÷ tempo", "÷ potência". Mostrar essas operações empilhadas pede uma regra do dono. Até lá, elas continuam como "÷" na linha.
- **Barra em cadeia ou com unidade:** "63/0,9325/1,497" (qui P6ac9fb74), "26,98/101,96/0,9004" (qui P6272cc3b), "6/5 V" e "14/5 V" (fís Pd5853aa0), "(52,94 + … + 104,02)/8" (mat P6a213028).

Visto na tela, com a correção aberta em "Ver sem animação", em 14 de 15 conferidas (mat P6a213028 não mostrou na tela): qui P6364cfb, P6ac9fb74, P40de42d, Pc66e8de, P1878728b; fís Pe4c077d9, Pd5853aa0, P25b80308, P043ab4eb; mat 5557e7da, 3b95e1c3, P2d3de3fb, P9cbf11e; geo P8c680f16. Prints: `qa2-dados-div-<m>-<id>.png` na pasta de rascunho da sessão.

Questões (ids):
- **qui (30):** P1878728b, P1e69be0, P2038c050, P31f6aad2, P3ac23c32, P40de42d, P50f526e0, P52033bfa, P6252428, P6272cc3b, P6364cfb, P6ac9fb74, P7019f9be, P75918ef3, P7e36e0a3, P846744ea, P9a5ca403, P9e7677c0, Pa49bdbfc, Pa6f4e564, Pb68d5e0, Pbae062f0, Pc60088f0, Pc66e8de, Pc6b60791, Pc80b5f52, Pd62f488, Pd727bf6a, Pfbd76a3d, Pffedef4b
- **mat (42):** 3b95e1c3, 43d5b5c0, 5557e7da, 7565e0e4, 7fa8608d, 99dc3b22, E45b9cc5, E6b22f4b, Ea192016, P0288ac33, P1516ed12, P2d3de3fb, P515fd1c, P53b34381, P5c82ae08, P5d5398c3, P6a213028, P6e7b4665, P71b348ec, P7926fba6, P7f942c15, P89713e07, P92cfd74e, P9cbf11e, P9ebbb09, Pada82f91, Padf9ba62, Pc43b444, Pc79dc928, Pcb18998, Pcc60c7b7, Pdfe312a, Pe56e85ad, Pfd6de9f4, b33f37d1, b60997a0, b6ed856c, ca0b2984, ddea88c2, e0cedb17, ed42fec6, f0c51255
- **fís (29):** P043ab4eb, P04ec80a5, P12bafe82, P1e1ff85d, P25b80308, P28bb0a51, P40fce454, P41ba88ac, P48b577c0, P598ef723, P5a8c57f8, P5d8f3023, P5f7ff111, P5fa24d46, P71c3d819, P74508765, P7f9a5dd4, P8e063ad1, P91faec86, Pa64d467d, Pb6f57afa, Pc2ea4980, Pc99cb490, Pd5853aa0, Pd81b602d, Pe486a966, Pe4c077d9, Pe666182f, Pe76f3ccd
- **geo (1):** P8c680f16

Teoria e frase (14 trechos + 1). Vistos na tela no Q05, Q08, M02, M14 e M16 (prints `qa2-dados-div-teoria-*.png`):
- qui Q04 caderno "% elemento = massa dele na fórmula ÷ M × 100"; Q05 fórmulas "massa de soluto (g) ÷ volume de solução (L)", "mol de soluto ÷ volume de solução (L)", "massa (g) ÷ massa molar"; Q06 caderno "xᵢ = nᵢ ÷ n(total) = % em volume ÷ 100"; Q08 fórmulas "concentrações dos produtos multiplicadas ÷ concentrações dos reagentes…"; Q08 caderno "Kc = [C]ᶜ·[D]ᵈ ÷ ([A]ᵃ·[B]ᵇ)".
- mat M01 caderno "÷3: soma dos algarismos ÷3 · ÷5: …"; M02 fórmulas "escala = medida no desenho ÷ medida real"; M02.5 o que é "total × peso ÷ soma dos pesos"; M13 caderno "célula ÷ total da linha ou coluna dada"; M14 fórmulas "soma dos valores ÷ quantidade", "Σ(valor × peso) ÷ Σpesos"; M16 caderno "resto de P(x) ÷ (x − a) = P(a)", "÷ (x + 3): calcule P(−3)".
- Frase para completar mat-k006: "verdadeiros positivos ÷ total de ___".

Detalhe trecho a trecho em `dados/qa2_frac_real.json`. Ficaram fora da conta, por serem falsos positivos: 20 datas (24/02, 07/05…), números de lei (13.104/2015), códigos de prova (2021/2, 2027/1) e o "64/2005" da circular da Embrapa.

### 2. Toda Matéria e outros sites didáticos ainda no nosso material (erro: "Questões de sites didáticos saem", CLAUDE.md; Toda Matéria incluída a pedido do coordenador)
- **Flashcard mat-d022** (triângulo equilátero): fonte `https://www.todamateria.com.br/triangulo-equilatero/`. Aparece no verso como "Fonte: todamateria.com.br" (conferido na sessão de Matemática). O commit 6fcfd743d trocou as fontes Toda Matéria de 250 cartões, mas este ficou.
- **Dicionário (`dic`)**: hoje não aparece em nenhuma tela, mas vai publicado no `materia.json` servido ao navegador.
  - qui: CNTP e CATP (Prepara Enem), VSEPR (InfoEscola);
  - mat (19): determinante, xᵥ e yᵥ, SPD/SPI/SI, regra de Cramer, retas concorrentes, retas coincidentes, raiz dupla, produto notável, sistema linear, matriz transposta, diagonal principal, juros simples, juros compostos, permutação com repetição, média ponderada, média geométrica, condicional, conectivo (Toda Matéria); logaritmando (InfoEscola).
- **Fontes consultadas das resoluções** em `app/conteudo-fonte/provas/*/resolucoes-*.json` (campo `fontes` e `gabarito_aprendice.fontes_web`): 18 entradas Toda Matéria em Português (udesc-2024-1, ufam-psc3-2023, ufpr-2021/2024/2025, ufu-2020/2022, unespar-2024, unirg-2026-2, unitins-2020-1/2022-1-med/2025-1, urca-2027-1) e 2 links de download do Brasil Escola (ufrr-2025 Pef116c84, unicamp-indigena-2022 P78bf7103). Isso não chega ao site: o converte não publica esses campos. É o registro da fonte consultada que o CLAUDE.md pede ("a fonte consultada fica registrada"). Fica como informação, não como erro.
- Falsos positivos descartados: "toda matéria" usado como expressão comum em qui P801606f5, fís P7af99cc3, geo Pabfe899e, por P03 cartão 6 e nas resoluções das provas completas.

### 3. Ficha de vestibular com Brasil Escola como fonte (erro, mesma regra)
- Onde: `#/provas/ime` e `#/provas/ufrr`, 1280, claro, `.fontes`. Mostra "Fontes: vestibular.brasilescola.uol.com.br", com link para `https://vestibular.brasilescola.uol.com.br/downloads/…`.
- Causa: `fontes` do `app/conteudo-fonte/catalogo-vestibulares.json` (ime e ufrr), mostrado por `app/src/telas/Provas.tsx:102`.
- Deveria: a fonte oficial (site do IME, editais da UFRR), sem nome nem link de site didático. Print: `qa2-dados-prova-ime.png`.

### 4. Conceito que entrega a resposta em Revisão > Marcadas (erro: princípio 5 e materias.md 19/11 item 1)
- O conserto da escada funcionou: o conceito só aparece depois de responder (`app/src/logica/escada.ts:16`).
- Mas a aba "Marcadas" de `#/revisao` mostra `q.conceito.slice(0, 80)` (`app/src/telas/Revisao.tsx:168`) também para questão que o aluno marcou **sem responder**. Teste: marcar bio P372650c4 sem responder. A lista mostra "Biologia · Só II e IV estão corretas: depois da fase S…", ou seja, a resposta. Print: `qa2-dados-marcadas-conceito.png`.
- O commit 4a4665777 limpou só os 40 conceitos que citavam a letra. Ainda há **49 conceitos** que dão a combinação certa das afirmativas ("II e IV estão corretas"):
  - bio (29): P372650c4, P8c6b81f4, Pfa8485e7, Pe937a29f, P665fb585, P2ea30ef7, Pe508573f, P0feb6779, P418b8d9d, Pefc72313, P80e2ddfc, Pcd60b0e5, P5ba66958, P3e03b278, P40741f1a, P348dbe8f, P6d956a1f, P4d0ae8b5, P4b99f826, P13af8a0e, P8116e055, Pa4b41ede, P4cf45df6, P54b7f7a5, Pd0119f0c, P7980e26a, P04e7a11f, e também P89f4c23b e P53f12144 (que descrevem a resposta);
  - mat (1): P7b775975;
  - geo (2): P69faaf22 e Pfde6e99d, que dizem qual é a afirmação incorreta;
  - ing (17): Pd1894934, Pdb7dcaa7, Pfe6fd890, P429e5900, Pbb0f64f6, P1a342cb0, P90c386ec, P66ca168a, P6ef47deb, Paf7c00ff, P11eff4f6, P06df49e1, P548253d6, Ped626dfb, P275a7a31, P6560f3e4, P3faf5ffd.
- Deveria: Marcadas não mostra o conceito de questão não respondida (o mesmo critério da escada), ou o conceito nunca dá a resposta. Lista crua em `dados/qa2_dados_out.json` (`R.conceito_entrega`). Também entram aí falsos positivos que não dão a resposta, como bio P6e13f520, por P1f501be8, P5dd1387d, geo Pacb380e6 e ing P46150caa.

### 5. "Talvez" e "provavelmente" em explicação nova de Física (erro de estilo; skill resolucao-exercicios)
- fís P42ae2d37 (Unicamp 2021, q. 55), `erradas.A`: "Talvez tenha lembrado do i² de P = R × i²…".
- fís Peed4a9aa (Unicamp 2023, q. 31), `erradas.C`: "Quem marca C provavelmente usou 10 no lugar da altura…".
- Os dois são "Por que eu errei" e aparecem também nas resoluções das provas completas (simulados).
- Fora de `erradas` há 379 ocorrências (talvez 220, provavelmente 82, chute 41, distrator(es) 27, chutar 8, outra 1). A regra não proíbe nesses campos; os números são só contagem.

### 6. Sessão de flashcards mostra a sessão anterior de outra matéria (erro, regressão ou falha que a 1ª rodada não pegou)
- Passos: terminar a sessão de Matemática (`#/m/mat/flashcards/sessao`). Depois abrir Flashcards de Português e clicar em "Começar" (`button.tp-comecar`), ou ir direto a `#/m/por/flashcards/sessao`.
- O que está: aparece "Sessão concluída · 0 Acertei · 0 Quase · 20 Errei…", o resultado da sessão de Matemática, em vez do 1º cartão de Português. O mesmo acontece em Física, História, Geografia, Inglês, Filosofia e Sociologia, Biologia e Química. Só recarregar a página resolve.
- Causa provável: `/m/:m/flashcards` e `/m/:m/flashcards/sessao` usam o mesmo componente (`app/src/App.tsx:60-61`, `<Flashcards>`). O estado de fim de sessão não volta ao começo quando muda a matéria ou a rota.
- Deveria: abrir a sessão nova da matéria escolhida (princípio 6, rotina sem atrito). Registro em `dados/qa2-dados-flash.json` (`nav_<m>`).

### 7. Questões sem resolução (pendência do pacote E)
- As mesmas 23 da tabela acima. A correção mostra só o aviso de resolução em revisão (conferido em his P881983dc na amostra).

### 8. Aviso "Só N questões do ENEM neste tema" (sugestão, decisão do dono)
- Na página do tema, com "Minha região" (aluno só ENEM), 26 temas mostram, por exemplo, "Só 4 questões do ENEM neste tema" (bio B01).
- É uma quantidade de questões no nível do tema. A regra do CLAUDE.md ("Quantidade de questões aparece só nos conteúdos, não na matéria nem no tema") não prevê o aviso. O aviso pode dizer o mesmo sem o número, ou o dono aceita a exceção.

## O que conferi e passou
- **Contagens (regra nova).** Matéria: nenhuma quantidade do banco. Aparecem só "15 itens por rodada: 6 questões, 4 frases e 5 flashcards" (composição da rodada) e "0 questões resolvidas" (progresso). Lista de temas: "N conteúdos X%". Página do tema: sem número de questões, a não ser o aviso do item 8. Conteúdos com "Todas as regiões": a soma bate com o banco disponível nas 9 matérias (bio 2856, qui 2968, mat 3785, por 4964, fís 2796, geo 2623, his 2467, fs 1453, ing 2514), conteúdo por conteúdo, sem nenhuma diferença. Com "Minha região" (só ENEM), os 590 conteúdos batem com as questões do ENEM, ou com todas quando o conteúdo não tem nenhuma do ENEM (reserva). 0 erros de console nas 9 matérias e 106 temas.
- **Banco servido** (total, no ar, indisponíveis): bio 2881/2856/10, qui 2986/2968/11, mat 3804/3785/13, por 4985/4964/5, fís 2806/2796/5, geo 2632/2623/8, his 2470/2467/0, fs 1592/1453/0 (139 de outra matéria), ing 2516/2514/0. A classificação pela fábrica mudou os números em relação a 19/11.
- **Região.** Todas as questões no ar têm região (`rg`, ou escola conhecida). As 399 provas do índice têm `catalogoId` cadastrado, com UF ou Nacional. O catálogo tem 75 vestibulares; 18 ainda não têm prova no site (unifenas, fgv, maua, uem, uepg, ufsc, ufrgs, bahiana, uefs, uneb, uesb, uncisal, uern, uepa, unb, ufg, uems, ueg-geral), o que é informação, não erro.
- **Imagens (HTTP).** 53.018 pedidos, 0 falhas, nenhum vazio, nenhum caindo no index.html: 26.478 prints do banco, 25.962 prints das provas, 106 ícones de tema (= 106 temas, nenhum sobrando em `ic/`), 27 imagens de flashcard, 203 fotos da revisão em slides (o campo `arquivo`, "File:…", é só o nome no Wikimedia; o site carrega a cópia local em `img`), 37 capas e artes, 2 logos.
- **Dados das questões.** Nenhum gabarito fora das alternativas ou inválido (banco e 25.962 questões das provas completas). Nenhuma questão no ar sem link http. Nenhuma `origem:'site'` no ar. Nenhum conteúdo sem nome ou fora do tema. Toda resolução existente tem resposta, passos, erradas de todas as letras erradas e armadilha (0 campos obrigatórios vazios). Nenhuma explica a letra certa em `erradas`. Nenhuma resolução órfã.
- **Emoji e glifos no nosso material:** 0. Busca em resoluções, teoria, flashcards, frases, dicionário, glossário, revisão em slides e resoluções das provas completas.
- **Amostra de 60 questões em 1280** (`#/m/<m>/q/<id>`; todas as matérias; aleatórias, indisponíveis, gabarito do Aprendice, só texto, sem resolução e com divisão na linha): 0 erros de console, 0 requisições com falha, 0 imagens quebradas, nenhuma tela de erro, nenhuma rolagem lateral. As indisponíveis têm o selo. A correção abriu com "Por que eu errei" e "Resolução" sempre que há resolução. Os únicos achados foram a divisão na linha (item 1) e a falta de link nas questões só de texto (sugestão 13).
- **Flashcards:** 20 cartões em cada uma das 9 matérias (as 5 novas incluídas), sem erro de console e sem fração na linha no verso. O único site didático no verso é o de mat-d022.
- **Simulados:** 399 provas. ENEM com 177 a 179 questões (180 menos as anuladas). "Minha região" do aluno só ENEM sem Anhembi, Fema ou UEMG.
