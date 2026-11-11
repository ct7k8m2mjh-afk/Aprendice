# Provas de 2020 a 2026 que ainda faltam, por instituição e ano

Regras (CLAUDE.md, princípios 1, 2 e 10): só entra prova com caderno + gabarito oficial DEFINITIVO, só questões de
múltipla escolha; anuladas ficam fora; a origem de cada arquivo fica registrada no `prova.json` (campo `origem`).

## Grupo C (UECE, UEPG, Unioeste, Unimontes, UVA, UEMG, UNEB, EMESCAM, Bahiana, UESB) — 11/11/2026

Material: `fontes/provas-manuais/<sigla>/` (links do dono, Brasil Escola) + gabaritos definitivos procurados no site
oficial quando o pacote só trazia o preliminar. Configuração: `ferramentas/ingestao/provas_grupo_c.py`.

### Entraram nesta rodada

| Prova (id) | Questões válidas | Observação |
|---|---|---|
| UECE 2020.2 (`uece-2020-2`) | 80 de 85 | 1ª fase, gabarito 1, inglês; Comunicado 48/2020 (definitivo); 16, 27, 36, 48 e 62 anuladas. |
| UECE 2021.1 (`uece-2021-1`) | 81 de 85 | 1ª fase; Comunicado 31/2021; 28, 34, 47 e 53 anuladas. |
| UECE 2022.1 (`uece-2022-1`) | 84 de 85 | 1ª fase; Comunicado 75/2021; 9 anulada. |
| UECE 2022 – Vestibular Especial EaD (`uece-ead-2022`) | 45 de 45 | Cursos a distância; Comunicado 139/2022 (definitivo). |
| Unimontes 2024 – PS 1/2024 (`unimontes-2024-ps1`) | 43 de 45 | Processo Seletivo 1/2024 (prova de 10/12/2023), Grupo 1, caderno 101 (Biológicas); gabarito após recursos baixado do site da Coteps; 23 e 26 anuladas. |
| Unimontes PAES 2020 – 3ª etapa (`unimontes-paes3-2020`) | 48 de 50 | Caderno 3 (Biológicas), prova de 19/12/2021; gabarito após recursos; 12 (inglês) e 43 anuladas. |
| Unioeste 2021 (`unioeste-2021`) | 73 de 77 | 1ª etapa (manhã, caderno do inglês, 1–21) + 2ª etapa (tarde, aqui 22–77); gabarito definitivo; 3, 10, 50 e 74 anuladas. |
| Unioeste 2022 (`unioeste-2022`) | 72 de 77 | Idem; 5, 16, 52, 70 e 76 anuladas (as "alteradas" após recurso entram com a letra nova). |
| UEMG 2024 (`uemg-2024`) | 47 de 48 | Conhecimentos Gerais, inglês; gabarito definitivo; 24 anulada. |

Conferência: folha de contato e prints suspeitos abertos em todas; letras das alternativas e texto depois da última
alternativa por programa. Auditoria separada (outra sessão, 11/11): gabarito das 9 provas inteiras conferido com o
oficial definitivo (tudo igual, anuladas iguais); na amostra de 80 questões achou 13 classificações a corrigir
(corrigidas), o texto compartilhado da UECE indo só para a 1ª questão do grupo (corrigido: agora vale até o próximo
texto ou seção, e a questão que cita outro texto o leva também — corrigido também na UECE 2024.1, da rodada 6) e o quadro
de anotações vazio à direita nas páginas de uma coluna da Unioeste (cortado). Colchetes e fios de diagramação da
Unioeste continuam no print (são do caderno).

Já estavam no site e não foram duplicadas: UECE 2024.1, Unimontes 2024 (Edital 4/2024) e 2025 (Edital 4/2025 — é o
pacote "Unimontes 2026" do Brasil Escola), UVA 2024.1, 2025.1 e 2026.1.

### O que ainda falta e por quê

| Instituição | Anos (2020–2026) que faltam | Motivo |
|---|---|---|
| UECE | 2020.1 | Link do Brasil Escola quebrado (404); sem caderno. |
| UECE | 2ª fase de 2020.2, 2021.1, 2022.1 e 2022.2 | Cadernos e gabaritos definitivos estão no pacote, mas são 7 cadernos de provas específicas por edição (~200 questões cada); ficaram para a próxima rodada. |
| UECE | 2022.2 (1ª fase) | O pacote traz só o gabarito definitivo da 2ª fase; o definitivo da 1ª fase não veio (nem foi achado no site da CEV). |
| UECE | 2023.1, 2023.2, 2024.1 (2ª fase), 2024.2, 2025.1 (1ª e 2ª fase), 2025.2, 2026.1; EaD 2023.2; UAB 2020 | Só gabarito PRELIMINAR (no pacote e no site da CEV, onde a busca só achou o definitivo da 2024.1). 2024.2: nem caderno. |
| UEPG | todos (vestibular 2020–2024, Outono/Primavera 2021, PSS 2020–2025, EaD 2020) | Questões de somatória (01, 02, 04, 08, 16): formato fora do site (decisão do dono). |
| Unioeste | 2020 | Link quebrado (404). |
| Unioeste | 2023, 2024, 2025, 2026 | Só gabarito provisório/preliminar no pacote (o site da Unioeste é proibido pelo robots.txt; não acessado). |
| Unimontes | Vestibular Próprio 2020–2023; PAES 1ª e 2ª etapas | Vestibular 2020–2023 não está no pacote. PAES: só a 3ª etapa entra (como UFJF PISM III, UPE SSA 3). Os outros cadernos (Exatas, Humanas, Sociais) das mesmas edições não foram somados: o site guarda um caderno por edição (Biológicas). |
| UVA | 2020.1, 2020.2, 2021 (Ibiapaba), 2022.1, 2023.1, 2022.2–2026.2 | 2020.1: link 404. 2020.2, Ibiapaba 2021 e 2022.1: só gabarito PRELIMINAR e caderno só em imagem. 2023.1: caderno só em imagem. Seleções 2022.2–2026.2 sem caderno publicado. |
| UEMG | 2022 | O gabarito do pacote não diz se é preliminar ou definitivo (sem anuladas nem data de recursos): fora até confirmar. |
| UEMG | 2020, 2021, 2023, 2025, 2026 | Não estão no pacote (vestibular.uemg.br bloqueia acesso automático). |
| UNEB | 2022, 2023 | Caderno + gabarito pós-recursos/definitivo baixados (`fabrica_saida/ingestao/uneb-*`), mas a diagramação mistura duas colunas, textos, imagens e páginas de largura total; o recorte troca pedaços entre questões (tentativa da rodada 6). |
| UNEB | 2024, 2025 | Pacote é o "caderno matriz" com "(Correta: X)" impresso em cada questão; não há gabarito definitivo publicado à parte (só no sistema com Cloudflare). 2025: caderno só em imagem. |
| UNEB | 2020, 2021, 2026 | 2020: link 404; 2021 e 2026 não estão no pacote. |
| EMESCAM | 2022/1, 2022/2 | Gabarito sem indicação de definitivo (mesma decisão da rodada 6). |
| EMESCAM | 2020, 2021, 2023–2026 | Não estão no pacote (2024+ só no sistema da Fundep, com Cloudflare). |
| Bahiana | 2020–2026 | Pacote só com gabaritos PRELIMINARES (2021/1, 2021/2, Prosef 2022/1, 2022/2) e sem caderno; 2020: 404. |
| UESB | 2020–2026 | 2020: gabarito definitivo sem caderno; 2022: gabarito preliminar sem caderno; demais anos não estão no pacote. |
