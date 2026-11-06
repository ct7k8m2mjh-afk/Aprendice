# Lote 2 de provas — o que entrou e o que ficou para a próxima rodada (06/11/2026)

Fonte dos links: `inventario-publicas-1.json`, `inventario-publicas-2.json` e `inventario-privadas.json`.
Só entram edições com caderno + gabarito oficial e download livre; anulada ou sem gabarito oficial fica fora.

## Entrou no site

| Prova | Questões válidas | Observação |
|---|---|---|
| FMABC 2020, 2021, 2022, 2023, 2024 | 80 cada | Cadernos e gabaritos oficiais da Vunesp publicados pela FMABC. |
| FMABC 2025 | 78 | Questões 65 e 66 anuladas ("N" no gabarito oficial). |

## Baixado, mas não integrado nesta rodada (motivo técnico)

- **Fatec (2020/1, 2022/2, 2023/1–2026/2):** cadernos e gabaritos baixados em `fabrica_saida/ingestao/fatec-*` e
  configurados em `ferramentas/ingestao/provas.py` (gabarito já lido com a disciplina de cada questão). Ficou de fora
  porque o caderno mistura páginas de uma e de duas colunas e questões ao lado de figuras; o recorte automático corta
  parte das questões nessas páginas. Precisa de ajuste página a página antes de ir ao ar.
- **Cederj (2020.1–2026.2):** baixado em `fabrica_saida/ingestao/cederj-*`. Duas colunas, números de linha dos textos
  parecidos com número de questão (o recorte já distingue pelo negrito), língua estrangeira repetida (43–45 em espanhol
  e em inglês) e 2020.2 publicado só como imagem. Falta a leitura do gabarito por coluna e a regra "vale a última
  ocorrência" (inglês).
- **UTFPR, UERR, PUCRS:** baixados (`fabrica_saida/ingestao/utfpr-*`, `uerr-*`, `pucrs-*`; UTFPR 2025 e PUCRS 2025 com
  falha de conexão no download — repetir). Não houve tempo de configurar o layout.

## Não iniciado nesta rodada

UEG (geral e Medicina), UFJF (PISM III), UEMA (PAES), UFSM, UNEMAT, Unimontes, Unespar, Unicentro, UNIRG, Unitins,
URCA, UVA, PUC-Rio, PUCPR, PUC Minas, Mackenzie, Fempar, FGV, Mauá e EMESCAM. As observações do inventário continuam
valendo (ex.: PUCPR — o arquivo oficial é o caderno com a resposta destacada em azul: o print precisa apagar o destaque;
Unicentro 2026/2027 — caderno "com respostas"; PUC-Rio — objetivas e discursivas misturadas por grupo; EMESCAM 2024+ e
Fempar 2027 — baixar à mão ou aguardar gabarito definitivo).

## Formato fora de A–E/A–D

UFSC (somatória) registrada em `formatos-pendentes.md`.
