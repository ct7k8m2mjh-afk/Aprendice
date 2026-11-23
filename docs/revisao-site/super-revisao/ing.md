# Super revisão — Inglês (coordenação)

Protocolo: `PROTOCOLO.md`. Agentes: `instrucoes-agentes.md`. Ferramenta: `ferramentas/resolucoes/sr3.py`
(`subs ing`, `lote ing <sub> <k>`, `aplica <correcoes.json>`). Achados: `ing-achados.jsonl` (uma linha por achado).

Total no site: 2.506 questões de Inglês com resolução, em 32 conteúdos (I01.1 … I04.6), na ordem de `sr3.py subs ing`;
dentro do conteúdo: ENEM, provas-alvo, demais; nível básico → avançado.

**Como esta sessão trabalhou (23/11/2026).** Nesta sessão a ferramenta Agent não estava disponível, então os papéis de
professor, aluno, crítico de tela e professor novo foram feitos pela própria sessão, em passadas separadas (o aluno
responde cada questão antes de abrir a correção; a conferência das mudanças é uma passada à parte, contra o print).
Isso não cumpre a regra "agente separado" do PROTOCOLO: as correções gravadas aqui devem passar por um professor
novo (agente separado) na próxima sessão de Inglês. Além dos lotes, a sessão rodou varreduras automáticas nas 2.506
resoluções (formato da resposta, letras de `erradas`, palavras proibidas, emoji, tipo dos passos, citação entre aspas
contra o texto da prova, questão sem o texto-base) — resultados abaixo.

Site local para conferir: o build de `app/public/conteudo/ing` foi baixado do site no ar (é igual ao build local) e
as resoluções corrigidas foram reconstruídas das fontes com a mesma regra do `converte.py` (`provas_fonte`); as
demais 2.499 resoluções reconstruídas saíram idênticas ao site, o que confirma a regra.

CONTINUAR DE: I01.1 lote 5

## Andamento por conteúdo
| Conteúdo | Questões | Lotes feitos | Corrigidas | Achados (erro/clareza) | Crítico de tela |
|---|---|---|---|---|---|
| ENEM (todos os conteúdos) | 30 | 2 (as 30 do ENEM) | 3 | 0/15 | P6f46b634, P261ed021: sem rolagem lateral, sem erro no console |
| I01.1 | 132 | 4 (q 1–60) | 23 (+2 da mesma prova em I01.5 e I02.1) | 0/49 | P0fea2fcf, Pf3356411, Pf0fcfc0b, Pdfb39a5b, P2364d7a9: sem rolagem lateral, sem erro no console; achado de texto-base (abaixo) |

## Achados que valem para o site todo (tela e conteúdo da questão)

### 1. Questão sem o texto em que se baseia (o aluno não consegue responder)
O print destas questões traz só o comando e as alternativas; o texto está no print de outra questão da mesma prova
ou só no PDF oficial (a caixa `docs/resolucoes/caixa/ing.md` já registrava parte delas como PRINT). No site, o aluno
vê "This text is about:" sem texto nenhum. Achadas por varredura (print baixo + resolução que cita texto que não está
na questão) e conferidas a olho no print; pode haver outras. Precisa de decisão de como mostrar o texto-base (recortar
o texto do PDF para cada questão do grupo, ou o site mostrar junto o print da questão que tem o texto).
- acafe-2025-verao: Pdca57eca (q21, I03.8)
- cmmg-2023-1: P82492451 (q55, I01.3), Pe7d63db6 (q54, I01.3)
- puccampinas-2027: P0495ba7f (q21, I02.1), P91941880 (q16, I03.2), Pb8f8d9ee (q18, I01.3), Pc04834dd (q20, I01.3)
- udesc-2020-1: P49ea17ab (q34, I01.3), P76d62aa0 (q33, I02.1), Pe5b4512d (q35, I01.3)
- udesc-2023-2: P0ed25cb6 (q36, I03.6)
- udesc-2024-2: Pf0fcfc0b (q35, I01.1)
- udesc-2025-1: Pd2a1071b (q32, I01.3)
- udesc-2025-2: P7fb59ce4 (q31, I01.4)
- uece-2025-2: P09cadc2b (q85, I01.3), P2a5d9564 (q81, I01.3), P47d12c7d (q83, I01.3), Pc8920343 (q84, I01.3), Pcbb2a2aa (q78, I01.3), Pe4d0db1b (q79, I01.3), Pfe6f376c (q80, I01.3)
- uece-2026-1: P2924ee9f (q82, I01.3), P45b10618 (q79, I01.3), P523134b9 (q84, I01.3), P52d5be57 (q78, I01.3), P6ca01ffd (q81, I01.3), P8e288415 (q80, I01.3), Pcf4bf745 (q83, I01.3)
- uema-paes-2021: P415f0b80 (q10, I01.3), Pc019f662 (q12, I03.4), Pd50acc6f (q56, I03.2), Pdb725a03 (q54, I01.3), Pe3636adf (q9, I01.3), Pe3f188ad (q53, I01.3)
- uema-paes-2022: P9abff0e2 (q18, I01.3), Pbd105de7 (q16, I01.8)
- uema-paes-2024: P5ccce71c (q16, I01.4), Pab875f4b (q19, I03.8), Paba1ff99 (q17, I03.8)
- uema-paes-2026: P3ade0003 (q16, I01.4)
- uerr-2026: P0c3bf8a5 (q13, I01.3)
- ufrr-2024: P9e4fe442 (q71, I01.6)
- ufrr-2026: P315368d9 (q65, I01.1), P6b2fc5e3 (q66, I03.8), Pffee7437 (q72, I01.8)
- unespar-2023: P4ace9dcd (q1, I01.3), P62ca9403 (q3, I01.3), Pe92ce2de (q4, I01.2)
- unirg-2024-1: P5849ee3c (q12, I01.8)

### 2. Transcrição sem o texto-base (o texto está no print, mas o site mostra a transcrição)
Nestas 32 questões o site mostra a transcrição (`transcricao` em `prova.json`), que tem só o comando e as
alternativas; o texto-base, que está no print, fica escondido atrás de "Ver a questão original". Correção: completar
a transcrição com o texto-base (camada de texto da prova, organizada como a banca) ou, até lá, mostrar o print.
- acafe-2026-inverno: Pf1e9932a (q18, I01.3), P0fea2fcf (q15, I01.1), P38e23de8 (q19, I01.7), P9479f13e (q20, I01.4), P8e0f1e6c (q21, I02.4), P9e215314 (q17, I02.1)
- cederj-2020-1: P720a6387 (q57, I01.3), P82033e67 (q58, I01.3), P822f7a73 (q59, I01.3)
- cederj-2022-2: Pc3329622 (q44, I01.3), P22a52db2 (q45, I01.4)
- cederj-2023-1: Pf5d540d9 (q43, I01.3), P5193e474 (q44, I01.3), Pa8195da1 (q45, I01.6)
- cederj-2024-1: Pf7da726a (q43, I01.2), P283de0e7 (q45, I03.8)
- cederj-2025-1: P9d3ec10c (q44, I01.3), Pbdc86abd (q45, I01.3)
- cederj-2025-2: Pd0f594c1 (q43, I01.1), P181d5b60 (q45, I03.2)
- mackenzie-2027-1: Pa123bbc9 (q10, I01.3)
- pucrio-2024: P7316b7a6 (q5, I03.1), Pd63c81dc (q8, I03.1), P701f2d3c (q9, I03.3), P152a9843 (q6, I03.2), Pe4ced206 (q3, I01.4), P003efde3 (q4, I01.4), P84d06cbf (q10, I01.4), Pc2062609 (q2, I02.4), P8d782e90 (q1, I01.2), Pfde01aa0 (q7, I02.1)
- uel-2025: P97fbb5dd (q4, I03.2)

## Varreduras automáticas (2.506 resoluções)
- Resposta fora do padrão "Alternativa X — …": 5 (todas de São Camilo 2024 2º sem.) — corrigidas.
- Passo com `tipo` inválido ("interpretar"): 2 — corrigidos. Passo `concluir` com `conta` vazia: 3 — corrigidos.
- `erradas` com letras faltando ou sobrando: 0. Resposta com letra diferente do gabarito: 0. Emoji: 0. Site didático: 0.
- Palavras proibidas nas `erradas`: 2 falsos positivos ("(talvez)" traduzindo "Perhaps"; "chutes" = pontapés).
- Citação entre aspas que não bate com o texto da questão: 268 trechos em 188 questões com palavra diferente; a
  maioria é camada de texto ruim (ligaduras, imagem, colunas). Lista em revisão nos lotes (os casos reais entram como
  achado do lote).
- Passo de comparação com "porque" genérico ("D é a única que confere com o trecho; A toma um detalhe pelo todo…"):
  301 questões (URCA 72, Santa Casa 44, UNIRG 32, Unifesp 27, Einstein 23, UEG 22…). Não dizem por que a alternativa
  errada atrai; corrigir nos lotes de cada conteúdo.

## Gabaritos para a coordenação (anular / errata)
- (nenhum até aqui)

## Pendências do dono
- Itens 1 e 2 acima (texto-base que o aluno não vê): decidir como o site mostra o texto-base das questões em grupo.
