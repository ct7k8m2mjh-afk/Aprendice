# Super revisão — Português (SR-3)

Protocolo: `PROTOCOLO.md`. Agentes: `instrucoes-agentes.md`. Ferramenta: `ferramentas/resolucoes/sr3.py`
(`subs por` lista os conteúdos; `lote por <sub> <k>` monta o lote k de 15; `aplica <correcoes.json>` grava no arquivo-fonte).
Achados: `por-achados.jsonl` (uma linha por achado). Arquivos de trabalho (fora do git): `trabalho/`.

Total: 4.987 questões com resolução em 57 conteúdos (P01.1 … P12.5), na ordem de `sr3.py subs por`;
dentro do conteúdo: ENEM, provas-alvo, demais; nível básico → avançado.

CONTINUAR DE: P01.1 — lotes 1–8 gravados; 9–12 com correções prontas (falta professor novo → final → aplica);
13–15 com professor e aluno prontos (falta corretor); 16–17 abertos (falta professor e aluno); crítico de tela
de P01.1 por fazer. Lote sem `.final.json` ainda não foi gravado: refazer a partir do arquivo que faltar.
Regra da coordenação (23/11, 8h20): no máximo 4 agentes ao mesmo tempo; ALUNO e CRÍTICO DE TELA com model "sonnet".

Fluxo de cada lote (`sr3.py`): `lote` → professor (`.professor.json`) + aluno em 2 etapas (`.aluno-1/2.json`) →
corretor (`.correcoes.json`, `.rejeitados.json`, `.dados.json`, `.gabarito.json`) → `aplica --seco` → professor novo
(`.conferencia.json`) → `final` (usa o texto do professor novo onde ele reprovou) → `aplica` → `registra` → commit.

## Andamento por conteúdo
| Conteúdo | Questões | Lotes feitos | Corrigidas | Achados (erro/clareza) | Crítico de tela |
|---|---|---|---|---|---|
| P01.1 | 245 | 1–15 de 17 | 465 correções | ver jsonl | feito (ver acima) |
| P01.2 | 907 | 1 de 61 | 12 | ver jsonl | — |

## Gabaritos para a coordenação (anular / errata)

## Dados da prova para a coordenação (não se altera print/enunciado nesta revisão)
- Pa65cc39c (PUC-Campinas 2027 q2): o texto-base "A era da facilidade" (está na q1, P567a40b3) falta no print e na
  transcrição desta questão; sem ele não dá para resolver. Refazer o print com `ferramentas/ingestao/refaz_print.py`.
- Pa65cc39c é questão "só de texto" no site: o aluno vê o enunciado curto e as alternativas, o print fica recolhido em
  "Ver a questão original" e a resolução cita um texto que ele não vê (crítico de tela, 23/11). Achado mais sério de P01.1.
  O mesmo vale para P65667e3b (UFT 2024 q14, textos de apoio nas q12–13) e P7ee3116 (Fatec 2019: excerto fora do print).
- Transcrições com lixo (Pd557d698 acentos "N˜ao", P85033ae6, P8532034b, P224be698 vazia, P9d77bf0a/P4f117446 com outra
  coluna, P7ea629d0 versos juntados): o aluno vê o PRINT; o defeito só aparece em "Ver em texto (leitor de tela, busca)".
  Lista completa: `por-achados.jsonl`, papel "dados".
- Erros da própria prova (só registro): P45441d7f legenda dá Rembrandt 1682 (é 1632); P476d1428 fonte dá o "Pequeno
  Manual Antirracista" como 2009 (é 2019).

## Crítico de tela — P01.1 (23/11)
Correção em 4 blocos certa (errando de propósito), itálico da prova certo (Pc5375f39), sem erro de console e sem rolagem
lateral em 390 e 1280, claro e escuro. Observação: aberta pelo endereço direto, a barra mostra a posição no tema
("2 de 80"); dentro do conteúdo mostra a fila do conteúdo. Questão pendente (P25dfface, gabarito do Aprendice em preparação)
não aparece no site e saiu dos lotes (`sr3.py` agora ignora pendentes). Revisão, flashcards e teoria: não percorridos.

## Pendências do dono
