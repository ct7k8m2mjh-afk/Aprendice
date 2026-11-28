# Revisão do site, 21/11/2026 (3ª rodada), 3ª passada: conferência das correções da 2ª passada

Revisor independente, só leitura (nada foi corrigido). Build servido em http://localhost:4191, commit `14147be9`. Esta passada confere só o que foi corrigido depois da 2ª passada, em três áreas:
- `casca-2.md`, R1–R4;
- `materias-2.md`, R1–R3 (o R4 é decisão do dono e não foi reaberto);
- `dados-2.md`, R1–R2 (o R3 está pendente com o dono).

**Método.**
- **Navegador:** Playwright/Chromium, modo demonstração (perfil no `localStorage`).
- **Casca:** 390, 768, 1280 e 1440 px, temas claro e escuro.
  - Área de toque do Fechar da busca medida com uma varredura por `elementFromPoint` a partir do centro do botão, de 0,5 em 0,5 px.
  - Mais um contexto com toque de verdade (`hasTouch`, `pointer: coarse`).
  - Fluxo seguido: Configurações → link Privacidade → Voltar.
  - Tela de entrada lida: o que ela pede.
- **Matérias:**
  - Legendas das figuras de M03, M06 e M07 nas 8 combinações, com o DOM lido e recortes a 2×.
  - Figura da PG desenhada sozinha a 4×, com `getBBox` de cada texto e de cada barra.
  - Biologia nas 8 combinações, temas B01, B03, B06, B09 e B11: qual imagem aparece em cada tema, e a troca pelo botão Noite.
  - Contraste de todos os textos das 217 figuras únicas de Bio na versão escura, compostos sobre a forma que fica embaixo de cada um.
- **Dados:**
  - O detector atual (`app/src/logica/fracao.ts`, compilado com esbuild) comparado com o detector de antes desta correção em todo o texto de `app/public/conteudo` que o site desenha: resoluções, `materia.json` e `revisao/`, das 9 matérias, com a matéria de cada arquivo.
  - Os 33 casos citados em `dados-2.md` R1, procurados no dado e conferidos na tela.
  - 13 correções abertas na tela, cada uma em 1280 claro e 390 escuro: 7 de His/Geo/Por/Bio e 6 de Mat/Fís.
  - As 399 notas publicadas (`provas/<id>/prova.json`) lidas por script; as 5 telas `#/simulados/prova/<id>` de ime e ufrr abertas.
- **Prints:** `r3p3-*.png` na pasta de rascunho da sessão. Olhados: busca 390 claro e 1440 escuro; legendas t/20 (390 claro), log (390 escuro) e t/6; PG 1280 e o recorte a 4×; Bio Linkage, Hardy-Weinberg, pirâmides e célula animal em 1280 escuro; correções de por P553e8c3b (390 escuro), mat Pba9549df e fís P028bdfa6 (1280 claro).

## 1. Situação item a item

| Origem | Item | Situação | Medida / o que se vê agora |
|---|---|---|---|
| casca-2 R1 | Fechar da busca com área de toque de 44 × 44 a 390 | **resolvido** | 390 claro e escuro: o desenho tem 40 × 40, e o `::before` tem 44 × 44 centrado. A varredura acerta o botão em 44 px em cada eixo. Com toque de verdade (`pointer: coarse`) também dá 44 × 44. |
| casca-2 R4 | Fechar sem encolher em 768/1280/1440 com mouse | **resolvido** | O botão mede 40,0 × 40,0 nas 6 combinações, com `flex-shrink: 0`. Sem rolagem lateral. Com mouse não ganha a área de 44, o que está certo. |
| casca-2 R2 | "Privacidade" das Configurações vira link (modo demonstração) | **resolvido** | Nas 8 combinações, "Detalhes em Privacidade." tem um link sublinhado `#/privacidade` que abre a página. O Voltar da página, porém, leva ao Perfil (ver N1). |
| casca-2 R3 | Texto da Privacidade, no modo demonstração, verdadeiro sobre nome e e-mail | **resolvido** | A tela diz: "**E-mail** que você escreveu ao entrar (e o nome tirado dele, que você pode trocar no Perfil), só neste aparelho. A senha não é guardada nem enviada." A entrada pede só E-mail e Senha (2 campos). As boas-vindas não pedem nome e vão direto a "Quais provas você vai fazer?". O nome vem de `nomeDoEmail` (`BoasVindas.tsx:105`). O texto é verdadeiro. |
| materias-2 R1 | "(½)^(t/6)" (M03, M06), "2^(t/20)" e "log₁/₂ x" (M06) com a fração empilhada | **resolvido** | Nas 8 combinações, "t sobre 6", "t sobre 20" e "1 sobre 2" saem empilhados (`.nt-frac .frac`). Numerador e denominador não se sobrepõem. Os algarismos têm 8,0 px em 390 e 8,3 px a partir de 768, numa linha de 13,5/14 px, o tamanho de um expoente comum. Legíveis nos recortes. A legenda não tem mais nenhuma barra em linha. Sem rolagem lateral. |
| materias-2 R2 | PG de M07, "64 sobre ½", sem encavalar | **resolvido** | Recorte a 4×: a barra principal é mais larga que a interna, e "64", barra, "1", barra e "2" ficam separados. O "1" de dentro começa cerca de 2,4 px abaixo da barra principal, e o "64" termina cerca de 2,3 px acima dela; antes se cruzavam. Valores iguais (= 128). A fração interna continua muito pequena no celular, cerca de 4,8 px a 390, mas isso é o R4, que está com o dono. |
| materias-2 R3 | Figuras de Bio legíveis no escuro, ≥ 4,5:1, e iguais à original no claro | **parcial** | **Troca pelo tema:** certa nas 40 aberturas. No claro aparece só a `fig-claro`, e no escuro só a `fig-escuro`. O botão Noite troca na hora (13 figuras de B11, todas carregadas). **Claro:** a imagem é a `f.u` publicada. 254 das 256 figuras são idênticas byte a byte à de `app-atual/bio/img`; as 2 diferentes são as corrigidas no N1 (fração). **Escuro:** texto claro sobre o cartão escuro. Linkage, Hardy-Weinberg, pirâmides e célula animal ficaram legíveis, sem rolagem lateral. **Contraste:** 51 textos em 20 das 183 figuras com paleta escura ficam entre 3,2 e 4,4:1 (ver N2). |
| dados-2 R1 | Anos, datas, leis, siglas, versos e "120/80 mmHg" não empilham; frações de conta continuam | **resolvido** | **No dado:** os 33 casos citados (Berlim 1884/1885, safras, "De 31/5 a 7/6", "em 3/9", "(10/6)", PL 2.338/23, Lei 9 605/98, LC 14/1973, CONAMA 275/2001, 81/2025-CEV, "Rua 15 / E", "I - H / II - D", "linhas 16/17", T3/T4, 1a/1b, RJ/ES, AC/DC, 24/7, r/s, 120/80 mmHg, ≈1907/1909, 50/50, (13/3), 31/3) já não empilham. **Antes × depois:** 195 trechos deixam de empilhar e **0 passam a empilhar** (bio 33, qui 11, mat 37, fís 7, por 39, geo 49, his 10, F/S 7, ing 2). Os 88 de Bio/Quí/Mat/Fís foram lidos um a um, e nenhum é fração de conta: safras, datas, editais "-CPV", "linha 4/5", "IME 2022/2023", "PF / PE", "HF / HI", "R / P", O2/O3, "50/50", RDC 360/2003, 120/80, 46/47, T3/T4, 1a/1b. **Na tela:** as 8 correções de texto mostram 0 `.frac` e o trecho em linha (ex.: "Rua 15 / E o progresso", "(PL 2.338/23)", "14/1973 (oito RMs) e 20/1974"). Em B07, "PA ≈ 120/80 mmHg" fica sem fração. Nas correções de Mat/Fís seguem empilhadas 67, 22, 54, 27 e 60 frações (P30923db, Pba9549df, P43bd5e45, P028bdfa6, Pe922fcad), todas de conta, e o recorte de fís P028bdfa6 está certo. **Nas matérias de texto ainda empilham 345 trechos:** contas ("62/63 ≈ 0,98", "40/20", "360/α", "1/3 dos que cumpriram pena", "2/3", "P(A ∩ B)/P(B)", "T²/D³"). Os 3 que não são fração não aparecem no site: por P5612db97 `checagem` ("padrão 10/6"), his H06 `pendencias` ("18/3–28/5/1871") e a licença de foto de F/S (desenhada sem `comFracoes`). |
| dados-2 R2 | 399 notas sem contradição nem site didático; ime-2024/2025 e ufrr-2024/2025/2026 com nota verdadeira | **resolvido** | **As 399 notas:** nenhuma vazia, nenhuma cita site didático, link ou detalhe interno, e nenhum `nota_revisoes` foi publicado. Nenhuma diz ao mesmo tempo "foi publicado" e "não publicado". Toda nota que fala em "gabarito do Aprendice" é de prova que o usa, e vice-versa. **ufrr-2024:** "Gabarito oficial definitivo: Edital 90/23-CPV (11/12/2023), Anexo I… Anuladas: 5, 23, 43 e 68.", com 0 de 72 questões no gabarito do Aprendice. "90/23-CPV" aparece em linha na tela. **ime-2024, ime-2025, ufrr-2025 e ufrr-2026:** "O gabarito definitivo foi publicado pela banca, mas ainda não foi conferido pelo Aprendice; até lá, vale o gabarito do Aprendice (…)". Isso confere com o dado: 39 de 40, 39 de 40, 67 de 69 e 69 de 71 questões no gabarito do Aprendice. As 5 telas do simulado mostram esse texto, sem erro de console e sem rolagem lateral. |
| dados-2 R3 | Aplicar o gabarito definitivo de ime/ufrr | não verificado | Pendência do dono: a rede bloqueia os editais (`dados-correcoes.md`). |

## 2. Achados novos

**N1. Privacidade aberta pelas Configurações: "Voltar" leva ao Perfil, não às Configurações.**
- **Tela:** `#/config` → link "Privacidade" → "Voltar", nas 8 combinações (4 larguras × 2 temas).
- **O que está errado:** o link novo da correção R2 abre a Privacidade, mas o Voltar da página está fixo em `/perfil`. Medido nas 8 combinações: depois do Voltar, a tela é `#/perfil`. Quem veio das Configurações cai numa tela de onde não saiu.
- **Onde:** `app/src/telas/Privacidade.tsx:17` (`const voltar = … '/perfil'`) e a linha 50.
- **Como corrigir:** voltar para a tela de origem. Por exemplo, o link das Configurações passa `state={{ de: '/config' }}`, e a Privacidade usa esse valor, ou `navigate(-1)` quando houver histórico. Sem origem, continua `/perfil`.
- **ERRO** (navegação).

**N2. Figuras de Biologia no escuro: 51 textos em 20 figuras ainda abaixo de 4,5:1.**
- **Tela:** `/m/bio/tema/<B..>?aba=teoria`, tema escuro, todas as larguras.
- **O que está errado:** a paleta escura que a própria figura traz só teve um tom corrigido (`#6C7DF0` → `#7989F1`). Sobram:
  - vermelho `#F0566E` sobre o cartão escuro, 4,22:1: "✗" em Comparação de células (B01), "parada" no código genético (B05), "47,XX ou XY,+21" nas aneuploidias (B04), "A"/"AB" no ABO (B06), "+ / −" nas relações ecológicas (B09), "1A 1V" nos vertebrados (B07);
  - letra escura `#0F1529` sobre forma colorida:
    - "consumidores 3º" e "10 kcal" na pirâmide de energia (B09), 3,32:1;
    - "II" na cadeia respiratória (B03), 3,31:1;
    - "A" e "B" no cromossomo vermelho do Linkage (B06) e "E" nas alterações cromossômicas (B04), 3,93:1;
    - "G2" e "~4 h" no ciclo celular (B04), 4,41:1;
    - "T" no pareamento de bases (B02), 4,26:1;
  - cinza `#9AA0BD` sobre forma colorida, 4,1–4,3:1: "(estroma)" (B03), "(parede mais espessa)" (B07), legenda do efeito estufa (B09);
  - azul "O₂ → H₂O" (B03), 3,87:1, e "O₂" na hematose (B07), 3,89:1.
- Menor valor medido: 3,21:1. Nos prints se lê, mas fica abaixo do mínimo pedido. As outras 163 figuras passam. Os casos de 1,1:1 que o script marcou ("núcleo", "O/H" da água) são texto sobre degradê claro e passam no print.
- **Onde:** `AJUSTE_ESCURO` em `app/src/logica/figuraEscura.ts:16`.
- **Como corrigir:** no mesmo ajuste, clarear o vermelho de texto (ex.: `#F36B80` ou mais claro, ≥ 4,5:1 sobre o cartão) e o cinza de texto. Para letra escura sobre forma colorida, escurecer um pouco a forma ou clarear a letra só nessas regras. Ampliar `figuraEscura.test.ts` para medir todos os textos sobre a forma de baixo.
- **ERRO** (contraste).

**N3. Fração em linha que sobrou numa correção de Matemática: "2·[1]/(4·[3])".**
- **Tela:** `#/m/mat/q/Pba9549df` (PUC-Campinas 2025, q. 25), "Por que as outras estão erradas", alternativa C, todas as larguras. Visto no print de 1280 claro.
- **O que está errado:** em "com x = 1 a expressão vale 2·[1]/(4·[3]) = 2/12 = 1/6", o "2/12" e o "1/6" empilham, mas "2·[1]/(4·[3])" fica na linha. O detector não aceita colchete no numerador. Não vem desta correção: o detector anterior faz o mesmo.
- **Onde:** dado em `app/public/conteudo/mat/res/M07.3.json`, `Pba9549df.erradas.C`; detector em `app/src/logica/fracao.ts` (`barras`, numerador com "[ ]").
- **Como corrigir:** escrever no dado "(2·1)/(4·3)", que o detector já empilha, ou ensinar o detector a aceitar um grupo entre colchetes no numerador.
- **ERRO** (fração em linha).

## 3. Conferido e passou
- **Console e rede:** nenhum erro nas telas abertas (casca, figuras, correções e simulados).
- **Rolagem lateral:** nenhuma.
- **Busca:** Fechar com o mesmo desenho (quadrado de 40 px, cantos arredondados) em todas as larguras.
- **Legendas:** a fração do expoente e do índice fica dentro da linha, sem abrir a entrelinha nem cobrir a figura.
- **Frações de conta em Mat/Fís:** nenhuma deixou de empilhar com a correção dos dados (0 trechos de conta entre os 44 de Mat/Fís que mudaram).

Total: 3 ERROS, 0 DECISÕES DO DONO
