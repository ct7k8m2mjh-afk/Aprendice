# Super revisão — Português (SR-3)

Protocolo: `PROTOCOLO.md`. Agentes: `instrucoes-agentes.md`. Ferramenta: `ferramentas/resolucoes/sr3.py`
(`subs por` lista os conteúdos; `lote por <sub> <k>` monta o lote k de 15; `aplica <correcoes.json>` grava no arquivo-fonte).
Achados: `por-achados.jsonl` (uma linha por achado). Arquivos de trabalho (fora do git): `trabalho/`.

Total: 4.987 questões com resolução em 57 conteúdos (P01.1 … P12.5), na ordem de `sr3.py subs por`;
dentro do conteúdo: ENEM, provas-alvo, demais; nível básico → avançado.

CONTINUAR DE: P01.1 — lotes 1–3 gravados; 4–12 em andamento (ver `trabalho/por-P01.1-*`; lote sem
`.final.json` ainda não foi gravado: refazer a partir do arquivo que faltar).

Fluxo de cada lote (`sr3.py`): `lote` → professor (`.professor.json`) + aluno em 2 etapas (`.aluno-1/2.json`) →
corretor (`.correcoes.json`, `.rejeitados.json`, `.dados.json`, `.gabarito.json`) → `aplica --seco` → professor novo
(`.conferencia.json`) → `final` (usa o texto do professor novo onde ele reprovou) → `aplica` → `registra` → commit.

## Andamento por conteúdo
| Conteúdo | Questões | Lotes feitos | Corrigidas | Achados (erro/clareza) | Crítico de tela |
|---|---|---|---|---|---|
| P01.1 | 245 | 1–3 de 17 | 68 correções | ver jsonl | em andamento |

## Gabaritos para a coordenação (anular / errata)

## Dados da prova para a coordenação (não se altera print/enunciado nesta revisão)
- Pa65cc39c (PUC-Campinas 2027 q2): o texto-base "A era da facilidade" (está na q1, P567a40b3) falta no print e na
  transcrição desta questão; sem ele não dá para resolver. Refazer o print com `ferramentas/ingestao/refaz_print.py`.
- Transcrições com lixo (o crítico de tela diz se o aluno as vê): ver `por-achados.jsonl`, papel "dados".

## Pendências do dono
