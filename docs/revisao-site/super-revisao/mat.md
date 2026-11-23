# Super revisão — Matemática (sessão SR-1)

Roteiro: `PROTOCOLO.md`; papéis dos agentes: `papeis-sr1.md`; ferramenta: `ferramentas/super-revisao/sr.py`
(`subs mat` dá a ordem; `lote mat <sub> <k>` monta o lote; `aplica <patch>` grava no arquivo-fonte).
Resolução antiga do protótipo (552 questões de Mat): a correção vai para `app/conteudo-fonte/correcoes-res/mat.json`
(o `converte.py` aplica por cima; `app-atual/` não se altera).

Ciclo de cada lote (até 15 questões do mesmo conteúdo): professor + aluno (etapa 1) em paralelo → aluno etapa 2 →
corretor escreve `<lote>.patch.json` → `sr.py aplica` → professor novo confere as mudanças → (refaz) → commit por
conteúdo. Crítico de tela por conteúdo.

## Andamento (conteúdo: lotes, questões, achados, correções)

| Conteúdo | Achados | Corrigidos | Questões corrigidas | Gabarito checado |
|---|---|---|---|---|
| M01.1 | 31 | 29 | 15 | 0 |
| M01.2 | 58 | 52 | 21 | 2 |
| M01.3 | 67 | 65 | 18 | 1 |

Conteúdos completos e no ramo: M01.1 (20 questões), M01.2 (26), M01.3 (21). Gabaritos suspeitos checados: todos
confirmados (oficial vale; ponto sutil no `alerta`). Crítico de tela: M01.1 em andamento.

## Gabarito para a coordenação (anular / errata)

## CONTINUAR DE: M01.4
Em andamento (arquivos em `trabalho/`, fora do git): M01.4 lotes 1–3 (patches prontos, conferência do professor novo
pendente; lote 1 com 1 item a refazer), M01.5 lote 1 (falta o professor) e lote 2 (patch pronto, falta conferência).
Se os arquivos de `trabalho/` sumirem, refaça M01.4 e M01.5 desde o `sr.py lote`.
