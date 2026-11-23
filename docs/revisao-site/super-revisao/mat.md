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

## Tela (crítico por conteúdo)

- M01.1 (Pf4d505e1, Pf4d505e1, Ped0907b5): 4 blocos completos e animação até o fim em 390/1280, claro/escuro, sem
  rolagem lateral nem erro no console. Dado corrigido: colchetes em volta de frações empilhadas (Pf4d505e1).
- **Para a coordenação (código do motor, vale o site todo; mexe no visual, por isso não mudei sem o dono):**
  (a) o destaque do resultado final sai deslocado quando o resultado é um número isolado no fim da linha (Ped0907b5,
  passo "Raiz", "5"); (b) quando o passo não tem `nota`, o motor mostra o `faz` como nota ao lado da conta, repetindo
  o título do passo (Ped0907b5, todos os passos; Pf4d505e1 mostra "resposta" solto).

## Gabarito para a coordenação (anular / errata)

- **anular** E109d981 (M02.1; questão antiga do protótipo): ao pé da letra o enunciado dá 365 pares (teto de 1 200 valendo para as mortas, 40% de vivas), que não está entre as alternativas; o oficial C (205) só sai torcendo o teto para o total ou lendo os 40% como vivas sobre mortas. Conferido por dois professores (corretor e professor novo). A resolução ficou com o oficial e o alerta, à espera da decisão.

## CONTINUAR DE: M01.4
Em andamento (arquivos em `trabalho/`, fora do git): M01.4 lotes 1–3 (patches prontos, conferência do professor novo
pendente; lote 1 com 1 item a refazer), M01.5 lote 1 (falta o professor) e lote 2 (patch pronto, falta conferência).
Se os arquivos de `trabalho/` sumirem, refaça M01.4 e M01.5 desde o `sr.py lote`.
