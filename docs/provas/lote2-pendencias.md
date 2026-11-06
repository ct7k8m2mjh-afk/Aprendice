# Lote 2 de provas — o que entrou e o que ficou para a próxima rodada (06/11/2026)

Fonte dos links: `inventario-publicas-1.json`, `inventario-publicas-2.json` e `inventario-privadas.json`.
Só entram edições com caderno + gabarito oficial e download livre; anulada ou sem gabarito oficial fica fora.

## Entrou no site

| Prova | Questões válidas | Observação |
|---|---|---|
| FMABC 2020, 2021, 2022, 2023, 2024 | 80 cada | Cadernos e gabaritos oficiais da Vunesp publicados pela FMABC. |
| FMABC 2025 | 78 | Questões 65 e 66 anuladas ("N" no gabarito oficial). |

## Rodada 2 do lote 2 (06/11/2026, em andamento — ver lista ao fim deste arquivo)

### Fatec (2020/1, 2022/2, 2023/1–2026/2): recortada e classificada
- Recorte resolvido com o modo `'colunas': 'faixas'` (recorta.py): a página é dividida em faixas de largura total e faixas
  de duas colunas (a coluna esquerda pode ser estreita, ao lado de figura); figura de largura total nunca é dividida.
  A instrução "Leia o texto..." numa faixa cinza entra inteira (`suporte_caixa`); rodapé "VESTIBULAR" fica fora.
- **2023/1:** o link "Fatec_Gabarito_2023_retificado.pdf" da página oficial é o gabarito do 2º sem/2013 (não confere com
  o caderno). Usado o gabarito oficial do dia (`Gabarito-Vestibular-1sem-2023.pdf`, baixado como `gabarito-original`).
- **2025/1** (banca Idecan, duas colunas): textos das multidisciplinares vêm antes da questão, com título centralizado
  (`suporte_titulo`).

### Cederj (2020.1, 2021.2–2026.2): recortada e classificada
- Duas colunas; número da questão em negrito (os números de linha dos textos não são); "Texto N" vale para todas as
  questões até o próximo texto ou seção (`suporte_secao`); espanhol sai antes do filtro de sequência
  (`pular_antes_sequencia`), fica a do inglês; "Espaço reservado para rascunho" e a redação encerram a questão.
- **Fora:** 2020.2 (caderno só em imagem) e 2021.1 (camada de texto corrompida) — configuradas com OCR em `provas.py`,
  mas o layout irregular não foi conferido; 2022.2 questão 24 (gabarito oficial "S", sem letra) e 2026.1 questão 10 (anulada).

## Baixado, mas não integrado nesta rodada (motivo técnico)

- ~~**Fatec**~~ (resolvido na rodada 2, acima). Texto antigo: cadernos e gabaritos baixados em `fabrica_saida/ingestao/fatec-*` e
  configurados em `ferramentas/ingestao/provas.py` (gabarito já lido com a disciplina de cada questão). Ficou de fora
  porque o caderno mistura páginas de uma e de duas colunas e questões ao lado de figuras; o recorte automático corta
  parte das questões nessas páginas. Precisa de ajuste página a página antes de ir ao ar.
- ~~**Cederj**~~ (rodada 2, acima). Texto antigo: baixado em `fabrica_saida/ingestao/cederj-*`. Duas colunas, números de linha dos textos
  parecidos com número de questão (o recorte já distingue pelo negrito), língua estrangeira repetida (43–45 em espanhol
  e em inglês) e 2020.2 publicado só como imagem. Falta a leitura do gabarito por coluna e a regra "vale a última
  ocorrência" (inglês).
- **UTFPR, UERR, PUCRS (ainda não integrados — próxima prova a fazer):** UTFPR 2025 re-baixada (caderno e gabarito
  íntegros agora). UERR é Cebraspe A–E (letras sem parênteses, "A texto"); o gabarito tem as questões 10 e 11 duas vezes
  (opção de língua) — conferir no caderno qual bloco é o inglês antes de configurar. PUCRS 2025 já está íntegra no disco.
  Texto antigo: baixados (`fabrica_saida/ingestao/utfpr-*`, `uerr-*`, `pucrs-*`; UTFPR 2025 e PUCRS 2025 com
  falha de conexão no download — repetir). Não houve tempo de configurar o layout.

## Não iniciado nesta rodada

UEG (geral e Medicina), UFJF (PISM III), UEMA (PAES), UFSM, UNEMAT, Unimontes, Unespar, Unicentro, UNIRG, Unitins,
URCA, UVA, PUC-Rio, PUCPR, PUC Minas, Mackenzie, Fempar, FGV, Mauá e EMESCAM. As observações do inventário continuam
valendo (ex.: PUCPR — o arquivo oficial é o caderno com a resposta destacada em azul: o print precisa apagar o destaque;
Unicentro 2026/2027 — caderno "com respostas"; PUC-Rio — objetivas e discursivas misturadas por grupo; EMESCAM 2024+ e
Fempar 2027 — baixar à mão ou aguardar gabarito definitivo).

## Formato fora de A–E/A–D

UFSC (somatória) registrada em `formatos-pendentes.md`.

## Rodada 2 — situação ao parar (06/11/2026)

Integradas e classificadas (matéria, tema, conteúdo, nível; sem resolução): Fatec 10 provas (560 questões) e Cederj
12 provas (552 questões). Conferência: alternativas A–E/A–D presentes no texto de todas, nada de texto de apoio vazando
depois da última alternativa, amostra visual de 10% dos prints e da classificação; simulado conferido em Fatec 2025/1,
Cederj 2024.1 e Fatec 2022/2 (computador claro, 390 px claro e escuro). `converte.py` + `vitest` passando.

Correção que afeta todas as provas que usam `apagar` (só a Fatec usa): a pintura de branco agora só vale no alto/pé da
página — antes um número solto ("1", "6") no meio da página era apagado (sumiam frações, eixos e células de tabela).

Ferramentas novas em `recorta.py` (opcionais, por prova): `colunas: 'faixas'`, `suporte_caixa`, `suporte_titulo`,
`rodape_rx`, `suporte_secao`, `pular_antes_sequencia`, `secao_sem_marcador`, `texto_n_sem_faixa`.

**Falta (nesta ordem):** UTFPR, UERR, PUCRS; depois UEG (geral e Medicina), UFJF (PISM III), UEMA (PAES), UFSM, UNEMAT,
Unimontes, Unespar, Unicentro, UNIRG, Unitins, URCA, UVA, PUC-Rio, PUCPR, PUC Minas, Mackenzie, Fempar, FGV, Mauá, EMESCAM.
Cederj 2020.2 e 2021.1 (OCR) também ficam para depois.
